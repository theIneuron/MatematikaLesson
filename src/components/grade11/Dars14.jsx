// ============================================================================
// 11-sinf, Dars 14. MASALALAR.  (Задачи)
//
// B2 blokining OXIRGI darsi. Faqat MA'LUMOT.
//   raskadrovka: src/books/grade11/DARS14_SKELET.md
//   kontrakt:    src/books/grade11/ETALON_11SINF.md
//
// Etalondan (12-dars) farqi NOL ekran.
//
// DARSNING BITTA GAPI: foiz bu KO'PAYTIRISH, qo'shish emas. `100 + 14n` deb
// yozgan o'quvchi DTM da nol oladi, garchi keyingi hamma amalni to'g'ri
// bajarsa ham. Shuning uchun noto'g'ri model qoida ekranida VARIANT bo'lib
// turadi va xato izlash ekranida yana qaytadi.
//
// Ikkinchisi: noma'lum KO'RSATKICHDA o'tiradi -- blokda logarifm shuning
// uchun bor. Bu «bularning bizga nima keragi bor» degan aytilmagan savolga
// javob.
//
// `import React` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L } from './core.jsx'
import { A, UI, makeLesson } from './screens.jsx'

const META = {
  id: 'alg_11_14',
  title: L('Masalalar', 'Задачи', 'Word problems'),
}

const BLOCK = { label: 'B2', from: 9, to: 14, current: 14 }

const AXIS_1 = { min: 0, max: 6, ticks: [{ v: 2 }, { v: 3 }, { v: 4 }] }
const AXIS_3 = { min: 0, max: 6, ticks: [{ v: 3 }] }

// ============================================================
// SLAYD 1. XUK. Uch yilmi yoki to'rt.
// ============================================================
const S1 = {
  role: 'hook',
  eyebrow: L('Masalalar', 'Задачи', 'Word problems'),
  title: L('Uch yilmi yoki to\'rt?', 'Три года или четыре?', 'Three years or four?'),
  expr: L(
    '100 000 000 so\'m,  yiliga 14 %,  bo\'ldi 148 154 400',
    '100 000 000 сум, 14 % в год, стало 148 154 400',
    '100 000 000 sum, 14 % a year, became 148 154 400',
  ),
  axis: AXIS_1,
  rows: [
    {
      id: 'a',
      name: L('birinchi yechim', 'первое решение', 'first solution'),
      value: L('3 yil', '3 года', '3 years'),
      marks: [{ v: 3, tone: 'ink' }],
    },
    {
      id: 'b',
      name: L('ikkinchi yechim', 'второе решение', 'second solution'),
      value: L('4 yil', '4 года', '4 years'),
      marks: [{ v: 4, tone: 'tip' }],
    },
  ],
  probe: {
    question: L("Qaysi javob to'g'ri?", 'Какой ответ верный?', 'Which answer is correct?'),
    afterPredict: L(
      "Javobingiz yozib olindi. Endi uni jadval bo'yicha tekshiramiz.",
      'Твой ответ записан. Сейчас проверим его по таблице.',
      'Your answer is saved. Now we will check it against the table.',
    ),
    items: [
      { id: 'a', label: L('uch yil', 'три года', 'three years') },
      { id: 'b', label: L("to'rt yil", 'четыре года', 'four years') },
      { id: 'both', label: L('ikkisi ham', 'оба', 'both') },
      { id: 'none', label: L('hech qaysi', 'ни один', 'neither') },
    ],
  },
  holds: [5000, 3500, 5000, 4000],
  audio: [
    A('mount', "Bugun tayyor yozuv yo'q. Bugun uni o'zimiz tuzamiz. Odam bankka yuz million so'm qo'ydi, yiliga o'n to'rt foiz.", 'Сегодня готовой записи нет. Сегодня мы её составим сами. Человек положил в банк сто миллионов сум под четырнадцать процентов годовых.', 'Today there is no ready record. Today we will build it ourselves. A person put one hundred million sum in a bank at fourteen percent a year.'),
    A('r1', "Birinchi javob: uch yil.", 'Первый ответ: три года.', 'The first answer: three years.'),
    A('r2', "Ikkinchi javob: to'rt yil. Farq bir yil, va uni faqat hisob hal qiladi.", 'Второй ответ: четыре года. Разница в один год, и решить её может только счёт.', 'The second answer: four years. The difference is one year, and only calculation can settle it.'),
    A('ask', "Sizningcha qaysi javob to'g'ri? Hozircha shunchaki taxmin qiling.", 'Как думаешь, какой ответ верный? Пока просто предположи.', 'Which answer do you think is correct? Just make a guess for now.'),
  ],
}

// ============================================================
// SLAYD 2. TAYANCH: foiz bu ko'paytirish.
// ============================================================
const S2 = {
  role: 'support',
  eyebrow: L('Tayanchni tekshirish', 'Проверка опоры', 'Checking the basics'),
  title: L('Uch tayanch', 'Три опоры', 'Three basics'),
  lead: L(
    "Masalani yozuvga aylantirishdan oldin uch narsani eslab olamiz. Bu baholanmaydi.",
    'Прежде чем переводить задачу в запись, вспомним три вещи. Это не оценивается.',
    'Before turning the problem into a record, let us recall three things. This is not graded.',
  ),
  cards: [
    {
      id: 'c1',
      title: L('Foiz — bu ko\'paytirish', 'Процент — это умножение', 'A percent is a multiplication'),
      short: L("foiz — ko'paytirish", 'процент — умножение', 'a percent is a multiplication'),
      ex: [
        { e: '+14 %   →   × 1,14', why: L('bor edi bir butun, qo\'shildi 0,14', 'было одно целое, добавилось 0,14', 'there was one whole, 0,14 was added') },
        { e: '−20 %   →   × 0,8', why: L('bir butundan 0,2 ketdi', 'от одного целого ушло 0,2', '0,2 left the whole') },
      ],
    },
    {
      id: 'c2',
      title: L('Har yil — yana bir marta', 'Каждый год — ещё раз', 'Each year is one more time'),
      short: L('har yil yana bir marta', 'каждый год ещё раз', 'each year one more time'),
      ex: [
        { e: '2 yil  →  × 1,14 · 1,14', why: L('ikkinchi yil foiz birinchisiga ham qo\'shiladi', 'на второй год процент идёт и на первый процент', 'in the second year the percent applies to the first percent too') },
        { e: 'n yil  →  × 1,14ⁿ', why: L('shuning uchun daraja', 'поэтому степень', 'that is why a power') },
      ],
    },
    {
      // Darsning ikkinchi gapi: noma'lum KO'RSATKICHDA.
      id: 'c3',
      title: L("Noma'lum ko'rsatkichda", 'Неизвестное в показателе', 'The unknown sits in the exponent'),
      short: L("noma'lum ko'rsatkichda", 'неизвестное в показателе', 'the unknown in the exponent'),
      ex: [
        { e: '1,14ⁿ = 1,481544', why: L("n ni izlaymiz, u yuqorida turibdi", 'ищем n, а он наверху', 'we look for n, and it sits up there') },
      ],
    },
  ],
  tasks: [
    {
      id: 't1', ask: true,
      prompt: L("Yiliga 7 % o'sish — nechaga ko'paytiramiz?", 'Рост на 7 % в год — на что умножаем?', 'A 7 % rise a year — what do we multiply by?'),
      cols: 4,
      items: [
        { id: 'a', label: '1,07', correct: true },
        { id: 'b', label: '0,07', hint: L("Nol butun nol yetti bu faqat qo'shimcha qism. Butun ham qoladi, shuning uchun bir butun nol yetti.", 'Нуль целых ноль семь это только добавка. Целое ведь остаётся, поэтому один целых ноль семь.', 'Zero point zero seven is only the addition. The whole stays, so one point zero seven.') },
        { id: 'c', label: '7', hint: L("Yettiga ko'paytirsak, pul yetti barobar oshadi, yetti foizga emas.", 'Умножить на семь значит увеличить в семь раз, а не на семь процентов.', 'Multiplying by seven means seven times more, not seven percent more.') },
        { id: 'd', label: '1,7', hint: L("Bir butun yetti o'ndan bu yetmish foiz.", 'Одна целая семь десятых это семьдесят процентов.', 'One point seven is seventy percent.') },
      ],
    },
    {
      id: 't2', ask: true,
      prompt: L("Yiliga 20 % kamayish — nechaga ko'paytiramiz?", 'Уменьшение на 20 % в год — на что умножаем?', 'A 20 % fall a year — what do we multiply by?'),
      cols: 4,
      items: [
        { id: 'a', label: '0,8', correct: true },
        { id: 'b', label: '−0,2', hint: L("Manfiy songa ko'paytirsak, miqdor manfiy bo'lib qoladi. Bir butundan nol butun ikki ketdi, qolgani nol butun sakkiz.", 'Умножить на отрицательное значит получить отрицательную величину. От целого ушло 0,2, осталось 0,8.', 'Multiplying by a negative would give a negative quantity. From the whole 0,2 left, 0,8 remains.') },
        { id: 'c', label: '1,2', hint: L("Bir butun ikki o'ndan bu O'SISH, kamayish emas.", 'Одна целая две десятых это РОСТ, а не уменьшение.', 'One point two is a RISE, not a fall.') },
        { id: 'd', label: '0,2', hint: L("Nol butun ikki bu qolgan qismi emas, ketgan qismi.", 'Нуль целых два это не остаток, а то, что ушло.', 'Zero point two is not what remains but what left.') },
      ],
    },
    {
      id: 't3', ask: true,
      prompt: L("100 so'm, yiliga 10 %. Ikki yildan keyin qancha?", '100 сум, 10 % в год. Сколько через два года?', '100 sum, 10 % a year. How much after two years?'),
      cols: 4,
      items: [
        { id: 'a', label: '121', correct: true },
        { id: 'b', label: '120', hint: L("Ikkinchi yil foiz bir yuz o'nga hisoblanadi, yuzga emas. Shuning uchun bir yuz yigirma bir.", 'На второй год процент считается со ста десяти, а не со ста. Поэтому сто двадцать один.', 'In the second year the percent is taken from one hundred ten, not one hundred. Hence one hundred twenty one.') },
        { id: 'c', label: '110', hint: L("Bu bir yildan keyin.", 'Это через один год.', 'That is after one year.') },
        { id: 'd', label: '200', hint: L("O'n foiz bu ikki barobar emas.", 'Десять процентов это не вдвое.', 'Ten percent is not double.') },
      ],
    },
  ],
  holds: [4500, 8000, 8000, 6000, 6000, 5500],
  audio: [
    A('mount', 'Uch narsani tiklaymiz. Bu baho emas.', 'Восстановим три вещи. Это не оценка.', 'Let us restore three things. This is not graded.'),
    A('c1', "Birinchi tayanch, va bugun eng muhimi. Foiz bu ko'paytirish. O'n to'rt foiz o'sish degani bir butun o'n to'rtga ko'paytirish: butun qoladi, ustiga o'n to'rt yuzdan qo'shiladi. Yigirma foiz kamayish esa nol butun sakkizga ko'paytirish.", 'Первая опора, и сегодня она главная. Процент это умножение. Рост на четырнадцать процентов это умножить на одну целую четырнадцать сотых: целое остаётся, сверху добавляется четырнадцать сотых. А уменьшение на двадцать процентов это умножить на нуль целых восемь.', 'First basic, and today the main one. A percent is a multiplication. A fourteen percent rise means multiplying by one point one four: the whole stays and fourteen hundredths are added on top. A twenty percent fall means multiplying by zero point eight.'),
    A('c2', "Ikkinchi tayanch. Har yil ko'paytiruvchi yana bir marta ishlaydi. Ikkinchi yili foiz birinchi yilgi foizga ham hisoblanadi, shuning uchun ikki emas, daraja.", 'Вторая опора. Каждый год множитель работает ещё раз. На второй год процент начисляется и на процент первого года, поэтому не двойка, а степень.', 'Second basic. Each year the multiplier works once more. In the second year the percent is charged on the first year percent as well, so it is a power, not a doubling.'),
    A('c3', "Uchinchi tayanch. Bizdan yillar soni so'ralyapti, u esa ko'rsatkichda o'tiradi. Blokda logarifm aynan shuning uchun bor.", 'Третья опора. У нас спрашивают число лет, а оно сидит в показателе. Логарифм в блоке именно поэтому и есть.', 'Third basic. We are asked for the number of years, and it sits in the exponent. That is exactly why the block has logarithms.'),
    A('recap', "Qisqacha: foiz bu ko'paytirish, har yil yana bir marta, va noma'lum ko'rsatkichda.", 'Коротко: процент это умножение, каждый год ещё раз, и неизвестное в показателе.', 'Briefly: a percent is a multiplication, each year once more, and the unknown is in the exponent.'),
    A('tasks', "Endi uchta qisqa topshiriq.", 'Теперь три коротких задания.', 'Now three short tasks.'),
  ],
}

