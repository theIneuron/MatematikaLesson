// ============================================================================
// 8-sinf, Dars 1. RATSIONAL IFODALAR VA RATSIONAL KASRLAR.
//
// NOLDAN yozildi 2026-08-13, metodist topshirig'i bo'yicha: oldingi variant
// o'chirildi, bu dars 7-SINF UROK 1 NAQSHIDA qurilgan va 3-SINFNING
// tushuntirish usullarini oladi.
//
// METODIST TASDIQLAGAN TO'RT QARORI (2026-08-13):
//   1. KO'RSATISH, keyin O'ZI. 3-ekranda dastur misolni O'ZI yechadi: qo'l
//      ko'rsatkichi, son kasrga uchib tushadi, izoh qadamni nomlaydi — va
//      yo'l-yo'lakay SAVOL beriladi, javobsiz demo to'xtab turadi (3-sinf
//      `TapBinDemo`). 4-ekranda xuddi shu uch qadamni o'quvchi O'ZI bajaradi.
//   2. ASOSIY ASBOB — qo'l YOZUVNING ICHIDA: o'quvchi kasrning qaysi qismidan
//      taqiq kelib chiqishini o'zi bosadi, keyin o'z sonini qo'yadi
//      (`TapPart`, 7-sinfdagi `StepOrder` ning tarjimasi).
//   3. XUK — bitta yozuv, IKKI MASHINA, boshqa javob: plotter uzluksiz chiziq
//      chizadi, jadval esa chiziqcha qo'yadi (`PlotVsTable`). 7-sinfda bu
//      «oddiy va injener kalkulyator».
//   4. HARAKAT: qo'l va sonning uchishi, chiziqning uzilishi, jadvalning
//      yacheyka-yacheyka to'lishi, ruhsat etilgan qiymatlar sohasi satrining bir taktda miltillashi.
//      Boshqa hech narsa harakatlanmaydi.
//
// 3-SINFDAN OLINGAN USULLAR: demo-ko'rsatish (`TapBinDemo`), qadamlarning
// kaskad bilan ochilishi, xukka QAYTISH qoida ekranida (2 va 3-sinf `s7`).
// 4-SINFDAN: qoidani o'quvchi YIG'ADI (`RuleBuilder`).
//
// Bu faylda FAQAT MA'LUMOT (ETALON_8SINF.md §13.2). Mexanika `tools.jsx` da,
// o'ram `screens.jsx` da, yadro `core.jsx` da, javob tekshiruvi `mathcore.js` da.
// Raskadrovka: src/books/grade8/DARS01_SKELET.md
// `import React` SHART (LMS xom jsx ni klassik rejimda yuklaydi).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L, MATH_FONT, Row, T, useT } from './core.jsx'
import { CaseStrip } from './feed.jsx'
import { SceneBand } from './method.jsx'
import { A, W, makeLesson } from './screens.jsx'
import { F } from './tools.jsx'

export const META = {
  id: 'alg-8-01',
  n: 1,
  row: 1,
  block: 'Б1',
  topic: L(
    'Ratsional ifodalar va ratsional kasrlar',
    'Рациональные выражения и рациональные дроби',
    'Rational expressions and rational fractions',
  ),
  voice: 'm',
  total: 15,
}

// Uchta tasdiq: 8-ekrandagi kartochka va 15-ekrandagi jamlanma (§13.2 p. 5).
export const STATEMENTS = [
  L(
    "Songa bo'linsa — butun ifoda, harfga bo'linsa — kasr ifoda",
    'Делят на число — целое, делят на букву — дробное',
    'Divide by a number and it is integral, by a letter and it is fractional',
  ),
  L(
    "ruhsat etilgan qiymatlar sohasini maxraj beradi: maxrajning nollari taqiqlangan",
    'ОДЗ задаёт знаменатель: нули знаменателя недопустимы',
    'The denominator sets the domain: its zeros are not admissible',
  ),
  L(
    "Suratdagi nol — qiymat nol, maxrajdagi nol — qiymat yo'q",
    'Нуль в числителе — значение нуль, нуль в знаменателе — значения нет',
    'Zero above the bar gives zero, zero below it gives no value',
  ),
]

// Adashishlar (§11). `at` — kontrprimer uchun SON.
// З18 va З19 — §11 ro'yxatida YO'Q va metodist so'zini kutadi (DARS01_SKELET §3).
export const MISS = {
  'З2': {
    what: L(
      "ruhsat etilgan qiymatlar sohasi topilmadi yoki yo'qoldi",
      'ОДЗ не найдена или потеряна',
      'the domain was not found or was lost',
    ),
    wrong: '(x*x-4)/(x-2)',
    at: 2,
  },
  'З16': {
    what: L(
      'javob son bilan tekshirilmadi',
      'ответ не проверен числом',
      'the answer was not checked with a number',
    ),
    wrong: null,
    at: 0,
  },
  'З18': {
    what: L(
      'suratdagi nol va maxrajdagi nol aralashtirildi',
      'нуль в числителе и нуль в знаменателе смешаны',
      'zero in the numerator confused with zero in the denominator',
    ),
    wrong: '0/(x-1)',
    at: 5,
  },
  'З19': {
    what: L(
      "songa bo'lish harfli ifodaga bo'lish deb olindi",
      'деление на число принято за деление на выражение с буквой',
      'dividing by a number taken for dividing by an expression with a letter',
    ),
    wrong: '(2*x+6)/3',
    at: 1,
  },
}

// ============================================================
// СПОСОБЫ (§4 эталона). Урок держится на них, а не на перечне экранов.
// Способ имеет имя, записан шагами и применяется в практике: одна и та же
// карточка стоит там, где способ вводится, и рядом с заданием, которое им
// решается. Не подсказка после ошибки: карточка на экране стоит всегда.
//
// Объявлены ДО экранов: экран 6 берёт M_ruhsat etilgan qiymatlar sohasi, а обращение к const выше по
// файлу падает с «Cannot access before initialization».
// ============================================================
const SC_PRICE = L('BIR DONA NARXI', 'ЦЕНА ЗА ШТУКУ', 'PRICE PER ITEM')
const SC_APP = L('SAVDO ILOVASI', 'ПРИЛОЖЕНИЕ МАГАЗИНА', 'SHOP APP')
const SC_QTY = L('miqdor k', 'количество k', 'quantity k')
const SC_CALC = L('HISOBLASH', 'РАССЧИТАТЬ', 'CALCULATE')
const SC_FILE = L('narx.js', 'цена.js', 'price.js')

// ============================================================
// СЦЕНА ЭКРАНА 2 — КОД ПРИЛОЖЕНИЯ. Четыре формулы печатаются построчно, как
// в редакторе: номера строк, каретка, подсветка текущей. Ученик видит, что
// это не абстрактные записи, а код, который он и чинит.
//
// Строки появляются по очереди (каскад в g8-late), последней встаёт та, где
// под чертой буква, — но НИЧЕМ не выделена: находит её ученик.
// ============================================================
// eslint-disable-next-line react-refresh/only-export-components
const CodeScene = () => {
  const t = useT()
  // СЦЕНА БЕЗ АНИМАЦИИ, И ЭТО РЕШЕНИЕ, А НЕ НЕДОДЕЛКА.
  // Была бегущая проверка с галочками; она останавливалась на третьей строке
  // и тем самым ВЫДАВАЛА ОТВЕТ до выбора ученика — прибор становился оракулом
  // (методист, 2026-08-16). Любое движение здесь либо показывает ответ, либо
  // не объясняет ничего: выбор делает ученик, а не программа.
  // Панель кода остаётся как контекст: это строки из его приложения.
  // Имён переменных нет: они добавляли шум, ученик читал price вместо
  // математики. Остались сами вычисления — то, что приложение и считает.
  const rows = ['3a − 4', '(a + 1) : 2', '7 : (a − 5)', 'a · a + a']
  return (
    <SceneBand kind="hook" label={L(
      'Ilova kodi',
      'Код приложения',
      'The app code',
    )}>
      <rect x="18" y="6" width="364" height="142" rx="14" fill={T.paper}
        stroke="rgba(23,26,29,.16)" strokeWidth="1.4"/>
      {[0, 1, 2].map((i) => (
        <circle key={'d' + i} cx={34 + i * 11} cy="20" r="3.4"
          fill={i === 0 ? 'rgba(201,84,44,.55)' : 'rgba(23,26,29,.18)'}/>
      ))}
      <text x="200" y="23" textAnchor="middle" fontFamily="'JetBrains Mono', monospace"
        fontSize="7.5" fill={T.ink3}>{t(SC_FILE)}</text>
      <line x1="18" y1="30" x2="382" y2="30" stroke="rgba(23,26,29,.10)" strokeWidth="1"/>

      {rows.map((r, i) => (
        <g key={'r' + i}>
          <text x="36" y={53 + i * 25} fontFamily="'JetBrains Mono', monospace"
            fontSize="9" fill={T.ink4}>{i + 1}</text>
          <text x="52" y={53 + i * 25} fontFamily={MATH_FONT} fontSize="15" fill={T.ink}>{r}</text>
        </g>
      ))}
    </SceneBand>
  )
}





