// ============================================================================
// 7-sinf YADROSI. Bir marta yoziladi, 7-sinfning hamma darsi shuni ishlatadi.
// Kontrakt: src/books/grade7/ETALON_7SINF.md
//
// EKRANNING KO'RINISHI 11-SINFDAN OLINDI (metodist qarori 2026-08-06):
// src/components/grade11/core.jsx dagi karkas, fon, tipografika, yuqori panel,
// progress bo'laklari, blok xaritasi, til almashtirgich, qoralama, halqa va
// chop etiladigan shpargalka -- hammasi shu yerga ko'chirildi va 7-sinfga
// moslashtirildi. Sabab: metodist 11-sinf ekranini namuna deb tanladi.
//
// SINFGA XOS, boshqa sinf bilan BO'LISHILMAYDI. Klass prefiksi g7-,
// CSS o'zgaruvchisi --g7z.
//
// 7-sinf uchun QO'SHILDI (11-sinfda yo'q edi):
//   getFreeNav()        -- modul konstantasi emas, darsning sozlamasi
//   useInstructionGate  -- ovoz yoniq bo'lsa javob ko'rsatma tugagach ochiladi
//   Stage field         -- uch alohida ekranning maydon rangi (6.5)
//   lessonNo, lessonId  -- yadroda QOTIB QOLMAYDI, dars beradi
//
// Matematika Source Serif 4 da, o'zgaruvchilar KURSIV (Fx, ISO 80000-2).
// Fon, chiziqlar, to'r, egri chiziqlar -- FAQAT CSS va SVG, rasm fayli yo'q.
//
// STYLES ichida BACKTICK ISHLATILMAYDI -- shablon satrini uzib, faylni sindiradi.
//
// import React SHART: LMS xom jsx ni KLASSIK rejimda yuklaydi.
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

// Navigatsiya fazasi: ishlab chiqishda erkin, sinf topshirilishidan oldin false.
// Modul konstantasi EMAS -- darsning o'zi beradi:
//   configureLesson({ freeNav: false })
export const getFreeNav = () => cfg.freeNav !== false

// ============================================================
// RANG TOKENLARI (metodist brifi)
// ============================================================
export const T = {
  bg: '#F3EFE7',
  paper: '#FFFDF8',
  ink: '#171A1D',
  ink2: '#687078',
  ink3: '#9AA2A9',
  accent: '#C9542C',
  accentSoft: '#F8E7DE',
  graph: '#176C70',
  graphSoft: '#DCECEB',
  ok: '#28774A',
  okSoft: '#E5F2E9',
  tip: '#A55D19',
  tipSoft: '#FBEDD9',
  dark: '#1F292B',
  line: 'rgba(23, 26, 29, 0.13)',
  grid: 'rgba(23, 26, 29, 0.025)',
  shadow: '23,26,29',
}

// ============================================================
// UCH TIL
// ============================================================
export const L = (uz, ru, en) => ({ uz, ru, en })
export const tr = (value, lang) => {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  return value[lang] ?? value.ru ?? value.uz ?? ''
}

const LangContext = createContext('ru')
export const LangProvider = LangContext.Provider
// Tilni darsning ICHIDA almashtirish uchun: ildiz komponent setter beradi.
const LangSetContext = createContext(null)
export const LangSetProvider = LangSetContext.Provider
export const useLang = () => useContext(LangContext)
export const useT = () => {
  const lang = useLang()
  return useCallback((value) => tr(value, lang), [lang])
}

// Matematika shrifti. To'rt ruxsat etilgan shriftdan biri; noli toza,
// raqamlari tabular, kursivi haqiqiy (ital o'qi yuklangan).
export const MATH_FONT = "'Source Serif 4', Georgia, 'Times New Roman', serif"

export const UI_TXT = {
  hint: L('Maslahat', 'Подсказка', 'Hint'),
  right: L("To'g'ri", 'Верно', 'Correct'),
  sound: L('Ovoz', 'Звук', 'Sound'),
  replay: L('Qayta', 'Повторить', 'Replay'),
  subject: L('Matematika', 'Математика', 'Mathematics'),
  notes: L('Qoralama', 'Заметки', 'Notes'),
  notesTitle: L('Mening qoralamalarim', 'Мои заметки', 'My notes'),
  notesHint: L(
    "Bu yerdagi yozuv bahoga TA'SIR QILMAYDI",
    'Записи здесь не влияют на оценку',
    'Notes here do not affect your score',
  ),
  save: L('Saqlash', 'Сохранить', 'Save'),
  saved: L('Saqlandi', 'Сохранено', 'Saved'),
  close: L('Yopish', 'Закрыть', 'Close'),
  cheatSheet: L('Shpargalka', 'Шпаргалка', 'Cheat sheet'),
  printIt: L('Shpargalkani chop etish', 'Распечатать шпаргалку', 'Print the cheat sheet'),
  sections: {
    hook: L('Xuk', 'Хук', 'Hook'),
    explain: L('Tushuntirish', 'Объяснение', 'Explanation'),
    practice: L('Mashq', 'Практика', 'Practice'),
    result: L('Yakun', 'Итог', 'Summary'),
  },
}

// Ekran -> bo'lim. 1 xuk / 2-8 tushuntirish / 9-14 mashq / 15 yakun.
export const sectionOf = (screen) => {
  if (screen <= 0) return 'hook'
  if (screen <= 7) return 'explain'
  if (screen <= 13) return 'practice'
  return 'result'
}
const SECTION_RANGE = { hook: [0, 0], explain: [1, 7], practice: [8, 13], result: [14, 14] }

// ============================================================
// OVOZ: HTTP TTS v5.2 (MIGRATION_v5_2_math.md)
//   {base}/api/tts?text=<encoded>&g=m|f  -- FAQAT text va g
// ttsApiBase bo'sh bo'lsa (lokal previu) brauzer Web Speech zaxirasi.
// Jangovar yo'lda speechSynthesis TAQIQLANGAN.
// ============================================================
// Darsga xos qiymatlar yadroda QOTIB QOLMAYDI: har dars o'zi beradi.
//   lessonId  -- qoralama kaliti uchun
//   lessonNo  -- yuqori panelda «5-dars»
//   freeNav   -- ishlab chiqishda true, sinf topshirilganda false
let cfg = {
  ttsApiBase: '',
  correctSoundUrl: '',
  wrongSoundUrl: '',
  aiGradingEndpoint: '',
  studentName: '',
  voiceGender: 'm', // 7-sinf: erkak ovoz
  lessonId: 'dars',
  lessonNo: null,
  freeNav: true,
}
export const configureLesson = (next) => {
  cfg = { ...cfg, ...next }
}

export function buildTtsUrl(base, text, gender) {
  const clean = String(base || '').replace(/\/$/, '')
  const g = gender === 'f' ? 'f' : 'm'
  return clean + '/api/tts?text=' + encodeURIComponent(String(text || '')) + '&g=' + g
}

const speechLocale = (lang) => (lang === 'ru' ? 'ru-RU' : lang === 'en' ? 'en-GB' : 'uz-UZ')

// Bo'lakni o'qish uchun BAHOLANGAN vaqt. Straj uchun va ovoz o'chiq bo'lganda
// ochilish tezligi uchun: ovoz yo'q bo'lsa ham ekran ASTA ochiladi.
// `?g7fast=1` -- FAQAT avtotekshiruv uchun tezlatish.
const NARRATION_DIVISOR =
  typeof window !== 'undefined' && /[?&]g7fast=1/.test(window.location.search) ? 8 : 1

export function estimateSpeech(text) {
  const words = String(text || '').trim().split(/\s+/).filter(Boolean).length
  // Shift 30 s: bu baho qo'riqchi taymerga ham asos bo'ladi
  // (estimateSpeech + 1500 ms), shuning uchun past shift uzun gapni gapirib
  // bo'lmasdan UZIB qo'yadi. Sekundiga ~2,5 so'z -- odatdagi o'qish tezligi.
  const ms = Math.min(30000, Math.max(1600, 900 + words * 400))
  return Math.round(ms / NARRATION_DIVISOR)
}

class AudioEngine {
  constructor() {
    this.queue = []
    this.idx = 0
    this.isPlaying = false
    this.completed = false
    this.pendingEvent = null
    this.gender = 'm'
    this.lang = 'ru'
    this.onStateChange = null
    this.el = null
    this.watchdog = null
    this.silent = false
    this.startProbe = null
  }

  setGender(g) { this.gender = g === 'f' ? 'f' : 'm' }
  setLang(lang) { this.lang = lang }
  emit(patch) { if (this.onStateChange) this.onStateChange(patch) }

  load(segments) {
    this.stop()
    this.clearWatchdog()
    this.queue = Array.isArray(segments) ? segments : []
    this.idx = 0
    this.pendingEvent = null
    this.completed = this.queue.length === 0
    this.emit({ isPlaying: false, completed: this.completed, index: 0 })
  }

  start() {
    this.idx = 0
    this.pendingEvent = null
    if (!this.queue.length) {
      this.completed = true
      this.emit({ isPlaying: false, completed: true })
      return
    }
    this.play(this.idx)
  }

  // on_event bo'lagi O'ZI kutadi: oldingisi tugagach avtomatik yonmaydi.
  play(i) {
    const seg = this.queue[i]
    if (!seg) {
      this.isPlaying = false
      this.completed = true
      this.emit({ isPlaying: false, completed: true })
      return
    }
    if (typeof seg.trigger === 'string' && seg.trigger.indexOf('on_event:') === 0) {
      this.pendingEvent = seg.trigger.slice('on_event:'.length)
      this.isPlaying = false
      this.emit({ isPlaying: false })
      return
    }
    this.speak(seg)
  }

  speak(seg) {
    // Himoya: ekran almashinuvi paytida navbat almashadi, seg bo'sh chiqishi mumkin.
    if (!seg) {
      this.isPlaying = false
      this.completed = true
      this.emit({ isPlaying: false, completed: true })
      return
    }
    const text = String(seg.text || '')
    if (!text) { this.afterSegment(); return }
    // Faza indeksi: ekran ochilishi SHU songa qarab boradi.
    this.emit({ isPlaying: true, index: this.idx })
    const base = cfg.ttsApiBase
    if (base) {
      if (!this.el) this.el = new Audio()
      const el = this.el
      el.onended = null
      el.onerror = null
      el.src = buildTtsUrl(base, text, seg.g || this.gender)
      el.onended = () => this.afterSegment()
      el.onerror = () => this.afterSegment()
      this.isPlaying = true
      this.armWatchdog(text)
      const started = el.play()
      if (started && typeof started.catch === 'function') started.catch(() => { this.markSilent(); this.afterSegment() })
      return
    }
    if (typeof window === 'undefined' || !window.speechSynthesis) { this.markSilent(); this.afterSegment(); return }
    const synth = window.speechSynthesis
    // JIM REJIMNI ANIQLASH. Saytda `/api/tts` yo'q, ya'ni brauzer Web Speech ga
    // tushadi. Ovozlar RO'YXATI bo'lishi mumkin, lekin brauzer aslida
    // gapirmasligi ham mumkin (headless, ovoz paketi yo'q tizim, tili yo'q
    // ovoz) -- o'shanda `onend` HECH QACHON kelmaydi. Ishonchli belgi:
    // `onstart` keldimi. 700 ms ichida kelmasa -- o'quvchi hech nima
    // eshitmaydi, ya'ni javob qulfini ushlab turish ZARARLI: ekran o'lik
    // ko'rinadi. Ochilish tezligi o'zgarmaydi, faqat qulf ochiladi.
    try {
      const voices = synth.getVoices()
      if (!voices || voices.length === 0) this.markSilent()
    } catch { this.markSilent() }
    try { synth.cancel() } catch { /* previu cheklovi */ }
    const u = new window.SpeechSynthesisUtterance(text)
    u.lang = speechLocale(seg.lang || this.lang)
    u.rate = 0.98
    u.onstart = () => this.clearStartProbe()
    u.onend = () => { this.clearStartProbe(); this.afterSegment() }
    u.onerror = () => { this.markSilent(); this.afterSegment() }
    this.isPlaying = true
    this.armWatchdog(text)
    this.armStartProbe()
    try { synth.speak(u) } catch { this.markSilent(); this.afterSegment() }
  }

  // STRAJ. Jim yoki mavjud bo'lmagan TTS da tugash xabari KELMAYDI (headless da
  // speechSynthesis gapirmaydi) -- ochilish qotib qolardi. Baholangan vaqt
  // o'tsa, o'zimiz davom etamiz.
  armWatchdog(text) {
    this.clearWatchdog()
    const guard = estimateSpeech(text) + 1500
    this.watchdog = setTimeout(() => {
      this.watchdog = null
      this.afterSegment()
    }, guard)
  }

