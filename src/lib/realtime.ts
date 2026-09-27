"use client"

import { createClient } from "@/lib/supabase/client"
import { isSupabaseConfigured } from "@/lib/supabase/config"
import type { LiveLocation } from "@/lib/types"

type Handler = (location: LiveLocation) => void

const channels = new Map<string, () => void>()

export function subscribeToPickup(
  pickupId: string,
  onUpdate: Handler
): () => void {
  if (!isSupabaseConfigured()) return () => {}

  const existing = channels.get(pickupId)
  if (existing) return existing

  const client = createClient()
  const channel = client
    .channel(`pickup-live-${pickupId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "pickup_live_locations",
        filter: `pickup_id=eq.${pickupId}`,
      },
      (payload) => {
        const row = payload.new as Record<string, unknown> | null
        if (
          !row ||
          typeof row.lat !== "number" ||
          typeof row.lng !== "number"
        ) {
          return
        }
        onUpdate({
          pickup_id: String(row.pickup_id ?? pickupId),
          lat: Number(row.lat),
          lng: Number(row.lng),
          updated_at: String(row.updated_at ?? new Date().toISOString()),
        })
      }
    )
    .subscribe()

  const stop = () => {
    void client.removeChannel(channel)
    channels.delete(pickupId)
  }
  channels.set(pickupId, stop)
  return stop
}