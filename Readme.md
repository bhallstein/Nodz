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


## Children types

Node exit types:

- indexed - numeric children
          - default
          - render as line to AddChildBtn
          - optional settings: max
          - e.g.: {children_type: 'simple', max_children: 3}
- named - a set of named children
        - render as, originating from the parent node, a set of mini-nodes (one for each named child), each then leading to a AddChildBtn
        - each child has optional setting: max
        - e.g.:
          {
            children_type: 'named',
            children: [
              {name: 'True'},
              {name: 'False', max: 2},
            ]
          }
- none - children are not allowed
       - e.g.: {children_type: 'none'}

NB: all 'plus' interaction points should either use a preset node type, or
//     call out to user code to get the node types & descriptions amically
    (so allowing a node to customise its possible children based on context)
    (or, use user-supplied react elements instead of built in)
- Allow external elements to be passed into node addition popover