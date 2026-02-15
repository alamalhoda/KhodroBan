/**
 * لیست نام آیکون‌های Font Awesome را از metadata محلی (Pro 7.1.0) می‌خواند و در config ذخیره می‌کند.
 * اجرا: node scripts/generate-fa-icon-names.js
 * وابسته به شبکه نیست؛ از public/fontawesome-pro-7.1.0-web/metadata/icons.json (یا icons.yml) استفاده می‌کند.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const METADATA_DIR = path.join(__dirname, '../public/fontawesome-pro-7.1.0-web/metadata')
const ICONS_JSON = path.join(METADATA_DIR, 'icons.json')
const ICONS_YML = path.join(METADATA_DIR, 'icons.yml')
const OUT_PATH = path.join(__dirname, '../src/config/fontAwesomeIconNames.js')

/** فقط آیکون‌هایی که در استایل duotone موجودند (همان build پروژه). */
const DUOTONE_ONLY = true

async function loadIcons() {
  if (fs.existsSync(ICONS_JSON)) {
    const raw = fs.readFileSync(ICONS_JSON, 'utf8')
    return JSON.parse(raw)
  }
  if (fs.existsSync(ICONS_YML)) {
    const yaml = await import('js-yaml')
    const raw = fs.readFileSync(ICONS_YML, 'utf8')
    return yaml.load(raw)
  }
  return null
}

async function main() {
  const icons = await loadIcons()
  if (!icons || typeof icons !== 'object') {
    console.error('Metadata not found. Add icons.json or icons.yml to:', METADATA_DIR)
    process.exit(1)
  }

  let names = Object.keys(icons).filter((k) => typeof k === 'string' && k.length > 0)

  if (DUOTONE_ONLY) {
    names = names.filter((name) => {
      const meta = icons[name]
      const styles = meta?.styles
      return Array.isArray(styles) && styles.includes('duotone')
    })
  }

  names.sort((a, b) => a.localeCompare(b, 'en'))

  const source = fs.existsSync(ICONS_JSON) ? 'icons.json' : 'icons.yml'
  const content = `/**
 * لیست نام آیکون‌های Font Awesome (برای انتخاب در فرم خودرو).
 * با اسکریپت scripts/generate-fa-icon-names.js از metadata محلی Pro 7.1.0 تولید شده (${source}).
 * ${DUOTONE_ONLY ? 'فقط آیکون‌های موجود در استایل duotone.' : 'همه آیکون‌ها.'}
 */
export const ALL_FONT_AWESOME_ICON_NAMES = ${JSON.stringify(names, null, 0)}
`

  fs.writeFileSync(OUT_PATH, content, 'utf8')
  console.log(`Written ${names.length} icon names to ${OUT_PATH} (from ${source})`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
