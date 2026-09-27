import { ClipboardList } from "lucide-react"

import { PickupRow } from "@/components/features/generator/pickup-row"
import type { Pickup } from "@/lib/types"

export function RecentPickups({ pickups }: { pickups: Pickup[] }) {
  if (pickups.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-3xl border border-dashed bg-card/50 px-6 py-10 text-center">
        <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <ClipboardList className="size-6" />
        </span>
        <p className="text-sm font-medium">No pickups yet</p>
        <p className="max-w-[240px] text-xs text-muted-foreground">
          {`Tap "Request pickup" to schedule your first collection.`}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2.5">
      {pickups.map((p) => (
        <PickupRow key={p.id} pickup={p} highlight={p.id.startsWith("pk_opt_")} />
      ))}
    </div>
  )
}