export type UserRole = "generator" | "collector" | "depot" | "admin"

export interface User {
  id: string
  role: UserRole
  full_name: string
  phone: string
  upi_id?: string
  created_at: string
  rating?: number
  is_online?: boolean
}

export type LocationType = "temple" | "vendor" | "market"

export interface Location {
  id: string
  user_id: string
  lat: number
  lng: number
  address_text: string
  location_type: LocationType
}

export type PickupStatus =
  | "pending"
  | "accepted"
  | "in_transit"
  | "weighed_in"
  | "completed"

export type PickupSlot = "now" | "06-10" | "10-14" | "14-18" | "18-22"

export interface Pickup {
  id: string
  generator_id: string
  collector_id?: string
  requested_kg: number
  actual_kg?: number
  status: PickupStatus
  geo_lat: number
  geo_lng: number
  created_at: string
  completed_at?: string
  address_text?: string
  generator_name?: string
  location_type?: LocationType
  requested_slot?: PickupSlot
  slot_date?: string
}

export interface DepotBatch {
  id: string
  batch_id: string
  input_raw_kg: number
  output_fiber_kg: number
  output_shell_kg: number
  output_pith_kg: number
  processed_at: string
}

export type DistributionTier = "tier1_b2b" | "tier2_shg" | "tier3_inhouse"

export type MaterialType = "fiber" | "shells" | "pith" | "cocopeat" | "compost"

export interface DistributionLog {
  id: string
  tier: DistributionTier
  material_type: MaterialType
  quantity_kg: number
  destination_name: string
  dispatched_at: string
}

export type TransactionType = "earning" | "payout"

export type TransactionStatus = "pending" | "settled" | "rejected"

export interface PaymentTransaction {
  id: string
  user_id: string
  type: TransactionType
  amount: number
  status: TransactionStatus
  reference?: string
  upi_id?: string
  pickup_id?: string
  created_at: string
  settled_at?: string
}

export type NotificationType = "pickup_status" | "payment" | "system"

export interface AppNotification {
  id: string
  user_id: string
  title: string
  body: string
  type: NotificationType
  read: boolean
  created_at: string
}

export interface LiveLocation {
  pickup_id: string
  lat: number
  lng: number
  updated_at: string
}