import t from 'ava'
import make_rendergraph from '../make-rendergraph.js'

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
  const render_graph = make_rendergraph(graph)
  const expected = [
    {
      node: graph.nodes[0],
      children: [
        {node: {node_type: 'A'}},
        {node: {node_type: 'B'}},
        {node: graph.nodes[0].children[2], children: [
          {
            node: 'Pseudo',
            key: 'true',
            children: [{node: {node_type: 'A'}}, {node: {node_type: 'B'}}],
          },
          {
            node: 'Pseudo',
            key: 'false',
            children: [{node: {node_type: 'C'}}],
          },
        ]},
      ],
    },
  ]
  t.deepEqual(render_graph, expected)
})
