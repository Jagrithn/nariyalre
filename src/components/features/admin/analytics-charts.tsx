"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import type { YieldBreakdown } from "@/lib/analytics"

function countTooltip(value: unknown) {
  return [`${value} kg`, ""]
}

export function ThroughputChart({ data }: { data: { date: string; kg: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="emeraldFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#059669" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#059669" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.12} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          width={64}
        />
        <Tooltip formatter={countTooltip} labelStyle={{ fontWeight: 600 }} />
        <Area
          type="monotone"
          dataKey="kg"
          stroke="#059669"
          strokeWidth={2.5}
          fill="url(#emeraldFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

const YIELD_COLORS = { fiber: "#059669", shell: "#84cc16", pith: "#d97706" }

export function YieldDonut({ yields }: { yields: YieldBreakdown }) {
  const data = [
    { name: "Fibre", value: yields.fiberKg, color: YIELD_COLORS.fiber },
    { name: "Shells", value: yields.shellKg, color: YIELD_COLORS.shell },
    { name: "Pith", value: yields.pithKg, color: YIELD_COLORS.pith },
  ]

  return (
    <div className="flex items-center gap-4">
      <div className="h-[220px] min-w-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={58}
              outerRadius={86}
              paddingAngle={4}
              strokeWidth={0}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={countTooltip} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-3">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-2.5">
            <span className="size-2.5 rounded-full" style={{ background: d.color }} />
            <div>
              <p className="text-xs font-semibold">{d.name}</p>
              <p className="text-[11px] text-muted-foreground">
                {d.value.toLocaleString("en-IN")} kg
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function TierBarChart({ data }: { data: { tier: string; kg: number; color: string }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.12} />
        <XAxis dataKey="tier" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={64} />
        <Tooltip formatter={countTooltip} cursor={{ fill: "currentColor", opacity: 0.06 }} />
        <Bar dataKey="kg" radius={[8, 8, 0, 0]} maxBarSize={48}>
          {data.map((entry) => (
            <Cell key={entry.tier} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}