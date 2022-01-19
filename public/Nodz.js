import {useEffect, useState, useRef, useCallback} from 'preact/hooks'
import use_dynamic_refs from 'use-dynamic-refs'
import recursive_reduce from './helpers/recursive-reduce'
import is_node from './helpers/is-node'
import calculate_node_layout from './helpers/calculate-node-layout'

function ErrorNode({type}) {
  return (
    <div style={{width: '8rem'}}>
      Error: node type "{type}" not found in node_types
    </div>
  )
}

function ref(i) {
  return `${i}-ref`
}
function dummy_ref(i) {
  return `${i}-dummy-ref`
}

let uid_counter = 0
function uid() {
  return (uid_counter += 1)
}

export default function Nodz({node_types, graph, node_styles}) {
  const wrapper_ref = useRef()
  const [needs_layout, set_needs_layout] = useState(true)
  const [selected, set_selected] = useState(null)
  const [getRef, setRef] = use_dynamic_refs()

  const nodes_array = recursive_reduce(
    graph,
    (carry, n) => (is_node(n) ? carry.concat(n) : carry),
    [],
    'base_node',
  )
  nodes_array.forEach((n) => !n.uid && (n.uid = uid()))
  nodes_array.forEach((n) => (n.ref = getRef(ref(n.uid))))
  nodes_array.forEach((n) => (n.dummy_ref = getRef(dummy_ref(n.uid))))

  useEffect(
    () => {
      needs_layout && set_needs_layout(false)
    },
    [needs_layout],
  )
  useEffect(() => {
    window.addEventListener('resize', () => set_needs_layout(true))
    // window.addEventListener('keydown', (ev) => {
    //   console.log('//ev/', ev)
    // })
  }, [])

  if (!needs_layout) {
    calculate_node_layout(wrapper_ref, graph, nodes_array)
  }

  function add_node(ref) {
    const node = nodes_array.find((node) => node.ref === ref)
    !node.children && (node.children = [])
    const typenames = Object.keys(node_types)
    const t = typenames[Math.floor(Math.random() * typenames.length)]
    node.children.push({node_type: t})
    set_needs_layout(true)
  }

  function select_node(n) {
    set_selected(n.uid)
  }

  return (
    <div ref={wrapper_ref}>
      <div
        style={{
          width: '0',
          height: '0',
          overflow: 'hidden',
          position: 'absolute',
        }}
      >
        {nodes_array.map((node) => {
          const Node = node_types[node.node_type]
          return (
            <div
              ref={setRef(dummy_ref(node.uid))}
              style={{position: 'absolute'}}
            >
              <div style={{...node_styles(false)}}>
                {Node ? <Node /> : <ErrorNode type={node.node_type} />}
              </div>
            </div>
          )
        })}
      </div>

      <div>
        {nodes_array.map((node) => {
          const Node = node_types[node.node_type]
          const is_selected = selected === node.uid
          return (
            <div
              className="group"
              ref={setRef(ref(node.uid))}
              style={{
                position: 'absolute',
                paddingBottom: '21px',
                top: `${node.layout && node.layout.y}px`,
                left: `${node.layout && node.layout.x}px`,
              }}
            >
              <div
                className="hover-reveal"
                style={{
                  width: '14px',
                  height: '14px',
                  fontSize: '14px',
                  border: '1px solid black',
                  borderRadius: '10rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  position: 'absolute',
                  top: 'calc(100% - 1rem)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                }}
                onClick={() => add_node(node.ref)}
              >
                +
              </div>
              <div
                style={{
                  ...node_styles(is_selected),
                }}
                onClick={() => select_node(node)}
              >
                {Node ? <Node /> : <ErrorNode type={node.node_type} />}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
