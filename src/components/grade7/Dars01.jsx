import { useCallback, useEffect, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Lightbulb,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react'
import './Dars01.css'

const L = (uz, ru, en) => ({ uz, ru, en })
const text = (value, lang) => value?.[lang] ?? value?.ru ?? value ?? ''

const TOTAL_SCREENS = 16
const EXPRESSION = '18 − 6 : 3 + 4'

const UI = {
  back: L('Darslar', 'К урокам', 'Lessons'),
  next: L('Davom etish', 'Продолжить', 'Continue'),
  previous: L('Orqaga', 'Назад', 'Back'),
  hint: L('Maslahat', 'Подсказка', 'Hint'),
  listen: L('Tinglash', 'Прослушать', 'Listen'),
  mute: L('Ovozni o‘chirish', 'Выключить звук', 'Mute'),
  unmute: L('Ovozni yoqish', 'Включить звук', 'Unmute'),
  correct: L('To‘g‘ri', 'Верно', 'Correct'),
  retry: L('Yana tekshiring', 'Проверь ещё раз', 'Check again'),
  check: L('Tekshirish', 'Проверить', 'Check'),
  reset: L('Qayta boshlash', 'Начать заново', 'Start again'),
  completed: L('Missiya bajarildi', 'Миссия завершена', 'Mission complete'),
  screen: L('ekran', 'экран', 'screen'),
}

const PHASES = [
  {
    label: L('Muammo', 'Проблема', 'Problem'),
    detail: L('Ikki natijani tekshiramiz', 'Проверяем два результата', 'Investigate two results'),
    range: [0, 3],
  },
  {
    label: L('Model', 'Модель', 'Model'),
    detail: L('Ifoda tuzilishini ochamiz', 'Открываем структуру', 'Reveal the structure'),
    range: [4, 8],
  },
  {
    label: L('Protokol', 'Протокол', 'Protocol'),
    detail: L('Qoidani qo‘llaymiz', 'Применяем правило', 'Apply the rule'),
    range: [9, 12],
  },
  {
    label: L('Audit', 'Аудит', 'Audit'),
    detail: L('Tekshiramiz va ko‘chiramiz', 'Проверяем и переносим', 'Verify and transfer'),
    range: [13, 15],
  },
]

const SCREENS = [
  {
    phase: 0,
    eyebrow: L('SIGNAL 01', 'СИГНАЛ 01', 'SIGNAL 01'),
    title: L('Bitta yozuv. Ikki natija.', 'Одна запись. Два результата.', 'One expression. Two results.'),
    lead: L(
      'Nova 20 ni, Bit esa 8 ni oldi. O‘zgarmagan ifoda ikkita qiymatga ega bo‘lishi mumkinmi?',
      'Nova получила 20, а Bit — 8. Может ли неизменное выражение иметь два значения?',
      'Nova got 20, while Bit got 8. Can an unchanged expression have two values?',
    ),
    hint: L(
      'Hozir javobni hisoblash shart emas. Faqat bitta yozuv uchun yagona qoida kerakmi, deb o‘ylang.',
      'Пока не обязательно считать. Подумай, нужен ли одной записи единый протокол.',
      'You do not need to calculate yet. Decide whether one expression needs one shared protocol.',
    ),
    audio: L(
      'Bir xil ifoda ikki modulga yuborildi. Nova yigirma, Bit esa sakkiz natijasini oldi. Qaysi fikrni tekshirish kerak?',
      'Одно выражение отправили двум модулям. Nova получила двадцать, а Bit — восемь. Какую версию нужно проверить?',
      'The same expression was sent to two modules. Nova got twenty and Bit got eight. Which idea should we test?',
    ),
  },
  {
    phase: 0,
    eyebrow: L('KIRISH DIAGNOSTIKASI', 'ВХОДНАЯ ДИАГНОСТИКА', 'ENTRY CHECK'),
    title: L('Uchta tayanch ko‘nikma', 'Три опорных навыка', 'Three skills to activate'),
    lead: L(
      'Qavslar, amal darajasi va chapdan o‘ngga tartibni qisqa topshiriqlarda tekshiring.',
      'Проверь скобки, приоритет действий и движение слева направо.',
      'Check brackets, operation priority and left-to-right order.',
    ),
    hint: L(
      'Avval qavslarni izlang. Keyin ko‘paytirish yoki bo‘lishni bajaring.',
      'Сначала ищи скобки. Затем умножение или деление.',
      'Look for brackets first. Then perform multiplication or division.',
    ),
    audio: L(
      'Yangi protokol uchun uchta tanish ko‘nikmani tekshiramiz. Bu yangi mavzu bo‘yicha baho emas.',
      'Проверим три знакомых навыка, нужных для нового протокола. Это не оценка по новой теме.',
      'Check three familiar skills needed for the new protocol. This is not a test on the new topic.',
    ),
  },
  {
    phase: 0,
    eyebrow: L('TUZILISH', 'СТРУКТУРА', 'STRUCTURE'),
    title: L('Ifodaning anatomiyasi', 'Анатомия выражения', 'Anatomy of an expression'),
    lead: L(
      'Ifodadagi barcha amal belgilarini tanlang. Tenglik belgisi bu yozuvning ichida yo‘q.',
      'Выбери все знаки действий. Знака равенства внутри этой записи нет.',
      'Select every operation sign. There is no equals sign inside this expression.',
    ),
    hint: L(
      'Amal belgilari sonlar bilan nima qilish kerakligini ko‘rsatadi.',
      'Знаки действий показывают, что нужно сделать с числами.',
      'Operation signs tell you what to do with the numbers.',
    ),
    audio: L(
      'Ifodaning qismlarini ko‘rib chiqing. Sonlardan farqli bo‘lgan barcha amal belgilarini belgilang.',
      'Рассмотри части выражения. Отметь все знаки действий, отделяя их от чисел.',
      'Inspect the parts of the expression. Mark every operation sign, separating them from the numbers.',
    ),
  },
  {
    phase: 0,
    eyebrow: L('OBYEKT TURI', 'ТИП ОБЪЕКТА', 'OBJECT TYPE'),
    title: L('Ifodami, tenglikmi yoki xatomi?', 'Выражение, равенство или ошибка?', 'Expression, equality or invalid?'),
    lead: L(
      'Har bir kartochkaning matematik turini aniqlang.',
      'Определи математический тип каждой карточки.',
      'Identify the mathematical type of each card.',
    ),
    hint: L(
      'Tenglikda “=” belgisi bor. Nolga bo‘lish mumkin emas.',
      'В равенстве есть знак «=». Деление на ноль невозможно.',
      'An equality contains “=”. Division by zero is not allowed.',
    ),
    audio: L(
      'Yozuvlarni ifoda, sonli tenglik yoki taqiqlangan yozuv guruhiga ajrating.',
      'Раздели записи на выражения, числовые равенства и недопустимые записи.',
      'Sort the notation into expressions, numerical equalities and invalid notation.',
    ),
  },
  {
    phase: 1,
    eyebrow: L('QIYMAT', 'ЗНАЧЕНИЕ', 'VALUE'),
    title: L('Yozuvdan songacha', 'От записи к числу', 'From expression to number'),
    lead: L(
      'Ifoda, hisoblash va qiymatni to‘g‘ri mantiqiy ketma-ketlikka qo‘ying.',
      'Расположи выражение, вычисление и значение в логической последовательности.',
      'Arrange the expression, calculation and value in a logical sequence.',
    ),
    hint: L(
      'Avval matematik yozuvni ko‘ramiz, keyin amalni bajaramiz, oxirida son olamiz.',
      'Сначала дана запись, затем выполняется действие, в конце получается число.',
      'First comes the expression, then the calculation, and finally the number.',
    ),
    audio: L(
      'Ifodaning o‘zi va uning qiymati bir xil obyekt emas. Ularni hisoblash jarayoni bog‘laydi.',
      'Выражение и его значение — не один объект. Их связывает процесс вычисления.',
      'An expression and its value are not the same object. The calculation connects them.',
    ),
  },
  {
    phase: 1,
    eyebrow: L('QAVSLAR', 'СКОБКИ', 'BRACKETS'),
    title: L('Bir xil sonlar, boshqa tuzilish', 'Те же числа, другая структура', 'Same numbers, different structure'),
    lead: L(
      'Ikkala ifodaning qiymatini toping. Qavslar natijani o‘zgartiradimi?',
      'Найди значения двух выражений. Меняют ли скобки результат?',
      'Find the values of both expressions. Do brackets change the result?',
    ),
    hint: L(
      'Birinchi kartada avval ko‘paytirish, ikkinchisida esa qavs ichidagi qo‘shish bajariladi.',
      'В первой карточке сначала умножение, во второй — сложение в скобках.',
      'In the first card, multiply first. In the second, add inside the brackets first.',
    ),
    audio: L(
      'Sonlar va amal belgilari bir xil, ammo qavslar tuzilishni o‘zgartiradi. Ikkala qiymatni taqqoslang.',
      'Числа и знаки действий одинаковы, но скобки меняют структуру. Сравни оба значения.',
      'The numbers and operation signs are the same, but brackets change the structure. Compare both values.',
    ),
  },
  {
    phase: 1,
    eyebrow: L('IERARXIYA', 'ИЕРАРХИЯ', 'HIERARCHY'),
    title: L('Uch darajali protokol', 'Три уровня протокола', 'A three-level protocol'),
    lead: L(
      'Amal guruhlarini bajarilish tartibida tanlang.',
      'Выбирай группы действий в порядке выполнения.',
      'Select the operation groups in the order they must be performed.',
    ),
    hint: L(
      'Qavs ichidagi amal doimo tashqaridagi amallardan oldin bajariladi.',
      'Действие в скобках выполняется раньше действий снаружи.',
      'An operation inside brackets comes before operations outside them.',
    ),
    audio: L(
      'Protokol uch darajadan iborat. Har bir darajani birinchidan uchinchigacha tartiblang.',
      'Протокол состоит из трёх уровней. Расположи их от первого к третьему.',
      'The protocol has three levels. Arrange them from first to third.',
    ),
  },
  {
    phase: 1,
    eyebrow: L('AMALLAR DARAXTI', 'ДЕРЕВО ДЕЙСТВИЙ', 'OPERATION TREE'),
    title: L('Bog‘lanishlarni buzmasdan hisoblang', 'Вычисли, не разрушая связи', 'Calculate without breaking the links'),
    lead: L(
      '`36 : (9 − 3) + 5·2` ifodasidagi tugunlarni to‘g‘ri ketma-ketlikda ishga tushiring.',
      'Активируй узлы выражения `36 : (9 − 3) + 5·2` в правильной последовательности.',
      'Activate the nodes of `36 : (9 − 3) + 5·2` in the correct sequence.',
    ),
    hint: L(
      'Avval qavs tuguni. Oxirgi tugun ikkita tayyor shoxni qo‘shadi.',
      'Первым работает узел скобок. Последний узел складывает две готовые ветви.',
      'The brackets node comes first. The final node adds the two completed branches.',
    ),
    audio: L(
      'Ifodani daraxt sifatida ko‘ring. Yuqori tugun faqat uning pastki qismlari tayyor bo‘lganda ishlaydi.',
      'Посмотри на выражение как на дерево. Верхний узел работает только после готовности нижних ветвей.',
      'View the expression as a tree. A higher node can run only after its lower branches are complete.',
    ),
  },
  {
    phase: 1,
    eyebrow: L('QOIDANI YIG‘ISH', 'СБОРКА ПРАВИЛА', 'BUILD THE RULE'),
    title: L('Protokolni o‘zingiz tuzing', 'Собери протокол самостоятельно', 'Build the protocol yourself'),
    lead: L(
      'To‘rtta qoida qismini to‘g‘ri tartibda joylashtiring.',
      'Расположи четыре части правила в правильном порядке.',
      'Arrange the four parts of the rule in the correct order.',
    ),
    hint: L(
      'Tekshirish hisoblashdan keyin keladi. Bir xil darajadagi amallar chapdan o‘ngga bajariladi.',
      'Проверка идёт после вычисления. Действия одного уровня выполняются слева направо.',
      'Verification comes after calculation. Operations at the same level go from left to right.',
    ),
    audio: L(
      'Endi tayyor qoidani o‘qimaysiz. Uning qismlarini o‘zingiz mantiqiy protokolga yig‘asiz.',
      'Теперь ты не читаешь готовое правило, а самостоятельно собираешь его части в логичный протокол.',
      'Now you will not read a finished rule. You will assemble its parts into a logical protocol.',
    ),
  },
  {
    phase: 2,
    eyebrow: L('FAOL TAHLIL', 'АКТИВНЫЙ РАЗБОР', 'ACTIVE WALKTHROUGH'),
    title: L('Keyingi qadamni boshqaring', 'Управляй следующим шагом', 'Control the next step'),
    lead: L(
      '`42 − 18 : 3·2` ifodasida faqat hozir bajarilishi mumkin bo‘lgan amalni tanlang.',
      'В выражении `42 − 18 : 3·2` выбирай только действие, допустимое прямо сейчас.',
      'For `42 − 18 : 3·2`, choose only the operation that is valid right now.',
    ),
    hint: L(
      'Bo‘lish va ko‘paytirish teng darajada. Ularning eng chapdagisidan boshlang.',
      'Деление и умножение равноправны. Начни с самого левого из них.',
      'Division and multiplication have equal priority. Start with the leftmost one.',
    ),
    audio: L(
      'Har bir qadamdan keyin ifoda qisqaradi. Amal darajasini va chapdan o‘ngga yo‘nalishni saqlang.',
      'После каждого шага выражение становится короче. Сохраняй приоритет и направление слева направо.',
      'After each step, the expression becomes shorter. Preserve priority and left-to-right order.',
    ),
  },
  {
    phase: 2,
    eyebrow: L('TAYANCH BILAN MASHQ', 'ПРАКТИКА С ОПОРОЙ', 'GUIDED PRACTICE'),
    title: L('To‘rtta qadamli zinapoya', 'Лестница из четырёх шагов', 'A four-step ladder'),
    lead: L(
      '`7 + 24 : (8 − 2)·3` ifodasining bo‘sh qadamlarini to‘ldiring.',
      'Заполни пустые шаги выражения `7 + 24 : (8 − 2)·3`.',
      'Complete the missing steps for `7 + 24 : (8 − 2)·3`.',
    ),
    hint: L(
      'Birinchi natija 6. Keyin bo‘lish, ko‘paytirish va qo‘shish bajariladi.',
      'Первый результат — 6. Затем идут деление, умножение и сложение.',
      'The first result is 6. Then come division, multiplication and addition.',
    ),
    audio: L(
      'Bu mashqda qadamlar ko‘rinib turadi, ammo ularning tartibini siz boshqarasiz.',
      'В этой задаче шаги видны, но их последовательностью управляешь ты.',
      'The steps are visible in this task, but you control their order.',
    ),
  },
  {
    phase: 2,
    eyebrow: L('MUSTAQIL', 'САМОСТОЯТЕЛЬНО', 'INDEPENDENT'),
    title: L('Tayanchsiz yechim', 'Решение без опоры', 'Solve without support'),
    lead: L(
      '`60 − 4·(9 + 3) : 6` uchun birinchi amalni va yakuniy qiymatni ko‘rsating.',
      'Для `60 − 4·(9 + 3) : 6` укажи первое действие и итоговое значение.',
      'For `60 − 4·(9 + 3) : 6`, identify the first operation and the final value.',
    ),
    hint: L(
      'Qavs ichidagi qo‘shishdan boshlang. Keyin ko‘paytirish va bo‘lishni chapdan o‘ngga bajaring.',
      'Начни со сложения в скобках. Затем выполни умножение и деление слева направо.',
      'Start with the addition in brackets. Then multiply and divide from left to right.',
    ),
    audio: L(
      'Endi tayyor qadamlar yo‘q. Birinchi amalni tanlang, ifodani hisoblang va faqat yakuniy qiymatni kiriting.',
      'Теперь готовых шагов нет. Выбери первое действие, вычисли выражение и введи итоговое значение.',
      'There are no prepared steps now. Choose the first operation, calculate, and enter the final value.',
    ),
  },
  {
    phase: 2,
    eyebrow: L('STRATEGIYA', 'СТРАТЕГИЯ', 'STRATEGY'),
    title: L('To‘g‘ri va qulay — bir xilmi?', 'Верно и удобно — одно и то же?', 'Correct and convenient: the same thing?'),
    lead: L(
      '`25·17·4` ni hisoblashning ikkita to‘g‘ri usulini taqqoslang.',
      'Сравни два верных способа вычислить `25·17·4`.',
      'Compare two correct ways to calculate `25·17·4`.',
    ),
    hint: L(
      '25 va 4 ni ko‘paytirganda 100 hosil bo‘ladi.',
      'Произведение 25 и 4 равно 100.',
      'Multiplying 25 by 4 gives 100.',
    ),
    audio: L(
      'Ikkala yo‘l ham to‘g‘ri natija beradi. Qaysi yo‘lni ongda tekshirish osonroq ekanini aniqlang.',
      'Оба пути дают верный результат. Определи, какой легче вычислить и проверить устно.',
      'Both routes give the correct result. Decide which is easier to calculate and verify mentally.',
    ),
  },
  {
    phase: 3,
    eyebrow: L('XATO AUDITI', 'АУДИТ ОШИБКИ', 'ERROR AUDIT'),
    title: L('Birinchi noto‘g‘ri qadam qayerda?', 'Где первый неверный шаг?', 'Where is the first incorrect step?'),
    lead: L(
      'Bitning yechimini tekshiring: `48 − 12 : 3 → 36 : 3 → 12`.',
      'Проверь решение Bit: `48 − 12 : 3 → 36 : 3 → 12`.',
      'Audit Bit’s solution: `48 − 12 : 3 → 36 : 3 → 12`.',
    ),
    hint: L(
      'Ayirishdan oldin ifodada qaysi yuqori darajali amal borligini toping.',
      'Найди действие более высокого уровня, которое должно быть выполнено до вычитания.',
      'Find the higher-priority operation that must be completed before subtraction.',
    ),
    audio: L(
      'Faqat yakuniy javobni emas, birinchi noto‘g‘ri o‘tishni toping. Keyingi xatolar aynan undan kelib chiqadi.',
      'Найди не просто неверный ответ, а первый ошибочный переход. Остальные ошибки следуют из него.',
      'Find not only the wrong answer but the first incorrect transition. Every later error follows from it.',
    ),
  },
  {
    phase: 3,
    eyebrow: L('YANGI VAZIYAT', 'НОВАЯ СИТУАЦИЯ', 'NEW CONTEXT'),
    title: L('Modelni real ma’noga ulang', 'Свяжи модель с реальным смыслом', 'Connect the model to a real situation'),
    lead: L(
      '2400 birlik zaxiradan har biri 350 birlik sarflaydigan uchta sinov o‘tkazildi. Qancha qoldi?',
      'Из запаса 2400 единиц провели три теста по 350 единиц. Сколько осталось?',
      'A reserve of 2400 units was used for three tests costing 350 units each. How much remains?',
    ),
    hint: L(
      'Avval uchta sinovning umumiy sarfini toping, keyin uni zaxiradan ayiring.',
      'Сначала найди общий расход трёх тестов, затем вычти его из запаса.',
      'First find the total cost of the three tests, then subtract it from the reserve.',
    ),
    audio: L(
      'Endi protokol tayyor misolda emas, yangi vaziyatda ishlashi kerak. Ifodani tuzing va ma’nosini tekshiring.',
      'Теперь протокол должен сработать в новой ситуации. Составь выражение и проверь смысл результата.',
      'Now the protocol must work in a new situation. Build the expression and check the meaning of the result.',
    ),
  },
  {
    phase: 3,
    eyebrow: L('YAKUNIY PROTOKOL', 'ФИНАЛЬНЫЙ ПРОТОКОЛ', 'FINAL PROTOCOL'),
    title: L('Natija va sabab', 'Результат и основание', 'Result and reason'),
    lead: L(
      '`64 : (10 − 2) + 3·7` ni hisoblang va nima uchun aynan shu amaldan boshlaganingizni ko‘rsating.',
      'Вычисли `64 : (10 − 2) + 3·7` и укажи, почему начал именно с этого действия.',
      'Evaluate `64 : (10 − 2) + 3·7` and explain why you started with that operation.',
    ),
    hint: L(
      'Birinchi amal qavs ichida. Yakuniy qiymat 20 dan katta.',
      'Первое действие находится в скобках. Итоговое значение больше 20.',
      'The first operation is inside brackets. The final value is greater than 20.',
    ),
    audio: L(
      'Yakuniy tekshiruvda uchta narsa kerak: birinchi qadam, to‘g‘ri qiymat va qoida bilan qisqa izoh.',
      'В финальной проверке нужны три части: первый шаг, верное значение и короткое объяснение правила.',
      'The final check needs three parts: the first step, the correct value and a short rule-based explanation.',
    ),
  },
]

function useSpeech(lang, muted) {
  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
  }, [])

  const speak = useCallback((value) => {
    if (muted || typeof window === 'undefined' || !window.speechSynthesis) return
    const spoken = text(value, lang)
    if (!spoken) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(spoken)
    utterance.lang = { uz: 'uz-UZ', ru: 'ru-RU', en: 'en-GB' }[lang]
    utterance.rate = 0.94
    window.speechSynthesis.speak(utterance)
  }, [lang, muted])

  useEffect(() => stop, [stop])
  return { speak, stop }
}