// ============================================================
// СЦЕНА ХУКА (§6). Два экрана приложения: у одного пользователя цена
// посчиталась, у второго — ошибка. Программа ОДНА, различаются данные, и
// это видно по подписям под телефонами.
//
// Анимация: сначала прочерчиваются корпуса, потом на левом проступает цена,
// последней на правом вспыхивает ошибка. Порядок неслучаен — ученик успевает
// увидеть, что «нормально» бывает, прежде чем увидит поломку.
// ============================================================
// eslint-disable-next-line react-refresh/only-export-components
const HookScene = () => {
  const t = useT()
  // РЕАЛИЗМ СОБИРАЕТСЯ ИЗ МЕЛОЧЕЙ, а не из корпуса. Здесь их семь: тень под
  // телефоном, вырез камеры, строка состояния со связью и батареей, шапка с
  // иконкой и стрелкой назад, поле ввода с курсором, кнопка с тенью, полоса
  // жеста внизу. Убрать любую — и рисунок опять станет плашкой.
  const phone = (x, bad) => (
    <g key={x}>
      {/* тень под корпусом: без неё телефон лежит в бумаге, а не на ней */}
      <rect x={x + 6} y="12" width="140" height="146" rx="20" fill="rgba(23,26,29,.10)"/>

      <rect x={x - 3} y="48" width="3" height="12" rx="1.5" fill="rgba(23,26,29,.26)"/>
      <rect x={x - 3} y="64" width="3" height="20" rx="1.5" fill="rgba(23,26,29,.26)"/>
      <rect x={x + 142} y="54" width="3" height="26" rx="1.5" fill="rgba(23,26,29,.26)"/>

      <rect x={x} y="6" width="142" height="146" rx="20"
        fill={T.paper} stroke={bad ? T.tip : 'rgba(23,26,29,.20)'} strokeWidth={bad ? 2.2 : 1.4}
        pathLength="1" className="g8-draw"/>
      {/* экран внутри корпуса: рамка телефона видна как поле вокруг */}
      <rect x={x + 5} y="11" width="132" height="136" rx="16" fill={T.bg} opacity=".55"/>

      {/* вырез камеры */}
      <rect x={x + 58} y="14" width="26" height="7" rx="3.5" fill="rgba(23,26,29,.82)"/>

      {/* строка состояния: время, связь, батарея */}
      <text x={x + 14} y="20" fontFamily="'Manrope', system-ui, sans-serif" fontSize="6"
        fontWeight="700" fill={T.ink2}>9:41</text>
      {[0, 1, 2].map((i) => (
        <rect key={'w' + i} x={x + 96 + i * 3.4} y={19 - i * 1.6} width="2.2" height={3 + i * 1.6}
          rx="0.6" fill="rgba(23,26,29,.40)"/>
      ))}
      <rect x={x + 110} y="14" width="15" height="6.5" rx="2" fill="none"
        stroke="rgba(23,26,29,.34)" strokeWidth="0.9"/>
      <rect x={x + 125.6} y="16" width="1.4" height="2.5" rx="0.7" fill="rgba(23,26,29,.34)"/>
      <rect x={x + 111.5} y="15.5" width={bad ? 3.5 : 12} height="3.5" rx="1"
        fill={bad ? T.tip : T.ok}/>

      {/* шапка приложения: стрелка назад, иконка, название */}
      <text x={x + 13} y="38" fontFamily="'Manrope', system-ui, sans-serif" fontSize="8"
        fill={T.ink3}>{'‹'}</text>
      <rect x={x + 21} y="29" width="11" height="11" rx="3.2" fill={bad ? T.tipSoft : T.okSoft}/>
      <text x={x + 26.5} y="37.5" textAnchor="middle" fontFamily="'Manrope', system-ui, sans-serif"
        fontSize="6.5" fontWeight="700" fill={bad ? T.tip : T.ok}>M</text>
      <text x={x + 37} y="38" fontFamily="'Manrope', system-ui, sans-serif" fontSize="7"
        fontWeight="700" fill={T.ink}>{t(SC_APP)}</text>
      <line x1={x + 8} y1="45" x2={x + 134} y2="45" stroke="rgba(23,26,29,.10)" strokeWidth="1"/>

      {/* поле ввода: подпись, рамка, курсор */}
      <text x={x + 13} y="58" fontFamily="'Manrope', system-ui, sans-serif" fontSize="6"
        fill={T.ink3}>{t(SC_QTY)}</text>
      <rect x={x + 11} y="62" width="120" height="21" rx="7" fill={T.paper}
        stroke={bad ? 'rgba(165,93,25,.45)' : 'rgba(23,26,29,.14)'} strokeWidth="1"/>
      <rect x={x + 18} y="67" width="1.2" height="11" rx="0.6" fill={T.ink3} opacity=".5"/>
      <text x={x + 124} y="77" textAnchor="end" fontFamily={MATH_FONT} fontSize="13"
        fontWeight="600" fill={bad ? T.tip : T.ink}>{bad ? '0' : '3'}</text>

      {/* кнопка с тенью */}
      <rect x={x + 13} y="91" width="116" height="17" rx="8.5" fill="rgba(201,84,44,.22)"/>
      <rect x={x + 11} y="89" width="120" height="17" rx="8.5" fill={T.accent}/>
      <text x={x + 71} y="100" textAnchor="middle" fontFamily="'Manrope', system-ui, sans-serif"
        fontSize="7" fontWeight="700" letterSpacing="0.4" fill="#fff">{t(SC_CALC)}</text>

      {/* полоса жеста */}
      <rect x={x + 51} y="143" width="40" height="2.6" rx="1.3" fill="rgba(23,26,29,.22)"/>
    </g>
  )
  return (
    <SceneBand kind="hook" label={L(
      "Ikki foydalanuvchi, bitta ilova",
      'Два пользователя, одно приложение',
      'Two users, one app',
    )}>
      {phone(42, false)}
      {phone(214, true)}

      <g className="g8-late">
        <rect x="53" y="112" width="120" height="26" rx="7" fill={T.okSoft}/>
        <text x="60" y="122" fontFamily="'Manrope', system-ui, sans-serif" fontSize="6"
          letterSpacing="0.6" fill={T.ink3}>{t(SC_PRICE)}</text>
        <text x="166" y="132" textAnchor="end" fontFamily={MATH_FONT} fontSize="15"
          fontWeight="600" fill={T.ok}>200</text>
      </g>
      <g className="g8-late2">
        <rect x="225" y="112" width="120" height="26" rx="7" fill={T.tipSoft}/>
        <circle cx="238" cy="125" r="5.6" fill="none" stroke={T.tip} strokeWidth="1.3"/>
        <text x="238" y="128" textAnchor="middle" fontFamily={MATH_FONT} fontSize="8"
          fontWeight="700" fill={T.tip}>!</text>
        <text x="249" y="128" fontFamily="'Manrope', system-ui, sans-serif" fontSize="8"
          fontWeight="700" fill={T.tip}>Error</text>
      </g>
    </SceneBand>
  )
}

// ============================================================
// EKRAN 1. XUK. Bitta yozuv, ikki mashina, boshqa javob.
// Plotter nuqtalarni birlashtiradi va teshikni CHIZMAYDI, jadval esa
// chiziqcha qo'yadi. Fakt haqiqiy va tekshirib ko'rish mumkin.
// Taxmin baholanmaydi: firuza, yashil yo'q, galochka yo'q (§14).
// ============================================================
const S1 = {
  eyebrow: L('RATSIONAL IFODALAR', 'РАЦИОНАЛЬНЫЕ ВЫРАЖЕНИЯ', 'RATIONAL EXPRESSIONS'),
  title: L(
    "Bajarilmagan bo'lish",
    'Деление, которое не выполнилось',
    'A division that did not happen',
  ),
  audio: [
    A('mount',
      "Ikki telefon yonma yon turibdi. Bittasida ilova narxni hisobladi, ikkinchisida hisoblay olmadi.",
      'Два телефона рядом. На одном приложение посчитало цену, на другом не смогло.',
      'Two phones side by side. On one the app computed the price, on the other it could not.'),
    A('why',
      "Farqni ekranlarga kiritilgan sonlardan qidiring.",
      'Разницу ищи в числах, которые введены на экранах.',
      'Look for the difference in the numbers entered on the screens.'),
  ],
  props: {
    // ХУК = ТОЛЬКО ПРОГНОЗ (§5). Одно действие на экране: ученик отвечает и
    // экран закрывается. Подстановка чисел переехала на экран 3, где ей и
    // место. Раньше на хуке было два действия подряд, и это нарушало
    // правило «один вопрос на экране».
    ask: L(
      "Dilnozada ilova nega hisoblay olmadi?",
      'Почему приложение не смогло посчитать у Дилнозы?',
      'Why could the app not compute for Dilnoza?',
    ),
    items: [
      {
        id: 'phone',
        show: L('Telefoni buzilgan', 'Сломан телефон', 'Her phone is broken'),
        hint: L(
          "Dastur ikkalasida bir xil. Telefon buzilgan bo'lsa, boshqa sonlarda ham hisoblay olmasdi.",
          'Программа у обоих одна. Со сломанным телефоном не считалось бы и на других числах.',
          'Both have the same program. A broken phone would fail on other numbers too.',
        ),
      },
      {
        id: 'data',
        right: true,
        show: L('U boshqa son kiritgan', 'Она ввела другое число', 'She entered a different number'),
      },
    ],
    after: L(
      "Ha. Ekranga qarang, miqdor nolga teng. Sababni dars davomida topamiz.",
      'Да. Посмотри на экран, количество равно нулю. Причину найдём по ходу урока.',
      'Yes. Look at the screen, the quantity is zero. We will find the reason during the lesson.',
    ),
  },
}

// ============================================================
// EKRAN 2. TAYANCH. Uchta topshiriq, javob YOZILADI. Natijaga hech narsa
// ketmaydi (§17): bu tekshiruv emas, darsning oldi.
// ============================================================
// EKRAN 2. TAYANCH. To'rtta yozuv, bittasida chiziq ostida HARF turadi.
// Ekran davolaydigan adashish: «kasrning o'zi xavfli». Xavfli kasr emas,
// xavfli CHIZIQ OSTIDAGI HARF — shuning uchun variantlar orasida maxraji
// son bo'lgan kasr ham bor.
// ============================================================
const S2 = {
  eyebrow: L('TAYANCH', 'ОПОРА', 'PRIOR KNOWLEDGE'),
  title: L(
    "Har doim aniqlanmaydigan ifoda",
    'Выражение, определённое не всегда',
    'An expression not always defined',
  ),
  audio: [
    A('mount',
      "To'rtta yozuv. Uchtasi istalgan son bilan ishlaydi, bittasi esa yo'q.",
      'Четыре записи. Три работают с любым числом, а одна нет.',
      'Four records. Three work with any number, one does not.'),
    A('why',
      "Farqni chiziq ostidan qidiring. Nima turibdi u yerda, son yoki harf.",
      'Разницу ищи под чертой. Что там стоит, число или буква.',
      'Look for the difference below the bar. What stands there, a number or a letter.'),
  ],
  props: {
    ask: L(
      "Qaysi yozuvda har bir a uchun qiymat YO'Q?",
      'В какой записи не при каждом a есть значение?',
      'In which record is there no value for every a?',
    ),
    items: [
      {
        id: 'lin',
        show: '3a − 4',
        hint: L(
          "Bu yerda harf ko'paytiriladi va ayiriladi. Buni istalgan son bilan qilish mumkin.",
          'Здесь буква умножается и вычитается. Такое можно с любым числом.',
          'Here the letter is multiplied and subtracted. That works with any number.',
        ),
      },
      {
        id: 'num',
        show: '(a + 1) : 2',
        hint: L(
          "Bu yerda ikkiga bo'lamiz. Ikkilik hech qachon nolga aylanmaydi.",
          'Здесь делят на два. Двойка нулём не станет никогда.',
          'Here we divide by two. A two never becomes zero.',
        ),
      },
      {
        id: 'var',
        right: true,
        show: '7 : (a − 5)',
      },
      {
        id: 'sq',
        show: 'a · a + a',
        hint: L(
          "Bu yerda bo'lish umuman yo'q, faqat ko'paytirish va qo'shish.",
          'Здесь деления нет вовсе — только умножение и сложение.',
          'There is no division here at all, only multiplication and addition.',
        ),
      },
    ],
    after: L(
      "Ha. Bu yerda 7 ni (a − 5) ga bo'lamiz. Beshlikda (a − 5) nolga aylanadi.",
      'Да. Здесь 7 делят на (a − 5). При пятёрке (a − 5) обращается в нуль.',
      'Yes. Here 7 is divided by (a − 5). At five (a − 5) becomes zero.',
    ),
  },
}

