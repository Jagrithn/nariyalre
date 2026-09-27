"use client"

import { emitNotificationAction } from "@/actions/notifications"
import { useNotificationsStore } from "@/lib/stores/notifications"
import type { NotificationType } from "@/lib/types"

export function notify(
  userId: string,
  title: string,
  body: string,
  type: NotificationType = "system"
): void {
  void emitNotificationAction({ userId, title, body, type })
    .then((res) => {
      if (res.ok && res.notification) {
        useNotificationsStore.getState().push(res.notification)
      }
    })
    .catch(() => undefined)
}