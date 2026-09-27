"use server"

import { isSupabaseConfigured } from "@/lib/supabase/config"
import { createClient } from "@/lib/supabase/server"
import type { DepotBatch, DistributionLog } from "@/lib/types"

export interface RequestPickupInput {
  generatorId: string
  requestedKg: number
  geoLat: number
  geoLng: number
  addressText?: string
  locationType?: string
  generatorName?: string
  requestedSlot?: string
  slotDate?: string
}

export async function requestPickupAction(
  input: RequestPickupInput
): Promise<{ ok: boolean; id?: string; error?: string }> {
  if (!isSupabaseConfigured()) return { ok: true }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("pickups")
    .insert({
      generator_id: input.generatorId,
      requested_kg: input.requestedKg,
      status: "pending",
      geo_lat: input.geoLat,
      geo_lng: input.geoLng,
      address_text: input.addressText ?? null,
      location_type: input.locationType ?? null,
      requested_slot: input.requestedSlot ?? null,
      slot_date: input.slotDate ?? null,
    })
    .select("id")
    .single()
  if (error) return { ok: false, error: error.message }
  return { ok: true, id: data.id }
}

export async function acceptPickupAction(
  pickupId: string,
  collectorId: string
): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { ok: true }

  const supabase = await createClient()
  const { error } = await supabase
    .from("pickups")
    .update({ collector_id: collectorId, status: "accepted" })
    .eq("id", pickupId)
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function completePickupAction(input: {
  pickupId: string
  actualKg: number
  collectorId: string
}): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { ok: true }

  const supabase = await createClient()
  const { error } = await supabase
    .from("pickups")
    .update({
      actual_kg: input.actualKg,
      collector_id: input.collectorId,
      status: "completed",
      completed_at: new Date().toISOString(),
    })
    .eq("id", input.pickupId)
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function logDepotBatchAction(
  batch: Omit<DepotBatch, "id">
): Promise<{ ok: boolean; id?: string; error?: string }> {
  if (!isSupabaseConfigured()) return { ok: true }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("depot_batches")
    .insert({
      batch_id: batch.batch_id,
      input_raw_kg: batch.input_raw_kg,
      output_fiber_kg: batch.output_fiber_kg,
      output_shell_kg: batch.output_shell_kg,
      output_pith_kg: batch.output_pith_kg,
      processed_at: batch.processed_at,
    })
    .select("id")
    .single()
  if (error) return { ok: false, error: error.message }
  return { ok: true, id: data.id }
}

export async function logDispatchAction(
  log: Omit<DistributionLog, "id">
): Promise<{ ok: boolean; id?: string; error?: string }> {
  if (!isSupabaseConfigured()) return { ok: true }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("distribution_logs")
    .insert({
      tier: log.tier,
      material_type: log.material_type,
      quantity_kg: log.quantity_kg,
      destination_name: log.destination_name,
      dispatched_at: log.dispatched_at,
    })
    .select("id")
    .single()
  if (error) return { ok: false, error: error.message }
  return { ok: true, id: data.id }
}