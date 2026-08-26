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
  useLayoutEffect,
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
// Palitra metodist tomonidan 2026-08-10 da BERILGAN (texnik topshiriq).
// Rasm, foto, fon surati YO'Q: hamma model va sxema faqat CSS va SVG.
// Ekran turiga qarab fon: xuk #EDF5F1, qoida #FFF1E7, yakun #EDF6EE,
// qolgani -- sut rangli #F4EFE6.
export const T = {
  bg: '#F4EFE6',
  paper: 'rgba(255,255,255,0.82)',
  paperSolid: '#FFFFFF',
  ink: '#182224',
  ink2: '#5C6A6C',
  ink3: '#93A0A2',
  accent: '#E75A2C',          // hozirgi harakat va bosish zonasi
  accentSoft: '#FCE7DD',
  graph: '#126E73',           // matematik bog'lanish va faol element
  graphSoft: '#DDECEC',
  ok: '#287B54',              // to'g'ri javob va yakun
  okSoft: '#E4F1EA',
  tip: '#A55D19',
  tipSoft: '#FBEDD9',
  dark: '#1B2628',
  line: 'rgba(24, 34, 36, 0.12)',
  grid: 'rgba(24, 34, 36, 0.025)',
  shadow: '24,34,36',
  // BOSQICH RANGLARI (metodist qarori 2026-08-13). Palitradagi qolgan
  // ranglar MA'NOGA band: accent -- «matematik o'zgardi», ok -- «to'g'ri»,
  // tip -- «noto'g'ri», graph -- «baholanmaydi». Bosqichni ular bilan
  // bo'yash mumkin emas: o'quvchi buni «to'g'ri va xato» deb o'qiydi.
  // Shuning uchun ikkita YANGI rang kiritildi, ular FAQAT bosqichni
  // bildiradi va boshqa hech qayerda ishlatilmaydi. 3-sinfdagi naqsh:
  // rang ikki usulni bir-biriga BOG'LAYDI (razryadlar rangi, Dars01 s4).
  stage2: '#2C5FA8',      // II bosqich: ko'paytirish va bo'lish
  stage2Soft: '#DEE8F6',
  stage1: '#7A4FA3',      // I bosqich: qo'shish va ayirish
  stage1Soft: '#EBE1F4',
  // Ekran fonlari
  fieldHook: '#EDF5F1',
  fieldRule: '#FFF1E7',
  fieldSum: '#EDF6EE',
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
// Formula shrifti: metodist 2026-08-10 da JetBrains Mono ni tanladi
// (avvalgi «variant a» -- serif kursiv -- bekor qilindi).
export const MATH_FONT = "'JetBrains Mono', 'SFMono-Regular', Consolas, monospace"

export const UI_TXT = {
  hint: L('Maslahat', 'Подсказка', 'Hint'),
  hack: L('Layfxak', 'Лайфхак', 'Lifehack'),
  question: L('Savol', 'Вопрос', 'Question'),
  zoneCheck: L('Tekshiruv', 'Проверка', 'Check'),
  zoneTask: L('Topshiriq', 'Задание', 'Task'),
  zoneGiven: L('Berilgan', 'Дано', 'Given'),

  right: L("To'g'ri", 'Верно', 'Correct'),

  // NAVIGATSIYA. Ilgari har dars faylida qaytarilardi (`const UI = {...}`).
  next: L('Davom etish', 'Продолжить', 'Continue'),
  back: L('Orqaga', 'Назад', 'Back'),
  finish: L('Darsni yakunlash', 'Завершить урок', 'Finish the lesson'),
  saved: L('Natija saqlandi', 'Результат сохранён', 'Result saved'),
  yourGuess: L('Taxminingiz', 'Твоя догадка', 'Your guess'),
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

// KLAVISHA TOVUSHI. Dars kalkulyatorlar bilan boshlanadi, shuning uchun
// yozuv ustidagi har bosish kalkulyator klavishasidek eshitiladi: qisqa,
// quruq, past. Bu «to'g'ri-noto'g'ri» signali EMAS -- u hech nima baholamaydi,
// faqat harakat sodir bo'lganini bildiradi (metodist taklifi 2026-08-14).
function keyTick() {
  if (typeof window === 'undefined') return
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return
  if (!chimeCtx) chimeCtx = new AC()
  if (chimeCtx.state === 'suspended') { try { chimeCtx.resume() } catch { /* avtoplay cheklovi */ } }
  const now = chimeCtx.currentTime
  const o = chimeCtx.createOscillator()
  const g = chimeCtx.createGain()
  o.type = 'square'
  o.frequency.setValueAtTime(1420, now)
  o.frequency.exponentialRampToValueAtTime(620, now + 0.032)
  // Balandligi past: u fonda turadi, ovoz ustidan bosmaydi.
  g.gain.setValueAtTime(0.0001, now)
  g.gain.exponentialRampToValueAtTime(0.045, now + 0.004)
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.055)
  o.connect(g)
  g.connect(chimeCtx.destination)
  o.start(now)
  o.stop(now + 0.06)
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
  const playTap = useCallback(() => { if (!mutedGlobal) keyTick() }, [])
  return { playCorrect: () => play(true), playWrong: () => play(false), playTap }
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
// Mezon "raqam bormi" O'ZI yetarli emas. "Bitta harf ishlatgani: ikkinchi
// kattalik 40 ayirish x" yorlig'ida bitta 40 bor, va shu bitta son butun
// GAPNI monoshriftga olib ketardi (metodist, 2026-08-22). Shuning uchun
// ikkinchi mezon: matnda IKKI yoki undan ortiq SO'Z bo'lsa -- bu proza.
// Funksiya nomlari so'z hisoblanmaydi, aks holda "log(x) < 1" ham proza
// bo'lib qolardi.
const FUNC_WORDS = new Set(['log', 'ln', 'lg', 'sin', 'cos', 'tg', 'ctg'])
const WORDS_RE = /[A-Za-z\u0400-\u04ff']{2,}/g
export const looksMath = (v) => {
  if (typeof v !== 'string' || !MATHY_RE.test(v)) return false
  const words = (v.match(WORDS_RE) || []).filter((w) => !FUNC_WORDS.has(w.toLowerCase()))
  return words.length < 2
}

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

// BOSQICH RANGI YOZUVNING O'ZIDA. Ilgari rang faqat ikkita asbobda bor edi
// (StepOrder belgilarida va kadrlarda), qolgan yozuvlar qora turardi -- ya'ni
// rang har ekranda paydo bo'lib, yo'qolib turardi va TIL bo'lolmasdi.
// Endi u yozuv chizilgan HAMMA joyda bir xil: ko'paytirish va bo'lish --
// ikkinchi bosqich rangi, qo'shish va ayirish -- birinchisi, qavs esa
// bog'lanish rangida. Rang -- yadroning ODATIY xatti-harakati, sozlama emas.
const STAGE_CLS = {
  '·': 'g7-op2', ':': 'g7-op2', '×': 'g7-op2', '÷': 'g7-op2',
  '+': 'g7-op1', '−': 'g7-op1',
  '(': 'g7-par', ')': 'g7-par',
}

export function Fx({ children, stage }) {
  if (typeof children !== 'string' || !children) return children === undefined ? null : children
  children = mathMinus(children)
  const on = stage !== false
  const out = []
  let buf = ''
  let mode = null
  const flush = () => {
    if (!buf) return
    if (mode === 'sub') out.push(<sub key={out.length} className="g7-idx">{buf}</sub>)
    else if (mode === 'sup') out.push(<sup key={out.length} className="g7-idx">{buf}</sup>)
    else if (mode === 'num') out.push(<span key={out.length} className="g7-fxnum">{buf}</span>)
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
    if (on && STAGE_CLS[ch]) {
      flush()
      out.push(<span key={out.length} className={STAGE_CLS[ch]}>{ch}</span>)
      continue
    }
    // MODUL CHIZIG'I. Yonidagi harfga yopishib qolsa, u bosh «I» harfiga
    // o'xshab ketadi: |x − 3| yozuvi «Ix − 3I» bo'lib o'qilardi (surat
    // 2026-08-17). Shuning uchun chiziq atrofida ozgina joy bo'shatiladi.
    if (ch === '|') {
      flush()
      out.push(<span key={out.length} className="g7-fxbar">{ch}</span>)
      continue
    }
    if (on && ch >= '0' && ch <= '9') {
      // Son -- matematik shriftda. Ketma-ket raqamlar bitta bo'lakka
      // yig'iladi, aks holda har raqam alohida span bo'lib, oraliqlar
      // buzilardi.
      if (mode !== 'num') { flush(); mode = 'num' }
      buf += ch
      continue
    }
    if (mode === 'num') { flush(); mode = null }
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

// CallToAct -- «bu yerda harakat kerak» belgisi. Texnik topshiriq 2026-08-10:
// har interaktiv ekranda KO'RINIB turishi kerak, qayerga bosish kerakligi.
// Uch shakl: tanlash, bosish, kiritish. To'q sariq -- hozirgi harakat rangi.
// Javob berilgach BELGI YO'QOLADI: keraksiz diqqat tortmasin.
export const ACT = {
  pick: L('Tanlang', 'Выберите', 'Choose'),
  tap: L('Bosing', 'Нажмите', 'Tap'),
  type: L('Kiriting', 'Введите', 'Type'),
}
export const CallToAct = () => null

// ============================================================
// Ask -- TOPSHIRIQ E'LONI. `CallToAct` qayerga bosishni ko'rsatadi, `Ask`
// esa NIMA so'ralayotganini AYTADI. Ikkalasi bir-birini almashtirmaydi:
// «Tanlang» degan yozuv o'quvchiga nimani tanlashini aytmaydi.
//
// Metodist 2026-08-14: 2, 3, 7, 12 va 14-ekranlarda o'quvchi undan nima
// talab qilinayotganini tushunmagan. Sarlavha MAVZUNI ataydi, topshiriqni
// esa faqat ovoz aytardi -- ovoz o'chiq bo'lsa hech narsa qolmasdi.
//
// Shakl BITTA bo'lishi uchun bu yerda turibdi: ilgari o'sha razmetka
// `SlotFill` va `BracketGap` ichida ikki marta ko'chirilgan edi.
//   kind='task'     -> TOPSHIRIQ    kind='question' -> SAVOL
//   tight           -> kartochkasiz, yorliq va gap BITTA satrda. Balandlik
//                      budjeti tor ekranlar uchun: kartochka ~58px yeydi,
//                      tor shakl ~26px.
// ============================================================
// `cap` -- yorliqni O'ZI berish. Ikki bosqichli ekranda («xato qatorni top»,
// so'ng «hisoblab isbotla») yorliq bosqich NOMERINI aytadi -- o'quvchi
// qayerda turganini ko'rib turadi (metodist 2026-08-14).
export const Ask = ({ children, kind = 'question', tight, cap: capOwn }) => {
  const lang = useContext(LangContext)
  if (!children) return null
  // SAVOL yorlig'i CHIZILMAYDI (metodist qarori 2026-08-14): savol
  // belgisi o'zi savol ekanini aytadi, yorliq esa faqat joy egallardi.
  // TOPSHIRIQ qoladi -- u savol emas, HARAKATNI ataydi.
  const cap = capOwn || (kind === 'task' ? tr(UI_TXT.zoneTask, lang) : null)
  if (tight) {
    return (
      <p className="g7-ask g7-ask-row">
        {cap ? <span className="g7-zone-cap">{cap}</span> : null}
        <span><Fx>{children}</Fx></span>
      </p>
    )
  }
  return (
    <div className="g7-zone g7-ask-card">
      {cap ? <span className="g7-zone-cap">{cap}</span> : null}
      <p className="g7-qpill"><Fx>{children}</Fx></p>
    </div>
  )
}

// ============================================================
// TapMark -- BOSISH STIKERI. Metodist qarori 2026-08-14: QO'L CHIZILMAYDI,
// tayyor belgi olinadi. Shuning uchun bu yerda emoji turibdi, o'zimiz
// chizgan shakl emas: u tanish ko'rinadi va «bu nimaga o'xshaydi» degan
// savol tug'dirmaydi (chizilgan qo'lning birinchi varianti aynan shu
// sababdan rad etilgan edi).
//
// Ostida tegish to'lqini: barmoq bosgan joydan halqa tarqaladi.
//
// DIQQAT: belgi VAQT bo'yicha YO'QOLMAYDI. Avvalgi variant yettinchi
// soniyada so'nardi va metodist ekranni ochganda hech nima ko'rmasdi.
// Endi HARAKAT to'xtaydi (besh urish -- pulsatsiya cheksiz emas), belgining
// O'ZI esa o'quvchi bosmaguncha turaveradi.
// ============================================================
export const TapMark = () => (
  <span className="g7-tapmark" aria-hidden="true">
    <span className="g7-tapmark-ring" />
    <span className="g7-tapmark-emoji">👆</span>
  </span>
)

// ============================================================
// HackNote -- LAYFXAK va BONUS. Metodist qarori 2026-08-14: ikkalasi ham
// TO'G'RI JAVOB IZOHI bilan bir xil shaklda bo'ladi -- chapda rangli
// polosa, tepada CAPS yorliq belgisi bilan, ostida gap. Rang o'zgarmaydi:
// u sariq qoladi va shu bilan izohdan farq qiladi.
//
// Chiqish vaqti: FAQAT o'quvchi ishni bajargandan keyin. Avval ish, keyin
// usul haqidagi gap -- aks holda layfxak javobni oldindan aytib qo'yadi.
//
// `tone='ok'` -- ISH BAJARILGANIDAGI javob (9 va 10-ekran): ular hech nima
// bilan tugamasdi va o'quvchi «bo'ldimi» deb turardi.
// ============================================================
export const HackNote = ({ title, children, bottom, tone }) => {
  const lang = useContext(LangContext)
  if (!children) return null
  const ok = tone === 'ok'
  return (
    <div className={'g7-fb ' + (ok ? 'g7-fb-ok' : 'g7-fb-hack') + ' g7-fb-on' + (bottom ? ' g7-fb-bottom' : '')}>
      <span className="g7-fb-cap">
        {ok ? (
          <span aria-hidden="true">{'✓'}</span>
        ) : (
          <b className="g7-fb-star" aria-hidden="true">{'★'}</b>
        )}
        {title || tr(ok ? UI_TXT.right : UI_TXT.hack, lang)}
      </span>
      <span className="g7-fb-body">{children}</span>
    </div>
  )
}

// ============================================================
// DARS OBVYAZKASI: BITTA JOYDA. `LessonFrame` va `createLesson`.
//
// NEGA. Har darsda `Frame` (40 satr) va ildiz komponent (78 satr) bir xil
// yozilgan edi -- 15 faylda 140 satrdan. Bu CLAUDE.md §5 ning buzilishi:
// umumiy kod ko'chirilmaydi, umumiy modulga chiqariladi. Amaliy narxi ham
// bor: bitta nuqsonni 15 joyda tuzatishga to'g'ri kelardi, va bu loyihada
// allaqachon bo'lgan.
//
// NIMA QOLADI DARSDA. Faqat MA'LUMOT: ekranlar mazmuni, misollar, razborlar,
// ovoz. Ya'ni metodik ish. Obvyazka esa bu yerda.
//
// Metodist savoli (2026-08-20): «bitta skelet olib faqat matnni almashtirsa
// bo'ladimi». Javob: OBVYAZKA -- ha, shu modul aynan shuning uchun. Lekin
// xuk, farqlash, tuzoq va chegaraviy holat -- matn emas, MATEMATIKA: ular
// har darsda qaytadan topiladi.
// ============================================================
const LessonMetaContext = createContext({ block: null, total: 15 })

// SAVOLLAR ZANJIRIDA SARLAVHA O'RNIDA HISOB. Ilgari u yerda «To'rt savol»
// yoki «Uchta savol» turardi -- ya'ni sarlavha savollarni SANARDI, lekin
// o'quvchi qayerda turganini aytmasdi (QA 2026-08-26). Endi o'sha joyda
// «2 / 4» turadi: nechanchi savol va nechtadan. Zanjirda bitta savol
// bo'lsa, darsning o'z sarlavhasi qoladi.
export const qMeta = (S, at) => {
  const total = (S.items || []).length
  if (total < 2) return S
  return { ...S, title: Math.min(at + 1, total) + ' / ' + total }
}

export function LessonFrame({ meta, screen, audio, solved, onPrev, onNext, onFinish, finished, children }) {
  const t = useT()
  const { block, total } = useContext(LessonMetaContext)
  const canNext = useAdvanceGate(solved, audio)
  const last = screen === total - 1
  const nav = {
    back: meta.noBack ? null : (
      <Btn tone="ghost" onClick={onPrev} disabled={screen === 0}>{t(UI_TXT.back)}</Btn>
    ),
    next: last ? (
      <Btn tone="accent" onClick={onFinish} disabled={finished}>
        {t(finished ? UI_TXT.saved : UI_TXT.finish)}
      </Btn>
    ) : (
      <Btn onClick={onNext} disabled={!canNext} ready={canNext}>{t(UI_TXT.next)}</Btn>
    ),
  }
  return (
    <Stage
      eyebrow={t(meta.eyebrow)}
      block={block ? { ...block, label: t(block.label) } : undefined}
      screen={screen}
      total={total}
      audio={audio}
      nav={nav}
      field={meta.field}
      noNotes={meta.noNotes}
    >
      {meta.method ? <Tag tone="accent">{t(meta.method)}</Tag> : null}
      {meta.ownTitle ? null : <Title>{t(meta.title)}</Title>}
      {children}
      {meta.reward && solved ? (
        <HackNote tone="ok" bottom title={t(meta.reward.title)}>{t(meta.reward.text)}</HackNote>
      ) : null}
      {meta.hack && solved ? <HackNote bottom>{t(meta.hack)}</HackNote> : null}
      {meta.bonus && solved ? (
        <HackNote bottom title={t(meta.bonus.title)}>{t(meta.bonus.text)}</HackNote>
      ) : null}
    </Stage>
  )
}

// `tags` -- darsning teg lug'ati: yakun ekrani kamchilik satrini shundan
// yig'adi. Faqat lug'atda BOR teglar hisobga olinadi, ya'ni tasodifiy satr
// yakunga chiqib ketmaydi.
export const collectLessonTags = (answers, dict) => {
  const out = []
  ;(answers || []).forEach((a) => {
    ;((a && a.tags) || []).forEach((tag) => {
      if (dict[tag] && out.indexOf(tag) === -1) out.push(tag)
    })
  })
  return out
}

export const levelFromFirstTry = (firstTry, total) => {
  if (firstTry === null || firstTry === undefined) return 'none'
  if (firstTry >= total) return 'closed'
  if (firstTry === total - 1) return 'one'
  return 'back'
}

export function createLesson({ id, title, no, block, screens, tags, ruleScreen = 7 }) {
  const total = screens.length
  return function Lesson({ studentName, lang: langProp, ttsApiBase, voiceGender, aiGradingEndpoint, onFinished }) {
    const initial = langProp === 'uz' || langProp === 'ru' || langProp === 'en' ? langProp : 'uz'
    const [lang, setLang] = useState(initial)
    useEffect(() => {
      if (langProp === 'uz' || langProp === 'ru' || langProp === 'en') setLang(langProp)
    }, [langProp])
    configureLesson({
      ttsApiBase: ttsApiBase || '',
      aiGradingEndpoint: aiGradingEndpoint || '',
      studentName: studentName || '',
      voiceGender: voiceGender || 'm',
      lessonId: id,
      lessonNo: no,
      freeNav: true,
    })
    useMobileZoom()

    const [screen, setScreen] = useState(0)
    const [answers, setAnswers] = useState([])
    const [finished, setFinished] = useState(false)
    const startedAt = useRef(Date.now())

    const onAnswer = useCallback((payload) => { setAnswers((prev) => prev.concat(payload)) }, [])
    const next = useCallback(() => setScreen((s) => Math.min(s + 1, total - 1)), [])
    const prev = useCallback(() => setScreen((s) => Math.max(s - 1, 0)), [])

    const finish = useCallback(() => {
      setFinished(true)
      const blitz = answers.find((a) => a && a.role === 'blitz')
      const qTotal = blitz ? blitz.total : 0
      const firstTry = blitz ? blitz.firstTry : 0
      const payload = {
        lessonId: id,
        lessonTitle: tr(title, lang),
        lang,
        completed: true,
        durationSec: Math.floor((Date.now() - startedAt.current) / 1000),
        totalQuestions: qTotal,
        correctAnswers: firstTry,
        firstTryStats: { total: qTotal, firstTryCorrect: firstTry },
        level: blitz ? blitz.level : 'none',
        tags: collectLessonTags(answers, tags),
        freeNav: getFreeNav(),
        answers,
      }
      if (onFinished) onFinished(payload)
      else console.log('[' + id + '] onFinished', payload)
    }, [answers, lang, onFinished])

    const Current = screens[screen]
    const meta = useMemo(() => ({ block, total }), [])

    return (
      <LangProvider value={lang}>
        <LangSetProvider value={setLang}>
          <LessonMetaContext.Provider value={meta}>
            <style>{STYLES}</style>
            <div className={'lesson-root' + (screen === ruleScreen ? ' is-rule' : '')} lang={lang}>
              <Current
                screen={screen}
                lang={lang}
                answers={answers}
                onAnswer={onAnswer}
                onNext={next}
                onPrev={prev}
                onFinish={finish}
                finished={finished}
              />
            </div>
          </LessonMetaContext.Provider>
        </LangSetProvider>
      </LangProvider>
    )
  }
}

export const Eyebrow = ({ children, right }) => (
  <div className="g7-eyebrow">
    <span>{children}</span>
    {right ? <span className="g7-eyebrow-right">{right}</span> : null}
  </div>
)

export const Title = ({ children }) => <h1 className="g7-title">{children}</h1>

// `plain` -- bu yozuv EMAS, PROZA (so'z bilan berilgan savol): unda bosqich
// rangi ishlamaydi, gapdagi tire minus emas.
// `tail` -- yozuvning O'NGIGA qo'shiladigan tayyor tugun (masalan, javob
// soni): matn Fx dan o'tadi, tail esa o'zgarmaydi.
export const Expr = ({ children, size = 'mid', tone, pop, style, className, plain, tail }) => (
  <div
    className={'g7-expr g7-expr-' + size + (pop ? ' g7-pop' : '') + (className ? ' ' + className : '')}
    style={{ ...(tone ? { color: tone } : null), ...style }}
  >
    <Fx stage={plain ? false : undefined}>{children}</Fx>
    {tail}
  </div>
)

// ============================================================
// FitRow -- YOZUV QATORGA SIG'ADI, KO'CHIRILMAYDI.
//
// Uzun yozuv bilan ikki xato bo'lardi, ikkalasini ham QA topdi (2026-08-22):
//   1) SlotFill panelida yozuv so'z chegarasida KO'CHIRILARDI, va ko'chirish
//      joyi ma'nosiz chiqardi -- "= 5x ayirish" birinchi qatorda, "4y" esa
//      ikkinchisida yolg'iz qolardi. O'quvchi uchun bu bitta yozuv emas,
//      uchta parcha bo'lib ko'rinadi.
//   2) SubstituteRows qatorida ustunlar ULUSH bilan berilgandi (1fr) va
//      qator eni 620 px bilan qotirilgandi. Yozuv 558 px, katak esa 250 px:
//      `nowrap` tufayli u ko'chmasdan, QO'SHNI kataklar USTIGA chizilardi --
//      strelka bilan tenglik belgisi yozuv ostida ko'rinmay ketardi.
//
// Yechim ikkalasiga bitta: yozuv AVVAL bir qatorda sig'diriladi -- butun
// qator bir xil koeffitsiyent bilan kichrayadi. Kichraytirish o'lchovdan
// chiqadi, taxmindan emas, shuning uchun uchinchi til yoki uzunroq misol
// qo'shilganda ham o'zi moslashadi.
//
// AMMO KICHRAYTIRISH HAMMA JOYDA YETMAYDI. 19-darsning 7-ekranida qator
// shunday uzunki, sig'dirish uchun uni 0,34 ga kichraytirish kerak bo'lardi
// -- 30 px shrift 10 px ga tushardi, ya'ni o'qib bo'lmasdi. Shuning uchun
// pol bor: pastida yozuv KO'CHIRILADI, lekin shu paytda ham u pol
// koeffitsiyentida turadi, ya'ni ko'chirish uch qator emas, ikki qator
// beradi. Tartib shunday: sig'dirish, keyin pol, keyin ko'chirish.
//
// O'LCHOV ETALON HOLATDA olinadi: shrift 1em, ko'chirish o'chirilgan.
// Joriy holatda o'lchash beqaror edi -- ko'chirilgan yozuv doim sig'ib
// turadi, va o'lchov "joy bor" deb yolg'on aytardi, koeffitsiyent esa
// ko'tarilib, yozuv yana ko'chirilardi va hokazo.
//
// TELEFON (640 dan tor) BUNDAN MUSTASNO: u yerda shrift kichraytirilmaydi,
// ko'chirish qoladi. Sahifaning o'zi 390 px ga moslanadi (`--g7z`), va
// yozuvni yana kichraytirish o'qishni butunlay buzardi.
// ============================================================
const FIT_NARROW = 640
export function FitRow({ children, min = 0.62, className, style }) {
  const host = useRef(null)
  const inner = useRef(null)
  const stRef = useRef({ k: 1, wrap: false })
  const [st, setSt] = useState({ k: 1, wrap: false })
  const runRef = useRef(null)
  runRef.current = () => {
    const h = host.current
    const i = inner.current
    if (!h || !i) return
    const avail = h.clientWidth
    if (avail <= 0) return
    if (typeof window !== 'undefined' && window.innerWidth <= FIT_NARROW) {
      if (stRef.current.k !== 1 || !stRef.current.wrap) {
        stRef.current = { k: 1, wrap: true }
        setSt(stRef.current)
      }
      return
    }
    // ETALON O'LCHOV: shrift 1em va KO'CHIRISHSIZ holat. Buning uchun
    // `is-wrap` sinfi vaqtincha OLINADI va o'sha effekt ichida qaytariladi
    // -- ekranga chiqmaydi.
    //
    // NEGA AYNAN SHUNDAY. Avval o'lchov JORIY holatda olingandi, va bu
    // cheksiz sikl berardi: ko'chirilgan yozuv doim sig'ib turadi, o'lchov
    // "joy bor" deb aytardi, koeffitsiyent ko'tarilardi, ko'chirish
    // o'chardi, yozuv yana sig'masdi -- va hokazo, React "Maximum update
    // depth" bilan yiqilardi.
    const hadWrap = i.classList.contains('is-wrap')
    const prevFs = i.style.fontSize
    if (hadWrap) i.classList.remove('is-wrap')
    i.style.fontSize = ''
    const natural = i.getBoundingClientRect().width
    i.style.fontSize = prevFs
    if (hadWrap) i.classList.add('is-wrap')
    if (natural <= 0) return
    // Zahira: yumaloqlash va piksel bilan berilgan chekkalar tufayli
    // aniq 1.0 da yozuv bir-ikki piksel oshib ketishi mumkin.
    const ratio = (avail / natural) * 0.995
    const wrap = ratio < min
    const k = wrap ? min : Math.min(1, ratio)
    if (Math.abs(k - stRef.current.k) > 0.006 || wrap !== stRef.current.wrap) {
      stRef.current = { k, wrap }
      setSt(stRef.current)
    }
  }
  // Har chizilishdan keyin o'lchanadi: til almashdi, katak to'ldi, qator
  // ochildi -- hammasi yozuvning enini o'zgartiradi.
  useLayoutEffect(() => { runRef.current() })
  useEffect(() => {
    if (typeof ResizeObserver === 'undefined' || !host.current) return undefined
    let raf = 0
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => runRef.current())
    })
    ro.observe(host.current)
    return () => { ro.disconnect(); cancelAnimationFrame(raf) }
  }, [])
  return (
    <div ref={host} className={'g7-fitrow' + (className ? ' ' + className : '')} style={style}>
      <div
        ref={inner}
        className={'g7-fitrow-in' + (st.wrap ? ' is-wrap' : '')}
        style={st.k < 1 ? { fontSize: st.k.toFixed(3) + 'em' } : undefined}
      >
        {children}
      </div>
    </div>
  )
}

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

// FaktCard -- «Bilasizmi?» kartochkasi. 3-sinf naqshi (s14 final panelidan
// keyin), lekin katta yoshga: maskot yo'q, fakt MATEMATIK bo'ladi va darsni
// o'quvchi allaqachon biladigan narsa bilan bog'laydi.
export const FactCard = ({ badge, children }) => (
  <div className="g7-fact">
    <span className="g7-fact-badge">
      <i className="g7-fact-dot" />
      {badge}
    </span>
    <span className="g7-fact-text">{children}</span>
  </div>
)

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

// `mark` -- tekshiruv skriptlari uchun BELGI (`data-check` kabi). Skript
// tugmani MATNI bo'yicha izlashi mumkin emas: matn uch tilda boshqacha, va
// aynan shuning uchun `grade7-noscroll.mjs` walkeri «Tekshirish» tugmasini
// bosmasdan, variantlarni aylantirib yurgan. Natijada YECHILGAN holat
// hech qachon o'lchanmagan (11-dars, 6-ekran: 101 px oshib ketgan).
export const Btn = ({ children, onClick, disabled, tone = 'solid', ready, style, title, mark }) => (
  <button
    type="button"
    className={'g7-btn g7-btn-' + tone + (ready && !disabled ? ' g7-btn-ready' : '')}
    onClick={onClick}
    disabled={disabled}
    {...(mark ? { [`data-${mark}`]: '1' } : null)}
    style={style}
    title={title}
  >
    {children}
  </button>
)

const BADGES = ['A', 'B', 'C', 'D', 'E', 'F']

// Variantlar. To'g'risi YASHIL faqat tasdiqdan keyin, xatosi AMBER (qizil emas).
// Javobdan keyin qolganlari yig'ilib ketadi -- joy razbor uchun bo'shaydi.
// Ustunlar SONI variantlar soniga qarab: uchta bo'lsa BITTA qatorda, to'rtta
// bo'lsa 2x2 (metodist qarori 2026-08-13). Ilgari uchta variant 2 va 1 bo'lib
// buzilib turardi -- oxirgisi yolg'iz qolardi va «boshqacha» ko'rinardi.
// ============================================================================
// VARIANTLAR ARALASHADI (§8.3).
//
// QA topgan nuqson 2026-08-22: to'g'ri javob HAR DOIM birinchi turardi --
// 650 savolning 650 tasida, blits ham shu bilan yig'ilardi. Ya'ni bola
// matematikani bilmasdan, «chapdagi birinchisini bosaman» degan qoida bilan
// butun kursdan o'tib ketardi.
//
// ARALASHTIRISH ID LAR BO'YICHA ESLAB QOLINADI, massiv bo'yicha emas: ba'zi
// asboblar har render da yangi massiv yasaydi (`items.map(...)` to'g'ridan-
// to'g'ri JSX ichida), va massiv o'ziga bog'lansa variantlar bola ko'z
// oldida SAKRAB turardi. ID lar o'zgarmaguncha tartib qotib turadi, savol
// almashganda esa yangidan aralashadi.
// ============================================================================
// KALIT ID LAR BO'YICHA EMAS, MAZMUN BO'YICHA. Birinchi urinishda kalit
// faqat ID lardan yig'ilgan edi, va zanjirdagi hamma savolda ID lar bir
// xil: a, b, c, d. Natijada `useMemo` ikkinchi savolga BIRINCHISINING
// variantlarini qaytardi -- brauzerda tekshirilib topildi (2026-08-22).
// Endi kalit yorliq matnini ham oladi, ya'ni savol o'zgarsa kalit o'zgaradi.
function sigOf(items) {
  return (items || []).map((x) => {
    const l = x && x.label
    let s = ''
    if (typeof l === 'string' || typeof l === 'number') s = String(l)
    else if (l && typeof l === 'object') s = String(l.uz || l.ru || l.en || '')
    return ((x && x.id) || '') + ':' + s
  }).join('|')
}

function hash32(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// TARTIB MAZMUNDAN HISOBLANADI, tasodifiy holat saqlanmaydi. Shuning uchun
// bir xil savol bir xil tartib beradi -- ya'ni «eskirgan ro'yxat» xatosi
// TAKRORLANISHI MUMKIN EMAS. Sahifa har ochilganda SALT yangilanadi, demak
// yangi kirishda tartib boshqacha bo'ladi.
const SALT = Math.floor(Math.random() * 1e9)

// ARALASHTIRISH KUCHLI ARALASHTIRGICHDA. Ilgari bu yerda oddiy chiziqli
// generator turardi va tartib uning ENG PAST bitlaridan olinardi (`st % 4`).
// Bunday generatorning past bitlari deyarli tasodifiy emas: birinchi va
// oxirgi almashtirish bir xil bitga tayanib qolardi. Natijada bitta sahifa
// ochilishida deyarli HAMMA savolda to'g'ri javob bir xil joyga tushardi --
// o'lchov: A ulushi ochilishga qarab 0 dan 72 foizgacha sakrardi, ya'ni
// aralashtirish bor ko'rinib, aslida ishlamasdi (QA 2026-08-25: «javobi
// ko'pchiligida A»).
//
// Endi splitmix32: har qadam butun songa ko'chki beradi va tartib YUQORI
// bitlardan olinadi. O'lchov: 25/25/25/25, bitta ochilishda A ulushi 19 dan
// 31 foizgacha -- oddiy tasodifiy tebranish.
function mix32(x) {
  let h = (x ^ (x >>> 16)) >>> 0
  h = Math.imul(h, 2246822507) >>> 0
  h = (h ^ (h >>> 13)) >>> 0
  h = Math.imul(h, 3266489909) >>> 0
  return (h ^ (h >>> 16)) >>> 0
}

function shuffleSeeded(list, seed) {
  const out = list.slice()
  let st = (seed ^ SALT) >>> 0
  for (let i = out.length - 1; i > 0; i -= 1) {
    st = (st + 0x9e3779b9) >>> 0
    const j = Math.floor((mix32(st) / 4294967296) * (i + 1))
    const tmp = out[i]
    out[i] = out[j]
    out[j] = tmp
  }
  return out
}

// TO'G'RI JAVOB JOYI TASODIFGA TASHLAB QO'YILMAYDI.
//
// Aralashtirishning o'zi yetarli emas: tasodif bir darsda ham to'planib
// qoladi. O'lchov (465 ta to'rt variantli savol, 400 marta ochilish): sof
// aralashtirishda har o'ninchi darsda to'g'ri javobning 43 foizdan ko'pi
// bitta joyga tushadi, har yuzinchisida 63 foizi. Bola darsni BIR MARTA
// o'tadi -- unga «o'rtacha yaxshi» emas, O'SHA o'tishi to'g'ri bo'lishi
// kerak.
//
// Shuning uchun joy XALTADAN olinadi: to'rtta joy aralashtiriladi va
// birma-bir tarqatiladi, xalta bo'shagach yangisi aralashtiriladi. Ketma-ket
// to'rtta savolda har joy AYNAN bir marta uchraydi, lekin tartib har
// xaltada boshqacha -- ya'ni «A, B, C, D, A, B, C, D» degan ko'rinadigan
// aylanish ham yo'q.
//
// Savolning joyi uning MAZMUNIGA bog'lab qo'yiladi (kalit -- o'sha imzo),
// shuning uchun qayta chizishda joy sakramaydi.
//
// Darsning ma'lumotida to'g'ri javob DOIM birinchi turadi (465 ta savolning
// 465 tasida) -- xaltadagi joyga o'sha birinchi band qo'yiladi, qolganlari
// bo'sh joylarga mazmun bo'yicha tarqaladi.
const SLOTS = new Map()
let slotBag = []
let bagStep = 0

function slotFor(sig, n) {
  const key = n + '#' + sig
  const hit = SLOTS.get(key)
  if (hit !== undefined) return hit
  if (!slotBag.length) {
    slotBag = []
    for (let i = 0; i < n; i += 1) slotBag.push(i)
    for (let i = slotBag.length - 1; i > 0; i -= 1) {
      bagStep = (bagStep + 0x9e3779b9) >>> 0
      const j = Math.floor((mix32((bagStep ^ SALT) >>> 0) / 4294967296) * (i + 1))
      const tmp = slotBag[i]
      slotBag[i] = slotBag[j]
      slotBag[j] = tmp
    }
  }
  const slot = slotBag.pop()
  SLOTS.set(key, slot)
  return slot
}

// `balanced` -- XALTADAN joy oladigan ro'yxat FAQAT javob variantlari.
// Boshqa ro'yxatlar (bo'laklar banki, kartochkalar) ham aralashadi, lekin
// xaltaga TEGMAYDI: aks holda ular navbatni yeb qo'yardi va variantlarning
// tekis taqsimoti buzilardi (o'lchov: 9/7/5/2 -- 6/6/6/5 o'rniga).
export function useShuffled(items, balanced) {
  const sig = sigOf(items)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => {
    const list = items || []
    if (list.length !== 4 || !balanced) return shuffleSeeded(list, hash32(sig))
    const slot = slotFor(sig, 4)
    const rest = shuffleSeeded(list.slice(1), hash32(sig))
    const out = new Array(4)
    out[slot] = list[0]
    let k = 0
    for (let i = 0; i < 4; i += 1) {
      if (i === slot) continue
      out[i] = rest[k]
      k += 1
    }
    return out
  }, [sig])
}

export const Options = ({ items, picked, wrong, onPick, disabled, cols = 2, minH, collapse = true, badges = true, dense = false, neutral = false }) => {
  // Tartib bir marta aralashadi va savol almashgunicha qotib turadi.
  // To'g'ri javobning joyi xaltadan olinadi -- shuning uchun `true`.
  items = useShuffled(items, true)
  // SON javoblari BITTA QATORDA va YIRIK shriftda (metodist 2026-08-14:
  // «to'rt variant bir qatorda bo'lsin, shrift ancha kattaroq, ko'rinmayapti»).
  // Qisqa javob 2x2 panjarada ikki qator egallardi va o'sha ikki qatorda
  // to'rtta son mayda yozilardi. Bir qatorda esa balandlik ham KAMAYADI --
  // shu bo'shagan joy shriftga beriladi.
  const numeric = items.length === 4 && items.every((x) => String(x.label).trim().length <= 5 && !/[a-zA-Zа-яА-Я]/.test(String(x.label)))
  // SHRIFT QARORI SAVOL DARAJASIDA, VARIANT DARAJASIDA EMAS. Ilgari har
  // yorliq o'zicha hal qilinardi, va bitta raqam yetardi: bitta variant
  // monoshriftda, qolganlari proza bo'lib chiqardi -- bir savol ichida ikki
  // xil shrift (metodist 2026-08-22). Endi qaror bitta: YO HAMMASI
  // matematik, YO hammasi proza.
  const mathSet = numeric || (items.length > 0 && items.every((x) => looksMath(x.label)))
  cols = numeric ? 4 : (items.length === 3 ? 3 : (items.length === 4 ? 2 : cols))
  // SON QATORIDA USTUN ENI MAZMUNDAN OLINADI, teng ulushdan emas. Teng
  // ulushga bo'linganda tor telefonda katakka sonning O'ZI sig'masdi:
  // to'rtta teng ustun 85 px, son esa yorlig'i va bo'shliqlari bilan birga
  // undan kengroq -- va chetidan qirqilardi. Mazmun bo'yicha esa to'rttasi
  // birgalikda 311 px oladi va bemalol sig'adi.
  const numCols = numeric ? 'repeat(4, minmax(0, max-content))' : null
  const solved = !!picked
  const shrink = solved && collapse
  // YIG'ILISH IKKI FAZADA. Javob berilgach panjara DARROV bitta ustunga
  // o'tsa, tanlanmagan uchtasi balandligi hali nolga tushmagan holda BIR
  // ustunga tizilib qoladi -- to'rt qator, ekran budjetdan ~74px oshadi va
  // sarlavha yarim soniya KESILADI (2026-08-09, noutbuk 1366x615).
  // Shuning uchun avval balandlik 2x2 panjarada nolga tushadi (.5s), keyin
  // panjara bitta ustunga o'tadi.
  const [tight, setTight] = useState(false)
  useEffect(() => {
    if (!shrink) { setTight(false); return undefined }
    const tmr = setTimeout(() => setTight(true), 520)
    return () => clearTimeout(tmr)
  }, [shrink])
  return (
    <div
      className={'g7-options' + (dense ? ' g7-options-dense' : '')}
      style={{
        gridTemplateColumns: tight ? '1fr' : (numCols || 'repeat(' + cols + ', minmax(0, 1fr))'),
        justifyContent: !tight && numCols ? 'center' : undefined,
        justifyItems: tight ? 'center' : 'stretch',
        gap: shrink ? 0 : undefined,
      }}
    >
      {items.map((item, i) => {
        const isPicked = picked === item.id
        const isWrong = wrong && wrong.indexOf(item.id) !== -1
        const gone = shrink && !isPicked
        const cls = ['g7-opt']
        // SON QATORI ALOHIDA SINF OLADI: telefonda unga tor ichki bo'shliq
        // va kichik yorliq kerak, prozali variantga esa yo'q.
        if (numeric) cls.push('g7-opt-numbox')
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
              width: isPicked && tight ? '100%' : undefined,
              maxWidth: isPicked && tight ? 560 : undefined,
              transitionDelay: gone ? i * 0.05 + 's' : '0s',
            }}
          >
            {badges ? (
              <span className="g7-opt-badge" style={{ color: isPicked && !neutral ? T.ok : isWrong ? T.tip : T.ink3 }}>
                {isPicked ? (neutral ? BADGES[i] : '✓') : isWrong ? '↺' : BADGES[i]}
              </span>
            ) : null}
            <span className={'g7-opt-text' + (mathSet ? ' g7-opt-math' : '') + (numeric ? ' g7-opt-num' : '')}>
              <Fx>{item.label}</Fx>
            </span>
          </button>
        )
      })}
    </div>
  )
}

