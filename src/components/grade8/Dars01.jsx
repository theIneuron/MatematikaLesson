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
//      yacheyka-yacheyka to'lishi, ODZ satrining bir taktda miltillashi.
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
    "ODZ ni maxraj beradi: maxrajning nollari taqiqlangan",
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
      "ODZ topilmadi yoki yo'qoldi",
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
// Объявлены ДО экранов: экран 6 берёт M_ODZ, а обращение к const выше по
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


const M_KIND = {
  name: L('1-USUL. BUTUNMI YOKI KASR', 'СПОСОБ 1. ЦЕЛОЕ ИЛИ ДРОБНОЕ', 'METHOD 1. INTEGRAL OR FRACTIONAL'),
  steps: [
    L("Kasr chizig'ini toping.", 'Найди черту дроби.', 'Find the fraction bar.'),
    L("Chiziq ostida harf bormi?", 'Посмотри, есть ли под чертой буква.', 'Check whether a letter is below the bar.'),
    L("Bor — kasr, yo'q — butun.", 'Есть — дробное, нет — целое.', 'If yes it is fractional, if no it is integral.'),
  ],
}

const M_ODZ = {
  name: L('2-USUL. TAQIQNI TOPISH', 'СПОСОБ 2. НАЙТИ ЗАПРЕТ', 'METHOD 2. FIND THE RESTRICTION'),
  steps: [
    L('Maxrajni yozib oling.', 'Выпиши знаменатель.', 'Write out the denominator.'),
    L('Uni nolga tenglang.', 'Приравняй его к нулю.', 'Set it equal to zero.'),
    L('Yeching — bu taqiqlangan sonlar.', 'Реши — это запрещённые числа.', 'Solve: these are the forbidden numbers.'),
    L("Shartni «teng emas» bilan yozing.", 'Запиши условие со знаком «не равно».', 'Write the condition with the not-equal sign.'),
  ],
}

