"use client"

import { useEffect } from "react"

import { useGeneratorPickups } from "@/hooks/use-pickups"
import { CURRENT_GENERATOR_ID } from "@/lib/constants"
import { notify } from "@/lib/notify"
import { slotReminder } from "@/lib/slots"
import { useGeneratorStore } from "@/lib/stores/generator"
import { useRemindersStore } from "@/lib/stores/reminders"

export function SlotReminderPoller() {
  const { data: serverPickups = [] } = useGeneratorPickups()
  const activePickups = useGeneratorStore((s) => s.activePickups)
  const hasSent = useRemindersStore((s) => s.hasSent)
  const markSent = useRemindersStore((s) => s.markSent)

  useEffect(() => {
    const check = () => {
      for (const pickup of [...activePickups, ...serverPickups]) {
        const reminder = slotReminder(pickup)
        if (!reminder || hasSent(reminder.pickupId)) continue
        markSent(reminder.pickupId)
        notify(
          CURRENT_GENERATOR_ID,
          "Pickup window opens soon",
          `Your ${reminder.requestedKg} kg pickup is scheduled for ${reminder.slotLabel} (${reminder.slotHint}). Keep the waste ready.`,
          "pickup_status"
        )
      }
    }
    check()
    const id = setInterval(check, 60000)
    return () => clearInterval(id)
  }, [serverPickups, activePickups, hasSent, markSent])

  return null
}