import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

// Dars 7 · y = k/x funksiyasi va teskari proporsionallik.
const L = (uz, ru, en) => ({ uz, ru, en })
const LangContext = createContext('uz')
const useLang = () => useContext(LangContext)
const textOf = (value, lang) => {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string' || typeof value === 'number') return value
  return value[lang] ?? value.uz ?? value.ru ?? value.en ?? ''
}

function MathVar({ children }) {
  return <i className="math-var">{children}</i>
}

function MathFraction({
  numerator,
  denominator,
  negative = false,
  compact = false,
}) {
  return (
    <span className={`math-fraction ${compact ? 'is-compact' : ''}`}>
      {negative && <span className="math-fraction-sign">−</span>}
      <span className="math-fraction-stack">
        <span className="math-fraction-num">{numerator}</span>
        <span className="math-fraction-den">{denominator}</span>
      </span>
    </span>
  )
}

function MathEquation({
  children,
  className = '',
  compact = false,
  ariaLabel,
}) {
  return (
    <span
      className={`math-equation ${compact ? 'is-compact' : ''} ${className}`}
      role="math"
      aria-label={ariaLabel}
    >
      {children}
    </span>
  )
}

function InverseFormula({
  numerator = 'k',
  denominator = 'x',
  left = 'y',
  negative = false,
  compact = false,
  className = '',
}) {
  return (
    <MathEquation
      compact={compact}
      className={className}
      ariaLabel={`${left} equals ${negative ? 'negative ' : ''}${numerator} divided by ${denominator}`}
    >
      <MathVar>{left}</MathVar>
      <span>=</span>
      <MathFraction
        compact={compact}
        negative={negative}
        numerator={<MathVar>{numerator}</MathVar>}
        denominator={<MathVar>{denominator}</MathVar>}
      />
    </MathEquation>
  )
}

function ConstantProduct({
  x = 'x',
  y = 'y',
  result = 'k',
  compact = false,
  className = '',
}) {
  return (
    <MathEquation
      compact={compact}
      className={className}
      ariaLabel={`${x} times ${y} equals ${result}`}
    >
      <MathVar>{x}</MathVar>
      <span>·</span>
      <MathVar>{y}</MathVar>
      <span>=</span>
      <MathVar>{result}</MathVar>
    </MathEquation>
  )
}

function QuotientEquation({
  left,
  numerator,
  denominator,
  result,
  compact = false,
  negative = false,
  unit = null,
}) {
  return (
    <MathEquation
      compact={compact}
      ariaLabel={`${left} equals ${negative ? 'negative ' : ''}${numerator} divided by ${denominator}${result !== undefined ? ` equals ${result}` : ''}`}
    >
      {left && <><MathVar>{left}</MathVar><span>=</span></>}
      <MathFraction
        compact={compact}
        negative={negative}
        numerator={<span>{numerator}</span>}
        denominator={<span>{denominator}</span>}
      />
      {result !== undefined && <><span>=</span><span>{result}</span></>}
      {unit && <span className="math-unit">{unit}</span>}
    </MathEquation>
  )
}

const TOTAL_SCREENS = 15
const PRACTICE_START = 9

const LESSON_META = {
  lessonId: 'grade8-math-07-inverse-proportion-v1',
  lessonTitle: L(
    'Teskari proporsionallik funksiyasi va uning grafigi',
    'Обратная пропорциональность и её график',
    'Inverse proportion and its graph',
  ),
}

const SCREEN_META = [
  { id: 's0', type: 'hook', template: 'custom', scored: false, scope: 'hook' },
  { id: 's1', type: 'exploration', template: 'custom', scored: false, scope: null },
  { id: 's2', type: 'exploration', template: 'custom', scored: false, scope: null },
  { id: 's3', type: 'rule-build', template: 'custom', scored: false, scope: null },
  { id: 's4', type: 'domain', template: 'custom', scored: false, scope: null },
  { id: 's5', type: 'model', template: 'custom', scored: false, scope: null },
  { id: 's6', type: 'graph', template: 'custom', scored: false, scope: null },
  { id: 's7', type: 'rule', template: 'custom', scored: false, scope: null },
  { id: 's8', type: 'worked-example', template: 'custom', scored: false, scope: null },
  { id: 's9', type: 'practice', template: 'sequence', scored: true, scope: 'module-mikro' },
  { id: 's10', type: 'practice', template: 'sequence', scored: true, scope: 'module-mikro' },
  { id: 's11', type: 'practice', template: 'sequence', scored: true, scope: 'module-mikro' },
  { id: 's12', type: 'practice', template: 'sequence', scored: true, scope: 'module-mikro' },
  { id: 's13', type: 'practice', template: 'sequence', scored: true, scope: 'final' },
  { id: 's14', type: 'summary', template: 'custom', scored: false, scope: null },
]

const UI = {
  back: L('Orqaga', 'Назад', 'Back'),
  next: L('Davom etish', 'Продолжить', 'Continue'),
  finish: L('Darsni yakunlash', 'Завершить урок', 'Finish lesson'),
  check: L('Tekshirish', 'Проверить', 'Check'),
  nextTask: L('Keyingi topshiriq', 'Следующее задание', 'Next task'),
  done: L('Blok bajarildi', 'Блок выполнен', 'Block complete'),
  correct: L("To'g'ri!", 'Верно!', 'Correct!'),
  retry: L(
    "Hali emas. Bog'lanishni yana tekshiring.",
    'Пока нет. Проверьте связь ещё раз.',
    'Not yet. Check the relationship once more.',
  ),
  answer: L('Javob', 'Ответ', 'Answer'),
  solution: L('Yechim', 'Решение', 'Solution'),
  task: L('Topshiriq', 'Задание', 'Task'),
  lessonQuestion: L('DARS SAVOLI', 'ВОПРОС УРОКА', 'LESSON QUESTION'),
  theory: L('TUSHUNTIRISH', 'ОБЪЯСНЕНИЕ', 'EXPLANATION'),
  example: L('NAMUNA', 'ПРИМЕР', 'WORKED EXAMPLE'),
  practice: L('MUSTAQIL ISH', 'САМОСТОЯТЕЛЬНАЯ РАБОТА', 'INDEPENDENT PRACTICE'),
  summary: L('YAKUN', 'ИТОГ', 'SUMMARY'),
}

const SCREEN_CONTENT = [
  {
    eyebrow: UI.lessonQuestion,
    title: L(
      "24 m² maydon o'zgarmasa, tomonlar qanday o'zgaradi?",
      'Если площадь 24 м² не меняется, как меняются стороны?',
      'If the area stays 24 m², how do the sides change?',
    ),
    lead: L(
      "Eni uzaysa, bo'yi ham uzayadimi yoki qisqaradimi? Hozir faqat taxmin qiling.",
      'Если ширина растёт, длина тоже растёт или уменьшается? Пока только предположите.',
      'If the width grows, does the height grow too or shrink? Make a prediction.',
    ),
    audio: [
      L(
        "Tasavvur qiling: to'rtburchakning yuzi doim yigirma to'rt kvadrat metr.",
        'Представьте: площадь прямоугольника всегда равна двадцати четырём квадратным метрам.',
        'Imagine a rectangle whose area is always twenty-four square metres.',
      ),
      L(
        "Enini ikki marta oshirsak, bo'yi bilan nima sodir bo'ladi? Taxminingizni tanlang.",
        'Если ширину увеличить в два раза, что произойдёт с высотой? Выберите прогноз.',
        'If we double its width, what happens to its height? Choose your prediction.',
      ),
    ],
  },
  {
    eyebrow: UI.theory,
    title: L(
      "Bir tomon o'sadi — ikkinchisi qisqaradi",
      'Одна сторона растёт — другая уменьшается',
      'One side grows — the other shrinks',
    ),
    lead: L(
      "Slayderni suring. Har safar x · y = 24 bo'lib qoladi.",
      'Двигайте ползунок. Каждый раз произведение x · y остаётся равным 24.',
      'Move the slider. Each time, the product x · y remains 24.',
    ),
    audio: [
      L(
        "Enni ikkitadan o'n ikkigacha o'zgartiramiz.",
        'Изменяем ширину от двух до двенадцати.',
        'We change the width from two to twelve.',
      ),
      L(
        "En katta bo'lsa, balandlik kichik bo'ladi, ammo yuza o'zgarmaydi.",
        'Чем больше ширина, тем меньше высота, но площадь не меняется.',
        'The larger the width, the smaller the height, while the area stays fixed.',
      ),
      L(
        "Demak, x va y bir yo'nalishda emas, qarama-qarshi o'zgaradi.",
        'Значит, x и y меняются не в одном, а в противоположных направлениях.',
        'So x and y change in opposite directions.',
      ),
    ],
  },
  {
    eyebrow: UI.theory,
    title: L(
      "Jadval o'zgarishni ko'rsatadi",
      'Таблица показывает изменение',
      'A table reveals the change',
    ),
    lead: L(
      "Juftliklarni tanlang: x va y o'zgaradi, lekin ularning ko'paytmasi bir xil.",
      'Выбирай пары: x и y меняются, но их произведение остаётся одинаковым.',
      'Select the pairs: x and y change, but their product stays the same.',
    ),
    audio: [
      L(
        "Jadvaldagi juftliklarni kuzating: bir va yigirma to'rt, ikki va o'n ikki.",
        'Проследите пары в таблице: один и двадцать четыре, два и двенадцать.',
        'Follow the pairs in the table: one and twenty-four, two and twelve.',
      ),
      L(
        "x ikki marta oshsa, y ikki marta kamayadi.",
        'Если x увеличивается в два раза, y уменьшается в два раза.',
        'When x doubles, y is divided by two.',
      ),
      L(
        "Barcha ustunlarda tekshiring: x karra y yigirma to'rt.",
        'Проверьте каждый столбец: x умножить на y равно двадцати четырём.',
        'Check every column: x times y equals twenty-four.',
      ),
    ],
  },
  {
    eyebrow: UI.theory,
    title: L(
      "O'zgarmas ko'paytma formulaga aylanadi",
      'Постоянное произведение превращается в формулу',
      'The constant product becomes a formula',
    ),
    lead: L(
      "x · y = k tenglikning ikki tomonini x ga bo'lib, y ni yolg'iz qoldiring.",
      'Раздели обе части x · y = k на x и вырази y.',
      'Divide both sides of x · y = k by x and isolate y.',
    ),
    audio: [
      L(
        "Yigirma to'rt o'rniga nolga teng bo'lmagan o'zgarmas sonni k bilan belgilaymiz.",
        'Вместо двадцати четырёх обозначим буквой k постоянное число, не равное нулю.',
        'Replace twenty-four by a non-zero constant called k.',
      ),
      L(
        "Ikkala tomonni x ga bo'lamiz: y teng k bo'lingan x.",
        'Делим обе части на x: y равно k, делённому на x.',
        'Divide both sides by x: y equals k divided by x.',
      ),
      L(
        "Bu teskari proporsionallikning asosiy formulasi.",
        'Это основная формула обратной пропорциональности.',
        'This is the core formula of inverse proportion.',
      ),
    ],
  },
  {
    eyebrow: UI.theory,
    title: L(
      "Nega x nol bo'la olmaydi?",
      'Почему x не может быть равен нулю?',
      'Why can x not be zero?',
    ),
    lead: L(
      "Qiymatlarni tekshiring va x = 0 kartasini tanlang.",
      'Проверь значения и выбери карточку x = 0.',
      'Test the values and select the x = 0 card.',
    ),
    audio: [
      L(
        "Musbat va manfiy x qiymatlarida hisoblash mumkin.",
        'При положительных и отрицательных значениях x вычисление возможно.',
        'We can calculate for positive and negative values of x.',
      ),
      L(
        "Ammo x nol bo'lsa, k ni nolga bo'lish kerak bo'ladi.",
        'Но при x, равном нулю, пришлось бы делить k на ноль.',
        'But when x is zero, we would have to divide k by zero.',
      ),
      L(
        "Shuning uchun qoida yoniga doim x nolga teng emas deb yozamiz.",
        'Поэтому рядом с формулой всегда пишем: x не равен нулю.',
        'That is why we always add: x is not equal to zero.',
      ),
    ],
  },
  {
    eyebrow: UI.theory,
    title: L(
      "Jadvaldagi juftliklar koordinata nuqtalariga aylanadi",
      'Пары из таблицы становятся точками на координатной плоскости',
      'Table pairs become points on the coordinate plane',
    ),
    lead: L(
      "Har bir (x; y) juftlik — grafikdagi bitta nuqta.",
      'Каждая пара (x; y) — одна точка графика.',
      'Every pair (x, y) is one point on the graph.',
    ),
    audio: [
      L(
        "Jadvaldan birinchi juftlikni olamiz va koordinata tekisligiga qo'yamiz.",
        'Берём первую пару из таблицы и отмечаем её на координатной плоскости.',
        'Take the first pair from the table and place it on the coordinate plane.',
      ),
      L(
        "Boshqa juftliklar ham o'z joyiga boradi.",
        'Остальные пары также занимают свои места.',
        'The other pairs move to their places too.',
      ),
      L(
        "Musbat va manfiy juftliklarni joylashtirsak, ikkala shoxning nuqtalari ko'rinadi.",
        'Если нанести положительные и отрицательные пары, появятся точки обеих ветвей.',
        'Plot positive and negative pairs to reveal points on both branches.',
      ),
    ],
  },
  {
    eyebrow: UI.theory,
    title: L(
      "Nuqtalar giperbola chizig'ini hosil qiladi",
      'Точки образуют гиперболу',
      'The points form a hyperbola',
    ),
    lead: L(
      "k ning ishorasi grafik qaysi choraklarda joylashishini belgilaydi.",
      'Знак k определяет, в каких четвертях расположен график.',
      'The sign of k determines which quadrants contain the graph.',
    ),
    audio: [
      L(
        "Nuqtalarni silliq bog'lasak, ikki shoxli egri chiziq hosil bo'ladi.",
        'Если плавно соединить точки, получим кривую с двумя ветвями.',
        'Join the points smoothly and a two-branch curve appears.',
      ),
      L(
        "k musbat bo'lsa, shoxlar birinchi va uchinchi choraklarda.",
        'Если k положительно, ветви находятся в первой и третьей четвертях.',
        'When k is positive, the branches lie in quadrants one and three.',
      ),
      L(
        "k manfiy bo'lsa, ular ikkinchi va to'rtinchi choraklarga o'tadi.",
        'Если k отрицательно, они переходят во вторую и четвёртую четверти.',
        'When k is negative, they move to quadrants two and four.',
      ),
    ],
  },
  {
    eyebrow: UI.theory,
    title: L(
      "Teskari proporsionallikning pasporti",
      'Паспорт обратной пропорциональности',
      'The inverse-proportion passport',
    ),
    lead: L(
      "Ta'rifni, formulani va uning oqibatlarini bir-biridan ajrating.",
      'Разделите определение, формулу и её следствия.',
      'Separate the definition, the formula, and its consequences.',
    ),
    audio: [
      L(
        "Asosiy ta'rif: x va y ko'paytmasi nolga teng bo'lmagan k soniga teng.",
        'Главное определение: произведение x и y равно ненулевому числу k.',
        'The defining test is that the product of x and y equals a non-zero constant k.',
      ),
      L(
        "Shundan kasr ko'rinishidagi formula va x hamda y nol emasligi kelib chiqadi.",
        'Отсюда следуют дробная формула и условия: x и y не равны нулю.',
        'This gives the fractional formula and the conditions that x and y are non-zero.',
      ),
      L(
        "Kamayishning o'zi yetarli emas. Doim ko'paytma o'zgarmasligini tekshiring.",
        'Одного убывания недостаточно. Всегда проверяйте постоянство произведения.',
        'Decreasing alone is not enough. Always test whether the product is constant.',
      ),
    ],
  },
  {
    eyebrow: UI.example,
    title: L(
      "Bitta misolda ikki yo'nalishda ishlaymiz",
      'В одном примере работаем в двух направлениях',
      'One example, two directions',
    ),
    lead: L(
      "Koeffitsiyent 36. Avval x dan y ni, keyin y dan x ni topamiz.",
      'Коэффициент равен 36. Сначала найдём y по x, затем x по y.',
      'The coefficient is 36. First find y from x, then x from y.',
    ),
    audio: [
      L(
        "Birinchi savol: x to'rt bo'lsa, y ni topamiz.",
        'Первый вопрос: найдём y, если x равен четырём.',
        'First question: find y when x equals four.',
      ),
    ],
  },
  {
    eyebrow: UI.practice,
    title: L(
      "1-blok · O'zgarmas ko'paytma",
      'Блок 1 · Постоянное произведение',
      'Block 1 · Constant product',
    ),
    lead: L(
      "6 topshiriqni ketma-ket bajaring. To'g'ri javob keyingi topshiriqni ochadi.",
      'Решите 6 заданий по порядку. Верный ответ открывает следующее.',
      'Solve 6 tasks in order. A correct answer unlocks the next one.',
    ),
    audio: [
      L(
        "Birinchi mashq bloki o'zgarmas ko'paytmani topishga bag'ishlangan.",
        'Первый блок упражнений посвящён постоянному произведению.',
        'The first practice block focuses on the constant product.',
      ),
      L(
        "Har bir to'g'ri javobdan so'ng qisqa yechimni ko'ring, keyin davom eting.",
        'После каждого верного ответа изучите короткое решение и продолжайте.',
        'After each correct answer, study the short solution and continue.',
      ),
    ],
  },
  {
    eyebrow: UI.practice,
    title: L(
      "2-blok · Hisoblash va cheklov",
      'Блок 2 · Вычисления и ограничение',
      'Block 2 · Calculation and restriction',
    ),
    lead: L(
      "Formula, ishora va x ≠ 0 shartini birga nazorat qiling.",
      'Одновременно следите за формулой, знаком и условием x ≠ 0.',
      'Track the formula, the sign, and the condition x ≠ 0 together.',
    ),
    audio: [
      L(
        "Bu blokda noma'lum x yoki y ni topasiz.",
        'В этом блоке вы будете находить неизвестные x или y.',
        'In this block you will find an unknown x or y.',
      ),
      L(
        "Manfiy sonlar ishorasiga va nolga bo'lish mumkin emasligiga e'tibor bering.",
        'Следите за знаками отрицательных чисел и помните, что делить на ноль нельзя.',
        'Watch negative signs and remember that division by zero is impossible.',
      ),
    ],
  },
  {
    eyebrow: UI.practice,
    title: L(
      "3-blok · Grafik va xatoni topish",
      'Блок 3 · График и поиск ошибки',
      'Block 3 · Graphs and error spotting',
    ),
    lead: L(
      "Grafikning choraklari, nuqtalari va ma'nosini tekshiring.",
      'Проверьте четверти, точки и смысл графика.',
      'Check the graph’s quadrants, points, and meaning.',
    ),
    audio: [
      L(
        "Endi formulani grafik tilida o'qiymiz.",
        'Теперь читаем формулу на языке графика.',
        'Now read the formula in the language of graphs.',
      ),
      L(
        "Nuqta grafikda yotishini tekshirish uchun uning x va y qiymatlarini formulaga qo'ying.",
        'Чтобы проверить точку, подставьте её x и y в формулу.',
        'To test a point, substitute its x and y values into the formula.',
      ),
    ],
  },
  {
    eyebrow: UI.practice,
    title: L(
      "4-blok · Nuqtadan formulaga",
      'Блок 4 · От точки к формуле',
      'Block 4 · From a point to a formula',
    ),
    lead: L(
      "Nuqta berilgan bo'lsa, k = x · y orqali modelni tiklang.",
      'Если дана точка, восстановите модель по формуле k = x · y.',
      'When a point is given, rebuild the model using k = x · y.',
    ),
    audio: [
      L(
        "Bu safar tayyor k yo'q. Uni nuqtaning koordinatalaridan topasiz.",
        'На этот раз готового k нет. Найдите его по координатам точки.',
        'This time k is not given. Find it from the point’s coordinates.',
      ),
      L(
        "x ni y ga ko'paytiring va ishorani saqlang.",
        'Умножьте x на y и сохраните знак.',
        'Multiply x by y and keep the correct sign.',
      ),
    ],
  },
  {
    eyebrow: UI.practice,
    title: L(
      "5-blok · Hayotiy vaziyatga ko'chirish",
      'Блок 5 · Перенос в реальные ситуации',
      'Block 5 · Transfer to real situations',
    ),
    lead: L(
      "Qaysi miqdor o'zgarmasligini toping, keyin modelni tanlang.",
      'Найдите, какая величина постоянна, затем выберите модель.',
      'Identify what stays constant, then choose the model.',
    ),
    audio: [
      L(
        "Yakuniy blokda teskari proporsionallikni real vaziyatlarda tanib olasiz.",
        'В итоговом блоке вы распознаете обратную пропорциональность в реальных ситуациях.',
        'In the final block, recognise inverse proportion in real situations.',
      ),
      L(
        "Avval o'zgarmas ko'paytmani aniqlang, so'ng hisoblang.",
        'Сначала определите постоянное произведение, затем вычисляйте.',
        'First identify the constant product, then calculate.',
      ),
    ],
  },
  {
    eyebrow: UI.summary,
    title: L(
      "Endi 24 m² sirini formula bilan tushuntira olasiz",
      'Теперь вы можете объяснить секрет 24 м² формулой',
      'You can now explain the 24 m² puzzle with a formula',
    ),
    lead: L(
      "Boshidagi taxminni qoida, jadval va grafik bilan tekshirdik.",
      'Мы проверили начальный прогноз с помощью правила, таблицы и графика.',
      'We tested the opening prediction with a rule, a table, and a graph.',
    ),
    audio: [
      L(
        "Teskari proporsionallikda x va y qarama-qarshi o'zgaradi, ularning ko'paytmasi esa k ga teng.",
        'При обратной пропорциональности x и y меняются противоположно, а их произведение равно k.',
        'In inverse proportion, x and y change in opposite directions while their product equals k.',
      ),
      L(
        "Formula y teng k bo'lingan x, bunda x nolga teng emas.",
        'Формула: y равно k, делённому на x, где x не равен нулю.',
        'The formula is y equals k divided by x, where x is not zero.',
      ),
      L(
        "Grafik giperbola. k musbat bo'lsa birinchi va uchinchi, manfiy bo'lsa ikkinchi va to'rtinchi choraklarda joylashadi.",
        'График — гипербола. При положительном k она в первой и третьей, при отрицательном — во второй и четвёртой четвертях.',
        'The graph is a hyperbola: quadrants one and three for positive k, and two and four for negative k.',
      ),
    ],
  },
]

