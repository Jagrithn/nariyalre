"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ExternalLink,
  Factory,
  LayoutDashboard,
  LogOut,
  Scale,
  TreePalm,
} from "lucide-react"

import { signOutAction } from "@/actions/auth"
import { useSessionStore } from "@/lib/stores/session"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, desc: "Operations analytics" },
  { href: "/admin/depot", label: "Depot Weigh-In", icon: Scale, desc: "Weighbridge & yields" },
  { href: "/admin/distribution", label: "Distribution", icon: Factory, desc: "Tri-tier off-take" },
]

const TITLES: Record<string, string> = {
  "/admin": "Operations overview",
  "/admin/depot": "Depot weigh-in",
  "/admin/distribution": "Tri-tier distribution",
}

function isActive(path: string, href: string): boolean {
  return href === "/admin" ? path === "/admin" : path.startsWith(href)
}

const ROLE_LABEL: Record<string, string> = {
  generator: "Generator",
  collector: "Collector",
  depot: "Depot operator",
  admin: "Admin · Ops head",
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const user = useSessionStore((s) => s.user)
  const clear = useSessionStore((s) => s.clear)

  return (
    <div className="flex min-h-dvh bg-muted/20">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r bg-card md:flex">
        <div className="flex items-center gap-2.5 border-b px-5 py-4">
          <span className="inline-flex size-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
            <TreePalm className="size-5" />
          </span>
          <div className="leading-tight">
            <p className="font-bold tracking-tight">
              Coco
            </p>
            <p className="text-[10px] font-medium text-muted-foreground">
              Central distribution hub
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5 px-3 py-4">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-start gap-3 rounded-xl border px-3 py-2.5 transition-all",
                  active
                    ? "border-emerald-600/30 bg-emerald-600/10"
                    : "border-transparent hover:bg-muted"
                )}
              >
                <item.icon
                  className={cn(
                    "mt-0.5 size-4.5 shrink-0",
                    active
                      ? "text-emerald-600 dark:text-emerald-300"
                      : "text-muted-foreground"
                  )}
                />
                <span className="min-w-0">
                  <span
                    className={cn(
                      "block text-sm font-semibold",
                      active && "text-emerald-700 dark:text-emerald-300"
                    )}
                  >
                    {item.label}
                  </span>
                  <span className="block text-[11px] text-muted-foreground">
                    {item.desc}
                  </span>
                </span>
              </Link>
            )
          })}
        </nav>

        <div className="border-t px-4 py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {user?.fullName ?? "Ananya Iyer"}
              </p>
              <p className="truncate text-[11px] text-muted-foreground">
                {user ? ROLE_LABEL[user.role] : "Admin · Ops head"}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground"
              >
                Landing
                <ExternalLink className="size-3" />
              </Link>
              <button
                type="button"
                onClick={() => {
                  void signOutAction().then(clear)
                }}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-destructive"
                aria-label="Sign out"
              >
                <LogOut className="size-3" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col md:pl-64">
        <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
          <div className="flex items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                {TITLES[pathname] ?? "Coco"}
              </h1>
              <p className="text-[11px] text-muted-foreground">
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>
            </div>
            <div className="flex items-center gap-2 md:hidden">
              {NAV.map((item) => {
                const active = isActive(pathname, item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-medium",
                      active
                        ? "bg-emerald-600 text-white"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
            <span className="hidden items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm md:inline-flex">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              All systems live
            </span>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}