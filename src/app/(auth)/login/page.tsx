"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, Phone, ShieldCheck, TreePalm } from "lucide-react"

import {
  sendOtpAction,
  verifyOtpAction,
  type OtpUser,
} from "@/actions/auth"
import { CreateAccountForm } from "@/components/features/auth/create-account-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HOME_FOR } from "@/lib/homeFor"
import { useSessionStore } from "@/lib/stores/session"
import type { UserRole } from "@/lib/types"
import { cn } from "@/lib/utils"

const DEMO_ACCOUNTS: { phone: string; role: UserRole; label: string }[] = [
  { phone: "+919740000001", role: "generator", label: "Generator · Temple" },
  { phone: "+919740000011", role: "collector", label: "Collector · Ravi" },
  { phone: "+919740000021", role: "depot", label: "Depot weighbridge" },
  { phone: "+919740000031", role: "admin", label: "Ops admin" },
  { phone: "+919740000041", role: "consumer", label: "Consumer · Eco shopper" },
]

export default function LoginPage() {
  const router = useRouter()
  const setUser = useSessionStore((s) => s.setUser)

  const [mode, setMode] = useState<"signin" | "signup">("signin")
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [phone, setPhone] = useState("")
  const [code, setCode] = useState("")
  const [mockCode, setMockCode] = useState<string | null>(null)
  const [pendingUser, setPendingUser] = useState<OtpUser | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendOtp = async () => {
    if (!phone.trim()) return
    setBusy(true)
    setError(null)
    const result = await sendOtpAction(phone)
    setBusy(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    if (result.mock) {
      setMockCode(result.code)
      setPendingUser(result.user)
      if (!result.user) {
        setError("Unknown demo number — pick an account below.")
        return
      }
    }
    setStep("otp")
  }

  const verify = async () => {
    setBusy(true)
    setError(null)
    const result = await verifyOtpAction(phone, code)
    setBusy(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    setUser(result.user)
    router.replace(HOME_FOR[result.user.role])
  }

  const reset = () => {
    setStep("phone")
    setCode("")
    setMockCode(null)
    setPendingUser(null)
    setError(null)
  }

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-16 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-lime-400/20 blur-3xl" />
      </div>

      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="mb-3 inline-flex size-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg">
            <TreePalm className="size-6" />
          </span>
          <h1 className="text-2xl font-bold tracking-tight">
            Coco
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in with your mobile number
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          {mode === "signup" ? (
            <CreateAccountForm onBack={() => setMode("signin")} />
          ) : step === "phone" ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="phone">Mobile number</Label>
                <div className="relative">
                  <Phone className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    inputMode="tel"
                    placeholder="+91 97400 00001"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={sendOtp}
                disabled={busy || !phone.trim()}
              >
                {busy ? <Loader2 className="animate-spin" /> : null}
                Send OTP
              </Button>

              <div>
                <p className="mb-2 text-[11px] font-medium text-muted-foreground">
                  Demo accounts (tap to prefill)
                </p>
                <div className="space-y-1.5">
                  {DEMO_ACCOUNTS.map((acc) => (
                    <button
                      key={acc.phone}
                      type="button"
                      onClick={() => setPhone(acc.phone)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl border bg-background px-3 py-2 text-left text-xs transition-colors hover:bg-muted",
                        phone === acc.phone && "border-emerald-600 bg-emerald-600/10"
                      )}
                    >
                      <span className="font-semibold">{acc.label}</span>
                      <span className="text-muted-foreground">{acc.phone}</span>
                    </button>
                  ))}
                </div>
              </div>

              {error && <p className="text-xs text-destructive">{error}</p>}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="otp">Verification code</Label>
                <Input
                  id="otp"
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
                  Signing in as {pendingUser.fullName}
                </p>
              )}

              {mockCode && (
                <p className="rounded-xl bg-emerald-600/10 px-3 py-2 text-center text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  Demo OTP: {mockCode}
                </p>
              )}

              <Button
                className="w-full"
                size="lg"
                onClick={verify}
                disabled={busy || code.trim().length < 4}
              >
                {busy ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <ShieldCheck />
                )}
                Verify & sign in
              </Button>

              <button
                type="button"
                onClick={reset}
                className="mx-auto flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="size-3" />
                {phone && (
                  <>
                    <span>{phone}</span> · change
                  </>
                )}
              </button>

              {error && <p className="text-xs text-destructive">{error}</p>}
            </div>
          )}
        </div>

        {mode === "signin" && (
          <p className="mt-5 text-center text-xs">
            <span className="text-muted-foreground">New here? </span>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className="font-semibold text-emerald-700 hover:underline dark:text-emerald-300"
            >
              Create an account
            </button>
          </p>
        )}

        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link href="/" className="flex items-center justify-center gap-1 hover:text-foreground">
            <ArrowLeft className="size-3" />
            Back to home
          </Link>
        </p>
      </div>
    </main>
  )
}