function Feedback({ status = 'success', children }) {
  return (
    <div className={`g7n-feedback is-${status}`} role="status">
      {status === 'success' ? <CheckCircle2 size={19} /> : <Lightbulb size={19} />}
      <span>{children}</span>
    </div>
  )
}

function MathPanel({ children, className = '' }) {
  return <div className={`g7n-math-panel ${className}`}>{children}</div>
}

function ChoiceButtons({ lang, options, onSelect, selected, columns = 2 }) {
  return (
    <div className="g7n-choice-grid" style={{ '--choice-columns': columns }}>
      {options.map((option) => (
        <button
          type="button"
          className={`g7n-choice ${selected === option.id ? 'is-selected' : ''}`}
          key={option.id}
          onClick={() => onSelect(option)}
        >
          {option.code && <strong>{option.code}</strong>}
          <span>{text(option.label, lang)}</span>
        </button>
      ))}
    </div>
  )
}

function SequenceActivity({
  lang,
  items,
  order,
  onComplete,
  onAttempt,
  success,
  tag = 'E-ORDER',
}) {
  const [chosen, setChosen] = useState([])
  const [notice, setNotice] = useState(null)
  const done = chosen.length === order.length

  const choose = (id) => {
    if (done || chosen.includes(id)) return
    const expected = order[chosen.length]
    if (id !== expected) {
      setNotice('retry')
      onAttempt(false, tag)
      return
    }
    const next = [...chosen, id]
    setChosen(next)
    setNotice(null)
    onAttempt(true)
    if (next.length === order.length) onComplete()
  }

  const reset = () => {
    setChosen([])
    setNotice(null)
  }

  return (
    <div className="g7n-sequence">
      <div className="g7n-sequence-track" aria-label={text(L('Tanlangan tartib', 'Выбранный порядок', 'Selected order'), lang)}>
        {order.map((_, index) => {
          const item = items.find((candidate) => candidate.id === chosen[index])
          return (
            <div className={`g7n-sequence-slot ${item ? 'is-filled' : ''}`} key={index}>
              <span>{index + 1}</span>
              {item ? text(item.label, lang) : '—'}
            </div>
          )
        })}
      </div>
      <div className="g7n-token-grid">
        {items.map((item) => (
          <button
            type="button"
            key={item.id}
            disabled={chosen.includes(item.id)}
            className="g7n-token"
            onClick={() => choose(item.id)}
          >
            {text(item.label, lang)}
          </button>
        ))}
      </div>
      {notice === 'retry' && (
        <Feedback status="hint">{text(UI.retry, lang)}: {text(L(
          'Hozirgi bosqichga mos amalni tanlang.',
          'Выбери действие, допустимое на текущем шаге.',
          'Choose the operation that is valid at this step.',
        ), lang)}</Feedback>
      )}
      {done && <Feedback>{text(success, lang)}</Feedback>}
      {chosen.length > 0 && !done && (
        <button type="button" className="g7n-text-button" onClick={reset}>
          <RotateCcw size={16} /> {text(UI.reset, lang)}
        </button>
      )}
    </div>
  )
}

