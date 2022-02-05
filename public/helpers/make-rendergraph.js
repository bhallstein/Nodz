import reduce from './reduce.js'
import recursive_reduce from './recursive-reduce.js'
import is_array from './is-array.js'
import is_obj from './is-obj.js'
import is_rendernode from './is-rendernode.js'
import wrap_up from './wrap-up.js'
import {get_uid} from './uids.js'
import get_node_options from './get-node-options.js'


// Error checking
// ------------------------------

function indexed_children_ok(children, options) {
  if (!is_array(children)) {
    return false
  }
  if (options.max_children && children.length > options.max_children) {
    return false
  }
  return true
}

function named_children_ok(children, options) {
  if (!is_obj(children)) {
    return false
  }

  const allowed_children = options.children || []
  return reduce(children || { }, (carry, child_name, child_value) => {
    const options_for_child = allowed_children.find(item => item.name === child_name)
    const length_exceeded = (
      options_for_child?.max_children && is_array(child_value) && child_value.length > options_for_child.max_children
    )
    return carry && options_for_child && !length_exceeded
  }, true)
}

function error__children_mismatch() {
  throw Error('children do not match node_options')
}


// mk_rendernode
// ------------------------------

function mk_rendernode(node, node_types) {
  const node_type = node_types[node.node_type]
  if (!node_type) {
    throw Error('invalid node_type')
  }

  const opts = get_node_options(node_type)
  const children = node.children

  // Check children
  if (opts.children_type === 'indexed' && children) {
    !indexed_children_ok(children, opts) && error__children_mismatch()
  }
  if (opts.children_type === 'named' && children) {
    !named_children_ok(children, opts) && error__children_mismatch()
  }

  const uid = get_uid(node)
  const rn = {node, uid, opts}

  // Indexed children
  if (opts.children_type === 'indexed' && children?.length) {
    rn.children = (children || []).map((child => mk_rendernode(child, node_types)))
  }

  // Named children: create pseudonodes
  else if (opts.children_type === 'named') {
    rn.children = opts.children.reduce((carry, child_opts) => {
      const key = child_opts.name
      const children_array = wrap_up((children || { })[key] || [])
        .map(child => mk_rendernode(child, node_types))

      return carry.concat({
        node: {node_type: 'Pseudo'},
        key,
        uid: `${uid}/${key}`,
        opts: {...child_opts, children_type: 'indexed'},
        ...(children_array.length ? {children: children_array} : { }),
      })
    }, [])
  }

  return rn
}


// exports
// ------------------------------

export function make_rendergraph(graph, node_types) {
  return graph.nodes.map(n => mk_rendernode(n, node_types))
}

export function flatten_rendergraph(rg) {
  return recursive_reduce(rg, (carry, n) => (
    is_rendernode(n) ? carry.concat(n) : carry
  ), [])
}
