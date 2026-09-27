import { cn } from "@/lib/utils"

type MockQrProps = {
  seed: string
  size?: number
  className?: string
}

function hash(seed: string, i: number, j: number): number {
  const s = `${seed}:${i}:${j}:${seed.length}`
  let h = 2166136261
  for (let k = 0; k < s.length; k++) {
    h ^= s.charCodeAt(k)
    h = Math.imul(h, 16777619)
  }
  return h
}

export function MockQr({ seed, size = 21, className }: MockQrProps) {
  const cells = Array.from({ length: size * size }, (_, idx) => {
    const i = Math.floor(idx / size)
    const j = idx % size
    const inFinder =
      (i < 7 && j < 7) ||
      (i < 7 && j >= size - 7) ||
      (i >= size - 7 && j < 7)
    if (inFinder) {
      const fi = i < 7 && j < 7 ? { i: 0, j: 0 } : i < 7 ? { i: 0, j: size - 7 } : { i: size - 7, j: 0 }
      const di = i - fi.i
      const dj = j - fi.j
      const ring = di < 1 || di > 5 || dj < 1 || dj > 5
      const core = di >= 2 && di <= 4 && dj >= 2 && dj <= 4
      return ring || core
    }
    return (hash(seed, i, j) & 2) === 0
  })

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={cn("h-auto w-full", className)}
      role="img"
      aria-label="Simulated QR drop-off code"
      shapeRendering="crispEdges"
    >
      {cells.map((on, idx) => {
        const i = Math.floor(idx / size)
        const j = idx % size
        if (!on) return null
        return <rect key={idx} x={j} y={i} width={1.05} height={1.05} fill="#0f172a" />
      })}
    </svg>
  )
}