// Поиск голоса в библиотеке Fish Audio по названию — чтобы взять reference_id
// не из адресной строки, а списком, с языками и автором.
//
//   node scripts/fish-find-voice.mjs Бурунов
//   node scripts/fish-find-voice.mjs Burunov
//
// Ключ читает из .env.local (или из окружения). Символы не расходуются: это
// запрос к каталогу моделей, а не синтез.

import { readFile } from 'node:fs/promises'

const query = process.argv.slice(2).join(' ').trim()

async function loadEnvLocal() {
  for (const file of ['.env.local', '.env']) {
    let raw
    try { raw = await readFile(file, 'utf8') } catch { continue }
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/)
      if (!m) continue
      if (!process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '')
    }
  }
}

await loadEnvLocal()

const key = (process.env.FISH_API_KEY || '').trim()
if (!key) {
  console.error('FISH_API_KEY не задан. Положи его в .env.local.')
  process.exit(1)
}
if (!query) {
  console.error('Укажи, что искать: node scripts/fish-find-voice.mjs Бурунов')
  process.exit(1)
}

async function ask(params, label) {
  const url = new URL('https://api.fish.audio/model')
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
  const res = await fetch(url, { headers: { Authorization: `Bearer ${key}` } })
  if (!res.ok) {
    console.error(`${label}: Fish Audio ${res.status}: ${(await res.text()).slice(0, 300)}`)
    return []
  }
  return (await res.json()).items || []
}

const needle = query.toLowerCase()
const match = (m) => String(m.title || '').toLowerCase().includes(needle)

// Ищем в двух местах. Голос, добавленный в свой список или сделанный самому,
// в общей библиотеке по названию может не находиться — тогда его отдаёт self.
const [library, own] = await Promise.all([
  ask({ title: query, page_size: '15' }, 'библиотека'),
  ask({ self: 'true', page_size: '100' }, 'свои голоса'),
])

const rows = [
  ...own.filter(match).map((m) => ({ m, where: 'свой' })),
  ...library.filter((m) => !own.some((o) => o._id === m._id)).map((m) => ({ m, where: 'библиотека' })),
]

if (!rows.length) {
  console.log(`По запросу «${query}» ничего не найдено.`)
  console.log('Что попробовать: другое написание (Burunov / Бурунов), либо взять id из адреса')
  console.log('страницы голоса на fish.audio — это часть после /m/.')
  process.exit(0)
}

console.log(`Найдено ${rows.length}. reference_id — первая колонка.\n`)
for (const { m, where } of rows) {
  const langs = (m.languages || []).join('/') || '—'
  const author = (m.author && (m.author.nickname || m.author._id)) || '—'
  console.log(
    `${m._id}  ${String(m.title || '').slice(0, 38).padEnd(38)}  ${where.padEnd(10)} ` +
    `языки: ${langs.padEnd(10)} автор: ${String(author).slice(0, 18).padEnd(18)} лайков: ${m.like_count ?? 0}`,
  )
}
console.log('\nНужный id вписывается в FISH_VOICE_M (в .env.local и в переменные Vercel).')
