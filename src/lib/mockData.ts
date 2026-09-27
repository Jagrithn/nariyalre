import type {
  DepotBatch,
  DistributionLog,
  Location,
  Pickup,
  User,
} from "@/lib/types"

export const mockUsers: User[] = [
  {
    id: "u_gen_1",
    role: "generator",
    full_name: "Mariyamma Temple Trust",
    phone: "+919740000001",
    created_at: "2026-07-02T08:30:00+05:30",
    rating: 4.8,
    is_online: true,
  },
  {
    id: "u_gen_2",
    role: "generator",
    full_name: "Karthik Fruit Stall",
    phone: "+919740000002",
    created_at: "2026-07-08T11:15:00+05:30",
    rating: 4.5,
    is_online: true,
  },
  {
    id: "u_gen_3",
    role: "generator",
    full_name: "Pondy Bazaar Market",
    phone: "+919740000003",
    created_at: "2026-07-15T09:45:00+05:30",
    rating: 4.9,
    is_online: false,
  },
  {
    id: "u_col_1",
    role: "collector",
    full_name: "Ravi Shankar",
    phone: "+919740000011",
    upi_id: "ravi.shankar@okhdfcbank",
    created_at: "2026-06-28T16:00:00+05:30",
    rating: 4.7,
    is_online: true,
  },
  {
    id: "u_col_2",
    role: "collector",
    full_name: "Meena Kumari",
    phone: "+919740000012",
    upi_id: "meena.kumari@okicici",
    created_at: "2026-07-05T13:20:00+05:30",
    rating: 4.9,
    is_online: false,
  },
  {
    id: "u_depot_1",
    role: "depot",
    full_name: "Coco Central Depot",
    phone: "+919740000021",
    created_at: "2026-06-20T07:00:00+05:30",
  },
  {
    id: "u_admin_1",
    role: "admin",
    full_name: "Ananya Iyer",
    phone: "+919740000031",
    created_at: "2026-06-18T10:00:00+05:30",
  },
]

export const mockLocations: Location[] = [
  {
    id: "loc_1",
    user_id: "u_gen_1",
    lat: 13.0487,
    lng: 80.2757,
    address_text: "Sri Kapaleeshwarar Temple, Mylapore",
    location_type: "temple",
  },
  {
    id: "loc_2",
    user_id: "u_gen_2",
    lat: 13.0624,
    lng: 80.2507,
    address_text: "Karthik Fruit Stall, Pondy Bazaar",
    location_type: "vendor",
  },
  {
    id: "loc_3",
    user_id: "u_gen_3",
    lat: 13.0358,
    lng: 80.222,
    address_text: "Saidapet Market, Chennai",
    location_type: "market",
  },
  {
    id: "loc_4",
    user_id: "u_gen_1",
    lat: 13.0395,
    lng: 80.2335,
    address_text: "Kandaswamy Temple, Park Town",
    location_type: "temple",
  },
]

const iso = (offsetDays: number, hour = 9, minute = 30) => {
  const d = new Date()
  d.setDate(d.getDate() - offsetDays)
  d.setHours(hour, minute, 0, 0)
  return d.toISOString()
}

export const mockPickups: Pickup[] = [
  {
    id: "pk_1",
    generator_id: "u_gen_1",
    collector_id: "u_col_1",
    requested_kg: 42,
    actual_kg: 48,
    status: "completed",
    geo_lat: 13.0487,
    geo_lng: 80.2757,
    address_text: "Sri Kapaleeshwarar Temple, Mylapore",
    generator_name: "Mariyamma Temple Trust",
    location_type: "temple",
    requested_slot: "06-10",
    created_at: iso(8, 8, 15),
    completed_at: iso(8, 11, 5),
  },
  {
    id: "pk_2",
    generator_id: "u_gen_2",
    collector_id: "u_col_1",
    requested_kg: 18,
    actual_kg: 21,
    status: "weighed_in",
    geo_lat: 13.0624,
    geo_lng: 80.2507,
    address_text: "Karthik Fruit Stall, Pondy Bazaar",
    generator_name: "Karthik Fruit Stall",
    location_type: "vendor",
    requested_slot: "10-14",
    created_at: iso(4, 10, 20),
    completed_at: iso(4, 12, 40),
  },
  {
    id: "pk_3",
    generator_id: "u_gen_1",
    collector_id: "u_col_2",
    requested_kg: 60,
    actual_kg: 66,
    status: "in_transit",
    geo_lat: 13.0395,
    geo_lng: 80.2335,
    address_text: "Kandaswamy Temple, Park Town",
    generator_name: "Mariyamma Temple Trust",
    location_type: "temple",
    requested_slot: "now",
    created_at: iso(1, 9, 5),
  },
  {
    id: "pk_4",
    generator_id: "u_gen_3",
    requested_kg: 120,
    status: "pending",
    geo_lat: 13.0358,
    geo_lng: 80.222,
    address_text: "Saidapet Market, Chennai",
    generator_name: "Pondy Bazaar Market",
    location_type: "market",
    requested_slot: "10-14",
    slot_date: iso(0, 7, 45).slice(0, 10),
    created_at: iso(0, 7, 45),
  },
  {
    id: "pk_5",
    generator_id: "u_gen_2",
    requested_kg: 25,
    status: "pending",
    geo_lat: 13.0472,
    geo_lng: 80.262,
    address_text: "Luz Church Road vendor cluster",
    generator_name: "Karthik Fruit Stall",
    location_type: "vendor",
    requested_slot: "18-22",
    slot_date: iso(0, 8, 10).slice(0, 10),
    created_at: iso(0, 8, 10),
  },
  {
    id: "pk_6",
    generator_id: "u_gen_1",
    collector_id: "u_col_2",
    requested_kg: 34,
    actual_kg: 31,
    status: "accepted",
    geo_lat: 13.0526,
    geo_lng: 80.2412,
    address_text: "Marundeeswarar Temple, Thiruvanmiyur",
    generator_name: "Mariyamma Temple Trust",
    location_type: "temple",
    requested_slot: "now",
    created_at: iso(0, 9, 30),
  },
  {
    id: "pk_7",
    generator_id: "u_gen_1",
    requested_kg: 50,
    status: "pending",
    geo_lat: 13.0456,
    geo_lng: 80.2701,
    address_text: "Ramakrishna Mutt, Mylapore",
    generator_name: "Mariyamma Temple Trust",
    location_type: "temple",
    requested_slot: "10-14",
    slot_date: iso(0, 7, 45).slice(0, 10),
    created_at: iso(0, 7, 45),
  },
]

