import sharp from 'sharp'
import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const svgPath = join(root, 'public', 'favicon.svg')
const icoPath = join(root, 'public', 'favicon.ico')

const sizes = [16, 32, 48, 64, 128, 256]
const svgBuffer = readFileSync(svgPath)

const pngs = await Promise.all(
  sizes.map(size =>
    sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toBuffer()
  )
)

// ICO format: ICONDIR + N * ICONDIRENTRY + N * PNG data
const headerSize = 6
const entrySize = 16
const dirSize = headerSize + entrySize * sizes.length

let offset = dirSize
const entries = pngs.map((png, i) => {
  const size = sizes[i]
  const entry = { size, png, offset }
  offset += png.length
  return entry
})

// ICONDIR: reserved(2)=0, type(2)=1 (icon), count(2)
const dir = Buffer.alloc(dirSize)
dir.writeUInt16LE(0, 0)
dir.writeUInt16LE(1, 2)
dir.writeUInt16LE(sizes.length, 4)

entries.forEach(({ size, png, offset }, i) => {
  const base = headerSize + i * entrySize
  dir.writeUInt8(size === 256 ? 0 : size, base)      // width (0 = 256)
  dir.writeUInt8(size === 256 ? 0 : size, base + 1)  // height (0 = 256)
  dir.writeUInt8(0, base + 2)                         // color count
  dir.writeUInt8(0, base + 3)                         // reserved
  dir.writeUInt16LE(1, base + 4)                      // planes
  dir.writeUInt16LE(32, base + 6)                     // bpp
  dir.writeUInt32LE(png.length, base + 8)             // data size
  dir.writeUInt32LE(offset, base + 12)                // data offset
})

const ico = Buffer.concat([dir, ...pngs.map(e => e)])
writeFileSync(icoPath, ico)
console.log(`Written ${icoPath} (${ico.length} bytes, ${sizes.length} PNG entries)`)
