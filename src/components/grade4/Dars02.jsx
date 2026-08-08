import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

// ============================================================================
// 4-SINF · Dars02 · Ko'p xonali sonlarni o'qish va yozish
// Local fallback contract: SCREEN_META is the Notion-ready skeleton;
// CONTENT is the complete RU/UZ and audio package.
// ============================================================================

const T = {
  bg: '#F5F5F0',
  ink: '#12212C',
  ink2: '#50616D',
  ink3: '#87949D',
  paper: '#FFFFFF',
  accent: '#FF5B35',
  accentSoft: '#FFF0EA',
  cyan: '#168FA3',
  cyanSoft: '#E5F5F6',
  navy: '#173B52',
  lime: '#95C93D',
  success: '#227A53',
  successSoft: '#E7F3EC',
  warn: '#A96F13',
  warnSoft: '#FFF5D9',
  shadowBase: '58, 53, 48',
};

const CONTENT = {
  s0: {
    eyebrow: { ru: 'Новая миссия', uz: 'Yangi missiya' },
    title: { ru: 'Голосовой адрес потерял структуру', uz: "Ovozli manzil tuzilishini yo'qotdi" },
    lead: {
      ru: 'Центр данных услышал адрес, но сохранил его как сплошную цепочку цифр. Нужно восстановить запись без потерь.',
      uz: "Ma'lumotlar markazi manzilni eshitdi, ammo uni uzluksiz raqamlar qatori sifatida saqladi. Yozuvni yo'qotishsiz tiklash kerak.",
    },
    instruction: { ru: 'Первый шаг: восстановить границу классов и сохранить каждое место.', uz: "Birinchi qadam: sinflar chegarasini tiklash va har bir o'rinni saqlash." },
    model: {
      kind: 'classes',
      badge: { ru: 'Голосовой код', uz: 'Ovozli kod' },
      number: '304 018',
      groups: [
        { value: '304', label: { ru: 'класс тысяч', uz: 'minglar sinfi' }, tone: 'cyan' },
        { value: '018', label: { ru: 'класс единиц', uz: 'birlar sinfi' }, tone: 'accent' },
      ],
    },
    options: [
      { ru: 'Разделить на классы и сохранить каждое место', uz: "Sinflarga ajratib, har bir o'rinni saqlash" },
      { ru: 'Записать цифры в порядке их звучания по одной', uz: "Raqamlarni eshitilgan tartibda bittadan yozish" },
      { ru: 'Убрать нули, потому что они не звучат отдельно', uz: "Nollar alohida aytilmagani uchun ularni olib tashlash" },
      { ru: 'Поменять группы местами и затем прочитать', uz: "Guruhlarni almashtirib, keyin o'qish" },
    ],
    correctIndex: 0,
    correctText: {
      ru: 'Классы сохраняют порядок всех шести разрядов. Так внутренние нули остаются на своих местах.',
      uz: "Sinflar oltita xonaning tartibini saqlaydi. Shunda ichki nollar o'z o'rnida qoladi.",
    },
    wrong: [
      null,
      { ru: 'Названия десятков и сотен нельзя превращать в отдельные цифры. Сначала выдели классы.', uz: "O'nlik va yuzlik nomlarini alohida raqamlarga aylantirib bo'lmaydi. Avval sinflarni ajrating." },
      { ru: 'Ноль удерживает пустой разряд. Если его убрать, значение соседних цифр изменится.', uz: "Nol bo'sh xonani saqlaydi. Uni olib tashlasak, qo'shni raqamlarning qiymati o'zgaradi." },
      { ru: 'Перестановка классов изменит адрес. Сохрани порядок слева направо.', uz: "Sinflarni almashtirish manzilni o'zgartiradi. Chapdan o'ngga tartibni saqlang." },
    ],
    audio: {
      intro: {
        ru: [
          'Центр данных получил новый голосовой адрес. Система услышала триста четыре тысячи восемнадцать, но не знает, как надёжно записать число.',
          'Сначала разделим код на классы. Так порядок разрядов сохранится, а нули не исчезнут.',
        ],
        uz: [
          "Ma'lumotlar markazi yangi ovozli manzil oldi. Tizim uch yuz to'rt ming o'n sakkiz sonini eshitdi, ammo uni ishonchli yozishni bilmayapti.",
          "Avval kodni sinflarga ajratamiz. Shunda xonalar tartibi saqlanadi va nollar yo'qolmaydi.",
        ],
      },
      on_correct: {
        ru: 'Деление на классы сохраняет каждое место и помогает записать число без потерь.',
        uz: "Sinflarga ajratish har bir o'rinni saqlaydi va sonni yo'qotishsiz yozishga yordam beradi.",
      },
      on_wrong: [
        null,
        { ru: 'Сначала отдели класс тысяч от класса единиц. Так названия разрядов не смешаются.', uz: "Avval minglar sinfini birlar sinfidan ajrating. Shunda xona nomlari aralashmaydi." },
        { ru: 'Ноль показывает пустой разряд. Его нужно сохранить в записи.', uz: "Nol bo'sh xonani ko'rsatadi. Uni yozuvda saqlash kerak." },
        { ru: 'Классы читаются и записываются слева направо. Их порядок менять нельзя.', uz: "Sinflar chapdan o'ngga o'qiladi va yoziladi. Ularning tartibini almashtirib bo'lmaydi." },
      ],
    },
  },
  s1: {
    eyebrow: { ru: 'Диагностика', uz: 'Diagnostika' },
    title: { ru: 'Знакомый порядок разрядов', uz: 'Tanish xonalar tartibi' },
    lead: { ru: 'Сначала восстановим опору на трёхзначном числе.', uz: 'Avval uch xonali son yordamida tayanchni tiklaymiz.' },
    instruction: { ru: '7 сотен, 3 десятка и 5 единиц занимают три последовательных места.', uz: "7 yuzlik, 3 o'nlik va 5 birlik ketma-ket uchta o'rinni egallaydi." },
    model: {
      kind: 'table',
      badge: { ru: 'Опорная таблица', uz: 'Tayanch jadval' },
      columns: [
        { label: { ru: 'сотни', uz: 'yuzlar' }, value: '7' },
        { label: { ru: 'десятки', uz: "o'nlar" }, value: '3' },
        { label: { ru: 'единицы', uz: 'birlar' }, value: '5' },
      ],
    },
    options: ['735', '753', '375', '7035'],
    correctIndex: 0,
    correctText: { ru: '735: сотни, десятки и единицы заняли свои места.', uz: "735: yuzlar, o'nlar va birlar o'z o'rnini egalladi." },
    wrong: [
      null,
      { ru: 'В числе 753 цифра 5 стоит в десятках, а 3 в единицах. Проверь последние два разряда.', uz: "753 sonida 5 o'nlar, 3 esa birlar xonasida. Oxirgi ikki xonani tekshiring." },
      { ru: 'В числе 375 сначала записаны сотни как 3. Начни с семи сотен.', uz: "375 sonida yuzlar xonasiga 3 yozilgan. Yetti yuzlikdan boshlang." },
      { ru: 'Получилось четырёхзначное число. Для сотен, десятков и единиц нужны три места.', uz: "To'rt xonali son hosil bo'ldi. Yuzlar, o'nlar va birlar uchun uchta o'rin kerak." },
    ],
    audio: {
      intro: {
        ru: ['Вспомним знакомые разряды. Семь сотен, три десятка и пять единиц ставим слева направо.'],
        uz: ["Tanish xonalarni eslaymiz. Yetti yuzlik, uch o'nlik va besh birlikni chapdan o'ngga joylaymiz."],
      },
      on_correct: { ru: 'Семь сотен, три десятка и пять единиц образуют семьсот тридцать пять.', uz: "Yetti yuzlik, uch o'nlik va besh birlik yetti yuz o'ttiz besh sonini hosil qiladi." },
      on_wrong: [
        null,
        { ru: 'Проверь порядок последних двух разрядов. Сначала десятки, затем единицы.', uz: "Oxirgi ikki xona tartibini tekshiring. Avval o'nlar, keyin birlar." },
        { ru: 'Начни с сотен. В первом месте должна стоять цифра семь.', uz: "Yuzlardan boshlang. Birinchi o'rinda yetti raqami turishi kerak." },
        { ru: 'Названы только три разряда. Значит, в записи должно быть три места.', uz: "Faqat uchta xona aytilgan. Demak, yozuvda uchta o'rin bo'lishi kerak." },
      ],
    },
  },
  s2: {
    eyebrow: { ru: 'Показ чтения', uz: "O'qishni ko'rsatish" },
    title: { ru: 'Код звучит по классам', uz: "Kod sinflar bo'yicha aytiladi" },
    lead: { ru: 'Посмотрим, как две группы превращаются в название одного числа.', uz: "Ikki guruh bitta son nomiga qanday aylanishini ko'ramiz." },
    instruction: { ru: '402 018 читаем двумя целыми группами, а не шестью отдельными цифрами.', uz: "402 018 ni oltita alohida raqam emas, ikkita yaxlit guruh sifatida o'qiymiz." },
    model: {
      kind: 'classes',
      badge: { ru: 'Два класса', uz: 'Ikki sinf' },
      number: '402 018',
      groups: [
        { value: '402', label: { ru: 'тысячи', uz: 'minglar' }, tone: 'cyan' },
        { value: '018', label: { ru: 'единицы', uz: 'birlar' }, tone: 'accent' },
      ],
    },
    options: [
      { ru: 'четыреста две тысячи восемнадцать', uz: "to'rt yuz ikki ming o'n sakkiz" },
      { ru: 'четыре ноль две тысячи ноль один восемь', uz: "to'rt nol ikki ming nol bir sakkiz" },
      { ru: 'сорок две тысячи сто восемь', uz: "qirq ikki ming bir yuz sakkiz" },
      { ru: 'четыреста двадцать тысяч восемнадцать', uz: "to'rt yuz yigirma ming o'n sakkiz" },
    ],
    correctIndex: 0,
    correctText: { ru: 'Каждый класс читается как обычное трёхзначное число. Нули внутри группы сохраняют места.', uz: "Har bir sinf odatdagi uch xonali son kabi o'qiladi. Guruh ichidagi nollar o'rinlarni saqlaydi." },
    wrong: [
      null,
      { ru: 'Это чтение отдельных цифр, а не числа. Прочитай каждую тройку целиком.', uz: "Bu sonni emas, alohida raqamlarni o'qish. Har bir uchlikni yaxlit o'qing." },
      { ru: 'Здесь нули исчезли и разряды сдвинулись. Сохрани три места в каждой группе.', uz: "Bu yerda nollar yo'qolib, xonalar siljigan. Har bir guruhda uchta o'rinni saqlang." },
      { ru: 'В группе 402 нет двух десятков. Прочитай сотни, десятки и единицы этой группы точно.', uz: "402 guruhida ikki o'nlik yo'q. Guruhdagi yuzlar, o'nlar va birlarni aniq o'qing." },
    ],
    audio: {
      intro: {
        ru: ['Посмотри на две группы числа. Сначала прочитаем класс тысяч, затем класс единиц.'],
        uz: ["Sonning ikki guruhiga qarang. Avval minglar sinfini, keyin birlar sinfini o'qiymiz."],
      },
      on_correct: { ru: 'Сначала читаем четыреста две тысячи, затем восемнадцать единиц.', uz: "Avval to'rt yuz ikki mingni, keyin o'n sakkiz birlikni o'qiymiz." },
      on_wrong: [
        null,
        { ru: 'Не называй цифры по одной. Прочитай каждую группу как число.', uz: "Raqamlarni bittadan aytmang. Har bir guruhni son sifatida o'qing." },
        { ru: 'Нули удерживают пустые разряды. Верни их на свои места.', uz: "Nollar bo'sh xonalarni saqlaydi. Ularni o'z o'rniga qaytaring." },
        { ru: 'Проверь средний разряд первой группы. Там стоит ноль.', uz: "Birinchi guruhning o'rta xonasini tekshiring. U yerda nol turibdi." },
      ],
    },
  },
  s3: {
    eyebrow: { ru: 'Первая модель', uz: 'Birinchi model' },
    title: { ru: 'Читаем по классам', uz: "Sinflar bo'yicha o'qiymiz" },
    lead: { ru: 'Таблица показывает, какую группу читать первой.', uz: "Jadval qaysi guruhni birinchi o'qishni ko'rsatadi." },
    instruction: { ru: 'Левая группа 426 относится к классу тысяч и звучит первой.', uz: "Chapdagi 426 guruhi minglar sinfiga tegishli va birinchi aytiladi." },
    model: {
      kind: 'classes',
      badge: { ru: 'Код объекта', uz: 'Obyekt kodi' },
      number: '426 305',
      groups: [
        { value: '426', label: { ru: 'класс тысяч', uz: 'minglar sinfi' }, tone: 'cyan' },
        { value: '305', label: { ru: 'класс единиц', uz: 'birlar sinfi' }, tone: 'accent' },
      ],
    },
    options: [
      { ru: 'четыреста двадцать шесть тысяч', uz: "to'rt yuz yigirma olti ming" },
      { ru: 'триста пять', uz: 'uch yuz besh' },
      { ru: 'четыреста двадцать шесть', uz: "to'rt yuz yigirma olti" },
      { ru: 'триста пять тысяч', uz: 'uch yuz besh ming' },
    ],
    correctIndex: 0,
    correctText: { ru: 'Чтение идёт слева направо: сначала класс тысяч, затем класс единиц.', uz: "O'qish chapdan o'ngga boradi: avval minglar sinfi, keyin birlar sinfi." },
    wrong: [
      null,
      { ru: '305 находится справа. Этот класс читаем после класса тысяч.', uz: "305 o'ng tomonda. Bu sinfni minglar sinfidan keyin o'qiymiz." },
      { ru: 'Группа названа без слова «тысяч». Добавь название класса.', uz: "Guruh ming so'zisiz aytilgan. Sinf nomini qo'shing." },
      { ru: 'Слово «тысяч» относится к левой группе 426, а не к правой 305.', uz: "Ming so'zi chapdagi 426 guruhiga tegishli, o'ngdagi 305 guruhiga emas." },
    ],
    audio: {
      intro: {
        ru: ['Разделим код на две тройки. Чтение начинаем с крайнего левого непустого класса.'],
        uz: ["Kodni ikkita uchlikka ajratamiz. O'qishni eng chapdagi bo'sh bo'lmagan sinfdan boshlaymiz."],
      },
      on_correct: { ru: 'Сначала звучит четыреста двадцать шесть тысяч. Затем читается правая группа.', uz: "Avval to'rt yuz yigirma olti ming aytiladi. Keyin o'ng guruh o'qiladi." },
      on_wrong: [
        null,
        { ru: 'Правая группа читается второй. Начни с левой группы тысяч.', uz: "O'ng guruh ikkinchi o'qiladi. Chapdagi minglar guruhidan boshlang." },
        { ru: 'После левой группы обязательно назови класс тысяч.', uz: "Chap guruhdan keyin minglar sinfini albatta ayting." },
        { ru: 'Название класса тысяч ставится после левой группы.', uz: "Minglar sinfi nomi chap guruhdan keyin aytiladi." },
      ],
    },
  },
  s4: {
    eyebrow: { ru: 'Вторая модель', uz: 'Ikkinchi model' },
    title: { ru: 'Ноль держит пустое место', uz: "Nol bo'sh o'rinni saqlaydi" },
    lead: { ru: 'Разрядная таблица объясняет, почему 040 читается как сорок.', uz: "Xona jadvali nima uchun 040 qirq deb o'qilishini tushuntiradi." },
    instruction: { ru: 'Ноль в разряде сотен показывает пустое место и удерживает цифру 4 в десятках.', uz: "Yuzlar xonasidagi nol bo'sh o'rinni ko'rsatadi va 4 raqamini o'nlarda saqlaydi." },
    model: {
      kind: 'table',
      badge: { ru: 'Разрядная таблица', uz: 'Xona jadvali' },
      number: '508 040',
      columns: [
        { label: { ru: 'сотни тысяч', uz: 'yuz minglar' }, value: '5' },
        { label: { ru: 'десятки тысяч', uz: "o'n minglar" }, value: '0' },
        { label: { ru: 'тысячи', uz: 'minglar' }, value: '8' },
        { label: { ru: 'сотни', uz: 'yuzlar' }, value: '0' },
        { label: { ru: 'десятки', uz: "o'nlar" }, value: '4' },
        { label: { ru: 'единицы', uz: 'birlar' }, value: '0' },
      ],
    },
    fact: { ru: 'Ноль может обозначать пустой разряд. Удаление такого нуля меняет значения соседних цифр.', uz: "Nol bo'sh xonani bildirishi mumkin. Bunday nolni olib tashlash qo'shni raqamlar qiymatini o'zgartiradi." },
    options: [
      { ru: 'Сотен единиц нет, но место сотен сохраняется', uz: "Birlar sinfida yuzlik yo'q, ammo yuzlar o'rni saqlanadi" },
      { ru: 'Число нужно закончить после тысяч', uz: 'Sonni minglardan keyin tugatish kerak' },
      { ru: 'Цифра 4 относится к сотням', uz: '4 raqami yuzlarga tegishli' },
      { ru: 'Ноль можно удалить без изменения числа', uz: "Nolni sonni o'zgartirmasdan olib tashlash mumkin" },
    ],
    correctIndex: 0,
    correctText: { ru: 'Ноль сохраняет разряд сотен, поэтому 4 остаётся в десятках.', uz: "Nol yuzlar xonasini saqlaydi, shuning uchun 4 o'nlar xonasida qoladi." },
    wrong: [
      null,
      { ru: 'После класса тысяч есть класс единиц. Его три места нельзя отбросить.', uz: "Minglar sinfidan keyin birlar sinfi bor. Uning uchta o'rnini tashlab bo'lmaydi." },
      { ru: 'В таблице 4 стоит под десятками. Ноль слева не даёт ей сдвинуться.', uz: "Jadvalda 4 o'nlar ostida turibdi. Chapdagi nol uning siljishiga yo'l qo'ymaydi." },
      { ru: 'Без нуля цифра 4 перейдёт в сотни или число станет короче. Значение изменится.', uz: "Nolsiz 4 raqami yuzlarga o'tadi yoki son qisqaradi. Qiymat o'zgaradi." },
    ],
    audio: {
      intro: {
        ru: ['В правой группе нет сотен и единиц, но есть четыре десятка. Нули сохраняют пустые места вокруг цифры четыре.'],
        uz: ["O'ng guruhda yuzlik va birlik yo'q, ammo to'rtta o'nlik bor. Nollar to'rt raqami atrofidagi bo'sh o'rinlarni saqlaydi."],
      },
      on_correct: { ru: 'Ноль удерживает место сотен, а цифра четыре остаётся в десятках.', uz: "Nol yuzlar o'rnini saqlaydi, to'rt raqami esa o'nlarda qoladi." },
      on_wrong: [
        null,
        { ru: 'Класс единиц всё равно занимает три места. Проверь правую группу.', uz: "Birlar sinfi baribir uchta o'rinni egallaydi. O'ng guruhni tekshiring." },
        { ru: 'Посмотри на заголовок столбца над цифрой четыре. Это десятки.', uz: "To'rt raqami ustidagi ustun nomiga qarang. Bu o'nlar." },
        { ru: 'Удаление нуля сдвигает цифры. Значит, число изменится.', uz: "Nolni olib tashlash raqamlarni siljitadi. Demak, son o'zgaradi." },
      ],
    },
  },
  s5: {
    eyebrow: { ru: 'Пошаговая запись', uz: 'Bosqichli yozuv' },
    title: { ru: 'Запись по голосу', uz: "Ovoz bo'yicha yozuv" },
    lead: { ru: 'Сначала заполняем класс тысяч, затем класс единиц.', uz: "Avval minglar sinfini, keyin birlar sinfini to'ldiramiz." },
    instruction: { ru: '«Двести четырнадцать тысяч семьдесят» раскладываем на группы 214 и 070.', uz: "Ikki yuz o'n to'rt ming yetmish sonini 214 va 070 guruhlariga ajratamiz." },
    model: {
      kind: 'classes',
      badge: { ru: 'Два контейнера', uz: 'Ikki konteyner' },
      groups: [
        { value: '214', label: { ru: 'класс тысяч', uz: 'minglar sinfi' }, tone: 'cyan' },
        { value: '___', label: { ru: 'класс единиц', uz: 'birlar sinfi' }, tone: 'accent' },
      ],
    },
    options: ['214 070', '214 700', '214 007', '21 470'],
    correctIndex: 0,
    inputWrongDefault: { ru: 'Раздели запись на класс тысяч и класс единиц. В правой группе для семидесяти нужны цифры 0, 7, 0.', uz: "Yozuvni minglar sinfi va birlar sinfiga ajrating. O'ng guruhda yetmish uchun 0, 7, 0 raqamlari kerak." },
    inputWrongAudio: { ru: 'Сначала отдели класс тысяч от класса единиц. В правой группе у семидесяти нет сотен и единиц.', uz: "Avval minglar sinfini birlar sinfidan ajrating. O'ng guruhdagi yetmishda yuzlik va birlik yo'q." },
    correctText: { ru: '214 070: в классе единиц нет сотен, есть 7 десятков и нет единиц.', uz: "214 070: birlar sinfida yuzlik yo'q, 7 o'nlik bor va birlik yo'q." },
    wrong: [
      null,
      { ru: 'Запись 700 означает семь сотен. В голосе названы семьдесят, то есть 070.', uz: "700 yozuvi yetti yuzni bildiradi. Ovozda yetmish aytilgan, ya'ni 070." },
      { ru: 'Запись 007 означает семь единиц. Нужны семь десятков.', uz: "007 yozuvi yetti birlikni bildiradi. Yetti o'nlik kerak." },
      { ru: 'Граница классов сдвинулась. Левая группа должна полностью содержать 214.', uz: "Sinflar chegarasi siljigan. Chap guruh 214 ni to'liq saqlashi kerak." },
    ],
    audio: {
      intro: { ru: ['Разберём двести четырнадцать тысяч семьдесят. В правой группе сохраняем сотни, десятки и единицы.'], uz: ["Ikki yuz o'n to'rt ming yetmish sonini tahlil qilamiz. O'ng guruhda yuzlar, o'nlar va birlar o'rnini saqlaymiz."] },
      on_correct: { ru: 'Получается двести четырнадцать тысяч семьдесят. Нули сохраняют сотни и единицы правой группы.', uz: "Ikki yuz o'n to'rt ming yetmish hosil bo'ladi. Nollar o'ng guruhdagi yuzlar va birlar o'rnini saqlaydi." },
      on_wrong: [
        null,
        { ru: 'Семьдесят означает ноль сотен, семь десятков и ноль единиц.', uz: "Yetmish nol yuzlik, yetti o'nlik va nol birlikni bildiradi." },
        { ru: 'Семь единиц и семь десятков занимают разные места. Нужны десятки.', uz: "Yetti birlik va yetti o'nlik turli o'rinlarda turadi. O'nliklar kerak." },
        { ru: 'Сохрани первую группу целиком. Она обозначает двести четырнадцать тысяч.', uz: "Birinchi guruhni to'liq saqlang. U ikki yuz o'n to'rt mingni bildiradi." },
      ],
    },
  },
  s6: {
    eyebrow: { ru: 'Пошаговое чтение', uz: "Bosqichli o'qish" },
    title: { ru: 'Читаем обе группы', uz: "Ikkala guruhni o'qiymiz" },
    lead: { ru: 'Названия классов показывают порядок чтения.', uz: "Sinf nomlari o'qish tartibini ko'rsatadi." },
    instruction: { ru: '508 206 читаем как 508 тысяч и 206 единиц.', uz: "508 206 ni 508 ming va 206 birlik sifatida o'qiymiz." },
    model: {
      kind: 'classes',
      badge: { ru: 'Чтение слева направо', uz: "Chapdan o'ngga o'qish" },
      number: '508 206',
      groups: [
        { value: '508', label: { ru: 'тысячи', uz: 'minglar' }, tone: 'cyan' },
        { value: '206', label: { ru: 'единицы', uz: 'birlar' }, tone: 'accent' },
      ],
    },
    options: [
      { ru: 'пятьсот восемь тысяч двести шесть', uz: 'besh yuz sakkiz ming ikki yuz olti' },
      { ru: 'пятьсот восемь тысяч двадцать шесть', uz: "besh yuz sakkiz ming yigirma olti" },
      { ru: 'пятьсот восемь двести шесть', uz: 'besh yuz sakkiz ikki yuz olti' },
      { ru: 'пятьдесят восемь тысяч двести шесть', uz: 'ellik sakkiz ming ikki yuz olti' },
    ],
    correctIndex: 0,
    correctText: { ru: '508 читаем как класс тысяч, 206 как класс единиц.', uz: "508 ni minglar sinfi, 206 ni birlar sinfi sifatida o'qiymiz." },
    wrong: [
      null,
      { ru: 'В правой группе цифра 2 стоит в сотнях, поэтому читаем двести шесть.', uz: "O'ng guruhda 2 yuzlar xonasida, shuning uchun ikki yuz olti deb o'qiymiz." },
      { ru: 'После левой группы пропущено название класса тысяч.', uz: 'Chap guruhdan keyin minglar sinfi nomi tushirib qoldirilgan.' },
      { ru: 'В левой группе 5 стоит в сотнях тысяч, а не в десятках тысяч.', uz: "Chap guruhda 5 yuz minglar xonasida, o'n minglar xonasida emas." },
    ],
    audio: {
      intro: { ru: ['Прочитаем код по группам. Сначала называем класс тысяч, затем класс единиц.'], uz: ["Kodni guruhlar bo'yicha o'qiymiz. Avval minglar sinfini, keyin birlar sinfini aytamiz."] },
      on_correct: { ru: 'Получается пятьсот восемь тысяч двести шесть.', uz: "Besh yuz sakkiz ming ikki yuz olti hosil bo'ladi." },
      on_wrong: [
        null,
        { ru: 'Проверь сотни в правой группе. Там стоит цифра два.', uz: "O'ng guruhdagi yuzlarni tekshiring. U yerda ikki raqami turibdi." },
        { ru: 'Между группами назови класс тысяч.', uz: 'Guruhlar orasida minglar sinfini ayting.' },
        { ru: 'Прочитай левую тройку как пятьсот восемь.', uz: "Chap uchlikni besh yuz sakkiz deb o'qing." },
      ],
    },
  },
  s7: {
    eyebrow: { ru: 'Практика без опоры', uz: 'Kam yordamli mashq' },
    title: { ru: 'Старший класс может быть коротким', uz: "Katta sinf qisqa bo'lishi mumkin" },
    lead: { ru: 'В старшем классе одна цифра, а класс единиц всё равно занимает три места.', uz: "Katta sinfda bitta raqam bor, birlar sinfi esa baribir uchta o'rinni egallaydi." },
    instruction: { ru: 'Как записать «семь тысяч сорок»?', uz: "Yetti ming qirq qanday yoziladi?" },
    model: { kind: 'classes', badge: { ru: 'Четырёхзначный код', uz: "To'rt xonali kod" }, groups: [
      { value: '7', label: { ru: 'класс тысяч', uz: 'minglar sinfi' }, tone: 'cyan' },
      { value: '___', label: { ru: 'класс единиц', uz: 'birlar sinfi' }, tone: 'accent' },
    ] },
    options: ['7 040', '7 400', '7 004', '70 040'],
    correctIndex: 0,
    inputWrongDefault: { ru: 'Старший класс содержит только цифру 7. Справа запиши три места класса единиц: 0 сотен, 4 десятка, 0 единиц.', uz: "Katta sinfda faqat 7 raqami bor. O'ngda birlar sinfining uchta xonasini yozing: 0 yuzlik, 4 o'nlik, 0 birlik." },
    inputWrongAudio: { ru: 'Старший класс содержит только семь тысяч. Справа нужны ноль сотен, четыре десятка и ноль единиц.', uz: "Katta sinfda faqat yetti ming bor. O'ngda nol yuzlik, to'rt o'nlik va nol birlik kerak." },
    correctText: { ru: '7 040: старший класс записан одной цифрой, а справа стоят 0 сотен, 4 десятка и 0 единиц.', uz: "7 040: katta sinf bitta raqam bilan yozildi, o'ngda esa 0 yuzlik, 4 o'nlik va 0 birlik turibdi." },
    wrong: [
      null,
      { ru: '400 означает четыре сотни, а в условии названы четыре десятка.', uz: "400 to'rt yuzlikni bildiradi, shartda esa to'rt o'nlik aytilgan." },
      { ru: '004 означает четыре единицы. Для сорока цифра 4 должна стоять в десятках.', uz: "004 to'rt birlikni bildiradi. Qirq uchun 4 o'nlar xonasida turishi kerak." },
      { ru: '70 040 — это семьдесят тысяч сорок. В условии названо только семь тысяч.', uz: "70 040 yetmish ming qirqni bildiradi. Shartda faqat yetti ming aytilgan." },
    ],
    audio: {
      intro: { ru: ['Теперь запиши семь тысяч сорок. Старший класс может состоять из одной цифры, а правый класс сохраняет три места.'], uz: ["Endi yetti ming qirq sonini yozing. Katta sinf bitta raqamdan iborat bo'lishi mumkin, o'ng sinf esa uchta xonani saqlaydi."] },
      on_correct: { ru: 'Да. Семь тысяч записаны одной цифрой, а правая группа показывает ноль сотен, четыре десятка и ноль единиц.', uz: "Ha. Yetti ming bitta raqam bilan yozildi, o'ng guruh esa nol yuzlik, to'rt o'nlik va nol birlikni ko'rsatdi." },
      on_wrong: [
        null,
        { ru: 'Четыре должно стоять в десятках, не в сотнях.', uz: "To'rt raqami yuzlarda emas, o'nlarda turishi kerak." },
        { ru: 'Четыре должно стоять в десятках, не в единицах.', uz: "To'rt raqami birlarda emas, o'nlarda turishi kerak." },
        { ru: 'Слева нужна одна цифра семь. Две цифры дали бы семьдесят тысяч.', uz: "Chapda bitta yetti raqami kerak. Ikkita raqam yetmish mingni bildirardi." },
      ],
    },
  },
  s8: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    title: { ru: 'Чтение проверяет запись', uz: "O'qish yozuvni tekshiradi" },
    lead: { ru: 'Сопоставим код с его словесной формой и увидим надёжную проверку.', uz: "Kodni uning so'zli shakli bilan solishtirib, ishonchli tekshiruvni ko'ramiz." },
    instruction: { ru: 'Обратное чтение подтверждает, что каждый класс и разряд совпадает с записью.', uz: "Qayta o'qish har bir sinf va xona yozuvga mosligini tasdiqlaydi." },
    model: {
      kind: 'rows',
      badge: { ru: 'Запись и чтение', uz: "Yozuv va o'qish" },
      rows: [
        { label: { ru: 'четыреста две тысячи восемнадцать', uz: "to'rt yuz ikki ming o'n sakkiz" }, value: '402 018' },
        { label: { ru: 'семь тысяч сорок', uz: 'yetti ming qirq' }, value: '7 040' },
      ],
    },
    options: [
      { ru: 'Каждый названный класс и разряд совпадает с записью', uz: "Aytilgan har bir sinf va xona yozuvga mos keladi" },
      { ru: 'Число произнесённых слов равно числу цифр', uz: "Aytilgan so'zlar soni raqamlar soniga teng" },
      { ru: 'Все нули нужно произнести отдельно', uz: 'Barcha nollarni alohida aytish kerak' },
      { ru: 'Код удобнее читать справа налево', uz: "Kodni o'ngdan chapga o'qish qulayroq" },
    ],
    correctIndex: 0,
    correctText: { ru: 'Обратное чтение восстанавливает те же классы и разряды. Значит, запись можно так проверить.', uz: "Qayta o'qish ayni sinf va xonalarni tiklaydi. Demak, yozuvni shu usulda tekshirish mumkin." },
    wrong: [
      null,
      { ru: 'Одно число может требовать разное количество слов. Проверять нужно классы и разряды, а не число слов.', uz: "Bir son turli miqdordagi so'z bilan aytilishi mumkin. So'zlar sonini emas, sinf va xonalarni tekshirish kerak." },
      { ru: 'Пустые разряды нулями не называют. Их положение слышно по названиям остальных разрядов.', uz: "Bo'sh xonalardagi nollar aytilmaydi. Ularning o'rni boshqa xonalar nomidan bilinadi." },
      { ru: 'Чтение начинается с крайнего левого непустого класса. Справа налево порядок числа разрушится.', uz: "O'qish eng chapdagi bo'sh bo'lmagan sinfdan boshlanadi. O'ngdan chapga o'qish son tartibini buzadi." },
    ],
    audio: {
      intro: { ru: ['Сопоставим два кода с их названиями. Чтение помогает проверить цифровую запись по классам и разрядам.'], uz: ["Ikki kodni ularning nomlari bilan solishtiramiz. O'qish raqamli yozuvni sinf va xonalar bo'yicha tekshiradi."] },
      on_correct: { ru: 'При обратном чтении классы и разряды должны совпасть с цифровой записью.', uz: "Qayta o'qishda sinf va xonalar raqamli yozuvga mos kelishi kerak." },
      on_wrong: [
        null,
        { ru: 'Не считай слова. Сверь, какие классы и разряды они называют.', uz: "So'zlarni sanamang. Ular qaysi sinf va xonalarni aytayotganini solishtiring." },
        { ru: 'Нули сохраняем в записи, но отдельно не произносим.', uz: "Nollarni yozuvda saqlaymiz, ammo alohida aytmaymiz." },
        { ru: 'Начни с левого непустого класса и сохрани порядок групп.', uz: "Chapdagi bo'sh bo'lmagan sinfdan boshlang va guruhlar tartibini saqlang." },
      ],
    },
  },
  s9: {
    eyebrow: { ru: 'Собираем правило', uz: "Qoidani yig'amiz" },
    title: { ru: 'Правило чтения и записи', uz: "O'qish va yozish qoidasi" },
    lead: { ru: 'Три шага объединяют все рассмотренные примеры.', uz: "Uchta qadam ko'rilgan barcha misollarni birlashtiradi." },
    instruction: { ru: 'Собираем надёжный алгоритм чтения и записи.', uz: "O'qish va yozishning ishonchli algoritmini yig'amiz." },
    model: { kind: 'steps', badge: { ru: 'Алгоритм', uz: 'Algoritm' }, steps: [
      { ru: '1. Выделить классы', uz: '1. Sinflarni ajratish' },
      { ru: '2. Читать или заполнять слева направо', uz: "2. Chapdan o'ngga o'qish yoki to'ldirish" },
      { ru: '3. Справа от старшего класса сохранять по три разряда', uz: "3. Katta sinfdan o'ngda uchtadan xonani saqlash" },
    ] },
    options: [
      { ru: 'Читаем классы слева направо, а справа от старшего класса сохраняем по три разряда', uz: "Sinflarni chapdan o'ngga o'qiymiz, katta sinfdan o'ngda esa uchtadan xonani saqlaymiz" },
      { ru: 'Читаем каждую цифру отдельно и записываем только ненулевые цифры', uz: "Har bir raqamni alohida o'qiymiz va faqat noldan farqli raqamlarni yozamiz" },
      { ru: 'Начинаем с класса единиц и перестраиваем число справа налево', uz: "Birlar sinfidan boshlaymiz va sonni o'ngdan chapga qayta tuzamiz" },
      { ru: 'Нули учитываем только в начале всего числа', uz: 'Nollarni faqat butun son boshida hisobga olamiz' },
    ],
    correctIndex: 0,
    correctText: { ru: 'Правило собрано: классы читаем слева направо, пустые разряды в записи сохраняем нулями.', uz: "Qoida yig'ildi: sinflarni chapdan o'ngga o'qiymiz, yozuvdagi bo'sh xonalarni nollar bilan saqlaymiz." },
    wrong: [
      null,
      { ru: 'По отдельным цифрам нельзя услышать сотни и десятки как единое число. Нули тоже нельзя терять.', uz: "Alohida raqamlardan yuzlik va o'nliklarni yaxlit son sifatida eshitib bo'lmaydi. Nollarni ham yo'qotib bo'lmaydi." },
      { ru: 'Чтение начинается с крайнего левого непустого класса, а не справа.', uz: "O'qish o'ngdan emas, eng chapdagi bo'sh bo'lmagan sinfdan boshlanadi." },
      { ru: 'Внутренние нули важнее начальных: они удерживают разряды внутри числа.', uz: "Ichki nollar muhim: ular son ichidagi xonalarni saqlaydi." },
    ],
    audio: {
      intro: { ru: ['Мы уже прочитали и записали несколько кодов. Теперь три шага соберутся в общее правило.'], uz: ["Biz bir nechta kodni o'qib va yozib ko'rdik. Endi uchta qadam umumiy qoidaga birlashadi."] },
      on_correct: { ru: 'Правило точное. Классы читаем слева направо, а пустые разряды при записи отмечаем нулями.', uz: "Qoida aniq. Sinflarni chapdan o'ngga o'qiymiz, yozishda bo'sh xonalarni nollar bilan belgilaymiz." },
      on_wrong: [
        null,
        { ru: 'Вспомни модели. Мы читали группы целиком и сохраняли нули.', uz: "Modellarni eslang. Biz guruhlarni yaxlit o'qidik va nollarni saqladik." },
        { ru: 'Читать начинаем с левой группы, потому что она задаёт старший класс.', uz: "O'qishni chap guruhdan boshlaymiz, chunki u katta sinfni ko'rsatadi." },
        { ru: 'Проверь примеры с нулями внутри правой группы. Эти нули нельзя пропускать.', uz: "O'ng guruh ichidagi nolli misollarni tekshiring. Bu nollarni tashlab bo'lmaydi." },
      ],
    },
  },
  s10: {
    eyebrow: { ru: 'Новый пример', uz: 'Yangi misol' },
    title: { ru: 'Записываем новый код', uz: 'Yangi kodni yozamiz' },
    lead: { ru: 'Применим правило к числу с двумя внутренними нулями.', uz: "Qoidani ikkita ichki noli bor songa qo'llaymiz." },
    instruction: { ru: '«Девятьсот три тысячи шестнадцать» образует группы 903 и 016.', uz: "To'qqiz yuz uch ming o'n olti soni 903 va 016 guruhlarini hosil qiladi." },
    model: { kind: 'code', badge: { ru: 'Самостоятельная запись', uz: 'Mustaqil yozuv' }, number: '□ □ □   □ □ □' },
    options: ['903 016', '930 016', '903 160', '90 316'],
    correctIndex: 0,
    inputWrongDefault: { ru: 'Сначала запиши 903 в классе тысяч. Затем сохрани три места справа: 0 сотен, 1 десяток, 6 единиц.', uz: "Avval minglar sinfiga 903 ni yozing. Keyin o'ngda uchta xonani saqlang: 0 yuzlik, 1 o'nlik, 6 birlik." },
    inputWrongAudio: { ru: 'Сначала запиши девятьсот три в классе тысяч. Затем справа сохрани ноль сотен, один десяток и шесть единиц.', uz: "Avval minglar sinfiga to'qqiz yuz uchni yozing. Keyin o'ngda nol yuzlik, bir o'nlik va olti birlikni saqlang." },
    correctText: { ru: '903 016: обе группы занимают по три места, внутренние нули сохранены.', uz: "903 016: ikkala guruh ham uchtadan o'rinni egallaydi, ichki nollar saqlangan." },
    wrong: [
      null,
      { ru: 'В классе тысяч переставлены 0 и 3. Нужно девятьсот три, то есть 903.', uz: "Minglar sinfida 0 va 3 o'rni almashgan. To'qqiz yuz uch, ya'ni 903 kerak." },
      { ru: '160 означает сто шестьдесят. В условии названы шестнадцать.', uz: "160 bir yuz oltmishni bildiradi. Shartda o'n olti aytilgan." },
      { ru: 'Граница классов сдвинулась и пропал разряд. Сохрани две тройки.', uz: "Sinflar chegarasi siljib, bitta xona yo'qolgan. Ikkita uchlikni saqlang." },
    ],
    audio: {
      intro: { ru: ['Разберём девятьсот три тысячи шестнадцать. Сначала представим две группы по три места.'], uz: ["To'qqiz yuz uch ming o'n olti sonini tahlil qilamiz. Avval uchtadan o'rinli ikkita guruhni tasavvur qilamiz."] },
      on_correct: { ru: 'Получается девятьсот три тысячи шестнадцать. Класс тысяч и класс единиц заняли свои места.', uz: "To'qqiz yuz uch ming o'n olti hosil bo'ladi. Minglar sinfi va birlar sinfi o'z o'rnini egallaydi." },
      on_wrong: [
        null,
        { ru: 'Прочитай левую группу ещё раз. Нужны девятьсот три.', uz: "Chap guruhni yana o'qing. To'qqiz yuz uch kerak." },
        { ru: 'Шестнадцать занимает десятки и единицы. Перед ним в группе нужен ноль сотен.', uz: "O'n olti o'nlar va birlarni egallaydi. Guruh boshida nol yuzlik kerak." },
        { ru: 'Сохрани три места для класса тысяч и три для класса единиц.', uz: "Minglar sinfi uchun uchta, birlar sinfi uchun uchta o'rinni saqlang." },
      ],
    },
  },
  s11: {
    eyebrow: { ru: 'Лаборатория примеров', uz: 'Misollar laboratoriyasi' },
    title: { ru: 'Четыре разобранных примера', uz: "To'rtta tahlil qilingan misol" },
    lead: { ru: 'В каждом примере сразу видны точная запись, чтение и причина.', uz: "Har bir misolda aniq yozuv, o'qish va sabab darhol ko'rinadi." },
    audio: {
      intro: { ru: ['Разберём четыре коротких примера. В каждом используем классы и сохраняем пустые разряды.'], uz: ["To'rtta qisqa misolni tahlil qilamiz. Har birida sinflardan foydalanamiz va bo'sh xonalarni saqlaymiz."] },
    },
    items: [
      {
        question: { ru: 'Как записать «четыреста семь тысяч двести пять»?', uz: "To'rt yuz yetti ming ikki yuz besh qanday yoziladi?" },
        options: ['407 205', '470 205', '407 025', '40 725'],
        correctIndex: 0,
        correctText: { ru: '407 205 сохраняет обе группы без перестановки.', uz: '407 205 ikkala guruhni almashtirmasdan saqlaydi.' },
        wrong: [null, { ru: 'В левой группе переставлены 0 и 7.', uz: "Chap guruhda 0 va 7 o'rni almashgan." }, { ru: 'В правой группе 025 означает двадцать пять, а не двести пять.', uz: "O'ng guruhdagi 025 yigirma beshni bildiradi, ikki yuz beshni emas." }, { ru: 'Сдвинута граница классов и потерян разряд.', uz: "Sinflar chegarasi siljib, bitta xona yo'qolgan." }],
        audio: {
          intro: { ru: ['Четыреста семь тысяч двести пять разделяем на две группы.'], uz: ["To'rt yuz yetti ming ikki yuz besh sonini ikkita guruhga ajratamiz."] },
          on_correct: { ru: 'Обе группы записаны точно. Получается четыреста семь тысяч двести пять.', uz: "Ikkala guruh ham aniq yozilgan. To'rt yuz yetti ming ikki yuz besh hosil bo'ladi." },
          on_wrong: [null, { ru: 'Проверь порядок цифр в левой группе.', uz: "Chap guruhdagi raqamlar tartibini tekshiring." }, { ru: 'Проверь сотни в правой группе.', uz: "O'ng guruhdagi yuzlarni tekshiring." }, { ru: 'Верни границу между двумя тройками.', uz: 'Ikkita uchlik orasidagi chegarani qaytaring.' }],
        },
      },
      {
        question: { ru: 'Как читается 620 009?', uz: "620 009 qanday o'qiladi?" },
        options: [
          { ru: 'шестьсот двадцать тысяч девять', uz: "olti yuz yigirma ming to'qqiz" },
          { ru: 'шестьсот двадцать тысяч девяносто', uz: "olti yuz yigirma ming to'qson" },
          { ru: 'шестьдесят две тысячи девять', uz: "oltmish ikki ming to'qqiz" },
          { ru: 'шестьсот две тысячи девять', uz: "olti yuz ikki ming to'qqiz" },
        ],
        correctIndex: 0,
        correctText: { ru: '009 читается как девять, но оба нуля остаются в записи.', uz: "009 to'qqiz deb o'qiladi, ammo ikkala nol ham yozuvda qoladi." },
        wrong: [null, { ru: '090 читалось бы как девяносто. Здесь 9 стоит в единицах.', uz: "090 to'qson deb o'qilardi. Bu yerda 9 birlar xonasida." }, { ru: 'Левая группа 620 прочитана как 62. Ноль в конце группы меняет значение.', uz: "Chapdagi 620 guruhi 62 deb o'qilgan. Guruh oxiridagi nol qiymatni o'zgartiradi." }, { ru: 'В левой группе есть 2 десятка, поэтому читаем шестьсот двадцать.', uz: "Chap guruhda 2 o'nlik bor, shuning uchun olti yuz yigirma deb o'qiymiz." }],
        audio: {
          intro: { ru: ['Слева записан класс тысяч со значением шестьсот двадцать. Справа в классе единиц только девять единиц.'], uz: ["Chapda olti yuz yigirma qiymatli minglar sinfi yozilgan. O'ngdagi birlar sinfida faqat to'qqiz birlik bor."] },
          on_correct: { ru: 'Нули не произносятся отдельно, но сохраняют места.', uz: "Nollar alohida aytilmaydi, ammo o'rinlarni saqlaydi." },
          on_wrong: [null, { ru: 'Девять стоит в единицах, не в десятках.', uz: "To'qqiz o'nlarda emas, birlarda turibdi." }, { ru: 'Прочитай левую группу целиком как шестьсот двадцать.', uz: "Chap guruhni olti yuz yigirma deb yaxlit o'qing." }, { ru: 'Проверь десятки в левой группе. Там стоит цифра два.', uz: "Chap guruhdagi o'nlarni tekshiring. U yerda ikki raqami turibdi." }],
        },
      },
      {
        question: { ru: 'Как записать «восемьдесят одна тысяча сорок»?', uz: "Sakson bir ming qirq qanday yoziladi?" },
        options: ['81 040', '81 400', '810 040', '8 140'],
        correctIndex: 0,
        correctText: { ru: '81 040: правый класс записан как 040.', uz: "81 040: o'ng sinf 040 ko'rinishida yozilgan." },
        wrong: [null, { ru: '400 означает четыре сотни, а нужно сорок.', uz: "400 to'rt yuzni bildiradi, qirq kerak." }, { ru: 'Слева получилось восемьсот десять тысяч, а не восемьдесят одна тысяча.', uz: "Chapda sakson bir ming emas, sakkiz yuz o'n ming hosil bo'lgan." }, { ru: 'Потеряна граница и один пустой разряд правой группы.', uz: "Chegara va o'ng guruhdagi bitta bo'sh xona yo'qolgan." }],
        audio: {
          intro: { ru: ['Восемьдесят одну тысячу сорок разделяем на класс тысяч и класс единиц.'], uz: ["Sakson bir ming qirq sonini minglar sinfi va birlar sinfiga ajratamiz."] },
          on_correct: { ru: 'Сорок занимает десятки правой группы, поэтому вокруг цифры четыре стоят нули.', uz: "Qirq o'ng guruhning o'nlar xonasini egallaydi, shuning uchun to'rt raqami atrofida nollar turadi." },
          on_wrong: [null, { ru: 'Сорок означает четыре десятка.', uz: "Qirq to'rt o'nlikni bildiradi." }, { ru: 'Левая группа должна обозначать восемьдесят одну тысячу.', uz: 'Chap guruh sakson bir mingni bildirishi kerak.' }, { ru: 'Сохрани три места в правой группе.', uz: "O'ng guruhda uchta o'rinni saqlang." }],
        },
      },
      {
        question: { ru: 'Какая проверка подтверждает запись 305 070?', uz: '305 070 yozuvini qaysi tekshiruv tasdiqlaydi?' },
        options: [
          { ru: 'триста пять тысяч семьдесят', uz: 'uch yuz besh ming yetmish' },
          { ru: 'триста пятьдесят тысяч семь', uz: "uch yuz ellik ming yetti" },
          { ru: 'тридцать пять тысяч семьдесят', uz: "o'ttiz besh ming yetmish" },
          { ru: 'триста пять тысяч семьсот', uz: 'uch yuz besh ming yetti yuz' },
        ],
        correctIndex: 0,
        correctText: { ru: 'Обратное чтение совпало с записью: 305 тысяч и 70 единиц.', uz: "Qayta o'qish yozuvga mos keldi: 305 ming va 70 birlik." },
        wrong: [null, { ru: 'Это чтение соответствует другой левой группе и другой позиции 7.', uz: "Bu o'qish boshqa chap guruhga va 7 ning boshqa o'rniga mos." }, { ru: 'Левая группа потеряла разряд сотен тысяч.', uz: "Chap guruh yuz minglar xonasini yo'qotgan." }, { ru: '700 поставило бы 7 в сотни, но в записи она стоит в десятках.', uz: "700 da 7 yuzlarda turardi, yozuvda esa u o'nlarda." }],
        audio: {
          intro: { ru: ['Прочитаем запись обратно и сопоставим её с точным названием числа.'], uz: ["Yozuvni qayta o'qib, sonning aniq nomi bilan solishtiramiz."] },
          on_correct: { ru: 'Проверка совпала. Запись и чтение обозначают одно число.', uz: "Tekshiruv mos keldi. Yozuv va o'qish bitta sonni bildiradi." },
          on_wrong: [null, { ru: 'Сравни левую группу и место цифры семь.', uz: "Chap guruh va yetti raqami o'rnini solishtiring." }, { ru: 'Верни сотни тысяч в левую группу.', uz: 'Yuz minglar xonasini chap guruhga qaytaring.' }, { ru: 'Цифра семь стоит в десятках, а не в сотнях.', uz: "Yetti raqami yuzlarda emas, o'nlarda turibdi." }],
        },
      },
    ],
    completionText: { ru: 'Четыре примера разобраны.', uz: "To'rtta misol tahlil qilindi." },
  },
  s12: {
    eyebrow: { ru: 'Разбор стратегии', uz: 'Strategiyani tahlil qilish' },
    title: { ru: 'Надёжная короткая проверка', uz: 'Ishonchli qisqa tekshiruv' },
    lead: { ru: 'Три действия защищают запись от перестановки классов и пропуска нуля.', uz: "Uchta harakat yozuvni sinflar almashishi va nol tushib qolishidan himoya qiladi." },
    instruction: { ru: 'Разделяем на классы, читаем обратно и сверяем с исходным названием.', uz: "Sinflarga ajratamiz, qayta o'qiymiz va dastlabki nom bilan solishtiramiz." },
    model: { kind: 'steps', badge: { ru: 'Проверка', uz: 'Tekshiruv' }, steps: [
      { ru: 'Разделить на классы', uz: 'Sinflarga ajratish' },
      { ru: 'Прочитать запись', uz: "Yozuvni o'qish" },
      { ru: 'Сверить с голосом', uz: 'Ovoz bilan solishtirish' },
    ] },
    options: [
      { ru: 'Разделить на классы, прочитать обратно и сверить с условием', uz: "Sinflarga ajratib, qayta o'qish va shart bilan solishtirish" },
      { ru: 'Посчитать сумму всех цифр', uz: "Barcha raqamlar yig'indisini hisoblash" },
      { ru: 'Проверить только первую и последнюю цифры', uz: 'Faqat birinchi va oxirgi raqamni tekshirish' },
      { ru: 'Убрать пробел между классами и посмотреть ещё раз', uz: "Sinflar orasidagi bo'shliqni olib tashlab, yana qarash" },
    ],
    correctIndex: 0,
    correctText: { ru: 'Обратное чтение проверяет и порядок классов, и сохранность внутренних нулей.', uz: "Qayta o'qish sinflar tartibini ham, ichki nollar saqlanganini ham tekshiradi." },
    wrong: [
      null,
      { ru: 'Сумма цифр может совпасть у разных чисел и не показывает позиции.', uz: "Raqamlar yig'indisi turli sonlarda bir xil bo'lishi mumkin va o'rinlarni ko'rsatmaydi." },
      { ru: 'Средние разряды останутся без проверки, именно там часто пропадает ноль.', uz: "O'rta xonalar tekshirilmay qoladi, aynan shu yerda nol ko'p tushib qoladi." },
      { ru: 'Удаление границы скрывает структуру и не сравнивает запись с голосом.', uz: "Chegarani olib tashlash tuzilishni yashiradi va yozuvni ovoz bilan solishtirmaydi." },
    ],
    audio: {
      intro: { ru: ['Короткая проверка должна заметить и перестановку классов, и пропущенный ноль. Проследим три шага.'], uz: ["Qisqa tekshiruv sinflar almashganini ham, tushib qolgan nolni ham sezishi kerak. Uchta qadamni kuzatamiz."] },
      on_correct: { ru: 'Это надёжная стратегия. Обратное чтение сразу сравнивает запись с исходным названием.', uz: "Bu ishonchli strategiya. Qayta o'qish yozuvni darhol dastlabki nom bilan solishtiradi." },
      on_wrong: [
        null,
        { ru: 'Сумма не хранит информацию о местах цифр. Нужна проверка структуры.', uz: "Yig'indi raqamlar o'rni haqidagi ma'lumotni saqlamaydi. Tuzilishni tekshirish kerak." },
        { ru: 'Проверь все разряды, особенно нули внутри числа.', uz: "Barcha xonalarni, ayniqsa son ichidagi nollarni tekshiring." },
        { ru: 'Граница классов помогает проверять, поэтому её нужно сохранить.', uz: 'Sinflar chegarasi tekshirishga yordam beradi, shuning uchun uni saqlash kerak.' },
      ],
    },
  },
  s13: {
    eyebrow: { ru: 'Работа с ошибкой', uz: 'Xato bilan ishlash' },
    title: { ru: 'Bit потерял ноль', uz: "Bit nolni yo'qotdi" },
    lead: { ru: 'Он услышал «семьдесят две тысячи сорок пять» и записал 7 245.', uz: "U yetmish ikki ming qirq beshni eshitib, 7 245 deb yozdi." },
    instruction: { ru: 'Сравним услышанное число с черновиком и вернём пропущенный ноль сотен.', uz: "Eshitilgan sonni qoralama bilan solishtirib, tushib qolgan nol yuzlikni qaytaramiz." },
    model: { kind: 'compare', badge: { ru: 'Черновик Bit', uz: 'Bit qoralamasi' }, rows: [
      { label: { ru: 'услышал', uz: 'eshitdi' }, value: '72 045' },
      { label: { ru: 'записал', uz: 'yozdi' }, value: '7 245' },
    ] },
    options: [
      { ru: 'Пропущен ноль сотен в классе единиц; верная запись 72 045', uz: "Birlar sinfidagi nol yuzlik tushib qolgan; to'g'ri yozuv 72 045" },
      { ru: 'Лишняя цифра 2; верная запись 7 045', uz: "2 raqami ortiqcha; to'g'ri yozuv 7 045" },
      { ru: 'Нужно переставить классы; верная запись 45 072', uz: "Sinflarni almashtirish kerak; to'g'ri yozuv 45 072" },
      { ru: 'Ошибка только в пробеле; число 7 245 верное', uz: "Xato faqat bo'shliqda; 7 245 soni to'g'ri" },
    ],
    correctIndex: 0,
    correctText: { ru: 'В правой группе сорок пять записывается как 045. Ноль удерживает разряд сотен.', uz: "O'ng guruhda qirq besh 045 ko'rinishida yoziladi. Nol yuzlar xonasini saqlaydi." },
    wrong: [
      null,
      { ru: 'Цифра 2 нужна для семидесяти двух тысяч. Ошибка находится в правой группе.', uz: "2 raqami yetmish ikki ming uchun kerak. Xato o'ng guruhda." },
      { ru: 'Группы уже названы в правильном порядке. Перестановка изменит число.', uz: "Guruhlar allaqachon to'g'ri tartibda aytilgan. Almashtirish sonni o'zgartiradi." },
      { ru: 'Без нуля правая группа сдвигается, и число становится семью тысячами.', uz: "Nolsiz o'ng guruh siljiydi va son yetti mingga aylanadi." },
    ],
    audio: {
      intro: { ru: ['Bit записал семь тысяч двести сорок пять вместо семидесяти двух тысяч сорока пяти. Сравним классы и найдём потерянное место.'], uz: ["Bit yetmish ikki ming qirq besh o'rniga yetti ming ikki yuz qirq besh yozdi. Sinflarni solishtirib, yo'qolgan o'rinni topamiz."] },
      on_correct: { ru: 'Ноль сотен возвращает правой группе три места и восстанавливает число.', uz: "Nol yuzlik o'ng guruhga uchta o'rinni qaytaradi va sonni tiklaydi." },
      on_wrong: [
        null,
        { ru: 'Сохрани семьдесят две тысячи слева и проверь правую группу.', uz: "Chapda yetmish ikki mingni saqlang va o'ng guruhni tekshiring." },
        { ru: 'Не меняй порядок классов. Ищи пропущенное место справа.', uz: "Sinflar tartibini o'zgartirmang. O'ng tomondagi tushib qolgan o'rinni izlang." },
        { ru: 'Пробел показывает границу, но внутри правой группы всё равно нужны три места.', uz: "Bo'shliq chegarani ko'rsatadi, ammo o'ng guruh ichida baribir uchta o'rin kerak." },
      ],
    },
  },
  s14: {
    eyebrow: { ru: 'Городской перенос', uz: "Shahar vaziyatiga ko'chirish" },
    title: { ru: 'Восстанови адрес станции', uz: 'Stansiya manzilini tiklang' },
    lead: { ru: 'Станция продиктовала код. Центр данных примет только запись, прошедшую обратную проверку.', uz: "Stansiya kodni aytdi. Ma'lumotlar markazi faqat qayta tekshiruvdan o'tgan yozuvni qabul qiladi." },
    instruction: { ru: 'Какой пакет верно передаёт «шестьсот четыре тысячи восемнадцать»?', uz: "Qaysi paket olti yuz to'rt ming o'n sakkizni to'g'ri uzatadi?" },
    model: { kind: 'city', badge: { ru: 'Станция L-18', uz: 'L-18 stansiyasi' }, number: 'VOICE → DATA' },
    options: [
      { ru: '604 018 → шестьсот четыре тысячи восемнадцать', uz: "604 018 → olti yuz to'rt ming o'n sakkiz" },
      { ru: '640 018 → шестьсот сорок тысяч восемнадцать', uz: "640 018 → olti yuz qirq ming o'n sakkiz" },
      { ru: '604 180 → шестьсот четыре тысячи сто восемьдесят', uz: "604 180 → olti yuz to'rt ming bir yuz sakson" },
      { ru: '60 418 → шестьдесят тысяч четыреста восемнадцать', uz: "60 418 → oltmish ming to'rt yuz o'n sakkiz" },
    ],
    correctIndex: 0,
    correctText: { ru: 'Запись 604 018 и обратное чтение совпадают. Адрес можно передавать.', uz: "604 018 yozuvi va qayta o'qish mos keldi. Manzilni uzatish mumkin." },
    wrong: [
      null,
      { ru: 'В классе тысяч 4 сдвинута из единиц в десятки. Это уже 640 тысяч.', uz: "Minglar sinfida 4 birlardan o'nlarga siljigan. Bu endi 640 ming." },
      { ru: 'Правая группа 180 означает сто восемьдесят, а станция назвала восемнадцать.', uz: "O'ng guruhdagi 180 bir yuz saksonni bildiradi, stansiya esa o'n sakkiz dedi." },
      { ru: 'Старший класс может иметь две цифры, но здесь правая группа стала 418 вместо 018. Пропущен ноль сотен перед восемнадцатью.', uz: "Katta sinf ikki raqamli bo'lishi mumkin, ammo bu yerda o'ng guruh 018 o'rniga 418 bo'lib qolgan. O'n sakkiz oldidagi nol yuzlik tushib qolgan." },
    ],
    audio: {
      intro: { ru: ['Станция продиктовала шестьсот четыре тысячи восемнадцать. Выбери запись и обратное чтение, которые полностью совпадают.'], uz: ["Stansiya olti yuz to'rt ming o'n sakkiz sonini aytdi. To'liq mos keladigan yozuv va qayta o'qishni tanlang."] },
      on_correct: { ru: 'Адрес подтверждён. Классы и внутренние нули переданы без потерь.', uz: "Manzil tasdiqlandi. Sinflar va ichki nollar yo'qotishsiz uzatildi." },
      on_wrong: [
        null,
        { ru: 'Проверь место цифры четыре в классе тысяч.', uz: "Minglar sinfidagi to'rt raqami o'rnini tekshiring." },
        { ru: 'Проверь правую группу. Нужны восемнадцать, а не сто восемьдесят.', uz: "O'ng guruhni tekshiring. Bir yuz sakson emas, o'n sakkiz kerak." },
        { ru: 'Проверь правую группу. Перед восемнадцатью нужен ноль сотен.', uz: "O'ng guruhni tekshiring. O'n sakkiz oldida nol yuzlik kerak." },
      ],
    },
  },
  s15: {
    eyebrow: { ru: 'Итог и мост', uz: "Yakun va ko'prik" },
    title: { ru: 'Центр данных читает адреса точно', uz: "Ma'lumotlar markazi manzillarni aniq o'qiydi" },
    lead: { ru: 'Соберём чтение, запись и проверку в одну памятку.', uz: "O'qish, yozish va tekshirishni bitta eslatmaga birlashtiramiz." },
    instruction: { ru: 'Полный способ соединяет структуру классов, точную запись и обратное чтение.', uz: "To'liq usul sinflar tuzilishi, aniq yozuv va qayta o'qishni birlashtiradi." },
    model: { kind: 'reward', badge: { ru: 'Модуль восстановлен', uz: 'Modul tiklandi' }, number: 'READ ↔ WRITE' },
    options: [
      { ru: 'Делю на классы, справа от старшего сохраняю по три разряда и проверяю запись обратным чтением', uz: "Sinflarga ajrataman, katta sinfdan o'ngda uchtadan xonani saqlayman va yozuvni qayta o'qib tekshiraman" },
      { ru: 'Читаю цифры по одной и пропускаю нули', uz: "Raqamlarni bittadan o'qiyman va nollarni tashlab ketaman" },
      { ru: 'Начинаю чтение справа и меняю классы местами', uz: "O'qishni o'ngdan boshlayman va sinflarni almashtiraman" },
      { ru: 'Проверяю только количество цифр', uz: 'Faqat raqamlar sonini tekshiraman' },
    ],
    correctIndex: 0,
    correctText: { ru: 'Способ полный: структура, точная запись и обратная проверка работают вместе.', uz: "Usul to'liq: tuzilish, aniq yozuv va qayta tekshiruv birga ishlaydi." },
    bridge: { ru: 'Следующий вопрос: какое значение получает каждая цифра на своём месте?', uz: "Keyingi savol: har bir raqam o'z o'rnida qanday qiymat oladi?" },
    wrong: [
      null,
      { ru: 'Так внутренние нули исчезнут и число изменится. Вернись к классам.', uz: "Bunday qilsangiz ichki nollar yo'qoladi va son o'zgaradi. Sinflarga qayting." },
      { ru: 'Чтение начинается слева, а порядок классов сохраняется.', uz: "O'qish chapdan boshlanadi va sinflar tartibi saqlanadi." },
      { ru: 'Количество цифр не проверяет их позиции. Нужна обратная проверка чтением.', uz: "Raqamlar soni ularning o'rnini tekshirmaydi. Qayta o'qib tekshirish kerak." },
    ],
    audio: {
      intro: { ru: ['Миссия завершена. Объединим чтение, запись и проверку многозначного числа в одну памятку.'], uz: ["Missiya yakunlandi. Ko'p xonali sonni o'qish, yozish va tekshirishni bitta eslatmaga birlashtiramiz."] },
      on_correct: { ru: 'Центр данных работает точно. Дальше выясним, какое значение получает цифра в каждом разряде.', uz: "Ma'lumotlar markazi aniq ishlayapti. Keyin raqam har bir xonada qanday qiymat olishini aniqlaymiz." },
      on_wrong: [
        null,
        { ru: 'Нули нужно сохранять, а группы читать как числа.', uz: "Nollarni saqlash, guruhlarni esa son sifatida o'qish kerak." },
        { ru: 'Классы читаются слева направо без перестановки.', uz: "Sinflar chapdan o'ngga almashtirmasdan o'qiladi." },
        { ru: 'Добавь проверку позиций с помощью обратного чтения.', uz: "Qayta o'qish yordamida o'rinlarni tekshirishni qo'shing." },
      ],
    },
  },
  s16: {
    eyebrow: { ru: 'Граница разрядов', uz: 'Xonalar chegarasi' },
    title: { ru: 'Пять цифр превращаются в шесть', uz: 'Beshta raqam oltita raqamga aylanadi' },
    lead: {
      ru: 'Один шаг после 99 999 расширяет старший класс тысяч и создаёт шестизначную запись.',
      uz: "99 999 dan keyingi bitta qadam katta minglar sinfini kengaytirib, olti xonali yozuv hosil qiladi.",
    },
    instruction: {
      ru: 'После 99 999 идёт 100 000: класс тысяч меняется с 99 на 100, а класс единиц полностью обнуляется.',
      uz: "99 999 dan keyin 100 000 keladi: minglar sinfi 99 dan 100 ga o'zgaradi, birlar sinfi esa to'liq nollanadi.",
    },
    model: {
      kind: 'classBoundary',
      badge: { ru: 'Переход через границу', uz: "Chegaradan o'tish" },
      before: '99 999',
      after: '100 000',
      beforeGroups: ['99', '999'],
      afterGroups: ['100', '000'],
      labels: [
        { ru: 'класс тысяч', uz: 'minglar sinfi' },
        { ru: 'класс единиц', uz: 'birlar sinfi' },
      ],
    },
    options: [
      { ru: '99 999 → 100 000', uz: '99 999 → 100 000' },
      { ru: '99 999 → 99 991', uz: '99 999 → 99 991' },
      { ru: '99 999 → 100 999', uz: '99 999 → 100 999' },
      { ru: '99 999 → 10 000', uz: '99 999 → 10 000' },
    ],
    correctIndex: 0,
    correctText: {
      ru: 'Перенос проходит через все пять девяток. Запись становится шестизначной, но группировка справа по три цифры не меняется.',
      uz: "O'tish beshta to'qqizning barchasidan o'tadi. Yozuv olti xonali bo'ladi, ammo o'ngdan uchtadan guruhlash o'zgarmaydi.",
    },
    wrong: [
      null,
      { ru: 'После последнего пятизначного числа начинается шестизначное.', uz: 'Oxirgi besh xonali sondan keyin olti xonali son boshlanadi.' },
      { ru: 'Класс единиц после переноса должен состоять из трёх нулей.', uz: "O'tishdan keyin birlar sinfi uchta noldan iborat bo'lishi kerak." },
      { ru: 'Число увеличивается, поэтому количество разрядов не может уменьшиться.', uz: 'Son oshadi, shuning uchun xonalar soni kamaymaydi.' },
    ],
    audio: {
      intro: {
        ru: [
          'Девяносто девять тысяч девятьсот девяносто девять завершает пятизначные числа.',
          'Следующий шаг переносит единицу через все девятки и создаёт сто тысяч.',
        ],
        uz: [
          "To'qson to'qqiz ming to'qqiz yuz to'qson to'qqiz besh xonali sonlarni yakunlaydi.",
          "Keyingi qadam birlikni barcha to'qqizlardan o'tkazib, yuz mingni hosil qiladi.",
        ],
      },
      on_correct: {
        ru: 'Старший класс расширяется до трёх цифр, а класс единиц становится полностью пустым.',
        uz: "Katta sinf uchta raqamgacha kengayadi, birlar sinfi esa to'liq bo'sh qoladi.",
      },
      on_wrong: [
        null,
        { ru: 'После всех девяток возникает новый старший разряд.', uz: "Barcha to'qqizlardan keyin yangi katta xona paydo bo'ladi." },
        { ru: 'Перенос оставляет справа три нуля.', uz: "O'tish o'ng tomonda uchta nol qoldiradi." },
        { ru: 'Новый разряд добавляется слева.', uz: "Yangi xona chap tomonga qo'shiladi." },
      ],
    },
  },
  s17: {
    eyebrow: { ru: 'Контраст нулей', uz: 'Nollar kontrasti' },
    title: { ru: 'Пустой класс и пустые разряды — не одно и то же', uz: "Bo'sh sinf va bo'sh xonalar bir xil emas" },
    lead: {
      ru: 'Числа 400 006 и 406 000 содержат нули в разных ролях, поэтому читаются по-разному.',
      uz: "400 006 va 406 000 sonlarida nollar turli vazifani bajaradi, shuning uchun ular turlicha o'qiladi.",
    },
    instruction: {
      ru: 'В 400 006 класс единиц содержит 6 единиц. В 406 000 весь класс единиц пуст и при чтении не называется.',
      uz: "400 006 da birlar sinfi 6 birlikni saqlaydi. 406 000 da butun birlar sinfi bo'sh va o'qishda aytilmaydi.",
    },
    model: {
      kind: 'zeroContrast',
      badge: { ru: 'Два положения нуля', uz: 'Nolning ikki holati' },
      cases: [
        {
          number: '400 006',
          groups: ['400', '006'],
          reading: { ru: 'четыреста тысяч шесть', uz: "to'rt yuz ming olti" },
          note: { ru: 'класс единиц не пуст', uz: "birlar sinfi bo'sh emas" },
        },
        {
          number: '406 000',
          groups: ['406', '000'],
          reading: { ru: 'четыреста шесть тысяч', uz: "to'rt yuz olti ming" },
          note: { ru: 'класс единиц полностью пуст', uz: "birlar sinfi to'liq bo'sh" },
        },
      ],
    },
    options: [
      { ru: 'Положение нулей меняет чтение и значение', uz: "Nollarning o'rni o'qish va qiymatni o'zgartiradi" },
      { ru: 'Оба числа читаются одинаково', uz: "Ikkala son bir xil o'qiladi" },
      { ru: 'Все нули можно удалить', uz: 'Barcha nollarni olib tashlash mumkin' },
      { ru: 'Пустой класс нужно произнести словом ноль', uz: "Bo'sh sinfni nol so'zi bilan aytish kerak" },
    ],
    correctIndex: 0,
    correctText: {
      ru: 'Внутренние нули удерживают места внутри непустого класса. Полностью пустой класс сохраняется в записи как 000, но вслух пропускается.',
      uz: "Ichki nollar bo'sh bo'lmagan sinf ichidagi o'rinlarni saqlaydi. To'liq bo'sh sinf yozuvda 000 bo'lib qoladi, ammo ovozda aytilmaydi.",
    },
    wrong: [
      null,
      { ru: 'Цифра 6 находится в разных классах и получает разное значение.', uz: "6 raqami turli sinflarda joylashib, turli qiymat oladi." },
      { ru: 'Удаление нулей сдвинет цифру 6 в другие разряды.', uz: "Nollarni olib tashlash 6 raqamini boshqa xonalarga siljitadi." },
      { ru: 'Пустой класс не произносится отдельно, но три его места сохраняются.', uz: "Bo'sh sinf alohida aytilmaydi, ammo uning uchta o'rni saqlanadi." },
    ],
    audio: {
      intro: {
        ru: [
          'Сравним четыреста тысяч шесть и четыреста шесть тысяч.',
          'В первом числе класс единиц содержит шесть, а во втором он полностью пуст.',
        ],
        uz: [
          "To'rt yuz ming olti va to'rt yuz olti ming sonlarini solishtiramiz.",
          "Birinchi sonda birlar sinfi oltini saqlaydi, ikkinchisida esa u to'liq bo'sh.",
        ],
      },
      on_correct: {
        ru: 'Нули внутри непустого класса удерживают места. Полностью пустой класс в чтении не называем.',
        uz: "Bo'sh bo'lmagan sinf ichidagi nollar o'rinlarni saqlaydi. To'liq bo'sh sinfni o'qishda aytmaymiz.",
      },
      on_wrong: [
        null,
        { ru: 'Сначала определи, в каком классе стоит цифра шесть.', uz: "Avval olti raqami qaysi sinfda turganini aniqlang." },
        { ru: 'Нули сохраняют разряды и менять их нельзя.', uz: "Nollar xonalarni saqlaydi, ularni o'zgartirib bo'lmaydi." },
        { ru: 'Пустую группу не произносим отдельным словом.', uz: "Bo'sh guruhni alohida so'z bilan aytmaymiz." },
      ],
    },
  },
  s18: {
    eyebrow: { ru: 'Лаборатория диктанта', uz: 'Diktant laboratoriyasi' },
    title: { ru: 'Три городских кода от голоса до проверки', uz: 'Uchta shahar kodi ovozdan tekshiruvgacha' },
    lead: {
      ru: 'Каждый код проходит полный путь: услышать, разделить на классы, записать и прочитать обратно.',
      uz: "Har bir kod to'liq yo'lni o'tadi: eshitish, sinflarga ajratish, yozish va qayta o'qish.",
    },
    instruction: {
      ru: 'Открой все три решения и проследи, как словесная форма превращается в точную запись.',
      uz: "Uchala yechimni ochib, so'zli shakl aniq yozuvga qanday aylanishini kuzating.",
    },
    model: { kind: 'cityLab', badge: { ru: 'Три пакета данных', uz: "Uchta ma'lumot paketi" } },
    items: [
      {
        station: 'A-47',
        spoken: { ru: 'двести тридцать тысяч сорок семь', uz: "ikki yuz o'ttiz ming qirq yetti" },
        groups: ['230', '047'],
        written: '230 047',
        readBack: { ru: 'двести тридцать тысяч сорок семь', uz: "ikki yuz o'ttiz ming qirq yetti" },
        note: { ru: 'ноль сотен удерживает 47 в десятках и единицах', uz: "nol yuzlik 47 ni o'nlar va birlarda saqlaydi" },
        audio: {
          intro: { ru: 'Станция передала двести тридцать тысяч сорок семь.', uz: "Stansiya ikki yuz o'ttiz ming qirq yetti sonini uzatdi." },
          on_correct: { ru: 'Записываем две группы и читаем обратно без потери нуля сотен.', uz: "Ikki guruhni yozib, nol yuzlikni yo'qotmasdan qayta o'qiymiz." },
        },
      },
      {
        station: 'B-08',
        spoken: { ru: 'пятьсот шесть тысяч восемь', uz: 'besh yuz olti ming sakkiz' },
        groups: ['506', '008'],
        written: '506 008',
        readBack: { ru: 'пятьсот шесть тысяч восемь', uz: 'besh yuz olti ming sakkiz' },
        note: { ru: 'два нуля сохраняют 8 в единицах', uz: "ikkita nol 8 ni birlar xonasida saqlaydi" },
        audio: {
          intro: { ru: 'Следующая станция передала пятьсот шесть тысяч восемь.', uz: 'Keyingi stansiya besh yuz olti ming sakkiz sonini uzatdi.' },
          on_correct: { ru: 'В правой группе восемь занимает единицы, поэтому перед ним остаются два нуля.', uz: "O'ng guruhda sakkiz birlar xonasida, shuning uchun undan oldin ikkita nol qoladi." },
        },
      },
      {
        station: 'C-90',
        spoken: { ru: 'девяносто тысяч девятьсот', uz: "to'qson ming to'qqiz yuz" },
        groups: ['90', '900'],
        written: '90 900',
        readBack: { ru: 'девяносто тысяч девятьсот', uz: "to'qson ming to'qqiz yuz" },
        note: { ru: 'старший класс может содержать две цифры', uz: "katta sinf ikkita raqamdan iborat bo'lishi mumkin" },
        audio: {
          intro: { ru: 'Третий код звучит как девяносто тысяч девятьсот.', uz: "Uchinchi kod to'qson ming to'qqiz yuz deb aytiladi." },
          on_correct: { ru: 'Старший класс записываем двумя цифрами, а правый класс сохраняем полной тройкой.', uz: "Katta sinfni ikkita raqam bilan, o'ng sinfni esa to'liq uchlik bilan yozamiz." },
        },
      },
    ],
    options: [
      { ru: 'Все три записи подтверждены обратным чтением', uz: "Uchala yozuv qayta o'qish bilan tasdiqlangan" },
      { ru: 'Нули в правых группах можно убрать', uz: "O'ng guruhlardagi nollarni olib tashlash mumkin" },
      { ru: 'Старший класс всегда должен иметь три цифры', uz: "Katta sinf har doim uchta raqamli bo'lishi kerak" },
      { ru: 'Коды нужно читать по отдельным цифрам', uz: "Kodlarni alohida raqamlar bo'yicha o'qish kerak" },
    ],
    correctIndex: 0,
    correctText: {
      ru: 'Полный цикл совпал для каждого кода: голос, классы, запись и обратное чтение обозначают одно число.',
      uz: "Har bir kod uchun to'liq sikl mos keldi: ovoz, sinflar, yozuv va qayta o'qish bitta sonni bildiradi.",
    },
    wrong: [
      null,
      { ru: 'Нули сохраняют точные места цифр в классе единиц.', uz: "Nollar birlar sinfidagi raqamlarning aniq o'rnini saqlaydi." },
      { ru: 'Только классы справа от старшего всегда записываются тремя цифрами.', uz: "Faqat katta sinfdan o'ngdagi sinflar doim uchta raqam bilan yoziladi." },
      { ru: 'Каждую группу читаем как целое число.', uz: "Har bir guruhni yaxlit son sifatida o'qiymiz." },
    ],
    audio: {
      intro: {
        ru: ['Разберём три новых городских кода от диктанта до обратной проверки.'],
        uz: ["Uchta yangi shahar kodini diktantdan qayta tekshiruvgacha tahlil qilamiz."],
      },
      on_correct: {
        ru: 'Во всех трёх пакетах запись и обратное чтение совпадают.',
        uz: "Uchala paketda yozuv va qayta o'qish bir-biriga mos keladi.",
      },
      on_wrong: [
        null,
        { ru: 'Сохраняй каждое место правой группы.', uz: "O'ng guruhning har bir o'rnini saqlang." },
        { ru: 'Старший класс может быть короче трёх цифр.', uz: "Katta sinf uchta raqamdan qisqa bo'lishi mumkin." },
        { ru: 'Читай классы целиком слева направо.', uz: "Sinflarni chapdan o'ngga yaxlit o'qing." },
      ],
    },
  },
};

