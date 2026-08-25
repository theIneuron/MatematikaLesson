// ============================================================================
// 7-sinf, Dars 43. TENG YONLI UCHBURCHAK VA UNING XOSSALARI.
// (Равнобедренный треугольник и его свойства)
//
// KONVEYER DARSI: faqat ma'lumot, o'ram `screens.jsx` da.
//
// DARS BURCHAKLAR YIG'INDISIGA TAYANMAYDI. Yig'indi 44-darsning temasi,
// shuning uchun bu yerda hamma narsa TENGLIKDAN chiqadi: asosdagi burchaklar
// teng, va uchdan tushirilgan perpendikulyar asosni teng ikkiga bo'ladi.
// Xuk ham yig'indisiz ishlaydi: 70 daraja berilgan, ikkinchisi ham 70.
//
// «O'LCHOV ISBOT EMAS» (etalon § 9) ISHLAYDI. Chizma ostidagi yorliq
// 2026-08-25 da olib tashlandi, fikr esa izohda qoldi: chizmadagi son
// o'lchov, xossa esa har qanday teng yonli uchburchakda bajariladi.
//
// ASBOB XOSSANI HAQIQATDA SINAYDI: uch ko'chganda tomonlar tengligi
// YO'QOLADI, va o'quvchi buni sonlarda ko'radi. Bu ekran statik tekshiruvda
// ham qotirilgan: (0;3) da tomonlar teng, (1;3) da teng emas.
//
// DARSLIKKA HAVOLA YO'Q (§3.4).
// ============================================================================
import React from 'react'
import { L } from './core.jsx'
import { A, makeLesson } from './screens.jsx'

const LESSON_ID = 'alg_7_43'
const LESSON_TITLE = L('Teng yonli uchburchak', 'Равнобедренный треугольник', 'The isosceles triangle')
const LESSON_NO = L('43-dars', 'Урок 43', 'Lesson 43')
const BLOCK = { label: L('B7-blok', 'Блок Б7', 'Block B7'), from: 40, to: 48, current: 43 }

const TAGS = {
  Z1: L('asosdagi burchaklar tengligi', 'равенство углов при основании', 'the equality of the base angles'),
  Z2: L('uchdagi burchak asosdagi bilan aralashtirildi', 'угол при вершине спутан с углом при основании', 'the apex angle confused with a base angle'),
  Z3: L('asos va yon tomon aralashtirildi', 'основание спутано с боковой стороной', 'the base confused with a leg'),
  Z4: L("o'lchov isbot deb olindi", 'измерение принято за доказательство', 'a measurement taken as proof'),
  Z5: L('perpendikulyarning xossasi', 'свойство перпендикуляра из вершины', 'the property of the height from the apex'),
  Z6: L('hisobda xato', 'ошибка в счёте', 'a slip in the arithmetic'),
}

// ============================================================
// 1. XUK. Asosdagi ikkinchi burchak.
// ============================================================
const S1 = {
  kind: 'hook',
  eyebrow: L('TENG YONLI UCHBURCHAK', 'РАВНОБЕДРЕННЫЙ ТРЕУГОЛЬНИК', 'THE ISOSCELES TRIANGLE'),
  noBack: true,
  noNotes: true,
  title: L('Asosdagi ikkinchi burchak', 'Второй угол при основании', 'The second base angle'),
  gate: {
    source: { kind: 'plain', tokens: ['70°', '?'] },
    rows: [
      { tokens: ['110°'], value: '110' },
      { tokens: ['70°'], value: '70' },
    ],
  },
  cols: 2,
  probe: {
    question: L(
      "Teng yonli uchburchakning asosidagi bir burchagi 70 daraja. Asosdagi ikkinchi burchak nechcha daraja?",
      'В равнобедренном треугольнике один угол при основании равен 70 градусам. Сколько градусов второй угол при основании?',
      'In an isosceles triangle one base angle is 70 degrees. How big is the second base angle?',
    ),
    items: [
      {
        id: 'same',
        label: L('ham 70 daraja', 'тоже 70 градусов', '70 degrees as well'),
        hint: L(
          "Taxminingiz qabul qilindi. Chizmada tekshiramiz.",
          'Прогноз принят. Проверим на чертеже.',
          'Your prediction is taken. We will check it on the drawing.',
        ),
      },
      {
        id: 'adj',
        label: L('110 daraja', '110 градусов', '110 degrees'),
        hint: L(
          "Bir yuz o'n bu qo'shni burchak bo'lardi, savol esa uchburchakning ikkinchi burchagi haqida.",
          'Сто десять это был бы смежный угол, а вопрос о втором угле треугольника.',
          'One hundred ten would be the adjacent angle, but the question is about the triangle.',
        ),
      },
      {
        id: 'ninety',
        label: L('90 daraja', '90 градусов', '90 degrees'),
        hint: L(
          "To'qson bekorga chiqmaydi: berilgan burchak yetmish, va asos ikki tomonda bir xil.",
          'Девяносто взять неоткуда: данный угол семьдесят, а основание с двух сторон одинаково.',
          'Ninety comes from nowhere: the given angle is seventy and the base is alike on both sides.',
        ),
      },
      {
        id: 'cant',
        label: L('bilib bo\'lmaydi', 'узнать нельзя', 'it cannot be known'),
        hint: L(
          "Bilib bo'ladi: teng yonlilikning o'zi javob beradi.",
          'Можно: равнобедренность сама даёт ответ.',
          'It can: being isosceles gives the answer itself.',
        ),
      },
    ],
  },
  audio: [
    A('mount', "Uchburchak teng yonli: ikki yon tomoni bir xil.", 'Треугольник равнобедренный: две боковые стороны одинаковы.', 'The triangle is isosceles: its two legs are alike.'),
    A('mount', "Asosdagi bir burchak yetmish daraja. Ikkinchisi nechchi bo'ladi deb taxmin qilasiz.", 'Один угол при основании семьдесят градусов. Каким, по-твоему, будет второй.', 'One base angle is seventy degrees. What do you predict the second will be.'),
  ],
}

