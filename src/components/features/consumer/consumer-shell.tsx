"use client"

import { TreePalm } from "lucide-react"

import { ConsumerBottomNav } from "@/components/features/consumer/consumer-bottom-nav"
import { NotificationBell } from "@/components/features/shared/notification-bell"
import { CURRENT_CONSUMER_ID } from "@/lib/constants"
import { useSessionStore } from "@/lib/stores/session"

export function ConsumerShell({ children }: { children: React.ReactNode }) {
  const user = useSessionStore((s) => s.user)

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-md items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex size-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
              <TreePalm className="size-4.5" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-bold tracking-tight">
                Coco<span className="text-emerald-600"> Market</span>
              </p>
              <p className="text-[10px] font-medium text-muted-foreground">
                {user ? user.fullName : "Guest shopper"}
              </p>
            </div>
          </div>
          <NotificationBell userId={user?.id ?? CURRENT_CONSUMER_ID} />
        </div>
      </header>

      <main className="flex-1 px-4 pt-4 pb-28">{children}</main>

      <ConsumerBottomNav />
    </div>
  )
}