"use client"

import { useGeneratorPickups } from "@/hooks/use-pickups"
import { useGeneratorStore } from "@/lib/stores/generator"
import { PickupRow } from "@/components/features/generator/pickup-row"
import { cn } from "@/lib/utils"

export function HistoryView() {
  const { data: serverPickups = [] } = useGeneratorPickups()
  const activePickups = useGeneratorStore((s) => s.activePickups)

  const allPickups = [...activePickups, ...serverPickups].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Pickup history</h1>
        <p className="text-xs text-muted-foreground">
          Every request, from request tap to depot weigh-in.
        </p>
      </div>

      <div className={cn(allPickups.length === 0 && "flex min-h-[40vh] items-center justify-center")}>
        {allPickups.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing here yet.</p>
        ) : (
          <div className="space-y-2.5">
            {allPickups.map((p) => (
              <PickupRow
                key={p.id}
                pickup={p}
                highlight={p.id.startsWith("pk_opt_")}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}