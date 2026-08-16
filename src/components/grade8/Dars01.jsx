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
  // Телефон рисуется как ПРЕДМЕТ: корпус, динамик, шапка приложения, поле
  // ввода количества и строка результата. Две карточки с текстом сценой не
  // читались — они могли быть чем угодно.
  const phone = (x, bad) => (
    <g key={x}>
      <rect x={x} y="6" width="132" height="142" rx="16"
        fill={T.paper} stroke={bad ? T.tip : 'rgba(23,26,29,.16)'} strokeWidth={bad ? 2 : 1.4}
        pathLength="1" className="g8-draw"/>
      <rect x={x + 52} y="14" width="28" height="3" rx="1.5" fill="rgba(23,26,29,.18)"/>
      <rect x={x + 10} y="24" width="112" height="16" rx="6" fill={T.bg}/>
      <text x={x + 66} y="35" textAnchor="middle" fontFamily="'Manrope', system-ui, sans-serif"
        fontSize="7" letterSpacing="1.1" fill={T.ink3}>{t(SC_APP)}</text>
      <rect x={x + 10} y="48" width="112" height="22" rx="7" fill={T.bg}/>
      <text x={x + 18} y="63" fontFamily="'Manrope', system-ui, sans-serif"
        fontSize="7.5" fill={T.ink3}>{t(SC_QTY)}</text>
      <text x={x + 114} y="64" textAnchor="end" fontFamily={MATH_FONT} fontSize="13"
        fill={bad ? T.tip : T.ink}>{bad ? '0' : '3'}</text>
    </g>
  )
  return (
    <SceneBand kind="hook" label={L(
      "Ikki foydalanuvchi, bitta ilova",
      'Два пользователя, одно приложение',
      'Two users, one app',
    )}>
      {phone(48, false)}
      {phone(220, true)}

      <g className="g8-late">
        <text x="114" y="88" textAnchor="middle" fontFamily="'Manrope', system-ui, sans-serif"
          fontSize="7.5" letterSpacing="1" fill={T.ink3}>{t(SC_PRICE)}</text>
        <text x="114" y="116" textAnchor="middle" fontFamily={MATH_FONT} fontSize="26" fill={T.ok}>200</text>
      </g>
      <g className="g8-late2">
        <rect x="230" y="82" width="112" height="40" rx="8" fill={T.tipSoft}/>
        <text x="286" y="99" textAnchor="middle" fontFamily="'Manrope', system-ui, sans-serif"
          fontSize="7.5" letterSpacing="1" fill={T.tip}>{t(SC_PRICE)}</text>
        <text x="286" y="115" textAnchor="middle" fontFamily={MATH_FONT} fontSize="17" fill={T.tip}>Error</text>
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
          "Chiziq ostida ikkilik turibdi. U hech qanday a da nolga aylanmaydi.",
          'Под чертой двойка. Она не станет нулём ни при каком a.',
          'Below the bar there is a two. It never becomes zero for any a.',
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
          "Bu yerda kasr chizig'i umuman yo'q, demak taqiq ham yo'q.",
          'Здесь черты дроби нет вовсе, значит и запрета нет.',
          'There is no fraction bar here at all, so there is no restriction either.',
        ),
      },
    ],
    after: L(
      "Ha. Chiziq ostida harf turibdi, va beshlikda u nolga aylanadi.",
      'Да. Под чертой стоит буква, и при пятёрке она обращается в нуль.',
      'Yes. A letter stands below the bar, and at five it becomes zero.',
    ),
  },
}

