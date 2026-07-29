import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  Eye,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
} from 'lucide-react'
import './Dars01.css'

const TOTAL = 3
const EXPRESSION = '120 − 84 : [2 · (7 − 4)] + 3 · (15 − 9)'

const COPY = [
  {
    eyebrow: { ru: 'Математический детектив', uz: 'Matematik detektiv' },
    title: { ru: 'Два ответа. Один маршрут.', uz: 'Ikki javob. Bitta yo‘l.' },
    hint: {
      ru: 'Не ищи правило. Сначала запиши свою версию.',
      uz: 'Hozircha qoida izlamang. Avval o‘z taxminingizni yozing.',
    },
    narration: {
      ru: 'Один и тот же пример дал два разных ответа. Азиз получил сто двадцать четыре, а Малика — пятьдесят четыре. У тебя сорок пять секунд. Посмотри на выражение, реши его привычным способом и запиши первую версию. Она не оценивается.',
      uz: 'Bitta misoldan ikki xil javob chiqdi. Aziz bir yuz yigirma to‘rt, Malika esa ellik to‘rt javobini oldi. Sizda qirq besh soniya bor. Ifodaga qarang, odatdagi usulda yeching va birinchi taxminni yozing. U baholanmaydi.',
    },
  },
  {
    eyebrow: { ru: 'Сначала видим структуру', uz: 'Avval tuzilishni ko‘ramiz' },
    title: { ru: 'У выражения есть глубина', uz: 'Ifodaning chuqurligi bor' },
    hint: {
      ru: 'Запусти сканирование и наблюдай за формулой.',
      uz: 'Skanerlashni ishga tushiring va formulani kuzating.',
    },
    narration: {
      ru: 'До вычислений нужно увидеть структуру. У выражения есть уровни. Самый глубокий уровень находится внутри круглых скобок. Внешний уровень — внутри квадратных скобок. Остальные действия ждут своей очереди.',
      uz: 'Hisoblashdan oldin tuzilishni ko‘rish kerak. Ifodaning darajalari bor. Eng chuqur daraja dumaloq qavslar ichida. Tashqi daraja kvadrat qavslar ichida. Qolgan amallar o‘z navbatini kutadi.',
    },
  },
  {
    eyebrow: { ru: 'Первое преобразование', uz: 'Birinchi o‘zgarish' },
    title: { ru: 'Скобка становится числом', uz: 'Qavs songa aylanadi' },
    hint: {
      ru: 'Запусти преобразование: формула объяснит правило сама.',
      uz: 'O‘zgarishni boshlang: formula qoidani o‘zi tushuntiradi.',
    },
    narration: {
      ru: 'Начинаем с самой глубокой части. Семь минус четыре равно трём. После вычисления вся круглая скобка заменяется одним числом — тройкой. Так выражение становится короче, а его значение не меняется.',
      uz: 'Eng chuqur qismdan boshlaymiz. Yetti minus to‘rt uchga teng. Hisoblangandan keyin butun dumaloq qavs bitta son — uch bilan almashtiriladi. Ifoda qisqaradi, ammo uning qiymati o‘zgarmaydi.',
    },
  },
]

const t = (value, lang) => value?.[lang] ?? value?.ru ?? value ?? ''

function useMobileScale() {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 640) {
        setScale(1)
        return
      }
      setScale(Math.min(window.innerWidth / 390, window.innerHeight / 780, 1))
    }
    update()
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [])

  return scale
}

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
    <div className="g7p-heading">
      <span>{t(copy.eyebrow, lang)}</span>
      <h1>{t(copy.title, lang)}</h1>
      <p>{t(copy.hint, lang)}</p>
    </div>
  )
}

