"use client"

import Image from "next/image"
import { CheckCircle2 } from "lucide-react"

import { PickupStatusBadge } from "@/components/features/generator/pickup-status-badge"
import { useCollectorPickups } from "@/hooks/use-collector"
import { formatCurrency, timeAgo } from "@/lib/formats"
import { RATE_PER_KG } from "@/lib/constants"
import { LOCATION_IMAGE } from "@/lib/imagery"
import { useCollectorStore } from "@/lib/stores/collector"
import { pickupWeight } from "@/lib/impact"
import type { Pickup } from "@/lib/types"

export function TripsView() {
  const { data: serverPickups = [] } = useCollectorPickups()
  const activeJobs = useCollectorStore((s) => s.activeJobs)
  const completedJobs = useCollectorStore((s) => s.completedJobs)

  const historical = serverPickups.filter((p) =>
    ["completed", "weighed_in"].includes(p.status)
  )

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight">My trips</h1>
        <p className="text-xs text-muted-foreground">
          Current jobs and completed collections.
        </p>
      </div>

      {activeJobs.length > 0 && (
        <section>
          <p className="mb-2 px-1 text-xs font-semibold tracking-wide text-emerald-700 uppercase">
            In progress
          </p>
          <div className="space-y-2.5">
            {activeJobs.map((job) => (
              <JobRow key={job.id} pickup={job} earned={Math.round((job.actual_kg ?? job.requested_kg) * RATE_PER_KG)} />
            ))}
          </div>
        </section>
      )}

      <section>
        <p className="mb-2 px-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Completed
        </p>
        <div className="space-y-2.5">
          {completedJobs.map((j) => (
            <div
              key={j.pickupId}
              className="flex items-center gap-3 rounded-2xl border bg-card p-3.5 shadow-sm"
            >
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-700">
                <CheckCircle2 className="size-4.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  {j.addressText ?? "Pickup"}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {j.weightKg} kg · {timeAgo(j.completedAt)}
                </p>
              </div>
              <span className="text-sm font-bold text-emerald-700">
                {formatCurrency(j.earned)}
              </span>
            </div>
          ))}
          {historical.map((p) => (
            <JobRow
              key={p.id}
              pickup={p}
              earned={Math.round(pickupWeight(p) * RATE_PER_KG)}
            />
          ))}
          {activeJobs.length === 0 &&
            completedJobs.length === 0 &&
            historical.length === 0 && (
              <p className="rounded-3xl border border-dashed px-6 py-10 text-center text-sm text-muted-foreground">
                No trips yet. Accept a pickup to get started.
              </p>
            )}
        </div>
      </section>
    </div>
  )
}

function JobRow({
  pickup,
  earned,
}: {
  pickup: Pickup
  earned: number
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border bg-card p-3.5 shadow-sm">
      <span className="relative inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted">
        <Image
          src={LOCATION_IMAGE[pickup.location_type ?? "vendor"]}
          alt=""
          fill
          sizes="40px"
          className="object-cover"
        />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold">
            {pickup.address_text ?? "Pickup"}
          </p>
          <PickupStatusBadge status={pickup.status} />
        </div>
        <p className="mt-0.5 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {pickupWeight(pickup)} kg · {timeAgo(pickup.created_at)}
          </span>
          <span className="font-semibold text-emerald-700">
            {formatCurrency(earned)}
          </span>
        </p>
      </div>
    </div>
  )
}