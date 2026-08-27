// ============================================================================
// 9-sinf, Dars 12. QO'SHISH USULI.
//
// REDAKSIYA 1, 2026-08-27. Darslik: II bob, 14-§, 1-masala (72-bet) — bosh
// misol: x qo'shi y qo'shi ikki xy teng o'n, x qo'shi y minus ikki xy teng
// minus ikki. Ikkala tenglamada ikki xy qarama-qarshi ishorada turgani
// uchun qo'shilganda yo'qoladi: ikki x qo'shi ikki y teng sakkiz, x qo'shi
// y teng to'rt. Shu yerdan y to'rt minus x deb ifodalanadi va ikkinchi
// tenglamaga qo'yiladi — Dars11dagi o'rniga qo'yish texnikasi bilan
// YAKUNLANADI: qo'shish usuli ko'pincha o'rniga qo'yish bilan tugaydi.
//
// ASBOB: RecallMC (Dars09, Dars11dagi qaror bilan bir xil) — darslik
// yozma hisob beradi, amal menyusi emas.
//
// TEGLAR (o'zining):
//   qoshish-orqali-yoqotish-notogri — qo'shishda qaysi had yo'qolishini
//                                    noto'g'ri aniqlash yoki ishora xatosi
//   yigindini-yakuniy-javob-deb-olish — x qo'shi y topilgach, buni
//                                    yakuniy javob deb qabul qilish
//   orniga-qoyishni-unutish        — x qo'shi y topilgach, ikkinchi
//                                    tenglamaga qo'yishni unutish
//   faqat-bitta-yechim-yozish      — ikkita yechimdan faqat bittasini
//                                    yozish
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { L, MATH_FONT, RuleCard, useT } from '../grade8/core.jsx'
import { A, W, makeLesson } from '../grade8/screens.jsx'
import { G9_RECOLOR, G9_STYLES, RecallMC } from './asboblar.jsx'

export const META = {
  id: 'grade9-12',
  n: 12,
  row: 12,
  block: 'Б2',
  topic: L("Qo'shish usuli", 'Способ сложения', 'The addition method'),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "Qo'shish usulida ikkala tenglama qo'shiladi: agar bir had qarama-qarshi ishorada bo'lsa, u yo'qoladi va yangi, soddaroq tenglama hosil bo'ladi",
    'В способе сложения оба уравнения складываются: если одно слагаемое стоит с противоположными знаками, оно исчезает, и получается новое, более простое уравнение',
    'In the addition method, both equations are added: if one term has opposite signs, it disappears, and a new, simpler equation is obtained',
  ),
  L(
    "Qo'shishdan keyin topilgan natija (masalan, x qo'shi y) hali yakuniy javob emas, u yana bir tenglamaga qo'yiladi",
    'Результат, найденный после сложения (например, x плюс y), это ещё не окончательный ответ, его подставляют ещё в одно уравнение',
    'The result found after adding (for example, x plus y) is not yet the final answer, it is substituted into one more equation',
  ),
  L(
    "Kvadrat tenglamaning ikkita ildizi bo'lsa, sistemaning odatda ikkita yechimi bo'ladi, ikkalasi ham yoziladi",
    'Если квадратное уравнение имеет два корня, у системы обычно два решения, записываются оба',
    'If the quadratic equation has two roots, the system usually has two solutions, both are written down',
  ),
]

