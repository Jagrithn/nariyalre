"use server"

import { isSupabaseConfigured } from "@/lib/supabase/config"
import { createClient } from "@/lib/supabase/server"
import type { AppNotification, NotificationType } from "@/lib/types"

type Row = {
  id: string
  user_id: string
  title: string
  body: string
  type: NotificationType
  read: boolean
  created_at: string
}

function mapRow(row: Row): AppNotification {
  return {
    id: row.id,
    user_id: row.user_id,
    title: row.title,
    body: row.body,
    type: row.type,
    read: row.read,
    created_at: row.created_at,
  }
}

export async function emitNotificationAction(input: {
  userId: string
  title: string
  body: string
  type?: NotificationType
}): Promise<{ ok: boolean; notification?: AppNotification; error?: string }> {
  if (!isSupabaseConfigured()) {
    const notification: AppNotification = {
      id: `ntf_${Date.now()}`,
      user_id: input.userId,
      title: input.title,
      body: input.body,
      type: input.type ?? "system",
      read: false,
      created_at: new Date().toISOString(),
    }
    return { ok: true, notification }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("notifications")
    .insert({
      user_id: input.userId,
      title: input.title,
      body: input.body,
      type: input.type ?? "system",
    })
    .select("id, user_id, title, body, type, read, created_at")
    .single()
  if (error) return { ok: false, error: error.message }
  return { ok: true, notification: mapRow(data as Row) }
}

export async function getNotificationsAction(
  userId: string
): Promise<{ ok: boolean; notifications: AppNotification[]; error?: string }> {
  if (!isSupabaseConfigured()) return { ok: true, notifications: [] }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("notifications")
    .select("id, user_id, title, body, type, read, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50)
  if (error) return { ok: false, notifications: [], error: error.message }
  return { ok: true, notifications: (data as Row[] ?? []).map(mapRow) }
}

export async function markNotificationsReadAction(
  userId: string
): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { ok: true }

  const supabase = await createClient()
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", userId)
    .eq("read", false)
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}