  // Jim rejim: bir marta o'rnatiladi va darsga uzatiladi. Ochilish tezligi
  // O'ZGARMAYDI (baholangan vaqt bo'yicha boradi), faqat javob qulfi ochiladi.
  markSilent() {
    this.silent = true
    // HAR MARTA yuboriladi, bir marta emas: dvijok YAKKA, ekran esa har biri
    // o'z `useAudio` holatini tutadi. Bir marta yuborilsa, faqat BIRINCHI
    // ekran jim rejimni bilib qolardi, qolganlari javobni 12 soniya
    // qulflab turardi.
    this.emit({ silent: true })
  }

  // Gapirish BOSHLANDIMI. Boshlanmasa -- jim rejim.
  armStartProbe() {
    this.clearStartProbe()
    this.startProbe = setTimeout(() => {
      this.startProbe = null
      this.markSilent()
    }, 700)
  }

  clearStartProbe() {
    if (this.startProbe) { clearTimeout(this.startProbe); this.startProbe = null }
  }

  clearWatchdog() {
    if (this.watchdog) { clearTimeout(this.watchdog); this.watchdog = null }
  }

  afterSegment() {
    this.clearWatchdog()
    this.isPlaying = false
    this.idx += 1
    if (this.idx >= this.queue.length) {
      this.completed = true
      this.emit({ isPlaying: false, completed: true, index: this.idx })
      return
    }
    this.emit({ isPlaying: false, index: this.idx })
    this.play(this.idx)
  }

  // Ekrandagi qadam ochilganda chaqiriladi.
  triggerInternal(name) {
    const want = 'on_event:' + name
    for (let i = this.idx; i < this.queue.length; i += 1) {
      if (this.queue[i] && this.queue[i].trigger === want) {
        this.idx = i
        this.pendingEvent = null
        this.speak(this.queue[i])
        return
      }
    }
  }

  // Navbatdan tashqari bitta gap: xato variantning razbori.
  // Navbatga TEGMAYDI -- aks holda indeks siljib, ochilish fazasi buziladi.
  pushOneOff(text) {
    if (!text) return
    this.clearWatchdog()
    if (typeof window === 'undefined') return
    const base = cfg.ttsApiBase
    if (base) {
      const el = new Audio()
      el.src = buildTtsUrl(base, text, this.gender)
      const done = () => { this.isPlaying = false; this.emit({ isPlaying: false }) }
      el.onended = done
      el.onerror = done
      this.isPlaying = true
      this.emit({ isPlaying: true })
      const started = el.play()
      if (started && typeof started.catch === 'function') started.catch(done)
      return
    }
    if (!window.speechSynthesis) return
    try { window.speechSynthesis.cancel() } catch { /* previu cheklovi */ }
    const u = new window.SpeechSynthesisUtterance(text)
    u.lang = speechLocale(this.lang)
    u.rate = 0.98
    const done = () => { this.isPlaying = false; this.emit({ isPlaying: false }) }
    u.onend = done
    u.onerror = done
    this.isPlaying = true
    this.emit({ isPlaying: true })
    try { window.speechSynthesis.speak(u) } catch { done() }
  }

  replay() {
    if (!this.queue.length) return
    if (this.idx > 0) this.idx -= 1
    if (this.idx >= this.queue.length) this.idx = this.queue.length - 1
    this.pendingEvent = null
    this.speak(this.queue[this.idx])
  }

  stop() {
    this.clearStartProbe()
    this.clearWatchdog()
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try { window.speechSynthesis.cancel() } catch { /* previu cheklovi */ }
    }
    if (this.el) { try { this.el.pause() } catch { /* previu cheklovi */ } }
    this.isPlaying = false
    this.emit({ isPlaying: false })
  }
}

let engineInstance = null
export const getAudioEngine = () => {
  if (typeof window === 'undefined') return null
  if (!engineInstance) engineInstance = new AudioEngine()
  return engineInstance
}

// Ovoz o'chirilgan holati MODUL darajasida: ekran almashganda qayta yonmaydi.
let mutedGlobal = false
const mutedListeners = new Set()
const setMutedGlobal = (next) => {
  mutedGlobal = next
  mutedListeners.forEach((fn) => fn(next))
}

export function useAudio(segments) {
  const lang = useLang()
  const [state, setState] = useState({ isPlaying: false, completed: false, muted: mutedGlobal, index: 0, silent: false })
  const engineRef = useRef(null)

  useEffect(() => {
    const fn = (m) => setState((prev) => ({ ...prev, muted: m }))
    mutedListeners.add(fn)
    return () => { mutedListeners.delete(fn) }
  }, [])

  const key = useMemo(() => JSON.stringify(segments || []), [segments])
  const stable = useMemo(() => segments || [], [key]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const engine = getAudioEngine()
    if (!engine) return undefined
    engineRef.current = engine
    engine.onStateChange = (patch) => setState((prev) => ({ ...prev, ...patch }))
    engine.setLang(lang)
    engine.setGender(cfg.voiceGender || 'm')
    if (state.muted) {
      engine.load([])
      setState((prev) => ({ ...prev, isPlaying: false, completed: true }))
      return () => engine.stop()
    }
    engine.load(stable)
    // Jim rejim oldingi ekranda aniqlangan bo'lishi mumkin: yangi ekran uni
    // dvijokdan O'ZI o'qib oladi (ovozsiz segmentli ekranda yuborilmasligi
    // mumkin).
    if (engine.silent) setState((prev) => ({ ...prev, silent: true }))
    const timer = setTimeout(() => engine.start(), 260)
    return () => { clearTimeout(timer); engine.stop() }
  }, [stable, state.muted, lang]) // eslint-disable-line react-hooks/exhaustive-deps

  const step = useCallback((name) => {
    const engine = engineRef.current
    if (engine && !state.muted) engine.triggerInternal(name)
  }, [state.muted])

  const say = useCallback((text) => {
    const engine = engineRef.current
    if (!engine || state.muted || !text) return
    setTimeout(() => { if (!mutedGlobal) engine.pushOneOff(text) }, 300)
  }, [state.muted])

  const replay = useCallback(() => {
    const engine = engineRef.current
    if (engine && !state.muted) engine.replay()
  }, [state.muted])

  const toggleMute = useCallback(() => {
    const next = !mutedGlobal
    if (next && engineRef.current) engineRef.current.stop()
    setMutedGlobal(next)
    setState((prev) => ({ ...prev, muted: next, isPlaying: false }))
  }, [])

  return { ...state, step, say, replay, toggleMute }
}

// ============================================================
// useNarratedSteps -- OVOZ BOSHQARADI ochilishni.
// Bo'lak tugadi -> keyingi qadam ochildi -> keyingi bo'lak gapiradi.
// Savol OXIRGI fazada: ko'rsatma tugamaguncha javob berilmaydi.
// Ovoz o'chiq bo'lsa taymer bilan (dars baribir to'liq o'tiladi).
// ============================================================
export function useNarratedSteps(audio, texts) {
  const total = texts.length
  const [mutedTick, setMutedTick] = useState(0)
  // MONOTON: faza orqaga ketmaydi (3-sinfdagi Math.max naqshi). Holat renderda
  // emas, effektda yangilanadi -- ref ni render vaqtida o'zgartirish mumkin emas.
  const [peak, setPeak] = useState(0)
  useEffect(() => {
    if (audio.muted) return
    const now = Math.min(audio.index || 0, total - 1)
    setPeak((v) => (now > v ? now : v))
  }, [audio.index, audio.muted, total])

  // SINXRONIZATSIYA: ochilish animatsiyasi joriy gapning uzunligiga tenglashadi.
  // Uzun gap -> sekin ochilish; qisqa gap -> tezroq. Shoshmasdan chiqadi.
  const active = audio.muted ? mutedTick : Math.min(audio.index || 0, total - 1)
  useEffect(() => {
    if (typeof document === 'undefined') return
    const ms = Math.max(600, Math.min(1600, Math.round(estimateSpeech(texts[active] || '') * 0.72)))
    document.documentElement.style.setProperty('--g7-rev', ms + 'ms')
  }, [active, texts])
  useEffect(() => {
    if (!audio.muted) return undefined
    if (mutedTick >= total - 1) return undefined
    const ms = Math.min(7000, estimateSpeech(texts[mutedTick]))
    const timer = setTimeout(() => setMutedTick((v) => v + 1), ms)
    return () => clearTimeout(timer)
  }, [audio.muted, mutedTick, total]) // eslint-disable-line react-hooks/exhaustive-deps
  if (audio.muted) return Math.min(mutedTick, total - 1)
  return Math.min(peak, total - 1)
}

// ============================================================
// JAVOB TOVUSHI. Platformadan URL kelsa shuni, kelmasa qisqa signal.
// ============================================================
let chimeCtx = null
function chime(up) {
  if (typeof window === 'undefined') return
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return
  if (!chimeCtx) chimeCtx = new AC()
  if (chimeCtx.state === 'suspended') { try { chimeCtx.resume() } catch { /* avtoplay cheklovi */ } }
  const freqs = up ? [660, 880] : [392, 311]
  const now = chimeCtx.currentTime
  freqs.forEach((f, i) => {
    const o = chimeCtx.createOscillator()
    const g = chimeCtx.createGain()
    o.type = 'sine'
    o.frequency.value = f
    const t0 = now + i * 0.1
    g.gain.setValueAtTime(0.0001, t0)
    g.gain.exponentialRampToValueAtTime(0.11, t0 + 0.02)
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
    const { correctSoundUrl, wrongSoundUrl } = cfg
    if (correctSoundUrl) { const a = new Audio(correctSoundUrl); a.preload = 'auto'; a.volume = 0.6; okRef.current = a }
    if (wrongSoundUrl) { const a = new Audio(wrongSoundUrl); a.preload = 'auto'; a.volume = 0.6; noRef.current = a }
    return () => { okRef.current = null; noRef.current = null }
  }, [])
  const play = useCallback((up) => {
    if (mutedGlobal) return
    const a = up ? okRef.current : noRef.current
    if (!a) { chime(up); return }
    try { a.currentTime = 0; const p = a.play(); if (p && p.catch) p.catch(() => {}) } catch { chime(up) }
  }, [])
  return { playCorrect: () => play(true), playWrong: () => play(false) }
}