// ============================================================
// EKRAN 3. NARXLAR JADVALINI O'ZINGIZ TO'LDIRING.
//
// O'quvchi miqdorni qo'yadi, ilova hisoblaydi va natija jadvalga tushadi.
// Uchta qator uning O'Z natijalari bilan to'ladi, nolda esa qator bo'sh
// qoladi — bu ham uning natijasi, va u bilan bahslashmaydi.
//
// Metodist qarori 2026-08-16: bu ekran KO'RSATISH emas, o'quvchi harakati.
// 13-avgustdagi «ko'rsatish, keyin o'zi» juftligi 3-4 ekranlarda emas, 4-5
// da qoladi: 4 — o'zi qo'yadi, 5 — boshqa yozuvda takrorlaydi.
// ============================================================
// EKRAN 3. MA'LUMOTLARNI O'ZINGIZ QO'YING. Ikki ustun: summa va miqdor,
// har birida plyus va minus. O'quvchi ularni buraydi va narx qanday
// o'zgarishini ko'radi. Miqdorni nolga tushirsa, ilova YIQILADI — va buni
// u O'ZI qiladi, tayyor javobni tanlamaydi.
//
// Naqsh 1-sinf 2-darsdan («245 ni yig'ing»): u yerda razryad ustunlari,
// bu yerda formulani tashkil qiluvchi maydonlar.
// ============================================================
const S3 = {
  eyebrow: L("MA'LUMOTLARNI QO'YING", 'ПОДБЕРИ ДАННЫЕ', 'SET THE DATA'),
  title: L(
    "Summa va miqdor bo'linmasi",
    'Частное суммы и количества',
    'The quotient of total and quantity',
  ),
  audio: [
    A('mount',
      "Ikki ustun, sotuv summasi va tovar miqdori. Ularni o'zingiz buraysiz.",
      'Два столбца, сумма продажи и количество товара. Их ты крутишь сам.',
      'Two columns, the sale total and the quantity. You set them yourself.'),
    A('why',
      "Miqdorni kamaytiring va narx qanday o'zgarishini kuzating. Nolgacha tushiring.",
      'Уменьшай количество и смотри, как меняется цена. Доведи до нуля.',
      'Decrease the quantity and watch the price change. Bring it down to zero.'),
    A('why',
      "Odam qancha kam bo'lsa, har biriga shuncha ko'p to'g'ri keladi. Bo'luvchi kichrayganda ulush kattalashadi. Bo'luvchi nolga yetganda esa ulush umuman yo'q, bo'linadigan odam qolmaydi.",
      'Чем меньше людей, тем больше приходится на каждого. Когда делитель уменьшается, доля растёт. А когда делитель доходит до нуля, доли нет вовсе, делить не на кого.',
      'The fewer the people, the more each one gets. As the divisor shrinks, the share grows. And when the divisor reaches zero there is no share at all, there is no one to divide among.'),
  ],
  props: {
    cols: [
      {
        id: 'sum',
        label: L('summa', 'сумма', 'total'),
        start: 600, min: 100, max: 1200, step: 100,
      },
      {
        id: 'k',
        label: L('miqdor', 'количество', 'quantity'),
        start: 3, min: 0, max: 8, step: 1,
        risky: true,
      },
    ],
    calc: (v) => (v[1] === 0 ? null : v[0] / v[1]),
    resultLabel: L('bir dona narxi', 'цена за штуку', 'price per item'),
    stepLabel: L('Savol', 'Вопрос', 'Question'),
    // ДВЕ ЗАДАЧИ, а не «покрути и посмотри». Первая обратная: подобрать
    // количество под заданную цену — это рассуждение о делителях. Вторая
    // открывается после неё.
    // ТРИ ЦЕЛИ ПО ВОЗРАСТАНИЮ (методист, 2026-08-17). Одна цель бралась с
    // первого нажатия. Сто пятьдесят берётся количеством, двести пятьдесят
    // суммой шестьсот НЕ БЕРЁТСЯ ни при каком целом количестве, а сто
    // семьдесят пять требует ровно семьсот и четыре. Ученик вынужден
    // рассуждать о делимости, а не жать кнопку.
    goals: [
      {
        value: 150,
        ask: L(
          "Narx aynan 150 bo'ladigan miqdorni tanlang",
          'Подбери количество, при котором цена будет ровно 150',
          'Set the quantity so that the price is exactly 150',
        ),
        after: L(
          "To'g'ri. Olti yuzni yuz ellikka bo'lsak, to'rtta chiqadi.",
          'Верно. Шестьсот разделить на сто пятьдесят, получается четыре.',
          'Correct. Six hundred divided by one hundred fifty gives four.',
        ),
      },
      {
        value: 250,
        ask: L(
          "Endi narx 250 bo'lsin. Faqat miqdor bilan chiqmaydi",
          'Теперь цена 250. Одним количеством не выйдет',
          'Now make the price 250. The quantity alone will not do it',
        ),
        after: L(
          "Ha. Olti yuzni bo'lib ikki yuz ellik chiqmaydi, shuning uchun summa ham o'zgardi.",
          'Да. Из шестисот двести пятьдесят не получается, поэтому изменилась и сумма.',
          'Yes. Six hundred cannot give two hundred fifty, so the total had to change as well.',
        ),
      },
      {
        value: 175,
        ask: L(
          "Oxirgisi, narx 175. Summani ham, miqdorni ham tanlang",
          'Последнее, цена 175. Подбери и сумму, и количество',
          'Last one, the price is 175. Choose both the total and the quantity',
        ),
        after: L(
          "Yetti yuz va to'rtta. Bo'linma butun chiqadigan juftlikni topdingiz.",
          'Семьсот и четыре. Ты нашёл пару, при которой частное выходит целым.',
          'Seven hundred and four. You found the pair whose quotient comes out whole.',
        ),
      },
    ],
    ask: L(
      "Narx aynan 150 bo'ladigan miqdorni tanlang",
      'Подбери количество, при котором цена будет ровно 150',
      'Set the quantity so that the price is exactly 150',
    ),
    ask2: L(
      "Endi miqdorni nolgacha tushiring va nima bo'lishini ko'ring",
      'Теперь доведи количество до нуля и посмотри, что будет',
      'Now make the app fail. Bring the quantity down to zero',
    ),
    broke: L(
      "Miqdor nol bo'ldi va ilova hisoblay olmadi. Summani nolga bo'lib bo'lmaydi.",
      'Количество стало нулём, и приложение не смогло посчитать. Сумму нельзя разделить на нуль.',
      'The quantity became zero and the app could not compute. A total cannot be divided by zero.',
    ),
  },
}


// ============================================================
// EKRAN 4. BIR XIL BELGILAR, IKKI XIL YOZUV.
//
// Avvalgi variant bo'sh kataklar va tugmalardan iborat edi: yozuv faqat
// yig'ilgandan keyin paydo bo'lardi, va unga qadar QARAYDIGAN narsa yo'q edi
// (metodist, 2026-08-17). Endi ikkala yozuv ham darhol ko'rinadi: bir xil
// yetti va bir xil a, faqat TARTIB boshqa. O'quvchi qaysi biri yiqilishini
// tanlaydi va joyning ahamiyatini o'zi ko'radi.
// ============================================================
const S4 = {
  eyebrow: L('BUTUN VA KASR', 'ЦЕЛОЕ И ДРОБНОЕ', 'INTEGRAL AND FRACTIONAL'),
  title: L(
    "Butun ifoda va kasr ifoda",
    'Целое выражение и дробное выражение',
    'Integral and fractional expressions',
  ),
  audio: [
    A('mount',
      "Ikki yozuv. Ikkalasida ham yetti va a bor, faqat tartib boshqa. Ikkalasi ham ratsional ifoda deb ataladi.",
      'Две записи. В обеих есть семёрка и a, разный только порядок. Обе называются рациональными выражениями.',
      'Two records. Both have a seven and an a, only the order differs. Both are called rational expressions.'),
    A('why',
      "Qaysi biri biror sonda hisoblanmay qoladi? Chiziqning ostiga qarang.",
      'Какая из них не посчитается на каком-то числе? Смотри, что стоит под чертой.',
      'Which one stops computing at some number? Look at what stands below the bar.'),
  ],
  props: {
    ask: L(
      "Qaysi yozuv biror sonda hisoblanmay qoladi?",
      'Какая запись не посчитается на каком-то числе?',
      'Which record stops computing at some number?',
    ),
    items: [
      {
        id: 'safe',
        show: 'a : 7',
        name: L('BUTUN IFODA', 'ЦЕЛОЕ ВЫРАЖЕНИЕ', 'INTEGRAL EXPRESSION'),
        hint: L(
          "Bu yerda a yettiga bo'linadi. Yetti hech qachon nol bo'lmaydi, demak har doim hisoblanadi.",
          'Здесь a делят на семь. Семёрка нулём не станет никогда, значит считается всегда.',
          'Here a is divided by seven. A seven never becomes zero, so it always computes.',
        ),
      },
      {
        id: 'risky',
        right: true,
        show: '7 : a',
        name: L('RATSIONAL KASR', 'РАЦИОНАЛЬНАЯ ДРОБЬ', 'RATIONAL FRACTION'),
      },
    ],
    // ЗДЕСЬ вводятся оба понятия темы. Место выбрано не случайно: ученик
    // только что сам увидел РАЗНИЦУ между двумя записями, и названия
    // ложатся на увиденное различие, а не на пустое место.
    after: L(
      "Belgilar o'sha, joy boshqa.",
      'Знаки те же, место разное.',
      'Same symbols, different place.',
    ),
    // Экранный текст короткий, разбор целиком уходит в озвучку: абзац под
    // записями ученик не читает, он смотрит на подписи (методист, 2026-08-17).
    afterSay: L(
      "Belgilar o'sha, joy boshqa. Ikkala yozuv ham ratsional ifoda: harflar va sonlar amal belgilari bilan. Birinchisida harfga bo'linmaydi, shuning uchun u butun ifoda. Ikkinchisida chiziq ostida harf turibdi, shuning uchun u kasr ifoda, uni ratsional kasr deb ataymiz. Va a nol bo'lsa, ilova hisoblay olmaydi.",
      'Знаки те же, место разное. Обе записи — рациональные выражения: буквы и числа со знаками действий. В первой на букву не делят, поэтому она целое выражение. Во второй под чертой стоит буква, поэтому она дробное выражение, его называют рациональной дробью. И если a равно нулю, приложение не посчитает.',
      'Same symbols, different place. Both records are rational expressions: letters and numbers with operation signs. In the first nothing is divided by a letter, so it is an integral expression. In the second a letter stands below the bar, so it is a fractional expression, called a rational fraction. And if a is zero, the app cannot compute.',
    ),
  },
}


