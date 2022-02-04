import t from 'ava'
import is_rendernode from '../is-rendernode.js'
import {make_rendergraph, flatten_rendergraph} from '../make-rendergraph.js'
import get_node_options from '../get-node-options.js'
import {get_node} from '../uids.js'

const graph = {
  nodes: [
    {
      node_type: 'A',
      children: [
        {node_type: 'A'},
        {node_type: 'B'},
        {
          node_type: 'C',
          children: {
            'true': [{node_type: 'A'}, {node_type: 'B'}],
            'false': {node_type: 'C'},
          },
        },
      ],
    },
  ],
}

function A() {}
function B() {}
function C() {}
function D() {}

B.options = () => ({max_children: 1})
C.options = () => ({
  children_type: 'named',
  children: [
    {name: 'false', max_children: 1},
    {name: 'true'},
  ],
})


const node_types = {A, B, C, D}


t('make_rendergraph: throws if invalid node_type', t => {
  const func = () => make_rendergraph(
    {nodes: [{node_type: 'Q'}]},
    node_types,
  )
  t.throws(func, {message: 'invalid node_type'})
})


t('make_rendergraph: throws if children do not match node options', t => {
  const indexed = () => make_rendergraph(
    {nodes: [{node_type: 'A', children: {}}]},
    node_types,
  )
  const indexed_too_many = () => make_rendergraph(
    {nodes: [{node_type: 'B', children: [{node_type: 'A'}, {node_type: 'B'}]}]},
    node_types,
  )
  const named = () => make_rendergraph(
    {nodes: [{node_type: 'C', children: []}]},
    node_types,
  )
  const named_too_many = () => make_rendergraph(
    {nodes: [{node_type: 'C', children: {false: [{node_type: 'A'}, {node_type: 'B'}]}}]},
    node_types,
  )
  const named_non_match_spec = () => make_rendergraph(
    {nodes: [{node_type: 'C', children: {maybe: {node_type: 'A'}}}]},
    node_types,
  )

  t.throws(indexed, {message: 'children do not match node_options'})
  t.throws(indexed_too_many, {message: 'children do not match node_options'})
  t.throws(named, {message: 'children do not match node_options'})
  t.throws(named_too_many, {message: 'children do not match node_options'})
  t.throws(named_non_match_spec, {message: 'children do not match node_options'})
})


t('make_rendergraph: converts to rendergraph', t => {
  const rg = make_rendergraph(graph, node_types)
  const expected = [
    {
      node: graph.nodes[0],
      uid: 1,
      opts: get_node_options(),
      children: [
        {node: graph.nodes[0].children[0], uid: 2, opts: get_node_options()},
        {node: graph.nodes[0].children[1], uid: 3, opts: get_node_options(B)},
        {
          node: graph.nodes[0].children[2],
          uid: 4,
          opts: get_node_options(C),
          children: [
            {
              node: {node_type: 'Pseudo'},
              key: 'true',
              uid: '4/true',
              opts: {...get_node_options(C).children[1], children_type: 'indexed'},
              children: [
                {node: {node_type: 'A'}, uid: 5, opts: get_node_options()},
                {node: {node_type: 'B'}, uid: 6, opts: get_node_options(B)},
              ],
            },
            {
              node: {node_type: 'Pseudo'},
              key: 'false',
              uid: '4/false',
              opts: {...get_node_options(C).children[0], children_type: 'indexed'},
              children: [{node: {node_type: 'C'}, uid: 7, opts: get_node_options(C)}],
            },
          ],
        },
      ],
    },
  ]
  t.deepEqual(expected, rg)
})


t('make_rendergraph: preserves uids between referentially equal nodes', t => {
  const rg = make_rendergraph(graph, node_types)
  t.is(1, rg[0].uid)
})
// NOTE: therefore, if nodes are to be treated as distinct, they must not be referentially
//       equal (even if they are identical) -- Nodz should perhaps throw if any are equal?


t('make_rendergraph: copes with empty graph', t => {
  t.deepEqual([], make_rendergraph({nodes: []}))
})


t('flatten_rendergraph: flattens', t => {
  const rg = make_rendergraph(graph, node_types)
  const rn_array = flatten_rendergraph(rg)
  const exp = [
    'A',
    'A',
    'B',
    'C',
    'Pseudo',
    'A',
    'B',
    'Pseudo',
    'C',
  ]

  rn_array.forEach((rn, i) => {
    t.truthy(is_rendernode(rn))
    t.is(exp[i], rn.node.node_type)
  })
})