// ============================================================
// MOBIL ZOOM: layout doim 390px (src/books/MOBIL_DESKTOP_MOSLASH.md)
// ============================================================
const MOBILE_DESIGN_W = 390
export function useMobileZoom(breakpoint = 640) {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const root = document.documentElement
    const apply = () => {
      const z = window.innerWidth < breakpoint ? window.innerWidth / MOBILE_DESIGN_W : 1
      root.style.setProperty('--g7z', String(z))
    }
    apply()
    window.addEventListener('resize', apply)
    window.addEventListener('orientationchange', apply)
    return () => {
      window.removeEventListener('resize', apply)
      window.removeEventListener('orientationchange', apply)
      root.style.removeProperty('--g7z')
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
  return getFreeNav() || audio.muted || audio.completed || timedOut
}

// Ko'rsatma qulfi. useCanAnswer dan FARQI: freeNav ga BOG'LIQ EMAS -- freeNav
// navigatsiya fazasi, javob qulfi esa metodik talab (ETALON_7SINF.md 5).
// audio.completed ga ham bog'lanmaydi: on_event navbatida u kelmaydi, dvijok
// segmentda to'xtab hodisani kutadi -- javob 12 soniya bloklanib qolardi.
// To'g'ri o'lchov: HOZIR gapirilyaptimi.
export function useInstructionGate(audio) {
  const [armed, setArmed] = useState(false)
  const [timedOut, setTimedOut] = useState(false)
  useEffect(() => {
    setArmed(false)
    setTimedOut(false)
    const a = setTimeout(() => setArmed(true), 900)
    const b = setTimeout(() => setTimedOut(true), 12000)
    return () => { clearTimeout(a); clearTimeout(b) }
  }, [audio.muted])
  // Ovoz o'chiq bo'lsa yoki brauzerda ovoz umuman bo'lmasa -- DARHOL ochiladi:
  // eshitilmaydigan ko'rsatmani kutib turishning ma'nosi yo'q.
  if (audio.muted || audio.silent || timedOut) return true
  if (!armed) return false
  return !audio.isPlaying
}

export function useAdvanceGate(solved, audio) {
  const [delayElapsed, setDelayElapsed] = useState(false)
  useEffect(() => {
    if (!solved) return undefined
    const timer = setTimeout(() => setDelayElapsed(true), 900)
    return () => clearTimeout(timer)
  }, [solved])
  if (getFreeNav()) return true
  if (!solved) return false
  if (audio.muted) return true
  return delayElapsed && !audio.isPlaying
}

// ============================================================
// Fx -- formulani o'qiladigan qilib chizadi.
// Unicode pastki indeks shriftda past sifatli: `log₀,₅` -> `logₒ,ₛ` ko'rinardi.
// Indeksni ODDIY raqamga aylantirib sub/sup ichida chizamiz.
// ============================================================
const SUB_MAP = {
  '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
  '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9',
  '₊': '+', '₋': '−', 'ₙ': 'n',
  'ₐ': 'a', 'ₓ': 'x', 'ₖ': 'k',
}
const SUP_MAP = {
  '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4',
  '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9',
  '⁻': '−', 'ᶜ': 'c', 'ⁿ': 'n',
}

// Matematik minus: faqat SON yoki QAVS yonidagi defis almashadi.
const MINUS_RE = /(^|[\s(([{=<>,])-(?=\s?[\d.(])/g
const mathMinus = (txt) => txt.replace(MINUS_RE, '$1\u2212')

// Yorliq matematikami: raqam yoki amal belgisi bormi. Proza variantlarda
// («ikkisi ham», «ни один») bunday belgi yo'q -- ular Manrope da qoladi.
const MATHY_RE = /[0-9=<>+\u2212\u221e\u00b7\u00d7\u2264\u2265\u2260]/
export const looksMath = (v) => typeof v === 'string' && MATHY_RE.test(v)

// ISO 80000-2: o'zgaruvchi KURSIV, funksiya nomi va son TIK.
//
// Yakka lotin harfi o'zgaruvchi hisoblanadi, agar:
//   1) yonida BEVOSITA (bo'shliqsiz) lotin harfi turmasa -- shunda `log`,
//      `va`, `and` tik qoladi;
//   2) va u ingliz artikli bo'lmasa. Artikldan keyin SO'Z keladi
//      (`a bigger logarithm`), o'zgaruvchidan keyin esa amal belgisi
//      (`a > 1`). Aynan shu bilan ajratiladi.
// Kirill so'z yonidagi lotin harfi TO'SILMAYDI: \u00ABf \u0437\u0430\u0436\u0430\u0442 \u0441\u0432\u0435\u0440\u0445\u0443\u00BB dagi f --
// funksiya nomi, so'zning bo'lagi emas.
// O'ZBEK APOSTROFI ham so'z belgisi: `o'ngni`, `g'oya` da harfdan keyin
// apostrof turadi, va u YAKKA harf emas -- so'zning bo'lagi. Buni hisobga
// olmasa, butun o'zbek matnida `o'` va `g'` ning birinchi harfi kursivga
// aylanardi.
const LAT_RE = /[A-Za-z]/
// Tipografik apostroflar KOD bilan yig'iladi: fayl ichida jonli belgi
// qolsa `scripts/check-grade7.mjs` uni xato deb hisoblaydi, holbuki bu yerda
// ular ATAYLAB kerak -- o'zbek apostrofi so'zning bo'lagi.
const WORD_RE = new RegExp('[A-Za-z' + String.fromCharCode(39, 0x2019, 0x02bb, 0x2018) + ']')
const isLat = (ch) => ch !== undefined && WORD_RE.test(ch)
const nextWordChar = (txt, from) => {
  for (let i = from; i < txt.length; i += 1) {
    if (txt[i] !== ' ') return txt[i]
  }
  return undefined
}

function italicVars(txt, out) {
  let plain = ''
  for (let i = 0; i < txt.length; i += 1) {
    const ch = txt[i]
    let solo = LAT_RE.test(ch) && !isLat(txt[i - 1]) && !isLat(txt[i + 1])
    if (solo && (ch === 'a' || ch === 'A') && isLat(nextWordChar(txt, i + 1))) solo = false
    if (!solo) { plain += ch; continue }
    if (plain) { out.push(plain); plain = '' }
    out.push(<i key={out.length} className="g7-var">{ch}</i>)
  }
  if (plain) out.push(plain)
}

export function Fx({ children }) {
  if (typeof children !== 'string' || !children) return children === undefined ? null : children
  children = mathMinus(children)
  const out = []
  let buf = ''
  let mode = null
  const flush = () => {
    if (!buf) return
    if (mode === 'sub') out.push(<sub key={out.length} className="g7-idx">{buf}</sub>)
    else if (mode === 'sup') out.push(<sup key={out.length} className="g7-idx">{buf}</sup>)
    else italicVars(buf, out)
    buf = ''
  }
  for (const ch of children) {
    const sub = SUB_MAP[ch]
    const sup = SUP_MAP[ch]
    if (sub !== undefined) { if (mode !== 'sub') { flush(); mode = 'sub' } buf += sub; continue }
    if (sup !== undefined) { if (mode !== 'sup') { flush(); mode = 'sup' } buf += sup; continue }
    if (mode === 'sub' && ch === ',') { buf += ','; continue }
    if (mode) { flush(); mode = null }
    buf += ch
  }
  flush()
  return <>{out}</>
}

// ============================================================
// UI PRIMITIVLARI
// ============================================================

// Slot -- balandligi OLDINDAN band qilingan joy.
export const Slot = ({ h, mh, children, style, className }) => (
  <div
    className={className}
    style={{ height: h, minHeight: mh, flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', ...style }}
  >
    {children}
  </div>
)

export const Eyebrow = ({ children, right }) => (
  <div className="g7-eyebrow">
    <span>{children}</span>
    {right ? <span className="g7-eyebrow-right">{right}</span> : null}
  </div>
)

export const Title = ({ children }) => <h1 className="g7-title">{children}</h1>

export const Expr = ({ children, size = 'mid', tone, pop, style, className }) => (
  <div
    className={'g7-expr g7-expr-' + size + (pop ? ' g7-pop' : '') + (className ? ' ' + className : '')}
    style={{ ...(tone ? { color: tone } : null), ...style }}
  >
    <Fx>{children}</Fx>
  </div>
)

// Ish yuzasi. `tone`: paper (asosiy), quiet (fon), teal (grafik/ma'no), dark.
export const Panel = ({ children, style, className, tone = 'paper', pad }) => (
  <div
    className={'g7-panel g7-panel-' + tone + (className ? ' ' + className : '')}
    style={{ ...(pad !== undefined ? { padding: pad } : null), ...style }}
  >
    {children}
  </div>
)

// Eski nom -- darslar buzilmasin.
export const Frame = Panel

// Ikki ustun. `l` -- chap ustun ulushi (fr). 860px dan tor bo'lsa VERTIKAL
// bo'limlarga aylanadi, ma'no tartibi saqlanadi.
export const Cols = ({ l = 1, r = 1, gap, children, style, className, align = 'stretch', grow = false }) => (
  <div
    className={'g7-cols' + (grow ? ' g7-cols-grow' : '') + (className ? ' ' + className : '')}
    style={{ gridTemplateColumns: 'minmax(0,' + l + 'fr) minmax(0,' + r + 'fr)', alignItems: align, ...(gap !== undefined ? { gap } : null), ...style }}
  >
    {children}
  </div>
)

export const Col = ({ children, style, className, gap }) => (
  <div className={'g7-col' + (className ? ' ' + className : '')} style={{ ...(gap !== undefined ? { gap } : null), ...style }}>
    {children}
  </div>
)

// Xizmat yorlig'i: katta harf, keng trekingli.
export const Tag = ({ children, tone = 'quiet', style }) => (
  <span className={'g7-tag g7-tag-' + tone} style={style}>{children}</span>
)

export const Btn = ({ children, onClick, disabled, tone = 'solid', ready, style, title }) => (
  <button
    type="button"
    className={'g7-btn g7-btn-' + tone + (ready && !disabled ? ' g7-btn-ready' : '')}
    onClick={onClick}
    disabled={disabled}
    style={style}
    title={title}
  >
    {children}
  </button>
)

const BADGES = ['A', 'B', 'C', 'D', 'E', 'F']

// Variantlar. To'g'risi YASHIL faqat tasdiqdan keyin, xatosi AMBER (qizil emas).
// Javobdan keyin qolganlari yig'ilib ketadi -- joy razbor uchun bo'shaydi.
export const Options = ({ items, picked, wrong, onPick, disabled, cols = 2, minH, collapse = true, badges = true, dense = false, neutral = false }) => {
  const solved = !!picked
  const shrink = solved && collapse
  return (
    <div
      className={'g7-options' + (dense ? ' g7-options-dense' : '')}
      style={{
        gridTemplateColumns: shrink ? '1fr' : 'repeat(' + cols + ', minmax(0, 1fr))',
        justifyItems: shrink ? 'center' : 'stretch',
        gap: shrink ? 0 : undefined,
      }}
    >
      {items.map((item, i) => {
        const isPicked = picked === item.id
        const isWrong = wrong && wrong.indexOf(item.id) !== -1
        const gone = shrink && !isPicked
        const cls = ['g7-opt']
        if (isPicked) cls.push(neutral ? 'g7-opt-neutral' : 'g7-opt-ok')
        else if (isWrong) cls.push('g7-opt-tip')
        return (
          <button
            type="button"
            key={item.id}
            className={cls.join(' ')}
            disabled={disabled || isWrong || solved}
            onClick={() => onPick(item)}
            style={{
              minHeight: gone ? 0 : minH,
              maxHeight: gone ? 0 : 260,
              paddingTop: gone ? 0 : undefined,
              paddingBottom: gone ? 0 : undefined,
              opacity: gone ? 0 : 1,
              transform: gone ? 'translateY(-6px)' : 'none',
              borderWidth: gone ? 0 : undefined,
              width: isPicked && shrink ? '100%' : undefined,
              maxWidth: isPicked && shrink ? 560 : undefined,
              transitionDelay: gone ? i * 0.05 + 's' : '0s',
            }}
          >
            {badges ? (
              <span className="g7-opt-badge" style={{ color: isPicked && !neutral ? T.ok : isWrong ? T.tip : T.ink3 }}>
                {isPicked ? (neutral ? BADGES[i] : '✓') : isWrong ? '↺' : BADGES[i]}
              </span>
            ) : null}
            <span className={'g7-opt-text' + (looksMath(item.label) ? ' g7-opt-math' : '')}>
              <Fx>{item.label}</Fx>
            </span>
          </button>
        )
      })}
    </div>
  )
}

// Javob berilgan savol shu qatorga yig'iladi.
export const DoneRow = ({ children }) => (
  <div className="g7-done">
    <span className="g7-done-tick">{'✓'}</span>
    <span className="g7-done-text"><Fx>{children}</Fx></span>
  </div>
)

// Feedback. Skroll YO'Q: blok oldindan band qilingan slot ichida ochiladi.
export const Feedback = ({ show, ok, tone, children }) => {
  const lang = useContext(LangContext)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (!show) { setVisible(false); return undefined }
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
    return () => cancelAnimationFrame(raf)
  }, [show])
  if (!show) return null
  return (
    <div
      className={'g7-fb ' + (tone === 'neutral' ? 'g7-fb-neutral' : ok ? 'g7-fb-ok' : 'g7-fb-tip') + (visible ? ' g7-fb-on' : '')}
      aria-label={tone === 'neutral' ? '' : tr(ok ? UI_TXT.right : UI_TXT.hint, lang)}
    >
      <span className="g7-fb-glyph" aria-hidden="true">{tone === 'neutral' ? '→' : ok ? '✓' : '↺'}</span>
      <span className="g7-fb-body">{children}</span>
    </div>
  )
}

export const Hint = ({ children }) => (children ? <p className="g7-hint">{children}</p> : null)

// ============================================================
// LawBox -- QOIDA va QONUN uchun ramka. Metodist talabi 2026-08-06:
// asosiy formulalar ramkaga olinsin va vizual urg'u berilsin, ular oddiy
// ish yozuvidan farq qilib turishi kerak.
// ============================================================
export const LawBox = ({ label, formula, note, tone = 'accent' }) => (
  <div className={'g7-law g7-law-' + tone} style={label ? undefined : { marginTop: 8 }}>
    {label ? <span className="g7-law-label">{label}</span> : null}
    <span className="g7-law-f"><Fx>{formula}</Fx></span>
    {note ? <span className="g7-law-note"><Fx>{note}</Fx></span> : null}
  </div>
)

// Insight -- BONUS va LAYFXAK bloklari. Bir gap, ortiq emas.
export const Insight = ({ label, children, tone = 'graph' }) => (
  <div className={'g7-insight g7-insight-' + tone}>
    <span className="g7-insight-label">{label}</span>
    <span className="g7-insight-body">{children}</span>
  </div>
)

// Qoida kartochkasi -- TO'Q yuza (#1F292B). Satrlar 180 ms oralab ochiladi.
export const RuleCard = ({ badge, lines, example, wide, law, laws, lawLabel }) => (
  <div className={'g7-rule' + (wide ? ' g7-rule-wide' : '')}>
    <span className="g7-rule-badge">{badge}</span>
    {law ? <LawBox label={lawLabel || badge} formula={law} tone="dark" /> : null}
    {laws ? laws.map((w, i) => (
      <LawBox key={i} label={i === 0 ? (lawLabel || badge) : null} formula={w.formula} note={w.note} tone="dark" />
    )) : null}
    <span className="g7-rule-rule" aria-hidden="true" />
    {lines.map((line, i) => (
      <span key={i} className="g7-rule-line" style={{ animationDelay: i * 0.18 + 's' }}><Fx>{line}</Fx></span>
    ))}
    {example ? (
      <span className="g7-rule-example" style={{ animationDelay: lines.length * 0.18 + 's' }}><Fx>{example}</Fx></span>
    ) : null}
  </div>
)

// DTM tayyorlik halqasi. SVG, mahalliy komponent.
export const RingProgress = ({ value, total, label, sub, size = 132 }) => {
  const r = (size - 14) / 2
  const c = 2 * Math.PI * r
  const frac = total > 0 ? Math.max(0, Math.min(1, value / total)) : 0
  const tone = frac >= 1 ? T.ok : frac >= 0.75 ? T.graph : T.tip
  return (
    <div className="g7-ring">
      <svg width={size} height={size} viewBox={'0 0 ' + size + ' ' + size} role="img" aria-label={String(value) + '/' + String(total)}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={T.line} strokeWidth="9" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={tone} strokeWidth="9" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - frac)}
          transform={'rotate(-90 ' + size / 2 + ' ' + size / 2 + ')'}
          className="g7-ring-arc"
        />
        <text x={size / 2} y={size / 2 + 2} textAnchor="middle" className="g7-ring-num" fill={tone}>{value}</text>
        <text x={size / 2} y={size / 2 + 22} textAnchor="middle" className="g7-ring-den" fill={T.ink2}>{'/ ' + total}</text>
      </svg>
      {label ? <span className="g7-ring-label">{label}</span> : null}
      {sub ? <span className="g7-ring-sub">{sub}</span> : null}
    </div>
  )
}

// Yumshoq taymer: vaqtni KO'RSATADI, lekin urinishni olmaydi va bloklamaydi.
export const SoftTimer = ({ running = true, label }) => {
  const [sec, setSec] = useState(0)
  useEffect(() => {
    if (!running) return undefined
    const id = setInterval(() => setSec((v) => v + 1), 1000)
    return () => clearInterval(id)
  }, [running])
  const mm = String(Math.floor(sec / 60)).padStart(2, '0')
  const ss = String(sec % 60).padStart(2, '0')
  return (
    <span className="g7-timer" title={label}>
      <span className="g7-timer-dot" />
      <span className="g7-mono">{mm + ':' + ss}</span>
    </span>
  )
}

// ============================================================
// FON: faqat CSS gradientlar + mahalliy SVG egri chiziqlar.
// Rasm fayli, tashqi URL YO'Q. Opacity 0.04-0.12 oralig'ida.
// ============================================================
const BgCurves = () => (
  <svg className="g7-bgcurves" viewBox="0 0 520 900" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <g fill="none" stroke={T.graph} strokeWidth="1.6">
      <path d="M40 860 C 150 860 190 520 250 300 C 290 150 360 60 500 30" opacity=".55" />
      <path d="M0 700 C 140 700 200 430 270 250 C 320 120 400 50 520 20" opacity=".33" />
      <path d="M90 880 C 210 880 250 600 320 420 C 370 290 440 200 520 160" opacity=".22" />
    </g>
    <g stroke={T.accent} strokeWidth="1.2" opacity=".3">
      <path d="M0 180 H 520" strokeDasharray="2 10" />
      <path d="M0 470 H 520" strokeDasharray="2 10" />
    </g>
  </svg>
)

// ============================================================
// QORALAMALAR. localStorage da saqlanadi, BAHOGA TA'SIR QILMAYDI.
// ============================================================
// Qoralama kaliti DARSDAN: yadroda qotib qolsa hamma dars bitta qoralamani
// bo'lishardi.
const notesKey = () => 'g7-notes-' + (cfg.lessonId || 'dars')

const NotesPanel = ({ open, onClose }) => {
  const t = useT()
  const [text, setText] = useState('')
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    if (!open || typeof window === 'undefined') return
    try { setText(window.localStorage.getItem(notesKey()) || '') } catch { /* xususiy rejim */ }
  }, [open])

  if (!open) return null

  const save = () => {
    try { window.localStorage.setItem(notesKey(), text) } catch { /* xususiy rejim */ }
    setFlash(true)
    setTimeout(() => setFlash(false), 1400)
  }

  return (
    <div className="g7-notes-wrap" role="dialog" aria-label={t(UI_TXT.notesTitle)}>
      <div className="g7-notes">
        <div className="g7-notes-head">
          <span className="g7-tag g7-tag-quiet">{t(UI_TXT.notesTitle)}</span>
          <button type="button" className="g7-icon" onClick={onClose} aria-label={t(UI_TXT.close)}>{'✕'}</button>
        </div>
        <textarea
          className="g7-notes-area"
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
        />
        <div className="g7-notes-foot">
          <span className="g7-notes-hint">{t(UI_TXT.notesHint)}</span>
          <Btn tone={flash ? 'ok' : 'soft'} onClick={save}>{flash ? t(UI_TXT.saved) : t(UI_TXT.save)}</Btn>
        </div>
      </div>
    </div>
  )
}

// 15-ekran uchun ichki qoralama bloki. Xuddi shu kalit, bahoga ta'sir qilmaydi.
export const NotesInline = ({ rows = 4, extra }) => {
  const t = useT()
  const [text, setText] = useState('')
  const [flash, setFlash] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined') return
    try { setText(window.localStorage.getItem(notesKey()) || '') } catch { /* xususiy rejim */ }
  }, [])
  const save = () => {
    try { window.localStorage.setItem(notesKey(), text) } catch { /* xususiy rejim */ }
    setFlash(true)
    setTimeout(() => setFlash(false), 1400)
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
      <Tag tone="quiet">{t(UI_TXT.notesTitle)}</Tag>
      <textarea
        className="g7-notes-area"
        rows={rows}
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
        style={{ flex: 'none', minHeight: 0 }}
      />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
        <span className="g7-notes-hint" style={{ flex: 1, minWidth: 90 }}>{t(UI_TXT.notesHint)}</span>
        {extra}
        <Btn tone={flash ? 'ok' : 'soft'} onClick={save} style={{ minHeight: 34, padding: '0 12px' }}>
          {flash ? t(UI_TXT.saved) : t(UI_TXT.save)}
        </Btn>
      </div>
    </div>
  )
}