// ============================================================
// 2. TAYANCH. KVOTA EKRANI.
// ============================================================
const S2 = {
  kind: 'chain',
  role: 'support',
  eyebrow: L('TAYANCH', 'ОПОРА', 'THE GROUNDWORK'),
  title: L('Uchta savol', 'Три вопроса', 'Three questions'),
  question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
  cols: 2,
  items: [
    {
      wrap: true,
      question: null,
      prompt: L(
        "Teng yonli uchburchakda asos qaysi tomon?",
        'Какая сторона в равнобедренном треугольнике называется основанием?',
        'Which side of an isosceles triangle is the base?',
      ),
      ok: L("Uchinchi tomon: teng bo'lmagani.", 'Третья сторона: та, что не равна другим.', 'The third side: the one that is not equal to the others.'),
      items: [
        {
          id: 'a',
          correct: true,
          label: L("teng bo'lmagan tomon", 'сторона, не равная другим', 'the side not equal to the others'),
        },
        {
          id: 'b',
          tag: 'Z3',
          label: L('eng uzun tomon', 'самая длинная сторона', 'the longest side'),
          hint: L("Asos eng uzun bo'lishi shart emas: u qisqa ham bo'lishi mumkin.", 'Основание не обязано быть самым длинным: оно может быть и коротким.', 'The base need not be the longest: it may be short.'),
        },
        {
          id: 'c',
          tag: 'Z3',
          label: L('pastda turgan tomon', 'сторона, что лежит внизу', 'the side lying at the bottom'),
          hint: L("Chizmani aylantirsak, past o'zgaradi, asos esa o'zgarmaydi.", 'Повернём чертёж, и низ изменится, а основание нет.', 'Turn the drawing and the bottom changes, the base does not.'),
        },
        {
          id: 'd',
          tag: 'Z3',
          label: L('yon tomonlardan biri', 'одна из боковых сторон', 'one of the legs'),
          hint: L("Yon tomonlar teng, asos esa ulardan boshqa.", 'Боковые равны, а основание от них отличается.', 'The legs are equal, the base is the other one.'),
        },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Uchburchakda teng tomonlar bo'lsa, burchaklar bilan nima bo'ladi?",
        'Если в треугольнике есть равные стороны, что происходит с углами?',
        'If a triangle has equal sides, what happens to the angles?',
      ),
      ok: L("Ular qarshisidagi burchaklar ham teng bo'ladi.", 'Углы против них тоже равны.', 'The angles opposite them are equal too.'),
      items: [
        {
          id: 'a',
          correct: true,
          label: L('qarshisidagi burchaklar teng', 'углы против них равны', 'the opposite angles are equal'),
        },
        {
          id: 'b',
          tag: 'Z1',
          label: L('burchaklar bog\'liq emas', 'углы не связаны', 'the angles are unrelated'),
          hint: L("Bog'liq: 41-darsda buni chizmada ko'rdik.", 'Связаны: мы видели это на чертеже.', 'They are related: we saw it on the drawing.'),
        },
        {
          id: 'c',
          tag: 'Z1',
          label: L('hamma burchak teng', 'все углы равны', 'all the angles are equal'),
          hint: L("Faqat teng tomonlar qarshisidagilari.", 'Только те, что против равных сторон.', 'Only those opposite the equal sides.'),
        },
        {
          id: 'd',
          tag: 'Z2',
          label: L('uchdagi burchak eng katta', 'угол при вершине самый большой', 'the apex angle is the largest'),
          hint: L("Uchdagi burchak katta ham, kichik ham bo'lishi mumkin.", 'Угол при вершине может быть и большим, и малым.', 'The apex angle may be large or small.'),
        },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Perpendikulyar chiziq bilan qanday burchak hosil qiladi?",
        'Какой угол образует перпендикуляр с линией?',
        'What angle does a perpendicular make with a line?',
      ),
      ok: L("To'g'ri burchak: 90 daraja.", 'Прямой угол: 90 градусов.', 'A right angle: 90 degrees.'),
      items: [
        { id: 'a', label: '90°', correct: true },
        { id: 'b', label: '180°', tag: 'Z5', hint: L("Bir yuz sakson yoyilgan burchak.", 'Сто восемьдесят это развёрнутый угол.', 'One hundred eighty is a straight angle.') },
        { id: 'c', label: '45°', tag: 'Z5', hint: L("Qirq besh to'g'ri burchakning yarmi.", 'Сорок пять это половина прямого.', 'Forty five is half a right angle.') },
        { id: 'd', label: '60°', tag: 'Z5', hint: L("Perpendikulyar aynan to'g'ri burchak beradi.", 'Перпендикуляр даёт именно прямой угол.', 'A perpendicular gives exactly a right angle.') },
      ],
    },
  ],
  audio: [
    A('mount', "Uch savol: asos nima, teng tomonlar nima beradi va perpendikulyar nima.", 'Три вопроса: что такое основание, что дают равные стороны и что такое перпендикуляр.', 'Three questions: what the base is, what equal sides give, and what a perpendicular is.'),
    A('1', "Ikkinchisi tomonlar va burchaklar bog'liqligi haqida.", 'Второй про связь сторон и углов.', 'The second is about the link between sides and angles.'),
    A('2', "Uchinchisi perpendikulyar haqida.", 'Третий про перпендикуляр.', 'The third is about the perpendicular.'),
  ],
}

