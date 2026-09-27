"use server"

import { isSupabaseConfigured } from "@/lib/supabase/config"
import { createClient } from "@/lib/supabase/server"
import type { PaymentTransaction } from "@/lib/types"

function toTransaction(row: Record<string, unknown>): PaymentTransaction {
  return {
    id: String(row.id),
    user_id: String(row.user_id),
    type: row.type as PaymentTransaction["type"],
    amount: Number(row.amount),
    status: row.status as PaymentTransaction["status"],
    reference: row.reference ? String(row.reference) : undefined,
    upi_id: row.upi_id ? String(row.upi_id) : undefined,
    pickup_id: row.pickup_id ? String(row.pickup_id) : undefined,
    created_at: String(row.created_at),
    settled_at: row.settled_at ? String(row.settled_at) : undefined,
  }
}

export async function getTransactionsAction(
  userId: string
): Promise<PaymentTransaction[]> {
  if (!isSupabaseConfigured()) return []

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
  if (error || !data) return []
  return data.map((row) => toTransaction(row as Record<string, unknown>))
}

export async function requestPayoutAction(input: {
  userId: string
  amount: number
  upiId: string
}): Promise<{ ok: boolean; reference?: string; transactionId?: string; error?: string }> {
  const reference = `NARYALRE-${Math.floor(100000 + Math.random() * 899999)}`

  if (!isSupabaseConfigured()) {
    return { ok: true, reference }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("transactions")
    .insert({
      user_id: input.userId,
      type: "payout",
      amount: input.amount,
      status: "pending",
      reference,
      upi_id: input.upiId,
    })
    .select("id")
    .single()
  if (error) return { ok: false, error: error.message }
  return { ok: true, reference, transactionId: data.id }
}

export async function settlePayoutAction(input: {
  transactionId: string
}): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { ok: true }

  const supabase = await createClient()
  const { error } = await supabase
    .from("transactions")
    .update({ status: "settled", settled_at: new Date().toISOString() })
    .eq("id", input.transactionId)
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function updateProfileUpiAction(input: {
  userId: string
  upiId: string
}): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { ok: true }

  const supabase = await createClient()
  const { error } = await supabase
    .from("profiles")
    .update({ upi_id: input.upiId })
    .eq("id", input.userId)
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}