// Til almashtirgich: uch til teng huquqli, shuning uchun uchtasi ham
// ko'rinadi -- yashirin ro'yxatda emas.
const LANGS = [
  { id: 'uz', label: 'UZ' },
  { id: 'ru', label: 'RU' },
  { id: 'en', label: 'EN' },
]

export const LangSwitch = () => {
  const lang = useLang()
  const setLang = useContext(LangSetContext)
  if (!setLang) return null
  return (
    <span className="g7-langsw" role="group" aria-label="Til / Язык / Language">
      {LANGS.map((l) => (
        <button
          type="button"
          key={l.id}
          className={'g7-langsw-b' + (l.id === lang ? ' is-on' : '')}
          onClick={() => setLang(l.id)}
          aria-pressed={l.id === lang}
        >
          {l.label}
        </button>
      ))}
    </span>
  )
}

// Blok ichidagi o'rin: o'quvchi logarifmik tengsizliklar B2 ning to'rtinchi
// qadami ekanini ko'radi, alohida tema emas. Ma'lumot darsdan keladi.
export const BlockMap = ({ label, from, to, current }) => {
  const n = to - from + 1
  return (
    <span className="g7-bmap" title={label}>
      <span className="g7-bmap-label">{label}</span>
      {Array.from({ length: n }, (_, i) => {
        const no = from + i
        return (
          <i
            key={no}
            className={'g7-bmap-i' + (no < current ? ' is-done' : no === current ? ' is-now' : '')}
          />
        )
      })}
      <span className="g7-bmap-num g7-mono">{current - from + 1}/{n}</span>
    </span>
  )
}

// Chop etiladigan shpargalka. Ekranda KO'RINMAYDI, faqat chop etishda.
export const PrintSheet = ({ title, law, steps, lifehack, source }) => (
  <div className="g7-print" aria-hidden="true">
    <h2>{title}</h2>
    <p className="g7-print-law"><Fx>{law}</Fx></p>
    <ol>
      {steps.map((x, i) => <li key={i}><Fx>{x}</Fx></li>)}
    </ol>
    <p className="g7-print-life">{lifehack}</p>
    {source ? <p className="g7-print-src">{source}</p> : null}
  </div>
)

// ============================================================
// STAGE. Yuqori panel (M11, fan, 15 bo'lakli progress, bo'lim, raqam,
// qoralama / qayta / ovoz), kontent, pastki navigatsiya.
// .stage-content -- overflow: clip, SKROLL YO'Q.
// ============================================================
// `field` -- ish maydonining RANGI. Uch alohida ekran faqat shu bilan ajraladi:
// xuk graph, qoida accent, yakun ok (ETALON_7SINF.md 6.5). Shapka, pastki panel,
// tugma va shrift o'lchovlari o'zgarmaydi.
export const Stage = ({ eyebrow, right, block, screen, total, audio, nav, navCenter, field, children }) => {
  const t = useT()
  const [notesOpen, setNotesOpen] = useState(false)
  const sect = sectionOf(screen)
  const [from, to] = SECTION_RANGE[sect]
  const inSection = screen - from + 1
  const sectionSize = to - from + 1

  return (
    <div className="stage">
      <div className="stage-header">
        <div className="g7-top">
          <span className="g7-mark" aria-hidden="true">M<b>7</b></span>
          <span className="g7-top-title">
            {t(UI_TXT.subject)}{cfg.lessonNo ? <span className="g7-dot">{'·'}</span> : null}{cfg.lessonNo ? t(cfg.lessonNo) : null}
          </span>
          <span className="g7-seg" role="img" aria-label={String(screen + 1) + '/' + String(total)}>
            {Array.from({ length: total }, (_, i) => (
              <i key={i} className={'g7-seg-i' + (i < screen ? ' is-done' : i === screen ? ' is-now' : '')} />
            ))}
          </span>
          <span className="g7-top-sect">{t(UI_TXT.sections[sect])}</span>
          <span className="g7-count g7-mono">{screen + 1}/{total}</span>
          <span className="g7-top-tools">
            <LangSwitch />
            {/* Tugmalarga VIZUAL URG'U: yorliq bilan, kattaroq, holati ko'rinadi */}
            <button type="button" className={'g7-tool' + (notesOpen ? ' is-on' : '')} onClick={() => setNotesOpen((v) => !v)} title={t(UI_TXT.notes)} aria-label={t(UI_TXT.notes)}>
              <b aria-hidden="true">{'✎'}</b><i>{t(UI_TXT.notes)}</i>
            </button>
            <button type="button" className="g7-tool" onClick={audio.replay} title={t(UI_TXT.replay)} aria-label={t(UI_TXT.replay)}>
              <b aria-hidden="true">{'↺'}</b>
            </button>
            <button
              type="button"
              className={'g7-tool g7-tool-sound' + (audio.muted ? ' is-off' : ' is-on')}
              onClick={audio.toggleMute}
              title={t(UI_TXT.sound)}
              aria-label={t(UI_TXT.sound)}
            >
              <b aria-hidden="true">{audio.muted ? '✕' : '♪'}</b>
              {audio.isPlaying ? <s className="g7-tool-wave" aria-hidden="true" /> : null}
            </button>
          </span>
        </div>
        {eyebrow || right || block ? (
          <div className="g7-eyebrow">
            <span>{eyebrow}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
              {block ? <BlockMap {...block} /> : null}
              {right ? <span className="g7-eyebrow-right g7-mono">{right}</span> : null}
            </span>
          </div>
        ) : null}
      </div>

      <div className={'stage-content' + (field ? ' g7-has-field' : '')}>
        {field ? (
          <div className={'g7-field g7-field-' + field}><div className="g7-stack">{children}</div></div>
        ) : (
          <div className="g7-stack">{children}</div>
        )}
        <NotesPanel open={notesOpen} onClose={() => setNotesOpen(false)} />
      </div>

      <div className="stage-nav">
        <span className="g7-nav-l">{nav && nav.back}</span>
        <span className="g7-nav-c g7-mono">
          {navCenter || (t(UI_TXT.sections[sect]) + '  ' + inSection + ' / ' + sectionSize)}
        </span>
        <span className="g7-nav-r">{nav && nav.next}</span>
      </div>
    </div>
  )
}

export { BgCurves }

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