// ============================================================
const S3 = {
  eyebrow: L('QARANG, QANDAY QILINADI', 'СМОТРИ, КАК ЭТО ДЕЛАЮТ', 'WATCH HOW IT IS DONE'),
  title: L('Taqiq qayerdan keladi', 'Откуда берётся запрет', 'Where the restriction comes from'),
  audio: [
    A('mount',
      "Uch kadr, uchta qadam. Kadrni bosing, yozuv o'zgaradi va men nima bo'layotganini aytaman.",
      'Три кадра, три шага. Нажимай кадр, запись меняется, а я говорю, что происходит.',
      'Three frames, three steps. Press a frame, the record changes and I say what happens.'),
    W('k2',
      "Ikkinchi qadam. Maxrajni nolga aylantiradigan sonni qo'ydim.",
      'Второй шаг. Я поставил число, которое обращает знаменатель в нуль.',
      'Step two. I put the number that makes the denominator zero.'),
    W('k3',
      "Uchinchi qadam. Shu shartning nomi bor. Aniqlanish sohasi, qisqasi ODZ.",
      'Третий шаг. У этого условия есть название. Область допустимых значений, коротко ОДЗ.',
      'Step three. This condition has a name. The domain of admissible values, in short the domain.'),
  ],
  props: {
    film: {
      fig: 'frac',
      data: {
        num: 'a + 5',
        den: 'a',
        varName: 'a',
        at: 0,
        odz: 'a \u2260 0',
      },
      frames: [
        {
          id: 'k1',
          phase: 1,
          label: L("chiziq ostiga", 'под черту', 'below the bar'),
          text: L(
            "Taqiq faqat chiziq ostidagi qismdan kelib chiqadi.",
            'Запрет приходит только от того, что стоит под чертой.',
            'The restriction comes only from what stands below the bar.',
          ),
        },
        {
          id: 'k2',
          phase: 2,
          label: L('nolga aylantiramiz', 'обращаем в нуль', 'make it zero'),
          text: L(
            "Nolni qo'ydim: maxraj nol bo'ldi va kasr chizig'i uzildi.",
            'Я поставил нуль: знаменатель стал нулём, и черта дроби разорвалась.',
            'I put zero: the denominator became zero and the fraction bar broke.',
          ),
          ask: {
            question: L(
              'Bu yozuv uchun nimani bildiradi?',
              'Что это значит для записи?',
              'What does that mean for the record?',
            ),
            items: [
              { id: 'none', right: true, label: L("qiymat yo'q", 'значения нет', 'no value') },
              {
                id: 'zero',
                label: L('qiymat nolga teng', 'значение равно нулю', 'the value is zero'),
                hint: L(
                  "Nol YUQORIDA bo'lsa qiymat nol bo'ladi. Minus beshni qo'ying: yuqorida nol, qiymat bor. Bu yerda nol PASTDA.",
                  'Нуль СВЕРХУ даёт значение нуль. Подставь минус пять: сверху нуль, значение есть. А здесь нуль СНИЗУ.',
                  'Zero ABOVE gives the value zero. Put minus five: zero above, the value exists. Here the zero is BELOW.',
                ),
              },
            ],
          },
        },
        {
          id: 'k3',
          phase: 3,
          label: L('shartni yozamiz', 'пишем условие', 'write the condition'),
          text: L(
            "Taqiq shart bo'lib yoziladi. Buni ODZ deb ataydilar.",
            'Запрет записывают условием. Его называют ОДЗ.',
            'The restriction is written as a condition. It is called the domain.',
          ),
        },
      ],
    },
  },
}

