import type { MaterialType, VendingMachine } from "@/lib/types"
import { haversineKm } from "@/lib/geo"

export const VENDING_MACHINES: VendingMachine[] = [
  {
    id: "vm_1",
    name: "Santhome Beach Kiosk",
    address: "Santhome High Road, Chennai",
    lat: 13.0331,
    lng: 80.2781,
    fill_level: 64,
    payout_per_kg: 6,
    accepts: ["shells", "pith"],
  },
  {
    id: "vm_2",
    name: "T. Nagar Market Corner",
    address: "Usman Road, T. Nagar",
    lat: 13.0346,
    lng: 80.2342,
    fill_level: 21,
    payout_per_kg: 6,
    accepts: ["shells", "pith", "compost"],
  },
  {
    id: "vm_3",
    name: "Mylapore Tank Bund",
    address: "Luz Corner, Mylapore",
    lat: 13.0358,
    lng: 80.2675,
    fill_level: 82,
    payout_per_kg: 6,
    accepts: ["shells", "pith"],
  },
  {
    id: "vm_4",
    name: "Guindy Metro Plaza",
    address: "Guindy Metro Station",
    lat: 13.0076,
    lng: 80.2203,
    fill_level: 47,
    payout_per_kg: 6,
    accepts: ["shells", "pith", "compost"],
  },
  {
    id: "vm_5",
    name: "Adyar Depot Gate",
    address: "L.B. Road, Adyar",
    lat: 13.0011,
    lng: 80.2551,
    fill_level: 8,
    payout_per_kg: 6,
    accepts: ["shells", "pith", "compost", "fiber"],
  },
  {
    id: "vm_6",
    name: "Anna Nagar Tower Park",
    address: "2nd Avenue, Anna Nagar",
    lat: 13.0844,
    lng: 80.2107,
    fill_level: 58,
    payout_per_kg: 6,
    accepts: ["shells", "pith"],
  },
]

export const DEFAULT_MACHINE_PAYOUT_PER_KG = 6

export function depositEstimate(kg: number, perKg: number): number {
  return Math.round(kg * perKg)
}

export function machineDistanceKm(
  machine: VendingMachine,
  origin: { lat: number; lng: number }
): number {
  return haversineKm(origin, { lat: machine.lat, lng: machine.lng })
}

export function nearestMachine(
  origin: { lat: number; lng: number }
): VendingMachine {
  return [...VENDING_MACHINES].sort(
    (a, b) => machineDistanceKm(a, origin) - machineDistanceKm(b, origin)
  )[0]
}

export function materialLabel(m: MaterialType): string {
  const labels: Record<MaterialType, string> = {
    fiber: "Coir fiber",
    shells: "Shells",
    pith: "Pith",
    cocopeat: "Cocopeat",
    compost: "Compost",
  }
  return labels[m]
}