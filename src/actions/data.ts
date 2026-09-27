"use server"

import { isSupabaseConfigured } from "@/lib/supabase/config"
import { createClient } from "@/lib/supabase/server"
import {
  mockDepotInventory,
  mockDistributionLogs,
  mockPickups,
  mockUsers,
} from "@/lib/mockData"
import type { DepotBatch, DistributionLog, Pickup, User } from "@/lib/types"

function toPickup(row: Record<string, unknown>): Pickup {
  return {
    id: String(row.id),
    generator_id: String(row.generator_id),
    collector_id: row.collector_id ? String(row.collector_id) : undefined,
    requested_kg: Number(row.requested_kg),
    actual_kg: row.actual_kg != null ? Number(row.actual_kg) : undefined,
    status: row.status as Pickup["status"],
    geo_lat: Number(row.geo_lat),
    geo_lng: Number(row.geo_lng),
    address_text: row.address_text ? String(row.address_text) : undefined,
    location_type: row.location_type as Pickup["location_type"],
    created_at: String(row.created_at),
    completed_at: row.completed_at ? String(row.completed_at) : undefined,
    requested_slot: row.requested_slot
      ? (String(row.requested_slot) as Pickup["requested_slot"])
      : undefined,
    slot_date: row.slot_date ? String(row.slot_date) : undefined,
  }
}

function toUser(row: Record<string, unknown>): User {
  return {
    id: String(row.id),
    role: row.role as User["role"],
    full_name: String(row.full_name),
    phone: String(row.phone),
    upi_id: row.upi_id ? String(row.upi_id) : undefined,
    created_at: String(row.created_at),
    rating: row.rating != null ? Number(row.rating) : undefined,
    is_online: Boolean(row.is_online),
  }
}

function toBatch(row: Record<string, unknown>): DepotBatch {
  return {
    id: String(row.id),
    batch_id: String(row.batch_id),
    input_raw_kg: Number(row.input_raw_kg),
    output_fiber_kg: Number(row.output_fiber_kg),
    output_shell_kg: Number(row.output_shell_kg),
    output_pith_kg: Number(row.output_pith_kg),
    processed_at: String(row.processed_at),
  }
}

function toDispatch(row: Record<string, unknown>): DistributionLog {
  return {
    id: String(row.id),
    tier: row.tier as DistributionLog["tier"],
    material_type: row.material_type as DistributionLog["material_type"],
    quantity_kg: Number(row.quantity_kg),
    destination_name: String(row.destination_name),
    dispatched_at: String(row.dispatched_at),
  }
}

export async function getPickupsData(): Promise<Pickup[]> {
  if (!isSupabaseConfigured()) return mockPickups

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("pickups")
    .select("*")
    .order("created_at", { ascending: false })
  if (error || !data) return []
  return data.map((row) => toPickup(row as Record<string, unknown>))
}

export async function getUsersData(): Promise<User[]> {
  if (!isSupabaseConfigured()) return mockUsers

  const supabase = await createClient()
  const { data, error } = await supabase.from("profiles").select("*")
  if (error || !data) return []
  return data.map((row) => toUser(row as Record<string, unknown>))
}

export async function getDepotData(): Promise<{
  batches: DepotBatch[]
  dispatchLogs: DistributionLog[]
}> {
  if (!isSupabaseConfigured()) {
    return { batches: mockDepotInventory, dispatchLogs: mockDistributionLogs }
  }

  const supabase = await createClient()
  const [batchesResult, logsResult] = await Promise.all([
    supabase
      .from("depot_batches")
      .select("*")
      .order("processed_at", { ascending: false }),
    supabase
      .from("distribution_logs")
      .select("*")
      .order("dispatched_at", { ascending: false }),
  ])

  return {
    batches: (batchesResult.data ?? []).map((row) =>
      toBatch(row as Record<string, unknown>)
    ),
    dispatchLogs: (logsResult.data ?? []).map((row) =>
      toDispatch(row as Record<string, unknown>)
    ),
  }
}