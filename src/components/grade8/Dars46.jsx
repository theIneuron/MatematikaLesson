// ============================================================================
// 8-sinf, Dars 46. TOMONLARIGA KO'RA BALANDLIK, GERON FORMULASI.
//
// BLOK Б7. Bu fayl, FAQAT MA'LUMOT. Mexanika `screens.jsx`, `prooflines.jsx`,
// `tools.jsx`, `feed.jsx`, `method.jsx` da. YANGI PRIBOR YO'Q — `ProofLines`
// (dars 37+) qayta ishlatilgan, YENGIL holatda (pastga qarang).
//
// MANBA: 8-sinf geometriya darsligi, 3-§ (PIFAGOR TEOREMASI):
//   - 30*-mavzu (101-102-bet): tomonlariga ko'ra balandlikni topish,
//     h_c = (2/c)·kvadrat ildiz(p(p-a)(p-b)(p-c)), bunda p yarim perimetr,
//     p = (a+b+c)/2. MAVZU YULDUZCHA BILAN BELGILANGAN va darslikning o'zida
//     ochiq yozilgan (102-bet, eslatma): "O'quvchilar FORMULA BO'YICHA
//     HISOBLASHNI bajara olishlari SHART. Formulani KELTIRIB CHIQARISH
//     iqtidorli o'quvchilarga mo'ljallangan." Shuning uchun bu darsda to'liq
//     algebraik isbot YO'Q (u ikki kichik to'g'ri burchakli uchburchakka
//     Pifagor teoremasini qo'llash va uzun soddalashtirishdan iborat) —
//     faqat g'oyasi aytiladi, formula BERILADI va undan foydalanish
//     mashq qilinadi. Natija (102-bet): katta tomonga mos balandlik KICHIK
//     bo'ladi va aksincha (a<b<c bo'lsa, h_a>h_b>h_c).
//   - 31-mavzu (103-bet): Geron formulasi, S=½a·h_a dan h_a ni qo'yib
//     soddalashtirilsa, S = kvadrat ildiz(p(p-a)(p-b)(p-c)) kelib chiqadi.
//     Iskandariyalik Geron (militodning I asri) nomi bilan yuritiladi,
//     uchala tomon ma'lum bo'lganda ishlatiladi.
//   - Mashqlar (378-391-bet): 13,14,15 (S=84, klassik); 9,12,15 (to'g'ri
//     burchakli, S=54, 41-darsdan tanish); 39,42,45 (S=756); 35,29,8
//     (S=84); 45,39,12 (S=216); 20,20,32 (S=192).
//
// ADASHISHLAR, ikkitasi yangi:
//   З97, yarim perimetr NOTO'G'RI hisoblangan (ikkiga bo'linmagan, to'liq
//   perimetrning o'zi p deb olingan);
//   З98, katta tomonga mos balandlik ham katta bo'ladi deb o'ylangan
//   (aslida aksincha: katta tomonga kichik balandlik mos keladi);
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
  id: 'geo-8-46',
  n: 46,
  row: 51,
  block: 'Б7',
  topic: L("Tomonlariga ko'ra balandlik, Geron formulasi", 'Высота по сторонам, формула Герона', "The height from the sides, Heron's formula"),
  voice: 'm',
  total: 15,
}

export const STATEMENTS = [
  L(
    "Yarim perimetr p uchburchak perimetrining yarmiga teng, p = (a + b + c) : 2",
    'Полупериметр p равен половине периметра треугольника, p = (a + b + c) : 2',
    'The semi-perimeter p equals half the triangle\'s perimeter, p = (a + b + c) : 2',
  ),
  L(
    "Balandlik tomonlar orqali topiladi, va katta tomonga mos balandlik kichik bo'ladi, kichik tomonga esa katta balandlik mos keladi",
    'Высота находится через стороны, и большей стороне соответствует меньшая высота, а меньшей стороне — большая высота',
    'The height is found through the sides, and the longer side corresponds to a smaller height, the shorter side to a larger height',
  ),
  L(
    "Uchburchakning yuzi Geron formulasi bilan topiladi, u faqat uchala tomon ma'lum bo'lganda ishlatiladi",
    'Площадь треугольника находится по формуле Герона, она применяется, когда известны все три стороны',
    'The triangle\'s area is found with Heron\'s formula, it is used when all three sides are known',
  ),
]

export const MISS = {
  'З16': {
    what: L('javob son bilan tekshirilmadi', 'ответ не проверен числом', 'the answer was not checked with a number'),
    wrong: null,
    at: 11,
  },
  'З97': {
    what: L(
      "yarim perimetr noto'g'ri hisoblangan, to'liq perimetrning o'zi p deb olingan, ikkiga bo'linmagan",
      'полупериметр посчитан неверно, за p взят весь периметр, без деления на два',
      'the semi-perimeter was computed wrong, the whole perimeter was taken as p, without dividing by two',
    ),
    wrong: null,
    at: 12,
  },
  'З98': {
    what: L(
      "katta tomonga mos balandlik ham katta bo'ladi deb o'ylangan, aslida aksincha",
      'считалось, что большей стороне соответствует и большая высота, а на самом деле наоборот',
      'it was assumed the longer side has the larger height too, but it is actually the opposite',
    ),
    wrong: null,
    at: 12,
  },
}

// ============================================================
// CHERTYOZH KOORDINATALARI (6-ekran, ProofLines). Geron formulasining
// yengil isboti (soddalashtirish ko'rsatilmaydi, faqat almashtirish).
// ============================================================
const TRI46 = { A: [15, 85], B: [95, 85], C: [55, 20] }
const TRI46_ORDER = ['A', 'B', 'C']

// ============================================================
// SAHNALAR (§6). Xuk: faqat tomonlardan balandlikni topish mumkinmi.
// ============================================================
const SC_ASK = L('FAQAT TOMONLARDAN BALANDLIK', 'ВЫСОТА ТОЛЬКО ПО СТОРОНАМ', 'HEIGHT FROM SIDES ALONE')

const HookScene = () => {
  return (
    <SceneBand kind="hook" label={SC_ASK}>
      <polygon points="130,90 220,90 175,35" fill="none" stroke={T.ink3} strokeWidth="1.6"/>
      <line x1="175" y1="35" x2="175" y2="90" stroke={T.ink4} strokeWidth="1.2" strokeDasharray="3,2"/>
      <g className="g8-seat" style={{ '--d': '2200ms' }}>
        <circle cx="175" cy="65" r="14" fill={T.graphSoft}
          stroke={'rgba(' + T.graphRgb + ',.45)'} strokeWidth="1.4"/>
        <text x="175" y="70" textAnchor="middle" fontFamily={MATH_FONT} fontSize="14"
          fontWeight="700" fill={T.graph}>?</text>
      </g>
    </SceneBand>
  )
}

