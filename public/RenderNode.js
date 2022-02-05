import {forwardRef} from 'react'
import AddChildBtn from './AddChildBtn'

function Pseudo({rn}) {
  return (
    <div>
      {rn.key}
    </div>
  )
}

const RenderNode = forwardRef(
  (
    {rn, node_types, is_selected, node_styles, open_node_picker, select_node},
    ref,
  ) => {
    const NodeType = node_types[rn.node.node_type]
    const children_type = rn.opts.children_type

    const at_max_children = (
      rn.opts.max_children &&
      (rn.children || []).length >= rn.opts.max_children
    )

    const add_btn_style = {
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      top: 'calc(100% - 1rem)',
    }

    function click(ev) {
      select_node && select_node(rn.node)
      ev.stopPropagation()
    }

    return (
      <div ref={ref}
           class="render-node"
           style={{
             visibility: rn.layout ? 'visible' : 'hidden',
             position: 'absolute',
             top: `${rn.layout && rn.layout.y}px`,
             left: `${rn.layout && rn.layout.x}px`,
           }}
      >
        <div className="group"
             style={{
               position: 'relative',
               paddingBottom: children_type === 'indexed' ? '2rem' : '',
             }}
        >
          <div style={node_styles(is_selected)}
               onClick={click}
          >
            {rn.node.node_type === 'Pseudo' && (
              <Pseudo rn={rn} />
            )}

            {NodeType && (
              <NodeType />
            )}
          </div>

          {children_type === 'indexed' && (
            <AddChildBtn rn={rn}
                         open_node_picker={open_node_picker}
                         disabled={at_max_children}
                         style={add_btn_style} />
          )}
        </div>

        {/* {rn.opts.children_type === 'named' && (
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
        )} */}
      </div>
    )
  },
)

export default RenderNode
