import {render} from 'react'
import Nodz from './Nodz'

const node_styles = selected => ({
  backgroundColor: '#f3f3f3',
  padding: '0.5rem',
  borderRadius: '2px',
  boxShadow: selected ? '0px 0px 3px 1px #29AFFF' : 'none',
  border: selected ? '1px solid #29AFFF' : '1px solid #ccc',
})

function A() {
  return <div style={{width: '6rem'}}>A</div>
}
A.options = (_node, _parent) => ({
  max_children: 3,
})

function B() {
  return <div style={{width: '7rem', height: '6rem'}}>B</div>
}
B.options = (_node, _parent) => ({
  children_type: 'named',
  children: [
    {name: 'true'},
    {name: 'false'},
    // {name: 'Maybe'},
    // {name: 'Perhaps'},
    // {name: 'Neither true nor false'},
  ],
})

function C() {
  return <div style={{width: '7rem', height: '2rem'}}>C</div>
}

const node_types = {A, B, C}
const graph = {
  nodes: [
    {
      node_type: 'B',
      // children: [
      //   {node_type: 'A'},
      // },
      children: {
        true: {node_type: 'A'},
      },
    },
  ],
}

function MyPseudo() {
  return <div>I'm a pseudo</div>
}

function App() {
  return (
    <div style={{padding: '2rem'}}>
      <div style={{minHeight: '30rem', position: 'relative'}}>
        <Nodz node_types={node_types}
              graph={graph}
              node_styles={node_styles}
              CustomPicker={null}
              CustomPseudo={MyPseudo} />
      </div>
    </div>
  )
}

render(<App />, document.body)

// function MyCustomPicker({node_types, parent, add_node}) {
//   return (
//     <div>
//       My CustomPicker
//       <div onClick={() => add_node(parent, {node_type: 'B'})}>
//         Add B
//       </div>
//     </div>
//   )
// }

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