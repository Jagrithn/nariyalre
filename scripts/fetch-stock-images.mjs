import { mkdirSync, writeFileSync, existsSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "images")
mkdirSync(OUT_DIR, { recursive: true })

const SUBJECTS = [
  [["grove"], "coconut grove"],
  [["shg-craft"], "coir rope weaving"],
  [["deposit"], "coconut seller vendor"],
  [["roles-temple"], "hindu temple india"],
  [["roles-depot"], "weighbridge truck weighing"],
  [["roles-ops"], "coconut fiber processing factory"],
  [["machine-a"], "coconut drink stall"],
  [["machine-b"], "coconut market stall"],
  [["generator-hero"], "coconut husk pile"],
  [["collector-hero"], "rickshaw loaded with load india"],
  [["avatar-admin"], "portrait indian woman"],
  [["empty-basket"], "basket with vegetables market"],
  [["step-handoff"], "hands holding coconut"],
  [["step-truck"], "delivery truck india"],
  [["step-press"], "industrial pressing machine"],
  [["step-shop"], "handicraft shop india"],
]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function commonsCandidates(term) {
  const api = "https://commons.wikimedia.org/w/api.php"
  const qs = new URLSearchParams({
    action: "query",
    format: "json",
    generator: "search",
    gsrsearch: term,
    gsrlimit: "8",
    gsrnamespace: "6",
    prop: "imageinfo",
    iiprop: "url|size|mime",
    iiurlwidth: "1600",
    origin: "*",
  })
  const res = await fetch(`${api}?${qs}`)
  if (!res.ok) throw new Error(`api -> HTTP ${res.status}`)
  const j = await res.json()
  const pages = Object.values(j.query?.pages ?? {})
  return pages
    .filter((p) => p.imageinfo?.[0]?.mime === "image/jpeg")
    .map((p) => p.imageinfo[0])
    .filter((i) => i.width && i.height && i.width / i.height > 0.4 && i.width / i.height < 3.5)
    .map((i) => ({ url: (i.thumburl ?? i.url).split("?")[0], w: i.thumbwidth ?? i.width, h: i.height, ratio: i.width / i.height }))
}

async function download(file, url) {
  const target = join(OUT_DIR, `${file}.jpg`)
  if (existsSync(target)) {
    console.log(`skip  ${file}.jpg (exists)`)
    return true
  }
  const res = await fetch(url, { headers: { "user-agent": "CocoBuildBot/1.0" } })
  if (!res.ok) throw new Error(`download ${url} -> HTTP ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  if (buf.length < 15000) throw new Error(`download too small (${buf.length}b)`)
  writeFileSync(target, buf)
  console.log(`ok    ${file}.jpg (${(buf.length / 1024).toFixed(0)} KB)`)
  return true
}

for (const [files, term] of SUBJECTS) {
  try {
    const cands = await commonsCandidates(term)
    let got = false
    for (const c of cands.slice(0, 5)) {
      try {
        for (const f of files) await download(f, c.url)
        got = true
        break
      } catch (err) {
        console.log(`  retry next for "${term}" (${err.message})`)
      }
    }
    if (!got) console.error(`FAIL  "${term}" :: no usable image`)
  } catch (err) {
    console.error(`FAIL  "${term}" :: ${err.message}`)
  }
  await sleep(400)
}

console.log("done")