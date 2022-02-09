const uids = []
let uid_counter = 0

function find_uid(node) {
  const result = uids.find(item => item.node === node)
  return result?.uid
}

export function get_uid(node) {
  let uid = find_uid(node)
  if (!uid) {
    uid = uid_counter += 1
    uids.push({node, uid})
  }
  return uid
}

export function get_node(uid) {
  return uids.find(item => item.uid === uid)
}
