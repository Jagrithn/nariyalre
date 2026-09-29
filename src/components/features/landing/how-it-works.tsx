"use client"

import { Coins, Factory, HandCoins, Recycle, Sprout, Truck } from "lucide-react"

const STEPS = [
  {
    icon: HandCoins,
    step: "01",
    title: "Drop your waste",
    description: "Hand coconut shells, husk & pith to a collector or a nearby vending machine.",
  },
  {
    icon: Truck,
    step: "02",
    title: "We collect & weigh",
    description: "The Coco fleet picks up on schedule. You get QR-verified weight and instant UPI.",
  },
  {
    icon: Factory,
    step: "03",
    title: "It becomes products",
    description: "Coir fibre, blocks, compost and crafted goods — made by rural women's SHGs.",
  },
  {
    icon: Coins,
    step: "04",
    title: "You buy, earn & rebuild",
    description: "Shop the circular market while earners get paid per kg. The loop never ends.",
  },
]

export function HowItWorks() {
  return (
    <section className="border-t bg-card/40">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="mb-8 flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
          <Sprout className="size-4" />
          <h2 className="text-2xl font-bold tracking-tight">How the circle closes</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <div
              key={s.step}
              className="relative rounded-3xl border bg-card p-5 shadow-sm"
            >
              <span className="absolute top-4 right-5 text-3xl font-black text-emerald-600/10">
                {s.step}
              </span>
              <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-emerald-600/10 text-emerald-600">
                <s.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-sm font-bold">{s.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {s.description}
              </p>
              {i < STEPS.length - 1 && (
                <Recycle
                  className="absolute top-1/2 -right-3 size-4 -translate-y-1/2 text-emerald-400"
                  aria-hidden
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}