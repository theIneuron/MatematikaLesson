// ============================================================================
// 9-sinf, Dars 33. TRIGONOMETRIYA ELEMENTLARI.
//
// REDAKSIYA 1, 2026-08-28. Darslik: III bob, 17-§ (93-96-bet),
// 18-§ (97-102), 19-§ (103-108), 20-§ (109-111), 21-§ (112-116),
// 22-§ (117-119).
//
// OLTITA PARAGRAF BITTA DARSDA — reja shunday talab qiladi. Buni
// «hammasini aytib chiqish» bilan bajarib bo'lmaydi, shuning uchun
// darsning umurtqasi bitta narsa: BIRLIK AYLANA. Oltita paragrafning
// har biri undan kelib chiqadi va shu tartibda beriladi:
//   17-§ radian — aylana yoyi radiusga teng bo'lgan burchak;
//   18-§ burish — (1; 0) nuqtani burchakka burish;
//   19-§ ta'riflar — burilgan nuqtaning ABSSISSASI kosinus,
//        ORDINATASI sinus, ya'ni ta'rif emas, o'qish;
//   20-§ ishoralar — chorak koordinataning ishorasini beradi, yodlash
//        kerak emas;
//   21-§ sin² + cos² = 1 — bu birlik aylananing x² + y² = 1
//        tenglamasining o'zi, boshqa hech narsa emas;
//   22-§ ayniyatlar — tangens sinusning kosinusga nisbati.
// Ya'ni dars oltita mavzuni emas, BITTA chizmani o'rgatadi, qolgani
// undan o'qib olinadi.
//
// YANGI ASBOB: `UnitCircle` (asboblar.jsx, 7F). Bu darsning asbobsiz
// o'tishi mumkin emas: sinus va kosinusning ta'rifi HARAKAT — nuqtani
// burish va koordinatani o'qish. Asbobda bola burchakni tanlaydi,
// nuqta aylana bo'ylab siljiydi (0,6 s), proyeksiyalar u bilan birga
// qisqaradi va o'sadi, pastda esa cos va sin qiymatlari yoziladi.
// Burish musbat yo'nalishda, soat strelkasiga teskari.
//
// TUZOQ (12-ekran): sinus va kosinusni almashtirish. Bu mavzuning eng
// keng tarqalgan xatosi, va u tasodifiy emas — yozuvda sinus oldin
// keladi, chizmada esa abssissa (kosinus) oldin o'qiladi. Ekran uni
// chizmaga qaytarish bilan yechadi, yodlatish bilan emas.
//
// TRANSFER (13-ekran): sin² + cos² = 1 dan bittasini ikkinchisi orqali
// topish, chorak esa ishorani hal qiladi. Shu bitta masalada 19, 20 va
// 21-§ birga ishlaydi.
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { L, RuleCard, useT } from '../grade8/core.jsx'
import { A, W, makeLesson } from '../grade8/screens.jsx'
import { G9_RECOLOR, G9_STYLES, RecallMC, UnitCircle } from './asboblar.jsx'

export const META = {
  id: 'grade9-33',
  n: 33,
  row: 33,
  block: 'Б6',
  topic: L(
    'Trigonometriya elementlari',
    'Элементы тригонометрии',
    'Elements of trigonometry',
  ),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "Uzunligi radiusga teng yoyni tortib turgan burchak bir radian deyiladi",
    'Угол, опирающийся на дугу длиной в радиус, называется одним радианом',
    'The angle subtending an arc equal to the radius is one radian',
  ),
  L(
    "Burilgan nuqtaning abssissasi kosinus, ordinatasi esa sinus bo'ladi",
    'Абсцисса повёрнутой точки это косинус, а ордината это синус',
    'The abscissa of the rotated point is the cosine, its ordinate is the sine',
  ),
  L(
    "sin² + cos² = 1 tenglik birlik aylananing x² + y² = 1 tenglamasidan kelib chiqadi",
    'Равенство sin² + cos² = 1 следует из уравнения единичной окружности x² + y² = 1',
    'The identity sin² + cos² = 1 comes from the unit circle equation x² + y² = 1',
  ),
]

