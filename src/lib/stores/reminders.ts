import { create } from "zustand"
import { persist } from "zustand/middleware"

interface RemindersState {
  sentIds: string[]
  hasSent: (id: string) => boolean
  markSent: (id: string) => void
}

export const useRemindersStore = create<RemindersState>()(
  persist(
    (set, get) => ({
      sentIds: [],
      hasSent: (id) => get().sentIds.includes(id),
      markSent: (id) =>
        set((state) =>
          state.sentIds.includes(id)
            ? state
            : { sentIds: [...state.sentIds, id] }
        ),
    }),
    { name: "coco-slot-reminders-sent" }
  )
)