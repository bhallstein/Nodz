import {useRef} from 'react'
import PlusCircleOutline from 'simple-react-heroicons/icons/PlusCircleOutline'

export default function AddChildBtn({node, open_node_picker, disabled}) {
  const ref = useRef()

  return (
    <div ref={ref}
         className="hover-reveal"
         style={{
           cursor: disabled ? 'default' : 'pointer',
           position: 'absolute',
           left: '50%',
           top: 'calc(100% - 1rem)',
           transform: 'translateX(-50%)',
           fontSize: '16px',
           color: disabled ? '#888' : 'inherit',
         }}
         onClick={disabled ? null : ev => {
           ev.stopPropagation()
           open_node_picker(node.ref, ref)
         }}
    >
      <PlusCircleOutline />
    </div>
  )
}