import type { Metadata } from "next"

import { AdminShell } from "@/components/features/admin/admin-shell"

export const metadata: Metadata = {
  title: "Coco Operations",
}

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AdminShell>{children}</AdminShell>
}