// Javob berilgan savol shu qatorga yig'iladi.
// `prose` -- satr YOZUV emas, GAP bo'lganda. Yozuv monoshiriftda turadi, gap
// esa turmaydi: proza monoshiriftda taqiqlangan (§6.2). Tarozining «ikki
// qadam bajarildi» satri aynan gap edi va monoshiriftda chiqib turgandi.
export const DoneRow = ({ children, prose }) => (
  <div className="g7-done">
    <span className="g7-done-tick">{'✓'}</span>
    <span className={'g7-done-text' + (prose ? ' is-prose' : '')}>
      {prose ? children : <Fx>{children}</Fx>}
    </span>
  </div>
)

// Feedback. Skroll YO'Q: blok oldindan band qilingan slot ichida ochiladi.
// `cap` -- yorliqni O'ZI berish. Neytral shakl odatda «TAXMININGIZ» deb
// imzolanadi, lekin u KO'RSATMA uchun ham ishlatiladi («Bosing») -- unda
// «taxmin» degan so'z yolg'on bo'lardi (metodist 2026-08-25).
export const Feedback = ({ show, ok, tone, cap, children }) => {
  const lang = useContext(LangContext)
  const [visible, setVisible] = useState(false)
  // Fidbek DARROV joy egallamaydi: avval tanlanmagan variantlar yig'iladi
  // (~0.5 s), keyin izoh chiqadi. Ikkisi bir vaqtda bo'lsa, past noutbukda
  // ekran bir lahzaga oshib ketadi (2026-08-10 o'lchov: 10px).
  // Ketma-ketlik pedagogik jihatdan ham to'g'ri: avval ortiqchasi ketadi,
  // keyin gap boshlanadi.
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    if (!show) { setMounted(false); setVisible(false); return undefined }
    const tmr = setTimeout(() => setMounted(true), 420)
    return () => clearTimeout(tmr)
  }, [show])
  useEffect(() => {
    if (!mounted) return undefined
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
    return () => cancelAnimationFrame(raf)
  }, [mounted])
  if (!show || !mounted) return null
  return (
    <div
      className={'g7-fb ' + (tone === 'neutral' ? 'g7-fb-neutral' : ok ? 'g7-fb-ok' : 'g7-fb-tip') + (visible ? ' g7-fb-on' : '')}
      aria-label={cap ? tr(cap, lang) : tone === 'neutral' ? '' : tr(ok ? UI_TXT.right : UI_TXT.hint, lang)}
    >
      <span className="g7-fb-cap">
        <span aria-hidden="true">{tone === 'neutral' ? '→' : ok ? '✓' : '↺'}</span>
        {cap ? tr(cap, lang) : tone === 'neutral' ? tr(UI_TXT.yourGuess, lang) : tr(ok ? UI_TXT.right : UI_TXT.hint, lang)}
      </span>
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
export const Stage = ({ eyebrow, right, block, screen, total, audio, nav, navCenter, field, children , noNotes}) => {
  const t = useT()
  const [notesOpen, setNotesOpen] = useState(false)
  const sect = sectionOf(screen)
  const [from, to] = SECTION_RANGE[sect]
  const inSection = screen - from + 1
  const sectionSize = to - from + 1

  return (
    <div className="stage">
      <div className="stage-header">
        {/* 3-sinf naqshi (metodist 2026-08-06): shapka BITTA qator.
            Yuqorida yupqa TUTASH progress chizig'i, chapda bo'lim nomi nuqta
            bilan, o'ngda ovoz / qayta / hisoblagich. 11-sinfdan kelgan M7
            yorlig'i, «Matematika · Urok», 15 segment, dublikat til
            almashtirgichi va blok xaritasi OLIB TASHLANDI -- ular ekranni
            to'ldirib yuborardi. */}
        <div className="g7-track" aria-hidden="true">
          <div className="g7-fill" style={{ width: Math.round(((screen + 1) / total) * 100) + '%' }} />
        </div>
        <div className="g7-top">
          <span className="g7-top-eyebrow">
            <i className="g7-top-dot" aria-hidden="true" />
            {eyebrow}
          </span>
          <span className="g7-top-tools">
            {/* Xuk ekranida qoralama tugmasi YO'Q: u yerda yozadigan narsa
                yo'q, tugma esa diqqatni tortadi (texnik topshiriq). */}
            {noNotes ? null : (
              <button type="button" className={'g7-tool' + (notesOpen ? ' is-on' : '')} onClick={() => setNotesOpen((v) => !v)} title={t(UI_TXT.notes)} aria-label={t(UI_TXT.notes)}>
                <b aria-hidden="true">{'✎'}</b>
              </button>
            )}
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
            <span className="g7-count g7-mono">{screen + 1} / {total}</span>
          </span>
        </div>
        {right ? (
          <div className="g7-eyebrow">
            <span />
            <span className="g7-eyebrow-right g7-mono">{right}</span>
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
        <span className="g7-nav-c g7-mono">{navCenter || ''}</span>
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
  /* SON VA AMAL BELGISINING YAGONA O'LCHAMI. Ilgari har asbob o'zicha
     berardi: yozuv 30px, bo'laklar 19px, prozadagi son 17px -- bitta
     ekranda uch xil son (metodist 2026-08-14). */
  --g7-num: clamp(20px, 2.5vw, 30px);
  position: fixed;
  /* inset 0 EMAS: yuqoridan qobiqning o'z tugmalari uchun joy qoldiriladi.
     O'zgaruvchini sayt qobig'i beradi (shared/LessonPage.css), keng ekranda u
     nol, tor ekranda 60px. Busiz telefonda ovoz tugmasiga BOSIB BO'LMAYDI. */
  top: var(--lesson-safe-top, 0px);
  right: 0;
  bottom: 0;
  left: 0;
  overflow: clip;
  overscroll-behavior: none;
  isolation: isolate;
  font-family: 'Manrope', system-ui, sans-serif;
  color: ${T.ink};
  -webkit-font-smoothing: antialiased;
  zoom: var(--g7z, 1);
  /* FON BIR TEKIS. Rasm, gradient dog'lar va katakcha YO'Q -- texnik
     topshiriq 2026-08-10: sof sut rangli fon, hamma model CSS va SVG bilan.
     Ekran TURIGA qarab yumshoq ohang: xuk, qoida, yakun. */
  background: ${T.bg};
  transition: background-color .24s ease;
}
.lesson-root.is-hook { background: ${T.fieldHook}; }
.lesson-root.is-rule { background: ${T.fieldRule}; }
.lesson-root.is-sum  { background: ${T.fieldSum}; }
@media (prefers-reduced-motion: reduce) { .lesson-root { transition: none; } }
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
  display: flex;
  flex-direction: column;
}
/* KADRNI TO'LDIRISH. Ilgari kontent TEPAGA yopishardi, ostida esa 250-420px
   bo'shliq qolardi -- 15 slaydning deyarli hammasida (2026-08-10 suratlar).
   Markazlash aynan SHU YERDA bo'lishi kerak: .g7-stack va .g7-field
   balandligi kontent bo'yicha (ular height:auto, aks holda sig'magan kontent
   JIMGINA kesiladi), demak ularning ichida markazlashga joy yo'q.
   auto-margin xavfsiz: joy qolmasa 0 ga tushadi, ya'ni baland kontent
   yuqoridan kesilmaydi. */
/* KONTENT TEPADA. Metodist qarori 2026-08-13: markazlash olib tashlanadi.
   Bu ETALON_7SINF.md §6.1 ga QAYTISH: u yerda «ish zonasi kontenti tepaga
   qisiladi, band bo'lmagan past esa zahiraga olingan slot» deb yozilgan.
   2026-08-10 da qo'yilgan margin-block auto o'sha talabga ZID edi va
   ekranlar «suzib yurgandek» ko'rinardi: asbobning ko'rinmas zahira slotlari
   pastda turgani uchun ko'rinadigan kontent markazdan YUQORIDA qolardi. */
.stage-content > .g7-stack,
.stage-content > .g7-field { margin-block: 0; width: 100%; }
/* height:100% bo'lsa ustun butun kadrni egallaydi va auto-margin uchun BO'SH
   JOY QOLMAYDI -- markazlash ishlamay qolardi. Balandlik kontent bo'yicha. */
.stage-content > .g7-stack { height: auto; }
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
  /* DARS USTUNI. Hamma bloklar -- sarlavha, sahna, zona, panellar, izoh,
     layfxak -- BIR XIL chekkada turadi. Ilgari har biri o'z kengligini
     olardi: sahna 1150px, zona 780px, yo'laklar 1150px, panel 660px --
     to'rt xil chekka bitta ekranda (metodist surati 2026-08-14).
     860px -- o'qish uchun qulay satr uzunligi va matematik yozuv uchun
     yetarli joy. */
  max-width: min(100%, 860px);
  width: 100%;
  margin-inline: auto;
}

/* ============ YUQORI PANEL ============ */
.g7-top { display: flex; align-items: center; gap: clamp(8px, 1.4vw, 16px); min-width: 0; }
.g7-mark {
  flex-shrink: 0;
  font-family: 'Source Serif 4', Georgia, serif;
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
  font-family: 'Source Serif 4', Georgia, serif;
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
  font-family: 'Source Serif 4', Georgia, serif;
  font-weight: 600;
  line-height: 1.05;
  letter-spacing: -.015em;
  font-size: clamp(22px, 3.2vw, 38px);
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
/* YOZUV PANELI SIG'MASA IKKINCHI QATORGA TUSHADI. g7-expr dagi
   nowrap uzun yozuvni qirqib tashlardi (QA nuqsoni 2026-08-22,
   28-dars 13-slayd). Panel flex va wrap bilan, shuning uchun
   ko'chirish bo'laklar chegarasida va probel joyida bo'ladi. */
.g7-slotfill-panel { white-space: normal; }
.g7-wrap { white-space: normal; overflow-wrap: anywhere; }
/* SIG'DIRISH QATORI (FitRow). Ichki tugun kengligi MAZMUNIDAN keladi va
   qatordan oshib ketishi mumkin -- aynan shu eni o'lchanadi, shundan
   koeffitsiyent chiqadi. Tashqi tugun kengligi joyni beradi. */
.g7-fitrow { display: flex; justify-content: center; width: 100%; min-width: 0; }
.g7-fitrow-in { flex: 0 0 auto; white-space: nowrap; }
/* POLDAN PASTDA KO'CHIRISH. Kichraytirish o'qishni buzadigan joyda yozuv
   ko'chadi, va shu paytda ichkaridagi hamma nowrap ochiladi -- aks holda
   katak ichidagi matn ko'chmasdan chetiga chiqib ketardi. */
.g7-fitrow-in.is-wrap { flex: 1 1 auto; min-width: 0; white-space: normal; }
.g7-fitrow-in.is-wrap .g7-expr,
.g7-fitrow-in.is-wrap .g7-sub-row > * { white-space: normal; }
.g7-fitrow-in.is-wrap .g7-fitflex { flex-wrap: wrap; }
/* ALMASHTIRISH JADVALI IKKI QAVATGA CHIQADI. Bitta qatorga ifoda ham,
   qo'yish ham sig'maganda ular yonma-yon EMAS, biri ikkinchisining ostida
   turadi: ifoda o'z qatorida, keyingi qatorda strelka bilan qo'yish va
   qiymat. Shunda ko'chirish YOZUV ICHIDA bo'lmaydi -- qavsning o'rtasidan
   sinmaydi, va aynan shu ko'rinish metodistga tushunarsiz ko'ringandi.
   Bu yerda important kerak: ustunlar inline uslubda beriladi. */
.g7-fitrow-in.is-wrap .g7-subgrid { display: flex !important; flex-direction: column; align-items: center; gap: 11px; }
.g7-fitrow-in.is-wrap .g7-sub-row {
  display: flex !important; flex-wrap: wrap; align-items: center; justify-content: center;
  gap: 0 .3em; width: 100%;
}
.g7-fitrow-in.is-wrap .g7-sub-row > :first-child { flex: 0 0 100%; text-align: center; }
/* Oraliq ham em birligida: yozuv kichrayganda bo'shliq ham kichrayadi, aks holda
   kichraygan yozuvda bo'laklar orasi haddan tashqari keng ko'rinardi. */
.g7-fitflex { display: flex; align-items: center; justify-content: center; gap: .28em; flex-wrap: nowrap; }

.g7-expr-hero { font-size: clamp(26px, 3.1vw, 40px); letter-spacing: -.02em; }
/* Yozuvning HAMMA ko'rinishi bitta o'lchamda: metodist 2026-08-14 --
   «sonlar va amal belgilari hammasi bir xil kattalikda bo'lsin». */
.g7-expr-big { font-size: var(--g7-num); }
.g7-expr-mid { font-size: var(--g7-num); }
.g7-expr-row { font-size: var(--g7-num); text-align: center; }
.g7-expr-sm { font-size: clamp(14px, 1.4vw, 16.5px); text-align: left; }
/* Serifda indeks monoshriftdagidan kichikroq va boshqa balandlikda
   o'tiradi; og'irligi bir pog'ona ko'tarildi -- aks holda mayda indeks
   asosiy satrdan solg'in ko'rinadi. */
.g7-idx { font-size: max(10.5px, .68em); font-weight: 700; letter-spacing: .01em; font-style: normal; }
sub.g7-idx { vertical-align: -.20em; }
sup.g7-idx { vertical-align: .46em; }
.g7-hint { font-size: clamp(15.5px, 2vw, 18.5px); line-height: 1.45; color: ${T.ink2}; }
.g7-ask { font-size: clamp(16px, 2.1vw, 19.5px); line-height: 1.4; font-weight: 700; color: ${T.ink}; }
.g7-tag {
  display: inline-flex; align-items: center; gap: 6px;
  /* Flex ustun ichida inline-flex ham CHO'ZILADI (align-items: stretch),
     natijada yorliq butun kenglikdagi kulrang polosa bo'lib, KIRITISH
     MAYDONIGA o'xshab qolardi (2026-08-10 suratlar, 15-slayd). */
  align-self: flex-start;
  font-size: clamp(10.5px, .95vw, 12px); letter-spacing: .15em; text-transform: uppercase; font-weight: 700;
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

/* HARAKAT BELGISI. To'q sariq -- hozirgi harakat rangi. Puls FAQAT
   shaffoflik va soya bilan: scale butun blokni kengaytirib, gorizontal
   oshib ketish berardi (o'lchov bilan topilgan, ikki marta). */
.g7-cta {
  display: inline-flex; align-items: center; gap: 7px;
  align-self: flex-start;
  padding: 3px 11px 3px 8px;
  border-radius: 999px;
  background: ${T.accentSoft};
  color: ${T.accent};
  font-family: 'Manrope', sans-serif;
  font-size: clamp(11px, 1.3vw, 12.5px);
  font-weight: 800; letter-spacing: .09em; text-transform: uppercase;
  white-space: nowrap;
}
.g7-cta-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: ${T.accent};
  box-shadow: 0 0 0 0 rgba(231,90,44,.55);
  animation: g7-cta-pulse 1.9s ease-out infinite;
}
@keyframes g7-cta-pulse {
  0% { box-shadow: 0 0 0 0 rgba(231,90,44,.5); }
  70% { box-shadow: 0 0 0 9px rgba(231,90,44,0); }
  100% { box-shadow: 0 0 0 0 rgba(231,90,44,0); }
}
@media (prefers-reduced-motion: reduce) { .g7-cta-dot { animation: none; } }

/* IKKI KARTOCHKA YONMA-YON: ko'paytuvchi va qo'shiluvchi (4-ekran).
   Rasm yo'q -- ramka, rang va yoy. DIQQAT: media-qoidalar shu blokning
   OXIRIDA turadi. Ilgari ular asosiy qoidalardan OLDIN edi va bir xil
   solishtirma og'irlikda keyingi qoida ularni bosib ketardi -- telefonda
   ixchamlashtirish umuman ishlamasdi. */
.g7-cmp-row { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(8px, 1.2vw, 14px); }
.g7-cmp {
  display: flex; flex-direction: column; align-items: flex-start; gap: 3px;
  min-width: 0;
  padding: clamp(8px, 1.2vw, 12px) clamp(11px, 1.5vw, 15px);
  border-radius: 14px;
  border-top: 3px solid transparent;
  background: ${T.paper};
  box-shadow: 0 8px 22px -14px rgba(${T.shadow},.28), inset 0 0 0 1px ${T.line};
}
.g7-cmp-cap {
  padding: 2px 8px; border-radius: 6px;
  font-family: 'Manrope', sans-serif;
  font-size: clamp(10px, 1.15vw, 11.5px);
  font-weight: 800; letter-spacing: .13em; text-transform: uppercase;
}
.g7-cmp-expr {
  font-family: ${MATH_FONT}; font-weight: 700;
  font-size: clamp(17px, 2.1vw, 23px);
  white-space: nowrap;
}
.g7-cmp-arc { width: min(100%, 210px); height: clamp(14px, 1.8vw, 22px); display: block; }
.g7-cmp-note {
  margin: 0; color: ${T.ink2};
  font-size: clamp(12.5px, 1.5vw, 14px); line-height: 1.32;
}
.g7-cmp-res {
  font-family: ${MATH_FONT}; font-weight: 700; color: ${T.ink};
  font-size: clamp(14px, 1.7vw, 17px); white-space: nowrap;
}

/* Past noutbukda (615px) yoy qatori sig'maydi: 4-ekran 71px oshib ketardi.
   Yoy -- tushuntirishning YORDAMCHISI, matn va natija ASOSIY. */
@media (max-height: 660px) {
  /* CHIZMA PAST EKRANDA KICHRAYADI. Bandlik ham bo'shatiladi: Slot ni
     inline min-height bilan chizadi, shuning uchun !important kerak. */
  .g7-drawslot { min-height: 0 !important; }
  .g7-fg-svg, .g7-pl-svg { max-height: 150px; width: auto; }
  /* Tuzoq qatorlari: besh qator past ekranda 20px oshib ketardi. */
  .g7-auditrows .g7-opt { padding-top: 4px; padding-bottom: 4px; }
  .g7-cmp-arc { display: none; }
  .g7-cmp { padding: 7px 11px; gap: 2px; }
  .g7-cmp-expr { font-size: clamp(16px, 1.9vw, 20px); }
  .g7-slotfill-panel { padding-top: 6px !important; padding-bottom: 6px !important; }
}
/* Telefonda kartochkalar USTMA-UST tushadi -- balandlik ikki barobar. */
@media (max-width: 639.98px) {
  .g7-cmp-row { grid-template-columns: minmax(0, 1fr); gap: 5px; }
  .g7-cmp-arc { display: none; }
  .g7-cmp { padding: 4px 10px; gap: 0; border-top-width: 2px; }
  .g7-cmp-expr { font-size: 15.5px; }
  .g7-cmp-note { font-size: 11.5px; line-height: 1.2; }
  .g7-cmp-res { font-size: 13.5px; }
  .g7-cmp-cap { font-size: 9.5px; padding: 1px 6px; }
}

/* Uch yozuv birin-ketin: chap qism, o'ng qism, birgalikda (5-ekran).
   Har biri kichik yorliq va formula -- rasm emas, sof matn va ramka. */
.g7-lines { display: flex; flex-wrap: wrap; gap: clamp(7px, 1vw, 12px); align-items: stretch; }
.g7-line-chip {
  display: flex; flex-direction: column; gap: 1px;
  padding: 5px 12px;
  border-radius: 11px;
  background: ${T.paper};
  box-shadow: inset 0 0 0 1px ${T.line};
}
.g7-line-chip i {
  font-style: normal;
  font-family: 'Manrope', sans-serif;
  font-size: clamp(10px, 1.1vw, 11.5px);
  font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
  color: ${T.ink3};
}
.g7-line-chip b {
  font-family: ${MATH_FONT}; font-weight: 700; color: ${T.graph};
  font-size: clamp(15px, 1.9vw, 19px);
}
.g7-line-chip:last-child b { color: ${T.accent}; }

/* QOIDALAR AKKORDEONI (8-ekran). Bir vaqtda bitta qoida ochiq. */
.g7-acc { display: flex; flex-direction: column; gap: 7px; align-items: stretch; }
.g7-acc-item {
  border-radius: 12px;
  background: ${T.paper};
  box-shadow: inset 0 0 0 1px ${T.line};
  overflow: hidden;
}
.g7-acc-item.is-open { box-shadow: inset 0 0 0 2px ${T.graph}; }
.g7-acc-head {
  width: 100%;
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: clamp(8px, 1.2vw, 12px) clamp(12px, 1.6vw, 16px);
  border: none; background: transparent; cursor: pointer; text-align: left;
  transition: background .2s ease;
}
.g7-acc-head:hover { background: rgba(18,110,115,.05); }
.g7-acc-head:active { background: rgba(18,110,115,.09); }
.g7-acc-head:focus-visible { outline: 3px solid ${T.accent}; outline-offset: -3px; }
.g7-acc-formula {
  font-family: ${MATH_FONT}; font-weight: 700; color: ${T.ink};
  font-size: clamp(15px, 1.9vw, 19px);
}
.g7-acc-sign {
  flex-shrink: 0;
  width: 24px; height: 24px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: ${T.accentSoft}; color: ${T.accent};
  font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 15px;
}
.g7-acc-item.is-open .g7-acc-sign { background: ${T.graphSoft}; color: ${T.graph}; }
.g7-acc-body { padding: 0 clamp(12px, 1.6vw, 16px) clamp(9px, 1.2vw, 12px); }
.g7-acc-note { margin: 0; color: ${T.ink}; font-size: clamp(13px, 1.6vw, 15px); line-height: 1.4; }
.g7-acc-ex {
  margin: 4px 0 0; font-family: ${MATH_FONT}; color: ${T.graph};
  font-size: clamp(13px, 1.6vw, 15.5px);
}

/* ============ VARIANTLAR ============ */
.g7-options { display: grid; gap: clamp(8px, 1vw, 10px); flex-shrink: 0; }
.g7-opt {
  display: flex; align-items: center; gap: 12px;
  overflow: hidden;
  /* 5-sinf o'lchovlari (metodist 2026-08-10). U yerda tugma BALAND
     (50-60px), matn esa KICHIK (13-14px): bosish nishoni katta, kadr
     esa tinch. Bizda teskarisi edi -- past tugma, yirik matn. */
  padding: clamp(11px, 1.6vw, 13px) clamp(14px, 2.1vw, 19px);
  min-height: clamp(52px, 5.6vw, 62px);
  border: none;
  border-radius: 12px;
  background: ${T.paper};
  color: ${T.ink};
  font-family: 'Manrope', sans-serif;
  font-size: clamp(15.5px, 2.1vw, 19px);
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
/* JAVOB TUGMASINING VAZNI BITTA: 500, hamma joyda (QA 2026-08-22:
   «javoblarda bazilari bold, bazilari oddiy -- bir xil oddiy bo'lgani
   yaxshi»). Ilgari uch xil vazn yonma-yon turardi: proza 500, yozuv 600,
   son 800. Ajratish endi SHRIFT va O'LCHAM bilan beriladi, qalinlik bilan
   emas -- son baribir yirik, yozuv baribir monoshriftda. */
.g7-opt-math {
  font-family: ${MATH_FONT};
  letter-spacing: 0;
  word-spacing: .1em;
  font-variant-numeric: tabular-nums lining-nums;
  font-size: 1.06em;
}
/* TUZOQ QATORI -- YOZUV, ya'ni yozuv panelidagi bilan BIR XIL terilishi
   kerak: o'sha vazn, o'sha jadval raqamlari, o'sha so'z oralig'i. Ilgari
   qatorga faqat shrift oilasi berilardi, qolganini g7-opt bosib qolardi.
   Tanlagichda ikki sinf: g7-opt keyinroq e'lon qilingan va bitta sinfli
   qoidani bosib qo'yardi. */
.g7-auditrows.is-math .g7-opt {
  font-family: ${MATH_FONT};
  font-weight: 600;
  letter-spacing: 0;
  word-spacing: .12em;
  font-variant-ligatures: none;
  font-feature-settings: 'liga' 0;
  font-variant-numeric: tabular-nums lining-nums;
}
/* QIYMAT YO'Q: natija emas, natijaning YO'QLIGI. Metodist qarori 2026-08-23:
   so'z o'rniga BELGI -- shunday chiroyliroq. Rang sinf palitrasidan olinadi:
   tip -- «noto'g'ri» rangi, xato variant ham shu rangda yonadi. Sof qizil
   palitrada yo'q va ataylab kiritilmagan: har rang MA'NOGA band.
   Ekran o'quvchisi uchun belgi yonida aria-label bilan matn qoladi. */
.g7-sub-none { color: ${T.tip}; font-size: 1.15em; font-weight: 700; }
.g7-opt-badge { flex-shrink: 0; min-width: 20px; font-family: 'Manrope', sans-serif; font-size: 14px; font-weight: 700; }
/* SON javobi: yirik va markazda. Harf yo'q, ya'ni kenglik ham kerak emas --
   to'rttasi bitta qatorga bemalol sig'adi. */
/* Javob bo'laklari qatori: markazda, belgi bilan birga. */
/* PROZADAGI SON. Matematik shrift, biroz yirikroq va qalinroq -- shu
   bilan u pastdagi yozuvdagi son bilan BIR OILADAN bo'lib ko'rinadi. */
/* YON ZAZOR SHART. Son proza ichiga BOSHQA shriftda kiradi: qalinroq va
   16% yirikroq. Metrikalar mos kelmaydi, va gorizontal zazor bo'lmaganda
   glif qo'shnisiga tegib turadi -- "5x" da beshlik bilan iks yopishib
   qolgandi (metodist 2026-08-22, o'zbekcha: u yerda ulanish ko'proq).
   Zazor so'z ichidagi bo'shliqdan ancha kichik, ya'ni son so'zdan
   uzilmaydi, ammo tegish yo'qoladi. */
.g7-fxnum { font-family: ${MATH_FONT}; font-weight: 800; }
.g7-ask .g7-fxnum, .g7-qpill .g7-fxnum, .g7-hint .g7-fxnum,
.g7-fb-body .g7-fxnum, .g7-sumcard-ul .g7-fxnum { font-size: 1.16em; margin-inline: .07em; }
/* JAVOB TUGMASI ICHIDA SON AJRATILMAYDI. Prozada son boshqa shriftda va
   qalinroq chiqadi -- tushuntirish matnida bu foydali, javob variantida esa
   yo'q: bitta qisqa javob ichida ikki xil yozuv paydo bo'lardi va qator
   ola-bula ko'rinardi (QA 2026-08-22: «javoblarda bazilari bold, bazilari
   oddiy»). Variant ichida son atrofdagi matn bilan BIR XIL teriladi.
   Tushuntirish matnida (savol, razbor, xulosa) ajratish qoladi. */
.g7-opt-text .g7-fxnum {
  font-family: inherit;
  font-weight: inherit;
  font-size: inherit;
  margin-inline: 0;
}
.g7-done-text.is-prose .g7-fxnum { margin-inline: .05em; }
/* ============ YOZUVNI O'QISH NAMOYISHI (ReadViz) ============ */
.g7-rv {
  display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: center;
  gap: 2px clamp(6px, 1vw, 12px); min-width: 0;
  font-family: ${MATH_FONT}; font-weight: 800;
  font-size: var(--g7-num); color: ${T.ink};
  font-variant-numeric: tabular-nums lining-nums;
}
.g7-rv-tok {
  position: relative; display: inline-block;
  animation: g7-in .32s ease-out both;
  transition: opacity .35s ease, color .35s ease;
}
.g7-rv-tok.is-dim { opacity: .22; }
.g7-rv-tok.is-lit { color: ${T.accent}; }
/* Navbat raqami belgining USTIDA -- kichkina va to'q sariq. */
.g7-rv-no {
  position: absolute; top: -.72em; left: 50%; transform: translateX(-50%);
  font-family: 'Manrope', sans-serif; font-style: normal;
  font-size: .42em; font-weight: 800; color: ${T.accent};
}
/* ============ QOIDA LESTNITSASI ============ */
.g7-stairs { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.g7-stairs-svg { display: block; width: 100%; height: auto; max-height: clamp(96px, 17vh, 150px); margin-inline: auto; }
.g7-stair { opacity: 0; animation: g7-stairin .42s cubic-bezier(.22,.61,.36,1) both; }
@keyframes g7-stairin { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: none; } }
.g7-stair-top { fill: rgba(24,34,36,.10); }
.g7-stair-riser { fill: rgba(24,34,36,.07); }
.g7-stair.is-par .g7-stair-riser { fill: rgba(18,110,115,.28); }
.g7-stair.is-s2 .g7-stair-riser { fill: rgba(44,95,168,.28); }
.g7-stair.is-s1 .g7-stair-riser { fill: rgba(122,79,163,.28); }
.g7-stair-lab {
  font-family: ${MATH_FONT}; font-weight: 800; font-size: 19px; fill: ${T.ink3};
}
.g7-stair.is-par .g7-stair-top { fill: ${T.graph}; }
.g7-stair.is-par .g7-stair-lab { fill: ${T.graph}; }
.g7-stair.is-s2 .g7-stair-top { fill: ${T.stage2}; }
.g7-stair.is-s2 .g7-stair-lab { fill: ${T.stage2}; }
.g7-stair.is-s1 .g7-stair-top { fill: ${T.stage1}; }
.g7-stair.is-s1 .g7-stair-lab { fill: ${T.stage1}; }
/* Yozuv pog'onalar bo'ylab pastga tushadi -- bir marta, so'ng to'xtaydi. */
.g7-stair-ball {
  fill: ${T.accent};
  animation: g7-stairroll 2.6s cubic-bezier(.4,0,.5,1) .5s both;
}
@keyframes g7-stairroll {
  0%   { transform: translate(0, 0); }
  22%  { transform: translate(140px, 26px); }
  46%  { transform: translate(280px, 52px); }
  70%  { transform: translate(420px, 78px); }
  100% { transform: translate(560px, 104px); }
}
@media (prefers-reduced-motion: reduce) { .g7-stair-ball { animation: none; } }
.g7-stairs-sweep {
  margin: 0; text-align: center;
  font-family: 'Manrope', sans-serif; font-weight: 600;
  font-size: clamp(12.5px, 1.5vw, 15px); color: ${T.graph};
}
/* Yig'ish maydonining bo'sh holati: xira yozuv, KURSORSIZ. Miltillovchi
   kursor bu yerda bor edi va ramkani KIRITISH MAYDONIGA o'xshatib qo'yardi --
   javobni yozish kerakdek tuyulardi (QA 2026-08-23). */
.g7-rb-empty {
  display: inline-flex; align-items: center; gap: 6px;
  font-family: 'Manrope', sans-serif; font-weight: 600;
  font-size: clamp(13.5px, 1.6vw, 16px); color: ${T.ink3};
}
.g7-partsrow {
  display: flex; flex-wrap: wrap; align-items: center;
  gap: clamp(8px, 1.2vw, 14px); justify-content: center; min-width: 0;
}
/* Bo'lak SONI yirik: metodist ko'rsatgan o'lchov -- yechim satri kabi. */
/* Vazni OSHIRILGAN: .g7-opt keyinroq e'lon qilingan va o'z o'lchamini
   bosib qo'yardi -- javob bo'laklari 16px bo'lib qolardi (metodist
   surati 2026-08-14). Ikki sinf birga yozilgani shuni tuzatadi. */
.g7-opt.g7-part {
  min-height: 48px; min-width: 60px; width: auto;
  padding: 4px 16px;
  display: inline-flex; justify-content: center; align-items: center;
}
/* SON bo'lagi yirik va qalin -- yechim satridagidek. */
.g7-opt.g7-part.is-math {
  font-family: ${MATH_FONT};
  font-size: var(--g7-num);
}
/* SO'Z bo'lagi esa oddiy variant o'lchamida: 30 px da 800 vaznda terilgan
   uzun so'z ekranda qichqirib turardi (QA 2026-08-22). */
.g7-opt.g7-part.is-prose {
  font-size: clamp(15.5px, 2.1vw, 19px);
}
.g7-opt-num {
  flex: none; text-align: center;
  font-size: var(--g7-num);
  /* SON IKKIGA BO'LINMAYDI. Umumiy qoidada overflow-wrap: anywhere turadi
     -- u uzun o'zbekcha so'z tugmadan chiqib ketmasin deb qo'yilgan, ammo
     u ISTALGAN joydan uzadi, jumladan sonning O'RTASIDAN: telefonda 12
     bir va ikki bo'lib, 335 daraja esa 33 va 5 daraja bo'lib ikki qatorga
     tushardi (QA 2026-08-22). Sonda uzish joyi yo'q. */
  white-space: nowrap;
  overflow-wrap: normal;
}
/* min-width 0 va overflow-wrap: flex-element min-content dan kichrayolmaydi,
   ya'ni UZUN SO'Z tugmadan chiqib ketadi va overflow hidden uni JIMGINA
   kesadi -- 390 da o'zbekcha qo'shiluvchining shunday kesilgan.
   anywhere min-content hisobiga ham kiradi, break-word esa kirmaydi. */
.g7-opt-text { flex: 1; min-width: 0; overflow-wrap: anywhere; }
/* SON O'Z ENIDAN KICHRAYMAYDI. Bitta span da ikkala sinf turadi, va
   g7-opt-text keyinroq e'lon qilingani uchun flex bilan eng kam kenglikni
   bosib qo'yardi: son katakka sig'masa SIQILARDI, va
   ko'chirish taqiqlangani uchun chetidan qirqilardi -- 412 px li telefonda
   «335 daraja» dan «335» qolib, daraja belgisi kesilardi (QA 2026-08-22).
   Ikki sinfli tanlagich buni qaytaradi. */
.g7-opt-text.g7-opt-num { flex: 0 0 auto; min-width: max-content; }
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
/* Yechilgan qator. 12px JUDA kichik edi -- uch qator 36px joy egallab,
   ekranning qolgani bo'sh qolardi va o'quvchi o'z javoblarini o'qiy olmasdi.
   5-sinf shkalasida body 15, kichik 13 -- yechilgan qator 14 ga chiqarildi. */
.g7-done {
  display: flex; align-items: flex-start; gap: 9px; flex-shrink: 0; min-width: 0;
  padding: 3px 0;
  font-size: clamp(14px, 1.7vw, 16px); color: ${T.ink2};
}
.g7-done-tick { color: ${T.ok}; font-weight: 800; flex-shrink: 0; }
.g7-done-text { font-family: ${MATH_FONT}; min-width: 0; white-space: normal; overflow-wrap: anywhere; }
.g7-done-text.is-prose { font-family: 'Manrope', sans-serif; }

/* FIDBEK -- 5-sinf tuzilishi (metodist 2026-08-10: «посмотри как это сделано
   для 5 класса»). U yerda ikki qator: birinchisi HOLAT (kichik, katta harf,
   holat rangida), ikkinchisi MATN oddiy qora rangda. Bizda butun matn rangli
   va yarim qalin serif edi -- og'ir va yomon o'qilardi. Rang endi faqat
   yorliqda, matn esa Manrope, 5-sinfdagi 15/1.5 shkalasida. */
.g7-fb {
  display: flex; flex-direction: column; gap: 5px;
  /* Ichki bo'shliq 2026-08-17 da ozgina kichraytirildi. Sabab: tekshiruv
     walkeri tuzatilgach ma'lum bo'ldi -- razbor va xulosa birga chiqqan
     yechilgan holat uch darsda budjetdan 3-8 px oshib turgan. Matn, shrift
     va rang o'zgarmadi, faqat atrofdagi bo'shliq. */
  padding: clamp(9px, 1.3vw, 13px) clamp(13px, 1.8vw, 18px);
  border-radius: 12px;
  border-left: 4px solid transparent;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity .32s cubic-bezier(.22,.61,.36,1), transform .32s cubic-bezier(.22,.61,.36,1);
}
.g7-fb-on { opacity: 1; transform: translateY(0); }
.g7-fb-ok { background: ${T.okSoft}; border-left-color: ${T.ok}; }
.g7-fb-tip { background: ${T.tipSoft}; border-left-color: ${T.tip}; }
.g7-fb-cap {
  display: flex; align-items: center; gap: 6px;
  font-family: 'Manrope', sans-serif;
  font-size: clamp(11px, 1.2vw, 12.5px);
  font-weight: 700; letter-spacing: .09em; text-transform: uppercase;
}
.g7-fb-ok .g7-fb-cap { color: ${T.ok}; }
/* LAYFXAK va BONUS -- javob izohi bilan BIR XIL shakl, boshqa rang.
   Sariq metodist qarori bo'yicha O'ZGARMAYDI (2026-08-14). */
.g7-fb-hack { background: #FFF6DC; border-left-color: #C7A44A; }
.g7-fb-hack .g7-fb-cap { color: #8A6A16; }
/* Yulduzcha YIRIKROQ va JONLI: u yorliqning belgisi. Pulsatsiya CHEKSIZ
   EMAS: besh urinish, keyin tinchiydi. Past qator balandligi va manfiy
   chekka uni satr ichida ushlab turadi -- busiz 3-ekran 3px oshib ketardi. */
.g7-fb-star {
  display: inline-block; font-size: 1.55em;
  line-height: .74; margin-block: -3px;
  color: #C7A44A; transform-origin: center;
  animation: g7-starbeat 1.05s cubic-bezier(.33,0,.2,1) 5;
}
@keyframes g7-starbeat {
  0%, 100% { transform: none; }
  38% { transform: scale(1.24) rotate(-11deg); }
  64% { transform: scale(1.05) rotate(5deg); }
}
@media (prefers-reduced-motion: reduce) { .g7-fb-star { animation: none; } }
/* Layfxak ekranning ENG PASTIDA: zahira slotlarning o'rnini egallaydi. */
/* PASTDAGI PLASHKA (mukofot va bonus) ekranga YECHILGANDAN keyin qo'shiladi,
   ya'ni u eng tor joyga tushadi. 2026-08-17 da tekshiruv walkeri tuzatilgach
   ma'lum bo'ldi: yechilgan holat hech qachon o'lchanmagan va yetti darsda
   ekran budjetdan oshib turgan. Shuning uchun pastdagi plashka IXCHAM:
   ichki bo'shliq kichrayadi, matn esa o'zgarmaydi. */
.g7-fb-bottom {
  margin-top: auto;
  padding: clamp(8px, 1vw, 11px) clamp(12px, 1.6vw, 16px);
  gap: 3px;
}
.g7-fb-tip .g7-fb-cap { color: ${T.tip}; }
.g7-fb-body {
  min-width: 0;
  font-family: 'Manrope', sans-serif;
  font-weight: 500;
  font-size: clamp(14.5px, 1.9vw, 16.5px);
  line-height: 1.45;
  color: ${T.ink};
}

/* QOIDA KARTOCHKASI. Metodist qarori 2026-08-14: to'q fon olib tashlanadi,
   uning o'rniga MATEMATIK urg'uli fon.
   Fon -- daftar KATAKCHASI: eng tinch va eng matematik naqsh, u yozuvni
   bosmaydi va rasm fayli talab qilmaydi (CLAUDE.md §5 -- faqat CSS va SVG).
   Chap chekkada BOG'LANISH rangi: qoida darsdagi hamma yozuvni bog'laydi. */
.g7-rule {
  display: flex; flex-direction: column; gap: 5px; flex-shrink: 0;
  padding: clamp(12px, 1.5vw, 20px) clamp(13px, 1.6vw, 22px);
  border-radius: 16px;
  background-color: ${T.paperSolid};
  background-image:
    linear-gradient(rgba(18,110,115,.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(18,110,115,.07) 1px, transparent 1px);
  background-size: 24px 24px;
  background-position: -1px -1px;
  color: ${T.ink};
  border-left: 4px solid ${T.graph};
  box-shadow: 0 14px 30px -18px rgba(${T.shadow},.4), inset 0 0 0 1px rgba(18,110,115,.16);
}
.g7-rule-badge { font-size: clamp(9.5px, .8vw, 11px); font-weight: 800; letter-spacing: .16em; text-transform: uppercase; color: ${T.graph}; }
.g7-rule-rule { display: block; height: 1px; background: rgba(18,110,115,.22); margin: 3px 0 5px; }
.g7-rule-line, .g7-rule-example {
  /* Qoida satrlari matematika bilan aralash (formula + izoh) -- hammasi
     serif, tepasidagi qonun qutisi bilan bir tilda ko'rinadi. */
  font-family: ${MATH_FONT};
  font-size: clamp(14.5px, 1.5vw, 18px);
  line-height: 1.4;
  opacity: 0;
  animation: g7-in .42s cubic-bezier(.22,.61,.36,1) forwards;
  color: ${T.ink};
}
.g7-rule-line:first-of-type { font-weight: 700; }
.g7-rule-example { font-family: ${MATH_FONT}; color: ${T.ink2}; font-size: clamp(12px, 1.2vw, 13.5px); }
.g7-rule-wide .g7-rule-line { font-size: clamp(14px, 1.6vw, 17.5px); }

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
/* «ok» ohangi YO'Q edi: yakunda «yopildi» yashil emas, biruza chiqardi. */
.g7-insight-ok { border-left-color: ${T.ok}; background: ${T.okSoft}; }
.g7-insight-label {
  font-size: clamp(9.5px, .8vw, 11px); font-weight: 800;
  letter-spacing: .18em; text-transform: uppercase; color: ${T.graph};
}
.g7-insight-accent .g7-insight-label { color: ${T.accent}; }
.g7-insight-ok .g7-insight-label { color: ${T.ok}; }
.g7-insight-body { font-size: clamp(14px, 1.7vw, 16px); line-height: 1.42; color: ${T.ink}; }

/* ============ HALQA, TAYMER ============ */
.g7-ring { display: flex; flex-direction: column; align-items: center; gap: 4px; flex-shrink: 0; }
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
  .g7-print h2 { font-family: 'Source Serif 4', Georgia, serif; font-size: 20pt; margin: 0 0 10pt; }
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
  40% { color: ${T.accent}; text-shadow: 0 0 18px rgba(231,90,44,.4); }
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
/* Rang faqat YORLIQDA. Matn hamma holatda bir xil qora -- 5-sinfdagidek. */
.g7-fb-neutral { background: ${T.graphSoft}; border-left-color: ${T.graph}; }
.g7-fb-neutral .g7-fb-cap { color: ${T.graph}; }

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
/* Sahna va uning ostidagi satr uchun umumiy o'ram: max-height faqat
   SAHNAGA tegadi, satr esa o'ramda erkin turadi -- aks holda u sahnadan
   chiqib ketardi va keyingi kartochka uni yopib qo'yardi. */
.g7-scenewrap { display: flex; flex-direction: column; min-width: 0; }
.g7-move { transition: transform .8s cubic-bezier(.33, 0, .2, 1); }
.g7-crate { transition: opacity .5s ease .3s; }
.g7-crate-lid { transition: transform .55s cubic-bezier(.34, 1.3, .64, 1); }

.g7-clip-cap {
  text-align: center;
  font-size: clamp(13.5px, 1.7vw, 15.5px);
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

/* --- «Bilasizmi?» kartochkasi (3-sinf .fact-card naqshi, maskotsiz) --- */
.g7-fact {
  display: flex; flex-direction: column; gap: 4px; flex-shrink: 0;
  padding: clamp(8px, 1.4vw, 11px) clamp(11px, 1.9vw, 15px);
  border-radius: 12px;
  border-left: 4px solid ${T.graph};
  background: ${T.graphSoft};
  box-shadow: 0 6px 16px -6px rgba(23,108,112,.22);
  opacity: 0;
  animation: g7-in .36s ease-out .2s forwards;
}
.g7-fact-badge {
  display: flex; align-items: center; gap: 7px;
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(10px, 1.2vw, 11px);
  font-weight: 600; letter-spacing: .1em; text-transform: uppercase;
  color: ${T.graph};
}
.g7-fact-dot { width: 7px; height: 7px; border-radius: 50%; background: ${T.graph}; box-shadow: 0 0 8px rgba(23,108,112,.55); }
.g7-fact-text { font-size: clamp(13px, 1.7vw, 15px); line-height: 1.36; color: ${T.ink}; }
@media (prefers-reduced-motion: reduce) { .g7-fact { opacity: 1; animation: none; } }

/* ============================================================
   3-SINF USLUBI (metodist 2026-08-06: «стилистику как класс 3»).
   Ekran tinch bo'lsin: fon sof, ish maydonida rangli to'ldirish yo'q,
   shapka bitta qator, pastda faqat Ortga va Davom.
   ============================================================ */

/* Yupqa TUTASH progress chizig'i (11-sinfdagi 15 segment o'rniga) */
.g7-track { width: 100%; height: 4px; border-radius: 999px; background: rgba(23,26,29,.10); overflow: hidden; }
.g7-fill { height: 100%; background: ${T.accent}; transition: width .45s ease; }

/* Shapka: chapda bo'lim nomi nuqta bilan, o'ngda asboblar */
.g7-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 8px; }
.g7-top-eyebrow {
  display: flex; align-items: center; gap: 8px; min-width: 0;
  font-size: clamp(10px, 1.2vw, 11px); font-weight: 700;
  letter-spacing: .16em; text-transform: uppercase; color: ${T.ink2};
}
.g7-top-dot { width: 7px; height: 7px; border-radius: 50%; background: ${T.accent}; flex-shrink: 0; }
.g7-top-tools { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.g7-count { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; }

/* Fon tinch: bezak egri chiziqlari va katakcha OLIB TASHLANADI */
.g7-bgcurves { display: none !important; }
.lesson-root { background-image: none !important; }

/* Ish maydoni rangli to'ldirilmaydi: 3-sinfda oq kartochka faqat SAHNA
   atrofida bo'ladi, butun ekran bo'yalmaydi. */
.g7-field, .g7-field-ask, .g7-field-rule, .g7-field-blitz, .g7-field-graph, .g7-field-accent {
  background: transparent !important;
  border: none !important;
  border-left: none !important;
  box-shadow: none !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
  /* MUHIM: maydon kontentni JIMGINA KESMASIN. Balandligi 100 foiz va
     overflow clip bo'lgani uchun u sig'magan qismni yashirardi, asosiy
     o'lchov buni ko'rmasdi -- inglizcha 1-slaydda 215px kontent yo'qolgan edi.
     (STYLES ichida BACKTICK ishlatib bo'lmaydi -- fayl buziladi.) */
  height: auto !important;
  overflow: visible !important;
}

/* Pastki panel: faqat ikki tugma, o'rtasi bo'sh */
.g7-nav-c { color: transparent; }

/* «Davom» -- 3-sinfdagi «Dalshe» kabi TO'Q SARIQ */
.g7-btn-solid { background: ${T.accent}; color: #FFFFFF; box-shadow: 0 8px 22px -6px rgba(201,84,44,.45); }
.g7-btn-solid:hover:not(:disabled) { background: #B4471F; }

/* Savol -- 3-sinfdagidek AKSENT PILYULYASI, markazda */
.g7-qpill {
  align-self: center;
  max-width: min(100%, 640px);
  padding: 6px 16px;
  border-radius: 999px;
  background: ${T.accentSoft};
  color: ${T.accent};
  font-family: 'Source Serif 4', Georgia, serif;
  font-weight: 700;
  font-size: clamp(16px, 2.1vw, 20px);
  line-height: 1.3;
  text-align: center;
  flex-shrink: 0;
}
/* Variantlar butun kenglikka cho'zilmasin -- 3-sinfdagidek ixcham */
.g7-options { max-width: min(100%, 760px); margin-inline: auto; width: 100%; }

/* Sahna 3-sinfdagidek OQ KARTOCHKA ustida turadi (.frame naqshi) */
.g7-scene {
  background: ${T.paper};
  border-radius: 16px;
  box-shadow: 0 8px 22px -8px rgba(${T.shadow},.16);
  padding: 6px 10px;
}
/* Xuk va tushuntirishda matn markazda -- chap va markaz aralashmasin */
/* Izoh CHAPDA: ekranda hamma narsa chapdan boshlanadi, markazlangan
   satr «suzib yurgandek» ko'rinardi (2026-08-10 suratlar). */
.g7-hint { text-align: left; }

/* ============================================================
   ZONALAR (11-sinf tuzilishi). Ekran «hammasi markazda bitta ustun»
   emas, balki NOMLANGAN ZONALARGA bo'linadi: har zona -- kartochka,
   tepasida kichkina CAPS yorliq. Hamma narsa CHAP chetga tekislanadi.
   3-sinfdan olingani: tinch fon, yumshoq soya, ortiqcha bezak yo'q.
   ============================================================ */
.g7-zone {
  display: flex; flex-direction: column; gap: 5px;
  padding: clamp(6px, .9vw, 8px) clamp(10px, 1.6vw, 13px);
  border-radius: 14px;
  background: ${T.paper};
  box-shadow: 0 8px 22px -10px rgba(${T.shadow},.18);
  flex-shrink: 0;
}
.g7-zone-cap {
  align-self: flex-start;
  padding: 2px 9px;
  border-radius: 6px;
  background: ${T.accentSoft};
  color: ${T.accent};
  font-family: 'Manrope', sans-serif;
  font-size: clamp(10.5px, 1.3vw, 12px);
  font-weight: 700; letter-spacing: .13em; text-transform: uppercase;
}
/* ============================================================
   BITTA MARKAZLASHGAN USTUN (metodist qoidasi 2026-08-14).
   Sarlavha, savol va sahna BIR XIL kenglikda va BIR XIL o'qda turadi:
   ilgari sahna 1160px, savol zonasi 780px, sarlavha esa chap chetdan
   boshlanardi -- uchta har xil chekka, ko'z ular orasida sakrardi
   (metodist surati).
   Uzun savol shu kenglikda ikki satrga BO'LINADI -- bu ham qoida:
   satr cho'zilib ketmasin.
   ============================================================ */
/* Savol endi markazdagi pilyulya emas, ZONA YORLIG'I ostidagi matn */
.g7-qpill {
  align-self: stretch;
  max-width: none;
  padding: 0;
  border-radius: 0;
  background: transparent;
  color: ${T.ink};
  font-family: 'Manrope', sans-serif;
  font-weight: 700;
  /* Interfeys shrifti (texnik topshiriq: Manrope 15-18). Formula mono
     bo'lgani uchun savolni ham serif qilib qo'ysak, kadrda uch shrift
     bo'lardi. */
  font-size: clamp(16px, 2.2vw, 19px);
  line-height: 1.3;
  text-align: left;
}
/* Variantlar zonaning butun kengligida -- 11-sinfdagidek */
/* Variantlar butun kenglikka CHO'ZILMAYDI (metodist qoidasi 2026-08-14).
   Javob ko'pincha bitta son bo'ladi, tugma esa 1100px edi. Cheklov matnli
   variantlar uchun ham yetarli: 760px da ular bir satrga sig'adi. */
.g7-options { max-width: min(100%, 760px); margin-inline: auto; }
/* Savol zonasi ham: o'qish uchun qulay satr uzunligi taxminan shu. */
/* Kenglik SOBIT: width berilmasa zona kontent bo'yicha siqilardi va
   sahna bilan chekkalari MOS KELMASDI (metodist surati 2026-08-14). */
.g7-zone { max-width: min(100%, 880px); width: 100%; margin-inline: auto; }
/* Sahna kartochkasi: kengligi BALANDLIK budjetidan hisoblanadi (3-sinf naqshi).
   Agar kenglik 100 foiz qilib qo'yilsa, aspect-ratio balandlikni 322px ga
   ko'taradi va slayd yorilib ketadi -- shu xatoga bir marta tushdim.
   (STYLES ichida BACKTICK ishlatib bo'lmaydi.) */
.g7-scene { max-width: 100%; margin-inline: auto; }

/* Zonasiz variant: kartochka yo'q, faqat ustun (xuk kabi bitta savolli ekranlar) */
.g7-nozone { display: flex; flex-direction: column; gap: 6px; flex-shrink: 0; }

/* Markazlash qoidalari SHU YERDA: zonalar bloki g7-qpill ni chapga
   tekislaydi, shuning uchun ular undan KEYIN turishi kerak. */
.g7-title { text-align: center; }
.g7-hint { text-align: center; }
.g7-tag { align-self: center; }
.g7-zone-cap { align-self: center; }
.g7-qpill { text-align: center; }
/* Sahna ham o'sha ustunda: chekkalari savol zonasi bilan bir xil bo'lsin.
   g7-hookscene o'z kengligini beradi, shuning uchun cheklov unga ham. */
.g7-scene { max-width: min(100%, 880px); }
.g7-hookscene { max-width: min(100%, 880px); }

/* ============================================================
   OQILONA KENGLIK (metodist qoidasi 2026-08-14).
   Element joy BOR degani uchun butun kenglikka cho'zilmaydi. Quti
   kengligi ICHIDAGI matn hajmiga mos bo'lishi kerak. Bo'sh joy MA'NO
   BLOKLARINI ajratadi, bitta elementning ichida vazifasiz turmaydi.

   Nega bu muhim: 12-ekranda yechim qatorlari 1100px kenglikda edi,
   yozuvning o'zi esa 150px joy egallardi -- qolgani bo'sh oq maydon,
   va ko'z qatorni yozuvdan uzoqda izlardi (metodist surati).

   O'lchamlar SOBIT: fit-content qator uzunligi o'zgarganda qutini
   sakratardi (Transform da har qadamda, AuditRows da yig'ilishda).
   ============================================================ */
/* Ustun: asbobning HAMMA qismi bitta cheklangan ustunda tursin --
   topshiriq, quti, javob bo'laklari, tugmalar. Ilgari ular alohida
   cheklanardi va bir-biridan uzoqlashib ketardi. */
.g7-col { display: flex; flex-direction: column; gap: clamp(6px, 1.1vh, 13px); min-width: 0; }
.g7-fit { max-width: min(100%, 560px); margin-inline: auto; width: 100%; }
.g7-fit-md { max-width: min(100%, 660px); margin-inline: auto; width: 100%; }
.g7-fit-lg { max-width: min(100%, 760px); margin-inline: auto; width: 100%; }

/* TOPSHIRIQ E'LONI (Ask). Kartochkali shakl -- 4, 9, 11 va 13-ekrandagi
   bilan bir xil, ya'ni o'quvchi uni allaqachon tanigan joyda ko'radi. */
.g7-ask-card { gap: 4px; padding-bottom: 6px; }
/* Tor shakl: yorliq va gap BITTA satrda, oq kartochkasiz. Balandlik
   budjeti tor ekranlarda ishlatiladi -- kartochka o'rniga bir satr. */
.g7-ask-row {
  display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap;
  margin: 0; text-align: left; flex-shrink: 0;
  /* O'lcham SHU YERDA qayta beriladi: umumiy .g7-ask telefonda 13px ga
     tushadi, topshiriq esa o'qilishi SHART -- metodist brifi 15-18. */
  font-size: clamp(15px, 1.9vw, 17.5px);
  line-height: 1.35;
}
.g7-ask-row > span:last-child { min-width: 0; flex: 1; }
/* Topshiriq satri ham MARKAZDA -- sarlavha va savol bilan bir o'qda
   (metodist 2026-08-14). Bu qoidalar g7-ask-row ning ASOSIY ta'rifidan
   KEYIN turishi shart: u yerda text-align left va flex 1 bor. */
.g7-ask-row { justify-content: center; text-align: center; }
.g7-ask-row > span:last-child { flex: 0 1 auto; }

/* Konteynerning old paneli YONGA suriladi (aylanmaydi) */
.g7-panel-slide { transition: transform .6s cubic-bezier(.33,0,.2,1), opacity .5s ease .15s; }
@media (prefers-reduced-motion: reduce) { .g7-panel-slide { transition: none; } }

/* Konteynerlar stansiyaga CHAPDAN uchib kelib ulanadi -- darsning kirish kadri.
   Sekin tormozlanadi, oxirida yengil to'xtash bor. */
.g7-dock {
  transition: transform .85s cubic-bezier(.16, .84, .28, 1), opacity .5s ease;
}
/* Yulduz changi: fon jonli bo'lsin, lekin diqqatni tortmasin */
.g7-dust { position: absolute; inset: 0; pointer-events: none; overflow: hidden; border-radius: inherit; }
.g7-dust i {
  position: absolute; width: 3px; height: 3px; border-radius: 50%;
  background: rgba(23,26,29,.18);
  animation: g7-drift linear infinite;
}
@keyframes g7-drift {
  from { transform: translate3d(0, 0, 0); opacity: 0; }
  12%  { opacity: .9; }
  88%  { opacity: .9; }
  to   { transform: translate3d(-120px, -22px, 0); opacity: 0; }
}
/* Formula posimvol yig'iladi: har bo'lak o'z navbatida chiqadi */
.g7-build span { opacity: 0; animation: g7-in .3s ease-out forwards; }

/* YUZA MODELI (PlotScene). Kenglik o'sishi -- SVG geometriya xossasi:
   uni CSS o'tishi bilan jonlantirsa bo'ladi. Qo'llab-quvvatlanmasa
   sakrab o'zgaradi, ya'ni buzilmaydi. transform ISHLATILMAYDI: SVG da px
   bilan berilgan transform-origin masshtabda buziladi (bir marta tushdik). */
.g7-plot-grow { transition: width .62s cubic-bezier(.3, 0, .2, 1); }
.g7-plot-shift { transition: transform .62s cubic-bezier(.3, 0, .2, 1); }
/* Mini-rolik sahnasi. Bu ekranda boshqa hech nima yo'q (sarlavha, chizma,
   izoh, nuqtalar), shuning uchun chizma UMUMIY sahnadan yirikroq bo'lishi
   mumkin: 5-slaydda 180px bo'sh joy o'lchandi. */
.g7-scene-clip { width: min(100%, calc(clamp(110px, calc(100dvh - 440px), 235px) * 620 / 170)); }
.g7-plot-part { transition: transform .5s cubic-bezier(.3, 0, .2, 1); }
.g7-plot-seam { transition: opacity .4s ease, stroke .3s ease; }
.g7-plot-cell { transition: opacity .2s ease; }
.g7-plot-num  { transition: opacity .45s ease .3s; }

@media (prefers-reduced-motion: reduce) {
  .g7-plot-grow, .g7-plot-part, .g7-plot-cell, .g7-plot-num { transition: none; }
}

@media (prefers-reduced-motion: reduce) {
  .g7-dock { transition: none; }
  .g7-dust i { animation: none; opacity: .5; }
  .g7-build span { opacity: 1; animation: none; }
}

/* Savolga o'tganda sahna KICHRAYADI -- joy javob variantlariga beriladi
   (5-sinf xukida diagramma 300 dan 180 ga tushgani kabi). */
.g7-scene { transition: width .55s cubic-bezier(.4,0,.2,1); }
/* Savol paytidagi sahna. 512 -- javob berilgach izoh chiqadigan LAHZAda
   (izoh chiqdi, tanlanmagan uchtasi hali yig'ilmagan) sig'adigan chegara. */
.g7-scene-sm { width: min(100%, calc(clamp(78px, calc(100dvh - 540px), 150px) * 620 / 170)); }
@media (prefers-reduced-motion: reduce) { .g7-scene { transition: none; } }

/* ============================================================
   XUK KADRI -- 5-sinf Dars01 naqshi (metodist tanlovi 2026-08-10).
   Kompozitsiya: aksent yorliq -> YIRIK sarlavha -> bir qator izoh ->
   BUTUN EKRANNI EGALLAGAN oq kartochka -> uning ostida YIRIK yozuv.
   Kino fazasida hammasi VERTIKAL MARKAZDA turadi.
   ============================================================ */
.g7-hook { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: clamp(6px, 1.2vw, 11px); min-height: 0; }
.g7-hook-eyebrow {
  font-family: 'Manrope', sans-serif;
  font-size: clamp(11px, 1.3vw, 12.5px); font-weight: 700;
  letter-spacing: .16em; text-transform: uppercase; color: ${T.accent};
}
.g7-title-hero {
  font-family: 'Source Serif 4', Georgia, serif;
  font-weight: 600; line-height: 1.1; letter-spacing: -.014em;
  font-size: clamp(20px, 3.9vw, 33px);
  text-wrap: balance;
}
/* Sahna QAHRAMON o'lchamida: 5-sinfdagi kartochka kabi kadrni egallaydi */
/* 386 -- bu shunchaki son emas: xukning eng to'la lahzasi (sarlavha, motiv,
   sahna, uzun yozuv, qisqa yozuv) noutbukda AYNAN shu budjetga sig'adi.
   364 da uzbekcha qisqa yozuv ikki qatorga tushib, ekran oshib ketardi. */
.g7-scene-hero { width: min(100%, calc(clamp(124px, calc(100dvh - 386px), 300px) * 620 / 170)); }
/* Yozuv -- 5-sinfdagi YIRIK son o'rnida: darsning ma'no yakuni */
.g7-hero-expr {
  font-family: 'Source Serif 4', Georgia, serif;
  font-weight: 600; letter-spacing: .01em; text-align: center;
  color: ${T.accent};
  font-size: clamp(24px, 5.4vw, 46px);
  transition: font-size .5s cubic-bezier(.4,0,.2,1);
}
.g7-hero-expr-sm { font-size: clamp(19px, 2.7vw, 24px); }

/* Sanalayotgan konteyner YORITILADI, qolganlari so'nadi */
.g7-crate { transition: opacity .45s ease; }
.g7-lit { filter: drop-shadow(0 0 10px rgba(201,84,44,.45)); }
/* Uzun yozuv bo'lakma-bo'lak yig'iladi */
/* Chizma ostidagi yozuv: kichik izoh, ostida yirik ifoda. Bitta slot --
   javobdan keyin ichi almashadi, balandlik esa o'zgarmaydi. */
.g7-plotline {
  display: flex; flex-direction: column; align-items: center; gap: 1px;
  animation: g7-in .42s ease-out both;
}
.g7-plotcap {
  font-family: 'Manrope', sans-serif;
  font-size: clamp(12.5px, 1.5vw, 14px);
  color: ${T.ink2};
}
@media (prefers-reduced-motion: reduce) { .g7-plotline { animation: none; } }

/* ============================================================
   UCH YANGI ASBOB: StepOrder, BracketGap, RuleBuilder (2026-08-13)
   Yozuvning O'ZI bosiladigan yuzaga aylanadi -- 4-sinfdagi kabi,
   u yerda o'quvchi ajratgichni sonning ICHIGA qo'yardi.
   ============================================================ */

/* Yozuv qatori: sonlar va bosiladigan amal belgilari. 390 da o'ralib
   tushadi -- bitta qatorda turishga majburlash CHETGA CHIQARADI. */
.g7-so-row {
  display: flex; flex-wrap: wrap; align-items: center; justify-content: center;
  gap: 2px 4px;
  font-family: ${MATH_FONT}; font-weight: 700;
  font-size: var(--g7-num);
  color: ${T.ink};
  min-width: 0;
}
.g7-so-val { padding: 0 2px; font-variant-numeric: tabular-nums lining-nums; border-radius: 7px; transition: background .18s ease, color .18s ease; }
/* Amal ustiga sichqoncha kelganda uning IKKI SONI yoritiladi: amal nimani
   biriktirishini ko'rsatadi, tartibni AYTMAYDI. */
.g7-so-val.is-lit { background: ${T.accentSoft}; color: ${T.accent}; }
.g7-so-sign { line-height: 1; }
/* BOSQICH RANGI. Bitta rang ikkala usulni bog'laydi: 4-ekranda ham,
   5-ekranda ham, 8-ekrandagi qonunda ham bir xil. */
.g7-so-sign.is-s2, .g7-film-tok.is-s2, .g7-track-expr .is-s2 { color: ${T.stage2}; }
.g7-so-sign.is-s1, .g7-film-tok.is-s1, .g7-track-expr .is-s1 { color: ${T.stage1}; }
.g7-so-op.is-s2 { border-color: ${T.stage2}; background: ${T.stage2Soft}; }
.g7-so-op.is-s1 { border-color: ${T.stage1}; background: ${T.stage1Soft}; }
/* Bosqich rangi HAR QANDAY yozuvda (Fx). Bitta joyda e'lon qilingan, ya'ni
   yozuv qayerda chizilsa ham bir xil gapiradi: sahnada, kartochkada,
   blitsda, yakunda. */
.g7-tf-tok.is-s2 { color: ${T.stage2}; }
.g7-tf-tok.is-s1 { color: ${T.stage1}; }
.g7-op2 { color: ${T.stage2}; }
.g7-op1 { color: ${T.stage1}; }
.g7-par { color: ${T.graph}; }
/* O'tgan qatorlar: daftardagi yuqori qatorlar kabi -- kichikroq va
   xiraroq, ish esa PASTDAGI joriy qatorda ketadi. Busiz panel har qadamda
   o'sardi va 5-ekran 65px oshib ketardi (o'lchov 2026-08-14). */
/* O'tgan qatorlar KICHRAYMAYDI (metodist qarori 2026-08-14): yozuv
   qayerda bo'lsa ham bitta o'lchamda. Faqat rangi xiraroq -- ish
   pastdagi qatorda ketayotgani shundan ko'rinadi. */
.g7-tf-past {
  min-height: 32px;
  font-size: var(--g7-num);
  color: ${T.ink2};
}
/* Joriy qator o'tganlaridan yirikroq, lekin 30px emas: besh qator birga
   488px budjetiga sig'ishi kerak. */
.g7-tf-live { font-size: var(--g7-num); }
/* Javob soni yozuvga kelib tushadi (ProbeChain). */
.g7-probe-val { margin-left: .35em; color: ${T.ok}; font-weight: 800; }
/* O'SHA qo'l yozuvi qayta yozish asbobida ham: juft qo'shiladi, keyin
   yangi qator keladi. Belgi juft bilan birga so'nadi. */
.g7-tf-tok.is-mergeL, .g7-tf-op.is-mergeL { animation: g7-mergeL 420ms cubic-bezier(.33,0,.2,1) both; }
.g7-tf-tok.is-mergeR, .g7-tf-op.is-mergeR { animation: g7-mergeR 420ms cubic-bezier(.33,0,.2,1) both; }
.g7-tf-tok.is-mergeOp, .g7-tf-op.is-mergeOp { animation: g7-mergeOp 420ms cubic-bezier(.33,0,.2,1) both; }
@keyframes g7-mergeOp {
  from { transform: none; opacity: 1; }
  to { transform: translateY(4px) scale(.7); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .g7-tf-tok.is-mergeL, .g7-tf-tok.is-mergeR, .g7-tf-tok.is-mergeOp,
  .g7-tf-op.is-mergeL, .g7-tf-op.is-mergeR, .g7-tf-op.is-mergeOp { animation-duration: .01ms; }
}
.g7-so-sign-flat { padding: 0 2px; color: ${T.ink2}; }

/* Amal belgisi -- tugma. Ustida navbat raqami uchun joy DOIM band:
   raqam paydo bo'lganda qator SILJIMAYDI. */
.g7-so-op {
  position: relative;
  display: inline-flex; flex-direction: column; align-items: center; justify-content: flex-end;
  min-width: 44px; min-height: 52px; padding: 0 4px 2px;
  border: 1px dashed ${T.line}; border-radius: 11px;
  background: rgba(255,253,248,.6);
  font: inherit; color: inherit; cursor: pointer;
  transition: background .2s ease, box-shadow .2s ease, border-color .2s ease;
}
.g7-so-op:hover:not(:disabled) { background: ${T.accentSoft}; border-color: ${T.accent}; }
.g7-so-op:disabled { cursor: default; }
.g7-so-op.is-set { border-style: solid; border-color: ${T.accent}; background: ${T.accentSoft}; }
.g7-so-num {
  display: block; min-height: 15px;
  font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 800;
  line-height: 15px; color: ${T.accent};
}

/* Ikki natija yonma-yon. Ikkinchi qator -- qoida bo'yicha, u YASHIL. */
.g7-so-out { display: flex; flex-direction: column; gap: 4px; width: 100%; }
.g7-so-out-row {
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
  padding: 5px 12px; border-radius: 11px;
  background: ${T.tipSoft};
}
.g7-so-out-row.is-rule { background: ${T.okSoft}; }
.g7-so-out-cap {
  min-width: 0; flex: 1; overflow-wrap: anywhere;
  font-family: 'Manrope', sans-serif; font-size: clamp(14.5px, 1.75vw, 17px);
  color: ${T.ink2};
}
.g7-so-out-val {
  flex-shrink: 0;
  font-family: ${MATH_FONT}; font-weight: 800;
  font-size: var(--g7-num); color: ${T.tip};
  font-variant-numeric: tabular-nums lining-nums;
}
.g7-so-out-row.is-rule .g7-so-out-val { color: ${T.ok}; }

/* Qavs qo'yiladigan tirqish. Nuqta -- «bu yerga qo'yish mumkin» belgisi. */
.g7-brgap-slot {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 26px; min-height: 44px; padding: 0;
  border: 0; background: none; cursor: pointer;
  font: inherit; color: ${T.ink3};
  transition: color .2s ease, transform .2s ease,
              min-width .24s ease, width .24s ease, margin .24s ease, opacity .18s ease;
}
/* Tirqish KERAK EMAS -- joy ham egallamaydi. 26px lik bo'sh tugma yozuvni
   uzib qo'yardi (metodist surati 2026-08-14). */
.g7-brgap-slot.is-idle {
  min-width: 0; width: 0; margin-inline: -2px;
  opacity: 0; overflow: hidden; pointer-events: none;
}
.g7-brgap-slot:hover:not(:disabled) { color: ${T.accent}; }
.g7-brgap-slot:disabled { cursor: default; opacity: .35; }
.g7-brgap-slot.is-open { color: ${T.accent}; font-weight: 800; }
/* Bo'sh tirqishdagi qavs XIRA: u taklif, hali qo'yilgan qavs emas.
   Nuqta bu yerda turolmaydi -- u KO'PAYTIRISH belgisi bilan bir xil edi. */
.g7-brgap-slot.is-hint:not(.is-open):not(.is-close) { color: rgba(231,90,44,.42); }
/* Yopish MUMKIN bo'lgan tirqishlar: ular ham to'q sariq, ya'ni bosiladigan
   ekani KO'RINADI. */
.g7-brgap-slot.is-close { color: ${T.accent}; opacity: .72; }
.g7-brgap-slot.is-close:hover:not(:disabled) { opacity: 1; }
/* BOSISH NISHONI. Nuqta juda kichkina edi -- o'quvchi qayerga bosishni
   ko'rmasdi (metodist surati 2026-08-13). Endi tirqish KO'RINADIGAN ramka
   bo'ladi va besh marta chaqnaydi.
   Pulsatsiya CHEKSIZ EMAS: metodist qarori -- ramka element ICHIDA, besh
   chaqnash, harakatdan keyin o'chadi. Bu yerda u o'chadi, chunki is-hint
   klass qavs qo'yilishi bilan olib tashlanadi. */
.g7-brgap-slot.is-hint {
  border: 1.5px dashed ${T.accent};
  border-radius: 9px;
  background: ${T.accentSoft};
  animation: g7-tapbeat 1.15s ease-in-out 5;
}
.g7-brgap-slot.is-hint:hover:not(:disabled) { background: ${T.accent}; color: #fff; }
@keyframes g7-tapbeat {
  0%, 100% { box-shadow: 0 0 0 0 rgba(231,90,44,0); }
  45% { box-shadow: 0 0 0 5px rgba(231,90,44,.22); }
}
@media (prefers-reduced-motion: reduce) { .g7-brgap-slot.is-hint { animation: none; } }

/* RuleBuilder: yig'ilgan qator va bo'laklar hovuzi. */
.g7-rb-built {
  display: flex; flex-wrap: wrap; align-items: center; gap: 6px;
  min-height: 62px;
}
.g7-rb-empty { color: ${T.ink3}; font-size: 20px; }
/* Tortish FAQAT sichqonchada: is-drag klassini asbob qoyadi. Telefonda bu
   klass umuman chiqmaydi, ya'ni jest skroll bilan raqobatga kirmaydi. */
.g7-rb-built.is-drag { border: 1.5px dashed ${T.line}; transition: box-shadow .18s ease, background .18s ease; }
.g7-rb-built.is-over { box-shadow: inset 0 0 0 2px ${T.accent}; background: ${T.accentSoft}; }
.g7-rb-built.is-drag .g7-rb-chip { cursor: grab; }
.g7-rb-built.is-drag .g7-rb-chip:active { cursor: grabbing; }
.g7-rb-pool { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
.g7-rb-chip {
  display: inline-flex; align-items: center; gap: 6px;
  min-height: 44px; padding: 7px 13px;
  border: 0; border-radius: 12px;
  background: ${T.paperSolid};
  box-shadow: inset 0 0 0 1px ${T.line};
  font-family: 'Manrope', sans-serif;
  font-size: clamp(12.5px, 1.5vw, 14.5px); font-weight: 600;
  color: ${T.ink}; text-align: left; cursor: pointer;
  /* Uzun o'zbekcha bo'lak tugmadan CHIQIB KETMASIN (§9.1, 390 dagi kamchilik) */
  min-width: 0; overflow-wrap: anywhere;
  transition: box-shadow .2s ease, background .2s ease;
}
.g7-rb-chip:hover:not(:disabled) { box-shadow: inset 0 0 0 1px ${T.accent}; }
.g7-rb-chip:disabled { cursor: default; opacity: .32; }
.g7-rb-chip.is-built { background: ${T.graphSoft}; box-shadow: inset 0 0 0 1px rgba(18,110,115,.28); opacity: 1; }
.g7-rb-no {
  flex-shrink: 0;
  min-width: 18px; height: 18px; border-radius: 50%;
  display: inline-flex; align-items: center; justify-content: center;
  background: ${T.graph}; color: #fff; font-size: 11px; font-weight: 800;
}

/* Yakun: yorliq va matn BITTA qatorda. */
.g7-sumrow {
  display: flex; align-items: flex-start; gap: 8px; min-width: 0;
  font-size: clamp(14px, 1.8vw, 16.5px); line-height: 1.34; color: ${T.ink2};
}
/* Yorliq QISQARMAYDI. Unda white-space nowrap turadi, flex element esa sukut
   bo'yicha qisqaradi va min-width 0 ga tushadi: quti o'z matnidan tor bo'lib
   qoladi, matn fondan CHIQIB ketadi va yonidagi matnga MINADI (metodist
   surati 2026-08-13, «QANDAY CHIQDI»).
   DIQQAT: bu satrlar STYLES shablon-satri ICHIDA. Teskari apostrof qo'yish
   shablonni YOPADI va butun fayl buziladi -- shuning uchun bu yerda ular
   umuman ishlatilmaydi. */
.g7-sumrow > .g7-tag { flex-shrink: 0; }
.g7-sumrow > span { min-width: 0; overflow-wrap: anywhere; }

/* ============================================================
   CollapseFilm -- tushuntirish kadrlari. Ikki son BIR-BIRIGA siljiydi va
   bitta songa aylanadi. Faqat transform o'zgaradi: kenglik o'zgarmaydi,
   shuning uchun 390 da yozuv kesilmaydi (§6.2).
   ============================================================ */
.g7-film { display: flex; align-items: center; justify-content: center; min-height: 74px; }
.g7-film-row {
  display: flex; flex-wrap: wrap; align-items: center; justify-content: center;
  gap: 2px 8px; min-width: 0;
  font-family: ${MATH_FONT}; font-weight: 700;
  font-size: clamp(22px, 3vw, 34px); color: ${T.ink};
  font-variant-numeric: tabular-nums lining-nums;
}
.g7-film-tok { display: inline-block; will-change: transform; }
/* 420 ms -- yozuvning O'ZIDAGI javob harakati uchun belgilangan vaqt (§7.1). */
.g7-film-tok.is-mergeL { animation: g7-mergeL 420ms cubic-bezier(.33,0,.2,1) both; }
.g7-film-tok.is-mergeR { animation: g7-mergeR 420ms cubic-bezier(.33,0,.2,1) both; }
.g7-film-tok.is-born {
  animation: g7-born 420ms cubic-bezier(.33,0,.2,1) both;
  color: ${T.accent};
}
/* CHUQURLIK VA OG'IRLIK (metodist qarori 2026-08-13). Juft bir-biriga
   siljiganda u CHO'KADI: pastga tushadi, kichrayadi va so'nadi. Natija esa
   PRUJINA bilan QALQIB chiqadi va soya tashlaydi. Perspektiva YO'Q -- yozuv
   qiyshaymaydi va o'qilishi buzilmaydi (PODXOD_7SINF.md §10, «daftardagidek»). */
@keyframes g7-mergeL {
  from { transform: none; opacity: 1; }
  to { transform: translateX(.62em) translateY(4px) scale(.86); opacity: .18; }
}
@keyframes g7-mergeR {
  from { transform: none; opacity: 1; }
  to { transform: translateX(-.62em) translateY(4px) scale(.86); opacity: .18; }
}
@keyframes g7-born {
  0% { transform: translateY(10px) scale(.5); opacity: 0; text-shadow: none; }
  62% { transform: translateY(-3px) scale(1.09); opacity: 1; text-shadow: 0 6px 12px rgba(24,34,36,.20); }
  100% { transform: none; opacity: 1; text-shadow: 0 2px 5px rgba(24,34,36,.13); }
}
.g7-film-cap {
  margin: 0; text-align: center;
  font-family: 'Manrope', sans-serif;
  font-size: clamp(15px, 1.9vw, 19px); line-height: 1.34; color: ${T.ink2};
  /* Proza MONOSHRIFT emas va nowrap emas: aks holda chetga chiqib yo'qoladi (§6.2) */
  white-space: normal; overflow-wrap: anywhere;
  animation: g7-in .34s ease-out both;
}
@media (prefers-reduced-motion: reduce) {
  .g7-film-tok.is-mergeL, .g7-film-tok.is-mergeR, .g7-film-tok.is-born, .g7-film-cap {
    animation-duration: .01ms;
  }
}

/* YO'LAK: yozuv o'zi yig'iladi. Ikkitasi yonma-yon ketadi va AJRALADI. */
.g7-track-row {
  display: flex; align-items: center; gap: 10px; min-width: 0;
  padding: 5px 12px; border-radius: 11px;
  background: rgba(23,26,29,.04);
  transition: background .4s ease;
}
.g7-track-row.is-tip { background: ${T.tipSoft}; }
.g7-track-row.is-ok { background: ${T.okSoft}; }
.g7-track-cap {
  flex: 0 0 auto; max-width: 44%;
  font-family: 'Manrope', sans-serif;
  font-size: clamp(14.5px, 1.75vw, 17px); color: ${T.ink2};
  min-width: 0; overflow-wrap: anywhere;
}
.g7-track-expr {
  flex: 1; min-width: 0;
  display: flex; flex-wrap: wrap; align-items: center; justify-content: flex-end; gap: 1px 6px;
  font-family: ${MATH_FONT}; font-weight: 800;
  font-size: var(--g7-num);
  font-variant-numeric: tabular-nums lining-nums;
  color: ${T.ink};
}
.g7-track-row.is-tip .g7-track-expr { color: ${T.tip}; }
.g7-track-row.is-ok .g7-track-expr { color: ${T.ok}; }
/* Yig'ilib bo'lgach qolgan yagona son bir pog'ona yiriklashadi: ikki
   yo'lakning FARQI ko'zga tashlanishi kerak. */
.g7-track-row.is-done .g7-track-expr { font-size: var(--g7-num); }

/* ============================================================
   XUK SAHNASI: yozuv lentadan ikkala mashinaga ketadi, sonlar ajraladi.
   Rasm fayli yo'q -- faqat SVG va CSS. Personaj yo'q (§7.4).
   ============================================================ */
/* Sahna kengligi BOSHQA ekranlardagi panel bilan BIR XIL: metodist 2026-08-13
   da xuk paneli torroq ekanini belgilab ko'rsatdi. Endi u ham ish zonasining
   butun kengligini oladi, balandligi esa nisbat bo'yicha chiqadi. */
.g7-hookscene { width: 100%; aspect-ratio: 620 / 176; max-height: clamp(150px, 30vh, 250px); margin-inline: auto; }
.g7-hk-tape { fill: ${T.paperSolid}; stroke: ${T.line}; stroke-width: 1; }
.g7-hk-tok {
  font-family: ${MATH_FONT}; font-weight: 800; font-size: 25px; fill: ${T.ink};
  animation: g7-hk-drop .38s cubic-bezier(.33,0,.2,1) both;
}
.g7-hk-wire {
  fill: none; stroke: ${T.graph}; stroke-width: 2.4; stroke-linecap: round;
  stroke-dasharray: 120; stroke-dashoffset: 120;
  animation: g7-hk-draw .5s ease-out both;
}
/* Kabel bo'ylab IMPULS yuguradi: yozuv mashinaga uzluksiz ketayotgandek.
   Bu «kutish pulsatsiyasi» (§7.1 ruxsat beradi), matematik holat emas --
   shuning uchun u hech nimani aytmaydi va aldamaydi. */
.g7-hk-pulse {
  fill: none; stroke: ${T.accent}; stroke-width: 3.4; stroke-linecap: round;
  stroke-dasharray: 8 112;
  animation: g7-hk-run 1.9s linear infinite;
}
/* Mashinalar OG'IR: soya tashlaydi va pastdan ko'tarilib joyiga tushadi. */
.g7-hk-dev { animation: g7-hk-rise .52s cubic-bezier(.22,.9,.3,1.06) both; filter: drop-shadow(0 8px 12px rgba(24,34,36,.16)); }
.g7-hk-body { fill: ${T.paperSolid}; stroke: ${T.line}; stroke-width: 1; }
/* Ekranning yuqori qirrasida BLIK: shisha yuza sezilsin */
/* LCD: to'q kulrang-yashil maydon. Segmentlar unda YONADI, o'chganlari esa
   xira ko'rinib turadi -- haqiqiy kalkulyatordagidek. */
.g7-hk-lcd { fill: #23312F; }
.g7-hk-gloss { fill: #fff; opacity: .09; }
/* Kalkulyator raqamining SEGMENTI. Nomi g7-lcdseg -- yuqori paneldagi
   g7-seg (progress bo'laklari) bilan URISHMASLIGI uchun: telefon
   uslublarida u nom display none bilan yopiladi va raqamlar ham
   ko'rinmay qolardi (o'lchov 2026-08-14, 860px dan pastda). */
.g7-lcdseg { fill: #3C4F4B; transition: fill .2s ease; }
.g7-lcdseg.is-on { fill: #8FF3C6; filter: drop-shadow(0 0 3px rgba(143,243,198,.55)); }
.g7-hk-keys rect { fill: #E7E2D8; stroke: rgba(24,34,36,.14); stroke-width: 1; }
.g7-hk-num { transform-box: fill-box; transform-origin: center; animation: g7-hk-pop .42s cubic-bezier(.33,0,.2,1) both; }
/* Kiritish kursori: son chiqquncha miltillaydi, keyin butunlay so'nadi. */
.g7-hk-cur { fill: #8FF3C6; animation: g7-hk-caret 1.9s steps(1) both; }
@keyframes g7-hk-caret {
  0%, 14% { opacity: 0; }
  15%, 30% { opacity: .95; }
  31%, 46% { opacity: 0; }
  47%, 62% { opacity: .95; }
  63%, 100% { opacity: 0; }
}
@media (prefers-reduced-motion: reduce) { .g7-hk-cur { animation: none; opacity: 0; } }
/* Skaner TAKRORLANADI: mashina ishlab turgandek. Uzoq pauza bilan, aks holda
   u diqqatni javob variantlaridan tortib oladi. */
.g7-hk-scan { display: none; }
/* Ikkala son BIR XIL rangda: xukda hech biri to'g'ri deb belgilanmaydi */
/* SVG da scale HOLST burchagidan hisoblanadi: transform-box bo'lmasa element
   chap yuqori burchakdan uchib keladi. Shuning uchun har bir kattalashadigan
   element o'z qutisiga bog'lanadi. */
.g7-hk-val {
  font-family: ${MATH_FONT}; font-weight: 800; font-size: 30px; fill: ${T.ink};
  transform-box: fill-box; transform-origin: center;
  animation: g7-hk-pop .42s cubic-bezier(.33,0,.2,1) both;
}
.g7-hk-cap {
  font-family: 'Manrope', sans-serif; font-size: 12.5px; font-weight: 600; fill: ${T.ink2};
}
/* Amal belgisi sahnada ham bosqich rangida. */
.g7-hk-tok.is-s2 { fill: ${T.stage2}; }
.g7-hk-tok.is-s1 { fill: ${T.stage1}; }
/* YAKUNDAGI INTERAKTIV: oddiy kalkulyator bosiladigan bo'ladi. */
.g7-hk-dev.is-fixable { cursor: pointer; }
.g7-hk-dev.is-fixable:hover .g7-hk-body, .g7-hk-dev.is-fixable:focus-visible .g7-hk-body { stroke: ${T.accent}; stroke-width: 2; }
.g7-hk-dev.is-fixable:focus-visible { outline: none; }
.g7-hk-tap {
  fill: none; stroke: ${T.accent}; stroke-width: 2; stroke-dasharray: 7 6;
  animation: g7-hk-tapbeat 1.15s ease-in-out 2.4s 5 both;
  opacity: 0;
}
@keyframes g7-hk-tapbeat {
  0%, 100% { opacity: .35; }
  45% { opacity: 1; }
}
@media (prefers-reduced-motion: reduce) { .g7-hk-tap { animation: none; opacity: .6; } }
.g7-hk-dev.is-fixed .g7-hk-body { stroke: ${T.ok}; stroke-width: 2; transition: stroke .5s ease; }
.g7-hk-ne.is-fixed circle { fill: ${T.okSoft}; stroke: ${T.ok}; }
.g7-hk-ne.is-fixed text { fill: ${T.ok}; }
/* Topshiriq satri sahna OSTIDA, oddiy matn bilan. */
.g7-hk-ask {
  display: flex; align-items: center; justify-content: center; gap: 7px;
  margin: 2px 0 0; min-height: 18px;
  font-family: 'Manrope', sans-serif; font-weight: 700;
  font-size: clamp(12.5px, 1.5vw, 14.5px); color: ${T.accent};
  animation: g7-in .34s ease 2.2s both;
}
.g7-hk-ask.is-done { color: ${T.ok}; animation: g7-in .34s ease both; }
.g7-hk-ask-dot {
  width: 7px; height: 7px; border-radius: 50%; background: ${T.accent};
  flex-shrink: 0; animation: g7-cta-pulse 1.9s ease-out 5;
}
@media (prefers-reduced-motion: reduce) { .g7-hk-ask-dot { animation: none; } }
.g7-hk-ne { transform-box: fill-box; transform-origin: center; animation: g7-hk-pop .42s cubic-bezier(.33,0,.2,1) both; }
.g7-hk-ne circle { fill: ${T.graphSoft}; stroke: ${T.graph}; stroke-width: 1.5; }
.g7-hk-ring { transform-box: fill-box; transform-origin: center; animation: g7-hk-breathe 2.6s ease-in-out 2.6s infinite; }
.g7-hk-ne text { font-family: ${MATH_FONT}; font-weight: 800; font-size: 21px; fill: ${T.graph}; }
/* Belgi tushadi va bir marta sakraydi -- og'irligi bordek */
@keyframes g7-hk-drop {
  0% { opacity: 0; transform: translateY(-14px); }
  70% { opacity: 1; transform: translateY(3px); }
  100% { opacity: 1; transform: none; }
}
@keyframes g7-hk-draw { to { stroke-dashoffset: 0; } }
@keyframes g7-hk-run { from { stroke-dashoffset: 120; } to { stroke-dashoffset: 0; } }
/* «Teng emas» halqasi sekin nafas oladi: sahna tirik, lekin diqqat tortmaydi */
@keyframes g7-hk-breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.07); }
}
@keyframes g7-hk-rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
/* Son PRUJINA bilan qalqib chiqadi va soya tashlaydi */
@keyframes g7-hk-pop {
  0% { opacity: 0; transform: translateY(8px) scale(.5); }
  60% { opacity: 1; transform: translateY(-3px) scale(1.12); }
  100% { opacity: 1; transform: none; }
}
/* Skaner ekran bo'ylab o'tadi va so'nadi: mashina «o'ylayapti» */
@keyframes g7-hk-scan {
  0% { transform: translateX(0); opacity: 0; }
  4% { opacity: .3; }
  30% { transform: translateX(130px); opacity: .3; }
  36% { transform: translateX(130px); opacity: 0; }
  100% { transform: translateX(130px); opacity: 0; }
}
/* Telefonda sahna 620 dan 360 ga siqiladi, ya'ni HAMMA narsa 0,58 barobar
   kichrayadi va yorliq 7px ga tushib O'QILMAY qoladi. O'lchamlar HOLST
   birligida berilgan, shuning uchun ularni aynan tor ekran uchun kattalashtirish
   mumkin: siqilgandan keyin ular yana o'qiladigan bo'ladi. */
@media (max-width: 640px) {
  .g7-hk-tok { font-size: 30px; }
  .g7-hk-val { font-size: 40px; }
  .g7-hk-cap { font-size: 19px; }
  .g7-hk-ne text { font-size: 26px; }
}
@media (prefers-reduced-motion: reduce) {
  .g7-hk-tok, .g7-hk-wire, .g7-hk-dev, .g7-hk-val, .g7-hk-ne { animation-duration: .01ms; }
  .g7-hk-scan { animation: none; opacity: 0; }
}

/* QONUN JONLANADI: qismlar birma-bir yonadi, so'ng chiziq chapdan o'ngga. */
.g7-lawrev {
  display: flex; flex-wrap: wrap; align-items: center; justify-content: center;
  gap: 4px clamp(6px, 1vw, 12px); min-width: 0;
}
.g7-lawrev-chip {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 46px; min-height: 34px; padding: 3px 12px;
  border-radius: 10px; background: ${T.accentSoft}; color: ${T.accent};
  font-family: ${MATH_FONT}; font-weight: 800;
  font-size: clamp(15px, 1.9vw, 20px);
  animation: g7-lawpop .42s cubic-bezier(.33,0,.2,1) both;
}
/* Qoida qismlari BOSQICH ranglarida: o'quvchi ularni yozuvlardan taniydi. */
.g7-lawrev-chip.is-s2 { background: ${T.stage2Soft}; color: ${T.stage2}; }
.g7-lawrev-chip.is-s1 { background: ${T.stage1Soft}; color: ${T.stage1}; }
.g7-lawrev-chip.is-par { background: ${T.graphSoft}; color: ${T.graph}; }
.g7-lawrev-chip.is-off { background: rgba(24,34,36,.05); color: ${T.ink3}; }
.g7-lawrev-arr {
  color: ${T.ink3}; font-weight: 700; font-size: clamp(13px, 1.6vw, 17px);
  animation: g7-in .3s ease-out both;
}
.g7-lawrev-sweep {
  position: relative; flex-basis: 100%; text-align: center; overflow: hidden;
  margin-top: 2px; padding: 3px 0;
  font-family: 'Manrope', sans-serif; font-weight: 600;
  font-size: clamp(11.5px, 1.4vw, 13.5px); color: ${T.graph};
  animation: g7-in .34s ease-out both;
}
.g7-lawrev-sweep::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(90deg, transparent, rgba(18,110,115,.22), transparent);
  transform: translateX(-100%);
  /* BESH marta, keyin to'xtaydi va chetga chiqib ketadi. Cheksiz
     harakat metodist qoidasiga zid, va u ekranda kulrang to'rtburchak
     bo'lib osilib qolardi (metodist surati 2026-08-14). */
  animation: g7-sweep 1.5s ease-in-out .3s 5 both;
}
@keyframes g7-lawpop { from { opacity: 0; transform: translateY(8px) scale(.9); } to { opacity: 1; transform: none; } }
@keyframes g7-sweep { to { transform: translateX(100%); } }
@media (prefers-reduced-motion: reduce) {
  .g7-lawrev-chip, .g7-lawrev-arr, .g7-lawrev-sweep { animation-duration: .01ms; }
  .g7-lawrev-sweep::after { animation: none; opacity: 0; }
}

/* ★ LAYFXAK. 3-sinfdagi «Bonus» qutisi naqshi: alohida ramka, yulduzcha,
   qisqa gap. Ekranning ENG PASTIDA turadi va matematikani takrorlamaydi --
   u mavzuni HAYOT bilan bog'laydi yoki tekshirish usulini beradi. */
.g7-hack {
  display: flex; align-items: flex-start; gap: 8px; min-width: 0;
  margin-top: auto;
  padding: 7px clamp(9px, 1.2vw, 13px);
  border-radius: 11px;
  background: #FFF6DC; box-shadow: inset 0 0 0 1px rgba(199,164,74,.42);
  animation: g7-in .34s ease-out both;
}
.g7-hack > b { flex-shrink: 0; color: #A5761A; font-size: 13px; line-height: 1.35; }
.g7-hack > span {
  min-width: 0; overflow-wrap: anywhere;
  font-family: 'Manrope', sans-serif;
  font-size: clamp(13.5px, 1.6vw, 15.5px); line-height: 1.34; color: ${T.ink};
}
@media (prefers-reduced-motion: reduce) { .g7-hack { animation: none; } }

/* YAKUN 6-sinf naqshida: banner, sahna, uch TENG kartochka. Bloklar kaskad
   bilan chiqadi: 0, 120, 240 ms. */
.g7-sumbanner {
  display: flex; align-items: center; gap: 10px; min-width: 0;
  padding: 7px clamp(10px, 1.3vw, 15px); border-radius: 12px;
  background: ${T.paperSolid}; box-shadow: inset 0 0 0 1px ${T.line};
  animation: g7-in .34s ease-out both;
}
.g7-sumbanner-tag {
  flex-shrink: 0; font-family: 'Manrope', sans-serif; font-weight: 800;
  font-size: clamp(9.5px, 1.1vw, 11px); letter-spacing: .16em;
  text-transform: uppercase; color: ${T.accent};
}
.g7-sumbanner-h {
  flex: 1; min-width: 0; overflow-wrap: anywhere; margin: 0;
  font-family: 'Source Serif 4', Georgia, serif; font-weight: 600;
  font-size: clamp(15px, 2vw, 21px); line-height: 1.1; color: ${T.ink};
}
.g7-sumbanner-gl { flex-shrink: 0; display: inline-flex; gap: 7px; }
.g7-sumbanner-gl i {
  font-family: ${MATH_FONT}; font-style: normal; font-weight: 800;
  font-size: clamp(13px, 1.5vw, 16px); color: ${T.ink3};
}
.g7-sumscene { animation: g7-in .34s ease-out .12s both; }
/* Sahna YAKUNDA endi INTERAKTIV: mashina bosiladi, ya'ni ko'rinishi kerak.
   O'lcham BALANDLIKKA bog'liq: past noutbukda kichrayadi. */
.g7-sumscene .g7-hookscene { max-height: clamp(96px, 17vh, 178px); }
@media (max-height: 660px) {
  .g7-sumscene .g7-hookscene { max-height: 122px; }
}
/* Metodist qarori 2026-08-13: yakun kontenti TIK turadi, yonma-yon emas. */
.g7-sumcards {
  /* IKKI USTUN. Metodist qarori 2026-08-14: kartochkalar yonma-yon tursin
     va shrift kattaroq bo'lsin. Bu 2026-08-13 dagi «yakun TIK» qarorini
     almashtiradi. Telefonda bitta ustun qoladi. */
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: start;
  gap: clamp(6px, 1vw, 12px); min-width: 0;
  animation: g7-in .34s ease-out .24s both;
}
/* Yakunda bitta kartochka qolganda u butun ustunni egallamaydi. */
.g7-sumcards-one { grid-template-columns: minmax(0, 1fr); }
.g7-sumcard {
  /* Yakun kartochkasi 2026-08-17 da ozgina ixchamlashdi: 6, 7, 8 va
     11-darslarda yakun 2 px oshib turgan (walker tuzatilgach ko'rindi). */
  display: flex; flex-direction: column; gap: 4px; min-width: 0;
  padding: 7px clamp(9px, 1.2vw, 13px); border-radius: 12px;
  background: ${T.paperSolid}; box-shadow: inset 0 0 0 1px ${T.line};
}
.g7-sumcard-h {
  margin: 0; font-family: 'Manrope', sans-serif; font-weight: 800;
  font-size: clamp(10.5px, 1.25vw, 12.5px); letter-spacing: .13em;
  text-transform: uppercase; color: ${T.accent};
}
.g7-sumcard-ul { margin: 0; padding-left: 15px; display: flex; flex-direction: column; gap: 1px; }
.g7-sumcard-ul li {
  min-width: 0; overflow-wrap: anywhere;
  font-family: 'Manrope', sans-serif;
  font-size: clamp(13.5px, 1.65vw, 16px); line-height: 1.38; color: ${T.ink};
}
.g7-sumcard-note {
  margin: 0; min-width: 0; overflow-wrap: anywhere;
  font-family: 'Manrope', sans-serif;
  font-size: clamp(13px, 1.55vw, 15px); line-height: 1.32; color: ${T.ink2};
}
/* Faol qator: amal belgisi TUGMA. Yozuvning o'zi bosiladigan yuzaga aylanadi,
   chipslar qatori endi umuman yo'q. */
/* Yozuv ramka MARKAZIDA turadi (metodist qarori 2026-08-13): u ekranning
   asosiy obyekti, chetga surilgan holda ikkinchi darajali ko'rinardi. */
.g7-tf-live { display: flex; flex-wrap: wrap; align-items: center; gap: 3px 8px; justify-content: center; }
.g7-tf-tok { transition: color .18s ease; }
.g7-tf-tok.is-lit { color: ${T.accent}; font-weight: 800; }
.g7-tf-op {
  min-width: 32px; min-height: 32px; padding: 0 7px;
  border: 1.5px dashed ${T.accent}; border-radius: 9px;
  background: ${T.accentSoft}; color: ${T.accent};
  font: inherit; font-weight: 800; cursor: pointer;
  transition: background .18s ease, color .18s ease;
}
.g7-tf-op:hover:not(:disabled) { background: ${T.accent}; color: #fff; }
.g7-tf-op.is-picked { border-style: solid; background: ${T.accent}; color: #fff; }
.g7-tf-op.is-hint { animation: g7-tapbeat 1.15s ease-in-out 5; }
@media (prefers-reduced-motion: reduce) { .g7-tf-op.is-hint { animation: none; } }

.g7-sumgap {
  margin: 2px 0 0; min-width: 0; overflow-wrap: anywhere;
  font-family: 'Manrope', sans-serif; font-weight: 600;
  font-size: clamp(12px, 1.4vw, 14px); line-height: 1.3; color: ${T.tip};
}
.g7-sumcard-note b { color: ${T.ink3}; font-weight: 800; font-size: .9em; text-transform: uppercase; letter-spacing: .06em; }
@media (max-width: 640px) {
  .g7-sumcards { grid-template-columns: 1fr; }
  /* Telefonda uch kartochka ustma-ust turadi va sahna 39px oshirib yuborardi
     (o'lchov 2026-08-13). Sahna YASHIRILMAYDI -- u darsni yopadigan zal --
     faqat pasaytiriladi. */
  /* Telefonda sahna endi BOSILADI -- juda kichkina bo'lolmaydi. */
  .g7-sumscene .g7-hookscene { max-height: clamp(104px, 17vh, 138px); }
  /* Banner telefonda BITTA qatorga sig'maydi: sarlavha pastga tushadi.
     Glifllar olib tashlanadi, ular bezak. */
  .g7-sumbanner { flex-wrap: wrap; gap: 4px 8px; }
  .g7-sumbanner-gl { display: none; }
  .g7-sumcards { gap: 5px; }
  .g7-sumcard { padding: 6px 10px; gap: 2px; }
}
@media (prefers-reduced-motion: reduce) { .g7-sumbanner, .g7-sumscene, .g7-sumcards { animation: none; } }

/* YAKUN 6-sinf naqshida: mavzu svodi. Uch TENG kartochka, so'ng bitta
   yozuvning ikki yo'li, so'ng «tayanadi / keyingi». */
.g7-sumbrief { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.g7-sumbrief-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(6px, 1vw, 12px); }
.g7-sumbrief-card {
  min-width: 0; overflow-wrap: anywhere;
  padding: 8px clamp(9px, 1.2vw, 13px); border-radius: 11px;
  background: ${T.paperSolid}; box-shadow: inset 0 0 0 1px ${T.line};
  font-family: 'Manrope', sans-serif; font-weight: 600;
  font-size: clamp(12.5px, 1.5vw, 14.5px); line-height: 1.3; color: ${T.ink};
}
.g7-sumtwo { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.g7-sumtwo-row { display: flex; flex-wrap: wrap; gap: 6px clamp(10px, 1.6vw, 20px); }
.g7-sumtwo-line {
  min-width: 0; overflow-wrap: anywhere;
  font-family: ${MATH_FONT}; font-weight: 700;
  font-size: clamp(15px, 1.9vw, 19px); color: ${T.ink};
  font-variant-numeric: tabular-nums lining-nums;
}
.g7-sumgap {
  margin: 2px 0 0; min-width: 0; overflow-wrap: anywhere;
  font-family: 'Manrope', sans-serif; font-weight: 600;
  font-size: clamp(12px, 1.4vw, 14px); line-height: 1.3; color: ${T.tip};
}
.g7-sumconn {
  display: flex; flex-wrap: wrap; gap: 4px clamp(12px, 2vw, 26px); min-width: 0;
  font-family: 'Manrope', sans-serif;
  font-size: clamp(12px, 1.4vw, 13.5px); line-height: 1.3; color: ${T.ink2};
}
.g7-sumconn b { color: ${T.ink3}; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; font-size: .88em; }
@media (max-width: 640px) { .g7-sumbrief-row { grid-template-columns: 1fr; } }

/* Qayta yozish qatori: yozuv chapda, o'qituvchi gapi o'ngda. 390 da ular
   ustma-ust tushadi -- yonma-yon sig'maydi. */
.g7-tf-row { display: flex; align-items: baseline; gap: clamp(8px, 1.4vw, 18px); min-width: 0; }
.g7-tf-row > .g7-expr { flex: 0 0 auto; }
.g7-tf-row > .g7-sol-say { flex: 1; min-width: 0; }
@media (max-width: 640px) { .g7-tf-row { flex-direction: column; gap: 0; } }

/* O'QITUVCHI YECHIMI: alohida ramkada, YIRIK yozuv, amallar rangli. */
.g7-sol { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.g7-sol-cap {
  font-family: 'Manrope', sans-serif; font-weight: 800;
  font-size: clamp(10.5px, 1.2vw, 12px); letter-spacing: .15em;
  text-transform: uppercase; color: ${T.accent}; margin-bottom: 3px;
}
.g7-sol-row {
  display: flex; align-items: baseline; gap: clamp(10px, 1.6vw, 22px); min-width: 0;
  padding: 3px 0;
  animation: g7-in .3s ease-out both;
}
.g7-sol-expr {
  flex: 0 0 auto; display: inline-flex; align-items: baseline; gap: .32em;
  font-family: ${MATH_FONT}; font-weight: 800;
  font-size: clamp(19px, 2.6vw, 28px); color: ${T.ink};
  font-variant-numeric: tabular-nums lining-nums;
}
/* Amal belgisi YIRIKROQ va rangli: ko'z avval unga tushadi. */
/* Bosqich RANGI ham bo'lishi kerak edi: ilgari bu yerda faqat o'lcham
   turardi, shuning uchun yechimda belgilar qora qolib ketgandi. */
.g7-sol-tok.is-s2 { font-size: 1.12em; color: ${T.stage2}; }
.g7-sol-tok.is-s1 { font-size: 1.12em; color: ${T.stage1}; }
.g7-sol-tok.is-par { color: ${T.accent}; font-size: 1.12em; }
.g7-sol-say {
  flex: 1; min-width: 0; overflow-wrap: anywhere;
  font-family: 'Manrope', sans-serif;
  font-size: clamp(12.5px, 1.5vw, 14.5px); line-height: 1.3; color: ${T.ink2};
}
@media (max-width: 640px) {
  .g7-sol-row { flex-direction: column; gap: 0; padding: 2px 0; }
  .g7-sol-expr { font-size: clamp(18px, 5.4vw, 24px); }
}
@media (prefers-reduced-motion: reduce) { .g7-sol-row { animation: none; } }

/* SON O'QI: ikki yo'l, ikki to'xtash joyi. */
.g7-nl { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.g7-nl-row { display: flex; flex-direction: column; gap: 1px; min-width: 0; min-height: 96px; }
.g7-nl { padding: 5px 7px; border-radius: 12px; }
.g7-nl.is-tappable { cursor: pointer; }
.g7-nl.is-tappable:focus-visible { outline: 2px solid ${T.accent}; outline-offset: 3px; }
/* TURTKI -- BOSISH STIKERI (metodist qarori 2026-08-14). Sahna ustida
   turadi, bosishga xalaqit bermaydi, o'quvchi bosishi bilan yo'qoladi.
   VAQT bo'yicha so'nmaydi: harakat tugaydi, belgi qoladi. */
.g7-nl.is-inviting { position: relative; }
.g7-tapmark {
  position: absolute; left: 50%; top: 41%;
  transform: translateX(-50%);
  display: inline-flex; align-items: center; justify-content: center;
  pointer-events: none; z-index: 2;
  animation: g7-tapfade .3s ease both;
}
.g7-tapmark-emoji {
  position: relative; z-index: 1;
  font-size: clamp(32px, 3.6vw, 42px); line-height: 1;
  filter: drop-shadow(0 3px 5px rgba(24,34,36,.22));
  animation: g7-tappress 1.4s cubic-bezier(.33,0,.2,1) 5;
}
.g7-tapmark-ring {
  position: absolute; left: 50%; top: 60%;
  width: clamp(32px, 3.6vw, 42px); height: clamp(32px, 3.6vw, 42px);
  margin-left: calc(clamp(32px, 3.6vw, 42px) / -2);
  margin-top: calc(clamp(32px, 3.6vw, 42px) / -2);
  border-radius: 50%;
  border: 3px solid ${T.accent};
  opacity: 0;
  animation: g7-tapwave 1.4s cubic-bezier(.2,.7,.3,1) 5;
}
@keyframes g7-tappress {
  0%, 100% { transform: translateY(0); }
  20% { transform: translateY(7px) scale(.94); }
  46% { transform: translateY(0); }
}
@keyframes g7-tapwave {
  0%, 16% { transform: scale(.35); opacity: 0; }
  26% { opacity: .75; }
  62% { transform: scale(1.6); opacity: 0; }
  100% { transform: scale(1.6); opacity: 0; }
}
@keyframes g7-tapfade { from { opacity: 0; transform: translateX(-50%) translateY(6px); } to { opacity: 1; } }
@media (prefers-reduced-motion: reduce) {
  .g7-tapmark-emoji, .g7-tapmark-ring { animation: none; }
  .g7-tapmark-ring { opacity: .5; }
}
.g7-nl-row.is-wait { min-height: 96px; }
.g7-nl-cap {
  font-family: 'Manrope', sans-serif; font-weight: 700;
  font-size: clamp(11px, 1.3vw, 13px); color: ${T.ink2};
}
.g7-nl-svg { width: 100%; height: auto; display: block; max-height: 96px; }
.g7-nl-axis { stroke: ${T.ink3}; stroke-width: 1.6; }
.g7-nl-tick { stroke: ${T.ink3}; stroke-width: 1.4; }
.g7-nl-num { font-family: ${MATH_FONT}; font-size: 13px; font-weight: 700; fill: ${T.ink2}; }
.g7-nl-jump { animation: g7-in .4s ease-out both; }
.g7-nl-arc { fill: none; stroke-width: 2.6; stroke-linecap: round; }
.g7-nl-arc.is-back { stroke: ${T.stage1}; }
.g7-nl-arc.is-fwd { stroke: ${T.stage2}; }
.g7-nl-head { stroke: none; }
.g7-nl-head.is-back { fill: ${T.stage1}; }
.g7-nl-head.is-fwd { fill: ${T.stage2}; }
.g7-nl-lab { font-family: ${MATH_FONT}; font-size: 14px; font-weight: 800; fill: ${T.ink}; }
.g7-nl-dot.is-start { fill: ${T.ink3}; }
.g7-nl-dot { fill: ${T.accent}; transform-box: fill-box; transform-origin: center; animation: g7-hk-pop .42s cubic-bezier(.33,0,.2,1) both; }
.g7-nl-end { font-family: ${MATH_FONT}; font-size: 17px; font-weight: 800; fill: ${T.accent}; transform-box: fill-box; transform-origin: center; animation: g7-hk-pop .42s cubic-bezier(.33,0,.2,1) both; }
@media (prefers-reduced-motion: reduce) { .g7-nl-jump, .g7-nl-dot, .g7-nl-end { animation: none; } }

/* LENTA: bosilgan yo'l. Plashkalar birma-bir chiqadi va QOLADI. */
.g7-tape { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.g7-tape-cap {
  font-family: 'Manrope', sans-serif; font-weight: 700;
  font-size: clamp(10px, 1.1vw, 11.5px); letter-spacing: .16em;
  text-transform: uppercase; color: ${T.ink3};
}
.g7-tape-row { display: flex; flex-wrap: wrap; gap: 6px; min-width: 0; }
.g7-tape-chip {
  display: inline-flex; align-items: center;
  padding: 5px 11px; border-radius: 9px;
  background: ${T.paperSolid}; box-shadow: inset 0 0 0 1px ${T.line};
  font-family: ${MATH_FONT}; font-weight: 700;
  font-size: clamp(13px, 1.5vw, 15.5px); color: ${T.ink};
  font-variant-numeric: tabular-nums lining-nums;
  animation: g7-lawpop .38s cubic-bezier(.33,0,.2,1) both;
}
@media (prefers-reduced-motion: reduce) { .g7-tape-chip { animation: none; } }

/* BONUS -- 3-sinf Dars01 s4 naqshi: sariq ramka, yulduzcha, sarlavha va bir
   gap. Layfxakdan farqi -- unda SARLAVHA bor va u mavzuning yana bir tomonini
   ochadi. Usul ekranlarida bonus layfxakning o'rnini egallaydi. */
.g7-bonus {
  display: flex; flex-direction: column; gap: 2px; min-width: 0;
  margin-top: auto;
  padding: 8px clamp(10px, 1.3vw, 15px);
  border-radius: 12px;
  background: #FFF6DC; box-shadow: inset 0 0 0 1.5px rgba(199,164,74,.5);
  animation: g7-in .34s ease-out both;
}
.g7-bonus-cap {
  font-family: 'Manrope', sans-serif; font-weight: 800;
  font-size: clamp(12px, 1.4vw, 14px); letter-spacing: .04em; color: #9A6C12;
}
.g7-bonus-text {
  min-width: 0; overflow-wrap: anywhere;
  font-family: 'Manrope', sans-serif;
  font-size: clamp(13.5px, 1.6vw, 15.5px); line-height: 1.34; color: ${T.ink};
}
@media (prefers-reduced-motion: reduce) { .g7-bonus { animation: none; } }

/* Birinchi xatodan keyin ochiladigan lug'at polosasi. */
.g7-helpstrip {
  display: flex; flex-wrap: wrap; align-items: center; gap: 6px clamp(10px, 1.6vw, 20px);
  padding: 7px clamp(9px, 1.2vw, 13px); border-radius: 11px;
  background: ${T.graphSoft};
  font-family: ${MATH_FONT}; font-weight: 700;
  font-size: clamp(12px, 1.4vw, 14px); color: ${T.graph};
  animation: g7-in .34s ease-out both;
}
.g7-helpstrip > span { min-width: 0; overflow-wrap: anywhere; }
@media (prefers-reduced-motion: reduce) { .g7-helpstrip { animation: none; } }

/* Yakun TIK: halqa va tayyorlik matni yonma-yon, qolgani ustma-ust. */
.g7-sumready { display: flex; align-items: center; gap: 12px; min-width: 0; }
.g7-sumready > .g7-insight { flex: 1; min-width: 0; }
.g7-sumcan { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
/* «Endi men» to'rt bandi ikki ustunda: tik yakunda to'rt qator juda uzun. */
.g7-sumcan-list {
  display: grid; grid-template-columns: 1fr 1fr; gap: 2px clamp(10px, 1.6vw, 22px);
}
.g7-sumcan-item {
  display: flex; gap: 6px; min-width: 0;
  font-size: clamp(12.5px, 1.5vw, 14.5px); line-height: 1.3; color: ${T.ink};
}
.g7-sumcan-item > b { color: ${T.ok}; font-weight: 800; flex-shrink: 0; }
.g7-sumcan-item > span { min-width: 0; overflow-wrap: anywhere; }
.g7-sumfoot { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.g7-sumfoot > .g7-hint { margin: 0; min-width: 0; }
@media (max-width: 640px) {
  .g7-sumready { align-items: flex-start; }
  .g7-sumcan-list { grid-template-columns: 1fr; }
  .g7-sumfoot { flex-direction: column; align-items: stretch; }
  /* Telefonda qobiq uchun 60px yuqoridan berildi, ya'ni budjet 607 dan 547 ga
     tushdi va yakun 8px sig'may qoldi. Ikki joydan qisqartiriladi:
     halqa kichrayadi va keyingi darsga KO'PRIK olib tashlanadi -- u ovozda
     aytiladi va matematika tashimaydi. Hech qanday son, javob yoki razbor
     yo'qolmaydi. */
  .g7-sumready .g7-ring svg { width: 64px; height: 64px; }
  .g7-sumfoot > .g7-hint { display: none; }
}

/* Ikki kartochka va «teng emas» belgisi (xuk, §6.5). */
.g7-tv-row {
  display: flex; align-items: center; justify-content: center;
  gap: clamp(8px, 2vw, 18px); width: 100%; min-width: 0;
}
.g7-tv {
  flex: 1 1 0; min-width: 0;
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  padding: 10px 12px; border-radius: 14px;
  background: ${T.paperSolid};
  box-shadow: 0 14px 30px -22px rgba(${T.shadow},.6), inset 0 0 0 1px ${T.line};
  transition: opacity .5s ease, box-shadow .5s ease;
}
.g7-tv-cap {
  font-family: 'Manrope', sans-serif;
  font-size: clamp(11px, 1.3vw, 13px); font-weight: 600;
  color: ${T.ink2}; text-align: center;
  min-width: 0; overflow-wrap: anywhere;
}
.g7-tv-val {
  font-family: ${MATH_FONT}; font-weight: 800;
  font-size: clamp(24px, 3.4vw, 38px); color: ${T.ink};
  font-variant-numeric: tabular-nums lining-nums; line-height: 1.1;
}
.g7-tv.is-dim { opacity: .34; }
.g7-tv.is-ok { box-shadow: 0 14px 30px -22px rgba(40,119,74,.6), inset 0 0 0 2px rgba(40,119,74,.45); }
.g7-tv.is-ok .g7-tv-val { color: ${T.ok}; }
.g7-tv-ne {
  flex-shrink: 0;
  width: clamp(30px, 4vw, 40px); height: clamp(30px, 4vw, 40px); border-radius: 50%;
  display: inline-flex; align-items: center; justify-content: center;
  background: ${T.graphSoft}; color: ${T.graph};
  font-family: ${MATH_FONT}; font-weight: 800; font-size: clamp(15px, 2vw, 20px);
}

@media (max-width: 640px) {
  .g7-so-row { font-size: clamp(18px, 5vw, 24px); }
  .g7-so-op { min-width: 46px; min-height: 54px; }
  .g7-rb-chip { min-height: 46px; }
  /* Almashtirish jadvalining qatori 390 da GORIZONTAL chiqib ketardi:
     g7-expr da white-space nowrap turadi, va uzun qo'yish (masalan
     4 karra 2 qo'shuv 8 qo'shuv 3 karra 2) chetdan 20px oshib KESILARDI
     (o'lchov 2026-08-16, 6-dars 7-ekran). Tor ekranda qator o'ralishi
     mumkin: grid katagi uchun bu xavfsiz, uning eni minmax nol dan boshlanadi.
     Skroll baribir yo'q, kontent balandlikka ketadi, kenglikka emas.
     DIQQAT: bu izohda TESKARI APOSTROF bo'lishi mumkin emas. */
  .g7-sub-row { white-space: normal; }
  /* Yonma-yon turgan ikki kartochka 390 da yozuvni uch qatorga yorardi (§6.2) */
  .g7-tv-row { flex-direction: column; gap: 6px; }
  .g7-tv { width: 100%; flex: 0 0 auto; flex-direction: row; justify-content: space-between; }
  .g7-tv-val { font-size: clamp(22px, 7vw, 30px); }
}

/* ============================================================
   YO'L SAHNASI (RideScene, 2-dars). Sahnaning O'ZI bosiladi -- tugma
   uchun alohida qator yo'q, va bosish bitta piksel ham olmaydi
   (1-darsning yakunidagi naqsh).
   ============================================================ */
/* ============================================================
   MULJITELLAR LENTASI (FactorTape, B3 bloki). Yozuv bosilganda lenta
   ochiladi: har element ketma-ket chiqadi, chunki bir vaqtda chiqsa
   o'quvchi SANOQNI ko'rmaydi -- lentaning butun ma'nosi esa sanoqda.
   DIQQAT: bu izohda TESKARI APOSTROF bo'lishi mumkin emas.
   ============================================================ */
.g7-ft-head { width: 100%; display: flex; justify-content: center; }
.g7-ft-src {
  position: relative; display: inline-flex; align-items: center; gap: 8px;
  font-family: inherit; color: ${T.ink};
  font-weight: 800; font-size: var(--g7-num);
  padding: 6px 18px; border-radius: 12px;
  background: ${T.paper}; border: 1px solid rgba(24, 34, 36, 0.2);
  cursor: pointer;
}
.g7-ft-src.is-open { cursor: default; background: none; border-color: transparent; }
.g7-ft {
  display: flex; flex-direction: column; align-items: center; gap: 5px;
  width: 100%;
}
.g7-ft-tape {
  display: inline-flex; flex-wrap: wrap; justify-content: center;
  align-items: center; gap: 2px;
  font-weight: 800; font-size: clamp(16px, 2.2vw, 21px);
}
.g7-ft-cell {
  display: inline-flex; align-items: center; gap: 2px;
  animation: g7-ft-in .3s ease both;
}
.g7-ft-join { color: ${T.ink3}; padding-inline: 5px; }
/* Guruh chegarasi: oraliq kengayadi, shunda ko'rsatkichlarning qo'shilishi
   yoki ko'payishi KO'RINADI, aytilmaydi. */
.g7-ft-cell.is-edge { margin-left: 16px; }
/* Bo'lishda qisqargan muljitellar: o'chirilgan, lekin JOYIDA qoladi --
   nima ketganini ko'rish kerak. */
.g7-ft-cell.is-gone { opacity: .4; }
.g7-ft-cell.is-gone .g7-ft-val { text-decoration: line-through; }
/* Lentaga KIRMAGAN qism: u alohida turadi va rangi ham boshqa. */
.g7-ft-out {
  font-weight: 800; font-size: clamp(16px, 2.2vw, 21px); color: ${T.tip};
}
.g7-ft-cnt {
  font-family: 'Manrope', sans-serif; font-size: 12px; letter-spacing: .1em;
  text-transform: uppercase; font-weight: 700; color: ${T.graph};
}
.g7-ft-cnt.is-sum { color: ${T.stage1}; }
@keyframes g7-ft-in { 0% { opacity: 0; transform: translateY(-6px); } 100% { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .g7-ft-cell { animation-duration: .01ms; } }

/* ============================================================
   HADLAR LENTASI (TermStrip, B4 bloki). Kesish tugmasi FAQAT qo'shuv va
   ayirish belgisida turadi: ko'paytirish nuqtasida tugma YO'Q, ya'ni bitta
   hadni ikkiga bo'lib yuborish mumkin emas. Kesilgach belgi O'CHADI va had
   ostidagi chipda paydo bo'ladi -- minus had bilan KETGANI ko'rinadi.
   ============================================================ */
.g7-ts-wrap { display: flex; flex-direction: column; align-items: center; gap: 7px; width: 100%; }
.g7-ts { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.g7-ts-lbl {
  font-family: 'Manrope', sans-serif; font-size: 11px; letter-spacing: .1em;
  text-transform: uppercase; font-weight: 700; color: ${T.ink3};
}
.g7-ts-row {
  display: inline-flex; flex-wrap: wrap; justify-content: center; align-items: center;
  gap: 1px; font-weight: 800; font-size: clamp(16px, 2.3vw, 22px);
}
.g7-ts-term { padding: 2px 5px; border-radius: 8px; color: ${T.ink}; }
.g7-ts-op {
  font-family: inherit; font-weight: 800; font-size: inherit; color: ${T.accent};
  padding: 1px 9px; margin-inline: 2px; border-radius: 9px;
  background: ${T.accentSoft}; border: 1px dashed ${T.accent}; cursor: pointer;
}
.g7-ts-op.is-gone {
  color: ${T.ink3}; background: none; border-color: transparent;
  opacity: .3; cursor: default;
}
.g7-ts-out {
  display: inline-flex; flex-wrap: wrap; justify-content: center; gap: 5px;
  min-height: 22px;
}
.g7-ts-chip {
  font-weight: 800; font-size: clamp(14px, 1.9vw, 18px); color: ${T.graph};
  padding: 2px 9px; border-radius: 9px;
  background: ${T.graphSoft}; border: 1px solid rgba(18, 110, 115, 0.25);
  animation: g7-ts-in .28s ease both;
}
.g7-ts-cnt {
  display: inline-flex; align-items: center; gap: 10px;
  font-family: 'Manrope', sans-serif; font-size: 12px; letter-spacing: .1em;
  text-transform: uppercase; font-weight: 700; color: ${T.graph};
}
.g7-ts-cnt.is-wait {
  color: ${T.ink3}; text-transform: none; letter-spacing: 0; font-size: 12.5px;
}
.g7-ts-kind { color: ${T.ok}; }
/* IKKI LENTA bitta ekranda: yozuv maydasi va oraliqlar tor. 4-ekran
   488 px budjetiga faqat shu bilan sig'adi. */
.g7-ts-wrap.is-pair { gap: 4px; }
.g7-ts-wrap.is-pair .g7-ts { gap: 2px; }
.g7-ts-wrap.is-pair .g7-ts-row { font-size: clamp(15px, 2vw, 19px); }
.g7-ts-wrap.is-pair .g7-ts-chip { font-size: clamp(13px, 1.7vw, 16px); padding: 1px 7px; }
.g7-ts-wrap.is-pair .g7-ts-out { min-height: 20px; }

/* ============================================================
   HADLAR USTUNI (TermColumns, 19-dars). O'xshash hadlar birining ostiga
   ikkinchisi turadi -- darslikning ustun usuli (44-bet). Chiziq ostidagi
   qator TUGMALAR: ustunni bosgach, qo'shiluvchilar pastga tushadi.
   Minusli qatorda ishora ALMASHADI va shu joyda ko'rinadi.
   ============================================================ */
.g7-tc {
  display: grid; justify-content: center; align-items: center;
  gap: 4px 14px; font-weight: 800; font-size: clamp(15px, 2.1vw, 20px);
}
.g7-tc-op { color: ${T.stage1}; text-align: right; min-width: 14px; }
.g7-tc-cell { text-align: center; white-space: nowrap; padding: 1px 2px; }
.g7-tc-cell.is-flip { color: ${T.accent}; }
.g7-tc-res {
  border-top: 1.5px solid rgba(24, 34, 36, 0.28); padding-top: 5px; margin-top: 2px;
  display: flex; align-items: center; justify-content: center; min-height: 34px;
}
.g7-tc-pair {
  color: ${T.graph}; white-space: nowrap;
  animation: g7-ts-in .28s ease both;
}
.g7-tc-tap {
  position: relative; display: inline-flex; align-items: center; justify-content: center;
  min-width: 54px; min-height: 30px; padding: 2px 8px;
  border-radius: 10px; background: ${T.accentSoft};
  border: 1px dashed ${T.accent}; cursor: pointer;
  font-family: inherit; font-weight: 800; font-size: 17px; color: ${T.accent};
}
.g7-tc-tap:disabled { opacity: .45; cursor: default; }

/* ============================================================
   YUZA TO'RTBURCHAGI (AreaGrid, B4 bloki). Kataklar SONI ko'rinadi: to'rtta
   katak turgan joyda ikki ko'paytma yozib bo'lmaydi. Ochilmagan katak bo'sh
   turadi va u ko'zga tashlanadi -- «ko'paytmani tushirib qoldirdim» xatosi
   shu bilan yopiladi.
   ============================================================ */
.g7-ag {
  display: grid; justify-content: center; align-items: stretch;
  gap: 4px; font-weight: 800; font-size: clamp(14px, 1.9vw, 18px);
}
.g7-ag-corner { min-width: 18px; }
.g7-ag-top, .g7-ag-left {
  display: flex; align-items: center; justify-content: center;
  color: ${T.graph}; padding: 2px 6px; white-space: nowrap;
}
.g7-ag-left { justify-content: flex-end; }
.g7-ag-cell {
  display: flex; align-items: center; justify-content: center;
  min-height: 44px; min-width: 96px; padding: 3px 6px;
  border-radius: 12px; background: ${T.paper};
  border: 1.5px dashed rgba(24, 34, 36, 0.22);
}
.g7-ag-pair {
  color: ${T.ink}; white-space: nowrap;
  animation: g7-ts-in .28s ease both;
}
.g7-ag-tap {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 52px; min-height: 30px; border-radius: 10px;
  background: ${T.accentSoft}; border: 1px dashed ${T.accent};
  cursor: pointer; font-family: inherit; font-weight: 800;
  font-size: 17px; color: ${T.accent};
}
.g7-ag-tap:disabled { opacity: .45; cursor: default; }

/* KOORDINATALAR TEKISLIGI (Plane, B6). Chizma o'lchamini CSS beradi, viewBox
   emas: viewBox ga balandlik kiritilsa, chizma telefonda BUTUNLAY kichrayadi.
   Shuning uchun kenglik foizda, cheklovi max-width da, balandligi esa auto.
   DIQQAT: bu qator STYLES shablon satri ICHIDA -- bekitik yozib bo'lmaydi. */
.g7-pl-wrap { width: 100%; display: flex; justify-content: center; }
.g7-pl-svg {
  width: 100%; max-width: 420px; height: auto;
  background: ${T.paperSolid};
  border: 1px solid ${T.line}; border-radius: 14px;
  box-shadow: 0 2px 8px rgba(${T.shadow}, .05);
}
/* Bosish zonasi KO'RINIB turishi kerak: o'quvchi qayerga bosishni bilishi shart. */
.g7-pl-svg.is-live { cursor: crosshair; border-color: ${T.accent}; box-shadow: 0 0 0 3px ${T.accentSoft}; }
.g7-pl-grid { stroke: rgba(24, 34, 36, .07); stroke-width: 1; }
.g7-pl-ax { stroke: ${T.ink2}; stroke-width: 1.6; }
.g7-pl-arrow { fill: ${T.ink2}; }
.g7-pl-tick { stroke: ${T.ink2}; stroke-width: 1.4; }
.g7-pl-num { font-family: ${MATH_FONT}; font-size: 11px; fill: ${T.ink3}; }
.g7-pl-axname { font-family: ${MATH_FONT}; font-weight: 700; font-size: 13px; fill: ${T.ink2}; }
.g7-pl-line { fill: none; stroke: ${T.graph}; stroke-width: 2.6; stroke-linecap: round; }
.g7-pl-l1 { stroke: ${T.tip}; stroke-dasharray: 7 4; }
.g7-pl-guide { stroke: ${T.ink3}; stroke-width: 1; stroke-dasharray: 3 3; }
.g7-pl-dot { fill: ${T.graph}; stroke: ${T.paperSolid}; stroke-width: 1.6; }
.g7-pl-dotg.is-mine .g7-pl-dot { fill: ${T.accent}; }
/* Noto'g'ri qo'yilgan nuqta: ko'rinadi, lekin xato rangida va o'zi
   so'nadi. O'quvchi qayerga bosganini ko'rishi kerak. */
.g7-pl-dotg.is-miss .g7-pl-dot { fill: ${T.tip}; }
.g7-pl-dotg.is-miss .g7-pl-guide { stroke: ${T.tip}; }
.g7-pl-dotg.is-miss .g7-pl-lab { fill: ${T.tip}; }
.g7-pl-dotg.is-mine .g7-pl-guide { stroke: ${T.accent}; }
.g7-pl-lab { font-family: ${MATH_FONT}; font-weight: 700; font-size: 12.5px; fill: ${T.ink}; }
.g7-pl-dotg { animation: g7-pop .34s cubic-bezier(.22,.9,.3,1.2) both; }

/* CHIZMA (Figure, B7). Tekislik bilan bir xil o'ram, lekin o'qlar yo'q:
   geometriyada asosiy narsa figura, to'r esa faqat bosish tugunlarini
   ko'rsatadi. Uchni ko'chirish mumkin bo'lganda ramka aksent rangida. */
.g7-fg-svg {
  width: 100%; max-width: 420px; height: auto;
  background: ${T.paperSolid};
  border: 1px solid ${T.line}; border-radius: 14px;
  box-shadow: 0 2px 8px rgba(${T.shadow}, .05);
}
.g7-fg-svg.is-live { cursor: crosshair; border-color: ${T.accent}; box-shadow: 0 0 0 3px ${T.accentSoft}; }
.g7-fg-node { fill: rgba(24, 34, 36, .16); }
/* Uch ko'chirilishini kutayotgan chizmada to'r ISHCHI bo'lib ko'rinadi. */
.g7-fg-node.is-live {
  fill: rgba(24, 34, 36, .32);
  transform-box: fill-box; transform-origin: center;
  animation: g7-fg-ripple .52s ease-out 1;
}
@keyframes g7-fg-ripple {
  0% { opacity: 1; transform: scale(1); }
  45% { opacity: 1; transform: scale(1.9); }
  100% { opacity: 1; transform: scale(1); }
}
@media (prefers-reduced-motion: reduce) { .g7-fg-node.is-live { animation: none; } }
.g7-fg-seg { stroke: ${T.ink}; stroke-width: 2.2; stroke-linecap: round; }
.g7-fg-seg.is-mark { stroke: ${T.graph}; stroke-width: 3.4; }
/* O'CHGAN element: u YO'Q emas, u YETMAYDI. Shuning uchun ko'rinadi, lekin
   xira: «bu element belgiga yetmaydi» degani (etalon § 2, B7). */
.g7-fg-seg.is-dim { stroke: ${T.ink3}; stroke-width: 1.4; stroke-dasharray: 4 4; }
.g7-fg-pt { fill: ${T.ink}; stroke: ${T.paperSolid}; stroke-width: 1.4; }
.g7-fg-ptg.is-move .g7-fg-pt { fill: ${T.accent}; }
.g7-fg-name { font-family: ${MATH_FONT}; font-weight: 800; font-size: 13px; fill: ${T.ink}; }
.g7-fg-len { font-family: ${MATH_FONT}; font-size: 11.5px; fill: ${T.ink2}; }
.g7-fg-len.is-dim { fill: ${T.ink3}; }
.g7-fg-ang { font-family: ${MATH_FONT}; font-weight: 700; font-size: 12.5px; fill: ${T.graph}; }
.g7-fg-axis text { font-family: ${MATH_FONT}; font-weight: 700; font-size: 10px; fill: ${T.ink2}; }
.g7-fg-ang.is-mark { fill: ${T.accent}; }
.g7-fg-ang.is-dim { fill: ${T.ink3}; }
.g7-fg-sum { font-family: ${MATH_FONT}; font-weight: 700; font-size: 14px; color: ${T.ink}; }
.g7-fg-sum.is-guess { color: ${T.tip}; }
/* SARLAVHA OSTIDAGI IZOH. 13,5 px va och kulrang edi: QA uni ekranda
   umuman ajrata olmadi (2026-08-22). Izoh ekranning SHARTINI aytadi --
   uni o'qimasdan topshiriq tushunilmaydi, ya'ni u bezak emas. Endi
   asosiy matn rangida va bir yarim pog'ona yirikroq. */
.g7-ts-cap { text-align: center; font-size: 15px; line-height: 1.35; color: ${T.ink}; }
@keyframes g7-ts-in { 0% { opacity: 0; transform: translateY(-5px); } 100% { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .g7-ts-chip { animation-duration: .01ms; } }

/* ============================================================
   ZONALARGA TARQATISH (SortZones). Asbob tools.jsx da bor edi, LEKIN
   7-sinfda uslub YO'Q edi: 18-darsning 6-ekrani suratda zonasiz uch qator
   matn bo'lib chiqdi -- bosish zonasi ko'rinmaydi (matematika profili
   must-bandi). Endi zona QUTI: chegarasi punktir, karta qo'lga olinganda
   esa chegara to'q sariqqa aylanadi, ya'ni QAYERGA bosish kerakligi
   ko'rinib turadi.
   ============================================================ */
.g7-sz-zones {
  display: grid; grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 9px; width: 100%;
}
.g7-sz-zone { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.g7-sz-cap {
  font-family: 'Manrope', sans-serif; font-size: 11px; letter-spacing: .09em;
  text-transform: uppercase; font-weight: 700; color: ${T.ink3};
  text-align: center;
}
.g7-sz-drop {
  min-height: 60px; display: flex; align-items: center; justify-content: center;
  padding: 5px; border-radius: 14px;
  background: ${T.paper}; border: 1.5px dashed rgba(24, 34, 36, 0.22);
}
.g7-sz-drop.is-open {
  background: ${T.accentSoft}; border-color: ${T.accent}; cursor: pointer;
}
.g7-sz-in { display: flex; flex-wrap: wrap; justify-content: center; gap: 4px; }
.g7-sz-pool { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; }
.g7-sz-chip {
  font-family: inherit; font-weight: 800; font-size: clamp(13px, 1.8vw, 17px);
  color: ${T.ink}; padding: 4px 10px; border-radius: 11px;
  background: ${T.paperSolid}; border: 1px solid rgba(24, 34, 36, 0.16);
  cursor: pointer;
}
.g7-sz-chip.is-picked {
  border-color: ${T.accent}; background: ${T.accentSoft};
  box-shadow: 0 2px 8px rgba(${T.shadow}, 0.12);
}
.g7-sz-chip.is-bad { border-color: ${T.tip}; background: ${T.tipSoft}; color: ${T.tip}; }
.g7-sz-chip.is-good { border-color: ${T.ok}; background: ${T.okSoft}; color: ${T.ok}; }
.g7-sz-chip:disabled { cursor: default; }

/* ============================================================
   KATTALIKLAR JADVALI (QuantityCard, 11-dars). Masalaning tuzilishi:
   chapda kattalik nomi, o'ngda uning ifodasi. Hali topilmagani savol
   belgisi bilan turadi -- natija polosasi birinchi soniyadan ko'rinadi.
   DIQQAT: bu izohda TESKARI APOSTROF bo'lishi mumkin emas.
   ============================================================ */
.g7-qc {
  display: flex; flex-direction: column; gap: 3px;
  width: 100%; max-width: 560px; margin-inline: auto;
}
.g7-qc-cap {
  font-family: 'Manrope', sans-serif; font-size: 11px; letter-spacing: .18em;
  text-transform: uppercase; color: ${T.ink3}; text-align: center;
}
.g7-qc-row {
  display: grid; grid-template-columns: minmax(0,1fr) 96px;
  align-items: center; gap: 10px;
  padding: 4px 12px; border-radius: 11px;
  background: ${T.paper}; border: 1px solid ${T.line};
  transition: border-color .3s ease, background .3s ease;
}
.g7-qc-row.is-mark { border-color: ${T.accent}; background: ${T.accentSoft}; }
/* Javob turgan qator: yashil, chunki sinfda yashil «to'g'ri va yakun»
   degan ma'noni bildiradi. To'q sariq esa «hozir shu bilan ishlayapmiz». */
.g7-qc-row.is-answer { border-color: ${T.ok}; background: ${T.okSoft}; }
.g7-qc-row.is-answer .g7-qc-val { color: ${T.ok}; }
.g7-qc-name {
  font-family: 'Manrope', sans-serif; font-size: 14px; color: ${T.ink};
  min-width: 0; overflow-wrap: anywhere;
}
.g7-qc-val {
  text-align: center; font-weight: 800; font-size: clamp(14px, 1.8vw, 17px);
}
.g7-qc-wait { color: ${T.ink3}; font-weight: 700; }
@media (max-width: 390px) {
  .g7-sz-zones { gap: 5px; }
  .g7-sz-drop { min-height: 50px; border-radius: 11px; }
  .g7-sz-cap { font-size: 9.5px; letter-spacing: .04em; }
  .g7-sz-chip { font-size: 12px; padding: 3px 7px; }
  .g7-tc { gap: 3px 8px; font-size: 14px; }
  .g7-tc-tap { min-width: 36px; min-height: 22px; }
  .g7-ag { gap: 3px; font-size: 13px; }
  .g7-ag-cell { min-height: 38px; min-width: 64px; border-radius: 9px; }
  .g7-ag-tap { min-width: 38px; min-height: 24px; }
  .g7-pl-svg { max-width: 100%; border-radius: 11px; }
  .g7-pl-num { font-size: 10px; }
  .g7-pl-lab { font-size: 11px; }
  .g7-fg-svg { max-width: 100%; border-radius: 11px; }
  .g7-fg-name { font-size: 11.5px; }
  .g7-fg-len { font-size: 10px; }
  .g7-fg-ang { font-size: 11px; }
  .g7-fg-sum { font-size: 12.5px; }

  .g7-qc-row { grid-template-columns: minmax(0,1fr) 72px; padding: 6px 10px; }
  .g7-qc-name { font-size: 14px; }
  /* TELEFONDA IKKI TOR JOY. Ular 2026-08-17 da, tekshiruv walkeri
     tuzatilgach ko'rindi -- ilgari yechilgan holat o'lchanmagani uchun
     jim turgan.
     1) QOIDA EKRANI: qoida kartochkasi, bo'laklar va belgilar ustma-ust
        kelib, 2, 8 va 10-darslarda 15-39 px oshib ketardi.
     2) BLITS: uzun variant matni tor ekranda uch satrga chiqib, 9 va
        10-darslarda 5-44 px oshib ketardi.
     Matn ham, shrift ham o'zgarmaydi -- faqat atrofdagi bo'shliq. */
  .g7-rule { padding: 10px 12px; gap: 4px; }
  .g7-opt { padding: 8px 12px; min-height: 46px; gap: 9px; }
  /* TELEFONDA BELGILAR LENTASI YASHIRINADI. U qoidani belgilar bilan
     TAKRORLAYDI, ya'ni mnemonika -- foydali, lekin qoidaning o'zidan
     muhim emas. Tor ekranda qoida, bo'laklar, lenta va eslatma birga
     sig'masdi va bir necha darsda 15-46 px oshib ketardi. Piksel-piksel
     tanlash bu yerda ishlamaydi: walker har safar boshqacha yuradi va
     to'lib ketgan ekran ham har safar boshqa bo'ladi -- zapas kerak. */
  .g7-stairs { display: none; }
  /* Eslatma polosasi ham telefonда yashiriladi: uch punkt tor ekranda
     ikki-uch satrga cho'ziladi. U qoidani ESLATADI, o'rgatmaydi -- shuning
     uchun tanlov aniq: qoida qoladi, eslatma ketadi. */
  .g7-helpstrip { display: none; }
}

/* ============================================================
   MASOFA O'QI (DistanceLine, 10-dars). Modul -- masofa, shuning uchun
   asbobda MASOFA chiziladi: markazdan nuqtagacha ustki qavs va uning
   ustida son. Javob emas, o'lchov.
   DIQQAT: bu izohda TESKARI APOSTROF bo'lishi mumkin emas.
   ============================================================ */
.g7-dl { display: flex; flex-direction: column; align-items: center; gap: 2px; }
/* O'RAM SVG NING O'LCHAMIDA. Zonalar inset nol bilan aynan svg ustiga
   tushishi kerak: ilgari ular butun g7-dl blokini qoplardi, o'q esa markazda
   620px bilan cheklangan edi -- foizlar boshqa kenglikdan hisoblanib, zona
   o'z belgisidan chetga ketardi (QA nuqsoni 2026-08-22). */
.g7-dl-box { position: relative; width: 100%; max-width: 620px; }
.g7-dl-zones { position: absolute; inset: 0; }
.g7-dl-svg { width: 100%; height: auto; display: block; }
.g7-dl-axis { stroke: ${T.ink}; stroke-width: 2; }
.g7-dl-tick { stroke: ${T.ink3}; stroke-width: 1.5; }
.g7-dl-num {
  font-family: ${MATH_FONT}; font-size: 13px; fill: ${T.ink2}; font-weight: 700;
}
.g7-dl-center { fill: ${T.accent}; }
.g7-dl-hit { fill: ${T.ok}; animation: g7-dl-pop .3s cubic-bezier(.22,.61,.36,1) both; }
.g7-dl-miss { fill: none; stroke: ${T.tip}; stroke-width: 2.5; }
.g7-dl-span {
  fill: none; stroke: ${T.ok}; stroke-width: 2;
  animation: g7-dl-draw .34s ease both;
}
.g7-dl-span.is-miss { stroke: ${T.tip}; stroke-dasharray: 5 4; }
.g7-dl-span-num {
  font-family: ${MATH_FONT}; font-size: 16px; font-weight: 800; fill: ${T.ok};
}
.g7-dl-span-num.is-miss { fill: ${T.tip}; }
.g7-dl-zone {
  position: absolute; width: 30px; height: 30px; padding: 0;
  transform: translate(-50%, -50%);
  border: none; border-radius: 50%; background: transparent; cursor: pointer;
}
.g7-dl-zone:disabled { cursor: default; pointer-events: none; }
.g7-dl-zone:hover:not(:disabled) { background: rgba(231, 90, 44, 0.12); }
.g7-dl-zone:focus-visible { outline: 2px solid ${T.accent}; outline-offset: 1px; }
.g7-dl-cnt {
  font-family: 'Manrope', sans-serif; font-size: 11px; letter-spacing: .18em;
  text-transform: uppercase; color: ${T.ink3};
}
@keyframes g7-dl-pop { 0% { r: 0; opacity: 0; } 100% { opacity: 1; } }
@keyframes g7-dl-draw { 0% { opacity: 0; } 100% { opacity: 1; } }
@media (prefers-reduced-motion: reduce) {
  .g7-dl-hit, .g7-dl-span { animation-duration: .01ms; }
}

/* ============================================================
   TENGLAMA TAROZISI (EquationBalance, B2 bloki). Ikkala tomon YONMA-YON
   turadi va amal ikkalasida bir vaqtda ko'rinadi: bitta tomonga qo'llash
   ko'rinishda ham, mexanikada ham mumkin emas.
   DIQQAT: bu izohda TESKARI APOSTROF bo'lishi mumkin emas.
   ============================================================ */
.g7-eqb { display: flex; flex-direction: column; gap: 4px; }
.g7-eqb-row {
  display: grid; align-items: center; column-gap: 10px; row-gap: 1px;
  grid-template-columns: minmax(0,1fr) 34px minmax(0,1fr);
  opacity: .5; transition: opacity .3s ease;
}
.g7-eqb-row.is-live { opacity: 1; }
/* Tovoq: tenglamaning bir tomoni. Ikkitasi yonma-yon turadi. */
.g7-eqb-plate {
  text-align: center; font-weight: 800; font-size: clamp(15px, 2.1vw, 19px);
  padding: 5px 10px; border-radius: 12px;
  background: ${T.paper}; border: 1px solid ${T.line};
}
.g7-eqb-row.is-live .g7-eqb-plate {
  font-size: var(--g7-num); padding: 9px 14px;
  border-color: rgba(24, 34, 36, 0.2); box-shadow: 0 1px 0 ${T.line};
}
.g7-eqb-eq { text-align: center; color: ${T.ink3}; font-weight: 700; }
/* Kelajakdagi qator: chegarasi punktir, ichi bo'sh. U javobni aytmaydi --
   faqat yana bitta qadam borligini ko'rsatadi. */
.g7-eqb-row.is-ghost { opacity: 1; }
.g7-eqb-row.is-ghost .g7-eqb-plate {
  background: none; border-style: dashed; border-color: ${T.line};
  min-height: 32px;
}
.g7-eqb-row.is-ghost .g7-eqb-eq { color: ${T.line}; }
.g7-eqb-acts {
  display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;
}
.g7-eqb-act {
  font-family: ${MATH_FONT}; font-size: clamp(15px, 2vw, 18px); font-weight: 800;
  color: ${T.ink}; background: ${T.paper};
  border: 1px solid rgba(24, 34, 36, 0.2); border-radius: 12px;
  padding: 8px 18px; min-width: 62px; cursor: pointer;
  transition: background .18s ease, border-color .18s ease, transform .12s ease;
}
.g7-eqb-act:hover:not(:disabled) { background: ${T.paperSolid}; border-color: ${T.ink3}; }
.g7-eqb-act:active:not(:disabled) { transform: translateY(1px); }
.g7-eqb-act:disabled { opacity: .45; cursor: default; }
.g7-eqb-cnt {
  margin-top: 6px; text-align: center;
  font-family: 'Manrope', sans-serif; font-size: 11px; letter-spacing: .18em;
  text-transform: uppercase; color: ${T.ink3};
}
/* Amal IKKALA tovoq tagida: bir xil yozuv, bir xil vaqtda. */
.g7-eqb-op {
  grid-row: 2; text-align: center;
  color: ${T.accent}; font-weight: 800; font-size: 15px; white-space: nowrap;
  animation: g7-eqb-fly .42s ease both;
}
.g7-eqb-op-l { grid-column: 1; }
.g7-eqb-op-r { grid-column: 3; }
@keyframes g7-eqb-fly {
  0% { opacity: 0; transform: translateY(-7px); }
  60% { opacity: 1; transform: translateY(1px); }
  100% { opacity: 1; transform: translateY(0); }
}
/* Yechimlar to'plami tablichkasi */
/* Modul chizig'i harfdan BALANDROQ bo'lishi kerak -- matematik yozuvda
   shunday. Bir xil balandlikda u bosh «I» harfiga qo'shilib ketadi va
   |x − 3| yozuvi «Ix − 3I» bo'lib o'qiladi (surat 2026-08-17). Faqat
   joy bo'shatish yetmadi, balandlik ham kerak. */
/* Uch va undan ko'p qiymat qatori yig'ilganda jadval IXCHAM shriftga
   o'tadi: aks holda u savol va razbor bilan birga budjetdan oshib ketadi. */
.g7-kept-tight { font-size: 0.86em; }
.g7-fxbar {
  display: inline-block; padding-inline: 3px;
  transform: scaleY(1.3); font-weight: 500;
}
.g7-eqb-lone {
  text-align: center; font-weight: 800; font-size: var(--g7-num);
  padding: 6px 0 2px;
}
.g7-set { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.g7-set-cap {
  font-family: 'Manrope', sans-serif; font-size: 11px; letter-spacing: .18em;
  text-transform: uppercase; color: ${T.ink3};
}
.g7-set-row { display: flex; gap: 6px; flex-wrap: wrap; justify-content: center; }
.g7-set-cell {
  font-family: 'Manrope', sans-serif; font-size: 14px; font-weight: 700;
  padding: 5px 12px; border-radius: 999px;
  background: ${T.paper}; color: ${T.ink3}; border: 1px solid ${T.line};
  transition: background .4s ease, color .4s ease, border-color .4s ease;
}
.g7-set-cell.is-on { background: ${T.okSoft}; color: ${T.ok}; border-color: ${T.ok}; }
/* Javob kelmaguncha tablichka TURADI, lekin so'nik: natija polosasi
   birinchi soniyadan ko'rinadi, javobni esa oldindan aytmaydi. */
.g7-set-cell.is-wait { opacity: .5; }
@media (prefers-reduced-motion: reduce) { .g7-eqb-op { animation-duration: .01ms; } }

/* ============================================================
   QAVS DARVOZASI (BracketGate, 5-dars). Naqsh 1-darsникi bilan BIR XIL:
   manba, undan ikki kabel, ikkita tablo, ular orasida halqa. Shuning uchun
   bu yerda YANGI keyframe yozilmaydi -- g7-hk-* dagi harakat qayta
   ishlatiladi, va sinf bitta qo'l yozuvida qoladi.
   DIQQAT: bu izohda TESKARI APOSTROF bo'lishi mumkin emas.
   ============================================================ */
.g7-gt-gate { animation: g7-hk-rise .5s cubic-bezier(.22,.9,.3,1.06) both; }
.g7-gt-outer { font-family: ${MATH_FONT}; font-weight: 800; font-size: 30px; fill: ${T.ink}; }
.g7-gt-badge { fill: ${T.accentSoft}; stroke: ${T.accent}; stroke-width: 2.2; }
.g7-gt-badgetxt { font-family: ${MATH_FONT}; font-weight: 800; font-size: 26px; fill: ${T.accent}; }
.g7-gt-box { fill: ${T.paperSolid}; stroke: ${T.line}; stroke-width: 1.4; }
.g7-gt-par { font-family: ${MATH_FONT}; font-weight: 700; font-size: 38px; fill: ${T.graph}; }
.g7-gt-in {
  font-family: ${MATH_FONT}; font-weight: 800; font-size: 25px; fill: ${T.ink};
  animation: g7-hk-drop .38s cubic-bezier(.33,0,.2,1) both;
}
.g7-gt-in.is-s1 { fill: ${T.stage1}; }
.g7-gt-in.is-s2 { fill: ${T.stage2}; }
.g7-gt-wire {
  fill: none; stroke: ${T.graph}; stroke-width: 2.4; stroke-linecap: round;
  stroke-dasharray: 120; stroke-dashoffset: 120;
  animation: g7-hk-draw .5s ease-out both;
}
.g7-gt-pulse {
  fill: none; stroke: ${T.accent}; stroke-width: 3.4; stroke-linecap: round;
  stroke-dasharray: 8 112;
  animation: g7-hk-run 1.9s linear infinite;
}
.g7-gt-board { animation: g7-hk-rise .52s cubic-bezier(.22,.9,.3,1.06) both; filter: drop-shadow(0 8px 12px rgba(24,34,36,.14)); }
.g7-gt-plate { fill: ${T.paperSolid}; stroke: ${T.line}; stroke-width: 1; transition: fill .45s ease, stroke .45s ease; }
.g7-gt-lcd { fill: ${T.dark}; }
.g7-gt-board.is-fixed .g7-gt-plate { fill: ${T.okSoft}; stroke: ${T.ok}; }
.g7-gt-board.is-fixable { cursor: pointer; }
.g7-gt-tok {
  font-family: ${MATH_FONT}; font-weight: 800; font-size: 21px; fill: ${T.ink};
  animation: g7-hk-drop .34s cubic-bezier(.33,0,.2,1) both;
}
.g7-gt-tok.is-s1 { fill: ${T.stage1}; }
.g7-gt-tok.is-s2 { fill: ${T.stage2}; }
.g7-gt-num { animation: g7-hk-pop .5s cubic-bezier(.22,.9,.3,1.2) both; }
/* Bosish nishoni element ICHIDA va besh marta chaqnaydi: pulsatsiya
   cheksiz emas (metodist qoidasi). */
.g7-gt-tap {
  fill: none; stroke: ${T.accent}; stroke-width: 2.6;
  animation: g7-hk-tapbeat 1.5s ease-in-out 5;
}
.g7-gt-ne { animation: g7-hk-pop .46s cubic-bezier(.22,.9,.3,1.2) both; }
.g7-gt-ring {
  fill: ${T.paperSolid}; stroke: ${T.accent}; stroke-width: 2.4;
  transform-box: fill-box; transform-origin: center;
  animation: g7-hk-breathe 2.4s ease-in-out 5;
}
.g7-gt-ne.is-fixed .g7-gt-ring { stroke: ${T.ok}; animation: none; }
.g7-gt-netxt { font-family: ${MATH_FONT}; font-weight: 800; font-size: 20px; fill: ${T.accent}; }
.g7-gt-ne.is-fixed .g7-gt-netxt { fill: ${T.ok}; }
@media (prefers-reduced-motion: reduce) {
  .g7-gt-gate, .g7-gt-in, .g7-gt-wire, .g7-gt-board, .g7-gt-tok,
  .g7-gt-num, .g7-gt-ne, .g7-gt-tap, .g7-gt-pulse, .g7-gt-ring { animation-duration: .01ms; }
}

/* Sahna O'LCHAMI budjetdan hisoblanadi, xohishdan emas. Bazaviy g7-scene
   noutbukda 310px kenglik beradi -- unda sonlar o'n piksellik bo'lib
   ko'rinmaydi. g7-scene-hero esa 835px beradi va to'rtinchi variantni
   ekrandan itarib chiqaradi (surat 2026-08-15). O'rta pog'ona:
   1366x615 da balandlik 150px, kenglik 547px.
   DIQQAT: bu izohda TESKARI APOSTROF bo'lishi mumkin emas -- u shablon
   satrini shu yerda yopadi va butun faylni buzadi (START_GRADE7.md §8). */
.g7-ride-mid { width: min(100%, calc(clamp(110px, calc(100dvh - 465px), 210px) * 620 / 170)); }
.g7-ride-tap {
  display: block; border: 0; font: inherit; color: inherit;
  cursor: pointer; -webkit-tap-highlight-color: transparent;
}
.g7-ride-tap[disabled] { cursor: default; }
/* Belgi oxirgi safarning USTIDA turadi, ya'ni aynan bosish kerak bo'lgan
   joyda. Ichkarisi nol o'lchamli, shuning uchun TapMark aynan shu nuqtaga
   markazlashadi. */
.g7-ride-hand { position: absolute; top: 56%; width: 0; height: 0; }
.g7-ride-hand .g7-tapmark { top: 0; }
/* Yangi safar PAYDO BO'LADI, sakramaydi: SVG guruhida faqat shaffoflik
   o'zgaradi (transform-box tuzog'iga tushmaslik uchun). */
.g7-ride-run { animation: g7-ridein .42s ease both; }
@keyframes g7-ridein { from { opacity: 0; } to { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .g7-ride-run { animation-duration: .01ms; } }

/* ============================================================
   TELEFON. BLOK ATAYIN ENG OXIRIDA.
   Sinfda telefonga tegishli qoidalar uch joyda tarqalgan: 660 balandlik,
   639.98 kenglik va 390 kenglik. Ikkita tuzoq shundan chiqadi:
     1. 390 li blok FAQAT eng tor telefonni tutadi. Son qatorining ixchamligi
        o'sha yerda edi, va 412 px li telefonda (Galaxy S20 Ultra -- QA aynan
        shunda ko'rgan) umuman ishlamasdi: o'lchov 390 da toza, jonli
        qurilmada esa son chetidan qirqilardi.
     2. 639.98 li blok asosiy g7-opt qoidalaridan OLDIN turadi, ya'ni bir
        sinfli qoidada undan kuchsizroq. Shuning uchun bu blok eng oxirida.
   ============================================================ */
@media (max-width: 639.98px) {
  .g7-opt { padding: 8px 12px; min-height: 46px; gap: 9px; }
  /* Son qatori: yorliq va ichki bo'shliq sonning joyini yemasin. */
  .g7-opt-numbox { padding-left: 6px; padding-right: 6px; gap: 4px; }
  .g7-opt-numbox .g7-opt-badge { min-width: 10px; font-size: 11px; }
  /* Chizma telefonda ham kichrayadi: past noutbukda bu bor (max-height 660),
     telefonda esa balandlik katta va o'sha qoida ishlamasdi. */
  .g7-fg-svg, .g7-pl-svg { max-height: 180px; width: auto; }
  .g7-drawslot { min-height: 0 !important; }
}
`
