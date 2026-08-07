// ============================================================================
// 10-sinf YADROSI. Bir marta yoziladi, hamma dars shuni ishlatadi.
// Kontrakt: src/books/grade11/PODXOD_11SINF.md
//
// DIZAYN v2 (metodist brifi 2026-08-06): «zamonaviy imtihon matematika
// laboratoriyasi» -- katta yoshli, premium, intellektual interfeys.
// 17-18 yoshli o'quvchi va DTM uchun. Maskot, medal, konfetti YO'Q.
//
// Fon, chiziqlar, to'r, egri chiziqlar -- FAQAT CSS va SVG. Rasm fayli yo'q.
//
// Ichida: uch til (L/tr), ovoz (HTTP TTS v5.2 + previu zaxirasi), javob tovushi,
// mobil zoom, navigatsiya qulfi (mute-xavfsiz), Stage, panellar, ustunlar,
// qoralamalar (localStorage), DTM tayyorlik halqasi, Feedback va primitivlar.
//
// STYLES ichida BACKTICK ISHLATILMAYDI -- shablon satrini uzib, faylni sindiradi.
//
// `import React` SHART: LMS xom jsx ni KLASSIK rejimda yuklaydi.
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

// Navigatsiya fazasi. Ishlab chiqishda erkin, sinf topshirilishidan oldin false.
export const FREE_NAV = true

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
  lessonNo: L('3-dars', 'Урок 3', 'Lesson 3'),
  notes: L('Qoralama', 'Заметки', 'Notes'),
  notesTitle: L('Mening qoralamalarim', 'Мои заметки', 'My notes'),
  notesHint: L(
    'Bu yerdagi yozuv bahoga TAʼSIR QILMAYDI',
    'Записи здесь не влияют на оценку',
    'Notes here do not affect your score',
  ),
  save: L('Saqlash', 'Сохранить', 'Save'),
  saved: L('Saqlandi', 'Сохранено', 'Saved'),
  close: L('Yopish', 'Закрыть', 'Close'),
  setChanged: L(
    "yechimlar to'plami O'ZGARDI",
    'множество решений ИЗМЕНИЛОСЬ',
    'the solution set CHANGED',
  ),
  baseNo1: L(
    "a = 1 da logarifm YO'Q",
    'при a = 1 логарифма НЕТ',
    'there is no logarithm when a = 1',
  ),
  grows: L("o'sadi", 'возрастает', 'increasing'),
  falls: L('kamayadi', 'убывает', 'decreasing'),
  dragMe: L('Nuqtani torting', 'Потяни точку', 'Drag the point'),
  cheatSheet: L('Shpargalka', 'Шпаргалка', 'Cheat sheet'),
  printIt: L('Chop etish', 'Распечатать', 'Print'),
  blockLabel: L('B1-blok', 'Блок Б1', 'Block B1'),
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
let ttsConfig = {
  ttsApiBase: '',
  correctSoundUrl: '',
  wrongSoundUrl: '',
  aiGradingEndpoint: '',
  studentName: '',
  voiceGender: 'm', // 10-sinf: erkak ovoz
}
export const configureLesson = (next) => {
  ttsConfig = { ...ttsConfig, ...next }
}

export function buildTtsUrl(base, text, gender) {
  const clean = String(base || '').replace(/\/$/, '')
  const g = gender === 'f' ? 'f' : 'm'
  return clean + '/api/tts?text=' + encodeURIComponent(String(text || '')) + '&g=' + g
}

const speechLocale = (lang) => (lang === 'ru' ? 'ru-RU' : lang === 'en' ? 'en-GB' : 'uz-UZ')

// Bo'lakni o'qish uchun BAHOLANGAN vaqt. Straj uchun va ovoz o'chiq bo'lganda
// ochilish tezligi uchun: ovoz yo'q bo'lsa ham ekran ASTA ochiladi.
// `?g10fast=1` -- FAQAT avtotekshiruv uchun tezlatish.
const NARRATION_DIVISOR =
  typeof window !== 'undefined' && /[?&]g10fast=1/.test(window.location.search) ? 8 : 1

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
    const base = ttsConfig.ttsApiBase
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
      if (started && typeof started.catch === 'function') started.catch(() => this.afterSegment())
      return
    }
    if (typeof window === 'undefined' || !window.speechSynthesis) { this.afterSegment(); return }
    const synth = window.speechSynthesis
    try { synth.cancel() } catch { /* previu cheklovi */ }
    const u = new window.SpeechSynthesisUtterance(text)
    u.lang = speechLocale(seg.lang || this.lang)
    u.rate = 0.98
    u.onend = () => this.afterSegment()
    u.onerror = () => this.afterSegment()
    this.isPlaying = true
    this.armWatchdog(text)
    try { synth.speak(u) } catch { this.afterSegment() }
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
    const base = ttsConfig.ttsApiBase
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
  const [state, setState] = useState({ isPlaying: false, completed: false, muted: mutedGlobal, index: 0 })
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
    engine.setGender(ttsConfig.voiceGender || 'm')
    if (state.muted) {
      engine.load([])
      setState((prev) => ({ ...prev, isPlaying: false, completed: true }))
      return () => engine.stop()
    }
    engine.load(stable)
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
    document.documentElement.style.setProperty('--g10-rev', ms + 'ms')
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
    const { correctSoundUrl, wrongSoundUrl } = ttsConfig
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
      root.style.setProperty('--g10z', String(z))
    }
    apply()
    window.addEventListener('resize', apply)
    window.addEventListener('orientationchange', apply)
    return () => {
      window.removeEventListener('resize', apply)
      window.removeEventListener('orientationchange', apply)
      root.style.removeProperty('--g10z')
    }
  }, [breakpoint])
}

