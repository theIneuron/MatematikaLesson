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
  blue: '#019ACB',
  blueSoft: '#EAF6FB',
  shadowBase: '58, 53, 48',
}

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

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false,
  )

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const onResize = () => setIsMobile(window.innerWidth < breakpoint)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [breakpoint])

  return isMobile
}

class AudioEngine {
  constructor() {
    this.queue = []
    this.currentIdx = 0
    this.isPlaying = false
    this.waitingFor = null
    this.onStateChange = null
    this.audioEl = null
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
  }

  playSegment(segment) {
    if (!segment || !segment.text) {
      this.handleEnd(segment)
      return
    }

    const base = ttsConfig.ttsApiBase
    if (!base) {
      this.isPlaying = false
      this.onStateChange?.({ isPlaying: false, currentSegment: null })
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
          this.onStateChange?.({ isPlaying: false, currentSegment: null })
        })
    }
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
    if (this.currentIdx >= this.queue.length) return
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
    if (this.audioEl) {
      try {
        this.audioEl.pause()
        this.audioEl.onended = null
        this.audioEl.onerror = null
      } catch {
        // Audio cleanup is best-effort.
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

const TOTAL_SCREENS = 16

const LESSON_META = {
  lessonId: 'rat-8-01-v1',
  lessonTitle: L(
    'Ratsional ifodalar va ratsional kasrlar',
    'Рациональные выражения и рациональные дроби',
    'Rational expressions and rational fractions',
  ),
}

const SCREEN_META = [
  { id: 's0', type: 'hook', template: 'MCScreen', scored: false, scope: 'hook' },
  { id: 's1', type: 'exploration', template: 'custom', scored: false, scope: null },
  { id: 's2', type: 'exploration', template: 'custom', scored: false, scope: null },
  { id: 's3', type: 'exploration', template: 'custom', scored: false, scope: null },
  { id: 's4', type: 'exploration', template: 'custom', scored: false, scope: null },
  { id: 's5', type: 'test', template: 'MCScreen', scored: true, scope: 'module-mikro' },
  { id: 's6', type: 'exploration', template: 'custom', scored: false, scope: null },
  { id: 's7', type: 'rule', template: 'custom', scored: false, scope: null },
  { id: 's8', type: 'rule', template: 'custom', scored: false, scope: null },
  { id: 's9', type: 'test', template: 'NumInputScreen', scored: true, scope: 'module-mikro' },
  { id: 's10', type: 'test', template: 'MCScreen', scored: true, scope: 'module-mikro' },
  { id: 's11', type: 'test', template: 'MCScreen', scored: true, scope: 'module-mikro' },
  { id: 's12', type: 'exploration', template: 'custom', scored: false, scope: null },
  { id: 's13', type: 'test', template: 'NumInputScreen', scored: true, scope: 'final' },
  { id: 's14', type: 'test', template: 'MCScreen', scored: true, scope: 'final' },
  { id: 's15', type: 'summary', template: 'custom', scored: false, scope: null },
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
    eyebrow: L('TADQIQOT SAVOLI', 'ИССЛЕДОВАТЕЛЬСКИЙ ВОПРОС', 'INVESTIGATION QUESTION'),
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
    eyebrow: L('ASBOBLARNI TEKSHIRISH', 'ПРОВЕРКА ИНСТРУМЕНТОВ', 'SKILLS CHECK'),
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
    eyebrow: L('STRUKTURA TAHLILI', 'АНАЛИЗ СТРУКТУРЫ', 'STRUCTURE ANALYSIS'),
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
    eyebrow: L('SONLI TAJRIBA', 'ЧИСЛОВОЙ ЭКСПЕРИМЕНТ', 'NUMERICAL EXPERIMENT'),
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
    eyebrow: L('MIKROTEKSHIRUV', 'МИКРОПРОВЕРКА', 'MICRO CHECK'),
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
    eyebrow: L('ALGORITM', 'АЛГОРИТМ', 'ALGORITHM'),
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
    eyebrow: L('ANIQ TIL', 'ТОЧНЫЙ ЯЗЫК', 'PRECISE LANGUAGE'),
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
    eyebrow: L('NAMUNA', 'ОБРАЗЕЦ', 'WORKED EXAMPLE'),
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
    eyebrow: L('MIKROTEKSHIRUV', 'МИКРОПРОВЕРКА', 'MICRO CHECK'),
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
    eyebrow: L('MIKROTEKSHIRUV', 'МИКРОПРОВЕРКА', 'MICRO CHECK'),
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
    eyebrow: L('YECHIM AUDITI', 'АУДИТ РЕШЕНИЯ', 'SOLUTION AUDIT'),
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
    eyebrow: L('KONSTRUKTOR', 'КОНСТРУКТОР', 'CONSTRUCTOR'),
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
    eyebrow: L('TADQIQOT XULOSASI', 'ВЫВОД ИССЛЕДОВАНИЯ', 'INVESTIGATION SUMMARY'),
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
      <span className={`audio-pulse ${audio.isPlaying ? 'is-playing' : ''}`} aria-hidden="true" />
      <button
        type="button"
        className="icon-button"
        onClick={audio.toggleMute}
        aria-label={t(audio.muted ? labels.unmute : labels.mute)}
        title={t(audio.muted ? labels.unmute : labels.mute)}
      >
        {audio.muted ? '×' : '◖'}
      </button>
      <button
        type="button"
        className="icon-button"
        onClick={audio.replay}
        aria-label={t(labels.replay)}
        title={t(labels.replay)}
      >
        ↻
      </button>
    </div>
  )
}

function NavBack({ onClick, disabled }) {
  const t = useT()
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
  canNext = true,
  finish = false,
  children,
}) {
  const isMobile = useIsMobile()
  const progress = ((screen + 1) / totalScreens) * 100

  return (
    <main className="stage" style={{ paddingInline: isMobile ? 12 : 100 }}>
      <header className="stage-header">
        <div className="progress-track" aria-hidden="true">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <div className="chrome">
          <div className="chrome-left">
            <span className="dot" />
            <span className="mono lab-label">MATH.LAB 8</span>
            <span className="mono screen-counter">
              {String(screen + 1).padStart(2, '0')} / {String(totalScreens).padStart(2, '0')}
            </span>
          </div>
          <AudioIndicator audio={audio} />
        </div>
      </header>

      <section className="stage-content">
        <div className="screen-heading fade-up">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          {title ? <h1 className="title h-title">{title}</h1> : null}
        </div>
        {children}
      </section>

      <nav className="stage-nav">
        <NavBack onClick={onPrev} disabled={screen === 0} />
        <span className="nav-spacer" />
        <NavNext onClick={onNext} disabled={!canNext} finish={finish} />
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
      canNext={solved}
    >
      <div className="screen-stack">
        {prelude}
        {figure ? <div className="formula-card fade-up delay-1">{figure}</div> : null}
        <p className="body question-text fade-up delay-1">{t(content.question)}</p>
        <div className="option-grid fade-up delay-2">
          {options.map((option, index) => {
            const isCorrect = index === content.correctIndex
            const isWrong = wrongOptions.has(index)
            let className = 'option'
            if (solved && isCorrect) className += ' option-correct'
            else if (isWrong) className += ' option-picked-wrong'
            else if (solved) className += ' option-wrong'

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
      canNext={solved}
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

function Screen0({ screen, totalScreens, onAnswer, onPrev, onNext }) {
  const c = CONTENT.s0
  const lang = useLang()
  const t = useT()
  const [picked, setPicked] = useState(null)
  const audio = useAudio(
    useMemo(
      () => makePromptSegments(c.audio, lang, { type: 'option_picked' }),
      [c.audio, lang],
    ),
  )

  const choose = (index) => {
    setPicked(index)
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
      canNext={picked !== null}
    >
      <div className="screen-stack hook-layout">
        <div className="formula-card formula-hero fade-up delay-1">
          <FormulaK />
          <div className="input-dots" aria-label="0, 2, 3, 4">
            {[0, 2, 3, 4].map((value) => (
              <span className="input-dot mono" key={value}>
                {value}
              </span>
            ))}
          </div>
        </div>
        <p className="body question-text fade-up delay-2">{t(c.question)}</p>
        <div className="option-grid fade-up delay-3">
          {c.options.map((option, index) => (
            <button
              type="button"
              className={`option ${picked === index ? 'option-selected' : ''}`}
              key={index}
              onClick={() => choose(index)}
            >
              <span className="option-index mono">{String.fromCharCode(65 + index)}</span>
              <span>{t(option)}</span>
            </button>
          ))}
        </div>
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
      canNext={completed}
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
          <div className="frame fade-up delay-2">
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
      canNext={solved}
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
                    <span className="sort-code mono">{groupIndex === 0 ? 'A' : 'B'}</span>
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
      canNext={saved}
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
      canNext={completed}
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
                  <tr className={open && row.denominator === 0 ? 'critical-row' : ''} key={row.x}>
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
      canNext={completed}
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
      canNext={completed}
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
                  {isOpen ? renderRationalText(t(term.definition)) : '＋'}
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
      canNext={completed}
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
  const completed = built && part === 1

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
      canNext={completed}
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
          <div className="constructor-preview">
            <Frac
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
      canNext
      finish
    >
      <div className="screen-stack">
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

const SCREENS = [
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
        <div className="ambient-grid" aria-hidden="true" />
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
html, body { margin: 0; padding: 0; }
.lesson-root, .lesson-root * { box-sizing: border-box; }
.lesson-root {
  position: relative;
  isolation: isolate;
  height: 100dvh;
  overflow: hidden;
  color: ${T.ink};
  background: ${T.bg};
  font-family: Manrope, Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  -webkit-font-smoothing: antialiased;
  font-feature-settings: "ss01", "cv11";
}
.lesson-root h1, .lesson-root h2, .lesson-root h3, .lesson-root h4,
.lesson-root p, .lesson-root ul, .lesson-root ol { margin: 0; padding: 0; }
button, input { font: inherit; }
button { -webkit-tap-highlight-color: transparent; }

.ambient-grid {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  opacity: .42;
  background-image:
    linear-gradient(rgba(14, 14, 16, .025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(14, 14, 16, .025) 1px, transparent 1px),
    radial-gradient(circle at 86% 14%, rgba(1,154,203,.12), transparent 24%),
    radial-gradient(circle at 8% 92%, rgba(255,79,40,.10), transparent 26%);
  background-size: 28px 28px, 28px 28px, auto, auto;
}

.stage {
  max-width: 936px;
  height: 100dvh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}
.stage-header {
  flex-shrink: 0;
  padding-top: clamp(12px, 2vw, 18px);
  padding-bottom: clamp(8px, 1.5vw, 12px);
  background: ${T.bg};
}
.stage-content {
  flex: 1;
  min-height: 0;
  padding-top: clamp(10px, 1.7vw, 16px);
  padding-bottom: clamp(18px, 3.4vw, 32px);
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
.stage-nav {
  flex-shrink: 0;
  display: flex;
  gap: 12px;
  padding: 12px 0 15px;
  background: ${T.bg};
  border-top: 1px solid rgba(167,166,162,.25);
}
.nav-spacer { flex: 1; }
.screen-heading { display: grid; gap: 7px; margin-bottom: clamp(16px, 2.8vw, 26px); }
.screen-stack { display: grid; gap: clamp(14px, 2.2vw, 20px); }

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
  box-shadow: 0 0 10px rgba(255,79,40,.55), 0 0 3px rgba(255,79,40,.4);
  transition: width .5s cubic-bezier(.4,0,.2,1);
}
.chrome { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.chrome-left { display: flex; align-items: center; gap: 9px; color: ${T.ink2}; }
.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${T.accent};
  box-shadow: 0 0 8px rgba(255,79,40,.55);
}
.lab-label { font-weight: 700; letter-spacing: .1em; }
.screen-counter { color: ${T.ink3}; }

.title {
  font-family: "Source Serif 4", Georgia, serif;
  font-weight: 600;
  line-height: 1.08;
  letter-spacing: -.012em;
}
.h-title { max-width: 790px; font-size: clamp(25px, 4vw, 39px); }
.body { font-size: clamp(14px, 1.8vw, 16px); line-height: 1.52; }
.small { font-size: clamp(12px, 1.45vw, 13px); line-height: 1.45; }
.eyebrow {
  color: ${T.accent};
  font-size: clamp(10px, 1.25vw, 11px);
  font-weight: 800;
  letter-spacing: .17em;
  text-transform: uppercase;
}
.mono { font-family: "JetBrains Mono", "SFMono-Regular", Consolas, monospace; }
.muted { color: ${T.ink2}; }
.question-text { max-width: 780px; font-weight: 560; }

.formula-card {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: clamp(94px, 16vw, 138px);
  padding: clamp(15px, 3vw, 26px);
  overflow: hidden;
  border: none;
  border-radius: 18px;
  background:
    linear-gradient(135deg, rgba(255,255,255,.98), rgba(255,255,255,.84)),
    ${T.paper};
  box-shadow:
    0 14px 34px -16px rgba(${T.shadowBase},.32),
    inset 0 0 0 1px rgba(14,14,16,.035);
}
.formula-hero { flex-direction: column; gap: 22px; min-height: clamp(170px, 28vw, 240px); }
.formula, .inline-math, .mini-formula {
  color: ${T.ink};
  font-family: "STIX Two Math", "Cambria Math", Georgia, serif;
  font-size: clamp(25px, 5vw, 43px);
  font-weight: 560;
  line-height: 1.15;
}
.formula.compact { font-size: clamp(18px, 3.2vw, 27px); }
.mini-formula { margin: 12px 0; text-align: center; }
.inline-math { font-size: clamp(17px, 2.6vw, 23px); }
.mop { display: inline-block; font-family: "STIX Two Math", "Cambria Math", Georgia, serif; }
.mop-big { font-size: clamp(28px, 5vw, 43px); }
.mop-mid { font-size: clamp(20px, 3.7vw, 31px); }
.mop-sm { font-size: clamp(15px, 2.3vw, 19px); }
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
.frac-display { font-size: clamp(35px, 7vw, 62px); }
.frac-mid { font-size: clamp(27px, 5vw, 43px); }
.frac-sm { font-size: clamp(17px, 3vw, 25px); }
.formula-pair { width: 100%; display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 12px; }
.formula-pair > * {
  display: flex;
  min-height: 74px;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border-radius: 13px;
  background: rgba(246,244,239,.72);
}
.input-dots { display: flex; gap: 10px; }
.input-dot {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border-radius: 50%;
  background: ${T.blueSoft};
  color: ${T.blue};
  box-shadow: 0 6px 16px -8px rgba(1,154,203,.45);
}

.frame {
  padding: clamp(17px, 3.4vw, 29px);
  border: none;
  border-radius: 16px;
  background: ${T.paper};
  box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},.14);
}
.frame-success, .frame-tip, .frame-soft {
  padding: clamp(14px, 2.5vw, 20px);
  border-radius: 12px;
}
.frame-success {
  border-left: 4px solid ${T.success};
  background: ${T.successSoft};
  box-shadow: 0 6px 16px -6px rgba(31,122,77,.22);
}
.frame-tip {
  border-left: 4px solid #D8A93A;
  background: #FBF3D6;
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
.feedback-label.is-hint { color: #9A741A; }

.btn, .btn-white-accent, .btn-ghost {
  min-height: 44px;
  padding: 10px 17px;
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
.btn-white-accent:disabled, .btn-ghost:disabled { cursor: not-allowed; opacity: .42; box-shadow: none; }
.nav-button { display: inline-flex; align-items: center; gap: 8px; }
.check-button { min-width: 130px; }
.action-row { display: flex; justify-content: flex-end; }

.option-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 10px; }
.option {
  display: flex;
  min-height: 58px;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 15px;
  border: none;
  border-radius: 12px;
  color: ${T.ink};
  background: ${T.paper};
  box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},.14);
  cursor: pointer;
  text-align: left;
  transition: transform .2s, background .2s, color .2s, box-shadow .2s, opacity .2s;
}
.option:hover:not(:disabled) { transform: translateY(-1px); background: #FDFBF7; box-shadow: 0 10px 22px -6px rgba(${T.shadowBase},.22); }
.option:disabled { cursor: default; }
.option-index {
  display: grid;
  flex: 0 0 27px;
  width: 27px;
  height: 27px;
  place-items: center;
  border-radius: 8px;
  color: ${T.ink3};
  background: rgba(167,166,162,.11);
  font-size: 12px;
}
.option-selected { background: ${T.blueSoft}; box-shadow: 0 8px 22px -6px rgba(1,154,203,.3); }
.option-correct { color: ${T.success}; background: ${T.successSoft}; box-shadow: 0 8px 22px -6px rgba(31,122,77,.32); }
.option-correct .option-index { color: white; background: ${T.success}; }
.option-picked-wrong { color: ${T.accent}; background: ${T.accentSoft}; box-shadow: 0 8px 22px -6px rgba(255,79,40,.36); }
.option-picked-wrong .option-index { color: white; background: ${T.accent}; }
.option-wrong { color: ${T.ink3}; opacity: .55; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},.08); }

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
.answer-input.wrong { color: ${T.accent}; background: ${T.accentSoft}; box-shadow: 0 8px 20px -6px rgba(255,79,40,.36); }
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

.audio-tools { display: flex; align-items: center; gap: 6px; }
.audio-pulse {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${T.ink3};
}
.audio-pulse.is-playing { background: ${T.blue}; box-shadow: 0 0 0 5px rgba(1,154,203,.13); animation: pulse 1.2s ease-in-out infinite; }
.icon-button {
  display: grid;
  width: 31px;
  height: 31px;
  place-items: center;
  border: none;
  border-radius: 9px;
  color: ${T.ink2};
  background: rgba(255,255,255,.72);
  box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},.25);
  cursor: pointer;
}

.step-rail { display: flex; align-items: center; justify-content: center; gap: 10px; }
.step-node {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border-radius: 50%;
  color: ${T.ink3};
  background: rgba(167,166,162,.14);
  font-family: "JetBrains Mono", monospace;
  font-size: 12px;
}
.step-node.active { color: white; background: ${T.accent}; box-shadow: 0 0 12px rgba(255,79,40,.45); }
.step-node.done { color: white; background: ${T.success}; }
.choice-chips { display: flex; flex-wrap: wrap; gap: 9px; margin-top: 14px; }
.chip {
  min-height: 42px;
  padding: 8px 13px;
  border: none;
  border-radius: 10px;
  color: ${T.ink};
  background: ${T.paper};
  box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},.2);
  cursor: pointer;
}
.chip.selected { color: ${T.blue}; background: ${T.blueSoft}; box-shadow: 0 6px 18px -6px rgba(1,154,203,.4); }
.chip.correct-chip { color: ${T.success}; background: ${T.successSoft}; }
.chip.wrong-chip { color: ${T.accent}; background: ${T.accentSoft}; }
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
  box-shadow: 0 7px 18px -8px rgba(${T.shadowBase},.2);
}
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
  background: rgba(246,244,239,.85);
  cursor: pointer;
  text-align: left;
}
.sort-button.selected { color: ${T.blue}; background: ${T.blueSoft}; box-shadow: inset 0 0 0 1px rgba(1,154,203,.12); }
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
  background: rgba(246,244,239,.8);
  cursor: pointer;
  text-align: left;
}
.reason-button.selected { color: ${T.blue}; background: ${T.blueSoft}; }

