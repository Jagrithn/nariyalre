import { haversineKm, etaMinutes, formatDistanceKm } from "@/lib/geo"
import type { Pickup } from "@/lib/types"

export interface RouteResult {
  points: [number, number][]
  distanceKm: number
  durationMin: number
  source: "osrm" | "direct"
}

export async function getDrivingRoute(
  start: { lat: number; lng: number },
  end: { lat: number; lng: number }
): Promise<RouteResult> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) })
    if (!res.ok) throw new Error(`OSRM responded ${res.status}`)
    const data = await res.json()
    if (data.code !== "Ok" || !data.routes?.[0]) {
      throw new Error("OSRM returned no route")
    }
    const coords = data.routes[0].geometry.coordinates as [number, number][]
    const distanceKm = data.routes[0].distance / 1000
    const durationMin = Math.ceil(data.routes[0].duration / 60)
    return {
      points: coords.map(([lng, lat]) => [lat, lng]),
      distanceKm,
      durationMin,
      source: "osrm",
    }
  } catch {
    const distanceKm = haversineKm(start, end)
    return {
      points: [
        [start.lat, start.lng],
        [end.lat, end.lng],
      ],
      distanceKm,
      durationMin: etaMinutes(distanceKm),
      source: "direct",
    }
  }
}

export function pickupDistanceKm(
  pickup: Pickup,
  origin: { lat: number; lng: number }
): number {
  return haversineKm(origin, { lat: pickup.geo_lat, lng: pickup.geo_lng })
}

export { formatDistanceKm }