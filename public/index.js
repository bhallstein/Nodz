import {render} from 'preact'
import Nodz from './Nodz'

const node_styles = (selected) => ({
  backgroundColor: '#f3f3f3',
  padding: '0.5rem',
  boxShadow: selected ? '0px 0px 3px 1px #29AFFF' : 'none',
  outline: selected ? 'none' : '#ccc solid 1px',
})

function A() {
  return <div style={{width: '6rem'}}>A</div>
}

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