// ============================================================
// SLAYD 3. Bahsni JADVAL hal qiladi.
// ============================================================
const S3 = {
  role: 'points',
  led: 'student',
  tag: 'check_by_point',
  eyebrow: L('Jadval bilan tekshiramiz', 'Проверим по таблице', 'Let us check against the table'),
  title: L('Bahsni hisob hal qiladi', 'Спор решает счёт', 'Calculation settles it'),
  expr: '100 000 000 · 1,14ⁿ = 148 154 400',
  goal: L('148 154 400 chiqishi kerak', 'должно получиться 148 154 400', 'we must get 148 154 400'),
  rule: L(
    "Yillar sonini qo'yamiz va hisobning natijasini hisobdagi son bilan solishtiramiz. Mos kelsa — javob shu.",
    'Подставляем число лет и сравниваем результат с тем, что оказалось на счёте. Совпало — это и есть ответ.',
    'We substitute the number of years and compare the result with what ended up in the account. If it matches, that is the answer.',
  ),
  pick: L('Qaysi yilni tekshiramiz?', 'Какой срок проверим?', 'Which term shall we check?'),
  claims: [
    { id: 'a', key: 'inA', name: L('birinchi yechim', 'первое решение', 'first solution'), value: L('3 yil', '3 года', '3 years') },
    { id: 'b', key: 'inB', name: L('ikkinchi yechim', 'второе решение', 'second solution'), value: L('4 yil', '4 года', '4 years') },
  ],
  axis: AXIS_1,
  sets: [],
  points: [
    {
      id: 'p3', label: 'n = 3', num: '3', mark: 3, step: 'calc', verdict: 'in',
      role: L('birinchi javob', 'первый ответ', 'the first answer'),
      calc: '1,14³ = 1,481544  →  148 154 400',
      sol: true, inA: true, inB: false,
    },
    {
      id: 'p4', label: 'n = 4', num: '4', mark: 4, step: 'calc', verdict: 'out',
      role: L('ikkinchi javob', 'второй ответ', 'the second answer'),
      calc: '1,14⁴ = 1,68896016  →  168 896 016',
      sol: false, inA: false, inB: true,
    },
    {
      id: 'p2', label: 'n = 2', num: '2', mark: 2, step: 'calc', verdict: 'out',
      role: L('nazorat uchun', 'для контроля', 'as a control'),
      calc: '1,14² = 1,2996  →  129 960 000',
      sol: false, inA: false, inB: false,
    },
  ],
  probe: {
    question: L("Qaysi javob to'g'ri?", 'Какой ответ верный?', 'Which answer is correct?'),
    items: [
      {
        id: 'a', label: L('3 yil', '3 года', '3 years'), correct: true,
        ok: L("To'g'ri. Uch yilda aynan hisobdagi son chiqdi, to'rt yilda esa ortiqcha.", 'Верно. За три года получилось ровно то, что на счёте, а за четыре уже больше.', 'Correct. Three years gives exactly what is in the account, four years gives more.'),
      },
      {
        id: 'b', label: L('4 yil', '4 года', '4 years'),
        hint: L("To'rt yilni jadvaldan qarang: bir yuz oltmish sakkiz million chiqadi, hisobda esa bir yuz qirq sakkiz million. Ortiqcha.", 'Посмотри четыре года по таблице: получается сто шестьдесят восемь миллионов, а на счёте сто сорок восемь. Больше, чем нужно.', 'Look at four years in the table: you get one hundred sixty eight million, while the account has one hundred forty eight. That is too much.'),
      },
    ],
  },
  holds: [2500, 9000, 5000, 2500, 11000, 4500],
  audio: [
    A('mount', 'Tayanch tiklandi. Bahsga qaytamiz.', 'Опора восстановлена. Вернёмся к спору.', 'The basics are back. Let us return to the argument.'),
    A('mount', "Yozuv tayyor: yuz million karra bir butun o'n to'rt darajada n, va bu hisobdagi songa teng bo'lishi kerak.", 'Запись готова: сто миллионов умножить на одну целую четырнадцать в степени эн, и это должно равняться числу на счёте.', 'The record is ready: one hundred million times one point one four to the power n, and that must equal the number in the account.'),
    A('mount', "Yillar sonini tanlang. Darajalar jadvali ekranda: uni hisoblamaymiz, o'qiymiz.", 'Выбери число лет. Таблица степеней на экране: мы её не считаем, а читаем.', 'Pick the number of years. The table of powers is on the screen: we do not compute it, we read it.'),
    A('calc', 'Hisoblaymiz va hisobdagi son bilan solishtiramiz.', 'Считаем и сравниваем с числом на счёте.', 'We compute and compare with the number in the account.'),
    A('mark', "Uch qiymat tekshirildi. Ikki yilda bir yuz yigirma to'qqiz million, kam. Uch yilda aynan bir yuz qirq sakkiz million bir yuz ellik to'rt ming to'rt yuz. To'rt yilda esa bir yuz oltmish sakkiz million, ortiqcha.", 'Три значения проверены. За два года сто двадцать девять миллионов, мало. За три года ровно сто сорок восемь миллионов сто пятьдесят четыре тысячи четыреста. А за четыре сто шестьдесят восемь миллионов, много.', 'Three values checked. Two years gives one hundred twenty nine million, too little. Three years gives exactly one hundred forty eight million one hundred fifty four thousand four hundred. Four years gives one hundred sixty eight million, too much.'),
    A('next', 'Hisob bahsni hal qildi. Qaysi javob to\'g\'ri?', 'Счёт решил спор. Какой ответ верный?', 'The calculation settled the argument. Which answer is correct?'),
  ],
}

// ============================================================
// SLAYD 4. GRAFIK: o'sish tez, va kesishish bitta.
// ============================================================
const POW114 = (x) => Math.pow(1.14, x)

