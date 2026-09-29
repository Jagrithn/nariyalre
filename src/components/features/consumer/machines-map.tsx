"use client"

import { Loader2 } from "lucide-react"
import dynamic from "next/dynamic"

import type { PickupMapProps } from "@/components/features/collector/pickup-map"
import { nearestMachine } from "@/lib/machines"
import type { VendingMachine } from "@/lib/types"

const PickupMap = dynamic<PickupMapProps>(
  () =>
    import("@/components/features/collector/pickup-map").then(
      (m) => m.PickupMap
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[320px] w-full items-center justify-center bg-muted/40">
        <Loader2 className="size-6 animate-spin text-emerald-600" />
      </div>
    ),
  }
)

const MACHINE_COLORS = ["teal", "amber"] as const

export function MachinesMap({
  machines,
  origin,
}: {
  machines: VendingMachine[]
  origin: { lat: number; lng: number } | null
}) {
  const nearest = origin ? nearestMachine(origin) : null
  const center = origin ?? { lat: machines[0]?.lat ?? 13.0346, lng: machines[0]?.lng ?? 80.2675 }

  const pins = machines.map((m, i) => ({
    id: m.id,
    lat: m.lat,
    lng: m.lng,
    label: m.name.split(" ")[0],
    color: m.id === nearest?.id ? "emerald" : (MACHINE_COLORS[i % MACHINE_COLORS.length] as (
      | "emerald"
      | "amber"
      | "teal"
    )),
  }))

  const route: [number, number][] | undefined =
    origin && nearest
      ? [
          [origin.lat, origin.lng],
          [nearest.lat, nearest.lng],
        ]
      : undefined

  return (
    <PickupMap
      center={center}
      zoom={12}
      className="h-[340px] w-full"
      pins={pins}
      route={route}
      focus={origin ?? null}
      focusKey={origin ? "user" : "first"}
    />
  )
}