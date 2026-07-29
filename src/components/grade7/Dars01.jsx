import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  Headphones,
  Lightbulb,
  RotateCcw,
  Search,
  Target,
  Volume2,
  VolumeX,
} from 'lucide-react'
import './Dars01.css'

const TOTAL = 16
const HOOK_EXPRESSION = '120 − 84 : [2 · (7 − 4)] + 3 · (15 − 9)'

const SCREEN_COPY = [
  {
    phase: { ru: 'Математический детектив', uz: 'Matematik detektiv' },
    kind: { ru: 'Хук', uz: 'Kirish' },
    title: { ru: 'Один пример — два ответа', uz: 'Bitta misol — ikkita javob' },
    instruction: {
      ru: 'Реши как умеешь. Первая гипотеза не оценивается.',
      uz: "O'zingiz bilgan usulda yeching. Birinchi taxmin baholanmaydi.",
    },
    narration: {
      ru: `Перед тобой числовое выражение. Азиз получил сто двадцать четыре, а Малика — пятьдесят четыре. У тебя сорок пять секунд на первую гипотезу. Попробуй решить пример так, как умеешь. Ответ пока не оценивается.`,
      uz: `Oldingizda sonli ifoda turibdi. Aziz bir yuz yigirma to'rt, Malika esa ellik to'rt javobini oldi. Birinchi taxmin uchun qirq besh soniya bor. Misolni bilgan usulingizda yechib ko'ring. Javob hozircha baholanmaydi.`,
    },
  },
  {
    phase: { ru: 'Исследование', uz: 'Tadqiqot' },
    kind: { ru: 'Обучение', uz: "O'rganish" },
    title: { ru: 'С чего начать?', uz: 'Nimadan boshlaymiz?' },
    instruction: {
      ru: 'Нажми на действие, которое можно выполнить первым.',
      uz: 'Birinchi bajarish mumkin bo‘lgan amalni bosing.',
    },
    narration: {
      ru: `Не начинай считать слева направо автоматически. Сначала посмотри на устройство выражения. Нажми на знак действия внутри круглых скобок.`,
      uz: `Darhol chapdan o‘ngga hisoblashni boshlamang. Avval ifodaning tuzilishiga qarang. Dumaloq qavs ichidagi amal belgisini bosing.`,
    },
  },
  {
    phase: { ru: 'Объяснение · шаг 1', uz: 'Tushuntirish · 1-qadam' },
    kind: { ru: 'Обучение', uz: "O'rganish" },
    title: { ru: 'Сворачиваем внутренние скобки', uz: 'Ichki qavslarni hisoblaymiz' },
    instruction: {
      ru: 'Нажимай на круглые скобки — каждая станет числом.',
      uz: 'Dumaloq qavslarni bosing — har biri songa aylanadi.',
    },
    narration: {
      ru: `Две круглые скобки независимы. Их можно вычислить в любом порядке. Семь минус четыре равно трём. Пятнадцать минус девять равно шести. Каждая завершённая скобка превращается в одно число.`,
      uz: `Ikki dumaloq qavs bir-biriga bog‘liq emas. Ularni istalgan tartibda hisoblash mumkin. Yetti minus to‘rt uchga teng. O‘n besh minus to‘qqiz oltiga teng. Har bir hisoblangan qavs bitta songa aylanadi.`,
    },
  },
  {
    phase: { ru: 'Объяснение · шаг 2', uz: 'Tushuntirish · 2-qadam' },
    kind: { ru: 'Обучение', uz: "O'rganish" },
    title: { ru: 'Идём изнутри наружу', uz: 'Ichkaridan tashqariga yuramiz' },
    instruction: {
      ru: 'Теперь нажми на квадратные скобки.',
      uz: 'Endi kvadrat qavslarni bosing.',
    },
    narration: {
      ru: `Внутри квадратных скобок круглые скобки уже стали числом три. Теперь вычисляем два умножить на три. Получаем шесть. Значит, квадратные скобки тоже можно заменить одним числом.`,
      uz: `Kvadrat qavs ichidagi dumaloq qavs allaqachon uch soniga aylandi. Endi ikki karra uchni hisoblaymiz. Olti hosil bo‘ladi. Demak, kvadrat qavsni ham bitta son bilan almashtirish mumkin.`,
    },
  },
  {
    phase: { ru: 'Объяснение · шаг 3', uz: 'Tushuntirish · 3-qadam' },
    kind: { ru: 'Обучение', uz: "O'rganish" },
    title: { ru: 'Сильные действия — раньше', uz: 'Kuchli amallar — oldin' },
    instruction: {
      ru: 'Нажми на деление и умножение.',
      uz: 'Bo‘lish va ko‘paytirishni bosing.',
    },
    narration: {
      ru: `Скобок больше нет. Теперь раньше сложения и вычитания выполняем деление и умножение. Восемьдесят четыре делим на шесть — получаем четырнадцать. Три умножаем на шесть — получаем восемнадцать.`,
      uz: `Qavslar qolmadi. Endi qo‘shish va ayirishdan oldin bo‘lish va ko‘paytirishni bajaramiz. Sakson to‘rtni oltiga bo‘lib, o‘n to‘rt olamiz. Uchni oltiga ko‘paytirib, o‘n sakkiz olamiz.`,
    },
  },
  {
    phase: { ru: 'Первый способ', uz: 'Birinchi usul' },
    kind: { ru: 'Обучение', uz: "O'rganish" },
    title: { ru: 'Решение по строкам', uz: 'Qatorlar bo‘yicha yechim' },
    instruction: {
      ru: 'Открывай по одному преобразованию.',
      uz: 'Har bir o‘zgarishni bittadan oching.',
    },
    narration: {
      ru: `Первый школьный способ — записывать равные выражения по строкам. В новой строке меняется только та часть, которую мы вычислили. Остальные числа и знаки переписываются без изменений.`,
      uz: `Birinchi maktab usuli — teng ifodalarni qatorlar bo‘yicha yozish. Yangi qatorda faqat hisoblangan qism o‘zgaradi. Qolgan sonlar va belgilar o‘zgarmasdan ko‘chiriladi.`,
    },
  },
  {
    phase: { ru: 'Второй способ', uz: 'Ikkinchi usul' },
    kind: { ru: 'Обучение', uz: "O'rganish" },
    title: { ru: 'Номера над действиями', uz: 'Amallar ustidagi raqamlar' },
    instruction: {
      ru: 'Нажимай на знаки в порядке выполнения.',
      uz: 'Amal belgilarini bajarilish tartibida bosing.',
    },
    narration: {
      ru: `Второй школьный способ — заранее поставить номера над знаками действий. Сначала нумеруем действия в скобках, затем умножение и деление, после них сложение и вычитание. Действия одного уровня выполняем слева направо.`,
      uz: `Ikkinchi maktab usuli — amal belgilarining ustiga oldindan raqam qo‘yish. Avval qavs ichidagi amallar, so‘ng ko‘paytirish va bo‘lish, undan keyin qo‘shish va ayirish raqamlanadi. Bir xil darajadagi amallar chapdan o‘ngga bajariladi.`,
    },
  },
  {
    phase: { ru: 'Открытие правила', uz: 'Qoidani kashf etish' },
    kind: { ru: 'Обучение', uz: "O'rganish" },
    title: { ru: 'Собери правило', uz: 'Qoidani yig‘ing' },
    instruction: {
      ru: 'Выбирай пункты в правильном порядке.',
      uz: 'Bandlarni to‘g‘ri tartibda tanlang.',
    },
    narration: {
      ru: `Соберём правило из нашего решения. Сначала скобки — изнутри наружу. Затем умножение и деление — слева направо. После них сложение и вычитание — тоже слева направо.`,
      uz: `Yechimimizdan qoida tuzamiz. Avval qavslar — ichkaridan tashqariga. Keyin ko‘paytirish va bo‘lish — chapdan o‘ngga. So‘ng qo‘shish va ayirish — yana chapdan o‘ngga.`,
    },
  },
  {
    phase: { ru: 'Тренировка · с опорой', uz: 'Mashq · yordam bilan' },
    kind: { ru: 'Практика', uz: 'Mashq' },
    title: { ru: 'Решаем вместе', uz: 'Birga yechamiz' },
    instruction: {
      ru: 'Нажимай на следующий вычисляемый фрагмент.',
      uz: 'Keyingi hisoblanadigan qismni bosing.',
    },
    narration: {
      ru: `Начинаем тренировку с опорой. На каждом шаге нажимай на фрагмент, который нужно вычислить следующим. Следи, как выражение становится короче.`,
      uz: `Mashqni yordam bilan boshlaymiz. Har qadamda keyingi hisoblanadigan qismni bosing. Ifoda qanday qisqarib borayotganini kuzating.`,
    },
  },
  {
    phase: { ru: 'Тренировка · порядок', uz: 'Mashq · tartib' },
    kind: { ru: 'Практика', uz: 'Mashq' },
    title: { ru: 'Расставь номера', uz: 'Raqamlarni joylashtiring' },
    instruction: {
      ru: 'Нажимай на знаки: 1, 2, 3, 4.',
      uz: 'Belgilarga bosing: 1, 2, 3, 4.',
    },
    narration: {
      ru: `Теперь подсказки меньше. Не вычисляй сразу. Сначала определи весь порядок действий и поставь номера над знаками.`,
      uz: `Endi yordam kamayadi. Darhol hisoblamang. Avval barcha amallar tartibini aniqlab, belgilar ustiga raqam qo‘ying.`,
    },
  },
  {
    phase: { ru: 'Тренировка · самостоятельно', uz: 'Mashq · mustaqil' },
    kind: { ru: 'Практика', uz: 'Mashq' },
    title: { ru: 'Найди значение выражения', uz: 'Ifodaning qiymatini toping' },
    instruction: {
      ru: 'Реши без таймера и введи ответ.',
      uz: 'Vaqt cheklovisiz yeching va javobni kiriting.',
    },
    narration: {
      ru: `Теперь реши типовой пример самостоятельно. Таймера нет. Сначала мысленно определи порядок действий, затем аккуратно вычисли значение выражения.`,
      uz: `Endi odatiy misolni mustaqil yeching. Taymer yo‘q. Avval amallar tartibini aniqlang, so‘ng ifodaning qiymatini ehtiyotkorlik bilan hisoblang.`,
    },
  },
  {
    phase: { ru: 'Тренировка · ловушка', uz: 'Mashq · tuzoq' },
    kind: { ru: 'Практика', uz: 'Mashq' },
    title: { ru: 'Одинаковая сила', uz: 'Bir xil kuch' },
    instruction: {
      ru: 'Выбери значение выражения.',
      uz: 'Ifodaning qiymatini tanlang.',
    },
    narration: {
      ru: `Деление и умножение имеют одинаковый приоритет. Поэтому их нельзя менять местами или объединять по желанию. Выполняй эти действия слева направо.`,
      uz: `Bo‘lish va ko‘paytirish bir xil ustuvorlikka ega. Shuning uchun ularning o‘rnini almashtirish yoki xohlagancha birlashtirish mumkin emas. Bu amallarni chapdan o‘ngga bajaring.`,
    },
  },
  {
    phase: { ru: 'Тренировка · ошибка', uz: 'Mashq · xato' },
    kind: { ru: 'Практика', uz: 'Mashq' },
    title: { ru: 'Где решение сломалось?', uz: 'Yechim qayerda buzildi?' },
    instruction: {
      ru: 'Нажми на первую неверную строку.',
      uz: 'Birinchi noto‘g‘ri qatorni bosing.',
    },
    narration: {
      ru: `Проверяя решение, ищи не последний неверный ответ, а первую строку, где нарушено правило. Именно там появилась причина всех следующих ошибок.`,
      uz: `Yechimni tekshirayotganda oxirgi noto‘g‘ri javobni emas, qoida birinchi marta buzilgan qatorni toping. Keyingi xatolarning sababi aynan shu yerda paydo bo‘lgan.`,
    },
  },
  {
    phase: { ru: 'Тренировка · конструктор', uz: 'Mashq · konstruktor' },
    kind: { ru: 'Практика', uz: 'Mashq' },
    title: { ru: 'Поставь скобки', uz: 'Qavslarni qo‘ying' },
    instruction: {
      ru: 'Выбери запись, которая даёт 9.',
      uz: '9 hosil qiladigan yozuvni tanlang.',
    },
    narration: {
      ru: `Скобки не просто украшают запись. Они меняют порядок действий и могут изменить значение выражения. Найди место для скобок так, чтобы равенство стало верным.`,
      uz: `Qavslar yozuvni shunchaki bezamaydi. Ular amallar tartibini va ifodaning qiymatini o‘zgartirishi mumkin. Tenglik to‘g‘ri bo‘lishi uchun qavslarning o‘rnini toping.`,
    },
  },
  {
    phase: { ru: 'Тренировка · стратегия', uz: 'Mashq · strategiya' },
    kind: { ru: 'Практика', uz: 'Mashq' },
    title: { ru: 'Выбери удобный способ', uz: 'Qulay usulni tanlang' },
    instruction: {
      ru: 'Выбери способ, затем реши пример.',
      uz: 'Usulni tanlang, so‘ng misolni yeching.',
    },
    narration: {
      ru: `Оба школьных способа верны. Решение по строкам удобно показывает вычисления. Номера над действиями помогают заранее увидеть маршрут. Выбери удобный способ и найди ответ.`,
      uz: `Ikkala maktab usuli ham to‘g‘ri. Qatorlar bo‘yicha yechim hisoblashni aniq ko‘rsatadi. Amallar ustidagi raqamlar yo‘lni oldindan ko‘rishga yordam beradi. Qulay usulni tanlab, javobni toping.`,
    },
  },
  {
    phase: { ru: 'Финальный вызов', uz: 'Yakuniy sinov' },
    kind: { ru: 'Проверка', uz: 'Tekshiruv' },
    title: { ru: 'Раскрой новый пример', uz: 'Yangi misolni yeching' },
    instruction: {
      ru: 'Реши и назови правило, которое помогло.',
      uz: 'Yeching va yordam bergan qoidani ayting.',
    },
    narration: {
      ru: `Финальный пример похож на начальный, но числа новые. Сначала раскрой внутренние скобки, затем внешние. После этого выполни сильные действия и закончи сложением и вычитанием слева направо.`,
      uz: `Yakuniy misol boshlang‘ich misolga o‘xshaydi, ammo sonlar yangi. Avval ichki, so‘ng tashqi qavslarni oching. Keyin kuchli amallarni bajarib, chapdan o‘ngga qo‘shish va ayirish bilan yakunlang.`,
    },
  },
]

