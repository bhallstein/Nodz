import {useEffect, useState, useCallback, useRef} from 'react'
import use_dynamic_refs from 'use-dynamic-refs'
import RenderNode, {ErrorNode} from './RenderNode'
import Picker from './Picker'
import recursive_reduce from './helpers/recursive-reduce'
import is_node from './helpers/is-node'
import calculate_node_layout from './helpers/calculate-node-layout'
import recurse from './helpers/recurse'

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

export default function Nodz({node_types, graph, node_styles, CustomPicker}) {
  const wrapper_ref = useRef()
  const [needs_layout, set_needs_layout] = useState(true)
  const [selected, do_set_selected] = useState(null)
  const selected_ref = useRef(null)
  const [picker, set_picker] = useState(null)
  const [getRef, setRef] = use_dynamic_refs()

  function set_selected(node_uid) {
    selected_ref.current = node_uid
    do_set_selected(node_uid)
  }

  const nodes_array = recursive_reduce(
    graph,
    (carry, n) => (is_node(n) ? carry.concat(n) : carry),
    [],
    'base_node',
  )
  nodes_array.forEach(n => !n.uid && (n.uid = uid()))
  nodes_array.forEach(n => (n.ref = getRef(ref(n.uid))))
  nodes_array.forEach(n => (n.dummy_ref = getRef(dummy_ref(n.uid))))

  useEffect(
    () => {
      needs_layout && set_needs_layout(false)
    },
    [needs_layout],
  )
  useEffect(() => {
    window.addEventListener('resize', () => set_needs_layout(true))
    window.addEventListener('keydown', ev => delete_node(ev))
  }, [])

  if (!needs_layout) {
    calculate_node_layout(wrapper_ref, graph, nodes_array)
  }

  function open_node_picker(parent_ref, dot_adder_ref) {
    set_picker({
      parent_node: nodes_array.find(node => node.ref === parent_ref),
      dot_adder_ref,
    })
  }

  function add_node(parent, new_node) {
    !parent.children && (parent.children = [])
    parent.children.push(new_node)
    set_needs_layout(true)
  }

  function select_node(n) {
    set_selected(n ? n.uid : null)
  }

  const delete_node = useCallback(ev => {
    const uid_selected = selected_ref.current
    if (uid_selected && ev.key === 'Backspace') {
      recurse(graph, n => {
        if (is_node(n) && n.children) {
          n.children = n.children.filter(child => child.uid !== uid_selected)
        }
      })
      set_selected(null)
      set_needs_layout(true)
    }
  }, [selected, nodes_array])

  return (
    <div style={{position: 'absolute', inset: 0}}
         ref={wrapper_ref}
         onClick={() => {
           select_node(null)
           set_picker(null)
         }}
    >
      <div style={{
        width: '0',
        height: '0',
        overflow: 'hidden',
        position: 'absolute',
      }}
      >
        {nodes_array.map((node, i) => {
          const Node = node_types[node.node_type]
          return (
            <div key={i}
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
        {nodes_array.map((node, i) => {
          return (
            <RenderNode key={i}
                        NodeType={node_types[node.node_type]}
                        node={node}
                        nodeinfo={Node.nodeinfo ? Node.nodeinfo(node) : {}}
                        is_selected={selected === node.uid}
                        node_styles={node_styles}
                        open_node_picker={open_node_picker}
                        select_node={select_node}
                        ref={setRef(ref(node.uid))} />
          )
        })}
        {picker && (
          <Picker node_types={node_types}
                  picker={picker}
                  wrapper_ref={wrapper_ref}
                  add_node={add_node}
                  CustomPicker={CustomPicker} />
        )}
      </div>
    </div>
  )
}