/*
const task = (id, type, prompt, visual, answer, solution, options = null) => ({
  id,
  type,
  prompt,
  visual,
  answer,
  solution,
  options,
})

const PRACTICE_BLOCKS_LEGACY = [
  [
    task('p1-1', 'number', L('y = 24/x. x = 6 bo‘lsa, y ni toping.', 'y = 24/x. Найдите y при x = 6.', 'For y = 24/x, find y when x = 6.'), 'y = 24 ÷ 6', 4, L('y = 24 ÷ 6 = 4.', 'y = 24 ÷ 6 = 4.', 'y = 24 ÷ 6 = 4.')),
    task('p1-2', 'number', L('Grafik (−4; 3) nuqtadan o‘tadi. k ni toping.', 'График проходит через точку (−4; 3). Найдите k.', 'The graph passes through (−4, 3). Find k.'), 'k = x · y', -12, L('k = (−4) · 3 = −12.', 'k = (−4) · 3 = −12.', 'k = (−4) · 3 = −12.')),
    task('p1-3', 'mcq', L('Qaysi jadval y = 18/x ga mos?', 'Какая таблица соответствует y = 18/x?', 'Which table matches y = 18/x?'), 'x · y = 18', 'A', L('2 · 9 = 3 · 6 = 6 · 3 = 18.', '2 · 9 = 3 · 6 = 6 · 3 = 18.', '2 · 9 = 3 · 6 = 6 · 3 = 18.'), [
      L('A · (2; 9), (3; 6), (6; 3)', 'A · (2; 9), (3; 6), (6; 3)', 'A · (2, 9), (3, 6), (6, 3)'),
      L('B · (2; 9), (3; 7), (6; 3)', 'B · (2; 9), (3; 7), (6; 3)', 'B · (2, 9), (3, 7), (6, 3)'),
      L('C · (2; 4), (3; 6), (6; 12)', 'C · (2; 4), (3; 6), (6; 12)', 'C · (2, 4), (3, 6), (6, 12)'),
    ]),
    task('p1-4', 'number', L('y = 20/x va y = −5. x ni toping.', 'y = 20/x и y = −5. Найдите x.', 'For y = 20/x and y = −5, find x.'), 'x = 20 ÷ (−5)', -4, L('x = 20 ÷ (−5) = −4.', 'x = 20 ÷ (−5) = −4.', 'x = 20 ÷ (−5) = −4.')),
    task('p1-5', 'mcq', L('Ushbu juftliklar uchun o‘zgarmas ko‘paytma qaysi?', 'Каково постоянное произведение для этих пар?', 'What is the constant product for these pairs?'), '(−6; 2), (−3; 4), (2; −6)', 'B', L('Har bir juftlikda x · y = −12.', 'В каждой паре x · y = −12.', 'In every pair, x · y = −12.'), [
      L('A · 12', 'A · 12', 'A · 12'),
      L('B · −12', 'B · −12', 'B · −12'),
      L('C · −8', 'C · −8', 'C · −8'),
    ]),
    task('p1-6', 'number', L('(4; 6) va (−8; y) bir grafikda. y ni toping.', '(4; 6) и (−8; y) лежат на одном графике. Найдите y.', '(4, 6) and (−8, y) lie on one graph. Find y.'), '4 · 6 = (−8) · y', -3, L('k = 24, shuning uchun y = 24 ÷ (−8) = −3.', 'k = 24, поэтому y = 24 ÷ (−8) = −3.', 'k = 24, so y = 24 ÷ (−8) = −3.')),
  ],
  [
    task('p2-1', 'number', L('y = 30/x. x = 5 bo‘lsa, y?', 'y = 30/x. Чему равен y при x = 5?', 'For y = 30/x, what is y when x = 5?'), '30 ÷ 5', 6, L('y = 30 ÷ 5 = 6.', 'y = 30 ÷ 5 = 6.', 'y = 30 ÷ 5 = 6.')),
    task('p2-2', 'number', L('y = −42/x va y = 7. x ni toping.', 'y = −42/x и y = 7. Найдите x.', 'For y = −42/x and y = 7, find x.'), 'x = −42 ÷ 7', -6, L('x = −42 ÷ 7 = −6.', 'x = −42 ÷ 7 = −6.', 'x = −42 ÷ 7 = −6.')),
    task('p2-3', 'mcq', L('y = 10/x formulada qaysi x taqiqlangan?', 'Какое x запрещено в формуле y = 10/x?', 'Which x is forbidden in y = 10/x?'), 'x ≠ ?', 'B', L('Nolga bo‘lish aniqlanmagan, demak x ≠ 0.', 'Деление на ноль не определено, значит x ≠ 0.', 'Division by zero is undefined, so x ≠ 0.'), [
      L('A · −1', 'A · −1', 'A · −1'),
      L('B · 0', 'B · 0', 'B · 0'),
      L('C · 1', 'C · 1', 'C · 1'),
    ]),
    task('p2-4', 'number', L('Grafik (−3; 8) nuqtadan o‘tadi. k?', 'График проходит через (−3; 8). Чему равно k?', 'The graph passes through (−3, 8). What is k?'), 'k = (−3) · 8', -24, L('k = −24.', 'k = −24.', 'k = −24.')),
    task('p2-5', 'number', L('y = 36/x. x 3 dan 6 ga oshsa, yangi y?', 'y = 36/x. Если x вырос с 3 до 6, чему равен новый y?', 'For y = 36/x, x grows from 3 to 6. What is the new y?'), 'y = 36 ÷ 6', 6, L('x ikki marta oshdi, y ikki marta kamaydi: 12 dan 6 ga.', 'x удвоился, y уменьшился вдвое: с 12 до 6.', 'x doubled, so y halved: from 12 to 6.')),
    task('p2-6', 'number', L('y = 15/x va y = −3. x?', 'y = 15/x и y = −3. Чему равен x?', 'For y = 15/x and y = −3, what is x?'), 'x = 15 ÷ (−3)', -5, L('x = −5.', 'x = −5.', 'x = −5.')),
  ],
  [
    task('p3-1', 'mcq', L('k > 0 bo‘lsa, grafik qaysi choraklarda?', 'Если k > 0, в каких четвертях график?', 'If k > 0, which quadrants contain the graph?'), 'k > 0', 'A', L('Musbat k uchun x va y ishoralari bir xil: I va III.', 'При положительном k знаки x и y одинаковы: I и III.', 'For positive k, x and y share a sign: I and III.'), [
      L('A · I va III', 'A · I и III', 'A · I and III'),
      L('B · II va IV', 'B · II и IV', 'B · II and IV'),
      L('C · I va II', 'C · I и II', 'C · I and II'),
    ]),
    task('p3-2', 'mcq', L('k < 0 bo‘lsa, grafik qaysi choraklarda?', 'Если k < 0, в каких четвертях график?', 'If k < 0, which quadrants contain the graph?'), 'k < 0', 'B', L('Manfiy k uchun ishoralar qarama-qarshi: II va IV.', 'При отрицательном k знаки противоположны: II и IV.', 'For negative k, the signs differ: II and IV.'), [
      L('A · I va III', 'A · I и III', 'A · I and III'),
      L('B · II va IV', 'B · II и IV', 'B · II and IV'),
      L('C · III va IV', 'C · III и IV', 'C · III and IV'),
    ]),
    task('p3-3', 'mcq', L('Qaysi nuqta y = −12/x grafikda yotadi?', 'Какая точка лежит на графике y = −12/x?', 'Which point lies on y = −12/x?'), 'x · y = −12', 'A', L('(3; −4) uchun 3 · (−4) = −12.', 'Для (3; −4): 3 · (−4) = −12.', 'For (3, −4), 3 · (−4) = −12.'), [
      L('A · (3; −4)', 'A · (3; −4)', 'A · (3, −4)'),
      L('B · (3; 4)', 'B · (3; 4)', 'B · (3, 4)'),
      L('C · (4; 4)', 'C · (4; 4)', 'C · (4, 4)'),
    ]),
    task('p3-4', 'mcq', L('(0; 5) nuqta y = 8/x da nega yotmaydi?', 'Почему точка (0; 5) не лежит на y = 8/x?', 'Why is (0, 5) not on y = 8/x?'), '8 ÷ 0', 'A', L('x = 0 da 8/x aniqlanmagan.', 'При x = 0 выражение 8/x не определено.', 'At x = 0, 8/x is undefined.'), [
      L('A · Nolga bo‘lish mumkin emas', 'A · Нельзя делить на ноль', 'A · Division by zero is impossible'),
      L('B · y musbat bo‘lgani uchun', 'B · Потому что y положителен', 'B · Because y is positive'),
      L('C · 0 · 5 juda katta', 'C · 0 · 5 слишком велико', 'C · 0 · 5 is too large'),
    ]),
    task('p3-5', 'number', L('Yuzi 48, eni 6 bo‘lgan to‘rtburchakning bo‘yi?', 'Площадь прямоугольника 48, ширина 6. Найдите длину.', 'A rectangle has area 48 and width 6. Find its length.'), '6 · y = 48', 8, L('y = 48 ÷ 6 = 8.', 'y = 48 ÷ 6 = 8.', 'y = 48 ÷ 6 = 8.')),
    task('p3-6', 'number', L('Grafik (4; −6) dan o‘tadi. x = −8 da y?', 'График проходит через (4; −6). Найдите y при x = −8.', 'The graph passes through (4, −6). Find y at x = −8.'), 'k = 4 · (−6) = −24', 3, L('y = −24 ÷ (−8) = 3.', 'y = −24 ÷ (−8) = 3.', 'y = −24 ÷ (−8) = 3.')),
  ],
  [
    task('p4-1', 'number', L('(2; 6) nuqta uchun k ni toping.', 'Найдите k для точки (2; 6).', 'Find k for the point (2, 6).'), 'k = 2 · 6', 12, L('k = 12, demak y = 12/x.', 'k = 12, значит y = 12/x.', 'k = 12, so y = 12/x.')),
    task('p4-2', 'number', L('(3; 8) nuqta uchun k ni toping.', 'Найдите k для точки (3; 8).', 'Find k for the point (3, 8).'), 'k = 3 · 8', 24, L('k = 24, demak y = 24/x.', 'k = 24, значит y = 24/x.', 'k = 24, so y = 24/x.')),
    task('p4-3', 'number', L('(−4; 3) nuqta uchun k ni toping.', 'Найдите k для точки (−4; 3).', 'Find k for the point (−4, 3).'), 'k = (−4) · 3', -12, L('k = −12, demak y = −12/x.', 'k = −12, значит y = −12/x.', 'k = −12, so y = −12/x.')),
    task('p4-4', 'number', L('(5; −2) nuqta uchun k ni toping.', 'Найдите k для точки (5; −2).', 'Find k for the point (5, −2).'), 'k = 5 · (−2)', -10, L('k = −10, demak y = −10/x.', 'k = −10, значит y = −10/x.', 'k = −10, so y = −10/x.')),
    task('p4-5', 'number', L('(1; 9) nuqta uchun k ni toping.', 'Найдите k для точки (1; 9).', 'Find k for the point (1, 9).'), 'k = 1 · 9', 9, L('k = 9, demak y = 9/x.', 'k = 9, значит y = 9/x.', 'k = 9, so y = 9/x.')),
    task('p4-6', 'number', L('(−2; −7) nuqta uchun k ni toping.', 'Найдите k для точки (−2; −7).', 'Find k for the point (−2, −7).'), 'k = (−2) · (−7)', 14, L('Ikki manfiy son ko‘paytmasi musbat: k = 14.', 'Произведение двух отрицательных чисел положительно: k = 14.', 'The product of two negative numbers is positive: k = 14.')),
  ],
  [
    task('p5-1', 'number', L('6 ishchi ishni 8 kunda tugatadi. 12 ishchi necha kunda?', '6 рабочих выполняют работу за 8 дней. За сколько дней справятся 12?', '6 workers finish a job in 8 days. How many days for 12 workers?'), '6 · 8 = 12 · t', 4, L('Ish hajmi 48 ishchi-kun. t = 48 ÷ 12 = 4.', 'Объём — 48 человеко-дней. t = 48 ÷ 12 = 4.', 'The job is 48 worker-days. t = 48 ÷ 12 = 4.')),
    task('p5-2', 'number', L('Masofa 240 km. Tezlik 60 km/soat. Vaqt?', 'Расстояние 240 км, скорость 60 км/ч. Найдите время.', 'Distance is 240 km and speed is 60 km/h. Find the time.'), 'v · t = 240', 4, L('t = 240 ÷ 60 = 4 soat.', 't = 240 ÷ 60 = 4 часа.', 't = 240 ÷ 60 = 4 hours.')),
    task('p5-3', 'mcq', L('Qaysi juftlik teskari proporsional?', 'Какая пара обратно пропорциональна?', 'Which pair is inversely proportional?'), 'x · y = const', 'B', L('Ish hajmi o‘zgarmasa, ishchilar soni oshganda vaqt kamayadi.', 'При постоянном объёме работы больше работников — меньше времени.', 'For a fixed job, more workers mean less time.'), [
      L('A · Kvadrat tomoni va perimetri', 'A · Сторона квадрата и периметр', 'A · Square side and perimeter'),
      L('B · Ishchilar soni va vaqt', 'B · Число рабочих и время', 'B · Number of workers and time'),
      L('C · Narx va xarajat, son o‘zgarmasa', 'C · Цена и стоимость при постоянном количестве', 'C · Price and cost for a fixed quantity'),
    ]),
    task('p5-4', 'number', L('Yuzi 48 m², eni 6 m. Bo‘yi?', 'Площадь 48 м², ширина 6 м. Длина?', 'Area is 48 m² and width is 6 m. Length?'), '6 · y = 48', 8, L('y = 48 ÷ 6 = 8 metr.', 'y = 48 ÷ 6 = 8 метров.', 'y = 48 ÷ 6 = 8 metres.')),
    task('p5-5', 'number', L('y = −18/x. x = 6 bo‘lsa, y?', 'y = −18/x. Чему равен y при x = 6?', 'For y = −18/x, what is y when x = 6?'), '−18 ÷ 6', -3, L('y = −3.', 'y = −3.', 'y = −3.')),
    task('p5-6', 'mcq', L('k < 0 bo‘lsa, nuqtalar qayerda?', 'Где находятся точки при k < 0?', 'Where are the points when k < 0?'), 'x · y < 0', 'B', L('Ko‘paytma manfiy bo‘lishi uchun ishoralar qarama-qarshi: II va IV.', 'Чтобы произведение было отрицательным, знаки противоположны: II и IV.', 'For a negative product, the signs differ: quadrants II and IV.'), [
      L('A · I va III choraklarda', 'A · В I и III четвертях', 'A · Quadrants I and III'),
      L('B · II va IV choraklarda', 'B · Во II и IV четвертях', 'B · Quadrants II and IV'),
      L('C · Faqat o‘qlarda', 'C · Только на осях', 'C · Only on the axes'),
    ]),
  ],
]

*/

const choice = (label, visual = null) => ({ label, visual })
const practiceTask = (config) => config

