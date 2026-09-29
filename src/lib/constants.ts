import type { PickupSlot } from "@/lib/types"

export const CO2_PER_KG = 0.24
export const RATE_PER_KG = 2.5
export const SHELLS_PER_KG = 4
export const PAYOUT_MIN = 50
export const DEFAULT_DEPOT_COORDS = { lat: 13.0508, lng: 80.2412 }
export const CURRENT_GENERATOR_ID = "u_gen_1"
export const CURRENT_COLLECTOR_ID = "u_col_1"
export const CURRENT_CONSUMER_ID = "u_cons_1"

export const SLOTS: {
  id: PickupSlot
  label: string
  hint: string
  startHour?: number
  endHour?: number
}[] = [
  { id: "now", label: "Now", hint: "As soon as possible" },
  { id: "06-10", label: "Morning", hint: "6 – 10 AM", startHour: 6, endHour: 10 },
  { id: "10-14", label: "Midday", hint: "10 AM – 2 PM", startHour: 10, endHour: 14 },
  { id: "14-18", label: "Afternoon", hint: "2 – 6 PM", startHour: 14, endHour: 18 },
  { id: "18-22", label: "Evening", hint: "6 – 10 PM", startHour: 18, endHour: 22 },
]

export function slotMeta(slot: PickupSlot | undefined) {
  return SLOTS.find((s) => s.id === slot) ?? SLOTS[0]
}