// ============================================================
// EKRAN 4. O'ZI. Uch qadam, boshqa yozuv, qo'l endi o'quvchining.
// Maxraj x − 3: nolga aylantiruvchi sonni asbob AYTMAYDI, o'quvchi topadi.
// ============================================================
const S4 = {
  eyebrow: L("ENDI O'ZINGIZ", 'ТЕПЕРЬ САМ', 'NOW YOU'),
  title: L(
    "Uch qadam, boshqa yozuv",
    'Три шага, другая запись',
    'Three steps, another record',
  ),
  audio: [
    A('mount',
      "Ko'rdingiz, qanday qilinadi. Endi xuddi shu uch qadamni o'zingiz bajarasiz. Yozuv boshqa, tartib esa o'sha.",
      'Ты видел, как это делают. Теперь те же три шага делаешь сам. Запись другая, порядок тот же.',
      'You saw how it is done. Now you take the same three steps. The record differs, the order is the same.'),
    W('p1',
      "Qism tanlandi. Endi shu qismni nolga aylantiradigan sonni qo'ying. Son mos kelmasa, boshqasini olasiz.",
      'Часть выбрана. Теперь поставь число, которое обращает эту часть в нуль. Если не подойдёт, возьмёшь другое.',
      'The part is chosen. Now put a number that makes this part zero. If it does not fit, take another.'),
    W('p3',
      "Maxraj nol bo'ldi. Savol o'sha, javobni o'zingiz bilasiz.",
      'Знаменатель стал нулём. Вопрос тот же, и ответ ты уже знаешь.',
      'The denominator became zero. The question is the same and you already know the answer.'),
  ],
  props: {
    demo: false,
    varName: 'x',
    num: 'x + 1',
    den: 'x − 3',
    tapAsk: L(
      "Yozuvning qaysi qismidan taqiq kelib chiqadi? Bosing",
      'По какой части записи находят запрет? Нажми',
      'Which part of the record gives the restriction? Tap it',
    ),
    tapWrong: L(
      "Bu surat, u chiziq USTIDA. Taqiq esa bo'linadigan narsadan kelib chiqadi.",
      'Это числитель, он НАД чертой. А запрет приходит от того, на что делят.',
      'This is the numerator, above the bar. The restriction comes from what you divide by.',
    ),
    probe: {
      at: 3,
      label: L("Son:", 'Число:', 'Number:'),
      question: L(
        "Uchda bu yozuv bilan nima bo'ladi?",
        'Что происходит с этой записью при трёх?',
        'What happens to this record at three?',
      ),
      items: [
        {
          id: 'none',
          right: true,
          label: L("qiymat yo'q", 'значения нет', 'there is no value'),
        },
        {
          id: 'zero',
          label: L('qiymat nolga teng', 'значение равно нулю', 'the value equals zero'),
          hint: L(
            "Nol PASTDA turganda qiymat umuman yo'q. Nol nolga teng bo'lishi uchun u YUQORIDA turishi kerak: minus birni qo'ying.",
            'Когда нуль СНИЗУ, значения нет вовсе. Чтобы значение было нулём, нуль должен быть СВЕРХУ: подставь минус один.',
            'When the zero is BELOW there is no value at all. For the value to be zero the zero must be ABOVE: put minus one.',
          ),
        },
      ],
    },
    odz: {
      excluded: [3],
      ask: L(
        'ODZ ni yozing',
        'Запиши ОДЗ',
        'Write the domain',
      ),
      accepts: ['x != 3', 'x - 3 != 0'],
      hints: {
        'x != -3': L(
          "Minus uchni qo'ying: minus uch minus uch, minus olti chiqadi, nol emas.",
          'Подставь минус три: минус три минус три, получится минус шесть, а не нуль.',
          'Put minus three: minus three minus three gives minus six, not zero.',
        ),
        'x != -1': L(
          "Minus bir SURATNI nolga aylantiradi. Bunda qiymat bor va u nolga teng.",
          'Минус один обращает в нуль ЧИСЛИТЕЛЬ. При нём значение есть, и оно равно нулю.',
          'Minus one makes the NUMERATOR zero. Then the value exists and equals zero.',
        ),
      },
    },
    // XULOSA FIGURASI: taqiq son o'qida BO'SH nuqta bo'lib ko'rinadi.
    fig: {
      kind: 'line',
      // ODZ bu yerda TAKRORLANMAYDI: u yuqorida, o'quvchi yozgan satrda turadi.
      data: { from: 0, to: 6, hole: 3 },
    },
    hint: L(
      "Uch qadamni o'zingiz bajardingiz. Taqiq o'qda bo'sh nuqta bo'lib turadi.",
      'Три шага ты сделал сам. Запрет стоит на прямой пустой точкой.',
      'You took the three steps yourself. The restriction stands on the line as a hollow point.',
    ),
  },
}

// ============================================================
// EKRAN 5. FARQLASH. Harf BOR, lekin songa bo'linadi -> taqiq YO'Q.
// «Taqiqlangan qiymat yo'q» — TUGMA, matn emas (§10.1).
// ============================================================
// EKRAN 5. O'ZINGIZ TO'LDIRING. Xuddi shu usul, BOSHQA yozuv: taqiq endi
// boshqa sonda. Jadvalni o'quvchi O'ZI to'ldiradi -- katak unga
// ko'rsatilgan emas, u O'ZI olgan natija bilan to'ladi.
// ============================================================
const S5 = {
  eyebrow: L("JADVALNI TO'LDIRING", 'ЗАПОЛНИ ТАБЛИЦУ', 'FILL THE TABLE'),
  title: L(
    "Boshqa yozuv, boshqa taqiq",
    'Другая запись — другой запрет',
    'Another record, another restriction',
  ),
  audio: [
    A('mount',
      "Yozuv boshqa. Sonlarni birma-bir qo'ying va jadvalni to'ldiring.",
      'Запись другая. Подставляй числа по очереди и заполняй таблицу.',
      'The record is different. Substitute the numbers one by one and fill the table.'),
    A('why',
      "Taqiq yana bitta sonda bo'ladi, lekin bu safar boshqasida. Uni maxraj belgilaydi.",
      'Запрет снова будет на одном числе, но в этот раз на другом. Его задаёт знаменатель.',
      'Again there will be one forbidden number, but a different one this time. The denominator sets it.'),
  ],
  props: {
    nums: [1, 2, 3, 4, 5],
    num: (a) => a + 5,
    den: (a) => a - 3,
    varName: 'a',
    table: true,
    ask: L(
      "Har bir sonni qo'ying: jadval sizning natijalaringiz bilan to'ladi",
      'Подставь каждое число — таблица заполнится твоими результатами',
      'Substitute each number: the table fills with your own results',
    ),
    broke: L(
      "Uchlikda maxraj nolga aylandi. Taqiq ikkilikda emas, uchlikda: uni maxraj belgilaydi.",
      'При тройке знаменатель обратился в нуль. Запрет не на двойке, а на тройке: его задаёт знаменатель.',
      'At three the denominator became zero. The restriction is not at two but at three: the denominator sets it.',
    ),
  },
}

