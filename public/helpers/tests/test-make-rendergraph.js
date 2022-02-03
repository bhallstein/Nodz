import t from 'ava'
import is_rendernode from '../is-rendernode.js'
import {make_rendergraph, flatten_rendergraph} from '../make-rendergraph.js'

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

t('make_rendergraph: converts to rendergraph', t => {
  const rendergraph = make_rendergraph(graph)
  const expected = [
    {
      node: graph.nodes[0],
      uid: 1,
      children: [
        {node: graph.nodes[0].children[0], uid: 2},
        {node: graph.nodes[0].children[1], uid: 3},
        {node: graph.nodes[0].children[2], uid: 4, children: [
          {
            node: {node_type: 'Pseudo'},
            key: 'true',
            uid: '4/true',
            children: [{node: {node_type: 'A'}, uid: 5}, {node: {node_type: 'B'}, uid: 6}],
          },
          {
            node: {node_type: 'Pseudo'},
            key: 'false',
            uid: '4/false',
            children: [{node: {node_type: 'C'}, uid: 7}],
          },
        ]},
      ],
    },
  ]
  t.deepEqual(rendergraph, expected)
})

t('make_rendergraph: preserves uids between referentially equal nodes', t => {
  const rendergraph = make_rendergraph(graph)
  t.is(1, rendergraph[0].uid)
})
// NOTE: therefore, if nodes are to be treated as distinct, they must not be referentially
//       equal (even if they are identical) -- Nodz should perhaps throw if any are equal?

t('make_rendergraph: copes with empty graph', t => {
  t.deepEqual([], make_rendergraph({nodes: []}))
})

t('flatten_rendergraph: flattens', t => {
  const rg = make_rendergraph(graph)
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
    t.true(is_rendernode(rn))
    t.is(exp[i], rn.node.node_type)
  })
})
