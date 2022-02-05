export default function NodePicker({
  node_types,
  picker,
  wrapper_ref,
  CustomPicker,
  add_node,
}) {
  const rect = picker.add_node_btn_ref.current.getBoundingClientRect()
  const wrapper_rect = wrapper_ref.current.getBoundingClientRect()

  return (
    <div style={{
      position: 'absolute',
      left: `${rect.left - wrapper_rect.left + 32}px`,
      top: `${rect.top - wrapper_rect.top - 10}px`,
    }}
    >
      {!CustomPicker && (
        <div style={{
          backgroundColor: 'white',
          boxShadow: '0px 0px 3px 1px #999',
        }}
        >
          {Object.keys(node_types).map(typename => (
            <div key={typename}
                 style={{borderBottom: '1px solid #eaeaea'}}
            >
              <div style={{padding: '0.5rem 1rem', cursor: 'pointer'}}
                   onClick={() => add_node(picker.parent, {node_type: typename})}
              >
                {typename}
              </div>
            </div>
          ))}
        </div>
      )}

      {CustomPicker && (
        <CustomPicker node_types={node_types}
                      parent={picker.parent}
                      add_node={add_node} />
      )}
    </div>
  )
}