export const mockDepotInventory: DepotBatch[] = [
  {
    id: "inv_1",
    batch_id: "B-2601",
    input_raw_kg: 1000,
    output_fiber_kg: 260,
    output_shell_kg: 430,
    output_pith_kg: 245,
    processed_at: iso(3, 15, 0),
  },
  {
    id: "inv_2",
    batch_id: "B-2602",
    input_raw_kg: 1240,
    output_fiber_kg: 321,
    output_shell_kg: 538,
    output_pith_kg: 302,
    processed_at: iso(2, 11, 30),
  },
  {
    id: "inv_3",
    batch_id: "B-2603",
    input_raw_kg: 860,
    output_fiber_kg: 216,
    output_shell_kg: 366,
    output_pith_kg: 209,
    processed_at: iso(1, 14, 20),
  },
  {
    id: "inv_4",
    batch_id: "B-2604",
    input_raw_kg: 1495,
    output_fiber_kg: 389,
    output_shell_kg: 634,
    output_pith_kg: 358,
    processed_at: iso(0, 10, 45),
  },
]

export const mockDistributionLogs: DistributionLog[] = [
  {
    id: "dist_1",
    tier: "tier1_b2b",
    material_type: "fiber",
    quantity_kg: 500,
    destination_name: "Sathya Agro Fibres, Coimbatore",
    dispatched_at: iso(3, 16, 10),
  },
  {
    id: "dist_2",
    tier: "tier1_b2b",
    material_type: "fiber",
    quantity_kg: 320,
    destination_name: "TerraBloom Mattresses",
    dispatched_at: iso(1, 17, 0),
  },
  {
    id: "dist_3",
    tier: "tier2_shg",
    material_type: "shells",
    quantity_kg: 280,
    destination_name: "Kalpana Women's SHG, Perungudi",
    dispatched_at: iso(2, 13, 30),
  },
  {
    id: "dist_4",
    tier: "tier2_shg",
    material_type: "fiber",
    quantity_kg: 150,
    destination_name: "Green Hands SHG, Velachery",
    dispatched_at: iso(1, 12, 45),
  },
  {
    id: "dist_5",
    tier: "tier3_inhouse",
    material_type: "cocopeat",
    quantity_kg: 400,
    destination_name: "Coco Process Unit",
    dispatched_at: iso(0, 15, 15),
  },
  {
    id: "dist_6",
    tier: "tier3_inhouse",
    material_type: "compost",
    quantity_kg: 260,
    destination_name: "Coco Bhoomi Block Camp",
    dispatched_at: iso(0, 15, 20),
  },
]

export const depotStats = {
  total_processed_kg: 4595,
  monthly_throughput_kg: 12180,
  yield_fiber_pct: 25.6,
  yield_shell_pct: 43.2,
  yield_pith_pct: 24.4,
}

export function pickupsForGenerator(userId: string): Pickup[] {
  return mockPickups.filter((p) => p.generator_id === userId)
}

export function pendingPickups(): Pickup[] {
  return mockPickups.filter((p) => p.status === "pending")
}

export function pickupsForCollector(collectorId: string): Pickup[] {
  return mockPickups.filter((p) => p.collector_id === collectorId)
}

export function findPickupById(id: string): Pickup | undefined {
  return mockPickups.find((p) => p.id === id)
}

export function userById(id: string): User | undefined {
  return mockUsers.find((u) => u.id === id)
}

export function locationForUser(userId: string): Location | undefined {
  return mockLocations.find((l) => l.user_id === userId)
}