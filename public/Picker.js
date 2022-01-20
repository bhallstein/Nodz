export default function Picker({node_types, picker, wrapper_ref, CustomPicker, add_node}) {
  const rect = picker.dot_adder_ref.current.getBoundingClientRect()
  const wrapper_rect = wrapper_ref.current.getBoundingClientRect()

  return (
    <div style={{
      position: 'absolute',
      left: `${rect.left - wrapper_rect.left + 32}px`,
      top: `${rect.top - wrapper_rect.top - 10}px`,
    }}
    >
      {CustomPicker && (
        <CustomPicker node_types={node_types}
                      parent={picker.parent_node} />
      )}

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
                   onClick={() => add_node(picker.parent_node, {node_type: typename})}
              >
                {typename}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
