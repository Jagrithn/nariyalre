"use client"

import { useMemo, useState } from "react"
import { Plus } from "lucide-react"

import { DispatchDialog } from "@/components/features/admin/dispatch-dialog"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockDistributionLogs } from "@/lib/mockData"
import { formatDateTime, formatKg } from "@/lib/formats"
import { MATERIAL_META, TIER_META } from "@/lib/tiers"
import { useAdminStore } from "@/lib/stores/admin"
import type { DistributionLog, DistributionTier } from "@/lib/types"

type Filter = DistributionTier | "all"

export function DistributionView() {
  const storeLogs = useAdminStore((s) => s.dispatchLogs)
  const [filter, setFilter] = useState<Filter>("all")
  const [dialogOpen, setDialogOpen] = useState(false)

  const logs = useMemo(
    () =>
      [...storeLogs, ...mockDistributionLogs].sort(
        (a, b) =>
          new Date(b.dispatched_at).getTime() -
          new Date(a.dispatched_at).getTime()
      ),
    [storeLogs]
  )

  const visible = filter === "all" ? logs : logs.filter((l) => l.tier === filter)

  const totals = (tier: DistributionTier | "all") =>
    (tier === "all" ? logs : logs.filter((l) => l.tier === tier)).reduce(
      (sum, l) => sum + l.quantity_kg,
      0
    )

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="tier1_b2b">Tier 1</TabsTrigger>
            <TabsTrigger value="tier2_shg">Tier 2</TabsTrigger>
            <TabsTrigger value="tier3_inhouse">Tier 3</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus />
          New dispatch
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {(["tier1_b2b", "tier2_shg", "tier3_inhouse"] as DistributionTier[]).map(
          (tier) => {
            const count = logs.filter((l) => l.tier === tier).length
            return (
              <button
                key={tier}
                type="button"
                onClick={() => setFilter(tier)}
                className="rounded-2xl border bg-card p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="text-xs font-semibold text-muted-foreground">
                  {TIER_META[tier].label}
                </p>
                <p className="mt-1.5 text-2xl font-extrabold tracking-tight">
                  {formatKg(totals(tier))}
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {count} dispatch{count === 1 ? "" : "es"} · {TIER_META[tier].blurb}
                </p>
              </button>
            )
          }
        )}
      </div>

      <div className="rounded-2xl border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dispatched</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Material</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Destination</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((log: DistributionLog) => (
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

      <DispatchDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}