const S4 = {
  role: 'graph',
  tag: 'word_model',
  drag: false,
  eyebrow: L('Nega javob bitta', 'Почему ответ один', 'Why the answer is unique'),
  title: L('O\'sish tez va bir tomonlama', 'Рост быстрый и односторонний', 'The growth is fast and one-way'),
  chip: 'y = 1,14ˣ',
  graph: {
    fn: POW114,
    xDomain: [0, 6],
    yDomain: [0.9, 2.2],
    hline: 1.481544,
    cross: 3,
    drop: true,
    dropLabel: 'n = 3',
    xTicks: [{ v: 1 }, { v: 3 }, { v: 5 }],
    yTicks: [{ v: 1 }, { v: 1.481544, label: '1,4815' }, { v: 2 }],
    height: 168,
  },
  bonus: L(
    "Shuning uchun omonat, aholi va narx bir xil qonun bo'yicha o'sadi: teng vaqtda teng MARTA, teng miqdorga emas.",
    'Поэтому вклад, население и цены растут по одному закону: за равное время в равное ЧИСЛО РАЗ, а не на равную величину.',
    'That is why a deposit, a population and prices grow by the same law: over equal time by an equal NUMBER OF TIMES, not by an equal amount.',
  ),
  probe: {
    question: L('Nega javob bitta bo\'lishi kerak?', 'Почему ответ обязан быть один?', 'Why must the answer be unique?'),
    items: [
      { id: 'a', label: L("chiziq faqat yuqoriga boradi: har qiymat bir marta uchraydi", 'кривая идёт только вверх: каждое значение встречается один раз', 'the curve only goes up: each value occurs once'), correct: true },
      { id: 'b', label: L("chunki masalada bitta son so'ralgan", 'потому что в задаче спросили одно число', 'because the problem asked for one number'), hint: L("Savol javobni bitta qilmaydi. Sabab chiziqning o'zida.", 'Вопрос не делает ответ единственным. Причина в самой кривой.', 'The question does not make the answer unique. The reason is in the curve itself.') },
      { id: 'c', label: L("chunki yillar butun son", 'потому что годы целые', 'because years are whole numbers'), hint: L("Butunlik javobni yaxlitlaydi, lekin yagonaligini chiziq beradi.", 'Целость округляет ответ, но единственность даёт кривая.', 'Being whole rounds the answer, but uniqueness comes from the curve.') },
      { id: 'd', label: L('javob bitta bo\'lishi shart emas', 'ответ не обязан быть один', 'the answer need not be unique'), hint: L("Bu chiziqda shart: u pastga hech qachon qaytmaydi.", 'На этой кривой обязан: она никогда не возвращается вниз.', 'On this curve it must be: it never comes back down.') },
    ],
  },
  holds: [5000, 5500, 5000, 3000, 7000],
  audio: [
    A('mount', "Hisob javobni ko'rsatdi. Endi nega javob bitta ekanini ko'ramiz.", 'Счёт показал ответ. Теперь посмотрим, почему ответ один.', 'The calculation showed the answer. Now let us see why the answer is unique.'),
    A('curve', "Mana o'sish chizig'i. U tekis emas: har yil oldingisidan ko'proq qo'shiladi.", 'Вот кривая роста. Она не прямая: каждый год прибавляется больше, чем в предыдущий.', 'Here is the growth curve. It is not a straight line: each year adds more than the previous one.'),
    A('line', "Endi hisobdagi songa mos balandlikda to'g'ri chiziq. U chiziqni bir joyda kesib o'tadi.", 'Теперь прямая на высоте, отвечающей числу на счёте. Она пересекает кривую в одном месте.', 'Now a line at the height matching the number in the account. It crosses the curve in one place.'),
    A('drop', "Kesishishning o'qdagi soyasi uch. Bu javob.", 'Тень пересечения на оси это тройка. Это и есть ответ.', 'The shadow of the intersection on the axis is three. That is the answer.'),
    A('why', "Va nega u bitta. Chiziq faqat yuqoriga boradi, hech qachon pastga qaytmaydi. Demak har balandlikni u aynan bir marta kesib o'tadi.", 'И почему он один. Кривая идёт только вверх и никогда не возвращается вниз. Значит каждую высоту она пересекает ровно один раз.', 'And why it is unique. The curve only goes up and never comes back down. So it crosses each height exactly once.'),
  ],
}

