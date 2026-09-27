import type { DistributionTier, MaterialType } from "@/lib/types"

export const TIER_META: Record<
  DistributionTier,
  { label: string; short: string; blurb: string; hex: string; badgeClass: string }
> = {
  tier1_b2b: {
    label: "Tier 1 · B2B Baling",
    short: "Tier 1",
    blurb: "Bulk industrial fibre",
    hex: "#059669",
    badgeClass:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300",
  },
  tier2_shg: {
    label: "Tier 2 · SHG Artisan Hub",
    short: "Tier 2",
    blurb: "Graded shells & coir to women's groups",
    hex: "#65a30d",
    badgeClass:
      "bg-lime-100 text-lime-800 dark:bg-lime-900/50 dark:text-lime-300",
  },
  tier3_inhouse: {
    label: "Tier 3 · In-house",
    short: "Tier 3",
    blurb: "Cocopeat blocks & bio-compost",
    hex: "#d97706",
    badgeClass:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300",
  },
}

export const MATERIAL_META: Record<MaterialType, { label: string; short: string }> = {
  fiber: { label: "Fibre", short: "FI" },
  shells: { label: "Shells", short: "SH" },
  pith: { label: "Pith", short: "PI" },
  cocopeat: { label: "Cocopeat", short: "CP" },
  compost: { label: "Bio-compost", short: "BC" },
}

export const TIER_ORDER: DistributionTier[] = [
  "tier1_b2b",
  "tier2_shg",
  "tier3_inhouse",
]