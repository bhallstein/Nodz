import reduce from './reduce.js'
import recursive_reduce from './recursive-reduce.js'
import is_array from './is-array.js'
import is_obj from './is-obj.js'
import is_rendernode from './is-rendernode.js'
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
      node: {node_type: 'Pseudo'},
      key,
      uid: `${uid}/${key}`,
      children: wrap_up(children_for_key).map(mk_rendernode),
    }), [])
  }

  return rn
}

export function make_rendergraph(graph) {
  return graph.nodes.map(mk_rendernode)
}

export function flatten_rendergraph(rg) {
  return recursive_reduce(rg, (carry, n) => (
    is_rendernode(n) ? carry.concat(n) : carry
  ), [])
}
