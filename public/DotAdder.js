import {useRef} from 'react'
import PlusCircleOutline from 'simple-react-heroicons/icons/PlusCircleOutline'

export default function DotAdder({node, open_node_picker}) {
  const ref = useRef()

  return (
    <div ref={ref}
         className="hover-reveal"
         style={{
           cursor: 'pointer',
           position: 'absolute',
           left: '50%',
           top: 'calc(100% - 1rem)',
           transform: 'translateX(-50%)',
           fontSize: '16px',
         }}
         onClick={ev => {
           ev.stopPropagation()
           open_node_picker(node.ref, ref)
         }}
    >
      <PlusCircleOutline />
    </div>
  )
}