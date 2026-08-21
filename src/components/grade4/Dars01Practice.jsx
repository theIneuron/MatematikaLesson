// ============================================================================
// 4-SINF · Dars 1 amaliyoti — «Ko'p xonali sonlar sinflari»
//
// ETALON_4SINF §9 va 4sinf_metodologiya §13: aynan 10 tekshiriladigan topshiriq,
// kamida 4 xil mexanika, chegaraviy holat, xatoni tahlil qilish va ko'chirish
// (transfer) alohida topshiriq sifatida. Nazariy darsning sonlari va matnlari
// so'zma-so'z takrorlanmaydi: bu yerda boshqa sonlar.
//
// NEGA BITTA FAYL. LMS darsni bitta avtonom .jsx sifatida qabul qiladi: lokal
// import yo'q, uslublar ichkarida (lms-grade6-standalone/README.md). Shuning uchun
// host ham, topshiriqlar ham, uslublar ham shu faylda. 3-sinfdagi kabi topshiriqni
// alohida fayllarga bo'lish LMS ga yuklashni imkonsiz qiladi.
//
// Ovoz yo'q — amaliyot ovozsiz ishlaydi (3-sinf amaliyoti bilan bir xil qoida).
// Til: platforma `lang` bermasa, yuqorida RU/UZ almashtirgich ko'rinadi.
//
// Mexanikalar: variant tanlash, chegara qo'yish (bo'shliqqa tegish), raqamli
// klaviatura, moslashtirish. Har xato variantning O'Z tahlili bor (§7): tahlil
// bolaning qaysi strategiya bo'yicha yanglishganini nomlaydi va nimani tekshirishni
// ko'rsatadi, javobni bermaydi.
// ============================================================================

import { useMemo, useRef, useState } from 'react';

const T = {
  bg: '#F5F5F0',
  paper: '#FFFFFF',
  ink: '#12212C',
  ink2: '#50616D',
  ink3: '#87949D',
  accent: '#FF5B35',
  accentSoft: '#FFF0EA',
  cyan: '#168FA3',
  cyanSoft: '#E5F5F6',
  navy: '#173B52',
  success: '#227A53',
  successSoft: '#E7F3EC',
  warn: '#A96F13',
  warnSoft: '#FFF5D9',
};

// Sinf rangi: birlar sinfi — siyoh-ko'k, minglar sinfi — akцент.
const CLASS_COLOR = ['#168FA3', '#FF5B35'];

const LESSON_META = {
  lessonId: 'num-4-01-practice',
  lessonTitle: { ru: 'Урок 1. Практика: классы многозначных чисел', uz: "1-dars. Amaliyot: ko'p xonali sonlar sinflari", en: 'Lesson 1. Practice: place-value groups in multi-digit numbers' },
};

const UI = {
  title: LESSON_META.lessonTitle,
  task: { ru: 'Задание', uz: 'Topshiriq', en: 'Task' },
  check: { ru: 'Проверить', uz: 'Tekshirish', en: 'Check' },
  next: { ru: 'Следующее', uz: 'Keyingisi', en: 'Next' },
  finish: { ru: 'Завершить', uz: 'Yakunlash', en: 'Finish' },
  again: { ru: 'Пройти заново', uz: 'Qaytadan', en: 'Try again' },
  result: { ru: 'Результат', uz: 'Natija', en: 'Result' },
  ofTen: { ru: 'из 10', uz: '10 dan', en: 'out of 10' },
  rule: { ru: 'Запомни', uz: 'Eslab qoling', en: 'Remember' },
  hint: { ru: 'Проверь ещё раз', uz: 'Yana bir tekshiring', en: 'Check again' },
  chooseGap: { ru: 'Нажми на промежуток между цифрами', uz: 'Raqamlar orasidagi bo\'shliqqa bosing', en: 'Tap the gap between the digits' },
  typeAnswer: { ru: 'Набери ответ', uz: 'Javobni kiriting', en: 'Enter your answer' },
  matchHint: { ru: 'Соедини число с его классом тысяч', uz: 'Sonni uning minglar sinfi bilan birlashtiring', en: 'Match each number to its thousands group' },
  done: { ru: 'Практика пройдена', uz: 'Amaliyot tugadi', en: 'Practice complete' },
  clear: { ru: 'Стереть', uz: "O'chirish", en: 'Delete' },
};
const SUPPORTED_LANGS = ['uz', 'ru', 'en'];
const normalizeLang = (value) => (SUPPORTED_LANGS.includes(value) ? value : 'uz');
// Variantlar har ochilishda aralashadi: to'g'ri javob bir o'rinda qotib
// qolmasin (metodist qarori 2026-08-21).
const shuffle = (items) => {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};
const tx = (node, lang) => (node && typeof node === 'object' ? node[normalizeLang(lang)] : node);

// ---------------------------------------------------------------------------
// SONNI SINFLARGA AJRATIB YOZISH: 407312 -> «407 312».
// Ekranda son har doim sinflar bo'yicha ajratilgan holda ko'rinadi — mavzu shu.
// ---------------------------------------------------------------------------
const grouped = (value) => {
  const s = String(value);
  const out = [];
  for (let i = s.length; i > 0; i -= 3) out.unshift(s.slice(Math.max(0, i - 3), i));
  return out.join(' ');
};

