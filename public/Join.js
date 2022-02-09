const padding = 3

export default function Join({j}) {
  const w = Math.abs(j.from.x - j.to.x) + padding * 2
  const h = Math.abs(j.from.y - j.to.y) + padding * 2
  const ox = Math.min(j.from.x, j.to.x) - padding
  const oy = Math.min(j.from.y, j.to.y) - padding

  return (
    <svg style={{
      display: 'block',
      position: 'absolute',
      width: `${w}px`,
      height: `${h}px`,
      left: `${ox}px`,
      top: `${oy}px`,
      stroke: 'black',
    }}
    >
      <path d={`
          M ${j.from.x - ox} ${j.from.y - oy}
          L ${j.to.x - ox} ${j.to.y - oy}
        `} />
    </svg>
  )
}
