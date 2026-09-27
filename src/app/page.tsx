import Link from "next/link"
import {
  ArrowRight,
  Building2,
  CircleDollarSign,
  Truck,
  Warehouse,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const interfaces = [
  {
    title: "Generator",
    subtitle: "Vendors & Temples",
    description:
      "One-tap pickup requests, GPS auto-tagging and live impact tracking.",
    href: "/generator",
    icon: CircleDollarSign,
    accent: "text-emerald-600 bg-emerald-600/10",
    badge: "Mobile PWA",
  },
  {
    title: "Collector",
    subtitle: "Drivers",
    description:
      "Optimal routes to pending pickups, UPI earnings and QR drop-off.",
    href: "/collector",
    icon: Truck,
    accent: "text-teal-600 bg-teal-600/10",
    badge: "Mobile PWA",
  },
  {
    title: "Depot",
    subtitle: "Weighbridge & Processing",
    description:
      "Log raw weight, de-watering yield and fibre, shell, pith output.",
    href: "/admin/depot",
    icon: Warehouse,
    accent: "text-amber-600 bg-amber-600/10",
    badge: "Tablet",
  },
  {
    title: "Admin",
    subtitle: "Tri-Tier Distribution",
    description:
      "B2B baling, SHG artisan allocation and in-house cocopeat metrics.",
    href: "/admin",
    icon: Building2,
    accent: "text-slate-700 bg-slate-700/10",
    badge: "Desktop",
  },
]

export default function Home() {
  return (
    <main className="relative min-h-dvh overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-lime-400/20 blur-3xl" />
      </div>

      <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col justify-center px-6 py-16">
        <header className="mb-12 flex flex-col items-center text-center">
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
            <span className="size-1.5 rounded-full bg-emerald-600" />
            Circular bio-resource logistics
          </span>
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
            Coco
          </h1>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            Intercepting urban coconut waste at the source and routing it into a
            three-tier commercial ecosystem.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          {interfaces.map((item) => (
            <Link key={item.title} href={item.href} className="group">
              <Card className="h-full transition-all group-hover:-translate-y-0.5 group-hover:shadow-md">
                <CardHeader className="flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "inline-flex size-10 items-center justify-center rounded-xl",
                        item.accent
                      )}
                    >
                      <item.icon className="size-5" />
                    </span>
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">{item.badge}</Badge>
                </CardHeader>
                <CardContent className="flex items-center justify-between gap-3 pt-0">
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                  <ArrowRight className="size-4 shrink-0 text-emerald-600 transition-transform group-hover:translate-x-1" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <footer className="mt-12 flex justify-center">
          <Link
            href="/login"
            className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Sign in
          </Link>
        </footer>
      </div>
    </main>
  )
}