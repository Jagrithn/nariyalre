"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import type { Pickup } from "@/lib/types"

export interface CompletedJob {
  pickupId: string
  weightKg: number
  earned: number
  completedAt: string
  addressText?: string
}

export interface PayoutRecord {
  id: string
  amount: number
  paidAt: string
  reference?: string
  upiId?: string
  status: "pending" | "settled" | "rejected"
}

interface CollectorState {
  activeJobs: Pickup[]
  completedJobs: CompletedJob[]
  settled: number
  upiId: string
  payouts: PayoutRecord[]
  acceptJob: (pickup: Pickup) => void
  advanceToTransit: (id: string) => void
  cancelJob: (id: string) => void
  completeJob: (id: string, actualKg: number, ratePerKg: number) => void
  setUpiId: (upiId: string) => void
  beginPayout: (amount: number, upiId: string) => string
  settlePayout: (id: string, reference?: string) => void
  rejectPayout: (id: string) => void
}

export const useCollectorStore = create<CollectorState>()(
  persist(
    (set) => ({
      activeJobs: [],
      completedJobs: [],
      settled: 0,
      upiId: "ravi.shankar@okhdfcbank",
      payouts: [],
      acceptJob: (pickup) =>
        set((state) => ({
          activeJobs: [
            { ...pickup, status: "accepted", collector_id: "u_col_1" },
            ...state.activeJobs.filter((p) => p.id !== pickup.id),
          ],
        })),
      advanceToTransit: (id) =>
        set((state) => ({
          activeJobs: state.activeJobs.map((p) =>
            p.id === id ? { ...p, status: "in_transit" } : p
          ),
        })),
      cancelJob: (id) =>
        set((state) => ({
          activeJobs: state.activeJobs.filter((p) => p.id !== id),
        })),
      completeJob: (id, actualKg, ratePerKg) =>
        set((state) => {
          const job = state.activeJobs.find((p) => p.id === id)
          if (!job) return state
          const earned = Math.round(actualKg * ratePerKg)
          return {
            activeJobs: state.activeJobs.filter((p) => p.id !== id),
            completedJobs: [
              {
                pickupId: id,
                weightKg: actualKg,
                earned,
                completedAt: new Date().toISOString(),
                addressText: job.address_text,
              },
              ...state.completedJobs,
            ],
          }
        }),
      setUpiId: (upiId) => set({ upiId }),
      beginPayout: (amount, upiId) => {
        const id = `pay_${Date.now()}`
        set((state) => ({
          payouts: [
            {
              id,
              amount,
              paidAt: new Date().toISOString(),
              upiId,
              status: "pending",
            },
            ...state.payouts,
          ],
        }))
        return id
      },
      settlePayout: (id, reference) =>
        set((state) => ({
          payouts: state.payouts.map((p) =>
            p.id === id
              ? { ...p, status: "settled", reference: reference ?? p.reference }
              : p
          ),
        })),
      rejectPayout: (id) =>
        set((state) => ({
          payouts: state.payouts.map((p) =>
            p.id === id ? { ...p, status: "rejected" } : p
          ),
        })),
    }),
    {
      name: "coco-collector-state",
      storage: createJSONStorage(() => localStorage),
    }
  )
)