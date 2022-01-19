import {forwardRef} from 'react'
import PlusCircleOutline from 'simple-react-heroicons/icons/PlusCircleOutline'

function ErrorNode({type}) {
  return (
    <div style={{width: '8rem'}}>
      Error: node type "{type}" not found in node_types
    </div>
  )
}

function DotAdder({node, add_node}) {
  return (
    <div
      className="hover-reveal"
      style={{
        cursor: 'pointer',
        position: 'absolute',
        left: '50%',
        top: 'calc(100% - 1rem)',
        transform: 'translateX(-50%)',
        fontSize: '16px',
      }}
      onClick={() => add_node(node.ref)}
    >
      <PlusCircleOutline />
    </div>
  )
}

const RenderNode = forwardRef(
  (
    {NodeType, node, nodeinfo, is_selected, node_styles, add_node, select_node},
    ref,
  ) => {
    return (
      <div
        ref={ref}
        style={{
          position: 'absolute',
          top: `${node.layout && node.layout.y}px`,
          left: `${node.layout && node.layout.x}px`,
        }}
      >
        <div
          className="group"
          style={{position: 'relative', paddingBottom: '2rem'}}
        >
          <div
            style={{
              ...node_styles(is_selected),
            }}
            onClick={(ev) => {
              select_node(node)
              ev.stopPropagation()
            }}
          >
            {NodeType ? <NodeType /> : <ErrorNode type={node.node_type} />}
          </div>
          <DotAdder node={node} add_node={add_node} />
        </div>
      </div>
    )
  },
)

export default RenderNode
