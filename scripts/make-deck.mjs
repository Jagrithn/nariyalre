import PptxGenJS from "pptxgenjs"
import { statSync } from "node:fs"
import { THEME } from "./theme.mjs"

const OUT = "docs/Coco-Pitch.pptx"
const DECK = ".deck"

const pptx = new PptxGenJS()
pptx.layout = "LAYOUT_16x9"
pptx.author = "Coco"
pptx.company = "Coco — circular bio-resource logistics"
pptx.subject = "Coco pitch deck"
pptx.title = "Coco — Waste that works"
pptx.lang = "en-IN"

const F = THEME.font

const SHORT = new Intl.NumberFormat("en-IN", { notation: "compact" })

const requireImg = (name) => {
  const full = `${DECK}/${name}.png`
  if (statSync(full).size < 8000) throw new Error(`missing screenshot ${full}`)
  return { path: full }
}

function newSlide(bg = THEME.cream) {
  const s = pptx.addSlide()
  s.background = { color: bg }
  return s
}

function header(s, kicker, title, accent = THEME.emerald) {
  s.addText(kicker.toUpperCase(), {
    x: 0.6, y: 0.42, w: 9, h: 0.3, fontSize: 11, color: accent, bold: true, charSpacing: 3, fontFace: F,
  })
  s.addText(title, {
    x: 0.6, y: 0.72, w: 12.1, h: 0.7, fontSize: THEME.titleSize, bold: true, color: THEME.ink, fontFace: F,
  })
  s.addShape("line", { x: 0.62, y: 1.5, w: 1.6, h: 0, line: { color: accent, width: 3 } })
}

function bullets(s, items, x, y, w, h, size = 14) {
  s.addText(items.map((t) => ({ text: t, options: { bullet: { indent: 16 }, breakLine: true, paraSpaceAfter: 10 } })), {
    x, y, w, h, fontSize: size, color: THEME.slate, fontFace: F, valign: "top",
  })
}

function phone(s, name, x, y, w) {
  const h = w * (844 / 390)
  const screen = { x: x + w * 0.034, y: y + h * 0.038, w: w * 0.932, h: h * 0.924 }
  s.addShape("roundRect", {
    x, y, w, h, rectRadius: 0.09, fill: { color: "0B1322" }, line: { color: "334155", width: 1.2 },
  })
  s.addImage({ ...requireImg(name), ...screen, sizing: { type: "cover", w: screen.w, h: screen.h } })
  s.addShape("roundRect", {
    x: x + w * 0.34, y: y + h * 0.012, w: w * 0.32, h: h * 0.018, rectRadius: 0.5,
    fill: { color: "0B1322" }, line: { color: "334155", width: 0.5 },
  })
  return { x, y, w, h }
}

function desktopFrame(s, name, x, y, w) {
  const h = w * (900 / 1440)
  s.addShape("roundRect", {
    x, y, w, h, rectRadius: 0.015, fill: { color: "0B1322" }, line: { color: "334155", width: 1.2 },
  })
  s.addImage({ ...requireImg(name), x: x + w * 0.012, y: y + h * 0.02, w: w * 0.976, h: h * 0.96, sizing: { type: "cover" } })
  s.addShape("rect", { x: x + w * 0.012, y: y + h * 0.004, w: w * 0.976, h: h * 0.016, fill: { color: "0B1322" } })
  return { x, y, w, h }
}

