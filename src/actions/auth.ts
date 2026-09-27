"use server"

import { isSupabaseConfigured } from "@/lib/supabase/config"
import { createClient } from "@/lib/supabase/server"
import { mockUsers } from "@/lib/mockData"
import type { UserRole } from "@/lib/types"

export interface OtpUser {
  id: string
  role: UserRole
  fullName: string
  phone: string
}

export type SendOtpResult =
  | { ok: true; mock: true; code: string; user: OtpUser | null }
  | { ok: true; mock: false }
  | { ok: false; error: string }

export type VerifyOtpResult =
  | { ok: true; user: OtpUser }
  | { ok: false; error: string }

function normalizePhone(phone: string): string {
  return phone.trim().replace(/[\s-]/g, "")
}

function roleForPhone(phone: string): UserRole {
  if (/000[1-3]$/.test(phone)) return "generator"
  if (/001[12]$/.test(phone)) return "collector"
  if (/0021$/.test(phone)) return "depot"
  if (/0031$/.test(phone)) return "admin"
  return "generator"
}

function mockUserForPhone(phone: string): OtpUser | null {
  const match = mockUsers.find((u) => u.phone === phone)
  if (match) {
    return { id: match.id, role: match.role, fullName: match.full_name, phone }
  }
  return null
}

export async function sendOtpAction(phone: string): Promise<SendOtpResult> {
  const normalized = normalizePhone(phone)
  if (!isSupabaseConfigured()) {
    return {
      ok: true,
      mock: true,
      code: "420420",
      user: mockUserForPhone(normalized),
    }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithOtp({ phone: normalized })
  if (error) return { ok: false, error: error.message }
  return { ok: true, mock: false }
}

export async function verifyOtpAction(phone: string, token: string): Promise<VerifyOtpResult> {
  const normalized = normalizePhone(phone)

  if (!isSupabaseConfigured()) {
    const user = mockUserForPhone(normalized)
    if (token.trim() === "420420" && user) {
      return { ok: true, user }
    }
    return { ok: false, error: "Invalid OTP or unknown demo number." }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.verifyOtp({
    type: "sms",
    phone: normalized,
    token: token.trim(),
  })
  if (error || !data.user) {
    return { ok: false, error: error?.message ?? "Verification failed." }
  }

  const authPhone = data.user.phone ?? normalized
  const mock = mockUserForPhone(authPhone)
  const user: OtpUser = mock ?? {
    id: data.user.id,
    role: roleForPhone(normalized),
    fullName: data.user.user_metadata?.full_name ?? authPhone.slice(-10),
    phone: authPhone,
  }
  return { ok: true, user }
}

export async function signOutAction(): Promise<void> {
  if (!isSupabaseConfigured()) return
  const supabase = await createClient()
  await supabase.auth.signOut()
}