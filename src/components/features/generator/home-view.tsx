"use client"

import { useState } from "react"
import { Archive, ArrowUpRight, Plus, Wind } from "lucide-react"

import { RequestPickupSheet } from "@/components/features/generator/request-pickup-sheet"
import { LivePickupCard } from "@/components/features/generator/live-pickup-card"
import { useGeneratorPickups } from "@/hooks/use-pickups"
import { computeImpactStats, greetingForHour } from "@/lib/impact"
import { useGeneratorStore } from "@/lib/stores/generator"
import { cn } from "@/lib/utils"
import { formatKg } from "@/lib/formats"
import { RecentPickups } from "@/components/features/generator/recent-pickups"

export function HomeView() {
  const { data: serverPickups = [] } = useGeneratorPickups()
  const activePickups = useGeneratorStore((s) => s.activePickups)
  const [sheetOpen, setSheetOpen] = useState(false)

  const allPickups = [...activePickups, ...serverPickups]
  const stats = computeImpactStats(allPickups)
  const hour = new Date().getHours()
  const livePickup = allPickups.find(
    (p) => p.status === "accepted" || p.status === "in_transit"
  )

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-600 to-teal-700 p-6 text-white shadow-lg">
        <div className="pointer-events-none absolute -top-10 -right-10 size-40 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 left-10 size-44 rounded-full bg-lime-300/20 blur-3xl" />

        <div className="relative">
          <p className="text-sm font-medium text-emerald-50">
            {greetingForHour(hour)}, Mariyamma Trust
          </p>
          <p className="mt-0.5 text-xs text-emerald-100/80">
            {stats.todayKg} kg diverted from landfill so far today
          </p>

          <div className="mt-7 flex flex-col items-center">
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              aria-label="Request a pickup"
              className="group relative"
            >
              <span className="absolute inset-0 animate-ping rounded-full bg-white/30 [animation-duration:2.5s]" />
              <span className="absolute -inset-2 rounded-full border-2 border-white/40" />
              <span className="relative flex size-20 items-center justify-center rounded-full bg-white text-emerald-700 shadow-xl transition-transform group-hover:scale-105 group-active:scale-95">
                <Plus className="size-9" strokeWidth={2.5} />
              </span>
            </button>
            <p className="mt-3 text-sm font-semibold">Request pickup</p>
            <p className="text-[11px] text-emerald-100/80">
              1 tap → GPS-tagged → collector notified
            </p>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/15 p-3 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-50/90">
                <Wind className="size-3.5" />
                CO₂ saved today
              </div>
              <p className="mt-1 text-xl font-bold">{formatKg(stats.todayCo2Kg)}</p>
            </div>
            <div className="rounded-2xl bg-white/15 p-3 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-50/90">
                <Archive className="size-3.5" />
                Shells diverted
              </div>
              <p className="mt-1 text-xl font-bold">
                {stats.totalShells.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {livePickup && <LivePickupCard pickup={livePickup} />}

      <section className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-base font-semibold">Recent pickups</h2>
          <p className="text-xs text-muted-foreground">
            {activePickups.length > 0
              ? "Includes your offline requests in queue"
              : "Your waste flow at a glance"}
          </p>
        </div>
        <a
          href="/generator/history"
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium",
            "text-emerald-700 hover:bg-emerald-600/10 dark:text-emerald-300"
          )}
        >
          History
          <ArrowUpRight className="size-3.5" />
        </a>
      </section>

      <RecentPickups pickups={allPickups.slice(0, 4)} />

      <RequestPickupSheet open={sheetOpen} onOpenChange={setSheetOpen} />
    </div>
  )
}