/* ============================ 1 · COVER ============================ */
{
  const s = newSlide(THEME.inkDeep)
  s.addShape("roundRect", {
    x: -1.4, y: -1.4, w: 7.4, h: 7.4, rectRadius: 0.5,
    fill: { color: "065F46", transparency: 65 },
  })
  s.addShape("roundRect", {
    x: 8.9, y: 4.9, w: 6.2, h: 6.2, rectRadius: 0.5,
    fill: { color: "F59E0B", transparency: 78 },
  })

  s.addText("COCO", {
    x: 0.7, y: 0.6, w: 6, h: 0.5, fontSize: 18, color: THEME.textOnDark,
    bold: true, charSpacing: 6, fontFace: F,
  })

  s.addText([
    { text: "Coconut waste", options: { color: "FFFFFF", breakLine: true, lineSpacing: 40, fontFace: F, bold: true, fontSize: 42 } },
    { text: "is the new gold.", options: { color: "34D399", breakLine: true, lineSpacing: 40, fontFace: F, bold: true, fontSize: 42 } },
  ], { x: 0.7, y: 1.7, w: 7.2, h: 2.4, valign: "top" })

  s.addText("Coco intercepts urban coconut waste at the source — temples, vendors, homes — and turns shells, husk and pith into products, payouts and livelihoods. All tracked, priced and circular.", {
    x: 0.7, y: 4.25, w: 6.4, h: 1.25, fontSize: 14, color: "A7F3D0", fontFace: F, lineSpacing: 18, valign: "top",
  })

  const stats = [
    { v: SHORT.format(1218490), l: "kg recycled" },
    { v: SHORT.format(4873960), l: "shells diverted" },
    { v: "184", l: "women employed" },
    { v: "26", l: "machines live" },
  ]
  stats.forEach((st, i) => {
    const x = 0.7 + i * 1.7
    s.addText(st.v, { x, y: 5.7, w: 1.5, h: 0.45, fontSize: 20, bold: true, color: "FFFFFF", fontFace: F })
    s.addText(st.l, { x, y: 6.15, w: 1.55, h: 0.3, fontSize: 10, color: "6EE7B7", fontFace: F })
  })

  s.addText("Waste that works.", {
    x: 0.7, y: 6.75, w: 6, h: 0.4, fontSize: 13, bold: true,
    color: "FCD34D", fontFace: F,
  })

  const frame = desktopFrame(s, "landing", 8.0, 1.35, 4.6)
  s.addShape("roundRect", {
    x: frame.x - 0.12, y: frame.y - 0.12, w: frame.w + 0.24, h: frame.h + 0.24,
    rectRadius: 0.04, fill: { color: "064E3B" }, line: { color: "A7F3D0", width: 0.5 },
  })
}

/* ============================ 2 · PROBLEM ============================ */
{
  const s = newSlide()
  header(s, "The problem nobody sees", "Your morning coconut ends up here")

  const blocks = [
    { n: "1", t: "It smoulders for years", d: "Chennai landfills receive hundreds of tonnes of coconut waste daily. Husks burn slowly — releasing methane and CO₂ for years.", c: "F87171", b: "FEE2E2" },
    { n: "2", t: "Collectors work informal", d: "No routing, no fair weighing, no receipts. Grab, weigh-by-eye, cash-offers. Earners are invisible to banks and to the system.", c: "F59E0B", b: "FEF3C7" },
    { n: "3", t: "Impact has no proof", d: "No one can answer: how much was diverted? By whom? To where? For what? Every kilo is untraceable waste, not asset.", c: "64748B", b: "E2E8F0" },
  ]

  blocks.forEach((b, i) => {
    const x = 0.6 + i * 4.2
    s.addShape("roundRect", { x, y: 1.9, w: 3.9, h: 4.6, rectRadius: 0.06, fill: { color: "FFFFFF" }, line: { color: "E2E8F0", width: 1 } })
    s.addShape("roundRect", { x: x + 0.3, y: 2.2, w: 0.7, h: 0.7, rectRadius: 0.25, fill: { color: b.c }, line: { color: b.c } })
    s.addText(b.n, { x: x + 0.3, y: 2.2, w: 0.7, h: 0.7, align: "center", valign: "middle", fontSize: 20, bold: true, color: "FFFFFF", fontFace: F })
    s.addText(b.t, { x: x + 0.3, y: 3.1, w: 3.3, h: 0.6, fontSize: 17, bold: true, color: THEME.ink, fontFace: F })
    s.addText(b.d, { x: x + 0.3, y: 3.75, w: 3.35, h: 2.5, fontSize: 12.5, color: THEME.slate, fontFace: F, lineSpacing: 16, valign: "top" })
  })

  s.addText([{ text: "1,218,490 kg", options: { bold: true, color: THEME.emerald } }, { text: "  already recycled by the Coco demo network", options: { color: THEME.slate } }], {
    x: 0.6, y: 6.7, w: 12.1, h: 0.4, fontSize: 13, fontFace: F,
  })
}

