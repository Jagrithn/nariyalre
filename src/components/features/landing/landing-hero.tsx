"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, BadgeCheck, MapPin, ShoppingBag, Sparkles, TreePalm } from "lucide-react"

import { IMAGES } from "@/lib/imagery"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function LandingHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/4 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-amber-400/15 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-6 pt-14 pb-10 sm:pt-20 lg:grid-cols-2 lg:items-center lg:gap-14">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
            <Sparkles className="size-3 text-emerald-600" />
            Circular bio-resource logistics
          </span>

          <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Coconut waste
            <span className="block bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              is the new gold.
            </span>
          </h1>

          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            Coco intercepts urban coconut waste at the source — temples,
            vendors and homes — and turns shells, husk and pith into products,
            payouts and livelihoods.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full gap-1.5">
              <Link href="/consumer">
                <ShoppingBag className="size-4" />
                Shop the market
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full gap-1.5">
              <Link href="/consumer/machines">
                <MapPin className="size-4" />
                Drop waste, earn
              </Link>
            </Button>
          </div>

          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <BadgeCheck className="size-3.5 text-emerald-600" /> Zero-waste chains
            </span>
            <span className="flex items-center gap-1.5">
              <BadgeCheck className="size-3.5 text-emerald-600" /> Instant UPI payouts
            </span>
            <span className="flex items-center gap-1.5">
              <BadgeCheck className="size-3.5 text-emerald-600" /> SHG women-led making
            </span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm">
          <div className="relative aspect-square overflow-hidden rounded-[2.5rem] shadow-2xl shadow-emerald-900/30">
            <Image
              src={IMAGES.grove}
              alt="A coconut palm grove — the source of everything Coco recycles"
              fill
              sizes="(min-width: 1024px) 24rem, 80vw"
              className="object-cover"
            />
          </div>

          <div className="absolute -top-3 -right-3 rounded-2xl border bg-card px-3 py-2 shadow-lg">
            <p className="text-[10px] font-medium text-muted-foreground">Recycled</p>
            <p className="text-sm font-extrabold text-emerald-600">12.2L kg</p>
          </div>
          <div className="absolute -bottom-3 -left-3 rounded-2xl border bg-card px-3 py-2 shadow-lg">
            <div className="flex items-center gap-1.5">
              <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
              <p className="text-[10px] font-semibold">26 machines live</p>
            </div>
            <p className="text-sm font-extrabold">
              ₹6<span className="text-[10px] font-medium text-muted-foreground">/kg back</span>
            </p>
          </div>
        </div>
      </div>

      <div className="border-y bg-card/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-2 px-6 py-3 text-[11px] font-medium text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Badge variant="secondary" className="gap-1 text-[10px]">
              <TreePalm className="size-3" /> Temples
            </Badge>
            + Vendors + Households
          </span>
          <ArrowRight className="size-3 text-emerald-600" />
          <span>Coco fleet & vending machines</span>
          <ArrowRight className="size-3 text-emerald-600" />
          <span>Fibre, blocks, compost & payouts</span>
        </div>
      </div>
    </section>
  )
}