const RULES = {
  brackets: {
    ru: 'Скобки — изнутри наружу.',
    uz: 'Qavslar — ichkaridan tashqariga.',
  },
  strong: {
    ru: 'Умножение и деление — слева направо.',
    uz: 'Ko‘paytirish va bo‘lish — chapdan o‘ngga.',
  },
  weak: {
    ru: 'Сложение и вычитание — слева направо.',
    uz: 'Qo‘shish va ayirish — chapdan o‘ngga.',
  },
}

const textOf = (value, lang) => {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  return value[lang] ?? value.ru ?? ''
}

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
  const speak = useCallback((value) => {
    if (muted || !value || typeof window === 'undefined' || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(String(value))
    utterance.lang = lang === 'uz' ? 'uz-UZ' : 'ru-RU'
    utterance.rate = 0.94
    window.speechSynthesis.speak(utterance)
  }, [lang, muted])

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
  }, [])

  return { speak, stop }
}

function Formula({ children, compact = false, className = '' }) {
  return (
    <div className={`g7-formula ${compact ? 'g7-formula-compact' : ''} ${className}`.trim()}>
      {children}
    </div>
  )
}

function Feedback({ state, children }) {
  if (!state) return <div className="g7-feedback-space" aria-hidden="true" />
  return (
    <div className={`g7-feedback g7-feedback-${state}`} aria-live="polite">
      <span>{state === 'ok' ? <Check size={16} strokeWidth={3} /> : <Lightbulb size={16} />}</span>
      <p>{children}</p>
    </div>
  )
}

