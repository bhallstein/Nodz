import is_node from './is-node'
import recurse from './recurse'
import recursive_reduce from './recursive-reduce'

export default function calculate_node_layout(wrapper, graph, nodes_array) {
  if (!wrapper.current) {
    return
  }

  const v_padding = 50
  const h_padding = 50
  const container_w = wrapper.current.getBoundingClientRect().width

  nodes_array.forEach(
    n =>
      (n.layout = {
        w__intrinsic: n.dummy_ref.current.getBoundingClientRect().width,
        h__intrinsic: n.dummy_ref.current.getBoundingClientRect().height,
      }),
  )

  const tiers = recursive_reduce(
    graph,
    (carry, n, _, parents) => {
      if (is_node(n)) {
        const tier = parents.length / 2
        !carry[tier] && (carry[tier] = [])
        carry[tier].push(n)
      }
      return carry
    },
    {},
    'base_node',
  )

  const tier_heights = Object.values(tiers).map(tier => {
    return tier.reduce((carry, n) => Math.max(carry, n.layout.h__intrinsic), 0)
  })

  // Assign cumulative child widths to all nodes by depth-first recursion
  nodes_array.forEach(n => (n.recursive_width = null))
  recurse(graph, null, n => {
    if (!is_node(n)) {
      return
    }
    const children = n.children || []
    const children_width =
      children.reduce((carry, child) => carry + child.layout.w__calculated, 0) +
      Math.max(children.length - 1, 0) * h_padding
    n.layout.w__calculated = Math.max(children_width, n.layout.w__intrinsic)
  })

  // Calculate vertical positions
  let current_offset = 0
  Object.values(tiers).forEach((nodes, i) => {
    nodes.forEach(node => (node.layout.y = current_offset))
    current_offset += tier_heights[i] + v_padding
  })

  // Calculate horizontal positions
  const center_x = container_w / 2
  graph.layout.x = center_x - graph.layout.w__intrinsic / 2
  graph.layout.x_center = center_x
  recurse(graph, n => {
    if (!is_node(n) || !n.children) {
      return
    }
    if (n.children.length === 1) {
      const child = n.children[0]
      child.layout.x = n.layout.x_center - child.layout.w__intrinsic / 2
      child.layout.x_center = n.layout.x_center
    }
    if (n.children.length > 1) {
      let left = n.layout.x_center - n.layout.w__calculated / 2
      n.children.forEach(child => {
        const x_center = left + child.layout.w__calculated / 2
        child.layout.x_center = x_center
        child.layout.x = x_center - child.layout.w__intrinsic / 2
        left += child.layout.w__calculated + h_padding
      })
    }
  })
}
