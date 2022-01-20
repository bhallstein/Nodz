# nodz

A tiny javascript node editor with minimal dependencies.


## Sample code

```js
import {render} from 'react'
import Nodz from 'nodz'

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
function B() {
  return <div style={{width: '7rem', height: '6rem'}}>B</div>
}
function C() {
  return <div style={{width: '7rem', height: '2rem'}}>C</div>
}

const node_types = {A, B, C}
const node_graph = {
  node_type: 'A',
}

function App() {
  return (
    <div style={{padding: '2rem'}}>
      <div style={{minHeight: '30rem', position: 'relative'}}>
        <Nodz node_types={node_types}
              graph={node_graph}
              node_styles={node_styles} />
      </div>
    </div>
  )
}

render(<App />, document.body)
```