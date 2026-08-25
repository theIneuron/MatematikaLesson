// ============================================================================
// 7-sinf STATIK tekshiruvi: apostrof, ovoz matni, uch tilning to'liqligi.
// Brauzer kerak emas. Ishga tushirish: node scripts/check-grade7.mjs
//
// Nimani ushlaydi:
//  1. Tipografik apostrof/qo'shtirnoq (UZ da faqat ASCII ' bo'lishi shart)
//  2. Ovoz matnida belgi: = < > % $ ^ × ÷ / va uzun tire, qo'shtirnoqlar
//     (TTS ularni o'qiy olmaydi yoki g'alati o'qiydi)
//  3. Ovoz matnida texnik marker (platforma qo'shadi, kontentda bo'lmasligi kerak)
//  4. L(...) uchligida bo'sh til
// ============================================================================
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

const DIR = 'src/components/grade7'
const problems = []

// UZBEKCHA SATR BITTA QAVSDA BO'LMAYDI (loyiha qoidasi, CLAUDE.md §7).
// Sabab amaliy: L('ko'paytirish', ...) dagi apostrof satrni UZIB qo'yadi va
// sahifa ochilmaydi. Bu 2026-08-20 da IKKI MARTA sodir bo'ldi (14 va
// 15-darslar). Build uni tutadi, lekin build sekin ishlaydi -- bu tekshiruv
// esa bir zumda.
const singleQuotedApostrophe = (src, file) => {
  src.split(String.fromCharCode(10)).forEach((line, i) => {
    // FAQAT `L(` chaqiruvi. Umumiy qoida bo'lsa, tekshiruv izohlardagi
    // apostroflarni ham ushlab, 4883 ta yolg'on xabar berardi -- shunday
    // tekshiruvni hech kim o'qimaydi. Bu yerda naqsh aniq: birinchi
    // argument uzilgan bo'lsa, yopilish qavsidan keyin DARROV harf keladi.
    if (line.trim().startsWith('//')) return
    // Ekranlangan apostrof (\') to'g'ri yozuv -- u satrni uzmaydi.
    const m = line.match(/L\('(?:[^'\\]|\\.)*'[A-Za-z]/)
    if (m) problems.push(`${file}:${i + 1} bitta qavsdagi satrda apostrof: ${m[0].slice(0, 32)} -- qo'sh qavs kerak`)
  })
}

// 2026-08-13: `Dars01.jsx` endi ro'yxatdan chiqarilmaydi. Ilgari bu yerda
// metodist 2026-08-05 da rad etgan prototip turardi; u NOLDAN qayta yozildi
// (DARS01_SKELET.md, DARS01_KONTENT.md) va `src/lessons/grade7.js` ga ulandi,
// ya'ni saytda ko'rinadi -- demak tekshiruvdan chiqarib bo'lmaydi.
const SKIP = new Set([])

const BAD_CHARS = [
  ['‘', 'tipografik apostrof U+2018'],
  ['’', 'tipografik apostrof U+2019'],
  ['ʻ', "o'zbek apostrofi U+02BB"],
  ['ʼ', "o'zbek apostrofi U+02BC"],
  ['“', 'qo\'shtirnoq U+201C'],
  ['”', 'qo\'shtirnoq U+201D'],
]

// Ovozda TAQIQLANGAN belgilar. Tire va qavslar ovozda ham uchraydi, lekin
// matematik belgilar so'z bilan aytilishi kerak.
const AUDIO_BAD = ['=', '<', '>', '%', '$', '^', '×', '÷', '≠', '—', '«', '»', '"']

// PAPKALAR ICHIGA HAM KIRAMIZ. 2026-08-20 da amaliyot `practice/darsNN/`
// papkalariga yotdi (1, 2 va 5-sinflardagi joylashuv), va bir qavatli
// `readdir` ularni KO'RMAY qolardi: o'n ikkita yangi fayl uch til, apostrof
// va ovoz tekshiruvidan JIMGINA tushib qolgan bo'lardi.
// LMS uchun yig'ilgan papka tekshirilmaydi: u avtomatik, manba fayllari
// allaqachon tekshirilgan (nusxada bir xil matn ikki marta hisoblanardi).
const SKIP_DIRS = ['lms-grade7-practice-standalone'];
const listJsx = async (dir, prefix = '') => {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const rel = prefix ? prefix + '/' + entry.name : entry.name
    if (entry.isDirectory()) {
      if (SKIP_DIRS.includes(entry.name)) continue;
      out.push(...await listJsx(path.join(dir, entry.name), rel))
    } else if (entry.name.endsWith('.jsx')) {
      out.push(rel)
    }
  }
  return out
}

