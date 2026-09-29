"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import type { CartItem, Order } from "@/lib/types"

interface ConsumerState {
  items: CartItem[]
  orders: Order[]
  address: string
  addItem: (productId: string, qty?: number) => void
  setQty: (productId: string, qty: number) => void
  removeItem: (productId: string) => void
  clearCart: () => void
  setAddress: (address: string) => void
  addOrder: (order: Order) => void
}

export const useConsumerStore = create<ConsumerState>()(
  persist(
    (set) => ({
      items: [],
      orders: [],
      address: "",
      addItem: (productId, qty = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === productId)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === productId
                  ? { ...i, qty: i.qty + qty }
                  : i
              ),
            }
          }
          return { items: [...state.items, { productId, qty }] }
        }),
      setQty: (productId, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => i.productId !== productId)
              : state.items.map((i) =>
                  i.productId === productId ? { ...i, qty } : i
                ),
        })),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),
      clearCart: () => set({ items: [] }),
      setAddress: (address) => set({ address }),
      addOrder: (order) =>
        set((state) => ({ orders: [order, ...state.orders] })),
    }),
    {
      name: "coco-consumer",
      storage: createJSONStorage(() => localStorage),
    }
  )
)