// ============================================================
const S5 = {
  eyebrow: L("TAQIQ KO'CHADI", 'ЗАПРЕТ ПЕРЕЕЗЖАЕТ', 'THE RESTRICTION MOVES'),
  title: L(
    "Taqiq maxrajga bog'langan",
    'Запрет привязан к знаменателю',
    'The restriction is tied to the denominator',
  ),
  audio: [
    A('mount',
      "Uchta yozuv. Ularning maxrajlari har xil, va taqiqlari ham har xil.",
      'Три записи. Знаменатели у них разные, и запреты тоже разные.',
      'Three records. Their denominators differ, and so do their restrictions.'),
    W('c2',
      "Maxraj uchga siljidi, taqiq ham uchga ko'chdi.",
      'Знаменатель сдвинулся на три, и запрет переехал на три.',
      'The denominator shifted by three, and the restriction moved to three.'),
    W('c3',
      "Beshga siljidi, taqiq beshda. Taqiq songa emas, MAXRAJGA bog'liq.",
      'Сдвинулся на пять, запрет на пятёрке. Запрет привязан не к числу, а к ЗНАМЕНАТЕЛЮ.',
      'Shifted by five, and the restriction is at five. It belongs to the DENOMINATOR, not to a number.'),
  ],
  props: {
    items: [
      { cap: L('maxraj', 'знаменатель', 'denominator'), den: 'a', ban: 'a ≠ 0' },
      { cap: L('maxraj', 'знаменатель', 'denominator'), den: 'a − 3', ban: 'a ≠ 3' },
      { cap: L('maxraj', 'знаменатель', 'denominator'), den: 'a − 5', ban: 'a ≠ 5' },
    ],
    conclusion: L(
      "Maxraj o'zgaradi — taqiq ham o'sha yerga ko'chadi",
      'Меняется знаменатель — туда же переезжает запрет',
      'The denominator changes and the restriction moves with it',
    ),
    // ПОСЛЕ ПОКАЗА — ХОД УЧЕНИКА. Отсчёт отделяет объяснение от работы,
    // вопросы идут от лёгкого к трудному: узнать готовый запрет, найти его
    // самому, отличить безопасный знаменатель.
    handoff: {
      seconds: 5,
      text: L("Endi o'zingiz", 'Теперь ты сам', 'Now it is your turn'),
      done: L(
        "Taqiqni maxrajdan topish — shu darsning asosiy ko'nikmasi.",
        'Находить запрет по знаменателю — главный навык этого урока.',
        'Finding the restriction from the denominator is the key skill of this lesson.',
      ),
    },
    quiz: [
      {
        question: L(
          "a − 7 maxrajda: taqiq qayerda?",
          'Знаменатель a − 7: где запрет?',
          'Denominator a − 7: where is the restriction?',
        ),
        items: [
          { id: 'a7', right: true, label: L('a ≠ 7', 'a ≠ 7', 'a ≠ 7') },
          {
            id: 'a0', label: L('a ≠ 0', 'a ≠ 0', 'a ≠ 0'),
            hint: L(
              "Nolda a − 7 minus yettiga teng, bu nol emas.",
              'При нуле a − 7 равно минус семи, а это не нуль.',
              'At zero a − 7 equals minus seven, which is not zero.',
            ),
          },
          {
            id: 'am7', label: L('a ≠ −7', 'a ≠ −7', 'a ≠ −7'),
            hint: L(
              "Minus yettida a − 7 minus o'n to'rtga teng.",
              'При минус семи a − 7 равно минус четырнадцати.',
              'At minus seven a − 7 equals minus fourteen.',
            ),
          },
        ],
      },
      {
        question: L(
          "2a maxrajda: taqiq qayerda?",
          'Знаменатель 2a: где запрет?',
          'Denominator 2a: where is the restriction?',
        ),
        items: [
          { id: 'z', right: true, label: L('a ≠ 0', 'a ≠ 0', 'a ≠ 0') },
          {
            id: 'two', label: L('a ≠ 2', 'a ≠ 2', 'a ≠ 2'),
            hint: L(
              "Ikkilikda 2a to'rtga teng, nolga emas.",
              'При двойке 2a равно четырём, а не нулю.',
              'At two, 2a equals four, not zero.',
            ),
          },
          {
            id: 'half', label: L("Taqiq yo'q", 'Запрета нет', 'No restriction'),
            hint: L(
              "Nolda 2a nolga aylanadi, demak taqiq bor.",
              'При нуле 2a обращается в нуль, значит запрет есть.',
              'At zero 2a becomes zero, so the restriction exists.',
            ),
          },
        ],
      },
      {
        question: L(
          "Qaysi maxrajda umuman taqiq yo'q?",
          'У какого знаменателя запрета нет вовсе?',
          'Which denominator has no restriction at all?',
        ),
        items: [
          { id: 'num', right: true, label: L('5', '5', '5') },
          {
            id: 'lin', label: L('a + 1', 'a + 1', 'a + 1'),
            hint: L(
              "Minus birda a + 1 nolga aylanadi.",
              'При минус единице a + 1 обращается в нуль.',
              'At minus one, a + 1 becomes zero.',
            ),
          },
          {
            id: 'sq', label: L('a · a', 'a · a', 'a · a'),
            hint: L(
              "Nolda a · a nolga teng.",
              'При нуле a · a равно нулю.',
              'At zero, a · a equals zero.',
            ),
          },
        ],
      },
    ],
  },
}


// ============================================================
const S6 = {
  eyebrow: L('IKKI USUL', 'ДВА СПОСОБА', 'TWO METHODS'),
  title: L(
    "Maxraj nolini topishning ikki usuli",
    'Два способа найти нуль знаменателя',
    'Two ways to find the zero of the denominator',
  ),
  audio: [
    A('mount',
      "Bitta yozuv va ikkita yo'l. Ikkalasi ham bir xil sonni beradi.",
      'Одна запись и два пути. Оба дают одно и то же число.',
      'One record and two ways. Both give the same number.'),
    W('w4',
      "To'rtda maxraj nol bo'ldi va ilova hisoblay olmadi. Birinchi usul ishladi, lekin uzoq.",
      'На четвёрке знаменатель обратился в нуль и приложение не посчитало. Первый способ сработал, но он долгий.',
      'At four the denominator became zero and the app could not compute. The first method worked, but it is slow.'),
    W('w6',
      "Ikkinchi usul qisqa, maxrajni nolga tenglaymiz.",
      'Второй способ короткий, приравниваем знаменатель к нулю.',
      'The second method is short, we set the denominator to zero.'),
    W('w7',
      "Bitta satr, va javob tayyor. Taxmin qilish shart emas.",
      'Одна строка, и ответ готов. Угадывать не пришлось.',
      'One line and the answer is ready. No guessing needed.'),
  ],
  props: {
    // Темп медленнее: методист сказал, что печатается слишком быстро.
    stepMs: 1900,
    blocks: [
      {
        name: L('1-USUL — SONLARNI SINAYMIZ', 'СПОСОБ 1 — ПОДСТАВЛЯЕМ ЧИСЛА', 'METHOD 1 — SUBSTITUTE NUMBERS'),
        lead: L(
          "Har bir sonni navbat bilan qo'yamiz",
          'Подставляем каждое число по очереди',
          'We substitute each number in turn',
        ),
        rows: [
          { text: 'k = 1   →   600 : (1 − 4)   =   −200' },
          { text: 'k = 2   →   600 : (2 − 4)   =   −300' },
          { text: 'k = 3   →   600 : (3 − 4)   =   −600' },
          { text: 'k = 4   →   600 : (4 − 4)   =   600 : 0', tone: 'no', note: L('xato', 'ошибка', 'error') },
        ],
      },
      {
        name: L('2-USUL — MAXRAJDAN', 'СПОСОБ 2 — ИЗ ЗНАМЕНАТЕЛЯ', 'METHOD 2 — FROM THE DENOMINATOR'),
        lead: L(
          "Maxrajni nolga tenglaymiz va yechamiz",
          'Приравниваем знаменатель к нулю и решаем',
          'We set the denominator to zero and solve',
        ),
        rows: [
          { text: 'k − 4 = 0' },
          { text: 'k = 4', tone: 'ok', note: L('bitta satr', 'одна строка', 'one line') },
        ],
      },
      {
        tone: 'sum',
        name: L('IKKALASI HAM TO\'RTLIKNI BERDI', 'ОБА СПОСОБА ДАЛИ ЧЕТВЁРКУ', 'BOTH METHODS GAVE FOUR'),
        lead: L(
          "Ikkinchisi taxmin qilishni talab qilmaydi",
          'Второй не требует перебирать числа',
          'The second one requires no guessing',
        ),
        rows: [{ text: 'k ≠ 4', tone: 'ok' }],
      },
    ],
  },
}

// ============================================================
// EKRAN 7. YOZUVNI QISMLARGA AJRATAMIZ. Naqsh 4-sinf 1-darsdan (sonni
// sinflarga ajratish): tepada yozuv, unda navbat bilan qism yoritiladi,
// ostida izoh polosalari to'planadi, pastda fakt kartochkasi.
//
// O'quvchi yangi mavzuni emas, ALLAQACHON tegilgan yozuvdagi ROLLARNI ko'radi.
// ============================================================
const S7 = {
  eyebrow: L('QISMLARGA AJRATAMIZ', 'РАЗБИРАЕМ ПО ЧАСТЯМ', 'BREAKING IT DOWN'),
  title: L(
    "Surat, maxraj va siljish",
    'Числитель, знаменатель и сдвиг',
    'Numerator, denominator and shift',
  ),
  audio: [
    A('mount',
      "Bitta yozuv, uchta qism. Har birining o'z roli bor.",
      'Одна запись, три части. У каждой своя роль.',
      'One record, three parts. Each has its own role.'),
    W('p2',
      "Maxraj hamma narsani hal qiladi, narx hisoblanadimi yoki yo'q, faqat undan bog'liq.",
      'Знаменатель решает всё, посчитается цена или нет, зависит только от него.',
      'The denominator decides everything, whether the price computes depends only on it.'),
    W('p3',
      "Siljish esa taqiq qayerda turishini belgilaydi.",
      'А сдвиг задаёт, где именно стоит запрет.',
      'The shift sets exactly where the restriction stands.'),
  ],
  props: {
    tokens: [
      { t: '600', id: 'sum' },
      { t: '  :  ' },
      { t: '(k', id: 'den' },
      { t: ' − 4)', id: 'shift' },
    ],
    steps: [
      {
        focus: 'sum',
        text: L(
          "600 — sotuv summasi. U istalgan bo'lishi mumkin, unga hech narsa ta'sir qilmaydi.",
          '600 — сумма продажи. Она может быть любой, на неё ничего не влияет.',
          '600 is the sale total. It can be anything; nothing depends on it.',
        ),
      },
      {
        focus: 'den',
        text: L(
          "k — maxrajdagi harf. Aynan maxraj narx hisoblanishini hal qiladi.",
          'k — буква в знаменателе. Именно знаменатель решает, посчитается ли цена.',
          'k is the letter in the denominator. The denominator decides whether the price computes.',
        ),
      },
      {
        focus: 'shift',
        text: L(
          "Minus to'rt — siljish. U tufayli taqiq nolda emas, to'rtlikda turadi.",
          'Минус четыре — сдвиг. Из-за него запрет не на нуле, а на четвёрке.',
          'Minus four is the shift. Because of it the restriction sits at four, not at zero.',
        ),
      },
    ],
    fact: {
      cap: L('BILASIZMI', 'ЗНАЕШЬ ЛИ ТЫ', 'DID YOU KNOW'),
      text: L(
        "Ma'lumotlar bazalarida maxraj hisobdan OLDIN tekshiriladi: aks holda butun so'rov to'xtaydi, bitta qator emas.",
        'В базах данных знаменатель проверяют ДО вычисления: иначе падает весь запрос, а не одна строка.',
        'In databases the denominator is checked BEFORE computing: otherwise the whole query fails, not one row.',
      ),
    },
  },
}


