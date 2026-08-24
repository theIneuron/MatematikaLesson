// ============================================================================
// UMUMIY DARS YADROSI. Bir marta yoziladi, 7 va 9-sinf shuni ishlatadi.
// Kontrakt: src/books/grade7/PODXOD_7SINF.md, src/books/grade9/PODXOD_9SINF.md
// Ko'chirildi 2026-08-06: grade7/core.jsx -> shared/lesson-core.jsx (metodist qarori).
// Klass prefiksi `lc-` (lesson core), CSS o'zgaruvchi `--lcz`. Sinfga bog'liq emas.
//
// Ichida: uch til (L/tr), ovoz (HTTP TTS v5.2 + previu zaxirasi), javob tovushi,
// mobil zoom, navigatsiya qulfi (mute-xavfsiz), Stage, Feedback va UI primitivlari.
//
// Uslub 1, 2 va 5-sinfdan olingan (metodist qarori 2026-08-05):
//   - Feedback bloki: chapda 4px rang chizig'i, sarlavhada «✗ Подсказка»
//   - variantlarda A B C D nishoni, to'g'risi ✓ yashil, xatosi ✗ SARIQ
//   - to'g'ri javobdan keyin xato variantlar KASKAD bilan yig'ilib ketadi
//   - bloklar navbat bilan kiradi (d1..d4)
//   - «Davom» tugmasi kutilayotganda pulsatsiya qiladi
//   - kontent YUQORIDAN joylashadi, markazda emas
//   - shrift o'lchovi 1-sinf shkalasi: h-sub 20-23, body 15, eyebrow 11
//
// `import React` SHART: LMS xom jsx ni KLASSIK rejimda yuklaydi.
// ============================================================================
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

// Navigatsiya fazasi. Metodist qarori: ishlab chiqishda erkin, sinf
// topshirilishidan oldin false.
//
// YADRO UMUMIY BO'LGANI UCHUN bu modul konstantasi EMAS: 7-sinf topshirilganda
// 9-sinfning erkin navigatsiyasi o'chib qolmasligi kerak. Har sinf o'zi beradi:
//   configureLesson({ freeNav: true })
// `getFreeNav()` ni yadro qulflari va dars yakunidagi payload ishlatadi.
export const getFreeNav = () => lessonConfig.freeNav !== false

export const T = {
  bg: '#F7F7F5',
  paper: '#FFFFFF',
  ink: '#14161A',
  ink2: '#5C636E',
  ink3: '#9AA1AC',
  accent: '#E8552B',
  accentSoft: '#FDEDE8',
  ok: '#1F7A4D',
  okSoft: '#E3F0E8',
  tip: '#D8A93A',
  tipSoft: '#FBF3D6',
  tipInk: '#C99A2E',
  cool: '#0E7C8B',
  coolSoft: '#E6F3F5',
  line: 'rgba(20,22,26,.10)',
  shadow: '20,22,26',
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
  hint: L('Maslahat', 'Подсказка', 'Hint'),
  right: L("To'g'ri", 'Верно', 'Correct'),
}

// ============================================================
// OVOZ: HTTP TTS v5.2 (MIGRATION_v5_2_math.md)
//   {base}/api/tts?text=<encoded>&g=m|f  -- FAQAT text va g
// ttsApiBase bo'sh bo'lsa (lokal previu) brauzer Web Speech zaxirasi.
// Jangovar yo'lda speechSynthesis TAQIQLANGAN.
// ============================================================
// Sinfga bog'liq qiymatlar yadroda QOTIB QOLMAYDI: har dars o'zi beradi.
//   voiceGender -- 7-sinf 'm', 9-sinf 'm' (metodist qarori 2026-08-06)
//   freeNav     -- ishlab chiqishda true, sinf topshirilganda false
let lessonConfig = {
  ttsApiBase: '',
  correctSoundUrl: '',
  wrongSoundUrl: '',
  aiGradingEndpoint: '',
  studentName: '',
  voiceGender: 'm',
  freeNav: true,
}
export const configureLesson = (next) => {
  lessonConfig = { ...lessonConfig, ...next }
}

export function buildTtsUrl(base, text, gender) {
  const clean = String(base || '').replace(/\/$/, '')
  const g = gender === 'f' ? 'f' : 'm'
  return clean + '/api/tts?text=' + encodeURIComponent(String(text || '')) + '&g=' + g
}

