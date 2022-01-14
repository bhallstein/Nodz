import is_obj from './is-obj.js'
import is_array from './is-array.js'

export default function recursive_reduce(item, func, carry = null, key = null, parent_keys = []) {
  if (key) {
    carry = func(carry, item, key, parent_keys)
  }

  if (is_obj(item) || is_array(item)) {
    Object.keys(item).forEach(k => {
      carry = recursive_reduce(item[k], func, carry, k, parent_keys.concat(k))
    })
  }

  return carry
}
