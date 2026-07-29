import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Clock3,
  Play,
  Volume2,
  VolumeX,
} from 'lucide-react'
import './Dars01.css'

const TOTAL = 3

const COPY = [
  {
    eyebrow: { ru: 'Интеллектуальный вызов', uz: 'Intellektual sinov' },
    title: { ru: 'Сначала — твоя версия', uz: 'Avval — sizning javobingiz' },
    intro: {
      ru: 'Перед тобой одно числовое выражение. Нажми «Начать», реши его привычным способом и запиши свой ответ. Первая версия не оценивается.',
      uz: 'Oldingizda bitta sonli ifoda bor. «Boshlash» tugmasini bosing, odatiy usulda yeching va javobingizni yozing. Birinchi javob baholanmaydi.',
    },
  },
  {
    eyebrow: { ru: 'Разбираем первый шаг', uz: 'Birinchi qadamni tahlil qilamiz' },
    title: { ru: 'Левее — не значит раньше', uz: 'Chapda — birinchi degani emas' },
    intro: {
      ru: 'Результат зависит от первого шага. Нажми на оба варианта и посмотри, почему начинать нужно не с самого левого действия.',
      uz: 'Natija birinchi qadamga bog‘liq. Ikkala variantni bosing va nima uchun eng chap amaldan boshlamaslik kerakligini ko‘ring.',
    },
  },
  {
    eyebrow: { ru: 'Школьное правило', uz: 'Maktab qoidasi' },
    title: { ru: 'Три ступени порядка действий', uz: 'Amallar tartibining uch bosqichi' },
    intro: {
      ru: 'Нажимай на ступени. Каждая карточка покажет своё место прямо в выражении.',
      uz: 'Bosqichlarni bosing. Har bir kartochka ifodadagi o‘z o‘rnini ko‘rsatadi.',
    },
  },
]

const textOf = (value, lang) => value?.[lang] ?? value?.ru ?? value ?? ''

function useSpeech(lang, muted) {
  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
  }, [])

  const speak = useCallback((text) => {
    if (!text || muted || typeof window === 'undefined' || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(String(text))
    utterance.lang = lang === 'uz' ? 'uz-UZ' : 'ru-RU'
    utterance.rate = 0.92
    window.speechSynthesis.speak(utterance)
  }, [lang, muted])

  return { speak, stop }
}

function ScreenHeading({ screen, lang }) {
  const copy = COPY[screen]
  return (
    <div className="g7w-heading">
      <span>{textOf(copy.eyebrow, lang)}</span>
      <h1>{textOf(copy.title, lang)}</h1>
    </div>
  )
}

function MathExpression({ focus = null }) {
  const active = (name) => focus === name || focus === 'brackets' && name === 'bracket'

  return (
    <div className={`g7w-expression focus-${focus ?? 'none'}`} aria-label="120 − 84 : [2 · (7 − 4)] + 3 · (15 − 9)">
      <span className={`g7w-left-start ${active('left') ? 'is-active' : ''}`}>
        <span>120</span>
        <span
          className={`g7w-op g7w-outer-low ${active('plusminus') ? 'is-rule-active' : ''}`}
          data-order={active('plusminus') ? '1' : undefined}
        >
          −
        </span>
        <span>84</span>
      </span>
      <span
        className={`g7w-op g7w-outer-high ${active('multdiv') ? 'is-rule-active' : ''}`}
        data-order={active('multdiv') ? '1' : undefined}
      >
        :
      </span>
      <span className={`g7w-bracket-group ${active('bracket') ? 'is-rule-active' : ''}`}>
        <span className="g7w-bracket">[</span>
        <span>2</span>
        <span className="g7w-op">·</span>
        <span className={`g7w-inner-one ${active('firstBracket') ? 'is-active' : ''}`}>
          <span className="g7w-bracket">(</span>
          <span>7</span>
          <span className="g7w-op">−</span>
          <span>4</span>
          <span className="g7w-bracket">)</span>
        </span>
        <span className="g7w-bracket">]</span>
      </span>
      <span
        className={`g7w-op g7w-outer-low ${active('plusminus') ? 'is-rule-active' : ''}`}
        data-order={active('plusminus') ? '2' : undefined}
        style={{ '--g7w-order-delay': '180ms' }}
      >
        +
      </span>
      <span>3</span>
      <span
        className={`g7w-op g7w-outer-high ${active('multdiv') ? 'is-rule-active' : ''}`}
        data-order={active('multdiv') ? '2' : undefined}
        style={{ '--g7w-order-delay': '180ms' }}
      >
        ·
      </span>
      <span className={`g7w-bracket-group g7w-second-bracket ${active('bracket') ? 'is-rule-active' : ''}`}>
        <span className="g7w-bracket">(</span>
        <span>15</span>
        <span className="g7w-op">−</span>
        <span>9</span>
        <span className="g7w-bracket">)</span>
      </span>
    </div>
  )
}

