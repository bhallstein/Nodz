const default_options = {
  children_type: 'indexed',
}

export default function get_node_options(node_type) {
  const options = node_type?.options?.() || { }
  return {
    ...default_options,
    ...options,
  }
}