// The flow is intentionally compact: connected ideas live on one deep screen
// instead of being stretched across several one-fact slides.
const SCREEN_META = [
  { id: 's0', type: 'hook', subtype: 'story-problem', template: 'MissionTheory', goal: 'Frame the lost-structure city-code problem', misconceptions: ['digit-by-digit reading', 'dropping zero'], active: false, scored: false, scope: 'hook' },
  { id: 's1', type: 'exploration', subtype: 'foundation-to-classes', template: 'DeepSequence', goal: 'Connect familiar places with three-place classes', misconceptions: ['swapped places', 'grouping from the left'], active: false, scored: false, scope: null },
  { id: 's2', type: 'exploration', subtype: 'class-reading-and-zero', template: 'DeepSequence', goal: 'Read whole classes and preserve internal zero places', misconceptions: ['digit-by-digit reading', 'dropping zero', 'reversed class order'], active: false, scored: false, scope: null },
  { id: 's3', type: 'exploration', subtype: 'empty-class-zero-contrast', template: 'ZeroContrastTheory', goal: 'Distinguish an empty class from zero places inside a non-empty class', misconceptions: ['all zeros are removable', 'empty class is spoken'], active: false, scored: false, scope: null },
  { id: 's4', type: 'exploration', subtype: 'writing-reading-inverse', template: 'DeepSequence', goal: 'Move from spoken form to notation and back', misconceptions: ['place shift', 'missing class name'], active: false, scored: false, scope: null },
  { id: 's5', type: 'exploration', subtype: 'five-six-digit-boundary', template: 'ClassBoundaryTheory', goal: 'Explain the transition from 99 999 to 100 000', misconceptions: ['drop a place after carrying', 'misgroup from left'], active: false, scored: false, scope: null },
  { id: 's6', type: 'exploration', subtype: 'reverse-check-discovery', template: 'TheoryScreen', goal: 'Use reverse reading as a verification strategy', misconceptions: ['digit-count checking', 'reading zeros aloud'], active: false, scored: false, scope: null },
  { id: 's7', type: 'rule', subtype: 'rule-assembly-reveal', template: 'RuleReveal', goal: 'Assemble the complete reading and writing algorithm', misconceptions: ['right-to-left reading'], active: false, scored: false, scope: null },
  { id: 's8', type: 'test', subtype: 'numeric-mini-check', template: 'NumInputScreen', goal: 'Write a four-digit number with an internal zero', misconceptions: ['padding the highest class'], active: true, scored: true, scope: 'module-mikro' },
  { id: 's9', type: 'exploration', subtype: 'worked-solution-wall', template: 'WorkedExamplesScreen', goal: 'Study one full conversion and four contrasting solved examples', misconceptions: ['place and zero errors'], active: false, scored: false, scope: null },
  { id: 's10', type: 'exploration', subtype: 'city-dictation-readback-lab', template: 'CityCodeLab', goal: 'Trace three complete dictation-to-read-back solutions', misconceptions: ['short highest class', 'dropping right-group zeros'], active: false, scored: false, scope: null },
  { id: 's11', type: 'exploration', subtype: 'strategy-walkthrough', template: 'StrategyTheory', goal: 'Compare verification strategies', misconceptions: ['digit-sum checking'], active: false, scored: false, scope: null },
  { id: 's12', type: 'case', subtype: 'error-walkthrough', template: 'ErrorWalkthrough', goal: 'Repair a missing zero and explain the affected place', misconceptions: ['class swap'], active: false, scored: false, scope: null },
  { id: 's13', type: 'test', subtype: 'final-transfer', template: 'MCScreen', goal: 'Transfer reading and writing to a city address', misconceptions: ['place shift'], active: true, scored: true, scope: 'final' },
  { id: 's14', type: 'summary', subtype: 'theory-summary', template: 'SummaryTheory', goal: 'Summarize the complete strategy and bridge forward', misconceptions: ['partial checking'], active: false, scored: false, scope: null },
];

