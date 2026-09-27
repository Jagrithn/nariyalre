import { create } from "zustand"
import { persist } from "zustand/middleware"

import type { AppNotification } from "@/lib/types"

interface NotificationsState {
  notifications: AppNotification[]
  push: (notification: AppNotification) => void
  replaceAll: (notifications: AppNotification[]) => void
  markRead: (id: string) => void
  markAllRead: () => void
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      notifications: [],
      push: (notification) =>
        set((state) => {
          if (state.notifications.some((n) => n.id === notification.id)) {
            return state
          }
          return { notifications: [notification, ...state.notifications] }
        }),
      replaceAll: (notifications) => {
        const merged = new Map<string, AppNotification>()
        for (const n of notifications) merged.set(n.id, n)
        for (const n of get().notifications) {
          if (!merged.has(n.id)) merged.set(n.id, n)
        }
        set({
          notifications: [...merged.values()].sort(
            (a, b) =>
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          ),
        })
      },
      markRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      markAllRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),
    }),
    { name: "coco-notifications" }
  )
)