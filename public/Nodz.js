import {useEffect, useState, useRef, useCallback} from 'react'
import use_dynamic_refs from 'use-dynamic-refs'
import RenderNode from './RenderNode'
import recursive_reduce from './helpers/recursive-reduce'
import is_node from './helpers/is-node'
import calculate_node_layout from './helpers/calculate-node-layout'

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
    set_selected(n ? n.uid : null)
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
      }}
      ref={wrapper_ref}
      onClick={() => select_node(null)}
    >
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
          return (
            <RenderNode
              NodeType={node_types[node.node_type]}
              node={node}
              nodeinfo={Node.nodeinfo ? Node.nodeinfo(node) : {}}
              is_selected={selected === node.uid}
              node_styles={node_styles}
              add_node={add_node}
              select_node={select_node}
              ref={setRef(ref(node.uid))}
            />
          )
        })}
      </div>
    </div>
  )
}
