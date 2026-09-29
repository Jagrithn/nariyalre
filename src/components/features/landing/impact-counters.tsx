"use client"

import { Blocks, HeartHandshake, Leaf, Recycle, Shell } from "lucide-react"

import { useCountUp } from "@/hooks/use-countup"
import { LANDING_STATS } from "@/lib/landingStats"

const countFormat = new Intl.NumberFormat("en-IN", { notation: "compact" })

function Counter({
  target,
  suffix = "",
}: {
  target: number
  suffix?: string
}) {
  const { ref, value } = useCountUp(target)
  return (
    <span ref={ref}>
      {countFormat.format(value)}
      {suffix}
    </span>
  )
}

const STATS = [
{
    icon: Recycle,
    label: "Waste recycled",
    value: LANDING_STATS.kilogramsRecycled,
    suffix: " kg",
  },
  {
    icon: Leaf,
    label: "CO₂ avoided",
    value: LANDING_STATS.co2SavedKg,
    suffix: " kg",
  },
  {
    icon: Shell,
    label: "Shells diverted",
    value: LANDING_STATS.shellsDiverted,
    suffix: "",
  },
  {
    icon: HeartHandshake,
    label: "Women employed",
    value: LANDING_STATS.ruralWomenEmployed,
    suffix: "",
  },
  {
    icon: Blocks,
    label: "Coir blocks made",
    value: LANDING_STATS.cocopeatBlocksShipped,
    suffix: "",
  },
  {
    icon: Recycle,
    label: "Machines live",
    value: LANDING_STATS.machinesLive,
    suffix: "",
  },
]

export function ImpactCounters() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-14">
      <div className="mb-8 flex flex-col items-center text-center">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Real waste. Real numbers.
        </h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Impact tracked live across the Coco network — every kg counted.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="rounded-3xl border bg-card p-4 text-center shadow-sm transition-transform hover:-translate-y-0.5"
          >
            <span className="mx-auto mb-3 inline-flex size-10 items-center justify-center rounded-2xl bg-emerald-600/10 text-emerald-600">
              <s.icon className="size-5" />
            </span>
            <p className="text-xl font-extrabold tracking-tight sm:text-2xl">
              <Counter target={s.value} suffix={s.suffix} />
            </p>
            <p className="mt-1 text-[11px] font-medium text-muted-foreground">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-[10px] text-muted-foreground">
        Demo figures — tune them in{" "}
        <code className="rounded bg-muted px-1 py-0.5">src/lib/landingStats.ts</code>
      </p>
    </section>
  )
}