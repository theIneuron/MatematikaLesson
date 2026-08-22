// ============================================================================
// 7-sinf: DARS QABULI. ETALON_7SINF.md §9.1 dagi «yangi» tekshiruvlar.
//
// Nega u kerak. §10.11 to'g'ridan to'g'ri aytadi: ekran rollari, tanlov
// kvotasi, teglar va ro'yxatga moslik QO'L bilan tekshirilgan, ya'ni ular
// DIQQATGA tayanadi. Etalonning o'z qoidasi esa boshqacha (§9): tekshirib
// bo'lmaydigan qoida bir oydan keyin bajarilmay qoladi.
//
// Bu skript FAQAT statik matnni o'qiydi. Vyorstkani `grade7-noscroll.mjs`,
// tilni va ovozni `check-grade7.mjs` o'lchaydi -- bu yerda ular takrorlanmaydi.
//
// Ishga tushirish:
//   node scripts/grade7-lesson-audit.mjs                 # ro'yxatdagi hamma dars
//   node scripts/grade7-lesson-audit.mjs Dars02.jsx      # bittasi
// ============================================================================
import { readFileSync, readdirSync } from 'node:fs'

const NL = String.fromCharCode(10)
const CYR = /[Ѐ-ӿ]/
const WORD = /[A-Za-z]{3,}/

const DIR = 'src/components/grade7'
const REGISTRY = 'src/lessons/grade7.js'

