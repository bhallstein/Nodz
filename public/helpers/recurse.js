import is_obj from './is-obj'
import is_array from './is-array'

export default function recurse(obj, func, func_unwind) {
  func && func(obj)

  if (is_obj(obj) || is_array(obj)) {
    Object.values(obj).forEach(item => recurse(item, func, func_unwind))
  }

  func_unwind && func_unwind(obj)
}
