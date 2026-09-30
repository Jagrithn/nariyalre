"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Building2, ShoppingBag, TreePalm, Truck, Warehouse } from "lucide-react"

import { IMAGES } from "@/lib/imagery"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const ROLES = [
  {
    title: "Generator",
    subtitle: "Temples & vendors",
    description: "One-tap pickups, GPS auto-tagging and live impact tracking.",
    href: "/generator",
    icon: TreePalm,
    image: IMAGES.rolesTemple,
    badge: "Mobile PWA",
    accent: "text-emerald-600 bg-emerald-600/10",
  },
  {
    title: "Collector",
    subtitle: "Drivers",
    description: "Optimal routes to pending pickups, UPI earnings and QR drop-off.",
    href: "/collector",
    icon: Truck,
    image: IMAGES.collectorHero,
    badge: "Mobile PWA",
    accent: "text-teal-600 bg-teal-600/10",
  },
  {
    title: "Consumer",
    subtitle: "Eco shoppers",
    description: "Shop coconut-made goods and feed vending machines to earn.",
    href: "/consumer",
    icon: ShoppingBag,
    image: IMAGES.grove,
    badge: "New",
    accent: "text-amber-600 bg-amber-600/10",
  },
  {
    title: "Depot",
    subtitle: "Weighbridge",
    description: "Log raw weight, de-watering yield and fibre, shell, pith output.",
    href: "/admin/depot",
    icon: Warehouse,
    image: IMAGES.rolesDepot,
    badge: "Tablet",
    accent: "text-slate-600 bg-slate-600/10",
  },
  {
    title: "Admin",
    subtitle: "Tri-tier ops",
    description: "B2B baling, SHG allocation and in-house cocopeat metrics.",
    href: "/admin",
    icon: Building2,
    image: IMAGES.rolesOps,
    badge: "Desktop",
    accent: "text-emerald-700 bg-emerald-700/10",
  },
]

export function RoleDirectory() {
  return (
    <section className="border-t bg-card/40">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="mb-8 flex flex-col items-center text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            One loop, five roles
          </h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Every interface is role-shaped — pick yours, sign in and dive in.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {ROLES.map((r) => (
            <Link key={r.title} href={r.href} className="group">
              <div className="flex h-full flex-col rounded-3xl border bg-card p-5 shadow-sm transition-all group-hover:-translate-y-0.5 group-hover:shadow-md">
                <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-muted">
                  <Image
                    src={r.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 20vw, 45vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className={cn("inline-flex size-10 items-center justify-center rounded-2xl", r.accent)}>
                    <r.icon className="size-5" />
                  </span>
                  <Badge variant="secondary" className="text-[9px]">
                    {r.badge}
                  </Badge>
                </div>
                <p className="mt-4 text-sm font-bold">{r.title}</p>
                <p className="text-[11px] font-medium text-muted-foreground">
                  {r.subtitle}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {r.description}
                </p>
                <span className="mt-auto flex items-center gap-1 pt-4 text-xs font-semibold text-emerald-600">
                  Explore
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}