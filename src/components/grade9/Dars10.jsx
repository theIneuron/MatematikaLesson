// ============================================================================
// 9-sinf, Dars 10. GRAFIK USUL.
//
// REDAKSIYA 1, 2026-08-27. Darslikning II bobi, 14-§ «Sistemalarni yechishning
// turli usullari» (72-76-bet) faqat algebraik usullarni (qo'shish, o'rniga
// qo'yish) ko'rsatadi, grafik usulning o'z misoli YO'Q — bu PODXOD_9SINF.md
// §7 «Prибор 4» izohida ham ko'zda tutilgan: «графический способ подключает
// прибор 1: множество решений системы это пересечение, и оно видно на
// плоскости». Shu sabab darsning o'z misoli tanlandi: y = x qo'shi bir
// (chiziq) va y = x kvadrat minus bir (parabola), ikkalasi ham x kvadrat
// minus x minus ikki = nolga keltiradi — Dars06 (mashq Q3) va Dars09 bilan
// bog'liq tenglama, ildizlari ikki va minus bir.
//
// ASBOBLAR: yangisi yo'q. Plane/pathOf (asboblar.jsx) ikkita egri chiziqni
// bitta tekislikda chizadi (Dars04-06 sahnalari kabi). GraphPick (Dars01dan
// tanish) — kichik grafik kartochkalarida nomzod nuqtalarni tanlash uchun,
// o'zining `MiniSystem` render funksiyasi bilan (pathOf orqali HAQIQIY
// funksiyalardan chiziladi, qo'lda chizilgan yo'l emas).
//
// TEGLAR (o'zining):
//   grafik-kesishish-nuqtasi    — kesishish nuqtasi sistema yechimi
//                                 ekanini tushunmaslik
//   nechta-kesishish-notogri    — kesishish nuqtalari soni doim bitta
//                                 deb o'ylash (chiziq va parabolada ikkita
//                                 bo'lishi mumkin)
//   faqat-bir-chiziqda-tekshirish — nomzod nuqtani faqat bitta egri
//                                 chiziqda tekshirib, ikkinchisini
//                                 unutish
//   nuqta-taxmin-emas-tekshiruv — nuqtani "ko'zga chiroyli ko'ringani"
//                                 uchun tekshirmasdan qabul qilish
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { L, MATH_FONT, RuleCard, T, useT } from '../grade8/core.jsx'
import { A, W, makeLesson } from '../grade8/screens.jsx'
import { G9_RECOLOR, G9_STYLES, GraphPick, Plane, RecallMC, pathOf, scaleOf } from './asboblar.jsx'

export const META = {
  id: 'grade9-10',
  n: 10,
  row: 10,
  block: 'Б2',
  topic: L('Grafik usul', 'Графический способ', 'The graphical method'),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "Sistemaning yechimi grafikda ikkala tenglamaning egri chizig'i kesishgan nuqta sifatida ko'rinadi",
    'Решение системы на графике видно как точка, в которой пересекаются линии обоих уравнений',
    "A system's solution appears on the graph as the point where the lines of both equations cross",
  ),
  L(
    "Chiziq va parabola ikkita, bitta yoki hech qanday umumiy nuqtaga ega bo'lishi mumkin",
    'Прямая и парабола могут иметь две, одну или ни одной общей точки',
    'A line and a parabola may have two, one, or no common points',
  ),
  L(
    "Grafikdan o'qilgan nuqta ikkala tenglamaga ham qo'yib tekshiriladi, faqat shundan keyin javob hisoblanadi",
    'Точка, прочитанная с графика, подставляется в оба уравнения для проверки, только после этого она считается ответом',
    'A point read from the graph is substituted into both equations to check it, only then does it count as an answer',
  ),
]

