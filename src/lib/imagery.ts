import type { LocationType } from "@/lib/types"

export const IMAGES = {
  grove: "/images/grove.jpg",
  shgCraft: "/images/shg-craft.jpg",
  deposit: "/images/deposit.jpg",
  rolesTemple: "/images/roles-temple.jpg",
  rolesDepot: "/images/roles-depot.jpg",
  rolesOps: "/images/roles-ops.jpg",
  machineA: "/images/machine-a.jpg",
  machineB: "/images/machine-b.jpg",
  generatorHero: "/images/generator-hero.jpg",
  collectorHero: "/images/collector-hero.jpg",
  avatarAdmin: "/images/avatar-admin.jpg",
  emptyBasket: "/images/empty-basket.jpg",
  stepHandoff: "/images/step-handoff.jpg",
  stepTruck: "/images/step-truck.jpg",
  stepPress: "/images/step-press.jpg",
  stepShop: "/images/step-shop.jpg",
} as const

export const MACHINE_IMAGES = [IMAGES.machineA, IMAGES.machineB] as const

export const LOCATION_IMAGE: Record<LocationType, string> = {
  temple: IMAGES.rolesTemple,
  vendor: IMAGES.stepShop,
  market: IMAGES.rolesDepot,
}

export const METRIC_IMAGES = {
  tier1: IMAGES.rolesOps,
  tier2: IMAGES.shgCraft,
  tier3: IMAGES.stepPress,
} as const