function SignalScreen({ lang, onComplete }) {
  const [selected, setSelected] = useState(null)
  const options = [
    { id: 'one', label: L('Yo‘q, qiymat yagona bo‘lishi kerak', 'Нет, значение должно быть одним', 'No, it should have one value') },
    { id: 'two', label: L('Ha, ikkala javob ham qolishi mumkin', 'Да, можно оставить оба ответа', 'Yes, both values can remain') },
    { id: 'unsure', label: L('Avval birinchi qadamlarni solishtirish kerak', 'Сначала нужно сравнить первые шаги', 'We should compare the first steps') },
  ]

  const choose = (option) => {
    if (selected) return
    setSelected(option.id)
    onComplete({ strategy: option.id })
  }

  return (
    <div className="g7n-signal-layout">
      <MathPanel className="g7n-signal-panel">
        <div className="g7n-system-label"><Cpu size={18} /> LUMO NEXUS / CALC-01</div>
        <div className="g7n-main-expression">{EXPRESSION}</div>
        <div className="g7n-engine-results">
          <div><span>NOVA</span><strong>20</strong><small>{text(L('ustuvorlik bo‘yicha', 'по приоритету', 'using priority'), lang)}</small></div>
          <div><span>BIT</span><strong>8</strong><small>{text(L('faqat chapdan o‘ngga', 'только слева направо', 'left to right only'), lang)}</small></div>
        </div>
      </MathPanel>
      <div>
        <p className="g7n-question">{text(L(
          'Qaysi gipotezani tekshiramiz?',
          'Какую гипотезу проверим?',
          'Which hypothesis should we test?',
        ), lang)}</p>
        <ChoiceButtons lang={lang} options={options} selected={selected} onSelect={choose} columns={1} />
        {selected && <Feedback>{text(L(
          'Gipoteza saqlandi. Endi ikki yo‘l qayerda ajralganini tekshiramiz.',
          'Гипотеза сохранена. Теперь найдём шаг, на котором разошлись два пути.',
          'Hypothesis saved. Now we will find where the two paths diverged.',
        ), lang)}</Feedback>}
      </div>
    </div>
  )
}

