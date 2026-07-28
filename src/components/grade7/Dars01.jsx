import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Lightbulb,
  Pause,
  Play,
  RotateCcw,
  Target,
  Trophy,
  Volume2,
  VolumeX,
  XCircle,
} from 'lucide-react'
import './Dars01.css'

const T = (ru, uz) => ({ ru, uz })
const textOf = (value, lang) => (typeof value === 'string' ? value : value?.[lang] ?? '')

const SLIDES = [
  {
    phase: 'explain',
    title: T('Попробуйте решить', "Yechishga urinib ko'ring"),
    kicker: T('Интеллектуальный вызов', 'Aqliy sinov'),
    audio: T(
      'Перед вами одно выражение и несколько действий. Пока не ищите готовое правило. Попробуйте самостоятельно определить, с чего начать, и найдите значение выражения. Ответ сейчас не оценивается — это ваша первая гипотеза.',
      "Oldingizda bitta ifoda va bir nechta amal bor. Hozircha tayyor qoidani izlamang. Qaysi amaldan boshlash kerakligini o'zingiz aniqlab, ifodaning qiymatini topishga harakat qiling. Bu javob baholanmaydi — bu sizning dastlabki taxminingiz.",
    ),
  },
  {
    phase: 'explain',
    title: T('Увидеть структуру', "Tuzilmani ko'ramiz"),
    kicker: T('Разбираем выражение', 'Ifodani tahlil qilamiz'),
    audio: T(
      'Длинное выражение удобнее читать по частям. Сначала найдите самые внутренние скобки. Они защищают действие, которое должно быть выполнено раньше внешних действий.',
      "Uzun ifodani qismlarga ajratib o'qish qulay. Avval eng ichki qavslarni toping. Ular tashqi amallardan oldin bajarilishi kerak bo'lgan amalni ajratib turadi.",
    ),
  },
  {
    phase: 'explain',
    title: T('Начинаем со скобок', 'Qavslardan boshlaymiz'),
    kicker: T('Первый уровень', 'Birinchi bosqich'),
    audio: T(
      'Сначала вычисляем действия в самых внутренних скобках. Семь минус четыре равно трём. Пятнадцать минус девять равно шести. Остальные части выражения пока не меняются.',
      "Avval eng ichki qavslardagi amallarni hisoblaymiz. Yettidan to'rtni ayirsak uch bo'ladi. O'n beshdan to'qqizni ayirsak olti bo'ladi. Ifodaning qolgan qismlari hozircha o'zgarmaydi.",
    ),
  },
  {
    phase: 'explain',
    title: T('Закрываем квадратные скобки', 'Kvadrat qavsni yakunlaymiz'),
    kicker: T('Внешняя группировка', 'Tashqi guruhlash'),
    audio: T(
      'Круглые скобки уже раскрыты, но квадратные скобки ещё образуют единую часть. Два умножить на три равно шести. Поэтому весь делитель можно заменить числом шесть.',
      "Dumaloq qavslar hisoblandi, lekin kvadrat qavs hali bitta yaxlit qism. Ikki karra uch olti bo'ladi. Shuning uchun butun bo'luvchini olti soni bilan almashtirish mumkin.",
    ),
  },
  {
    phase: 'explain',
    title: T('Действия второго уровня', 'Ikkinchi darajadagi amallar'),
    kicker: T('Умножение и деление', "Ko'paytirish va bo'lish"),
    audio: T(
      'Скобок больше нет. Теперь выполняем действия второго уровня. Восемьдесят четыре делим на шесть и получаем четырнадцать. Три умножаем на шесть и получаем восемнадцать. Эти независимые ветви можно вычислить параллельно.',
      "Endi qavslar qolmadi. Ikkinchi darajadagi amallarni bajaramiz. Sakson to'rtni oltiga bo'lib o'n to'rtni, uchni oltiga ko'paytirib o'n sakkizni olamiz. Mustaqil tarmoqlarni parallel hisoblash mumkin.",
    ),
  },
  {
    phase: 'explain',
    title: T('Приоритет важнее позиции', 'Ustuvorlik joylashuvdan muhim'),
    kicker: T('Почему не просто слева направо', "Nega faqat chapdan o'ngga emas"),
    audio: T(
      'Нельзя начинать с вычитания сто двадцать минус восемьдесят четыре только потому, что оно стоит слева. Сначала выбираем уровень действий, и лишь среди действий одного уровня двигаемся слева направо.',
      "Faqat chapda turgani uchun yuz yigirmadan sakson to'rtni ayirishdan boshlash mumkin emas. Avval amallar darajasini tanlaymiz, faqat bir daraja ichida chapdan o'ngga yuramiz.",
    ),
  },
  {
    phase: 'explain',
    title: T('Последняя строка', 'Oxirgi qator'),
    kicker: T('Слева направо', "Chapdan o'ngga"),
    audio: T(
      'Сложение и вычитание имеют одинаковый приоритет. Поэтому выполняем их слева направо. Сначала сто двадцать минус четырнадцать, затем прибавляем восемнадцать.',
      "Qo'shish va ayirishning ustuvorligi bir xil. Shuning uchun ularni chapdan o'ngga bajaramiz. Avval yuz yigirmadan o'n to'rtni ayiramiz, keyin o'n sakkizni qo'shamiz.",
    ),
  },
  {
    phase: 'explain',
    title: T('Собираем метод', "Usulni umumlashtiramiz"),
    kicker: T('Правило, два способа и проверка', 'Qoida, ikki usul va tekshiruv'),
    audio: T(
      'Решение можно записывать последовательными строками или сначала составить нумерованный план действий. В обоих случаях правило одно: скобки, затем умножение и деление, после них сложение и вычитание. Ответ проверяем обратным действием и приблизительной оценкой.',
      "Yechimni ketma-ket qatorlar bilan yozish yoki avval raqamlangan amallar rejasini tuzish mumkin. Har ikki usulda qoida bir xil: qavslar, ko'paytirish va bo'lish, keyin qo'shish va ayirish. Javob teskari amal va taxminiy baholash bilan tekshiriladi.",
    ),
  },
  {
    phase: 'practice',
    title: T('Решаем вместе', 'Birgalikda yechamiz'),
    kicker: T('Сильная опора', 'Kuchli tayanch'),
    audio: T(
      'Теперь применим тот же порядок к похожему выражению. На каждом шаге выбирайте только ту часть, которую можно вычислить сейчас.',
      "Endi xuddi shu tartibni o'xshash ifodaga qo'llaymiz. Har bir qadamda ayni paytda hisoblash mumkin bo'lgan qismnigina tanlang.",
    ),
  },
  {
    phase: 'practice',
    title: T('Опоры меньше', 'Tayanch kamayadi'),
    kicker: T('Четыре шага', "To'rt qadam"),
    audio: T(
      'В этом выражении цветовых подсказок меньше. Сохраняйте структуру: скобки, умножение и деление, затем сложение и вычитание.',
      "Bu ifodada rangli ko'rsatmalar kamroq. Tuzilmani saqlang: qavslar, ko'paytirish va bo'lish, keyin qo'shish va ayirish.",
    ),
  },
  {
    phase: 'practice',
    title: T('Теперь самостоятельно', 'Endi mustaqil'),
    kicker: T('Типовой перенос', "Odatdagi yangi misol"),
    audio: T(
      'Решите выражение самостоятельно. Можно пользоваться черновиком, но готовых шагов на экране больше нет.',
      "Ifodani mustaqil yeching. Qoralamadan foydalanishingiz mumkin, lekin ekranda tayyor qadamlar endi yo'q.",
    ),
  },
  {
    phase: 'practice',
    title: T('Ловушка приоритетов', 'Ustuvorlik tuzog‘i'),
    kicker: T('Одинаковый уровень', 'Bir xil daraja'),
    audio: T(
      'Умножение и деление имеют одинаковый приоритет. Мы не выбираем умножение только потому, что видим его знак. При одинаковом приоритете двигаемся слева направо.',
      "Ko'paytirish va bo'lishning ustuvorligi bir xil. Faqat ko'paytirish belgisini ko'rganimiz uchun uni birinchi tanlamaymiz. Ustuvorlik bir xil bo'lsa, chapdan o'ngga yuramiz.",
    ),
  },
  {
    phase: 'practice',
    title: T('Где ошибка?', 'Xato qayerda?'),
    kicker: T('Анализ решения', 'Yechimni tahlil qilamiz'),
    audio: T(
      'Проверяйте решение по переходам. Каждый новый ряд должен изменять только ту часть выражения, которую разрешает порядок действий.',
      "Yechimni qatorlar orasidagi o'tishlar bo'yicha tekshiring. Har bir yangi qatorda faqat amallar tartibi ruxsat bergan qism o'zgarishi kerak.",
    ),
  },
  {
    phase: 'practice',
    title: T('Управляем порядком', 'Tartibni boshqaramiz'),
    kicker: T('Скобки меняют структуру', "Qavslar tuzilmani o'zgartiradi"),
    audio: T(
      'Расставьте одну пару скобок так, чтобы значение выражения стало равно девяти. Сначала определите, какую часть выгодно превратить в единый блок.',
      "Ifodaning qiymati to'qqizga teng bo'lishi uchun bir juft qavsni joylashtiring. Avval qaysi qismni bitta blokka aylantirish foydali ekanini aniqlang.",
    ),
  },
  {
    phase: 'practice',
    title: T('Точный спринт', 'Aniq sprint'),
    kicker: T('Точность важнее скорости', "Aniqlik tezlikdan muhim"),
    audio: T(
      'Перед вами четыре коротких выражения. Работайте точно, а не наугад. Таймер можно поставить на паузу.',
      "Oldingizda to'rtta qisqa ifoda bor. Taxmin bilan emas, aniq ishlang. Taymerni to'xtatib turish mumkin.",
    ),
  },
  {
    phase: 'practice',
    title: T('Финальный вызов', 'Yakuniy sinov'),
    kicker: T('Новый пример', 'Yangi misol'),
    audio: T(
      'Решите новое выражение и затем выберите правило, которое объясняет ваш порядок действий. Здесь проверяется и ответ, и стратегия.',
      "Yangi ifodani yeching, so'ng amallar tartibini tushuntiradigan qoidani tanlang. Bu yerda javob ham, strategiya ham tekshiriladi.",
    ),
  },
]