/* ============================ 3 · THE COCO LOOP ============================ */
{
  const s = newSlide()
  header(s, "The solution", "The Coco circular loop")

  const steps = [
    { n: "01", t: "Drop", d: "Temples, vendors & consumers hand over shells, husk, pith." },
    { n: "02", t: "Collect & weigh", d: "Routed fleet or vending machines. QR-verified kg, instant UPI." },
    { n: "03", t: "Process", d: "Fiber, cocopeat, blocks & compost — via rural women's SHGs." },
    { n: "04", t: "Buy & earn", d: "Marketplace sells what the loop makes; earners get paid per kg." },
  ]

  const tiles = [
    { x: 0.6, y: 2.0, w: 5.9, h: 2.6 },
    { x: 0.6, y: 4.8, w: 5.9, h: 2.6 },
    { x: 6.8, y: 2.0, w: 5.9, h: 2.6 },
    { x: 6.8, y: 4.8, w: 5.9, h: 2.6 },
  ]

  steps.forEach((st, i) => {
    const t = tiles[i]
    s.addShape("roundRect", { x: t.x, y: t.y, w: t.w, h: t.h, rectRadius: 0.1, fill: { color: "FFFFFF" }, line: { color: i % 2 === 0 ? "D1FAE5" : "FEF3C7", width: 1.4 } })
    s.addText(st.n, { x: t.x + 0.3, y: t.y + 0.2, w: 1.5, h: 0.5, fontSize: 26, bold: true, color: i % 2 === 0 ? THEME.emerald : THEME.amber, fontFace: F })
    s.addText(st.t, { x: t.x + 2.0, y: t.y + 0.25, w: 3.6, h: 0.5, fontSize: 18, bold: true, color: THEME.ink, fontFace: F })
    s.addText(st.d, { x: t.x + 0.3, y: t.y + 1.0, w: 5.3, h: 1.3, fontSize: 12.5, color: THEME.slate, fontFace: F, lineSpacing: 17, valign: "top" })
  })
}

/* ============================ 4 · FIVE ROLES ============================ */
{
  const s = newSlide()
  header(s, "One loop, five roles", "Every interface is role-shaped")

  const roles = [
    { t: "Generator", s: "Temples & vendors", c: THEME.emerald },
    { t: "Collector", s: "Routed drivers", c: THEME.teal },
    { t: "Consumer", s: "Shop & drop waste", c: THEME.amber },
    { t: "Depot", s: "Weighbridge", c: "334155" },
    { t: "Admin", s: "Tri-tier ops", c: "7C3AED" },
  ]

  roles.forEach((r, i) => {
    const x = 0.6 + i * 2.44
    s.addShape("roundRect", { x, y: 1.85, w: 2.24, h: 1.95, rectRadius: 0.12, fill: { color: "FFFFFF" }, line: { color: "E2E8F0", width: 1 } })
    s.addShape("roundRect", { x: x + 0.22, y: 2.05, w: 0.42, h: 0.42, rectRadius: 0.25, fill: { color: r.c, transparency: 80 } })
    s.addShape("ellipse", { x: x + 0.33, y: 2.16, w: 0.2, h: 0.2, fill: { color: r.c } })
    s.addText(r.t, { x: x + 0.22, y: 2.6, w: 1.8, h: 0.4, fontSize: 14.5, bold: true, color: THEME.ink, fontFace: F })
    s.addText(r.s, { x: x + 0.22, y: 3.0, w: 1.85, h: 0.6, fontSize: 10.5, color: THEME.slate, fontFace: F })
  })

  s.addText("Full-featured operations console — real-time analytics, batches, distribution:", {
    x: 0.6, y: 4.0, w: 12, h: 0.35, fontSize: 11, color: THEME.slate, fontFace: F, italic: true,
  })
  desktopFrame(s, "admin", 0.6, 4.35, 12.13)
}