const speechLocale = (lang) => (lang === 'ru' ? 'ru-RU' : lang === 'en' ? 'en-GB' : 'uz-UZ')

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
  }

  setGender(g) { this.gender = g === 'f' ? 'f' : 'm' }
  setLang(lang) { this.lang = lang }
  emit(patch) { if (this.onStateChange) this.onStateChange(patch) }

  load(segments) {
    this.stop()
    this.queue = Array.isArray(segments) ? segments : []
    this.idx = 0
    this.pendingEvent = null
    this.completed = this.queue.length === 0
    this.emit({ isPlaying: false, completed: this.completed })
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

  // on_event segmentlari O'ZI kutadi: oldingisi tugagach avtomatik yonmaydi.
  // (grade1/2/5 dagi eski xato aynan shu yerda edi.)
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
    // Himoya: navbat almashgan paytda mavjud bo'lmagan segment kelishi mumkin.
    if (!seg) { this.isPlaying = false; this.emit({ isPlaying: false }); return }
    const text = String(seg.text || '')
    if (!text) { this.afterSegment(seg); return }
    const base = lessonConfig.ttsApiBase
    if (base) {
      if (!this.el) this.el = new Audio()
      const el = this.el
      el.onended = null
      el.onerror = null
      el.src = buildTtsUrl(base, text, seg.g || this.gender)
      el.onended = () => this.afterSegment(seg)
      el.onerror = () => this.afterSegment(seg)
      this.isPlaying = true
      this.emit({ isPlaying: true, currentSegment: seg.id || null })
      const started = el.play()
      if (started && typeof started.catch === 'function') started.catch(() => this.afterSegment(seg))
      return
    }
    if (typeof window === 'undefined' || !window.speechSynthesis) { this.afterSegment(seg); return }
    const synth = window.speechSynthesis
    try { synth.cancel() } catch (e) { /* previu cheklovi */ }
    const u = new window.SpeechSynthesisUtterance(text)
    u.lang = speechLocale(seg.lang || this.lang)
    u.rate = 0.98
    u.onend = () => this.afterSegment(seg)
    u.onerror = () => this.afterSegment(seg)
    this.isPlaying = true
    this.emit({ isPlaying: true, currentSegment: seg.id || null })
    try { synth.speak(u) } catch (e) { this.afterSegment(seg) }
  }

  afterSegment(seg) {
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

  // Ekrandagi qadam ochilganda chaqiriladi.
  triggerInternal(name) {
    const want = 'on_event:' + name
    for (let i = this.idx; i < this.queue.length; i += 1) {
      if (this.queue[i].trigger === want) {
        this.idx = i
        this.pendingEvent = null
        this.speak(this.queue[i])
        return
      }
    }
  }

  // Navbatdan tashqari bitta gap. `idx` navbat uzunligidan chetda bo'lishi
  // mumkin (ekran almashdi, navbat qayta yuklandi) -- shuning uchun qo'yish
  // o'rni CHEGARALANADI va `idx` o'sha joyga tenglashtiriladi.
  pushOneOff(text) {
    if (!text) return
    const at = Math.min(Math.max(this.idx, 0), this.queue.length)
    this.queue.splice(at, 0, { id: 'oneoff', text, trigger: 'manual' })
    this.idx = at
    this.speak(this.queue[at])
  }

  replay() {
    if (!this.queue.length) return
    if (this.idx > 0) this.idx -= 1
    if (this.idx >= this.queue.length) this.idx = this.queue.length - 1
    this.pendingEvent = null
    this.speak(this.queue[this.idx])
  }

  stop() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try { window.speechSynthesis.cancel() } catch (e) { /* previu cheklovi */ }
    }
    if (this.el) { try { this.el.pause() } catch (e) { /* previu cheklovi */ } }
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

// OVOZNI O'CHIRISH DARS DARAJASIDA, ekran darajasida EMAS.
//
// Xato shunday edi: `muted` har ekranning `useAudio` si ichida yashardi. Ekran
// almashganda yangi hook tug'ilib, ovoz O'ZI QAYTA YONARDI -- o'quvchi ovozni
// o'chirsa ham, keyingi slaydda u yana gapirardi. Bundan tashqari javob qulfi
// (`useInstructionGate`) yopiq qolib, tugmalar bosilmay qolardi.
// Shuning uchun holat modul darajasida va hamma hook shunga obuna bo'ladi.
let mutedGlobal = false
const muteSubs = new Set()
const publishMute = (value) => {
  mutedGlobal = value
  muteSubs.forEach((fn) => fn(value))
}

export function useAudio(segments) {
  const lang = useLang()
  const [state, setState] = useState({ isPlaying: false, completed: false, currentSegment: null })
  const [muted, setMuted] = useState(mutedGlobal)
  const engineRef = useRef(null)

  useEffect(() => {
    muteSubs.add(setMuted)
    return () => { muteSubs.delete(setMuted) }
  }, [])

  const key = useMemo(() => JSON.stringify(segments || []), [segments])
  const stable = useMemo(() => segments || [], [key]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const engine = getAudioEngine()
    if (!engine) return undefined
    engineRef.current = engine
    engine.onStateChange = (patch) => setState((prev) => ({ ...prev, ...patch }))
    engine.setLang(lang)
    engine.setGender(lessonConfig.voiceGender || 'm')
    if (muted) {
      engine.load([])
      setState((prev) => ({ ...prev, isPlaying: false, completed: true, currentSegment: null }))
      return () => engine.stop()
    }
    engine.load(stable)
    const timer = setTimeout(() => engine.start(), 260)
    return () => { clearTimeout(timer); engine.stop() }
  }, [stable, muted, lang]) // eslint-disable-line react-hooks/exhaustive-deps

  const step = useCallback((name) => {
    const engine = engineRef.current
    if (engine && !muted) engine.triggerInternal(name)
  }, [muted])

  // Xato variantning razborini OVOZ bilan aytish (5-sinf naqshi: 300ms keyin).
  const say = useCallback((text) => {
    const engine = engineRef.current
    if (!engine || muted || !text) return
    setTimeout(() => { if (!mutedGlobal) engine.pushOneOff(text) }, 300)
  }, [muted])

  const replay = useCallback(() => {
    const engine = engineRef.current
    if (engine && !muted) engine.replay()
  }, [muted])

  const toggleMute = useCallback(() => {
    if (!mutedGlobal && engineRef.current) engineRef.current.stop()
    setState((prev) => ({ ...prev, isPlaying: false }))
    publishMute(!mutedGlobal)
  }, [])

  return { ...state, muted, step, say, replay, toggleMute }
}

