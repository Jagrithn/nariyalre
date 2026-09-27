"use client"

import { useState } from "react"
import { Check, Loader2, Save } from "lucide-react"

import { updateProfileUpiAction } from "@/actions/payments"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useCollectorStore } from "@/lib/stores/collector"

const UPI_PATTERN = /^[\w.\-]{2,}@[a-zA-Z]{2,}$/

export function UpiEditor({ userId }: { userId: string }) {
  const upiId = useCollectorStore((s) => s.upiId)
  const setUpiId = useCollectorStore((s) => s.setUpiId)
  const { toast } = useToast()

  const [draft, setDraft] = useState(upiId)
  const [saving, setSaving] = useState(false)
  const dirty = draft.trim() !== upiId
  const valid = UPI_PATTERN.test(draft.trim())

  const save = () => {
    if (!valid) {
      toast({
        title: "Invalid UPI id",
        description: "Use the format name@bank (e.g. ravi@okhdfcbank).",
      })
      return
    }
    setSaving(true)
    const value = draft.trim()
    void updateProfileUpiAction({ userId, upiId: value })
      .catch(() => undefined)
      .then(() => {
        setUpiId(value)
        setSaving(false)
        toast({
          title: "UPI id updated",
          description: "Future payouts will use this id.",
        })
      })
  }

  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm">
      <p className="text-sm font-semibold">Payout UPI id</p>
      <p className="mb-3 text-xs text-muted-foreground">
        Withdrawals are sent to this UPI handle.
      </p>
      <div className="flex items-center gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="name@bank"
          className="font-medium"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={save}
          disabled={saving || !dirty || !valid}
          aria-label="Save UPI id"
        >
          {saving ? (
            <Loader2 className="animate-spin" />
          ) : valid && dirty ? (
            <Check className="size-4" />
          ) : (
            <Save className="size-4" />
          )}
        </Button>
      </div>
      <p className="mt-1.5 text-[11px] text-muted-foreground">
        Sandbox mode — no real transfer is made.
      </p>
    </div>
  )
}