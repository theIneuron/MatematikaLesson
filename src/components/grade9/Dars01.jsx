// ============================================================================
// 9-sinf, Dars 1. FUNKSIYA. FUNKSIYANING ANIQLANISH SOHASI.
//
// REDAKSIYA 2, 2026-08-20. Birinchi variant 8-sinf 1-darsining KARKASI bo'yicha
// yig'ilgan edi, va metodist to'g'ri aytdi: «faqat nusxa chiqdi, o'z
// mexanikangizni bering». Karkas bilan birga 8-sinfning ASBOBLARI ham ko'chib
// kelgan, asbob esa sinfning yuzi. Endi o'nta ekran 9-SINFNING O'Z
// asboblarida ishlaydi (`asboblar.jsx`), o'ram esa umumiy qoladi: shapka,
// progress, navigatsiya, ovoz va sahna — o'quvchi tugmani qaytadan izlamaydi.
//
// BESH ASBOB VA ULAR NIMANI ALMASHTIRDI:
//   Machine (2, 3, 13) — sonni solasiz, JUFTLIK chiqadi, juftliklar lotokda
//     YIG'ILADI. 8-sinfda o'rnida `steppers` edi: u bitta sonni buraydi va
//     natijani oldingisi ustiga yozadi, ya'ni jadval qolmaydi.
//   Board (4, 12) — moslik taxtasi: bitta x dan IKKINCHI strelka o'tmaydi.
//     Ta'rif asbobning ichida yashaydi, gapda emas. O'rnida to'rt kartochkadan
//     tanlash edi.
//   Trace (1, 5) — iz JUFTLIKLARDAN yig'iladi. 1-ekranda o'quvchi o'z
//     taxminini nuqta bilan qo'yadi, 5-ekranda 3-ekranda yig'ilgan juftliklar
//     tekislikka tushadi va birlashadi. O'rnida rasm tanlash va `plottap` edi.
//   Gate (6, 9, 10) — o'tkazish punkti: sonlarni «o'tadi» va «qiymat yo'q» ga
//     ajratadi, JAVOB ajratishdan yig'iladi. O'rnida `drill` edi, ya'ni tayyor
//     variantlardan tanlash.
//   Sweep (7) — tik chizg'ich: o'quvchi uni yuritib DALIL yig'adi.
//     O'rnida `parts` va `twoways` edi, ikkisi ham faqat ko'rsatadi.
//
// UMUMIY QATLAMDAN QOLGANI: qoida kartochkasi (8), erkin javob haqiqiy
// tekshiruv bilan (11), blits (14) va yakun (15). Bu baholash o'rami — uni
// har sinfga qaytadan yozadigan narsa yo'q, va aynan u mahsulotni bitta
// qilib turadi.
//
// DARSLIK. Algebra 9, 9-§ «Funksiyaning aniqlanish sohasi», 37-bet — kitobdan
// RENDER qilib o'qildi (matn qatlami bo'sh), ikkala nashr ham. Ta'rif va
// atamalar TARJIMA emas, o'zbek nashridan so'zma-so'z: `funksiya`, `argument`,
// `erkli o'zgaruvchi`, `erksiz o'zgaruvchi`, `aniqlanish sohasi`. 1-§ (5-bet)
// kvadrat funksiya — 3-darsga tegishli, bu darsga kirmaydi.
//
// REDAKSIYA 4, 2026-08-22. Choynak-termometr rasmi ham «tushunarsiz» deb
// topildi: metodist «bошqa yondashuv VA boshqa taqdim» so'radi, ya'ni bu safar
// obyekt EMAS, TUZILISHNING O'ZI o'zgardi. Endi ikki narsa AYRI ko'rsatiladi —
// vaqt (yugurchi trekda ketma-ket yuguradi, chapdan o'ngga) va qiymat
// (skoreboarddagi LED ustuni pastdan yuqoriga). Ilgari (lift, choynak) bitta
// vertikal harakat HAM vaqtni, HAM qiymatni bildirardi — shu narsa
// tushunishga xalaqit berardi. Sonlar formula bilan bog'langan:
// PULSE(x) = 20 · LIFT(x) + 60.
//
// DARSNING OBYEKTI — YUGURCHI VA STADION TABLOSI. Yurak urishi 3 daqiqada
// 120 zarbgacha oshadi, 5 daqiqagacha shu tezlikda turadi (eng yuqori kuch),
// 11 daqiqada 60 zarbgacha tushadi.
//
//   x, daq     0   1   2   3   4   5   6   7   8   9  10  11
//   y, zarb   60  80 100 120 120 120 110 100  90  80  70  60
//
// 120 zarb UCH paytda, 100 zarb IKKI paytda, 110 zarb ANIQ BITTA paytda,
// 12-daqiqada esa qiymat YO'Q — yugurish allaqachon tugagan.
//
// DARSNING UCH QADAMI: nima argument, nima qiymat ekanini ko'rish; formula
// qaysi qiymatlarda ma'noga ega ekanini tekshirish; aniqlanish sohasini yozish.
//
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L, MATH_FONT, Row, T, useT } from '../grade8/core.jsx'
import { SceneBand } from '../grade8/method.jsx'
import { A, W, makeLesson } from '../grade8/screens.jsx'
import { F } from '../grade8/tools.jsx'
import {
  CheckReveal, G9_RECOLOR, G9_STYLES, Gate, GraphPick, RecallMC, RuleBuild,
  TimeScrubber, Trace,
} from './asboblar.jsx'

export const META = {
  id: 'grade9-01',
  n: 1,
  row: 1,
  block: 'Б1',
  topic: L('Funksiya', 'Функция', 'Function'),
  voice: 'm',
  total: 15,
  // O'TISH QULFI YO'Q (metodist, 2026-08-20: «убери блокировку переходов между
  // слайдов»). «Davom etish» har doim ochiq, ekranni yechmasdan ham o'tish
  // mumkin. Bu FAQAT o'tishga tegishli: javob qulfi (`useInstructionGate`)
  // joyida qoladi, u ovoz gapirib turganda javobni bermaydi va metodik talab
  // bo'lib qoladi.
  //
  // Qulf butun qatlamga emas, SHU DARSGA olib tashlangan: `FREE_NAV`
  // konstantasi 8-sinf bilan umumiy, va uni almashtirish parallel ishning
  // xatti-harakatini o'zgartirardi.
  freeNav: true,
}

export const STATEMENTS = [
  L(
    "Argumentning har bir qiymatiga funksiyaning aynan bitta qiymati mos keladi",
    'Каждому значению аргумента отвечает ровно одно значение функции',
    'Each value of the argument gets exactly one value of the function',
  ),
  L(
    "Aniqlanish sohasi — argument qabul qilishi mumkin bo'lgan barcha qiymatlar",
    'Область определения — все значения, которые может принимать аргумент',
    'The domain is every value the argument may take',
  ),
  L(
    "Formula bilan berilgan funksiya formula ma'noga ega bo'lgan joyda aniqlangan",
    'Функция, заданная формулой, определена там, где формула имеет смысл',
    'A function given by a formula is defined where the formula makes sense',
  ),
]

export const MISS = {
  'argument-qiymat': {
    what: L(
      "argument va qiymat almashtirildi",
      'аргумент и значение перепутаны',
      'argument and value swapped',
    ),
    wrong: null,
    at: 0,
  },
  'grafik-rasm': {
    what: L(
      "grafik yo'l rasmi deb o'qildi",
      'график прочитан как рисунок пути',
      'the graph read as a picture of the path',
    ),
    wrong: null,
    at: 0,
  },
  'soha-suratdan': {
    what: L(
      "aniqlanish sohasi formula buziladigan joydan olinmadi",
      'область определения взята не там, где формула теряет смысл',
      'the domain was not taken where the formula breaks',
    ),
    wrong: '1/(x-3)',
    at: 3,
  },
  'tekshirilmagan': {
    what: L(
      "javob son qo'yib tekshirilmadi",
      'ответ не проверен подстановкой числа',
      'the answer was not checked with a number',
    ),
    wrong: null,
    at: 0,
  },
}

// ============================================================
// DARSNING FUNKSIYALARI. Bitta joyda yozilgan: ularni mashina, tekislik,
// chizg'ich va sahnalar OLADI. Shuning uchun podpis chizma bilan
// bir-biridan ajralib ketolmaydi.
// ============================================================
// TO'P: yuqoriga otilgan, 0 dan 10 soniyagacha havoda, 5-soniyada eng
// baland nuqta. h(t) = 0.1875 · t · (10 − t) — shu formuladan 2 va 8-soniya
// aynan 3 metr beradi (1-ekranda tasdiqlangan son), 4 va 6-soniya 4,5 metr.
const FLIGHT = 10
// eslint-disable-next-line react-refresh/only-export-components
const BALL = (x) => {
  if (x < 0 || x > FLIGHT) return null   // qo'lga qaytgandan keyin QIYMAT YO'Q
  return 0.1875 * x * (10 - x)
}

// 6-ekran: 1 ni (x − 3) ga bo'lish. 9-ekran: x − 3 dan ildiz.
// eslint-disable-next-line react-refresh/only-export-components
const DIV3 = (x) => (x === 3 ? null : 1 / (x - 3))
// eslint-disable-next-line react-refresh/only-export-components
const ROOT3 = (x) => (x < 3 ? null : Math.sqrt(x - 3))
const SC_SEC = L('x, s', 'x, с', 'x, s')
const SC_HEIGHT = L('y, m', 'y, м', 'y, m')
const SC_U_SEC = L('s', 'с', 's')
const SC_U_METER = L('m', 'м', 'm')
const SC_TOSS = L("to'p", 'мяч', 'the ball')

// ============================================================
// XUK SAHNASI: IKKI TABLONING BAHSI.
//
// 2026-08-22, to'rtinchi urinish. Metodist internetdan izlanishni so'radi:
// mavzu uchun ENG STANDART misol — yuqoriga otilgan TO'P. Balandlik bir xil
// qiymatdan ikki marta o'tadi: biri ko'tarilishda, biri tushishda. Bu darslik
// va videolarda eng ko'p qaytariladigan misol (parabola, h(t)).
//
// HOZIRCHA FAQAT SHU EKRAN qayta qurilgan — metodist tasdiqlashini kutamiz,
// keyin qolgan ekranlar (3, 4, 5, 7, 12, 13, 15 — hozircha yugurchi/zarb
// syujetida) shu obyektga o'tkaziladi.
//
// To'pning izi to'g'ri chiziqda EMAS, oldindan xira parabola bilan
// chizilgan — bu keyinroq 5-ekranda haqiqiy grafik bo'lib ochiladigan
// narsaning oldindan ko'rinishi. Belgilangan balandlikdan o'tgan AYNAN
// o'sha paytda o'ngda plashka chiqadi: birinchisi ko'tarilishda,
// ikkinchisi tushishda. Qarama-qarshilik AYTILMAYDI, u ko'z oldida sodir
// bo'ladi.
// ============================================================

// eslint-disable-next-line react-refresh/only-export-components
const Plate = ({ y, cls, min, val, minUnit, valUnit }) => {
  const t = useT()
  const midY = y + 20
  return (
    <g className={'g9-plate ' + cls}>
      <rect x="208" y={y} width="180" height="40" rx="11" fill={T.paper}
        stroke="rgba(23,26,29,.16)" strokeWidth="1.3"/>

      {/* SEKUNDOMER: vaqt so'z bilan aytilmaydi, chizib ko'rsatiladi. */}
      <g transform={'translate(228,' + midY + ')'}>
        <circle r="7" fill="none" stroke={T.ink3} strokeWidth="1.4"/>
        <line x1="-2.2" y1="-8.6" x2="2.2" y2="-8.6" stroke={T.ink3} strokeWidth="1.3" strokeLinecap="round"/>
        <line x1="0" y1="-7" x2="0" y2="-9.6" stroke={T.ink3} strokeWidth="1.3" strokeLinecap="round"/>
        <line x1="0" y1="0" x2="0" y2="-4.4" stroke={T.ink3} strokeWidth="1.3" strokeLinecap="round"/>
        <line x1="0" y1="0" x2="3.2" y2="1.6" stroke={T.ink3} strokeWidth="1.3" strokeLinecap="round"/>
      </g>
      <text x="245" y={y + 26} fontFamily={MATH_FONT} fontSize="17" fill={T.ink}>
        {min + ' ' + t(minUnit)}
      </text>

      <text x="286" y={y + 25} fontFamily="'Manrope', system-ui, sans-serif" fontSize="13"
        fill={T.ink3}>{'→'}</text>

      {/* RULETKA: balandlik ham so'z bilan emas, o'lchov asbobi bilan. */}
      <g transform={'translate(322,' + midY + ')'}>
        <rect x="-3.4" y="-8" width="6.8" height="16" rx="1.6" fill="none" stroke={T.accent} strokeWidth="1.3"/>
        <line x1="-3.4" y1="-3.2" x2="0" y2="-3.2" stroke={T.accent} strokeWidth="1.1"/>
        <line x1="-3.4" y1="0.4" x2="0" y2="0.4" stroke={T.accent} strokeWidth="1.1"/>
        <line x1="-3.4" y1="4" x2="0" y2="4" stroke={T.accent} strokeWidth="1.1"/>
      </g>
      <text x="370" y={y + 26} textAnchor="end" fontFamily={MATH_FONT} fontSize="17"
        fontWeight="600" fill={T.accent}>{val + ' ' + t(valUnit)}</text>
    </g>
  )
}

