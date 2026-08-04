import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

// Dars 1 · Ratsional ifodalar va ratsional kasrlar
// Monolit lesson: infrastructure + CONTENT + screens + styles.

// Grade-5 base palette with the warm interaction states used in grades 1–3.
const T = {
  bg: '#F6F4EF',
  ink: '#0E0E10',
  ink2: '#5A5A60',
  ink3: '#A7A6A2',
  paper: '#FFFFFF',
  accent: '#FF4F28',
  accentSoft: '#FFE8E1',
  success: '#1F7A4D',
  successSoft: '#E3F0E8',
  choiceSoft: '#FFF3EF',
  choiceRing: '#FFD3C7',
  blue: '#019ACB',
  blueSoft: '#EAF6FB',
  tip: '#D8A93A',
  tipInk: '#A07D14',
  tipSoft: '#FBF3D6',
  shadowBase: '58, 53, 48',
}

const MOBILE_DESIGN_W = 390

let ttsConfig = {
  ttsApiBase: '',
  correctSoundUrl: '',
  wrongSoundUrl: '',
  voiceGender: 'm',
}

const configureLesson = (config) => {
  ttsConfig = { ...ttsConfig, ...config }
}

const stripAudioTags = (text) =>
  typeof text === 'string'
    ? text
        .replace(/\[(Русское произношение|O'zbekcha tallaffuz|English pronunciation|end)\]\s*/g, '')
        .replace(/\s{2,}/g, ' ')
        .trim()
    : text

function buildTtsUrl(base, text, gender) {
  const encoded = encodeURIComponent(String(text).slice(0, 1000))
  return `${base}/api/tts?text=${encoded}&g=${gender || 'm'}`
}

const LangContext = createContext('ru')
const useLang = () => useContext(LangContext)

function useT() {
  const lang = useLang()
  return useCallback(
    (node) => {
      if (node === null || node === undefined) return ''
      if (typeof node === 'string' || typeof node === 'number') return node
      if (React.isValidElement(node)) return node
      return stripAudioTags(node[lang] ?? node.ru ?? node.uz ?? node.en ?? '')
    },
    [lang],
  )
}

function useMobileZoom(breakpoint = 640) {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const root = document.documentElement
    const update = () => {
      const zoom = window.innerWidth < breakpoint
        ? window.innerWidth / MOBILE_DESIGN_W
        : 1
      root.style.setProperty('--g8z', String(zoom))
    }
    update()
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
      root.style.removeProperty('--g8z')
    }
  }, [breakpoint])
}

class AudioEngine {
  constructor() {
    this.queue = []
    this.currentIdx = 0
    this.isPlaying = false
    this.waitingFor = null
    this.fallbackTimer = null
    this.onStateChange = null
    this.audioEl = null
    this.previewUtterance = null
    this.lang = 'ru'
  }

  ensureElement() {
    if (this.audioEl || typeof window === 'undefined') return this.audioEl
    const audio = new Audio()
    audio.preload = 'auto'
    audio.crossOrigin = 'anonymous'
    this.audioEl = audio
    return audio
  }

  setLang(lang) {
    this.lang = lang
  }

  loadQueue(segments) {
    this.stop()
    this.queue = segments || []
    this.currentIdx = 0
    this.waitingFor = null
    this.onStateChange?.({
      isPlaying: false,
      currentSegment: null,
      waitingFor: null,
      completed: false,
    })
  }

  playSegment(segment) {
    if (!segment || !segment.text) {
      this.handleEnd(segment)
      return
    }

    const base = ttsConfig.ttsApiBase
    if (!base) {
      this.playSegmentPreview(segment)
      return
    }

    const audio = this.ensureElement()
    if (!audio) return
    audio.onended = () => this.handleEnd(segment)
    audio.onerror = () => this.handleEnd(segment)
    audio.src = buildTtsUrl(base, segment.text, segment.g || ttsConfig.voiceGender)
    const promise = audio.play()
    if (promise?.then) {
      promise
        .then(() => {
          this.isPlaying = true
          this.onStateChange?.({ isPlaying: true, currentSegment: segment.id })
        })
        .catch(() => {
          this.isPlaying = false
          this.onStateChange?.({
            isPlaying: false,
            currentSegment: segment.id,
            completed: false,
          })
          this.fallbackTimer = window.setTimeout(() => this.handleEnd(segment), 900)
        })
    }
  }

  playSegmentPreview(segment) {
    const synth = typeof window !== 'undefined' ? window.speechSynthesis : null
    const Utterance = typeof window !== 'undefined' ? window.SpeechSynthesisUtterance : null
    const words = String(segment.text).trim().split(/\s+/).length
    const simulatedDuration = Math.min(5200, Math.max(1400, words * 115))

    this.onStateChange?.({
      isPlaying: false,
      currentSegment: segment.id,
      completed: false,
    })

    if (!synth || !Utterance) {
      this.fallbackTimer = window.setTimeout(() => this.handleEnd(segment), simulatedDuration)
      return
    }

    synth.cancel()
    const utterance = new Utterance(stripAudioTags(String(segment.text)))
    utterance.lang = this.lang === 'uz' ? 'uz-UZ' : this.lang === 'en' ? 'en-GB' : 'ru-RU'
    utterance.rate = 0.95
    utterance.pitch = 1
    let finished = false
    const finish = () => {
      if (finished) return
      finished = true
      if (this.previewUtterance === utterance) this.previewUtterance = null
      if (this.fallbackTimer) {
        window.clearTimeout(this.fallbackTimer)
        this.fallbackTimer = null
      }
      this.isPlaying = false
      this.onStateChange?.({ isPlaying: false, currentSegment: null })
      this.handleEnd(segment)
    }
    utterance.onstart = () => {
      this.isPlaying = true
      this.onStateChange?.({
        isPlaying: true,
        currentSegment: segment.id,
        completed: false,
      })
    }
    utterance.onend = finish
    utterance.onerror = finish
    this.previewUtterance = utterance
    this.fallbackTimer = window.setTimeout(finish, Math.max(4200, simulatedDuration * 2))
    window.setTimeout(() => {
      try {
        synth.speak(utterance)
      } catch {
        finish()
      }
    }, 60)
  }

  handleEnd(segment) {
    this.isPlaying = false
    this.onStateChange?.({ isPlaying: false, currentSegment: null })
    if (segment?.waits_for) {
      this.waitingFor = segment.waits_for
      this.onStateChange?.({ waitingFor: segment.waits_for })
      return
    }
    this.currentIdx += 1
    this.playNext()
  }

  playNext() {
    if (this.currentIdx >= this.queue.length) {
      this.onStateChange?.({
        isPlaying: false,
        currentSegment: null,
        waitingFor: null,
        completed: true,
      })
      return
    }
    this.playSegment(this.queue[this.currentIdx])
  }

  start() {
    this.currentIdx = 0
    this.waitingFor = null
    this.playNext()
  }

  triggerEvent(type, target) {
    if (!this.waitingFor) return
    const matches =
      this.waitingFor.type === type &&
      (!this.waitingFor.target || this.waitingFor.target === target)
    if (!matches) return
    this.waitingFor = null
    this.currentIdx += 1
    this.playNext()
  }

  pushOneOff(text, gender) {
    if (!text) return
    const segment = {
      id: `oneoff_${Date.now()}`,
      text,
      trigger: 'manual',
      waits_for: null,
      g: gender,
    }
    this.queue = [segment]
    this.currentIdx = 0
    this.waitingFor = null
    this.playNext()
  }

  replay() {
    if (!this.queue.length) return
    this.currentIdx = Math.max(0, this.currentIdx - 1)
    this.waitingFor = null
    this.playNext()
  }

  stop() {
    if (this.fallbackTimer) {
      window.clearTimeout(this.fallbackTimer)
      this.fallbackTimer = null
    }
    if (this.audioEl) {
      try {
        this.audioEl.pause()
        this.audioEl.onended = null
        this.audioEl.onerror = null
      } catch {
        // Audio cleanup is best-effort.
      }
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        if (this.previewUtterance) {
          this.previewUtterance.onstart = null
          this.previewUtterance.onend = null
          this.previewUtterance.onerror = null
          this.previewUtterance = null
        }
        window.speechSynthesis.cancel()
      } catch {
        // Preview speech cleanup is best-effort.
      }
    }
    this.isPlaying = false
    this.onStateChange?.({ isPlaying: false, currentSegment: null })
  }
}

let audioEngineInstance = null

function getAudioEngine() {
  if (typeof window === 'undefined') return null
  if (!audioEngineInstance) audioEngineInstance = new AudioEngine()
  return audioEngineInstance
}

function useAudio(segments) {
  const lang = useLang()
  const [state, setState] = useState({
    isPlaying: false,
    currentSegment: null,
    waitingFor: null,
    completed: false,
    muted: false,
  })
  const engineRef = useRef(null)
  const stableSegments = useMemo(() => segments || [], [segments])

  useEffect(() => {
    const engine = getAudioEngine()
    if (!engine) return undefined
    engineRef.current = engine
    engine.setLang(lang)
    engine.onStateChange = (next) => setState((prev) => ({ ...prev, ...next }))
    if (!state.muted && stableSegments.length) {
      engine.loadQueue(stableSegments)
      const timer = window.setTimeout(() => engine.start(), 300)
      return () => {
        window.clearTimeout(timer)
        engine.stop()
      }
    }
    return () => engine.stop()
  }, [stableSegments, lang, state.muted])

  const replay = useCallback(() => engineRef.current?.replay(), [])
  const toggleMute = useCallback(() => {
    setState((prev) => {
      const muted = !prev.muted
      if (muted) engineRef.current?.stop()
      return { ...prev, muted }
    })
  }, [])

  return { ...state, replay, toggleMute }
}

function makeAudioSegments(screenContent, lang, waitsFor = null) {
  const source = screenContent?.audio?.[lang]
  if (Array.isArray(source)) {
    return source.map((text, index) => ({
      id: `aud_${index}`,
      text,
      trigger: index === 0 ? 'on_mount' : 'after_previous',
      waits_for: index === 0 ? waitsFor : null,
    }))
  }
  if (!source) return []
  return [{ id: 'aud_0', text: source, trigger: 'on_mount', waits_for: waitsFor }]
}

function makePromptSegments(audio, lang, waitsFor) {
  if (!audio?.intro) return []
  return [
    {
      id: 'intro',
      text: audio.intro[lang] ?? audio.intro.ru,
      trigger: 'on_mount',
      waits_for: waitsFor,
    },
  ]
}

function useSfx() {
  const play = useCallback((kind) => {
    const source = kind === 'correct' ? ttsConfig.correctSoundUrl : ttsConfig.wrongSoundUrl
    if (source && typeof Audio !== 'undefined') {
      const audio = new Audio(source)
      audio.volume = 0.55
      audio.play().catch(() => {})
      return
    }
    if (typeof window === 'undefined') return
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext
      if (!AudioContextClass) return
      const context = new AudioContextClass()
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.frequency.value = kind === 'correct' ? 720 : 250
      gain.gain.setValueAtTime(0.12, context.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.18)
      oscillator.connect(gain)
      gain.connect(context.destination)
      oscillator.start()
      oscillator.stop(context.currentTime + 0.2)
    } catch {
      // SFX is optional.
    }
  }, [])

  return {
    playCorrect: () => play('correct'),
    playWrong: () => play('wrong'),
  }
}

const L = (uz, ru, en) => ({ uz, ru, en })

const TOTAL_SCREENS = 12

const LESSON_META = {
  lessonId: 'rat-8-01-v1',
  lessonTitle: L(
    'Ratsional ifodalar va ratsional kasrlar',
    'Рациональные выражения и рациональные дроби',
    'Rational expressions and rational fractions',
  ),
}

const SCREEN_META = [
  { id: 's0', type: 'hook', template: 'custom', scored: false, scope: 'hook' },
  { id: 's1', type: 'exploration', template: 'custom', scored: false, scope: null },
  { id: 's2', type: 'exploration', template: 'custom', scored: false, scope: null },
  { id: 's3', type: 'exploration', template: 'custom', scored: false, scope: null },
  { id: 's4', type: 'exploration', template: 'custom', scored: false, scope: null },
  { id: 's5', type: 'exploration', template: 'custom', scored: false, scope: null },
  { id: 's6', type: 'exploration', template: 'custom', scored: false, scope: null },
  { id: 's7', type: 'rule', template: 'custom', scored: false, scope: null },
  { id: 's8', type: 'test', template: 'custom', scored: true, scope: 'module-mikro' },
  { id: 's9', type: 'test', template: 'custom', scored: true, scope: 'module-mikro' },
  { id: 's10', type: 'test', template: 'custom', scored: true, scope: 'final' },
  { id: 's11', type: 'summary', template: 'custom', scored: false, scope: null },
]

