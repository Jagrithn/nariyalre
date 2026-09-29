"use client"

import { useState } from "react"
import Link from "next/link"
import { Banknote, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  DEFAULT_MACHINE_PAYOUT_PER_KG,
  depositEstimate,
} from "@/lib/machines"
import { formatCurrency } from "@/lib/formats"

export function DepositTeaser() {
  const [kg, setKg] = useState<number[]>([2])
  const estimate = depositEstimate(kg[0], DEFAULT_MACHINE_PAYOUT_PER_KG)

  return (
    <section className="mx-auto max-w-6xl px-6 py-14">
      <div className="overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-900 p-8 text-white shadow-xl sm:p-12">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
              <Banknote className="size-3.5" />
              Instant payout machines
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
              Your sack of shells is worth real money.
            </h2>
            <p className="mt-3 max-w-md text-sm text-white/80">
              Feed a Coco vending machine — it weighs, credits your UPI and
              resets. No apps, no waiting, open 24×7.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-6 rounded-full bg-white text-emerald-800 hover:bg-emerald-50"
            >
              <Link href="/consumer/machines">
                <MapPin className="size-4" /> Find a machine
              </Link>
            </Button>
          </div>

          <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-white/70">Your estimate</p>
                <p className="mt-1 text-4xl font-extrabold tracking-tight">
                  {formatCurrency(estimate)}
                </p>
              </div>
              <p className="rounded-full bg-white/20 px-3 py-1 text-sm font-bold">
                {kg[0]} kg
              </p>
            </div>
            <div className="mt-6">
              <Slider
                value={kg}
                onValueChange={setKg}
                min={0.5}
                max={5}
                step={0.5}
                className="[&_[data-slot=slider-track]]:bg-white/25 [&_[data-slot=slider-range]]:bg-white [&_[role=slider]]:border-emerald-700"
              />
              <div className="mt-2 flex justify-between text-[10px] text-white/60">
                <span>0.5 kg</span>
                <span>5 kg</span>
              </div>
            </div>
            <p className="mt-4 text-center text-xs text-white/80">
              {formatCurrency(DEFAULT_MACHINE_PAYOUT_PER_KG)} per kg · paid to UPI the moment you drop
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}