export const MISS = {
  'radian-gradus-almashish': {
    what: L(
      "radian va gradus almashtirishda koeffitsient teskari olindi",
      'при переводе радианов и градусов коэффициент взят наоборот',
      'the conversion factor between radians and degrees was inverted',
    ),
    wrong: null,
    at: 0,
  },
  'sinus-kosinusni-almashtirish': {
    what: L(
      "sinus va kosinus o'rin almashtirildi",
      'синус и косинус перепутаны местами',
      'sine and cosine were swapped',
    ),
    wrong: null,
    at: 0,
  },
  'ishorani-yodlash': {
    what: L(
      "ishora chorak bo'yicha emas, yoddan olindi",
      'знак взят по памяти, а не по четверти',
      'the sign was recalled from memory instead of read off the quadrant',
    ),
    wrong: null,
    at: 0,
  },
  'ayniyatni-notogri-ishlatish': {
    what: L(
      "asosiy ayniyatdan ildiz olishda ishora tanlanmadi",
      'при извлечении корня из основного тождества не выбран знак',
      'no sign was chosen when taking the root in the main identity',
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// EKRAN 1. XUK — nega gradus yetarli emas.
// ============================================================
const S1 = {
  eyebrow: L('YANGI O\'LCHOV', 'НОВАЯ МЕРА', 'A NEW MEASURE'),
  title: L(
    "Burchakni radiusning o'zi bilan o'lchash",
    'Измерить угол самим радиусом',
    'Measuring an angle by the radius itself',
  ),
  audio: [
    A('mount',
      "Aylananing radiusiga teng uzunlikdagi ipni olamiz va uni aylana bo'ylab yotqizamiz. Ip bir yoyni qoplaydi.",
      'Возьмём нить длиной в радиус окружности и уложим её вдоль окружности. Нить накроет одну дугу.',
      'Take a thread as long as the radius and lay it along the circle. The thread covers one arc.'),
    A('why',
      "Shu yoyga tiralgan burchak bir radian deyiladi. Bunday burchak gradusda nechaga teng bo'lar ekan?",
      'Угол, опирающийся на эту дугу, называют одним радианом. А сколько это будет в градусах?',
      'The angle on that arc is called one radian. How many degrees might that be?'),
  ],
  props: {
    askClass: 'g9-ask-big',
    cardsClass: 'g9-cards-small',
    ask: L(
      "Yarim aylanada radius uzunligidagi yoy π marta joylashadi. Bir radian necha gradus?",
      'В полуокружности дуга длиной в радиус укладывается π раз. Сколько градусов в одном радиане?',
      'Half a circle holds π such arcs. How many degrees is one radian?',
    ),
    items: [
      {
        id: 'right', right: true,
        show: L("Taxminan 57 gradus", 'Примерно 57 градусов', 'About 57 degrees'),
      },
      {
        id: 'wrong',
        show: L("Aniq 60 gradus", 'Ровно 60 градусов', 'Exactly 60 degrees'),
        hint: L(
          "Oltmish bo'lganda yarim aylanaga aynan uchta yoy sig'ardi. Lekin u yerga π ta, ya'ni uch butun o'n to'rt yuzdanta yoy sig'adi, demak har biri oltmishdan kichik.",
          'При шестидесяти в полуокружность вошло бы ровно три дуги. Но туда входит π дуг, то есть три целых четырнадцать сотых, значит каждая меньше шестидесяти.',
          'Sixty would let exactly three arcs fit in a half circle. But π of them fit, that is three point one four, so each is under sixty.',
        ),
      },
    ],
    after: L(
      "Ha. Bir yuz sakson bo'lingan π, taxminan ellik yetti butun uch o'ndan gradus. Bu son chiroyli emas, lekin bunday o'lchov butun trigonometriyani soddalashtiradi.",
      'Да. Сто восемьдесят делить на π, примерно пятьдесят семь целых три десятых градуса. Число некрасивое, но такая мера упрощает всю тригонометрию.',
      'Yes. One hundred eighty over π, about fifty seven point three degrees. Not a neat number, but this measure simplifies all of trigonometry.',
    ),
  },
}

// ============================================================
// EKRAN 2. TAYANCH — radian va gradus almashtirish.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "Yarim aylana bu π radian",
    'Полуокружность это π радиан',
    'A half circle is π radians',
  ),
  audio: [
    A('mount',
      "Bir yuz sakson gradus π radianga teng. Boshqa hamma o'tkazish shu tenglikdan chiqadi.",
      'Сто восемьдесят градусов равны π радианам. Все остальные переводы выходят из этого равенства.',
      'One hundred eighty degrees equal π radians. Every other conversion follows from this.'),
    A('why',
      "O'ttiz gradus bir yuz sakson gradusning oltidan bir qismi.",
      'Тридцать градусов это шестая часть от ста восьмидесяти.',
      'Thirty degrees is one sixth of one hundred eighty.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('180° = π', '180° = π', '180° = π')}
      steps={[]}
      ask={L(
        "O'ttiz gradus necha radian?",
        'Сколько радиан в тридцати градусах?',
        'How many radians are in thirty degrees?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: 'π/6' },
        {
          id: 'wrong',
          label: 'π/30',
          hint: L(
            "Maxrajga o'ttizni qo'yish gradusni to'g'ridan-to'g'ri ko'chirish bo'lardi. Aslida o'ttiz bir yuz saksonning oltidan biri, demak π ning ham oltidan biri.",
            'Поставить в знаменатель тридцать значило бы просто перенести градусы. На деле тридцать это шестая часть от ста восьмидесяти, значит и шестая часть π.',
            'Putting thirty in the denominator would just carry the degrees over. In fact thirty is one sixth of one hundred eighty, so one sixth of π.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Xuddi shunday qirq besh gradus π to'rtdan, oltmish gradus π uchdan, to'qson gradus π ikkidan bo'ladi.",
        'Верно. Точно так же сорок пять градусов это π четвёртых, шестьдесят это π третьих, девяносто это π вторых.',
        'Correct. Likewise forty five degrees is π over four, sixty is π over three, ninety is π over two.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — UnitCircle: ta'rifning o'zi.
// ============================================================
const MARKS = [
  { deg: 0, label: '0', x: '1', y: '0' },
  { deg: 30, label: 'π/6', x: '√3/2', y: '1/2' },
  { deg: 45, label: 'π/4', x: '√2/2', y: '√2/2' },
  { deg: 60, label: 'π/3', x: '1/2', y: '√3/2' },
  { deg: 90, label: 'π/2', x: '0', y: '1' },
  { deg: 120, label: '2π/3', x: '−1/2', y: '√3/2' },
  { deg: 180, label: 'π', x: '−1', y: '0' },
  { deg: 270, label: '3π/2', x: '0', y: '−1' },
]

const S3 = {
  eyebrow: L('TA\'RIF', 'ОПРЕДЕЛЕНИЕ', 'THE DEFINITION'),
  title: L(
    "Nuqtani buring va koordinatani o'qing",
    'Поверни точку и прочитай координату',
    'Rotate the point and read the coordinate',
  ),
  audio: [
    A('mount',
      "Birlik aylanada bir nol nuqtasi turibdi. Uni burchakka buramiz, burish soat strelkasiga teskari.",
      'На единичной окружности стоит точка один ноль. Повернём её на угол, поворот против часовой стрелки.',
      'The point one zero sits on the unit circle. Rotate it by an angle, counterclockwise.'),
    A('why',
      "Hosil bo'lgan nuqtaning abssissasi kosinus, ordinatasi esa sinus deb ataladi. Bu ta'rif, isbot emas.",
      'Абсцисса полученной точки называется косинусом, а ордината синусом. Это определение, а не доказательство.',
      'The abscissa of the resulting point is called the cosine and its ordinate the sine. This is a definition, not a proof.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <UnitCircle
      marks={MARKS}
      tasks={[
        {
          ask: L(
            "Nuqtani to'qson gradusga buring",
            'Поверни точку на девяносто градусов',
            'Rotate the point ninety degrees',
          ),
          right: 4,
          hint: L(
            "To'qson gradus bu bir yuz saksonning yarmi, demak π ning ham yarmi.",
            'Девяносто градусов это половина от ста восьмидесяти, значит и половина π.',
            'Ninety degrees is half of one hundred eighty, so half of π.',
          ),
        },
        {
          ask: L(
            "Endi shunday buringki, nuqta chap tomonda, o'qning o'zida tursin",
            'Теперь поверни так, чтобы точка встала слева, прямо на оси',
            'Now rotate so the point lands on the left, right on the axis',
          ),
          right: 6,
          hint: L(
            "Chap tomonda abssissa minus bir, ordinata esa nol bo'ladi. Bu yarim aylana, ya'ni π.",
            'Слева абсцисса минус один, а ордината ноль. Это полуокружность, то есть π.',
            'On the left the abscissa is minus one and the ordinate zero. That is a half turn, π.',
          ),
        },
        {
          ask: L(
            "Nuqtani o'ttiz gradusga buring",
            'Поверни точку на тридцать градусов',
            'Rotate the point thirty degrees',
          ),
          right: 1,
          hint: L(
            "O'ttiz gradus 2-ekranda π oltidan bo'lgandi.",
            'Тридцать градусов на 2 экране были π шестых.',
            'Thirty degrees was π over six on screen two.',
          ),
        },
      ]}
      after={L(
        "Diqqat qiling: π oltidanda kosinus ildiz uchni ikkiga bo'lgan, sinus esa bir ikkidan. Kosinus yotiq, sinus tik. Boshqa hech qanday ta'rif kerak emas.",
        'Заметь: при π шестых косинус это корень из трёх на два, а синус одна вторая. Косинус лежит горизонтально, синус вертикально. Больше никакого определения не нужно.',
        'Note: at π over six the cosine is root three over two and the sine is one half. The cosine lies flat, the sine stands up. No other definition is needed.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — qaysi biri qaysi.
// ============================================================
const S4 = {
  eyebrow: L('YOTIQ VA TIK', 'ЛЁЖА И СТОЯ', 'FLAT AND UPRIGHT'),
  title: L(
    "Kosinus yotiq, sinus tik",
    'Косинус лежит, синус стоит',
    'The cosine lies, the sine stands',
  ),
  audio: [
    A('mount',
      "Nuqta to'qson gradusga burilganda u eng yuqorida turadi. Uning koordinatalari nol va bir.",
      'При повороте на девяносто градусов точка оказывается на самом верху. Её координаты ноль и один.',
      'Rotated ninety degrees the point stands at the very top. Its coordinates are zero and one.'),
    A('why',
      "Abssissa nol, ordinata bir. Qaysi biri sinus edi?",
      'Абсцисса ноль, ордината один. Которая из них была синусом?',
      'The abscissa is zero, the ordinate is one. Which of them was the sine?'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('α = π/2   →   (0; 1)', 'α = π/2   →   (0; 1)', 'α = π/2   →   (0; 1)')}
      steps={[]}
      ask={L(
        "sin π ikkidan nechaga teng?",
        'Чему равен sin π вторых?',
        'What does sin of π over two equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '1' },
        {
          id: 'wrong',
          label: '0',
          hint: L(
            "Nol bu ABSSISSA, ya'ni kosinus. Sinus esa ordinata, u tik yo'nalishda o'lchanadi va nuqta eng yuqorida turibdi.",
            'Ноль это АБСЦИССА, то есть косинус. А синус это ордината, он измеряется по вертикали, и точка стоит на самом верху.',
            'Zero is the ABSCISSA, that is the cosine. The sine is the ordinate, measured upward, and the point is at the top.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Sinus tik o'lchanadi, shuning uchun eng yuqori nuqtada u eng katta, birga teng. Kosinus esa o'sha yerda nolga aylanadi.",
        'Верно. Синус измеряется по вертикали, поэтому в верхней точке он наибольший, равен единице. А косинус там обращается в ноль.',
        'Correct. The sine is measured vertically, so at the top it is largest, equal to one. The cosine turns to zero there.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — ishoralar chorak bo'yicha.
// ============================================================
const S5 = {
  eyebrow: L('CHORAKLAR', 'ЧЕТВЕРТИ', 'THE QUADRANTS'),
  title: L(
    "Ishorani yodlash shart emas",
    'Знаки не нужно запоминать',
    'The signs need no memorising',
  ),
  audio: [
    A('mount',
      "Ikkinchi chorak bu chap yuqori qism. U yerda nuqtaning abssissasi manfiy, ordinatasi musbat.",
      'Вторая четверть это левая верхняя часть. Там абсцисса точки отрицательна, а ордината положительна.',
      'The second quadrant is the upper left. There the abscissa is negative and the ordinate positive.'),
    A('why',
      "Kosinus abssissa edi, sinus ordinata. Demak ishoralar ham shu yerdan o'qiladi.",
      'Косинус был абсциссой, синус ординатой. Значит и знаки читаются оттуда же.',
      'The cosine was the abscissa and the sine the ordinate. So the signs are read from there too.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('α = 2π/3', 'α = 2π/3', 'α = 2π/3')}
      steps={[
        { id: 'a', head: L('Nuqta', 'Точка', 'The point'), lines: ['(−1/2;  √3/2)'] },
      ]}
      ask={L(
        "cos ikki π uchdan qanday ishoraga ega?",
        'Какой знак у cos двух π третьих?',
        'What sign does cos of two π over three have?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('Manfiy', 'Отрицательный', 'Negative') },
        {
          id: 'wrong',
          label: L('Musbat', 'Положительный', 'Positive'),
          hint: L(
            "Nuqta chapda turibdi, chapda esa abssissa manfiy. Kosinus aynan abssissa edi.",
            'Точка стоит слева, а слева абсцисса отрицательна. Косинус это и есть абсцисса.',
            'The point is on the left, and there the abscissa is negative. The cosine is that abscissa.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Ikkinchi chorakda kosinus manfiy, sinus esa musbat, chunki nuqta chapda va yuqorida. Jadval yodlash o'rniga chizmaga qarash yetarli.",
        'Верно. Во второй четверти косинус отрицателен, а синус положителен, ведь точка слева и вверху. Вместо таблицы достаточно посмотреть на чертёж.',
        'Correct. In the second quadrant the cosine is negative and the sine positive, since the point is left and up. Instead of a table, just look at the picture.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — asosiy ayniyat.
// ============================================================
const S6 = {
  eyebrow: L('ASOSIY AYNIYAT', 'ОСНОВНОЕ ТОЖДЕСТВО', 'THE MAIN IDENTITY'),
  title: L(
    "Bu aylananing tenglamasining o'zi",
    'Это само уравнение окружности',
    'This is the circle equation itself',
  ),
  audio: [
    A('mount',
      "Birlik aylananing tenglamasi x kvadrat qo'shuv y kvadrat teng bir. Bu geometriyadan tanish.",
      'Уравнение единичной окружности это x в квадрате плюс y в квадрате равно единице. Это знакомо из геометрии.',
      'The unit circle equation is x squared plus y squared equals one. This is familiar from geometry.'),
    A('why',
      "Lekin x bu kosinus, y esa sinus edi. Tenglamaga shularni qo'ying.",
      'Но x это косинус, а y это синус. Подставь их в уравнение.',
      'But x is the cosine and y is the sine. Substitute them into the equation.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('x² + y² = 1', 'x² + y² = 1', 'x² + y² = 1')}
      steps={[
        { id: 'a', head: L('Almashtiramiz', 'Подставляем', 'Substituting'), lines: ['x = cos α,   y = sin α'] },
      ]}
      ask={L(
        "Qanday tenglik hosil bo'ladi?",
        'Какое равенство получится?',
        'What identity results?',
      )}
      cols={1}
      items={[
        { id: 'right', right: true, label: 'sin²α + cos²α = 1' },
        {
          id: 'wrong',
          label: 'sin α + cos α = 1',
          hint: L(
            "Tenglamada kvadratlar turibdi, ular yo'qolib ketmaydi. Tekshiring: π to'rtdanda sinus va kosinus ikkalasi ham nol butun yetmish bir yuzdan, ularning yig'indisi birdan katta.",
            'В уравнении стоят квадраты, они никуда не исчезают. Проверь: при π четвёртых синус и косинус равны нулю целых семидесяти одной сотой, их сумма больше единицы.',
            'The equation has squares and they do not vanish. Check: at π over four both sine and cosine are about zero point seven one, and their sum exceeds one.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Asosiy trigonometrik ayniyat bu Pifagor teoremasining birlik aylanadagi ko'rinishi, boshqa hech narsa emas.",
        'Верно. Основное тригонометрическое тождество это теорема Пифагора на единичной окружности, и ничего больше.',
        'Correct. The main trigonometric identity is the Pythagorean theorem on the unit circle, nothing more.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5 — tangens.
// ============================================================
const S7 = {
  eyebrow: L('TANGENS', 'ТАНГЕНС', 'THE TANGENT'),
  title: L(
    "Tangens ikkalasining nisbati",
    'Тангенс это отношение этих двух',
    'The tangent is the ratio of the two',
  ),
  audio: [
    A('mount',
      "Tangens sinusning kosinusga nisbati deb aniqlanadi.",
      'Тангенс определяется как отношение синуса к косинусу.',
      'The tangent is defined as the ratio of sine to cosine.'),
    A('why',
      "π to'rtdanda sinus va kosinus teng. Nisbat qanday chiqadi?",
      'При π четвёртых синус и косинус равны. Каким выйдет отношение?',
      'At π over four the sine and cosine are equal. What does the ratio give?'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('tg α = sin α : cos α', 'tg α = sin α : cos α', 'tg α = sin α : cos α')}
      steps={[
        { id: 'a', head: L('Nuqta', 'Точка', 'The point'), lines: ['(√2/2;  √2/2)'] },
      ]}
      ask={L(
        "tg π to'rtdan nechaga teng?",
        'Чему равен tg π четвёртых?',
        'What does tan of π over four equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '1' },
        {
          id: 'wrong',
          label: '√2',
          hint: L(
            "Ikkita bir xil sonning nisbati har doim birga teng, ular qanday bo'lishidan qat'i nazar. Ildiz qisqarib ketadi.",
            'Отношение двух одинаковых чисел всегда равно единице, какими бы они ни были. Корень сокращается.',
            'The ratio of two equal numbers is always one, whatever they are. The root cancels.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Diqqat: kosinus nolga aylanadigan burchaklarda, masalan π ikkidanda, tangens mavjud emas, chunki nolga bo'lib bo'lmaydi.",
        'Верно. Внимание: там, где косинус обращается в ноль, например при π вторых, тангенса не существует, ведь на ноль делить нельзя.',
        'Correct. Note: where the cosine turns to zero, as at π over two, the tangent does not exist, since division by zero is impossible.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 8. QOIDA.
// ============================================================
const S8_RULE = {
  lines: [
    STATEMENTS[0],
    STATEMENTS[1],
    STATEMENTS[2],
  ],
  source: L(
    'Algebra 9, III bob, 17-22-§ (93-119-bet)',
    'Алгебра 9, глава III, §17-22 (стр. 93-119)',
    'Algebra 9, chapter III, §17-22 (p. 93-119)',
  ),
}

function RuleScreen({ audio, onSolved, step, rule }) {
  const t = useT()
  const [open, setOpen] = useState(false)
  return (
    <>
      <RecallMC
        intro={L(
          "Avval savolga javob bering, keyin qoida ochiladi",
          'Сначала ответь на вопрос, потом откроется правило',
          'Answer the question first, then the rule opens',
        )}
        steps={[]}
        ask={L(
          "Sinus va kosinus qayerdan o'qiladi?",
          'Откуда читаются синус и косинус?',
          'Where are the sine and cosine read from?',
        )}
        cols={1}
        items={[
          {
            id: 'right', right: true,
            label: L(
              "Burilgan nuqtaning koordinatalaridan",
              'Из координат повёрнутой точки',
              'From the coordinates of the rotated point',
            ),
          },
          {
            id: 'wrong',
            label: L('Maxsus jadvaldan', 'Из специальной таблицы', 'From a special table'),
            hint: L(
              "Jadval faqat tayyor javoblarni saqlaydi. Ta'rifning o'zi esa chizmada: buring va koordinatani o'qing.",
              'Таблица хранит только готовые ответы. А само определение на чертеже: поверни и прочитай координату.',
              'A table only stores ready answers. The definition itself is on the drawing: rotate and read the coordinate.',
            ),
          },
        ]}
        after={L(
          "To'g'ri. Endi to'liq qoida.",
          'Верно. Теперь полное правило.',
          'Correct. Now the full rule.',
        )}
        audio={audio}
        onSolved={(r) => { setOpen(true); if (onSolved) onSolved(r) }}
        onStep={step}
      />
      <RuleCard
        title={t(L('QOIDA', 'ПРАВИЛО', 'RULE')) + ' · ' + t(rule.source)}
        lines={rule.lines.map((l) => t(l))}
        masked={!open}
        lockLabel={L(
          "Qoida to'g'ri javobdan keyin ochiladi",
          'Правило откроется после верного ответа',
          'The rule opens after a correct answer',
        )}
      />
    </>
  )
}

const S8 = {
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L(
    "Bitta chizma, oltita paragraf",
    'Один чертёж, шесть параграфов',
    'One drawing, six sections',
  ),
  audio: [
    A('mount',
      "Yetti ekranda siz radianni, burishni, ta'riflarni, ishoralarni, asosiy ayniyatni va tangensni ko'rdingiz. Hammasi bitta aylanadan.",
      'На семи экранах ты увидел радиан, поворот, определения, знаки, основное тождество и тангенс. Всё из одной окружности.',
      'On seven screens you met the radian, the rotation, the definitions, the signs, the main identity, and the tangent. All from one circle.'),
    W('card',
      "Qoida ochildi. Barchasi darslikdan.",
      'Правило открылось. Всё из учебника.',
      'The rule is open. Everything is from the textbook.'),
  ],
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
}

// ============================================================
// EKRAN 9. MASHQ — UnitCircle ikkinchi marta.
// ============================================================
const S9 = {
  eyebrow: L('TAKROR', 'ПОВТОР', 'REPEAT'),
  title: L(
    "Endi koordinata bo'yicha burchakni toping",
    'Теперь найди угол по координате',
    'Now find the angle from a coordinate',
  ),
  audio: [
    A('mount',
      "Endi teskarisi. Kerakli koordinata beriladi, siz esa mos burchakni tanlaysiz.",
      'Теперь наоборот. Даётся нужная координата, а ты выбираешь подходящий угол.',
      'Now the other way round. A coordinate is given and you choose the matching angle.'),
    A('why',
      "Chizmaga qarab tanlang, yodlashga urinmang.",
      'Выбирай по чертежу, не пытайся вспоминать.',
      'Choose from the drawing, do not try to recall.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <UnitCircle
      marks={MARKS}
      tasks={[
        {
          ask: L(
            "Kosinus nolga, sinus esa minus birga teng bo'ladigan burchakni tanlang",
            'Выбери угол, при котором косинус ноль, а синус минус один',
            'Choose the angle where the cosine is zero and the sine is minus one',
          ),
          right: 7,
          hint: L(
            "Sinus manfiy, demak nuqta pastda. Kosinus nol, demak u aynan o'qda turibdi.",
            'Синус отрицателен, значит точка внизу. Косинус ноль, значит она прямо на оси.',
            'The sine is negative, so the point is at the bottom. The cosine is zero, so it sits right on the axis.',
          ),
        },
        {
          ask: L(
            "Sinus va kosinus teng bo'ladigan burchakni tanlang",
            'Выбери угол, при котором синус и косинус равны',
            'Choose the angle where the sine equals the cosine',
          ),
          right: 2,
          hint: L(
            "Ikkala koordinata teng bo'lsa, nuqta chorakni teng ikkiga bo'ladi. Bu qirq besh gradus.",
            'Если обе координаты равны, точка делит четверть пополам. Это сорок пять градусов.',
            'If both coordinates are equal, the point halves the quadrant. That is forty five degrees.',
          ),
        },
        {
          ask: L(
            "Sinus ildiz uch bo'lingan ikkiga, kosinus esa bir ikkidanga teng bo'ladigan burchakni tanlang",
            'Выбери угол, при котором синус равен корню из трёх на два, а косинус одной второй',
            'Choose the angle where the sine is root three over two and the cosine is one half',
          ),
          right: 3,
          hint: L(
            "Sinus kosinusdan katta, demak nuqta o'rtadan yuqorida. Bu oltmish gradus.",
            'Синус больше косинуса, значит точка выше середины. Это шестьдесят градусов.',
            'The sine exceeds the cosine, so the point is above the middle. That is sixty degrees.',
          ),
        },
      ]}
      after={L(
        "Uchtasi ham topildi. Koordinatalar burchakni bir qiymatli aniqlaydi, agar bir aylanadan chiqmasak.",
        'Все три найдены. Координаты однозначно определяют угол, если не выходить за один оборот.',
        'All three are found. The coordinates fix the angle uniquely, so long as we stay within one turn.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 10. MASHQ — ZANJIR: radian va gradus.
// ============================================================
const S10 = {
  eyebrow: L('ZANJIR', 'ЦЕПОЧКА', 'THE CHAIN'),
  title: L(
    "Radian va gradus",
    'Радианы и градусы',
    'Radians and degrees',
  ),
  audio: [
    A('mount',
      "Uchta o'tkazish. Har birida bir yuz sakson gradus π radianga tengligidan foydalaning.",
      'Три перевода. В каждом используй, что сто восемьдесят градусов равны π радианам.',
      'Three conversions. In each use that one hundred eighty degrees equal π radians.'),
    A('why',
      "Gradusdan radianga o'tishda π ga ko'paytirib, bir yuz saksonga bo'ling.",
      'Переходя от градусов к радианам, умножай на π и дели на сто восемьдесят.',
      'Going from degrees to radians, multiply by π and divide by one hundred eighty.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham topildi. Radian π orqali yoziladi, chunki aynan π yarim aylanani beradi.",
      'Все три найдены. Радианы записывают через π, ведь именно π даёт полуокружность.',
      'All three are found. Radians are written through π, since π is exactly the half turn.',
    ),
    tasks: [
      {
        expr: '45°',
        question: L('Bu necha radian?', 'Сколько это радиан?', 'How many radians is this?'),
        ok: L("Ha. Qirq besh bu bir yuz saksonning to'rtdan biri.", 'Да. Сорок пять это четвёртая часть от ста восьмидесяти.', 'Yes. Forty five is one quarter of one hundred eighty.'),
        items: [
          { id: 'a', right: true, label: 'π/4' },
          { id: 'b', label: 'π/45', hint: L("Maxrajga qirq beshni qo'yish graduslarni ko'chirish bo'lardi. Qirq beshni bir yuz saksonga bo'ling.", 'Поставить в знаменатель сорок пять значило бы перенести градусы. Раздели сорок пять на сто восемьдесят.', 'Putting forty five in the denominator carries the degrees over. Divide forty five by one hundred eighty.') },
        ],
        solution: ['45 : 180 = 1/4', '45° = π/4'],
      },
      {
        expr: '120°',
        question: L('Bu necha radian?', 'Сколько это радиан?', 'How many radians is this?'),
        ok: L("Ha. Bir yuz yigirma bo'lingan bir yuz sakson, ikki uchdan.", 'Да. Сто двадцать делить на сто восемьдесят, две трети.', 'Yes. One hundred twenty over one hundred eighty is two thirds.'),
        items: [
          { id: 'a', right: true, label: '2π/3' },
          { id: 'b', label: '3π/2', hint: L("Uch π ikkidan bu ikki yuz yetmish gradus, ya'ni to'liq aylananing to'rtdan uch qismi. Bir yuz yigirma esa yarim aylanadan kichik.", 'Три π вторых это двести семьдесят градусов, три четверти полного оборота. А сто двадцать меньше полуокружности.', 'Three π over two is two hundred seventy degrees, three quarters of a turn. One hundred twenty is less than a half turn.') },
        ],
        solution: ['120 : 180 = 2/3', '120° = 2π/3'],
      },
      {
        expr: 'π/3',
        question: L('Bu necha gradus?', 'Сколько это градусов?', 'How many degrees is this?'),
        ok: L("Ha. Bir yuz sakson bo'lingan uch, oltmish.", 'Да. Сто восемьдесят делить на три, шестьдесят.', 'Yes. One hundred eighty over three is sixty.'),
        items: [
          { id: 'a', right: true, label: '60°' },
          { id: 'b', label: '30°', hint: L("O'ttiz gradus π oltidanga to'g'ri kelardi. Bu yerda maxrajda uch turibdi, demak bo'lak kattaroq.", 'Тридцать градусов отвечали бы π шестых. Здесь в знаменателе три, значит доля больше.', 'Thirty degrees would be π over six. Here the denominator is three, so the share is larger.') },
        ],
        solution: ['180 : 3 = 60', 'π/3 = 60°'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ — ZANJIR: ishoralar.
// ============================================================
const S11 = {
  eyebrow: L('ISHORALAR', 'ЗНАКИ', 'THE SIGNS'),
  title: L(
    "Chorakka qarab aniqlang",
    'Определи по четверти',
    'Decide by the quadrant',
  ),
  audio: [
    A('mount',
      "Uchta savol. Har birida avval nuqta qaysi chorakda turishini aniqlang.",
      'Три вопроса. В каждом сначала определи, в какой четверти стоит точка.',
      'Three questions. In each, first settle which quadrant the point is in.'),
    A('why',
      "O'ng tomonda kosinus musbat, yuqorida sinus musbat.",
      'Справа косинус положителен, вверху положителен синус.',
      'On the right the cosine is positive, at the top the sine is positive.'),
  ],
  props: {
    stepLabel: L('Savol', 'Вопрос', 'Question'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham topildi. Ishoralar jadvali kerak emas: chorakni toping va koordinataning ishorasini o'qing.",
      'Все три найдены. Таблица знаков не нужна: найди четверть и прочитай знак координаты.',
      'All three are found. No table of signs is needed: find the quadrant and read the sign of the coordinate.',
    ),
    tasks: [
      {
        expr: 'α = 2π/3',
        question: L('sin α qanday ishoraga ega?', 'Какой знак у sin α?', 'What sign does sin α have?'),
        ok: L("Ha, musbat. Nuqta yuqorida, demak ordinata musbat.", 'Да, положительный. Точка вверху, значит ордината положительна.', 'Yes, positive. The point is up, so the ordinate is positive.'),
        items: [
          { id: 'a', right: true, label: L('Musbat', 'Положительный', 'Positive') },
          { id: 'b', label: L('Manfiy', 'Отрицательный', 'Negative'), hint: L("Ikki π uchdan bu bir yuz yigirma gradus, ya'ni to'qsondan katta, lekin bir yuz saksondan kichik. Nuqta hali yuqorida.", 'Две π третьих это сто двадцать градусов, больше девяноста, но меньше ста восьмидесяти. Точка ещё вверху.', 'Two π over three is one hundred twenty degrees, past ninety but short of one hundred eighty. The point is still up.') },
        ],
        solution: [L('II chorak', 'II четверть', 'Quadrant II'), 'sin > 0'],
      },
      {
        expr: 'α = 3π/2',
        question: L('cos α nechaga teng?', 'Чему равен cos α?', 'What does cos α equal?'),
        ok: L("Ha, nolga. Nuqta eng pastda, o'qning o'zida turibdi, abssissasi nol.", 'Да, нулю. Точка в самом низу, прямо на оси, её абсцисса ноль.', 'Yes, zero. The point is at the very bottom, right on the axis, so its abscissa is zero.'),
        items: [
          { id: 'a', right: true, label: '0' },
          { id: 'b', label: '−1', hint: L("Minus bir bu CHAP tomondagi nuqtaning abssissasi, ya'ni π burchak. Uch π ikkidanda nuqta pastda.", 'Минус один это абсцисса точки СЛЕВА, то есть угол π. А при трёх π вторых точка внизу.', 'Minus one is the abscissa of the point on the LEFT, at angle π. At three π over two the point is at the bottom.') },
        ],
        solution: ['(0; −1)', 'cos = 0'],
      },
      {
        expr: 'α = π',
        question: L('sin α nechaga teng?', 'Чему равен sin α?', 'What does sin α equal?'),
        ok: L("Ha, nolga. Nuqta chapda, o'qda turibdi, ordinatasi nol.", 'Да, нулю. Точка слева, на оси, её ордината ноль.', 'Yes, zero. The point is on the left, on the axis, so its ordinate is zero.'),
        items: [
          { id: 'a', right: true, label: '0' },
          { id: 'b', label: '−1', hint: L("Minus bir sinus uchun eng past nuqtada bo'lardi. π esa yarim aylana, u nuqtani chapga olib boradi, pastga emas.", 'Минус один для синуса был бы в самой нижней точке. А π это полуоборот, он уводит точку влево, а не вниз.', 'Minus one for the sine belongs to the lowest point. π is a half turn and takes the point left, not down.') },
        ],
        solution: ['(−1; 0)', 'sin = 0'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ — sinus va kosinusni almashtirish.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Qaysi koordinata qaysi funksiya",
    'Какая координата какая функция',
    'Which coordinate is which function',
  ),
  audio: [
    A('mount',
      "Kamronning yechimi. Burchak π oltidan, nuqta esa ildiz uch bo'lingan ikki va bir ikkidan.",
      'Решение Камрона. Угол π шестых, а точка корень из трёх на два и одна вторая.',
      "Kamron's solution. The angle is π over six and the point is root three over two and one half."),
    A('why',
      "U sinusni ildiz uch bo'lingan ikki deb yozgan. Koordinatalarning tartibiga qarang.",
      'Он записал синус как корень из трёх на два. Посмотри на порядок координат.',
      'He wrote the sine as root three over two. Look at the order of the coordinates.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L("TO'G'RI YECHIM", 'ВЕРНОЕ РЕШЕНИЕ', 'CORRECT SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Yozuvda sinus oldin keladi, chizmada esa abssissa oldin o'qiladi — xato aynan shu qarama-qarshilikdan tug'iladi. Davosi yodlash emas: nuqtaning qayerda turganiga qarang. π oltidan kichik burchak, nuqta o'ngda va pastroqda, demak tik koordinata KICHIK bo'lishi kerak.",
      'В записи синус идёт первым, а на чертеже первой читается абсцисса — ошибка рождается именно из этого противоречия. Лекарство не в зубрёжке: посмотри, где стоит точка. Угол π шестых мал, точка справа и невысоко, значит вертикальная координата должна быть МАЛЕНЬКОЙ.',
      'In writing the sine comes first, on the drawing the abscissa is read first — the mistake is born of that clash. The cure is not memorising: look at where the point sits. π over six is a small angle, the point is right and low, so the upright coordinate must be SMALL.',
    ),
    tasks: [
      {
        expr: 'α = π/6   →   (√3/2;  1/2)',
        question: L(
          "sin π oltidan nechaga teng?",
          'Чему равен sin π шестых?',
          'What does sin of π over six equal?',
        ),
        ok: L(
          "To'g'ri, bir ikkidan. Sinus ordinata, ya'ni ikkinchi koordinata.",
          'Верно, одна вторая. Синус это ордината, то есть вторая координата.',
          'Correct, one half. The sine is the ordinate, the second coordinate.',
        ),
        items: [
          { id: 'a', right: true, label: '1/2' },
          {
            id: 'b',
            label: '√3/2',
            hint: L(
              "Ildiz uch bo'lingan ikki taxminan nol butun sakson yetti yuzdan, ya'ni deyarli bir. Bunday katta ordinata to'qson gradusga yaqin burchakda bo'lardi, π oltidan esa faqat o'ttiz gradus.",
              'Корень из трёх на два это примерно ноль целых восемьдесят семь сотых, почти единица. Такая большая ордината была бы у угла около девяноста градусов, а π шестых это всего тридцать.',
              'Root three over two is about zero point eight seven, nearly one. Such a large ordinate belongs near ninety degrees, while π over six is only thirty.',
            ),
          },
        ],
        solution: [
          'cos π/6 = √3/2',
          'sin π/6 = 1/2',
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TRANSFER — ayniyat va chorak birga.
// ============================================================
const S13 = {
  eyebrow: L('TRANSFER', 'ПЕРЕНОС', 'TRANSFER'),
  title: L(
    "Ayniyat sonni beradi, chorak ishorani",
    'Тождество даёт число, четверть знак',
    'The identity gives the number, the quadrant the sign',
  ),
  audio: [
    A('mount',
      "Kosinus minus nol butun sakkiz o'ndanga teng va burchak ikkinchi chorakda. Sinusni toping.",
      'Косинус равен минус ноль целых восемь десятых, и угол во второй четверти. Найди синус.',
      'The cosine is minus zero point eight and the angle lies in the second quadrant. Find the sine.'),
    A('why',
      "Asosiy ayniyatdan sinusning kvadrati chiqadi. Lekin kvadratdan ildiz olishda ikkita javob bor.",
      'Из основного тождества выйдет квадрат синуса. Но при извлечении корня ответов два.',
      'The main identity gives the square of the sine. But taking a root offers two answers.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ayniyat sonning kattaligini beradi, chorak esa ishorasini. Ikkalasi kerak: bittasi bilan javob to'liq bo'lmaydi.",
      'Тождество даёт величину числа, а четверть его знак. Нужны оба: с одним ответ неполон.',
      'The identity gives the size of the number and the quadrant its sign. Both are needed, one alone leaves the answer incomplete.',
    ),
    tasks: [
      {
        expr: 'cos α = −0,8',
        question: L(
          "Sinusning kvadrati nechaga teng?",
          'Чему равен квадрат синуса?',
          'What does the square of the sine equal?',
        ),
        ok: L(
          "Ha. Bir minus nol butun oltmish to'rt yuzdan, nol butun o'ttiz olti yuzdan.",
          'Да. Один минус ноль целых шестьдесят четыре сотых, ноль целых тридцать шесть сотых.',
          'Yes. One minus zero point six four is zero point three six.',
        ),
        items: [
          { id: 'a', right: true, label: '0,36' },
          { id: 'b', label: '0,2', hint: L("Nol butun ikki o'ndan bir minus nol butun sakkiz o'ndan bo'lardi, ya'ni kosinusning o'zi ayirilgan. Ayniyatda esa uning KVADRATI ayiriladi.", 'Ноль целых две десятых вышло бы как один минус ноль целых восемь десятых, то есть вычли сам косинус. А в тождестве вычитается его КВАДРАТ.', 'Zero point two would be one minus zero point eight, subtracting the cosine itself. The identity subtracts its SQUARE.') },
        ],
        solution: ['sin²α = 1 − 0,64', 'sin²α = 0,36'],
      },
      {
        expr: 'sin²α = 0,36',
        question: L(
          "Burchak ikkinchi chorakda. Sinusning o'zi nechaga teng?",
          'Угол во второй четверти. Чему равен сам синус?',
          'The angle is in the second quadrant. What does the sine itself equal?',
        ),
        ok: L(
          "Ha, musbat nol butun olti o'ndan. Ikkinchi chorakda nuqta yuqorida, demak ordinata musbat.",
          'Да, положительные ноль целых шесть десятых. Во второй четверти точка вверху, значит ордината положительна.',
          'Yes, positive zero point six. In the second quadrant the point is up, so the ordinate is positive.',
        ),
        items: [
          { id: 'a', right: true, label: '0,6' },
          {
            id: 'b',
            label: '−0,6',
            hint: L(
              "Minus nol butun olti o'ndan uchinchi yoki to'rtinchi chorakda bo'lardi, u yerda nuqta pastda. Ikkinchi chorak esa chap YUQORI qism.",
              'Минус ноль целых шесть десятых были бы в третьей или четвёртой четверти, где точка внизу. А вторая четверть это левая ВЕРХНЯЯ часть.',
              'Minus zero point six would sit in the third or fourth quadrant, where the point is low. The second quadrant is the upper left.',
            ),
          },
        ],
        solution: ['sin α = ±0,6', L('II chorak: sin > 0', 'II четверть: sin > 0', 'Quadrant II: sin > 0'), 'sin α = 0,6'],
      },
    ],
  },
}

// ============================================================
// EKRAN 14. BLITS.
// ============================================================
const S14 = {
  eyebrow: L('BLITS', 'БЛИЦ', 'BLITZ'),
  title: L(
    "Blits: radian, koordinata, ayniyat",
    'Блиц: радиан, координата, тождество',
    'Blitz: radian, coordinate, identity',
  ),
  audio: [
    A('mount',
      "To'rtta savol birin ketin. Ular qoidani so'raydi, uzoq hisobni emas.",
      'Четыре вопроса один за другим. Они спрашивают про правило, а не про долгий счёт.',
      'Four questions one after another. They ask about the rule, not a long computation.'),
    A('why',
      "Hisob birinchi urinish bo'yicha yuradi.",
      'Счёт идёт по первой попытке.',
      'The count goes by the first attempt.'),
  ],
  props: {
    items: [
      {
        id: 'q1',
        tag: 'radian-gradus-almashish',
        ask: L(
          "π radian necha gradus?",
          'Сколько градусов в π радианах?',
          'How many degrees are in π radians?',
        ),
        options: [
          { id: 'r', right: true, label: '180°' },
          { id: 'w', label: '360°' },
        ],
        ok: L(
          "To'g'ri. π bu yarim aylana, to'liq aylana esa ikki π.",
          'Верно. π это полуокружность, а полный оборот два π.',
          'Correct. π is a half turn, and a full turn is two π.',
        ),
        hint: L(
          "1-ekranni eslang: yarim aylanaga radius uzunligidagi yoy π marta sig'adi.",
          'Вспомни 1 экран: в полуокружность дуга длиной в радиус укладывается π раз.',
          'Recall screen 1: a half circle holds π arcs of radius length.',
        ),
      },
      {
        id: 'q2',
        tag: 'sinus-kosinusni-almashtirish',
        ask: L(
          "Burilgan nuqtaning ordinatasi qaysi funksiya?",
          'Ордината повёрнутой точки это какая функция?',
          'The ordinate of the rotated point is which function?',
        ),
        options: [
          { id: 'sin', right: true, label: L('Sinus', 'Синус', 'The sine') },
          { id: 'cos', label: L('Kosinus', 'Косинус', 'The cosine') },
        ],
        ok: L(
          "To'g'ri. Ordinata tik o'lchanadi, sinus ham shunday.",
          'Верно. Ордината измеряется по вертикали, синус тоже.',
          'Correct. The ordinate is measured upward, and so is the sine.',
        ),
        hint: L(
          "12-ekranni eslang: Kamron aynan shu ikkitasini almashtirgandi.",
          'Вспомни 12 экран: Камрон перепутал именно эти две.',
          'Recall screen 12: those are the two Kamron swapped.',
        ),
      },
      {
        id: 'q3',
        tag: 'ishorani-yodlash',
        ask: L(
          "Uchinchi chorakda kosinus qanday ishoraga ega?",
          'Какой знак у косинуса в третьей четверти?',
          'What sign does the cosine have in the third quadrant?',
        ),
        options: [
          { id: 'neg', right: true, label: L('Manfiy', 'Отрицательный', 'Negative') },
          { id: 'pos', label: L('Musbat', 'Положительный', 'Positive') },
        ],
        ok: L(
          "To'g'ri. Uchinchi chorak chap pastki qism, u yerda ikkala koordinata ham manfiy.",
          'Верно. Третья четверть это левая нижняя часть, там обе координаты отрицательны.',
          'Correct. The third quadrant is the lower left, where both coordinates are negative.',
        ),
        hint: L(
          "5-ekranni eslang: ishora chorakdan o'qiladi, jadvaldan emas. Chapda abssissa manfiy.",
          'Вспомни 5 экран: знак читается по четверти, а не по таблице. Слева абсцисса отрицательна.',
          'Recall screen 5: the sign is read off the quadrant, not a table. On the left the abscissa is negative.',
        ),
      },
      {
        id: 'q4',
        tag: 'ayniyatni-notogri-ishlatish',
        ask: L(
          "sin kvadrat qo'shuv cos kvadrat nechaga teng?",
          'Чему равно син в квадрате плюс кос в квадрате?',
          'What does sine squared plus cosine squared equal?',
        ),
        options: [
          { id: 'one', right: true, label: '1' },
          { id: 'alpha', label: 'α' },
        ],
        ok: L(
          "To'g'ri, birga. Bu birlik aylananing radiusi, ya'ni bir.",
          'Верно, единице. Это радиус единичной окружности, то есть единица.',
          'Correct, one. That is the radius of the unit circle, which is one.',
        ),
        hint: L(
          "6-ekranni eslang: bu x kvadrat qo'shuv y kvadrat teng bir tenglamasining o'zi.",
          'Вспомни 6 экран: это то же уравнение x в квадрате плюс y в квадрате равно единице.',
          'Recall screen 6: it is the very equation x squared plus y squared equals one.',
        ),
      },
    ],
  },
}

// ============================================================
// EKRAN 15. YAKUN.
// ============================================================
const S15 = {
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L(
    "Hammasi bitta aylanadan o'qiladi",
    'Всё читается с одной окружности',
    'Everything is read off one circle',
  ),
  audio: [
    A('s0',
      "Birinchi ekranda burchakni radiusning o'zi bilan o'lchadingiz va bir radian chiqdi.",
      'На первом экране ты измерил угол самим радиусом и получил один радиан.',
      'On the first screen you measured an angle by the radius itself and got one radian.'),
    A('s1',
      "Keyin nuqtani burdingiz va uning koordinatalari kosinus bilan sinus ekanini ko'rdingiz. Ishoralar ham, asosiy ayniyat ham shu chizmadan chiqdi.",
      'Потом ты повернул точку и увидел, что её координаты это косинус и синус. Знаки и основное тождество вышли из того же чертежа.',
      'Then you rotated the point and saw its coordinates are the cosine and sine. The signs and the main identity came from that same drawing.'),
    A('s2',
      "Keyingi darsda trigonometrik formulalar.",
      'В следующем уроке тригонометрические формулы.',
      'The next lesson covers the trigonometric formulas.'),
  ],
  props: {
    mark: 'sin²α + cos²α = 1',
    markNote: L(
      "birlik aylananing tenglamasi",
      'уравнение единичной окружности',
      'the unit circle equation',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      'Keyingi dars: trigonometrik formulalar',
      'Следующий урок: тригонометрические формулы',
      'Next lesson: the trigonometric formulas',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     tool: 'pick', ...S1 },
  { role: 'support',  tag: 'radian-gradus-almashish', ...S2 },
  { role: 'explain',  tool: 'circle', tag: 'sinus-kosinusni-almashtirish', ...S3 },
  { role: 'explain',  tag: 'sinus-kosinusni-almashtirish', ...S4 },
  { role: 'explain',  tag: 'ishorani-yodlash', ...S5 },
  { role: 'explain',  tag: 'ayniyatni-notogri-ishlatish', ...S6 },
  { role: 'explain',  tag: 'sinus-kosinusni-almashtirish', ...S7 },
  { role: 'rule',     tag: 'sinus-kosinusni-almashtirish', ...S8 },
  { role: 'practice', tool: 'circle', tag: 'sinus-kosinusni-almashtirish', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'radian-gradus-almashish', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'ishorani-yodlash', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'sinus-kosinusni-almashtirish', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'ayniyatni-notogri-ishlatish', ...S13 },
  { role: 'blitz',    tool: 'blitz', ...S14,
    props: {
      ...S14.props,
      scoreLabel: L('birinchi urinishdan', 'с первой попытки', 'on the first try'),
      stepLabel: L('Savol', 'Вопрос', 'Question'),
    },
  },
  { role: 'summary',  tool: 'takeaway', ...S15 },
]

// PALITRA: sinf bo'yicha bitta konstanta, `asboblar.jsx`dagi `G9_RECOLOR`.
export default makeLesson({ META, STATEMENTS, MISS, SCREENS, styles: G9_STYLES, recolor: G9_RECOLOR })