// ============================================================
// SLAYD 5. QOIDA 1: MODEL. Darsning yuragi.
// ============================================================
const S5 = {
  role: 'rule',
  tag: 'word_model',
  waitFor: ['rule'],
  numbered: true,
  pulseRow: 1,
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Shartdan yozuvga', 'От условия к записи', 'From words to a record'),
  rows: [
    L('bor edi 100, yiliga 14 %', 'было 100, ставка 14 % в год', 'there were 100, the rate is 14 % a year'),
    L('bir yilda:  100 · 1,14', 'за год:  100 · 1,14', 'in a year:  100 · 1,14'),
    L('n yilda:  100 · 1,14ⁿ', 'за n лет:  100 · 1,14ⁿ', 'in n years:  100 · 1,14ⁿ'),
  ],
  probe: {
    question: L(
      "Qaysi yozuv shartga mos keladi?",
      'Какая запись отвечает условию?',
      'Which record matches the problem?',
    ),
    items: [
      { id: 'a', label: '100 · 1,14ⁿ = 148,1544', correct: true },
      {
        id: 'b', label: '100 + 14n = 148,1544',
        hint: L(
          "Bu chiziqli o'sish. Shu yozuv bo'yicha ikki yilda 128 chiqadi, bank esa 129,96 beradi: ikkinchi yil foiz birinchi foizga ham hisoblanadi.",
          'Это линейный рост. По этой записи за два года выйдет 128, а банк даёт 129,96: на второй год процент идёт и на первый процент.',
          'That is linear growth. By this record two years give 128, while the bank gives 129,96: in the second year the percent applies to the first percent too.',
        ),
      },
      {
        id: 'c', label: '100 · 14ⁿ = 148,1544',
        hint: L(
          "O'n to'rtga ko'paytirsak, bir yilda pul o'n to'rt barobar oshadi. Foiz esa ko'paytiruvchining ustiga qo'shiladi: bir butun o'n to'rt.",
          'Умножение на четырнадцать увеличило бы вклад в четырнадцать раз за год. Процент же добавляется к множителю: одна целая четырнадцать.',
          'Multiplying by fourteen would grow the deposit fourteen times in a year. A percent is added to the multiplier: one point one four.',
        ),
      },
      {
        id: 'd', label: '100 · 1,14 · n = 148,1544',
        hint: L(
          "Bu ham chiziqli: ko'paytiruvchi bir marta ishlagan va keyin n ga ko'paytirilgan. Har yil u QAYTA ishlashi kerak, ya'ni daraja.",
          'Это тоже линейно: множитель сработал один раз, а потом умножили на n. Он должен срабатывать КАЖДЫЙ год, то есть степень.',
          'That is linear too: the multiplier worked once and then was multiplied by n. It must work EVERY year, that is a power.',
        ),
      },
    ],
  },
  rule: {
    badge: L('1-qoida. Foiz bu ko\'paytirish', 'Правило 1. Процент это умножение', 'Rule 1. A percent is a multiplication'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: L('bo\'ldi = bor edi · kⁿ', 'стало = было · kⁿ', 'result = start · kⁿ'),
    lines: [
      L("o'sish p foiz  →  k = 1 + p/100", 'рост на p процентов  →  k = 1 + p/100', 'a rise of p percent  →  k = 1 + p/100'),
      L('kamayish p foiz  →  k = 1 − p/100', 'падение на p процентов  →  k = 1 − p/100', 'a fall of p percent  →  k = 1 − p/100'),
      L("n davr  →  ko'paytiruvchi n marta, ya'ni kⁿ", 'n периодов  →  множитель n раз, то есть kⁿ', 'n periods  →  the multiplier n times, that is kⁿ'),
      L("qo'shish EMAS: ikkinchi yil foiz birinchi foizga ham tushadi", 'НЕ сложение: на второй год процент идёт и на первый процент', 'NOT addition: in the second year the percent applies to the first percent too'),
    ],
    example: L('misol:  100 · 1,14ⁿ = 148,1544  →  n = 3', 'пример:  100 · 1,14ⁿ = 148,1544  →  n = 3', 'example:  100 · 1,14ⁿ = 148,1544  →  n = 3'),
  },
  holds: [4500, 4000, 5500],
  audio: [
    A('mount', "Chizmani ko'rdik. Endi eng muhimi: shartni yozuvga qanday aylantirish kerak.", 'Чертёж мы увидели. Теперь самое важное: как перевести условие в запись.', 'We have seen the drawing. Now the main thing: how to turn the problem into a record.'),
    A('year', "Bir yilda pul bir butun o'n to'rtga ko'payadi.", 'За один год сумма умножается на одну целую четырнадцать.', 'In one year the sum is multiplied by one point one four.'),
    A('n', "n yilda esa ko'paytiruvchi n marta ishlaydi, ya'ni daraja paydo bo'ladi.", 'А за n лет множитель срабатывает n раз, то есть появляется степень.', 'And in n years the multiplier works n times, so a power appears.'),
    A('rule', "To'g'ri. Foiz bu ko'paytirish, qo'shish emas. Aynan shu joyda imtihonda eng ko'p ball yo'qoladi.", 'Верно. Процент это умножение, а не прибавление. Именно здесь на экзамене теряют больше всего баллов.', 'Correct. A percent is a multiplication, not an addition. This is exactly where most exam marks are lost.'),
  ],
}

// ============================================================
// SLAYD 6. YANGI HOLAT: kamayish.
// ============================================================
const S6 = {
  role: 'newcase',
  tag: 'word_model',
  waitFor: ['q2'],
  eyebrow: L('Yangi holat', 'Новый случай', 'A new case'),
  title: L('Endi kamayadi', 'Теперь убывает', 'Now it decreases'),
  was: {
    label: UI.was,
    expr: L('omonat: har yil × 1,14', 'вклад: каждый год × 1,14', 'deposit: each year × 1,14'),
  },
  now: {
    label: UI.now,
    expr: L('modda: har davrda × 0,5,  qoldi 1/8', 'вещество: каждый период × 0,5, осталась 1/8', 'substance: each period × 0,5, one eighth left'),
  },
  probe1: {
    question: L('Ikkinchi shart birinchisidan nimasi bilan farq qiladi?', 'Чем второе условие отличается от первого?', 'How does the second problem differ from the first?'),
    items: [
      { id: 'a', label: L("ko'paytiruvchi birdan kichik: miqdor kamayadi", 'множитель меньше единицы: величина убывает', 'the multiplier is less than one: the quantity decreases'), correct: true },
      { id: 'b', label: L("boshlang'ich miqdor berilmagan", 'не дано начальное количество', 'the starting amount is not given'), hint: L("Berilmagani to'g'ri, lekin u kerak ham emas: bizdan ULUSH so'ralyapti.", 'Верно, не дано, но оно и не нужно: спрашивают ДОЛЮ.', 'True, it is not given, but it is not needed: we are asked for a FRACTION.') },
      { id: 'c', label: L('davr yil emas', 'период не год', 'the period is not a year'), hint: L("Davr nomi ahamiyatsiz. Muhimi ko'paytiruvchi.", 'Название периода неважно. Важен множитель.', 'The name of the period does not matter. The multiplier does.') },
      { id: 'd', label: L('daraja yo\'q', 'нет степени', 'there is no power'), hint: L("Daraja bor: har davrda ko'paytiruvchi yana ishlaydi.", 'Степень есть: каждый период множитель срабатывает снова.', 'There is a power: each period the multiplier works again.') },
    ],
  },
  probe2: {
    question: L('Nechta davr o\'tdi?', 'Сколько прошло периодов?', 'How many periods passed?'),
    afterPredict: L('Taxminingiz yozib olindi.', 'Твоя догадка записана.', 'Your guess is saved.'),
    items: [
      { id: 'a', label: '3' },
      { id: 'b', label: '4' },
      { id: 'c', label: '8' },
      { id: 'd', label: '2' },
    ],
  },
  holds: [4500, 7000, 3500, 3000],
  audio: [
    A('mount', "Birinchi qoida tayyor. Endi shu qoida teskari tomonga ishlaydi.", 'Первое правило готово. Теперь то же правило работает в обратную сторону.', 'The first rule is ready. Now the same rule works the other way.'),
    A('now', "Radioaktiv modda har yarim yemirilish davrida ikki barobar kamayadi, ya'ni nol butun beshga ko'payadi. Moddaning sakkizdan bir qismi qoldi.", 'Радиоактивное вещество за каждый период полураспада уменьшается вдвое, то есть умножается на нуль целых пять. Осталась одна восьмая вещества.', 'A radioactive substance halves every half-life period, that is, it is multiplied by zero point five. One eighth of the substance is left.'),
    A('q1', 'Bu shart oldingisidan nimasi bilan farq qiladi?', 'Чем это условие отличается от прежнего?', 'How does this problem differ from the previous one?'),
    A('q2', "Sizningcha nechta davr o'tdi? Shunchaki taxmin qiling.", 'Как думаешь, сколько прошло периодов? Просто предположи.', 'How many periods do you think passed? Just make a guess.'),
  ],
}

// ============================================================
// SLAYD 7. IKKI NOMZOD: ko'paytiruvchi 0,5 va −0,5.
// ============================================================
const S7 = {
  role: 'twoway',
  tag: 'word_model',
  eyebrow: L('Ikki yozuvni tekshiramiz', 'Проверим две записи', 'Let us check two records'),
  title: L('Qaysi ko\'paytiruvchi', 'Какой множитель', 'Which multiplier'),
  expr: L('ikki barobar kamayish — qanday yoziladi?', 'уменьшение вдвое — как записать?', 'halving — how is it written?'),
  need: L('qoldi 1/8', 'осталась 1/8', 'one eighth left'),
  answerLabel: L('birinchi yozuv', 'первая запись', 'the first record'),
  cards: [
    {
      tag: L('A yozuv', 'запись A', 'record A'),
      txt: '(0,5)ⁿ = 1/8',
      point: {
        label: L('n = 3 da', 'при n = 3', 'at n = 3'),
        calc: '(0,5)³ = 0,125 = 1/8 ✓',
        verdict: 'in',
      },
    },
    {
      tag: L('B yozuv', 'запись B', 'record B'),
      txt: '(−0,5)ⁿ = 1/8',
      point: {
        label: L('n = 3 da', 'при n = 3', 'at n = 3'),
        calc: L('(−0,5)³ = −0,125 — manfiy modda yo\'q', '(−0,5)³ = −0,125 — отрицательного вещества не бывает', '(−0,5)³ = −0,125 — there is no negative substance'),
        verdict: 'out',
      },
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['2', '3', '4', '8'],
    value: ['3'],
    prompt: L('Nechta davr?', 'Сколько периодов?', 'How many periods?'),
    wrongs: [
      { key: '4', hint: L("To'rt davrda o'n oltidan bir qoladi, sakkizdan bir emas.", 'За четыре периода останется одна шестнадцатая, а не одна восьмая.', 'Four periods leave one sixteenth, not one eighth.') },
      { key: '8', hint: L("Sakkiz bu maxraj, davrlar soni emas. Nol butun beshni necha marta ko'paytirsak sakkizdan bir chiqadi?", 'Восемь это знаменатель, а не число периодов. Сколько раз умножить на нуль целых пять, чтобы вышла одна восьмая?', 'Eight is the denominator, not the number of periods. How many times do we multiply by zero point five to get one eighth?') },
      { key: '*', hint: L("Nol butun beshning kubi bu sakkizdan bir.", 'Нуль целых пять в кубе это одна восьмая.', 'Zero point five cubed is one eighth.') },
    ],
  },
  holds: [3000, 7000, 7000, 4500],
  audio: [
    A('mount', 'Siz taxmin qildingiz. Endi ikki yozuvni tekshiramiz.', 'Прогноз есть. Проверим две записи.', 'You made a guess. Let us check two records.'),
    A('p1', "Birinchi yozuv: nol butun besh darajada n. Uchinchi darajada bu nol butun bir yuz yigirma besh, ya'ni sakkizdan bir. Mos keladi.", 'Первая запись: нуль целых пять в степени эн. В третьей степени это нуль целых сто двадцать пять тысячных, то есть одна восьмая. Подходит.', 'The first record: zero point five to the power n. Cubed it is zero point one two five, that is one eighth. It fits.'),
    A('p2', "Ikkinchi yozuv: minus nol butun besh. Uchinchi darajada u manfiy chiqadi, manfiy modda esa bo'lmaydi. Kamayish minus bilan emas, BIRDAN KICHIK ko'paytiruvchi bilan yoziladi.", 'Вторая запись: минус нуль целых пять. В третьей степени она даёт отрицательное, а отрицательного вещества не бывает. Уменьшение записывается не минусом, а множителем МЕНЬШЕ единицы.', 'The second record: minus zero point five. Cubed it gives a negative, and there is no negative substance. A decrease is written not with a minus but with a multiplier LESS than one.'),
    A('write', "Demak yozuv birinchisi. Nechta davr o'tganini yozing.", 'Значит запись первая. Запиши, сколько прошло периодов.', 'So the first record is right. Write how many periods passed.'),
  ],
}

// ============================================================
// SLAYD 8. QOIDA 2 va JAMLANMA.
// ============================================================
const S8 = {
  role: 'rule',
  tag: 'word_model',
  layout: 'stack',
  gateAt: 2,
  pulseRow: -1,
  waitFor: ['rule', 'both'],
  eyebrow: L('Qoida', 'Правило', 'The rule'),
  title: L('Uch qadam', 'Три шага', 'Three steps'),
  cases: [
    {
      label: L("o'sish", 'рост', 'growth'),
      text: L('k > 1,  masalan 1,14', 'k > 1, например 1,14', 'k > 1, for instance 1,14'),
      tone: 'graph',
    },
    {
      label: L('kamayish', 'убывание', 'decay'),
      text: L('0 < k < 1,  masalan 0,5', '0 < k < 1, например 0,5', '0 < k < 1, for instance 0,5'),
      tone: 'accent',
    },
  ],
  rows: [
    L('kamayish MINUS bilan emas', 'убывание пишется НЕ минусом', 'a decrease is not written with a minus'),
    L("balki birdan KICHIK ko'paytiruvchi bilan", 'а множителем МЕНЬШЕ единицы', 'but with a multiplier LESS than one'),
  ],
  probe: {
    question: L("Javobni qanday tekshirasiz?", 'Как проверить полученный ответ?', 'How do you check the answer you got?'),
    items: [
      { id: 'a', label: L("ko'paytiruvchini o'sha marta ko'paytirib, shart bilan solishtirish", 'умножить множитель столько же раз и сравнить с условием', 'multiply the multiplier that many times and compare with the problem'), correct: true },
      { id: 'b', label: L("javobni qayta hisoblash", 'посчитать ответ ещё раз', 'compute the answer again'), hint: L("O'sha usul o'sha xatoni takrorlaydi. Tekshiruv mustaqil bo'lishi kerak.", 'Тот же способ повторит ту же ошибку. Проверка должна быть независимой.', 'The same way repeats the same mistake. A check must be independent.') },
      { id: 'c', label: L("javob butun son ekaniga qarash", 'посмотреть, что ответ целый', 'check that the answer is a whole number'), hint: L("Butunlik yaxshi belgi, lekin isbot emas: xato model ham butun son berishi mumkin.", 'Целость хороший признак, но не доказательство: неверная модель тоже может дать целое.', 'Being whole is a good sign but not a proof: a wrong model can give a whole number too.') },
      { id: 'd', label: L('tekshirish shart emas', 'проверять не нужно', 'no check is needed'), hint: L("Aynan bu turdagi masalada model xato bo'lsa, hamma qolgan amal to'g'ri bo'ladi va xato ko'rinmaydi.", 'Именно в таких задачах при неверной модели все остальные действия верны, и ошибка не видна.', 'In exactly this kind of problem a wrong model leaves all other steps correct, and the error is invisible.') },
    ],
  },
  rule: {
    badge: L('2-qoida. Kamayish', 'Правило 2. Убывание', 'Rule 2. Decay'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: '0 < k < 1',
    lines: [
      L("kamayish minus bilan emas, kichik ko'paytiruvchi bilan", 'убывание не минусом, а маленьким множителем', 'a decrease is a small multiplier, not a minus'),
      L('ikki barobar kamayish  →  k = 0,5', 'уменьшение вдвое  →  k = 0,5', 'halving  →  k = 0,5'),
      L('20 foizga kamayish  →  k = 0,8', 'уменьшение на 20 процентов  →  k = 0,8', 'a 20 percent fall  →  k = 0,8'),
      L("miqdor manfiy bo'lolmaydi — bu tekshiruvning o'zi", 'величина не может стать отрицательной — это и есть проверка', 'a quantity cannot become negative — that is the check itself'),
    ],
    example: L('misol:  (0,5)ⁿ = 1/8  →  n = 3', 'пример:  (0,5)ⁿ = 1/8  →  n = 3', 'example:  (0,5)ⁿ = 1/8  →  n = 3'),
  },
  swap: {
    button: L('Bitta qoidaga yig\'ish', 'Собрать одно правило', 'Combine into one rule'),
    badge: L('Darsning bitta qoidasi', 'Одно правило урока', 'The one rule of this lesson'),
    lawLabel: L('Qonun', 'Закон', 'Law'),
    law: L('bo\'ldi = bor edi · kⁿ', 'стало = было · kⁿ', 'result = start · kⁿ'),
    lines: [
      L("1. foizdan ko'paytiruvchi yasa: k = 1 ± p/100", '1. переведи процент в множитель: k = 1 ± p/100', '1. turn the percent into a multiplier: k = 1 ± p/100'),
      L('2. tenglama tuz: bo\'ldi = bor edi · kⁿ', '2. составь уравнение: стало = было · kⁿ', '2. write the equation: result = start · kⁿ'),
      L("3. n ni top va SAVOLGA qayt: davrlarmi yoki soatlar", '3. найди n и вернись к ВОПРОСУ: периоды или часы', '3. find n and go back to the QUESTION: periods or hours'),
      L("4. ko'paytirib tekshir", '4. проверь умножением', '4. check by multiplying'),
    ],
  },
  holds: [4500, 5000, 3500, 5000],
  audio: [
    A('mount', "Ikki xil masala ko'rdik: biri o'sadi, ikkinchisi kamayadi.", 'Мы видели две задачи: одна растёт, другая убывает.', 'We have seen two problems: one grows, the other decays.'),
    A('rows', "Ikkalasida ham qoida bitta. Kamayish minus bilan emas, birdan kichik ko'paytiruvchi bilan yoziladi.", 'В обеих правило одно. Убывание записывается не минусом, а множителем меньше единицы.', 'In both the rule is the same. A decrease is written not with a minus but with a multiplier less than one.'),
    A('q', "Endi eng muhim savol: javobni qanday tekshirasiz?", 'Теперь самый важный вопрос: как проверить полученный ответ?', 'Now the most important question: how do you check the answer you got?'),
    A('rule', "To'g'ri. Ko'paytiruvchini o'sha marta ko'paytiring va shart bilan solishtiring. Bu mustaqil tekshiruv.", 'Верно. Умножь множитель столько же раз и сравни с условием. Это независимая проверка.', 'Correct. Multiply the multiplier that many times and compare with the problem. That is an independent check.'),
    A('both', 'Endi butun usulni bitta qoidaga yig\'ing.', 'А теперь собери весь способ в одно правило.', 'Now combine the whole method into one rule.'),
  ],
}

// ============================================================
// SLAYD 9. KO'PAYTIRUVCHINI O'ZI QO'YADI.
// ============================================================
const S9 = {
  role: 'sign',
  led: 'student',
  tag: 'word_model',
  eyebrow: L("O'zingiz qo'ying", 'Поставь сам', 'Place it yourself'),
  title: L('Ko\'paytiruvchini qo\'ying', 'Поставь множитель', 'Place the multiplier'),
  left: L('narx har yili 20 % ga tushadi', 'цена каждый год падает на 20 %', 'the price falls 20 % every year'),
  template: [L('narx · ', 'цена · ', 'price · '), { slot: 0 }, 'ⁿ'],
  signs: ['0,8', '1,2', '−0,2'],
  answer: '0,8',
  checkNote: L(
    'Tekshiruv: 100 dan yigirma foiz ketdi, qoldi 80, ya\'ni 100 karra nol butun sakkiz',
    'Проверка: от 100 ушло двадцать процентов, осталось 80, то есть 100 умножить на ноль целых восемь',
    'Check: twenty percent left 100, eighty remains, that is 100 times zero point eight',
  ),
  wrongs: [
    { key: '1,2', hint: L("Bir butun ikki o'ndan bu O'SISH. Narx tushyapti.", 'Одна целая две десятых это РОСТ. А цена падает.', 'One point two is a RISE. But the price falls.') },
    { key: '−0,2', hint: L("Manfiy songa ko'paytirsak, narx manfiy bo'lib qoladi. Kamayish kichik ko'paytiruvchi bilan yoziladi.", 'Умножение на отрицательное сделает цену отрицательной. Убывание записывается маленьким множителем.', 'Multiplying by a negative makes the price negative. A decrease is written with a small multiplier.') },
  ],
  probe: {
    question: L("Nega aynan shu son?", 'Почему именно это число?', 'Why exactly this number?'),
    items: [
      { id: 'a', label: L("butundan 20 foiz ketdi, 80 foiz qoldi", 'от целого ушло 20 процентов, осталось 80', '20 percent left the whole, 80 remains'), correct: true },
      { id: 'b', label: L("chunki 20 dan 100 kichik", 'потому что 20 меньше 100', 'because 20 is less than 100'), hint: L("Sonlarni solishtirish emas, ulushni hisoblash kerak.", 'Дело не в сравнении чисел, а в подсчёте доли.', 'It is not about comparing numbers but about computing the fraction.') },
      { id: 'c', label: L("shunday qabul qilingan", 'так принято', 'that is the convention'), hint: L("Bu kelishuv emas: nol butun sakkiz bu qolgan ULUSH.", 'Это не договорённость: нуль целых восемь это оставшаяся ДОЛЯ.', 'It is not a convention: zero point eight is the remaining FRACTION.') },
      { id: 'd', label: L("chunki narx tushyapti", 'потому что цена падает', 'because the price falls'), hint: L("To'g'ri, lekin bu javobning yarmi: nega aynan nol butun sakkiz?", 'Верно, но это половина ответа: почему именно нуль целых восемь?', 'True, but that is half the answer: why exactly zero point eight?') },
    ],
  },
  audio: [
    A('mount', 'Qoida yig\'ildi. Endi siz ishlaysiz.', 'Правило собрано. Теперь работаешь ты.', 'The rule is assembled. Now it is your turn.'),
    A('place', "Ko'paytiruvchini qo'ying.", 'Поставь множитель.', 'Place the multiplier.'),
    A('checked', "Bo'ldi. Endi ta'riflang: nega aynan shu son?", 'Получилось. Теперь сформулируй: почему именно это число?', 'Done. Now put it into words: why exactly this number?'),
  ],
}

// ============================================================
// SLAYD 10. BIRGALIKDA MASHQ.
// ============================================================
const ACTIONS_10 = [
  { id: 'mult', label: L("foizdan ko'paytiruvchi yasash", 'перевести процент в множитель', 'turn the percent into a multiplier') },
  { id: 'eq', label: L('tenglama tuzish', 'составить уравнение', 'write the equation') },
  { id: 'find', label: L('jadval bo\'yicha n ni topish', 'найти n по таблице', 'find n from the table') },
  { id: 'add', label: L("foizni qo'shish", 'прибавить процент', 'add the percent') },
]

const S10 = {
  role: 'chain',
  led: 'student',
  tag: 'word_model',
  noLine: true,
  eyebrow: L('Tahlil', 'Разбор', 'Worked solution'),
  title: L('Qadamba-qadam', 'Разбор по шагам', 'Step by step'),
  start: L(
    '100 000 000 so\'m, yiliga 16 %, bo\'ldi 181 063 936',
    '100 000 000 сум, 16 % в год, стало 181 063 936',
    '100 000 000 sum, 16 % a year, became 181 063 936',
  ),
  actions: ACTIONS_10,
  steps: [
    {
      action: 'mult',
      to: 'k = 1,16',
      wrongs: [
        {
          action: 'add',
          hint: L(
            "Qo'shish chiziqli o'sish beradi. Ikki yilda 132 emas, 134,56 chiqadi: ikkinchi yil foiz birinchi foizga ham tushadi.",
            'Прибавление даёт линейный рост. За два года выйдет не 132, а 134,56: на второй год процент идёт и на первый процент.',
            'Adding gives linear growth. Two years give not 132 but 134,56: in the second year the percent applies to the first percent too.',
          ),
        },
        { action: 'eq', hint: L("Avval ko'paytiruvchini toping, keyin tenglama tuzing.", 'Сначала найди множитель, потом составляй уравнение.', 'Find the multiplier first, then write the equation.') },
        { action: 'find', hint: L("Hali tenglama yo'q.", 'Уравнения ещё нет.', 'There is no equation yet.') },
      ],
    },
    {
      action: 'eq',
      to: '1,16ⁿ = 1,81063936',
      wrongs: [
        { action: 'mult', hint: L("Ko'paytiruvchi allaqachon topilgan.", 'Множитель уже найден.', 'The multiplier is already found.') },
        { action: 'add', hint: L("Foiz qo'shilmaydi, ko'paytiriladi.", 'Процент не прибавляется, а умножается.', 'A percent is not added, it multiplies.') },
        { action: 'find', hint: L("Avval tenglamani yozing.", 'Сначала запиши уравнение.', 'Write the equation first.') },
      ],
    },
    {
      action: 'find',
      to: 'n = 4',
      wrongs: [
        { action: 'mult', hint: L("Ko'paytiruvchi topilgan.", 'Множитель найден.', 'The multiplier is found.') },
        { action: 'eq', hint: L("Tenglama tuzilgan.", 'Уравнение составлено.', 'The equation is written.') },
        { action: 'add', hint: L("Foiz qo'shilmaydi.", 'Процент не прибавляется.', 'A percent is not added.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['2', '3', '4', '5'],
    value: ['4'],
    prompt: L('Necha yil?', 'Сколько лет?', 'How many years?'),
    wrongs: [
      { key: '3', hint: L("Uch yilda bir butun besh yuz olti chiqadi, bu kam.", 'За три года выйдет одна целая пятьсот шесть, этого мало.', 'Three years give one point five zero six, that is not enough.') },
      { key: '*', hint: L("Jadvalga qarang: qaysi darajada bir butun sakkiz yuz o'n chiqadi.", 'Смотри в таблицу: в какой степени получается одна целая восемьсот десять.', 'Look at the table: at which power you get one point eight one.') },
    ],
  },
  audio: [
    A('mount', 'Qoida sizniki. Endi shu masalani to\'liq o\'tamiz.', 'Правило сформулировано. Пройдём эту задачу целиком.', 'The rule is yours now. Let us go through this problem completely.'),
    A('start', "Yiliga o'n olti foiz. Nimadan boshlashni tanlang.", 'Шестнадцать процентов в год. Выбери, с чего начать.', 'Sixteen percent a year. Choose where to start.'),
    A('step4', 'Endi javobni yozing.', 'Теперь запиши ответ.', 'Now write the answer.'),
  ],
}

// ============================================================
// SLAYD 11. MUSTAQIL: javob SAVOLGA mos bo'lsin.
// ============================================================
const S11 = {
  role: 'chain',
  led: 'student',
  tag: 'check_by_point',
  noLine: true,
  solo: true,
  eyebrow: L('Mustaqil', 'Самостоятельно', 'On your own'),
  title: L('Savolga javob bering', 'Ответь на вопрос', 'Answer the question asked'),
  start: L(
    '80 g modda, yarim yemirilish davri 2 soat, qoldi 5 g. Necha SOAT o\'tdi?',
    '80 г вещества, период полураспада 2 часа, осталось 5 г. Сколько ЧАСОВ прошло?',
    '80 g of substance, half-life 2 hours, 5 g left. How many HOURS passed?',
  ),
  actions: ACTIONS_10,
  hint: L(
    "Avval nechta DAVR o'tganini toping, keyin uni ikkiga ko'paytiring: savol soatlar haqida.",
    'Сначала найди, сколько прошло ПЕРИОДОВ, потом умножь на два: вопрос про часы.',
    'First find how many PERIODS passed, then multiply by two: the question is about hours.',
  ),
  steps: [
    {
      action: 'mult',
      to: 'k = 0,5',
      wrongs: [
        { action: 'add', hint: L("Ikki barobar kamayish qo'shish emas.", 'Уменьшение вдвое это не прибавление.', 'Halving is not an addition.') },
        { action: 'eq', hint: L("Avval ko'paytiruvchi.", 'Сначала множитель.', 'The multiplier first.') },
        { action: 'find', hint: L("Hali tenglama yo'q.", 'Уравнения ещё нет.', 'There is no equation yet.') },
      ],
    },
    {
      action: 'eq',
      to: '(0,5)ⁿ = 5/80 = 1/16',
      wrongs: [
        { action: 'mult', hint: L("Ko'paytiruvchi topilgan.", 'Множитель найден.', 'The multiplier is found.') },
        { action: 'find', hint: L("Avval tenglamani yozing.", 'Сначала запиши уравнение.', 'Write the equation first.') },
        { action: 'add', hint: L("Bu yerda qo'shish yo'q.", 'Здесь нет прибавления.', 'There is no addition here.') },
      ],
    },
    {
      action: 'find',
      to: L('n = 4 davr', 'n = 4 периода', 'n = 4 periods'),
      wrongs: [
        { action: 'mult', hint: L("Ko'paytiruvchi topilgan.", 'Множитель найден.', 'The multiplier is found.') },
        { action: 'eq', hint: L("Tenglama tuzilgan.", 'Уравнение составлено.', 'The equation is written.') },
        { action: 'add', hint: L("Bu yerda qo'shish yo'q.", 'Здесь нет прибавления.', 'There is no addition here.') },
      ],
    },
  ],
  answer: {
    kind: 'value',
    numbers: ['2', '4', '8', '16'],
    value: ['8'],
    prompt: L('Necha SOAT?', 'Сколько ЧАСОВ?', 'How many HOURS?'),
    wrongs: [
      { key: '4', hint: L("To'rt bu DAVRLAR soni. Har davr ikki soat, demak savolga javob boshqa son.", 'Четыре это число ПЕРИОДОВ. Каждый период два часа, значит ответ на вопрос другой.', 'Four is the number of PERIODS. Each period is two hours, so the answer to the question is different.') },
      { key: '16', hint: L("O'n olti bu maxraj: sakson bo'lindi beshga. Davrlar soni to'rt.", 'Шестнадцать это знаменатель: восемьдесят делить на пять. Периодов четыре.', 'Sixteen is the denominator: eighty divided by five. There are four periods.') },
      { key: '*', hint: L("Davrlar soni ikkiga ko'paytiriladi: savol soatlar haqida.", 'Число периодов умножается на два: вопрос про часы.', 'The number of periods is multiplied by two: the question is about hours.') },
    ],
  },
  audio: [
    A('mount', "Endi to'liq mustaqil. Va diqqat: savolni oxirigacha o'qing.", 'Теперь полностью сам. И внимание: дочитай вопрос до конца.', 'Now completely on your own. And careful: read the question to the end.'),
    A('go', "Ko'paytiruvchini toping, tenglama tuzing, keyin savolga qayting.", 'Найди множитель, составь уравнение, потом вернись к вопросу.', 'Find the multiplier, write the equation, then go back to the question.'),
    A('answered', "Javobni yozing.", 'Запиши ответ.', 'Write the answer.'),
  ],
}

// ============================================================
// SLAYD 12. BLITS.
// ============================================================
const S12 = {
  role: 'blitz',
  led: 'student',
  eyebrow: L('Blits', 'Блиц', 'Quick round'),
  title: L('Olti savol', 'Шесть вопросов', 'Six questions'),
  items: [
    {
      id: 'b1', tag: 'word_model', ask: true, cols: 4,
      done: '+7 %  →  × 1,07',
      prompt: L("7 % o'sish — nechaga ko'paytiramiz?", 'Рост на 7 % — на что умножаем?', 'A 7 % rise — what do we multiply by?'),
      items: [
        { id: 'a', label: '1,07', correct: true },
        { id: 'b', label: '0,07', hint: L("Butun ham qoladi, shuning uchun bir butun nol yetti.", 'Целое ведь остаётся, поэтому одна целая ноль семь.', 'The whole stays, so one point zero seven.') },
        { id: 'c', label: '7', hint: L("Yettiga ko'paytirish bu yetti barobar oshish.", 'Умножить на семь значит увеличить в семь раз.', 'Multiplying by seven means seven times more.') },
        { id: 'd', label: '1,7', hint: L("Bu yetmish foiz.", 'Это семьдесят процентов.', 'That is seventy percent.') },
      ],
    },
    {
      id: 'b2', tag: 'word_model', ask: true, cols: 4,
      done: '200 000 · 1,1² = 242 000',
      prompt: L("200 000, yiliga 10 %. Ikki yildan keyin qancha?", '200 000, 10 % в год. Сколько через два года?', '200 000 at 10 % a year. How much after two years?'),
      items: [
        { id: 'a', label: '242 000', correct: true },
        { id: 'b', label: '240 000', hint: L("Ikkinchi yil foiz ikki yuz yigirma mingga hisoblanadi, ikki yuz mingga emas.", 'На второй год процент считается с двухсот двадцати тысяч, а не с двухсот.', 'In the second year the percent is taken from two hundred twenty thousand, not two hundred.') },
        { id: 'c', label: '220 000', hint: L("Bu bir yildan keyin.", 'Это через один год.', 'That is after one year.') },
        { id: 'd', label: '400 000', hint: L("O'n foiz bu ikki barobar emas.", 'Десять процентов это не вдвое.', 'Ten percent is not double.') },
      ],
    },
    {
      id: 'b3', tag: 'same_base', prompt: '(0,5)ⁿ = 1/32', cols: 4,
      items: [
        { id: 'a', label: 'n = 5', correct: true },
        { id: 'b', label: 'n = 4', hint: L("To'rtinchi darajada o'n oltidan bir chiqadi.", 'В четвёртой степени получается одна шестнадцатая.', 'The fourth power gives one sixteenth.') },
        { id: 'c', label: 'n = 32', hint: L("O'ttiz ikki bu maxraj, ko'rsatkich emas.", 'Тридцать два это знаменатель, а не показатель.', 'Thirty two is the denominator, not the exponent.') },
        { id: 'd', label: 'n = 6', hint: L("Oltinchi darajada oltmish to'rtdan bir chiqadi.", 'В шестой степени получается одна шестьдесят четвёртая.', 'The sixth power gives one sixty fourth.') },
      ],
    },
    {
      id: 'b4', tag: 'check_by_point', ask: true, cols: 1,
      done: L("tekshiruv: ko'paytiruvchini o'sha marta ko'paytirish", 'проверка: умножить множитель столько же раз', 'check: multiply the multiplier that many times'),
      prompt: L(
        "Siz n = 3 yil javobini oldingiz. Uni qanday tekshirasiz?",
        'Получился ответ n = 3 года. Как его проверить?',
        'You got the answer n = 3 years. How do you check it?',
      ),
      items: [
        { id: 'a', label: L("ko'paytiruvchini uch marta ko'paytirib, shart bilan solishtirish", 'умножить множитель три раза и сравнить с условием', 'multiply the multiplier three times and compare with the problem'), correct: true },
        { id: 'b', label: L("qayta hisoblash", 'посчитать заново', 'compute it again'), hint: L("O'sha usul o'sha xatoni takrorlaydi.", 'Тот же способ повторит ту же ошибку.', 'The same way repeats the same mistake.') },
        { id: 'c', label: L("javob butunligiga qarash", 'посмотреть, что ответ целый', 'check that the answer is whole'), hint: L("Xato model ham butun son berishi mumkin.", 'Неверная модель тоже может дать целое.', 'A wrong model can give a whole number too.') },
        { id: 'd', label: L('tekshirmaslik', 'не проверять', 'not to check'), hint: L("Aynan bunday masalada xato model ko'rinmaydi: qolgan amallar to'g'ri bo'ladi.", 'Именно в таких задачах неверная модель не видна: остальные действия верны.', 'In exactly such problems a wrong model is invisible: the other steps are correct.') },
      ],
    },
    {
      id: 'b5', tag: 'same_base', ask: true, cols: 2,
      done: L("ko'rsatkichni logarifm chiqaradi", 'показатель достаёт логарифм', 'the logarithm extracts the exponent'),
      prompt: L(
        "Noma'lum ko'rsatkichda o'tiribdi. Uni qaysi amal chiqaradi?",
        'Неизвестное сидит в показателе. Каким действием его достают?',
        'The unknown sits in the exponent. Which operation extracts it?',
      ),
      items: [
        { id: 'a', label: L('logarifm', 'логарифм', 'a logarithm'), correct: true },
        { id: 'b', label: L("bo'lish", 'деление', 'division'), hint: L("Bo'lish ko'paytiruvchini olib tashlaydi, ko'rsatkichni emas.", 'Деление убирает множитель, а не показатель.', 'Division removes a multiplier, not an exponent.') },
        { id: 'c', label: L('ildiz', 'корень', 'a root'), hint: L("Ildiz ASOSni chiqaradi, ko'rsatkichni emas.", 'Корень достаёт ОСНОВАНИЕ, а не показатель.', 'A root extracts the BASE, not the exponent.') },
        { id: 'd', label: L('ayirish', 'вычитание', 'subtraction'), hint: L("Ayirish qo'shiluvchini olib tashlaydi.", 'Вычитание убирает слагаемое.', 'Subtraction removes a term.') },
      ],
    },
    {
      id: 'b6', tag: 'word_model', ask: true, cols: 4,
      done: '−25 %  →  × 0,75',
      prompt: L("25 % kamayish — nechaga ko'paytiramiz?", 'Уменьшение на 25 % — на что умножаем?', 'A 25 % fall — what do we multiply by?'),
      items: [
        { id: 'a', label: '0,75', correct: true },
        { id: 'b', label: '−0,25', hint: L("Manfiy ko'paytiruvchi miqdorni manfiy qiladi.", 'Отрицательный множитель сделает величину отрицательной.', 'A negative multiplier makes the quantity negative.') },
        { id: 'c', label: '0,25', hint: L("Nol butun yigirma besh bu KETGAN qism, qolgani emas.", 'Нуль целых двадцать пять это то, что УШЛО, а не осталось.', 'Zero point two five is what LEFT, not what remains.') },
        { id: 'd', label: '1,25', hint: L("Bu o'sish.", 'Это рост.', 'That is growth.') },
      ],
    },
  ],
  audio: [
    A('mount', "Nima o'zlashganini tekshiramiz. Oltita tez savol, ular natijaga kiradi.", 'Проверим, что закрепилось. Шесть быстрых вопросов, они идут в результат.', 'Let us check what stuck. Six quick questions, they count towards the result.'),
    A('q2', 'Ikki yil, ya\'ni ikki marta.', 'Два года, то есть два раза.', 'Two years, that is twice.'),
    A('q3', 'Bu yerda tayyor tenglama.', 'Здесь готовое уравнение.', 'Here the equation is ready.'),
    A('q4', 'Tekshiruv haqida savol.', 'Вопрос про проверку.', 'A question about checking.'),
    A('q5', "Bu savol butun blok nima uchun kerak ekanini aytadi.", 'Этот вопрос про то, зачем вообще нужен весь блок.', 'This question is about why the whole block exists at all.'),
    A('q6', 'Oxirgi. Kamayish.', 'Последний. Уменьшение.', 'The last one. A decrease.'),
  ],
}

// ============================================================
// SLAYD 13. TIPIK XATO: chiziqli model.
// ============================================================
const S13 = {
  role: 'audit',
  led: 'student',
  tag: 'word_model',
  eyebrow: L('Xatoni toping', 'Найди ошибку', 'Find the error'),
  title: L("Qadamlar to'g'ri, model xato", 'Шаги верны, модель нет', 'Steps right, model wrong'),
  rows: [
    { id: 'r1', text: L('bor edi 100, bo\'ldi 148,1544, stavka 14 %', 'было 100, стало 148,1544, ставка 14 %', 'was 100, became 148,1544, rate 14 %') },
    { id: 'r2', text: '100 + 14n = 148,1544' },
    { id: 'r3', text: '14n = 48,1544' },
    { id: 'r4', text: 'n ≈ 3,44' },
    { id: 'r5', text: L('javob: 3 yil 5 oy', 'ответ: 3 года 5 месяцев', 'answer: 3 years 5 months') },
  ],
  answerId: 'r2',
  hints: {
    r1: L("Bu shartning o'zi, unda xato bo'lishi mumkin emas.", 'Это само условие, ошибки в нём быть не может.', 'This is the problem itself, there can be no error in it.'),
    r3: L("2-satrdan bu to'g'ri kelib chiqadi. Xato oldin kelgan.", 'Из строки 2 это следует верно. Ошибка пришла раньше.', 'This follows correctly from line 2. The error came earlier.'),
    r4: L("Hisob to'g'ri bajarilgan. Xato hisobda emas.", 'Вычисление выполнено верно. Ошибка не в счёте.', 'The computation is correct. The error is not in the arithmetic.'),
    r5: L("Javob haqiqatan xato, lekin u ancha oldin xato bo'lgan.", 'Ответ действительно неверный, но неверным он стал намного раньше.', 'The answer is indeed wrong, but it became wrong much earlier.'),
  },
  proofPoint: L('ikki yil', 'два года', 'two years'),
  proof: L(
    "Bu yozuv bo'yicha ikki yilda 128 chiqadi. Bank esa 129,96 beradi: ikkinchi yil foiz birinchi yilgi foizga ham hisoblanadi. Foiz qo'shilmaydi, ko'paytiriladi",
    'По этой записи за два года выйдет 128. А банк даёт 129,96: на второй год процент начисляется и на процент первого года. Процент не прибавляется, а умножается',
    'By this record two years give 128. But the bank gives 129,96: in the second year the percent is charged on the first year percent too. A percent is not added, it multiplies',
  ),
  probe: {
    question: L('Qaysi qoida buzilgan?', 'Какое правило нарушено?', 'Which rule was broken?'),
    items: [
      { id: 'a', label: L("foiz ko'paytiriladi, qo'shilmaydi", 'процент умножается, а не прибавляется', 'a percent multiplies, it is not added'), correct: true },
      { id: 'b', label: L("hisobda xato", 'ошибка в вычислении', 'an arithmetic error'), hint: L("Hisob to'g'ri: qirq sakkiz bo'lingan o'n to'rtga haqiqatan uch butun qirq to'rt beradi.", 'Вычисление верно: сорок восемь делить на четырнадцать действительно даёт три и сорок четыре сотых.', 'The arithmetic is right: forty eight divided by fourteen really is three point four four.') },
      { id: 'c', label: L("javob butun bo'lishi kerak edi", 'ответ должен был быть целым', 'the answer had to be whole'), hint: L("Butunlik natija, sabab emas. Sabab modelda.", 'Целость это следствие, а не причина. Причина в модели.', 'Being whole is a consequence, not a cause. The cause is in the model.') },
      { id: 'd', label: L('stavka noto\'g\'ri o\'qilgan', 'ставка прочитана неверно', 'the rate was read incorrectly'), hint: L("Stavka to'g'ri: o'n to'rt foiz.", 'Ставка верна: четырнадцать процентов.', 'The rate is right: fourteen percent.') },
    ],
  },
  audio: [
    A('mount', 'Blits yopildi. Endi boshqaning yechimiga qaraymiz.', 'Блиц закрыт. Теперь посмотрим на чужое решение.', 'The quick round is done. Now let us look at someone else\'s solution.'),
    A('q1', "Bu yerda hamma hisob to'g'ri bajarilgan. Va shunga qaramay javob xato. Xato birinchi marta paydo bo'lgan satrni toping.", 'Здесь все вычисления выполнены верно. И всё же ответ неверный. Найди строку, в которой ошибка появилась впервые.', 'Here every computation is correct. And still the answer is wrong. Find the line where the error first appeared.'),
    A('proof', "Tekshiramiz. Bu yozuv bo'yicha ikki yilda bir yuz yigirma sakkiz chiqadi, bank esa bir yuz yigirma to'qqiz butun to'qson olti beradi. Farq kichik, lekin u har yili o'sadi.", 'Проверим. По этой записи за два года выйдет сто двадцать восемь, а банк даёт сто двадцать девять целых девяносто шесть. Разница маленькая, но она растёт с каждым годом.', 'Let us check. By this record two years give one hundred twenty eight, while the bank gives one hundred twenty nine point nine six. The difference is small, but it grows every year.'),
    A('q2', 'Qaysi qoida buzilgan?', 'Какое правило нарушено?', 'Which rule was broken?'),
  ],
}

// ============================================================
// SLAYD 14. TESKARI MASALA.
// ============================================================
const PARTS_14 = ['0,8ⁿ', '1,2ⁿ', '= 0,512', '= 1,728']

const S14 = {
  role: 'build',
  led: 'student',
  tag: 'word_model',
  right: '2/2',
  eyebrow: L("O'zingiz yig'ing", 'Собери сам', 'Build it yourself'),
  title: L('Shartdan tenglamaga', 'От условия к уравнению', 'From words to an equation'),
  axis: AXIS_3,
  marks: [{ v: 3, tone: 'graph' }],
  targetLabel: L('Ikkalasida ham javob', 'В обоих ответ', 'In both the answer is'),
  targetValue: 'n = 3',
  tasks: [
    {
      prompt: L(
        'Har yili 20 % ga kamaydi, 51,2 % qoldi',
        'Каждый год уменьшалось на 20 %, осталось 51,2 %',
        'It fell 20 % each year, 51,2 % remains',
      ),
      template: [{ slot: 0 }, ' ', { slot: 1 }],
      parts: PARTS_14,
      answer: ['0,8ⁿ', '= 0,512'],
      doneLabel: L('kamayish:  0,8ⁿ = 0,512', 'убывание: 0,8ⁿ = 0,512', 'decay: 0,8ⁿ = 0,512'),
      wrongs: [
        { key: '1,2ⁿ|= 0,512', hint: L("Bir butun ikki bu o'sish, natija esa birdan kichik. Mos kelmaydi.", 'Одна целая две это рост, а результат меньше единицы. Не сходится.', 'One point two is growth, but the result is less than one. It does not match.') },
        { key: '0,8ⁿ|= 1,728', hint: L("Kamayishda natija birdan kichik bo'lishi kerak.", 'При убывании результат должен быть меньше единицы.', 'In decay the result must be less than one.') },
        { key: '*', hint: L("20 foiz ketdi, 80 foiz qoldi: ko'paytiruvchi nol butun sakkiz.", 'Ушло 20 процентов, осталось 80: множитель нуль целых восемь.', '20 percent left, 80 remains: the multiplier is zero point eight.') },
      ],
    },
    {
      prompt: L(
        'Har yili 20 % ga o\'sdi, 172,8 % bo\'ldi',
        'Каждый год росло на 20 %, стало 172,8 %',
        'It grew 20 % each year, became 172,8 %',
      ),
      template: [{ slot: 0 }, ' ', { slot: 1 }],
      parts: PARTS_14,
      answer: ['1,2ⁿ', '= 1,728'],
      doneLabel: L("o'sish:  1,2ⁿ = 1,728", 'рост: 1,2ⁿ = 1,728', 'growth: 1,2ⁿ = 1,728'),
      wrongs: [
        { key: '0,8ⁿ|= 1,728', hint: L("Nol butun sakkiz bu kamayish, natija esa birdan katta.", 'Нуль целых восемь это убывание, а результат больше единицы.', 'Zero point eight is decay, but the result is greater than one.') },
        { key: '*', hint: L("20 foiz qo'shildi: ko'paytiruvchi bir butun ikki. Va e'tibor bering — javob yana uch.", 'Добавилось 20 процентов: множитель одна целая две. И обрати внимание — ответ снова три.', '20 percent was added: the multiplier is one point two. And notice — the answer is three again.') },
      ],
    },
  ],
  audio: [
    A('mount', 'Xato topildi. Oxirgi topshiriq teskari: shartdan tenglama yig\'ing.', 'Ошибка найдена. Последнее задание обратное: собери уравнение по условию.', 'The error is found. The last task is the reverse one: build the equation from the words.'),
    A('built1', "Endi o'sha foiz, lekin qarama-qarshi tomonga. Javob o'zgaradimi?", 'А теперь тот же процент, но в обратную сторону. Изменится ли ответ?', 'And now the same percent, but the other way. Will the answer change?'),
  ],
}

// ============================================================
// SLAYD 15. YAKUN.
// ============================================================
const S15 = {
  role: 'summary',
  tag: 'check_by_point',
  eyebrow: L('Yakun', 'Итог', 'Summary'),
  title: L("Nimani o'rgandingiz", 'Что нового на уроке', 'What you learned'),
  law: L('bo\'ldi = bor edi · kⁿ', 'стало = было · kⁿ', 'result = start · kⁿ'),
  ruleLines: [
    L("1. foizdan ko'paytiruvchi:  k = 1 ± p/100", '1. процент в множитель:  k = 1 ± p/100', '1. percent into a multiplier:  k = 1 ± p/100'),
    L('2. tenglama:  bo\'ldi = bor edi · kⁿ', '2. уравнение:  стало = было · kⁿ', '2. equation:  result = start · kⁿ'),
    L("3. n ni topib, SAVOLGA qayt va ko'paytirib tekshir", '3. найди n, вернись к ВОПРОСУ и проверь умножением', '3. find n, go back to the QUESTION and check by multiplying'),
  ],
  predicts: [
    {
      screen: 0,
      expr: L('omonat 14 %', 'вклад под 14 %', 'deposit at 14 %'),
      right: L('3 yil', '3 года', '3 years'),
      map: {
        a: L('3 yil', '3 года', '3 years'),
        b: L('4 yil', '4 года', '4 years'),
        both: '—',
        none: '—',
      },
    },
    {
      screen: 5,
      expr: L('qoldi 1/8', 'осталась 1/8', 'one eighth left'),
      right: '3',
      map: { a: '3', b: '4', c: '8', d: '2' },
    },
  ],
  backToHook: {
    label: L('Biz shundan boshlagan edik', 'С этого мы начали', 'This is where we started'),
    line: '100 · 1,14ⁿ = 148,1544   →   1,14³ = 1,481544   →   n = 3',
  },
  levels: {
    full: L('Bu turdagi masalalar DTM da siz uchun yopildi', 'Этот тип задач на ДТМ у тебя закрыт', 'This task type is covered for the exam'),
    one: L('Bitta joy takrorlashni talab qiladi', 'Одно место требует повтора', 'One spot needs review'),
    low: L('Model ekraniga qayting: foiz bu ko\'paytirish', 'Вернись к экрану с моделью: процент это умножение', 'Go back to the model screen: a percent is a multiplication'),
  },
  probe: {
    question: L('Masalada eng birinchi nima qilasiz?', 'Что делаешь в задаче в первую очередь?', 'What is the very first thing you do in a word problem?'),
    items: [
      { id: 'a', label: L("foizdan ko'paytiruvchi yasayman", 'перевожу процент в множитель', 'I turn the percent into a multiplier'), correct: true },
      { id: 'b', label: L("darrov hisoblayman", 'сразу считаю', 'I start computing at once'), hint: L("Nimani hisoblashni model belgilaydi. Avval model.", 'Что считать, определяет модель. Сначала модель.', 'What to compute is decided by the model. The model first.') },
      { id: 'c', label: L("javobni taxmin qilaman", 'угадываю ответ', 'I guess the answer'), hint: L("Taxmin darsning boshida foydali edi, javob esa yozuvdan chiqadi.", 'Догадка была полезна в начале урока, а ответ приходит из записи.', 'A guess was useful at the start of the lesson, but the answer comes from the record.') },
      { id: 'd', label: L('logarifm olaman', 'беру логарифм', 'I take a logarithm'), hint: L("Logarifm keyin kerak bo'ladi, tenglama tuzilgandan keyin.", 'Логарифм понадобится потом, когда уравнение уже составлено.', 'A logarithm comes later, once the equation is written.') },
    ],
  },
  sheetTitle: L('Masalalar · shpargalka', 'Задачи · шпаргалка', 'Word problems · cheat sheet'),
  sheetSrc: L('11-sinf · 14-dars', '11 класс · урок 14', 'Grade 11 · lesson 14'),
  lifehack: L(
    "10 sekundlik tekshiruv: ko'paytiruvchini javobdagi marta ko'paytiring va shartdagi son bilan solishtiring.",
    'Проверка за 10 секунд: умножь множитель столько раз, сколько получилось в ответе, и сравни с числом из условия.',
    'A 10-second check: multiply the multiplier as many times as your answer says and compare with the number from the problem.',
  ),
  holds: [2500, 8000, 4500, 4500],
  audio: [
    A('mount', 'Dars tugadi. Boshiga qaytamiz.', 'Урок закончен. Вернёмся к началу.', 'The lesson is over. Let us go back to the start.'),
    A('p1', "Mana taxminingiz va mana qanday chiqdi. Taxminda xato qilish normal edi, biz shuning uchun tekshirdik.", 'Вот твой прогноз и вот как оказалось. Ошибиться в догадке было нормально, именно поэтому мы проверяли.', 'Here is what you guessed and here is how it turned out. Being wrong in a guess was fine, that is exactly why we checked.'),
    A('rule', "Va mana masala, qaysidan boshladik. Butun qiyinchilik birinchi satrda edi: foizni ko'paytiruvchiga aylantirish.", 'А вот задача, с которой мы начали. Вся трудность была в первой строке: перевести процент в множитель.', 'And here is the problem we began with. The whole difficulty was in the first line: turning the percent into a multiplier.'),
    A('q', "Va eng muhimi: masalada birinchi qadam hisob emas, model.", 'И главное: первый шаг в задаче это не счёт, а модель.', 'And the main thing: the first step in a word problem is not computing but the model.'),
  ],
}

export default makeLesson({
  meta: META,
  block: BLOCK,
  voice: 'm', // 11-sinf: erkak ovoz
  screens: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15],
})