// ============================================================
// 10-SINFGA XOS: QUTINI O'LCHASH VA TEKIS O'TISH.
// Birlik aylana kvadrat, shuning uchun u o'z qutisini o'lchab, ANIQ piksel
// oladi: flex ichida foizli balandlik hisoblanmaydi (svg 904px bo'lib ketardi).
// ============================================================
export function useBoxSize() {
  const ref = useRef(null)
  const [box, setBox] = useState({ w: 0, h: 0 })
  useEffect(() => {
    const el = ref.current
    if (!el || typeof ResizeObserver === 'undefined') return undefined
    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect
      setBox((prev) => {
        const w = Math.round(r.width)
        const h = Math.round(r.height)
        return prev.w === w && prev.h === h ? prev : { w, h }
      })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, box]
}

// Nuqta SAKRAMAYDI -- YURADI. Aynan harakat kosinus va sinus BITTA nuqtaning
// koordinatalari ekanini ko'rsatadi.
const easeInOut = (k) => (k < 0.5 ? 2 * k * k : 1 - ((-2 * k + 2) ** 2) / 2)

export function useTween(target, ms = 620) {
  const [value, setValue] = useState(target)
  const fromRef = useRef(target)
  const rafRef = useRef(0)
  useEffect(() => {
    if (typeof window === 'undefined') { setValue(target); return undefined }
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const from = fromRef.current
    if (reduce || ms <= 0 || from === target) {
      fromRef.current = target
      setValue(target)
      return undefined
    }
    const t0 = performance.now()
    const tick = (now) => {
      const k = Math.min(1, (now - t0) / ms)
      setValue(from + (target - from) * easeInOut(k))
      if (k < 1) rafRef.current = requestAnimationFrame(tick)
      else fromRef.current = target
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, ms])
  return value
}

// 350 dan 10 ga QISQA yo'l bilan boradi, teskari aylanmaydi.
export function useTweenAngle(target, ms = 620) {
  const unwrapped = useRef(target)
  const prev = useRef(target)
  if (target !== prev.current) {
    let d = target - ((unwrapped.current % 360) + 360) % 360
    if (d > 180) d -= 360
    if (d < -180) d += 360
    unwrapped.current += d
    prev.current = target
  }
  return useTween(unwrapped.current, ms)
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

export function useAdvanceGate(solved, audio) {
  const [delayElapsed, setDelayElapsed] = useState(false)
  useEffect(() => {
    if (!solved) return undefined
    const timer = setTimeout(() => setDelayElapsed(true), 900)
    return () => clearTimeout(timer)
  }, [solved])
  if (FREE_NAV) return true
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
const LAT_RE = /[A-Za-z]/
const isLat = (ch) => ch !== undefined && LAT_RE.test(ch)
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
    out.push(<i key={out.length} className="g10-var">{ch}</i>)
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
    if (mode === 'sub') out.push(<sub key={out.length} className="g10-idx">{buf}</sub>)
    else if (mode === 'sup') out.push(<sup key={out.length} className="g10-idx">{buf}</sup>)
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
  <div className="g10-eyebrow">
    <span>{children}</span>
    {right ? <span className="g10-eyebrow-right">{right}</span> : null}
  </div>
)

export const Title = ({ children }) => <h1 className="g10-title">{children}</h1>

export const Expr = ({ children, size = 'mid', tone, pop, style, className }) => (
  <div
    className={'g10-expr g10-expr-' + size + (pop ? ' g10-pop' : '') + (className ? ' ' + className : '')}
    style={{ ...(tone ? { color: tone } : null), ...style }}
  >
    <Fx>{children}</Fx>
  </div>
)

// Ish yuzasi. `tone`: paper (asosiy), quiet (fon), teal (grafik/ma'no), dark.
export const Panel = ({ children, style, className, tone = 'paper', pad }) => (
  <div
    className={'g10-panel g10-panel-' + tone + (className ? ' ' + className : '')}
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
    className={'g10-cols' + (grow ? ' g10-cols-grow' : '') + (className ? ' ' + className : '')}
    style={{ gridTemplateColumns: 'minmax(0,' + l + 'fr) minmax(0,' + r + 'fr)', alignItems: align, ...(gap !== undefined ? { gap } : null), ...style }}
  >
    {children}
  </div>
)

export const Col = ({ children, style, className, gap }) => (
  <div className={'g10-col' + (className ? ' ' + className : '')} style={{ ...(gap !== undefined ? { gap } : null), ...style }}>
    {children}
  </div>
)

// Xizmat yorlig'i: katta harf, keng trekingli.
export const Tag = ({ children, tone = 'quiet', style }) => (
  <span className={'g10-tag g10-tag-' + tone} style={style}>{children}</span>
)

export const Btn = ({ children, onClick, disabled, tone = 'solid', ready, style, title }) => (
  <button
    type="button"
    className={'g10-btn g10-btn-' + tone + (ready && !disabled ? ' g10-btn-ready' : '')}
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
export const Options = ({ items, picked, wrong, onPick, disabled, cols = 2, minH, collapse = true, badges = true, dense = false }) => {
  const solved = !!picked
  const shrink = solved && collapse
  return (
    <div
      className={'g10-options' + (dense ? ' g10-options-dense' : '')}
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
        const cls = ['g10-opt']
        if (isPicked) cls.push('g10-opt-ok')
        else if (isWrong) cls.push('g10-opt-tip')
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
              <span className="g10-opt-badge" style={{ color: isPicked ? T.ok : isWrong ? T.tip : T.ink3 }}>
                {isPicked ? '✓' : isWrong ? '↺' : BADGES[i]}
              </span>
            ) : null}
            <span className={'g10-opt-text' + (looksMath(item.label) ? ' g10-opt-math' : '')}>
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
  <div className="g10-done">
    <span className="g10-done-tick">{'✓'}</span>
    <span className="g10-done-text"><Fx>{children}</Fx></span>
  </div>
)

// Feedback. Skroll YO'Q: blok oldindan band qilingan slot ichida ochiladi.
export const Feedback = ({ show, ok, children }) => {
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
      className={'g10-fb ' + (ok ? 'g10-fb-ok' : 'g10-fb-tip') + (visible ? ' g10-fb-on' : '')}
      aria-label={tr(ok ? UI_TXT.right : UI_TXT.hint, lang)}
    >
      <span className="g10-fb-glyph" aria-hidden="true">{ok ? '✓' : '↺'}</span>
      <span className="g10-fb-body">{children}</span>
    </div>
  )
}

export const Hint = ({ children }) => (children ? <p className="g10-hint">{children}</p> : null)

// ============================================================
// LawBox -- QOIDA va QONUN uchun ramka. Metodist talabi 2026-08-06:
// asosiy formulalar ramkaga olinsin va vizual urg'u berilsin, ular oddiy
// ish yozuvidan farq qilib turishi kerak.
// ============================================================
export const LawBox = ({ label, formula, note, tone = 'accent' }) => (
  <div className={'g10-law g10-law-' + tone} style={label ? undefined : { marginTop: 8 }}>
    {label ? <span className="g10-law-label">{label}</span> : null}
    <span className="g10-law-f"><Fx>{formula}</Fx></span>
    {note ? <span className="g10-law-note"><Fx>{note}</Fx></span> : null}
  </div>
)

// Insight -- BONUS va LAYFXAK bloklari. Bir gap, ortiq emas.
export const Insight = ({ label, children, tone = 'graph' }) => (
  <div className={'g10-insight g10-insight-' + tone}>
    <span className="g10-insight-label">{label}</span>
    <span className="g10-insight-body">{children}</span>
  </div>
)

// Qoida kartochkasi -- TO'Q yuza (#1F292B). Satrlar 180 ms oralab ochiladi.
export const RuleCard = ({ badge, lines, example, wide, law, laws, lawLabel }) => (
  <div className={'g10-rule' + (wide ? ' g10-rule-wide' : '')}>
    <span className="g10-rule-badge">{badge}</span>
    {law ? <LawBox label={lawLabel || badge} formula={law} tone="dark" /> : null}
    {laws ? laws.map((w, i) => (
      <LawBox key={i} label={i === 0 ? (lawLabel || badge) : null} formula={w.formula} note={w.note} tone="dark" />
    )) : null}
    <span className="g10-rule-rule" aria-hidden="true" />
    {lines.map((line, i) => (
      <span key={i} className="g10-rule-line" style={{ animationDelay: i * 0.18 + 's' }}><Fx>{line}</Fx></span>
    ))}
    {example ? (
      <span className="g10-rule-example" style={{ animationDelay: lines.length * 0.18 + 's' }}><Fx>{example}</Fx></span>
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
    <div className="g10-ring">
      <svg width={size} height={size} viewBox={'0 0 ' + size + ' ' + size} role="img" aria-label={String(value) + '/' + String(total)}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={T.line} strokeWidth="9" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={tone} strokeWidth="9" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - frac)}
          transform={'rotate(-90 ' + size / 2 + ' ' + size / 2 + ')'}
          className="g10-ring-arc"
        />
        <text x={size / 2} y={size / 2 + 2} textAnchor="middle" className="g10-ring-num" fill={tone}>{value}</text>
        <text x={size / 2} y={size / 2 + 22} textAnchor="middle" className="g10-ring-den" fill={T.ink2}>{'/ ' + total}</text>
      </svg>
      {label ? <span className="g10-ring-label">{label}</span> : null}
      {sub ? <span className="g10-ring-sub">{sub}</span> : null}
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
    <span className="g10-timer" title={label}>
      <span className="g10-timer-dot" />
      <span className="g10-mono">{mm + ':' + ss}</span>
    </span>
  )
}

// ============================================================
// FON: faqat CSS gradientlar + mahalliy SVG egri chiziqlar.
// Rasm fayli, tashqi URL YO'Q. Opacity 0.04-0.12 oralig'ida.
// ============================================================
const BgCurves = () => (
  <svg className="g10-bgcurves" viewBox="0 0 520 900" preserveAspectRatio="none" aria-hidden="true" focusable="false">
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
const NOTES_KEY = 'g10-notes-alg_10_03'

const NotesPanel = ({ open, onClose }) => {
  const t = useT()
  const [text, setText] = useState('')
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    if (!open || typeof window === 'undefined') return
    try { setText(window.localStorage.getItem(NOTES_KEY) || '') } catch { /* xususiy rejim */ }
  }, [open])

  if (!open) return null

  const save = () => {
    try { window.localStorage.setItem(NOTES_KEY, text) } catch { /* xususiy rejim */ }
    setFlash(true)
    setTimeout(() => setFlash(false), 1400)
  }

  return (
    <div className="g10-notes-wrap" role="dialog" aria-label={t(UI_TXT.notesTitle)}>
      <div className="g10-notes">
        <div className="g10-notes-head">
          <span className="g10-tag g10-tag-quiet">{t(UI_TXT.notesTitle)}</span>
          <button type="button" className="g10-icon" onClick={onClose} aria-label={t(UI_TXT.close)}>{'✕'}</button>
        </div>
        <textarea
          className="g10-notes-area"
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
        />
        <div className="g10-notes-foot">
          <span className="g10-notes-hint">{t(UI_TXT.notesHint)}</span>
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
    try { setText(window.localStorage.getItem(NOTES_KEY) || '') } catch { /* xususiy rejim */ }
  }, [])
  const save = () => {
    try { window.localStorage.setItem(NOTES_KEY, text) } catch { /* xususiy rejim */ }
    setFlash(true)
    setTimeout(() => setFlash(false), 1400)
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
      <Tag tone="quiet">{t(UI_TXT.notesTitle)}</Tag>
      <textarea
        className="g10-notes-area"
        rows={rows}
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
        style={{ flex: 'none', minHeight: 0 }}
      />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
        <span className="g10-notes-hint" style={{ flex: 1, minWidth: 90 }}>{t(UI_TXT.notesHint)}</span>
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
    <span className="g10-langsw" role="group" aria-label="Til / Язык / Language">
      {LANGS.map((l) => (
        <button
          type="button"
          key={l.id}
          className={'g10-langsw-b' + (l.id === lang ? ' is-on' : '')}
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
    <span className="g10-bmap" title={label}>
      <span className="g10-bmap-label">{label}</span>
      {Array.from({ length: n }, (_, i) => {
        const no = from + i
        return (
          <i
            key={no}
            className={'g10-bmap-i' + (no < current ? ' is-done' : no === current ? ' is-now' : '')}
          />
        )
      })}
      <span className="g10-bmap-num g10-mono">{current - from + 1}/{n}</span>
    </span>
  )
}

// Chop etiladigan shpargalka. Ekranda KO'RINMAYDI, faqat chop etishda.
export const PrintSheet = ({ title, law, steps, lifehack, source }) => (
  <div className="g10-print" aria-hidden="true">
    <h2>{title}</h2>
    <p className="g10-print-law"><Fx>{law}</Fx></p>
    <ol>
      {steps.map((x, i) => <li key={i}><Fx>{x}</Fx></li>)}
    </ol>
    <p className="g10-print-life">{lifehack}</p>
    {source ? <p className="g10-print-src">{source}</p> : null}
  </div>
)

// ============================================================
// STAGE. Yuqori panel (M11, fan, 15 bo'lakli progress, bo'lim, raqam,
// qoralama / qayta / ovoz), kontent, pastki navigatsiya.
// .stage-content -- overflow: clip, SKROLL YO'Q.
// ============================================================
export const Stage = ({ eyebrow, right, block, screen, total, audio, nav, navCenter, children }) => {
  const t = useT()
  const [notesOpen, setNotesOpen] = useState(false)
  const sect = sectionOf(screen)
  const [from, to] = SECTION_RANGE[sect]
  const inSection = screen - from + 1
  const sectionSize = to - from + 1

  return (
    <div className="stage">
      <div className="stage-header">
        <div className="g10-top">
          <span className="g10-mark" aria-hidden="true">M<b>10</b></span>
          <span className="g10-top-title">
            {t(UI_TXT.subject)}<span className="g10-dot">{'·'}</span>{t(UI_TXT.lessonNo)}
          </span>
          <span className="g10-seg" role="img" aria-label={String(screen + 1) + '/' + String(total)}>
            {Array.from({ length: total }, (_, i) => (
              <i key={i} className={'g10-seg-i' + (i < screen ? ' is-done' : i === screen ? ' is-now' : '')} />
            ))}
          </span>
          <span className="g10-top-sect">{t(UI_TXT.sections[sect])}</span>
          <span className="g10-count g10-mono">{screen + 1}/{total}</span>
          <span className="g10-top-tools">
            <LangSwitch />
            {/* Tugmalarga VIZUAL URG'U: yorliq bilan, kattaroq, holati ko'rinadi */}
            <button type="button" className={'g10-tool' + (notesOpen ? ' is-on' : '')} onClick={() => setNotesOpen((v) => !v)} title={t(UI_TXT.notes)} aria-label={t(UI_TXT.notes)}>
              <b aria-hidden="true">{'✎'}</b><i>{t(UI_TXT.notes)}</i>
            </button>
            <button type="button" className="g10-tool" onClick={audio.replay} title={t(UI_TXT.replay)} aria-label={t(UI_TXT.replay)}>
              <b aria-hidden="true">{'↺'}</b>
            </button>
            <button
              type="button"
              className={'g10-tool g10-tool-sound' + (audio.muted ? ' is-off' : ' is-on')}
              onClick={audio.toggleMute}
              title={t(UI_TXT.sound)}
              aria-label={t(UI_TXT.sound)}
            >
              <b aria-hidden="true">{audio.muted ? '✕' : '♪'}</b>
              {audio.isPlaying ? <s className="g10-tool-wave" aria-hidden="true" /> : null}
            </button>
          </span>
        </div>
        {eyebrow || right || block ? (
          <div className="g10-eyebrow">
            <span>{eyebrow}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
              {block ? <BlockMap {...block} /> : null}
              {right ? <span className="g10-eyebrow-right g10-mono">{right}</span> : null}
            </span>
          </div>
        ) : null}
      </div>

      <div className="stage-content">
        <div className="g10-stack">{children}</div>
        <NotesPanel open={notesOpen} onClose={() => setNotesOpen(false)} />
      </div>

      <div className="stage-nav">
        <span className="g10-nav-l">{nav && nav.back}</span>
        <span className="g10-nav-c g10-mono">
          {navCenter || (t(UI_TXT.sections[sect]) + '  ' + inSection + ' / ' + sectionSize)}
        </span>
        <span className="g10-nav-r">{nav && nav.next}</span>
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
  zoom: var(--g10z, 1);
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
@media (min-width: 1024px) {
  .stage-header { padding-left: 92px; }
}
.g10-bgcurves {
  position: absolute;
  top: 0; right: 0; bottom: 0;
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
.g10-nav-l { justify-self: start; }
.g10-nav-c { justify-self: center; font-size: clamp(10px, .85vw, 12px); letter-spacing: .12em; text-transform: uppercase; color: ${T.ink2}; white-space: nowrap; }
.g10-nav-r { justify-self: end; }
.g10-stack {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: clamp(6px, 1.1vh, 13px);
}

/* ============ YUQORI PANEL ============ */
.g10-top { display: flex; align-items: center; gap: clamp(8px, 1.4vw, 16px); min-width: 0; }
.g10-mark {
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
.g10-mark b { color: ${T.accent}; font-weight: 700; }
.g10-top-title {
  flex-shrink: 0;
  font-size: clamp(10px, .85vw, 12px);
  letter-spacing: .14em;
  text-transform: uppercase;
  font-weight: 600;
  color: ${T.ink2};
  white-space: nowrap;
}
.g10-dot { padding: 0 .5em; color: ${T.ink3}; }
.g10-seg { flex: 1; min-width: 40px; display: flex; gap: 3px; align-items: center; }
.g10-seg-i {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: rgba(23,26,29,.12);
  transition: background .3s cubic-bezier(.22,.61,.36,1), transform .3s cubic-bezier(.22,.61,.36,1);
}
.g10-seg-i.is-done { background: ${T.graph}; }
.g10-seg-i.is-now { background: ${T.accent}; transform: scaleY(2); }
.g10-top-sect {
  flex-shrink: 0;
  font-family: 'Fraunces', 'Source Serif 4', Georgia, serif;
  font-size: clamp(12px, 1.05vw, 15px);
  font-weight: 600;
  color: ${T.ink};
  white-space: nowrap;
}
.g10-count { flex-shrink: 0; font-size: clamp(10px, .9vw, 12px); font-weight: 700; color: ${T.ink2}; }
.g10-top-tools { flex-shrink: 0; display: flex; gap: 6px; }
.g10-icon {
  width: 30px; height: 30px; padding: 0; border: 0; border-radius: 10px;
  background: ${T.paper}; color: ${T.ink2}; cursor: pointer; line-height: 1;
  font-size: 13px;
  box-shadow: 0 2px 9px -5px rgba(${T.shadow},.4), inset 0 0 0 1px ${T.line};
  transition: box-shadow .24s cubic-bezier(.22,.61,.36,1), color .24s, transform .24s cubic-bezier(.22,.61,.36,1);
}
.g10-icon:hover { transform: translateY(-1px); box-shadow: 0 6px 15px -6px rgba(${T.shadow},.45), inset 0 0 0 1px ${T.line}; }
.g10-icon.is-on { color: ${T.graph}; box-shadow: 0 2px 9px -5px rgba(${T.shadow},.4), inset 0 0 0 1px rgba(23,108,112,.4); }

/* ============ TIPOGRAFIKA ============ */
.g10-eyebrow {
  display: flex; align-items: baseline; justify-content: space-between; gap: 10px;
  font-size: clamp(10px, .85vw, 12px); letter-spacing: .16em; text-transform: uppercase;
  font-weight: 600; color: ${T.ink2}; flex-shrink: 0; min-width: 0;
}
.g10-eyebrow > span:first-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.g10-eyebrow-right { color: ${T.accent}; flex-shrink: 0; letter-spacing: .06em; }
.g10-title {
  font-family: 'Fraunces', 'Source Serif 4', Georgia, serif;
  font-weight: 600;
  line-height: 1.05;
  letter-spacing: -.015em;
  font-size: clamp(18px, 2.35vw, 33px);
  flex-shrink: 0;
}
.g10-expr, .g10-mono {
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
.g10-var { font-style: italic; font-synthesis: none; }
.g10-expr { text-align: center; white-space: nowrap; }
.g10-wrap { white-space: normal; overflow-wrap: anywhere; }
.g10-expr-hero { font-size: clamp(26px, 3.1vw, 40px); letter-spacing: -.02em; }
.g10-expr-big { font-size: clamp(22px, 2.4vw, 30px); }
.g10-expr-mid { font-size: clamp(18px, 1.8vw, 24px); }
.g10-expr-row { font-size: clamp(16px, 1.6vw, 22px); text-align: left; }
.g10-expr-sm { font-size: clamp(13px, 1.15vw, 15px); text-align: left; }
/* Serifda indeks monoshriftdagidan kichikroq va boshqa balandlikda
   o'tiradi; og'irligi bir pog'ona ko'tarildi -- aks holda mayda indeks
   asosiy satrdan solg'in ko'rinadi. */
.g10-idx { font-size: max(10.5px, .68em); font-weight: 700; letter-spacing: .01em; font-style: normal; }
sub.g10-idx { vertical-align: -.20em; }
sup.g10-idx { vertical-align: .46em; }
.g10-hint { font-size: clamp(14px, 1.15vw, 16px); line-height: 1.45; color: ${T.ink2}; }
.g10-ask { font-size: clamp(14px, 1.2vw, 16px); line-height: 1.4; font-weight: 700; color: ${T.ink}; }
.g10-tag {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: clamp(10px, .82vw, 11.5px); letter-spacing: .15em; text-transform: uppercase; font-weight: 700;
  padding: 4px 9px; border-radius: 7px; white-space: nowrap;
}
.g10-tag-quiet { color: ${T.ink2}; background: rgba(23,26,29,.05); }
.g10-tag-accent { color: ${T.accent}; background: ${T.accentSoft}; }
.g10-tag-graph { color: ${T.graph}; background: ${T.graphSoft}; }
.g10-tag-ok { color: ${T.ok}; background: ${T.okSoft}; }
.g10-tag-tip { color: ${T.tip}; background: ${T.tipSoft}; }

/* ============ USTUNLAR ============ */
.g10-cols {
  display: grid;
  gap: clamp(10px, 1.6vw, 26px);
  /* min-height: 0 EMAS. Flex ustunda u konteynerni kontentdan kichik qilib
     siqar, kontent esa tashqariga chiqib keyingi blok ustiga minardi --
     scrollHeight o'smaganligi uchun tekshiruv ham ko'rmasdi. */
  min-height: min-content;
}
.g10-cols-grow { flex: 1; }
.g10-col { display: flex; flex-direction: column; gap: clamp(6px, 1.1vh, 13px); min-width: 0; min-height: 0; }
.g10-cols3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(7px, 1vw, 14px); min-width: 0; }
.g10-cols3 > * { min-width: 0; }
@media (max-width: 859.98px) {
  /* Telefonda ustunlar VERTIKAL bo'limlarga aylanadi, ma'no tartibi saqlanadi.
     Balandliklar qo'shilganligi uchun yuzalar va matn bir pog'ona kichrayadi. */
  .g10-cols { grid-template-columns: minmax(0, 1fr) !important; gap: clamp(6px, 1.2vh, 10px); }
  .g10-cols3 { grid-template-columns: minmax(0, 1fr); gap: clamp(5px, 1vh, 8px); }
  .g10-panel { padding: 9px 10px; border-radius: 13px; }
  .g10-col { gap: 6px; }
  .g10-stack { gap: 7px; }
  .g10-opt { min-height: 42px; padding: 8px 12px; }
  .g10-options { gap: 6px; }
  .g10-title { font-size: 19px; }
  .g10-law { padding: 9px 11px; }
  .g10-rule { padding: 10px 12px; gap: 3px; }
  .g10-fold-item { font-size: 11px; }
  .g10-fold-list { gap: 9px; }
  /* Nuqta tanlagich telefonda QATOR bo'ladi: uch tugma ustma-ust 120px olardi */
  .g10-pick-v { flex-direction: row !important; flex-wrap: wrap !important; }
  .g10-pick-v > button { flex: 1; min-width: 84px; }
}

/* ============ YUZALAR ============ */
.g10-panel {
  border-radius: 16px;
  padding: clamp(10px, 1.5vw, 18px);
  overflow: clip;
  min-width: 0;
}
.g10-panel-paper {
  background: ${T.paper};
  box-shadow: 0 10px 26px -12px rgba(${T.shadow},.22), inset 0 0 0 1px ${T.line};
}
.g10-panel-quiet {
  background: rgba(255,253,248,.55);
  box-shadow: inset 0 0 0 1px ${T.line};
}
.g10-panel-teal {
  background: ${T.graphSoft};
  box-shadow: inset 0 0 0 1px rgba(23,108,112,.22);
}
.g10-panel-dark {
  background: ${T.dark};
  color: ${T.paper};
  box-shadow: 0 14px 32px -14px rgba(${T.shadow},.55);
}
.g10-panel-dark .g10-hint, .g10-panel-dark .g10-ask { color: rgba(255,253,248,.72); }

/* ============ VARIANTLAR ============ */
.g10-options { display: grid; gap: clamp(7px, .9vw, 11px); flex-shrink: 0; }
.g10-opt {
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
.g10-options-dense .g10-opt { min-height: clamp(38px, 2.9vw, 44px); padding: 7px 12px; font-size: clamp(12px, 1vw, 13.5px); }
.g10-opt:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 26px -14px rgba(${T.shadow},.5), inset 0 0 0 1px ${T.line}; }
.g10-opt:disabled { cursor: default; }
.g10-opt-math {
  font-family: ${MATH_FONT};
  font-weight: 600;
  letter-spacing: 0;
  word-spacing: .1em;
  font-variant-numeric: tabular-nums lining-nums;
  font-size: 1.06em;
}
.g10-opt-badge { flex-shrink: 0; min-width: 16px; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; font-weight: 700; }
.g10-opt-text { flex: 1; }
/* YASHIL faqat tasdiqdan keyin. */
.g10-opt-ok { background: ${T.okSoft}; color: ${T.ok}; box-shadow: 0 10px 24px -14px rgba(40,119,74,.5), inset 0 0 0 1px rgba(40,119,74,.3); }
/* Xato urinish AMBER, qizil EMAS. */
.g10-opt-tip { background: ${T.tipSoft}; color: ${T.tip}; box-shadow: 0 10px 24px -14px rgba(165,93,25,.45), inset 0 0 0 1px rgba(165,93,25,.26); }

/* ============ TUGMALAR ============ */
.g10-btn {
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
.g10-btn-solid { background: ${T.ink}; color: ${T.paper}; box-shadow: 0 10px 24px -12px rgba(${T.shadow},.6); }
.g10-btn-solid:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 16px 30px -12px rgba(${T.shadow},.7); }
.g10-btn-accent { background: ${T.accent}; color: #fff; box-shadow: 0 10px 24px -12px rgba(201,84,44,.75); }
.g10-btn-accent:hover:not(:disabled) { transform: translateY(-2px); background: #B44822; }
.g10-btn-ok { background: ${T.okSoft}; color: ${T.ok}; box-shadow: inset 0 0 0 1px rgba(40,119,74,.3); }
.g10-btn-ghost { background: transparent; color: ${T.ink2}; padding: 0 clamp(10px, 1.1vw, 16px); }
.g10-btn-ghost:hover:not(:disabled) { color: ${T.ink}; background: rgba(255,253,248,.7); box-shadow: inset 0 0 0 1px ${T.line}; }
.g10-btn-soft { background: ${T.paper}; color: ${T.ink}; box-shadow: 0 8px 20px -14px rgba(${T.shadow},.4), inset 0 0 0 1px ${T.line}; }
.g10-btn-soft:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 26px -14px rgba(${T.shadow},.5), inset 0 0 0 1px ${T.line}; }
.g10-btn:disabled { opacity: .38; cursor: not-allowed; box-shadow: none; transform: none; }
/* Kutilayotgan tugma: FAQAT soya halqasi. scale YO'Q -- keng tugmada gorizontal
   oshib ketish beradi (7-sinfda 40px bergan edi). */
.g10-btn-ready { animation: g10-ready 1.9s ease-in-out infinite; }
@keyframes g10-ready {
  0%, 100% { box-shadow: 0 10px 24px -12px rgba(201,84,44,.7), 0 0 0 0 rgba(201,84,44,.42); }
  55% { box-shadow: 0 14px 28px -12px rgba(201,84,44,.8), 0 0 0 8px rgba(201,84,44,0); }
}

/* ============ QATOR, MASLAHAT, QOIDA ============ */
.g10-done {
  display: flex; align-items: flex-start; gap: 8px; flex-shrink: 0; min-width: 0;
  font-size: clamp(12px, 1vw, 13.5px); color: ${T.ink2};
}
.g10-done-tick { color: ${T.ok}; font-weight: 800; flex-shrink: 0; }
.g10-done-text { font-family: ${MATH_FONT}; min-width: 0; white-space: normal; overflow-wrap: anywhere; }

.g10-fb {
  display: flex; flex-direction: row; align-items: center; gap: clamp(9px, 1.2vw, 14px);
  padding: clamp(8px, 1vw, 12px) clamp(11px, 1.3vw, 16px);
  border-radius: 14px;
  border-left: 4px solid transparent;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity .32s cubic-bezier(.22,.61,.36,1), transform .32s cubic-bezier(.22,.61,.36,1);
}
.g10-fb-on { opacity: 1; transform: translateY(0); }
.g10-fb-ok { background: ${T.okSoft}; border-left-color: ${T.ok}; }
.g10-fb-tip { background: ${T.tipSoft}; border-left-color: ${T.tip}; }
.g10-fb-glyph {
  flex-shrink: 0;
  width: clamp(26px, 2.2vw, 32px); height: clamp(26px, 2.2vw, 32px);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: clamp(13px, 1.1vw, 16px); font-weight: 800; line-height: 1;
}
.g10-fb-ok .g10-fb-glyph { background: rgba(40,119,74,.14); color: ${T.ok}; }
.g10-fb-tip .g10-fb-glyph { background: rgba(165,93,25,.14); color: ${T.tip}; }
.g10-fb-body {
  flex: 1; min-width: 0;
  font-family: 'Source Serif 4', Georgia, serif;
  font-weight: 600;
  font-size: clamp(13px, 1.2vw, 17px);
  line-height: 1.28;
}
.g10-fb-ok .g10-fb-body { color: ${T.ok}; }
.g10-fb-tip .g10-fb-body { color: ${T.tip}; }

.g10-rule {
  display: flex; flex-direction: column; gap: 5px; flex-shrink: 0;
  padding: clamp(12px, 1.5vw, 20px) clamp(13px, 1.6vw, 22px);
  border-radius: 16px;
  background: ${T.dark};
  color: ${T.paper};
  box-shadow: 0 16px 34px -16px rgba(${T.shadow},.6);
}
.g10-rule-badge { font-size: clamp(9.5px, .8vw, 11px); font-weight: 800; letter-spacing: .16em; text-transform: uppercase; color: ${T.accent}; }
.g10-rule-rule { display: block; height: 1px; background: rgba(255,253,248,.16); margin: 3px 0 5px; }
.g10-rule-line, .g10-rule-example {
  /* Qoida satrlari matematika bilan aralash (formula + izoh) -- hammasi
     serif, tepasidagi qonun qutisi bilan bir tilda ko'rinadi. */
  font-family: ${MATH_FONT};
  font-size: clamp(12.5px, 1.1vw, 15px);
  line-height: 1.34;
  opacity: 0;
  animation: g10-in .42s cubic-bezier(.22,.61,.36,1) forwards;
  color: rgba(255,253,248,.94);
}
.g10-rule-line:first-of-type { font-weight: 700; color: ${T.paper}; }
.g10-rule-example { font-family: ${MATH_FONT}; color: rgba(255,253,248,.5); font-size: clamp(10.5px, .9vw, 12px); }
.g10-rule-wide .g10-rule-line { font-size: clamp(13px, 1.2vw, 16px); }

/* ============ QOIDA RAMKASI (LawBox) ============ */
.g10-law {
  position: relative;
  display: flex; flex-direction: column; gap: 3px;
  padding: clamp(10px, 1.2vw, 15px) clamp(12px, 1.4vw, 18px);
  border-radius: 13px;
  margin: 2px 0 4px;
}
.g10-law-accent {
  background: ${T.paper};
  box-shadow: inset 0 0 0 2px ${T.accent}, 0 10px 26px -16px rgba(201,84,44,.5);
}
.g10-law-graph {
  background: ${T.graphSoft};
  box-shadow: inset 0 0 0 2px ${T.graph};
}
/* To'q kartochka ichida: yorug' ramka */
.g10-law-dark {
  background: rgba(255,253,248,.06);
  box-shadow: inset 0 0 0 2px rgba(201,84,44,.85);
}
.g10-law-label {
  position: absolute; top: -8px; left: 12px;
  font-size: clamp(9px, .75vw, 10.5px); font-weight: 800;
  letter-spacing: .18em; text-transform: uppercase;
  padding: 2px 7px; border-radius: 5px;
  background: ${T.accent}; color: #fff;
  white-space: nowrap;
}
.g10-law-graph .g10-law-label { background: ${T.graph}; }
.g10-law-f {
  font-family: ${MATH_FONT};
  font-weight: 600;
  letter-spacing: 0;
  font-variant-ligatures: none;
  font-size: clamp(14px, 1.35vw, 19px);
  line-height: 1.35;
  padding-top: 3px;
  overflow-wrap: anywhere;
}
.g10-law-dark .g10-law-f { color: ${T.paper}; }
.g10-law-note { font-size: clamp(11px, .95vw, 12.5px); color: ${T.ink2}; line-height: 1.3; }
.g10-law-dark .g10-law-note { color: rgba(255,253,248,.6); }

/* ============ BONUS va LAYFXAK ============ */
.g10-insight {
  position: relative;
  display: flex; flex-direction: column; gap: 4px;
  padding: clamp(9px, 1.1vw, 14px) clamp(11px, 1.3vw, 16px);
  border-radius: 13px;
  border-left: 4px solid ${T.graph};
  background: ${T.graphSoft};
}
.g10-insight-accent { border-left-color: ${T.accent}; background: ${T.accentSoft}; }
.g10-insight-label {
  font-size: clamp(9.5px, .8vw, 11px); font-weight: 800;
  letter-spacing: .18em; text-transform: uppercase; color: ${T.graph};
}
.g10-insight-accent .g10-insight-label { color: ${T.accent}; }
.g10-insight-body { font-size: clamp(12.5px, 1.05vw, 14px); line-height: 1.42; color: ${T.ink}; }

/* ============ HALQA, TAYMER ============ */
.g10-ring { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.g10-ring-arc { transition: stroke-dashoffset .7s cubic-bezier(.22,.61,.36,1); }
.g10-ring-num { font-family: ${MATH_FONT}; font-size: 30px; font-weight: 700; }
.g10-ring-den { font-family: ${MATH_FONT}; font-size: 12px; }
.g10-ring-label { font-size: clamp(10px, .85vw, 11.5px); letter-spacing: .14em; text-transform: uppercase; font-weight: 700; color: ${T.ink2}; text-align: center; }
.g10-ring-sub { font-size: clamp(11px, 1vw, 13px); color: ${T.ink}; text-align: center; font-weight: 600; }
.g10-timer {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: clamp(11px, .95vw, 13px); color: ${T.ink2};
  padding: 3px 9px; border-radius: 99px; background: rgba(23,26,29,.05);
}
.g10-timer-dot { width: 6px; height: 6px; border-radius: 50%; background: ${T.graph}; opacity: .8; }

/* ============ TIL ALMASHTIRGICH ============ */
.g10-langsw { display: inline-flex; gap: 2px; padding: 2px; border-radius: 10px; background: rgba(23,26,29,.05); }
.g10-langsw-b {
  border: 0; cursor: pointer; padding: 4px 8px; border-radius: 8px;
  font-family: 'Manrope', sans-serif; font-size: 11px; font-weight: 800; letter-spacing: .06em;
  background: transparent; color: ${T.ink3};
  transition: background .24s cubic-bezier(.22,.61,.36,1), color .24s;
}
.g10-langsw-b:hover { color: ${T.ink}; }
.g10-langsw-b.is-on { background: ${T.paper}; color: ${T.accent}; box-shadow: 0 2px 8px -5px rgba(${T.shadow},.4); }

/* ============ ASBOB TUGMALARI: URG'U ============ */
.g10-tool {
  display: inline-flex; align-items: center; gap: 6px;
  height: 34px; padding: 0 10px; border: 0; border-radius: 11px; cursor: pointer;
  background: ${T.paper}; color: ${T.ink2};
  box-shadow: 0 3px 12px -7px rgba(${T.shadow},.5), inset 0 0 0 1px ${T.line};
  transition: transform .24s cubic-bezier(.22,.61,.36,1), box-shadow .24s, color .24s, background .24s;
}
.g10-tool b { font-size: 14px; line-height: 1; font-weight: 700; }
.g10-tool i {
  font-style: normal; font-size: 10.5px; font-weight: 700;
  letter-spacing: .12em; text-transform: uppercase;
}
@media (max-width: 899.98px) { .g10-tool i { display: none; } }
.g10-tool:hover { transform: translateY(-2px); color: ${T.ink}; box-shadow: 0 8px 18px -8px rgba(${T.shadow},.5), inset 0 0 0 1px ${T.line}; }
.g10-tool.is-on { color: ${T.accent}; box-shadow: 0 3px 12px -7px rgba(201,84,44,.6), inset 0 0 0 1.5px rgba(201,84,44,.55); }
.g10-tool-sound.is-on { color: ${T.graph}; box-shadow: 0 3px 12px -7px rgba(23,108,112,.6), inset 0 0 0 1.5px rgba(23,108,112,.5); }
.g10-tool-sound.is-off { color: ${T.ink3}; opacity: .75; }
.g10-tool-wave {
  display: block; width: 5px; height: 5px; border-radius: 50%;
  background: ${T.graph}; animation: g10-wave 1.1s ease-in-out infinite;
}
@keyframes g10-wave { 0%, 100% { opacity: .35; transform: scale(.8); } 50% { opacity: 1; transform: scale(1.25); } }

/* ============ KUTISH IMPULSI ============
   O'quvchi keyingi narsa QAYERDA paydo bo'lishini oldindan biladi: bo'sh joy
   ikki marta yumshoq yorishadi. Cheksiz EMAS, bezak emas -- ishora. */
.g10-await { position: relative; }
.g10-await::after {
  content: '';
  /* inset 0: ilgari -3px edi va konteynerdan 3px chiqib ketardi */
  position: absolute; inset: 0;
  border-radius: 14px;
  box-shadow: inset 0 0 0 1.5px rgba(201,84,44,.4), inset 0 0 16px 0 rgba(201,84,44,.14);
  animation: g10-await 1.5s cubic-bezier(.22,.61,.36,1) 2;
  pointer-events: none;
}
@keyframes g10-await { 0%, 100% { opacity: 0; } 50% { opacity: 1; } }

/* ============ BLOK XARITASI ============ */
.g10-bmap { display: inline-flex; align-items: center; gap: 4px; }
.g10-bmap-label { font-size: clamp(9px, .75vw, 10.5px); letter-spacing: .14em; color: ${T.ink3}; margin-right: 3px; }
.g10-bmap-i { width: 12px; height: 3px; border-radius: 2px; background: rgba(23,26,29,.14); }
.g10-bmap-i.is-done { background: rgba(23,108,112,.55); }
.g10-bmap-i.is-now { background: ${T.accent}; width: 16px; }
.g10-bmap-num { font-size: 10px; color: ${T.ink3}; margin-left: 3px; letter-spacing: .04em; }

/* ============ ASOS POLZUNOGI ============ */
.g10-range {
  -webkit-appearance: none; appearance: none;
  width: 100%; height: 22px; background: transparent; cursor: pointer; margin: 0;
}
.g10-range::-webkit-slider-runnable-track {
  height: 4px; border-radius: 2px;
  background: linear-gradient(90deg, ${T.graph} 0%, rgba(23,26,29,.16) 50%, ${T.accent} 100%);
}
.g10-range::-moz-range-track {
  height: 4px; border-radius: 2px;
  background: linear-gradient(90deg, ${T.graph} 0%, rgba(23,26,29,.16) 50%, ${T.accent} 100%);
}
.g10-range::-webkit-slider-thumb {
  -webkit-appearance: none; appearance: none;
  width: 20px; height: 20px; border-radius: 50%; margin-top: -8px;
  background: ${T.paper}; box-shadow: 0 0 0 2px ${T.ink}, 0 4px 10px -4px rgba(${T.shadow},.5);
  transition: box-shadow .24s cubic-bezier(.22,.61,.36,1);
}
.g10-range::-moz-range-thumb {
  width: 20px; height: 20px; border: 0; border-radius: 50%;
  background: ${T.paper}; box-shadow: 0 0 0 2px ${T.ink}, 0 4px 10px -4px rgba(${T.shadow},.5);
}
.g10-range:focus-visible::-webkit-slider-thumb { box-shadow: 0 0 0 2px ${T.graph}, 0 0 0 6px rgba(23,108,112,.25); }

/* ============ CHOP ETISH: shpargalka ============ */
.g10-print { display: none; }
@media print {
  .lesson-root { position: static !important; overflow: visible !important; background: #fff !important; }
  .stage-header, .stage-nav, .g10-bgcurves, .g10-notes-wrap { display: none !important; }
  .stage-content { overflow: visible !important; }
  .g10-stack > *:not(.g10-print) { display: none !important; }
  .g10-print { display: block !important; font-family: 'Manrope', sans-serif; color: #000; }
  .g10-print h2 { font-family: 'Fraunces', 'Source Serif 4', Georgia, serif; font-size: 20pt; margin: 0 0 10pt; }
  .g10-print-law {
    font-family: ${MATH_FONT}; font-size: 14pt; font-weight: 700;
    border: 2pt solid #000; border-radius: 6pt; padding: 8pt 10pt; margin: 0 0 10pt;
  }
  .g10-print ol { font-size: 12pt; line-height: 1.6; margin: 0 0 10pt; padding-left: 18pt; }
  .g10-print-life { font-size: 12pt; border-left: 3pt solid #000; padding-left: 8pt; }
  .g10-print-src { font-size: 9pt; color: #444; margin-top: 12pt; }
}

/* ============ QORALAMALAR ============ */
.g10-notes-wrap {
  position: absolute; inset: 0; z-index: 5;
  display: flex; align-items: flex-start; justify-content: flex-end;
  background: rgba(243,239,231,.72);
  backdrop-filter: blur(2px);
  animation: g10-in .3s cubic-bezier(.22,.61,.36,1) both;
}
.g10-notes {
  width: min(420px, 100%);
  height: 100%;
  display: flex; flex-direction: column; gap: 9px;
  padding: clamp(10px, 1.4vw, 16px);
  border-radius: 16px;
  background: ${T.paper};
  box-shadow: 0 18px 40px -18px rgba(${T.shadow},.45), inset 0 0 0 1px ${T.line};
}
.g10-notes-head { display: flex; align-items: center; justify-content: space-between; }
.g10-notes-area {
  flex: 1; min-height: 0; resize: none;
  border-radius: 12px; border: 0;
  box-shadow: inset 0 0 0 1px ${T.line};
  background: rgba(243,239,231,.5);
  padding: 10px 12px;
  font-family: 'Manrope', system-ui, sans-serif;
  font-size: 13.5px; line-height: 1.5; color: ${T.ink};
}
.g10-notes-foot { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.g10-notes-hint { font-size: clamp(10px, .85vw, 11.5px); color: ${T.ink2}; line-height: 1.3; }

/* ============ ANIMATSIYALAR ============
   Faqat matematik jihatdan O'ZGARGAN narsa harakatlanadi.
   Oddiy o'tish 240-420 ms, murakkab qayta qurish 700 ms gacha.
   Prujina FAQAT belgini uyaga qo'yishda.                                   */
/* --g10-rev: joriy ovoz bo'lagining baholangan uzunligi. Ochilish gap bilan
   BIRGA ketadi: uzun gap -> sekin ochilish. useNarratedSteps o'rnatadi. */
.g10-in { opacity: 0; animation: g10-in .52s cubic-bezier(.22,.61,.36,1) forwards; }
.g10-d1 { animation-delay: .12s; }
.g10-d2 { animation-delay: .24s; }
.g10-d3 { animation-delay: .36s; }
.g10-d4 { animation-delay: .48s; }
@keyframes g10-in { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: translateY(0); } }

/* Tushuntirish qadami: OVOZ bilan bir vaqtda, yumshoq va shoshmasdan. */
.g10-reveal { animation: g10-reveal var(--g10-rev, 900ms) cubic-bezier(.22,.61,.36,1) both; }
@keyframes g10-reveal { 0% { opacity: 0; transform: translateY(8px); } 55% { opacity: 1; } 100% { opacity: 1; transform: translateY(0); } }
.g10-r1 { animation-delay: .22s; }
.g10-r2 { animation-delay: .44s; }
.g10-r3 { animation-delay: .66s; }

/* Morf: ikki kartochka bitta keng kartochkaga aylanadi (700 ms chegara) */
.g10-morph { animation: g10-morph .92s cubic-bezier(.22,.61,.36,1) both; }
@keyframes g10-morph {
  0% { opacity: 0; transform: scaleY(.9) translateY(8px); transform-origin: top center; }
  100% { opacity: 1; transform: scaleY(1) translateY(0); }
}

/* Prujina -- FAQAT uyaga qo'yishda */
/* Prujina -- FAQAT uyaga qo'yishda, va yumshoq: 4% dan oshmaydi. */
.g10-snap { animation: g10-snap .5s cubic-bezier(.34,1.32,.5,1) both; }
@keyframes g10-snap { 0% { transform: scale(.88); opacity: 0; } 60% { transform: scale(1.04); opacity: 1; } 100% { transform: scale(1); } }

/* Son yuqoridan tushadi -- matematik natija paydo bo'lganda */
/* Natija paydo bo'lishi: sekinroq va yumshoqroq, sakrashsiz. */
.g10-drop { display: inline-block; animation: g10-drop calc(var(--g10-rev, 900ms) * .8) cubic-bezier(.22,.61,.36,1) both; }
@keyframes g10-drop { 0% { opacity: 0; transform: translateY(-10px); } 100% { opacity: 1; transform: translateY(0); } }

.g10-pop { animation: g10-pop .5s cubic-bezier(.22,.61,.36,1) both; }
@keyframes g10-pop { 0% { opacity: 0; transform: translateY(5px); } 100% { opacity: 1; transform: translateY(0); } }

/* Xato belgi uyadan QAYTADI */
.g10-shakebox { overflow: clip; }
.g10-shake { animation: g10-shake .3s cubic-bezier(.22,.61,.36,1) 2; }
@keyframes g10-shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
/* Bitta yumshoq impuls -- yangi holat e'tiborini tortadi. Cheksiz EMAS. */
.g10-pulse { animation: g10-pulse .62s cubic-bezier(.22,.61,.36,1) 1; }
@keyframes g10-pulse { 0%,100% { opacity: 1; } 50% { opacity: .42; } }
.g10-accent-pulse { animation: g10-accent-pulse 1.1s cubic-bezier(.22,.61,.36,1) 1; }
@keyframes g10-accent-pulse {
  0% { color: ${T.ink}; text-shadow: none; }
  40% { color: ${T.accent}; text-shadow: 0 0 18px rgba(201,84,44,.4); }
  100% { color: ${T.accent}; text-shadow: none; }
}

/* Kirivi chizilishi -- SVG uzunligi bo'yicha */
/* Kirivi GAP davomida chiziladi -- shuning uchun --g10-rev ga bog'langan. */
.g10-draw { animation: g10-draw calc(var(--g10-rev, 900ms) * 1.35) cubic-bezier(.22,.61,.36,1) both; }
@keyframes g10-draw { from { stroke-dashoffset: var(--len, 1200); } to { stroke-dashoffset: 0; } }

.g10-slotframe {
  border: 1px dashed rgba(23,26,29,.26);
  border-radius: 12px;
  background: rgba(255,253,248,.6);
  display: flex; align-items: center; justify-content: center;
  transition: box-shadow .24s cubic-bezier(.22,.61,.36,1), background .24s;
}
.g10-picked { box-shadow: 0 0 0 2px ${T.graph}; background: ${T.graphSoft}; }
.g10-num { color: ${T.accent}; font-weight: 800; }
.g10-dim { opacity: .28; }

/* Tayanch kartochkasidagi misol: formula ustida, izohi ostida. */
.g10-ex { display: flex; flex-direction: column; gap: 1px; }
.g10-ex-why {
  font-family: 'Manrope', system-ui, sans-serif;
  font-size: 11.5px;
  line-height: 1.28;
  color: ${T.ink3};
  letter-spacing: .005em;
}
.g10-ex-why .g10-mono { font-size: 12px; color: ${T.ink2}; font-weight: 600; }

/* Yig'ilgan tayanchlar: bitta satrda nomlari. */
.g10-fold-list { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; min-width: 0; }
.g10-fold-item {
  display: inline-flex; align-items: baseline; gap: 5px;
  font-family: 'Manrope', system-ui, sans-serif;
  font-size: 12px; line-height: 1.25; color: ${T.ink3};
}
/* Nuqta tugmasidagi maqsad yozuvi: nima uchun aynan shu son olinadi. */
.g10-opt-role {
  display: block;
  font-family: 'Manrope', system-ui, sans-serif;
  font-size: 10.5px; font-weight: 600; line-height: 1.2;
  color: ${T.ink3}; letter-spacing: .01em;
  margin-top: 1px;
}
/* Ikki da'vogar javob: xulosa chiqmaguncha ular SAVOL bilan turadi.
   Telefonda ham IKKI ustunda qoladi -- ichi qisqa, sig'adi. */
.g10-claims {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  min-width: 0;
}
.g10-claim {
  display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
  min-height: 0; min-width: 0;
}
.g10-claim-v { font-family: ${MATH_FONT}; font-size: 16px; font-weight: 600; color: ${T.ink}; }
.g10-claim-q { font-family: ${MATH_FONT}; font-size: 16px; font-weight: 700; color: ${T.ink3}; }

.g10-fold-num {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; font-weight: 800; color: ${T.accent};
  letter-spacing: .04em;
}
.g10-ok-text { color: ${T.ok}; font-weight: 800; }
.g10-tip-text { color: ${T.tip}; font-weight: 700; }
.g10-graph-text { color: ${T.graph}; font-weight: 700; }

/* Tetradcha: chapda ingichka chiziq, satrlar ustma-ust */
.g10-note-lines { display: flex; flex-direction: column; gap: 2px; padding-left: 12px; border-left: 2px solid ${T.line}; min-width: 0; }

@media (prefers-reduced-motion: reduce) {
  .lesson-root, .lesson-root *, .lesson-root *::before, .lesson-root *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
  .g10-in, .g10-reveal, .g10-morph, .g10-snap, .g10-drop, .g10-pop,
  .g10-rule-line, .g10-rule-example, .g10-fb { opacity: 1 !important; transform: none !important; }
  .g10-btn-ready, .g10-tool-wave { animation: none !important; }
  .g10-await::after { animation: none !important; opacity: 0 !important; }
  .g10-seg-i.is-now { transform: none; }
}

/* ============================================================
   TELEFON UCHUN OXIRGI TUZATISHLAR.
   Bu blok ataylab STYLES ning ENG OXIRIDA: yuqoridagi asosiy qoidalar
   bir xil aniqlikda bo'lgani uchun, faqat keyin turgani yutadi.
   ============================================================ */
@media (max-width: 859.98px) {
  /* Da'vogar javoblar BITTA ustunda. Ikki ustunda ularning ichi vertikal
     yoyilib, ikkisi 133px olardi -- bir ustunda 46px. */
  .g10-claims { grid-template-columns: minmax(0, 1fr); gap: 5px; }
  .g10-claim { gap: 6px; padding: 6px 9px; row-gap: 1px; }
  .g10-claim-v, .g10-claim-q { font-size: 14px; }
  .g10-claim .g10-hint { font-size: 11.5px; line-height: 1.25; }
  /* Nuqta tanlash sarlavhasi telefonda kerak emas: tugmaning O'ZI
     «Qo'yish: x = 0» deb yozadi. */
  .g10-pickhide { display: none; }
  /* Panel to'ldirishi INLINE pad proplari bilan beriladi -- telefonda
     ularni bosish uchun important kerak. STYLES ichida teskari apostrof
     YOZILMAYDI: u shablon satrni uzib, faylni sindiradi. */
  .g10-panel { padding: 7px 9px !important; }
  /* Qo'yish satri: 100px ustun telefonda hisobni ikki satrga o'rar edi. */
  .g10-tprow {
    grid-template-columns: 60px minmax(0, 1fr) auto !important;
    font-size: 12.5px !important;
    min-height: 26px !important;
    gap: 6px !important;
  }
  .g10-ask { font-size: 13px; line-height: 1.32; }
  .g10-claim .g10-tag { font-size: 9.5px; padding: 2px 5px; }
  .g10-fb { padding: 7px 9px; }

  /* 15-slayd: telefonda takrorlanadigan bloklar olib tashlanadi.
     Layfxak chop etiladigan shpargalkada qoladi, qoralama esa yuqori
     paneldagi asbobda ochiladi -- ma'lumot yo'qolmaydi. */
  .g10-hide-phone { display: none; }
  .g10-s15-notes .g10-notes-area { display: none; }
  .g10-s15-notes .g10-notes-hint { display: none; }
  /* Maydon yashiringach «Saqlash» tugmasining ma'nosi yo'q: qatorda faqat
     shpargalka tugmasi qoladi. Tartib: extra tugma BIRINCHI, saqlash IKKINCHI. */
  .g10-s15-notes .g10-notes-foot .g10-btn + .g10-btn { display: none; }
  /* Halqa telefonda bir pog'ona kichrayadi: SVG o'lchovi atribut bilan
     berilgan, shuning uchun CSS da bosib o'tiladi. */
  .g10-ring svg { width: 68px !important; height: 68px !important; }
  /* Mayda formulalar telefonda bir pog'ona kichrayadi: 15-slaydda to'rt
     qoida satri o'ralib, har biri ikki satr olardi. */
  .g10-expr-sm { font-size: 12px; line-height: 1.26; }
  .g10-ring-label { letter-spacing: .1em; }
  /* Oxirgi 5px: halqa paneli va yakun bloklari orasidagi zaxira. */
  .g10-ring { gap: 2px; }
  .g10-insight { padding: 8px 10px; }
  /* Kichik zaxira: uch tilda ham 601px budjetiga sig'sin. */
  .g10-title { font-size: 18.5px; }
  .g10-options { gap: 5px; }
}

/* ============ 1-ASBOB: BIRLIK AYLANA (faqat 10-sinf) ============ */
.g10-scene {
  flex: 1 1 auto; min-height: 0; width: 100%;
  display: flex; align-items: stretch; justify-content: center;
  gap: clamp(8px, 2vw, 18px);
}
.g10-scene-fig {
  flex: 1 1 0; align-self: stretch; min-width: 0; min-height: 0; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
}
.g10-scene-note { flex: 0 1 auto; align-self: center; min-width: 0; display: flex; flex-direction: column; gap: clamp(3px, .8vw, 7px); justify-content: center; }
@media (max-width: 639.98px) {
  .g10-scene { flex-direction: column; gap: 6px; }
  .g10-scene-fig { flex: 1 1 auto; align-self: stretch; min-height: 120px; }
  .g10-scene-note { align-self: stretch; }
}
.g10-side { display: flex; flex-direction: column; gap: 5px; width: clamp(232px, 32vw, 340px); min-width: 0; }
@media (max-width: 639.98px) { .g10-side { width: 100%; } }

.g10-circle-wrap { display: flex; align-items: center; justify-content: center; gap: clamp(8px, 2vw, 18px); flex-shrink: 0; min-width: 0; max-width: 100%; }
@media (max-width: 639.98px) {
  .g10-circle-wrap { flex-direction: column; gap: 4px; }
  .g10-readout { flex-direction: row; flex-wrap: wrap; justify-content: center; gap: 4px 12px; min-width: 0; }
}
.g10-circle { touch-action: none; cursor: grab; user-select: none; width: 100%; height: auto; }
.g10-circle:active { cursor: grabbing; }
.g10-readout { display: flex; flex-direction: column; gap: 5px; min-width: 128px; }
.g10-readout-row { font-family: ${MATH_FONT}; font-size: clamp(12px, 1.6vw, 14px); display: flex; align-items: baseline; gap: 6px; }
.g10-readout-key { color: ${T.ink3}; font-size: 10px; letter-spacing: .1em; text-transform: uppercase; font-family: 'Manrope', sans-serif; font-weight: 700; }
.g10-readout-val { font-weight: 700; color: ${T.ink}; }
.g10-readout-val-accent { color: ${T.accent}; }

/* Chizma «chiziladi», daftar satri chizmadan «uchib» keladi, qiymat «chiqadi». */
.g10-draw { stroke-dasharray: var(--len, 400); stroke-dashoffset: var(--len, 400); animation: g10-draw .62s ease-out forwards; }
@keyframes g10-draw { to { stroke-dashoffset: 0; } }
.g10-flyin { opacity: 0; animation: g10-flyin .46s cubic-bezier(.22, 1, .36, 1) forwards; }
@keyframes g10-flyin { from { opacity: 0; transform: translateX(-22px) scale(.96); } to { opacity: 1; transform: none; } }
.g10-valpop { animation: g10-valpop .5s cubic-bezier(.34, 1.56, .64, 1) both; }
@keyframes g10-valpop { 0% { opacity: 0; transform: scale(.4); } 60% { transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }

/* Jadval katakchalari va chiplar. */
.g10-chip {
  display: inline-flex; align-items: center; justify-content: center;
  min-height: 34px; padding: 4px 12px; border: 0; border-radius: 10px;
  background: ${T.paper}; color: ${T.ink};
  font-family: ${MATH_FONT}; font-size: 14px; font-weight: 700; cursor: pointer;
  box-shadow: 0 5px 14px -6px rgba(${T.shadow},.18);
  transition: background .18s, box-shadow .18s, color .18s;
}
.g10-chip:hover:not(:disabled) { box-shadow: 0 9px 20px -7px rgba(${T.shadow},.26); }
.g10-chip-on { background: ${T.ink}; color: ${T.bg}; }
.g10-chip:disabled { opacity: .45; cursor: default; }
.g10-cell {
  min-width: 62px; min-height: 34px;
  border: 1px dashed rgba(23,26,29,.24); border-radius: 9px;
  background: rgba(255,255,255,.66);
  font-family: ${MATH_FONT}; font-size: 14px; font-weight: 700;
  color: ${T.ink3}; cursor: pointer;
}
.g10-cell-active { box-shadow: 0 0 0 2px ${T.ink}; color: ${T.ink}; }
.g10-cell-ok { border-style: solid; border-color: ${T.ok}; color: ${T.ok}; background: ${T.okSoft}; }
.g10-cell-bad { border-style: solid; border-color: ${T.tip}; color: ${T.tip}; background: ${T.tipSoft}; }

/* Son kiritish: o'quvchi javobni O'ZI yozadi. */
.g10-pad { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 6px; }
.g10-key {
  min-height: 38px; padding: 0; border: 0; border-radius: 10px;
  background: ${T.paper}; color: ${T.ink};
  font-family: ${MATH_FONT}; font-size: 15px; font-weight: 700; cursor: pointer;
  box-shadow: 0 5px 14px -6px rgba(${T.shadow},.18);
  transition: background .15s, box-shadow .15s;
}
.g10-key:hover:not(:disabled) { box-shadow: 0 9px 20px -7px rgba(${T.shadow},.26); }
.g10-key:disabled { opacity: .4; cursor: default; }
@media (max-width: 639.98px) { .g10-key { min-height: 44px; } }
.g10-entry {
  display: flex; align-items: center; justify-content: center; gap: 10px;
  min-height: 42px; padding: 4px 14px; border-radius: 11px;
  border: 1.5px solid rgba(23,26,29,.16); background: ${T.paper};
  font-family: ${MATH_FONT}; font-size: 19px; font-weight: 700;
}
.g10-entry-ok { border-color: ${T.ok}; background: ${T.okSoft}; color: ${T.ok}; }
.g10-entry-bad { border-color: ${T.tip}; background: ${T.tipSoft}; color: ${T.tip}; }
.g10-entry-caret { color: ${T.ink3}; animation: g10-caret 1.1s steps(1) infinite; }
@keyframes g10-caret { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }

/* Qoida yopiq turganda o'rnida shu balandlikdagi qulf. */
.g10-lock {
  display: flex; align-items: center; justify-content: center; gap: 9px;
  height: 128px; flex-shrink: 0;
  border-radius: 13px; border: 1px dashed rgba(23,26,29,.20);
  background: rgba(255,255,255,.5); color: ${T.ink3};
  font-size: 13px; font-weight: 600;
}
.g10-lock-glyph { display: flex; }
@media (max-width: 639.98px) { .g10-lock { height: 86px; } }

/* Tor ustunda razbor matni kichikroq: 16px serif 340px ustunni cho'zib yuboradi. */
.g10-fb-sm .g10-fb { padding: 6px 9px; gap: 8px; }
.g10-fb-sm .g10-fb-body { font-size: 13.5px; line-height: 1.3; }
.g10-fb-sm .g10-fb-glyph { width: 24px; height: 24px; font-size: 13px; }

`
