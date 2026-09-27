import { startOfDay, addDays } from "date-fns"

import type { Pickup } from "@/lib/types"
import { CO2_PER_KG, SHELLS_PER_KG } from "@/lib/constants"

const LEVEL_THRESHOLDS = [100, 250, 500, 1000, 2500, 5000, 10000]

export interface ImpactStats {
  totalKg: number
  totalCo2Kg: number
  totalShells: number
  todayKg: number
  todayCo2Kg: number
  level: number
  nextLevelKg: number | null
  levelProgress: number
  weekly: { label: string; kg: number }[]
}

function effectiveKg(pickup: Pickup): number {
  return pickup.actual_kg ?? pickup.requested_kg ?? 0
}

export function pickupWeight(pickup: Pickup): number {
  return effectiveKg(pickup)
}

function levelFor(kg: number) {
  let level = 1
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (kg >= LEVEL_THRESHOLDS[i]) level = i + 2
  }
  const floor = level <= 1 ? 0 : LEVEL_THRESHOLDS[level - 2]
  const ceiling =
    level - 1 < LEVEL_THRESHOLDS.length ? LEVEL_THRESHOLDS[level - 1] : null
  const progress = ceiling
    ? Math.min(100, Math.round(((kg - floor) / (ceiling - floor)) * 100))
    : 100
  return { level, levelProgress: progress, nextLevelKg: ceiling }
}

export function computeImpactStats(pickups: Pickup[]): ImpactStats {
  const today = startOfDay(new Date())

  const totalKg = pickups.reduce((sum, p) => sum + effectiveKg(p), 0)
  const todayKg = pickups
    .filter(
      (p) =>
        startOfDay(new Date(p.created_at)).getTime() === today.getTime()
    )
    .reduce((sum, p) => sum + effectiveKg(p), 0)

  const { level, levelProgress, nextLevelKg } = levelFor(totalKg)

  const weekly = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(today, i - 6)
    const kg = pickups
      .filter(
        (p) =>
          startOfDay(new Date(p.created_at)).getTime() === day.getTime()
      )
      .reduce((sum, p) => sum + effectiveKg(p), 0)
    return {
      label: day.toLocaleDateString("en-IN", { weekday: "short" }),
      kg: Math.round(kg),
    }
  })

  return {
    totalKg: Math.round(totalKg),
    totalCo2Kg: round1(totalKg * CO2_PER_KG),
    totalShells: Math.round(totalKg * SHELLS_PER_KG),
    todayKg: round1(todayKg),
    todayCo2Kg: round1(todayKg * CO2_PER_KG),
    level,
    nextLevelKg,
    levelProgress,
    weekly,
  }
}

function round1(value: number): number {
  return Math.round(value * 10) / 10
}

export function greetingForHour(hour: number): string {
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}