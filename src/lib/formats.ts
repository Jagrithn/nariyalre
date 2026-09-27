import { format, formatDistanceToNowStrict, isToday, isYesterday } from "date-fns"

export function formatKg(kg: number): string {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(2).replace(/\.00$/, "")} t`
  }
  return `${kg >= 100 ? Math.round(kg) : Number(kg.toFixed(1))} kg`
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatDateTime(iso: string | undefined): string {
  if (!iso) return "—"
  return format(new Date(iso), "d MMM yyyy, h:mm a")
}

export function formatDateShort(iso: string | undefined): string {
  if (!iso) return "—"
  return format(new Date(iso), "d MMM")
}

export function timeAgo(iso: string | undefined): string {
  if (!iso) return "—"
  const date = new Date(iso)
  if (isToday(date)) {
    return formatDistanceToNowStrict(date, { addSuffix: true })
  }
  if (isYesterday(date)) {
    return "yesterday"
  }
  return format(date, "d MMM yyyy")
}

export function formatPercent(numerator: number, denominator: number): number {
  if (denominator === 0) return 0
  return Math.round((numerator / denominator) * 100)
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}