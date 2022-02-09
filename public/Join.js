const padding = 3

function path__straight(from, to, ox, oy) {
  return `L ${to.x - ox} ${to.y - oy}`
}

function path__bezier(from, to, ox, oy) {
  const diff = Math.min(
    Math.abs(from.x - to.x),
    Math.abs(from.y - to.y),
  )
  const bezier_vertical_distance = diff / 2

  return `
    C
    ${from.x - ox} ${from.y - oy + bezier_vertical_distance},
    ${to.x - ox} ${to.y - oy - bezier_vertical_distance},
    ${to.x - ox} ${to.y - oy}
  `
}

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
      fill: 'none',
    }}
    >
      <path d={`
        M ${j.from.x - ox} ${j.from.y - oy}
        ${path__bezier(j.from, j.to, ox, oy)}
      `} />
    </svg>
  )
}
