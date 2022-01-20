import {forwardRef} from 'react'
import DotAdder from './DotAdder'

export function ErrorNode({type}) {
  return (
    <div style={{width: '8rem'}}>
      Error: {type} not found in node_types
    </div>
  )
}

const RenderNode = forwardRef(
  (
    {NodeType, node, _nodeinfo, is_selected, node_styles, open_node_picker, select_node},
    ref,
  ) => {
    return (
      <div ref={ref}
           style={{
             visibility: node.layout ? 'visible' : 'hidden',
             position: 'absolute',
             top: `${node.layout && node.layout.y}px`,
             left: `${node.layout && node.layout.x}px`,
           }}
      >
        <div className="group"
             style={{position: 'relative', paddingBottom: '2rem'}}
        >
          <div style={node_styles(is_selected)}
               onClick={ev => {
                 select_node(node)
                 ev.stopPropagation()
               }}
          >
            {NodeType ? <NodeType /> : <ErrorNode type={node.node_type} />}
          </div>
          <DotAdder node={node} open_node_picker={open_node_picker} />
        </div>
      </div>
    )
  },
)

export default RenderNode