// ============================================================
// 3. TUSHUNTIRISH 1. ASOSDAGI BURCHAKLAR TENG.
// ============================================================
const S3 = {
  kind: 'figure',
  eyebrow: L('OCHAMIZ', 'РАЗБИРАЕМСЯ', 'WORKING IT OUT'),
  title: L('Asosdagi burchaklar', 'Углы при основании', 'The base angles'),
  pts: { A: { x: -3, y: -2 }, B: { x: 3, y: -2 }, C: { x: 0, y: 3 } },
  show: { sides: true, angles: true },
  mark: ['A', 'B'],
  caption: L(
    "Yon tomonlar teng. Asosdagi ikki burchak yoritilgan.",
    'Боковые стороны равны. Два угла при основании подсвечены.',
    'The legs are equal. The two base angles are highlighted.',
  ),
  options: [
    { id: 'a', label: L('asosdagi burchaklar teng', 'углы при основании равны', 'the base angles are equal') },
    { id: 'b', label: L('uchdagi burchak asosdagiga teng', 'угол при вершине равен углу при основании', 'the apex angle equals a base angle') },
    { id: 'c', label: L('hamma burchak teng', 'все углы равны', 'all the angles are equal') },
    { id: 'd', label: L('burchaklar tasodifan teng chiqdi', 'углы совпали случайно', 'the angles matched by chance') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z2', hint: L("Uchdagi burchakka qarang: uning soni boshqa.", 'Посмотри на угол при вершине: у него другое число.', 'Look at the apex angle: its number is different.') },
    { key: 'c', tag: 'Z1', hint: L("Faqat ikkitasi teng, uchinchisi boshqa.", 'Равны только два, третий другой.', 'Only two are equal, the third differs.') },
    { key: 'd', tag: 'Z4', hint: L("Tasodif emas: keyingi ekranda uchni ko'chirib sinab ko'ramiz.", 'Не случайно: на следующем экране перенесём вершину и проверим.', 'Not by chance: on the next screen we move the vertex and check.') },
  ],
  note: L(
    "Teng yonli uchburchakning ASOSIDAGI burchaklari teng. Bu chizmadagi son emas, xossa: u har qanday teng yonli uchburchakda bajariladi. Chizmadagi son esa o'lchov, ya'ni taxmin.",
    'В равнобедренном треугольнике углы ПРИ ОСНОВАНИИ равны. Это не число на чертеже, а свойство: оно выполняется в любом равнобедренном треугольнике. А число на чертеже это измерение, то есть предположение.',
    'In an isosceles triangle the BASE angles are equal. That is not a number on a drawing but a property: it holds in every isosceles triangle. The number on the drawing is a measurement, a guess.',
  ),
  audio: [
    A('mount', "Chizmada tomonlar va burchaklar o'lchandi.", 'На чертеже измерены стороны и углы.', 'On the drawing the sides and the angles are measured.'),
    A('mount', "Yon tomonlar teng chiqdi. Yoritilgan burchaklarga qarang.", 'Боковые стороны вышли равными. Посмотри на подсвеченные углы.', 'The legs came out equal. Look at the highlighted angles.'),
  ],
}

// ============================================================
// 4. FARQLASH. UCH KO'CHDI -- TENGLIK YO'QOLDI.
// ============================================================
const S4 = {
  kind: 'figure',
  eyebrow: L("FARQNI KO'RAMIZ", 'РАЗГРАНИЧЕНИЕ', 'TELLING THEM APART'),
  title: L('Uchni surib ko\'ramiz', 'Сдвинем вершину', 'Let us shift the vertex'),
  pts: { A: { x: -3, y: -2 }, B: { x: 3, y: -2 }, C: { x: 0, y: 3 } },
  move: 'C',
  pick: { x: 2, y: 3 },
  show: { sides: true, angles: true },
  caption: L(
    "C uchini (2; 3) nuqtaga ko'chiring. Asos joyida qoladi.",
    'Перенеси вершину C в точку (2; 3). Основание останется на месте.',
    'Move the vertex C to the point (2; 3). The base stays put.',
  ),
  options: [
    { id: 'a', label: L('tomonlar ham, burchaklar ham tengligini yo\'qotdi', 'и стороны, и углы потеряли равенство', 'both the sides and the angles lost their equality') },
    { id: 'b', label: L('faqat tomonlar o\'zgardi', 'изменились только стороны', 'only the sides changed') },
    { id: 'c', label: L('faqat burchaklar o\'zgardi', 'изменились только углы', 'only the angles changed') },
    { id: 'd', label: L('hech nima o\'zgarmadi', 'ничего не изменилось', 'nothing changed') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z1', hint: L("Burchaklarga ham qarang: ular ham endi har xil.", 'Посмотри и на углы: они тоже стали разными.', 'Look at the angles too: they differ now as well.') },
    { key: 'c', tag: 'Z1', hint: L("Tomonlarning soniga qarang: yon tomonlar endi teng emas.", 'Посмотри на числа сторон: боковые больше не равны.', 'Look at the side numbers: the legs are no longer equal.') },
    { key: 'd', tag: 'Z1', hint: L("Ko'chirishdan oldingi sonlarni eslang: ikkitasi bir xil edi.", 'Вспомни числа до переноса: два были одинаковыми.', 'Recall the numbers before the move: two were the same.') },
  ],
  note: L(
    "Tenglik chizmaning ko'rinishidan emas, TENG TOMONLARDAN chiqadi. Yon tomonlar teng bo'lishi to'xtadi -- burchaklar tengligi ham to'xtadi. Ikkovi bir vaqtda paydo bo'ladi va bir vaqtda yo'qoladi.",
    'Равенство идёт не от вида чертежа, а от РАВНЫХ СТОРОН. Боковые перестали быть равными и равенство углов тоже пропало. Одно и другое появляются и исчезают вместе.',
    'The equality comes not from how the drawing looks but from the EQUAL SIDES. The legs stopped being equal and the equal angles went with them. The two appear and vanish together.',
  ),
  audio: [
    A('mount', "Endi uchni suramiz va nima yo'qolganini ko'ramiz.", 'Теперь сдвинем вершину и посмотрим, что пропало.', 'Now we shift the vertex and see what is lost.'),
    A('mount', "Ikki ; uch nuqtani bosing.", 'Нажми на точку два ; три.', 'Tap the point two ; three.'),
    A('move', "Sonlarni ko'chirishdan oldingi bilan solishtiring.", 'Сравни числа с теми, что были до переноса.', 'Compare the numbers with those before the move.'),
  ],
}

// ============================================================
// 5. IKKINCHI KO'RINISH. Chizmasiz.
// ============================================================
const S5 = {
  kind: 'slot',
  role: 'explain',
  eyebrow: L("IKKINCHI KO'RINISH", 'ВТОРОЙ ВИД ЗАПИСИ', 'A SECOND WAY TO WRITE IT'),
  title: L('Chizmasiz', 'Без чертежа', 'Without a drawing'),
  given: L(
    "Teng yonli uchburchakning asosidagi bir burchagi 40 daraja. Asosdagi ikkinchisi nechcha daraja?",
    'В равнобедренном треугольнике один угол при основании 40 градусов. Сколько градусов второй угол при основании?',
    'One base angle of an isosceles triangle is 40 degrees. How big is the second base angle?',
  ),
  template: ['40°  =  ', { slot: 0 }],
  parts: [
    { id: 'a', label: '40°' },
    { id: 'b', label: '140°' },
    { id: 'c', label: '100°' },
    { id: 'd', label: '50°' },
  ],
  answer: ['a'],
  prompt: L(
    "Ikkinchi burchakni yozing.",
    'Запиши второй угол.',
    'Write the second angle.',
  ),
  checkNote: L(
    "Asosdagi burchaklar teng, shuning uchun hisoblash ham kerak emas: ikkinchisi ham 40 daraja.",
    'Углы при основании равны, поэтому и считать не нужно: второй тоже 40 градусов.',
    'The base angles are equal, so there is nothing to compute: the second is 40 degrees too.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z2', hint: L("Bu qo'shni burchak bo'lardi, savol esa uchburchakning ichidagi burchak haqida.", 'Это был бы смежный угол, а вопрос о угле внутри треугольника.', 'That would be the adjacent angle, the question is about the angle inside.') },
    { key: 'c', tag: 'Z2', hint: L("Bu uchdagi burchak bo'lishi mumkin, asosdagi esa yo'q.", 'Это мог бы быть угол при вершине, но не при основании.', 'That could be the apex angle, not a base angle.') },
    { key: 'd', tag: 'Z6', hint: L("To'qsonga to'ldirish bu boshqa masala.", 'Дополнение до девяноста это другая задача.', 'Filling up to ninety is another problem.') },
  ],
  audio: [
    A('mount', "Chizma yo'q, xossa esa ishlaydi.", 'Чертежа нет, а свойство работает.', 'No drawing, and the property still works.'),
  ],
}

// ============================================================
// 6. O'ZINGIZ. UCHDAN TUSHIRILGAN PERPENDIKULYAR.
// ============================================================
const S6 = {
  kind: 'figure',
  eyebrow: L("O'ZINGIZ", 'САМ', 'ON YOUR OWN'),
  title: L('Perpendikulyar qayerga tushadi', 'Куда падает перпендикуляр', 'Where the perpendicular lands'),
  pts: { A: { x: -4, y: -2 }, B: { x: 2, y: -2 }, C: { x: -1, y: 3 }, D: { x: 1, y: -2 } },
  seg: [['A', 'B'], ['A', 'C'], ['B', 'C'], ['C', 'D']],
  move: 'D',
  pick: { x: -1, y: -2 },
  caption: L(
    "Uchburchak teng yonli. D nuqtasini asosda shunday joyga ko'chiringki, C D asosga tik bo'lsin.",
    'Треугольник равнобедренный. Перенеси точку D по основанию так, чтобы C D стало перпендикулярно основанию.',
    'The triangle is isosceles. Move the point D along the base so that C D becomes perpendicular to it.',
  ),
  options: [
    { id: 'a', label: L('asosning o\'rtasiga', 'в середину основания', 'into the middle of the base') },
    { id: 'b', label: L('A ga yaqinroq', 'ближе к A', 'nearer to A') },
    { id: 'c', label: L('B ga yaqinroq', 'ближе к B', 'nearer to B') },
    { id: 'd', label: L('uchning ostiga tushmaydi', 'она не попадает под вершину', 'it does not land under the vertex') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z5', hint: L("A dan va B dan masofani sanang: ular bir xil chiqdi.", 'Посчитай расстояние от A и от B: они вышли одинаковыми.', 'Count the distance from A and from B: they came out the same.') },
    { key: 'c', tag: 'Z5', hint: L("B dan masofa A dan masofaga teng chiqdi.", 'Расстояние от B вышло равным расстоянию от A.', 'The distance from B came out equal to the one from A.') },
    { key: 'd', tag: 'Z5', hint: L("Tushdi: tik chiziq aynan uchning ostidan o'tdi.", 'Попадает: вертикальная линия прошла ровно под вершиной.', 'It does: the upright line passed exactly under the vertex.') },
  ],
  note: L(
    "Teng yonli uchburchakda uchdan tushirilgan perpendikulyar asosni TENG IKKIGA bo'ladi va uchdagi burchakni ham teng ikkiga bo'ladi. Bitta chiziq uch ishni bajaradi: balandlik, mediana va bissektrisa.",
    'В равнобедренном треугольнике перпендикуляр из вершины делит основание ПОПОЛАМ и делит пополам угол при вершине. Одна линия выполняет три роли: высота, медиана и биссектриса.',
    'In an isosceles triangle the perpendicular from the apex splits the base IN HALF and also halves the apex angle. One line does three jobs: height, median and bisector.',
  ),
  audio: [
    A('mount', "Uchdan asosga tik chiziq tushiramiz.", 'Опустим из вершины линию, перпендикулярную основанию.', 'Let us drop a line from the apex, perpendicular to the base.'),
    A('mount', "D ni ko'chiring: chiziq tik bo'lishi kerak.", 'Перенеси D: линия должна стать вертикальной.', 'Move D: the line must stand upright.'),
    A('move', "Endi A dan va B dan D gacha kataklarni sanang.", 'Теперь посчитай клетки от A до D и от B до D.', 'Now count the cells from A to D and from B to D.'),
  ],
}

// ============================================================
// 7. CHEGARAVIY HOLAT. UCHDA TO'G'RI BURCHAK.
// ============================================================
const S7 = {
  kind: 'figure',
  role: 'explain',
  eyebrow: L('CHEGARAVIY HOLAT', 'ГРАНИЧНЫЙ СЛУЧАЙ', 'THE EDGE CASE'),
  title: L('To\'g\'ri burchak qayerda bo\'lishi mumkin', 'Где может стоять прямой угол', 'Where a right angle can stand'),
  pts: { A: { x: -3, y: -3 }, B: { x: 1, y: -3 }, C: { x: -3, y: 1 } },
  show: { sides: true, angles: true },
  mark: ['A'],
  caption: L(
    "Bu uchburchak teng yonli: ikki tomoni 4 va 4. To'g'ri burchak yoritilgan uchda turadi.",
    'Этот треугольник равнобедренный: две стороны по 4. Прямой угол стоит при подсвеченной вершине.',
    'This triangle is isosceles: two sides are 4 and 4. The right angle is at the highlighted vertex.',
  ),
  options: [
    { id: 'a', label: L("faqat uchda: asosda bo'lsa ikkita bo'lib qolardi", 'только при вершине: при основании их было бы два', 'only at the apex: at the base there would be two') },
    { id: 'b', label: L('asosda ham bo\'lishi mumkin', 'может стоять и при основании', 'it can stand at the base too') },
    { id: 'c', label: L('istalgan uchda', 'при любой вершине', 'at any vertex') },
    { id: 'd', label: L('teng yonlida to\'g\'ri burchak bo\'lmaydi', 'в равнобедренном прямого угла не бывает', 'an isosceles triangle has no right angle') },
  ],
  answer: 'a',
  wrongs: [
    { key: 'b', tag: 'Z2', hint: L("Asosdagi burchaklar teng: bittasi 90 bo'lsa, ikkinchisi ham 90 bo'lardi.", 'Углы при основании равны: если один 90, то и второй 90.', 'The base angles are equal: if one is 90, so is the other.') },
    { key: 'c', tag: 'Z2', hint: L("Asosdagi ikki burchak bir-biriga bog'langan, uchdagi esa erkin.", 'Два угла при основании связаны между собой, а угол при вершине свободен.', 'The two base angles are tied to each other, the apex angle is free.') },
    { key: 'd', tag: 'Z2', hint: L("Chizmada aynan shunday uchburchak turibdi.", 'На чертеже как раз такой треугольник.', 'The drawing shows exactly such a triangle.') },
  ],
  note: L(
    "Teng yonli uchburchakda to'g'ri burchak faqat UCHDA bo'lishi mumkin. Asosdagi burchaklar teng, shuning uchun ikkovi ham 90 bo'lib qolardi, va uchburchak yopilmasdi.",
    'В равнобедренном треугольнике прямой угол может стоять только ПРИ ВЕРШИНЕ. Углы при основании равны, поэтому оба стали бы 90, и треугольник не замкнулся бы.',
    'In an isosceles triangle a right angle can only be at the APEX. The base angles are equal, so both would become 90 and the triangle could not close.',
  ),
  audio: [
    A('mount', "Chizmada teng yonli uchburchak, va uning uchida to'g'ri burchak.", 'На чертеже равнобедренный треугольник, и при его вершине прямой угол.', 'The drawing shows an isosceles triangle with a right angle at its apex.'),
    A('mount', "Savol: to'g'ri burchak asosda ham bo'la oladimi.", 'Вопрос: может ли прямой угол стоять и при основании.', 'The question: can a right angle stand at the base as well.'),
  ],
}

// ============================================================
// 8. QOIDA.
// ============================================================
const S8 = {
  kind: 'rule',
  tag: 'Z1',
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L("Qoidani o'zingiz yig'ing", 'Собери правило сам', 'Build the rule yourself'),
  field: 'accent',
  fragments: [
    { id: 'f1', label: L('ikki yon tomoni teng bo\'lsa', 'если две боковые стороны равны', 'if the two legs are equal') },
    { id: 'f2', label: L('asosdagi burchaklar ham teng bo\'ladi', 'то углы при основании тоже равны', 'then the base angles are equal too') },
    { id: 'f3', label: L('uchdan tushirilgan perpendikulyar', 'перпендикуляр из вершины', 'the perpendicular from the apex') },
    { id: 'f4', label: L('asosni teng ikkiga bo\'ladi', 'делит основание пополам', 'splits the base in half') },
  ],
  answer: ['f1', 'f2', 'f3', 'f4'],
  wrongHint: L(
    "Tartib buzildi. Avval shart va burchaklar tengligi, keyin perpendikulyar va u nima qilishi.",
    'Порядок нарушен. Сначала условие и равенство углов, потом перпендикуляр и что он делает.',
    'The order is off. The condition and the equal angles first, then the perpendicular and what it does.',
  ),
  lawChips: [
    { label: '=', tone: 's2' },
    { label: '90°', tone: 's1' },
    { label: '2', tone: 'off' },
    { label: '( )', tone: 'par' },
  ],
  lawSweep: L(
    "tenglik, to'g'ri burchak, ikkiga bo'linish, juftlik",
    'равенство, прямой угол, деление пополам, пара',
    'equality, the right angle, halving, the pair',
  ),
  rule: {
    badge: L('Qoida', 'Правило', 'The rule'),
    lines: [
      L(
        "Teng yonli uchburchakning ASOSIDAGI burchaklari teng. Teskarisi ham to'g'ri: uchburchakda ikki burchak teng bo'lsa, u teng yonli.",
        'В равнобедренном треугольнике углы ПРИ ОСНОВАНИИ равны. Верно и обратное: если в треугольнике два угла равны, он равнобедренный.',
        'In an isosceles triangle the BASE angles are equal. The converse holds too: if two angles of a triangle are equal, it is isosceles.',
      ),
      L(
        "Uchdan asosga tushirilgan perpendikulyar asosni teng ikkiga bo'ladi va uchdagi burchakni ham teng ikkiga bo'ladi. Bir chiziq balandlik, mediana va bissektrisa bo'lib xizmat qiladi.",
        'Перпендикуляр из вершины к основанию делит основание пополам и делит пополам угол при вершине. Одна линия служит высотой, медианой и биссектрисой.',
        'The perpendicular from the apex to the base halves the base and halves the apex angle. One line serves as height, median and bisector.',
      ),
    ],
  },
  hookCap: L(
    'Teng tomonlar  --  teng burchaklar',
    'Равные стороны — равные углы',
    'Equal sides — equal angles',
  ),
  helpLabel: L('Eslatma', 'Напоминание', 'A reminder'),
  helpRows: [
    L('asos  --  uchinchi tomon', 'основание это третья сторона', 'the base is the third side'),
    L('asosdagi burchaklar teng', 'углы при основании равны', 'the base angles are equal'),
    L("perpendikulyar  --  o'rtaga", 'перпендикуляр в середину', 'the perpendicular to the middle'),
  ],
  audio: [
    A('mount', "Ikki xossani ko'rdik: burchaklar tengligi va perpendikulyar.", 'Мы увидели два свойства: равенство углов и перпендикуляр.', 'We saw two properties: the equal angles and the perpendicular.'),
    A('ok', "To'g'ri. Endi bu xossalar bilan masala yechamiz.", 'Верно. Теперь решаем задачи с этими свойствами.', 'Correct. Now we solve problems with these properties.'),
  ],
}

// ============================================================
// 9. MASHQ 1. KVOTA EKRANI.
// ============================================================
const S9 = {
  kind: 'chain',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Xossalar bilan', 'Со свойствами', 'Using the properties'),
  question: L('Javob nima?', 'Каков ответ?', 'What is the answer?'),
  cols: 2,
  items: [
    {
      wrap: true,
      question: null,
      prompt: L(
        "Asosdagi bir burchak 55 daraja. Asosdagi ikkinchisi?",
        'Один угол при основании 55 градусов. Второй при основании?',
        'One base angle is 55 degrees. The second base angle?',
      ),
      ok: L("Ham 55 daraja: asosdagi burchaklar teng.", 'Тоже 55 градусов: углы при основании равны.', '55 degrees too: the base angles are equal.'),
      items: [
        { id: 'a', label: '55°', correct: true },
        { id: 'b', label: '125°', tag: 'Z2', hint: L("Bu qo'shni burchak.", 'Это смежный угол.', 'That is the adjacent angle.') },
        { id: 'c', label: '70°', tag: 'Z2', hint: L("Bu uchdagi burchak bo'lishi mumkin.", 'Это мог бы быть угол при вершине.', 'That could be the apex angle.') },
        { id: 'd', label: '35°', tag: 'Z6', hint: L("To'qsonga to'ldirish boshqa masala.", 'Дополнение до девяноста это другая задача.', 'Filling up to ninety is another problem.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Asosi 8 ga teng. Perpendikulyar asosni qanday bo'ladi?",
        'Основание равно 8. Как перпендикуляр делит основание?',
        'The base is 8. How does the perpendicular split it?',
      ),
      ok: L("Teng ikkiga: to'rt va to'rt.", 'Пополам: четыре и четыре.', 'In half: four and four.'),
      items: [
        {
          id: 'a',
          correct: true,
          label: L('4 va 4', '4 и 4', '4 and 4'),
        },
        {
          id: 'b',
          tag: 'Z5',
          label: L('3 va 5', '3 и 5', '3 and 5'),
          hint: L("Teng yonlida perpendikulyar o'rtaga tushadi.", 'В равнобедренном перпендикуляр падает в середину.', 'In an isosceles triangle the perpendicular lands in the middle.'),
        },
        {
          id: 'c',
          tag: 'Z5',
          label: L('2 va 6', '2 и 6', '2 and 6'),
          hint: L("Bo'linish teng bo'ladi.", 'Деление получается ровным.', 'The split comes out even.'),
        },
        {
          id: 'd',
          tag: 'Z5',
          label: L("bilib bo'lmaydi", 'узнать нельзя', 'it cannot be known'),
          hint: L("Bilish mumkin: xossa aynan shu haqida.", 'Можно: свойство как раз об этом.', 'It can: the property is exactly about this.'),
        },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Uchburchakda ikki burchak 65 va 65 daraja. U teng yonlimi?",
        'В треугольнике два угла 65 и 65 градусов. Он равнобедренный?',
        'A triangle has two angles of 65 and 65 degrees. Is it isosceles?',
      ),
      ok: L("Ha: teng burchaklar qarshisida teng tomonlar yotadi.", 'Да: против равных углов лежат равные стороны.', 'Yes: equal sides lie opposite equal angles.'),
      items: [
        { id: 'a', correct: true, label: L('ha', 'да', 'yes') },
        { id: 'b', tag: 'Z1', label: L("yo'q", 'нет', 'no'), hint: L("Xossa teskari tomonga ham ishlaydi.", 'Свойство работает и в обратную сторону.', 'The property works the other way too.') },
        { id: 'c', tag: 'Z1', label: L("tomonlarni o'lchash kerak", 'нужно измерить стороны', 'the sides must be measured'), hint: L("O'lchash kerak emas: teng burchaklar yetarli.", 'Измерять не нужно: равных углов достаточно.', 'No measuring needed: the equal angles are enough.') },
        { id: 'd', tag: 'Z2', label: L('faqat uchdagi burchak 50 bo\'lsa', 'только если угол при вершине 50', 'only if the apex angle is 50'), hint: L("Uchdagi burchakning kattaligi bunga aloqasi yo'q.", 'Величина угла при вершине здесь ни при чём.', 'The size of the apex angle is beside the point.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Teng yonli uchburchakda uchdagi burchak asosdagiga teng bo'la oladimi?",
        'Может ли в равнобедренном треугольнике угол при вершине быть равным углу при основании?',
        'Can the apex angle of an isosceles triangle equal a base angle?',
      ),
      ok: L("Ha: unda uchta burchak ham teng bo'ladi, va uchburchak teng tomonli bo'lib qoladi.", 'Да: тогда все три угла равны, и треугольник оказывается равносторонним.', 'Yes: then all three angles are equal and the triangle turns out equilateral.'),
      items: [
        { id: 'a', correct: true, label: L('ha, teng tomonlida', 'да, в равностороннем', 'yes, in an equilateral one') },
        { id: 'b', tag: 'Z2', label: L("yo'q, hech qachon", 'нет, никогда', 'no, never'), hint: L("Teng tomonli uchburchakda uchta burchak ham teng.", 'В равностороннем треугольнике все три угла равны.', 'In an equilateral triangle all three angles are equal.') },
        { id: 'c', tag: 'Z2', label: L('faqat 90 darajada', 'только при 90 градусах', 'only at 90 degrees'), hint: L("Ikkita 90 darajali burchak bo'lmaydi.", 'Двух углов по 90 градусов не бывает.', 'Two 90 degree angles cannot happen.') },
        { id: 'd', tag: 'Z3', label: L('asos o\'zgarishi kerak', 'основание должно измениться', 'the base must change'), hint: L("Teng tomonlida istalgan tomon asos bo'la oladi.", 'В равностороннем любая сторона может быть основанием.', 'In an equilateral triangle any side can be the base.') },
      ],
    },
  ],
  audio: [
    A('mount', "To'rt savol. Ikkinchisi perpendikulyar haqida.", 'Четыре вопроса. Второй про перпендикуляр.', 'Four questions. The second is about the perpendicular.'),
    A('1', "Ikkinchisida asos sakkiz.", 'Во втором основание восемь.', 'In the second the base is eight.'),
    A('2', "Uchinchisi teskari xossa haqida.", 'Третий про обратное свойство.', 'The third is about the converse.'),
    A('3', "Oxirgisi o'ylashni talab qiladi.", 'Последний требует подумать.', 'The last needs thinking.'),
  ],
}

// ============================================================
// 10. MASHQ 2. IKKI QADAM.
// ============================================================
const S10 = {
  kind: 'slot2',
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L('Burchak va asos', 'Угол и основание', 'The angle and the base'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  given: L(
    "Teng yonli uchburchakning asosidagi burchagi 48 daraja, asosi esa 10 ga teng. Ikkinchi asos burchagini va perpendikulyar ajratgan yarim asosni yozing.",
    'Угол при основании равнобедренного треугольника 48 градусов, а основание равно 10. Запиши второй угол при основании и половину основания, отсечённую перпендикуляром.',
    'A base angle of an isosceles triangle is 48 degrees and the base is 10. Write the second base angle and the half of the base cut off by the perpendicular.',
  ),
  template: ['48°  =  ', { slot: 0 }, ',   10 : 2  =  ', { slot: 1 }],
  parts: [
    { id: 'a', label: '48°' },
    { id: 'b', label: '5' },
    { id: 'c', label: '132°' },
    { id: 'd', label: '10' },
  ],
  answer: ['a', 'b'],
  prompt: L(
    "Ikkinchi burchakni va yarim asosni yozing.",
    'Запиши второй угол и половину основания.',
    'Write the second angle and half the base.',
  ),
  checkNote: L(
    "Asosdagi burchaklar teng, shuning uchun ikkinchisi ham 48 daraja. Perpendikulyar asosni teng ikkiga bo'ladi, demak har yarmi 5 ga teng.",
    'Углы при основании равны, поэтому второй тоже 48 градусов. Перпендикуляр делит основание пополам, значит каждая половина равна 5.',
    'The base angles are equal, so the second is 48 degrees too. The perpendicular halves the base, so each half is 5.',
  ),
  wrongs: [
    { key: 'c', tag: 'Z2', hint: L("Bu qo'shni burchak, uchburchakning ichidagi emas.", 'Это смежный угол, а не угол внутри треугольника.', 'That is the adjacent angle, not the one inside.') },
    { key: 'd', tag: 'Z5', hint: L("O'n bu butun asos, yarmi esa undan ikki barobar kichik.", 'Десять это всё основание, а половина вдвое меньше.', 'Ten is the whole base, the half is twice smaller.') },
    { key: '*', tag: 'Z1', hint: L("Birinchi bo'shliq burchak haqida, ikkinchisi uzunlik haqida.", 'Первый пропуск про угол, второй про длину.', 'The first gap is about the angle, the second about the length.') },
  ],
  probe: {
    question: L("Perpendikulyar uchdagi burchak bilan nima qiladi?", 'Что перпендикуляр делает с углом при вершине?', 'What does the perpendicular do to the apex angle?'),
    items: [
      { id: 'a', correct: true, label: L('teng ikkiga bo\'ladi', 'делит пополам', 'halves it') },
      { id: 'b', tag: 'Z5', label: L('o\'zgartirmaydi', 'не меняет', 'leaves it alone'), hint: L("Bo'ladi: bu uchinchi vazifasi, bissektrisa.", 'Делит: это его третья роль, биссектриса.', 'It halves it: that is its third job, the bisector.') },
      { id: 'c', tag: 'Z5', label: L('to\'g\'ri burchak qiladi', 'делает прямым', 'makes it right'), hint: L("To'g'ri burchak asos bilan hosil bo'ladi, uchdagisi bilan emas.", 'Прямой угол образуется с основанием, а не при вершине.', 'The right angle is made with the base, not at the apex.') },
      { id: 'd', tag: 'Z5', label: L('uchta qilib bo\'ladi', 'делит на три', 'splits it into three'), hint: L("Ikkiga bo'ladi, uchga emas.", 'Делит на две части, не на три.', 'It splits it in two, not three.') },
    ],
  },
  audio: [
    A('mount', "Ikki qadam: burchak va uzunlik.", 'Два шага: угол и длина.', 'Two steps: the angle and the length.'),
    A('two', "Endi asosni bo'lamiz.", 'Теперь делим основание.', 'Now we split the base.'),
  ],
}

// ============================================================
// 11. FAQAT O'ZINGIZ.
// ============================================================
const S11 = {
  kind: 'slot',
  eyebrow: L("FAQAT O'ZINGIZ", 'ТОЛЬКО САМ', 'ON YOUR OWN ONLY'),
  title: L('Teskari yo\'nalish', 'Обратное направление', 'The other direction'),
  given: L(
    "Uchburchakda ikki burchak 32 va 32 daraja. Yon tomonlar haqida nima aytish mumkin?",
    'В треугольнике два угла по 32 градуса. Что можно сказать о боковых сторонах?',
    'A triangle has two angles of 32 degrees each. What can be said about the legs?',
  ),
  template: ['32°  =  32°   →   ', { slot: 0 }],
  parts: [
    { id: 'a', label: L('yon tomonlar teng', 'боковые стороны равны', 'the legs are equal') },
    { id: 'b', label: L('yon tomonlar har xil', 'боковые стороны разные', 'the legs differ') },
    { id: 'c', label: L('asos yon tomonga teng', 'основание равно боковой', 'the base equals a leg') },
    { id: 'd', label: L('hech nima aytib bo\'lmaydi', 'сказать нельзя ничего', 'nothing can be said') },
  ],
  answer: ['a'],
  prompt: L(
    "Xulosani yozing.",
    'Запиши вывод.',
    'Write the conclusion.',
  ),
  checkNote: L(
    "Teng burchaklar qarshisida teng tomonlar yotadi, demak uchburchak teng yonli va yon tomonlari teng.",
    'Против равных углов лежат равные стороны, значит треугольник равнобедренный и его боковые стороны равны.',
    'Equal sides lie opposite equal angles, so the triangle is isosceles and its legs are equal.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z1', hint: L("Teng burchaklar aynan teng tomonlarni beradi.", 'Равные углы дают как раз равные стороны.', 'Equal angles give precisely equal sides.') },
    { key: 'c', tag: 'Z3', hint: L("Asos haqida hech narsa ma'lum emas: faqat yon tomonlar teng.", 'Про основание ничего не известно: равны только боковые.', 'Nothing is known about the base: only the legs are equal.') },
    { key: 'd', tag: 'Z1', hint: L("Aytish mumkin: xossa teskari tomonga ham ishlaydi.", 'Сказать можно: свойство работает и обратно.', 'It can be said: the property works both ways.') },
  ],
  audio: [
    A('mount', "Bu safar burchaklar berilgan, tomonlar so'ralgan.", 'На этот раз даны углы, а спрашивают про стороны.', 'This time the angles are given and the sides are asked about.'),
  ],
}

// ============================================================
// 12. TUZOQ (§8.2). Xossa TO'G'RI, lekin UCHDAGI burchakka
// qo'llanilgan.
// ============================================================
const S12 = {
  kind: 'trap',
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L('Xato birinchi qaysi qatorda', 'В какой строке ошибка впервые', 'Where the mistake first appears'),
  step1Cap: L('1-QADAM', 'ШАГ 1', 'STEP 1'),
  step2Cap: L('2-QADAM', 'ШАГ 2', 'STEP 2'),
  ask: L(
    "Shart to'g'ri yozilgan. Shunday bo'lsa ham, qaysi qator xato?",
    'Условие записано верно. И всё же какая строка ошибочна?',
    'The condition is written correctly. Even so, which line is wrong?',
  ),
  rows: [
    { id: 'r1', text: L('uchburchak teng yonli', 'треугольник равнобедренный', 'the triangle is isosceles') },
    { id: 'r2', text: L('uchdagi burchak 40°', 'угол при вершине 40°', 'the apex angle is 40°') },
    { id: 'r3', text: L("40° ning juft burchagi bor", 'у угла 40° есть равная пара', 'the 40° angle has an equal partner') },
    { id: 'r4', text: L('ikkinchi burchak ham 40°', 'второй угол тоже 40°', 'the second angle is 40° too') },
  ],
  answerId: 'r3',
  hints: {
    r1: L("Bu shart.", 'Это условие.', 'That is the condition.'),
    r2: L("Bu ham shart: uchdagi burchak berilgan.", 'Это тоже условие: дан угол при вершине.', 'That is the condition too: the apex angle is given.'),
    r4: L("Bu qator oldingisidan chiqqan. Xato esa undan YUQORIDA.", 'Эта строка выходит из предыдущей. А ошибка ВЫШЕ неё.', 'This line follows from the one before. The mistake is ABOVE it.'),
  },
  tags: { r1: 'Z2', r2: 'Z2', r4: 'Z1' },
  proofFill: {
    template: ['40°  ', { slot: 0 }, '   →   ', { slot: 1 }],
    parts: [
      { id: 'a', label: L('uchda turadi', 'стоит при вершине', 'stands at the apex') },
      { id: 'b', label: L('juftligi yo\'q', 'у него нет пары', 'it has no pair') },
      { id: 'c', label: L('asosda turadi', 'стоит при основании', 'stands at the base') },
      { id: 'd', label: L('juftligi bor', 'у него есть пара', 'it has a pair') },
    ],
    answer: ['a', 'b'],
    prompt: L(
      "Burchakning o'rnini va xulosani tuzating.",
      'Исправь место угла и вывод.',
      'Fix the place of the angle and the conclusion.',
    ),
    checkNote: L(
      "Xossa ASOSDAGI burchaklar haqida. Uchdagi burchak esa yolg'iz: unga teng burchak yo'q. Shuning uchun 40 daraja takrorlanmaydi.",
      'Свойство про углы ПРИ ОСНОВАНИИ. А угол при вершине одинок: равного ему нет. Поэтому 40 градусов не повторяется.',
      'The property is about the BASE angles. The apex angle is alone: nothing equals it. So the 40 degrees does not repeat.',
    ),
    wrongs: [
      { key: 'c', tag: 'Z2', hint: L("Qatorda yozilgan: burchak UCHDA turadi.", 'В строке написано: угол ПРИ ВЕРШИНЕ.', 'The line says: the angle is at the APEX.') },
      { key: 'd', tag: 'Z2', hint: L("Juftlik asosdagi burchaklarda bo'ladi, uchdagida yo'q.", 'Пара бывает у углов при основании, а у угла при вершине нет.', 'The base angles come in a pair, the apex angle does not.') },
      { key: '*', tag: 'Z2', hint: L("Gap burchakning o'rnida.", 'Дело в месте угла.', 'It is about where the angle is.') },
    ],
  },
  audio: [
    A('mount', "Bu tuzoqda xossa to'g'ri aytilgan.", 'В этой ловушке свойство названо верно.', 'In this trap the property is stated correctly.'),
    A('mount', "Lekin u qaysi burchakka qo'llanilganiga qarang.", 'Но посмотри, к какому углу оно применено.', 'But look at which angle it was applied to.'),
    A('proof', "Topdingiz. Uchdagi burchakning juftligi yo'q.", 'Нашёл. У угла при вершине пары нет.', 'You found it. The apex angle has no pair.'),
    A('done', "Xossa asosdagi burchaklar haqida.", 'Свойство про углы при основании.', 'The property is about the base angles.'),
  ],
}

// ============================================================
// 13. KO'CHIRISH. CHODIR.
// ============================================================
const S13 = {
  kind: 'slot',
  role: 'transfer',
  eyebrow: L("KO'CHIRISH", 'ПЕРЕНОС', 'TRANSFER'),
  title: L('Chodir', 'Палатка', 'A tent'),
  given: L(
    "Chodirning ikki yon tomoni bir xil kesilgan, yer bo'ylab kengligi 12 qadam. Chodirning o'rta ustuni yerga qayerda turadi?",
    'Две боковые стенки палатки скроены одинаково, по земле её ширина 12 шагов. Где стоит средний шест палатки?',
    'A tent has two identically cut side walls and is 12 paces wide on the ground. Where does its centre pole stand?',
  ),
  template: ['12 : 2  =  ', { slot: 0 }],
  parts: [
    { id: 'a', label: '6' },
    { id: 'b', label: '12' },
    { id: 'c', label: '4' },
    { id: 'd', label: '8' },
  ],
  answer: ['a'],
  prompt: L(
    "Ustundan chetgacha nechcha qadam ekanini yozing.",
    'Запиши, сколько шагов от шеста до края.',
    'Write how many paces from the pole to the edge.',
  ),
  checkNote: L(
    "Chodir teng yonli uchburchak, o'rta ustun esa uchdan tushirilgan perpendikulyar. U kenglikni teng ikkiga bo'ladi: har tomonda 6 qadam.",
    'Палатка это равнобедренный треугольник, а средний шест это перпендикуляр из вершины. Он делит ширину пополам: по 6 шагов с каждой стороны.',
    'The tent is an isosceles triangle and the centre pole is the perpendicular from the apex. It halves the width: 6 paces each side.',
  ),
  wrongs: [
    { key: 'b', tag: 'Z5', hint: L("O'n ikki butun kenglik, ustun esa uni yarmiga bo'ladi.", 'Двенадцать это вся ширина, а шест делит её пополам.', 'Twelve is the whole width, the pole halves it.') },
    { key: 'c', tag: 'Z6', hint: L("O'n ikkining yarmi olti.", 'Половина двенадцати это шесть.', 'Half of twelve is six.') },
    { key: 'd', tag: 'Z5', hint: L("Bo'linish teng bo'ladi: ikki tomonda bir xil.", 'Деление ровное: с двух сторон одинаково.', 'The split is even: the same on both sides.') },
  ],
  audio: [
    A('mount', "Chodir ham teng yonli uchburchak.", 'Палатка это тоже равнобедренный треугольник.', 'A tent is an isosceles triangle too.'),
    A('mount', "O'rta ustun uchdan tushirilgan perpendikulyar bo'lib xizmat qiladi.", 'Средний шест служит перпендикуляром из вершины.', 'The centre pole serves as the perpendicular from the apex.'),
  ],
}

// ============================================================
// 14. BLITS.
// ============================================================
const S14 = {
  kind: 'blitz',
  eyebrow: L('BLITS', 'БЛИЦ', 'QUICK ROUND'),
  title: L("To'rt savol", 'Четыре вопроса', 'Four questions'),
  cols: 2,
  items: [
    {
      wrap: true,
      question: null,
      prompt: L(
        "Asosdagi burchak 62 daraja. Ikkinchisi?",
        'Угол при основании 62 градуса. Второй?',
        'A base angle is 62 degrees. The second?',
      ),
      ok: L("Ham 62 daraja.", 'Тоже 62 градуса.', '62 degrees too.'),
      items: [
        { id: 'a', label: '62°', correct: true },
        { id: 'b', label: '118°', tag: 'Z2', hint: L("Bu qo'shni burchak.", 'Это смежный угол.', 'That is the adjacent angle.') },
        { id: 'c', label: '56°', tag: 'Z2', hint: L("Bu uchdagi burchak bo'lishi mumkin.", 'Это мог бы быть угол при вершине.', 'That could be the apex angle.') },
        { id: 'd', label: '28°', tag: 'Z6', hint: L("To'qsonga to'ldirish boshqa masala.", 'Дополнение до девяноста это другая задача.', 'Filling up to ninety is another problem.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Uchdan tushirilgan perpendikulyar asosni qanday bo'ladi?",
        'Как перпендикуляр из вершины делит основание?',
        'How does the perpendicular from the apex split the base?',
      ),
      ok: L("Teng ikkiga.", 'Пополам.', 'In half.'),
      items: [
        { id: 'a', correct: true, label: L('teng ikkiga', 'пополам', 'in half') },
        { id: 'b', tag: 'Z5', label: L('bo\'lmaydi', 'не делит', 'it does not split it'), hint: L("Bo'ladi, va aynan teng.", 'Делит, и ровно.', 'It does, and evenly.') },
        { id: 'c', tag: 'Z5', label: L('uchga', 'на три части', 'into three'), hint: L("Ikkiga bo'ladi.", 'Делит на две части.', 'It splits it in two.') },
        { id: 'd', tag: 'Z5', label: L('har xil bo\'ladi', 'по-разному', 'differently each time'), hint: L("Teng yonlida har doim teng bo'ladi.", 'В равнобедренном всегда ровно.', 'In an isosceles triangle always evenly.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Ikki burchagi 45 va 45 daraja bo'lgan uchburchak teng yonlimi?",
        'Треугольник с углами 45 и 45 градусов равнобедренный?',
        'Is a triangle with angles of 45 and 45 degrees isosceles?',
      ),
      ok: L("Ha: teng burchaklar teng tomonlarni beradi.", 'Да: равные углы дают равные стороны.', 'Yes: equal angles give equal sides.'),
      items: [
        { id: 'a', correct: true, label: L('ha', 'да', 'yes') },
        { id: 'b', tag: 'Z1', label: L("yo'q", 'нет', 'no'), hint: L("Xossa teskari tomonga ishlaydi.", 'Свойство работает и обратно.', 'The property works both ways.') },
        { id: 'c', tag: 'Z4', label: L("o'lchash kerak", 'нужно измерить', 'measuring is needed'), hint: L("Kerak emas: burchaklar yetarli.", 'Не нужно: углов достаточно.', 'Not needed: the angles are enough.') },
        { id: 'd', tag: 'Z1', label: L('faqat asosi katta bo\'lsa', 'только если основание больше', 'only if the base is larger'), hint: L("Asosning kattaligi shart emas.", 'Размер основания не важен.', 'The size of the base does not matter.') },
      ],
    },
    {
      wrap: true,
      question: null,
      prompt: L(
        "Teng yonli uchburchakda to'g'ri burchak qayerda bo'lishi mumkin?",
        'Где может стоять прямой угол в равнобедренном треугольнике?',
        'Where can a right angle stand in an isosceles triangle?',
      ),
      ok: L("Faqat uchda: asosda bo'lsa ikkitasi kerak bo'lardi.", 'Только при вершине: при основании их понадобилось бы два.', 'Only at the apex: at the base two would be needed.'),
      items: [
        { id: 'a', correct: true, label: L('faqat uchda', 'только при вершине', 'only at the apex') },
        { id: 'b', tag: 'Z2', label: L('faqat asosda', 'только при основании', 'only at the base'), hint: L("Asosdagi burchaklar teng, ikkita 90 esa bo'lmaydi.", 'Углы при основании равны, а двух по 90 не бывает.', 'The base angles are equal, and two 90s cannot be.') },
        { id: 'c', tag: 'Z2', label: L('istalgan joyda', 'в любом месте', 'anywhere'), hint: L("Asos bunga yo'l bermaydi.", 'Основание этого не допустит.', 'The base does not allow it.') },
        { id: 'd', tag: 'Z2', label: L('bo\'lmaydi', 'нигде', 'nowhere'), hint: L("Bo'ladi: chizmada ko'rdik.", 'Бывает: мы видели на чертеже.', 'It can: we saw it on the drawing.') },
      ],
    },
  ],
  audio: [
    A('mount', "Blits, to'rt savol. Yagona baholanadigan ekran.", 'Блиц, четыре вопроса. Единственный оцениваемый экран.', 'Quick round, four questions. The only graded screen.'),
    A('1', "Ikkinchisi perpendikulyar haqida.", 'Второй про перпендикуляр.', 'The second is about the perpendicular.'),
    A('2', "Uchinchisi teskari xossa haqida.", 'Третий про обратное свойство.', 'The third is about the converse.'),
    A('3', "Oxirgisi to'g'ri burchak haqida.", 'Последний про прямой угол.', 'The last is about the right angle.'),
  ],
}

// ============================================================
// 15. YAKUN.
// ============================================================
const S15 = {
  kind: 'wrap',
  eyebrow: L('YAKUN', 'ИТОГ', 'WRAP-UP'),
  title: L('Teng tomonlar boshqaradi', 'Командуют равные стороны', 'The equal sides are in charge'),
  gate: S1.gate,
  fix: {
    tokens: ['70°'],
    value: '70',
    sign: '=',
    hint: L('Yuqori tabloni bosing', 'Нажми на верхнее табло', 'Tap the upper board'),
  },
  fixSay: L(
    "Asosdagi burchaklar teng, shuning uchun ikkinchisi ham yetmish daraja. Uchni surganimizda tomonlar tengligi yo'qoldi va burchaklar tengligi ham yo'qoldi.",
    'Углы при основании равны, поэтому второй тоже семьдесят градусов. Когда мы сдвинули вершину, равенство сторон пропало, и равенство углов пропало вместе с ним.',
    'The base angles are equal, so the second is seventy degrees too. When we shifted the vertex the equal sides went, and the equal angles went with them.',
  ),
  predictLabel: L('Sizning taxminingiz', 'Твой прогноз', 'Your prediction'),
  predictMap: {
    same: L('ham 70 daraja', 'тоже 70 градусов', '70 degrees too'),
    adj: L('110 daraja', '110 градусов', '110 degrees'),
    ninety: L('90 daraja', '90 градусов', '90 degrees'),
    cant: L('bilib bo\'lmaydi', 'узнать нельзя', 'cannot be known'),
  },
  noAnswer: L('javob berilmadi', 'ответа не было', 'no answer'),
  tapeLabel: L("Bosib o'tilgan yo'l", 'Пройденный путь', 'The path you walked'),
  chips: ['5 = 5', '70° = 70°', '10 : 2 = 5', '90°'],
  twoLabel: L('Ikki xossa', 'Два свойства', 'Two properties'),
  twoA: L(
    'asosdagi burchaklar  →  teng',
    'углы при основании  →  равны',
    'the base angles  →  equal',
  ),
  twoB: L(
    "perpendikulyar  →  asosni o'rtadan",
    'перпендикуляр  →  основание пополам',
    'the perpendicular  →  the base in half',
  ),
  nextLabel: L('Keyingi', 'Дальше', 'Next'),
  nextTopic: L(
    "uchburchak burchaklarining yig'indisi",
    'сумма углов треугольника',
    'the sum of the angles of a triangle',
  ),
  gapPrefix: L('Takrorlash kerak', 'Требует повтора', 'Needs another look'),
  moreGaps: L('va yana', 'и ещё', 'and'),
  noGap: L("Kamchilik yo'q", 'Пробелов нет', 'No gaps'),
  audio: [
    A('mount', "Boshiga qaytamiz. Mana nima deb taxmin qilgan edingiz.", 'Вернёмся к началу. Вот что ты предполагал.', 'Back to the start. This is what you predicted.'),
    A('mount', "Hamma narsa teng tomonlardan chiqdi: burchaklar tengligi ham, perpendikulyarning xossasi ham.", 'Всё вышло из равных сторон: и равенство углов, и свойство перпендикуляра.', 'Everything came from the equal sides: the equal angles and the property of the perpendicular.'),
    A('mount', "Keyingi darsda uchta burchakni birga qo'shamiz.", 'На следующем уроке сложим все три угла вместе.', 'Next lesson we add all three angles together.'),
  ],
}

export default makeLesson({
  id: LESSON_ID,
  title: LESSON_TITLE,
  no: LESSON_NO,
  block: BLOCK,
  tags: TAGS,
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
