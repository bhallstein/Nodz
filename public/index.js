import {render} from 'react'
import Nodz from './Nodz'

const node_styles = (selected) => ({
  backgroundColor: '#f3f3f3',
  padding: '0.5rem',
  borderRadius: '2px',
  boxShadow: selected ? '0px 0px 3px 1px #29AFFF' : 'none',
  border: selected ? '1px solid #29AFFF' : '1px solid #ccc',
})

// Node exit types:
// - simple - numeric children
//          - default
//          - render as line to DotAdder
//          - optional settings: max
//          - e.g.: {exit_type: 'simple', max_exits: 3}
//
// - named - a set of named children
//         - render as, originating from the main node, a set of sub-nodes
//           (one for each named child), each then leading to a DotAdder
//         - children optional settings: max
//         - e.g.: {exit_type: 'named', exits: [{name: 'True', max: 1}, {name: 'False', max: 1}]}
//
// - none - children are not allowed
//        - e.g.: {exit_type: 'none'}
//
// NB: all 'plus' interaction points should either use a preset node type, or
//     call out to user code to get the node types & descriptions dynamically
//     (so allowing a node to customise its possible children based on context)
//     (or, use user-supplied react elements instead of built in)
// - Allow external elements to be passed into node addition popover

function A() {
  return <div style={{width: '6rem'}}>A</div>
}
A.nodeinfo = (node, parent, parents) => ({
  exits: [
    {
      label: 'No',
      value: false,
    },
    {
      label: 'Yes',
      value: true,
    },
  ],
})

function B() {
  return <div style={{width: '7rem', height: '6rem'}}>B</div>
}

function C() {
  return <div style={{width: '7rem', height: '2rem'}}>C</div>
}

const node_types = {A, B, C}
const node_graph = {
  node_type: 'A',
  // children: [
  //   {
  //     node_type: 'B',
  //     children: [
  //       {
  //         node_type: 'A',
  //       },
  //       {
  //         node_type: 'C',
  //         children: [
  //           {
  //             node_type: 'B',
  //           },
  //         ],
  //       },
  //     ],
  //   },
  //   {
  //     node_type: 'A',
  //     children: [
  //       {
  //         node_type: 'A',
  //       },
  //       {
  //         node_type: 'B',
  //       },
  //     ],
  //   },
  // ],
}

function App() {
  return (
    <div style={{padding: '2rem'}}>
      <div style={{minHeight: '30rem', position: 'relative'}}>
        <Nodz
          node_types={node_types}
          graph={node_graph}
          node_styles={node_styles}
        />
      </div>
    </div>
  )
}

render(<App />, document.body)
