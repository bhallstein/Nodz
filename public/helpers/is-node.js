import is_obj from './is-obj'

export default function is_node(item) {
  return is_obj(item) && item.node_type
}
