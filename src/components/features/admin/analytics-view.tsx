"use client"

import { Factory, HandCoins, PackagePlus } from "lucide-react"

import {
  TierBarChart,
  ThroughputChart,
  YieldDonut,
} from "@/components/features/admin/analytics-charts"
import { MetricCard } from "@/components/features/admin/metric-card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { mockDepotInventory, mockDistributionLogs } from "@/lib/mockData"
import { cocopeatBlocks, dailyThroughput, tierDispatched, tierTotals, yieldBreakdown } from "@/lib/analytics"
import { formatDateTime, formatKg } from "@/lib/formats"
import { MATERIAL_META, TIER_META } from "@/lib/tiers"
import { useAdminStore } from "@/lib/stores/admin"

export function AnalyticsView() {
  const storeBatches = useAdminStore((s) => s.batches)
  const storeLogs = useAdminStore((s) => s.dispatchLogs)

  const batches = [...storeBatches, ...mockDepotInventory]
  const logs = [...storeLogs, ...mockDistributionLogs]

  const totals = tierTotals(logs)
  const yields = yieldBreakdown(batches)
  const series = dailyThroughput(batches)
  const tierData = tierDispatched(logs)
  const blocks = cocopeatBlocks(totals.tier3Kg)

  const avg = Math.round(
    series.reduce((sum, d) => sum + d.kg, 0) / Math.max(1, series.length)
  )
  const peak = Math.max(...series.map((d) => d.kg))

  const recent = [...logs]
    .sort(
      (a, b) =>
        new Date(b.dispatched_at).getTime() - new Date(a.dispatched_at).getTime()
    )
    .slice(0, 5)

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          icon={Factory}
          accent="bg-emerald-600/10 text-emerald-700 dark:text-emerald-300"
          title="Tier 1 · Industrial sales"
          value={formatKg(totals.tier1Kg)}
          sub={`${logs.filter((l) => l.tier === "tier1_b2b").length} b2b shipments`}
          trend="+12%"
        />
        <MetricCard
          icon={HandCoins}
          accent="bg-lime-600/10 text-lime-700 dark:text-lime-300"
          title="Tier 2 · SHG allocations"
          value={formatKg(totals.tier2Kg)}
          sub="Graded shells & coir to artisan groups"
          trend="3 groups"
        />
        <MetricCard
          icon={PackagePlus}
          accent="bg-amber-600/10 text-amber-700 dark:text-amber-300"
          title="Tier 3 · In-house production"
          value={formatKg(totals.tier3Kg)}
          sub={`${blocks} cocopeat blocks + bio-compost`}
          trend="in-house"
        />
      </div>

      <div className="rounded-2xl border bg-card p-5 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold">Daily depot throughput</p>
            <p className="text-xs text-muted-foreground">
              Raw coconut waste entering the weighbridge · last 14 days
            </p>
          </div>
          <div className="flex gap-2 text-xs">
            <span className="rounded-full bg-emerald-600/10 px-2.5 py-1 font-semibold text-emerald-700">
              Avg {avg} kg
            </span>
            <span className="rounded-full bg-amber-600/10 px-2.5 py-1 font-semibold text-amber-700">
              Peak {peak} kg
            </span>
          </div>
        </div>
        <ThroughputChart data={series} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <p className="text-sm font-semibold">Processed yield split</p>
          <p className="mb-3 text-xs text-muted-foreground">
            Fibre · shells · pith recovered across batches
          </p>
          <YieldDonut yields={yields} />
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <p className="text-sm font-semibold">Dispatched by tier</p>
          <p className="mb-3 text-xs text-muted-foreground">
            Commercial off-take across the three channels
          </p>
          <TierBarChart data={tierData} />
        </div>
      </div>

      <div className="rounded-2xl border bg-card shadow-sm">
        <div className="border-b px-5 py-4">
          <p className="text-sm font-semibold">Recent dispatches</p>
          <p className="text-xs text-muted-foreground">
            Latest movement out of the depot
          </p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>When</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Material</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Destination</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recent.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="text-muted-foreground">
                  {formatDateTime(log.dispatched_at)}
                </TableCell>
                <TableCell>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${TIER_META[log.tier].badgeClass}`}
                  >
                    {TIER_META[log.tier].short}
                  </span>
                </TableCell>
                <TableCell>{MATERIAL_META[log.material_type].label}</TableCell>
                <TableCell className="text-right font-semibold">
                  {formatKg(log.quantity_kg)}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {log.destination_name}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}