const PHASE_LABELS = {
  explain: T('Разбор', 'Tahlil'),
  practice: T('Практика', 'Mashq'),
}

const PRACTICE_STEPS = {
  8: [
    {
      prompt: T('Вычислите значения в круглых скобках.', 'Dumaloq qavslardagi qiymatlarni hisoblang.'),
      labels: [T('8 − 4', '8 − 4'), T('9 − 7', '9 − 7')],
      expected: [4, 2],
      result: '72 : [3 · 4] + 5 · 2',
    },
    {
      prompt: T('Завершите квадратные скобки.', 'Kvadrat qavsni yakunlang.'),
      labels: [T('3 · 4', '3 · 4')],
      expected: [12],
      result: '72 : 12 + 5 · 2',
    },
    {
      prompt: T('Выполните деление и умножение.', "Bo'lish va ko'paytirishni bajaring."),
      labels: [T('72 : 12', '72 : 12'), T('5 · 2', '5 · 2')],
      expected: [6, 10],
      result: '6 + 10',
    },
    {
      prompt: T('Найдите итоговое значение.', 'Yakuniy qiymatni toping.'),
      labels: [T('6 + 10', '6 + 10')],
      expected: [16],
      result: '16',
    },
  ],
  9: [
    {
      prompt: T('Вычислите значения в круглых скобках.', 'Dumaloq qavslardagi qiymatlarni hisoblang.'),
      labels: [T('9 − 5', '9 − 5'), T('7 − 3', '7 − 3')],
      expected: [4, 4],
      result: '90 − 48 : [2 · 4] + 4 · 4',
    },
    {
      prompt: T('Завершите квадратные скобки.', 'Kvadrat qavsni yakunlang.'),
      labels: [T('2 · 4', '2 · 4')],
      expected: [8],
      result: '90 − 48 : 8 + 4 · 4',
    },
    {
      prompt: T('Выполните деление и умножение.', "Bo'lish va ko'paytirishni bajaring."),
      labels: [T('48 : 8', '48 : 8'), T('4 · 4', '4 · 4')],
      expected: [6, 16],
      result: '90 − 6 + 16',
    },
    {
      prompt: T('Найдите итоговое значение.', 'Yakuniy qiymatni toping.'),
      labels: [T('90 − 6 + 16', '90 − 6 + 16')],
      expected: [100],
      result: '100',
    },
  ],
}

const SPRINT_ITEMS = [
  { expression: '30 − 12 : 3', answer: 26, hint: T('Сначала выполните 12 : 3.', 'Avval 12 : 3 ni bajaring.') },
  { expression: '(18 − 6) : 3', answer: 4, hint: T('Начните с выражения в скобках.', 'Qavs ichidagi ifodadan boshlang.') },
  { expression: '8 + 4 · 5', answer: 28, hint: T('Умножение выполняется до сложения.', "Ko'paytirish qo'shishdan oldin bajariladi.") },
  { expression: '42 : [2 · 3] + 5', answer: 12, hint: T('Сначала вычислите квадратные скобки.', 'Avval kvadrat qavsni hisoblang.') },
]

const toNumber = (value) => {
  const normalized = String(value ?? '').trim().replace(',', '.')
  if (!normalized) return null
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : null
}

function useMobileZoom() {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const root = document.documentElement
    const apply = () => {
      const zoom = window.innerWidth < 640 ? window.innerWidth / 390 : 1
      root.style.setProperty('--g7z', String(zoom))
    }
    apply()
    window.addEventListener('resize', apply)
    window.addEventListener('orientationchange', apply)
    return () => {
      window.removeEventListener('resize', apply)
      window.removeEventListener('orientationchange', apply)
      root.style.removeProperty('--g7z')
    }
  }, [])
}

function Expression({ children, compact = false, ariaLabel, className = '' }) {
  return (
    <div className={`g7-expression${compact ? ' is-compact' : ''}${className ? ` ${className}` : ''}`} aria-label={ariaLabel}>
      {children}
    </div>
  )
}

function Feedback({ status, children }) {
  if (!children) return null
  const Icon = status === 'correct' ? CheckCircle2 : status === 'wrong' ? XCircle : Lightbulb
  return (
    <div className={`g7-feedback is-${status || 'hint'}`} role="status" aria-live="polite">
      <Icon size={20} aria-hidden="true" />
      <p>{children}</p>
    </div>
  )
}

function ChoiceGrid({ options, selected, correct, locked, onSelect, columns = 3 }) {
  return (
    <div className="g7-choice-grid" style={{ '--choice-cols': columns }}>
      {options.map((option, index) => {
        const isSelected = selected === index
        const state = locked && index === correct
          ? 'correct'
          : isSelected && selected !== correct
            ? 'wrong'
            : ''
        return (
          <button
            key={`${index}-${textOf(option, 'ru')}`}
            type="button"
            className={`g7-choice ${state ? `is-${state}` : ''}`}
            disabled={locked}
            onClick={() => onSelect(index)}
          >
            {typeof option === 'string' ? option : option.label}
          </button>
        )
      })}
    </div>
  )
}

