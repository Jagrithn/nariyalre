"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, Phone, TreePalm, UserRound, Wallet } from "lucide-react"

import { createAccountAction, verifyOtpAction } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { HOME_FOR } from "@/lib/homeFor"
import { useSessionStore } from "@/lib/stores/session"
import { cn } from "@/lib/utils"
import type { OtpUser } from "@/actions/auth"
import type { UserRole } from "@/lib/types"

const ROLES: { role: UserRole; icon: typeof TreePalm; label: string; hint: string }[] = [
  {
    role: "generator",
    icon: TreePalm,
    label: "Generator",
    hint: "I have coconut waste to hand over",
  },
  {
    role: "collector",
    icon: Wallet,
    label: "Collector",
    hint: "I pick up waste & earn per kg",
  },
  {
    role: "consumer",
    icon: UserRound,
    label: "Consumer",
    hint: "I buy products & drop waste",
  },
]

export function CreateAccountForm({
  onBack,
}: {
  onBack: () => void
}) {
  const router = useRouter()
  const { toast } = useToast()
  const setUser = useSessionStore((s) => s.setUser)

  const [step, setStep] = useState<"details" | "otp">("details")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [role, setRole] = useState<UserRole>("consumer")
  const [code, setCode] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pendingUser, setPendingUser] = useState<OtpUser | null>(null)

  const create = async () => {
    if (!name.trim() || phone.trim().length < 10) {
      setError("Add your name and a valid mobile number.")
      return
    }
    setBusy(true)
    setError(null)
    const res = await createAccountAction({ name, phone, role })
    setBusy(false)
    if (!res.ok) {
      setError(res.error ?? "Could not create account.")
      return
    }
    if (res.mock && res.user) {
      setPendingUser(res.user)
    }
    setStep("otp")
  }

  const verify = async () => {
    setBusy(true)
    setError(null)
    const res = await verifyOtpAction(phone, code)
    setBusy(false)
    if (!res.ok) {
      setError(res.error)
      return
    }
    setUser(res.user)
    toast({ title: `Welcome, ${res.user.fullName.split(" ")[0]}!`, description: "Your account is ready." })
    router.replace(HOME_FOR[res.user.role])
  }

  if (step === "otp") {
    return (
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="signup-otp">Verification code</Label>
          <Input
            id="signup-otp"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="••••••"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>

        {pendingUser && (
          <p className="text-center text-xs text-muted-foreground">
            Creating account as {pendingUser.fullName}
          </p>
        )}
        <p className="rounded-xl bg-emerald-600/10 px-3 py-2 text-center text-xs font-semibold text-emerald-700 dark:text-emerald-300">
          Demo OTP: 420420
        </p>

        <Button
          className="w-full"
          size="lg"
          onClick={verify}
          disabled={busy || code.trim().length < 4}
        >
          {busy && <Loader2 className="animate-spin" />}
          Create & sign in
        </Button>

        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="signup-name">Full name</Label>
        <Input
          id="signup-name"
          placeholder="e.g. Arvind Kumar"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="signup-phone">Mobile number</Label>
        <div className="relative">
          <Phone className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="signup-phone"
            type="tel"
            inputMode="tel"
            placeholder="+91 97400 00000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>I am a…</Label>
        <div className="grid gap-2">
          {ROLES.map((r) => (
            <button
              key={r.role}
              type="button"
              onClick={() => setRole(r.role)}
              className={cn(
                "flex items-center gap-3 rounded-xl border bg-background px-3 py-2.5 text-left transition-colors",
                role === r.role
                  ? "border-emerald-600 bg-emerald-600/10"
                  : "hover:bg-muted"
              )}
            >
              <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <r.icon className="size-4" />
              </span>
              <span>
                <span className="block text-xs font-semibold">{r.label}</span>
                <span className="block text-[10px] text-muted-foreground">
                  {r.hint}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <Button className="w-full" size="lg" onClick={create} disabled={busy}>
        {busy && <Loader2 className="animate-spin" />}
        Continue
      </Button>

      <button
        type="button"
        onClick={onBack}
        className="mx-auto flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3" />
        Back to sign in
      </button>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}