"use client"

import { useState } from "react"
import {
  Banknote,
  CircleDollarSign,
  Map as MapIcon,
  List,
  LocateFixed,
  Recycle,
} from "lucide-react"

import { MachinesMap } from "@/components/features/consumer/machines-map"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Skeleton } from "@/components/ui/skeleton"
import { useVendingMachines } from "@/hooks/use-market"
import { useGeolocation } from "@/hooks/use-geolocation"
import {
  DEFAULT_MACHINE_PAYOUT_PER_KG,
  depositEstimate,
  machineDistanceKm,
  materialLabel,
  nearestMachine,
} from "@/lib/machines"
import { formatDistanceKm } from "@/lib/geo"
import { formatCurrency } from "@/lib/formats"
import { cn } from "@/lib/utils"

const MACHINE_COLORS = ["bg-amber-500", "bg-slate-800", "bg-emerald-600", "bg-sky-600"] as const

export function MachinesView() {
  const [tab, setTab] = useState<"list" | "map">("list")
  const [kg, setKg] = useState<number[]>([2])
  const { data: machines, isLoading } = useVendingMachines()
  const { coords, status, refresh } = useGeolocation()

  const nearest = coords ? nearestMachine(coords) : null
  const estimate = depositEstimate(kg[0], nearest?.payout_per_kg ?? DEFAULT_MACHINE_PAYOUT_PER_KG)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Drop waste, earn back</h1>
        <p className="text-xs text-muted-foreground">
          Smart vending machines take shells, pith & fibre and pay instantly.
        </p>
      </div>

      <section className="rounded-3xl border bg-gradient-to-br from-emerald-600 to-teal-700 p-4 text-white shadow-sm">
        <div className="flex items-center gap-2">
          <Banknote className="size-4" />
          <p className="text-xs font-semibold">Instant payout machine</p>
        </div>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className="text-[11px] opacity-80">Your deposit estimate</p>
            <p className="mt-0.5 text-3xl font-extrabold tracking-tight">
              {formatCurrency(estimate)}
            </p>
          </div>
          <p className="rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-bold">
            {kg[0]} kg
          </p>
        </div>
        <div className="mt-3">
          <Slider value={kg} onValueChange={setKg} min={0} max={5} step={0.5} />
        </div>
        <p className="mt-3 text-center text-[11px] opacity-90">
          {formatCurrency(nearest?.payout_per_kg ?? DEFAULT_MACHINE_PAYOUT_PER_KG)}/kg · drop it, get paid on the spot
        </p>
      </section>

      <div className="grid grid-cols-2 gap-2">
        <Button
          variant={tab === "list" ? "default" : "outline"}
          className="gap-1.5 rounded-2xl"
          onClick={() => setTab("list")}
        >
          <List className="size-4" /> Nearby
        </Button>
        <Button
          variant={tab === "map" ? "default" : "outline"}
          className="gap-1.5 rounded-2xl"
          onClick={() => setTab("map")}
        >
          <MapIcon className="size-4" /> Map
        </Button>
      </div>

      {tab === "map" ? (
        <div className="overflow-hidden rounded-3xl border shadow-sm">
          <MachinesMap machines={machines ?? []} origin={coords} />
          {!coords && status !== "denied" && (
            <button
              type="button"
              onClick={refresh}
              className="flex w-full items-center justify-center gap-1.5 py-3 text-xs font-semibold text-emerald-700 hover:bg-muted"
            >
              <LocateFixed className="size-3.5" /> Enable location for nearest route
            </button>
          )}
        </div>
      ) : isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-3xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {machines?.map((m, i) => {
            const isNearest = m.id === nearest?.id
            const distance = coords ? machineDistanceKm(m, coords) : null
            return (
              <div
                key={m.id}
                className={cn(
                  "rounded-3xl border bg-card p-4 shadow-sm",
                  isNearest && "border-emerald-600 ring-1 ring-emerald-600/30"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "inline-flex size-10 shrink-0 items-center justify-center rounded-2xl text-white",
                        MACHINE_COLORS[i % MACHINE_COLORS.length]
                      )}
                    >
                      <Recycle className="size-5" />
                    </span>
                    <div>
                      <p className="flex items-center gap-1.5 text-sm font-semibold leading-tight">
                        {m.name}
                        {isNearest && (
                          <Badge className="h-4 text-[9px]">Nearest</Badge>
                        )}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {m.address}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1">
                    {m.accepts.map((mat) => (
                      <Badge key={mat} variant="secondary" className="text-[9px]">
                        {materialLabel(mat)}
                      </Badge>
                    ))}
                  </div>
                  <p className="shrink-0 text-[10px] font-semibold text-muted-foreground">
                    {distance !== null ? `${formatDistanceKm(distance)} away` : "24×7 drop"}
                  </p>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        m.fill_level > 75
                          ? "bg-red-500"
                          : m.fill_level > 45
                            ? "bg-amber-500"
                            : "bg-emerald-600"
                      )}
                      style={{ width: `${m.fill_level}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground">
                    {m.fill_level}% full
                  </span>
                </div>

                <p className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                  <CircleDollarSign className="size-3.5" />
                  Pays {formatCurrency(m.payout_per_kg)} per kg
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}