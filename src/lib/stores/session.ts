"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import type { UserRole } from "@/lib/types"

export interface SessionUser {
  id: string
  role: UserRole
  fullName: string
  phone: string
}

interface SessionState {
  user: SessionUser | null
  setUser: (user: SessionUser) => void
  clear: () => void
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clear: () => set({ user: null }),
    }),
    {
      name: "coco-session",
      storage: createJSONStorage(() => localStorage),
    }
  )
)