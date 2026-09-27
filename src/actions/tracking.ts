"use server"

import { isSupabaseConfigured } from "@/lib/supabase/config"
import { createClient } from "@/lib/supabase/server"
import type { LiveLocation } from "@/lib/types"

export async function publishLocationAction(input: {
  pickupId: string
  collectorId: string
  lat: number
  lng: number
}): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { ok: true }

  const supabase = await createClient()
  const { error } = await supabase.from("pickup_live_locations").upsert(
    {
      pickup_id: input.pickupId,
      collector_id: input.collectorId,
      lat: input.lat,
      lng: input.lng,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "pickup_id" }
  )
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function getLiveLocationAction(
  pickupId: string
): Promise<{ ok: boolean; location?: LiveLocation; error?: string }> {
  if (!isSupabaseConfigured()) return { ok: false }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("pickup_live_locations")
    .select("pickup_id, lat, lng, updated_at")
    .eq("pickup_id", pickupId)
    .maybeSingle()
  if (error) return { ok: false, error: error.message }
  if (!data) return { ok: false }
  return {
    ok: true,
    location: {
      pickup_id: data.pickup_id,
      lat: data.lat,
      lng: data.lng,
      updated_at: data.updated_at,
    },
  }
}