const CONTENT = {
  ui: {
    back: L('Orqaga', 'Назад', 'Back'),
    next: L('Davom etish', 'Далее', 'Continue'),
    check: L('Tekshirish', 'Проверить', 'Check'),
    calculate: L('Hisoblash', 'Вычислить', 'Calculate'),
    save: L('Gipotezani saqlash', 'Сохранить гипотезу', 'Save hypothesis'),
    finish: L('Darsni yakunlash', 'Завершить урок', 'Finish lesson'),
    correct: L("To'g'ri", 'Верно', 'Correct'),
    hint: L('Maslahat', 'Подсказка', 'Hint'),
    step: L('Qadam', 'Шаг', 'Step'),
    undefined: L('Aniqlanmagan', 'Не определено', 'Undefined'),
  },

  s0: {
    eyebrow: L('DARS SAVOLI', 'ВОПРОС УРОКА', 'LESSON QUESTION'),
    title: L(
      'Formula barcha qiymatlarni qabul qiladimi?',
      'Принимает ли формула все значения?',
      'Does the formula accept every value?',
    ),
    question: L(
      "Sizningcha, to'rtta qiymatning barchasida hisoblash mumkinmi?",
      'Как вы думаете, можно ли выполнить вычисление при каждом из четырёх значений?',
      'Do you think the calculation can be completed for all four values?',
    ),
    options: [
      L("Ha, to'rttalasi ham qabul qilinadi", 'Да, подходят все четыре', 'Yes, all four are accepted'),
      L(
        "Yo'q, qiymatlardan biri muammo tug'diradi",
        'Нет, одно из значений создаст проблему',
        'No, one value will cause a problem',
      ),
      L("Hozircha ishonchim komil emas", 'Пока не уверен', 'I am not sure yet'),
    ],
    note: L(
      'Bu prognoz. Javob hozircha baholanmaydi.',
      'Это прогноз. Сейчас ответ не оценивается.',
      'This is a prediction. It is not graded yet.',
    ),
    audio: {
      intro: L(
        "K iks ifodani ko'rib chiqing. Nol, ikki, uch va to'rt qiymatlarining barchasida hisoblash mumkinligini oldindan taxmin qiling.",
        'Рассмотрите выражение ка от икс. Предположите, можно ли выполнить вычисление при нуле, двух, трёх и четырёх.',
        'Study the expression K of x. Predict whether it can be evaluated at zero, two, three, and four.',
      ),
      on_correct: L(
        'Prognozingiz saqlandi. Keyingi ekranlarda uni hisoblash natijalari bilan tekshirasiz.',
        'Ваш прогноз сохранён. На следующих экранах вы проверите его вычислениями.',
        'Your prediction has been saved. You will test it with calculations on the next screens.',
      ),
      on_wrong: L(
        "Prognozingiz saqlandi. Bu bosqichda xato javob yo'q, chunki tadqiqot endi boshlanmoqda.",
        'Ваш прогноз сохранён. Здесь нет ошибочного ответа, потому что исследование только начинается.',
        'Your prediction has been saved. There is no wrong answer because the investigation is just beginning.',
      ),
    },
  },

  s1: {
    eyebrow: L('TAKRORLASH', 'ПОВТОРЕНИЕ', 'REVIEW'),
    title: L("Uchta zarur ko'nikma", 'Три необходимых навыка', 'Three skills you will need'),
    lead: L(
      'Har bir mikroqadamni alohida bajaring.',
      'Выполните каждый микрошаг отдельно.',
      'Complete each micro-step separately.',
    ),
    steps: [
      {
        prompt: L(
          "x = 2 bo'lganda 2x + 1 ifodaning qiymatini toping.",
          'Найдите значение выражения 2x + 1 при x = 2.',
          'Find the value of 2x + 1 when x = 2.',
        ),
        answer: 5,
        success: L('2 · 2 + 1 = 5.', '2 · 2 + 1 = 5.', '2 · 2 + 1 = 5.'),
      },
      {
        prompt: L(
          "Kasrning maxrajini ko'rsating.",
          'Укажите знаменатель дроби.',
          'Identify the denominator of the fraction.',
        ),
        options: ['5', 'x − 3', 'x', '3'],
        answer: 1,
        success: L(
          'Maxraj kasr chizig’ining ostida: x − 3.',
          'Под чертой дроби находится знаменатель x − 3.',
          'The expression below the fraction bar is the denominator x − 3.',
        ),
      },
      {
        prompt: L('x − 3 = 0 tenglamani yeching.', 'Решите уравнение x − 3 = 0.', 'Solve x − 3 = 0.'),
        answer: 3,
        success: L(
          "x = 3 bo'lganda x − 3 nolga teng.",
          'При x = 3 выражение x − 3 равно нулю.',
          'When x equals 3, x − 3 equals zero.',
        ),
      },
    ],
    wrong: L(
      "Qadamni yana tekshiring. Bu yerda faqat o'rniga qo'yish, maxrajni aniqlash yoki oddiy tenglamani yechish kerak.",
      'Проверьте шаг ещё раз. Здесь нужна только подстановка, определение знаменателя или решение простого уравнения.',
      'Check the step again. It only requires substitution, identifying the denominator, or solving a simple equation.',
    ),
    audio: L(
      [
        "Tadqiqot uchun uchta vosita kerak. O'rniga qo'yish, maxrajni aniqlash va oddiy tenglamani yechishni tekshiramiz.",
        "Birinchi qadamda iks o'rniga ikki qo'ying va sonli ifodani hisoblang.",
        "Ikkinchi qadamda kasr chizig'i ostida joylashgan ifodani toping.",
        "Uchinchi qadamda iks minus uch qachon nol bo'lishini aniqlang.",
      ],
      [
        'Для исследования нужны три инструмента. Проверим подстановку, определение знаменателя и решение простого уравнения.',
        'На первом шаге подставьте вместо икс число два и вычислите выражение.',
        'На втором шаге найдите выражение под чертой дроби.',
        'На третьем шаге определите, когда икс минус три обращается в ноль.',
      ],
      [
        'The investigation needs three tools. We will check substitution, identifying a denominator, and solving a simple equation.',
        'For the first step, replace x with two and evaluate the expression.',
        'For the second step, identify the expression below the fraction bar.',
        'For the third step, determine when x minus three becomes zero.',
      ],
    ),
  },

  s2: {
    eyebrow: L('TAQQOSLASH', 'СРАВНЕНИЕ', 'COMPARE'),
    title: L('Ifodalarni ikki guruhga ajrating', 'Разделите выражения на две группы', 'Sort the expressions into two groups'),
    groups: [
      L("O'zgaruvchi maxrajda yo'q", 'Переменной в знаменателе нет', 'No variable in the denominator'),
      L("O'zgaruvchi maxrajda bor", 'Переменная находится в знаменателе', 'A variable appears in the denominator'),
    ],
    items: [
      { expression: '3x + 1', group: 0 },
      { expression: 'x² − 4', group: 0 },
      { expression: '5 / (x − 2)', group: 1 },
      { expression: '(x + 1) / (2x − 3)', group: 1 },
    ],
    correct_text: L(
      "Oxirgi ikki ifodada o'zgaruvchi maxrajning tarkibiga kiradi.",
      'В двух последних выражениях переменная входит в знаменатель.',
      'In the final two expressions, the variable is part of the denominator.',
    ),
    wrong_text: L(
      "Butun ifodaga emas, kasr chizig'i ostidagi qismga qarang.",
      'Смотрите не на всё выражение, а на часть под чертой дроби.',
      'Look specifically at the part below the fraction bar.',
    ),
    audio: L(
      "To'rtta ifodani taqqoslang. O'zgaruvchi kasr chizig'i ostida bor yoki yo'qligiga qarab ularni ikki guruhga ajrating.",
      'Сравните четыре выражения. Разделите их на группы в зависимости от того, находится ли переменная под чертой дроби.',
      'Compare the four expressions. Sort them according to whether a variable appears below the fraction bar.',
    ),
  },

  s3: {
    eyebrow: L('GIPOTEZA', 'ГИПОТЕЗА', 'HYPOTHESIS'),
    title: L(
      "Qaysi qiymat muammo tug'dirishi mumkin?",
      'Какое значение может создать проблему?',
      'Which value might cause a problem?',
    ),
    valueQuestion: L(
      'Hisoblashdan oldin bitta qiymatni tanlang.',
      'До вычислений выберите одно значение.',
      'Choose one value before calculating.',
    ),
    reasonQuestion: L(
      'Nega aynan shu qiymatni tanladingiz?',
      'Почему вы выбрали именно это значение?',
      'Why did you choose that value?',
    ),
    values: [0, 2, 3, 4],
    reasons: [
      L("Surat nolga teng bo'lishi mumkin", 'Числитель может стать равным нулю', 'The numerator might become zero'),
      L("Maxraj nolga teng bo'lishi mumkin", 'Знаменатель может стать равным нулю', 'The denominator might become zero'),
      L("Natija manfiy bo'lishi mumkin", 'Результат может быть отрицательным', 'The result might be negative'),
      L(
        "O'zgaruvchi formulada ikki marta qatnashgan",
        'Переменная встречается в формуле дважды',
        'The variable appears twice in the formula',
      ),
    ],
    note: L(
      "Javob keyingi tajribadan so'ng tekshiriladi.",
      'Ответ будет проверен после следующего эксперимента.',
      'The answer will be checked after the next experiment.',
    ),
    audio: L(
      "Hisoblashni boshlamasdan oldin muammoli qiymat haqida gipoteza tuzing. Qiymatni va tanlovingiz sababini belgilang.",
      'До начала вычислений сформулируйте гипотезу о проблемном значении. Выберите значение и причину своего решения.',
      'Before calculating, form a hypothesis about the problematic value. Select the value and the reason for your choice.',
    ),
  },

  s4: {
    eyebrow: L('QIYMATLARNI TEKSHIRISH', 'ПРОВЕРЯЕМ ЗНАЧЕНИЯ', 'TEST VALUES'),
    title: L("Qiymatlar jadvalini to'ldiring", 'Заполните таблицу значений', 'Complete the value table'),
    columns: [
      L('x', 'x', 'x'),
      L('Surat', 'Числитель', 'Numerator'),
      L('Maxraj', 'Знаменатель', 'Denominator'),
      L('K(x)', 'K(x)', 'K(x)'),
    ],
    rows: [
      { x: 0, numerator: 1, denominator: -3, value: '−1/3' },
      { x: 2, numerator: 5, denominator: -1, value: '−5' },
      { x: 3, numerator: 7, denominator: 0, value: 'undefined' },
      { x: 4, numerator: 9, denominator: 1, value: '9' },
    ],
    conclusion: L(
      "Faqat x = 3 da maxraj nolga teng bo'ldi. Shu sababli K(3) aniqlanmagan.",
      'Только при x = 3 знаменатель стал равен нулю. Поэтому K(3) не определено.',
      'Only x = 3 makes the denominator zero. Therefore K(3) is undefined.',
    ),
    audio: L(
      [
        "Har bir iks qiymatini surat va maxrajga qo'ying. Ularni alohida hisoblab, keyin natijani toping.",
        "Uch qiymatida surat yettiga, maxraj esa nolga teng bo'ladi. Nolga bo'lish aniqlanmagan.",
      ],
      [
        'Подставьте каждое значение икс в числитель и знаменатель. Вычислите их отдельно, затем найдите результат.',
        'При значении три числитель равен семи, а знаменатель равен нулю. Деление на ноль не определено.',
      ],
      [
        'Substitute each value of x into the numerator and denominator. Evaluate them separately, and then determine the result.',
        'At three, the numerator equals seven and the denominator equals zero. Division by zero is undefined.',
      ],
    ),
  },

  s5: {
    eyebrow: L('TEKSHIRUV', 'ПРОВЕРКА', 'CHECK'),
    title: L('Ikki xil nol', 'Два разных нуля', 'Two different zeros'),
    question: L(
      "x = 3 bo'lganda qaysi ifoda aniqlangan?",
      'Какое выражение определено при x = 3?',
      'Which expression is defined when x = 3?',
    ),
    options: [
      L('Ikkalasi ham', 'Оба выражения', 'Both expressions'),
      L('Faqat P(x)', 'Только P(x)', 'Only P(x)'),
      L('Faqat Q(x)', 'Только Q(x)', 'Only Q(x)'),
      L('Ikkalasi ham emas', 'Ни одно', 'Neither expression'),
    ],
    correctIndex: 1,
    correct_text: L(
      'P(3) = 0/4 = 0, shuning uchun P aniqlangan. Q ning maxraji nol, shuning uchun Q(3) aniqlanmagan.',
      'P(3) = 0/4 = 0, поэтому P определено. Знаменатель Q равен нулю, поэтому Q(3) не определено.',
      'P(3) = 0/4 = 0, so P is defined. The denominator of Q is zero, so Q(3) is undefined.',
    ),
    wrong_0: L(
      'P aniqlangan, ammo Q aniqlanmagan. Q ifodaning maxraji x = 3 da nolga teng.',
      'P определено, но Q не определено. Знаменатель Q при x = 3 равен нулю.',
      'P is defined, but Q is not. The denominator of Q becomes zero when x equals three.',
    ),
    wrong_2: L(
      "Nolga teng surat taqiqlanmaydi. P ning qiymati nol, Q ning maxraji esa nol.",
      'Нулевой числитель допустим. Значение P равно нулю, а у Q нулю равен знаменатель.',
      'A zero numerator is allowed. P equals zero, while Q has a zero denominator.',
    ),
    wrong_3: L(
      "P aniqlangan. Nolni nolga teng bo'lmagan to'rtga bo'lish mumkin.",
      'P определено. Ноль можно разделить на ненулевое число четыре.',
      'P is defined. Zero can be divided by the nonzero number four.',
    ),
    audio: {
      intro: L(
        "Iks uchga teng bo'lganda ikkala kasrni tekshiring. Suratning nolga tengligi bilan maxrajning nolga tengligini farqlang.",
        'Проверьте обе дроби при икс, равном трём. Различайте нулевой числитель и нулевой знаменатель.',
        'Check both fractions when x equals three. Distinguish a zero numerator from a zero denominator.',
      ),
      on_correct: L(
        "To'g'ri. Nolga teng surat kasrning qiymatini nol qiladi, nolga teng maxraj esa bo'lishni imkonsiz qiladi.",
        'Верно. Нулевой числитель даёт значение ноль, а нулевой знаменатель делает деление невозможным.',
        'Correct. A zero numerator gives zero, while a zero denominator makes division impossible.',
      ),
      on_wrong: L(
        "Surat va maxrajni alohida tekshiring. Taqiq nolga bo'lishdan kelib chiqadi.",
        'Проверьте числитель и знаменатель отдельно. Запрет возникает из-за деления на ноль.',
        'Check the numerator and denominator separately. The restriction comes from division by zero.',
      ),
    },
  },

  s6: {
    eyebrow: L('3 QADAM', '3 ШАГА', '3 STEPS'),
    title: L('Shartni uch qadamda tuzing', 'Составьте условие за три шага', 'Build the condition in three steps'),
    steps: [
      L('Maxrajni ajrating: x − 3', 'Выделите знаменатель: x − 3', 'Identify the denominator: x − 3'),
      L(
        "Maxraj nolga teng bo'lmasin: x − 3 ≠ 0",
        'Знаменатель не должен быть равен нулю: x − 3 ≠ 0',
        'Require a nonzero denominator: x − 3 ≠ 0',
      ),
      L('Shartni yeching: x ≠ 3', 'Решите условие: x ≠ 3', 'Solve the condition: x ≠ 3'),
    ],
    conclusion: L(
      'K(x) ifoda x = 3 dan boshqa barcha haqiqiy qiymatlarda aniqlangan.',
      'Выражение K(x) определено при всех действительных x, кроме x = 3.',
      'K(x) is defined for every real x except x = 3.',
    ),
    wrong: L(
      'Qadamlar tartibini tekshiring: maxraj, nolga teng bo‘lmaslik sharti, yechim.',
      'Проверьте порядок: знаменатель, условие ненулевого значения, решение.',
      'Check the order: denominator, nonzero condition, solution.',
    ),
    audio: L(
      [
        "Ishonchli usul uch qadamdan iborat. Maxrajni toping, uning nolga teng bo'lmaslik shartini yozing va shartni yeching.",
        "Iks minus uch nol bo'ladigan qiymat uchdir. Demak, aynan uch qiymati chiqarib tashlanadi.",
      ],
      [
        'Надёжный способ состоит из трёх шагов. Найдите знаменатель, потребуйте его ненулевое значение и решите условие.',
        'Икс минус три обращается в ноль при значении три. Значит, исключается именно число три.',
      ],
      [
        'The reliable method has three steps. Identify the denominator, require it to be nonzero, and solve the condition.',
        'The expression x minus three becomes zero at three. Therefore, three must be excluded.',
      ],
    ),
  },

  s7: {
    eyebrow: L("TA'RIF", 'ОПРЕДЕЛЕНИЕ', 'DEFINITION'),
    title: L(
      "Ifoda turi va mumkin bo'lgan qiymatlar",
      'Тип выражения и допустимые значения',
      'Expression type and permissible values',
    ),
    terms: [
      {
        name: L('Ratsional algebraik ifoda', 'Рациональное выражение', 'Rational algebraic expression'),
        definition: L(
          "Sonlar, o'zgaruvchilar va arifmetik amallardan tuzilgan ifoda.",
          'Выражение, составленное из чисел, переменных и арифметических действий.',
          'An expression built from numbers, variables, and arithmetic operations.',
        ),
      },
      {
        name: L('Butun ratsional ifoda', 'Целое рациональное выражение', 'Whole rational expression'),
        definition: L(
          "O'zgaruvchiga bo'lish qatnashmaydigan ratsional ifoda.",
          'Рациональное выражение без деления на выражение с переменной.',
          'A rational expression with no division by an expression containing a variable.',
        ),
      },
      {
        name: L('Ratsional kasr', 'Рациональная дробь', 'Rational fraction'),
        definition: L(
          "A(x) / B(x) ko'rinishidagi ifoda, bunda B(x) nolga teng bo'lmaydi.",
          'Выражение вида A(x) / B(x), где B(x) не равно нулю.',
          'An expression of the form A(x) / B(x), where B(x) is not zero.',
        ),
      },
    ],
    note: L(
      'Atamalarni navbat bilan oching.',
      'Откройте определения по очереди.',
      'Open the definitions one by one.',
    ),
    audio: L(
      [
        "Endi kuzatilgan qonuniyatni aniq matematik tilda ifodalaymiz. Ratsional kasrda o'zgaruvchi maxrajda bo'lishi mumkin.",
        "Kasr A iks ning B iks ga nisbatidir. Asosiy shart shuki, B iks nolga teng bo'lmasligi kerak.",
      ],
      [
        'Теперь сформулируем обнаруженную закономерность точным математическим языком. В рациональной дроби переменная может входить в знаменатель.',
        'Дробь является отношением A от икс к B от икс. Главное условие состоит в том, что B от икс не равно нулю.',
      ],
      [
        'Now we can state the discovered pattern using precise mathematical language. A variable may appear in the denominator of a rational fraction.',
        'The fraction is A of x divided by B of x. The essential condition is that B of x must not be zero.',
      ],
    ),
  },

  s8: {
    eyebrow: L('NAMUNA', 'ПРИМЕР', 'EXAMPLE'),
    title: L("To'liq yechim namunasi", 'Образец полного решения', 'A complete worked example'),
    steps: [
      {
        result: 'B(x) = x + 4',
        reason: L('Cheklov maxrajga bog‘liq.', 'Ограничение определяется знаменателем.', 'The restriction is determined by the denominator.'),
      },
      {
        result: 'x + 4 ≠ 0',
        reason: L("Nolga bo'lish aniqlanmagan.", 'Деление на ноль не определено.', 'Division by zero is undefined.'),
      },
      {
        result: 'x ≠ −4',
        reason: L(
          'x + 4 faqat x = −4 da nolga teng.',
          'x + 4 равно нулю только при x = −4.',
          'x + 4 is zero only when x = −4.',
        ),
      },
      {
        result: L(
          '−4 dan boshqa barcha qiymatlar mumkin',
          'допустимы все значения, кроме −4',
          'every value except −4 is permissible',
        ),
        reason: L(
          'Boshqa qiymatlarda maxraj nolga teng emas.',
          'При остальных значениях знаменатель не равен нулю.',
          'For every other value, the denominator is nonzero.',
        ),
      },
    ],
    audio: L(
      [
        "Namunada natijani va har bir o'tish sababini kuzating. Avval maxraj ajratiladi.",
        "Iks plus to'rt nolga teng bo'lmasligi kerak. U minus to'rtda nolga aylanadi, shuning uchun minus to'rt chiqariladi.",
      ],
      [
        'В образце следите за результатом и причиной каждого перехода. Сначала выделяется знаменатель.',
        'Икс плюс четыре не должно равняться нулю. Оно обращается в ноль при минус четырёх, поэтому минус четыре исключается.',
      ],
      [
        'In the example, follow both the result and the reason for each transition. Begin by identifying the denominator.',
        'The expression x plus four must be nonzero. It becomes zero at minus four, so minus four is excluded.',
      ],
    ),
  },

  s9: {
    eyebrow: L('TEKSHIRUV', 'ПРОВЕРКА', 'CHECK'),
    title: L('Taqiqlangan qiymatni toping', 'Найдите запрещённое значение', 'Find the excluded value'),
    question: L(
      'F(x) qaysi x qiymatida aniqlanmagan?',
      'При каком значении x выражение F(x) не определено?',
      'For which value of x is F(x) undefined?',
    ),
    answer: 3,
    correct_text: L(
      "To'g'ri: 2x − 6 = 0 tenglamadan x = 3. Shuning uchun x = 3 taqiqlangan.",
      'Верно: из уравнения 2x − 6 = 0 получаем x = 3. Поэтому x = 3 запрещено.',
      'Correct: solving 2x − 6 = 0 gives x = 3. Therefore x = 3 is excluded.',
    ),
    wrongByValue: {
      '-3': L(
        'Belgi xatosi. 2x − 6 = 0 dan 2x = 6, shuning uchun x musbat.',
        'Ошибка знака. Из 2x − 6 = 0 следует 2x = 6, поэтому x положительно.',
        'Check the sign. From 2x − 6 = 0 we obtain 2x = 6, so x is positive.',
      ),
      6: L(
        "6 maxrajdagi son, lekin x ning qiymati emas. Ikki tomonni 2 ga bo'ling.",
        'Число 6 входит в знаменатель, но не является значением x. Разделите обе части на 2.',
        'Six appears in the denominator, but it is not x. Divide both sides by two.',
      ),
    },
    wrong_default: L(
      'Maxrajni nolga tenglashtirib, hosil bo‘lgan tenglamani yeching.',
      'Приравняйте знаменатель к нулю и решите полученное уравнение.',
      'Set the denominator equal to zero and solve the resulting equation.',
    ),
    audio: {
      intro: L(
        "Maxraj qaysi qiymatda nol bo'lishini aniqlang. Javob maydoniga faqat taqiqlangan iks qiymatini kiriting.",
        'Определите, при каком значении знаменатель станет равен нулю. Введите только запрещённое значение икс.',
        'Determine which value makes the denominator zero. Enter only the excluded value of x.',
      ),
      on_correct: L(
        "To'g'ri. Ikki iks minus olti nolga teng bo'lganda iks uchga teng.",
        'Верно. Когда два икс минус шесть равно нулю, икс равен трём.',
        'Correct. When two x minus six equals zero, x equals three.',
      ),
      on_wrong: L(
        "Maxrajdagi tayyor sonni ko'chirmang. Maxrajni nolga tenglashtirib, iks uchun tenglamani yeching.",
        'Не переносите готовое число из знаменателя в ответ. Приравняйте знаменатель к нулю и решите уравнение.',
        'Do not copy a number from the denominator. Set the denominator equal to zero and solve for x.',
      ),
    },
  },

  s10: {
    eyebrow: L('TEKSHIRUV', 'ПРОВЕРКА', 'CHECK'),
    title: L('Ifodalarni aniq tasniflang', 'Точно классифицируйте выражения', 'Classify the expressions precisely'),
    question: L("Qaysi xulosa to'liq to'g'ri?", 'Какое утверждение полностью верно?', 'Which statement is completely correct?'),
    options: [
      L(
        "A — butun ratsional ifoda, bo'lishga bog'liq cheklovi yo'q. B — ratsional kasr, x ≠ 5.",
        'A — целое рациональное выражение без ограничения из-за деления. B — рациональная дробь, x ≠ 5.',
        'A is a whole rational expression with no division-based restriction. B is a rational fraction with x ≠ 5.',
      ),
      L(
        'Ikkala ifodada ham x qatnashgani uchun ikkalasida cheklov bor.',
        'Оба выражения имеют ограничения, потому что оба содержат x.',
        'Both expressions have restrictions because both contain x.',
      ),
      L(
        "A — butun ifoda; B ning maxraji faqat qiymat qo'yilgandan keyin paydo bo'ladi.",
        'A — целое выражение; знаменатель B появляется только после подстановки.',
        'A is whole, and the denominator of B appears only after substitution.',
      ),
      L('A — butun ifoda; B uchun x ≠ −5.', 'A — целое выражение; для B выполняется x ≠ −5.', 'A is whole, and B requires x ≠ −5.'),
    ],
    correctIndex: 0,
    correct_text: L(
      "A da o'zgaruvchili maxraj yo'q. B ning maxraji x − 5 bo'lib, u x = 5 da nolga teng.",
      'У A нет знаменателя с переменной. Знаменатель B равен x − 5 и обращается в ноль при x = 5.',
      'A has no variable denominator. The denominator of B is x − 5, which becomes zero at x = 5.',
    ),
    wrong_1: L(
      "O'zgaruvchining mavjudligi o'zi cheklov yaratmaydi. Cheklov o'zgaruvchili maxraj tufayli paydo bo'ladi.",
      'Само наличие переменной не создаёт ограничения. Ограничение возникает из-за знаменателя с переменной.',
      'A variable does not create a restriction by itself. The restriction comes from a variable denominator.',
    ),
    wrong_2: L(
      "B ning maxraji boshidanoq x − 5. Qiymat qo'yish faqat uning sonli qiymatini topadi.",
      'Знаменатель B изначально равен x − 5. Подстановка лишь вычисляет его числовое значение.',
      'The denominator of B is x − 5 from the start. Substitution only evaluates it.',
    ),
    wrong_3: L(
      'x − 5 = 0 tenglamaning yechimi x = 5.',
      'Уравнение x − 5 = 0 имеет решение x = 5.',
      'The equation x − 5 = 0 has solution x = 5.',
    ),
    audio: {
      intro: L(
        "Ikki ifodaning tuzilishini taqqoslang. O'zgaruvchining maxrajda qatnashishini tekshiring.",
        'Сравните строение двух выражений. Проверяйте присутствие переменной в знаменателе.',
        'Compare the two expressions. Check whether the variable appears in a denominator.',
      ),
      on_correct: L(
        "To'g'ri. Birinchi ifodada bo'lish cheklovi yo'q, ikkinchisida besh maxrajni nol qiladi.",
        'Верно. У первого выражения нет ограничения из-за деления, а во втором пять обращает знаменатель в ноль.',
        'Correct. The first has no division restriction, while five makes the second denominator zero.',
      ),
      on_wrong: L(
        "Ifodalarni tashqi ko'rinishi bo'yicha emas, tuzilishi bo'yicha tahlil qiling.",
        'Анализируйте выражения по структуре, а не по внешнему виду.',
        'Analyze the expressions by structure, not by appearance.',
      ),
    },
  },

  s11: {
    eyebrow: L('XATONI TOPING', 'НАЙДИ ОШИБКУ', 'FIND THE ERROR'),
    title: L('Yechimdagi birinchi xatoni toping', 'Найдите первую ошибку в решении', 'Find the first error in the solution'),
    question: L("Birinchi noto'g'ri qadam qaysi?", 'Какой шаг является первым неверным?', 'Which step is the first incorrect step?'),
    solutionSteps: [
      L('1-qadam. x = 4 da surat nolga teng.', 'Шаг 1. При x = 4 числитель равен нулю.', 'Step 1. At x = 4, the numerator equals zero.'),
      L('2-qadam. Demak, x = 4 taqiqlangan.', 'Шаг 2. Следовательно, x = 4 запрещено.', 'Step 2. Therefore, x = 4 is excluded.'),
      L("3-qadam. Boshqa cheklovlar yo'q.", 'Шаг 3. Других ограничений нет.', 'Step 3. There are no other restrictions.'),
    ],
    options: [
      L('Birinchi qadam', 'Первый шаг', 'Step one'),
      L('Ikkinchi qadam', 'Второй шаг', 'Step two'),
      L('Uchinchi qadam', 'Третий шаг', 'Step three'),
      L("Xato yo'q", 'Ошибок нет', 'There is no error'),
    ],
    correctIndex: 1,
    correct_text: L(
      "Birinchi qadam to'g'ri, lekin nol surat taqiq yaratmaydi. Maxrajdan x ≠ −2 kelib chiqadi.",
      'Первый шаг верен, но нулевой числитель не создаёт запрета. Из знаменателя получаем x ≠ −2.',
      'Step one is correct, but a zero numerator creates no restriction. The denominator gives x ≠ −2.',
    ),
    wrong_0: L(
      "Birinchi hisob to'g'ri. Xato keyingi xulosada boshlanadi.",
      'Первое вычисление верно. Ошибка начинается в следующем выводе.',
      'The first calculation is correct. The error begins in the next conclusion.',
    ),
    wrong_2: L(
      'Uchinchi qadam ham noto‘g‘ri, lekin xato oldinroq, ikkinchi qadamda boshlangan.',
      'Третий шаг тоже неверен, но ошибка появилась раньше, во втором шаге.',
      'Step three is also incorrect, but the error appeared earlier in step two.',
    ),
    wrong_3: L(
      'Xato bor: nol suratdan taqiqlangan qiymat haqida xulosa chiqarilgan.',
      'Ошибка есть: из нулевого числителя сделан вывод о запрещённом значении.',
      'There is an error: a restriction was inferred from a zero numerator.',
    ),
    audio: {
      intro: L(
        "Anonim yechimdagi qadamlarni ketma-ket tekshiring. Birinchi noto'g'ri o'tishni toping.",
        'Проверьте шаги анонимного решения по порядку. Найдите первый неверный переход.',
        'Examine the anonymous solution in order. Find the first invalid transition.',
      ),
      on_correct: L(
        "To'g'ri. Nol surat mumkin, shuning uchun xato ikkinchi qadamdagi taqiq xulosasida boshlanadi.",
        'Верно. Нулевой числитель допустим, поэтому ошибка начинается во втором шаге.',
        'Correct. A zero numerator is allowed, so the error begins in step two.',
      ),
      on_wrong: L(
        "Qadamlarni boshidan tekshiring. Birinchi hisob to'g'ri, ammo undan chiqarilgan taqiq asosli emas.",
        'Проверяйте шаги с начала. Первое вычисление верно, но вывод о запрете необоснован.',
        'Check from the beginning. The first calculation is correct, but the restriction is unjustified.',
      ),
    },
  },

  s12: {
    eyebrow: L('KASR TUZING', 'СОСТАВЬ ДРОБЬ', 'BUILD A FRACTION'),
    title: L('Cheklovi berilgan kasrni tuzing', 'Составьте дробь с заданным ограничением', 'Construct a fraction with a given restriction'),
    prompt: L(
      'x = −2 da aniqlanmaydigan ratsional kasr tuzing.',
      'Составьте рациональную дробь, не определённую при x = −2.',
      'Construct a rational fraction that is undefined when x = −2.',
    ),
    numerators: ['x − 1', '2x + 3', '5'],
    denominators: ['x − 2', 'x + 2', '2x + 4', 'x + 4'],
    validDenominators: [1, 2],
    followup: L(
      'Tanlangan kasrning qaysi qismi cheklovni kafolatlaydi?',
      'Какая часть выбранной дроби гарантирует ограничение?',
      'Which part of the selected fraction guarantees the restriction?',
    ),
    followupOptions: [
      L('Surat', 'Числитель', 'Numerator'),
      L('Maxraj', 'Знаменатель', 'Denominator'),
      L("Kasr chizig'i", 'Черта дроби', 'Fraction bar'),
    ],
    correct_text: L(
      'x + 2 ham, 2x + 4 ham x = −2 da nolga teng. Suratni bir necha usulda tanlash mumkin.',
      'И x + 2, и 2x + 4 равны нулю при x = −2. Числитель можно выбрать несколькими способами.',
      'Both x + 2 and 2x + 4 equal zero at x = −2. The numerator can be chosen in several ways.',
    ),
    wrong_text: L(
      'Tanlangan maxrajga x = −2 ni qo‘ying. Natija nol bo‘lishi kerak.',
      'Подставьте x = −2 в выбранный знаменатель. Результат должен быть равен нулю.',
      'Substitute x = −2 into the selected denominator. The result must be zero.',
    ),
    audio: L(
      [
        "Bu safar tayyor ifodani tekshirmaysiz, kerakli xususiyatga ega kasrni o'zingiz tuzasiz.",
        "Minus ikki qiymatida nolga aylanadigan maxrajni tanlang. To'g'ri maxraj bitta emas.",
        "Cheklovni surat emas, aynan maxraj yaratishini izohlang.",
      ],
      [
        'На этот раз вы самостоятельно строите дробь с нужным свойством.',
        'Выберите знаменатель, который обращается в ноль при минус двух. Правильных знаменателей несколько.',
        'Объясните, что ограничение создаётся знаменателем, а не числителем.',
      ],
      [
        'This time, construct a fraction with the required property.',
        'Choose a denominator that becomes zero at minus two. More than one denominator is valid.',
        'Explain that the denominator, rather than the numerator, creates the restriction.',
      ],
    ),
  },

  s13: {
    eyebrow: L('YAKUNIY TEKSHIRUV · 1', 'ИТОГОВАЯ ПРОВЕРКА · 1', 'FINAL CHECK · 1'),
    title: L('Taqiqlangan p qiymati', 'Запрещённое значение p', 'The excluded value of p'),
    question: L(
      'C(p) ifoda qaysi p qiymatida aniqlanmagan?',
      'При каком значении p выражение C(p) не определено?',
      'For which value of p is C(p) undefined?',
    ),
    answer: -4,
    correct_text: L(
      "To'g'ri: 2p + 8 = 0 tenglamadan p = −4. Demak, p ≠ −4.",
      'Верно: из уравнения 2p + 8 = 0 получаем p = −4. Значит, p ≠ −4.',
      'Correct: solving 2p + 8 = 0 gives p = −4. Therefore, p ≠ −4.',
    ),
    wrongByValue: {
      4: L(
        'Musbat to‘rt maxrajni nol qilmaydi. Tenglamada sakkiz qarama-qarshi ishora bilan o‘tadi.',
        'Положительное четыре не обращает знаменатель в ноль. Восемь переносится с противоположным знаком.',
        'Positive four does not make the denominator zero. Eight moves with the opposite sign.',
      ),
      '-8': L(
        "Manfiy sakkiz oraliq natija, p ning qiymati emas. Uni ikki koeffitsiyentiga bo'ling.",
        'Минус восемь — промежуточное значение, а не значение p. Разделите его на два.',
        'Minus eight is an intermediate value, not p. Divide it by two.',
      ),
      12: L(
        'O‘n ikki suratdagi son. Aniqlanish sharti uchun maxrajni tekshiring.',
        'Число двенадцать находится в числителе. Для условия определённости проверьте знаменатель.',
        'Twelve appears in the numerator. Examine the denominator for the restriction.',
      ),
    },
    wrong_default: L(
      'Maxrajni nolga tenglashtirib, chiziqli tenglamani oxirigacha yeching.',
      'Приравняйте знаменатель к нулю и полностью решите линейное уравнение.',
      'Set the denominator equal to zero and completely solve the linear equation.',
    ),
    audio: {
      intro: L(
        "Yangi o'zgaruvchili kasr uchun taqiqlangan qiymatni mustaqil toping. Faqat p qiymatini kiriting.",
        'Самостоятельно найдите запрещённое значение для дроби с новой переменной. Введите только значение пэ.',
        'Independently find the excluded value for the fraction with a new variable. Enter only p.',
      ),
      on_correct: L(
        "To'g'ri. Ikki p plus sakkiz nolga teng bo'lganda p minus to'rtga teng.",
        'Верно. Когда два пэ плюс восемь равно нулю, пэ равно минус четырём.',
        'Correct. When two p plus eight equals zero, p equals minus four.',
      ),
      on_wrong: L(
        'Suratni emas, maxrajni tekshiring. Maxrajni nolga tenglashtirib, tenglamani yeching.',
        'Проверяйте знаменатель, а не числитель. Приравняйте знаменатель к нулю и решите уравнение.',
        'Examine the denominator, not the numerator. Set it equal to zero and solve.',
      ),
    },
  },

  s14: {
    eyebrow: L('YAKUNIY TEKSHIRUV · 2', 'ИТОГОВАЯ ПРОВЕРКА · 2', 'FINAL CHECK · 2'),
    title: L('Nol natija mumkinmi?', 'Допустим ли нулевой результат?', 'Is a zero result allowed?'),
    question: L('p = 12 qiymati C(p) uchun mumkinmi?', 'Допустимо ли p = 12 для C(p)?', 'Is p = 12 permissible for C(p)?'),
    options: [
      L('Ha. C(12) = 0, maxraj esa 32.', 'Да. C(12) = 0, а знаменатель равен 32.', 'Yes. C(12) = 0, and the denominator is 32.'),
      L("Yo'q, chunki surat nolga teng.", 'Нет, потому что числитель равен нулю.', 'No, because the numerator is zero.'),
      L('Ha, lekin C(12) = 32.', 'Да, но C(12) = 32.', 'Yes, but C(12) = 32.'),
      L("Yo'q, chunki kasrning qiymati nol.", 'Нет, потому что значение дроби равно нулю.', 'No, because the value is zero.'),
    ],
    correctIndex: 0,
    correct_text: L(
      "p = 12 da surat 0, maxraj 32. Nolni nolga teng bo'lmagan songa bo'lish mumkin.",
      'При p = 12 числитель равен 0, знаменатель равен 32. Ноль можно разделить на ненулевое число.',
      'At p = 12, the numerator is zero and the denominator is 32. Zero may be divided by a nonzero number.',
    ),
    wrong_1: L(
      'Nol surat mumkin. Taqiq faqat maxraj nolga teng bo‘lganda paydo bo‘ladi.',
      'Нулевой числитель допустим. Запрет возникает только при нулевом знаменателе.',
      'A zero numerator is allowed. A restriction occurs only with a zero denominator.',
    ),
    wrong_2: L(
      '32 — maxrajning qiymati. Butun kasrning qiymati 0/32 = 0.',
      'Число 32 — значение знаменателя. Вся дробь равна 0/32 = 0.',
      'Thirty-two is the denominator. The entire fraction equals 0/32 = 0.',
    ),
    wrong_3: L(
      'Kasrning nolga teng natijasi taqiqlanmaydi.',
      'Нулевое значение дроби не запрещено.',
      'A fraction is allowed to equal zero.',
    ),
    audio: {
      intro: L(
        "P ning o'n ikki qiymatini surat va maxrajga qo'ying. Qiymatning mumkinligini tekshiring.",
        'Подставьте пэ, равное двенадцати, в числитель и знаменатель. Проверьте допустимость.',
        'Substitute twelve for p in the numerator and denominator. Check whether it is permissible.',
      ),
      on_correct: L(
        "To'g'ri. Surat nol, maxraj esa o'ttiz ikki. Kasrning qiymati nolga teng.",
        'Верно. Числитель равен нулю, знаменатель равен тридцати двум. Значение дроби равно нулю.',
        'Correct. The numerator is zero, the denominator is thirty-two, and the fraction equals zero.',
      ),
      on_wrong: L(
        "Nol natija bilan nolga bo'lishni aralashtirmang. Bu yerda maxraj o'ttiz ikki.",
        'Не смешивайте нулевой результат с делением на ноль. Здесь знаменатель равен тридцати двум.',
        'Do not confuse a zero result with division by zero. Here the denominator is thirty-two.',
      ),
    },
  },

  s15: {
    eyebrow: L('DARS XULOSASI', 'ИТОГИ УРОКА', 'LESSON SUMMARY'),
    title: L(
      'Formulaning chegarasini maxraj belgilaydi',
      'Границу применимости задаёт знаменатель',
      'The denominator determines where the formula is defined',
    ),
    summary: L(
      "Ratsional kasrning qiymati maxraj nolga teng bo'lmaganda aniqlangan.",
      'Значение рациональной дроби определено, когда её знаменатель не равен нулю.',
      'A rational fraction is defined whenever its denominator is nonzero.',
    ),
    canDo: [
      L('Men ratsional kasrning maxrajini aniqlay olaman.', 'Я умею находить знаменатель рациональной дроби.', 'I can identify the denominator of a rational fraction.'),
      L(
        'Men maxrajni nolga tenglashtirib, taqiqlangan qiymatni topa olaman.',
        'Я умею находить запрещённое значение, приравнивая знаменатель к нулю.',
        'I can find an excluded value by setting the denominator equal to zero.',
      ),
      L(
        'Men nol surat bilan nol maxrajning farqini tushuntira olaman.',
        'Я умею объяснять различие между нулевым числителем и нулевым знаменателем.',
        'I can explain the difference between a zero numerator and a zero denominator.',
      ),
    ],
    hypothesisReturn: L(
      'Boshlang‘ich prognozni tajriba bilan solishtiring: K(x) uchun faqat x = 3 mumkin emas.',
      'Сравните прогноз с экспериментом: для K(x) запрещено только x = 3.',
      'Compare the prediction with the experiment: for K(x), only x = 3 is excluded.',
    ),
    bridge: L(
      "Keyingi dars: surat va maxraj bir xil nolga teng bo'lmagan ko'paytuvchiga o'zgartirilsa, nega kasrning qiymati saqlanadi?",
      'Следующий урок: почему значение дроби сохраняется, если числитель и знаменатель изменить одним ненулевым множителем?',
      'Next lesson: why is a fraction unchanged when its numerator and denominator are transformed by the same nonzero factor?',
    ),
    audio: L(
      [
        "Tadqiqotning asosiy xulosasi shuki, ratsional kasrda mumkin bo'lmagan qiymatlar maxraj orqali topiladi.",
        "Nolga teng surat mumkin va kasr qiymatini nol qiladi. Nolga teng maxraj ifodani aniqlanmagan qiladi.",
        "Keyingi darsda ratsional kasrning qiymatini saqlaydigan o'zgartirishlarni tadqiq qilamiz.",
      ],
      [
        'Главный вывод исследования состоит в том, что запрещённые значения рациональной дроби определяются по знаменателю.',
        'Нулевой числитель допустим и даёт ноль. Нулевой знаменатель делает выражение неопределённым.',
        'На следующем уроке исследуем преобразования, сохраняющие значение рациональной дроби.',
      ],
      [
        'The central conclusion is that excluded values of a rational fraction are determined from its denominator.',
        'A zero numerator is allowed and gives zero. A zero denominator makes the expression undefined.',
        'In the next lesson, we will investigate transformations that preserve the value of a rational fraction.',
      ],
    ),
  },
}

