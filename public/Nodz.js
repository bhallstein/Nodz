import {useEffect, useState, useRef} from 'react'
import use_dynamic_refs from 'use-dynamic-refs'
import RenderNode from './RenderNode'
import NodePicker from './NodePicker'
import AddChildBtn from './AddChildBtn'
import calculate_node_layout from './helpers/calculate-node-layout'
import {make_rendergraph, flatten_rendergraph} from './helpers/make-rendergraph'
import wrap_up from './helpers/wrap-up'

const ref = i => `${i}-ref`

const default_layout_opts = {
  v_padding: 50,
  h_padding: 50,
}

function get_layout_opts(opts = { }) {
  return {
    ...default_layout_opts,
    ...opts,
  }
}

export default function Nodz({
  node_types,
  graph,
  CustomPicker,
  node_styles,
  layout_options,
}) {
  const wrapper_ref = useRef()
  const [needs_layout, set_needs_layout] = useState(true)
  const [selected, set_selected] = useState(null)
  const selected_ref = useRef(null)   // Prevents stale references in callbacks
  const [picker, set_picker] = useState(null)
  const [getRef, setRef] = use_dynamic_refs()

  // Graph -> Rendergraph
  const rg = make_rendergraph(graph, node_types)
  const rns = flatten_rendergraph(rg)
  rns.forEach(rn => rn.ref = getRef(ref(rn.uid)))

  useEffect(
    () => needs_layout && set_needs_layout(false),
    [needs_layout],
  )
  useEffect(() => {
    window.addEventListener('resize', () => set_needs_layout(true))
    // window.addEventListener('keydown', ev => delete_node(ev))
  }, [])

  if (!needs_layout && rns.length && wrapper_ref.current) {
    calculate_node_layout(wrapper_ref.current, rg, rns, get_layout_opts(layout_options))
  }

  function open_node_picker(parent, add_node_btn_ref) {
    set_picker({
      parent,
      add_node_btn_ref,
    })
  }

  function add_node(rn, new_node) {
    if (!rn) {
      graph.nodes.push(new_node)
    }

    else {
      if (rn.node.node_type === 'Pseudo') {
        const parent = rns.filter(rn => rn.children)
          .find(parent => {
            const child_uids = parent.children.map(child => child.uid)
            return child_uids.includes(rn.uid)
          })
        if (!parent.node.children) {
          parent.node.children = { }
        }
        const child_array = wrap_up((parent.node.children)[rn.key] || [])
        parent.node.children[rn.key] = [
          ...child_array,
          new_node,
        ]
      }
      else {
        !rn.node.children && (rn.node.children = [])
        rn.node.children.push(new_node)
      }
    }

    set_needs_layout(true)
  }

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
           set_selected(null)
           set_picker(null)
         }}
    >
      {rns.length > 0 && (
        <div>
          {rns.map(rn => (
            <RenderNode key={rn.uid}
                        rn={rn}
                        node_types={node_types}
                        is_selected={selected === rn.node}
                        node_styles={node_styles}
                        open_node_picker={open_node_picker}
                        select_node={set_selected}
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
        <NodePicker node_types={node_types}
                    picker={picker}
                    wrapper_ref={wrapper_ref}
                    add_node={add_node}
                    CustomPicker={CustomPicker} />
      )}
    </div>
  )
}
