import {useEffect, useState, useRef} from 'react'
import use_dynamic_refs from 'use-dynamic-refs'
import RenderNode from './RenderNode'
import Picker from './Picker'
import AddChildBtn from './AddChildBtn'
import recursive_reduce from './helpers/recursive-reduce'
import is_node from './helpers/is-node'
import is_rendernode from './helpers/is-rendernode'
import calculate_node_layout from './helpers/calculate-node-layout'
import recurse from './helpers/recurse'
import {make_rendergraph, flatten_rendergraph} from './helpers/make-rendergraph'
import {get_uid, get_node} from './helpers/uids'

const ref = i => `${i}-ref`
const dummy_ref = i => `${i}-dummy-ref`

export default function Nodz({node_types, graph, node_styles, CustomPicker}) {
  const wrapper_ref = useRef()
  const [needs_layout, set_needs_layout] = useState(true)
  const [selected, do_set_selected] = useState(null)
  const selected_ref = useRef(null)   // Prevents stale references in callbacks
  const [picker, set_picker] = useState(null)
  const [getRef, setRef] = use_dynamic_refs()

  // Graph -> Rendergraph
  const rg = make_rendergraph(graph, node_types)
  const rns = flatten_rendergraph(rg)
  rns.forEach(rn => rn.ref = getRef(ref(rn.uid)))

  // function set_selected(node_uid) {
  //   // selected_ref.current = node_uid
  //   // do_set_selected(node_uid)
  // }

  useEffect(
    () => needs_layout && set_needs_layout(false),
    [needs_layout],
  )
  useEffect(() => {
    window.addEventListener('resize', () => set_needs_layout(true))
    // window.addEventListener('keydown', ev => delete_node(ev))
  }, [])

  if (!needs_layout && rns.length) {
    calculate_node_layout(wrapper_ref, rns[0], rns)
  }

  function open_node_picker(parent, dot_adder_ref) {
    set_picker({
      parent,
      dot_adder_ref,
    })
  }

  // function add_node(parent, new_node) {
  //   if (parent) {
  //     !parent.children && (parent.children = [])
  //     parent.children.push(new_node)
  //   }
  //   else {
  //     graph.nodes.push(new_node)
  //   }
  //   set_needs_layout(true)
  // }

  // function select_node(n) {
  //   set_selected(n ? n.uid : null)
  // }

  // function delete_node(ev) {
  //   const uid_selected = selected_ref.current
  //   if (uid_selected && ev.key === 'Backspace') {
  //     recurse(graph, n => {
  //       if (n === graph) {
  //         graph.nodes = graph.nodes.filter(child => child.uid !== uid_selected)
  //       }
  //       else if (is_node(n) && n.children) {
  //         n.children = n.children.filter(child => child.uid !== uid_selected)
  //       }
  //     })
  //     set_selected(null)
  //     set_needs_layout(true)
  //   }
  // }

  return (
    <div style={{position: 'absolute', inset: 0}}
         ref={wrapper_ref}
         onClick={() => {
           //  select_node(null)
           set_picker(null)
         }}
    >
      {rns.length > 0 && (
        <div>
          {rns.map((rn, i) => (
            <RenderNode key={i}
                        NodeType={node_types[rn.node.node_type]}
                        rn={rn}
                        is_selected={selected === rn.uid}
                        node_styles={node_styles}
                        open_node_picker={open_node_picker}
                        // select_node={select_node}
                        ref={setRef(ref(rn.uid))} />
          ))}
        </div>
      )}

      {rns.length === 0 && (
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <AddChildBtn open_node_picker={open_node_picker} />
        </div>
      )}

      {picker && (
        <Picker node_types={node_types}
                picker={picker}
                wrapper_ref={wrapper_ref}
                // add_node={add_node}
                CustomPicker={CustomPicker} />
      )}
    </div>
  )
}
