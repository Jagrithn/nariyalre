"use client"

import { useMemo, useState, useTransition } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { Loader2, Navigation } from "lucide-react"

import { FloatingPickupCard } from "@/components/features/collector/floating-pickup-card"
import type { PickupMapProps } from "@/components/features/collector/pickup-map"
import { acceptPickupAction } from "@/actions/mutations"
import { useGeolocation } from "@/hooks/use-geolocation"
import { usePendingPickups } from "@/hooks/use-collector"
import { pickupDistanceKm } from "@/lib/routing"
import { etaMinutes } from "@/lib/geo"
import { CURRENT_COLLECTOR_ID, SLOTS } from "@/lib/constants"
import { notify } from "@/lib/notify"
import type { PickupSlot } from "@/lib/types"
import { useCollectorStore } from "@/lib/stores/collector"
import { cn } from "@/lib/utils"

const PickupMap = dynamic<PickupMapProps>(
  () =>
    import("@/components/features/collector/pickup-map").then(
      (m) => m.PickupMap
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[300px] w-full items-center justify-center bg-muted/40">
        <Loader2 className="size-6 animate-spin text-emerald-600" />
      </div>
    ),
  }
)

const FALLBACK_ORIGIN = { lat: 13.0524, lng: 80.2509 }

export function AvailableJobsView() {
  const { data: pickups = [] } = usePendingPickups()
  const { coords } = useGeolocation()
  const acceptJob = useCollectorStore((s) => s.acceptJob)
  const router = useRouter()
  const [, startTransition] = useTransition()

  const origin = coords ?? FALLBACK_ORIGIN

  const withDistance = useMemo(
    () =>
      pickups
        .map((p) => ({
          pickup: p,
          distanceKm: pickupDistanceKm(p, origin),
        }))
        .sort((a, b) => a.distanceKm - b.distanceKm),
    [pickups, origin]
  )

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [slotFilter, setSlotFilter] = useState<"all" | PickupSlot>("all")
  const selected = withDistance.find((d) => d.pickup.id === selectedId)
  const focusPickup = selected?.pickup ?? withDistance[0]?.pickup

  const visible =
    slotFilter === "all"
      ? withDistance
      : withDistance.filter((d) => d.pickup.requested_slot === slotFilter)

  const slotCounts = SLOTS.map((s) => ({
    slot: s,
    count: withDistance.filter((d) => d.pickup.requested_slot === s.id).length,
  }))
  const bundled = slotCounts
    .filter((s) => s.slot.id !== "now" && s.count >= 2)
    .sort((a, b) => b.count - a.count)[0]

  const handleAccept = (pickupId: string) => {
    const entry = withDistance.find((d) => d.pickup.id === pickupId)
    if (!entry) return
    acceptJob(entry.pickup)
    void acceptPickupAction(pickupId, CURRENT_COLLECTOR_ID).catch(() => {})
    notify(
      entry.pickup.generator_id,
      "Pickup accepted",
      `Ravi is heading to your ${entry.pickup.requested_kg} kg pickup.`,
      "pickup_status"
    )
    startTransition(() => router.push(`/collector/route/${pickupId}`))
  }

  return (
    <div className="relative -mx-4 flex min-h-dvh flex-col">
      <div className="relative h-[52dvh] min-h-[360px] w-full">
        <PickupMap
          center={origin}
          pickups={withDistance.map((d) => ({
            id: d.pickup.id,
            lat: d.pickup.geo_lat,
            lng: d.pickup.geo_lng,
            weightKg: d.pickup.requested_kg,
            selected: d.pickup.id === selectedId,
          }))}
          focus={focusPickup ? { lat: focusPickup.geo_lat, lng: focusPickup.geo_lng } : null}
          focusKey={selectedId ?? "initial"}
          onPickupClick={(id) => setSelectedId(id)}
          className="h-full w-full"
        />
        <button
          type="button"
          onClick={() => setSelectedId(null)}
          className={cn(
            "absolute top-4 right-4 z-[500] inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-2 text-xs font-semibold text-emerald-700 shadow-md backdrop-blur",
            !selectedId && "hidden"
          )}
        >
          <Navigation className="size-3.5" />
          Reset
        </button>
      </div>

      <div className="relative z-10 -mt-8 flex-1">
        <div className="mx-4 flex items-center justify-between px-1">
          <p className="text-sm font-semibold">
            {visible.length} job{visible.length === 1 ? "" : "s"} nearby
          </p>
          <p className="text-[11px] text-muted-foreground">
            {coords ? "Live GPS" : "Using network location"}
          </p>
        </div>

        <div className="scrollbar-none mt-3 flex gap-1.5 overflow-x-auto px-5">
          <button
            type="button"
            onClick={() => setSlotFilter("all")}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
              slotFilter === "all"
                ? "border-emerald-600 bg-emerald-600 text-white"
                : "border-input bg-background text-muted-foreground"
            )}
          >
            All
          </button>
          {SLOTS.filter((s) => s.id !== "now").map((s) => {
            const count = slotCounts.find((c) => c.slot.id === s.id)?.count ?? 0
            return (
              <button
                key={s.id}
                type="button"
                onClick={() =>
                  setSlotFilter(slotFilter === s.id ? "all" : s.id)
                }
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                  slotFilter === s.id
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : "border-input bg-background text-muted-foreground"
                )}
              >
                {s.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 text-[10px]",
                    slotFilter === s.id
                      ? "bg-white/20"
                      : "bg-emerald-600/10 text-emerald-700"
                  )}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {bundled && slotFilter === "all" && (
          <button
            type="button"
            onClick={() => setSlotFilter(bundled.slot.id)}
            className="mx-5 mt-3 flex w-[calc(100%-2.5rem)] items-center justify-between rounded-xl bg-emerald-600/10 px-3 py-2 text-left text-xs font-medium text-emerald-700 dark:text-emerald-300"
          >
            <span>
              {bundled.count} {bundled.slot.label.toLowerCase()} jobs share an area —
              combined route recommended
            </span>
            <span className="text-[10px] font-bold">Filter →</span>
          </button>
        )}

        {visible.length === 0 ? (
          <p className="px-5 py-10 text-center text-xs text-muted-foreground">
            No pending pickups in this window.
          </p>
        ) : (
          <div className="scrollbar-none mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-6 pt-1">
            {visible.map(({ pickup, distanceKm }) => {
              const active = pickup.id === selectedId
              return (
                <div
                  key={pickup.id}
                  className={cn(
                    "w-[86%] shrink-0 snap-center transition-opacity",
                    !active && selectedId && "opacity-70"
                  )}
                  onClick={() => setSelectedId(pickup.id)}
                >
                  <FloatingPickupCard
                    pickup={pickup}
                    distanceKm={distanceKm}
                    etaMin={etaMinutes(distanceKm)}
                    onAccept={() => handleAccept(pickup.id)}
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}