const TOTAL_SCREENS = 15;
const FREE_NAV = false;
const MOBILE_DESIGN_W = 390;
const NOTION_FLOW = [
  ['s0'],
  ['s1', 's2'],
  ['s3', 's4'],
  ['s17'],
  ['s5', 's6'],
  ['s16'],
  ['s8'],
  ['s9'],
  ['s7'],
  ['s10', 's11'],
  ['s18'],
  ['s12'],
  ['s13'],
  ['s14'],
  ['s15'],
].map((contentKeys, screen) => ({ screen, meta: SCREEN_META[screen], contentKeys }));

const LESSON_META = {
  lessonId: 'num-4-02-v1',
  lessonTitle: {
    ru: 'Урок 2. Чтение и запись многозначных чисел',
    uz: "2-dars. Ko'p xonali sonlarni o'qish va yozish",
  },
  skillTags: ['multi_digit_reading', 'multi_digit_writing', 'class_grouping', 'internal_zero', 'reverse_check'],
  notionFlow: NOTION_FLOW,
};

let runtimeConfig = {
  ttsApiBase: '',
  correctSoundUrl: '',
  wrongSoundUrl: '',
  studentName: '',
  voiceGender: 'f',
};

const configureLesson = (next) => {
  runtimeConfig = { ...runtimeConfig, ...next };
};