// ============================================================
const S6 = {
  eyebrow: L('BIRGA YECHAMIZ', 'РЕШАЕМ ВМЕСТЕ', 'SOLVING TOGETHER'),
  title: L(
    "Butun yechim, boshdan oxirigacha",
    'Решение целиком, от начала до конца',
    'A full solution, start to finish',
  ),
  audio: [
    A('mount',
      "Bitta misolni butunlay yechamiz. Hech narsa o'chirilmaydi: har bir qator ekranda qoladi.",
      'Разберём один пример целиком. Ничего стирать не будем: каждая строка останется на экране.',
      'We will solve one example completely. Nothing gets erased: every line stays on the screen.'),
    W('s3',
      "Ko'paytma nolga aylanishi uchun bitta ko'paytuvchining noli yetarli. Shuning uchun ikkita alohida tenglama chiqdi.",
      'Чтобы произведение стало нулём, хватает нуля у одного множителя. Поэтому получилось два отдельных уравнения.',
      'For a product to be zero, one factor being zero is enough. That is why we got two separate equations.'),
    W('s5',
      "Uchlikni qo'yib ko'ramiz. Birinchi qavs nolga aylanadi, demak butun maxraj nol. Bu rad javob, va uni ko'rish kerak.",
      'Подставляем тройку. Первая скобка обращается в нуль, значит и весь знаменатель нуль. Это отказ, и его надо увидеть.',
      'We substitute three. The first bracket becomes zero, so the whole denominator is zero. That is a refusal, and it must be seen.'),
    W('s7',
      "Javob ikki shartdan iborat. Ikkala son ham taqiqlangan, chunki har biri maxrajni nolga aylantiradi.",
      'Ответ состоит из двух условий. Оба числа запрещены, потому что каждое обращает знаменатель в нуль.',
      'The answer consists of two conditions. Both numbers are forbidden because each turns the denominator into zero.'),
  ],
  props: {
    task: L(
      "Ushbu ifodaning ODZ sini topamiz",
      'Найдём ОДЗ этого выражения',
      'Let us find the domain of this expression',
    ),
    method: M_ODZ,
    lines: [
      {
        text: '(x + 5) : (x² − 9)',
        note: L('ifoda', 'выражение', 'the expression'),
      },
      {
        text: 'x² − 9 = (x − 3)(x + 3)',
        note: L("maxrajni ko'paytuvchilarga ajratamiz", 'раскладываем знаменатель на множители', 'we factor the denominator'),
        ask: {
          question: L(
            "Ko'paytma qachon nolga teng?",
            'Когда произведение равно нулю?',
            'When is a product equal to zero?',
          ),
          items: [
            {
              id: 'one',
              right: true,
              label: L(
                "Kamida bitta ko'paytuvchi nol bo'lganda",
                'Когда хотя бы один множитель нуль',
                'When at least one factor is zero',
              ),
            },
            {
              id: 'both',
              label: L(
                "Ikkala ko'paytuvchi ham nol bo'lganda",
                'Когда оба множителя нули',
                'When both factors are zero',
              ),
              hint: L(
                "Bittasi yetarli. Birinchisi nol bo'lsa, ko'paytma allaqachon nol.",
                'Хватает одного. Если первый нуль, произведение уже нуль.',
                'One is enough. If the first is zero, the product is already zero.',
              ),
            },
            {
              id: 'none',
              label: L(
                "Ikkalasi ham nol bo'lmaganda",
                'Когда оба множителя не нули',
                'When neither factor is zero',
              ),
              hint: L(
                "Unda ko'paytma aynan nolga teng emas.",
                'Тогда произведение как раз не нуль.',
                'Then the product is precisely not zero.',
              ),
            },
          ],
        },
      },
      { text: '(x − 3)(x + 3) = 0' },
      { text: 'x − 3 = 0        x + 3 = 0' },
      {
        text: 'x = 3        x = −3',
        ask: {
          question: L(
            "Uchlikda maxraj nima beradi?",
            'Что даёт знаменатель при тройке?',
            'What does the denominator give at three?',
          ),
          items: [
            {
              id: 'zero',
              right: true,
              label: L(
                "Nol, demak son taqiqlangan",
                'Нуль, значит число запрещено',
                'Zero, so the number is forbidden',
              ),
            },
            {
              id: 'four',
              label: L("To'rt", 'Четыре', 'Four'),
              hint: L(
                "Olti — bu ikkinchi qavs. Birinchisi nolga aylandi, va butun ko'paytma nol bo'ldi.",
                'Шесть — это вторая скобка. Первая обнулилась, и всё произведение стало нулём.',
                'Six is the second bracket. The first became zero, so the whole product became zero.',
              ),
            },
            {
              id: 'twelve',
              label: L("O'n ikki", 'Двенадцать', 'Twelve'),
              hint: L(
                "Uch minus uch nolga teng, nolni istalgan songa ko'paytirsangiz ham nol chiqadi.",
                'Три минус три это нуль, а нуль умножить на любое число — снова нуль.',
                'Three minus three is zero, and zero times any number is zero again.',
              ),
            },
          ],
        },
      },
      {
        text: 'x = 3:   (3 − 3)(3 + 3) = 0',
        tone: 'no',
        note: L("nolga bo'lish mumkin emas", 'на нуль делить нельзя', 'division by zero is impossible'),
      },
      {
        text: 'x = 0:   (0 − 3)(0 + 3) = −9',
        tone: 'ok',
        note: L('qiymat bor', 'значение есть', 'the value exists'),
      },
      {
        text: 'x ≠ 3        x ≠ −3',
        tone: 'ok',
        note: L('javob', 'ответ', 'the answer'),
      },
    ],
  },
}

