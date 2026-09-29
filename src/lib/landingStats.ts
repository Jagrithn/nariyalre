export interface LandingStats {
  kilogramsRecycled: number
  co2SavedKg: number
  shellsDiverted: number
  ruralWomenEmployed: number
  machinesLive: number
  cocopeatBlocksShipped: number
}

export const LANDING_STATS: LandingStats = {
  kilogramsRecycled: 1_218_490,
  co2SavedKg: 292_438,
  shellsDiverted: 4_873_960,
  ruralWomenEmployed: 184,
  machinesLive: 26,
  cocopeatBlocksShipped: 12_400,
}

export const IMPACT_METERS = [
  {
    key: "kilogramsRecycled",
    value: LANDING_STATS.kilogramsRecycled,
    suffix: " kg",
    label: "waste recycled",
  },
  {
    key: "co2SavedKg",
    value: LANDING_STATS.co2SavedKg,
    suffix: " kg",
    label: "CO₂ kept out of air",
  },
  {
    key: "shellsDiverted",
    value: LANDING_STATS.shellsDiverted,
    suffix: "",
    label: "coconut shells diverted",
  },
  {
    key: "ruralWomenEmployed",
    value: LANDING_STATS.ruralWomenEmployed,
    suffix: "",
    label: "rural women employed",
  },
]