const LangContext = createContext('ru');
const useLang = () => useContext(LangContext);

const useT = () => {
  const lang = useLang();
  return useCallback((value) => {
    if (value === null || value === undefined) return '';
    if (React.isValidElement(value)) return value;
    if (typeof value === 'string' || typeof value === 'number') return String(value);
    return value[lang] ?? value.ru ?? '';
  }, [lang]);
};

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false,
  );
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const update = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [breakpoint]);
  return isMobile;
}

function useMobileZoom(breakpoint = 640) {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const root = document.documentElement;
    const update = () => {
      const zoom = window.innerWidth < breakpoint ? window.innerWidth / MOBILE_DESIGN_W : 1;
      root.style.setProperty('--g4z', String(zoom));
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
      root.style.removeProperty('--g4z');
    };
  }, [breakpoint]);
}

const buildTtsUrl = (base, text, gender) => {
  const encoded = encodeURIComponent(String(text).slice(0, 1000));
  return `${base}/api/tts?text=${encoded}&g=${gender === 'm' ? 'm' : 'f'}`;
};

class AudioEngine {
  constructor() {
    this.queue = [];
    this.index = 0;
    this.audio = null;
    this.previewUtterance = null;
    this.previewTimer = null;
    this.lang = 'ru';
    this.muted = false;
    this.isPlaying = false;
    this.onStateChange = null;
  }

  emit(extra = {}) {
    this.onStateChange?.({ isPlaying: this.isPlaying, muted: this.muted, ...extra });
  }

  ensureAudio() {
    if (!this.audio && typeof window !== 'undefined') {
      this.audio = new Audio();
      this.audio.crossOrigin = 'anonymous';
      this.audio.preload = 'auto';
    }
    return this.audio;
  }

  setLang(lang) {
    this.lang = lang;
  }

  loadQueue(segments) {
    this.stop(false);
    this.queue = Array.isArray(segments) ? segments : [];
    this.index = 0;
  }

  start() {
    if (this.muted) {
      this.emit({ completed: true, currentSegment: null });
      return;
    }
    this.emit({ completed: false });
    this.playCurrent();
  }

  playCurrent() {
    const segment = this.queue[this.index];
    if (!segment) {
      this.isPlaying = false;
      this.emit({ completed: true, currentSegment: null });
      return;
    }
    this.playText(segment.text, () => {
      this.index += 1;
      this.playCurrent();
    }, segment.id);
  }

  playText(text, done, id = 'one-off') {
    if (!text || this.muted) {
      done?.();
      return;
    }
    const base = runtimeConfig.ttsApiBase;
    if (base) {
      const audio = this.ensureAudio();
      if (!audio) {
        done?.();
        return;
      }
      audio.onended = () => {
        this.isPlaying = false;
        this.emit({ currentSegment: null });
        done?.();
      };
      audio.onerror = () => {
        this.isPlaying = false;
        this.emit({ currentSegment: null });
        done?.();
      };
      audio.src = buildTtsUrl(base, text, runtimeConfig.voiceGender);
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise.then(() => {
          this.isPlaying = true;
          this.emit({ currentSegment: id });
        }).catch(() => {
          this.isPlaying = false;
          this.emit({ completed: true, currentSegment: null });
          done?.();
        });
      }
      return;
    }

    // Local preview only. LMS playback keeps using the HTTP TTS branch above.
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      done?.();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(String(text));
    utterance.lang = this.lang === 'uz' ? 'uz-UZ' : 'ru-RU';
    utterance.rate = 0.94;
    utterance.onstart = () => {
      this.isPlaying = true;
      this.emit({ currentSegment: id });
    };
    utterance.onend = () => {
      if (this.previewUtterance === utterance) this.previewUtterance = null;
      this.isPlaying = false;
      this.emit({ currentSegment: null });
      done?.();
    };
    utterance.onerror = () => {
      if (this.previewUtterance === utterance) this.previewUtterance = null;
      this.isPlaying = false;
      this.emit({ currentSegment: null });
      done?.();
    };
    this.previewUtterance = utterance;
    this.previewTimer = window.setTimeout(() => {
      this.previewTimer = null;
      if (this.previewUtterance !== utterance || this.muted) return;
      try {
        window.speechSynthesis.speak(utterance);
      } catch {
        this.previewUtterance = null;
        done?.();
      }
    }, 50);
  }

  pushOneOff(text) {
    this.stop(false);
    this.queue = [{ id: `feedback-${Date.now()}`, text }];
    this.index = 0;
    this.start();
  }

  replay() {
    this.stop(false);
    this.index = 0;
    this.start();
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) {
      this.stop(false);
      this.emit({ completed: true, currentSegment: null });
      return;
    }
    this.index = 0;
    this.start();
  }

  stop(emit = true) {
    if (this.audio) {
      try {
        this.audio.pause();
        this.audio.onended = null;
        this.audio.onerror = null;
      } catch {
        // Audio cleanup is best effort.
      }
    }
    if (this.previewTimer !== null && typeof window !== 'undefined') {
      window.clearTimeout(this.previewTimer);
      this.previewTimer = null;
    }
    if (this.previewUtterance) {
      this.previewUtterance.onstart = null;
      this.previewUtterance.onend = null;
      this.previewUtterance.onerror = null;
      this.previewUtterance = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Preview speech cleanup is best effort.
      }
    }
    this.isPlaying = false;
    if (emit) this.emit({ currentSegment: null });
  }
}

let audioEngineInstance = null;
const getAudioEngine = () => {
  if (typeof window === 'undefined') return null;
  if (!audioEngineInstance) audioEngineInstance = new AudioEngine();
  return audioEngineInstance;
};

function useAudio(segments) {
  const lang = useLang();
  const initiallyMuted = audioEngineInstance?.muted ?? false;
  const [state, setState] = useState({
    isPlaying: false,
    muted: initiallyMuted,
    completed: initiallyMuted,
    currentSegment: null,
  });

  /* eslint-disable react-hooks/refs -- stable queue prevents audio restart loops */
  const segmentsRef = useRef(segments);
  const segmentsKey = segments ? JSON.stringify(segments) : '';
  const previousKeyRef = useRef(segmentsKey);
  if (previousKeyRef.current !== segmentsKey) {
    segmentsRef.current = segments;
    previousKeyRef.current = segmentsKey;
  }
  const stableSegments = segmentsRef.current;
  /* eslint-enable react-hooks/refs */

  useEffect(() => {
    const engine = getAudioEngine();
    if (!engine) return undefined;
    engine.setLang(lang);
    engine.onStateChange = (next) => setState((previous) => ({ ...previous, ...next }));
    engine.loadQueue(stableSegments);
    if (stableSegments?.length && !engine.muted) {
      const timer = window.setTimeout(() => engine.start(), 250);
      return () => {
        window.clearTimeout(timer);
        engine.stop(false);
        engine.onStateChange = null;
      };
    }
    engine.emit({ completed: true, currentSegment: null });
    return () => {
      engine.stop(false);
      engine.onStateChange = null;
    };
  }, [stableSegments, lang]);

  return {
    ...state,
    replay: () => getAudioEngine()?.replay(),
    toggleMute: () => getAudioEngine()?.toggleMute(),
    pushOneOff: (text) => getAudioEngine()?.pushOneOff(text),
  };
}

const localizedSegments = (audioValue, lang, prefix) => {
  if (!audioValue) return [];
  const localized = audioValue[lang] ?? audioValue.ru ?? '';
  const values = Array.isArray(localized) ? localized : [localized];
  return values.filter(Boolean).map((text, index) => ({ id: `${prefix}-${index}`, text }));
};

function useCanAnswer(audio) {
  const [timedOut, setTimedOut] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setTimedOut(true), 12000);
    return () => window.clearTimeout(timer);
  }, []);
  return FREE_NAV || audio.muted || audio.completed || timedOut;
}

function useAdvanceGate(solved, audio) {
  const [delayElapsed, setDelayElapsed] = useState(false);
  useEffect(() => {
    if (!solved) return undefined;
    const timer = window.setTimeout(() => setDelayElapsed(true), 1200);
    return () => window.clearTimeout(timer);
  }, [solved]);
  if (FREE_NAV) return true;
  if (!solved) return false;
  if (audio.muted) return true;
  return delayElapsed && !audio.isPlaying;
}

const playSfx = (kind) => {
  const url = kind === 'correct' ? runtimeConfig.correctSoundUrl : runtimeConfig.wrongSoundUrl;
  if (!url || typeof window === 'undefined') return;
  try {
    const sound = new Audio(url);
    sound.volume = 0.6;
    const promise = sound.play();
    promise?.catch?.(() => {});
  } catch {
    // SFX must never block the lesson.
  }
};

const buildOptionOrder = (length, correctIndex, seed = 0) => {
  const natural = Array.from({ length }, (_, index) => index);
  if (length < 2 || !natural.includes(correctIndex)) return natural;
  const target = Math.abs(seed * 3 + 1) % length;
  const order = natural.filter((index) => index !== correctIndex);
  order.splice(target, 0, correctIndex);
  return order;
};

const autoScrollTo = (element) => {
  if (!element || typeof element.scrollIntoView !== 'function') return;
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  element.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest' });
};

function useRevealScroll(active, delay = 320) {
  const ref = useRef(null);
  useEffect(() => {
    if (!active) return undefined;
    let timer = 0;
    const firstFrame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        timer = window.setTimeout(() => autoScrollTo(ref.current), delay);
      });
    });
    return () => {
      cancelAnimationFrame(firstFrame);
      window.clearTimeout(timer);
    };
  }, [active, delay]);
  return ref;
}

const AudioIndicator = ({ audio }) => {
  const lang = useLang();
  const muteLabel = audio.muted
    ? (lang === 'uz' ? 'Ovozni yoqish' : 'Включить звук')
    : (lang === 'uz' ? "Ovozni o'chirish" : 'Выключить звук');
  const replayLabel = lang === 'uz' ? 'Qayta eshitish' : 'Повторить';
  return (
    <div className="audio-controls">
      <button type="button" className="icon-btn" onClick={audio.toggleMute} aria-label={muteLabel} title={muteLabel}>
        {audio.muted ? '🔇' : (audio.isPlaying ? '🔊' : '🔉')}
      </button>
      {!audio.muted && (
        <button type="button" className="icon-btn" onClick={audio.replay} aria-label={replayLabel} title={replayLabel}>
          ↻
        </button>
      )}
    </div>
  );
};

