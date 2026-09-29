"use client"

import { Leaf, Plus } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/formats"
import { cn } from "@/lib/utils"
import type { Product } from "@/lib/types"

const ACCENTS: Record<Product["accent"], string> = {
  emerald: "from-emerald-500 via-emerald-600 to-teal-600",
  teal: "from-teal-500 via-teal-600 to-cyan-700",
  amber: "from-amber-500 via-orange-500 to-red-500",
  lime: "from-lime-500 via-lime-600 to-emerald-700",
}

export function ProductCard({
  product,
  qty,
  onAdd,
}: {
  product: Product
  qty: number
  onAdd: () => void
}) {
  const soldOut = product.stock <= 0
  return (
    <div className="flex flex-col overflow-hidden rounded-3xl border bg-card shadow-sm transition-all hover:shadow-md">
      <div
        className={cn(
          "relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br",
          ACCENTS[product.accent]
        )}
      >
        <Leaf className="size-10 text-white/95" strokeWidth={1.5} />
        <span className="absolute top-2.5 left-2.5 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-bold text-emerald-700 shadow-sm">
          {product.material_type.replace("_", " ")}
        </span>
        {qty > 0 && (
          <span className="absolute top-2.5 right-2.5 inline-flex size-6 items-center justify-center rounded-full bg-white text-sm font-bold text-emerald-700 shadow">
            {qty}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm leading-tight font-semibold">{product.name}</p>
          <p className="shrink-0 text-sm font-bold text-emerald-700">
            {formatCurrency(product.price)}
          </p>
        </div>
        <p className="text-[10px] font-medium text-muted-foreground">
          {product.unit} · {formatCurrency(product.price / Math.max(product.recycler_kg, 0.01))}/kg diverted
        </p>
        <p className="line-clamp-2 text-[11px] text-muted-foreground">
          {product.description}
        </p>

        <div className="mt-auto flex items-center justify-between gap-2 pt-1.5">
          <Badge variant="secondary" className="max-w-[55%] truncate text-[9px]">
            {product.made_by}
          </Badge>
          <Button
            size="sm"
            variant="outline"
            className="h-7 gap-1 rounded-full px-2.5 text-[11px]"
            onClick={onAdd}
            disabled={soldOut}
          >
            {soldOut ? (
              "Sold out"
            ) : qty > 0 ? (
              <>
                <Plus className="size-3" /> Add more
              </>
            ) : (
              <>
                <Plus className="size-3" /> Add
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}