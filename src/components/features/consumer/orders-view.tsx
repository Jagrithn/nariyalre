"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { CheckCircle2, PackageOpen, ShoppingBag } from "lucide-react"

import { Badge, type BadgeProps } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency, timeAgo } from "@/lib/formats"
import { productById } from "@/lib/marketplace"
import { useConsumerStore } from "@/lib/stores/consumer"
import type { OrderStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

const STATUS_STEPS: { key: OrderStatus; label: string }[] = [
  { key: "placed", label: "Placed" },
  { key: "processing", label: "Making" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
]

const STATUS_META: Record<OrderStatus, { label: string; tone: BadgeProps["variant"] }> = {
  placed: { label: "Order placed", tone: "outline" },
  processing: { label: "Being made", tone: "secondary" },
  shipped: { label: "On the way", tone: "secondary" },
  delivered: { label: "Delivered", tone: "success" },
}

export function OrdersView() {
  const router = useRouter()
  const orders = useConsumerStore((s) => s.orders)

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center pt-24 text-center">
        <span className="inline-flex size-16 items-center justify-center rounded-3xl bg-emerald-600/10 text-emerald-700">
          <PackageOpen className="size-8" />
        </span>
        <h1 className="mt-4 text-xl font-bold tracking-tight">No orders yet</h1>
        <p className="mt-1 max-w-[240px] text-xs text-muted-foreground">
          Fill your basket with coconut-made goods — every order diverts waste from landfill.
        </p>
        <Button
          className="mt-5 rounded-full"
          onClick={() => router.push("/consumer")}
        >
          <ShoppingBag className="size-4" /> Start shopping
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Your orders</h1>
        <p className="text-xs text-muted-foreground">
          {orders.length} order{orders.length > 1 ? "s" : ""} · every purchase diverts landfill waste.
        </p>
      </div>

      {orders.map((o) => {
        const meta = STATUS_META[o.status]
        const stepIndex = STATUS_STEPS.findIndex((s) => s.key === o.status)
        return (
          <section
            key={o.id}
            className="rounded-3xl border bg-card p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs">
                <span className="font-bold">#{o.id.slice(-8)}</span>
                <span className="ml-2 text-muted-foreground">
                  {timeAgo(o.created_at)}
                </span>
              </p>
              <Badge variant={meta.tone} className="text-[9px]">
                {meta.label}
              </Badge>
            </div>

            <div className="mt-3 flex items-center gap-1.5">
              {STATUS_STEPS.map((s, i) => (
                <div key={s.key} className="flex flex-1 items-center gap-1.5">
                  <div className="flex flex-col items-center gap-1 flex-1">
                    <span
                      className={cn(
                        "flex size-4 items-center justify-center rounded-full border",
                        i <= stepIndex
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : "border-muted bg-muted text-muted-foreground"
                      )}
                    >
                      {i < stepIndex ? (
                        <CheckCircle2 className="size-3" />
                      ) : (
                        <span className="size-1.5 rounded-full bg-current" />
                      )}
                    </span>
                    <span
                      className={cn(
                        "hidden text-[9px] font-medium",
                        i <= stepIndex ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <span
                      className={cn(
                        "h-0.5 flex-1 rounded-full",
                        i < stepIndex ? "bg-emerald-600" : "bg-muted"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-3 space-y-1 rounded-2xl bg-muted/60 p-3">
              {o.items.map((it) => (
                <div key={it.productId} className="flex items-center justify-between gap-3 text-xs">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Image
                      src={productById(it.productId)?.image ?? ""}
                      alt={it.name}
                      width={28}
                      height={28}
                      className="h-7 w-7 rounded-lg object-cover bg-gradient-to-br from-emerald-500 to-teal-600"
                    />
                    {it.qty} × {it.name}
                  </span>
                  <span className="font-semibold">{formatCurrency(it.qty * it.price)}</span>
                </div>
              ))}
              <div className="flex justify-between border-t pt-1.5 text-xs font-bold">
                <span>Total</span>
                <span>{formatCurrency(o.total)}</span>
              </div>
            </div>

            <p className="mt-2 text-[11px] font-semibold text-emerald-700">
              This order diverted {o.kg_diverted.toFixed(1)} kg from landfill
            </p>
          </section>
        )
      })}
    </div>
  )
}