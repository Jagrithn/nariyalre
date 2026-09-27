"use client"

import { useEffect, useRef } from "react"
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet"
import { divIcon, LatLngBounds } from "leaflet"
import "leaflet/dist/leaflet.css"

import { cn } from "@/lib/utils"

export interface PickupMarkerData {
  id: string
  lat: number
  lng: number
  weightKg: number
  selected?: boolean
}

export interface MapPinData {
  id: string
  lat: number
  lng: number
  label: string
  color: "emerald" | "amber" | "teal"
}

export type PickupMapProps = {
  center: { lat: number; lng: number }
  pickups?: PickupMarkerData[]
  pins?: MapPinData[]
  route?: [number, number][]
  focus?: { lat: number; lng: number } | null
  focusKey?: string
  zoom?: number
  className?: string
  onPickupClick?: (id: string) => void
}

function pickupIcon(weightKg: number, selected = false) {
  return divIcon({
    className: "coco-leaflet-marker",
    html: `<div style="display:flex;align-items:center;justify-content:center;width:${selected ? 44 : 36}px;height:${selected ? 44 : 36}px;border-radius:9999px;background:#059669;color:#fff;font-weight:700;font-size:${selected ? 13 : 11}px;box-shadow:0 4px 14px rgba(5,150,105,.45), 0 0 0 ${selected ? 6 : 4}px rgba(5,150,105,.18);border:2px solid #fff;transform:scale(${selected ? 1.1 : 1});transition:transform .2s;">${Math.round(weightKg)}</div>`,
    iconSize: [selected ? 44 : 36, selected ? 44 : 36],
    iconAnchor: [selected ? 22 : 18, selected ? 44 : 36],
  })
}

function pinIcon(pin: MapPinData) {
  const colors = {
    emerald: "#059669",
    amber: "#d97706",
    teal: "#0d9488",
  }
  const color = colors[pin.color]
  return divIcon({
    className: "coco-leaflet-pin",
    html: `<div style="display:flex;flex-direction:column;align-items:center;filter:drop-shadow(0 2px 4px rgba(0,0,0,.25));">
      <div style="background:${color};width:14px;height:14px;border-radius:9999px 9999px 9999px 0;transform:rotate(-45deg);border:2px solid #fff;box-shadow:0 3px 8px rgba(0,0,0,.3);"></div>
      <div style="margin-top:-6px;background:#fff;border-radius:9999px;padding:1px 6px;font-size:9px;font-weight:700;color:${color};border:1px solid rgba(0,0,0,.08);">${pin.label}</div>
    </div>`,
    iconSize: [20, 30],
    iconAnchor: [10, 28],
  })
}

function FocusController({
  point,
  marker,
}: {
  point: { lat: number; lng: number } | null
  marker: string
}) {
  const map = useMap()
  const pointRef = useRef(point)
  pointRef.current = point
  useEffect(() => {
    const target = pointRef.current
    if (target) {
      map.flyTo([target.lat, target.lng], 15, { duration: 0.8 })
    }
  }, [marker, map])
  return null
}

function FitController({ bounds }: { bounds: LatLngBounds | null }) {
  const map = useMap()
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [48, 48], maxZoom: 15 })
    }
  }, [bounds, map])
  return null
}

export function PickupMap({
  center,
  pickups = [],
  pins = [],
  route,
  focus = null,
  focusKey = "",
  zoom = 13,
  className,
  onPickupClick,
}: PickupMapProps) {
  const bounds =
    pickups.length > 1 || pins.length > 0
      ? new LatLngBounds([
          ...pins.map((p) => [p.lat, p.lng] as [number, number]),
          ...pickups.map((p) => [p.lat, p.lng] as [number, number]),
        ])
      : null

  return (
    <div className={cn("relative w-full", className)}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        zoomControl={true}
        doubleClickZoom={false}
        className="h-full min-h-[220px] w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          subdomains={["a", "b", "c"]}
        />
        {pins.map((pin) => (
          <Marker
            key={pin.id}
            position={[pin.lat, pin.lng]}
            icon={pinIcon(pin)}
          />
        ))}
        {pickups.map((p) => (
          <Marker
            key={p.id}
            position={[p.lat, p.lng]}
            icon={pickupIcon(p.weightKg, p.selected)}
            eventHandlers={
              onPickupClick
                ? { click: () => onPickupClick(p.id) }
                : undefined
            }
          />
        ))}
        {route && route.length > 1 ? (
          <Polyline
            positions={route}
            pathOptions={{ color: "#059669", weight: 5, opacity: 0.85 }}
          />
        ) : null}
        {pins.length === 0 && (
          <FocusController point={focus} marker={focusKey} />
        )}
        {bounds && <FitController bounds={bounds} />}
      </MapContainer>

      {route && (
        <div className="pointer-events-none absolute inset-x-0 top-3 z-[500] flex justify-center">
          <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-md">
            {route.length > 2 ? "Optimal route · OSRM" : "Direct path · offline"}
          </span>
        </div>
      )}
    </div>
  )
}