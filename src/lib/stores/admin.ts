"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import type { DepotBatch, DistributionLog } from "@/lib/types"

interface AdminState {
  batches: DepotBatch[]
  dispatchLogs: DistributionLog[]
  addBatch: (batch: DepotBatch) => void
  addDispatch: (log: DistributionLog) => void
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      batches: [],
      dispatchLogs: [],
      addBatch: (batch) =>
        set((state) => ({ batches: [batch, ...state.batches] })),
      addDispatch: (log) =>
        set((state) => ({ dispatchLogs: [log, ...state.dispatchLogs] })),
    }),
    {
      name: "coco-admin-operations",
      storage: createJSONStorage(() => localStorage),
    }
  )
)