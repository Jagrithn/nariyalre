import { deflateSync } from "node:zlib"
import { writeFileSync, mkdirSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const outDir = join(here, "..", "public", "icons")
mkdirSync(outDir, { recursive: true })

function crc32(buf) {
  let c
  let table = crc32.table
  if (!table) {
    crc32.table = table = []
    for (let n = 0; n < 256; n++) {
      c = n
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
      table[n] = c >>> 0
    }
  }
  c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const typeBuf = Buffer.from(type, "ascii")
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])))
  return Buffer.concat([len, typeBuf, data, crc])
}

function encodePng(size, rgba) {
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8
  ihdr[9] = 6
  const raw = Buffer.alloc(size * (size * 4 + 1))
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0
    const row = Buffer.from(rgba.buffer, y * size * 4, size * 4)
    row.copy(raw, y * (size * 4 + 1) + 1)
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ])
}

const emerald = [5, 150, 105]
const skin = [124, 74, 30]
const skinDark = [94, 56, 22]
const highlight = [148, 92, 44]
const eye = [58, 36, 12]

function draw(size, maskable) {
  const px = new Uint8Array(size * size * 4)
  const cx = size / 2
  const cy = size * 0.57
  const r = size * (maskable ? 0.24 : 0.3)
  const er = r * 0.09
  const bg = emerald
  const eyes = [
    [cx - r * 0.32, cy + r * 0.62],
    [cx, cy + r * 0.72],
    [cx + r * 0.32, cy + r * 0.62],
  ]

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4
      px[i] = bg[0]
      px[i + 1] = bg[1]
      px[i + 2] = bg[2]
      px[i + 3] = 255

      const dx = x - cx
      const dy = y - cy
      const d = Math.sqrt(dx * dx + dy * dy)
      if (d <= r) {
        const edge = d > r * 0.86
        const light = !edge && dx < -r * 0.2 && dy < -r * 0.3
        const col = edge
          ? skinDark
          : light
            ? highlight
            : skin
        px[i] = col[0]
        px[i + 1] = col[1]
        px[i + 2] = col[2]
        px[i + 3] = 255
        continue
      }

      for (const [ex, ey_] of eyes) {
        if ((x - ex) ** 2 + (y - ey_) ** 2 <= er * er) {
          const base = (x - ex) ** 2 + (y - ey_) ** 2 <= (er * 0.45) ** 2
            ? eye
            : skinDark
          px[i] = base[0]
          px[i + 1] = base[1]
          px[i + 2] = base[2]
          px[i + 3] = 255
        }
      }
    }
  }
  return px
}

const out = {
  192: draw(192, false),
  512: draw(512, false),
  "maskable-512": draw(512, true),
}

for (const [name, px] of Object.entries(out)) {
  const size = Number(name.split("-")[0]) || 512
  writeFileSync(join(outDir, `icon-${name}.png`), encodePng(size, px))
  console.log(`generated icon-${name}.png`)
}