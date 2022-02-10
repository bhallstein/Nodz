import is_array from './is-array.js'

export default function wrap_up(x) {
  return is_array(x) ? x : [x]
}
