// ============================================================================
// 9-sinf, Dars 14. IKKINCHI DARAJALI TENGSIZLIKLAR.
//
// REDAKSIYA 1, 2026-08-27. BLOK 3 (TENGSIZLIKLAR) BOSHLANDI. Darslik:
// Algebra 9, 7-§ (28-29-bet) — 6-darsda ISHLATILMAGAN ikki maxsus holat:
// 2-masala (29-bet), y=4x²+4x+1, diskriminant nol, PARABOLA Ox GA
// TEGADI (kesmaydi) — bitta takroriy ildiz; Рис. 20 (29-bet), y=-x²+x-1,
// diskriminant manfiy, parabola Ox ni umuman kesmaydi. 6-darsda faqat
// ikkita HAR XIL ildiz holati ko'rilgan edi, bu dars aynan shu ikki
// qoldiq holatni yopadi.
//
// ASBOB: `SignAxis` (Dars06, PODXOD_9SINF.md «Prибор 1») BU DARSDA
// KENGAYTIRILDI: endi `roots` massivi 0, 1 yoki 2 ta ildiz bilan
// ishlaydi (ilgari faqat 2 ta ildizga qattiq bog'langan edi). Kengaytirish
// asbobning o'zini o'zgartirmadi — faqat qattiq yozilgan `[0,1,2]` va
// `bounds` uzunligi `r.length` ga moslashtirildi. Dars06dagi 2-ildiz
// holati orqaga qarab tekshirildi (regressiya yo'q).
//
// TEGLAR (o'zining):
//   ikkita-ildiz-deb-oylash    — tengsizlikda doim ikkita har xil ildiz
//                                bor deb o'ylash
//   urinish-notogri-oqish      — takroriy ildizda (urinish nuqtasida)
//                                ishora o'zgaradi deb o'ylash
//   diskriminant-manfiy-holati — diskriminant manfiy bo'lganda parabola
//                                Ox ni umuman kesmasligini tushunmaslik
//   yechim-yoq-yoki-hamma-son  — "yechim yo'q" va "barcha sonlar"
//                                javoblarini ajrata olmaslik
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { L, MATH_FONT, RuleCard, useT } from '../grade8/core.jsx'
import { A, W, makeLesson } from '../grade8/screens.jsx'
import { G9_RECOLOR, G9_STYLES, RecallMC, SignAxis } from './asboblar.jsx'

export const META = {
  id: 'grade9-14',
  n: 14,
  row: 14,
  block: 'Б3',
  topic: L('Ikkinchi darajali tengsizliklar', 'Неравенства второй степени', 'Second-degree inequalities'),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "Diskriminant nolga teng bo'lsa, parabola Ox ga bitta nuqtada tegadi, ishora shu nuqtaning ikki tomonida ham bir xil qoladi",
    'Если дискриминант равен нулю, парабола касается Ox в одной точке, знак по обе стороны от этой точки остаётся одинаковым',
    'If the discriminant equals zero, the parabola touches Ox at one point, the sign stays the same on both sides of that point',
  ),
  L(
    "Diskriminant manfiy bo'lsa, parabola Ox ni umuman kesmaydi, butun grafik bir xil ishorada turadi",
    'Если дискриминант отрицателен, парабола вообще не пересекает Ox, весь график стоит с одним знаком',
    'If the discriminant is negative, the parabola does not cross Ox at all, the whole graph stands with one sign',
  ),
  L(
    "Bunday holatlarda javob \"yechim yo'q\" yoki \"barcha sonlar\" bo'lishi mumkin, bu ham to'liq javobdir",
    'В таких случаях ответом может быть «решений нет» или «любое число», это тоже полноценный ответ',
    'In such cases the answer can be "no solution" or "all numbers", this too is a complete answer',
  ),
]

