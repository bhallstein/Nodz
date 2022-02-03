import reduce from './reduce.js'
import is_array from './is-array.js'
import is_obj from './is-obj.js'
import wrap_up from './wrap-up.js'
import {get_uid} from './uids.js'

function mk_rendernode(node) {
  const uid = get_uid(node)
  const rn = {node, uid}

  // Indexed children
  if (is_array(node.children)) {
    rn.children = node.children.map(mk_rendernode)
  }

  // Named children: create pseudonodes
  else if (is_obj(node.children)) {
    rn.children = reduce(node.children, (carry, key, children_for_key) => carry.concat({
      node: 'Pseudo',
      key,
      uid: `${uid}/${key}`,
      children: wrap_up(children_for_key).map(mk_rendernode),
    }), [])
  }

  return rn
}

export default function make_rendergraph(graph) {
  return graph.nodes.map(mk_rendernode)
}