// ============================================================
const S8 = {
  eyebrow: L('QOIDA', 'ПРАВИЛО', 'THE RULE'),
  title: L(
    "Ruhsat etilgan qiymatlar qoidasi",
    'Правило допустимых значений',
    'The rule of admissible values',
  ),
  audio: [
    A('mount',
      "Formulirovka uchun kerak bo'lgan hamma narsani siz allaqachon qildingiz. Endi uni o'zingiz yig'ing va bo'laklarni tartib bilan qo'ying.",
      'Всё, что нужно для формулировки, уже сделано твоими руками. Теперь собери её сам и складывай фрагменты по порядку.',
      'Everything the wording needs is already done by your hands. Now assemble it yourself and put the fragments in order.'),
    W('card',
      "Qoida yig'ildi va darslik matni ochildi. Pastda esa birinchi ekrandagi ikki mashina qaytdi.",
      'Правило собрано, и открылся текст учебника. А внизу вернулись две машины с первого экрана.',
      'The rule is assembled and the textbook wording opened. Below, the two machines from the first screen are back.'),
  ],
  props: {
    // ЧЕТЫРЕ коротких куска вместо шести длинных: шесть строк текста ученик
    // читает как абзац, а не собирает. Лишний неверный оставлен один — его
    // хватает, чтобы выбор был настоящим (методист, 2026-08-17).
    fragments: [
      { id: 'f1', label: L('Maxrajni', 'Знаменатель', 'The denominator') },
      { id: 'f2', label: L('nolga tenglaymiz', 'приравниваем к нулю', 'is set to zero') },
      { id: 'f3', label: L('va shu sonni', 'и это число', 'and that number') },
      { id: 'f4', label: L('taqiqlaymiz', 'запрещаем', 'is forbidden') },
      { id: 'w1', label: L('Suratni', 'Числитель', 'The numerator') },
    ],
    answer: ['f1', 'f2', 'f3', 'f4'],
    wrongHint: L(
      "Bunday yig'ilmadi. Darsda taqiq HAR SAFAR bir joydan keldi: chiziq ostidan, va aynan nolda.",
      'Так не складывается. В уроке запрет КАЖДЫЙ раз приходил из одного места: из-под черты, и именно при нуле.',
      'That does not fit. In the lesson the restriction came from one place every time: from below the bar, and exactly at zero.',
    ),
    card: {
      title: L('QOIDA', 'ПРАВИЛО', 'RULE'),
      lines: [
        L(
          "Kasr ifoda — ratsional kasr: A va B ko'phadlar, B nolga teng emas",
          'Дробное выражение — рациональная дробь: A и B многочлены, B не равно нулю',
          'A fractional expression is a rational fraction: A and B polynomials, B not zero',
        ),
        STATEMENTS[0],
        STATEMENTS[1],
        STATEMENTS[2],
      ],
      // METODIST: parag'raf raqami va BET shu yerga yoziladi (§20 p. 12).
      // Darslik skanerlangan PDF, matn chiqarib bo'lmadi — DARS01_SKELET.md §8.
        locked: L(
        "Qoida to'g'ri yig'ilgandan keyin ochiladi",
        'Правило откроется после верной сборки',
        'The rule opens once assembled correctly',
      ),
    },
    // XUKKA QAYTISH: plotter o'chadi, jadval yashil bo'ladi.
  },
}

// ============================================================
// EKRAN 9. MASHQ 1: ZANJIR. To'rt qisqa yozuv, har birining ruhsat etilgan qiymatlar sohasi si.
// «Taqiqlangan qiymat yo'q» tugmasi HAMMA topshiriqda turadi.
// ============================================================
// EKRAN 9. MASHQ: BESHTA MISOL YENGILDAN OG'IRGA. Har biridan keyin YECHIM
// ochiladi — 3-sinf 5-darsidagidek. Yechim HAR DOIM ko'rsatiladi, faqat
// xatoda emas: to'g'ri javob bergan o'quvchi ham yozuv namunasini ko'rishi
// kerak. Usul lentasi olib tashlandi: u yechim ko'rsatadigan narsani
// takrorlardi (metodist, 2026-08-17).
// ============================================================
const S9 = {
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L(
    "Maxrajning nolini toping",
    'Найди нуль знаменателя',
    'Find the zero of the denominator',
  ),
  audio: [
    A('mount',
      "Beshta yozuv. Har biridan keyin yechim ochiladi. Unda qanday yozish kerakligini ko'rasiz.",
      'Пять записей. После каждой откроется решение, увидишь, как это записывают.',
      'Five records. After each one the solution opens and you see how it is written.'),
    A('why',
      "Nol bo'luvchi bo'la olmaydi. Hech qanday son nolga ko'paytirilganda boshqa sonni bermaydi. Shuning uchun maxrajdagi nol qiymatni yo'q qiladi.",
      'Нуль не может быть делителем. Ни одно число при умножении на нуль не даёт другого числа. Поэтому нуль в знаменателе убирает значение.',
      'Zero cannot be a divisor. No number multiplied by zero gives another number. That is why zero in the denominator removes the value.'),
  ],
  props: {
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Beshtasi ham yechildi. Har safar bitta yo'l: maxrajni nolga tenglash.",
      'Все пять разобраны. Каждый раз один путь: приравнять знаменатель к нулю.',
      'All five are done. Every time the same path: set the denominator to zero.',
    ),
    tasks: [
      {
        expr: '5 : a',
        question: L('Taqiq qayerda?', 'Где запрет?', 'Where is the restriction?'),
        items: [
          { id: 'a', right: true, label: 'a ≠ 0' },
          { id: 'b', label: 'a ≠ 5', hint: L('Beshlik yuqorida turibdi, u maxrajga kirmaydi.', 'Пятёрка стоит сверху, в знаменатель она не входит.', 'The five is above; it is not in the denominator.') },
          { id: 'c', label: L("Taqiq yo'q", 'Запрета нет', 'No restriction'), hint: L('Maxrajda harf bor, demak taqiq ham bor.', 'В знаменателе есть буква, значит запрет есть.', 'There is a letter in the denominator, so there is a restriction.') },
        ],
        solution: ['a = 0', 'a ≠ 0'],
      },
      {
        expr: '9 : (a − 2)',
        question: L('Taqiq qayerda?', 'Где запрет?', 'Where is the restriction?'),
        items: [
          { id: 'a', right: true, label: 'a ≠ 2' },
          { id: 'b', label: 'a ≠ 0', hint: L('Nolda a − 2 minus ikkiga teng, bu nol emas.', 'При нуле a − 2 равно минус двум, а это не нуль.', 'At zero a − 2 equals minus two, not zero.') },
          { id: 'c', label: 'a ≠ 9', hint: L("To'qqiz yuqorida, maxrajga ta'sir qilmaydi.", 'Девятка сверху, на знаменатель не влияет.', 'The nine is above and does not affect the denominator.') },
        ],
        solution: ['a − 2 = 0', 'a = 2', 'a ≠ 2'],
      },
      {
        expr: '(a + 1) : 3a',
        question: L('Taqiq qayerda?', 'Где запрет?', 'Where is the restriction?'),
        items: [
          { id: 'a', right: true, label: 'a ≠ 0' },
          { id: 'b', label: 'a ≠ 3', hint: L('Uchlikda 3a to\'qqizga teng, nolga emas.', 'При тройке 3a равно девяти, а не нулю.', 'At three, 3a equals nine, not zero.') },
          { id: 'c', label: 'a ≠ −1', hint: L('Minus birda surat nolga aylanadi, maxraj emas.', 'При минус единице нулём становится числитель, а не знаменатель.', 'At minus one the numerator becomes zero, not the denominator.') },
        ],
        solution: ['3a = 0', 'a = 0', 'a ≠ 0'],
      },
      {
        expr: '7 : (2a − 6)',
        question: L('Taqiq qayerda?', 'Где запрет?', 'Where is the restriction?'),
        items: [
          { id: 'a', right: true, label: 'a ≠ 3' },
          { id: 'b', label: 'a ≠ 6', hint: L('Oltida 2a − 6 oltiga teng, nolga emas.', 'При шестёрке 2a − 6 равно шести, а не нулю.', 'At six, 2a − 6 equals six, not zero.') },
          { id: 'c', label: 'a ≠ 2', hint: L('Ikkida 2a − 6 minus ikkiga teng.', 'При двойке 2a − 6 равно минус двум.', 'At two, 2a − 6 equals minus two.') },
        ],
        solution: ['2a − 6 = 0', '2a = 6', 'a = 3', 'a ≠ 3'],
      },
      {
        expr: '4 : (a · a)',
        question: L('Taqiq qayerda?', 'Где запрет?', 'Where is the restriction?'),
        items: [
          { id: 'a', right: true, label: 'a ≠ 0' },
          { id: 'b', label: 'a ≠ 2', hint: L("Ikkida a · a to'rtga teng, nolga emas.", 'При двойке a · a равно четырём, а не нулю.', 'At two, a · a equals four, not zero.') },
          { id: 'c', label: L('a ≠ 0 va a ≠ 4', 'a ≠ 0 и a ≠ 4', 'a ≠ 0 and a ≠ 4'), hint: L("To'rtlikda a · a o'n oltiga teng.", 'При четвёрке a · a равно шестнадцати.', 'At four, a · a equals sixteen.') },
        ],
        solution: ['a · a = 0', 'a = 0', 'a ≠ 0'],
      },
    ],
  },
}

