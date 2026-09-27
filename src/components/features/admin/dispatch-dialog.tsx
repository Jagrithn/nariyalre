"use client"

import { useState } from "react"
import { Loader2, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { logDispatchAction } from "@/actions/mutations"
import { mockDistributionLogs } from "@/lib/mockData"
import { useAdminStore } from "@/lib/stores/admin"
import type { DistributionTier, MaterialType } from "@/lib/types"

const TIER_MATERIALS: Record<DistributionTier, MaterialType[]> = {
  tier1_b2b: ["fiber"],
  tier2_shg: ["shells", "fiber"],
  tier3_inhouse: ["cocopeat", "compost", "pith"],
}

const SUGGESTIONS = [
  ...new Set(mockDistributionLogs.map((l) => l.destination_name)),
]

export function DispatchDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const addDispatch = useAdminStore((s) => s.addDispatch)
  const { toast } = useToast()

  const [tier, setTier] = useState<DistributionTier>("tier1_b2b")
  const [material, setMaterial] = useState<MaterialType>("fiber")
  const [qty, setQty] = useState("")
  const [dest, setDest] = useState("")
  const [saving, setSaving] = useState(false)

  const selectTier = (value: string) => {
    const t = value as DistributionTier
    setTier(t)
    setMaterial(TIER_MATERIALS[t][0])
  }

  const submit = () => {
    const quantity = Number(qty)
    if (!dest.trim() || quantity <= 0) {
      toast({
        title: "Missing details",
        description: "Enter a destination and a positive quantity.",
      })
      return
    }
    setSaving(true)
    setTimeout(() => {
      addDispatch({
        id: `dist_${Date.now()}`,
        tier,
        material_type: material,
        quantity_kg: quantity,
        destination_name: dest.trim(),
        dispatched_at: new Date().toISOString(),
      })
      void logDispatchAction({
        tier,
        material_type: material,
        quantity_kg: quantity,
        destination_name: dest.trim(),
        dispatched_at: new Date().toISOString(),
      }).catch(() => {})
      setSaving(false)
      setQty("")
      setDest("")
      onOpenChange(false)
      toast({
        title: "Dispatch logged",
        description: `${quantity} kg routed for ${tier}.`,
      })
    }, 500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New dispatch</DialogTitle>
          <DialogDescription>
            Route processed material to a commercial off-taker.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Tier</Label>
              <Select value={tier} onValueChange={selectTier}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tier1_b2b">Tier 1 · B2B</SelectItem>
                  <SelectItem value="tier2_shg">Tier 2 · SHG</SelectItem>
                  <SelectItem value="tier3_inhouse">Tier 3 · In-house</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Material</Label>
              <Select
                value={material}
                onValueChange={(v) => setMaterial(v as MaterialType)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIER_MATERIALS[tier].map((m) => (
                    <SelectItem key={m} value={m}>
                      {m.charAt(0).toUpperCase() + m.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="qty">Quantity (kg)</Label>
            <Input
              id="qty"
              type="number"
              min={1}
              placeholder="e.g. 200"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="dest">Destination</Label>
            <Input
              id="dest"
              list="destinations"
              placeholder="e.g. Kalpana Women's SHG"
              value={dest}
              onChange={(e) => setDest(e.target.value)}
            />
            <datalist id="destinations">
              {SUGGESTIONS.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={saving}>
            {saving ? <Loader2 className="animate-spin" /> : <Send />}
            {saving ? "Logging…" : "Dispatch"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}