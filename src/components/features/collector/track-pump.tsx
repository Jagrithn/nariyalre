"use client"

import { useEffect, useRef } from "react"

import { publishLocationAction } from "@/actions/tracking"
import { useGeolocation } from "@/hooks/use-geolocation"

export function TrackPump({
  pickupId,
  collectorId,
  path,
  active,
}: {
  pickupId: string
  collectorId: string
  path: [number, number][]
  active: boolean
}) {
  const { coords } = useGeolocation()
  const stepRef = useRef(0)

  useEffect(() => {
    if (!active || path.length === 0) return
    stepRef.current = 0
    const id = setInterval(() => {
      let lat: number
      let lng: number
      if (coords) {
        lat = coords.lat
        lng = coords.lng
      } else {
        const [latV, lngV] = path[Math.min(stepRef.current, path.length - 1)]
        lat = latV
        lng = lngV
        stepRef.current += 1
      }
      void publishLocationAction({ pickupId, collectorId, lat, lng }).catch(
        () => undefined
      )
    }, 4000)
    return () => clearInterval(id)
  }, [active, path, coords, pickupId, collectorId])

  return null
}