/* ============================ 5 · COLLECTOR + UPI ============================ */
{
  const s = newSlide()
  header(s, "Fair pay, every kilo", "Collectors earn ₹2.5/kg — instantly")

  bullets(s, [
    "Pending jobs on a map, sorted by distance with slot filters",
    "Swipe to accept, then an immersive turn-by-turn route",
    "Weigh-in at the depot is QR-verified — paid on measured kg",
    "Earnings tab: balance, payouts (Pending / Paid / Rejected) and UPI withdraw",
  ], 0.7, 1.85, 6.6, 3.2)

  phone(s, "collector-home", 7.5, 1.9, 2.5)
  phone(s, "collector-earnings", 10.35, 1.9, 2.5)

  s.addText("Try it: sign in as Collector, phone +91 97400 00011, OTP 420420", {
    x: 0.7, y: 6.7, w: 12, h: 0.35, fontSize: 11, color: THEME.emerald, bold: true, fontFace: F,
  })
}

/* ============================ 6 · LIVE TRACKING + SLOTS ============================ */
{
  const s = newSlide()
  header(s, "Scheduling that actually works", "Book a slot. Watch the collector live.")

  bullets(s, [
    "One-tap pickup requests with automatic GPS tagging",
    "Slots: Now · Morning · Midday · Afternoon · Evening",
    "Slot reminders push 45 min before the window opens",
    "Live tracking card — collector distance, ETA and mini-map",
  ], 0.7, 1.85, 6.7, 3.2)

  phone(s, "generator", 7.6, 1.9, 2.5)

  s.addText("+ works fully offline — requests queue on-device and reconcile later", {
    x: 0.7, y: 6.7, w: 12, h: 0.35, fontSize: 11, color: THEME.slate, italic: true, fontFace: F,
  })
}

/* ============================ 7 · CONSUMER + MACHINES ============================ */
{
  const s = newSlide()
  header(s, "The market catches the waste", "Shop the loop, feed a machine")

  bullets(s, [
    "Marketplace sells goods made from diverted coconut waste",
    "Demo checkout — every order shows its diverted kg",
    "24×7 vending machines pay ₹6/kg the moment you drop",
    "Deposit calculator + nearest-machine map and route",
  ], 0.7, 1.85, 6.6, 3.2)

  phone(s, "consumer-shop", 7.5, 1.9, 2.5)
  phone(s, "consumer-machines", 10.35, 1.9, 2.5)

  s.addText("Try it: sign up as a Consumer (any mobile + OTP 420420), or use +91 97400 00041", {
    x: 0.7, y: 6.7, w: 12, h: 0.35, fontSize: 11, color: THEME.emerald, bold: true, fontFace: F,
  })
}

