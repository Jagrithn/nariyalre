import type { Metadata, Viewport } from "next"
import "@fontsource-variable/inter"
import "./globals.css"

import { QueryProvider } from "@/components/providers/query-provider"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: {
    default: "Coco — Circular Coconut Plus",
    template: "%s · Coco",
  },
  description:
    "Multi-tier circular bio-resource logistics for urban coconut waste: from vendors and temples, through the depot, to fiber, shells, cocopeat and compost.",
  manifest: "/manifest.webmanifest",
  applicationName: "Coco",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Coco",
  },
}

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  )
}