const DIAGNOSTIC_TASKS = [
  { expression: '14 − 8 : 2', options: ['3', '10', '12'], answer: '10', tag: 'E-ORDER' },
  { expression: '(9 − 3)·2', options: ['3', '12', '15'], answer: '12', tag: 'E-BRACKET' },
  { expression: '24 : 6·2', options: ['2', '8', '12'], answer: '8', tag: 'E-SAMELEVEL' },
]

function DiagnosticScreen({ lang, onComplete, onAttempt }) {
  const [answers, setAnswers] = useState({})
  const [done, setDone] = useState(false)

  const choose = (taskIndex, value) => {
    if (done) return
    const task = DIAGNOSTIC_TASKS[taskIndex]
    const next = { ...answers, [taskIndex]: value }
    setAnswers(next)
    const isCorrect = value === task.answer
    onAttempt(isCorrect, isCorrect ? null : task.tag)
    const allCorrect = DIAGNOSTIC_TASKS.every((item, index) => next[index] === item.answer)
    if (allCorrect) {
      setDone(true)
      onComplete()
    }
  }

  return (
    <div className="g7n-diagnostic-grid">
      {DIAGNOSTIC_TASKS.map((task, taskIndex) => (
        <MathPanel key={task.expression} className="g7n-mini-task">
          <span className="g7n-task-number">0{taskIndex + 1}</span>
          <div className="g7n-task-expression">{task.expression}</div>
          <div className="g7n-small-options">
            {task.options.map((option) => {
              const selected = answers[taskIndex] === option
              const correct = selected && option === task.answer
              const wrong = selected && option !== task.answer
              return (
                <button
                  type="button"
                  key={option}
                  className={`${correct ? 'is-correct' : ''} ${wrong ? 'is-wrong' : ''}`}
                  onClick={() => choose(taskIndex, option)}
                >
                  {option}
                </button>
              )
            })}
          </div>
        </MathPanel>
      ))}
      {done && <Feedback>{text(L(
        'Uch tayanch ko‘nikma faol. Asosiy tadqiqotga o‘tamiz.',
        'Три опорных навыка активны. Переходим к исследованию.',
        'All three foundation skills are active. Move on to the investigation.',
      ), lang)}</Feedback>}
    </div>
  )
}

function AnatomyScreen({ lang, onComplete, onAttempt }) {
  const tokens = ['18', '−', '6', ':', '3', '+', '4']
  const operators = new Set([1, 3, 5])
  const [selected, setSelected] = useState([])
  const [wrong, setWrong] = useState(null)
  const [done, setDone] = useState(false)

  const choose = (index) => {
    if (done || selected.includes(index)) return
    if (!operators.has(index)) {
      setWrong(index)
      onAttempt(false, 'E-EXPRESSION')
      window.setTimeout(() => setWrong(null), 500)
      return
    }
    const next = [...selected, index]
    setSelected(next)
    onAttempt(true)
    if (next.length === operators.size) {
      setDone(true)
      onComplete()
    }
  }

  return (
    <div className="g7n-anatomy">
      <MathPanel>
        <div className="g7n-expression-tokens">
          {tokens.map((token, index) => (
            <button
              type="button"
              key={`${token}-${index}`}
              className={`${selected.includes(index) ? 'is-operator' : ''} ${wrong === index ? 'is-wrong' : ''}`}
              onClick={() => choose(index)}
            >
              {token}
            </button>
          ))}
        </div>
        <div className="g7n-legend">
          <span><i className="is-number" /> {text(L('son', 'число', 'number'), lang)}</span>
          <span><i className="is-operation" /> {text(L('amal belgisi', 'знак действия', 'operation sign'), lang)}</span>
        </div>
      </MathPanel>
      {done && <Feedback>{text(L(
        'Uchta amal belgisi topildi. “=” bo‘lmagani uchun bu tenglik emas, sonli ifoda.',
        'Найдены три знака действий. Знака «=» нет: перед нами числовое выражение, а не равенство.',
        'You found three operation signs. There is no “=”, so this is a numerical expression, not an equality.',
      ), lang)}</Feedback>}
    </div>
  )
}