/* ============================ 8 · WOMEN & LIVELIHOODS ============================ */
{
  const s = newSlide()
  header(s, "Impact with a human face", "Rural women are the heart of the loop", THEME.amber)

  s.addShape("roundRect", {
    x: 0.6, y: 1.85, w: 7.4, h: 4.7, rectRadius: 0.1,
    fill: { color: "FEF3C7" }, line: { color: "FDE68A", width: 1.2 },
  })
  s.addText("184 women", { x: 1.0, y: 2.05, w: 6.6, h: 0.7, fontSize: 30, bold: true, color: "B45309", fontFace: F })
  s.addText("employed across 14 self-help groups — sorting, spinning coir and pressing blocks. Steady, dignified income close to home.", {
    x: 1.0, y: 2.8, w: 6.6, h: 1.2, fontSize: 14, color: "92400E", fontFace: F, lineSpacing: 18, valign: "top",
  })
  s.addText("Fair, instant earnings", { x: 1.0, y: 4.15, w: 6.6, h: 0.4, fontSize: 16, bold: true, color: "B45309", fontFace: F })
  s.addText("Payouts land in UPI in real time — no cash cycles, no middlemen. Livelihoods that scale with the city.", {
    x: 1.0, y: 4.6, w: 6.6, h: 1.5, fontSize: 13, color: "92400E", fontFace: F, lineSpacing: 17, valign: "top",
  })

  const metrics = [
    { v: SHORT.format(12400), l: "coir blocks shipped" },
    { v: "14", l: "self-help groups" },
    { v: SHORT.format(292438), l: "kg CO₂ avoided" },
    { v: "100%", l: "traceable kg" },
  ]
  metrics.forEach((m, i) => {
    const x = 8.35 + (i % 2) * 2.2
    const y = 1.85 + Math.floor(i / 2) * 2.45
    s.addShape("roundRect", { x, y, w: 2.05, h: 2.1, rectRadius: 0.14, fill: { color: "FFFFFF" }, line: { color: "E2E8F0", width: 1 } })
    s.addText(m.v, { x: x + 0.2, y: y + 0.35, w: 1.65, h: 0.55, fontSize: 19, bold: true, color: THEME.emerald, fontFace: F, align: "center" })
    s.addText(m.l, { x: x + 0.2, y: y + 1.05, w: 1.65, h: 0.8, fontSize: 10.5, color: THEME.slate, fontFace: F, align: "center" })
  })
}

/* ============================ 9 · IMPACT METERS ============================ */
{
  const s = newSlide()
  header(s, "Tracked, priced, provable", "Your impact, live")

  const impact = [
    { v: "1,218,490", l: "kg recycled", d: "verified at weigh-in" },
    { v: "292,438", l: "kg CO₂ avoided", d: "methane never released" },
    { v: "4,873,960", l: "shells diverted", d: "from drains & dumps" },
    { v: "26", l: "machines live", d: "24×7 instant payouts" },
  ]
  impact.forEach((m, i) => {
    const x = 0.6 + i * 3.08
    s.addShape("roundRect", { x, y: 1.85, w: 2.9, h: 2.5, rectRadius: 0.12, fill: { color: "FFFFFF" }, line: { color: "D1FAE5", width: 1.2 } })
    s.addText(m.v, { x: x + 0.2, y: 2.0, w: 2.5, h: 0.6, fontSize: 21, bold: true, color: THEME.emerald, fontFace: F, align: "center" })
    s.addText(m.l, { x: x + 0.2, y: 2.62, w: 2.5, h: 0.4, fontSize: 12, bold: true, color: THEME.ink, fontFace: F, align: "center" })
    s.addText(m.d, { x: x + 0.2, y: 3.05, w: 2.5, h: 0.35, fontSize: 9.5, color: THEME.slate, fontFace: F, align: "center" })
  })

  s.addText("Impact you can touch — every order shows exactly how much waste it diverted:", {
    x: 0.6, y: 4.5, w: 6.6, h: 0.35, fontSize: 12, color: THEME.slate, italic: true, fontFace: F,
  })
  phone(s, "consumer-orders", 0.9, 4.85, 2.3)

  s.addShape("roundRect", {
    x: 4.0, y: 4.85, w: 8.7, h: 2.35, rectRadius: 0.12, fill: { color: THEME.inkDeep },
  })
  s.addText([
    { text: "Every kilo has an owner, a route,", options: { fontFace: F, fontSize: 22, bold: true, color: "FFFFFF", breakLine: true } },
    { text: "a price and a CO₂ ledger.", options: { fontFace: F, fontSize: 22, bold: true, color: "34D399" } },
  ], { x: 4.4, y: 5.3, w: 7.9, h: 1.5, valign: "middle", align: "center" })
}

