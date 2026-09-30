"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/formats"
import { PRODUCTS } from "@/lib/marketplace"
import { cn } from "@/lib/utils"

const ACCENTS = [
  "from-emerald-500 via-emerald-600 to-teal-700",
  "from-amber-500 via-orange-500 to-red-500",
  "from-lime-500 via-lime-600 to-emerald-700",
] as const

export function LandingProducts() {
  const featured = PRODUCTS.slice(0, 3)

  return (
    <section className="border-t bg-card/40">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Made from what you threw away
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Beautiful, useful goods crafted from diverted coconut waste.
            </p>
          </div>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/consumer">
              Open the market <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {featured.map((p, i) => (
            <Link
              key={p.id}
              href="/consumer"
              className="group overflow-hidden rounded-3xl border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div
                className={cn(
                  "relative aspect-[4/3] overflow-hidden bg-gradient-to-br",
                  ACCENTS[i % ACCENTS.length]
                )}
              >
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-bold">{p.name}</p>
                  <p className="text-[11px] text-muted-foreground">{p.unit}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-600">
                    {formatCurrency(p.price)}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {p.recycler_kg} kg diverted
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}