import is_rendernode from './is-rendernode'
import recursive_reduce from './recursive-reduce'

const h_spacing = 10
const v_spacing = 4

function calculate_join_position(rn, i_child) {
  const child_rn = rn.children[i_child]
  const h_offset = -h_spacing * (i_child - (rn.children.length - 1)/2)

  const parent_btm_center = {
    x: rn.layout.x + rn.layout.w__intrinsic / 2 - h_offset,
    y: rn.layout.y + rn.layout.h__intrinsic + v_spacing,
  }
  const child_top_center = {
    x: child_rn.layout.x + child_rn.layout.w__intrinsic / 2,
    y: child_rn.layout.y - v_spacing,
  }

  return {
    from: parent_btm_center,
    to: child_top_center,
  }
}

export default function calculate_join_positions(rg) {
  const joins = recursive_reduce(rg, (carry, rn) => {
    if (is_rendernode(rn)) {
      const children = rn.children || []
      const joins = children.map((_, i) => calculate_join_position(rn, i))
      carry.push(...joins)
    }
    return carry
  }, [])

  return joins
}
