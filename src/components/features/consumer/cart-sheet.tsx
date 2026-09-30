"use client"

import { useState } from "react"
import Image from "next/image"
import { Loader2, MapPinCheck, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"

import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetDescription,
  BottomSheetHeader,
  BottomSheetTitle,
} from "@/components/ui/bottom-sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { placeOrderAction } from "@/actions/consumer"
import { CURRENT_CONSUMER_ID } from "@/lib/constants"
import { formatCurrency } from "@/lib/formats"
import { productById } from "@/lib/marketplace"
import { notify } from "@/lib/notify"
import { useConsumerStore } from "@/lib/stores/consumer"
import { useSessionStore } from "@/lib/stores/session"
import type { OrderItem } from "@/lib/types"

export function CartSheet({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { toast } = useToast()
  const user = useSessionStore((s) => s.user)
  const userId = user?.id ?? CURRENT_CONSUMER_ID

  const items = useConsumerStore((s) => s.items)
  const address = useConsumerStore((s) => s.address)
  const setAddress = useConsumerStore((s) => s.setAddress)
  const setQty = useConsumerStore((s) => s.setQty)
  const removeItem = useConsumerStore((s) => s.removeItem)
  const clearCart = useConsumerStore((s) => s.clearCart)
  const addOrder = useConsumerStore((s) => s.addOrder)

  const [placing, setPlacing] = useState(false)

  const rows = items
    .map((i) => ({ item: i, product: productById(i.productId) }))
    .filter((r) => r.product)
  const total = rows.reduce((s, r) => s + r.product!.price * r.item.qty, 0)
  const kgDiverted = rows.reduce(
    (s, r) => s + r.product!.recycler_kg * r.item.qty,
    0
  )

  const place = async () => {
    if (rows.length === 0) return
    setPlacing(true)
    const orderItems: OrderItem[] = rows.map((r) => ({
      productId: r.product!.id,
      name: r.product!.name,
      qty: r.item.qty,
      price: r.product!.price,
    }))
    const res = await placeOrderAction({
      userId,
      items: orderItems,
      total,
      kgDiverted,
      address: address.trim() || undefined,
    })
    setPlacing(false)
    if (!res.ok) {
      toast({ title: "Could not place order", description: res.error })
      return
    }
    const order = {
      id: res.id ?? `ord_${Date.now()}`,
      user_id: userId,
      items: orderItems,
      total,
      kg_diverted: kgDiverted,
      status: "placed" as const,
      created_at: new Date().toISOString(),
      address: address.trim() || undefined,
    }
    addOrder(order)
    clearCart()
    onOpenChange(false)
    notify(
      userId,
      "Order placed",
      `${orderItems.length} product${orderItems.length > 1 ? "s" : ""} for ${formatCurrency(total)} — ${kgDiverted.toFixed(1)} kg diverted from landfill.`,
      "system"
    )
    toast({
      title: "Order placed",
      description: `${formatCurrency(total)} · ${kgDiverted.toFixed(1)} kg diverted. Thank you!`,
    })
  }

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange}>
      <BottomSheetContent className="sm:max-w-md">
        <BottomSheetHeader>
          <BottomSheetTitle className="flex items-center gap-2">
            <ShoppingBag className="size-4 text-emerald-600" />
            Your basket
          </BottomSheetTitle>
          <BottomSheetDescription>
            Every kg diverted keeps coconut waste out of landfill.
          </BottomSheetDescription>
        </BottomSheetHeader>

        <div className="max-h-[46dvh] space-y-2 overflow-y-auto px-4">
          {rows.length === 0 && (
            <p className="px-2 py-10 text-center text-xs text-muted-foreground">
              Your basket is empty. Add something coconut-made.
            </p>
          )}
          {rows.map(({ item, product }) => (
            <div
              key={item.productId}
              className="flex items-center gap-3 rounded-2xl border bg-card p-3"
            >
              <Image
              src={product!.image}
              alt={product!.name}
              width={40}
              height={40}
              className="h-10 w-10 shrink-0 rounded-xl object-cover bg-gradient-to-br from-emerald-500 to-teal-600"
            />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold">{product!.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  {formatCurrency(product!.price)} · {product!.unit}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Decrease"
                  className="inline-flex size-6 items-center justify-center rounded-full bg-muted"
                  onClick={() => setQty(item.productId, item.qty - 1)}
                >
                  <Minus className="size-3" />
                </button>
                <span className="w-6 text-center text-xs font-bold">
                  {item.qty}
                </span>
                <button
                  type="button"
                  aria-label="Increase"
                  className="inline-flex size-6 items-center justify-center rounded-full bg-emerald-600 text-white"
                  onClick={() => setQty(item.productId, item.qty + 1)}
                >
                  <Plus className="size-3" />
                </button>
                <button
                  type="button"
                  aria-label="Remove"
                  className="ml-1 inline-flex size-6 items-center justify-center rounded-full text-muted-foreground hover:text-destructive"
                  onClick={() => removeItem(item.productId)}
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {rows.length > 0 && (
          <div className="space-y-3 border-t px-4 py-4">
            <div className="relative">
              <MapPinCheck className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Delivery destination (optional)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                Diverts {kgDiverted.toFixed(1)} kg from landfill
              </span>
              <span className="font-bold">
                Total {formatCurrency(total)}
              </span>
            </div>
            <Button className="w-full" size="lg" onClick={place} disabled={placing}>
              {placing && <Loader2 className="animate-spin" />}
              Place order (demo checkout)
            </Button>
          </div>
        )}
      </BottomSheetContent>
    </BottomSheet>
  )
}