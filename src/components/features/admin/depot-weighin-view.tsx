"use client"

import { useMemo, useState } from "react"
import { Loader2, Save, SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { logDepotBatchAction } from "@/actions/mutations"
import { mockDepotInventory } from "@/lib/mockData"
import { formatDateTime } from "@/lib/formats"
import { useAdminStore } from "@/lib/stores/admin"
import { cn } from "@/lib/utils"
import type { DepotBatch } from "@/lib/types"

const YIELD = { fiber: 0.26, shell: 0.43, pith: 0.24 }

export function DepotWeighInView() {
  const storeBatches = useAdminStore((s) => s.batches)
  const addBatch = useAdminStore((s) => s.addBatch)
  const { toast } = useToast()

  const [inputKg, setInputKg] = useState("")
  const [fiberKg, setFiberKg] = useState("")
  const [shellKg, setShellKg] = useState("")
  const [pithKg, setPithKg] = useState("")
  const [saving, setSaving] = useState(false)

  const input = Number(inputKg) || 0
  const outputs = useMemo(() => {
    const f = Number(fiberKg) || 0
    const s = Number(shellKg) || 0
    const p = Number(pithKg) || 0
    return { total: f + s + p, fiber: f, shell: s, pith: p }
  }, [fiberKg, shellKg, pithKg])

  const recovery =
    input > 0 ? Math.min(100, Math.round((outputs.total / input) * 100)) : 0
  const overFill = input > 0 && outputs.total > input

  const nextBatchId = `B-${2605 + storeBatches.length}`

  const autoFill = () => {
    if (!input) return
    setFiberKg(String(Math.round(input * YIELD.fiber)))
    setShellKg(String(Math.round(input * YIELD.shell)))
    setPithKg(String(Math.round(input * YIELD.pith)))
    toast({
      title: "Yield auto-filled",
      description: "Using standard 26% fibre · 43% shell · 24% pith recovery.",
    })
  }

  const save = () => {
    if (input <= 0 || outputs.total <= 0 || overFill) {
      toast({
        title: overFill ? "Output exceeds input" : "Enter the batch details",
        description: overFill
          ? "Processed outputs cannot exceed raw input."
          : "Raw weight and at least one yield are required.",
      })
      return
    }
    setSaving(true)
    const batch: DepotBatch = {
      id: `inv_${Date.now()}`,
      batch_id: nextBatchId,
      input_raw_kg: input,
      output_fiber_kg: outputs.fiber,
      output_shell_kg: outputs.shell,
      output_pith_kg: outputs.pith,
      processed_at: new Date().toISOString(),
    }
    setTimeout(() => {
      addBatch(batch)
      void logDepotBatchAction({
        batch_id: nextBatchId,
        input_raw_kg: input,
        output_fiber_kg: outputs.fiber,
        output_shell_kg: outputs.shell,
        output_pith_kg: outputs.pith,
        processed_at: new Date().toISOString(),
      }).catch(() => {})
      setSaving(false)
      setInputKg("")
      setFiberKg("")
      setShellKg("")
      setPithKg("")
      toast({
        title: "Batch recorded",
        description: `${nextBatchId} logged at ${recovery}% recovery.`,
      })
    }, 500)
  }

  const allBatches = [...storeBatches, ...mockDepotInventory]

  return (
    <div className="grid gap-5 xl:grid-cols-[380px_1fr]">
      <div className="rounded-2xl border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Weighbridge entry</p>
            <p className="text-xs text-muted-foreground">
              Incoming raw weight vs. processed yields
            </p>
          </div>
          <span className="rounded-full bg-emerald-600/10 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
            {nextBatchId}
          </span>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="raw">Input raw weight (kg)</Label>
            <Input
              id="raw"
              type="number"
              min={0}
              placeholder="e.g. 1240"
              value={inputKg}
              onChange={(e) => setInputKg(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">
              Processed yields (kg)
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={autoFill}
              disabled={!input}
              className="h-7 gap-1 text-xs"
            >
              <SlidersHorizontal className="size-3" />
              Auto-fill standard
            </Button>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="fiber">Fibre output</Label>
            <Input
              id="fiber"
              type="number"
              min={0}
              value={fiberKg}
              onChange={(e) => setFiberKg(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="shell">Shell output</Label>
            <Input
              id="shell"
              type="number"
              min={0}
              value={shellKg}
              onChange={(e) => setShellKg(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pith">Pith output</Label>
            <Input
              id="pith"
              type="number"
              min={0}
              value={pithKg}
              onChange={(e) => setPithKg(e.target.value)}
            />
          </div>
        </div>

        {input > 0 && (
          <div className="mt-5 rounded-xl bg-muted/50 p-3">
            <div className="flex items-baseline justify-between">
              <p className="text-xs font-medium text-muted-foreground">
                Recovery
              </p>
              <p
                className={cn(
                  "text-lg font-bold",
                  overFill ? "text-destructive" : "text-emerald-700 dark:text-emerald-300"
                )}
              >
                {overFill ? "Over capacity" : `${recovery}%`}
              </p>
            </div>
            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  overFill ? "bg-destructive" : "bg-gradient-to-r from-emerald-600 to-lime-500"
                )}
                style={{ width: `${Math.min(100, recovery)}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              {input.toLocaleString("en-IN")} kg in →{" "}
              {outputs.total.toLocaleString("en-IN")} kg product
              {!overFill && input > 0
                ? ` · ${(input - outputs.total).toLocaleString("en-IN")} kg moisture`
                : ""}
            </p>
          </div>
        )}

        <Button onClick={save} disabled={saving} className="mt-5 w-full" size="lg">
          {saving ? <Loader2 className="animate-spin" /> : <Save />}
          {saving ? "Recording…" : "Log batch"}
        </Button>
      </div>

      <div className="rounded-2xl border bg-card shadow-sm">
        <div className="border-b px-5 py-4">
          <p className="text-sm font-semibold">Recent batches</p>
          <p className="text-xs text-muted-foreground">
            {allBatches.length} weighbridge entries
          </p>
        </div>
        <div className="divide-y">
          {allBatches.map((b) => {
            const totalOut = b.output_fiber_kg + b.output_shell_kg + b.output_pith_kg
            const pct = b.input_raw_kg > 0 ? (totalOut / b.input_raw_kg) * 100 : 0
            const segments = [
              { w: b.output_fiber_kg, color: "bg-emerald-600" },
              { w: b.output_shell_kg, color: "bg-lime-500" },
              { w: b.output_pith_kg, color: "bg-amber-500" },
            ]
            return (
              <div key={b.id} className="px-5 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold">{b.batch_id}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {formatDateTime(b.processed_at)}
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-600/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                    {Math.round(pct)}% recovered
                  </span>
                </div>
                <div className="mt-3">
                  <div className="flex h-2.5 w-full overflow-hidden rounded-full">
                    {segments.map((s, i) =>
                      s.w > 0 ? (
                        <div
                          key={i}
                          className={s.color}
                          style={{ width: `${(s.w / b.input_raw_kg) * 100}%` }}
                        />
                      ) : null
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                    <span>In {b.input_raw_kg.toLocaleString("en-IN")} kg</span>
                    <span className="text-emerald-600">F {b.output_fiber_kg} kg</span>
                    <span className="text-lime-600">S {b.output_shell_kg} kg</span>
                    <span className="text-amber-600">P {b.output_pith_kg} kg</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}