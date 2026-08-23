// ============================================================================
// 8-sinf, Dars 47. PIFAGOR TEOREMASI BILAN MASALALAR YECHISH.
//
// BLOK Б7, BLOKNING SO'NGGI DARSI (Pifagor qismi yakunlanadi). Bu fayl,
// FAQAT MA'LUMOT. Mexanika `screens.jsx`, `prooflines.jsx`, `tools.jsx`,
// `feed.jsx`, `method.jsx` da. YANGI PRIBOR YO'Q — `ProofLines` (dars 37+)
// yengil holatda qayta ishlatilgan.
//
// MANBA: 8-sinf geometriya darsligi, 3-§ (PIFAGOR TEOREMASI), 32-mavzu
// (104-106-bet), "MASALALAR YECHISH":
//   - 1-masala (104-bet): ustunni tik o'rnatish. 3, 4, 5 Pifagor uchligidan
//     foydalanib, ip asosdan 3 birlik, ustun uchigacha 5 birlik bo'lganda,
//     ustun 4 birlikka tik turadi. Ustunning aynan TIK turishini TEKSHIRISH
//     usuli, "misr uchburchagi"ning amaliy qo'llanilishi (44-darsdan tanish).
//   - 2-masala (104-105-bet): tomoni 10 birlik teng tomonli uchburchakning
//     yuzi. Balandlik asosning YARMIGA (5) va tomonga (10) Pifagor
//     teoremasini qo'llashdan topiladi: h = kvadrat ildiz(100 − 25) =
//     kvadrat ildiz 75 ≈ 8,66. Yuza S = ½ · 10 · h = 5·kvadrat ildiz 75 =
//     25·kvadrat ildiz 3 ≈ 43,3. Umumiy holda (31-mavzu, 388-mashq, teng
//     tomonli uchburchak uchun): S = (a² · kvadrat ildiz 3) : 4.
//   - 5-test (106-bet, uchtasi shu darsda ishlatilgan): 1) katet 12, gipotenuza
//     ikkinchi katetdan 6 birlik uzun — javob 15; 3) katet 12, ikkinchi katet
//     gipotenuzadan 8 birlik qisqa — javob 13; 5) rombning diagonallari 14 va
//     48, tomoni 7-24-25 uchligidan 25, perimetri 100; 6) to'g'ri to'rtburchakli
//     trapetsiya, asoslari 17 va 9, balandligi 15, yon tomoni 8-15-17
//     uchligidan 17.
//
// ADASHISHLAR, uchtasi yangi:
//   З99, algebraik shartda farq NOTO'G'RI tomonga qo'yilgan (gipotenuza
//   bilan katet farqi teskari yozilgan);
//   З100, teng tomonli uchburchakning balandligini topishda asosning
//   YARMI emas, TO'LIQ tomoni ishlatilgan;
//   З101, amaliy masalada ip TENG bo'laklarga bo'linishi kerak deb
//   o'ylangan, aslida 3:4:5 nisbatda bo'linadi;
//   З16, javob son bilan tekshirilmadi (11-ekranda, har doim shart).
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L, MATH_FONT, Row, T, useT } from './core.jsx'
import { SceneBand } from './method.jsx'
import { A, W, makeLesson } from './screens.jsx'
import { UI } from './karkas.js'

export const META = {
  id: 'geo-8-47',
  n: 47,
  row: 52,
  block: 'Б7',
  topic: L("Pifagor teoremasi bilan masalalar yechish", 'Решение задач по теореме Пифагора', 'Solving problems with the Pythagorean theorem'),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "Amaliy masalada Pifagor teoremasi tekshirish vositasi bo'ladi, masalan 3, 4, 5 uchligi orqali burchakning to'g'ri ekanini tekshirish mumkin",
    'В практической задаче теорема Пифагора служит средством проверки, например, тройкой 3, 4, 5 можно проверить, что угол прямой',
    'In a practical problem the Pythagorean theorem serves as a check, for example the triple 3, 4, 5 can verify that an angle is right',
  ),
  L(
    "Noma'lum uzunlik harf bilan belgilanadi, Pifagor tengligi yoziladi, va hosil bo'lgan tenglama yechiladi",
    'Неизвестная длина обозначается буквой, записывается равенство Пифагора, и полученное уравнение решается',
    'The unknown length is labelled with a letter, the Pythagorean equality is written, and the resulting equation is solved',
  ),
  L(
    "Teng tomonli uchburchakning balandligi asosning yarmiga Pifagor teoremasini qo'llashdan topiladi, yuzi esa S = (a² · kvadrat ildiz 3) : 4",
    'Высота равностороннего треугольника находится применением теоремы Пифагора к половине основания, а площадь S = (a² · корень из 3) : 4',
    'The height of an equilateral triangle is found by applying the Pythagorean theorem to half the base, and the area is S = (a² · root of 3) : 4',
  ),
]

export const MISS = {
  'З16': {
    what: L('javob son bilan tekshirilmadi', 'ответ не проверен числом', 'the answer was not checked with a number'),
    wrong: null,
    at: 11,
  },
  'З99': {
    what: L(
      "algebraik shartda farq noto'g'ri tomonga qo'yilgan, gipotenuza bilan katetning farqi teskari yozilgan",
      'в алгебраическом условии разность приписана не той стороне, разность гипотенузы и катета записана наоборот',
      'in the algebraic condition the difference was attached to the wrong side, the hypotenuse-leg difference was written backwards',
    ),
    wrong: null,
    at: 12,
  },
  'З100': {
    what: L(
      "teng tomonli uchburchakning balandligini topishda asosning yarmi emas, to'liq tomoni ishlatilgan",
      'при нахождении высоты равностороннего треугольника использована не половина основания, а вся сторона',
      'when finding the height of an equilateral triangle, the whole side was used instead of half the base',
    ),
    wrong: null,
    at: 12,
  },
  'З101': {
    what: L(
      "amaliy masalada ip teng bo'laklarga bo'linishi kerak deb o'ylangan, aslida 3:4:5 nisbatda bo'linadi",
      'в практической задаче считалось, что верёвку нужно делить на равные части, а на самом деле она делится в отношении 3:4:5',
      'in the practical problem it was thought the rope should be divided into equal parts, but it is actually divided in the ratio 3:4:5',
    ),
    wrong: null,
    at: 3,
  },
}

// ============================================================
// CHERTYOZH KOORDINATALARI (4-ekran, ProofLines). Teng tomonli uchburchak,
// balandlik asosni ikkiga bo'ladi.
// ============================================================
const EQT = { A: [55, 20], B: [15, 85], C: [95, 85] }
const EQT_ORDER = ['A', 'B', 'C']

// ============================================================
// SAHNALAR (§6). Xuk: ustunning tik ekanini qanday tekshirish mumkin.
// ============================================================
const SC_ASK = L('AMALIYOTDA PIFAGOR', 'ПИФАГОР НА ПРАКТИКЕ', 'PYTHAGORAS IN PRACTICE')

const HookScene = () => {
  return (
    <SceneBand kind="hook" label={SC_ASK}>
      <line x1="175" y1="90" x2="175" y2="35" stroke={T.ink3} strokeWidth="2"/>
      <line x1="175" y1="90" x2="215" y2="90" stroke={T.ink4} strokeWidth="1.2" strokeDasharray="3,2"/>
      <line x1="175" y1="35" x2="215" y2="90" stroke={T.ink4} strokeWidth="1.2" strokeDasharray="3,2"/>
      <g className="g8-seat" style={{ '--d': '2200ms' }}>
        <circle cx="195" cy="63" r="14" fill={T.graphSoft}
          stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.4"/>
        <text x="195" y="68" textAnchor="middle" fontFamily={MATH_FONT} fontSize="14"
          fontWeight="700" fill={T.graph}>?</text>
      </g>
    </SceneBand>
  )
}

