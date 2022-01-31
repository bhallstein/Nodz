import recursive_reduce from './recursive-reduce.js'
import is_node from './is-node.js'

function find_rendernode(rendernodes, node) {
  return rendernodes.find(rn => rn.node === node) || null
}

function mk_rendernode(node) {
  const rg_node = {node}
  return rg_node
}

function mk_rendernode_array(graph) {
  return recursive_reduce(graph, (carry, node) => {
    is_node(node) && carry.push(mk_rendernode(node))
    return carry
  }, [])
}

function set_rendernode_children(rendernodes, rn) {
  rn.children = (rn.node.children || []).map(child => find_rendernode(rendernodes, child))
}

function set_rendernode_pseudochildren(rendernodes, rn) {
  rn.pseudo_children = []
}

export default function make_rendergraph(graph) {
  const rendernodes = mk_rendernode_array(graph)

  return recursive_reduce(graph, (carry, node) => {
    if (is_node(node)) {
      const rn = find_rendernode(rendernodes, node)
      set_rendernode_children(rendernodes, rn)
      set_rendernode_pseudochildren(rendernodes, rn)
    }
    return carry
  }, [rendernodes[0]])
}
