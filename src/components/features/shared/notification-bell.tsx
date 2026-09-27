"use client"

import { useEffect, useState } from "react"
import { Bell, IndianRupee, Truck, X } from "lucide-react"

import {
  getNotificationsAction,
  markNotificationsReadAction,
} from "@/actions/notifications"
import { useNotificationsStore } from "@/lib/stores/notifications"
import { isSupabaseConfigured } from "@/lib/supabase/config"
import { cn } from "@/lib/utils"
import type { AppNotification } from "@/lib/types"

const typeIcon = {
  pickup_status: Truck,
  payment: IndianRupee,
  system: Bell,
} as const

export function NotificationBell({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false)
  const notifications = useNotificationsStore((s) => s.notifications)
  const replaceAll = useNotificationsStore((s) => s.replaceAll)
  const markAllRead = useNotificationsStore((s) => s.markAllRead)

  const scoped = notifications.filter((n) => n.user_id === userId)
  const unread = scoped.filter((n) => !n.read).length

  useEffect(() => {
    if (!isSupabaseConfigured()) return
    const poll = () => {
      void getNotificationsAction(userId).then((res) => {
        if (res.ok) replaceAll(res.notifications)
      })
    }
    poll()
    const id = setInterval(poll, 15000)
    return () => clearInterval(id)
  }, [userId, replaceAll])

  const markAll = () => {
    markAllRead()
    void markNotificationsReadAction(userId).catch(() => undefined)
  }

  return (
    <>
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => setOpen(true)}
        className="relative inline-flex size-9 items-center justify-center rounded-full border bg-card text-muted-foreground shadow-sm transition-colors hover:text-foreground"
      >
        <Bell className="size-4" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-[95]">
          <button
            type="button"
            aria-label="Close notifications"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="absolute top-0 right-0 flex h-full w-[320px] max-w-[85vw] flex-col bg-background shadow-2xl">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div>
                <p className="text-sm font-bold">Notifications</p>
                <p className="text-[10px] text-muted-foreground">
                  {unread > 0 ? `${unread} unread` : "You're all caught up"}
                </p>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="inline-flex size-8 items-center justify-center rounded-full hover:bg-muted"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex-1 space-y-1 overflow-y-auto p-2">
              {scoped.length === 0 && (
                <div className="px-4 py-10 text-center text-xs text-muted-foreground">
                  No notifications yet. Events like pickup acceptance and payout
                  updates will appear here.
                </div>
              )}
              {scoped.map((n) => (
                <NotificationRow key={n.id} n={n} />
              ))}
            </div>

            {scoped.length > 0 && (
              <div className="border-t p-3">
                <button
                  type="button"
                  onClick={markAll}
                  className="w-full rounded-xl border py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-600/5 dark:text-emerald-300"
                >
                  Mark all as read
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

function NotificationRow({ n }: { n: AppNotification }) {
  const markRead = useNotificationsStore((s) => s.markRead)
  const Icon = typeIcon[n.type] ?? Bell
  return (
    <button
      type="button"
      onClick={() => markRead(n.id)}
      className={cn(
        "flex w-full items-start gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors hover:bg-muted/60",
        !n.read && "bg-emerald-600/5"
      )}
    >
      <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold">{n.title}</span>
          {!n.read && <span className="size-1.5 shrink-0 rounded-full bg-emerald-600" />}
        </span>
        <span className="mt-0.5 block text-xs text-muted-foreground">
          {n.body}
        </span>
        <span className="mt-1 block text-[10px] text-muted-foreground/70">
          {new Date(n.created_at).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </span>
    </button>
  )
}