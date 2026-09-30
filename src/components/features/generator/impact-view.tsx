"use client"

import Image from "next/image"
import { CloudFog, Nut, Recycle, TreePalm, Trophy, Zap } from "lucide-react"

import { useGeneratorPickups } from "@/hooks/use-pickups"
import { formatKg } from "@/lib/formats"
import { computeImpactStats } from "@/lib/impact"
import { IMAGES } from "@/lib/imagery"
import { useGeneratorStore } from "@/lib/stores/generator"
import { cn } from "@/lib/utils"

const BADGES = [
  {
    label: "First drop",
    icon: Recycle,
    unlockedAt: 1,
  },
  {
    label: "10x helper",
    icon: Zap,
    unlockedAt: 10,
  },
  {
    label: "Green thumb",
    icon: TreePalm,
    unlockedAt: null,
    kg: 500,
  },
  {
    label: "Half-tonner",
    icon: Trophy,
    unlockedAt: null,
    kg: 1000,
  },
]

function weeklyMaxMax(weekly: { kg: number }[]) {
  return Math.max(1, ...weekly.map((w) => w.kg))
}

export function ImpactView() {
  const { data: serverPickups = [] } = useGeneratorPickups()
  const activePickups = useGeneratorStore((s) => s.activePickups)

  const allPickups = [...activePickups, ...serverPickups]
  const stats = computeImpactStats(allPickups)
  const completedCount = allPickups.filter((p) =>
    ["completed", "weighed_in"].includes(p.status)
  ).length
  const maxKg = weeklyMaxMax(stats.weekly)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Your impact</h1>
        <p className="text-xs text-muted-foreground">
          Every shell stays out of the landfill.
        </p>
      </div>

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-600 to-teal-700 p-6 text-white shadow-lg">
        <Image
          src={IMAGES.generatorHero}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-950/85 via-emerald-900/70 to-teal-900/75" />
        <div className="pointer-events-none absolute -top-12 -right-8 size-44 rounded-full bg-white/10 blur-2xl" />
        <p className="text-xs font-medium tracking-wide text-emerald-100 uppercase">
          Waste kept from landfill
        </p>
        <p className="mt-2 text-4xl font-extrabold tracking-tight">
          {formatKg(stats.totalKg)}
          <span className="text-lg font-bold text-emerald-100/90"> diverted</span>
        </p>
        <p className="mt-1 text-sm text-emerald-50/85">
          {`That's ${stats.todayKg} kg today from your side of the city`}
        </p>

        <div className="mt-5 rounded-2xl bg-white/15 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="inline-flex items-center gap-1.5">
              <Trophy className="size-3.5 text-amber-300" />
              Level {stats.level} sapling
            </span>
            <span className="text-emerald-50/85">
              {stats.nextLevelKg
                ? `${formatKg(stats.nextLevelKg)} to level ${stats.level + 1}`
                : "Max level reached"}
            </span>
          </div>
          <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-white/25">
            <div
              className="h-full rounded-full bg-lime-300 transition-all duration-700"
              style={{ width: `${stats.levelProgress}%` }}
            />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-3 gap-2.5">
        {[
          { label: "CO₂ saved", value: formatKg(stats.totalCo2Kg), icon: CloudFog },
          {
            label: "Shells", value: stats.totalShells.toLocaleString("en-IN"),
            icon: Nut,
          },
          { label: "Pickups", value: String(completedCount), icon: Recycle },
        ].map((s) => (
          <div
            key={s.label}
            className="flex flex-col items-center gap-1 rounded-2xl border bg-card p-3 text-center shadow-sm"
          >
            <s.icon className="size-4.5 text-emerald-600 dark:text-emerald-300" />
            <p className="text-base font-bold leading-none">{s.value}</p>
            <p className="text-[10px] font-medium text-muted-foreground">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border bg-card p-4 shadow-sm">
        <p className="text-sm font-semibold">Last 7 days</p>
        <div className="mt-4 flex h-28 items-end gap-2">
          {stats.weekly.map((w) => (
            <div key={w.label} className="flex flex-1 flex-col items-center gap-1.5">
              <span className="text-[10px] font-medium text-muted-foreground">
                {w.kg > 0 ? w.kg : ""}
              </span>
              <div
                className={cn(
                  "w-full rounded-md transition-all duration-500",
                  w.kg > 0
                    ? "bg-gradient-to-t from-emerald-700 to-emerald-500"
                    : "bg-muted"
                )}
                style={{ height: `${Math.max(4, (w.kg / maxKg) * 78)}px` }}
              />
              <span className="text-[10px] text-muted-foreground">{w.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <p className="mb-2.5 px-1 text-sm font-semibold">Achievements</p>
        <div className="grid grid-cols-4 gap-2.5">
          {BADGES.map((b) => {
            const unlocked =
              b.kg != null ? stats.totalKg >= b.kg : allPickups.length >= b.unlockedAt
            return (
              <div
                key={b.label}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-center",
                  unlocked
                    ? "border-emerald-600/30 bg-emerald-600/5"
                    : "border-dashed opacity-50"
                )}
              >
                <b.icon
                  className={cn(
                    "size-5",
                    unlocked
                      ? "text-emerald-600 dark:text-emerald-300"
                      : "text-muted-foreground"
                  )}
                />
                <p className="text-[10px] font-medium text-muted-foreground">
                  {b.label}
                </p>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}