import is_obj from './is-obj.js'

export default function is_rendernode(item) {
  return !!(is_obj(item) && item.node && item.node.node_type)
}