const FinalScene = () => {
  return (
    <SceneBand kind="final" label={L(
      "Bir teorema, uch xil masala: tekshirish, tenglama, balandlik",
      'Одна теорема, три разные задачи: проверка, уравнение, высота',
      'One theorem, three different problems: checking, an equation, a height',
    )}>
      <polygon points="150,90 220,90 185,35" fill="none" stroke={T.ok} strokeWidth="1.6"/>
      <line x1="185" y1="35" x2="185" y2="90" stroke={T.ok} strokeWidth="1.2" strokeDasharray="2,2"/>
    </SceneBand>
  )
}

// ============================================================
// EKRAN 1. XUK. Taxmin rejimi (§5): razbor yo'q, baho yo'q.
// ============================================================
const S1 = {
  role: 'hook',
  tool: 'pick',
  scene: <HookScene/>,
  eyebrow: L('USTUNNI TIK O\'RNATISH', 'УСТАНОВКА СТОЛБА', 'SETTING UP A POST'),
  title: L(
    "Burchak o'lchagich yo'q, faqat ip bor. Ustunning tik turganini qanday tekshirasiz",
    'Транспортира нет, есть только верёвка. Как проверить, что столб стоит вертикально',
    'There is no protractor, only a rope. How would you check that a post stands vertical',
  ),
  lead: UI.hookLead,
  audio: [
    A('mount',
      "Qurilishda burchak o'lchagich har doim qo'lda bo'lmaydi.",
      'На стройке транспортир не всегда под рукой.',
      'On a construction site, a protractor is not always at hand.'),
    A('why',
      "Taxmin qiling, faqat ip va o'lchov bilan qanday tekshirish mumkin.",
      'Предположи, как проверить это только верёвкой и измерением.',
      'Predict how this can be checked with just a rope and a measurement.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Sizningcha, buni faqat ip bilan qanday tekshirish mumkin?",
      'Как думаешь, как это проверить только верёвкой?',
      'What do you think, how can this be checked with just a rope?',
    ),
    items: [
      { id: 'a', show: L("Ipni uch teng bo'lakka bo'lib", 'Разделив верёвку на три равные части', 'By dividing the rope into three equal parts') },
      { id: 'b', show: L("Ipni 3, 4, 5 nisbatda bo'lib", 'Разделив верёвку в отношении 3, 4, 5', 'By dividing the rope in a 3, 4, 5 ratio') },
      { id: 'c', show: L("Buni faqat ko'z bilan baholash mumkin", 'Это можно оценить только на глаз', 'This can only be judged by eye') },
      { id: 'd', show: L("Ip bilan umuman tekshirib bo'lmaydi", 'Верёвкой это вообще нельзя проверить', 'A rope cannot check this at all') },
    ],
    after: UI.hookAfter,
  },
}

// ============================================================
// EKRAN 2. TAYANCH. Pifagor uchligini eslash (44-darsdan).
// ============================================================
const S2 = {
  role: 'support',
  tool: 'pick',
  eyebrow: UI.supportEyebrow,
  title: L(
    "Misr uchburchagini eslash",
    'Вспоминаем египетский треугольник',
    'Recalling the Egyptian triangle',
  ),
  audio: [
    A('mount',
      "44-darsda uch, to'rt va besh sonlarini ko'rgan edingiz.",
      'На 44 уроке ты видел числа три, четыре и пять.',
      'In lesson 44 you saw the numbers three, four, and five.'),
    A('why',
      "Bu sonlar to'g'ri burchakli uchburchak hosil qiladi, buni allaqachon tekshirgansiz.",
      'Эти числа образуют прямоугольный треугольник, ты это уже проверял.',
      'These numbers form a right triangle, you already checked this.'),
  ],
  props: {
    ask: L(
      "Uch, to'rt va besh sonlari to'g'ri burchakli uchburchak hosil qiladimi?",
      'Образуют ли числа три, четыре и пять прямоугольный треугольник?',
      'Do the numbers three, four, and five form a right triangle?',
    ),
    items: [
      { id: 'right', show: L('Ha', 'Да', 'Yes'), right: true, name: L("uch va to'rtning kvadratlari yig'indisi beshning kvadratiga teng", 'сумма квадратов трёх и четырёх равна квадрату пяти', 'the sum of the squares of three and four equals the square of five') },
      {
        id: 'wrong', show: L("Yo'q", 'Нет', 'No'),
        hint: L("Hisoblab ko'ring, to'qqiz qo'shilgan o'n olti, yigirma besh, beshning kvadrati ham shu.", 'Посчитай, девять плюс шестнадцать, двадцать пять, квадрат пяти тоже такой.', 'Compute it, nine plus sixteen is twenty-five, the square of five is the same.'),
      },
    ],
    after: L(
      "To'g'ri. Bugun shu uchlikdan amaliyotda foydalanamiz.",
      'Верно. Сегодня используем эту тройку на практике.',
      'Correct. Today we use this triple in practice.',
    ),
  },
}

// ============================================================
// EKRAN 3. USTUNNI TIK O'RNATISH (`twoways`). 1-masala, 104-bet. Ловушка,
// ip teng bo'laklarga bo'linishi (З101).
// ============================================================
const S3 = {
  role: 'explain',
  tool: 'twoways',
  tag: 'З101',
  eyebrow: L('USTUNNI TIK O\'RNATISH', 'УСТАНОВКА СТОЛБА', 'SETTING UP THE POST'),
  title: L(
    "Ip qanday bo'linganda ustun tik turadi",
    'Как разделённая верёвка показывает, что столб стоит вертикально',
    'How a divided rope shows the post stands vertical',
  ),
  audio: [
    A('mount',
      "Ustun asosidan uch birlik masofada belgi qo'yiladi.",
      'От основания столба откладывается отметка на расстоянии три единицы.',
      'From the base of the post, a mark is placed three units away.'),
    W('w2',
      "Agar ustun uchigacha bo'lgan masofa besh birlik chiqsa, ustun tik turadi, u to'rt birlik baland.",
      'Если расстояние до верха столба выходит пять единиц, столб стоит вертикально, его высота четыре единицы.',
      'If the distance to the top of the post comes out to five units, the post stands vertical, it is four units tall.'),
    W('w4',
      "Ip teng uch qismga bo'linsa, bu tekshirish ishlamaydi, chunki teng bo'laklar to'g'ri burchak hosil qilmaydi.",
      'Если верёвку разделить на три равные части, эта проверка не работает, потому что равные части не дают прямой угол.',
      'If the rope is divided into three equal parts, this check does not work, because equal parts do not give a right angle.',
    ),
  ],
  props: {
    stepMs: 1500,
    blocks: [
      {
        name: L('TO\'G\'RI USUL, 3:4:5', 'ПРАВИЛЬНЫЙ СПОСОБ, 3:4:5', 'THE CORRECT WAY, 3:4:5'),
        lead: L(
          "Ip 3, 4 va 5 birlikka bo'lingan",
          'Верёвка разделена на 3, 4 и 5 единиц',
          'The rope is divided into 3, 4, and 5 units',
        ),
        rows: [
          { text: '3² + 4² = 25' },
          { text: L("beshning kvadrati ham shu, to'g'ri burchak bor", 'квадрат пяти тоже такой, прямой угол есть', 'the square of five is the same, the right angle exists'), tone: 'ok' },
        ],
      },
      {
        name: L('NOTO\'G\'RI USUL, TENG BO\'LAKLAR', 'НЕВЕРНЫЙ СПОСОБ, РАВНЫЕ ЧАСТИ', 'THE WRONG WAY, EQUAL PARTS'),
        lead: L(
          "Ip uch teng qismga, masalan 4, 4 va 4 ga bo'linsa",
          'Верёвка разделена на три равные части, например 4, 4 и 4',
          'The rope is divided into three equal parts, say 4, 4, and 4',
        ),
        rows: [
          { text: '4² + 4² = 32' },
          { text: L("to'rtning kvadratiga teng emas, o'n olti, to'g'ri burchak yo'q", 'не равно квадрату четырёх, шестнадцать, прямого угла нет', 'not equal to the square of four, sixteen, there is no right angle'), tone: 'ok' },
        ],
      },
      {
        tone: 'sum',
        name: L('NISBAT MUHIM, TENGLIK EMAS', 'ВАЖНО ОТНОШЕНИЕ, А НЕ РАВЕНСТВО', 'THE RATIO MATTERS, NOT EQUALITY'),
        lead: L(
          "Faqat 3:4:5 kabi Pifagor uchligi to'g'ri burchak beradi",
          'Только пифагорова тройка вроде 3:4:5 даёт прямой угол',
          'Only a Pythagorean triple like 3:4:5 gives a right angle',
        ),
        rows: [{ text: L("uchlik tekshiriladi, teng bo'laklar emas", 'проверяется тройка, а не равные части', 'the triple is checked, not equal parts'), tone: 'ok' }],
      },
    ],
  },
}

