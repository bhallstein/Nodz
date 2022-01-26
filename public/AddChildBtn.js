import {useRef} from 'react'
import PlusCircleOutline from 'simple-react-heroicons/icons/PlusCircleOutline'

export default function AddChildBtn({
  node,
  open_node_picker,
  disabled,
  style,
}) {
  const ref = useRef()

  return (
    <div ref={ref}
         className={node ? 'hover-reveal' : ''}
         style={{
           cursor: disabled ? 'default' : 'pointer',
           fontSize: '16px',
           color: disabled ? '#888' : 'inherit',
           ...style,
         }}
         onClick={disabled ? null : ev => {
           ev.stopPropagation()
           open_node_picker(node, ref)
         }}
    >
      <PlusCircleOutline />
    </div>
  )
}