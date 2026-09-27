"use client"

import { TreePalm } from "lucide-react"

import { BottomNav } from "@/components/features/generator/bottom-nav"
import { NotificationBell } from "@/components/features/shared/notification-bell"
import { SlotReminderPoller } from "@/components/features/generator/slot-reminder-poller"
import { CURRENT_GENERATOR_ID } from "@/lib/constants"

export function GeneratorShell({ children }: { children: React.ReactNode }) {
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
                Coco
              </p>
              <p className="text-[10px] font-medium text-muted-foreground">
                Waste that works
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground shadow-sm">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Vendor network
          </span>
          <NotificationBell userId={CURRENT_GENERATOR_ID} />
        </div>
      </header>

      <main className="flex-1 px-4 pt-4 pb-28">{children}</main>

      <BottomNav />

      <SlotReminderPoller />
    </div>
  )
}