// ============================================================================
// 8-sinf YADROSI. Bir marta yoziladi, 55 dars shuni ishlatadi.
// Kontrakt: src/books/grade8/ETALON_8SINF.md
//
// Ichida: uch til, ovoz (HTTP TTS v5.2), mobil zoom, navigatsiya qulflari,
// Stage va KATTALAR uchun UI primitivlari.
//
// 7-sinf yadrosidan KO'CHIRILMAGAN (metodist qarori 2026-08-06): u 1-2 sinf
// oformleniyasini olgan. 8-sinfda (§2.1):
//   - javob uchun RANG-MUKOFOT yo'q: yashil chaqnash ham, galochka ham yo'q
//   - «to'g'ri/xato» TOVUSHI yo'q: ovoz faqat gap
//   - pulsatsiya qiladigan «Davom» tugmasi yo'q
//   - A B C D nishonlari yo'q
//   - matn zich, matematika monoshirinali, bitta akцент rangi
//   - kichraytiruvchi so'zlar yo'q: ODZ — ODZ
//
// 7-sinfdan OLINGAN — u to'lagan xatolar (§12):
//   1. on_event segmenti hodisani KUTADI, o'zi yonmaydi
//   2. audio.muted har ekranda tiklanadi
//   3. qulflar ovoz o'chiq bo'lsa HAM ochiladi
//   4. pulsatsiya soya bilan, masshtab bilan EMAS; silkinish clip-qutida
//   5. `import React` SHART -- LMS xom jsx ni klassik rejimda yuklaydi
//   6. FREE_NAV bitta satr, har ekranda flag emas
// ============================================================================
// eslint-disable-next-line no-unused-vars -- LMS xom jsx ni KLASSIK rejimda yuklaydi
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

// Ishlab chiqishda erkin, sinf topshirilishidan oldin false. BITTA joyda.
//
// 2026-08-14, metodist so'radi: KO'RISH uchun qulf o'chirilsin — slaydlarni
// yechmasdan varaqlash kerak. Shuning uchun TRUE.
//
// NIMA O'CHDI va NIMA O'CHMADI. `FREE_NAV` faqat O'TISH qulfini oladi:
// «Davom etish» topshiriq yechilmasa ham ochiq. JAVOB qulfi bunga BOG'LIQ
// EMAS — u `useInstructionGate` da va `FREE_NAV` ni umuman o'qimaydi
// (§13.3 p. 8): ovoz yoniq bo'lsa javob baribir ko'rsatma tugaguncha yopiq.
//
// SINF TOPSHIRILISHIDAN OLDIN QAYTA `false` QILINADI (§20 p. 36a).
// `check-grade8.mjs` har yugurishda bu haqda ogohlantiradi.
export const FREE_NAV = true

// Ranglar. 11-SINF ETALONIDAN olindi (metodist qarori: «11-sinf etaloni
// kabi qil»). Iliq qog'oz palitrasi, sovuq ko'k YO'Q.
//   accent  -- matematik o'zgargan narsa
//   graph   -- ODZ, chegara, «tekshiruv» qatlami (11-sinfda o'q va grafik)
//   tip     -- xato urinish: AMBER, qizil EMAS (§18)
//   dark    -- faqat nishon va yuqori panel urg'usi; EKRAN FONI EMAS
export const T = {
  bg: '#F3EFE7',
  paper: '#FFFDF8',
  ink: '#171A1D',
  ink2: '#687078',
  ink3: '#9AA2A9',
  ink4: '#C2C8CD',
  accent: '#C9542C',
  accentSoft: '#F8E7DE',
  accentRgb: '201,84,44',
  // 2026-08-13, metodist: «ko'k rang buzadi» -- SOVUQ rang butunlay olib
  // tashlandi. Ilgari bu firuza #176C70 / #DCECEB edi (11-sinf etalonidan).
  // O'rnida ILIQ TOSH rangi: ma'nosi o'sha -- tekshiruv qatlami, ODZ satri,
  // taxmin; lekin qog'oz fonidan chiqib turmaydi.
  graph: '#6B5B45',
  graphSoft: '#EDE4D3',
  graphRgb: '107,91,69',
  ok: '#28774A',
  okSoft: '#E5F2E9',
  okRgb: '40,119,74',
  tip: '#A55D19',
  tipSoft: '#FBEDD9',
  tipInk: '#A55D19',
  tipRgb: '165,93,25',
  // «no» -- xato javob rangi. QIZIL EMAS, amber.
  no: '#A55D19',
  // Uchta maxsus ekran uchun (§14): xuk, qoida, yakun.
  cool: '#6B5B45',
  coolSoft: '#EDE4D3',
  dark: '#1F292B',
  line: 'rgba(23,26,29,.13)',
  line2: 'rgba(23,26,29,.06)',
  shadow: '23,26,29',
}

// MATEMATIKA SHRIFTI: SERIF, monoshirinali EMAS (11-sinf etaloni).
// Sabab: matematik yozuv kitobda serif bilan teriladi, monoshrift esa
// o'zgaruvchini va amal belgisini bir xil kenglikka cho'zib, yozuvni
// jadvalga o'xshatib qo'yadi. O'zgaruvchi KURSIV, son va funksiya nomi TIK
// (ISO 80000-2) -- buni `g8-var` beradi.
export const MATH_FONT = "'Source Serif 4', Georgia, 'Times New Roman', serif"

// Ekran -> bo'lim. 1 xuk / 2 tayanch / 3-8 tushuntirish / 9-13 mashq /
// 14 blits / 15 yakun. Pastki panelning markazida shu bo'lim ko'rsatiladi.
// QOIDA ekrani ALOHIDA bo'lim: §13 da uchastkalar «1 xuk · 2 tayanch ·
// 3-7 tushuntirish · 8 QOIDA · 9-14 mashq · 15 yakun». Ilgari 8-ekran
// tushuntirishga kirib qolgan va pastda «Tushuntirish 6 / 6» yozilgan edi.
export const sectionOf = (screen) => {
  if (screen <= 0) return 'hook'
  if (screen <= 1) return 'support'
  if (screen <= 6) return 'explain'
  if (screen <= 7) return 'rule'
  if (screen <= 12) return 'practice'
  if (screen <= 13) return 'blitz'
  return 'result'
}
export const SECTION_RANGE = {
  hook: [0, 0],
  support: [1, 1],
  explain: [2, 6],
  rule: [7, 7],
  practice: [8, 12],
  blitz: [13, 13],
  result: [14, 14],
}

// ============================================================
// UCH TIL
// ============================================================
export const L = (uz, ru, en) => ({ uz, ru, en })
export const tr = (value, lang) => {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value
  return value[lang] ?? value.ru ?? value.uz ?? ''
}

const LangContext = createContext('ru')
export const LangProvider = LangContext.Provider
export const useLang = () => useContext(LangContext)
export const useT = () => {
  const lang = useLang()
  return useCallback((value) => tr(value, lang), [lang])
}

export const UI_TXT = {
  next: L('Davom etish', 'Продолжить', 'Continue'),
  back: L('Orqaga', 'Назад', 'Back'),
  finish: L('Darsni yakunlash', 'Завершить урок', 'Finish'),
  saved: L('Natija saqlandi', 'Результат сохранён', 'Result saved'),
  check: L('Tekshirish', 'Проверить', 'Check'),
  sound: L('Ovoz', 'Звук', 'Sound'),
  again: L('Qayta', 'Повторить', 'Replay'),
  nextStep: L('keyingi', 'дальше', 'next'),
  odz: L('ODZ', 'ОДЗ', 'Domain'),
  odzFull: L(
    'aniqlanish sohasi',
    'область допустимых значений',
    'domain of admissible values',
  ),
  noValue: L("qiymat yo'q", 'значения нет', 'no value'),
  checkedAt: L('tekshirildi', 'проверено при', 'checked at'),
  writeMore: L(
    "Yozuv tugallanmagan. Qavsni yoping va davom eting.",
    'Запись не дописана. Закрой скобку и продолжай.',
    'The record is incomplete. Close the bracket and continue.',
  ),
  lockedRule: L(
    "Qoida to'g'ri javobdan keyin ochiladi",
    'Правило откроется после верного ответа',
    'The rule opens after a correct answer',
  ),
  readiness4: L(
    "Bu turdagi masalalar yopildi",
    'Этот тип задач закрыт',
    'This type of task is closed',
  ),
  readiness3: L(
    "Bitta joy takrorlashni talab qiladi",
    'Одно место требует повтора',
    'One spot needs another pass',
  ),
  readiness2: L(
    "Qoidaga va o'sha ekranga qayting",
    'Вернись к правилу и к экрану',
    'Go back to the rule and to screen',
  ),
  blitzLead: L(
    "To'rt savol, belgini so'raydi",
    'Четыре вопроса — про признак',
    'Four questions, each about the sign',
  ),
  subject: L('Matematika', 'Математика', 'Mathematics'),
  // Dars RAQAMI bu yerda TURMAYDI: u `META.n` dan `configureLesson` orqali
  // keladi (`lessonNoLabel`). Qotib qolgan raqam 10-sinfda butun sinfga
  // «3-dars» yozib qo'ygan edi — shu xato bu yerda ham turgan (topildi
  // 2026-08-13). Bu zaxira yozuv: raqam berilmasa faqat sinf ko'rinadi.
  lessonNo: L('8-sinf', '8 класс', 'Grade 8'),
  notes: L('Qoralama', 'Черновик', 'Notes'),
  sections: {
    hook: L('Xuk', 'Хук', 'Hook'),
    support: L('Tayanch', 'Опора', 'Prior knowledge'),
    explain: L('Tushuntirish', 'Объяснение', 'Explanation'),
    rule: L('Qoida', 'Правило', 'Rule'),
    practice: L('Mashq', 'Практика', 'Practice'),
    blitz: L('Blits', 'Блиц', 'Blitz'),
    result: L('Yakun', 'Итог', 'Summary'),
  },
}

// ============================================================
// OVOZ: HTTP TTS v5.2 (MIGRATION_v5_2_math.md)
//   {base}/api/tts?text=<encoded>&g=m|f
// Jangovar yo'lda speechSynthesis TAQIQLANGAN, u faqat lokal previu zaxirasi.
// «To'g'ri/xato» signali YO'Q: ovoz faqat gap (§15).
// ============================================================
let cfg = {
  ttsApiBase: '',
  correctSoundUrl: '',
  wrongSoundUrl: '',
  aiGradingEndpoint: '',
  studentName: '',
  voiceGender: 'm', // 8-sinf: erkak ovoz (metodist qarori 2026-08-06)
  lessonId: '',     // ovoz keshi darslar bo'yicha ajralsin
  lessonTitle: null,
  lessonNo: null,   // yuqori paneldagi «8 класс · урок N». MA'LUMOTDAN keladi.
}
export const configureLesson = (next) => { cfg = { ...cfg, ...next } }

// Yuqori paneldagi yozuv. Raqam `META.n` dan keladi, yadroda qotmaydi.
export const lessonNoLabel = () => {
  const n = cfg.lessonNo
  if (!n) return UI_TXT.lessonNo
  return L('8-sinf · ' + n + '-dars', '8 класс · урок ' + n, 'Grade 8 · lesson ' + n)
}

