"use client"

import { useEffect, useState } from "react"

export type GeolocationStatus = "idle" | "locating" | "granted" | "denied"

interface UseGeolocationResult {
  coords: { lat: number; lng: number } | null
  status: GeolocationStatus
  refresh: () => void
}

export function useGeolocation(): UseGeolocationResult {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [status, setStatus] = useState<GeolocationStatus>("idle")
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setStatus("denied")
      return
    }
    setStatus("locating")
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        })
        setStatus("granted")
      },
      () => setStatus("denied"),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60_000 }
    )
  }, [tick])

  return {
    coords,
    status,
    refresh: () => setTick((t) => t + 1),
  }
}