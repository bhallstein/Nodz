import {useEffect, useState, useRef} from 'react'
import use_dynamic_refs from 'use-dynamic-refs'
import RenderNode from './RenderNode'
import Picker from './Picker'
import recursive_reduce from './helpers/recursive-reduce'
import is_node from './helpers/is-node'
import calculate_node_layout from './helpers/calculate-node-layout'
import recurse from './helpers/recurse'
import AddChildBtn from './AddChildBtn'

const ref = i => `${i}-ref`
const dummy_ref = i => `${i}-dummy-ref`

let uid_counter = 0
function uid() {
  return (uid_counter += 1)
}

export default function Nodz({node_types, graph, node_styles, CustomPicker}) {
  const wrapper_ref = useRef()
  const [needs_layout, set_needs_layout] = useState(true)
  const [selected, do_set_selected] = useState(null)
  const selected_ref = useRef(null)   // To prevent stale references in callbacks
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
  nodes_array.forEach(n => {
    n.uid = n.uid || uid()
    n.ref = getRef(ref(n.uid))
    n.dummy_ref = getRef(dummy_ref(n.uid))
  })

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

  if (!needs_layout && nodes_array.length) {
    calculate_node_layout(wrapper_ref, nodes_array[0], nodes_array)
  }

  function open_node_picker(parent, dot_adder_ref) {
    set_picker({
      parent,
      dot_adder_ref,
    })
  }

  function add_node(parent, new_node) {
    if (parent) {
      !parent.children && (parent.children = [])
      parent.children.push(new_node)
    }
    else {
      graph.nodes.push(new_node)
    }
    set_needs_layout(true)
  }

  function select_node(n) {
    set_selected(n ? n.uid : null)
  }

  function delete_node(ev) {
    const uid_selected = selected_ref.current
    if (uid_selected && ev.key === 'Backspace') {
      recurse(graph, n => {
        if (n === graph) {
          graph.nodes = graph.nodes.filter(child => child.uid !== uid_selected)
        }
        else if (is_node(n) && n.children) {
          n.children = n.children.filter(child => child.uid !== uid_selected)
        }
      })
      set_selected(null)
      set_needs_layout(true)
    }
  }

  return (
    <div style={{position: 'absolute', inset: 0}}
         ref={wrapper_ref}
         onClick={() => {
           select_node(null)
           set_picker(null)
         }}
    >
      {/* Dummy nodes */}
      {nodes_array.length > 0 && (
        <div style={{
          width: '0',
          height: '0',
          overflow: 'hidden',
        }}
        >
          {nodes_array.map((node, i) => (
            <RenderNode key={i}
                        NodeType={node_types[node.node_type]}
                        node={node}
                        node_styles={node_styles}
                        ref={setRef(dummy_ref(node.uid))} />
          ))}
        </div>
      )}

      {/* UI */}
      {nodes_array.length > 0 && (
        <div>
          {nodes_array.map((node, i) => (
            <RenderNode key={i}
                        NodeType={node_types[node.node_type]}
                        node={node}
                        is_selected={selected === node.uid}
                        node_styles={node_styles}
                        open_node_picker={open_node_picker}
                        select_node={select_node}
                        ref={setRef(ref(node.uid))} />
          ))}
        </div>
      )}

      {nodes_array.length === 0 && (
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <AddChildBtn open_node_picker={open_node_picker} />
        </div>
      )}

      {picker && (
        <Picker node_types={node_types}
                picker={picker}
                wrapper_ref={wrapper_ref}
                add_node={add_node}
                CustomPicker={CustomPicker} />
      )}
    </div>
  )
}