function HookScreen({ lang, speak, onRecord }) {
  const [seconds, setSeconds] = useState(45)
  const [answer, setAnswer] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (saved || seconds <= 0) return undefined
    const timer = window.setInterval(() => {
      setSeconds((value) => Math.max(0, value - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [saved, seconds])

  const save = () => {
    if (!answer) return
    setSaved(true)
    onRecord({ hypothesis: Number(answer) })
    speak(t({
      ru: 'Версия сохранена. На следующих экранах мы не будем угадывать ответ — проследим за движением самой формулы.',
      uz: 'Taxmin saqlandi. Keyingi ekranlarda javobni taxmin qilmaymiz — formulaning o‘zgarishini kuzatamiz.',
    }, lang))
  }

  return (
    <div className="g7p-screen">
      <ScreenHeading screen={0} lang={lang} />
      <section className="g7p-open-scene g7p-hook-scene">
        <div className="g7p-answer-signals" aria-label={t({ ru: 'Два разных ответа', uz: 'Ikki xil javob' }, lang)}>
          <motion.div initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
            <span>Азиз</span>
            <strong>124</strong>
          </motion.div>
          <span className="g7p-signal-line" />
          <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.42 }}>
            <strong>54</strong>
            <span>Малика</span>
          </motion.div>
        </div>

        <motion.div
          className="g7p-anchor-expression"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.55 }}
        >
          {EXPRESSION}
        </motion.div>

        <div className="g7p-hook-action">
          <div className="g7p-visual-instruction">
            <span>01</span>
            <p>{t({ ru: 'Посмотри на весь пример', uz: 'Butun misolga qarang' }, lang)}</p>
            <i />
            <span>02</span>
            <p>{t({ ru: 'Запиши первую версию', uz: 'Birinchi taxminni yozing' }, lang)}</p>
          </div>

          <div
            className={`g7p-inline-timer ${seconds <= 10 ? 'is-ending' : ''}`}
            style={{ '--timer-progress': `${(seconds / 45) * 100}%` }}
          >
            <Clock3 size={16} />
            <strong>{seconds}</strong>
            <small>{t({ ru: 'сек', uz: 'son' }, lang)}</small>
          </div>
        </div>

        <div className="g7p-answer-dock">
          {!saved ? (
            <>
              <label>
                <span>{t({ ru: 'Моя версия', uz: 'Mening taxminim' }, lang)}</span>
                <input
                  value={answer}
                  onChange={(event) => setAnswer(event.target.value.replace(/[^\d-]/g, ''))}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') save()
                  }}
                  inputMode="numeric"
                  autoComplete="off"
                />
              </label>
              <button type="button" onClick={save} disabled={!answer}>
                <Check size={17} />
                {t({ ru: 'Сохранить', uz: 'Saqlash' }, lang)}
              </button>
            </>
          ) : (
            <motion.div className="g7p-saved-hypothesis" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <Check size={17} />
              <span>{t({ ru: `Версия ${answer} сохранена без оценки`, uz: `${answer} taxmini bahosiz saqlandi` }, lang)}</span>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}

function DepthExpression({ phase }) {
  return (
    <div className={`g7p-depth-expression phase-${phase}`}>
      <span className="plain">120 − 84 : </span>
      <span className="outer-bracket">[</span>
      <span className="outer-zone">
        <span className="plain">2 · </span>
        <span className="inner-zone">(7 − 4)</span>
      </span>
      <span className="outer-bracket">]</span>
      <span className="plain"> + 3 · </span>
      <span className="inner-zone second">(15 − 9)</span>
      <span className="g7p-scan-beam" />
    </div>
  )
}

