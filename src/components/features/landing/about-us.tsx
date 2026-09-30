import { Building2, Briefcase, CloudSun, Leaf, Recycle, Users } from "lucide-react"

const STREAMS = [
  {
    icon: Building2,
    label: "INDUSTRY",
    title: "Materials with a next life",
    description: "Coir fibre and hard shells for packaging, composites, ropes and geotextiles.",
  },
  {
    icon: Users,
    label: "WOMEN’S SHGs",
    title: "Inputs for craft businesses",
    description: "Cleaned shells, combed fibre and toolkits for rural artisan collectives.",
  },
  {
    icon: Leaf,
    label: "GROWING",
    title: "Useful products for soil",
    description: "Washed pith becomes cocopeat blocks and organic compost for growers.",
  },
]

const SDGS = [
  {
    number: "12",
    goal: "Responsible Consumption and Production",
    target: "Target 12.5",
    color: "#BF8B2E",
    featured: true,
    icon: Recycle,
    description:
      "Keep more coconut biomass in use. Shells, fibre and pith become industrial feedstock, artisan inputs, cocopeat and compost.",
  },
  {
    number: "5",
    goal: "Gender Equality",
    target: "Target 5.5",
    color: "#E5243B",
    icon: Users,
    description:
      "Give women’s self-help groups steady access to materials, tools and design resources for artisan enterprise.",
  },
  {
    number: "8",
    goal: "Decent Work and Economic Growth",
    target: "Target 8.5",
    color: "#A21942",
    icon: Briefcase,
    description:
      "Support paid work across collection and processing through verified weights and more dependable procurement.",
  },
  {
    number: "11",
    goal: "Sustainable Cities and Communities",
    target: "Target 11.6",
    color: "#FD9D24",
    icon: Building2,
    description:
      "Organize scattered urban coconut waste collection to ease pressure on drains, dumps and local waste systems.",
  },
  {
    number: "13",
    goal: "Climate Action",
    target: "Target 13.3",
    color: "#3F7E44",
    icon: CloudSun,
    description:
      "Reduce open-air burning and make biomass diversion visible, building understanding of the climate and waste connection.",
  },
]

export function AboutUs() {
  return (
    <section
      id="about-us"
      aria-labelledby="about-us-title"
      className="scroll-mt-8 border-y bg-[#f5f4ec] text-[#183b30] dark:bg-[#101a16] dark:text-[#edf5ef]"
    >
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-end lg:gap-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
              About Coco
            </p>
            <h2 id="about-us-title" className="mt-3 max-w-xl text-3xl font-extrabold tracking-tight sm:text-4xl">
              We connect coconut waste to its next useful life.
            </h2>
          </div>
          <div className="space-y-3 text-sm leading-relaxed text-[#476257] dark:text-[#bdcec3]">
            <p>
              In cities, coconut shells and husks arrive in small daily batches from temples,
              juice stalls, street vendors and restaurants. Without organized collection, this
              tough-to-break-down material can clog drains, end up in dumps or be burned, while
              processors and village artisans struggle to get a dependable supply.
            </p>
            <p>
              Coco brings the chain together: local pickup, verified weighing and coordinated
              processing connect urban discards with industrial buyers, women-led self-help groups
              and growers.
            </p>
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-[2rem] bg-[#123b2e] p-5 text-white shadow-xl shadow-emerald-950/10 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-emerald-200">
                <Recycle className="size-4" aria-hidden="true" />
                <p className="text-[11px] font-bold uppercase tracking-[0.18em]">The circular model</p>
              </div>
              <h3 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">
                One collection network. Three useful next lives.
              </h3>
            </div>
            <p className="max-w-sm text-xs leading-relaxed text-emerald-100/75">
              Each stream connects the material to a buyer or maker who can put it back to work.
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {STREAMS.map((stream) => (
              <article key={stream.label} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex size-9 items-center justify-center rounded-xl bg-white/10 text-emerald-200">
                    <stream.icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="text-[9px] font-bold tracking-[0.16em] text-emerald-200/80">
                    {stream.label}
                  </span>
                </div>
                <h4 className="mt-4 text-sm font-bold">{stream.title}</h4>
                <p className="mt-1.5 text-xs leading-relaxed text-emerald-50/70">
                  {stream.description}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
                Our SDG alignment
              </p>
              <h3 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
                Circularity can move more than materials.
              </h3>
            </div>
            <p className="max-w-md text-xs leading-relaxed text-[#597166] dark:text-[#bdcec3]">
              Coco’s model is designed to support five UN Sustainable Development Goals—from
              responsible production to stronger livelihoods and cleaner cities.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {SDGS.map((sdg) => (
              <article
                key={sdg.number}
                className={`rounded-3xl border border-black/[0.06] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04] sm:p-6 ${
                  sdg.featured ? "sm:col-span-2 sm:p-7" : ""
                }`}
              >
                <div className={`flex gap-4 ${sdg.featured ? "sm:items-center sm:gap-6" : "items-start"}`}>
                  <span
                    className={`inline-flex shrink-0 items-center justify-center rounded-2xl text-white shadow-sm ${
                      sdg.featured ? "size-[4.5rem] text-3xl sm:size-20 sm:text-4xl" : "size-12 text-xl"
                    }`}
                    style={{ backgroundColor: sdg.color }}
                    aria-label={`Sustainable Development Goal ${sdg.number}`}
                  >
                    {sdg.number}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#6c7c72] dark:text-[#adbdaf]">
                        <sdg.icon className="size-3.5" style={{ color: sdg.color }} aria-hidden="true" />
                        SDG {sdg.number}
                      </span>
                      <span className="rounded-full bg-[#f2f3ed] px-2.5 py-1 text-[9px] font-semibold text-[#50645a] dark:bg-white/10 dark:text-[#d5e1d8]">
                        {sdg.target}
                      </span>
                    </div>
                    <h4 className="mt-1.5 text-base font-bold leading-snug sm:text-lg">{sdg.goal}</h4>
                    <p className="mt-2 text-xs leading-relaxed text-[#597166] dark:text-[#bdcec3]">
                      {sdg.description}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <p className="mt-4 text-[10px] leading-relaxed text-[#6c7c72] dark:text-[#9fb2a5]">
            SDG links describe the intended contribution of Coco’s model; progress should be
            reported with measured, verifiable outcomes.
          </p>
        </div>
      </div>
    </section>
  )
}