function ChallengeScreen({ lang, speak, onRecord }) {
  const [running, setRunning] = useState(false)
  const [seconds, setSeconds] = useState(45)
  const [answer, setAnswer] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!running || saved || seconds <= 0) return undefined
    const timer = window.setInterval(() => {
      setSeconds((value) => Math.max(0, value - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [running, saved, seconds])

  const start = () => {
    setRunning(true)
    speak(textOf({
      ru: 'Время пошло. Решай как умеешь. Сейчас важно сохранить первую версию, а не угадать правильный ответ.',
      uz: 'Vaqt boshlandi. O‘zingiz bilgan usulda yeching. Hozir to‘g‘ri javobni topishdan ko‘ra birinchi fikrni saqlash muhim.',
    }, lang))
  }

  const save = () => {
    if (!answer) return
    setSaved(true)
    setRunning(false)
    onRecord({ hypothesis: Number(answer) })
    speak(textOf({
      ru: `Версия ${answer} сохранена без оценки. Мы вернёмся к ней после объяснения.`,
      uz: `${answer} javobi bahosiz saqlandi. Tushuntirishdan keyin unga qaytamiz.`,
    }, lang))
  }

  return (
    <div className="g7w-screen">
      <ScreenHeading screen={0} lang={lang} />
      <section className="g7w-frame g7w-challenge-frame">
        <div className="g7w-frame-topline">
          <div>
            <span>01</span>
            <strong>{textOf({ ru: 'Реши как умеешь', uz: 'O‘zingiz bilgan usulda yeching' }, lang)}</strong>
          </div>
          {running && (
            <div
              className={`g7w-timer ${seconds <= 10 ? 'is-ending' : ''}`}
              style={{ '--timer-progress': `${(seconds / 45) * 100}%` }}
            >
              <Clock3 size={17} />
              <strong>{seconds}</strong>
              <small>{textOf({ ru: 'сек', uz: 'son' }, lang)}</small>
            </div>
          )}
        </div>

        <div className="g7w-expression-window">
          <MathExpression />
        </div>

        {!running && !saved && (
          <div className="g7w-start-panel">
            <p>{textOf({
              ru: 'Когда будешь готов, запусти 45 секунд.',
              uz: 'Tayyor bo‘lsangiz, 45 soniyani boshlang.',
            }, lang)}</p>
            <button type="button" className="g7w-primary g7w-start-button" onClick={start}>
              <Play size={18} fill="currentColor" />
              {textOf({ ru: 'Начать', uz: 'Boshlash' }, lang)}
            </button>
          </div>
        )}

        {running && !saved && (
          <motion.div className="g7w-answer-row" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <label>
              <span>{textOf({ ru: 'Моя первая версия', uz: 'Mening birinchi javobim' }, lang)}</span>
              <input
                value={answer}
                onChange={(event) => setAnswer(event.target.value.replace(/[^\d-]/g, ''))}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') save()
                }}
                inputMode="numeric"
                autoComplete="off"
                autoFocus
              />
            </label>
            <button type="button" className="g7w-primary" onClick={save} disabled={!answer}>
              <Check size={17} />
              {textOf({ ru: 'Сохранить', uz: 'Saqlash' }, lang)}
            </button>
          </motion.div>
        )}

        {saved && (
          <motion.div className="g7w-saved" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <span><Check size={17} /></span>
            <div>
              <strong>{textOf({ ru: `Версия: ${answer}`, uz: `Javob: ${answer}` }, lang)}</strong>
              <small>{textOf({ ru: 'Без оценки — проверим после объяснения', uz: 'Bahosiz — tushuntirishdan keyin tekshiramiz' }, lang)}</small>
            </div>
          </motion.div>
        )}
      </section>
    </div>
  )
}