const PRACTICE_BLOCKS = [
  [
    practiceTask({
      id: 'v2-p1-1',
      type: 'number',
      skill: 'invariant',
      prompt: L(
        "Ko'paytma o'zgarmas qolishi uchun jadvaldagi bo'sh joyni to'ldiring.",
        'Заполните пропуск так, чтобы произведение оставалось постоянным.',
        'Fill the gap so that the product stays constant.',
      ),
      visual: { kind: 'table-gap', x: [2, 3, 6], y: [12, 8, null] },
      answer: 4,
      hint1: L(
        "Avval 2 · 12 va 3 · 8 ko'paytmalarini solishtiring.",
        'Сначала сравните произведения 2 · 12 и 3 · 8.',
        'First compare the products 2 · 12 and 3 · 8.',
      ),
      hint2: L(
        "O'zgarmas ko'paytma 24. Demak, 6 · y = 24.",
        'Постоянное произведение равно 24. Значит, 6 · y = 24.',
        'The constant product is 24, so 6 · y = 24.',
      ),
      solution: L(
        "k = 24, shuning uchun y yigirma to'rtni oltiga bo'lganda 4 ga teng.",
        'k = 24, поэтому y равно двадцати четырём, делённым на шесть, то есть 4.',
        'k = 24, so y is twenty-four divided by six, which is 4.',
      ),
      solutionMath: { kind: 'quotient', left: 'y', numerator: 24, denominator: 6, result: 4 },
    }),
    practiceTask({
      id: 'v2-p1-2',
      type: 'mcq',
      skill: 'invariant',
      prompt: L(
        "Uchala juftlik uchun qaysi son o'zgarmaydi?",
        'Какое число остаётся постоянным для всех трёх пар?',
        'Which number stays constant for all three pairs?',
      ),
      visual: { kind: 'pairs', pairs: [[-2, 9], [3, -6], [6, -3]] },
      options: [
        choice(L('18', '18', '18')),
        choice(L('−18', '−18', '−18')),
        choice(L('−9', '−9', '−9')),
      ],
      answer: 'B',
      hint1: L(
        "Kamida ikkita juftlikda x · y ni hisoblang.",
        'Вычислите x · y хотя бы для двух пар.',
        'Calculate x · y for at least two pairs.',
      ),
      hint2: L(
        "(−2) · 9 = −18 va 3 · (−6) = −18.",
        '(−2) · 9 = −18 и 3 · (−6) = −18.',
        '(−2) · 9 = −18 and 3 · (−6) = −18.',
      ),
      solution: L(
        "Barcha juftliklarda x · y = −18, demak k = −18.",
        'Во всех парах x · y = −18, значит k = −18.',
        'Every pair has x · y = −18, so k = −18.',
      ),
      solutionMath: { kind: 'product-chain', items: ['(−2) · 9', '3 · (−6)', '6 · (−3)'], result: '−18' },
    }),
    practiceTask({
      id: 'v2-p1-3',
      type: 'mcq',
      skill: 'table',
      prompt: L(
        "Ko'rsatilgan funksiyaga qaysi jadval mos keladi?",
        'Какая таблица соответствует показанной функции?',
        'Which table matches the function shown?',
      ),
      visual: { kind: 'formula', numerator: 36, denominator: 'x' },
      options: [
        choice(L('(2; 18), (4; 9), (6; 6)', '(2; 18), (4; 9), (6; 6)', '(2, 18), (4, 9), (6, 6)')),
        choice(L('(2; 18), (4; 8), (6; 6)', '(2; 18), (4; 8), (6; 6)', '(2, 18), (4, 8), (6, 6)')),
        choice(L('(2; 12), (4; 9), (6; 6)', '(2; 12), (4; 9), (6; 6)', '(2, 12), (4, 9), (6, 6)')),
      ],
      answer: 'A',
      hint1: L(
        "Har bir ustunda x · y ni tekshiring.",
        'В каждом столбце проверьте x · y.',
        'Check x · y in every column.',
      ),
      hint2: L(
        "To'g'ri jadvalda har bir ko'paytma 36 ga teng.",
        'В правильной таблице каждое произведение равно 36.',
        'Every product in the correct table equals 36.',
      ),
      solution: L(
        "2 · 18 = 4 · 9 = 6 · 6 = 36.",
        '2 · 18 = 4 · 9 = 6 · 6 = 36.',
        '2 · 18 = 4 · 9 = 6 · 6 = 36.',
      ),
      solutionMath: { kind: 'equality', value: '2 · 18 = 4 · 9 = 6 · 6 = 36' },
    }),
    practiceTask({
      id: 'v2-p1-4',
      type: 'number',
      skill: 'scale',
      prompt: L(
        "(3; 16) juftlikda x qiymati 12 gacha oshdi. Yangi y ni toping.",
        'В паре (3; 16) значение x увеличили до 12. Найдите новое y.',
        'In the pair (3, 16), x is increased to 12. Find the new y.',
      ),
      visual: { kind: 'change', fromX: 3, toX: 12, fromY: 16, factor: 4 },
      answer: 4,
      hint1: L(
        "x to'rt marta oshdi. y bilan nima bo'lishi kerak?",
        'x увеличился в 4 раза. Что должно произойти с y?',
        'x was multiplied by 4. What must happen to y?',
      ),
      hint2: L(
        "16 ni 4 ga bo'ling.",
        'Разделите 16 на 4.',
        'Divide 16 by 4.',
      ),
      solution: L(
        "k = 48. Yangi y qirq sakkizni o'n ikkiga bo'lish orqali 4 ga teng.",
        'k = 48. Новое y равно сорока восьми, делённым на двенадцать, то есть 4.',
        'k = 48. The new y is forty-eight divided by twelve, which is 4.',
      ),
      solutionMath: { kind: 'quotient', left: 'y', numerator: 48, denominator: 12, result: 4 },
    }),
    practiceTask({
      id: 'v2-p1-5',
      type: 'mcq',
      skill: 'same-graph',
      prompt: L(
        "Qaysi nuqta (4; −6) nuqta bilan bir grafikda yotadi?",
        'Какая точка лежит на одном графике с точкой (4; −6)?',
        'Which point lies on the same graph as (4, −6)?',
      ),
      visual: { kind: 'point-to-k', point: [4, -6] },
      options: [
        choice(L('(−3; 8)', '(−3; 8)', '(−3, 8)')),
        choice(L('(−3; −8)', '(−3; −8)', '(−3, −8)')),
        choice(L('(6; −3)', '(6; −3)', '(6, −3)')),
      ],
      answer: 'A',
      hint1: L(
        "Berilgan nuqta bo'yicha k ni toping.",
        'Найдите k по известной точке.',
        'Find k from the known point.',
      ),
      hint2: L(
        "4 · (−6) = −24. Xuddi shu ko'paytmali nuqtani izlang.",
        '4 · (−6) = −24. Ищите точку с таким же произведением.',
        '4 · (−6) = −24. Look for the same product.',
      ),
      solution: L(
        "(−3) · 8 = −24, shuning uchun A nuqta shu grafikda.",
        '(−3) · 8 = −24, поэтому точка A лежит на том же графике.',
        '(−3) · 8 = −24, so point A lies on the same graph.',
      ),
      solutionMath: { kind: 'equality', value: '(−3) · 8 = −24' },
    }),
    practiceTask({
      id: 'v2-p1-6',
      type: 'number',
      skill: 'same-graph',
      prompt: L(
        "(4; 9) va (−6; y) nuqtalar bir giperbolada. y ni toping.",
        'Точки (4; 9) и (−6; y) лежат на одной гиперболе. Найдите y.',
        'Points (4, 9) and (−6, y) lie on one hyperbola. Find y.',
      ),
      visual: { kind: 'same-k', left: [4, 9], right: [-6, 'y'] },
      answer: -6,
      hint1: L(
        "Ikkala nuqtada ham k bir xil.",
        'У обеих точек одно и то же k.',
        'Both points have the same k.',
      ),
      hint2: L(
        "k = 36, demak (−6) · y = 36.",
        'k = 36, значит (−6) · y = 36.',
        'k = 36, so (−6) · y = 36.',
      ),
      solution: L(
        "y o'ttiz oltini minus oltiga bo'lish orqali minus 6 ga teng.",
        'y равно тридцати шести, делённым на минус шесть, то есть −6.',
        'y is thirty-six divided by negative six, which is −6.',
      ),
      solutionMath: { kind: 'quotient', left: 'y', numerator: 36, denominator: '−6', result: '−6' },
    }),
  ],
  [
    practiceTask({
      id: 'v2-p2-1',
      type: 'number',
      skill: 'calculation',
      prompt: L(
        "Ko'rsatilgan funksiyada x = −7 bo'lsa, y ni toping.",
        'Для показанной функции найдите y, если x = −7.',
        'For the function shown, find y when x = −7.',
      ),
      visual: { kind: 'formula', numerator: 42, denominator: 'x', note: 'x = −7' },
      answer: -6,
      hint1: L(
        "Avval ishorani aniqlang: musbat son manfiy songa bo'linadi.",
        'Сначала определите знак: положительное число делится на отрицательное.',
        'Determine the sign first: a positive number is divided by a negative one.',
      ),
      hint2: L(
        "y qirq ikkini minus yettiga bo'lishga teng.",
        'y равно сорока двум, делённым на минус семь.',
        'y is forty-two divided by negative seven.',
      ),
      solution: L(
        "Musbat sonni manfiy songa bo'lsak, y = −6.",
        'Положительное число делим на отрицательное и получаем y = −6.',
        'A positive divided by a negative gives y = −6.',
      ),
      solutionMath: { kind: 'quotient', left: 'y', numerator: 42, denominator: '−7', result: '−6' },
    }),
    practiceTask({
      id: 'v2-p2-2',
      type: 'mcq',
      skill: 'sign',
      prompt: L(
        "Ko'rsatilgan funksiyada x = −6 bo'lsa, y qanday ishorali?",
        'Какой знак имеет y в показанной функции при x = −6?',
        'What is the sign of y in the function shown when x = −6?',
      ),
      visual: { kind: 'formula', numerator: 24, denominator: 'x', negative: true, note: 'x = −6' },
      options: [
        choice(L('Musbat', 'Положительный', 'Positive')),
        choice(L('Manfiy', 'Отрицательный', 'Negative')),
        choice(L('Nol', 'Равен нулю', 'Zero')),
      ],
      answer: 'A',
      hint1: L(
        "Manfiy son manfiy songa bo'linmoqda.",
        'Отрицательное число делится на отрицательное.',
        'A negative number is divided by a negative number.',
      ),
      hint2: L(
        "k < 0 bo'lsa, x va y ishoralari qarama-qarshi.",
        'При k < 0 знаки x и y противоположны.',
        'When k < 0, x and y have opposite signs.',
      ),
      solution: L(
        "Ikki manfiy ishora musbat natija beradi: y = 4.",
        'Два отрицательных знака дают положительный результат: y = 4.',
        'Two negative signs give a positive result: y = 4.',
      ),
      solutionMath: { kind: 'quotient', left: 'y', numerator: 24, denominator: '−6', result: 4, negative: true },
    }),
    practiceTask({
      id: 'v2-p2-3',
      type: 'number',
      skill: 'calculation',
      prompt: L(
        "Ko'rsatilgan funksiyada y = 5. x ni toping.",
        'В показанной функции y = 5. Найдите x.',
        'In the function shown, y = 5. Find x.',
      ),
      visual: { kind: 'formula', numerator: 35, denominator: 'x', negative: true, note: 'y = 5' },
      answer: -7,
      hint1: L(
        "x · y = −35 tenglikdan foydalaning.",
        'Используйте равенство x · y = −35.',
        'Use the equation x · y = −35.',
      ),
      hint2: L(
        "x minus o'ttiz beshni beshga bo'lishga teng.",
        'x равен минус тридцати пяти, делённым на пять.',
        'x is negative thirty-five divided by five.',
      ),
      solution: L(
        "x = −7. Tekshiruv: (−7) · 5 = −35.",
        'x = −7. Проверка: (−7) · 5 = −35.',
        'x = −7. Check: (−7) · 5 = −35.',
      ),
      solutionMath: { kind: 'quotient', left: 'x', numerator: '−35', denominator: 5, result: '−7' },
    }),
    practiceTask({
      id: 'v2-p2-4',
      type: 'mcq',
      skill: 'sign',
      prompt: L(
        "k > 0 va x < 0. Nuqta qaysi chorakda joylashadi?",
        'k > 0 и x < 0. В какой четверти находится точка?',
        'k > 0 and x < 0. Which quadrant contains the point?',
      ),
      visual: { kind: 'sign-map', k: 1, x: -1 },
      options: [
        choice(L('I chorak', 'I четверть', 'Quadrant I')),
        choice(L('II chorak', 'II четверть', 'Quadrant II')),
        choice(L('III chorak', 'III четверть', 'Quadrant III')),
        choice(L('IV chorak', 'IV четверть', 'Quadrant IV')),
      ],
      answer: 'C',
      hint1: L(
        "Musbat ko'paytmada x va y ishoralari bir xil.",
        'При положительном произведении знаки x и y одинаковы.',
        'A positive product requires x and y to have the same sign.',
      ),
      hint2: L(
        "x < 0 bo'lsa, y ham manfiy.",
        'Если x < 0, то y тоже отрицателен.',
        'If x < 0, then y is also negative.',
      ),
      solution: L(
        "Ikkala koordinata manfiy, demak nuqta III chorakda.",
        'Обе координаты отрицательны, значит точка находится в III четверти.',
        'Both coordinates are negative, so the point is in quadrant III.',
      ),
      solutionMath: { kind: 'equality', value: 'x < 0, y < 0  →  III' },
    }),
    practiceTask({
      id: 'v2-p2-5',
      type: 'mcq',
      skill: 'domain',
      prompt: L(
        "O'quvchi ko'rsatilgan kasrni 0 ga teng deb yozdi. To'g'ri tuzatishni tanlang.",
        'Ученик записал, что показанная дробь равна 0. Выберите исправление.',
        'A student wrote that the fraction shown equals 0. Choose the correction.',
      ),
      visual: { kind: 'undefined-fraction', numerator: 10 },
      options: [
        choice(L("Natija 0", 'Результат равен 0', 'The result is 0')),
        choice(L("Ifoda aniqlanmagan", 'Выражение не определено', 'The expression is undefined')),
        choice(L("Natija 10", 'Результат равен 10', 'The result is 10')),
      ],
      answer: 'B',
      hint1: L(
        "Kasrning maxrajiga qarang.",
        'Посмотрите на знаменатель дроби.',
        'Look at the denominator.',
      ),
      hint2: L(
        "Agar natija y bo'lsa, 0 · y = 10 bo'lishi kerak edi. Bu mumkin emas.",
        'Если бы результатом было y, пришлось бы получить 0 · y = 10. Это невозможно.',
        'If the result were y, then 0 · y would have to equal 10. That is impossible.',
      ),
      solution: L(
        "Nolga bo'lish aniqlanmagan. Shuning uchun x ≠ 0.",
        'Деление на ноль не определено. Поэтому x ≠ 0.',
        'Division by zero is undefined. Therefore x ≠ 0.',
      ),
      solutionMath: { kind: 'restriction', items: ['x ≠ 0'] },
    }),
    practiceTask({
      id: 'v2-p2-6',
      type: 'mcq',
      skill: 'range',
      prompt: L(
        "Ko'rsatilgan funksiyada y ning qaysi qiymati mumkin emas?",
        'Какое значение y невозможно для показанной функции?',
        'Which value of y is impossible for the function shown?',
      ),
      visual: { kind: 'formula', numerator: 12, denominator: 'x', negative: true },
      options: [
        choice(L('−3', '−3', '−3')),
        choice(L('0', '0', '0')),
        choice(L('4', '4', '4')),
      ],
      answer: 'B',
      hint1: L(
        "Giperbola x o'qini kesmaydi.",
        'Гипербола не пересекает ось x.',
        'A hyperbola does not cross the x-axis.',
      ),
      hint2: L(
        "y = 0 bo'lsa, x · y = 0 bo'ladi, ammo k = −12.",
        'Если y = 0, то x · y = 0, но k = −12.',
        'If y = 0, then x · y = 0, but k = −12.',
      ),
      solution: L(
        "k ≠ 0 bo'lgani uchun y ham nolga teng bo'la olmaydi.",
        'Поскольку k ≠ 0, значение y также не может быть равно нулю.',
        'Because k ≠ 0, y cannot be zero either.',
      ),
      solutionMath: { kind: 'restriction', items: ['k ≠ 0', 'y ≠ 0'] },
    }),
  ],
  [
    practiceTask({
      id: 'v2-p3-1',
      type: 'graph',
      skill: 'graph',
      prompt: L(
        "Ko'rsatilgan funksiya uchun to'g'ri grafikni tanlang.",
        'Выберите правильный график показанной функции.',
        'Choose the correct graph for the function shown.',
      ),
      visual: { kind: 'formula', numerator: 12, denominator: 'x' },
      options: [
        choice(L('I va III choraklar', 'I и III четверти', 'Quadrants I and III'), { kind: 'mini-graph', variant: 'positive' }),
        choice(L('II va IV choraklar', 'II и IV четверти', 'Quadrants II and IV'), { kind: 'mini-graph', variant: 'negative' }),
        choice(L("O'qlarni kesib o'tadi", 'Пересекает оси', 'Crosses the axes'), { kind: 'mini-graph', variant: 'crossing' }),
      ],
      answer: 'A',
      hint1: L(
        "k ning ishorasini aniqlang.",
        'Определите знак k.',
        'Determine the sign of k.',
      ),
      hint2: L(
        "k > 0 bo'lsa, koordinatalar bir xil ishorali.",
        'При k > 0 координаты имеют одинаковые знаки.',
        'When k > 0, the coordinates have the same sign.',
      ),
      solution: L(
        "12 musbat, shuning uchun shoxlar I va III choraklarda.",
        '12 положительно, поэтому ветви находятся в I и III четвертях.',
        '12 is positive, so the branches lie in quadrants I and III.',
      ),
      solutionMath: { kind: 'equality', value: 'k > 0  →  I, III' },
    }),
    practiceTask({
      id: 'v2-p3-2',
      type: 'graph',
      skill: 'graph',
      prompt: L(
        "Manfiy koeffitsiyentli funksiya uchun to'g'ri grafikni tanlang.",
        'Выберите правильный график функции с отрицательным коэффициентом.',
        'Choose the correct graph for the function with a negative coefficient.',
      ),
      visual: { kind: 'formula', numerator: 12, denominator: 'x', negative: true },
      options: [
        choice(L('I va III, (3; 4)', 'I и III, (3; 4)', 'I and III, (3, 4)'), { kind: 'mini-graph', variant: 'positive' }),
        choice(L('II va IV, (3; −4)', 'II и IV, (3; −4)', 'II and IV, (3, −4)'), { kind: 'mini-graph', variant: 'negative' }),
        choice(L('II va IV, (2; −3)', 'II и IV, (2; −3)', 'II and IV, (2, −3)'), { kind: 'mini-graph', variant: 'negative-small' }),
      ],
      answer: 'B',
      hint1: L(
        "Faqat choraklar yetarli emas. Bitta nuqtani ham tekshiring.",
        'Одних четвертей недостаточно. Проверьте также одну точку.',
        'Quadrants alone are not enough. Check one point too.',
      ),
      hint2: L(
        "To'g'ri nuqta uchun x · y = −12.",
        'Для правильной точки x · y = −12.',
        'The correct point must satisfy x · y = −12.',
      ),
      solution: L(
        "3 · (−4) = −12. To'g'ri grafik II va IV choraklarda.",
        '3 · (−4) = −12. Правильный график расположен во II и IV четвертях.',
        '3 · (−4) = −12. The correct graph lies in quadrants II and IV.',
      ),
      solutionMath: { kind: 'equality', value: '3 · (−4) = −12' },
    }),
    practiceTask({
      id: 'v2-p3-3',
      type: 'graph',
      skill: 'point',
      prompt: L(
        "x = 3 bo'lgan P nuqtaning to'g'ri joyini tanlang.",
        'Выберите правильное положение точки P, если x = 3.',
        'Choose the correct position of point P when x = 3.',
      ),
      visual: { kind: 'graph-main', k: 12, guideX: 3 },
      options: [
        choice(L('P(3; 4)', 'P(3; 4)', 'P(3, 4)')),
        choice(L('P(3; −4)', 'P(3; −4)', 'P(3, −4)')),
        choice(L('P(4; 3)', 'P(4; 3)', 'P(4, 3)')),
      ],
      answer: 'A',
      hint1: L(
        "Birinchi koordinata 3 bo'lib qolishi kerak.",
        'Первая координата должна оставаться равной 3.',
        'The first coordinate must remain 3.',
      ),
      hint2: L(
        "y o'n ikkini uchga bo'lish orqali 4 ga teng.",
        'y равно двенадцати, делённым на три, то есть 4.',
        'y is twelve divided by three, which is 4.',
      ),
      solution: L(
        "P(3; 4), chunki 3 · 4 = 12.",
        'P(3; 4), потому что 3 · 4 = 12.',
        'P(3, 4), because 3 · 4 = 12.',
      ),
      solutionMath: { kind: 'equality', value: '3 · 4 = 12' },
    }),
    practiceTask({
      id: 'v2-p3-4',
      type: 'graph',
      skill: 'point',
      prompt: L(
        "Qaysi belgilangan nuqta ko'rsatilgan grafikda yotadi?",
        'Какая отмеченная точка лежит на показанном графике?',
        'Which marked point lies on the graph shown?',
      ),
      visual: { kind: 'formula', numerator: 8, denominator: 'x', negative: true },
      options: [
        choice(L('A: (−4; 2)', 'A: (−4; 2)', 'A: (−4, 2)')),
        choice(L('B: (−2; −4)', 'B: (−2; −4)', 'B: (−2, −4)')),
        choice(L('C: (4; 3)', 'C: (4; 3)', 'C: (4, 3)')),
      ],
      answer: 'A',
      hint1: L(
        "Tanlangan nuqta koordinatalarini ko'paytiring.",
        'Умножьте координаты выбранной точки.',
        'Multiply the coordinates of the selected point.',
      ),
      hint2: L(
        "Ko'paytma −8 bo'lishi kerak.",
        'Произведение должно быть равно −8.',
        'The product must equal −8.',
      ),
      solution: L(
        "(−4) · 2 = −8, demak A nuqta grafikda.",
        '(−4) · 2 = −8, значит точка A лежит на графике.',
        '(−4) · 2 = −8, so point A lies on the graph.',
      ),
      solutionMath: { kind: 'equality', value: '(−4) · 2 = −8' },
    }),
    practiceTask({
      id: 'v2-p3-5',
      type: 'graph',
      skill: 'asymptote',
      prompt: L(
        "Grafikdagi xatoni toping: qaysi joy bo'lishi mumkin emas?",
        'Найдите ошибку на графике: какого места быть не может?',
        'Find the graph error: which location is impossible?',
      ),
      visual: { kind: 'graph-error', k: 8 },
      options: [
        choice(L("y o'qidagi (0; 5) nuqta", 'Точка (0; 5) на оси y', 'Point (0, 5) on the y-axis')),
        choice(L('I chorakdagi shox', 'Ветвь в I четверти', 'The branch in quadrant I')),
        choice(L('III chorakdagi shox', 'Ветвь в III четверти', 'The branch in quadrant III')),
      ],
      answer: 'A',
      hint1: L(
        "Qaysi x qiymati taqiqlanganini eslang.",
        'Вспомните, какое значение x запрещено.',
        'Recall which x-value is forbidden.',
      ),
      hint2: L(
        "Vertikal o'qda x = 0.",
        'На вертикальной оси x = 0.',
        'On the vertical axis, x = 0.',
      ),
      solution: L(
        "x = 0 da kasr aniqlanmagan. Grafik y o'qini kesmaydi.",
        'При x = 0 дробь не определена. График не пересекает ось y.',
        'At x = 0 the fraction is undefined. The graph does not cross the y-axis.',
      ),
      solutionMath: { kind: 'restriction', items: ['x ≠ 0', 'y ≠ 0'] },
    }),
    practiceTask({
      id: 'v2-p3-6',
      type: 'graph',
      skill: 'quadrants',
      prompt: L(
        "k < 0 bo'lsa, shoxlar qaysi juft choraklarda bo'ladi?",
        'Если k < 0, в какой паре четвертей находятся ветви?',
        'When k < 0, which pair of quadrants contains the branches?',
      ),
      visual: { kind: 'sign-product', negative: true },
      options: [
        choice(L('I va III', 'I и III', 'I and III'), { kind: 'mini-graph', variant: 'positive' }),
        choice(L('II va IV', 'II и IV', 'II and IV'), { kind: 'mini-graph', variant: 'negative' }),
        choice(L('I va II', 'I и II', 'I and II'), { kind: 'mini-graph', variant: 'top' }),
      ],
      answer: 'B',
      hint1: L(
        "Manfiy ko'paytmada koordinatalar turli ishorali.",
        'При отрицательном произведении координаты имеют разные знаки.',
        'A negative product requires coordinates with opposite signs.',
      ),
      hint2: L(
        "(−; +) — II chorak, (+; −) — IV chorak.",
        '(−; +) — II четверть, (+; −) — IV четверть.',
        '(−, +) is quadrant II and (+, −) is quadrant IV.',
      ),
      solution: L(
        "k < 0 bo'lsa, shoxlar II va IV choraklarda.",
        'При k < 0 ветви находятся во II и IV четвертях.',
        'When k < 0, the branches lie in quadrants II and IV.',
      ),
      solutionMath: { kind: 'equality', value: 'k < 0  →  II, IV' },
    }),
  ],
  [
    practiceTask({
      id: 'v2-p4-1',
      type: 'number',
      skill: 'model',
      prompt: L(
        "Grafik (3; 8) nuqtadan o'tadi. k ni toping.",
        'График проходит через точку (3; 8). Найдите k.',
        'The graph passes through (3, 8). Find k.',
      ),
      visual: { kind: 'point-to-k', point: [3, 8], scaffold: 'k = x · y' },
      answer: 24,
      hint1: L(
        "x = 3 va y = 8 ni ko'paytiring.",
        'Перемножьте x = 3 и y = 8.',
        'Multiply x = 3 and y = 8.',
      ),
      hint2: L('k = 3 · 8.', 'k = 3 · 8.', 'k = 3 · 8.'),
      solution: L(
        "k = 24. To'liq modelda surat 24, maxraj x.",
        'k = 24. В полной модели в числителе 24, в знаменателе x.',
        'k = 24. The complete model has 24 in the numerator and x in the denominator.',
      ),
      solutionMath: { kind: 'formula', numerator: 24, denominator: 'x', restrictions: true },
    }),
    practiceTask({
      id: 'v2-p4-2',
      type: 'mcq',
      skill: 'model',
      prompt: L(
        "Grafik (−4; 3) nuqtadan o'tadi. To'g'ri formulani tanlang.",
        'График проходит через точку (−4; 3). Выберите правильную формулу.',
        'The graph passes through (−4, 3). Choose the correct formula.',
      ),
      visual: { kind: 'point-to-k', point: [-4, 3], scaffold: 'k = (−4) · 3' },
      options: [
        choice(L('k = 12', 'k = 12', 'k = 12'), { kind: 'formula', numerator: 12, denominator: 'x' }),
        choice(L('k = −12, x ≠ 0', 'k = −12, x ≠ 0', 'k = −12, x ≠ 0'), { kind: 'formula', numerator: 12, denominator: 'x', negative: true }),
        choice(L('k = −12, x = 0 mumkin', 'k = −12, x = 0 разрешён', 'k = −12, x = 0 allowed'), { kind: 'formula', numerator: 12, denominator: 'x', negative: true }),
      ],
      answer: 'B',
      hint1: L(
        "Koordinatalar ko'paytmasining ishorasini aniqlang.",
        'Определите знак произведения координат.',
        'Determine the sign of the coordinate product.',
      ),
      hint2: L(
        "(−4) · 3 = −12 va maxraj nol bo'la olmaydi.",
        '(−4) · 3 = −12, а знаменатель не может быть нулём.',
        '(−4) · 3 = −12, and the denominator cannot be zero.',
      ),
      solution: L(
        "k = −12, formula suratida minus 12, maxrajida x; x ≠ 0.",
        'k = −12: в числителе формулы минус 12, в знаменателе x; x ≠ 0.',
        'k = −12: the numerator is negative 12, the denominator is x; x ≠ 0.',
      ),
      solutionMath: { kind: 'formula', numerator: 12, denominator: 'x', negative: true, restrictions: true },
    }),
    practiceTask({
      id: 'v2-p4-3',
      type: 'mcq',
      skill: 'passport',
      prompt: L(
        "(5; −2) nuqta orqali o'tuvchi grafikning to'liq pasportini tanlang.",
        'Выберите полный паспорт графика, проходящего через точку (5; −2).',
        'Choose the full passport of the graph through (5, −2).',
      ),
      visual: { kind: 'point-to-k', point: [5, -2], scaffold: 'x · y = k' },
      options: [
        choice(L('k = −10; II va IV', 'k = −10; II и IV', 'k = −10; II and IV'), { kind: 'formula', numerator: 10, denominator: 'x', negative: true }),
        choice(L('k = 10; I va III', 'k = 10; I и III', 'k = 10; I and III'), { kind: 'formula', numerator: 10, denominator: 'x' }),
        choice(L('k = −10; I va III', 'k = −10; I и III', 'k = −10; I and III'), { kind: 'formula', numerator: 10, denominator: 'x', negative: true }),
      ],
      answer: 'A',
      hint1: L(
        "5 · (−2) ko'paytma manfiy.",
        'Произведение 5 · (−2) отрицательно.',
        'The product 5 · (−2) is negative.',
      ),
      hint2: L(
        "k < 0 bo'lsa, shoxlar II va IV choraklarda.",
        'При k < 0 ветви находятся во II и IV четвертях.',
        'When k < 0, the branches lie in quadrants II and IV.',
      ),
      solution: L(
        "k = −10, x ≠ 0; grafik II va IV choraklarda.",
        'k = −10, x ≠ 0; график находится во II и IV четвертях.',
        'k = −10, x ≠ 0; the graph lies in quadrants II and IV.',
      ),
      solutionMath: { kind: 'passport', k: '−10', negative: true, quadrants: 'II, IV' },
    }),
    practiceTask({
      id: 'v2-p4-4',
      type: 'mcq',
      skill: 'same-graph',
      prompt: L(
        "Giperbola (−3; −6) nuqtadan o'tadi. Yana qaysi nuqta unga tegishli?",
        'Гипербола проходит через (−3; −6). Какая ещё точка ей принадлежит?',
        'The hyperbola passes through (−3, −6). Which other point belongs to it?',
      ),
      visual: { kind: 'point-to-k', point: [-3, -6] },
      options: [
        choice(L('(2; 9)', '(2; 9)', '(2, 9)')),
        choice(L('(−2; 9)', '(−2; 9)', '(−2, 9)')),
        choice(L('(3; 5)', '(3; 5)', '(3, 5)')),
      ],
      answer: 'A',
      hint1: L(
        "Bir grafikdagi nuqtalarda ko'paytma bir xil.",
        'У точек одного графика одинаковое произведение.',
        'Points on one graph have the same product.',
      ),
      hint2: L(
        "(−3) · (−6) = 18.",
        '(−3) · (−6) = 18.',
        '(−3) · (−6) = 18.',
      ),
      solution: L(
        "2 · 9 = 18, demak (2; 9) shu grafikda.",
        '2 · 9 = 18, значит точка (2; 9) лежит на этом графике.',
        '2 · 9 = 18, so (2, 9) lies on the graph.',
      ),
      solutionMath: { kind: 'equality', value: '(−3) · (−6) = 2 · 9 = 18' },
    }),
    practiceTask({
      id: 'v2-p4-5',
      type: 'number',
      skill: 'model',
      prompt: L(
        "Giperbola (6; −4) nuqtadan o'tadi. x = −8 bo'lsa, y ni toping.",
        'Гипербола проходит через (6; −4). Найдите y при x = −8.',
        'The hyperbola passes through (6, −4). Find y when x = −8.',
      ),
      visual: { kind: 'two-stage-point', known: [6, -4], targetX: -8 },
      answer: 3,
      hint1: L(
        "Avval ma'lum nuqta orqali k ni tiklang.",
        'Сначала восстановите k по известной точке.',
        'First recover k from the known point.',
      ),
      hint2: L(
        "k = 6 · (−4) = −24. Endi y ni toping.",
        'k = 6 · (−4) = −24. Теперь найдите y.',
        'k = 6 · (−4) = −24. Now find y.',
      ),
      solution: L(
        "y minus yigirma to'rtni minus sakkizga bo'lish orqali 3 ga teng.",
        'y равно минус двадцати четырём, делённым на минус восемь, то есть 3.',
        'y is negative twenty-four divided by negative eight, which is 3.',
      ),
      solutionMath: { kind: 'quotient', left: 'y', numerator: '−24', denominator: '−8', result: 3 },
    }),
    practiceTask({
      id: 'v2-p4-6',
      type: 'mcq',
      skill: 'passport',
      prompt: L(
        "(−2; 7) nuqtadan modelni tiklang va y = −2 bo'lgandagi x ni tanlang.",
        'Восстановите модель по точке (−2; 7) и выберите x при y = −2.',
        'Recover the model from (−2, 7) and choose x when y = −2.',
      ),
      visual: { kind: 'point-to-model', point: [-2, 7], targetY: -2 },
      options: [
        choice(L('k = −14; II va IV; x = 7', 'k = −14; II и IV; x = 7', 'k = −14; II and IV; x = 7'), { kind: 'formula', numerator: 14, denominator: 'x', negative: true }),
        choice(L('k = 14; I va III; x = −7', 'k = 14; I и III; x = −7', 'k = 14; I and III; x = −7'), { kind: 'formula', numerator: 14, denominator: 'x' }),
        choice(L('k = −14; II va IV; x = −7', 'k = −14; II и IV; x = −7', 'k = −14; II and IV; x = −7'), { kind: 'formula', numerator: 14, denominator: 'x', negative: true }),
      ],
      answer: 'A',
      hint1: L(
        "Bitta invariant boshlang'ich va yangi nuqtani bog'laydi.",
        'Один инвариант связывает исходную и новую точки.',
        'One invariant connects the original and new points.',
      ),
      hint2: L(
        "k = (−2) · 7 = −14; x minus o'n to'rtni minus ikkiga bo'lishga teng.",
        'k = (−2) · 7 = −14; x равен минус четырнадцати, делённым на минус два.',
        'k = (−2) · 7 = −14; x is negative fourteen divided by negative two.',
      ),
      solution: L(
        "k = −14, shoxlar II va IV choraklarda; y = −2 bo'lsa, x = 7.",
        'k = −14, ветви во II и IV четвертях; при y = −2 получаем x = 7.',
        'k = −14, branches lie in II and IV; when y = −2, x = 7.',
      ),
      solutionMath: { kind: 'passport', k: '−14', negative: true, quadrants: 'II, IV', extra: 'y = −2  →  x = 7' },
    }),
  ],
  [
    practiceTask({
      id: 'v2-p5-1',
      type: 'context',
      skill: 'transfer',
      prompt: L(
        "To'g'ri to'rtburchak yuzi 72 m², eni 8 m. Bo'yini toping.",
        'Площадь прямоугольника 72 м², ширина 8 м. Найдите длину.',
        'A rectangle has area 72 m² and width 8 m. Find its length.',
      ),
      visual: { kind: 'context', context: 'area', fixed: '72 m²', change: '8 m × ?' },
      options: [
        choice(L("Yuza: 8 · l = 72", 'Площадь: 8 · l = 72', 'Area: 8 · l = 72')),
        choice(L("Perimetr: 8 + l = 72", 'Периметр: 8 + l = 72', 'Perimeter: 8 + l = 72')),
        choice(L("Farq: l − 8 = 72", 'Разность: l − 8 = 72', 'Difference: l − 8 = 72')),
      ],
      answer: { choice: 'A', value: 9 },
      unit: L('m', 'м', 'm'),
      hint1: L(
        "Yuza en va bo'y ko'paytmasiga teng.",
        'Площадь равна произведению ширины и длины.',
        'Area equals width times length.',
      ),
      hint2: L(
        "l yetmish ikkini sakkizga bo'lishga teng.",
        'l равно семидесяти двум, делённым на восемь.',
        'l is seventy-two divided by eight.',
      ),
      solution: L(
        "Bo'yi 9 metr. Tekshiruv: 8 m · 9 m = 72 m².",
        'Длина равна 9 метрам. Проверка: 8 м · 9 м = 72 м².',
        'The length is 9 metres. Check: 8 m · 9 m = 72 m².',
      ),
      solutionMath: { kind: 'quotient', left: 'l', numerator: 72, denominator: 8, result: 9, unit: L('m', 'м', 'm') },
    }),
    practiceTask({
      id: 'v2-p5-2',
      type: 'context',
      skill: 'transfer',
      prompt: L(
        "Avtomobil 210 km yo'lni 70 km/soat tezlikda bosadi. Vaqtni toping.",
        'Автомобиль проходит 210 км со скоростью 70 км/ч. Найдите время.',
        'A car travels 210 km at 70 km/h. Find the time.',
      ),
      visual: { kind: 'context', context: 'road', fixed: '210 km', change: '70 km/h × t' },
      options: [
        choice(L("Masofa: 70 · t = 210", 'Расстояние: 70 · t = 210', 'Distance: 70 · t = 210')),
        choice(L("Yig'indi: 70 + t = 210", 'Сумма: 70 + t = 210', 'Sum: 70 + t = 210')),
        choice(L("Farq: 210 − t = 70", 'Разность: 210 − t = 70', 'Difference: 210 − t = 70')),
      ],
      answer: { choice: 'A', value: 3 },
      unit: L('soat', 'ч', 'h'),
      hint1: L(
        "O'zgarmas kattalik — 210 km masofa.",
        'Постоянная величина — расстояние 210 км.',
        'The fixed quantity is the 210 km distance.',
      ),
      hint2: L(
        "t ikki yuz o'nni yetmishga bo'lishga teng.",
        't равно двумстам десяти, делённым на семьдесят.',
        't is two hundred ten divided by seventy.',
      ),
      solution: L(
        "Yo'l 3 soat davom etadi.",
        'Путь займёт 3 часа.',
        'The journey takes 3 hours.',
      ),
      solutionMath: { kind: 'quotient', left: 't', numerator: 210, denominator: 70, result: 3, unit: L('soat', 'ч', 'h') },
    }),
    practiceTask({
      id: 'v2-p5-3',
      type: 'context',
      skill: 'transfer',
      prompt: L(
        "8 ishchi ishni 15 kunda tugatadi. Bir xil unumdorlikda 12 ishchi necha kunda tugatadi?",
        '8 работников выполняют работу за 15 дней. За сколько дней справятся 12 работников при одинаковой производительности?',
        '8 workers finish a job in 15 days. How many days for 12 equally productive workers?',
      ),
      visual: { kind: 'context', context: 'workers', fixed: '8 · 15 = 120', change: '12 × t' },
      options: [
        choice(L("Ish hajmi: 12 · t = 120", 'Объём работы: 12 · t = 120', 'Work: 12 · t = 120')),
        choice(L("Ishchilar soni: 12 + t = 120", 'Число работников: 12 + t = 120', 'Workers: 12 + t = 120')),
        choice(L("Vaqt: 12 − t = 15", 'Время: 12 − t = 15', 'Time: 12 − t = 15')),
      ],
      answer: { choice: 'A', value: 10 },
      unit: L('kun', 'дней', 'days'),
      hint1: L(
        "Ish hajmi o'zgarmaydi, ishchilarning unumdorligi bir xil.",
        'Объём работы неизменен, производительность работников одинакова.',
        'The amount of work is fixed and all workers are equally productive.',
      ),
      hint2: L(
        "8 · 15 = 120 ishchi-kun; t yuz yigirmani o'n ikkiga bo'lishga teng.",
        '8 · 15 = 120 человеко-дней; t равно ста двадцати, делённым на двенадцать.',
        '8 · 15 = 120 worker-days; t is one hundred twenty divided by twelve.',
      ),
      solution: L(
        "12 ishchi ishni 10 kunda tugatadi.",
        '12 работников выполнят работу за 10 дней.',
        '12 workers finish the job in 10 days.',
      ),
      solutionMath: { kind: 'quotient', left: 't', numerator: 120, denominator: 12, result: 10, unit: L('kun', 'дней', 'days') },
    }),
    practiceTask({
      id: 'v2-p5-4',
      type: 'context',
      skill: 'transfer',
      prompt: L(
        "3 ta bir xil kran idishni 8 soatda to'ldiradi. 6 ta kran necha soatda to'ldiradi?",
        '3 одинаковых крана наполняют резервуар за 8 часов. За сколько часов справятся 6 кранов?',
        '3 identical taps fill a tank in 8 hours. How long will 6 taps take?',
      ),
      visual: { kind: 'context', context: 'taps', fixed: '3 · 8 = 24', change: '6 × t' },
      options: [
        choice(L("Kran-soat: 6 · t = 24", 'Крано-часы: 6 · t = 24', 'Tap-hours: 6 · t = 24')),
        choice(L("Kranlar soni: 6 + t = 24", 'Число кранов: 6 + t = 24', 'Taps: 6 + t = 24')),
        choice(L("Vaqt: 8 + t = 24", 'Время: 8 + t = 24', 'Time: 8 + t = 24')),
      ],
      answer: { choice: 'A', value: 4 },
      unit: L('soat', 'ч', 'h'),
      hint1: L(
        "Idish hajmi va har bir kranning tezligi o'zgarmaydi.",
        'Объём резервуара и скорость каждого крана неизменны.',
        'The tank volume and each tap rate stay fixed.',
      ),
      hint2: L(
        "3 · 8 = 24 kran-soat; t yigirma to'rtni oltiga bo'lishga teng.",
        '3 · 8 = 24 крано-часа; t равно двадцати четырём, делённым на шесть.',
        '3 · 8 = 24 tap-hours; t is twenty-four divided by six.',
      ),
      solution: L(
        "6 ta kran idishni 4 soatda to'ldiradi.",
        '6 кранов наполнят резервуар за 4 часа.',
        '6 taps fill the tank in 4 hours.',
      ),
      solutionMath: { kind: 'quotient', left: 't', numerator: 24, denominator: 6, result: 4, unit: L('soat', 'ч', 'h') },
    }),
    practiceTask({
      id: 'v2-p5-5',
      type: 'context',
      skill: 'transfer',
      prompt: L(
        "Budjet 180 000 so'm. Bir buyum 30 000 so'm turadi. Nechta buyum olish mumkin?",
        'Бюджет — 180 000 сумов. Один предмет стоит 30 000 сумов. Сколько предметов можно купить?',
        'The budget is 180,000 soums. One item costs 30,000 soums. How many items can be bought?',
      ),
      visual: { kind: 'context', context: 'budget', fixed: '180 000', change: '30 000 × q' },
      options: [
        choice(L("Budjet: 30 000 · q = 180 000", 'Бюджет: 30 000 · q = 180 000', 'Budget: 30,000 · q = 180,000')),
        choice(L("Narx: 30 000 + q = 180 000", 'Цена: 30 000 + q = 180 000', 'Price: 30,000 + q = 180,000')),
        choice(L("Soni: q − 30 000 = 180 000", 'Количество: q − 30 000 = 180 000', 'Quantity: q − 30,000 = 180,000')),
      ],
      answer: { choice: 'A', value: 6 },
      unit: L('ta', 'шт.', 'items'),
      hint1: L(
        "Umumiy xarajat narx va son ko'paytmasiga teng.",
        'Общая стоимость равна произведению цены и количества.',
        'Total cost equals price times quantity.',
      ),
      hint2: L(
        "q bir yuz sakson mingni o'ttiz mingga bo'lishga teng.",
        'q равно ста восьмидесяти тысячам, делённым на тридцать тысяч.',
        'q is one hundred eighty thousand divided by thirty thousand.',
      ),
      solution: L(
        "Budjetga 6 ta buyum olish mumkin.",
        'На этот бюджет можно купить 6 предметов.',
        'The budget buys 6 items.',
      ),
      solutionMath: { kind: 'quotient', left: 'q', numerator: '180 000', denominator: '30 000', result: 6, unit: L('ta', 'шт.', 'items') },
    }),
    practiceTask({
      id: 'v2-p5-6',
      type: 'context',
      skill: 'non-example',
      prompt: L(
        "Taksi: qo'nish 6000 so'm va har kilometr 2500 so'm. 4 km narxini toping.",
        'Такси: посадка 6000 сумов и 2500 сумов за километр. Найдите стоимость 4 км.',
        'Taxi: 6,000 soums to start and 2,500 soums per kilometre. Find the cost of 4 km.',
      ),
      visual: { kind: 'context', context: 'taxi', fixed: '6000 + 2500 · d', change: 'd = 4' },
      options: [
        choice(L("Teskari: C · d = k", 'Обратная: C · d = k', 'Inverse: C · d = k')),
        choice(L("To'g'ri: C = 2500 · d", 'Прямая: C = 2500 · d', 'Direct: C = 2500 · d')),
        choice(L("Teskari emas: C = 6000 + 2500 · d", 'Не обратная: C = 6000 + 2500 · d', 'Not inverse: C = 6000 + 2500 · d')),
      ],
      answer: { choice: 'C', value: 16000 },
      unit: L("so'm", 'сумов', 'soums'),
      hint1: L(
        "Masofa oshganda narx ham oshadi; qo'nish puli yo'qolmaydi.",
        'При увеличении расстояния стоимость тоже растёт; плата за посадку не исчезает.',
        'As distance grows, cost also grows; the start fee remains.',
      ),
      hint2: L(
        "C = 6000 + 2500 · 4.",
        'C = 6000 + 2500 · 4.',
        'C = 6000 + 2500 · 4.',
      ),
      solution: L(
        "Bu teskari proporsionallik emas. Safar narxi 16 000 so'm.",
        'Это не обратная пропорциональность. Поездка стоит 16 000 сумов.',
        'This is not inverse proportion. The trip costs 16,000 soums.',
      ),
      solutionMath: { kind: 'equality', value: 'C = 6000 + 2500 · 4 = 16 000' },
    }),
  ],
]

function SpeakerIcon({ muted, playing }) {
  if (muted) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M11 5 6 9H3v6h3l5 4Z" />
        <path d="m16 9 5 5M21 9l-5 5" />
      </svg>
    )
  }
  return (
    <svg className={playing ? 'speaker-live' : ''} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M11 5 6 9H3v6h3l5 4Z" />
      <path d="M15 9.5a4 4 0 0 1 0 5M18 7a7 7 0 0 1 0 10" />
    </svg>
  )
}

function useNarration(rawSegments, lang) {
  const segments = useMemo(
    () => rawSegments.map((segment) => String(textOf(segment, lang))),
    [rawSegments, lang],
  )
  const [muted, setMuted] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [phase, setPhase] = useState(0)
  const [replayToken, setReplayToken] = useState(0)
  const oneOffRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    let timer = null
    let utterance = null
    const synth = typeof window !== 'undefined' ? window.speechSynthesis : null
    const Utterance = typeof window !== 'undefined' ? window.SpeechSynthesisUtterance : null

    if (synth) synth.cancel()
    if (!segments.length) return undefined

    const run = (index) => {
      if (cancelled || index >= segments.length) {
        if (!cancelled) setPlaying(false)
        return
      }
      setPhase(index)
      const value = segments[index]
      const fallbackMs = Math.min(5200, Math.max(1500, value.split(/\s+/).length * 115))
      if (muted) {
        setPlaying(false)
        timer = window.setTimeout(() => run(index + 1), fallbackMs + 180)
        return
      }
      const next = () => {
        if (cancelled) return
        setPlaying(false)
        timer = window.setTimeout(() => run(index + 1), 180)
      }
      if (!synth || !Utterance) {
        setPlaying(true)
        timer = window.setTimeout(next, fallbackMs)
        return
      }
      utterance = new Utterance(value)
      utterance.lang = lang === 'ru' ? 'ru-RU' : lang === 'en' ? 'en-GB' : 'uz-UZ'
      utterance.rate = 0.94
      utterance.pitch = 1
      utterance.onstart = () => !cancelled && setPlaying(true)
      utterance.onend = next
      utterance.onerror = next
      try {
        synth.speak(utterance)
      } catch {
        timer = window.setTimeout(next, fallbackMs)
      }
    }

    timer = window.setTimeout(() => run(0), 320)
    return () => {
      cancelled = true
      if (timer) window.clearTimeout(timer)
      if (utterance) {
        utterance.onstart = null
        utterance.onend = null
        utterance.onerror = null
      }
      if (synth) synth.cancel()
    }
  }, [lang, muted, replayToken, segments])

  const replay = useCallback(() => {
    setMuted(false)
    setReplayToken((value) => value + 1)
  }, [])

  const toggleMute = useCallback(() => {
    setMuted((value) => {
      const next = !value
      if (next) {
        setPlaying(false)
        if (typeof window !== 'undefined') window.speechSynthesis?.cancel()
      }
      return next
    })
  }, [])

  const pushOneOff = useCallback((rawText) => {
    if (muted || typeof window === 'undefined') return
    const synth = window.speechSynthesis
    const Utterance = window.SpeechSynthesisUtterance
    if (!synth || !Utterance) return
    if (oneOffRef.current) {
      oneOffRef.current.onend = null
      oneOffRef.current.onerror = null
    }
    synth.cancel()
    const utterance = new Utterance(String(textOf(rawText, lang)))
    utterance.lang = lang === 'ru' ? 'ru-RU' : lang === 'en' ? 'en-GB' : 'uz-UZ'
    utterance.rate = 0.95
    utterance.onstart = () => setPlaying(true)
    utterance.onend = () => setPlaying(false)
    utterance.onerror = () => setPlaying(false)
    oneOffRef.current = utterance
    synth.speak(utterance)
  }, [lang, muted])

  return { muted, playing, phase, replay, toggleMute, pushOneOff }
}