// Seven calm explanation screens. Each narration segment owns one visual phase,
// so the mathematical picture changes at the same moment as the voice.
const THEORY_CONTENT = [
  {
    eyebrow: L('NIMA UCHUN?', 'ЗАЧЕМ ЭТО НУЖНО?', 'WHY IT MATTERS'),
    title: L(
      'Formulaning ham chegarasi bo‘ladi',
      'У формулы тоже бывают границы',
      'A formula can have limits',
    ),
    points: [
      L(
        'Kasrli formulaga istalgan sonni ko‘r-ko‘rona qo‘yib bo‘lmaydi.',
        'В дробную формулу нельзя без проверки подставлять любое число.',
        'You cannot substitute every number into a fractional formula without checking it.',
      ),
      L(
        'Avval maxrajga qaraymiz: u nolga aylansa, hisoblash to‘xtaydi.',
        'Сначала смотрим на знаменатель: если он стал нулём, вычисление невозможно.',
        'First inspect the denominator: if it becomes zero, evaluation is impossible.',
      ),
      L(
        'K formulada muammoli qiymat uch, chunki uch minus uch nol.',
        'В формуле K проблемное значение — три, потому что три минус три равно нулю.',
        'For K, the problematic value is three because three minus three equals zero.',
      ),
    ],
    audio: L(
      [
        'Kasrli formula barcha sonlarni qabul qilmasligi mumkin. Shuning uchun hisoblashdan oldin uning chegarasini tekshiramiz.',
        'Chegarani maxraj belgilaydi. Maxraj nolga aylansa, nolga bo‘lish hosil bo‘ladi va ifoda aniqlanmaydi.',
        'K iks formulada iks uchga teng bo‘lsa, maxraj uch minus uch, ya’ni nol bo‘ladi. Demak, uchni chiqarib tashlaymiz.',
      ],
      [
        'Дробная формула может принимать не все числа. Поэтому перед вычислением нужно проверить её границу применимости.',
        'Эту границу задаёт знаменатель. Если он обращается в ноль, возникает деление на ноль и выражение не определено.',
        'В формуле ка от икс при икс, равном трём, знаменатель равен три минус три, то есть нулю. Поэтому число три исключаем.',
      ],
      [
        'A fractional formula may not accept every number. Before evaluating it, we check where the formula is defined.',
        'The denominator creates the boundary. If it becomes zero, division by zero occurs and the expression is undefined.',
        'In K of x, when x equals three, the denominator is three minus three, which is zero. Therefore, three is excluded.',
      ],
    ),
    visual: { kind: 'boundary', n: '2x + 1', d: 'x − 3', values: [0, 2, 3, 4] },
  },
  {
    eyebrow: L('ASOSIY TUSHUNCHA', 'ОСНОВНАЯ ИДЕЯ', 'CORE IDEA'),
    title: L(
      'Ratsional ifoda va ratsional kasr',
      'Рациональное выражение и рациональная дробь',
      'Rational expressions and rational fractions',
    ),
    points: [
      L(
        'Sonlar, harflar va arifmetik amallardan tuzilgan ifoda ratsional ifoda deyiladi.',
        'Выражение из чисел, переменных и арифметических действий называют рациональным.',
        'An expression built from numbers, variables, and arithmetic operations is rational.',
      ),
      L(
        'O‘zgaruvchiga bo‘lish bo‘lmasa, bu butun ratsional ifoda.',
        'Если деления на выражение с переменной нет, выражение является целым рациональным.',
        'Without division by an expression containing a variable, it is a whole rational expression.',
      ),
      L(
        'A(x) ning B(x) ga nisbati ratsional kasr; bunda B(x) nol bo‘lmaydi.',
        'Отношение A(x) к B(x) — рациональная дробь; при этом B(x) не равно нулю.',
        'A(x) divided by B(x) is a rational fraction, with B(x) not equal to zero.',
      ),
    ],
    audio: L(
      [
        'Ratsional ifoda sonlar, o‘zgaruvchilar va to‘rtta arifmetik amal yordamida tuziladi.',
        'Agar o‘zgaruvchi maxrajda qatnashmasa, ifoda butun ratsional ifoda bo‘ladi.',
        'A iks ning B iks ga nisbati ratsional kasr deyiladi. Uning muhim sharti B iks nolga teng emas.',
      ],
      [
        'Рациональное выражение составляют из чисел, переменных и четырёх арифметических действий.',
        'Если переменная не входит в знаменатель, перед нами целое рациональное выражение.',
        'Отношение A от икс к B от икс называют рациональной дробью. Главное условие: B от икс не равно нулю.',
      ],
      [
        'A rational expression is built from numbers, variables, and the four arithmetic operations.',
        'If a variable does not appear in a denominator, the expression is a whole rational expression.',
        'A of x divided by B of x is a rational fraction. Its essential condition is that B of x is not zero.',
      ],
    ),
    visual: { kind: 'classify' },
  },
  {
    eyebrow: L('KASR ANATOMIYASI', 'АНАТОМИЯ ДРОБИ', 'FRACTION ANATOMY'),
    title: L(
      'Surat natijani, maxraj esa ruxsatni boshqaradi',
      'Числитель задаёт результат, знаменатель — допустимость',
      'The numerator controls the result; the denominator controls validity',
    ),
    points: [
      L(
        'Kasr chizig‘ining ustidagi qism surat.',
        'Часть над чертой дроби — числитель.',
        'The part above the fraction bar is the numerator.',
      ),
      L(
        'Kasr chizig‘ining ostidagi qism maxraj.',
        'Часть под чертой дроби — знаменатель.',
        'The part below the fraction bar is the denominator.',
      ),
      L(
        'Mumkin bo‘lmagan qiymatlarni faqat maxrajdan qidiramiz.',
        'Запрещённые значения ищем только по знаменателю.',
        'Excluded values are found from the denominator only.',
      ),
    ],
    audio: L(
      [
        'Ratsional kasr ikki qismdan iborat. Kasr chizig‘i ustidagi ifoda surat deb ataladi.',
        'Kasr chizig‘i ostidagi ifoda maxraj. Aynan maxraj nolga teng bo‘lishi mumkin emas.',
        'Shuning uchun aniqlanish sohasini topishda suratni emas, maxrajni tekshiramiz.',
      ],
      [
        'Рациональная дробь состоит из двух частей. Выражение над чертой называется числителем.',
        'Выражение под чертой — знаменатель. Именно знаменатель не может быть равен нулю.',
        'Поэтому при поиске допустимых значений проверяем знаменатель, а не числитель.',
      ],
      [
        'A rational fraction has two parts. The expression above the bar is the numerator.',
        'The expression below the bar is the denominator. The denominator cannot equal zero.',
        'Therefore, to find permissible values, inspect the denominator rather than the numerator.',
      ],
    ),
    visual: { kind: 'anatomy', n: 'x − 3', d: 'x + 1' },
  },
  {
    eyebrow: L('MUHIM FARQ', 'ВАЖНОЕ РАЗЛИЧИЕ', 'KEY DISTINCTION'),
    title: L('Nol surat mumkin, nol maxraj mumkin emas', 'Нулевой числитель можно, нулевой знаменатель нельзя', 'A zero numerator is allowed; a zero denominator is not'),
    points: [
      L('Nolni to‘rtga bo‘lsak, nol chiqadi.', 'Ноль, делённый на четыре, равен нулю.', 'Zero divided by four equals zero.'),
      L('To‘rtni nolga bo‘lish aniqlanmagan.', 'Четыре разделить на ноль нельзя.', 'Four divided by zero is undefined.'),
      L('Nol natija va nolga bo‘lish — ikki xil holat.', 'Нулевой результат и деление на ноль — разные ситуации.', 'A zero result and division by zero are different situations.'),
    ],
    audio: L(
      [
        'Surat nol bo‘lishi mumkin. Nolni nolga teng bo‘lmagan songa bo‘lsak, kasrning qiymati nol bo‘ladi.',
        'Maxraj nol bo‘lsa, bo‘lish amalining ma’nosi yo‘q. Bunday kasr aniqlanmagan.',
        'Demak, nol natijadan qo‘rqmaymiz. Faqat nol maxrajni taqiqlaymiz.',
      ],
      [
        'Числитель может быть равен нулю. Ноль, делённый на ненулевое число, даёт ноль.',
        'Если знаменатель равен нулю, деление не имеет смысла. Такая дробь не определена.',
        'Значит, нулевой результат допустим. Запрещён только нулевой знаменатель.',
      ],
      [
        'The numerator may equal zero. Zero divided by a nonzero number equals zero.',
        'If the denominator is zero, division has no meaning. The fraction is undefined.',
        'Therefore, a zero result is allowed. Only a zero denominator is forbidden.',
      ],
    ),
    visual: { kind: 'twoZeros' },
  },
  {
    eyebrow: L('ALGORITM', 'АЛГОРИТМ', 'METHOD'),
    title: L('Taqiqlangan qiymatni uch qadamda topamiz', 'Находим запрещённое значение за три шага', 'Find an excluded value in three steps'),
    points: [
      L('1. Maxrajni ajrating.', '1. Выделите знаменатель.', '1. Identify the denominator.'),
      L('2. Uni nolga tenglashtiring.', '2. Приравняйте его к нулю.', '2. Set it equal to zero.'),
      L('3. Tenglamani yeching va qiymatni chiqarib tashlang.', '3. Решите уравнение и исключите найденное значение.', '3. Solve and exclude the resulting value.'),
    ],
    audio: L(
      [
        'Birinchi qadam: kasrdagi maxrajni alohida yozamiz. K formulada u iks minus uch.',
        'Ikkinchi qadam: maxraj qachon nol bo‘lishini bilish uchun iks minus uchni nolga tenglashtiramiz.',
        'Uchinchi qadam: tenglama iks uchga tengligini beradi. Demak, iks uchga teng bo‘lmasligi kerak.',
      ],
      [
        'Первый шаг: отдельно выписываем знаменатель. В формуле K это икс минус три.',
        'Второй шаг: чтобы узнать, когда знаменатель равен нулю, приравниваем икс минус три к нулю.',
        'Третий шаг: уравнение даёт икс, равный трём. Поэтому икс не должен быть равен трём.',
      ],
      [
        'Step one: write the denominator separately. For K, it is x minus three.',
        'Step two: set x minus three equal to zero to find when the denominator vanishes.',
        'Step three: the equation gives x equals three. Therefore, x must not equal three.',
      ],
    ),
    visual: { kind: 'algorithm', n: '2x + 1', d: 'x − 3', steps: ['B(x) = x − 3', 'x − 3 = 0', 'x ≠ 3'] },
  },
  {
    eyebrow: L('BIRGALIKDA YECHAMIZ', 'РЕШАЕМ ВМЕСТЕ', 'WORKED EXAMPLE'),
    title: L('Murakkabroq maxrajda ham usul o‘zgarmaydi', 'Даже с более сложным знаменателем способ тот же', 'The method is unchanged for a more complex denominator'),
    points: [
      L('F(x) ning maxraji 2x − 6.', 'Знаменатель F(x) равен 2x − 6.', 'The denominator of F(x) is 2x − 6.'),
      L('2x − 6 = 0 tenglamadan 2x = 6.', 'Из уравнения 2x − 6 = 0 получаем 2x = 6.', 'From 2x − 6 = 0, we obtain 2x = 6.'),
      L('x = 3, shuning uchun x ≠ 3.', 'x = 3, поэтому x ≠ 3.', 'x = 3, so x ≠ 3.'),
    ],
    audio: L(
      [
        'F iks kasrida maxraj ikki iks minus olti. Avval faqat shu qismga e’tibor beramiz.',
        'Maxrajni nolga tenglashtiramiz. Ikki iks minus olti nol bo‘lsa, ikki iks oltiga teng.',
        'Ikkala tomonni ikkiga bo‘lamiz va iks uchni olamiz. Uch taqiqlangan qiymat.',
      ],
      [
        'В дроби эф от икс знаменатель равен два икс минус шесть. Сначала работаем только с этой частью.',
        'Приравниваем знаменатель к нулю. Если два икс минус шесть равно нулю, то два икс равно шести.',
        'Делим обе части на два и получаем икс, равный трём. Три — запрещённое значение.',
      ],
      [
        'For F of x, the denominator is two x minus six. Begin by focusing on this part only.',
        'Set the denominator equal to zero. If two x minus six is zero, then two x equals six.',
        'Divide both sides by two to get x equals three. Three is the excluded value.',
      ],
    ),
    visual: { kind: 'workedExample', name: 'F(x)', n: '5', d: '2x − 6', steps: ['B(x) = 2x − 6', '2x − 6 = 0', 'x ≠ 3'] },
  },
  {
    eyebrow: L('QOIDANI MUSTAHKAMLASH', 'ФИКСИРУЕМ ПРАВИЛО', 'LOCK IN THE RULE'),
    title: L('Bitta qoida barcha ratsional kasrlarga ishlaydi', 'Одно правило работает для всех рациональных дробей', 'One rule works for every rational fraction'),
    points: [
      L('Kasr A(x) / B(x) ko‘rinishida bo‘ladi.', 'Дробь имеет вид A(x) / B(x).', 'A fraction has the form A(x) / B(x).'),
      L('Asosiy shart: B(x) ≠ 0.', 'Главное условие: B(x) ≠ 0.', 'The essential condition is B(x) ≠ 0.'),
      L('Maxrajning barcha nollarini topib, ularni chiqarib tashlaymiz.', 'Находим все нули знаменателя и исключаем их.', 'Find every zero of the denominator and exclude it.'),
    ],
    audio: L(
      [
        'Qoidani umumiy ko‘rinishda yozamiz. Ratsional kasr A iks ning B iks ga nisbatidir.',
        'Kasr aniqlangan bo‘lishi uchun B iks nolga teng bo‘lmasligi shart.',
        'Esda tuting: maxrajni toping, uni nolga tenglashtiring, tenglamani yeching va topilgan qiymatlarni chiqarib tashlang.',
      ],
      [
        'Запишем правило в общем виде. Рациональная дробь — это A от икс, делённое на B от икс.',
        'Чтобы дробь была определена, B от икс не должно быть равно нулю.',
        'Запомните: найдите знаменатель, приравняйте его к нулю, решите уравнение и исключите найденные значения.',
      ],
      [
        'Write the rule in general form. A rational fraction is A of x divided by B of x.',
        'For the fraction to be defined, B of x must not equal zero.',
        'Remember: identify the denominator, set it equal to zero, solve, and exclude the resulting values.',
      ],
    ),
    visual: { kind: 'rule' },
  },
]

const P = (config) => config