/* ============ FON: faqat CSS ============ */
.lesson-root {
  position: fixed;
  inset: 0;
  overflow: clip;
  overscroll-behavior: none;
  isolation: isolate;
  font-family: 'Manrope', system-ui, sans-serif;
  color: ${T.ink};
  -webkit-font-smoothing: antialiased;
  zoom: var(--g7z, 1);
  background:
    radial-gradient(circle at 82% 18%, rgba(23,108,112,.09), transparent 30%),
    radial-gradient(circle at 16% 88%, rgba(201,84,44,.07), transparent 34%),
    linear-gradient(rgba(23,26,29,.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(23,26,29,.025) 1px, transparent 1px),
    ${T.bg};
  background-size: auto, auto, 32px 32px, 32px 32px, auto;
}
@media (max-width: 639.98px) {
  .lesson-root { width: 390px; }
}
/* Sayt qobig'i yuqori chapga «Darslar ro'yxati», yuqori o'ngga esa O'ZINING
   til almashtirgichini qo'yadi va ikkisi ham yuqori panelni yopib qo'yardi.
   Faqat KENG ekranda ikki tomondan joy beramiz. */
@media (min-width: 1024px) {
  .stage-header { padding-left: 92px; padding-right: 128px; }
}
/* height 100% SHART: SVG -- almashtiriladigan element, uning avtomatik
   balandligi ICHKI nisbatdan olinadi va bottom 0 e'tiborga OLINMAYDI. Shuning
   uchun 620px kenglikda egri chiziqlar 1073px balandlik olib, ildizdan 458px
   chiqib ketardi (grade7-noscroll topdi, ko'z bilan ko'rinmaydi). */
.g7-bgcurves {
  position: absolute;
  top: 0; right: 0; bottom: 0;
  height: 100%;
  width: min(46%, 620px);
  opacity: .1;
  pointer-events: none;
  z-index: 0;
}
.lesson-root h1, .lesson-root h2, .lesson-root p { margin: 0; padding: 0; }
.lesson-root button { font: inherit; }
.lesson-root :focus-visible {
  outline: 2px solid ${T.graph};
  outline-offset: 3px;
  border-radius: 10px;
}

/* ============ KARKAS ============ */
.stage {
  position: relative;
  z-index: 1;
  width: min(1258px, 100%);
  height: 100%;
  margin: 0 auto;
  padding: 0 clamp(14px, 4vw, 54px);
  display: flex;
  flex-direction: column;
}
/* Brif: yuqori panel ~88px, pastki ~80px. 615px balandlikdagi noutbukda bu
   kontentga juda kam joy qoldiradi, shuning uchun vh bo'yicha qisqaradi. */
.stage-header {
  flex-shrink: 0;
  min-height: clamp(50px, 9.5vh, 88px);
  /* Sayt qobig'ining «Darslar ro'yxati» tugmasi chap yuqorida turadi va
     yuqori panelni yopib qo'yardi. Faqat KENG ekranda joy beramiz. */
  padding-top: clamp(8px, 1.6vh, 16px);
  padding-bottom: clamp(4px, 1vh, 10px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: clamp(4px, .8vh, 9px);
}
.stage-content {
  flex: 1;
  min-height: 0;
  position: relative;
  overflow: clip;
  padding-top: clamp(4px, 1vh, 10px);
  padding-bottom: clamp(4px, 1vh, 10px);
}
/* Maydon rangi: ichki bo'shliq .stage-content ning bo'shligini ALMASHTIRADI,
   shuning uchun balandlik budjeti o'zgarmaydi. */
.stage-content.g7-has-field { padding-top: 0; padding-bottom: 0; }
.g7-field {
  height: 100%;
  border-radius: 16px;
  border-left: 4px solid transparent;
  padding: clamp(4px, 1vh, 10px) clamp(10px, 1.4vw, 16px);
  overflow: clip;
}
.g7-field-graph { background: ${T.graphSoft}; border-left-color: ${T.graph}; }
.g7-field-accent { background: ${T.accentSoft}; border-left-color: ${T.accent}; }
.g7-field-ok { background: ${T.okSoft}; border-left-color: ${T.ok}; }
/* Maydon rangi bilan bir xil bo'lgan element OQ ga aylanadi, aks holda chegara
   ko'rinmaydi. */
.g7-field-accent .g7-panel-paper, .g7-field-graph .g7-panel-paper,
.g7-field-ok .g7-panel-paper { background: ${T.paper}; }
.stage-nav {
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
.g7-nav-l { justify-self: start; }
.g7-nav-c { justify-self: center; font-size: clamp(10px, .85vw, 12px); letter-spacing: .12em; text-transform: uppercase; color: ${T.ink2}; white-space: nowrap; }
.g7-nav-r { justify-self: end; }
.g7-stack {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: clamp(6px, 1.1vh, 13px);
}

/* ============ YUQORI PANEL ============ */
.g7-top { display: flex; align-items: center; gap: clamp(8px, 1.4vw, 16px); min-width: 0; }
.g7-mark {
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
.g7-mark b { color: ${T.accent}; font-weight: 700; }
.g7-top-title {
  flex-shrink: 0;
  font-size: clamp(10px, .85vw, 12px);
  letter-spacing: .14em;
  text-transform: uppercase;
  font-weight: 600;
  color: ${T.ink2};
  white-space: nowrap;
}
.g7-dot { padding: 0 .5em; color: ${T.ink3}; }
.g7-seg { flex: 1; min-width: 40px; display: flex; gap: 3px; align-items: center; }
.g7-seg-i {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: rgba(23,26,29,.12);
  transition: background .3s cubic-bezier(.22,.61,.36,1), transform .3s cubic-bezier(.22,.61,.36,1);
}
.g7-seg-i.is-done { background: ${T.graph}; }
.g7-seg-i.is-now { background: ${T.accent}; transform: scaleY(2); }
.g7-top-sect {
  flex-shrink: 0;
  font-family: 'Fraunces', 'Source Serif 4', Georgia, serif;
  font-size: clamp(12px, 1.05vw, 15px);
  font-weight: 600;
  color: ${T.ink};
  white-space: nowrap;
}
.g7-count { flex-shrink: 0; font-size: clamp(10px, .9vw, 12px); font-weight: 700; color: ${T.ink2}; }
.g7-top-tools { flex-shrink: 0; display: flex; gap: 6px; }
.g7-icon {
  width: 30px; height: 30px; padding: 0; border: 0; border-radius: 10px;
  background: ${T.paper}; color: ${T.ink2}; cursor: pointer; line-height: 1;
  font-size: 13px;
  box-shadow: 0 2px 9px -5px rgba(${T.shadow},.4), inset 0 0 0 1px ${T.line};
  transition: box-shadow .24s cubic-bezier(.22,.61,.36,1), color .24s, transform .24s cubic-bezier(.22,.61,.36,1);
}
.g7-icon:hover { transform: translateY(-1px); box-shadow: 0 6px 15px -6px rgba(${T.shadow},.45), inset 0 0 0 1px ${T.line}; }
.g7-icon.is-on { color: ${T.graph}; box-shadow: 0 2px 9px -5px rgba(${T.shadow},.4), inset 0 0 0 1px rgba(23,108,112,.4); }

/* ============ TIPOGRAFIKA ============ */
.g7-eyebrow {
  display: flex; align-items: baseline; justify-content: space-between; gap: 10px;
  font-size: clamp(10px, .85vw, 12px); letter-spacing: .16em; text-transform: uppercase;
  font-weight: 600; color: ${T.ink2}; flex-shrink: 0; min-width: 0;
}
.g7-eyebrow > span:first-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.g7-eyebrow-right { color: ${T.accent}; flex-shrink: 0; letter-spacing: .06em; }
.g7-title {
  font-family: 'Fraunces', 'Source Serif 4', Georgia, serif;
  font-weight: 600;
  line-height: 1.05;
  letter-spacing: -.015em;
  font-size: clamp(18px, 2.35vw, 33px);
  flex-shrink: 0;
}
.g7-expr, .g7-mono {
  font-family: ${MATH_FONT};
  font-weight: 600;
  /* Raqamlar tabular: jadval ustunlari va o'q belgilari ustma-ust turadi.
     Ligaturalar o'chiriladi -- tengsizlik ishorasi bitta belgiga
     qo'shilib ketmasin. So'z oralig'i kengaytirilgan: serifda amal
     belgilari atrofidagi bo'shliq monoshriftdagidan tor. */
  letter-spacing: 0;
  word-spacing: .12em;
  font-variant-ligatures: none;
  font-feature-settings: 'liga' 0;
  font-variant-numeric: tabular-nums lining-nums;
}
/* O'zgaruvchi KURSIV, funksiya nomi va raqam TIK (ISO 80000-2). */
.g7-var { font-style: italic; font-synthesis: none; }
.g7-expr { text-align: center; white-space: nowrap; }
.g7-wrap { white-space: normal; overflow-wrap: anywhere; }
.g7-expr-hero { font-size: clamp(26px, 3.1vw, 40px); letter-spacing: -.02em; }
.g7-expr-big { font-size: clamp(22px, 2.4vw, 30px); }
.g7-expr-mid { font-size: clamp(18px, 1.8vw, 24px); }
.g7-expr-row { font-size: clamp(16px, 1.6vw, 22px); text-align: left; }
.g7-expr-sm { font-size: clamp(13px, 1.15vw, 15px); text-align: left; }
/* Serifda indeks monoshriftdagidan kichikroq va boshqa balandlikda
   o'tiradi; og'irligi bir pog'ona ko'tarildi -- aks holda mayda indeks
   asosiy satrdan solg'in ko'rinadi. */
.g7-idx { font-size: max(10.5px, .68em); font-weight: 700; letter-spacing: .01em; font-style: normal; }
sub.g7-idx { vertical-align: -.20em; }
sup.g7-idx { vertical-align: .46em; }
.g7-hint { font-size: clamp(14px, 1.15vw, 16px); line-height: 1.45; color: ${T.ink2}; }
.g7-ask { font-size: clamp(14px, 1.2vw, 16px); line-height: 1.4; font-weight: 700; color: ${T.ink}; }
.g7-tag {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: clamp(10px, .82vw, 11.5px); letter-spacing: .15em; text-transform: uppercase; font-weight: 700;
  padding: 4px 9px; border-radius: 7px; white-space: nowrap;
}
.g7-tag-quiet { color: ${T.ink2}; background: rgba(23,26,29,.05); }
.g7-tag-accent { color: ${T.accent}; background: ${T.accentSoft}; }
.g7-tag-graph { color: ${T.graph}; background: ${T.graphSoft}; }
.g7-tag-ok { color: ${T.ok}; background: ${T.okSoft}; }
.g7-tag-tip { color: ${T.tip}; background: ${T.tipSoft}; }

/* ============ USTUNLAR ============ */
.g7-cols {
  display: grid;
  gap: clamp(10px, 1.6vw, 26px);
  /* min-height: 0 EMAS. Flex ustunda u konteynerni kontentdan kichik qilib
     siqar, kontent esa tashqariga chiqib keyingi blok ustiga minardi --
     scrollHeight o'smaganligi uchun tekshiruv ham ko'rmasdi. */
  min-height: min-content;
}
.g7-cols-grow { flex: 1; }
.g7-col { display: flex; flex-direction: column; gap: clamp(6px, 1.1vh, 13px); min-width: 0; min-height: 0; }
.g7-cols3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(7px, 1vw, 14px); min-width: 0; }
.g7-cols3 > * { min-width: 0; }
@media (max-width: 859.98px) {
  /* Telefonda ustunlar VERTIKAL bo'limlarga aylanadi, ma'no tartibi saqlanadi.
     Balandliklar qo'shilganligi uchun yuzalar va matn bir pog'ona kichrayadi. */
  .g7-cols { grid-template-columns: minmax(0, 1fr) !important; gap: clamp(6px, 1.2vh, 10px); }
  .g7-cols3 { grid-template-columns: minmax(0, 1fr); gap: clamp(5px, 1vh, 8px); }
  .g7-panel { padding: 9px 10px; border-radius: 13px; }
  .g7-col { gap: 6px; }
  .g7-stack { gap: 7px; }
  .g7-opt { min-height: 42px; padding: 8px 12px; }
  .g7-options { gap: 6px; }
  .g7-title { font-size: 19px; }
  .g7-law { padding: clamp(5px, 1.1vh, 9px) 11px; }
  .g7-rule { padding: clamp(6px, 1.4vh, 10px) 12px; gap: clamp(2px, .4vh, 3px); }
  .g7-fold-item { font-size: 11px; }
  .g7-fold-list { gap: 9px; }
  /* Nuqta tanlagich telefonda QATOR bo'ladi: uch tugma ustma-ust 120px olardi */
  .g7-pick-v { flex-direction: row !important; flex-wrap: wrap !important; }
  .g7-pick-v > button { flex: 1; min-width: 84px; }
}

/* ============ YUZALAR ============ */
.g7-panel {
  border-radius: 16px;
  padding: clamp(10px, 1.5vw, 18px);
  overflow: clip;
  min-width: 0;
}
.g7-panel-paper {
  background: ${T.paper};
  box-shadow: 0 10px 26px -12px rgba(${T.shadow},.22), inset 0 0 0 1px ${T.line};
}
.g7-panel-quiet {
  background: rgba(255,253,248,.55);
  box-shadow: inset 0 0 0 1px ${T.line};
}
.g7-panel-teal {
  background: ${T.graphSoft};
  box-shadow: inset 0 0 0 1px rgba(23,108,112,.22);
}
.g7-panel-dark {
  background: ${T.dark};
  color: ${T.paper};
  box-shadow: 0 14px 32px -14px rgba(${T.shadow},.55);
}
.g7-panel-dark .g7-hint, .g7-panel-dark .g7-ask { color: rgba(255,253,248,.72); }

/* ============ VARIANTLAR ============ */
.g7-options { display: grid; gap: clamp(7px, .9vw, 11px); flex-shrink: 0; }
.g7-opt {
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
  transition-property: opacity, max-height, min-height, padding, transform, background, color, box-shadow;
  transition-duration: .42s, .5s, .5s, .38s, .3s, .24s, .24s, .24s;
  transition-timing-function: cubic-bezier(.22, .61, .36, 1);
}
.g7-options-dense .g7-opt { min-height: clamp(38px, 2.9vw, 44px); padding: 7px 12px; font-size: clamp(12px, 1vw, 13.5px); }
.g7-opt:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 26px -14px rgba(${T.shadow},.5), inset 0 0 0 1px ${T.line}; }
.g7-opt:disabled { cursor: default; }
.g7-opt-math {
  font-family: ${MATH_FONT};
  font-weight: 600;
  letter-spacing: 0;
  word-spacing: .1em;
  font-variant-numeric: tabular-nums lining-nums;
  font-size: 1.06em;
}
.g7-opt-badge { flex-shrink: 0; min-width: 16px; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; font-weight: 700; }
/* min-width 0 va overflow-wrap: flex-element min-content dan kichrayolmaydi,
   ya'ni UZUN SO'Z tugmadan chiqib ketadi va overflow hidden uni JIMGINA
   kesadi -- 390 da o'zbekcha qo'shiluvchining shunday kesilgan.
   anywhere min-content hisobiga ham kiradi, break-word esa kirmaydi. */
.g7-opt-text { flex: 1; min-width: 0; overflow-wrap: anywhere; }
/* YASHIL faqat tasdiqdan keyin. */
.g7-opt-ok { background: ${T.okSoft}; color: ${T.ok}; box-shadow: 0 10px 24px -14px rgba(40,119,74,.5), inset 0 0 0 1px rgba(40,119,74,.3); }
/* Xato urinish AMBER, qizil EMAS. */
.g7-opt-tip { background: ${T.tipSoft}; color: ${T.tip}; box-shadow: 0 10px 24px -14px rgba(165,93,25,.45), inset 0 0 0 1px rgba(165,93,25,.26); }

/* ============ TUGMALAR ============ */
.g7-btn {
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
.g7-btn-solid { background: ${T.ink}; color: ${T.paper}; box-shadow: 0 10px 24px -12px rgba(${T.shadow},.6); }
.g7-btn-solid:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 16px 30px -12px rgba(${T.shadow},.7); }
.g7-btn-accent { background: ${T.accent}; color: #fff; box-shadow: 0 10px 24px -12px rgba(201,84,44,.75); }
.g7-btn-accent:hover:not(:disabled) { transform: translateY(-2px); background: #B44822; }
.g7-btn-ok { background: ${T.okSoft}; color: ${T.ok}; box-shadow: inset 0 0 0 1px rgba(40,119,74,.3); }
.g7-btn-ghost { background: transparent; color: ${T.ink2}; padding: 0 clamp(10px, 1.1vw, 16px); }
.g7-btn-ghost:hover:not(:disabled) { color: ${T.ink}; background: rgba(255,253,248,.7); box-shadow: inset 0 0 0 1px ${T.line}; }
.g7-btn-soft { background: ${T.paper}; color: ${T.ink}; box-shadow: 0 8px 20px -14px rgba(${T.shadow},.4), inset 0 0 0 1px ${T.line}; }
.g7-btn-soft:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 26px -14px rgba(${T.shadow},.5), inset 0 0 0 1px ${T.line}; }
.g7-btn:disabled { opacity: .38; cursor: not-allowed; box-shadow: none; transform: none; }
/* Kutilayotgan tugma: FAQAT soya halqasi. scale YO'Q -- keng tugmada gorizontal
   oshib ketish beradi (7-sinfda 40px bergan edi). */
.g7-btn-ready { animation: g7-ready 1.9s ease-in-out infinite; }
@keyframes g7-ready {
  0%, 100% { box-shadow: 0 10px 24px -12px rgba(201,84,44,.7), 0 0 0 0 rgba(201,84,44,.42); }
  55% { box-shadow: 0 14px 28px -12px rgba(201,84,44,.8), 0 0 0 8px rgba(201,84,44,0); }
}

/* ============ QATOR, MASLAHAT, QOIDA ============ */
.g7-done {
  display: flex; align-items: flex-start; gap: 8px; flex-shrink: 0; min-width: 0;
  font-size: clamp(12px, 1vw, 13.5px); color: ${T.ink2};
}
.g7-done-tick { color: ${T.ok}; font-weight: 800; flex-shrink: 0; }
.g7-done-text { font-family: ${MATH_FONT}; min-width: 0; white-space: normal; overflow-wrap: anywhere; }

.g7-fb {
  display: flex; flex-direction: row; align-items: center; gap: clamp(9px, 1.2vw, 14px);
  padding: clamp(8px, 1vw, 12px) clamp(11px, 1.3vw, 16px);
  border-radius: 14px;
  border-left: 4px solid transparent;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity .32s cubic-bezier(.22,.61,.36,1), transform .32s cubic-bezier(.22,.61,.36,1);
}
.g7-fb-on { opacity: 1; transform: translateY(0); }
.g7-fb-ok { background: ${T.okSoft}; border-left-color: ${T.ok}; }
.g7-fb-tip { background: ${T.tipSoft}; border-left-color: ${T.tip}; }
.g7-fb-glyph {
  flex-shrink: 0;
  width: clamp(26px, 2.2vw, 32px); height: clamp(26px, 2.2vw, 32px);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: clamp(13px, 1.1vw, 16px); font-weight: 800; line-height: 1;
}
.g7-fb-ok .g7-fb-glyph { background: rgba(40,119,74,.14); color: ${T.ok}; }
.g7-fb-tip .g7-fb-glyph { background: rgba(165,93,25,.14); color: ${T.tip}; }
.g7-fb-body {
  flex: 1; min-width: 0;
  font-family: 'Source Serif 4', Georgia, serif;
  font-weight: 600;
  font-size: clamp(13px, 1.2vw, 17px);
  line-height: 1.28;
}
.g7-fb-ok .g7-fb-body { color: ${T.ok}; }
.g7-fb-tip .g7-fb-body { color: ${T.tip}; }

.g7-rule {
  display: flex; flex-direction: column; gap: 5px; flex-shrink: 0;
  padding: clamp(12px, 1.5vw, 20px) clamp(13px, 1.6vw, 22px);
  border-radius: 16px;
  background: ${T.dark};
  color: ${T.paper};
  box-shadow: 0 16px 34px -16px rgba(${T.shadow},.6);
}
.g7-rule-badge { font-size: clamp(9.5px, .8vw, 11px); font-weight: 800; letter-spacing: .16em; text-transform: uppercase; color: ${T.accent}; }
.g7-rule-rule { display: block; height: 1px; background: rgba(255,253,248,.16); margin: 3px 0 5px; }
.g7-rule-line, .g7-rule-example {
  /* Qoida satrlari matematika bilan aralash (formula + izoh) -- hammasi
     serif, tepasidagi qonun qutisi bilan bir tilda ko'rinadi. */
  font-family: ${MATH_FONT};
  font-size: clamp(12.5px, 1.1vw, 15px);
  line-height: 1.34;
  opacity: 0;
  animation: g7-in .42s cubic-bezier(.22,.61,.36,1) forwards;
  color: rgba(255,253,248,.94);
}
.g7-rule-line:first-of-type { font-weight: 700; color: ${T.paper}; }
.g7-rule-example { font-family: ${MATH_FONT}; color: rgba(255,253,248,.5); font-size: clamp(10.5px, .9vw, 12px); }
.g7-rule-wide .g7-rule-line { font-size: clamp(13px, 1.2vw, 16px); }

/* ============ QOIDA RAMKASI (LawBox) ============ */
.g7-law {
  position: relative;
  display: flex; flex-direction: column; gap: 3px;
  padding: clamp(10px, 1.2vw, 15px) clamp(12px, 1.4vw, 18px);
  border-radius: 13px;
  margin: 2px 0 4px;
}
.g7-law-accent {
  background: ${T.paper};
  box-shadow: inset 0 0 0 2px ${T.accent}, 0 10px 26px -16px rgba(201,84,44,.5);
}
.g7-law-graph {
  background: ${T.graphSoft};
  box-shadow: inset 0 0 0 2px ${T.graph};
}
/* To'q kartochka ichida: yorug' ramka */
.g7-law-dark {
  background: rgba(255,253,248,.06);
  box-shadow: inset 0 0 0 2px rgba(201,84,44,.85);
}
.g7-law-label {
  position: absolute; top: -8px; left: 12px;
  font-size: clamp(9px, .75vw, 10.5px); font-weight: 800;
  letter-spacing: .18em; text-transform: uppercase;
  padding: 2px 7px; border-radius: 5px;
  background: ${T.accent}; color: #fff;
  white-space: nowrap;
}
.g7-law-graph .g7-law-label { background: ${T.graph}; }
.g7-law-f {
  font-family: ${MATH_FONT};
  font-weight: 600;
  letter-spacing: 0;
  font-variant-ligatures: none;
  font-size: clamp(14px, 1.35vw, 19px);
  line-height: 1.35;
  padding-top: 3px;
  overflow-wrap: anywhere;
}
.g7-law-dark .g7-law-f { color: ${T.paper}; }
.g7-law-note { font-size: clamp(11px, .95vw, 12.5px); color: ${T.ink2}; line-height: 1.3; }
.g7-law-dark .g7-law-note { color: rgba(255,253,248,.6); }

/* ============ BONUS va LAYFXAK ============ */
.g7-insight {
  position: relative;
  display: flex; flex-direction: column; gap: 4px;
  padding: clamp(9px, 1.1vw, 14px) clamp(11px, 1.3vw, 16px);
  border-radius: 13px;
  border-left: 4px solid ${T.graph};
  background: ${T.graphSoft};
}
.g7-insight-accent { border-left-color: ${T.accent}; background: ${T.accentSoft}; }
.g7-insight-label {
  font-size: clamp(9.5px, .8vw, 11px); font-weight: 800;
  letter-spacing: .18em; text-transform: uppercase; color: ${T.graph};
}
.g7-insight-accent .g7-insight-label { color: ${T.accent}; }
.g7-insight-body { font-size: clamp(12.5px, 1.05vw, 14px); line-height: 1.42; color: ${T.ink}; }

/* ============ HALQA, TAYMER ============ */
.g7-ring { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.g7-ring-arc { transition: stroke-dashoffset .7s cubic-bezier(.22,.61,.36,1); }
.g7-ring-num { font-family: ${MATH_FONT}; font-size: 30px; font-weight: 700; }
.g7-ring-den { font-family: ${MATH_FONT}; font-size: 12px; }
.g7-ring-label { font-size: clamp(10px, .85vw, 11.5px); letter-spacing: .14em; text-transform: uppercase; font-weight: 700; color: ${T.ink2}; text-align: center; }
.g7-ring-sub { font-size: clamp(11px, 1vw, 13px); color: ${T.ink}; text-align: center; font-weight: 600; }
.g7-timer {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: clamp(11px, .95vw, 13px); color: ${T.ink2};
  padding: 3px 9px; border-radius: 99px; background: rgba(23,26,29,.05);
}
.g7-timer-dot { width: 6px; height: 6px; border-radius: 50%; background: ${T.graph}; opacity: .8; }

/* ============ TIL ALMASHTIRGICH ============ */
.g7-langsw { display: inline-flex; gap: 2px; padding: 2px; border-radius: 10px; background: rgba(23,26,29,.05); }
.g7-langsw-b {
  border: 0; cursor: pointer; padding: 4px 8px; border-radius: 8px;
  font-family: 'Manrope', sans-serif; font-size: 11px; font-weight: 800; letter-spacing: .06em;
  background: transparent; color: ${T.ink3};
  transition: background .24s cubic-bezier(.22,.61,.36,1), color .24s;
}
.g7-langsw-b:hover { color: ${T.ink}; }
.g7-langsw-b.is-on { background: ${T.paper}; color: ${T.accent}; box-shadow: 0 2px 8px -5px rgba(${T.shadow},.4); }

/* ============ ASBOB TUGMALARI: URG'U ============ */
.g7-tool {
  display: inline-flex; align-items: center; gap: 6px;
  height: 34px; padding: 0 10px; border: 0; border-radius: 11px; cursor: pointer;
  background: ${T.paper}; color: ${T.ink2};
  box-shadow: 0 3px 12px -7px rgba(${T.shadow},.5), inset 0 0 0 1px ${T.line};
  transition: transform .24s cubic-bezier(.22,.61,.36,1), box-shadow .24s, color .24s, background .24s;
}
.g7-tool b { font-size: 14px; line-height: 1; font-weight: 700; }
.g7-tool i {
  font-style: normal; font-size: 10.5px; font-weight: 700;
  letter-spacing: .12em; text-transform: uppercase;
}
@media (max-width: 899.98px) { .g7-tool i { display: none; } }
.g7-tool:hover { transform: translateY(-2px); color: ${T.ink}; box-shadow: 0 8px 18px -8px rgba(${T.shadow},.5), inset 0 0 0 1px ${T.line}; }
.g7-tool.is-on { color: ${T.accent}; box-shadow: 0 3px 12px -7px rgba(201,84,44,.6), inset 0 0 0 1.5px rgba(201,84,44,.55); }
.g7-tool-sound.is-on { color: ${T.graph}; box-shadow: 0 3px 12px -7px rgba(23,108,112,.6), inset 0 0 0 1.5px rgba(23,108,112,.5); }
.g7-tool-sound.is-off { color: ${T.ink3}; opacity: .75; }
.g7-tool-wave {
  display: block; width: 5px; height: 5px; border-radius: 50%;
  background: ${T.graph}; animation: g7-wave 1.1s ease-in-out infinite;
}
@keyframes g7-wave { 0%, 100% { opacity: .35; transform: scale(.8); } 50% { opacity: 1; transform: scale(1.25); } }

/* ============ KUTISH IMPULSI ============
   O'quvchi keyingi narsa QAYERDA paydo bo'lishini oldindan biladi: bo'sh joy
   ikki marta yumshoq yorishadi. Cheksiz EMAS, bezak emas -- ishora. */
.g7-await { position: relative; }
.g7-await::after {
  content: '';
  /* inset 0: ilgari -3px edi va konteynerdan 3px chiqib ketardi */
  position: absolute; inset: 0;
  border-radius: 14px;
  box-shadow: inset 0 0 0 1.5px rgba(201,84,44,.4), inset 0 0 16px 0 rgba(201,84,44,.14);
  animation: g7-await 1.5s cubic-bezier(.22,.61,.36,1) 2;
  pointer-events: none;
}
@keyframes g7-await { 0%, 100% { opacity: 0; } 50% { opacity: 1; } }

/* ============ BLOK XARITASI ============ */
.g7-bmap { display: inline-flex; align-items: center; gap: 4px; }
.g7-bmap-label { font-size: clamp(9px, .75vw, 10.5px); letter-spacing: .14em; color: ${T.ink3}; margin-right: 3px; }
.g7-bmap-i { width: 12px; height: 3px; border-radius: 2px; background: rgba(23,26,29,.14); }
.g7-bmap-i.is-done { background: rgba(23,108,112,.55); }
.g7-bmap-i.is-now { background: ${T.accent}; width: 16px; }
.g7-bmap-num { font-size: 10px; color: ${T.ink3}; margin-left: 3px; letter-spacing: .04em; }

/* ============ ASOS POLZUNOGI ============ */
.g7-range {
  -webkit-appearance: none; appearance: none;
  width: 100%; height: 22px; background: transparent; cursor: pointer; margin: 0;
}
.g7-range::-webkit-slider-runnable-track {
  height: 4px; border-radius: 2px;
  background: linear-gradient(90deg, ${T.graph} 0%, rgba(23,26,29,.16) 50%, ${T.accent} 100%);
}
.g7-range::-moz-range-track {
  height: 4px; border-radius: 2px;
  background: linear-gradient(90deg, ${T.graph} 0%, rgba(23,26,29,.16) 50%, ${T.accent} 100%);
}
.g7-range::-webkit-slider-thumb {
  -webkit-appearance: none; appearance: none;
  width: 20px; height: 20px; border-radius: 50%; margin-top: -8px;
  background: ${T.paper}; box-shadow: 0 0 0 2px ${T.ink}, 0 4px 10px -4px rgba(${T.shadow},.5);
  transition: box-shadow .24s cubic-bezier(.22,.61,.36,1);
}
.g7-range::-moz-range-thumb {
  width: 20px; height: 20px; border: 0; border-radius: 50%;
  background: ${T.paper}; box-shadow: 0 0 0 2px ${T.ink}, 0 4px 10px -4px rgba(${T.shadow},.5);
}
.g7-range:focus-visible::-webkit-slider-thumb { box-shadow: 0 0 0 2px ${T.graph}, 0 0 0 6px rgba(23,108,112,.25); }

/* ============ CHOP ETISH: shpargalka ============ */
.g7-print { display: none; }
@media print {
  .lesson-root { position: static !important; overflow: visible !important; background: #fff !important; }
  .stage-header, .stage-nav, .g7-bgcurves, .g7-notes-wrap { display: none !important; }
  .stage-content { overflow: visible !important; }
  .g7-stack > *:not(.g7-print) { display: none !important; }
  .g7-print { display: block !important; font-family: 'Manrope', sans-serif; color: #000; }
  .g7-print h2 { font-family: 'Fraunces', 'Source Serif 4', Georgia, serif; font-size: 20pt; margin: 0 0 10pt; }
  .g7-print-law {
    font-family: ${MATH_FONT}; font-size: 14pt; font-weight: 700;
    border: 2pt solid #000; border-radius: 6pt; padding: 8pt 10pt; margin: 0 0 10pt;
  }
  .g7-print ol { font-size: 12pt; line-height: 1.6; margin: 0 0 10pt; padding-left: 18pt; }
  .g7-print-life { font-size: 12pt; border-left: 3pt solid #000; padding-left: 8pt; }
  .g7-print-src { font-size: 9pt; color: #444; margin-top: 12pt; }
}

/* ============ QORALAMALAR ============ */
.g7-notes-wrap {
  position: absolute; inset: 0; z-index: 5;
  display: flex; align-items: flex-start; justify-content: flex-end;
  background: rgba(243,239,231,.72);
  backdrop-filter: blur(2px);
  animation: g7-in .3s cubic-bezier(.22,.61,.36,1) both;
}
.g7-notes {
  width: min(420px, 100%);
  height: 100%;
  display: flex; flex-direction: column; gap: 9px;
  padding: clamp(10px, 1.4vw, 16px);
  border-radius: 16px;
  background: ${T.paper};
  box-shadow: 0 18px 40px -18px rgba(${T.shadow},.45), inset 0 0 0 1px ${T.line};
}
.g7-notes-head { display: flex; align-items: center; justify-content: space-between; }
.g7-notes-area {
  flex: 1; min-height: 0; resize: none;
  border-radius: 12px; border: 0;
  box-shadow: inset 0 0 0 1px ${T.line};
  background: rgba(243,239,231,.5);
  padding: 10px 12px;
  font-family: 'Manrope', system-ui, sans-serif;
  font-size: 13.5px; line-height: 1.5; color: ${T.ink};
}
.g7-notes-foot { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.g7-notes-hint { font-size: clamp(10px, .85vw, 11.5px); color: ${T.ink2}; line-height: 1.3; }

/* ============ ANIMATSIYALAR ============
   Faqat matematik jihatdan O'ZGARGAN narsa harakatlanadi.
   Oddiy o'tish 240-420 ms, murakkab qayta qurish 700 ms gacha.
   Prujina FAQAT belgini uyaga qo'yishda.                                   */
/* --g7-rev: joriy ovoz bo'lagining baholangan uzunligi. Ochilish gap bilan
   BIRGA ketadi: uzun gap -> sekin ochilish. useNarratedSteps o'rnatadi. */
.g7-in { opacity: 0; animation: g7-in .52s cubic-bezier(.22,.61,.36,1) forwards; }
.g7-d1 { animation-delay: .12s; }
.g7-d2 { animation-delay: .24s; }
.g7-d3 { animation-delay: .36s; }
.g7-d4 { animation-delay: .48s; }
@keyframes g7-in { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: translateY(0); } }

/* Tushuntirish qadami: OVOZ bilan bir vaqtda, yumshoq va shoshmasdan. */
.g7-reveal { animation: g7-reveal var(--g7-rev, 900ms) cubic-bezier(.22,.61,.36,1) both; }
@keyframes g7-reveal { 0% { opacity: 0; transform: translateY(8px); } 55% { opacity: 1; } 100% { opacity: 1; transform: translateY(0); } }
.g7-r1 { animation-delay: .22s; }
.g7-r2 { animation-delay: .44s; }
.g7-r3 { animation-delay: .66s; }

/* Morf: ikki kartochka bitta keng kartochkaga aylanadi (700 ms chegara) */
.g7-morph { animation: g7-morph .92s cubic-bezier(.22,.61,.36,1) both; }
@keyframes g7-morph {
  0% { opacity: 0; transform: scaleY(.9) translateY(8px); transform-origin: top center; }
  100% { opacity: 1; transform: scaleY(1) translateY(0); }
}

/* Prujina -- FAQAT uyaga qo'yishda */
/* Prujina -- FAQAT uyaga qo'yishda, va yumshoq: 4% dan oshmaydi. */
.g7-snap { animation: g7-snap .5s cubic-bezier(.34,1.32,.5,1) both; }
@keyframes g7-snap { 0% { transform: scale(.88); opacity: 0; } 60% { transform: scale(1.04); opacity: 1; } 100% { transform: scale(1); } }

/* Son yuqoridan tushadi -- matematik natija paydo bo'lganda */
/* Natija paydo bo'lishi: sekinroq va yumshoqroq, sakrashsiz. */
.g7-drop { display: inline-block; animation: g7-drop calc(var(--g7-rev, 900ms) * .8) cubic-bezier(.22,.61,.36,1) both; }
@keyframes g7-drop { 0% { opacity: 0; transform: translateY(-10px); } 100% { opacity: 1; transform: translateY(0); } }

.g7-pop { animation: g7-pop .5s cubic-bezier(.22,.61,.36,1) both; }
@keyframes g7-pop { 0% { opacity: 0; transform: translateY(5px); } 100% { opacity: 1; transform: translateY(0); } }

/* Xato belgi uyadan QAYTADI */
.g7-shakebox { overflow: clip; }
.g7-shake { animation: g7-shake .3s cubic-bezier(.22,.61,.36,1) 2; }
@keyframes g7-shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
/* Bitta yumshoq impuls -- yangi holat e'tiborini tortadi. Cheksiz EMAS. */
.g7-pulse { animation: g7-pulse .62s cubic-bezier(.22,.61,.36,1) 1; }
@keyframes g7-pulse { 0%,100% { opacity: 1; } 50% { opacity: .42; } }
.g7-accent-pulse { animation: g7-accent-pulse 1.1s cubic-bezier(.22,.61,.36,1) 1; }
@keyframes g7-accent-pulse {
  0% { color: ${T.ink}; text-shadow: none; }
  40% { color: ${T.accent}; text-shadow: 0 0 18px rgba(201,84,44,.4); }
  100% { color: ${T.accent}; text-shadow: none; }
}

/* Kirivi chizilishi -- SVG uzunligi bo'yicha */
/* Kirivi GAP davomida chiziladi -- shuning uchun --g7-rev ga bog'langan. */
.g7-draw { animation: g7-draw calc(var(--g7-rev, 900ms) * 1.35) cubic-bezier(.22,.61,.36,1) both; }
@keyframes g7-draw { from { stroke-dashoffset: var(--len, 1200); } to { stroke-dashoffset: 0; } }

.g7-slotframe {
  border: 1px dashed rgba(23,26,29,.26);
  border-radius: 12px;
  background: rgba(255,253,248,.6);
  display: flex; align-items: center; justify-content: center;
  transition: box-shadow .24s cubic-bezier(.22,.61,.36,1), background .24s;
}
.g7-picked { box-shadow: 0 0 0 2px ${T.graph}; background: ${T.graphSoft}; }
.g7-num { color: ${T.accent}; font-weight: 800; }
.g7-dim { opacity: .28; }

/* Tayanch kartochkasidagi misol: formula ustida, izohi ostida. */
.g7-ex { display: flex; flex-direction: column; gap: 1px; }
.g7-ex-why {
  font-family: 'Manrope', system-ui, sans-serif;
  font-size: 11.5px;
  line-height: 1.28;
  color: ${T.ink3};
  letter-spacing: .005em;
}
.g7-ex-why .g7-mono { font-size: 12px; color: ${T.ink2}; font-weight: 600; }

/* Yig'ilgan tayanchlar: bitta satrda nomlari. */
.g7-fold-list { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; min-width: 0; }
.g7-fold-item {
  display: inline-flex; align-items: baseline; gap: 5px;
  font-family: 'Manrope', system-ui, sans-serif;
  font-size: 12px; line-height: 1.25; color: ${T.ink3};
}
/* Nuqta tugmasidagi maqsad yozuvi: nima uchun aynan shu son olinadi. */
.g7-opt-role {
  display: block;
  font-family: 'Manrope', system-ui, sans-serif;
  font-size: 10.5px; font-weight: 600; line-height: 1.2;
  color: ${T.ink3}; letter-spacing: .01em;
  margin-top: 1px;
}
/* Ikki da'vogar javob: xulosa chiqmaguncha ular SAVOL bilan turadi.
   Telefonda ham IKKI ustunda qoladi -- ichi qisqa, sig'adi. */
.g7-claims {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  min-width: 0;
}
.g7-claim {
  display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
  min-height: 0; min-width: 0;
}
.g7-claim-v { font-family: ${MATH_FONT}; font-size: 16px; font-weight: 600; color: ${T.ink}; }
.g7-claim-q { font-family: ${MATH_FONT}; font-size: 16px; font-weight: 700; color: ${T.ink3}; }

.g7-fold-num {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; font-weight: 800; color: ${T.accent};
  letter-spacing: .04em;
}
.g7-ok-text { color: ${T.ok}; font-weight: 800; }
.g7-tip-text { color: ${T.tip}; font-weight: 700; }
.g7-graph-text { color: ${T.graph}; font-weight: 700; }

/* Tetradcha: chapda ingichka chiziq, satrlar ustma-ust */
.g7-note-lines { display: flex; flex-direction: column; gap: 2px; padding-left: 12px; border-left: 2px solid ${T.line}; min-width: 0; }

@media (prefers-reduced-motion: reduce) {
  .lesson-root, .lesson-root *, .lesson-root *::before, .lesson-root *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
  .g7-in, .g7-reveal, .g7-morph, .g7-snap, .g7-drop, .g7-pop,
  .g7-rule-line, .g7-rule-example, .g7-fb { opacity: 1 !important; transform: none !important; }
  .g7-btn-ready, .g7-tool-wave { animation: none !important; }
  .g7-await::after { animation: none !important; opacity: 0 !important; }
  .g7-seg-i.is-now { transform: none; }
}

/* ============================================================
   TELEFON UCHUN OXIRGI TUZATISHLAR.
   Bu blok ataylab STYLES ning ENG OXIRIDA: yuqoridagi asosiy qoidalar
   bir xil aniqlikda bo'lgani uchun, faqat keyin turgani yutadi.
   ============================================================ */
@media (max-width: 859.98px) {
  /* Da'vogar javoblar BITTA ustunda. Ikki ustunda ularning ichi vertikal
     yoyilib, ikkisi 133px olardi -- bir ustunda 46px. */
  .g7-claims { grid-template-columns: minmax(0, 1fr); gap: 5px; }
  .g7-claim { gap: 6px; padding: 6px 9px; row-gap: 1px; }
  .g7-claim-v, .g7-claim-q { font-size: 14px; }
  .g7-claim .g7-hint { font-size: 11.5px; line-height: 1.25; }
  /* Nuqta tanlash sarlavhasi telefonda kerak emas: tugmaning O'ZI
     «Qo'yish: x = 0» deb yozadi. */
  .g7-pickhide { display: none; }
  /* Panel to'ldirishi INLINE pad proplari bilan beriladi -- telefonda
     ularni bosish uchun important kerak. STYLES ichida teskari apostrof
     YOZILMAYDI: u shablon satrni uzib, faylni sindiradi. */
  .g7-panel { padding: 7px 9px !important; }
  /* Qo'yish satri: 100px ustun telefonda hisobni ikki satrga o'rar edi. */
  .g7-tprow {
    grid-template-columns: 60px minmax(0, 1fr) auto !important;
    font-size: 12.5px !important;
    min-height: 26px !important;
    gap: 6px !important;
  }
  .g7-ask { font-size: 13px; line-height: 1.32; }
  .g7-claim .g7-tag { font-size: 9.5px; padding: 2px 5px; }
  .g7-fb { padding: 7px 9px; }

  /* 15-slayd: telefonda takrorlanadigan bloklar olib tashlanadi.
     Layfxak chop etiladigan shpargalkada qoladi, qoralama esa yuqori
     paneldagi asbobda ochiladi -- ma'lumot yo'qolmaydi. */
  .g7-hide-phone { display: none; }
  .g7-s15-notes .g7-notes-area { display: none; }
  .g7-s15-notes .g7-notes-hint { display: none; }
  /* Maydon yashiringach «Saqlash» tugmasining ma'nosi yo'q: qatorda faqat
     shpargalka tugmasi qoladi. Tartib: extra tugma BIRINCHI, saqlash IKKINCHI. */
  .g7-s15-notes .g7-notes-foot .g7-btn + .g7-btn { display: none; }
  /* Halqa telefonda bir pog'ona kichrayadi: SVG o'lchovi atribut bilan
     berilgan, shuning uchun CSS da bosib o'tiladi. */
  .g7-ring svg { width: 68px !important; height: 68px !important; }
  /* Mayda formulalar telefonda bir pog'ona kichrayadi: 15-slaydda to'rt
     qoida satri o'ralib, har biri ikki satr olardi. */
  .g7-expr-sm { font-size: 12px; line-height: 1.26; }
  .g7-ring-label { letter-spacing: .1em; }
  /* Oxirgi 5px: halqa paneli va yakun bloklari orasidagi zaxira. */
  .g7-ring { gap: 2px; }
  .g7-insight { padding: 8px 10px; }
  /* Kichik zaxira: uch tilda ham 601px budjetiga sig'sin. */
  .g7-title { font-size: 18.5px; }
  .g7-options { gap: 5px; }

  /* YUQORI PANEL telefonda 199px ga chiqib ketardi va til almashtirgich
     ekrandan TASHQARIDA qolardi -- ya'ni bosilmaydi. overflow clip
     tufayli skroll ham chiqmaydi, shuning uchun buni ko'z ham, skroll
     tekshiruvi ham ko'rmagan.
     Ikkilamchi belgilar olib tashlanadi: nishon, fan nomi va segmentlar.
     Bo'lim nomi, hisoblagich va ASBOBLAR qoladi. O'ngga tekislanadi --
     chap yuqorida previuning «Darslar ro'yxati» tugmasi turadi. */
  .g7-top { justify-content: flex-end; gap: 8px; }
  .g7-mark, .g7-top-title, .g7-seg { display: none; }
  .g7-top-sect { font-size: 10px; letter-spacing: .1em; }
  .g7-langsw { flex-shrink: 0; }
}

/* ============================================================
   7-SINF ASBOBLARI: sahna, mini-rolik, dinamik namoyishlar.
   11-sinf yadrosida bunday asboblar yo'q edi.
   ============================================================ */

/* Prognoz: tanlangani ajratiladi, lekin BAHOLANMAYDI. */
.g7-opt-neutral { background: ${T.graphSoft}; color: ${T.ink}; box-shadow: 0 8px 22px -6px rgba(23,108,112,.24); }
.g7-fb-neutral { background: ${T.graphSoft}; border-left-color: ${T.graph}; }
.g7-fb-neutral .g7-fb-glyph { background: rgba(23,108,112,.14); color: ${T.graph}; }
.g7-fb-neutral .g7-fb-body { color: ${T.graph}; }

/* Bo'sh uya: nima kutilayotgani ko'rinadi. */
.g7-frame {
  border: 1px dashed ${T.line};
  border-radius: 11px;
  background: rgba(255,253,248,.6);
  display: flex; align-items: center; justify-content: center;
}
.g7-picked { box-shadow: 0 0 0 2px ${T.ink}; }
.g7-num { color: ${T.accent}; font-weight: 800; }
.g7-dim { opacity: .34; }
.g7-ok-text { color: ${T.ok}; font-weight: 800; }

/* Sahna balandligi DERAZAGA moslashadi: past noutbukda kichrayadi. */
.g7-scene {
  position: relative;
  width: min(100%, calc(clamp(84px, calc(100dvh - 530px), 190px) * 620 / 170));
  aspect-ratio: 620 / 170;
  margin-inline: auto;
  flex-shrink: 0;
}
.g7-scene-svg { width: 100%; height: 100%; display: block; }
.g7-move { transition: transform .8s cubic-bezier(.33, 0, .2, 1); }
.g7-crate { transition: opacity .5s ease .3s; }
.g7-crate-lid { transition: transform .55s cubic-bezier(.34, 1.3, .64, 1); }

.g7-clip-cap {
  text-align: center;
  font-size: clamp(12px, 1.5vw, 14px);
  line-height: 1.3;
  color: ${T.ink2};
  animation: g7-in .3s ease-out both;
}
.g7-clip-bar { display: flex; gap: 7px; align-items: center; justify-content: center; flex-shrink: 0; }
.g7-clip-dot {
  width: 9px; height: 9px; padding: 0; border: 0; border-radius: 50%;
  background: rgba(23,26,29,.16); cursor: pointer;
  transition: background .25s, transform .25s;
}
.g7-clip-dot-past { background: ${T.accentSoft}; }
.g7-clip-dot-on { background: ${T.accent}; transform: scale(1.3); }
.g7-clip-replay {
  margin-left: 6px; width: 24px; height: 24px; padding: 0; border: 0; border-radius: 50%;
  background: ${T.paper}; color: ${T.ink2}; cursor: pointer; line-height: 1;
  box-shadow: 0 2px 8px -5px rgba(${T.shadow},.45);
}

/* Ko'paytuvchi yoy bo'ylab har bir qo'shiluvchiga boradi. */
.g7-arc { stroke-dasharray: 120; stroke-dashoffset: 120; animation: g7-draw .42s ease-out forwards; }
@keyframes g7-draw { to { stroke-dashoffset: 0; } }
.g7-arc-tip { opacity: 0; animation: g7-tip .2s ease-out forwards; }
@keyframes g7-tip { to { opacity: 1; } }

/* Ishora ag'darish: eski ketadi, yangi keladi. */
.g7-flip { position: relative; display: inline-grid; font-family: ${MATH_FONT}; font-weight: 700; font-size: clamp(15px, 2vw, 20px); }
.g7-flip-old, .g7-flip-new { grid-area: 1 / 1; }
.g7-flip-old { color: ${T.ink3}; animation: g7-flip-out .3s ease-out forwards; animation-delay: inherit; }
.g7-flip-new { color: ${T.accent}; opacity: 0; animation: g7-flip-in .3s ease-out forwards; animation-delay: inherit; }
@keyframes g7-flip-out { to { opacity: 0; transform: translateY(-7px); } }
@keyframes g7-flip-in { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: translateY(0); } }

/* O'xshash qo'shiluvchilar bittaga qo'shiladi. */
.g7-chip {
  font-family: ${MATH_FONT}; font-weight: 700;
  font-size: clamp(15px, 2vw, 19px);
  padding: 4px 11px; border-radius: 9px;
  background: ${T.paper}; box-shadow: 0 4px 12px -6px rgba(${T.shadow},.2);
}
.g7-chip-ok { background: ${T.okSoft}; color: ${T.ok}; }
.g7-chip-op { font-family: ${MATH_FONT}; font-weight: 700; color: ${T.ink3}; }
.g7-merge-l { animation: g7-mv-r .5s ease-in-out .2s both; }
.g7-merge-r { animation: g7-mv-l .5s ease-in-out .2s both; }
.g7-merge-res { animation: g7-pop .4s cubic-bezier(.34,1.56,.64,1) .65s both; }
@keyframes g7-mv-r { 60% { transform: translateX(9px); } 100% { transform: translateX(0); } }
@keyframes g7-mv-l { 60% { transform: translateX(-9px); } 100% { transform: translateX(0); } }
.g7-flip1 { animation: g7-tilt .34s ease-in-out .15s both; }
.g7-flip2 { animation: g7-tilt .34s ease-in-out .5s both; }
@keyframes g7-tilt { 50% { transform: rotate(-16deg); color: ${T.accent}; } }

@media (prefers-reduced-motion: reduce) {
  .g7-arc { stroke-dashoffset: 0; animation: none; }
  .g7-arc-tip, .g7-flip-new { opacity: 1; animation: none; }
  .g7-flip-old { display: none; }
  .g7-merge-l, .g7-merge-r, .g7-merge-res, .g7-flip1, .g7-flip2 { animation: none; }
  .g7-move, .g7-crate, .g7-crate-lid { transition: none; }
  .g7-clip-cap { animation: none; }
}
`