// ============================================================
// JAVOB TOVUSHI. Platformadan URL kelsa shuni, kelmasa qisqa signal.
// (5-sinf naqshi: useSfx + chime zaxirasi)
// ============================================================
let chimeCtx = null
function chime(up) {
  if (typeof window === 'undefined') return
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return
  if (!chimeCtx) chimeCtx = new AC()
  if (chimeCtx.state === 'suspended') { try { chimeCtx.resume() } catch (e) { /* jest kutilmoqda */ } }
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
    const { correctSoundUrl, wrongSoundUrl } = lessonConfig
    if (correctSoundUrl) { const a = new Audio(correctSoundUrl); a.preload = 'auto'; a.volume = 0.6; okRef.current = a }
    if (wrongSoundUrl) { const a = new Audio(wrongSoundUrl); a.preload = 'auto'; a.volume = 0.6; noRef.current = a }
    return () => { okRef.current = null; noRef.current = null }
  }, [])
  const play = useCallback((up) => {
    const a = up ? okRef.current : noRef.current
    if (!a) { chime(up); return }
    try { a.currentTime = 0; const p = a.play(); if (p && p.catch) p.catch(() => {}) } catch (e) { chime(up) }
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
      root.style.setProperty('--lcz', String(z))
    }
    apply()
    window.addEventListener('resize', apply)
    window.addEventListener('orientationchange', apply)
    return () => {
      window.removeEventListener('resize', apply)
      window.removeEventListener('orientationchange', apply)
      root.style.removeProperty('--lcz')
    }
  }, [breakpoint])
}

// ============================================================
// QULFLAR. Ovoz o'chiq bo'lsa HAM ochilishi shart.
// ============================================================

// ============================================================
// TUSHUNTIRISH O'ZI O'YNAYDI (10-sinf naqshi, `grade10/core.jsx`).
// Faza ikki manbadan siljiydi va SEKINROG'I yetakchi:
//   1) ovoz bo'lagi almashdi -- demak keyingi fikr aytilyapti;
//   2) taymer: gap uzunligiga qarab (uzun gap -- sekin ochilish).
// Ovoz bo'lmasa (TTS ulanmagan, brauzer ovoz bermadi) segmentlar bir zumda
// «tugaydi», shuning uchun taymer HAR DOIM yuradi -- aks holda butun
// tushuntirish ko'z ochib yumguncha o'tib ketardi.
// Faza MONOTON: orqaga qaytmaydi.
// ============================================================
export function estimateSpeech(text) {
  const words = String(text || '').trim().split(/\s+/).filter(Boolean).length
  return Math.min(30000, Math.max(1600, 900 + words * 400))
}

export function useNarratedSteps(audio, texts) {
  const total = Math.max(1, (texts || []).length)
  const [tick, setTick] = useState(0)
  const [peak, setPeak] = useState(0)
  const seen = useRef([])
  useEffect(() => {
    const id = audio && audio.currentSegment
    if (!id) return
    if (seen.current.indexOf(id) === -1) seen.current.push(id)
    const now = Math.min(seen.current.length - 1, total - 1)
    setPeak((v) => (now > v ? now : v))
  }, [audio && audio.currentSegment, total]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (tick >= total - 1) return undefined
    const ms = Math.min(7000, estimateSpeech((texts || [])[tick]))
    const timer = setTimeout(() => setTick((v) => v + 1), ms)
    return () => clearTimeout(timer)
  }, [tick, total]) // eslint-disable-line react-hooks/exhaustive-deps
  if (audio && audio.muted) return Math.min(tick, total - 1)
  const lead = audio && audio.completed ? total - 1 : peak
  return Math.min(lead, tick, total - 1)
}

export function useCanAnswer(audio) {
  const [timedOut, setTimedOut] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), 12000)
    return () => clearTimeout(timer)
  }, [])
  return getFreeNav() || audio.muted || audio.completed || timedOut
}

