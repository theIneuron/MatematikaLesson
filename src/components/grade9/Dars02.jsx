// ============================================================================
// 9-sinf, Dars 2. FUNKSIYANING XOSSALARI: O'SISH VA KAMAYISH, JUFTLIK VA
// TOQLIK.
//
// REDAKSIYA 2, 2026-08-26. Birinchi variantda 3 va 4-ekran ikkita hisoblash
// va bitta savoldan iborat edi — metodist: «максимально объяснять шаг за
// шагом как решение и доказательство, отдельный слайд на возрастание,
// отдельный на убывание, с механикой и анимацией». Endi ikkalasi ham YANGI
// asbob — `Monotone` (asboblar.jsx) — bilan to'liq isbot sifatida quriladi:
// o'quvchi UCH nuqtani birma-bir grafikka qo'yadi (bosish bilan), har
// ikkinchisidan keyin x va y solishtiruvi jadvalda jonlanadi, oxirida esa
// umumiy xulosa (ta'rifning o'zi) ochiladi. 9-ekran ham shunga mos —
// bitta savol o'rniga haqiqiy zanjir, xuddi shu ko'nikmani uch marta
// mashq qiladi.
//
// Qolgan qismda YANGI asbob yo'q: juftlik/toqlik (x; f(x)) ni (−x; f(−x))
// bilan solishtirish umumiy qatlamning tayyor mexanikalari bilan yopiladi
// (RecallMC, CheckReveal — Dars01dan, Drill — grade8 qatlamidan). Prибор 1
// (grafik + ishorali o'q, PODXOD_9SINF.md §12) shu yerda ham to'liq
// yozilmaydi: ishoralar jadvali (kvadrat tengsizliklar) birinchi marta
// 6-darsda kerak bo'ladi — prибор o'sha yerda o'sadi, oldindan ko'rga
// yozilmaydi.
//
// DARSLIK. Algebra 9: §10 «Возрастание и убывание функции» (RU/UZ, 41–42-bet)
// va §11 «Четность и нечетность функции» (RU/UZ, 46–48-bet) — ikkalasi ham
// RENDER qilib o'qildi (matn qatlami bo'sh), ikkala til nashri ham (RU va UZ
// asl nashr, tarjima emas). §10dagi darajali funksiya y=x^r materiali
// (41–45-bet, turli r uchun) 10–11-sinf bazasi, bu darsga kirmaydi — faqat
// o'sish/kamayish ta'rifi va y=x, y=x² misollari olindi. §11dan ta'riflar va
// darslikning O'Z misollari: y=x² (juft), y=x³ (toq, 1-masala), y=2x+1
// (na juft, na toq — darslikning aynan o'z raqamlari bilan).
//
// TERMINOLOGIYA: UZ ta'riflar endi DRAFT EMAS — algebra_9_uzb.pdf shu
// dars uchun o'qildi va so'zma-so'z olindi (avval sinfda faqat RU nashr
// bor edi, ETALON_9SINF.md §3.2 shuni belgilagan edi).
//
// TEGLAR: Dars01 §8.5dagi «yopiq lug'at»ga amal qilmadi (o'zining to'rtta
// tegini kiritdi), shu dars ham xuddi shunday — mavzuning o'z xato turlari:
//   oldinga-orqaga   — «x o'sdi, demak funksiya o'sdi» (argument bilan
//                       qiymatning yo'nalishi aralashadi)
//   bitta-tarmoq     — butun grafik bitta yo'nalishda deb o'ylash, burilish
//                       nuqtasi (vershina) ko'rilmay qoladi
//   oyna-vs-burilish — juft funksiyaning oynadagidek (Oy o'qi), toqning esa
//                       boshga nisbatan burilish bilan simmetriyasi
//                       aralashtiriladi
//   bitta-nuqtada-xulosa — juftlik/toqlik BITTA songa qo'yib "isbotlanadi",
//                       darslikning o'zi buni y=2x+1 misolida rad etadi
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { L, MATH_FONT, RuleCard, T, useT } from '../grade8/core.jsx'
import { A, W, makeLesson } from '../grade8/screens.jsx'
import { CheckReveal, G9_RECOLOR, G9_STYLES, Monotone, Parity, Plane, RecallMC, pathOf, scaleOf } from './asboblar.jsx'

export const META = {
  id: 'grade9-02',
  n: 2,
  row: 2,
  block: 'Б1',
  topic: L('Funksiyaning xossalari', 'Свойства функции', 'Properties of a function'),
  voice: 'm',
  total: 15,
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "Agar oraliqda kattaroq x ga kattaroq y mos kelsa, funksiya shu oraliqda o'suvchi",
    'Если на промежутке большему x соответствует большее y, функция на нём возрастающая',
    'If a larger x gives a larger y on an interval, the function is increasing there',
  ),
  L(
    "Juft funksiyada y(−x) = y(x), grafik Oy o'qiga nisbatan oyna kabi simmetrik",
    'У чётной функции y(−x) = y(x), график симметричен относительно оси Oy, как в зеркале',
    'For an even function y(−x) = y(x), the graph is mirror-symmetric about the Oy axis',
  ),
  L(
    "Toq funksiyada y(−x) = −y(x), grafik koordinatalar boshiga nisbatan burilish bilan simmetrik",
    'У нечётной функции y(−x) = −y(x), график симметричен относительно начала координат поворотом',
    'For an odd function y(−x) = −y(x), the graph is symmetric about the origin by a half-turn',
  ),
]

