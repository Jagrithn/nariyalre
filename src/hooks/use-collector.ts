"use client"

import { useQuery } from "@tanstack/react-query"

import { getPickupsData } from "@/actions/data"
import { CURRENT_COLLECTOR_ID } from "@/lib/constants"

export function usePendingPickups() {
  return useQuery({
    queryKey: ["collector", "pending"],
    queryFn: async () => {
      const all = await getPickupsData()
      return all.filter((p) => p.status === "pending")
    },
  })
}

export function useCollectorPickups() {
  return useQuery({
    queryKey: ["collector", "pickups"],
    queryFn: async () => {
      const all = await getPickupsData()
      return all.filter((p) => p.collector_id === CURRENT_COLLECTOR_ID)
    },
  })
}