const PRACTICE_BLOCKS = [
  {
    eyebrow: L('AMALIYOT · 1', 'ПРАКТИКА · 1', 'PRACTICE · 1'),
    title: L('Tuzilishni ko‘ring', 'Увидьте структуру', 'See the structure'),
    lead: L('Oltita qisqa savol. Keyingisi faqat to‘g‘ri javobdan so‘ng ochiladi.', 'Шесть коротких вопросов. Следующий откроется только после верного ответа.', 'Six short questions. The next one unlocks only after a correct answer.'),
    done: L('Asosiy farqlar aniq: kasr, maxraj va ikki xil nol.', 'Основные различия закреплены: дробь, знаменатель и два разных нуля.', 'The key distinctions are secure: fraction, denominator, and the two kinds of zero.'),
    tasks: [
      P({
        type: 'mc',
        question: L('Qaysi ifoda ratsional kasr?', 'Какое выражение является рациональной дробью?', 'Which expression is a rational fraction?'),
        options: [L('3x + 1', '3x + 1', '3x + 1'), L('(x + 1) / (x − 2)', '(x + 1) / (x − 2)', '(x + 1) / (x − 2)'), L('x² − 4', 'x² − 4', 'x² − 4')],
        correct: 1,
        visual: { name: 'Q(x)', n: 'x + 1', d: 'x − 2', focus: 'whole' },
        wrong: L('O‘zgaruvchi maxrajda qatnashgan ifodani toping.', 'Найдите выражение, где переменная входит в знаменатель.', 'Find the expression with a variable in the denominator.'),
        solution: [L('Maxraj x − 2.', 'Знаменатель равен x − 2.', 'The denominator is x − 2.'), L('O‘zgaruvchi maxrajda, demak bu ratsional kasr.', 'Переменная находится в знаменателе, значит это рациональная дробь.', 'The variable is in the denominator, so this is a rational fraction.')],
        audio: L('O‘zgaruvchi maxrajda qatnashgan ratsional kasrni tanlang.', 'Выберите рациональную дробь, в знаменателе которой есть переменная.', 'Choose the rational fraction whose denominator contains a variable.'),
      }),
      P({
        type: 'mc',
        question: L('K(x) kasrining maxraji qaysi?', 'Каков знаменатель дроби K(x)?', 'What is the denominator of K(x)?'),
        options: [L('2x + 1', '2x + 1', '2x + 1'), L('x − 3', 'x − 3', 'x − 3'), L('K(x)', 'K(x)', 'K(x)')],
        correct: 1,
        visual: { name: 'K(x)', n: '2x + 1', d: 'x − 3', focus: 'denominator' },
        wrong: L('Kasr chizig‘ining ostidagi qismga qarang.', 'Посмотрите на часть под чертой дроби.', 'Look below the fraction bar.'),
        solution: [L('Pastki qism x − 3.', 'Нижняя часть — x − 3.', 'The lower part is x − 3.'), L('Shuning uchun B(x) = x − 3.', 'Поэтому B(x) = x − 3.', 'Therefore B(x) = x − 3.')],
        audio: L('K iks kasrida kasr chizig‘i ostidagi ifodani toping.', 'Найдите выражение под чертой дроби в ка от икс.', 'Identify the expression below the fraction bar in K of x.'),
      }),
      P({
        type: 'mc',
        question: L('x = 3 qiymati K(x) uchun mumkinmi?', 'Допустимо ли x = 3 для K(x)?', 'Is x = 3 permissible for K(x)?'),
        options: [L('Ha', 'Да', 'Yes'), L('Yo‘q', 'Нет', 'No'), L('Faqat surat nol bo‘lsa', 'Только если числитель равен нулю', 'Only if the numerator is zero')],
        correct: 1,
        visual: { name: 'K(3)', n: '7', d: '3 − 3', focus: 'denominator' },
        wrong: L('Maxrajda uch minus uchni hisoblang.', 'Вычислите три минус три в знаменателе.', 'Evaluate three minus three in the denominator.'),
        solution: [L('3 − 3 = 0.', '3 − 3 = 0.', '3 − 3 = 0.'), L('Nol maxraj taqiqlangan, demak x = 3 mumkin emas.', 'Нулевой знаменатель запрещён, поэтому x = 3 недопустимо.', 'A zero denominator is forbidden, so x = 3 is not permissible.')],
        audio: L('Iks o‘rniga uchni qo‘ying va maxrajni tekshiring.', 'Подставьте три вместо икс и проверьте знаменатель.', 'Substitute three for x and inspect the denominator.'),
      }),
      P({
        type: 'mc',
        question: L('0 / 4 kasrining qiymati nima?', 'Чему равна дробь 0 / 4?', 'What is 0 / 4?'),
        options: [L('0', '0', '0'), L('4', '4', '4'), L('Aniqlanmagan', 'Не определено', 'Undefined')],
        correct: 0,
        visual: { name: '', n: '0', d: '4', focus: 'numerator' },
        wrong: L('Nol surat mumkin, chunki maxraj nol emas.', 'Нулевой числитель допустим, ведь знаменатель не равен нулю.', 'A zero numerator is allowed because the denominator is nonzero.'),
        solution: [L('Maxraj 4 va u nol emas.', 'Знаменатель равен 4 и не равен нулю.', 'The denominator is 4 and is nonzero.'), L('0 ni 4 ga bo‘lsak, 0.', '0 разделить на 4 равно 0.', '0 divided by 4 equals 0.')],
        audio: L('Nolni to‘rtga bo‘lish natijasini tanlang.', 'Выберите результат деления нуля на четыре.', 'Choose the result of zero divided by four.'),
      }),
      P({
        type: 'mc',
        question: L('4 / 0 ifoda haqida qaysi fikr to‘g‘ri?', 'Какое утверждение о выражении 4 / 0 верно?', 'Which statement about 4 / 0 is correct?'),
        options: [L('Qiymati 0', 'Значение равно 0', 'Its value is 0'), L('Qiymati 4', 'Значение равно 4', 'Its value is 4'), L('Aniqlanmagan', 'Не определено', 'It is undefined')],
        correct: 2,
        visual: { name: '', n: '4', d: '0', focus: 'denominator' },
        wrong: L('Nol maxraj bo‘lish amalini imkonsiz qiladi.', 'Нулевой знаменатель делает деление невозможным.', 'A zero denominator makes division impossible.'),
        solution: [L('Maxraj 0.', 'Знаменатель равен 0.', 'The denominator is 0.'), L('Nolga bo‘lish aniqlanmagan.', 'Деление на ноль не определено.', 'Division by zero is undefined.')],
        audio: L('To‘rtni nolga bo‘lish mumkin yoki mumkin emasligini aniqlang.', 'Определите, имеет ли смысл деление четырёх на ноль.', 'Determine whether four divided by zero is defined.'),
      }),
      P({
        type: 'mc',
        question: L('Ratsional kasr uchun asosiy shart qaysi?', 'Каково главное условие рациональной дроби?', 'What is the essential condition for a rational fraction?'),
        options: [L('A(x) = 0', 'A(x) = 0', 'A(x) = 0'), L('B(x) ≠ 0', 'B(x) ≠ 0', 'B(x) ≠ 0'), L('A(x) = B(x)', 'A(x) = B(x)', 'A(x) = B(x)')],
        correct: 1,
        visual: { name: '', n: 'A(x)', d: 'B(x)', focus: 'rule' },
        wrong: L('Cheklov suratga emas, maxrajga tegishli.', 'Ограничение относится к знаменателю, а не к числителю.', 'The restriction belongs to the denominator, not the numerator.'),
        solution: [L('B(x) — maxraj.', 'B(x) — знаменатель.', 'B(x) is the denominator.'), L('Shart: B(x) ≠ 0.', 'Условие: B(x) ≠ 0.', 'The condition is B(x) ≠ 0.')],
        audio: L('A iks ning B iks ga nisbatida asosiy shartni tanlang.', 'Выберите главное условие для отношения A от икс к B от икс.', 'Choose the essential condition for A of x divided by B of x.'),
      }),
    ],
  },
  {
    eyebrow: L('AMALIYOT · 2', 'ПРАКТИКА · 2', 'PRACTICE · 2'),
    title: L('Taqiqlangan qiymatlarni toping', 'Найдите запрещённые значения', 'Find excluded values'),
    lead: L('Javobni tanlang yoki maydonga kiriting. Har safar maxrajdan boshlang.', 'Выберите или введите ответ. Каждый раз начинайте со знаменателя.', 'Choose or enter an answer. Begin with the denominator every time.'),
    done: L('Chiziqli va ko‘paytuvchili maxrajlarning nollari topildi.', 'Нули линейных и составных знаменателей найдены.', 'You found the zeros of linear and factored denominators.'),
    tasks: [
      P({ type: 'input', answer: 2, question: L('5 / (x − 2) kasrida taqiqlangan x ni kiriting.', 'Введите запрещённое x для дроби 5 / (x − 2).', 'Enter the excluded x for 5 / (x − 2).'), visual: { name: 'F(x)', n: '5', d: 'x − 2', focus: 'denominator' }, wrong: L('x − 2 = 0 tenglamani yeching.', 'Решите уравнение x − 2 = 0.', 'Solve x − 2 = 0.'), solution: [L('x − 2 = 0', 'x − 2 = 0', 'x − 2 = 0'), L('x = 2, demak x ≠ 2.', 'x = 2, значит x ≠ 2.', 'x = 2, so x ≠ 2.')], audio: L('Maxraj iks minus ikki qachon nol bo‘lishini toping.', 'Найдите, когда знаменатель икс минус два равен нулю.', 'Find when the denominator x minus two equals zero.') }),
      P({ type: 'input', answer: -4, question: L('3 / (x + 4) kasrida taqiqlangan x ni kiriting.', 'Введите запрещённое x для дроби 3 / (x + 4).', 'Enter the excluded x for 3 / (x + 4).'), visual: { name: 'G(x)', n: '3', d: 'x + 4', focus: 'denominator' }, wrong: L('x + 4 = 0 dan x manfiy chiqadi.', 'Из x + 4 = 0 получается отрицательное x.', 'Solving x + 4 = 0 gives a negative x.'), solution: [L('x + 4 = 0', 'x + 4 = 0', 'x + 4 = 0'), L('x = −4, demak x ≠ −4.', 'x = −4, значит x ≠ −4.', 'x = −4, so x ≠ −4.')], audio: L('Iks plus to‘rtni nolga tenglashtirib, taqiqlangan qiymatni kiriting.', 'Приравняйте икс плюс четыре к нулю и введите запрещённое значение.', 'Set x plus four equal to zero and enter the excluded value.') }),
      P({ type: 'input', answer: 3, question: L('(2x + 1) / (2x − 6) kasrida taqiqlangan x ni kiriting.', 'Введите запрещённое x для дроби (2x + 1) / (2x − 6).', 'Enter the excluded x for (2x + 1) / (2x − 6).'), visual: { name: 'H(x)', n: '2x + 1', d: '2x − 6', focus: 'denominator' }, wrong: L('2x − 6 = 0 dan avval 2x = 6.', 'Из 2x − 6 = 0 сначала получаем 2x = 6.', 'From 2x − 6 = 0, first obtain 2x = 6.'), solution: [L('2x − 6 = 0', '2x − 6 = 0', '2x − 6 = 0'), L('2x = 6', '2x = 6', '2x = 6'), L('x = 3, demak x ≠ 3.', 'x = 3, значит x ≠ 3.', 'x = 3, so x ≠ 3.')], audio: L('Ikki iks minus olti nolga teng bo‘ladigan iksni toping.', 'Найдите икс, при котором два икс минус шесть равно нулю.', 'Find x for which two x minus six equals zero.') }),
      P({ type: 'input', answer: -3, question: L('(x − 7) / (3x + 9) kasrida taqiqlangan x ni kiriting.', 'Введите запрещённое x для дроби (x − 7) / (3x + 9).', 'Enter the excluded x for (x − 7) / (3x + 9).'), visual: { name: 'M(x)', n: 'x − 7', d: '3x + 9', focus: 'denominator' }, wrong: L('3x + 9 = 0 dan 3x = −9.', 'Из 3x + 9 = 0 получаем 3x = −9.', 'From 3x + 9 = 0, obtain 3x = −9.'), solution: [L('3x + 9 = 0', '3x + 9 = 0', '3x + 9 = 0'), L('3x = −9', '3x = −9', '3x = −9'), L('x = −3, demak x ≠ −3.', 'x = −3, значит x ≠ −3.', 'x = −3, so x ≠ −3.')], audio: L('Uch iks plus to‘qqizni nolga tenglashtirib tenglamani yeching.', 'Приравняйте три икс плюс девять к нулю и решите уравнение.', 'Set three x plus nine equal to zero and solve.') }),
      P({ type: 'mc', question: L('1 / (x² − 9) kasri uchun qaysi qiymatlar taqiqlangan?', 'Какие значения запрещены для дроби 1 / (x² − 9)?', 'Which values are excluded for 1 / (x² − 9)?'), options: [L('Faqat 3', 'Только 3', 'Only 3'), L('−3 va 3', '−3 и 3', '−3 and 3'), L('Faqat −9', 'Только −9', 'Only −9')], correct: 1, visual: { name: 'N(x)', n: '1', d: 'x² − 9', focus: 'denominator' }, wrong: L('x² − 9 = (x − 3)(x + 3). Ikkala ko‘paytuvchini tekshiring.', 'x² − 9 = (x − 3)(x + 3). Проверьте оба множителя.', 'x² − 9 = (x − 3)(x + 3). Check both factors.'), solution: [L('x² − 9 = (x − 3)(x + 3)', 'x² − 9 = (x − 3)(x + 3)', 'x² − 9 = (x − 3)(x + 3)'), L('Maxraj x = −3 va x = 3 da nol.', 'Знаменатель равен нулю при x = −3 и x = 3.', 'The denominator is zero at x = −3 and x = 3.')], audio: L('Iks kvadrat minus to‘qqizning ikkala nol qiymatini toping.', 'Найдите оба нуля выражения икс квадрат минус девять.', 'Find both zeros of x squared minus nine.') }),
      P({ type: 'mc', question: L('1 / ((x − 1)(x + 5)) kasri uchun taqiq qaysi?', 'Какие ограничения у дроби 1 / ((x − 1)(x + 5))?', 'What are the restrictions for 1 / ((x − 1)(x + 5))?'), options: [L('x ≠ 1 va x ≠ −5', 'x ≠ 1 и x ≠ −5', 'x ≠ 1 and x ≠ −5'), L('x ≠ −1 va x ≠ 5', 'x ≠ −1 и x ≠ 5', 'x ≠ −1 and x ≠ 5'), L('Faqat x ≠ 5', 'Только x ≠ 5', 'Only x ≠ 5')], correct: 0, visual: { name: 'T(x)', n: '1', d: '(x − 1)(x + 5)', focus: 'denominator' }, wrong: L('Har bir ko‘paytuvchini alohida nolga tenglashtiring.', 'Приравняйте к нулю каждый множитель отдельно.', 'Set each factor equal to zero separately.'), solution: [L('x − 1 = 0 ⇒ x = 1', 'x − 1 = 0 ⇒ x = 1', 'x − 1 = 0 ⇒ x = 1'), L('x + 5 = 0 ⇒ x = −5', 'x + 5 = 0 ⇒ x = −5', 'x + 5 = 0 ⇒ x = −5'), L('x ≠ 1 va x ≠ −5.', 'x ≠ 1 и x ≠ −5.', 'x ≠ 1 and x ≠ −5.')], audio: L('Maxrajdagi har bir ko‘paytuvchi qachon nol bo‘lishini toping.', 'Найдите, когда каждый множитель знаменателя равен нулю.', 'Find when each denominator factor equals zero.') }),
    ],
  },
  {
    eyebrow: L('AMALIYOT · 3', 'ПРАКТИКА · 3', 'PRACTICE · 3'),
    title: L('Ma’noni tekshiring va xatoni toping', 'Проверьте смысл и найдите ошибку', 'Check meaning and find the error'),
    lead: L('Yakuniy oltita topshiriq: nol natija, xato yechim va bir nechta taqiq.', 'Финальные шесть заданий: нулевой результат, ошибка в решении и несколько ограничений.', 'Six final tasks: zero results, flawed reasoning, and multiple restrictions.'),
    done: L('Mavzu yakunlandi: siz qoidani nafaqat qo‘llaysiz, balki xatoni ham tushuntirasiz.', 'Тема завершена: вы не только применяете правило, но и объясняете ошибки.', 'You can now apply the rule and explain common errors.'),
    tasks: [
      P({ type: 'mc', question: L('Q(x) = (x − 4) / (x + 2). x = 4 mumkinmi?', 'Для Q(x) = (x − 4) / (x + 2) допустимо ли x = 4?', 'For Q(x) = (x − 4) / (x + 2), is x = 4 allowed?'), options: [L('Ha, Q(4) = 0', 'Да, Q(4) = 0', 'Yes, Q(4) = 0'), L('Yo‘q, surat nol', 'Нет, числитель равен нулю', 'No, the numerator is zero'), L('Yo‘q, maxraj nol', 'Нет, знаменатель равен нулю', 'No, the denominator is zero')], correct: 0, visual: { name: 'Q(4)', n: '4 − 4', d: '4 + 2', focus: 'numerator' }, wrong: L('Surat nol, lekin maxraj olti. Bu ruxsat etilgan.', 'Числитель равен нулю, но знаменатель равен шести. Это допустимо.', 'The numerator is zero, but the denominator is six. This is allowed.'), solution: [L('Surat: 4 − 4 = 0.', 'Числитель: 4 − 4 = 0.', 'Numerator: 4 − 4 = 0.'), L('Maxraj: 4 + 2 = 6.', 'Знаменатель: 4 + 2 = 6.', 'Denominator: 4 + 2 = 6.'), L('Q(4) = 0 / 6 = 0, qiymat mumkin.', 'Q(4) = 0 / 6 = 0, значение допустимо.', 'Q(4) = 0 / 6 = 0, so the value is allowed.')], audio: L('To‘rtni surat va maxrajga qo‘yib, nol qayerda paydo bo‘lishini tekshiring.', 'Подставьте четыре в числитель и знаменатель и проверьте, где появился ноль.', 'Substitute four into the numerator and denominator and locate the zero.') }),
      P({ type: 'mc', question: L('O‘quvchi x = 4 ni taqiqladi, chunki surat nol. Birinchi xato qayerda?', 'Ученик запретил x = 4, потому что числитель равен нулю. Где первая ошибка?', 'A student excluded x = 4 because the numerator is zero. Where is the first error?'), options: [L('Suratni hisoblashda', 'В вычислении числителя', 'In evaluating the numerator'), L('Nol suratdan taqiq chiqarishda', 'В выводе запрета из нулевого числителя', 'In excluding a zero numerator'), L('Xato yo‘q', 'Ошибки нет', 'There is no error')], correct: 1, visual: { name: 'Q(4)', n: '0', d: '6', focus: 'audit' }, wrong: L('0 / 6 aniqlangan va nolga teng.', '0 / 6 определено и равно нулю.', '0 / 6 is defined and equals zero.'), solution: [L('Suratning nol bo‘lishi to‘g‘ri hisoblangan.', 'Нулевой числитель вычислен верно.', 'The zero numerator was calculated correctly.'), L('Ammo nol surat taqiq yaratmaydi.', 'Но нулевой числитель не создаёт запрета.', 'But a zero numerator creates no restriction.')], audio: L('Yechimdagi hisob bilan undan chiqarilgan xulosani alohida tekshiring.', 'Проверьте отдельно вычисление и вывод, который из него сделали.', 'Check the calculation and the conclusion drawn from it separately.') }),
      P({ type: 'mc', question: L('x = −2 taqiqlanishi uchun qaysi maxraj mos?', 'Какой знаменатель создаёт ограничение x ≠ −2?', 'Which denominator creates the restriction x ≠ −2?'), options: [L('x − 2', 'x − 2', 'x − 2'), L('x + 2', 'x + 2', 'x + 2'), L('x + 4', 'x + 4', 'x + 4')], correct: 1, visual: { name: 'F(x)', n: '5', d: '?', focus: 'build' }, wrong: L('−2 ni maxrajga qo‘yganda nol chiqishi kerak.', 'При подстановке −2 знаменатель должен стать нулём.', 'Substituting −2 must make the denominator zero.'), solution: [L('−2 + 2 = 0.', '−2 + 2 = 0.', '−2 + 2 = 0.'), L('Shuning uchun x + 2 mos maxraj.', 'Поэтому подходит знаменатель x + 2.', 'Therefore x + 2 is the correct denominator.')], audio: L('Minus ikki qo‘yilganda nolga aylanadigan maxrajni tanlang.', 'Выберите знаменатель, который обращается в ноль при минус двух.', 'Choose the denominator that becomes zero at minus two.') }),
      P({ type: 'input', answer: -4, question: L('C(p) = (12 − p) / (2p + 8). Taqiqlangan p ni kiriting.', 'C(p) = (12 − p) / (2p + 8). Введите запрещённое p.', 'C(p) = (12 − p) / (2p + 8). Enter the excluded p.'), visual: { name: 'C(p)', n: '12 − p', d: '2p + 8', focus: 'denominator' }, wrong: L('2p + 8 = 0 dan 2p = −8.', 'Из 2p + 8 = 0 получаем 2p = −8.', 'From 2p + 8 = 0, obtain 2p = −8.'), solution: [L('2p + 8 = 0', '2p + 8 = 0', '2p + 8 = 0'), L('2p = −8', '2p = −8', '2p = −8'), L('p = −4, demak p ≠ −4.', 'p = −4, значит p ≠ −4.', 'p = −4, so p ≠ −4.')], audio: L('Ikki p plus sakkizni nolga tenglashtirib, p ni toping.', 'Приравняйте два пэ плюс восемь к нулю и найдите пэ.', 'Set two p plus eight equal to zero and solve for p.') }),
      P({ type: 'mc', question: L('C(p) uchun p = 12 mumkinmi?', 'Допустимо ли p = 12 для C(p)?', 'Is p = 12 permissible for C(p)?'), options: [L('Ha, qiymat 0', 'Да, значение равно 0', 'Yes, the value is 0'), L('Yo‘q, surat 0', 'Нет, числитель равен 0', 'No, the numerator is 0'), L('Yo‘q, maxraj 32', 'Нет, знаменатель равен 32', 'No, the denominator is 32')], correct: 0, visual: { name: 'C(12)', n: '12 − 12', d: '24 + 8', focus: 'numerator' }, wrong: L('Maxraj 32 va nol emas. Nol surat mumkin.', 'Знаменатель равен 32 и не равен нулю. Нулевой числитель допустим.', 'The denominator is 32 and nonzero. A zero numerator is allowed.'), solution: [L('Surat: 12 − 12 = 0.', 'Числитель: 12 − 12 = 0.', 'Numerator: 12 − 12 = 0.'), L('Maxraj: 24 + 8 = 32.', 'Знаменатель: 24 + 8 = 32.', 'Denominator: 24 + 8 = 32.'), L('C(12) = 0 / 32 = 0.', 'C(12) = 0 / 32 = 0.', 'C(12) = 0 / 32 = 0.')], audio: L('P o‘rniga o‘n ikkini qo‘yib, surat va maxrajni alohida hisoblang.', 'Подставьте двенадцать вместо пэ и отдельно вычислите числитель и знаменатель.', 'Substitute twelve for p and evaluate the numerator and denominator separately.') }),
      P({ type: 'mc', question: L('(x² − 1) / (x² − 5x + 6) kasrining taqiqlari qaysi?', 'Каковы ограничения дроби (x² − 1) / (x² − 5x + 6)?', 'What are the restrictions for (x² − 1) / (x² − 5x + 6)?'), options: [L('x ≠ −1 va x ≠ 1', 'x ≠ −1 и x ≠ 1', 'x ≠ −1 and x ≠ 1'), L('x ≠ 2 va x ≠ 3', 'x ≠ 2 и x ≠ 3', 'x ≠ 2 and x ≠ 3'), L('Faqat x ≠ 6', 'Только x ≠ 6', 'Only x ≠ 6')], correct: 1, visual: { name: 'Y(x)', n: 'x² − 1', d: 'x² − 5x + 6', focus: 'denominator' }, wrong: L('Maxrajni (x − 2)(x − 3) ko‘rinishida ajrating.', 'Разложите знаменатель: (x − 2)(x − 3).', 'Factor the denominator as (x − 2)(x − 3).'), solution: [L('x² − 5x + 6 = (x − 2)(x − 3)', 'x² − 5x + 6 = (x − 2)(x − 3)', 'x² − 5x + 6 = (x − 2)(x − 3)'), L('Maxraj x = 2 va x = 3 da nol.', 'Знаменатель равен нулю при x = 2 и x = 3.', 'The denominator is zero at x = 2 and x = 3.'), L('Javob: x ≠ 2, x ≠ 3.', 'Ответ: x ≠ 2, x ≠ 3.', 'Answer: x ≠ 2 and x ≠ 3.')], audio: L('Maxrajni ko‘paytuvchilarga ajrating va uning ikkala nol qiymatini toping.', 'Разложите знаменатель на множители и найдите оба его нуля.', 'Factor the denominator and find both of its zeros.') }),
    ],
  },
]

const Op = React.memo(function Op({ children, size = 'mid', tone = 'ink' }) {
  return <span className={`mop mop-${size} tone-${tone}`}>{children}</span>
})

const Frac = React.memo(function Frac({ n, d, size = 'mid', color }) {
  return (
    <span className={`frac frac-${size}`} style={{ color }}>
      <span className="n">{n}</span>
      <span className="bar" />
      <span className="d">{d}</span>
    </span>
  )
})

function InlineMath({ children }) {
  return <span className="inline-math">{children}</span>
}

function ExpressionVisual({ expression }) {
  const parts = expression.split(' / ')
  if (parts.length !== 2) return <InlineMath>{expression}</InlineMath>
  const unwrap = (value) => {
    const trimmed = value.trim()
    return trimmed.startsWith('(') && trimmed.endsWith(')')
      ? trimmed.slice(1, -1)
      : trimmed
  }
  return (
    <InlineMath>
      <Frac n={unwrap(parts[0])} d={unwrap(parts[1])} size="sm" />
    </InlineMath>
  )
}

function renderRationalText(text) {
  if (typeof text !== 'string' || !text.includes('A(x) / B(x)')) return text
  const [before, after] = text.split('A(x) / B(x)')
  return (
    <>
      {before}
      <Frac n="A(x)" d="B(x)" size="sm" />
      {after}
    </>
  )
}

function FormulaK({ compact = false }) {
  return (
    <span className={compact ? 'formula compact' : 'formula'}>
      K(x) = <Frac n="2x + 1" d="x − 3" size={compact ? 'sm' : 'mid'} />
    </span>
  )
}

function FormulaPair() {
  return (
    <div className="formula-pair">
      <span className="formula compact">
        P(x) = <Frac n="x − 3" d="x + 1" size="sm" />
      </span>
      <span className="formula compact">
        Q(x) = <Frac n="x + 1" d="x − 3" size="sm" />
      </span>
    </div>
  )
}

function FormulaR() {
  return (
    <span className="formula">
      R(x) = <Frac n="3x − 2" d="x + 4" size="mid" />
    </span>
  )
}

function FormulaF() {
  return (
    <span className="formula">
      F(x) = <Frac n="5" d="2x − 6" size="mid" />
    </span>
  )
}

function FormulaAB() {
  return (
    <div className="formula-pair">
      <span className="formula compact">A(x) = x² − 5x + 4</span>
      <span className="formula compact">
        B(x) = <Frac n="x + 7" d="x − 5" size="sm" />
      </span>
    </div>
  )
}

function FormulaH() {
  return (
    <span className="formula">
      H(x) = <Frac n="x − 4" d="x + 2" size="mid" />
    </span>
  )
}

function FormulaC() {
  return (
    <span className="formula">
      C(p) = <Frac n="12 − p" d="2p + 8" size="mid" />
    </span>
  )
}

const FRACTION_PATTERN = /(-?\d+)\/(-?\d+)/g

function renderMathText(text) {
  if (typeof text !== 'string' || !text.includes('/')) return text
  const parts = []
  let lastIndex = 0
  let match
  let key = 0
  while ((match = FRACTION_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index))
    parts.push(<Frac key={`frac_${key}`} n={match[1]} d={match[2]} size="sm" />)
    key += 1
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex))
  return parts
}