export const MISS = {
  'oldinga-orqaga': {
    what: L(
      "argument o'sishi funksiya o'sishi bilan aralashtirildi",
      'рост аргумента перепутан с ростом функции',
      'the argument growing was confused with the function increasing',
    ),
    wrong: null,
    at: 0,
  },
  'bitta-tarmoq': {
    what: L(
      "butun grafik bitta yo'nalishda deb olindi, burilish ko'rilmadi",
      'весь график принят за одно направление, поворот не замечен',
      'the whole graph was taken as one direction, the turn was missed',
    ),
    wrong: null,
    at: 0,
  },
  'oyna-vs-burilish': {
    what: L(
      "oyna simmetriyasi bilan burilish simmetriyasi aralashtirildi",
      'зеркальная симметрия перепутана с симметрией поворотом',
      'mirror symmetry was confused with rotational symmetry',
    ),
    wrong: null,
    at: 0,
  },
  'bitta-nuqtada-xulosa': {
    what: L(
      "juftlik yoki toqlik bitta songa qo'yib xulosa qilindi",
      'чётность или нечётность выведена по одной подстановке',
      'evenness or oddness was concluded from a single substitution',
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// DARSNING FUNKSIYALARI. Uchtasi ham — darslikning O'Z misollari.
// ============================================================
// eslint-disable-next-line react-refresh/only-export-components
const QUAD = (x) => x * x                 // §10 va §11: y=x² (RU/UZ misoli)
// eslint-disable-next-line react-refresh/only-export-components
const CUBE = (x) => x * x * x             // §11: y=x³ (1-masala)
// eslint-disable-next-line react-refresh/only-export-components
const LINE21 = (x) => 2 * x + 1           // §11: y=2x+1 (na juft, na toq)
// eslint-disable-next-line react-refresh/only-export-components
const TEMP = (x) => 30 - ((x - 14) * (x - 14)) / 8   // faqat xuk sahnasi uchun

// ============================================================
// XUK SAHNASI: HARORAT KUN DAVOMIDA. `Plane` ni QAYTA yozmaslik uchun
// asboblar.jsx dan olib kelindi — SceneBand ICHIGA solinmaydi (u o'ziga
// xos <svg> beradi, Plane esa o'zi butun <svg>), shuning uchun oddiy
// <div> bilan o'raladi.
// ============================================================
const HOOK_SC = scaleOf({ from: 6, to: 22, yFrom: 18, yTo: 32 })
// eslint-disable-next-line react-refresh/only-export-components
const HookScene = () => {
  const t = useT()
  return (
    <div className="g9-scene-plain" aria-hidden="false">
      <Plane
        sc={HOOK_SC}
        xLabel={L('soat', 'час', 'hour')}
        yLabel={L('daraja', 'градус', 'degree')}
      >
        <g className="g9-real"><path d={pathOf(TEMP, HOOK_SC)} /></g>
        <circle
          cx={HOOK_SC.px(14)} cy={HOOK_SC.py(TEMP(14))} r="4"
          fill={T.accent}
        />
        <text x={HOOK_SC.px(9)} y={HOOK_SC.py(TEMP(9)) - 10}
          fontFamily="'Manrope', system-ui, sans-serif" fontSize="10" fill={T.ok}>
          {'↗ ' + t(L("o'sadi", 'растёт', 'rises'))}
        </text>
        <text x={HOOK_SC.px(18)} y={HOOK_SC.py(TEMP(18)) - 10}
          fontFamily="'Manrope', system-ui, sans-serif" fontSize="10" fill={T.tip}>
          {'↘ ' + t(L('kamayadi', 'падает', 'falls'))}
        </text>
      </Plane>
    </div>
  )
}

// ============================================================
// YAKUN SAHNASI: XUDDI SHU HARORAT GRAFIGI, endi ikki qism rang bilan
// ajratilgan — xukdagi savolga javob shu yerda ko'rinadi.
// ============================================================
const FIN_SC = scaleOf({ from: 6, to: 22, yFrom: 18, yTo: 32 })
// eslint-disable-next-line react-refresh/only-export-components
const FinalScene = () => {
  const t = useT()
  return (
    // `g8-scene-final`: 15-ekran sahnasi umumiy qatlamdan shu balandlik
    // byudjetini oladi (clamp 80-150px). Plane o'zining 32vh cheklovi
    // bilan qoladi, lekin bu klass ostida u ANIQ shu byudjetga siqiladi
    // (metodist QA, 2026-08-27: 1366x615 balandlikda 117px chiqib
    // ketgan edi — Plane sahna emas, umumiy grafik uchun mo'ljallangan).
    <div className="g9-scene-plain g8-scene-final">
      <Plane
        sc={FIN_SC}
        xLabel={L('soat', 'час', 'hour')}
        yLabel={L('daraja', 'градус', 'degree')}
      >
        <g className="g9-real"><path d={pathOf((x) => (x <= 14 ? TEMP(x) : null), FIN_SC)}
          stroke={T.ok} /></g>
        <g className="g9-real"><path d={pathOf((x) => (x >= 14 ? TEMP(x) : null), FIN_SC)}
          stroke={T.tip} /></g>
        <circle cx={FIN_SC.px(14)} cy={FIN_SC.py(TEMP(14))} r="4" fill={T.accent} />
        <text x={FIN_SC.px(10)} y={FIN_SC.top + 10}
          fontFamily="'Manrope', system-ui, sans-serif" fontSize="10" fill={T.ok}>
          {t(L("o'suvchi", 'возрастает', 'increasing'))}
        </text>
        <text x={FIN_SC.px(18)} y={FIN_SC.top + 10}
          fontFamily="'Manrope', system-ui, sans-serif" fontSize="10" fill={T.tip}>
          {t(L('kamayuvchi', 'убывает', 'decreasing'))}
        </text>
      </Plane>
    </div>
  )
}

// ============================================================
// EKRAN 1. XUK — BITTA GRAFIK, IKKI YO'NALISH.
//
// Haroratning kun davomida o'sib-tushishi — soddagina, tanish obyekt.
// Xatarli tushuncha: funksiya "har doim bir yo'nalishda yurishi kerak"
// degan kutish. To'g'ri javob buni rad etadi va 4-ekranga ko'prik quradi
// (y=x² ham xuddi shunday, vershinada yo'nalish almashadi).
// ============================================================
const S1 = {
  eyebrow: L('HARORAT', 'ТЕМПЕРАТУРА', 'TEMPERATURE'),
  title: L(
    "Bitta grafik, ikki yo'nalish",
    'Один график, два направления',
    'One graph, two directions',
  ),
  audio: [
    A('mount',
      "Kun davomida havo harorati avval ko'tariladi, keyin tushadi. Bitta chiziq, lekin ikki xil yo'nalish.",
      'В течение дня температура воздуха сначала поднимается, потом опускается. Одна линия, но два разных направления.',
      'During the day the air temperature first rises, then falls. One line, but two different directions.'),
    A('why',
      "Bu hali ham bitta funksiyami? To'rt javobdan birini tanlang.",
      'Это всё ещё одна функция? Выбери один из четырёх ответов.',
      'Is this still one function? Choose one of four answers.'),
  ],
  props: {
    // Kartochka va savol o'lchami Dars01 bilan bir xil (`g9-ask-big` +
    // `g9-cards-small`, asboblar.jsx) — metodist 2026-08-27: shrift katta,
    // matn ko'p ko'rinardi, bu ikkalasi ham 1-darsda shu ikki klass bilan
    // hal qilingan edi, lekin bu ekranga ulanmagan edi.
    askClass: 'g9-ask-big',
    cardsClass: 'g9-cards-small',
    ask: L(
      "Grafik avval o'sadi, keyin kamayadi. Bu qanday bo'lishi mumkin?",
      'График сначала растёт, потом убывает. Как такое возможно?',
      'The graph first rises, then falls. How is that possible?',
    ),
    items: [
      {
        id: 'two-fn',
        show: L("ikkita alohida funksiya, yonma-yon chizilgan", 'это две разные функции, просто нарисованные рядом', 'these are two separate functions, just drawn side by side'),
        hint: L(
          "Chiziq uzilmagan: vaqt o'tishi bilan bitta qoida ikkala qismni ham beradi, ikkita alohida formula shart emas.",
          'Линия не разрывается: одно и то же правило со временем даёт обе части, две отдельные формулы не нужны.',
          'The line does not break: one single rule gives both parts as time passes, no need for two separate formulas.',
        ),
      },
      {
        id: 'not-fn',
        show: L("bu funksiya emas, funksiya doim o'sishi kerak", 'это не функция, функция должна всегда расти', 'this is not a function, a function must always increase'),
        hint: L(
          "Funksiya ta'rifida yo'nalish haqida hech narsa yo'q. Har bir vaqtga bitta harorat mos kelsa, bu funksiya, o'sish esa shart emas.",
          'В определении функции ничего не сказано о направлении. Если каждому моменту соответствует одна температура, это функция, а рост не обязателен.',
          'The definition of a function says nothing about direction. If every moment gets one temperature, it is a function, and growth is not required.',
        ),
      },
      {
        id: 'right', right: true,
        show: L("bitta funksiya, u bir qismda o'sadi, boshqasida kamayadi", 'это одна функция, на одном участке она растёт, на другом убывает', 'it is one function, growing on one part and falling on another'),
      },
      {
        id: 'only-rise',
        show: L("funksiya faqat o'sgan qismida aniqlangan", 'функция определена только там, где растёт', 'the function is defined only where it rises'),
        hint: L(
          "Harorat tushayotgan paytlarda ham har bir soatga bitta son mos keladi, demak funksiya o'sha yerda ham aniqlangan.",
          'И когда температура падает, каждому часу тоже соответствует одно число, значит функция определена и там.',
          'Even while the temperature falls, every hour still gets one number, so the function is defined there too.',
        ),
      },
    ],
    after: L(
      "To'g'ri. Bitta funksiya bir oraliqda o'sishi, boshqasida kamayishi mumkin. Yo'nalish butun funksiyaning emas, aynan oraliqning xossasi.",
      'Верно. Одна функция может на одном промежутке возрастать, а на другом убывать. Это свойство не всей функции, а именно промежутка.',
      'Correct. One function can increase on one interval and decrease on another. Direction is a property of the interval, not of the whole function.',
    ),
  },
}

// ============================================================
// EKRAN 2. TAYANCH — ikki sonni solishtirish, 1-darsdan tanish harakat
// (formulaga son qo'yish). Bu yerda esa ikkita natija yonma-yon.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "Ikki natijani solishtirish",
    'Сравнение двух результатов',
    'Comparing two results',
  ),
  audio: [
    A('mount',
      "Formulaga ikkita son qo'yiladi, ikkita natija chiqadi.",
      'В формулу подставляются два числа, получаются два результата.',
      'Two numbers are substituted into the formula, giving two results.'),
    A('why',
      "Qaysi natija kattaroq, javob shundan boshlanadi.",
      'С того, какой результат больше, и начинается ответ.',
      'The answer starts from which result is bigger.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <CheckReveal
      ask={L(
        "y = 2x + 1. x = 1 da va x = 3 da, qaysi holatda y kattaroq?",
        'y = 2x + 1. При x = 1 и при x = 3, в каком случае y больше?',
        'y = 2x + 1. At x = 1 and at x = 3, when is y bigger?',
      )}
      items={[
        {
          id: 'x1',
          label: L('x = 1 da', 'при x = 1', 'at x = 1'),
          hint: L(
            "x bir bo'lgan hol bilan x uch bo'lgan holni solishtiring: uch kattaroq, va formulada x qancha katta bo'lsa, natija ham shuncha katta bo'ladi.",
            'Сравни, когда x равен одному, и когда x равен трём: три больше, а в этой формуле чем больше x, тем больше и результат.',
            'Compare when x is one and when x is three: three is bigger, and in this formula a bigger x gives a bigger result.',
          ),
        },
        { id: 'right', right: true, label: L('x = 3 da', 'при x = 3', 'at x = 3') },
      ]}
      done={L("To'g'ri.", 'Верно.', 'Correct.')}
      card={{
        title: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
        lines: [
          L('y = 2 · 1 + 1 = 3', 'y = 2 · 1 + 1 = 3', 'y = 2 · 1 + 1 = 3'),
          L('y = 2 · 3 + 1 = 7', 'y = 2 · 3 + 1 = 7', 'y = 2 · 3 + 1 = 7'),
          L(
            "Uch kattaroq son, va unga mos y ham kattaroq chiqdi.",
            'Три — большее число, и соответствующее ему y тоже оказалось больше.',
            'Three is the bigger number, and its y turned out bigger too.',
          ),
        ],
        locked: L(
          "Yechim to'g'ri javobdan keyin ochiladi",
          'Решение откроется после верного ответа',
          'The solution opens after a correct answer',
        ),
      }}
      graph={{
        f: LINE21, x: 3, y: 7,
        from: -0.5, to: 3.5, yFrom: -0.5, yTo: 7.5,
        xs: [0, 1, 2, 3],
      }}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. TUSHUNTIRISH 1 — O'SISHNING ISBOTI. y=x², x ≥ 0 tarmog'i.
//
// 2026-08-26, metodist qarori bilan qayta yozildi: bitta savol o'rniga
// UCH nuqtali to'liq isbot — o'quvchi grafikka nuqtalarni birma-bir
// qo'yadi, har ikkinchisidan keyin x va y solishtiruvi jonlanadi, oxirida
// ta'rifning o'zi (kattaroq x — kattaroq y) xulosa bo'lib ochiladi.
// ============================================================
const S3 = {
  eyebrow: L("O'SISH", 'ВОЗРАСТАНИЕ', 'INCREASING'),
  title: L(
    "O'sishning isboti: kattaroq x — kattaroq y",
    'Доказательство возрастания: больше x — больше y',
    'Proof of increasing: bigger x, bigger y',
  ),
  audio: [
    A('mount',
      "y teng x kvadratga, faqat x nol yoki undan katta qismida. Uchta nuqtani birma-bir qo'ying.",
      'y равен икс в квадрате, только там, где x нуль или больше. Ставь три точки одну за другой.',
      'y equals x squared, only where x is zero or more. Place three points one by one.'),
    A('why',
      "Har safar diqqat qiling: x qancha oshgani emas, y qanday o'zgargani muhim.",
      'Каждый раз следи не за тем, насколько вырос x, а за тем, как изменился y.',
      'Each time, watch not how much x grew, but how y changed.'),
    W('p3',
      "Uchala nuqta ham bir xil naqshni ko'rsatdi: x oshgan sari y ham oshdi.",
      'Все три точки показали один и тот же рисунок: чем больше x, тем больше y.',
      'All three points showed the same pattern: the bigger x, the bigger y.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <Monotone
      f={QUAD}
      xs={[0, 1, 2]}
      from={-0.3} to={2.5} yFrom={-0.3} yTo={4.5}
      xLabel={L('x', 'x', 'x')} yLabel={L('y', 'y', 'y')}
      ask={L(
        "Nuqtalarni birma-bir grafikka qo'ying",
        'Ставь точки на график одну за другой',
        'Place the points on the graph one by one',
      )}
      ruleLine={L(
        "Har safar x kattalashganda, y ham kattalashdi: demak funksiya shu oraliqda o'suvchi.",
        'Каждый раз, когда x увеличивался, y тоже увеличивался: значит функция на этом промежутке возрастающая.',
        'Every time x grew, y grew too: so the function is increasing on this interval.',
      )}
      after={L(
        "Uchala nuqta ham buni tasdiqladi.",
        'Все три точки подтвердили это.',
        'All three points confirmed this.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. TUSHUNTIRISH 2 — KAMAYISHNING ISBOTI VA BURILISH. y=x²,
// x ≤ 0 tarmog'i: x oshadi (minus ikkidan nolgacha), lekin y kamayadi.
// Darslikning o'zi shu misolni beradi (42-bet, RU/UZ). Xuddi 3-ekrandagi
// mexanika, endi teskari naqsh bilan — ikkalasi bir xil asbobda
// ko'rilgani uchun farq yanada ko'zga tashlanadi.
// ============================================================
const S4 = {
  eyebrow: L('KAMAYISH', 'УБЫВАНИЕ', 'DECREASING'),
  title: L(
    "Kamayishning isboti: xuddi shu grafik, boshqa tarmoq",
    'Доказательство убывания: тот же график, другая ветвь',
    'Proof of decreasing: the same graph, the other branch',
  ),
  audio: [
    A('mount',
      "Endi manfiy tarmoqdan uchta nuqta: x minus ikkidan nolgacha oshib boradi.",
      'Теперь три точки с отрицательной ветви: x растёт от минус двух до нуля.',
      'Now three points from the negative branch: x grows from minus two to zero.'),
    A('why',
      "Bu safar ehtiyot bo'ling: x baribir oshadi, lekin y bilan nima bo'lishini o'zingiz ko'rasiz.",
      'На этот раз будь внимателен: x всё так же растёт, а что будет с y, увидишь сам.',
      'This time be careful: x still grows, but watch what happens to y.'),
    W('p3',
      "Bu safar naqsh teskari: x oshgan sari y kichraydi.",
      'На этот раз рисунок обратный: чем больше x, тем меньше y.',
      'This time the pattern is reversed: the bigger x, the smaller y.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <Monotone
      f={QUAD}
      xs={[-2, -1, 0]}
      from={-2.5} to={0.3} yFrom={-0.3} yTo={4.5}
      xLabel={L('x', 'x', 'x')} yLabel={L('y', 'y', 'y')}
      ask={L(
        "Nuqtalarni birma-bir grafikka qo'ying",
        'Ставь точки на график одну за другой',
        'Place the points on the graph one by one',
      )}
      ruleLine={L(
        "Har safar x kattalashganda, y kichraydi: demak funksiya shu oraliqda kamayuvchi. Xuddi shu grafik: nol nuqtada yo'nalish almashadi.",
        'Каждый раз, когда x увеличивался, y уменьшался: значит функция на этом промежутке убывающая. Тот же самый график: в нуле направление меняется.',
        'Every time x grew, y shrank: so the function is decreasing on this interval. The very same graph: direction switches at zero.',
      )}
      after={L(
        "Uchala nuqta ham buni tasdiqladi.",
        'Все три точки подтвердили это.',
        'All three points confirmed this.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. TUSHUNTIRISH 3 — JUFTLIKNING ISBOTI VA FARQLASH. y=x².
//
// 2026-08-26, metodist qarori bilan qayta yozildi: bitta tekshiruv
// o'rniga IKKALASI ham (juftlik VA toqlik) shu bir misolda ochiladi —
// aynan shu qarama-qarshilikdan (biri mos keladi, biri yo'q) farqlash
// o'rgatiladi, tayyor xulosa aytilmaydi. Yangi asbob `Parity`
// (asboblar.jsx), Monotone bilan bir xil qo'l harakati: bosish, nuqta
// grafikka tushadi.
// ============================================================
const S5 = {
  eyebrow: L('OYNA', 'ЗЕРКАЛО', 'MIRROR'),
  title: L(
    "Juftlikning isboti: ikkala sinov ham bitta misolda",
    'Доказательство чётности: обе проверки на одном примере',
    'Proof of evenness: both checks on one example',
  ),
  audio: [
    A('mount',
      "y teng x kvadratga. Avval f ikkida, keyin f minus ikkida hisoblanadi va grafikka tushadi.",
      'y равен икс в квадрате. Сначала считаем f от двух, потом f от минус двух, и оба садятся на график.',
      'y equals x squared. First we find f of two, then f of minus two, and both land on the graph.'),
    A('why',
      "Shundan keyin ikkala sinov ham o'tkaziladi: avval juftlikka, keyin toqlikka. Ikkalasi bir vaqtda mos kelolmaydi.",
      'После этого проводятся обе проверки: сначала на чётность, потом на нечётность. Обе сразу совпасть не могут.',
      'After that, both checks run: first for evenness, then for oddness. Both cannot match at once.'),
    W('p3',
      "Juftlik sinovi mos keldi: f minus ikki f ikkiga teng chiqdi.",
      'Проверка на чётность совпала: f от минус двух равно f от двух.',
      'The even check matched: f of minus two equals f of two.'),
    W('p4',
      "Toqlik sinovi esa mos kelmadi. Shuning uchun bu funksiya aynan juft.",
      'А проверка на нечётность не совпала. Поэтому эта функция именно чётная.',
      'But the odd check did not match. So this function is exactly even.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <Parity
      f={QUAD}
      x={2}
      from={-2.5} to={2.5} yFrom={-0.5} yTo={4.5}
      xLabel={L('x', 'x', 'x')} yLabel={L('y', 'y', 'y')}
      ask={L(
        "Qadamlarni birma-bir oching",
        'Открывай шаги один за другим',
        'Open the steps one by one',
      )}
      ruleLine={L(
        "Juftlik sinovi mos keldi, toqlik sinovi mos kelmadi: demak funksiya juft. Grafik Oy o'qiga nisbatan oyna kabi.",
        'Проверка на чётность совпала, проверка на нечётность нет: значит функция чётная. График симметричен относительно оси Oy, как в зеркале.',
        'The even check matched, the odd check did not: so the function is even. The graph is mirror-symmetric about the Oy axis.',
      )}
      after={L(
        "Ikkala sinov ham o'tkazildi.",
        'Обе проверки проведены.',
        'Both checks are done.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. TUSHUNTIRISH 4 — TOQLIKNING ISBOTI VA FARQLASH. y=x³
// (darslik 1-masalasi). Xuddi shu ikki sinov, endi teskari natija bilan:
// ANIQ SHU xato tez-tez uchraydi — (−2)³ ni 2³ deb hisoblash, ya'ni
// darajaga ko'tarishda ishorani yo'qotish — shuning uchun audioda alohida
// ogohlantiriladi.
// ============================================================
const S6 = {
  eyebrow: L('BURILISH', 'ПОВОРОТ НА ПОЛОБОРОТА', 'HALF-TURN'),
  title: L(
    "Toqlikning isboti: xuddi shu ikki sinov, teskari natija",
    'Доказательство нечётности: те же две проверки, обратный результат',
    'Proof of oddness: the same two checks, the reverse result',
  ),
  audio: [
    A('mount',
      "Endi y teng x kub. Xuddi avvalgi ekrandagi ikki qadam, endi shu funksiyada.",
      'Теперь y равен икс в кубе. Те же два шага, что и на прошлом экране, но для этой функции.',
      'Now y equals x cubed. The same two steps as the last screen, now for this function.'),
    A('why',
      "Minus ikkini kubga ko'targanda ishorani yo'qotib qo'ymang: minus karra minus karra minus baribir minus bo'lib qoladi.",
      'Возводя минус два в куб, не потеряй знак: минус на минус на минус всё равно остаётся минусом.',
      'When you cube minus two, do not lose the sign: minus times minus times minus still ends up minus.'),
    W('p3',
      "Bu safar juftlik sinovi mos kelmadi.",
      'На этот раз проверка на чётность не совпала.',
      'This time the even check did not match.'),
    W('p4',
      "Toqlik sinovi esa mos keldi: f minus ikki, minus f ikkiga teng chiqdi. Shuning uchun bu funksiya toq.",
      'А проверка на нечётность совпала: f от минус двух равно минус f от двух. Поэтому эта функция нечётная.',
      'But the odd check matched: f of minus two equals minus f of two. So this function is odd.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <Parity
      f={CUBE}
      x={2}
      from={-2.5} to={2.5} yFrom={-8.5} yTo={8.5}
      xLabel={L('x', 'x', 'x')} yLabel={L('y', 'y', 'y')}
      ask={L(
        "Qadamlarni birma-bir oching",
        'Открывай шаги один за другим',
        'Open the steps one by one',
      )}
      ruleLine={L(
        "Toqlik sinovi mos keldi, juftlik sinovi mos kelmadi: demak funksiya toq. Grafik koordinatalar boshiga nisbatan burilish bilan simmetrik.",
        'Проверка на нечётность совпала, проверка на чётность нет: значит функция нечётная. График симметричен относительно начала координат поворотом.',
        'The odd check matched, the even check did not: so the function is odd. The graph is symmetric about the origin by a half-turn.',
      )}
      after={L(
        "Ikkala sinov ham o'tkazildi.",
        'Обе проверки проведены.',
        'Both checks are done.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. TUSHUNTIRISH 5 — CHEGARA HOLATI: NA JUFT, NA TOQ. Darslikning
// aynan o'z misoli va sonlari: y=2x+1, x=1 (juftlikni rad etadi) va
// x=2 (toqlikni rad etadi). Bu ekran `bitta-nuqtada-xulosa` xatosining
// o'zagi: BITTA son bilan tekshirish yetarli emasligini ko'rsatadi.
// ============================================================
const S7 = {
  eyebrow: L('CHEGARA', 'ГРАНИЦА', 'THE EDGE CASE'),
  title: L(
    "Na juft, na toq",
    'Ни чётная, ни нечётная',
    'Neither even nor odd',
  ),
  audio: [
    A('mount',
      "y teng ikki x qo'shi bir. Bu safar ikkita tekshiruv bor: avval juftlikka, keyin toqlikka.",
      'y равен два икс плюс один. На этот раз две проверки: сначала на чётность, потом на нечётность.',
      'y equals two x plus one. This time there are two checks: first for evenness, then for oddness.'),
    W('even',
      "Birda ikkisi teng emas chiqdi, demak funksiya juft emas.",
      'При единице оба оказались не равны, значит функция не чётная.',
      'At one the two were not equal, so the function is not even.'),
    A('why',
      "Endi toqlikni tekshiring: ikkida.",
      'Теперь проверь на нечётность: при двух.',
      'Now check for oddness: at two.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L('y = 2x + 1', 'y = 2x + 1', 'y = 2x + 1')}
      steps={[
        { id: 'even1', head: 'y(1)', lines: ['y(1) = 2·1 + 1', 'y(1) = 3'] },
        { id: 'even2', head: 'y(−1)', lines: ['y(−1) = 2·(−1) + 1', 'y(−1) = −1'] },
        { id: 'odd1', head: 'y(2)', lines: ['y(2) = 2·2 + 1', 'y(2) = 5'] },
        { id: 'odd2', head: '−y(2)', lines: ['−y(2) = −5'] },
        { id: 'odd3', head: 'y(−2)', lines: ['y(−2) = 2·(−2) + 1', 'y(−2) = −3'] },
      ]}
      ask={L(
        "y(1) uchdan, y(−1) minus birdan chiqdi, ular teng emas. y(−2) minus uchdan, −y(2) minus beshdan chiqdi, ular ham teng emas. Xulosa qanday?",
        'y(1) дало три, y(−1) дало минус один, они не равны. y(−2) дало минус три, −y(2) дало минус пять, тоже не равны. Какой вывод?',
        'y(1) gave three, y(−1) gave minus one, not equal. y(−2) gave minus three, −y(2) gave minus five, also not equal. What is the conclusion?',
      )}
      cols={1}
      items={[
        {
          id: 'right', right: true,
          label: L('Funksiya na juft, na toq', 'Функция ни чётная, ни нечётная', 'The function is neither even nor odd'),
        },
        {
          id: 'even',
          label: L('Funksiya juft', 'Функция чётная', 'The function is even'),
          hint: L(
            "Juft bo'lishi uchun y(1) va y(−1) teng bo'lishi kerak edi. Uch va minus bir, bu ikki xil son.",
            'Для чётности y(1) и y(−1) должны быть равны. Три и минус один, это разные числа.',
            'For evenness y(1) and y(−1) had to be equal. Three and minus one are different numbers.',
          ),
        },
        {
          id: 'odd',
          label: L('Funksiya toq', 'Функция нечётная', 'The function is odd'),
          hint: L(
            "Toq bo'lishi uchun y(−2) va −y(2) teng bo'lishi kerak edi. Minus uch va minus besh, bu ikki xil son.",
            'Для нечётности y(−2) и −y(2) должны быть равны. Минус три и минус пять, это разные числа.',
            'For oddness y(−2) and −y(2) had to be equal. Minus three and minus five are different numbers.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Ikkala tekshiruv ham buzildi, shuning uchun bu funksiya na juft, na toq. Har qanday funksiya ham ikkisidan biriga tegishli bo'lishi shart emas.",
        'Верно. Обе проверки нарушились, поэтому эта функция ни чётная, ни нечётная. Не каждая функция обязана быть одной из двух.',
        'Correct. Both checks failed, so this function is neither even nor odd. Not every function has to be one of the two.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 8. QOIDA. To'rtta ta'rif ham darslikdan SO'ZMA-SO'Z (RU va UZ
// nashri tekshirildi): §10 (42-bet) va §11 (46, 48-bet).
//
// RuleCard TO'RTTA alohida ta'rifni ko'taradi (bitta RecallMC card'iga
// sig'maydi), shuning uchun bu ekran `RuleScreen` deb atalgan kichik o'z
// o'ramiga ega: avval chek-savol (RecallMC), to'g'ri javobdan keyin
// qoida kartochkasi ochiladi. Ekran `render` ishlatgani uchun
// `screens.jsx`dagi umumiy `switch(scr.tool)` unga UMUMAN tegmaydi — u
// faqat `scr.props` ni tashqi asbobga uzatadi, `render` bergan ekranda
// esa har qanday boshqa maydon (masalan avvalgi noto'g'ri urinishdagi
// `rule`) jimgina o'qilmay qoladi. Shu sabab qoida ma'lumoti alohida,
// pastdagi `S8_RULE` konstantasida saqlanadi va `render` ichida qo'lda
// uzatiladi.
// ============================================================
const S8_RULE = {
  lines: [
    L(
      "Agar oraliqqa tegishli istalgan x1, x2 uchun x2 > x1 tengsizlikdan y(x2) > y(x1) kelib chiqsa, y(x) funksiya shu oraliqda o'suvchi funksiya deyiladi",
      'Функция y(x) называется возрастающей на некотором промежутке, если для любых x1, x2, принадлежащих данному промежутку, из неравенства x2 > x1 следует неравенство y(x2) > y(x1)',
      'A function y(x) is called increasing on an interval if for any x1, x2 in that interval, x2 > x1 implies y(x2) > y(x1)',
    ),
    L(
      "Agar x2 > x1 tengsizlikdan y(x2) < y(x1) kelib chiqsa, y(x) funksiya shu oraliqda kamayuvchi funksiya deyiladi",
      'Функция y(x) называется убывающей на некотором промежутке, если для любых x1, x2, принадлежащих этому промежутку, из x2 > x1 следует неравенство y(x2) < y(x1)',
      'A function y(x) is called decreasing on an interval if for any x1, x2 in that interval, x2 > x1 implies y(x2) < y(x1)',
    ),
    L(
      "Aniqlanish sohasidan olingan istalgan x uchun y(−x) = y(x) bo'lsa, funksiya juft funksiya deyiladi",
      'Функция y(x) называется чётной, если y(−x) = y(x) для любого x из области определения этой функции',
      'A function y(x) is called even if y(−x) = y(x) for every x in its domain',
    ),
    L(
      "Aniqlanish sohasidan olingan istalgan x uchun y(−x) = −y(x) bo'lsa, funksiya toq funksiya deyiladi",
      'Функция y(x) называется нечётной, если y(−x) = −y(x) для любого x из области определения этой функции',
      'A function y(x) is called odd if y(−x) = −y(x) for every x in its domain',
    ),
  ],
  source: L(
    "Algebra 9, 10-§ (42-bet), 11-§ (46, 48-bet)",
    'Алгебра 9, §10 (стр. 42), §11 (стр. 46, 48)',
    'Algebra 9, §10 (p. 42), §11 (p. 46, 48)',
  ),
}

function RuleScreen({ audio, onSolved, step, rule }) {
  const t = useT()
  const [open, setOpen] = useState(false)
  return (
    <>
      <RecallMC
        intro={L(
          "Avval belgini tanlang, keyin qoida ochiladi",
          'Сначала выбери признак, потом откроется правило',
          'Choose the sign first, then the rule opens',
        )}
        formula="y(−x) = y(x)  ·  y(−x) = −y(x)"
        steps={[]}
        ask={L(
          "y(−x) = y(x) tenglik qaysi xossaga tegishli?",
          'Равенство y(−x) = y(x) относится к какому свойству?',
          'The equality y(−x) = y(x) belongs to which property?',
        )}
        cols={2}
        items={[
          { id: 'even', right: true, label: L('juftlik', 'чётность', 'evenness') },
          {
            id: 'odd',
            label: L('toqlik', 'нечётность', 'oddness'),
            hint: L(
              "Toqlikda ishora almashadi: y(−x) manfiysi bilan y(x) tenglashadi, bu yerda esa ishorasiz teng.",
              'При нечётности знак меняется: y(−x) равен минус y(x), а здесь равенство без минуса.',
              'For oddness the sign flips: y(−x) equals minus y(x), but here the equality has no minus.',
            ),
          },
        ]}
        after={L(
          "To'g'ri. Ishorasiz tenglik bu juftlik, oynadagidek simmetriya.",
          'Верно. Равенство без минуса это чётность, симметрия как в зеркале.',
          'Correct. Equality with no minus sign is evenness, mirror symmetry.',
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
    "O'sish, kamayish, juftlik, toqlik",
    'Возрастание, убывание, чётность, нечётность',
    'Increasing, decreasing, even, odd',
  ),
  audio: [
    A('mount',
      "Beshta ekranda siz shu to'rtta xossani o'z qo'lingiz bilan tekshirdingiz. Endi ular qoida sifatida.",
      'На пяти экранах ты сам проверил эти четыре свойства. Теперь они в виде правила.',
      'On five screens you checked these four properties with your own hands. Now here they are as a rule.'),
    W('card',
      "Qoida ochildi. Ikkalasi ham darslikdan so'zma-so'z.",
      'Правило открылось. Оба определения даны дословно из учебника.',
      'The rule is open. Both definitions are word for word from the textbook.'),
  ],
  // RuleCard TO'RTTA alohida ta'rifni ko'taradi (bitta RecallMC card'iga
  // sig'maydi), shuning uchun bu ekran o'z holatiga ega kichik o'ram
  // (`RuleScreen`, pastda) orqali yig'iladi: avval chek-savol, undan keyin
  // qoida kartochkasi ochiladi. `render` ishlatilgani uchun `screens.jsx`
  // ning umumiy `switch(scr.tool)` shoxobchasi bu ekranga UMUMAN tegmaydi —
  // faqat `props` ichidagi maydonlar tashqi qatlamga o'tadi, tashqarida
  // yozilgan har qanday maydon (masalan `rule`) jimgina tashlab ketiladi.
  render: (args) => <RuleScreen {...args} rule={S8_RULE} />,
  ruleData: {
    lines: [
      L(
        "Agar oraliqqa tegishli istalgan x1, x2 uchun x2 > x1 tengsizlikdan y(x2) > y(x1) kelib chiqsa, y(x) funksiya shu oraliqda o'suvchi funksiya deyiladi",
        'Функция y(x) называется возрастающей на некотором промежутке, если для любых x1, x2, принадлежащих данному промежутку, из неравенства x2 > x1 следует неравенство y(x2) > y(x1)',
        'A function y(x) is called increasing on an interval if for any x1, x2 in that interval, x2 > x1 implies y(x2) > y(x1)',
      ),
      L(
        "Agar x2 > x1 tengsizlikdan y(x2) < y(x1) kelib chiqsa, y(x) funksiya shu oraliqda kamayuvchi funksiya deyiladi",
        'Функция y(x) называется убывающей на некотором промежутке, если для любых x1, x2, принадлежащих этому промежутку, из x2 > x1 следует неравенство y(x2) < y(x1)',
        'A function y(x) is called decreasing on an interval if for any x1, x2 in that interval, x2 > x1 implies y(x2) < y(x1)',
      ),
      L(
        "Aniqlanish sohasidan olingan istalgan x uchun y(−x) = y(x) bo'lsa, funksiya juft funksiya deyiladi",
        'Функция y(x) называется чётной, если y(−x) = y(x) для любого x из области определения этой функции',
        'A function y(x) is called even if y(−x) = y(x) for every x in its domain',
      ),
      L(
        "Aniqlanish sohasidan olingan istalgan x uchun y(−x) = −y(x) bo'lsa, funksiya toq funksiya deyiladi",
        'Функция y(x) называется нечётной, если y(−x) = −y(x) для любого x из области определения этой функции',
        'A function y(x) is called odd if y(−x) = −y(x) for every x in its domain',
      ),
    ],
    source: L(
      "Algebra 9, 10-§ (42-bet), 11-§ (46, 48-bet)",
      'Алгебра 9, §10 (стр. 42), §11 (стр. 46, 48)',
      'Algebra 9, §10 (p. 42), §11 (p. 46, 48)',
    ),
  },
}

// ============================================================
// EKRAN 9. MASHQ — ZANJIR. To'rtta qisqa savol ketma-ket: 3 va 4-ekranda
// isbotlangan ko'nikmaning O'ZI (ikki chekka nuqta y sini solishtirish),
// endi to'rt xil oraliqda, prиборsiz — sof tanish. `Drill` (grade8), xuddi
// 10–13-ekranlar bilan bir xil o'ram, faqat tezroq: yechim bitta qator.
// ============================================================
const S9 = {
  eyebrow: L('ZANJIR', 'ЦЕПОЧКА', 'THE CHAIN'),
  title: L(
    "Grafik bo'lagi: o'sadimi, kamayadimi",
    'Часть графика: возрастает или убывает',
    'A piece of the graph: increasing or decreasing',
  ),
  audio: [
    A('mount',
      "To'rtta qisqa savol ketma-ket. Har birida bitta oraliq beriladi.",
      'Четыре коротких вопроса подряд. В каждом даётся один промежуток.',
      'Four short questions in a row. Each one gives an interval.'),
    A('why',
      "Ikki chekka nuqtadagi y larni taqqoslang, boshqa hech narsa kerak emas.",
      'Сравнивай y на двух крайних точках, больше ничего не нужно.',
      'Compare y at the two endpoints, nothing else is needed.'),
  ],
  props: {
    stepLabel: L('Oraliq', 'Промежуток', 'Interval'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "To'rttasi ham tekshirildi: manfiy tarmoqda ikki marta kamaydi, musbat tarmoqda ikki marta o'sdi. Xuddi 3 va 4-ekranda ko'rgan naqsh.",
      'Все четыре проверены: на отрицательной ветви дважды убывала, на положительной дважды возрастала. Тот же рисунок, что на 3 и 4 экранах.',
      'All four are checked: on the negative branch it decreased twice, on the positive branch it increased twice. The same pattern you saw on screens 3 and 4.',
    ),
    tasks: [
      {
        expr: 'y = x²,  −3 ≤ x ≤ −2',
        question: L("Bu oraliqda funksiya qanday?", 'Как ведёт себя функция на этом промежутке?', 'How does the function behave on this interval?'),
        ok: L(
          "Ha. To'qqizdan to'rtga, x o'sganda y kichraydi.",
          'Да. От девяти к четырём, при росте x значение y уменьшилось.',
          'Yes. From nine to four, as x grew, y shrank.',
        ),
        items: [
          { id: 'a', right: true, label: L('kamayadi', 'убывает', 'decreasing') },
          {
            id: 'b', label: L("o'sadi", 'возрастает', 'increasing'),
            hint: L("Chekka qiymatlarni hisoblang: minus uchda to'qqiz, minus ikkida to'rt. To'qqizdan to'rtga tushish, bu kamayish.", 'Посчитай крайние значения: при минус трёх девять, при минус двух четыре. Спуск с девяти до четырёх, это убывание.', 'Compute the endpoints: at minus three nine, at minus two four. Falling from nine to four is decreasing.'),
          },
        ],
        solution: ['y(−3) = 9', 'y(−2) = 4', 'kamayadi'],
      },
      {
        expr: 'y = x²,  1 ≤ x ≤ 3',
        question: L("Bu oraliqda funksiya qanday?", 'Как ведёт себя функция на этом промежутке?', 'How does the function behave on this interval?'),
        ok: L(
          "Ha. Birdan to'qqizga, x o'sganda y ham o'sdi.",
          'Да. От одного к девяти, при росте x значение y тоже выросло.',
          'Yes. From one to nine, as x grew, y grew too.',
        ),
        items: [
          { id: 'a', label: L('kamayadi', 'убывает', 'decreasing'),
            hint: L("Chekka qiymatlarni hisoblang: birda bir, uchda to'qqiz. Birdan to'qqizga ko'tarilish, bu o'sish.", 'Посчитай крайние значения: при одном единица, при трёх девять. Подъём с единицы до девяти, это возрастание.', 'Compute the endpoints: at one, one; at three, nine. Rising from one to nine is increasing.') },
          { id: 'b', right: true, label: L("o'sadi", 'возрастает', 'increasing') },
        ],
        solution: ['y(1) = 1', 'y(3) = 9', "o'sadi"],
      },
      {
        expr: 'y = x²,  −1 ≤ x ≤ 0',
        question: L("Bu oraliqda funksiya qanday?", 'Как ведёт себя функция на этом промежутке?', 'How does the function behave on this interval?'),
        ok: L(
          "Ha. Birdan nolga, x o'sganda y kichraydi.",
          'Да. От единицы к нулю, при росте x значение y уменьшилось.',
          'Yes. From one to zero, as x grew, y shrank.',
        ),
        items: [
          { id: 'a', right: true, label: L('kamayadi', 'убывает', 'decreasing') },
          { id: 'b', label: L("o'sadi", 'возрастает', 'increasing'),
            hint: L("Chekka qiymatlarni hisoblang: minus birda bir, nolda nol. Birdan nolga tushish, bu kamayish.", 'Посчитай крайние значения: при минус одном единица, при нуле нуль. Спуск с единицы до нуля, это убывание.', 'Compute the endpoints: at minus one, one; at zero, zero. Falling from one to zero is decreasing.') },
        ],
        solution: ['y(−1) = 1', 'y(0) = 0', 'kamayadi'],
      },
      {
        expr: 'y = x²,  0 ≤ x ≤ 2',
        question: L("Bu oraliqda funksiya qanday?", 'Как ведёт себя функция на этом промежутке?', 'How does the function behave on this interval?'),
        ok: L(
          "Ha. Noldan to'rtga, x o'sganda y ham o'sdi.",
          'Да. От нуля к четырём, при росте x значение y тоже выросло.',
          'Yes. From zero to four, as x grew, y grew too.',
        ),
        items: [
          { id: 'a', label: L('kamayadi', 'убывает', 'decreasing'),
            hint: L("Chekka qiymatlarni hisoblang: nolda nol, ikkida to'rt. Noldan to'rtga ko'tarilish, bu o'sish.", 'Посчитай крайние значения: при нуле нуль, при двух четыре. Подъём с нуля до четырёх, это возрастание.', 'Compute the endpoints: at zero, zero; at two, four. Rising from zero to four is increasing.') },
          { id: 'b', right: true, label: L("o'sadi", 'возрастает', 'increasing') },
        ],
        solution: ['y(0) = 0', 'y(2) = 4', "o'sadi"],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ — YO'NALTIRILGAN (grade8 Drill, `guided` naqsh: bitta
// funksiya, uch qadam ketma-ket, tartib qattiq).
// ============================================================
const S10 = {
  eyebrow: L('QADAMLAB', 'ПО ШАГАМ', 'STEP BY STEP'),
  title: L(
    'y = x⁴ ning juftligi: uch qadam',
    'Чётность y = x⁴: три шага',
    'The evenness of y = x⁴: three steps',
  ),
  audio: [
    A('mount',
      "Bitta funksiya, uch qadam. Yordam yo'q, lekin har javobdan keyin yechim ochiladi.",
      'Одна функция, три шага. Помощи нет, но после каждого ответа откроется решение.',
      'One function, three steps. No help, but after each answer the solution opens.'),
    A('why',
      "Avval y(−x) ni toping, keyin uni y(x) bilan solishtiring, oxirida xulosa qiling.",
      'Сначала найди y(−x), потом сравни его с y(x), в конце сделай вывод.',
      'First find y(−x), then compare it with y(x), and finally draw the conclusion.'),
  ],
  props: {
    stepLabel: L('Qadam', 'Шаг', 'Step'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uch qadam ham to'ldi: y(−x) topildi, y(x) bilan solishtirildi, xulosa chiqdi. Har safar shu yo'l.",
      'Все три шага пройдены: найден y(−x), сравнён с y(x), сделан вывод. Каждый раз один и тот же путь.',
      'All three steps are done: y(−x) found, compared with y(x), a conclusion drawn. Same path every time.',
    ),
    tasks: [
      {
        expr: 'y = x⁴',
        question: L("y(−x) qanday yoziladi?", 'Как записать y(−x)?', 'How is y(−x) written?'),
        ok: L(
          "Ha. Minus x to'rtinchi darajaga, bu (−x)⁴.",
          'Да. Минус x в четвёртой степени, это (−x)⁴.',
          'Yes. Minus x to the fourth power, that is (−x)⁴.',
        ),
        items: [
          { id: 'a', right: true, label: '(−x)⁴' },
          {
            id: 'b', label: '−x⁴',
            hint: L("Bu yerda butun ifoda darajaga ko'tarilishi kerak, faqat x emas.", 'Здесь в степень нужно возвести всё выражение, а не только x.', 'Here the whole expression must be raised to the power, not just x.'),
          },
        ],
        solution: ['y(−x) = (−x)⁴'],
      },
      {
        expr: 'y = x⁴',
        question: L("(−x)⁴ neski teng?", 'Чему равно (−x)⁴?', 'What does (−x)⁴ equal?'),
        ok: L(
          "Ha. Juft darajada minus yo'qoladi, natija x to'rtinchi darajaga teng bo'ladi.",
          'Да. В чётной степени минус исчезает, результат равен x в четвёртой степени.',
          'Yes. In an even power the minus disappears, the result equals x to the fourth power.',
        ),
        items: [
          { id: 'a', right: true, label: 'x⁴' },
          {
            id: 'b', label: '−x⁴',
            hint: L("To'rt marta minusni ko'paytiring: juft son marta minus doim musbat beradi.", 'Перемножь минус четыре раза: чётное число минусов всегда даёт плюс.', 'Multiply the minus four times: an even number of minus signs always gives a plus.'),
          },
        ],
        solution: ['(−x)⁴ = x⁴'],
      },
      {
        expr: 'y = x⁴',
        question: L("Xulosa qanday?", 'Какой вывод?', 'What is the conclusion?'),
        ok: L(
          "Ha. y minus x va y x bir xil chiqdi, demak funksiya juft.",
          'Да. Получилось, что y от минус x равно y от x, значит функция чётная.',
          'Yes. We got y of minus x equal to y of x, so the function is even.',
        ),
        items: [
          { id: 'a', right: true, label: L('Funksiya juft', 'Функция чётная', 'The function is even') },
          {
            id: 'b', label: L('Funksiya toq', 'Функция нечётная', 'The function is odd'),
            hint: L("Toqlikda ishora almashishi kerak edi, bu yerda esa ishorasiz teng chiqdi.", 'При нечётности знак должен был поменяться, а здесь равенство вышло без минуса.', 'For oddness the sign should have flipped, but here the equality came out with no minus.'),
          },
        ],
        solution: ['y(−x) = x⁴ = y(x)', 'Funksiya juft'],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ — QOG'OZDA. Priborsiz: faqat formula va hisob. Yengildan
// og'irga, oxirgisi ATAYIN aralash (y=x⁵−x, na juft na toq bo'lishi mumkin
// bo'lganday tuyulsa ham, aslida toq — tekshirish shart, taxmin emas).
// ============================================================
const S11 = {
  eyebrow: L('QOG\'OZDA', 'НА БУМАГЕ', 'ON PAPER'),
  title: L(
    "Faqat hisob: juftmi, toqmi, boshqami",
    'Только счёт: чётная, нечётная или другая',
    'Just computation: even, odd, or other',
  ),
  audio: [
    A('mount',
      "Bu safar chizma yo'q. To'rtta funksiya, har birida y(−x) ni hisoblaysiz.",
      'На этот раз без рисунка. Четыре функции, в каждой считаешь y(−x).',
      'This time there is no picture. Four functions, and for each you compute y(−x).'),
    A('why',
      "Imtihonda ham priborsiz shunday hisoblanadi: qog'ozda, formula bilan.",
      'На контрольной тоже считают без прибора: на бумаге, по формуле.',
      'On a test it is computed the same way, without a tool: on paper, by formula.'),
  ],
  props: {
    stepLabel: L('Misol', 'Пример', 'Example'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "To'rttasi ham hisoblandi. Har biri bir xil savolga javob berdi: y(−x) qanday, y(x) bilan bir xilmi, ishorasi bilanmi, umuman yo'qmi.",
      'Все четыре посчитаны. Каждый ответил на один вопрос: каков y(−x) — совпадает с y(x), с минусом или вообще не совпадает.',
      'All four are computed. Each answered the same question: what is y(−x) — equal to y(x), equal with a minus, or neither.',
    ),
    tasks: [
      {
        expr: 'y = x² + 1',
        question: L("Funksiya qanday?", 'Какая это функция?', 'What kind of function is this?'),
        ok: L(
          "Ha. Natija x kvadrat qo'shi bir bilan bir xil chiqdi, ishora o'zgarmadi, funksiya juft.",
          'Да. Результат совпал с x в квадрате плюс один, знак не изменился, функция чётная.',
          'Yes. The result matches x squared plus one, the sign did not change, the function is even.',
        ),
        items: [
          { id: 'a', right: true, label: L('Juft', 'Чётная', 'Even') },
          { id: 'b', label: L('Toq', 'Нечётная', 'Odd') },
          { id: 'c', label: L('Na juft, na toq', 'Ни чётная, ни нечётная', 'Neither') },
        ],
        solution: ['y(−x) = (−x)² + 1', 'y(−x) = x² + 1 = y(x)', 'Juft'],
      },
      {
        expr: 'y = x³ − x',
        question: L("Funksiya qanday?", 'Какая это функция?', 'What kind of function is this?'),
        ok: L(
          "Ha. Natija minus x kub qo'shi x chiqdi, bu aynan minus y x ga teng, demak funksiya toq.",
          'Да. Результат равен минус x в кубе плюс x, это ровно минус y от x, функция нечётная.',
          'Yes. The result equals minus x cubed plus x, which is exactly minus y of x, the function is odd.',
        ),
        items: [
          { id: 'a', label: L('Juft', 'Чётная', 'Even'),
            hint: L("Juft bo'lsa (−x)³ − (−x) ifoda x³ − x bilan bir xil chiqishi kerak edi, u yerda ishoralar farq qiladi.", 'Для чётности (−x)³ − (−x) должно было совпасть с x³ − x, а здесь знаки различаются.', 'For evenness (−x)³ − (−x) had to match x³ − x, but the signs differ.') },
          { id: 'b', right: true, label: L('Toq', 'Нечётная', 'Odd') },
          { id: 'c', label: L('Na juft, na toq', 'Ни чётная, ни нечётная', 'Neither'),
            hint: L("Hisoblab ko'ring: natija aynan minus y(x) chiqadi, bu esa toqlik ta'rifining o'zi.", 'Посчитай: результат получается ровно минус y(x), а это и есть определение нечётности.', 'Compute it: the result is exactly minus y(x), which is the definition of oddness.') },
        ],
        solution: ['y(−x) = (−x)³ − (−x)', 'y(−x) = −x³ + x', 'y(−x) = −(x³ − x) = −y(x)', 'Toq'],
      },
      {
        expr: 'y = x + 3',
        question: L("Funksiya qanday?", 'Какая это функция?', 'What kind of function is this?'),
        ok: L(
          "Ha. (−x) + 3 na x + 3 ga, na uning minusiga teng emas.",
          'Да. (−x) + 3 не равно ни x + 3, ни его минусу.',
          'Yes. (−x) + 3 equals neither x + 3 nor its minus.',
        ),
        items: [
          { id: 'a', label: L('Juft', 'Чётная', 'Even'),
            hint: L("x nol bo'lganda tekshiring: natija tasodifan mos keladi, lekin x bir bilan tekshirsangiz teng chiqmaydi.", 'Проверь при x, равном нулю: получится совпадение, но при x, равном единице, равенства уже нет.', 'Check at x equal to zero: it matches, but at x equal to one the equality already fails.') },
          { id: 'b', label: L('Toq', 'Нечётная', 'Odd'),
            hint: L("x nolda tekshiring: toq funksiyada y(0) doim nolga teng bo'lishi kerak, bu yerda esa u uchga teng.", 'Проверь при x, равном нулю: у нечётной функции y(0) всегда должно быть нулём, а здесь оно равно трём.', 'Check at x equal to zero: for an odd function y(0) must always be zero, but here it is three.') },
          { id: 'c', right: true, label: L('Na juft, na toq', 'Ни чётная, ни нечётная', 'Neither') },
        ],
        solution: ['y(−x) = −x + 3', 'x + 3 ga teng emas, −(x + 3) ga ham teng emas', 'Na juft, na toq'],
      },
      {
        expr: 'y = 5',
        question: L("Funksiya qanday? (barcha x uchun y besh)", 'Какая это функция? (при любом x значение y равно пяти)', 'What kind of function is this? (y equals five for every x)'),
        ok: L(
          "Ha. y(−x) ham besh, ya'ni y(x) bilan bir xil, bu ham juftlikning bir turi.",
          'Да. y(−x) тоже равно пяти, то есть совпадает с y(x), это тоже вид чётности.',
          'Yes. y(−x) is also five, matching y(x), this too counts as even.',
        ),
        items: [
          { id: 'a', right: true, label: L('Juft', 'Чётная', 'Even') },
          { id: 'b', label: L('Toq', 'Нечётная', 'Odd'),
            hint: L("Toq bo'lsa, x nolda y ham nolga teng bo'lishi kerak edi. Bu yerda esa u har doim besh.", 'Для нечётности при x, равном нулю, y тоже должен быть нулём. А здесь он всегда пять.', 'For oddness, at x equal to zero y would have to be zero too. Here it is always five.') },
          { id: 'c', label: L('Na juft, na toq', 'Ни чётная, ни нечётная', 'Neither'),
            hint: L("y(−x) ni hisoblang: har qanday x da natija baribir besh, demak y(x) bilan bir xil.", 'Посчитай y(−x): при любом x результат всё равно пять, значит он совпадает с y(x).', "Compute y(−x): for any x the result is still five, so it matches y(x).") },
        ],
        solution: ['y(−x) = 5 = y(x)', 'Juft'],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ. Kamolaning "isbotida" hamma qadam to'g'ri ko'rinadi,
// lekin u faqat BITTA son (x=1) bilan tekshirib, "juft" degan xulosa
// chiqargan. Kontrpример (x=2) o'quvchining o'zi kiritadi.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Bitta son yetarlimi",
    'Достаточно ли одного числа',
    'Is one number enough',
  ),
  audio: [
    A('mount',
      "Kamolaning yechimi. y teng x kub minus ikki x kvadrat funksiyani u juft deb topdi.",
      'Решение Камолы. Функцию y равно x в кубе минус два икс в квадрате она признала чётной.',
      "Kamola's solution. She decided the function y equals x cubed minus two x squared is even."),
    A('why',
      "Uning qadamini o'qing va o'zingiz boshqa son bilan tekshiring.",
      'Прочитай её шаг и проверь сама другим числом.',
      'Read her step and check it yourself with another number.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L("TO'G'RI YECHIM", 'ВЕРНОЕ РЕШЕНИЕ', 'CORRECT SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Bitta son bilan tekshirish — dalil emas, faqat misol. Xato yoki to'g'rilikni bitta son rad etishi mumkin, lekin isbotlay olmaydi.",
      'Проверка одним числом — не доказательство, а лишь пример. Одно число может опровергнуть, но не может доказать.',
      'Checking with one number is not a proof, only an example. One number can disprove, but it cannot prove.',
    ),
    tasks: [
      {
        expr: 'y = x³ − 2x²',
        question: L(
          "Kamola x o'rniga nol qo'ydi: natija ham u yerda, ham bu yerda nolga teng chiqdi, ular teng, shuning uchun funksiya juft, deb yozdi. Bu xulosa nega noto'g'ri?",
          'Камола подставила вместо x нуль: результат в обоих случаях получился нулём, они равны, и она записала, что функция чётная. Почему этот вывод неверен?',
          'Kamola substituted zero for x: the result came out zero both times, they are equal, so she wrote that the function is even. Why is this conclusion wrong?',
        ),
        ok: L(
          "Ha. Nol o'zi o'ziga qarama-qarshi, shuning uchun u hech qachon hech narsani rad etolmaydi. Boshqa son, masalan bir, kerak.",
          'Да. Нуль сам себе противоположен, поэтому он никогда ничего не опровергнет. Нужно другое число, например единица.',
          'Yes. Zero is its own opposite, so it can never disprove anything. Another number is needed, for example one.',
        ),
        items: [
          {
            id: 'a', right: true,
            label: L("Bitta son, ustiga nol, hech narsani isbotlamaydi", 'Одно число, да ещё нуль, ничего не доказывает', 'One number, and zero at that, proves nothing'),
          },
          {
            id: 'b',
            label: L("y(0) hisoblashda xato bor", 'В вычислении y(0) есть ошибка', 'There is a mistake in computing y(0)'),
            hint: L("Bu qadam to'g'ri: nolni qo'ysangiz, chindan ham nol chiqadi.", 'Этот шаг верен: подставив нуль, действительно получаем нуль.', 'This step is correct: substituting zero really does give zero.'),
          },
          {
            id: 'c',
            label: L("Funksiya haqiqatan ham juft", 'Функция на самом деле чётная', 'The function really is even'),
            hint: L("Boshqa son bilan tekshiring, masalan bir bilan, natija buni rad etadi.", 'Проверь другим числом, например единицей, результат это опровергнет.', 'Check with another number, for example one, the result will disprove it.'),
          },
        ],
        solution: [
          'y(1) = 1³ − 2·1² = −1',
          'y(−1) = (−1)³ − 2·(−1)² = −1 − 2 = −3',
          'y(1) va y(−1) teng emas — funksiya juft emas',
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. TESKARI TOPSHIRIQ. Xossalar berilgan — mos funksiyani
// tanlash. Grafikni chizish emas, XOSSANI o'qib, formulani tanlash.
// ============================================================
const S13 = {
  eyebrow: L('TESKARI', 'ОБРАТНОЕ', 'THE REVERSE'),
  title: L(
    "Xossalardan formulaga",
    'От свойств к формуле',
    'From properties to the formula',
  ),
  audio: [
    A('mount',
      "Bu safar boshqa tomondan: xossa berilgan, formulani siz tanlaysiz.",
      'На этот раз наоборот: дано свойство, а формулу выбираешь ты.',
      'This time it is the other way round: the property is given, you choose the formula.'),
    A('why',
      "Har bir nomzodni y minus x bilan tekshiring, keyin tanlang.",
      'Проверь каждого кандидата через y от минус x, потом выбери.',
      'Check each candidate through y of minus x, then choose.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikkalasi ham topildi: xossadan formulaga yurish ham, formuladan xossaga yurish ham bir xil tekshiruvga tayanadi.",
      'Обе найдены: путь от свойства к формуле и путь от формулы к свойству опираются на одну и ту же проверку.',
      'Both were found: going from the property to the formula and from the formula to the property rely on the same check.',
    ),
    tasks: [
      {
        expr: 'y(−x) = −y(x)',
        question: L(
          "Toq funksiya kerak, shu shartga qaysi formula mos keladi?",
          'Нужна нечётная функция, какая формула подходит под это условие?',
          'An odd function is needed, which formula fits this condition?',
        ),
        ok: L(
          "Ha. x kub uchun, minus x ni kubga ko'tarsangiz natija minus x kubga teng chiqadi, bu aynan minus y x, toqlik shartiga mos keladi.",
          'Да. Для x в кубе минус x в кубе даёт минус x в кубе, то есть минус y от x, условие нечётности выполняется.',
          'Yes. For x cubed, minus x cubed gives minus x cubed, that is minus y of x, the condition for oddness holds.',
        ),
        items: [
          { id: 'a', label: 'y = x² + 2',
            hint: L("Bu funksiyada y minus x, y x bilan bir xil chiqadi, ishorasiz, bu juftlik, toqlik emas.", 'В этой функции y от минус x равно y от x, без минуса, это чётность, а не нечётность.', 'In this function y of minus x equals y of x, without a minus, that is evenness, not oddness.') },
          { id: 'b', right: true, label: 'y = x³' },
          { id: 'c', label: 'y = x + 1',
            hint: L("y(0) hisoblang: toq funksiyada u nolga teng bo'lishi kerak, bu yerda esa u birga teng.", 'Посчитай y(0): у нечётной функции оно должно быть нулём, а здесь оно равно единице.', 'Compute y(0): for an odd function it must be zero, but here it equals one.') },
        ],
        solution: ['y(−x) = (−x)³ = −x³', '−x³ = −y(x)', 'y = x³ mos keladi'],
      },
      {
        expr: 'y(−x) = y(x)',
        question: L(
          "Juft funksiya kerak, va u x musbat tomonda kamayishi kerak, qaysi formula mos keladi?",
          'Нужна чётная функция, и она должна убывать при положительных x, какая формула подходит?',
          'An even function is needed, decreasing for positive x, which formula fits?',
        ),
        ok: L(
          "Ha. Minus x kvadrat juft, ishorasiz teng chiqadi, va x musbat tomonda katta x kichikroq y beradi, demak kamayadi.",
          'Да. Минус x в квадрате чётная, равенство выходит без минуса, и при положительных x больший x даёт меньший y, значит убывает.',
          'Yes. Minus x squared is even, the equality holds without a minus, and for positive x a bigger x gives a smaller y, so it is decreasing.',
        ),
        items: [
          { id: 'a', right: true, label: 'y = −x²' },
          { id: 'b', label: 'y = x²',
            hint: L("Bu ham juft, lekin x musbat tomonda u kamaymaydi, o'sadi, buni 3 va 4-ekranlarda ko'rgan edingiz.", 'Она тоже чётная, но при положительных x не убывает, а растёт, это ты видел на 3 и 4 экранах.', 'It is also even, but for positive x it does not decrease, it increases, you saw that on screens 3 and 4.') },
          { id: 'c', label: 'y = −x³',
            hint: L("Bu funksiya toq: y minus x, minus y x ga teng, ishorasi bilan, juftlik shartiga mos emas.", 'Эта функция нечётная: y от минус x равно минус y от x, со знаком минус, условию чётности не подходит.', 'This function is odd: y of minus x equals minus y of x, with a minus sign, it does not fit the condition for evenness.') },
        ],
        solution: ['y(−x) = −(−x)² = −x² = y(x) — juft', 'x musbat tomonda katta x kichikroq y beradi — kamayadi'],
      },
    ],
  },
}

// ============================================================
// EKRAN 14. BLITS. To'rt savol, to'rtta teg birma-bir.
// ============================================================
const S14 = {
  eyebrow: L('BLITS', 'БЛИЦ', 'BLITZ'),
  title: L(
    "Blits: o'sish, kamayish, juftlik, toqlik",
    'Блиц: возрастание, убывание, чётность, нечётность',
    'Blitz: increasing, decreasing, even, odd',
  ),
  audio: [
    A('mount',
      "To'rtta savol birin ketin. Ular belgini so'raydi, uzoq hisobni emas.",
      'Четыре вопроса один за другим. Они спрашивают про признак, а не про долгий счёт.',
      'Four questions one after another. They ask about the sign, not a long computation.'),
    A('why',
      "Hisob birinchi urinish bo'yicha yuradi.",
      'Счёт идёт по первой попытке.',
      'The count goes by the first attempt.'),
  ],
  props: {
    items: [
      {
        id: 'q1',
        tag: 'bitta-tarmoq',
        ask: L(
          "y = x² grafigi vershinada burilib, avval kamayadi, keyin o'sadi. Bu bitta funksiyami?",
          'График y = x² в вершине поворачивает: сначала убывает, потом возрастает. Это одна функция?',
          'The graph of y = x² turns at the vertex: first decreasing, then increasing. Is this one function?',
        ),
        options: [
          { id: 'one', right: true, label: L('Ha, bitta', 'Да, одна', 'Yes, one') },
          { id: 'two', label: L("Yo'q, ikkita alohida funksiya", 'Нет, две разные функции', 'No, two separate functions') },
        ],
        ok: L(
          "To'g'ri. O'sish va kamayish, bitta funksiyaning turli oraliqlaridagi xossasi.",
          'Верно. Возрастание и убывание, это свойство разных промежутков одной функции.',
          'Correct. Increasing and decreasing are properties of different intervals of one function.',
        ),
        hint: L(
          "Formula bitta: y teng x kvadratga. Ikki xil oraliqda ikki xil yo'nalish bo'lishi, ikkita funksiya degani emas.",
          'Формула одна: y равен x в квадрате. Разное направление на разных промежутках не значит, что функций две.',
          'There is one formula: y equals x squared. Different direction on different intervals does not mean there are two functions.',
        ),
      },
      {
        id: 'q2',
        tag: 'oyna-vs-burilish',
        ask: L(
          "Juft funksiyaning grafigi qanday simmetrik?",
          'Как симметричен график чётной функции?',
          "How is an even function's graph symmetric?",
        ),
        options: [
          { id: 'mirror', right: true, label: L("Oy o'qiga nisbatan, oyna kabi", 'Относительно оси Oy, как в зеркале', 'About the Oy axis, like a mirror') },
          { id: 'origin', label: L('Koordinatalar boshiga nisbatan, burilish bilan', 'Относительно начала координат, поворотом', 'About the origin, by a half-turn') },
        ],
        ok: L(
          "To'g'ri. y minus x, y x bilan bir xil chiqishi, bu oyna simmetriyasi.",
          'Верно. Равенство y от минус x и y от x, это зеркальная симметрия.',
          'Correct. y of minus x equal to y of x is mirror symmetry.',
        ),
        hint: L(
          "Burilish bilan simmetriya toq funksiyaga tegishli, unda ishora almashadi.",
          'Симметрия поворотом это про нечётную функцию, там знак меняется.',
          'Rotational symmetry belongs to an odd function, where the sign flips.',
        ),
      },
      {
        id: 'q3',
        tag: 'bitta-nuqtada-xulosa',
        ask: L(
          "Bir funksiyani faqat x = bir bilan tekshirib, \"juft\" deb topdingiz. Bu yetarlimi?",
          'Ты проверил функцию только при x = один и получил «чётная». Этого достаточно?',
          'You checked a function only at x = one and got "even". Is that enough?',
        ),
        options: [
          {
            id: 'no', right: true,
            label: L("Yo'q, boshqa sonlar bilan ham tekshirish kerak", 'Нет, нужно проверить и другими числами', 'No, other numbers must be checked too'),
          },
          { id: 'yes', label: L('Ha, bitta son yetarli', 'Да, одного числа достаточно', 'Yes, one number is enough') },
        ],
        ok: L(
          "To'g'ri. Ta'rif istalgan x uchun deydi, bitta son esa faqat misol, dalil emas.",
          'Верно. Определение говорит про любое x, а одно число, лишь пример, не доказательство.',
          'Correct. The definition speaks of any x, and one number is only an example, not a proof.',
        ),
        hint: L(
          "Ikki x qo'shi bir misolini eslang: x bir bo'lganda tasodifan mos kelishi mumkin, boshqa sonda esa buziladi.",
          'Вспомни функцию два икс плюс один: при x, равном одному, может случайно совпасть, а при другом числе нарушится.',
          'Recall the function two x plus one: at x equal to one it might match by coincidence, but at another number it breaks.',
        ),
      },
      {
        id: 'q4',
        tag: 'oldinga-orqaga',
        ask: L(
          "Vaqt o'tishi bilan harorat tushadi. X (vaqt) o'sadi. Funksiya bilan nima bo'ladi?",
          'Со временем температура падает. X (время) растёт. Что происходит с функцией?',
          'Over time the temperature falls. X (time) grows. What happens to the function?',
        ),
        options: [
          { id: 'dec', right: true, label: L('U kamayadi', 'Она убывает', 'It is decreasing') },
          { id: 'inc', label: L("U ham o'sadi, chunki x o'smoqda", 'Она тоже растёт, ведь x растёт', 'It is also increasing, since x is growing') },
        ],
        ok: L(
          "To'g'ri. X o'sishi funksiyaning o'sishini emas, y ning o'zi qanday o'zgarishini belgilaydi.",
          'Верно. Рост x сам по себе не определяет рост функции, важно, как меняется именно y.',
          'Correct. X growing does not by itself determine whether the function grows, what matters is how y itself changes.',
        ),
        hint: L(
          "X va y ikki xil narsa. X doim jadval bo'ylab o'sadi, y esa oshishi ham, tushishi ham mumkin.",
          'X и y разные вещи. X всегда идёт по возрастанию в таблице, а y может и расти, и падать.',
          'X and y are different things. X always increases along the table, but y can rise or fall.',
        ),
      },
    ],
  },
}

// ============================================================
// EKRAN 15. YAKUN. Xukdagi savolga javob — harorat grafigi endi rangli:
// yashil qism o'suvchi, to'q qism kamayuvchi. Yangi matematika yo'q.
// ============================================================
const S15 = {
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L(
    "Funksiyaning to'rt xossasi",
    'Четыре свойства функции',
    'Four properties of a function',
  ),
  audio: [
    A('s0',
      "Birinchi ekranda harorat grafigi avval o'sib, keyin kamaygan edi. Endi bu ikki qism rang bilan ajratilgan.",
      'На первом экране график температуры сначала рос, потом падал. Теперь эти две части разделены цветом.',
      'On the first screen the temperature graph first rose, then fell. Now these two parts are separated by colour.'),
    A('s1',
      "Bugun to'rtta xossani o'rgandingiz: o'sish, kamayish, juftlik, toqlik. Har birini o'zingiz sonlar bilan tekshirdingiz.",
      'Сегодня освоены четыре свойства: возрастание, убывание, чётность, нечётность. Каждое ты проверил сам, числами.',
      'Today you learned four properties: increasing, decreasing, even, odd. You checked each one yourself, with numbers.'),
    A('s2',
      "Keyingi darsda kvadratik funksiya. Xuddi shu ikkita xossa parabolada qanday ko'rinishini ko'rasiz.",
      'В следующем уроке квадратичная функция. Увидишь, как эти же два свойства выглядят на параболе.',
      'The next lesson covers the quadratic function. You will see how these same two properties look on a parabola.'),
  ],
  props: {
    // `mark` TARJIMA QILINMAYDI (Takeaway uni t() siz {mark} qilib chiqaradi,
    // Dars01da ham shu yerda oddiy satr — «0 ≤ x ≤ 10» — turgan edi), shuning
    // uchun bu yerda ham til-betaraf belgi, gap emas.
    mark: '↗ ↘',
    markNote: L(
      "harorat avval ko'tarildi, keyin tushdi",
      'температура сначала поднялась, потом опустилась',
      'the temperature first rose, then fell',
    ),
    lines: [
      L(
        "O'sish va kamayish — funksiyaning emas, oraliqning xossasi",
        'Возрастание и убывание — свойство промежутка, а не всей функции',
        'Increasing and decreasing are properties of an interval, not of the whole function',
      ),
      STATEMENTS[1],
      L(
        "Juftlik yoki toqlik bitta son bilan isbotlanmaydi, faqat rad etilishi mumkin",
        'Чётность или нечётность нельзя доказать одним числом, им можно только опровергнуть',
        'Evenness or oddness cannot be proved with one number, only disproved by one',
      ),
    ],
    bridge: L(
      'Keyingi dars: kvadratik funksiya',
      'Следующий урок: квадратичная функция',
      'Next lesson: the quadratic function',
    ),
  },
}

// ============================================================
// EKRANLAR.
// ============================================================
export const SCREENS = [
  { role: 'hook',     tool: 'pick', scene: <HookScene/>, ...S1 },
  { role: 'support',  tag: 'oldinga-orqaga', ...S2 },
  { role: 'explain',  tag: 'oldinga-orqaga', ...S3 },
  { role: 'explain',  tag: 'bitta-tarmoq', ...S4 },
  { role: 'explain',  tag: 'oyna-vs-burilish', ...S5 },
  { role: 'explain',  tag: 'oyna-vs-burilish', ...S6 },
  { role: 'explain',  tag: 'bitta-nuqtada-xulosa', ...S7 },
  { role: 'rule',     tag: 'oyna-vs-burilish', ...S8 },
  { role: 'practice', tool: 'drill', tag: 'bitta-tarmoq', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'oyna-vs-burilish', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'oldinga-orqaga', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'bitta-nuqtada-xulosa', ...S12 },
  { role: 'transfer', tool: 'drill', tag: 'bitta-tarmoq', ...S13 },
  { role: 'blitz',    tool: 'blitz', ...S14,
    props: {
      ...S14.props,
      scoreLabel: L('birinchi urinishdan', 'с первой попытки', 'on the first try'),
      stepLabel: L('Savol', 'Вопрос', 'Question'),
    },
  },
  { role: 'summary',  tool: 'takeaway', scene: <FinalScene/>, ...S15 },
]

// PALITRA: sinf bo'yicha bitta konstanta, `asboblar.jsx`dagi `G9_RECOLOR`
// (metodist, 2026-08-27: bu darsning rangi Dars01dan farq qilardi, chunki
// bu yerga umuman ulanmagan edi). Alohida nusxa yozilmaydi.
export default makeLesson({ META, STATEMENTS, MISS, SCREENS, styles: G9_STYLES, recolor: G9_RECOLOR })