// Til — matn ichida yetakchi marker: [O'zbekcha tallaffuz] / [Русское произношение].
// Uni BIR marta qo'yamiz — dvigatel, TTSga jo'natishdan oldin.
const LANG_TAG = {
  uz: "[O'zbekcha tallaffuz]",
  ru: '[Русское произношение]',
  en: '[English pronunciation]',
}
const LEAD_TAG_RE = /^\s*\[(Русское произношение|O'zbekcha tallaffuz|English pronunciation)\]/
const withLangTag = (text, lang) => {
  const s = String(text == null ? '' : text).trim()
  if (!s) return s
  if (LEAD_TAG_RE.test(s)) return s
  return (LANG_TAG[lang] || LANG_TAG.uz) + ' ' + s
}

// lesson_id va lesson_name — server ovoz keshini darslar bo'yicha ajratsin,
// hammasi bitta uyumda yotmasin. student_uuid yubormaymiz: LMS uni bermaydi.
const lessonMetaQuery = (lang) => {
  if (!cfg.lessonId) return ''
  const title = cfg.lessonTitle || null
  const name = title ? (title[lang] || title.ru || title.uz || '') : ''
  return '&lesson_id=' + encodeURIComponent(cfg.lessonId)
       + (name ? '&lesson_name=' + encodeURIComponent(name) : '')
}

export function buildTtsUrl(base, text, gender, lang) {
  const clean = String(base || '').replace(/\/$/, '')
  const g = gender === 'f' ? 'f' : 'm'
  const raw = withLangTag(text, lang)
  const enc = encodeURIComponent(String(raw || '')).replace(/%5B/g, '[').replace(/%5D/g, ']')
  return clean + '/api/tts?text=' + enc + '&g=' + g + lessonMetaQuery(lang)
}

const locale = (lang) => (lang === 'ru' ? 'ru-RU' : lang === 'en' ? 'en-GB' : 'uz-UZ')

class AudioEngine {
  constructor() {
    this.queue = []
    this.idx = 0
    this.isPlaying = false
    this.completed = false
    this.gender = 'm'
    this.lang = 'ru'
    this.onStateChange = null
    this.el = null
  }

  setGender(g) { this.gender = g === 'f' ? 'f' : 'm' }
  setLang(lang) { this.lang = lang }
  emit(patch) { if (this.onStateChange) this.onStateChange(patch) }

  load(segments) {
    this.stop()
    this.queue = Array.isArray(segments) ? segments : []
    this.idx = 0
    this.completed = this.queue.length === 0
    this.emit({ isPlaying: false, completed: this.completed })
  }

  start() {
    this.idx = 0
    if (!this.queue.length) {
      this.completed = true
      this.emit({ isPlaying: false, completed: true })
      return
    }
    this.play(this.idx)
  }

  // Hodisaga bog'langan bo'lak O'ZI KUTADI. grade1/2/5 dagi xato shu yerda edi.
  play(i) {
    const seg = this.queue[i]
    if (!seg) {
      this.isPlaying = false
      this.completed = true
      this.emit({ isPlaying: false, completed: true })
      return
    }
    if (typeof seg.trigger === 'string' && seg.trigger.indexOf('on_event:') === 0) {
      this.isPlaying = false
      this.emit({ isPlaying: false })
      return
    }
    this.speak(seg)
  }

  speak(seg) {
    // Bo'lak yo'q bo'lsa JIM qolamiz va navbatni SURMAYMIZ: `after()` chaqirsak,
    // mavjud bo'lmagan bo'lak uchun keyingisi o'tkazib yuborilardi.
    if (!seg) { this.isPlaying = false; this.emit({ isPlaying: false }); return }
    const text = String(seg.text || '')
    if (!text) { this.after(); return }
    if (cfg.ttsApiBase) {
      if (!this.el) this.el = new Audio()
      const el = this.el
      el.onended = null
      el.onerror = null
      el.src = buildTtsUrl(cfg.ttsApiBase, text, seg.g || this.gender, seg.lang || this.lang)
      el.onended = () => this.after()
      el.onerror = () => this.after()
      this.isPlaying = true
      this.emit({ isPlaying: true, seg: seg.id || null })
      const started = el.play()
      if (started && typeof started.catch === 'function') started.catch(() => this.after())
      return
    }
    if (typeof window === 'undefined' || !window.speechSynthesis) { this.after(); return }
    const synth = window.speechSynthesis
    try { synth.cancel() } catch { /* previu cheklovi */ }
    const u = new window.SpeechSynthesisUtterance(text)
    u.lang = locale(seg.lang || this.lang)
    u.rate = 1.0
    u.onend = () => this.after()
    u.onerror = () => this.after()
    this.isPlaying = true
    this.emit({ isPlaying: true, seg: seg.id || null })
    try { synth.speak(u) } catch { this.after() }
  }

  after() {
    this.isPlaying = false
    this.idx += 1
    if (this.idx >= this.queue.length) {
      this.completed = true
      this.emit({ isPlaying: false, completed: true })
      return
    }
    this.emit({ isPlaying: false })
    this.play(this.idx)
  }

  // Ekranda qadam ochilganda chaqiriladi.
  fire(name) {
    const want = 'on_event:' + name
    for (let i = this.idx; i < this.queue.length; i += 1) {
      if (this.queue[i].trigger === want) {
        this.idx = i
        this.speak(this.queue[i])
        return
      }
    }
  }

  // Navbatdan tashqari bitta gap: kontrprimer razbori shu yerdan aytiladi.
  //
  // `idx` NAVBAT ICHIDA turishiga kafolat YO'Q: dvijok modul darajasidagi
  // yakka nusxa, navbat effektlardan va `setTimeout` dan o'zgaradi, ekran
  // almashganda esa eski ekranning `say` i yangi navbatga tushishi mumkin.
  // Shuning uchun joy QISQARTIRILADI. Qisqartirmaganda `queue[idx]`
  // undefined bo'lib, `speak` yiqilardi — va bu XATO JAVOB yo'lida edi:
  // razbor aytilishi kerak bo'lgan joyda dars butunlay to'xtardi
  // (topildi 2026-08-13, telefon o'lchamida prokliklashda).
  once(text) {
    if (!text) return
    const at = Math.min(Math.max(this.idx, 0), this.queue.length)
    this.queue.splice(at, 0, { text, trigger: 'manual' })
    this.idx = at
    this.speak(this.queue[at])
  }

  replay() {
    if (!this.queue.length) return
    if (this.idx > 0) this.idx -= 1
    if (this.idx >= this.queue.length) this.idx = this.queue.length - 1
    this.speak(this.queue[this.idx])
  }

  stop() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try { window.speechSynthesis.cancel() } catch { /* previu cheklovi */ }
    }
    if (this.el) { try { this.el.pause() } catch { /* previu cheklovi */ } }
    this.isPlaying = false
    this.emit({ isPlaying: false })
  }
}

let engine = null
export const getAudioEngine = () => {
  if (typeof window === 'undefined') return null
  if (!engine) engine = new AudioEngine()
  return engine
}

// Ovoz bo'laklari: [{ on: 'mount' | '<qadam nomi>', text: L(...) }]
export function useAudio(segments) {
  const lang = useLang()
  const [state, setState] = useState({ isPlaying: false, completed: false, muted: false, seg: null })
  const ref = useRef(null)

  const key = useMemo(() => JSON.stringify(segments || []), [segments])
  const stable = useMemo(() => segments || [], [key]) // eslint-disable-line react-hooks/exhaustive-deps

  const queue = useMemo(() => stable.map((s, i) => ({
    id: s.on || ('s' + i),
    text: tr(s.text, lang),
    // Tushuntirish O'ZI boradi. `wait: true` — o'quvchining qadamini kutadi.
    trigger: i === 0 ? 'on_mount' : (s.wait ? 'on_event:' + s.on : 'after_previous'),
  })), [stable, lang])

  useEffect(() => {
    const e = getAudioEngine()
    if (!e) return undefined
    ref.current = e
    e.onStateChange = (patch) => setState((prev) => ({ ...prev, ...patch }))
    e.setLang(lang)
    e.setGender(cfg.voiceGender || 'm')
    if (state.muted) {
      // Ovoz o'chiq: navbat bo'sh, `completed` qaytarishda hisoblanadi.
      e.load([])
      return () => e.stop()
    }
    e.load(queue)
    const timer = setTimeout(() => e.start(), 240)
    return () => { clearTimeout(timer); e.stop() }
  }, [queue, state.muted, lang])

  const step = useCallback((name) => {
    if (ref.current && !state.muted) ref.current.fire(name)
  }, [state.muted])

  const say = useCallback((text) => {
    if (!ref.current || state.muted || !text) return
    const e = ref.current
    setTimeout(() => { if (!state.muted) e.once(text) }, 260)
  }, [state.muted])

  const replay = useCallback(() => {
    if (ref.current && !state.muted) ref.current.replay()
  }, [state.muted])

  const toggleMute = useCallback(() => {
    setState((prev) => {
      if (!prev.muted && ref.current) ref.current.stop()
      return { ...prev, muted: !prev.muted, isPlaying: false }
    })
  }, [])

  // Ovoz o'chiq bo'lsa `completed` — doim true: qulflar ochiq turishi shart (§12).
  return { ...state, completed: state.muted ? true : state.completed, step, say, replay, toggleMute }
}


// ============================================================
// JAVOB TOVUSHI. Metodist qarori 2026-08-06: 3-sinf mexanikasi QAYTARILDI.
// Platformadan URL kelsa shuni, kelmasa qisqa signal.
// ============================================================
let chimeCtx = null
function chime(up) {
  if (typeof window === 'undefined') return
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return
  if (!chimeCtx) chimeCtx = new AC()
  if (chimeCtx.state === 'suspended') { try { chimeCtx.resume() } catch { /* jest */ } }
  const freqs = up ? [660, 880] : [330, 247]
  const now = chimeCtx.currentTime
  freqs.forEach((f, i) => {
    const o = chimeCtx.createOscillator()
    const g = chimeCtx.createGain()
    o.type = 'sine'
    o.frequency.value = f
    const t0 = now + i * 0.1
    g.gain.setValueAtTime(0.0001, t0)
    g.gain.exponentialRampToValueAtTime(0.13, t0 + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.17)
    o.connect(g)
    g.connect(chimeCtx.destination)
    o.start(t0)
    o.stop(t0 + 0.19)
  })
}

export function useSfx() {
  const okRef = useRef(null)
  const noRef = useRef(null)
  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    if (cfg.correctSoundUrl) { const a = new Audio(cfg.correctSoundUrl); a.preload = 'auto'; a.volume = 0.6; okRef.current = a }
    if (cfg.wrongSoundUrl) { const a = new Audio(cfg.wrongSoundUrl); a.preload = 'auto'; a.volume = 0.6; noRef.current = a }
    return () => { okRef.current = null; noRef.current = null }
  }, [])
  const play = useCallback((up) => {
    const a = up ? okRef.current : noRef.current
    if (!a) { chime(up); return }
    try { a.currentTime = 0; const p = a.play(); if (p && p.catch) p.catch(() => {}) } catch { chime(up) }
  }, [])
  return { playCorrect: () => play(true), playWrong: () => play(false) }
}

// ============================================================
// MOBIL ZOOM: layout doim 390px (src/books/MOBIL_DESKTOP_MOSLASH.md)
// ============================================================
const MOBILE_W = 390
export function useMobileZoom(breakpoint = 640) {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const root = document.documentElement
    const apply = () => {
      const z = window.innerWidth < breakpoint ? window.innerWidth / MOBILE_W : 1
      root.style.setProperty('--g8z', String(z))
    }
    apply()
    window.addEventListener('resize', apply)
    window.addEventListener('orientationchange', apply)
    return () => {
      window.removeEventListener('resize', apply)
      window.removeEventListener('orientationchange', apply)
      root.style.removeProperty('--g8z')
    }
  }, [breakpoint])
}

