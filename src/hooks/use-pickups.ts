"use client"

import { useQuery } from "@tanstack/react-query"

import { getPickupsData } from "@/actions/data"
import { CURRENT_GENERATOR_ID } from "@/lib/constants"

export function useGeneratorPickups() {
  return useQuery({
    queryKey: ["generator", "pickups"],
    queryFn: async () => {
      const all = await getPickupsData()
      return all.filter((p) => p.generator_id === CURRENT_GENERATOR_ID)
    },
  })
}