// ---------------------------------------------------------------------------
// TOPSHIRIQLAR. Sonlar darslikdagi mavzu doirasida (6 xonagacha) va nazariy
// darsdagi sonlardan boshqa. `kind` — mexanika, `wrong` — har variant uchun tahlil.
// ---------------------------------------------------------------------------
const TASKS = [
  // 1. Tanib olish
  {
    id: '01',
    kind: 'mc',
    level: '🟢',
    number: 407312,
    prompt: { ru: 'Сколько классов в этом числе?', uz: 'Bu sonda nechta sinf bor?', en: 'How many three-digit groups are in this number?' },
    setup: {
      ru: 'Городская система показала код склада.',
      uz: 'Shahar tizimi ombor kodini ko\'rsatdi.',
      en: 'The city system displayed a warehouse code.',
    },
    options: [
      { ru: 'Два класса', uz: 'Ikki sinf', en: 'Two groups' },
      { ru: 'Три класса', uz: 'Uch sinf', en: 'Three groups' },
      { ru: 'Шесть классов', uz: 'Olti sinf', en: 'Six groups' },
      { ru: 'Один класс', uz: 'Bir sinf', en: 'One group' },
    ],
    correct: 0,
    wrong: [
      null,
      { ru: 'Классов столько, сколько групп по три разряда. Здесь групп две, а не три.',
        uz: 'Sinf soni uchtalik guruhlar soniga teng. Bu yerda guruh ikkita, uchta emas.',
        en: 'The number of groups equals the number of sets of three places. There are two groups here, not three.' },
      { ru: 'Шесть — это количество разрядов. Класс собирается из трёх разрядов.',
        uz: 'Olti — bu xonalar soni. Sinf uchta xonadan tuziladi.',
        en: 'Six is the number of places. Each group is made up of three places.' },
      { ru: 'В одном классе только три разряда, а здесь их шесть.',
        uz: 'Bitta sinfda faqat uchta xona bor, bu yerda esa oltita.',
        en: 'One group contains only three places, but this number has six.' },
    ],
    correctText: {
      ru: 'Верно. 407 312 делится на класс тысяч и класс единиц.',
      uz: "To'g'ri. 407 312 minglar sinfi va birlar sinfiga bo'linadi.",
      en: 'Correct. 407 312 is divided into a thousands group and a ones group.',
    },
    rule: {
      ru: 'Класс — это три разряда, отсчитанных справа.',
      uz: 'Sinf — bu o\'ngdan sanalgan uchta xona.',
      en: 'A place-value group contains three places counted from the right.',
    },
  },

  // 2. Chegara qo'yish (tegish mexanikasi)
  {
    id: '02',
    kind: 'gap',
    level: '🟢',
    number: 52840,
    correctGap: 3,
    prompt: { ru: 'Поставь границу класса.', uz: 'Sinf chegarasini qo\'ying.', en: 'Mark the boundary between the groups.' },
    setup: {
      ru: 'Диспетчер записал число без пробела.',
      uz: 'Dispetcher sonni bo\'shliqsiz yozdi.',
      en: 'The dispatcher wrote the number without a space.',
    },
    gapWrong: {
      2: { ru: 'Отсчитано две цифры. Граница ставится после трёх разрядов справа.',
        uz: 'Ikki raqam sanalgan. Chegara o\'ngdan uchta xonadan keyin qo\'yiladi.',
        en: 'Only two digits have been counted. The boundary comes after three places counted from the right.' },
      1: { ru: 'Одна цифра справа — это только разряд единиц.',
        uz: "O'ngdagi bitta raqam — bu faqat birlar xonasi.",
        en: 'One digit on the right is only the ones place.' },
      4: { ru: 'Отсчитано четыре цифры. В классе ровно три разряда.',
        uz: "To'rtta raqam sanalgan. Sinfda aynan uchta xona bor.",
        en: 'Four digits have been counted. A group contains exactly three places.' },
    },
    correctText: {
      ru: 'Верно: 52 840. Справа класс единиц, слева класс тысяч.',
      uz: "To'g'ri: 52 840. O'ngda birlar sinfi, chapda minglar sinfi.",
      en: 'Correct: 52 840. The ones group is on the right and the thousands group is on the left.',
    },
    rule: {
      ru: 'Счёт всегда начинается с правой цифры.',
      uz: 'Sanash har doim o\'ngdagi raqamdan boshlanadi.',
      en: 'Always begin counting places from the rightmost digit.',
    },
  },

  // 3. Tasvirlar orasida o'tish: jadval -> yozuv (klaviatura)
  {
    id: '03',
    kind: 'numpad',
    level: '🟡',
    answer: 260543,
    table: [
      { cls: 1, digits: [2, 6, 0] },
      { cls: 0, digits: [5, 4, 3] },
    ],
    prompt: { ru: 'Запиши число, которое стоит в таблице.', uz: 'Jadvalda turgan sonni yozing.', en: 'Write the number shown in the chart.' },
    setup: {
      ru: 'Таблица классов заполнена, осталось записать число цифрами.',
      uz: 'Sinflar jadvali to\'ldirilgan, sonni raqamlar bilan yozish qoldi.',
      en: 'The place-value chart is complete. Now write the number in digits.',
    },
    hints: [
      { ru: 'Начни с класса тысяч: сотни тысяч, десятки тысяч, единицы тысяч.',
        uz: 'Minglar sinfidan boshlang: yuz minglar, o\'n minglar, minglar.',
        en: 'Begin with the thousands group: hundred thousands, ten thousands and thousands.' },
      { ru: 'В классе тысяч стоит 260, в классе единиц 543. Соедини их по порядку.',
        uz: 'Minglar sinfida 260, birlar sinfida 543 turadi. Ularni tartib bilan qo\'shing.',
        en: 'The thousands group is 260 and the ones group is 543. Join them in that order.' },
    ],
    correctText: {
      ru: 'Верно: 260 543. Ноль в разряде единиц тысяч удержал место.',
      uz: "To'g'ri: 260 543. Minglar xonasidagi nol o'rnini saqlab qoldi.",
      en: 'Correct: 260 543. The zero holds the thousands place.',
    },
    rule: {
      ru: 'Каждый разряд занимает своё место, даже если в нём ноль.',
      uz: 'Har bir xona o\'z o\'rnini egallaydi, hatto nol bo\'lsa ham.',
      en: 'Every place keeps its position, even when its digit is zero.',
    },
  },

  // 4. Hisoblash va yig'ish (klaviatura)
  {
    id: '04',
    kind: 'numpad',
    level: '🟡',
    answer: 90408,
    sum: [
      { place: 4, value: 90000 },
      { place: 2, value: 400 },
      { place: 0, value: 8 },
    ],
    prompt: { ru: 'Собери число из разрядных слагаемых.', uz: 'Sonni xona qo\'shiluvchilaridan tuzing.', en: 'Build the number from its place-value parts.' },
    setup: {
      ru: 'Проверь, какие разряды пустые.',
      uz: 'Qaysi xonalar bo\'sh ekanini tekshiring.',
      en: 'Check which places are empty.',
    },
    hints: [
      { ru: 'Каких разрядов нет в сумме? Их место занимает ноль.',
        uz: 'Yig\'indida qaysi xonalar yo\'q? Ularning o\'rnini nol egallaydi.',
        en: 'Which places are missing from the sum? A zero must hold each missing place.' },
      { ru: 'Есть десятки тысяч, сотни и единицы. Единицы тысяч и десятки пустые.',
        uz: 'O\'n minglar, yuzlar va birlar bor. Minglar va o\'nlar bo\'sh.',
        en: 'There are ten thousands, hundreds and ones. The thousands and tens places are empty.' },
    ],
    correctText: {
      ru: 'Верно: 90 408. Пустые разряды заняли нули.',
      uz: "To'g'ri: 90 408. Bo'sh xonalarni nollar egalladi.",
      en: 'Correct: 90 408. Zeros hold the empty places.',
    },
    rule: {
      ru: 'Пропущенный разряд не исчезает, в нём стоит ноль.',
      uz: 'Tushib qolgan xona yo\'qolmaydi, unda nol turadi.',
      en: 'A missing place does not disappear; it contains a zero.',
    },
  },

  // 5. Bo'shliqni to'ldirish (klaviatura)
  {
    id: '05',
    kind: 'numpad',
    level: '🟡',
    answer: 1,
    maxLen: 1,
    number: 718264,
    prompt: { ru: 'Какая цифра стоит в разряде десятков тысяч?', uz: "O'n minglar xonasida qaysi raqam turadi?", en: 'Which digit is in the ten-thousands place?' },
    setup: {
      ru: 'Считай разряды справа налево.',
      uz: "Xonalarni o'ngdan chapga sanang.",
      en: 'Count the places from right to left.',
    },
    hints: [
      { ru: 'Это пятый разряд справа. Единицы, десятки, сотни, единицы тысяч, а дальше?',
        uz: "Bu o'ngdan beshinchi xona. Birlar, o'nlar, yuzlar, minglar, keyin?",
        en: 'It is the fifth place from the right. Ones, tens, hundreds, thousands—and what comes next?' },
      { ru: 'Класс тысяч здесь 718. В нём три разряда: сотни тысяч, десятки тысяч, единицы тысяч.',
        uz: "Bu yerda minglar sinfi 718. Unda uchta xona bor: yuz minglar, o'n minglar, minglar.",
        en: 'The thousands group is 718. Its three places are hundred thousands, ten thousands and thousands.' },
    ],
    correctText: {
      ru: 'Верно. 718 264: справа от этой цифры четыре разряда, значит она в десятках тысяч.',
      uz: "To'g'ri. 718 264: bu raqamdan o'ngda to'rtta xona bor, demak u o'n minglarda.",
      en: 'Correct. In 718 264, four places lie to the right of this digit, so it is in the ten-thousands place.',
    },
    rule: {
      ru: 'Разряд определяется по числу цифр справа от него.',
      uz: "Xona undan o'ngdagi raqamlar soniga qarab aniqlanadi.",
      en: 'A digit\'s place is determined by the number of digits to its right.',
    },
  },

  // 6. Matnli masala
  {
    id: '06',
    kind: 'mc',
    level: '🟡',
    number: 305016,
    prompt: { ru: 'Какое число назвал диспетчер?', uz: 'Dispetcher qaysi sonni aytdi?', en: 'Which number did the dispatcher say?' },
    setup: {
      ru: 'Диспетчер сказал: триста пять тысяч шестнадцать. Оператор должен ввести код.',
      uz: 'Dispetcher aytdi: uch yuz besh ming o\'n olti. Operator kodni kiritishi kerak.',
      en: 'The dispatcher said: three hundred and five thousand sixteen. The operator must enter the code.',
    },
    options: [
      { ru: '305 016', uz: '305 016', en: '305 016' },
      { ru: '35 016', uz: '35 016', en: '35 016' },
      { ru: '305 160', uz: '305 160', en: '305 160' },
      { ru: '350 016', uz: '350 016', en: '350 016' },
    ],
    correct: 0,
    wrong: [
      null,
      { ru: 'Потерялся ноль в разряде десятков тысяч. Проверь, сколько разрядов в классе тысяч.',
        uz: 'O\'n minglar xonasidagi nol tushib qolgan. Minglar sinfida nechta xona borligini tekshiring.',
        en: 'The zero in the ten-thousands place has been lost. Check how many places belong in the thousands group.' },
      { ru: 'Здесь класс единиц читается как сто шестьдесят, а не шестнадцать.',
        uz: 'Bu yerda birlar sinfi bir yuz oltmish deb o\'qiladi, o\'n olti emas.',
        en: 'Here, the ones group is read as one hundred and sixty, not sixteen.' },
      { ru: 'Класс тысяч получился триста пятьдесят. Послушай порядок разрядов ещё раз.',
        uz: 'Minglar sinfi uch yuz ellik bo\'lib qoldi. Xonalar tartibini yana tekshiring.',
        en: 'The thousands group has become three hundred and fifty. Check the order of the places again.' },
    ],
    correctText: {
      ru: 'Верно. Класс тысяч 305, класс единиц 016.',
      uz: "To'g'ri. Minglar sinfi 305, birlar sinfi 016.",
      en: 'Correct. The thousands group is 305 and the ones group is 016.',
    },
    rule: {
      ru: 'В классе всегда три разряда, поэтому ноль в записи обязателен.',
      uz: 'Sinfda har doim uchta xona bor, shuning uchun yozuvda nol majburiy.',
      en: 'A group always has three places, so the zero must be written.',
    },
  },

  // 7. Moslashtirish
  {
    id: '07',
    kind: 'match',
    level: '🟡',
    prompt: { ru: 'Соедини число с его классом тысяч.', uz: 'Sonni uning minglar sinfi bilan birlashtiring.', en: 'Match each number to its thousands group.' },
    setup: {
      ru: 'Класс тысяч — это то, что стоит левее границы.',
      uz: 'Minglar sinfi — chegaradan chapda turgan qism.',
      en: 'The thousands group is the part to the left of the boundary.',
    },
    left: [819437, 91205, 400060],
    right: [
      { ru: '819', uz: '819', en: '819' },
      { ru: '91', uz: '91', en: '91' },
      { ru: '400', uz: '400', en: '400' },
    ],
    answer: [0, 1, 2],
    wrongText: {
      ru: 'Проверь, где стоит граница класса: класс тысяч читается левее неё.',
      uz: 'Sinf chegarasi qayerda turganini tekshiring: minglar sinfi undan chapda o\'qiladi.',
      en: 'Check the group boundary: the thousands group is read to its left.',
    },
    correctText: {
      ru: 'Верно. Класс тысяч читается отдельно, как обычное число.',
      uz: "To'g'ri. Minglar sinfi oddiy son kabi alohida o'qiladi.",
      en: 'Correct. The thousands group is read separately, like an ordinary number.',
    },
    rule: {
      ru: 'Сначала читается класс тысяч, потом слово «тысяч», потом класс единиц.',
      uz: 'Avval minglar sinfi, keyin «ming» so\'zi, keyin birlar sinfi o\'qiladi.',
      en: 'Read the thousands group first, then say thousand, followed by the ones group.',
    },
  },

  // 8. Chegaraviy holat: ichki nollar
  {
    id: '08',
    kind: 'mc',
    level: '🔴',
    number: 100007,
    prompt: { ru: 'Как правильно прочитать это число?', uz: 'Bu son qanday to\'g\'ri o\'qiladi?', en: 'How should this number be read?' },
    setup: {
      ru: 'Внутри числа четыре нуля подряд.',
      uz: 'Son ichida ketma-ket to\'rtta nol bor.',
      en: 'There are four consecutive zeros within the number.',
    },
    options: [
      { ru: 'Сто тысяч семь', uz: 'Bir yuz ming yetti', en: 'One hundred thousand seven' },
      { ru: 'Сто семь', uz: 'Bir yuz yetti', en: 'One hundred and seven' },
      { ru: 'Сто тысяч семьдесят', uz: 'Bir yuz ming yetmish', en: 'One hundred thousand seventy' },
      { ru: 'Один миллион семь', uz: 'Bir million yetti', en: 'One million seven' },
    ],
    correct: 0,
    wrong: [
      null,
      { ru: 'Нули между классами нельзя пропускать: они держат разряды.',
        uz: 'Sinflar orasidagi nollarni tashlab ketish mumkin emas: ular xonalarni saqlaydi.',
        en: 'The zeros between the groups must not be omitted: they hold the places.' },
      { ru: 'Семь стоит в разряде единиц, а не десятков. Посмотри на последнюю цифру.',
        uz: 'Yetti birlar xonasida turadi, o\'nlar xonasida emas. Oxirgi raqamga qarang.',
        en: 'Seven is in the ones place, not the tens place. Look at the final digit.' },
      { ru: 'Здесь шесть разрядов, а в миллионе их семь.',
        uz: 'Bu yerda oltita xona bor, millionda esa yettita.',
        en: 'This number has six places, while a million has seven.' },
    ],
    correctText: {
      ru: 'Верно: 100 007. Класс тысяч 100, класс единиц 007.',
      uz: "To'g'ri: 100 007. Minglar sinfi 100, birlar sinfi 007.",
      en: 'Correct: 100 007. The thousands group is 100 and the ones group is 007.',
    },
    rule: {
      ru: 'Ноль внутри числа не читается вслух, но занимает разряд.',
      uz: 'Son ichidagi nol ovoz chiqarib o\'qilmaydi, lekin xonani egallaydi.',
      en: 'A zero within a number is not read aloud, but it holds a place.',
    },
  },

  // 9. Xatoni tahlil qilish
  {
    id: '09',
    kind: 'mc',
    level: '🔴',
    wrongRecord: '6 3095',
    prompt: { ru: 'В чём ошибка записи?', uz: 'Yozuvdagi xato nimada?', en: 'What is wrong with the way the number is written?' },
    setup: {
      ru: 'Оператор разделил число 63 095 так: 6 3095.',
      uz: 'Operator 63 095 sonini shunday ajratdi: 6 3095.',
      en: 'The operator split 63 095 like this: 6 3095.',
    },
    options: [
      { ru: 'Границу поставили слева, а считать нужно справа', uz: 'Chegara chapdan qo\'yilgan, sanash esa o\'ngdan boshlanadi', en: 'The boundary was placed from the left, but the count must begin on the right' },
      { ru: 'В числе лишняя цифра', uz: 'Sonda ortiqcha raqam bor', en: 'The number contains an extra digit' },
      { ru: 'Ноль написан не на своём месте', uz: 'Nol o\'z o\'rnida yozilmagan', en: 'The zero is in the wrong place' },
      { ru: 'Ошибки нет', uz: 'Xato yo\'q', en: 'There is no mistake' },
    ],
    correct: 0,
    wrong: [
      null,
      { ru: 'Цифры все на месте: их пять и в верной записи тоже пять.',
        uz: 'Raqamlar joyida: ularning soni beshta, to\'g\'ri yozuvda ham beshta.',
        en: 'All the digits are present: there are five here and five in the correct form.' },
      { ru: 'Ноль стоит там же, где и был. Смотри на место границы.',
        uz: 'Nol avvalgi o\'rnida turadi. Chegara o\'rniga qarang.',
        en: 'The zero is still in its original place. Look at the position of the boundary.' },
      { ru: 'Ошибка есть: справа осталось четыре цифры вместо трёх.',
        uz: 'Xato bor: o\'ngda uchta emas, to\'rtta raqam qoldi.',
        en: 'There is a mistake: four digits remain on the right instead of three.' },
    ],
    correctText: {
      ru: 'Верно. Правильно так: 63 095. Справа отсчитываются три разряда.',
      uz: "To'g'ri. To'g'ri yozuv: 63 095. O'ngdan uchta xona sanaladi.",
      en: 'Correct. It should be written as 63 095. Count three places from the right.',
    },
    rule: {
      ru: 'Границу класса всегда ставят, отсчитав три разряда справа.',
      uz: 'Sinf chegarasi har doim o\'ngdan uchta xona sanab qo\'yiladi.',
      en: 'Always place the group boundary after counting three places from the right.',
    },
  },

  // 10. Ko'chirish: yangi shakl
  {
    id: '10',
    kind: 'mc',
    level: '🔴',
    pair: [246800, 246080],
    prompt: { ru: 'В каком числе цифра 8 стоит в разряде сотен?', uz: 'Qaysi sonda 8 raqami yuzlar xonasida turadi?', en: 'In which number is the digit 8 in the hundreds place?' },
    setup: {
      ru: 'Цифры одинаковые, но их места разные.',
      uz: 'Raqamlar bir xil, lekin o\'rinlari boshqacha.',
      en: 'The digits are the same, but their places are different.',
    },
    options: [
      { ru: 'В первом: 246 800', uz: 'Birinchisida: 246 800', en: 'In the first: 246 800' },
      { ru: 'Во втором: 246 080', uz: 'Ikkinchisida: 246 080', en: 'In the second: 246 080' },
      { ru: 'В обоих', uz: 'Ikkalasida ham', en: 'In both' },
      { ru: 'Ни в одном', uz: 'Hech birida', en: 'In neither' },
    ],
    correct: 0,
    wrong: [
      null,
      { ru: 'Во втором числе 8 стоит в десятках: справа от неё только один ноль.',
        uz: 'Ikkinchi sonda 8 o\'nlar xonasida: undan o\'ngda faqat bitta nol bor.',
        en: 'In the second number, 8 is in the tens place: there is only one zero to its right.' },
      { ru: 'Одна и та же цифра не может стоять в одном разряде в разных числах. Сравни, сколько цифр справа от 8.',
        uz: 'Bir xil raqam turli sonlarda bir xil xonada turolmaydi. 8 dan o\'ngda nechta raqam borligini solishtiring.',
        en: 'The same digit does not occupy the same place in these two numbers. Compare how many digits are to the right of 8.' },
      { ru: 'В одном из чисел 8 всё же стоит в сотнях. Посчитай разряды справа.',
        uz: 'Sonlardan birida 8 aynan yuzlar xonasida turadi. O\'ngdan xonalarni sanang.',
        en: 'In one of the numbers, 8 is in the hundreds place. Count the places from the right.' },
    ],
    correctText: {
      ru: 'Верно: 246 800. Справа от 8 два разряда, значит это сотни.',
      uz: "To'g'ri: 246 800. 8 dan o'ngda ikkita xona bor, demak bu yuzlar.",
      en: 'Correct: 246 800. There are two places to the right of 8, so it represents hundreds.',
    },
    rule: {
      ru: 'Разряд цифры определяется тем, сколько цифр стоит справа от неё.',
      uz: 'Raqamning xonasi undan o\'ngda nechta raqam turganiga qarab aniqlanadi.',
      en: 'A digit\'s place is determined by how many digits are to its right.',
    },
  },
];

