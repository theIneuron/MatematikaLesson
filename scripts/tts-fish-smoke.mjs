// Проверка боевой озвучки Fish Audio, без браузера и без деплоя.
//
//   node scripts/tts-fish-smoke.mjs
//
// Ключи читает из .env.local (или из окружения). Синтезирует по одной короткой
// фразе на каждую комбинацию язык × пол, кладёт mp3 в .tmp/tts-smoke/ и печатает
// таблицу: какой голос выбран, сколько символов ушло в счёт, сколько байт пришло.
// Молчание урока на сайте почти всегда видно уже здесь.

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { synthesize, detectLang, pickVoice } from '../api/_fish.js'

const OUT_DIR = '.tmp/tts-smoke'

// Фразы взяты в том виде, в каком их шлёт урок: без кавычек, без тире, дроби словами.
const CASES = [
  { name: 'ru-m', g: 'm', text: 'Привет. Сегодня мы разберём, как складывать дроби с разными знаменателями.' },
  { name: 'ru-f', g: 'f', text: 'Молодец. Одна вторая больше, чем одна третья, потому что доля крупнее.' },
  { name: 'uz-m', g: 'm', text: "Salom. Bugun biz maxrajlari xar xil kasrlarni qanday qo'shishni ko'rib chiqamiz." },
  { name: 'uz-f', g: 'f', text: "Juda soz. Bir ikkidan bir uchdandan katta, chunki ulush yirikroq." },
]

async function loadEnvLocal() {
  for (const file of ['.env.local', '.env']) {
    let raw
    try { raw = await readFile(file, 'utf8') } catch { continue }
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/)
      if (!m) continue
      const value = m[2].trim().replace(/^["']|["']$/g, '')
      if (!process.env[m[1]]) process.env[m[1]] = value
    }
    console.log(`переменные взяты из ${file}`)
  }
}

await loadEnvLocal()

if (!(process.env.FISH_API_KEY || '').trim()) {
  console.error('FISH_API_KEY не задан. Положи его в .env.local (в git этот файл не идёт).')
  process.exit(1)
}

await mkdir(OUT_DIR, { recursive: true })
console.log(`модель: ${process.env.FISH_MODEL || 's2.1-pro'}, скорость: ${Number(process.env.FISH_SPEED) || 1}\n`)

let failed = 0
for (const c of CASES) {
  const lang = detectLang(c.text)
  const voice = pickVoice(process.env, lang, c.g)
  const started = Date.now()
  const out = await synthesize(process.env, { text: c.text, gender: c.g })
  const ms = Date.now() - started

  if (!out.ok) {
    failed += 1
    console.log(`[ОТКАЗ] ${c.name}  lang=${lang}  голос=${voice ? voice.from : 'НЕ ЗАДАН'}  ${out.status}: ${out.reason}`)
    continue
  }
  const file = `${OUT_DIR}/${c.name}.mp3`
  await writeFile(file, out.audio)
  console.log(`[ok]    ${c.name}  lang=${out.lang}  голос=${out.voice.from}  символов=${out.chars}  ${out.audio.length} байт  ${ms} мс  -> ${file}`)
}

console.log(
  failed
    ? `\nПровалов: ${failed}. Пока они есть, на сайте эти сегменты будут молчать.`
    : '\nВсе комбинации озвучены. Послушай mp3 в .tmp/tts-smoke — особенно узбекские.',
)
process.exit(failed ? 1 : 0)
