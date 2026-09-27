"use client"

import { useEffect, useMemo, useState } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Loader2,
  MapPinCheck,
  PackageCheck,
  ScanLine,
  Truck,
} from "lucide-react"

import type { PickupMapProps } from "@/components/features/collector/pickup-map"
import { MockQr } from "@/components/features/collector/mock-qr"
import { TrackPump } from "@/components/features/collector/track-pump"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { completePickupAction } from "@/actions/mutations"
import { useGeolocation } from "@/hooks/use-geolocation"
import { findPickupById } from "@/lib/mockData"
import { notify } from "@/lib/notify"
import { DEFAULT_DEPOT_COORDS, CURRENT_COLLECTOR_ID, RATE_PER_KG } from "@/lib/constants"
import { getDrivingRoute, formatDistanceKm } from "@/lib/routing"
import { formatCurrency } from "@/lib/formats"
import { useCollectorStore } from "@/lib/stores/collector"
import { cn } from "@/lib/utils"
import type { RouteResult } from "@/lib/routing"

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

export function RouteView({ pickupId }: { pickupId: string }) {
  const router = useRouter()
  const { coords } = useGeolocation()
  const activeJobs = useCollectorStore((s) => s.activeJobs)
  const advanceToTransit = useCollectorStore((s) => s.advanceToTransit)
  const completeJob = useCollectorStore((s) => s.completeJob)

  const job = activeJobs.find((p) => p.id === pickupId) ?? findPickupById(pickupId)
  const [stage, setStage] = useState<"enroute" | "pickedup" | "completed">(() =>
    job?.status === "in_transit" ? "pickedup" : "enroute"
  )
  const [leg1, setLeg1] = useState<RouteResult | null>(null)
  const [leg2, setLeg2] = useState<RouteResult | null>(null)
  const [actualKg, setActualKg] = useState<number>(job?.requested_kg ?? 0)
  const [showQr, setShowQr] = useState(false)

  const origin = coords ?? FALLBACK_ORIGIN

  useEffect(() => {
    if (!job) return
    let cancelled = false
    const load = async () => {
      const r1 = await getDrivingRoute(origin, {
        lat: job.geo_lat,
        lng: job.geo_lng,
      })
      if (cancelled) return
      setLeg1(r1)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [job, origin])

  useEffect(() => {
    if (!job || stage !== "pickedup" || leg2) return
    let cancelled = false
    const load = async () => {
      const r2 = await getDrivingRoute(
        { lat: job.geo_lat, lng: job.geo_lng },
        DEFAULT_DEPOT_COORDS
      )
      if (cancelled) return
      setLeg2(r2)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [job, stage, leg2])

  const pickupPins = useMemo(
    () => [
      { id: "collector", label: "You", color: "teal" as const, ...origin },
      {
        id: "vendor",
        label: "Pickup",
        color: "emerald" as const,
        lat: job?.geo_lat ?? origin.lat,
        lng: job?.geo_lng ?? origin.lng,
      },
      {
        id: "depot",
        label: "Depot",
        color: "amber" as const,
        ...DEFAULT_DEPOT_COORDS,
      },
    ],
    [job, origin]
  )

  if (!job) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-6 text-center">
        <MapPinCheck className="size-8 text-muted-foreground" />
        <p className="text-sm font-medium">This job is no longer active.</p>
        <Button onClick={() => router.push("/collector")}>Back to jobs</Button>
      </div>
    )
  }

  const earned = Math.round(actualKg * RATE_PER_KG)

  const markPickedUp = () => {
    if (job.status !== "in_transit") advanceToTransit(pickupId)
    setStage("pickedup")
    notify(
      job.generator_id,
      "Pickup loaded",
      `${job.requested_kg} kg loaded — returning to the depot now.`,
      "pickup_status"
    )
  }

  const complete = () => {
    void completePickupAction({
      pickupId,
      actualKg,
      collectorId: CURRENT_COLLECTOR_ID,
    }).catch(() => {})
    completeJob(pickupId, actualKg, RATE_PER_KG)
    setStage("completed")
    notify(
      job.generator_id,
      "Drop-off completed",
      `Your ${actualKg} kg was weighed in at the depot and credited.`,
      "pickup_status"
    )
  }

  return (
    <div className="relative flex min-h-dvh flex-col">
      <TrackPump
        pickupId={pickupId}
        collectorId={CURRENT_COLLECTOR_ID}
        path={stage === "pickedup" && leg2 ? leg2.points : (leg1?.points ?? [])}
        active={stage !== "completed"}
      />
      <div className="relative h-[46dvh] min-h-[320px] w-full">
        <PickupMap
          center={origin}
          pins={pickupPins}
          route={stage === "pickedup" && leg2 ? leg2.points : leg1?.points}
          zoom={13}
          className="h-full w-full"
        />
        <button
          type="button"
          onClick={() => router.push("/collector")}
          aria-label="Back to available jobs"
          className="absolute top-4 left-4 z-[500] inline-flex size-9 items-center justify-center rounded-full bg-white/95 text-foreground shadow-md"
        >
          <ArrowLeft className="size-4.5" />
        </button>
      </div>

      <div className="z-10 -mt-6 flex-1 space-y-4 bg-background px-4 pt-4 pb-8">
        <div className="rounded-3xl border bg-card p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-bold">{job.address_text}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {job.generator_name} · {job.requested_kg} kg requested
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-emerald-600/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              ~{formatCurrency(earned)}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-muted/60 px-3 py-2 text-xs">
              Leg 1 · to vendor
              <p className="font-semibold text-foreground">
                {leg1
                  ? `${formatDistanceKm(leg1.distanceKm)} · ~${leg1.durationMin} min`
                  : "Calculating…"}
              </p>
            </div>
            <div className="rounded-xl bg-muted/60 px-3 py-2 text-xs">
              Leg 2 · to depot
              <p className="font-semibold text-foreground">
                {leg2
                  ? `${formatDistanceKm(leg2.distanceKm)} · ~${leg2.durationMin} min`
                  : stage === "pickedup"
                    ? "Calculating…"
                    : "After pickup"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            {[
              { label: "Accepted", done: true },
              { label: "En route", done: stage !== "enroute" },
              { label: "Collected", done: stage === "completed" },
            ].map((s, i) => (
              <div key={s.label} className="flex flex-1 items-center gap-2">
                <span className="flex flex-col items-center">
                  {s.done ? (
                    <CheckCircle2 className="size-5 text-emerald-600" />
                  ) : (
                    <Circle className="size-5 text-muted-foreground/40" />
                  )}
                  <span
                    className={cn(
                      "mt-1 text-[10px] font-medium",
                      s.done ? "text-emerald-700" : "text-muted-foreground"
                    )}
                  >
                    {s.label}
                  </span>
                </span>
                {i < 2 && (
                  <span className="mb-4 h-px flex-1 bg-muted-foreground/20" />
                )}
              </div>
            ))}
          </div>
        </div>

        {stage === "enroute" && (
          <Button size="lg" className="w-full" onClick={markPickedUp}>
            <PackageCheck />
            Mark pickup loaded
          </Button>
        )}

        {stage === "pickedup" && (
          <div className="space-y-3">
            <div className="rounded-2xl border bg-card p-4 shadow-sm">
              <label htmlFor="actual-weight" className="text-xs font-medium text-muted-foreground">
                Weigh-in at depot (kg)
              </label>
              <div className="mt-2 flex items-center gap-3">
                <Input
                  id="actual-weight"
                  type="number"
                  min={0}
                  value={actualKg}
                  onChange={(e) => setActualKg(Number(e.target.value))}
                />
                <span className="shrink-0 text-sm font-semibold">
                  {formatCurrency(earned)}
                </span>
              </div>
            </div>
            <Button size="lg" className="w-full" onClick={complete}>
              <Truck />
              Confirm weigh-in & complete
            </Button>
          </div>
        )}

        {stage === "completed" && (
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="inline-flex size-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg">
              <CheckCircle2 className="size-7" />
            </span>
            <div>
              <p className="text-base font-bold">
                {actualKg} kg delivered · {formatCurrency(earned)} earned
              </p>
              <p className="text-xs text-muted-foreground">
                Credited to Ravi Shankar · {CURRENT_COLLECTOR_ID}
              </p>
            </div>
            {!showQr ? (
              <Button variant="outline" onClick={() => setShowQr(true)}>
                <ScanLine />
                Show drop-off QR
              </Button>
            ) : (
              <div className="w-full max-w-[220px] rounded-2xl border bg-card p-4 shadow-sm">
                <MockQr seed={pickupId} />
                <p className="mt-2 text-[10px] font-medium text-muted-foreground">
                  Simulated QR · scan at depot desk
                </p>
              </div>
            )}
            <Button className="w-full" onClick={() => router.push("/collector")}>
              Back to jobs
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}