export const MISS = {
  'grafik-kesishish-nuqtasi': {
    what: L(
      "kesishish nuqtasi sistema yechimi ekani tushunilmadi",
      'не было понято, что точка пересечения — это решение системы',
      "it was not understood that the intersection point is the system's solution",
    ),
    wrong: null,
    at: 0,
  },
  'nechta-kesishish-notogri': {
    what: L(
      "kesishish nuqtalari soni doim bitta deb o'ylandi",
      'предполагалось, что точек пересечения всегда одна',
      'it was assumed there is always exactly one intersection point',
    ),
    wrong: null,
    at: 0,
  },
  'faqat-bir-chiziqda-tekshirish': {
    what: L(
      "nomzod nuqta faqat bitta egri chiziqda tekshirilib, ikkinchisi unutildi",
      'кандидатная точка проверена только на одной линии, вторая забыта',
      'the candidate point was checked on only one curve, the second was forgotten',
    ),
    wrong: null,
    at: 0,
  },
  'nuqta-taxmin-emas-tekshiruv': {
    what: L(
      "nuqta ko'zga chiroyli ko'rinishi uchun tekshirmasdan qabul qilindi",
      'точка принята без проверки, просто потому что выглядела подходящей',
      'the point was accepted without checking, simply because it looked right',
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// DARSNING FUNKSIYALARI: y = x + 1 (chiziq), y = x² − 1 (parabola).
// Kesishish: x + 1 = x² − 1 → x² − x − 2 = 0 → x = 2, x = −1.
// ============================================================
// eslint-disable-next-line react-refresh/only-export-components
const LINE_F = (x) => x + 1
// eslint-disable-next-line react-refresh/only-export-components
const PAR_F = (x) => x * x - 1

const MAIN_SC = scaleOf({ from: -2.5, to: 3.5, yFrom: -2, yTo: 6 })
// eslint-disable-next-line react-refresh/only-export-components
const TwoCurves = ({ dots, final }) => {
  const t = useT()
  return (
    <div className={'g9-scene-plain' + (final ? ' g8-scene-final' : '')} aria-hidden="false">
      <Plane sc={MAIN_SC} xLabel={L('x', 'x', 'x')} yLabel={L('y', 'y', 'y')}>
        <g className="g9-real"><path d={pathOf(PAR_F, MAIN_SC)} /></g>
        <g className="g9-real"><path d={pathOf(LINE_F, MAIN_SC)} stroke={T.accent} /></g>
        {dots ? dots.map((p, i) => (
          <circle key={i} cx={MAIN_SC.px(p[0])} cy={MAIN_SC.py(p[1])} r="4.4" fill={T.ok} stroke={T.paper} strokeWidth="1.6" />
        )) : null}
      </Plane>
      {!final ? (
        <div className="g9-hook-caption" style={{ fontFamily: MATH_FONT }}>
          {t(L('y = x + 1  ·  y = x² − 1', 'y = x + 1  ·  y = x² − 1', 'y = x + 1  ·  y = x² − 1'))}
        </div>
      ) : null}
    </div>
  )
}

// ============================================================
// GraphPick UCHUN KICHIK KARTOCHKA: pathOf orqali HAQIQIY funksiyalardan
// chiziladi, nomzod nuqta belgilanadi.
// ============================================================
const miniScale = (w, h, from, to, yFrom, yTo) => {
  const l = 5; const r = w - 5; const top = 5; const bottom = h - 5
  return {
    left: l, right: r, top, bottom, from, to, yFrom, yTo,
    px: (x) => l + ((x - from) / (to - from)) * (r - l),
    py: (y) => bottom - ((y - yFrom) / (yTo - yFrom)) * (bottom - top),
  }
}
const MINI_SC = miniScale(120, 78, -2.5, 3.5, -2, 6)
const MiniSystem = ({ x, y, ok, mountDelay, reveal }) => (
  <svg viewBox="0 0 120 78" width="100%" className="g9-mg-svg" role="img">
    <line x1={MINI_SC.left} y1={MINI_SC.py(0)} x2={MINI_SC.right} y2={MINI_SC.py(0)} stroke="rgba(23,26,29,.18)" strokeWidth="1" />
    <path className="g9-mg-path" d={pathOf(PAR_F, MINI_SC)} fill="none" stroke={T.ink2} strokeWidth="2.6"
      style={{ animationDelay: (mountDelay || 0) + 'ms' }} />
    <path className="g9-mg-path" d={pathOf(LINE_F, MINI_SC)} fill="none" stroke={T.accent} strokeWidth="2.6"
      style={{ animationDelay: (mountDelay || 0) + 'ms' }} />
    <circle cx={MINI_SC.px(x)} cy={MINI_SC.py(y)} r="5"
      fill={reveal ? (ok ? T.ok : T.tip) : T.ink} stroke={T.paper} strokeWidth="1.6" />
  </svg>
)

// ============================================================
// EKRAN 1. XUK.
// ============================================================
const S1 = {
  eyebrow: L('IKKI EGRI CHIZIQ', 'ДВЕ ЛИНИИ', 'TWO CURVES'),
  title: L(
    "Ular qayerda kesishadi",
    'Где они пересекаются',
    'Where they cross',
  ),
  audio: [
    A('mount',
      "Bitta tekislikda ikkita egri chiziq: to'g'ri chiziq y teng x qo'shi bir, va parabola y teng x kvadrat minus bir.",
      'На одной плоскости две линии: прямая y равен x плюс один, и парабола y равен x в квадрате минус один.',
      'On one plane, two curves: the line y equals x plus one, and the parabola y equals x squared minus one.'),
    A('why',
      "Ular ikki joyda kesishadi. Shu ikki nuqta sistema bilan qanday bog'liq deb o'ylaysiz?",
      'Они пересекаются в двух местах. Как, по-твоему, эти две точки связаны с системой уравнений?',
      'They cross in two places. How do you think these two points relate to the system of equations?'),
  ],
  props: {
    askClass: 'g9-ask-big',
    cardsClass: 'g9-cards-small',
    ask: L(
      "Ikki chiziq kesishgan nuqtalar sistema bilan qanday bog'liq?",
      'Как точки пересечения двух линий связаны с системой?',
      'How do the intersection points of the two lines relate to the system?',
    ),
    items: [
      { id: 'right', right: true, show: L("Ular sistemaning yechimlari", 'Они и есть решения системы', 'They are the solutions of the system') },
      {
        id: 'wrong',
        show: L("Ular tasodifiy nuqtalar, sistemaga aloqasi yo'q", 'Это случайные точки, к системе отношения не имеют', 'They are random points, unrelated to the system'),
        hint: L(
          "Kesishish nuqtasida ikkala tenglama ham to'g'ri: bu aynan sistema yechimining ta'rifi.",
          'В точке пересечения верны оба уравнения: это и есть определение решения системы.',
          'At the intersection point both equations hold: that is exactly the definition of a system\'s solution.',
        ),
      },
    ],
    after: L(
      "To'g'ri. Kesishish nuqtalari sistema yechimlari. Bugun ularni grafikdan o'qib, tekshirishni o'rganamiz.",
      'Верно. Точки пересечения это решения системы. Сегодня учимся читать их с графика и проверять.',
      "Correct. The intersection points are the system's solutions. Today we learn to read them off the graph and check them.",
    ),
  },
}

// ============================================================
// EKRAN 2. TAYANCH — nuqta grafikda: koordinatalar tenglamaga mos keladi.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "Nuqta va tenglama",
    'Точка и уравнение',
    'A point and an equation',
  ),
  audio: [
    A('mount',
      "1-4-darslardan savol: (ikki; uch) nuqtasi y teng x qo'shi bir chizig'ida yotadimi?",
      'Вопрос с 1-4 уроков: лежит ли точка (два; три) на прямой y равен x плюс один?',
      'A question from lessons 1-4: does the point (two; three) lie on the line y equals x plus one?'),
    A('why',
      "Nuqtaning x koordinatasini formulaga qo'yib, y qiymatini solishtiring.",
      'Подставь x-координату точки в формулу и сравни с y.',
      "Substitute the point's x-coordinate into the formula and compare with y."),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('y = x + 1,  (2; 3)', 'y = x + 1,  (2; 3)', 'y = x + 1,  (2; 3)')}
      steps={[
        { id: 'check', head: 'y(2)', lines: ['2 + 1 = 3'] },
      ]}
      ask={L(
        "(ikki; uch) nuqtasi bu chiziqda yotadimi?",
        'Точка (два; три) лежит на этой прямой?',
        'Does the point (two; three) lie on this line?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L("Ha, yotadi", 'Да, лежит', 'Yes, it does') },
        {
          id: 'wrong',
          label: L("Yo'q, yotmaydi", 'Нет, не лежит', 'No, it does not'),
          hint: L(
            "X ikkiga formulaga qo'yilsa, y uchga teng chiqadi, aynan nuqtaning o'zi kabi.",
            'Подставив x равное двум в формулу, y получается равным трём, точно как у точки.',
            'Substituting x equal to two into the formula, y comes out equal to three, exactly like the point.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Nuqta chiziqda yotishi uchun uning koordinatalari formulaga mos kelishi kerak.",
        'Верно. Чтобы точка лежала на прямой, её координаты должны подходить формуле.',
        "Correct. For a point to lie on the line, its coordinates must fit the formula.",
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — ikkala tenglamani tenglashtirish.
// ============================================================
const S3 = {
  eyebrow: L('TENGLASHTIRISH', 'ПРИРАВНИВАНИЕ', 'SETTING EQUAL'),
  title: L(
    "Ikkala y ni bir-biriga tenglashtiramiz",
    'Приравниваем оба y друг к другу',
    'We set both y\'s equal to each other',
  ),
  audio: [
    A('mount',
      "Kesishish nuqtasida ikkala tenglama ham bir xil x va y ni beradi. Demak ikkala o'ng tomonni tenglashtirish mumkin.",
      'В точке пересечения оба уравнения дают одни и те же x и y. Значит можно приравнять обе правые части.',
      'At the intersection point both equations give the same x and y. So the two right-hand sides can be set equal.'),
    W('reduce',
      "X qo'shi bir teng x kvadrat minus bir, bu yerdan x kvadrat minus x minus ikki teng nol tenglamasi kelib chiqadi.",
      'x плюс один равно x в квадрате минус один, отсюда получается уравнение x в квадрате минус x минус два равно нулю.',
      'x plus one equals x squared minus one, from this comes the equation x squared minus x minus two equals zero.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('y = x + 1,  y = x² − 1', 'y = x + 1,  y = x² − 1', 'y = x + 1,  y = x² − 1')}
      steps={[
        { id: 'eq', head: 'x + 1 = x² − 1', lines: ['x² − x − 2 = 0'] },
      ]}
      ask={L(
        "Nega ikkala tenglamaning o'ng tomonini tenglashtirish mumkin?",
        'Почему можно приравнять правые части обоих уравнений?',
        'Why can the right-hand sides of both equations be set equal?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L("Chunki kesishish nuqtasida ikkalasi ham bir xil y ni beradi", 'Потому что в точке пересечения оба дают одно и то же y', 'Because at the intersection point both give the same y'),
        },
        {
          id: 'wrong',
          label: L("Chunki x har doim shunday tenglashtiriladi", 'Потому что x всегда так приравнивается', 'Because x is always set equal like this'),
          hint: L(
            "Bu umumiy qoida emas, faqat ikkala tenglama ham y ga nisbatan yechilgan va kesishish nuqtasida y bir xil bo'lgani uchun ishlaydi.",
            'Это не общее правило, оно работает только потому, что оба уравнения решены относительно y, и в точке пересечения y одно и то же.',
            'This is not a general rule, it works only because both equations are solved for y, and at the intersection point y is the same.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Natijada x kvadrat minus x minus ikki teng nol tenglamasi hosil bo'ldi.",
        'Верно. В результате получилось уравнение x в квадрате минус x минус два равно нулю.',
        'Correct. As a result, the equation x squared minus x minus two equals zero is obtained.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — TANISH TENGLAMA: ildizlarni topish.
// ============================================================
const S4 = {
  eyebrow: L('TANISH TENGLAMA', 'ЗНАКОМОЕ УРАВНЕНИЕ', 'A FAMILIAR EQUATION'),
  title: L(
    "Bu tenglamani ilgari ko'rgansiz",
    'Это уравнение ты уже видел',
    'You have seen this equation before',
  ),
  audio: [
    A('mount',
      "X kvadrat minus x minus ikki teng nol. 6-darsda aynan shu tenglamani mashqda yechgan edingiz.",
      'x в квадрате минус x минус два равно нулю. На 6 уроке ты уже решал точно такое уравнение в упражнении.',
      'x squared minus x minus two equals zero. In lesson 6 you already solved exactly this equation in an exercise.'),
    A('why',
      "Ko'paytuvchilarga ajrating: x minus ikki, qavs, x qo'shi bir.",
      'Разложи на множители: x минус два, скобка, x плюс один.',
      'Factor it: x minus two, bracket, x plus one.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('x² − x − 2 = 0', 'x² − x − 2 = 0', 'x² − x − 2 = 0')}
      steps={[
        { id: 'factor', head: 'x² − x − 2', lines: ['(x − 2)(x + 1) = 0'] },
        { id: 'roots', head: 'x', lines: ['x1 = 2,  x2 = −1'] },
      ]}
      ask={L(
        "Ikkita x qiymati topildi. Bu nima degani: sistemaning nechta yechimi bor?",
        'Найдены два значения x. Что это значит: сколько решений у системы?',
        'Two values of x are found. What does this mean: how many solutions does the system have?',
      )}
      cols={2}
      items={[
        { id: 'right', right: true, label: L('Ikkita', 'Два', 'Two') },
        {
          id: 'wrong',
          label: L('Bitta, ikkinchisi ortiqcha', 'Одно, второе лишнее', 'One, the second is extra'),
          hint: L(
            "Kvadrat tenglamaning ikkita ildizi bor, va ikkalasi ham 1-ekrandagi rasmda ko'ringan ikkita kesishish nuqtasiga mos keladi.",
            'У квадратного уравнения два корня, и оба соответствуют двум точкам пересечения, видным на рисунке с 1 экрана.',
            'The quadratic equation has two roots, and both correspond to the two intersection points seen in the picture on screen 1.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Ikkita x qiymati, demak sistemaning ikkita yechimi bo'ladi, xuddi rasmdagi ikkita kesishish kabi.",
        'Верно. Два значения x, значит у системы два решения, точно как две точки пересечения на рисунке.',
        'Correct. Two values of x, so the system has two solutions, just like the two intersection points in the picture.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — y LARNI TOPISH VA IKKALA TENGLAMADA
// TEKSHIRISH.
// ============================================================
const S5 = {
  eyebrow: L('IKKALASIDA TEKSHIRISH', 'ПРОВЕРКА В ОБОИХ', 'CHECKING IN BOTH'),
  title: L(
    "Y ni topib, ikkala tenglamada ham tekshiramiz",
    'Находим y и проверяем в обоих уравнениях',
    'We find y and check it in both equations',
  ),
  audio: [
    A('mount',
      "X ikki bo'lganda y ni istalgan tenglamadan topish mumkin. Lekin ishonch hosil qilish uchun ikkalasida ham tekshiring.",
      'Когда x равен двум, y можно найти из любого уравнения. Но для уверенности проверь в обоих.',
      'When x equals two, y can be found from either equation. But to be sure, check it in both.'),
    A('why',
      "Ikkala tenglama ham bir xil y berishi kerak, aks holda bu nuqta chindan ham kesishish emas.",
      'Оба уравнения должны дать одно и то же y, иначе эта точка на самом деле не пересечение.',
      'Both equations must give the same y, otherwise this point is not actually an intersection.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('x = 2', 'x = 2', 'x = 2')}
      steps={[
        { id: 'line', head: 'y = x + 1', lines: ['y = 2 + 1 = 3'] },
        { id: 'par', head: 'y = x² − 1', lines: ['y = 2² − 1 = 3'] },
      ]}
      ask={L(
        "Ikkala tenglama ham bir xil y berdimi?",
        'Оба уравнения дали одно и то же y?',
        'Did both equations give the same y?',
      )}
      cols={1}
      items={[
        { id: 'right', right: true, label: L("Ha, ikkalasi ham uch berdi", 'Да, оба дали три', 'Yes, both gave three') },
        {
          id: 'wrong',
          label: L("Yo'q, ular har xil chiqishi kerak", 'Нет, они должны получиться разными', 'No, they should come out different'),
          hint: L(
            "Aynan kesishish nuqtasida ikkala tenglama ham bir xil y berishi shart, aks holda nuqta ikkalasida ham yotmaydi.",
            'Именно в точке пересечения оба уравнения обязаны дать одно и то же y, иначе точка не лежит на обеих линиях.',
            'Exactly at the intersection point, both equations must give the same y, otherwise the point does not lie on both lines.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Ikkalasi ham uch berdi: (ikki; uch) haqiqiy kesishish nuqtasi.",
        'Верно. Оба дали три: (два; три) настоящая точка пересечения.',
        'Correct. Both gave three: (two; three) is a genuine intersection point.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — GraphPick: to'rt nomzod nuqta.
// ============================================================
const CANDIDATES = [
  { id: 'p1', pt: [2, 3], ok: true },
  { id: 'p2', pt: [-1, 0], ok: true },
  { id: 'p3', pt: [1, 2], ok: false, why: L(
    "Bu nuqta faqat chiziqda yotadi: x bir bo'lsa, chiziq ikki beradi, lekin parabola nol beradi.",
    'Эта точка лежит только на прямой: при x равном одному прямая даёт два, а парабола даёт ноль.',
    'This point lies only on the line: at x equal to one, the line gives two, but the parabola gives zero.',
  ) },
  { id: 'p4', pt: [0, -1], ok: false, why: L(
    "Bu nuqta faqat parabolada yotadi: x nol bo'lsa, parabola minus bir beradi, lekin chiziq bir beradi.",
    'Эта точка лежит только на параболе: при x равном нулю парабола даёт минус один, а прямая даёт один.',
    'This point lies only on the parabola: at x equal to zero, the parabola gives minus one, but the line gives one.',
  ) },
]

const S6 = {
  eyebrow: L('TANLASH', 'ВЫБОР', 'THE CHOICE'),
  title: L(
    "To'rtta nomzoddan haqiqiysini toping",
    'Найди настоящую среди четырёх кандидатов',
    'Find the real one among four candidates',
  ),
  audio: [
    A('mount',
      "To'rtta nuqta ko'rsatilgan. Ularning ikkitasi haqiqiy kesishish, ikkitasi esa faqat bitta egri chiziqda yotadi.",
      'Показаны четыре точки. Две из них настоящие пересечения, а две лежат только на одной линии.',
      'Four points are shown. Two of them are genuine intersections, and two lie on only one curve.'),
    A('why',
      "Haqiqiy kesishish nuqtasini bosing: u ikkala egri chiziqda ham yotishi kerak.",
      'Нажми на настоящую точку пересечения: она должна лежать на обеих линиях.',
      'Tap the genuine intersection point: it must lie on both curves.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <GraphPick
      ask={L(
        "Haqiqiy kesishish nuqtasini tanlang",
        'Выбери настоящую точку пересечения',
        'Choose the genuine intersection point',
      )}
      after={L(
        "To'g'ri. Bu nuqta ikkala egri chiziqda ham yotadi, demak u sistemaning yechimi.",
        'Верно. Эта точка лежит на обеих линиях, значит она решение системы.',
        "Correct. This point lies on both curves, so it is a solution of the system.",
      )}
      items={CANDIDATES.map((c, i) => ({
        id: c.id,
        right: c.ok,
        hint: c.why,
        render: (r) => <MiniSystem x={c.pt[0]} y={c.pt[1]} ok={c.ok} mountDelay={i * 100} reveal={r} />,
      }))}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5 — NECHTA KESISHISH BO'LISHI MUMKIN.
// ============================================================
const S7 = {
  eyebrow: L('NECHTA', 'СКОЛЬКО', 'HOW MANY'),
  title: L(
    "Chiziq va parabola: ikki, bir yoki hech qanday",
    'Прямая и парабола: два, одна или ни одной',
    'A line and a parabola: two, one, or none',
  ),
  audio: [
    A('mount',
      "Chiziq va parabola bugungi rasmda ikki marta kesishdi. Lekin bu doim shundaymi?",
      'Прямая и парабола на сегодняшнем рисунке пересеклись дважды. Но всегда ли так?',
      "The line and the parabola crossed twice in today's picture. But is that always the case?"),
    A('why',
      "Chiziqni yuqoriroq yoki pastroq surib ko'ring: kesishishlar soni o'zgarishi mumkinmi?",
      'Представь, что прямая сдвинута выше или ниже: может ли измениться число пересечений?',
      'Imagine the line shifted higher or lower: can the number of intersections change?'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      steps={[]}
      ask={L(
        "Chiziq va parabola nechta umumiy nuqtaga ega bo'lishi mumkin?",
        'Сколько общих точек могут иметь прямая и парабола?',
        'How many common points can a line and a parabola have?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L("Ikkita, bitta yoki hech qanday, chiziqning joyiga bog'liq", 'Две, одну или ни одной, в зависимости от положения прямой', 'Two, one, or none, depending on the position of the line'),
        },
        {
          id: 'wrong',
          label: L("Doim ikkita, chunki parabolaning ikkita tarmog'i bor", 'Всегда две, потому что у параболы две ветви', 'Always two, because a parabola has two branches'),
          hint: L(
            "Chiziqni yuqoriga ko'tarsangiz, u parabolaga tegib qolishi yoki umuman tegmasligi mumkin: kesishish soni chiziqning joyiga bog'liq.",
            'Если поднять прямую выше, она может коснуться параболы или вообще её не задеть: число пересечений зависит от положения прямой.',
            "If you raise the line higher, it may touch the parabola or miss it entirely: the number of intersections depends on the line's position.",
          ),
        },
      ]}
      after={L(
        "To'g'ri. Bugungi sistemada ikkita kesishish bor, lekin bu har doim shunday bo'lavermaydi.",
        "Верно. В сегодняшней системе два пересечения, но так бывает не всегда.",
        "Correct. In today's system there are two intersections, but that is not always the case.",
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
    "Algebra 9, 14-§ (72-76-bet), grafik usul darsda qo'shildi",
    'Алгебра 9, §14 (стр. 72-76), графический способ добавлен на уроке',
    'Algebra 9, §14 (p. 72-76), the graphical method was added in the lesson',
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
          "Grafikdan nuqta o'qib olingandan keyin nima qilinadi?",
          'Что делают после того, как точка прочитана с графика?',
          'What is done after a point is read from the graph?',
        )}
        cols={1}
        items={[
          {
            id: 'right', right: true,
            label: L("Ikkala tenglamaga ham qo'yib tekshiriladi", 'Подставляют в оба уравнения для проверки', 'It is substituted into both equations to check'),
          },
          {
            id: 'wrong',
            label: L("To'g'ridan-to'g'ri javob deb yoziladi", 'Сразу записывают как ответ', 'It is written down as the answer right away'),
            hint: L(
              "5-ekranni eslang: (ikki; uch) nuqtasini ikkala tenglamada ham tekshirgan edingiz, faqat shundan keyin javob deb qabul qilingan edi.",
              'Вспомни 5 экран: ты проверил точку (два; три) в обоих уравнениях, только после этого её приняли как ответ.',
              'Recall screen 5: you checked the point (two; three) in both equations, only then was it accepted as the answer.',
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
    "Kesishish nuqtasi va tekshirish",
    'Точка пересечения и проверка',
    'The intersection point and checking',
  ),
  audio: [
    A('mount',
      "Olti ekranda siz kesishish nuqtalarini topishni, ularning sonini va ikkala tenglamada tekshirishni o'z qo'lingiz bilan bajardingiz. Endi ular qoida sifatida.",
      'На шести экранах ты сам находил точки пересечения, их число и проверял в обоих уравнениях. Теперь они в виде правила.',
      'On six screens you found the intersection points, their number, and checked them in both equations with your own hands. Now here they are as a rule.'),
    W('card',
      "Qoida ochildi. Uchtasi ham darsning o'zida umumlashtirilgan.",
      'Правило открылось. Все три обобщены прямо на уроке.',
      'The rule is open. All three are synthesized right in the lesson.'),
  ],
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
}

// ============================================================
// EKRAN 9. MASHQ — ZANJIR: kesishish sonini rasmdan aytish.
// ============================================================
const S9 = {
  eyebrow: L('ZANJIR', 'ЦЕПОЧКА', 'THE CHAIN'),
  title: L(
    "Tenglamadan kesishish soniga",
    'От уравнения к числу пересечений',
    'From the equation to the number of intersections',
  ),
  audio: [
    A('mount',
      "To'rtta holat ketma-ket. Har birida hosil bo'lgan kvadrat tenglamaning ildizlari sonini toping.",
      'Четыре случая подряд. В каждом найди число корней получившегося квадратного уравнения.',
      'Four cases in a row. In each, find the number of roots of the resulting quadratic equation.'),
    A('why',
      "Ildizlar soni aynan kesishish nuqtalari soniga teng.",
      'Число корней равно числу точек пересечения.',
      'The number of roots equals the number of intersection points.'),
  ],
  props: {
    stepLabel: L('Tenglama', 'Уравнение', 'Equation'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "To'rttasi ham topildi. Ildizlar soni kesishish nuqtalari soniga teng: ikki, bir yoki nol.",
      'Все четыре найдены. Число корней равно числу точек пересечения: два, один или ноль.',
      'All four are found. The number of roots equals the number of intersection points: two, one, or zero.',
    ),
    tasks: [
      {
        expr: 'x² − x − 2 = 0',
        question: L('Nechta ildiz, demak nechta kesishish?', 'Сколько корней, значит сколько пересечений?', 'How many roots, so how many intersections?'),
        ok: L("Ha. Ikkita: ikki va minus bir.", 'Да. Два: два и минус один.', 'Yes. Two: two and minus one.'),
        items: [
          { id: 'a', right: true, label: L('Ikkita', 'Два', 'Two') },
          { id: 'b', label: L('Bitta', 'Один', 'One'), hint: L("Ko'paytuvchilarga ajrating: x minus ikki, qavs, x qo'shi bir, teng nol. Ikkita ildiz bor.", 'Разложи на множители: x минус два, скобка, x плюс один, равно нулю. Корней два.', 'Factor it: x minus two, bracket, x plus one, equals zero. There are two roots.') },
        ],
        solution: ['(x − 2)(x + 1) = 0', 'x1 = 2, x2 = −1'],
      },
      {
        expr: 'x² − 4x + 4 = 0',
        question: L('Nechta ildiz, demak nechta kesishish?', 'Сколько корней, значит сколько пересечений?', 'How many roots, so how many intersections?'),
        ok: L("Ha. Bitta: x minus ikki butun kvadrat, faqat ikki.", 'Да. Один: x минус два в квадрате, только два.', 'Yes. One: x minus two squared, only two.'),
        items: [
          { id: 'a', right: true, label: L('Bitta', 'Один', 'One') },
          { id: 'b', label: L('Ikkita', 'Два', 'Two'), hint: L("Ko'paytuvchilarga ajrating: x minus ikki butun kvadrat teng nol. Ikkala ko'paytuvchi ham bir xil, ildiz bitta.", 'Разложи на множители: x минус два в квадрате равно нулю. Оба множителя одинаковы, корень один.', 'Factor it: x minus two squared equals zero. Both factors are the same, there is one root.') },
        ],
        solution: ['(x − 2)² = 0', L('x = 2 (bitta ildiz)', 'x = 2 (один корень)', 'x = 2 (one root)')],
      },
      {
        expr: 'x² + 1 = 0',
        question: L('Nechta ildiz, demak nechta kesishish?', 'Сколько корней, значит сколько пересечений?', 'How many roots, so how many intersections?'),
        ok: L("Nolta. X kvadrat hech qachon manfiy bo'lmaydi, shuning uchun x kvadrat qo'shi bir hech qachon nolga teng bo'lmaydi.", 'Ноль. x в квадрате никогда не бывает отрицательным, поэтому x в квадрате плюс один никогда не равен нулю.', 'Zero. x squared is never negative, so x squared plus one never equals zero.'),
        items: [
          { id: 'a', label: L('Ikkita', 'Два', 'Two'), hint: L("X kvadrat manfiy bo'la olmaydi, shuning uchun x kvadrat qo'shi bir doim musbat, hech qachon nolga teng emas.", 'x в квадрате не может быть отрицательным, поэтому x в квадрате плюс один всегда положительно, никогда не равно нулю.', 'x squared cannot be negative, so x squared plus one is always positive, never equal to zero.') },
          { id: 'b', right: true, label: L('Nolta', 'Ноль', 'Zero') },
        ],
        solution: [L('X kvadrat >= 0 doim', 'x в квадрате >= 0 всегда', 'x squared >= 0 always'), L("Demak x kvadrat qo'shi bir > 0 doim", 'Значит x в квадрате плюс один > 0 всегда', 'So x squared plus one > 0 always'), L("Ildiz yo'q, kesishish yo'q", 'Корней нет, пересечений нет', 'No roots, no intersections')],
      },
      {
        expr: '2x² − 3x = 0',
        question: L('Nechta ildiz, demak nechta kesishish?', 'Сколько корней, значит сколько пересечений?', 'How many roots, so how many intersections?'),
        ok: L("Ha. Ikkita: nol va uch ikkidan.", 'Да. Два: ноль и три вторых.', 'Yes. Two: zero and three halves.'),
        items: [
          { id: 'a', right: true, label: L('Ikkita', 'Два', 'Two') },
          { id: 'b', label: L('Bitta', 'Один', 'One'), hint: L("X ni qavsdan chiqaring: x, qavs, ikki x minus uch, teng nol. Ikkita ko'paytuvchi, ikkita ildiz.", 'Вынеси x за скобку: x, скобка, два x минус три, равно нулю. Два множителя, два корня.', 'Factor out x: x, bracket, two x minus three, equals zero. Two factors, two roots.') },
        ],
        solution: ['x(2x − 3) = 0', 'x1 = 0, x2 = 1,5'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ — YO'NALTIRILGAN: yangi sistema, uch qadam.
// ============================================================
const S10 = {
  eyebrow: L('QADAMLAB', 'ПО ШАГАМ', 'STEP BY STEP'),
  title: L(
    "Yangi sistema: uch qadam",
    'Новая система: три шага',
    'A new system: three steps',
  ),
  audio: [
    A('mount',
      "Sistema: y teng x qo'shi uch, y teng x kvadrat minus bir. Uch qadam, yordam yo'q, lekin har javobdan keyin yechim ochiladi.",
      'Система: y равен x плюс три, y равен x в квадрате минус один. Три шага, помощи нет, но после каждого ответа откроется решение.',
      'A system: y equals x plus three, y equals x squared minus one. Three steps, no help, but after each answer the solution opens.'),
    A('why',
      "Avval tenglashtiring, keyin ildizlarni toping, oxirida y larni hisoblang.",
      'Сначала приравняй, потом найди корни, в конце вычисли y.',
      'First set them equal, then find the roots, finally compute y.'),
  ],
  props: {
    stepLabel: L('Qadam', 'Шаг', 'Step'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uch qadam ham to'ldi: tenglashtirildi, ildizlar topildi, y lar hisoblandi.",
      'Все три шага пройдены: приравняли, нашли корни, вычислили y.',
      'All three steps are done: set equal, roots found, y computed.',
    ),
    tasks: [
      {
        expr: 'y = x + 3,  y = x² − 1',
        question: L('Tenglashtirilgach qaysi tenglama hosil bo\'ladi?', 'Какое уравнение получается после приравнивания?', 'Which equation is obtained after setting equal?'),
        ok: L("Ha. X qo'shi uch teng x kvadrat minus bir, o'tkazilsa x kvadrat minus x minus to'rt teng nol.", 'Да. x плюс три равно x в квадрате минус один, при переносе x в квадрате минус x минус четыре равно нулю.', 'Yes. x plus three equals x squared minus one, transposing gives x squared minus x minus four equals zero.'),
        items: [
          { id: 'a', right: true, label: 'x² − x − 4 = 0' },
          { id: 'b', label: 'x² − x + 4 = 0', hint: L("Sonlarni ko'chiring: uch va minus birni birlashtiring, minus to'rt chiqadi, plyus to'rt emas.", 'Перенеси числа: объедини три и минус один, получится минус четыре, а не плюс четыре.', 'Transpose the numbers: combine three and minus one, you get minus four, not plus four.') },
        ],
        solution: ['x + 3 = x² − 1', 'x² − x − 4 = 0'],
      },
      {
        expr: 'x² − x − 4 = 0',
        question: L("Bu tenglama chiroyli ko'paytuvchilarga ajralmaydi. Diskriminant orqali ildizlar taxminan nechaga teng?", 'Это уравнение не раскладывается красиво. Через дискриминант, чему примерно равны корни?', 'This equation does not factor nicely. Via the discriminant, what are the roots approximately?'),
        ok: L("Ha. Diskriminant o'n yettiga teng, ildiz olinganda ikkita taxminiy ildiz chiqadi: ikki butun beshdan yuqori va bir butundan past manfiy.", 'Да. Дискриминант равен семнадцати, после извлечения корня получаются два приближённых корня: чуть больше двух с половиной и чуть меньше минус полутора.', 'Yes. The discriminant equals seventeen, taking the root gives two approximate roots: a bit more than two and a half, and a bit less than minus one and a half.'),
        items: [
          { id: 'a', right: true, label: L("Ikkita, aniq son emas", 'Два, не целые числа', 'Two, not whole numbers') },
          { id: 'b', label: L("Ikkita, aniq butun sonlar", 'Два, целые числа', 'Two, whole integers'), hint: L("Diskriminantni hisoblang: bir qo'shi o'n olti, o'n yetti, bu to'liq kvadrat emas, demak ildizlar butun son emas.", 'Посчитай дискриминант: один плюс шестнадцать, семнадцать, это не полный квадрат, значит корни не целые числа.', 'Compute the discriminant: one plus sixteen, seventeen, which is not a perfect square, so the roots are not whole numbers.') },
        ],
        solution: ['D = 1 + 16 = 17', L("Ildizlar D ildizi orqali topiladi, butun son emas", 'Корни находятся через корень из D, не целые числа', 'The roots come from the square root of D, not whole numbers')],
      },
      {
        expr: 'x ≈ 2,56',
        question: L(
          "Taxminiy x qiymatlaridan biri ikki butun ellik olti o'ndan. Shu x uchun y ni x qo'shi uch formulasidan taxminan toping",
          'Одно из приближённых значений x это два целых пятьдесят шесть сотых. Найди примерно y для этого x по формуле x плюс три',
          'One of the approximate x values is two point five six. Approximately find y for this x by the formula x plus three',
        ),
        ok: L("Ha. Ikki butun ellik olti o'ndan qo'shi uch, besh butun ellik olti o'ndan atrofida.", 'Да. Два целых пятьдесят шесть сотых плюс три, примерно пять целых пятьдесят шесть сотых.', 'Yes. Two point five six plus three, approximately five point five six.'),
        items: [
          { id: 'a', right: true, label: L('Besh atrofida', 'Около пяти', 'Around five') },
          { id: 'b', label: L('Ikki atrofida', 'Около двух', 'Around two'), hint: L("X qiymatining o'ziga uchni qo'shing, x ning o'zi emas, natija katta chiqadi.", 'Прибавь три к самому значению x, а не только смотри на x, результат получится больше.', 'Add three to the x value itself, the result comes out larger.') },
        ],
        solution: ['y = 2,56 + 3', 'y ≈ 5,56'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ — QOG'OZDA: rasmni tasavvur qilib javob berish.
// ============================================================
const S11 = {
  eyebrow: L('QOG\'OZDA', 'НА БУМАГЕ', 'ON PAPER'),
  title: L(
    "Faqat o'ylab: rasmsiz javob",
    'Только мысленно: ответ без рисунка',
    'Just thinking: an answer without a picture',
  ),
  audio: [
    A('mount',
      "Bu safar rasm yo'q, faqat hisob va mantiq.",
      'На этот раз без рисунка, только счёт и логика.',
      'This time there is no picture, only computation and logic.'),
    A('why',
      "Har savolda avval tenglashtiring yoki diskriminantni hisoblang.",
      'В каждом вопросе сначала приравнивай или считай дискриминант.',
      'In each question, first set equal or compute the discriminant.'),
  ],
  props: {
    stepLabel: L('Savol', 'Вопрос', 'Question'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham hal bo'ldi: rasmsiz ham kesishish sonini hisoblash mumkin.",
      'Все три решены: число пересечений можно посчитать и без рисунка.',
      'All three are solved: the number of intersections can be computed even without a picture.',
    ),
    tasks: [
      {
        expr: 'y = x,  y = x² − 6',
        question: L('Tenglashtirilgach qaysi tenglama hosil bo\'ladi?', 'Какое уравнение получается после приравнивания?', 'Which equation is obtained after setting equal?'),
        ok: L("Ha. X teng x kvadrat minus olti, o'tkazilsa x kvadrat minus x minus olti teng nol.", 'Да. x равно x в квадрате минус шесть, при переносе x в квадрате минус x минус шесть равно нулю.', 'Yes. x equals x squared minus six, transposing gives x squared minus x minus six equals zero.'),
        items: [
          { id: 'a', right: true, label: 'x² − x − 6 = 0' },
          { id: 'b', label: 'x² + x − 6 = 0', hint: L("X ni narigi tomonga o'tkazing: x kvadrat minus x, plyus x emas.", 'Перенеси x на другую сторону: x в квадрате минус x, а не плюс x.', 'Move x to the other side: x squared minus x, not plus x.') },
        ],
        solution: ['x = x² − 6', 'x² − x − 6 = 0'],
      },
      {
        expr: 'x² − x − 6 = 0',
        question: L('Nechta kesishish nuqtasi bor?', 'Сколько точек пересечения?', 'How many intersection points?'),
        ok: L("Ha. Ko'paytuvchilarga ajratiladi: x minus uch, qavs, x qo'shi ikki, teng nol. Ikkita ildiz.", 'Да. Раскладывается на множители: x минус три, скобка, x плюс два, равно нулю. Два корня.', 'Yes. It factors: x minus three, bracket, x plus two, equals zero. Two roots.'),
        items: [
          { id: 'a', right: true, label: L('Ikkita', 'Два', 'Two') },
          { id: 'b', label: L('Bitta', 'Один', 'One'), hint: L("Ko'paytuvchilarga ajrating: x minus uch, qavs, x qo'shi ikki. Ikkita har xil ko'paytuvchi, ikkita ildiz.", 'Разложи на множители: x минус три, скобка, x плюс два. Два разных множителя, два корня.', 'Factor it: x minus three, bracket, x plus two. Two distinct factors, two roots.') },
        ],
        solution: ['(x − 3)(x + 2) = 0', 'x1 = 3, x2 = −2'],
      },
      {
        expr: 'y = x + 10,  y = x² + 1',
        question: L("Tenglashtirilgach diskriminant manfiy chiqadi. Bu nimani bildiradi?", 'После приравнивания дискриминант отрицателен. Что это значит?', 'After setting equal, the discriminant is negative. What does this mean?'),
        ok: L("Ha. Manfiy diskriminant ildiz yo'qligini bildiradi: chiziq va parabola umuman kesishmaydi.", 'Да. Отрицательный дискриминант означает отсутствие корней: прямая и парабола вообще не пересекаются.', 'Yes. A negative discriminant means there are no roots: the line and parabola do not intersect at all.'),
        items: [
          { id: 'a', right: true, label: L("Kesishish yo'q", 'Пересечений нет', 'No intersections') },
          { id: 'b', label: L("Ikkita kesishish bor", 'Есть два пересечения', 'There are two intersections'), hint: L("Manfiy diskriminant aksincha: haqiqiy ildiz yo'qligini bildiradi, demak kesishish ham yo'q.", 'Отрицательный дискриминант означает обратное: действительных корней нет, значит и пересечений нет.', 'A negative discriminant means the opposite: there are no real roots, so there are no intersections either.') },
        ],
        solution: ['D < 0', L("Haqiqiy ildiz yo'q, kesishish yo'q", 'Действительных корней нет, пересечений нет', 'No real roots, no intersections')],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ. Kamila faqat bitta egri chiziqda tekshirgan.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Faqat bitta chiziqda tekshirilgan nuqta",
    'Точка, проверенная только на одной линии',
    'A point checked on only one curve',
  ),
  audio: [
    A('mount',
      "Kamilaning yechimi. U (uch; to'rt) nuqtasini y teng x qo'shi bir chizig'ida tekshirdi va mos keldi, shuning uchun uni kesishish deb yozdi.",
      'Решение Камилы. Она проверила точку (три; четыре) на прямой y равен x плюс один, точка подошла, и она записала её как пересечение.',
      'Kamila\'s solution. She checked the point (three; four) on the line y equals x plus one, it fit, and she wrote it down as an intersection.'),
    A('why',
      "Endi shu nuqtani parabolada ham tekshiring: y teng x kvadrat minus bir.",
      'Теперь проверь эту точку и на параболе: y равен x в квадрате минус один.',
      'Now check this point on the parabola too: y equals x squared minus one.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L("TO'G'RI YECHIM", 'ВЕРНОЕ РЕШЕНИЕ', 'CORRECT SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Kamila faqat bitta chiziqda tekshirdi: parabolada nuqta mos kelmadi, demak bu kesishish emas.",
      'Камила проверила только на одной линии: на параболе точка не подошла, значит это не пересечение.',
      'Kamila checked only one curve: on the parabola the point did not fit, so this is not an intersection.',
    ),
    tasks: [
      {
        expr: 'y = x + 1,  y = x² − 1',
        question: L(
          "Kamila (uch; to'rt) nuqtasini kesishish deb yozdi. Uni parabolada tekshiring: y teng x kvadrat minus bir. Mos keladimi?",
          'Камила записала точку (три; четыре) как пересечение. Проверь её на параболе: y равен x в квадрате минус один. Она подходит?',
          'Kamila wrote the point (three; four) as the intersection. Check it on the parabola: y equals x squared minus one. Does it fit?',
        ),
        ok: L(
          "Yo'q, mos kelmaydi. Uch kvadrat minus bir sakkizga teng, to'rtga emas. Demak bu nuqta parabolada yotmaydi, u kesishish emas.",
          'Нет, не подходит. Три в квадрате минус один равно восьми, а не четырём. Значит эта точка не лежит на параболе, это не пересечение.',
          'No, it does not fit. Three squared minus one equals eight, not four. So this point does not lie on the parabola, it is not an intersection.',
        ),
        items: [
          {
            id: 'a', right: true,
            label: L("Yo'q, parabolada mos kelmaydi", 'Нет, на параболе не подходит', 'No, it does not fit on the parabola'),
          },
          {
            id: 'b',
            label: L("Ha, mos keladi, Kamila to'g'ri", "Да, подходит, Камила права", 'Yes, it fits, Kamila is right'),
            hint: L("Hisoblang: uch kvadrat minus bir. Bu sakkiz beradi, to'rt emas.", 'Посчитай: три в квадрате минус один. Это даёт восемь, а не четыре.', 'Compute: three squared minus one. That gives eight, not four.'),
          },
        ],
        solution: [
          'y = 3² − 1 = 8',
          L("To'rtga teng emas, (3; 4) parabolada yotmaydi", 'Не равно четырём, (3; 4) не лежит на параболе', 'Not equal to four, (3; 4) does not lie on the parabola'),
          L('Bu nuqta kesishish emas', 'Эта точка не пересечение', 'This point is not an intersection'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TESKARI TOPSHIRIQ — kesishishdan sistemaga.
// ============================================================
const S13 = {
  eyebrow: L('TESKARI', 'ОБРАТНОЕ', 'THE REVERSE'),
  title: L(
    "Kesishishdan sistemaga",
    'От пересечения к системе',
    'From the intersection to the system',
  ),
  audio: [
    A('mount',
      "Bu safar boshqa tomondan: kesishish nuqtalari berilgan, qaysi tenglama juftligi ularni berishini siz tanlaysiz.",
      'На этот раз наоборот: даны точки пересечения, а какая пара уравнений их даёт, выбираешь ты.',
      'This time it is the other way round: the intersection points are given, you choose which pair of equations gives them.'),
    A('why',
      "Har bir nomzodda tenglashtiring va ildizlarni berilgan x larga solishtiring.",
      'В каждом кандидате приравнивай и сравнивай корни с данными x.',
      'In each candidate, set equal and compare the roots with the given x values.',
    ),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Topildi: kesishishdan orqaga qaytib, mos tenglamalarni tanlash ham xuddi shu qoidaga tayanadi.",
      'Найдено: путь от пересечения назад к уравнениям опирается на то же самое правило.',
      'Found: going backward from the intersection to the equations relies on the same rule.',
    ),
    tasks: [
      {
        expr: 'x = 1,  x = 4',
        question: L(
          "Kesishishlarning x qiymatlari bir va to'rt. Tenglashtirilganda qaysi tenglama bu ikki x ni beradi?",
          'Значения x пересечений это один и четыре. Какое уравнение после приравнивания даёт эти два x?',
          'The x-values of the intersections are one and four. Which equation, after setting equal, gives these two x values?',
        ),
        ok: L("Ha. X minus bir, qavs, x minus to'rt, teng nol, bir va to'rtni beradi.", 'Да. x минус один, скобка, x минус четыре, равно нулю, даёт один и четыре.', 'Yes. x minus one, bracket, x minus four, equals zero, gives one and four.'),
        items: [
          { id: 'a', right: true, label: 'x² − 5x + 4 = 0' },
          { id: 'b', label: 'x² + 5x + 4 = 0', hint: L("Bu tenglamani yeching: ildizlar minus bir va minus to'rt chiqadi, bir va to'rt emas.", 'Реши это уравнение: корни получаются минус один и минус четыре, а не один и четыре.', 'Solve this equation: the roots come out minus one and minus four, not one and four.') },
        ],
        solution: ['(x − 1)(x − 4) = 0', 'x² − 5x + 4 = 0'],
      },
      {
        expr: 'x = −3',
        question: L(
          "Yagona kesishish nuqtasining x qiymati minus uch. Bitta kesishish uchun qaysi tenglama mos keladi?",
          'x-значение единственной точки пересечения это минус три. Какое уравнение подходит для одного пересечения?',
          'The x-value of the single intersection point is minus three. Which equation fits a single intersection?',
        ),
        ok: L("Ha. X qo'shi uch butun kvadrat teng nol, faqat bitta ildiz beradi: minus uch.", 'Да. x плюс три в квадрате равно нулю, даёт только один корень: минус три.', 'Yes. x plus three squared equals zero, gives only one root: minus three.'),
        items: [
          { id: 'a', right: true, label: '(x + 3)² = 0' },
          { id: 'b', label: '(x + 3)(x − 3) = 0', hint: L("Bu tenglamaning ikkita ildizi bor: minus uch va uch, bitta emas.", 'У этого уравнения два корня: минус три и три, а не один.', 'This equation has two roots: minus three and three, not one.') },
        ],
        solution: ['(x + 3)² = 0', L('x = −3 (bitta ildiz)', 'x = −3 (один корень)', 'x = −3 (one root)')],
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
    "Blits: kesishish, soni, tekshirish",
    'Блиц: пересечение, число, проверка',
    'Blitz: intersection, count, checking',
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
        tag: 'grafik-kesishish-nuqtasi',
        ask: L(
          "Ikki egri chiziq bir nuqtada kesishdi. Bu nuqta sistema bilan qanday bog'liq?",
          'Две линии пересеклись в одной точке. Как эта точка связана с системой?',
          'Two curves crossed at one point. How is this point related to the system?',
        ),
        options: [
          { id: 'right', right: true, label: L('U sistemaning yechimi', 'Это решение системы', "It is the system's solution") },
          { id: 'wrong', label: L("Hech qanday bog'liqligi yo'q", 'Никак не связана', 'Not related at all') },
        ],
        ok: L(
          "To'g'ri. Kesishish nuqtasi ikkala tenglamani ham qanoatlantiradi, demak u sistema yechimi.",
          'Верно. Точка пересечения удовлетворяет обоим уравнениям, значит это решение системы.',
          "Correct. The intersection point satisfies both equations, so it is the system's solution.",
        ),
        hint: L(
          "1-ekranni eslang: kesishish nuqtasida ikkala tenglama ham bir vaqtda to'g'ri bo'ladi.",
          'Вспомни 1 экран: в точке пересечения оба уравнения верны одновременно.',
          'Recall screen 1: at the intersection point both equations are true at the same time.',
        ),
      },
      {
        id: 'q2',
        tag: 'nechta-kesishish-notogri',
        ask: L(
          "Chiziq va parabola har doim aynan ikkita nuqtada kesishadimi?",
          'Прямая и парабола всегда пересекаются ровно в двух точках?',
          'Do a line and a parabola always cross at exactly two points?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q", 'Нет', 'No') },
          { id: 'yes', label: L('Ha, doim', 'Да, всегда', 'Yes, always') },
        ],
        ok: L(
          "To'g'ri. Ikkita, bitta yoki hech qanday umumiy nuqta bo'lishi mumkin, chiziqning joyiga bog'liq.",
          'Верно. Может быть две, одна или ни одной общей точки, в зависимости от положения прямой.',
          "Correct. There can be two, one, or no common points, depending on the line's position.",
        ),
        hint: L(
          "7-ekranni eslang: chiziqni yuqoriga ko'tarsangiz, kesishish soni o'zgaradi.",
          'Вспомни 7 экран: если поднять прямую выше, число пересечений меняется.',
          'Recall screen 7: if you raise the line higher, the number of intersections changes.',
        ),
      },
      {
        id: 'q3',
        tag: 'faqat-bir-chiziqda-tekshirish',
        ask: L(
          "Nomzod nuqta faqat bitta tenglamada mos keldi. Bu yetarlimi?",
          'Кандидатная точка подошла только одному уравнению. Этого достаточно?',
          'A candidate point fit only one equation. Is that enough?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q, ikkalasida ham tekshirish kerak", 'Нет, нужно проверить в обоих', 'No, it must be checked in both') },
          { id: 'yes', label: L('Ha, yetarli', 'Да, достаточно', 'Yes, enough') },
        ],
        ok: L(
          "To'g'ri. Kesishish uchun nuqta ikkala egri chiziqda ham yotishi shart.",
          'Верно. Для пересечения точка обязана лежать на обеих линиях.',
          'Correct. For an intersection, the point must lie on both curves.',
        ),
        hint: L(
          "12-ekranni eslang: Kamilaning nuqtasi bitta chiziqqa mos keldi, lekin parabolaga mos kelmadi, shuning uchun kesishish emas edi.",
          'Вспомни 12 экран: точка Камилы подошла одной линии, но не подошла параболе, поэтому не была пересечением.',
          "Recall screen 12: Kamila's point fit one line but not the parabola, so it was not an intersection.",
        ),
      },
      {
        id: 'q4',
        tag: 'nuqta-taxmin-emas-tekshiruv',
        ask: L(
          "Nuqta grafikda kesishishga o'xshab ko'rinsa, buni yozib qo'yish yetarlimi?",
          'Если точка на графике выглядит похожей на пересечение, достаточно ли просто записать её?',
          'If a point on the graph looks like an intersection, is it enough to just write it down?',
        ),
        options: [
          { id: 'no', right: true, label: L("Yo'q, sonda tekshirish kerak", 'Нет, нужна проверка числом', 'No, it must be checked with a number') },
          { id: 'yes', label: L("Ha, ko'rinishi yetarli", 'Да, внешнего вида достаточно', 'Yes, the appearance is enough') },
        ],
        ok: L(
          "To'g'ri. Ko'z bilan qarash taxmin beradi, faqat qo'yib hisoblash aniq javob beradi.",
          'Верно. На глаз получается лишь предположение, точный ответ даёт только подстановка и счёт.',
          'Correct. Looking with the eye gives only a guess, only substituting and computing gives a precise answer.',
        ),
        hint: L(
          "5-ekranni eslang: (ikki; uch) nuqtasi ham ikkala tenglamaga qo'yib, son bilan tasdiqlangan edi.",
          'Вспомни 5 экран: даже точку (два; три) подтвердили числом, подставив в оба уравнения.',
          'Recall screen 5: even the point (two; three) was confirmed with a number, by substituting into both equations.',
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
    "Grafik usul: kesishish, son, tekshirish",
    'Графический способ: пересечение, число, проверка',
    'The graphical method: intersection, count, checking',
  ),
  audio: [
    A('s0',
      "Birinchi ekranda kesishish nuqtalari sistema bilan qanday bog'liqligini taxmin qildingiz. Bugun aynan shu g'oyani to'liq egalladingiz.",
      'На первом экране ты предположил, как точки пересечения связаны с системой. Сегодня ты полностью освоил именно эту идею.',
      'On the first screen you guessed how the intersection points relate to the system. Today you fully mastered exactly this idea.'),
    A('s1',
      "Siz ikkala tenglamani tenglashtirishni, kesishish sonini va grafikdan o'qilgan nuqtani ikkalasida tekshirishni o'rgandingiz.",
      'Ты освоил приравнивание уравнений, число пересечений и проверку точки, прочитанной с графика, в обоих уравнениях.',
      'You learned setting the equations equal, the number of intersections, and checking a point read from the graph in both equations.'),
    A('s2',
      "Keyingi darsda o'rniga qo'yish usuli: sistemani algebraik yo'l bilan, chizmasiz yechish.",
      'В следующем уроке способ подстановки: решение системы алгебраическим путём, без рисунка.',
      'The next lesson covers the substitution method: solving a system algebraically, without a picture.'),
  ],
  props: {
    mark: '(2; 3)  ·  (−1; 0)',
    markNote: L(
      "kesishish nuqtalari",
      'точки пересечения',
      'the intersection points',
    ),
    lines: [
      L(
        "Kesishish nuqtasi sistema yechimi",
        'Точка пересечения это решение системы',
        "The intersection point is the system's solution",
      ),
      L(
        "Kesishish ikkita, bitta yoki nolta bo'lishi mumkin",
        'Пересечений может быть два, одно или ни одного',
        'There can be two, one, or no intersections',
      ),
      L(
        "Nuqta ikkala tenglamada ham tekshiriladi",
        'Точка проверяется в обоих уравнениях',
        'The point is checked in both equations',
      ),
    ],
    bridge: L(
      "Keyingi dars: o'rniga qo'yish usuli",
      'Следующий урок: способ подстановки',
      'Next lesson: the substitution method',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     tool: 'pick', scene: <TwoCurves dots={[[2, 3], [-1, 0]]} />, ...S1 },
  { role: 'support',  tag: 'grafik-kesishish-nuqtasi', ...S2 },
  { role: 'explain',  tag: 'grafik-kesishish-nuqtasi', ...S3 },
  { role: 'explain',  tag: 'nechta-kesishish-notogri', ...S4 },
  { role: 'explain',  tag: 'nuqta-taxmin-emas-tekshiruv', ...S5 },
  { role: 'explain',  tag: 'faqat-bir-chiziqda-tekshirish', ...S6 },
  { role: 'explain',  tag: 'nechta-kesishish-notogri', ...S7 },
  { role: 'rule',     tag: 'nuqta-taxmin-emas-tekshiruv', ...S8 },
  { role: 'practice', tool: 'drill', tag: 'nechta-kesishish-notogri', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'grafik-kesishish-nuqtasi', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'nechta-kesishish-notogri', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'faqat-bir-chiziqda-tekshirish', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'grafik-kesishish-nuqtasi', ...S13 },
  { role: 'blitz',    tool: 'blitz', ...S14,
    props: {
      ...S14.props,
      scoreLabel: L('birinchi urinishdan', 'с первой попытки', 'on the first try'),
      stepLabel: L('Savol', 'Вопрос', 'Question'),
    },
  },
  { role: 'summary',  tool: 'takeaway', scene: <TwoCurves dots={[[2, 3], [-1, 0]]} final />, ...S15 },
]

// PALITRA: sinf bo'yicha bitta konstanta, `asboblar.jsx`dagi `G9_RECOLOR`.
export default makeLesson({ META, STATEMENTS, MISS, SCREENS, styles: G9_STYLES, recolor: G9_RECOLOR })
