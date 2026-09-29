"use server"

import { isSupabaseConfigured } from "@/lib/supabase/config"
import { createClient } from "@/lib/supabase/server"
import { PRODUCTS } from "@/lib/marketplace"
import { VENDING_MACHINES } from "@/lib/machines"
import type {
  OrderItem,
  OrderStatus,
  Product,
  VendingMachine,
} from "@/lib/types"

export async function getProductsAction(): Promise<{
  ok: boolean
  products: Product[]
  error?: string
}> {
  if (!isSupabaseConfigured()) return { ok: true, products: PRODUCTS }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("products")
    .select("id, name, material_type, price, unit, description, made_by, stock, recycler_kg, accent")
    .order("price", { ascending: true })
  if (error) return { ok: false, products: [], error: error.message }
  return { ok: true, products: data as Product[] }
}

export async function getMachinesAction(): Promise<{
  ok: boolean
  machines: VendingMachine[]
  error?: string
}> {
  if (!isSupabaseConfigured()) return { ok: true, machines: VENDING_MACHINES }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("vending_machines")
    .select("id, name, address, lat, lng, fill_level, payout_per_kg, accepts")
    .order("name", { ascending: true })
  if (error) return { ok: false, machines: [], error: error.message }
  return { ok: true, machines: data as VendingMachine[] }
}

export async function placeOrderAction(input: {
  userId: string
  items: OrderItem[]
  total: number
  kgDiverted: number
  address?: string
}): Promise<{ ok: boolean; id?: string; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { ok: true, id: `ord_${Date.now()}` }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("orders")
    .insert({
      user_id: input.userId,
      items: input.items,
      total: input.total,
      kg_diverted: input.kgDiverted,
      status: "placed",
      address: input.address ?? null,
    })
    .select("id")
    .single()
  if (error) return { ok: false, error: error.message }
  return { ok: true, id: data.id }
}

export async function markOrderStatusAction(
  orderId: string,
  status: OrderStatus
): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { ok: true }

  const supabase = await createClient()
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}