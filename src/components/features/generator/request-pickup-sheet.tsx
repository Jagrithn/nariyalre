"use client"

import { useState } from "react"
import { Landmark, Loader2, MapPinCheck, ShoppingBasket, Store } from "lucide-react"

import {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetDescription,
  BottomSheetHeader,
  BottomSheetTitle,
} from "@/components/ui/bottom-sheet"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { StaticMap } from "@/components/ui/static-map"
import { useToast } from "@/components/ui/use-toast"
import { requestPickupAction } from "@/actions/mutations"
import { useGeolocation } from "@/hooks/use-geolocation"
import { CURRENT_GENERATOR_ID, SHELLS_PER_KG, SLOTS } from "@/lib/constants"
import { useGeneratorStore } from "@/lib/stores/generator"
import type { LocationType, Pickup, PickupSlot } from "@/lib/types"
import { cn } from "@/lib/utils"

const LOCATION_TYPES: { value: LocationType; label: string; icon: typeof Landmark }[] =
  [
    { value: "temple", label: "Temple", icon: Landmark },
    { value: "vendor", label: "Vendor", icon: Store },
    { value: "market", label: "Market", icon: ShoppingBasket },
  ]

const FALLBACK = { lat: 13.0487, lng: 80.2757 }

export function RequestPickupSheet({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { coords, status, refresh } = useGeolocation()
  const addPickup = useGeneratorStore((s) => s.addPickup)
  const { toast } = useToast()

  const [weight, setWeight] = useState(30)
  const [locationType, setLocationType] = useState<LocationType>("temple")
  const [slot, setSlot] = useState<PickupSlot>("now")
  const [submitting, setSubmitting] = useState(false)

  const lat = coords?.lat ?? FALLBACK.lat
  const lng = coords?.lng ?? FALLBACK.lng
  const shells = weight * SHELLS_PER_KG
  const locating = status === "locating" || status === "idle"

  const slotDate = slot === "now" ? undefined : new Date().toLocaleDateString("en-CA")

  const reset = () => {
    setWeight(30)
    setLocationType("temple")
    setSlot("now")
  }

  const onOpenChangeInternal = (next: boolean) => {
    if (!next) reset()
    onOpenChange(next)
  }

  const submit = () => {
    setSubmitting(true)
    const pickup: Pickup = {
      id: `pk_opt_${Date.now()}`,
      generator_id: CURRENT_GENERATOR_ID,
      requested_kg: weight,
      status: "pending",
      geo_lat: lat,
      geo_lng: lng,
      address_text:
        coords ? "Current location (auto-tagged by GPS)"
        : "Live location — GPS denied, using last known area",
      generator_name: "Mariyamma Temple Trust",
      location_type: locationType,
      requested_slot: slot,
      slot_date: slotDate,
      created_at: new Date().toISOString(),
    }

    setTimeout(() => {
      void requestPickupAction({
        generatorId: CURRENT_GENERATOR_ID,
        requestedKg: weight,
        geoLat: lat,
        geoLng: lng,
        addressText: pickup.address_text,
        locationType,
        generatorName: pickup.generator_name,
        requestedSlot: slot,
        slotDate,
      }).catch(() => {})
      addPickup(pickup)
      setSubmitting(false)
      onOpenChangeInternal(false)
      toast({
        title: "Pickup scheduled",
        description: `${weight} kg logged. A nearby collector has been notified.`,
      })
    }, 500)
  }

  return (
    <BottomSheet open={open} onOpenChange={onOpenChangeInternal}>
      <BottomSheetContent>
        <BottomSheetHeader className="pr-8">
          <BottomSheetTitle>Request pickup</BottomSheetTitle>
          <BottomSheetDescription>
            Pin your waste location and estimate the volume.
          </BottomSheetDescription>
        </BottomSheetHeader>

        <div className="mt-4">
          <StaticMap lat={lat} lng={lng} pinLabel={locating ? "Finding you…" : "You are here"} />
          <button
            type="button"
            onClick={refresh}
            className="mt-2 flex items-center gap-1.5 text-xs font-medium text-emerald-700 hover:underline dark:text-emerald-300"
          >
            <MapPinCheck className="size-3.5" />
            {locating
              ? "Locating your GPS position…"
              : "Re-tag my exact location"}
          </button>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-baseline justify-between">
            <p className="text-sm font-medium">Estimated weight</p>
            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
              {weight}
              <span className="text-sm font-semibold text-muted-foreground"> kg</span>
            </p>
          </div>
          <Slider
            min={1}
            max={150}
            step={1}
            value={[weight]}
            onValueChange={(v) => setWeight(v[0])}
            aria-label="Estimated weight in kilograms"
          />
          <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
            <span>1 kg</span>
            <span>~{shells.toLocaleString("en-IN")} shells</span>
            <span>150 kg</span>
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-baseline justify-between">
            <p className="text-sm font-medium">Pickup window</p>
            {slot !== "now" && (
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                {slotDate}
              </span>
            )}
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {SLOTS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSlot(s.id)}
                className={cn(
                  "rounded-xl border px-1 py-2 text-center transition-all",
                  slot === s.id
                    ? "border-emerald-600 bg-emerald-600/10 text-emerald-700 dark:border-emerald-500 dark:text-emerald-300"
                    : "border-input bg-background text-muted-foreground hover:bg-muted"
                )}
              >
                <span className="block text-xs font-bold">{s.label}</span>
                <span className="block text-[9px] text-muted-foreground">
                  {s.hint}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-sm font-medium">Pickup point type</p>
          <div className="grid grid-cols-3 gap-2">
            {LOCATION_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setLocationType(t.value)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-medium transition-all",
                  locationType === t.value
                    ? "border-emerald-600 bg-emerald-600/10 text-emerald-700 dark:border-emerald-500 dark:text-emerald-300"
                    : "border-input bg-background text-muted-foreground hover:bg-muted"
                )}
              >
                <t.icon className="size-5" />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-2">
          <Button onClick={submit} disabled={submitting} size="lg" className="w-full">
            {submitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Confirm pickup request"
            )}
          </Button>
          <BottomSheetClose asChild>
            <Button variant="ghost" className="w-full" disabled={submitting}>
              Cancel
            </Button>
          </BottomSheetClose>
        </div>
      </BottomSheetContent>
    </BottomSheet>
  )
}