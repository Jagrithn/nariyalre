import { MapPin } from "lucide-react"

import { cn } from "@/lib/utils"

function latLngToTile(lat: number, lng: number, zoom: number) {
  const n = Math.pow(2, zoom)
  const x = ((lng + 180) / 360) * n
  const latRad = (lat * Math.PI) / 180
  const y =
    ((1 -
      Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) /
      2) *
    n
  return { x, y, n }
}

type StaticMapProps = {
  lat: number
  lng: number
  zoom?: number
  height?: number
  className?: string
  showPin?: boolean
  pinLabel?: string
}

export function StaticMap({
  lat,
  lng,
  zoom = 15,
  height = 220,
  className,
  showPin = true,
  pinLabel,
}: StaticMapProps) {
  const { x, y, n } = latLngToTile(lat, lng, zoom)
  const tileX = Math.floor(x)
  const tileY = Math.floor(y)
  const px = (x - tileX) * 256
  const py = (y - tileY) * 256

  const width = 360
  const left = (i: number) => i * 256 - px + width / 2
  const top = (j: number) => j * 256 - py + height / 2

  const tiles = []
  for (let i = -1; i <= 2; i++) {
    for (let j = -1; j <= 2; j++) {
      const wrapX = ((tileX + i) % n + n) % n
      const tileJ = tileY + j
      if (tileJ < 0 || tileJ >= Math.floor(n)) continue
      tiles.push(
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`${wrapX}-${tileJ}`}
          src={`https://tile.openstreetmap.org/${zoom}/${wrapX}/${tileJ}.png`}
          alt=""
          width={256}
          height={256}
          draggable={false}
          className="absolute select-none"
          style={{ left: left(tileX + i), top: top(tileY + j) }}
        />
      )
    }
  }

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border bg-emerald-950/5",
        className
      )}
      style={{ height }}
    >
      {tiles}
      {showPin && (
        <>
          <span className="absolute left-1/2 top-1/2 -z-0 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-600/25 blur-md" />
          <span className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2">
            <MapPin className="size-9 text-emerald-600 drop-shadow-md" />
          </span>
          {pinLabel && (
            <span className="absolute left-1/2 top-1/2 z-10 mt-9 -translate-x-1/2 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap text-foreground shadow-md">
              {pinLabel}
            </span>
          )}
        </>
      )}
      <span className="absolute bottom-1 right-2 rounded bg-white/70 px-1 text-[9px] text-muted-foreground backdrop-blur-sm">
        © OpenStreetMap
      </span>
    </div>
  )
}