// Izohlarni olib tashlaymiz: «§ 4.2» va «12-bet» kabi havolalar izohlarda
// BO'LISHI KERAK, ekranda esa BO'LMASLIGI kerak (§3.4). Ularni aralashtirsak,
// tekshiruv o'z hujjatiga qarshi ishlaydi.
const stripComments = (src) => src
  .replace(/\/\*[\s\S]*?\*\//g, ' ')
  .replace(/^[ \t]*\/\/.*$/gm, ' ')

// Bitta ekranning ma'lumot bloki: `const S7 = {` dan `const S8 = {` gacha.
const screenBlock = (src, n) => {
  const from = src.indexOf(`const S${n} = {`)
  if (from === -1) return ''
  const to = src.indexOf(`const S${n + 1} = {`, from)
  return src.slice(from, to === -1 ? src.length : to)
}

// Ekran komponenti: `function ScreenN(` dan keyingi `function Screen` gacha.
// DIQQAT, BU YERDA TEKSHIRUV IKKI MARTA YOLG'ON GAPIRGAN.
// Fayldagi tartib: S3 -> Screen3 -> S4 -> Screen4. Agar chegara faqat
// `function Screen{n+1}(` bo'ysa, Screen3 ning «tanasi» ichiga BUTUN S4
// ma'lumoti kirib qoladi -- va 3-ekran qo'shnisining tegi hisobiga
// zapisga o'tib ketadi. Shuning uchun chegara IKKI nomzoddan yaqinrog'i.
const screenFn = (src, n) => {
  const from = src.indexOf(`function Screen${n}(`)
  if (from === -1) return ''
  const ends = [
    src.indexOf(`function Screen${n + 1}(`, from),
    src.indexOf(`const S${n + 1} = {`, from),
  ].filter((i) => i !== -1)
  const to = ends.length ? Math.min.apply(null, ends) : -1
  return src.slice(from, to === -1 ? src.length : to)
}

// `items: [ ... ]` bloklari. DIQQAT: ProbeChain da ikki qavat bor --
// tashqarisi SAVOLLAR ro'yxati, ichkarisi esa har savolning VARIANTLARI.
// Tekshiruv ichkarisiga tushishi kerak, aks holda u savollarni variant deb
// sanaydi va «uchta variant, to'rtta to'g'ri javob» deb yolg'on gapiradi.
const optionBlocks = (block) => {
  const out = []
  let i = 0
  for (;;) {
    const m = block.indexOf('items: [', i)
    if (m === -1) break
    let depth = 0
    let j = m + 'items: '.length
    for (; j < block.length; j += 1) {
      const ch = block[j]
      if (ch === '[') depth += 1
      else if (ch === ']') { depth -= 1; if (depth === 0) { j += 1; break } }
    }
    out.push(block.slice(m, j))
    i = j
  }
  return out
}

// Variant chegaralari: birinchi darajali `{ id:` lar.
const optionEntries = (blk) => {
  const inner = blk.slice(blk.indexOf('['))
  const out = []
  let depth = 0
  let start = -1
  for (let i = 0; i < inner.length; i += 1) {
    const ch = inner[i]
    if (ch === '{') { if (depth === 0) start = i; depth += 1 }
    else if (ch === '}') { depth -= 1; if (depth === 0 && start !== -1) { out.push(inner.slice(start, i + 1)); start = -1 } }
  }
  return out.filter((s) => /\bid:\s*'/.test(s))
}

// ENG ICHKI variant to'plamlari. Agar band ichida yana `items: [` bo'lsa,
// demak bu SAVOL, variant emas -- uning ichiga tushamiz.
const leafOptionSets = (block) => {
  const out = []
  optionBlocks(block).forEach((ob) => {
    const entries = optionEntries(ob)
    if (!entries.length) return
    // VARIANT `label` bilan tanaladi. `SortZones` ning `items` i -- kartalar
    // ro'yxati (`text`, `zone`), ya'ni variant EMAS: uni variant deb olsak,
    // tekshiruv «to'g'ri javob 0 ta» va «6 ta variant» deb yolg'on xabar
    // beradi (18-dars, 6-ekran).
    if (!entries.some((e) => /label:/.test(e)) && entries.some((e) => /zone:/.test(e))) return
    if (entries.some((e) => e.includes('items: ['))) {
      entries.forEach((e) => { leafOptionSets(e).forEach((s) => out.push(s)) })
      return
    }
    out.push(entries)
  })
  return out
}

// XUK SAHNALARI. 1-ekran CHIZILGAN sahnaga ega bo'lishi kerak -- sinf
// etaloni (1-dars) shunday, va 2026-08-15 da metodist buni butun sinfga
// talab qildi. Ikkita oq kartochka yoki matnli yo'lak sahna EMAS.
//
// Nega ro'yxat, avtomatik aniqlash emas: sahna SVG chizadigan asbob, lekin
// SVG chizadigan har bir asbob sahna emas (StairsReveal, ReadViz). Yangi
// sahna yozilganda u shu qatorga qo'shiladi -- xuddi blits javoblari kabi.
const SCENES = ['HookMachines', 'RideScene', 'TwoRoutes', 'PlotScene', 'CrateScene']

// ASBOBLAR: javob shakllari va ko'rsatuvchi asboblar (§4.2 farqi).
// KONVEYER REJIMI (2026-08-21). 20-darsdan boshlab dars fayli MA'LUMOT:
// o'ram `screens.jsx` da, ekran esa `kind` maydoni bilan tanaladi. Asbob JSX
// dan emas, `kind` dan o'qiladi -- aks holda tekshiruv kvotani NOL deb
// ko'rsatib, O'Z FOYDASIGA yolg'on gapirardi (bu loyihada uch marta bo'lgan).
const KIND_PICK = ['hook', 'chain', 'blitz']
const KIND_HANDS = ['strip', 'columns', 'grid', 'substitute', 'sort', 'slot', 'slot2', 'rule', 'trap', 'tape', 'plane', 'figure', 'transform', 'wrap']
const KIND_BUILD = ['slot', 'slot2', 'trap']
const kindOf = (blk) => ((blk.match(/kind:\s*'([a-z0-9]+)'/) || [])[1] || '')

const PICK_ONLY = ['Probe', 'ProbeChain']
// `EquationBalance` -- B2 blokining asbobi. Unda o'quvchi to'rttadan
// tanlamaydi: u AMALNI tanlaydi va yechimni qadamma-qadam yig'adi, xato amal
// esa qator qo'shmaydi. Shuning uchun u «javobni yig'adi» ro'yxatida.
const HANDS_ON = ['SlotFill', 'Transform', 'AuditRows', 'StepOrder', 'BracketGap', 'RuleBuilder', 'SubstituteRows', 'NumberLineTracks', 'EquationBalance', 'FactorTape', 'DistanceLine', 'TermStrip', 'SortZones', 'TermColumns']
const FORBIDDEN = ['Options', 'Feedback', 'useSfx', 'useAnswerFx']

// Darslikka havolalar. §3.4: ekranda ham, ovozda ham bo'lmaydi.
const BOOK_REFS = /(§\s*\d)|(\bстр\.)|(страниц)|(учебник)|(darslik)|(\d+\s*-?bet\b)|(textbook)|(\bpage\s+\d)/i

const audit = (file) => {
  const raw = readFileSync(`${DIR}/${file}`, 'utf8')
  const src = stripComments(raw)
  const bad = []
  const warn = []
  const say = (c, m) => (c ? null : bad.push(m))

  // --- 1. O'N BESH EKRAN va ROLLAR ---
  // IKKI SHAKL. 1-15 darslar obvyazkani o'z ichida saqlaydi:
  //   const TOTAL = 15 ... const SCREENS = [Screen1, ...]
  // 16-darsdan boshlab obvyazka `core.jsx` da (`createLesson`), darsda esa:
  //   export default createLesson({ ... screens: [Screen1, ...] })
  // Tekshiruv IKKALASINI ham biladi, aks holda u yangi shaklni «ekran yo'q»
  // deb yolg'on gapiradi.
  const screensArr =
    (src.match(/const SCREENS = \[([\s\S]*?)\]/) || [])[1] ||
    (src.match(/screens:\s*\[([\s\S]*?)\]/) || [])[1] || ''
  const conveyor = /makeLesson\(/.test(raw)
  const listed = conveyor
    ? (screensArr.match(/\bS\d+\b/g) || []).length
    : (screensArr.match(/Screen\d+/g) || []).length
  const totalRaw = (raw.match(/const TOTAL = (\d+)/) || [])[1]
  const total = totalRaw || String(listed)
  say(total === '15', `ekranlar soni ${total}, 15 bo'lishi kerak (§4.1)`)
  say(listed === 15, `ekranlar ro'yxatida ${listed} ta, 15 bo'lishi kerak`)
  for (let n = 1; n <= 15; n += 1) {
    if (conveyor) {
      const blk = screenBlock(src, n)
      say(blk !== '', `S${n} ma'lumot bloki yo'q`)
      const k = kindOf(blk)
      say(k !== '', `S${n} da kind yo'q -- konveyer qaysi ekranni qo'yishini bilmaydi`)
      if (k) say(KIND_PICK.indexOf(k) !== -1 || KIND_HANDS.indexOf(k) !== -1, `S${n} kind «${k}» tekshiruvga tanish emas`)
    } else {
      say(screenFn(src, n) !== '', `Screen${n} komponenti yo'q`)
    }
  }

  // --- 2. MEXANIKA DARS FAYLIDA YO'Q (§9.1) ---
  // IZOHSIZ matn: fayl sarlavhasidagi izoh aynan shu nomlarni ATAYDI
  // («ular bu yerda YO'Q»), va u izohni o'qigan tekshiruv o'zini aldaydi.
  const imports = src.slice(0, src.indexOf('const LESSON_ID'))
  FORBIDDEN.forEach((name) => {
    say(!new RegExp(`\\b${name}\\b`).test(imports), `dars fayli ${name} ni import qiladi -- mexanika darsga ko'chgan (§9.1)`)
  })
  say(!/from '\.\.\/shared\//.test(raw), "`../shared/` dan import qilingan -- 7-sinfga taqiqlangan (§4.5)")
  // KONVEYERDA dars faylida JSX YO'Q -- u faqat ma'lumot, va React ham
  // kerak emas: JSX ni `screens.jsx` yozadi. Talab REJIMGA qarab o'zgaradi.
  if (conveyor) {
    say(/from '.\/screens.\jsx'/.test(raw), "konveyer darsi ./screens.jsx dan import qilmaydi")
  } else {
    say(/^import React/m.test(raw), 'import React yo\'q -- LMS jsx ni klassik rejimda yuklaydi')
  }

  // --- 3. RO'YXATGA MOSLIK ---
  const reg = readFileSync(REGISTRY, 'utf8')
  const lessonNo = (raw.match(/const LESSON_NO = L\('([^']+)'/) || [])[1] || ''
  const num = (lessonNo.match(/(\d+)/) || [])[1]
  const compFile = file.replace('.jsx', '')
  const inReg = new RegExp(`components/grade7/${compFile}\\.jsx`).test(reg)
  say(inReg, `${file} ro'yxatda (${REGISTRY}) yo'q`)
  if (inReg && num) {
    // Ro'yxat yozuvi: import satridan ORQAGA eng yaqin `{` gacha. 700 belgi
    // deb olsak, oldingi darsning yozuviga tushib ketamiz.
    const hit = reg.indexOf(`grade7/${compFile}.jsx`)
    const entry = reg.slice(reg.lastIndexOf('{', hit), hit)
    const title = (entry.match(/title:\s*"?'?Dars (\d+)/) || [])[1]
    say(title === num, `ro'yxatdagi nomer (${title}) darsnikiga (${num}) mos emas`)
    const slug = (entry.match(/slug:\s*'([^']+)'/) || [])[1] || ''
    say(new RegExp(`dars0?${num}`).test(slug), `slug «${slug}» ${num}-darsga mos emas`)
  }

  // --- 4. VARIANTLAR: to'rttadan, har xatosida razbor ---
  for (let n = 1; n <= 15; n += 1) {
    const blk = screenBlock(src, n)
    if (!blk) continue
    leafOptionSets(blk).forEach((entries, k) => {
      if (!entries.length) return
      // XUK (§4.1) baholanmaydi va unda TO'G'RI javob yo'q: u taxmin.
      if (n === 1) {
        entries.forEach((e) => {
          const id = (e.match(/id:\s*'([^']+)'/) || [])[1]
          say(/hint:\s*L\(|hint:\s*'/.test(e), `S1 variant «${id}»: razbor yo'q (§8.3)`)
        })
        say(entries.length === 4, `S1: ${entries.length} ta variant, 4 bo'lishi kerak`)
        return
      }
      const correct = entries.filter((e) => /correct:\s*true/.test(e)).length
      say(correct === 1, `S${n} savol ${k + 1}: to'g'ri javob ${correct} ta, bitta bo'lishi kerak`)
      // Ikkita variantli SHOHIDLIK istisnosi (§4.2) -- RuleBuilder qadamlari.
      if (entries.length !== 4 && entries.length !== 2) {
        say(false, `S${n} savol ${k + 1}: ${entries.length} ta variant, 4 bo'lishi kerak (§4.2)`)
      }
      entries.filter((e) => !/correct:\s*true/.test(e)).forEach((e) => {
        const id = (e.match(/id:\s*'([^']+)'/) || [])[1]
        say(/hint:\s*L\(|hint:\s*'/.test(e), `S${n} savol ${k + 1}, variant «${id}»: razbor yo'q (§8.3)`)
      })
    })
  }

  // --- 5. TEG: 2-dan 14-gacha har ekran yozadi (§8.5) ---
  for (let n = 2; n <= 14; n += 1) {
    const blk = screenBlock(src, n)
    if (!blk) continue
    // Teg MA'LUMOTDA (`tag: 'Z1'`) ham, ASBOBGA PROP bo'lib (`tag="Z1"`) ham
    // uzatiladi -- 1-darsda ikkala shakl ham ishlatilgan.
    const both = blk + screenFn(src, n)
    say(/tag:\s*'Z\d'|tags:\s*\{|tag="Z\d"/.test(both), `S${n} teg yozmaydi (§8.5)`)
  }

  // --- 6. TANLOV KVOTASI: 2-13 dan ko'pi bilan uchta (§4.2) ---
  const quota = []
  for (let n = 2; n <= 13; n += 1) {
    if (conveyor) {
      const k = kindOf(screenBlock(src, n))
      if (k && KIND_PICK.indexOf(k) !== -1) quota.push(n)
      continue
    }
    const fn = screenFn(src, n)
    if (!fn) continue
    // `askFirst` rejimida SubstituteRows QO'L ishi emas: o'quvchi faqat
    // savolga javob beradi, qatorlar esa javobdan keyin O'ZI ochiladi.
    // Buni hisobga olmasak, tekshiruv kvotani KAM ko'rsatadi -- ya'ni aynan
    // o'zi qo'riqlashi kerak bo'lgan tomonga yolg'on gapiradi.
    const askFirst = /askFirst/.test(fn)
    const handsList = askFirst ? HANDS_ON.filter((c) => c !== 'SubstituteRows') : HANDS_ON
    const picks = PICK_ONLY.some((c) => new RegExp(`<${c}\\b`).test(fn)) || (askFirst && /<SubstituteRows\b/.test(fn))
    const hands = handsList.some((c) => new RegExp(`<${c}\\b`).test(fn))
    if (picks && !hands) quota.push(n)
  }
  say(quota.length <= 3, `to'rt variantdan tanlash YAGONA harakat bo'lgan ekranlar: ${quota.join(', ')} -- uchtadan ko'p (§4.2)`)

  // --- 7. JAVOBNI O'QUVCHI YIG'ADIGAN EKRANLAR: kamida uchta ---
  const build = []
  for (let n = 2; n <= 13; n += 1) {
    if (conveyor) {
      const k = kindOf(screenBlock(src, n))
      if (k && KIND_BUILD.indexOf(k) !== -1) build.push(n)
      continue
    }
    if (/<SlotFill\b/.test(screenFn(src, n))) build.push(n)
  }
  say(build.length >= 3, `javob bo'laklardan yig'iladigan ekranlar: ${build.length} ta, kamida 3 kerak (§8.5)`)

  // --- 8. BAHOLANADIGAN EKRAN BITTA ---
  const scored = conveyor
    ? (src.match(/kind:\s*'blitz'/g) || []).length
    : (src.match(/scored:\s*true/g) || []).length
  if (conveyor) {
    // Konveyerda `scored: true` `screens.jsx` da turadi. Darsda esa
    // baholanadigan ekran `kind: 'blitz'` bilan belgilanadi.
    const blitzes = []
    for (let n = 1; n <= 15; n += 1) { if (kindOf(screenBlock(src, n)) === 'blitz') blitzes.push(n) }
    say(blitzes.length === 1, `blitz ekrani ${blitzes.length} ta, bittada bo'lishi kerak (§8.5)`)
  } else {
    say(scored === 1, `scored: true ${scored} marta uchraydi, bittada bo'lishi kerak (§8.5)`)
  }

  // --- 9. ZAMOK: javob shakli bor har ekranda ---
  for (let n = 1; n <= 14; n += 1) {
    const fn = screenFn(src, n)
    if (!fn) continue
    const hasAnswer = PICK_ONLY.concat(HANDS_ON).some((c) => new RegExp(`<${c}\\b`).test(fn))
    if (!hasAnswer) continue
    say(/useInstructionGate\(/.test(fn), `S${n}: javob bor, lekin useInstructionGate yo'q (§4.3)`)
    say(/disabled=\{!canAnswer\}/.test(fn), `S${n}: zamok asbobga uzatilmagan (disabled)`)
  }

  // --- 9a. XUKDA SAHNA BOR (metodist talabi 2026-08-15) ---
  // O'lchov buni ko'rmaydi: sahnasiz xuk ham budjetga sig'adi va hamma
  // tekshiruvdan yashil o'tadi. 5-dars aynan shunday o'tgandi.
  const fn1 = screenFn(src, 1)
  if (conveyor) {
    // Konveyerda sahna `screens.jsx` da chiziladi, darsda esa `gate.source`
    // bilan beriladi -- shuning uchun tekshiruv MA'LUMOTGA qaraydi.
    const s1 = screenBlock(src, 1)
    say(/gate:/.test(s1) && /source:/.test(s1), "1-ekranda sahna yo'q: gate.source berilmagan")
  } else {
    say(
      SCENES.some((c) => new RegExp(`<${c}\\b`).test(fn1)),
      `1-ekranda sahna yo'q. Sinf etaloni -- chizilgan sahna, ikkita kartochka yetarli emas. Bor sahnalar: ${SCENES.join(', ')}`,
    )
  }

  // --- 9b. LENTA PLASHKALARIDA SO'Z YO'Q ---
  // `HistoryTape` plashkalari oddiy satrlar, ular UCH TILGA bo'linmaydi.
  // Shuning uchun ularda so'z bo'lsa, u hamma tilda bir xil ko'rinadi:
  // 7-darsda «ildiz yo'q» ruscha versiyada ham o'zbekcha bo'lib turgandi.
  // Ruxsat: sonlar, amal belgilari va bir-ikki harfli o'zgaruvchilar.
  const chipsBlock = (src.match(/chips:\s*\[([\s\S]*?)\]/) || [])[1] || ''
  ;(chipsBlock.match(/'(?:[^'\\]|\\.)*'/g) || []).forEach((c) => {
    if (/[Ѐ-ӿ]/.test(c)) bad.push(`lenta plashkasida kirill: ${c}`)
    else if (/[A-Za-z]{3,}/.test(c)) bad.push(`lenta plashkasida so'z: ${c} -- plashkalar tarjima qilinmaydi`)
  })

  // --- 9c. SLOTFILL SHABLONIDA SO'Z YO'Q ---
  // Xuddi lenta plashkalari kabi, `template` satrlari oddiy satrlar va
  // TARJIMA QILINMAYDI. 8-darsda shablonda «ikkala tomondan» degan o'zbekcha
  // ibora turgandi -- u ruscha versiyada ham o'zbekcha bo'lib ko'rinardi.
  ;(src.match(/template:\s*\[[\s\S]*?\],/g) || []).forEach((tpl) => {
    ;(tpl.match(/'(?:[^'\\]|\\.)*'/g) || []).forEach((c) => {
      if (/[Ѐ-ӿ]/.test(c)) bad.push(`shablonda kirill: ${c}`)
      else if (/[A-Za-z]{3,}/.test(c)) bad.push(`shablonda so'z: ${c} -- shablon tarjima qilinmaydi`)
    })
  })

  // --- 9d. AUDITROWS QATORLARIDA SO'Z BO'LSA -- FAQAT L() ICHIDA ---
  // `text:` oddiy satr bo'lsa, u tarjima qilinmaydi. Matematika uchun bu
  // to'g'ri (`x + 3x = 48` hamma tilda bir xil), lekin so'z uchun yo'q:
  // 11-darsda «javob: 12» ruscha versiyada ham o'zbekcha bo'lib turardi.
  src.split(NL).filter((l) => l.indexOf('text:') !== -1).forEach((l) => {
    // FAQAT satr adabiyoti olinadi, qatorning qolgani emas: `text: '3m · 4m',
    // zone: 'z1'` da `zone` kaliti SO'Z deb hisoblanib qolardi (18-dars).
    const rest = l.slice(l.indexOf('text:') + 5).trim()
    const q = rest.charAt(0)
    let val = rest
    if (q === "'" || q === '"') {
      const end = rest.indexOf(q, 1)
      if (end !== -1) val = rest.slice(1, end)
    }
    // Xizmat chaqiruvlari: `L(...)` tarjima qiladi, `tr(...)` esa yadroning
    // ovoz yig'gichida turadi -- ular matn emas.
    if (rest.startsWith('L(') || rest.startsWith('tr(')) return
    if (CYR.test(val)) bad.push(`qator matnida kirill: ${val.slice(0, 40)} -- L() kerak`)
    else if (WORD.test(val)) bad.push(`qator matnida so'z: ${val.slice(0, 40)} -- L() kerak`)
  })

  // --- 10. DARSLIKKA HAVOLA EKRANDA YO'Q (§3.4, metodist 2026-08-15) ---
  const strings = src.match(/'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"/g) || []
  strings.forEach((s) => {
    if (BOOK_REFS.test(s)) bad.push(`ekran matnida darslikka havola: ${s.slice(0, 70)} (§3.4)`)
  })

  // --- 11. FREE_NAV: topshirishdan oldin false ---
  if (/freeNav:\s*true/.test(src)) warn.push('freeNav: true -- ishlab chiqish rejimi, sinf topshirilganda false bo\'lishi kerak')

  // Sanoqlar HAR DOIM chiqadi, faqat buzilganda emas: qabul dalolatnomasida
  // «uchtadan kam» degan gap emas, ANIQ SON turishi kerak.
  const stat = [
    `ekranlar ${listed}`,
    `kvota ${quota.length}/3 (${quota.join(', ') || 'yo\'q'})`,
    `javobni yig'adi ${build.length} (${build.join(', ')})`,
    `baholanadi ${scored}`,
  ].join(' | ')

  return { file, bad, warn, stat }
}

const files = process.argv.slice(2).length
  ? process.argv.slice(2)
  : readdirSync(DIR).filter((f) => /^Dars\d+\.jsx$/.test(f)).sort()

let failed = 0
files.forEach((f) => {
  const r = audit(f)
  if (r.bad.length) failed += 1
  console.log(`${r.bad.length ? 'XATO' : 'OK  '} ${f}   ${r.stat}`)
  r.bad.forEach((m) => console.log('   - ' + m))
  r.warn.forEach((m) => console.log('   ? ' + m))
})
process.exit(failed ? 1 : 0)