// Ko'rsatma qulfi. `useCanAnswer` dan FARQI: `freeNav` ga bog'liq EMAS.
//
// Sabab: `freeNav` -- NAVIGATSIYA fazasi (ishlab chiqishda ekranlarni erkin
// varaqlash), javobning qulfi esa metodik talab: ovoz yoniq bo'lsa, o'quvchi
// ko'rsatma tugamasdan javob bermaydi (ETALON_9SINF.md §4). Ikkisi bitta
// qiymatga bog'lansa, ishlab chiqish rejimi metodik talabni o'chirib qo'yadi.
//
// Ovoz o'chiq bo'lsa DARHOL ochiladi. 12 soniya -- zaxira: ovoz kelmasa
// (masalan brauzer TTS ni bermasa) dars qotib qolmaydi.
export function useInstructionGate(audio) {
  const [timedOut, setTimedOut] = useState(false)
  useEffect(() => {
    setTimedOut(false)
    const timer = setTimeout(() => setTimedOut(true), 12000)
    return () => clearTimeout(timer)
  }, [audio.muted])
  return audio.muted || audio.completed || timedOut
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
// UI PRIMITIVLARI
// ============================================================

// Slot -- balandligi OLDINDAN band qilingan joy: kontent ichida paydo bo'ladi,
// slaydning balandligi o'zgarmaydi.
export const Slot = ({ h, mh, children, style, className }) => (
  <div
    className={className}
    style={{ height: h, minHeight: mh, flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', ...style }}
  >
    {children}
  </div>
)

export const Eyebrow = ({ children, right }) => (
  <div className="lc-eyebrow">
    <span>{children}</span>
    {right ? <span className="lc-eyebrow-right">{right}</span> : null}
  </div>
)

export const Title = ({ children }) => <h1 className="lc-title">{children}</h1>

export const Expr = ({ children, size = 'mid', tone, pop }) => (
  <div className={'lc-expr lc-expr-' + size + (pop ? ' lc-pop' : '')} style={tone ? { color: tone } : undefined}>
    {children}
  </div>
)

// Ish maydonining oq kartochkasi (1/2/5-sinfdagi .frame).
export const Frame = ({ children, style, className }) => (
  <div className={'lc-frame-card' + (className ? ' ' + className : '')} style={style}>
    {children}
  </div>
)

export const Btn = ({ children, onClick, disabled, tone = 'solid', ready, style }) => (
  <button
    type="button"
    className={'lc-btn lc-btn-' + tone + (ready && !disabled ? ' lc-btn-ready' : '')}
    onClick={onClick}
    disabled={disabled}
    style={style}
  >
    {children}
  </button>
)

const BADGES = ['A', 'B', 'C', 'D', 'E', 'F']

// Variantlar. 2-sinf Dars01 anatomiyasi (metodist skrinshotlari 2026-08-06):
//   chapda A B C D nishoni; tanlangandan keyin to'g'risi ✓ (YASHIL),
//   xatosi ↺ (SARIQ -- «yana urin», qizil emas).
//   Javobdan keyin QOLGAN variantlar YO'QOLADI, tanlangani markazda qoladi --
//   joy razbor uchun bo'shaydi. Aynan shu balandlik budjetini yutadi.
// `keepPicked` -- prognoz ekranlari uchun: to'g'ri-noto'g'risi yo'q, lekin
// tanlangani baribir yolg'iz qoladi (2-sinf xuk ekrani shunday).
export const Options = ({ items, picked, wrong, onPick, disabled, cols = 2, minH, collapse = true, badges = true, neutral = false }) => {
  const solved = !!picked
  const shrink = solved && collapse
  return (
    <div
      className="lc-options"
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
        const cls = ['lc-opt']
        if (isPicked) cls.push(neutral ? 'lc-opt-neutral' : 'lc-opt-ok')
        else if (isWrong) cls.push('lc-opt-tip')
        return (
          <button
            type="button"
            key={item.id}
            className={cls.join(' ')}
            disabled={disabled || isWrong || solved}
            onClick={() => onPick(item)}
            style={{
              minHeight: gone ? 0 : minH || 44,
              maxHeight: gone ? 0 : 220,
              paddingTop: gone ? 0 : undefined,
              paddingBottom: gone ? 0 : undefined,
              opacity: gone ? 0 : 1,
              transform: gone ? 'translateY(-6px) scale(.97)' : 'none',
              borderWidth: gone ? 0 : undefined,
              width: isPicked && shrink ? '100%' : undefined,
              maxWidth: isPicked && shrink ? 460 : undefined,
              transitionDelay: gone ? i * 0.07 + 's' : '0s',
            }}
          >
            {badges ? (
              <span className="lc-opt-badge" style={{ color: isPicked && !neutral ? T.ok : isWrong ? T.tipInk : T.ink3 }}>
                {isPicked ? (neutral ? BADGES[i] : '✓') : isWrong ? '↺' : BADGES[i]}
              </span>
            ) : null}
            <span className="lc-opt-text">{item.label}</span>
          </button>
        )
      })}
    </div>
  )
}

// Javob berilgan savol shu qatorga yig'iladi.
export const DoneRow = ({ children }) => (
  <div className="lc-done">
    <span className="lc-done-tick">✓</span>
    <span className="lc-done-text">{children}</span>
  </div>
)

// Feedback bloki -- 1/2/5-sinfdagi FeedbackBlock ko'rinishi:
// chapda 4px rang chizig'i, sarlavhada «✗ Подсказка» yoki «✓ Верно».
// FARQ: bizda skroll YO'Q, shuning uchun max-height 800px va scrollIntoView
// OLINMADI -- blok oldindan band qilingan slot ichida ochiladi.
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
      className={'lc-fb ' + (tone === 'neutral' ? 'lc-fb-neutral' : ok ? 'lc-fb-ok' : 'lc-fb-tip') + (visible ? ' lc-fb-on' : '')}
      aria-label={tone === 'neutral' ? '' : tr(ok ? UI_TXT.right : UI_TXT.hint, lang)}
    >
      <span className="lc-fb-glyph" aria-hidden="true">{tone === 'neutral' ? '→' : ok ? '✓' : '↺'}</span>
      <span className="lc-fb-body">{children}</span>
    </div>
  )
}

export const Hint = ({ children }) => (children ? <p className="lc-hint">{children}</p> : null)

// Qoida kartochkasi: badge + satrlar navbat bilan (0.18s) + darslik namunasi.
export const RuleCard = ({ badge, lines, example, title }) => (
  <div className="lc-rule">
    <span className="lc-rule-badge">{badge}</span>
    {title ? <span className="lc-rule-title">{title}</span> : null}
    {lines.map((line, i) => (
      <span key={i} className="lc-rule-line" style={{ animationDelay: i * 0.18 + 's' }}>{line}</span>
    ))}
    {example ? (
      <span className="lc-rule-example" style={{ animationDelay: lines.length * 0.18 + 's' }}>{example}</span>
    ) : null}
  </div>
)