// ============================================================
// EKRAN 7. CHEGARA (§20 p. 7 — aynan 7-ekranda). Ikki yozuv, ikki ODZ satri.
// Javob — qiymatlar TO'PLAMI, variant bilan berilmaydi.
// ============================================================
// EKRAN 7. CHEGARA. Ikki yozuv YONMA-YON va BIR XIL sonda sanaladi.
// Qiymatlar mos kelaversa, ikkala panel ham yashil. Chap yozuv qiymatini
// yo'qotgan sonda u so'nadi, o'ngi esa sanashda davom etadi.
//
// Davolanadigan adashish: «qisqartirdik -- demak teng». Teng, faqat BITTA
// nuqtadan tashqari, va bu nuqta qisqartirishdan yo'qolmaydi.
// ============================================================
const S7 = {
  eyebrow: L('CHEGARA', 'ГРАНИЦА', 'THE BOUNDARY'),
  title: L(
    "Bu ikki yozuv qayerda ajraladi",
    'Где эти две записи расходятся',
    'Where these two records part ways',
  ),
  audio: [
    A('mount',
      "Ikki yozuv. Ular bir xil sonda sanaladi, va siz natijalarni yonma-yon ko'rasiz.",
      'Две записи. Они считаются на одном и том же числе, и результаты ты видишь рядом.',
      'Two records. They are computed at the same number, and you see the results side by side.'),
    A('why',
      "Sonlarni birma-bir bosing. Ular deyarli hamma joyda mos keladi, lekin hamma joyda emas.",
      'Нажимай числа по очереди. Они совпадают почти везде, но не везде.',
      'Tap the numbers one by one. They agree almost everywhere, but not everywhere.'),
  ],
  props: {
    nums: [-2, -1, 0, 1, 2],
    left: { show: 'x : x', f: (x) => (x === 0 ? null : x / x) },
    right: { show: '1', f: () => 1 },
    ask: L(
      "Sonlarni bosing: qaysinisida yozuvlar ajraladi?",
      'Нажимай числа: на каком записи разойдутся?',
      'Tap the numbers: at which one do the records part ways?',
    ),
    after: L(
      "Nolda chap yozuv qiymatini yo'qotdi, o'ngi esa bir bo'lib qoldi. Yozuvlar bitta nuqtadan tashqari hamma joyda teng.",
      'При нуле левая запись потеряла значение, а правая осталась единицей. Записи равны везде, кроме одной точки.',
      'At zero the left record lost its value while the right one stayed one. The records agree everywhere except one point.',
    ),
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
  { role: 'support',  tool: 'pick',      ...S2 },
  { role: 'explain',  tool: 'film',      kind: 'model',    tag: 'З18', ...S3 },
  { role: 'explain',  tool: 'tappart',   kind: 'selfstep', tag: 'З2',  ...S4 },
  { role: 'explain',  tool: 'feed',      kind: 'fill',     tag: 'З18', ...S5 },
  { role: 'explain',  tool: 'solve',     kind: 'solve',    tag: 'З18', ...S6 },
  { role: 'explain',  tool: 'tworec',    kind: 'gap',      tag: 'З2',  ...S7 },
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