// ============================================================
// QULFLAR. Ovoz o'chiq bo'lsa HAM ochilishi shart.
// ============================================================
export function useCanAnswer(audio) {
  const [timedOut, setTimedOut] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), 12000)
    return () => clearTimeout(timer)
  }, [])
  return FREE_NAV || audio.muted || audio.completed || timedOut
}

// KO'RSATMA QULFI. `useCanAnswer` dan farqi: `FREE_NAV` ga bog'liq EMAS.
//
// Sabab (§13.3 p. 8): `FREE_NAV` — ishlab chiqish fazasi, javob qulfi esa
// metodik talab. Ikkisi bitta qiymatga bog'lansa, ishlab chiqish rejimi
// metodikani o'chirib qo'yadi — aynan shu holat redaksiya 1 da edi va §20 p. 34
// bajarilmagan bo'lib chiqdi.
//
// Ovoz o'chiq bo'lsa DARHOL ochiladi. 12 soniya — zaxira: TTS jim bo'lsa
// (saytda /api/tts javob bermasa) dars qotib qolmaydi.
// Qulf bir marta ochilsa, YOPILMAYDI: ovozni o'chirib-yoqish javobni qaytadan
// qulflab qo'ymasligi kerak. Shuning uchun taymer ekran mount bo'lganda bir
// marta qo'yiladi va effekt ichida setState bilan tiklanmaydi.
export function useInstructionGate(audio) {
  const [timedOut, setTimedOut] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), 12000)
    return () => clearTimeout(timer)
  }, [])
  return audio.muted || audio.completed || timedOut
}

export function useAdvanceGate(solved, audio) {
  const [waited, setWaited] = useState(false)
  useEffect(() => {
    if (!solved) return undefined
    const timer = setTimeout(() => setWaited(true), 700)
    return () => clearTimeout(timer)
  }, [solved])
  if (FREE_NAV) return true
  if (!solved) return false
  if (audio.muted) return true
  return waited && !audio.isPlaying
}

// ============================================================
// QADAMBA-QADAM OCHILISH, OVOZ BILAN SINXRON.
//
// Ekran bir marta emas, QADAM-QADAM ochiladi va har qadamning O'Z ovoz
// bo'lagi bor: qadam ochilganda aynan shu bo'lak gapiradi (on_event:sN).
//
// Kim boshqaradi (metodist qarori 2026-08-06):
//   TUSHUNTIRISHNI O'QUVCHI EMAS, DARSNING O'ZI OCHADI.
//   ovoz YONIQ  -- bo'laklar ketma-ket gapiradi, ekran gapga qarab ochiladi.
//                  Dvijok `seg` da qaysi bo'lak gapirayotganini aytadi.
//   ovoz O'CHIQ -- qadamlar TAYMER bilan ochiladi (2,6 s), ya'ni tushuntirish
//                  baribir o'zi boradi.
//   «keyingi» — faqat TEZLATGICH, majburiyat emas.
//
// `speaking` — hozir gapirilmoqda: javob shu vaqtda YOPIQ turadi (§15).
// ============================================================
export function useSteps(total, audio, opts) {
  const o = opts || {}
  const name = o.name || 's'
  const ms = o.ms || 2600
  const [i, setI] = useState(0)

  // 1) OVOZ YONIQ: qadamni GAP boshqaradi. Dvijok qaysi bo'lak gapirayotganini
  //    aytadi (`seg`), ekran esa shu raqamgacha ochiladi. 3-sinf, Dars01 naqshi.
  useEffect(() => {
    if (!audio.seg) return
    // Ovoz dvijoki -- TASHQI tizim: qaysi bo'lak gapirayotgani o'zgarganda
    // ekran qadamini yangilaymiz. Qoida aynan shu holatga ruxsat beradi.
    const m = new RegExp('^' + name + '([0-9]+)$').exec(audio.seg)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (m) setI((v) => Math.max(v, Number(m[1])))
  }, [audio.seg, name])

  // 2) OVOZ O'CHIQ: tushuntirish baribir O'ZI ochilishi kerak, shuning uchun
  //    taymer. Bu «o'quvchi bosib turadi» degani EMAS (metodist, 2026-08-06).
  useEffect(() => {
    if (!audio.muted || i >= total - 1) return undefined
    const id = setTimeout(() => setI((v) => Math.min(total - 1, v + 1)), ms)
    return () => clearTimeout(id)
  }, [audio.muted, i, total, ms])

  // 2a) QOROVUL (§13.3 p. 5). Ovoz YONIQ, lekin «bo'lak tugadi» hodisasi
  //     kelmadi — masalan platforma TTS ni bermadi va `muted` ham qo'yilmagan.
  //     Shu holatda ekran MANGU turib qolardi. Qorovul qadamni o'zi suradi.
  //     Kutish: o'qish bahosi + 1,5 s. Har qadam uchun qaytadan hisoblanadi.
  useEffect(() => {
    if (audio.muted || i >= total - 1) return undefined
    const guard = setTimeout(() => {
      setI((v) => (v === i ? Math.min(total - 1, v + 1) : v))
    }, ms + 1500)
    return () => clearTimeout(guard)
  }, [audio.muted, audio.seg, i, total, ms])

  // 3) «keyingi» — tezlatgich: kutgisi kelmagan o'quvchi uchun.
  const next = useCallback(() => setI((v) => Math.min(total - 1, v + 1)), [total])

  return { i, next, atLast: i >= total - 1, speaking: !!audio.isPlaying }
}

// «keyingi» — ingichka matn tugmasi. Pulsatsiya qilmaydi, chaqirmaydi:
// ovoz yoniq bo'lsa u umuman kerak emas.
export const NextStep = ({ onClick, show = true, label }) => {
  const t = useT()
  if (!show) return null
  return (
    <button type="button" className="g8-nextstep" onClick={onClick}>
      {label ? t(label) : t(UI_TXT.nextStep)}
    </button>
  )
}

// ============================================================
// UI PRIMITIVLARI. Kattalar uchun: zich, tinch, kam harakat.
// ============================================================

