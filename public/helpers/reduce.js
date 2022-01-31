export default function reduce(obj, func, initial = {}) {
  return Object.keys(obj).reduce(
    (carry, k) => func(carry, k, obj[k]),
    initial,
  )
}
