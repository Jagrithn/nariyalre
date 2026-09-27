"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { House, Leaf, ScrollText } from "lucide-react"

import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  {
    href: "/generator",
    label: "Home",
    icon: House,
    isActive: (path: string) => path === "/generator",
  },
  {
    href: "/generator/history",
    label: "History",
    icon: ScrollText,
    isActive: (path: string) => path.startsWith("/generator/history"),
  },
  {
    href: "/generator/impact",
    label: "Impact",
    icon: Leaf,
    isActive: (path: string) => path.startsWith("/generator/impact"),
  },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-md">
      <div className="mx-4 mb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center justify-around rounded-2xl border bg-card/95 p-1.5 shadow-lg backdrop-blur">
        {NAV_ITEMS.map((item) => {
          const active = item.isActive(pathname)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-[11px] font-medium transition-all",
                active
                  ? "bg-emerald-600/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon
                className={cn("size-5", active && "text-emerald-600 dark:text-emerald-300")}
              />
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}