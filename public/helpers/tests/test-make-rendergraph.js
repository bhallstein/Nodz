import t from 'ava'
import make_rendergraph from '../make-rendergraph.js'

const graph = {
  nodes: [
    {
      node_type: 'A',
      children: [
        {node_type: 'A'},
        {node_type: 'B'},
        {node_type: 'C'},
      ],
    },
  ],
}

t('make_rendergraph: converts to rendergraph', t => {
  const render_graph = make_rendergraph(graph)
  const expected = [
    {
      node: graph.nodes[0],
      pseudo_children: [],
      children: [
        {node: graph.nodes[0].children[0], children: [], pseudo_children: []},
        {node: graph.nodes[0].children[1], children: [], pseudo_children: []},
        {node: graph.nodes[0].children[2], children: [], pseudo_children: []},
      ],
    },
  ]
  t.deepEqual(render_graph, expected)
})
