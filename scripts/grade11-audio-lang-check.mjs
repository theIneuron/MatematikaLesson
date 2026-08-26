// Grade 11: tekshiruv — OVOZ va KADR.
//
// Ikki savolga javob beradi (metodist topshirig'i 2026-08-11):
//   1) uch til bir-biriga ARALASHMAYAPTIMI (kirill uz/en da, lotin ru da,
//      nusxa-ko'chirma, uz apostrof, ruscha o'tgan zamon jinsi);
//   2) kadr ovoz bilan MOS kelayaptimi (holds jadvali har bir tilda: kadr
//      gapdan qisqa bo'lsa ochilish gapni quvib yetadi, uzun bo'lsa jimlik).
//
// Fayl AST bo'yicha o'qiladi (acorn + acorn-jsx), regex bilan emas: `A(...)`
// chaqiruvlari va `holds` jadvali aynan o'sha ekran ichidan olinadi.
//
//   node scripts/grade11-audio-lang-check.mjs
//   node scripts/grade11-audio-lang-check.mjs --file src/components/grade11/Dars12.jsx

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as acorn from 'acorn'
import jsx from 'acorn-jsx'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const argFile = (() => {
  const i = process.argv.indexOf('--file')
  return i !== -1 ? process.argv[i + 1] : 'src/components/grade11/Dars12.jsx'
})()
const FILE = path.resolve(ROOT, argFile)

// ============================================================
// core.jsx dagi baho — AYNAN o'sha formula. O'zgarsa, bu yer ham o'zgaradi.
// ============================================================
const estimateSpeech = (text) => {
  const words = String(text || '').trim().split(/\s+/).filter(Boolean).length
  return Math.min(30000, Math.max(1600, 900 + words * 400))
}

// ============================================================
// AST
// ============================================================
const Parser = acorn.Parser.extend(jsx())
const src = fs.readFileSync(FILE, 'utf8')
const ast = Parser.parse(src, { ecmaVersion: 'latest', sourceType: 'module', locations: true })

const lineOf = (node) => node.loc.start.line
const isCall = (n, name) => n && n.type === 'CallExpression' && n.callee.type === 'Identifier' && n.callee.name === name
const strOf = (n) => {
  if (!n) return null
  if (n.type === 'Literal' && typeof n.value === 'string') return n.value
  if (n.type === 'TemplateLiteral' && n.expressions.length === 0) return n.quasis.map((q) => q.value.cooked).join('')
  return null
}

const walk = (node, fn, parent = null) => {
  if (!node || typeof node.type !== 'string') return
  fn(node, parent)
  for (const key of Object.keys(node)) {
    if (key === 'loc' || key === 'range') continue
    const v = node[key]
    if (Array.isArray(v)) v.forEach((c) => c && typeof c.type === 'string' && walk(c, fn, node))
    else if (v && typeof v.type === 'string') walk(v, fn, node)
  }
}

// L(uz, ru, en) — ekran matni ham, ovoz ham shu orqali yoziladi.
const readL = (node) => {
  if (!isCall(node, 'L')) return null
  const [uz, ru, en] = node.arguments.map(strOf)
  if (uz === null && ru === null && en === null) return null
  return { uz, ru, en, line: lineOf(node) }
}