.data-table-wrap { overflow-x: auto; padding: 2px 2px 10px; }
.data-table { width: 100%; min-width: 620px; border-collapse: separate; border-spacing: 0 8px; }
.data-table th { padding: 6px 10px; color: ${T.ink3}; font-size: 11px; letter-spacing: .08em; text-transform: uppercase; text-align: left; }
.data-table td { padding: 11px 10px; background: ${T.paper}; box-shadow: 0 6px 16px -9px rgba(${T.shadowBase},.2); }
.data-table td:first-child { border-radius: 11px 0 0 11px; }
.data-table td:last-child { border-radius: 0 11px 11px 0; }
.data-table .critical-row td { color: ${T.accent}; background: ${T.accentSoft}; }
.table-action {
  min-height: 34px;
  padding: 6px 10px;
  border: none;
  border-radius: 9px;
  color: ${T.accent};
  background: white;
  box-shadow: 0 5px 13px -7px rgba(255,79,40,.4);
  cursor: pointer;
}
.table-action.done { color: ${T.success}; background: transparent; box-shadow: none; }

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
.sequence-card { color: ${T.ink}; background: ${T.paper}; box-shadow: 0 6px 16px -7px rgba(${T.shadowBase},.2); cursor: pointer; }
.sequence-card.used { opacity: .32; box-shadow: none; }
.sequence-code { color: ${T.accent}; font-size: 11px; }
.sequence-slot { color: ${T.ink3}; background: rgba(167,166,162,.08); box-shadow: inset 0 0 0 1px rgba(167,166,162,.16); }
.sequence-slot.filled { color: ${T.success}; background: ${T.successSoft}; box-shadow: none; }

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
}
.term-card.open { box-shadow: 0 11px 28px -10px rgba(1,154,203,.3); }
.term-index { color: ${T.blue}; font-size: 11px; }
.term-definition { color: ${T.ink2}; font-size: 13px; line-height: 1.45; }
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
.central-rule.visible { opacity: 1; box-shadow: 0 10px 28px -12px rgba(1,154,203,.34); }
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
  box-shadow: 0 7px 18px -9px rgba(${T.shadowBase},.2);
}
.worked-index { color: ${T.blue}; font-size: 12px; }

