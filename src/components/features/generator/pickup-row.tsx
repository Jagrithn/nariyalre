import { MapPin } from "lucide-react"

import { PickupStatusBadge } from "@/components/features/generator/pickup-status-badge"
import { formatKg, timeAgo } from "@/lib/formats"
import { slotMeta } from "@/lib/constants"
import type { Pickup } from "@/lib/types"

export function PickupRow({
  pickup,
  highlight = false,
}: {
  pickup: Pickup
  highlight?: boolean
}) {
  const weight = pickup.actual_kg ?? pickup.requested_kg

  return (
    <div
      className={
        highlight
          ? "flex items-center gap-3 rounded-2xl border border-emerald-600/30 bg-emerald-600/5 p-3.5 shadow-sm"
          : "flex items-center gap-3 rounded-2xl border bg-card p-3.5 shadow-sm"
      }
    >
      <span
        className={
          highlight
            ? "inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm"
            : "inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground"
        }
      >
        <MapPin className="size-4.5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold">
            {pickup.address_text ?? "Pickup location"}
          </p>
          <div className="flex shrink-0 items-center gap-1.5">
            <span className="rounded-full border px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
              {slotMeta(pickup.requested_slot).label}
            </span>
            <PickupStatusBadge status={pickup.status} />
          </div>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {formatKg(weight)} · {timeAgo(pickup.created_at)}
        </p>
      </div>
    </div>
  )
}