const FIRST_STEP_OPTIONS = [
  {
    id: 'left',
    label: { ru: 'Начать с левого края', uz: 'Chap tomondan boshlash' },
    math: '120 − 84',
    result: {
      ru: 'Левее — не значит раньше. Скобки ещё не вычислены.',
      uz: 'Chapda turishi birinchi degani emas. Qavslar hali hisoblanmagan.',
    },
    explanation: {
      rule: {
        ru: 'Скобки выполняем раньше действий вне скобок.',
        uz: 'Qavslar tashqaridagi amallardan oldin bajariladi.',
      },
      work: {
        ru: 'Не 120 − 84. Сначала: (7 − 4) = 3.',
        uz: '120 − 84 emas. Avval: (7 − 4) = 3.',
      },
      result: {
        ru: 'Получаем: 120 − 84 : [2 · 3] + 3 · (15 − 9).',
        uz: 'Hosil bo‘ladi: 120 − 84 : [2 · 3] + 3 · (15 − 9).',
      },
    },
    speech: {
      ru: 'Если начать со ста двадцати минус восемьдесят четыре, мы нарушим порядок действий. Скобки выполняются раньше действий вне скобок. Поэтому сначала семь минус четыре равно три.',
      uz: 'Agar bir yuz yigirma minus sakson to‘rtdan boshlasak, amallar tartibini buzamiz. Qavslar tashqaridagi amallardan oldin bajariladi. Shuning uchun avval yetti minus to‘rt uchga teng.',
    },
  },
  {
    id: 'firstBracket',
    label: { ru: 'Начать внутри скобок', uz: 'Qavs ichidan boshlash' },
    math: '7 − 4',
    result: {
      ru: 'Верный старт: сначала самое внутреннее действие.',
      uz: 'To‘g‘ri boshlanish: avval eng ichki amal.',
    },
    explanation: {
      rule: {
        ru: 'Во вложенных скобках движемся изнутри наружу.',
        uz: 'Ichma-ich qavslarda ichkaridan tashqariga yuramiz.',
      },
      work: {
        ru: '(7 − 4) = 3, поэтому [2 · (7 − 4)] → [2 · 3].',
        uz: '(7 − 4) = 3, shuning uchun [2 · (7 − 4)] → [2 · 3].',
      },
      result: {
        ru: 'Первый шаг верный: внутренняя скобка стала числом 3.',
        uz: 'Birinchi qadam to‘g‘ri: ichki qavs 3 soniga aylandi.',
      },
    },
    speech: {
      ru: 'Правильный старт — семь минус четыре равно три. Это действие находится внутри круглых скобок, а круглые скобки — внутри квадратных. Поэтому два умножить на семь минус четыре превращается в два умножить на три.',
      uz: 'To‘g‘ri boshlanish — yetti minus to‘rt uchga teng. Bu amal dumaloq qavs ichida, dumaloq qavs esa kvadrat qavs ichida. Shuning uchun ikki ko‘paytiruv yetti minus to‘rt, ikki ko‘paytiruv uchga aylanadi.',
    },
  },
]

const EXPLANATION_LABELS = {
  rule: { ru: 'Правило', uz: 'Qoida' },
  work: { ru: 'Решение', uz: 'Yechim' },
  result: { ru: 'Вывод', uz: 'Xulosa' },
}

