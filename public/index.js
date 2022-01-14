import {render} from 'preact'
import Nodz from './Nodz'

const node_styles = {
  border: '1px solid black',
  padding: '0.5rem',
}

function A() {
  return <div style={{width: '6rem'}}>A</div>
}

function B() {
  return <div style={{width: '7rem', height: '3rem'}}>B</div>
}

function C() {
  return <div style={{width: '7rem', height: '2rem'}}>C</div>
}

const node_types = {A, B, C}
const node_graph = {
  node_id: 1,
  node_type: 'A',
  children: [
    {
      node_id: 2,
      node_type: 'A',
    },
    {
      node_id: 2,
      node_type: 'B',
      children: [
        {
          node_id: 2,
          node_type: 'A',
        },
        {
          node_id: 2,
          node_type: 'C',
          children: [
            {
              node_id: 2,
              node_type: 'A',
              children: [
                {
                  node_id: 2,
                  node_type: 'A',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      node_id: 3,
      node_type: 'A',
      children: [
        {
          node_id: 4,
          node_type: 'A',
        },
        {
          node_id: 5,
          node_type: 'A',
        },
        {
          node_id: 5,
          node_type: 'B',
          children: [
            {
              node_id: 5,
              node_type: 'A',
            },
          ],
        },
      ],
    },
  ],
}

function App() {
  return (
    <div style={{width: '100%', height: '30rem'}}>
      <Nodz
        node_types={node_types}
        graph={node_graph}
        node_styles={node_styles}
      />
    </div>
  )
}

render(<App />, document.body)
