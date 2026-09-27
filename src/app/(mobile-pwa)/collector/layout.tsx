import type { Metadata } from "next"

import { CollectorShell } from "@/components/features/collector/collector-shell"

export const metadata: Metadata = {
  title: "Collector",
  description:
    "Map of pending pickups, optimal routing and UPI earnings for drivers.",
}

export default function CollectorLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <CollectorShell>{children}</CollectorShell>
}