// ============================================================
// EKRAN 4. TENG TOMONLI UCHBURCHAKNING BALANDLIGI (`prooflines`).
// 2-masala, 104-105-bet. Ловушка, asosning yarmi emas, to'liq tomon
// ishlatilgan (З100).
// ============================================================
const S4 = {
  role: 'explain',
  tool: 'prooflines',
  tag: 'З100',
  eyebrow: L('TENG TOMONLI UCHBURCHAKNING BALANDLIGI', 'ВЫСОТА РАВНОСТОРОННЕГО ТРЕУГОЛЬНИКА', 'THE HEIGHT OF THE EQUILATERAL TRIANGLE'),
  title: L(
    "Tomoni o'n birlik bo'lgan teng tomonli uchburchakning balandligi",
    'Высота равностороннего треугольника со стороной десять',
    'The height of an equilateral triangle with side ten',
  ),
  audio: [
    A('mount',
      "ABC teng tomonli uchburchak, har bir tomoni o'n. AD balandlik, D asosda.",
      'ABC равносторонний треугольник, каждая сторона десять. AD высота, D на основании.',
      'ABC is an equilateral triangle, each side ten. AD is the height, D on the base.'),
    A('why',
      "Teng tomonli uchburchakda balandlik asosni ANIQ ikkiga bo'ladi.",
      'В равностороннем треугольнике высота делит основание РОВНО пополам.',
      'In an equilateral triangle, the height divides the base EXACTLY in half.'),
  ],
  props: {
    points: EQT,
    order: EQT_ORDER,
    marks: [['A', 'B']],
    given: [
      L("ABC, teng tomonli uchburchak, AB = BC = CA = 10", 'ABC, равносторонний треугольник, AB = BC = CA = 10', 'ABC, an equilateral triangle, AB = BC = CA = 10'),
      L("AD, balandlik, D nuqta BC da", 'AD, высота, точка D на BC', 'AD, the height, point D on BC'),
    ],
    goal: L("AD ni topish", 'найти AD', 'find AD'),
    lines: [
      {
        text: L("teng tomonli uchburchakda balandlik asosni teng ikkiga bo'ladi, BD = 5", 'в равностороннем треугольнике высота делит основание пополам, BD = 5', 'in an equilateral triangle the height bisects the base, BD = 5'),
        options: [
          { id: 'ok', right: true, label: L("ABD va ACD uchburchaklar teng, chunki AB=AC, AD umumiy, ikkalasi ham to'g'ri burchakli", 'Треугольники ABD и ACD равны, так как AB=AC, AD общая, оба прямоугольные', 'Triangles ABD and ACD are congruent, since AB=AC, AD is shared, both are right triangles') },
          { id: 'no', label: L("BD = 10, chunki BC = 10", 'BD = 10, потому что BC = 10', 'BD = 10, because BC = 10'), hint: L("BD butun BC emas, uning yarmi, D nuqta BC ning o'rtasida.", 'BD не весь BC, а его половина, точка D в середине BC.', 'BD is not the whole of BC, but its half, point D is the midpoint of BC.') },
        ],
      },
      {
        text: L("to'g'ri burchakli ABD uchburchakda AD² = AB² − BD²", 'в прямоугольном треугольнике ABD, AD² = AB² − BD²', 'in right triangle ABD, AD² = AB² − BD²'),
        options: [
          { id: 'ok', right: true, label: L("Pifagor teoremasidan, AB gipotenuza, BD va AD katetlar", 'По теореме Пифагора, AB гипотенуза, BD и AD катеты', 'By the Pythagorean theorem, AB is the hypotenuse, BD and AD are the legs') },
          { id: 'no', label: L("AD² = AB² − AB² bo'ladi", 'AD² = AB² − AB²', 'AD² = AB² − AB²'), hint: L("BD, AB ga teng emas, u AB ning yarmi, besh.", 'BD не равно AB, это половина AB, пять.', 'BD is not equal to AB, it is half of AB, five.') },
        ],
      },
      {
        text: L("AD² = 100 − 25 = 75, demak AD = kvadrat ildiz 75", 'AD² = 100 − 25 = 75, значит AD = корень из 75', 'AD² = 100 − 25 = 75, so AD = root of 75'),
        options: [
          { id: 'ok', right: true, label: L("O'n ning kvadrati yuz, beshning kvadrati yigirma besh, ayirmasi yetmish besh", 'Квадрат десяти сто, квадрат пяти двадцать пять, разность семьдесят пять', 'The square of ten is a hundred, the square of five is twenty-five, the difference is seventy-five') },
          { id: 'no', label: L("AD² = 100 − 10 = 90 bo'ladi", 'AD² = 100 − 10 = 90', 'AD² = 100 − 10 = 90'), hint: L("Ayirilishi kerak bo'lgan son BD ning KVADRATI, yigirma besh, BD ning o'zi emas.", 'Вычитается КВАДРАТ BD, двадцать пять, а не само BD.', 'What gets subtracted is the SQUARE of BD, twenty-five, not BD itself.') },
        ],
      },
    ],
    after: L(
      "Topildi. Balandlik kvadrat ildiz yetmish besh, taxminan sakkiz nuqta oltmish olti.",
      'Найдено. Высота равна корню из семидесяти пяти, примерно восемь целых шестьдесят шесть.',
      'Found. The height equals the root of seventy-five, approximately eight point six six.',
    ),
  },
}