// ============================================================
// EKRAN 10. IKKI SHART BIRDANIGA. Namuna metodistdan: ildizli misolda ruhsat etilgan qiymatlar sohasi
// SHARTLAR TIZIMI sifatida yoziladi va oraliqlar birlashtiriladi.
//
// Ildizlar 2-blokda (9-14 darslar) o'rganiladi, shuning uchun bu yerda
// ularsiz: usul o'sha — bir nechta shart, har biri alohida, keyin hammasi
// birga. O'quvchi shartlarni birma-bir yozadi.
// ============================================================
// EKRAN 10. IKKI SHART BIRDANIGA. Uchta qadam: har bir ko'paytuvchi alohida,
// keyin ikkalasi birga. Javoblar TAYYOR — o'quvchi tanlaydi, va har qadamdan
// keyin yechim ochiladi (9-ekrandagidek).
//
// ruhsat etilgan qiymatlar sohasi satri olib tashlandi: u bo'sh polosa bo'lib turardi va hech narsa
// ko'rsatmasdi (metodist, 2026-08-17).
//
// Javob ORALIQLAR bilan berilmaydi: sonli oraliqlar 27-darsda, bu yerda
// ular hali o'tilmagan.
// ============================================================
const S10 = {
  eyebrow: L('IKKI SHART', 'ДВА УСЛОВИЯ', 'TWO CONDITIONS'),
  title: L(
    "Maxrajdagi ko'paytma, ikkita nol",
    'Произведение в знаменателе, два нуля',
    'A product in the denominator, two zeros',
  ),
  audio: [
    A('mount',
      "Maxraj ikkita ko'paytuvchidan iborat. Har biri alohida nolga aylanishi mumkin.",
      'Знаменатель из двух множителей. Каждый может обратиться в нуль отдельно.',
      'The denominator has two factors. Each can become zero on its own.'),
    A('why',
      "Ko'paytma nolga aylanishi uchun bitta ko'paytuvchining nol bo'lishi yetarli. Shuning uchun bu yerda taqiq bitta emas, ikkita.",
      'Чтобы произведение стало нулём, достаточно одного нулевого множителя. Поэтому запретов здесь не один, а два.',
      'For a product to become zero, one zero factor is enough. That is why there are two restrictions here, not one.'),
  ],
  props: {
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Ikki ko'paytuvchi — ikki shart. Ular BIRGA ruhsat etilgan qiymatlar sohasini beradi.",
      'Два множителя — два условия. Вместе они и дают ОДЗ.',
      'Two factors mean two conditions. Together they give the domain.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{F('x + 1', '(x − 2)(x + 5)')}</Row>,
        question: L(
          "Birinchi ko'paytuvchi qaysi x da nolga aylanadi?",
          'При каком x обращается в нуль первый множитель?',
          'At which x does the first factor become zero?',
        ),
        items: [
          { id: 'a', right: true, label: 'x = 2' },
          { id: 'b', label: 'x = −2', hint: L("Minus ikkida x − 2 minus to'rtga teng.", 'При минус двух x − 2 равно минус четырём.', 'At minus two, x − 2 equals minus four.') },
          { id: 'c', label: 'x = 5', hint: L('Beshda x − 2 uchga teng.', 'При пяти x − 2 равно трём.', 'At five, x − 2 equals three.') },
        ],
        solution: ['x − 2 = 0', 'x = 2'],
      },
      {
        expr: <Row size="big" align="center">{F('x + 1', '(x − 2)(x + 5)')}</Row>,
        question: L(
          "Ikkinchi ko'paytuvchi qaysi x da nolga aylanadi?",
          'При каком x обращается в нуль второй множитель?',
          'At which x does the second factor become zero?',
        ),
        items: [
          { id: 'a', right: true, label: 'x = −5' },
          { id: 'b', label: 'x = 5', hint: L("Beshda x + 5 o'nga teng, nolga emas.", 'При пяти x + 5 равно десяти, а не нулю.', 'At five, x + 5 equals ten, not zero.') },
          { id: 'c', label: 'x = −1', hint: L('Minus birda nolga SURAT aylanadi, maxraj emas.', 'При минус единице нулём становится числитель, а не знаменатель.', 'At minus one the numerator becomes zero, not the denominator.') },
        ],
        solution: ['x + 5 = 0', 'x = −5'],
      },
      {
        expr: <Row size="big" align="center">{F('x + 1', '(x − 2)(x + 5)')}</Row>,
        question: L(
          "Butun ruhsat etilgan qiymatlar sohasi qanday yoziladi?",
          'Как записывается вся ОДЗ?',
          'How is the whole domain written?',
        ),
        items: [
          { id: 'a', right: true, label: 'x ≠ 2,  x ≠ −5' },
          { id: 'b', label: 'x ≠ 2', hint: L("Bitta shart yetmaydi: minus beshda maxraj yana nolga aylanadi.", 'Одного условия мало: при минус пяти знаменатель снова обращается в нуль.', 'One condition is not enough: at minus five the denominator becomes zero again.') },
          { id: 'c', label: 'x ≠ 2,  x ≠ 5,  x ≠ −1', hint: L("Beshda va minus birda maxraj nolga aylanmaydi — ortiqcha shartlar.", 'При пяти и минус единице знаменатель в нуль не обращается — лишние условия.', 'At five and minus one the denominator is not zero: extra conditions.') },
        ],
        solution: ['(x − 2)(x + 5) = 0', 'x = 2   yoki   x = −5', 'x ≠ 2,  x ≠ −5'],
      },
    ],
  },
}


// ============================================================
// EKRAN 11. O'ZI. Uchta misol, endi yordamsiz: har birida javob tanlanadi,
// keyin yechim ochiladi. Murakkabligi 9-ekrandan yuqori — bu yerda maxraj
// ko'paytuvchilarga ajraladi va kvadrat uchraydi.
// ============================================================
const S11 = {
  eyebrow: L('MUSTAQIL', 'САМ', 'ON YOUR OWN'),
  title: L(
    "Ruhsat etilgan qiymatlar, yordamsiz",
    'Допустимые значения без подсказки',
    'Admissible values, no hints',
  ),
  audio: [
    A('mount',
      "Uchta yozuv. Yordam yo'q, lekin har qadamdan keyin yechim ochiladi.",
      'Три записи. Помощи нет, но после каждого ответа откроется решение.',
      'Three records. No help, but after each answer the solution opens.'),
    A('why',
      "Tartib doim bir xil. Avval maxrajga qaraysiz, keyin uni nolga aylantiradigan sonni topasiz, oxirida shu sonni taqiqlaysiz.",
      'Порядок всегда один. Сначала смотришь на знаменатель, потом ищешь число, обращающее его в нуль, и в конце запрещаешь это число.',
      'The order is always the same. First look at the denominator, then find the number that turns it into zero, and finally forbid that number.'),
  ],
  props: {
    solutionLabel: L('YECHIM', 'РЕШЕНИЕ', 'SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Uchtasi ham yechildi. Yo'l bitta: maxrajni nolga tenglash.",
      'Все три разобраны. Путь один: приравнять знаменатель к нулю.',
      'All three are done. One path: set the denominator to zero.',
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{F('8', 'x(x − 3)')}</Row>,
        question: L('Taqiq qayerda?', 'Где запрет?', 'Where is the restriction?'),
        items: [
          { id: 'a', right: true, label: 'x ≠ 0,  x ≠ 3' },
          { id: 'b', label: 'x ≠ 3', hint: L('Nolda x ning o\'zi nolga aylanadi.', 'При нуле сам x обращается в нуль.', 'At zero, x itself becomes zero.') },
          { id: 'c', label: 'x ≠ 8', hint: L('Sakkiz yuqorida, maxrajga kirmaydi.', 'Восьмёрка сверху, в знаменатель не входит.', 'The eight is above, not in the denominator.') },
        ],
        solution: ['x(x − 3) = 0', 'x = 0   yoki   x = 3', 'x ≠ 0,  x ≠ 3'],
      },
      {
        expr: <Row size="big" align="center">{F('x + 2', '(x − 1)(x − 1)')}</Row>,
        question: L('Taqiq qayerda?', 'Где запрет?', 'Where is the restriction?'),
        items: [
          { id: 'a', right: true, label: 'x ≠ 1' },
          { id: 'b', label: 'x ≠ 1,  x ≠ −1', hint: L('Ikkala ko\'paytuvchi bir xil, shuning uchun shart bitta.', 'Оба множителя одинаковые, поэтому условие одно.', 'Both factors are the same, so there is one condition.') },
          { id: 'c', label: 'x ≠ −2', hint: L('Minus ikkida SURAT nolga aylanadi, maxraj emas.', 'При минус двух в нуль обращается числитель, а не знаменатель.', 'At minus two the numerator becomes zero, not the denominator.') },
        ],
        solution: ['(x − 1)(x − 1) = 0', 'x = 1', 'x ≠ 1'],
      },
      {
        expr: <Row size="big" align="center">{F('5', 'x · x + 4')}</Row>,
        question: L('Taqiq qayerda?', 'Где запрет?', 'Where is the restriction?'),
        items: [
          { id: 'a', right: true, label: L("Taqiq yo'q", 'Запрета нет', 'No restriction') },
          { id: 'b', label: 'x ≠ 0', hint: L("Nolda x · x + 4 to'rtga teng, nolga emas.", 'При нуле x · x + 4 равно четырём, а не нулю.', 'At zero, x · x + 4 equals four, not zero.') },
          { id: 'c', label: 'x ≠ −4', hint: L("Minus to'rtda x · x + 4 yigirmaga teng.", 'При минус четырёх x · x + 4 равно двадцати.', 'At minus four, x · x + 4 equals twenty.') },
        ],
        solution: [
          'x · x + 4 = 0',
          L('x · x = −4 — bunday x yo\'q', 'x · x = −4 — такого x нет', 'x · x = −4 has no solution'),
          L("Taqiq yo'q", 'Запрета нет', 'No restriction'),
        ],
      },
    ],
  },
}

