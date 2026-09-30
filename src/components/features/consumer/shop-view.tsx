"use client"

import Image from "next/image"
import { useState } from "react"
import { ShoppingCart } from "lucide-react"

import { CartSheet } from "@/components/features/consumer/cart-sheet"
import { ProductCard } from "@/components/features/consumer/product-card"
import { Skeleton } from "@/components/ui/skeleton"
import { useMarketProducts } from "@/hooks/use-market"
import { IMAGES } from "@/lib/imagery"
import { useConsumerStore } from "@/lib/stores/consumer"

export function ShopView() {
  const [cartOpen, setCartOpen] = useState(false)
  const { data: products, isLoading } = useMarketProducts()
  const items = useConsumerStore((s) => s.items)
  const addItem = useConsumerStore((s) => s.addItem)

  const itemCount = items.reduce((s, i) => s + i.qty, 0)
  const kgInCart = items.reduce((s, i) => {
    const p = products?.find((p) => p.id === i.productId)
    return s + (p ? p.recycler_kg * i.qty : 0)
  }, 0)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Shop the circular edit</h1>
        <p className="text-xs text-muted-foreground">
          Beautiful goods made from coconut husk, shell & fibre.
        </p>
      </div>

      <div className="flex items-center gap-2.5 rounded-2xl border bg-emerald-600/10 px-3 py-2.5 text-emerald-800 dark:text-emerald-200">
        <Image
          src={IMAGES.deposit}
          alt=""
          width={40}
          height={40}
          className="size-10 shrink-0 rounded-xl object-cover"
        />
        <p className="text-[11px] leading-snug">
          Your basket currently diverts{" "}
          <span className="font-bold">{kgInCart.toFixed(1)} kg</span> of coconut
          waste from landfill.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3] rounded-3xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {products?.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              qty={items.find((i) => i.productId === p.id)?.qty ?? 0}
              onAdd={() =>
                addItem(
                  p.id,
                  (items.find((i) => i.productId === p.id)?.qty ?? 0) + 1 > 0 ? 1 : 1
                )
              }
            />
          ))}
        </div>
      )}

      {itemCount > 0 && (
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="fixed inset-x-0 bottom-24 z-30 mx-auto w-fit"
        >
          <span className="flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/30">
            <ShoppingCart className="size-4" />
            View basket
            <span className="inline-flex size-5 items-center justify-center rounded-full bg-white/25 text-[11px]">
              {itemCount}
            </span>
          </span>
        </button>
      )}

      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  )
}