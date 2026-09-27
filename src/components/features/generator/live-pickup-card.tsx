"use client"

import { useEffect, useRef, useState } from "react"
import { Navigation, Radio } from "lucide-react"

import { getLiveLocationAction } from "@/actions/tracking"
import { StaticMap } from "@/components/ui/static-map"
import { DEFAULT_DEPOT_COORDS } from "@/lib/constants"
import { etaMinutes, formatDistanceKm, haversineKm } from "@/lib/geo"
import { subscribeToPickup } from "@/lib/realtime"
import { isSupabaseConfigured } from "@/lib/supabase/config"
import { cn } from "@/lib/utils"
import type { Pickup } from "@/lib/types"

const SIM_MS = 120000

function lerp(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
  t: number
): { lat: number; lng: number } {
  return {
    lat: a.lat + (b.lat - a.lat) * t,
    lng: a.lng + (b.lng - a.lng) * t,
  }
}

export function LivePickupCard({ pickup }: { pickup: Pickup }) {
  const startedAt = useRef(Date.now())
  const [live, setLive] = useState<{ lat: number; lng: number } | null>(null)

  const eligible =
    pickup.status === "accepted" || pickup.status === "in_transit"

  useEffect(() => {
    if (!eligible || !isSupabaseConfigured()) return
    void getLiveLocationAction(pickup.id).then((res) => {
      if (res.ok && res.location) setLive({ lat: res.location.lat, lng: res.location.lng })
    })
    return subscribeToPickup(pickup.id, (loc) =>
      setLive({ lat: loc.lat, lng: loc.lng })
    )
  }, [pickup.id, eligible])

  if (!eligible) return null

  const pickupPos = { lat: pickup.geo_lat, lng: pickup.geo_lng }
  const inbound = pickup.status === "accepted"
  const start = inbound ? DEFAULT_DEPOT_COORDS : pickupPos
  const end = inbound ? pickupPos : DEFAULT_DEPOT_COORDS
  const full = Math.max(haversineKm(start, end), 0.01)
  const t = Math.min((Date.now() - startedAt.current) / SIM_MS, 1)
  const pos = live ?? lerp(start, end, t)
  const remaining = Math.max(haversineKm(pos, end), 0)
  const progress = Math.min(1 - remaining / full, 1)
  const arrived = !live && t >= 1

  return (
    <section className="overflow-hidden rounded-3xl border bg-card shadow-sm">
      <div className="flex items-center justify-between px-4 pt-3.5">
        <div className="flex items-center gap-2">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-600 opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-600" />
          </span>
          <p className="text-xs font-bold">Live · Ravi Shankar</p>
        </div>
        <span className="rounded-full bg-emerald-600/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
          {inbound ? "On the way to you" : "Returning to depot"}
        </span>
      </div>

      <div className="px-4 pt-3">
        <StaticMap
          lat={pos.lat}
          lng={pos.lng}
          zoom={inbound ? 14 : 13}
          height={130}
          pinLabel="Ravi"
        />
      </div>

      <div className="px-4 pt-3 pb-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-lg font-bold">
              {arrived
                ? inbound
                  ? "Arriving at your stop"
                  : "Arrived at the depot"
                : `${formatDistanceKm(remaining)} away`}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {inbound
                ? `En route for your ${pickup.requested_kg} kg pickup`
                : `${pickup.actual_kg ?? pickup.requested_kg} kg loaded · ${
                    arrived ? "at depot" : `${etaMinutes(remaining)} min to depot`
                  }`}
            </p>
          </div>
          {!arrived && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
              <Navigation className="size-3 text-emerald-600" />
              {etaMinutes(remaining)} min
            </span>
          )}
        </div>
        <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-1000",
              arrived && "animate-pulse"
            )}
            style={{ width: `${Math.max(progress * 100, 4)}%` }}
          />
        </div>
      </div>

      {!isSupabaseConfigured() && (
        <p className="flex items-center gap-1.5 border-t bg-muted/40 px-4 py-2 text-[10px] text-muted-foreground">
          <Radio className="size-3" />
          Simulated live tracking — connect Supabase for real GPS from the collector
        </p>
      )}
    </section>
  )
}