export default function is_array(arr) {
  return Object.prototype.toString.call(arr) === '[object Array]'
}
