"use client"

import Image from "next/image"
import { HeartHandshake, Leaf, Users } from "lucide-react"

import { IMAGES } from "@/lib/imagery"
import { LANDING_STATS } from "@/lib/landingStats"

const WINS = [
  {
    icon: Users,
    title: `${LANDING_STATS.ruralWomenEmployed} women employed`,
    text: "Daily livelihoods for rural women across 14 SHGs — coir spinning, block pressing and product crafting.",
  },
  {
    icon: Leaf,
    title: `${LANDING_STATS.cocopeatBlocksShipped.toLocaleString("en-IN")} coir blocks shipped`,
    text: "Every block is a coconut that never reached a dump yard or choked a drain.",
  },
  {
    icon: HeartHandshake,
    title: "Fair, instant earnings",
    text: "Payouts land in UPI in real time — no cash cycles, no middlemen, no waiting.",
  },
]

export function WomenSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-0 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm dark:text-emerald-300">
            <HeartHandshake className="size-3.5" />
            By women. For everyone.
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight">
            Turning coconut waste into
            <span className="text-emerald-600"> dignified work</span>
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            At the heart of Coco are rural women who sort, spin and craft the
            husk — earning steady income close to home while cleaning the city.
          </p>
          <div className="mt-6 space-y-4">
            {WINS.map((w) => (
              <div key={w.title} className="flex gap-3">
                <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-600">
                  <w.icon className="size-4.5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">{w.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{w.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm">
          <div className="relative aspect-square overflow-hidden rounded-[2.5rem] shadow-2xl shadow-amber-900/30">
            <Image
              src={IMAGES.shgCraft}
              alt="Rural women spinning and crafting coir — the hands behind every Coco product"
              fill
              sizes="(min-width: 1024px) 24rem, 80vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-3 left-1/2 w-max -translate-x-1/2 rounded-2xl border bg-card px-4 py-2 text-center shadow-lg">
            <p className="text-xl font-extrabold text-emerald-600">
              {LANDING_STATS.kilogramsRecycled.toLocaleString("en-IN")} kg
            </p>
            <p className="text-[10px] font-medium text-muted-foreground">
              recycled so far by the network
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}