// ============================================================
// STAGE. STYLES ichida backtick ISHLATILMAYDI (fayl buziladi).
// .stage-content -- overflow: clip, skroll YO'Q. Kontent YUQORIDAN joylashadi.
// ============================================================
export const Stage = ({ eyebrow, screen, total, audio, nav, children }) => {
  const t = useT()
  const pct = Math.round(((screen + 1) / total) * 100)
  return (
    <div className="stage">
      <div className="stage-header">
        <div className="lc-track">
          <div className="lc-fill" style={{ width: pct + '%' }} />
        </div>
        <div className="lc-chrome">
          <span className="lc-chrome-left">{eyebrow}</span>
          <span className="lc-chrome-right">
            <button type="button" className="lc-icon" onClick={audio.toggleMute} aria-label={t(L('Ovoz', 'Звук', 'Sound'))} title={t(L('Ovoz', 'Звук', 'Sound'))}>
              {audio.muted ? '🔇' : '🔊'}
            </button>
            <button type="button" className="lc-icon" onClick={audio.replay} aria-label={t(L('Qayta', 'Повторить', 'Replay'))} title={t(L('Qayta', 'Повторить', 'Replay'))}>
              ↺
            </button>
            <span className="lc-count">{screen + 1}/{total}</span>
          </span>
        </div>
      </div>
      <div className="stage-content">
        <div className="lc-stack">{children}</div>
      </div>
      <div className="stage-nav">{nav}</div>
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
.lesson-root {
  position: fixed;
  inset: 0;
  overflow: clip;
  overscroll-behavior: none;
  isolation: isolate;
  font-family: 'Manrope', system-ui, sans-serif;
  color: ${T.ink};
  background: ${T.bg};
  -webkit-font-smoothing: antialiased;
  zoom: var(--lcz, 1);
}
@media (max-width: 639.98px) {
  .lesson-root { width: 390px; }
}
.lesson-root h1, .lesson-root h2, .lesson-root p { margin: 0; padding: 0; }
.lesson-root button { font: inherit; }

.stage {
  width: min(936px, 100%);
  height: 100%;
  margin: 0 auto;
  padding: 0 16px;
  display: flex;
  flex-direction: column;
}
.stage-header { flex-shrink: 0; padding-top: 10px; padding-bottom: 8px; }
.stage-content {
  flex: 1;
  min-height: 0;
  overflow: clip;
  padding-top: 6px;
  padding-bottom: 6px;
}
.stage-nav {
  flex-shrink: 0;
  min-height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 10px;
  padding-bottom: 10px;
  border-top: 1px solid ${T.line};
}
/* Kontent YUQORIDAN. 1, 2 va 5-sinfda ham shunday. */
.lc-stack {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: clamp(6px, 1.3vw, 11px);
}

.lc-track { width: 100%; height: 5px; border-radius: 999px; background: rgba(20,22,26,.10); overflow: hidden; }
.lc-fill { height: 100%; background: ${T.accent}; transition: width .45s ease; }
.lc-chrome { display: flex; align-items: center; justify-content: space-between; margin-top: 7px; }
.lc-chrome-left, .lc-chrome-right { display: flex; align-items: center; gap: 8px; }
.lc-count { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
.lc-icon {
  width: 28px; height: 28px; padding: 0; border: 0; border-radius: 8px;
  background: ${T.paper}; color: ${T.ink2}; cursor: pointer; line-height: 1;
  box-shadow: 0 2px 8px -5px rgba(${T.shadow},.45);
  transition: background .18s, box-shadow .18s;
}
.lc-icon:hover { box-shadow: 0 5px 14px -6px rgba(${T.shadow},.5); }

/* --- Shrift shkalasi: 1-sinf bilan bir xil --- */
.lc-eyebrow {
  display: flex; align-items: baseline; justify-content: space-between; gap: 10px;
  font-size: clamp(11px, 1.3vw, 11px); letter-spacing: .18em; text-transform: uppercase;
  font-weight: 600; color: ${T.ink3}; flex-shrink: 0;
}
.lc-eyebrow-right { font-family: 'JetBrains Mono', monospace; letter-spacing: .04em; color: ${T.accent}; }
.lc-title {
  font-family: 'Fraunces', Georgia, serif;
  font-weight: 550;
  line-height: 1.14;
  letter-spacing: -.01em;
  font-size: clamp(18px, 3.2vw, 23px);
  flex-shrink: 0;
}
.lc-expr {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 600;
  letter-spacing: -.01em;
  text-align: center;
  white-space: nowrap;
}
.lc-expr-big { font-size: clamp(24px, 3.6vw, 34px); }
.lc-expr-mid { font-size: clamp(19px, 2.6vw, 25px); }
.lc-expr-row { font-size: clamp(15px, 2vw, 20px); text-align: left; }
.lc-expr-sm { font-size: clamp(13px, 1.7vw, 15px); text-align: left; }

.lc-frame-card {
  background: ${T.paper};
  border-radius: 16px;
  padding: clamp(10px, 1.8vw, 15px);
  box-shadow: 0 8px 22px -6px rgba(${T.shadow},.14);
  overflow: clip; /* ichki pop/pulse kartochkadan tashqariga chiqmaydi */
}

/* --- Variantlar: soyada, ramkasiz (1/2/5-sinf .option) --- */
.lc-options { display: grid; gap: 10px; flex-shrink: 0; }
/* O'lchovlar 2-sinf Dars01 dan aynan ko'chirildi (metodist skrinshotlari). */
.lc-opt {
  display: flex; align-items: center; gap: 12px;
  overflow: hidden;
  padding: clamp(9px, 1.4vw, 11px) clamp(14px, 2.1vw, 19px);
  min-height: clamp(42px, 5.6vw, 50px);
  border: none;
  border-radius: 12px;
  background: ${T.paper};
  color: ${T.ink};
  font-family: 'Manrope', sans-serif;
  font-size: clamp(13px, 1.6vw, 14px);
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  box-shadow: 0 6px 16px -6px rgba(${T.shadow},.14);
  transition-property: opacity, max-height, min-height, padding, transform, background, color, box-shadow;
  transition-duration: .6s, .75s, .75s, .5s, .6s, .2s, .2s, .2s;
  transition-timing-function: cubic-bezier(.33, 0, .2, 1);
}
.lc-opt:hover:not(:disabled) { background: #FDFCFA; box-shadow: 0 10px 22px -6px rgba(${T.shadow},.22); }
.lc-opt:disabled { cursor: default; }
.lc-opt-badge { flex-shrink: 0; min-width: 17px; font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; }
.lc-opt-text { flex: 1; }
.lc-opt-ok { background: ${T.okSoft}; color: ${T.ok}; box-shadow: 0 8px 22px -6px rgba(31,122,77,.32); }
/* Xato tanlov SARIQ, qizil EMAS: «yana o'yla», «sen yomonsan» emas. */
.lc-opt-tip { background: ${T.tipSoft}; color: ${T.tipInk}; box-shadow: 0 8px 22px -6px rgba(216,169,58,.32); }
/* Prognoz: tanlangani ajratiladi, lekin BAHOLANMAYDI -- yashil ham, ✓ ham yo'q. */
.lc-opt-neutral { background: ${T.coolSoft}; color: ${T.ink}; box-shadow: 0 8px 22px -6px rgba(14,124,139,.24); }

/* --- Tugmalar --- */
.lc-btn {
  min-height: 44px;
  padding: 0 17px;
  border: 0;
  border-radius: 12px;
  font-family: 'Manrope', sans-serif;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: .01em;
  cursor: pointer;
  transition: all .2s;
}
.lc-btn-solid { background: ${T.ink}; color: ${T.bg}; box-shadow: 0 6px 18px -4px rgba(${T.shadow},.32); }
.lc-btn-solid:hover:not(:disabled) { background: ${T.accent}; box-shadow: 0 10px 24px -4px rgba(232,85,43,.45); }
.lc-btn-ghost { background: transparent; color: ${T.ink2}; }
.lc-btn-ghost:hover:not(:disabled) { background: ${T.paper}; box-shadow: 0 6px 18px -6px rgba(${T.shadow},.18); }
.lc-btn-soft { background: ${T.paper}; color: ${T.ink}; box-shadow: 0 6px 16px -6px rgba(${T.shadow},.16); }
.lc-btn-soft:hover:not(:disabled) { box-shadow: 0 10px 22px -6px rgba(${T.shadow},.24); }
.lc-btn-accent { background: ${T.accent}; color: #fff; box-shadow: 0 8px 22px -4px rgba(232,85,43,.4); }
.lc-btn-accent:hover:not(:disabled) { background: #D4471F; }
.lc-btn:disabled { opacity: .4; cursor: not-allowed; box-shadow: none; }
/* Kutilayotgan tugma: halqa bo'lib tarqaladigan soya. scale FAQAT shu yerda --
   tugma kengligi qat'iy, shuning uchun gorizontal oshib ketmaydi. */
/* transform YO'Q: keng tugmada scale gorizontal oshib ketish berardi.
   Halqa-soya layoutga kirmaydi -- puls faqat soya bilan. */
.lc-btn-ready { animation: lc-ready 1.5s ease-in-out infinite; }
@keyframes lc-ready {
  0%, 100% { box-shadow: 0 8px 22px -4px rgba(232,85,43,.42), 0 0 0 0 rgba(232,85,43,.5); }
  50% { box-shadow: 0 12px 28px -6px rgba(232,85,43,.55), 0 0 0 9px rgba(232,85,43,0); }
}

.lc-done {
  display: flex; align-items: center; gap: 8px; flex-shrink: 0;
  font-size: clamp(13px, 1.5vw, 13px); color: ${T.ink2};
}
.lc-done-tick { color: ${T.ok}; font-weight: 800; }
.lc-done-text { font-family: 'JetBrains Mono', monospace; }

.lc-hint { font-size: clamp(15px, 1.9vw, 15px); line-height: 1.42; color: ${T.ink2}; text-align: center; }

/* --- Feedback bloki: chapda 4px rang chizig'i (1/2/5-sinf) --- */
.lc-fb {
  display: flex; flex-direction: column; gap: 3px;
  padding: clamp(8px, 1.3vw, 10px) clamp(11px, 1.9vw, 15px);
  border-radius: 12px;
  border-left: 4px solid transparent;
  opacity: 0;
  transform: translateY(7px);
  transition: opacity .32s ease-out, transform .32s ease-out;
}
.lc-fb-on { opacity: 1; transform: translateY(0); }
.lc-fb-ok { background: ${T.okSoft}; border-left-color: ${T.ok}; box-shadow: 0 6px 16px -6px rgba(31,122,77,.22); }
.lc-fb-tip { background: ${T.tipSoft}; border-left-color: ${T.tip}; box-shadow: 0 6px 16px -6px rgba(180,138,30,.22); }
.lc-fb-neutral { background: ${T.coolSoft}; border-left-color: ${T.cool}; box-shadow: 0 6px 16px -6px rgba(14,124,139,.22); }
.lc-fb-neutral .lc-fb-glyph { background: rgba(14,124,139,.14); color: ${T.cool}; }
.lc-fb-neutral .lc-fb-body { color: ${T.cool}; }
/* 2-sinfdagi «bitcard» tuzilishi: chapda belgi, o'ngda YIRIK serif matn.
   Personaj o'rniga holat belgisi -- 7-sinfda maskot YO'Q. */
.lc-fb { flex-direction: row; align-items: center; gap: clamp(10px, 2.4vw, 16px); }
.lc-fb-glyph {
  flex-shrink: 0;
  width: clamp(30px, 5vw, 38px); height: clamp(30px, 5vw, 38px);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: clamp(15px, 2.6vw, 19px); font-weight: 800; line-height: 1;
}
.lc-fb-ok .lc-fb-glyph { background: rgba(31,122,77,.14); color: ${T.ok}; }
.lc-fb-tip .lc-fb-glyph { background: rgba(216,169,58,.18); color: ${T.tip}; }
.lc-fb-body {
  flex: 1; min-width: 0;
  font-family: 'Source Serif 4', Georgia, serif;
  font-weight: 700;
  font-size: clamp(15px, 2.4vw, 20px);
  line-height: 1.24;
}
.lc-fb-ok .lc-fb-body { color: ${T.ok}; }
.lc-fb-tip .lc-fb-body { color: ${T.tip}; }

.lc-rule {
  display: flex; flex-direction: column; gap: 4px; flex-shrink: 0;
  padding: clamp(9px, 1.7vw, 13px) clamp(11px, 2vw, 15px);
  border-radius: 13px;
  border-left: 4px solid ${T.accent};
  background: ${T.accentSoft};
  box-shadow: 0 6px 16px -6px rgba(232,85,43,.22);
}
.lc-rule-badge { font-size: clamp(10px, 1.2vw, 11px); font-weight: 800; letter-spacing: .13em; text-transform: uppercase; color: ${T.accent}; }
.lc-rule-title { font-size: clamp(13px, 1.5vw, 13px); font-weight: 700; color: ${T.ink2}; }
.lc-rule-line, .lc-rule-example {
  font-size: clamp(14px, 1.8vw, 15px);
  line-height: 1.34;
  opacity: 0;
  animation: lc-in .34s ease-out forwards;
}
.lc-rule-line:first-of-type { font-family: 'JetBrains Mono', monospace; font-weight: 700; }
.lc-rule-example { font-family: 'JetBrains Mono', monospace; color: ${T.ink2}; font-size: clamp(12px, 1.5vw, 13px); }

/* --- Kirish kaskadi: bloklar navbat bilan (1/2/5-sinf delay-1..4) --- */
.lc-in { opacity: 0; animation: lc-in .34s ease-out forwards; }
.lc-d1 { animation-delay: .12s; }
.lc-d2 { animation-delay: .24s; }
.lc-d3 { animation-delay: .36s; }
.lc-d4 { animation-delay: .48s; }
@keyframes lc-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

/* Javob figuraning O'ZIDA paydo bo'ladi (2-sinf AnsPop).
   Overshoot faqat VERTIKAL: keng satrda scaleX(1.1) gorizontal oshib
   ketish berardi, scaleY bermaydi. */
.lc-pop { animation: lc-pop .42s cubic-bezier(.34,1.56,.64,1) both; }
@keyframes lc-pop { 0% { opacity: 0; transform: scale(.45); } 62% { transform: scaleX(1) scaleY(1.09); } 100% { opacity: 1; transform: scale(1); } }

/* Silkinish va pulsatsiya GORIZONTAL oshib ketmasligi kerak: silkinish
   clip-qutida, pulsatsiya esa masshtab bilan emas, shaffoflik bilan. */
.lc-shakebox { overflow: clip; }
.lc-shake { animation: lc-shake .2s ease-in-out 2; }
@keyframes lc-shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
.lc-pulse { animation: lc-pulse .7s ease-in-out 1; }
@keyframes lc-pulse { 0%,100% { opacity: 1; } 50% { opacity: .45; } }

.lc-frame {
  border: 1px dashed rgba(20,22,26,.22);
  border-radius: 11px;
  background: rgba(255,255,255,.55);
  display: flex; align-items: center; justify-content: center;
}
.lc-card {
  border-radius: 13px;
  background: ${T.paper};
  box-shadow: 0 6px 16px -6px rgba(${T.shadow},.14);
  padding: 9px 11px;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px;
}
.lc-card-name { font-size: 10.5px; font-weight: 700; color: ${T.ink3}; letter-spacing: .06em; text-transform: uppercase; }
.lc-picked { box-shadow: 0 0 0 2px ${T.ink}; }
.lc-num { color: ${T.accent}; font-weight: 800; }
.lc-dim { opacity: .34; }
.lc-ok-text { color: ${T.ok}; font-weight: 800; }

@media (prefers-reduced-motion: reduce) {
  .lesson-root, .lesson-root *, .lesson-root *::before, .lesson-root *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
  .lc-in, .lc-rule-line, .lc-rule-example, .lc-fb { opacity: 1; }
}

/* --- DINAMIK NAMOYISH: yoylar, ishora ag'darish, qo'shilish --- */
.lc-arc { stroke-dasharray: 120; stroke-dashoffset: 120; animation: lc-draw .42s ease-out forwards; }
@keyframes lc-draw { to { stroke-dashoffset: 0; } }
.lc-arc-tip { opacity: 0; animation: lc-tip .2s ease-out forwards; }
@keyframes lc-tip { to { opacity: 1; } }

.lc-flip { position: relative; display: inline-grid; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(15px, 2vw, 19px); }
.lc-flip-old, .lc-flip-new { grid-area: 1 / 1; }
.lc-flip-old { color: ${T.ink3}; animation: lc-flip-out .3s ease-out forwards; }
.lc-flip-new { color: ${T.accent}; opacity: 0; animation: lc-flip-in .3s ease-out forwards; animation-delay: inherit; }
.lc-flip > .lc-flip-old { animation-delay: inherit; }
@keyframes lc-flip-out { to { opacity: 0; transform: translateY(-7px); } }
@keyframes lc-flip-in { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: translateY(0); } }

.lc-chip {
  font-family: 'JetBrains Mono', monospace; font-weight: 700;
  font-size: clamp(14px, 1.9vw, 18px);
  padding: 4px 10px; border-radius: 9px;
  background: ${T.paper}; box-shadow: 0 4px 12px -6px rgba(${T.shadow},.2);
}
.lc-chip-ok { background: ${T.okSoft}; color: ${T.ok}; }
.lc-chip-op { font-family: 'JetBrains Mono', monospace; font-weight: 700; color: ${T.ink3}; }
.lc-merge-l { animation: lc-mv-r .5s ease-in-out .2s both; }
.lc-merge-r { animation: lc-mv-l .5s ease-in-out .2s both; }
.lc-merge-res { animation: lc-pop .4s cubic-bezier(.34,1.56,.64,1) .65s both; }
@keyframes lc-mv-r { 60% { transform: translateX(9px); } 100% { transform: translateX(0); } }
@keyframes lc-mv-l { 60% { transform: translateX(-9px); } 100% { transform: translateX(0); } }
.lc-flip1 { animation: lc-tilt .34s ease-in-out .15s both; }
.lc-flip2 { animation: lc-tilt .34s ease-in-out .5s both; }
@keyframes lc-tilt { 50% { transform: rotate(-16deg); color: ${T.accent}; } }

@media (prefers-reduced-motion: reduce) {
  .lc-arc { stroke-dashoffset: 0; animation: none; }
  .lc-arc-tip, .lc-flip-new { opacity: 1; animation: none; }
  .lc-flip-old { display: none; }
  .lc-merge-l, .lc-merge-r, .lc-merge-res, .lc-flip1, .lc-flip2 { animation: none; }
}

/* --- SAHNA va MINI-ROLIK ---
   3-sinf naqshi: sahna balandligi DERAZAGA moslashadi. Past noutbukda
   kichrayadi, kattasida kattalashadi -- shuning uchun skroll paydo bo'lmaydi. */
.lc-scene {
  position: relative;
  width: min(100%, calc(clamp(92px, calc(100dvh - 540px), 172px) * 620 / 170));
  aspect-ratio: 620 / 170;
  margin-inline: auto;
  flex-shrink: 0;
}
.lc-scene-svg { width: 100%; height: 100%; display: block; }
/* Buyumlar yangi joyiga SILLIQ ko'chadi -- «qayta guruhlash» shu yerda ko'rinadi */
.lc-move { transition: transform .8s cubic-bezier(.33, 0, .2, 1); }
.lc-crate { transition: opacity .5s ease .3s; }
.lc-crate-lid { transition: transform .55s cubic-bezier(.34, 1.3, .64, 1); }

.lc-clip-cap {
  text-align: center;
  font-size: clamp(13px, 1.7vw, 15px);
  line-height: 1.3;
  color: ${T.ink2};
  animation: lc-in .3s ease-out both;
}
.lc-clip-bar { display: flex; gap: 7px; align-items: center; justify-content: center; flex-shrink: 0; }
.lc-clip-dot {
  width: 9px; height: 9px; padding: 0; border: 0; border-radius: 50%;
  background: rgba(20,22,26,.16); cursor: pointer;
  transition: background .25s, transform .25s;
}
.lc-clip-dot-past { background: ${T.accentSoft}; }
.lc-clip-dot-on { background: ${T.accent}; transform: scale(1.3); }
.lc-clip-replay {
  margin-left: 6px; width: 24px; height: 24px; padding: 0; border: 0; border-radius: 50%;
  background: ${T.paper}; color: ${T.ink2}; cursor: pointer; line-height: 1;
  box-shadow: 0 2px 8px -5px rgba(${T.shadow},.45);
}

@media (prefers-reduced-motion: reduce) {
  .lc-move, .lc-crate, .lc-crate-lid { transition: none; }
  .lc-clip-cap { animation: none; }
}
`