const FinalScene = () => {
  return (
    <SceneBand kind="final" label={L(
      "Uchala tomon ma'lum bo'lsa, balandlik va yuza ham topiladi",
      'Если известны все три стороны, находятся и высота, и площадь',
      'If all three sides are known, both the height and the area can be found',
    )}>
      <text x="185" y="55" textAnchor="middle" fontFamily={MATH_FONT} fontSize="12"
        fontWeight="700" fill={T.ok}>{'p = (a+b+c) : 2'}</text>
      <text x="185" y="80" textAnchor="middle" fontFamily={MATH_FONT} fontSize="12"
        fontWeight="700" fill={T.ok}>{'S = √(p(p-a)(p-b)(p-c))'}</text>
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
  eyebrow: L('FAQAT TOMONLARDAN', 'ТОЛЬКО ПО СТОРОНАМ', 'FROM SIDES ALONE'),
  title: L(
    "Uchburchakning faqat uchta tomoni ma'lum, burchak va balandlik yo'q. Balandlikni topib bo'ladi deb o'ylaysizmi",
    'У треугольника известны только три стороны, углов и высоты нет. Думаешь, высоту можно найти',
    'A triangle\'s only known data are its three sides, no angles, no height. Do you think the height can still be found',
  ),
  lead: UI.hookLead,
  audio: [
    A('mount',
      "Uchburchakning uchta tomoni raqamda berilgan, boshqa hech narsa yo'q.",
      'Три стороны треугольника даны числами, больше ничего нет.',
      'The triangle\'s three sides are given as numbers, nothing else.'),
    A('why',
      "Taxmin qiling, shu uchtagina sondan balandlikni topib bo'ladimi.",
      'Предположи, можно ли найти высоту только по этим трём числам.',
      'Predict whether the height can be found from just these three numbers.'),
  ],
  props: {
    predict: true,
    ask: L(
      "Sizningcha, faqat uchta tomondan balandlikni topib bo'ladimi?",
      'Как думаешь, можно ли найти высоту только по трём сторонам?',
      'What do you think, can the height be found from just three sides?',
    ),
    items: [
      { id: 'a', show: L('Ha, formula bor', 'Да, есть формула', 'Yes, there is a formula') },
      { id: 'b', show: L("Yo'q, burchak kerak", 'Нет, нужен угол', 'No, an angle is needed') },
      { id: 'c', show: L("Faqat chizib o'lchash bilan", 'Только измерив на чертеже', 'Only by measuring on a drawing') },
      { id: 'd', show: L("Faqat teng tomonli uchburchakda", 'Только в равностороннем треугольнике', 'Only in an equilateral triangle') },
    ],
    after: UI.hookAfter,
  },
}

// ============================================================
// EKRAN 2. TAYANCH. Perimetrni eslash.
// ============================================================
const S2 = {
  role: 'support',
  tool: 'pick',
  eyebrow: UI.supportEyebrow,
  title: L(
    "Perimetrni eslash",
    'Вспоминаем периметр',
    'Recalling the perimeter',
  ),
  audio: [
    A('mount',
      "Perimetr allaqachon ma'lum, u barcha tomonlarning yig'indisi.",
      'Периметр уже известен, это сумма всех сторон.',
      'The perimeter is already known, it is the sum of all the sides.'),
    A('why',
      "Bugungi ikkala formula ham perimetrning YARMIGA tayanadi.",
      'Обе сегодняшние формулы опираются на ПОЛОВИНУ периметра.',
      'Both of today\'s formulas rely on HALF the perimeter.'),
  ],
  props: {
    ask: L(
      "Tomonlari 13, 14 va 15 bo'lgan uchburchakning perimetri qancha?",
      'Чему равен периметр треугольника со сторонами 13, 14 и 15?',
      'What is the perimeter of a triangle with sides 13, 14, and 15?',
    ),
    items: [
      { id: 'right', show: '42', right: true, name: L("uch tomon qo'shiladi", 'три стороны складываются', 'the three sides are added') },
      {
        id: 'wrong1', show: '182',
        hint: L("Tomonlar ko'paytirilmaydi, qo'shiladi.", 'Стороны не перемножаются, а складываются.', 'The sides are not multiplied, they are added.'),
      },
      {
        id: 'wrong2', show: '21',
        hint: L("Bu perimetrning yarmi, hali perimetrning o'zi so'ralgan.", 'Это половина периметра, а спрашивается сам периметр.', 'That is half the perimeter, but the perimeter itself was asked.'),
      },
    ],
    after: L(
      "To'g'ri, qirq ikki. Bugun bu songa ehtiyoj bor, faqat uning yarmi.",
      'Верно, сорок два. Сегодня это число понадобится, только его половина.',
      'Correct, forty-two. Today this number is needed, just its half.',
    ),
  },
}

// ============================================================
// EKRAN 3. YARIM PERIMETR (`pick`). Ловушка, ikkiga bo'linmagan (З97).
// ============================================================
const S3 = {
  role: 'explain',
  tool: 'pick',
  tag: 'З97',
  eyebrow: L('YARIM PERIMETR', 'ПОЛУПЕРИМЕТР', 'THE SEMI-PERIMETER'),
  title: L(
    "Yarim perimetr p ni toping",
    'Найди полупериметр p',
    'Find the semi-perimeter p',
  ),
  audio: [
    A('mount',
      "Tomonlari 13, 14 va 15. Perimetr qirq ikki edi.",
      'Стороны 13, 14 и 15. Периметр был сорок два.',
      'The sides are 13, 14, and 15. The perimeter was forty-two.'),
    A('why',
      "Yarim perimetr, aynan shu so'zning o'zi, perimetrni ikkiga bo'lish.",
      'Полупериметр, само это слово говорит, деление периметра на два.',
      'The semi-perimeter, the word itself says it, dividing the perimeter by two.'),
  ],
  props: {
    ask: L(
      "Perimetri qirq ikki bo'lgan uchburchakning yarim perimetri p qancha?",
      'Чему равен полупериметр p треугольника с периметром сорок два?',
      'What is the semi-perimeter p of a triangle with perimeter forty-two?',
    ),
    items: [
      { id: 'right', show: '21', right: true, name: L("qirq ikki ikkiga bo'lingan", 'сорок два разделено на два', 'forty-two divided by two') },
      {
        id: 'wrong', show: '42',
        hint: L("Bu perimetrning o'zi, ikkiga bo'linmagan. Yarim perimetr uni ikkiga bo'lishdan chiqadi.", 'Это сам периметр, без деления на два. Полупериметр получается делением на два.', 'That is the perimeter itself, not divided by two. The semi-perimeter comes from dividing by two.'),
      },
    ],
    after: L(
      "To'g'ri, yigirma bir. Endi bugungi ikkala formula ham shu p bilan yoziladi.",
      'Верно, двадцать один. Теперь обе сегодняшние формулы записываются через это p.',
      'Correct, twenty-one. Now both of today\'s formulas are written through this p.',
    ),
  },
}

// ============================================================
// EKRAN 4. BALANDLIK FORMULASI (`parts`). Isbot YENGIL: g'oya aytiladi,
// to'liq algebra darslikda "iqtidorli o'quvchilarga" deb ochiq yozilgan.
// Ловушка, p ikkiga bo'linmagan (З97).
// ============================================================
const S4 = {
  role: 'explain',
  tool: 'parts',
  tag: 'З97',
  eyebrow: L('BALANDLIK FORMULASI QAYERDAN KELADI', 'ОТКУДА БЕРЁТСЯ ФОРМУЛА ВЫСОТЫ', 'WHERE THE HEIGHT FORMULA COMES FROM'),
  title: L(
    "Balandlik formulasining qismlari",
    'Части формулы высоты',
    'The parts of the height formula',
  ),
  audio: [
    A('mount',
      "Balandlik ikki kichik to'g'ri burchakli uchburchakka Pifagor teoremasini qo'llashdan kelib chiqadi.",
      'Высота получается применением теоремы Пифагора к двум маленьким прямоугольным треугольникам.',
      'The height comes from applying the Pythagorean theorem to the two small right triangles.'),
    W('p2',
      "To'liq soddalashtirish uzun, darslikda u qiziquvchi o'quvchilar uchun qoldirilgan, sizga esa formulaning o'zi kerak.",
      'Полное упрощение длинное, в учебнике оно оставлено для интересующихся учеников, а вам нужна сама формула.',
      'The full simplification is long, the textbook leaves it for interested students, you need the formula itself.'),
    W('p4',
      "p, p minus a, p minus b va p minus c, to'rttasi ko'paytirilib, ildiz ostiga qo'yiladi.",
      'p, p минус a, p минус b и p минус c, все четыре перемножаются и ставятся под корень.',
      'p, p minus a, p minus b, and p minus c, all four are multiplied and placed under the root.',
    ),
  ],
  props: {
    tokens: [
      { t: 'h_c', id: 'mid' },
      { t: '  =  (2 : c) · ', id: 'a' },
      { t: '√(p(p−a)(p−b)(p−c))', id: 'b' },
    ],
    steps: [
      {
        focus: 'mid',
        text: L(
          "Chap tomonda topilayotgan balandlik, tanlangan tomonga mos.",
          'Слева искомая высота, соответствующая выбранной стороне.',
          'On the left, the sought height, matching the chosen side.',
        ),
      },
      {
        focus: 'a',
        text: L(
          "Ikkiga bo'lingan tanlangan tomon, maxraj sifatida turadi.",
          'Выбранная сторона, поделенная на два, стоит в знаменателе.',
          'The chosen side, divided into two, stands as the denominator.',
        ),
      },
      {
        focus: 'b',
        text: L(
          "Ildiz ostida to'rt qavat, birinchisi yarim perimetr p, qolgan uchtasi p dan har bir tomonni ayirib topiladi.",
          'Под корнем четыре множителя, первый полупериметр p, остальные три получаются вычитанием каждой стороны из p.',
          'Under the root, four factors, the first is the semi-perimeter p, the other three come from subtracting each side from p.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "Darslikning o'zida bu formulaning to'liq keltirib chiqarilishi yulduzcha bilan belgilangan, chunki u faqat qiziquvchi o'quvchilar uchun, hammaga esa formula bo'yicha hisoblay olish shart qilingan.",
        'В самом учебнике полный вывод этой формулы отмечен звёздочкой, потому что он только для интересующихся, а всем остальным обязательно умение считать по формуле.',
        'In the textbook itself, the full derivation of this formula is marked with an asterisk, meant only for interested students, while everyone else is required to compute using the formula.',
      ),
    },
  },
}

// ============================================================
// EKRAN 5. KATTA TOMON, KICHIK BALANDLIK (`twoways`). Ловушка, aksincha
// o'ylash (З98).
// ============================================================
const S5 = {
  role: 'explain',
  tool: 'twoways',
  tag: 'З98',
  eyebrow: L('KATTA TOMON, KICHIK BALANDLIK', 'БОЛЬШАЯ СТОРОНА, МЕНЬШАЯ ВЫСОТА', 'BIGGER SIDE, SMALLER HEIGHT'),
  title: L(
    "Bir uchburchakda ikki xil balandlikni solishtirish",
    'Сравнение двух высот в одном треугольнике',
    'Comparing two heights in one triangle',
  ),
  audio: [
    A('mount',
      "To'g'ri burchakli uchburchak, katetlari to'qqiz va o'n ikki, gipotenuzasi o'n besh.",
      'Прямоугольный треугольник, катеты девять и двенадцать, гипотенуза пятнадцать.',
      'A right triangle, legs nine and twelve, hypotenuse fifteen.'),
    W('w2',
      "To'g'ri burchakli uchburchakda har bir katet ikkinchisiga balandlik bo'ladi.",
      'В прямоугольном треугольнике каждый катет служит высотой к другому.',
      'In a right triangle, each leg serves as the height to the other.'),
    W('w4',
      "Eng kichik tomon to'qqizga eng katta balandlik mos keladi, eng katta tomon o'n beshga esa eng kichik balandlik.",
      'Наименьшей стороне девять соответствует наибольшая высота, а наибольшей стороне пятнадцать соответствует наименьшая высота.',
      'The smallest side, nine, gets the largest height, and the largest side, fifteen, gets the smallest height.',
    ),
  ],
  props: {
    stepMs: 1500,
    blocks: [
      {
        name: L('ASOS TO\'QQIZ', 'ОСНОВАНИЕ ДЕВЯТЬ', 'BASE NINE'),
        lead: L(
          "Asos sifatida eng kichik tomonni olamiz",
          'Берём наименьшую сторону как основание',
          'We take the smallest side as the base',
        ),
        rows: [
          { text: 'h₉ = 12' },
          { text: L("eng katta balandlik", 'наибольшая высота', 'the largest height'), tone: 'ok' },
        ],
      },
      {
        name: L('ASOS O\'N BESH', 'ОСНОВАНИЕ ПЯТНАДЦАТЬ', 'BASE FIFTEEN'),
        lead: L(
          "Endi asos sifatida eng katta tomonni olamiz",
          'Теперь берём наибольшую сторону как основание',
          'Now we take the largest side as the base',
        ),
        rows: [
          { text: 'h₁₅ = 7,2' },
          { text: L("eng kichik balandlik", 'наименьшая высота', 'the smallest height'), tone: 'ok' },
        ],
      },
      {
        tone: 'sum',
        name: L('TARTIB AKSINCHA', 'ПОРЯДОК ОБРАТНЫЙ', 'THE ORDER IS REVERSED'),
        lead: L(
          "Tomon o'sganda, mos balandlik kamayadi",
          'При увеличении стороны соответствующая высота уменьшается',
          'As the side grows, the matching height shrinks',
        ),
        rows: [{ text: L("9 < 12 < 15, ammo 12 > 9 > 7,2", '9 < 12 < 15, но 12 > 9 > 7,2', '9 < 12 < 15, but 12 > 9 > 7.2'), tone: 'ok' }],
      },
    ],
  },
}

// ============================================================
// EKRAN 6. GERON FORMULASI (`prooflines`). Isbot YENGIL, almashtirish
// g'oyasi, to'liq algebra darslikda ham yozilmagan.
// ============================================================
const S6 = {
  role: 'explain',
  tool: 'prooflines',
  tag: 'З97',
  eyebrow: L('GERON FORMULASINI OLAMIZ', 'ПОЛУЧАЕМ ФОРМУЛУ ГЕРОНА', 'GETTING HERON\'S FORMULA'),
  title: L(
    "Balandlik formulasidan Geron formulasi kelib chiqadi",
    'Из формулы высоты получается формула Герона',
    'Heron\'s formula comes from the height formula',
  ),
  audio: [
    A('mount',
      "Yuza asos ko'paytirilgan balandlikning yarmiga teng.",
      'Площадь равна половине основания на высоту.',
      'The area equals half the base times the height.'),
    A('why',
      "h_c o'rniga oldingi formulani qo'yib, soddalashtirsak, c qisqaradi va Geron formulasi qoladi.",
      'Подставив на место h_c прошлую формулу и упростив, c сокращается, и остаётся формула Герона.',
      'Substituting the previous formula for h_c and simplifying, c cancels, leaving Heron\'s formula.'),
  ],
  props: {
    points: TRI46,
    order: TRI46_ORDER,
    marks: [],
    given: [
      L("ABC uchburchak, S = ½ · c · h_c", 'Треугольник ABC, S = ½ · c · h_c', 'Triangle ABC, S = ½ · c · h_c'),
      L("h_c = (2 : c) · kvadrat ildiz(p(p−a)(p−b)(p−c))", 'h_c = (2 : c) · корень из p(p−a)(p−b)(p−c)', 'h_c = (2 : c) · root of p(p−a)(p−b)(p−c)'),
    ],
    goal: L("S = kvadrat ildiz(p(p−a)(p−b)(p−c))", 'S = корень из p(p−a)(p−b)(p−c)', 'S = root of p(p−a)(p−b)(p−c)'),
    lines: [
      {
        text: L("h_c o'rniga uning formulasi qo'yiladi", 'на место h_c ставится его формула', 'the formula for h_c is put in its place'),
        options: [
          { id: 'ok', right: true, label: L("Bu shunchaki almashtirish, h_c allaqachon topilgan formula", 'Это просто подстановка, h_c уже известная формула', 'This is just substitution, h_c is an already known formula') },
          { id: 'no', label: L("Bu yangi taxmin", 'Это новое предположение', 'This is a new assumption'), hint: L("Hech narsa taxmin qilinmadi, h_c oldingi ekranda isbotlangan formula edi.", 'Ничего не предполагается, h_c это формула, доказанная на предыдущем экране.', 'Nothing is assumed, h_c is the formula proven on the previous screen.') },
        ],
      },
      {
        text: L("½ · c · (2 : c) qisqaradi, faqat 1 qoladi", '½ · c · (2 : c) сокращается, остаётся 1', '½ · c · (2 : c) cancels, only 1 remains'),
        options: [
          { id: 'ok', right: true, label: L("c bo'linuvchi va ko'paytuvchi sifatida bir-birini yo'q qiladi", 'c как делитель и множитель взаимно уничтожаются', 'c as a divisor and a factor cancel each other out') },
          { id: 'no', label: L("c ham qolib ketadi", 'c тоже остаётся', 'c stays too'), hint: L("Yarimni c ga, keyin c ga bo'lingan ikkiga ko'paytirsangiz, c lar qisqaradi.", 'Если умножить половину на c, потом на два, поделённое на c, c сократятся.', 'Multiplying a half by c, then by two divided by c, the c\'s cancel.') },
        ],
      },
      {
        text: L("shuning uchun S = kvadrat ildiz(p(p−a)(p−b)(p−c)) qoladi, tomonlarning o'zidan", 'поэтому остаётся S = корень из p(p−a)(p−b)(p−c), прямо из сторон', 'so S = root of p(p−a)(p−b)(p−c) remains, straight from the sides'),
        options: [
          { id: 'ok', right: true, label: L("c qisqargandan keyin faqat ildiz ostidagi ifoda qoladi", 'После сокращения c остаётся только выражение под корнем', 'After c cancels, only the expression under the root remains') },
          { id: 'no', label: L("Chunki S doim shunday hisoblanadi", 'Потому что S всегда так считается', 'Because S is always computed this way'), hint: L("Bu yangi natija, faqat h_c o'rniga qo'yish va qisqartirishdan chiqdi.", 'Это новый результат, полученный именно подстановкой и сокращением.', 'This is a new result, obtained precisely by substitution and cancelling.') },
        ],
      },
    ],
    after: L(
      "Kelib chiqdi. Uchala tomon ma'lum bo'lsa, yuzani balandliksiz ham topish mumkin, bu Geron formulasi.",
      'Получено. Если известны все три стороны, площадь можно найти и без высоты, это формула Герона.',
      'Derived. If all three sides are known, the area can be found without the height too, this is Heron\'s formula.',
    ),
  },
}

// ============================================================
// EKRAN 7. GERON FORMULASINING QISMLARI (`parts`).
// ============================================================
const S7 = {
  role: 'explain',
  tool: 'parts',
  tag: 'З97',
  eyebrow: L('GERON FORMULASINING QISMLARI', 'ЧАСТИ ФОРМУЛЫ ГЕРОНА', 'THE PARTS OF HERON\'S FORMULA'),
  title: L(
    "Geron formulasining qismlari",
    'Части формулы Герона',
    'The parts of Heron\'s formula',
  ),
  audio: [
    A('mount',
      "To'rt qavatning har biri o'z o'rnida turadi.",
      'Каждый из четырёх множителей стоит на своём месте.',
      'Each of the four factors stands in its own place.'),
    W('p2',
      "Birinchi qavat, yarim perimetrning o'zi, ikkiga bo'lingan.",
      'Первый множитель, сам полупериметр, уже поделённый на два.',
      'The first factor, the semi-perimeter itself, already halved.'),
    W('p4',
      "Qolgan uchtasi, p dan har bir tomon ayrim-ayrim ayriladi, tomonlarning o'zi emas.",
      'Остальные три, из p по отдельности вычитается каждая сторона, а не сами стороны.',
      'The other three, from p each side is subtracted separately, not the sides themselves.',
    ),
  ],
  props: {
    tokens: [
      { t: 'S² = ', id: 'mid' },
      { t: 'p', id: 'a' },
      { t: '(p−a)(p−b)(p−c)', id: 'b' },
    ],
    steps: [
      {
        focus: 'mid',
        text: L(
          "S² deb yozilgan, chunki ildiz ostidagi ifoda aynan yuzaning kvadrati.",
          'Записано S², потому что выражение под корнем — это именно квадрат площади.',
          'It is written as S², because the expression under the root is exactly the square of the area.',
        ),
      },
      {
        focus: 'a',
        text: L(
          "p, yarim perimetr, allaqachon ikkiga bo'lingan.",
          'p, полупериметр, уже поделён на два.',
          'p, the semi-perimeter, already divided by two.',
        ),
      },
      {
        focus: 'b',
        text: L(
          "p minus a, p minus b, p minus c, har biri o'z tomonini ayirib beradi, tartib ahamiyatsiz.",
          'p минус a, p минус b, p минус c, каждый вычитает свою сторону, порядок не важен.',
          'p minus a, p minus b, p minus c, each subtracts its own side, the order does not matter.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "Geron miloddan avvalgi birinchi asrda Iskandariyada yashagan, va bu formula undan tashqari, uchburchakning uchala tomoni ma'lum bo'lgan har qanday amaliy o'lchov ishida ham qo'llaniladi.",
        'Герон жил в Александрии в первом веке, и эта формула применяется в любой практической задаче измерения, где известны все три стороны треугольника.',
        'Heron lived in Alexandria in the first century, and this formula applies in any practical measurement task where all three sides of a triangle are known.',
      ),
    },
  },
}

// ============================================================
// EKRAN 8. QOIDA (`rulebuild`). Darslik 30*-31-mavzu.
// ============================================================
const S8 = {
  role: 'rule',
  tool: 'rulebuild',
  tag: 'З98',
  eyebrow: UI.ruleEyebrow,
  title: L(
    "Tomonlariga ko'ra balandlik va Geron formulasi",
    'Высота по сторонам и формула Герона',
    'The height from the sides and Heron\'s formula',
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
      { id: 'f1', label: L("yarim perimetr p perimetrning yarmiga teng", 'полупериметр p равен половине периметра', 'the semi-perimeter p equals half the perimeter') },
      { id: 'f2', label: L("balandlik tomonlar orqali topiladi, katta tomonga kichik balandlik mos keladi", 'высота находится через стороны, большей стороне соответствует меньшая высота', 'the height is found through the sides, the longer side corresponds to a smaller height') },
      { id: 'f3', label: L("yuza Geron formulasi bilan, faqat uchala tomondan topiladi", 'площадь по формуле Герона находится только по трём сторонам', 'the area by Heron\'s formula is found from just the three sides') },
      { id: 'w1', label: L("yarim perimetr uchburchakning butun perimetriga teng", 'полупериметр равен всему периметру треугольника', 'the semi-perimeter equals the triangle\'s whole perimeter') },
    ],
    answer: ['f1', 'f2', 'f3'],
    wrongHint: L(
      "Bunday yig'ilmadi. Yarim perimetr perimetrning YARMI, uning o'zi emas.",
      'Так не складывается. Полупериметр это ПОЛОВИНА периметра, а не он сам.',
      'That does not fit. The semi-perimeter is HALF the perimeter, not the perimeter itself.',
    ),
    card: {
      title: UI.ruleTitle,
      lines: [
        STATEMENTS[0],
        STATEMENTS[1],
        STATEMENTS[2],
      ],
      source: L(
        "Qoida darslik geometriya, 3-§, 30-31-mavzu asosida (101-103-bet)",
        'Правило на основе геометрии, § 3, темы 30-31 учебника (стр. 101-103)',
        'The rule is based on geometry, section 3, topics 30-31 of the textbook (pages 101-103)',
      ),
      locked: UI.lockedLabel,
    },
    recall: {
      left: L(
        "Balandlikni topish uchun burchak yoki chizmaga muhtoj edik",
        'Для нахождения высоты нам нужен был угол или чертёж',
        'To find the height we needed an angle or a drawing',
      ),
      right: L(
        "endi faqat uchta tomondan ham balandlik va yuzani topa olamiz",
        'теперь мы можем найти высоту и площадь только по трём сторонам',
        'now we can find the height and the area from just three sides',
      ),
      winner: 'right',
      note: L(
        "Yarim perimetr va Geron formulasi, ikkalasi ham faqat tomonlardan",
        'Полупериметр и формула Герона, оба только по сторонам',
        'The semi-perimeter and Heron\'s formula, both from the sides alone',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ 1 (`drill`): yarim perimetrni toping.
// ============================================================
const ASK_P = L("Yarim perimetr p qancha?", 'Чему равен полупериметр p?', 'What is the semi-perimeter p?')

const S9 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З97',
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Tomonlardan yarim perimetrni hisoblang",
    'Вычисли полупериметр по сторонам',
    'Compute the semi-perimeter from the sides',
  ),
  audio: [
    A('mount',
      "Besh topshiriq. Har birida uchta tomon berilgan.",
      'Пять заданий. В каждом даны три стороны.',
      'Five tasks. In each, three sides are given.'),
    A('why',
      "Avval tomonlar qo'shiladi, keyin ikkiga bo'linadi.",
      'Сначала складываются стороны, потом делятся на два.',
      'First the sides are added, then divided by two.'),
  ],
  props: {
    doneNote: L(
      "Beshtasi ham hal bo'ldi. Har safar yig'indi ikkiga bo'lingan.",
      'Все пять разобраны. Каждый раз сумма делилась на два.',
      'All five are done. Each time the sum was divided by two.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'13, 14, 15'}</Row>,
        ok: L("Ha. O'n uch, o'n to'rt va o'n besh qo'shilsa, qirq ikki, ikkiga bo'linsa, yigirma bir.", 'Да. Тринадцать, четырнадцать и пятнадцать в сумме сорок два, разделить на два, двадцать один.', 'Yes. Thirteen, fourteen, and fifteen add to forty-two, divided by two, twenty-one.'),
        question: ASK_P,
        items: [
          { id: 'a', right: true, label: '21' },
          { id: 'b', label: '42', hint: L("Bu perimetrning o'zi, ikkiga bo'linmagan.", 'Это сам периметр, без деления на два.', 'That is the perimeter itself, not halved.') },
        ],
        solution: ['13 + 14 + 15', '42', '42 : 2', '21'],
      },
      {
        expr: <Row size="big" align="center">{'9, 12, 15'}</Row>,
        ok: L("Ha. To'qqiz, o'n ikki va o'n besh qo'shilsa, o'ttiz olti, ikkiga bo'linsa, o'n sakkiz.", 'Да. Девять, двенадцать и пятнадцать в сумме тридцать шесть, разделить на два, восемнадцать.', 'Yes. Nine, twelve, and fifteen add to thirty-six, divided by two, eighteen.'),
        question: ASK_P,
        items: [
          { id: 'a', right: true, label: '18' },
          { id: 'b', label: '36', hint: L("Bu perimetrning o'zi, ikkiga bo'linmagan.", 'Это сам периметр, без деления на два.', 'That is the perimeter itself, not halved.') },
        ],
        solution: ['9 + 12 + 15', '36', '36 : 2', '18'],
      },
      {
        expr: <Row size="big" align="center">{'39, 42, 45'}</Row>,
        ok: L("Ha. Uch son qo'shilsa, yuz yigirma olti, ikkiga bo'linsa, oltmish uch.", 'Да. Три числа в сумме сто двадцать шесть, разделить на два, шестьдесят три.', 'Yes. The three numbers add to a hundred twenty-six, divided by two, sixty-three.'),
        question: ASK_P,
        items: [
          { id: 'a', right: true, label: '63' },
          { id: 'b', label: '126', hint: L("Bu perimetrning o'zi, ikkiga bo'linmagan.", 'Это сам периметр, без деления на два.', 'That is the perimeter itself, not halved.') },
        ],
        solution: ['39 + 42 + 45', '126', '126 : 2', '63'],
      },
      {
        expr: <Row size="big" align="center">{'35, 29, 8'}</Row>,
        ok: L("Ha. Uch son qo'shilsa, yetmish ikki, ikkiga bo'linsa, o'ttiz olti.", 'Да. Три числа в сумме семьдесят два, разделить на два, тридцать шесть.', 'Yes. The three numbers add to seventy-two, divided by two, thirty-six.'),
        question: ASK_P,
        items: [
          { id: 'a', right: true, label: '36' },
          { id: 'b', label: '72', hint: L("Bu perimetrning o'zi, ikkiga bo'linmagan.", 'Это сам периметр, без деления на два.', 'That is the perimeter itself, not halved.') },
        ],
        solution: ['35 + 29 + 8', '72', '72 : 2', '36'],
      },
      {
        expr: <Row size="big" align="center">{'45, 39, 12'}</Row>,
        ok: L("Ha. Uch son qo'shilsa, to'qson olti, ikkiga bo'linsa, qirq sakkiz.", 'Да. Три числа в сумме девяносто шесть, разделить на два, сорок восемь.', 'Yes. The three numbers add to ninety-six, divided by two, forty-eight.'),
        question: ASK_P,
        items: [
          { id: 'a', right: true, label: '48' },
          { id: 'b', label: '96', hint: L("Bu perimetrning o'zi, ikkiga bo'linmagan.", 'Это сам периметр, без деления на два.', 'That is the perimeter itself, not halved.') },
        ],
        solution: ['45 + 39 + 12', '96', '96 : 2', '48'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ 2 (`drill`): Geron formulasi bilan yuzani toping.
// ============================================================
const ASK_S = L("Geron formulasi bilan yuza qancha?", 'Чему равна площадь по формуле Герона?', 'What is the area by Heron\'s formula?')

const S10 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З97',
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Uchala tomondan Geron formulasi bilan yuzani hisoblang",
    'Вычисли площадь по формуле Герона по трём сторонам',
    'Compute the area with Heron\'s formula from the three sides',
  ),
  audio: [
    A('mount',
      "Uch topshiriq. Har birida uchta tomon berilgan.",
      'Три задания. В каждом даны три стороны.',
      'Three tasks. In each, three sides are given.'),
    A('why',
      "Avval p topiladi, keyin p, p minus a, p minus b, p minus c ko'paytirilib, ildiz olinadi.",
      'Сначала находится p, потом перемножаются p, p минус a, p минус b, p минус c, и извлекается корень.',
      'First p is found, then p, p minus a, p minus b, p minus c are multiplied, and the root is taken.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar avval p topilgan, keyin to'rt qavat ko'paytirilgan.",
      'Все три разобраны. Каждый раз сначала находилось p, потом перемножались четыре множителя.',
      'All three are done. Each time p was found first, then the four factors were multiplied.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'13, 14, 15,  p = 21'}</Row>,
        ok: L("Ha. Yigirma bir, olti, yetti va oltini ko'paytirsak, yetti yuz oltmish oltiga, ildizi sakson to'rt.", 'Да. Перемножив двадцать один, шесть, семь и шесть, семьсот пятьдесят шесть, корень восемьдесят четыре.', 'Yes. Multiplying twenty-one, six, seven, and six gives seven hundred fifty-six, the root is eighty-four.'),
        question: ASK_S,
        items: [
          { id: 'a', right: true, label: '84' },
          { id: 'b', label: '21', hint: L("Bu yarim perimetrning o'zi, yuza emas.", 'Это сам полупериметр, а не площадь.', 'That is the semi-perimeter itself, not the area.') },
        ],
        solution: ['21 · 6 · 7 · 6', '756', '84'],
      },
      {
        expr: <Row size="big" align="center">{'20, 20, 32,  p = 36'}</Row>,
        ok: L("Ha. O'ttiz olti, o'n olti, o'n olti va to'rtni ko'paytirsak, o'ttiz olti ming olti yuz oltmish to'rtga, ildizi yuz to'qson ikki.", 'Да. Перемножив тридцать шесть, шестнадцать, шестнадцать и четыре, тридцать шесть тысяч шестьсот шестьдесят четыре, корень сто девяносто два.', 'Yes. Multiplying thirty-six, sixteen, sixteen, and four gives thirty-six thousand six hundred sixty-four, the root is a hundred ninety-two.'),
        question: ASK_S,
        items: [
          { id: 'a', right: true, label: '192' },
          { id: 'b', label: '36', hint: L("Bu yarim perimetrning o'zi, yuza emas.", 'Это сам полупериметр, а не площадь.', 'That is the semi-perimeter itself, not the area.') },
        ],
        solution: ['36 · 16 · 16 · 4', '36864', '192'],
      },
      {
        expr: <Row size="big" align="center">{'45, 39, 12,  p = 48'}</Row>,
        ok: L("Ha. Qirq sakkiz, uch, to'qqiz va o'ttiz oltini ko'paytirsak, qirq olti ming olti yuz ellik oltiga, ildizi ikki yuz o'n olti.", 'Да. Перемножив сорок восемь, три, девять и тридцать шесть, сорок шесть тысяч шестьсот пятьдесят шесть, корень двести шестнадцать.', 'Yes. Multiplying forty-eight, three, nine, and thirty-six gives forty-six thousand six hundred fifty-six, the root is two hundred sixteen.'),
        question: ASK_S,
        items: [
          { id: 'a', right: true, label: '216' },
          { id: 'b', label: '48', hint: L("Bu yarim perimetrning o'zi, yuza emas.", 'Это сам полупериметр, а не площадь.', 'That is the semi-perimeter itself, not the area.') },
        ],
        solution: ['48 · 3 · 9 · 36', '46656', '216'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ 3 (`drill`, приборсиз): hisoblashni son bilan tekshirish
// (З16).
// ============================================================
const S11 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З16',
  eyebrow: UI.practiceEyebrow,
  title: L(
    "Geron formulasi bo'yicha hisoblashni tekshiring",
    'Проверь вычисление по формуле Герона',
    'Check the computation from Heron\'s formula',
  ),
  audio: [
    A('mount',
      "Uch topshiriq. Har birida taklif qilingan yuzani tekshiring.",
      'Три задания. В каждом проверь предложенную площадь.',
      'Three tasks. In each, check the proposed area.'),
    A('why',
      "p, p minus a, p minus b, p minus c ni hisoblab, ko'paytmaning ildizini toping.",
      'Посчитай p, p минус a, p минус b, p минус c и найди корень из произведения.',
      'Compute p, p minus a, p minus b, p minus c and find the root of the product.'),
  ],
  props: {
    doneNote: L(
      "Uchtasi ham hal bo'ldi. Har safar hisoblash taklif qilingan javobni tekshirib berdi.",
      'Все три разобраны. Каждый раз вычисление проверяло предложенный ответ.',
      'All three are done. Each time computation checked the proposed answer.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'35, 29, 8   →   S = 84'}</Row>,
        ok: L("Ha. O'ttiz olti, bir, yetti va yigirma sakkizni ko'paytirsak, yetti ming besh yuz oltmish oltiga, ildizi sakson to'rt.", 'Да. Перемножив тридцать шесть, один, семь и двадцать восемь, семь тысяч пятьсот пятьдесят шесть, корень восемьдесят четыре.', 'Yes. Multiplying thirty-six, one, seven, and twenty-eight gives seven thousand five hundred fifty-six, the root is eighty-four.'),
        question: L("Bu javob to'g'rimi?", 'Верен ли этот ответ?', 'Is this answer correct?'),
        items: [
          { id: 'a', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'b', label: L("Yo'q", 'Нет', 'No'), hint: L("Hisoblab ko'ring, javob rostdan ham sakson to'rt chiqadi.", 'Посчитай, ответ действительно выходит восемьдесят четыре.', 'Compute it, the answer really comes to eighty-four.') },
        ],
        solution: ['36 · 1 · 7 · 28', '7056', '84'],
      },
      {
        expr: <Row size="big" align="center">{'9, 12, 15   →   S = 60'}</Row>,
        ok: L("Yo'q. Bu to'g'ri burchakli uchburchak, yuzasi katetlar ko'paytmasining yarmi, ellik to'rt, oltmish emas.", 'Нет. Это прямоугольный треугольник, площадь равна половине произведения катетов, пятьдесят четыре, а не шестьдесят.', 'No. This is a right triangle, the area is half the product of the legs, fifty-four, not sixty.'),
        question: L("Bu javob to'g'rimi?", 'Верен ли этот ответ?', 'Is this answer correct?'),
        items: [
          { id: 'a', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("Qaytadan hisoblang, to'qqiz ko'paytirilgan o'n ikki, yarmi ellik to'rt.", 'Посчитай снова, девять умножить на двенадцать, половина пятьдесят четыре.', 'Compute it again, nine times twelve, half is fifty-four.') },
        ],
        solution: ['9 · 12', '108', '108 : 2', '54'],
      },
      {
        expr: <Row size="big" align="center">{'39, 42, 45   →   S = 756'}</Row>,
        ok: L("Yo'q. Ko'paytmaning o'zi yetti yuz oltmish oltiga teng, u yuza emas, ildizi olingandan keyin sakson to'qqizga yaqin son chiqadi.", 'Нет. Само произведение равно семисот пятидесяти шести, это не площадь, после извлечения корня выходит число, близкое к восьмидесяти девяти.', 'No. The product itself equals seven hundred fifty-six, that is not the area, after taking the root a number close to eighty-nine comes out.'),
        question: L("Bu javob to'g'rimi?", 'Верен ли этот ответ?', 'Is this answer correct?'),
        items: [
          { id: 'a', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'b', label: L('Ha', 'Да', 'Yes'), hint: L("Yetti yuz oltmish olti ildiz OSTIDAGI son, u o'zi yuza emas.", 'Семьсот пятьдесят шесть это число ПОД корнем, само оно не площадь.', 'Seven hundred fifty-six is the number UNDER the root, it is not the area itself.') },
        ],
        solution: ['63 · 24 · 21 · 18', '571536', '756'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. LOVUSHKA (`drill`, ловушка): yarim perimetr bo'linmagan
// (З97) va katta tomonga katta balandlik deb o'ylangan (З98).
// ============================================================
const S12 = {
  role: 'practice',
  tool: 'drill',
  tag: 'З97',
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
      "Birinchisida p ikkiga bo'linmagan, ikkinchisida balandliklar tartibi teskari olingan.",
      'В первом p не поделено на два, во втором порядок высот взят обратный.',
      'In the first, p was not halved, in the second, the order of the heights was taken backwards.'),
  ],
  props: {
    doneNote: L(
      "Ikkalasi ham hal bo'ldi. Har ikki xato ham boshqa-boshqa qoidani chetlab o'tgan.",
      'Обе разобраны. Обе ошибки обошли разные правила.',
      'Both are done. Each mistake bypassed a different rule.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{'13, 14, 15   →   p = 42'}</Row>,
        ok: L("Ha. Qirq ikki bu perimetrning o'zi, u ikkiga bo'linmagan, yarim perimetr yigirma bir bo'lishi kerak.", 'Да. Сорок два это сам периметр, он не поделён на два, полупериметр должен быть двадцать один.', 'Yes. Forty-two is the perimeter itself, not halved, the semi-perimeter should be twenty-one.'),
        question: L("Tomonlar o'n uch, o'n to'rt va o'n besh bo'lsa, va p yuqoridagicha topilgan bo'lsa, bu yerda xato qayerda?", 'Если стороны тринадцать, четырнадцать и пятнадцать, а p найдено как выше, в чём здесь ошибка?', 'If the sides are thirteen, fourteen, and fifteen, and p was found as above, where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Yig'indi ikkiga bo'linmagan, faqat perimetrning o'zi yozilgan", 'Сумма не поделена на два, записан только сам периметр', 'The sum was not divided by two, only the perimeter itself was written') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, yarim perimetr yigirma bir bo'lishi kerak, qirq ikki emas.", 'Это и есть показанная ошибка, полупериметр должен быть двадцать один, а не сорок два.', 'This is the very mistake shown; the semi-perimeter should be twenty-one, not forty-two.') },
        ],
        solution: ['42 : 2', '21'],
      },
      {
        expr: <Row size="big" align="center">{'9, 12, 15   →   h₁₅ > h₉'}</Row>,
        ok: L("Ha. O'n besh eng katta tomon, unga mos balandlik esa eng kichigi, to'qqizga mos balandlik eng kattasi.", 'Да. Пятнадцать наибольшая сторона, соответствующая ей высота наименьшая, а наибольшая высота соответствует девяти.', 'Yes. Fifteen is the largest side, its matching height is the smallest, the largest height matches nine.'),
        question: L("Uchburchakning tomonlari to'qqiz, o'n ikki va o'n besh bo'lsa, va yuqorida h₁₅ h₉ dan katta deb yozilgan bo'lsa, bu yerda xato qayerda?", 'Если стороны треугольника девять, двенадцать и пятнадцать, а выше записано, что h₁₅ больше h₉, в чём здесь ошибка?', 'If the triangle\'s sides are nine, twelve, and fifteen, and it was written above that h₁₅ is greater than h₉, where is the mistake here?'),
        items: [
          { id: 'a', right: true, label: L("Katta tomonga katta balandlik mos keladi deb o'ylangan, aslida aksincha", 'Считалось, что большей стороне соответствует большая высота, а на самом деле наоборот', 'It was thought the larger side gets the larger height, but it is actually the opposite') },
          { id: 'b', label: L('Xato yo\'q', 'Ошибки нет', 'There is no mistake'), hint: L("Bu ko'rsatilgan xatoning o'zi, o'n beshga mos balandlik eng kichigi bo'lishi kerak.", 'Это и есть показанная ошибка, высота, соответствующая пятнадцати, должна быть наименьшей.', 'This is the very mistake shown; the height matching fifteen should be the smallest.') },
        ],
        solution: ['h₉ = 12', 'h₁₅ = 7,2'],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. QADAMLAB YOZISH (`fill`): p va S ni qadamlab hisoblash.
// ============================================================
const S13 = {
  role: 'transfer',
  tool: 'fill',
  tag: 'З97',
  eyebrow: L('QADAMLAB YOZISH', 'ЗАПИСЬ ПО ШАГАМ', 'WRITING STEP BY STEP'),
  title: L(
    "Uchala tomondan p va S ni qadamlab hisoblang",
    'Вычисли p и S по трём сторонам, по шагам',
    'Compute p and S from the three sides, step by step',
  ),
  audio: [
    A('mount',
      "Uchta tomon berilgan. Avval p topiladi, keyin Geron formulasi bilan S.",
      'Даны три стороны. Сначала находится p, потом S по формуле Герона.',
      'Three sides are given. First p is found, then S by Heron\'s formula.'),
    A('why',
      "Bu ikki qadam har doim bir xil, faqat sonlar o'zgaradi.",
      'Эти два шага всегда одинаковы, меняются только числа.',
      'These two steps are always the same, only the numbers change.'),
  ],
  props: {
    repeatLabel: UI.repeatLabel,
    doneNote: L(
      "Uchtasi ham to'ldi. Har safar avval p, keyin Geron formulasi bilan S topilgan.",
      'Все три заполнены. Каждый раз сначала находилось p, потом S по формуле Герона.',
      'All three are filled. Each time p was found first, then S by Heron\'s formula.',
    ),
    showLabel: UI.showLabel,
    againLabel: UI.againLabel,
    selfLabel: UI.selfLabel,
    demo: {
      chips: ['21', '84'],
      lines: [
        [{ t: 'a=13, b=14, c=15   →   p = ' }, { slot: '21' }, { t: '   →   S = ' }, { slot: '84' }],
      ],
    },
    tasks: [
      {
        chips: ['18', '54'],
        lines: [
          [{ t: 'a=9, b=12, c=15   →   p = ' }, { slot: '18' }, { t: '   →   S = ' }, { slot: '54' }],
        ],
      },
      {
        chips: ['63', '756'],
        lines: [
          [{ t: 'a=39, b=42, c=45   →   p = ' }, { slot: '63' }, { t: '   →   S = ' }, { slot: '756' }],
        ],
      },
      {
        chips: ['48', '216'],
        lines: [
          [{ t: 'a=45, b=39, c=12   →   p = ' }, { slot: '48' }, { t: '   →   S = ' }, { slot: '216' }],
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
    "Balandlik va Geron formulasi bo'yicha to'rt savol",
    'Четыре вопроса о высоте и формуле Герона',
    'Four questions about the height and Heron\'s formula',
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
        id: 'q1', tag: 'З97',
        ask: L('Tomonlari to\'qqiz, o\'n ikki va o\'n besh bo\'lsa, yarim perimetr qancha?', 'Если стороны девять, двенадцать и пятнадцать, чему равен полупериметр?', 'If the sides are nine, twelve, and fifteen, what is the semi-perimeter?'),
        options: [
          { id: 'ok', right: true, label: '18' },
          { id: 'no', label: '36' },
        ],
        hint: L("O'ttiz olti bu perimetrning o'zi. Uni ikkiga bo'ling.", 'Тридцать шесть это сам периметр. Раздели его на два.', 'Thirty-six is the perimeter itself. Divide it by two.'),
        ok: L("To'g'ri, o'ttiz olti ikkiga bo'linsa, o'n sakkiz.", 'Верно, тридцать шесть, делённое на два, восемнадцать.', 'Correct, thirty-six divided by two is eighteen.'),
      },
      {
        id: 'q2', tag: 'З98',
        ask: L('To\'qqiz, o\'n ikki va o\'n besh tomonli uchburchakda qaysi tomonga ENG KATTA balandlik mos keladi?', 'В треугольнике со сторонами девять, двенадцать и пятнадцать, какой стороне соответствует НАИБОЛЬШАЯ высота?', 'In a triangle with sides nine, twelve, and fifteen, which side has the LARGEST matching height?'),
        options: [
          { id: 'ok', right: true, label: '9' },
          { id: 'no', label: '15' },
        ],
        hint: L("O'n besh eng katta tomon, unga mos balandlik esa eng kichigi.", 'Пятнадцать наибольшая сторона, а соответствующая ей высота наименьшая.', 'Fifteen is the largest side, and its matching height is the smallest.'),
        ok: L("To'g'ri, eng kichik tomonga eng katta balandlik mos keladi.", 'Верно, наименьшей стороне соответствует наибольшая высота.', 'Correct, the smallest side has the largest matching height.'),
      },
      {
        id: 'q3', tag: 'З97',
        ask: L('Tomonlari o\'n uch, o\'n to\'rt va o\'n besh bo\'lsa, Geron formulasi bilan yuza qancha?', 'Если стороны тринадцать, четырнадцать и пятнадцать, чему равна площадь по формуле Герона?', 'If the sides are thirteen, fourteen, and fifteen, what is the area by Heron\'s formula?'),
        options: [
          { id: 'ok', right: true, label: '84' },
          { id: 'no', label: '21' },
        ],
        hint: L("Yigirma bir bu yarim perimetr, u yuza emas, hali ko'paytirib ildiz olinmagan.", 'Двадцать один это полупериметр, а не площадь, произведение и корень ещё не взяты.', 'Twenty-one is the semi-perimeter, not the area, the product and root have not been taken yet.'),
        ok: L("To'g'ri, to'rt qavat ko'paytmasining ildizi sakson to'rt.", 'Верно, корень из произведения четырёх множителей восемьдесят четыре.', 'Correct, the root of the product of the four factors is eighty-four.'),
      },
      {
        id: 'q4', tag: 'З16',
        ask: L('36 · 16 · 16 · 4 ni hisoblasak, 36864 chiqadimi?', 'Верно ли, что 36 · 16 · 16 · 4, равно 36864?', 'Is it true that 36 · 16 · 16 · 4 equals 36864?'),
        options: [
          { id: 'ok', right: true, label: L('Ha', 'Да', 'Yes') },
          { id: 'no', label: L("Yo'q", 'Нет', 'No') },
        ],
        hint: L("Hisoblab ko'ring, o'n olti o'n oltiga, keyin to'rtga, keyin o'ttiz oltiga ko'paytiriladi.", 'Посчитай, шестнадцать умножается на шестнадцать, потом на четыре, потом на тридцать шесть.', 'Compute it, sixteen is multiplied by sixteen, then by four, then by thirty-six.'),
        ok: L("To'g'ri, hisoblash mos keladi.", 'Верно, вычисление совпадает.', 'Correct, the computation matches.'),
      },
      {
        id: 'q5', tag: 'З97',
        ask: L("Yozuvni yig'ing", 'Собери запись', 'Assemble the record'),
        builtLabel: UI.builtLabel,
        build: {
          lead: L(
            "Tomonlari o'ttiz besh, yigirma to'qqiz va sakkiz bo'lgan uchburchakning yuzasini yig'ing.",
            'Собери площадь треугольника со сторонами тридцать пять, двадцать девять и восемь.',
            'Assemble the area of a triangle with sides thirty-five, twenty-nine, and eight.',
          ),
          lines: [
            [{ t: 'p = ' }, { slot: '36' }, { t: '   →   S = ' }, { slot: '84' }],
          ],
          tiles: [
            { id: 't1', v: '36', x: 12, y: 12 },
            { id: 't2', v: '84', x: 60, y: 14 },
            { id: 't3', v: '72', x: 30, y: 50 },
            { id: 't4', v: '192', x: 78, y: 48 },
          ],
          hint: L(
            "O'ttiz besh, yigirma to'qqiz va sakkizni qo'shib, ikkiga bo'ling.",
            'Сложи тридцать пять, двадцать девять и восемь, раздели на два.',
            'Add thirty-five, twenty-nine, and eight, divide by two.',
          ),
          doneNote: L(
            "Yig'ildi. p o'ttiz olti chiqdi, lekin yuza yuz to'qson ikki emas, sakson to'rt, chunki tomonlar boshqacha.",
            'Собрано. p вышло тридцать шесть, но площадь не сто девяносто два, а восемьдесят четыре, потому что стороны другие.',
            'Assembled. p came out thirty-six, but the area is not a hundred ninety-two, it is eighty-four, because the sides are different.',
          ),
        },
      },
    ],
    scoreLabel: UI.scoreLabel,
    stepLabel: UI.taskLabel,
  },
}

// ============================================================
// EKRAN 15. YAKUN (`takeaway`). Yangi matematika yo'q.
// ============================================================
const S15 = {
  role: 'summary',
  tool: 'takeaway',
  eyebrow: UI.summaryEyebrow,
  title: L(
    "Yarim perimetr, so'ngra formula, ikkalasi ham faqat tomonlardan",
    'Полупериметр, потом формула, оба только по сторонам',
    'The semi-perimeter, then the formula, both from the sides alone',
  ),
  audio: [
    A('s0',
      "Darsdan ikki formula qoladi. Ikkalasi ham yarim perimetr p bilan yoziladi.",
      'С урока остаются две формулы. Обе записываются через полупериметр p.',
      'Two formulas stay with you. Both are written through the semi-perimeter p.'),
    A('s1',
      "Bugun uch narsa qilindi. Balandlik formulasining g'oyasini ko'rdingiz, Geron formulasini oldingiz va katta tomonga kichik balandlik mos kelishini bildingiz.",
      'Сегодня сделано три вещи. Ты увидел идею формулы высоты, получил формулу Герона, и узнал, что большей стороне соответствует меньшая высота.',
      'Three things are done today. You saw the idea behind the height formula, obtained Heron\'s formula, and learned that the longer side corresponds to a smaller height.'),
    A('s2',
      "Keyingi darsda shu bilimlar amaliy masalalarga qo'llaniladi, jumladan ustunni tik o'rnatishga.",
      'В следующем уроке эти знания применяются к практическим задачам, в том числе к установке столба вертикально.',
      'The next lesson applies this knowledge to practical problems, including setting up a post vertically.',
    ),
  ],
  props: {
    mark: L("p = (a+b+c) : 2,   S = kvadrat ildiz(p(p−a)(p−b)(p−c))", 'p = (a+b+c) : 2,   S = корень из p(p−a)(p−b)(p−c)', 'p = (a+b+c) : 2,   S = root of p(p−a)(p−b)(p−c)'),
    markNote: L(
      "13, 14, 15 → p = 21, S = 84",
      '13, 14, 15 → p = 21, S = 84',
      '13, 14, 15 → p = 21, S = 84',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      "Keyingi dars: Pifagor teoremasi bilan masalalar yechish",
      'Следующий урок: решение задач по теореме Пифагора',
      'Next lesson: solving problems with the Pythagorean theorem',
    ),
  },
}

// ============================================================
// EKRANLAR. Geometriya uchun to'g'ridan-to'g'ri qurilgan.
// ============================================================
export const SCREENS = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15]

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