// ============================================================
// TO'P. Faqat XUK uchun — doim avtomatik o'ynaydi (`ride`), qo'lda
// boshqarish holati kerak emas.
//
// 2026-08-22, beshinchi urinish: metodist «to'p yo'l ustida yursin, rang
// ham realroq bo'lsin» dedi. YO'LNING O'ZI VA TO'PNING HARAKATI ENDI
// BITTA FORMULADAN: parabola M40,140 Q100,-10 160,140 uchun x(t)=40+120t,
// y(t)=140-300t+300t^2 — CSS'dagi `g9-toss-ride` shu formuladan o'nta
// nuqtada hisoblangan (asboblar.jsx, izoh bilan). Rasm — basketbol to'pi:
// to'q sarg'ish (accent) tanasi, ikki egri chok, ustida yorug' nur.
// Uchishda o'z o'qi atrofida aylanadi (`g9-toss-spin`, yo'ldan mustaqil).
// ============================================================
// eslint-disable-next-line react-refresh/only-export-components
const Toss = () => {
  const t = useT()
  return (
  <g>
    {/* QOIDA: to'p O'ZI HOHLAGANCHA emas, FORMULA bo'yicha uchadi — aniq
        sonlar shart emas, lekin qonun borligi ko'rinishi kerak. */}
    <rect x="14" y="8" width="92" height="26" rx="7" fill={T.paper} stroke="rgba(23,26,29,.16)" strokeWidth="1.1"/>
    <text x="60" y="25" textAnchor="middle" fontFamily={MATH_FONT} fontSize="12" fill={T.ink}>
      h(t) = vt − ½gt²
    </text>

    <line x1="20" y1="140" x2="180" y2="140" stroke="rgba(23,26,29,.20)" strokeWidth="2"/>

    {/* IZ: to'pning yo'li — 5-ekranda shu chiziq haqiqiy grafik bo'lib
        ochiladi, shuning uchun oldindan xira ko'rinadi. */}
    <path d="M40,140 Q100,-10 160,140" fill="none" stroke={T.accent} strokeWidth="1.4"
      strokeDasharray="3 5" opacity=".35"/>

    {/* BELGILANGAN BALANDLIK: uch metr, ikki marta kesib o'tiladi (t=0.2
        va t=0.8da, ya'ni y=92). */}
    <line x1="20" y1="92" x2="180" y2="92" stroke={T.accent} strokeWidth="1.4"
      strokeDasharray="5 4" opacity=".75"/>
    <text x="184" y="96" fontFamily={MATH_FONT} fontSize="11" fill={T.accent}>3 m</text>

    {/* O'LCHOV: «3 m» so'zi emas, yerdan chizilgan balandlik — chizmachilik
        chizig'i kabi, ikki uchida ko'ndalang chiziq bilan. Metodist: «3 m
        nima ekani tushunarsiz» — endi bu YERDAN SHU CHIZIQQACHA. */}
    <line x1="26" y1="140" x2="26" y2="92" stroke={T.accent} strokeWidth="1.4"/>
    <line x1="21" y1="140" x2="31" y2="140" stroke={T.accent} strokeWidth="1.4"/>
    <line x1="21" y1="92" x2="31" y2="92" stroke={T.accent} strokeWidth="1.4"/>
    <rect x="4" y="108" width="20" height="16" rx="4" fill={T.paper}/>
    <text x="14" y="120" textAnchor="middle" fontFamily={MATH_FONT} fontSize="10.5"
      fill={T.accent}>3 m</text>

    {/* BOG'LOVCHI: kesishish nuqtasidan plashkagacha — qaysi o'qish
        qayerdan olinganini animatsiyani kutmasdan ham ko'rish mumkin.
        `g9-plate-a/-b` bilan BIR XIL kechikishda chiqadi. */}
    <g className="g9-plate g9-plate-a">
      <line x1="64" y1="92" x2="208" y2="42" stroke={T.accent} strokeWidth="1" strokeDasharray="2 3" opacity=".55"/>
      <circle cx="64" cy="92" r="3.4" fill={T.paper} stroke={T.accent} strokeWidth="1.6"/>
    </g>
    <g className="g9-plate g9-plate-b">
      <line x1="136" y1="92" x2="208" y2="106" stroke={T.accent} strokeWidth="1" strokeDasharray="2 3" opacity=".55"/>
      <circle cx="136" cy="92" r="3.4" fill={T.paper} stroke={T.accent} strokeWidth="1.6"/>
    </g>

    <g className="g9-toss-shadow">
      <ellipse cx="100" cy="140" rx="9" ry="3" fill="rgba(23,26,29,.22)"/>
    </g>
    <g className="g9-toss-ride">
      <g className="g9-toss-spin">
        <circle cx="100" cy="65" r="9" fill={T.accent} stroke="rgba(23,26,29,.35)" strokeWidth="1.2"/>
        <line x1="100" y1="56" x2="100" y2="74" stroke="rgba(23,26,29,.35)" strokeWidth="1"/>
        <path d="M100,56 Q87,65 100,74" fill="none" stroke="rgba(23,26,29,.35)" strokeWidth="1"/>
        <path d="M100,56 Q113,65 100,74" fill="none" stroke="rgba(23,26,29,.35)" strokeWidth="1"/>
        <ellipse cx="97" cy="61" rx="2.6" ry="1.6" fill="rgba(255,255,255,.55)"/>
      </g>
    </g>

    <text x="100" y="150" textAnchor="middle" fontFamily="'Manrope', system-ui, sans-serif"
      fontSize="7" letterSpacing="0.6" fill={T.ink3}>{t(SC_TOSS)}</text>
  </g>
  )
}

