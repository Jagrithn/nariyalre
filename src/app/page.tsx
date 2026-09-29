import Link from "next/link"

import { DepositTeaser } from "@/components/features/landing/deposit-teaser"
import { HowItWorks } from "@/components/features/landing/how-it-works"
import { ImpactCounters } from "@/components/features/landing/impact-counters"
import { LandingHero } from "@/components/features/landing/landing-hero"
import { LandingProducts } from "@/components/features/landing/landing-products"
import { RoleDirectory } from "@/components/features/landing/role-directory"
import { WomenSection } from "@/components/features/landing/women-section"

export default function Home() {
  return (
    <main className="min-h-dvh">
      <LandingHero />
      <ImpactCounters />
      <HowItWorks />
      <WomenSection />
      <LandingProducts />
      <DepositTeaser />
      <RoleDirectory />

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-8 text-center">
          <p className="text-xs font-semibold text-muted-foreground">
            Coco · circular coconut waste logistics
          </p>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs">
            <Link href="/login" className="font-medium text-emerald-700 hover:underline dark:text-emerald-300">
              Sign in
            </Link>
            <Link href="/consumer" className="text-muted-foreground hover:text-foreground hover:underline">
              Shop
            </Link>
            <Link href="/consumer/machines" className="text-muted-foreground hover:text-foreground hover:underline">
              Vending machines
            </Link>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Demo build — try any flow with mock data. Demo OTP 420420.
          </p>
        </div>
      </footer>
    </main>
  )
}