function AudioIndicator({ audio }) {
  const t = useT()
  const labels = {
    sound: L('Ovoz', 'Озвучка', 'Audio'),
    mute: L("Ovozni o'chirish", 'Выключить звук', 'Mute audio'),
    unmute: L('Ovozni yoqish', 'Включить звук', 'Enable audio'),
    replay: L('Qayta tinglash', 'Повторить', 'Replay'),
  }

  return (
    <div className="audio-tools" aria-label={t(labels.sound)}>
      <button
        type="button"
        className={`icon-button ${audio.isPlaying ? 'is-playing' : ''}`}
        onClick={audio.toggleMute}
        aria-label={t(audio.muted ? labels.unmute : labels.mute)}
        title={t(audio.muted ? labels.unmute : labels.mute)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 9v6h4l5 4V5L9 9H5Z" />
          {audio.muted ? (
            <path d="m18 9 4 4m0-4-4 4" />
          ) : (
            <path d="M17 8.5c1.5 1.5 1.5 5.5 0 7" />
          )}
        </svg>
      </button>
      {!audio.muted ? (
        <button
          type="button"
          className="icon-button"
          onClick={audio.replay}
          aria-label={t(labels.replay)}
          title={t(labels.replay)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6" />
          </svg>
        </button>
      ) : null}
    </div>
  )
}

function NavBack({ onClick, disabled }) {
  const t = useT()
  if (disabled) return null
  return (
    <button type="button" className="btn-ghost nav-button" onClick={onClick} disabled={disabled}>
      <span aria-hidden="true">←</span>
      {t(CONTENT.ui.back)}
    </button>
  )
}

function NavNext({ onClick, disabled, finish = false }) {
  const t = useT()
  return (
    <button type="button" className="btn-white-accent nav-button" onClick={onClick} disabled={disabled}>
      {t(finish ? CONTENT.ui.finish : CONTENT.ui.next)}
      <span aria-hidden="true">{finish ? '✓' : '→'}</span>
    </button>
  )
}

function Stage({
  screen,
  totalScreens,
  eyebrow,
  title,
  audio,
  onPrev,
  onNext,
  finish = false,
  children,
}) {
  const progress = ((screen + 1) / totalScreens) * 100

  return (
    <main className="stage">
      <header className="stage-header">
        <div className="progress-track" aria-hidden="true">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <div className="chrome">
          <div className="chrome-left eyebrow">
            <span className="dot" aria-hidden="true" />
            <span>{eyebrow}</span>
          </div>
          <div className="chrome-right">
            <span className="screen-counter">
              {String(screen + 1).padStart(2, '0')} / {String(totalScreens).padStart(2, '0')}
            </span>
            <AudioIndicator audio={audio} />
          </div>
        </div>
      </header>

      <section className="stage-content">
        <div className="stage-body">
          <div className="screen-heading fade-up">
            {title ? <h1 className="title h-title">{title}</h1> : null}
          </div>
          {children}
        </div>
      </section>

      <nav className="stage-nav">
        <NavBack onClick={onPrev} disabled={screen === 0} />
        <span className="nav-spacer" />
        <NavNext onClick={onNext} disabled={false} finish={finish} />
      </nav>
    </main>
  )
}

function FeedbackBlock({ show, correct, children }) {
  return (
    <div className={`feedback-block ${show ? 'visible' : ''}`}>
      <div className={correct ? 'frame-success' : 'frame-tip'}>{children}</div>
    </div>
  )
}

function FeedbackLabel({ correct }) {
  const t = useT()
  return (
    <p className={`feedback-label ${correct ? 'is-correct' : 'is-hint'}`}>
      <span aria-hidden="true">{correct ? '✓' : '↗'}</span>
      {t(correct ? CONTENT.ui.correct : CONTENT.ui.hint)}
    </p>
  )
}

function QuestionScreen({
  screen,
  totalScreens,
  screenMeta,
  content,
  figure,
  prelude,
  storedAnswer,
  onAnswer,
  onPrev,
  onNext,
}) {
  const lang = useLang()
  const t = useT()
  const sfx = useSfx()
  const [picked, setPicked] = useState(storedAnswer?.studentAnswerIndex ?? null)
  const [solved, setSolved] = useState(storedAnswer?.correct === true)
  const [wrongOptions, setWrongOptions] = useState(
    () => new Set(storedAnswer?.wrongAnswerIndices || []),
  )
  const firstTryRef = useRef(storedAnswer?.firstTry ?? true)
  const options = content.options
  const audio = useAudio(
    useMemo(
      () => makePromptSegments(content.audio, lang, { type: 'option_picked' }),
      [content.audio, lang],
    ),
  )

  const pick = (index) => {
    if (solved || wrongOptions.has(index)) return
    const correct = index === content.correctIndex
    setPicked(index)
    if (correct) {
      setSolved(true)
      sfx.playCorrect()
    } else {
      firstTryRef.current = false
      setWrongOptions((previous) => new Set(previous).add(index))
      sfx.playWrong()
    }

    getAudioEngine()?.pushOneOff(
      t(correct ? content.audio.on_correct : content.audio.on_wrong),
    )

    onAnswer({
      stage: screenMeta.scope,
      screenIdx: screen,
      question: t(content.question),
      options: options.map((option) => t(option)),
      correctIndex: content.correctIndex,
      correctAnswer: t(options[content.correctIndex]),
      studentAnswerIndex: index,
      studentAnswer: t(options[index]),
      correct,
      firstTry: correct && firstTryRef.current,
      wrongAnswerIndices: correct
        ? Array.from(wrongOptions)
        : Array.from(new Set(wrongOptions).add(index)),
    })
  }

  const feedback = solved
    ? content.correct_text
    : content[`wrong_${picked}`] || content.wrong_default

  return (
    <Stage
      screen={screen}
      totalScreens={totalScreens}
      eyebrow={t(content.eyebrow)}
      title={t(content.title)}
      audio={audio}
      onPrev={onPrev}
      onNext={onNext}
    >
      <div className="screen-stack">
        {prelude}
        {figure ? <div className="formula-card fade-up delay-1">{figure}</div> : null}
        <p className="body question-text fade-up delay-1">{t(content.question)}</p>
        <div className={`option-grid fade-up delay-2 ${solved ? 'is-solved' : ''}`}>
          {options.map((option, index) => {
            const isCorrect = index === content.correctIndex
            const isWrong = wrongOptions.has(index)
            let className = 'option'
            if (solved) {
              className += isCorrect
                ? ' option-correct'
                : ' option-wrong option-collapse'
            } else if (isWrong) {
              className += ' option-picked-wrong'
            }

            return (
              <button
                type="button"
                className={className}
                key={`${screenMeta.id}_${index}`}
                onClick={() => pick(index)}
                disabled={solved || isWrong}
              >
                <span className="option-index mono">
                  {solved && isCorrect ? '✓' : isWrong ? '×' : String.fromCharCode(65 + index)}
                </span>
                <span>{renderMathText(t(option))}</span>
              </button>
            )
          })}
        </div>
        <FeedbackBlock show={picked !== null} correct={solved}>
          <FeedbackLabel correct={solved} />
          <p className="body">{renderMathText(t(feedback))}</p>
        </FeedbackBlock>
      </div>
    </Stage>
  )
}

function NumInputScreen({
  screen,
  totalScreens,
  screenMeta,
  content,
  figure,
  support,
  storedAnswer,
  onAnswer,
  onPrev,
  onNext,
}) {
  const lang = useLang()
  const t = useT()
  const sfx = useSfx()
  const [value, setValue] = useState(storedAnswer?.studentAnswer ?? '')
  const [checked, setChecked] = useState(Boolean(storedAnswer))
  const [solved, setSolved] = useState(storedAnswer?.correct === true)
  const [feedback, setFeedback] = useState(
    storedAnswer?.correct
      ? content.correct_text
      : storedAnswer
        ? content.wrongByValue?.[String(storedAnswer.studentAnswer)] || content.wrong_default
        : null,
  )
  const firstTryRef = useRef(storedAnswer?.firstTry ?? true)
  const audio = useAudio(
    useMemo(
      () => makePromptSegments(content.audio, lang, { type: 'check_pressed' }),
      [content.audio, lang],
    ),
  )

  const normalized = String(value).trim().replace('−', '-').replace(',', '.')

  const submit = () => {
    if (!normalized || solved) return
    const number = Number(normalized)
    const correct = Number.isFinite(number) && number === content.answer
    setChecked(true)
    setSolved(correct)
    const nextFeedback = correct
      ? content.correct_text
      : content.wrongByValue?.[normalized] || content.wrong_default
    setFeedback(nextFeedback)
    if (correct) sfx.playCorrect()
    else {
      firstTryRef.current = false
      sfx.playWrong()
    }
    getAudioEngine()?.pushOneOff(
      t(correct ? content.audio.on_correct : content.audio.on_wrong),
    )
    onAnswer({
      stage: screenMeta.scope,
      screenIdx: screen,
      question: t(content.question),
      options: null,
      correctIndex: null,
      correctAnswer: content.answer,
      studentAnswerIndex: null,
      studentAnswer: number,
      correct,
      firstTry: correct && firstTryRef.current,
    })
  }

  return (
    <Stage
      screen={screen}
      totalScreens={totalScreens}
      eyebrow={t(content.eyebrow)}
      title={t(content.title)}
      audio={audio}
      onPrev={onPrev}
      onNext={onNext}
    >
      <div className="screen-stack">
        <div className="formula-card fade-up delay-1">{figure}</div>
        <p className="body question-text fade-up delay-1">{t(content.question)}</p>
        {support ? <div className="condition-chip mono fade-up delay-2">{support}</div> : null}
        <div className="input-row fade-up delay-2">
          <input
            className={`answer-input ${checked ? (solved ? 'correct' : 'wrong') : ''}`}
            inputMode="decimal"
            value={value}
            placeholder="0"
            aria-label={t(content.question)}
            onChange={(event) => {
              setValue(event.target.value)
              if (!solved) setChecked(false)
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') submit()
            }}
            disabled={solved}
          />
          <button
            type="button"
            className="btn-white-accent check-button"
            onClick={submit}
            disabled={!normalized || solved}
          >
            {t(CONTENT.ui.check)}
          </button>
        </div>
        <FeedbackBlock show={checked} correct={solved}>
          <FeedbackLabel correct={solved} />
          <p className="body">{t(feedback)}</p>
        </FeedbackBlock>
      </div>
    </Stage>
  )
}

function Screen0({ screen, totalScreens, storedAnswer, onAnswer, onPrev, onNext }) {
  const c = CONTENT.s0
  const lang = useLang()
  const t = useT()
  const [picked, setPicked] = useState(() => (
    Number.isInteger(storedAnswer?.studentAnswerIndex)
      ? storedAnswer.studentAnswerIndex
      : null
  ))
  const audio = useAudio(
    useMemo(
      () => makePromptSegments(c.audio, lang, { type: 'option_picked' }),
      [c.audio, lang],
    ),
  )
  const predictionReady = picked !== null || audio.muted || audio.completed || Boolean(audio.waitingFor)

  const choose = (index) => {
    if (picked !== null || !predictionReady) return
    setPicked(index)
    audio.triggerEvent('option_picked')
    getAudioEngine()?.pushOneOff(t(c.audio.on_correct))
    onAnswer({
      stage: 'hook',
      screenIdx: screen,
      question: t(c.question),
      options: c.options.map((option) => t(option)),
      correctIndex: null,
      correctAnswer: null,
      studentAnswerIndex: index,
      studentAnswer: t(c.options[index]),
      correct: null,
    })
  }

  return (
    <Stage
      screen={screen}
      totalScreens={totalScreens}
      eyebrow={t(c.eyebrow)}
      title={t(c.title)}
      audio={audio}
      onPrev={onPrev}
      onNext={onNext}
    >
      <div className="screen-stack hook-layout">
        <div className="formula-card formula-hero fade-up delay-1">
          <FormulaK />
          <div className="input-values">
            <span>{t(L('Tekshiramiz', 'Проверяем', 'Test values'))}</span>
            <strong className="mono">x = 0, 2, 3, 4</strong>
          </div>
        </div>
        <p className="body question-text fade-up delay-2">{t(c.question)}</p>
        {predictionReady ? (
          <div className="option-grid fade-up">
            {c.options.map((option, index) => (
              <button
                type="button"
                className={`option ${picked === index ? 'option-selected' : ''}`}
                disabled={picked !== null}
                key={index}
                onClick={() => choose(index)}
              >
                <span className="option-index mono">{String.fromCharCode(65 + index)}</span>
                <span>{t(option)}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="answer-wait fade-up delay-3">
            <span className="answer-wait-pulse" />
            {t(L(
              'Avval vaziyatni tinglang…',
              'Сначала вслушайтесь в условие…',
              'Listen to the situation first…',
            ))}
          </div>
        )}
        <p className="small muted fade-up delay-4">{t(c.note)}</p>
      </div>
    </Stage>
  )
}

function Screen1({ screen, totalScreens, onPrev, onNext }) {
  const c = CONTENT.s1
  const lang = useLang()
  const t = useT()
  const sfx = useSfx()
  const [step, setStep] = useState(0)
  const [value, setValue] = useState('')
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const audio = useAudio(
    useMemo(() => [{ id: 'intro', text: c.audio[lang][0], trigger: 'on_mount' }], [c.audio, lang]),
  )
  const completed = step >= c.steps.length
  const current = c.steps[Math.min(step, c.steps.length - 1)]

  const check = () => {
    if (completed) return
    const response = current.options ? selected : Number(String(value).replace(',', '.'))
    const correct = response === current.answer
    setFeedback(correct ? current.success : c.wrong)
    if (!correct) {
      sfx.playWrong()
      return
    }
    sfx.playCorrect()
    getAudioEngine()?.pushOneOff(t(current.success))
    window.setTimeout(() => {
      setStep((previous) => previous + 1)
      setValue('')
      setSelected(null)
      setFeedback(null)
    }, 450)
  }

  return (
    <Stage
      screen={screen}
      totalScreens={totalScreens}
      eyebrow={t(c.eyebrow)}
      title={t(c.title)}
      audio={audio}
      onPrev={onPrev}
      onNext={onNext}
    >
      <div className="screen-stack">
        <p className="body muted fade-up">{t(c.lead)}</p>
        <div className="step-rail fade-up delay-1">
          {c.steps.map((_, index) => (
            <span
              className={`step-node ${index < step ? 'done' : index === step ? 'active' : ''}`}
              key={index}
            >
              {index < step ? '✓' : index + 1}
            </span>
          ))}
        </div>

        {!completed ? (
          <div className="frame fade-up delay-2" key={step}>
            <p className="eyebrow">
              {t(CONTENT.ui.step)} {step + 1}
            </p>
            {step === 1 ? (
              <div className="mini-formula">
                <Frac n="5" d="x − 3" size="mid" />
              </div>
            ) : null}
            <p className="body question-text">{t(current.prompt)}</p>
            {current.options ? (
              <div className="choice-chips">
                {current.options.map((option, index) => (
                  <button
                    type="button"
                    className={`chip ${selected === index ? 'selected' : ''}`}
                    key={option}
                    onClick={() => setSelected(index)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : (
              <input
                className="answer-input compact-input"
                inputMode="decimal"
                value={value}
                placeholder="0"
                onChange={(event) => setValue(event.target.value)}
              />
            )}
            <div className="action-row">
              <button
                type="button"
                className="btn-white-accent check-button"
                onClick={check}
                disabled={current.options ? selected === null : value.trim() === ''}
              >
                {t(CONTENT.ui.check)}
              </button>
            </div>
            <FeedbackBlock show={feedback !== null} correct={feedback === current.success}>
              <FeedbackLabel correct={feedback === current.success} />
              <p className="body">{t(feedback)}</p>
            </FeedbackBlock>
          </div>
        ) : (
          <div className="frame-success fade-up">
            <FeedbackLabel correct />
            <p className="body">
              {t(
                L(
                  "Uchala vosita tayyor. Endi formulani tadqiq qilishingiz mumkin.",
                  'Все три инструмента готовы. Теперь можно исследовать формулу.',
                  'All three tools are ready. You can now investigate the formula.',
                ),
              )}
            </p>
          </div>
        )}
      </div>
    </Stage>
  )
}

function Screen2({ screen, totalScreens, onPrev, onNext }) {
  const c = CONTENT.s2
  const lang = useLang()
  const t = useT()
  const sfx = useSfx()
  const [groups, setGroups] = useState(Array(c.items.length).fill(null))
  const [checked, setChecked] = useState(false)
  const [solved, setSolved] = useState(false)
  const audio = useAudio(useMemo(() => makeAudioSegments(c, lang), [c, lang]))

  const assign = (itemIndex, groupIndex) => {
    setGroups((previous) =>
      previous.map((group, index) => (index === itemIndex ? groupIndex : group)),
    )
    setChecked(false)
  }

  const check = () => {
    const correct = groups.every((group, index) => group === c.items[index].group)
    setChecked(true)
    setSolved(correct)
    if (correct) sfx.playCorrect()
    else sfx.playWrong()
  }

  return (
    <Stage
      screen={screen}
      totalScreens={totalScreens}
      eyebrow={t(c.eyebrow)}
      title={t(c.title)}
      audio={audio}
      onPrev={onPrev}
      onNext={onNext}
    >
      <div className="screen-stack">
        <div className="sort-list fade-up delay-1">
          {c.items.map((item, itemIndex) => (
            <div className="sort-card" key={item.expression}>
              <ExpressionVisual expression={item.expression} />
              <div className="sort-actions">
                {c.groups.map((group, groupIndex) => (
                  <button
                    type="button"
                    className={`sort-button ${groups[itemIndex] === groupIndex ? 'selected' : ''}`}
                    key={groupIndex}
                    onClick={() => assign(itemIndex, groupIndex)}
                  >
                    <span>{t(group)}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="action-row fade-up delay-2">
          <button
            type="button"
            className="btn-white-accent check-button"
            onClick={check}
            disabled={groups.some((group) => group === null) || solved}
          >
            {t(CONTENT.ui.check)}
          </button>
        </div>
        <FeedbackBlock show={checked} correct={solved}>
          <FeedbackLabel correct={solved} />
          <p className="body">{t(solved ? c.correct_text : c.wrong_text)}</p>
        </FeedbackBlock>
      </div>
    </Stage>
  )
}

function Screen3({ screen, totalScreens, onPrev, onNext }) {
  const c = CONTENT.s3
  const lang = useLang()
  const t = useT()
  const [value, setValue] = useState(null)
  const [reason, setReason] = useState(null)
  const [saved, setSaved] = useState(false)
  const audio = useAudio(useMemo(() => makeAudioSegments(c, lang), [c, lang]))

  return (
    <Stage
      screen={screen}
      totalScreens={totalScreens}
      eyebrow={t(c.eyebrow)}
      title={t(c.title)}
      audio={audio}
      onPrev={onPrev}
      onNext={onNext}
    >
      <div className="screen-stack">
        <div className="formula-card fade-up delay-1"><FormulaK /></div>
        <div className="hypothesis-grid fade-up delay-2">
          <div className="frame">
            <p className="body question-text">{t(c.valueQuestion)}</p>
            <div className="choice-chips">
              {c.values.map((item) => (
                <button
                  type="button"
                  className={`chip value-chip ${value === item ? 'selected' : ''}`}
                  key={item}
                  onClick={() => {
                    setValue(item)
                    setSaved(false)
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="frame">
            <p className="body question-text">{t(c.reasonQuestion)}</p>
            <div className="reason-list">
              {c.reasons.map((item, index) => (
                <button
                  type="button"
                  className={`reason-button ${reason === index ? 'selected' : ''}`}
                  key={index}
                  onClick={() => {
                    setReason(index)
                    setSaved(false)
                  }}
                >
                  <span className="mono">{String.fromCharCode(65 + index)}</span>
                  {t(item)}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="action-row">
          <button
            type="button"
            className="btn-white-accent check-button"
            disabled={value === null || reason === null || saved}
            onClick={() => setSaved(true)}
          >
            {t(CONTENT.ui.save)}
          </button>
        </div>
        <FeedbackBlock show={saved} correct>
          <p className="body">{t(c.note)}</p>
        </FeedbackBlock>
      </div>
    </Stage>
  )
}

function Screen4({ screen, totalScreens, onPrev, onNext }) {
  const c = CONTENT.s4
  const lang = useLang()
  const t = useT()
  const [revealed, setRevealed] = useState(() => new Set())
  const audio = useAudio(
    useMemo(() => [{ id: 'intro', text: c.audio[lang][0], trigger: 'on_mount' }], [c.audio, lang]),
  )
  const completed = revealed.size === c.rows.length

  const reveal = (index) => {
    setRevealed((previous) => new Set(previous).add(index))
    if (index === 2) getAudioEngine()?.pushOneOff(c.audio[lang][1])
  }

  return (
    <Stage
      screen={screen}
      totalScreens={totalScreens}
      eyebrow={t(c.eyebrow)}
      title={t(c.title)}
      audio={audio}
      onPrev={onPrev}
      onNext={onNext}
    >
      <div className="screen-stack">
        <div className="formula-card fade-up delay-1"><FormulaK /></div>
        <div className="data-table-wrap fade-up delay-2">
          <table className="data-table">
            <thead>
              <tr>
                {c.columns.map((column, index) => <th key={index}>{t(column)}</th>)}
                <th aria-label={t(CONTENT.ui.calculate)} />
              </tr>
            </thead>
            <tbody>
              {c.rows.map((row, index) => {
                const open = revealed.has(index)
                return (
                  <tr
                    className={[
                      open ? 'revealed-row' : '',
                      open && row.denominator === 0 ? 'critical-row' : '',
                    ].filter(Boolean).join(' ')}
                    key={row.x}
                  >
                    <td className="mono">{row.x}</td>
                    <td className="mono">{open ? row.numerator : '·'}</td>
                    <td className="mono">{open ? row.denominator : '·'}</td>
                    <td className="mono">
                      {open
                        ? row.value === 'undefined'
                          ? t(CONTENT.ui.undefined)
                          : renderMathText(row.value)
                        : '·'}
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`table-action ${open ? 'done' : ''}`}
                        onClick={() => reveal(index)}
                        disabled={open}
                      >
                        {open ? '✓' : t(CONTENT.ui.calculate)}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <FeedbackBlock show={completed} correct>
          <FeedbackLabel correct />
          <p className="body">{t(c.conclusion)}</p>
        </FeedbackBlock>
      </div>
    </Stage>
  )
}

function Screen5(props) {
  return (
    <QuestionScreen
      {...props}
      screenMeta={SCREEN_META[5]}
      content={CONTENT.s5}
      figure={<FormulaPair />}
    />
  )
}

function Screen6({ screen, totalScreens, onPrev, onNext }) {
  const c = CONTENT.s6
  const lang = useLang()
  const t = useT()
  const sfx = useSfx()
  const order = [2, 0, 1]
  const [sequence, setSequence] = useState([])
  const [wrong, setWrong] = useState(false)
  const audio = useAudio(useMemo(() => makeAudioSegments(c, lang), [c, lang]))
  const completed = sequence.length === c.steps.length

  const choose = (stepIndex) => {
    if (sequence.includes(stepIndex) || completed) return
    const expected = sequence.length
    if (stepIndex !== expected) {
      setWrong(true)
      sfx.playWrong()
      return
    }
    setWrong(false)
    setSequence((previous) => [...previous, stepIndex])
    sfx.playCorrect()
  }

  return (
    <Stage
      screen={screen}
      totalScreens={totalScreens}
      eyebrow={t(c.eyebrow)}
      title={t(c.title)}
      audio={audio}
      onPrev={onPrev}
      onNext={onNext}
    >
      <div className="screen-stack">
        <div className="formula-card fade-up delay-1"><FormulaK /></div>
        <div className="sequence-layout fade-up delay-2">
          <div className="sequence-bank">
            {order.map((stepIndex) => (
              <button
                type="button"
                className={`sequence-card ${sequence.includes(stepIndex) ? 'used' : ''}`}
                key={stepIndex}
                onClick={() => choose(stepIndex)}
                disabled={sequence.includes(stepIndex)}
              >
                <span className="mono sequence-code">{String.fromCharCode(65 + stepIndex)}</span>
                {t(c.steps[stepIndex])}
              </button>
            ))}
          </div>
          <div className="sequence-result">
            {c.steps.map((stepText, index) => (
              <div className={`sequence-slot ${sequence.includes(index) ? 'filled' : ''}`} key={index}>
                <span className="mono">{index + 1}</span>
                <span>{sequence.includes(index) ? t(stepText) : '…'}</span>
              </div>
            ))}
          </div>
        </div>
        <FeedbackBlock show={wrong || completed} correct={completed}>
          <FeedbackLabel correct={completed} />
          <p className="body">{t(completed ? c.conclusion : c.wrong)}</p>
        </FeedbackBlock>
      </div>
    </Stage>
  )
}

function Screen7({ screen, totalScreens, onPrev, onNext }) {
  const c = CONTENT.s7
  const lang = useLang()
  const t = useT()
  const [opened, setOpened] = useState(() => new Set())
  const audio = useAudio(useMemo(() => makeAudioSegments(c, lang), [c, lang]))
  const completed = opened.size === c.terms.length

  return (
    <Stage
      screen={screen}
      totalScreens={totalScreens}
      eyebrow={t(c.eyebrow)}
      title={t(c.title)}
      audio={audio}
      onPrev={onPrev}
      onNext={onNext}
    >
      <div className="screen-stack">
        <p className="small muted">{t(c.note)}</p>
        <div className="term-grid fade-up delay-1">
          {c.terms.map((term, index) => {
            const isOpen = opened.has(index)
            return (
              <button
                type="button"
                className={`term-card ${isOpen ? 'open' : ''}`}
                key={index}
                onClick={() => setOpened((previous) => new Set(previous).add(index))}
              >
                <span className="term-index mono">0{index + 1}</span>
                <strong>{t(term.name)}</strong>
                <span className="term-definition">
                  {isOpen
                    ? renderRationalText(t(term.definition))
                    : t(L('Ochish', 'Открыть', 'Open'))}
                </span>
              </button>
            )
          })}
        </div>
        <div className={`central-rule fade-up delay-2 ${completed ? 'visible' : ''}`}>
          <Frac n="A(x)" d="B(x)" size="mid" />
          <span className="rule-divider" />
          <Op size="mid">B(x) ≠ 0</Op>
        </div>
      </div>
    </Stage>
  )
}

function Screen8({ screen, totalScreens, onPrev, onNext }) {
  const c = CONTENT.s8
  const lang = useLang()
  const t = useT()
  const [visibleSteps, setVisibleSteps] = useState(1)
  const audio = useAudio(useMemo(() => makeAudioSegments(c, lang), [c, lang]))
  const completed = visibleSteps === c.steps.length

  return (
    <Stage
      screen={screen}
      totalScreens={totalScreens}
      eyebrow={t(c.eyebrow)}
      title={t(c.title)}
      audio={audio}
      onPrev={onPrev}
      onNext={onNext}
    >
      <div className="screen-stack">
        <div className="formula-card fade-up delay-1"><FormulaR /></div>
        <div className="worked-steps fade-up delay-2">
          {c.steps.slice(0, visibleSteps).map((item, index) => (
            <div className="worked-step" key={index}>
              <span className="worked-index mono">0{index + 1}</span>
              <div>
                <p className="formula compact">{t(item.result)}</p>
                <p className="small muted">{t(item.reason)}</p>
              </div>
            </div>
          ))}
        </div>
        {!completed ? (
          <div className="action-row">
            <button
              type="button"
              className="btn-white-accent check-button"
              onClick={() => setVisibleSteps((previous) => previous + 1)}
            >
              {t(CONTENT.ui.next)}
            </button>
          </div>
        ) : null}
      </div>
    </Stage>
  )
}

function Screen9(props) {
  return (
    <NumInputScreen
      {...props}
      screenMeta={SCREEN_META[9]}
      content={CONTENT.s9}
      figure={<FormulaF />}
      support="2x − 6 ≠ 0"
    />
  )
}

function Screen10(props) {
  return (
    <QuestionScreen
      {...props}
      screenMeta={SCREEN_META[10]}
      content={CONTENT.s10}
      figure={<FormulaAB />}
    />
  )
}

function Screen11(props) {
  const t = useT()
  return (
    <QuestionScreen
      {...props}
      screenMeta={SCREEN_META[11]}
      content={CONTENT.s11}
      figure={<FormulaH />}
      prelude={
        <div className="audit-list fade-up delay-1">
          {CONTENT.s11.solutionSteps.map((step, index) => (
            <div className="audit-step" key={index}>
              <span className="mono">{String(index + 1).padStart(2, '0')}</span>
              <p>{t(step)}</p>
            </div>
          ))}
        </div>
      }
    />
  )
}

function Screen12({ screen, totalScreens, onPrev, onNext }) {
  const c = CONTENT.s12
  const lang = useLang()
  const t = useT()
  const sfx = useSfx()
  const [numerator, setNumerator] = useState(null)
  const [denominator, setDenominator] = useState(null)
  const [built, setBuilt] = useState(false)
  const [part, setPart] = useState(null)
  const [checked, setChecked] = useState(false)
  const audio = useAudio(
    useMemo(() => [{ id: 'intro', text: c.audio[lang][0], trigger: 'on_mount' }], [c.audio, lang]),
  )

  const build = () => {
    const correct = c.validDenominators.includes(denominator)
    setChecked(true)
    setBuilt(correct)
    if (correct) sfx.playCorrect()
    else sfx.playWrong()
  }

  const choosePart = (index) => {
    setPart(index)
    if (index === 1) sfx.playCorrect()
    else sfx.playWrong()
  }

  return (
    <Stage
      screen={screen}
      totalScreens={totalScreens}
      eyebrow={t(c.eyebrow)}
      title={t(c.title)}
      audio={audio}
      onPrev={onPrev}
      onNext={onNext}
    >
      <div className="screen-stack">
        <p className="body question-text fade-up">{t(c.prompt)}</p>
        <div className="target-chip mono fade-up delay-1">x ≠ −2</div>
        <div className="constructor fade-up delay-2">
          <div className="constructor-column">
            <p className="eyebrow">{t(L('SURAT', 'ЧИСЛИТЕЛЬ', 'NUMERATOR'))}</p>
            {c.numerators.map((item, index) => (
              <button
                type="button"
                className={`constructor-option ${numerator === index ? 'selected' : ''}`}
                key={item}
                onClick={() => {
                  setNumerator(index)
                  setChecked(false)
                  setBuilt(false)
                  setPart(null)
                }}
              >
                {item}
              </button>
            ))}
          </div>
          <div className={`constructor-preview ${built ? 'is-built' : ''}`}>
            <Frac
              key={`${numerator ?? 'n'}-${denominator ?? 'd'}`}
              n={numerator === null ? 'A(x)' : c.numerators[numerator]}
              d={denominator === null ? 'B(x)' : c.denominators[denominator]}
              size="display"
            />
          </div>
          <div className="constructor-column">
            <p className="eyebrow">{t(L('MAXRAJ', 'ЗНАМЕНАТЕЛЬ', 'DENOMINATOR'))}</p>
            {c.denominators.map((item, index) => (
              <button
                type="button"
                className={`constructor-option ${denominator === index ? 'selected' : ''}`}
                key={item}
                onClick={() => {
                  setDenominator(index)
                  setChecked(false)
                  setBuilt(false)
                  setPart(null)
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="action-row">
          <button
            type="button"
            className="btn-white-accent check-button"
            onClick={build}
            disabled={numerator === null || denominator === null || built}
          >
            {t(CONTENT.ui.check)}
          </button>
        </div>
        <FeedbackBlock show={checked} correct={built}>
          <FeedbackLabel correct={built} />
          <p className="body">{t(built ? c.correct_text : c.wrong_text)}</p>
        </FeedbackBlock>
        {built ? (
          <div className="frame fade-up">
            <p className="body question-text">{t(c.followup)}</p>
            <div className="choice-chips">
              {c.followupOptions.map((option, index) => (
                <button
                  type="button"
                  className={`chip ${part === index ? (index === 1 ? 'correct-chip' : 'wrong-chip') : ''}`}
                  key={index}
                  onClick={() => choosePart(index)}
                >
                  {t(option)}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </Stage>
  )
}

function Screen13(props) {
  return (
    <NumInputScreen
      {...props}
      screenMeta={SCREEN_META[13]}
      content={CONTENT.s13}
      figure={<FormulaC />}
    />
  )
}

function Screen14(props) {
  return (
    <QuestionScreen
      {...props}
      screenMeta={SCREEN_META[14]}
      content={CONTENT.s14}
      figure={<FormulaC />}
    />
  )
}

function Screen15({ screen, totalScreens, answers, onPrev, finishLesson }) {
  const c = CONTENT.s15
  const lang = useLang()
  const t = useT()
  const audio = useAudio(useMemo(() => makeAudioSegments(c, lang), [c, lang]))
  const scored = SCREEN_META.reduce(
    (list, meta, index) => (meta.scored ? [...list, { ...meta, index }] : list),
    [],
  )
  const correct = scored.filter(({ index }) => answers[index]?.correct === true).length

  return (
    <Stage
      screen={screen}
      totalScreens={totalScreens}
      eyebrow={t(c.eyebrow)}
      title={t(c.title)}
      audio={audio}
      onPrev={onPrev}
      onNext={finishLesson}
      finish
    >
      <div className="screen-stack summary-stack">
        <div className="summary-rule fade-up delay-1">
          <Frac n="A(x)" d="B(x)" size="display" />
          <span className="summary-arrow">⇒</span>
          <Op size="big">B(x) ≠ 0</Op>
        </div>
        <p className="body summary-lead fade-up delay-1">{t(c.summary)}</p>
        <div className="summary-grid fade-up delay-2">
          {c.canDo.map((item, index) => (
            <div className="summary-item" key={index}>
              <span className="summary-check">✓</span>
              <p>{t(item)}</p>
            </div>
          ))}
        </div>
        <div className="summary-lower fade-up delay-3">
          <div className="score-panel">
            <span className="score-number">{correct}</span>
            <span className="mono">/ {scored.length}</span>
            <p className="small muted">
              {t(L('baholanadigan topshiriqlar', 'оцениваемых заданий', 'scored tasks'))}
            </p>
          </div>
          <div className="frame-soft">
            <p className="body">{t(c.hypothesisReturn)}</p>
          </div>
        </div>
        <div className="bridge-card fade-up delay-4">
          <p className="eyebrow">{t(L('KEYINGI QADAM', 'СЛЕДУЮЩИЙ ШАГ', 'NEXT STEP'))}</p>
          <p className="body">{t(c.bridge)}</p>
        </div>
      </div>
    </Stage>
  )
}

function RationalFormula({ name, n, d, focus = '', phase = 0, size = 'mid' }) {
  return (
    <div className={`rational-formula focus-${focus} phase-${phase}`}>
      {name ? <span className="formula-name">{name} =</span> : null}
      <Frac n={n} d={d} size={size} />
    </div>
  )
}

function useSegmentPhase(audio, prefix, maxPhase) {
  if (audio.muted || audio.completed) return maxPhase
  const id = audio.currentSegment
  if (!id?.startsWith(prefix)) return 0
  const parsed = Number(id.slice(prefix.length))
  return Number.isFinite(parsed) ? Math.min(parsed, maxPhase) : 0
}

function NarrationRail({ labels, phase }) {
  const t = useT()
  return (
    <div className="narration-rail" aria-label={t(L('Tushuntirish bosqichlari', 'Этапы объяснения', 'Explanation stages'))}>
      {labels.map((label, index) => (
        <div
          className={`narration-node ${index < phase ? 'done' : ''} ${index === phase ? 'active' : ''}`}
          key={index}
        >
          <span className="mono">{index < phase ? '✓' : index + 1}</span>
          <p>{t(label)}</p>
        </div>
      ))}
    </div>
  )
}

function TheoryVisual({ visual, phase }) {
  const t = useT()

  if (visual.kind === 'boundary') {
    return (
      <div className="theory-visual boundary-visual">
        <RationalFormula name="K(x)" n={visual.n} d={visual.d} focus={phase >= 1 ? 'denominator' : ''} phase={phase} />
        <div className="value-route">
          {visual.values.map((value) => {
            const blocked = value === 3 && phase >= 2
            return (
              <span className={`route-value ${blocked ? 'blocked' : phase >= 1 ? 'checked' : ''}`} key={value}>
                {blocked ? '×' : phase >= 1 ? '✓' : '·'} x = {value}
              </span>
            )
          })}
        </div>
      </div>
    )
  }

  if (visual.kind === 'classify') {
    return (
      <div className="theory-visual classify-visual">
        <div className={`concept-card ${phase >= 1 ? 'confirmed' : ''}`}>
          <span className="concept-kicker">{t(L('BUTUN', 'ЦЕЛОЕ', 'WHOLE'))}</span>
          <Op size="mid">3x + 1</Op>
          <p>{t(L('O‘zgaruvchili maxraj yo‘q', 'Нет знаменателя с переменной', 'No variable denominator'))}</p>
        </div>
        <div className={`concept-card fraction-concept ${phase >= 2 ? 'confirmed' : ''}`}>
          <span className="concept-kicker">{t(L('KASR', 'ДРОБЬ', 'FRACTION'))}</span>
          <RationalFormula n="x + 1" d="x − 2" focus={phase >= 2 ? 'denominator' : ''} phase={phase} size="sm" />
          <p>{t(L('O‘zgaruvchi maxrajda', 'Переменная в знаменателе', 'Variable in the denominator'))}</p>
        </div>
      </div>
    )
  }

  if (visual.kind === 'anatomy') {
    return (
      <div className="theory-visual anatomy-visual">
        <div className={`anatomy-label numerator-label ${phase === 0 ? 'active' : phase > 0 ? 'done' : ''}`}>
          {t(L('SURAT', 'ЧИСЛИТЕЛЬ', 'NUMERATOR'))}
        </div>
        <RationalFormula n={visual.n} d={visual.d} focus={phase === 0 ? 'numerator' : 'denominator'} phase={phase} size="display" />
        <div className={`anatomy-label denominator-label ${phase >= 1 ? 'active' : ''}`}>
          {t(L('MAXRAJ', 'ЗНАМЕНАТЕЛЬ', 'DENOMINATOR'))}
        </div>
        <div className={`anatomy-rule ${phase >= 2 ? 'visible' : ''}`}>B(x) ≠ 0</div>
      </div>
    )
  }

  if (visual.kind === 'twoZeros') {
    return (
      <div className="theory-visual zero-compare">
        <div className={`zero-case allowed ${phase >= 0 ? 'visible' : ''}`}>
          <RationalFormula n="0" d="4" focus="numerator" phase={phase} />
          <span className="zero-sign">= 0</span>
          <p>{t(L('MUMKIN', 'ДОПУСТИМО', 'ALLOWED'))}</p>
        </div>
        <div className={`zero-case forbidden ${phase >= 1 ? 'visible' : ''}`}>
          <RationalFormula n="4" d="0" focus="denominator" phase={phase} />
          <span className="zero-sign">×</span>
          <p>{t(L('ANIQLANMAGAN', 'НЕ ОПРЕДЕЛЕНО', 'UNDEFINED'))}</p>
        </div>
        <div className={`zero-divider ${phase >= 2 ? 'locked' : ''}`} />
      </div>
    )
  }

  if (visual.kind === 'workedExample') {
    const reasons = [
      L('Maxrajni ajratdik', 'Выделили знаменатель', 'Identified the denominator'),
      L('Uning nolini topdik', 'Нашли его ноль', 'Found its zero'),
      L('Qiymatni chiqardik', 'Исключили значение', 'Excluded the value'),
    ]
    return (
      <div className="theory-visual worked-example-visual">
        <div className="worked-example-formula">
          <span className="concept-kicker">{t(L('MISOL', 'ПРИМЕР', 'EXAMPLE'))}</span>
          <RationalFormula name={visual.name} n={visual.n} d={visual.d} focus="denominator" phase={phase} />
        </div>
        <div className="worked-example-stack">
          {visual.steps.map((step, index) => (
            <div
              className={`worked-example-step ${index <= phase ? 'revealed' : ''} ${index === phase ? 'active' : ''} ${index === visual.steps.length - 1 ? 'final' : ''}`}
              key={step}
            >
              <span className="mono">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <Op size="sm">{step}</Op>
                <small>{t(reasons[index])}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (visual.kind === 'algorithm') {
    return (
      <div className="theory-visual algorithm-visual">
        <RationalFormula name="F(x)" n={visual.n} d={visual.d} focus="denominator" phase={phase} />
        <div className="algorithm-chain">
          {visual.steps.map((step, index) => (
            <React.Fragment key={step}>
              <div className={`algorithm-step ${index <= phase ? 'revealed' : ''} ${index === phase ? 'active' : ''}`}>
                <span className="mono">0{index + 1}</span>
                <Op size="sm">{step}</Op>
              </div>
              {index < visual.steps.length - 1 ? <span className={`chain-arrow ${index < phase ? 'visible' : ''}`}>→</span> : null}
            </React.Fragment>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="theory-visual general-rule-visual">
      <RationalFormula n="A(x)" d="B(x)" focus={phase >= 1 ? 'denominator' : ''} phase={phase} size="display" />
      <span className={`rule-implication ${phase >= 1 ? 'visible' : ''}`}>⇒</span>
      <Op size="big" tone={phase >= 1 ? 'success' : 'ink'}>B(x) ≠ 0</Op>
      <div className={`rule-stamp ${phase >= 2 ? 'visible' : ''}`}>
        {t(L('MAXRAJ → NOL → TAQIQ', 'ЗНАМЕНАТЕЛЬ → НОЛЬ → ИСКЛЮЧИТЬ', 'DENOMINATOR → ZERO → EXCLUDE'))}
      </div>
    </div>
  )
}

function TheoryLessonScreen({ screen, totalScreens, onPrev, onNext }) {
  const c = THEORY_CONTENT[screen - 1]
  const lang = useLang()
  const t = useT()
  const audio = useAudio(useMemo(() => makeAudioSegments(c, lang), [c, lang]))
  const phase = useSegmentPhase(audio, 'aud_', c.points.length - 1)

  return (
    <Stage
      screen={screen}
      totalScreens={totalScreens}
      eyebrow={t(c.eyebrow)}
      title={t(c.title)}
      audio={audio}
      onPrev={onPrev}
      onNext={onNext}
    >
      <div className="screen-stack theory-screen">
        <TheoryVisual visual={c.visual} phase={phase} />
        <NarrationRail labels={c.points} phase={phase} />
        <div className="theory-copy" aria-live="polite">
          {c.points.map((point, index) => (
            <p className={`${index <= phase ? 'visible' : ''} ${index === phase ? 'active' : ''}`} key={index}>
              <span className="mono">{String(index + 1).padStart(2, '0')}</span>
              {t(point)}
            </p>
          ))}
        </div>
      </div>
    </Stage>
  )
}

function normalizeSolutionSpeech(text, lang) {
  const words = {
    uz: { neq: ' teng emas ', eq: ' teng ', arrow: ' demak ', minus: ' minus ', slash: ' bo‘lingan ' },
    ru: { neq: ' не равно ', eq: ' равно ', arrow: ' значит ', minus: ' минус ', slash: ' делённое на ' },
    en: { neq: ' does not equal ', eq: ' equals ', arrow: ' therefore ', minus: ' minus ', slash: ' divided by ' },
  }[lang] || {}

  return String(text)
    .replaceAll('≠', words.neq)
    .replaceAll('⇒', words.arrow)
    .replaceAll('=', words.eq)
    .replaceAll('−', words.minus)
    .replaceAll('/', words.slash)
    .replace(/\s{2,}/g, ' ')
    .trim()
}

function PracticeVisual({ visual, solved }) {
  const t = useT()
  return (
    <div className={`practice-visual focus-${visual.focus || ''} ${solved ? 'solved' : ''}`}>
      <RationalFormula
        name={visual.name}
        n={visual.n}
        d={visual.d}
        focus={visual.focus}
        phase={solved ? 2 : 1}
        size="mid"
      />
      <div className="visual-scan" aria-hidden="true" />
      <span className="visual-caption">
        {t(
          visual.focus === 'numerator'
            ? L('Suratni maxraj bilan adashtirmang', 'Не путайте числитель со знаменателем', 'Do not confuse numerator and denominator')
            : visual.focus === 'audit'
              ? L('Hisob → xulosa', 'Вычисление → вывод', 'Calculation → conclusion')
              : visual.focus === 'build'
                ? L('−2 qo‘yilganda maxraj 0 bo‘lsin', 'При −2 знаменатель должен стать 0', 'At −2 the denominator must become 0')
                : L('Avval maxrajni tekshiring', 'Сначала проверьте знаменатель', 'Inspect the denominator first'),
        )}
      </span>
    </div>
  )
}

function SolutionFrame({ task, phase, ready, onContinue, last }) {
  const t = useT()
  return (
    <div className="solution-frame fade-up">
      <div className="solution-head">
        <span className="solution-label">
          <span>✓</span>
          {t(L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'))}
        </span>
        <span className="solution-status mono">
          {Math.min(phase + 1, task.solution.length)} / {task.solution.length}
        </span>
      </div>
      <div className="solution-flow">
        {task.solution.map((step, index) => (
          <div className={`solution-step ${index <= phase ? 'revealed' : ''} ${index === phase ? 'active' : ''}`} key={index}>
            <span className="mono">{String(index + 1).padStart(2, '0')}</span>
            <p>{renderMathText(t(step))}</p>
          </div>
        ))}
      </div>
      <div className="solution-action">
        <button type="button" className="btn-white-accent" onClick={onContinue} disabled={!ready}>
          {t(last ? L('Blokni yakunlash', 'Завершить блок', 'Finish block') : L('Keyingi misol', 'Следующий пример', 'Next example'))}
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  )
}

function PracticeSeriesScreen({
  blockIndex,
  screen,
  totalScreens,
  storedAnswer,
  onAnswer,
  onPrev,
  onNext,
}) {
  const block = PRACTICE_BLOCKS[blockIndex]
  const meta = SCREEN_META[screen]
  const lang = useLang()
  const t = useT()
  const sfx = useSfx()
  const restored = storedAnswer?.solved === true
  const [taskIndex, setTaskIndex] = useState(restored ? block.tasks.length : 0)
  const [results, setResults] = useState(() => storedAnswer?.taskResults || [])
  const [mode, setMode] = useState(restored ? 'done' : 'question')
  const [picked, setPicked] = useState(null)
  const [wrongSet, setWrongSet] = useState(() => new Set())
  const [value, setValue] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [answerReady, setAnswerReady] = useState(false)
  const firstTryRef = useRef(true)
  const done = taskIndex >= block.tasks.length
  const task = done ? null : block.tasks[taskIndex]

  const segments = useMemo(() => {
    if (done) {
      return [{ id: 'block_done', text: t(block.done), trigger: 'on_mount' }]
    }
    if (mode === 'solution') {
      return task.solution.map((step, index) => ({
        id: `solution_${index}`,
        text: normalizeSolutionSpeech(t(step), lang),
        trigger: index === 0 ? 'on_mount' : 'after_previous',
      }))
    }
    return [{
      id: 'question_0',
      text: t(task.audio),
      trigger: 'on_mount',
      waits_for: { type: task.type === 'input' ? 'check_pressed' : 'option_picked' },
    }]
  }, [block.done, done, lang, mode, t, task])
  const audio = useAudio(segments)
  const solutionPhase = useSegmentPhase(
    audio,
    'solution_',
    task?.solution?.length ? task.solution.length - 1 : 0,
  )

  useEffect(() => {
    if (done || mode !== 'question' || answerReady) return undefined
    if (!audio.muted && !audio.waitingFor) return undefined
    const timer = window.setTimeout(() => setAnswerReady(true), 0)
    return () => window.clearTimeout(timer)
  }, [answerReady, audio.muted, audio.waitingFor, done, mode, taskIndex])

  const speakWrong = () => {
    if (!audio.muted) getAudioEngine()?.pushOneOff(t(task.wrong))
  }

  const registerCorrect = () => {
    sfx.playCorrect()
    setMode('solution')
    setShowHint(false)
  }

  const pickOption = (index) => {
    if (!answerReady || mode !== 'question' || wrongSet.has(index)) return
    setPicked(index)
    if (index === task.correct) {
      registerCorrect()
      return
    }
    firstTryRef.current = false
    setWrongSet((previous) => new Set(previous).add(index))
    setShowHint(true)
    sfx.playWrong()
    speakWrong()
  }

  const submitInput = () => {
    if (!answerReady || mode !== 'question' || !String(value).trim()) return
    const normalized = Number(String(value).trim().replace('−', '-').replace(',', '.'))
    if (Number.isFinite(normalized) && normalized === task.answer) {
      setPicked(normalized)
      registerCorrect()
      return
    }
    firstTryRef.current = false
    setShowHint(true)
    sfx.playWrong()
    speakWrong()
  }

  const finishTask = () => {
    const nextResults = [
      ...results,
      {
        task: taskIndex + 1,
        correct: true,
        firstTry: firstTryRef.current,
        answer: task.type === 'input' ? Number(value) : picked,
      },
    ]
    const nextIndex = taskIndex + 1
    setResults(nextResults)
    if (nextIndex >= block.tasks.length) {
      setTaskIndex(nextIndex)
      setMode('done')
      onAnswer({
        stage: meta.scope,
        screenIdx: screen,
        question: t(block.title),
        options: null,
        correctIndex: null,
        correctAnswer: t(L('6 topshiriq bajarildi', 'Выполнено 6 заданий', '6 tasks completed')),
        studentAnswerIndex: null,
        studentAnswer: JSON.stringify(nextResults),
        correct: true,
        firstTry: nextResults.every((result) => result.firstTry),
        solved: true,
        taskResults: nextResults,
      })
      return
    }
    setTaskIndex(nextIndex)
    setMode('question')
    setPicked(null)
    setWrongSet(new Set())
    setValue('')
    setShowHint(false)
    setAnswerReady(false)
    firstTryRef.current = true
  }

  const displayedSolutionPhase = audio.muted && task
    ? task.solution.length - 1
    : solutionPhase
  const solutionReady = mode === 'solution' && (
    audio.muted ||
    audio.completed
  )

  return (
    <Stage
      screen={screen}
      totalScreens={totalScreens}
      eyebrow={t(block.eyebrow)}
      title={t(block.title)}
      audio={audio}
      onPrev={onPrev}
      onNext={onNext}
    >
      <div className="screen-stack practice-series">
        <div className="practice-progress" aria-label={t(block.lead)}>
          {block.tasks.map((_, index) => (
            <div
              className={`practice-progress-step ${index < taskIndex ? 'done' : ''} ${index === taskIndex ? 'active' : ''}`}
              key={index}
            >
              <span>{index < taskIndex ? '✓' : index > taskIndex ? '⌁' : index + 1}</span>
              <small>{index > taskIndex ? t(L('yopiq', 'закрыто', 'locked')) : ''}</small>
            </div>
          ))}
        </div>

        {!done && task ? (
          <div className={`practice-question ${mode === 'solution' ? 'is-solved' : ''}`} key={`${blockIndex}_${taskIndex}`}>
            <div className="practice-question-head">
              <span className="practice-count mono">{String(taskIndex + 1).padStart(2, '0')} / 06</span>
              <h2>{t(task.question)}</h2>
            </div>

            <PracticeVisual visual={task.visual} solved={mode === 'solution'} />

            {mode === 'question' && !answerReady ? (
              <div className="answer-wait">
                <span className="answer-wait-pulse" />
                {t(L('Savol tushuntirilmoqda…', 'Сначала разберём условие…', 'Explaining the question…'))}
              </div>
            ) : null}

            {mode === 'question' && answerReady && task.type === 'mc' ? (
              <div className="practice-options fade-up">
                {task.options.map((option, index) => {
                  const wrong = wrongSet.has(index)
                  return (
                    <button
                      type="button"
                      className={`option ${wrong ? 'option-picked-wrong' : ''}`}
                      disabled={wrong}
                      onClick={() => pickOption(index)}
                      key={index}
                    >
                      <span className="option-index mono">{wrong ? '×' : String.fromCharCode(65 + index)}</span>
                      <span>{renderMathText(t(option))}</span>
                    </button>
                  )
                })}
              </div>
            ) : null}

            {mode === 'question' && answerReady && task.type === 'input' ? (
              <div className="practice-input fade-up">
                <input
                  type="text"
                  inputMode="decimal"
                  className={`answer-input ${showHint ? 'wrong' : ''}`}
                  value={value}
                  onChange={(event) => {
                    setValue(event.target.value)
                    setShowHint(false)
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') submitInput()
                  }}
                  aria-label={t(L('Javob', 'Ответ', 'Answer'))}
                  placeholder="x = ?"
                />
                <button type="button" className="btn-white-accent" onClick={submitInput} disabled={!String(value).trim()}>
                  {t(CONTENT.ui.check)}
                </button>
              </div>
            ) : null}

            {mode === 'question' && showHint ? (
              <div className="frame-tip practice-hint fade-up">
                <FeedbackLabel correct={false} />
                <p className="body">{t(task.wrong)}</p>
              </div>
            ) : null}

            {mode === 'solution' ? (
              <SolutionFrame
                task={task}
                phase={displayedSolutionPhase}
                ready={solutionReady}
                onContinue={finishTask}
                last={taskIndex === block.tasks.length - 1}
              />
            ) : null}
          </div>
        ) : (
          <div className="practice-complete fade-up">
            <div className="complete-mark">✓</div>
            <h2>{t(L('Blok bajarildi', 'Блок выполнен', 'Block complete'))}</h2>
            <p>{t(block.done)}</p>
            <div className="complete-stats">
              <span className="mono">6 / 6</span>
              <small>{t(L('to‘g‘ri yechildi', 'решено верно', 'solved correctly'))}</small>
            </div>
          </div>
        )}
      </div>
    </Stage>
  )
}

function LessonSummaryScreen({ screen, totalScreens, answers, onPrev, finishLesson }) {
  const lang = useLang()
  const t = useT()
  const content = useMemo(() => ({
    eyebrow: L('DARS XULOSASI', 'ИТОГИ УРОКА', 'LESSON SUMMARY'),
    title: L('Maxraj formula qayerda ishlashini belgilaydi', 'Знаменатель определяет, где работает формула', 'The denominator determines where a formula works'),
    audio: L(
      [
        'Asosiy qoida: ratsional kasrning maxraji nolga teng bo‘lmasligi kerak.',
        'Taqiqlangan qiymatlarni topish uchun maxrajni nolga tenglashtirib, tenglamani yechamiz.',
        'Nol surat mumkin, nol maxraj esa mumkin emas. Shu farq mavzuning asosiy mazmunidir.',
      ],
      [
        'Главное правило: знаменатель рациональной дроби не должен быть равен нулю.',
        'Чтобы найти запрещённые значения, приравниваем знаменатель к нулю и решаем уравнение.',
        'Нулевой числитель допустим, а нулевой знаменатель нет. Это главное различие темы.',
      ],
      [
        'The main rule is that the denominator of a rational fraction must not equal zero.',
        'To find excluded values, set the denominator equal to zero and solve the equation.',
        'A zero numerator is allowed, while a zero denominator is not. This is the central distinction.',
      ],
    ),
  }), [])
  const audio = useAudio(useMemo(() => makeAudioSegments(content, lang), [content, lang]))
  const completedBlocks = [8, 9, 10].filter((index) => answers[index]?.solved).length

  return (
    <Stage
      screen={screen}
      totalScreens={totalScreens}
      eyebrow={t(content.eyebrow)}
      title={t(content.title)}
      audio={audio}
      onPrev={onPrev}
      onNext={finishLesson}
      finish
    >
      <div className="screen-stack final-summary">
        <div className="summary-rule fade-up">
          <RationalFormula n="A(x)" d="B(x)" focus="denominator" phase={2} size="display" />
          <span className="summary-arrow">⇒</span>
          <Op size="big" tone="success">B(x) ≠ 0</Op>
        </div>
        <div className="final-rule-grid">
          {[
            L('1. Maxrajni toping', '1. Найдите знаменатель', '1. Identify the denominator'),
            L('2. B(x) = 0 ni yeching', '2. Решите B(x) = 0', '2. Solve B(x) = 0'),
            L('3. Topilgan qiymatlarni chiqaring', '3. Исключите найденные значения', '3. Exclude the resulting values'),
          ].map((item, index) => (
            <div className="final-rule-card" key={index}>
              <span>{index + 1}</span>
              <p>{t(item)}</p>
            </div>
          ))}
        </div>
        <div className="zero-memory">
          <div className="allowed"><Frac n="0" d="a ≠ 0" size="sm" /><span>= 0</span></div>
          <div className="forbidden"><Frac n="a" d="0" size="sm" /><span>{t(CONTENT.ui.undefined)}</span></div>
        </div>
        <div className="summary-score">
          <span className="score-number">{completedBlocks}</span>
          <span className="mono">/ 3</span>
          <p>{t(L('amaliy blok bajarildi', 'практических блока выполнено', 'practice blocks completed'))}</p>
        </div>
      </div>
    </Stage>
  )
}

const NewScreen0 = (props) => <Screen0 {...props} />
const NewScreen1 = (props) => <TheoryLessonScreen {...props} />
const NewScreen2 = (props) => <TheoryLessonScreen {...props} />
const NewScreen3 = (props) => <TheoryLessonScreen {...props} />
const NewScreen4 = (props) => <TheoryLessonScreen {...props} />
const NewScreen5 = (props) => <TheoryLessonScreen {...props} />
const NewScreen6 = (props) => <TheoryLessonScreen {...props} />
const NewScreen7 = (props) => <TheoryLessonScreen {...props} />
const NewScreen8 = (props) => <PracticeSeriesScreen {...props} blockIndex={0} />
const NewScreen9 = (props) => <PracticeSeriesScreen {...props} blockIndex={1} />
const NewScreen10 = (props) => <PracticeSeriesScreen {...props} blockIndex={2} />
const NewScreen11 = (props) => <LessonSummaryScreen {...props} />

// The legacy screens remain below the same infrastructure as a safe rollback
// during this first methodological rebuild. Production renders the phased flow.
const USE_PHASED_LESSON = true
const SCREENS = USE_PHASED_LESSON
  ? [
      NewScreen0,
      NewScreen1,
      NewScreen2,
      NewScreen3,
      NewScreen4,
      NewScreen5,
      NewScreen6,
      NewScreen7,
      NewScreen8,
      NewScreen9,
      NewScreen10,
      NewScreen11,
    ]
  : [
      Screen0,
      Screen1,
      Screen2,
      Screen3,
      Screen4,
      Screen5,
      Screen6,
      Screen7,
      Screen8,
      Screen9,
      Screen10,
      Screen11,
      Screen12,
      Screen13,
      Screen14,
      Screen15,
    ]

export default function RationalExpressionsLesson({
  studentName,
  lang: langProp,
  ttsApiBase,
  voiceGender,
  correctSoundUrl,
  wrongSoundUrl,
  onFinished,
}) {
  useMobileZoom()
  const lang = ['uz', 'ru', 'en'].includes(langProp) ? langProp : 'ru'
  configureLesson({
    ttsApiBase: ttsApiBase || '',
    voiceGender: voiceGender || 'm',
    correctSoundUrl: correctSoundUrl || '',
    wrongSoundUrl: wrongSoundUrl || '',
  })
  const safeOnFinished = useCallback(
    (payload) => {
      if (onFinished) {
        onFinished(payload)
        return
      }
      console.log('[Preview] onFinished payload:', payload)
    },
    [onFinished],
  )

  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState([])
  const [startedAt] = useState(() => Date.now())

  const recordAnswer = useCallback((screenIndex, data) => {
    setAnswers((previous) => {
      const next = [...previous]
      next[screenIndex] = data
      return next
    })
  }, [])

  const next = useCallback(
    () => setCurrent((previous) => Math.min(previous + 1, TOTAL_SCREENS - 1)),
    [],
  )
  const previous = useCallback(
    () => setCurrent((currentScreen) => Math.max(currentScreen - 1, 0)),
    [],
  )
  const answer = useCallback(
    (data) => recordAnswer(current, data),
    [current, recordAnswer],
  )

  const finishLesson = useCallback(() => {
    const scoredAnswers = SCREEN_META.flatMap((meta, index) =>
      meta.scored && answers[index] ? [answers[index]] : [],
    )
    const finalAnswers = SCREEN_META.flatMap((meta, index) =>
      meta.scope === 'final' && answers[index] ? [answers[index]] : [],
    )
    const correctCount = scoredAnswers.filter((item) => item.correct).length
    const finalCorrect = finalAnswers.filter((item) => item.correct).length
    safeOnFinished({
      lessonId: LESSON_META.lessonId,
      lessonTitle: LESSON_META.lessonTitle,
      studentName: studentName || null,
      lang,
      durationSec: Math.floor((Date.now() - startedAt) / 1000),
      totalQuestions: scoredAnswers.length,
      correctAnswers: correctCount,
      scorePercent: scoredAnswers.length
        ? Math.round((correctCount / scoredAnswers.length) * 100)
        : 0,
      finalScore: finalCorrect,
      finalTotal: finalAnswers.length,
      passed: finalAnswers.length > 0 && finalCorrect === finalAnswers.length,
      answers: answers.filter(Boolean),
    })
  }, [answers, lang, safeOnFinished, startedAt, studentName])

  const CurrentScreen = SCREENS[current]

  return (
    <LangContext.Provider value={lang}>
      <style>{STYLES}</style>
      <div className="lesson-root">
        <div className="ambient-grid" aria-hidden="true">
          <span className="ambient-orb ambient-orb-1" />
          <span className="ambient-orb ambient-orb-2" />
          <span className="ambient-orb ambient-orb-3" />
        </div>
        <CurrentScreen
          key={`screen_${current}`}
          screen={current}
          totalScreens={TOTAL_SCREENS}
          storedAnswer={answers[current]}
          answers={answers}
          onAnswer={answer}
          onPrev={previous}
          onNext={next}
          finishLesson={finishLesson}
        />
      </div>
    </LangContext.Provider>
  )
}

const STYLES = `
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
  isolation: isolate;
  overflow: hidden;
  overscroll-behavior: none;
  color: ${T.ink};
  background: ${T.bg};
  font-family: Manrope, Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  -webkit-font-smoothing: antialiased;
  font-feature-settings: "ss01", "cv11";
  zoom: var(--g8z, 1);
}
.lesson-root h1, .lesson-root h2, .lesson-root h3, .lesson-root h4,
.lesson-root p, .lesson-root ul, .lesson-root ol { margin: 0; padding: 0; }
button, input { font: inherit; }
button { -webkit-tap-highlight-color: transparent; }

.ambient-grid {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}
.ambient-orb {
  position: absolute;
  border-radius: 50%;
  opacity: .7;
  background: radial-gradient(circle at 30% 30%, rgba(255,79,40,.10), rgba(255,79,40,.02));
  animation: ambFloat 15s ease-in-out infinite;
}
.ambient-orb-1 {
  width: 90px;
  height: 90px;
  left: 5%;
  top: 10%;
}
.ambient-orb-2 {
  width: 130px;
  height: 130px;
  right: 3%;
  bottom: 6%;
  background: radial-gradient(circle at 30% 30%, rgba(1,154,203,.10), rgba(1,154,203,.02));
  animation-delay: -5s;
}
.ambient-orb-3 {
  width: 58px;
  height: 58px;
  left: 42%;
  top: 62%;
  animation-delay: -9s;
}

.stage {
  position: relative;
  z-index: 1;
  width: min(936px, 100%);
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}
.stage-header {
  flex-shrink: 0;
  padding: 11px 100px 12px;
  background: ${T.bg};
}
.stage-content {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 12px 100px 20px;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}
.stage-body {
  width: 100%;
  margin-block: 0;
}
.stage-nav {
  flex-shrink: 0;
  min-height: 63px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 100px;
  background: ${T.bg};
  border-top: 1px solid rgba(167,166,162,.25);
}
.nav-spacer { flex: 1; }
.screen-heading { display: grid; gap: 5px; margin-bottom: 16px; }
.screen-stack { display: grid; gap: 14px; }

.progress-track {
  width: 100%;
  height: 6px;
  margin-bottom: 12px;
  overflow: visible;
  border-radius: 99px;
  background: rgba(167,166,162,.25);
}
.progress-bar {
  height: 100%;
  border-radius: 99px;
  background: ${T.accent};
  box-shadow: 0 0 10px rgba(255,79,40,.55), 0 0 3px rgba(255,79,40,.40);
  transition: width .5s cubic-bezier(.4,0,.2,1);
}
.chrome, .chrome-left, .chrome-right {
  display: flex;
  align-items: center;
}
.chrome { justify-content: space-between; gap: 16px; }
.chrome-left, .chrome-right { gap: 10px; }
.dot {
  width: 7px;
  height: 7px;
  flex: 0 0 7px;
  border-radius: 50%;
  background: ${T.accent};
  box-shadow: 0 0 8px rgba(255,79,40,.55);
}
.screen-counter {
  color: ${T.ink};
  font-family: "JetBrains Mono", "SFMono-Regular", Consolas, monospace;
  font-size: 14px;
  font-weight: 700;
}

.title {
  font-family: "Source Serif 4", Georgia, serif;
  font-weight: 600;
  line-height: 1.08;
  letter-spacing: -.012em;
}
.h-title { max-width: 736px; font-size: clamp(22px, 4vw, 30px); }
.body { font-size: clamp(14px, 1.4vw, 15px); line-height: 1.42; }
.small { font-size: 13px; line-height: 1.42; }
.eyebrow {
  color: ${T.accent};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: .18em;
  text-transform: uppercase;
}
.mono { font-family: "JetBrains Mono", "SFMono-Regular", Consolas, monospace; }
.muted { color: ${T.ink2}; }
.question-text { max-width: 780px; font-weight: 560; }

.formula-card {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 90px;
  padding: 16px;
  overflow: hidden;
  border: none;
  border-radius: 16px;
  background: ${T.paper};
  box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},.14);
}
.formula-card:not(.formula-hero) > * {
  animation: formula-dock .5s cubic-bezier(.22,.9,.3,1) .16s both;
}
.formula-hero {
  position: relative;
  isolation: isolate;
  flex-direction: column;
  gap: 12px;
  min-height: 145px;
}
.formula-hero::before,
.formula-hero::after {
  position: absolute;
  pointer-events: none;
  content: "";
}
.formula-hero::before {
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  animation: hookGlow 3.4s ease-in-out infinite;
}
.formula-hero::after {
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 0;
  width: 45%;
  background: linear-gradient(105deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.55) 50%, rgba(255,255,255,0) 100%);
  transform: translateX(-110%);
  animation: hookSheen 3.4s ease-in-out infinite;
}
.formula-hero > * { position: relative; z-index: 1; }
.formula, .inline-math, .mini-formula {
  color: ${T.ink};
  font-family: "STIX Two Math", "Cambria Math", Georgia, serif;
  font-size: clamp(23px, 3vw, 32px);
  font-weight: 560;
  line-height: 1.15;
}
.formula.compact { font-size: clamp(18px, 2.4vw, 24px); }
.mini-formula { margin: 12px 0; text-align: center; }
.inline-math { font-size: clamp(17px, 2vw, 21px); }
.mop { display: inline-block; font-family: "STIX Two Math", "Cambria Math", Georgia, serif; }
.mop-big { font-size: clamp(27px, 3.5vw, 36px); }
.mop-mid { font-size: clamp(20px, 2.7vw, 28px); }
.mop-sm { font-size: clamp(15px, 1.8vw, 18px); }
.frac {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  vertical-align: middle;
  margin: 0 .09em;
  line-height: 1;
  font-family: "STIX Two Math", "Cambria Math", Georgia, serif;
}
.frac .n, .frac .d { padding: 0 .15em; white-space: nowrap; }
.frac .bar { width: 100%; height: .075em; margin: .08em 0; border-radius: 2px; background: currentColor; }
.frac-display { font-size: clamp(32px, 4.2vw, 44px); }
.frac-mid { font-size: clamp(25px, 3.1vw, 32px); }
.frac-sm { font-size: clamp(17px, 2.2vw, 22px); }
.formula-pair { width: 100%; display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 12px; }
.formula-pair > * {
  display: flex;
  min-height: 74px;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border-radius: 13px;
  background: ${T.bg};
}
.input-values {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 7px 11px;
  border-radius: 10px;
  color: ${T.ink2};
  background: ${T.blueSoft};
  font-size: 11px;
}
.input-values strong {
  color: ${T.blue};
  font-size: 13px;
}

.frame {
  padding: 17px;
  border: none;
  border-radius: 16px;
  background: ${T.paper};
  box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},.14);
}
.frame-success, .frame-tip, .frame-soft {
  padding: 14px 16px;
  border-radius: 12px;
}
.frame-success {
  border-left: 4px solid ${T.success};
  background: ${T.successSoft};
  box-shadow: 0 6px 16px -6px rgba(31,122,77,.22);
}
.frame-tip {
  border-left: 4px solid ${T.tip};
  background: ${T.tipSoft};
  box-shadow: 0 6px 16px -6px rgba(180,138,30,.22);
}
.frame-soft {
  border-left: 4px solid ${T.accent};
  background: ${T.accentSoft};
  box-shadow: 0 6px 16px -6px rgba(255,79,40,.22);
}
.feedback-block {
  max-height: 0;
  margin-top: 0;
  overflow: hidden;
  opacity: 0;
  transition: max-height .45s ease, opacity .3s ease .08s, margin-top .4s ease;
}
.feedback-block.visible { max-height: 700px; margin-top: 2px; opacity: 1; }
.feedback-block.visible > * {
  animation: feedback-pop .4s cubic-bezier(.34,1.3,.5,1) both;
}
.feedback-label {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 7px !important;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .1em;
  text-transform: uppercase;
}
.feedback-label.is-correct { color: ${T.success}; }
.feedback-label.is-hint { color: ${T.tipInk}; }

.btn, .btn-white-accent, .btn-ghost {
  min-height: 42px;
  padding: 9px 15px;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  letter-spacing: .01em;
  cursor: pointer;
  transition: transform .2s, background .2s, color .2s, box-shadow .2s, opacity .2s;
}
.btn-white-accent {
  color: ${T.accent};
  background: ${T.paper};
  box-shadow: 0 8px 22px -4px rgba(255,79,40,.35), 0 0 0 1px rgba(255,79,40,.12);
}
.btn-white-accent:hover:not(:disabled) {
  color: ${T.paper};
  background: ${T.accent};
  transform: translateY(-1px);
  box-shadow: 0 12px 28px -6px rgba(255,79,40,.55);
}
.btn-ghost { color: ${T.ink}; background: transparent; box-shadow: none; }
.btn-ghost:hover:not(:disabled) { background: ${T.paper}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},.18); }
.btn-white-accent:disabled {
  cursor: not-allowed;
  opacity: .45;
  box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},.14);
}
.btn-ghost:disabled { cursor: not-allowed; opacity: .4; box-shadow: none; }
.nav-button { display: inline-flex; align-items: center; gap: 8px; }
.check-button { min-width: 130px; }
.action-row { display: flex; justify-content: flex-end; }

.option-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 10px; }
.hook-layout .option-grid { grid-template-columns: 1fr; gap: 9px; }
.option {
  display: flex;
  min-height: 48px;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 9px 14px;
  border: none;
  border-radius: 12px;
  color: ${T.ink};
  background: ${T.paper};
  box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},.14);
  max-height: 200px;
  cursor: pointer;
  text-align: left;
  transition:
    transform .6s cubic-bezier(.33,0,.2,1),
    background .2s,
    color .2s,
    box-shadow .2s,
    opacity .6s,
    max-height .75s cubic-bezier(.33,0,.2,1),
    min-height .75s cubic-bezier(.33,0,.2,1),
    padding .5s cubic-bezier(.33,0,.2,1);
}
.hook-layout .option {
  min-height: 42px;
  padding-top: 8px;
  padding-bottom: 8px;
}
.option:hover:not(:disabled):not(.option-selected):not(.option-correct):not(.option-picked-wrong) {
  transform: translateY(-1px);
  background: #FDFBF7;
  box-shadow: 0 10px 22px -6px rgba(${T.shadowBase},.22);
}
.option:disabled { cursor: default; }
.option-index {
  display: grid;
  flex: 0 0 27px;
  width: 27px;
  height: 27px;
  place-items: center;
  border-radius: 8px;
  color: ${T.ink3};
  background: ${T.bg};
  font-size: 12px;
}
.option-grid.is-solved {
  grid-template-columns: minmax(0,440px);
  justify-content: center;
}
.option-selected {
  color: ${T.accent};
  background: ${T.choiceSoft};
  box-shadow: inset 0 0 0 2px ${T.accent}, 0 8px 20px -6px rgba(255,79,40,.30);
  animation: state-pop .35s cubic-bezier(.34,1.3,.5,1) both;
}
.option-selected .option-index {
  color: ${T.paper};
  background: ${T.accent};
}
.option-correct {
  color: ${T.success};
  background: ${T.successSoft};
  box-shadow: 0 8px 22px -6px rgba(31,122,77,.32);
  animation: optPop .5s cubic-bezier(.34,1.56,.64,1) both;
}
.option-correct .option-index { color: ${T.paper}; background: ${T.success}; }
.option-picked-wrong {
  color: ${T.tipInk};
  background: ${T.tipSoft};
  box-shadow: 0 8px 22px -6px rgba(216,169,58,.32);
  animation: odShake .4s ease;
}
.option-picked-wrong .option-index { color: ${T.paper}; background: ${T.tip}; }
.option-wrong { color: ${T.ink3}; opacity: .32; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},.06); }
.option-collapse {
  min-height: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
  overflow: hidden;
  opacity: 0;
  transform: translateY(-6px) scale(.97);
  box-shadow: none;
}

.answer-input {
  width: min(210px, 48vw);
  min-height: 56px;
  padding: 8px 12px;
  border: none;
  border-radius: 12px;
  outline: none;
  color: ${T.ink};
  background: ${T.paper};
  box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},.14);
  font-family: "STIX Two Math", Georgia, serif;
  font-size: clamp(22px,4vw,28px);
  text-align: center;
  transition: box-shadow .2s, background .2s, color .2s;
}
.answer-input:focus { box-shadow: 0 10px 22px -6px rgba(255,79,40,.3), 0 0 0 1px rgba(255,79,40,.2); }
.answer-input.correct { color: ${T.success}; background: ${T.successSoft}; box-shadow: 0 8px 20px -6px rgba(31,122,77,.3); }
.answer-input.wrong {
  color: ${T.accent};
  background: ${T.accentSoft};
  box-shadow: 0 8px 20px -6px rgba(255,79,40,.36);
  animation: odShake .4s ease;
}
.compact-input { width: 150px; margin-top: 14px; }
.input-row { display: flex; align-items: center; justify-content: center; gap: 12px; }
.condition-chip, .target-chip {
  justify-self: center;
  padding: 9px 14px;
  border-radius: 99px;
  color: ${T.blue};
  background: ${T.blueSoft};
  font-size: clamp(14px,2vw,17px);
  font-weight: 700;
}

.audio-tools { display: flex; align-items: center; gap: 5px; }
.icon-button {
  display: grid;
  width: 26px;
  height: 26px;
  place-items: center;
  border: none;
  border-radius: 0;
  color: ${T.ink2};
  background: transparent;
  box-shadow: none;
  cursor: pointer;
}
.icon-button svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.icon-button.is-playing {
  color: ${T.blue};
  background: transparent;
}
.icon-button.is-playing svg { animation: audio-breathe 1.8s ease-in-out infinite; }

.step-rail { display: flex; align-items: center; justify-content: center; gap: 10px; }
.step-node {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border-radius: 50%;
  color: ${T.ink3};
  background: rgba(167,166,162,.25);
  font-family: "JetBrains Mono", monospace;
  font-size: 12px;
}
.step-node.active {
  color: ${T.paper};
  background: ${T.accent};
  box-shadow: 0 0 10px rgba(255,79,40,.55);
  animation: active-step 2.4s ease-in-out infinite;
}
.step-node.done {
  color: ${T.paper};
  background: ${T.success};
  animation: check-settle .42s cubic-bezier(.34,1.45,.5,1);
}
.choice-chips { display: flex; flex-wrap: wrap; gap: 9px; margin-top: 14px; }
.chip {
  min-height: 42px;
  padding: 8px 13px;
  border: none;
  border-radius: 10px;
  color: ${T.ink};
  background: ${T.paper};
  box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},.14);
  cursor: pointer;
}
.chip.selected {
  color: ${T.accent};
  background: ${T.choiceSoft};
  box-shadow: inset 0 0 0 2px ${T.accent}, 0 8px 20px -6px rgba(255,79,40,.28);
  animation: state-pop .35s cubic-bezier(.34,1.3,.5,1) both;
}
.chip.correct-chip { color: ${T.success}; background: ${T.successSoft}; animation: state-pop .35s cubic-bezier(.34,1.3,.5,1) both; }
.chip.wrong-chip {
  color: ${T.tipInk};
  background: ${T.tipSoft};
  box-shadow: inset 0 0 0 2px ${T.tip};
  animation: odShake .4s ease;
}
.value-chip { min-width: 48px; font-family: "JetBrains Mono", monospace; }

.sort-list { display: grid; gap: 10px; }
.sort-card {
  display: grid;
  grid-template-columns: minmax(150px,.75fr) 1.5fr;
  align-items: center;
  gap: 14px;
  padding: 13px;
  border-radius: 14px;
  background: ${T.paper};
  box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},.14);
  animation: card-dock .42s cubic-bezier(.22,.9,.3,1) backwards;
}
.sort-card:nth-child(2) { animation-delay: .08s; }
.sort-card:nth-child(3) { animation-delay: .16s; }
.sort-actions { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 8px; }
.sort-button {
  display: flex;
  min-height: 46px;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border: none;
  border-radius: 10px;
  color: ${T.ink2};
  background: ${T.bg};
  cursor: pointer;
  text-align: left;
}
.sort-button.selected {
  color: ${T.accent};
  background: ${T.choiceSoft};
  box-shadow: inset 0 0 0 2px ${T.accent}, 0 8px 20px -8px rgba(255,79,40,.28);
  animation: state-pop .35s cubic-bezier(.34,1.3,.5,1) both;
}
.sort-code { font-size: 11px; font-weight: 800; }

.hypothesis-grid { display: grid; grid-template-columns: .8fr 1.2fr; gap: 12px; }
.reason-list { display: grid; gap: 8px; margin-top: 14px; }
.reason-button {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  padding: 9px 11px;
  border: none;
  border-radius: 10px;
  color: ${T.ink2};
  background: ${T.bg};
  cursor: pointer;
  text-align: left;
}
.reason-button.selected {
  color: ${T.accent};
  background: ${T.choiceSoft};
  box-shadow: inset 0 0 0 2px ${T.accent}, 0 8px 20px -8px rgba(255,79,40,.28);
  animation: state-pop .35s cubic-bezier(.34,1.3,.5,1) both;
}

.data-table-wrap { overflow-x: auto; padding: 2px 2px 10px; }
.data-table { width: 100%; min-width: 620px; border-collapse: separate; border-spacing: 0 8px; }
.data-table th { padding: 6px 10px; color: ${T.ink3}; font-size: 11px; letter-spacing: .08em; text-transform: uppercase; text-align: left; }
.data-table td { padding: 11px 10px; background: ${T.paper}; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},.14); }
.data-table td:first-child { border-radius: 11px 0 0 11px; }
.data-table td:last-child { border-radius: 0 11px 11px 0; }
.data-table .revealed-row:not(.critical-row) td {
  animation: cell-reveal .4s cubic-bezier(.22,.9,.3,1) both;
}
.data-table .revealed-row td:nth-child(2) { animation-delay: .04s; }
.data-table .revealed-row td:nth-child(3) { animation-delay: .08s; }
.data-table .revealed-row td:nth-child(4) { animation-delay: .12s; }
.data-table .revealed-row td:nth-child(5) { animation-delay: .16s; }
.data-table .critical-row td { color: ${T.accent}; background: ${T.accentSoft}; }
.data-table .critical-row td {
  animation: critical-lock .58s cubic-bezier(.16,1,.3,1) both;
}
.table-action {
  min-height: 34px;
  padding: 6px 10px;
  border: none;
  border-radius: 9px;
  color: ${T.accent};
  background: ${T.paper};
  box-shadow: 0 5px 13px -7px rgba(255,79,40,.4);
  cursor: pointer;
}
.table-action.done { color: ${T.success}; background: transparent; box-shadow: none; animation: state-pop .35s cubic-bezier(.34,1.3,.5,1) both; }

.sequence-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.sequence-bank, .sequence-result { display: grid; gap: 9px; }
.sequence-card, .sequence-slot {
  display: flex;
  min-height: 56px;
  align-items: center;
  gap: 10px;
  padding: 11px 13px;
  border: none;
  border-radius: 12px;
  text-align: left;
}
.sequence-card { color: ${T.ink}; background: ${T.paper}; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},.14); cursor: pointer; }
.sequence-card.used {
  opacity: .32;
  transform: translateX(8px) scale(.98);
  box-shadow: none;
}
.sequence-code { color: ${T.accent}; font-size: 11px; }
.sequence-slot { color: ${T.ink3}; background: rgba(167,166,162,.08); box-shadow: inset 0 0 0 1px rgba(167,166,162,.16); }
.sequence-slot.filled {
  color: ${T.success};
  background: ${T.successSoft};
  box-shadow: none;
  animation: slot-dock .48s cubic-bezier(.22,.9,.3,1);
}

.term-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 10px; }
.term-card {
  display: grid;
  min-height: 164px;
  align-content: start;
  gap: 11px;
  padding: 17px;
  border: none;
  border-radius: 15px;
  color: ${T.ink};
  background: ${T.paper};
  box-shadow: 0 8px 22px -9px rgba(${T.shadowBase},.22);
  cursor: pointer;
  text-align: left;
  animation: card-dock .42s cubic-bezier(.22,.9,.3,1) backwards;
}
.term-card:nth-child(2) { animation-delay: .08s; }
.term-card:nth-child(3) { animation-delay: .16s; }
.term-card.open {
  box-shadow: inset 0 0 0 2px ${T.choiceRing}, 0 11px 28px -10px rgba(255,79,40,.24);
  animation: state-pop .35s cubic-bezier(.34,1.3,.5,1) both;
}
.term-index { color: ${T.blue}; font-size: 11px; }
.term-definition { color: ${T.ink2}; font-size: 13px; line-height: 1.45; }
.term-card:not(.open) .term-definition { color: ${T.accent}; font-weight: 700; }
.central-rule {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 22px;
  min-height: 106px;
  padding: 16px;
  border-radius: 16px;
  opacity: .22;
  background: ${T.blueSoft};
  transition: opacity .45s, box-shadow .45s;
}
.central-rule.visible {
  opacity: 1;
  box-shadow: 0 6px 16px -6px rgba(1,154,203,.22);
  animation: rule-lock .6s cubic-bezier(.16,1,.3,1);
}
.rule-divider { width: 1px; height: 48px; background: rgba(1,154,203,.24); }

.worked-steps { display: grid; gap: 9px; }
.worked-step {
  display: grid;
  grid-template-columns: 44px 1fr;
  align-items: center;
  gap: 12px;
  padding: 13px 15px;
  border-radius: 13px;
  background: ${T.paper};
  box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},.14);
}
.worked-index { color: ${T.blue}; font-size: 12px; }
.worked-step:last-child { animation: sort-pop .4s cubic-bezier(.34,1.3,.5,1) both; }

.audit-list { display: grid; gap: 8px; }
.audit-step {
  display: grid;
  grid-template-columns: 38px 1fr;
  gap: 10px;
  padding: 11px 13px;
  border-radius: 11px;
  color: ${T.ink2};
  background: ${T.paper};
  box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},.14);
  animation: audit-dock .4s cubic-bezier(.22,.9,.3,1) backwards;
}
.audit-step:nth-child(2) { animation-delay: .08s; }
.audit-step:nth-child(3) { animation-delay: .16s; }
.audit-step:nth-child(4) { animation-delay: .24s; }
.audit-step > span { color: ${T.blue}; font-size: 11px; }

.constructor {
  display: grid;
  grid-template-columns: 1fr minmax(180px,.8fr) 1fr;
  align-items: stretch;
  gap: 12px;
}
.constructor-column { display: grid; align-content: start; gap: 8px; }
.constructor-option {
  min-height: 44px;
  padding: 8px 10px;
  border: none;
  border-radius: 10px;
  color: ${T.ink};
  background: ${T.paper};
  box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},.14);
  cursor: pointer;
}
.constructor-option.selected {
  color: ${T.accent};
  background: ${T.choiceSoft};
  box-shadow: inset 0 0 0 2px ${T.accent}, 0 8px 20px -8px rgba(255,79,40,.28);
  animation: state-pop .35s cubic-bezier(.34,1.3,.5,1) both;
}
.constructor-preview {
  display: grid;
  min-height: 190px;
  place-items: center;
  padding: 14px;
  border-radius: 16px;
  background: ${T.paper};
  box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},.25);
}
.constructor-preview .frac {
  animation: formula-dock .48s cubic-bezier(.22,.9,.3,1);
}
.constructor-preview.is-built {
  animation: result-lock .7s cubic-bezier(.16,1,.3,1);
}

.summary-rule {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 26px;
  min-height: 100px;
  padding: 12px 16px;
  border-radius: 15px;
  background: ${T.paper};
  box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},.14);
}
.summary-stack { gap: 10px; }
.summary-rule .frac-display { font-size: 42px; }
.summary-arrow {
  color: ${T.accent};
  font-size: 30px;
  animation: rule-arrow 2.2s ease-in-out 1s infinite;
}
.summary-lead { max-width: 720px; margin-inline: auto !important; text-align: center; }
.summary-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 8px; }
.summary-item {
  display: grid;
  grid-template-columns: 24px 1fr;
  gap: 7px;
  padding: 10px;
  border-radius: 11px;
  background: ${T.successSoft};
  color: ${T.success};
  font-size: 12px;
  line-height: 1.35;
}
.summary-check {
  display: grid;
  width: 22px;
  height: 22px;
  place-items: center;
  border-radius: 50%;
  color: ${T.paper};
  background: ${T.success};
  animation: check-settle .42s cubic-bezier(.34,1.45,.5,1) backwards;
}
.summary-item:nth-child(2) .summary-check { animation-delay: .08s; }
.summary-item:nth-child(3) .summary-check { animation-delay: .16s; }
.summary-lower { display: grid; grid-template-columns: .58fr 1.42fr; gap: 8px; }
.score-panel {
  display: grid;
  grid-template-columns: auto auto;
  align-items: baseline;
  justify-content: center;
  column-gap: 6px;
  padding: 10px;
  border-radius: 11px;
  background: ${T.blueSoft};
  color: ${T.blue};
}
.score-panel p { grid-column: 1 / -1; text-align: center; }
.score-number {
  font-family: "Source Serif 4", Georgia, serif;
  font-size: 34px;
  font-weight: 700;
  animation: score-settle .65s cubic-bezier(.16,1,.3,1) .34s both;
}
.bridge-card {
  display: grid;
  gap: 5px;
  padding: 10px 12px;
  border-radius: 11px;
  border-left: 4px solid ${T.blue};
  background: ${T.blueSoft};
  box-shadow: 0 7px 18px -9px rgba(1,154,203,.3);
}
.bridge-card .eyebrow { color: ${T.blue}; }

.rational-formula {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  color: ${T.ink};
  font-family: "STIX Two Math", "Cambria Math", Georgia, serif;
  font-size: clamp(21px, 3vw, 30px);
  font-weight: 600;
}
.formula-name { white-space: nowrap; }
.rational-formula .frac .n,
.rational-formula .frac .d {
  border-radius: 7px;
  transition: color .35s ease, background .35s ease, transform .45s cubic-bezier(.16,1,.3,1);
}
.rational-formula.focus-numerator .frac .n {
  color: ${T.accent};
  background: ${T.accentSoft};
  transform: scale(1.07);
}
.rational-formula.focus-denominator .frac .d,
.rational-formula.focus-rule .frac .d,
.rational-formula.focus-build .frac .d {
  color: ${T.accent};
  background: ${T.accentSoft};
  transform: scale(1.07);
}

.theory-screen { gap: 12px; }
.theory-visual {
  position: relative;
  display: flex;
  min-height: 190px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 18px;
  border-radius: 18px;
  background: ${T.paper};
  box-shadow: 0 10px 28px -10px rgba(${T.shadowBase},.20);
}
.theory-visual::after {
  position: absolute;
  inset: auto -20% -48% 38%;
  width: 250px;
  height: 160px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,79,40,.08), transparent 68%);
  content: "";
  pointer-events: none;
}

.boundary-visual { flex-direction: column; gap: 23px; }
.value-route { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
.route-value {
  display: inline-flex;
  min-height: 34px;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 10px;
  color: ${T.ink2};
  background: ${T.bg};
  font-family: "JetBrains Mono", Consolas, monospace;
  font-size: 12px;
  transition: color .35s, background .35s, transform .5s cubic-bezier(.16,1,.3,1);
}
.route-value.checked { color: ${T.success}; background: ${T.successSoft}; }
.route-value.blocked {
  color: ${T.accent};
  background: ${T.accentSoft};
  transform: translateY(-3px) scale(1.06);
  animation: restriction-lock .65s cubic-bezier(.16,1,.3,1);
}

.classify-visual { gap: 12px; }
.concept-card {
  display: grid;
  width: min(270px, 48%);
  min-height: 135px;
  place-items: center;
  gap: 7px;
  padding: 14px;
  border-radius: 15px;
  color: ${T.ink2};
  background: ${T.bg};
  opacity: .58;
  transform: translateY(5px);
  transition: opacity .45s, transform .45s, box-shadow .45s, background .45s;
}
.concept-card p { font-size: 12px; text-align: center; }
.concept-card.confirmed {
  opacity: 1;
  transform: none;
  background: ${T.paper};
  box-shadow: 0 8px 20px -10px rgba(${T.shadowBase},.24);
}
.fraction-concept.confirmed { box-shadow: 0 8px 22px -9px rgba(255,79,40,.28); }
.concept-kicker {
  color: ${T.accent};
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .14em;
}

.anatomy-visual {
  display: grid;
  grid-template-columns: minmax(120px,1fr) auto minmax(120px,1fr);
  gap: 24px;
}
.anatomy-label {
  padding: 8px 11px;
  border-radius: 10px;
  color: ${T.ink3};
  background: ${T.bg};
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .12em;
  text-align: center;
  opacity: .45;
  transition: .4s ease;
}
.anatomy-label.active, .anatomy-label.done {
  color: ${T.accent};
  background: ${T.accentSoft};
  opacity: 1;
  transform: scale(1.04);
}
.anatomy-rule {
  grid-column: 1 / -1;
  justify-self: center;
  padding: 7px 13px;
  border-radius: 99px;
  color: ${T.success};
  background: ${T.successSoft};
  font-family: "STIX Two Math", Georgia, serif;
  font-size: 18px;
  opacity: 0;
  transform: translateY(8px) scale(.96);
}
.anatomy-rule.visible { animation: solution-rise .5s cubic-bezier(.16,1,.3,1) forwards; }

.zero-compare { gap: 18px; }
.zero-case {
  display: grid;
  min-width: 220px;
  min-height: 130px;
  place-items: center;
  gap: 8px;
  padding: 13px;
  border-radius: 15px;
  opacity: .25;
  transform: scale(.96);
  transition: opacity .45s, transform .45s, box-shadow .45s;
}
.zero-case.visible { opacity: 1; transform: none; }
.zero-case.allowed { color: ${T.success}; background: ${T.successSoft}; }
.zero-case.forbidden { color: ${T.accent}; background: ${T.accentSoft}; }
.zero-case p { font-size: 10px; font-weight: 800; letter-spacing: .13em; }
.zero-sign { font-family: "STIX Two Math", Georgia, serif; font-size: 23px; font-weight: 700; }
.zero-divider {
  position: absolute;
  width: 1px;
  height: 70%;
  background: rgba(167,166,162,.25);
  transition: height .4s, background .4s, box-shadow .4s;
}
.zero-divider.locked { height: 82%; background: ${T.accent}; box-shadow: 0 0 12px rgba(255,79,40,.25); }

.worked-example-visual {
  display: grid;
  grid-template-columns: minmax(180px,.82fr) minmax(300px,1.18fr);
  gap: 18px;
}
.worked-example-formula {
  display: grid;
  min-height: 140px;
  place-items: center;
  align-content: center;
  gap: 12px;
  padding: 14px;
  border-radius: 15px;
  background: ${T.bg};
}
.worked-example-stack { display: grid; gap: 7px; }
.worked-example-step {
  display: grid;
  min-height: 43px;
  grid-template-columns: 28px 1fr;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border: 1px solid transparent;
  border-radius: 11px;
  opacity: .24;
  transform: translateX(10px);
  transition: opacity .4s, transform .48s cubic-bezier(.16,1,.3,1), border-color .35s, background .35s;
}
.worked-example-step.revealed { opacity: 1; transform: none; }
.worked-example-step.active { border-color: rgba(255,79,40,.28); background: ${T.accentSoft}; }
.worked-example-step.final.revealed { color: ${T.success}; }
.worked-example-step > span { color: ${T.accent}; font-size: 10px; }
.worked-example-step small {
  display: block;
  margin-top: 2px;
  color: ${T.ink3};
  font-size: 10px;
}

.algorithm-visual { flex-direction: column; gap: 23px; }
.algorithm-chain { display: flex; align-items: center; justify-content: center; gap: 7px; width: 100%; }
.algorithm-step {
  display: flex;
  min-width: 145px;
  min-height: 50px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 9px 11px;
  border-radius: 12px;
  color: ${T.ink3};
  background: ${T.bg};
  opacity: .3;
  transform: translateY(7px);
  transition: .45s cubic-bezier(.16,1,.3,1);
}
.algorithm-step > span { color: ${T.ink3}; font-size: 10px; }
.algorithm-step.revealed { color: ${T.ink}; opacity: 1; transform: none; }
.algorithm-step.active {
  color: ${T.accent};
  background: ${T.accentSoft};
  box-shadow: 0 8px 22px -10px rgba(255,79,40,.30);
}
.chain-arrow { color: ${T.ink3}; opacity: .18; transform: translateX(-5px); transition: .4s; }
.chain-arrow.visible { color: ${T.success}; opacity: 1; transform: none; }

.general-rule-visual { gap: 22px; flex-wrap: wrap; }
.rule-implication { color: ${T.accent}; font-size: 30px; opacity: .2; transition: .4s; }
.rule-implication.visible { opacity: 1; animation: rule-arrow 1.8s ease-in-out infinite; }
.tone-success { color: ${T.success}; }
.rule-stamp {
  width: 100%;
  color: ${T.ink3};
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .13em;
  text-align: center;
  opacity: 0;
  transform: translateY(7px);
}
.rule-stamp.visible { animation: solution-rise .5s cubic-bezier(.16,1,.3,1) forwards; }

.narration-rail {
  display: grid;
  grid-template-columns: repeat(3,minmax(0,1fr));
  gap: 7px;
}
.narration-node {
  display: grid;
  grid-template-columns: 25px 1fr;
  align-items: center;
  gap: 7px;
  min-height: 52px;
  padding: 8px;
  border-radius: 11px;
  color: ${T.ink3};
  background: rgba(167,166,162,.08);
  font-size: 10px;
  line-height: 1.28;
  opacity: .5;
  transition: .35s;
}
.narration-node > span {
  display: grid;
  width: 23px;
  height: 23px;
  place-items: center;
  border-radius: 7px;
  background: rgba(167,166,162,.18);
  font-size: 10px;
}
.narration-node.done { color: ${T.success}; background: ${T.successSoft}; opacity: .88; }
.narration-node.done > span { color: ${T.paper}; background: ${T.success}; }
.narration-node.active {
  color: ${T.accent};
  background: ${T.choiceSoft};
  box-shadow: inset 0 0 0 1px ${T.choiceRing};
  opacity: 1;
}
.narration-node.active > span {
  color: ${T.paper};
  background: ${T.accent};
  animation: active-step 1.8s ease-in-out infinite;
}
.theory-copy { min-height: 48px; }
.theory-copy p {
  display: none;
  grid-template-columns: 30px 1fr;
  align-items: start;
  gap: 9px;
  color: ${T.ink2};
  font-size: 13px;
  line-height: 1.45;
}
.theory-copy p.active {
  display: grid;
  animation: explanation-copy-in .42s ease both;
}
.theory-copy p > span { color: ${T.accent}; font-size: 10px; padding-top: 3px; }

.guided-example { gap: 10px; }
.example-formula { min-height: 82px; }
.guided-chain { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 8px; }
.guided-step {
  display: grid;
  min-height: 120px;
  align-content: start;
  gap: 7px;
  padding: 13px;
  border-radius: 13px;
  color: ${T.ink3};
  background: rgba(167,166,162,.08);
  opacity: .25;
  transform: translateY(8px);
  transition: .45s cubic-bezier(.16,1,.3,1);
}
.guided-step.revealed { color: ${T.ink}; background: ${T.paper}; opacity: 1; transform: none; box-shadow: 0 7px 18px -9px rgba(${T.shadowBase},.20); }
.guided-step.active { color: ${T.accent}; background: ${T.choiceSoft}; box-shadow: inset 0 0 0 1px ${T.choiceRing}, 0 8px 20px -10px rgba(255,79,40,.28); }
.guided-index { color: ${T.accent}; font-size: 10px; }
.guided-step p { color: ${T.ink2}; font-size: 11px; line-height: 1.35; }
.example-conclusion {
  display: flex;
  width: fit-content;
  align-items: center;
  justify-self: center;
  gap: 10px;
  padding: 9px 16px;
  border-radius: 99px;
  color: ${T.success};
  background: ${T.successSoft};
  opacity: 0;
  transform: translateY(8px) scale(.96);
}
.example-conclusion.visible { animation: solution-rise .55s cubic-bezier(.16,1,.3,1) forwards; }

.practice-series { gap: 10px; }
.practice-progress {
  display: grid;
  grid-template-columns: repeat(6,minmax(0,1fr));
  gap: 6px;
}
.practice-progress-step {
  display: flex;
  min-height: 31px;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border-radius: 9px;
  color: ${T.ink3};
  background: rgba(167,166,162,.10);
  font-family: "JetBrains Mono", Consolas, monospace;
  font-size: 10px;
}
.practice-progress-step small { font-family: Manrope, Inter, sans-serif; font-size: 8px; }
.practice-progress-step.active {
  color: ${T.paper};
  background: ${T.accent};
  box-shadow: 0 6px 15px -7px rgba(255,79,40,.55);
  animation: active-step 1.8s ease-in-out infinite;
}
.practice-progress-step.done { color: ${T.paper}; background: ${T.success}; animation: check-settle .35s ease both; }
.practice-question {
  display: grid;
  gap: 10px;
  animation: question-enter .46s cubic-bezier(.16,1,.3,1) both;
}
.practice-question-head {
  display: grid;
  grid-template-columns: 54px 1fr;
  align-items: start;
  gap: 10px;
}
.practice-count {
  padding-top: 4px;
  color: ${T.accent};
  font-size: 10px;
  font-weight: 800;
}
.practice-question-head h2 {
  font-family: "Source Serif 4", Georgia, serif;
  font-size: clamp(18px, 2.6vw, 23px);
  line-height: 1.18;
  font-weight: 600;
}
.practice-visual {
  position: relative;
  display: grid;
  min-height: 104px;
  place-items: center;
  overflow: hidden;
  padding: 13px 18px 28px;
  border-radius: 15px;
  background: ${T.paper};
  box-shadow: 0 8px 22px -8px rgba(${T.shadowBase},.17);
  transition: background .45s, box-shadow .45s;
}
.practice-visual.solved { background: linear-gradient(135deg, ${T.paper}, ${T.successSoft}); box-shadow: 0 8px 22px -8px rgba(31,122,77,.25); }
.visual-scan {
  position: absolute;
  top: 13px;
  bottom: 27px;
  left: -20%;
  width: 25%;
  background: linear-gradient(90deg, transparent, rgba(255,79,40,.10), transparent);
  transform: skewX(-14deg);
  animation: visual-scan 2.6s ease-in-out infinite;
}
.practice-visual.solved .visual-scan { background: linear-gradient(90deg, transparent, rgba(31,122,77,.13), transparent); animation-duration: 1.15s; }
.visual-caption {
  position: absolute;
  right: 10px;
  bottom: 7px;
  color: ${T.ink3};
  font-size: 9px;
  letter-spacing: .04em;
}
.answer-wait {
  display: flex;
  min-height: 42px;
  align-items: center;
  justify-content: center;
  gap: 9px;
  color: ${T.ink2};
  font-size: 12px;
}
.answer-wait-pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${T.accent};
  animation: wait-pulse 1.2s ease-in-out infinite;
}
.practice-options {
  display: grid;
  grid-template-columns: repeat(2,minmax(0,1fr));
  gap: 8px;
}
.practice-options .option:last-child:nth-child(odd) { grid-column: 1 / -1; }
.practice-input {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.practice-input .answer-input { min-height: 48px; width: 170px; font-size: 22px; }
.practice-hint { padding: 11px 14px; }
.solution-frame {
  display: grid;
  gap: 9px;
  padding: 13px 15px;
  border-radius: 15px;
  border-left: 4px solid ${T.success};
  background: ${T.successSoft};
  box-shadow: 0 8px 22px -9px rgba(31,122,77,.25);
}
.solution-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.solution-label {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: ${T.success};
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .12em;
}
.solution-label > span {
  display: grid;
  width: 20px;
  height: 20px;
  place-items: center;
  border-radius: 50%;
  color: ${T.paper};
  background: ${T.success};
}
.solution-status { color: ${T.success}; font-size: 10px; }
.solution-flow { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 7px; }
.solution-step {
  display: grid;
  grid-template-columns: 23px 1fr;
  gap: 6px;
  min-height: 54px;
  align-items: center;
  padding: 8px;
  border-radius: 10px;
  color: rgba(31,122,77,.34);
  background: rgba(255,255,255,.42);
  opacity: .35;
  transform: translateY(6px);
  transition: .4s cubic-bezier(.16,1,.3,1);
}
.solution-step > span { font-size: 9px; }
.solution-step p { font-size: 11px; line-height: 1.3; }
.solution-step.revealed { color: ${T.ink2}; background: rgba(255,255,255,.78); opacity: 1; transform: none; }
.solution-step.active { color: ${T.success}; box-shadow: inset 0 0 0 1px rgba(31,122,77,.20); animation: solution-step-focus 1.5s ease-in-out infinite; }
.solution-action { display: flex; justify-content: flex-end; }
.solution-action .btn-white-accent { min-height: 38px; padding: 7px 12px; font-size: 11px; display: inline-flex; align-items: center; gap: 7px; }
.practice-complete {
  display: grid;
  min-height: 320px;
  place-items: center;
  align-content: center;
  gap: 11px;
  padding: 24px;
  border-radius: 18px;
  background: ${T.paper};
  box-shadow: 0 10px 28px -10px rgba(${T.shadowBase},.20);
  text-align: center;
}
.complete-mark {
  display: grid;
  width: 58px;
  height: 58px;
  place-items: center;
  border-radius: 50%;
  color: ${T.paper};
  background: ${T.success};
  font-size: 25px;
  animation: check-settle .6s cubic-bezier(.16,1,.3,1) both;
}
.practice-complete h2 { font-family: "Source Serif 4", Georgia, serif; font-size: 25px; }
.practice-complete p { max-width: 520px; color: ${T.ink2}; font-size: 13px; line-height: 1.45; }
.complete-stats { display: grid; gap: 2px; color: ${T.success}; }
.complete-stats > span { font-size: 20px; font-weight: 700; }
.complete-stats small { font-size: 10px; }

.final-summary { gap: 11px; }
.final-rule-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 8px; }
.final-rule-card {
  display: grid;
  grid-template-columns: 28px 1fr;
  align-items: center;
  gap: 8px;
  min-height: 58px;
  padding: 10px;
  border-radius: 11px;
  background: ${T.paper};
  box-shadow: 0 6px 16px -8px rgba(${T.shadowBase},.16);
  font-size: 11px;
}
.final-rule-card > span {
  display: grid;
  width: 25px;
  height: 25px;
  place-items: center;
  border-radius: 8px;
  color: ${T.paper};
  background: ${T.accent};
  font-family: "JetBrains Mono", Consolas, monospace;
}
.zero-memory { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.zero-memory > div {
  display: flex;
  min-height: 64px;
  align-items: center;
  justify-content: center;
  gap: 14px;
  border-radius: 11px;
  font-family: "STIX Two Math", Georgia, serif;
  font-size: 18px;
}
.zero-memory .allowed { color: ${T.success}; background: ${T.successSoft}; }
.zero-memory .forbidden { color: ${T.accent}; background: ${T.accentSoft}; }
.summary-score {
  display: grid;
  grid-template-columns: auto auto;
  align-items: baseline;
  justify-content: center;
  gap: 5px;
  padding: 8px;
  border-radius: 11px;
  color: ${T.success};
  background: ${T.successSoft};
}
.summary-score p { grid-column: 1 / -1; font-size: 10px; }

@keyframes restriction-lock {
  0% { transform: translateY(0) scale(.96); }
  55% { transform: translateY(-5px) scale(1.1); }
  100% { transform: translateY(-3px) scale(1.06); }
}
@keyframes solution-rise {
  from { opacity: 0; transform: translateY(8px) scale(.96); }
  to { opacity: 1; transform: none; }
}
@keyframes explanation-copy-in {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: none; }
}
@keyframes question-enter {
  from { opacity: 0; transform: translateX(12px); }
  to { opacity: 1; transform: none; }
}
@keyframes visual-scan {
  0% { left: -25%; opacity: 0; }
  20% { opacity: 1; }
  70%,100% { left: 115%; opacity: 0; }
}
@keyframes wait-pulse {
  0%,100% { transform: scale(.75); opacity: .45; }
  50% { transform: scale(1.25); opacity: 1; box-shadow: 0 0 10px rgba(255,79,40,.35); }
}
@keyframes solution-step-focus {
  0%,100% { box-shadow: inset 0 0 0 1px rgba(31,122,77,.18); }
  50% { box-shadow: inset 0 0 0 1px rgba(31,122,77,.36), 0 0 12px rgba(31,122,77,.12); }
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes ambFloat {
  0%,100% { transform: translate(0,0); }
  33% { transform: translate(8px,-14px); }
  66% { transform: translate(-10px,8px); }
}
@keyframes hookSheen {
  0% { transform: translateX(-110%); }
  55%,100% { transform: translateX(240%); }
}
@keyframes hookGlow {
  0%,100% { box-shadow: inset 0 0 0 0 rgba(255,79,40,0); }
  50% { box-shadow: inset 0 0 26px 2px rgba(255,79,40,.10); }
}
@keyframes odShake {
  0%,100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}
@keyframes optPop {
  0% { transform: scale(.96); }
  55% { transform: scale(1.03); }
  100% { transform: scale(1); }
}
@keyframes state-pop {
  0% { transform: scale(.96); }
  65% { transform: scale(1.025); }
  100% { transform: scale(1); }
}
@keyframes feedback-pop {
  from { opacity: 0; transform: translateY(6px) scale(.98); }
  to { opacity: 1; transform: none; }
}
@keyframes sort-pop {
  from { opacity: 0; transform: translateY(8px) scale(.97); }
  to { opacity: 1; transform: none; }
}
@keyframes active-step {
  0%,100% { box-shadow: 0 0 8px rgba(255,79,40,.40); }
  50% { box-shadow: 0 0 16px rgba(255,79,40,.55); }
}
@keyframes audio-breathe {
  0%,100% { transform: scale(1); opacity: .75; }
  50% { transform: scale(1.12); opacity: 1; }
}
@keyframes formula-dock {
  0% { opacity: 0; transform: translateY(8px) scale(.97); }
  72% { opacity: 1; transform: translateY(0) scale(1.015); }
  100% { opacity: 1; transform: none; }
}
@keyframes card-dock {
  from { opacity: 0; transform: translateY(7px) scale(.985); }
  to { opacity: 1; transform: none; }
}
@keyframes cell-reveal {
  0% { opacity: .35; transform: translateY(-4px) scale(.97); }
  70% { opacity: 1; transform: translateY(0) scale(1.012); }
  100% { opacity: 1; transform: none; }
}
@keyframes critical-lock {
  0% { opacity: .45; transform: scaleY(.94); box-shadow: 0 0 0 rgba(255,79,40,0); }
  65% { opacity: 1; transform: scaleY(1.018); box-shadow: 0 0 14px rgba(255,79,40,.18); }
  100% { opacity: 1; transform: none; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},.14); }
}
@keyframes slot-dock {
  0% { opacity: .25; transform: translateX(-14px) scale(.98); }
  70% { opacity: 1; transform: translateX(0) scale(1.015); }
  100% { opacity: 1; transform: none; }
}
@keyframes rule-lock {
  0% { transform: scale(.975); box-shadow: 0 0 0 rgba(1,154,203,0); }
  64% { transform: scale(1.01); box-shadow: 0 0 20px rgba(1,154,203,.20); }
  100% { transform: none; box-shadow: 0 6px 16px -6px rgba(1,154,203,.22); }
}
@keyframes audit-dock {
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: none; }
}
@keyframes result-lock {
  0% { transform: scale(.98); box-shadow: 0 0 0 rgba(31,122,77,0); }
  62% { transform: scale(1.012); box-shadow: 0 0 20px rgba(31,122,77,.22); }
  100% { transform: none; box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},.25); }
}
@keyframes check-settle {
  0% { opacity: 0; transform: scale(.55) rotate(-10deg); }
  70% { opacity: 1; transform: scale(1.1) rotate(2deg); }
  100% { opacity: 1; transform: none; }
}
@keyframes rule-arrow {
  0%,100% { transform: translateX(0); opacity: .72; }
  50% { transform: translateX(4px); opacity: 1; }
}
@keyframes score-settle {
  0% { opacity: 0; transform: translateY(5px) scale(.82); }
  68% { opacity: 1; transform: translateY(0) scale(1.08); }
  100% { opacity: 1; transform: none; }
}
.fade-up { opacity: 0; animation: fade-in-up .4s ease-out forwards; }
.delay-1 { animation-delay: .12s; }
.delay-2 { animation-delay: .24s; }
.delay-3 { animation-delay: .36s; }
.delay-4 { animation-delay: .48s; }

.chip,
.sort-button,
.reason-button,
.table-action,
.sequence-card,
.sequence-slot,
.term-card,
.constructor-option {
  transition:
    transform .2s ease,
    opacity .28s ease,
    background .2s ease,
    color .2s ease,
    box-shadow .2s ease;
}
.chip:hover:not(:disabled),
.sort-button:hover:not(:disabled),
.reason-button:hover:not(:disabled),
.table-action:hover:not(:disabled),
.sequence-card:hover:not(:disabled),
.term-card:hover:not(:disabled),
.constructor-option:hover:not(:disabled) {
  transform: translateY(-1px);
}

.btn-white-accent:active:not(:disabled),
.btn-ghost:active:not(:disabled),
.option:active:not(:disabled),
.chip:active:not(:disabled),
.sort-button:active:not(:disabled),
.reason-button:active:not(:disabled),
.table-action:active:not(:disabled),
.sequence-card:active:not(:disabled),
.term-card:active:not(:disabled),
.constructor-option:active:not(:disabled) {
  transform: scale(.98);
}

@media (max-width: 720px) {
  .stage-header, .stage-content, .stage-nav {
    padding-left: 24px;
    padding-right: 24px;
  }
  .formula-pair, .option-grid, .hypothesis-grid, .sequence-layout,
  .summary-lower { grid-template-columns: 1fr; }
  .term-grid, .summary-grid { grid-template-columns: 1fr; }
  .constructor { grid-template-columns: 1fr 1fr; }
  .constructor-preview { grid-column: 1 / -1; grid-row: 1; min-height: 135px; }
  .sort-card { grid-template-columns: 1fr; }
  .zero-case { min-width: 180px; }
  .guided-chain { grid-template-columns: repeat(2,minmax(0,1fr)); }
  .solution-flow { grid-template-columns: 1fr; }
  .stage-nav { padding-bottom: max(12px, env(safe-area-inset-bottom)); }
}

@media (max-width: 639.98px) {
  .lesson-root { width: 390px; }
  .stage-header, .stage-content, .stage-nav {
    padding-left: 12px;
    padding-right: 12px;
  }
  .stage-header { padding-top: 58px; padding-bottom: 8px; }
}

@media (max-width: 480px) {
  .stage-content { padding-top: 7px; }
  .screen-heading { margin-bottom: 13px; }
  .screen-stack { gap: 12px; }
  .option-grid { gap: 8px; }
  .option { min-height: 52px; padding: 10px 12px; }
  .sort-actions { grid-template-columns: 1fr; }
  .sort-button { min-height: 42px; }
  .input-row { align-items: stretch; flex-direction: column; }
  .answer-input { width: 100%; }
  .check-button { width: 100%; }
  .constructor { gap: 8px; }
  .constructor-option { padding: 7px 6px; font-size: 13px; }
  .formula-card { min-height: 82px; }
  .formula-hero { min-height: 140px; }
  .theory-visual { min-height: 174px; padding: 13px; }
  .narration-node { grid-template-columns: 1fr; place-items: center; min-height: 39px; padding: 5px; }
  .narration-node p { display: none; }
  .classify-visual { gap: 7px; }
  .concept-card { min-height: 124px; padding: 9px; }
  .anatomy-visual { grid-template-columns: 1fr auto 1fr; gap: 8px; }
  .anatomy-label { padding: 6px 4px; font-size: 8px; }
  .zero-compare { gap: 7px; }
  .zero-case { min-width: 0; width: 48%; min-height: 116px; padding: 8px; }
  .worked-example-visual { grid-template-columns: 104px 1fr; gap: 7px; }
  .worked-example-formula { min-height: 126px; gap: 7px; padding: 7px; }
  .worked-example-formula .formula-name { display: block; margin: 0 0 4px; font-size: 13px; text-align: center; }
  .worked-example-step { min-height: 37px; grid-template-columns: 23px 1fr; gap: 4px; padding: 5px 6px; }
  .worked-example-step small { font-size: 8px; }
  .algorithm-chain { display: grid; grid-template-columns: 1fr; gap: 5px; }
  .algorithm-step { min-width: 0; min-height: 38px; padding: 6px 9px; }
  .chain-arrow { display: none; }
  .guided-chain { grid-template-columns: 1fr 1fr; gap: 6px; }
  .guided-step { min-height: 92px; padding: 9px; }
  .practice-progress-step small { display: none; }
  .practice-question-head { grid-template-columns: 43px 1fr; }
  .practice-visual { min-height: 94px; }
  .practice-options { grid-template-columns: 1fr; }
  .practice-options .option:last-child:nth-child(odd) { grid-column: auto; }
  .practice-input { align-items: stretch; flex-direction: column; }
  .practice-input .answer-input { width: 100%; }
  .practice-input .btn-white-accent { width: 100%; }
  .solution-flow { grid-template-columns: 1fr; }
  .solution-step { min-height: 42px; }
  .solution-action .btn-white-accent { width: 100%; justify-content: center; }
  .final-rule-grid { grid-template-columns: 1fr; }
}

@media (prefers-reduced-motion: reduce) {
  .lesson-root, .lesson-root *, .lesson-root *::before, .lesson-root *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
}
`
