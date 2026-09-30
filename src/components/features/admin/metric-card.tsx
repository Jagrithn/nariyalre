import Image from "next/image"
import type { LucideIcon } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type MetricCardProps = {
  icon: LucideIcon
  accent: string
  title: string
  value: string
  sub: string
  trend?: string
  image?: string
}

export function MetricCard({
  icon: Icon,
  accent,
  title,
  value,
  sub,
  trend,
  image,
}: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        <span className={cn("relative inline-flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-xl", accent)}>
          {image ? (
            <Image src={image} alt="" fill sizes="36px" className="object-cover" />
          ) : (
            <Icon className="size-4.5" />
          )}
        </span>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-3xl font-extrabold tracking-tight">{value}</p>
        <div className="mt-2 flex items-center gap-2">
          <p className="text-xs text-muted-foreground">{sub}</p>
          {trend && (
            <span className="rounded-full bg-emerald-600/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
              {trend}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}