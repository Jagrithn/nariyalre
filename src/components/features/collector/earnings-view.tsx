"use client"

import Image from "next/image"
import { useState } from "react"
import { Banknote, Loader2, Wallet } from "lucide-react"

import { UpiEditor } from "@/components/features/collector/upi-editor"
import {
  requestPayoutAction,
  settlePayoutAction,
} from "@/actions/payments"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useCollectorPickups } from "@/hooks/use-collector"
import { formatCurrency, formatDateTime } from "@/lib/formats"
import { CURRENT_COLLECTOR_ID, PAYOUT_MIN, RATE_PER_KG } from "@/lib/constants"
import { IMAGES } from "@/lib/imagery"
import { useCollectorStore } from "@/lib/stores/collector"
import { pickupWeight } from "@/lib/impact"
import { notify } from "@/lib/notify"
import { cn } from "@/lib/utils"

const UPI_PATTERN = /^[\w.\-]{2,}@[a-zA-Z]{2,}$/

export function EarningsView() {
  const { data: serverPickups = [] } = useCollectorPickups()
  const completedJobs = useCollectorStore((s) => s.completedJobs)
  const payouts = useCollectorStore((s) => s.payouts)
  const upiId = useCollectorStore((s) => s.upiId)
  const beginPayout = useCollectorStore((s) => s.beginPayout)
  const settlePayout = useCollectorStore((s) => s.settlePayout)
  const rejectPayout = useCollectorStore((s) => s.rejectPayout)
  const { toast } = useToast()
  const [paying, setPaying] = useState(false)

  const serverEarned = Math.floor(
    serverPickups
      .filter((p) => ["completed", "weighed_in"].includes(p.status))
      .reduce((sum, p) => sum + pickupWeight(p) * RATE_PER_KG, 0)
  )
  const jobEarned = completedJobs.reduce((sum, j) => sum + j.earned, 0)
  const totalEarned = serverEarned + jobEarned

  const settledSum = payouts
    .filter((p) => (p.status ?? "settled") === "settled")
    .reduce((sum, p) => sum + p.amount, 0)
  const pendingSum = payouts
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0)
  const balance = Math.max(0, totalEarned - settledSum - pendingSum)

  const trips =
    serverPickups.filter((p) => ["completed", "weighed_in"].includes(p.status))
      .length + completedJobs.length

  const withdraw = async () => {
    if (balance < PAYOUT_MIN) {
      toast({
        title: "Minimum withdrawal",
        description: `${formatCurrency(PAYOUT_MIN)} is the minimum payout amount.`,
      })
      return
    }
    if (!UPI_PATTERN.test(upiId)) {
      toast({
        title: "Add a UPI id first",
        description: "Set your payout UPI handle below before withdrawing.",
      })
      return
    }
    setPaying(true)
    const id = beginPayout(balance, upiId)
    const res = await requestPayoutAction({
      userId: CURRENT_COLLECTOR_ID,
      amount: balance,
      upiId,
    })
    if (!res.ok) {
      rejectPayout(id)
      setPaying(false)
      toast({
        title: "Payout failed",
        description: res.error ?? "Try again in a moment.",
      })
      return
    }
    const reference = res.reference
    setTimeout(() => {
      settlePayout(id, reference)
      notify(
        CURRENT_COLLECTOR_ID,
        "Payout credited",
        `${formatCurrency(balance)} sent to ${upiId}.`,
        "payment"
      )
      if (res.transactionId) {
        void settlePayoutAction({ transactionId: res.transactionId }).catch(
          () => undefined
        )
      }
      setPaying(false)
      toast({
        title: "Payout sent to UPI",
        description: `${formatCurrency(balance)} transferred to ${upiId}.`,
      })
    }, 1300)
  }

  const earnings =
    serverPickups
      .filter((p) => ["completed", "weighed_in"].includes(p.status))
      .map((p) => ({
        key: p.id,
        label: p.address_text ?? "Pickup",
        amount: Math.floor(pickupWeight(p) * RATE_PER_KG),
      }))
      .concat(
        completedJobs.map((j) => ({
          key: j.pickupId,
          label: j.addressText ?? "Pickup",
          amount: j.earned,
        }))
      )

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Earnings</h1>
        <p className="text-xs text-muted-foreground">
          Paid per kg delivered · ₹{RATE_PER_KG}/kg simulation.
        </p>
      </div>

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white shadow-lg">
        <Image
          src={IMAGES.collectorHero}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-950/85 via-emerald-900/70 to-teal-900/75" />
        <div className="pointer-events-none absolute -top-10 right-0 size-36 rounded-full bg-white/10 blur-2xl" />
        <p className="flex items-center gap-1.5 text-xs font-medium text-emerald-100 uppercase">
          <Wallet className="size-3.5" />
          Available balance
        </p>
        <p className="mt-2 text-4xl font-extrabold tracking-tight">
          {formatCurrency(balance)}
        </p>
        <div className="mt-4 flex items-center justify-between rounded-2xl bg-white/15 p-3 text-sm backdrop-blur-sm">
          <span className="text-emerald-50/90">Lifetime earned</span>
          <span className="font-bold">{formatCurrency(totalEarned)}</span>
          <span className="text-emerald-50/90">Trips</span>
          <span className="font-bold">{trips}</span>
        </div>
        <Button
          onClick={withdraw}
          disabled={paying || balance < PAYOUT_MIN}
          className="mt-4 w-full bg-white text-emerald-700 hover:bg-white/90"
        >
          {paying ? <Loader2 className="animate-spin" /> : <Banknote />}
          {paying
            ? "Processing…"
            : `Withdraw ${formatCurrency(balance)}`}
        </Button>
        {balance > 0 && balance < PAYOUT_MIN && (
          <p className="mt-2 text-center text-[11px] text-emerald-100/80">
            Minimum withdrawal is {formatCurrency(PAYOUT_MIN)}.
          </p>
        )}
      </section>

      <UpiEditor userId={CURRENT_COLLECTOR_ID} />

      <section className="rounded-2xl border bg-card p-4 shadow-sm">
        <p className="mb-2 text-sm font-semibold">Payout history</p>
        {payouts.length === 0 ? (
          <p className="py-4 text-center text-xs text-muted-foreground">
            No payouts yet.
          </p>
        ) : (
          <div className="space-y-2">
            {payouts.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2.5 text-sm"
              >
                <div>
                  <p className="font-semibold">{formatCurrency(p.amount)}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {p.reference ?? "Processing"} · {formatDateTime(p.paidAt)}
                  </p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                    (p.status ?? "settled") === "settled"
                      ? "bg-emerald-600/10 text-emerald-700"
                      : (p.status ?? "settled") === "rejected"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-amber-600/10 text-amber-700"
                  )}
                >
                  {(p.status ?? "settled") === "settled"
                    ? "Paid"
                    : (p.status ?? "settled") === "rejected"
                      ? "Rejected"
                      : "Pending"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border bg-card p-4 shadow-sm">
        <p className="mb-2 text-sm font-semibold">Earnings breakdown</p>
        {earnings.length === 0 ? (
          <p className="py-4 text-center text-xs text-muted-foreground">
            Complete a pickup to start earning.
          </p>
        ) : (
          <div className="space-y-1.5">
            {earnings.map((e) => (
              <div
                key={e.key}
                className="flex items-center justify-between gap-2 rounded-xl bg-muted/40 px-3 py-2 text-xs"
              >
                <p className="truncate text-muted-foreground">{e.label}</p>
                <p className="shrink-0 font-bold text-emerald-700 dark:text-emerald-300">
                  {formatCurrency(e.amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}