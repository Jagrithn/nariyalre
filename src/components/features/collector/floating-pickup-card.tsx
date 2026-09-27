import { Landmark, MapPin, Nut, Store, Timer, ShoppingBasket } from "lucide-react"

import { SwipeToAccept } from "@/components/features/collector/swipe-to-accept"
import { Badge } from "@/components/ui/badge"
import { formatDistanceKm } from "@/lib/geo"
import { SHELLS_PER_KG, slotMeta } from "@/lib/constants"
import type { LocationType, Pickup } from "@/lib/types"

const TYPE_META: Record<LocationType, { label: string; icon: typeof Landmark }> = {
  temple: { label: "Temple", icon: Landmark },
  vendor: { label: "Vendor", icon: Store },
  market: { label: "Market", icon: ShoppingBasket },
}

export function FloatingPickupCard({
  pickup,
  distanceKm,
  etaMin,
  onAccept,
}: {
  pickup: Pickup
  distanceKm: number
  etaMin: number
  onAccept: () => void
}) {
  const type = TYPE_META[pickup.location_type ?? "vendor"]
  const shells = pickup.requested_kg * SHELLS_PER_KG

  return (
    <div className="rounded-3xl border bg-card p-4 shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex size-8 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-700 dark:text-emerald-300">
              <type.icon className="size-4" />
            </span>
            <p className="text-sm font-semibold">{type.label} pickup</p>
          </div>
          <p className="mt-1.5 flex items-start gap-1.5 text-xs text-muted-foreground">
            <MapPin className="mt-0.5 size-3.5 shrink-0" />
            {pickup.address_text}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-emerald-700 dark:text-emerald-300">
            {slotMeta(pickup.requested_slot).label}
          </Badge>
          <Badge variant="success">{pickup.requested_kg} kg</Badge>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="flex items-center gap-1.5 rounded-xl bg-muted/60 px-3 py-2 text-xs">
          <Timer className="size-3.5 text-emerald-600" />
          <span>
            <b>{formatDistanceKm(distanceKm)}</b> · ~{etaMin} min
          </span>
        </div>
        <div className="flex items-center gap-1.5 rounded-xl bg-muted/60 px-3 py-2 text-xs">
          <Nut className="size-3.5 text-emerald-600" />
          <span>
            <b>{shells.toLocaleString("en-IN")}</b> shells
          </span>
        </div>
      </div>

      <div className="mt-3.5">
        <SwipeToAccept onComplete={onAccept} label="Swipe to accept job" />
      </div>
    </div>
  )
}