import {forwardRef} from 'react'
import AddChildBtn from './AddChildBtn'

const nullobj = () => ({})

function ErrorNode({type}) {
  return (
    <div style={{width: '8rem'}}>
      Error: {type} not found in node_types
    </div>
  )
}

const RenderNode = forwardRef(
  (
    {NodeType, rn, is_selected, node_styles, open_node_picker, select_node},
    ref,
  ) => {
    const {
      children_type = 'indexed',
      max_children = -1,
      children = [],
    } = (NodeType.options || nullobj)(rn.node)

    const n_children = (node.children || []).length
    const at_max_children = (
      children_type === 'indexed' &&
      max_children !== -1 &&
      n_children >= max_children
    )

    function click(ev) {
      select_node && select_node(node)
      ev.stopPropagation()
    }

    const add_btn_style = {
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      top: 'calc(100% - 1rem)',
    }

    return (
      <div ref={ref}
           class="render-node"
           style={{
             visibility: node.layout ? 'visible' : 'hidden',
             position: 'absolute',
             top: `${node.layout && node.layout.y}px`,
             left: `${node.layout && node.layout.x}px`,
           }}
      >
        {children_type === 'indexed' && (
          <div className="group"
               style={{
                 position: 'relative',
                 paddingBottom: '2rem',
               }}
          >
            <div style={node_styles(is_selected)}
                 onClick={click}
            >
              {NodeType ? <NodeType /> : <ErrorNode type={node.node_type} />}
            </div>

            <AddChildBtn node={node}
                         open_node_picker={open_node_picker}
                         disabled={at_max_children}
                         style={add_btn_style} />
          </div>
        )}

        {children_type === 'named' && (
          <div>
            <div style={{padding: '0 1rem'}}>
              <div style={{display: 'inline-block', ...node_styles(is_selected)}}
                   onClick={click}
              >
                {NodeType ? <NodeType /> : <ErrorNode type={node.node_type} />}
              </div>
            </div>
            <div style={{
              marginTop: '1.2rem',
              display: 'flex',
              justifyContent: 'space-between',
            }}
            >
              {children.map((child_spec, i) => (
                <div key={child_spec.name}
                     className="group"
                     style={{
                       position: 'relative',
                       paddingBottom: '2rem',
                       marginRight: i === children.length - 1 ? 0 : '1rem',
                     }}
                >
                  <div style={{cursor: 'default', ...node_styles(false)}}>
                    {child_spec.name}
                  </div>
                  <AddChildBtn node={node}
                               open_node_picker={open_node_picker}
                               style={add_btn_style} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  },
)

export default RenderNode