const M_CHECK = {
  name: L('3-USUL. SON BILAN TEKSHIRISH', 'СПОСОБ 3. ПРОВЕРИТЬ ЧИСЛОМ', 'METHOD 3. CHECK WITH A NUMBER'),
  steps: [
    L("Ruxsat etilgan sonni oling.", 'Возьми разрешённое число.', 'Take an allowed number.'),
    L('Ikkala yozuvga qo\'ying.', 'Подставь в обе записи.', 'Substitute it into both records.'),
    L("Qiymatlar ajralsa — yozuvlar teng emas.", 'Значения разошлись — записи не равны.', 'If the values differ, the records are not equal.'),
  ],
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
    'Ilovani tuzatish kerak',
    'Приложение надо починить',
    'The app needs fixing',
  ),
  audio: [
    A('mount',
      "Mashinaga yozuv berilgan. Istalgan sonni bosing, u hisoblab, natijani chiqaradi.",
      'Машине дали запись. Нажми любое число, она посчитает и покажет результат.',
      'The machine was given a record. Tap any number and it will compute and show the result.'),
    A('why',
      "Sonlarni birma-bir sinab ko'ring. Ular orasida bittasi bor, unda mashina to'xtaydi.",
      'Попробуй числа по очереди. Среди них есть одно, на котором машина остановится.',
      'Try the numbers one by one. Among them there is one that stops the machine.'),
  ],
  props: {
    // ХУК = ТОЛЬКО ПРОГНОЗ (§5). Одно действие на экране: ученик отвечает и
    // экран закрывается. Подстановка чисел переехала на экран 3, где ей и
    // место. Раньше на хуке было два действия подряд, и это нарушало
    // правило «один вопрос на экране».
    ask: L(
      "Dilnozada ilova nega yiqildi?",
      'Почему приложение упало у Дилнозы?',
      'Why did the app crash for Dilnoza?',
    ),
    items: [
      {
        id: 'phone',
        show: L('Telefoni buzuq', 'Сломан телефон', 'Her phone is broken'),
        hint: L(
          "Dastur ikkalasida bitta. Buzuq telefon boshqa sonlarda ham yiqilardi.",
          'Программа у обоих одна. Сломанный телефон падал бы и на других числах.',
          'Both have the same program. A broken phone would crash on other numbers too.',
        ),
      },
      {
        id: 'data',
        right: true,
        show: L("Ma'lumotlari boshqa", 'Другие данные', 'Her data is different'),
      },
    ],
    after: L(
      "Ha. Ekranga qarang: miqdor nolga teng. Sababni dars davomida topamiz.",
      'Да. Посмотри на экран: количество равно нулю. Причину найдём по ходу урока.',
      'Yes. Look at the screen: the quantity is zero. We will find the reason during the lesson.',
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
    "Qaysi yozuv har doim ham sanalmaydi",
    'Какая запись считается не всегда',
    'Which record does not always compute',
  ),
  audio: [
    A('mount',
      "To'rtta yozuv. Uchtasi istalgan son bilan ishlaydi, bittasi esa yo'q.",
      'Четыре записи. Три работают с любым числом, а одна нет.',
      'Four records. Three work with any number, one does not.'),
    A('why',
      "Farqni chiziq ostidan qidiring. Nima turibdi u yerda: son yoki harf.",
      'Разницу ищи под чертой. Что там стоит: число или буква.',
      'Look for the difference below the bar. What stands there: a number or a letter.'),
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
    "Narx qanday hisoblanadi",
    'Как считается цена',
    'How the price is computed',
  ),
  audio: [
    A('mount',
      "Ikki ustun: sotuv summasi va tovar miqdori. Ularni o'zingiz buraysiz.",
      'Два столбца: сумма продажи и количество товара. Их ты крутишь сам.',
      'Two columns: the sale total and the quantity. You set them yourself.'),
    A('why',
      "Miqdorni kamaytiring va narx qanday o'zgarishini kuzating. Nolgacha tushiring.",
      'Уменьшай количество и смотри, как меняется цена. Доведи до нуля.',
      'Decrease the quantity and watch the price change. Bring it down to zero.'),
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
    // ДВЕ ЗАДАЧИ, а не «покрути и посмотри». Первая обратная: подобрать
    // количество под заданную цену — это рассуждение о делителях. Вторая
    // открывается после неё.
    goal: {
      value: 150,
      after: L(
        "To'g'ri: olti yuzni yuz ellikka bo'lsak, to'rtta chiqadi.",
        'Верно: шестьсот разделить на сто пятьдесят — получается четыре.',
        'Correct: six hundred divided by one hundred fifty gives four.',
      ),
    },
    ask: L(
      "Narx aynan 150 bo'ladigan miqdorni tanlang",
      'Подбери количество, при котором цена будет ровно 150',
      'Set the quantity so that the price is exactly 150',
    ),
    ask2: L(
      "Endi ilovani yiqiting: miqdorni nolgacha tushiring",
      'Теперь урони приложение: доведи количество до нуля',
      'Now crash the app: bring the quantity down to zero',
    ),
    broke: L(
      "Miqdor nol bo'ldi va ilova yiqildi: summani nolga bo'lib bo'lmaydi.",
      'Количество стало нулём, и приложение упало: сумму нельзя разделить на нуль.',
      'The quantity became zero and the app crashed: the total cannot be divided by zero.',
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
  eyebrow: L('JOY HAL QILADI', 'МЕСТО РЕШАЕТ', 'THE PLACE DECIDES'),
  title: L(
    "Bir xil belgilar, ikki xil yozuv",
    'Одни и те же знаки — записи разные',
    'The same symbols, different records',
  ),
  audio: [
    A('mount',
      "Ikki yozuv. Ikkalasida ham yetti va a bor, faqat tartib boshqa.",
      'Две записи. В обеих есть семёрка и a, разный только порядок.',
      'Two records. Both have a seven and an a, only the order differs.'),
    A('why',
      "Qaysi biri biror sonda yiqiladi? Chiziqning ostiga qarang.",
      'Какая из них упадёт на каком-то числе? Смотри, что стоит под чертой.',
      'Which one crashes at some number? Look at what stands below the bar.'),
  ],
  props: {
    ask: L(
      "Qaysi yozuv biror sonda yiqiladi?",
      'Какая запись упадёт на каком-то числе?',
      'Which record crashes at some number?',
    ),
    items: [
      {
        id: 'safe',
        show: 'a : 7',
        hint: L(
          "Bu yerda a ni yettiga bo'lamiz. Yetti hech qachon nolga aylanmaydi, demak yiqilmaydi.",
          'Здесь a делят на семь. Семёрка нулём не станет никогда, значит не упадёт.',
          'Here a is divided by seven. A seven never becomes zero, so it never crashes.',
        ),
      },
      {
        id: 'risky',
        right: true,
        show: '7 : a',
      },
    ],
    after: L(
      "Ha. Ikkinchisida chiziq ostida a turibdi, va a nolga teng bo'lsa, ilova yiqiladi. Belgilar o'sha, JOY boshqa.",
      'Да. Во второй под чертой стоит a, и если a равно нулю, приложение упадёт. Знаки те же — место разное.',
      'Yes. In the second one a stands below the bar, and if a is zero the app crashes. Same symbols, different place.',
    ),
  },
}


// ============================================================
const S5 = {
  eyebrow: L("TAQIQ KO'CHADI", 'ЗАПРЕТ ПЕРЕЕЗЖАЕТ', 'THE RESTRICTION MOVES'),
  title: L(
    "Taqiq qayerda yashaydi",
    'Где живёт запрет',
    'Where the restriction lives',
  ),
  audio: [
    A('mount',
      "Uchta yozuv. Ularning maxrajlari har xil, va taqiqlari ham har xil.",
      'Три записи. Знаменатели у них разные, и запреты тоже разные.',
      'Three records. Their denominators differ, and so do their restrictions.'),
    W('c2',
      "Maxraj uchga siljidi — taqiq ham uchga ko'chdi.",
      'Знаменатель сдвинулся на три — и запрет переехал на три.',
      'The denominator shifted by three, and the restriction moved to three.'),
    W('c3',
      "Beshga siljidi — taqiq beshda. Taqiq songa emas, MAXRAJGA bog'liq.",
      'Сдвинулся на пять — запрет на пятёрке. Запрет привязан не к числу, а к ЗНАМЕНАТЕЛЮ.',
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
  },
}


// ============================================================
const S6 = {
  eyebrow: L('IKKI USUL', 'ДВА СПОСОБА', 'TWO METHODS'),
  title: L(
    "600 : (k − 4) yozuvini ikki usul bilan tekshiramiz",
    'Проверим 600 : (k − 4) двумя способами',
    'Checking 600 : (k − 4) two ways',
  ),
  audio: [
    A('mount',
      "Bitta yozuv va ikkita yo'l. Ikkalasi ham bir xil sonni beradi.",
      'Одна запись и два пути. Оба дают одно и то же число.',
      'One record and two ways. Both give the same number.'),
    W('w4',
      "To'rtlikda maxraj nolga aylandi va ilova yiqildi. Birinchi usul ishladi, lekin uzoq.",
      'На четвёрке знаменатель обратился в нуль и приложение упало. Первый способ сработал, но он долгий.',
      'At four the denominator became zero and the app crashed. The first method worked, but it is slow.'),
    W('w6',
      "Ikkinchi usul qisqa: maxrajni nolga tenglaymiz.",
      'Второй способ короткий: приравниваем знаменатель к нулю.',
      'The second method is short: we set the denominator to zero.'),
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
          { text: 'k = 4   →   600 : (4 − 4)   =   600 : 0', tone: 'no', note: L('yiqildi', 'упало', 'crashed') },
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
    "Yozuvning har bir qismi nima qiladi",
    'Что делает каждая часть записи',
    'What each part of the record does',
  ),
  audio: [
    A('mount',
      "Bitta yozuv, uchta qism. Har birining o'z roli bor.",
      'Одна запись, три части. У каждой своя роль.',
      'One record, three parts. Each has its own role.'),
    W('p2',
      "Maxraj hamma narsani hal qiladi: narx hisoblanadimi yoki yo'q — faqat undan bog'liq.",
      'Знаменатель решает всё: посчитается цена или нет — зависит только от него.',
      'The denominator decides everything: whether the price computes depends only on it.'),
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
      cap: L('BILASIZMI · AMALIYOT', 'ЗНАЕШЬ ЛИ ТЫ · ПРАКТИКА', 'DID YOU KNOW · PRACTICE'),
      text: L(
        "Ma'lumotlar bazalarida maxraj hisobdan OLDIN tekshiriladi: aks holda butun so'rov yiqiladi, bitta qator emas.",
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
    "Qoidani yig'ing",
    'Собери правило',
    'Assemble the rule',
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
    fragments: [
      { id: 'f1', label: L('ODZ ni topish uchun', 'Чтобы найти ОДЗ,', 'To find the domain,') },
      { id: 'f2', label: L('maxrajga qaraladi', 'смотрят на знаменатель', 'look at the denominator') },
      { id: 'f3', label: L('va shunday sonlar taqiqlanadi', 'и запрещают те числа,', 'and forbid those numbers') },
      { id: 'f4', label: L('ular maxrajni nolga aylantiradi', 'при которых он равен нулю', 'that make it zero') },
      { id: 'w1', label: L('suratga qaraladi', 'смотрят на числитель', 'look at the numerator') },
      { id: 'w2', label: L('ular maxrajni birga aylantiradi', 'при которых он равен единице', 'that make it one') },
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
          "Ratsional kasr: A va B ko'phadlar, B nolga teng emas",
          'Рациональная дробь: A и B многочлены, B не равно нулю',
          'A rational fraction: A and B are polynomials, B is not zero',
        ),
        STATEMENTS[0],
        STATEMENTS[1],
        STATEMENTS[2],
      ],
      // METODIST: parag'raf raqami va BET shu yerga yoziladi (§20 p. 12).
      // Darslik skanerlangan PDF, matn chiqarib bo'lmadi — DARS01_SKELET.md §8.
      source: L(
        "Algebra, 8-sinf — ratsional ifodalar parag'rafi",
        'Алгебра, 8 класс — параграф о рациональных выражениях',
        'Algebra, grade 8 — the section on rational expressions',
      ),
      locked: L(
        "Qoida to'g'ri yig'ilgandan keyin ochiladi",
        'Правило откроется после верной сборки',
        'The rule opens once assembled correctly',
      ),
    },
    // XUKKA QAYTISH: plotter o'chadi, jadval yashil bo'ladi.
    recall: {
      left: L('plotter: 4', 'плоттер: 4', 'plotter: 4'),
      right: L("jadval: qiymat yo'q", 'таблица: значения нет', 'table: no value'),
      winner: 'right',
      note: L(
        "Ikkilikda maxraj nolga aylanadi, ya'ni qiymat yo'q. Plotter nuqtalarni birlashtirgan edi.",
        'При двойке знаменатель обращается в нуль, значит значения нет. Плоттер просто соединил точки.',
        'At two the denominator becomes zero, so there is no value. The plotter merely joined the points.',
      ),
    },
  },
}

// ============================================================
// EKRAN 9. MASHQ 1: ZANJIR. To'rt qisqa yozuv, har birining ODZ si.
// «Taqiqlangan qiymat yo'q» tugmasi HAMMA topshiriqda turadi.
// ============================================================
const S9 = {
  eyebrow: L('MASHQ', 'ПРАКТИКА', 'PRACTICE'),
  title: L(
    "To'rt soha",
    'Четыре области',
    'Four domains',
  ),
  audio: [
    A('mount',
      "Qoida yig'ildi. Endi to'rtta qisqa yozuv, va har birining o'z sohasi bor. Ba'zilarida taqiq umuman bo'lmasligi mumkin.",
      'Правило собрано. Теперь четыре коротких записи, и у каждой своя область. У некоторых запрета может не быть вовсе.',
      'The rule is assembled. Now four short records, each with its own domain. Some may have no restriction at all.'),
    W('t2',
      "Maxrajga butunlay qarang. Agar u ko'paytma bo'lsa, taqiq bittadan ko'p bo'lishi mumkin.",
      'Смотри на знаменатель целиком. Если он произведение, запретов может быть больше одного.',
      'Look at the denominator as a whole. If it is a product, there may be more than one restriction.'),
  ],
  props: {
    items: [
      {
        kind: 'odz',
        varName: 'x',
        excluded: [-4],
        none: false,
        noneLabel: L("taqiqlangan qiymat yo'q", 'запрещённых значений нет', 'no forbidden values'),
        noneWrong: L(
          "Bu yerda taqiq bor. Minus to'rtni qo'ying: maxraj nolga aylanadi.",
          'Здесь запрет есть. Подставь минус четыре: знаменатель обратится в нуль.',
          'There is a restriction here. Put minus four: the denominator becomes zero.',
        ),
        prompt: L('ODZ ni yozing', 'Запиши ОДЗ', 'Type the domain'),
        show: <Row size="row" align="center">{F('7', 'x + 4')}</Row>,
        answer: 'x != -4',
        accepts: ['x != -4', '-4 != x'],
        closed: L('7 / (x + 4)   →   x ≠ −4', '7 / (x + 4)   →   x ≠ −4', '7 / (x + 4)   →   x ≠ −4'),
        hints: {
          'x != 4': L(
            "To'rtni qo'ying: maxraj sakkiz bo'ladi, nol emas. Belgiga qarang.",
            'Подставь четыре: знаменатель станет восемь, а не нуль. Смотри на знак.',
            'Put four: the denominator becomes eight, not zero. Look at the sign.',
          ),
        },
      },
      {
        kind: 'odz',
        varName: 'x',
        excluded: [3],
        none: false,
        noneLabel: L("taqiqlangan qiymat yo'q", 'запрещённых значений нет', 'no forbidden values'),
        noneWrong: L(
          "Taqiq bor. Maxrajni nolga tenglashtirib ko'ring.",
          'Запрет есть. Приравняй знаменатель к нулю и посмотри.',
          'There is a restriction. Set the denominator equal to zero and look.',
        ),
        prompt: L('ODZ ni yozing', 'Запиши ОДЗ', 'Type the domain'),
        show: <Row size="row" align="center">{F('x', '2x − 6')}</Row>,
        answer: 'x != 3',
        accepts: ['x != 3', '2*x - 6 != 0'],
        closed: L('x / (2x − 6)   →   x ≠ 3', 'x / (2x − 6)   →   x ≠ 3', 'x / (2x − 6)   →   x ≠ 3'),
        hints: {
          'x != 6': L(
            "Oltini qo'ying: ikki marta olti minus olti, olti chiqadi, nol emas. Ikkilikni ham hisobga oling.",
            'Подставь шесть: два раза шесть минус шесть, получится шесть, а не нуль. Учти двойку.',
            'Put six: two times six minus six gives six, not zero. Account for the two.',
          ),
          'x != 0': L(
            "Nol SURATNI nolga aylantiradi. Nolda kasr nolga teng, qiymat bor.",
            'Нуль обращает в нуль ЧИСЛИТЕЛЬ. При нуле дробь равна нулю, значение есть.',
            'Zero makes the NUMERATOR zero. At zero the fraction equals zero, the value exists.',
          ),
        },
      },
      {
        kind: 'odz',
        varName: 'x',
        excluded: [],
        none: true,
        noneValue: L("taqiq yo'q", 'запретов нет', 'no restrictions'),
        noneLabel: L("taqiqlangan qiymat yo'q", 'запрещённых значений нет', 'no forbidden values'),
        prompt: L('ODZ ni yozing', 'Запиши ОДЗ', 'Type the domain'),
        show: <Row size="row" align="center">{F('x − 1', 'x² + 1')}</Row>,
        answer: 'barcha',
        accepts: ['barcha', 'любое'],
        closed: L("(x − 1) / (x² + 1)   →   taqiq yo'q", '(x − 1) / (x² + 1)   →   запретов нет', '(x − 1) / (x² + 1)   →   no restrictions'),
        hints: {
          'x != -1': L(
            "Minus birni qo'ying: kvadrat plyus bir, ikki chiqadi. Kvadrat manfiy bo'lmaydi, shuning uchun pastda hech qachon nol chiqmaydi.",
            'Подставь минус один: квадрат плюс один, получится два. Квадрат не бывает отрицательным, поэтому внизу нуль не получится никогда.',
            'Put minus one: a square plus one gives two. A square is never negative, so the bottom never becomes zero.',
          ),
          'x != 1': L(
            "Bir SURATNI nolga aylantiradi. Bunda kasr nolga teng, ya'ni qiymat bor.",
            'Единица обращает в нуль ЧИСЛИТЕЛЬ. При ней дробь равна нулю, то есть значение есть.',
            'One makes the NUMERATOR zero. Then the fraction equals zero, so the value exists.',
          ),
        },
      },
      {
        kind: 'odz',
        varName: 'x',
        excluded: [0, 5],
        none: false,
        noneLabel: L("taqiqlangan qiymat yo'q", 'запрещённых значений нет', 'no forbidden values'),
        noneWrong: L(
          "Taqiq bor, hatto ikkita. Maxrajning har bir ko'paytuvchisiga qarang.",
          'Запрет есть, и даже два. Смотри на каждый множитель знаменателя.',
          'There are restrictions, two of them. Look at each factor of the denominator.',
        ),
        prompt: L('ODZ ni yozing', 'Запиши ОДЗ', 'Type the domain'),
        show: <Row size="row" align="center">{F('3', 'x(x − 5)')}</Row>,
        answer: 'x != 0, x != 5',
        accepts: ['x != 0, x != 5', 'x != 5, x != 0'],
        closed: L('3 / x(x − 5)   →   x ≠ 0,  x ≠ 5', '3 / x(x − 5)   →   x ≠ 0,  x ≠ 5', '3 / x(x − 5)   →   x ≠ 0,  x ≠ 5'),
        hints: {
          'x != 5': L(
            "Bitta shart yetmaydi. Nolni qo'ying: ko'paytmaning birinchi ko'paytuvchisi nol bo'ladi.",
            'Одного условия не хватает. Подставь нуль: первый множитель произведения станет нулём.',
            'One condition is missing. Put zero: the first factor of the product becomes zero.',
          ),
          'x != 0': L(
            "Bitta shart yetmaydi. Beshni qo'ying: ikkinchi ko'paytuvchi nol bo'ladi.",
            'Одного условия не хватает. Подставь пять: второй множитель станет нулём.',
            'One condition is missing. Put five: the second factor becomes zero.',
          ),
        },
      },
    ],
  },
}

// ============================================================
// EKRAN 10. MASHQ 2: YO'NALTIRILGAN. Qadamlar nomlangan. Bu yerda З18
// ochiladi: surat noli ODZ ga TUSHMAYDI.
// ============================================================
const S10 = {
  eyebrow: L("YO'NALTIRILGAN MASHQ", 'НАПРАВЛЯЕМАЯ ПРАКТИКА', 'GUIDED PRACTICE'),
  title: L(
    "Ikki xil nol bir yozuvda",
    'Два разных нуля в одной записи',
    'Two kinds of zero in one record',
  ),
  audio: [
    A('mount',
      "Endi topshiriq uzunroq, va qadamlari nomlangan. Oxirida bitta g'alati narsa chiqadi.",
      'Теперь задание длиннее, и шаги названы. В конце получится одна странная вещь.',
      'Now the task is longer and the steps are named. At the end one strange thing will come out.'),
    W('f2',
      "ODZ yozildi. Endi toping, qaysi sonda surat nolga aylanadi.",
      'ОДЗ записана. Теперь найди, при каком числе обращается в нуль числитель.',
      'The domain is written. Now find at which number the numerator becomes zero.'),
    W('f3',
      "Surat to'rtda nolga aylanadi, lekin to'rt taqiqlangan. Ya'ni bu yozuvning qiymati hech qanday sonda nolga teng emas.",
      'Числитель обращается в нуль при четырёх, но четыре запрещено. Значит значения нуль у этой записи нет ни при каком числе.',
      'The numerator becomes zero at four, but four is forbidden. So this record never takes the value zero.'),
  ],
  props: {
    show: <Row size="big" align="center">{F('x − 4', 'x² − 16')}</Row>,
    fields: [
      {
        ask: L(
          "Maxraj ikki ko'paytuvchiga ajraladi. Birinchisi x − 4. Ikkinchisini yozing",
          'Знаменатель раскладывается на два множителя. Первый — x − 4. Запиши второй',
          'The denominator splits into two factors. The first is x − 4. Type the second',
        ),
        answer: 'x+4',
        accepts: ['4+x', '(x+4)'],
        hints: {
          'x-4': L(
            "Unda ikki ko'paytuvchi bir xil bo'ladi. Nolni qo'ying: o'n olti chiqadi, boshlang'ich maxrajda esa minus o'n olti.",
            'Тогда оба множителя совпадут. Подставь нуль: получится шестнадцать, а в исходном знаменателе минус шестнадцать.',
            'Then both factors coincide. Put zero: you get sixteen, while the original denominator gives minus sixteen.',
          ),
        },
      },
      {
        kind: 'odz',
        varName: 'x',
        excluded: [4, -4],
        ask: L('ODZ ni yozing', 'Запиши ОДЗ', 'Type the domain'),
        accepts: ['x != 4, x != -4', 'x != -4, x != 4'],
        hints: {
          'x != 4': L(
            "Bitta shart yetmaydi. Minus to'rtni qo'ying: maxraj yana nolga aylanadi.",
            'Одного условия не хватает. Подставь минус четыре: знаменатель снова обращается в нуль.',
            'One condition is missing. Put minus four: the denominator becomes zero again.',
          ),
        },
      },
      {
        ask: L(
          "Qaysi x da SURAT nolga aylanadi? Sonni yozing",
          'При каком x обращается в нуль ЧИСЛИТЕЛЬ? Запиши число',
          'At which x does the NUMERATOR become zero? Type the number',
        ),
        answer: '4',
        accepts: ['8/2', '2+2'],
        hints: {
          '-4': L(
            "Minus to'rt MAXRAJNI nolga aylantiradi. Surat x − 4.",
            'Минус четыре обращает в нуль ЗНАМЕНАТЕЛЬ. Числитель это x − 4.',
            'Minus four makes the DENOMINATOR zero. The numerator is x − 4.',
          ),
          '0': L(
            "Nolni qo'ying: surat minus to'rt bo'ladi, nol emas.",
            'Подставь нуль: числитель станет минус четыре, а не нуль.',
            'Put zero: the numerator becomes minus four, not zero.',
          ),
        },
      },
    ],
    note: L(
      "To'rt suratni nolga aylantiradi, lekin ODZ ga kirmaydi. Shuning uchun bu kasr hech qachon nolga teng emas.",
      'Четыре обращает в нуль числитель, но не входит в ОДЗ. Поэтому эта дробь не равна нулю никогда.',
      'Four makes the numerator zero but is not in the domain. So this fraction is never equal to zero.',
    ),
  },
}

// ============================================================
// EKRAN 11. MASHQ 3: ASBOBSIZ (§20 p. 5g). Amallar qatori YO'Q, ODZ satri
// o'zi to'lmaydi, yordam YO'Q. Yozuv, ikki maydon va O'Z SONI.
// ============================================================
const S11 = {
  eyebrow: L('ASBOBSIZ', 'БЕЗ ПРИБОРА', 'WITHOUT THE TOOL'),
  title: L(
    "Asbob yo'q",
    'Прибора нет',
    'No tool',
  ),
  audio: [
    A('mount',
      "Bu ekranda asbob yo'q. Bosiladigan qismlar ham, tayyor soha satri ham yo'q. Faqat yozuv va ikki maydon.",
      'На этом экране прибора нет. Ни нажимаемых частей, ни готовой строки области. Только запись и два поля.',
      'There is no tool on this screen. No tappable parts, no ready domain line. Only the record and two fields.'),
    A('why',
      "Xayolda va qoralamada sanang. Imtihonda kalkulyator bo'lmaydi.",
      'Считай в уме и на черновике. На экзамене калькулятора не будет.',
      'Count in your head and on the draft. There will be no calculator at the exam.'),
  ],
  props: {
    show: <Row size="big" align="center">{F('2x + 10', 'x² − 25')}</Row>,
    result: {
      ask: L(
        "x = 1 dagi qiymatni toping. Sonni yozing",
        'Найди значение при x = 1. Запиши число',
        'Find the value at x = 1. Type the number',
      ),
      answer: '-0.5',
      accepts: ['-1/2', '12/(-24)'],
      hints: {
        '0.5': L(
          "Belgini tekshiring: pastda bir minus yigirma besh, ya'ni minus yigirma to'rt.",
          'Проверь знак: снизу один минус двадцать пять, то есть минус двадцать четыре.',
          'Check the sign: below is one minus twenty five, that is minus twenty four.',
        ),
        '-2': L(
          "Yuqorida ikki marta bir plyus o'n, ya'ni o'n ikki. Pastda minus yigirma to'rt.",
          'Сверху два раза один плюс десять, то есть двенадцать. Снизу минус двадцать четыре.',
          'Above is two times one plus ten, that is twelve. Below is minus twenty four.',
        ),
      },
    },
    odz: {
      varName: 'x',
      excluded: [5, -5],
      ask: L('ODZ ni yozing', 'Запиши ОДЗ', 'Type the domain'),
      accepts: ['x != 5, x != -5', 'x != -5, x != 5'],
      hints: {
        'x != 5': L(
          "Bitta shart yetmaydi. Minus beshni qo'ying: maxraj yana nolga aylanadi.",
          'Одного условия не хватает. Подставь минус пять: знаменатель снова обращается в нуль.',
          'One condition is missing. Put minus five: the denominator becomes zero again.',
        ),
        'x != 25': L(
          "Yigirma beshni qo'ying: maxraj olti yuzga yaqin bo'ladi, nol emas. Yigirma besh kvadrat ostida turgan edi.",
          'Подставь двадцать пять: знаменатель станет около шестисот, а не нуль. Двадцать пять стояло под квадратом.',
          'Put twenty five: the denominator becomes about six hundred, not zero. Twenty five stood under the square.',
        ),
      },
    },
    proof: {
      varName: 'x',
      from: '(2*x+10)/(x*x-25)',
      to: '(2*x+10)/((x-5)*(x+5))',
      ask: L(
        "O'zingizni tekshiring: o'z sonini ikki yozuvga ham qo'ying",
        'Проверь себя: поставь своё число в обе записи',
        'Check yourself: put your own number into both records',
      ),
      done: L('tekshirildi:', 'проверено при:', 'checked at:'),
      hole: L(
        "Bu sonda ikki yozuvning ham qiymati yo'q: bu aynan taqiqlangan qiymat. Boshqa son oling.",
        'При этом числе ни одна из записей не считается: это и есть запрещённое значение. Возьми другое число.',
        'At this number neither record works: this is exactly a forbidden value. Take another number.',
      ),
      diff: L(
        "Qiymatlar ajraldi. Ajratish qiymatlarni o'zgartirmasligi kerak — hisobni qaytadan qarang.",
        'Значения разошлись. Разложение не должно менять значения — проверь счёт.',
        'The values diverged. Factorising must not change values, so check the arithmetic.',
      ),
    },
    note: L(
      "Ajratish qiymatlarni o'zgartirmadi. U faqat taqiqlarni ko'rinadigan qildi.",
      'Разложение не изменило значений. Оно только сделало запреты видимыми.',
      'Factorising changed no values. It only made the restrictions visible.',
    ),
  },
}

// ============================================================
// EKRAN 12. TUZOQ (§2.2.2). Har bir qadam to'g'ri ko'rinadi, javob esa
// noto'g'ri. Noto'g'ri satrdan KEYINGI satr undan to'g'ri chiqadi, shuning
// uchun BIRINCHI noto'g'risini izlash kerak. Kontrprimerni O'QUVCHI kiritadi.
// ============================================================
const S12 = {
  eyebrow: L('TUZOQ', 'ЛОВУШКА', 'THE TRAP'),
  title: L(
    "Birinchi xato qaysi satrda",
    'В какой строке первая ошибка',
    'Which line has the first mistake',
  ),
  audio: [
    A('mount',
      "Endi begona yechim. To'rt satrning hammasi to'g'ri ko'rinadi, javob esa noto'g'ri. Birinchi noto'g'ri satrni toping, chunki undan keyingilari undan to'g'ri kelib chiqadi.",
      'Теперь чужое решение. Все четыре строки выглядят верными, а ответ неверен. Найди первую неверную строку, потому что следующие из неё выводятся верно.',
      'Now a solution written by someone else. All four lines look right but the answer is wrong. Find the first wrong line, because the ones after it follow from it correctly.'),
    W('proof',
      "Satr topildi. Endi buni son bilan isbotlang, so'z bilan emas.",
      'Строка найдена. Теперь докажи это числом, а не словами.',
      'The line is found. Now prove it with a number, not with words.'),
  ],
  props: {
    rows: [
      { id: 'r1', show: <Row size="row" align="center">{'x² − 4x'}</Row> },
      { id: 'r2', show: <Row size="row" align="center">{'x² − 4x = x(x − 4)'}</Row> },
      { id: 'r3', show: <Row size="row" align="center">{'x − 4 = 0,   x = 4'}</Row> },
      { id: 'r4', show: L('ODZ:  x ≠ 4', 'ОДЗ:  x ≠ 4', 'Domain:  x ≠ 4') },
    ],
    answerId: 'r3',
    hints: {
      r1: L(
        "Maxraj to'g'ri ko'chirilgan: chiziq ostida aynan shu turadi.",
        'Знаменатель выписан верно: под чертой стоит именно это.',
        'The denominator is copied correctly: this is exactly what is under the bar.',
      ),
      r2: L(
        "Ajratish to'g'ri. Ikkini qo'ying: chapda ham, o'ngda ham minus to'rt chiqadi.",
        'Разложение верное. Подставь два: и слева, и справа получится минус четыре.',
        'The factorisation is right. Put two: both sides give minus four.',
      ),
      r4: L(
        "Bu satr oldingisidan to'g'ri chiqadi: taqiq bitta bo'lsa, aynan shunday yoziladi. Xato yuqorida.",
        'Эта строка следует из предыдущей верно: если запрет один, так и записывают. Ошибка выше.',
        'This line follows from the previous one correctly: with one restriction that is how you write it. The mistake is above.',
      ),
    },
    ask: {
      varName: 'x',
      of: '(x+1)/x',
      label: L('Kontrprimer', 'Контрпример', 'Counterexample'),
      wrong: L(
        "Bu sonni javob allaqachon taqiqlagan. Javobga tushmagan sonni toping.",
        'Это число ответ уже запретил. Найди то, которое в ответ не попало.',
        'The answer already forbids this number. Find the one that did not get into the answer.',
      ),
      note: L(
        "Nol maxrajni nolga aylantiradi, lekin javobda yo'q. Ya'ni uchinchi satr x ko'paytuvchisini tashlab ketgan.",
        'Нуль обращает знаменатель в нуль, но в ответе его нет. Значит третья строка потеряла множитель x.',
        'Zero makes the denominator zero but is missing from the answer. So the third line lost the factor x.',
      ),
    },
  },
}

// ============================================================
// EKRAN 13. KO'CHIRISH: TESKARI TOPSHIRIQ. Javob ko'p, ikki xossa
// tekshiriladi: qiymatlar mos keldimi va taqiqlangan sonlar mos keldimi.
// ============================================================
const S13 = {
  eyebrow: L("KO'CHIRISH", 'ПЕРЕНОС', 'TRANSFER'),
  title: L(
    "Yozuvni o'zingiz tuzing",
    'Запись составь сам',
    'Build the record yourself',
  ),
  audio: [
    A('mount',
      "Oxirgi mazmunli topshiriq, va u teskari. Javob berilgan, yozuvni siz tuzasiz.",
      'Последнее содержательное задание, и оно обратное. Ответ дан, запись составляешь ты.',
      'The last substantial task, and it is the inverse one. The answer is given, you build the record.'),
    A('why',
      "Javoblar ko'p, va bu normal. Ikki narsa tekshiriladi. Qiymatlar mos keldimi va taqiqlangan sonlar mos keldimi.",
      'Ответов много, и это нормально. Проверяются две вещи. Совпали значения и совпали запрещённые числа.',
      'There are many answers, and that is normal. Two things are checked. Whether the values match and whether the forbidden numbers match.'),
  ],
  props: {
    varName: 'x',
    prompt: L(
      "Shunday kasr ifoda yozing: barcha ruxsat etilgan x da qiymati birga teng, taqiqlangan sonlari esa aynan uch va minus uch",
      'Запиши дробное выражение: при всех допустимых x его значение равно единице, а запрещённых чисел ровно два — три и минус три',
      'Write a fractional expression whose value is one for all admissible x and whose forbidden numbers are exactly three and minus three',
    ),
    reduceTo: '1',
    excluded: [3, -3],
    hints: {
      '(x-3)/(x-3)': L(
        "Qiymati birga teng, lekin taqiq bitta. Minus uch ham taqiqlanishi kerak: maxrajga ikkinchi ko'paytuvchi kerak.",
        'Значение равно единице, но запрет один. Минус три тоже должно быть запрещено: знаменателю нужен второй множитель.',
        'The value is one but there is only one restriction. Minus three must be forbidden too: the denominator needs a second factor.',
      ),
      '1': L(
        "Birlikning taqiqi yo'q: uni har qanday sonda hisoblash mumkin. Bo'linish kerak, va maxraj uch va minus uchda nolga aylanishi kerak.",
        'У единицы запретов нет: её можно посчитать при любом числе. Нужно деление, и знаменатель должен обращаться в нуль при трёх и минус трёх.',
        'One has no restrictions: it works for any number. You need a division whose denominator becomes zero at three and minus three.',
      ),
    },
    note: L(
      "Qiymat va soha — ikki boshqa narsa. Bir xil qiymatli yozuvlarning sohasi boshqa bo'lishi mumkin.",
      'Значение и область — две разные вещи. У записей с одинаковым значением область может быть разной.',
      'Value and domain are two different things. Records with the same value may have different domains.',
    ),
  },
}

// ============================================================
// EKRAN 14. BLITS. To'rt savol BITTA panelda, BELGI haqida. Ball YO'Q:
// birinchi urinishlardan tayyorlik darajasi SO'Z bilan yig'iladi (§2.2.5).
// ============================================================
const S14 = {
  eyebrow: L('BLITS', 'БЛИЦ', 'BLITZ'),
  title: L(
    "To'rt savol",
    'Четыре вопроса',
    'Four questions',
  ),
  audio: [
    A('mount',
      "To'rt savol bitta panelda. Ular yozuvni emas, belgini so'raydi, ya'ni nimaga qarab ajratasiz.",
      'Четыре вопроса в одной панели. Они спрашивают не запись, а признак, то есть по чему ты различаешь.',
      'Four questions in one panel. They ask not for a record but for the sign, that is what you tell things apart by.'),
    A('why',
      "Ball bu yerda yo'q. Birinchi urinishlardan takrorlash kerak bo'lgan narsa yig'iladi.",
      'Балла здесь нет. Из первых попыток соберётся то, что стоит повторить.',
      'There is no mark here. Your first attempts will show what is worth another pass.'),
  ],
  props: {
    items: [
      {
        id: 'q1',
        tag: 'З2',
        ask: L(
          "Yozuvning qaysi qismi bo'yicha ODZ topiladi?",
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
          'ODZ yozildi. Ishni tugallangan qiladigan narsa nima?',
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
    "Uch tasdiq",
    'Три утверждения',
    'Three statements',
  ),
  audio: [
    A('s0',
      "Uch tasdiq. Chapda boshdagi taxminingiz va tekshirilgan natija yonma-yon turadi.",
      'Три утверждения. Слева твой прогноз с начала и проверенный результат стоят рядом.',
      'Three statements. On the left your prediction and the verified result stand side by side.'),
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
    bridge: L(
      "Keyingisi: 2-dars, ratsional kasrning asosiy xossasi.",
      'Дальше: урок 2, основное свойство рациональной дроби.',
      'Next: lesson 2, the main property of a rational fraction.',
    ),
  },
}

// ============================================================
// СЦЕНА ФИНАЛА (§6). Пропорция 400 на 92 держится в SceneBand.
// Сцена ОТВЕЧАЕТ на вопрос хука: там две машины спорили, здесь на том же
// графике стоит выколотая точка и написано условие. Объект тот же, изменилось
// ровно то, что объяснил урок. Математическая сцена, без персонажей.
// ============================================================

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
  { role: 'explain',  tool: 'chain',     kind: 'move',     tag: 'З18', ...S5 },
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
          { rec: '(x · x − 4) : (x − 2)', at: 'x = 2', den: '0' },
          { rec: '(a + 5) : (a − 3)', at: 'a = 3', den: '0' },
          { rec: '7 : (a − 5)', at: 'a = 5', den: '0' },
        ]}
      />
    ),
    ...S8,
  },
  { role: 'practice', tool: 'chain',     kind: 'chain',    tag: 'З2',  method: M_ODZ,   ...S9 },
  { role: 'practice', tool: 'fields',    kind: 'guided',   tag: 'З18', method: M_ODZ,   ...S10 },
  { role: 'practice', tool: 'solo',      kind: 'solo',     tag: 'З16', method: M_ODZ,   ...S11 },
  { role: 'practice', tool: 'audit',     kind: 'audit',    tag: 'З16', method: M_CHECK, ...S12 },
  { role: 'transfer', tool: 'inverse',   tag: 'З2',        method: M_KIND, ...S13 },
  { role: 'blitz',    tool: 'blitz',     ...S14 },
  { role: 'summary',  tool: 'summary',   scene: FinalScene, ...S15 },
]

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
