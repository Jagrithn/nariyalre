# Coco — Waste that works

**Coco** (short for coconut) turns coconut waste into a tracked, priced, circular supply chain. Temples, markets and fruit stalls schedule pickups with one tap; collectors get routed jobs and earn per kilo; a depot turns shells into fiber, pith and cocopeat; and a consumer **marketplace** sells what the loop makes — while smart vending machines pay ordinary people to drop waste back in. Everything is tracked from the vendor to a B2B buyer.

It's an **offline-first PWA** that runs out of the box — no accounts, no API keys, no setup. Just run it and demo the whole city logistics graph with five roles.

---

## Why this exists

Chennai produces enormous amounts of coconut waste every day. Most of it ends up in landfills, where it smoulders and releases methane. The collectors who move it work informally — no routing, no fair weighing, no reliable payouts, no proof of impact.

Coco digitises the chain so **every kilo has an owner, a route, a price and a CO₂ ledger**.

---

## How it works

```
Generator ──1-tap request (GPS + slot)──▶ Collector ──routed + weighs in──▶ Depot
   ▲                                                                          │
   │                                                                          ▼
 notifications / live tracking                                fiber · shells · pith · cocopeat
                                                                │
                                                                ▼
                                              Distribution → B2B · self-help groups · in-house
```

- **Generator** asks for a pickup with a time slot; a collector is matched and routed.
- **Collector** sees jobs as a map sorted by distance, swipes to accept, follows a turn-by-turn route, then weighs the load at the depot.
- **Depot/Admin** weigh in batches, track yield across tiers, and dispatch cocopeat blocks.
- **Everyone** gets paid, notified, and shown the impact in kg + CO₂ — the whole time.

---

## Try it in 60 seconds

```bash
npm install
npm run dev
# open http://localhost:3000
```

Then sign in with any demo account. The mock OTP is always **420420**.

| Who logs in | Phone | What they see |
|---|---|---|
| **Generator · Temple** | `+919740000001` | 1-tap pickups, live impact, live tracking, notifications |
| **Collector · Ravi** | `+919740000011` | Job map, routed trips, UPI earnings |
| **Depot weighbridge** | `+919740000021` | Depot weigh-in & batches |
| **Ops admin** | `+919740000031` | Analytics, distribution |
| **Consumer · Eco shopper** | `+919740000041` | Marketplace, vending machines |

Want a guided walkthrough? See [`docs/demo-script.md`](./docs/demo-script.md) for a judge-ready 5-minute pitch.

> **Why do demo accounts exist?** Every screen works with zero configuration, so a demo never breaks because of a missing API key or flaky network.

---

## Features at a glance

### For generators
- One-tap pickup request with automatic GPS tagging
- Scheduling with time slots: Now · Morning (6–10) · Midday (10–2) · Afternoon (2–6) · Evening (6–10)
- Live impact dashboard — kg diverted, CO₂ saved, shells diverted
- A live tracking card: watch the collector's distance, ETA and progress on a mini-map
- Notification bell — accepted, loaded, delivered, payout credited, plus **slot reminders** 45 min before a scheduled window
- Works offline: requests queue on-device and catch up when you're back online

### For collectors
- Pending jobs on a map, sorted by how close they are
- Slot filters + smart bundling ("3 Midday jobs share an area — combined route recommended")
- Swipe-to-accept, then an immersive route view with OSRM driving directions
- Weigh-in at the depot, paid ₹2.5/kg, with a drop-off QR
- Trips history and an **Earnings** tab: balance, payout history (Pending / Paid / Rejected) and UPI withdrawal (min ₹50)

### For the depot & ops
- Admin dashboard with daily throughput, tier split, yield breakdown and cocopeat blocks
- Batch weigh-in and distribution dispatch logs
- Session-aware; sign out when done

### For consumers & the public
- **Marketplace**: shop products made from diverted coconut waste — planter pots, coir doormats, cocopeat blocks and more (demo checkout, no real payment)
- **Vending machines**: a map + list of 24×7 machines that pay ₹/kg for shells, pith and fibre the moment you drop them; a live deposit-earnings calculator
- **Orders**: status timeline from placed → delivered, with the kg diverted per order
- **Create an account**: sign up as Generator, Collector or Consumer with any mobile + OTP `420420`
- Role-gated homes — each role only ever sees its own workspace

---

## What's under the hood

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router, React 19, strict TypeScript) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Data | TanStack Query + Zustand (persisted, offline-capable) |
| "Backend" | Next.js Server Actions + a Supabase schema with RLS |
| Maps & routing | react-leaflet + OSRM driving directions (offline fallback) |
| Payments | UPI payouts through a swappable provider seam (sandbox by default) |
| Live tracking | Supabase Realtime when connected; simulated otherwise |
| PWA | next-pwa, installable, offline stores |

**Dual-mode design:** the app runs on in-memory mock data until you provide Supabase credentials — then it uses the real, RLS-secured database. The UI is identical either way.

---

## Contributing & quality

```bash
npx tsc --noEmit   # strict TypeScript check
npm run lint       # ESLint
npm run build      # production build (must pass before shipping)
```

---

## Going live

Want to connect the real backend?

1. Create a Supabase project.
2. Run `supabase/schema.sql`, then `supabase/seed.sql`.
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Enable the Twilio phone provider for real OTP; mock mode keeps `420420`.
5. Point the UPI provider in `src/lib/payments/psp.ts` at a real key.

Until then, everything runs in mock mode on purpose — identical experience, no setup.

## Status

- All five roles' core flows: **shipped and verified** (tsc / lint / build / smoke).
- v2 shipped: interactive landing page (impact counters, how-it-works, women-led making, product showcase, deposit calculator), the Consumer role (marketplace + vending machines + create-account + role gating).
- Extras shipped: scheduling + slot reminders, payments & UPI (sandbox), live tracking & notifications.
- Real backend, real OTP and real UPI: intentionally unplugged until you supply credentials.