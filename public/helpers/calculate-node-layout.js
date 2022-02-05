import is_node from './is-node'
import is_rendernode from './is-rendernode'
import recurse from './recurse'
import recursive_reduce from './recursive-reduce'

export default function calculate_node_layout(wrapper, rg, rns, layout_opts) {
  if (!rg.length) {
    return
  }

  const container_w = wrapper.getBoundingClientRect().width

  rns.forEach(rn =>
    (rn.layout = {
      w__intrinsic: rn.ref.current.getBoundingClientRect().width,
      h__intrinsic: rn.ref.current.getBoundingClientRect().height,
    }),
  )

  const tiers = recursive_reduce(rg, (carry, rn, _, parents) => {
    if (is_rendernode(rn)) {
      const tier = parents.length / 2
      !carry[tier] && (carry[tier] = [])
      carry[tier].push(rn)
    }
    return carry
  }, {}, 'base_node')

  const tier_heights = Object.values(tiers).map(tier => {
    return tier.reduce((carry, n) => Math.max(carry, n.layout.h__intrinsic), 0)
  })

  // Assign cumulative child widths to all nodes by depth-first recursion
  recurse(rg, null, rn => {
    if (is_rendernode(rn)) {
      const children = rn.children || []
      const children_width = (
        children.reduce((carry, child) => carry + child.layout.w__calculated, 0) +
        Math.max(children.length - 1, 0) * layout_opts.h_padding
      )
      rn.layout.w__calculated = Math.max(children_width, rn.layout.w__intrinsic)
    }
  })

  // Calculate vertical positions
  let current_offset = 0
  Object.values(tiers).forEach((tier_rns, i) => {
    tier_rns.forEach(rn => (rn.layout.y = current_offset))
    current_offset += tier_heights[i] + layout_opts.v_padding
  })

  // Calculate horizontal positions
  const center_x = container_w / 2
  rg[0].layout.x = center_x - rg[0].layout.w__intrinsic / 2
  rg[0].layout.x_center = center_x
  recurse(rg, rn => {
    if (!is_rendernode(rn) || !rn.children) {
      return
    }
    if (rn.children.length === 1) {
      const child = rn.children[0]
      child.layout.x = rn.layout.x_center - child.layout.w__intrinsic / 2
      child.layout.x_center = rn.layout.x_center
    }
    if (rn.children.length > 1) {
      let left = rn.layout.x_center - rn.layout.w__calculated / 2
      rn.children.forEach(child => {
        const x_center = left + child.layout.w__calculated / 2
        child.layout.x_center = x_center
        child.layout.x = x_center - child.layout.w__intrinsic / 2
        left += child.layout.w__calculated + layout_opts.h_padding
      })
    }
  })
}