function playSfx(kind) {
  if (typeof window === 'undefined') return
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (!AudioContextClass) return
    const context = new AudioContextClass()
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.frequency.value = kind === 'correct' ? 680 : 230
    gain.gain.setValueAtTime(0.08, context.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.18)
    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start()
    oscillator.stop(context.currentTime + 0.19)
  } catch {
    // Sound feedback is optional.
  }
}

function AudioTools({ audio }) {
  const lang = useLang()
  return (
    <div className="audio-tools">
      <span className={`audio-pulse ${audio.playing ? 'is-live' : ''}`} aria-hidden="true" />
      <button
        type="button"
        className="icon-button"
        onClick={audio.toggleMute}
        title={audio.muted ? textOf(L('Ovozni yoqish', 'Включить звук', 'Unmute'), lang) : textOf(L("Ovozni o'chirish", 'Выключить звук', 'Mute'), lang)}
        aria-label={audio.muted ? textOf(L('Ovozni yoqish', 'Включить звук', 'Unmute'), lang) : textOf(L("Ovozni o'chirish", 'Выключить звук', 'Mute'), lang)}
      >
        <SpeakerIcon muted={audio.muted} playing={audio.playing} />
      </button>
      <button
        type="button"
        className="icon-button"
        onClick={audio.replay}
        title={textOf(L('Qayta tinglash', 'Повторить', 'Replay'), lang)}
        aria-label={textOf(L('Qayta tinglash', 'Повторить', 'Replay'), lang)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 8V4m0 0h4M4 4l4 4a7 7 0 1 1-2 5" />
        </svg>
      </button>
    </div>
  )
}

function Stage({ screen, content, audio, children, onPrev, onNext, onFinish }) {
  const lang = useLang()
  const isLast = screen === TOTAL_SCREENS - 1
  const contentRef = useRef(null)

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'auto' })
  }, [screen])

  return (
    <main className="stage">
      <header className="stage-header">
        <div className="progress-track" aria-hidden="true">
          <span style={{ width: `${((screen + 1) / TOTAL_SCREENS) * 100}%` }} />
        </div>
        <div className="chrome">
          <div className="eyebrow">
            <span className="dot" />
            {textOf(content.eyebrow, lang)}
          </div>
          <div className="chrome-right">
            <AudioTools audio={audio} />
            <span className="counter">{String(screen + 1).padStart(2, '0')} / {String(TOTAL_SCREENS).padStart(2, '0')}</span>
          </div>
        </div>
      </header>
      <section ref={contentRef} className="stage-content">
        <div className="screen-heading">
          <h1>{textOf(content.title, lang)}</h1>
          <p>{textOf(content.lead, lang)}</p>
        </div>
        {children}
      </section>
      <footer className="stage-nav">
        <button type="button" className="btn-ghost" onClick={onPrev} disabled={screen === 0}>
          <span aria-hidden="true">←</span> {textOf(UI.back, lang)}
        </button>
        <button type="button" className="btn-white-accent" onClick={isLast ? onFinish : onNext}>
          {textOf(isLast ? UI.finish : UI.next, lang)} <span aria-hidden="true">→</span>
        </button>
      </footer>
    </main>
  )
}

function PhaseDots({ count, active }) {
  return (
    <div className="phase-dots" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <span key={index} className={index <= active ? 'active' : ''} />
      ))}
    </div>
  )
}