function DepthScreen({ lang, speak, onRecord }) {
  const [phase, setPhase] = useState(0)
  const timers = useRef([])

  useEffect(() => () => {
    timers.current.forEach((timer) => window.clearTimeout(timer))
  }, [])

  const run = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer))
    setPhase(1)
    speak(t({
      ru: 'Первый уровень. Самые глубокие части — круглые скобки.',
      uz: 'Birinchi daraja. Eng chuqur qismlar — dumaloq qavslar.',
    }, lang))
    timers.current = [
      window.setTimeout(() => {
        setPhase(2)
        speak(t({
          ru: 'Второй уровень. После внутренней скобки работает квадратная.',
          uz: 'Ikkinchi daraja. Ichki qavsdan keyin kvadrat qavs ishlaydi.',
        }, lang))
      }, 1450),
      window.setTimeout(() => {
        setPhase(3)
        speak(t({
          ru: 'Третий уровень. Остальные действия начнутся только после скобок. Структура задаёт маршрут решения.',
          uz: 'Uchinchi daraja. Qolgan amallar faqat qavslardan keyin boshlanadi. Tuzilish yechim yo‘lini belgilaydi.',
        }, lang))
        onRecord({ structureSeen: true })
      }, 2950),
    ]
  }

  return (
    <div className="g7p-screen">
      <ScreenHeading screen={1} lang={lang} />
      <section className="g7p-open-scene g7p-depth-scene">
        <div className="g7p-scene-label">
          <Eye size={17} />
          <span>{t({ ru: 'Смотрим, пока не считаем', uz: 'Hozircha hisoblamaymiz, kuzatamiz' }, lang)}</span>
        </div>

        <DepthExpression phase={phase} />

        <div className={`g7p-depth-route phase-${phase}`}>
          <div className={phase >= 1 ? 'is-active' : ''}>
            <span>1</span>
            <strong>( )</strong>
            <small>{t({ ru: 'глубже', uz: 'chuqur' }, lang)}</small>
          </div>
          <i />
          <div className={phase >= 2 ? 'is-active' : ''}>
            <span>2</span>
            <strong>[ ]</strong>
            <small>{t({ ru: 'снаружи', uz: 'tashqarida' }, lang)}</small>
          </div>
          <i />
          <div className={phase >= 3 ? 'is-active' : ''}>
            <span>3</span>
            <strong>· : + −</strong>
            <small>{t({ ru: 'потом', uz: 'keyin' }, lang)}</small>
          </div>
        </div>

        <div className="g7p-scene-controls">
          <button type="button" className="g7p-play-button" onClick={run}>
            {phase === 0 ? <Play size={17} fill="currentColor" /> : <RotateCcw size={17} />}
            {phase === 0
              ? t({ ru: 'Показать глубину', uz: 'Chuqurlikni ko‘rsatish' }, lang)
              : t({ ru: 'Повторить сканирование', uz: 'Skanerlashni takrorlash' }, lang)}
          </button>
          <AnimatePresence>
            {phase === 3 && (
              <motion.p
                className="g7p-rule-line"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <span>{t({ ru: 'Вывод', uz: 'Xulosa' }, lang)}</span>
                {t({ ru: 'Порядок диктует структура, а не положение слева.', uz: 'Tartibni chapdagi joy emas, tuzilish belgilaydi.' }, lang)}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  )
}

function TransformScreen({ lang, speak, onRecord }) {
  const [phase, setPhase] = useState(0)
  const timers = useRef([])

  useEffect(() => () => {
    timers.current.forEach((timer) => window.clearTimeout(timer))
  }, [])

  const run = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer))
    setPhase(1)
    speak(t({
      ru: 'Фокусируемся на самой глубокой скобке: семь минус четыре.',
      uz: 'Eng chuqur qavsga e’tibor beramiz: yetti minus to‘rt.',
    }, lang))
    timers.current = [
      window.setTimeout(() => {
        setPhase(2)
        speak(t({
          ru: 'Семь минус четыре равно трём.',
          uz: 'Yetti minus to‘rt uchga teng.',
        }, lang))
      }, 1250),
      window.setTimeout(() => {
        setPhase(3)
        speak(t({
          ru: 'Всю скобку заменяем числом три. Выражение стало короче, но осталось равным исходному.',
          uz: 'Butun qavsni uch soni bilan almashtiramiz. Ifoda qisqardi, ammo dastlabki ifodaga teng bo‘lib qoldi.',
        }, lang))
        onRecord({ firstTransformation: true })
      }, 2600),
    ]
  }

  return (
    <div className="g7p-screen">
      <ScreenHeading screen={2} lang={lang} />
      <section className={`g7p-open-scene g7p-transform-scene phase-${phase}`}>
        <div className="g7p-transform-stage">
          <AnimatePresence mode="wait">
            {phase === 0 && (
              <motion.div
                key="whole"
                className="g7p-whole-expression"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
              >
                <span>120 − 84 : [2 · </span>
                <strong>(7 − 4)</strong>
                <span>] + 3 · (15 − 9)</span>
              </motion.div>
            )}

            {phase === 1 && (
              <motion.div
                key="focus"
                className="g7p-focus-fragment"
                layoutId="inner-bracket"
                initial={{ opacity: 0, scale: 0.75 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <span>(</span><b>7</b><i>−</i><b>4</b><span>)</span>
              </motion.div>
            )}

            {phase === 2 && (
              <motion.div
                key="calculation"
                className="g7p-live-calculation"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <motion.b initial={{ x: -28 }} animate={{ x: 0 }}>7</motion.b>
                <motion.i initial={{ scale: 0.6 }} animate={{ scale: 1 }}>−</motion.i>
                <motion.b initial={{ x: 28 }} animate={{ x: 0 }}>4</motion.b>
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>=</motion.span>
                <motion.strong
                  initial={{ opacity: 0, scale: 0.4, rotate: -12 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 0.55, type: 'spring', stiffness: 240 }}
                >
                  3
                </motion.strong>
              </motion.div>
            )}

            {phase === 3 && (
              <motion.div
                key="result"
                className="g7p-whole-expression g7p-result-expression"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span>120 − 84 : [2 · </span>
                <motion.strong initial={{ scale: 1.45 }} animate={{ scale: 1 }}>3</motion.strong>
                <span>] + 3 · (15 − 9)</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="g7p-transform-caption" aria-live="polite">
          <span className={phase >= 1 ? 'is-active' : ''}>
            <b>1</b>{t({ ru: 'выбираем скобку', uz: 'qavsni tanlaymiz' }, lang)}
          </span>
          <i />
          <span className={phase >= 2 ? 'is-active' : ''}>
            <b>2</b>{t({ ru: 'вычисляем', uz: 'hisoblaymiz' }, lang)}
          </span>
          <i />
          <span className={phase >= 3 ? 'is-active' : ''}>
            <b>3</b>{t({ ru: 'заменяем числом', uz: 'son bilan almashtiramiz' }, lang)}
          </span>
        </div>

        <div className="g7p-scene-controls">
          <button type="button" className="g7p-play-button" onClick={run}>
            {phase === 0 ? <Play size={17} fill="currentColor" /> : <RotateCcw size={17} />}
            {phase === 0
              ? t({ ru: 'Запустить преобразование', uz: 'O‘zgarishni boshlash' }, lang)
              : t({ ru: 'Посмотреть ещё раз', uz: 'Yana bir bor ko‘rish' }, lang)}
          </button>
          <AnimatePresence>
            {phase === 3 && (
              <motion.p
                className="g7p-rule-line"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span>{t({ ru: 'Правило', uz: 'Qoida' }, lang)}</span>
                {t({ ru: 'Вычисленную скобку заменяем одним числом.', uz: 'Hisoblangan qavsni bitta son bilan almashtiramiz.' }, lang)}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  )
}

const SCREENS = [HookScreen, DepthScreen, TransformScreen]

export default function Grade7Dars01({ lang: langProp, onFinished }) {
  const preview = !langProp
  const [previewLang, setPreviewLang] = useState('ru')
  const lang = langProp || previewLang
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState([])
  const [muted, setMuted] = useState(false)
  const scale = useMobileScale()
  const { speak, stop } = useSpeech(lang, muted)
  const CurrentScreen = SCREENS[current]
  const copy = COPY[current]

  useEffect(() => {
    stop()
    if (muted) return undefined
    const timer = window.setTimeout(() => speak(t(copy.narration, lang)), 260)
    return () => {
      window.clearTimeout(timer)
      stop()
    }
  }, [copy.narration, current, lang, muted, speak, stop])

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
      lessonId: 'grade7-dars01-prototype-v3',
      prototype: true,
      screens: TOTAL,
      answers: answers.filter(Boolean),
    })
  }

  return (
    <main className="g7p-root" style={{ '--g7p-scale': scale }}>
      <div className="g7p-ambient g7p-ambient-a" />
      <div className="g7p-ambient g7p-ambient-b" />
      <section className="g7p-stage">
        <header className="g7p-header">
          <div className="g7p-progress"><i style={{ width: `${((current + 1) / TOTAL) * 100}%` }} /></div>
          <div className="g7p-chrome">
            <div className="g7p-chrome-title">
              <span />
              <strong>{t(copy.eyebrow, lang)}</strong>
            </div>
            <div className="g7p-tools">
              <span className="g7p-prototype-pill">{t({ ru: 'Прототип', uz: 'Prototip' }, lang)}</span>
              <button type="button" onClick={() => setMuted((value) => !value)} aria-label={muted ? 'Включить звук' : 'Выключить звук'}>
                {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
              </button>
              {preview && (
                <div className="g7p-lang">
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
              <span className="g7p-count">{String(current + 1).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}</span>
            </div>
          </div>
        </header>

        <div className="g7p-content">
          <CurrentScreen key={`${current}-${lang}`} lang={lang} speak={speak} onRecord={record} />
        </div>

        <footer className="g7p-nav">
          <button
            type="button"
            className="g7p-back"
            onClick={() => setCurrent((value) => Math.max(0, value - 1))}
            disabled={current === 0}
          >
            <ArrowLeft size={18} />
            {t({ ru: 'Назад', uz: 'Orqaga' }, lang)}
          </button>
          <span>{t({ ru: '3 экрана для утверждения', uz: 'Tasdiqlash uchun 3 ekran' }, lang)}</span>
          <button type="button" className="g7p-next" onClick={next}>
            {current === TOTAL - 1
              ? t({ ru: 'Оценить прототип', uz: 'Prototipni baholash' }, lang)
              : t({ ru: 'Дальше', uz: 'Davom etish' }, lang)}
            {current === TOTAL - 1 ? <Check size={18} /> : <ArrowRight size={18} />}
          </button>
        </footer>
      </section>
    </main>
  )
}