// Ekranlar: `const S12 = { ... }`
const screens = []
for (const node of ast.body) {
  if (node.type !== 'VariableDeclaration') continue
  for (const d of node.declarations) {
    if (!d.id || d.id.type !== 'Identifier' || !/^S\d+$/.test(d.id.name)) continue
    if (!d.init || d.init.type !== 'ObjectExpression') continue
    const screen = { name: d.id.name, num: Number(d.id.name.slice(1)), line: lineOf(d), audio: [], holds: null, holdsLine: 0 }
    for (const p of d.init.properties) {
      if (p.type !== 'Property' || !p.key) continue
      const key = p.key.name || p.key.value
      if (key === 'audio' && p.value.type === 'ArrayExpression') {
        p.value.elements.forEach((el, i) => {
          if (!isCall(el, 'A')) return
          const on = strOf(el.arguments[0])
          const [uz, ru, en] = el.arguments.slice(1).map(strOf)
          screen.audio.push({ i, on, uz, ru, en, line: lineOf(el) })
        })
      }
      if (key === 'holds' && p.value.type === 'ArrayExpression') {
        screen.holdsLine = lineOf(p.value)
        screen.holds = p.value.elements.map((el) => (el && el.type === 'Literal' ? el.value : null))
      }
    }
    screens.push(screen)
  }
}
screens.sort((a, b) => a.num - b.num)

// Butun fayl bo'yicha barcha L(...) — ekran matnining til tekshiruvi uchun.
const allL = []
walk(ast, (n) => { const r = readL(n); if (r) allL.push(r) })

// GAPIRILADIGAN maydonlar. `useAnswerFx` javobdan keyin `audio.say(t(hint))`
// chaqiradi, ya'ni izoh va maqtov ham OVOZ. Demak ularga ham ovoz qoidalari
// tegishli: belgi emas, so'z. Bu maydonlar `audio:` massivida turmaydi,
// shuning uchun alohida yig'iladi.
const SPOKEN_KEYS = new Set(['ok', 'hint', 'checkNote', 'needHint', 'afterPredict'])
const spoken = new Map()
walk(ast, (n) => {
  if (n.type !== 'Property' || !n.key) return
  const key = n.key.name || n.key.value
  const take = (node, where) => { const r = readL(node); if (r) spoken.set(r.line + ':' + where, { ...r, where }) }
  if (SPOKEN_KEYS.has(key)) take(n.value, key)
  // `hints: { a: L(...), b: L(...) }` — AuditRows shu ko'rinishda beradi.
  if (key === 'hints' && n.value.type === 'ObjectExpression') {
    n.value.properties.forEach((q) => { if (q.type === 'Property') take(q.value, 'hints.' + (q.key.name || q.key.value)) })
  }
})