const all = await listJsx(DIR)
const skipped = all.filter((f) => SKIP.has(f))

//
// 2026-08-22 da bu xato uch marta takrorlandi: CSS izohida teskari apostrof
// yozilgan, shablon satri uzilgan, va `.g7-dl` yoki `.g7-expr` kabi yozuv
// JS ifodasi bo'lib qolgan -- «dl is not defined», «expr is not defined».
// Dars BO'SH SAHIFA bo'ladi. `npm run build` bunda muvaffaqiyatli tugaydi,
// chunki chiqqan ifoda sintaktik jihatdan to'g'ri. Shuning uchun qo'riqchi
// STATIK tekshiruvda turadi.
// ============================================================================
const files = all.filter((f) => !SKIP.has(f))

// STYLES ichida TESKARI APOSTROF. `export const STYLES = ` ... ` ` -- shablon
// satri. Uning ichidagi izohga teskari apostrof yozilsa shablon O'SHA YERDA
// yopiladi va butun fayl parse bo'lmaydi. Xato JIM: dars sahifasi 500 beradi,
// tekshiruvlar esa «o'lchanadigan narsa yo'q» deb toza rapor qiladi.
// 2026-08-13 da bu KETMA-KET UCH MARTA takrorlandi, shuning uchun endi
// tekshiruv ushlaydi.
const stylesBacktick = (text) => {
  const start = text.indexOf('export const STYLES = `')
  if (start === -1) return null
  const from = start + 'export const STYLES = `'.length
  const end = text.indexOf('\n`', from)
  const body = text.slice(from, end === -1 ? text.length : end)
  const idx = body.indexOf('`')
  if (idx === -1) return null
  const line = text.slice(0, from + idx).split(/\r?\n/).length
  return line
}

