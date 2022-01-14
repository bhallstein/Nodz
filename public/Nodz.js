import {useEffect, useState, useRef} from 'preact/hooks'
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

export default function Nodz({node_types, graph, node_styles}) {
  const wrapper_ref = useRef()
  const [laid_out, set_laid_out] = useState(0)

  const nodes_array = recursive_reduce(
    graph,
    (carry, n) => (is_node(n) ? carry.concat(n) : carry),
    [],
    'base_node',
  )
  nodes_array.forEach((n) => (n.ref = useRef()))

  calculate_node_layout(wrapper_ref, graph, nodes_array)

  useEffect(() => {
    set_laid_out(laid_out + 1)
  }, [])

  return (
    <div
      ref={wrapper_ref}
      style={{visibility: laid_out ? 'visible' : 'hidden'}}
    >
      {nodes_array.map((node) => {
        const Node = node_types[node.node_type]
        return (
          <div ref={node.ref} style={{position: 'absolute', ...node_styles}}>
            {Node ? <Node /> : <ErrorNode type={node.node_type} />}
          </div>
        )
      })}
    </div>
  )
}
