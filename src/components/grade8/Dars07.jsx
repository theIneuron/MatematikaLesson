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

const TOTAL_SCREENS = 15
const PRACTICE_START = 9

const LESSON_META = {
  lessonId: 'grade8-math-07-inverse-proportion-v1',
  lessonTitle: L(
    'y = k/x funksiyasi va teskari proporsionallik',
    'Функция y = k/x и обратная пропорциональность',
    'The function y = k/x and inverse proportion',
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
        "Yigirma to'rt o'rniga istalgan o'zgarmas sonni k bilan belgilaymiz.",
        'Вместо двадцати четырёх обозначим любое постоянное число буквой k.',
        'Replace twenty-four by any constant number called k.',
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
        "Nuqtalar x nolga yaqinlashadi, ammo o'qning ustiga tushmaydi.",
        'Точки приближаются к x, равному нулю, но не попадают на ось.',
        'The points approach x equals zero, but never land on the axis.',
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
      "To'rtta belgini birgalikda ko'rsangiz, y = k/x modelini tanlang.",
      'Если видите эти четыре признака вместе, выбирайте модель y = k/x.',
      'When these four signs occur together, choose the model y = k/x.',
    ),
    audio: [
      L(
        "Birinchi belgi: biri oshsa, ikkinchisi kamayadi.",
        'Первый признак: одна величина растёт, другая уменьшается.',
        'First sign: one quantity grows while the other shrinks.',
      ),
      L(
        "Ikkinchi va uchinchi belgilar: ko'paytma o'zgarmaydi va x nol emas.",
        'Второй и третий признаки: произведение постоянно, а x не равен нулю.',
        'Second and third signs: the product is constant and x is not zero.',
      ),
      L(
        "To'rtinchi belgi: grafik giperbola. Endi qoida tayyor.",
        'Четвёртый признак: график является гиперболой. Правило готово.',
        'Fourth sign: the graph is a hyperbola. The rule is complete.',
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
      "y = 36/x. Avval x dan y ni, keyin y dan x ni topamiz.",
      'y = 36/x. Сначала найдём y по x, затем x по y.',
      'y = 36/x. First find y from x, then x from y.',
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

const task = (id, type, prompt, visual, answer, solution, options = null) => ({
  id,
  type,
  prompt,
  visual,
  answer,
  solution,
  options,
})

const PRACTICE_BLOCKS = [
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
    if (muted || !segments.length) return undefined

    const run = (index) => {
      if (cancelled || index >= segments.length) {
        if (!cancelled) setPlaying(false)
        return
      }
      setPhase(index)
      const value = segments[index]
      const fallbackMs = Math.min(5200, Math.max(1500, value.split(/\s+/).length * 115))
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
      <section className="stage-content">
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
  const options = [
    L("Bo'yi ham oshadi", 'Высота тоже увеличится', 'The height also grows'),
    L("Bo'yi 2 marta kamayadi", 'Высота уменьшится в 2 раза', 'The height is halved'),
    L("Bo'yi o'zgarmaydi", 'Высота не изменится', 'The height stays unchanged'),
  ]
  const choose = (index) => {
    setChoice(index)
    onAnswer({
      screenId: 's0',
      screenIdx: 0,
      type: 'prediction',
      scored: false,
      studentAnswer: index,
      selectedText: textOf(options[index], lang),
      answeredAt: new Date().toISOString(),
    })
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
            <div className="mini-rect rect-b"><span>8 × ?</span></div>
            <small>8 · ? = 24</small>
          </div>
        </div>
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
        <p className="micro-note">{textOf(L('Bu taxmin baholanmaydi — uni dars oxirida tekshiramiz.', 'Этот прогноз не оценивается — проверим его в конце урока.', 'This prediction is not graded—we will check it at the end.'), lang)}</p>
      </div>
    </div>
  )
}

function RectangleLab({ phase }) {
  const lang = useLang()
  const [x, setX] = useState(4)
  const y = 24 / x
  const width = 90 + x * 16
  const height = 40 + y * 11
  return (
    <div className="lab-grid">
      <div className="frame rectangle-stage">
        <div
          className="dynamic-rectangle"
          style={{ width: `${width}px`, height: `${height}px` }}
        >
          <span className="label-x">x = {x}</span>
          <span className="label-y">y = {Number.isInteger(y) ? y : y.toFixed(1)}</span>
          <span className="area-core">24</span>
        </div>
      </div>
      <div className="frame control-card">
        <div className="metric-row"><span>x</span><strong>{x}</strong></div>
        <input
          type="range"
          min="2"
          max="12"
          step="1"
          value={x}
          onChange={(event) => setX(Number(event.target.value))}
          aria-label={textOf(L('En x', 'Ширина x', 'Width x'), lang)}
        />
        <div className="equation-line">
          <span>{x}</span><b>·</b><span>{Number.isInteger(y) ? y : y.toFixed(1)}</span><b>=</b><strong>24</strong>
        </div>
        <div className={`invariant-badge ${phase >= 1 ? 'visible' : ''}`}>
          {textOf(L("Yuza o'zgarmadi", 'Площадь не изменилась', 'Area stayed fixed'), lang)}
        </div>
      </div>
    </div>
  )
}

function TableModel({ phase }) {
  const lang = useLang()
  const pairs = [[1, 24], [2, 12], [3, 8], [4, 6], [6, 4], [8, 3]]
  const [selectedPair, setSelectedPair] = useState(0)
  return (
    <div className="table-layout" data-audio-phase={phase}>
      <div className="frame math-table">
        <div className="table-row header"><span>x</span>{pairs.map(([x]) => <span key={`x${x}`}>{x}</span>)}</div>
        <div className="table-row"><span>y</span>{pairs.map(([, y], index) => <span key={`y${y}`} className={index === selectedPair ? 'lit' : ''}>{y}</span>)}</div>
        <div className="table-row product"><span>x·y</span>{pairs.map(([x, y], index) => <span key={`p${x}`} className={index === selectedPair ? 'lit' : ''}>{x * y}</span>)}</div>
      </div>
      <div className="frame pattern-card">
        <div className="ratio-motion">
          <span>x</span><b>× 2</b><i>→</i><span>2x</span>
        </div>
        <div className="ratio-motion inverse">
          <span>y</span><b>÷ 2</b><i>→</i><span>y/2</span>
        </div>
        <p>{textOf(L("Qarama-qarshi o'zgarish, bir xil ko'paytma", 'Противоположное изменение, одинаковое произведение', 'Opposite change, same product'), lang)}</p>
        <div className="pair-selector" aria-label={textOf(L('Jadval juftligini tanlang', 'Выбери пару таблицы', 'Select a table pair'), lang)}>
          {pairs.map(([x, y], index) => (
            <button
              type="button"
              key={`${x}-${y}`}
              className={selectedPair === index ? 'active' : ''}
              onClick={() => setSelectedPair(index)}
            >
              ({x}; {y})
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function FormulaBuild({ phase }) {
  const lang = useLang()
  const [built, setBuilt] = useState(false)
  return (
    <div className="formula-build">
      <div className={`formula-step ${phase >= 0 ? 'show' : ''}`}>
        <small>{textOf(L("O'zgarmas ko'paytma", 'Постоянное произведение', 'Constant product'), lang)}</small>
        <strong>x · y = k</strong>
      </div>
      <div className={`operator-arrow ${phase >= 1 ? 'show' : ''}`}>
        <button
          type="button"
          className={built ? 'used' : ''}
          onClick={() => setBuilt(true)}
          aria-label={textOf(L("Ikkala tomonni x ga bo'ling", 'Разделить обе части на x', 'Divide both sides by x'), lang)}
        >
          ÷ x
        </button>
        <b>→</b>
      </div>
      <div className={`formula-step result ${built ? 'show' : ''}`}>
        <small>{textOf(L('y ni ajratamiz', 'Выражаем y', 'Isolate y'), lang)}</small>
        <strong>y = <span className="fraction"><i>k</i><i>x</i></span></strong>
      </div>
      <div className={`rule-strip ${built ? 'show' : ''}`}>
        <b>{textOf(L('TESKARI PROPORSIONALLIK', 'ОБРАТНАЯ ПРОПОРЦИОНАЛЬНОСТЬ', 'INVERSE PROPORTION'), lang)}</b>
        <span>y = k/x</span>
      </div>
    </div>
  )
}

function DomainModel({ phase }) {
  const lang = useLang()
  const values = [-2, -1, 0, 1, 2]
  const [selectedX, setSelectedX] = useState(null)
  const foundBoundary = selectedX === 0
  return (
    <div className="domain-layout">
      <div className="frame value-cards">
        {values.map((x) => (
          <button
            type="button"
            key={x}
            className={`value-card ${x === 0 ? 'forbidden' : ''} ${phase >= 1 && x === 0 && !foundBoundary ? 'pulse' : ''} ${selectedX === x ? 'selected' : ''}`}
            onClick={() => setSelectedX(x)}
          >
            <span>x = {x}</span>
            <strong>{x === 0 ? '12 ÷ 0' : 12 / x}</strong>
            <small>{x === 0 ? textOf(L('aniqlanmagan', 'не определено', 'undefined'), lang) : `y = ${12 / x}`}</small>
          </button>
        ))}
      </div>
      <div className={`domain-rule ${foundBoundary ? 'show' : ''}`}>
        <span>y = k/x</span>
        <strong>x ≠ 0</strong>
        <p>{textOf(L("Grafik y o'qini kesmaydi.", 'График не пересекает ось y.', 'The graph never crosses the y-axis.'), lang)}</p>
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

function CoordinateGraph({ k = 24, pointsOnly = false, phase = 2, revealCount = null }) {
  const points = k > 0
    ? [[2, k / 2], [3, k / 3], [4, k / 4], [6, k / 6], [-2, k / -2], [-3, k / -3], [-4, k / -4], [-6, k / -6]]
    : [[2, k / 2], [3, k / 3], [4, k / 4], [6, k / 6], [-2, k / -2], [-3, k / -3], [-4, k / -4], [-6, k / -6]]
  return (
    <svg className="coordinate-graph" viewBox="0 0 460 250" role="img" aria-label={`y = ${k}/x`}>
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
  const pairs = [[2, 12], [3, 8], [4, 6], [6, 4]]
  const [revealed, setRevealed] = useState(1)
  return (
    <div className="graph-layout">
      <div className="frame graph-frame"><CoordinateGraph k={24} pointsOnly phase={phase} revealCount={revealed} /></div>
      <div className="point-list">
        {pairs.map((pair, index) => (
          <div key={pair[0]} className={index < revealed ? 'visible' : ''}>
            <span>({pair[0]}; {pair[1]})</span>
            <small>{pair[0]} · {pair[1]} = 24</small>
          </div>
        ))}
        <p>{textOf(L("Jadval → nuqta → grafik", 'Таблица → точка → график', 'Table → point → graph'), lang)}</p>
        <button
          type="button"
          className="btn-white-accent compact point-control"
          disabled={revealed >= pairs.length}
          onClick={() => setRevealed((value) => Math.min(pairs.length, value + 1))}
        >
          {revealed >= pairs.length
            ? textOf(L('Barcha nuqtalar joylandi', 'Все точки нанесены', 'All points plotted'), lang)
            : textOf(L('Keyingi nuqtani joylang', 'Нанести следующую точку', 'Plot the next point'), lang)}
        </button>
      </div>
    </div>
  )
}

function GraphSignModel({ phase }) {
  const lang = useLang()
  const [k, setK] = useState(12)
  return (
    <div className="graph-layout">
      <div className="frame graph-frame"><CoordinateGraph k={k} phase={phase} /></div>
      <div className="sign-panel">
        <div className="segmented">
          <button type="button" className={k > 0 ? 'active' : ''} onClick={() => setK(12)}>k = 12</button>
          <button type="button" className={k < 0 ? 'active' : ''} onClick={() => setK(-12)}>k = −12</button>
        </div>
        <div className={`quadrant-rule ${k > 0 ? 'positive' : 'negative'}`}>
          <strong>{k > 0 ? 'k > 0' : 'k < 0'}</strong>
          <span>{k > 0 ? 'I & III' : 'II & IV'}</span>
        </div>
        <p>{textOf(k > 0
          ? L('x va y bir xil ishorali.', 'x и y имеют одинаковые знаки.', 'x and y have the same sign.')
          : L('x va y qarama-qarshi ishorali.', 'x и y имеют противоположные знаки.', 'x and y have opposite signs.'), lang)}</p>
      </div>
    </div>
  )
}

function Passport({ phase }) {
  const lang = useLang()
  const cards = [
    { icon: '↗↘', title: L("Qarama-qarshi o'zgarish", 'Противоположное изменение', 'Opposite change'), text: L("x oshsa, y kamayadi", 'x растёт, y уменьшается', 'x grows, y shrinks') },
    { icon: '×', title: L("Ko'paytma o'zgarmas", 'Произведение постоянно', 'Product is constant'), text: 'x · y = k' },
    { icon: '≠', title: L('Nol taqiqlangan', 'Ноль запрещён', 'Zero is excluded'), text: 'x ≠ 0' },
    { icon: '⌁', title: L('Grafik — giperbola', 'График — гипербола', 'Graph is a hyperbola'), text: 'y = k/x' },
  ]
  return (
    <div className="passport-layout">
      <div className="passport-grid">
        {cards.map((card, index) => (
          <div key={textOf(card.title, 'en')} className={`passport-card ${phase >= Math.min(2, Math.floor(index / 2)) ? 'show' : ''}`}>
            <span>{card.icon}</span>
            <div><strong>{textOf(card.title, lang)}</strong><small>{textOf(card.text, lang)}</small></div>
          </div>
        ))}
      </div>
      <div className="compare-strip">
        <div><small>{textOf(L("To'g'ri proporsiya", 'Прямая пропорция', 'Direct proportion'), lang)}</small><strong>y = kx</strong><span>x ↑ · y ↑</span></div>
        <b>≠</b>
        <div className="active"><small>{textOf(L('Teskari proporsiya', 'Обратная пропорция', 'Inverse proportion'), lang)}</small><strong>y = k/x</strong><span>x ↑ · y ↓</span></div>
      </div>
    </div>
  )
}

function WorkedExample({ phase, pushOneOff }) {
  const lang = useLang()
  const [revealed, setRevealed] = useState(1)
  const steps = [
    {
      label: L('1-savol', 'Вопрос 1', 'Question 1'),
      formula: 'x = 4 → y = ?',
      work: 'y = 36 ÷ 4 = 9',
      voice: L("x to'rt bo'lsa, y o'ttiz olti bo'lingan to'rt, ya'ni to'qqiz.", 'При x равном четырём y равно тридцати шести, делённым на четыре, то есть девяти.', 'When x is four, y is thirty-six divided by four, which is nine.'),
    },
    {
      label: L('Tekshiruv', 'Проверка', 'Check'),
      formula: '4 · 9',
      work: '= 36 ✓',
      voice: L("Tekshiramiz: to'rt karra to'qqiz o'ttiz olti.", 'Проверим: четыре умножить на девять равно тридцати шести.', 'Check: four times nine equals thirty-six.'),
    },
    {
      label: L('2-savol', 'Вопрос 2', 'Question 2'),
      formula: 'y = −6 → x = ?',
      work: 'x = 36 ÷ (−6)',
      voice: L("Endi y minus olti. x ni topish uchun k ni y ga bo'lamiz.", 'Теперь y равно минус шести. Чтобы найти x, делим k на y.', 'Now y is negative six. To find x, divide k by y.'),
    },
    {
      label: L('Javob', 'Ответ', 'Answer'),
      formula: 'x = −6',
      work: '(−6) · (−6) = 36 ✓',
      voice: L("x minus olti. Ikki manfiy son ko'paytmasi musbat o'ttiz olti.", 'x равен минус шести. Произведение двух отрицательных чисел равно положительным тридцати шести.', 'x is negative six. Two negative factors give positive thirty-six.'),
    },
  ]
  const revealNext = () => {
    if (revealed >= steps.length) return
    pushOneOff(steps[revealed].voice)
    setRevealed((value) => Math.min(steps.length, value + 1))
  }
  return (
    <div className="worked-layout" data-audio-phase={phase}>
      <div className="formula-hero">y = <span className="fraction"><i>36</i><i>x</i></span></div>
      <div className="worked-steps">
        {steps.map((step, index) => (
          <div key={textOf(step.label, 'en')} className={`worked-step ${index < revealed ? 'active' : ''}`}>
            <span>{index + 1}</span>
            <div><small>{textOf(step.label, lang)}</small><strong>{step.formula}</strong></div>
            <b>{step.work}</b>
          </div>
        ))}
        <button
          type="button"
          className="btn-white-accent compact worked-next"
          disabled={revealed >= steps.length}
          onClick={revealNext}
        >
          {revealed >= steps.length
            ? textOf(L('Yechim tugallandi', 'Решение завершено', 'Solution complete'), lang)
            : textOf(L('Keyingi qadamni oching', 'Открыть следующий шаг', 'Reveal the next step'), lang)}
        </button>
      </div>
      <div className={`frame-success ${revealed >= steps.length ? 'is-complete' : 'is-pending'}`}>
        <strong>{textOf(L('Universal yo‘l', 'Универсальный путь', 'Universal method'), lang)}</strong>
        <span>{textOf(L('Avval k = x · y ni eslang, keyin noma’lumni bo‘lish orqali toping.', 'Сначала вспомните k = x · y, затем найдите неизвестное делением.', 'Recall k = x · y first, then find the unknown by division.'), lang)}</span>
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
  const [attempts, setAttempts] = useState(() => restoredItems.map((item) => item?.attempts ?? 0))
  const taskStartedRef = useRef(null)
  const solvedCount = Object.keys(results).length
  const activeTask = tasks[currentTask]
  const currentSolved = Boolean(results[currentTask]?.correct)
  const unlockedThrough = Math.min(solvedCount, tasks.length - 1)

  const selectTask = (index) => {
    setInput('')
    setSelected(null)
    setWrong(false)
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
    const candidate = activeTask.type === 'number' ? normaliseNumber(answerValue) : answerValue
    const expected = activeTask.answer
    const isCorrect = activeTask.type === 'number'
      ? candidate !== null && Math.abs(candidate - expected) < 0.0001
      : candidate === expected
    const nextAttempts = [...attempts]
    nextAttempts[currentTask] = (nextAttempts[currentTask] ?? 0) + 1
    setAttempts(nextAttempts)
    setSelected(activeTask.type === 'mcq' ? answerValue : null)

    if (!isCorrect) {
      setWrong(true)
      playSfx('wrong')
      pushOneOff(UI.retry)
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
      question: textOf(activeTask.prompt, lang),
      options: activeTask.options?.map((option) => textOf(option, lang)) ?? [],
      correctIndex: activeTask.type === 'mcq' ? String(expected).charCodeAt(0) - 65 : null,
      correctAnswer: activeTask.type === 'mcq'
        ? textOf(activeTask.options[String(expected).charCodeAt(0) - 65], lang)
        : expected,
      correctAnswerRaw: expected,
      studentAnswerIndex: activeTask.type === 'mcq' ? String(candidate).charCodeAt(0) - 65 : null,
      studentAnswer: activeTask.type === 'mcq'
        ? textOf(activeTask.options[String(candidate).charCodeAt(0) - 65], lang)
        : candidate,
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
      <div className={`frame task-card ${wrong ? 'shake' : ''}`}>
        <div className="task-number">
          <span>{textOf(UI.task, lang)} {currentTask + 1}</span>
          <b>{activeTask.type === 'mcq' ? 'A/B/C' : 'ƒ(x)'}</b>
        </div>
        <h2>{textOf(activeTask.prompt, lang)}</h2>
        <div className="task-visual">{activeTask.visual}</div>
        {activeTask.type === 'mcq' ? (
          <div className="task-options">
            {activeTask.options.map((option, index) => {
              const value = optionLetter(index)
              const isChosen = selected === value
              const isCorrectOption = currentSolved && value === activeTask.answer
              return (
                <button
                  type="button"
                  key={value}
                  disabled={currentSolved}
                  className={`${isChosen && wrong ? 'wrong' : ''} ${isCorrectOption ? 'correct' : ''}`}
                  onClick={() => submit(value)}
                >
                  <span>{value}</span>{textOf(option, lang).replace(/^[ABC] · /, '')}
                </button>
              )
            })}
          </div>
        ) : (
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
        {wrong && (
          <div className="wrong-hint" role="status">
            <span>↺</span>{textOf(UI.retry, lang)}
          </div>
        )}
      </div>
      <div className={`solution-panel ${currentSolved ? 'visible' : ''}`} aria-live="polite">
        <div className="solution-icon">✓</div>
        <div>
          <small>{textOf(UI.correct, lang)} · {textOf(UI.solution, lang)}</small>
          <strong>{textOf(activeTask.solution, lang)}</strong>
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
  const correct = practiceAnswers.reduce((sum, block) => sum + (block?.items?.filter((item) => item.correct).length ?? 0), 0)
  const total = PRACTICE_BLOCKS.length * 6
  const name = studentName ? `${studentName}, ` : ''
  const prediction = answers[0]
  const predictionCorrect = prediction?.studentAnswer === 1
  return (
    <div className="summary-layout">
      <div className="summary-score frame">
        <div className="score-ring" style={{ '--score': `${Math.round((correct / total) * 100)}%` }}>
          <span>{correct}</span><small>/ {total}</small>
        </div>
        <div>
          <h2>{name}{textOf(L('modelni boshqara olasiz.', 'вы умеете управлять моделью.', 'you can control the model.'), lang)}</h2>
          <p>{textOf(L('Istalgan x uchun y ni, nuqta uchun k ni va k ishorasi uchun choraklarni topa olasiz.', 'Вы можете найти y по x, k по точке и четверти по знаку k.', 'You can find y from x, k from a point, and quadrants from the sign of k.'), lang)}</p>
        </div>
      </div>
      <div className="rule-final">
        <div><small>{textOf(L('FORMULA', 'ФОРМУЛА', 'FORMULA'), lang)}</small><strong>y = k/x</strong></div>
        <div><small>{textOf(L('INVARIANT', 'ИНВАРИАНТ', 'INVARIANT'), lang)}</small><strong>x · y = k</strong></div>
        <div><small>{textOf(L('CHEKLOV', 'ОГРАНИЧЕНИЕ', 'RESTRICTION'), lang)}</small><strong>x ≠ 0</strong></div>
        <div><small>{textOf(L('GRAFIK', 'ГРАФИК', 'GRAPH'), lang)}</small><strong>{textOf(L('giperbola', 'гипербола', 'hyperbola'), lang)}</strong></div>
      </div>
      <div className="return-hook">
        <div className="mini-rect rect-b"><span>8 × 3</span></div>
        <div>
          <small>{textOf(L('Boshidagi savol', 'Вопрос из начала', 'Opening question'), lang)}</small>
          <strong>8 · 3 = 24</strong>
          <p>{textOf(L("En 2 marta oshsa, bo'yi 2 marta kamayadi.", 'Если ширина удваивается, высота уменьшается вдвое.', 'When width doubles, height is halved.'), lang)}</p>
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
.rectangle-stage { min-height: 304px; padding: 18px; display: grid; place-items: center; overflow: hidden; background-image: linear-gradient(rgba(167,166,162,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(167,166,162,.12) 1px, transparent 1px); background-size: 20px 20px; }
.dynamic-rectangle { position: relative; min-width: 120px; max-width: 90%; max-height: 245px; border: 3px solid var(--accent); border-radius: 4px; background: rgba(255,232,225,.52); box-shadow: 0 12px 30px -12px rgba(255,79,40,.5); transition: width .5s cubic-bezier(.4,0,.2,1), height .5s cubic-bezier(.4,0,.2,1); }
.dynamic-rectangle::before { content: ""; position: absolute; inset: 0; background: repeating-linear-gradient(0deg, transparent 0 19px, rgba(255,79,40,.12) 19px 20px), repeating-linear-gradient(90deg, transparent 0 19px, rgba(255,79,40,.12) 19px 20px); }
.label-x, .label-y, .area-core { position: absolute; z-index: 1; padding: 4px 7px; border-radius: 7px; background: var(--paper); box-shadow: 0 4px 12px -6px rgba(58,53,48,.22); font: 700 11px "JetBrains Mono", monospace; }
.label-x { left: 50%; bottom: -13px; transform: translateX(-50%); }
.label-y { right: -18px; top: 50%; transform: translateY(-50%) rotate(90deg); }
.area-core { left: 50%; top: 50%; color: var(--accent); font-size: 18px; transform: translate(-50%,-50%); }
.control-card { padding: 22px; display: flex; flex-direction: column; justify-content: center; gap: 16px; }
.metric-row { display: flex; align-items: center; justify-content: space-between; color: var(--ink-2); }
.metric-row strong { color: var(--accent); font: 800 24px "JetBrains Mono", monospace; }
.control-card input[type="range"] { width: 100%; accent-color: var(--accent); cursor: grab; }
.equation-line { display: flex; align-items: center; justify-content: center; gap: 9px; font: 700 18px "JetBrains Mono", monospace; }
.equation-line span { min-width: 42px; padding: 7px; border-radius: 9px; text-align: center; background: var(--bg); }
.equation-line strong { color: var(--accent); }
.invariant-badge { padding: 8px 10px; border-radius: 9px; opacity: 0; color: var(--success); background: var(--success-soft); font-size: 12px; font-weight: 700; text-align: center; transform: translateY(6px); transition: opacity .4s, transform .4s; }
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
@keyframes arrow-nudge { 50% { transform: translateX(5px); } }
@keyframes forbidden-pulse { 50% { transform: translateY(-3px); box-shadow: 0 10px 22px -8px rgba(255,79,40,.45); } }
@keyframes draw-curve { to { stroke-dashoffset: 0; } }
@keyframes point-pop { from { opacity: 0; transform: scale(.2); } to { opacity: 1; transform: scale(1); } }
@keyframes shake { 20%,60% { transform: translateX(-5px); } 40%,80% { transform: translateX(5px); } }
@keyframes solution-pop { from { opacity: 0; transform: scale(.4) rotate(-20deg); } to { opacity: 1; transform: scale(1) rotate(0); } }
@keyframes score-in { from { opacity: 0; transform: scale(.72) rotate(-35deg); } to { opacity: 1; transform: scale(1) rotate(0); } }

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
  .rectangle-stage { min-height: 230px; }
  .control-card { padding: 15px; gap: 10px; }
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
}

@media (max-width: 400px) {
  .eyebrow { max-width: 190px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
  .btn-white-accent, .btn-ghost { min-height: 44px; padding: 8px 12px; font-size: 12px; }
  .rect-pair { transform: scale(.72); width: 125%; margin-inline: -12.5%; }
  .passport-card { display: grid; justify-items: start; }
  .compare-strip span { display: none; }
  .number-entry { flex-wrap: wrap; }
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
