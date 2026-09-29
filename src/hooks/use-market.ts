"use client"

import { useQuery } from "@tanstack/react-query"

import { getMachinesAction, getProductsAction } from "@/actions/consumer"

export function useMarketProducts() {
  return useQuery({
    queryKey: ["consumer", "products"],
    queryFn: async () => {
      const res = await getProductsAction()
      return res.ok ? res.products : []
    },
  })
}

export function useVendingMachines() {
  return useQuery({
    queryKey: ["consumer", "machines"],
    queryFn: async () => {
      const res = await getMachinesAction()
      return res.ok ? res.machines : []
    },
  })
}