// ============================================================
// EKRAN 12. TUZOQ. Boshqa birovning yechimi berilgan, unda BITTA qator
// noto'g'ri. O'quvchi qaysi qator ekanini tanlaydi, keyin to'g'ri yechim
// ochiladi. Har bir qadam to'g'ri KO'RINADI — shuning uchun tuzoq.
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
      "Azizning yechimi. Unda bitta qator noto'g'ri, qolganlari to'g'ri.",
      'Решение Азиза. В нём одна строка неверна, остальные верны.',
      "Aziz's solution. One line in it is wrong, the rest are correct."),
    A('why',
      "Qisqartirish taqiqni bekor qilmaydi. Taqiq dastlabki yozuvdan olinadi, chunki qiymat aynan o'sha yerda yo'qoladi.",
      'Сокращение не отменяет запрет. Запрет берут из исходной записи, потому что значение теряется именно там.',
      'Cancelling does not remove the restriction. It is taken from the original record, because the value is lost exactly there.'),
  ],
  props: {
    solutionLabel: L('TO\'G\'RI YECHIM', 'ВЕРНОЕ РЕШЕНИЕ', 'CORRECT SOLUTION'),
    nextLabel: L('Keyingisi', 'Дальше', 'Next'),
    doneNote: L(
      "Xatoni topish — imtihonda kerak bo'ladigan ko'nikma.",
      'Находить чужую ошибку — навык, который нужен на контрольной.',
      "Finding someone else's mistake is a skill you need on a test.",
    ),
    tasks: [
      {
        expr: <Row size="big" align="center">{F('3', '2x − 8')}</Row>,
        question: L(
          "Aziz yozdi: 2x − 8 = 0 → 2x = 8 → x = 16 → x ≠ 16. Qaysi qator noto'g'ri?",
          'Азиз написал: 2x − 8 = 0 → 2x = 8 → x = 16 → x ≠ 16. Какая строка неверна?',
          'Aziz wrote: 2x − 8 = 0 → 2x = 8 → x = 16 → x ≠ 16. Which line is wrong?',
        ),
        items: [
          { id: 'a', right: true, label: L('Uchinchi: x = 16', 'Третья: x = 16', 'Third: x = 16') },
          { id: 'b', label: L('Birinchi: 2x − 8 = 0', 'Первая: 2x − 8 = 0', 'First: 2x − 8 = 0'), hint: L('Birinchi qator to\'g\'ri: maxraj nolga tenglanadi.', 'Первая строка верна: знаменатель приравнивают к нулю.', 'The first line is correct: the denominator is set to zero.') },
          { id: 'c', label: L('Ikkinchi: 2x = 8', 'Вторая: 2x = 8', 'Second: 2x = 8'), hint: L('Ikkinchi ham to\'g\'ri: sakkiz o\'ng tomonga o\'tdi.', 'Вторая тоже верна: восьмёрка перешла вправо.', 'The second is correct too: the eight moved to the right.') },
        ],
        solution: ['2x − 8 = 0', '2x = 8', 'x = 4', 'x ≠ 4'],
      },
      {
        expr: <Row size="big" align="center">{F('x', 'x − 6')}</Row>,
        question: L(
          "Dilnoza yozdi: taqiq x ≠ 0, chunki suratda x turibdi. To'g'rimi?",
          'Дилноза написала: запрет x ≠ 0, потому что в числителе стоит x. Верно?',
          'Dilnoza wrote: the restriction is x ≠ 0 because x is in the numerator. Correct?',
        ),
        items: [
          { id: 'a', right: true, label: L("Yo'q, taqiq x ≠ 6", 'Нет, запрет x ≠ 6', 'No, the restriction is x ≠ 6') },
          { id: 'b', label: L('Ha, to\'g\'ri', 'Да, верно', 'Yes, correct'), hint: L('Suratdagi nol qiymatni nol qiladi, taqiq bermaydi.', 'Нуль в числителе делает значение нулём, а не запретом.', 'A zero in the numerator makes the value zero, not a restriction.') },
          { id: 'c', label: L('Ikkalasi ham: x ≠ 0 va x ≠ 6', 'Оба: x ≠ 0 и x ≠ 6', 'Both: x ≠ 0 and x ≠ 6'), hint: L('Nolda qiymat bor va u nolga teng: nol bo\'lingan olti.', 'При нуле значение есть и равно нулю: нуль делить на минус шесть.', 'At zero the value exists and equals zero: zero divided by minus six.') },
        ],
        solution: ['x − 6 = 0', 'x = 6', 'x ≠ 6'],
      },
    ],
  },
}

// ============================================================
// EKRAN 13. YOZUVNI KATAKMA-KATAK TO'LDIRING. Naqsh 3-sinf... yo'q: 5-sinf
// 3-darsidan («ustunga ajratish»): bo'sh kataklar BITTADAN yopiladi, joriy
// katak aksent bilan chizilgan, to'ldirilganlari qoladi, pastda «Qaytarish».
//
// O'quvchi bitta javobni tanlamaydi — u BUTUN yozuvni qadam-baqadam
// o'tadi va nimadan tashkil topganini ko'radi.
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
      "Yechim yozilgan, lekin kataklar bo'sh. Ularni birma-bir to'ldiring.",
      'Решение записано, но клетки пустые. Заполняй их по одной.',
      'The solution is written but the cells are empty. Fill them one by one.'),
    A('why',
      "Yechim uch qadamdan iborat. Maxrajni nolga tenglaysiz, tenglamani yechasiz va topilgan sonni taqiqlaysiz.",
      'Решение состоит из трёх шагов. Приравниваешь знаменатель к нулю, решаешь уравнение и запрещаешь найденное число.',
      'The solution has three steps. Set the denominator to zero, solve the equation, and forbid the number you found.'),
  ],
  props: {
    repeatLabel: L('Qaytarish', 'Повторить', 'Repeat'),
    doneNote: L(
      "Yozuv to'ldi. Uchta qadam: maxrajni nolga tenglash, yechish, taqiqni yozish.",
      'Запись заполнена. Три шага: приравнять знаменатель к нулю, решить, записать запрет.',
      'The record is filled. Three steps: set the denominator to zero, solve, write the restriction.',
    ),
    showLabel: L(
      "Qarang — misolda ko'rsataman",
      'Смотри — покажу на примере',
      'Watch: I will show you on an example',
    ),
    againLabel: L('Yana bir bor', 'Ещё раз', 'Again'),
    selfLabel: L("Endi o'zim", 'Теперь я сам', 'Now myself'),
    // ПОКАЗ идёт на СВОЁЙ записи, самостоятельная работа — на другой.
    // Иначе ученик повторяет по памяти, а не по способу.
    demo: {
      chips: ['2', '0', '≠', '=', '8'],
      lines: [
        [{ t: '4x − 8 ' }, { slot: '=' }, { t: ' ' }, { slot: '0' }],
        [{ t: '4x = ' }, { slot: '8' }],
        [{ t: 'x = ' }, { slot: '2' }],
        [{ t: 'x ' }, { slot: '≠' }, { t: ' ' }, { slot: '2' }],
      ],
    },
    tasks: [
      {
        chips: ['3', '0', '≠', '=', '9'],
        lines: [
          [{ t: '3x − 9 ' }, { slot: '=' }, { t: ' ' }, { slot: '0' }],
          [{ t: '3x = ' }, { slot: '9' }],
          [{ t: 'x = ' }, { slot: '3' }],
          [{ t: 'x ' }, { slot: '≠' }, { t: ' ' }, { slot: '3' }],
        ],
      },
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
        chips: ['4', '0', '≠', '=', '7'],
        lines: [
          [{ t: '(x − 4)(x − 7) ' }, { slot: '=' }, { t: ' ' }, { slot: '0' }],
          [{ t: 'x = ' }, { slot: '4' }],
          [{ t: 'x = ' }, { slot: '7' }],
          [{ t: 'x ' }, { slot: '≠' }, { t: ' 4,  x ≠ ' }, { slot: '7' }],
        ],
      },
    ],
  },
}


// ============================================================
const S14 = {
  eyebrow: L('BLITS', 'БЛИЦ', 'BLITZ'),
  title: L(
    "Blits, qoidani mustahkamlaymiz",
    'Блиц, закрепляем правило',
    'Blitz, reinforcing the rule',
  ),
  audio: [
    A('mount',
      "Savollar birin ketin chiqadi. Ular yozuvni emas, belgini so'raydi, ya'ni nimaga qarab ajratasiz.",
      'Вопросы выходят один за другим. Они спрашивают не запись, а признак, то есть по чему ты различаешь.',
      'Questions come one after another. They ask not for a record but for the sign, that is what you tell things apart by.'),
    A('why',
      "Hisob birinchi urinish bo'yicha yuradi. Birinchi urinishlardan takrorlash kerak bo'lgan narsa yig'iladi.",
      'Счёт идёт по первой попытке. Из остального соберётся то, что стоит повторить.',
      'The count goes by the first attempt. The rest shows what is worth another pass.'),
  ],
  props: {
    items: [
      {
        id: 'q1',
        tag: 'З2',
        ask: L(
          "Yozuvning qaysi qismi bo'yicha ruhsat etilgan qiymatlar sohasi topiladi?",
          'По какой части записи находят ОДЗ?',
          'Which part of the record gives the domain?',
        ),
        options: [
          { id: 'num', label: L('surat', 'числитель', 'the numerator') },
          { id: 'den', right: true, label: L('maxraj', 'знаменатель', 'the denominator') },
        ],
        hint: L(
          "Qiymat bo'lmasligi bo'lish mumkin bo'lmaganda yuz beradi. Bo'linadigan narsa chiziq ostida turadi.",
          'Значения нет тогда, когда делить нельзя. Делят на то, что стоит под чертой.',
          'A value is missing when division is impossible. You divide by what is under the bar.',
        ),
      },
      {
        id: 'q2',
        tag: 'З19',
        ask: L(
          "2x + 6 ni 3 ga bo'lish — butun ifodami yoki kasrmi?",
          'Выражение 2x + 6, делённое на 3 — целое или дробное?',
          'The expression 2x + 6 divided by 3 — integral or fractional?',
        ),
        options: [
          { id: 'int', right: true, label: L('butun', 'целое', 'integral') },
          { id: 'frac', label: L('kasr', 'дробное', 'fractional') },
        ],
        hint: L(
          "Uchga, ya'ni songa bo'linadi. Istalgan x ni qo'ying: qiymat doim bor.",
          'Делят на три, то есть на число. Подставь любой x: значение есть всегда.',
          'You divide by three, that is by a number. Put any x: the value always exists.',
        ),
      },
      {
        id: 'q3',
        tag: 'З18',
        ask: L(
          "Nolni x − 1 ga bo'lish, x = 5 da. Qiymat bormi?",
          'Нуль, делённый на x − 1, при x = 5. Значение есть?',
          'Zero divided by x − 1 at x = 5. Is there a value?',
        ),
        options: [
          { id: 'yes', right: true, label: L('bor, u nolga teng', 'есть, оно равно нулю', 'yes, it equals zero') },
          { id: 'no', label: L("yo'q", 'нет значения', 'no value') },
        ],
        hint: L(
          "Yuqoridagi nol — mumkin: yuqorida nol, pastda to'rt. Mumkin bo'lmagani — nol pastda turgani.",
          'Нуль сверху — можно: сверху нуль, снизу четыре. Нельзя, когда нуль снизу.',
          'Zero above is fine: zero above, four below. What is impossible is zero below.',
        ),
      },
      {
        id: 'q4',
        tag: 'З16',
        ask: L(
          'ruhsat etilgan qiymatlar sohasi yozildi. Ishni tugallangan qiladigan narsa nima?',
          'ОДЗ записана. Что делает работу законченной?',
          'The domain is written. What makes the work complete?',
        ),
        options: [
          {
            id: 'sub',
            right: true,
            label: L(
              "son qo'yib hisoblash",
              'подставить число и посчитать',
              'substitute a number and compute',
            ),
          },
          {
            id: 'copy',
            label: L(
              "javobni chiroyliroq ko'chirish",
              'переписать ответ аккуратнее',
              'rewrite the answer more neatly',
            ),
          },
        ],
        hint: L(
          "Tekshirilmagan javob — so'zga ishonish. Sonni qo'ying va o'zingiz ko'ring.",
          'Ответ без проверки — это ответ на слово. Подставь число и посмотри сам.',
          'An unchecked answer is an answer on trust. Put a number in and see for yourself.',
        ),
      },
      {
        id: 'q5',
        tag: 'З2',
        ask: L(
          "Hisobni bo'lib to'lash",
          'Счёт делят на всех',
          'Splitting the bill',
        ),
        builtLabel: L("yig'ildi", 'собрано', 'assembled'),
        build: {
          lead: L(
            "Kafeda hisob 60000 so'm, uni n kishi teng bo'lishadi. Uchib yurgan plitkalardan yozuvni yig'ing.",
            'В кафе счёт 60000 сум, его делят поровну на n человек. Собери запись из летящих плиток.',
            'A cafe bill of 60000 is split evenly among n people. Assemble the record from the drifting tiles.',
          ),
          lines: [
            [{ t: 'Har biriga:   ' }, { slot: '60000' }, { t: ' : ' }, { slot: 'n' }],
            [{ t: 'Shart:   n ' }, { slot: '≠' }, { t: ' ' }, { slot: '0' }],
          ],
          tiles: [
            { id: 't1', v: '60000', x: 8, y: 16 },
            { id: 't2', v: 'n', x: 62, y: 12 },
            { id: 't3', v: '≠', x: 34, y: 58 },
            { id: 't4', v: '0', x: 78, y: 62 },
            { id: 't5', v: '+', x: 20, y: 66 },
            { id: 't6', v: '=', x: 50, y: 24 },
          ],
          hint: L(
            "Bitta kishiga tegadigan pul hisobni odam soniga bo'lgandan chiqadi, qo'shgandan emas.",
            'Доля одного получается делением счёта на число людей, а не сложением.',
            'One share comes from dividing the bill by the number of people, not from adding.',
          ),
          doneNote: L(
            "Yig'ildi. Odam soni nolga aylanmaydi, shuning uchun shart yozuv bilan birga yuradi.",
            'Собрано. Людей не бывает ноль, поэтому условие идёт вместе с записью.',
            'Assembled. There is never zero people, so the condition travels with the record.',
          ),
        },
      },
    ],
  },
}

