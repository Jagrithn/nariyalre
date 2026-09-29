import { chromium } from "playwright"
import { mkdirSync, statSync } from "node:fs"

const BASE = process.env.DECK_APP_URL ?? "http://localhost:3113"
const OUT = process.env.DECK_OUT ?? ".deck"

const session = (user) =>
  JSON.stringify({ state: { user }, version: 0 })

const USERS = {
  generator: { id: "u_gen_1", role: "generator", fullName: "Mariyamma Temple Trust", phone: "+919740000001" },
  collector: { id: "u_col_1", role: "collector", fullName: "Ravi Shankar", phone: "+919740000011" },
  consumer: { id: "u_cons_1", role: "consumer", fullName: "Eco Shopper", phone: "+919740000041" },
  admin: { id: "u_admin_1", role: "admin", fullName: "Ananya Iyer", phone: "+919740000031" },
}

const COLLECTOR_STATE = JSON.stringify({
  state: {
    activeJobs: [],
    completedJobs: [
      { pickupId: "pk_1", weightKg: 48, earned: 120, completedAt: new Date().toISOString(), addressText: "Sri Kapaleeshwarar Temple, Mylapore" },
      { pickupId: "pk_2", weightKg: 21, earned: 52, completedAt: new Date(Date.now() - 86400000).toISOString(), addressText: "Karthik Fruit Stall, Pondy Bazaar" },
      { pickupId: "pk_3", weightKg: 31, earned: 77, completedAt: new Date(Date.now() - 172800000).toISOString(), addressText: "Marundeeswarar Temple, Thiruvanmiyur" },
    ],
    settled: 249,
    upiId: "ravi.shankar@okhdfcbank",
    payouts: [
      { id: "pay_1", amount: 150, paidAt: new Date().toISOString(), upiId: "ravi.shankar@okhdfcbank", status: "settled", reference: "TXN284910" },
      { id: "pay_2", amount: 120, paidAt: new Date(Date.now() - 172800000).toISOString(), upiId: "ravi.shankar@okhdfcbank", status: "pending" },
    ],
  },
  version: 0,
})

const CONSUMER_STATE = JSON.stringify({
  state: {
    items: [],
    orders: [
      {
        id: "ord_1",
        user_id: "u_cons_1",
        items: [
          { productId: "prod_planter", name: "Hanging cocopeat planter", qty: 2, price: 299 },
          { productId: "prod_soapdish", name: "Activated-shell soap bar", qty: 1, price: 149 },
        ],
        total: 747,
        kg_diverted: 2.1,
        status: "delivered",
        created_at: new Date(Date.now() - 2628000000).toISOString(),
        address: "ECR, Chennai",
      },
      {
        id: "ord_2",
        user_id: "u_cons_1",
        items: [{ productId: "prod_cpb", name: "Coco Bloom block", qty: 3, price: 349 }],
        total: 1047,
        kg_diverted: 3.3,
        status: "shipped",
        created_at: new Date(Date.now() - 3600000).toISOString(),
        address: "ECR, Chennai",
      },
    ],
    address: "ECR, Chennai",
  },
  version: 0,
})

const SCREENS = [
  { name: "landing", path: "/", viewport: "desktop", seed: "none", wait: "new gold" },
  { name: "login", path: "/login", viewport: "mobile", seed: "none", wait: "Create an account" },
  { name: "generator", path: "/generator", viewport: "mobile", seed: "generator", wait: "Recent pickups" },
  { name: "collector-home", path: "/collector", viewport: "mobile", seed: "collector", wait: "jobs nearby" },
  { name: "collector-earnings", path: "/collector/earnings", viewport: "mobile", seed: "collector-full", wait: "Earnings" },
  { name: "admin", path: "/admin", viewport: "desktop", seed: "admin", wait: "Overview" },
  { name: "consumer-shop", path: "/consumer", viewport: "mobile", seed: "consumer", wait: "Shop the circular edit" },
  { name: "consumer-machines", path: "/consumer/machines", viewport: "mobile", seed: "consumer", wait: "Drop waste, earn" },
  { name: "consumer-orders", path: "/consumer/orders", viewport: "mobile", seed: "consumer-full", wait: "Your orders" },
]

function seedsFor(kind) {
  switch (kind) {
    case "generator":
      return { "coco-session": session(USERS.generator) }
    case "collector":
      return { "coco-session": session(USERS.collector) }
    case "collector-full":
      return { "coco-session": session(USERS.collector), "coco-collector-state": COLLECTOR_STATE }
    case "consumer":
      return { "coco-session": session(USERS.consumer) }
    case "consumer-full":
      return { "coco-session": session(USERS.consumer), "coco-consumer": CONSUMER_STATE }
    case "admin":
      return { "coco-session": session(USERS.admin) }
    default:
      return {}
  }
}

mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch()

for (const screen of SCREENS) {
  const isMobile = screen.viewport === "mobile"
  const page = await browser.newPage({
    viewport: isMobile
      ? { width: 390, height: 844 }
      : { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    isMobile,
    hasTouch: isMobile,
  })

  const seeds = seedsFor(screen.seed)
  for (const [key, value] of Object.entries(seeds)) {
    await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" })
    await page.evaluate(
      ([k, v]) => localStorage.setItem(k, v),
      [key, value]
    )
  }

  await page.goto(`${BASE}${screen.path}`, { waitUntil: "domcontentloaded" })
  await page.getByText(screen.wait, { exact: false }).first().waitFor({ timeout: 30000 })
  await page.waitForTimeout(1200)

  const file = `${OUT}/${screen.name}.png`
  await page.screenshot({ path: file, fullPage: isMobile ? false : false })
  console.log(`captured ${screen.name} (${screen.viewport})`)
}

await browser.close()

for (const screen of SCREENS) {
  const size = statSync(`${OUT}/${screen.name}.png`).size
  if (size < 8000) throw new Error(`screenshot too small: ${screen.name} (${size}B)`)
}
console.log(`all screenshots ok in ${OUT}/`)