function WorkedExplanation({ explanation, lang }) {
  return (
    <div className="g7w-worked-explanation">
      <span className="g7w-worked-title">
        {textOf({ ru: 'Почему так?', uz: 'Nega shunday?' }, lang)}
      </span>
      <div className="g7w-worked-steps">
        {Object.keys(EXPLANATION_LABELS).map((key) => (
          <div className={`g7w-worked-step g7w-worked-step-${key}`} key={key}>
            <small>{textOf(EXPLANATION_LABELS[key], lang)}</small>
            <strong>{textOf(explanation[key], lang)}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}

function FirstStepScreen({ lang, speak, onRecord }) {
  const [active, setActive] = useState(null)
  const [visited, setVisited] = useState([])
  const nextId = !visited.includes('left') ? 'left' : !visited.includes('firstBracket') ? 'firstBracket' : null

  const choose = (option) => {
    setActive(option.id)
    const completesComparison = !visited.includes(option.id)
      && visited.length + 1 === FIRST_STEP_OPTIONS.length
    setVisited((previous) => {
      if (previous.includes(option.id)) return previous
      return [...previous, option.id]
    })
    if (completesComparison) onRecord({ comparedFirstSteps: true })
    speak(textOf(option.speech, lang))
  }

  const activeOption = FIRST_STEP_OPTIONS.find((option) => option.id === active)

  return (
    <div className="g7w-screen">
      <ScreenHeading screen={1} lang={lang} />
      <section className="g7w-frame g7w-compare-frame">
        <div className="g7w-frame-instruction">
          <span>01</span>
          <strong>{textOf({ ru: 'Нажми на оба первых шага', uz: 'Ikkala birinchi qadamni bosing' }, lang)}</strong>
        </div>

        <div className="g7w-expression-window g7w-expression-window-compact">
          <MathExpression focus={active} />
        </div>

        <div className="g7w-route-list">
          {FIRST_STEP_OPTIONS.map((option, index) => {
            const isVisited = visited.includes(option.id)
            const isActive = active === option.id
            return (
              <button
                type="button"
                key={option.id}
                className={`g7w-route-card ${isActive ? 'is-active' : ''} ${isVisited ? 'is-visited' : ''} ${nextId === option.id ? 'is-awaited' : ''}`}
                onClick={() => choose(option)}
              >
                <span>{isVisited ? <Check size={15} /> : index + 1}</span>
                <div>
                  <strong>{textOf(option.label, lang)}</strong>
                  <small>{option.math}</small>
                </div>
                <ArrowRight size={17} />
              </button>
            )
          })}
        </div>

        <div className={`g7w-explanation-strip ${active === 'left' ? 'is-warning' : active === 'firstBracket' ? 'is-success' : ''}`}>
          <AnimatePresence mode="wait">
            <motion.div
              className={activeOption ? 'g7w-worked-motion' : 'g7w-explanation-prompt'}
              key={active ?? 'prompt'}
              initial={{ opacity: 0, y: 7 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
            >
              {activeOption ? (
                <WorkedExplanation explanation={activeOption.explanation} lang={lang} />
              ) : (
                <>
                  <span>{textOf({ ru: 'Подсказка', uz: 'Ko‘rsatma' }, lang)}</span>
                  <strong>{textOf({ ru: 'Выбери первый маршрут.', uz: 'Birinchi yo‘lni tanlang.' }, lang)}</strong>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  )
}

const RULE_STEPS = [
  {
    id: 'brackets',
    label: { ru: 'Скобки', uz: 'Qavslar' },
    short: { ru: 'изнутри наружу', uz: 'ichkaridan tashqariga' },
    explanation: {
      rule: {
        ru: 'Скобки считаем изнутри наружу.',
        uz: 'Qavslarni ichkaridan tashqariga hisoblaymiz.',
      },
      work: {
        ru: '(7 − 4) = 3; (15 − 9) = 6; [2 · 3] = 6.',
        uz: '(7 − 4) = 3; (15 − 9) = 6; [2 · 3] = 6.',
      },
      result: {
        ru: '120 − 84 : 6 + 3 · 6',
        uz: '120 − 84 : 6 + 3 · 6',
      },
    },
    speech: {
      ru: 'Первая ступень — скобки. Считаем изнутри наружу. Семь минус четыре равно три. Пятнадцать минус девять равно шесть. Затем два умножить на три равно шесть. Получаем: сто двадцать минус восемьдесят четыре разделить на шесть плюс три умножить на шесть.',
      uz: 'Birinchi bosqich — qavslar. Ichkaridan tashqariga hisoblaymiz. Yetti minus to‘rt uchga teng. O‘n besh minus to‘qqiz oltiga teng. Keyin ikki ko‘paytiruv uch oltiga teng.',
    },
    focus: 'brackets',
  },
  {
    id: 'multdiv',
    label: { ru: 'Умножение и деление', uz: 'Ko‘paytirish va bo‘lish' },
    short: { ru: 'слева направо', uz: 'chapdan o‘ngga' },
    explanation: {
      rule: {
        ru: 'Умножение и деление выполняем слева направо.',
        uz: 'Ko‘paytirish va bo‘lishni chapdan o‘ngga bajaramiz.',
      },
      work: {
        ru: '84 : 6 = 14; затем 3 · 6 = 18.',
        uz: '84 : 6 = 14; keyin 3 · 6 = 18.',
      },
      result: {
        ru: '120 − 14 + 18',
        uz: '120 − 14 + 18',
      },
    },
    speech: {
      ru: 'Вторая ступень — умножение и деление слева направо. Сначала восемьдесят четыре разделить на шесть равно четырнадцать. Затем три умножить на шесть равно восемнадцать. Получаем: сто двадцать минус четырнадцать плюс восемнадцать.',
      uz: 'Ikkinchi bosqich — ko‘paytirish va bo‘lishni chapdan o‘ngga bajaramiz. Avval sakson to‘rtni oltiga bo‘lamiz, o‘n to‘rt chiqadi. Keyin uchni oltiga ko‘paytiramiz, o‘n sakkiz chiqadi.',
    },
    focus: 'multdiv',
  },
  {
    id: 'plusminus',
    label: { ru: 'Сложение и вычитание', uz: 'Qo‘shish va ayirish' },
    short: { ru: 'слева направо', uz: 'chapdan o‘ngga' },
    explanation: {
      rule: {
        ru: 'Сложение и вычитание выполняем слева направо.',
        uz: 'Qo‘shish va ayirishni chapdan o‘ngga bajaramiz.',
      },
      work: {
        ru: '120 − 14 = 106; затем 106 + 18 = 124.',
        uz: '120 − 14 = 106; keyin 106 + 18 = 124.',
      },
      result: {
        ru: 'Ответ: 124',
        uz: 'Javob: 124',
      },
    },
    speech: {
      ru: 'Третья ступень — сложение и вычитание слева направо. Сто двадцать минус четырнадцать равно сто шесть. Затем сто шесть плюс восемнадцать равно сто двадцать четыре. Ответ: сто двадцать четыре.',
      uz: 'Uchinchi bosqich — qo‘shish va ayirishni chapdan o‘ngga bajaramiz. Bir yuz yigirma minus o‘n to‘rt bir yuz oltiga teng. Keyin bir yuz olti plus o‘n sakkiz bir yuz yigirma to‘rtga teng.',
    },
    focus: 'plusminus',
  },
]

function RuleScreen({ lang, speak, onRecord }) {
  const [active, setActive] = useState(null)
  const [visited, setVisited] = useState([])
  const activeStep = RULE_STEPS.find((step) => step.id === active)
  const nextId = RULE_STEPS.find((step) => !visited.includes(step.id))?.id ?? null

  const choose = (step) => {
    setActive(step.id)
    const completesRule = !visited.includes(step.id)
      && visited.length + 1 === RULE_STEPS.length
    setVisited((previous) => {
      if (previous.includes(step.id)) return previous
      return [...previous, step.id]
    })
    if (completesRule) onRecord({ ruleExplored: true })
    speak(textOf(step.speech, lang))
  }

  return (
    <div className="g7w-screen">
      <ScreenHeading screen={2} lang={lang} />
      <section className="g7w-frame g7w-rule-frame">
        <div className="g7w-frame-instruction">
          <BookOpen size={18} />
          <strong>{textOf({ ru: 'Нажимай по порядку', uz: 'Tartib bilan bosing' }, lang)}</strong>
        </div>

        <div className="g7w-expression-window g7w-expression-window-compact">
          <MathExpression focus={activeStep?.focus} />
        </div>

        <div className="g7w-rule-list">
          {RULE_STEPS.map((step, index) => {
            const isVisited = visited.includes(step.id)
            const isActive = active === step.id
            return (
              <button
                type="button"
                key={step.id}
                className={`g7w-rule-card ${isActive ? 'is-active' : ''} ${isVisited ? 'is-visited' : ''} ${nextId === step.id ? 'is-awaited' : ''}`}
                onClick={() => choose(step)}
              >
                <span>{isVisited ? <Check size={14} /> : index + 1}</span>
                <strong>{textOf(step.label, lang)}</strong>
                <small>{textOf(step.short, lang)}</small>
              </button>
            )
          })}
        </div>

        <div className="g7w-rule-detail" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              className={activeStep ? 'g7w-worked-motion' : 'g7w-explanation-prompt'}
              key={active ?? 'empty'}
              initial={{ opacity: 0, y: 7 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
            >
              {activeStep ? (
                <WorkedExplanation explanation={activeStep.explanation} lang={lang} />
              ) : (
                <>
                  <span>{textOf({ ru: 'Подсказка', uz: 'Ko‘rsatma' }, lang)}</span>
                  <strong>{textOf({ ru: 'Начни со скобок.', uz: 'Qavslardan boshlang.' }, lang)}</strong>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  )
}

const SCREENS = [ChallengeScreen, FirstStepScreen, RuleScreen]

export default function Grade7Dars01({ lang: langProp, onFinished }) {
  const preview = !langProp
  const [previewLang, setPreviewLang] = useState('ru')
  const lang = langProp || previewLang
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState([])
  const [muted, setMuted] = useState(false)
  const { speak, stop } = useSpeech(lang, muted)
  const CurrentScreen = SCREENS[current]
  const copy = COPY[current]

  useEffect(() => {
    stop()
    if (muted) return undefined
    const timer = window.setTimeout(() => speak(textOf(copy.intro, lang)), 280)
    return () => {
      window.clearTimeout(timer)
      stop()
    }
  }, [copy.intro, current, lang, muted, speak, stop])

  const record = useCallback((data) => {
    setAnswers((previous) => {
      const next = [...previous]
      next[current] = { screen: current + 1, ...data }
      return next
    })
  }, [current])

  const next = () => {
    if (current < TOTAL - 1) {
      setCurrent((value) => value + 1)
      return
    }
    onFinished?.({
      lessonId: 'grade7-dars01-window-prototype',
      prototype: true,
      screens: TOTAL,
      answers: answers.filter(Boolean),
    })
  }

  const replay = useMemo(() => () => speak(textOf(copy.intro, lang)), [copy.intro, lang, speak])

  return (
    <main className="g7w-root">
      <section className="g7w-stage">
        <header className="g7w-header">
          <div className="g7w-progress" aria-label={`${current + 1} / ${TOTAL}`}>
            <i style={{ width: `${((current + 1) / TOTAL) * 100}%` }} />
          </div>
          <div className="g7w-chrome">
            <div className="g7w-chrome-title">
              <span />
              <strong>{textOf(copy.eyebrow, lang)}</strong>
            </div>
            <div className="g7w-tools">
              <span className="g7w-phase">{textOf({ ru: 'Обучение', uz: 'O‘rganish' }, lang)}</span>
              <button type="button" onClick={() => setMuted((value) => !value)} aria-label={muted ? 'Включить звук' : 'Выключить звук'}>
                {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
              </button>
              {!muted && (
                <button type="button" onClick={replay} aria-label="Повторить объяснение">
                  <span className="g7w-replay">↻</span>
                </button>
              )}
              {preview && (
                <div className="g7w-lang">
                  {['ru', 'uz'].map((code) => (
                    <button
                      type="button"
                      key={code}
                      className={lang === code ? 'is-active' : ''}
                      onClick={() => {
                        stop()
                        setPreviewLang(code)
                      }}
                    >
                      {code.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}
              <span className="g7w-count">{String(current + 1).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}</span>
            </div>
          </div>
        </header>

        <div className="g7w-content">
          <CurrentScreen key={`${current}-${lang}`} lang={lang} speak={speak} onRecord={record} />
        </div>

        <footer className="g7w-nav">
          <button
            type="button"
            className="g7w-back"
            onClick={() => setCurrent((value) => Math.max(0, value - 1))}
            disabled={current === 0}
          >
            <ArrowLeft size={18} />
            {textOf({ ru: 'Назад', uz: 'Orqaga' }, lang)}
          </button>
          <span>{textOf({ ru: 'Прототип экранов 1–3', uz: '1–3 ekran prototipi' }, lang)}</span>
          <button type="button" className="g7w-next" onClick={next}>
            {current === TOTAL - 1
              ? textOf({ ru: 'Оценить направление', uz: 'Yo‘nalishni baholash' }, lang)
              : textOf({ ru: 'Дальше', uz: 'Davom etish' }, lang)}
            {current === TOTAL - 1 ? <Check size={18} /> : <ArrowRight size={18} />}
          </button>
        </footer>
      </section>
    </main>
  )
}