export const MISS = {
  'qoshish-orqali-yoqotish-notogri': {
    what: L(
      "qo'shishda qaysi had yo'qolishi noto'g'ri aniqlandi yoki ishora xatosi qilindi",
      'при сложении неверно определено, какое слагаемое исчезнет, или допущена ошибка в знаке',
      'it was determined incorrectly which term would disappear when adding, or a sign mistake was made',
    ),
    wrong: null,
    at: 0,
  },
  'yigindini-yakuniy-javob-deb-olish': {
    what: L(
      "x qo'shi y topilgach, bu yakuniy javob deb qabul qilindi",
      'после нахождения x плюс y это принято за окончательный ответ',
      'after finding x plus y, this was taken as the final answer',
    ),
    wrong: null,
    at: 0,
  },
  'orniga-qoyishni-unutish': {
    what: L(
      "x qo'shi y topilgach, ikkinchi tenglamaga qo'yish unutildi",
      'после нахождения x плюс y забыли подставить во второе уравнение',
      'after finding x plus y, substituting into the second equation was forgotten',
    ),
    wrong: null,
    at: 0,
  },
  'faqat-bitta-yechim-yozish': {
    what: L(
      "ikkita yechimdan faqat bittasi yozildi",
      'из двух решений записано только одно',
      'only one of the two solutions was written down',
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// EKRAN 1. XUK.
// ============================================================
const S1 = {
  eyebrow: L('QARAMA-QARSHI ISHORA', 'ПРОТИВОПОЛОЖНЫЕ ЗНАКИ', 'OPPOSITE SIGNS'),
  title: L(
    "Ikki xy bir tenglamada plyus, ikkinchisida minus",
    'Два xy в одном уравнении плюс, в другом минус',
    'Two xy is plus in one equation, minus in the other',
  ),
  audio: [
    A('mount',
      "Sistema: x qo'shi y qo'shi ikki xy teng o'n, x qo'shi y minus ikki xy teng minus ikki.",
      'Система: x плюс y плюс два xy равно десяти, x плюс y минус два xy равно минус двум.',
      'A system: x plus y plus two xy equals ten, x plus y minus two xy equals minus two.'),
    A('why',
      "Ikkala tenglamani qo'shsak, ikki xy lar bilan nima sodir bo'ladi?",
      'Если сложить оба уравнения, что произойдёт с двумя xy?',
      'If we add both equations, what happens to the two xy?'),
  ],
  props: {
    askClass: 'g9-ask-big',
    cardsClass: 'g9-cards-small',
    ask: L(
      "Ikkala tenglama qo'shilsa, ikki xy lar bilan nima bo'ladi?",
      'Если сложить оба уравнения, что случится с двумя xy?',
      'If both equations are added, what happens to the two xy?',
    ),
    items: [
      { id: 'right', right: true, show: L("Ular bir-birini yo'qotadi", 'Они уничтожают друг друга', 'They cancel each other') },
      {
        id: 'wrong',
        show: L("Ular qo'shilib to'rt xy bo'ladi", 'Они складываются и получается четыре xy', 'They add up to four xy'),
        hint: L(
          "Biri plyus ikki xy, ikkinchisi minus ikki xy: qo'shilganda plyus ikki minus ikki nolga teng, ular yo'qoladi.",
          'Одно плюс два xy, другое минус два xy: при сложении плюс два минус два равно нулю, они исчезают.',
          'One is plus two xy, the other is minus two xy: when added, plus two minus two equals zero, they vanish.',
        ),
      },
    ],
    after: L(
      "To'g'ri. Bugun aynan shu yo'qolishdan foydalanib sistemani soddalashtiramiz.",
      'Верно. Сегодня именно этим исчезновением упрощаем систему.',
      'Correct. Today we simplify the system by exactly this disappearance.',
    ),
  },
}

// ============================================================
// EKRAN 2. TAYANCH — o'xshash hadlarni qo'shish (7-sinfdan).
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "Qo'shishni eslash",
    'Вспоминаем сложение',
    'Recalling addition',
  ),
  audio: [
    A('mount',
      "Savol: plyus ikki xy va minus ikki xy qo'shilsa nima chiqadi?",
      'Вопрос: что получится, если сложить плюс два xy и минус два xy?',
      'Question: what happens when plus two xy and minus two xy are added?'),
    A('why',
      "Bir xil miqdor, qarama-qarshi ishorada: ular bir-birini aynan yo'qotadi.",
      'Одинаковая величина с противоположными знаками: они в точности уничтожают друг друга.',
      'The same quantity with opposite signs: they exactly cancel each other.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('2xy + (−2xy)', '2xy + (−2xy)', '2xy + (−2xy)')}
      steps={[
        { id: 'add', head: '2xy − 2xy', lines: ['0'] },
      ]}
      ask={L(
        "Plyus ikki xy va minus ikki xy qo'shilsa nechiga teng bo'ladi?",
        'Чему равна сумма плюс два xy и минус два xy?',
        'What does plus two xy plus minus two xy equal?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '0' },
        {
          id: 'wrong',
          label: '4xy',
          hint: L(
            "Ishoralarga qarang: biri plyus, biri minus, bir xil miqdorda. Ular qo'shilmaydi, bir-birini yo'q qiladi.",
            'Посмотри на знаки: один плюс, другой минус, одинаковая величина. Они не складываются, а уничтожают друг друга.',
            'Look at the signs: one plus, one minus, the same quantity. They do not add up, they cancel each other.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Qarama-qarshi ishorali bir xil hadlar qo'shilganda nolga aylanadi. Bugun buni butun tenglamalarga qo'llaymiz.",
        'Верно. Одинаковые слагаемые с противоположными знаками при сложении дают ноль. Сегодня применим это к целым уравнениям.',
        'Correct. Equal terms with opposite signs give zero when added. Today we apply this to whole equations.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — IKKALA TENGLAMANI QO'SHISH.
// ============================================================
const S3 = {
  eyebrow: L("QO'SHISH", 'СЛОЖЕНИЕ', 'ADDITION'),
  title: L(
    "Ikkala tenglamani hadma-had qo'shamiz",
    'Складываем оба уравнения почленно',
    'We add both equations term by term',
  ),
  audio: [
    A('mount',
      "X lar bilan x, y lar bilan y, ikki xy lar bilan ikki xy qo'shiladi.",
      'x складывается с x, y складывается с y, два xy складывается с два xy.',
      'x adds with x, y adds with y, two xy adds with two xy.'),
    W('cancel',
      "Ikki xy lar yo'qoladi, faqat x qo'shi y qatnashgan sodda tenglama qoladi.",
      'Два xy исчезают, остаётся простое уравнение только с x плюс y.',
      'The two xy disappear, a simple equation with only x plus y remains.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('x + y + 2xy = 10,  x + y − 2xy = −2', 'x + y + 2xy = 10,  x + y − 2xy = −2', 'x + y + 2xy = 10,  x + y − 2xy = −2')}
      steps={[
        { id: 'add', head: 'x + x,  y + y,  2xy − 2xy', lines: ['2x + 2y + 0 = 8'] },
        { id: 'simplify', head: '2x + 2y', lines: ['x + y = 4'] },
      ]}
      ask={L(
        "O'ng tomonda o'n va minus ikki qo'shilsa nechiga teng bo'ladi?",
        'Чему равна сумма десяти и минус двух справа?',
        'What does ten plus minus two equal on the right?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '8' },
        {
          id: 'wrong',
          label: '12',
          hint: L(
            "O'n minus ikkini ayirishga emas, qo'shishga o'xshaydi: o'n qo'shi minus ikki, sakkiz.",
            'Десять и минус два не вычитаются, а складываются: десять плюс минус два, восемь.',
            'Ten and minus two are not subtracted, they are added: ten plus minus two, eight.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Ikki x qo'shi ikki y sakkizga teng, ikkalasini ikkiga bo'lsak, x qo'shi y to'rtga teng.",
        'Верно. Два x плюс два y равно восьми, разделив обе части на два, x плюс y равно четырём.',
        'Correct. Two x plus two y equals eight, dividing both sides by two, x plus y equals four.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — YIGINDI HALI YAKUNIY JAVOB EMAS.
// ============================================================
const S4 = {
  eyebrow: L('HALI TUGAMADI', 'ЕЩЁ НЕ КОНЕЦ', 'NOT DONE YET'),
  title: L(
    "X qo'shi y to'rt, lekin bu javobmi",
    'x плюс y четыре, но это ответ?',
    'x plus y is four, but is that the answer',
  ),
  audio: [
    A('mount',
      "X qo'shi y to'rtga teng ekanini topdik. Lekin savol x va y ning ALOHIDA qiymatlarini so'ragan edi.",
      'Мы нашли, что x плюс y равно четырём. Но вопрос спрашивал ОТДЕЛЬНЫЕ значения x и y.',
      'We found that x plus y equals four. But the question asked for the SEPARATE values of x and y.'),
    A('why',
      "X qo'shi y to'rt, bu cheksiz ko'p juftlikka mos kelishi mumkin: bir va uch, ikki va ikki, nol va to'rt. Qaysi biri to'g'ri?",
      'x плюс y четыре, этому может соответствовать бесконечно много пар: один и три, два и два, ноль и четыре. Какая из них верна?',
      'x plus y is four, infinitely many pairs could fit this: one and three, two and two, zero and four. Which one is right?'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      steps={[]}
      ask={L(
        "X qo'shi y to'rtga teng ekanini bilib, x va y ning aniq qiymatlarini topish uchun yana nima kerak?",
        'Зная, что x плюс y равно четырём, что ещё нужно, чтобы найти точные значения x и y?',
        'Knowing x plus y equals four, what else is needed to find the exact values of x and y?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L("Buni asl tenglamalardan biriga qo'yish", 'Подставить это в одно из исходных уравнений', 'Substitute this into one of the original equations'),
        },
        {
          id: 'wrong',
          label: L("Hech narsa, to'rt yetarli javob", 'Ничего, четырёх достаточно', 'Nothing, four is enough'),
          hint: L(
            "X qo'shi y to'rt bo'lgan juftliklar juda ko'p: bir va uch, ikki va ikki va boshqalar. Qaysi biri sistemaga mos kelishini aniqlash kerak.",
            'Пар, где x плюс y равно четырём, очень много: один и три, два и два и другие. Нужно определить, какая подходит системе.',
            'There are many pairs where x plus y equals four: one and three, two and two, and others. It must be determined which fits the system.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. X qo'shi y to'rtni asl tenglamalardan biriga qo'yib, davom etamiz.",
        'Верно. Подставим x плюс y равно четырём в одно из исходных уравнений и продолжим.',
        'Correct. We substitute x plus y equals four into one of the original equations and continue.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — O'RNIGA QO'YISH (11-DARSDAN TANISH).
// ============================================================
const S5 = {
  eyebrow: L("O'RNIGA QO'YISH", 'ПОДСТАНОВКА', 'SUBSTITUTION'),
  title: L(
    "Endi 11-darsdagi yo'l bilan davom etamiz",
    'Теперь продолжаем путём с 11 урока',
    'Now we continue by the path from lesson 11',
  ),
  audio: [
    A('mount',
      "X qo'shi y to'rtdan y ni ifodalang: y teng to'rt minus x. Buni ikkinchi asl tenglamaga qo'ying.",
      'Из x плюс y равно четырём вырази y: y равен четыре минус x. Подставь это во второе исходное уравнение.',
      'From x plus y equals four, express y: y equals four minus x. Substitute this into the second original equation.'),
    W('reduce',
      "X qo'shi to'rt minus x minus ikki x, qavs, to'rt minus x, teng minus ikki: bu bitta x li tenglama.",
      'x плюс четыре минус x минус два x, скобка, четыре минус x, равно минус двум: это уравнение с одним x.',
      'x plus four minus x minus two x, bracket, four minus x, equals minus two: this is an equation with one x.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('x + y = 4,  x + y − 2xy = −2', 'x + y = 4,  x + y − 2xy = −2', 'x + y = 4,  x + y − 2xy = −2')}
      steps={[
        { id: 'y', head: 'y', lines: ['y = 4 − x'] },
        { id: 'sub', head: 'x + (4 − x) − 2x(4 − x)', lines: ['4 − 8x + 2x² = −2'] },
      ]}
      ask={L(
        "Sonlar tomonini soddalashtirsak, qaysi tenglama qoladi?",
        'Если упростить числовую часть, какое уравнение остаётся?',
        'Simplifying the numeric side, which equation remains?',
      )}
      cols={1}
      items={[
        { id: 'right', right: true, label: '2x² − 8x + 6 = 0' },
        {
          id: 'wrong',
          label: '2x² − 8x − 6 = 0',
          hint: L(
            "To'rtni narigi tomonga o'tkazing: minus ikki minus to'rt, minus olti emas, aksincha ishorani tekshiring: minus ikki minus to'rt teng minus olti, keyin ikkala tomonga minus olti qo'shiladi, natijada qo'shi olti chiqadi.",
            'Перенеси четвёрку на другую сторону: минус два минус четыре, проверь знак внимательно, в итоге получается плюс шесть.',
            'Move the four to the other side: minus two minus four, check the sign carefully, in the end you get plus six.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Ikkiga bo'lsak, x kvadrat minus to'rt x qo'shi uch teng nol qoladi, bu ham tanish tenglama.",
        'Верно. Разделив на два, остаётся x в квадрате минус четыре x плюс три равно нулю, тоже знакомое уравнение.',
        'Correct. Dividing by two, x squared minus four x plus three equals zero remains, also a familiar equation.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — TANISH TENGLAMA, IKKITA YECHIM.
// ============================================================
const S6 = {
  eyebrow: L('YANA TANISH', 'ОПЯТЬ ЗНАКОМОЕ', 'FAMILIAR AGAIN'),
  title: L(
    "Bu tenglama Dars04dan tanish",
    'Это уравнение знакомо с 4 урока',
    'This equation is familiar from lesson 4',
  ),
  audio: [
    A('mount',
      "X kvadrat minus to'rt x qo'shi uch teng nol. 4-darsda aynan shu tenglamani butun dars davomida ishlatgan edingiz.",
      'x в квадрате минус четыре x плюс три равно нулю. На 4 уроке ты использовал именно это уравнение весь урок.',
      'x squared minus four x plus three equals zero. In lesson 4 you used exactly this equation throughout the whole lesson.'),
    A('why',
      "Ildizlarini eslaysizmi? Bir va uch edi.",
      'Помнишь корни? Были один и три.',
      'Do you remember the roots? They were one and three.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('x² − 4x + 3 = 0', 'x² − 4x + 3 = 0', 'x² − 4x + 3 = 0')}
      steps={[
        { id: 'factor', head: 'x² − 4x + 3', lines: ['(x − 1)(x − 3) = 0'] },
        { id: 'roots', head: 'x', lines: ['x1 = 1,  x2 = 3'] },
      ]}
      ask={L(
        "X uchun ikkita qiymat topildi. Y ni topish uchun qaysi formuladan foydalanamiz?",
        'Найдены два значения x. Какой формулой находим y?',
        'Two values of x are found. Which formula do we use to find y?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: 'y = 4 − x' },
        {
          id: 'wrong',
          label: 'y = x − 4',
          hint: L(
            "5-ekranda y qanday ifodalanganini eslang: y to'rt minus x edi, x minus to'rt emas.",
            'Вспомни, как был выражен y на 5 экране: это было четыре минус x, а не x минус четыре.',
            'Recall how y was expressed on screen 5: it was four minus x, not x minus four.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Endi har bir x uchun y ni shu formuladan topamiz.",
        'Верно. Теперь для каждого x найдём y по этой формуле.',
        'Correct. Now for each x we find y by this formula.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5 — IKKITA YECHIMNI YOZISH.
// ============================================================
const S7 = {
  eyebrow: L('IKKITA YECHIM', 'ДВА РЕШЕНИЯ', 'TWO SOLUTIONS'),
  title: L(
    "Ikkala x uchun ham y ni topamiz",
    'Находим y для обоих x',
    'We find y for both x',
  ),
  audio: [
    A('mount',
      "X bir bo'lganda y to'rt minus bir, uch. X uch bo'lganda y to'rt minus uch, bir.",
      'При x равном одному y равен четыре минус один, три. При x равном трём y равен четыре минус три, один.',
      'When x equals one, y equals four minus one, three. When x equals three, y equals four minus three, one.'),
    A('why',
      "Ikkala juftlikni ham asl sistemaga qo'yib tekshiring.",
      'Проверь обе пары, подставив в исходную систему.',
      'Check both pairs by substituting into the original system.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('y = 4 − x', 'y = 4 − x', 'y = 4 − x')}
      steps={[
        { id: 'p1', head: 'x = 1', lines: ['y = 4 − 1 = 3'] },
        { id: 'p2', head: 'x = 3', lines: ['y = 4 − 3 = 1'] },
      ]}
      ask={L(
        "Sistemaning to'liq javobi qanday yoziladi?",
        'Как записать полный ответ системы?',
        'How is the full answer of the system written?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: '(1; 3)  ·  (3; 1)' },
        {
          id: 'wrong',
          label: '(1; 3)',
          hint: L(
            "Ikkinchi x qiymati, uch, ham o'z y sini beradi: bir. Ikkala juftlik ham yoziladi.",
            'Второе значение x, три, тоже даёт свой y: один. Записываются обе пары.',
            'The second x value, three, also gives its own y: one. Both pairs are written down.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Sistemaning ikkita yechimi bor: (bir; uch) va (uch; bir).",
        'Верно. У системы два решения: (один; три) и (три; один).',
        'Correct. The system has two solutions: (one; three) and (three; one).',
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
    "Algebra 9, 14-§, 1-masala (72-bet)",
    'Алгебра 9, §14, задача 1 (стр. 72)',
    'Algebra 9, §14, problem 1 (p. 72)',
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
          "Qo'shish usuli qachon ishlatiladi?",
          'Когда используется способ сложения?',
          'When is the addition method used?',
        )}
        cols={1}
        items={[
          {
            id: 'right', right: true,
            label: L("Ikkala tenglamada bir had qarama-qarshi ishorada bo'lsa", 'Когда в обоих уравнениях одно слагаемое стоит с противоположными знаками', 'When one term in both equations has opposite signs'),
          },
          {
            id: 'wrong',
            label: L('Har doim, har qanday sistemada', 'Всегда, в любой системе', 'Always, in any system'),
            hint: L(
              "1-ekranni eslang: aynan ikki xy ning ishoralari qarama-qarshi bo'lgani uchun qo'shish foydali bo'ldi. Bu holat har doim bo'lavermaydi.",
              'Вспомни 1 экран: сложение оказалось полезным именно потому, что знаки двух xy были противоположными. Так бывает не всегда.',
              'Recall screen 1: addition was useful exactly because the signs of the two xy were opposite. This is not always the case.',
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
    "Qo'shish, o'rniga qo'yish, ikkita javob",
    'Сложение, подстановка, два ответа',
    'Addition, substitution, two answers',
  ),
  audio: [
    A('mount',
      "Olti ekranda siz qo'shishni, o'rniga qo'yishni va ikkita javobni yozishni o'z qo'lingiz bilan bajardingiz. Endi ular qoida sifatida.",
      'На шести экранах ты сам складывал, подставлял и записывал два ответа. Теперь они в виде правила.',
      'On six screens you added, substituted, and wrote two answers with your own hands. Now here they are as a rule.'),
    W('card',
      "Qoida ochildi. Uchtasi ham darslikdan.",
      'Правило открылось. Все три из учебника.',
      'The rule is open. All three are from the textbook.'),
  ],
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
}

// ============================================================
// EKRAN 9. MASHQ — YO'NALTIRILGAN: yangi sistema, to'liq yechim.
// x + y² = 13, x − y² = 5.
// ============================================================
const S9 = {
  eyebrow: L('QADAMLAB', 'ПО ШАГАМ', 'STEP BY STEP'),
  title: L(
    "Yangi sistema: uch qadam",
    'Новая система: три шага',
    'A new system: three steps',
  ),
  audio: [
    A('mount',
      "Sistema: x qo'shi y kvadrat teng o'n uch, x minus y kvadrat teng besh. Uch qadam, yordam yo'q, lekin har javobdan keyin yechim ochiladi.",
      'Система: x плюс y в квадрате равно тринадцати, x минус y в квадрате равно пяти. Три шага, помощи нет, но после каждого ответа откроется решение.',
      'A system: x plus y squared equals thirteen, x minus y squared equals five. Three steps, no help, but after each answer the solution opens.'),
    A('why',
      "Y kvadratlar qarama-qarshi ishorada, qo'shishda ular yo'qoladi.",
      'y в квадрате стоят с противоположными знаками, при сложении они исчезнут.',
      'y squared has opposite signs, when adding they will disappear.'),
  ],
  props: {
    stepLabel: L('Qadam', 'Шаг', 'Step'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uch qadam ham to'ldi: qo'shildi, x topildi, y topildi.",
      'Все три шага пройдены: сложили, нашли x, нашли y.',
      'All three steps are done: added, x found, y found.',
    ),
    tasks: [
      {
        expr: 'x + y² = 13,  x − y² = 5',
        question: L('Qo\'shilgach qaysi tenglama hosil bo\'ladi?', 'Какое уравнение получается после сложения?', 'Which equation is obtained after adding?'),
        ok: L("Ha. Y kvadratlar yo'qoladi, ikki x qoladi, o'n uch qo'shi besh, o'n sakkiz.", 'Да. y в квадрате исчезают, остаётся два x, тринадцать плюс пять, восемнадцать.', 'Yes. y squared disappears, two x remains, thirteen plus five, eighteen.'),
        items: [
          { id: 'a', right: true, label: '2x = 18' },
          { id: 'b', label: '2x = 8', hint: L("O'ng tomonni qayta hisoblang: o'n uch va besh AYIRILMAYDI, QO'SHILADI.", 'Пересчитай правую часть: тринадцать и пять не ВЫЧИТАЮТСЯ, а СКЛАДЫВАЮТСЯ.', 'Recompute the right side: thirteen and five are not SUBTRACTED, they are ADDED.') },
        ],
        solution: ['2x + 0 = 13 + 5', '2x = 18', 'x = 9'],
      },
      {
        expr: 'x = 9,  x + y² = 13',
        question: L('Y kvadrat nechiga teng?', 'Чему равен y в квадрате?', 'What does y squared equal?'),
        ok: L("Ha. O'n uch minus to'qqiz to'rt.", 'Да. Тринадцать минус девять четыре.', 'Yes. Thirteen minus nine is four.'),
        items: [
          { id: 'a', right: true, label: '4' },
          { id: 'b', label: '22', hint: L("To'qqizni ko'chiring: y kvadrat o'n uch minus to'qqizga teng, qo'shilmaydi.", 'Перенеси девять: y в квадрате равно тринадцать минус девять, а не сумма.', 'Transpose nine: y squared equals thirteen minus nine, not a sum.') },
        ],
        solution: ['y² = 13 − 9', 'y² = 4'],
      },
      {
        expr: 'y² = 4',
        question: L('Sistemaning to\'liq javobi qanday yoziladi?', 'Как записать полный ответ системы?', 'How is the full answer of the system written?'),
        ok: L("Ha. Y ikki va minus ikki bo'ladi, x esa har doim to'qqiz.", 'Да. y равен двум и минус двум, а x всегда девять.', 'Yes. y equals two and minus two, while x is always nine.'),
        items: [
          { id: 'a', right: true, label: '(9; 2)  ·  (9; −2)' },
          { id: 'b', label: '(9; 2)', hint: L("Y kvadrat to'rtga teng bo'lganda y ikkita qiymat oladi: ikki va minus ikki, ikkalasi ham javobga kiradi.", 'Когда y в квадрате равен четырём, y принимает два значения: два и минус два, оба входят в ответ.', 'When y squared equals four, y takes two values: two and minus two, both belong to the answer.') },
        ],
        solution: ['y = 2 yoki y = −2', '(9; 2), (9; −2)'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ — ZANJIR: qo'shilganda nima yo'qoladi, to'rtta.
// ============================================================
const S10 = {
  eyebrow: L('ZANJIR', 'ЦЕПОЧКА', 'THE CHAIN'),
  title: L(
    "Tez aniqlash: nima yo'qoladi",
    'Быстро определяем: что исчезнет',
    'Quickly determining: what disappears',
  ),
  audio: [
    A('mount',
      "To'rtta juft tenglama. Har birida qo'shilganda qaysi had yo'qolishini toping.",
      'Четыре пары уравнений. В каждой определи, какое слагаемое исчезнет при сложении.',
      'Four pairs of equations. In each, find which term disappears when added.'),
    A('why',
      "Qarama-qarshi ishorali bir xil hadni qidiring.",
      'Ищи одинаковое слагаемое с противоположными знаками.',
      'Look for the same term with opposite signs.'),
  ],
  props: {
    stepLabel: L('Juft tenglama', 'Пара уравнений', 'Pair of equations'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "To'rttasi ham topildi. Har safar bir xil belgi: qarama-qarshi ishorali bir xil had.",
      'Все четыре найдены. Каждый раз один признак: одинаковое слагаемое с противоположными знаками.',
      'All four are found. Same sign every time: the same term with opposite signs.',
    ),
    tasks: [
      {
        expr: 'x² + 3y = 8,  x² − 3y = 2',
        question: L('Qo\'shilganda nima yo\'qoladi?', 'Что исчезнет при сложении?', 'What disappears when added?'),
        ok: L("Ha. Uch y bir tenglamada plyus, ikkinchisida minus.", 'Да. Три y в одном уравнении плюс, в другом минус.', 'Yes. Three y is plus in one equation, minus in the other.'),
        items: [
          { id: 'a', right: true, label: '3y' },
          { id: 'b', label: 'x²', hint: L("X kvadrat ikkala tenglamada ham bir xil ishorada, plyus: u yo'qolmaydi, qo'shiladi.", 'x в квадрате в обоих уравнениях с одним знаком, плюс: он не исчезает, а складывается.', 'x squared has the same sign, plus, in both equations: it does not disappear, it adds.') },
        ],
        solution: ['3y va −3y qarama-qarshi', '2x² = 10'],
      },
      {
        expr: '5x − y² = 4,  −5x − y² = −16',
        question: L('Qo\'shilganda nima yo\'qoladi?', 'Что исчезнет при сложении?', 'What disappears when added?'),
        ok: L("Ha. Besh x bir tenglamada plyus, ikkinchisida minus.", 'Да. Пять x в одном уравнении плюс, в другом минус.', 'Yes. Five x is plus in one equation, minus in the other.'),
        items: [
          { id: 'a', right: true, label: '5x' },
          { id: 'b', label: 'y²', hint: L("Y kvadrat ikkala tenglamada ham bir xil ishorada, minus: u yo'qolmaydi.", 'y в квадрате в обоих уравнениях с одним знаком, минус: он не исчезает.', 'y squared has the same sign, minus, in both equations: it does not disappear.') },
        ],
        solution: ['5x va −5x qarama-qarshi', '−2y² = −12'],
      },
      {
        expr: 'x + 2xy = 7,  x − 2xy = −1',
        question: L('Qo\'shilganda nima yo\'qoladi?', 'Что исчезнет при сложении?', 'What disappears when added?'),
        ok: L("Ha. Ikki xy bir tenglamada plyus, ikkinchisida minus.", 'Да. Два xy в одном уравнении плюс, в другом минус.', 'Yes. Two xy is plus in one equation, minus in the other.'),
        items: [
          { id: 'a', right: true, label: '2xy' },
          { id: 'b', label: 'x', hint: L("X ikkala tenglamada ham bir xil ishorada, plyus: u yo'qolmaydi.", 'x в обоих уравнениях с одним знаком, плюс: он не исчезает.', 'x has the same sign, plus, in both equations: it does not disappear.') },
        ],
        solution: ['2xy va −2xy qarama-qarshi', '2x = 6'],
      },
      {
        expr: '4y − x² = 9,  4y + x² = 9',
        question: L('Qo\'shilganda nima yo\'qoladi?', 'Что исчезнет при сложении?', 'What disappears when added?'),
        ok: L("Ha. X kvadrat bir tenglamada minus, ikkinchisida plyus.", 'Да. x в квадрате в одном уравнении минус, в другом плюс.', 'Yes. x squared is minus in one equation, plus in the other.'),
        items: [
          { id: 'a', right: true, label: 'x²' },
          { id: 'b', label: '4y', hint: L("To'rt y ikkala tenglamada ham bir xil ishorada, plyus: u yo'qolmaydi.", 'Четыре y в обоих уравнениях с одним знаком, плюс: он не исчезает.', 'Four y has the same sign, plus, in both equations: it does not disappear.') },
        ],
        solution: ['−x² va x² qarama-qarshi', '8y = 18'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ — QOG'OZDA: qo'shish va davomi.
// ============================================================
const S11 = {
  eyebrow: L('QOG\'OZDA', 'НА БУМАГЕ', 'ON PAPER'),
  title: L(
    "Faqat hisob: qo'shish va davomi",
    'Только счёт: сложение и продолжение',
    'Just computation: addition and its continuation',
  ),
  audio: [
    A('mount',
      "Har savol qo'shishning bir bosqichini so'raydi.",
      'Каждый вопрос спрашивает про один этап сложения.',
      'Each question asks about one stage of addition.'),
    A('why',
      "Avval nima yo'qolishini, keyin natijani, oxirida davomini hisoblang.",
      'Сначала посчитай, что исчезнет, потом результат, в конце продолжение.',
      'First compute what disappears, then the result, finally the continuation.'),
  ],
  props: {
    stepLabel: L('Savol', 'Вопрос', 'Question'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham hal bo'ldi: qo'shish, natija, va yakuniy javobga qadar davom etish.",
      'Все три решены: сложение, результат, и продолжение до окончательного ответа.',
      'All three are solved: addition, result, and continuing to the final answer.',
    ),
    tasks: [
      {
        expr: 'x² + y = 6,  x² − y = 2',
        question: L('Qo\'shilgach x kvadrat nechiga teng?', 'Чему равен x в квадрате после сложения?', 'What does x squared equal after adding?'),
        ok: L("Ha. Ikki x kvadrat sakkizga teng, x kvadrat to'rt.", 'Да. Два x в квадрате равно восьми, x в квадрате четыре.', 'Yes. Two x squared equals eight, x squared is four.'),
        items: [
          { id: 'a', right: true, label: '4' },
          { id: 'b', label: '8', hint: L("Ikki x kvadrat sakkizga teng chiqdi, x kvadratning o'zini topish uchun ikkiga bo'ling.", 'Два x в квадрате получилось равным восьми, чтобы найти сам x в квадрате, раздели на два.', 'Two x squared came out equal to eight, to find x squared itself, divide by two.') },
        ],
        solution: ['2x² = 8', 'x² = 4'],
      },
      {
        expr: 'x² = 4',
        question: L('X qanday qiymatlarni oladi?', 'Какие значения принимает x?', 'What values does x take?'),
        ok: L("Ha. Ikki va minus ikkining kvadrati ham to'rtga teng.", 'Да. Квадрат и двух, и минус двух равен четырём.', 'Yes. The square of both two and minus two equals four.'),
        items: [
          { id: 'a', right: true, label: '2  ·  −2' },
          { id: 'b', label: '4', hint: L("X kvadrat to'rt, x ning o'zi emas. Ildiz oling: ikki yoki minus ikki.", 'x в квадрате четыре, а не сам x. Извлеки корень: два или минус два.', 'x squared is four, not x itself. Take the root: two or minus two.') },
        ],
        solution: ['x = 2 yoki x = −2'],
      },
      {
        expr: 'x² + y = 6,  x = 2',
        question: L('Y nechiga teng?', 'Чему равен y?', 'What does y equal?'),
        ok: L("Ha. To'rt qo'shi y olti, y ikki.", 'Да. Четыре плюс y шесть, y равен двум.', 'Yes. Four plus y is six, y equals two.'),
        items: [
          { id: 'a', right: true, label: '2' },
          { id: 'b', label: '10', hint: L("Ikkining kvadratini hisoblang: to'rt. To'rt qo'shi y olti, y ni toping.", 'Посчитай квадрат двух: четыре. Четыре плюс y равно шести, найди y.', 'Compute the square of two: four. Four plus y equals six, find y.') },
        ],
        solution: ['2² + y = 6', '4 + y = 6', 'y = 2'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ. Sarvar x qo'shi y ni topib, shu bilan tugatgan.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Yarim yo'lda to'xtagan yechim",
    'Решение, остановленное на полпути',
    'A solution stopped halfway',
  ),
  audio: [
    A('mount',
      "Sarvarning yechimi. U x qo'shi y qo'shi uch xy teng o'n olti, x qo'shi y minus uch xy teng minus ikki sistemasini qo'shib, x qo'shi y to'rtga teng topdi va shu yerda to'xtadi, javob deb yozdi.",
      'Решение Сарвара. Он сложил систему x плюс y плюс три xy равно шестнадцати, x плюс y минус три xy равно минус двум, нашёл x плюс y равным четырём и остановился, записав это как ответ.',
      'Sarvar\'s solution. He added the system x plus y plus three xy equals sixteen, x plus y minus three xy equals minus two, found x plus y equals four, and stopped there, writing it as the answer.'),
    A('why',
      "X qo'shi y to'rt, bu haqiqatan ham x va y ning aniq qiymatlarini bildiradimi?",
      'x плюс y равно четырём, действительно ли это говорит о точных значениях x и y?',
      'x plus y equals four, does this really tell us the exact values of x and y?'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L("TO'G'RI YECHIM", 'ВЕРНОЕ РЕШЕНИЕ', 'CORRECT SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "X qo'shi y to'rt hali x va y ning aniq qiymatlarini bermaydi: buni asl tenglamalardan biriga qo'yib davom etish kerak edi.",
      'x плюс y равно четырём ещё не даёт точных значений x и y: нужно было подставить это в одно из исходных уравнений и продолжить.',
      "x plus y equals four does not yet give the exact values of x and y: it needed to be substituted into one of the original equations to continue.",
    ),
    tasks: [
      {
        expr: 'x + y + 3xy = 16,  x + y − 3xy = −2, Sarvar: x + y = 4',
        question: L(
          "Sarvarning javobi to'liqmi? X va y ning aniq qiymatlari ma'lummi?",
          'Полон ли ответ Сарвара? Известны ли точные значения x и y?',
          "Is Sarvar's answer complete? Are the exact values of x and y known?",
        ),
        ok: L(
          "Yo'q, to'liq emas. X qo'shi y to'rt bo'lgan cheksiz ko'p juftlik bor: bir va uch, ikki va ikki va h.k. Aniq javob uchun yana bir tenglamaga qo'yish kerak.",
          'Нет, не полон. Существует бесконечно много пар, где x плюс y равно четырём: один и три, два и два и так далее. Для точного ответа нужно подставить ещё в одно уравнение.',
          'No, not complete. There are infinitely many pairs where x plus y equals four: one and three, two and two, and so on. For the exact answer, one more equation is needed.',
        ),
        items: [
          {
            id: 'a', right: true,
            label: L("Yo'q, yana bir tenglamaga qo'yish kerak edi", 'Нет, нужно было подставить ещё в одно уравнение', 'No, it needed to be substituted into one more equation'),
          },
          {
            id: 'b',
            label: L("Ha, to'liq, Sarvar to'g'ri", 'Да, полон, Сарвар прав', 'Yes, complete, Sarvar is right'),
            hint: L("X qo'shi y to'rt bo'lgan juftliklar juda ko'p: bir-uch, ikki-ikki. Qaysi biri sistemaga mos kelishini bilmaymiz hali.", 'Пар, где x плюс y равно четырём, очень много: один-три, два-два. Мы ещё не знаем, какая подходит системе.', 'There are many pairs where x plus y equals four: one-three, two-two. We do not yet know which fits the system.'),
          },
        ],
        solution: [
          'x + y = 4 hali yakuniy emas',
          'y = 4 − x ni ikkinchi tenglamaga qo\'yish kerak',
          "To'liq javob uchun davom etiladi",
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TESKARI TOPSHIRIQ — javoblardan sistemaga.
// ============================================================
const S13 = {
  eyebrow: L('TESKARI', 'ОБРАТНОЕ', 'THE REVERSE'),
  title: L(
    "Javoblardan sistemaga",
    'От ответов к системе',
    'From the answers to the system',
  ),
  audio: [
    A('mount',
      "Bu safar boshqa tomondan: x qo'shi y ning qiymati berilgan, qaysi juft tenglama shu qiymatni berishini siz tanlaysiz.",
      'На этот раз наоборот: дано значение x плюс y, а какая пара уравнений его даёт, выбираешь ты.',
      'This time it is the other way round: the value of x plus y is given, you choose which pair of equations gives it.'),
    A('why',
      "Har bir nomzodda ikkala tenglamani qo'shing va o'ng tomonni ikkiga bo'ling.",
      'В каждом кандидате сложи оба уравнения и раздели правую часть на два.',
      'In each candidate, add both equations and divide the right side by two.',
    ),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Topildi: x qo'shi y ning qiymatidan orqaga qaytib, mos juft tenglamani tanlash ham xuddi shu hisobga tayanadi.",
      'Найдено: путь от значения x плюс y назад к паре уравнений опирается на тот же самый счёт.',
      'Found: going backward from the value of x plus y to the pair of equations relies on the same computation.',
    ),
    tasks: [
      {
        expr: 'x + y = 6 bolishi kerak',
        question: L(
          "Qo'shilganda x qo'shi y olti bo'lishi kerak. Qaysi juft tenglama mos keladi?",
          'При сложении x плюс y должен получиться равным шести. Какая пара уравнений подходит?',
          'When added, x plus y must come out equal to six. Which pair of equations fits?',
        ),
        ok: L("Ha. Ikkalasini qo'shsak: ikki x qo'shi ikki y teng o'n ikki, x qo'shi y teng olti.", 'Да. Сложив оба: два x плюс два y равно двенадцати, x плюс y равно шести.', 'Yes. Adding both: two x plus two y equals twelve, x plus y equals six.'),
        items: [
          { id: 'a', right: true, label: 'x + y + xy = 9,  x + y − xy = 3' },
          { id: 'b', label: 'x + y + xy = 9,  x + y − xy = 15', hint: L("Bu juftlikni qo'shing: to'qqiz qo'shi o'n besh yigirma to'rt, ikkiga bo'lingan o'n ikki chiqadi, olti emas.", 'Сложи эту пару: девять плюс пятнадцать двадцать четыре, делённое на два получается двенадцать, а не шесть.', 'Add this pair: nine plus fifteen is twenty-four, divided by two gives twelve, not six.') },
        ],
        solution: ['9 + 3 = 12', '2(x + y) = 12', 'x + y = 6'],
      },
      {
        expr: 'x + y = 10 bolishi kerak',
        question: L(
          "Qo'shilganda x qo'shi y o'n bo'lishi kerak. Qaysi juft tenglama mos keladi?",
          'При сложении x плюс y должен получиться равным десяти. Какая пара уравнений подходит?',
          'When added, x plus y must come out equal to ten. Which pair of equations fits?',
        ),
        ok: L("Ha. Ettini va o'n uchni qo'shsak yigirma, ikkiga bo'lingan o'n chiqadi.", 'Да. Сложив семь и тринадцать, получаем двадцать, делённое на два, десять.', 'Yes. Adding seven and thirteen gives twenty, divided by two, ten.'),
        items: [
          { id: 'a', right: true, label: 'x + y + x² = 7,  x + y − x² = 13' },
          { id: 'b', label: 'x + y + x² = 7,  x + y − x² = 3', hint: L("Bu juftlikni qo'shing: yetti qo'shi uch o'n, ikkiga bo'lingan besh chiqadi, o'n emas.", 'Сложи эту пару: семь плюс три десять, делённое на два получается пять, а не десять.', 'Add this pair: seven plus three is ten, divided by two gives five, not ten.') },
        ],
        solution: ['7 + 13 = 20', '2(x + y) = 20', 'x + y = 10'],
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
    "Blits: yo'qolish, davom etish, ikkita javob",
    'Блиц: исчезновение, продолжение, два ответа',
    'Blitz: disappearance, continuation, two answers',
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
        tag: 'qoshish-orqali-yoqotish-notogri',
        ask: L(
          "Bir tenglamada plyus besh xy, ikkinchisida ham plyus besh xy bo'lsa, qo'shishda ular yo'qoladimi?",
          'Если в одном уравнении плюс пять xy, и в другом тоже плюс пять xy, исчезнут ли они при сложении?',
          'If one equation has plus five xy, and the other also has plus five xy, do they disappear when added?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q, ular qo'shiladi", 'Нет, они складываются', 'No, they add up') },
          { id: 'yes', label: L("Ha, yo'qoladi", 'Да, исчезают', 'Yes, they disappear') },
        ],
        ok: L(
          "To'g'ri. Faqat qarama-qarshi ishorali bir xil had yo'qoladi, bir xil ishorali had esa qo'shiladi.",
          'Верно. Исчезает только одинаковое слагаемое с противоположными знаками, а с одинаковым знаком оно складывается.',
          'Correct. Only the same term with opposite signs disappears, with the same sign it adds up.',
        ),
        hint: L(
          "1-ekranni eslang: ikki xy lar yo'qolgani sababi ular QARAMA-QARSHI ishorada edi, biri plyus, biri minus.",
          'Вспомни 1 экран: два xy исчезли именно потому, что были с ПРОТИВОПОЛОЖНЫМИ знаками, один плюс, другой минус.',
          'Recall screen 1: the two xy disappeared exactly because they had OPPOSITE signs, one plus, one minus.',
        ),
      },
      {
        id: 'q2',
        tag: 'yigindini-yakuniy-javob-deb-olish',
        ask: L(
          "X qo'shi y to'rtga teng ekanini bilish, x va y ning aniq qiymatlarini bilish bilan bir xilmi?",
          'Знание, что x плюс y равно четырём, это то же самое, что знание точных значений x и y?',
          'Is knowing that x plus y equals four the same as knowing the exact values of x and y?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'yes', label: L('Ha', 'Да', 'Yes') },
        ],
        ok: L(
          "To'g'ri. X qo'shi y to'rt bo'lgan juftliklar ko'p, aniq javob uchun yana bir tenglamaga qo'yish kerak.",
          'Верно. Пар, где x плюс y равно четырём, много, для точного ответа нужно подставить ещё в одно уравнение.',
          'Correct. There are many pairs where x plus y equals four, for the exact answer one more equation is needed.',
        ),
        hint: L(
          "4-ekranni eslang: bir va uch, ikki va ikki, ko'plab juftliklar x qo'shi y to'rtga mos keladi.",
          'Вспомни 4 экран: один и три, два и два, много пар подходят под x плюс y равно четырём.',
          'Recall screen 4: one and three, two and two, many pairs fit x plus y equals four.',
        ),
      },
      {
        id: 'q3',
        tag: 'orniga-qoyishni-unutish',
        ask: L(
          "X qo'shi y topilgach, keyingi qadam nima?",
          'После того как найдено x плюс y, каков следующий шаг?',
          'After x plus y is found, what is the next step?',
        ),
        options: [
          { id: 'sub', right: true, label: L('Asl tenglamalardan biriga qo\'yish', 'Подставить в одно из исходных уравнений', 'Substitute into one of the original equations') },
          { id: 'stop', label: L('Yechimni tugatish', 'Закончить решение', 'Finish the solution') },
        ],
        ok: L(
          "To'g'ri. Faqat shu qadamdan keyin x va y ning aniq qiymatlari topiladi.",
          'Верно. Только после этого шага находятся точные значения x и y.',
          'Correct. Only after this step are the exact values of x and y found.',
        ),
        hint: L(
          "12-ekrandagi Sarvarning xatosini eslang: u aynan shu qadamni o'tkazib yuborgan edi.",
          'Вспомни ошибку Сарвара на 12 экране: он пропустил именно этот шаг.',
          "Recall Sarvar's mistake on screen 12: he skipped exactly this step.",
        ),
      },
      {
        id: 'q4',
        tag: 'faqat-bitta-yechim-yozish',
        ask: L(
          "Kvadrat tenglamaning ikkita ildizi bo'lsa, sistemaning odatda nechta yechimi bo'ladi?",
          'Если у квадратного уравнения два корня, сколько обычно решений у системы?',
          'If the quadratic equation has two roots, how many solutions does the system usually have?',
        ),
        options: [
          { id: 'two', right: true, label: L('Ikkita', 'Два', 'Two') },
          { id: 'one', label: L('Bitta', 'Одно', 'One') },
        ],
        ok: L(
          "To'g'ri. Har bir ildiz odatda o'z (x; y) juftligini beradi.",
          'Верно. Каждый корень обычно даёт свою пару (x; y).',
          'Correct. Each root usually gives its own pair (x; y).',
        ),
        hint: L(
          "7-ekranni eslang: x bir va x uchning ikkalasi ham o'z y sini berdi, ikkita to'liq javob hosil bo'ldi.",
          'Вспомни 7 экран: и x один, и x три дали свой y, получилось два полных ответа.',
          'Recall screen 7: both x one and x three gave their own y, resulting in two full answers.',
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
    "Qo'shish usuli: yo'qotish, o'rniga qo'yish, ikkita javob",
    'Способ сложения: исчезновение, подстановка, два ответа',
    'The addition method: disappearance, substitution, two answers',
  ),
  audio: [
    A('s0',
      "Birinchi ekranda ikki xy lar qo'shishda yo'qolishini taxmin qildingiz. Bugun aynan shu g'oyani to'liq egalladingiz.",
      'На первом экране ты предположил, что два xy исчезнут при сложении. Сегодня ты полностью освоил именно эту идею.',
      'On the first screen you guessed that the two xy would disappear when added. Today you fully mastered exactly this idea.'),
    A('s1',
      "Siz qarama-qarshi ishorali hadni qo'shib yo'qotishni, natijani ikkinchi tenglamaga qo'yishni va ikkita javobni yozishni o'rgandingiz.",
      'Ты освоил уничтожение слагаемого с противоположными знаками сложением, подстановку результата во второе уравнение и запись двух ответов.',
      'You learned canceling a term with opposite signs by adding, substituting the result into the second equation, and writing two answers.'),
    A('s2',
      "Keyingi darsda tenglamalar sistemasi orqali masalalar yechish: real holatdan sistema tuzish.",
      'В следующем уроке решение задач через системы уравнений: составление системы из реальной ситуации.',
      'The next lesson covers solving word problems through systems of equations: building a system from a real situation.'),
  ],
  props: {
    mark: 'x + y = 4',
    markNote: L(
      "qo'shishdan chiqqan natija",
      'результат сложения',
      'the result of addition',
    ),
    lines: [
      STATEMENTS[0],
      STATEMENTS[1],
      STATEMENTS[2],
    ],
    bridge: L(
      'Keyingi dars: sistema orqali masalalar',
      'Следующий урок: задачи через систему',
      'Next lesson: word problems through systems',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     tool: 'pick', ...S1 },
  { role: 'support',  tag: 'qoshish-orqali-yoqotish-notogri', ...S2 },
  { role: 'explain',  tag: 'qoshish-orqali-yoqotish-notogri', ...S3 },
  { role: 'explain',  tag: 'yigindini-yakuniy-javob-deb-olish', ...S4 },
  { role: 'explain',  tag: 'orniga-qoyishni-unutish', ...S5 },
  { role: 'explain',  tag: 'orniga-qoyishni-unutish', ...S6 },
  { role: 'explain',  tag: 'faqat-bitta-yechim-yozish', ...S7 },
  { role: 'rule',     tag: 'orniga-qoyishni-unutish', ...S8 },
  { role: 'practice', tool: 'drill', tag: 'faqat-bitta-yechim-yozish', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'qoshish-orqali-yoqotish-notogri', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'orniga-qoyishni-unutish', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'yigindini-yakuniy-javob-deb-olish', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'qoshish-orqali-yoqotish-notogri', ...S13 },
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