function NumericInput({ value, onChange, onSubmit, label, lang, disabled = false, autoFocus = false }) {
  return (
    <form
      className="g7-answer-row"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <label className="g7-number-field">
        <span>{label}</span>
        <input
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={value ?? ''}
          disabled={disabled}
          autoFocus={autoFocus}
          onChange={(event) => onChange(event.target.value)}
        />
      </label>
      <button type="submit" className="g7-primary" disabled={disabled || String(value ?? '').trim() === ''}>
        {disabled ? <CheckCircle2 size={19} /> : <Target size={19} />}
        <span>{disabled ? (lang === 'uz' ? 'Tayyor' : 'Готово') : (lang === 'uz' ? 'Tekshirish' : 'Проверить')}</span>
      </button>
    </form>
  )
}

function ProgressHeader({ screen, lang, setLang, audioOn, toggleAudio, speaking, replayAudio }) {
  const explainProgress = Math.min(8, screen + 1) / 8
  const practiceProgress = screen < 8 ? 0 : (screen - 7) / 8
  return (
    <header className="g7-header">
      <div className="g7-brand">
        <div className="g7-brand-mark">M7</div>
        <div>
          <span>{textOf(T('Математическая лаборатория', 'Matematik laboratoriya'), lang)}</span>
          <strong>{textOf(T('Числовые выражения', 'Sonli ifodalar'), lang)}</strong>
        </div>
      </div>

      <div className="g7-phase-progress" aria-label={`${screen + 1} / 16`}>
        <div className={`g7-phase-segment ${screen < 8 ? 'is-current' : 'is-done'}`}>
          <div className="g7-phase-label">
            <span>{textOf(PHASE_LABELS.explain, lang)}</span>
            <b>1–8</b>
          </div>
          <div className="g7-phase-track">
            <i style={{ transform: `scaleX(${explainProgress})` }} />
          </div>
        </div>
        <div className={`g7-phase-segment ${screen >= 8 ? 'is-current' : ''}`}>
          <div className="g7-phase-label">
            <span>{textOf(PHASE_LABELS.practice, lang)}</span>
            <b>9–16</b>
          </div>
          <div className="g7-phase-track">
            <i style={{ transform: `scaleX(${practiceProgress})` }} />
          </div>
        </div>
      </div>

      <div className="g7-tools">
        <div className="g7-language" aria-label="Language">
          <button type="button" className={lang === 'ru' ? 'is-active' : ''} onClick={() => setLang('ru')}>RU</button>
          <button type="button" className={lang === 'uz' ? 'is-active' : ''} onClick={() => setLang('uz')}>UZ</button>
        </div>
        <button
          type="button"
          className={`g7-icon-button ${speaking ? 'is-speaking' : ''}`}
          aria-label={audioOn ? 'Выключить звук' : 'Включить звук'}
          onClick={toggleAudio}
        >
          {audioOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
        <button type="button" className="g7-icon-button" aria-label="Повторить объяснение" onClick={replayAudio}>
          <RotateCcw size={19} />
        </button>
      </div>
    </header>
  )
}

function SlideHeading({ slide, index, lang }) {
  return (
    <div className="g7-slide-heading">
      <div className="g7-slide-index">{String(index + 1).padStart(2, '0')}</div>
      <div>
        <p>{textOf(slide.kicker, lang)}</p>
        <h1>{textOf(slide.title, lang)}</h1>
      </div>
    </div>
  )
}

function TimerDial({ remaining, total, lang }) {
  const ratio = Math.max(0, Math.min(1, remaining / total))
  return (
    <div className="g7-timer-wrap">
      <div className="g7-timer" style={{ '--timer-ratio': `${ratio * 360}deg` }}>
        <Clock size={22} />
        <strong>{remaining}</strong>
        <span>{lang === 'uz' ? 'son' : 'сек'}</span>
      </div>
      <span className="g7-timer-caption">
        {lang === 'uz' ? 'Fikrlash vaqti' : 'Время на размышление'}
      </span>
    </div>
  )
}

function WorkingCard({ icon: Icon = Brain, title, children, tone = 'blue' }) {
  return (
    <section className={`g7-working-card is-${tone}`}>
      <header>
        <span><Icon size={20} /></span>
        <h2>{title}</h2>
      </header>
      {children}
    </section>
  )
}

function Dars01() {
  useMobileZoom()

  const [lang, setLang] = useState('ru')
  const [screen, setScreen] = useState(0)
  const [audioOn, setAudioOn] = useState(true)
  const [speaking, setSpeaking] = useState(false)
  const [completed, setCompleted] = useState(() => new Set())
  const [screenData, setScreenData] = useState({})
  const [challengeRemaining, setChallengeRemaining] = useState(45)
  const [finished, setFinished] = useState(false)
  const [sprint, setSprint] = useState({
    active: false,
    paused: false,
    remaining: 75,
    index: 0,
    input: '',
    firstTryCorrect: 0,
    itemAttempts: 0,
    feedback: '',
    status: '',
    finished: false,
  })
  const mainRef = useRef(null)

  const slide = SLIDES[screen]
  const state = screenData[screen] || {}
  const tr = useCallback((value) => textOf(value, lang), [lang])

  const patchScreen = useCallback((index, patch) => {
    setScreenData((previous) => ({
      ...previous,
      [index]: { ...(previous[index] || {}), ...patch },
    }))
  }, [])

  const completeScreen = useCallback((index) => {
    setCompleted((previous) => {
      if (previous.has(index)) return previous
      const next = new Set(previous)
      next.add(index)
      return next
    })
  }, [])

  const speak = useCallback((message) => {
    if (!audioOn || typeof window === 'undefined' || !window.speechSynthesis || !message) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(message)
    utterance.lang = lang === 'ru' ? 'ru-RU' : 'uz-UZ'
    utterance.rate = lang === 'ru' ? 0.94 : 0.9
    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }, [audioOn, lang])

  const replayAudio = useCallback(() => {
    speak(tr(slide.audio))
  }, [slide.audio, speak, tr])

  const toggleAudio = useCallback(() => {
    if (audioOn && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
    }
    setAudioOn((value) => !value)
  }, [audioOn])

  useEffect(() => {
    if (!audioOn) {
      if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel()
      return undefined
    }
    const timer = window.setTimeout(() => speak(textOf(SLIDES[screen].audio, lang)), 240)
    return () => window.clearTimeout(timer)
  }, [audioOn, lang, screen, speak])

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [screen])

  useEffect(() => {
    if (screen !== 0 || completed.has(0) || challengeRemaining <= 0) return undefined
    const timer = window.setInterval(() => {
      setChallengeRemaining((value) => Math.max(0, value - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [challengeRemaining, completed, screen])

  useEffect(() => {
    if (screen !== 14 || !sprint.active || sprint.paused || sprint.finished) return undefined
    const timer = window.setInterval(() => {
      setSprint((previous) => {
        if (previous.remaining <= 1) {
          completeScreen(14)
          return { ...previous, remaining: 0, finished: true, active: false }
        }
        return { ...previous, remaining: previous.remaining - 1 }
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [completeScreen, screen, sprint.active, sprint.finished, sprint.paused])

  useEffect(() => () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel()
  }, [])

  const announceFeedback = useCallback((message) => {
    if (audioOn) speak(message)
  }, [audioOn, speak])

  const evaluateChoice = useCallback((index, selected, correct, wrongMessages, correctMessage) => {
    const previous = screenData[index] || {}
    const attempts = (previous.attempts || 0) + 1
    const isCorrect = selected === correct
    const message = isCorrect
      ? tr(correctMessage)
      : tr(wrongMessages[selected] || wrongMessages.default)
    patchScreen(index, {
      selected,
      attempts,
      firstTry: previous.firstTry ?? isCorrect,
      status: isCorrect ? 'correct' : 'wrong',
      feedback: message,
    })
    announceFeedback(message)
    if (isCorrect) completeScreen(index)
  }, [announceFeedback, completeScreen, patchScreen, screenData, tr])

  const evaluateNumeric = useCallback((index, expected, messages) => {
    const previous = screenData[index] || {}
    const answer = toNumber(previous.input)
    const isCorrect = answer === expected
    const attempts = (previous.attempts || 0) + 1
    const message = isCorrect ? tr(messages.correct) : tr(messages.wrong(answer, attempts))
    patchScreen(index, {
      attempts,
      firstTry: previous.firstTry ?? isCorrect,
      status: isCorrect ? 'correct' : 'wrong',
      feedback: message,
    })
    announceFeedback(message)
    if (isCorrect) completeScreen(index)
  }, [announceFeedback, completeScreen, patchScreen, screenData, tr])

  const submitChallenge = (uncertain = false) => {
    const input = String(state.input ?? '').trim()
    if (!uncertain && !input) {
      patchScreen(0, {
        status: 'hint',
        feedback: tr(T('Введите итоговый ответ или переходите к объяснению.', "Yakuniy javobni kiriting yoki tushuntirishga o'ting.")),
      })
      return
    }
    patchScreen(0, {
      submitted: true,
      uncertain,
      hypothesis: uncertain ? null : toNumber(input),
      elapsed: 45 - challengeRemaining,
      status: 'hint',
      feedback: tr(T(
        'Ответ сохранён. Теперь разберём выражение и вернёмся к вашей гипотезе.',
        "Javob saqlandi. Endi ifodani tahlil qilamiz va keyin taxminingizga qaytamiz.",
      )),
    })
    completeScreen(0)
  }

  const submitPracticeStep = (index) => {
    const steps = PRACTICE_STEPS[index]
    const currentStep = state.step || 0
    const step = steps[currentStep]
    const values = state.values || []
    const correct = step.expected.every((expected, itemIndex) => toNumber(values[itemIndex]) === expected)
    const attempts = (state.stepAttempts || 0) + 1
    if (!correct) {
      const message = attempts === 1
        ? tr(T('Проверьте только выделенный фрагмент. Остальное выражение пока не меняется.', "Faqat ajratilgan qismni tekshiring. Ifodaning qolgan qismi hozircha o'zgarmaydi."))
        : tr(T('Вернитесь к порядку: скобки, затем умножение и деление.', "Tartibga qayting: qavslar, keyin ko'paytirish va bo'lish."))
      patchScreen(index, { status: 'wrong', feedback: message, stepAttempts: attempts })
      announceFeedback(message)
      return
    }
    const nextStep = currentStep + 1
    const solvedResults = [...(state.solvedResults || []), step.result]
    const done = nextStep >= steps.length
    const message = done
      ? tr(T('Выражение решено верно.', "Ifoda to'g'ri yechildi."))
      : tr(T('Шаг верный. Переходим к следующему уровню действий.', "Qadam to'g'ri. Amallarning keyingi bosqichiga o'tamiz."))
    patchScreen(index, {
      step: done ? currentStep : nextStep,
      values: [],
      solvedResults,
      stepAttempts: 0,
      status: 'correct',
      feedback: message,
    })
    announceFeedback(message)
    if (done) completeScreen(index)
  }

  const submitBrackets = () => {
    const correct = state.openBoundary === 0 && state.closeBoundary === 3
    const attempts = (state.attempts || 0) + 1
    const message = correct
      ? tr(T('Верно: (36 − 12) : 3 + 1 = 9.', "To'g'ri: (36 − 12) : 3 + 1 = 9."))
      : tr(T(
        state.openBoundary === 2 && state.closeBoundary === 5
          ? 'Скобки вокруг 12 : 3 не изменяют существующий порядок действий.'
          : 'Проверьте значение получившегося выражения. Цель — получить 9.',
        state.openBoundary === 2 && state.closeBoundary === 5
          ? "12 : 3 atrofidagi qavslar amallarning mavjud tartibini o'zgartirmaydi."
          : "Hosil bo'lgan ifodaning qiymatini tekshiring. Maqsad — 9 ni olish.",
      ))
    patchScreen(13, {
      attempts,
      firstTry: state.firstTry ?? correct,
      status: correct ? 'correct' : 'wrong',
      feedback: message,
    })
    announceFeedback(message)
    if (correct) completeScreen(13)
  }

  const startSprint = () => {
    setSprint((previous) => ({ ...previous, active: true, paused: false, feedback: '', status: '' }))
  }

  const submitSprintAnswer = () => {
    const item = SPRINT_ITEMS[sprint.index]
    const answer = toNumber(sprint.input)
    const correct = answer === item.answer
    if (!correct) {
      const message = tr(item.hint)
      setSprint((previous) => ({
        ...previous,
        itemAttempts: previous.itemAttempts + 1,
        feedback: message,
        status: 'wrong',
      }))
      announceFeedback(message)
      return
    }

    const firstTryGain = sprint.itemAttempts === 0 ? 1 : 0
    if (sprint.index === SPRINT_ITEMS.length - 1) {
      const message = tr(T('Все четыре выражения решены.', "To'rtta ifodaning hammasi yechildi."))
      setSprint((previous) => ({
        ...previous,
        active: false,
        finished: true,
        input: '',
        feedback: message,
        status: 'correct',
        firstTryCorrect: previous.firstTryCorrect + firstTryGain,
      }))
      completeScreen(14)
      announceFeedback(message)
      return
    }

    setSprint((previous) => ({
      ...previous,
      index: previous.index + 1,
      input: '',
      itemAttempts: 0,
      feedback: tr(T('Верно. Следующее выражение.', "To'g'ri. Keyingi ifoda.")),
      status: 'correct',
      firstTryCorrect: previous.firstTryCorrect + firstTryGain,
    }))
  }

  const submitFinalAnswer = () => {
    const answer = toNumber(state.input)
    const correct = answer === 104
    const attempts = (state.answerAttempts || 0) + 1
    const message = correct
      ? tr(T('Значение выражения найдено верно. Теперь выберите объяснение.', "Ifodaning qiymati to'g'ri topildi. Endi izohni tanlang."))
      : tr(T(
        attempts === 1
          ? 'Проверьте скобки и действия второго уровня: 72 : [3 · 4].'
          : 'После скобок должно получиться 100 − 6 + 10.',
        attempts === 1
          ? "Qavslar va ikkinchi darajadagi amallarni tekshiring: 72 : [3 · 4]."
          : "Qavslardan keyin 100 − 6 + 10 hosil bo'lishi kerak.",
      ))
    patchScreen(15, {
      answerCorrect: correct,
      answerAttempts: attempts,
      answerFirstTry: state.answerFirstTry ?? correct,
      status: correct ? 'correct' : 'wrong',
      feedback: message,
    })
    announceFeedback(message)
  }

  const submitFinalRule = (choice) => {
    const correct = choice === 0
    const attempts = (state.ruleAttempts || 0) + 1
    const message = correct
      ? tr(T('Верно: вы объяснили не только ответ, но и стратегию.', "To'g'ri: siz nafaqat javobni, balki strategiyani ham tushuntirdingiz."))
      : tr(T(
        choice === 1
          ? 'Строго слева направо выполняют только действия одинакового приоритета.'
          : 'Умножение и деление имеют одинаковый приоритет и выполняются слева направо.',
        choice === 1
          ? "Faqat ustuvorligi bir xil amallar qat'iy chapdan o'ngga bajariladi."
          : "Ko'paytirish va bo'lishning ustuvorligi bir xil, ular chapdan o'ngga bajariladi.",
      ))
    patchScreen(15, {
      ruleChoice: choice,
      ruleCorrect: correct,
      ruleAttempts: attempts,
      ruleFirstTry: state.ruleFirstTry ?? correct,
      status: correct ? 'correct' : 'wrong',
      feedback: message,
    })
    announceFeedback(message)
    if (correct && state.answerCorrect) completeScreen(15)
  }

  const bracketPreview = useMemo(() => {
    const tokens = ['36', '−', '12', ':', '3', '+', '1']
    const open = state.openBoundary
    const close = state.closeBoundary
    return tokens.map((token, index) => (
      <span key={`${token}-${index}`}>
        {open === index ? '(' : ''}
        {token}
        {close === index + 1 ? ')' : ''}
      </span>
    ))
  }, [state.closeBoundary, state.openBoundary])

  const renderSlide = () => {
    if (screen === 0) {
      return (
        <div className="g7-grid g7-challenge-layout">
          <WorkingCard icon={Brain} title={tr(T('Что нужно сделать', 'Nima qilish kerak'))}>
            <div className="g7-task-brief">
              <span>1</span>
              <p>{tr(T(
                'За 45 секунд определите порядок действий и, если успеете, найдите значение выражения.',
                "45 soniyada amallar tartibini aniqlang va ulgursangiz, ifodaning qiymatini toping.",
              ))}</p>
            </div>
            <Expression
              className="is-anchor is-single-line"
              ariaLabel={tr(T('Сто двадцать минус восемьдесят четыре разделить на два умножить на семь минус четыре в скобках, плюс три умножить на пятнадцать минус девять в скобках.', "Yuz yigirma minus sakson to'rt bo'lingan ikki karra qavs ichida yetti minus to'rt, qo'shuv uch karra qavs ichida o'n besh minus to'qqiz."))}
            >
              120 − 84 : [2 · (7 − 4)] + 3 · (15 − 9)
            </Expression>
            <div className="g7-thinking-route">
              <span><b>1</b>{tr(T('Мысленно наметьте первое действие', 'Birinchi amalni belgilang'))}</span>
              <i>→</i>
              <span><b>2</b>{tr(T('Вычислите по шагам', 'Bosqichma-bosqich hisoblang'))}</span>
              <i>→</i>
              <span><b>3</b>{tr(T('Запишите только итог', 'Faqat natijani yozing'))}</span>
            </div>
            <p className="g7-challenge-hint">{tr(T(
              'Это не контрольная. Ответ нужен, чтобы после объяснения сравнить свой первый способ с правильным.',
              "Bu nazorat emas. Javob tushuntirishdan keyin birinchi usulingizni to'g'ri usul bilan solishtirish uchun kerak.",
            ))}</p>
          </WorkingCard>

          <aside className="g7-challenge-side">
            <TimerDial
              remaining={challengeRemaining}
              total={45}
              lang={lang}
            />
            <NumericInput
              value={state.input}
              lang={lang}
              label={tr(T('Ваш ответ', 'Javobingiz'))}
              disabled={state.submitted}
              onChange={(value) => patchScreen(0, { input: value, feedback: '', status: '' })}
              onSubmit={() => submitChallenge(false)}
            />
            {!state.submitted && (
              <p className="g7-skip-note">{tr(T(
                'Не успели — просто нажмите «Продолжить». Дальше начнётся объяснение.',
                "Ulgurmadingizmi — «Davom etish»ni bosing. Keyin tushuntirish boshlanadi.",
              ))}</p>
            )}
            <Feedback status={state.status}>{state.feedback}</Feedback>
          </aside>
        </div>
      )
    }

    if (screen === 1) {
      return (
        <div className="g7-explain-layout">
          <WorkingCard icon={BookOpen} title={tr(T('У действий есть три уровня', 'Amallarning uch darajasi bor'))}>
            <div className="g7-levels">
              <div className="g7-level-row is-first">
                <span>1</span>
                <code>( ) &nbsp; [ ]</code>
                <p>{tr(T('Сначала всё внутри скобок — от внутренних к внешним.', 'Avval qavslar ichi — ichkaridan tashqariga.'))}</p>
              </div>
              <div className="g7-level-row">
                <span>2</span>
                <code>· &nbsp; :</code>
                <p>{tr(T('Затем умножение и деление слева направо.', "Keyin ko'paytirish va bo'lish chapdan o'ngga."))}</p>
              </div>
              <div className="g7-level-row">
                <span>3</span>
                <code>+ &nbsp; −</code>
                <p>{tr(T('После них сложение и вычитание слева направо.', "So'ng qo'shish va ayirish chapdan o'ngga."))}</p>
              </div>
            </div>
          </WorkingCard>
          <aside className="g7-rule-panel">
            <span>{tr(T('Формула порядка действий', 'Amallar tartibi formulasi'))}</span>
            <div className="g7-rule-formula">( ) → · : → + −</div>
            <p>{tr(T(
              'Слева направо решаем только действия одного уровня. Поэтому нельзя всегда начинать с самого левого знака.',
              "Faqat bir darajadagi amallar chapdan o'ngga bajariladi. Shuning uchun har doim eng chapdagi belgidan boshlanmaydi.",
            ))}</p>
          </aside>
        </div>
      )
    }

    if (screen === 2) {
      return (
        <div className="g7-explain-layout">
          <WorkingCard title={tr(T('Шаг 1. Внутренние скобки', '1-qadam. Ichki qavslar'))}>
            <Expression className="is-explain-line">
              120 − 84 : [2 · <span className="g7-mark is-blue">(7 − 4)</span>] + 3 · <span className="g7-mark is-blue">(15 − 9)</span>
            </Expression>
            <div className="g7-equation-flow">
              <div><span>7 − 4</span><i>=</i><b>3</b></div>
              <div><span>15 − 9</span><i>=</i><b>6</b></div>
            </div>
            <Expression compact>120 − 84 : [2 · 3] + 3 · 6</Expression>
          </WorkingCard>
          <aside className="g7-step-explanation">
            <b>{tr(T('Почему именно так?', 'Nega aynan shunday?'))}</b>
            <p>{tr(T(
              'Круглые скобки находятся глубже квадратных. Обе пары независимы, поэтому их можно вычислить одновременно.',
              "Dumaloq qavslar kvadrat qavsdan ichkarida. Ikki juft qavs mustaqil, shuning uchun ularni bir vaqtda hisoblash mumkin.",
            ))}</p>
            <code>{tr(T('Меняем только вычисленный фрагмент', 'Faqat hisoblangan qismni o‘zgartiramiz'))}</code>
          </aside>
        </div>
      )
    }

    if (screen === 3) {
      return (
        <div className="g7-explain-layout">
          <WorkingCard title={tr(T('Шаг 2. Внешние скобки', '2-qadam. Tashqi qavslar'))}>
            <Expression className="is-explain-line">
              120 − 84 : <span className="g7-mark is-blue">[2 · 3]</span> + 3 · 6
            </Expression>
            <div className="g7-equation-focus">
              <span>[2 · 3]</span>
              <i>→</i>
              <b>6</b>
            </div>
            <Expression compact>120 − 84 : 6 + 3 · 6</Expression>
          </WorkingCard>
          <aside className="g7-step-explanation">
            <b>{tr(T('Правило вложенных скобок', 'Ichma-ich qavslar qoidasi'))}</b>
            <div className="g7-mini-formula">[ a · (b − c) ] → [ a · d ] → e</div>
            <p>{tr(T(
              'Пока квадратная скобка не стала одним числом, деление 84 : […] выполнять нельзя.',
              "Kvadrat qavs bitta songa aylanmaguncha 84 : […] bo‘lishini bajarib bo‘lmaydi.",
            ))}</p>
          </aside>
        </div>
      )
    }

    if (screen === 4) {
      return (
        <div className="g7-explain-layout">
          <WorkingCard title={tr(T('Шаг 3. Деление и умножение', "3-qadam. Bo‘lish va ko‘paytirish"))}>
            <Expression className="is-explain-line">
              120 − <span className="g7-mark is-orange">84 : 6</span> + <span className="g7-mark is-orange">3 · 6</span>
            </Expression>
            <div className="g7-branch-grid">
              <div className="g7-branch">
                <span>{tr(T('Левая ветвь', 'Chap tarmoq'))}</span>
                <code>84 : 6 = <b>14</b></code>
              </div>
              <div className="g7-branch">
                <span>{tr(T('Правая ветвь', "O‘ng tarmoq"))}</span>
                <code>3 · 6 = <b>18</b></code>
              </div>
            </div>
            <Expression compact>120 − 14 + 18</Expression>
          </WorkingCard>
          <aside className="g7-step-explanation">
            <b>{tr(T('Можно считать параллельно', 'Parallel hisoblash mumkin'))}</b>
            <p>{tr(T(
              'Два выделенных действия не зависят друг от друга. Их удобно вычислить отдельно, а затем вернуть результаты на свои места.',
              "Ajratilgan ikki amal bir-biriga bog‘liq emas. Ularni alohida hisoblab, natijalarni o‘z joyiga qo‘yish qulay.",
            ))}</p>
            <div className="g7-mini-formula">a − b : c + d · e → a − q + p</div>
          </aside>
        </div>
      )
    }

    if (screen === 5) {
      return (
        <div className="g7-explain-layout">
          <WorkingCard title={tr(T('Почему нельзя считать просто слева направо', "Nega faqat chapdan o‘ngga hisoblab bo‘lmaydi"))}>
            <div className="g7-contrast-row is-wrong">
              <XCircle size={20} />
              <div>
                <span>{tr(T('Неверный старт', 'Noto‘g‘ri boshlanish'))}</span>
                <code>120 − 84 = 36</code>
              </div>
            </div>
            <div className="g7-contrast-row is-correct">
              <CheckCircle2 size={20} />
              <div>
                <span>{tr(T('Верный старт', 'To‘g‘ri boshlanish'))}</span>
                <code>(7 − 4), (15 − 9)</code>
              </div>
            </div>
          </WorkingCard>
          <aside className="g7-rule-panel">
            <span>{tr(T('Ключевая мысль', 'Asosiy fikr'))}</span>
            <div className="g7-rule-formula">приоритет → направление</div>
            <p>{tr(T(
              'Сначала выбираем уровень действия. И только среди действий одного уровня движемся слева направо.',
              "Avval amal darajasini tanlaymiz. Faqat bir darajadagi amallar orasida chapdan o‘ngga yuramiz.",
            ))}</p>
          </aside>
        </div>
      )
    }

    if (screen === 6) {
      return (
        <div className="g7-explain-layout">
          <WorkingCard title={tr(T('Шаг 4. Действия одного уровня', '4-qadam. Bir darajadagi amallar'))}>
            <Expression>120 − 14 + 18</Expression>
            <div className="g7-final-calculation">
              <div><span>1</span><code>120 − 14 = <b>106</b></code></div>
              <i>→</i>
              <div><span>2</span><code>106 + 18 = <b>124</b></code></div>
            </div>
            <Expression compact>120 − 14 + 18 = 124</Expression>
          </WorkingCard>
          <aside className="g7-step-explanation">
            <b>{tr(T('Почему сначала вычитание?', 'Nega avval ayirish?'))}</b>
            <p>{tr(T(
              'Сложение и вычитание равноправны. Знак вычитания расположен левее, поэтому он выполняется первым.',
              "Qo‘shish va ayirish teng darajada. Ayirish belgisi chaproqda, shuning uchun u birinchi bajariladi.",
            ))}</p>
            <div className="g7-mini-formula">a − b + c = (a − b) + c</div>
          </aside>
        </div>
      )
    }

    if (screen === 7) {
      const hypothesis = screenData[0]?.hypothesis
      const uncertain = screenData[0]?.uncertain
      return (
        <div className="g7-recap-grid">
          <WorkingCard icon={BookOpen} title={tr(T('Два способа записи решения', 'Yechimni yozishning ikki usuli'))}>
            <div className="g7-method-grid">
              <div className="g7-method-card">
                <span>{tr(T('Способ 1 — строками', '1-usul — qatorlar bilan'))}</span>
                <div className="g7-solution-stack">
                  <span>120 − 84 : [2 · (7 − 4)] + 3 · (15 − 9)</span>
                  <span>= 120 − 84 : [2 · 3] + 3 · 6</span>
                  <span>= 120 − 84 : 6 + 3 · 6</span>
                  <span>= 120 − 14 + 18</span>
                  <strong>= 124</strong>
                </div>
              </div>
              <div className="g7-method-card">
                <span>{tr(T('Способ 2 — план действий', '2-usul — amallar rejasi'))}</span>
                <ol className="g7-action-plan">
                  <li><b>7 − 4 = 3</b><small>{tr(T('скобки', 'qavslar'))}</small></li>
                  <li><b>15 − 9 = 6</b><small>{tr(T('скобки', 'qavslar'))}</small></li>
                  <li><b>2 · 3 = 6</b><small>{tr(T('внешняя скобка', 'tashqi qavs'))}</small></li>
                  <li><b>84 : 6 = 14; 3 · 6 = 18</b><small>· :</small></li>
                  <li><b>120 − 14 + 18 = 124</b><small>+ −</small></li>
                </ol>
              </div>
            </div>
          </WorkingCard>
          <div className="g7-recap-side">
            <WorkingCard icon={Lightbulb} title={tr(T('Правило', 'Qoida'))} tone="orange">
              <div className="g7-rule-formula is-small">( ) → · : → + −</div>
              <ol className="g7-rule-list">
                <li>{tr(T('Скобки: от внутренних к внешним.', 'Qavslar: ichkaridan tashqariga.'))}</li>
                <li>{tr(T('Умножение и деление: слева направо.', "Ko'paytirish va bo'lish: chapdan o'ngga."))}</li>
                <li>{tr(T('Сложение и вычитание: слева направо.', "Qo'shish va ayirish: chapdan o'ngga."))}</li>
              </ol>
            </WorkingCard>
            <div className="g7-check-card">
              <b>{tr(T('Как проверить себя', 'O‘zingizni tekshirish'))}</b>
              <p>{tr(T('Обратное действие: 14 · 6 = 84.', 'Teskari amal: 14 · 6 = 84.'))}</p>
              <p>{tr(T('Оценка результата: 120 − 14 + 18 немного больше 120, значит 124 выглядит разумно.', 'Natijani baholash: 120 − 14 + 18 soni 120 dan biroz katta, demak 124 mantiqan to‘g‘ri.'))}</p>
            </div>
            <div className="g7-hypothesis-card">
              <span>{tr(T('Ваша гипотеза', 'Sizning taxminingiz'))}</span>
              <b>{uncertain || hypothesis === null || hypothesis === undefined ? '—' : hypothesis}</b>
              <i>→</i>
              <span>{tr(T('После разбора', 'Tahlildan keyin'))}</span>
              <b className="is-final">124</b>
            </div>
          </div>
        </div>
      )
    }

    if (screen === 8 || screen === 9) {
      const steps = PRACTICE_STEPS[screen]
      const stepIndex = state.step || 0
      const step = steps[stepIndex]
      const solved = state.solvedResults || []
      const expression = screen === 8
        ? '72 : [3 · (8 − 4)] + 5 · (9 − 7)'
        : '90 − 48 : [2 · (9 − 5)] + 4 · (7 − 3)'
      return (
        <div className="g7-practice-grid">
          <WorkingCard title={tr(T('Исходное выражение', 'Boshlang‘ich ifoda'))}>
            <Expression>{expression}</Expression>
            <div className="g7-solved-lines">
              {solved.map((line, index) => <span key={`${line}-${index}`}>= {line}</span>)}
            </div>
          </WorkingCard>
          <WorkingCard title={`${tr(T('Шаг', 'Qadam'))} ${Math.min(stepIndex + 1, steps.length)} / ${steps.length}`} tone="orange">
            <p className="g7-question">{tr(step.prompt)}</p>
            <div className="g7-step-fields">
              {step.labels.map((label, index) => (
                <label key={`${textOf(label, 'ru')}-${index}`}>
                  <span>{tr(label)}</span>
                  <input
                    inputMode="numeric"
                    value={(state.values || [])[index] || ''}
                    disabled={completed.has(screen)}
                    onChange={(event) => {
                      const values = [...(state.values || [])]
                      values[index] = event.target.value
                      patchScreen(screen, { values, feedback: '', status: '' })
                    }}
                  />
                </label>
              ))}
            </div>
            <button
              type="button"
              className="g7-primary g7-full"
              disabled={completed.has(screen) || step.labels.some((_, index) => !String((state.values || [])[index] || '').trim())}
              onClick={() => submitPracticeStep(screen)}
            >
              <Target size={19} />
              {tr(T('Проверить шаг', 'Qadamni tekshirish'))}
            </button>
            <Feedback status={state.status}>{state.feedback}</Feedback>
          </WorkingCard>
        </div>
      )
    }

    if (screen === 10) {
      return (
        <div className="g7-grid g7-independent-layout">
          <WorkingCard icon={Brain} title={tr(T('Самостоятельная работа', 'Mustaqil ish'))}>
            <Expression>150 − 96 : [3 · (10 − 6)] + 2 · (11 − 5)</Expression>
            <textarea
              className="g7-scratch"
              rows={4}
              value={state.scratch || ''}
              placeholder={tr(T('Черновик…', 'Qoralama…'))}
              onChange={(event) => patchScreen(10, { scratch: event.target.value })}
            />
          </WorkingCard>
          <aside className="g7-answer-panel">
            <NumericInput
              value={state.input}
              lang={lang}
              label={tr(T('Значение выражения', 'Ifodaning qiymati'))}
              disabled={completed.has(10)}
              onChange={(value) => patchScreen(10, { input: value, feedback: '', status: '' })}
              onSubmit={() => evaluateNumeric(10, 154, {
                correct: T('Верно: значение выражения равно 154.', "To'g'ri: ifodaning qiymati 154 ga teng."),
                wrong: (_, attempts) => attempts === 1
                  ? T('Какие действия защищены скобками?', 'Qaysi amallar qavslar ichida?')
                  : attempts === 2
                    ? T('Сначала получите 3 · 4 внутри квадратных скобок.', 'Avval kvadrat qavs ichida 3 · 4 ni hisoblang.')
                    : T('После скобок левая ветвь даёт 96 : 12.', "Qavslardan keyin chap tarmoq 96 : 12 ni beradi."),
              })}
            />
            <Feedback status={state.status}>{state.feedback}</Feedback>
          </aside>
        </div>
      )
    }

    if (screen === 11) {
      const options = [{ label: '36' }, { label: '45' }, { label: '20' }]
      return (
        <div className="g7-focus-column">
          <WorkingCard title={tr(T('Не путайте одинаковый приоритет', 'Bir xil ustuvorlikni adashtirmang'))} tone="orange">
            <Expression>48 − 18 : 3 · 2</Expression>
            <p className="g7-question">{tr(T('Чему равно выражение?', 'Ifoda nechaga teng?'))}</p>
            <ChoiceGrid
              options={options}
              selected={state.selected}
              correct={0}
              locked={completed.has(11)}
              onSelect={(choice) => evaluateChoice(
                11,
                choice,
                0,
                {
                  1: T('Вы объединили 3 · 2 в знаменатель. Деление и умножение выполняются слева направо.', "Siz 3 · 2 ni bo'luvchi qilib birlashtirdingiz. Bo'lish va ko'paytirish chapdan o'ngga bajariladi."),
                  2: T('Проверьте цепочку: 18 : 3 = 6, затем 6 · 2 = 12.', 'Zanjirni tekshiring: 18 : 3 = 6, keyin 6 · 2 = 12.'),
                },
                T('Верно: 18 : 3 · 2 = 12, поэтому 48 − 12 = 36.', "To'g'ri: 18 : 3 · 2 = 12, demak 48 − 12 = 36."),
              )}
            />
            <Feedback status={state.status}>{state.feedback}</Feedback>
          </WorkingCard>
        </div>
      )
    }

    if (screen === 12) {
      const transitions = [
        {
          from: '60 − 24 : [2 · (7 − 4)]',
          to: '60 − 24 : [2 · 3]',
        },
        {
          from: '60 − 24 : [2 · 3]',
          to: '36 : [2 · 3]',
        },
        {
          from: '36 : [2 · 3]',
          to: '36 : 6',
        },
      ]
      return (
        <div className="g7-error-layout">
          <WorkingCard title={tr(T('Решение Жасура', 'Jasurning yechimi'))}>
            <div className="g7-transition-list">
              {transitions.map((transition, index) => (
                <button
                  type="button"
                  key={transition.from}
                  disabled={completed.has(12)}
                  className={state.selected === index ? (index === 1 ? 'is-correct' : 'is-wrong') : ''}
                  onClick={() => evaluateChoice(
                    12,
                    index,
                    1,
                    {
                      0: T('Этот переход верен: изменилось только выражение в круглых скобках.', "Bu o'tish to'g'ri: faqat dumaloq qavs ichidagi ifoda o'zgardi."),
                      2: T('Здесь вычислены квадратные скобки, но ошибка появилась строкой раньше.', 'Bu yerda kvadrat qavs hisoblangan, ammo xato bir qator oldin paydo bo‘lgan.'),
                    },
                    T('Верно: вычитание 60 − 24 выполнено до завершения деления.', "To'g'ri: 60 − 24 ayirmasi bo'lish tugamasidan oldin bajarilgan."),
                  )}
                >
                  <span>{transition.from}</span>
                  <i>↓</i>
                  <span>{transition.to}</span>
                </button>
              ))}
            </div>
          </WorkingCard>
          <aside className="g7-answer-panel">
            <p className="g7-question">{tr(T('Нажмите на неверный переход.', "Noto'g'ri o'tishni bosing."))}</p>
            {completed.has(12) && (
              <div className="g7-correction">
                <span>60 − 24 : [2 · 3]</span>
                <span>= 60 − 24 : 6</span>
                <span>= 60 − 4</span>
                <strong>= 56</strong>
              </div>
            )}
            <Feedback status={state.status}>{state.feedback}</Feedback>
          </aside>
        </div>
      )
    }

    if (screen === 13) {
      const openOptions = [
        { boundary: 0, label: T('перед 36', '36 dan oldin') },
        { boundary: 2, label: T('перед 12', '12 dan oldin') },
        { boundary: 4, label: T('перед 3', '3 dan oldin') },
      ]
      const closeOptions = [
        { boundary: 3, label: T('после 12', '12 dan keyin') },
        { boundary: 5, label: T('после 3', '3 dan keyin') },
        { boundary: 7, label: T('после 1', '1 dan keyin') },
      ]
      const invalid = state.openBoundary !== undefined
        && state.closeBoundary !== undefined
        && state.closeBoundary <= state.openBoundary
      return (
        <div className="g7-bracket-layout">
          <WorkingCard title={tr(T('Получите значение 9', '9 qiymatini hosil qiling'))} tone="orange">
            <Expression>
              <span className="g7-bracket-preview">{bracketPreview}</span> = 9
            </Expression>
            <div className="g7-bracket-controls">
              <fieldset>
                <legend>{tr(T('Открывающая скобка', 'Ochuvchi qavs'))}</legend>
                {openOptions.map((option) => (
                  <button
                    type="button"
                    key={option.boundary}
                    className={state.openBoundary === option.boundary ? 'is-selected' : ''}
                    onClick={() => patchScreen(13, { openBoundary: option.boundary, feedback: '', status: '' })}
                  >
                    ( {tr(option.label)}
                  </button>
                ))}
              </fieldset>
              <fieldset>
                <legend>{tr(T('Закрывающая скобка', 'Yopuvchi qavs'))}</legend>
                {closeOptions.map((option) => (
                  <button
                    type="button"
                    key={option.boundary}
                    className={state.closeBoundary === option.boundary ? 'is-selected' : ''}
                    onClick={() => patchScreen(13, { closeBoundary: option.boundary, feedback: '', status: '' })}
                  >
                    {tr(option.label)} )
                  </button>
                ))}
              </fieldset>
            </div>
            <button
              type="button"
              className="g7-primary g7-full"
              disabled={completed.has(13) || state.openBoundary === undefined || state.closeBoundary === undefined || invalid}
              onClick={submitBrackets}
            >
              <Target size={19} />
              {tr(T('Проверить скобки', 'Qavslarni tekshirish'))}
            </button>
            {invalid && <Feedback status="hint">{tr(T('Закрывающая скобка должна стоять после открывающей.', 'Yopuvchi qavs ochuvchi qavsdan keyin turishi kerak.'))}</Feedback>}
            <Feedback status={state.status}>{state.feedback}</Feedback>
          </WorkingCard>
        </div>
      )
    }

    if (screen === 14) {
      const currentItem = SPRINT_ITEMS[Math.min(sprint.index, SPRINT_ITEMS.length - 1)]
      return (
        <div className="g7-sprint-layout">
          <WorkingCard icon={Clock} title={tr(T('Четыре коротких выражения', "To'rtta qisqa ifoda"))} tone="orange">
            {!sprint.active && !sprint.finished ? (
              <div className="g7-sprint-start">
                <div className="g7-sprint-number">75</div>
                <p>{tr(T('секунд · точность важнее скорости', 'soniya · aniqlik tezlikdan muhim'))}</p>
                <button type="button" className="g7-primary" onClick={startSprint}>
                  <Play size={19} />
                  {tr(T('Начать спринт', 'Sprintni boshlash'))}
                </button>
              </div>
            ) : sprint.finished ? (
              <div className="g7-sprint-result">
                <Trophy size={54} />
                <strong>{sprint.index === SPRINT_ITEMS.length - 1 ? '4 / 4' : `${sprint.index} / 4`}</strong>
                <p>{tr(T('С первой попытки', 'Birinchi urinishda'))}: {sprint.firstTryCorrect}</p>
                <p>{tr(T('Осталось времени', 'Qolgan vaqt'))}: {sprint.remaining} {tr(T('сек.', 'son.'))}</p>
              </div>
            ) : (
              <>
                <div className="g7-sprint-topline">
                  <span>{sprint.index + 1} / {SPRINT_ITEMS.length}</span>
                  <div className="g7-sprint-clock"><Clock size={18} /> {sprint.remaining}</div>
                  <button type="button" className="g7-icon-button" onClick={() => setSprint((previous) => ({ ...previous, paused: !previous.paused }))}>
                    {sprint.paused ? <Play size={18} /> : <Pause size={18} />}
                  </button>
                </div>
                <Expression>{currentItem.expression}</Expression>
                <NumericInput
                  value={sprint.input}
                  lang={lang}
                  label={tr(T('Ответ', 'Javob'))}
                  onChange={(value) => setSprint((previous) => ({ ...previous, input: value, feedback: '', status: '' }))}
                  onSubmit={submitSprintAnswer}
                />
                <Feedback status={sprint.status}>{sprint.feedback}</Feedback>
              </>
            )}
          </WorkingCard>
        </div>
      )
    }

    const finalRuleOptions = [
      tr(T(
        'Сначала скобки, затем умножение и деление, потом сложение и вычитание слева направо.',
        "Avval qavslar, keyin ko'paytirish va bo'lish, so'ng qo'shish va ayirish chapdan o'ngga.",
      )),
      tr(T(
        'Всегда выполняем действия строго слева направо.',
        "Amallarni har doim qat'iy chapdan o'ngga bajaramiz.",
      )),
      tr(T(
        'Сначала выполняем все умножения, затем все деления.',
        "Avval barcha ko'paytirishlarni, keyin barcha bo'lishlarni bajaramiz.",
      )),
    ].map((label) => ({ label }))

    return (
      <div className="g7-final-layout">
        <WorkingCard icon={Target} title={tr(T('Новый пример', 'Yangi misol'))}>
          <Expression>100 − 72 : [3 · (8 − 4)] + 5 · 2</Expression>
          <NumericInput
            value={state.input}
            lang={lang}
            label={tr(T('Значение выражения', 'Ifodaning qiymati'))}
            disabled={state.answerCorrect}
            onChange={(value) => patchScreen(15, { input: value, feedback: '', status: '' })}
            onSubmit={submitFinalAnswer}
          />
          {state.answerCorrect && (
            <>
              <p className="g7-question">{tr(T('Какое правило объясняет решение?', 'Qaysi qoida yechimni tushuntiradi?'))}</p>
              <ChoiceGrid
                options={finalRuleOptions}
                selected={state.ruleChoice}
                correct={0}
                locked={state.ruleCorrect}
                columns={1}
                onSelect={submitFinalRule}
              />
            </>
          )}
          <Feedback status={state.status}>{state.feedback}</Feedback>
        </WorkingCard>
        <aside className="g7-final-side">
          {finished ? (
            <div className="g7-complete-card">
              <Trophy size={60} />
              <span>{tr(T('Урок завершён', 'Dars yakunlandi'))}</span>
              <h2>{tr(T('Порядок действий освоен', "Amallar tartibi o'zlashtirildi"))}</h2>
              <p>{tr(T(
                'Вы нашли значение выражения и объяснили стратегию решения.',
                "Siz ifodaning qiymatini topdingiz va yechish strategiyasini tushuntirdingiz.",
              ))}</p>
            </div>
          ) : (
            <div className="g7-diagnostic-card">
              <Brain size={34} />
              <h2>{tr(T('Проверяем два навыка', "Ikki ko'nikmani tekshiramiz"))}</h2>
              <ul>
                <li className={state.answerCorrect ? 'is-done' : ''}>{tr(T('Точность вычисления', 'Hisoblash aniqligi'))}</li>
                <li className={state.ruleCorrect ? 'is-done' : ''}>{tr(T('Выбор стратегии', 'Strategiyani tanlash'))}</li>
              </ul>
            </div>
          )}
        </aside>
      </div>
    )
  }

  // Etalonni tekshirish rejimi: barcha slaydlar topshiriq bajarilishini kutmasdan ochiladi.
  const canNext = true
  const next = () => {
    if (screen === SLIDES.length - 1) {
      setFinished(true)
      return
    }
    setScreen((value) => Math.min(SLIDES.length - 1, value + 1))
  }

  return (
    <div className="g7-lesson" data-lang={lang}>
      <div className="g7-ambient g7-ambient-one" />
      <div className="g7-ambient g7-ambient-two" />
      <div className="g7-stage">
        <ProgressHeader
          screen={screen}
          lang={lang}
          setLang={setLang}
          audioOn={audioOn}
          toggleAudio={toggleAudio}
          speaking={speaking}
          replayAudio={replayAudio}
        />

        <main className="g7-main" ref={mainRef}>
          <div className="g7-slide-shell">
            <SlideHeading slide={slide} index={screen} lang={lang} />
            {renderSlide()}
          </div>
        </main>

        <footer className="g7-footer">
          <button
            type="button"
            className="g7-nav-button is-back"
            disabled={screen === 0}
            onClick={() => setScreen((value) => Math.max(0, value - 1))}
          >
            <ChevronLeft size={21} />
            <span>{tr(T('Назад', 'Orqaga'))}</span>
          </button>
          <div className="g7-footer-status">
            <span>{screen + 1} / {SLIDES.length}</span>
            <i>{tr(PHASE_LABELS[slide.phase])}</i>
          </div>
          <button
            type="button"
            className={`g7-nav-button is-next ${canNext ? 'is-ready' : ''}`}
            disabled={!canNext || (screen === SLIDES.length - 1 && finished)}
            onClick={next}
          >
            <span>
              {screen === SLIDES.length - 1
                ? tr(T('Завершить', 'Yakunlash'))
                : tr(T('Продолжить', 'Davom etish'))}
            </span>
            {screen === SLIDES.length - 1 ? <Trophy size={20} /> : <ChevronRight size={21} />}
          </button>
        </footer>
      </div>
    </div>
  )
}

export default Dars01