// ============================================================
// EKRAN 5. YUZANI HISOBLASH (`parts`). 2-masala davomi, umumiy formula.
// ============================================================
const S5 = {
  role: 'explain',
  tool: 'parts',
  tag: 'З100',
  eyebrow: L('TENG TOMONLI UCHBURCHAKNING YUZASI', 'ПЛОЩАДЬ РАВНОСТОРОННЕГО ТРЕУГОЛЬНИКА', 'THE AREA OF THE EQUILATERAL TRIANGLE'),
  title: L(
    "Umumiy formulaning uch qismi",
    'Три части общей формулы',
    'The three parts of the general formula',
  ),
  audio: [
    A('mount',
      "Balandlik orqali topilgan yuza umumiy formulaga aylanadi.",
      'Найденная через высоту площадь превращается в общую формулу.',
      'The area found through the height turns into a general formula.'),
    W('p2',
      "Tomon kvadratga oshiriladi, aynan shu, YARMI emas.",
      'Сторона возводится в квадрат, именно она, а не её половина.',
      'The side is squared, exactly it, not its half.'),
    W('p4',
      "To'rtga bo'linadi, chunki yarim asos va ½ koeffitsienti birlashib shu songa aylanadi.",
      'Делится на четыре, потому что половина основания и коэффициент ½ вместе дают это число.',
      'It is divided by four, because half the base and the coefficient ½ together give this number.',
    ),
  ],
  props: {
    tokens: [
      { t: 'S = ', id: 'mid' },
      { t: 'a²', id: 'a' },
      { t: ' · √3  : 4', id: 'b' },
    ],
    steps: [
      {
        focus: 'mid',
        text: L(
          "Bu, tomoni a bo'lgan HAR QANDAY teng tomonli uchburchak uchun ishlaydigan formula.",
          'Это формула, которая работает для ЛЮБОГО равностороннего треугольника со стороной a.',
          'This is a formula that works for ANY equilateral triangle with side a.',
        ),
      },
      {
        focus: 'a',
        text: L(
          "a², tomonning o'zi kvadratga oshirilgan, uning yarmi emas.",
          'a², сама сторона в квадрате, а не её половина.',
          'a², the side itself squared, not its half.',
        ),
      },
      {
        focus: 'b',
        text: L(
          "Kvadrat ildiz uch va to'rtga bo'lish, balandlik formulasidan kelib chiqqan doimiy qismlar.",
          'Корень из трёх и деление на четыре, постоянные части, получившиеся из формулы высоты.',
          'The root of three and dividing by four, constant parts that come from the height formula.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "Tomoni o'n birlik bo'lganda ham xuddi shu formula ishlaydi, yigirma besh ko'paytirilgan kvadrat ildiz uch, taxminan qirq uch nuqta uch.",
        'Даже при стороне десять работает та же формула, двадцать пять умножить на корень из трёх, примерно сорок три целых три.',
        'Even with side ten, the same formula works, twenty-five times the root of three, approximately forty-three point three.',
      ),
    },
  },
}

// ============================================================
// EKRAN 6. ALGEBRAIK MASALA (`twoways`). 5-test, 1-savol uslubi.
// Ловушка, farq noto'g'ri tomonga qo'yilgan (З99).
// ============================================================
const S6 = {
  role: 'explain',
  tool: 'twoways',
  tag: 'З99',
  eyebrow: L('NOMA\'LUMNI HARF BILAN BELGILASH', 'ОБОЗНАЧЕНИЕ НЕИЗВЕСТНОГО БУКВОЙ', 'LABELLING THE UNKNOWN WITH A LETTER'),
  title: L(
    "Bir katet o'n ikki, gipotenuza ikkinchi katetdan olti birlik uzun",
    'Один катет двенадцать, гипотенуза на шесть единиц длиннее второго катета',
    'One leg is twelve, the hypotenuse is six units longer than the other leg',
  ),
  audio: [
    A('mount',
      "Ikkinchi katet x deb belgilansin, u holda gipotenuza x plus olti bo'ladi.",
      'Второй катет обозначим x, тогда гипотенуза равна x плюс шесть.',
      'Let the second leg be x, then the hypotenuse is x plus six.'),
    W('w2',
      "Gipotenuzaga OLTI QO'SHILADI, chunki u ikkinchi katetdan UZUN, kamaytirilmaydi.",
      'К гипотенузе ШЕСТЬ ПРИБАВЛЯЕТСЯ, потому что она ДЛИННЕЕ второго катета, а не короче.',
      'SIX IS ADDED to the hypotenuse, because it is LONGER than the other leg, not shorter.'),
    W('w4',
      "Tenglama yechilsa, x to'qqiz chiqadi, gipotenuza esa o'n besh.",
      'Решив уравнение, x выходит девять, а гипотенуза пятнадцать.',
      'Solving the equation, x comes out to nine, and the hypotenuse is fifteen.',
    ),
  ],
  props: {
    stepMs: 1600,
    blocks: [
      {
        name: L('BELGILASH', 'ОБОЗНАЧЕНИЕ', 'LABELLING'),
        lead: L(
          "Ikkinchi katet x, gipotenuza x + 6",
          'Второй катет x, гипотенуза x + 6',
          'The second leg is x, the hypotenuse is x + 6',
        ),
        rows: [
          { text: '12² + x² = (x + 6)²' },
          { text: L("Pifagor tengligi shunday yoziladi", 'равенство Пифагора записывается так', 'the Pythagorean equality is written this way'), tone: 'ok' },
        ],
      },
      {
        name: L('YECHISH', 'РЕШЕНИЕ', 'SOLVING'),
        lead: L(
          "Qavslar ochilib, x lar soddalashtiriladi",
          'Скобки раскрываются, x упрощаются',
          'The brackets open, the x terms simplify',
        ),
        rows: [
          { text: '144 = 12x + 36' },
          { text: L("x to'qqizga teng chiqadi", 'x выходит равным девяти', 'x comes out equal to nine'), tone: 'ok' },
        ],
      },
      {
        tone: 'sum',
        name: L('JAVOB', 'ОТВЕТ', 'THE ANSWER'),
        lead: L(
          "Ikkinchi katet to'qqiz, gipotenuza esa oltiga ko'p, o'n besh",
          'Второй катет девять, а гипотенуза на шесть больше, пятнадцать',
          'The second leg is nine, and the hypotenuse is six more, fifteen',
        ),
        rows: [{ text: L("javob har doim shartga qaytarib tekshiriladi", 'ответ всегда проверяется возвращением к условию', 'the answer is always checked by returning to the condition'), tone: 'ok' }],
      },
    ],
  },
}

// ============================================================
// EKRAN 7. TENGLAMA TUZISHNING UCH QADAMI (`parts`).
// ============================================================
const S7 = {
  role: 'explain',
  tool: 'parts',
  tag: 'З99',
  eyebrow: L('TENGLAMA TUZISHNING UCH QADAMI', 'ТРИ ШАГА СОСТАВЛЕНИЯ УРАВНЕНИЯ', 'THE THREE STEPS OF SETTING UP THE EQUATION'),
  title: L(
    "Tenglama tuzishning uch qadami",
    'Три шага составления уравнения',
    'The three steps of setting up the equation',
  ),
  audio: [
    A('mount',
      "Noma'lum uzunlik bo'lgan har qanday masalada shu uch qadam takrorlanadi.",
      'В любой задаче с неизвестной длиной повторяются эти три шага.',
      'In any problem with an unknown length, these three steps repeat.'),
    W('p2',
      "Kichikroq narsa x deb olinadi, boshqa hamma narsa x orqali yoziladi.",
      'Меньшая величина берётся за x, всё остальное записывается через x.',
      'The smaller quantity is taken as x, everything else is written through x.'),
    W('p4',
      "Shartdagi so'z UZUN yoki QISQA, qaysi tomonga QO'SHILISHI yoki AYRILISHINI ko'rsatadi.",
      'Слово в условии, ДЛИННЕЕ или КОРОЧЕ, показывает, к какой стороне ПРИБАВЛЯТЬ или от какой ОТНИМАТЬ.',
      'The word in the condition, LONGER or SHORTER, shows which side to ADD to or SUBTRACT from.',
    ),
  ],
  props: {
    tokens: [
      { t: 'x', id: 'mid' },
      { t: '  →  a² + x² = c²  →  ', id: 'a' },
      { t: 'x = ?', id: 'b' },
    ],
    steps: [
      {
        focus: 'mid',
        text: L(
          "Birinchi qadam, noma'lum tomonni x deb belgilash.",
          'Первый шаг, обозначить неизвестную сторону через x.',
          'The first step, label the unknown side x.',
        ),
      },
      {
        focus: 'a',
        text: L(
          "Ikkinchi qadam, uchta tomonni x orqali yozib, Pifagor tengligini tuzish, farq to'g'ri tomonga qo'shiladi.",
          'Второй шаг, записать все три стороны через x и составить равенство Пифагора, разность приписывается к верной стороне.',
          'The second step, write all three sides through x and set up the Pythagorean equality, with the difference attached to the correct side.',
        ),
      },
      {
        focus: 'b',
        text: L(
          "Uchinchi qadam, qavslarni ochib, tenglamani yechish.",
          'Третий шаг, раскрыть скобки и решить уравнение.',
          'The third step, expand the brackets and solve the equation.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "Bu usul faqat uchburchaklarda emas, kundalik masalalarda ham ishlaydi, masalan, ikkita raqamning yig'indisi va farqi berilganda ularning o'zini topishda.",
        'Этот способ работает не только в треугольниках, но и в повседневных задачах, например, когда даны сумма и разность двух чисел и нужно найти сами числа.',
        'This method works not only in triangles, but in everyday problems too, for example when the sum and difference of two numbers are given and the numbers themselves must be found.',
      ),
    },
  },
}

// ============================================================
// EKRAN 8. QOIDA (`rulebuild`). Darslik 32-mavzu.
// ============================================================
const S8 = {
  role: 'rule',
  tool: 'rulebuild',
  tag: 'З99',
  eyebrow: UI.ruleEyebrow,
  title: L(
    "Pifagor teoremasi bilan masalalar yechish",
    'Решение задач по теореме Пифагора',
    'Solving problems with the Pythagorean theorem',
  ),
  audio: [
    A('mount',
      "Qoida uchun kerak bo'lgan hamma narsani siz allaqachon ko'rdingiz. Endi uni yig'ing.",
      'Всё, что нужно для правила, ты уже видел. Теперь собери его.',
      'Everything the rule needs, you have already seen. Now assemble it.'),
    W('card',
      "Qoida ochildi, va xukdagi savolga javob topildi.",
      'Правило открылось, и ответ на вопрос из хука найден.',
      'The rule opened, and the hook question found its answer.'),
  ],
  props: {
    fragments: [
      { id: 'f1', label: L("Pifagor teoremasi amaliyotda burchakning to'g'ri ekanini tekshirish uchun ishlatiladi", 'теорема Пифагора на практике используется для проверки, что угол прямой', 'the Pythagorean theorem is used in practice to check that an angle is right') },
      { id: 'f2', label: L("noma'lum uzunlik x deb belgilanadi, Pifagor tengligi tuzilib, tenglama yechiladi", 'неизвестная длина обозначается x, составляется равенство Пифагора и решается уравнение', 'the unknown length is labelled x, the Pythagorean equality is set up and the equation is solved') },
      { id: 'f3', label: L("teng tomonli uchburchakning balandligi asosning yarmi orqali topiladi", 'высота равностороннего треугольника находится через половину основания', 'the height of an equilateral triangle is found through half the base') },
      { id: 'w1', label: L("teng tomonli uchburchakning balandligi to'liq tomon orqali topiladi", 'высота равностороннего треугольника находится через всю сторону', 'the height of an equilateral triangle is found through the whole side') },
    ],
    answer: ['f1', 'f2', 'f3'],
    wrongHint: L(
      "Bunday yig'ilmadi. Balandlik uchun asosning YARMI ishlatiladi, to'liq tomon emas.",
      'Так не складывается. Для высоты используется ПОЛОВИНА основания, а не вся сторона.',
      'That does not fit. Half the base is used for the height, not the whole side.',
    ),
    card: {
      title: UI.ruleTitle,
      lines: [
        STATEMENTS[0],
        STATEMENTS[1],
        STATEMENTS[2],
      ],
      source: L(
        "Qoida darslik geometriya, 3-§, 32-mavzu asosida (104-106-bet)",
        'Правило на основе геометрии, § 3, тема 32 учебника (стр. 104-106)',
        'The rule is based on geometry, section 3, topic 32 of the textbook (pages 104-106)',
      ),
      locked: UI.lockedLabel,
    },
    recall: {
      left: L(
        "Pifagor teoremasini faqat tayyor uchburchakda ishlata olardik",
        'Мы умели применять теорему Пифагора только в готовом треугольнике',
        'We could apply the Pythagorean theorem only in a ready-made triangle',
      ),
      right: L(
        "endi uni tekshirish vositasi va tenglama tuzish uchun ham ishlata olamiz",
        'теперь мы можем использовать её и как проверку, и для составления уравнения',
        'now we can use it both as a check and to set up an equation',
      ),
      winner: 'right',
      note: L(
        "Bir teorema, uch xil vazifa: tekshirish, tenglama, balandlik",
        'Одна теорема, три разные задачи: проверка, уравнение, высота',
        'One theorem, three different tasks: checking, an equation, a height',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ 1 (`drill`): algebraik tenglama bilan noma'lum tomonni
// topish (5-test, 1- va 3-savol uslubi).
// ============================================================
const ASK_UNK = L("Ikkinchi katet va gipotenuza qancha?", 'Чему равны второй катет и гипотенуза?', 'What are the second leg and the hypotenuse?')

const S9 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З99',
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Tenglama tuzib, noma'lum tomonlarni toping",
    'Составь уравнение и найди неизвестные стороны',
    'Set up an equation and find the unknown sides',
  ),
  audio: [
    A('mount',
      "To'rt topshiriq. Har birida bir katet va farq berilgan.",
      'Четыре задания. В каждом дан один катет и разность.',
      'Four tasks. In each, one leg and a difference are given.'),
    A('why',
      "Farq qaysi ikki tomon orasida ekanini diqqat bilan o'qing.",
      'Внимательно читай, между какими двумя сторонами разность.',
      'Read carefully which two sides the difference is between.'),
  ],
  props: {
    doneNote: L(
      "To'rttasi ham hal bo'ldi. Har safar farq to'g'ri tomonga qo'yilgan.",
      'Все четыре разобраны. Каждый раз разность приписана верной стороне.',
      'All four are done. Each time the difference was attached to the correct side.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'a = 12,  c = x + 6'}</Row>,
        ok: L("Ha. Tenglama yechilsa, x to'qqiz, gipotenuza o'n besh chiqadi.", 'Да. Решив уравнение, x девять, гипотенуза пятнадцать.', 'Yes. Solving the equation, x is nine, the hypotenuse is fifteen.'),
        question: ASK_UNK,
        items: [
          { id: 'a', right: true, label: '9, 15' },
          { id: 'b', label: '15, 21', hint: L("O'n besh gipotenuza, ikkinchi katet emas.", 'Пятнадцать это гипотенуза, а не второй катет.', 'Fifteen is the hypotenuse, not the second leg.') },
        ],
        solution: ['12² + x²', '(x+6)²', '144 = 12x + 36', 'x = 9'],
      },
      {
        expr: <Row size="big" align="center">{'a = 12,  b = c − 8'}</Row>,
        ok: L("Ha. Tenglama yechilsa, gipotenuza o'n uch, ikkinchi katet besh chiqadi.", 'Да. Решив уравнение, гипотенуза тринадцать, второй катет пять.', 'Yes. Solving the equation, the hypotenuse is thirteen, the second leg is five.'),
        question: L("Gipotenuza va ikkinchi katet qancha?", 'Чему равны гипотенуза и второй катет?', 'What are the hypotenuse and the second leg?'),
        items: [
          { id: 'a', right: true, label: '13, 5' },
          { id: 'b', label: '13, 21', hint: L("Ikkinchi katet gipotenuzadan sakkiz kichik, o'n uchdan sakkizni ayiring.", 'Второй катет на восемь меньше гипотенузы, вычти восемь из тринадцати.', 'The second leg is eight less than the hypotenuse, subtract eight from thirteen.') },
        ],
        solution: ['12² + (c−8)²', '= c²', '208 = 16c', 'c = 13'],
      },
      {
        expr: <Row size="big" align="center">{'a = 8,  c = x + 2'}</Row>,
        ok: L("Ha. Tenglama yechilsa, x o'n besh, gipotenuza o'n yetti chiqadi.", 'Да. Решив уравнение, x пятнадцать, гипотенуза семнадцать.', 'Yes. Solving the equation, x is fifteen, the hypotenuse is seventeen.'),
        question: ASK_UNK,
        items: [
          { id: 'a', right: true, label: '15, 17' },
          { id: 'b', label: '17, 19', hint: L("O'n yetti gipotenuza, ikkinchi katet emas.", 'Семнадцать это гипотенуза, а не второй катет.', 'Seventeen is the hypotenuse, not the second leg.') },
        ],
        solution: ['8² + x²', '(x+2)²', '64 = 4x + 4', 'x = 15'],
      },
      {
        expr: <Row size="big" align="center">{'a = 16,  b = c − 8'}</Row>,
        ok: L("Ha. Tenglama yechilsa, gipotenuza yigirma, ikkinchi katet o'n ikki chiqadi.", 'Да. Решив уравнение, гипотенуза двадцать, второй катет двенадцать.', 'Yes. Solving the equation, the hypotenuse is twenty, the second leg is twelve.'),
        question: L("Gipotenuza va ikkinchi katet qancha?", 'Чему равны гипотенуза и второй катет?', 'What are the hypotenuse and the second leg?'),
        items: [
          { id: 'a', right: true, label: '20, 12' },
          { id: 'b', label: '20, 28', hint: L("Ikkinchi katet gipotenuzadan sakkiz kichik, yigirmadan sakkizni ayiring.", 'Второй катет на восемь меньше гипотенузы, вычти восемь из двадцати.', 'The second leg is eight less than the hypotenuse, subtract eight from twenty.') },
        ],
        solution: ['16² + (c−8)²', '= c²', '320 = 16c', 'c = 20'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ 2 (`drill`): romb va trapetsiyaga qo'llash (5-test,
// 5- va 6-savol uslubi).
// ============================================================
const S10 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З99',
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Pifagor teoremasini romb va trapetsiyaga qo'llang",
    'Примени теорему Пифагора к ромбу и трапеции',
    'Apply the Pythagorean theorem to a rhombus and a trapezoid',
  ),
  audio: [
    A('mount',
      "Ikki topshiriq. Ikkalasida ham Pifagor teoremasi boshqa shakl ichida yashiringan.",
      'Два задания. В обоих теорема Пифагора скрыта внутри другой фигуры.',
      'Two tasks. In both, the Pythagorean theorem hides inside another shape.'),
    A('why',
      "Rombda diagonallar yarmi, trapetsiyada esa balandlik va asoslar farqi katet bo'ladi.",
      'В ромбе половины диагоналей, в трапеции высота и разность оснований становятся катетами.',
      'In the rhombus, half the diagonals, in the trapezoid, the height and the base difference become the legs.'),
  ],
  props: {
    doneNote: L(
      "Ikkalasi ham hal bo'ldi. Har safar to'g'ri burchakli uchburchak boshqa shakl ichidan topilgan.",
      'Обе разобраны. Каждый раз прямоугольный треугольник находился внутри другой фигуры.',
      'Both are done. Each time a right triangle was found inside another shape.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'d₁=14, d₂=48'}</Row>,
        ok: L("Ha. Yarim diagonallar yetti va yigirma to'rt, tomoni yigirma besh, perimetri yuz.", 'Да. Половины диагоналей семь и двадцать четыре, сторона двадцать пять, периметр сто.', 'Yes. Half the diagonals are seven and twenty-four, the side is twenty-five, the perimeter is a hundred.'),
        question: L("Rombning perimetri qancha?", 'Чему равен периметр ромба?', 'What is the perimeter of the rhombus?'),
        items: [
          { id: 'a', right: true, label: '100' },
          { id: 'b', label: '62', hint: L("Bu diagonallarning yig'indisi, perimetr emas, avval tomon topiladi.", 'Это сумма диагоналей, а не периметр, сначала находится сторона.', 'That is the sum of the diagonals, not the perimeter, the side is found first.') },
        ],
        solution: ['7² + 24²', '625', '25', '4 · 25', '100'],
      },
      {
        expr: <Row size="big" align="center">{'17, 9,  h=15'}</Row>,
        ok: L("Ha. Asoslar farqi sakkiz, balandlik o'n besh, yon tomon o'n yetti.", 'Да. Разность оснований восемь, высота пятнадцать, боковая сторона семнадцать.', 'Yes. The base difference is eight, the height is fifteen, the side is seventeen.'),
        question: L("Yon tomon qancha?", 'Чему равна боковая сторона?', 'What is the side?'),
        items: [
          { id: 'a', right: true, label: '17' },
          { id: 'b', label: '15', hint: L("O'n besh balandlik, yon tomon emas, katetlar sakkiz va o'n besh.", 'Пятнадцать это высота, а не боковая сторона, катеты восемь и пятнадцать.', 'Fifteen is the height, not the side, the legs are eight and fifteen.') },
        ],
        solution: ['17 − 9', '8', '8² + 15²', '289', '17'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ 3 (`drill`, приборсиз): son bilan tekshirish (З16).
// ============================================================
const S11 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З16',
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Yechimni son bilan tekshiring",
    'Проверь решение числом',
    'Check the solution with a number',
  ),
  audio: [
    A('mount',
      "Uch topshiriq. Har birida taklif qilingan javobni tekshiring.",
      'Три задания. В каждом проверь предложенный ответ.',
      'Three tasks. In each, check the proposed answer.'),
    A('why',
      "Topilgan sonni shartga qaytarib qo'yib, tengligi saqlanishini ko'ring.",
      'Подставь найденное число обратно в условие и проверь, сохраняется ли равенство.',
      'Substitute the found number back into the condition and see if the equality holds.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar javob shartga qaytarib tekshirilgan.",
      'Все три разобраны. Каждый раз ответ проверялся возвращением в условие.',
      'All three are done. Each time the answer was checked by returning to the condition.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'a=12, c=x+6   →   x=9'}</Row>,
        ok: L("Ha. O'n ikkining kvadrati yuz qirq to'rt, to'qqizning kvadrati sakson bir, yig'indisi ikki yuz yigirma besh, o'n beshning kvadrati ham shu.", 'Да. Квадрат двенадцати сто сорок четыре, квадрат девяти восемьдесят один, сумма двести двадцать пять, квадрат пятнадцати тоже такой.', 'Yes. The square of twelve is a hundred forty-four, the square of nine is eighty-one, the sum is two hundred twenty-five, the square of fifteen is the same.'),
        question: L("Bu javob to'g'rimi?", 'Верен ли этот ответ?', 'Is this answer correct?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Hisoblab ko'ring, ikkalasi ham ikki yuz yigirma besh chiqadi.", 'Посчитай, оба выходят двести двадцать пять.', 'Compute it, both come to two hundred twenty-five.') },
        ],
        solution: ['12² + 9²', '225', '15²', '225'],
      },
      {
        expr: <Row size="big" align="center">{'d₁=14, d₂=48   →   26'}</Row>,
        ok: L("Yo'q. Yarim diagonallar yetti va yigirma to'rt, ularning kvadratlari yig'indisi olti yuz yigirma besh, o'n olti emas.", 'Нет. Половины диагоналей семь и двадцать четыре, сумма их квадратов шестьсот двадцать пять, а квадрат двадцати шести шестьсот семьдесят шесть.', 'No. Half the diagonals are seven and twenty-four, the sum of their squares is six hundred twenty-five, while the square of twenty-six is six hundred seventy-six.'),
        question: L("Rombning tomoni yigirma oltiga tengmi?", 'Верна ли сторона ромба, двадцать шесть?', 'Is the rhombus\'s side twenty-six correct?'),
        items: [
          { id: 'a', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("Qaytadan hisoblang, olti yuz yigirma besh, olti yuz yetmish oltiga teng emas.", 'Посчитай снова, шестьсот двадцать пять не равно шестистам семидесяти шести.', 'Compute it again, six hundred twenty-five is not equal to six hundred seventy-six.') },
        ],
        solution: ['7² + 24²', '625', '26²', '676'],
      },
      {
        expr: <Row size="big" align="center">{'17, 9, h=15   →   17'}</Row>,
        ok: L("Ha. Asoslar farqi sakkiz, sakkizning kvadrati va o'n beshning kvadrati yig'indisi ikki yuz sakson to'qqiz, o'n yettining kvadrati ham shu.", 'Да. Разность оснований восемь, сумма квадратов восьми и пятнадцати двести восемьдесят девять, квадрат семнадцати тоже такой.', 'Yes. The base difference is eight, the sum of the squares of eight and fifteen is two hundred eighty-nine, the square of seventeen is the same.'),
        question: L("Trapetsiyaning yon tomoni o'n yettiga tengmi?", 'Верна ли боковая сторона трапеции, семнадцать?', "Is the trapezoid's side seventeen correct?"),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Hisoblab ko'ring, ikkalasi ham ikki yuz sakson to'qqiz chiqadi.", 'Посчитай, оба выходят двести восемьдесят девять.', 'Compute it, both come to two hundred eighty-nine.') },
        ],
        solution: ['8² + 15²', '289', '17²', '289'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. LOVUSHKA (`drill`, ловушка): farq teskari tomonga qo'yilgan
// (З99) va to'liq tomon asosning yarmi o'rniga olingan (З100).
// ============================================================
const S12 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З99',
  eyebrow: UI.trapEyebrow,
  title: L(
    "Ikkita xato javobda nima noto'g'ri",
    'Что неверно в двух ошибочных ответах',
    'What is wrong in two mistaken answers',
  ),
  audio: [
    A('mount',
      "Ikki topshiriq. Ikkalasida ham boshqa-boshqa xato bor.",
      'Два задания. В обоих разные ошибки.',
      'Two tasks. Each has a different mistake.'),
    A('why',
      "Birinchisida farq teskari tomonga qo'yilgan, ikkinchisida asosning yarmi o'rniga to'liq tomon olingan.",
      'В первом разность приписана обратной стороне, во втором вместо половины основания взята вся сторона.',
      'In the first, the difference was attached to the wrong side, in the second, the whole side was taken instead of half the base.'),
  ],
  props: {
    doneNote: L(
      "Ikkalasi ham hal bo'ldi. Har ikki xato ham boshqa-boshqa qoidani chetlab o'tgan.",
      'Обе разобраны. Обе ошибки обошли разные правила.',
      'Both are done. Each mistake bypassed a different rule.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'a=12, c=x+6   →   "12² + (x+6)² = x²"'}</Row>,
        ok: L("Ha. Olti gipotenuzaga qo'shilishi kerak, gipotenuzadan ayirilmaydi, chunki gipotenuza ikkinchi katetdan uzun.", 'Да. Шесть должно прибавляться к гипотенузе, а не вычитаться из неё, потому что гипотенуза длиннее второго катета.', 'Yes. Six should be added to the hypotenuse, not subtracted from it, because the hypotenuse is longer than the second leg.'),
        question: L("Bir katet o'n ikki, gipotenuza ikkinchi katetdan olti birlik uzun bo'lsa, va tenglama yuqoridagicha tuzilgan bo'lsa, bu yerda xato qayerda?", 'Если один катет двенадцать, а гипотенуза на шесть единиц длиннее второго катета, а уравнение составлено как выше, в чём здесь ошибка?', 'If one leg is twelve, and the hypotenuse is six units longer than the other leg, and the equation was set up as above, where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Olti gipotenuzaga qo'shilishi kerak edi, ikkinchi katetdan ayirilmasdi", 'Шесть нужно было прибавить к гипотенузе, а не вычитать из второго катета', 'Six should have been added to the hypotenuse, not subtracted from the second leg') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, gipotenuza x+6, ikkinchi katet esa x bo'lishi kerak.", 'Это и есть показанная ошибка, гипотенуза должна быть x+6, а второй катет x.', 'This is the very mistake shown; the hypotenuse should be x+6, and the second leg x.') },
        ],
        solution: ['12² + x²', '(x+6)²'],
      },
      {
        expr: <Row size="big" align="center">{'a=10   →   AD² = 10² − 10²'}</Row>,
        ok: L("Ha. Ayirilishi kerak bo'lgan son BD ning kvadrati, u besh, o'n emas, chunki BD asosning yarmi.", 'Да. Должен вычитаться квадрат BD, пять, а не десять, потому что BD половина основания.', 'Yes. What should be subtracted is the square of BD, five, not ten, because BD is half the base.'),
        question: L("Tomoni o'n bo'lgan teng tomonli uchburchakning balandligi yuqoridagicha topilgan bo'lsa, bu yerda xato qayerda?", 'Если высота равностороннего треугольника со стороной десять найдена как выше, в чём здесь ошибка?', 'If the height of an equilateral triangle with side ten was found as above, where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Asosning yarmi emas, to'liq tomon ayirilgan", 'Вычтена не половина основания, а вся сторона', 'The whole side was subtracted instead of half the base') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, BD besh bo'lishi kerak, o'n emas.", 'Это и есть показанная ошибка, BD должно быть пять, а не десять.', 'This is the very mistake shown; BD should be five, not ten.') },
        ],
        solution: ['10² − 5²', '75'],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. QADAMLAB YOZISH (`fill`): tenglama yechishni qadamlab.
// ============================================================
const S13 = {
  role: 'transfer',
  tool: 'fill',
  tag: 'З99',
  eyebrow: L('QADAMLAB YOZISH', 'ЗАПИСЬ ПО ШАГАМ', 'WRITING STEP BY STEP'),
  title: L(
    "Bir katet va farqdan ikkinchi katetni qadamlab toping",
    'По одному катету и разности найди второй катет, по шагам',
    'From one leg and a difference, find the second leg, step by step',
  ),
  audio: [
    A('mount',
      "Bir katet va gipotenuza bilan ikkinchi katet orasidagi farq berilgan.",
      'Даны один катет и разность между гипотенузой и вторым катетом.',
      'One leg and the difference between the hypotenuse and the second leg are given.'),
    A('why',
      "x deb belgilab, tenglama tuzilib, yechiladi.",
      'Обозначив через x, составляется и решается уравнение.',
      'Labelling it x, the equation is set up and solved.',
    ),
  ],
  props: {
    repeatLabel: UI.repeatLabel,
    doneNote: L(
      "Uchtasi ham to'ldi. Har safar tenglama tuzilib, x topilgan.",
      'Все три заполнены. Каждый раз составлялось уравнение, находилось x.',
      'All three are filled. Each time the equation was set up, x was found.',
    ),
    showLabel: UI.showLabel,
    againLabel: UI.againLabel,
    selfLabel: UI.selfLabel,
    demo: {
      chips: ['9'],
      lines: [
        [{ t: 'a = 12, c = x + 6   →   x = ' }, { slot: '9' }],
      ],
    },
    tasks: [
      {
        chips: ['15'],
        lines: [
          [{ t: 'a = 8, c = x + 2   →   x = ' }, { slot: '15' }],
        ],
      },
      {
        chips: ['5'],
        lines: [
          [{ t: 'a = 12, b = c − 8, c = 13   →   b = ' }, { slot: '5' }],
        ],
      },
      {
        chips: ['12'],
        lines: [
          [{ t: 'a = 16, b = c − 8, c = 20   →   b = ' }, { slot: '12' }],
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 14. BLITS (to'rt savol va beshinchisi SBORKA).
// ============================================================
const S14 = {
  role: 'blitz',
  tool: 'blitz',
  eyebrow: UI.blitzEyebrow,
  title: L(
    "Masalalar yechish bo'yicha to'rt savol",
    'Четыре вопроса о решении задач',
    'Four questions about solving problems',
  ),
  audio: [
    A('mount',
      "To'rt savol va oxirida yozuvni yig'ish.",
      'Четыре вопроса и в конце сборка записи.',
      'Four questions and an assembly at the end.'),
    A('why',
      "Har javobdan keyin izoh chiqadi.",
      'После каждого ответа выходит разбор.',
      'After each answer an explanation appears.'),
  ],
  props: {
    lead: UI.blitzLead,
    items: [
      {
        id: 'q1', tag: 'З99',
        ask: L('Bir katet 16, gipotenuza ikkinchi katetdan 8 birlik uzun bo\'lsa, gipotenuza qancha?', 'Если один катет шестнадцать, а гипотенуза на восемь единиц длиннее второго катета, чему равна гипотенуза?', 'If one leg is sixteen, and the hypotenuse is eight units longer than the other leg, what is the hypotenuse?'),
        options: [
          { id: 'ok', right: true, label: '20' },
          { id: 'no', label: '24' },
        ],
        hint: L("Yigirma to'rt farqning ikki hissasi, tenglama yechilsa yigirma chiqadi.", 'Двадцать четыре это удвоенная разность, решив уравнение, выходит двадцать.', 'Twenty-four is double the difference, solving the equation gives twenty.'),
        ok: L("To'g'ri, tenglama yechilsa gipotenuza yigirma chiqadi.", 'Верно, решив уравнение, гипотенуза выходит двадцать.', 'Correct, solving the equation, the hypotenuse comes out to twenty.'),
      },
      {
        id: 'q2', tag: 'З100',
        ask: L('Tomoni 6 bo\'lgan teng tomonli uchburchakda balandlik topilayotganda, katet sifatida qaysi son olinadi?', 'При нахождении высоты равностороннего треугольника со стороной шесть, какое число берётся как катет?', 'When finding the height of an equilateral triangle with side six, which number is taken as the leg?'),
        options: [
          { id: 'ok', right: true, label: '3' },
          { id: 'no', label: '6' },
        ],
        hint: L("Balandlik asosni ikkiga bo'ladi, katet sifatida asosning yarmi olinadi.", 'Высота делит основание пополам, катетом берётся половина основания.', 'The height bisects the base, half the base is taken as the leg.'),
        ok: L("To'g'ri, asosning yarmi, ya'ni uch, katet sifatida olinadi.", 'Верно, половина основания, то есть три, берётся катетом.', 'Correct, half the base, that is three, is taken as the leg.'),
      },
      {
        id: 'q3', tag: 'З101',
        ask: L('Ip 5, 5 va 5 birlikka bo\'lingan bo\'lsa, bu bilan to\'g\'ri burchak tekshirib bo\'ladimi?', 'Если верёвка разделена на пять, пять и пять единиц, можно ли этим проверить прямой угол?', "If a rope is divided into five, five, and five units, can this check a right angle?"),
        options: [
          { id: 'ok', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'no', label: L('Ha', 'Да', 'Yes') },
        ],
        hint: L("Teng bo'laklar Pifagor uchligi hosil qilmaydi, faqat uch, to'rt, besh kabi nisbat ishlaydi.", 'Равные части не образуют пифагорову тройку, работает только отношение вроде трёх, четырёх, пяти.', 'Equal parts do not form a Pythagorean triple, only a ratio like three, four, five works.'),
        ok: L("To'g'ri, teng bo'laklar bilan tekshirib bo'lmaydi.", 'Верно, равными частями это не проверить.', 'Correct, equal parts cannot check this.'),
      },
      {
        id: 'q4', tag: 'З16',
        ask: L('7² + 24², 625ga tengmi?', 'Верно ли, что 7² + 24², равно 625?', 'Is it true that 7² + 24² equals 625?'),
        options: [
          { id: 'ok', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
        ],
        hint: L("Hisoblab ko'ring, qirq to'qqiz va besh yuz oltmish olti qo'shiladi.", 'Посчитай, складываются сорок девять и пятьсот семьдесят шесть.', 'Compute it, forty-nine and five hundred seventy-six are added.'),
        ok: L("To'g'ri, hisoblash mos keladi.", 'Верно, вычисление совпадает.', 'Correct, the computation matches.'),
      },
      {
        id: 'q5', tag: 'З99',
        ask: L("Yozuvni yig'ing", 'Собери запись', 'Assemble the record'),
        builtLabel: UI.builtLabel,
        build: {
          lead: L(
            "Bir katet 9, gipotenuza ikkinchi katetdan 3 birlik uzun bo'lgan uchburchakni yig'ing.",
            'Собери треугольник, где один катет девять, а гипотенуза на три единицы длиннее второго катета.',
            'Assemble the triangle where one leg is nine, and the hypotenuse is three units longer than the other leg.',
          ),
          lines: [
            [{ t: '9² + x² = (x+3)²   →   x = ' }, { slot: '12' }],
          ],
          tiles: [
            { id: 't1', v: '12', x: 12, y: 12 },
            { id: 't2', v: '15', x: 60, y: 14 },
            { id: 't3', v: '9', x: 30, y: 50 },
            { id: 't4', v: '6', x: 78, y: 48 },
          ],
          hint: L(
            "To'qqizning kvadrati sakson bir, olti x ga ko'paytirilgan qo'shilib to'qqizga, tenglama yechiladi.",
            'Квадрат девяти восемьдесят один, складывается с шестью на x и девятью, уравнение решается.',
            'The square of nine is eighty-one, added to six times x and nine, the equation is solved.',
          ),
          doneNote: L(
            "Yig'ildi. Ikkinchi katet o'n ikki, gipotenuza esa o'n besh chiqadi.",
            'Собрано. Второй катет двенадцать, а гипотенуза выходит пятнадцать.',
            'Assembled. The second leg is twelve, and the hypotenuse comes out to fifteen.',
          ),
        },
      },
    ],
    scoreLabel: UI.scoreLabel,
    stepLabel: UI.taskLabel,
  },
}

// ============================================================
// EKRAN 15. YAKUN (`takeaway`). BLOK YAKUNI: Pifagor qismi tugadi.
// ============================================================
const S15 = {
  role: 'summary',
  tool: 'takeaway',
  eyebrow: UI.summaryEyebrow,
  title: L(
    "Bir teorema, uch xil vazifa",
    'Одна теорема, три разные задачи',
    'One theorem, three different tasks',
  ),
  audio: [
    A('s0',
      "Darsdan bitta g'oya qoladi. Pifagor teoremasi tekshirish, tenglama va balandlik uchun ham ishlaydi.",
      'С урока остаётся одна идея. Теорема Пифагора работает и для проверки, и для уравнения, и для высоты.',
      'One idea stays with you. The Pythagorean theorem works for checking, for an equation, and for a height.'),
    A('s1',
      "Bugun uch narsa qilindi. Ustunni tik o'rnatishni ko'rdingiz, teng tomonli uchburchakning yuzasini topdingiz va tenglama tuzib noma'lum tomonni aniqladingiz.",
      'Сегодня сделано три вещи. Ты увидел установку столба, нашёл площадь равностороннего треугольника, и определил неизвестную сторону через уравнение.',
      'Three things are done today. You saw the setting up of a post, found the area of an equilateral triangle, and determined an unknown side through an equation.'),
    A('s2',
      "Pifagor qismi shu bilan tugadi. Keyingi darsda aylana, markaziy burchak va yoy o'lchash boshlanadi.",
      'Часть про Пифагора этим завершается. В следующем уроке начинается окружность, центральный угол и измерение дуги.',
      'The Pythagoras part ends here. The next lesson begins the circle, the central angle, and measuring an arc.',
    ),
  ],
  props: {
    mark: L("3, 4, 5 → tik burchak; asosning yarmi → balandlik; x → tenglama", '3, 4, 5 → прямой угол; половина основания → высота; x → уравнение', '3, 4, 5 → a right angle; half the base → a height; x → an equation'),
    markNote: L(
      "bitta teorema, uch xil ish",
      'одна теорема, три разные работы',
      'one theorem, three different jobs',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      "Keyingi dars: aylana va markaziy burchak",
      'Следующий урок: окружность и центральный угол',
      'Next lesson: the circle and the central angle',
    ),
  },
}

// ============================================================
// EKRANLAR. Geometriya uchun to'g'ridan-to'g'ri qurilgan.
// ============================================================
export const SCREENS = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15]

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