function AnswerInput({ value, onChange, onCheck, label, lang, disabled = false }) {
  return (
    <div className="g7-answer-row">
      <label>
        <span>{label}</span>
        <input
          value={value}
          onChange={(event) => onChange(event.target.value.replace(/[^\d-]/g, ''))}
          inputMode="numeric"
          autoComplete="off"
          disabled={disabled}
          onKeyDown={(event) => {
            if (event.key === 'Enter') onCheck()
          }}
        />
      </label>
      <button type="button" className="g7-primary g7-check" onClick={onCheck} disabled={!value || disabled}>
        <Target size={17} />
        <span>{textOf({ ru: 'Проверить', uz: 'Tekshirish' }, lang)}</span>
      </button>
    </div>
  )
}

function ScreenHeading({ copy, lang }) {
  return (
    <div className="g7-screen-heading">
      <span>{textOf(copy.phase, lang)}</span>
      <h1>{textOf(copy.title, lang)}</h1>
      <p>{textOf(copy.instruction, lang)}</p>
    </div>
  )
}

function HookScreen({ lang, say, onAnswer }) {
  const [seconds, setSeconds] = useState(45)
  const [answer, setAnswer] = useState('')
  const [saved, setSaved] = useState(false)
  const copy = SCREEN_COPY[0]

  useEffect(() => {
    if (seconds <= 0 || saved) return undefined
    const timer = window.setInterval(() => {
      setSeconds((value) => Math.max(0, value - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [seconds, saved])

  const submit = () => {
    if (!answer) return
    setSaved(true)
    onAnswer({
      value: Number(answer),
      correct: Number(answer) === 124,
      diagnostic: true,
    })
    say(textOf({
      ru: 'Гипотеза сохранена. Пока не раскрываем ответ. На следующих экранах найдём правило и вернёмся к этой версии.',
      uz: 'Taxmin saqlandi. Hozircha javobni ochmaymiz. Keyingi ekranlarda qoidani topib, bu taxminga qaytamiz.',
    }, lang))
  }

  return (
    <div className="g7-screen g7-hook">
      <ScreenHeading copy={copy} lang={lang} />
      <div className="g7-main-card g7-hook-card">
        <div className="g7-detective-strip">
          <Search size={18} />
          <span>{textOf({ ru: 'Кто прав: Азиз или Малика?', uz: 'Kim haq: Azizmi yoki Malikami?' }, lang)}</span>
        </div>
        <Formula>{HOOK_EXPRESSION}</Formula>
        <div className="g7-hook-bottom">
          <div className="g7-hypotheses" aria-label={textOf({ ru: 'Два ответа', uz: 'Ikki javob' }, lang)}>
            <div><span>Азиз</span><strong>124</strong></div>
            <div><span>Малика</span><strong>54</strong></div>
          </div>
          <div
            className={`g7-timer ${seconds <= 10 ? 'g7-timer-ending' : ''}`}
            style={{ '--remaining': `${(seconds / 45) * 360}deg` }}
            aria-label={`${seconds} ${textOf({ ru: 'секунд', uz: 'soniya' }, lang)}`}
          >
            <Clock3 size={18} />
            <strong>{seconds}</strong>
            <small>{textOf({ ru: 'сек', uz: 'son' }, lang)}</small>
          </div>
        </div>
        {!saved ? (
          <AnswerInput
            value={answer}
            onChange={setAnswer}
            onCheck={submit}
            lang={lang}
            label={textOf({ ru: 'Твоя гипотеза', uz: 'Sizning taxminingiz' }, lang)}
          />
        ) : (
          <Feedback state="ok">
            {textOf({
              ru: `Гипотеза ${answer} сохранена. Проверим её в конце обучения.`,
              uz: `${answer} taxmini saqlandi. Uni o‘rganish oxirida tekshiramiz.`,
            }, lang)}
          </Feedback>
        )}
      </div>
    </div>
  )
}

function OpButton({ children, correct, onPick, picked }) {
  return (
    <button
      type="button"
      className={`g7-math-op ${correct && !picked ? 'g7-action-pulse' : ''} ${picked ? 'g7-op-picked' : ''}`}
      onClick={() => onPick(correct)}
      aria-label={`Операция ${children}`}
    >
      {children}
    </button>
  )
}

function FirstActionScreen({ lang, say, onAnswer }) {
  const [feedback, setFeedback] = useState(null)
  const [solved, setSolved] = useState(false)
  const copy = SCREEN_COPY[1]

  const pick = (correct) => {
    if (solved) return
    if (correct) {
      setSolved(true)
      setFeedback('ok')
      onAnswer({ correct: true, skill: 'find_first_action' })
      say(textOf({
        ru: 'Да. Первыми можно выполнить действия внутри круглых скобок. Скобки задают самый внутренний уровень выражения.',
        uz: 'Ha. Avval dumaloq qavs ichidagi amallarni bajarish mumkin. Qavslar ifodaning eng ichki darajasini belgilaydi.',
      }, lang))
    } else {
      setFeedback('hint')
      say(textOf({
        ru: 'Это действие пока ждёт. Найди знак внутри круглых скобок.',
        uz: 'Bu amal hozircha kutadi. Dumaloq qavs ichidagi belgini toping.',
      }, lang))
    }
  }

  return (
    <div className="g7-screen">
      <ScreenHeading copy={copy} lang={lang} />
      <div className="g7-main-card g7-focus-card">
        <div className="g7-tap-cue">
          <span>1</span>
          {textOf({ ru: 'Нажми прямо на знак действия', uz: 'Amal belgisining o‘zini bosing' }, lang)}
        </div>
        <div className="g7-inline-expression g7-op-expression">
          <span>120</span>
          <OpButton onPick={pick}>−</OpButton>
          <span>84</span>
          <OpButton onPick={pick}>:</OpButton>
          <span>[2</span>
          <OpButton onPick={pick}>·</OpButton>
          <span>(7</span>
          <OpButton correct onPick={pick} picked={solved}>−</OpButton>
          <span>4)]</span>
          <OpButton onPick={pick}>+</OpButton>
          <span>3</span>
          <OpButton onPick={pick}>·</OpButton>
          <span>(15</span>
          <OpButton correct onPick={pick} picked={solved}>−</OpButton>
          <span>9)</span>
        </div>
        <Feedback state={feedback}>
          {feedback === 'ok'
            ? textOf({ ru: 'Правило: сначала действия внутри скобок.', uz: 'Qoida: avval qavs ichidagi amallar.' }, lang)
            : textOf({ ru: 'Ищи самый внутренний уровень — круглые скобки.', uz: 'Eng ichki darajani — dumaloq qavslarni qidiring.' }, lang)}
        </Feedback>
      </div>
    </div>
  )
}

function InnerBracketsScreen({ lang, say, onAnswer }) {
  const [leftDone, setLeftDone] = useState(false)
  const [rightDone, setRightDone] = useState(false)
  const copy = SCREEN_COPY[2]
  const complete = leftDone && rightDone

  const solveLeft = () => {
    setLeftDone(true)
    say(textOf({
      ru: 'Семь минус четыре равно трём. Первая круглая скобка стала числом три.',
      uz: 'Yetti minus to‘rt uchga teng. Birinchi dumaloq qavs uch soniga aylandi.',
    }, lang))
    if (rightDone) onAnswer({ correct: true, skill: 'inner_brackets' })
  }

  const solveRight = () => {
    setRightDone(true)
    say(textOf({
      ru: 'Пятнадцать минус девять равно шести. Вторая круглая скобка стала числом шесть.',
      uz: 'O‘n besh minus to‘qqiz oltiga teng. Ikkinchi dumaloq qavs olti soniga aylandi.',
    }, lang))
    if (leftDone) onAnswer({ correct: true, skill: 'inner_brackets' })
  }

  return (
    <div className="g7-screen">
      <ScreenHeading copy={copy} lang={lang} />
      <div className="g7-main-card g7-transform-card">
        <Formula compact>
          <span>120 − 84 : [2 · </span>
          {leftDone
            ? <span className="g7-replacement">3</span>
            : <button type="button" className="g7-math-fragment g7-action-pulse" onClick={solveLeft}>(7 − 4)</button>}
          <span>] + 3 · </span>
          {rightDone
            ? <span className="g7-replacement">6</span>
            : <button type="button" className="g7-math-fragment g7-action-pulse" onClick={solveRight}>(15 − 9)</button>}
        </Formula>
        <div className="g7-mini-steps">
          <span className={leftDone ? 'is-done' : ''}><b>1</b> 7 − 4 {leftDone ? '= 3' : ''}</span>
          <span className={rightDone ? 'is-done' : ''}><b>2</b> 15 − 9 {rightDone ? '= 6' : ''}</span>
        </div>
        <Feedback state={complete ? 'ok' : null}>
          {textOf({ ru: 'Вывод: независимые скобки можно считать в любом порядке.', uz: 'Xulosa: mustaqil qavslarni istalgan tartibda hisoblash mumkin.' }, lang)}
        </Feedback>
      </div>
    </div>
  )
}

function OuterBracketsScreen({ lang, say, onAnswer }) {
  const [solved, setSolved] = useState(false)
  const copy = SCREEN_COPY[3]

  const solve = () => {
    setSolved(true)
    onAnswer({ correct: true, skill: 'nested_brackets' })
    say(textOf({
      ru: 'Два умножить на три равно шести. Мы закончили квадратные скобки. Теперь все скобки стали числами.',
      uz: 'Ikki karra uch oltiga teng. Kvadrat qavsni yakunladik. Endi barcha qavslar sonlarga aylandi.',
    }, lang))
  }

  return (
    <div className="g7-screen">
      <ScreenHeading copy={copy} lang={lang} />
      <div className="g7-main-card g7-transform-card">
        <div className="g7-level-map">
          <span className="is-done"><b>1</b>{textOf({ ru: 'Круглые', uz: 'Dumaloq' }, lang)}</span>
          <ArrowRight size={17} />
          <span className={solved ? 'is-done' : 'is-current'}><b>2</b>{textOf({ ru: 'Квадратные', uz: 'Kvadrat' }, lang)}</span>
        </div>
        <Formula compact>
          <span>120 − 84 : </span>
          {solved
            ? <span className="g7-replacement">6</span>
            : <button type="button" className="g7-math-fragment g7-action-pulse" onClick={solve}>[2 · 3]</button>}
          <span> + 3 · 6</span>
        </Formula>
        <div className={`g7-equation-morph ${solved ? 'is-visible' : ''}`}>
          <span>[2 · 3]</span><ArrowRight size={20} /><strong>6</strong>
        </div>
        <Feedback state={solved ? 'ok' : null}>
          {textOf({ ru: 'Правило: вложенные скобки раскрываем изнутри наружу.', uz: 'Qoida: ichma-ich qavslarni ichkaridan tashqariga ochamiz.' }, lang)}
        </Feedback>
      </div>
    </div>
  )
}

function StrongActionsScreen({ lang, say, onAnswer }) {
  const [divisionDone, setDivisionDone] = useState(false)
  const [productDone, setProductDone] = useState(false)
  const copy = SCREEN_COPY[4]
  const complete = divisionDone && productDone

  const divide = () => {
    setDivisionDone(true)
    say(textOf({
      ru: 'Восемьдесят четыре разделить на шесть равно четырнадцати. Деление выполнено раньше вычитания.',
      uz: 'Sakson to‘rtni oltiga bo‘lsak, o‘n to‘rt bo‘ladi. Bo‘lish ayirishdan oldin bajarildi.',
    }, lang))
    if (productDone) onAnswer({ correct: true, skill: 'operation_priority' })
  }

  const multiply = () => {
    setProductDone(true)
    say(textOf({
      ru: 'Три умножить на шесть равно восемнадцати. Умножение выполнено раньше сложения.',
      uz: 'Uch karra olti o‘n sakkizga teng. Ko‘paytirish qo‘shishdan oldin bajarildi.',
    }, lang))
    if (divisionDone) onAnswer({ correct: true, skill: 'operation_priority' })
  }

  return (
    <div className="g7-screen">
      <ScreenHeading copy={copy} lang={lang} />
      <div className="g7-main-card g7-transform-card">
        <div className="g7-priority-strip">
          <span>{textOf({ ru: 'Сейчас работают', uz: 'Hozir bajariladi' }, lang)}</span>
          <strong>· &nbsp; :</strong>
          <small>{textOf({ ru: '+ и − ждут', uz: '+ va − kutadi' }, lang)}</small>
        </div>
        <Formula compact>
          <span>120 − </span>
          {divisionDone
            ? <span className="g7-replacement">14</span>
            : <button type="button" className="g7-math-fragment g7-action-pulse" onClick={divide}>84 : 6</button>}
          <span> + </span>
          {productDone
            ? <span className="g7-replacement">18</span>
            : <button type="button" className="g7-math-fragment g7-action-pulse" onClick={multiply}>3 · 6</button>}
        </Formula>
        <div className={`g7-final-line ${complete ? 'is-visible' : ''}`}>120 − 14 + 18</div>
        <Feedback state={complete ? 'ok' : null}>
          {textOf({ ru: 'Вывод: остались только сложение и вычитание.', uz: 'Xulosa: faqat qo‘shish va ayirish qoldi.' }, lang)}
        </Feedback>
      </div>
    </div>
  )
}

const ROW_SOLUTION = [
  '120 − 84 : [2 · (7 − 4)] + 3 · (15 − 9)',
  '= 120 − 84 : [2 · 3] + 3 · 6',
  '= 120 − 84 : 6 + 18',
  '= 120 − 14 + 18',
  '= 106 + 18',
  '= 124',
]

function RowsMethodScreen({ lang, say, onAnswer }) {
  const [step, setStep] = useState(0)
  const copy = SCREEN_COPY[5]
  const explanations = [
    null,
    {
      ru: 'Сначала вычислили круглые скобки. В новой строке изменились только они.',
      uz: 'Avval dumaloq qavslarni hisobladik. Yangi qatorda faqat ular o‘zgardi.',
    },
    {
      ru: 'Затем закончили квадратные скобки и умножение справа.',
      uz: 'Keyin kvadrat qavsni va o‘ngdagi ko‘paytirishni tugatdik.',
    },
    {
      ru: 'После скобок выполнили деление: восемьдесят четыре разделить на шесть.',
      uz: 'Qavslardan keyin bo‘lishni bajardik: sakson to‘rtni oltiga bo‘ldik.',
    },
    {
      ru: 'Сложение и вычитание выполняем слева направо: сто двадцать минус четырнадцать.',
      uz: 'Qo‘shish va ayirishni chapdan o‘ngga bajaramiz: bir yuz yigirmadan o‘n to‘rtni ayiramiz.',
    },
    {
      ru: 'Сто шесть плюс восемнадцать равно ста двадцати четырём. Получили ответ.',
      uz: 'Bir yuz olti qo‘shilgan o‘n sakkiz bir yuz yigirma to‘rtga teng. Javobni oldik.',
    },
  ]

  const advance = () => {
    const next = Math.min(step + 1, ROW_SOLUTION.length - 1)
    setStep(next)
    say(textOf(explanations[next], lang))
    if (next === ROW_SOLUTION.length - 1) {
      onAnswer({ correct: true, skill: 'line_method' })
    }
  }

  return (
    <div className="g7-screen">
      <ScreenHeading copy={copy} lang={lang} />
      <div className="g7-main-card g7-rows-card">
        <div className="g7-solution-lines">
          {ROW_SOLUTION.map((line, index) => (
            <div
              key={line}
              className={`${index <= step ? 'is-visible' : ''} ${index === step ? 'is-current' : ''}`}
            >
              <span>{line}</span>
              {index > 0 && index <= step && <Check size={14} />}
            </div>
          ))}
        </div>
        <button type="button" className="g7-step-button" onClick={advance} disabled={step === ROW_SOLUTION.length - 1}>
          <span>{step === ROW_SOLUTION.length - 1
            ? textOf({ ru: 'Решение завершено', uz: 'Yechim tugadi' }, lang)
            : textOf({ ru: 'Следующее преобразование', uz: 'Keyingi o‘zgarish' }, lang)}</span>
          {step === ROW_SOLUTION.length - 1 ? <Check size={18} /> : <ArrowRight size={18} />}
        </button>
      </div>
    </div>
  )
}

function NumberedExpression({ tokens, operationOrder, current, onPick, completeLabel }) {
  const numberByToken = useMemo(() => {
    const result = {}
    operationOrder.forEach((tokenIndex, orderIndex) => {
      if (orderIndex < current) result[tokenIndex] = orderIndex + 1
    })
    return result
  }, [operationOrder, current])

  return (
    <>
      <div className="g7-numbered-expression">
        {tokens.map((token, index) => {
          const operationPosition = operationOrder.indexOf(index)
          if (operationPosition === -1) {
            return <span key={`${token}-${index}`} className="g7-nf-token">{token}</span>
          }
          const isNext = operationPosition === current
          return (
            <button
              type="button"
              key={`${token}-${index}`}
              className={`g7-nf-operation ${isNext ? 'g7-action-pulse' : ''} ${numberByToken[index] ? 'is-numbered' : ''}`}
              onClick={() => onPick(index)}
              aria-label={`Операция ${token}`}
            >
              <small>{numberByToken[index] ?? ''}</small>
              <strong>{token}</strong>
            </button>
          )
        })}
      </div>
      <div className={`g7-numbering-result ${current === operationOrder.length ? 'is-visible' : ''}`}>
        <Check size={16} />
        <span>{completeLabel}</span>
      </div>
    </>
  )
}

function SchoolNumbersScreen({ lang, say, onAnswer }) {
  const tokens = ['120', '−', '84', ':', '[2', '·', '(', '7', '−', '4', ')]', '+', '3', '·', '(', '15', '−', '9', ')']
  const order = [8, 16, 5, 3, 13, 1, 11]
  const [current, setCurrent] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const copy = SCREEN_COPY[6]

  const pick = (tokenIndex) => {
    if (current >= order.length) return
    if (tokenIndex !== order[current]) {
      setFeedback('hint')
      say(textOf({
        ru: 'Пока рано. Проверь: остались ли действия внутри скобок?',
        uz: 'Hali erta. Tekshiring: qavs ichida amal qoldimi?',
      }, lang))
      return
    }
    const next = current + 1
    setCurrent(next)
    setFeedback(null)
    say(textOf({
      ru: `Это действие номер ${next}. ${next <= 3 ? 'Продолжаем двигаться от внутренних скобок наружу.' : next <= 5 ? 'Теперь выполняются умножение и деление.' : 'Последними идут сложение и вычитание слева направо.'}`,
      uz: `Bu ${next}-amal. ${next <= 3 ? 'Ichki qavslardan tashqariga yurishda davom etamiz.' : next <= 5 ? 'Endi ko‘paytirish va bo‘lish bajariladi.' : 'Oxirida qo‘shish va ayirish chapdan o‘ngga bajariladi.'}`,
    }, lang))
    if (next === order.length) onAnswer({ correct: true, skill: 'number_operations' })
  }

  return (
    <div className="g7-screen">
      <ScreenHeading copy={copy} lang={lang} />
      <div className="g7-main-card g7-number-card">
        <div className="g7-tap-cue">
          <span>{Math.min(current + 1, order.length)}</span>
          {current === order.length
            ? textOf({ ru: 'Маршрут готов', uz: 'Yo‘l tayyor' }, lang)
            : textOf({ ru: 'Найди следующий знак', uz: 'Keyingi belgini toping' }, lang)}
        </div>
        <NumberedExpression
          tokens={tokens}
          operationOrder={order}
          current={current}
          onPick={pick}
          completeLabel={textOf({ ru: 'Теперь пример можно решать без догадок.', uz: 'Endi misolni taxminsiz yechish mumkin.' }, lang)}
        />
        <Feedback state={feedback}>
          {textOf({ ru: 'Ищи самый внутренний незавершённый уровень.', uz: 'Eng ichki tugallanmagan darajani qidiring.' }, lang)}
        </Feedback>
      </div>
    </div>
  )
}

function RuleBuilderScreen({ lang, say, onAnswer }) {
  const items = [
    { id: 'strong', text: RULES.strong },
    { id: 'brackets', text: RULES.brackets },
    { id: 'weak', text: RULES.weak },
  ]
  const correctOrder = ['brackets', 'strong', 'weak']
  const [selected, setSelected] = useState([])
  const [feedback, setFeedback] = useState(null)
  const copy = SCREEN_COPY[7]

  const choose = (id) => {
    if (selected.includes(id)) return
    const expected = correctOrder[selected.length]
    if (id !== expected) {
      setFeedback('hint')
      say(textOf({
        ru: 'Этот пункт будет позже. Сначала найди самый внутренний уровень выражения.',
        uz: 'Bu band keyinroq keladi. Avval ifodaning eng ichki darajasini toping.',
      }, lang))
      return
    }
    const next = [...selected, id]
    setSelected(next)
    setFeedback(null)
    say(textOf(items.find((item) => item.id === id).text, lang))
    if (next.length === 3) onAnswer({ correct: true, skill: 'rule' })
  }

  return (
    <div className="g7-screen">
      <ScreenHeading copy={copy} lang={lang} />
      <div className="g7-main-card g7-rule-card">
        <div className="g7-rule-builder">
          {items.map((item) => {
            const position = selected.indexOf(item.id)
            return (
              <button
                type="button"
                key={item.id}
                className={`${position >= 0 ? 'is-selected' : ''} ${item.id === correctOrder[selected.length] ? 'g7-action-pulse' : ''}`}
                onClick={() => choose(item.id)}
              >
                <span>{position >= 0 ? position + 1 : '?'}</span>
                <strong>{textOf(item.text, lang)}</strong>
                {position >= 0 && <Check size={17} />}
              </button>
            )
          })}
        </div>
        {selected.length === 3 && (
          <div className="g7-hook-return">
            <span>{HOOK_EXPRESSION}</span>
            <strong>= 124</strong>
            <small>{textOf({ ru: '54 получилось при ошибочном счёте просто слева направо.', uz: '54 javobi amallarni shunchaki chapdan o‘ngga bajarish xatosidan chiqqan.' }, lang)}</small>
          </div>
        )}
        <Feedback state={feedback}>
          {textOf({ ru: 'Первым всегда проверяем наличие скобок.', uz: 'Avval doimo qavslar borligini tekshiramiz.' }, lang)}
        </Feedback>
      </div>
    </div>
  )
}

const GUIDED_STEPS = [
  { expression: '72 − 24 : (7 − 3) + 5 · 2', fragment: '(7 − 3)', result: '4' },
  { expression: '72 − 24 : 4 + 5 · 2', fragment: '24 : 4', result: '6' },
  { expression: '72 − 6 + 5 · 2', fragment: '5 · 2', result: '10' },
  { expression: '72 − 6 + 10', fragment: '72 − 6', result: '66' },
  { expression: '66 + 10', fragment: '66 + 10', result: '76' },
]

function GuidedPracticeScreen({ lang, say, onAnswer }) {
  const [step, setStep] = useState(0)
  const copy = SCREEN_COPY[8]
  const done = step === GUIDED_STEPS.length
  const current = GUIDED_STEPS[Math.min(step, GUIDED_STEPS.length - 1)]

  const advance = () => {
    const next = step + 1
    say(textOf({
      ru: `${current.fragment} равно ${current.result}. Вычисленный фрагмент заменяем одним числом.`,
      uz: `${current.fragment} ${current.result} ga teng. Hisoblangan qismni bitta son bilan almashtiramiz.`,
    }, lang))
    setStep(next)
    if (next === GUIDED_STEPS.length) onAnswer({ correct: true, value: 76, skill: 'guided_calculation' })
  }

  return (
    <div className="g7-screen">
      <ScreenHeading copy={copy} lang={lang} />
      <div className="g7-main-card g7-guided-card">
        <div className="g7-support-meter">
          <span>{textOf({ ru: 'Опора', uz: 'Yordam' }, lang)}</span>
          <i /><i /><i className="is-faint" />
        </div>
        <Formula compact>{done ? '76' : current.expression}</Formula>
        {!done ? (
          <button type="button" className="g7-fragment-choice g7-action-pulse" onClick={advance}>
            <small>{textOf({ ru: 'Следующий фрагмент', uz: 'Keyingi qism' }, lang)}</small>
            <strong>{current.fragment}</strong>
            <ArrowRight size={18} />
          </button>
        ) : (
          <div className="g7-answer-reveal"><Check size={20} /><strong>76</strong></div>
        )}
        <div className="g7-step-dots">
          {GUIDED_STEPS.map((_, index) => <i key={index} className={index < step ? 'is-done' : index === step ? 'is-current' : ''} />)}
        </div>
      </div>
    </div>
  )
}

function PracticeOrderScreen({ lang, say, onAnswer }) {
  const tokens = ['48', ':', '(', '9', '−', '3', ')', '·', '2', '+', '7']
  const order = [4, 1, 7, 9]
  const [current, setCurrent] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const copy = SCREEN_COPY[9]

  const pick = (tokenIndex) => {
    if (tokenIndex !== order[current]) {
      setFeedback('hint')
      say(textOf({
        ru: 'Проверь уровень. Сначала скобки, затем действия одинаковой силы слева направо.',
        uz: 'Darajani tekshiring. Avval qavslar, keyin bir xil kuchdagi amallar chapdan o‘ngga.',
      }, lang))
      return
    }
    const next = current + 1
    setCurrent(next)
    setFeedback(null)
    say(textOf({
      ru: `Верно, это действие номер ${next}.`,
      uz: `To‘g‘ri, bu ${next}-amal.`,
    }, lang))
    if (next === order.length) onAnswer({ correct: true, value: 23, skill: 'operation_order' })
  }

  return (
    <div className="g7-screen">
      <ScreenHeading copy={copy} lang={lang} />
      <div className="g7-main-card g7-number-card">
        <NumberedExpression
          tokens={tokens}
          operationOrder={order}
          current={current}
          onPick={pick}
          completeLabel={textOf({ ru: 'Порядок: скобки → деление → умножение → сложение.', uz: 'Tartib: qavs → bo‘lish → ko‘paytirish → qo‘shish.' }, lang)}
        />
        <Feedback state={feedback}>
          {textOf({ ru: 'Сначала найди действие внутри скобок.', uz: 'Avval qavs ichidagi amalni toping.' }, lang)}
        </Feedback>
      </div>
    </div>
  )
}

function IndependentScreen({ lang, say, onAnswer }) {
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [solved, setSolved] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const copy = SCREEN_COPY[10]

  const check = () => {
    const correct = Number(answer) === 78
    const nextAttempts = attempts + 1
    setAttempts(nextAttempts)
    if (correct) {
      setSolved(true)
      setFeedback('ok')
      onAnswer({ correct: true, value: 78, attempts: nextAttempts, skill: 'independent_calculation' })
      say(textOf({
        ru: 'Ответ семьдесят восемь. Сначала разделили сорок два на семь, затем умножили на три и вычли результат из девяноста шести.',
        uz: 'Javob yetmish sakkiz. Avval qirq ikkini yettiga bo‘ldik, keyin uchga ko‘paytirib, natijani to‘qson oltidan ayirdik.',
      }, lang))
    } else {
      setFeedback('hint')
      say(textOf({
        ru: 'Проверь, не выполнил ли ты вычитание раньше деления и умножения.',
        uz: 'Ayirishni bo‘lish va ko‘paytirishdan oldin bajarib qo‘ymadingizmi, tekshiring.',
      }, lang))
    }
  }

  return (
    <div className="g7-screen">
      <ScreenHeading copy={copy} lang={lang} />
      <div className="g7-main-card g7-independent-card">
        <Formula>96 − 42 : 7 · 3</Formula>
        <AnswerInput
          value={answer}
          onChange={setAnswer}
          onCheck={check}
          lang={lang}
          label={textOf({ ru: 'Твой ответ', uz: 'Javobingiz' }, lang)}
          disabled={solved}
        />
        <Feedback state={feedback}>
          {feedback === 'ok'
            ? textOf({ ru: '42 : 7 = 6; 6 · 3 = 18; 96 − 18 = 78.', uz: '42 : 7 = 6; 6 · 3 = 18; 96 − 18 = 78.' }, lang)
            : textOf({ ru: 'Сначала выполни : и · слева направо.', uz: 'Avval : va · ni chapdan o‘ngga bajaring.' }, lang)}
        </Feedback>
      </div>
    </div>
  )
}

function EqualPriorityScreen({ lang, say, onAnswer }) {
  const [picked, setPicked] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const copy = SCREEN_COPY[11]
  const options = [4, 8, 16]

  const choose = (value) => {
    setPicked(value)
    if (value === 16) {
      setFeedback('ok')
      onAnswer({ correct: true, value, skill: 'left_to_right' })
      say(textOf({
        ru: 'Верно. Сначала шестьдесят четыре разделить на восемь — получаем восемь. Затем восемь умножить на два — получаем шестнадцать.',
        uz: 'To‘g‘ri. Avval oltmish to‘rtni sakkizga bo‘lib, sakkiz olamiz. Keyin sakkizni ikkiga ko‘paytirib, o‘n olti olamiz.',
      }, lang))
    } else {
      setFeedback('hint')
      say(textOf({
        ru: 'Деление и умножение имеют одинаковую силу. Начни с самого левого действия.',
        uz: 'Bo‘lish va ko‘paytirish bir xil kuchga ega. Eng chapdagi amaldan boshlang.',
      }, lang))
    }
  }

  return (
    <div className="g7-screen">
      <ScreenHeading copy={copy} lang={lang} />
      <div className="g7-main-card g7-choice-card">
        <Formula>64 : 8 · 2</Formula>
        <div className="g7-choice-row">
          {options.map((value) => (
            <button
              type="button"
              key={value}
              className={`${picked === value ? 'is-picked' : ''} ${feedback === 'ok' && value === 16 ? 'is-correct' : ''}`}
              onClick={() => choose(value)}
            >
              {value}
            </button>
          ))}
        </div>
        <div className={`g7-solution-flow ${feedback === 'ok' ? 'is-visible' : ''}`}>
          <span>64 : 8 · 2</span><ArrowRight size={15} /><span>8 · 2</span><ArrowRight size={15} /><strong>16</strong>
        </div>
        <Feedback state={feedback}>
          {feedback === 'ok'
            ? textOf({ ru: 'Правило: одинаковый приоритет — считаем слева направо.', uz: 'Qoida: ustuvorlik bir xil bo‘lsa, chapdan o‘ngga hisoblaymiz.' }, lang)
            : textOf({ ru: 'Не объединяй 8 · 2. Первым записано деление.', uz: '8 · 2 ni birlashtirmang. Birinchi bo‘lish yozilgan.' }, lang)}
        </Feedback>
      </div>
    </div>
  )
}

function ErrorDetectiveScreen({ lang, say, onAnswer }) {
  const lines = [
    '84 − 36 : (8 − 2) + 5',
    '= 84 − 36 : 6 + 5',
    '= 48 : 6 + 5',
    '= 8 + 5 = 13',
  ]
  const [picked, setPicked] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const copy = SCREEN_COPY[12]

  const choose = (index) => {
    setPicked(index)
    if (index === 2) {
      setFeedback('ok')
      onAnswer({ correct: true, line: index + 1, skill: 'error_analysis' })
      say(textOf({
        ru: 'Ошибка в третьей строке. Из восьмидесяти четырёх вычли тридцать шесть раньше деления. Нужно сначала вычислить тридцать шесть разделить на шесть.',
        uz: 'Xato uchinchi qatorda. Sakson to‘rtdan o‘ttiz oltini bo‘lishdan oldin ayirib yuborilgan. Avval o‘ttiz oltini oltiga bo‘lish kerak.',
      }, lang))
    } else {
      setFeedback('hint')
      say(textOf({
        ru: 'Ищи первую строку, где правильное выражение превратилось в неправильное.',
        uz: 'To‘g‘ri ifoda birinchi marta noto‘g‘ri ifodaga aylangan qatorni toping.',
      }, lang))
    }
  }

  return (
    <div className="g7-screen">
      <ScreenHeading copy={copy} lang={lang} />
      <div className="g7-main-card g7-error-card">
        <div className="g7-error-lines">
          {lines.map((line, index) => (
            <button
              type="button"
              key={line}
              onClick={() => choose(index)}
              className={`${picked === index ? 'is-picked' : ''} ${feedback === 'ok' && index === 2 ? 'is-error' : ''}`}
            >
              <span>{index + 1}</span>
              <strong>{line}</strong>
            </button>
          ))}
        </div>
        <Feedback state={feedback}>
          {feedback === 'ok'
            ? textOf({ ru: 'Нарушение: вычитание выполнено раньше деления.', uz: 'Buzilish: ayirish bo‘lishdan oldin bajarilgan.' }, lang)
            : textOf({ ru: 'Сравни соседние строки и найди первое неверное изменение.', uz: 'Yonma-yon qatorlarni solishtirib, birinchi noto‘g‘ri o‘zgarishni toping.' }, lang)}
        </Feedback>
      </div>
    </div>
  )
}

function BracketConstructorScreen({ lang, say, onAnswer }) {
  const options = ['(36 : 3) + 1 = 9', '36 : (3 + 1) = 9', '36 : 3 + (1) = 9']
  const [picked, setPicked] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const copy = SCREEN_COPY[13]

  const choose = (index) => {
    setPicked(index)
    if (index === 1) {
      setFeedback('ok')
      onAnswer({ correct: true, option: index, skill: 'bracket_effect' })
      say(textOf({
        ru: 'Верно. Три плюс один равно четырём. Тридцать шесть разделить на четыре равно девяти. Скобки изменили первое действие.',
        uz: 'To‘g‘ri. Uch qo‘shilgan bir to‘rtga teng. O‘ttiz oltini to‘rtga bo‘lsak, to‘qqiz bo‘ladi. Qavslar birinchi amalni o‘zgartirdi.',
      }, lang))
    } else {
      setFeedback('hint')
      say(textOf({
        ru: 'Проверь значение внутри выбранных скобок, а затем всё выражение.',
        uz: 'Tanlangan qavs ichidagi qiymatni, keyin butun ifodani tekshiring.',
      }, lang))
    }
  }

  return (
    <div className="g7-screen">
      <ScreenHeading copy={copy} lang={lang} />
      <div className="g7-main-card g7-bracket-card">
        <div className="g7-target-equation">
          <span>36 : 3 + 1</span><strong>= 9</strong>
        </div>
        <div className="g7-bracket-options">
          {options.map((option, index) => (
            <button
              type="button"
              key={option}
              onClick={() => choose(index)}
              className={`${picked === index ? 'is-picked' : ''} ${feedback === 'ok' && index === 1 ? 'is-correct' : ''}`}
            >
              <span>{String.fromCharCode(65 + index)}</span>
              <strong>{option}</strong>
            </button>
          ))}
        </div>
        <Feedback state={feedback}>
          {feedback === 'ok'
            ? textOf({ ru: '36 : (3 + 1) = 36 : 4 = 9.', uz: '36 : (3 + 1) = 36 : 4 = 9.' }, lang)
            : textOf({ ru: 'Нужно, чтобы сначала получилось число 4.', uz: 'Avval 4 soni hosil bo‘lishi kerak.' }, lang)}
        </Feedback>
      </div>
    </div>
  )
}

function StrategyScreen({ lang, say, onAnswer }) {
  const [strategy, setStrategy] = useState(null)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [solved, setSolved] = useState(false)
  const copy = SCREEN_COPY[14]

  const chooseStrategy = (value) => {
    setStrategy(value)
    say(textOf(value === 'rows'
      ? {
        ru: 'Решение по строкам покажет каждое преобразование. Меняй только вычисленную часть.',
        uz: 'Qatorlar bo‘yicha yechim har bir o‘zgarishni ko‘rsatadi. Faqat hisoblangan qismni o‘zgartiring.',
      }
      : {
        ru: 'Сначала поставь номера над действиями, затем вычисляй по готовому маршруту.',
        uz: 'Avval amallar ustiga raqam qo‘ying, keyin tayyor yo‘l bo‘yicha hisoblang.',
      }, lang))
  }

  const check = () => {
    if (Number(answer) === 88) {
      setSolved(true)
      setFeedback('ok')
      onAnswer({ correct: true, value: 88, strategy, skill: 'strategy_choice' })
      say(textOf({
        ru: 'Ответ восемьдесят восемь. Выбранный способ сработал: сначала скобки, затем деление, после него вычитание и сложение.',
        uz: 'Javob sakson sakkiz. Tanlangan usul ishladi: avval qavslar, keyin bo‘lish, undan so‘ng ayirish va qo‘shish.',
      }, lang))
    } else {
      setFeedback('hint')
      say(textOf({
        ru: 'Проверь первый шаг: восемь минус два равно шести. Затем сорок восемь раздели на шесть.',
        uz: 'Birinchi qadamni tekshiring: sakkiz minus ikki oltiga teng. Keyin qirq sakkizni oltiga bo‘ling.',
      }, lang))
    }
  }

  return (
    <div className="g7-screen">
      <ScreenHeading copy={copy} lang={lang} />
      <div className="g7-main-card g7-strategy-card">
        <Formula compact>90 − 48 : (8 − 2) + 6</Formula>
        <div className="g7-strategy-options">
          <button type="button" className={strategy === 'rows' ? 'is-picked' : ''} onClick={() => chooseStrategy('rows')}>
            <span>01</span><strong>{textOf({ ru: 'По строкам', uz: 'Qatorlar bo‘yicha' }, lang)}</strong>
          </button>
          <button type="button" className={strategy === 'numbers' ? 'is-picked' : ''} onClick={() => chooseStrategy('numbers')}>
            <span>02</span><strong>{textOf({ ru: 'Номера над знаками', uz: 'Belgilar ustida raqamlar' }, lang)}</strong>
          </button>
        </div>
        {strategy && (
          <AnswerInput
            value={answer}
            onChange={setAnswer}
            onCheck={check}
            lang={lang}
            label={textOf({ ru: 'Ответ', uz: 'Javobingiz' }, lang)}
            disabled={solved}
          />
        )}
        <Feedback state={feedback}>
          {feedback === 'ok'
            ? textOf({ ru: `Способ выбран осознанно. Ответ: 88.`, uz: `Usul ongli ravishda tanlandi. Javob: 88.` }, lang)
            : textOf({ ru: 'Скобки → деление → вычитание и сложение.', uz: 'Qavslar → bo‘lish → ayirish va qo‘shish.' }, lang)}
        </Feedback>
      </div>
    </div>
  )
}

function FinalChallengeScreen({ lang, say, onAnswer }) {
  const [answer, setAnswer] = useState('')
  const [rule, setRule] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [valueCorrect, setValueCorrect] = useState(false)
  const copy = SCREEN_COPY[15]
  const rules = [
    { id: 'brackets', text: RULES.brackets },
    { id: 'left', text: { ru: 'Всегда считаем только слева направо.', uz: 'Har doim faqat chapdan o‘ngga hisoblaymiz.' } },
    { id: 'plus', text: { ru: 'Сложение выполняем первым.', uz: 'Qo‘shishni birinchi bajaramiz.' } },
  ]

  const check = () => {
    if (Number(answer) === 158) {
      setValueCorrect(true)
      setFeedback('ok')
      say(textOf({
        ru: 'Значение выражения — сто пятьдесят восемь. Теперь выбери главное правило, которое открыло решение.',
        uz: 'Ifodaning qiymati bir yuz ellik sakkiz. Endi yechimni ochgan asosiy qoidani tanlang.',
      }, lang))
    } else {
      setFeedback('hint')
      say(textOf({
        ru: 'Проверь маршрут: восемь минус шесть, затем три умножить на два, после этого семьдесят два разделить на шесть.',
        uz: 'Yo‘lni tekshiring: sakkiz minus olti, keyin uch karra ikki, undan so‘ng yetmish ikkini oltiga bo‘ling.',
      }, lang))
    }
  }

  const chooseRule = (id) => {
    setRule(id)
    if (id === 'brackets') {
      setFeedback('ok')
      onAnswer({ correct: true, value: 158, rule: id, skill: 'final_transfer' })
      say(textOf({
        ru: 'Точно. Вложенные скобки открыли весь маршрут. Ты умеешь видеть структуру числового выражения и выбирать порядок действий.',
        uz: 'To‘g‘ri. Ichma-ich qavslar butun yo‘lni ochdi. Siz sonli ifodaning tuzilishini ko‘ra olasiz va amallar tartibini tanlay olasiz.',
      }, lang))
    } else {
      setFeedback('hint')
      say(textOf({
        ru: 'Это правило не объясняет первый шаг. Вспомни, что мы искали в начале выражения.',
        uz: 'Bu qoida birinchi qadamni tushuntirmaydi. Ifoda boshida nimani qidirganimizni eslang.',
      }, lang))
    }
  }

  const complete = valueCorrect && rule === 'brackets'

  return (
    <div className="g7-screen">
      <ScreenHeading copy={copy} lang={lang} />
      <div className={`g7-main-card g7-final-card ${complete ? 'is-complete' : ''}`}>
        <Formula compact>150 − 72 : [3 · (8 − 6)] + 4 · 5</Formula>
        {!valueCorrect ? (
          <AnswerInput
            value={answer}
            onChange={setAnswer}
            onCheck={check}
            lang={lang}
            label={textOf({ ru: 'Значение', uz: 'Qiymat' }, lang)}
          />
        ) : (
          <div className="g7-final-value"><Check size={20} /><span>158</span></div>
        )}
        {valueCorrect && (
          <div className="g7-final-rules">
            {rules.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => chooseRule(item.id)}
                className={`${rule === item.id ? 'is-picked' : ''} ${complete && item.id === 'brackets' ? 'is-correct' : ''}`}
              >
                {textOf(item.text, lang)}
              </button>
            ))}
          </div>
        )}
        <Feedback state={feedback}>
          {complete
            ? textOf({ ru: 'Готово: ты умеешь находить значение числового выражения.', uz: 'Tayyor: siz sonli ifodaning qiymatini topa olasiz.' }, lang)
            : feedback === 'ok'
              ? textOf({ ru: 'Ответ найден. Осталось назвать правило.', uz: 'Javob topildi. Endi qoidani aytish qoldi.' }, lang)
              : textOf({ ru: 'Начни с самых внутренних скобок.', uz: 'Eng ichki qavslardan boshlang.' }, lang)}
        </Feedback>
      </div>
    </div>
  )
}

const SCREEN_COMPONENTS = [
  HookScreen,
  FirstActionScreen,
  InnerBracketsScreen,
  OuterBracketsScreen,
  StrongActionsScreen,
  RowsMethodScreen,
  SchoolNumbersScreen,
  RuleBuilderScreen,
  GuidedPracticeScreen,
  PracticeOrderScreen,
  IndependentScreen,
  EqualPriorityScreen,
  ErrorDetectiveScreen,
  BracketConstructorScreen,
  StrategyScreen,
  FinalChallengeScreen,
]

export default function Grade7Dars01({
  lang: langProp,
  studentName,
  onFinished,
}) {
  const preview = !langProp
  const [previewLang, setPreviewLang] = useState('ru')
  const lang = langProp || previewLang
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState([])
  const [muted, setMuted] = useState(false)
  const startedAt = useRef(null)
  const finished = useRef(false)
  const scale = useMobileScale()
  const { speak, stop } = useSpeech(lang, muted)
  const copy = SCREEN_COPY[current]
  const CurrentScreen = SCREEN_COMPONENTS[current]

  useEffect(() => {
    startedAt.current = Date.now()
  }, [])

  useEffect(() => {
    stop()
    if (muted) return undefined
    const timer = window.setTimeout(() => {
      speak(textOf(copy.narration, lang))
    }, 300)
    return () => {
      window.clearTimeout(timer)
      stop()
    }
  }, [copy.narration, current, lang, muted, speak, stop])

  const recordAnswer = useCallback((data) => {
    setAnswers((previous) => {
      const next = [...previous]
      next[current] = { screen: current + 1, ...data }
      return next
    })
  }, [current])

  const goNext = () => {
    if (current < TOTAL - 1) {
      setCurrent((value) => value + 1)
      return
    }
    if (finished.current) return
    finished.current = true
    const checked = answers.filter((item) => item && !item.diagnostic)
    const correct = checked.filter((item) => item.correct).length
    const payload = {
      lessonId: 'grade7-dars01-sonli-ifodalar-v2',
      lessonTitle: {
        ru: 'Урок 1. Числовые выражения',
        uz: '1-dars. Sonli ifodalar',
      },
      studentName: studentName || '',
      durationSec: startedAt.current ? Math.floor((Date.now() - startedAt.current) / 1000) : 0,
      totalQuestions: checked.length,
      correctAnswers: correct,
      scorePercent: checked.length ? Math.round((correct / checked.length) * 100) : 0,
      passed: Boolean(answers[15]?.correct),
      skillTags: [
        'operation_order',
        'nested_brackets',
        'line_method',
        'number_operations',
        'error_analysis',
        'strategy_choice',
      ],
      answers: answers.filter(Boolean),
    }
    if (onFinished) onFinished(payload)
    else console.log('[Grade7 Dars01 preview]', payload)
  }

  const replay = () => speak(textOf(copy.narration, lang))
  const setLanguage = (code) => {
    stop()
    setPreviewLang(code)
  }

  return (
    <main className="g7-lesson" style={{ '--g7-mobile-scale': scale }}>
      <div className="g7-ambient g7-ambient-one" />
      <div className="g7-ambient g7-ambient-two" />
      <section className="g7-stage">
        <header className="g7-header">
          <div className="g7-progress" aria-label={`${current + 1} / ${TOTAL}`}>
            <i style={{ width: `${((current + 1) / TOTAL) * 100}%` }} />
          </div>
          <div className="g7-chrome">
            <div className="g7-chrome-title">
              <span />
              <strong>{textOf(copy.phase, lang)}</strong>
            </div>
            <div className="g7-tools">
              <span className={`g7-phase-pill ${current >= 8 ? 'is-practice' : ''}`}>
                {textOf(copy.kind, lang)}
              </span>
              <button type="button" className="g7-icon-button" onClick={() => setMuted((value) => !value)} aria-label={muted ? 'Включить звук' : 'Выключить звук'}>
                {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
              </button>
              {!muted && (
                <button type="button" className="g7-icon-button" onClick={replay} aria-label="Повторить озвучивание">
                  <RotateCcw size={17} />
                </button>
              )}
              {preview && (
                <div className="g7-language">
                  {['ru', 'uz'].map((code) => (
                    <button
                      type="button"
                      key={code}
                      className={lang === code ? 'is-active' : ''}
                      onClick={() => setLanguage(code)}
                    >
                      {code.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}
              <span className="g7-count">{String(current + 1).padStart(2, '0')} / {TOTAL}</span>
            </div>
          </div>
        </header>

        <div className="g7-content">
          <CurrentScreen
            key={`${current}-${lang}`}
            lang={lang}
            say={speak}
            onAnswer={recordAnswer}
          />
        </div>

        <footer className="g7-nav">
          <button
            type="button"
            className="g7-nav-back"
            onClick={() => setCurrent((value) => Math.max(0, value - 1))}
            disabled={current === 0}
          >
            <ArrowLeft size={18} />
            <span>{textOf({ ru: 'Назад', uz: 'Orqaga' }, lang)}</span>
          </button>
          <div className="g7-nav-center">
            {current < 8 ? <Headphones size={16} /> : <Target size={16} />}
            <span>{current < 8
              ? textOf({ ru: 'Обучение', uz: "O'rganish" }, lang)
              : textOf({ ru: 'Тренировка', uz: 'Mashq' }, lang)}</span>
          </div>
          <button type="button" className="g7-nav-next" onClick={goNext}>
            <span>{current === TOTAL - 1
              ? textOf({ ru: 'Завершить', uz: 'Yakunlash' }, lang)
              : textOf({ ru: 'Дальше', uz: 'Davom etish' }, lang)}</span>
            {current === TOTAL - 1 ? <Check size={18} /> : <ArrowRight size={18} />}
          </button>
        </footer>
      </section>
    </main>
  )
}
