"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import type { Pickup } from "@/lib/types"

interface GeneratorState {
  activePickups: Pickup[]
  addPickup: (pickup: Pickup) => void
  updatePickup: (id: string, patch: Partial<Pickup>) => void
}

export const useGeneratorStore = create<GeneratorState>()(
  persist(
    (set) => ({
      activePickups: [],
      addPickup: (pickup) =>
        set((state) => ({ activePickups: [pickup, ...state.activePickups] })),
      updatePickup: (id, patch) =>
        set((state) => ({
          activePickups: state.activePickups.map((p) =>
            p.id === id ? { ...p, ...patch } : p
          ),
        })),
    }),
    {
      name: "coco-generator-pickups",
      storage: createJSONStorage(() => localStorage),
    }
  )
)