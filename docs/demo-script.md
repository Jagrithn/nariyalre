# Coco — 5-Minute Demo Script

Timed, judge-ready walkthrough. Everything below runs **out of the box** in mock mode (`npm run dev`, no env vars, no network).

> Keep one browser tab per role. The **OTP is always `420420`** in mock mode.

---

## 0:00 — The hook (30 seconds)

> "Chennai produces tonnes of coconut waste a day from temples, markets and stalls. It goes to landfill and smoulders. The collectors who move it are informal — no routing, no fair pay, no proof of impact. Coco turns that waste into a tracked, priced, circular supply chain."

**Show** the landing page (`/`). Tap through the **impact counters**, the **how-it-works** circle, the **women-led making** section, the **products showcase**, and the **deposit calculator**. Point out: generator → collector → depot → distribution → shop & earn.

---

## 0:30 — Generator (60 seconds)

1. Open `/login`, enter `+919740000001` (or tap the "Generator · Temple" chip), OTP `420420`. → **Generator PWA**.
2. Big green button → request a pickup, pick the **Midday 10–2** slot, submit.
3. Show **impact meter**: kg diverted, CO₂ saved, shells diverted.
4. Notice the **notification bell** — a "Pickup window opens soon" reminder appears the moment a scheduled slot's window is near.
5. Since there's already an *accepted* job in the demo seed, scroll and show the **Live tracking card**: pulsing "Live · Ravi Shankar", mini-map, distance, ETA, progress bar.

> Line: *"Every request is GPS-tagged and queued offline — because a temple vendor doesn't have great connectivity."*

---

## 1:30 — Collector (90 seconds)

1. Navigate to `/login` again and sign in as `+919740000011` (tap "Collector · Ravi", OTP `420420`).
2. Job map, sorted by distance. Flip the **slot filter chips** and point out the **bundling hint** ("3 Midday jobs share an area — combined route recommended").
3. **Swipe-to-accept** a job → immersive route view with the two legs (→ vendor, → depot), OSRM driving directions, live GPS pin.
4. Tap **"Mark pickup loaded"** → then enter weighed kg and **"Confirm weigh-in & complete"**.
5. Show the trip now appears under **Trips**, and the generator just got a *"Drop-off completed"* notification.

> Line: *"The collector gets paid per kilo measured at the depot — not per promise."*

---

## 3:00 — Earnings & UPI (45 seconds)

1. **Earnings** tab: balance, earnings breakdown per trip.
2. Add a **UPI ID**, hit **Withdraw** (min ₹50) → payout goes *Pending* → flips to *Paid* with a reference, and a **"Payout credited"** notification is pushed.

> Line: *"Sandbox UPI by design — we can plug a real PSP into the seam `src/lib/payments/psp.ts` in a day."*

---

## 3:30 — Consumer marketplace & vending machines (75 seconds)

1. From `/login`, tap **"Create an account"** → role **Consumer** → any name + `+919740000041`, OTP `420420`. (Or tap the "Consumer · Eco shopper" chip.)
2. **Shop** (`/consumer`): browse coconut-made products — planter pots, doormats, cocopeat blocks. Add a couple to the basket.
3. Open **View basket** → adjust quantities, add a delivery note, tap **"Place order (demo checkout)"** → order lands in **Orders** with a *placed → delivered* timeline and "diverted X kg".
4. **Machines** (`/consumer/machines`): slide the **deposit calculator** (0.5–5 kg) to show instant payout; flip to **Map** to see the 6 vending machines + nearest route.
5. Show role gating: as a consumer you *never* see collector or admin screens.

> Line: *"The same loop pays everyone — drop waste in a machine, buy what the waste becomes."*

---

## 4:45 — Admin (45 seconds)

1. Navigate to `/login`, sign in as `+919740000031` (tap "Ops admin", OTP `420420`) → **Dashboard** (`/admin`): daily throughput, tier split, yield breakdown (fiber/shells/pith/cocopeat), cocopeat blocks.
2. **Depot** (`/admin/depot`): weigh-in a batch.
3. **Distribution** (`/admin/distribution`): dispatch a cocopeat lot to a tier.

> Line: *"Every kg is traceable from the temple to a B2B buyer or a self-help group."*

---

## 5:30 — Economics & close (30 seconds)

> "The numbers add up:
> collector paid ₹2.5/kg at the depot;
> each kg diverts 0.24 kg of CO₂;
> shells become fiber, pith and cocopeat blocks that go back to B2B and community.
> A market the city already has — just digitised, tracked and priced."

Final line: **"Waste that works."**

---

## Q&A — talking points

| Question | Answer |
|---|---|
| Is this real data? | Runs in mock mode for a bulletproof offline demo; flip one env var + run `schema.sql`/`seed.sql` to go live on Supabase (RLS-secured). |
| Real UPI? | Sandbox by default; PSP seam (`psp.ts`) accepts a provider key. |
| Live tracking real? | Yes with Supabase Realtime (real GPS from the collector); simulated movement otherwise so the demo always works. |
| Auth? | OTP login, demo code `420420`; Supabase phone auth (OTP/SMS) when live. |
| Offline? | Pickups queue in persisted stores (`coco-generator-pickups` etc.) and reconcile when online. |
| Routing? | OSRM driving directions with a direct-line fallback offline. |
| Vending machines real? | Simulated with mock machines + payout data for the demo; the schema/seed includes `vending_machines` so real devices can be plugged in. |