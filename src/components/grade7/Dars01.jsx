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

const TOTAL = 16

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
  {
    eyebrow: { ru: 'Способ 1 · по строкам', uz: '1-usul · qatorlar bo‘yicha' },
    title: { ru: 'Скобки становятся числами', uz: 'Qavslar sonlarga aylanadi' },
    intro: {
      ru: 'Начинаем решение по строкам. Нажимай шаги по порядку: сначала внутренние круглые скобки, затем внешние квадратные.',
      uz: 'Yechimni qatorlar bo‘yicha boshlaymiz. Avval ichki dumaloq qavslarni, keyin tashqi kvadrat qavslarni hisoblang.',
    },
  },
  {
    eyebrow: { ru: 'Способ 1 · по строкам', uz: '1-usul · qatorlar bo‘yicha' },
    title: { ru: 'Деление и умножение', uz: 'Bo‘lish va ko‘paytirish' },
    intro: {
      ru: 'Скобок больше нет. Деление и умножение имеют одинаковый приоритет, поэтому выполняем их слева направо.',
      uz: 'Qavslar qolmadi. Bo‘lish va ko‘paytirish teng ustuvorlikka ega, shuning uchun chapdan o‘ngga bajaramiz.',
    },
  },
  {
    eyebrow: { ru: 'Способ 1 · по строкам', uz: '1-usul · qatorlar bo‘yicha' },
    title: { ru: 'Финиш слева направо', uz: 'Chapdan o‘ngga yakunlaymiz' },
    intro: {
      ru: 'Остались сложение и вычитание. Они тоже равноправны: сначала левое действие, затем следующее.',
      uz: 'Qo‘shish va ayirish qoldi. Ular ham teng: avval chapdagi amalni, keyin navbatdagisini bajaramiz.',
    },
  },
  {
    eyebrow: { ru: 'Способ 2 · школьная запись', uz: '2-usul · maktab yozuvi' },
    title: { ru: 'Ставим номера над действиями', uz: 'Amallar ustiga raqam qo‘yamiz' },
    intro: {
      ru: 'Второй школьный способ — заранее обозначить порядок. Нажимай кнопку: номера появятся над действиями от первого к последнему.',
      uz: 'Ikkinchi maktab usuli — tartibni oldindan belgilash. Tugmani bosing: raqamlar amallar ustida birinchidan oxirigacha paydo bo‘ladi.',
    },
  },
  {
    eyebrow: { ru: 'Способ 2 · вычисляем', uz: '2-usul · hisoblaymiz' },
    title: { ru: 'Решаем строго по номерам', uz: 'Raqamlar bo‘yicha yechamiz' },
    intro: {
      ru: 'Номера уже расставлены. Нажимай их по порядку и следи, какое вычисление соответствует каждому номеру.',
      uz: 'Raqamlar qo‘yildi. Ularni tartib bilan bosing va har bir raqamga qaysi hisob mos kelishini kuzating.',
    },
  },
  {
    eyebrow: { ru: 'Тренировка · первый шаг', uz: 'Mashq · birinchi qadam' },
    title: { ru: 'С чего начнём?', uz: 'Nimadan boshlaymiz?' },
    intro: {
      ru: 'Выбери первое действие. Ищи скобки раньше действий вне скобок.',
      uz: 'Birinchi amalni tanlang. Avval qavs ichidagi amalni izlang.',
    },
  },
  {
    eyebrow: { ru: 'Тренировка · порядок', uz: 'Mashq · tartib' },
    title: { ru: 'Собери цепочку действий', uz: 'Amallar zanjirini tuzing' },
    intro: {
      ru: 'Нажимай вычисления в правильном порядке. При равном приоритете двигайся слева направо.',
      uz: 'Hisoblarni to‘g‘ri tartibda bosing. Ustuvorlik teng bo‘lsa, chapdan o‘ngga yuring.',
    },
  },
  {
    eyebrow: { ru: 'Тренировка · типовой пример', uz: 'Mashq · odatiy misol' },
    title: { ru: 'Найди значение выражения', uz: 'Ifoda qiymatini toping' },
    intro: {
      ru: 'Сначала скобки, затем умножение, после этого вычитание. Выбери ответ.',
      uz: 'Avval qavs, keyin ko‘paytirish, so‘ng ayirish. Javobni tanlang.',
    },
  },
  {
    eyebrow: { ru: 'Тренировка · найди ошибку', uz: 'Mashq · xatoni toping' },
    title: { ru: 'Какое решение верное?', uz: 'Qaysi yechim to‘g‘ri?' },
    intro: {
      ru: 'Сравни две короткие записи. Верное решение соблюдает приоритет деления.',
      uz: 'Ikki qisqa yozuvni solishtiring. To‘g‘ri yechim bo‘lish ustuvorligini saqlaydi.',
    },
  },
  {
    eyebrow: { ru: 'Тренировка · с подсказкой', uz: 'Mashq · ko‘rsatma bilan' },
    title: { ru: 'Проведи выражение по шагам', uz: 'Ifodani bosqichma-bosqich yeching' },
    intro: {
      ru: 'На каждом этапе выбирай только следующее действие. Выражение будет становиться короче.',
      uz: 'Har bosqichda faqat keyingi amalni tanlang. Ifoda qisqarib boradi.',
    },
  },
  {
    eyebrow: { ru: 'Тренировка · равный приоритет', uz: 'Mashq · teng ustuvorlik' },
    title: { ru: 'Не складывай раньше времени', uz: 'Vaqtidan oldin qo‘shmang' },
    intro: {
      ru: 'Сложение и вычитание равноправны. Определи первое действие по направлению слева направо.',
      uz: 'Qo‘shish va ayirish teng. Birinchi amalni chapdan o‘ngga qarab aniqlang.',
    },
  },
  {
    eyebrow: { ru: 'Тренировка · самостоятельно', uz: 'Mashq · mustaqil' },
    title: { ru: 'Теперь реши сам', uz: 'Endi o‘zingiz yeching' },
    intro: {
      ru: 'Реши без таймера и введи только итоговый ответ. После проверки увидишь короткую цепочку.',
      uz: 'Taymersiz yeching va faqat yakuniy javobni kiriting. Tekshiruvdan keyin qisqa zanjirni ko‘rasiz.',
    },
  },
  {
    eyebrow: { ru: 'Возвращаемся к гипотезе', uz: 'Taxminga qaytamiz' },
    title: { ru: 'Первый пример раскрыт', uz: 'Birinchi misol yechildi' },
    intro: {
      ru: 'Сравни первую версию с ответом сто двадцать четыре. Главное — теперь ты можешь объяснить каждый шаг.',
      uz: 'Birinchi javobni bir yuz yigirma to‘rt bilan solishtiring. Muhimi — endi har bir qadamni tushuntira olasiz.',
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
        ru: '120 − 84 : [2 · 3] + 3 · (15 − 9)',
        uz: '120 − 84 : [2 · 3] + 3 · (15 − 9)',
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
        ru: 'Внутренняя скобка → 3',
        uz: 'Ichki qavs → 3',
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
      {Object.keys(EXPLANATION_LABELS).map((key, index) => (
        <motion.div
          className={`g7w-worked-row g7w-worked-row-${key}`}
          custom={index}
          initial={{ opacity: 0, y: 12, scale: 0.992 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            delay: 0.16 + index * 0.38,
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
          key={key}
        >
          {key === 'rule' ? (
            <>
              <span className="g7w-worked-title">
                {textOf({ ru: 'Почему так?', uz: 'Nega shunday?' }, lang)}
              </span>
              <div className="g7w-worked-copy">
                <small>{textOf(EXPLANATION_LABELS[key], lang)}</small>
                <strong>{textOf(explanation[key], lang)}</strong>
              </div>
            </>
          ) : (
            <>
              <small>{textOf(EXPLANATION_LABELS[key], lang)}</small>
              <strong>{textOf(explanation[key], lang)}</strong>
            </>
          )}
        </motion.div>
      ))}
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
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
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
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
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

const LINE_METHOD_SCREENS = [
  {
    screen: 3,
    id: 'brackets-by-lines',
    initial: '120 − 84 : [2 · (7 − 4)] + 3 · (15 − 9)',
    prompt: {
      ru: 'Начни с действия 7 − 4.',
      uz: '7 − 4 amalidan boshlang.',
    },
    steps: [
      {
        id: 'inner-bracket',
        action: '(7 − 4) = 3',
        expression: '120 − 84 : [2 · 3] + 3 · (15 − 9)',
        explanation: {
          rule: {
            ru: 'Во вложенных скобках начинаем изнутри.',
            uz: 'Ichma-ich qavslarda ichkaridan boshlaymiz.',
          },
          work: { ru: '(7 − 4) = 3', uz: '(7 − 4) = 3' },
          result: {
            ru: '[2 · (7 − 4)] → [2 · 3]',
            uz: '[2 · (7 − 4)] → [2 · 3]',
          },
        },
        speech: {
          ru: 'Первый шаг: семь минус четыре равно три. В квадратных скобках вместо круглых скобок записываем число три.',
          uz: 'Birinchi qadam: yetti minus to‘rt uchga teng. Kvadrat qavs ichida dumaloq qavs o‘rniga uch sonini yozamiz.',
        },
      },
      {
        id: 'second-bracket',
        action: '(15 − 9) = 6',
        expression: '120 − 84 : [2 · 3] + 3 · 6',
        explanation: {
          rule: {
            ru: 'Независимую скобку считаем отдельно.',
            uz: 'Mustaqil qavsni alohida hisoblaymiz.',
          },
          work: { ru: '(15 − 9) = 6', uz: '(15 − 9) = 6' },
          result: {
            ru: '3 · (15 − 9) → 3 · 6',
            uz: '3 · (15 − 9) → 3 · 6',
          },
        },
        speech: {
          ru: 'Второй шаг: пятнадцать минус девять равно шесть. Вместо второй круглой скобки записываем шесть.',
          uz: 'Ikkinchi qadam: o‘n besh minus to‘qqiz oltiga teng. Ikkinchi dumaloq qavs o‘rniga olti yozamiz.',
        },
      },
      {
        id: 'square-bracket',
        action: '[2 · 3] = 6',
        expression: '120 − 84 : 6 + 3 · 6',
        explanation: {
          rule: {
            ru: 'После внутренних скобок считаем внешние.',
            uz: 'Ichki qavslardan keyin tashqi qavsni hisoblaymiz.',
          },
          work: { ru: '[2 · 3] = 6', uz: '[2 · 3] = 6' },
          result: {
            ru: '120 − 84 : 6 + 3 · 6',
            uz: '120 − 84 : 6 + 3 · 6',
          },
        },
        speech: {
          ru: 'Третий шаг: два умножить на три равно шесть. Все скобки превратились в числа.',
          uz: 'Uchinchi qadam: ikki ko‘paytiruv uch oltiga teng. Barcha qavslar sonlarga aylandi.',
        },
      },
    ],
  },
  {
    screen: 4,
    id: 'multiply-divide-by-lines',
    initial: '120 − 84 : 6 + 3 · 6',
    prompt: {
      ru: 'Сначала выполни левое действие: 84 : 6.',
      uz: 'Avval chapdagi amalni bajaring: 84 : 6.',
    },
    steps: [
      {
        id: 'division',
        action: '84 : 6 = 14',
        expression: '120 − 14 + 3 · 6',
        explanation: {
          rule: {
            ru: 'Деление и умножение выполняем слева направо.',
            uz: 'Bo‘lish va ko‘paytirishni chapdan o‘ngga bajaramiz.',
          },
          work: { ru: '84 : 6 = 14', uz: '84 : 6 = 14' },
          result: {
            ru: '120 − 14 + 3 · 6',
            uz: '120 − 14 + 3 · 6',
          },
        },
        speech: {
          ru: 'Слева первым встречается деление. Восемьдесят четыре разделить на шесть равно четырнадцать.',
          uz: 'Chapdan birinchi bo‘lish amali keladi. Sakson to‘rtni oltiga bo‘lsak, o‘n to‘rt chiqadi.',
        },
      },
      {
        id: 'multiplication',
        action: '3 · 6 = 18',
        expression: '120 − 14 + 18',
        explanation: {
          rule: {
            ru: 'Затем выполняем следующее действие той же ступени.',
            uz: 'Keyin shu bosqichdagi navbatdagi amalni bajaramiz.',
          },
          work: { ru: '3 · 6 = 18', uz: '3 · 6 = 18' },
          result: {
            ru: '120 − 14 + 18',
            uz: '120 − 14 + 18',
          },
        },
        speech: {
          ru: 'Теперь умножение: три умножить на шесть равно восемнадцать. Умножения и деления больше нет.',
          uz: 'Endi ko‘paytirish: uchni oltiga ko‘paytirsak, o‘n sakkiz chiqadi. Ko‘paytirish va bo‘lish amallari qolmadi.',
        },
      },
    ],
  },
  {
    screen: 5,
    id: 'add-subtract-by-lines',
    initial: '120 − 14 + 18',
    prompt: {
      ru: 'Вычитание и сложение выполняй слева направо.',
      uz: 'Ayirish va qo‘shishni chapdan o‘ngga bajaring.',
    },
    steps: [
      {
        id: 'subtraction',
        action: '120 − 14 = 106',
        expression: '106 + 18',
        explanation: {
          rule: {
            ru: 'Сложение и вычитание равноправны.',
            uz: 'Qo‘shish va ayirish teng ustuvorlikka ega.',
          },
          work: { ru: '120 − 14 = 106', uz: '120 − 14 = 106' },
          result: { ru: '106 + 18', uz: '106 + 18' },
        },
        speech: {
          ru: 'Идём слева направо. Сто двадцать минус четырнадцать равно сто шесть.',
          uz: 'Chapdan o‘ngga yuramiz. Bir yuz yigirma minus o‘n to‘rt bir yuz oltiga teng.',
        },
      },
      {
        id: 'addition',
        action: '106 + 18 = 124',
        expression: '124',
        explanation: {
          rule: {
            ru: 'Выполняем последнее оставшееся действие.',
            uz: 'Oxirgi qolgan amalni bajaramiz.',
          },
          work: { ru: '106 + 18 = 124', uz: '106 + 18 = 124' },
          result: { ru: 'Ответ: 124', uz: 'Javob: 124' },
        },
        speech: {
          ru: 'Последний шаг: сто шесть плюс восемнадцать равно сто двадцать четыре. Ответ: сто двадцать четыре.',
          uz: 'Oxirgi qadam: bir yuz olti plus o‘n sakkiz bir yuz yigirma to‘rtga teng. Javob: bir yuz yigirma to‘rt.',
        },
      },
    ],
  },
]

function LineMethodScreen({ config, lang, speak, onRecord }) {
  const [active, setActive] = useState(null)
  const [visited, setVisited] = useState([])
  const activeStep = config.steps.find((step) => step.id === active)
  const nextId = config.steps.find((step) => !visited.includes(step.id))?.id ?? null

  const choose = (step) => {
    setActive(step.id)
    const completesScreen = !visited.includes(step.id)
      && visited.length + 1 === config.steps.length
    setVisited((previous) => (
      previous.includes(step.id) ? previous : [...previous, step.id]
    ))
    if (completesScreen) onRecord({ lineMethod: config.id, explored: true })
    speak(textOf(step.speech, lang))
  }

  return (
    <div className="g7w-screen">
      <ScreenHeading screen={config.screen} lang={lang} />
      <section className="g7w-frame g7w-line-frame">
        <div className="g7w-frame-instruction">
          <BookOpen size={18} />
          <strong>{textOf({ ru: 'Нажимай шаги по порядку', uz: 'Qadamlarni tartib bilan bosing' }, lang)}</strong>
        </div>

        <div className="g7w-expression-window g7w-expression-window-compact">
          <AnimatePresence mode="wait">
            <motion.div
              className={`g7w-solution-expression ${activeStep?.expression === '124' ? 'is-answer' : ''}`}
              key={activeStep?.id ?? 'initial'}
              initial={{ opacity: 0, y: 10, filter: 'blur(3px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(2px)' }}
              transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
            >
              {activeStep?.expression ?? config.initial}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className={`g7w-line-step-list is-${config.steps.length}`}>
          {config.steps.map((step, index) => {
            const isVisited = visited.includes(step.id)
            const isActive = active === step.id
            return (
              <button
                type="button"
                className={`g7w-line-step-card ${isActive ? 'is-active' : ''} ${isVisited ? 'is-visited' : ''} ${nextId === step.id ? 'is-awaited' : ''}`}
                onClick={() => choose(step)}
                key={step.id}
              >
                <span>{isVisited ? <Check size={14} /> : index + 1}</span>
                <div>
                  <small>{textOf({ ru: `Шаг ${index + 1}`, uz: `${index + 1}-qadam` }, lang)}</small>
                  <strong>{step.action}</strong>
                </div>
              </button>
            )
          })}
        </div>

        <div className="g7w-line-detail" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              className={activeStep ? 'g7w-worked-motion' : 'g7w-explanation-prompt'}
              key={active ?? 'empty'}
              initial={{ opacity: 0, y: 7 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              {activeStep ? (
                <WorkedExplanation explanation={activeStep.explanation} lang={lang} />
              ) : (
                <>
                  <span>{textOf({ ru: 'Подсказка', uz: 'Ko‘rsatma' }, lang)}</span>
                  <strong>{textOf(config.prompt, lang)}</strong>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  )
}

const BracketLinesScreen = (props) => <LineMethodScreen {...props} config={LINE_METHOD_SCREENS[0]} />
const MultiplyDivideLinesScreen = (props) => <LineMethodScreen {...props} config={LINE_METHOD_SCREENS[1]} />
const AddSubtractLinesScreen = (props) => <LineMethodScreen {...props} config={LINE_METHOD_SCREENS[2]} />

const NUMBERED_STEPS = [
  {
    order: 1,
    action: '(7 − 4) = 3',
    speech: {
      ru: 'Первым выполняем самое внутреннее действие: семь минус четыре равно три.',
      uz: 'Birinchi eng ichki amalni bajaramiz: yetti minus to‘rt uchga teng.',
    },
  },
  {
    order: 2,
    action: '(15 − 9) = 6',
    speech: {
      ru: 'Вторым вычисляем независимую круглую скобку: пятнадцать минус девять равно шесть.',
      uz: 'Ikkinchi mustaqil dumaloq qavsni hisoblaymiz: o‘n besh minus to‘qqiz oltiga teng.',
    },
  },
  {
    order: 3,
    action: '2 · 3 = 6',
    speech: {
      ru: 'Третьим завершаем квадратные скобки: два умножить на три равно шесть.',
      uz: 'Uchinchi kvadrat qavsni yakunlaymiz: ikki ko‘paytiruv uch oltiga teng.',
    },
  },
  {
    order: 4,
    action: '84 : 6 = 14',
    speech: {
      ru: 'Четвёртое действие — деление: восемьдесят четыре разделить на шесть равно четырнадцать.',
      uz: 'To‘rtinchi amal — bo‘lish: sakson to‘rtni oltiga bo‘lsak, o‘n to‘rt chiqadi.',
    },
  },
  {
    order: 5,
    action: '3 · 6 = 18',
    speech: {
      ru: 'Пятое действие — умножение: три умножить на шесть равно восемнадцать.',
      uz: 'Beshinchi amal — ko‘paytirish: uch ko‘paytiruv olti o‘n sakkizga teng.',
    },
  },
  {
    order: 6,
    action: '120 − 14 = 106',
    speech: {
      ru: 'Шестым выполняем вычитание слева: сто двадцать минус четырнадцать равно сто шесть.',
      uz: 'Oltinchi chapdagi ayirishni bajaramiz: bir yuz yigirma minus o‘n to‘rt bir yuz oltiga teng.',
    },
  },
  {
    order: 7,
    action: '106 + 18 = 124',
    speech: {
      ru: 'Седьмое действие последнее: сто шесть плюс восемнадцать равно сто двадцать четыре.',
      uz: 'Yettinchi amal oxirgi: bir yuz olti plus o‘n sakkiz bir yuz yigirma to‘rtga teng.',
    },
  },
]

function NumberedOp({ order, visibleCount, activeOrder, children }) {
  const visible = order <= visibleCount
  return (
    <span className={`g7w-numbered-op ${visible ? 'is-visible' : ''} ${activeOrder === order ? 'is-active' : ''}`}>
      <AnimatePresence>
        {visible && (
          <motion.i
            key={order}
            initial={{ opacity: 0, y: 8, scale: 0.55 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
          >
            {order}
          </motion.i>
        )}
      </AnimatePresence>
      <b>{children}</b>
    </span>
  )
}

function NumberedExpression({ visibleCount = 7, activeOrder = null }) {
  const op = (order, symbol) => (
    <NumberedOp order={order} visibleCount={visibleCount} activeOrder={activeOrder}>
      {symbol}
    </NumberedOp>
  )

  return (
    <div className="g7w-numbered-expression" aria-label="Порядок действий в исходном выражении">
      <span>120</span>
      {op(6, '−')}
      <span>84</span>
      {op(4, ':')}
      <span>[</span>
      <span>2</span>
      {op(3, '·')}
      <span>(</span>
      <span>7</span>
      {op(1, '−')}
      <span>4</span>
      <span>)</span>
      <span>]</span>
      {op(7, '+')}
      <span>3</span>
      {op(5, '·')}
      <span>(</span>
      <span>15</span>
      {op(2, '−')}
      <span>9</span>
      <span>)</span>
    </div>
  )
}

function NumberingScreen({ lang, speak, onRecord }) {
  const [visibleCount, setVisibleCount] = useState(0)
  const activeStep = NUMBERED_STEPS[visibleCount - 1]

  const revealNext = () => {
    const nextCount = Math.min(NUMBERED_STEPS.length, visibleCount + 1)
    const nextStep = NUMBERED_STEPS[nextCount - 1]
    setVisibleCount(nextCount)
    speak(textOf(nextStep.speech, lang))
    if (nextCount === NUMBERED_STEPS.length) onRecord({ numberingComplete: true })
  }

  return (
    <div className="g7w-screen">
      <ScreenHeading screen={6} lang={lang} />
      <section className="g7w-frame g7w-numbering-frame">
        <div className="g7w-frame-instruction">
          <span>{visibleCount === NUMBERED_STEPS.length
            ? <Check size={14} />
            : String(Math.max(1, visibleCount + 1)).padStart(2, '0')}</span>
          <strong>{textOf({ ru: 'Показывай порядок по одному номеру', uz: 'Tartibni bittadan ko‘rsating' }, lang)}</strong>
        </div>

        <div className="g7w-expression-window g7w-number-window">
          <NumberedExpression visibleCount={visibleCount} activeOrder={activeStep?.order} />
        </div>

        <div className="g7w-number-focus" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep?.order ?? 'start'}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.46 }}
            >
              {activeStep ? (
                <>
                  <span>{activeStep.order}</span>
                  <small>{textOf({ ru: 'Сейчас считаем', uz: 'Hozir hisoblaymiz' }, lang)}</small>
                  <strong>{activeStep.action}</strong>
                </>
              ) : (
                <>
                  <span>1</span>
                  <small>{textOf({ ru: 'Первый номер', uz: 'Birinchi raqam' }, lang)}</small>
                  <strong>{textOf({ ru: 'ищем внутри самых глубоких скобок', uz: 'eng ichki qavsdan izlaymiz' }, lang)}</strong>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          type="button"
          className="g7w-primary g7w-number-next"
          onClick={revealNext}
          disabled={visibleCount === NUMBERED_STEPS.length}
        >
          {visibleCount === NUMBERED_STEPS.length
            ? textOf({ ru: 'Порядок готов', uz: 'Tartib tayyor' }, lang)
            : textOf({ ru: 'Показать следующий номер', uz: 'Keyingi raqamni ko‘rsatish' }, lang)}
          {visibleCount === NUMBERED_STEPS.length ? <Check size={17} /> : <ArrowRight size={17} />}
        </button>
      </section>
    </div>
  )
}

function NumberedSolutionScreen({ lang, speak, onRecord }) {
  const [activeOrder, setActiveOrder] = useState(null)
  const [visited, setVisited] = useState([])
  const activeStep = NUMBERED_STEPS.find((step) => step.order === activeOrder)
  const nextOrder = NUMBERED_STEPS.find((step) => !visited.includes(step.order))?.order

  const choose = (step) => {
    setActiveOrder(step.order)
    const completes = !visited.includes(step.order)
      && visited.length + 1 === NUMBERED_STEPS.length
    setVisited((previous) => (
      previous.includes(step.order) ? previous : [...previous, step.order]
    ))
    speak(textOf(step.speech, lang))
    if (completes) onRecord({ numberedSolutionExplored: true })
  }

  return (
    <div className="g7w-screen">
      <ScreenHeading screen={7} lang={lang} />
      <section className="g7w-frame g7w-number-solution-frame">
        <div className="g7w-expression-window g7w-number-window">
          <NumberedExpression visibleCount={7} activeOrder={activeOrder} />
        </div>

        <div className="g7w-number-tabs" aria-label={textOf({ ru: 'Номера действий', uz: 'Amal raqamlari' }, lang)}>
          {NUMBERED_STEPS.map((step) => (
            <button
              type="button"
              key={step.order}
              className={`${activeOrder === step.order ? 'is-active' : ''} ${visited.includes(step.order) ? 'is-visited' : ''} ${nextOrder === step.order ? 'is-awaited' : ''}`}
              onClick={() => choose(step)}
            >
              {visited.includes(step.order) ? <Check size={14} /> : step.order}
            </button>
          ))}
        </div>

        <div className="g7w-number-calculation" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeOrder ?? 'prompt'}
              initial={{ opacity: 0, y: 10, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -7 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <small>{activeStep
                ? textOf({ ru: `Действие ${activeStep.order}`, uz: `${activeStep.order}-amal` }, lang)
                : textOf({ ru: 'Начни с номера 1', uz: '1-raqamdan boshlang' }, lang)}</small>
              <strong>{activeStep?.action ?? '(7 − 4) = ?'}</strong>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className={`g7w-method-result ${visited.length === 7 ? 'is-complete' : ''}`}>
          <span>{textOf({ ru: 'Один порядок', uz: 'Bitta tartib' }, lang)}</span>
          <strong>{visited.length === 7 ? '124' : '( ) → · : → + −'}</strong>
        </div>
      </section>
    </div>
  )
}

function PracticeFeedback({ status, prompt, success, error, lang }) {
  const content = status === 'success' ? success : status === 'error' ? error : prompt
  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={`g7w-practice-feedback is-${status ?? 'prompt'}`}
        key={status ?? 'prompt'}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.42 }}
        aria-live="polite"
      >
        <span>{status === 'success' ? <Check size={16} /> : status === 'error' ? '!' : '?'}</span>
        <strong>{textOf(content, lang)}</strong>
      </motion.div>
    </AnimatePresence>
  )
}

const CHOICE_PRACTICE = [
  {
    screen: 8,
    expression: '48 − 24 : (9 − 5)',
    prompt: { ru: 'Выбери первое действие', uz: 'Birinchi amalni tanlang' },
    options: [
      { id: 'subtract', label: '48 − 24' },
      { id: 'bracket', label: '9 − 5' },
      { id: 'divide', label: '24 : (9 − 5)' },
    ],
    correct: 'bracket',
    success: { ru: 'Верно: (9 − 5) = 4. Скобки всегда раньше.', uz: 'To‘g‘ri: (9 − 5) = 4. Qavs har doim oldin.' },
    error: { ru: 'Сначала загляни внутрь скобок.', uz: 'Avval qavs ichiga qarang.' },
  },
  {
    screen: 10,
    expression: '90 − 6 · (8 + 2)',
    prompt: { ru: 'Какой ответ получится?', uz: 'Qanday javob chiqadi?' },
    options: [
      { id: '30', label: '30' },
      { id: '36', label: '36' },
      { id: '84', label: '84' },
    ],
    correct: '30',
    success: { ru: '(8 + 2) = 10; 6 · 10 = 60; 90 − 60 = 30.', uz: '(8 + 2) = 10; 6 · 10 = 60; 90 − 60 = 30.' },
    error: { ru: 'Проверь: скобки → умножение → вычитание.', uz: 'Tekshiring: qavs → ko‘paytirish → ayirish.' },
  },
  {
    screen: 11,
    expression: '64 − 24 : 6',
    prompt: { ru: 'Выбери запись без ошибки', uz: 'Xatosiz yozuvni tanlang' },
    options: [
      { id: 'wrong', label: '64 − 24 : 6 = 40 : 6', long: true },
      { id: 'right', label: '64 − 24 : 6 = 64 − 4 = 60', long: true },
    ],
    correct: 'right',
    success: { ru: 'Верно: деление выполняется раньше вычитания.', uz: 'To‘g‘ri: bo‘lish ayirishdan oldin bajariladi.' },
    error: { ru: 'Нельзя сначала вычитать 64 − 24.', uz: 'Avval 64 − 24 ni ayirish mumkin emas.' },
  },
  {
    screen: 13,
    expression: '100 − 36 + 12',
    prompt: { ru: 'Какое действие будет первым?', uz: 'Qaysi amal birinchi?' },
    options: [
      { id: 'left', label: '100 − 36' },
      { id: 'right', label: '36 + 12' },
    ],
    correct: 'left',
    success: { ru: 'Верно: 100 − 36 = 64, затем 64 + 12 = 76.', uz: 'To‘g‘ri: 100 − 36 = 64, keyin 64 + 12 = 76.' },
    error: { ru: 'При равном приоритете идём слева направо.', uz: 'Ustuvorlik teng bo‘lsa, chapdan o‘ngga yuramiz.' },
  },
]

function ChoicePracticeScreen({ config, lang, speak, onRecord }) {
  const [selected, setSelected] = useState(null)
  const status = selected ? (selected === config.correct ? 'success' : 'error') : null

  const choose = (option) => {
    const isCorrect = option.id === config.correct
    setSelected(option.id)
    onRecord({ exercise: config.screen + 1, selected: option.id, correct: isCorrect })
    speak(textOf(isCorrect ? config.success : config.error, lang))
  }

  return (
    <div className="g7w-screen">
      <ScreenHeading screen={config.screen} lang={lang} />
      <section className="g7w-frame g7w-practice-frame">
        <div className="g7w-frame-instruction">
          <BookOpen size={18} />
          <strong>{textOf(config.prompt, lang)}</strong>
        </div>
        <div className="g7w-expression-window g7w-practice-expression">
          <strong>{config.expression}</strong>
        </div>
        <div className={`g7w-choice-grid is-${config.options.length}`}>
          {config.options.map((option) => {
            const isSelected = selected === option.id
            const revealCorrect = selected && option.id === config.correct
            return (
              <button
                type="button"
                key={option.id}
                className={`${option.long ? 'is-long' : ''} ${isSelected ? 'is-selected' : ''} ${revealCorrect ? 'is-correct' : ''} ${isSelected && !revealCorrect ? 'is-wrong' : ''}`}
                onClick={() => choose(option)}
              >
                <span>{revealCorrect ? <Check size={16} /> : option.label}</span>
                {revealCorrect && <strong>{option.label}</strong>}
              </button>
            )
          })}
        </div>
        <PracticeFeedback
          status={status}
          prompt={config.prompt}
          success={config.success}
          error={config.error}
          lang={lang}
        />
      </section>
    </div>
  )
}

const FirstActionPracticeScreen = (props) => <ChoicePracticeScreen {...props} config={CHOICE_PRACTICE[0]} />
const TypicalPracticeScreen = (props) => <ChoicePracticeScreen {...props} config={CHOICE_PRACTICE[1]} />
const ErrorPracticeScreen = (props) => <ChoicePracticeScreen {...props} config={CHOICE_PRACTICE[2]} />
const EqualPriorityPracticeScreen = (props) => <ChoicePracticeScreen {...props} config={CHOICE_PRACTICE[3]} />

const ORDER_STEPS = [
  { id: 'divide', label: '72 : 8', result: '9 + 5 · 3' },
  { id: 'multiply', label: '5 · 3', result: '9 + 15' },
  { id: 'add', label: '9 + 15', result: '24' },
]

function OrderPracticeScreen({ lang, speak, onRecord }) {
  const [completed, setCompleted] = useState([])
  const [mistake, setMistake] = useState(false)
  const currentExpression = completed.length ? ORDER_STEPS[completed.length - 1].result : '72 : 8 + 5 · 3'
  const displayed = [ORDER_STEPS[1], ORDER_STEPS[0], ORDER_STEPS[2]]

  const choose = (step) => {
    if (completed.includes(step.id)) return
    const expected = ORDER_STEPS[completed.length]
    if (step.id !== expected.id) {
      setMistake(true)
      speak(textOf({ ru: 'Проверь приоритет и направление слева направо.', uz: 'Ustuvorlikni va chapdan o‘ngga yo‘nalishni tekshiring.' }, lang))
      return
    }
    const next = [...completed, step.id]
    setMistake(false)
    setCompleted(next)
    speak(textOf({ ru: `${step.label}. Верно, переходи к следующему действию.`, uz: `${step.label}. To‘g‘ri, keyingi amalga o‘ting.` }, lang))
    onRecord({ exercise: 10, completed: next.length, correct: next.length === ORDER_STEPS.length })
  }

  return (
    <div className="g7w-screen">
      <ScreenHeading screen={9} lang={lang} />
      <section className="g7w-frame g7w-practice-frame">
        <div className="g7w-frame-instruction">
          <span>{completed.length + 1 > 3 ? <Check size={14} /> : completed.length + 1}</span>
          <strong>{textOf({ ru: 'Нажми следующее вычисление', uz: 'Keyingi hisobni bosing' }, lang)}</strong>
        </div>
        <div className="g7w-expression-window g7w-practice-expression">
          <AnimatePresence mode="wait">
            <motion.strong
              key={currentExpression}
              initial={{ opacity: 0, y: 9 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -7 }}
              transition={{ duration: 0.48 }}
              className={currentExpression === '24' ? 'is-answer' : ''}
            >
              {currentExpression}
            </motion.strong>
          </AnimatePresence>
        </div>
        <div className="g7w-order-options">
          {displayed.map((step) => (
            <button
              type="button"
              key={step.id}
              className={completed.includes(step.id) ? 'is-complete' : ''}
              onClick={() => choose(step)}
            >
              {completed.includes(step.id) ? <Check size={16} /> : null}
              <strong>{step.label}</strong>
            </button>
          ))}
        </div>
        <PracticeFeedback
          status={completed.length === 3 ? 'success' : mistake ? 'error' : null}
          prompt={{ ru: 'Деление и умножение: слева направо.', uz: 'Bo‘lish va ko‘paytirish: chapdan o‘ngga.' }}
          success={{ ru: 'Цепочка готова. Ответ: 24.', uz: 'Zanjir tayyor. Javob: 24.' }}
          error={{ ru: 'Это действие пока рано выполнять.', uz: 'Bu amalni bajarishga hali erta.' }}
          lang={lang}
        />
      </section>
    </div>
  )
}

const GUIDED_STAGES = [
  {
    expression: '96 : [2 · (7 − 3)] + 5',
    correct: 'bracket',
    options: [
      { id: 'divide', label: '96 : 2' },
      { id: 'bracket', label: '7 − 3' },
      { id: 'add', label: '3 + 5' },
    ],
    next: '96 : [2 · 4] + 5',
    reason: { ru: 'Сначала внутренняя скобка: 7 − 3 = 4.', uz: 'Avval ichki qavs: 7 − 3 = 4.' },
  },
  {
    expression: '96 : [2 · 4] + 5',
    correct: 'square',
    options: [
      { id: 'divide', label: '96 : 2' },
      { id: 'square', label: '2 · 4' },
      { id: 'add', label: '4 + 5' },
    ],
    next: '96 : 8 + 5',
    reason: { ru: 'Завершаем квадратные скобки: 2 · 4 = 8.', uz: 'Kvadrat qavsni yakunlaymiz: 2 · 4 = 8.' },
  },
  {
    expression: '96 : 8 + 5',
    correct: 'divide',
    options: [
      { id: 'add', label: '8 + 5' },
      { id: 'divide', label: '96 : 8' },
    ],
    next: '12 + 5',
    reason: { ru: 'Деление раньше сложения: 96 : 8 = 12.', uz: 'Bo‘lish qo‘shishdan oldin: 96 : 8 = 12.' },
  },
  {
    expression: '12 + 5',
    correct: 'add',
    options: [
      { id: 'add', label: '12 + 5' },
      { id: 'stop', label: 'Уже ответ' },
    ],
    next: '17',
    reason: { ru: 'Последнее действие: 12 + 5 = 17.', uz: 'Oxirgi amal: 12 + 5 = 17.' },
  },
]

function GuidedPracticeScreen({ lang, speak, onRecord }) {
  const [stageIndex, setStageIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [finished, setFinished] = useState(false)
  const stage = GUIDED_STAGES[stageIndex]
  const correct = selected === stage.correct
  const shownExpression = finished || correct ? stage.next : stage.expression

  const choose = (option) => {
    setSelected(option.id)
    const isCorrect = option.id === stage.correct
    speak(textOf(isCorrect ? stage.reason : {
      ru: 'Это действие пока не следующее. Проверь порядок.',
      uz: 'Bu amal hozir keyingi emas. Tartibni tekshiring.',
    }, lang))
    onRecord({ exercise: 13, stage: stageIndex + 1, selected: option.id, correct: isCorrect })
  }

  const advance = () => {
    if (stageIndex === GUIDED_STAGES.length - 1) {
      setFinished(true)
      onRecord({ exercise: 13, completed: true, answer: 17 })
      return
    }
    setStageIndex((value) => value + 1)
    setSelected(null)
  }

  return (
    <div className="g7w-screen">
      <ScreenHeading screen={12} lang={lang} />
      <section className="g7w-frame g7w-practice-frame">
        <div className="g7w-frame-instruction">
          <span>{finished ? <Check size={14} /> : stageIndex + 1}</span>
          <strong>{textOf({ ru: 'Выбери только следующий шаг', uz: 'Faqat keyingi qadamni tanlang' }, lang)}</strong>
        </div>
        <div className="g7w-expression-window g7w-practice-expression">
          <AnimatePresence mode="wait">
            <motion.strong
              key={shownExpression}
              initial={{ opacity: 0, y: 10, filter: 'blur(2px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(2px)' }}
              transition={{ duration: 0.54 }}
              className={shownExpression === '17' ? 'is-answer' : ''}
            >
              {shownExpression}
            </motion.strong>
          </AnimatePresence>
        </div>
        {!finished && (
          <div className={`g7w-choice-grid is-${stage.options.length}`}>
            {stage.options.map((option) => (
              <button
                type="button"
                key={option.id}
                className={`${selected === option.id ? 'is-selected' : ''} ${selected && option.id === stage.correct ? 'is-correct' : ''} ${selected === option.id && option.id !== stage.correct ? 'is-wrong' : ''}`}
                onClick={() => choose(option)}
              >
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        )}
        <div className="g7w-guided-bottom">
          <PracticeFeedback
            status={finished || correct ? 'success' : selected ? 'error' : null}
            prompt={{ ru: 'Смотри на текущее выражение.', uz: 'Joriy ifodaga qarang.' }}
            success={finished ? { ru: 'Готово. Ответ: 17.', uz: 'Tayyor. Javob: 17.' } : stage.reason}
            error={{ ru: 'Проверь: скобки → умножение и деление → сложение.', uz: 'Tekshiring: qavs → ko‘paytirish va bo‘lish → qo‘shish.' }}
            lang={lang}
          />
          {correct && !finished && (
            <button type="button" className="g7w-primary g7w-guided-next" onClick={advance}>
              {stageIndex === GUIDED_STAGES.length - 1
                ? textOf({ ru: 'Получить ответ', uz: 'Javobni olish' }, lang)
                : textOf({ ru: 'Следующий шаг', uz: 'Keyingi qadam' }, lang)}
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </section>
    </div>
  )
}

function IndependentPracticeScreen({ lang, speak, onRecord }) {
  const [answer, setAnswer] = useState('')
  const [checked, setChecked] = useState(false)
  const correct = Number(answer) === 52

  const check = () => {
    if (!answer) return
    setChecked(true)
    onRecord({ exercise: 15, answer: Number(answer), correct })
    speak(textOf(correct ? {
      ru: 'Верно. Ответ пятьдесят два.',
      uz: 'To‘g‘ri. Javob ellik ikki.',
    } : {
      ru: 'Пока не совпало. Проверь цепочку: скобки, деление и умножение, затем сложение.',
      uz: 'Hozircha mos kelmadi. Zanjirni tekshiring: qavs, bo‘lish va ko‘paytirish, keyin qo‘shish.',
    }, lang))
  }

  return (
    <div className="g7w-screen">
      <ScreenHeading screen={14} lang={lang} />
      <section className="g7w-frame g7w-independent-frame">
        <div className="g7w-frame-instruction">
          <BookOpen size={18} />
          <strong>{textOf({ ru: 'Без таймера · реши в своём темпе', uz: 'Taymersiz · o‘z tezligingizda yeching' }, lang)}</strong>
        </div>
        <div className="g7w-expression-window g7w-practice-expression">
          <strong>144 : (12 − 6) + 7 · 4</strong>
        </div>
        <div className="g7w-independent-answer">
          <label>
            <span>{textOf({ ru: 'Ответ', uz: 'Javob' }, lang)}</span>
            <input
              value={answer}
              inputMode="numeric"
              autoComplete="off"
              onChange={(event) => {
                setAnswer(event.target.value.replace(/[^\d-]/g, ''))
                setChecked(false)
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') check()
              }}
            />
          </label>
          <button type="button" className="g7w-primary" onClick={check} disabled={!answer}>
            <Check size={17} />
            {textOf({ ru: 'Проверить', uz: 'Tekshirish' }, lang)}
          </button>
        </div>
        <PracticeFeedback
          status={checked ? (correct ? 'success' : 'error') : null}
          prompt={{ ru: 'Запиши только итоговое число.', uz: 'Faqat yakuniy sonni yozing.' }}
          success={{ ru: '(12 − 6) = 6 → 144 : 6 = 24 → 7 · 4 = 28 → 52', uz: '(12 − 6) = 6 → 144 : 6 = 24 → 7 · 4 = 28 → 52' }}
          error={{ ru: 'Подсказка: сначала получи 144 : 6 + 7 · 4.', uz: 'Ko‘rsatma: avval 144 : 6 + 7 · 4 ni oling.' }}
          lang={lang}
        />
      </section>
    </div>
  )
}

function FinalReflectionScreen({ lang, speak, onRecord, answers }) {
  const [reflection, setReflection] = useState(null)
  const hypothesis = answers?.[0]?.hypothesis
  const hasHypothesis = Number.isFinite(hypothesis)
  const matched = hasHypothesis && hypothesis === 124

  const choose = (value) => {
    setReflection(value)
    onRecord({ reflection: value, hypothesis, answer: 124 })
    speak(textOf(value === 'clear' ? {
      ru: 'Отлично. Ты можешь назвать правило и объяснить решение.',
      uz: 'Ajoyib. Siz qoidani aytib, yechimni tushuntira olasiz.',
    } : {
      ru: 'Это нормально. Вернись к экрану с тремя ступенями и повтори их.',
      uz: 'Bu normal. Uch bosqichli ekranga qaytib, ularni takrorlang.',
    }, lang))
  }

  return (
    <div className="g7w-screen">
      <ScreenHeading screen={15} lang={lang} />
      <section className="g7w-frame g7w-final-frame">
        <div className="g7w-final-comparison">
          <div>
            <small>{textOf({ ru: 'Первая версия', uz: 'Birinchi javob' }, lang)}</small>
            <strong>{hasHypothesis ? hypothesis : '—'}</strong>
          </div>
          <ArrowRight size={22} />
          <div className="is-final">
            <small>{textOf({ ru: 'После объяснения', uz: 'Tushuntirishdan keyin' }, lang)}</small>
            <strong>124</strong>
          </div>
        </div>

        <div className={`g7w-final-message ${matched ? 'is-match' : ''}`}>
          <span><Check size={17} /></span>
          <strong>{textOf(matched ? {
            ru: 'Твоя гипотеза совпала. Теперь есть и доказательство.',
            uz: 'Taxminingiz mos keldi. Endi isbot ham bor.',
          } : {
            ru: 'Ответ можно изменить. Главное — теперь понятна причина каждого шага.',
            uz: 'Javobni o‘zgartirish mumkin. Muhimi — har bir qadam sababi tushunarli.',
          }, lang)}</strong>
        </div>

        <div className="g7w-final-rule">
          <small>{textOf({ ru: 'Алгоритм', uz: 'Algoritm' }, lang)}</small>
          <strong>( ) [ ]</strong>
          <ArrowRight size={17} />
          <strong>· :</strong>
          <ArrowRight size={17} />
          <strong>+ −</strong>
        </div>

        <div className="g7w-reflection-grid">
          <button
            type="button"
            className={reflection === 'clear' ? 'is-active' : ''}
            onClick={() => choose('clear')}
          >
            <Check size={17} />
            {textOf({ ru: 'Могу объяснить', uz: 'Tushuntira olaman' }, lang)}
          </button>
          <button
            type="button"
            className={reflection === 'repeat' ? 'is-active' : ''}
            onClick={() => choose('repeat')}
          >
            ↻
            {textOf({ ru: 'Хочу повторить', uz: 'Takrorlamoqchiman' }, lang)}
          </button>
        </div>
      </section>
    </div>
  )
}

const SCREENS = [
  ChallengeScreen,
  FirstStepScreen,
  RuleScreen,
  BracketLinesScreen,
  MultiplyDivideLinesScreen,
  AddSubtractLinesScreen,
  NumberingScreen,
  NumberedSolutionScreen,
  FirstActionPracticeScreen,
  OrderPracticeScreen,
  TypicalPracticeScreen,
  ErrorPracticeScreen,
  GuidedPracticeScreen,
  EqualPriorityPracticeScreen,
  IndependentPracticeScreen,
  FinalReflectionScreen,
]

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
  const isLearning = current < 8

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
      lessonId: 'grade7-dars01-sonli-ifodalar',
      prototype: false,
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
              <span className={`g7w-phase ${isLearning ? '' : 'is-practice'}`}>
                {textOf(isLearning
                  ? { ru: 'Обучение', uz: 'O‘rganish' }
                  : { ru: 'Тренировка', uz: 'Mashq' }, lang)}
              </span>
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
          <CurrentScreen
            key={`${current}-${lang}`}
            lang={lang}
            speak={speak}
            onRecord={record}
            answers={answers}
          />
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
          <span>{textOf(isLearning
            ? { ru: 'Обучение · экраны 1–8', uz: 'O‘rganish · 1–8 ekranlar' }
            : { ru: 'Тренировка · экраны 9–16', uz: 'Mashq · 9–16 ekranlar' }, lang)}</span>
          <button type="button" className="g7w-next" onClick={next}>
            {current === TOTAL - 1
              ? textOf({ ru: 'Завершить урок', uz: 'Darsni tugatish' }, lang)
              : textOf({ ru: 'Дальше', uz: 'Davom etish' }, lang)}
            {current === TOTAL - 1 ? <Check size={18} /> : <ArrowRight size={18} />}
          </button>
        </footer>
      </section>
    </main>
  )
}
