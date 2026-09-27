import type { Metadata } from "next"

import { GeneratorShell } from "@/components/features/generator/generator-shell"

export const metadata: Metadata = {
  title: "Generator",
  description:
    "One-tap pickup requests, GPS auto-tagging and live impact for vendors and temples.",
}

export default function GeneratorLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <GeneratorShell>{children}</GeneratorShell>
}