// ============================================================
// TO'P, IXTIYORIY PAYTDA. Toss bilan bir xil chizma, lekin CSS animatsiya
// EMAS — 3-ekranning sirg'ituvchisi ixtiyoriy `t` ga borishi kerak, shuning
// uchun holat formuladan JONLI hisoblanadi: dx=12(t−5), dy=3(t−5)^2 — bu
// aynan Toss'ning xira parabolasi (M40,140 Q100,-10 160,140) ustidagi
// nuqta, endi kadr emas, o'zgaruvchi.
// ============================================================
const PEAK_H = BALL(5)
// eslint-disable-next-line react-refresh/only-export-components
const TossAt = ({ t: at, jammed }) => {
  const tt = useT()
  // JAMMED holatda to'p PIK EMAS, allaqachon QO'LGA QAYTGAN joyda (t=10
  // bilan bir xil ofset) turishi kerak — aks holda «balandlik yo'q» degan
  // gap bilan to'pning pikda ko'rinishi ziddiyatli bo'lardi.
  const h = at === null || at === undefined ? null : BALL(at)
  // 2026-08-22: gorizontal siljish 12'dan 24'ga oshirildi — figura KENGROQ
  // bo'lishi kerak edi, lekin oldingi urinishda faqat BO'SH viewBox
  // kattalashtirilgan edi, chizmaning o'zi emas (metodist: «hali ham
  // kichkina»). Endi to'p haqiqatan ham kengroq masofani bosib o'tadi.
  const dx = at === null || at === undefined ? 120 : 24 * (at - 5)
  const dy = at === null || at === undefined ? 75 : 3 * (at - 5) * (at - 5)
  const frac = h ? h / PEAK_H : 0
  const col = jammed ? T.tip : T.accent
  return (
    <g>
      <line x1="-40" y1="140" x2="240" y2="140" stroke="rgba(23,26,29,.20)" strokeWidth="2"/>
      <path d="M-20,140 Q100,-10 220,140" fill="none" stroke={T.accent} strokeWidth="1.4"
        strokeDasharray="3 5" opacity=".35"/>
      <ellipse cx={100 + dx} cy="140" rx={9 * (1 - 0.68 * frac)} ry={3 * (1 - 0.68 * frac)}
        fill="rgba(23,26,29,.22)" opacity={0.9 - 0.6 * frac}/>
      <g style={{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }}>
        <circle cx="100" cy="65" r="9" fill={col} stroke="rgba(23,26,29,.35)" strokeWidth="1.2"/>
        <line x1="100" y1="56" x2="100" y2="74" stroke="rgba(23,26,29,.35)" strokeWidth="1"/>
        <path d="M100,56 Q87,65 100,74" fill="none" stroke="rgba(23,26,29,.35)" strokeWidth="1"/>
        <path d="M100,56 Q113,65 100,74" fill="none" stroke="rgba(23,26,29,.35)" strokeWidth="1"/>
        <ellipse cx="97" cy="61" rx="2.6" ry="1.6" fill="rgba(255,255,255,.55)"/>
      </g>
      <text x="100" y="150" textAnchor="middle" fontFamily="'Manrope', system-ui, sans-serif"
        fontSize="7" letterSpacing="0.6" fill={T.ink3}>{tt(SC_TOSS)}</text>
    </g>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
const HookScene = () => {
  return (
    // 615px balandlikda S1 sahna + katta savol + ikki qatorli jadval bir
    // vaqtda turadi: jadval qatorini kesib qo'ymasin deb u endi siqilmaydi
    // (flex-shrink:0), shuning uchun siqilish shu sahnaga qoladi — lekin
    // sahnaning o'z tabiiy balandligi ham tugagan (o'lchandi 2026-08-25,
    // MacBook M1 QA). Shuning uchun sahna KENGLIGI shu ekranda maxsus
    // toraytiriladi: torroq kenglik → SVG nisbatan pastroq bo'ladi.
    <SceneBand kind="hook" className="g9-scene-compact" label={L(
      "To'p uch metrdan ikki marta o'tadi",
      'Мяч дважды проходит три метра',
      'The ball passes three metres twice',
    )}>
      <Toss/>
      <Plate y={22} cls="g9-plate-a" min="2" val="3" minUnit={SC_U_SEC} valUnit={SC_U_METER}/>
      <Plate y={86} cls="g9-plate-b" min="8" val="3" minUnit={SC_U_SEC} valUnit={SC_U_METER}/>
    </SceneBand>
  )
}

// ============================================================
// YAKUN SAHNASI (400 x 92). XUK SAVOLIGA JAVOB BERADI: u yerda o'quvchi
// nuqtalarni O'ZI qo'ygan, bu yerda haqiqiy iz to'liq chizilgan va tagida
// aniqlanish sohasi yozilgan. Obyekt o'sha, o'zgargani — dars aytib bergani.
// ============================================================
const finX = (x) => 40 + x * 30
const finY = (v) => 78 - v * (64 / 6)
const TRACE_D = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  .map((x) => finX(x) + ',' + finY(BALL(x)).toFixed(1)).join(' ')

// eslint-disable-next-line react-refresh/only-export-components
const FinalScene = () => {
  const t = useT()
  return (
    <SceneBand kind="final" label={L(
      "To'pning to'liq parvoz izi va aniqlanish sohasi",
      'Полный след полёта мяча и область определения',
      'The full trace of the flight and the domain',
    )}>
      <line x1="40" y1="78" x2="366" y2="78" stroke={T.ink4} strokeWidth="1.4"/>
      <line x1="40" y1="78" x2="40" y2="12" stroke={T.ink4} strokeWidth="1.4"/>
      <text x="366" y="90" textAnchor="end" fontFamily="'Manrope', system-ui, sans-serif"
        fontSize="6" letterSpacing="0.4" fill={T.ink3}>{t(SC_SEC)}</text>
      <text x="36" y="10" textAnchor="end" fontFamily="'Manrope', system-ui, sans-serif"
        fontSize="6" letterSpacing="0.4" fill={T.ink3}>{t(SC_HEIGHT)}</text>
      <polyline points={TRACE_D} fill="none" stroke={T.accent} strokeWidth="2.4"
        strokeLinecap="round" strokeLinejoin="round" pathLength="1" className="g8-draw"/>
      <circle cx={finX(0)} cy={finY(0)} r="3.2" fill={T.accent}/>
      <circle cx={finX(10)} cy={finY(0)} r="3.2" fill={T.accent}/>
      <g className="g8-late">
        <rect x="238" y="16" width="128" height="20" rx="10" fill={T.okSoft}/>
        <text x="302" y="30" textAnchor="middle" fontFamily={MATH_FONT} fontSize="13"
          fill={T.ok}>0 ≤ x ≤ 10</text>
      </g>
    </SceneBand>
  )
}

// ============================================================
// EKRAN 1. XUK — IKKI TABLONING BAHSI.
//
// Metodist 2026-08-21, ikkinchi urinishdan keyin ham: «все равно не подходит,
// предложи другую структура это не понятно». To'rtta sabab topildi va uchtasi
// savolda emas, KADRda edi: poyezdka ekranda yo'q (uch qator matn), savol
// hech narsaga ishora qilmaydi (chizmada 4 metr belgisi yo'q), shart
// variantlarga o'xshab turadi, shkala o'qilmaydi.
//
// Metodist tanlagan tuzilma: IKKI TABLONING BAHSI. To'p bir marta
// ko'tarilib-tushadi, uch metr chizig'idan o'tgan paytda o'ngda plashka
// chiqadi — birinchisi ko'tarilishda, ikkinchisi tushishda. Qarama-
// qarshilik aytilmaydi, u ko'z oldida sodir bo'ladi, va savol shundan
// keyin beriladi. (Obyekt 2026-08-22 da UCH marta almashtirildi: kabina
// → choynak → yugurchi → to'p — internetdan izlanishdan keyin, mavzu
// uchun eng standart misolga. HOZIRCHA FAQAT shu ekran, 4/13-ekranlar
// hali yugurchi-zarb syujetida — metodist tasdiqlashini kutamiz.)
//
// Javob hisoblashni talab qilmaydi va darsning bosh faktini beradi: bitta
// balandlikka ikki payt to'g'ri keladi, teskarisi esa yo'q. 4 va 13-ekranlar
// (hozircha eski syujetda) shu faktga qaytadi.
// ============================================================
const S1 = {
  eyebrow: L('FUNKSIYA', 'ФУНКЦИЯ', 'FUNCTION'),
  title: L(
    "Bitta balandlikka ikki marta",
    'Два раза на одной высоте',
    'The ball at the same height twice',
  ),
  audio: [
    A('mount',
      "To'p bir marta yuqoriga otiladi va tushadi. Punktir chiziq uch metrni ko'rsatadi, to'p undan o'tganda o'ngda belgi chiqadi.",
      'Мяч один раз летит вверх и падает обратно. Пунктир показывает три метра, и когда мяч его проходит, справа появляется отметка.',
      'The ball flies up once and falls back down. The dashed line marks three metres, and when the ball crosses it a marker appears on the right.'),
    A('why',
      "Ikkala belgi ham bir xil balandlikni ko'rsatdi, vaqt esa boshqa. Ikkalasi ham haqiqiy.",
      'Обе отметки показали одну и ту же высоту, а время разное. И обе отметки настоящие.',
      'Both markers showed the same height at different times. And both markers are real.'),
  ],
  props: {
    askClass: 'g9-ask-big',
    cardsClass: 'g9-cards-small',
    ask: L(
      "Ikkala belgi ham haqiqiy: balandlik bir xil, payt boshqa. Bu qanday bo'lishi mumkin?",
      'Обе отметки настоящие: высота одна и та же, момент разный. Как такое возможно?',
      'Both markers are real: the height is the same, the moment is different. How is that possible?',
    ),
    items: [
      {
        id: 'lie',
        show: L("belgi xato qo'yilgan", 'отметка поставлена неверно', 'the marker was placed wrong'),
        hint: L(
          "Belgi to'pning o'zidan so'ralgan paytdagi balandligini ko'rsatadi, va ikki marta ham to'g'ri qo'yildi. Ularning vaqti boshqa.",
          'Отметка показывает высоту мяча в тот момент, когда её поставили, и оба раза верно. Разное у них время.',
          'A marker shows the height of the ball at the moment it was placed, and both times it was correct. What differs is the time.',
        ),
      },
      {
        id: 'twice',
        right: true,
        show: L('1 balandlik → 2 payt', '1 высота → 2 момента', '1 height → 2 moments'),
      },
      {
        id: 'jump',
        show: L("balandlik sakraydi", 'высота скачет', 'the height jumps'),
        hint: L(
          "Sakrash yo'q. To'p tekis ko'tarilib-tushadi, yo'lda oradagi hamma balandlikdan ketma-ket o'tadi.",
          'Скачков нет. Мяч плавно поднимается и опускается, и по дороге проходит все высоты подряд.',
          'There are no jumps. The ball rises and falls smoothly and passes every height in turn.',
        ),
      },
      {
        id: 'back',
        show: L("vaqt orqaga ketdi", 'время пошло назад', 'time went backwards'),
        hint: L(
          "Vaqt faqat oldinga ketadi: avval ikkinchi soniya, keyin sakkizinchi. Demak gap vaqtda emas, to'pning yo'lida.",
          'Время идёт только вперёд: сначала вторая секунда, потом восьмая. Значит дело не во времени, а в самом полёте мяча.',
          'Time only moves forward: the second second, then the eighth. So the matter is not the time but the flight of the ball.',
        ),
      },
    ],
    after: L(
      "Bir balandlik — ikki payt.",
      'Одна высота — два момента.',
      'One height, two moments.',
    ),
    afterSay: L(
      "Xato yo'q. To'p uch metrdan ikki marta o'tadi: biri ko'tarilishda, ikkinchisi tushishda. Ya'ni bitta balandlikka ikki payt to'g'ri keladi. Teskarisi esa mumkin emas: bitta paytda to'p har doim bitta balandlikda. Mana shu farq bilan biz butun dars ishlaymiz.",
      'Ошибки нет. Мяч проходит три метра дважды: один раз на подъёме, второй на спуске. Значит одной высоте отвечают два момента. А обратно нельзя: в один момент мяч всегда на одной высоте. Именно с этим различием мы работаем весь урок.',
      'There is no mistake. The ball passes three metres twice: once on the way up, once on the way down. So one height answers to two moments. The reverse is impossible: at one moment the ball is always at one height. This is the difference we work with all lesson.',
    ),
    // PODSTANOVKA plashkalarni TASDIQLAYDI: uch metr ikki qatorda. `wide`
    // YO'Q va bu atayin: umumiy qatlamda qoida bor — keng jadval sahnani
    // yashiradi, xukda esa sahna obyekt.
    proof: {
      varLabel: L('payt x', 'момент x', 'moment x'),
      leftLabel: L('balandlik y', 'высота y', 'height y'),
      rightLabel: L("to'pning yo'li", 'часть полёта', 'part of the flight'),
      noValue: L("qiymat yo'q", 'значения нет', 'no value'),
      // IKKI QATOR, uchta emas. Jadval `.g8-stack` ustunida siqiladi va
      // uchinchi qator 15 piksel kesilib qolardi (o'lchandi 2026-08-21,
      // 1366 na 615). Ikki qator ayni qarama-qarshilikni ko'rsatadi:
      // bitta balandlik, ikki payt.
      rows: [
        { v: '2', left: '3', right: L("ko'tarilish", 'подъём', 'the rise') },
        { v: '8', left: '3', right: L('tushish', 'спуск', 'the descent') },
      ],
    },
  },
}

// ============================================================
// EKRAN 2. TAYANCH — FORMULAGA SON QO'YISH, 7-SINFDAN TANISH HARAKAT.
//
// 2026-08-23: uch javobli savol, to'g'ri tanlovdan keyin YECHIM kartochkasi
// ochiladi, so'ngra funksiya grafigi (topilgan nuqta belgilangan) va
// qiymatlar jadvali chiqadi — javob bir marta emas, UCH KO'RINISHDA
// (son, nuqta, jadval) tasdiqlanadi. Xato javoblarning ikkisi ham HAQIQIY
// xato: qo'shish ko'paytirish o'rniga, va x ni o'ziga ko'paytirish ikkiga
// ko'paytirish o'rniga.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "Formulaga son qo'yish",
    'Подстановка в формулу',
    'Substituting into the formula',
  ),
  audio: [
    A('mount',
      "Bu yerda formula bor va unga bitta son qo'yiladi.",
      'Здесь есть формула, и в неё подставляется одно число.',
      'Here is a formula, and one number is substituted into it.'),
    A('why',
      "Uch javobdan to'g'risini tanlang.",
      'Из трёх ответов выбери верный.',
      'Choose the correct one out of the three answers.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <CheckReveal
      ask={L(
        "y = 2x. x = 4 bo'lganda, y = ?",
        'y = 2x. При x = 4, y = ?',
        'y = 2x. When x = 4, y = ?',
      )}
      items={[
        {
          id: 'add',
          label: L('olti', 'шесть', 'six'),
          hint: L(
            "Bu yerda ikkiga to'rt qo'shilgan, ko'paytirilmagan. Formuladagi amal ko'paytirish.",
            'Здесь к двум прибавили четыре, а не умножили. Действие в формуле это умножение.',
            'Here four was added to two instead of multiplied. The operation in the formula is multiplication.',
          ),
        },
        { id: 'right', right: true, label: L('sakkiz', 'восемь', 'eight') },
        {
          id: 'sq',
          label: L("o'n olti", 'шестнадцать', 'sixteen'),
          hint: L(
            "Bu yerda x o'ziga ko'paytirilgan. Formulada esa x ikkiga ko'paytiriladi.",
            'Здесь x умножили само на себя. А в формуле x умножают на два.',
            'Here x was multiplied by itself. But in the formula x is multiplied by two.',
          ),
        },
      ]}
      done={L("To'g'ri.", 'Верно.', 'Correct.')}
      card={{
        title: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
        lines: [
          L('y = 2 · 4', 'y = 2 · 4', 'y = 2 · 4'),
          L('y = 8', 'y = 8', 'y = 8'),
          L(
            "Demak, x to'rtga teng bo'lganda, y sakkizga teng.",
            'Значит, при x = 4 значение y = 8.',
            'So when x = 4, y = 8.',
          ),
        ],
        locked: L(
          "Yechim to'g'ri javobdan keyin ochiladi",
          'Решение откроется после верного ответа',
          'The solution opens after a correct answer',
        ),
      }}
      graph={{
        f: (x) => 2 * x,
        x: 4,
        y: 8,
        from: -0.5,
        to: 4.5,
        yFrom: -0.5,
        yTo: 8.5,
        xs: [0, 1, 2, 3, 4],
      }}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 3. VAQT SIRG'ITUVCHISI. 2026-08-22: yangi mexanika — mashinaga son
// solish o'rniga vaqt TORTILADI, va to'p HAR bir holatda jonli turadi.
// Belgilangan olti paytni (0,2,4,6,8,10) yetib borib yig'ish kerak, so'ng
// chegaradan tashqaridagi qulflangan «11 s» sinaladi — aniqlanish sohasi
// shu yerda birinchi marta ko'zga tashlanadi, hali nomlanmagan holda.
// ============================================================
const S3 = {
  eyebrow: L('JARAYON', 'ПРОЦЕСС', 'THE PROCESS'),
  title: L(
    "Vaqt — argument, balandlik — qiymat",
    'Время — аргумент, высота — значение',
    'Time is the argument, height is the value',
  ),
  audio: [
    A('mount',
      "Sirg'ituvchini torting. Har bir paytda to'p o'sha balandlikka jonli ko'chadi.",
      'Тяни бегунок. В каждый момент мяч живо перемещается на ту высоту.',
      'Drag the handle. At every moment the ball moves live to that height.'),
    A('why',
      "Belgilangan olti nuqtani birma-bir yetib boring va lotokni to'ldiring. Oxirida o'n bir soniyani ham sinab ko'ring.",
      'Дойди по очереди до всех шести отметок и наполни лоток. В конце попробуй и одиннадцатую секунду.',
      'Reach all six marked points one by one and fill the tray. At the end try the eleventh second too.'),
    W('jam',
      "To'p tiqilib qoldi. Bu parvozda o'n bir soniya yo'q, funksiya faqat to'p havoda bo'lgan vaqt uchun berilgan.",
      'Мяч застрял. Одиннадцатой секунды в этом полёте нет: функция задана только на время, пока мяч был в воздухе.',
      'The ball jammed. This flight has no eleventh second: the function is given only for the time the ball was in the air.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <TimeScrubber
      figure={({ t: at, jammed }) => (
        <svg viewBox="-45 -15 290 176" preserveAspectRatio="xMidYMid meet" role="img">
          <TossAt t={jammed ? null : at} jammed={jammed}/>
        </svg>
      )}
      f={BALL}
      stops={[0, 2, 4, 6, 8, 10]}
      beyond={11}
      beyondJam={L(
        "O'n bir soniyada to'p allaqachon qo'lga qaytgan. Bunday paytda balandlik yo'q.",
        'На одиннадцатой секунде мяч уже вернулся в руку. В такой момент высоты нет.',
        'By the eleventh second the ball has already returned to the hand. At such a moment there is no height.',
      )}
      ask={L(
        "Olti nuqtani yig'ing, keyin sirg'ituvchini oxirigacha torting",
        'Собери все шесть точек, потом дотяни бегунок до конца',
        'Collect all six points, then drag the handle all the way to the end',
      )}
      after={L(
        "Olti juftlik yig'ildi, o'n bir esa o'tmadi. Argument qabul qiladigan qiymatlar to'p havoda bo'lgan vaqt bilan chegaralangan.",
        'Собрано шесть пар, а одиннадцать не прошло. Значения, которые принимает аргумент, ограничены временем полёта.',
        'Six pairs collected, and eleven did not pass. The values the argument may take are limited by the time the ball was in the air.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 4. ESLATMA SAVOLI. Tepada uch juftlik (2 s → 3, 4 s → 8, 8 s → 3)
// SOCHILGAN holda turadi — bosilmaydi, faqat o'qiladi. Pastda savol va
// harfli (A/B/C) javoblar. Ulash mantiqi YO'Q.
//
// 2 va 8-soniya SIMMETRIYA bo'yicha bir xil balandlik beradi (10 soniyalik
// parvozning o'rtasi — 5-soniya): shu tasodif savolni HAQIQIY qiladi —
// uch juftlikda ikkita balandlik bor, uchta emas, lekin bitta paytga
// hech qachon ikkitasi tegishli emas.
// ============================================================
const S4 = {
  eyebrow: L('MOSLIK', 'СООТВЕТСТВИЕ', 'CORRESPONDENCE'),
  title: L(
    "Bir vaqtga bir balandlik",
    'Одному моменту одна высота',
    'One moment, one height',
  ),
  audio: [
    A('mount',
      "Yuqorida to'pning haqiqiy formulasi bor. Harf h balandlikni bildiradi, qavs ichidagi son esa paytni.",
      'Выше настоящая формула мяча. Буква h означает высоту, а число в скобках момент.',
      "Above is the ball's real formula. The letter h stands for height, and the number in parentheses for the moment."),
    A('why',
      "Har bir hisoblashni bosing va formulaga son qo'yib, natijani o'zingiz ko'ring. Keyin savolga javob bering: h ikki bir vaqtda ikki xil songa teng bo'la oladimi?",
      'Нажми на каждое вычисление и подставь число в формулу сам. Потом ответь на вопрос: может ли h от двух быть равно двум разным числам одновременно?',
      'Press each calculation and substitute the number into the formula yourself. Then answer the question: can h of two equal two different numbers at the same time?'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RecallMC
      intro={L(
        "h(t) — to'pning t soniyadagi balandligi",
        'h(t) — высота мяча на t-й секунде',
        'h(t) — the height of the ball at second t',
      )}
      formula="h(t) = 0.1875 · t · (10 − t)"
      steps={[
        {
          id: 't2', head: 'h(2)',
          lines: [
            'h(2) = 0.1875 · 2 · (10 − 2)',
            'h(2) = 0.1875 · 2 · 8',
            'h(2) = 3',
          ],
        },
        {
          id: 't4', head: 'h(4)',
          lines: [
            'h(4) = 0.1875 · 4 · (10 − 4)',
            'h(4) = 0.1875 · 4 · 6',
            'h(4) = 4.5',
          ],
        },
        {
          id: 't8', head: 'h(8)',
          lines: [
            'h(8) = 0.1875 · 8 · (10 − 8)',
            'h(8) = 0.1875 · 8 · 2',
            'h(8) = 3',
          ],
        },
      ]}
      ask={L(
        "h(2) = 3 va h(2) = 5 — ikkisi bir vaqtda to'g'ri bo'la oladimi?",
        'h(2) = 3 и h(2) = 5 — могут ли оба быть верными одновременно?',
        'h(2) = 3 and h(2) = 5 — can both be true at the same time?',
      )}
      cols={2}
      items={[
        {
          id: 'one',
          right: true,
          label: L("Yo'q, h(2) faqat bitta qiymatga teng", 'Нет, h(2) равно только одному значению', 'No, h(2) equals only one value'),
        },
        {
          id: 'both',
          label: L('Ha, ikkisi ham to\'g\'ri', 'Да, оба верны', 'Yes, both are true'),
          hint: L(
            "Yuqoridagi kartochkada h(2) uchun faqat bitta qiymat, 3, yozilgan. Boshqa qiymat yo'q.",
            'На карточке выше для h(2) записано только одно значение, 3. Другого значения нет.',
            'The card above shows only one value for h(2), namely 3. There is no other value.',
          ),
        },
        {
          id: 'depends',
          label: L("To'p tushayotganda to'g'ri", 'Верно, когда мяч падает', 'True while the ball is falling'),
          hint: L(
            "Bu qoida to'pning ko'tarilishi yoki tushishiga bog'liq emas. Har doim shunday: bitta argumentga bitta qiymat.",
            'Это правило не зависит от того, поднимается мяч или падает. Всегда так: одному аргументу одно значение.',
            'This rule does not depend on whether the ball rises or falls. It is always so: one argument, one value.',
          ),
        },
        {
          id: 'neither',
          label: L('Ikkisi ham noto\'g\'ri', 'Оба неверны', 'Neither is true'),
          hint: L(
            "h ikki uch songa teng, bu to'g'ri, chunki kartochkada aynan shunday yozilgan. Demak birinchisi to'g'ri.",
            'h от двух равно трём, это верно, ведь именно так записано на карточке. Значит первое равенство верно.',
            'H of two equals three, and that is true, since that is exactly what the card shows. So the first one is true.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. h(2) bitta songa teng, ikkinchisi yo'q. Funksiya shunday: bir argumentga bir qiymat mos keladi.",
        'Верно. h(2) равно одному числу, второго нет. Функция работает так: одному аргументу соответствует одно значение.',
        'Correct. h(2) equals one number, there is no second one. That is how a function works: one argument, one value.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 5. IZ JUFTLIKLARDAN YIG'ILADI.
//
// 3-ekranda lotokda yig'ilgan juftliklar shu yerda tekislikka tushadi.
// O'quvchi mo'ljal olmaydi: nuqta o'z koordinatasiga o'zi uchadi, chunki bu
// ekran nuqta qo'yishni emas, IZNING KELIB CHIQISHINI o'rgatadi.
//
// «Birlashtirish» dan keyin ostida haqiqiy iz ham chiziladi: o'quvchi o'z
// siniq chizig'ini kitob grafigi bilan solishtiradi.
// ============================================================
const S5 = {
  eyebrow: L('IZ', 'СЛЕД', 'THE TRACE'),
  title: L(
    "Grafik: (x, y) juftliklari to'plami",
    'График: множество пар (x, y)',
    'The graph: a set of (x, y) pairs',
  ),
  audio: [
    A('mount',
      "Lotokdagi juftliklar shu yerda. Har birini bosing, nuqta o'z joyiga tushadi.",
      'Пары из лотка здесь. Нажимай каждую, и точка встанет на своё место.',
      'The pairs from the tray are here. Press each one and the point takes its place.'),
    W('p6',
      "Olti nuqta qo'yildi. Endi ularni birlashtiring.",
      'Шесть точек поставлены. Теперь соедини их.',
      'Six points are placed. Now connect them.'),
    W('join',
      "Iz chizilmadi, u KELIB CHIQDI. Grafik to'pning rasmi emas, u argument va qiymat juftliklarining hammasi birdan.",
      'След не нарисован, он получился. График это не рисунок мяча, а все пары аргумент-значение сразу.',
      'The trace was not drawn, it came out. A graph is not a picture of the ball but all argument-value pairs at once.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <Trace
      mode="build"
      f={BALL}
      from={0} to={10} yFrom={0} yTo={6}
      pairs={[
        { x: 0, y: 0 }, { x: 2, y: 3 }, { x: 4, y: 4.5 },
        { x: 6, y: 4.5 }, { x: 8, y: 3 }, { x: 10, y: 0 },
      ]}
      xLabel={SC_SEC}
      yLabel={SC_HEIGHT}
      ask={L(
        "Juftliklarni tekislikka qo'ying",
        'Поставь пары на плоскость',
        'Place the pairs on the plane',
      )}
      after={L(
        "Sizning siniq chizig'ingiz ostida haqiqiy iz turadi. Nuqtalar qancha ko'p bo'lsa, ikkisi shuncha yaqin.",
        'Под твоей ломаной стоит настоящий след. Чем больше точек, тем ближе они друг к другу.',
        'The real trace stands under your polyline. The more points there are, the closer the two become.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 6. O'TKAZISH PUNKTI. Formulaga sonlar navbat bilan keladi, o'quvchi
// ularni ajratadi. Xato o'tkazilgan son SHU YERDA hisoblanadi va ko'z oldida
// buziladi — asbob javobni aytmaydi, faqat hisoblaydi.
//
// Javob oxirida uning AJRATISHIDAN yig'iladi. Tayyor variantlar yo'q.
// ============================================================
const S6 = {
  eyebrow: L('PUNKT', 'ПУНКТ', 'THE GATE'),
  title: L(
    "Qaysi sonlar o'tadi",
    'Какие числа проходят',
    'Which numbers pass',
  ),
  audio: [
    A('mount',
      "Formulaga son qo'yiladi. Avval uchni sinab ko'ring.",
      'В формулу подставляется число. Сначала попробуй три.',
      'A number is substituted into the formula. First, try three.'),
    W('warmup',
      "Natija bir bo'lakni nolga bo'ladi. Nolga bo'lish bajarilmaydi, shuning uchun uch o'tmaydi.",
      'Результат делит единицу на нуль. Деление на нуль не выполняется, поэтому три не проходит.',
      'The result divides one by zero. Division by zero cannot be done, so three does not pass.'),
    A('why',
      "Endi qolgan sonlarni ham ajratib chiqing: har birini ikki tomondan biriga yuboring.",
      'Теперь разбери и остальные числа: каждое отправь в одну из двух сторон.',
      'Now sort the rest of the numbers too: send each of them to one of the two sides.'),
    W('q4',
      "Hammasi ajratildi. To'silgan son shartga aylanadi, va javob shundan yig'iladi.",
      'Все разобраны. Заблокированное число становится условием, из него и собирается ответ.',
      'All are sorted. The blocked number becomes the condition, and the answer is assembled from it.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <Gate
      formula={<span>y = {F('1', 'x − 3')}</span>}
      f={DIV3}
      calcOf={(v) => '1 : (' + v + ' − 3)  =  1 : 0'}
      warmup={{
        intro: L(
          "Formulaga x o'rniga uch qo'yilsa, nima chiqadi?",
          'Что получится, если в формулу вместо x подставить три?',
          'What happens if we substitute three for x in the formula?',
        ),
        head: 'x = 3',
        result: '1 : 0',
        lines: [
          '1 : (3 − 3)',
          '1 : 0',
          L(
            "Nolga bo'lish mumkin emas, shuning uchun bu son o'tmaydi.",
            'Деление на нуль невозможно, поэтому это число не проходит.',
            'Division by zero is not possible, so this number does not pass.',
          ),
        ],
      }}
      chart={{
        from: -1, to: 7, yFrom: -3, yTo: 3,
        xLabel: L('x', 'x', 'x'),
        yLabel: L('y', 'y', 'y'),
      }}
      queue={[
        {
          v: 0,
          hint: L(
            "Nolda maxraj minus uchga teng, bo'lish bajariladi.",
            'При нуле знаменатель равен минус трём, деление выполняется.',
            'At zero the denominator equals minus three and the division works.',
          ),
        },
        {
          v: 2,
          hint: L(
            "Ikkida maxraj minus birga teng. Bu nol emas, demak qiymat bor.",
            'При двух знаменатель равен минус единице. Это не нуль, значит значение есть.',
            'At two the denominator equals minus one. That is not zero, so the value exists.',
          ),
        },
        {
          v: 3,
          hint: L(
            "Uchda maxraj nolga aylanadi. Nolga bo'lish bajarilmaydi, shuning uchun bu son o'tmaydi.",
            'При трёх знаменатель обращается в нуль. Деление на нуль не выполняется, поэтому это число не проходит.',
            'At three the denominator becomes zero. Division by zero cannot be done, so this number does not pass.',
          ),
        },
        {
          v: 5,
          hint: L(
            "Beshda maxraj ikkiga teng, hisob oddiy o'tadi.",
            'При пяти знаменатель равен двум, счёт проходит спокойно.',
            'At five the denominator equals two and the computation goes through.',
          ),
        },
      ]}
      ask={L(
        "Bu son o'tadimi?",
        'Это число проходит?',
        'Does this number pass?',
      )}
      answer={L('x ≠ 3', 'x ≠ 3', 'x ≠ 3')}
      after={L(
        "Bitta son to'sildi, va aynan u shartni beradi. Aniqlanish sohasi shundan yoziladi.",
        'Одно число заблокировано, и именно оно даёт условие. Из него и записывают область определения.',
        'One number is blocked, and it is the one that gives the condition. The domain is written from it.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 7. GALEREYA: TO'RT CHIZIQDAN BIRINI TOPISH.
//
// 2026-08-22, metodist qarori: barmoq/sichqoncha bilan CHIZISH mexanikasi
// olib tashlandi — u sinfning o'z qoidasiga ziddir («hamma harakat TUGMA
// yoki chizmaga BOSISH bilan, sudrab tashlash bilan EMAS», asboblar.jsx
// boshida yozilgan, aynan shu sabab bilan: sudrash telefonda noaniq va
// tekshiruv skriptini butunlay to'xtatadi).
//
// TO'RTINCHI VARIANT (2-urinish): tik chiziq juda YALANG'OCH chiqdi —
// boshqa uchtasi chiziq, bu esa hatto egilmagan. Endi YONBOSH PARABOLA
// (x = a*y^2 ko'rinishi): chiziq ORTGA egiladi, xuddi boshqalar kabi
// CHIZIQ, lekin bir joyda ikki tarmoqqa ajraladi.
//
// HARAKAT: ekran ochilganda to'rttala chiziq O'ZI chiziladi (ketma-ket, bir-
// biridan sal kechikib) — sahna jonlanadi, hali hech kim bosmagan bo'lsa
// ham. Bosilganda esa TIK «SKANER» chiziq chapdan o'ngga yuradi va nuqta(lar)
// aynan skaner o'tgan zahoti, o'z joyida chiqadi — javob darrov emas, KUZATIB
// topiladi.
// ============================================================
const MINI_SHAPES = {
  wave: { d: 'M12,50 Q35,15 60,35 Q85,55 108,20', dots: [[60, 35]] },
  line: { d: 'M12,58 L108,12', dots: [[60, 35]] },
  vshape: { d: 'M12,18 L60,58 L108,18', dots: [[60, 58]] },
  side: {
    d: 'M28,35 Q62,10 100,10 M28,35 Q62,60 100,60',
    dots: [[68, 16], [68, 54]],
  },
}
const MG_SPAN = 108 // skaner yo'li: x=6 dan x=114 gacha, ya'ni 108 birlik.

const MiniGraph = ({ kind, mountDelay, reveal }) => {
  const s = MINI_SHAPES[kind]
  return (
    <svg viewBox="0 0 120 70" width="100%" className="g9-mg-svg" role="img">
      <line x1="6" y1="63" x2="114" y2="63" stroke="rgba(23,26,29,.18)" strokeWidth="1"/>
      <line x1="6" y1="6" x2="6" y2="63" stroke="rgba(23,26,29,.18)" strokeWidth="1"/>
      <path className="g9-mg-path" d={s.d} fill="none" stroke={T.accent} strokeWidth="4"
        strokeLinecap="round" strokeLinejoin="round"
        style={{ animationDelay: (mountDelay || 0) + 'ms' }}/>
      {reveal ? (
        <>
          <line className="g9-mg-scan" x1="6" y1="3" x2="6" y2="66" stroke={T.tip}
            strokeWidth="2" strokeDasharray="3 3"/>
          {s.dots.map((p, i) => (
            <circle key={i} className="g9-mg-dot" cx={p[0]} cy={p[1]} r="5"
              fill={s.dots.length > 1 ? T.tip : T.ok} stroke={T.paper} strokeWidth="1.6"
              style={{ animationDelay: (((p[0] - 6) / MG_SPAN) * 900) + 'ms' }}/>
          ))}
        </>
      ) : null}
    </svg>
  )
}

const S7 = {
  eyebrow: L('TANLASH', 'ВЫБОР', 'THE CHOICE'),
  title: L(
    "Qachon bu funksiya bo'lmaydi",
    'Когда это не функция',
    'When it is not a function',
  ),
  audio: [
    A('mount',
      "To'rt chiziq bor. Ularning faqat bittasi funksiya emas, topib bosing.",
      'Здесь четыре линии. Только одна из них не функция, найди её и нажми.',
      'There are four lines here. Only one of them is not a function, find and tap it.'),
    A('why',
      "Funksiya ta'rifiga ko'ra, har bir x qiymatiga faqat bitta y to'g'ri kelishi kerak. Bosganingizda chiziqda nechta y qiymati borligini ko'rasiz.",
      'По определению функции каждому x должно соответствовать ровно одно y. Нажав, ты увидишь, сколько значений y есть у линии.',
      'By the definition of a function, each x must correspond to exactly one y. Tap to see how many y-values the line has.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <GraphPick
      ask={L(
        "Funksiya bo'lmagan chiziqni tanlang",
        'Выбери линию, которая не является функцией',
        'Choose the line that is not a function',
      )}
      items={[
        {
          id: 'wave', right: false,
          render: (r, i) => <MiniGraph kind="wave" mountDelay={i * 130} reveal={r}/>,
          hint: L(
            "Bu chiziqda har bir x qiymatiga faqat bitta y to'g'ri keladi, ta'rifga ko'ra bu funksiya.",
            'На этой линии каждому x соответствует ровно одно y, по определению это функция.',
            'On this line each x corresponds to exactly one y, so by definition this is a function.',
          ),
        },
        {
          id: 'line', right: false,
          render: (r, i) => <MiniGraph kind="line" mountDelay={i * 130} reveal={r}/>,
          hint: L(
            "Bu chiziqda ham har bir x uchun faqat bitta y bor, demak bu funksiya.",
            'На этой линии тоже у каждого x только одно y, значит это функция.',
            'On this line too every x has only one y, so it is a function.',
          ),
        },
        {
          id: 'side', right: true,
          render: (r, i) => <MiniGraph kind="side" mountDelay={i * 130} reveal={r}/>,
        },
        {
          id: 'vshape', right: false,
          render: (r, i) => <MiniGraph kind="vshape" mountDelay={i * 130} reveal={r}/>,
          hint: L(
            "Cho'qqisi bo'lsa ham, bu chiziqda har bir x uchun faqat bitta y bor, bu ham funksiya.",
            'Хоть у неё и есть излом, у каждого x здесь только одно y, это тоже функция.',
            'Even with the bend, every x here has only one y, so this too is a function.',
          ),
        },
      ]}
      after={L(
        "To'g'ri. Funksiya ta'rifiga ko'ra har bir x qiymatiga faqat bitta y to'g'ri kelishi kerak. Bu chiziqda esa bitta x uchun ikki xil y bor, shuning uchun bu funksiya emas.",
        'Верно. По определению функции каждому x должно соответствовать ровно одно y. А на этой линии одному x соответствуют два разных y, поэтому это не функция.',
        'Correct. By the definition of a function, each x must correspond to exactly one y. On this line, one x corresponds to two different y values, so this is not a function.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 8. QOIDA. Ta'rif tayyor holda BERILMAYDI: o'quvchi uni ikki
// qadamda O'ZI yig'adi (metodist qarori 2026-08-24, 3-sinf 1-dars
// 7-ekrandagi «qoidani o'zing yig'» mexanikasi asosida). Har qadamda ANIQ
// IKKI variant — to'g'risi va bitta yaqin xato tushuncha — va xato
// tanlangan variant nima uchun yaqin ekanini tushuntiradi, javobni
// aytmaydi.
//
// Ikki qadam ekranning tegi bilan mos: birinchisi argument-qiymat
// almashinishini ushlaydi, ikkinchisi esa sinalgan uch sonni UMUMIY
// to'plam bilan almashtirib qo'yishni. Faqat ikkalasi to'g'ri yig'ilgach,
// darslik matni kartochkada so'zma-so'z ochiladi.
// ============================================================
const S8 = {
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L(
    "Aniqlanish sohasi",
    'Область определения',
    'The domain',
  ),
  audio: [
    A('mount',
      "Uchta natija sizning qo'lingizdan chiqdi. Ularning hammasida bitta narsa umumiy. Shu qoidani endi o'zingiz yig'ing.",
      'Три результата получены твоими руками. У всех трёх есть одно общее. Теперь собери это правило сам.',
      'Three results came from your own hands. All three have one thing in common. Now build that rule yourself.'),
    W('card',
      "Qoida ochildi. Bu ta'rif darslikdan so'zma-so'z olingan.",
      'Правило открылось. Это определение взято из учебника дословно.',
      'The rule is open. This definition is taken from the textbook word for word.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <RuleBuild
      steps={[
        {
          id: 'arg',
          label: L('argument haqida', 'об аргументе', 'about the argument'),
          wrong: {
            id: 'val',
            label: L('qiymat haqida', 'о значении', 'about the value'),
          },
          hint: L(
            "Bu boshqa to'plam. Aniqlanish sohasi argument haqida gapiradi, natija haqida emas.",
            'Это другое множество. Область определения говорит про аргумент, а не про результат.',
            'That is a different set. The domain speaks about the argument, not the result.',
          ),
        },
        {
          id: 'range',
          label: L(
            "qabul qilishi mumkin bo'lgan barcha qiymatlar",
            'все значения, которые аргумент может принимать',
            'every value the argument may take',
          ),
          wrong: {
            id: 'tried',
            label: L("hozir sinab ko'rilgan sonlar", 'уже проверенные числа', 'the numbers already tried'),
          },
          hint: L(
            "Uch marta sinalgan son shunchaki misol, qoida esa hammasi haqida gapiradi. Aniqlanish sohasi mumkin bo'lgan HAMMA qiymatni oladi, faqat sinalganini emas.",
            'Три испытанных числа были только примером, а правило говорит сразу про все. Область определения берёт все возможные значения, а не только проверенные.',
            'The three numbers you tried were only an example, the rule speaks about all of them at once. The domain takes every possible value, not only the ones already tried.',
          ),
        },
      ]}
      card={{
        title: L('QOIDA', 'ПРАВИЛО', 'RULE'),
        lines: [
          L(
            "Agar sonlarning biror to'plamidan olingan x ning har bir qiymatiga y son mos keltirilgan bo'lsa, shu to'plamda y(x) funksiya berilgan deyiladi",
            'Если каждому значению x из некоторого множества чисел поставлено в соответствие число y, то говорят, что на множестве задана функция y(x)',
            'If a number y is assigned to each value of x from some set of numbers, then a function y(x) is said to be given on that set',
          ),
          STATEMENTS[1],
          STATEMENTS[2],
        ],
        // Ikkita formula qatori ikkita qadamga MOS keladi: birinchisi
        // argument-qiymat harflarini, ikkinchisi esa sohaning O'ZI qaysi
        // harfga tegishli ekanini bosib ochadi. Harf bosilmaguncha
        // ma'nosi ko'rinmaydi -- qoida shu bilan o'qish emas, tekshirish.
        formulas: [
          [
            {
              sym: 'y',
              label: L(
                "funksiya, ya'ni erksiz o'zgaruvchi",
                'функция, то есть зависимая переменная',
                'the function, that is, the dependent variable',
              ),
            },
            { sym: '(' },
            {
              sym: 'x',
              label: L(
                "argument, ya'ni erkli o'zgaruvchi",
                'аргумент, то есть независимая переменная',
                'the argument, that is, the independent variable',
              ),
            },
            { sym: ')' },
          ],
          [
            { sym: 'x' },
            { sym: '∈' },
            { sym: 'D(y)', label: STATEMENTS[1] },
          ],
        ],
      }}
      after={L(
        "Ikkalasi ham to'g'ri. Soha argumentning barcha mumkin qiymatlari haqida gapiradi, uchtasi esa ular orasidagi namuna edi.",
        'Оба шага верны. Область говорит про все возможные значения аргумента, а три примера были лишь образцами среди них.',
        'Both steps were right. The domain speaks about every possible value of the argument, and your three examples were just samples among them.',
      )}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 9. MASHQ: PUNKT, YANGI TO'SIQ. Bu yerda maxraj emas, ILDIZ to'siq
// qo'yadi, va to'silgan sonlar bittadan ko'p — javob oraliq bo'lib chiqadi.
// ============================================================
const S9 = {
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L(
    "Ildiz ostida manfiy son bo'lmaydi",
    'Под корнем не бывает отрицательного',
    'No negative number under a root',
  ),
  audio: [
    A('mount',
      "Endi to'siqni maxraj emas, ildiz qo'yadi. Avval formulaga uchni qo'yib ko'ring.",
      'Теперь преграду ставит не знаменатель, а корень. Сначала подставь в формулу тройку.',
      'Now the obstacle comes from the root, not the denominator. First substitute three into the formula.'),
    W('warmup',
      "Ildiz ostida nol qoladi. Noldan ildiz bor va u nolga teng, shuning uchun bu son o'tadi.",
      'Под корнем остаётся нуль. Корень из нуля есть и равен нулю, поэтому это число проходит.',
      'Zero is left under the root. The root of zero exists and equals zero, so this number passes.'),
    A('why',
      "Endi qolgan sonlarni ham ajratib chiqing: sonlar o'sha tartibda keladi.",
      'Теперь разбери и остальные числа: они приходят тем же порядком.',
      'Now sort the rest of the numbers too: they arrive in the same order.'),
  ],
  render: ({ audio, onSolved, step }) => (
    <Gate
      formula={<span>y = √(x − 3)</span>}
      f={ROOT3}
      calcOf={(v) => '√(' + v + ' − 3)  =  √(' + (v - 3) + ')'}
      warmup={{
        intro: L(
          "Formulaga x o'rniga uch qo'yilsa, nima chiqadi?",
          'Что получится, если в формулу вместо x подставить три?',
          'What happens if we substitute three for x in the formula?',
        ),
        head: 'x = 3',
        result: '√0',
        lines: [
          '√(3 − 3)',
          '√0',
          L(
            "Noldan ildiz bor va u nolga teng, shuning uchun bu son o'tadi.",
            'Корень из нуля есть и равен нулю, поэтому это число проходит.',
            'The root of zero exists and equals zero, so this number passes.',
          ),
        ],
      }}
      queue={[
        {
          v: 2,
          hint: L(
            "Ikkida ildiz ostida minus bir qoladi. Manfiy son ildiz ostida bo'lmaydi.",
            'При двух под корнем остаётся минус один. Отрицательного под корнем не бывает.',
            'At two, minus one is left under the root. A negative cannot be under a root.',
          ),
        },
        {
          v: 3,
          hint: L(
            "Uchda ildiz ostida nol turadi. Noldan ildiz bor, shuning uchun bu son o'tadi.",
            'При трёх под корнем стоит нуль. Корень из нуля есть, поэтому это число проходит.',
            'At three there is zero under the root. The root of zero exists, so this number passes.',
          ),
        },
        {
          v: 7,
          hint: L(
            "Yettida ildiz ostida to'rt qoladi, ildizi ikki.",
            'При семи под корнем остаётся четыре, корень равен двум.',
            'At seven, four is left under the root and its root is two.',
          ),
        },
      ]}
      ask={L(
        "Bu son o'tadimi?",
        'Это число проходит?',
        'Does this number pass?',
      )}
      answer={L('x ≥ 3', 'x ≥ 3', 'x ≥ 3')}
      after={L(
        "To'silganlar uchdan kichik sonlar bo'lib chiqdi. Shuning uchun javob bitta taqiq emas, oraliq.",
        'Заблокированными оказались числа меньше трёх. Поэтому ответ не один запрет, а промежуток.',
        'The blocked ones turned out to be the numbers smaller than three. So the answer is an interval, not a single restriction.',
      )}
      fact={{
        badge: L('Bilasizmi? · Texnika', 'Знаешь ли ты? · Техника', 'Did you know? · Technology'),
        text: L(
          "Kalkulyator va dasturlar ham xuddi shunday ishlaydi: ildiz belgisini bosishdan oldin son manfiy emasligini tekshiradi, aks holda ekranda xato chiqadi.",
          'Калькуляторы и программы работают так же: перед вычислением корня они проверяют, что число не отрицательное, иначе на экране появляется ошибка.',
          "Calculators and programs work the same way: before computing a root, they check the number isn't negative, otherwise the screen shows an error.",
        ),
      }}
      audio={audio}
      onSolved={onSolved}
      onStep={step}
    />
  ),
}

// ============================================================
// EKRAN 10. MASHQ: IKKI TO'SIQ BIRDANIGA. Bir yozuvda ildiz ham, maxraj ham
// bor. Ular bir-birini bekor qilmaydi, javobda ikkalasi ham turadi.
// ============================================================
// EKRAN 10. YO'NALTIRILGAN: BITTA YOZUV, UCH QADAM (grade8 Dars01
// 10-ekranidagi `guided` naqsh, xuddi shu `Drill` asbobi bilan). Ikki
// to'siq bir yozuvda ketma-ket ajratiladi: avval ildiz sharti, keyin
// maxraj sharti, oxirida ikkalasi birlashtiriladi.
const S10 = {
  eyebrow: L("IKKI TO'SIQ", 'ДВЕ ПРЕГРАДЫ', 'TWO OBSTACLES'),
  title: L(
    "Ildiz va maxraj: ikkita shart",
    'Корень и знаменатель: два условия',
    'The root and the denominator: two conditions',
  ),
  audio: [
    A('mount',
      "Bu yozuvda ikkita to'siq bor. Yordam yo'q, lekin har javobdan keyin yechim ochiladi.",
      'В этой записи две преграды. Помощи нет, но после каждого ответа откроется решение.',
      'This record has two obstacles. No help, but after each answer the solution opens.'),
    A('why',
      "Ikkita shart alohida topiladi, keyin birlashtiriladi. Bittasini tashlab ketish mumkin emas.",
      'Два условия находят отдельно, а потом объединяют. Одно из них выбросить нельзя.',
      'The two conditions are found separately, then joined. Neither can be dropped.'),
  ],
  props: {
    stepLabel: L('Qadam', 'Шаг', 'Step'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikki to'siq — ikki shart, va javobda ikkalasi ham turadi. Ikkalasi ham bir savolga javob berdi: formula qayerda hisoblanadi?",
      'Две преграды — два условия, и в ответе стоят оба. Оба ответили на один вопрос: где формула вообще считается?',
      'Two obstacles mean two conditions, and both stand in the answer. Both answered the same question: where does the formula compute at all?',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">y = {F('√x', 'x − 4')}</Row>,
        question: L(
          "Ildiz sharti qanday yoziladi?",
          'Как записать условие корня?',
          'How is the root condition written?',
        ),
        ok: L(
          "Ha. Ildiz ostida manfiy son bo'lmaydi, shuning uchun x nolga teng yoki undan katta bo'lishi kerak.",
          'Да. Под корнем не бывает отрицательного числа, поэтому x должен быть равен нулю или больше.',
          'Yes. A negative number cannot stand under a root, so x must be zero or greater.',
        ),
        items: [
          { id: 'a', right: true, label: 'x ≥ 0' },
          {
            id: 'b', label: 'x > 0',
            hint: L("Nolni ham tekshiring: noldan ildiz bor va u nolga teng.", 'Проверь и нуль: корень из нуля есть и равен нулю.', 'Check zero too: the root of zero exists and equals zero.'),
          },
          {
            id: 'c', label: 'x ≤ 0',
            hint: L("Musbat x larda ham ildiz bor, ular ham o'tadi.", 'При положительных x корень тоже есть, они тоже проходят.', 'For positive x the root exists too, they also pass.'),
          },
        ],
        solution: [
          L("√x uchun x manfiy bo'lmasligi kerak", '√x требует, чтобы x не был отрицательным', '√x requires x to be non-negative'),
          'x ≥ 0',
        ],
      },
      {
        expr: <Row size="big" align="center">y = {F('√x', 'x − 4')}</Row>,
        question: L(
          "Maxraj qaysi x da nolga aylanadi?",
          'При каком x знаменатель обращается в нуль?',
          'At which x does the denominator become zero?',
        ),
        ok: L(
          "Ha. To'rtda maxraj nolga aylanadi, u yerda qiymat yo'q.",
          'Да. При четырёх знаменатель обращается в нуль, там значения нет.',
          'Yes. At four the denominator becomes zero, and there is no value there.',
        ),
        items: [
          { id: 'a', right: true, label: 'x = 4' },
          {
            id: 'b', label: 'x = 0',
            hint: L("Nolda maxraj minus to'rtga teng, bu nol emas.", 'При нуле знаменатель равен минус четырём, а это не нуль.', 'At zero the denominator equals minus four, and that is not zero.'),
          },
          {
            id: 'c', label: 'x = −4',
            hint: L("Ildiz sharti bo'yicha manfiy x lar allaqachon chiqarib tashlangan.", 'По условию корня отрицательные x уже исключены.', 'By the root condition, negative x are already excluded.'),
          },
        ],
        solution: ['x − 4 = 0', 'x = 4'],
      },
      {
        expr: <Row size="big" align="center">y = {F('√x', 'x − 4')}</Row>,
        question: L(
          "Butun aniqlanish sohasi qanday yoziladi?",
          'Как записать всю область определения?',
          'How is the whole domain written?',
        ),
        ok: L(
          "Ha. Ikkala shart ham birga turadi: x nolga teng yoki undan katta, va to'rtga teng emas.",
          'Да. Оба условия стоят вместе: x равен нулю или больше, и не равен четырём.',
          'Yes. Both conditions stand together: x is zero or greater, and not equal to four.',
        ),
        items: [
          { id: 'a', right: true, label: 'x ≥ 0 va x ≠ 4' },
          {
            id: 'b', label: 'x ≥ 0',
            hint: L("Bitta shart yetmaydi, to'rtda maxraj yana nolga aylanadi.", 'Одного условия мало, при четырёх знаменатель снова обращается в нуль.', 'One condition is not enough, at four the denominator becomes zero again.'),
          },
          {
            id: 'c', label: 'x ≠ 4',
            hint: L("Bitta shart yetmaydi, manfiy x larda ildiz ma'nosiz bo'lib qoladi.", 'Одного условия мало, при отрицательных x корень остаётся без смысла.', 'One condition is not enough, for negative x the root stays meaningless.'),
          },
        ],
        solution: ['x ≥ 0', 'x ≠ 4', L('x ≥ 0 va x ≠ 4', 'x ≥ 0 и x ≠ 4', 'x ≥ 0 and x ≠ 4')],
      },
    ],
  },
}

// ============================================================
// EKRAN 11. MASHQ: BESHTA MISOL YENGILDAN OG'IRGA, HAR BIRIDAN KEYIN YECHIM
// OCHILADI (grade8 Dars01 9-ekranidagi `Drill` asbobi, umumiy qatlamdan
// import qilingan — o'z nusxasi yozilmagan).
//
// Beshinchisi ATAYIN boshqalardan farq qiladi: maxraj x² + 1, u HECH QACHON
// nolga aylanmaydi. Shu bilan «har formula biror narsani taqiqlaydi» degan
// yolg'on tushuncha oldindan yo'qotiladi.
// ============================================================
const S11 = {
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L(
    "Formula qayerda aniqlanmagan",
    'Где формула не определена',
    'Where the formula is undefined',
  ),
  audio: [
    A('mount',
      "Oltita misol, yengildan og'irga. Har javobdan keyin yechim ochiladi, uni o'zingiznikiga solishtiring.",
      'Шесть примеров, от лёгкого к трудному. После каждого ответа открывается решение, сравни его со своим.',
      'Six examples, from easy to hard. After each answer the solution opens, compare it with your own.'),
    A('why',
      "Oxirgi misol boshqalaridan farq qiladi: unda hech qanday taqiq yo'q. Har formula nimanidir taqiqlaydi degan fikrga ishonmang.",
      'Последний пример отличается от других: в нём нет никакого запрета. Не верь мысли, что каждая формула что-то запрещает.',
      'The last example differs from the rest: it has no restriction at all. Do not trust the idea that every formula forbids something.'),
  ],
  props: {
    stepLabel: L('Misol', 'Пример', 'Example'),
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Oltitasi ham yechildi. Beshtasida taqiq bor edi, bittasida yo'q. Grafikdan o'qish ham formuladan topish bilan bir xil savolga javob berdi.",
      'Все шесть разобраны. В пяти был запрет, в одном не было. Чтение с графика ответило на тот же вопрос, что и поиск по формуле.',
      'All six are done. Five had a restriction, one did not. Reading from the graph answered the same question as finding it from the formula.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{F('1', 'x − 5')}</Row>,
        question: L('Bu ifoda qaysi qiymatda aniqlanmagan?', 'При каком значении это выражение не определено?', 'At which value is this expression undefined?'),
        ok: L(
          "Ha. Maxraj x − 5, u beshda nolga aylanadi.",
          'Да. Знаменатель x − 5 обращается в нуль при пяти.',
          'Yes. The denominator x − 5 becomes zero at five.',
        ),
        items: [
          { id: 'a', right: true, label: 'x ≠ 5' },
          {
            id: 'b', label: 'x ≠ 1',
            hint: L("Birlik bu yozuvda umuman yo'q, u hech qayerda turmagan.", 'Единицы в этой записи вообще нет, она нигде не стоит.', 'There is no one in this record at all, it appears nowhere.'),
          },
          {
            id: 'c', label: L('Har qanday qiymatda aniqlangan', 'Определена при любом значении', 'Defined at every value'),
            hint: L("Maxrajda harf bor, demak taqiq ham bor.", 'В знаменателе есть буква, значит запрет есть.', 'There is a letter in the denominator, so there is a restriction.'),
          },
        ],
        solution: ['x − 5 = 0', 'x = 5', 'x ≠ 5'],
      },
      {
        expr: <Row size="big" align="center">{F('1', 'x² − 9')}</Row>,
        question: L('Bu ifoda qaysi qiymatda aniqlanmagan?', 'При каком значении это выражение не определено?', 'At which value is this expression undefined?'),
        ok: L(
          "Ha. x kvadrat to'qqizga teng bo'lganda ikkita yechim bor: uch va minus uch.",
          'Да. Когда x в квадрате равно девяти, есть два решения: три и минус три.',
          'Yes. When x squared equals nine, there are two solutions: three and minus three.',
        ),
        items: [
          { id: 'a', right: true, label: 'x ≠ 3 va x ≠ −3' },
          {
            id: 'b', label: 'x ≠ 3',
            hint: L("To'g'ri, lekin u yolg'iz emas. Maxrajni nolga aylantiradigan ikkinchi son ham bor.", 'Верно, но она не одна. Есть и второе число, обращающее знаменатель в нуль.', 'Right, but it is not alone. There is a second number that turns the denominator into zero.'),
          },
          {
            id: 'c', label: 'x ≠ 9',
            hint: L("To'qqiz bu yerda ildiz emas. Uni qo'ysangiz, x kvadrat sakson birga teng bo'ladi.", 'Девятка здесь не корень. Подставь её, и x в квадрате даст восемьдесят один.', 'Nine is not a root here. Put it in and x squared gives eighty one.'),
          },
        ],
        solution: [
          'x² − 9 = 0',
          'x² = 9',
          L('x = 3 yoki x = −3', 'x = 3 или x = −3', 'x = 3 or x = −3'),
          L('x ≠ 3 va x ≠ −3', 'x ≠ 3 и x ≠ −3', 'x ≠ 3 and x ≠ −3'),
        ],
      },
      {
        expr: <Row size="big" align="center">√(x − 4)</Row>,
        question: L('Bu ifoda qaysi qiymatda aniqlanmagan?', 'При каком значении это выражение не определено?', 'At which value is this expression undefined?'),
        ok: L(
          "Ha. To'rtdan kichik x larda ildiz ostida manfiy son qoladi.",
          'Да. При x меньше четырёх под корнем остаётся отрицательное число.',
          'Yes. For x smaller than four, a negative number is left under the root.',
        ),
        items: [
          { id: 'a', right: true, label: 'x < 4' },
          {
            id: 'b', label: 'x > 4',
            hint: L("To'rtdan katta x larda ildiz ostida musbat son qoladi, u aniqlangan.", 'При x больше четырёх под корнем остаётся положительное число, оно определено.', 'For x greater than four a positive number is left under the root, and it is defined.'),
          },
          {
            id: 'c', label: L('Har qanday qiymatda aniqlangan', 'Определена при любом значении', 'Defined at every value'),
            hint: L("Ildiz ostida manfiy son bo'lmaydi, bu yerda esa kichik x larda aynan shu bo'ladi.", 'Под корнем не бывает отрицательного числа, а здесь при малых x именно оно и получается.', 'A negative number cannot stand under a root, and for small x that is exactly what happens here.'),
          },
        ],
        solution: [
          L("x − 4 ≥ 0 bo'lishi kerak", 'Нужно, чтобы x − 4 ≥ 0', 'We need x − 4 ≥ 0'),
          'x ≥ 4',
          L('x < 4 da aniqlanmagan', 'При x < 4 не определено', 'Undefined for x < 4'),
        ],
      },
      {
        expr: <Row size="big" align="center">{F('1', '√(x − 2)')}</Row>,
        question: L('Bu ifoda qaysi qiymatda aniqlanmagan?', 'При каком значении это выражение не определено?', 'At which value is this expression undefined?'),
        ok: L(
          "Ha. Ikkida ildiz nolga aylanadi, nolga esa bo'lish mumkin emas.",
          'Да. При двух корень обращается в нуль, а делить на нуль нельзя.',
          'Yes. At two the root becomes zero, and you cannot divide by zero.',
        ),
        items: [
          { id: 'a', right: true, label: 'x ≤ 2' },
          {
            id: 'b', label: 'x < 2',
            hint: L("Ikkini ham tekshiring: unda ildiz nolga aylanadi, maxrajda esa nol bo'lishi mumkin emas.", 'Проверь и двойку: там корень обращается в нуль, а в знаменателе нуля не бывает.', 'Check two as well: there the root becomes zero, and the denominator cannot be zero.'),
          },
          {
            id: 'c', label: 'x ≠ 2',
            hint: L("Ikkidan kichik x lar uchun ham ildiz ostida manfiy son qoladi, ular ham aniqlanmagan.", 'При x меньше двух под корнем тоже остаётся отрицательное число, и там тоже не определено.', 'For x smaller than two a negative number is left under the root too, and it is undefined there as well.'),
          },
        ],
        solution: [
          L(
            "x − 2 > 0 bo'lishi kerak, nol ham bo'lmaydi, chunki u maxrajda",
            'Нужно, чтобы x − 2 > 0, нуль тоже не подходит, ведь это знаменатель',
            'We need x − 2 > 0, and zero is not allowed either, since it is the denominator',
          ),
          'x > 2',
          L('x ≤ 2 da aniqlanmagan', 'При x ≤ 2 не определено', 'Undefined for x ≤ 2'),
        ],
      },
      {
        expr: <Row size="big" align="center">{F('1', 'x² + 1')}</Row>,
        question: L('Bu ifoda qaysi qiymatda aniqlanmagan?', 'При каком значении это выражение не определено?', 'At which value is this expression undefined?'),
        ok: L(
          "Ha. X kvadrat manfiy bo'lolmaydi, unga bir qo'shilsa, natija hech qachon nolga tushmaydi.",
          'Да. X в квадрате не может быть отрицательным, а если к нему добавить единицу, результат никогда не опустится до нуля.',
          'Yes. X squared cannot be negative, and adding one to it never brings the result down to zero.',
        ),
        items: [
          { id: 'a', right: true, label: L('Har qanday qiymatda aniqlangan', 'Определена при любом значении', 'Defined at every value') },
          {
            id: 'b', label: 'x ≠ 0',
            hint: L("Nolda maxraj bir bo'ladi, bu nolga teng emas.", 'При нуле знаменатель равен единице, а это не нуль.', 'At zero the denominator equals one, and that is not zero.'),
          },
          {
            id: 'c', label: 'x ≠ 1 va x ≠ −1',
            hint: L("Birda va minus birda maxraj ikkiga teng, bu ham nolga emas.", 'При единице и минус единице знаменатель равен двум, и это тоже не нуль.', 'At one and minus one the denominator equals two, and that is not zero either.'),
          },
        ],
        solution: [
          L(
            'x² + 1 = 0 tenglama yechimga ega emas',
            'Уравнение x² + 1 = 0 не имеет решений',
            'The equation x² + 1 = 0 has no solutions',
          ),
          L(
            "chunki x² hech qachon manfiy bo'lmaydi",
            'ведь x² никогда не бывает отрицательным',
            'because x² is never negative',
          ),
          L('Har qanday qiymatda aniqlangan', 'Определена при любом значении', 'Defined at every value'),
        ],
      },
      // OLTINCHI MISOL: formula YO'Q, faqat GRAFIK. Beshtasi ham formuladan
      // aniqlanadi, bu esa boshqa ko'rinishdan o'sha savolni beradi —
      // aniqlanish sohasini rasmdan o'qish ham SHU mashqning bir qismi.
      {
        expr: (
          <svg viewBox="0 0 140 90" width="220" role="img" style={{ margin: '0 auto', display: 'block' }}>
            <line x1="4" y1="84" x2="136" y2="84" stroke="rgba(23,26,29,.2)" strokeWidth="1.2"/>
            <line x1="70" y1="18" x2="70" y2="84" stroke={T.tip} strokeWidth="1.4" strokeDasharray="3 3" opacity=".7"/>
            <path d="M8,80 Q40,50 62,20" fill="none" stroke={T.accent} strokeWidth="2.4"/>
            <path d="M78,70 Q100,40 132,10" fill="none" stroke={T.accent} strokeWidth="2.4"/>
            <text x="70" y="8" textAnchor="middle" fontFamily={MATH_FONT} fontSize="11" fill={T.tip}>x = 2</text>
          </svg>
        ),
        question: L(
          "Grafikda funksiya qaysi qiymatda aniqlanmagan?",
          'При каком значении функция не определена на графике?',
          'At which value is the function undefined, according to the graph?',
        ),
        ok: L(
          "Ha. Grafik ikkiga bo'lingan, ikki bo'lak orasidagi tirqish x ikkida turadi.",
          'Да. График разбит на две части, и разрыв между ними стоит при x равном двум.',
          'Yes. The graph is split into two pieces, and the gap between them sits at x equals two.',
        ),
        items: [
          { id: 'a', right: true, label: 'x = 2' },
          {
            id: 'b', label: 'x = 0',
            hint: L("Grafik shu yerda tutash, hech qanday tirqish yo'q.", 'График здесь сплошной, разрыва нет.', 'The graph is continuous there, no gap.'),
          },
          {
            id: 'c', label: L('Har qanday qiymatda aniqlangan', 'Определена при любом значении', 'Defined at every value'),
            hint: L("Ikki bo'lak orasida ochiq joy ko'rinadi, aynan x ikkida.", 'Между двумя частями виден пропуск, именно при x равном двум.', 'A gap is visible between the two pieces, exactly at x equal to two.'),
          },
        ],
        solution: [
          L(
            "Grafikda x ikkida uzilish ko'rinadi",
            'На графике при x равном двум виден разрыв',
            'The graph shows a break at x equal to two',
          ),
          L('Funksiya shu yerda aniqlanmagan', 'Здесь функция не определена', 'The function is undefined here'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ: BOSHQA O'QUVCHINING YECHIMIDA BITTA XATO QATOR (grade8
// Dars01 12-ekranidagi `audit` naqsh, xuddi shu `Drill` asbobi bilan).
// Har qadam to'g'ri KO'RINADI, xato faqat BIR qatorda — shuning uchun
// tuzoq.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Yechimdagi bitta xato qator",
    'Ошибка в одной строке решения',
    'One wrong line in a solution',
  ),
  audio: [
    A('mount',
      "Bexruzning yechimi. Unda bitta qator noto'g'ri, qolganlari to'g'ri.",
      'Решение Бехруза. В нём одна строка неверна, остальные верны.',
      "Bexruz's solution. One line in it is wrong, the rest are correct."),
    A('why',
      "Har qadamni alohida tekshiring. Xato ko'rinishdan yashiringan bo'ladi, u har doim aniq bitta joyda.",
      'Проверяй каждый шаг отдельно. Ошибка прячется за видом решения, но она всегда в одном конкретном месте.',
      'Check every step on its own. The mistake hides behind the look of the solution, but it is always in one exact spot.'),
  ],
  props: {
    stepLabel: L('Topshiriq', 'Задание', 'Task'),
    solutionLabel: L("TO'G'RI YECHIM", 'ВЕРНОЕ РЕШЕНИЕ', 'CORRECT SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Xatoni topish — imtihonda kerak bo'ladigan ko'nikma.",
      'Находить чужую ошибку — навык, который нужен на контрольной.',
      "Finding someone else's mistake is a skill you need on a test.",
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{F('1', 'x² − 9')}</Row>,
        question: L(
          "Bexruz maxrajni nolga tenglab, x kvadrat to'qqizga teng ekanini topdi, so'ng faqat bitta yechim yozdi: x uch. Qaysi qadam noto'g'ri?",
          'Бехруз приравнял знаменатель к нулю, нашёл, что x в квадрате равно девяти, и записал только одно решение: x равен трём. Какой шаг неверен?',
          'Bexruz set the denominator to zero, found that x squared equals nine, and wrote only one solution: x equals three. Which step is wrong?',
        ),
        ok: L(
          "Ha. X kvadrat to'qqizga teng bo'lganda ikkita yechim bor, uch va minus uch, lekin Bexruz faqat bittasini yozgan.",
          'Да. Когда x в квадрате равно девяти, есть два решения, три и минус три, но Бехруз записал только одно.',
          'Yes. When x squared equals nine there are two solutions, three and minus three, but Bexruz wrote only one.',
        ),
        items: [
          {
            id: 'a', right: true,
            label: L("Ikkinchi yechimni, minus uchni, unutib qo'ygan", 'Забыл второе решение, минус три', 'Forgot the second solution, minus three'),
          },
          {
            id: 'b',
            label: L("Maxrajni nolga tenglashda xato qilgan", 'Ошибся, приравнивая знаменатель к нулю', 'Made a mistake setting the denominator to zero'),
            hint: L("Bu qadam to'g'ri: maxraj shu tenglama bilan nolga tenglanadi.", 'Этот шаг верен: знаменатель именно так приравнивают к нулю.', 'This step is correct: the denominator is set to zero exactly this way.'),
          },
          {
            id: 'c',
            label: L("X kvadratni to'qqizga teng deb topishda xato qilgan", 'Ошибся, находя, что x в квадрате равно девяти', 'Made a mistake finding that x squared equals nine'),
            hint: L("Bu qadam ham to'g'ri: to'qqiz shunchaki o'ng tomonga o'tdi.", 'Этот шаг тоже верен: девятка просто перешла вправо.', 'This step is correct too: the nine simply moved to the right.'),
          },
        ],
        solution: [
          'x² = 9',
          L('x = 3 yoki x = −3', 'x = 3 или x = −3', 'x = 3 or x = −3'),
          L('x ≠ 3 va x ≠ −3', 'x ≠ 3 и x ≠ −3', 'x ≠ 3 and x ≠ −3'),
        ],
      },
      {
        expr: <Row size="big" align="center">{F('√(x − 1)', 'x − 1')}</Row>,
        question: L(
          "Kamola yozdi: x bir bo'lmasligi kerak, chunki bu son maxrajni nolga aylantiradi. Bu to'g'rimi?",
          'Камола написала: x не должен быть равен единице, потому что это число обращает знаменатель в нуль. Это верно?',
          'Kamola wrote that x must not equal one, because that number turns the denominator to zero. Is that correct?',
        ),
        ok: L(
          "Yo'q. Maxraj sharti to'g'ri, lekin ildiz sharti unutilgan: birdan kichik x larda ildiz ostida manfiy son qoladi.",
          'Нет. Условие знаменателя верно, но забыто условие корня: при x меньше единицы под корнем остаётся отрицательное число.',
          'No. The denominator condition is correct, but the root condition is forgotten: for x smaller than one a negative number is left under the root.',
        ),
        items: [
          { id: 'a', right: true, label: L("Yo'q, x > 1 ham kerak", 'Нет, нужен ещё x > 1', 'No, x > 1 is also needed') },
          {
            id: 'b', label: L("Ha, to'g'ri", 'Да, верно', 'Yes, correct'),
            hint: L("Ildiz ostida manfiy son bo'lmaydi, birdan kichik x lar ham tekshirilishi kerak.", 'Под корнем не бывает отрицательного числа, x меньше единицы тоже нужно проверить.', 'A negative number cannot stand under a root, x smaller than one must be checked too.'),
          },
          {
            id: 'c', label: L('Ha, lekin x ≥ 1 deb yozish kerak edi', 'Да, но следовало написать x ≥ 1', 'Yes, but it should have said x ≥ 1'),
            hint: L("Bir aynan shu yerda maxrajni ham nolga aylantiradi, demak u ham chiqarib tashlanadi.", 'Единица здесь же обращает в нуль и знаменатель, значит она тоже исключается.', 'One also turns the denominator to zero right here, so it too is excluded.'),
          },
        ],
        solution: [
          L(
            "x − 1 > 0 bo'lishi kerak (nol ham bo'lmaydi, chunki u maxrajda)",
            'Нужно, чтобы x − 1 > 0 (нуль тоже не подходит, ведь это знаменатель)',
            'We need x − 1 > 0 (zero is not allowed either, since it is the denominator)',
          ),
          'x > 1',
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. YOZUVNI KATAKMA-KATAK TO'LDIRING (grade8 Dars01 13-ekranidagi
// `FillSolution` asbobi, umumiy qatlamdan import qilingan). Avval asbob
// namunani O'ZI to'ldiradi, keyin o'quvchi uch yozuvni birma-bir o'zi
// bosib to'ldiradi — murakkablik ortadi: bitta ko'paytuvchi, koeffitsient
// bilan, so'ngra ikkita ko'paytuvchi.
// ============================================================
const S13 = {
  eyebrow: L("KATAKMA-KATAK", 'ПО КЛЕТКАМ', 'CELL BY CELL'),
  title: L(
    "Yechimni qadamlar bilan yozing",
    'Запиши решение по шагам',
    'Write the solution step by step',
  ),
  audio: [
    A('mount',
      "Yechim yozilgan, lekin kataklar bo'sh. Avval qarang, keyin o'zingiz to'ldirasiz.",
      'Решение записано, но клетки пустые. Сначала посмотри, потом заполнишь сам.',
      'The solution is written but the cells are empty. Watch first, then you fill it in yourself.'),
    A('why',
      "Yo'l doim bir xil. Maxrajni nolga tenglaysiz, tenglamani yechasiz va topilgan sonni chiqarib tashlaysiz.",
      'Путь всегда один. Приравниваешь знаменатель к нулю, решаешь уравнение и исключаешь найденное число.',
      'The path is always the same. Set the denominator to zero, solve the equation, and exclude the number you found.'),
  ],
  props: {
    stepLabel: L('Misol', 'Пример', 'Example'),
    repeatLabel: L('Qaytarish', 'Повторить', 'Repeat'),
    doneNote: L(
      "Uchtasi ham to'ldi. Har safar bir xil yo'l: maxrajni nolga tenglash, yechish, shartni yozish.",
      'Все три заполнены. Каждый раз один путь: приравнять знаменатель к нулю, решить, записать условие.',
      'All three are filled. Every time the same path: set the denominator to zero, solve, write the condition.',
    ),
    showLabel: L(
      "Qarang — misolda ko'rsataman",
      'Смотри — покажу на примере',
      'Watch: I will show you on an example',
    ),
    againLabel: L('Yana bir bor', 'Ещё раз', 'Again'),
    selfLabel: L("Endi o'zim", 'Теперь я сам', 'Now myself'),
    nextSay: L('Keyingi yozuv', 'Следующая запись', 'The next record'),
    fact: {
      badge: L('Bilasizmi? · Fizika', 'Знаешь ли ты? · Физика', 'Did you know? · Physics'),
      text: L(
        "Haqiqiy formulalarda ham xuddi shunday: tezlik yo'lni vaqtga bo'lishdan chiqadi, vaqt esa hech qachon nolga teng bo'lmaydi — aks holda tezlikni hisoblab bo'lmaydi.",
        'В настоящих формулах то же самое: скорость равна пути, делённому на время, а время никогда не равно нулю — иначе скорость не посчитать.',
        "The same is true in real formulas: speed equals distance divided by time, and time is never zero — otherwise speed cannot be calculated.",
      ),
    },
    // KO'RSATISH o'z yozuvida, mustaqil ish esa boshqasida — aks holda
    // o'quvchi usulni emas, xotirasini takrorlaydi.
    demo: {
      chips: ['2', '0', '≠', '=', '6'],
      lines: [
        [{ t: '3x − 6 ' }, { slot: '=' }, { t: ' ' }, { slot: '0' }],
        [{ t: '3x = ' }, { slot: '6' }],
        [{ t: 'x = ' }, { slot: '2' }],
        [{ t: 'x ' }, { slot: '≠' }, { t: ' ' }, { slot: '2' }],
      ],
    },
    tasks: [
      {
        chips: ['5', '0', '≠', '=', '10'],
        lines: [
          [{ t: '2x + 10 ' }, { slot: '=' }, { t: ' ' }, { slot: '0' }],
          [{ t: '2x = −' }, { slot: '10' }],
          [{ t: 'x = −' }, { slot: '5' }],
          [{ t: 'x ' }, { slot: '≠' }, { t: ' −' }, { slot: '5' }],
        ],
      },
      {
        chips: ['4', '3', '0', '≠', '='],
        lines: [
          [{ t: '(x − 4)(x + 3) ' }, { slot: '=' }, { t: ' ' }, { slot: '0' }],
          [{ t: 'x = ' }, { slot: '4' }],
          [{ t: 'x = −' }, { slot: '3' }],
          [{ t: 'x ' }, { slot: '≠' }, { t: ' 4,  x ≠ −' }, { slot: '3' }],
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 14. BLITS. Umumiy o'ramdan: baholanadigan yagona ekran, va uni har
// sinfga qaytadan yozadigan narsa yo'q. Savollar BELGI haqida, va ular
// darsning O'Z asboblariga tayanadi: mashina, taxta, punkt.
// ============================================================
const S14 = {
  eyebrow: L('BLITS', 'БЛИЦ', 'BLITZ'),
  title: L(
    "Blits: ta'rif, shart, tekshirish",
    'Блиц: определение, условие, проверка',
    'Blitz: definition, condition, verification',
  ),
  audio: [
    A('mount',
      "Savollar birin ketin chiqadi. Ular yozuvni emas, belgini so'raydi.",
      'Вопросы выходят один за другим. Они спрашивают не запись, а признак.',
      'Questions come one after another. They ask not for a record but for the sign.'),
    A('why',
      "Hisob birinchi urinish bo'yicha yuradi. Qolganidan takrorlash kerak bo'lgan narsa yig'iladi.",
      'Счёт идёт по первой попытке. Из остального соберётся то, что стоит повторить.',
      'The count goes by the first attempt. The rest shows what is worth another pass.'),
  ],
  props: {
    items: [
      {
        id: 'q1',
        tag: 'argument-qiymat',
        ask: L(
          "To'p uchishda (t; h) juftligi yozib olindi: (2; 3). Bu yozuvda birinchi son nimani bildiradi — vaqtnimi yoki balandlikni?",
          'При полёте мяча записали пару (t; h): (2; 3). Что означает первое число в этой записи — время или высоту?',
          'While the ball was flying, a pair (t; h) was recorded: (2; 3). What does the first number in this pair mean — the time or the height?',
        ),
        options: [
          { id: 'arg', right: true, label: L('vaqt', 'время', 'the time') },
          { id: 'val', label: L('balandlik', 'высота', 'the height') },
        ],
        ok: L(
          "To'g'ri. Avval vaqt (argument), keyin balandlik (qiymat).",
          'Верно. Сначала время (аргумент), потом высота (значение).',
          'Correct. The time (the argument) first, the height (the value) second.',
        ),
        hint: L(
          "Avval vaqt o'tadi, keyin natija, balandlik, paydo bo'ladi. Juftlikda ham tartib shu.",
          'Сначала идёт время, а потом появляется результат, высота. В паре порядок тот же.',
          'Time passes first, and then the result, the height, appears. In a pair the order is the same.',
        ),
      },
      {
        id: 'q2',
        tag: 'grafik-rasm',
        ask: L(
          "h(t) funksiya bo'lsa, bitta t qiymatiga nechta h qiymati mos kelishi mumkin?",
          'Если h(t) — функция, скольким значениям h может соответствовать одно значение t?',
          'If h(t) is a function, how many values of h can correspond to one value of t?',
        ),
        options: [
          { id: 'one', right: true, label: L('bitta', 'одна', 'one') },
          { id: 'two', label: L('ikkita', 'две', 'two') },
          { id: 'many', label: L("qancha bo'lsa ham", 'сколько угодно', 'any number') },
        ],
        ok: L(
          "To'g'ri. Funksiya bo'lgani uchun, bitta vaqtga faqat bitta balandlik mos keladi.",
          'Верно. Так как это функция, одному моменту времени соответствует ровно одна высота.',
          'Correct. Since this is a function, exactly one height corresponds to one moment in time.',
        ),
        hint: L(
          "Ikkita balandlik bitta vaqtga mos kelolmaydi, bu funksiya ta'rifiga zid. Teskarisi esa mumkin: ikkita vaqt bitta balandlikka mos kelishi.",
          'Две высоты одному моменту соответствовать не могут, это противоречит определению функции. А обратное возможно: два момента могут дать одну высоту.',
          'Two heights cannot correspond to one moment, that contradicts the definition of a function. But the reverse can happen: two moments can give one height.',
        ),
      },
      {
        id: 'q3',
        tag: 'soha-suratdan',
        ask: L(
          "1/0 ifodasi nega hisoblanmaydi?",
          'Почему выражение 1/0 нельзя вычислить?',
          "Why can't the expression 1/0 be calculated?",
        ),
        options: [
          {
            id: 'break', right: true,
            label: L("amal bajarilmaydi", 'действие не выполняется', 'the operation cannot be done'),
          },
          {
            id: 'big',
            label: L("son juda katta", 'число слишком большое', 'the number is too large'),
          },
          {
            id: 'neg',
            label: L("son manfiy", 'число отрицательное', 'the number is negative'),
          },
        ],
        ok: L(
          "To'g'ri. Nolga bo'lish va manfiy sondan ildiz bajarilmaydigan amallar.",
          'Верно. Деление на нуль и корень из отрицательного это невыполнимые действия.',
          'Correct. Division by zero and the root of a negative are operations that cannot be done.',
        ),
        hint: L(
          "Manfiy son maxrajda bemalol turadi. To'siq amalda, sonning kattaligida yoki ishorasida emas.",
          'Отрицательное число спокойно стоит в знаменателе. Преграда в действии, а не в размере или знаке числа.',
          'A negative number sits in a denominator without trouble. The obstacle is the operation, not the size or sign of the number.',
        ),
      },
      {
        id: 'q4',
        tag: 'tekshirilmagan',
        ask: L(
          "Aniqlanish sohasini x ≠ 3 deb topdingiz. Buni chindan tekshirish uchun nima qilasiz?",
          'Ты нашёл область определения: x не равен трём. Что сделать, чтобы это действительно проверить?',
          'You found the domain: x is not equal to three. What do you do to actually check that?',
        ),
        options: [
          {
            id: 'sub', right: true,
            label: L(
              "3 ni formulaga qo'yib, u haqiqatan buzilishini ko'raman",
              'подставлю тройку в формулу и увижу, что она действительно ломается',
              'substitute three into the formula and see it really break',
            ),
          },
          {
            id: 'copy',
            label: L(
              "javobni chiroyliroq ko'chirib yozaman",
              'перепишу ответ аккуратнее',
              'rewrite the answer more neatly',
            ),
          },
        ],
        ok: L(
          "To'g'ri. Javob songa qo'yib tekshiriladi.",
          'Верно. Ответ проверяют подстановкой числа.',
          'Correct. An answer is checked by substituting a number.',
        ),
        hint: L(
          "Tekshirilmagan javob so'zga ishonish demakdir. Chiqarib tashlangan sonni qo'ying va formula haqiqatan buzilishini ko'ring.",
          'Ответ без проверки это ответ на слово. Подставь исключённое число и убедись, что формула действительно ломается.',
          'An unchecked answer is an answer on trust. Put in the excluded number and see that the formula really breaks.',
        ),
      },
      {
        id: 'q5',
        tag: 'soha-suratdan',
        ask: L(
          "Yo'l va tezlik",
          'Путь и скорость',
          'Distance and speed',
        ),
        builtLabel: L("yig'ildi", 'собрано', 'assembled'),
        build: {
          lead: L(
            "60 kilometr yo'l t soatda o'tildi. Uchib yurgan plitkalardan tezlik formulasini va shartni yig'ing.",
            'Путь 60 километров пройден за t часов. Собери из летящих плиток формулу скорости и условие.',
            'A distance of 60 kilometres was covered in t hours. Assemble the speed formula and the condition from the drifting tiles.',
          ),
          lines: [
            [{ t: 'v = ' }, { frac: [[{ slot: '60' }], [{ slot: 't' }]] }],
            [{ t: 'Shart:  t ' }, { slot: '≠' }, { t: ' ' }, { slot: '0' }],
          ],
          // PLITKALAR SETKA BO'YICHA, tasodifiy emas. Telefonda maydon tor va
          // erkin joylashtirilgan plitkalar bir-birining ustiga chiqib qoladi:
          // bosish yuqoridagi plitkaga tushadi va yozuv boshqa tartibda
          // yig'iladi (o'lchandi 2026-08-21, 390 va 360 px).
          tiles: [
            { id: 't1', v: '60', x: 6, y: 8 },
            { id: 't6', v: '=', x: 38, y: 8 },
            { id: 't2', v: 't', x: 70, y: 8 },
            { id: 't5', v: '+', x: 6, y: 52 },
            { id: 't3', v: '≠', x: 38, y: 52 },
            { id: 't4', v: '0', x: 70, y: 52 },
          ],
          hint: L(
            "Tezlik yo'lni vaqtga bo'lgandan chiqadi, qo'shgandan emas. Vaqt esa nol bo'lolmaydi.",
            'Скорость получается делением пути на время, а не сложением. А время нулём быть не может.',
            'Speed comes from dividing the distance by the time, not from adding. And the time cannot be zero.',
          ),
          doneNote: L(
            "Yig'ildi. Nol soatda yo'l o'tilmaydi, shuning uchun shart yozuv bilan birga yuradi.",
            'Собрано. За нуль часов путь не проходят, поэтому условие идёт вместе с записью.',
            'Assembled. No distance is covered in zero hours, so the condition travels with the record.',
          ),
        },
      },
      // OLTINCHI SAVOL: taqiqni ALGEBRA emas, MASALANING O'ZI qo'yadi.
      // Beshinchisi (yo'l va tezlik) shunga o'xshash edi, faqat u yerda
      // taqiq BITTA edi (t noldan farqli). Bu yerda ikkita chegara birga
      // turadi, va ular QATTIQ tengsizlik bilan yoziladi: tomon nolga
      // aylansa, to'rtburchak yo'qoladi.
      {
        id: 'q6',
        tag: 'soha-suratdan',
        ask: L(
          "To'rtburchak tomonlari",
          'Стороны прямоугольника',
          'The sides of a rectangle',
        ),
        builtLabel: L("yig'ildi", 'собрано', 'assembled'),
        build: {
          lead: L(
            "To'rtburchakning bir tomoni x, ikkinchisi (10 − x). Ikkalasi ham musbat bo'lishi kerak. Uchib yurgan plitkalardan shartni yig'ing.",
            'Одна сторона прямоугольника x, другая (10 − x). Обе должны быть положительными. Собери условие из летящих плиток.',
            'One side of the rectangle is x, the other is (10 − x). Both must be positive. Assemble the condition from the drifting tiles.',
          ),
          lines: [
            [{ t: 'Shart:  0 ' }, { slot: '<' }, { t: ' x ' }, { slot: '<' }, { t: ' 10' }],
          ],
          tiles: [
            { id: 'r1', v: '<', x: 20, y: 30 },
            { id: 'r2', v: '<', x: 70, y: 30 },
            { id: 'r3', v: '≤', x: 20, y: 66 },
            { id: 'r4', v: '0', x: 70, y: 66 },
          ],
          hint: L(
            "Agar tomon nolga teng bo'lsa, to'rtburchak yo'qoladi. Shuning uchun teng belgisiz, qattiq tengsizlik kerak.",
            'Если сторона равна нулю, прямоугольник исчезает. Поэтому нужно строгое неравенство, без знака равенства.',
            'If a side equals zero, the rectangle disappears. So a strict inequality is needed, without an equals sign.',
          ),
          doneNote: L(
            "Yig'ildi. Bu yerda taqiqni algebra emas, masalaning o'zi qo'yadi: tomon musbat bo'lishi kerak.",
            'Собрано. Здесь запрет ставит не алгебра, а сама задача: сторона должна быть положительной.',
            'Assembled. Here the restriction comes not from algebra but from the problem itself: a side must be positive.',
          ),
        },
      },
    ],
  },
}

// ============================================================
// EKRAN 15. YAKUN. Yangi matematika va yangi kiritish YO'Q. Foiz YO'Q.
// Sahna — yakun sahnasi: u xukning savoliga javob beradi, chunki 1-ekranda
// o'quvchi nuqtalarni O'ZI qo'ygan, bu yerda esa haqiqiy iz to'liq turadi.
// ============================================================
const S15 = {
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L(
    "Funksiya va uning aniqlanish sohasi",
    'Функция и её область определения',
    'A function and its domain',
  ),
  audio: [
    A('s0',
      "Birinchi ekranda siz uch metr ikki marta uchraydi deb aytdingiz. Endi haqiqiy iz to'liq turadi va unda o'sha ikki payt ko'rinadi.",
      'На первом экране ты сказал, что три метра встретятся два раза. Теперь настоящий след стоит целиком, и на нём видны эти два момента.',
      'On the first screen you said three metres would come twice. Now the real trace stands in full and both moments are visible on it.'),
    A('s1',
      "Bugun siz uch qadamni o'rgandingiz. Argumentni qiymatdan ajratish, formula qayerda ma'nosini yo'qotishini topish va aniqlanish sohasini yozish.",
      'Сегодня освоены три шага. Отличить аргумент от значения, найти, где формула теряет смысл, и записать область определения.',
      'Today you learned three steps. Tell the argument from the value, find where the formula loses its meaning, and write the domain.'),
    A('s2',
      "Keyingi darsda funksiyaning xossalari. Qaysi oraliqda o'sadi va qaysida kamayadi, va buni grafikdan o'qish mumkin.",
      'В следующем уроке свойства функции. Где она растёт, а где убывает, и как прочитать это по графику.',
      'The next lesson covers the properties of a function. Where it increases and where it decreases, and how to read that from the graph.'),
  ],
  props: {
    // FINAL — sanoq va shpargalka emas, bir necha satr (grade8 Dars01
    // 15-ekranidagi `Takeaway` naqshi, umumiy qatlamdan import qilingan).
    // `mark` xukning savolini hal qiladigan haqiqiy javob: to'pning O'Z
    // aniqlanish sohasi.
    mark: '0 ≤ x ≤ 10',
    markNote: L(
      "to'pning haqiqiy aniqlanish sohasi",
      'настоящая область определения мяча',
      "the ball's real domain",
    ),
    lines: [
      L(
        "Argument va qiymatning tartibi bor: avval kirish, keyin chiqish",
        'У аргумента и значения есть порядок: сначала вход, потом выход',
        'The argument and the value have an order: input first, then output',
      ),
      STATEMENTS[2],
      L(
        "Javob songa qo'yib tekshiriladi",
        'Ответ проверяют подстановкой числа',
        'The answer is checked by substituting a number',
      ),
    ],
    bridge: L(
      "Keyingi dars: funksiyaning xossalari",
      'Следующий урок: свойства функции',
      'Next lesson: properties of a function',
    ),
    // 2026-08-26: FactCard shu ekranga ATAYIN qo'shilmadi — sahna + mark +
    // uch qator + bridge allaqachon 615px'ni to'ldirgan, o'lchov shuni
    // ko'rsatdi (95px chiqib ketardi, ko'rinmay). Bundan tashqari Takeaway
    // ATAYIN qisqa: «yakun — hisobot emas, bir necha qator» (metodist
    // qarori). Fakt S9 va S13 da qoladi.
  },
}

// ============================================================
// EKRANLAR. Rollar va tartib — `screens.jsx` dagi ROLE_ORDER bilan bir xil.
//
// `render` — SINFNING O'Z ASBOBI: o'ram uni shunchaki chaqiradi, va 9-sinfning
// asboblari 8-sinfning fayliga kirmaydi. `tool` esa umumiy o'ramning asbobini
// nomlaydi: qoida kartochkasi, erkin javob, blits va yakun.
// ============================================================
export const SCREENS = [
  { role: 'hook',     tool: 'pick', scene: <HookScene/>, ...S1 },
  { role: 'support',  tag: 'argument-qiymat', ...S2 },
  { role: 'explain',  tag: 'soha-suratdan', ...S3 },
  { role: 'explain',  tag: 'grafik-rasm', ...S4 },
  { role: 'explain',  tag: 'grafik-rasm', ...S5 },
  { role: 'explain',  tag: 'soha-suratdan', ...S6 },
  { role: 'explain',  tag: 'grafik-rasm', ...S7 },
  {
    role: 'rule',
    tag: 'argument-qiymat',
    // 2026-08-24: `scene` bu yerdan OLIB TASHLANDI — uchta natija endi
    // `DomainRuleScreen` ichida, chunki javobdan keyin ANIQ SHU kartochkalar
    // yig'ilib qo'yilishi kerak (metodist: «matn ko'p, tuzilishi
    // tushunarsiz»). Ular shu yerda qolganda ikki marta chiqib qolardi.
    ...S8,
  },
  { role: 'practice', tag: 'soha-suratdan', ...S9 },
  { role: 'practice', tool: 'drill', tag: 'soha-suratdan', ...S10 },
  { role: 'practice', tool: 'drill', tag: 'tekshirilmagan', ...S11 },
  { role: 'practice', tool: 'drill', tag: 'grafik-rasm', ...S12 },
  { role: 'transfer', tool: 'fill', tag: 'soha-suratdan', ...S13 },
  {
    role: 'blitz',
    tool: 'blitz',
    ...S14,
    props: {
      ...S14.props,
      scoreLabel: L('birinchi urinishdan', 'с первой попытки', 'on the first try'),
      stepLabel: L('Savol', 'Вопрос', 'Question'),
    },
  },
  { role: 'summary',  tool: 'takeaway', scene: <FinalScene/>, ...S15 },
]

// PALITRA: sinf bo'yicha bitta konstanta, `asboblar.jsx`dagi `G9_RECOLOR`
// (metodist, 2026-08-06, 2026-08-27 sinf bo'yicha qat'iylashtirildi).
// Bu yerda alohida nusxa yo'q — har bir 9-sinf darsi rangni bitta joydan
// oladi.
export default makeLesson({ META, STATEMENTS, MISS, SCREENS, styles: G9_STYLES, recolor: G9_RECOLOR })