/* ============================ 10 · TRY IT ============================ */
{
  const s = newSlide()
  header(s, "Try it in 60 seconds", "Out of the box. No setup, no keys.")

  s.addText("npm install && npm run dev  →  open http://localhost:3000", {
    x: 0.7, y: 1.75, w: 8.3, h: 0.5, fontSize: 13, bold: true, color: THEME.ink, fontFace: F,
    fill: { color: "E2E8F0" }, align: "center", valign: "middle",
  })

  const rows = [
    [
      { text: "Role", options: { bold: true, color: "FFFFFF", fill: { color: THEME.emerald }, align: "center" } },
      { text: "Demo phone (OTP 420420)", options: { bold: true, color: "FFFFFF", fill: { color: THEME.emerald }, align: "center" } },
    ],
    [{ text: "Generator · Temple" }, { text: "+91 97400 00001" }],
    [{ text: "Collector · Ravi" }, { text: "+91 97400 00011" }],
    [{ text: "Depot weighbridge" }, { text: "+91 97400 00021" }],
    [{ text: "Ops admin" }, { text: "+91 97400 00031" }],
    [{ text: "Consumer · Eco shopper" }, { text: "+91 97400 00041" }],
  ]
  s.addTable(rows, {
    x: 0.7, y: 2.5, w: 7.4, fontSize: 12, color: THEME.ink, fontFace: F,
    border: { pt: 0.5, color: "E2E8F0" }, rowH: 0.4, valign: "middle",
  })

  s.addText("Full walkthrough: docs/demo-script.md", {
    x: 0.7, y: 5.6, w: 7.4, h: 0.3, fontSize: 10.5, color: THEME.slate, italic: true, fontFace: F,
  })
  s.addText("github.com/Jagrithn/nariyalre", {
    x: 0.7, y: 6.0, w: 7.4, h: 0.4, fontSize: 12, bold: true, color: THEME.emerald, fontFace: F,
    hyperlink: { url: "https://github.com/Jagrithn/nariyalre" },
  })

  phone(s, "login", 9.1, 1.9, 3.0)
}

/* ============================ 11 · CLOSE ============================ */
{
  const s = newSlide(THEME.inkDeep)
  s.addShape("roundRect", { x: -1.6, y: 4.4, w: 7.0, h: 7.0, rectRadius: 0.5, fill: { color: "059669", transparency: 72 } })

  s.addText("Waste that works.", {
    x: 0.8, y: 2.1, w: 11.7, h: 1.2, fontSize: 56, bold: true, color: "FFFFFF", align: "center", fontFace: F,
  })
  s.addText("Urban waste, digitised, tracked and priced into a circular economy — with women at its centre.", {
    x: 0.8, y: 3.5, w: 11.7, h: 0.5, fontSize: 16, color: "A7F3D0", align: "center", fontFace: F,
  })

  const nextSteps = ["Go live on Supabase (schema + seed included)", "Plug a real UPI PSP into the payments seam", "Deploy vending machines & retail kiosks"]
  nextSteps.forEach((n, i) => {
    s.addShape("roundRect", { x: 1.6 + i * 3.55, y: 4.5, w: 3.3, h: 1.0, rectRadius: 0.5, fill: { color: "064E3B", transparency: 20 }, line: { color: "34D399", width: 0.5 } })
    s.addText(n, { x: 1.75 + i * 3.55, y: 4.65, w: 3.0, h: 0.75, fontSize: 11, color: "D1FAE5", fontFace: F, valign: "middle", align: "center" })
  })

  s.addText("Coco · github.com/Jagrithn/nariyalre", {
    x: 0.8, y: 6.4, w: 11.7, h: 0.4, fontSize: 11, color: "6EE7B7", align: "center", fontFace: F,
    hyperlink: { url: "https://github.com/Jagrithn/nariyalre" },
  })
}

pptx.writeFile({ fileName: OUT }).then(() => {
  console.log(`deck written to ${OUT}`)
})