const CLASSIFY_CATEGORIES = [
  { id: 'expression', label: L('Ifoda', 'Выражение', 'Expression') },
  { id: 'equality', label: L('Tenglik', 'Равенство', 'Equality') },
  { id: 'invalid', label: L('Mumkin emas', 'Недопустимо', 'Invalid') },
]

const CLASSIFY_CARDS = [
  { value: '7 + 5·2', answer: 'expression' },
  { value: '17 = 20 − 3', answer: 'equality' },
  { value: '8 : 0', answer: 'invalid' },
  { value: '(9 − 4)·6', answer: 'expression' },
]

function ClassifyScreen({ lang, onComplete, onAttempt }) {
  const [answers, setAnswers] = useState({})
  const [done, setDone] = useState(false)

  const choose = (cardIndex, categoryId) => {
    if (done) return
    const next = { ...answers, [cardIndex]: categoryId }
    setAnswers(next)
    const correct = CLASSIFY_CARDS[cardIndex].answer === categoryId
    onAttempt(correct, correct ? null : 'E-EXPR-EQ')
    const allCorrect = CLASSIFY_CARDS.every((card, index) => next[index] === card.answer)
    if (allCorrect) {
      setDone(true)
      onComplete()
    }
  }

  return (
    <div className="g7n-classify-grid">
      {CLASSIFY_CARDS.map((card, cardIndex) => (
        <MathPanel className="g7n-classify-card" key={card.value}>
          <strong>{card.value}</strong>
          <div>
            {CLASSIFY_CATEGORIES.map((category) => {
              const selected = answers[cardIndex] === category.id
              const correct = selected && category.id === card.answer
              const wrong = selected && category.id !== card.answer
              return (
                <button
                  type="button"
                  key={category.id}
                  className={`${correct ? 'is-correct' : ''} ${wrong ? 'is-wrong' : ''}`}
                  onClick={() => choose(cardIndex, category.id)}
                >
                  {text(category.label, lang)}
                </button>
              )
            })}
          </div>
        </MathPanel>
      ))}
      {done && <Feedback>{text(L(
        'Tasnif tayyor: ifoda amalni bildiradi, tenglik ikki qiymatni “=” bilan bog‘laydi.',
        'Классификация готова: выражение задаёт действия, а равенство связывает два значения знаком «=».',
        'Classification complete: an expression specifies operations, while an equality connects two values with “=”.',
      ), lang)}</Feedback>}
    </div>
  )
}

function ValueScreen(props) {
  const items = [
    { id: 'expression', label: L('Ifoda: 7 + 5·2', 'Выражение: 7 + 5·2', 'Expression: 7 + 5·2') },
    { id: 'operation', label: L('Hisoblash: 5·2 = 10', 'Вычисление: 5·2 = 10', 'Calculation: 5·2 = 10') },
    { id: 'result', label: L('7 + 10 = 17', '7 + 10 = 17', '7 + 10 = 17') },
    { id: 'value', label: L('Qiymat: 17', 'Значение: 17', 'Value: 17') },
  ]
  return (
    <SequenceActivity
      {...props}
      items={items}
      order={['expression', 'operation', 'result', 'value']}
      tag="E-VALUE"
      success={L(
        'Ifoda hisoblash jarayoni orqali bitta sonli qiymatga olib keldi.',
        'Выражение через вычисление привело к одному числовому значению.',
        'The calculation turned the expression into one numerical value.',
      )}
    />
  )
}