function HookVisual({ onAnswer }) {
  const lang = useLang()
  const [choice, setChoice] = useState(null)
  const [reason, setReason] = useState(null)
  const [confidence, setConfidence] = useState('unsure')
  const options = [
    L("Bo'yi ham oshadi", 'Высота тоже увеличится', 'The height also grows'),
    L("Bo'yi 2 marta kamayadi", 'Высота уменьшится в 2 раза', 'The height is halved'),
    L("Bo'yi o'zgarmaydi", 'Высота не изменится', 'The height stays unchanged'),
  ]
  const reasons = [
    L("Yuza — tomonlar ko'paytmasi", 'Площадь — произведение сторон', 'Area is the product of the sides'),
    L("Ikkala tomon bir xil o'zgaradi", 'Обе стороны меняются одинаково', 'Both sides change in the same way'),
    L("Rasm shunday ko'rinadi", 'Так выглядит рисунок', 'That is how the picture looks'),
  ]
  const savePrediction = (nextChoice, nextReason, nextConfidence) => {
    onAnswer({
      screenId: 's0',
      screenIdx: 0,
      type: 'prediction',
      scored: false,
      studentAnswer: nextChoice,
      selectedText: nextChoice === null ? null : textOf(options[nextChoice], lang),
      reason: nextReason,
      reasonText: nextReason === null ? null : textOf(reasons[nextReason], lang),
      confidence: nextConfidence,
      answeredAt: new Date().toISOString(),
    })
  }
  const choose = (index) => {
    setChoice(index)
    savePrediction(index, reason, confidence)
  }
  const chooseReason = (index) => {
    setReason(index)
    savePrediction(choice, index, confidence)
  }
  const chooseConfidence = (value) => {
    setConfidence(value)
    savePrediction(choice, reason, value)
  }
  return (
    <div className="hook-grid">
      <div className="frame hook-model">
        <div className="area-label">S = 24 m²</div>
        <div className="rect-pair">
          <div>
            <div className="mini-rect rect-a"><span>4 × 6</span></div>
            <small>4 · 6 = 24</small>
          </div>
          <span className="morph-arrow">→</span>
          <div>
            <div className="mini-rect rect-question"><span>8 × ?</span></div>
            <small>8 · ? = 24</small>
          </div>
        </div>
        <span className="hook-proof-note">
          {textOf(L(
            "Taxminni tajriba, jadval va grafik bilan tekshiramiz.",
            'Проверим прогноз экспериментом, таблицей и графиком.',
            'We will test the prediction with an experiment, a table, and a graph.',
          ), lang)}
        </span>
      </div>
      <div className="choice-stack">
        {options.map((option, index) => (
          <button
            type="button"
            key={textOf(option, 'en')}
            className={`option ${choice === index ? 'selected' : ''}`}
            onClick={() => choose(index)}
          >
            <span>{String.fromCharCode(65 + index)}</span>
            {textOf(option, lang)}
          </button>
        ))}
        {choice !== null && (
          <div className="prediction-followup">
            <small>{textOf(L('Nega shunday deb o‘ylaysiz?', 'Почему вы так думаете?', 'Why do you think so?'), lang)}</small>
            <div className="reason-chips">
              {reasons.map((item, index) => (
                <button
                  type="button"
                  key={textOf(item, 'en')}
                  className={reason === index ? 'active' : ''}
                  onClick={() => chooseReason(index)}
                >
                  {textOf(item, lang)}
                </button>
              ))}
            </div>
            <div className="confidence-row">
              <span>{textOf(L('Ishonch:', 'Уверенность:', 'Confidence:'), lang)}</span>
              <button
                type="button"
                className={confidence === 'unsure' ? 'active' : ''}
                onClick={() => chooseConfidence('unsure')}
              >
                {textOf(L('Shubham bor', 'Сомневаюсь', 'Unsure'), lang)}
              </button>
              <button
                type="button"
                className={confidence === 'sure' ? 'active' : ''}
                onClick={() => chooseConfidence('sure')}
              >
                {textOf(L('Ishonaman', 'Уверен', 'Confident'), lang)}
              </button>
            </div>
            <p className="prediction-saved" role="status">
              {textOf(L(
                'Taxmin saqlandi. Hozircha baholanmaydi.',
                'Прогноз сохранён. Пока он не оценивается.',
                'Prediction saved. It is not graded yet.',
              ), lang)}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

const RECTANGLE_FACTORS = [2, 3, 4, 6, 8, 12]
const RECTANGLE_CELL_COUNT = 24

function RectangleLab({ phase }) {
  const lang = useLang()
  const [selectedX, setSelectedX] = useState(null)
  const [visited, setVisited] = useState([4])
  const [prediction, setPrediction] = useState(null)
  const narratedX = phase === 0 ? 4 : phase === 1 ? 8 : 12
  const x = selectedX ?? narratedX
  const y = 24 / x
  const yDisplay = Number.isInteger(y) ? String(y) : y.toFixed(2).replace(/\.?0+$/, '')
  const exactValue = Number.isInteger(y)
  const compactRectangle = Math.min(x, y) <= 3
  const sliderIndex = RECTANGLE_FACTORS.indexOf(x)
  const chooseX = (value) => {
    setSelectedX(value)
    setVisited((previous) => (previous.includes(value) ? previous : [...previous, value]))
  }
  const choosePrediction = (value) => {
    setPrediction(value)
    window.setTimeout(() => chooseX(8), 220)
  }
  return (
    <div className="lab-grid" data-audio-phase={phase}>
      <div className="frame rectangle-stage">
        <div className="rectangle-stage-note">
          <strong>S = 24 m²</strong>
          <span>{textOf(L("O'zgarmas yuza", 'Постоянная площадь', 'Fixed area'), lang)}</span>
        </div>
        <div className="rectangle-visual">
          <div
            key={`${x}-${y}`}
            className={`dynamic-rectangle ${compactRectangle ? 'is-compact' : ''}`}
            style={{
              '--cell-columns': x,
              width: `calc(var(--lab-unit) * ${x})`,
              height: `calc(var(--lab-unit) * ${y})`,
            }}
            role="img"
            aria-label={`${x} times ${yDisplay} equals 24`}
          >
            <span className="rectangle-cells" aria-hidden="true">
              {Array.from({ length: RECTANGLE_CELL_COUNT }, (_, cellIndex) => (
                <i key={cellIndex} />
              ))}
            </span>
            <span className="area-core" aria-hidden="true">{compactRectangle ? '24' : 'S = 24'}</span>
          </div>
        </div>
        <div className="rectangle-measures">
          <span><MathVar>x</MathVar><b>{x}</b></span>
          <i aria-hidden="true">↑ x&nbsp;&nbsp;↔&nbsp;&nbsp;y ↓</i>
          <span><MathVar>y</MathVar><b>{exactValue ? yDisplay : `≈ ${yDisplay}`}</b></span>
        </div>
      </div>
      <div className="frame control-card">
        <div className="lab-mission">
          <small>{textOf(L('Kichik tadqiqot', 'Мини-исследование', 'Mini investigation'), lang)}</small>
          <strong>{textOf(L('(4; 6) → (8; ?). y ni toping.', '(4; 6) → (8; ?). Найдите y.', '(4, 6) → (8, ?). Find y.'), lang)}</strong>
          <div className="prediction-buttons">
            {[3, 6, 12].map((value) => (
              <button
                type="button"
                key={value}
                className={
                  prediction === null
                    ? ''
                    : value === 3
                      ? 'correct'
                      : prediction === value
                        ? 'wrong'
                        : ''
                }
                onClick={() => choosePrediction(value)}
                aria-pressed={prediction === value}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
        <div className="metric-row">
          <span>{textOf(L('Eni, x', 'Ширина, x', 'Width, x'), lang)}</span>
          <strong>{x}</strong>
        </div>
        <input
          type="range"
          min="0"
          max={RECTANGLE_FACTORS.length - 1}
          step="1"
          value={sliderIndex}
          onChange={(event) => chooseX(RECTANGLE_FACTORS[Number(event.target.value)])}
          aria-label={textOf(L('Eni, x', 'Ширина, x', 'Width, x'), lang)}
          aria-valuetext={`x = ${x}, y = ${yDisplay}`}
          style={{ '--range-progress': `${(sliderIndex / (RECTANGLE_FACTORS.length - 1)) * 100}%` }}
        />
        <div className="lab-presets" aria-label={textOf(L('Tekshiruv qiymatlari', 'Контрольные значения', 'Checkpoint values'), lang)}>
          {[4, 8, 12].map((value) => (
            <button
              type="button"
              key={value}
              className={x === value ? 'active' : ''}
              onClick={() => chooseX(value)}
            >
              x = {value}
            </button>
          ))}
        </div>
        <div className="equation-line book-equation">
          <small>{textOf(L('Avval y ni topamiz', 'Сначала находим y', 'First find y'), lang)}</small>
          <MathEquation ariaLabel={`y equals 24 divided by ${x}${exactValue ? ` equals ${yDisplay}` : ` approximately equals ${yDisplay}`}`}>
            <MathVar>y</MathVar>
            <span>=</span>
            <MathFraction numerator="24" denominator={x} compact />
            <span>{exactValue ? '=' : '≈'}</span>
            <strong>{yDisplay}</strong>
          </MathEquation>
          <div className="equation-check">
            <span aria-hidden="true">✓</span>
            <MathEquation compact ariaLabel={`${x} times ${yDisplay} ${exactValue ? 'equals' : 'approximately equals'} 24`}>
              <span>{x}</span>
              <span>·</span>
              <span>{yDisplay}</span>
              <span>{exactValue ? '=' : '≈'}</span>
              <strong>24</strong>
            </MathEquation>
          </div>
        </div>
        <div className={`invariant-badge ${visited.includes(8) || phase >= 2 ? 'visible' : ''}`}>
          <strong>x · y = 24</strong>
          <span>{textOf(L(
            "x ni a marta oshirsak, y ni a ga bo'lamiz.",
            'Если x умножить на a, то y нужно разделить на a.',
            'If x is multiplied by a, y is divided by a.',
          ), lang)}</span>
        </div>
      </div>
    </div>
  )
}

function TableModel({ phase }) {
  const lang = useLang()
  const pairs = [[1, 24], [2, 12], [3, 8], [4, 6], [6, 4], [8, 3]]
  const [selectedPairs, setSelectedPairs] = useState(null)
  const narratedPairs = phase === 0 ? [0, 1] : phase === 1 ? [1, 3] : [3, 5]
  const activePairs = selectedPairs ?? narratedPairs
  const [gapAnswer, setGapAnswer] = useState(null)
  const discovered = gapAnswer === 4
  const ordered = [...activePairs].sort((a, b) => pairs[a][0] - pairs[b][0])
  const [firstIndex, secondIndex] = ordered
  const first = pairs[firstIndex]
  const second = pairs[secondIndex]
  const factorNumerator = second[0]
  const factorDenominator = first[0]
  const factor = factorNumerator / factorDenominator
  const ratioNode = Number.isInteger(factor)
    ? factor
    : <MathFraction numerator={factorNumerator} denominator={factorDenominator} compact />
  const selectPair = (index) => {
    setSelectedPairs((previous) => {
      const current = previous ?? activePairs
      if (current.includes(index)) return current
      return current.length < 2 ? [...current, index] : [current[1], index]
    })
  }
  return (
    <div className="table-layout" data-audio-phase={phase}>
      <div className="frame math-table">
        <div className="table-row header"><span>x</span>{pairs.map(([x]) => <span key={`x${x}`}>{x}</span>)}</div>
        <div className="table-row">
          <span>y</span>
          {pairs.map(([, y], index) => (
            <span key={`y${y}`} className={activePairs.includes(index) ? 'lit' : ''}>
              {index === 4 && !discovered ? '?' : y}
            </span>
          ))}
        </div>
        <div className="table-row product">
          <span>x·y</span>
          {pairs.map(([x, y], index) => (
            <span key={`p${x}`} className={activePairs.includes(index) ? 'lit' : ''}>
              {index === 4 && !discovered ? '—' : x * y}
            </span>
          ))}
        </div>
        <div className="table-gap-question">
          <span>{textOf(L('6 · ? = 24. Yetishmayotgan qiymat:', '6 · ? = 24. Пропущенное значение:', '6 · ? = 24. Missing value:'), lang)}</span>
          {[3, 4, 6].map((value) => (
            <button
              type="button"
              key={value}
              className={gapAnswer === value ? (value === 4 ? 'correct' : 'wrong') : ''}
              onClick={() => setGapAnswer(value)}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
      <div className="frame pattern-card">
        <div className="ratio-motion">
          <span>x</span><b>× {ratioNode}</b><i>→</i><span>{second[0]}</span>
        </div>
        <div className="ratio-motion inverse">
          <span>y</span><b>÷ {ratioNode}</b><i>→</i><span>{second[1]}</span>
        </div>
        <p>{textOf(L(
          "Ikki ustunni tanlang: o'zgarish koeffitsiyenti avtomatik hisoblanadi.",
          'Выберите два столбца: коэффициент изменения вычислится автоматически.',
          'Select two columns: the change factor is calculated automatically.',
        ), lang)}</p>
        <div className="pair-selector" aria-label={textOf(L('Jadval juftligini tanlang', 'Выбери пару таблицы', 'Select a table pair'), lang)}>
          {pairs.map(([x, y], index) => (
            <button
              type="button"
              key={`${x}-${y}`}
              className={activePairs.includes(index) ? 'active' : ''}
              onClick={() => selectPair(index)}
              aria-pressed={activePairs.includes(index)}
            >
              ({x}; {index === 4 && !discovered ? '?' : y})
            </button>
          ))}
        </div>
        <div className={`table-conclusion ${discovered ? 'show' : ''}`}>
          <ConstantProduct compact />
          <span>{textOf(L('— o‘zgarmas', '— постоянно', '— constant'), lang)}</span>
        </div>
      </div>
    </div>
  )
}

function FormulaBuild({ phase }) {
  const lang = useLang()
  const [operation, setOperation] = useState(null)
  const [step, setStep] = useState(0)
  const correctOperation = operation === 'divide'
  const chooseOperation = (value) => {
    setOperation(value)
    setStep(value === 'divide' ? 1 : 0)
  }
  return (
    <div className="formula-discovery" data-audio-phase={phase}>
      <div className="frame formula-question">
        <small>{textOf(L("Boshlang'ich tenglik", 'Исходное равенство', 'Starting equation'), lang)}</small>
        <ConstantProduct />
        <strong>{textOf(L(
          "y ni yolg'iz qoldirish uchun qaysi amal kerak?",
          'Какое действие оставит y в левой части?',
          'Which operation will isolate y?',
        ), lang)}</strong>
        <div className="operation-choices">
          <button
            type="button"
            className={operation === 'subtract' ? 'wrong' : ''}
            onClick={() => chooseOperation('subtract')}
          >
            − x
          </button>
          <button
            type="button"
            className={operation === 'divide' ? 'correct' : ''}
            onClick={() => chooseOperation('divide')}
          >
            ÷ x
          </button>
          <button
            type="button"
            className={operation === 'add' ? 'wrong' : ''}
            onClick={() => chooseOperation('add')}
          >
            + x
          </button>
        </div>
        {operation && !correctOperation && (
          <p className="formula-hint" role="status">
            {textOf(L(
              'x — ko‘paytuvchi. Uni yo‘qotish uchun teskari amalni tanlang.',
              'x — множитель. Выберите обратное умножению действие.',
              'x is a factor. Choose the inverse of multiplication.',
            ), lang)}
          </p>
        )}
      </div>

      <div className={`frame algebra-steps ${correctOperation ? 'is-active' : ''}`} data-audio-phase={phase}>
        <div className="algebra-row">
          <span>1</span>
          <MathEquation ariaLabel="x times y divided by x equals k divided by x">
            <MathFraction
              numerator={<><MathVar>x</MathVar><span>·</span><MathVar>y</MathVar></>}
              denominator={<MathVar>x</MathVar>}
            />
            <span>=</span>
            <MathFraction numerator={<MathVar>k</MathVar>} denominator={<MathVar>x</MathVar>} />
          </MathEquation>
          <small>x ≠ 0</small>
        </div>
        <button
          type="button"
          className="cancel-button"
          disabled={!correctOperation || step >= 2}
          onClick={() => setStep(2)}
        >
          {textOf(L('x larni qisqartiring', 'Сократить x', 'Cancel x'), lang)}
        </button>
        <div className={`algebra-row result ${step >= 2 ? 'show' : ''}`}>
          <span>2</span>
          <InverseFormula />
          <small>k ≠ 0, x ≠ 0</small>
        </div>
        <button
          type="button"
          className="reverse-check"
          disabled={step < 2}
          onClick={() => setStep(3)}
        >
          {textOf(L('Teskari tekshiruv', 'Обратная проверка', 'Reverse check'), lang)}
        </button>
        <div className={`reverse-equation ${step >= 3 ? 'show' : ''}`}>
          <InverseFormula compact />
          <span>⇄</span>
          <ConstantProduct compact />
        </div>
      </div>
    </div>
  )
}

function DomainModel({ phase }) {
  const lang = useLang()
  const values = [-1, -0.5, 0, 0.5, 1]
  const [selectedX, setSelectedX] = useState(null)
  const foundBoundary = selectedX === 0
  return (
    <div className="domain-layout" data-audio-phase={phase}>
      <div className="model-domain-note">
        <span>{textOf(L('To‘rtburchak modeli', 'Модель прямоугольника', 'Rectangle model'), lang)}: x &gt; 0, y &gt; 0</span>
        <i>→</i>
        <span>
          {textOf(L('Matematik funksiya', 'Математическая функция', 'Mathematical function'), lang)}:{' '}
          {foundBoundary
            ? 'x ∈ ℝ, x ≠ 0'
            : textOf(L('haqiqiy x qiymatlarini tekshiramiz', 'проверяем вещественные x', 'test real x-values'), lang)}
        </span>
      </div>
      <div className="frame value-cards">
        {values.map((x) => (
          <button
            type="button"
            key={x}
            className={`value-card ${x === 0 && foundBoundary ? 'forbidden' : ''} ${phase >= 1 && x === 0 && !foundBoundary ? 'pulse' : ''} ${selectedX === x ? 'selected' : ''}`}
            onClick={() => setSelectedX(x)}
          >
            <span>x = {x}</span>
            <MathFraction numerator="12" denominator={x} compact />
            <small>
              {x === 0
                ? (foundBoundary
                  ? textOf(L('aniqlanmagan', 'не определено', 'undefined'), lang)
                  : textOf(L('avval taxmin qiling', 'сначала предположите', 'predict first'), lang))
                : `y = ${12 / x}`}
            </small>
          </button>
        ))}
      </div>
      <div className={`zero-proof ${foundBoundary ? 'show' : ''}`} aria-live="polite">
        <div>
          <MathFraction numerator="12" denominator="0" />
          <span>{textOf(L('— aniqlanmagan', '— не определено', '— undefined'), lang)}</span>
        </div>
        <b>{textOf(L('chunki', 'потому что', 'because'), lang)}</b>
        <div>
          <MathEquation compact><span>0</span><span>·</span><MathVar>y</MathVar><span>≠</span><span>12</span></MathEquation>
          <span>{textOf(L('hech qanday y mos kelmaydi', 'ни одно y не подходит', 'no value of y works'), lang)}</span>
        </div>
      </div>
      <div className={`domain-rule ${foundBoundary ? 'show' : ''}`}>
        <InverseFormula compact />
        <div className="restriction-pair">
          <strong>x ≠ 0</strong>
          <strong>y ≠ 0</strong>
          <small>k ≠ 0</small>
        </div>
        <p>{textOf(
          L(
            "Grafik hech bir koordinata o'qini kesmaydi.",
            'График не пересекает ни одну координатную ось.',
            'The graph crosses neither coordinate axis.',
          ),
          lang,
        )}</p>
      </div>
    </div>
  )
}

function mapPoint(x, y) {
  return { x: 230 + x * 18, y: 125 - y * 9 }
}

function curvePath(k, negativeBranch) {
  const points = []
  const start = negativeBranch ? -10 : 0.7
  const end = negativeBranch ? -0.7 : 10
  const steps = 44
  for (let index = 0; index <= steps; index += 1) {
    const x = start + ((end - start) * index) / steps
    const point = mapPoint(x, k / x)
    points.push(`${index === 0 ? 'M' : 'L'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
  }
  return points.join(' ')
}

function CoordinateGraph({
  k = 24,
  pointsOnly = false,
  phase = 2,
  revealCount = null,
  pointsOverride = null,
  showAsymptotes = false,
}) {
  const points = pointsOverride ?? [
    [2, k / 2],
    [3, k / 3],
    [4, k / 4],
    [6, k / 6],
    [-2, k / -2],
    [-3, k / -3],
    [-4, k / -4],
    [-6, k / -6],
  ]
  return (
    <svg
      className="coordinate-graph"
      viewBox="0 0 460 250"
      role="img"
      aria-label={`The graph of y equals ${k} divided by x`}
    >
      <defs>
        <pattern id={`grid-${Math.abs(k)}-${pointsOnly}`} width="18" height="18" patternUnits="userSpaceOnUse">
          <path d="M 18 0 L 0 0 0 18" fill="none" stroke="#E6E2DC" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="460" height="250" rx="15" fill={`url(#grid-${Math.abs(k)}-${pointsOnly})`} />
      <path d="M 14 125 H 446 M 230 10 V 240" className="axis" />
      <path d="m440 120 7 5-7 5M225 17l5-7 5 7" className="axis-arrow" />
      <text x="438" y="116">x</text>
      <text x="238" y="20">y</text>
      {[-8, -4, 4, 8].map((value) => (
        <g key={`xt${value}`}>
          <path d={`M ${230 + value * 18} 121 V 129`} className="tick" />
          <text x={230 + value * 18} y="141" textAnchor="middle">{value}</text>
        </g>
      ))}
      {[-8, -4, 4, 8].map((value) => (
        <g key={`yt${value}`}>
          <path d={`M 226 ${125 - value * 9} H 234`} className="tick" />
          <text x="220" y={129 - value * 9} textAnchor="end">{value}</text>
        </g>
      ))}
      {showAsymptotes && (
        <g className="asymptote-labels">
          <text x="240" y="235">x = 0</text>
          <text x="382" y="117">y = 0</text>
        </g>
      )}
      {!pointsOnly && (
        <g className={`hyperbola ${phase >= 0 ? 'draw' : ''}`}>
          <path d={curvePath(k, true)} />
          <path d={curvePath(k, false)} />
        </g>
      )}
      {points.map(([x, y], index) => {
        const point = mapPoint(x, y)
        const revealAt = Math.min(2, Math.floor(index / 3))
        const isVisible = revealCount === null ? phase >= revealAt : index < revealCount
        return (
          <circle
            key={`${x}-${y}`}
            className={`graph-point ${isVisible ? 'show' : ''}`}
            style={{ '--delay': `${(index % 4) * 90}ms` }}
            cx={point.x}
            cy={point.y}
            r="4.5"
          />
        )
      })}
      <circle cx="230" cy="125" r="5.5" className="origin-gap" />
    </svg>
  )
}

function PointsModel({ phase }) {
  const lang = useLang()
  const pairs = [[2, 12], [-2, -12], [4, 6], [-4, -6], [8, 3], [-8, -3]]
  const [placed, setPlaced] = useState(0)
  const [wrong, setWrong] = useState(false)
  const target = pairs[Math.min(placed, pairs.length - 1)]
  const candidates = [
    target,
    [target[1], target[0]],
    [target[0], -target[1]],
  ]
  const placePoint = (candidate) => {
    if (candidate[0] !== target[0] || candidate[1] !== target[1]) {
      setWrong(true)
      return
    }
    setWrong(false)
    setPlaced((value) => Math.min(pairs.length, value + 1))
  }
  return (
    <div className="graph-layout" data-audio-phase={phase}>
      <div className="frame graph-frame">
        <CoordinateGraph
          k={24}
          pointsOnly
          phase={phase}
          revealCount={placed}
          pointsOverride={pairs}
        />
      </div>
      <div className="point-list">
        {pairs.map((pair, index) => (
          <div key={pair[0]} className={index < placed ? 'visible' : index === placed ? 'current-target' : ''}>
            <span>({pair[0]}; {pair[1]})</span>
            <small>{pair[0]} · {pair[1]} = 24</small>
          </div>
        ))}
        {placed < pairs.length ? (
          <div className="plot-action">
            <p>
              {textOf(L('Nuqta uchun to‘g‘ri koordinatani tanlang:', 'Выберите правильные координаты точки:', 'Choose the correct coordinates for the point:'), lang)}
            </p>
            <div className="plot-options">
              {candidates.map((candidate, index) => (
                <button
                  type="button"
                  key={`${candidate[0]}-${candidate[1]}-${index}`}
                  className={wrong && index !== 0 ? 'wrong' : ''}
                  onClick={() => placePoint(candidate)}
                >
                  ({candidate[0]}; {candidate[1]})
                </button>
              ))}
            </div>
            {wrong && (
              <small className="plot-hint" role="status">
                {textOf(L(
                  'Avval x bo‘yicha, keyin y bo‘yicha harakat qiling.',
                  'Сначала двигайтесь по x, затем по y.',
                  'Move along x first, then along y.',
                ), lang)}
              </small>
            )}
          </div>
        ) : (
          <div className="point-conclusion">
            <strong>{textOf(L('Ikki shox tayyor', 'Обе ветви готовы', 'Both branches are ready'), lang)}</strong>
            <span>{textOf(L('Musbat juftliklar — I, manfiy juftliklar — III chorakda.', 'Положительные пары — в I, отрицательные — в III четверти.', 'Positive pairs lie in I; negative pairs lie in III.'), lang)}</span>
          </div>
        )}
      </div>
    </div>
  )
}

function GraphSignModel({ phase }) {
  const lang = useLang()
  const [manualK, setManualK] = useState(null)
  const [prediction, setPrediction] = useState(null)
  const narratedK = phase >= 2 ? -12 : 12
  const k = manualK ?? narratedK
  const sign = k > 0 ? 1 : -1
  const setSign = (nextSign) => setManualK(nextSign * Math.abs(k))
  const setMagnitude = (value) => setManualK(sign * value)
  return (
    <div className="graph-layout" data-audio-phase={phase}>
      <div className="frame graph-frame graph-with-formula">
        <InverseFormula numerator={Math.abs(k)} negative={k < 0} compact />
        <CoordinateGraph key={`${k}-${phase}`} k={k} phase={phase} showAsymptotes />
      </div>
      <div className="sign-panel">
        <div className="quadrant-prediction">
          <small>{textOf(L('Avval taxmin qiling: k < 0', 'Сначала прогноз: k < 0', 'Predict first: k < 0'), lang)}</small>
          <div>
            <button
              type="button"
              className={prediction === 'positive' ? 'wrong' : ''}
              onClick={() => setPrediction('positive')}
            >
              I, III
            </button>
            <button
              type="button"
              className={prediction === 'negative' ? 'correct' : ''}
              onClick={() => {
                setPrediction('negative')
                setSign(-1)
              }}
            >
              II, IV
            </button>
          </div>
        </div>
        <div className="segmented">
          <button type="button" className={k > 0 ? 'active' : ''} onClick={() => setSign(1)}>k &gt; 0</button>
          <button type="button" className={k < 0 ? 'active' : ''} onClick={() => setSign(-1)}>k &lt; 0</button>
        </div>
        <div className="magnitude-control">
          <small>|k|</small>
          {[4, 12, 24].map((value) => (
            <button
              type="button"
              key={value}
              className={Math.abs(k) === value ? 'active' : ''}
              onClick={() => setMagnitude(value)}
            >
              {value}
            </button>
          ))}
        </div>
        <div className={`quadrant-rule ${k > 0 ? 'positive' : 'negative'}`}>
          <strong>{k > 0 ? 'k > 0' : 'k < 0'}</strong>
          <span>{k > 0 ? 'I & III' : 'II & IV'}</span>
        </div>
        <div className="sign-proof">
          <MathEquation compact>
            <MathVar>x</MathVar><span>·</span><MathVar>y</MathVar>
            <span>{k > 0 ? '>' : '<'}</span><span>0</span>
          </MathEquation>
          <p>{textOf(k > 0
            ? L('x va y bir xil ishorali.', 'x и y имеют одинаковые знаки.', 'x and y have the same sign.')
            : L('x va y qarama-qarshi ishorali.', 'x и y имеют противоположные знаки.', 'x and y have opposite signs.'), lang)}</p>
        </div>
      </div>
    </div>
  )
}

function Passport({ phase }) {
  const lang = useLang()
  const [opened, setOpened] = useState([])
  const [classification, setClassification] = useState(null)
  const cards = [
    {
      icon: '1',
      level: L('TA’RIF', 'ОПРЕДЕЛЕНИЕ', 'DEFINITION'),
      title: L("Ko'paytma o'zgarmas", 'Произведение постоянно', 'Product is constant'),
      math: <><ConstantProduct compact /><small>k ≠ 0</small></>,
    },
    {
      icon: '2',
      level: L('FORMULA', 'ФОРМУЛА', 'FORMULA'),
      title: L('Teng kuchli yozuv', 'Равносильная запись', 'Equivalent form'),
      math: <><InverseFormula compact /><small>x ≠ 0</small></>,
    },
    {
      icon: '3',
      level: L('O‘ZGARISH', 'ИЗМЕНЕНИЕ', 'CHANGE'),
      title: L('Teskari koeffitsiyent', 'Обратный множитель', 'Reciprocal factor'),
      math: (
        <MathEquation compact>
          <MathVar>x</MathVar><span>×</span><MathVar>a</MathVar>
          <span>⇒</span>
          <MathVar>y</MathVar><span>÷</span><MathVar>a</MathVar>
        </MathEquation>
      ),
    },
    {
      icon: '4',
      level: L('NATIJA', 'СЛЕДСТВИЕ', 'CONSEQUENCE'),
      title: L('Giperbola va asimptotalar', 'Гипербола и асимптоты', 'Hyperbola and asymptotes'),
      math: <small>x ≠ 0, y ≠ 0</small>,
    },
  ]
  const toggleCard = (index) => {
    setOpened((previous) => (
      previous.includes(index) ? previous.filter((item) => item !== index) : [...previous, index]
    ))
  }
  const examples = [
    {
      id: 'inverse',
      formula: <InverseFormula numerator="12" compact />,
      label: L('O‘zgarmas ko‘paytma', 'Постоянное произведение', 'Constant product'),
    },
    {
      id: 'direct',
      formula: <MathEquation compact><MathVar>y</MathVar><span>=</span><span>3</span><MathVar>x</MathVar></MathEquation>,
      label: L('To‘g‘ri proporsiya', 'Прямая пропорция', 'Direct proportion'),
    },
    {
      id: 'linear',
      formula: <MathEquation compact><MathVar>y</MathVar><span>=</span><span>10</span><span>−</span><MathVar>x</MathVar></MathEquation>,
      label: L('Kamayadi, ammo ko‘paytma o‘zgarmas emas', 'Убывает, но произведение не постоянно', 'Decreases, but the product is not constant'),
    },
  ]
  return (
    <div className="passport-layout" data-audio-phase={phase}>
      <div className="passport-grid">
        {cards.map((card, index) => (
          <button
            type="button"
            key={textOf(card.title, 'en')}
            className={`passport-card ${opened.includes(index) ? 'show' : ''}`}
            onClick={() => toggleCard(index)}
            aria-expanded={opened.includes(index)}
          >
            <span>{card.icon}</span>
            <div>
              <small>{textOf(card.level, lang)}</small>
              <strong>{textOf(card.title, lang)}</strong>
              <div className="passport-math">{opened.includes(index) ? card.math : '?'}</div>
            </div>
          </button>
        ))}
      </div>
      <div className="classification-check">
        <strong>{textOf(L(
          'Qaysi biri teskari proporsionallik?',
          'Какая зависимость является обратной пропорциональностью?',
          'Which relation is an inverse proportion?',
        ), lang)}</strong>
        <div className="classification-options">
          {examples.map((example) => (
            <button
              type="button"
              key={example.id}
              className={classification === example.id ? (example.id === 'inverse' ? 'correct' : 'wrong') : ''}
              onClick={() => setClassification(example.id)}
            >
              {example.formula}
              <small>{textOf(example.label, lang)}</small>
            </button>
          ))}
        </div>
        {classification && (
          <p role="status">
            {classification === 'inverse'
              ? textOf(L(
                'To‘g‘ri: asosiy dalil — x · y doim 12.',
                'Верно: главный аргумент — x · y всегда равно 12.',
                'Correct: the decisive test is that x · y always equals 12.',
              ), lang)
              : textOf(L(
                'Faqat kamayish yetarli emas. x · y o‘zgarmasligini tekshiring.',
                'Одного убывания недостаточно. Проверьте постоянство x · y.',
                'Decreasing is not enough. Test whether x · y is constant.',
              ), lang)}
          </p>
        )}
      </div>
    </div>
  )
}

function WorkedExample({ phase, pushOneOff }) {
  const lang = useLang()
  const [revealed, setRevealed] = useState(0)
  const [wrongAction, setWrongAction] = useState(false)
  const steps = [
    {
      label: L('1-savol', 'Вопрос 1', 'Question 1'),
      expectedAction: 'divide',
      formula: <MathEquation compact><MathVar>x</MathVar><span>=</span><span>4</span><span>→</span><MathVar>y</MathVar><span>=</span><span>?</span></MathEquation>,
      work: <QuotientEquation left="y" numerator="36" denominator="4" result="9" compact />,
      voice: L("x to'rt bo'lsa, y o'ttiz olti bo'lingan to'rt, ya'ni to'qqiz.", 'При x равном четырём y равно тридцати шести, делённым на четыре, то есть девяти.', 'When x is four, y is thirty-six divided by four, which is nine.'),
    },
    {
      label: L('Tekshiruv', 'Проверка', 'Check'),
      expectedAction: 'multiply',
      formula: <MathEquation compact><span>4</span><span>·</span><span>9</span></MathEquation>,
      work: <MathEquation compact><span>=</span><span>36</span><span>✓</span></MathEquation>,
      voice: L("Tekshiramiz: to'rt karra to'qqiz o'ttiz olti.", 'Проверим: четыре умножить на девять равно тридцати шести.', 'Check: four times nine equals thirty-six.'),
    },
    {
      label: L('2-savol', 'Вопрос 2', 'Question 2'),
      expectedAction: 'divide',
      formula: <MathEquation compact><MathVar>y</MathVar><span>=</span><span>−6</span><span>→</span><MathVar>x</MathVar><span>=</span><span>?</span></MathEquation>,
      work: <QuotientEquation left="x" numerator="36" denominator="−6" result="−6" compact />,
      voice: L("Endi y minus olti. x ni topish uchun k ni y ga bo'lamiz.", 'Теперь y равно минус шести. Чтобы найти x, делим k на y.', 'Now y is negative six. To find x, divide k by y.'),
    },
    {
      label: L('Javob', 'Ответ', 'Answer'),
      expectedAction: 'multiply',
      formula: <MathEquation compact><MathVar>x</MathVar><span>=</span><span>−6</span></MathEquation>,
      work: <MathEquation compact><span>(−6)</span><span>·</span><span>(−6)</span><span>=</span><span>36</span><span>✓</span></MathEquation>,
      voice: L("x minus olti. Ikki manfiy son ko'paytmasi musbat o'ttiz olti.", 'x равен минус шести. Произведение двух отрицательных чисел равно положительным тридцати шести.', 'x is negative six. Two negative factors give positive thirty-six.'),
    },
  ]
  const revealNext = (action) => {
    if (revealed >= steps.length) return
    if (steps[revealed].expectedAction !== action) {
      setWrongAction(true)
      return
    }
    setWrongAction(false)
    pushOneOff(steps[revealed].voice)
    setRevealed((value) => Math.min(steps.length, value + 1))
  }
  return (
    <div className="worked-layout" data-audio-phase={phase}>
      <div className="formula-hero"><InverseFormula numerator="36" /></div>
      <div className="worked-steps">
        {steps.map((step, index) => (
          <div key={textOf(step.label, 'en')} className={`worked-step ${index < revealed ? 'active' : ''}`}>
            <span>{index + 1}</span>
            <div><small>{textOf(step.label, lang)}</small><strong>{step.formula}</strong></div>
            <b>{step.work}</b>
          </div>
        ))}
        {revealed < steps.length ? (
          <div className="worked-decision">
            <span>{textOf(L('Keyingi amalni tanlang:', 'Выберите следующее действие:', 'Choose the next operation:'), lang)}</span>
            <button type="button" onClick={() => revealNext('divide')}>÷</button>
            <button type="button" onClick={() => revealNext('multiply')}>×</button>
            {wrongAction && (
              <small role="status">
                {textOf(L(
                  'Noma’lumni topamizmi yoki natijani tekshiramizmi?',
                  'Мы находим неизвестное или проверяем результат?',
                  'Are we finding the unknown or checking the result?',
                ), lang)}
              </small>
            )}
          </div>
        ) : (
          <div className="worked-complete">
            {textOf(L('Yechim tugallandi ✓', 'Решение завершено ✓', 'Solution complete ✓'), lang)}
          </div>
        )}
      </div>
      <div className={`frame-success ${revealed >= steps.length ? 'is-complete' : 'is-pending'}`}>
        <strong>{textOf(L('Universal yo‘l', 'Универсальный путь', 'Universal method'), lang)}</strong>
        <span>
          <ConstantProduct compact />
          {textOf(L(
            ' ni tiklang → noma’lumni bo‘lish bilan toping → ko‘paytirib tekshiring.',
            ' → найдите неизвестное делением → проверьте умножением.',
            ' → find the unknown by division → verify by multiplication.',
          ), lang)}
        </span>
      </div>
    </div>
  )
}

function normaliseNumber(value) {
  const normalised = String(value).trim().replace(',', '.').replace(/−/g, '-')
  if (!normalised) return null
  const parsed = Number(normalised)
  return Number.isFinite(parsed) ? parsed : null
}

function MiniGraph({ variant = 'positive' }) {
  const negative = variant === 'negative' || variant === 'negative-small'
  const crossing = variant === 'crossing'
  const topOnly = variant === 'top'
  const positivePath = 'M 51 8 C 52 25 60 43 84 49 M 39 102 C 38 84 30 66 6 61'
  const negativePath = 'M 6 49 C 26 45 38 27 39 8 M 51 102 C 53 81 65 63 84 61'
  return (
    <svg className="mini-graph" viewBox="0 0 90 110" aria-hidden="true">
      <path d="M 4 55 H 86 M 45 5 V 105" className="mini-axis" />
      {topOnly ? (
        <path d="M 8 42 C 24 19 65 19 82 42" className="mini-curve" />
      ) : (
        <path
          d={crossing ? 'M 5 91 C 24 72 34 64 45 55 C 57 45 67 34 85 17' : negative ? negativePath : positivePath}
          className={`mini-curve ${crossing ? 'is-error' : ''}`}
        />
      )}
      {variant === 'negative-small' && <circle cx="63" cy="74" r="3" className="mini-point is-wrong" />}
      {variant === 'negative' && <circle cx="72" cy="80" r="3" className="mini-point" />}
      {variant === 'positive' && <circle cx="69" cy="45" r="3" className="mini-point" />}
    </svg>
  )
}

function TaskMathVisual({ spec, compact = false, solved = false }) {
  const lang = useLang()
  if (!spec) return null
  const className = `task-math-visual kind-${spec.kind} ${compact ? 'is-compact' : ''} ${solved ? 'is-solved' : ''}`

  if (spec.kind === 'formula') {
    return (
      <div className={className}>
        <InverseFormula
          numerator={String(spec.numerator)}
          denominator={String(spec.denominator ?? 'x')}
          negative={Boolean(spec.negative)}
          compact={compact}
        />
        {spec.note && <small>{spec.note}</small>}
        {spec.restrictions && <small>k ≠ 0, x ≠ 0</small>}
      </div>
    )
  }

  if (spec.kind === 'quotient') {
    return (
      <div className={className}>
        <QuotientEquation
          left={spec.left}
          numerator={spec.numerator}
          denominator={spec.denominator}
          result={spec.result}
          negative={spec.negative}
          unit={textOf(spec.unit, lang)}
          compact={compact}
        />
      </div>
    )
  }

  if (spec.kind === 'table-gap') {
    return (
      <div className={className}>
        <div className="mini-math-table">
          <span>x</span>{spec.x.map((value) => <b key={`x-${value}`}>{value}</b>)}
          <span>y</span>{spec.y.map((value, index) => <b key={`y-${spec.x[index]}`}>{value ?? '?'}</b>)}
        </div>
      </div>
    )
  }

  if (spec.kind === 'pairs') {
    return (
      <div className={className}>
        <div className="math-pair-row">
          {spec.pairs.map(([x, y]) => <span key={`${x}-${y}`}>({x}; {y})</span>)}
        </div>
      </div>
    )
  }

  if (spec.kind === 'change') {
    return (
      <div className={className}>
        <div className="change-diagram">
          <span>{spec.fromX}</span><b>× {spec.factor}</b><span>{spec.toX}</span>
          <i>x</i><i>→</i><i>x</i>
          <span>{spec.fromY}</span><b>÷ {spec.factor}</b><span>?</span>
        </div>
      </div>
    )
  }

  if (spec.kind === 'point-to-k') {
    const [x, y] = spec.point
    return (
      <div className={className}>
        <span className="point-chip">({x}; {y})</span>
        <span className="flow-arrow">→</span>
        <MathEquation compact>
          <MathVar>k</MathVar><span>=</span><span>{x}</span><span>·</span><span>{y < 0 ? `(${y})` : y}</span>
        </MathEquation>
        {spec.scaffold && <small>{spec.scaffold}</small>}
      </div>
    )
  }

  if (spec.kind === 'same-k') {
    return (
      <div className={className}>
        <span className="point-chip">({spec.left[0]}; {spec.left[1]})</span>
        <span className="same-k-line">k</span>
        <span className="point-chip">({spec.right[0]}; {spec.right[1]})</span>
      </div>
    )
  }

  if (spec.kind === 'sign-map') {
    return (
      <div className={className}>
        <span className="sign-chip">k &gt; 0</span>
        <span className="sign-chip">x &lt; 0</span>
        <span className="flow-arrow">→</span>
        <span className="sign-chip">y = ?</span>
      </div>
    )
  }

  if (spec.kind === 'undefined-fraction') {
    return (
      <div className={className}>
        <MathFraction numerator={spec.numerator} denominator="0" />
        <span className="student-error">= 0 ?</span>
      </div>
    )
  }

  if (spec.kind === 'mini-graph') {
    return <MiniGraph variant={spec.variant} />
  }

  if (spec.kind === 'graph-main') {
    return (
      <div className={`${className} task-graph`}>
        <CoordinateGraph k={spec.k} showAsymptotes />
        {spec.guideX !== undefined && <span className="graph-guide-label">x = {spec.guideX}</span>}
      </div>
    )
  }

  if (spec.kind === 'graph-error') {
    return (
      <div className={`${className} graph-error-demo`}>
        <CoordinateGraph k={spec.k} showAsymptotes />
        <span className="false-axis-point">(0; 5)</span>
      </div>
    )
  }

  if (spec.kind === 'sign-product') {
    return (
      <div className={className}>
        <MathEquation>
          <MathVar>x</MathVar><span>·</span><MathVar>y</MathVar><span>&lt;</span><span>0</span>
        </MathEquation>
        <div className="sign-pairs"><span>(−; +)</span><span>(+; −)</span></div>
      </div>
    )
  }

  if (spec.kind === 'two-stage-point') {
    return (
      <div className={className}>
        <span className="point-chip">({spec.known[0]}; {spec.known[1]})</span>
        <span className="flow-arrow">→ k →</span>
        <span className="point-chip">({spec.targetX}; ?)</span>
      </div>
    )
  }

  if (spec.kind === 'point-to-model') {
    return (
      <div className={className}>
        <span className="point-chip">({spec.point[0]}; {spec.point[1]})</span>
        <span className="flow-arrow">→</span>
        <InverseFormula numerator="k" compact />
        <span className="flow-arrow">→</span>
        <span>y = {spec.targetY}</span>
      </div>
    )
  }

  if (spec.kind === 'context') {
    const symbols = {
      area: '▦',
      road: '↦',
      workers: '◎',
      taps: '⌁',
      budget: '₸',
      taxi: '▱',
    }
    return (
      <div className={`${className} context-visual`}>
        <span className="context-symbol">{symbols[spec.context] ?? '◆'}</span>
        <div>
          <small>{spec.fixed}</small>
          <strong>{spec.change}</strong>
        </div>
      </div>
    )
  }

  if (spec.kind === 'product-chain') {
    return (
      <div className={className}>
        {spec.items.map((item) => <span key={item}>{item}</span>)}
        <b>= {spec.result}</b>
      </div>
    )
  }

  if (spec.kind === 'restriction') {
    return (
      <div className={className}>
        {spec.items.map((item) => <strong key={item}>{item}</strong>)}
      </div>
    )
  }

  if (spec.kind === 'passport') {
    return (
      <div className={className}>
        <span>k = {spec.k}</span>
        <InverseFormula numerator={String(spec.k).replace('−', '')} negative={spec.negative} compact />
        <span>x ≠ 0</span>
        <span>{spec.quadrants}</span>
        {spec.extra && <small>{spec.extra}</small>}
      </div>
    )
  }

  return (
    <div className={className}>
      <MathEquation compact>{spec.value}</MathEquation>
    </div>
  )
}

function PracticeOptionContent({ option, lang }) {
  return (
    <>
      {option.visual && <TaskMathVisual spec={option.visual} compact />}
      <span className="option-copy">{textOf(option.label, lang)}</span>
    </>
  )
}

function PracticeBlock({ blockIndex, storedAnswer, onAnswer, pushOneOff }) {
  const lang = useLang()
  const tasks = PRACTICE_BLOCKS[blockIndex]
  const restoredItems = useMemo(
    () => (Array.isArray(storedAnswer?.items) ? storedAnswer.items : []),
    [storedAnswer],
  )
  const restoredResults = useMemo(() => {
    const result = {}
    restoredItems.forEach((item, index) => {
      if (item?.correct) result[index] = item
    })
    return result
  }, [restoredItems])
  const solvedInitial = Object.keys(restoredResults).length
  const [results, setResults] = useState(restoredResults)
  const [currentTask, setCurrentTask] = useState(Math.min(solvedInitial, tasks.length - 1))
  const [input, setInput] = useState('')
  const [selected, setSelected] = useState(null)
  const [wrong, setWrong] = useState(false)
  const [wrongLevel, setWrongLevel] = useState(0)
  const [attempts, setAttempts] = useState(() => restoredItems.map((item) => item?.attempts ?? 0))
  const taskStartedRef = useRef(null)
  const solvedCount = Object.keys(results).length
  const activeTask = tasks[currentTask]
  const currentSolved = Boolean(results[currentTask]?.correct)
  const unlockedThrough = Math.min(solvedCount, tasks.length - 1)
  const isNumberTask = activeTask.type === 'number'
  const isContextTask = activeTask.type === 'context'
  const isChoiceTask = !isNumberTask && !isContextTask
  const answerLetter = isContextTask ? activeTask.answer.choice : activeTask.answer
  const answerNumber = isContextTask ? activeTask.answer.value : activeTask.answer

  useEffect(() => {
    taskStartedRef.current = new Date().getTime()
  }, [currentTask])

  const selectTask = (index) => {
    setInput('')
    setSelected(null)
    setWrong(false)
    setWrongLevel(0)
    taskStartedRef.current = new Date().getTime()
    setCurrentTask(index)
  }

  const emitResult = useCallback((nextResults, nextAttempts) => {
    const items = tasks.map((practiceTask, index) => nextResults[index] ?? {
      taskId: practiceTask.id,
      correct: false,
      attempts: nextAttempts[index] ?? 0,
      pending: true,
    })
    const correctCount = items.filter((item) => item.correct).length
    onAnswer({
      screenId: SCREEN_META[PRACTICE_START + blockIndex].id,
      type: 'practice-block',
      scope: SCREEN_META[PRACTICE_START + blockIndex].scope,
      scored: true,
      correct: correctCount === tasks.length,
      correctCount,
      totalQuestions: tasks.length,
      scorePercent: Math.round((correctCount / tasks.length) * 100),
      items,
      updatedAt: new Date().toISOString(),
    })
  }, [blockIndex, onAnswer, tasks])

  const submit = (answerValue) => {
    if (currentSolved) return
    const candidate = isNumberTask
      ? normaliseNumber(answerValue)
      : isContextTask
        ? {
            choice: answerValue?.choice ?? selected,
            value: normaliseNumber(answerValue?.value ?? input),
          }
        : answerValue
    const expected = activeTask.answer
    const isCorrect = isNumberTask
      ? candidate !== null && Math.abs(candidate - expected) < 0.0001
      : isContextTask
        ? candidate.choice === expected.choice
          && candidate.value !== null
          && Math.abs(candidate.value - expected.value) < 0.0001
        : candidate === expected
    const nextAttempts = [...attempts]
    nextAttempts[currentTask] = (nextAttempts[currentTask] ?? 0) + 1
    setAttempts(nextAttempts)
    if (isChoiceTask) setSelected(answerValue)

    if (!isCorrect) {
      setWrong(true)
      const level = nextAttempts[currentTask] >= 2 ? 2 : 1
      setWrongLevel(level)
      playSfx('wrong')
      pushOneOff(level === 1 ? activeTask.hint1 : activeTask.hint2)
      emitResult(results, nextAttempts)
      return
    }

    const answeredAt = new Date()
    const responseStartedAt = taskStartedRef.current ?? answeredAt.getTime()
    const result = {
      taskId: activeTask.id,
      stage: `practice-${blockIndex + 1}`,
      screenId: SCREEN_META[PRACTICE_START + blockIndex].id,
      screenIdx: PRACTICE_START + blockIndex,
      scope: SCREEN_META[PRACTICE_START + blockIndex].scope,
      type: activeTask.type,
      skill: activeTask.skill,
      question: textOf(activeTask.prompt, lang),
      options: activeTask.options?.map((option) => textOf(option.label, lang)) ?? [],
      correctIndex: isNumberTask ? null : String(answerLetter).charCodeAt(0) - 65,
      correctAnswer: isNumberTask
        ? expected
        : {
            option: textOf(activeTask.options[String(answerLetter).charCodeAt(0) - 65].label, lang),
            value: isContextTask ? answerNumber : null,
            unit: isContextTask ? textOf(activeTask.unit, lang) : null,
          },
      correctAnswerRaw: expected,
      studentAnswerIndex: isNumberTask ? null : String(isContextTask ? candidate.choice : candidate).charCodeAt(0) - 65,
      studentAnswer: isNumberTask
        ? candidate
        : {
            option: textOf(activeTask.options[String(isContextTask ? candidate.choice : candidate).charCodeAt(0) - 65].label, lang),
            value: isContextTask ? candidate.value : null,
            unit: isContextTask ? textOf(activeTask.unit, lang) : null,
          },
      studentAnswerRaw: candidate,
      correct: true,
      firstTry: nextAttempts[currentTask] === 1,
      attempts: nextAttempts[currentTask],
      responseTimeSec: Math.max(1, Math.round((answeredAt.getTime() - responseStartedAt) / 1000)),
      answeredAt: answeredAt.toISOString(),
    }
    const nextResults = { ...results, [currentTask]: result }
    setResults(nextResults)
    setWrong(false)
    setWrongLevel(0)
    playSfx('correct')
    pushOneOff(activeTask.solution)
    emitResult(nextResults, nextAttempts)
  }

  const moveToNext = () => {
    if (!currentSolved || currentTask >= tasks.length - 1) return
    selectTask(currentTask + 1)
  }

  const optionLetter = (index) => String.fromCharCode(65 + index)
  return (
    <div className="practice-layout">
      <div className="task-rail" aria-label={`${textOf(UI.task, lang)} 1–6`}>
        {tasks.map((practiceTask, index) => {
          const solved = Boolean(results[index]?.correct)
          const unlocked = index <= unlockedThrough
          return (
            <button
              type="button"
              key={practiceTask.id}
              className={`${index === currentTask ? 'current' : ''} ${solved ? 'solved' : ''}`}
              disabled={!unlocked}
              onClick={() => unlocked && selectTask(index)}
              aria-label={`${textOf(UI.task, lang)} ${index + 1}`}
            >
              {solved ? '✓' : index + 1}
            </button>
          )
        })}
        <span>{solvedCount}/6</span>
      </div>
      <div key={activeTask.id} className={`frame task-card ${wrong ? 'shake' : ''}`}>
        <div className="task-number">
          <span>{textOf(UI.task, lang)} {currentTask + 1}</span>
          <b>
            {isContextTask
              ? textOf(L('MODEL + JAVOB', 'МОДЕЛЬ + ОТВЕТ', 'MODEL + ANSWER'), lang)
              : activeTask.type === 'graph'
                ? textOf(L('GRAFIK', 'ГРАФИК', 'GRAPH'), lang)
                : isChoiceTask
                  ? 'A/B/C'
                  : '123'}
          </b>
        </div>
        <h2>{textOf(activeTask.prompt, lang)}</h2>
        <TaskMathVisual spec={activeTask.visual} solved={currentSolved} />
        {(isChoiceTask || isContextTask) && (
          <div className={`task-options ${activeTask.options.some((option) => option.visual) ? 'has-visuals' : ''}`}>
            {activeTask.options.map((option, index) => {
              const value = optionLetter(index)
              const isChosen = selected === value
              const isCorrectOption = currentSolved && value === answerLetter
              return (
                <button
                  type="button"
                  key={value}
                  disabled={currentSolved}
                  className={`${isChosen && wrong ? 'wrong' : ''} ${isCorrectOption ? 'correct' : ''}`}
                  onClick={() => {
                    setSelected(value)
                    setWrong(false)
                    if (isChoiceTask) submit(value)
                  }}
                >
                  <span>{value}</span>
                  <PracticeOptionContent option={option} lang={lang} />
                </button>
              )
            })}
          </div>
        )}
        {isNumberTask && (
          <div className="number-entry">
            <label htmlFor={`answer-${blockIndex}-${currentTask}`}>{textOf(UI.answer, lang)}</label>
            <input
              id={`answer-${blockIndex}-${currentTask}`}
              className={`${wrong ? 'wrong' : ''} ${currentSolved ? 'correct' : ''}`}
              inputMode="decimal"
              value={currentSolved ? String(activeTask.answer) : input}
              disabled={currentSolved}
              placeholder="?"
              onChange={(event) => {
                setInput(event.target.value)
                setWrong(false)
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && input.trim()) submit(input)
              }}
            />
            <button type="button" className="btn-white-accent compact" disabled={!input.trim() || currentSolved} onClick={() => submit(input)}>
              {textOf(UI.check, lang)}
            </button>
          </div>
        )}
        {isContextTask && (
          <div className="context-answer">
            <div className="number-entry">
              <label htmlFor={`answer-${blockIndex}-${currentTask}`}>{textOf(UI.answer, lang)}</label>
              <input
                id={`answer-${blockIndex}-${currentTask}`}
                className={`${wrong ? 'wrong' : ''} ${currentSolved ? 'correct' : ''}`}
                inputMode="decimal"
                value={currentSolved ? String(answerNumber) : input}
                disabled={currentSolved}
                placeholder="?"
                onChange={(event) => {
                  setInput(event.target.value)
                  setWrong(false)
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && input.trim() && selected) {
                    submit({ choice: selected, value: input })
                  }
                }}
              />
              <span className="answer-unit">{textOf(activeTask.unit, lang)}</span>
              <button
                type="button"
                className="btn-white-accent compact"
                disabled={!input.trim() || !selected || currentSolved}
                onClick={() => submit({ choice: selected, value: input })}
              >
                {textOf(UI.check, lang)}
              </button>
            </div>
          </div>
        )}
        {wrong && (
          <div className="wrong-hint" role="status">
            <span>{wrongLevel}</span>
            <div>
              <small>{textOf(wrongLevel === 1
                ? L('1-yordam', 'Подсказка 1', 'Hint 1')
                : L('2-yordam', 'Подсказка 2', 'Hint 2'), lang)}</small>
              <strong>{textOf(wrongLevel === 1 ? activeTask.hint1 : activeTask.hint2, lang)}</strong>
            </div>
          </div>
        )}
      </div>
      <div className={`solution-panel ${currentSolved ? 'visible' : ''}`} aria-live="polite">
        <div className="solution-icon">✓</div>
        <div className="solution-copy">
          <small>{textOf(UI.correct, lang)} · {textOf(UI.solution, lang)}</small>
          <strong>{textOf(activeTask.solution, lang)}</strong>
          <TaskMathVisual spec={activeTask.solutionMath} compact solved />
        </div>
        {currentTask < tasks.length - 1 ? (
          <button type="button" className="btn-white-accent compact" onClick={moveToNext}>
            {textOf(UI.nextTask, lang)} →
          </button>
        ) : (
          <span className="complete-badge">{textOf(UI.done, lang)}</span>
        )}
      </div>
    </div>
  )
}

function Summary({ answers, studentName }) {
  const lang = useLang()
  const practiceAnswers = answers.slice(PRACTICE_START, PRACTICE_START + PRACTICE_BLOCKS.length)
  const allItems = practiceAnswers.flatMap((block) => block?.items?.filter((item) => !item.pending) ?? [])
  const correct = allItems.filter((item) => item.correct).length
  const firstTry = allItems.filter((item) => item.correct && item.firstTry).length
  const revisions = allItems.filter((item) => item.correct && !item.firstTry).length
  const total = PRACTICE_BLOCKS.length * 6
  const name = studentName ? `${studentName}, ` : ''
  const prediction = answers[0]
  const predictionCorrect = prediction?.studentAnswer === 1
  const [recall, setRecall] = useState({ formula: null, restrictions: null, quadrants: null })
  const [recallChecked, setRecallChecked] = useState(false)
  const recallComplete = Object.values(recall).every(Boolean)
  const recallScore = [
    recall.formula === 'k',
    recall.restrictions === 'both',
    recall.quadrants === 'negative',
  ].filter(Boolean).length
  const blockStats = PRACTICE_BLOCKS.map((_, index) => {
    const items = practiceAnswers[index]?.items?.filter((item) => item.correct) ?? []
    return {
      index,
      firstTry: items.filter((item) => item.firstTry).length,
      completed: items.length,
    }
  })
  const weakest = blockStats.reduce(
    (current, block) => (block.firstTry < current.firstTry ? block : current),
    blockStats[0] ?? { index: 0, firstTry: 0 },
  )
  const recommendations = [
    L("O'zgarmas ko'paytma va jadvalni takrorlang.", 'Повторите постоянное произведение и таблицы.', 'Review constant products and tables.'),
    L("Ishora va nolga oid cheklovlarni takrorlang.", 'Повторите знаки и ограничения, связанные с нулём.', 'Review signs and zero restrictions.'),
    L("Grafik, nuqtalar va asimptotalarni takrorlang.", 'Повторите графики, точки и асимптоты.', 'Review graphs, points, and asymptotes.'),
    L("Nuqtadan to'liq model tuzishni takrorlang.", 'Повторите построение полной модели по точке.', 'Review building a full model from a point.'),
    L("Hayotiy vaziyatlarda invariantni topishni takrorlang.", 'Повторите поиск инварианта в практических ситуациях.', 'Review finding the invariant in real situations.'),
  ]
  const setRecallValue = (key, value) => {
    setRecall((previous) => ({ ...previous, [key]: value }))
    setRecallChecked(false)
  }
  return (
    <div className="summary-layout">
      <div className="summary-score frame">
        <div className="score-ring" style={{ '--score': `${Math.round((correct / total) * 100)}%` }}>
          <span>{correct}</span><small>/ {total}</small>
        </div>
        <div>
          <h2>
            {name}
            {correct === total
              ? textOf(L('barcha topshiriqlar bajarildi.', 'все задания выполнены.', 'all tasks are complete.'), lang)
              : textOf(L('natijangiz saqlandi.', 'ваш результат сохранён.', 'your progress is saved.'), lang)}
          </h2>
          <div className="mastery-metrics">
            <span><b>{correct}/{total}</b>{textOf(L('bajarildi', 'выполнено', 'completed'), lang)}</span>
            <span><b>{firstTry}/{total}</b>{textOf(L('birinchi urinish', 'с первой попытки', 'first try'), lang)}</span>
            <span><b>{revisions}</b>{textOf(L('tuzatilgan javob', 'ответов исправлено', 'answers revised'), lang)}</span>
          </div>
          <p className="recommendation">
            <strong>{textOf(L('Keyingi qadam:', 'Следующий шаг:', 'Next step:'), lang)}</strong>{' '}
            {textOf(recommendations[weakest.index], lang)}
          </p>
        </div>
      </div>

      <div className="exit-ticket frame">
        <div className="exit-ticket-head">
          <div>
            <small>{textOf(L('1 daqiqalik yakun', 'Итог за 1 минуту', 'One-minute exit ticket'), lang)}</small>
            <strong>{textOf(L('Qoidani xotiradan tiklang', 'Восстановите правило по памяти', 'Recall the rule from memory'), lang)}</strong>
          </div>
          <span>{recallChecked ? `${recallScore}/3` : '—/3'}</span>
        </div>
        <div className="recall-grid">
          <div>
            <span><MathVar>y</MathVar> = <MathFraction numerator="?" denominator={<MathVar>x</MathVar>} compact /></span>
            <div>
              {['k', 'x', '0'].map((value) => (
                <button
                  type="button"
                  key={value}
                  className={recall.formula === value ? 'active' : ''}
                  onClick={() => setRecallValue('formula', value)}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span>{textOf(L('Cheklovlar', 'Ограничения', 'Restrictions'), lang)}</span>
            <div>
              <button type="button" className={recall.restrictions === 'x' ? 'active' : ''} onClick={() => setRecallValue('restrictions', 'x')}>x ≠ 0</button>
              <button type="button" className={recall.restrictions === 'both' ? 'active' : ''} onClick={() => setRecallValue('restrictions', 'both')}>x ≠ 0, y ≠ 0</button>
            </div>
          </div>
          <div>
            <span>k &lt; 0</span>
            <div>
              <button type="button" className={recall.quadrants === 'positive' ? 'active' : ''} onClick={() => setRecallValue('quadrants', 'positive')}>I, III</button>
              <button type="button" className={recall.quadrants === 'negative' ? 'active' : ''} onClick={() => setRecallValue('quadrants', 'negative')}>II, IV</button>
            </div>
          </div>
        </div>
        <button
          type="button"
          className="btn-white-accent compact exit-check"
          disabled={!recallComplete}
          onClick={() => setRecallChecked(true)}
        >
          {textOf(L('Yakuniy qoidani tekshirish', 'Проверить итоговое правило', 'Check the final rule'), lang)}
        </button>
      </div>

      <div className={`rule-final ${recallChecked ? 'is-revealed' : ''}`}>
        <div>
          <small>{textOf(L('FORMULA', 'ФОРМУЛА', 'FORMULA'), lang)}</small>
          <InverseFormula compact />
        </div>
        <div>
          <small>{textOf(L('INVARIANT', 'ИНВАРИАНТ', 'INVARIANT'), lang)}</small>
          <ConstantProduct compact />
        </div>
        <div>
          <small>{textOf(L('CHEKLOVLAR', 'ОГРАНИЧЕНИЯ', 'RESTRICTIONS'), lang)}</small>
          <strong>k ≠ 0<br />x ≠ 0, y ≠ 0</strong>
        </div>
        <div>
          <small>{textOf(L('GRAFIK', 'ГРАФИК', 'GRAPH'), lang)}</small>
          <strong>{textOf(L('giperbola; o‘qlar — asimptotalar', 'гипербола; оси — асимптоты', 'hyperbola; axes are asymptotes'), lang)}</strong>
        </div>
      </div>
      <div className="return-hook">
        <div className="mini-rect rect-b"><span>8 × 3</span></div>
        <div>
          <small>{textOf(L('Boshidagi savol', 'Вопрос из начала', 'Opening question'), lang)}</small>
          <strong>8 · 3 = 24</strong>
          <p>{textOf(L(
            "En 2 marta oshsa, bo'yi 2 marta kamayadi, chunki x · y = 24 o'zgarmaydi.",
            'Если ширина удваивается, высота уменьшается вдвое, потому что x · y = 24 остаётся постоянным.',
            'When width doubles, height is halved because x · y = 24 stays constant.',
          ), lang)}</p>
          {prediction && (
            <span className={`prediction-check ${predictionCorrect ? 'confirmed' : 'revised'}`}>
              {predictionCorrect
                ? textOf(L('Taxmin tasdiqlandi ✓', 'Прогноз подтвердился ✓', 'Prediction confirmed ✓'), lang)
                : textOf(L('Taxmin qoida yordamida tuzatildi', 'Прогноз уточнён с помощью правила', 'Prediction revised using the rule'), lang)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function LessonBody({ screen, audio, storedAnswer, answers, onAnswer, studentName }) {
  if (screen === 0) return <HookVisual onAnswer={onAnswer} />
  if (screen === 1) return <RectangleLab phase={audio.phase} />
  if (screen === 2) return <TableModel phase={audio.phase} />
  if (screen === 3) return <FormulaBuild phase={audio.phase} />
  if (screen === 4) return <DomainModel phase={audio.phase} />
  if (screen === 5) return <PointsModel phase={audio.phase} />
  if (screen === 6) return <GraphSignModel phase={audio.phase} />
  if (screen === 7) return <Passport phase={audio.phase} />
  if (screen === 8) return <WorkedExample phase={audio.phase} pushOneOff={audio.pushOneOff} />
  if (screen >= PRACTICE_START && screen < PRACTICE_START + PRACTICE_BLOCKS.length) {
    return (
      <PracticeBlock
        blockIndex={screen - PRACTICE_START}
        storedAnswer={storedAnswer}
        onAnswer={onAnswer}
        pushOneOff={audio.pushOneOff}
      />
    )
  }
  return <Summary answers={answers} studentName={studentName} />
}

function LessonScreen({ screen, answers, onAnswer, onPrev, onNext, onFinish, studentName }) {
  const lang = useLang()
  const content = SCREEN_CONTENT[screen]
  const audio = useNarration(content.audio, lang)
  return (
    <Stage
      screen={screen}
      content={content}
      audio={audio}
      onPrev={onPrev}
      onNext={onNext}
      onFinish={onFinish}
    >
      <PhaseDots count={content.audio.length} active={audio.phase} />
      <LessonBody
        screen={screen}
        audio={audio}
        storedAnswer={answers[screen]}
        answers={answers}
        onAnswer={onAnswer}
        studentName={studentName}
      />
    </Stage>
  )
}

export default function InverseProportionLesson({
  studentName,
  lang: langProp,
  onFinished,
}) {
  const lang = ['uz', 'ru', 'en'].includes(langProp) ? langProp : 'uz'
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState([])
  const startTimeRef = useRef(null)
  const finishedRef = useRef(false)
  const visitedRef = useRef(new Set([0]))

  useEffect(() => {
    startTimeRef.current = Date.now()
  }, [])

  const recordAnswer = useCallback((payload) => {
    setAnswers((previous) => {
      const next = [...previous]
      next[current] = payload
      return next
    })
  }, [current])

  const next = useCallback(() => {
    setCurrent((previous) => {
      const value = Math.min(TOTAL_SCREENS - 1, previous + 1)
      visitedRef.current.add(value)
      return value
    })
  }, [])

  const previous = useCallback(() => {
    setCurrent((screen) => {
      const value = Math.max(0, screen - 1)
      visitedRef.current.add(value)
      return value
    })
  }, [])

  const finishLesson = useCallback(() => {
    if (finishedRef.current) return
    finishedRef.current = true
    const completedAt = Date.now()
    const practiceBlocks = answers.slice(PRACTICE_START, PRACTICE_START + PRACTICE_BLOCKS.length)
    const flatAnswers = practiceBlocks.flatMap((block) => block?.items?.filter((item) => !item.pending) ?? [])
    const correctAnswers = flatAnswers.filter((item) => item.correct).length
    const firstTryCorrect = flatAnswers.filter((item) => item.correct && item.firstTry).length
    const totalQuestions = PRACTICE_BLOCKS.length * 6
    const finalItems = answers[13]?.items?.filter((item) => !item.pending) ?? []
    const finalScore = finalItems.filter((item) => item.correct).length
    const finalTotal = 6
    const payload = {
      lessonId: LESSON_META.lessonId,
      lessonTitle: textOf(LESSON_META.lessonTitle, lang),
      lessonTitleI18n: LESSON_META.lessonTitle,
      grade: 8,
      studentName: studentName || null,
      lang,
      startedAt: new Date(startTimeRef.current ?? completedAt).toISOString(),
      completedAt: new Date(completedAt).toISOString(),
      durationSec: Math.max(1, Math.floor((completedAt - (startTimeRef.current ?? completedAt)) / 1000)),
      totalScreens: TOTAL_SCREENS,
      visitedScreens: Array.from(visitedRef.current).map((screen) => screen + 1),
      totalQuestions,
      answeredQuestions: flatAnswers.length,
      correctAnswers,
      firstTryCorrect,
      scorePercent: Math.round((correctAnswers / totalQuestions) * 100),
      finalScore,
      finalTotal,
      passed: finalScore === finalTotal,
      answers: flatAnswers,
      screenResults: answers.filter(Boolean),
    }
    if (onFinished) onFinished(payload)
    else console.log('[Grade 8 · Dars 07 preview]', payload)
  }, [answers, lang, onFinished, studentName])

  return (
    <LangContext.Provider value={lang}>
      <style>{STYLES}</style>
      <div className="g8-inverse-root">
        <div className="ambient" aria-hidden="true">
          <i /><i /><i />
        </div>
        <LessonScreen
          key={`screen-${current}`}
          screen={current}
          answers={answers}
          onAnswer={recordAnswer}
          onPrev={previous}
          onNext={next}
          onFinish={finishLesson}
          studentName={studentName}
        />
      </div>
    </LangContext.Provider>
  )
}

const STYLES = `
html:has(.g8-inverse-root),
body:has(.g8-inverse-root),
#root:has(.g8-inverse-root),
.lesson-page:has(.g8-inverse-root),
.lesson-frame:has(.g8-inverse-root) {
  width: 100%;
  height: 100%;
  min-height: 0 !important;
  overflow: hidden !important;
}
html, body { margin: 0; padding: 0; }
.g8-inverse-root, .g8-inverse-root * { box-sizing: border-box; }
.g8-inverse-root {
  --bg: #F6F4EF;
  --paper: #FFFFFF;
  --ink: #0E0E10;
  --ink-2: #5A5A60;
  --ink-3: #A7A6A2;
  --accent: #FF4F28;
  --accent-soft: #FFE8E1;
  --success: #1F7A4D;
  --success-soft: #E3F0E8;
  --blue: #019ACB;
  --blue-soft: #EAF6FB;
  --tip: #D8A93A;
  position: fixed;
  inset: 0;
  isolation: isolate;
  overflow: hidden;
  color: var(--ink);
  background: var(--bg);
  font-family: Manrope, Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  -webkit-font-smoothing: antialiased;
}
.g8-inverse-root button, .g8-inverse-root input { font: inherit; }
.g8-inverse-root button { -webkit-tap-highlight-color: transparent; }
.ambient { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: -1; }
.ambient i { position: absolute; display: block; border-radius: 50%; background: radial-gradient(circle, rgba(255,79,40,.08), rgba(255,79,40,0)); animation: ambient-float 14s ease-in-out infinite; }
.ambient i:nth-child(1) { width: 120px; height: 120px; left: 3%; top: 12%; }
.ambient i:nth-child(2) { width: 180px; height: 180px; right: 1%; bottom: 4%; animation-delay: -5s; background: radial-gradient(circle, rgba(1,154,203,.07), rgba(1,154,203,0)); }
.ambient i:nth-child(3) { width: 80px; height: 80px; left: 46%; top: 60%; animation-delay: -9s; }

.stage { width: 100%; max-width: 936px; height: 100dvh; margin: 0 auto; display: flex; flex-direction: column; }
.stage-header { flex: 0 0 auto; padding: 15px clamp(20px, 5vw, 74px) 9px; background: rgba(246,244,239,.96); }
.progress-track { height: 6px; margin-bottom: 12px; overflow: hidden; border-radius: 99px; background: rgba(167,166,162,.28); }
.progress-track span { display: block; height: 100%; border-radius: inherit; background: var(--accent); box-shadow: 0 0 10px rgba(255,79,40,.48); transition: width .45s cubic-bezier(.4,0,.2,1); }
.chrome { display: flex; align-items: center; justify-content: space-between; gap: 18px; }
.eyebrow { display: flex; align-items: center; gap: 9px; color: var(--accent); font-size: 11px; font-weight: 750; letter-spacing: .18em; text-transform: uppercase; }
.dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 9px rgba(255,79,40,.58); }
.chrome-right, .audio-tools { display: flex; align-items: center; }
.chrome-right { gap: 12px; }
.audio-tools { gap: 2px; }
.counter { font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 13px; font-weight: 750; white-space: nowrap; }
.icon-button { display: grid; width: 30px; height: 30px; padding: 5px; place-items: center; border: 0; border-radius: 9px; color: var(--ink-2); background: transparent; cursor: pointer; transition: background .2s, color .2s; }
.icon-button:hover { color: var(--accent); background: var(--paper); }
.icon-button svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.speaker-live { animation: speaker-breathe 1.2s ease-in-out infinite; }
.audio-pulse { width: 5px; height: 5px; border-radius: 50%; background: var(--ink-3); }
.audio-pulse.is-live { background: var(--blue); box-shadow: 0 0 8px rgba(1,154,203,.7); animation: dot-pulse 1s ease-in-out infinite; }

.stage-content { flex: 1 1 auto; min-height: 0; overflow-y: auto; overflow-x: hidden; padding: 12px clamp(20px, 5vw, 74px) 28px; scrollbar-width: thin; scrollbar-color: rgba(167,166,162,.5) transparent; }
.screen-heading { max-width: 820px; margin-bottom: 15px; animation: fade-up .42s ease both; }
.screen-heading h1 { margin: 0; font-family: Fraunces, Georgia, serif; font-size: clamp(26px, 4.1vw, 38px); font-weight: 560; line-height: 1.12; letter-spacing: -.025em; }
.screen-heading p { max-width: 720px; margin: 8px 0 0; color: var(--ink-2); font-size: clamp(13px, 1.7vw, 15px); line-height: 1.5; }
.phase-dots { display: flex; gap: 6px; margin: 0 0 13px; }
.phase-dots span { width: 18px; height: 3px; border-radius: 99px; background: rgba(167,166,162,.35); transition: width .35s, background .35s, box-shadow .35s; }
.phase-dots span.active { width: 34px; background: var(--accent); box-shadow: 0 0 7px rgba(255,79,40,.4); }
.stage-nav { flex: 0 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 11px clamp(20px, 5vw, 74px) 13px; border-top: 1px solid rgba(167,166,162,.22); background: rgba(246,244,239,.98); }
.btn-white-accent, .btn-ghost { min-height: 42px; padding: 9px 17px; border: none; border-radius: 12px; font-weight: 700; cursor: pointer; transition: transform .2s, background .2s, color .2s, box-shadow .2s, opacity .2s; }
.btn-white-accent { color: var(--accent); background: var(--paper); box-shadow: 0 8px 22px -4px rgba(255,79,40,.34), 0 0 0 1px rgba(255,79,40,.12); }
.btn-white-accent:hover:not(:disabled) { color: white; background: var(--accent); transform: translateY(-1px); box-shadow: 0 12px 28px -6px rgba(255,79,40,.52); }
.btn-ghost { color: var(--ink); background: transparent; }
.btn-ghost:hover:not(:disabled) { background: var(--paper); box-shadow: 0 6px 18px -6px rgba(58,53,48,.18); }
.btn-white-accent:disabled, .btn-ghost:disabled { cursor: not-allowed; opacity: .4; transform: none; box-shadow: none; }
.btn-white-accent.compact { min-height: 38px; padding: 7px 13px; font-size: 12px; }

.frame { border: none; border-radius: 16px; background: var(--paper); box-shadow: 0 8px 22px -6px rgba(58,53,48,.14); }
.frame-success { display: flex; align-items: center; gap: 12px; padding: 14px 17px; border-left: 4px solid var(--success); border-radius: 12px; color: var(--success); background: var(--success-soft); box-shadow: 0 6px 16px -6px rgba(31,122,77,.22); }
.frame-success span { color: var(--ink); font-size: 13px; line-height: 1.45; }

.hook-grid { display: grid; grid-template-columns: 1.08fr .92fr; gap: 16px; align-items: stretch; animation: fade-up .45s .08s ease both; }
.hook-model { position: relative; min-height: 274px; padding: 24px; display: grid; place-items: center; overflow: hidden; }
.area-label { position: absolute; top: 17px; left: 18px; padding: 6px 10px; border-radius: 99px; color: var(--accent); background: var(--accent-soft); font-family: "JetBrains Mono", monospace; font-size: 12px; font-weight: 750; }
.rect-pair { display: flex; align-items: center; justify-content: center; gap: 16px; width: 100%; }
.rect-pair > div { display: grid; justify-items: center; gap: 9px; }
.rect-pair small { color: var(--ink-2); font-family: "JetBrains Mono", monospace; font-size: 11px; }
.mini-rect { display: grid; place-items: center; color: var(--accent); border: 2px solid var(--accent); background: repeating-linear-gradient(0deg, transparent 0 18px, rgba(255,79,40,.08) 18px 19px), repeating-linear-gradient(90deg, transparent 0 18px, rgba(255,79,40,.08) 18px 19px); box-shadow: 0 10px 25px -12px rgba(255,79,40,.48); transition: width .5s, height .5s; }
.mini-rect span { padding: 5px 8px; border-radius: 8px; background: rgba(255,255,255,.88); font-family: "JetBrains Mono", monospace; font-size: 12px; font-weight: 800; }
.rect-a { width: 112px; height: 145px; }
.rect-b { width: 168px; height: 72px; animation: rect-breathe 2.8s ease-in-out infinite; }
.morph-arrow { color: var(--accent); font-size: 24px; animation: arrow-nudge 1.5s ease-in-out infinite; }
.choice-stack { display: flex; flex-direction: column; gap: 9px; }
.option { width: 100%; min-height: 51px; padding: 10px 13px; display: flex; align-items: center; gap: 11px; border: 0; border-radius: 12px; color: var(--ink); background: var(--paper); box-shadow: 0 6px 16px -6px rgba(58,53,48,.14); cursor: pointer; text-align: left; transition: transform .2s, background .2s, box-shadow .2s; }
.option:hover { transform: translateY(-1px); box-shadow: 0 10px 22px -6px rgba(58,53,48,.22); }
.option > span { flex: 0 0 28px; display: grid; width: 28px; height: 28px; place-items: center; border-radius: 8px; color: var(--ink-3); background: var(--bg); font: 700 12px "JetBrains Mono", monospace; }
.option.selected { color: var(--accent); background: #FFF3EF; box-shadow: inset 0 0 0 2px var(--accent), 0 8px 20px -6px rgba(255,79,40,.3); }
.option.selected > span { color: white; background: var(--accent); }
.micro-note { margin: 4px 2px 0; color: var(--ink-2); font-size: 11px; line-height: 1.45; }

.lab-grid, .table-layout, .graph-layout { display: grid; grid-template-columns: 1.25fr .75fr; gap: 16px; align-items: stretch; animation: fade-up .45s .08s ease both; }
.rectangle-stage {
  --lab-unit: 20px;
  min-height: 356px;
  padding: 13px 18px;
  display: grid;
  grid-template-rows: auto 1fr auto;
  justify-items: center;
  gap: 8px;
  overflow: hidden;
  background-image:
    linear-gradient(rgba(167,166,162,.12) 1px, transparent 1px),
    linear-gradient(90deg, rgba(167,166,162,.12) 1px, transparent 1px);
  background-size: 20px 20px;
}
.rectangle-stage-note {
  justify-self: start;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 9px;
  border-radius: 9px;
  color: var(--accent);
  background: rgba(255,255,255,.9);
  box-shadow: 0 5px 14px -7px rgba(58,53,48,.22);
}
.rectangle-stage-note strong { font: 800 11px "JetBrains Mono", monospace; }
.rectangle-stage-note span { color: var(--ink-2); font-size: 9px; font-weight: 700; }
.rectangle-visual { width: 100%; min-height: 230px; display: grid; place-items: center; }
.dynamic-rectangle {
  position: relative;
  box-sizing: content-box;
  min-width: 0;
  min-height: 0;
  max-width: 92%;
  max-height: 252px;
  overflow: hidden;
  border: 3px solid var(--accent);
  border-radius: 5px;
  background: #fff1ec;
  box-shadow: 0 12px 30px -12px rgba(255,79,40,.5);
  animation: rectangle-grid-reveal .24s ease-out both;
}
.rectangle-cells {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: repeat(var(--cell-columns), var(--lab-unit));
  grid-auto-rows: var(--lab-unit);
  pointer-events: none;
}
.rectangle-cells > i {
  width: var(--lab-unit);
  height: var(--lab-unit);
  border-right: 1px solid rgba(255,79,40,.12);
  border-bottom: 1px solid rgba(255,79,40,.12);
}
.area-core {
  position: absolute;
  z-index: 1;
  left: 50%;
  top: 50%;
  padding: 4px 7px;
  border-radius: 7px;
  color: var(--accent);
  background: rgba(255,255,255,.94);
  box-shadow: 0 4px 12px -6px rgba(58,53,48,.22);
  font: 800 15px "JetBrains Mono", monospace;
  white-space: nowrap;
  transform: translate(-50%,-50%);
}
.dynamic-rectangle.is-compact .area-core { padding: 3px 5px; font-size: 11px; }
.rectangle-measures {
  display: grid;
  grid-template-columns: minmax(82px, auto) auto minmax(82px, auto);
  align-items: center;
  gap: 8px;
}
.rectangle-measures > span {
  min-height: 34px;
  padding: 6px 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border-radius: 9px;
  color: var(--ink-2);
  background: rgba(255,255,255,.94);
  box-shadow: 0 5px 14px -7px rgba(58,53,48,.22);
}
.rectangle-measures > span b { color: var(--accent); font: 800 13px "JetBrains Mono", monospace; }
.rectangle-measures > i { color: var(--success); font: 800 10px "JetBrains Mono", monospace; font-style: normal; white-space: nowrap; }
.control-card { padding: 12px; display: flex; flex-direction: column; justify-content: flex-start; gap: 6px; }
.metric-row { display: flex; align-items: center; justify-content: space-between; color: var(--ink-2); }
.metric-row strong { color: var(--accent); font: 800 24px "JetBrains Mono", monospace; }
.control-card input[type="range"] {
  width: 100%;
  height: 26px;
  margin: 0;
  appearance: none;
  -webkit-appearance: none;
  border: 0;
  outline: 0;
  background: transparent;
  cursor: grab;
}
.control-card input[type="range"]::-webkit-slider-runnable-track {
  height: 6px;
  border-radius: 99px;
  background: linear-gradient(
    to right,
    var(--accent) 0 var(--range-progress),
    rgba(167,166,162,.35) var(--range-progress) 100%
  );
}
.control-card input[type="range"]::-webkit-slider-thumb {
  width: 20px;
  height: 20px;
  margin-top: -7px;
  -webkit-appearance: none;
  border: 3px solid var(--paper);
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 4px 12px -4px rgba(255,79,40,.7);
}
.control-card input[type="range"]::-moz-range-track {
  height: 6px;
  border-radius: 99px;
  background: rgba(167,166,162,.35);
}
.control-card input[type="range"]::-moz-range-progress {
  height: 6px;
  border-radius: 99px;
  background: var(--accent);
}
.control-card input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border: 3px solid var(--paper);
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 4px 12px -4px rgba(255,79,40,.7);
}
.equation-line {
  min-height: 86px;
  padding: 7px 10px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 3px;
  border-radius: 11px;
  background: var(--bg);
}
.equation-line > small { color: var(--ink-2); font-size: 9px; font-weight: 750; letter-spacing: .04em; }
.equation-line > .math-equation { font-size: 21px; }
.equation-line strong { color: var(--accent); }
.equation-check {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: var(--success);
}
.equation-check > span { font-size: 11px; font-weight: 900; }
.equation-check > .math-equation { font-size: 13px; }
.invariant-badge { min-height: 40px; padding: 6px 9px; border-radius: 9px; opacity: 0; color: var(--success); background: var(--success-soft); font-size: 11px; font-weight: 700; text-align: center; transform: translateY(6px); transition: opacity .4s, transform .4s; }
.invariant-badge.visible { opacity: 1; transform: none; }

.table-layout { grid-template-columns: 1.35fr .65fr; }
.math-table { padding: 15px; overflow-x: auto; }
.table-row { min-width: 500px; display: grid; grid-template-columns: 72px repeat(6, 1fr); }
.table-row span { min-height: 54px; display: grid; place-items: center; border-right: 1px solid rgba(167,166,162,.18); border-bottom: 1px solid rgba(167,166,162,.18); font: 650 15px "JetBrains Mono", monospace; transition: background .4s, color .4s, transform .4s; }
.table-row span:first-child { color: var(--ink-2); background: var(--bg); font-weight: 800; }
.table-row.header span:not(:first-child) { color: var(--accent); }
.table-row:last-child span { border-bottom: 0; }
.table-row span:last-child { border-right: 0; }
.table-row span.lit { color: var(--success); background: var(--success-soft); transform: scale(.94); }
.table-row.product span.lit { color: var(--accent); background: var(--accent-soft); }
.pattern-card { padding: 22px 18px; display: flex; flex-direction: column; justify-content: center; gap: 13px; }
.ratio-motion { display: grid; grid-template-columns: 38px 1fr 24px 38px; align-items: center; gap: 6px; padding: 10px; border-radius: 11px; background: var(--blue-soft); color: var(--blue); font-family: "JetBrains Mono", monospace; }
.ratio-motion.inverse { color: var(--accent); background: var(--accent-soft); }
.ratio-motion span { font-weight: 800; }
.ratio-motion b { font-size: 12px; }
.ratio-motion i { font-style: normal; animation: arrow-nudge 1.5s ease-in-out infinite; }
.pattern-card p { color: var(--ink-2); font-size: 12px; line-height: 1.5; }
.pair-selector { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; }
.pair-selector button { min-height: 36px; padding: 6px 4px; border: 0; border-radius: 8px; color: var(--ink-2); background: var(--bg); cursor: pointer; font: 700 10px "JetBrains Mono", monospace; transition: color .2s, background .2s, box-shadow .2s, transform .2s; }
.pair-selector button.active { color: var(--accent); background: var(--accent-soft); box-shadow: inset 0 0 0 1px rgba(255,79,40,.24); transform: translateY(-1px); }

.formula-build { min-height: 310px; padding: 26px; display: grid; grid-template-columns: 1fr 100px 1fr; grid-template-rows: 1fr auto; gap: 18px; align-items: center; border-radius: 18px; background: var(--paper); box-shadow: 0 8px 22px -6px rgba(58,53,48,.14); }
.formula-step { min-height: 150px; display: grid; place-items: center; align-content: center; gap: 12px; border-radius: 15px; opacity: .22; background: var(--bg); transform: translateY(10px); transition: opacity .5s, transform .5s, box-shadow .5s; }
.formula-step.show { opacity: 1; transform: none; }
.formula-step.result { background: var(--accent-soft); }
.formula-step small { color: var(--ink-2); font-size: 12px; }
.formula-step strong, .formula-hero { font-family: Fraunces, Georgia, serif; font-size: clamp(34px, 6vw, 54px); font-weight: 500; }
.operator-arrow { display: grid; justify-items: center; gap: 9px; opacity: .2; transform: scale(.8); transition: opacity .4s, transform .4s; }
.operator-arrow.show { opacity: 1; transform: none; }
.operator-arrow button { min-width: 48px; min-height: 42px; padding: 6px 9px; border: 0; border-radius: 9px; color: var(--blue); background: var(--blue-soft); cursor: pointer; font: 800 12px "JetBrains Mono", monospace; box-shadow: inset 0 0 0 1px rgba(1,154,203,.16); transition: transform .2s, color .2s, background .2s; }
.operator-arrow button:hover, .operator-arrow button.used { color: white; background: var(--blue); transform: scale(1.05); }
.operator-arrow b { color: var(--accent); font-size: 28px; }
.fraction { display: inline-grid; grid-template-rows: 1fr 1fr; vertical-align: middle; line-height: 1; }
.fraction i { min-width: 38px; padding: 2px 7px; font-style: normal; text-align: center; }
.fraction i:first-child { border-bottom: 2px solid currentColor; }
.rule-strip { grid-column: 1 / -1; display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 13px 16px; border-radius: 11px; opacity: 0; color: var(--success); background: var(--success-soft); transform: translateY(8px); transition: opacity .45s, transform .45s; }
.rule-strip.show { opacity: 1; transform: none; }
.rule-strip b { font-size: 11px; letter-spacing: .12em; }
.rule-strip span { font: 800 18px "JetBrains Mono", monospace; }

.domain-layout { display: grid; gap: 15px; animation: fade-up .45s .08s ease both; }
.value-cards { padding: 18px; display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
.value-card { min-height: 125px; display: grid; place-items: center; align-content: center; gap: 8px; border: 0; border-radius: 12px; color: var(--ink); background: var(--bg); cursor: pointer; transition: transform .3s, background .3s, box-shadow .3s; }
.value-card span { color: var(--ink-2); font: 700 12px "JetBrains Mono", monospace; }
.value-card strong { font: 800 19px "JetBrains Mono", monospace; }
.value-card small { color: var(--success); font-size: 11px; }
.value-card.forbidden { color: var(--accent); background: var(--accent-soft); }
.value-card.forbidden small { color: var(--accent); }
.value-card.forbidden.pulse { animation: forbidden-pulse 1.7s ease-in-out infinite; }
.value-card.selected { transform: translateY(-3px); box-shadow: 0 10px 22px -8px rgba(58,53,48,.28), inset 0 0 0 2px currentColor; }
.domain-rule { display: grid; grid-template-columns: auto auto 1fr; align-items: center; gap: 16px; padding: 14px 18px; border-left: 4px solid var(--accent); border-radius: 12px; opacity: .25; background: var(--paper); transform: translateY(8px); transition: opacity .45s, transform .45s; }
.domain-rule.show { opacity: 1; transform: none; }
.domain-rule span, .domain-rule strong { font: 800 19px "JetBrains Mono", monospace; }
.domain-rule strong { color: var(--accent); }
.domain-rule p { color: var(--ink-2); font-size: 13px; text-align: right; }

.graph-layout { grid-template-columns: 1.35fr .65fr; }
.graph-frame { min-height: 305px; padding: 12px; display: grid; place-items: center; overflow: hidden; }
.coordinate-graph { width: 100%; max-height: 305px; }
.coordinate-graph text { fill: var(--ink-2); font: 700 11px "JetBrains Mono", monospace; }
.axis, .axis-arrow { fill: none; stroke: var(--ink-2); stroke-width: 1.4; }
.hyperbola path { fill: none; stroke: var(--accent); stroke-width: 3; stroke-linecap: round; stroke-dasharray: 420; stroke-dashoffset: 420; filter: drop-shadow(0 0 4px rgba(255,79,40,.42)); }
.hyperbola.draw path { animation: draw-curve 1.4s .15s ease forwards; }
.graph-point { opacity: 0; fill: var(--blue); stroke: white; stroke-width: 2; transform-box: fill-box; transform-origin: center; }
.graph-point.show { animation: point-pop .45s var(--delay) cubic-bezier(.34,1.5,.64,1) forwards; }
.origin-gap { fill: var(--bg); stroke: var(--accent); stroke-width: 2; }
.point-list, .sign-panel { display: flex; flex-direction: column; justify-content: center; gap: 9px; }
.point-list > div { padding: 9px 11px; display: flex; align-items: center; justify-content: space-between; border-radius: 10px; opacity: .2; background: var(--paper); box-shadow: 0 6px 16px -6px rgba(58,53,48,.13); transform: translateX(8px); transition: opacity .45s, transform .45s; }
.point-list > div.visible { opacity: 1; transform: none; }
.point-list span { font: 750 13px "JetBrains Mono", monospace; }
.point-list small { color: var(--success); font: 650 10px "JetBrains Mono", monospace; }
.point-list p, .sign-panel p { padding: 5px 2px; color: var(--ink-2); font-size: 12px; line-height: 1.45; }
.point-control { align-self: stretch; justify-content: center; }
.segmented { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; padding: 5px; border-radius: 12px; background: rgba(167,166,162,.18); }
.segmented button { min-height: 44px; border: 0; border-radius: 9px; color: var(--ink-2); background: transparent; cursor: pointer; font: 700 12px "JetBrains Mono", monospace; transition: color .25s, background .25s, box-shadow .25s; }
.segmented button.active { color: var(--accent); background: var(--paper); box-shadow: 0 5px 14px -6px rgba(58,53,48,.28); }
.quadrant-rule { min-height: 120px; display: grid; place-items: center; align-content: center; gap: 8px; border-radius: 14px; transition: color .35s, background .35s; }
.quadrant-rule.positive { color: var(--success); background: var(--success-soft); }
.quadrant-rule.negative { color: var(--blue); background: var(--blue-soft); }
.quadrant-rule strong { font: 800 17px "JetBrains Mono", monospace; }
.quadrant-rule span { font-family: Fraunces, Georgia, serif; font-size: 34px; }

.passport-layout { display: grid; gap: 15px; animation: fade-up .45s .08s ease both; }
.passport-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 11px; }
.passport-card { min-height: 94px; padding: 15px; display: flex; align-items: center; gap: 13px; border-radius: 14px; opacity: .2; background: var(--paper); box-shadow: 0 7px 19px -7px rgba(58,53,48,.15); transform: translateY(8px); transition: opacity .45s, transform .45s; }
.passport-card.show { opacity: 1; transform: none; }
.passport-card > span { flex: 0 0 45px; display: grid; width: 45px; height: 45px; place-items: center; border-radius: 12px; color: var(--accent); background: var(--accent-soft); font: 800 19px "JetBrains Mono", monospace; }
.passport-card div { display: grid; gap: 5px; }
.passport-card strong { font-size: 14px; }
.passport-card small { color: var(--ink-2); font: 650 11px "JetBrains Mono", monospace; }
.compare-strip { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 12px; }
.compare-strip > div { padding: 12px 15px; display: grid; grid-template-columns: 1fr auto; gap: 5px 14px; border-radius: 12px; color: var(--ink-2); background: rgba(255,255,255,.62); }
.compare-strip > div.active { color: var(--accent); background: var(--accent-soft); box-shadow: 0 7px 18px -8px rgba(255,79,40,.35); }
.compare-strip small { grid-column: 1 / -1; font-size: 10px; letter-spacing: .12em; text-transform: uppercase; }
.compare-strip strong { font: 800 18px "JetBrains Mono", monospace; }
.compare-strip span { font: 700 12px "JetBrains Mono", monospace; }
.compare-strip > b { color: var(--ink-3); }

.worked-layout { display: grid; grid-template-columns: 190px 1fr; gap: 14px 17px; align-items: stretch; animation: fade-up .45s .08s ease both; }
.formula-hero { grid-row: span 2; min-height: 285px; display: flex; align-items: center; justify-content: center; border-radius: 16px; color: var(--accent); background: var(--accent-soft); box-shadow: 0 8px 22px -6px rgba(255,79,40,.2); }
.worked-steps { display: grid; gap: 8px; }
.worked-step { min-height: 59px; padding: 8px 12px; display: grid; grid-template-columns: 30px 1fr auto; align-items: center; gap: 10px; border-radius: 11px; opacity: .3; background: var(--paper); box-shadow: 0 5px 15px -7px rgba(58,53,48,.14); transform: translateX(8px); transition: opacity .45s, transform .45s, background .45s; }
.worked-step.active { opacity: 1; transform: none; }
.worked-step.active:last-child { background: var(--success-soft); }
.worked-step > span { display: grid; width: 27px; height: 27px; place-items: center; border-radius: 8px; color: var(--accent); background: var(--accent-soft); font: 800 11px "JetBrains Mono", monospace; }
.worked-step div { display: grid; gap: 2px; }
.worked-step small { color: var(--ink-2); font-size: 9px; letter-spacing: .1em; text-transform: uppercase; }
.worked-step strong, .worked-step > b { font: 700 13px "JetBrains Mono", monospace; }
.worked-step > b { color: var(--success); }
.worked-next { width: 100%; justify-content: center; }
.worked-layout .frame-success { grid-column: 2; }
.worked-layout .frame-success { transition: opacity .35s, filter .35s, transform .35s; }
.worked-layout .frame-success.is-pending { opacity: .24; filter: grayscale(.75); transform: translateY(4px); }

.practice-layout { display: grid; grid-template-columns: 52px 1fr; grid-template-rows: auto auto; gap: 12px 14px; animation: fade-up .4s .06s ease both; }
.task-rail { grid-row: 1 / span 2; display: flex; flex-direction: column; align-items: center; gap: 7px; padding: 8px 5px; border-radius: 14px; background: rgba(255,255,255,.64); }
.task-rail button { flex: 0 0 44px; width: 44px; height: 44px; border: 0; border-radius: 11px; color: var(--ink-3); background: var(--bg); cursor: pointer; font: 750 11px "JetBrains Mono", monospace; transition: color .2s, background .2s, transform .2s, box-shadow .2s; }
.task-rail button.current { color: var(--accent); background: var(--accent-soft); box-shadow: inset 0 0 0 1px rgba(255,79,40,.25); transform: scale(1.05); }
.task-rail button.solved { color: white; background: var(--success); }
.task-rail button:disabled { opacity: .34; cursor: not-allowed; }
.task-rail > span { margin-top: 3px; color: var(--ink-2); font: 700 10px "JetBrains Mono", monospace; }
.task-card { min-height: 255px; padding: 18px 20px; }
.task-card.shake { animation: shake .38s ease; }
.task-number { display: flex; justify-content: space-between; align-items: center; margin-bottom: 9px; }
.task-number span { color: var(--accent); font-size: 10px; font-weight: 800; letter-spacing: .13em; text-transform: uppercase; }
.task-number b { padding: 4px 7px; border-radius: 7px; color: var(--blue); background: var(--blue-soft); font: 700 10px "JetBrains Mono", monospace; }
.task-card h2 { margin: 0; max-width: 690px; font-family: Fraunces, Georgia, serif; font-size: clamp(20px, 3vw, 27px); font-weight: 550; line-height: 1.2; }
.task-visual { width: fit-content; min-width: 160px; margin: 12px 0; padding: 9px 13px; border-radius: 10px; color: var(--accent); background: var(--accent-soft); font: 750 15px "JetBrains Mono", monospace; }
.task-options { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.task-options button { min-height: 49px; padding: 8px 10px; display: flex; align-items: center; gap: 8px; border: 0; border-radius: 10px; color: var(--ink); background: var(--bg); cursor: pointer; text-align: left; font-size: 12px; line-height: 1.35; transition: transform .2s, background .2s, color .2s, box-shadow .2s; }
.task-options button:hover:not(:disabled) { transform: translateY(-1px); background: white; box-shadow: 0 7px 18px -8px rgba(58,53,48,.22); }
.task-options button > span { flex: 0 0 24px; display: grid; width: 24px; height: 24px; place-items: center; border-radius: 7px; color: var(--ink-3); background: white; font: 750 10px "JetBrains Mono", monospace; }
.task-options button.wrong { color: var(--accent); background: var(--accent-soft); }
.task-options button.correct { color: var(--success); background: var(--success-soft); }
.task-options button.correct > span { color: white; background: var(--success); }
.number-entry { display: flex; align-items: center; gap: 9px; }
.number-entry label { color: var(--ink-2); font-size: 11px; }
.number-entry input { width: 128px; height: 46px; padding: 7px 11px; border: 0; outline: 0; border-radius: 11px; color: var(--ink); background: var(--bg); box-shadow: inset 0 0 0 1px rgba(167,166,162,.16); font: 750 20px "JetBrains Mono", monospace; text-align: center; transition: background .2s, color .2s, box-shadow .2s; }
.number-entry input:focus { background: white; box-shadow: 0 8px 20px -8px rgba(255,79,40,.3), inset 0 0 0 1px rgba(255,79,40,.3); }
.number-entry input.wrong { color: var(--accent); background: var(--accent-soft); }
.number-entry input.correct { color: var(--success); background: var(--success-soft); }
.wrong-hint { margin-top: 11px; display: flex; align-items: center; gap: 8px; color: var(--tip); font-size: 12px; font-weight: 650; }
.wrong-hint span { display: grid; width: 24px; height: 24px; place-items: center; border-radius: 7px; color: white; background: var(--tip); }
.solution-panel { grid-column: 2; min-height: 0; max-height: 0; padding: 0 15px; overflow: hidden; display: grid; grid-template-columns: 36px 1fr auto; align-items: center; gap: 11px; border-left: 4px solid var(--success); border-radius: 12px; opacity: 0; background: var(--success-soft); transform: translateY(-7px); transition: max-height .5s, min-height .5s, padding .5s, opacity .35s .08s, transform .45s; }
.solution-panel.visible { min-height: 76px; max-height: 130px; padding: 10px 15px; opacity: 1; transform: none; }
.solution-icon { display: grid; width: 34px; height: 34px; place-items: center; border-radius: 50%; color: white; background: var(--success); font-weight: 900; animation: solution-pop .45s cubic-bezier(.34,1.5,.64,1); }
.solution-panel > div:nth-child(2) { display: grid; gap: 4px; }
.solution-panel small { color: var(--success); font-size: 9px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
.solution-panel strong { font-size: 12px; line-height: 1.4; }
.complete-badge { padding: 7px 10px; border-radius: 9px; color: var(--success); background: white; font-size: 11px; font-weight: 800; }

.summary-layout { display: grid; gap: 14px; animation: fade-up .45s .08s ease both; }
.summary-score { padding: 18px; display: grid; grid-template-columns: 105px 1fr; align-items: center; gap: 18px; }
.score-ring { --score: 0%; width: 94px; height: 94px; display: flex; align-items: baseline; justify-content: center; place-content: center; border-radius: 50%; background: radial-gradient(circle closest-side, white 78%, transparent 80% 99%), conic-gradient(var(--accent) var(--score), rgba(167,166,162,.22) 0); animation: score-in .8s ease both; }
.score-ring span { font: 800 25px "JetBrains Mono", monospace; }
.score-ring small { color: var(--ink-2); font: 700 11px "JetBrains Mono", monospace; }
.summary-score h2 { margin: 0 0 5px; font-family: Fraunces, Georgia, serif; font-size: clamp(20px, 3vw, 27px); font-weight: 560; }
.summary-score p { margin: 0; color: var(--ink-2); font-size: 12px; line-height: 1.5; }
.rule-final { display: grid; grid-template-columns: repeat(4, 1fr); gap: 9px; }
.rule-final > div { min-height: 87px; padding: 12px; display: grid; place-items: center; align-content: center; gap: 8px; border-radius: 12px; background: var(--paper); box-shadow: 0 6px 16px -6px rgba(58,53,48,.13); }
.rule-final small { color: var(--ink-2); font-size: 9px; font-weight: 800; letter-spacing: .12em; }
.rule-final strong { color: var(--accent); font: 750 16px "JetBrains Mono", monospace; text-align: center; }
.return-hook { padding: 15px 18px; display: grid; grid-template-columns: 150px 1fr; align-items: center; gap: 18px; border-radius: 14px; background: var(--accent-soft); }
.return-hook .rect-b { width: 138px; height: 58px; background-color: white; }
.return-hook > div:last-child { display: grid; gap: 4px; }
.return-hook small { color: var(--accent); font-size: 9px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
.return-hook strong { font: 800 18px "JetBrains Mono", monospace; }
.return-hook p { margin: 0; color: var(--ink-2); font-size: 12px; }
.prediction-check { display: inline-flex; width: fit-content; margin-top: 4px; padding: 5px 8px; border-radius: 8px; font-size: 10px; font-weight: 800; }
.prediction-check.confirmed { color: var(--success); background: var(--success-soft); }
.prediction-check.revised { color: var(--accent); background: var(--paper); }

/* Book-style mathematical typography */
.math-equation {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: .22em;
  color: inherit;
  font-family: Fraunces, "Cambria Math", Cambria, Georgia, serif;
  font-size: 1.2em;
  font-weight: 560;
  line-height: 1;
  white-space: nowrap;
}
.math-equation.is-compact { font-size: 1em; }
.math-var { font-family: "Cambria Math", Cambria, Georgia, serif; font-style: italic; font-weight: 500; }
.math-unit { margin-left: .22em; font-family: Manrope, Inter, sans-serif; font-size: .68em; font-style: normal; }
.math-fraction { display: inline-flex; align-items: center; gap: .08em; vertical-align: middle; }
.math-fraction-sign { align-self: center; font-size: 1.05em; }
.math-fraction-stack {
  display: inline-grid;
  grid-template-rows: auto auto;
  min-width: 1.5em;
  align-items: center;
  justify-items: stretch;
  line-height: 1;
  vertical-align: middle;
}
.math-fraction-num,
.math-fraction-den {
  min-width: 100%;
  padding: .08em .24em;
  text-align: center;
  white-space: nowrap;
}
.math-fraction-num { border-bottom: .075em solid currentColor; }
.math-fraction.is-compact .math-fraction-num,
.math-fraction.is-compact .math-fraction-den { padding: .05em .18em; }

/* Slide 1 */
.rect-question { width: 168px; height: 118px; animation: question-stretch 2.8s ease-in-out infinite; }
.hook-proof-note {
  position: absolute;
  inset: auto 18px 16px;
  color: var(--ink-2);
  font-size: 10px;
  line-height: 1.4;
  text-align: center;
}
.prediction-followup { display: grid; gap: 7px; padding: 10px; border-radius: 12px; background: rgba(255,255,255,.66); }
.prediction-followup > small { color: var(--ink-2); font-size: 10px; font-weight: 750; }
.reason-chips { display: grid; gap: 5px; }
.reason-chips button,
.confidence-row button {
  min-height: 34px;
  padding: 6px 9px;
  border: 0;
  border-radius: 9px;
  color: var(--ink-2);
  background: var(--bg);
  cursor: pointer;
  font-size: 10px;
  text-align: left;
}
.reason-chips button.active,
.confidence-row button.active { color: var(--accent); background: var(--accent-soft); box-shadow: inset 0 0 0 1px rgba(255,79,40,.24); }
.confidence-row { display: grid; grid-template-columns: auto 1fr 1fr; align-items: center; gap: 5px; }
.confidence-row > span { color: var(--ink-2); font-size: 9px; }
.confidence-row button { text-align: center; }
.prediction-saved { margin: 0; color: var(--success); font-size: 10px; font-weight: 700; }

/* Slide 2 */
.lab-mission { display: grid; gap: 6px; }
.lab-mission small { color: var(--accent); font-size: 9px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; }
.lab-mission strong { font-size: 13px; line-height: 1.35; }
.prediction-buttons, .lab-presets { display: flex; gap: 6px; }
.prediction-buttons button, .lab-presets button {
  min-height: 44px;
  flex: 1;
  border: 0;
  border-radius: 9px;
  color: var(--ink-2);
  background: var(--bg);
  cursor: pointer;
  font: 750 11px "JetBrains Mono", monospace;
}
.prediction-buttons button.correct,
.lab-presets button.active { color: var(--success); background: var(--success-soft); box-shadow: inset 0 0 0 1px rgba(31,122,77,.22); }
.prediction-buttons button.wrong { color: var(--accent); background: var(--accent-soft); }
.book-equation > .math-equation { font-size: 21px; }
.lab-history { display: flex; flex-wrap: wrap; gap: 5px; min-height: 23px; }
.lab-history span { padding: 4px 7px; border-radius: 7px; color: var(--success); background: var(--success-soft); font: 700 9px "JetBrains Mono", monospace; animation: point-pop .35s ease both; }
.invariant-badge { display: grid; gap: 3px; }
.invariant-badge strong { font: 800 13px "JetBrains Mono", monospace; }
.invariant-badge span { color: var(--ink-2); font-size: 9px; line-height: 1.25; }

/* Slide 3 */
.table-gap-question { min-width: 500px; display: flex; align-items: center; gap: 7px; padding: 11px 8px 2px; }
.table-gap-question > span { flex: 1; color: var(--ink-2); font-size: 11px; }
.table-gap-question button {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 9px;
  color: var(--ink-2);
  background: var(--bg);
  cursor: pointer;
  font-weight: 800;
}
.table-gap-question button.correct { color: var(--success); background: var(--success-soft); }
.table-gap-question button.wrong { color: var(--accent); background: var(--accent-soft); }
.ratio-motion b { display: inline-flex; align-items: center; gap: 3px; }
.table-conclusion { display: flex; align-items: center; justify-content: center; gap: 7px; min-height: 38px; padding: 7px; border-radius: 9px; opacity: .25; color: var(--success); background: var(--success-soft); transform: translateY(5px); transition: opacity .3s, transform .3s; }
.table-conclusion.show { opacity: 1; transform: none; }
.table-conclusion span { color: var(--ink-2); font-size: 10px; }

/* Slide 4 */
.formula-discovery { display: grid; grid-template-columns: .8fr 1.2fr; gap: 15px; align-items: stretch; animation: fade-up .45s .08s ease both; }
.formula-question, .algebra-steps { min-height: 305px; padding: 20px; }
.formula-question { display: grid; place-items: center; align-content: center; gap: 14px; text-align: center; }
.formula-question > small { color: var(--ink-2); font-size: 10px; letter-spacing: .1em; text-transform: uppercase; }
.formula-question > .math-equation { font-size: 34px; }
.formula-question > strong { max-width: 300px; font-size: 13px; line-height: 1.4; }
.operation-choices { display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; width: 100%; }
.operation-choices button {
  min-height: 44px;
  border: 0;
  border-radius: 10px;
  color: var(--ink);
  background: var(--bg);
  cursor: pointer;
  font: 800 15px "JetBrains Mono", monospace;
}
.operation-choices button.correct { color: var(--success); background: var(--success-soft); }
.operation-choices button.wrong { color: var(--accent); background: var(--accent-soft); }
.formula-hint { margin: 0; color: var(--tip); font-size: 11px; line-height: 1.4; }
.algebra-steps { display: flex; flex-direction: column; justify-content: center; gap: 10px; opacity: .3; transition: opacity .35s; }
.algebra-steps.is-active { opacity: 1; }
.algebra-row { min-height: 76px; padding: 10px 12px; display: grid; grid-template-columns: 28px 1fr auto; align-items: center; gap: 10px; border-radius: 12px; background: var(--bg); }
.algebra-row > span:first-child { display: grid; width: 27px; height: 27px; place-items: center; border-radius: 8px; color: var(--accent); background: var(--accent-soft); font-size: 10px; font-weight: 800; }
.algebra-row .math-equation { font-size: 25px; }
.algebra-row > small { color: var(--accent); font: 750 10px "JetBrains Mono", monospace; }
.algebra-row.result { opacity: .15; color: var(--success); background: var(--success-soft); transform: translateY(5px); transition: opacity .35s, transform .35s; }
.algebra-row.result.show { opacity: 1; transform: none; }
.cancel-button, .reverse-check {
  align-self: center;
  min-height: 38px;
  padding: 7px 13px;
  border: 0;
  border-radius: 9px;
  color: var(--accent);
  background: var(--accent-soft);
  cursor: pointer;
  font-size: 11px;
  font-weight: 750;
}
.cancel-button:disabled, .reverse-check:disabled { opacity: .35; cursor: not-allowed; }
.reverse-equation { display: flex; align-items: center; justify-content: center; gap: 10px; opacity: 0; color: var(--success); transition: opacity .35s; }
.reverse-equation.show { opacity: 1; }

/* Slide 5 */
.model-domain-note { display: flex; align-items: center; justify-content: center; gap: 10px; color: var(--ink-2); font-size: 10px; }
.model-domain-note span { padding: 6px 10px; border-radius: 9px; background: var(--paper); }
.model-domain-note i { color: var(--accent); font-style: normal; }
.value-card .math-fraction { min-height: 35px; font: 700 15px Fraunces, Georgia, serif; }
.zero-proof { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 10px; min-height: 0; max-height: 0; padding: 0 16px; overflow: hidden; border-radius: 12px; opacity: 0; background: var(--accent-soft); transition: max-height .45s, min-height .45s, padding .45s, opacity .3s; }
.zero-proof.show { min-height: 74px; max-height: 100px; padding: 10px 16px; opacity: 1; }
.zero-proof > div { display: flex; align-items: center; justify-content: center; gap: 9px; }
.zero-proof > div > span { color: var(--ink-2); font-size: 10px; }
.zero-proof > b { color: var(--accent); font-size: 10px; }
.restriction-pair { display: grid; grid-template-columns: 1fr 1fr; gap: 2px 9px; }
.restriction-pair strong { color: var(--accent); font: 800 16px "JetBrains Mono", monospace; }
.restriction-pair small { grid-column: 1 / -1; color: var(--ink-2); font: 700 9px "JetBrains Mono", monospace; text-align: center; }

/* Slides 6–8 */
.tick { fill: none; stroke: var(--ink-3); stroke-width: 1; }
.asymptote-labels text { fill: var(--accent); font-size: 9px; }
.point-list { gap: 5px; }
.point-list > div { min-height: 37px; padding: 6px 9px; }
.point-list > div.current-target { opacity: 1; color: var(--accent); background: var(--accent-soft); transform: none; box-shadow: inset 0 0 0 1px rgba(255,79,40,.22); }
.plot-action { display: grid; gap: 6px; }
.plot-action p { margin: 0; color: var(--ink-2); font-size: 10px; }
.plot-options { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; }
.plot-options button {
  min-height: 38px;
  border: 0;
  border-radius: 8px;
  color: var(--ink);
  background: var(--paper);
  cursor: pointer;
  font: 700 10px "JetBrains Mono", monospace;
}
.plot-options button.wrong { color: var(--accent); background: var(--accent-soft); }
.plot-hint { color: var(--tip); font-size: 9px; }
.point-conclusion { display: grid; gap: 4px; padding: 10px; border-radius: 10px; color: var(--success); background: var(--success-soft); }
.point-conclusion span { color: var(--ink-2); font-size: 10px; line-height: 1.35; }
.graph-with-formula { position: relative; }
.graph-with-formula > .math-equation { position: absolute; top: 17px; left: 20px; z-index: 2; padding: 6px 9px; border-radius: 8px; color: var(--accent); background: rgba(255,255,255,.9); font-size: 17px; box-shadow: 0 5px 14px -7px rgba(58,53,48,.25); }
.quadrant-prediction { display: grid; gap: 6px; }
.quadrant-prediction small { color: var(--ink-2); font-size: 9px; }
.quadrant-prediction > div { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; }
.quadrant-prediction button, .magnitude-control button {
  min-height: 36px;
  border: 0;
  border-radius: 9px;
  color: var(--ink-2);
  background: var(--bg);
  cursor: pointer;
  font: 750 10px "JetBrains Mono", monospace;
}
.quadrant-prediction button.correct { color: var(--success); background: var(--success-soft); }
.quadrant-prediction button.wrong { color: var(--accent); background: var(--accent-soft); }
.magnitude-control { display: grid; grid-template-columns: auto repeat(3, 1fr); align-items: center; gap: 5px; }
.magnitude-control small { color: var(--ink-2); font: 700 10px "JetBrains Mono", monospace; }
.magnitude-control button.active { color: var(--accent); background: var(--accent-soft); }
.quadrant-rule { min-height: 87px; }
.sign-proof { display: grid; justify-items: center; gap: 4px; }
.sign-proof p { margin: 0; padding: 0; text-align: center; }
.passport-card { width: 100%; border: 0; color: var(--ink); cursor: pointer; text-align: left; opacity: 1; }
.passport-card > div > small { color: var(--accent); font-size: 8px; font-weight: 800; letter-spacing: .1em; }
.passport-math { min-height: 26px; display: flex; align-items: center; gap: 7px; color: var(--ink-2); font-family: Fraunces, Georgia, serif; }
.passport-card.show { background: var(--success-soft); }
.passport-card.show > span { color: var(--success); background: white; }
.classification-check { padding: 13px; display: grid; gap: 9px; border-radius: 14px; background: rgba(255,255,255,.66); }
.classification-check > strong { font-size: 12px; }
.classification-options { display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; }
.classification-options button { min-height: 76px; padding: 9px; display: grid; place-items: center; gap: 6px; border: 0; border-radius: 10px; color: var(--ink); background: var(--paper); cursor: pointer; }
.classification-options button.correct { color: var(--success); background: var(--success-soft); box-shadow: inset 0 0 0 1px rgba(31,122,77,.22); }
.classification-options button.wrong { color: var(--accent); background: var(--accent-soft); }
.classification-options small { color: var(--ink-2); font-size: 9px; line-height: 1.3; }
.classification-check > p { margin: 0; color: var(--ink-2); font-size: 10px; line-height: 1.4; }

/* Slide 9 */
.worked-step .math-equation { font-size: 13px; }
.worked-decision { display: grid; grid-template-columns: 1fr 44px 44px; align-items: center; gap: 6px; padding: 8px; border-radius: 10px; background: var(--accent-soft); }
.worked-decision > span { color: var(--ink-2); font-size: 10px; }
.worked-decision button { width: 44px; height: 38px; border: 0; border-radius: 9px; color: var(--accent); background: white; cursor: pointer; font-size: 18px; font-weight: 800; }
.worked-decision small { grid-column: 1 / -1; color: var(--tip); font-size: 9px; }
.worked-complete { padding: 9px; border-radius: 10px; color: var(--success); background: var(--success-soft); font-size: 11px; font-weight: 800; text-align: center; }
.frame-success > span .math-equation { margin-right: 4px; color: var(--success); }

/* Practice v2 */
.task-card { min-height: 275px; }
.task-math-visual {
  width: fit-content;
  max-width: 100%;
  min-width: 180px;
  min-height: 54px;
  margin: 11px 0;
  padding: 9px 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: 11px;
  color: var(--accent);
  background: var(--accent-soft);
  font: 750 14px "JetBrains Mono", monospace;
  overflow: hidden;
  transition: color .3s, background .3s, transform .3s;
}
.task-math-visual.is-solved { color: var(--success); background: var(--success-soft); }
.task-math-visual > .math-equation { font-size: 25px; }
.task-math-visual.is-compact { min-width: 0; min-height: 0; margin: 0; padding: 4px 7px; font-size: 10px; background: rgba(255,255,255,.55); }
.task-math-visual.is-compact > .math-equation { font-size: 14px; }
.task-math-visual small { color: var(--ink-2); font-family: Manrope, Inter, sans-serif; font-size: 9px; }
.mini-math-table { display: grid; grid-template-columns: 38px repeat(3, 50px); border-radius: 8px; overflow: hidden; }
.mini-math-table span, .mini-math-table b { min-height: 31px; display: grid; place-items: center; border: 1px solid rgba(255,79,40,.15); }
.mini-math-table span { color: var(--ink-2); background: white; }
.mini-math-table b { font-weight: 800; }
.math-pair-row, .sign-pairs { display: flex; flex-wrap: wrap; justify-content: center; gap: 7px; }
.math-pair-row span, .sign-pairs span, .point-chip, .sign-chip { padding: 6px 8px; border-radius: 8px; background: white; white-space: nowrap; }
.change-diagram { display: grid; grid-template-columns: 42px 60px 42px; align-items: center; gap: 4px; text-align: center; }
.change-diagram i { color: var(--ink-2); font-style: normal; font-size: 10px; }
.flow-arrow { color: var(--accent); white-space: nowrap; }
.same-k-line { display: grid; width: 38px; height: 38px; place-items: center; border-radius: 50%; color: white; background: var(--accent); }
.student-error { color: var(--accent); text-decoration: line-through; text-decoration-thickness: 2px; }
.mini-graph { width: 68px; height: 68px; }
.mini-axis { fill: none; stroke: var(--ink-3); stroke-width: 1.3; }
.mini-curve { fill: none; stroke: var(--accent); stroke-width: 3; stroke-linecap: round; }
.mini-curve.is-error { stroke-dasharray: 4 3; }
.mini-point { fill: var(--success); stroke: white; stroke-width: 1.5; }
.mini-point.is-wrong { fill: var(--accent); }
.task-graph { width: 100%; max-width: 510px; height: 132px; margin-block: 8px; padding: 0; background: white; }
.task-graph .coordinate-graph, .graph-error-demo .coordinate-graph { width: 260px; height: 140px; }
.graph-guide-label, .false-axis-point { position: absolute; padding: 4px 7px; border-radius: 7px; color: var(--accent); background: white; font-size: 9px; }
.task-graph, .graph-error-demo { position: relative; }
.graph-guide-label { right: 12px; top: 10px; }
.graph-error-demo { width: 100%; max-width: 510px; height: 132px; padding: 0; background: white; }
.false-axis-point { left: 49%; top: 24%; border: 1px dashed var(--accent); animation: forbidden-pulse 1.5s ease-in-out infinite; }
.context-visual { justify-content: flex-start; }
.context-symbol { flex: 0 0 43px; display: grid; width: 43px; height: 43px; place-items: center; border-radius: 11px; color: white; background: var(--accent); font-size: 20px; }
.context-visual > div { display: grid; gap: 4px; }
.context-visual strong { color: var(--ink); }
.kind-product-chain { flex-wrap: wrap; }
.kind-product-chain span { padding: 5px 7px; border-radius: 7px; background: white; }
.kind-restriction strong { padding: 6px 9px; border-radius: 8px; background: white; }
.kind-passport { flex-wrap: wrap; }
.kind-passport > span { padding: 5px 7px; border-radius: 7px; background: white; }
.task-options button { position: relative; }
.task-options button > .option-copy {
  flex: 1 1 auto;
  display: block;
  width: auto;
  height: auto;
  padding: 0;
  border-radius: 0;
  color: inherit;
  background: transparent;
  font: inherit;
}
.task-options.has-visuals button { min-height: 84px; display: grid; grid-template-columns: 24px 74px 1fr; align-items: center; }
.task-options.has-visuals .task-math-visual { grid-column: 2; }
.task-options.has-visuals .option-copy { grid-column: 3; text-align: left; }
.context-answer { margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(167,166,162,.2); }
.answer-unit { color: var(--ink-2); font-size: 11px; white-space: nowrap; }
.wrong-hint { align-items: flex-start; }
.wrong-hint > span { flex: 0 0 26px; }
.wrong-hint > div { display: grid; gap: 2px; }
.wrong-hint small { color: var(--tip); font-size: 8px; letter-spacing: .1em; text-transform: uppercase; }
.wrong-hint strong { color: var(--ink-2); font-size: 11px; line-height: 1.4; }
.solution-panel.visible { max-height: 178px; }
.solution-copy { display: grid; gap: 4px; }
.solution-copy .task-math-visual { justify-self: start; color: var(--success); }

/* Narration-synchronised focus and staged practice reveal */
.lab-grid[data-audio-phase="0"] .metric-row,
.lab-grid[data-audio-phase="1"] .dynamic-rectangle,
.lab-grid[data-audio-phase="2"] .invariant-badge,
.table-layout[data-audio-phase="0"] .math-table,
.table-layout[data-audio-phase="1"] .ratio-motion,
.table-layout[data-audio-phase="2"] .table-row.product,
.formula-discovery[data-audio-phase="0"] .formula-question > .math-equation,
.formula-discovery[data-audio-phase="1"] .operation-choices button:nth-child(2),
.formula-discovery[data-audio-phase="2"] .algebra-row.result,
.domain-layout[data-audio-phase="0"] .value-card:not(.forbidden),
.domain-layout[data-audio-phase="1"] .value-card:nth-child(3),
.domain-layout[data-audio-phase="2"] .domain-rule,
.graph-layout[data-audio-phase="0"] .current-target,
.graph-layout[data-audio-phase="1"] .coordinate-graph,
.graph-layout[data-audio-phase="2"] .quadrant-rule,
.passport-layout[data-audio-phase="0"] .passport-card:nth-child(1),
.passport-layout[data-audio-phase="1"] .passport-card:nth-child(2),
.passport-layout[data-audio-phase="1"] .passport-card:nth-child(4),
.passport-layout[data-audio-phase="2"] .classification-check {
  animation: narration-focus 1.25s ease both;
}

.task-card h2 {
  animation: practice-reveal .34s ease both;
}
.task-card > .task-math-visual,
.task-card > .mini-graph {
  animation: practice-reveal .4s .16s ease both;
}
.task-card > .task-options,
.task-card > .number-entry,
.task-card > .context-answer {
  animation: practice-reveal .42s .34s ease both;
}
.solution-panel.visible .solution-icon {
  animation: solution-pop .45s cubic-bezier(.34,1.5,.64,1) both;
}
.solution-panel.visible .solution-copy small {
  animation: practice-reveal .3s .08s ease both;
}
.solution-panel.visible .solution-copy > strong {
  animation: practice-reveal .36s .2s ease both;
}
.solution-panel.visible .solution-copy .task-math-visual {
  animation: practice-reveal .42s .34s ease both;
}
.solution-panel.visible > .btn-white-accent,
.solution-panel.visible > .complete-badge {
  animation: practice-reveal .38s .48s ease both;
}

/* Summary v2 */
.mastery-metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; margin: 7px 0; }
.mastery-metrics span { padding: 7px; display: grid; gap: 2px; border-radius: 8px; color: var(--ink-2); background: var(--bg); font-size: 8px; }
.mastery-metrics b { color: var(--ink); font: 800 13px "JetBrains Mono", monospace; }
.recommendation strong { color: var(--accent); }
.exit-ticket { padding: 14px; display: grid; gap: 10px; }
.exit-ticket-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.exit-ticket-head > div { display: grid; gap: 3px; }
.exit-ticket-head small { color: var(--accent); font-size: 8px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
.exit-ticket-head strong { font-size: 12px; }
.exit-ticket-head > span { color: var(--accent); font: 800 15px "JetBrains Mono", monospace; }
.recall-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.recall-grid > div { min-height: 83px; padding: 9px; display: grid; align-content: center; gap: 8px; border-radius: 10px; background: var(--bg); }
.recall-grid > div > span { min-height: 24px; display: flex; align-items: center; justify-content: center; gap: 4px; font: 750 12px "JetBrains Mono", monospace; }
.recall-grid > div > div { display: flex; justify-content: center; gap: 4px; }
.recall-grid button { min-height: 34px; padding: 5px 8px; border: 0; border-radius: 8px; color: var(--ink-2); background: white; cursor: pointer; font: 700 9px "JetBrains Mono", monospace; }
.recall-grid button.active { color: var(--accent); background: var(--accent-soft); box-shadow: inset 0 0 0 1px rgba(255,79,40,.23); }
.exit-check { justify-self: end; }
.rule-final { opacity: .22; filter: grayscale(.8) blur(1px); transition: opacity .4s, filter .4s; }
.rule-final.is-revealed { opacity: 1; filter: none; }
.rule-final .math-equation { color: var(--accent); font-size: 18px; }
.rule-final > div:nth-child(3) strong { font-size: 12px; line-height: 1.5; }

.g8-inverse-root button:focus-visible,
.g8-inverse-root input:focus-visible {
  outline: 3px solid rgba(1,154,203,.42);
  outline-offset: 2px;
}

@keyframes fade-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
@keyframes ambient-float { 0%,100% { transform: translate(0,0); } 45% { transform: translate(11px,-14px); } 70% { transform: translate(-7px,8px); } }
@keyframes speaker-breathe { 50% { transform: scale(1.1); color: var(--blue); } }
@keyframes dot-pulse { 50% { opacity: .45; transform: scale(.75); } }
@keyframes rect-breathe { 50% { transform: scale(1.035); box-shadow: 0 14px 30px -10px rgba(255,79,40,.55); } }
@keyframes rectangle-grid-reveal { from { opacity: .5; } to { opacity: 1; } }
@keyframes arrow-nudge { 50% { transform: translateX(5px); } }
@keyframes forbidden-pulse { 50% { transform: translateY(-3px); box-shadow: 0 10px 22px -8px rgba(255,79,40,.45); } }
@keyframes draw-curve { to { stroke-dashoffset: 0; } }
@keyframes point-pop { from { opacity: 0; transform: scale(.2); } to { opacity: 1; transform: scale(1); } }
@keyframes shake { 20%,60% { transform: translateX(-5px); } 40%,80% { transform: translateX(5px); } }
@keyframes solution-pop { from { opacity: 0; transform: scale(.4) rotate(-20deg); } to { opacity: 1; transform: scale(1) rotate(0); } }
@keyframes score-in { from { opacity: 0; transform: scale(.72) rotate(-35deg); } to { opacity: 1; transform: scale(1) rotate(0); } }
@keyframes question-stretch { 0%,100% { width: 132px; } 50% { width: 168px; } }
@keyframes narration-focus {
  0% { filter: saturate(.7); box-shadow: none; }
  45% { filter: saturate(1.15); box-shadow: 0 0 0 4px rgba(255,79,40,.12); }
  100% { filter: none; box-shadow: none; }
}
@keyframes practice-reveal {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: none; }
}

@media (max-width: 720px) {
  .stage-header { padding: 11px 14px 7px; }
  .stage-content { padding: 8px 14px 22px; }
  .stage-nav { padding: 9px 14px 11px; }
  .screen-heading { margin-bottom: 10px; }
  .screen-heading h1 { font-size: clamp(23px, 7vw, 30px); }
  .screen-heading p { font-size: 12px; }
  .phase-dots { margin-bottom: 9px; }
  .hook-grid, .lab-grid, .table-layout, .graph-layout { grid-template-columns: 1fr; }
  .hook-model { min-height: 205px; padding: 16px; }
  .rect-pair { gap: 9px; transform: scale(.82); }
  .choice-stack { gap: 7px; }
  .option { min-height: 45px; padding: 8px 11px; font-size: 12px; }
  .rectangle-stage { --lab-unit: 12px; min-height: 240px; padding: 10px 12px; gap: 6px; }
  .rectangle-visual { min-height: 150px; }
  .rectangle-stage-note { padding: 5px 7px; }
  .rectangle-measures { grid-template-columns: minmax(70px, auto) auto minmax(70px, auto); gap: 5px; }
  .rectangle-measures > span { min-height: 32px; padding: 5px 7px; }
  .rectangle-measures > i { font-size: 9px; }
  .control-card { padding: 12px; gap: 6px; }
  .table-layout { gap: 10px; }
  .math-table { padding: 9px; }
  .table-row { min-width: 440px; grid-template-columns: 64px repeat(6, 1fr); }
  .table-row span { min-height: 45px; font-size: 13px; }
  .pattern-card { padding: 13px; display: grid; grid-template-columns: 1fr 1fr; }
  .pattern-card p { grid-column: 1 / -1; }
  .pair-selector { grid-column: 1 / -1; grid-template-columns: repeat(6, 1fr); }
  .pair-selector button { min-height: 42px; }
  .formula-build { min-height: 270px; padding: 15px; grid-template-columns: 1fr 64px 1fr; gap: 9px; }
  .formula-step { min-height: 125px; }
  .formula-step strong { font-size: 33px; }
  .operator-arrow b { font-size: 21px; }
  .value-cards { padding: 10px; gap: 5px; overflow-x: auto; }
  .value-card { min-width: 63px; min-height: 105px; }
  .value-card strong { font-size: 15px; }
  .domain-rule { grid-template-columns: auto auto; gap: 8px; padding: 11px; }
  .domain-rule p { grid-column: 1 / -1; text-align: left; }
  .graph-frame { min-height: 230px; padding: 7px; }
  .point-list { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
  .point-list > div { padding: 7px; }
  .point-list p, .point-control { grid-column: 1 / -1; }
  .sign-panel { display: grid; grid-template-columns: 1fr 1fr; }
  .sign-panel .segmented, .sign-panel p { grid-column: 1 / -1; }
  .quadrant-rule { min-height: 80px; }
  .passport-grid { gap: 7px; }
  .passport-card { min-height: 78px; padding: 10px; gap: 8px; }
  .passport-card > span { flex-basis: 35px; width: 35px; height: 35px; font-size: 15px; }
  .passport-card strong { font-size: 11px; }
  .compare-strip { gap: 6px; }
  .compare-strip > div { padding: 9px; grid-template-columns: 1fr; }
  .compare-strip strong { font-size: 14px; }
  .worked-layout { grid-template-columns: 1fr; }
  .formula-hero { grid-row: auto; min-height: 92px; font-size: 36px; }
  .worked-step { min-height: 52px; }
  .worked-layout .frame-success { grid-column: 1; }
  .practice-layout { grid-template-columns: 1fr; gap: 9px; }
  .task-rail { grid-row: auto; flex-direction: row; justify-content: center; padding: 6px; }
  .task-rail button { flex-basis: 44px; width: 44px; height: 44px; }
  .task-card { min-height: 248px; padding: 14px; }
  .task-card h2 { font-size: 20px; }
  .task-options { grid-template-columns: 1fr; gap: 6px; }
  .task-options button { min-height: 44px; }
  .solution-panel { grid-column: 1; grid-template-columns: 32px 1fr; }
  .solution-panel.visible { max-height: 190px; }
  .solution-panel .btn-white-accent, .solution-panel .complete-badge { grid-column: 2; justify-self: start; }
  .summary-score { grid-template-columns: 80px 1fr; gap: 12px; padding: 13px; }
  .score-ring { width: 75px; height: 75px; }
  .rule-final { grid-template-columns: 1fr 1fr; }
  .rule-final > div { min-height: 68px; }
  .return-hook { grid-template-columns: 110px 1fr; gap: 10px; padding: 12px; }
  .return-hook .rect-b { width: 105px; height: 48px; }
  .hook-grid { gap: 10px; }
  .hook-proof-note { position: static; margin-top: 10px; }
  .prediction-followup { padding: 8px; }
  .reason-chips { grid-template-columns: 1fr; }
  .confidence-row { grid-template-columns: 1fr 1fr; }
  .confidence-row > span { grid-column: 1 / -1; }
  .rectangle-stage { min-height: 218px; }
  .dynamic-rectangle { max-width: none; max-height: none; }
  .lab-mission { grid-template-columns: 1fr auto; align-items: center; }
  .lab-mission small { grid-column: 1 / -1; }
  .prediction-buttons { grid-row: 2; grid-column: 2; }
  .prediction-buttons button { min-width: 38px; }
  .lab-history { min-height: 0; }
  .table-gap-question {
    min-width: 0;
    width: 100%;
    display: grid;
    grid-template-columns: minmax(0, 1fr) repeat(3, 36px);
  }
  .table-gap-question > span { min-width: 0; }
  .formula-discovery { grid-template-columns: 1fr; gap: 9px; }
  .formula-question, .algebra-steps { min-height: 0; padding: 13px; }
  .formula-question { gap: 9px; }
  .formula-question > .math-equation { font-size: 27px; }
  .algebra-row { min-height: 64px; }
  .algebra-row .math-equation { font-size: 20px; }
  .model-domain-note { flex-wrap: wrap; gap: 5px; }
  .zero-proof { grid-template-columns: 1fr; }
  .zero-proof.show { max-height: 170px; }
  .zero-proof > b { display: none; }
  .domain-rule { grid-template-columns: 1fr auto; }
  .domain-rule > p { grid-column: 1 / -1; }
  .point-list { grid-template-columns: repeat(2, 1fr); }
  .plot-action, .point-conclusion { grid-column: 1 / -1; }
  .graph-with-formula > .math-equation { top: 8px; left: 9px; }
  .sign-panel { gap: 7px; }
  .quadrant-prediction, .magnitude-control, .sign-proof { grid-column: 1 / -1; }
  .passport-card { display: flex; }
  .classification-options { grid-template-columns: 1fr; }
  .classification-options button { min-height: 53px; grid-template-columns: 100px 1fr; }
  .worked-decision { grid-template-columns: 1fr 42px 42px; }
  .task-math-visual { min-width: 0; }
  .task-graph, .graph-error-demo { height: 118px; }
  .task-options.has-visuals { grid-template-columns: 1fr; }
  .task-options.has-visuals button { min-height: 68px; grid-template-columns: 24px 64px 1fr; }
  .mini-graph { width: 58px; height: 58px; }
  .context-answer .number-entry { flex-wrap: nowrap; }
  .solution-panel.visible { max-height: 235px; }
  .mastery-metrics { grid-template-columns: 1fr 1fr 1fr; }
  .recall-grid { grid-template-columns: 1fr; }
  .recall-grid > div { min-height: 65px; grid-template-columns: .8fr 1.2fr; align-items: center; }
  .exit-check { justify-self: stretch; }
}

@media (max-width: 400px) {
  .eyebrow { max-width: 190px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
  .btn-white-accent, .btn-ghost { min-height: 44px; padding: 8px 12px; font-size: 12px; }
  .rect-pair { transform: scale(.72); width: 125%; margin-inline: -12.5%; }
  .passport-card { display: grid; justify-items: start; }
  .compare-strip span { display: none; }
  .number-entry { flex-wrap: wrap; }
  .passport-card { display: flex; justify-items: initial; }
  .task-options.has-visuals button { grid-template-columns: 22px 54px 1fr; padding: 6px; }
  .task-options.has-visuals .mini-graph { width: 50px; height: 50px; }
  .context-answer .number-entry { display: grid; grid-template-columns: auto 1fr auto; }
  .context-answer .number-entry .btn-white-accent { grid-column: 1 / -1; width: 100%; }
  .mastery-metrics { grid-template-columns: 1fr; }
  .summary-score { grid-template-columns: 70px 1fr; }
}

@media (prefers-reduced-motion: reduce) {
  .g8-inverse-root *, .g8-inverse-root *::before, .g8-inverse-root *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
}
`
