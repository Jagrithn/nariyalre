import type { Product } from "@/lib/types"

export const PRODUCTS: Product[] = [
  {
    id: "prod_cpb",
    name: "Cocopeat garden block",
    material_type: "cocopeat",
    price: 185,
    unit: "5 kg block",
    description:
      "Pre-washed, low-EC cocopeat. Soaks in minutes — the base for every healthy pot.",
    made_by: "Coco SHG · Kotturpuram",
    stock: 240,
    recycler_kg: 5,
    accent: "emerald",
    image: "/products/cocopeat-block.jpg",
  },
  {
    id: "prod_planter",
    name: "Coir planter pot",
    material_type: "fiber",
    price: 95,
    unit: "1 piece",
    description:
      "Biodegradable coir pot that plants grow straight through. No plastic nursery pots.",
    made_by: "Mangalam Workers Co-op",
    stock: 520,
    recycler_kg: 0.4,
    accent: "teal",
    image: "/products/coir-planter.webp",
  },
  {
    id: "prod_briquette",
    name: "Shell charcoal briquettes",
    material_type: "shells",
    price: 240,
    unit: "2 kg pack",
    description:
      "Coconut-shell charcoal. High heat, low smoke — a coal alternative for tandoors.",
    made_by: "Coco Processing Unit",
    stock: 180,
    recycler_kg: 2,
    accent: "amber",
    image: "/products/briquettes.jpg",
  },
  {
    id: "prod_compost",
    name: "Coir compost bag",
    material_type: "compost",
    price: 120,
    unit: "5 kg bag",
    description:
      "Aged coir-pith compost that feeds the soil, not the landfill. Ready to mulch.",
    made_by: "Bhoomi Block Camp",
    stock: 310,
    recycler_kg: 5,
    accent: "lime",
    image: "/products/coir-compost.jpg",
  },
  {
    id: "prod_doormat",
    name: "Coir doormat",
    material_type: "fiber",
    price: 350,
    unit: "1 piece",
    description:
      "Hand-loomed natural coir. Tough on dirt, gentle on the planet.",
    made_by: "Mangalam Workers Co-op",
    stock: 95,
    recycler_kg: 1.2,
    accent: "teal",
    image: "/products/coir-doormat.webp",
  },
  {
    id: "prod_soapdish",
    name: "Shell soap dish",
    material_type: "shells",
    price: 60,
    unit: "1 piece",
    description:
      "A polished half-shell that drains naturally — a tiny craft with a big story.",
    made_by: "Coco Women's Collective",
    stock: 400,
    recycler_kg: 0.2,
    accent: "amber",
    image: "/products/soap-dish.jpg",
  },
]

export function productById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id)
}