// The same canonical Bit used by the approved grade 4 base lesson.
const BitSVG = ({ state = 'present', className = '' }) => {
  const isWave = state === 'wave';
  const isHappy = state === 'happy' || isWave || state === 'idea' || state === 'nod';
  const isThinking = state === 'hint' || state === 'think';
  const isAwkward = state === 'awkward';

  return (
  <svg className={`g1-char g1-char-bit g1-char-state-${state} ${className}`} viewBox="0 0 120 150" aria-hidden="true">
    <defs>
      <linearGradient id="g4bbody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#E2ECF2" />
        <stop offset="100%" stopColor="#B6C7D2" />
      </linearGradient>
      <linearGradient id="g4bhead" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#EBF2F6" />
        <stop offset="100%" stopColor="#C4D3DC" />
      </linearGradient>
    </defs>
    <ellipse cx="60" cy="140" rx="30" ry="5" fill="rgba(58,53,48,0.13)" />
    <g className="g1-bit-ant">
      <path d="M60 30 V14" stroke="#9FB3BF" strokeWidth="4" strokeLinecap="round" />
      <circle cx="60" cy="11" r="6" fill="#FF4F28" />
      <circle cx="58" cy="9" r="2" fill="#FFB9A6" />
    </g>
    <rect x="44" y="118" width="12" height="16" rx="5" fill="#9FB3BF" />
    <rect x="64" y="118" width="12" height="16" rx="5" fill="#9FB3BF" />
    <rect x="34" y="60" width="52" height="62" rx="18" fill="url(#g4bbody)" stroke="#A9BCC8" strokeWidth="2" />
    <rect x="44" y="104" width="32" height="10" rx="5" fill="#A9BCC8" opacity="0.5" />
    {(state === 'happy' || isWave) && (
      <g className={isWave ? 'bit-double-wave' : ''}>
        <g className="bit-wave-left">
          <path d="M36 74 C 26 66 22 56 22 48" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="22" cy="47" r="5" fill="#B6C7D2" />
        </g>
        <g className="bit-wave-right">
          <path d="M84 74 C 94 66 98 56 98 48" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="98" cy="47" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    {state === 'present' && (
      <g>
        <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="103" r="5" fill="#B6C7D2" />
        <g className="g1-bit-wave">
          <path d="M84 74 C 96 66 100 54 98 44" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="98" cy="43" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    {isThinking && (
      <g>
        <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="103" r="5" fill="#B6C7D2" />
        <g className="bit-think-hand">
          <path d="M84 76 C 92 74 92 66 84 61" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="83" cy="60" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    {isAwkward && (
      <g className="bit-awkward-hands">
        <path d="M36 76 C 39 88 46 96 54 99" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="54" cy="99" r="5" fill="#B6C7D2" />
        <path d="M84 76 C 81 88 74 96 66 99" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="66" cy="99" r="5" fill="#B6C7D2" />
      </g>
    )}
    {state === 'point' && (
      <g>
        <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="103" r="5" fill="#B6C7D2" />
        <g className="bit-point-arm">
          <path d="M84 76 C 94 72 101 67 108 62" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="109" cy="61" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    {state === 'idea' && (
      <g>
        <path d="M36 76 C 29 82 27 91 30 101" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="102" r="5" fill="#B6C7D2" />
        <path d="M84 76 C 92 68 95 58 94 50" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="94" cy="49" r="5" fill="#B6C7D2" />
      </g>
    )}
    {state === 'focus' && (
      <g className="bit-focus-hands">
        <path d="M36 77 C 41 88 47 93 53 94" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="53" cy="94" r="5" fill="#B6C7D2" />
        <path d="M84 77 C 79 88 73 93 67 94" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="67" cy="94" r="5" fill="#B6C7D2" />
      </g>
    )}
    {state === 'nod' && (
      <g>
        <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="103" r="5" fill="#B6C7D2" />
        <g className="bit-nod-hand">
          <path d="M84 75 C 93 70 99 62 99 54" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="99" cy="53" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    <rect x="28" y="28" width="64" height="46" rx="16" fill="url(#g4bhead)" stroke="#A9BCC8" strokeWidth="2" />
    <rect x="36" y="36" width="48" height="30" rx="10" fill="#16242C" />
    <path d="M40 40 h18 a4 4 0 0 1 -4 8 h-14 Z" fill="rgba(255,255,255,0.08)" />
    <g className="g1-eyes" fill="#5BD6F2">
      {isAwkward
        ? <><ellipse cx="50" cy="53" rx="4.8" ry="3.2" /><ellipse cx="70" cy="53" rx="4.8" ry="3.2" /></>
        : isThinking
        ? <><circle cx="50" cy="50" r="4.5" /><circle cx="70" cy="49" r="5.5" /></>
        : <><circle cx="50" cy="50" r="5" /><circle cx="70" cy="50" r="5" /></>}
    </g>
    {isHappy && <path d="M50 58 Q60 65 70 58" stroke="#5BD6F2" strokeWidth="2.6" fill="none" strokeLinecap="round" />}
    {(state === 'present' || state === 'point' || state === 'focus') && <path d="M52 58 h16" stroke="#5BD6F2" strokeWidth="2.6" strokeLinecap="round" />}
    {isThinking && <circle cx="60" cy="59" r="2.4" fill="#5BD6F2" />}
    {isAwkward && (
      <g className="bit-awkward-face">
        <path d="M53 62 Q60 57 67 62" stroke="#5BD6F2" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <circle cx="43" cy="59" r="4" fill="#FF9B8A" opacity=".5" />
        <circle cx="77" cy="59" r="4" fill="#FF9B8A" opacity=".5" />
      </g>
    )}
    {isThinking && (
      <g>
        <circle cx="99" cy="38" r="9" fill="#FFC23C" />
        <text x="99" y="42.5" textAnchor="middle" fontSize="12" fontWeight="800" fill="#5A3A00">?</text>
      </g>
    )}
    {state === 'point' && (
      <g className="bit-point-target">
        <circle cx="110" cy="61" r="8" fill="none" stroke="#FF5B35" strokeWidth="2" />
        <circle cx="110" cy="61" r="2" fill="#FF5B35" />
      </g>
    )}
    {state === 'idea' && (
      <g className="bit-idea-bulb">
        <circle cx="99" cy="36" r="9" fill="#FFC23C" />
        <path d="M95 36 Q99 31 103 36 M97 42 h4" stroke="#7A5200" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </g>
    )}
    {state === 'focus' && (
      <g className="bit-focus-scan">
        <path d="M43 45 h34" stroke="#95C93D" strokeWidth="2" strokeLinecap="round" />
        <circle cx="80" cy="45" r="3" fill="#95C93D" />
      </g>
    )}
    {state === 'nod' && (
      <g className="bit-nod-check">
        <circle cx="99" cy="38" r="9" fill="#95C93D" />
        <path d="M95 38 l3 3 6-7" stroke="#FFFFFF" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    )}
  </svg>
  );
};

const FeedbackBlock = ({ show, correct, children }) => {
  const lang = useLang();
  const revealRef = useRevealScroll(show);
  return (
    <div ref={revealRef} className={`feedback ${show ? 'feedback-visible' : ''}`} aria-hidden={!show} aria-live="polite">
      <div className={`feedback-card ${correct ? 'feedback-correct' : 'feedback-hint'}`}>
        <BitSVG state={correct ? 'nod' : 'awkward'} />
        <div>
          <strong>{correct ? (lang === 'uz' ? 'YECHIM' : 'РЕШЕНИЕ') : (lang === 'uz' ? "YANA O'YLANG" : 'ПРОВЕРЬ СТРАТЕГИЮ')}</strong>
          <p>{children}</p>
        </div>
      </div>
    </div>
  );
};

const ScreenTypeLabel = ({ type }) => {
  const lang = useLang();
  const labels = {
    hook: lang === 'uz' ? 'Missiya' : 'Миссия',
    diagnostic: lang === 'uz' ? 'Diagnostika' : 'Диагностика',
    exploration: lang === 'uz' ? 'Kashfiyot' : 'Исследование',
    rule: lang === 'uz' ? 'Qoida' : 'Правило',
    practice: lang === 'uz' ? 'Mashq' : 'Практика',
    test: lang === 'uz' ? 'Tekshiruv' : 'Проверка',
    case: lang === 'uz' ? 'Vazifa' : 'Задача',
    summary: lang === 'uz' ? 'Yakun' : 'Итог',
  };
  return <span className="screen-type">{labels[type] ?? type}</span>;
};

const MOBILE_AUTO_SCROLL_TARGETS = [
  '.feedback-visible',
  '.theory-callout',
  '.worked-example-card',
  '.bridge-card',
];

const Stage = ({ screen, eyebrow, audio, children, nav }) => {
  const t = useT();
  const isMobile = useIsMobile();
  const contentRef = useRef(null);
  const pad = isMobile ? 14 : 48;
  const meta = SCREEN_META[screen];

  useEffect(() => {
    const scroller = contentRef.current;
    if (!isMobile || !scroller) return undefined;

    scroller.scrollTo({ top: 0, behavior: 'auto' });
    let frameId = 0;
    let settleTimer = 0;
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const revealCurrentTarget = () => {
      const target = MOBILE_AUTO_SCROLL_TARGETS
        .map((selector) => scroller.querySelector(selector))
        .find(Boolean);
      if (!target) return;

      const viewport = scroller.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const safeTop = viewport.top + 10;
      const safeBottom = viewport.bottom - 14;
      let nextTop = scroller.scrollTop;

      if (targetRect.bottom > safeBottom) {
        nextTop += targetRect.bottom - safeBottom;
      } else if (targetRect.top < safeTop) {
        nextTop -= safeTop - targetRect.top;
      } else {
        return;
      }

      const maxTop = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
      scroller.scrollTo({
        top: Math.max(0, Math.min(nextTop, maxTop)),
        behavior: reducedMotion ? 'auto' : 'smooth',
      });
    };

    const scheduleReveal = () => {
      cancelAnimationFrame(frameId);
      window.clearTimeout(settleTimer);
      frameId = requestAnimationFrame(revealCurrentTarget);
      settleTimer = window.setTimeout(revealCurrentTarget, 720);
    };

    const observer = new MutationObserver(scheduleReveal);
    observer.observe(scroller, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['class', 'aria-hidden'],
    });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameId);
      window.clearTimeout(settleTimer);
    };
  }, [isMobile, screen]);

  return (
    <main className={`stage stage-${meta.type}`}>
      <header className="stage-header" style={{ paddingLeft: pad, paddingRight: pad }}>
        <div className="progress-track" aria-label={`${screen + 1} / ${TOTAL_SCREENS}`}>
          <div className="progress-bar" style={{ width: `${((screen + 1) / TOTAL_SCREENS) * 100}%` }} />
        </div>
        <div className="stage-chrome">
          <div className="chrome-title"><span className="status-dot" /><span>{t(eyebrow)}</span></div>
          <div className="chrome-actions">
            <ScreenTypeLabel type={meta.type} />
            {audio && <AudioIndicator audio={audio} />}
            <span className="screen-count">{String(screen + 1).padStart(2, '0')} / {TOTAL_SCREENS}</span>
          </div>
        </div>
      </header>
      <section ref={contentRef} className="stage-content" style={{ paddingLeft: pad, paddingRight: pad }}>
        {children}
      </section>
      <footer className="stage-nav" style={{ paddingLeft: pad, paddingRight: pad }}>{nav}</footer>
    </main>
  );
};

const ModelPanel = ({ model, solved }) => {
  const t = useT();
  if (!model) return null;
  return (
    <div className={`model-panel model-${model.kind} ${solved ? 'model-solved' : ''}`}>
      <div className="model-heading">
        <span>{t(model.badge)}</span>
        {model.kind === 'city' && <i aria-hidden="true">● ● ●</i>}
      </div>
      {model.kind === 'classBoundary' && (
        <div className="class-boundary-model">
          <div className="class-boundary-state boundary-before">
            <span>{model.before}</span>
            <div>
              {model.beforeGroups.map((group, index) => <strong key={`${group}-${index}`}><i>{t(model.labels[index])}</i>{group}</strong>)}
            </div>
          </div>
          <div className="class-boundary-carry" aria-hidden="true"><b>+1</b><span>→</span></div>
          <div className="class-boundary-state boundary-after">
            <span>{model.after}</span>
            <div>
              {model.afterGroups.map((group, index) => <strong key={`${group}-${index}`}><i>{t(model.labels[index])}</i>{group}</strong>)}
            </div>
          </div>
        </div>
      )}
      {model.kind === 'zeroContrast' && (
        <div className="zero-contrast-model">
          {model.cases.map((item, index) => (
            <article style={{ '--model-delay': `${index * 170}ms` }} key={item.number}>
              <div className="zero-contrast-number">{item.groups.map((group, groupIndex) => <strong className={group === '000' ? 'empty-class' : ''} key={`${group}-${groupIndex}`}>{group}</strong>)}</div>
              <p>{t(item.reading)}</p>
              <span>{t(item.note)}</span>
            </article>
          ))}
        </div>
      )}
      {model.number && <div className="model-number">{model.number}</div>}
      {model.groups && (
        <div className="class-groups">
          {model.groups.map((group, index) => (
            <div className={`class-group group-${group.tone ?? (index ? 'accent' : 'cyan')}`} key={`${group.value}-${index}`}>
              <strong>{group.value}</strong><span>{t(group.label)}</span>
            </div>
          ))}
        </div>
      )}
      {model.columns && (
        <div className="place-table" style={{ gridTemplateColumns: `repeat(${model.columns.length}, minmax(0, 1fr))` }}>
          {model.columns.map((column, index) => (
            <div className="place-cell" key={`${column.value}-${index}`}>
              <span>{t(column.label)}</span><strong>{column.value}</strong>
            </div>
          ))}
        </div>
      )}
      {model.rows && (
        <div className="model-rows">
          {model.rows.map((row, index) => (
            <div key={`${row.value}-${index}`}><span>{t(row.label)}</span><strong>{row.value}</strong></div>
          ))}
        </div>
      )}
      {model.steps && (
        <ol className="model-steps">
          {model.steps.map((step, index) => <li key={`${t(step)}-${index}`}>{t(step)}</li>)}
        </ol>
      )}
    </div>
  );
};

const NavBack = ({ onClick, hidden = false }) => {
  const lang = useLang();
  return hidden ? <span /> : (
    <button type="button" className="btn btn-ghost" onClick={onClick}>
      <span aria-hidden="true">←</span> {lang === 'uz' ? 'Orqaga' : 'Назад'}
    </button>
  );
};

const NavNext = ({ onClick, disabled, finish = false, label }) => {
  const lang = useLang();
  return (
    <button type="button" className={`btn btn-white-accent ${!disabled ? 'btn-ready' : ''}`} disabled={FREE_NAV ? false : disabled} onClick={onClick}>
      {label ?? (finish ? (lang === 'uz' ? 'Darsni yakunlash' : 'Завершить урок') : (lang === 'uz' ? 'Davom etish' : 'Дальше'))}
      <span aria-hidden="true">{finish ? '✓' : '→'}</span>
    </button>
  );
};

const ChoiceScreen = ({ screen, contentKey, storedAnswer, onAnswer, onNext, onPrev, finishLesson }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT[contentKey ?? `s${screen}`];
  const resetOnReturn = screen === 0 || SCREEN_META[screen].type === 'exploration';
  const restorableAnswer = resetOnReturn ? null : storedAnswer;
  const restored = restorableAnswer?.solved === true;
  const [picked, setPicked] = useState(restorableAnswer?.studentAnswerIndex ?? null);
  const [solved, setSolved] = useState(restored);
  const [attempts, setAttempts] = useState(restorableAnswer?.attempts ?? 0);
  const [wrongIndices, setWrongIndices] = useState(() => new Set(restorableAnswer?.wrongIndices ?? []));
  const segments = useMemo(
    () => localizedSegments(c.audio?.intro ?? c.audio, lang, `s${screen}`),
    [c.audio, lang, screen],
  );
  const audio = useAudio(segments);
  const canAnswer = useCanAnswer(audio);
  const canAdvance = useAdvanceGate(solved, audio);
  const isFinal = screen === TOTAL_SCREENS - 1;
  const optionOrder = buildOptionOrder(c.options.length, c.correctIndex, screen);

  const choose = (index) => {
    if (!canAnswer || solved || wrongIndices.has(index)) return;
    const nextAttempts = attempts + 1;
    const correct = index === c.correctIndex;
    setPicked(index);
    setAttempts(nextAttempts);
    if (!correct) {
      const nextWrong = new Set(wrongIndices);
      nextWrong.add(index);
      setWrongIndices(nextWrong);
      playSfx('wrong');
      audio.pushOneOff(t(c.audio?.on_wrong?.[index] ?? c.wrong?.[index]));
      onAnswer({
        stage: SCREEN_META[screen].scope,
        screenIdx: screen,
        question: t(c.instruction),
        options: c.options.map((option) => t(option)),
        correctIndex: c.correctIndex,
        correctAnswer: t(c.options[c.correctIndex]),
        studentAnswerIndex: index,
        studentAnswer: t(c.options[index]),
        correct: false,
        firstTry: false,
        attempts: nextAttempts,
        wrongIndices: [...nextWrong],
        skillTag: SCREEN_META[screen].subtype,
        solved: false,
      });
      return;
    }
    setSolved(true);
    playSfx('correct');
    audio.pushOneOff(t(c.audio?.on_correct ?? c.correctText));
    onAnswer({
      stage: SCREEN_META[screen].scope,
      screenIdx: screen,
      question: t(c.instruction),
      options: c.options.map((option) => t(option)),
      correctIndex: c.correctIndex,
      correctAnswer: t(c.options[c.correctIndex]),
      studentAnswerIndex: index,
      studentAnswer: t(c.options[index]),
      correct: true,
      firstTry: nextAttempts === 1,
      attempts: nextAttempts,
      wrongIndices: [...wrongIndices],
      skillTag: SCREEN_META[screen].subtype,
      solved: true,
    });
  };

  const proceed = () => {
    if (isFinal) finishLesson();
    else onNext();
  };

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={<><NavBack onClick={onPrev} hidden={screen === 0} /><NavNext onClick={proceed} disabled={!canAdvance} finish={isFinal} /></>}
    >
      <div className="screen-stack">
        <div className="screen-heading">
          <div className="heading-copy">
            <span className="lesson-kicker">LUMO CITY · DATA CENTER</span>
            <h1>{t(c.title)}</h1>
            <p>{t(c.lead)}</p>
          </div>
          <div className="bit-coach"><BitSVG state={solved ? 'happy' : 'present'} /></div>
        </div>
        <ModelPanel model={c.model} solved={solved} />
        <section className="question-card" aria-labelledby={`question-${screen}`}>
          <div className="question-topline">
            <span>{lang === 'uz' ? 'SIZNING QARORINGIZ' : 'ТВОЁ РЕШЕНИЕ'}</span>
            {!canAnswer && <small>{lang === 'uz' ? 'Avval tushuntirishni tinglang' : 'Сначала дослушай объяснение'}</small>}
          </div>
          <h2 id={`question-${screen}`}>{t(c.instruction)}</h2>
          <div className="options-grid">
            {optionOrder.map((sourceIndex, displayIndex) => {
              const option = c.options[sourceIndex];
              const isWrong = wrongIndices.has(sourceIndex);
              const isCorrect = solved && sourceIndex === c.correctIndex;
              return (
                <button
                  type="button"
                  className={`option ${isWrong ? 'option-picked-wrong' : ''} ${isCorrect ? 'option-correct' : ''} ${solved && !isCorrect ? 'option-dismissed' : ''}`}
                  key={`${t(option)}-${sourceIndex}`}
                  disabled={!canAnswer || solved || isWrong}
                  onClick={() => choose(sourceIndex)}
                >
                  <span className="option-letter">{String.fromCharCode(65 + displayIndex)}</span>
                  <span>{t(option)}</span>
                </button>
              );
            })}
          </div>
          <FeedbackBlock show={picked !== null} correct={solved}>
            {t(solved ? c.correctText : c.wrong?.[picked])}
          </FeedbackBlock>
          {solved && c.fact && <div className="fact-card"><strong>{lang === 'uz' ? 'FAKT' : 'ФАКТ'}</strong><p>{t(c.fact)}</p></div>}
          {solved && c.bridge && <div className="bridge-card"><span aria-hidden="true">→</span><p>{t(c.bridge)}</p></div>}
        </section>
      </div>
    </Stage>
  );
};

const normalizeNumberEntry = (value) => String(value ?? '').replace(/\s/g, '');

const NumberInputScreen = ({ screen, contentKey, storedAnswer, onAnswer, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT[contentKey ?? `s${screen}`];
  const restored = storedAnswer?.solved === true;
  const [value, setValue] = useState(storedAnswer?.studentAnswer ?? '');
  const [solved, setSolved] = useState(restored);
  const [attempts, setAttempts] = useState(storedAnswer?.attempts ?? 0);
  const [feedback, setFeedback] = useState(restored ? c.correctText : (storedAnswer?.feedback ?? null));
  const segments = useMemo(
    () => localizedSegments(c.audio?.intro ?? c.audio, lang, `s${screen}`),
    [c.audio, lang, screen],
  );
  const audio = useAudio(segments);
  const canAnswer = useCanAnswer(audio);
  const canAdvance = useAdvanceGate(solved, audio);
  const target = c.options[c.correctIndex];

  const submit = () => {
    if (!canAnswer || solved || !normalizeNumberEntry(value)) return;
    const nextAttempts = attempts + 1;
    const entered = normalizeNumberEntry(value);
    const correct = entered === normalizeNumberEntry(target);
    setAttempts(nextAttempts);

    if (!correct) {
      const matchedIndex = c.options.findIndex((option, index) => index !== c.correctIndex && normalizeNumberEntry(option) === entered);
      const wrongText = matchedIndex >= 0 ? c.wrong[matchedIndex] : c.inputWrongDefault;
      setFeedback(wrongText);
      playSfx('wrong');
      audio.pushOneOff(t(matchedIndex >= 0 ? c.audio?.on_wrong?.[matchedIndex] : c.inputWrongAudio));
      onAnswer({
        stage: SCREEN_META[screen].scope,
        screenIdx: screen,
        question: t(c.instruction),
        options: null,
        correctIndex: null,
        correctAnswer: target,
        studentAnswerIndex: null,
        studentAnswer: entered,
        correct: false,
        firstTry: false,
        attempts: nextAttempts,
        feedback: wrongText,
        skillTag: SCREEN_META[screen].subtype,
        solved: false,
      });
      return;
    }

    setValue(target);
    setSolved(true);
    setFeedback(c.correctText);
    playSfx('correct');
    audio.pushOneOff(t(c.audio?.on_correct ?? c.correctText));
    onAnswer({
      stage: SCREEN_META[screen].scope,
      screenIdx: screen,
      question: t(c.instruction),
      options: null,
      correctIndex: null,
      correctAnswer: target,
      studentAnswerIndex: null,
      studentAnswer: target,
      correct: true,
      firstTry: nextAttempts === 1,
      attempts: nextAttempts,
      skillTag: SCREEN_META[screen].subtype,
      solved: true,
    });
  };

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={<><NavBack onClick={onPrev} /><NavNext onClick={onNext} disabled={!canAdvance} /></>}
    >
      <div className="screen-stack">
        <div className="screen-heading">
          <div className="heading-copy">
            <span className="lesson-kicker">LUMO CITY · DATA CENTER</span>
            <h1>{t(c.title)}</h1>
            <p>{t(c.lead)}</p>
          </div>
          <div className="bit-coach"><BitSVG state={solved ? 'happy' : 'present'} /></div>
        </div>
        <ModelPanel model={c.model} solved={solved} />
        <section className="question-card" aria-labelledby={`question-${screen}`}>
          <div className="question-topline">
            <span>{lang === 'uz' ? 'SONNI KIRITING' : 'ВВЕДИ ЧИСЛО'}</span>
            {!canAnswer && <small>{lang === 'uz' ? 'Avval tushuntirishni tinglang' : 'Сначала дослушай объяснение'}</small>}
          </div>
          <h2 id={`question-${screen}`}>{t(c.instruction)}</h2>
          <div className="number-entry-row">
            <input
              className={`answer-input ${solved ? 'answer-input-correct' : ''}`}
              value={value}
              onChange={(event) => {
                setValue(event.target.value.replace(/[^0-9\s]/g, ''));
                if (!solved) setFeedback(null);
              }}
              onKeyDown={(event) => { if (event.key === 'Enter') submit(); }}
              inputMode="numeric"
              autoComplete="off"
              aria-label={lang === 'uz' ? 'Son javobi' : 'Числовой ответ'}
              placeholder="0"
              maxLength={10}
              disabled={!canAnswer || solved}
            />
            <button type="button" className="btn btn-white-accent btn-ready btn-check" onClick={submit} disabled={!canAnswer || solved || !normalizeNumberEntry(value)}>
              {lang === 'uz' ? 'Tekshirish' : 'Проверить'}
            </button>
          </div>
          <FeedbackBlock show={feedback !== null} correct={solved}>{t(feedback)}</FeedbackBlock>
          {solved && c.fact && <div className="fact-card"><strong>{lang === 'uz' ? 'FAKT' : 'ФАКТ'}</strong><p>{t(c.fact)}</p></div>}
          {solved && c.bridge && <div className="bridge-card"><span aria-hidden="true">→</span><p>{t(c.bridge)}</p></div>}
        </section>
      </div>
    </Stage>
  );
};

const useTheoryAdvanceGate = (audio) => (
  FREE_NAV || audio.muted || audio.completed
);

const theoryMoodFor = (subtype) => {
  if (subtype.includes('error')) return 'awkward';
  if (subtype.includes('rule')) return 'idea';
  if (subtype.includes('strategy')) return 'focus';
  if (subtype.includes('summary')) return 'nod';
  if (subtype.includes('table') || subtype.includes('class')) return 'point';
  if (subtype.includes('foundation')) return 'think';
  return 'present';
};

const TheoryExplanation = ({ c, label, canAdvance, variant = 'default' }) => {
  const lang = useLang();
  const t = useT();
  return (
    <section className={`theory-callout theory-callout-${variant}`}>
      <div className="question-topline">
        <span>{label}</span>
        {!canAdvance && <small>{lang === 'uz' ? 'Tushuntirish davom etmoqda' : 'Объяснение продолжается'}</small>}
      </div>
      <h2>{t(c.instruction)}</h2>
      <div className="theory-answer">
        <span className="theory-answer-mark" aria-hidden="true">→</span>
        <p>{t(c.correctText)}</p>
      </div>
      {c.fact && <div className="fact-card"><strong>{lang === 'uz' ? 'FAKT' : 'ФАКТ'}</strong><p>{t(c.fact)}</p></div>}
      {c.bridge && <div className="bridge-card"><span aria-hidden="true">→</span><p>{t(c.bridge)}</p></div>}
    </section>
  );
};

const TheoryBody = ({ screen, c, meta, label, canAdvance }) => {
  const lang = useLang();
  const t = useT();

  if (meta.type === 'hook') {
    return (
      <div className="hook-theory-layout">
        <div className="hook-mission-scene">
          <div className="hook-signal" aria-hidden="true"><i /><i /><i /><i /></div>
          <ModelPanel model={c.model} solved />
        </div>
        <TheoryExplanation c={c} label={label} canAdvance={canAdvance} variant="mission" />
      </div>
    );
  }

  if (meta.subtype.includes('foundation')) {
    return (
      <div className="foundation-theory-layout">
        <div className="foundation-recap-strip">
          {(c.model?.columns ?? []).map((column, index) => (
            <div className="foundation-recap-card" style={{ '--theory-delay': `${index * 120}ms` }} key={`${column.value}-${index}`}>
              <span>{t(column.label)}</span><strong>{column.value}</strong>
            </div>
          ))}
        </div>
        <TheoryExplanation c={c} label={label} canAdvance={canAdvance} variant="foundation" />
      </div>
    );
  }

  if (meta.type === 'rule') {
    return (
      <div className="rule-theory-layout">
        <ModelPanel model={c.model} solved />
        <div className="rule-assembly-line" aria-hidden="true">
          {(c.model?.steps ?? []).map((step, index) => <i style={{ '--theory-delay': `${index * 150}ms` }} key={`${t(step)}-${index}`}>{index + 1}</i>)}
        </div>
        <TheoryExplanation c={c} label={label} canAdvance={canAdvance} variant="rule" />
      </div>
    );
  }

  if (meta.subtype.includes('strategy')) {
    return (
      <div className="strategy-theory-layout">
        <div className="strategy-route">
          {(c.model?.steps ?? []).map((step, index) => (
            <React.Fragment key={`${t(step)}-${index}`}>
              <div className="strategy-route-step" style={{ '--theory-delay': `${index * 140}ms` }}><span>{index + 1}</span><p>{t(step)}</p></div>
              {index < c.model.steps.length - 1 && <i aria-hidden="true">→</i>}
            </React.Fragment>
          ))}
        </div>
        <div className="strategy-contrast-grid">
          <article className="strategy-contrast-reliable">
            <span>{lang === 'uz' ? 'ISHONCHLI TEKSHIRUV' : 'НАДЁЖНАЯ ПРОВЕРКА'}</span>
            <strong>{t(c.options[c.correctIndex])}</strong>
            <p>{t(c.correctText)}</p>
          </article>
          <article className="strategy-contrast-trap">
            <span>{lang === 'uz' ? "NEGA YIG'INDI EMAS?" : 'ПОЧЕМУ НЕ СУММА ЦИФР?'}</span>
            <strong>{t(c.options[1])}</strong>
            <p>{t(c.wrong[1])}</p>
          </article>
        </div>
      </div>
    );
  }

  if (meta.subtype.includes('error')) {
    const rows = c.model?.rows ?? [];
    return (
      <div className="error-theory-layout">
        <div className="error-walkthrough-board">
          {rows.map((row, index) => (
            <div className={`error-walkthrough-row ${index ? 'error-row-draft' : 'error-row-source'}`} style={{ '--theory-delay': `${index * 170}ms` }} key={`${row.value}-${index}`}>
              <span>{t(row.label)}</span><strong>{row.value}</strong>
            </div>
          ))}
          <div className="error-repair-arrow" aria-hidden="true">↓</div>
          <div className="error-repair-result"><span>{lang === 'uz' ? "to'g'ri yozuv" : 'верная запись'}</span><strong>{t(c.options[c.correctIndex]).match(/[0-9 ]+/)?.[0]?.trim() || '72 045'}</strong></div>
        </div>
        <TheoryExplanation c={c} label={label} canAdvance={canAdvance} variant="error" />
      </div>
    );
  }

  if (meta.type === 'summary') {
    return (
      <div className="summary-theory-layout">
        <div className="summary-signal"><BitSVG state="happy" /><strong>{t(c.model?.number)}</strong></div>
        <div className="summary-theory-cards">
          <div><span>01</span><p>{lang === 'uz' ? 'Sonni o\'ngdan uchtadan raqamga ajrating.' : 'Разделяй число справа на группы по три цифры.'}</p></div>
          <div><span>02</span><p>{lang === 'uz' ? "Sinflarni chapdan o'ngga yaxlit o'qing." : 'Читай классы слева направо целыми группами.'}</p></div>
          <div><span>03</span><p>{lang === 'uz' ? "Ichki nollarni saqlab, qayta o'qib tekshiring." : 'Сохраняй внутренние нули и проверяй обратным чтением.'}</p></div>
        </div>
        <TheoryExplanation c={c} label={label} canAdvance={canAdvance} variant="summary" />
      </div>
    );
  }

  return (
    <div className={`animated-theory-layout animated-theory-${screen}`}>
      <ModelPanel model={c.model} solved />
      <TheoryExplanation c={c} label={label} canAdvance={canAdvance} variant="animated" />
    </div>
  );
};

const DEEP_SCREEN_COPY = {
  foundation: {
    title: { ru: 'От знакомых разрядов к классам', uz: 'Tanish xonalardan sinflarga' },
    lead: {
      ru: 'Сначала находим знакомую тройку справа, затем видим, как слева открывается следующий класс.',
      uz: "Avval o'ngdagi tanish uchlikni topamiz, keyin chapda keyingi sinf qanday ochilishini ko'ramiz.",
    },
  },
  reading: {
    title: { ru: 'Читаем классы и слышим место нуля', uz: "Sinflarni o'qiymiz va nolning o'rnini anglaymiz" },
    lead: {
      ru: 'Один экран связывает порядок классов с ролью внутреннего нуля: число читается группами, а места не сдвигаются.',
      uz: "Bitta model sinflar tartibini ichki nol vazifasi bilan bog'laydi: son guruhlar bilan o'qiladi, xonalar esa siljimaydi.",
    },
  },
  inverse: {
    title: { ru: 'Слышим, записываем и читаем обратно', uz: "Eshitamiz, yozamiz va qayta o'qiymiz" },
    lead: {
      ru: 'Запись и чтение — обратные действия. Проверим обе стороны на двух разных кодах.',
      uz: "Yozish va o'qish teskari amallardir. Ikkala yo'nalishni ikki xil kodda tekshiramiz.",
    },
  },
};

const DeepSequenceScreen = ({ screen, contentKeys, copyKey, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const contents = useMemo(() => contentKeys.map((key) => CONTENT[key]), [contentKeys]);
  const copy = DEEP_SCREEN_COPY[copyKey];
  const [activeStep, setActiveStep] = useState(0);
  const [seenSteps, setSeenSteps] = useState(() => new Set([0]));
  const active = contents[activeStep];
  const segments = useMemo(() => [
    ...localizedSegments(active.audio?.intro ?? active.audio, lang, `s${screen}-deep-${activeStep}-intro`),
    ...localizedSegments(active.audio?.on_correct ?? active.correctText, lang, `s${screen}-deep-${activeStep}-result`),
  ], [active, activeStep, lang, screen]);
  const audio = useAudio(segments);
  const canAdvance = useTheoryAdvanceGate(audio) && seenSteps.size >= contents.length;

  const selectStep = (index) => {
    setActiveStep(index);
    setSeenSteps((previous) => {
      if (previous.has(index)) return previous;
      const next = new Set(previous);
      next.add(index);
      return next;
    });
  };

  return (
    <Stage
      screen={screen}
      eyebrow={active.eyebrow}
      audio={audio}
      nav={<><NavBack onClick={onPrev} /><NavNext onClick={onNext} disabled={!canAdvance} /></>}
    >
      <div className="screen-stack deep-sequence-screen">
        <div className="screen-heading">
          <div className="heading-copy">
            <span className="lesson-kicker">LUMO CITY · DEEP DIVE</span>
            <h1>{t(copy.title)}</h1>
            <p>{t(copy.lead)}</p>
          </div>
          <div className="bit-coach bit-coach-theory"><BitSVG state={activeStep === contents.length - 1 ? 'idea' : 'point'} /></div>
        </div>
        <div className="deep-sequence-tabs" role="tablist" aria-label={t(copy.title)}>
          {contents.map((item, index) => (
            <button
              type="button"
              role="tab"
              aria-selected={activeStep === index}
              className={activeStep === index ? 'deep-tab-active' : seenSteps.has(index) ? 'deep-tab-seen' : ''}
              onClick={() => selectStep(index)}
              key={contentKeys[index]}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{t(item.title)}</strong>
            </button>
          ))}
        </div>
        <div className="deep-sequence-stage" key={`${copyKey}-${activeStep}`}>
          <ModelPanel model={active.model} solved />
          <section className="deep-sequence-explanation">
            <span>{lang === 'uz' ? `${activeStep + 1}-QADAM` : `ШАГ ${activeStep + 1}`}</span>
            <h2>{t(active.instruction)}</h2>
            <p>{t(active.correctText)}</p>
          </section>
        </div>
        <div className="deep-contrast-row">
          {contents.map((item, index) => (
            <article className={seenSteps.has(index) ? 'deep-insight-visible' : ''} style={{ '--theory-delay': `${index * 140}ms` }} key={`${contentKeys[index]}-insight`}>
              <span>{lang === 'uz' ? `KONTRAST ${index + 1}` : `КОНТРАСТ ${index + 1}`}</span>
              <strong>{t(item.options?.[1])}</strong>
              <p>{t(item.wrong?.[1] ?? item.correctText)}</p>
            </article>
          ))}
        </div>
        <button type="button" className="deep-replay" onClick={() => selectStep(activeStep < contents.length - 1 ? activeStep + 1 : 0)}>
          <span aria-hidden="true">{activeStep < contents.length - 1 ? '→' : '↻'}</span>
          {activeStep < contents.length - 1
            ? (lang === 'uz' ? "Keyingi modelni ko'rish" : 'Показать следующую модель')
            : (lang === 'uz' ? "Bosqichlarni yana ko'rish" : 'Показать цепочку ещё раз')}
        </button>
      </div>
    </Stage>
  );
};

function useFinaleReveal(count = 4, interval = 500) {
  const [visible, setVisible] = useState(0);
  useEffect(() => {
    const reduced = typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      const frame = requestAnimationFrame(() => setVisible(count));
      return () => cancelAnimationFrame(frame);
    }
    const resetFrame = requestAnimationFrame(() => setVisible(0));
    const timers = Array.from({ length: count }, (_, index) => (
      window.setTimeout(() => setVisible(index + 1), 300 + index * interval)
    ));
    return () => {
      cancelAnimationFrame(resetFrame);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [count, interval]);
  return visible;
}

const FinaleScreen = ({ screen, answers = [], onPrev, finishLesson }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s15;
  const segments = useMemo(() => [
    ...localizedSegments(c.audio?.intro ?? c.audio, lang, 's14-finale-intro'),
    ...localizedSegments(c.audio?.on_correct ?? c.correctText, lang, 's14-finale-result'),
  ], [c.audio, c.correctText, lang]);
  const audio = useAudio(segments);
  const visible = useFinaleReveal(4, 500);
  const scoredIndexes = useMemo(
    () => SCREEN_META.map((meta, index) => (meta.scored ? index : null)).filter((index) => index !== null),
    [],
  );
  const answered = scoredIndexes.filter((index) => answers[index] !== undefined).length;
  const firstTry = scoredIndexes.filter((index) => answers[index]?.firstTry === true).length;
  const complete = visible >= 4;
  const totalScored = scoredIndexes.length;
  const solvedCount = scoredIndexes.filter((index) => answers[index]?.correct === true).length;
  const rewardReady = complete && solvedCount === totalScored;
  const rewardTitle = firstTry === totalScored
    ? { ru: 'Архитектор чисел', uz: "Sonlar me'mori" }
    : firstTry >= Math.max(1, totalScored - 1)
      ? { ru: 'Знаток классов', uz: 'Sinflar bilimdoni' }
      : { ru: 'Исследователь чисел', uz: 'Sonlar tadqiqotchisi' };
  const takeaways = lang === 'uz'
    ? [
      "Sonni o'ngdan uchtadan raqamga ajrating.",
      "Sinflarni chapdan o'ngga yaxlit o'qing.",
      "Ichki nollarni saqlab, qayta o'qib tekshiring.",
    ]
    : [
      'Разделяй число справа на группы по три цифры.',
      'Читай классы слева направо целыми группами.',
      'Сохраняй внутренние нули и проверяй обратным чтением.',
    ];

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={<><NavBack onClick={onPrev} /><NavNext onClick={finishLesson} disabled={false} finish /></>}
    >
      <div className="screen-stack finale-screen">
        <header className="finale-heading">
          <span>{lang === 'uz' ? 'YAKUNIY BOSQICH' : 'ФИНАЛЬНЫЙ ЭТАП'}</span>
          <h1>{t(c.title)}</h1>
          <p>{lang === 'uz'
            ? "Dars boshidagi ovozli manzil tiklandi: markaz sonni yo'qotishsiz o'qiydi va yozadi."
            : 'Голосовой адрес из начала урока восстановлен: центр читает и записывает число без потерь.'}</p>
        </header>

        <div className="finale-layout">
          <div className="finale-main">
            <div className="finale-mastery">
              {takeaways.map((item, index) => (
                <article className={`finale-takeaway ${visible >= index + 1 ? 'is-visible' : ''}`} key={item}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <p>{item}</p>
                </article>
              ))}
            </div>
            <div className={`finale-proof ${visible >= 3 ? 'is-visible' : ''}`}>
              <span>{lang === 'uz' ? "BOSHLANG'ICH MISSIYA YECHIMI" : 'РЕШЕНИЕ СТАРТОВОЙ МИССИИ'}</span>
              <strong>{t(c.model.number)}</strong>
              <p>{t(c.correctText)}</p>
            </div>
            <div className={`finale-bridge ${complete ? 'is-visible' : ''}`}>
              <span aria-hidden="true">→</span>
              <div><strong>{lang === 'uz' ? 'KEYINGI MISSIYA' : 'СЛЕДУЮЩАЯ МИССИЯ'}</strong><p>{t(c.bridge)}</p></div>
            </div>
          </div>

          <aside className={`finale-reward ${rewardReady ? 'is-complete' : ''}`} role="status" aria-live="polite" aria-atomic="true">
            {rewardReady && (
              <div className="finale-confetti" aria-hidden="true">
                {Array.from({ length: 8 }, (_, index) => <i key={index} />)}
              </div>
            )}
            <div className="finale-medal" aria-hidden="true">{rewardReady ? '★' : '🔒'}</div>
            <div className="finale-reward-copy">
              <span>{rewardReady ? (lang === 'uz' ? 'UNVON OLINDI' : 'ЗВАНИЕ ПОЛУЧЕНО') : (lang === 'uz' ? 'MUKOFOT KUTILMOQDA' : 'НАГРАДА ЖДЁТ')}</span>
              <h2>{rewardReady ? t(rewardTitle) : (lang === 'uz' ? 'Unvonni oching' : 'Открой звание')}</h2>
              {!complete ? (
                <div className="finale-status finale-status-neutral"><strong>…</strong><p>{lang === 'uz' ? "Bilimlar jamlanmoqda" : 'Знания собираются вместе'}</p></div>
              ) : rewardReady ? (
                <div className="finale-status"><strong>{firstTry}/{scoredIndexes.length}</strong><p>{lang === 'uz' ? "birinchi urinishda" : 'с первой попытки'}</p><small>{answered}/{scoredIndexes.length} {lang === 'uz' ? 'mashq bajarildi' : 'заданий выполнено'}</small></div>
              ) : (
                <div className="finale-status finale-status-neutral"><strong>{solvedCount}/{totalScored}</strong><p>{lang === 'uz' ? 'yechildi' : 'решено'}</p><small>{answered}/{totalScored} {lang === 'uz' ? 'mashq bajarildi' : 'заданий выполнено'}</small></div>
              )}
            </div>
            <div className="finale-reward-bit"><BitSVG state={rewardReady ? 'happy' : 'present'} /></div>
          </aside>
        </div>
      </div>
    </Stage>
  );
};

const TheoryScreen = ({ screen, contentKey, onNext, onPrev, finishLesson }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT[contentKey ?? `s${screen}`];
  const meta = SCREEN_META[screen];
  const segments = useMemo(() => [
    ...localizedSegments(c.audio?.intro ?? c.audio, lang, `s${screen}-intro`),
    ...localizedSegments(c.audio?.on_correct ?? c.correctText, lang, `s${screen}-explanation`),
  ], [c.audio, c.correctText, lang, screen]);
  const audio = useAudio(segments);
  const canAdvance = useTheoryAdvanceGate(audio);
  const isFinal = screen === TOTAL_SCREENS - 1;
  const proceed = () => {
    if (isFinal) finishLesson();
    else onNext();
  };
  const label = meta.type === 'rule'
    ? (lang === 'uz' ? 'QOIDA' : 'ПРАВИЛО')
    : meta.subtype.includes('error')
      ? (lang === 'uz' ? 'XATONI TUZATISH' : 'РАЗБОР ОШИБКИ')
      : meta.subtype.includes('strategy')
        ? (lang === 'uz' ? 'ISHONCHLI USUL' : 'НАДЁЖНЫЙ СПОСОБ')
        : meta.type === 'summary'
          ? (lang === 'uz' ? 'ESLAB QOLING' : 'ЗАПОМНИ')
          : (lang === 'uz' ? 'BIT TUSHUNTIRADI' : 'БИТ ОБЪЯСНЯЕТ');

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={(
        <>
          <NavBack onClick={onPrev} hidden={screen === 0} />
          <NavNext onClick={proceed} disabled={!canAdvance} finish={isFinal} />
        </>
      )}
    >
      <div className={`screen-stack theory-screen theory-${meta.subtype}`}>
        <div className="screen-heading">
          <div className="heading-copy">
            <span className="lesson-kicker">LUMO CITY · DATA CENTER</span>
            <h1>{t(c.title)}</h1>
            <p>{t(c.lead)}</p>
          </div>
          <div className="bit-coach bit-coach-theory">
            <BitSVG state={theoryMoodFor(meta.subtype)} />
          </div>
        </div>
        <TheoryBody screen={screen} c={c} meta={meta} label={label} canAdvance={canAdvance} />
      </div>
    </Stage>
  );
};

const WorkedExamplesScreen = ({ screen, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s11;
  const guided = CONTENT.s10;
  const segments = useMemo(() => [
    ...localizedSegments(guided.audio?.intro, lang, 's10-guided-intro'),
    ...localizedSegments(guided.audio?.on_correct ?? guided.correctText, lang, 's10-guided-result'),
    ...localizedSegments(c.audio?.intro, lang, 's11-intro'),
    ...c.items.flatMap((item, index) => [
      ...localizedSegments(item.audio?.intro, lang, `s11-example-${index}-task`),
      ...localizedSegments(item.audio?.on_correct ?? item.correctText, lang, `s11-example-${index}-answer`),
    ]),
  ], [c.audio, c.items, guided.audio, guided.correctText, lang]);
  const audio = useAudio(segments);
  const canAdvance = useTheoryAdvanceGate(audio);

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={<><NavBack onClick={onPrev} /><NavNext onClick={onNext} disabled={!canAdvance} /></>}
    >
      <div className="screen-stack worked-examples-screen">
        <div className="screen-heading">
          <div className="heading-copy">
            <span className="lesson-kicker">LUMO CITY · EXAMPLE LAB</span>
            <h1>{t(c.title)}</h1>
            <p>{t(c.lead)}</p>
          </div>
          <div className="bit-coach bit-coach-theory"><BitSVG state="focus" /></div>
        </div>
        <section className="worked-featured-example">
          <ModelPanel model={{ ...guided.model, number: guided.options[guided.correctIndex] }} solved />
          <div>
            <span>{lang === 'uz' ? "TO'LIQ YECHIM" : 'ПОЛНОЕ РЕШЕНИЕ'}</span>
            <h2>{t(guided.instruction)}</h2>
            <p>{t(guided.correctText)}</p>
          </div>
        </section>
        <div className="worked-examples-grid">
          {c.items.map((item, index) => (
            <article className="worked-example-card" style={{ '--example-delay': `${index * 110}ms` }} key={t(item.question)}>
              <span className="worked-example-number">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h2>{t(item.question)}</h2>
                <strong>{t(item.options[item.correctIndex])}</strong>
                <p>{t(item.correctText)}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="worked-examples-finish">
          <BitSVG state="nod" />
          <p>{t(c.completionText)}</p>
        </div>
      </div>
    </Stage>
  );
};

const CityCodeLabScreen = ({ screen, onNext, onPrev }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s18;
  const [activeStep, setActiveStep] = useState(0);
  const [seenSteps, setSeenSteps] = useState(() => new Set([0]));
  const active = c.items[activeStep];
  const segments = useMemo(() => [
    ...localizedSegments(active.audio?.intro, lang, `s18-lab-${activeStep}-dictation`),
    ...localizedSegments(active.audio?.on_correct, lang, `s18-lab-${activeStep}-solution`),
  ], [active, activeStep, lang]);
  const audio = useAudio(segments);
  const canAdvance = useTheoryAdvanceGate(audio) && seenSteps.size === c.items.length;

  const selectStep = (index) => {
    setActiveStep(index);
    setSeenSteps((previous) => {
      if (previous.has(index)) return previous;
      const next = new Set(previous);
      next.add(index);
      return next;
    });
  };

  return (
    <Stage
      screen={screen}
      eyebrow={c.eyebrow}
      audio={audio}
      nav={<><NavBack onClick={onPrev} /><NavNext onClick={onNext} disabled={!canAdvance} /></>}
    >
      <div className="screen-stack city-code-lab-screen">
        <div className="screen-heading">
          <div className="heading-copy">
            <span className="lesson-kicker">LUMO CITY · DICTATION LAB</span>
            <h1>{t(c.title)}</h1>
            <p>{t(c.lead)}</p>
          </div>
          <div className="bit-coach bit-coach-theory"><BitSVG state={seenSteps.size === c.items.length ? 'nod' : 'focus'} /></div>
        </div>
        <div className="city-lab-tabs" role="tablist" aria-label={t(c.title)}>
          {c.items.map((item, index) => (
            <button
              type="button"
              role="tab"
              aria-selected={activeStep === index}
              className={activeStep === index ? 'city-lab-tab-active' : seenSteps.has(index) ? 'city-lab-tab-seen' : ''}
              onClick={() => selectStep(index)}
              key={item.station}
            >
              <span>{item.station}</span><strong>{item.written}</strong>
            </button>
          ))}
        </div>
        <section className="city-lab-solution" key={`city-lab-${activeStep}`}>
          <div className="city-lab-voice">
            <span>{lang === 'uz' ? 'ESHITDIK' : 'УСЛЫШАЛИ'}</span>
            <p>{t(active.spoken)}</p>
          </div>
          <div className="city-lab-path" aria-label={t(c.instruction)}>
            <article>
              <span>01</span><small>{lang === 'uz' ? 'sinflar' : 'классы'}</small>
              <div>{active.groups.map((group) => <strong key={group}>{group}</strong>)}</div>
            </article>
            <i aria-hidden="true">→</i>
            <article>
              <span>02</span><small>{lang === 'uz' ? 'yozuv' : 'запись'}</small>
              <div><strong>{active.written}</strong></div>
            </article>
            <i aria-hidden="true">→</i>
            <article>
              <span>03</span><small>{lang === 'uz' ? "qayta o'qish" : 'обратное чтение'}</small>
              <p>{t(active.readBack)}</p>
            </article>
          </div>
          <div className="city-lab-note"><BitSVG state="point" /><p>{t(active.note)}</p></div>
        </section>
        <button type="button" className="deep-replay city-lab-next" onClick={() => selectStep(activeStep < c.items.length - 1 ? activeStep + 1 : 0)}>
          <span aria-hidden="true">{activeStep < c.items.length - 1 ? '→' : '↻'}</span>
          {activeStep < c.items.length - 1
            ? (lang === 'uz' ? 'Keyingi kodni ochish' : 'Открыть следующий код')
            : (lang === 'uz' ? "Kodlarni yana ko'rish" : 'Посмотреть коды ещё раз')}
        </button>
      </div>
    </Stage>
  );
};

const D2_DEEP_FOUNDATION = ['s1', 's2'];
const D2_DEEP_READING = ['s3', 's4'];
const D2_DEEP_INVERSE = ['s5', 's6'];

const Screen0 = (props) => <TheoryScreen {...props} contentKey="s0" />;
const Screen1 = (props) => <DeepSequenceScreen {...props} contentKeys={D2_DEEP_FOUNDATION} copyKey="foundation" />;
const Screen2 = (props) => <DeepSequenceScreen {...props} contentKeys={D2_DEEP_READING} copyKey="reading" />;
const Screen3 = (props) => <TheoryScreen {...props} contentKey="s17" />;
const Screen4 = (props) => <DeepSequenceScreen {...props} contentKeys={D2_DEEP_INVERSE} copyKey="inverse" />;
const Screen5 = (props) => <TheoryScreen {...props} contentKey="s16" />;
const Screen6 = (props) => <TheoryScreen {...props} contentKey="s8" />;
const Screen7 = (props) => <TheoryScreen {...props} contentKey="s9" />;
const Screen8 = (props) => <NumberInputScreen {...props} contentKey="s7" />;
const Screen9 = (props) => <WorkedExamplesScreen {...props} />;
const Screen10 = (props) => <CityCodeLabScreen {...props} />;
const Screen11 = (props) => <TheoryScreen {...props} contentKey="s12" />;
const Screen12 = (props) => <TheoryScreen {...props} contentKey="s13" />;
const Screen13 = (props) => <ChoiceScreen {...props} contentKey="s14" />;
const Screen14 = (props) => <FinaleScreen {...props} />;

const SCREENS = [
  Screen0,
  Screen1,
  Screen2,
  Screen3,
  Screen4,
  Screen5,
  Screen6,
  Screen7,
  Screen8,
  Screen9,
  Screen10,
  Screen11,
  Screen12,
  Screen13,
  Screen14,
];

export default function Grade4Dars02({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished }) {
  useMobileZoom();
  const preview = langProp === undefined || langProp === null;
  const [previewLang, setPreviewLang] = useState('ru');
  const lang = langProp || previewLang;
  const safeName = studentName || (lang === 'uz' ? "O'quvchi" : 'Ученик');
  configureLesson({
    ttsApiBase: ttsApiBase || '',
    correctSoundUrl: correctSoundUrl || '',
    wrongSoundUrl: wrongSoundUrl || '',
    studentName: safeName,
    voiceGender: voiceGender || 'f',
  });

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  // eslint-disable-next-line react-hooks/purity -- duration requires a mount timestamp
  const startTimeRef = useRef(Date.now());
  const finishedRef = useRef(false);

  const recordAnswer = useCallback((data) => {
    setAnswers((previous) => {
      const next = [...previous];
      next[data.screenIdx] = data;
      return next;
    });
  }, []);

  const finishLesson = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    const miniAnswer = answers[8];
    const finalAnswer = answers[13];
    const miniScore = miniAnswer?.firstTry ? 1 : 0;
    const finalScore = finalAnswer?.firstTry ? 1 : 0;
    const finalTotal = 1;
    const totalQuestions = 2;
    const correctAnswers = miniScore + finalScore;
    const scoredAnswers = [miniAnswer, finalAnswer].filter(Boolean);
    const payload = {
      lessonId: LESSON_META.lessonId,
      lessonTitle: LESSON_META.lessonTitle[lang] ?? LESSON_META.lessonTitle.ru,
      durationSec: Math.floor((Date.now() - startTimeRef.current) / 1000),
      totalQuestions,
      correctAnswers,
      scorePercent: totalQuestions ? Math.round((correctAnswers / totalQuestions) * 100) : 0,
      finalScore,
      finalTotal,
      passed: totalQuestions ? correctAnswers / totalQuestions >= 0.6 : false,
      firstTryStats: { total: totalQuestions, firstTryCorrect: correctAnswers },
      attemptsTotal: scoredAnswers.reduce((sum, answer) => sum + (answer.attempts ?? 0), 0),
      skillTags: LESSON_META.skillTags,
      answers: answers.filter(Boolean),
    };
    if (onFinished) onFinished(payload);
    else console.log('[Grade4 Dars02 preview]', payload);
  }, [answers, lang, onFinished]);

  const CurrentScreen = SCREENS[current];
  const next = () => setCurrent((value) => Math.min(value + 1, TOTAL_SCREENS - 1));
  const previous = () => setCurrent((value) => Math.max(value - 1, 0));

  return (
    <LangContext.Provider value={lang}>
      <style>{STYLES}</style>
      <div className={`lesson-root ${preview ? 'lesson-preview' : ''}`}>
        {preview && (
          <div className="preview-language" aria-label="Preview language">
            {['ru', 'uz'].map((code) => (
              <button type="button" key={code} className={previewLang === code ? 'preview-active' : ''} onClick={() => setPreviewLang(code)}>
                {code.toUpperCase()}
              </button>
            ))}
          </div>
        )}
        <CurrentScreen
          key={current}
          screen={current}
          storedAnswer={answers[current]}
          answers={answers}
          onAnswer={recordAnswer}
          onNext={next}
          onPrev={previous}
          finishLesson={finishLesson}
        />
      </div>
    </LangContext.Provider>
  );
}

const STYLES = `
html:has(.lesson-root),
body:has(.lesson-root),
#root:has(.lesson-root),
.lesson-page:has(.lesson-root),
.lesson-frame:has(.lesson-root) {
  width: 100%;
  height: 100%;
  min-height: 0 !important;
  overflow: hidden !important;
  overscroll-behavior: none;
}
html, body { margin: 0; padding: 0; }
.lesson-root, .lesson-root * { box-sizing: border-box; }
.lesson-root {
  position: fixed;
  inset: 0;
  overflow: clip;
  overscroll-behavior: none;
  contain: strict;
  isolation: isolate;
  font-family: 'Manrope', system-ui, sans-serif;
  color: ${T.ink};
  background:
    radial-gradient(circle at 10% 14%, rgba(22,143,163,.12), transparent 30%),
    radial-gradient(circle at 90% 84%, rgba(255,91,53,.10), transparent 32%),
    linear-gradient(145deg, #F7F8F4 0%, #EEF3F1 100%);
  -webkit-font-smoothing: antialiased;
  font-feature-settings: "ss01","cv11";
  zoom: var(--g4z, 1);
}
.lesson-root h1, .lesson-root h2, .lesson-root h3,
.lesson-root p, .lesson-root ol { margin: 0; padding: 0; }
.lesson-root button { font: inherit; }
.preview-language {
  position: fixed;
  top: 9px;
  right: 9px;
  z-index: 30;
  display: flex;
  gap: 3px;
  padding: 3px;
  border-radius: 999px;
  background: rgba(255,255,255,.94);
  box-shadow: 0 8px 20px -14px rgba(${T.shadowBase},.6);
}
.preview-language button {
  padding: 4px 9px;
  border: 0;
  border-radius: 999px;
  color: ${T.ink2};
  background: transparent;
  cursor: pointer;
  font-size: 10px;
  font-weight: 900;
}
.preview-language .preview-active { color: #FFFFFF; background: ${T.accent}; }
.stage {
  width: min(936px, 100%);
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: rgba(245,245,240,.86);
  box-shadow: 0 0 50px -24px rgba(${T.shadowBase},.28);
}
.stage-header {
  flex: 0 0 auto;
  padding-top: 17px;
  padding-bottom: 12px;
  background: rgba(245,245,240,.94);
  backdrop-filter: blur(14px);
  z-index: 3;
}
.progress-track {
  width: 100%;
  height: 6px;
  margin-bottom: 12px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(135,148,157,.22);
}
.progress-bar {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, ${T.cyan}, ${T.accent});
  box-shadow: 0 0 12px rgba(255,91,53,.42);
  transition: width .45s ease;
}
.stage-chrome {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.chrome-title, .chrome-actions, .audio-controls {
  display: flex;
  align-items: center;
  gap: 9px;
}
.chrome-title {
  min-width: 0;
  color: ${T.ink2};
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .12em;
  text-transform: uppercase;
}
.chrome-title > span:last-child { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.status-dot {
  width: 8px;
  height: 8px;
  flex: 0 0 auto;
  border-radius: 50%;
  background: ${T.accent};
  box-shadow: 0 0 10px rgba(255,91,53,.65);
}
.chrome-actions { flex: 0 0 auto; }
.screen-type {
  padding: 4px 8px;
  border-radius: 999px;
  color: ${T.cyan};
  background: ${T.cyanSoft};
  font-size: 10px;
  font-weight: 800;
}
.screen-count {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 700;
}
.icon-btn {
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: 10px;
  color: ${T.ink2};
  background: rgba(255,255,255,.75);
  cursor: pointer;
  box-shadow: 0 4px 12px -7px rgba(${T.shadowBase},.3);
}
.stage-content {
  flex: 1 1 auto;
  min-height: 0;
  padding-top: 16px;
  padding-bottom: 28px;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: rgba(135,148,157,.35) transparent;
}
.stage-nav {
  flex: 0 0 auto;
  min-height: 74px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 12px;
  padding-bottom: max(12px, env(safe-area-inset-bottom));
  background: rgba(245,245,240,.97);
  box-shadow: 0 -12px 28px -25px rgba(${T.shadowBase},.45);
  z-index: 3;
}
.btn {
  min-height: 48px;
  padding: 0 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  border: 0;
  border-radius: 13px;
  font-weight: 800;
  cursor: pointer;
  transition: transform .2s ease, color .2s ease, background .2s ease, box-shadow .2s ease, opacity .2s ease;
}
.btn-ghost { color: ${T.ink}; background: transparent; }
.btn-ghost:hover { background: ${T.paper}; box-shadow: 0 8px 20px -10px rgba(${T.shadowBase},.28); }
.btn-white-accent {
  margin-left: auto;
  color: ${T.accent};
  background: ${T.paper};
  box-shadow: 0 8px 22px -6px rgba(255,91,53,.30), 0 0 0 1px rgba(255,91,53,.12);
}
.btn-white-accent.btn-ready { color: ${T.paper}; background: ${T.accent}; box-shadow: 0 12px 28px -12px rgba(255,91,53,.65); animation: ready-pulse 1.6s ease-in-out infinite; }
.btn-white-accent.btn-ready:hover { transform: translateY(-1px); box-shadow: 0 12px 28px -6px rgba(255,91,53,.50); }
@keyframes ready-pulse { 50% { transform: scale(1.035); box-shadow: 0 14px 32px -10px rgba(255,91,53,.68); } }
.btn:disabled { opacity: .42; cursor: not-allowed; transform: none; box-shadow: none; }
.screen-stack {
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: clamp(12px, 2vw, 18px);
  animation: screen-in .5s cubic-bezier(.22,.8,.3,1) both;
}
@keyframes screen-in {
  from { opacity: 0; transform: translateY(16px) scale(.99); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.screen-heading { display: grid; grid-template-columns: minmax(0,1fr) 118px; align-items: center; gap: 20px; }
.heading-copy { min-width: 0; }
.lesson-kicker {
  display: inline-block;
  margin-bottom: 8px;
  color: ${T.cyan};
  font-size: 11px;
  font-weight: 900;
  letter-spacing: .15em;
}
.heading-copy h1 {
  max-width: 760px;
  font-family: 'Source Serif 4', serif;
  font-size: clamp(29px, 4.6vw, 47px);
  line-height: 1.04;
  letter-spacing: -.025em;
  font-weight: 650;
}
.heading-copy p { max-width: 720px; margin-top: 10px; color: ${T.ink2}; font-size: 15px; line-height: 1.52; }
.bit-coach { width: 118px; height: 118px; display: flex; align-items: center; justify-content: center; border-radius: 28px; background: rgba(255,255,255,.66); box-shadow: 0 12px 26px -16px rgba(${T.shadowBase},.28); }
.bit-coach .g1-char { width: 92px; height: 115px; overflow: visible; }
.g1-char {
  display: block;
  height: 100%;
  width: auto;
  filter: drop-shadow(0 6px 12px rgba(58,53,48,.22));
}
.g1-eyes {
  transform-box: fill-box;
  transform-origin: center;
  animation: g4blink 4.4s infinite;
}
@keyframes g4blink {
  0%, 93%, 100% { transform: scaleY(1); }
  96.5% { transform: scaleY(.12); }
}
.g1-bit-ant {
  transform-box: fill-box;
  transform-origin: bottom center;
  animation: g4antbob 2.2s ease-in-out infinite;
}
@keyframes g4antbob {
  0%, 100% { transform: rotate(-10deg); }
  50% { transform: rotate(10deg); }
}
.g1-bit-wave {
  transform-box: fill-box;
  transform-origin: bottom left;
  animation: g4wavebig 1s ease-in-out infinite;
}
@keyframes g4wavebig {
  0%, 100% { transform: rotate(2deg); }
  50% { transform: rotate(-26deg); }
}
.bit-wave-left,
.bit-wave-right,
.bit-think-hand,
.bit-point-arm,
.bit-idea-bulb,
.bit-focus-hands,
.bit-focus-scan,
.bit-nod-hand,
.bit-nod-check {
  transform-box: fill-box;
  transform-origin: center;
}
.bit-double-wave .bit-wave-left { transform-origin: bottom right; animation: bit-wave-left 1.05s ease-in-out infinite; }
.bit-double-wave .bit-wave-right { transform-origin: bottom left; animation: bit-wave-right 1.05s ease-in-out infinite; }
.bit-think-hand { animation: bit-think-tap 1.8s ease-in-out infinite; }
.bit-point-arm { transform-origin: left center; animation: bit-point 1.45s ease-in-out infinite; }
.bit-point-target { transform-box: fill-box; transform-origin: center; animation: bit-target 1.45s ease-in-out infinite; }
.bit-idea-bulb { animation: bit-idea 1.55s ease-in-out infinite; }
.bit-focus-hands { transform-origin: center bottom; animation: bit-focus 1.7s ease-in-out infinite; }
.bit-focus-scan { animation: bit-scan 1.7s ease-in-out infinite; }
.bit-nod-hand { animation: bit-nod-hand 1.35s ease-in-out infinite; }
.bit-nod-check { animation: bit-check 1.35s ease-in-out infinite; }
@keyframes bit-wave-left { 0%,100% { transform: rotate(2deg); } 50% { transform: rotate(25deg); } }
@keyframes bit-wave-right { 0%,100% { transform: rotate(-2deg); } 50% { transform: rotate(-25deg); } }
@keyframes bit-think-tap { 0%,100% { transform: translate(0,0) rotate(0); } 50% { transform: translate(-2px,-3px) rotate(-7deg); } }
@keyframes bit-point { 0%,100% { transform: translateX(0) rotate(0); } 48% { transform: translateX(4px) rotate(-5deg); } }
@keyframes bit-target { 0%,100% { opacity: .38; transform: scale(.72); } 50% { opacity: 1; transform: scale(1.1); } }
@keyframes bit-idea { 0%,100% { opacity: .72; transform: translateY(1px) scale(.9); } 50% { opacity: 1; transform: translateY(-3px) scale(1.08); } }
@keyframes bit-focus { 0%,100% { transform: scale(.96); } 50% { transform: scale(1.05); } }
@keyframes bit-scan { 0%,100% { opacity: .42; transform: translateY(-3px); } 50% { opacity: 1; transform: translateY(6px); } }
@keyframes bit-nod-hand { 0%,100% { transform: rotate(0); } 48% { transform: rotate(-11deg); } }
@keyframes bit-check { 0%,100% { transform: scale(.86); opacity: .72; } 50% { transform: scale(1.08); opacity: 1; } }
.model-panel {
  position: relative;
  padding: 19px;
  overflow: hidden;
  border-radius: 20px;
  background: ${T.navy};
  color: ${T.paper};
  box-shadow: 0 15px 34px -18px rgba(23,59,82,.58);
}
.model-panel::after { content: ''; position: absolute; width: 190px; height: 190px; right: -80px; top: -95px; border-radius: 50%; background: rgba(149,201,61,.12); pointer-events: none; }
.model-heading { position: relative; z-index: 1; display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 13px; color: rgba(255,255,255,.74); font-size: 11px; font-weight: 900; letter-spacing: .14em; text-transform: uppercase; }
.model-heading i { color: ${T.lime}; font-style: normal; letter-spacing: .18em; }
.model-number { position: relative; z-index: 1; font-family: 'JetBrains Mono', monospace; font-size: clamp(31px, 6vw, 52px); font-weight: 800; letter-spacing: .08em; text-align: center; white-space: pre-wrap; }
.class-groups { position: relative; z-index: 1; display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 12px; }
.class-group { min-height: 92px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; border-radius: 15px; background: rgba(255,255,255,.10); }
.class-group strong { font-family: 'JetBrains Mono', monospace; font-size: clamp(28px,5vw,42px); letter-spacing: .08em; }
.class-group span { color: rgba(255,255,255,.74); font-size: 12px; font-weight: 700; }
.group-cyan { box-shadow: inset 0 0 0 2px rgba(22,143,163,.65); }
.group-accent { box-shadow: inset 0 0 0 2px rgba(255,91,53,.68); }
.place-table { position: relative; z-index: 1; display: grid; gap: 7px; }
.place-cell { min-width: 0; min-height: 82px; padding: 8px 4px; display: flex; flex-direction: column; align-items: center; justify-content: space-between; gap: 7px; border-radius: 12px; background: rgba(255,255,255,.10); text-align: center; }
.place-cell span { min-height: 32px; display: flex; align-items: center; color: rgba(255,255,255,.70); font-size: 11px; line-height: 1.15; }
.place-cell strong { font-family: 'JetBrains Mono', monospace; font-size: clamp(21px,3.7vw,31px); }
.model-rows { position: relative; z-index: 1; display: grid; gap: 9px; }
.model-rows > div { min-height: 58px; padding: 9px 14px; display: flex; align-items: center; justify-content: space-between; gap: 14px; border-radius: 13px; background: rgba(255,255,255,.10); }
.model-rows span { color: rgba(255,255,255,.72); font-size: 12px; font-weight: 750; }
.model-rows strong { font-family: 'JetBrains Mono', monospace; font-size: clamp(20px,4vw,29px); }
.model-steps { position: relative; z-index: 1; list-style: none; display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 9px; counter-reset: none; }
.model-steps li { min-height: 64px; padding: 11px; display: flex; align-items: center; justify-content: center; border-radius: 12px; background: rgba(255,255,255,.10); text-align: center; font-size: 12px; line-height: 1.35; font-weight: 720; }
.model-solved { box-shadow: 0 15px 34px -18px rgba(34,122,83,.58), inset 0 0 0 2px rgba(149,201,61,.26); }
.class-boundary-model { position: relative; z-index: 1; display: grid; grid-template-columns: minmax(0,1fr) auto minmax(0,1fr); align-items: stretch; gap: 12px; }
.class-boundary-state { min-width: 0; min-height: 154px; padding: 13px; display: flex; flex-direction: column; justify-content: center; gap: 14px; border-radius: 15px; background: rgba(255,255,255,.10); animation: digit-group-in .5s cubic-bezier(.16,1,.3,1) both; }
.boundary-after { box-shadow: inset 0 0 0 2px rgba(149,201,61,.56); animation-delay: .38s; }
.class-boundary-state > span { font: 850 clamp(25px,4.2vw,39px)/1 'JetBrains Mono', monospace; letter-spacing: .05em; text-align: center; }
.class-boundary-state > div { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 7px; }
.class-boundary-state strong { min-width: 0; padding: 8px 5px; display: flex; flex-direction: column; align-items: center; gap: 5px; border-radius: 10px; background: rgba(255,255,255,.09); font: 850 18px/1 'JetBrains Mono', monospace; }
.class-boundary-state strong i { color: rgba(255,255,255,.64); font: 750 11px/1.2 Manrope, sans-serif; font-style: normal; text-align: center; }
.boundary-after strong:last-child { color: ${T.lime}; }
.class-boundary-carry { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 7px; color: ${T.lime}; }
.class-boundary-carry b { width: 37px; height: 37px; display: grid; place-items: center; border-radius: 12px; color: ${T.navy}; background: ${T.lime}; font: 900 11px/1 'JetBrains Mono', monospace; animation: boundary-carry-hop 1.55s ease-in-out infinite; }
.class-boundary-carry span { font-size: 25px; font-weight: 900; }
@keyframes boundary-carry-hop { 50% { transform: translateY(-5px) scale(1.06); } }
.zero-contrast-model { position: relative; z-index: 1; display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 11px; }
.zero-contrast-model article { min-width: 0; min-height: 162px; padding: 14px; display: flex; flex-direction: column; justify-content: center; gap: 10px; border-radius: 15px; background: rgba(255,255,255,.10); animation: digit-group-in .5s ease var(--model-delay) both; }
.zero-contrast-number { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 7px; }
.zero-contrast-number strong { min-width: 0; padding: 10px 4px; border-radius: 11px; background: rgba(22,143,163,.24); box-shadow: inset 0 0 0 2px rgba(22,143,163,.62); font: 850 clamp(24px,4vw,36px)/1 'JetBrains Mono', monospace; letter-spacing: .04em; text-align: center; }
.zero-contrast-number .empty-class { color: ${T.lime}; background: rgba(149,201,61,.13); box-shadow: inset 0 0 0 2px rgba(149,201,61,.58); }
.zero-contrast-model p { color: ${T.paper}; font-family: 'Source Serif 4', serif; font-size: 16px; line-height: 1.28; }
.zero-contrast-model article > span { color: #9DE3E7; font-size: 11px; font-weight: 850; letter-spacing: .06em; text-transform: uppercase; }
.theory-screen .model-panel {
  animation: digit-group-in .48s cubic-bezier(.22,.8,.3,1) .08s both;
}
.theory-screen .class-group,
.theory-screen .place-cell,
.theory-screen .model-rows > div,
.theory-screen .model-steps > li {
  animation: digit-group-in .48s cubic-bezier(.22,.8,.3,1) both;
}
.theory-screen .class-group:nth-child(1),
.theory-screen .place-cell:nth-child(1),
.theory-screen .model-rows > div:nth-child(1),
.theory-screen .model-steps > li:nth-child(1) { animation-delay: .16s; }
.theory-screen .class-group:nth-child(2),
.theory-screen .place-cell:nth-child(2),
.theory-screen .model-rows > div:nth-child(2),
.theory-screen .model-steps > li:nth-child(2) { animation-delay: .27s; }
.theory-screen .place-cell:nth-child(3),
.theory-screen .model-rows > div:nth-child(3),
.theory-screen .model-steps > li:nth-child(3) { animation-delay: .38s; }
.theory-screen .place-cell:nth-child(4) { animation-delay: .49s; }
.theory-screen .place-cell:nth-child(5) { animation-delay: .60s; }
.theory-screen .place-cell:nth-child(6) { animation-delay: .71s; }
@keyframes digit-group-in {
  from { opacity: .35; transform: translateY(9px) scale(.94); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.theory-callout {
  padding: 20px 22px;
  border-radius: 20px;
  background: ${T.paper};
  box-shadow: 0 12px 30px -18px rgba(${T.shadowBase},.30);
  animation: explanation-copy-in .56s cubic-bezier(.22,.8,.3,1) .38s both;
}
@keyframes explanation-copy-in {
  from { opacity: .2; transform: translateX(8px); }
  to { opacity: 1; transform: translateX(0); }
}
.theory-callout h2 {
  font-family: 'Source Serif 4', serif;
  font-size: clamp(20px,3vw,28px);
  line-height: 1.2;
  font-weight: 620;
}
.theory-answer {
  margin-top: 14px;
  padding: 14px 16px;
  display: grid;
  grid-template-columns: 34px minmax(0,1fr);
  align-items: start;
  gap: 10px;
  border-radius: 14px;
  color: ${T.ink};
  background: ${T.cyanSoft};
  box-shadow: inset 4px 0 0 ${T.cyan};
}
.theory-answer-mark {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  color: ${T.paper};
  background: ${T.cyan};
  font-weight: 900;
}
.theory-answer p { color: ${T.ink2}; font-size: 14px; line-height: 1.5; }
.hook-theory-layout { display: grid; grid-template-columns: 1fr; gap: 14px; align-items: start; }
.hook-mission-scene { position: relative; min-width: 0; }
.hook-mission-scene .model-panel {
  height: auto;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(190px,.48fr) minmax(0,1fr);
  align-items: center;
  column-gap: 16px;
}
.hook-mission-scene .model-heading { grid-column: 1 / -1; }
.hook-mission-scene .model-number { grid-column: 1; }
.hook-mission-scene .class-groups { grid-column: 2; }
.hook-signal { position: absolute; z-index: 2; top: 18px; right: 18px; display: flex; align-items: end; gap: 4px; }
.hook-signal i { width: 4px; border-radius: 999px; background: ${T.lime}; animation: data-digit-in .65s cubic-bezier(.16,1,.3,1) both; }
.hook-signal i:nth-child(1) { height: 8px; animation-delay: .1s; }
.hook-signal i:nth-child(2) { height: 14px; animation-delay: .2s; }
.hook-signal i:nth-child(3) { height: 20px; animation-delay: .3s; }
.hook-signal i:nth-child(4) { height: 27px; animation-delay: .4s; }
@keyframes data-digit-in {
  from { opacity: 0; transform: translateY(9px) scale(.9); filter: blur(4px); }
  to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
}
.theory-callout-mission { display: flex; flex-direction: column; justify-content: center; background: ${T.accentSoft}; box-shadow: inset 4px 0 0 ${T.accent}, 0 12px 30px -18px rgba(${T.shadowBase},.30); }
.foundation-theory-layout { display: grid; grid-template-columns: minmax(0,.8fr) minmax(0,1.2fr); gap: 16px; }
.foundation-recap-strip { padding: 18px; display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 10px; border-radius: 20px; background: ${T.navy}; }
.foundation-recap-card { min-width: 0; min-height: 130px; padding: 12px 8px; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 11px; border-radius: 15px; color: ${T.paper}; background: rgba(255,255,255,.1); animation: digit-group-in .48s ease var(--theory-delay) both; }
.foundation-recap-card span { color: rgba(255,255,255,.68); font-size: 11px; text-align: center; }
.foundation-recap-card strong { font: 800 38px/1 'JetBrains Mono', monospace; }
.rule-theory-layout { position: relative; }
.rule-assembly-line { width: min(360px,80%); height: 34px; margin: -7px auto 5px; display: grid; grid-template-columns: repeat(3,1fr); align-items: center; position: relative; }
.rule-assembly-line::before { content: ''; position: absolute; left: 14%; right: 14%; height: 3px; border-radius: 999px; background: ${T.lime}; transform: scaleX(0); transform-origin: left; animation: rule-line-in .7s ease .55s forwards; }
.rule-assembly-line i { z-index: 1; width: 28px; height: 28px; margin: auto; display: grid; place-items: center; border-radius: 50%; color: ${T.navy}; background: ${T.lime}; font-style: normal; font: 900 12px/1 'JetBrains Mono', monospace; animation: digit-group-in .45s ease var(--theory-delay) both; }
@keyframes rule-line-in { to { transform: scaleX(1); } }
.theory-callout-rule { box-shadow: inset 4px 0 0 ${T.lime}, 0 12px 30px -18px rgba(${T.shadowBase},.30); }
.strategy-route { padding: 16px; display: grid; grid-template-columns: 1fr auto 1fr auto 1fr; align-items: stretch; gap: 9px; border-radius: 20px; background: ${T.navy}; }
.strategy-route > i { align-self: center; color: ${T.lime}; font-style: normal; font-weight: 900; }
.strategy-route-step { min-width: 0; min-height: 92px; padding: 11px; display: flex; flex-direction: column; justify-content: center; gap: 8px; border-radius: 14px; color: ${T.paper}; background: rgba(255,255,255,.1); animation: digit-group-in .48s ease var(--theory-delay) both; }
.strategy-route-step span { width: 27px; height: 27px; display: grid; place-items: center; border-radius: 9px; color: ${T.navy}; background: ${T.lime}; font: 900 11px/1 'JetBrains Mono', monospace; }
.strategy-route-step p { font-size: 12px; line-height: 1.35; font-weight: 720; }
.strategy-contrast-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 11px; }
.strategy-contrast-grid article { min-height: 132px; padding: 16px; display: flex; flex-direction: column; gap: 7px; border-radius: 17px; animation: explanation-copy-in .52s ease both; }
.strategy-contrast-grid article > span { font-size: 11px; font-weight: 900; letter-spacing: .13em; }
.strategy-contrast-grid article > strong { color: ${T.navy}; font-family: 'Source Serif 4', serif; font-size: 16px; line-height: 1.3; }
.strategy-contrast-grid article > p { margin-top: auto; color: ${T.ink2}; font-size: 12px; line-height: 1.43; }
.strategy-contrast-reliable { color: ${T.success}; background: ${T.successSoft}; box-shadow: inset 4px 0 0 ${T.success}; }
.strategy-contrast-trap { color: ${T.warn}; background: ${T.warnSoft}; box-shadow: inset 4px 0 0 ${T.warn}; animation-delay: .18s !important; }
.theory-callout-strategy { margin-top: 14px; box-shadow: inset 4px 0 0 ${T.success}, 0 12px 30px -18px rgba(${T.shadowBase},.30); }
.error-theory-layout { display: grid; grid-template-columns: 1fr; gap: 14px; align-items: start; }
.error-walkthrough-board { padding: 17px; display: grid; grid-template-columns: repeat(2,minmax(0,1fr)) auto minmax(0,1fr); align-items: stretch; gap: 8px; border-radius: 20px; background: ${T.navy}; }
.error-walkthrough-row, .error-repair-result { min-height: 56px; padding: 9px 13px; display: flex; align-items: center; justify-content: space-between; gap: 12px; border-radius: 13px; color: ${T.paper}; background: rgba(255,255,255,.1); animation: digit-group-in .48s ease var(--theory-delay) both; }
.error-walkthrough-row span, .error-repair-result span { color: rgba(255,255,255,.68); font-size: 11px; font-weight: 800; text-transform: uppercase; }
.error-walkthrough-row strong, .error-repair-result strong { font: 800 25px/1 'JetBrains Mono', monospace; }
.error-row-draft { box-shadow: inset 4px 0 0 ${T.warn}; }
.error-repair-arrow { display: grid; place-items: center; color: ${T.lime}; text-align: center; font-size: 22px; font-weight: 900; transform: rotate(-90deg); }
.error-repair-result { color: ${T.navy}; background: ${T.successSoft}; box-shadow: inset 4px 0 0 ${T.success}; }
.error-repair-result span { color: ${T.success}; }
.theory-callout-error { box-shadow: inset 4px 0 0 ${T.warn}, 0 12px 30px -18px rgba(${T.shadowBase},.30); }
.summary-signal { min-height: 120px; padding: 8px 24px; display: flex; align-items: center; justify-content: center; gap: 24px; border-radius: 20px; color: ${T.paper}; background: ${T.navy}; }
.summary-signal .g1-char { width: 78px; height: 98px; }
.summary-signal strong { font: 800 clamp(27px,5vw,45px)/1 'JetBrains Mono', monospace; letter-spacing: .05em; }
.summary-theory-cards { margin-top: 12px; display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 10px; }
.summary-theory-cards > div { min-height: 90px; padding: 13px; display: grid; grid-template-columns: 31px minmax(0,1fr); gap: 9px; align-items: start; border-radius: 15px; background: ${T.paper}; box-shadow: 0 10px 25px -18px rgba(${T.shadowBase},.3); animation: digit-group-in .48s ease both; }
.summary-theory-cards > div:nth-child(2) { animation-delay: .12s; }
.summary-theory-cards > div:nth-child(3) { animation-delay: .24s; }
.summary-theory-cards span { color: ${T.accent}; font: 900 11px/1 'JetBrains Mono', monospace; }
.summary-theory-cards p { color: ${T.ink2}; font-size: 12px; line-height: 1.42; }
.theory-callout-summary { margin-top: 12px; box-shadow: inset 4px 0 0 ${T.lime}, 0 12px 30px -18px rgba(${T.shadowBase},.30); }
.finale-screen { gap: 10px; }
.finale-heading { min-width: 0; padding: 12px 15px; border-radius: 17px; background: linear-gradient(135deg, ${T.paper}, ${T.cyanSoft}); box-shadow: 0 12px 28px -22px rgba(${T.shadowBase},.38); }
.finale-heading > span { display: block; margin-bottom: 4px; color: ${T.accent}; font: 900 9px/1 'JetBrains Mono', monospace; letter-spacing: .15em; }
.finale-heading h1 { color: ${T.navy}; font: 650 clamp(20px,3vw,28px)/1.08 'Source Serif 4', serif; overflow-wrap: anywhere; }
.finale-heading p { max-width: 760px; margin-top: 5px; color: ${T.ink2}; font-size: 12px; line-height: 1.42; overflow-wrap: anywhere; }
.finale-layout { min-width: 0; display: grid; grid-template-columns: minmax(0,1fr) minmax(248px,.42fr); gap: 10px; align-items: stretch; }
.finale-main { min-width: 0; display: flex; flex-direction: column; gap: 9px; }
.finale-mastery { min-width: 0; display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 8px; }
.finale-takeaway { min-width: 0; min-height: 88px; padding: 10px; display: grid; grid-template-columns: 28px minmax(0,1fr); align-items: start; gap: 7px; border-radius: 14px; background: ${T.paper}; box-shadow: 0 10px 24px -19px rgba(${T.shadowBase},.36); opacity: 0; transform: translateY(8px); transition: opacity .34s ease, transform .34s ease; }
.finale-takeaway.is-visible { opacity: 1; transform: none; }
.finale-takeaway > span { width: 28px; height: 28px; display: grid; place-items: center; border-radius: 9px; color: ${T.paper}; background: ${T.cyan}; font: 900 10px/1 'JetBrains Mono', monospace; }
.finale-takeaway:nth-child(2) > span { background: ${T.accent}; }
.finale-takeaway:nth-child(3) > span { background: ${T.success}; }
.finale-takeaway p { color: ${T.ink}; font-size: 11px; line-height: 1.38; font-weight: 720; overflow-wrap: anywhere; }
.finale-proof, .finale-bridge { min-width: 0; opacity: 0; transform: translateY(7px); transition: opacity .34s ease, transform .34s ease; }
.finale-proof.is-visible, .finale-bridge.is-visible { opacity: 1; transform: none; }
.finale-proof { padding: 9px 12px; display: grid; grid-template-columns: auto auto minmax(0,1fr); align-items: center; gap: 9px; border-radius: 13px; background: ${T.successSoft}; box-shadow: inset 4px 0 0 ${T.success}; }
.finale-proof > span, .finale-bridge strong { color: ${T.success}; font: 900 9px/1.2 'JetBrains Mono', monospace; letter-spacing: .1em; }
.finale-proof > strong { color: ${T.navy}; font: 800 15px/1 'JetBrains Mono', monospace; white-space: nowrap; }
.finale-proof p, .finale-bridge p { color: ${T.ink2}; font-size: 11px; line-height: 1.35; overflow-wrap: anywhere; }
.finale-bridge { padding: 9px 11px; display: grid; grid-template-columns: 30px minmax(0,1fr); align-items: center; gap: 9px; border-radius: 13px; background: ${T.accentSoft}; }
.finale-bridge > span { width: 30px; height: 30px; display: grid; place-items: center; border-radius: 10px; color: ${T.paper}; background: ${T.accent}; font-weight: 900; }
.finale-bridge strong { color: ${T.accent}; }
.finale-bridge p { margin-top: 3px; }
.finale-reward { position: relative; min-width: 0; min-height: 206px; padding: 15px 76px 14px 62px; display: flex; align-items: center; overflow: hidden; border-radius: 18px; color: ${T.paper}; background: linear-gradient(145deg, ${T.navy}, #0f2c40); box-shadow: 0 16px 32px -22px rgba(${T.shadowBase},.58); }
.finale-reward-copy { position: relative; z-index: 2; min-width: 0; }
.finale-reward-copy > span { color: ${T.lime}; font: 900 9px/1.2 'JetBrains Mono', monospace; letter-spacing: .12em; }
.finale-reward-copy h2 { margin-top: 5px; font: 650 19px/1.05 'Source Serif 4', serif; overflow-wrap: anywhere; }
.finale-status { margin-top: 10px; }
.finale-status strong { display: block; color: ${T.lime}; font: 850 25px/1 'JetBrains Mono', monospace; }
.finale-status p { margin-top: 3px; font-size: 11px; line-height: 1.25; font-weight: 800; }
.finale-status small { display: block; margin-top: 3px; color: rgba(255,255,255,.68); font-size: 9px; line-height: 1.3; }
.finale-status-neutral strong { font-size: 22px; }
.finale-medal { position: absolute; z-index: 2; left: 11px; top: 50%; width: 39px; height: 39px; display: grid; place-items: center; border-radius: 50%; color: ${T.navy}; background: ${T.lime}; box-shadow: 0 0 0 5px rgba(196,232,92,.14); transform: translateY(-50%) scale(.78); transition: transform .38s ease; }
.finale-reward.is-complete .finale-medal { transform: translateY(-50%) scale(1); }
.finale-reward-bit { position: absolute; z-index: 1; right: 1px; bottom: -5px; width: 76px; height: 96px; }
.finale-reward-bit .g1-char { width: 100%; height: 100%; }
.finale-reward.is-complete .finale-reward-bit { animation: finale-bit-float 3.2s ease-in-out infinite; }
.finale-confetti i { position: absolute; z-index: 0; top: 12px; left: 20%; width: 5px; height: 9px; border-radius: 3px; background: ${T.lime}; opacity: 0; }
.finale-confetti i:nth-child(2) { left: 34%; background: ${T.accent}; transform: rotate(24deg); }
.finale-confetti i:nth-child(3) { left: 49%; background: ${T.cyan}; transform: rotate(-20deg); }
.finale-confetti i:nth-child(4) { left: 63%; top: 22px; background: ${T.paper}; }
.finale-confetti i:nth-child(5) { left: 78%; background: ${T.accent}; transform: rotate(38deg); }
.finale-confetti i:nth-child(6) { left: 27%; top: 34px; background: ${T.cyan}; }
.finale-confetti i:nth-child(7) { left: 57%; top: 42px; background: ${T.lime}; transform: rotate(-34deg); }
.finale-confetti i:nth-child(8) { left: 86%; top: 34px; background: ${T.paper}; }
.finale-reward.is-complete .finale-confetti i { animation: finale-confetti-fall 1.45s ease-out both; }
.finale-reward.is-complete .finale-confetti i:nth-child(even) { animation-delay: .1s; }
@keyframes finale-bit-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
@keyframes finale-confetti-fall { 0% { opacity: 0; translate: 0 -8px; } 20% { opacity: .9; } 100% { opacity: 0; translate: 5px 78px; rotate: 160deg; } }
.deep-sequence-tabs {
  display: grid;
  grid-template-columns: repeat(2,minmax(0,1fr));
  gap: 10px;
}
.deep-sequence-tabs button {
  min-height: 58px;
  padding: 10px 13px;
  display: grid;
  grid-template-columns: 34px minmax(0,1fr);
  align-items: center;
  gap: 10px;
  border: 0;
  border-radius: 14px;
  color: ${T.ink2};
  background: rgba(255,255,255,.72);
  cursor: pointer;
  text-align: left;
  box-shadow: inset 0 0 0 1px rgba(135,148,157,.17);
  transition: transform .2s ease, color .2s ease, background .2s ease, box-shadow .2s ease;
}
.deep-sequence-tabs button:hover { transform: translateY(-1px); }
.deep-sequence-tabs button > span {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 11px;
  background: ${T.cyanSoft};
  color: ${T.cyan};
  font: 900 11px/1 'JetBrains Mono', monospace;
}
.deep-sequence-tabs button strong { font-size: 12px; line-height: 1.3; }
.deep-sequence-tabs .deep-tab-active {
  color: ${T.navy};
  background: ${T.paper};
  box-shadow: inset 0 0 0 2px rgba(22,143,163,.38), 0 10px 24px -16px rgba(22,143,163,.46);
}
.deep-sequence-tabs .deep-tab-active > span { color: ${T.paper}; background: ${T.cyan}; }
.deep-sequence-tabs .deep-tab-seen > span { color: ${T.navy}; background: ${T.lime}; }
.deep-sequence-stage {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
  align-items: start;
  animation: deep-stage-in .5s cubic-bezier(.22,.8,.3,1) both;
}
@keyframes deep-stage-in {
  from { opacity: .28; transform: translateY(10px); filter: blur(4px); }
  to { opacity: 1; transform: translateY(0); filter: blur(0); }
}
.deep-sequence-stage .model-panel { width: 100%; min-height: 0; align-self: start; display: flex; flex-direction: column; justify-content: center; }
.deep-sequence-stage .model-classes:has(> .model-number),
.deep-sequence-stage .model-table:has(> .model-number) {
  display: grid;
  grid-template-columns: minmax(180px,.44fr) minmax(0,1fr);
  align-items: center;
  column-gap: 14px;
}
.deep-sequence-stage .model-classes:has(> .model-number) .model-heading,
.deep-sequence-stage .model-table:has(> .model-number) .model-heading { grid-column: 1 / -1; }
.deep-sequence-stage .model-classes:has(> .model-number) .model-number,
.deep-sequence-stage .model-table:has(> .model-number) .model-number { grid-column: 1; }
.deep-sequence-stage .model-classes:has(> .model-number) .class-groups,
.deep-sequence-stage .model-table:has(> .model-number) .place-table { grid-column: 2; }
.deep-sequence-explanation {
  padding: 18px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  border-radius: 20px;
  background: ${T.accentSoft};
  box-shadow: inset 4px 0 0 ${T.accent}, 0 12px 28px -18px rgba(${T.shadowBase},.34);
}
.deep-sequence-explanation > span { color: ${T.accent}; font-size: 11px; font-weight: 900; letter-spacing: .14em; }
.deep-sequence-explanation h2 { font-family: 'Source Serif 4', serif; font-size: clamp(19px,2.6vw,26px); line-height: 1.2; font-weight: 650; }
.deep-sequence-explanation p { color: ${T.ink2}; font-size: 13px; line-height: 1.48; }
.deep-contrast-row { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 10px; }
.deep-contrast-row article {
  min-height: 78px;
  padding: 12px 14px;
  border-radius: 14px;
  background: ${T.paper};
  opacity: .2;
  transform: translateY(8px);
  transition: opacity .35s ease, transform .35s ease, box-shadow .35s ease;
  box-shadow: inset 3px 0 0 rgba(135,148,157,.24);
}
.deep-contrast-row article.deep-insight-visible {
  opacity: 1;
  transform: translateY(0);
  box-shadow: inset 3px 0 0 ${T.success}, 0 9px 24px -20px rgba(${T.shadowBase},.3);
}
.deep-contrast-row article span { color: ${T.success}; font-size: 11px; font-weight: 900; letter-spacing: .13em; }
.deep-contrast-row article strong { display: block; margin-top: 6px; color: ${T.navy}; font-size: 12px; line-height: 1.35; }
.deep-contrast-row article p { margin-top: 5px; color: ${T.ink2}; font-size: 11px; line-height: 1.4; }
.deep-replay {
  min-width: 48px;
  min-height: 48px;
  align-self: center;
  padding: 0 15px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 0;
  border-radius: 12px;
  color: ${T.cyan};
  background: ${T.cyanSoft};
  cursor: pointer;
  font-size: 12px;
  font-weight: 800;
}
.worked-featured-example {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  align-items: start;
}
.worked-featured-example > .model-panel { width: 100%; min-height: 0; align-self: start; }
.worked-featured-example > div:last-child {
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 9px;
  border-radius: 18px;
  background: ${T.cyanSoft};
  box-shadow: inset 4px 0 0 ${T.cyan};
  animation: explanation-copy-in .5s ease .22s both;
}
.worked-featured-example > div:last-child > span { color: ${T.cyan}; font-size: 11px; font-weight: 900; letter-spacing: .14em; }
.worked-featured-example h2 { font-family: 'Source Serif 4', serif; font-size: clamp(17px,2.4vw,23px); line-height: 1.2; }
.worked-featured-example p { color: ${T.ink2}; font-size: 12px; line-height: 1.45; }
.worked-examples-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 10px; }
.worked-example-card { min-height: 132px; padding: 15px; display: grid; grid-template-columns: 38px minmax(0,1fr); gap: 11px; border-radius: 17px; background: ${T.paper}; box-shadow: 0 12px 28px -20px rgba(${T.shadowBase},.34); animation: digit-group-in .5s ease var(--example-delay) both; }
.worked-example-number { width: 34px; height: 34px; display: grid; place-items: center; border-radius: 11px; color: ${T.paper}; background: ${T.cyan}; font: 900 11px/1 'JetBrains Mono', monospace; }
.worked-example-card h2 { color: ${T.ink}; font-family: 'Source Serif 4', serif; font-size: 16px; line-height: 1.28; font-weight: 650; }
.worked-example-card strong { display: block; margin-top: 8px; color: ${T.success}; font: 800 17px/1.3 'JetBrains Mono', monospace; }
.worked-example-card p { margin-top: 6px; color: ${T.ink2}; font-size: 12px; line-height: 1.4; }
.worked-examples-finish { padding: 8px 15px; display: flex; align-items: center; justify-content: center; gap: 12px; border-radius: 15px; color: ${T.success}; background: ${T.successSoft}; font-weight: 800; animation: explanation-copy-in .55s ease .55s both; }
.worked-examples-finish .g1-char { width: 54px; height: 68px; }
.city-lab-tabs { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 9px; }
.city-lab-tabs button { min-height: 62px; padding: 9px 12px; display: flex; align-items: center; justify-content: space-between; gap: 10px; border: 0; border-radius: 14px; color: ${T.ink2}; background: rgba(255,255,255,.72); cursor: pointer; box-shadow: inset 0 0 0 1px rgba(135,148,157,.17); transition: transform .2s ease, color .2s ease, background .2s ease, box-shadow .2s ease; }
.city-lab-tabs button:hover { transform: translateY(-1px); }
.city-lab-tabs button > span { padding: 6px 8px; border-radius: 9px; color: ${T.cyan}; background: ${T.cyanSoft}; font: 900 11px/1 'JetBrains Mono', monospace; }
.city-lab-tabs button > strong { font: 850 14px/1 'JetBrains Mono', monospace; }
.city-lab-tabs .city-lab-tab-active { color: ${T.navy}; background: ${T.paper}; box-shadow: inset 0 0 0 2px rgba(22,143,163,.42), 0 10px 24px -16px rgba(22,143,163,.5); }
.city-lab-tabs .city-lab-tab-active > span { color: ${T.paper}; background: ${T.cyan}; }
.city-lab-tabs .city-lab-tab-seen > span { color: ${T.navy}; background: ${T.lime}; }
.city-lab-solution { padding: 18px; display: grid; gap: 14px; border-radius: 20px; background: ${T.paper}; box-shadow: 0 12px 30px -18px rgba(${T.shadowBase},.32); animation: deep-stage-in .5s cubic-bezier(.22,.8,.3,1) both; }
.city-lab-voice { padding: 13px 15px; display: grid; grid-template-columns: auto minmax(0,1fr); align-items: center; gap: 13px; border-radius: 14px; color: ${T.paper}; background: ${T.navy}; }
.city-lab-voice span { color: ${T.lime}; font-size: 11px; font-weight: 900; letter-spacing: .13em; }
.city-lab-voice p { font-family: 'Source Serif 4', serif; font-size: clamp(17px,2.6vw,23px); line-height: 1.28; }
.city-lab-path { display: grid; grid-template-columns: 1fr auto 1fr auto 1.2fr; align-items: stretch; gap: 8px; }
.city-lab-path > i { align-self: center; color: ${T.accent}; font-style: normal; font-weight: 900; }
.city-lab-path article { min-width: 0; min-height: 112px; padding: 11px; display: flex; flex-direction: column; justify-content: center; gap: 8px; border-radius: 14px; background: #F8F8F4; animation: digit-group-in .5s ease both; }
.city-lab-path article:nth-of-type(2) { animation-delay: .14s; }
.city-lab-path article:nth-of-type(3) { animation-delay: .28s; }
.city-lab-path article > span { width: 29px; height: 29px; display: grid; place-items: center; border-radius: 9px; color: ${T.paper}; background: ${T.cyan}; font: 900 11px/1 'JetBrains Mono', monospace; }
.city-lab-path article > small { color: ${T.ink3}; font-size: 11px; font-weight: 850; letter-spacing: .1em; text-transform: uppercase; }
.city-lab-path article > div { display: flex; gap: 6px; }
.city-lab-path article strong { min-width: 0; padding: 7px; border-radius: 9px; color: ${T.navy}; background: ${T.cyanSoft}; font: 850 clamp(15px,2.4vw,21px)/1 'JetBrains Mono', monospace; text-align: center; }
.city-lab-path article p { color: ${T.ink2}; font-family: 'Source Serif 4', serif; font-size: 14px; line-height: 1.35; }
.city-lab-note { min-height: 72px; padding: 5px 14px 5px 4px; display: grid; grid-template-columns: 58px minmax(0,1fr); align-items: center; gap: 9px; border-radius: 14px; color: ${T.success}; background: ${T.successSoft}; box-shadow: inset 4px 0 0 ${T.success}; }
.city-lab-note .g1-char { width: 54px; height: 67px; }
.city-lab-note p { color: ${T.ink2}; font-size: 12px; line-height: 1.42; font-weight: 720; }
.city-lab-next { margin-top: -4px; }
.question-card { padding: 22px; border-radius: 20px; background: ${T.paper}; box-shadow: 0 12px 30px -18px rgba(${T.shadowBase},.30); }
.question-topline { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 8px; color: ${T.accent}; font-size: 11px; font-weight: 900; letter-spacing: .14em; }
.question-topline small { color: ${T.warn}; font-size: 11px; letter-spacing: 0; }
.question-card h2 { max-width: 780px; font-family: 'Source Serif 4', serif; font-size: clamp(21px,3.2vw,30px); line-height: 1.18; font-weight: 620; }
.options-grid { margin-top: 16px; display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 10px; }
.option {
  min-height: 58px;
  padding: 11px 14px;
  display: flex;
  align-items: center;
  gap: 11px;
  border: 0;
  border-radius: 14px;
  background: #F8F8F4;
  color: ${T.ink};
  cursor: pointer;
  text-align: left;
  line-height: 1.34;
  box-shadow: inset 0 0 0 1px rgba(135,148,157,.16), 0 6px 16px -10px rgba(${T.shadowBase},.22);
  transition: transform .18s ease, background .18s ease, box-shadow .18s ease, opacity .18s ease;
}
.option:hover:not(:disabled) { transform: translateY(-1px); background: ${T.accentSoft}; box-shadow: inset 0 0 0 1px rgba(255,91,53,.24), 0 10px 20px -12px rgba(255,91,53,.34); }
.option:disabled { cursor: default; }
.option-letter { width: 32px; height: 32px; flex: 0 0 auto; display: inline-flex; align-items: center; justify-content: center; border-radius: 10px; background: ${T.paper}; color: ${T.cyan}; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 900; box-shadow: 0 4px 12px -8px rgba(${T.shadowBase},.3); }
.option-picked-wrong { color: ${T.warn}; background: ${T.warnSoft}; box-shadow: inset 0 0 0 2px rgba(169,111,19,.28); opacity: .64; }
.option-correct { color: ${T.success}; background: ${T.successSoft}; box-shadow: inset 0 0 0 2px rgba(34,122,83,.28), 0 8px 20px -12px rgba(34,122,83,.35); }
.option-correct .option-letter { color: ${T.paper}; background: ${T.success}; }
.option-dismissed { opacity: .42; }
.number-entry-row { margin-top: 16px; display: flex; align-items: center; justify-content: flex-end; gap: 10px; }
.answer-input {
  width: 100%;
  min-width: 0;
  min-height: 58px;
  padding: 10px 16px;
  border: 0;
  border-radius: 14px;
  outline: none;
  background: #F8F8F4;
  color: ${T.ink};
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(21px,4vw,29px);
  font-weight: 800;
  letter-spacing: .07em;
  box-shadow: inset 0 0 0 1px rgba(135,148,157,.20), 0 6px 16px -10px rgba(${T.shadowBase},.22);
  transition: box-shadow .18s ease, background .18s ease;
}
.answer-input:focus { background: ${T.paper}; box-shadow: inset 0 0 0 2px rgba(22,143,163,.48), 0 8px 22px -12px rgba(22,143,163,.35); }
.answer-input-correct { color: ${T.success}; background: ${T.successSoft}; box-shadow: inset 0 0 0 2px rgba(34,122,83,.30); }
.answer-input:disabled { opacity: .72; }
.btn-check { flex: 0 0 auto; }
.feedback { max-height: 0; margin-top: 0; overflow: hidden; opacity: 0; transition: max-height .38s ease, margin-top .38s ease, opacity .28s ease; }
.feedback-visible { max-height: 420px; margin-top: 14px; opacity: 1; }
.feedback-card { min-height: 94px; padding: 12px 15px 12px 7px; display: grid; grid-template-columns: 82px minmax(0,1fr); align-items: center; gap: 10px; border-radius: 15px; }
.feedback-card .g1-char { width: 76px; height: 92px; }
.feedback-card strong { display: block; margin-bottom: 5px; font-family: 'Source Serif 4', serif; font-size: 13px; letter-spacing: .08em; }
.feedback-card p { color: ${T.ink2}; font-size: 13px; line-height: 1.45; }
.feedback-correct { background: ${T.successSoft}; box-shadow: inset 4px 0 0 ${T.success}; }
.feedback-correct strong { color: ${T.success}; }
.feedback-hint { background: ${T.warnSoft}; box-shadow: inset 4px 0 0 ${T.warn}; }
.feedback-hint strong { color: ${T.warn}; }
.fact-card, .bridge-card { margin-top: 12px; padding: 13px 15px; display: flex; align-items: flex-start; gap: 11px; border-radius: 13px; }
.fact-card { background: ${T.cyanSoft}; color: ${T.cyan}; }
.fact-card strong { font-size: 11px; letter-spacing: .14em; }
.fact-card p, .bridge-card p { color: ${T.ink2}; font-size: 13px; line-height: 1.42; }
.bridge-card { background: ${T.accentSoft}; }
.bridge-card > span { color: ${T.accent}; font-weight: 900; }
.compact-heading { grid-template-columns: minmax(0,1fr) auto; }
.rapid-score { width: 96px; height: 96px; display: flex; align-items: baseline; justify-content: center; border-radius: 26px; background: ${T.navy}; color: ${T.paper}; box-shadow: 0 12px 26px -15px rgba(23,59,82,.55); }
.rapid-score strong { align-self: center; font-family: 'JetBrains Mono', monospace; font-size: 38px; }
.rapid-score span { align-self: center; color: rgba(255,255,255,.62); font-size: 14px; }
.rapid-dots { display: grid; grid-template-columns: repeat(4,1fr); gap: 8px; }
.rapid-dots i { height: 7px; border-radius: 999px; background: rgba(135,148,157,.24); transition: background .2s ease, box-shadow .2s ease; }
.rapid-dots i.current { background: ${T.accent}; box-shadow: 0 0 9px rgba(255,91,53,.45); }
.rapid-dots i.done { background: ${T.success}; }
.test-complete { margin-top: 14px; padding: 10px 16px; display: flex; align-items: center; justify-content: center; gap: 12px; border-radius: 15px; background: ${T.successSoft}; color: ${T.success}; font-weight: 800; }
.test-complete .g1-char { width: 62px; height: 74px; }
@keyframes bit-nod { 0%,100% { transform: translateY(0) rotate(0); } 45% { transform: translateY(-5px) rotate(-3deg); } 70% { transform: translateY(1px) rotate(2deg); } }
.lesson-root button:focus-visible { outline: 3px solid rgba(22,143,163,.42); outline-offset: 3px; }
@media (max-width: 760px) {
  .screen-heading { grid-template-columns: minmax(0,1fr) 94px; }
  .bit-coach { width: 94px; height: 102px; }
  .bit-coach .g1-char { width: 78px; height: 100px; }
  .options-grid { grid-template-columns: 1fr; }
  .hook-theory-layout, .foundation-theory-layout, .error-theory-layout { grid-template-columns: 1fr; }
  .deep-sequence-stage, .worked-featured-example { grid-template-columns: 1fr; }
  .hook-mission-scene .model-panel,
  .deep-sequence-stage .model-classes:has(> .model-number),
  .deep-sequence-stage .model-table:has(> .model-number) { display: flex; flex-direction: column; }
  .error-walkthrough-board { display: flex; flex-direction: column; }
  .error-repair-arrow { transform: none; }
  .class-boundary-model { grid-template-columns: 1fr; }
  .class-boundary-carry { flex-direction: row; }
  .class-boundary-carry > span { transform: rotate(90deg); }
  .zero-contrast-model { grid-template-columns: 1fr; }
  .finale-layout { grid-template-columns: 1fr; }
  .finale-reward { min-height: 132px; }
}
@media (max-width: 639.98px) {
  .lesson-root { width: 390px; }
  .stage { width: 390px; }
  .stage-header { padding-top: 10px; padding-bottom: 8px; }
  .stage-content { padding-top: 10px; padding-bottom: 18px; scrollbar-width: none; }
  .stage-content::-webkit-scrollbar { display: none; }
  .stage-nav { min-height: 66px; padding-top: 8px; }
  .screen-type { display: none; }
  .chrome-title { max-width: 170px; font-size: 11px; }
  .screen-stack { gap: 12px; }
  .screen-heading { grid-template-columns: minmax(0,1fr) 76px; gap: 8px; }
  .heading-copy h1 { font-size: 27px; }
  .heading-copy p { margin-top: 7px; font-size: 13px; line-height: 1.4; }
  .lesson-kicker { margin-bottom: 5px; font-size: 11px; }
  .bit-coach { width: 76px; height: 82px; border-radius: 20px; }
  .bit-coach .g1-char { width: 62px; height: 78px; }
  .model-panel { padding: 13px; border-radius: 16px; }
  .model-heading { margin-bottom: 9px; font-size: 11px; }
  .model-number { font-size: 30px; }
  .class-groups { gap: 7px; }
  .class-group { min-height: 72px; }
  .class-group strong { font-size: 27px; }
  .class-group span { font-size: 11px; }
  .place-table { gap: 4px; }
  .place-cell { min-height: 64px; padding: 5px 2px; }
  .place-cell span { min-height: 36px; font-size: 11px; }
  .place-cell strong { font-size: 20px; }
  .model-steps { grid-template-columns: 1fr; gap: 5px; }
  .model-steps li { min-height: 42px; padding: 8px; }
  .question-card { padding: 14px; border-radius: 16px; }
  .question-card h2 { font-size: 20px; }
  .options-grid { margin-top: 11px; gap: 7px; }
  .option { min-height: 50px; padding: 8px 10px; font-size: 12px; }
  .option-letter { width: 29px; height: 29px; }
  .feedback-card { grid-template-columns: 66px minmax(0,1fr); min-height: 80px; padding: 8px 10px 8px 3px; }
  .feedback-card .g1-char { width: 62px; height: 76px; }
  .feedback-card p { font-size: 12px; }
  .btn { min-height: 48px; padding: 0 14px; font-size: 12px; }
  .number-entry-row { gap: 7px; }
  .answer-input { min-height: 50px; padding: 8px 11px; font-size: 20px; }
  .lesson-preview .stage-header { padding-top: 60px; }
  .rapid-score { width: 72px; height: 72px; border-radius: 20px; }
  .rapid-score strong { font-size: 30px; }
  .theory-callout { padding: 14px; border-radius: 16px; }
  .theory-answer { padding: 11px; grid-template-columns: 30px minmax(0,1fr); }
  .theory-answer p { font-size: 12px; }
  .hook-mission-scene .model-panel { min-height: 0; }
  .foundation-recap-strip { padding: 12px; gap: 6px; }
  .foundation-recap-card { min-height: 90px; padding: 8px 4px; }
  .foundation-recap-card span { font-size: 11px; }
  .foundation-recap-card strong { font-size: 28px; }
  .strategy-route { padding: 11px; grid-template-columns: 1fr; gap: 6px; }
  .strategy-route > i { transform: rotate(90deg); text-align: center; }
  .strategy-route-step { min-height: 62px; }
  .strategy-contrast-grid { grid-template-columns: 1fr; gap: 7px; }
  .strategy-contrast-grid article { min-height: 0; padding: 13px; }
  .summary-theory-cards { grid-template-columns: 1fr; }
  .worked-examples-grid { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 6px; }
  .deep-sequence-tabs, .deep-contrast-row { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 6px; }
  .deep-sequence-tabs button { min-height: 52px; padding: 7px; grid-template-columns: 28px minmax(0,1fr); gap: 6px; }
  .deep-sequence-tabs button > span { width: 28px; height: 28px; font-size: 9px; }
  .deep-sequence-tabs button strong { font-size: 10px; }
  .deep-sequence-stage .model-panel { min-height: 0; }
  .deep-sequence-explanation { padding: 14px; border-radius: 16px; }
  .deep-contrast-row article { min-height: 0; padding: 8px; }
  .deep-contrast-row article span { font-size: 8px; }
  .deep-contrast-row article strong { margin-top: 4px; font-size: 10px; }
  .deep-contrast-row article p { margin-top: 3px; font-size: 9px; line-height: 1.3; }
  .worked-example-card { min-height: 0; padding: 9px; grid-template-columns: 30px minmax(0,1fr); gap: 7px; }
  .worked-example-number { width: 30px; height: 30px; }
  .worked-example-card h2 { font-size: 13px; }
  .worked-example-card strong { margin-top: 5px; font-size: 14px; }
  .worked-example-card p { margin-top: 4px; font-size: 10px; }
  .summary-signal { min-height: 96px; }
  .class-boundary-state { min-height: 112px; padding: 10px; }
  .class-boundary-state > span { font-size: 27px; }
  .zero-contrast-model article { min-height: 124px; padding: 11px; }
  .zero-contrast-model p { font-size: 14px; }
  .city-lab-tabs { grid-template-columns: repeat(3,minmax(0,1fr)); gap: 5px; }
  .city-lab-tabs button { min-height: 50px; padding: 6px; flex-direction: column; justify-content: center; gap: 5px; }
  .city-lab-tabs button > span { padding: 4px 6px; font-size: 9px; }
  .city-lab-tabs button > strong { font-size: 11px; }
  .city-lab-solution { padding: 9px; gap: 7px; }
  .city-lab-voice { grid-template-columns: auto minmax(0,1fr); gap: 8px; padding: 8px 9px; }
  .city-lab-voice span { font-size: 9px; }
  .city-lab-voice p { font-size: 14px; }
  .city-lab-path { grid-template-columns: repeat(3,minmax(0,1fr)); gap: 5px; }
  .city-lab-path > i { display: none; }
  .city-lab-path article { min-height: 78px; padding: 7px; gap: 5px; }
  .city-lab-path article > span { width: 25px; height: 25px; }
  .city-lab-path article > small { font-size: 8px; }
  .city-lab-path article p { font-size: 10px; }
  .city-lab-note { min-height: 58px; padding-right: 9px; grid-template-columns: 44px minmax(0,1fr); }
  .city-lab-note .g1-char { width: 42px; height: 52px; }
  .city-lab-note p { font-size: 10px; }
  .finale-heading { padding: 11px 12px; }
  .finale-heading h1 { font-size: 22px; }
  .finale-mastery { grid-template-columns: 1fr; gap: 6px; }
  .finale-takeaway { min-height: 0; padding: 8px 9px; }
  .finale-proof { grid-template-columns: 1fr; gap: 5px; }
  .finale-proof > strong { white-space: normal; }
  .finale-reward { min-height: 116px; padding: 11px 65px 11px 51px; }
  .finale-reward-copy h2 { font-size: 17px; }
  .finale-medal { left: 8px; width: 34px; height: 34px; }
  .finale-reward-bit { width: 62px; height: 78px; }
}
@media (prefers-reduced-motion: reduce) {
  .lesson-root, .lesson-root *, .lesson-root *::before, .lesson-root *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
  .finale-takeaway, .finale-proof, .finale-bridge { opacity: 1 !important; transform: none !important; }
  .finale-confetti { display: none; }
}
`;