// Joy egallaydigan blok. BO'SH bo'lsa — umuman chizilmaydi.
//
// Metodist, 2026-08-14: «hamma kontent YUQORIDA bo'lsin». Ilgari bo'sh slot
// ham o'z balandligini band qilardi, va u KONTENT ORASIDA turardi: maydon
// bilan ODZ satri orasida 74 pikselli teshik paydo bo'lardi. Endi bo'sh slot
// yo'q, ya'ni bloklar tepaga zich yig'iladi, bo'sh joy esa hammasi PASTDA.
//
// Ekran shundan «sakramaydi»: yangi blok doim OXIRGIsining ostida paydo
// bo'ladi, tepasidagi hech narsa siljimaydi (§14 p. 4 — kontent yuqoridan).
// `h` berilgan bo'lsa balandlik qat'iy va bo'sh bo'lsa ham saqlanadi:
// chizma yoki jadval o'z joyini oldindan oladi.
export const Slot = ({ h, mh, children, style, className }) => {
  const empty = React.Children.toArray(children).length === 0
  if (empty && h === undefined) return null
  return (
    <div className={className} style={{ height: h, minHeight: mh, flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', ...style }}>
      {children}
    </div>
  )
}


// Точки шагов: сколько шагов на экране и где ученик сейчас.
export const StepDots = ({ total, at }) => (
  total > 1 ? (
    <span className="g8-dots" role="img" aria-label={String(at + 1) + '/' + String(total)}>
      {Array.from({ length: total }, (_, i) => (
        <i key={i} className={i < at ? 'is-done' : i === at ? 'is-now' : ''} />
      ))}
    </span>
  ) : null
)

export const Eyebrow = ({ children, right }) => (
  <div className="g8-eyebrow">
    <span>{children}</span>
    {right ? <span className="g8-eyebrow-right">{right}</span> : null}
  </div>
)

export const Title = ({ children }) => <h1 className="g8-title">{children}</h1>

export const Lead = ({ children }) => (children ? <p className="g8-lead">{children}</p> : null)

// SAVOL SO'Z bilan. Manrope, ko'chirish BILAN.
//
// Nima uchun alohida komponent: savol matni `Row` ga (`.g8-m`) qo'yilgan edi,
// u esa JetBrains Mono va `white-space: nowrap`. Monoshirinali nowrap prozа
// chetga chiqadi va SHUNCHAKI YO'Q BO'LADI -- prokrutka yo'q, `.g8-body` da
// `overflow: clip`. 11-sinfda bu 557 piksel vylet bergan (§14).
// Monoshirinali FAQAT matematika uchun.
export const Ask = ({ children }) => (children ? <p className="g8-ask">{children}</p> : null)

// Matematik satr. tone: 'ink' | 'accent' | 'dim' | 'none'
export const Row = ({ children, size = 'row', tone, align, pop }) => (
  <div
    className={'g8-m g8-m-' + size + (pop ? ' g8-pop' : '') + (tone ? ' g8-t-' + tone : '')}
    style={align ? { textAlign: align } : undefined}
  >
    {children}
  </div>
)

// IKKI QAVATLI kasr: chiziq bilan, slash bilan EMAS (§20 p.19).
// num va den — matn yoki JSX. tone: butun kasrga; strike: qisqartirilgan ko'paytuvchi.
export const Frac = ({ num, den, size = 'row', tone, gone }) => (
  <span className={'g8-frac g8-frac-' + size + (tone ? ' g8-t-' + tone : '') + (gone ? ' g8-gone' : '')}>
    <span className="g8-frac-n">{num}</span>
    <span className="g8-frac-bar" />
    <span className="g8-frac-d">{den}</span>
  </span>
)

// Yozuv ichida qisqaradigan ko'paytuvchi: yuqorida ham, pastda ham BIR VAQTDA o'chadi.
export const Cancel = ({ children, off }) => (
  <span className={'g8-cancel' + (off ? ' g8-cancel-off' : '')}>{children}</span>
)

// ODZ satri. Maxrajda harf bo'lsa BIRINCHI soniyadan turadi (§4).
export const OdzLine = ({ value, blink, empty, children }) => {
  const t = useT()
  return (
    <div className={'g8-odz' + (blink ? ' g8-odz-blink' : '') + (empty ? ' g8-odz-empty' : '')}>
      <span className="g8-odz-tag">{t(UI_TXT.odz)}</span>
      {/* Qiymat uch tilli yozuv ham bo'lishi mumkin («taqiq yo'q»), shuning
          uchun t() SHART: L obyekti to'g'ridan-to'g'ri chizilsa React yiqiladi
          (xato 31, topildi 2026-08-13 brauzer prokliklashida). */}
      <span className="g8-odz-body">{children || t(value)}</span>
    </div>
  )
}

// Javob berilgan topshiriq shu satrga yig'iladi. Galochka YO'Q -- shunchaki ingichka.
export const ClosedRow = ({ children }) => (
  <div className="g8-closed">
    <span className="g8-closed-tick">{'\u2713'}</span>
    <span>{children}</span>
  </div>
)

export const Btn = ({ children, onClick, disabled, tone = 'solid', style, wide, ready }) => (
  <button
    type="button"
    className={'g8-btn g8-btn-' + tone + (wide ? ' g8-btn-wide' : '') + (ready && !disabled ? ' g8-btn-ready' : '')}
    onClick={onClick}
    disabled={disabled}
    style={style}
  >
    {children}
  </button>
)

// Variantlar. Bu 8-sinfda ISTISNO: darsda ko'pi bilan uch ekran (§10).
// A B C D nishonlari yo'q, yashil chaqnash yo'q, kaskad yo'q.
// Tanlangan to'g'ri javob: chapda 2px chiziq. Xatosi: o'chadi va tanlanmaydi.
const BADGES = ['A', 'B', 'C', 'D', 'E', 'F']

// Metodist qarori 2026-08-06: 3-sinf mexanikasi QAYTARILDI --
// A B C D nishoni, to'g'ri javob YASHIL bo'ladi (1200 ms), xatosi SARIQ,
// qolganlari xiralashadi.
// tone: 'ok' (default) | 'cool'. 'cool' \u2014 TAXMIN ekrani: firuza fon, nishoni
// HARF bo'lib qoladi, galochka YO'Q. Taxmin baholanmaydi (\u00a714).
export const Choice = ({ items, picked, wrong, onPick, disabled, cols = 1, multi, checked, tone = 'ok', dense }) => {
  const solved = multi ? false : !!picked
  const cool = tone === 'cool'
  return (
    <div
      className={'g8-choice' + (dense ? ' g8-choice-dense' : '')}
      style={{ gridTemplateColumns: 'repeat(' + cols + ', minmax(0, 1fr))' }}
    >
      {items.map((item, i) => {
        const isPicked = multi ? (checked || []).indexOf(item.id) !== -1 : picked === item.id
        const isWrong = (wrong || []).indexOf(item.id) !== -1
        const dim = solved && !isPicked && !isWrong
        const cls = ['g8-opt']
        if (isPicked) cls.push(cool ? 'g8-opt-cool' : 'g8-opt-ok')
        else if (isWrong) cls.push('g8-opt-tip')
        else if (dim) cls.push('g8-opt-dim')
        const badge = cool
          ? BADGES[i]
          : (isPicked ? '\u2713' : isWrong ? '\u21ba' : BADGES[i])
        return (
          <button
            type="button"
            key={item.id}
            className={cls.join(' ')}
            // Belgilangan variant BOSILMAYDI: ko'p tanlovli savolda uni qayta
            // bosish hech narsa qilmaydi, lekin o'quvchi «ishladi» deb o'ylaydi
            // va qolgan to'g'ri variantni izlamaydi.
            disabled={disabled || isWrong || (multi ? isPicked : !!picked)}
            onClick={() => onPick(item)}
          >
            <span className="g8-opt-badge">{badge}</span>
            <span className="g8-opt-text">{item.label}</span>
          </button>
        )
      })}
    </div>
  )
}

// KONTRPRIMER — 8-sinfning asosiy javob shakli (§2.1 p.4).
// «Xato» degan so'z yo'q: son bor va ikki qiymat yonma-yon turadi.
export const Counterexample = ({ at, mine, ref: refVal, note, labelMine, labelRef }) => {
  const t = useT()
  return (
    <div className="g8-cx">
      <div className="g8-cx-head">
        {at != null ? <span className="g8-cx-at">{at}</span> : null}
        {note ? <span className="g8-cx-note">{t(note)}</span> : null}
      </div>
      {mine !== undefined ? (
        <div className="g8-cx-vals">
          <span><i>{labelRef ? t(labelRef) : ''}</i> {fmt(refVal)}</span>
          <span className="g8-cx-vs">≠</span>
          <span><i>{labelMine ? t(labelMine) : ''}</i> {fmt(mine)}</span>
        </div>
      ) : null}
    </div>
  )
}

// Qiymatlarni solishtirish uchun ikki xona kifoya (§ raskadrovka, ekran 1).
export function fmt(v) {
  if (v === null || v === undefined) return '—'
  if (typeof v !== 'number') return String(v)
  if (Number.isInteger(v)) return String(v)
  return v.toFixed(2).replace(/\.?0+$/, '')
}

// Tinch xabar: tasdiq ham, izoh ham. Rang-mukofot YO'Q.
// kind: 'plain' | 'ok' | 'no'
export const Note = ({ kind = 'plain', children }) => (
  children ? <div className={'g8-note g8-note-' + kind}>{children}</div> : null
)

// Qoida kartochkasi (ekran 8). Satrlar navbat bilan, 0.18s.
//
// `masked` — kartochka YOPIQ: to'g'ri javobdan oldingi holat (§13, «Ekran 1 va
// 8 batafsil»). Yopiq holatda AYNAN SHU kartochka, AYNAN shuncha satr bilan
// chiziladi, faqat matn o'rniga xira chiziq turadi. Shuning uchun ochilganda
// balandlik O'ZGARMAYDI va ekran SAKRAMAYDI -- alohida «qulf» blokining
// balandligini kartochkaga moslashtirib o'lchash kerak emas, u qurilishi
// bo'yicha bir xil.
export const RuleCard = ({ lines, source, title, masked, lockLabel }) => {
  const t = useT()
  return (
    <div className={'g8-rule' + (masked ? ' g8-rule-masked' : '')}>
      {title ? <span className="g8-rule-title">{title}</span> : null}
      {lines.map((line, i) => (
        <span
          key={i}
          className={'g8-rule-line' + (i === 0 ? ' g8-rule-first' : '')}
          style={masked ? undefined : { animationDelay: i * 0.18 + 's' }}
        >
          {masked ? <s className="g8-rule-bar" aria-hidden="true" /> : line}
        </span>
      ))}
      {source ? (
        <span className="g8-rule-src" style={masked ? undefined : { animationDelay: lines.length * 0.18 + 's' }}>
          {masked ? <s className="g8-rule-bar g8-rule-bar-short" aria-hidden="true" /> : source}
        </span>
      ) : null}
      {masked ? (
        <span className="g8-rule-locked">{lockLabel ? t(lockLabel) : t(UI_TXT.lockedRule)}</span>
      ) : null}
    </div>
  )
}

// ============================================================
// STAGE. Skroll YO'Q: .g8-body overflow: clip. Kontent YUQORIDAN.
// STYLES ichida backtick ISHLATILMAYDI (fayl buziladi).
// ============================================================
// field (§14): undefined — oq ish maydoni; 'hook' — firuza; 'rule' — apelsin;
// 'summary' — yashil. O'zgaradigan narsa AYNAN BITTA: maydon rangi. Shapka,
// pastki panel, tugma o'lchamlari va shrift shkalasi bir xil qoladi —
// aks holda ekran boshqa mahsulot bo'lib o'qiladi.
// QORALAMA. 11-sinfda bu alohida panel: o'quvchi yo'l-yo'lakay yozadi, va
// yozganlari 15-ekranga «sizning yozuvlaringiz» bo'lib chiqadi (§13).
export const NotesPanel = ({ open, onClose, value, onChange }) => {
  const t = useT()
  if (!open) return null
  return (
    <div className="g8-notespanel">
      <div className="g8-notespanel-h">
        <span>{t(UI_TXT.notes)}</span>
        <button type="button" className="g8-notespanel-x" onClick={onClose} aria-label="close">✕</button>
      </div>
      <textarea
        className="g8-notespanel-t"
        value={value || ''}
        onChange={(e) => onChange && onChange(e.target.value)}
        spellCheck={false}
      />
    </div>
  )
}

// STAGE -- 11-sinf etaloni tuzilishi:
//   yuqori panel: nishon, fan va dars, SEGMENTLI progress, bo'lim nomi, asboblar
//   ish zonasi: kontent + qoralama paneli
//   pastki panel: uch katak -- orqaga, bo'lim hisobi, davom
// Balandliklar `vh` bo'yicha qisqaradi: 615px noutbukda qat'iy 88px panel
// kontentga joy qoldirmaydi.
export const Stage = ({
  eyebrow, right, screen, total, audio, back, next, navCenter, children, field,
  notes, onNotes,
}) => {
  const t = useT()
  const [notesOpen, setNotesOpen] = useState(false)
  const sect = sectionOf(screen)
  const [from, to] = SECTION_RANGE[sect] || [screen, screen]
  const inSection = screen - from + 1
  const sectionSize = to - from + 1

  // Asboblar IKKI joyda chizilishi kerak: kompyuterda yuqori qatorda,
  // telefonda brovka qatorida. Sabab §14 da: 390 px da sayt qobig'ining til
  // almashtirgichi (fiksirlangan, o'ngdan 8 px, eni 144) AYNAN yuqori qator
  // ustida turadi va ovoz tugmasini BOSISHGA QO'YMAYDI -- Playwright buni
  // «pointer events intercepted» deb ko'rsatdi (o'lchandi 2026-08-13).
  // Yonida joy yo'q, shuning uchun yuqori qator telefonda olib tashlanadi.
  const tools = (
    <>
      <button
        type="button"
        className={'g8-tool' + (notesOpen ? ' is-on' : '')}
        onClick={() => setNotesOpen((v) => !v)}
        title={t(UI_TXT.notes)}
        aria-label={t(UI_TXT.notes)}
      >
        <b aria-hidden="true">✎</b><i>{t(UI_TXT.notes)}</i>
      </button>
      <button type="button" className="g8-tool" onClick={audio.replay} title={t(UI_TXT.again)} aria-label={t(UI_TXT.again)}>
        <b aria-hidden="true">↺</b>
      </button>
      <button
        type="button"
        className={'g8-tool g8-tool-sound' + (audio.muted ? ' is-off' : ' is-on')}
        onClick={audio.toggleMute}
        title={t(UI_TXT.sound)}
        aria-label={t(UI_TXT.sound)}
      >
        <b aria-hidden="true">{audio.muted ? '✕' : '♪'}</b>
        {audio.isPlaying ? <s className="g8-tool-wave" aria-hidden="true" /> : null}
      </button>
    </>
  )

  return (
    <div className="g8-stage">
      <div className="g8-head">
        <div className="g8-top">
          <span className="g8-mark" aria-hidden="true">M<b>8</b></span>
          <span className="g8-top-title">
            {t(UI_TXT.subject)}<span className="g8-dot">·</span>{t(lessonNoLabel())}
          </span>
          <span className="g8-seg" role="img" aria-label={String(screen + 1) + '/' + String(total)}>
            {Array.from({ length: total }, (_, i) => (
              <i key={i} className={'g8-seg-i' + (i < screen ? ' is-done' : i === screen ? ' is-now' : '')} />
            ))}
          </span>
          <span className="g8-top-sect">{t(UI_TXT.sections[sect])}</span>
          <span className="g8-count">{screen + 1}/{total}</span>
          <span className="g8-top-tools">{tools}</span>
        </div>
        <div className="g8-eyebrow">
          <span>{eyebrow}</span>
          {right ? <span className="g8-eyebrow-right">{right}</span> : null}
          <span className="g8-tools-phone">{tools}</span>
        </div>
      </div>

      <div className="g8-body">
        {/* `g8-cascade`: bloklar ketma-ket chiqadi (1-5-sinf naqshi, fade-up
            delay-1/2/3). O'qish tartibi HARAKAT bilan beriladi. */}
        <div className={'g8-stack g8-cascade' + (field ? ' g8-zone g8-zone-' + field : '')}>{children}</div>
        <NotesPanel open={notesOpen} onClose={() => setNotesOpen(false)} value={notes} onChange={onNotes} />
      </div>

      <div className="g8-nav">
        <span className="g8-nav-l">{back}</span>
        <span className="g8-nav-c">
          {navCenter || (t(UI_TXT.sections[sect]) + '  ' + inSection + ' / ' + sectionSize)}
        </span>
        <span className="g8-nav-r">{next}</span>
      </div>
    </div>
  )
}

export const STYLES = `
html:has(.lesson-root),
body:has(.lesson-root),
#root:has(.lesson-root),
.lesson-page:has(.lesson-root),
.lesson-frame:has(.lesson-root) {
  width: 100%;
  height: 100%;
  min-height: 0 !important;
  overflow: hidden !important;
  overscroll-behavior: none;
}
html, body { margin: 0; padding: 0; }
.lesson-root, .lesson-root * { box-sizing: border-box; }

/* ============ FON: faqat CSS, rasm YO'Q (11-sinf etaloni) ============
   Iliq qog'oz, ustida 32px to'r va ikki yumshoq dog'. Qora fon YO'Q. */
.lesson-root {
  position: fixed;
  inset: 0;
  overflow: clip;
  overscroll-behavior: none;
  isolation: isolate;
  font-family: 'Manrope', system-ui, sans-serif;
  color: ${T.ink};
  -webkit-font-smoothing: antialiased;
  zoom: var(--g8z, 1);
  background:
    radial-gradient(circle at 82% 18%, rgba(${T.graphRgb},.09), transparent 30%),
    radial-gradient(circle at 16% 88%, rgba(${T.accentRgb},.07), transparent 34%),
    linear-gradient(rgba(23,26,29,.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(23,26,29,.025) 1px, transparent 1px),
    ${T.bg};
  background-size: auto, auto, 32px 32px, 32px 32px, auto;
}
@media (max-width: 639.98px) { .lesson-root { width: 390px; } }
.lesson-root h1, .lesson-root h2, .lesson-root p { margin: 0; padding: 0; }
.lesson-root button { font: inherit; }
.lesson-root :focus-visible { outline: 2px solid ${T.graph}; outline-offset: 3px; border-radius: 10px; }

/* ============ KARKAS ============ */
.g8-stage {
  position: relative;
  z-index: 1;
  width: min(1258px, 100%);
  height: 100%;
  margin: 0 auto;
  padding: 0 clamp(14px, 4vw, 54px);
  display: flex;
  flex-direction: column;
}
/* Sayt qobig'i yuqori qatorni IKKI TOMONDAN bosadi: chapda «Darslar
   ro'yxati» tugmasi, o'ngda UZ/RU/EN tanlagichi. Ular dars ichida emas,
   qobiqda -- shuning uchun ularni surib bo'lmaydi, faqat joy berish mumkin.
   Joy berilmasa ovoz va «qayta» tugmalari tanlagich ostiga kirib ketadi. */
@media (min-width: 1024px) { .g8-head { padding-left: 92px; padding-right: 166px; } }
.g8-head {
  flex-shrink: 0;
  min-height: clamp(50px, 9.5vh, 88px);
  padding-top: clamp(8px, 1.6vh, 16px);
  padding-bottom: clamp(4px, 1vh, 10px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: clamp(4px, .8vh, 9px);
}
.g8-body {
  flex: 1;
  min-height: 0;
  position: relative;
  overflow: clip;
  padding-top: clamp(4px, 1vh, 10px);
  padding-bottom: clamp(4px, 1vh, 10px);
}
.g8-nav {
  flex-shrink: 0;
  min-height: clamp(50px, 9vh, 80px);
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 12px;
  padding-top: clamp(6px, 1.2vh, 12px);
  padding-bottom: clamp(6px, 1.2vh, 12px);
  border-top: 1px solid ${T.line};
}
.g8-nav-l { justify-self: start; }
.g8-nav-c {
  justify-self: center;
  font-size: clamp(10px, .85vw, 12px);
  letter-spacing: .12em;
  text-transform: uppercase;
  color: ${T.ink2};
  white-space: nowrap;
}
.g8-nav-r { justify-self: end; }
.g8-stack {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: clamp(6px, 1.1vh, 13px);
}

/* ============ YUQORI PANEL ============ */
.g8-top { display: flex; align-items: center; gap: clamp(8px, 1.4vw, 16px); min-width: 0; }
.g8-mark {
  flex-shrink: 0;
  font-family: 'Fraunces', 'Source Serif 4', Georgia, serif;
  font-size: clamp(13px, 1.2vw, 16px);
  font-weight: 600;
  letter-spacing: -.02em;
  color: ${T.paper};
  background: ${T.dark};
  border-radius: 9px;
  padding: 4px 8px;
  line-height: 1.05;
}
.g8-mark b { color: ${T.accent}; font-weight: 700; }
.g8-top-title {
  flex-shrink: 0;
  font-size: clamp(10px, .85vw, 12px);
  letter-spacing: .14em;
  text-transform: uppercase;
  font-weight: 600;
  color: ${T.ink2};
  white-space: nowrap;
}
.g8-dot { padding: 0 .5em; color: ${T.ink3}; }
/* SEGMENTLI progress: har ekranga bitta segment. Foiz YO'Q. */
.g8-seg { flex: 1; min-width: 40px; display: flex; gap: 3px; align-items: center; }
.g8-seg-i {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: rgba(23,26,29,.12);
  transition: background .3s cubic-bezier(.22,.61,.36,1), transform .3s cubic-bezier(.22,.61,.36,1);
}
.g8-seg-i.is-done { background: ${T.graph}; }
.g8-seg-i.is-now { background: ${T.accent}; transform: scaleY(2); }
.g8-top-sect {
  flex-shrink: 0;
  font-family: 'Fraunces', 'Source Serif 4', Georgia, serif;
  font-size: clamp(12px, 1.05vw, 15px);
  font-weight: 600;
  color: ${T.ink};
  white-space: nowrap;
}
.g8-count {
  flex-shrink: 0;
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(10px, .9vw, 12px);
  font-weight: 700;
  color: ${T.ink2};
  font-variant-numeric: tabular-nums;
}
.g8-top-tools { flex-shrink: 0; display: flex; gap: 6px; align-items: center; }
/* Asbob tugmasi: yorliq bilan, holati KO'RINADI. */
.g8-tool {
  display: inline-flex; align-items: center; gap: 6px;
  min-height: 30px; padding: 0 9px;
  border: 0; border-radius: 10px;
  background: ${T.paper}; color: ${T.ink2};
  cursor: pointer; line-height: 1;
  font-size: 12px; font-weight: 600;
  box-shadow: 0 2px 9px -5px rgba(${T.shadow},.4), inset 0 0 0 1px ${T.line};
  transition: box-shadow .24s cubic-bezier(.22,.61,.36,1), color .24s, transform .24s cubic-bezier(.22,.61,.36,1);
}
.g8-tool b { font-size: 13px; font-weight: 400; }
.g8-tool i { font-style: normal; letter-spacing: .04em; }
.g8-tool:hover { transform: translateY(-1px); box-shadow: 0 6px 15px -6px rgba(${T.shadow},.45), inset 0 0 0 1px ${T.line}; }
.g8-tool.is-on { color: ${T.graph}; box-shadow: 0 2px 9px -5px rgba(${T.shadow},.4), inset 0 0 0 1px rgba(${T.graphRgb},.4); }
.g8-tool-sound.is-off { color: ${T.ink3}; }
.g8-tool-wave {
  width: 6px; height: 6px; border-radius: 50%;
  background: ${T.graph};
  animation: g8-wave 1.1s ease-in-out infinite;
}
@keyframes g8-wave { 0%, 100% { opacity: .35; } 50% { opacity: 1; } }

/* ============ QORALAMA ============ */
.g8-notespanel {
  position: absolute;
  top: 0; right: 0;
  width: min(320px, 86%);
  max-height: 100%;
  display: flex; flex-direction: column;
  border-radius: 16px;
  background: ${T.paper};
  box-shadow: 0 18px 40px -18px rgba(${T.shadow},.4), inset 0 0 0 1px ${T.line};
  z-index: 3;
  overflow: clip;
}
.g8-notespanel-h {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 10px;
  font-size: 10.5px; letter-spacing: .15em; text-transform: uppercase;
  font-weight: 700; color: ${T.ink2};
  border-bottom: 1px solid ${T.line};
}
.g8-notespanel-x { border: 0; background: transparent; color: ${T.ink3}; cursor: pointer; font-size: 12px; }
.g8-notespanel-t {
  flex: 1; min-height: 120px; resize: none;
  border: 0; outline: none; background: transparent;
  padding: 10px;
  font-family: ${MATH_FONT};
  font-size: 14px; line-height: 1.5; color: ${T.ink};
}

/* ============ UCHTA MAXSUS EKRAN: FAQAT ish zonasi rangi (§14) ============
   Qora fon YO'Q, chiziqli daftar YO'Q. Klass nomi g8-zone, g8-field EMAS:
   g8-field ni math.jsx kiritish maydoni uchun ishlatadi.
   DIQQAT: bu STYLES ichida BACKTICK yozilmaydi -- shablon satr uziladi. */
.g8-zone {
  padding: clamp(9px, 1.4vw, 16px) clamp(11px, 1.6vw, 18px);
  border-radius: 18px;
  box-shadow: inset 0 0 0 1px ${T.line};
}
.g8-zone-hook    { background: ${T.graphSoft};  box-shadow: inset 0 0 0 1px rgba(${T.graphRgb},.22); }
.g8-zone-rule    { background: ${T.accentSoft}; box-shadow: inset 0 0 0 1px rgba(${T.accentRgb},.22); }
.g8-zone-summary { background: ${T.okSoft};     box-shadow: inset 0 0 0 1px rgba(${T.okRgb},.22); }

/* ============ TIPOGRAFIKA ============ */
.g8-eyebrow {
  display: flex; align-items: baseline; justify-content: space-between; gap: 10px;
  font-size: clamp(10px, .85vw, 12px); letter-spacing: .16em; text-transform: uppercase;
  font-weight: 600; color: ${T.ink2}; flex-shrink: 0; min-width: 0;
}
.g8-eyebrow > span:first-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.g8-eyebrow-right { color: ${T.accent}; flex-shrink: 0; letter-spacing: .06em; }
.g8-tools-phone { display: none; }

/* ============ SAYT QOBIG'I BILAN TO'QNASHUV: TELEFON ============
   Qobiqning tugmalari FIKSIRLANGAN: chapda «Darslar ro'yxati», o'ngda til
   almashtirgich (o'ngdan 8 px, eni ~144, balandligi 50). 390 px da ular
   darsning yuqori qatori USTIDA turadi, ya'ni ovoz va «qayta» tugmalari
   bosilmaydi -- §20 p. 35b buzilgan holat. Yonida joy yo'q: 390 dan 144 ni
   olib qo'ysak, yuqori qatorga hech narsa qolmaydi.
   Yechim 10-sinfda o'lchab topilgan va shu yerda takrorlanadi: TELEFONDA
   yuqori qator butunlay olib tashlanadi (unda faqat belgi, fan nomi va
   segmentlar bor, ya'ni bezak), o'rniga to'ldirma qo'yiladi, asboblar esa
   brovka qatoriga tushadi -- balandlik budjeti deyarli yeyilmaydi.
   Bo'lim hisobi pastdagi panelda qoladi, ya'ni ma'lumot yo'qolmaydi. */
@media (max-width: 639.98px) {
  .g8-top { display: none; }
  .g8-head { padding-top: 54px; }
  .g8-eyebrow { align-items: center; }
  .g8-tools-phone { display: inline-flex; align-items: center; gap: 5px; flex-shrink: 0; }
  .g8-tools-phone .g8-tool { height: 30px; min-width: 30px; padding: 0 7px; }
  /* Qoralamaning YOZUVI tushadi, faqat belgisi qoladi: brovka qatorida uch
     tugma va ekran roli birga turishi kerak. */
  .g8-tools-phone .g8-tool i { display: none; }
  .g8-eyebrow-right { display: none; }
}
.g8-title {
  font-family: 'Fraunces', 'Source Serif 4', Georgia, serif;
  font-weight: 600;
  line-height: 1.05;
  letter-spacing: -.015em;
  font-size: clamp(18px, 2.35vw, 33px);
  flex-shrink: 0;
}
.g8-lead {
  font-size: clamp(14px, 1.15vw, 16px); line-height: 1.45; color: ${T.ink2}; flex-shrink: 0;
}
/* Savol SO'Z bilan: Manrope, KO'CHIRISH bilan (§14). Monoshirinali EMAS. */
.g8-ask {
  font-family: 'Manrope', sans-serif;
  font-size: clamp(14px, 1.2vw, 16px);
  line-height: 1.4;
  font-weight: 700;
  color: ${T.ink};
  white-space: normal;
  overflow-wrap: anywhere;
  flex-shrink: 0;
}

/* ============ MATEMATIKA: SERIF ============ */
.g8-m {
  font-family: ${MATH_FONT};
  font-weight: 600;
  letter-spacing: 0;
  word-spacing: .12em;
  font-variant-ligatures: none;
  font-feature-settings: 'liga' 0;
  font-variant-numeric: tabular-nums lining-nums;
  white-space: nowrap;
  flex-shrink: 0;
}
/* Proza matematika shriftida ham KO'CHADI: nowrap faqat yozuv uchun. */
.g8-wrap { white-space: normal; overflow-wrap: anywhere; }
/* O'zgaruvchi KURSIV, son va funksiya nomi TIK (ISO 80000-2). */
.g8-var { font-style: italic; font-synthesis: none; }
.g8-idx { font-size: max(10.5px, .68em); font-weight: 700; letter-spacing: .01em; font-style: normal; }
.g8-m-big { font-size: clamp(22px, 2.4vw, 30px); }
.g8-m-row { font-size: clamp(16px, 1.6vw, 22px); }
.g8-m-sm  { font-size: clamp(13px, 1.15vw, 15px); }
.g8-t-accent { color: ${T.accent}; }
.g8-t-dim { color: ${T.ink4}; }
.g8-t-ink2 { color: ${T.ink2}; }

/* ============ IKKI QAVATLI KASR ============ */
.g8-frac {
  display: inline-flex; flex-direction: column; align-items: center;
  vertical-align: middle; margin: 0 .2em;
  font-family: ${MATH_FONT}; font-variant-numeric: tabular-nums lining-nums;
  transition: opacity .3s;
}
.g8-frac-n, .g8-frac-d { display: block; padding: 0 .3em; line-height: 1.18; }
.g8-frac-bar { display: block; width: 100%; height: 1px; background: currentColor; margin: .14em 0; }
.g8-frac-big .g8-frac-n, .g8-frac-big .g8-frac-d { font-size: clamp(22px, 2.4vw, 30px); }
.g8-frac-row .g8-frac-n, .g8-frac-row .g8-frac-d { font-size: clamp(16px, 1.6vw, 22px); }
.g8-frac-sm .g8-frac-n, .g8-frac-sm .g8-frac-d { font-size: clamp(13px, 1.15vw, 15px); }
.g8-gone { opacity: .2; }
.g8-cancel { transition: opacity .3s ease, color .3s ease; }
.g8-cancel-off { opacity: .24; text-decoration: line-through; text-decoration-thickness: 1px; }

/* ============ ODZ SATRI ============
   Bu ODZ qatlami, shuning uchun graph rangi: «tekshiruv» ma'nosi. */
.g8-odz {
  display: flex; align-items: center; gap: 9px; flex-shrink: 0;
  min-height: 34px;
  padding: 0 12px;
  border-radius: 12px;
  background: ${T.graphSoft};
  box-shadow: inset 0 0 0 1px rgba(${T.graphRgb},.22);
  font-family: ${MATH_FONT};
  font-size: clamp(14px, 1.2vw, 16px);
}
.g8-odz-tag {
  font-family: 'Manrope', sans-serif;
  font-size: 10px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase;
  color: ${T.graph};
}
.g8-odz-body { color: ${T.ink}; }
.g8-odz-empty { background: rgba(255,253,248,.55); box-shadow: inset 0 0 0 1px ${T.line}; }
.g8-odz-empty .g8-odz-tag { color: ${T.ink3}; }
.g8-odz-blink { animation: g8-blink .7s ease-in-out 1; }
@keyframes g8-blink { 0%, 100% { background: ${T.graphSoft}; } 50% { background: #C2DEDC; } }

/* ============ «keyingi»: ingichka, chaqirmaydi ============ */
.g8-nextstep {
  align-self: flex-end; flex-shrink: 0;
  min-height: 28px; padding: 0 6px;
  border: 0; background: transparent;
  color: ${T.ink3};
  font-family: 'Manrope', sans-serif; font-size: 12.5px; font-weight: 600;
  letter-spacing: .02em; cursor: pointer;
  transition: color .15s;
}
.g8-nextstep::after { content: ' →'; }
.g8-nextstep:hover { color: ${T.ink}; }

/* ============ YOPILGAN TOPSHIRIQ ============ */
.g8-closed {
  display: flex; align-items: flex-start; gap: 8px; flex-shrink: 0; min-width: 0;
  min-height: 30px;
  font-family: ${MATH_FONT};
  font-size: clamp(12px, 1vw, 13.5px);
  color: ${T.ink2};
  white-space: normal; overflow-wrap: anywhere;
}
.g8-closed-tick { color: ${T.ok}; font-weight: 800; flex-shrink: 0; }

/* ============ TUGMALAR ============ */
.g8-btn {
  min-height: clamp(44px, 3.2vw, 48px);
  padding: 0 clamp(16px, 1.5vw, 24px);
  border: 0;
  border-radius: 14px;
  font-family: 'Manrope', sans-serif;
  font-weight: 600;
  font-size: clamp(13px, 1.05vw, 15px);
  letter-spacing: .01em;
  cursor: pointer;
  transition: transform .24s cubic-bezier(.22,.61,.36,1), background .24s, box-shadow .24s, color .24s;
}
.g8-btn-wide { width: 100%; }
.g8-btn-solid { background: ${T.accent}; color: #fff; box-shadow: 0 10px 24px -12px rgba(${T.accentRgb},.75); }
.g8-btn-solid:hover:not(:disabled) { transform: translateY(-2px); background: #B44822; }
.g8-btn-ghost { background: transparent; color: ${T.ink2}; padding: 0 clamp(10px, 1.1vw, 16px); }
.g8-btn-ghost:hover:not(:disabled) { color: ${T.ink}; background: rgba(255,253,248,.7); box-shadow: inset 0 0 0 1px ${T.line}; }
.g8-btn-soft {
  background: ${T.paper}; color: ${T.ink};
  box-shadow: 0 8px 20px -14px rgba(${T.shadow},.4), inset 0 0 0 1px ${T.line};
}
.g8-btn-soft:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 26px -14px rgba(${T.shadow},.5), inset 0 0 0 1px ${T.line}; }
.g8-btn:disabled { opacity: .38; cursor: not-allowed; box-shadow: none; transform: none; }
/* Kutilayotgan tugma: FAQAT soya halqasi. scale YO'Q, istisnosiz (§14). */
.g8-btn-ready { animation: g8-ready 1.9s ease-in-out infinite; }
@keyframes g8-ready {
  0%, 100% { box-shadow: 0 10px 24px -12px rgba(${T.accentRgb},.7), 0 0 0 0 rgba(${T.accentRgb},.42); }
  55%      { box-shadow: 0 14px 28px -12px rgba(${T.accentRgb},.8), 0 0 0 8px rgba(${T.accentRgb},0); }
}
@media (prefers-reduced-motion: reduce) { .g8-btn-ready { animation: none; } }

/* ============ VARIANTLAR ============ */
.g8-choice { display: grid; gap: clamp(7px, .9vw, 11px); flex-shrink: 0; }
/* Zich variant: qisqa tasdiqlar uchun (ekran 8). 615px noutbukda to'liq
   balandlikdagi uch variant + ochilgan kartochka 17px chiqib ketardi. */
.g8-choice-dense { gap: 6px; }
.g8-choice-dense .g8-opt { min-height: clamp(38px, 2.9vw, 44px); padding: 7px 13px; font-size: clamp(12.5px, 1vw, 14px); }
.g8-opt {
  display: flex; align-items: center; gap: 12px;
  overflow: hidden;
  padding: clamp(10px, 1.1vw, 14px) clamp(13px, 1.4vw, 19px);
  min-height: clamp(46px, 3.6vw, 54px);
  border: none;
  border-radius: 14px;
  background: ${T.paper};
  color: ${T.ink};
  font-family: 'Manrope', sans-serif;
  font-size: clamp(13px, 1.1vw, 15px);
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  box-shadow: 0 8px 20px -14px rgba(${T.shadow},.4), inset 0 0 0 1px ${T.line};
  transition: transform .3s cubic-bezier(.22,.61,.36,1), background .24s, color .24s, box-shadow .24s, opacity .42s;
}
.g8-opt:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 26px -14px rgba(${T.shadow},.5), inset 0 0 0 1px ${T.line}; }
.g8-opt:disabled { cursor: default; }
.g8-opt-badge {
  flex-shrink: 0; min-width: 16px;
  font-family: 'JetBrains Mono', monospace; font-size: 12.5px; font-weight: 700; color: ${T.ink3};
}
.g8-opt-text { flex: 1; font-family: ${MATH_FONT}; font-weight: 600; font-size: 1.06em; word-spacing: .1em; }
/* To'g'ri javob YASHIL: TURADI, chaqnamaydi va so'nmaydi (§2.1). */
.g8-opt-ok { background: ${T.okSoft}; color: ${T.ok}; box-shadow: 0 10px 24px -14px rgba(${T.okRgb},.5), inset 0 0 0 1px rgba(${T.okRgb},.3); }
.g8-opt-ok .g8-opt-badge { color: ${T.ok}; }
/* Xato urinish AMBER, qizil EMAS. */
.g8-opt-tip { background: ${T.tipSoft}; color: ${T.tip}; box-shadow: 0 10px 24px -14px rgba(${T.tipRgb},.45), inset 0 0 0 1px rgba(${T.tipRgb},.26); }
.g8-opt-tip .g8-opt-badge { color: ${T.tip}; }
/* TAXMIN (faqat ekran 1): nishoni HARF bo'lib qoladi, baholanmaydi. */
.g8-opt-cool { background: ${T.graphSoft}; color: ${T.graph}; box-shadow: 0 10px 24px -14px rgba(${T.graphRgb},.45), inset 0 0 0 1px rgba(${T.graphRgb},.26); }
.g8-opt-cool .g8-opt-badge { color: ${T.graph}; }
.g8-opt-dim { color: ${T.ink3}; opacity: .32; box-shadow: inset 0 0 0 1px ${T.line}; }

/* ============ YUZALAR VA TEGLAR ============ */
.g8-panel { border-radius: 16px; padding: clamp(10px, 1.5vw, 18px); overflow: clip; min-width: 0; }
.g8-panel-paper { background: ${T.paper}; box-shadow: 0 10px 26px -12px rgba(${T.shadow},.22), inset 0 0 0 1px ${T.line}; }
.g8-panel-quiet { background: rgba(255,253,248,.55); box-shadow: inset 0 0 0 1px ${T.line}; }
.g8-tag {
  display: inline-flex; align-items: center; gap: 6px; align-self: flex-start;
  font-size: clamp(10px, .82vw, 11.5px); letter-spacing: .15em; text-transform: uppercase; font-weight: 700;
  padding: 4px 9px; border-radius: 7px; white-space: nowrap;
}
.g8-tag-quiet { color: ${T.ink2}; background: rgba(23,26,29,.05); }
.g8-tag-accent { color: ${T.accent}; background: ${T.accentSoft}; }
.g8-tag-graph { color: ${T.graph}; background: ${T.graphSoft}; }
.g8-tag-ok { color: ${T.ok}; background: ${T.okSoft}; }
.g8-tag-tip { color: ${T.tip}; background: ${T.tipSoft}; }

/* ============ KONTRPRIMER: 8-sinfning javob shakli ============ */
.g8-cx {
  display: flex; flex-direction: column; gap: 5px; flex-shrink: 0;
  padding: clamp(9px, 1.3vw, 13px) clamp(11px, 1.5vw, 15px);
  border-radius: 14px;
  background: ${T.tipSoft};
  box-shadow: inset 0 0 0 1px rgba(${T.tipRgb},.26);
  animation: g8-in .34s cubic-bezier(.22,.61,.36,1) both;
}
.g8-cx-head { display: flex; align-items: baseline; gap: 10px; }
.g8-cx-at { font-family: ${MATH_FONT}; font-size: clamp(14px, 1.2vw, 16px); font-weight: 700; color: ${T.tip}; }
.g8-cx-note { font-size: clamp(13px, 1.1vw, 15px); line-height: 1.42; color: ${T.ink}; white-space: normal; overflow-wrap: anywhere; }
.g8-cx-vals {
  display: flex; align-items: baseline; gap: 14px; flex-wrap: wrap;
  font-family: ${MATH_FONT}; font-size: clamp(16px, 1.6vw, 22px); font-variant-numeric: tabular-nums lining-nums;
}
.g8-cx-vals i { font-style: normal; color: ${T.ink2}; font-size: 11px; margin-right: 4px; }
.g8-cx-vs { color: ${T.tip}; font-weight: 700; }

/* ============ TINCH XABAR ============ */
.g8-note {
  flex-shrink: 0;
  padding: clamp(9px, 1.3vw, 13px) clamp(11px, 1.5vw, 15px);
  border-radius: 14px;
  background: rgba(255,253,248,.62);
  box-shadow: inset 0 0 0 1px ${T.line};
  font-size: clamp(13px, 1.1vw, 15px); line-height: 1.45; color: ${T.ink2};
  white-space: normal; overflow-wrap: anywhere;
  animation: g8-in .34s cubic-bezier(.22,.61,.36,1) both;
}
.g8-note-ok { background: ${T.okSoft}; box-shadow: inset 0 0 0 1px rgba(${T.okRgb},.26); color: ${T.ink}; }
.g8-note-no { background: ${T.tipSoft}; box-shadow: inset 0 0 0 1px rgba(${T.tipRgb},.26); color: ${T.ink}; }

/* ============ QOIDA KARTOCHKASI ============ */
.g8-rule {
  display: flex; flex-direction: column; gap: 5px; flex-shrink: 0;
  padding: clamp(11px, 1.5vw, 16px) clamp(12px, 1.6vw, 18px);
  border-radius: 16px;
  background: ${T.paper};
  box-shadow: 0 10px 26px -12px rgba(${T.shadow},.22), inset 0 0 0 1px rgba(${T.accentRgb},.3);
}
.g8-rule-title {
  font-size: 10px; font-weight: 700; letter-spacing: .15em; text-transform: uppercase; color: ${T.accent};
}
.g8-rule-line, .g8-rule-src {
  font-size: clamp(13px, 1.1vw, 15px); line-height: 1.45;
  white-space: normal; overflow-wrap: anywhere;
  opacity: 0; animation: g8-in .34s cubic-bezier(.22,.61,.36,1) forwards;
}
.g8-rule-line:first-of-type {
  font-family: ${MATH_FONT}; font-weight: 700;
  font-size: clamp(16px, 1.6vw, 22px);
  word-spacing: .12em;
}
.g8-rule-src { font-size: 11.5px; color: ${T.ink3}; }

/* YOPIQ kartochka: AYNAN shu tuzilma, matn o'rniga xira chiziq.
   Balandlik ochiq holat bilan bir xil -- ekran sakramaydi. */
.g8-rule-masked {
  position: relative;
  background: rgba(255,253,248,.45);
  box-shadow: inset 0 0 0 1px ${T.line};
}
.g8-rule-masked .g8-rule-line, .g8-rule-masked .g8-rule-src { opacity: 1; animation: none; }
.g8-rule-bar {
  display: block; text-decoration: none;
  height: .72em; width: 72%; border-radius: 4px;
  background: rgba(23,26,29,.07);
}
.g8-rule-bar-short { width: 38%; height: .6em; }
.g8-rule-masked .g8-rule-first .g8-rule-bar { width: 46%; }
.g8-rule-locked {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  padding: 0 14px;
  text-align: center;
  font-family: 'Manrope', sans-serif;
  font-size: clamp(12px, 1vw, 13.5px); font-weight: 600;
  color: ${T.ink3};
  background: linear-gradient(rgba(243,239,231,.55), rgba(243,239,231,.78));
  border-radius: 16px;
}

/* ============ YAKUN: IKKI USTUN (§13) ============ */
/* 2026-08-13, metodist: HAMMA ekranda kontent VERTIKAL, bitta ustun.
   Ikki ustun bekor qilindi: ekran ko'z bilan ikkiga bo'linardi va o'quvchi
   qaysi tomondan o'qishni izlardi. Vertikalga sig'ishi uchun matn QISQARDI. */
.g8-sum { display: flex; flex-direction: column; gap: clamp(5px, 1vh, 10px); flex-shrink: 0; min-height: min-content; }
.g8-sum-col { display: flex; flex-direction: column; gap: 5px; min-width: 0; }
/* Taxmin -> natija: bitta qatorda, o'q bilan. Ranglar 1-ekrandan. */
.g8-sum-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.g8-sum-arrow { color: ${T.ink4}; font-family: ${MATH_FONT}; }
.g8-sum-h { font-size: 10px; font-weight: 700; letter-spacing: .15em; text-transform: uppercase; color: ${T.ink2}; }
.g8-chip {
  display: inline-flex; align-items: center; align-self: flex-start;
  min-height: 26px; padding: 0 10px; border-radius: 999px;
  font-size: 12.5px; font-weight: 600;
}
.g8-chip-cool { background: ${T.graphSoft}; color: ${T.graph}; }
.g8-chip-ok { background: ${T.okSoft}; color: ${T.ok}; }
.g8-notes {
  display: flex; flex-direction: column; gap: 2px; min-height: 30px;
  font-family: ${MATH_FONT}; font-size: 13px; color: ${T.ink2};
}
.g8-note-line { white-space: normal; overflow-wrap: anywhere; }
.g8-cheat {
  align-self: flex-start; min-height: 32px; padding: 0 12px;
  border: 0; border-radius: 10px;
  background: ${T.paper}; color: ${T.ink2};
  font-family: 'Manrope', sans-serif; font-size: 12.5px; font-weight: 600; cursor: pointer;
  box-shadow: 0 8px 20px -14px rgba(${T.shadow},.4), inset 0 0 0 1px ${T.line};
  transition: transform .24s cubic-bezier(.22,.61,.36,1), color .24s;
}
.g8-cheat:hover { transform: translateY(-1px); color: ${T.ink}; }

/* ============ TELEFON: ustunlar bo'lim bo'lib ketadi ============ */
@media (max-width: 859.98px) {
  .g8-sum { gap: clamp(4px, 1vh, 8px); }
  .g8-sum-col { gap: 3px; }
  .g8-sum-h { font-size: 9.5px; letter-spacing: .1em; }
  .g8-chip { min-height: 23px; font-size: 12px; padding: 0 9px; }
  .g8-notes { min-height: 20px; font-size: 12px; }
  .g8-cheat { min-height: 28px; }
  .g8-zone { padding: 8px 10px; border-radius: 14px; }
  .g8-ask { font-size: 13px; line-height: 1.32; }
  .g8-stack { gap: 7px; }
  .g8-opt { min-height: 42px; padding: 8px 12px; }
  .g8-choice { gap: 6px; }
  .g8-title { font-size: 19px; }
  .g8-rule { padding: 10px 12px; gap: 3px; }
  .g8-top-title, .g8-top-sect { display: none; }
}

/* ============ HARAKAT: faqat matematik o'zgargan joyda ============ */
.g8-in { opacity: 0; animation: g8-in .34s cubic-bezier(.22,.61,.36,1) forwards; }
.g8-d1 { animation-delay: .12s; }
.g8-d2 { animation-delay: .24s; }
.g8-d3 { animation-delay: .36s; }
.g8-d4 { animation-delay: .48s; }
@keyframes g8-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
/* Overshoot faqat VERTIKAL: keng satrda scaleX gorizontal oshib ketardi. */
.g8-pop { animation: g8-pop .42s cubic-bezier(.34,1.4,.64,1) both; }
@keyframes g8-pop { 0% { opacity: 0; transform: scaleY(.7); } 100% { opacity: 1; transform: scaleY(1); } }
/* Silkinish clip-qutida, aks holda 4px chetga chiqadi. */
.g8-shakebox { overflow: clip; }
.g8-shake { animation: g8-shake .2s ease-in-out 2; }
@keyframes g8-shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-3px); } 75% { transform: translateX(3px); } }

@media (prefers-reduced-motion: reduce) {
  .lesson-root, .lesson-root *, .lesson-root *::before, .lesson-root *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
  .g8-in, .g8-rule-line, .g8-rule-src, .g8-cx, .g8-note { opacity: 1; }
}

/* ====================================================================
   ВИД КАК В УРОКЕ 1 ШЕСТОГО КЛАССА (методист, 2026-08-15).
   Блок стоит последним и перебивает правила выше — так правку видно
   целиком и её можно снять одним куском, не разбирая двадцать мест.

   Что меняется: шапка становится минимальной (полоса прогресса во всю
   ширину, бровка слева, звук и счётчик справа), большая бежевая плашка
   вокруг содержимого убирается, содержимое живёт в БЕЛЫХ карточках на
   светлом поле, «Дальше» — белая пилюля с акцентной обводкой, варианты
   без букв A B C D и по центру.
   ==================================================================== */

/* Шапка: ни знака М8, ни строки предмета, ни названия раздела. */
.g8-mark, .g8-top-title, .g8-top-sect { display: none; }
.g8-top { flex-wrap: wrap; row-gap: 8px; }
/* Полоса прогресса — ОТДЕЛЬНОЙ строкой во всю ширину и первой. */
.g8-seg { flex-basis: 100%; order: -1; gap: 0; min-width: 0; }
.g8-seg-i { height: 4px; border-radius: 0; background: rgba(23,26,29,.10); transition: background .3s ease; }
.g8-seg-i:first-child { border-radius: 3px 0 0 3px; }
.g8-seg-i:last-child { border-radius: 0 3px 3px 0; }
/* Пройденное и текущий — одним цветом: полоса читается как ЗАЛИВКА,
   а не как набор плиток. Утолщения нет, иначе бар прыгает. */
.g8-seg-i.is-done, .g8-seg-i.is-now { background: ${T.accent}; transform: none; }
.g8-count { margin-left: auto; font-size: clamp(11px, 1vw, 13px); color: ${T.ink2}; }

/* Плашка особого экрана убрана: поле светлое, форму держат карточки. */
.g8-zone, .g8-zone-hook, .g8-zone-rule, .g8-zone-summary {
  background: transparent; box-shadow: none; padding: 0;
}

/* Карточка: белая бумага, мягкая тень, крупный радиус.
   ШИРИНА ПО СОДЕРЖИМОМУ (методист, 2026-08-15). Растянутая на всю строку
   карточка вокруг короткой дроби давала два огромных пустых поля по бокам:
   бумага была, а на ней ничего. Теперь карточка облегает запись и стоит по
   центру, а широкое содержимое по-прежнему занимает всю строку — за это
   отвечает max-width. */
.g8-frame {
  background: ${T.paper};
  border-radius: 18px;
  box-shadow: 0 18px 40px -30px rgba(${T.shadow},.9), inset 0 0 0 1px rgba(23,26,29,.05);
  width: fit-content;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
}
/* Исключение: карточка с чертежом. Чертёж сам тянется на всю ширину, и
   ширина по содержимому схлопнула бы его в ничто. */
.g8-frame-fig, .g8-frame-wide { width: 100%; }

/* «Продолжить» — СПЛОШНАЯ, как в уроке 1 седьмого класса (методист,
   2026-08-15). Белая пилюля пришла из 6 класса и на крупной шкале терялась:
   главная кнопка экрана не должна быть тише вариантов ответа. */
.g8-btn-solid {
  background: ${T.accent}; color: #fff;
  box-shadow: 0 12px 28px -14px rgba(${T.accentRgb},.8);
}
.g8-btn-solid:hover:not(:disabled) { background: #B44822; transform: translateY(-2px); }
.g8-btn-solid:disabled { background: ${T.ink4}; color: ${T.paper}; box-shadow: none; }

/* ТОЧКИ ШАГОВ. Показывают, сколько шагов на экране и где ты сейчас: без них
   ученик не знает, впереди ещё один шаг или пять. Стоят по центру под
   содержимым, как в 7 классе. */
.g8-dots { display: flex; gap: 7px; justify-content: center; align-items: center; padding: 2px 0; }
.g8-dots i { width: 8px; height: 8px; border-radius: 50%; background: rgba(23,26,29,.16);
  transition: background .3s ease, transform .3s ease; }
.g8-dots i.is-done { background: rgba(${T.accentRgb},.45); }
.g8-dots i.is-now { background: ${T.accent}; transform: scale(1.25); }

/* Вариант ответа: белая карточка, текст по центру, буквы нет. */
.g8-opt-badge { display: none; }
.g8-opt {
  justify-content: center; text-align: center;
  background: ${T.paper};
  box-shadow: 0 10px 26px -22px rgba(${T.shadow},.9), inset 0 0 0 1px rgba(23,26,29,.07);
}

/* Сцена: ширину задаёт карточка, высоту — пропорция. Потолок в vh, иначе
   на ноутбуке 615 px сцена съедает экран (замер 2026-08-15). */
.g8-scene svg { width: 100%; height: auto; }
.g8-scene-hook svg  { max-height: clamp(170px, 33vh, 290px); }
.g8-scene-final svg { max-height: clamp(80px, 13vh, 150px); }

/* ====================================================================
   ШКАЛА КРУПНЕЕ (методист, 2026-08-15). Урок 1 — эталон класса, и мелкая
   математика на нём читалась как служебная. Поднято примерно на пятую
   часть: заголовок, вопрос, дробь, вариант, поле ответа.
   Числа растут ВМЕСТЕ с чертой дроби — при кегле 40 черта в один пиксель
   выглядит случайной царапиной, а не знаком деления.
   ==================================================================== */
/* ЦЕНТР, как в уроке 1 седьмого класса (методист, 2026-08-15). Слева заголовок
   и вопрос читаются как документ; по центру — как доска, и взгляд идёт сверху
   вниз по одной оси: заголовок, математика, вопрос. */
.g8-title { font-size: clamp(24px, 3.3vw, 46px); text-align: center; }
.g8-lead  { text-align: center; }
.g8-ask   { text-align: center; }
.g8-lead  { font-size: clamp(16px, 1.5vw, 20px); }
.g8-ask   { font-size: clamp(17px, 1.65vw, 22px); }

.g8-frac-big .g8-frac-n, .g8-frac-big .g8-frac-d { font-size: clamp(28px, 3.3vw, 44px); }
.g8-frac-row .g8-frac-n, .g8-frac-row .g8-frac-d { font-size: clamp(21px, 2.2vw, 31px); }
.g8-frac-sm  .g8-frac-n, .g8-frac-sm  .g8-frac-d { font-size: clamp(15px, 1.35vw, 18px); }
.g8-frac-bar { height: 2px; }

.g8-opt { font-size: clamp(16px, 1.5vw, 20px); }
.g8-choice-dense .g8-opt { font-size: clamp(14px, 1.15vw, 16px); }
.g8-input, .g8-field-val { font-size: clamp(21px, 2.2vw, 30px); }
.g8-sv-line { font-size: clamp(18px, 1.8vw, 24px); }
.g8-ts-rec { font-size: clamp(23px, 2.3vw, 32px); }

/* НИЗКИЙ ЭКРАН. Полоса прогресса отдельной строкой стоит 12 пикселей высоты:
   рабочая зона на ноутбуке 1366 на 615 упала с 487 до 475, и экраны 7 и 10
   вышли за фолд на 3 и 11 пикселей (замер 2026-08-15). Поэтому там, где
   высоты мало, полоса возвращается в общую строку шапки. Вид шестого класса
   остаётся на нормальных экранах, где он и смотрится. */
/* ====================================================================
   ПУСТЫЕ ПОЛЯ УБРАНЫ (методист, 2026-08-15). Карточка сцены и ряд
   вариантов растягивались на всю строку, и по бокам оставалась пустая
   бумага. Ширину теперь задаёт содержимое.
   ==================================================================== */

/* Сцена: высоту задаём, ширину берёт из пропорции кадра. */
.g8-scene { width: fit-content; max-width: 100%; margin-left: auto; margin-right: auto; }
.g8-scene svg { width: auto; max-width: 100%; }
.g8-scene-hook svg  { height: clamp(170px, 33vh, 290px); }
.g8-scene-final svg { height: clamp(80px, 13vh, 150px); }

/* Варианты — ОДНОЙ строкой, как коробка: четыре ответа в ряд читаются
   как один выбор, а сетка два на два — как два отдельных вопроса. */
.g8-choice { display: flex; flex-wrap: nowrap; gap: 8px; width: 100%; }
.g8-choice .g8-opt { flex: 1 1 0; min-width: 0; text-align: center; }

/* Поле ответа: ширина по человеку, а не по строке. Растянутое на всю
   ширину поле не показывает, что писать — цифру или выражение. Рамка
   акцентом: это единственное место экрана, где ждут действия. */
.g8-field { max-width: 560px; margin-left: auto; margin-right: auto; }
.g8-input {
  box-shadow: inset 0 0 0 2px rgba(${T.accentRgb},.35);
  border-radius: 12px;
}
.g8-input:focus { box-shadow: inset 0 0 0 2px ${T.accent}, 0 0 0 4px rgba(${T.accentRgb},.14); }

@media (max-width: 640px) {
  .g8-choice { flex-wrap: wrap; }
  .g8-choice .g8-opt { flex: 1 1 46%; }
}

/* ====================================================================
   ОДНА КОЛОНКА СОДЕРЖИМОГО (методист, 2026-08-15). Карточка стояла в
   одной ширине, а варианты ответа уходили шире неё — взгляд метался, и
   экран разваливался на два разных блока. Теперь всё живёт внутри одной
   колонки: заголовок, запись, сцена, варианты, разбор.
   ==================================================================== */
.g8-stack { width: 100%; max-width: 900px; margin-left: auto; margin-right: auto; }

/* Текст варианта — читаемый. Ответ это то, ЧТО выбирают: он не может быть
   мельче вопроса. Раньше вариант был 20-м кеглем при вопросе 22 и терялся. */
.g8-opt { font-size: clamp(17px, 1.7vw, 23px); }
.g8-opt-text { font-weight: 600; }

/* ====================================================================
   СОДЕРЖИМОЕ ЗАПОЛНЯЕТ ВЫСОТУ (методист, 2026-08-15). Прижатое кверху,
   оно оставляло под собой двести пустых пикселей до нижней панели.
   Свободную высоту забирает ГЛАВНЫЙ объект экрана — сцена или чертёж, —
   а вопрос и варианты остаются внизу, где их и ищут.
   Растёт только то, что от роста выигрывает: текст и кнопки не тянем.
   ==================================================================== */
/* Растёт сцена ХУКА и чертёж. Сцена ИТОГА не растёт: под ней три карточки,
   и рост выталкивал их за фолд (замер: экран 15, +3 и +4 px). */
.g8-scene-hook, .g8-frame-fig {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
/* Чертёж ЗАНИМАЕТ выросшую карточку, а не висит в ней. Жёсткая высота в vh
   оставляла пустоту внутри белой карточки: контейнер растянулся, рисунок нет.
   Ширина идёт из пропорции кадра, поэтому карточка сама облегает рисунок. */
.g8-scene-hook svg { height: 100%; max-height: none; width: auto; }
.g8-frame-fig .g8-plotc { max-height: 100%; }

/* ====================================================================
   ШКАЛА ПО УРОКУ 1 СЕДЬМОГО КЛАССА (замер 2026-08-15). Числа взяты
   измерением, а не на глаз: колонка карточек 860, заголовок 38, вариант
   375 на 62 кеглем 16, радиусы 16 и 12.
   Прежний кегль 46 у заголовка и 23 у варианта был перебором: рядом с
   образцом видно, что крупный шрифт съедал воздух, а не добавлял ясности.
   ==================================================================== */
/* Колонка оставлена 900, а не 860 как в 7 классе: на 860 лента способа над
   практикой переносится на вторую строку, и экран 10 выходит за фолд на 17 px
   (замер). Сорок пикселей ширины дешевле лишней строки. */
.g8-title { font-size: clamp(22px, 2.8vw, 38px); }
.g8-ask   { font-size: clamp(16px, 1.5vw, 19px); }
.g8-opt {
  font-size: clamp(14px, 1.25vw, 16px);
  min-height: 54px;
  border-radius: 12px;
}
.g8-frame, .g8-scene { border-radius: 16px; }

@media (max-height: 680px) {
  .g8-top { row-gap: 0; }
  .g8-seg { flex-basis: auto; flex: 1; min-width: 40px; order: 0; }
  .g8-scene-hook svg { max-height: 22vh; }
  /* Крупная шкала — там, где есть высота. На ноутбуке 615 px она не влезает:
     экраны 7 и 10 вышли за фолд на 11 и 30 px (замер 2026-08-15), поэтому
     здесь возвращается прежний кегль. Растягивать урок нельзя, прокрутки нет. */
  .g8-title { font-size: clamp(18px, 2.35vw, 30px); }
  .g8-lead  { font-size: clamp(14px, 1.15vw, 16px); }
  .g8-ask   { font-size: clamp(14px, 1.2vw, 16px); }
  .g8-frac-big .g8-frac-n, .g8-frac-big .g8-frac-d { font-size: clamp(22px, 2.4vw, 30px); }
  .g8-frac-row .g8-frac-n, .g8-frac-row .g8-frac-d { font-size: clamp(16px, 1.6vw, 22px); }
  .g8-opt { font-size: clamp(13px, 1.1vw, 15px); }
  .g8-input, .g8-field-val { font-size: clamp(16px, 1.6vw, 22px); }
  .g8-sv-line { font-size: 17px; }
  .g8-ts-rec { font-size: clamp(20px, 2vw, 28px); }
  /* Вариант в 62 пикселя — мерка 7 класса, но на ноутбуке 615 её не хватает
     по высоте: экран 10 вышел за фолд на 16 px. Там вариант ниже. */
  .g8-opt { min-height: 46px; }
}

/* Телефон: макет 390 и увеличивается zoom-ом, поэтому крупный кегль там
   дорог вдвойне — экран 11 вылезал на 4 px. */
@media (max-width: 640px) {
  .g8-title { font-size: 22px; }
  .g8-ask   { font-size: 16px; }
  .g8-opt   { font-size: 15px; }
  .g8-sv-line { font-size: 16px; }
  .g8-input, .g8-field-val { font-size: 18px; }
  .g8-lead { font-size: 14.5px; }
  .g8-frac-big .g8-frac-n, .g8-frac-big .g8-frac-d { font-size: 26px; }
}
`