export const MISS = {
  'ikkita-ildiz-deb-oylash': {
    what: L(
      "tengsizlikda doim ikkita har xil ildiz bor deb o'ylandi",
      'предполагалось, что в неравенстве всегда два разных корня',
      'it was assumed that the inequality always has two different roots',
    ),
    wrong: null,
    at: 0,
  },
  'urinish-notogri-oqish': {
    what: L(
      "takroriy ildizda (urinish nuqtasida) ishora o'zgaradi deb o'ylandi",
      'предполагалось, что в точке касания знак меняется',
      'it was assumed that the sign changes at the point of tangency',
    ),
    wrong: null,
    at: 0,
  },
  'diskriminant-manfiy-holati': {
    what: L(
      "diskriminant manfiy bo'lganda parabola Ox ni kesishi mumkin deb o'ylandi",
      'предполагалось, что при отрицательном дискриминанте парабола всё же может пересечь Ox',
      'it was assumed that with a negative discriminant the parabola could still cross Ox',
    ),
    wrong: null,
    at: 0,
  },
  'yechim-yoq-yoki-hamma-son': {
    what: L(
      "\"yechim yo'q\" va \"barcha sonlar\" javoblari almashtirib qo'yildi",
      'ответы «решений нет» и «любое число» перепутаны местами',
      'the answers "no solution" and "all numbers" were swapped',
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// DARSNING FUNKSIYALARI. Darslikning o'z misollari (§7).
// ============================================================
// eslint-disable-next-line react-refresh/only-export-components
const Q1 = (x) => 4 * x * x + 4 * x + 1      // (2x+1)², urinish x = −0,5
// eslint-disable-next-line react-refresh/only-export-components
const Q2 = (x) => -x * x + x - 1             // D < 0, doim manfiy

// ============================================================
// EKRAN 1. XUK.
// ============================================================
const S1 = {
  eyebrow: L('TEGADI, KESMAYDI', 'КАСАЕТСЯ, НЕ ПЕРЕСЕКАЕТ', 'TOUCHES, DOES NOT CROSS'),
  title: L(
    "Parabola Ox ni har doim ikki marta kesib o'tmaydi",
    'Парабола не всегда пересекает Ox дважды',
    'A parabola does not always cross Ox twice',
  ),
  audio: [
    A('mount',
      "Yangi funksiya: y teng to'rt x kvadrat qo'shi to'rt x qo'shi bir. Bu parabola Ox chizig'iga faqat TEGADI, kesmaydi.",
      'Новая функция: y равен четыре x в квадрате плюс четыре x плюс один. Эта парабола только КАСАЕТСЯ линии Ox, не пересекает.',
      'A new function: y equals four x squared plus four x plus one. This parabola only TOUCHES the Ox line, it does not cross it.'),
    A('why',
      "6-darsda ikkita HAR XIL ildiz bo'lgan hollarni ko'rgan edingiz. Bu safar boshqacha: bitta, takroriy ildiz.",
      'На 6 уроке ты видел случаи с двумя РАЗНЫМИ корнями. На этот раз иначе: один, повторяющийся корень.',
      'In lesson 6 you saw cases with two DIFFERENT roots. This time it is different: one, repeated root.'),
  ],
  props: {
    askClass: 'g9-ask-big',
    cardsClass: 'g9-cards-small',
    ask: L(
      "Parabola Ox ga faqat tegsa, u nechta nuqtada umumiy nuqtaga ega?",
      'Если парабола только касается Ox, сколько у неё общих точек с осью?',
      'If a parabola only touches Ox, how many points does it have in common with the axis?',
    ),
    items: [
      { id: 'right', right: true, show: L('Bitta', 'Одну', 'One') },
      {
        id: 'wrong',
        show: L('Ikkita, xuddi doimgidek', 'Две, как обычно', 'Two, as usual'),
        hint: L(
          "\"Tegish\" kesishishdan farq qiladi: tegishda grafik chiziqqa yaqinlashadi va orqaga qaytadi, uni kesib o'tmaydi.",
          'Касание отличается от пересечения: график приближается к линии и возвращается назад, не пересекая её.',
          'Touching is different from crossing: the graph approaches the line and returns, without crossing it.',
        ),
      },
    ],
    after: L(
      "To'g'ri. Bitta nuqta. Bugun aynan shu holatda ishorani qanday o'qishni o'rganamiz.",
      'Верно. Одна точка. Сегодня разберём, как читать знак именно в этом случае.',
      'Correct. One point. Today we learn how to read the sign exactly in this case.',
    ),
  },
}

// ============================================================
// EKRAN 2. TAYANCH — diskriminant (Dars04dan tanish).
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "Diskriminantni eslash",
    'Вспоминаем дискриминант',
    'Recalling the discriminant',
  ),
  audio: [
    A('mount',
      "To'rt x kvadrat qo'shi to'rt x qo'shi bir tenglamasining diskriminantini hisoblang.",
      'Посчитай дискриминант уравнения четыре x в квадрате плюс четыре x плюс один.',
      'Compute the discriminant of the equation four x squared plus four x plus one.'),
    A('why',
      "D teng b kvadrat minus to'rt a c.",
      'D равен b в квадрате минус четыре a c.',
      'D equals b squared minus four a c.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('4x² + 4x + 1 = 0', '4x² + 4x + 1 = 0', '4x² + 4x + 1 = 0')}
      steps={[
        { id: 'd', head: 'D', lines: ['D = 4² − 4 · 4 · 1', 'D = 16 − 16 = 0'] },
      ]}
      ask={L(
        "Diskriminant nolga teng bo'lganda tenglamaning nechta ildizi bo'ladi?",
        'Сколько корней у уравнения, когда дискриминант равен нулю?',
        'How many roots does the equation have when the discriminant equals zero?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('Bitta', 'Один', 'One') },
        {
          id: 'wrong',
          label: L('Ikkita', 'Два', 'Two'),
          hint: L(
            "Ikkita ildiz faqat diskriminant musbat bo'lganda bo'ladi. Nolda ular bir nuqtaga qo'shilib ketadi.",
            'Два корня бывают только когда дискриминант положителен. При нуле они сливаются в одну точку.',
            'Two roots occur only when the discriminant is positive. At zero they merge into one point.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Diskriminant nol, demak bitta takroriy ildiz bor. Bugun buni ishlatamiz.",
        'Верно. Дискриминант равен нулю, значит есть один повторяющийся корень. Сегодня используем это.',
        'Correct. The discriminant is zero, so there is one repeated root. Today we use this.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — SignAxis: BITTA ILDIZ BILAN ISHLASH.
// ============================================================
const S3 = {
  eyebrow: L('BOSH ASBOB', 'ГЛАВНЫЙ ПРИБОР', 'THE MAIN TOOL'),
  title: L(
    "Bitta ildiz bilan ham asbob ishlaydi",
    'Прибор работает и с одним корнем',
    'The tool works with one root too',
  ),
  audio: [
    A('mount',
      "Bitta ildizni o'qqa qo'ying. Endi ikkita oraliq hosil bo'ladi, ikkalasi ham bir xil ishorada bo'lishi mumkin.",
      'Поставь один корень на ось. Теперь получатся два промежутка, оба могут быть с одним и тем же знаком.',
      'Place the one root on the axis. Now two intervals will form, and both may have the same sign.'),
    W('sign',
      "Eng o'ng oraliqni sonni qo'yib isbotlang, keyin chap oraliqni grafikdan o'qing.",
      'Докажи знак самого правого промежутка числом, потом прочитай левый с графика.',
      'Prove the sign of the rightmost interval with a number, then read the left one from the graph.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <SignAxis
      f={Q1}
      from={-2} to={1} yFrom={-1} yTo={9}
      roots={[-0.5]} strict target="gt"
      xLabel={L('x', 'x', 'x')} yLabel={L('y', 'y', 'y')}
      ask={L(
        "To'rt x kvadrat qo'shi to'rt x qo'shi bir musbat qachon: bitta ildizni qo'ying va oraliqlarni o'qing",
        'Когда четыре x в квадрате плюс четыре x плюс один положительно: поставь корень и прочитай промежутки',
        'When is four x squared plus four x plus one positive: place the root and read the intervals',
      )}
      after={L(
        "Ana xolos. Ikkala oraliq ham musbat, faqat urinish nuqtasining o'zi bo'yalmadi: javob bitta nuqtadan boshqa barcha son.",
        'Вот и всё. Оба промежутка положительны, не закрашена только сама точка касания: ответ все числа, кроме одной точки.',
        'That is all it takes. Both intervals are positive, only the touching point itself is not painted: the answer is all numbers except one point.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — XUDDI SHU FUNKSIYA, IKKI BOSHQA BELGI.
// ============================================================
const S4 = {
  eyebrow: L("YECHIM YO'Q YOKI HAMMA SON", 'РЕШЕНИЙ НЕТ ИЛИ ЛЮБОЕ ЧИСЛО', 'NO SOLUTION OR ALL NUMBERS'),
  title: L(
    "Belgi almashsa, javob ham butunlay boshqacha",
    'Если знак меняется, ответ совсем другой',
    'If the sign changes, the answer is completely different',
  ),
  audio: [
    A('mount',
      "Xuddi shu funksiya, endi kichik yoki teng, nol so'ralsa: to'rt x kvadrat qo'shi to'rt x qo'shi bir kichik yoki nolga teng.",
      'Та же функция, теперь спрашивается меньше или равно нулю: четыре x в квадрате плюс четыре x плюс один меньше или равно нулю.',
      'The same function, now less than or equal to zero is asked: four x squared plus four x plus one is less than or equal to zero.'),
    A('why',
      "Funksiya hech qachon manfiy bo'lmaydi, faqat urinish nuqtasida aynan nolga teng bo'ladi.",
      'Функция никогда не бывает отрицательной, только в точке касания она равна ровно нулю.',
      'The function is never negative, only at the touching point does it equal exactly zero.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('4x² + 4x + 1 ≤ 0', '4x² + 4x + 1 ≤ 0', '4x² + 4x + 1 ≤ 0')}
      steps={[
        { id: 'square', head: '4x² + 4x + 1', lines: ['(2x + 1)²'] },
      ]}
      ask={L(
        "Funksiya to'liq kvadrat ekan. U qachon nolga teng yoki undan kichik bo'ladi?",
        'Функция это полный квадрат. Когда она равна нулю или меньше?',
        'The function is a complete square. When is it equal to zero or less?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L("Faqat aynan nolga teng bo'lganda, ya'ni x minus nol butun beshda", 'Только когда равна ровно нулю, то есть при x равном минус нолю целых пяти', 'Only when it equals exactly zero, that is at x equal to minus zero point five'),
        },
        {
          id: 'wrong',
          label: L("Katta bir oraliqda, chiziq va grafikdagidek", 'На большом промежутке, как обычно на графике', 'On a large interval, as usual on the graph'),
          hint: L(
            "Kvadrat hech qachon manfiy bo'lmaydi: eng kichik qiymati nol, u ham faqat bitta nuqtada.",
            'Квадрат никогда не бывает отрицательным: наименьшее значение ноль, и оно достигается только в одной точке.',
            'A square is never negative: the smallest value is zero, and it happens only at one point.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Javob faqat bitta nuqta: x minus nol butun besh. Endi katta yoki teng, nol so'ralsa, javob BARCHA sonlar bo'ladi, chunki kvadrat hech qachon manfiy emas.",
        'Верно. Ответ только одна точка: x равен минус нолю целых пяти. А если спросить больше или равно нулю, ответом будут ВСЕ числа, ведь квадрат никогда не отрицателен.',
        'Correct. The answer is only one point: x equals minus zero point five. If greater than or equal to zero is asked instead, the answer is ALL numbers, since a square is never negative.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — NEGA URINISH NUQTASIDA ISHORA
// O'ZGARMAYDI.
// ============================================================
const S5 = {
  eyebrow: L('NEGA ALMASHMAYDI', 'ПОЧЕМУ НЕ МЕНЯЕТСЯ', 'WHY IT DOES NOT CHANGE'),
  title: L(
    "Urinish nuqtasi kesishishdan farq qiladi",
    'Точка касания отличается от пересечения',
    'A touching point is different from a crossing',
  ),
  audio: [
    A('mount',
      "6-darsda ikki HAR XIL ildizda ishora har safar almashardi. Bu yerda esa ildiz TAKRORIY: ikki marta bir xil nuqtada.",
      'На 6 уроке при двух РАЗНЫХ корнях знак каждый раз менялся. Здесь же корень ПОВТОРЯЕТСЯ: дважды в одной точке.',
      'In lesson 6, with two DIFFERENT roots, the sign flipped each time. Here the root REPEATS: twice at the same point.'),
    A('why',
      "To'rt x kvadrat qo'shi to'rt x qo'shi bir, ikki x qo'shi bir, butun kvadratga teng. Kvadrat ishorasi hech qachon manfiy bo'lmaydi, u faqat nolga teng bo'lib to'xtaydi va yana musbatga qaytadi.",
      'Четыре x в квадрате плюс четыре x плюс один равно двум x плюс один в полном квадрате. Знак квадрата никогда не отрицателен, он лишь останавливается на нуле и снова возвращается к положительному.',
      'Four x squared plus four x plus one equals two x plus one squared. The sign of a square is never negative, it only pauses at zero and returns to positive.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      steps={[]}
      ask={L(
        "Urinish nuqtasidan o'tganda ishora ikki marta almashadimi (kesishishdagidek) yoki umuman almashmaydimi?",
        'При переходе через точку касания знак меняется дважды (как при пересечении) или не меняется вовсе?',
        'When crossing the touching point, does the sign flip (as at a crossing) or not change at all?',
      )}
      cols={1}
      items={[
        { id: 'right', right: true, label: L("Umuman almashmaydi", 'Не меняется вовсе', 'Does not change at all') },
        {
          id: 'wrong',
          label: L('Har doimgidek almashadi', 'Меняется, как обычно', 'Changes, as usual'),
          hint: L(
            "3-ekranni eslang: ikkala oraliq ham musbat chiqdi. Ko'paytuvchi ikki marta takrorlangani uchun ishora ikki marta almashadi, ya'ni umuman almashmaydi.",
            'Вспомни 3 экран: оба промежутка оказались положительными. Так как множитель повторяется дважды, знак меняется дважды, то есть не меняется вовсе.',
            'Recall screen 3: both intervals came out positive. Since the factor repeats twice, the sign flips twice, that is, it does not change at all.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Takroriy ildizda ishora o'zgarmaydi: bu 6-darsdagi oddiy kesishishdan asosiy farq.",
        'Верно. В точке повторяющегося корня знак не меняется: это главное отличие от простого пересечения с 6 урока.',
        'Correct. At a repeated root the sign does not change: this is the main difference from the simple crossing in lesson 6.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — SignAxis: NOLTA ILDIZ (D < 0).
// ============================================================
const S6 = {
  eyebrow: L('ILDIZ UMUMAN YOQ', 'КОРНЕЙ ВООБЩЕ НЕТ', 'NO ROOTS AT ALL'),
  title: L(
    "Bu parabola Ox ni umuman kesmaydi",
    'Эта парабола вообще не пересекает Ox',
    'This parabola does not cross Ox at all',
  ),
  audio: [
    A('mount',
      "Yangi funksiya: y teng minus x kvadrat qo'shi x minus bir. Diskriminant manfiy, demak haqiqiy ildiz yo'q.",
      'Новая функция: y равен минус x в квадрате плюс x минус один. Дискриминант отрицателен, значит действительных корней нет.',
      'A new function: y equals minus x squared plus x minus one. The discriminant is negative, so there are no real roots.'),
    W('nointersect',
      "Ildiz yo'q, demak o'qqa qo'yiladigan hech narsa yo'q: to'g'ridan-to'g'ri sonni qo'yib butun grafikning ishorasini toping.",
      'Корней нет, значит нечего ставить на ось: сразу подставь число и найди знак всего графика.',
      'There are no roots, so there is nothing to place on the axis: substitute a number right away and find the sign of the whole graph.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <SignAxis
      f={Q2}
      from={-1.5} to={2.5} yFrom={-5} yTo={1}
      roots={[]} strict target="lt"
      xLabel={L('x', 'x', 'x')} yLabel={L('y', 'y', 'y')}
      ask={L(
        "Minus x kvadrat qo'shi x minus bir manfiy qachon: ildiz yo'qligini payqab, sonni qo'ying",
        'Когда минус x в квадрате плюс x минус один отрицательно: заметь, что корней нет, и подставь число',
        'When is minus x squared plus x minus one negative: notice there are no roots, and substitute a number',
      )}
      after={L(
        "Ana xolos. Butun grafik manfiy: bironta oraliq ajratilmaydi, javob barcha sonlar.",
        'Вот и всё. Весь график отрицателен: ни один промежуток не выделяется, ответ все числа.',
        'That is all it takes. The whole graph is negative: no interval stands apart, the answer is all numbers.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5 — XUDDI SHU FUNKSIYA, TESKARI BELGI:
// YECHIM YO'Q.
// ============================================================
const S7 = {
  eyebrow: L("YECHIM YO'Q", 'РЕШЕНИЙ НЕТ', 'NO SOLUTION'),
  title: L(
    "Endi teskari savol: bu safar yechim yo'q",
    'Теперь обратный вопрос: на этот раз решений нет',
    'Now the reverse question: this time there is no solution',
  ),
  audio: [
    A('mount',
      "Xuddi shu funksiya, endi musbat qachon deb so'ralsa: minus x kvadrat qo'shi x minus bir musbat qachon?",
      'Та же функция, теперь спрашивается, когда положительно: когда минус x в квадрате плюс x минус один положительно?',
      'The same function, now asking when it is positive: when is minus x squared plus x minus one positive?'),
    A('why',
      "6-ekranda butun grafik manfiy ekanini ko'rgan edingiz. Grafik hech qachon musbat bo'lishi mumkinmi?",
      'На 6 экране ты видел, что весь график отрицателен. Может ли график хоть где-то быть положительным?',
      'On screen 6 you saw that the whole graph is negative. Can the graph be positive anywhere at all?'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      steps={[]}
      ask={L(
        "Minus x kvadrat qo'shi x minus bir musbat bo'la oladigan x bormi?",
        'Есть ли x, при котором минус x в квадрате плюс x минус один положительно?',
        'Is there an x for which minus x squared plus x minus one is positive?',
      )}
      cols={1}
      items={[
        { id: 'right', right: true, label: L("Yo'q, bunday x yo'q", 'Нет, такого x нет', 'No, there is no such x') },
        {
          id: 'wrong',
          label: L("Ha, biror x bor", 'Да, какой-то x есть', 'Yes, some x exists'),
          hint: L(
            "6-ekranda topilgan edi: butun grafik manfiy, bironta nuqtada ham musbat emas.",
            'На 6 экране было найдено: весь график отрицателен, ни в одной точке не положителен.',
            'On screen 6 it was found: the whole graph is negative, not positive at any point.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Bu tengsizlikning yechimi yo'q: hech qanday x uni qanoatlantirmaydi.",
        'Верно. У этого неравенства нет решений: ни один x его не удовлетворяет.',
        'Correct. This inequality has no solution: no x satisfies it.',
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
    "Algebra 9, 7-§, 2-masala va 20-rasm (29-bet)",
    'Алгебра 9, §7, задача 2 и рис. 20 (стр. 29)',
    'Algebra 9, §7, problem 2 and fig. 20 (p. 29)',
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
          "Diskriminant manfiy bo'lsa, tengsizlik yechimi qanday bo'lishi mumkin?",
          'Если дискриминант отрицателен, каким может быть решение неравенства?',
          'If the discriminant is negative, what can the solution of the inequality be?',
        )}
        cols={1}
        items={[
          {
            id: 'right', right: true,
            label: L("Yoki barcha sonlar, yoki yechim umuman yo'q", 'Либо все числа, либо решений вообще нет', 'Either all numbers, or no solution at all'),
          },
          {
            id: 'wrong',
            label: L('Doim bitta oraliq', 'Всегда один промежуток', 'Always one interval'),
            hint: L(
              "6-7-ekranlarni eslang: butun grafik bir xil ishorada bo'lgani uchun javob yo yechim umuman yo'q, yoki barcha son edi, oraliq emas.",
              'Вспомни 6-7 экраны: так как весь график одного знака, ответом было либо решений нет, либо все числа, а не промежуток.',
              'Recall screens 6-7: since the whole graph is one sign, the answer was either no solution or all numbers, not an interval.',
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
    "Urinish, kesishmaslik va maxsus javoblar",
    'Касание, непересечение и особые ответы',
    'Tangency, non-intersection, and special answers',
  ),
  audio: [
    A('mount',
      "Olti ekranda siz takroriy ildizni, ildizsiz holatni va maxsus javoblarni o'z qo'lingiz bilan topdingiz. Endi ular qoida sifatida.",
      'На шести экранах ты сам находил повторяющийся корень, случай без корней и особые ответы. Теперь они в виде правила.',
      'On six screens you found the repeated root, the rootless case, and special answers with your own hands. Now here they are as a rule.'),
    W('card',
      "Qoida ochildi. Uchtasi ham darslikdan.",
      'Правило открылось. Все три из учебника.',
      'The rule is open. All three are from the textbook.'),
  ],
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
}

// ============================================================
// EKRAN 9. MASHQ — SignAxis TAKRORI: takroriy ildiz, teskari
// belgi. x²-6x+9<0, javob yo'q.
// ============================================================
// eslint-disable-next-line react-refresh/only-export-components
const Q3 = (x) => x * x - 6 * x + 9   // (x-3)², urinish x=3

const S9 = {
  eyebrow: L('TAKROR', 'ПОВТОР', 'REPEAT'),
  title: L(
    "Yana bitta ildiz, bu safar boshqa belgi",
    'Снова один корень, на этот раз другой знак',
    'One root again, this time a different sign',
  ),
  audio: [
    A('mount',
      "Yangi funksiya: x kvadrat minus olti x qo'shi to'qqiz, bu ham to'liq kvadrat. Bu safar manfiylik so'raladi.",
      'Новая функция: x в квадрате минус шесть x плюс девять, тоже полный квадрат. На этот раз спрашивается отрицательность.',
      'A new function: x squared minus six x plus nine, also a complete square. This time negativity is asked.'),
    A('why',
      "Kvadrat hech qachon manfiy bo'lmasligini eslang.",
      'Вспомни, что квадрат никогда не бывает отрицательным.',
      'Recall that a square is never negative.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <SignAxis
      f={Q3}
      from={0} to={6} yFrom={-1} yTo={9}
      roots={[3]} strict target="lt"
      xLabel={L('x', 'x', 'x')} yLabel={L('y', 'y', 'y')}
      ask={L(
        "X kvadrat minus olti x qo'shi to'qqiz manfiy qachon: ildizni qo'ying va tekshiring",
        'Когда x в квадрате минус шесть x плюс девять отрицательно: поставь корень и проверь',
        'When is x squared minus six x plus nine negative: place the root and check',
      )}
      after={L(
        "Ana xolos. Ikkala oraliq ham musbat chiqdi, hech qanday joy bo'yalmadi: bu tengsizlikning yechimi yo'q.",
        'Вот и всё. Оба промежутка оказались положительными, ничего не закрашено: у этого неравенства нет решений.',
        'That is all it takes. Both intervals came out positive, nothing is painted: this inequality has no solution.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 10. MASHQ — ZANJIR: diskriminant ishorasidan holatga.
// ============================================================
const S10 = {
  eyebrow: L('ZANJIR', 'ЦЕПОЧКА', 'THE CHAIN'),
  title: L(
    "Diskriminantdan holatga",
    'От дискриминанта к случаю',
    'From the discriminant to the case',
  ),
  audio: [
    A('mount',
      "To'rtta funksiya. Har birida diskriminantni hisoblab, nechta ildiz borligini ayting.",
      'Четыре функции. В каждой посчитай дискриминант и скажи, сколько корней.',
      'Four functions. In each, compute the discriminant and say how many roots there are.'),
    A('why',
      "D musbat, ikkita ildiz. D nol, bitta. D manfiy, nolta.",
      'D положителен, два корня. D равен нулю, один. D отрицателен, ноль.',
      'D positive, two roots. D zero, one. D negative, zero.'),
  ],
  props: {
    stepLabel: L('Funksiya', 'Функция', 'Function'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "To'rttasi ham aniqlandi. Diskriminantning ishorasi ildizlar sonini bevosita beradi.",
      'Все четыре определены. Знак дискриминанта напрямую даёт число корней.',
      'All four are determined. The sign of the discriminant directly gives the number of roots.',
    ),
    tasks: [
      {
        expr: 'x² − 8x + 16',
        question: L('Nechta ildiz?', 'Сколько корней?', 'How many roots?'),
        ok: L("Ha. D nolga teng, bitta takroriy ildiz.", 'Да. D равен нулю, один повторяющийся корень.', 'Yes. D equals zero, one repeated root.'),
        items: [
          { id: 'a', right: true, label: L('Bitta', 'Один', 'One') },
          { id: 'b', label: L('Ikkita', 'Два', 'Two'), hint: L("Diskriminantni hisoblang: minus sakkizning kvadrati oltmish to'rt, to'rt karra o'n olti ham oltmish to'rt, D nol chiqadi.", 'Посчитай дискриминант: квадрат минус восьми шестьдесят четыре, четыре на шестнадцать тоже шестьдесят четыре, D получается нулём.', 'Compute the discriminant: minus eight squared is sixty-four, four times sixteen is also sixty-four, D comes out zero.') },
        ],
        solution: ['D = 64 − 64 = 0', L('Bitta ildiz', 'Один корень', 'One root')],
      },
      {
        expr: 'x² + 2x + 5',
        question: L('Nechta ildiz?', 'Сколько корней?', 'How many roots?'),
        ok: L("Ha. D minus o'n oltiga teng, manfiy, ildiz yo'q.", 'Да. D равен минус шестнадцати, отрицательно, корней нет.', 'Yes. D equals minus sixteen, negative, no roots.'),
        items: [
          { id: 'a', right: true, label: L('Nolta', 'Ноль', 'Zero') },
          { id: 'b', label: L('Bitta', 'Один', 'One'), hint: L("Diskriminantni hisoblang: ikkining kvadrati to'rt, to'rt karra besh yigirma, to'rt minus yigirma manfiy chiqadi.", 'Посчитай дискриминант: квадрат двух четыре, четыре на пять двадцать, четыре минус двадцать получается отрицательным.', 'Compute the discriminant: two squared is four, four times five is twenty, four minus twenty comes out negative.') },
        ],
        solution: ['D = 4 − 20 = −16', L("Ildiz yo'q", 'Корней нет', 'No roots')],
      },
      {
        expr: 'x² − 5x + 6',
        question: L('Nechta ildiz?', 'Сколько корней?', 'How many roots?'),
        ok: L("Ha. D bir birga teng, musbat, ikkita ildiz.", 'Да. D равен единице, положителен, два корня.', 'Yes. D equals one, positive, two roots.'),
        items: [
          { id: 'a', right: true, label: L('Ikkita', 'Два', 'Two') },
          { id: 'b', label: L('Nolta', 'Ноль', 'Zero'), hint: L("Diskriminantni hisoblang: minus beshning kvadrati yigirma besh, to'rt karra olti yigirma to'rt, ayirma bir, musbat.", 'Посчитай дискриминант: квадрат минус пяти двадцать пять, четыре на шесть двадцать четыре, разность один, положительна.', 'Compute the discriminant: minus five squared is twenty-five, four times six is twenty-four, the difference one, is positive.') },
        ],
        solution: ['D = 25 − 24 = 1', L('Ikkita ildiz', 'Два корня', 'Two roots')],
      },
      {
        expr: '−x² + 4x − 4',
        question: L('Nechta ildiz?', 'Сколько корней?', 'How many roots?'),
        ok: L("Ha. D nolga teng, bitta takroriy ildiz.", 'Да. D равен нулю, один повторяющийся корень.', 'Yes. D equals zero, one repeated root.'),
        items: [
          { id: 'a', right: true, label: L('Bitta', 'Один', 'One') },
          { id: 'b', label: L('Ikkita', 'Два', 'Two'), hint: L("A minus bir, b to'rt, c minus to'rt: to'rtning kvadrati o'n olti, to'rt karra minus bir karra minus to'rt ham o'n olti, D nol chiqadi.", 'a минус один, b четыре, c минус четыре: квадрат четырёх шестнадцать, четыре на минус один на минус четыре тоже шестнадцать, D получается нулём.', 'a is minus one, b is four, c is minus four: four squared is sixteen, four times minus one times minus four is also sixteen, D comes out zero.') },
        ],
        solution: ['D = 16 − 16 = 0', L('Bitta ildiz', 'Один корень', 'One root')],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ — QOG'OZDA: javob turini aniqlash.
// ============================================================
const S11 = {
  eyebrow: L('QOG\'OZDA', 'НА БУМАГЕ', 'ON PAPER'),
  title: L(
    "Faqat mantiq: javob qaysi turga kiradi",
    'Только логика: какой это тип ответа',
    'Just logic: which type of answer is this',
  ),
  audio: [
    A('mount',
      "Har savolda parabolaning holati va so'ralgan belgi berilgan. Javob turini toping.",
      'В каждом вопросе даны положение параболы и нужный знак. Определи тип ответа.',
      'Each question gives the position of the parabola and the required sign. Find the type of answer.'),
    A('why',
      "Parabola tarmoqlari qayerga qaraganini va Ox bilan aloqasini eslang.",
      'Вспомни, куда направлены ветви параболы и как она связана с Ox.',
      'Recall where the branches of the parabola point and how it relates to Ox.'),
  ],
  props: {
    stepLabel: L('Savol', 'Вопрос', 'Question'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham aniqlandi: parabolaning holati va so'ralgan belgi javob turini to'liq belgilaydi.",
      'Все три определены: положение параболы и нужный знак полностью определяют тип ответа.',
      'All three are determined: the position of the parabola and the required sign fully determine the type of answer.',
    ),
    tasks: [
      {
        expr: 'y > 0',
        question: L(
          "Butun grafik doim noldan katta (tarmoqlari yuqoriga, Ox ni kesmaydi). Manfiylik so'ralsa, javob qanday bo'ladi?",
          'Весь график всегда больше нуля (ветви вверх, не пересекает Ox). Если спросить отрицательность, каким будет ответ?',
          'The whole graph is always greater than zero (branches up, does not cross Ox). If negativity is asked, what will the answer be?',
        ),
        ok: L("Ha. Grafik hech qachon Ox dan pastga tushmaydi, demak manfiy bo'lmaydi.", 'Да. График никогда не опускается ниже Ox, значит не бывает отрицательным.', 'Yes. The graph never dips below Ox, so it is never negative.'),
        items: [
          { id: 'a', right: true, label: L("Yechim yo'q", 'Решений нет', 'No solution') },
          { id: 'b', label: L('Barcha sonlar', 'Все числа', 'All numbers'), hint: L("Grafik butunlay yuqorida, hech qachon manfiy bo'lmaydi: manfiylikni so'ragan tengsizlikning yechimi yo'q.", 'График весь наверху, никогда не отрицателен: у неравенства про отрицательность решений нет.', 'The graph is entirely above, never negative: the inequality asking for negative has no solution.') },
        ],
        solution: [
          L('Grafik doim musbat', 'График всегда положителен', 'The graph is always positive'),
          L("Manfiylik so'ralsa: yechim yo'q", 'Если спрошена отрицательность: решений нет', 'If negativity is asked: no solution'),
        ],
      },
      {
        expr: 'y > 0',
        question: L(
          "Xuddi shu grafik: tarmoqlari yuqoriga, doim noldan katta. Musbatlik so'ralsa, javob qanday bo'ladi?",
          'Тот же график: ветви вверх, всегда больше нуля. Если спросить положительность, каким будет ответ?',
          'The same graph: branches up, always greater than zero. If positivity is asked, what will the answer be?',
        ),
        ok: L("Ha. Grafik hamma joyda musbat, demak har qanday x mos keladi.", 'Да. График везде положителен, значит подходит любой x.', 'Yes. The graph is positive everywhere, so any x fits.'),
        items: [
          { id: 'a', right: true, label: L('Barcha sonlar', 'Все числа', 'All numbers') },
          { id: 'b', label: L("Yechim yo'q", 'Решений нет', 'No solution'), hint: L("Grafik butunlay yuqorida, demak har doim musbat: musbatlikni so'ragan tengsizlikni har qanday x qanoatlantiradi.", 'График весь наверху, значит всегда положителен: неравенству про положительность удовлетворяет любой x.', 'The graph is entirely above, so it is always positive: any x satisfies the inequality asking for positive.') },
        ],
        solution: [
          L('Grafik doim musbat', 'График всегда положителен', 'The graph is always positive'),
          L("Musbatlik so'ralsa: barcha sonlar", 'Если спрошена положительность: все числа', 'If positivity is asked: all numbers'),
        ],
      },
      {
        expr: 'y ≤ 0',
        question: L(
          "Bitta urinish nuqtasi, tarmoqlari pastga: grafik doim noldan kichik yoki teng. Katta yoki teng, nol so'ralsa, javob qanday bo'ladi?",
          'Одна точка касания, ветви вниз: график всегда меньше или равен нулю. Если спросить больше или равно нулю, каким будет ответ?',
          'One touching point, branches down: the graph is always less than or equal to zero. If greater than or equal to zero is asked, what will the answer be?',
        ),
        ok: L("Ha. Tarmoqlari pastga bo'lgani uchun grafik doim manfiy yoki nolga teng, faqat urinish nuqtasida nolga yetadi.", 'Да. Так как ветви вниз, график всегда отрицателен или равен нулю, нуля достигает только в точке касания.', 'Yes. Since the branches point down, the graph is always negative or zero, reaching zero only at the touching point.'),
        items: [
          { id: 'a', right: true, label: L('Faqat urinish nuqtasining o\'zi', 'Только сама точка касания', 'Only the touching point itself') },
          { id: 'b', label: L('Barcha sonlar', 'Все числа', 'All numbers'), hint: L("Tarmoqlari pastga qaragan, demak grafik urinish nuqtasidan tashqari hamma joyda manfiy, nolga faqat bitta nuqtada teng.", 'Ветви направлены вниз, значит график везде, кроме точки касания, отрицателен, нулю равен только в одной точке.', 'The branches point down, so the graph is negative everywhere except the touching point, equal to zero only at one point.') },
        ],
        solution: [
          L('Tarmoqlar pastga, urinish nuqtasida nol', 'Ветви вниз, в точке касания нуль', 'Branches down, zero at the touching point'),
          L('Javob: faqat shu nuqta', 'Ответ: только эта точка', 'Answer: only this point'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ. Bekzod urinish nuqtasida ishorani almashtirgan.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Urinish nuqtasida ishorani almashtirish",
    'Смена знака в точке касания',
    'Flipping the sign at the touching point',
  ),
  audio: [
    A('mount',
      "Bekzodning yechimi. X kvadrat minus to'rt x qo'shi to'rt funksiyasi uchun u ildiz ikki ekanini topdi va chapda minus, o'ngda plyus deb yozdi, xuddi 6-darsdagi oddiy kesishishdagidek.",
      'Решение Бекзода. Для функции x в квадрате минус четыре x плюс четыре он нашёл корень два и записал слева минус, справа плюс, как при обычном пересечении с 6 урока.',
      "Bekzod's solution. For the function x squared minus four x plus four he found the root two and wrote minus on the left, plus on the right, as at an ordinary crossing from lesson 6."),
    A('why',
      "Bu funksiyani ko'paytuvchilarga ajrating: u to'liq kvadratmi?",
      'Разложи эту функцию на множители: это полный квадрат?',
      'Factor this function: is it a complete square?'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L("TO'G'RI YECHIM", 'ВЕРНОЕ РЕШЕНИЕ', 'CORRECT SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Funksiya to'liq kvadrat ekan, demak Bekzodning ishora almashtirishi xato: ikkala tomonda ham ishora bir xil, musbat.",
      'Функция оказалась полным квадратом, значит смена знака у Бекзода ошибочна: с обеих сторон знак одинаков, положителен.',
      "The function turned out to be a complete square, so Bekzod's sign flip is wrong: on both sides the sign is the same, positive.",
    ),
    tasks: [
      {
        expr: 'x² − 4x + 4',
        question: L(
          "Bekzod chapda minus, o'ngda plyus deb yozdi. Bu funksiyani ko'paytuvchilarga ajrating: u to'liq kvadratmi?",
          'Бекзод записал слева минус, справа плюс. Разложи эту функцию на множители: это полный квадрат?',
          'Bekzod wrote minus on the left, plus on the right. Factor this function: is it a complete square?',
        ),
        ok: L(
          "Ha, to'liq kvadrat. X minus ikki butun kvadratga teng, demak ikkala tomonda ham ishora bir xil, musbat, Bekzodniki xato.",
          'Да, полный квадрат. Равна x минус два в полном квадрате, значит с обеих сторон знак одинаков, положителен, у Бекзода ошибка.',
          "Yes, a complete square. It equals x minus two squared, so on both sides the sign is the same, positive, Bekzod's is wrong.",
        ),
        items: [
          {
            id: 'a', right: true,
            label: L("Ha, to'liq kvadrat, ishora ikkala tomonda ham bir xil", 'Да, полный квадрат, знак с обеих сторон одинаков', 'Yes, a complete square, the sign is the same on both sides'),
          },
          {
            id: 'b',
            label: L("Yo'q, Bekzod to'g'ri yozgan", 'Нет, Бекзод записал верно', 'No, Bekzod wrote it correctly'),
            hint: L("Ko'paytuvchilarga ajrating: x minus ikki, x minus ikki. Ikkala ko'paytuvchi ham bir xil, bu to'liq kvadrat.", 'Разложи на множители: x минус два, x минус два. Оба множителя одинаковы, это полный квадрат.', 'Factor it: x minus two, x minus two. Both factors are the same, this is a complete square.'),
          },
        ],
        solution: [
          'x² − 4x + 4 = (x − 2)²',
          L('Ikkala tomonda ham ishora bir xil', 'Знак с обеих сторон одинаковый', 'The sign is the same on both sides'),
          L("To'g'ri: ikkalasi ham musbat", 'Верно: оба положительны', 'Correct: both are positive'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TESKARI TOPSHIRIQ — javobdan holatga.
// ============================================================
const S13 = {
  eyebrow: L('TESKARI', 'ОБРАТНОЕ', 'THE REVERSE'),
  title: L(
    "Javobdan holatga",
    'От ответа к случаю',
    'From the answer to the case',
  ),
  audio: [
    A('mount',
      "Bu safar boshqa tomondan: javob berilgan, qaysi funksiya va belgi shu javobni berishini siz tanlaysiz.",
      'На этот раз наоборот: дан ответ, а какая функция и знак его дают, выбираешь ты.',
      'This time it is the other way round: the answer is given, you choose which function and sign give it.'),
    A('why',
      "Har bir nomzodda diskriminantni va tarmoqlar yo'nalishini tekshiring.",
      'В каждом кандидате проверяй дискриминант и направление ветвей.',
      'In each candidate, check the discriminant and the direction of the branches.',
    ),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Topildi: javobdan orqaga qaytib, mos holatni tanlash ham xuddi shu qoidaga tayanadi.",
      'Найдено: путь от ответа назад к случаю опирается на то же самое правило.',
      'Found: going backward from the answer to the case relies on the same rule.',
    ),
    tasks: [
      {
        expr: 'y = ?',
        question: L(
          "Javob \"barcha sonlar\": qaysi tengsizlik shu javobni beradi?",
          'Ответ все числа: какое неравенство даёт такой ответ?',
          'The answer is "all numbers": which inequality gives this answer?',
        ),
        ok: L("Ha. Diskriminant manfiy, tarmoqlari yuqoriga, demak grafik doim musbat.", 'Да. Дискриминант отрицателен, ветви вверх, значит график всегда положителен.', 'Yes. The discriminant is negative, branches up, so the graph is always positive.'),
        items: [
          { id: 'a', right: true, label: 'x² + x + 1 > 0' },
          { id: 'b', label: 'x² + x + 1 < 0', hint: L("Tarmoqlari yuqoriga qaragan parabola doim musbat bo'ladi, hech qachon manfiy emas: kichiklikni so'ragan tengsizlikning yechimi yo'q bo'lardi.", 'Парабола с ветвями вверх всегда положительна, никогда не отрицательна: у неравенства про меньше решений бы не было.', 'A parabola with branches up is always positive, never negative: the inequality asking for less would have no solution.') },
        ],
        solution: ['D = 1 − 4 = −3 < 0', L('Tarmoqlar yuqoriga: doim musbat', 'Ветви вверх: всегда положителен', 'Branches up: always positive')],
      },
      {
        expr: 'y = ?',
        question: L(
          "Javob \"yechim yo'q\": qaysi tengsizlik shu javobni beradi?",
          'Ответ решений нет: какое неравенство даёт такой ответ?',
          'The answer is "no solution": which inequality gives this answer?',
        ),
        ok: L("Ha. Diskriminant manfiy, tarmoqlari yuqoriga, grafik doim musbat, manfiylikka yechim yo'q.", 'Да. Дискриминант отрицателен, ветви вверх, график всегда положителен, для отрицательности решений нет.', 'Yes. The discriminant is negative, branches up, the graph is always positive, no solution for negativity.'),
        items: [
          { id: 'a', right: true, label: 'x² + x + 1 < 0' },
          { id: 'b', label: 'x² + x + 1 > 0', hint: L("Grafik doim musbat bo'lgani uchun musbatlikni so'ragan tengsizlikka har qanday x mos keladi, yechim yo'q emas.", 'Так как график всегда положителен, неравенству про положительность подходит любой x, решений не мало.', 'Since the graph is always positive, any x fits the inequality asking for positive, that is not "no solution".') },
        ],
        solution: [
          L('D = −3 < 0, tarmoqlar yuqoriga', 'D = −3 < 0, ветви вверх', 'D = −3 < 0, branches up'),
          L("Manfiylikka: yechim yo'q", 'Для отрицательности: решений нет', 'For negativity: no solution'),
        ],
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
    "Blits: diskriminant, urinish, maxsus javob",
    'Блиц: дискриминант, касание, особый ответ',
    'Blitz: discriminant, tangency, special answer',
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
        tag: 'ikkita-ildiz-deb-oylash',
        ask: L(
          "Har qanday kvadrat tengsizlikda ikkita har xil ildiz bo'lishi shartmi?",
          'Обязательно ли в любом квадратном неравенстве два разных корня?',
          'Must every quadratic inequality have two different roots?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'yes', label: L('Ha', 'Да', 'Yes') },
        ],
        ok: L(
          "To'g'ri. Diskriminantga qarab bitta yoki nolta ildiz ham bo'lishi mumkin.",
          'Верно. В зависимости от дискриминанта может быть один корень или ни одного.',
          'Correct. Depending on the discriminant there can be one root or none.',
        ),
        hint: L(
          "1-ekranni eslang: bu darsning o'zi aynan bitta ildiz bo'lgan holatdan boshlandi.",
          'Вспомни 1 экран: сам этот урок начался именно со случая с одним корнем.',
          'Recall screen 1: this very lesson began exactly with the case of one root.',
        ),
      },
      {
        id: 'q2',
        tag: 'urinish-notogri-oqish',
        ask: L(
          "Takroriy ildizdan (urinish nuqtasidan) o'tganda ishora almashadimi?",
          'При переходе через повторяющийся корень (точку касания) знак меняется?',
          'When crossing a repeated root (a touching point), does the sign flip?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'yes', label: L('Ha', 'Да', 'Yes') },
        ],
        ok: L(
          "To'g'ri. Urinish nuqtasida ishora bir xil qoladi, chunki bu to'liq kvadratning nolga tenglashishi.",
          'Верно. В точке касания знак остаётся одинаковым, ведь это обнуление полного квадрата.',
          'Correct. At a touching point the sign stays the same, since it is a complete square reaching zero.',
        ),
        hint: L(
          "5-ekranni eslang: to'liq kvadrat hech qachon manfiy bo'lmaydi, faqat nolga tegib qaytadi.",
          'Вспомни 5 экран: полный квадрат никогда не бывает отрицательным, только касается нуля и возвращается.',
          'Recall screen 5: a complete square is never negative, it only touches zero and returns.',
        ),
      },
      {
        id: 'q3',
        tag: 'diskriminant-manfiy-holati',
        ask: L(
          "Diskriminant manfiy bo'lsa, parabola Ox ni kesishi mumkinmi?",
          'Если дискриминант отрицателен, может ли парабола пересечь Ox?',
          'If the discriminant is negative, can the parabola cross Ox?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'yes', label: L('Ha', 'Да', 'Yes') },
        ],
        ok: L(
          "To'g'ri. Diskriminant manfiy bo'lsa, haqiqiy ildiz yo'q, demak Ox bilan umuman umumiy nuqta yo'q.",
          'Верно. При отрицательном дискриминанте действительных корней нет, значит общих точек с Ox вообще нет.',
          'Correct. With a negative discriminant there are no real roots, so there are no common points with Ox at all.',
        ),
        hint: L(
          "6-ekranni eslang: butun grafik Ox dan pastda yoki yuqorida qoldi, hech qachon kesmadi.",
          'Вспомни 6 экран: весь график остался ниже или выше Ox, никогда не пересекал.',
          'Recall screen 6: the whole graph stayed below or above Ox, never crossing it.',
        ),
      },
      {
        id: 'q4',
        tag: 'yechim-yoq-yoki-hamma-son',
        ask: L(
          "Grafik butunlay Ox dan yuqorida, musbatlik so'ralsa, javob qanday bo'ladi?",
          'График весь выше Ox, спрошена положительность, каким будет ответ?',
          'The graph is entirely above Ox, positivity is asked, what will the answer be?',
        ),
        options: [
          { id: 'all', right: true, label: L('Barcha sonlar', 'Все числа', 'All numbers') },
          { id: 'none', label: L("Yechim yo'q", 'Решений нет', 'No solution') },
        ],
        ok: L(
          "To'g'ri. Grafik hamma joyda musbat, demak har qanday x tengsizlikni qanoatlantiradi.",
          'Верно. График везде положителен, значит любой x удовлетворяет неравенству.',
          'Correct. The graph is positive everywhere, so any x satisfies the inequality.',
        ),
        hint: L(
          "7-ekranni eslang: aynan shu holatda musbatlik so'ralganda javob barcha sonlar bo'lgan edi.",
          'Вспомни 7 экран: именно в этом случае при вопросе про положительность ответом были все числа.',
          'Recall screen 7: in exactly this case, when positivity was asked, the answer was all numbers.',
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
    "Urinish, kesmaslik, maxsus javoblar",
    'Касание, непересечение, особые ответы',
    'Tangency, non-crossing, special answers',
  ),
  audio: [
    A('s0',
      "Birinchi ekranda parabola faqat tegsa nechta umumiy nuqta borligini taxmin qildingiz. Bugun aynan shu holatni va yana bir maxsus holatni to'liq egalladingiz.",
      'На первом экране ты предположил, сколько общих точек, если парабола только касается. Сегодня ты полностью освоил именно этот случай и ещё один особый случай.',
      'On the first screen you guessed how many common points there are if a parabola only touches. Today you fully mastered exactly this case and one more special case.'),
    A('s1',
      "Siz takroriy ildizda ishora o'zgarmasligini, diskriminant manfiy bo'lganda ildiz umuman yo'qligini va \"yechim yo'q\" bilan \"barcha sonlar\" javoblarini ajratishni o'rgandingiz.",
      'Ты освоил то, что в повторяющемся корне знак не меняется, что при отрицательном дискриминанте корней вообще нет, и как отличать ответы решений нет и все числа.',
      'You learned that the sign does not change at a repeated root, that with a negative discriminant there are no roots at all, and how to tell apart "no solution" and "all numbers".'),
    A('s2',
      "Keyingi darsda oraliqlar usuli: ko'proq ko'paytuvchidan tuzilgan tengsizliklar yechiladi.",
      'В следующем уроке метод интервалов: решаются неравенства из нескольких множителей.',
      'The next lesson covers the interval method: inequalities made of several factors are solved.'),
  ],
  props: {
    mark: '(2x + 1)² ≥ 0',
    markNote: L(
      "kvadrat hech qachon manfiy emas",
      'квадрат никогда не отрицателен',
      'a square is never negative',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      "Keyingi dars: oraliqlar usuli",
      'Следующий урок: метод интервалов',
      'Next lesson: the interval method',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     tool: 'pick', ...S1 },
  { role: 'support',  tag: 'ikkita-ildiz-deb-oylash', ...S2 },
  { role: 'explain',  tag: 'urinish-notogri-oqish', ...S3 },
  { role: 'explain',  tag: 'yechim-yoq-yoki-hamma-son', ...S4 },
  { role: 'explain',  tag: 'urinish-notogri-oqish', ...S5 },
  { role: 'explain',  tag: 'diskriminant-manfiy-holati', ...S6 },
  { role: 'explain',  tag: 'yechim-yoq-yoki-hamma-son', ...S7 },
  { role: 'rule',     tag: 'diskriminant-manfiy-holati', ...S8 },
  { role: 'practice', tool: 'signaxis', tag: 'urinish-notogri-oqish', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'ikkita-ildiz-deb-oylash', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'yechim-yoq-yoki-hamma-son', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'urinish-notogri-oqish', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'diskriminant-manfiy-holati', ...S13 },
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