// ---------------------------------------------------------------------------
// KO'RSATMA ELEMENTLARI
// ---------------------------------------------------------------------------
const NumberStrip = ({ value, gaps = [], onGap, disabled, state }) => {
  const digits = String(value).split('');
  const n = digits.length;
  const items = [];
  digits.forEach((d, i) => {
    items.push(<span key={`d${i}`} className="p4-digit">{d}</span>);
    const fromRight = n - 1 - i;
    if (fromRight > 0) {
      const placed = gaps.includes(fromRight);
      const cls = ['p4-gap', placed ? 'is-placed' : '', placed && state ? `is-${state}` : ''].filter(Boolean).join(' ');
      items.push(
        onGap
          ? (
            <button
              type="button"
              key={`g${fromRight}`}
              className={cls}
              disabled={disabled}
              aria-label={String(fromRight)}
              onClick={() => onGap(fromRight)}
            >
              <i/>
            </button>
          )
          : <span key={`g${fromRight}`} className={cls}><i/></span>,
      );
    }
  });
  return <div className="p4-strip">{items}</div>;
};

const ClassTable = ({ table, lang }) => {
  const heads = [
    { ru: ['сотни тысяч', 'десятки тысяч', 'единицы тысяч'], uz: ['yuz minglar', "o'n minglar", 'minglar'], en: ['hundred thousands', 'ten thousands', 'thousands'] },
    { ru: ['сотни', 'десятки', 'единицы'], uz: ['yuzlar', "o'nlar", 'birlar'], en: ['hundreds', 'tens', 'ones'] },
  ];
  const clsName = [
    { ru: 'класс единиц', uz: 'birlar sinfi', en: 'ones group' },
    { ru: 'класс тысяч', uz: 'minglar sinfi', en: 'thousands group' },
  ];
  return (
    <div className="p4-table">
      {table.map((group) => (
        <div className="p4-tclass" key={group.cls} style={{ '--p4-cls': CLASS_COLOR[group.cls] }}>
          <div className="p4-thead">{tx(clsName[group.cls], lang)}</div>
          <div className="p4-tcells">
            {group.digits.map((d, i) => (
              <div className="p4-tcell" key={i}>
                <span className="p4-tplace">{heads[group.cls === 1 ? 0 : 1][lang][i]}</span>
                <span className="p4-tdigit">{d}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const PlaceSum = ({ sum }) => (
  <div className="p4-sum">
    {sum.map((term, i) => (
      <span key={term.place} className="p4-sum-item">
        {i > 0 && <span className="p4-sum-op">+</span>}
        <span className="p4-sum-term" style={{ '--p4-cls': CLASS_COLOR[term.place >= 3 ? 1 : 0] }}>
          {grouped(term.value)}
        </span>
      </span>
    ))}
  </div>
);

const NumPad = ({ value, setValue, max, disabled, lang }) => (
  <div className="p4-pad" role="group" aria-label={tx(UI.typeAnswer, lang)}>
    <div className="p4-pad-display">{value ? grouped(value) : '—'}</div>
    <div className="p4-pad-keys">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d) => (
        <button
          key={d}
          type="button"
          className="p4-key"
          disabled={disabled}
          onClick={() => setValue((v) => (v.length >= max ? v : v + String(d)))}
        >
          {d}
        </button>
      ))}
      <button
        type="button"
        className="p4-key p4-key-del"
        disabled={disabled}
        aria-label={tx(UI.clear, lang)}
        onClick={() => setValue((v) => v.slice(0, -1))}
      >
        ⌫
      </button>
    </div>
  </div>
);

const Feedback = ({ ok, text, rule, lang }) => (
  <div className={`p4-fb ${ok ? 'is-ok' : 'is-no'}`}>
    <p className="p4-fb-txt">{text}</p>
    {ok && rule && (
      <p className="p4-rule"><b>{tx(UI.rule, lang)}.</b> {tx(rule, lang)}</p>
    )}
  </div>
);

// ---------------------------------------------------------------------------
// BITTA TOPSHIRIQ
// ---------------------------------------------------------------------------
function Task({ task, lang, onSolved }) {
  const [picked, setPicked] = useState(null);
  const [typed, setTyped] = useState('');
  const [gap, setGap] = useState(null);
  const [pairs, setPairs] = useState({});
  const [activeLeft, setActiveLeft] = useState(null);
  const [checked, setChecked] = useState(false);
  const [attempts, setAttempts] = useState(0);
  // Xato javobdan keyin variantlar qayta aralashadi.
  const [wrongRound, setWrongRound] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- wrongRound ataylab yangi tartib beradi
  const mcOptions = useMemo(() => (task.kind === 'mc' ? shuffle(task.options.map((text, index) => ({ text, index }))) : []), [task, wrongRound]);

  // Javobning to'g'riligi `checked` dan ALOHIDA: xato bo'lsa variantlar
  // qayta aralashtiriladi.
  const answerCorrect = (() => {
    if (task.kind === 'mc') return picked?.index === task.correct;
    if (task.kind === 'gap') return gap === task.correctGap;
    if (task.kind === 'numpad') return Number(typed) === task.answer;
    if (task.kind === 'match') return task.answer.every((r, i) => pairs[i] === r);
    return false;
  })();
  const solvedNow = checked && answerCorrect;

  const canCheck = (() => {
    if (task.kind === 'mc') return picked !== null;
    if (task.kind === 'gap') return gap !== null;
    if (task.kind === 'numpad') return typed !== '';
    if (task.kind === 'match') return Object.keys(pairs).length === task.left.length;
    return false;
  })();

  const wrongText = (() => {
    if (task.kind === 'mc') return task.wrong[picked?.index];
    if (task.kind === 'gap') return task.gapWrong?.[gap] || task.correctText;
    if (task.kind === 'numpad') return task.hints[Math.min(attempts, task.hints.length) - 1] || task.hints[0];
    if (task.kind === 'match') return task.wrongText;
    return null;
  })();

  const check = () => {
    if (!canCheck || solvedNow) return;
    setChecked(true);
    setAttempts((n) => n + 1);
    if (!answerCorrect) setWrongRound((old) => old + 1);
  };

  const retry = () => {
    setChecked(false);
    if (task.kind === 'mc') setPicked(null);
    if (task.kind === 'gap') setGap(null);
    if (task.kind === 'numpad') setTyped('');
    if (task.kind === 'match') { setPairs({}); setActiveLeft(null); }
  };

  return (
    <div className="p4-task">
      <p className="p4-eyebrow">{task.level} {tx(UI.task, lang)} {task.id}</p>
      {task.setup && <p className="p4-setup">{tx(task.setup, lang)}</p>}

      {task.kind === 'mc' && task.number !== undefined && (
        <div className="p4-figure"><span className="p4-bignum">{grouped(task.number)}</span></div>
      )}
      {task.kind === 'mc' && task.wrongRecord && (
        <div className="p4-figure"><span className="p4-bignum p4-bignum-warn">{task.wrongRecord}</span></div>
      )}
      {task.kind === 'mc' && task.pair && (
        <div className="p4-figure p4-figure-pair">
          {task.pair.map((v) => <span className="p4-bignum" key={v}>{grouped(v)}</span>)}
        </div>
      )}
      {task.kind === 'gap' && (
        <div className="p4-figure">
          <NumberStrip
            value={task.number}
            gaps={gap === null ? [] : [gap]}
            onGap={(g) => { if (!solvedNow) { setGap(g); setChecked(false); } }}
            disabled={solvedNow}
            state={checked ? (gap === task.correctGap ? 'ok' : 'no') : null}
          />
          <p className="p4-note">{tx(UI.chooseGap, lang)}</p>
        </div>
      )}
      {task.kind === 'numpad' && task.table && (
        <div className="p4-figure"><ClassTable table={task.table} lang={lang}/></div>
      )}
      {task.kind === 'numpad' && task.sum && (
        <div className="p4-figure"><PlaceSum sum={task.sum}/></div>
      )}
      {task.kind === 'numpad' && task.number !== undefined && (
        <div className="p4-figure"><span className="p4-bignum">{grouped(task.number)}</span></div>
      )}

      <h2 className="p4-ask">{tx(task.prompt, lang)}</h2>

      {task.kind === 'mc' && (
        <div className="p4-options">
          {mcOptions.map((item, i) => {
            const state = checked && picked === item ? (item.index === task.correct ? 'ok' : 'no') : (picked === item ? 'on' : '');
            return (
              <button
                key={i}
                type="button"
                className={`p4-option ${state ? `is-${state}` : ''}`}
                disabled={solvedNow}
                onClick={() => { setPicked(item); setChecked(false); }}
              >
                <span className="p4-letter">{'ABCD'[i]}</span>
                <span>{tx(item.text, lang)}</span>
              </button>
            );
          })}
        </div>
      )}

      {task.kind === 'numpad' && (
        <NumPad
          value={typed}
          setValue={(fn) => { setTyped(fn); setChecked(false); }}
          max={task.maxLen || 6}
          disabled={solvedNow}
          lang={lang}
        />
      )}

      {task.kind === 'match' && (
        <div className="p4-match">
          <p className="p4-note">{tx(UI.matchHint, lang)}</p>
          <div className="p4-match-cols">
            <div className="p4-match-col">
              {task.left.map((v, i) => (
                <button
                  key={v}
                  type="button"
                  className={`p4-match-item ${activeLeft === i ? 'is-active' : ''} ${pairs[i] !== undefined ? 'is-tied' : ''}`}
                  disabled={solvedNow}
                  onClick={() => { setActiveLeft(i); setChecked(false); }}
                >
                  {grouped(v)}
                  {pairs[i] !== undefined && <b className="p4-tie">{tx(task.right[pairs[i]], lang)}</b>}
                </button>
              ))}
            </div>
            <div className="p4-match-col">
              {task.right.map((r, j) => (
                <button
                  key={j}
                  type="button"
                  className="p4-match-item p4-match-right"
                  disabled={solvedNow || activeLeft === null}
                  onClick={() => {
                    if (activeLeft === null) return;
                    setPairs((prev) => ({ ...prev, [activeLeft]: j }));
                    setActiveLeft(null);
                    setChecked(false);
                  }}
                >
                  {tx(r, lang)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {checked && (
        <Feedback
          ok={solvedNow}
          text={solvedNow ? tx(task.correctText, lang) : tx(wrongText, lang)}
          rule={task.rule}
          lang={lang}
        />
      )}

      <div className="p4-actions">
        {!solvedNow && (
          <button type="button" className="p4-btn" disabled={!canCheck} onClick={check}>
            {tx(UI.check, lang)}
          </button>
        )}
        {checked && !solvedNow && (
          <button type="button" className="p4-btn p4-btn-ghost" onClick={retry}>
            {tx(UI.hint, lang)}
          </button>
        )}
        {solvedNow && (
          <button type="button" className="p4-btn p4-btn-ready" onClick={() => onSolved(attempts === 1)}>
            {tx(UI.next, lang)}
          </button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// HOST: 10 topshiriq ketma-ket, natija oxirida.
// ---------------------------------------------------------------------------
export default function Grade4Dars01Practice({ lang: langProp, onFinished }) {
  const preview = langProp === undefined || langProp === null;
  const [previewLang, setPreviewLang] = useState(() => normalizeLang(langProp));
  const lang = normalizeLang(preview ? previewLang : langProp);

  const [index, setIndex] = useState(0);
  const [firstTry, setFirstTry] = useState(0);
  const [finished, setFinished] = useState(false);
  const advancedRef = useRef(-1);
  const finishedRef = useRef(false);
  const task = TASKS[index];
  const total = TASKS.length;
  const percent = useMemo(() => Math.round(((finished ? total : index) / total) * 100), [index, total, finished]);

  const onSolved = (wasFirstTry) => {
    if (finishedRef.current || advancedRef.current === index) return;
    advancedRef.current = index;
    if (wasFirstTry) setFirstTry((n) => n + 1);
    if (index + 1 >= total) {
      finishedRef.current = true;
      setFinished(true);
      if (onFinished) {
        onFinished({
          lessonId: LESSON_META.lessonId,
          lessonTitle: LESSON_META.lessonTitle[lang],
          totalQuestions: total,
          correctAnswers: wasFirstTry ? firstTry + 1 : firstTry,
          scorePercent: Math.round(((wasFirstTry ? firstTry + 1 : firstTry) / total) * 100),
        });
      }
      return;
    }
    setIndex((i) => i + 1);
  };

  const restart = () => { setIndex(0); setFirstTry(0); setFinished(false); };

  return (
    <div className="p4-root">
      <style>{STYLES}</style>
      {preview && (
        <div className="p4-lang">
          {SUPPORTED_LANGS.map((l) => (
            <button
              key={l}
              type="button"
              className={l === lang ? 'is-active' : ''}
              onClick={() => setPreviewLang(l)}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      <header className="p4-head">
        <div className="p4-progress"><div className="p4-progress-bar" style={{ width: `${percent}%` }}/></div>
        <div className="p4-head-row">
          <span className="p4-title">{tx(UI.title, lang)}</span>
          <span className="p4-counter">{finished ? total : index + 1} / {total}</span>
        </div>
      </header>

      <main className="p4-main">
        {finished ? (
          <div className="p4-done">
            <h2>{tx(UI.done, lang)}</h2>
            <p className="p4-score">
              <b>{firstTry}</b> <span>{tx(UI.ofTen, lang)}</span>
            </p>
            <p className="p4-note">
              {lang === 'en'
                ? 'Number of tasks completed correctly on the first attempt.'
                : lang === 'ru'
                  ? 'Столько заданий решено с первой попытки.'
                  : 'Birinchi urinishda to\'g\'ri bajarilgan topshiriqlar soni.'}
            </p>
            <button type="button" className="p4-btn p4-btn-ready" onClick={restart}>{tx(UI.again, lang)}</button>
          </div>
        ) : (
          <Task key={task.id} task={task} lang={lang} onSolved={onSolved}/>
        )}
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// USLUBLAR — fayl ichida: LMS ga alohida .css bormaydi.
// Mobil: 390 px maketi, teginish maydoni 44 px dan kichik emas.
// ---------------------------------------------------------------------------
const STYLES = `
.p4-root { position: relative; min-height: 100%; padding: 0 0 24px; font-family: 'Manrope', system-ui, sans-serif; color: ${T.ink}; background: ${T.bg}; }
.p4-root *, .p4-root *::before, .p4-root *::after { box-sizing: border-box; }
.p4-lang { position: absolute; top: 8px; right: 8px; display: flex; gap: 6px; z-index: 5; }
.p4-lang button { min-width: 34px; min-height: 30px; border: none; border-radius: 99px; background: ${T.paper}; color: ${T.ink2}; font-weight: 800; font-size: 11px; cursor: pointer; box-shadow: 0 4px 12px -8px rgba(23,59,82,.4); }
.p4-lang button.is-active { background: ${T.accent}; color: #fff; }

/* Отступ сверху — под чужие элементы страницы: слева ссылка «Darslar ro'yxati»
   от LessonPage, справа переключатель языка. Без него заголовок практики
   перекрывался ссылкой возврата (видно на снимке проверки). */
.p4-head { padding: 46px clamp(12px, 4vw, 24px) 8px; }
.p4-progress { height: 6px; border-radius: 99px; background: rgba(23,59,82,.12); overflow: hidden; }
.p4-progress-bar { height: 100%; background: linear-gradient(90deg, ${T.cyan}, ${T.accent}); transition: width .4s ease; }
.p4-head-row { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; margin-top: 8px; }
.p4-title { font-family: 'Source Serif 4', Georgia, serif; font-weight: 600; font-size: clamp(15px, 2.4vw, 19px); }
.p4-counter { flex: 0 0 auto; white-space: nowrap; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 13px; color: ${T.ink3}; }

.p4-main { max-width: 720px; margin: 0 auto; padding: 4px clamp(12px, 4vw, 24px); }
.p4-task { display: flex; flex-direction: column; gap: 12px; }
.p4-eyebrow { margin: 6px 0 0; font-size: 11px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; color: ${T.accent}; }
.p4-setup { margin: 0; font-size: clamp(14px, 2vw, 16px); line-height: 1.5; color: ${T.ink2}; }
.p4-ask { margin: 2px 0 0; font-family: 'Source Serif 4', Georgia, serif; font-weight: 600; font-size: clamp(17px, 2.6vw, 21px); line-height: 1.25; }
.p4-note { margin: 8px 0 0; font-size: 13px; color: ${T.ink3}; }

.p4-figure { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 14px 10px; border-radius: 16px; background: ${T.paper}; box-shadow: inset 0 0 0 1px rgba(23,59,82,.08); }
.p4-figure-pair { flex-direction: row; flex-wrap: wrap; justify-content: center; gap: 18px; }
.p4-bignum { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(26px, 6vw, 40px); color: ${T.navy}; letter-spacing: .02em; }
.p4-bignum-warn { color: ${T.warn}; }

.p4-strip { display: flex; align-items: center; justify-content: center; }
.p4-digit { min-width: clamp(24px, 6vw, 34px); text-align: center; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(26px, 6vw, 38px); color: ${T.navy}; }
.p4-gap { display: inline-flex; align-items: center; justify-content: center; width: clamp(18px, 4vw, 24px); min-height: 46px; padding: 0; border: none; background: transparent; cursor: pointer; }
.p4-gap i { display: block; width: 3px; height: clamp(22px, 5vw, 32px); border-radius: 2px; background: rgba(23,59,82,.14); transition: background .2s, height .2s; }
.p4-gap:hover:not(:disabled) i { background: rgba(22,143,163,.5); }
.p4-gap.is-placed i { background: ${T.accent}; height: clamp(28px, 6vw, 40px); }
.p4-gap.is-ok i { background: ${T.success}; }
.p4-gap.is-no i { background: ${T.warn}; }

.p4-table { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }
.p4-tclass { padding: 8px; border-radius: 14px; background: #FBFBF8; box-shadow: inset 0 0 0 1px rgba(23,59,82,.08); }
.p4-thead { text-align: center; font-size: 10px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: var(--p4-cls); }
.p4-tcells { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; margin-top: 6px; }
.p4-tcell { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.p4-tplace { font-size: 9px; font-weight: 700; color: ${T.ink3}; text-align: center; min-height: 2.2em; }
.p4-tdigit { display: flex; align-items: center; justify-content: center; width: clamp(34px, 8vw, 46px); min-height: 44px; border-radius: 11px; background: ${T.paper}; box-shadow: inset 0 0 0 1.5px rgba(23,59,82,.14); font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(19px, 4vw, 25px); color: ${T.navy}; }

.p4-sum { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 6px; }
.p4-sum-item { display: inline-flex; align-items: center; gap: 6px; }
.p4-sum-op { font-weight: 800; color: ${T.ink3}; font-size: clamp(16px, 3vw, 22px); }
.p4-sum-term { padding: 5px 11px; border-radius: 10px; background: ${T.paper}; box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--p4-cls) 35%, transparent); font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(16px, 3.4vw, 22px); color: ${T.navy}; }

.p4-options { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 9px; }
.p4-option { display: flex; align-items: center; gap: 9px; min-height: 56px; padding: 10px 12px; text-align: left; font-family: inherit; font-weight: 700; font-size: clamp(13px, 1.9vw, 15px); color: ${T.ink}; background: ${T.paper}; border: 1px solid rgba(23,59,82,.12); border-radius: 14px; cursor: pointer; transition: transform .16s, border-color .2s, background .2s; }
.p4-option:hover:not(:disabled) { border-color: rgba(22,143,163,.4); transform: translateY(-2px); }
.p4-option:disabled { cursor: default; }
.p4-letter { flex: 0 0 auto; display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 8px; background: ${T.cyanSoft}; color: ${T.cyan}; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 800; }
.p4-option.is-on { border-color: ${T.accent}; background: ${T.accentSoft}; }
.p4-option.is-ok { border-color: rgba(34,122,83,.4); background: ${T.successSoft}; color: ${T.success}; }
.p4-option.is-ok .p4-letter { background: ${T.success}; color: #fff; }
.p4-option.is-no { border-color: rgba(169,111,19,.4); background: ${T.warnSoft}; color: ${T.warn}; }
.p4-option.is-no .p4-letter { background: ${T.warn}; color: #fff; }

.p4-pad { display: flex; flex-direction: column; align-items: center; gap: 8px; width: min(240px, 100%); margin: 0 auto; padding: 12px; border-radius: 18px; background: linear-gradient(155deg,#EDF1F3,#DDE4E8); box-shadow: inset 0 1px rgba(255,255,255,.9); }
.p4-pad-display { display: flex; align-items: center; justify-content: center; width: 100%; min-height: 50px; border: 2px solid ${T.accent}; border-radius: 13px; background: ${T.paper}; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(20px, 4.4vw, 26px); letter-spacing: 2px; color: ${T.navy}; }
.p4-pad-keys { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; width: 100%; }
.p4-key { min-height: 44px; border: 1px solid rgba(23,59,82,.16); border-radius: 12px; background: ${T.paper}; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(18px, 3.6vw, 22px); color: ${T.navy}; cursor: pointer; }
.p4-key:hover:not(:disabled) { border-color: ${T.cyan}; }
.p4-key:disabled { opacity: .4; cursor: not-allowed; }
.p4-key-del { background: ${T.accentSoft}; color: ${T.accent}; }

.p4-match-cols { display: flex; gap: 10px; margin-top: 8px; }
.p4-match-col { display: flex; flex-direction: column; gap: 8px; flex: 1; }
.p4-match-item { display: flex; align-items: center; justify-content: center; gap: 8px; min-height: 48px; padding: 8px 10px; border: 1px solid rgba(23,59,82,.12); border-radius: 12px; background: ${T.paper}; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(14px, 2.6vw, 18px); color: ${T.navy}; cursor: pointer; }
.p4-match-item.is-active { border-color: ${T.accent}; background: ${T.accentSoft}; }
.p4-match-item.is-tied { border-color: rgba(34,122,83,.35); }
.p4-match-item:disabled { opacity: .55; cursor: default; }
.p4-tie { font-size: 12px; color: ${T.success}; }

.p4-fb { padding: 12px 14px; border-radius: 14px; }
.p4-fb.is-ok { background: ${T.successSoft}; box-shadow: inset 4px 0 0 ${T.success}; }
.p4-fb.is-no { background: ${T.warnSoft}; box-shadow: inset 4px 0 0 ${T.warn}; }
.p4-fb-txt { margin: 0; font-family: 'Source Serif 4', Georgia, serif; font-size: clamp(14px, 2.1vw, 16px); line-height: 1.45; }
.p4-fb.is-ok .p4-fb-txt { color: #1B6644; }
.p4-fb.is-no .p4-fb-txt { color: #8A5C10; }
.p4-rule { margin: 8px 0 0; font-size: 13px; color: ${T.ink2}; }

.p4-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 4px; }
.p4-btn { min-height: 46px; padding: 10px 22px; border: none; border-radius: 12px; background: ${T.paper}; color: ${T.accent}; font-family: inherit; font-weight: 800; font-size: 14px; cursor: pointer; box-shadow: 0 8px 20px -10px rgba(255,91,53,.5), inset 0 0 0 1px rgba(255,91,53,.2); }
.p4-btn:disabled { opacity: .45; cursor: not-allowed; box-shadow: none; }
.p4-btn-ready { background: ${T.accent}; color: #fff; }
.p4-btn-ghost { background: transparent; color: ${T.ink2}; box-shadow: none; }
.p4-root button:focus-visible { outline: 3px solid rgba(22,143,163,.45); outline-offset: 3px; }

.p4-done { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 20px 12px; text-align: center; }
.p4-done h2 { margin: 0; font-family: 'Source Serif 4', Georgia, serif; font-size: clamp(19px, 3vw, 24px); }
.p4-score { margin: 0; font-family: 'JetBrains Mono', monospace; }
.p4-score b { font-size: clamp(32px, 7vw, 44px); color: ${T.success}; }
.p4-score span { font-size: 14px; color: ${T.ink3}; }

@media (max-width: 520px) {
  .p4-options { grid-template-columns: 1fr; }
  .p4-match-cols { gap: 8px; }
}
@media (prefers-reduced-motion: reduce) {
  .p4-root *, .p4-root *::before { transition: none !important; animation: none !important; }
}

/* PRACTICE-FIX boshlanishi — metodist qarori 2026-08-21.
   1) Tekshirish tugmasi o'ngda (2-dars etaloni).
   2) Moslashtirishda ikki tomondagi kartochkalar bir xil o'lchamda: ustun grid
      bo'ladi va qatorlari 1fr, shuning uchun juftlar qator bo'yicha tekislanadi.
   Bu blok har darsda takrorlanadi ATAYLAB: LMS avtonom fayl talab qiladi. */
.p4-actions, .g4p-actions { justify-content: flex-end; }
.p4-match-cols, .g4p-match-cols { align-items: stretch; }
.p4-match-col, .g4p-match-col { display: grid; grid-auto-rows: 1fr; align-content: stretch; }
/* PRACTICE-FIX tugashi */
`;
