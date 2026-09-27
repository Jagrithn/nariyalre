import { SLOTS } from "@/lib/constants"
import type { Pickup } from "@/lib/types"

export interface SlotReminder {
  pickupId: string
  requestedKg: number
  slotLabel: string
  slotHint: string
}

export function localDate(d: Date): string {
  const year = d.getFullYear()
  const month = `${d.getMonth() + 1}`.padStart(2, "0")
  const day = `${d.getDate()}`.padStart(2, "0")
  return `${year}-${month}-${day}`
}

const LEAD_MS = 45 * 60 * 1000
const FOLLOW_MS = 90 * 60 * 1000

export function slotReminder(
  pickup: Pickup,
  now: Date = new Date()
): SlotReminder | null {
  if (pickup.status !== "pending") return null

  const meta = SLOTS.find((s) => s.id === pickup.requested_slot)
  if (!meta || meta.startHour === undefined) return null
  if (pickup.slot_date && pickup.slot_date !== localDate(now)) return null

  const start = new Date(now)
  start.setHours(meta.startHour, 0, 0, 0)
  const t = now.getTime()
  if (t < start.getTime() - LEAD_MS || t > start.getTime() + FOLLOW_MS) {
    return null
  }

  return {
    pickupId: pickup.id,
    requestedKg: pickup.requested_kg,
    slotLabel: meta.label,
    slotHint: meta.hint,
  }
}