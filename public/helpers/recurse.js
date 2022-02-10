import is_obj from './is-obj.js'
import is_array from './is-array.js'

export default function recurse(item, func, func_unwind) {
  func && func(item)

  if (is_obj(item) || is_array(item)) {
    Object.values(item).forEach(child => recurse(child, func, func_unwind))
  }

  func_unwind && func_unwind(item)
}
