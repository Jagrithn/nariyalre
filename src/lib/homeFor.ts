import type { UserRole } from "@/lib/types"

export const HOME_FOR: Record<UserRole, string> = {
  generator: "/generator",
  collector: "/collector",
  depot: "/admin/depot",
  admin: "/admin",
  consumer: "/consumer",
}