// ============================================================
// EKRAN 15. YAKUN. Yangi matematika va yangi kiritish YO'Q. Foiz YO'Q:
// bo'shliq SO'Z bilan aytiladi. Taxmin natija bilan YONMA-YON turadi.
// Oxirgi izohda FAKT: matematika va fan bir kartochkada (1-3-sinf usuli).
// ============================================================
const S15 = {
  eyebrow: L('YAKUN', 'ИТОГ', 'SUMMARY'),
  title: L(
    "Xulosa, yozuv va uning taqig'i",
    'Вывод, запись и её запрет',
    'Conclusion, the record and its restriction',
  ),
  audio: [
    A('s0',
      "Darsdan bitta yozuv qoladi, iks ikkiga teng emas. U kasr bilan birga yuradi.",
      'С урока остаётся одна запись, икс не равен двум. Она идёт вместе с дробью.',
      'One record stays with you, x is not equal to two. It travels with the fraction.'),
    A('s1',
      "Bugun siz uch qadamni o'rgandingiz. Chiziq ostiga qarash, nolga aylantiruvchi sonni topish va shartni yozish.",
      'Сегодня освоены три шага. Посмотреть под черту, найти число, обращающее её в нуль, и записать условие.',
      'Today you learned three steps. Look below the bar, find the number that makes it zero, and write the condition.'),
    A('s2',
      "Keyingi darsda kasrning asosiy xossasi. Surat va maxrajni bir xil narsaga ko'paytiradilar, va soha o'sha bo'lib qolishi shart.",
      'В следующем уроке основное свойство дроби. Числитель и знаменатель умножают на одно и то же, и область обязана остаться той же.',
      'The next lesson covers the main property of a fraction. Numerator and denominator are multiplied by the same thing, and the domain must stay the same.'),
  ],
  props: {
    readyLabel: L('Tayyorlik', 'Готовность', 'Readiness'),
    predictedLabel: L('Taxmin', 'Прогноз', 'Prediction'),
    mark: 'x ≠ 2',
    lines: [
      L("Harf chiziq ostida — ratsional kasr, taqiq ham shu yerda",
        'Буква под чертой — рациональная дробь, там же и запрет',
        'A letter under the bar means a rational fraction, and the restriction is there too'),
      L("Nol maxrajda qiymatni yo'q qiladi", 'Нуль в знаменателе убирает значение', 'Zero in the denominator removes the value'),
      L("Javob songa qo'yib tekshiriladi", 'Ответ проверяют подстановкой числа', 'An answer is checked by substituting a number'),
    ],
    gotLabel: L('Natija', 'Результат', 'Result'),
    proved: L(
      "jadval haq: ikkilikda qiymat yo'q",
      'права таблица: при двойке значения нет',
      'the table is right: no value at two',
    ),
    canLabel: L("Endi nima qila olaman", 'Что теперь умею', 'What I can do now'),
    notesLabel: L('Sizning yozuvlaringiz', 'Твои записи', 'Your notes'),
    cheat: L('Shpargalkani chiqarish', 'Печать шпаргалки', 'Print the cheat sheet'),
    screenRef: L('3-ekran', 'экран 3', 'screen 3'),
    // Uchta satr, to'rtta emas: ekran VERTIKAL (metodist, 2026-08-13).
    can: [
      L("Taqiqni chiziq ostidan topaman", 'Нахожу запрет под чертой', 'I find the restriction below the bar'),
      L("Butun va kasrni farqlayman", 'Различаю целое и дробное', 'I tell integral from fractional'),
      L("Javobni son bilan tekshiraman", 'Проверяю ответ числом', 'I check the answer with a number'),
    ],
    proofNote: L(
      "Fakt. Dasturlash tillarida butun sonni nolga bo'lish dasturni to'xtatadi, kasr sonni bo'lish esa Infinity beradi. Shuning uchun ma'lumot bazalarida maxraj hisobdan OLDIN tekshiriladi — xuddi darsdagidek.",
      'Факт. В языках программирования деление целого на нуль останавливает программу, а деление дробного даёт Infinity. Поэтому в базах данных знаменатель проверяют ДО вычисления — ровно как в этом уроке.',
      'A fact. In programming languages integer division by zero halts the program while float division yields Infinity. That is why databases check the denominator BEFORE computing, exactly as in this lesson.',
    ),
  },
}

// ============================================================
// СЦЕНА ФИНАЛА (§6). Пропорция 400 на 92 держится в SceneBand.
// Сцена ОТВЕЧАЕТ на вопрос хука: там две машины спорили, здесь на том же
// графике стоит выколотая точка и написано условие. Объект тот же, изменилось
// ровно то, что объяснил урок. Математическая сцена, без персонажей.
// ============================================================

// Сцена финала больше не ставится: на итоге стоит сцена первого экрана.
// Оставлена до решения методиста, чем заканчивать урок.
// eslint-disable-next-line no-unused-vars
const FinalScene = (
  <SceneBand kind="final" label={L(
    "Ikkilikda kasr chizig'i uziladi",
    'При двойке черта дроби разрывается',
    'At two the fraction bar tears',
  )}>
    {/* Та же дробь, что на хуке: там она сломалась, здесь названо, при каком
        числе. Сцена финала обязана отвечать на вопрос сцены хука (§6). */}
    <text x="126" y="34" textAnchor="middle" fontFamily={MATH_FONT} fontSize="19" fill={T.ink}>x · x − 4</text>
    <line x1="72" y1="44" x2="180" y2="44" stroke={T.ink} strokeWidth="2.4"/>
    <text x="126" y="68" textAnchor="middle" fontFamily={MATH_FONT} fontSize="19" fill={T.ink}>x − 2</text>

    <text x="216" y="52" textAnchor="middle" fontFamily={MATH_FONT} fontSize="17" fill={T.ink3}>→</text>

    {/* Запрет: знаменатель в нуле, черта разорвана. */}
    <text x="300" y="34" textAnchor="middle" fontFamily={MATH_FONT} fontSize="19" fill={T.ink2}>0</text>
    <line x1="258" y1="44" x2="290" y2="44" stroke={T.tip} strokeWidth="2.6"/>
    <line x1="310" y1="44" x2="342" y2="44" stroke={T.tip} strokeWidth="2.6"/>
    <text x="300" y="70" textAnchor="middle" fontFamily={MATH_FONT} fontSize="21" fill={T.tip} fontWeight="700">0</text>

    <g className="g8-late">
      <rect x="238" y="76" width="124" height="14" rx="7" fill={T.tipSoft}/>
      <text x="300" y="87" textAnchor="middle" fontFamily={MATH_FONT} fontSize="11" fill={T.tip}>x ≠ 2</text>
    </g>
  </SceneBand>
)

// ============================================================
// EKRANLAR. Rollar va tartib — `screens.jsx` dagi ROLE_ORDER bilan bir xil.
// `scored` maydoni YO'Q (§13.2 invariant 4). `tag` — xato yoki bittadan ko'p
// urinishda natijaga yoziladigan adashish kodi.
//
// `method` — карточка способа НАД заданием (§4), `scene` — сцена урока (§6).
// ============================================================
export const SCREENS = [
  { role: 'hook',     tool: 'pick',      scene: <HookScene/>, ...S1 },
  { role: 'support',  tool: 'pick',      scene: <CodeScene/>, ...S2 },
  { role: 'explain',  tool: 'steppers',  kind: 'dial',     tag: 'З18', ...S3 },
  { role: 'explain',  tool: 'pick',      kind: 'place',    tag: 'З2',  ...S4 },
  { role: 'explain',  tool: 'movechain', kind: 'move',     tag: 'З18', ...S5 },
  { role: 'explain',  tool: 'twoways',   kind: 'ways',     tag: 'З18', ...S6 },
  { role: 'explain',  tool: 'parts',     kind: 'roles',    tag: 'З2',  ...S7 },
  {
    role: 'rule',
    tool: 'rulebuild',
    tag: 'З19',
    // Три собственных отказа ученика с экранов 1, 5 и 7 — над правилом.
    // Правило не даётся сверху, оно выводится из того, что он уже видел.
    scene: (
      <CaseStrip
        lead={L('SIZ OLGAN NATIJALAR', 'ТВОИ РЕЗУЛЬТАТЫ', 'YOUR OWN RESULTS')}
        cases={[
          { rec: '600 : k', at: 'k = 0', calc: '600 : 0', den: '0' },
          { rec: '600 : (k − 4)', at: 'k = 4', calc: '4 − 4 = 0', den: '0' },
          { rec: '7 : (a − 5)', at: 'a = 5', calc: '5 − 5 = 0', den: '0' },
        ]}
      />
    ),
    ...S8,
  },
  { role: 'practice', tool: 'drill',     kind: 'drill',    tag: 'З2',  ...S9 },
  { role: 'practice', tool: 'drill',     kind: 'guided',   tag: 'З18', ...S10 },
  { role: 'practice', tool: 'drill',     kind: 'solo',     tag: 'З16', ...S11 },
  { role: 'practice', tool: 'drill',     kind: 'audit',    tag: 'З16', ...S12 },
  { role: 'transfer', tool: 'fill',      tag: 'З2', ...S13 },
  { role: 'blitz',    tool: 'blitz',     ...S14,
    props: { ...S14.props,
      scoreLabel: L('birinchi urinishdan', 'с первой попытки', 'on the first try'),
      stepLabel: L('Topshiriq', 'Задание', 'Task') } },
  { role: 'summary',  tool: 'takeaway',  scene: <HookScene/>, ...S15 },
]

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