function StructureScreen({ lang, onComplete, onAttempt }) {
  const cards = [
    { expression: '8 + 4·2', answer: '16', options: ['16', '24'] },
    { expression: '(8 + 4)·2', answer: '24', options: ['16', '24'] },
  ]
  const [answers, setAnswers] = useState({})
  const [done, setDone] = useState(false)

  const choose = (index, value) => {
    if (done) return
    const next = { ...answers, [index]: value }
    setAnswers(next)
    const correct = value === cards[index].answer
    onAttempt(correct, correct ? null : 'E-BRACKET')
    if (cards.every((card, cardIndex) => next[cardIndex] === card.answer)) {
      setDone(true)
      onComplete()
    }
  }

  return (
    <div className="g7n-structure">
      <div className="g7n-structure-cards">
        {cards.map((card, index) => (
          <MathPanel key={card.expression} className="g7n-structure-card">
            <span>{index === 0 ? 'A' : 'B'}</span>
            <strong>{card.expression}</strong>
            <div>
              {card.options.map((option) => (
                <button
                  type="button"
                  key={option}
                  className={answers[index] === option ? (option === card.answer ? 'is-correct' : 'is-wrong') : ''}
                  onClick={() => choose(index, option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </MathPanel>
        ))}
      </div>
      {done && <Feedback>{text(L(
        '16 va 24. Sonlar bir xil, ammo qavslar amallar tuzilishini o‘zgartirdi.',
        '16 и 24. Числа те же, но скобки изменили структуру действий.',
        '16 and 24. The numbers are the same, but the brackets changed the operation structure.',
      ), lang)}</Feedback>}
    </div>
  )
}

function PriorityScreen(props) {
  const items = [
    { id: 'brackets', label: L('Qavs ichidagi amallar', 'Действия в скобках', 'Operations in brackets') },
    { id: 'high', label: L('Ko‘paytirish va bo‘lish', 'Умножение и деление', 'Multiplication and division') },
    { id: 'low', label: L('Qo‘shish va ayirish', 'Сложение и вычитание', 'Addition and subtraction') },
  ]
  return (
    <SequenceActivity
      {...props}
      items={items}
      order={['brackets', 'high', 'low']}
      success={L(
        'Ierarxiya tayyor. Bir darajadagi amallar chapdan o‘ngga bajariladi.',
        'Иерархия готова. Действия одного уровня выполняются слева направо.',
        'Hierarchy complete. Operations at the same level are performed from left to right.',
      )}
    />
  )
}

function TreeScreen(props) {
  const items = [
    { id: 'bracket', label: L('9 − 3 = 6', '9 − 3 = 6', '9 − 3 = 6') },
    { id: 'divide', label: L('36 : 6 = 6', '36 : 6 = 6', '36 : 6 = 6') },
    { id: 'multiply', label: L('5·2 = 10', '5·2 = 10', '5·2 = 10') },
    { id: 'add', label: L('6 + 10 = 16', '6 + 10 = 16', '6 + 10 = 16') },
  ]
  return (
    <div>
      <div className="g7n-tree-visual" aria-hidden="true">
        <div className="is-root">+</div>
        <div className="is-branch">:</div>
        <div className="is-branch">·</div>
        <div className="is-leaf">36</div>
        <div className="is-leaf">(9−3)</div>
        <div className="is-leaf">5</div>
        <div className="is-leaf">2</div>
      </div>
      <SequenceActivity
        {...props}
        items={items}
        order={['bracket', 'divide', 'multiply', 'add']}
        success={L(
          'Daraxtning barcha shoxlari tayyor: ifodaning qiymati 16.',
          'Все ветви дерева вычислены: значение выражения равно 16.',
          'Every branch is complete: the value of the expression is 16.',
        )}
      />
    </div>
  )
}

function ProtocolScreen(props) {
  const items = [
    { id: 'brackets', label: L('Qavslarni hisoblang', 'Вычислить скобки', 'Evaluate brackets') },
    { id: 'high', label: L('Ko‘paytirish va bo‘lish — chapdan o‘ngga', 'Умножение и деление — слева направо', 'Multiply and divide from left to right') },
    { id: 'low', label: L('Qo‘shish va ayirish — chapdan o‘ngga', 'Сложение и вычитание — слева направо', 'Add and subtract from left to right') },
    { id: 'verify', label: L('Natijani tekshiring', 'Проверить результат', 'Verify the result') },
  ]
  return (
    <SequenceActivity
      {...props}
      items={items}
      order={['brackets', 'high', 'low', 'verify']}
      success={L(
        'Hisoblash protokoli Nexus xotirasiga saqlandi.',
        'Протокол вычислений сохранён в памяти Nexus.',
        'The computation protocol has been saved to Nexus memory.',
      )}
    />
  )
}

function WorkedScreen(props) {
  const items = [
    { id: 'divide', label: L('18 : 3 = 6', '18 : 3 = 6', '18 : 3 = 6') },
    { id: 'multiply', label: L('6·2 = 12', '6·2 = 12', '6·2 = 12') },
    { id: 'subtract', label: L('42 − 12 = 30', '42 − 12 = 30', '42 − 12 = 30') },
  ]
  return (
    <SequenceActivity
      {...props}
      items={items}
      order={['divide', 'multiply', 'subtract']}
      tag="E-SAMELEVEL"
      success={L(
        'Natija 30. Bo‘lish va ko‘paytirish chapdan o‘ngga bajarildi.',
        'Результат 30. Деление и умножение выполнены слева направо.',
        'The result is 30. Division and multiplication were performed from left to right.',
      )}
    />
  )
}

function GuidedScreen(props) {
  const items = [
    { id: 'bracket', label: L('8 − 2 = 6', '8 − 2 = 6', '8 − 2 = 6') },
    { id: 'divide', label: L('24 : 6 = 4', '24 : 6 = 4', '24 : 6 = 4') },
    { id: 'multiply', label: L('4·3 = 12', '4·3 = 12', '4·3 = 12') },
    { id: 'add', label: L('7 + 12 = 19', '7 + 12 = 19', '7 + 12 = 19') },
  ]
  return (
    <SequenceActivity
      {...props}
      items={items}
      order={['bracket', 'divide', 'multiply', 'add']}
      success={L(
        'To‘rtta qadam to‘g‘ri: ifodaning qiymati 19.',
        'Все четыре шага верны: значение выражения равно 19.',
        'All four steps are correct: the value of the expression is 19.',
      )}
    />
  )
}

function IndependentScreen({ lang, onComplete, onAttempt }) {
  const firstOptions = [
    { id: 'bracket', label: L('9 + 3', '9 + 3', '9 + 3') },
    { id: 'multiply', label: L('4·9', '4·9', '4·9') },
    { id: 'subtract', label: L('60 − 4', '60 − 4', '60 − 4') },
  ]
  const [first, setFirst] = useState(null)
  const [answer, setAnswer] = useState('')
  const [status, setStatus] = useState(null)

  const check = () => {
    const correct = first === 'bracket' && Number(answer) === 52
    onAttempt(correct, correct ? null : first !== 'bracket' ? 'E-BRACKET' : 'E-ORDER')
    setStatus(correct ? 'success' : 'retry')
    if (correct) onComplete()
  }

  return (
    <div className="g7n-independent">
      <MathPanel className="g7n-independent-expression">60 − 4·(9 + 3) : 6</MathPanel>
      <div className="g7n-form-row">
        <div>
          <label>{text(L('Birinchi amal', 'Первое действие', 'First operation'), lang)}</label>
          <ChoiceButtons lang={lang} options={firstOptions} selected={first} onSelect={(option) => setFirst(option.id)} columns={3} />
        </div>
        <label className="g7n-answer-field">
          <span>{text(L('Yakuniy qiymat', 'Итоговое значение', 'Final value'), lang)}</span>
          <input
            inputMode="numeric"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            placeholder="?"
            aria-label={text(L('Yakuniy qiymat', 'Итоговое значение', 'Final value'), lang)}
          />
        </label>
      </div>
      <button type="button" className="g7n-primary" onClick={check} disabled={!first || answer === ''}>
        <ShieldCheck size={18} /> {text(UI.check, lang)}
      </button>
      {status === 'success' && <Feedback>{text(L(
        'To‘g‘ri: 9 + 3 = 12, so‘ng 4·12 : 6 = 8 va 60 − 8 = 52.',
        'Верно: 9 + 3 = 12, затем 4·12 : 6 = 8 и 60 − 8 = 52.',
        'Correct: 9 + 3 = 12, then 4·12 : 6 = 8, and 60 − 8 = 52.',
      ), lang)}</Feedback>}
      {status === 'retry' && <Feedback status="hint">{text(UI.retry, lang)}</Feedback>}
    </div>
  )
}

function StrategyScreen({ lang, onComplete, onAttempt }) {
  const [selected, setSelected] = useState(null)
  const options = [
    {
      id: 'linear',
      label: L('25·17 = 425; 425·4 = 1700', '25·17 = 425; 425·4 = 1700', '25·17 = 425; 425·4 = 1700'),
    },
    {
      id: 'group',
      label: L('(25·4)·17 = 100·17 = 1700', '(25·4)·17 = 100·17 = 1700', '(25·4)·17 = 100·17 = 1700'),
    },
  ]

  const choose = (option) => {
    if (selected) return
    setSelected(option.id)
    const efficient = option.id === 'group'
    onAttempt(efficient, efficient ? null : 'E-STRATEGY')
    onComplete({ strategy: option.id })
  }

  return (
    <div className="g7n-strategy">
      <MathPanel className="g7n-strategy-expression">25·17·4</MathPanel>
      <ChoiceButtons lang={lang} options={options} selected={selected} onSelect={choose} columns={2} />
      {selected && <Feedback status={selected === 'group' ? 'success' : 'hint'}>{text(
        selected === 'group'
          ? L(
            'Qulay guruhlash: 25·4 = 100. Natijani og‘zaki tekshirish oson.',
            'Удобная группировка: 25·4 = 100. Результат легко проверить устно.',
            'Efficient grouping: 25·4 = 100. The result is easy to verify mentally.',
          )
          : L(
            'Bu yo‘l ham to‘g‘ri, ammo oraliq 425 soni tekshirishni qiyinlashtiradi. Ikkinchi yo‘lga ham qarang.',
            'Этот путь тоже верен, но промежуточное число 425 сложнее проверить. Сравни со вторым способом.',
            'This route is also correct, but the intermediate value 425 is harder to check. Compare it with the second route.',
          ),
        lang,
      )}</Feedback>}
    </div>
  )
}

function ErrorScreen({ lang, onComplete, onAttempt }) {
  const [selected, setSelected] = useState(null)
  const options = [
    { id: 'subtract', code: '01', label: L('48 − 12 ni birinchi hisoblash', 'Первым вычислить 48 − 12', 'Calculate 48 − 12 first') },
    { id: 'divide', code: '02', label: L('12 : 3 ni hisoblash', 'Вычислить 12 : 3', 'Calculate 12 : 3') },
    { id: 'answer', code: '03', label: L('12 ni yakuniy javob deb yozish', 'Записать 12 итоговым ответом', 'Write 12 as the final answer') },
  ]

  const choose = (option) => {
    setSelected(option.id)
    const correct = option.id === 'subtract'
    onAttempt(correct, correct ? null : 'E-ORDER')
    if (correct) onComplete()
  }

  return (
    <div className="g7n-error-audit">
      <MathPanel>
        <div className="g7n-code-line"><span>01</span>48 − 12 : 3</div>
        <div className="g7n-code-line is-alert"><span>02</span>36 : 3</div>
        <div className="g7n-code-line"><span>03</span>12</div>
      </MathPanel>
      <ChoiceButtons lang={lang} options={options} selected={selected} onSelect={choose} columns={1} />
      {selected === 'subtract' && <Feedback>{text(L(
        'Birinchi xato topildi. To‘g‘ri yechim: 48 − 12 : 3 = 48 − 4 = 44.',
        'Первая ошибка найдена. Верное решение: 48 − 12 : 3 = 48 − 4 = 44.',
        'First error found. The correct solution is 48 − 12 : 3 = 48 − 4 = 44.',
      ), lang)}</Feedback>}
      {selected && selected !== 'subtract' && <Feedback status="hint">{text(L(
        'Undan oldingi o‘tishni tekshiring: xato qayerda boshlangan?',
        'Проверь предыдущий переход: где ошибка началась?',
        'Inspect the previous transition: where did the error begin?',
      ), lang)}</Feedback>}
    </div>
  )
}

function TransferScreen({ lang, onComplete, onAttempt }) {
  const expressions = [
    { id: 'correct', label: L('2400 − 3·350', '2400 − 3·350', '2400 − 3·350') },
    { id: 'left', label: L('(2400 − 3)·350', '(2400 − 3)·350', '(2400 − 3)·350') },
    { id: 'add', label: L('2400 + 3·350', '2400 + 3·350', '2400 + 3·350') },
  ]
  const [expression, setExpression] = useState(null)
  const [answer, setAnswer] = useState('')
  const [status, setStatus] = useState(null)

  const check = () => {
    const correct = expression === 'correct' && Number(answer) === 1350
    onAttempt(correct, correct ? null : expression !== 'correct' ? 'E-MODEL' : 'E-ORDER')
    setStatus(correct ? 'success' : 'retry')
    if (correct) onComplete()
  }

  return (
    <div className="g7n-transfer">
      <div className="g7n-reserve-visual">
        <div><span>2400</span><small>{text(L('boshlang‘ich zaxira', 'начальный запас', 'starting reserve'), lang)}</small></div>
        <div className="g7n-reserve-tests"><i /><i /><i /><strong>350 × 3</strong></div>
      </div>
      <ChoiceButtons lang={lang} options={expressions} selected={expression} onSelect={(option) => setExpression(option.id)} columns={3} />
      <div className="g7n-inline-check">
        <label className="g7n-answer-field">
          <span>{text(L('Qoldiq', 'Остаток', 'Remaining'), lang)}</span>
          <input inputMode="numeric" value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="?" />
        </label>
        <button type="button" className="g7n-primary" onClick={check} disabled={!expression || answer === ''}>
          <ShieldCheck size={18} /> {text(UI.check, lang)}
        </button>
      </div>
      {status === 'success' && <Feedback>{text(L(
        '1350 birlik qoldi. Ifoda avval uchta sinovning umumiy sarfini hisoblaydi.',
        'Осталось 1350 единиц. Выражение сначала находит общий расход трёх тестов.',
        '1350 units remain. The expression first finds the total cost of the three tests.',
      ), lang)}</Feedback>}
      {status === 'retry' && <Feedback status="hint">{text(UI.retry, lang)}</Feedback>}
    </div>
  )
}

function FinalScreen({ lang, onComplete, onAttempt, metrics }) {
  const firstOptions = [
    { id: 'bracket', label: L('10 − 2', '10 − 2', '10 − 2') },
    { id: 'divide', label: L('64 : 10', '64 : 10', '64 : 10') },
    { id: 'multiply', label: L('3·7', '3·7', '3·7') },
  ]
  const reasons = [
    { id: 'rule', label: L('Chunki qavs ichidagi amal birinchi bajariladi', 'Потому что действие в скобках выполняется первым', 'Because an operation in brackets comes first') },
    { id: 'left', label: L('Chunki u eng chapda turibdi', 'Потому что оно стоит левее всех', 'Because it is the leftmost operation') },
    { id: 'small', label: L('Chunki undagi sonlar kichikroq', 'Потому что в нём меньшие числа', 'Because it uses smaller numbers') },
  ]
  const [first, setFirst] = useState(null)
  const [reason, setReason] = useState(null)
  const [answer, setAnswer] = useState('')
  const [status, setStatus] = useState(null)

  const check = () => {
    const correct = first === 'bracket' && reason === 'rule' && Number(answer) === 29
    onAttempt(correct, correct ? null : first !== 'bracket' || reason !== 'rule' ? 'E-JUSTIFY' : 'E-ORDER')
    setStatus(correct ? 'success' : 'retry')
    if (correct) onComplete({ justification: 2, transfer: 1 })
  }

  if (status === 'success') {
    return (
      <div className="g7n-complete-card">
        <div className="g7n-complete-icon"><Sparkles size={34} /></div>
        <span>LUMO NEXUS / PROTOCOL VERIFIED</span>
        <h2>{text(UI.completed, lang)}</h2>
        <p>{text(L(
          'Endi siz nafaqat qiymatni topasiz, balki birinchi qadamni matematik qoida bilan asoslaysiz.',
          'Теперь ты не только находишь значение, но и обосновываешь первый шаг математическим правилом.',
          'You can now find the value and justify the first step using a mathematical rule.',
        ), lang)}</p>
        <div className="g7n-metric-grid">
          <div><strong>{TOTAL_SCREENS}/{TOTAL_SCREENS}</strong><span>{text(L('ekran', 'экранов', 'screens'), lang)}</span></div>
          <div>
            <strong>{Math.round((metrics.correctAttempts / Math.max(1, metrics.attempts)) * 100)}%</strong>
            <span>{text(L('aniqlik', 'точность', 'accuracy'), lang)}</span>
          </div>
          <div><strong>{metrics.hints}</strong><span>{text(L('maslahat', 'подсказок', 'hints'), lang)}</span></div>
        </div>
      </div>
    )
  }

  return (
    <div className="g7n-final">
      <MathPanel className="g7n-final-expression">64 : (10 − 2) + 3·7</MathPanel>
      <div className="g7n-final-grid">
        <div>
          <label>{text(L('Birinchi amal', 'Первое действие', 'First operation'), lang)}</label>
          <ChoiceButtons lang={lang} options={firstOptions} selected={first} onSelect={(option) => setFirst(option.id)} columns={1} />
        </div>
        <div>
          <label>{text(L('Sabab', 'Основание', 'Reason'), lang)}</label>
          <ChoiceButtons lang={lang} options={reasons} selected={reason} onSelect={(option) => setReason(option.id)} columns={1} />
        </div>
      </div>
      <div className="g7n-inline-check">
        <label className="g7n-answer-field">
          <span>{text(L('Qiymat', 'Значение', 'Value'), lang)}</span>
          <input inputMode="numeric" value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="?" />
        </label>
        <button type="button" className="g7n-primary" onClick={check} disabled={!first || !reason || answer === ''}>
          <ShieldCheck size={18} /> {text(UI.check, lang)}
        </button>
      </div>
      {status === 'retry' && <Feedback status="hint">{text(L(
        'Uch qismni ham tekshiring: birinchi amal, yakuniy qiymat va qoida.',
        'Проверь все три части: первое действие, итоговое значение и правило.',
        'Check all three parts: the first operation, the final value and the rule.',
      ), lang)}</Feedback>}
    </div>
  )
}

function ScreenActivity({ screen, lang, onComplete, onAttempt, metrics }) {
  const props = { lang, onComplete, onAttempt }
  switch (screen) {
    case 0: return <SignalScreen {...props} />
    case 1: return <DiagnosticScreen {...props} />
    case 2: return <AnatomyScreen {...props} />
    case 3: return <ClassifyScreen {...props} />
    case 4: return <ValueScreen {...props} />
    case 5: return <StructureScreen {...props} />
    case 6: return <PriorityScreen {...props} />
    case 7: return <TreeScreen {...props} />
    case 8: return <ProtocolScreen {...props} />
    case 9: return <WorkedScreen {...props} />
    case 10: return <GuidedScreen {...props} />
    case 11: return <IndependentScreen {...props} />
    case 12: return <StrategyScreen {...props} />
    case 13: return <ErrorScreen {...props} />
    case 14: return <TransferScreen {...props} />
    case 15: return <FinalScreen {...props} metrics={metrics} />
    default: return null
  }
}

function Dars01() {
  const [lang, setLang] = useState('ru')
  const [screen, setScreen] = useState(0)
  const [muted, setMuted] = useState(false)
  const [hintOpen, setHintOpen] = useState(false)
  const [completed, setCompleted] = useState(() => Array(TOTAL_SCREENS).fill(false))
  const [metrics, setMetrics] = useState({
    attempts: 0,
    correctAttempts: 0,
    hints: 0,
    misconceptions: [],
    strategy: null,
    justification: 0,
    transfer: 0,
  })
  const { speak, stop } = useSpeech(lang, muted)
  const copy = SCREENS[screen]

  useEffect(() => {
    stop()
  }, [screen, lang, muted, stop])

  const onAttempt = useCallback((correct, tag = null) => {
    setMetrics((current) => ({
      ...current,
      attempts: current.attempts + 1,
      correctAttempts: current.correctAttempts + (correct ? 1 : 0),
      misconceptions:
        tag && !current.misconceptions.includes(tag)
          ? [...current.misconceptions, tag]
          : current.misconceptions,
    }))
  }, [])

  const onComplete = useCallback((result = {}) => {
    setCompleted((current) => {
      if (current[screen]) return current
      const next = [...current]
      next[screen] = true
      return next
    })
    setMetrics((current) => ({
      ...current,
      strategy: result.strategy ?? current.strategy,
      justification: result.justification ?? current.justification,
      transfer: result.transfer ?? current.transfer,
    }))
  }, [screen])

  const showHint = () => {
    setHintOpen((value) => {
      if (!value) setMetrics((current) => ({ ...current, hints: current.hints + 1 }))
      return !value
    })
  }

  const goTo = (nextScreen) => {
    if (nextScreen < 0 || nextScreen >= TOTAL_SCREENS) return
    setHintOpen(false)
    setScreen(nextScreen)
  }

  const activePhase = PHASES.findIndex((phase) => screen >= phase.range[0] && screen <= phase.range[1])
  const progress = ((screen + 1) / TOTAL_SCREENS) * 100

  return (
    <div className="g7n-root" lang={lang}>
      <div className="g7n-stage">
        <header className="g7n-header">
          <div className="g7n-progress" aria-label={`${screen + 1}/${TOTAL_SCREENS}`}>
            <i style={{ width: `${progress}%` }} />
          </div>
          <div className="g7n-chrome">
            <a href="/?subject=matematika&grade=7-sinf&section=nazariy" className="g7n-back">
              <ArrowLeft size={17} /> <span>{text(UI.back, lang)}</span>
            </a>
            <div className="g7n-brand">
              <Cpu size={18} />
              <span>LUMO NEXUS</span>
              <i />
              <strong>{text(L('Hisoblash protokoli', 'Протокол вычислений', 'Computation Protocol'), lang)}</strong>
            </div>
            <div className="g7n-tools">
              <div className="g7n-lang" aria-label="Language">
                {['uz', 'ru', 'en'].map((code) => (
                  <button
                    type="button"
                    key={code}
                    className={lang === code ? 'is-active' : ''}
                    onClick={() => {
                      setHintOpen(false)
                      setLang(code)
                    }}
                  >
                    {code.toUpperCase()}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="g7n-icon-button"
                onClick={() => setMuted((value) => !value)}
                aria-label={text(muted ? UI.unmute : UI.mute, lang)}
                title={text(muted ? UI.unmute : UI.mute, lang)}
              >
                {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <span className="g7n-counter">{String(screen + 1).padStart(2, '0')} / {TOTAL_SCREENS}</span>
            </div>
          </div>
        </header>

        <main className="g7n-main">
          <div className="g7n-heading">
            <div>
              <span>{text(copy.eyebrow, lang)}</span>
              <h1>{text(copy.title, lang)}</h1>
            </div>
            <button type="button" className="g7n-listen" onClick={() => speak(copy.audio)}>
              <Volume2 size={17} /> {text(UI.listen, lang)}
            </button>
            <p>{text(copy.lead, lang)}</p>
          </div>

          <div className="g7n-layout">
            <section className="g7n-workspace">
              {hintOpen && (
                <div className="g7n-hint">
                  <Lightbulb size={18} />
                  <span>{text(copy.hint, lang)}</span>
                </div>
              )}
              <ScreenActivity
                key={screen}
                screen={screen}
                lang={lang}
                onComplete={onComplete}
                onAttempt={onAttempt}
                metrics={metrics}
              />
            </section>

            <aside className="g7n-rail">
              <span className="g7n-rail-title">{text(L('Missiya xaritasi', 'Карта миссии', 'Mission map'), lang)}</span>
              {PHASES.map((phase, index) => {
                const isActive = index === activePhase
                const isDone = screen > phase.range[1]
                return (
                  <div className={`g7n-phase ${isActive ? 'is-active' : ''} ${isDone ? 'is-done' : ''}`} key={index}>
                    <i>{isDone ? <CheckCircle2 size={16} /> : index + 1}</i>
                    <div>
                      <strong>{text(phase.label, lang)}</strong>
                      <small>{text(phase.detail, lang)}</small>
                    </div>
                  </div>
                )
              })}
              <div className="g7n-rail-invariant">
                <ShieldCheck size={18} />
                <span>{text(L('Invariant', 'Инвариант', 'Invariant'), lang)}</span>
                <strong>{text(L(
                  'Bitta yozuv → bitta tekshirilgan qiymat',
                  'Одна запись → одно проверенное значение',
                  'One expression → one verified value',
                ), lang)}</strong>
              </div>
            </aside>
          </div>
        </main>

        <footer className="g7n-footer">
          <button type="button" className="g7n-secondary" onClick={showHint}>
            <Lightbulb size={18} /> {text(UI.hint, lang)}
          </button>
          <div className="g7n-mobile-phase">
            <span>{activePhase + 1}/4</span>
            {text(PHASES[activePhase].label, lang)}
          </div>
          <div className="g7n-nav">
            <button type="button" className="g7n-secondary" disabled={screen === 0} onClick={() => goTo(screen - 1)}>
              <ArrowLeft size={18} /> <span>{text(UI.previous, lang)}</span>
            </button>
            {screen < TOTAL_SCREENS - 1 ? (
              <button
                type="button"
                className="g7n-primary"
                disabled={!completed[screen]}
                onClick={() => goTo(screen + 1)}
              >
                {text(UI.next, lang)} <ArrowRight size={18} />
              </button>
            ) : (
              <div className={`g7n-finished-label ${completed[screen] ? 'is-ready' : ''}`}>
                <Sparkles size={18} /> {text(completed[screen] ? UI.completed : L('Yakuniy tekshiruv', 'Финальная проверка', 'Final check'), lang)}
              </div>
            )}
          </div>
        </footer>
      </div>
    </div>
  )
}

export default Dars01