.audit-list { display: grid; gap: 8px; }
.audit-step {
  display: grid;
  grid-template-columns: 38px 1fr;
  gap: 10px;
  padding: 11px 13px;
  border-radius: 11px;
  color: ${T.ink2};
  background: rgba(255,255,255,.72);
  box-shadow: 0 5px 14px -9px rgba(${T.shadowBase},.2);
}
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
  box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},.2);
  cursor: pointer;
}
.constructor-option.selected { color: ${T.blue}; background: ${T.blueSoft}; }
.constructor-preview {
  display: grid;
  min-height: 190px;
  place-items: center;
  padding: 14px;
  border-radius: 16px;
  background: ${T.paper};
  box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},.25);
}

.summary-rule {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(16px,4vw,38px);
  min-height: 142px;
  padding: 18px;
  border-radius: 18px;
  background: ${T.paper};
  box-shadow: 0 14px 34px -15px rgba(${T.shadowBase},.3);
}
.summary-arrow { color: ${T.accent}; font-size: clamp(24px,4vw,38px); }
.summary-lead { max-width: 720px; margin-inline: auto !important; text-align: center; }
.summary-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 10px; }
.summary-item {
  display: grid;
  grid-template-columns: 28px 1fr;
  gap: 9px;
  padding: 14px;
  border-radius: 13px;
  background: ${T.successSoft};
  color: ${T.success};
  font-size: 13px;
  line-height: 1.42;
}
.summary-check { display: grid; width: 25px; height: 25px; place-items: center; border-radius: 50%; color: white; background: ${T.success}; }
.summary-lower { display: grid; grid-template-columns: .7fr 1.3fr; gap: 10px; }
.score-panel {
  display: grid;
  grid-template-columns: auto auto;
  align-items: baseline;
  justify-content: center;
  column-gap: 6px;
  padding: 15px;
  border-radius: 13px;
  background: ${T.blueSoft};
  color: ${T.blue};
}
.score-panel p { grid-column: 1 / -1; text-align: center; }
.score-number { font-family: "Source Serif 4", Georgia, serif; font-size: 46px; font-weight: 700; }
.bridge-card {
  display: grid;
  gap: 7px;
  padding: 15px;
  border-radius: 13px;
  border-left: 4px solid ${T.blue};
  background: ${T.blueSoft};
  box-shadow: 0 7px 18px -9px rgba(1,154,203,.3);
}
.bridge-card .eyebrow { color: ${T.blue}; }

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(11px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes pulse {
  0%,100% { transform: scale(.9); opacity: .75; }
  50% { transform: scale(1.15); opacity: 1; }
}
.fade-up { opacity: 0; animation: fade-in-up .42s ease-out forwards; }
.delay-1 { animation-delay: .1s; }
.delay-2 { animation-delay: .2s; }
.delay-3 { animation-delay: .3s; }
.delay-4 { animation-delay: .4s; }

@media (max-width: 720px) {
  .formula-pair, .option-grid, .hypothesis-grid, .sequence-layout,
  .summary-lower { grid-template-columns: 1fr; }
  .term-grid, .summary-grid { grid-template-columns: 1fr; }
  .constructor { grid-template-columns: 1fr 1fr; }
  .constructor-preview { grid-column: 1 / -1; grid-row: 1; min-height: 135px; }
  .sort-card { grid-template-columns: 1fr; }
  .stage-nav { padding-bottom: max(12px, env(safe-area-inset-bottom)); }
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
  .formula-hero { min-height: 160px; }
  .lab-label { display: none; }
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