for (const file of files) {
  const full = path.join(DIR, file)
  const text = await readFile(full, 'utf8')
  const lines = text.split(/\r?\n/)

  const btLine = stylesBacktick(text)
  if (btLine) {
    problems.push(`${file}:${btLine} -- STYLES ICHIDA teskari apostrof: shablon satri shu yerda yopiladi va fayl buziladi`)
  }

  // 1. Tipografik belgilar
  for (const [ch, label] of BAD_CHARS) {
    lines.forEach((line, i) => {
      if (line.includes(ch)) problems.push(`${file}:${i + 1} ${label}`)
    })
  }

  singleQuotedApostrophe(text, file)

  // 2-3. Ovoz satrlari: A('<qadam>', "uz", 'ru', 'en')
  // DIQQAT: qo'shtirnoq JS chegarasi bo'lishi mumkin (UZ satrlarida ASCII
  // apostrof bo'lgani uchun ular " bilan yoziladi). Shu sababli belgilarni
  // satrning O'ZIDA emas, ajratib olingan MATN ICHIDA tekshiramiz.
  lines.forEach((line, i) => {
    const trimmed = line.trim()
    if (!trimmed.startsWith('A(')) return
    const found = []
    let j = 0
    while (j < trimmed.length) {
      const ch = trimmed[j]
      if (ch === "'" || ch === '"') {
        let k = j + 1
        let buf = ''
        while (k < trimmed.length) {
          if (trimmed[k] === '\\') { buf += trimmed[k + 1] || ''; k += 2; continue }
          if (trimmed[k] === ch) break
          buf += trimmed[k]
          k += 1
        }
        found.push(buf)
        j = k + 1
        continue
      }
      j += 1
    }
    // birinchi satr -- qadam nomi, ovoz matni emas
    const texts = found.slice(1)
    texts.forEach((txt) => {
      for (const bad of AUDIO_BAD) {
        if (txt.includes(bad)) {
          problems.push(`${file}:${i + 1} ovoz matnida taqiqlangan belgi "${bad}"`)
        }
      }
      if (/\[(O'zbekcha|Русское|English)/i.test(txt)) {
        problems.push(`${file}:${i + 1} ovozda til markeri -- uni PLATFORMA qo'shadi`)
      }
    })
  })

  // 4. L(...) uchligida bo'sh til
  const lRe = /\bL\(\s*(['"])((?:\\.|(?!\1)[^\\])*)\1\s*,\s*(['"])((?:\\.|(?!\3)[^\\])*)\3\s*,\s*(['"])((?:\\.|(?!\5)[^\\])*)\5\s*,?\s*\)/g
  let m
  while ((m = lRe.exec(text)) !== null) {
    const trio = [m[2], m[4], m[6]]
    const upto = text.slice(0, m.index).split(/\r?\n/).length
    if (trio.some((x) => x.trim() === '')) {
      problems.push(`${file}:${upto} L(...) da bo'sh til`)
    }
    // TIL O'Z KATAKCHASIDA TURSIN. Uchlik to'la bo'lishi yetmaydi: 3-darsda
    // o'zbekcha satr ichida kirillcha "minus" turardi, ya'ni uchlik to'la
    // ko'rinardi, ekranda esa til aralashardi (QA 2026-08-25). Faqat SO'Z
    // tekshiriladi: matematik yozuv uch tilda bir xil.
    const [uzS, ruS, enS] = trio
    const hasWord = (v) => /[A-Za-zЀ-ӿ']{3,}/.test(v)
    const CYR = /[Ѐ-ӿ]/
    if (CYR.test(uzS)) problems.push(`${file}:${upto} UZ satrida kirill -- ${uzS.slice(0, 40)}`)
    if (CYR.test(enS)) problems.push(`${file}:${upto} EN satrida kirill -- ${enS.slice(0, 40)}`)
    if (hasWord(ruS) && !CYR.test(ruS)) problems.push(`${file}:${upto} RU satri kirillsiz -- ${ruS.slice(0, 40)}`)
    if (uzS === ruS && hasWord(uzS)) problems.push(`${file}:${upto} UZ va RU bir xil -- ${uzS.slice(0, 40)}`)
    // O'ZBEKCHA «SIZ» DA (CLAUDE.md § 1). Ota-onalar ohangga sezgir, shuning
    // uchun sinfda «sen» yo'q. Tekshiruv olmoshni ham, fe'lning ikkinchi
    // shaxs birlik shaklini ham ko'radi: «bo'lasan», «o'tsang», «qo'yding».
    if (/\b(sen|senga|sening|seni|senda|sendan)\b/i.test(uzS)) {
      problems.push(`${file}:${upto} UZ da «sen» -- «siz» kerak: ${uzS.slice(0, 40)}`)
    }
    if (/\b[a-z'\u2018\u2019]+(asan|ysan|ibsan|gansan|yapsan|ding|dingmi|sang|santi)\b/i.test(uzS)) {
      problems.push(`${file}:${upto} UZ da 2-shaxs birlik fe'l -- «siz» kerak: ${uzS.slice(0, 40)}`)
    }
  }
}

// ============================================================================
// EKRANGA CHIQADIGAN MAYDON UCH TILDA BO'LSIN.
//
// QA nuqsoni 2026-08-23: 16-darsning yakunida `twoA` va `twoB` oddiy satr
// edi -- `L(...)` emas. Natijada ruscha va inglizcha ekranda ham o'zbekcha
// «son · son» va «ko'rsatkich + ko'rsatkich» turardi. Eski tekshiruv buni
// ko'rmasdi: u FAQAT `L(...)` ichini qaraydi, ya'ni tarjima UMUMAN yo'q
// bo'lsa jim qolardi.
//
// Endi: `t()` orqali chiziladigan maydon yo `L(...)` bo'lishi, yo SOF
// MATEMATIK yozuv bo'lishi kerak. Uch harfdan uzun so'z bor satr -- matn,
// va u tarjimasiz qololmaydi.
// ============================================================================
const T_FIELDS = [
  'twoA', 'twoB', 'twoLabel', 'task', 'given', 'noGap', 'moreGaps', 'gapPrefix',
  'helpLabel', 'hookCap', 'lawSweep', 'nextLabel', 'nextTopic', 'noAnswer',
  'predictLabel', 'fixSay',
]
for (const file of files) {
  // FAQAT NAZARIY DARSLAR. Amaliyotda tarjima boshqacha yig'iladi: u yerda
  // `const T = { uz: {...}, ru: {...}, en: {...} }` turadi, ya'ni `given:`
  // satri tilning ICHIDA yotadi va L(...) kerak emas.
  if (file.includes('/') || file.includes('\\')) continue
  const text = await readFile(path.join(DIR, file), 'utf8')
  for (const key of T_FIELDS) {
    const re = new RegExp('^\\s*' + key + ":\\s*('[^'\\n]*'|\"[^\"\\n]*\")\\s*,", 'gm')
    let m
    while ((m = re.exec(text))) {
      const val = m[1].slice(1, -1)
      if (!/[A-Za-z]{3,}/.test(val)) continue
      const line = text.slice(0, m.index).split(/\r?\n/).length
      problems.push(`${file}:${line} ${key} tarjimasiz: L(...) kerak -- ${val.slice(0, 40)}`)
    }
  }

  // SAHNA BELGISI SO'Z BO'LSA, u ham tarjimani talab qiladi. `tokens` va
  // `inner` ro'yxatining ko'p qismi matematika (u uch tilda bir xil), lekin
  // ba'zan tabloda so'z turadi. QA nuqsoni 2026-08-23: ruscha ekranda
  // 12-darsda «jami 40 kg», 42-darsda «kerak» turardi. Rim raqami (I, II,
  // III, IV) va bitta harf -- matematika, ular tekshiruvdan chetda.
  const TOK_RE = /(tokens|inner):\s*\[([^\]]*)\]/g
  let tm
  while ((tm = TOK_RE.exec(text))) {
    if (tm[2].includes('L(')) continue
    // SO'Z BO'SHLIQ BILAN HAM BO'LADI. Birinchi tahrirda naqsh butun belgini
    // `^[A-Za-z']{2,}$` deb qaraganidan «har xil» va «bir xil» (44-dars xuki)
    // ushlanmay qolgan edi: ular ruscha va inglizcha ekranda o'zbekcha
    // turaverdi. Endi belgi ICHIDA uch harfli so'z bo'lsa yetadi -- shu bilan
    // birga `ab`, `ax` kabi matematik yozuv chetda qoladi.
    const words = (tm[2].match(/'[^'\n]*'|"[^"\n]*"/g) || [])
      .map((q) => q.slice(1, -1).trim())
      .filter((v) => /[A-Za-z']{3,}/.test(v) && !/^[IVX, ]+$/.test(v))
    if (!words.length) continue
    const line = text.slice(0, tm.index).split(/\r?\n/).length
    problems.push(`${file}:${line} sahna belgisi tarjimasiz: L(...) kerak -- ${words.join(', ')}`)
  }

  // L(...) MAYDONI t() SIZ CHIZILMASIN. 1-19 darslarning yakun ekrani umumiy
  // qatlamdan OLDIN yozilgan, shuning uchun ularda o'z nusxasi bor va u
  // satrni `{S15.twoA}` deb chizardi. Maydonga L(...) qo'yilishi bilan React
  // «Objects are not valid as a React child» deb butun ekranni yiqitdi
  // (QA 2026-08-23, 16-dars). Prop sifatida uzatilgan qiymat tekshirilmaydi:
  // uni asbobning o'zi t() dan o'tkazadi.
  const withL = new Set()
  let cur = null
  text.split(/\r?\n/).forEach((line) => {
    const open = line.match(/^const (S\d+) = \{/)
    if (open) { cur = open[1]; return }
    if (cur && /^\}/.test(line)) { cur = null; return }
    const f = cur && line.match(/^\s*([a-zA-Z]\w*): L\(/)
    if (f) withL.add(cur + '.' + f[1])
  })
  text.split(/\r?\n/).forEach((line, i) => {
    const raw = line.match(/\{(S\d+\.\w+)\}/g) || []
    raw.forEach((hit) => {
      const key = hit.slice(1, -1)
      if (!withL.has(key)) return
      if (new RegExp('\\w+=\\{' + key.replace('.', '\\.') + '\\}').test(line)) return
      problems.push(`${file}:${i + 1} ${key} t() siz chizilmoqda -- ekran yiqiladi`)
    })
  })
}

if (skipped.length) {
  console.log('DIQQAT: tekshiruvdan chiqarilgan (rad etilgan prototip): ' + skipped.join(', '))
}

if (problems.length) {
  console.error(`MUAMMOLAR (${problems.length}):`)
  problems.slice(0, 50).forEach((p) => console.error('  ' + p))
  if (problems.length > 50) console.error(`  ... yana ${problems.length - 50}`)
  process.exitCode = 1
} else {
  console.log(`OK: ${files.length} fayl -- apostrof ASCII, ovoz matni toza, uch til to'la.`)
}