// ============================================================
// TIL FILTRLARI
// ============================================================
const CYR = /[Ѐ-ӿ]/
// Ruscha matnda uchrashi mumkin bo'lgan lotin: matematik belgi yo'q (ovoz
// so'z bilan yoziladi), shuning uchun uch harfdan uzun lotin bo'lagi shubhali.
const LAT_RUN = /[A-Za-z][A-Za-z'’ʻ`]{2,}/g
const LAT_OK = new Set(['log', 'ln', 'sin', 'cos', 'tg', 'ctg', 'max', 'min',
  // Koordinata tekisliklarining nomlari ruscha matnda ham LOTIN yoziladi --
  // darslikda ham shunday («плоскость Oxy»). O'q nomlari `Ox`, `Oy`, `Oz`
  // ikki harfdan iborat va qidiruvga tushmaydi, tekisliklar esa uchtadan.
  'oxy', 'oyz', 'oxz'])
// O'zbekcha marker so'zlar — ular ruscha yoki inglizcha bo'lakka tushmasin.
// `argument` bu ro'yxatda YO'Q: u inglizchada ham xuddi shunday yoziladi.
const UZ_WORDS = /\b(va|bu|shu|uchun|demak|yechim|asos|logarifm|tengsizlik|nuqta|son|bo'l\w*|qil\w*|kerak|hamma|qaysi|birinchi|ikkinchi|uchinchi|to'g'ri|noto'g'ri|siz|sizga|yana|endi)\b/gi
// Inglizcha marker so'zlar — ular ruscha yoki o'zbekcha bo'lakka tushmasin.
const EN_WORDS = /\b(the|and|is|are|we|you|not|base|point|answer|solution|logarithm|inequality|argument|correct|wrong|first|second|third|now|again)\b/gi
// UZ apostrof — FAQAT ASCII '. Boshqasi so'zni buzadi va TTS boshqa o'qiydi.
const BAD_APOS = /[ʻ’‘`´]/g
// Ruscha o'tgan zamon: jinssiz shakl talab qilinadi (metodist qoidasi).
// DIQQAT: JS da `\b` — ASCII chegara va KIRILL bilan ishlamaydi. «ты нашёл»
// da bo'sh joy ham, «н» ham ASCII uchun so'z belgisi emas — chegara topilmaydi
// va qidiruv JIM qoladi. Chegara aniq kirill sinfi bilan yozilgan.
const RU_MASC = /(?<![а-яёА-ЯЁ])(?:нашёл|нашел|увидел|сделал|решил|понял|заметил|получил|выбрал|проверил|записал|смог|взял|подставил|доказал|сказал|показал|прошёл|прошел|начал|закончил|ошибся|справился|молодец)(?![а-яёА-ЯЁ])/gi
const RU_FEM = /(?<![а-яёА-ЯЁ])(?:нашла|увидела|сделала|решила|поняла|заметила|получила|выбрала|проверила|записала|смогла|взяла|подставила|доказала|сказала|показала|прошла|начала|закончила|ошиблась|справилась)(?![а-яёА-ЯЁ])/gi
// Umumiy naqsh: «ты …л / …ла» — jinsi bor o'tgan zamon. Ro'yxatga kirmagan
// fe'llarni ham tutadi («ты предполагал»).
const RU_YOU_PAST = /(?<![а-яёА-ЯЁ])ты\s+(?:не\s+|уже\s+|сам\s+|тоже\s+)*[а-яё]{3,}(?:лся|лась|ла|л)(?![а-яёА-ЯЁ])/gi
// Ovozda belgi bo'lmaydi — hammasi so'z bilan.
const BAD_SYMBOLS = /[%$×÷=<>✗«»""„—–]|(?<![0-9])\/(?![0-9])/g

const findings = []
const push = (level, line, code, msg) => findings.push({ level, line, code, msg })

const clip = (s, n = 90) => (s.length > n ? s.slice(0, n) + '…' : s)

const checkTriple = (where, line, uz, ru, en) => {
  // 1. To'liqlik
  if (!uz || !uz.trim()) push('ERR', line, 'LANG-EMPTY', `${where}: uz bo'sh`)
  if (!ru || !ru.trim()) push('ERR', line, 'LANG-EMPTY', `${where}: ru bo'sh`)
  if (!en || !en.trim()) push('ERR', line, 'LANG-EMPTY', `${where}: en bo'sh`)
  if (!uz || !ru || !en) return

  // 2. Kirill — uz va en da BO'LMASIN
  if (CYR.test(uz)) push('ERR', line, 'CYR-IN-UZ', `${where}: uz da kirill — "${clip(uz)}"`)
  if (CYR.test(en)) push('ERR', line, 'CYR-IN-EN', `${where}: en da kirill — "${clip(en)}"`)

  // 3. Lotin — ruscha bo'lakda
  const lat = (ru.match(LAT_RUN) || []).filter((w) => !LAT_OK.has(w.toLowerCase()))
  if (lat.length) push('ERR', line, 'LAT-IN-RU', `${where}: ru da lotin so'z — ${lat.join(', ')}`)

  // 4. Til markerlari boshqa tilda
  const uzInRu = [...new Set((ru.match(UZ_WORDS) || []))]
  if (uzInRu.length) push('ERR', line, 'UZ-IN-RU', `${where}: ru da o'zbekcha so'z — ${uzInRu.join(', ')}`)
  const uzInEn = [...new Set((en.match(UZ_WORDS) || []))].filter((w) => !/^(is|are|the|and)$/i.test(w))
  if (uzInEn.length) push('WARN', line, 'UZ-IN-EN', `${where}: en da o'zbekcha so'z bo'lishi mumkin — ${uzInEn.join(', ')}`)
  const enInUz = [...new Set((uz.match(EN_WORDS) || []))].filter((w) => !/^(va|argument|logarifm)$/i.test(w))
  if (enInUz.length) push('WARN', line, 'EN-IN-UZ', `${where}: uz da inglizcha so'z — ${enInUz.join(', ')}`)
  const enInRu = [...new Set((ru.match(EN_WORDS) || []))]
  if (enInRu.length) push('ERR', line, 'EN-IN-RU', `${where}: ru da inglizcha so'z — ${enInRu.join(', ')}`)

  // 5. Nusxa-ko'chirma: uch til bir xil matn bo'lolmaydi.
  // Bir so'zli xalqaro yorliq (BONUS, LIFEHACK) — istisno, u tarjima qilinmaydi.
  const norm = (s) => s.replace(/\s+/g, ' ').trim().toLowerCase()
  const label = (s) => s.trim().split(/\s+/).length === 1
  if (norm(uz) === norm(ru)) push('ERR', line, 'SAME-UZ-RU', `${where}: uz va ru bir xil`)
  if (norm(uz) === norm(en) && !label(uz)) push('ERR', line, 'SAME-UZ-EN', `${where}: uz va en bir xil`)
  if (norm(ru) === norm(en) && !label(ru)) push('ERR', line, 'SAME-RU-EN', `${where}: ru va en bir xil`)

  // 6. UZ apostrof
  const apos = uz.match(BAD_APOS)
  if (apos) push('ERR', line, 'UZ-APOS', `${where}: uz da noto'g'ri apostrof (${[...new Set(apos)].join(' ')}) — ASCII ' kerak`)
}

// RU registri: o'tgan zamon JINSSIZ bo'lishi kerak (metodist qoidasi).
const ruGender = (where, line, ru) => {
  // ANIQ: «ты …л» — o'quvchiga MUROJAAT va jinsi bor. Bu xato.
  const sure = [...new Set((ru || '').match(RU_YOU_PAST) || [])]
  if (sure.length) push('ERR', line, 'RU-GENDER', `${where}: o'quvchiga jinsli murojaat — ${sure.join(' / ')}`)
  // SHUBHALI: jinsli fe'l «ты» siz. Ega predmet bo'lishi mumkin («точка
  // показала») — bu to'g'ri rus tili. Odam ko'rib hal qiladi.
  // «начала координат» -- OT birikmasi, fe'l emas. Uni oldindan olib
  // tashlamasak, masofalar darsida o'n yettita yolg'on ogohlantirish chiqadi
  // va hisobotdagi haqiqiy xatolar ko'rinmay qoladi.
  const ruClean = (ru || '').replace(/начала\s+координат/gi, 'ORIGIN')
  const maybe = [...new Set([...(ruClean.match(RU_MASC) || []), ...(ruClean.match(RU_FEM) || [])])]
  if (maybe.length && !sure.length) push('WARN', line, 'RU-GENDER?', `${where}: jinsli o'tgan zamon — ${maybe.join(' / ')} (ega predmet bo'lsa, xato emas)`)
}

const checkAudioText = (where, line, lang, text) => {
  if (!text) return
  const sym = text.match(BAD_SYMBOLS)
  if (sym) push('ERR', line, 'AUDIO-SYMBOL', `${where} [${lang}]: ovozda belgi ${[...new Set(sym)].map((s) => `"${s}"`).join(' ')} — so'z bilan yozilsin`)
}

// ============================================================
// 1-BLOK. OVOZ MATNI
// ============================================================
for (const s of screens) {
  s.audio.forEach((a) => {
    const where = `${s.name}[${a.i}] on=${a.on}`
    checkTriple(where, a.line, a.uz, a.ru, a.en)
    checkAudioText(where, a.line, 'uz', a.uz)
    checkAudioText(where, a.line, 'ru', a.ru)
    checkAudioText(where, a.line, 'en', a.en)
    ruGender(where, a.line, a.ru)
  })
}

// ============================================================
// 1b-BLOK. JAVOBDAN KEYINGI IZOH — u ham ovoz.
//
// Izoh satri IKKI joyga ketadi: ekranga va TTS ga. Ekranda `x = 2,5` to'g'ri
// yozuv, ovozga esa `core.jsx` dagi `speakable()` uni so'zga aylantiradi.
// Shuning uchun bu yerda FAQAT `speakable()` QAMRAMAGAN belgilar qidiriladi.
// Ro'yxat o'sha funksiyadan ko'chirilgan — u o'zgarsa, bu yer ham o'zgaradi.
// ============================================================
const SPEAKABLE_HANDLES = /[=<>≤≥≠→⟺×·∞«»""„—–]|(?<=^|[\s(])[−–-](?=\d)|\+(?=\s*\d)/g
for (const s of spoken.values()) {
  const where = `izoh ${s.where}:${s.line}`
  for (const lang of ['uz', 'ru', 'en']) {
    const raw = s[lang]
    if (!raw) continue
    checkAudioText(where, s.line, lang, raw.replace(SPEAKABLE_HANDLES, ' '))
  }
}

// ============================================================
// 2-BLOK. EKRAN MATNI (audio dan tashqari hamma L(...))
// ============================================================
const audioLines = new Set(screens.flatMap((s) => s.audio.map((a) => a.line)))
for (const l of allL) {
  if (audioLines.has(l.line)) continue
  checkTriple(`matn ${path.basename(FILE)}:${l.line}`, l.line, l.uz, l.ru, l.en)
  ruGender(`matn:${l.line}`, l.line, l.ru)
}

// ============================================================
// 3-BLOK. KADR va OVOZ MOSLIGI
// ============================================================
const sync = []
for (const s of screens) {
  if (!s.audio.length) continue
  const row = { name: s.name, n: s.audio.length, holds: s.holds, rows: [] }
  // Faza `total - 1` da to'xtaydi, shuning uchun OXIRGI hold hech qachon
  // o'qilmaydi: jadvalga n-1 ta son yetadi. Kamrog'i — kadr jadvalsiz qoladi.
  const need = Math.max(0, s.audio.length - 1)
  if (s.holds && s.holds.length < need) {
    push('ERR', s.holdsLine, 'HOLDS-LEN', `${s.name}: holds ${s.holds.length} ta, kerak ${need} ta — oxirgi kadrlar jadvalsiz qoladi`)
  }
  s.audio.forEach((a, i) => {
    const hold = s.holds ? s.holds[i] : null
    const est = { uz: estimateSpeech(a.uz), ru: estimateSpeech(a.ru), en: estimateSpeech(a.en) }
    row.rows.push({ i, on: a.on, hold, est, line: a.line })
    if (hold == null || i >= need) return
    for (const lang of ['uz', 'ru', 'en']) {
      const e = est[lang]
      // KECHIKISH. Kadr k+1 shu vaqtda ochiladi:
      //   max( k+1-bo'lakning boshlanishi , k-kadr ochilishi + hold[k] ).
      // Demak hold[k] gapdan UZUN bo'lsa, keyingi gap allaqachon aytilayotgan
      // bo'ladi, ekran esa hali eskisini ko'rsatib turadi.
      if (hold > e + 1200) {
        push('ERR', a.line, 'FRAME-LAG', `${s.name}[${i}] ${lang}: kadr ${hold} ms, gap ~${e} ms — keyingi kadr gapdan ${((hold - e) / 1000).toFixed(1)} s kech ochiladi`)
      }
      // Jim yo'l (bu til uchun brauzerda ovoz yo'q): straj est + 1500 da suradi.
      else if (hold > e + 1500 + 1200) {
        push('WARN', a.line, 'FRAME-LAG-MUTE', `${s.name}[${i}] ${lang}: jim yo'lda kadr ${((hold - e - 1500) / 1000).toFixed(1)} s kech`)
      }
      // Gap strajdan uzun: 30 s shift + 1,5 s dan keyin bo'lak UZILADI.
      if (e >= 30000) {
        push('WARN', a.line, 'WATCHDOG-CUT', `${s.name}[${i}] ${lang}: baho shiftga tegdi (30 s) — haqiqiy ovoz 31,5 s dan uzun bo'lsa, gap o'rtasida uziladi`)
      }
    }
  })
  sync.push(row)
}

// Holds YO'Q ekranlar: ochilish faqat ovoz indeksiga bog'liq bo'ladi.
for (const s of screens) {
  if (s.audio.length && !s.holds) {
    push('INFO', s.line, 'NO-HOLDS', `${s.name}: holds jadvali yo'q — ${s.audio.length} bo'lak, kadr vaqti matn uzunligidan hisoblanadi`)
  }
}

// ============================================================
// HISOBOT
// ============================================================
const fmt = (ms) => (ms == null ? '   —' : String(Math.round(ms / 100) / 10).padStart(5) + 's')

console.log('\n=== 11-SINF: OVOZ / KADR TEKSHIRUVI ===')
console.log('fayl:', path.relative(ROOT, FILE))
console.log(`ekran: ${screens.length}, ovoz bo'lagi: ${screens.reduce((n, s) => n + s.audio.length, 0)}`)

console.log('\n--- KADR va GAP UZUNLIGI (baho, sekund) ---')
console.log('ekran  #  hodisa      kadr     uz     ru     en')
for (const r of sync) {
  for (const x of r.rows) {
    // Oxirgi kadr uchun hold O'QILMAYDI -- uni belgilamaymiz.
    const used = x.hold != null && x.i < r.rows.length - 1
    const mark = used && ['uz', 'ru', 'en'].some((l) => x.hold > x.est[l] + 1200) ? '!' : ' '
    console.log(
      `${mark}${r.name.padEnd(5)} ${String(x.i).padStart(2)}  ${String(x.on || '').padEnd(10)}` +
      `${fmt(x.hold)} ${fmt(x.est.uz)} ${fmt(x.est.ru)} ${fmt(x.est.en)}`,
    )
  }
}

const total = (lang) => sync.reduce((n, r) => n + r.rows.reduce((m, x) => m + x.est[lang], 0), 0)
const totalHold = sync.reduce((n, r) => n + r.rows.reduce((m, x) => m + (x.hold || x.est.ru), 0), 0)
console.log('\n--- XRONOMETRAJ (baho) ---')
console.log(`uz ${(total('uz') / 60000).toFixed(1)} min | ru ${(total('ru') / 60000).toFixed(1)} min | en ${(total('en') / 60000).toFixed(1)} min | kadrlar bo'yicha ${(totalHold / 60000).toFixed(1)} min`)

const order = { ERR: 0, WARN: 1, INFO: 2 }
findings.sort((a, b) => order[a.level] - order[b.level] || a.line - b.line)
const byCode = {}
findings.forEach((f) => { byCode[f.code] = (byCode[f.code] || 0) + 1 })

console.log('\n--- XULOSA ---')
Object.entries(byCode).sort((a, b) => b[1] - a[1]).forEach(([code, n]) => console.log(`${String(n).padStart(4)}  ${code}`))
const errs = findings.filter((f) => f.level === 'ERR').length
console.log(`\nERR ${errs} | WARN ${findings.filter((f) => f.level === 'WARN').length} | INFO ${findings.filter((f) => f.level === 'INFO').length}`)

console.log('\n--- RO\'YXAT ---')
for (const f of findings) console.log(`${f.level.padEnd(4)} ${path.basename(FILE)}:${String(f.line).padEnd(5)} [${f.code}] ${f.msg}`)

process.exit(errs ? 1 : 0)
