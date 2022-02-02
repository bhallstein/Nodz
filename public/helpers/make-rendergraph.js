import reduce from './reduce.js'
import is_array from './is-array.js'
import is_obj from './is-obj.js'
import wrap_up from './wrap-up.js'

function mk_rendernode(node) {
  const rn = {node}

  // Indexed children
  if (is_array(node.children)) {
    rn.children = node.children.map(mk_rendernode)
  }

  // Named children: create pseudonodes
  else if (is_obj(node.children)) {
    rn.children = reduce(node.children, (carry, key, children_for_key) => {
      const children = wrap_up(children_for_key).map(mk_rendernode)
      carry.push({
        node: 'Pseudo',
        key,
        children,
      })
      return carry
    }, [])
  }

  return rn
}

export default function make_rendergraph(graph) {
  return graph.nodes.map(mk_rendernode)
}
