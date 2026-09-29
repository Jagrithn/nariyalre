import type { Metadata } from "next"

import { ConsumerShell } from "@/components/features/consumer/consumer-shell"

export const metadata: Metadata = {
  title: "Consumers",
  description:
    "Shop coconut-made products and find nearby vending machines to drop waste and earn.",
}

export default function ConsumerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <ConsumerShell>{children}</ConsumerShell>
}