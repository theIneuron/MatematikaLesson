import React, { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { WRONG_FLASH_CSS, useWrongFlash } from './wrongAnswerFlash.js';
import { EMPTY_FEEDBACK_CSS } from './grade4LayoutFixStyles.js';

// 4-SINF · 23-DARS · Kasrli masalalar: qism va butun (frac-4-23-v2)
// ---------------------------------------------------------------------------
// SYUJET: Taqsimot markazining OMBOR DAFTARI. Daftarda har qatorda butun zaxira
//   va uning bir qismi yozilgan, lekin suv tegib butun ustuni o'chib ketgan.
//   Qatorda faqat qism qolgan: beshdan uch qismi o'n besh quti. Butunni tiklash
//   kerak. 22-darsda butun ma'lum edi va qism topildi; bu darsda teskarisi.
// YADRO: beshdan uch qismi o'n besh bo'lsa, butun nechta. Bit qismni to'g'ridan
//   to'g'ri maxrajga ko'paytiradi va sakson sakkiz betlik kitobni uch yuz o'n
//   ikki bet deb yozadi. Demak avval bitta ulush topiladi (suratga bo'linadi),
//   keyin maxrajga ko'paytiriladi.
// DARSLIK ASOSI (4-sinf darsligi, 142-143-betlar "Sonni uning kasri bo'yicha
//   topish"): 142-bet 2-topshiriq (beshdan uch qismi o'n besh bo'lgan son),
//   142-bet 1-topshiriq (beshdan bir ulushi to'qqiz santimetr bo'lgan kesma),
//   142-bet 5-topshiriq (Avaz kitobning to'rtdan uch qismini, ya'ni yetmish
//   sakkiz betini o'qidi), 143-bet 1-topshiriq (Dilshod pulining sakkizdan
//   yetti qismini sarfladi, besh yuz so'm qoldi), 143-bet 3, 5 va
//   7-topshiriqlar (gulzor, chinnigullar, yo'l masofasi).
// RITM: s2 tushuntirish, s3 misol, s4 tushuntirish, s5 misol, s6 tushuntirish,
//   s7 qoida, keyin xato ustida ishlash, ikki yo'nalishni ajratish, qoldiq
//   holati va mustaqil qo'llash.
// FRAME: s0 - to'q ko'k kanonik sahna, qolgan hamma ekran och ko'k ramkada.
// BIT: faqat s0, s8 (o'z xatosi) va s15 da hamda javob izohida.
// Misconception: M1 qismni to'g'ridan to'g'ri maxrajga ko'paytirish;
//   M2 ma'lum qismni bitta ulush deb hisoblash; M3 22-darsning yo'lini
//   (maxrajga bo'lib suratga ko'paytirish) teskari masalaga ham qo'llash;
//   M4 qoldiqni sarflangan qism bilan aralashtirish.
// ---------------------------------------------------------------------------

const T = {
  bg: '#F5F5F0', ink: '#12212C', ink2: '#50616D', ink3: '#87949D', paper: '#FFFFFF',
  accent: '#FF5B35', accentSoft: '#FFF0EA', cyan: '#168FA3', cyanSoft: '#E5F5F6',
  navy: '#173B52', lime: '#95C93D', success: '#227A53', successSoft: '#E7F3EC',
  warn: '#A96F13', warnSoft: '#FFF5D9', shadowBase: '58, 53, 48',
};

// Uch tilli qiymat. Uch argument ham majburiy: bo'sh qolsa bola boshqa tildagi
// matnni ko'radi.
const bi = (uz, ru, en) => ({ uz, ru, en });

const stableChoiceOffset = (lessonId, length) => {
  let hash = 2166136261;
  for (const char of `${lessonId}:${length}`) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return length > 0 ? (hash >>> 0) % length : 0;
};

// To'g'ri javob har ekranda boshqa pozitsiyada turadi, lekin tartib barqaror:
// orqaga qaytganda variantlar joyidan sakramaydi.
const buildOptionOrder = (length, correctIndex, lessonId, ordinal = 0) => {
  const natural = Array.from({ length: Math.max(0, length) }, (_, index) => index);
  if (length < 2 || !Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= length) return natural;
  const target = (stableChoiceOffset(lessonId, length) + ordinal * (length - 1)) % length;
  const order = natural.filter((index) => index !== correctIndex);
  order.splice(target, 0, correctIndex);
  return order;
};

// Har ekranning kirish ovozidagi segment soni. Baholanadigan ekranlarda
// kirish segmentlari va on_correct birga hisoblanadi.
const FRAME_COUNTS = [3, 2, 3, 3, 3, 3, 2, 3, 3, 3, 3, 3, 3, 3, 3, 5];
// FRAME_COUNTS.length bilan bir xil bo'lishi shart (auditlar shu literalni o'qiydi).
const TOTAL_SCREENS = 16;

const LESSON_META = {
  lessonId: 'frac-4-23-v2',
  slug: 'dars23-kasrli-masalalar',
  lessonTitle: bi('23-dars. Kasrli masalalar: qism va butun', 'Урок 23. Задачи с дробями: часть и целое', 'Lesson 23. Fraction problems: part and whole'),
  skillTags: ['whole_from_fraction', 'unit_fraction_value', 'inverse_of_fraction_of_number', 'remainder_as_fraction', 'direction_choice', 'answer_check'],
  finalReflectionRequired: true,
};

const SCREEN_META = [
  { id: 's0', type: 'hook', subtype: 'story-prediction', template: 'HookPredict', mechanic: 'HookPredict', goal: 'Predict the whole when only a part of it is recorded', misconceptions: ['part multiplied by the denominator'], active: true, scored: false, scope: 'hook', resetOnReturn: true },
  { id: 's1', type: 'diagnostic', subtype: 'prior-knowledge', template: 'InlineCheckScreen', mechanic: 'InlineCheckScreen', goal: 'Read the known amount as several equal parts, not as one part', misconceptions: ['known amount taken as one part'], active: true, scored: false, scope: null },
  { id: 's2', type: 'exploration', subtype: 'part-to-one-part', template: 'StepReveal', mechanic: 'StepReveal', goal: 'Find one equal part from a known group of parts', misconceptions: ['multiplying before dividing'], active: true, scored: false, scope: null },
  { id: 's3', type: 'test', subtype: 'build-the-whole', template: 'BuildWhole', mechanic: 'BuildWhole', goal: 'Grow the whole from a unit fraction and read its value', misconceptions: ['whole equals the unit fraction'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's4', type: 'exploration', subtype: 'two-step-record', template: 'StepReveal', mechanic: 'StepReveal', goal: 'Build the record: divide by the numerator, multiply by the denominator', misconceptions: ['dividing by the denominator'], active: true, scored: false, scope: null },
  { id: 's5', type: 'test', subtype: 'ledger-entry', template: 'TapNumPadScreen', mechanic: 'TapNumPadScreen', goal: 'Restore the whole from a known part in two operations', misconceptions: ['stopping after the division'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's6', type: 'discovery', subtype: 'order-of-actions', template: 'RecordOrder', mechanic: 'RecordOrder', goal: 'Discover why the division comes before the multiplication', misconceptions: ['multiplying first'], active: true, scored: false, scope: null },
  { id: 's7', type: 'rule', subtype: 'textbook-method', template: 'RuleScreen', mechanic: 'RuleScreen', goal: 'Name the rule and see both directions side by side', misconceptions: ['one rule for both directions'], active: true, scored: false, scope: null },
  { id: 's8', type: 'error', subtype: 'misconception-repair', template: 'ErrorRepair', mechanic: 'ErrorRepair', goal: 'Repair the record where the part was multiplied by the denominator', misconceptions: ['part multiplied by the denominator'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's9', type: 'strategy', subtype: 'direction-sort', template: 'DirectionSort', mechanic: 'DirectionSort', goal: 'Sort tasks by what is known and what is asked', misconceptions: ['same record for both directions'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's10', type: 'case', subtype: 'remainder-as-fraction', template: 'MCScreen', mechanic: 'MCScreen', goal: 'Name the fraction that the remainder makes', misconceptions: ['remainder taken as the spent part'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's11', type: 'test', subtype: 'remainder-entry', template: 'TapNumPadScreen', mechanic: 'TapNumPadScreen', goal: 'Restore the whole from a unit fraction remainder', misconceptions: ['dividing by the denominator'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's12', type: 'matching', subtype: 'condition-whole-link', template: 'MatchingBoard', mechanic: 'MatchingBoard', goal: 'Link each condition with the restored whole', misconceptions: ['matching by digits only'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's13', type: 'test', subtype: 'three-rounds', template: 'RoundsScreen', mechanic: 'RoundsScreen', goal: 'Choose the correct first action in three different conditions', misconceptions: ['dividing by the denominator', 'part multiplied by the denominator'], active: true, scored: true, scoreUnits: 3, scope: 'module-mikro' },
  { id: 's14', type: 'test', subtype: 'final-diagnostic', template: 'FinalRounds', mechanic: 'FinalRounds', goal: 'Restore the whole in new contexts and check the answer', misconceptions: ['no check of the result'], active: true, scored: true, scoreUnits: 3, scope: 'final' },
  { id: 's15', type: 'summary', subtype: 'title-claim', template: 'TitleClaim', mechanic: 'TitleClaim', goal: 'Consolidate both directions and bridge to decimal fractions', misconceptions: ['partial result check'], active: true, scored: false, scope: null },
];

const TOPIC_KICKER = bi('Qism va butun', 'Часть и целое', 'Part and whole');
// O'lchov birliklari uch tilda: rus tilida quti emas, коробка.
const UNIT_BOX = bi('quti', 'коробок', 'boxes');
const UNIT_PAGE = bi('bet', 'страниц', 'pages');
const UNIT_SUM = bi("so'm", 'сумов', 'sum');
const UNIT_CM = bi('cm', 'см', 'cm');
const LEDGER_TOTAL = bi('Butun zaxira', 'Весь запас', 'Whole store');
const LEDGER_PART = bi('Daftardagi qism', 'Часть в журнале', 'Part in the ledger');


// ---------------------------------------------------------------------------
// KONTENT. Ekranda ko'rinadigan matnda raqam va belgi bo'lishi mumkin; ovozga
// ketadigan har bir maydon (audio..., feedbackAudio) faqat so'z bilan yoziladi.
// ---------------------------------------------------------------------------
const CONTENT = {
  s0: {
    eyebrow: bi('Ombor daftari', 'Складской журнал', 'The warehouse ledger'),
    title: bi("Daftarda butun zaxira o'chib ketgan", 'В журнале стёрся весь запас', 'The whole store is missing from the ledger'),
    question: bi("Beshdan uch qismi 15 quti bo'lsa, butun zaxira nechta quti?", 'Если три пятых части — 15 коробок, сколько коробок во всём запасе?', 'If three fifths is 15 boxes, how many boxes are in the whole store?'),
    options: [
      bi('25 quti', '25 коробок', '25 boxes'),
      bi('75 quti', '75 коробок', '75 boxes'),
      bi('Hali aniq emas', 'Пока не ясно', 'Not clear yet'),
    ],
    neutral: bi("Taxmin saqlandi. Endi daftardagi qismni teng ulushlarga bo'lib, butunni tiklaymiz.", 'Гипотеза сохранена. Теперь разделим часть из журнала на равные доли и восстановим целое.', 'Your prediction is saved. Now we will split the recorded part into equal shares and restore the whole.'),
    audio: {
      intro: {
        uz: [
          "Taqsimot markazining ombor daftariga suv tegdi va butun zaxira yozilgan ustun o'chib ketdi.",
          "Bir qatorda faqat qism qoldi. Zaxiraning beshdan uch qismi o'n besh quti.",
          "Bit butunni yetmish besh quti deb yozdi. Sizningcha butun zaxira nechta quti? Taxminingizni tanlang.",
        ],
        ru: [
          'На складской журнал центра распределения попала вода, и столбец со всем запасом стёрся.',
          'В одной строке осталась только часть. Три пятых запаса это пятнадцать коробок.',
          'Бит записал целое как семьдесят пять коробок. Как думаешь, сколько коробок во всём запасе? Выбери свою гипотезу.',
        ],
        en: [
          'Water reached the warehouse ledger of the distribution centre and the column with the whole store faded away.',
          'Only a part is left in one row. Three fifths of the store is fifteen boxes.',
          'Bit wrote the whole as seventy-five boxes. How many boxes do you think the whole store holds? Choose your prediction.',
        ],
      },
    },
  },

  s1: {
    eyebrow: bi('Tayanch bilim', 'Опорное знание', 'Prior knowledge'),
    title: bi("Ma'lum son nechta ulushni bildiradi", 'Известное число задаёт число долей', 'The known amount stands for several shares'),
    prompt: bi('3/5 qismi 15 quti. 15 quti nechta ulush?', 'Три пятых — 15 коробок. Сколько это долей?', 'Three fifths is 15 boxes. How many shares is that?'),
    chips: [
      bi('bitta ulush', 'одна доля', 'one share'),
      bi('uchta ulush', 'три доли', 'three shares'),
      bi('beshta ulush', 'пять долей', 'five shares'),
    ],
    correctIndex: 1,
    note: {
      right: bi("To'g'ri. Surat 3 ta ulush olinganini bildiradi, demak 15 quti uchta ulushga to'g'ri keladi.", 'Верно. Числитель говорит, что взяли 3 доли, значит 15 коробок — это три доли.', 'Correct. The numerator says three shares were taken, so 15 boxes covers three shares.'),
      wrong: bi("Tepadagi son nechta ulush olinganini bildiradi. Bitta ulush hozircha noma'lum.", 'Верхнее число говорит, сколько долей взяли. Одна доля пока неизвестна.', 'The upper number says how many shares were taken. One share is still unknown.'),
    },
    audio: {
      intro: {
        uz: [
          "Butunni tiklashdan oldin bitta narsani aniqlaymiz.",
          "Beshdan uch qismi o'n besh quti. O'n besh quti nechta ulushga to'g'ri keladi? Javobni tanlang.",
        ],
        ru: [
          'Прежде чем восстанавливать целое, уточним одно.',
          'Три пятых это пятнадцать коробок. Скольким долям соответствуют пятнадцать коробок? Выбери ответ.',
        ],
        en: [
          'Before restoring the whole, let us settle one thing.',
          'Three fifths is fifteen boxes. How many shares do fifteen boxes cover? Choose the answer.',
        ],
      },
    },
  },

  s2: {
    eyebrow: bi('Tushuntirish', 'Объяснение', 'Explanation'),
    title: bi('Avval bitta ulush qancha ekanini topamiz', 'Сначала находим, сколько в одной доле', 'First we find how much one share holds'),
    lead: bi("Bosib boring: daftardagi qism uchta ulushga ajratiladi va bitta ulush ko'rinadi.", 'Нажимай: часть из журнала делится на три доли, и видно одну долю.', 'Tap to move on: the recorded part splits into three shares and one share becomes visible.'),
    steps: [
      {
        chip: bi("Ma'lum: 15 quti", 'Известно: 15 коробок', 'Known: 15 boxes'),
        caption: bi("Daftarda faqat 3/5 qismi bor: 15 quti. Butun noma'lum.", 'В журнале есть только три пятых: 15 коробок. Целое неизвестно.', 'The ledger holds only three fifths: 15 boxes. The whole is unknown.'),
      },
      {
        chip: bi('1 ulush = 5 quti', '1 доля = 5 коробок', '1 share = 5 boxes'),
        caption: bi('15 : 3 = 5. Uchta ulushda 15 quti bor, demak bitta ulushda 5 quti.', '15 : 3 = 5. В трёх долях 15 коробок, значит в одной доле 5 коробок.', '15 : 3 = 5. Three shares hold 15 boxes, so one share holds 5 boxes.'),
      },
      {
        chip: bi('Butun = 25 quti', 'Целое = 25 коробок', 'Whole = 25 boxes'),
        caption: bi('Butunda 5 ta ulush bor: 5 · 5 = 25. Daftardagi butun zaxira 25 quti.', 'В целом 5 долей: 5 · 5 = 25. Весь запас в журнале — 25 коробок.', 'The whole has 5 shares: 5 · 5 = 25. The whole store in the ledger is 25 boxes.'),
      },
    ],
    done: bi('Butunni topish uchun avval bitta ulush topiladi.', 'Чтобы найти целое, сначала находят одну долю.', 'To find the whole, one share is found first.'),
    audio: {
      intro: {
        uz: [
          "Daftardagi qatorni modelda ko'ramiz.",
          'Har qadamni ochish uchun tugmani bosing.',
          "To'q rangli bo'lak daftarda qolgan qism, oq bo'laklar esa noma'lum qism.",
        ],
        ru: [
          'Посмотрим строку журнала на модели.',
          'Чтобы открыть каждый шаг, нажимай кнопку.',
          'Тёмная полоса это часть из журнала, а светлые полосы это неизвестная часть.',
        ],
        en: [
          'Let us look at the ledger row on the model.',
          'Tap the button to open each step.',
          'The dark strip is the part from the ledger, the light strips are the unknown part.',
        ],
      },
      steps: {
        uz: [
          "Daftarda beshdan uch qismi qolgan. Bu o'n besh quti va u uchta ulush.",
          "O'n beshni uchga bo'lamiz. Bitta ulush besh quti chiqadi.",
          "Butunda beshta ulush bor. Beshni beshga ko'paytiramiz va yigirma besh quti chiqadi.",
        ],
        ru: [
          'В журнале остались три пятых. Это пятнадцать коробок, и это три доли.',
          'Разделим пятнадцать на три. Одна доля равна пяти коробкам.',
          'В целом пять долей. Умножим пять на пять и получим двадцать пять коробок.',
        ],
        en: [
          'Three fifths are left in the ledger. That is fifteen boxes and it covers three shares.',
          'Let us divide fifteen by three. One share is five boxes.',
          'The whole has five shares. Five times five gives twenty-five boxes.',
        ],
      },
    },
  },

  s3: {
    eyebrow: bi('Model', 'Модель', 'Model'),
    title: bi("Butunni ulushdan yig'ib chiqamiz", 'Соберём целое из долей', 'Let us grow the whole from shares'),
    lead: bi("Kesmaning beshdan bir ulushi 9 cm. Butun kesma tayyor bo'lgunicha ulush qo'shing, keyin Tayyor tugmasini bosing.", 'Одна пятая доля отрезка — 9 см. Добавляй доли, пока целый отрезок не будет готов, потом нажми Готово.', 'One fifth of the segment is 9 cm. Add shares until the whole segment is ready, then press Done.'),
    question: bi('Butun kesma necha santimetr?', 'Сколько сантиметров в целом отрезке?', 'How many centimetres is the whole segment?'),
    unitValue: 9,
    target: 5,
    slots: 7,
    answer: 45,
    hintShort: bi('Hali butun emas', 'Ещё не целое', 'Not the whole yet'),
    hintLong: bi('Ulush maxrajdan oshdi', 'Долей больше знаменателя', 'More shares than the denominator'),
    proof: bi('9 · 5 = 45. Beshta ulush butun kesmani beradi: 45 cm.', '9 · 5 = 45. Пять долей дают целый отрезок: 45 см.', '9 · 5 = 45. Five shares make the whole segment: 45 cm.'),
    audio: {
      intro: {
        uz: [
          "Endi butunni o'zingiz yig'ib chiqasiz.",
          "Kesmaning beshdan bir ulushi to'qqiz santimetr. Maxraj besh, demak butunda beshta shunday ulush bor.",
          "Ulush qo'shib boring va butun tayyor bo'lganda tayyor tugmasini bosing.",
        ],
        ru: [
          'Теперь целое соберёшь сам.',
          'Одна пятая доля отрезка равна девяти сантиметрам. Знаменатель пять, значит в целом пять таких долей.',
          'Добавляй доли и нажми кнопку готово, когда целое будет собрано.',
        ],
        en: [
          'Now you will grow the whole yourself.',
          'One fifth of the segment is nine centimetres. The denominator is five, so the whole has five such shares.',
          'Add shares and press the done button when the whole is ready.',
        ],
      },
      on_correct: bi('Beshta ulush qirq besh santimetr beradi. Butun kesma topildi.', 'Пять долей дают сорок пять сантиметров. Целый отрезок найден.', 'Five shares give forty-five centimetres. The whole segment is found.'),
      on_wrong: bi("Ulushlar soni maxrajga teng bo'lishi kerak. Maxrajga qarab qayta yig'ing.", 'Число долей должно быть равно знаменателю. Собери заново, глядя на знаменатель.', 'The number of shares must equal the denominator. Build it again and watch the denominator.'),
    },
  },

  s4: {
    eyebrow: bi('Tushuntirish', 'Объяснение', 'Explanation'),
    title: bi('Yozuv ikki amaldan tuziladi', 'Запись состоит из двух действий', 'The record is built from two operations'),
    lead: bi("Avaz kitobning 3/4 qismini, ya'ni 78 betini o'qidi. Kitobda necha bet borligini qadamlab tiklaymiz.", 'Аваз прочитал три четвёртых книги, то есть 78 страниц. Восстановим по шагам, сколько страниц в книге.', 'Avaz read three quarters of the book, that is 78 pages. Let us restore step by step how many pages the book has.'),
    steps: [
      {
        chip: bi('78 bet = 3 ulush', '78 страниц = 3 доли', '78 pages = 3 shares'),
        caption: bi("O'qilgan 78 bet uchta ulushga to'g'ri keladi, chunki surat 3.", 'Прочитанные 78 страниц — это три доли, ведь числитель 3.', 'The 78 pages read cover three shares, because the numerator is 3.'),
      },
      {
        chip: bi('78 : 3 = 26', '78 : 3 = 26', '78 : 3 = 26'),
        caption: bi("Suratga bo'lamiz va bitta ulush 26 bet ekanini bilamiz.", 'Делим на числитель и узнаём, что в одной доле 26 страниц.', 'We divide by the numerator and learn that one share is 26 pages.'),
      },
      {
        chip: bi('26 · 4 = 104', '26 · 4 = 104', '26 · 4 = 104'),
        caption: bi("Maxrajga ko'paytiramiz: butun kitobda 104 bet bor.", 'Умножаем на знаменатель: во всей книге 104 страницы.', 'We multiply by the denominator: the whole book has 104 pages.'),
      },
    ],
    done: bi('Qism : surat, keyin natija · maxraj.', 'Часть : числитель, затем результат · знаменатель.', 'Part : numerator, then the result · denominator.'),
    audio: {
      intro: {
        uz: [
          "Ombor daftaridan chiqib, kitobga o'tamiz. Masala tuzilishi bir xil.",
          "Avaz kitobning to'rtdan uch qismini o'qidi va bu yetmish sakkiz bet.",
          'Qadamlarni ochib, kitobda necha bet borligini topamiz.',
        ],
        ru: [
          'Выйдем из складского журнала и перейдём к книге. Строение задачи то же.',
          'Аваз прочитал три четвёртых книги, и это семьдесят восемь страниц.',
          'Открывая шаги, найдём, сколько страниц в книге.',
        ],
        en: [
          'Let us leave the ledger and move to a book. The task has the same structure.',
          'Avaz read three quarters of the book and that is seventy-eight pages.',
          'By opening the steps we will find how many pages the book has.',
        ],
      },
      steps: {
        uz: [
          'Yetmish sakkiz bet uchta ulush, chunki surat uch.',
          "Yetmish sakkizni uchga bo'lamiz. Bitta ulush yigirma olti bet.",
          "Yigirma oltini to'rtga ko'paytiramiz. Butun kitobda bir yuz to'rt bet bor.",
        ],
        ru: [
          'Семьдесят восемь страниц это три доли, ведь числитель три.',
          'Разделим семьдесят восемь на три. Одна доля равна двадцати шести страницам.',
          'Умножим двадцать шесть на четыре. Во всей книге сто четыре страницы.',
        ],
        en: [
          'Seventy-eight pages make three shares, because the numerator is three.',
          'Let us divide seventy-eight by three. One share is twenty-six pages.',
          'Multiply twenty-six by four. The whole book has one hundred and four pages.',
        ],
      },
    },
  },

  s5: {
    eyebrow: bi('Amaliyot', 'Практика', 'Practice'),
    title: bi('Daftarning ikkinchi qatori', 'Вторая строка журнала', 'The second row of the ledger'),
    lead: bi('Bu qatorda zaxiraning 2/5 qismi yozilgan: 18 quti. Butun zaxirani toping.', 'В этой строке записаны две пятых запаса: 18 коробок. Найди весь запас.', 'This row records two fifths of the store: 18 boxes. Find the whole store.'),
    question: bi('Butun zaxira nechta quti?', 'Сколько коробок во всём запасе?', 'How many boxes are in the whole store?'),
    answer: 45,
    parts: 5,
    known: 2,
    knownValue: 18,
    hint: bi('18 quti ikkita ulush. Avval bitta ulushni toping.', '18 коробок — это две доли. Сначала найди одну долю.', '18 boxes is two shares. Find one share first.'),
    proof: bi('18 : 2 = 9, keyin 9 · 5 = 45. Butun zaxira 45 quti.', '18 : 2 = 9, затем 9 · 5 = 45. Весь запас — 45 коробок.', '18 : 2 = 9, then 9 · 5 = 45. The whole store is 45 boxes.'),
    audio: {
      intro: {
        uz: [
          "Daftarning ikkinchi qatorini o'zingiz tiklaysiz.",
          "Zaxiraning beshdan ikki qismi o'n sakkiz quti.",
          'Butun zaxira nechta quti ekanini hisoblab, raqamlarni bosib teringiz.',
        ],
        ru: [
          'Вторую строку журнала восстановишь сам.',
          'Две пятых запаса это восемнадцать коробок.',
          'Посчитай, сколько коробок во всём запасе, и набери ответ, нажимая цифры.',
        ],
        en: [
          'You will restore the second row of the ledger yourself.',
          'Two fifths of the store is eighteen boxes.',
          'Work out how many boxes the whole store holds and tap the digits to enter it.',
        ],
      },
      on_correct: bi("Bitta ulush to'qqiz quti, butunda beshta ulush. Qirq besh quti to'g'ri.", 'Одна доля это девять коробок, а в целом пять долей. Сорок пять коробок верно.', 'One share is nine boxes and the whole has five shares. Forty-five boxes is correct.'),
      on_wrong: bi("O'n sakkiz quti ikkita ulush. Avval ikkiga bo'ling, keyin beshga ko'paytiring.", 'Восемнадцать коробок это две доли. Сначала раздели на два, потом умножь на пять.', 'Eighteen boxes is two shares. Divide by two first, then multiply by five.'),
    },
  },

  s6: {
    eyebrow: bi('Kashfiyot', 'Открытие', 'Discovery'),
    title: bi("Nima uchun avval bo'lish turadi", 'Почему деление стоит первым', 'Why the division comes first'),
    lead: bi("Ikki amal kartasini to'g'ri tartibda bosing: qaysi biri birinchi bo'ladi?", 'Нажми две карточки действий в правильном порядке: какое из них первое?', 'Tap the two action cards in the right order: which one comes first?'),
    cards: [
      { key: 'mul', label: bi('· 5', '· 5', '· 5'), caption: bi("maxrajga ko'paytirish", 'умножить на знаменатель', 'multiply by the denominator') },
      { key: 'div', label: bi(': 2', ': 2', ': 2'), caption: bi("suratga bo'lish", 'разделить на числитель', 'divide by the numerator') },
    ],
    orderKeys: ['div', 'mul'],
    wrongNote: bi("Ko'paytirish oldin turolmaydi: 18 quti bitta ulush emas, ikkita ulush. Avval bitta ulushni ajratamiz.", 'Умножение не может стоять первым: 18 коробок — не одна доля, а две. Сначала выделим одну долю.', 'Multiplication cannot come first: 18 boxes is not one share but two. We separate one share first.'),
    doneNote: bi("To'g'ri tartib: avval : 2 bitta ulushni beradi, keyin · 5 butunni yig'adi.", 'Верный порядок: сначала : 2 даёт одну долю, потом · 5 собирает целое.', 'The right order: : 2 gives one share first, then · 5 collects the whole.'),
    audio: {
      intro: {
        uz: [
          'Ikkita amal bor, lekin tartib muhim.',
          "Kartalarni to'g'ri tartibda bosing.",
        ],
        ru: [
          'Действий два, но порядок важен.',
          'Нажми карточки в правильном порядке.',
        ],
        en: [
          'There are two operations, but the order matters.',
          'Tap the cards in the right order.',
        ],
      },
      on_correct: bi("Avval bo'lish bitta ulushni beradi, keyin ko'paytirish butunni yig'adi.", 'Сначала деление даёт одну долю, потом умножение собирает целое.', 'The division gives one share first, then the multiplication collects the whole.'),
      on_wrong: bi("Ko'paytirish birinchi bo'lsa, ikkita ulush butun deb hisoblanadi va javob katta chiqadi.", 'Если умножение будет первым, две доли примут за целое и ответ выйдет больше.', 'If multiplication comes first, two shares are treated as the whole and the answer grows too large.'),
    },
  },

  s7: {
    eyebrow: bi('Qoida', 'Правило', 'Rule'),
    title: bi("Sonni uning kasri bo'yicha topish", 'Нахождение числа по его дроби', 'Finding a number from its fraction'),
    rule: bi("Sonni uning kasri bo'yicha topish uchun berilgan son kasr suratiga bo'linadi va natija kasr maxrajiga ko'paytiriladi.", 'Чтобы найти число по его дроби, данное число делят на числитель дроби, а результат умножают на знаменатель.', 'To find a number from its fraction, the given amount is divided by the numerator and the result is multiplied by the denominator.'),
    lines: [
      bi("Ma'lum qism nechta ulush ekanini surat aytadi.", 'Числитель говорит, сколько долей в известной части.', 'The numerator says how many shares the known part covers.'),
      bi('Butunda nechta ulush borligini maxraj aytadi.', 'Знаменатель говорит, сколько долей в целом.', 'The denominator says how many shares the whole has.'),
    ],
    formula: bi('butun = qism : surat · maxraj', 'целое = часть : числитель · знаменатель', 'whole = part : numerator · denominator'),
    ruleSource: bi('4-sinf darsligi, 142-bet', 'Учебник 4 класса, стр. 142', 'Grade 4 textbook, p. 142'),
    directions: {
      heads: [
        bi("Ma'lum", 'Известно', 'Known'),
        bi("So'raladi", 'Спрашивают', 'Asked'),
        bi('Yozuv', 'Запись', 'Record'),
      ],
      rows: [
        [
          bi('butun 240', 'целое 240', 'whole 240'),
          bi('3/5 qismi', 'три пятых', 'three fifths'),
          bi('240 : 5 · 3', '240 : 5 · 3', '240 : 5 · 3'),
        ],
        [
          bi('3/5 qismi 15', 'три пятых — 15', 'three fifths is 15'),
          bi('butun', 'целое', 'the whole'),
          bi('15 : 3 · 5', '15 : 3 · 5', '15 : 3 · 5'),
        ],
      ],
    },
    check: {
      prompt: bi("Butun so'ralganda birinchi amal qaysi son bilan bajariladi?", 'Когда спрашивают целое, с каким числом выполняют первое действие?', 'When the whole is asked, which number is used in the first operation?'),
      chips: [
        bi('surat bilan', 'с числителем', 'with the numerator'),
        bi('maxraj bilan', 'со знаменателем', 'with the denominator'),
        bi('butun bilan', 'с целым', 'with the whole'),
      ],
      correctIndex: 0,
      note: {
        right: bi("To'g'ri. Butun so'ralsa, ma'lum qism suratga bo'linadi.", 'Верно. Если спрашивают целое, известную часть делят на числитель.', 'Correct. When the whole is asked, the known part is divided by the numerator.'),
        wrong: bi("Maxrajga bo'lish butun ma'lum bo'lganda kerak edi. Bu yerda butun noma'lum.", 'Делить на знаменатель нужно было, когда целое известно. Здесь целое неизвестно.', 'Dividing by the denominator was needed when the whole was known. Here the whole is unknown.'),
      },
    },
    audio: {
      intro: {
        uz: [
          "Darslikdagi qoidani o'qiymiz.",
          "Ikki yo'nalish yonma-yon turadi. Yuqoridagi qatorda butun ma'lum, pastdagi qatorda butun noma'lum.",
          "Qoidani o'qib, savolga javob bering.",
        ],
        ru: [
          'Прочитаем правило из учебника.',
          'Два направления стоят рядом. В верхней строке целое известно, в нижней целое неизвестно.',
          'Прочитай правило и ответь на вопрос.',
        ],
        en: [
          'Let us read the rule from the textbook.',
          'The two directions stand side by side. In the upper row the whole is known, in the lower row it is unknown.',
          'Read the rule and answer the question.',
        ],
      },
    },
  },


  s8: {
    eyebrow: bi('Xato ustida ish', 'Работа над ошибкой', 'Working on a mistake'),
    title: bi("Bit butunni ko'paytirib yubordi", 'Бит сразу умножил и получил лишнее', 'Bit multiplied straight away and overshot'),
    errorTop: bi('3/4 qismi 78 bet', 'три четвёртых — 78 страниц', 'three quarters is 78 pages'),
    errorBottom: bi('78 · 4 = 312', '78 · 4 = 312', '78 · 4 = 312'),
    question: bi('Bit qayerda xato qildi?', 'В чём ошибка Бита?', 'Where did Bit go wrong?'),
    options: [
      bi("78 bet uchta ulush, avval 3 ga bo'lish kerak edi", '78 страниц — это три доли, сначала нужно было разделить на 3', '78 pages is three shares, it had to be divided by 3 first'),
      bi("78 ni 4 ga bo'lish kerak edi", '78 нужно было разделить на 4', '78 had to be divided by 4'),
      bi("Xato yo'q, kitobda 312 bet", 'Ошибки нет, в книге 312 страниц', 'There is no mistake, the book has 312 pages'),
    ],
    correctIndex: 0,
    feedback: [
      bi("To'g'ri. 78 bet bitta ulush emas, uchta ulush. Avval 78 : 3 = 26, keyin 26 · 4 = 104.", 'Верно. 78 страниц — не одна доля, а три. Сначала 78 : 3 = 26, потом 26 · 4 = 104.', 'Correct. 78 pages is not one share but three. First 78 : 3 = 26, then 26 · 4 = 104.'),
      bi("4 ga bo'lish butun ma'lum bo'lganda kerak edi. Bu yerda butun noma'lum, shuning uchun suratga bo'linadi.", 'Делить на 4 нужно было, если целое известно. Здесь целое неизвестно, поэтому делят на числитель.', 'Dividing by 4 was needed when the whole is known. Here the whole is unknown, so we divide by the numerator.'),
      bi("312 bet kitobdan katta chiqdi: 78 bet butunning uchdan uch qismi emas, to'rtdan uch qismi.", '312 страниц больше самой книги: 78 страниц — это три четвёртых, а не всё целое.', '312 pages is more than the book itself: 78 pages is three quarters, not the whole.'),
    ],
    feedbackAudio: [
      bi("To'g'ri. Yetmish sakkiz bet uchta ulush. Avval uchga bo'linadi, keyin to'rtga ko'paytiriladi.", 'Верно. Семьдесят восемь страниц это три доли. Сначала делят на три, потом умножают на четыре.', 'Correct. Seventy-eight pages is three shares. First divide by three, then multiply by four.'),
      bi("To'rtga bo'lish butun ma'lum bo'lgan darsda kerak edi. Bu yerda butun noma'lum.", 'Делить на четыре нужно было в задаче, где целое известно. Здесь целое неизвестно.', 'Dividing by four was needed where the whole is known. Here the whole is unknown.'),
      bi("Uch yuz o'n ikki bet juda katta. Yetmish sakkiz bet butunning hammasi emas.", 'Триста двенадцать страниц слишком много. Семьдесят восемь страниц это не всё целое.', 'Three hundred and twelve pages is far too many. Seventy-eight pages is not the whole.'),
    ],
    proof: bi('78 : 3 = 26, 26 · 4 = 104', '78 : 3 = 26, 26 · 4 = 104', '78 : 3 = 26, 26 · 4 = 104'),
    audio: {
      intro: {
        uz: [
          "Bit kitob masalasini o'zi yechmoqchi bo'ldi.",
          "U yetmish sakkizni to'rtga ko'paytirdi va uch yuz o'n ikki bet deb yozdi.",
          'Yozuvni tekshiring va xato qayerda ekanini toping.',
        ],
        ru: [
          'Бит решил сам справиться с задачей про книгу.',
          'Он умножил семьдесят восемь на четыре и записал триста двенадцать страниц.',
          'Проверь запись и найди, где ошибка.',
        ],
        en: [
          'Bit decided to solve the book problem on his own.',
          'He multiplied seventy-eight by four and wrote three hundred and twelve pages.',
          'Check the record and find where the mistake is.',
        ],
      },
    },
  },

  s9: {
    eyebrow: bi('Strategiya', 'Стратегия', 'Strategy'),
    title: bi("Masalani ikki yo'nalishga ajratamiz", 'Разложим задачи по двум направлениям', 'Let us sort the tasks into two directions'),
    lead: bi("Kartani bosing, keyin mos ustunni bosing: nima ma'lum va nima so'ralgan?", 'Нажми карточку, затем нужный столбец: что известно и что спрашивают?', 'Tap a card, then the matching column: what is known and what is asked?'),
    buckets: [
      { label: bi('Qismni topish', 'Найти часть', 'Find the part'), caption: bi("butun ma'lum", 'целое известно', 'the whole is known') },
      { label: bi('Butunni topish', 'Найти целое', 'Find the whole'), caption: bi("qism ma'lum", 'часть известна', 'the part is known') },
    ],
    items: [
      {
        text: bi('Butun 240. 3/5 qismi qancha?', 'Целое 240. Сколько составляют три пятых?', 'The whole is 240. How much is three fifths?'),
        bucket: 0,
        wrongNote: bi("Bu yerda butun berilgan, so'ralgani esa qism. Demak qismni topamiz.", 'Здесь дано целое, а спрашивают часть. Значит находим часть.', 'Here the whole is given and the part is asked. So we find the part.'),
      },
      {
        text: bi('3/5 qismi 15 quti. Butun qancha?', 'Три пятых — 15 коробок. Сколько всё целое?', 'Three fifths is 15 boxes. How much is the whole?'),
        bucket: 1,
        wrongNote: bi("15 quti - qism, butun esa noma'lum. Demak butunni tiklaymiz.", '15 коробок — это часть, а целое неизвестно. Значит восстанавливаем целое.', '15 boxes is the part and the whole is unknown. So we restore the whole.'),
      },
      {
        text: bi("Kitobning 1/4 qismi 26 bet. Kitobda necha bet?", 'Одна четвёртая книги — 26 страниц. Сколько страниц в книге?', 'One quarter of the book is 26 pages. How many pages does the book have?'),
        bucket: 1,
        wrongNote: bi("26 bet - bitta ulush, kitob hajmi noma'lum. Butunni topamiz.", '26 страниц — одна доля, объём книги неизвестен. Находим целое.', '26 pages is one share and the size of the book is unknown. We find the whole.'),
      },
      {
        text: bi("20 km yo'lning 4/5 qismi qancha?", 'Сколько составляют четыре пятых пути в 20 км?', 'How much is four fifths of a 20 km route?'),
        bucket: 0,
        wrongNote: bi("Butun yo'l 20 km deb berilgan, so'ralgani qism.", 'Весь путь дан — 20 км, спрашивают часть.', 'The whole route is given as 20 km and the part is asked.'),
      },
    ],
    doneNote: bi("Ikki yo'nalish ajratildi: butun ma'lum bo'lsa qism topiladi, qism ma'lum bo'lsa butun tiklanadi.", 'Направления разделены: если известно целое — находят часть, если известна часть — восстанавливают целое.', 'The directions are sorted: when the whole is known we find the part, when the part is known we restore the whole.'),
    audio: {
      intro: {
        uz: [
          'Masalalarni ikki turkumga ajratamiz.',
          "Chap ustun butun ma'lum bo'lgan masalalar uchun, o'ng ustun butun noma'lum bo'lgan masalalar uchun.",
          'Kartani bosing, keyin mos ustunni bosing.',
        ],
        ru: [
          'Разложим задачи на две группы.',
          'Левый столбец для задач, где целое известно, а правый для задач, где целое неизвестно.',
          'Нажми карточку, затем нужный столбец.',
        ],
        en: [
          'Let us sort the tasks into two groups.',
          'The left column is for tasks where the whole is known, the right one for tasks where it is unknown.',
          'Tap a card, then the matching column.',
        ],
      },
      on_correct: bi("Hamma karta joyiga tushdi. Endi yo'nalishni shartdan ajratib olasiz.", 'Все карточки на месте. Теперь ты различаешь направление по условию.', 'Every card is in place. Now you can tell the direction from the condition.'),
      on_wrong: bi("Shartni qaytadan o'qing. Butun berilganmi yoki so'ralganmi?", 'Прочитай условие снова. Целое дано или его спрашивают?', 'Read the condition again. Is the whole given or is it asked?'),
    },
  },

  s10: {
    eyebrow: bi('Hayotiy holat', 'Жизненная ситуация', 'A real case'),
    title: bi('Qoldiq ham kasr qismi', 'Остаток тоже часть', 'The remainder is a fraction too'),
    story: bi("Dilshod pulining 7/8 qismini sarfladi va 500 so'm qoldi.", 'Дильшод потратил семь восьмых своих денег, и у него осталось 500 сумов.', 'Dilshod spent seven eighths of his money and 500 sum is left.'),
    question: bi("500 so'm butun pulning qanday qismi?", 'Какой частью всех денег являются 500 сумов?', 'What fraction of all the money is 500 sum?'),
    options: [
      bi('1/8 qismi', 'одна восьмая', 'one eighth'),
      bi('7/8 qismi', 'семь восьмых', 'seven eighths'),
      bi('8/8 qismi', 'восемь восьмых', 'eight eighths'),
    ],
    correctIndex: 0,
    feedback: [
      bi("To'g'ri. Butun 8 ulush, 7 ulush sarflandi, demak qoldiq bitta ulush: 1/8.", 'Верно. В целом 8 долей, 7 потратили, значит остаток — одна доля: 1/8.', 'Correct. The whole has 8 shares, 7 were spent, so the remainder is one share: 1/8.'),
      bi('7/8 - sarflangan qism. Qoldiq esa undan keyin qolgani.', 'Семь восьмых — это потраченная часть. Остаток — то, что осталось после неё.', 'Seven eighths is the part that was spent. The remainder is what is left after it.'),
      bi("8/8 - butun pulning hammasi. Lekin pulning bir qismi sarflangan.", 'Восемь восьмых — это все деньги. Но часть денег уже потратили.', 'Eight eighths is all the money. But part of the money is already spent.'),
    ],
    feedbackAudio: [
      bi("To'g'ri. Butunda sakkiz ulush, yetti ulush sarflandi, qoldiq bitta ulush.", 'Верно. В целом восемь долей, семь потратили, остаток это одна доля.', 'Correct. The whole has eight shares, seven were spent, so one share is left.'),
      bi('Sakkizdan yetti sarflangan qism. Qoldiq boshqa son.', 'Семь восьмых это потраченная часть. Остаток это другое число.', 'Seven eighths is the spent part. The remainder is a different amount.'),
      bi("Sakkizdan sakkiz butun pul. Lekin pulning ko'p qismi sarflangan.", 'Восемь восьмых это все деньги. Но большая часть денег потрачена.', 'Eight eighths is all the money. But most of the money is spent.'),
    ],
    proof: bi("8 ulushdan 7 tasi sarflandi, 1 ulush qoldi. Qoldiq 1/8 va u 500 so'm.", 'Из 8 долей потратили 7, осталась 1 доля. Остаток — 1/8, и это 500 сумов.', 'Of the 8 shares 7 were spent and 1 share is left. The remainder is 1/8 and it equals 500 sum.'),
    audio: {
      intro: {
        uz: [
          "Ba'zi masalalarda qism emas, qoldiq beriladi.",
          "Dilshod pulining sakkizdan yetti qismini sarfladi va besh yuz so'm qoldi.",
          "Besh yuz so'm butun pulning qanday qismi ekanini tanlang.",
        ],
        ru: [
          'В некоторых задачах дают не часть, а остаток.',
          'Дильшод потратил семь восьмых своих денег, и осталось пятьсот сумов.',
          'Выбери, какой частью всех денег являются пятьсот сумов.',
        ],
        en: [
          'In some problems the remainder is given instead of the part.',
          'Dilshod spent seven eighths of his money and five hundred sum is left.',
          'Choose what fraction of all the money five hundred sum makes.',
        ],
      },
    },
  },

  s11: {
    eyebrow: bi('Amaliyot', 'Практика', 'Practice'),
    title: bi("Dilshodning butun puli", 'Все деньги Дильшода', "All of Dilshod's money"),
    lead: bi("Qoldiq 500 so'm va u 1/8 qismi. Butun pulni toping.", 'Остаток — 500 сумов, и это одна восьмая. Найди все деньги.', 'The remainder is 500 sum and it is one eighth. Find all the money.'),
    question: bi("Dilshodda qancha pul bor edi?", 'Сколько денег было у Дильшода?', 'How much money did Dilshod have?'),
    answer: 4000,
    parts: 8,
    known: 1,
    knownValue: 500,
    hint: bi("500 so'm bitta ulush. Butunda 8 ta shunday ulush bor.", '500 сумов — одна доля. В целом 8 таких долей.', '500 sum is one share. The whole has 8 such shares.'),
    proof: bi("500 · 8 = 4000. Dilshodda 4000 so'm bor edi.", '500 · 8 = 4000. У Дильшода было 4000 сумов.', '500 · 8 = 4000. Dilshod had 4000 sum.'),
    audio: {
      intro: {
        uz: [
          'Qoldiq bitta ulush ekanini aniqladik.',
          "Bitta ulush besh yuz so'm, butunda sakkizta ulush bor.",
          'Butun pulni hisoblab, raqamlarni bosib teringiz.',
        ],
        ru: [
          'Мы выяснили, что остаток это одна доля.',
          'Одна доля это пятьсот сумов, а в целом восемь долей.',
          'Посчитай все деньги и набери ответ, нажимая цифры.',
        ],
        en: [
          'We found that the remainder is one share.',
          'One share is five hundred sum and the whole has eight shares.',
          'Work out all the money and tap the digits to enter it.',
        ],
      },
      on_correct: bi("To'g'ri. Besh yuzni sakkizga ko'paytirsak to'rt ming chiqadi.", 'Верно. Пятьсот умножить на восемь получится четыре тысячи.', 'Correct. Five hundred times eight is four thousand.'),
      on_wrong: bi("Bitta ulush besh yuz. Butunni topish uchun uni maxrajga ko'paytiring.", 'Одна доля это пятьсот. Чтобы найти целое, умножь её на знаменатель.', 'One share is five hundred. To find the whole, multiply it by the denominator.'),
    },
  },

  s12: {
    eyebrow: bi('Moslashtirish', 'Сопоставление', 'Matching'),
    title: bi("Shartni tiklangan butun bilan bog'lang", 'Свяжи условие с восстановленным целым', 'Link each condition with the restored whole'),
    prompt: bi("Chapdan shartni, o'ngdan butunni tanlang. Uchta juftlik bor.", 'Выбери условие слева и целое справа. Всего три пары.', 'Pick a condition on the left and a whole on the right. There are three pairs.'),
    left: [
      { id: 'l1', label: bi('1/5 qismi 60 m²', 'одна пятая — 60 м²', 'one fifth is 60 m²') },
      { id: 'l2', label: bi('1/3 qismi 30 ta', 'одна третья — 30 штук', 'one third is 30 items') },
      { id: 'l3', label: bi('1/3 qismi 223 m', 'одна третья — 223 м', 'one third is 223 m') },
    ],
    right: [
      { id: 'r1', pair: 'l2', value: '90', caption: bi('gul', 'цветов', 'flowers') },
      { id: 'r2', pair: 'l3', value: '669', caption: bi('metr', 'метров', 'metres') },
      { id: 'r3', pair: 'l1', value: '300', caption: bi('m² maydon', 'м² площади', 'm² of area') },
    ],
    doneNote: bi("Uch juftlik ham to'g'ri. Har holatda bitta ulush maxrajga ko'paytirildi.", 'Все три пары верны. В каждом случае одну долю умножили на знаменатель.', 'All three pairs are right. In each case one share was multiplied by the denominator.'),
    wrongNote: bi("Bu juftlik mos emas. Maxrajga qarab bitta ulushni ko'paytiring.", 'Эта пара не подходит. Посмотри на знаменатель и умножь одну долю.', 'This pair does not match. Look at the denominator and multiply one share.'),
    audio: {
      intro: {
        uz: [
          'Uchta shart va uchta butun bor.',
          'Har bir shartda bitta ulush berilgan, maxraj esa butunda nechta ulush borligini aytadi.',
          "Chapdan shartni, keyin o'ngdan butunni bosing.",
        ],
        ru: [
          'Есть три условия и три целых.',
          'В каждом условии дана одна доля, а знаменатель говорит, сколько долей в целом.',
          'Нажми условие слева, потом целое справа.',
        ],
        en: [
          'There are three conditions and three wholes.',
          'Each condition gives one share and the denominator says how many shares the whole has.',
          'Tap a condition on the left, then a whole on the right.',
        ],
      },
      on_correct: bi("Uch juftlik ham joyida. Bitta ulush maxrajga ko'paytirildi.", 'Все три пары на месте. Одну долю умножили на знаменатель.', 'All three pairs are in place. One share was multiplied by the denominator.'),
      on_wrong: bi('Bu juftlik mos emas. Maxrajni tekshiring.', 'Эта пара не подходит. Проверь знаменатель.', 'This pair does not match. Check the denominator.'),
    },
  },

  s13: {
    eyebrow: bi('Uch savol', 'Три вопроса', 'Three questions'),
    title: bi('Birinchi amalni tanlang', 'Выбери первое действие', 'Choose the first operation'),
    rounds: [
      {
        question: bi('3/7 qismi 21 kg. Butun massani topish uchun birinchi amal?', 'Три седьмых — 21 кг. Какое первое действие, чтобы найти всю массу?', 'Three sevenths is 21 kg. What is the first operation to find the whole mass?'),
        options: [
          bi('21 : 3', '21 : 3', '21 : 3'),
          bi('21 : 7', '21 : 7', '21 : 7'),
          bi('21 · 7', '21 · 7', '21 · 7'),
        ],
        correctIndex: 0,
        feedback: [
          bi("To'g'ri. 21 kg uchta ulush, 21 : 3 = 7 bitta ulushni beradi.", 'Верно. 21 кг — три доли, 21 : 3 = 7 даёт одну долю.', 'Correct. 21 kg is three shares, so 21 : 3 = 7 gives one share.'),
          bi("7 ga bo'lish butun ma'lum bo'lganda kerak edi. Bu yerda 21 kg - qism.", 'Делить на 7 нужно, когда известно целое. Здесь 21 кг — это часть.', 'Dividing by 7 is for a known whole. Here 21 kg is the part.'),
          bi("21 kg bitta ulush emas, uchta ulush. Ko'paytirish keyin keladi.", '21 кг — не одна доля, а три. Умножение будет потом.', '21 kg is not one share but three. The multiplication comes later.'),
        ],
        feedbackAudio: [
          bi("To'g'ri. Yigirma bir kilogramm uchta ulush, uchga bo'lsak bitta ulush chiqadi.", 'Верно. Двадцать один килограмм это три доли, а деление на три даёт одну долю.', 'Correct. Twenty-one kilograms is three shares and dividing by three gives one share.'),
          bi("Yettiga bo'lish butun ma'lum bo'lgan masalada kerak edi.", 'Делить на семь нужно было в задаче с известным целым.', 'Dividing by seven belongs to a task with a known whole.'),
          bi("Ko'paytirish ikkinchi amal. Avval bitta ulushni topamiz.", 'Умножение это второе действие. Сначала находим одну долю.', 'Multiplication is the second step. First we find one share.'),
        ],
        proof: bi('21 : 3 = 7, 7 · 7 = 49 kg', '21 : 3 = 7, 7 · 7 = 49 кг', '21 : 3 = 7, 7 · 7 = 49 kg'),
      },
      {
        question: bi('1/6 qismi 12 l. Butun hajmni topish uchun birinchi amal?', 'Одна шестая — 12 л. Какое первое действие, чтобы найти весь объём?', 'One sixth is 12 l. What is the first operation to find the whole volume?'),
        options: [
          bi('12 · 6', '12 · 6', '12 · 6'),
          bi('12 : 6', '12 : 6', '12 : 6'),
          bi('12 : 1 : 6', '12 : 1 : 6', '12 : 1 : 6'),
        ],
        correctIndex: 0,
        feedback: [
          bi("To'g'ri. Surat 1 bo'lsa, 12 l allaqachon bitta ulush. Faqat maxrajga ko'paytiriladi.", 'Верно. Если числитель 1, то 12 л — уже одна доля. Остаётся умножить на знаменатель.', 'Correct. When the numerator is 1, the 12 l is already one share. Only the multiplication is left.'),
          bi("Bo'lish bitta ulushni kichraytiradi. 12 l allaqachon bitta ulush.", 'Деление уменьшит долю. 12 л — это уже одна доля.', 'Dividing would shrink the share. The 12 l is already one share.'),
          bi("Ikki marta bo'lish kerak emas: bitta ulush berilgan.", 'Делить дважды не нужно: одна доля уже дана.', 'There is no need to divide twice: one share is already given.'),
        ],
        feedbackAudio: [
          bi("To'g'ri. Surat bir bo'lsa, o'n ikki litr bitta ulush. Faqat maxrajga ko'paytiramiz.", 'Верно. Если числитель один, двенадцать литров это одна доля. Только умножаем на знаменатель.', 'Correct. When the numerator is one, twelve litres is one share. We only multiply by the denominator.'),
          bi("Bo'lish ulushni kichraytiradi, bizga esa butun kerak.", 'Деление уменьшит долю, а нам нужно целое.', 'Dividing shrinks the share and we need the whole.'),
          bi("Ikki marta bo'lish shart emas: bitta ulush berilgan.", 'Делить дважды не нужно: одна доля уже дана.', 'There is no need to divide twice: one share is given.'),
        ],
        proof: bi('12 · 6 = 72 l', '12 · 6 = 72 л', '12 · 6 = 72 l'),
      },
      {
        question: bi('Butun 210. 2/7 qismini topish uchun birinchi amal?', 'Целое 210. Какое первое действие, чтобы найти две седьмых?', 'The whole is 210. What is the first operation to find two sevenths?'),
        options: [
          bi('210 : 7', '210 : 7', '210 : 7'),
          bi('210 : 2', '210 : 2', '210 : 2'),
          bi('210 · 2', '210 · 2', '210 · 2'),
        ],
        correctIndex: 0,
        feedback: [
          bi("To'g'ri. Butun ma'lum, shuning uchun maxrajga bo'linadi: 210 : 7 = 30.", 'Верно. Целое известно, поэтому делят на знаменатель: 210 : 7 = 30.', 'Correct. The whole is known, so we divide by the denominator: 210 : 7 = 30.'),
          bi("Suratga bo'lish butun noma'lum bo'lganda kerak edi. Bu yerda butun berilgan.", 'Делить на числитель нужно, когда целое неизвестно. Здесь целое дано.', 'Dividing by the numerator is for an unknown whole. Here the whole is given.'),
          bi("Butunni ko'paytirsak, javob butundan katta chiqadi.", 'Если умножить целое, ответ станет больше целого.', 'Multiplying the whole makes the answer larger than the whole.'),
        ],
        feedbackAudio: [
          bi("To'g'ri. Butun ma'lum, shuning uchun maxrajga bo'linadi.", 'Верно. Целое известно, поэтому делят на знаменатель.', 'Correct. The whole is known, so we divide by the denominator.'),
          bi("Suratga bo'lish butun noma'lum bo'lgan masalaga tegishli.", 'Деление на числитель относится к задаче с неизвестным целым.', 'Dividing by the numerator belongs to a task with an unknown whole.'),
          bi("Butunni ko'paytirsak javob butundan katta bo'ladi.", 'Если умножить целое, ответ будет больше целого.', 'Multiplying the whole makes the answer larger than the whole.'),
        ],
        proof: bi('210 : 7 = 30, 30 · 2 = 60', '210 : 7 = 30, 30 · 2 = 60', '210 : 7 = 30, 30 · 2 = 60'),
      },
    ],
    audio: {
      intro: {
        uz: [
          'Uchta savolda birinchi amalni tanlaysiz.',
          "Shartni diqqat bilan o'qing: butun ma'lummi yoki qism ma'lum?",
          "Har savolda bitta to'g'ri javob bor.",
        ],
        ru: [
          'В трёх вопросах выберешь первое действие.',
          'Внимательно читай условие: известно целое или известна часть?',
          'В каждом вопросе один верный ответ.',
        ],
        en: [
          'In three questions you will choose the first operation.',
          'Read the condition carefully: is the whole known or is the part known?',
          'Each question has one correct answer.',
        ],
      },
    },
  },

  s14: {
    eyebrow: bi('Yakuniy topshiriq', 'Итоговое задание', 'Final task'),
    title: bi('Uch holatda butunni tiklang', 'Восстанови целое в трёх случаях', 'Restore the whole in three cases'),
    fact: bi("Ombor daftari to'liq tiklandi: har qatorda butun zaxira yozildi.", 'Складской журнал восстановлен полностью: в каждой строке записан весь запас.', 'The warehouse ledger is fully restored: every row now records the whole store.'),
    items: [
      {
        kind: 'num',
        question: bi('Kitobning 1/6 qismi 14 bet. Kitobda necha bet?', 'Одна шестая книги — 14 страниц. Сколько страниц в книге?', 'One sixth of a book is 14 pages. How many pages does the book have?'),
        answer: 84,
        hint: bi('14 bet bitta ulush. Butunda 6 ta ulush bor.', '14 страниц — одна доля. В целом 6 долей.', '14 pages is one share. The whole has 6 shares.'),
        proof: bi('14 · 6 = 84 bet', '14 · 6 = 84 страницы', '14 · 6 = 84 pages'),
        audio: {
          on_correct: bi("To'g'ri. O'n to'rtni oltiga ko'paytirsak sakson to'rt chiqadi.", 'Верно. Четырнадцать умножить на шесть получится восемьдесят четыре.', 'Correct. Fourteen times six is eighty-four.'),
          on_wrong: bi("O'n to'rt bet bitta ulush. Uni maxrajga ko'paytiring.", 'Четырнадцать страниц это одна доля. Умножь её на знаменатель.', 'Fourteen pages is one share. Multiply it by the denominator.'),
        },
      },
      {
        kind: 'num',
        question: bi('Zaxiraning 3/7 qismi 21 quti. Butun zaxira nechta quti?', 'Три седьмых запаса — 21 коробка. Сколько коробок во всём запасе?', 'Three sevenths of the store is 21 boxes. How many boxes are in the whole store?'),
        answer: 49,
        hint: bi('21 quti uchta ulush. Avval bitta ulushni toping.', '21 коробка — три доли. Сначала найди одну долю.', '21 boxes is three shares. Find one share first.'),
        proof: bi('21 : 3 = 7, 7 · 7 = 49 quti', '21 : 3 = 7, 7 · 7 = 49 коробок', '21 : 3 = 7, 7 · 7 = 49 boxes'),
        audio: {
          on_correct: bi("To'g'ri. Bitta ulush yetti quti, butunda yettita ulush bor.", 'Верно. Одна доля это семь коробок, а в целом семь долей.', 'Correct. One share is seven boxes and the whole has seven shares.'),
          on_wrong: bi("Yigirma bir quti uchta ulush. Avval uchga bo'ling, keyin yettiga ko'paytiring.", 'Двадцать одна коробка это три доли. Сначала раздели на три, потом умножь на семь.', 'Twenty-one boxes is three shares. Divide by three first, then multiply by seven.'),
        },
      },
      {
        kind: 'mc',
        question: bi('5/9 qismi 45 quti. Qaysi yozuv butunni beradi?', 'Пять девятых — 45 коробок. Какая запись даёт целое?', 'Five ninths is 45 boxes. Which record gives the whole?'),
        options: [
          bi('45 : 5 · 9', '45 : 5 · 9', '45 : 5 · 9'),
          bi('45 : 9 · 5', '45 : 9 · 5', '45 : 9 · 5'),
          bi('45 · 9', '45 · 9', '45 · 9'),
        ],
        correctIndex: 0,
        feedback: [
          bi("To'g'ri. 45 : 5 = 9 bitta ulush, 9 · 9 = 81 quti butun zaxira.", 'Верно. 45 : 5 = 9 — одна доля, 9 · 9 = 81 коробка — весь запас.', 'Correct. 45 : 5 = 9 is one share and 9 · 9 = 81 boxes is the whole store.'),
          bi("Bu yozuv butun ma'lum bo'lgan masalaga tegishli. Bu yerda 45 quti - qism.", 'Эта запись — для задачи с известным целым. Здесь 45 коробок — часть.', 'That record belongs to a task with a known whole. Here 45 boxes is the part.'),
          bi("Bo'lishni tashlab ketmang: 45 quti beshta ulush, bitta ulush emas.", 'Не пропускай деление: 45 коробок — это пять долей, а не одна.', 'Do not skip the division: 45 boxes is five shares, not one.'),
        ],
        feedbackAudio: [
          bi("To'g'ri. Qirq beshni beshga bo'lsak to'qqiz, to'qqizni to'qqizga ko'paytirsak sakson bir.", 'Верно. Сорок пять разделить на пять получится девять, а девять умножить на девять получится восемьдесят один.', 'Correct. Forty-five divided by five is nine, and nine times nine is eighty-one.'),
          bi("Bu yozuv butun ma'lum bo'lgan masalaga tegishli.", 'Эта запись относится к задаче с известным целым.', 'That record belongs to a task with a known whole.'),
          bi("Bo'lishni tashlab ketmang: qirq besh quti beshta ulush.", 'Не пропускай деление: сорок пять коробок это пять долей.', 'Do not skip the division: forty-five boxes is five shares.'),
        ],
        proof: bi('45 : 5 = 9, 9 · 9 = 81 quti', '45 : 5 = 9, 9 · 9 = 81 коробка', '45 : 5 = 9, 9 · 9 = 81 boxes'),
        audio: {
          on_correct: bi("To'g'ri yozuv tanlandi.", 'Выбрана верная запись.', 'The right record is chosen.'),
          on_wrong: bi('Yozuvni qaytadan tekshiring.', 'Проверь запись снова.', 'Check the record again.'),
        },
      },
    ],
    audio: {
      intro: {
        uz: [
          'Yakuniy topshiriqda uch holat bor.',
          'Ikkitasida javobni terib yozasiz, uchinchisida yozuvni tanlaysiz.',
          'Har javobdan keyin tekshirish yozuvi chiqadi.',
        ],
        ru: [
          'В итоговом задании три случая.',
          'В двух наберёшь ответ, в третьем выберешь запись.',
          'После каждого ответа появится проверка.',
        ],
        en: [
          'The final task has three cases.',
          'In two of them you enter the answer, in the third you choose the record.',
          'A check appears after every answer.',
        ],
      },
    },
  },

  s15: {
    eyebrow: bi('Missiya mukofoti', 'Награда миссии', 'Mission reward'),
    title: bi('Unvongacha bitta savol', 'Один вопрос до звания', 'One question before your title'),
    lead: bi("Butunni tiklash tartibini ko'rsating.", 'Покажи порядок восстановления целого.', 'Show the order for restoring the whole.'),
    question: bi("Butun so'ralganda birinchi amal qanday bo'ladi?", 'Какое действие первое, когда спрашивают целое?', 'Which operation comes first when the whole is asked?'),
    stem: bi('Butunni tiklashda men...', 'Восстанавливая целое, я...', 'To restore the whole, I...'),
    options: [
      bi("ma'lum qismni suratga bo'laman", 'делю известную часть на числитель', 'divide the known part by the numerator'),
      bi("ma'lum qismni maxrajga ko'paytiraman", 'умножаю известную часть на знаменатель', 'multiply the known part by the denominator'),
      bi("ma'lum qismni maxrajga bo'laman", 'делю известную часть на знаменатель', 'divide the known part by the denominator'),
    ],
    correctIndex: 0,
    feedback: [
      bi("To'g'ri. Suratga bo'lsak bitta ulush topiladi, keyin uni maxrajga ko'paytiramiz.", 'Верно. Деление на числитель даёт одну долю, потом умножаем её на знаменатель.', 'Correct. Dividing by the numerator gives one share, then we multiply it by the denominator.'),
      bi('Bit shunday qilgan edi: qism bitta ulush emas, shuning uchun javob katta chiqadi.', 'Так поступил Бит: часть — это не одна доля, поэтому ответ выходит больше.', 'That is what Bit did: the part is not one share, so the answer comes out too large.'),
      bi("Maxrajga bo'lish butun ma'lum bo'lgan darsda kerak edi.", 'Делить на знаменатель нужно было в уроке с известным целым.', 'Dividing by the denominator belonged to the lesson with a known whole.'),
    ],
    feedbackAudio: [
      bi("To'g'ri. Suratga bo'lsak bitta ulush topiladi, keyin maxrajga ko'paytiriladi.", 'Верно. Деление на числитель даёт одну долю, потом умножают на знаменатель.', 'Correct. Dividing by the numerator gives one share, then we multiply by the denominator.'),
      bi('Qism bitta ulush emas, shuning uchun javob katta chiqadi.', 'Часть это не одна доля, поэтому ответ выходит больше.', 'The part is not one share, so the answer comes out too large.'),
      bi("Maxrajga bo'lish butun ma'lum bo'lganda kerak edi.", 'Делить на знаменатель нужно было, когда целое известно.', 'Dividing by the denominator was for a known whole.'),
    ],
    resolution: bi("Avval suratga bo'lib bitta ulushni topamiz, keyin uni maxrajga ko'paytiramiz.", 'Сначала делением на числитель находим одну долю, потом умножаем её на знаменатель.', 'First we divide by the numerator to find one share, then we multiply it by the denominator.'),
    proof: bi('78 : 3 · 4 = 104', '78 : 3 · 4 = 104', '78 : 3 · 4 = 104'),
    rulesLabel: bi('Qoida', 'Правило', 'Rule'),
    rules: [
      bi("Ma'lum qism nechta ulush ekanini surat aytadi.", 'Числитель говорит, сколько долей в известной части.', 'The numerator says how many shares the known part covers.'),
      bi("Avval suratga bo'linadi: bitta ulush topiladi.", 'Сначала делят на числитель: находят одну долю.', 'First divide by the numerator: that gives one share.'),
      bi("Keyin ulush maxrajga ko'paytiriladi va butun chiqadi.", 'Затем долю умножают на знаменатель и получают целое.', 'Then the share is multiplied by the denominator and the whole appears.'),
    ],
    award: bi('Ombor hisobchisi', 'Учётчик склада', 'Warehouse auditor'),
    audio: {
      intro: {
        uz: [
          'Ombor daftari tiklandi. Missiya bajarildi.',
          "Butunni topish uchun ma'lum qism suratga bo'linadi va bitta ulush topiladi.",
          "Keyin ulush maxrajga ko'paytiriladi. Butun esa har doim qismdan katta bo'ladi.",
          "Keyingi darsda maxraji o'n, yuz va ming bo'lgan kasrlarni vergul bilan yozishni o'rganamiz.",
          'Unvongacha bitta savol qoldi. Usulni tanlang.',
        ],
        ru: [
          'Складской журнал восстановлен. Миссия выполнена.',
          'Чтобы найти целое, известную часть делят на числитель и находят одну долю.',
          'Затем долю умножают на знаменатель. А целое всегда больше части.',
          'На следующем уроке научимся записывать дроби со знаменателями десять, сто и тысяча через запятую.',
          'До звания остался один вопрос. Выбери способ.',
        ],
        en: [
          'The warehouse ledger is restored. The mission is complete.',
          'To find the whole, the known part is divided by the numerator and one share appears.',
          'Then the share is multiplied by the denominator. And the whole is always larger than the part.',
          'In the next lesson we will learn to write fractions with denominators ten, one hundred and one thousand using a comma.',
          'One question is left before your title. Choose the method.',
        ],
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Navigatsiya gate. Qiymat src/components/grade4/theoryNavigation.js dagi
// GRADE4_THEORY_CONTINUE_UNLOCKED bilan bir xil ushlanadi: dars LMS uchun
// bitta fayl bo'lishi kerak, shuning uchun helper ichkarida turadi.
// true - ko'rib chiqish rejimi: "Davom etish" har ekranda ochiq.
// false - o'quv rejimi: tugma faqat mazmunli harakatdan keyin ochiladi.
// ---------------------------------------------------------------------------
const GRADE4_THEORY_CONTINUE_UNLOCKED = true;
function canUseGrade4TheoryContinue(gatePassed, finish = false) {
  return (!finish && GRADE4_THEORY_CONTINUE_UNLOCKED) || Boolean(gatePassed);
}

// ---------------------------------------------------------------------------
// Mobil masshtab qatlami (ETALON_4SINF §10). <640px da layout 390px etalon
// kenglikda qoladi va real ekranga eng kichik masshtab bilan sig'adi, shuning
// uchun barcha telefonlarda bir xil ko'rinish chiqadi. Hook dars ichida turadi:
// LMS uchun dars bitta fayl bo'lishi kerak.
// ---------------------------------------------------------------------------
const GRADE4_MOBILE_DESIGN_W = 390;
const GRADE4_MOBILE_DESIGN_H = 760;
const GRADE4_MOBILE_BREAKPOINT = 640;
function useGrade4MobileZoom({
  designWidth = GRADE4_MOBILE_DESIGN_W,
  designHeight = GRADE4_MOBILE_DESIGN_H,
  breakpoint = GRADE4_MOBILE_BREAKPOINT,
  fitHeight = true,
} = {}) {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const root = document.documentElement;
    const update = () => {
      const widthScale = window.innerWidth / designWidth;
      const heightScale = window.innerHeight / designHeight;
      const zoom = window.innerWidth < breakpoint
        ? (fitHeight ? Math.min(widthScale, heightScale, 1) : widthScale)
        : 1;
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
  }, [breakpoint, designHeight, designWidth, fitHeight]);
}

let runtimeConfig = { ttsApiBase: '', voiceGender: 'f', correctSoundUrl: '', wrongSoundUrl: '', previewMode: false };
const configureLesson = (next) => { runtimeConfig = { ...runtimeConfig, ...next }; };
const SUPPORTED_LANGS = ['uz', 'ru', 'en'];
const SPEECH_LOCALES = { uz: 'uz-UZ', ru: 'ru-RU', en: 'en-GB' };
const LANGUAGE_LABELS = { uz: 'Til', ru: 'Язык', en: 'Language' };
const normalizeLang = (value) => SUPPORTED_LANGS.includes(value) ? value : 'uz';
const LangContext = createContext('uz');
const useLang = () => useContext(LangContext);
const useT = () => {
  const lang = useLang();
  return useCallback((value) => {
    if (value == null) return '';
    if (React.isValidElement(value)) return value;
    if (typeof value === 'string' || typeof value === 'number') return String(value);
    return value[lang] ?? '';
  }, [lang]);
};

function useIsMobile(breakpoint = 640) {
  const [mobile, setMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < breakpoint : false);
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const update = () => setMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [breakpoint]);
  return mobile;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, []);
  return reduced;
}

const buildTtsUrl = (base, text, gender) => base + '/api/tts?text=' + encodeURIComponent(String(text).slice(0, 1000)) + '&g=' + (gender === 'm' ? 'm' : 'f');

const visualBeatMs = (text) => {
  const words = String(text ?? '').trim().split(/\s+/).filter(Boolean).length;
  return Math.min(9000, Math.max(2600, 900 + words * 320));
};

class AudioEngine {
  constructor() { this.queue = []; this.index = 0; this.audio = null; this.previewUtterance = null; this.timer = null; this.lang = 'uz'; this.muted = false; this.listener = null; }
  emit(extra = {}) { this.listener?.({ muted: this.muted, ...extra }); }
  setLang(lang) { this.lang = lang; }
  stop() {
    if (this.timer && typeof window !== 'undefined') window.clearTimeout(this.timer);
    this.timer = null;
    if (this.audio) { this.audio.pause(); this.audio.onended = null; this.audio.onerror = null; }
    if (this.previewUtterance) { this.previewUtterance.onstart = null; this.previewUtterance.onend = null; this.previewUtterance.onerror = null; this.previewUtterance = null; }
    if (typeof window !== 'undefined' && window.speechSynthesis) { try { window.speechSynthesis.cancel(); } catch { /* preview only */ } }
  }
  load(queue) { this.stop(); this.queue = queue || []; this.index = 0; this.emit({ completed: false, currentSegment: null }); }
  start() { this.play(); }
  timed(item, duration = null) {
    if (this.timer) window.clearTimeout(this.timer);
    if (this.audio) { this.audio.onended = null; this.audio.onerror = null; }
    this.emit({ isPlaying: false, completed: false, currentSegment: item.id, visualOnly: true });
    this.timer = window.setTimeout(() => { this.index += 1; this.play(); }, duration ?? visualBeatMs(item.text));
  }
  play() {
    const item = this.queue[this.index];
    if (!item) { this.emit({ isPlaying: false, completed: true, currentSegment: null, visualOnly: this.muted || !runtimeConfig.ttsApiBase }); return; }
    if (this.muted || !runtimeConfig.ttsApiBase) {
      if (!this.muted && runtimeConfig.previewMode && typeof window !== 'undefined' && window.speechSynthesis) {
        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(String(item.text));
          utterance.lang = SPEECH_LOCALES[this.lang] ?? SPEECH_LOCALES.uz;
          utterance.rate = 0.94;
          utterance.onstart = () => this.emit({ isPlaying: true, completed: false, currentSegment: item.id, visualOnly: false });
          utterance.onend = () => { this.emit({ isPlaying: false, currentSegment: null }); this.index += 1; this.play(); };
          utterance.onerror = () => this.timed(item);
          this.previewUtterance = utterance;
          this.timer = window.setTimeout(() => { try { window.speechSynthesis.speak(utterance); } catch { this.timed(item); } }, 50);
          return;
        } catch { /* deterministic timer fallback */ }
      }
      this.timed(item);
      return;
    }
    if (!this.audio) { this.audio = new Audio(); this.audio.crossOrigin = 'anonymous'; }
    this.audio.onended = () => { this.index += 1; this.play(); };
    this.audio.onerror = () => this.timed(item);
    this.audio.src = buildTtsUrl(runtimeConfig.ttsApiBase, item.text, runtimeConfig.voiceGender);
    this.audio.play().then(() => this.emit({ isPlaying: true, completed: false, currentSegment: item.id, visualOnly: false })).catch(() => this.timed(item));
  }
  toggleMute() { this.muted = !this.muted; this.stop(); this.index = 0; this.emit({ muted: this.muted }); this.start(); }
  pushOneOff(text) { this.load([{ id: 'feedback-' + Date.now(), text }]); this.start(); }
}

let audioEngineInstance = null;
const getAudioEngine = () => {
  if (typeof window === 'undefined') return null;
  if (!audioEngineInstance) audioEngineInstance = new AudioEngine();
  return audioEngineInstance;
};

function useAudio(segments) {
  const lang = useLang();
  const [state, setState] = useState({ muted: audioEngineInstance?.muted ?? false, completed: false, currentSegment: null, visualOnly: !runtimeConfig.ttsApiBase });
  /* eslint-disable react-hooks/refs -- stable audio queue */
  const segmentsRef = useRef(segments);
  const segmentsKey = JSON.stringify(segments || []);
  const prevKeyRef = useRef(segmentsKey);
  if (prevKeyRef.current !== segmentsKey) { segmentsRef.current = segments; prevKeyRef.current = segmentsKey; }
  const stableSegments = segmentsRef.current;
  /* eslint-enable react-hooks/refs */
  useEffect(() => {
    const engine = getAudioEngine();
    if (!engine) return undefined;
    engine.setLang(lang);
    engine.listener = (next) => setState((previous) => ({ ...previous, ...next }));
    engine.load(stableSegments);
    const timer = window.setTimeout(() => engine.start(), 220);
    return () => { window.clearTimeout(timer); engine.stop(); engine.listener = null; };
  }, [lang, stableSegments]);
  return {
    ...state,
    replay: () => { const engine = getAudioEngine(); engine?.load(stableSegments); engine?.start(); },
    toggleMute: () => getAudioEngine()?.toggleMute(),
    pushOneOff: (text) => getAudioEngine()?.pushOneOff(text),
  };
}

function useNarration(value, screen) {
  const lang = useLang();
  const reduced = usePrefersReducedMotion();
  const segments = useMemo(() => {
    const source = value?.intro ?? value;
    const texts = source?.[lang] ?? [];
    return (Array.isArray(texts) ? texts : [texts]).filter(Boolean).map((text, index) => ({ id: 's' + screen + '-beat-' + index, text }));
  }, [lang, screen, value]);
  const audio = useAudio(segments);
  const active = segments.findIndex((segment) => segment.id === audio.currentSegment);
  const finalFrame = Math.max(0, FRAME_COUNTS[screen] - 1);
  const feedbackPlaying = audio.currentSegment?.startsWith('feedback-') === true;
  // Ovoz o'chirilgan bo'lsa kadr darhol oxirgi holatga o'tadi. Aks holda bola
  // ovozsiz rejimda ekrandagi matnni ko'rmay qolardi: kadr jimjit taymer bilan
  // sekin surilardi (2026-08-19 da topilgan nuqson).
  const frame = reduced || audio.muted || feedbackPlaying || audio.completed ? finalFrame : active >= 0 ? active : 0;
  return { ...audio, frame, caption: active >= 0 ? segments[active].text : '' };
}

const playSfx = (kind) => {
  const url = kind === 'correct' ? runtimeConfig.correctSoundUrl : runtimeConfig.wrongSoundUrl;
  if (!url || typeof window === 'undefined') return;
  try { new Audio(url).play().catch(() => {}); } catch { /* optional */ }
};
const BitSVG = ({ state = 'present', className = '' }) => {
  const isWave = state === 'wave';
  const isHappy = state === 'happy' || isWave || state === 'idea' || state === 'nod';
  const isThinking = state === 'hint' || state === 'think';
  const isAwkward = state === 'awkward';

  return (
  <svg className={`g1-char g1-char-bit g1-char-state-${state} ${className}`} viewBox="0 0 120 150" aria-hidden="true">
    <defs>
      <linearGradient id="g421bbody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#E2ECF2" />
        <stop offset="100%" stopColor="#B6C7D2" />
      </linearGradient>
      <linearGradient id="g421bhead" x1="0" y1="0" x2="0" y2="1">
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
    <rect x="34" y="60" width="52" height="62" rx="18" fill="url(#g421bbody)" stroke="#A9BCC8" strokeWidth="2" />
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
    <rect x="28" y="28" width="64" height="46" rx="16" fill="url(#g421bhead)" stroke="#A9BCC8" strokeWidth="2" />
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
const AudioIndicator = ({ audio }) => {
  const lang = useLang();
  const labels = {
    uz: { unmute: "Ovozni yoqish", mute: "Ovozni o'chirish", replay: 'Qayta eshitish' },
    ru: { unmute: 'Включить звук', mute: 'Выключить звук', replay: 'Повторить' },
    en: { unmute: 'Turn sound on', mute: 'Turn sound off', replay: 'Replay' },
  }[lang];
  const muteLabel = audio.muted
    ? labels.unmute
    : labels.mute;
  const replayLabel = labels.replay;
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

const ScreenTypeLabel = ({ type }) => {
  const lang = useLang();
  const labels = {
    uz: { hook: 'Missiya', diagnostic: 'Diagnostika', model: 'Model', exploration: 'Tadqiqot', discovery: 'Kashfiyot', rule: 'Qoida', strategy: 'Strategiya', consolidation: 'Mustahkamlash', practice: 'Mashq', test: 'Tekshiruv', error: 'Xato tahlili', matching: 'Moslashtirish', case: 'Vazifa', summary: 'Yakun' },
    ru: { hook: 'Миссия', diagnostic: 'Диагностика', model: 'Модель', exploration: 'Исследование', discovery: 'Открытие', rule: 'Правило', strategy: 'Стратегия', consolidation: 'Закрепление', practice: 'Практика', test: 'Проверка', error: 'Разбор ошибки', matching: 'Сопоставление', case: 'Задача', summary: 'Итог' },
    en: { hook: 'Mission', diagnostic: 'Diagnostic', model: 'Model', exploration: 'Exploration', discovery: 'Discovery', rule: 'Rule', strategy: 'Strategy', consolidation: 'Consolidation', practice: 'Practice', test: 'Check', error: 'Error analysis', matching: 'Matching', case: 'Problem', summary: 'Summary' },
  }[lang];
  return <span className="screen-type">{labels[type] ?? type}</span>;
};

const FeedbackBlock = ({ show, correct, children, proof = null }) => {
  const t = useT();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!show) { const frameId = requestAnimationFrame(() => setOpen(false)); return () => cancelAnimationFrame(frameId); }
    let second = 0;
    const first = requestAnimationFrame(() => { second = requestAnimationFrame(() => setOpen(true)); });
    return () => { cancelAnimationFrame(first); cancelAnimationFrame(second); };
  }, [show]);
  // Javob berilmagan holatda blok BO'SH chiziladi: ilgari u Bit rasmi bilan
  // to'liq chizilib, min-height 76px orqali savol ramkasi ichida 75 px
  // ko'rinmas oq joy band qilardi (metodist qarori 2026-08-21). Uslub
  // grade4LayoutFixStyles.js da — kitdagi xatti-harakat bilan bir xil.
  if (!show) return <div className="feedback feedback-slot feedback-empty" aria-hidden="true"/>;
  return <div data-g4-role={correct ? 'feedback-frame bit-answer-comment' : 'feedback-frame'} data-g4-feedback={correct ? 'solution' : 'wrong'} role="status" className={`feedback feedback-slot ${correct ? 'correct' : 'wrong'} ${open ? 'open' : ''}`}><span className="feedback-bit" data-g4-role="feedback-bit"><BitSVG state={correct ? 'nod' : 'awkward'}/></span><p data-g4-role={correct ? 'bit-answer-comment' : undefined}>{correct && <b className="proof-label">{t({ uz: 'YECHIM', ru: 'РЕШЕНИЕ', en: 'SOLUTION' })}</b>}<span>{children}</span>{proof && <strong className="feedback-proof">{proof}</strong>}</p></div>;
};

const Stage = ({ screen, audio, onPrev, onNext, nextDisabled: originalNextDisabled = false, finish = false, children }) => {
  const originalGatePassed = !originalNextDisabled && Boolean(onNext);
  const nextDisabled = !canUseGrade4TheoryContinue(originalGatePassed, finish);
  const t = useT(); const mobile = useIsMobile(); const pad = mobile ? 14 : 48; const c = CONTENT[`s${screen}`]; const meta = SCREEN_META[screen];
  return <main className={`stage stage-${meta.type}`}><header className="stage-header" style={{ paddingLeft: pad, paddingRight: pad }}><div className="progress-track" role="progressbar" aria-valuemin={1} aria-valuemax={TOTAL_SCREENS} aria-valuenow={screen + 1} aria-label={`${screen + 1} / ${TOTAL_SCREENS}`}><div className="progress-fill progress-bar" style={{ width: `${(screen + 1) / TOTAL_SCREENS * 100}%` }}/></div><div className="stage-chrome"><div className="chrome-title"><span className="status-dot"/><span>{t(c.eyebrow)}</span></div><div className="chrome-actions"><ScreenTypeLabel type={meta.type}/>{audio && <AudioIndicator audio={audio}/>}<span className="screen-count">{String(screen + 1).padStart(2, '0')} / {TOTAL_SCREENS}</span></div></div></header><section className="stage-content" style={{ paddingLeft: pad, paddingRight: pad }}>{children}</section><footer className="stage-nav" style={{ paddingLeft: pad, paddingRight: pad }}>{screen === 0 ? <span/> : <button type="button" className="btn-ghost" onClick={onPrev}>← {t({ uz: "Orqaga", ru: 'Назад', en: 'Back' })}</button>}<button type="button" className="btn-white-accent" disabled={nextDisabled || !onNext} onClick={onNext}>{finish ? t({ uz: "Darsni yakunlash", ru: 'Завершить урок', en: 'Finish lesson' }) : t({ uz: "Davom etish", ru: 'Продолжить', en: 'Continue' })} →</button></footer></main>;
};

// Javob izohi bu yerda EMAS: darsning boshqa hamma topshiriq ekranida javobdan
// keyin standart YECHIM ramkasi (FeedbackBlock) chiqadi, bu widgetda esa faqat
// ingichka bir qator matn chiqardi (metodist qarori 2026-08-21). Endi izohni
// chaqiruvchi ekran FeedbackBlock ichida ko'rsatadi.
const InlineCheck = ({ prompt, options, correctIndex, picked, onPick, disabled }) => {
  const t = useT();
  const done = picked === correctIndex;
  return <div className="inline-check" data-g4-role="inline-check">
    <span className="inline-check-prompt">{t(prompt)}</span>
    <div className="inline-check-row">{options.map((option, index) => <button type="button" key={index} className={'inline-chip' + (picked === index ? (index === correctIndex ? ' is-right' : ' is-bad') : '')} disabled={disabled || done} onClick={() => onPick(index)}>{t(option)}</button>)}</div>
  </div>;
};

const FactCard = ({ show, text }) => {
  const t = useT();
  return <div className={'fact-card ' + (show ? 'show' : '')} data-g4-role="fact-card"><b>{t({ uz: 'FAKT', ru: 'ФАКТ', en: 'FACT' })}</b><p>{t(text)}</p></div>;
};

// Kicker doim dars mavzusini ko'rsatadi: ilgari u Stage yuqorisidagi yorliqni
// so'zma-so'z takrorlar edi va ekranda bir xil matn ikki marta turardi.
const Heading = ({ c, bit, hook = false, kicker = null }) => { const t = useT(); return <div className="heading"><div><span data-g4-role={hook ? 'hook-topic' : undefined}>{t(kicker ?? TOPIC_KICKER)}</span><h1 data-g4-role={hook ? 'hook-title' : undefined}>{t(c.title)}</h1></div>{bit && !hook && <BitSVG state={bit}/>}</div>; };
const FRAC_ARIA = {
  uz: (n, d) => `kasr ${d} dan ${n}`,
  ru: (n, d) => `дробь ${n} / ${d}`,
  en: (n, d) => `fraction ${n} / ${d}`,
};
const Frac = ({ n, d, size = 'sm' }) => {
  const lang = useLang();
  return <span className={'frac ' + (size === 'lg' ? 'frac-lg' : '')} role="math" aria-label={(FRAC_ARIA[lang] ?? FRAC_ARIA.uz)(n, d)}><span aria-hidden="true">{n}</span><i aria-hidden="true"/><span aria-hidden="true">{d}</span></span>;
};
// flashKey - HOZIR qizarib turgan xato variant (indeks yoki null). Xato
// javob doimiy qizil qolmaydi: qisqa vaqt qizaradi, so'ng neytral holatiga
// qaytadi va bola aynan o'sha variantni yana tanlashi mumkin. Variantlarni
// faqat TO'G'RI javob qulflaydi (metodist qarori 2026-08-21,
// wrongAnswerFlash.js). Qulflangach to'g'risi yashil, qolganlari xiralashadi.
const Options = ({ values, picked, onPick, correctIndex, solved, neutral = false, disabled = false, order = null, flashKey = null }) => {
  const t = useT();
  const sourceOrder = order ?? values.map((_, index) => index);
  return <div className="options">{sourceOrder.map((sourceIndex, displayIndex) => { const value = values[sourceIndex]; const flashing = !neutral && flashKey === sourceIndex; return <button type="button" data-g4-role="answer-card" data-g4-source-index={order ? sourceIndex : undefined} data-g4-correct={order ? (sourceIndex === correctIndex ? 'true' : 'false') : undefined} data-g4-wrong-flash={flashing ? 'true' : undefined} data-g4-answer-dim={!neutral && solved && sourceIndex !== correctIndex ? 'true' : undefined} key={sourceIndex + '-' + t(value)} className={'option ' + ((neutral ? picked === sourceIndex : solved && picked === sourceIndex) ? 'picked ' : '') + (!neutral && solved && sourceIndex === correctIndex ? 'right ' : '')} disabled={disabled || (!neutral && solved) || (!neutral && flashKey !== null)} onClick={() => onPick(sourceIndex)}><b>{String.fromCharCode(65 + displayIndex)}</b><span>{t(value)}</span></button>; })}</div>;
};


const readPoint = (element, board, side) => {
  const box = element.getBoundingClientRect();
  const host = board.getBoundingClientRect();
  return {
    x: side === 'left' ? box.right - host.left : box.left - host.left,
    y: box.top + box.height / 2 - host.top,
  };
};

function MatchingLines({ boardRef, pairs = [], wrongPair = null, localeKey = 'uz' }) {
  const [geometry, setGeometry] = useState({ width: 0, height: 0, lines: [] });

  useLayoutEffect(() => {
    const board = boardRef.current;
    if (!board) return undefined;

    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const host = board.getBoundingClientRect();
        const allPairs = wrongPair ? [...pairs, { ...wrongPair, wrong: true }] : pairs;
        const lines = allPairs.map((pair) => {
          const left = board.querySelector(`[data-match-left="${pair.left}"]`);
          const right = board.querySelector(`[data-match-right="${pair.right}"]`);
          if (!left || !right) return null;
          return { from: readPoint(left, board, 'left'), to: readPoint(right, board, 'right'), wrong: pair.wrong };
        }).filter(Boolean);
        setGeometry({ width: host.width, height: host.height, lines });
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(board);
    board.querySelectorAll('[data-match-left],[data-match-right]').forEach((node) => observer.observe(node));
    window.addEventListener('resize', measure);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [boardRef, pairs, wrongPair, localeKey]);

  return (
    <svg
      className="matching-connectors"
      width={geometry.width}
      height={geometry.height}
      viewBox={`0 0 ${geometry.width || 1} ${geometry.height || 1}`}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, zIndex: 1, overflow: 'visible', pointerEvents: 'none' }}
    >
      {geometry.lines.map((line, index) => {
        const bend = Math.max(24, (line.to.x - line.from.x) * 0.42);
        const path = `M ${line.from.x} ${line.from.y} C ${line.from.x + bend} ${line.from.y}, ${line.to.x - bend} ${line.to.y}, ${line.to.x} ${line.to.y}`;
        return (
          <path
            key={`${path}-${index}`}
            className={line.wrong ? 'matching-connector-wrong' : 'matching-connector-correct'}
            d={path}
            fill="none"
            stroke={line.wrong ? '#B85C32' : '#227A53'}
            strokeWidth="4"
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 2px 3px ${line.wrong ? 'rgba(184,92,50,.28)' : 'rgba(34,122,83,.28)'})`, transition: 'd .55s ease, stroke .55s ease' }}
          />
        );
      })}
    </svg>
  );
}


// ---------------------------------------------------------------------------
// QADAMLI OCHILISH. Tushuntirish ovoz bilan o'zi surilmaydi: bola tugmani
// bosadi, qadam ochiladi va aynan shu qadam ovozlanadi. Ovoz o'chirilganda
// ham butun tushuntirish ko'rinadi - kadr yo'qolib qolmaydi.
// ---------------------------------------------------------------------------
function useStepReveal(content, screen, total) {
  const lang = useLang();
  const audio = useNarration(content.audio, screen);
  const [step, setStep] = useState(0);
  const ready = audio.muted || audio.completed;
  const advance = () => {
    if (!ready || step >= total) return;
    const next = step + 1;
    setStep(next);
    const spoken = content.audio.steps?.[lang]?.[next - 1];
    if (spoken) audio.pushOneOff(spoken);
  };
  return { audio, step, advance, ready, done: step >= total };
}

// Ochilgan qadamlar tepada ixcham chip bo'lib yig'iladi, faol qadamning izohi
// to'liq ko'rinadi. Shu tufayli ekranda ko'p tushuntirish sig'adi va skroll
// paydo bo'lmaydi.
const StepPanel = ({ steps, step, children, done, doneText, onAdvance, ready }) => {
  const t = useT();
  const active = step > 0 ? steps[step - 1] : null;
  return (
    <section className="step-panel" data-g4-role="visual-frame">
      <div className="step-model">{children}</div>
      <div className="step-chips">
        {steps.map((item, index) => (
          <span key={index} className={'step-chip' + (index < step ? ' is-done' : '') + (index === step - 1 ? ' is-active' : '')}>
            <b aria-hidden="true">{index < step ? '✓' : index + 1}</b>
            <span>{t(item.chip)}</span>
          </span>
        ))}
      </div>
      <p className="step-caption" role="status" aria-live="polite">{active ? t(active.caption) : ''}</p>
      <div className="step-actions">
        {!done && (
          <button type="button" className="btn-step" disabled={!ready} onClick={onAdvance}>
            {t(step === 0
              ? { uz: 'Boshlash', ru: 'Начать', en: 'Start' }
              : { uz: 'Keyingi qadam', ru: 'Следующий шаг', en: 'Next step' })}
          </button>
        )}
        {done && <span className="step-done">{t(doneText)}</span>}
      </div>
    </section>
  );
};


// Yozuvning qadamlab yig'ilishi: har qadam alohida chipda.
const RecordSteps = ({ lines }) => {
  const t = useT();
  return (
    <div className="record-steps">
      {lines.map((line, index) => (
        <span key={index} className="record-step mono">{t(line)}</span>
      ))}
    </div>
  );
};


// Klaviatura yo'q: son raqam plitalarini bosib teriladi, keyin tekshiriladi.
const TapNumPad = ({ value, onDigit, onBack, onCheck, disabled, state, unit = '' }) => {
  const t = useT();
  return (
    <div className="tap-pad">
      <div className={'tap-display mono' + (state ? ' is-' + state : '')} role="status" aria-live="polite">
        <span>{value === '' ? '?' : value}</span>
        {unit && <small>{t(unit)}</small>}
      </div>
      <div className="tap-keys" role="group" aria-label={t({ uz: 'Raqamlar', ru: 'Цифры', en: 'Digits' })}>
        {Array.from({ length: 10 }, (_, digit) => (
          <button type="button" key={digit} className="tap-key" disabled={disabled} onClick={() => onDigit(String(digit))}>{digit}</button>
        ))}
        <button type="button" className="tap-key tap-back" disabled={disabled} onClick={onBack} aria-label={t({ uz: 'Oxirgi raqamni olib tashlash', ru: 'Удалить последнюю цифру', en: 'Delete the last digit' })}>&larr;</button>
        <button type="button" className="tap-key tap-check" disabled={disabled || value === ''} onClick={onCheck}>
          {t({ uz: 'Tekshirish', ru: 'Проверить', en: 'Check' })}
        </button>
      </div>
    </div>
  );
};

// Raqam terish ekranlari uchun umumiy tana (s3, s5, s12 va yakuniy topshiriqlar).
function useTapAnswer({ screen, answer, onAnswer, question, ready, audio, correctAudio, wrongAudio, storedAnswer }) {
  const t = useT();
  const [value, setValue] = useState('');
  const [state, setState] = useState(null);
  const [solved, setSolved] = useState(storedAnswer?.correct === true);
  const attempts = useRef(storedAnswer?.attempts ?? 0);
  const clean = useRef(storedAnswer?.firstTry ?? true);
  const push = (digit) => { if (!ready || solved || value.length >= 4) return; setState(null); setValue((previous) => previous + digit); };
  const back = () => { if (!ready || solved) return; setState(null); setValue((previous) => previous.slice(0, -1)); };
  const check = () => {
    if (!ready || solved || value === '') return;
    attempts.current += 1;
    const ok = Number(value) === answer;
    if (!ok) clean.current = false;
    setState(ok ? 'ok' : 'bad');
    setSolved(ok);
    playSfx(ok ? 'correct' : 'wrong');
    audio.pushOneOff(t(ok ? correctAudio : wrongAudio));
    if (!ok) setTimeout(() => { setValue(''); setState(null); }, 1400);
    onAnswer({
      screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(question),
      options: [], correctIndex: answer, correctAnswer: String(answer),
      studentAnswerIndex: null, studentAnswer: value,
      correct: ok, firstTry: ok && clean.current && attempts.current === 1,
      attempts: attempts.current, solved: ok,
    });
  };
  return { value: solved ? String(answer) : value, state, solved, push, back, check };
}


// ---------------------------------------------------------------------------
// DARSNING IMZO MODELI. 22-darsda butun ma'lum edi va ulushlar yonardi; bu
// darsda teskarisi: daftarda qolgan qism to'q rangda, noma'lum ulushlar esa
// uzuq chiziqli bo'sh joy. Shu tufayli bola butunning yo'qligini ko'z bilan
// ko'radi.
// ---------------------------------------------------------------------------
const PartWholeBar = ({ parts = 5, known = 3, knownLabel = null, oneValue = null, wholeValue = null, unitLabel = '', compact = false, spent = false }) => {
  const t = useT();
  return (
    <div className={'pwbar' + (compact ? ' compact' : '')}>
      <div className="pwbar-track" style={{ gridTemplateColumns: 'repeat(' + parts + ', 1fr)' }}>
        {Array.from({ length: parts }, (_, index) => (
          <i key={index} className={'pwbar-cell' + (index < known ? (spent ? ' is-spent' : ' is-known') : ' is-unknown')} />
        ))}
      </div>
      <div className="pwbar-legend">
        <span className="pwbar-known mono">{knownLabel ? t(knownLabel) : ''}</span>
        <span className="pwbar-whole mono">{wholeValue === null ? '?' : wholeValue}</span>
      </div>
      {oneValue !== null && (
        <span className="pwbar-one">
          <b className="mono">{oneValue}</b>
          <small>{t(unitLabel)}</small>
        </span>
      )}
    </div>
  );
};

// Ombor daftarining bitta qatori: butun ustuni o'chgan, qism ustuni butun.
const LedgerRow = ({ partLabel, wholeLabel = null, faded = true }) => {
  const t = useT();
  return (
    <div className="ledger" data-g4-role="ledger">
      <div className="ledger-cell">
        <small>{t(LEDGER_PART)}</small>
        <b className="mono">{t(partLabel)}</b>
      </div>
      <div className={'ledger-cell' + (faded ? ' is-faded' : '')}>
        <small>{t(LEDGER_TOTAL)}</small>
        <b className="mono">{wholeLabel === null ? '?' : t(wholeLabel)}</b>
      </div>
    </div>
  );
};

// Ulushdan butunni yig'ish: bola bitta ulushni takror qo'shadi va yig'indini
// kuzatadi. Maxrajga yetganda to'xtash kerak - qaror bolaning o'zida.
const ShareBuilder = ({ count, slots, unitValue, unitLabel, onAdd, onBack, onDone, disabled, state }) => {
  const t = useT();
  return (
    <div className="builder">
      <div className="builder-track">
        {Array.from({ length: slots }, (_, index) => (
          <i key={index} className={'builder-cell' + (index < count ? ' is-filled' : '')}>{index < count ? unitValue : ''}</i>
        ))}
      </div>
      <div className={'builder-sum mono' + (state ? ' is-' + state : '')} role="status" aria-live="polite">
        <span>{count === 0 ? '?' : String(count * unitValue)}</span>
        <small>{t(unitLabel)}</small>
      </div>
      <div className="builder-actions">
        <button type="button" className="btn-step" disabled={disabled || count >= slots} onClick={onAdd}>
          {t({ uz: 'Ulush qo\'shish', ru: 'Добавить долю', en: 'Add a share' })}
        </button>
        <button type="button" className="btn-ghost" disabled={disabled || count === 0} onClick={onBack} aria-label={t({ uz: 'Oxirgi ulushni olib tashlash', ru: 'Убрать последнюю долю', en: 'Remove the last share' })}>&larr;</button>
        <button type="button" className="btn-step btn-step-done" disabled={disabled || count === 0} onClick={onDone}>
          {t({ uz: 'Tayyor', ru: 'Готово', en: 'Done' })}
        </button>
      </div>
    </div>
  );
};

const ErrorCard = ({ top, bottom }) => (
  <div className="error-card" data-g4-role="visual-frame">
    <div className="error-record">
      <span className="mono">{top}</span>
      <b className="mono">{bottom}</b>
    </div>
    <span className="error-mark" aria-hidden="true">✗</span>
  </div>
);

// Ikki yo'nalish bitta jadvalda: yuqorida butun ma'lum, pastda butun noma'lum.
const DirectionTable = ({ heads, rows, highlight = 1 }) => {
  const t = useT();
  return (
    <div className="dir-table" role="table">
      <div className="dir-row dir-head" role="row">{heads.map((head, index) => <span key={index} role="columnheader">{t(head)}</span>)}</div>
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className={'dir-row' + (rowIndex === highlight ? ' is-now' : '')} role="row">
          {row.map((cell, index) => <span key={index} className={index === 2 ? 'mono' : ''} role="cell">{t(cell)}</span>)}
        </div>
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------------
// EKRANLAR
// ---------------------------------------------------------------------------

function Screen0({ screen, storedAnswer, onAnswer, onNext }) {
  const t = useT();
  const c = CONTENT.s0;
  const audio = useNarration(c.audio, screen);
  const ready = audio.muted || audio.completed;
  const frame = audio.frame;
  const [picked, setPicked] = useState(storedAnswer?.studentAnswerIndex ?? null);
  const pick = (index) => {
    if (!ready || picked !== null) return;
    setPicked(index);
    audio.pushOneOff(t(c.neutral));
    onAnswer({
      screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question),
      options: c.options.map(t), correctIndex: null, correctAnswer: null,
      studentAnswerIndex: index, studentAnswer: t(c.options[index]),
      correct: true, firstTry: true, attempts: 1, solved: true,
    });
  };
  return (
    <Stage screen={screen} audio={audio} onNext={onNext} nextDisabled={picked === null || !ready}>
      <div className="stack hook-stack" data-g4-screen="hook">
        <Heading c={c} hook />
        <h2 className="hook-question-prompt" data-g4-role="hook-question">{t(c.question)}</h2>
        <section className="hook-scene-adapter" data-g4-role="hook-scene">
          <div className="hook-scene-visual" data-g4-role="visual-frame">
            <section className="hook-model">
              <LedgerRow partLabel={bi('3/5 = 15 quti', '3/5 = 15 коробок', '3/5 = 15 boxes')} />
              <PartWholeBar parts={5} known={frame >= 1 ? 3 : 0} knownLabel={bi('15 quti', '15 коробок', '15 boxes')} compact />
              <div className={'hook-record mono' + (frame >= 2 ? ' show' : '')}>
                15 · 5 = <b>75</b> ?
              </div>
            </section>
            <div className="hook-frame-bit" data-g4-role="hook-bit"><BitSVG state="think" /></div>
          </div>
        </section>
        <section className="question" data-g4-role="answer-card">
          <Options values={c.options} picked={picked} onPick={pick} neutral disabled={!ready || picked !== null} />
          <FeedbackBlock show={picked !== null} correct>{t(c.neutral)}</FeedbackBlock>
        </section>
      </div>
    </Stage>
  );
}

function Screen1({ screen, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s1;
  const audio = useNarration(c.audio, screen);
  const ready = audio.muted || audio.completed;
  const [picked, setPicked] = useState(null);
  const solved = picked === c.correctIndex;
  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!solved || !ready}>
      <div className="stack">
        <Heading c={c} />
        <section className="model-card" data-g4-role="visual-frame">
          <PartWholeBar parts={5} known={3} knownLabel={bi('15 quti', '15 коробок', '15 boxes')} />
          <span className="model-note"><Frac n="3" d="5" size="lg" /></span>
        </section>
        <InlineCheck
          prompt={c.prompt}
          options={c.chips}
          correctIndex={c.correctIndex}
          picked={picked}
          onPick={(index) => { if (ready) setPicked(index); }}
          disabled={!ready}
        />
        <FeedbackBlock show={picked !== null} correct={solved} proof={solved && c.proof ? t(c.proof) : null}>
          {picked === null ? '' : t(solved ? c.note.right : c.note.wrong)}
        </FeedbackBlock>
      </div>
    </Stage>
  );
}

function Screen2({ screen, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s2;
  const { audio, step, advance, ready, done } = useStepReveal(c, screen, 3);
  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!done}>
      <div className="stack">
        <Heading c={c} />
        <p className="lead-line">{t(c.lead)}</p>
        <StepPanel steps={c.steps} step={step} done={done} doneText={c.done} onAdvance={advance} ready={ready}>
          <PartWholeBar
            parts={5}
            known={3}
            knownLabel={bi('15 quti', '15 коробок', '15 boxes')}
            oneValue={step >= 2 ? '5' : null}
            unitLabel={UNIT_BOX}
            wholeValue={step >= 3 ? '25' : null}
          />
        </StepPanel>
      </div>
    </Stage>
  );
}

function Screen3({ screen, storedAnswer, onAnswer, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s3;
  const audio = useNarration(c.audio, screen);
  const ready = audio.muted || audio.completed;
  const [count, setCount] = useState(storedAnswer?.correct === true ? c.target : 0);
  const [state, setState] = useState(storedAnswer?.correct === true ? 'ok' : null);
  const [solved, setSolved] = useState(storedAnswer?.correct === true);
  const attempts = useRef(storedAnswer?.attempts ?? 0);
  const clean = useRef(storedAnswer?.firstTry ?? true);
  const add = () => { if (!ready || solved || count >= c.slots) return; setState(null); setCount((value) => value + 1); };
  const back = () => { if (!ready || solved || count === 0) return; setState(null); setCount((value) => value - 1); };
  const finish = () => {
    if (!ready || solved || count === 0) return;
    attempts.current += 1;
    const ok = count === c.target;
    if (!ok) clean.current = false;
    setState(ok ? 'ok' : 'bad');
    setSolved(ok);
    playSfx(ok ? 'correct' : 'wrong');
    audio.pushOneOff(t(ok ? c.audio.on_correct : c.audio.on_wrong));
    if (!ok) setTimeout(() => { setCount(0); setState(null); }, 1600);
    onAnswer({
      screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question),
      options: [], correctIndex: c.answer, correctAnswer: String(c.answer),
      studentAnswerIndex: null, studentAnswer: String(count * c.unitValue),
      correct: ok, firstTry: ok && clean.current && attempts.current === 1,
      attempts: attempts.current, solved: ok,
    });
  };
  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!solved || !ready}>
      <div className="stack">
        <Heading c={c} />
        <p className="lead-line">{t(c.lead)}</p>
        <section className="model-card" data-g4-role="visual-frame">
          <h2 className="case-question">{t(c.question)}</h2>
          <ShareBuilder
            count={count}
            slots={c.slots}
            unitValue={c.unitValue}
            unitLabel={UNIT_CM}
            onAdd={add}
            onBack={back}
            onDone={finish}
            disabled={!ready || solved}
            state={state}
          />
        </section>
        <FeedbackBlock show={state !== null} correct={solved} proof={solved ? t(c.proof) : null}>
          {solved || state === null ? '' : t(count < c.target ? c.hintShort : c.hintLong)}
        </FeedbackBlock>
      </div>
    </Stage>
  );
}

function Screen4({ screen, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s4;
  const { audio, step, advance, ready, done } = useStepReveal(c, screen, 3);
  const lines = [];
  if (step >= 2) lines.push('78 : 3 = 26');
  if (step >= 3) lines.push('26 · 4 = 104');
  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!done}>
      <div className="stack">
        <Heading c={c} />
        <p className="lead-line">{t(c.lead)}</p>
        <StepPanel steps={c.steps} step={step} done={done} doneText={c.done} onAdvance={advance} ready={ready}>
          <div className="stack-model">
            <PartWholeBar
              parts={4}
              known={3}
              knownLabel={bi('78 bet', '78 страниц', '78 pages')}
              oneValue={step >= 2 ? '26' : null}
              unitLabel={UNIT_PAGE}
              wholeValue={step >= 3 ? '104' : null}
              compact
            />
            {lines.length > 0 && <RecordSteps lines={lines} />}
          </div>
        </StepPanel>
      </div>
    </Stage>
  );
}

function Screen5({ screen, storedAnswer, onAnswer, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s5;
  const audio = useNarration(c.audio, screen);
  const ready = audio.muted || audio.completed;
  const pad = useTapAnswer({
    screen, answer: c.answer, onAnswer, question: c.question, ready, audio,
    correctAudio: c.audio.on_correct, wrongAudio: c.audio.on_wrong, storedAnswer,
  });
  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!pad.solved || !ready}>
      <div className="stack">
        <Heading c={c} />
        <p className="lead-line">{t(c.lead)}</p>
        <section className="model-card" data-g4-role="visual-frame">
          <LedgerRow partLabel={bi('2/5 = 18 quti', '2/5 = 18 коробок', '2/5 = 18 boxes')} wholeLabel={pad.solved ? bi('45 quti', '45 коробок', '45 boxes') : null} faded={!pad.solved} />
          <PartWholeBar parts={c.parts} known={c.known} knownLabel={bi('18 quti', '18 коробок', '18 boxes')} wholeValue={pad.solved ? '45' : null} compact />
        </section>
        <h2 className="case-question">{t(c.question)}</h2>
        <TapNumPad value={pad.value} onDigit={pad.push} onBack={pad.back} onCheck={pad.check} disabled={!ready || pad.solved} state={pad.state} unit={UNIT_BOX} />
        <FeedbackBlock show={pad.state !== null} correct={pad.solved} proof={pad.solved ? t(c.proof) : null}>
          {pad.solved || pad.state === null ? '' : t(c.hint)}
        </FeedbackBlock>
      </div>
    </Stage>
  );
}

function Screen6({ screen, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s6;
  const audio = useNarration(c.audio, screen);
  const ready = audio.muted || audio.completed;
  const [seq, setSeq] = useState([]);
  const [wrong, setWrong] = useState(null);
  const done = seq.length === c.orderKeys.length;
  const tap = (key) => {
    if (!ready || done || seq.includes(key)) return;
    if (key !== c.orderKeys[seq.length]) {
      setWrong(key);
      playSfx('wrong');
      audio.pushOneOff(t(c.audio.on_wrong));
      return;
    }
    const next = [...seq, key];
    setWrong(null);
    setSeq(next);
    playSfx('correct');
    if (next.length === c.orderKeys.length) audio.pushOneOff(t(c.audio.on_correct));
  };
  const record = seq.map((key) => t(c.cards.find((card) => card.key === key).label)).join('  ');
  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!done || !ready}>
      <div className="stack">
        <Heading c={c} />
        <p className="lead-line">{t(c.lead)}</p>
        <section className="model-card" data-g4-role="visual-frame">
          <div className="order-cards">
            {c.cards.map((card) => {
              const place = seq.indexOf(card.key);
              return (
                <button
                  type="button"
                  key={card.key}
                  className={'order-card' + (place >= 0 ? ' is-placed' : '') + (wrong === card.key ? ' is-wrong' : '')}
                  disabled={!ready || done || place >= 0}
                  onClick={() => tap(card.key)}
                >
                  <span className="order-index" aria-hidden="true">{place >= 0 ? place + 1 : ''}</span>
                  <span className="order-label mono">{t(card.label)}</span>
                  <span className="order-caption">{t(card.caption)}</span>
                </button>
              );
            })}
          </div>
          <div className="order-line mono" role="status" aria-live="polite">
            {seq.length === 0 ? '18  ?' : '18  ' + record + (done ? '  = 45' : '')}
          </div>
        </section>
        <FeedbackBlock show={done || wrong !== null} correct={done}>
          {done ? t(c.doneNote) : t(c.wrongNote)}
        </FeedbackBlock>
      </div>
    </Stage>
  );
}

function Screen7({ screen, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s7;
  const audio = useNarration(c.audio, screen);
  const ready = audio.muted || audio.completed;
  const frame = audio.frame;
  const [picked, setPicked] = useState(null);
  const solved = picked === c.check.correctIndex;
  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!solved || !ready}>
      <div className="stack">
        <Heading c={c} />
        <section className="rule-frame">
          <span className="rule-badge">{t({ uz: 'QOIDA', ru: 'ПРАВИЛО', en: 'RULE' })}</span>
          <p className="rule-text show">{t(c.rule)}</p>
          <div className="rule-lines">
            {c.lines.map((line, index) => (
              <span key={index} className={'rule-line' + (frame >= 1 ? ' show' : '')}>{t(line)}</span>
            ))}
          </div>
          <strong className={'rule-formula mono' + (frame >= 2 ? ' show' : '')}>{t(c.formula)}</strong>
          <small className="rule-source">{t(c.ruleSource)}</small>
        </section>
        <DirectionTable heads={c.directions.heads} rows={c.directions.rows} />
        <InlineCheck
          prompt={c.check.prompt}
          options={c.check.chips}
          correctIndex={c.check.correctIndex}
          picked={picked}
          onPick={(index) => { if (ready) setPicked(index); }}
          disabled={!ready}
        />
        <FeedbackBlock show={picked !== null} correct={solved} proof={solved && c.check.proof ? t(c.check.proof) : null}>
          {picked === null ? '' : t(solved ? c.check.note.right : c.check.note.wrong)}
        </FeedbackBlock>
      </div>
    </Stage>
  );
}

function Screen8(props) {
  const c = CONTENT.s8;
  const t = useT();
  return <ChoiceBody {...props} c={c} ordinal={0} bit="hint" compact model={<ErrorCard top={t(c.errorTop)} bottom={t(c.errorBottom)} />} />;
}

function Screen9({ screen, storedAnswer, onAnswer, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s9;
  const audio = useNarration(c.audio, screen);
  const ready = audio.muted || audio.completed;
  const [placed, setPlaced] = useState(storedAnswer?.placed ?? c.items.map(() => null));
  const [active, setActive] = useState(null);
  const [wrongItem, setWrongItem] = useState(null);
  const attempts = useRef(storedAnswer?.attempts ?? 0);
  const clean = useRef(storedAnswer?.firstTry ?? true);
  const reported = useRef(storedAnswer?.solved === true);
  const solved = placed.every((value) => value !== null);
  const drop = (bucket) => {
    if (!ready || solved || active === null) return;
    attempts.current += 1;
    const item = c.items[active];
    if (bucket === item.bucket) {
      setPlaced((previous) => previous.map((value, index) => (index === active ? bucket : value)));
      setActive(null);
      setWrongItem(null);
      playSfx('correct');
    } else {
      clean.current = false;
      setWrongItem(active);
      playSfx('wrong');
      audio.pushOneOff(t(item.wrongNote));
    }
  };
  useEffect(() => {
    if (!solved || reported.current) return;
    reported.current = true;
    setWrongItem(null);
    audio.pushOneOff(t(c.audio.on_correct));
    onAnswer({
      screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.title),
      options: c.items.map((item) => t(item.text)), correctIndex: null,
      correctAnswer: t(c.doneNote), studentAnswerIndex: null, studentAnswer: t(c.doneNote),
      correct: true, firstTry: clean.current, attempts: attempts.current, solved: true, placed,
    });
  }, [solved, placed, audio, c, onAnswer, screen, t]);
  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!solved || !ready}>
      <div className="stack">
        <Heading c={c} />
        <p className="lead-line">{t(c.lead)}</p>
        <section className="sort-board" data-g4-role="visual-frame">
          <div className="sort-cards">
            {c.items.map((item, index) => (
              <button
                type="button"
                key={index}
                className={'sort-card' + (active === index ? ' is-active' : '') + (placed[index] !== null ? ' is-done' : '') + (wrongItem === index ? ' is-wrong' : '')}
                disabled={!ready || placed[index] !== null || solved}
                onClick={() => setActive(index)}
              >
                <span>{t(item.text)}</span>
                {placed[index] !== null && <small className="sort-tag">{t(c.buckets[placed[index]].label)}</small>}
              </button>
            ))}
          </div>
          <div className="sort-buckets">
            {c.buckets.map((bucket, index) => (
              <button
                type="button"
                key={index}
                className={'sort-bucket' + (active !== null ? ' is-open' : '')}
                disabled={!ready || active === null || solved}
                onClick={() => drop(index)}
              >
                <b>{t(bucket.label)}</b>
                <small>{t(bucket.caption)}</small>
                <span className="sort-count mono">{placed.filter((value) => value === index).length}</span>
              </button>
            ))}
          </div>
        </section>
        <FeedbackBlock show={solved || wrongItem !== null} correct={solved}>
          {solved ? t(c.doneNote) : (wrongItem === null ? '' : t(c.items[wrongItem].wrongNote))}
        </FeedbackBlock>
      </div>
    </Stage>
  );
}

function Screen10(props) {
  const c = CONTENT.s10;
  const t = useT();
  return (
    <ChoiceBody
      {...props}
      c={c}
      ordinal={1}
      compact
      model={(
        <div className="stack-model">
          <p className="lead-line">{t(c.story)}</p>
          <PartWholeBar parts={8} known={7} knownLabel={bi('sarflandi', 'потрачено', 'spent')} spent compact />
        </div>
      )}
    />
  );
}

function Screen11({ screen, storedAnswer, onAnswer, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s11;
  const audio = useNarration(c.audio, screen);
  const ready = audio.muted || audio.completed;
  const pad = useTapAnswer({
    screen, answer: c.answer, onAnswer, question: c.question, ready, audio,
    correctAudio: c.audio.on_correct, wrongAudio: c.audio.on_wrong, storedAnswer,
  });
  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!pad.solved || !ready}>
      <div className="stack">
        <Heading c={c} />
        <p className="lead-line">{t(c.lead)}</p>
        <section className="model-card" data-g4-role="visual-frame">
          <PartWholeBar parts={c.parts} known={c.known} knownLabel={bi("500 so'm", '500 сумов', '500 sum')} wholeValue={pad.solved ? '4000' : null} compact />
          <h2 className="case-question">{t(c.question)}</h2>
        </section>
        <TapNumPad value={pad.value} onDigit={pad.push} onBack={pad.back} onCheck={pad.check} disabled={!ready || pad.solved} state={pad.state} unit={UNIT_SUM} />
        <FeedbackBlock show={pad.state !== null} correct={pad.solved} proof={pad.solved ? t(c.proof) : null}>
          {pad.solved || pad.state === null ? '' : t(c.hint)}
        </FeedbackBlock>
      </div>
    </Stage>
  );
}

function Screen12({ screen, storedAnswer, onAnswer, onNext, onPrev }) {
  const t = useT();
  const lang = useLang();
  const c = CONTENT.s12;
  const audio = useNarration(c.audio, screen);
  const ready = audio.muted || audio.completed;
  const boardRef = useRef(null);
  const [activeLeft, setActiveLeft] = useState(null);
  const [pairs, setPairs] = useState(storedAnswer?.pairs ?? []);
  const [wrongPair, setWrongPair] = useState(null);
  const clean = useRef(storedAnswer?.firstTry ?? true);
  const attempts = useRef(storedAnswer?.attempts ?? 0);
  const solved = pairs.length === c.left.length;
  const reported = useRef(storedAnswer?.solved === true);
  const takenLeft = new Set(pairs.map((pair) => pair.left));
  const takenRight = new Set(pairs.map((pair) => pair.right));
  const pickRight = (rightId) => {
    if (!ready || solved || activeLeft === null || takenRight.has(rightId)) return;
    attempts.current += 1;
    const target = c.right.find((item) => item.id === rightId);
    if (target && target.pair === activeLeft) {
      setPairs((previous) => [...previous, { left: activeLeft, right: rightId }]);
      setActiveLeft(null);
      setWrongPair(null);
      playSfx('correct');
    } else {
      clean.current = false;
      setWrongPair({ left: activeLeft, right: rightId });
      playSfx('wrong');
      audio.pushOneOff(t(c.audio.on_wrong));
    }
  };
  useEffect(() => {
    if (!solved || reported.current) return;
    reported.current = true;
    setWrongPair(null);
    audio.pushOneOff(t(c.audio.on_correct));
    onAnswer({
      screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.title),
      options: c.left.map((item) => t(item.label)), correctIndex: null,
      correctAnswer: t(c.doneNote), studentAnswerIndex: null, studentAnswer: t(c.doneNote),
      correct: true, firstTry: clean.current, attempts: attempts.current, solved: true, pairs,
    });
  }, [solved, pairs, audio, c, onAnswer, screen, t]);
  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!solved || !ready}>
      <div className="stack">
        <Heading c={c} />
        <p className="lead-line">{t(c.prompt)}</p>
        <section className="matching-board" ref={boardRef}>
          <MatchingLines boardRef={boardRef} pairs={pairs} wrongPair={wrongPair} localeKey={lang} />
          <div className="matching-column">
            {c.left.map((item) => (
              <button
                type="button"
                key={item.id}
                data-match-left={item.id}
                className={'match-card' + (activeLeft === item.id ? ' is-active' : '') + (takenLeft.has(item.id) ? ' is-done' : '')}
                disabled={!ready || takenLeft.has(item.id) || solved}
                onClick={() => setActiveLeft(item.id)}
              >
                <span className="mono">{t(item.label)}</span>
              </button>
            ))}
          </div>
          <div className="matching-column">
            {c.right.map((item) => (
              <button
                type="button"
                key={item.id}
                data-match-right={item.id}
                className={'match-card' + (takenRight.has(item.id) ? ' is-done' : '')}
                disabled={!ready || takenRight.has(item.id) || solved}
                onClick={() => pickRight(item.id)}
              >
                <span className="mono match-value">{item.value}</span>
                <span className="match-caption">{t(item.caption)}</span>
              </button>
            ))}
          </div>
        </section>
        <FeedbackBlock show={solved || wrongPair !== null} correct={solved}>
          {solved ? t(c.doneNote) : t(c.wrongNote)}
        </FeedbackBlock>
      </div>
    </Stage>
  );
}

function Screen13({ screen, storedAnswer, onAnswer, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s13;
  const audio = useNarration(c.audio, screen);
  const ready = audio.muted || audio.completed;
  const total = c.rounds.length;
  const [index, setIndex] = useState(storedAnswer?.roundIndex ?? 0);
  const [picked, setPicked] = useState(null);
  const [solvedRound, setSolvedRound] = useState(false);
  const [flashKey, flashWrong, clearFlash] = useWrongFlash();
  const [correctCount, setCorrectCount] = useState(storedAnswer?.correctCount ?? 0);
  const [firstTryCount, setFirstTryCount] = useState(storedAnswer?.firstTryCount ?? 0);
  const attempts = useRef(0);
  const done = index >= total - 1 && solvedRound;
  const round = c.rounds[Math.min(index, total - 1)];
  /* eslint-disable react-hooks/exhaustive-deps -- CONTENT modul konstantasi: tartib bir marta hisoblanadi */
  const roundOrder0 = useMemo(() => buildOptionOrder(c.rounds[0].options.length, c.rounds[0].correctIndex, LESSON_META.lessonId, 2), []);
  const roundOrder1 = useMemo(() => buildOptionOrder(c.rounds[1].options.length, c.rounds[1].correctIndex, LESSON_META.lessonId, 3), []);
  const roundOrder2 = useMemo(() => buildOptionOrder(c.rounds[2].options.length, c.rounds[2].correctIndex, LESSON_META.lessonId, 4), []);
  /* eslint-enable react-hooks/exhaustive-deps */
  const roundOrders = [roundOrder0, roundOrder1, roundOrder2];
  const order = roundOrders[Math.min(index, total - 1)];
  const pick = (option) => {
    if (!ready || solvedRound || flashKey !== null) return;
    attempts.current += 1;
    const ok = option === round.correctIndex;
    if (!ok) flashWrong(option);
    setPicked(option);
    playSfx(ok ? 'correct' : 'wrong');
    audio.pushOneOff(t(round.feedbackAudio[option]));
    if (!ok) return;
    setSolvedRound(true);
    const nextCorrect = correctCount + 1;
    const nextFirstTry = firstTryCount + (attempts.current === 1 ? 1 : 0);
    setCorrectCount(nextCorrect);
    setFirstTryCount(nextFirstTry);
    onAnswer({
      screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(round.question),
      options: round.options.map(t), correctIndex: round.correctIndex, correctAnswer: t(round.options[round.correctIndex]),
      studentAnswerIndex: option, studentAnswer: t(round.options[option]),
      correct: nextCorrect === total, firstTry: nextFirstTry === total,
      attempts: attempts.current, solved: nextCorrect === total,
      roundIndex: index, correctCount: nextCorrect, firstTryCount: nextFirstTry,
    });
  };
  const nextRound = () => {
    if (index >= total - 1) return;
    setIndex((value) => value + 1);
    setPicked(null);
    setSolvedRound(false);
    clearFlash();
    attempts.current = 0;
  };
  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!done || !ready}>
      <div className="stack">
        <Heading c={c} />
        <span className="round-meter">{t({ uz: 'Savol', ru: 'Вопрос', en: 'Question' })} {Math.min(index + 1, total)} / {total}</span>
        <section className="question round-question">
          <h2 className="mono">{t(round.question)}</h2>
          <Options values={round.options} picked={picked} onPick={pick} correctIndex={round.correctIndex} solved={solvedRound} disabled={!ready} order={order} flashKey={flashKey} />
          <FeedbackBlock show={picked !== null} correct={solvedRound} proof={solvedRound ? t(round.proof) : null}>
            {picked === null ? '' : t(round.feedback[picked])}
          </FeedbackBlock>
          {solvedRound && index < total - 1 && (
            <button type="button" className="btn-step" onClick={nextRound}>
              {t({ uz: 'Keyingi savol', ru: 'Следующий вопрос', en: 'Next question' })}
            </button>
          )}
        </section>
      </div>
    </Stage>
  );
}

function Screen14({ screen, storedAnswer, onAnswer, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s14;
  const audio = useNarration(c.audio, screen);
  const ready = audio.muted || audio.completed;
  const total = c.items.length;
  const [index, setIndex] = useState(storedAnswer?.itemIndex ?? 0);
  const [picked, setPicked] = useState(null);
  const [solvedItem, setSolvedItem] = useState(false);
  const [flashKey, flashWrong, clearFlash] = useWrongFlash();
  const [value, setValue] = useState('');
  const [padState, setPadState] = useState(null);
  const [correctCount, setCorrectCount] = useState(storedAnswer?.correctCount ?? 0);
  const [firstTryCount, setFirstTryCount] = useState(storedAnswer?.firstTryCount ?? 0);
  const attempts = useRef(0);
  const item = c.items[Math.min(index, total - 1)];
  const done = index >= total - 1 && solvedItem;
  /* eslint-disable react-hooks/exhaustive-deps -- CONTENT modul konstantasi: tartib bir marta hisoblanadi */
  const mcOrder = useMemo(() => buildOptionOrder(c.items[2].options.length, c.items[2].correctIndex, LESSON_META.lessonId, 5), []);
  /* eslint-enable react-hooks/exhaustive-deps */
  const register = (ok, studentAnswer, correctAnswer) => {
    const nextCorrect = correctCount + (ok ? 1 : 0);
    const nextFirstTry = firstTryCount + (ok && attempts.current === 1 ? 1 : 0);
    if (ok) { setCorrectCount(nextCorrect); setFirstTryCount(nextFirstTry); setSolvedItem(true); }
    onAnswer({
      screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(item.question),
      options: item.options ? item.options.map(t) : [], correctIndex: item.options ? item.correctIndex : item.answer,
      correctAnswer, studentAnswerIndex: null, studentAnswer,
      correct: nextCorrect === total, firstTry: nextFirstTry === total,
      attempts: attempts.current, solved: nextCorrect === total,
      itemIndex: index, correctCount: nextCorrect, firstTryCount: nextFirstTry,
    });
  };
  const checkNumber = () => {
    if (!ready || solvedItem || value === '') return;
    attempts.current += 1;
    const ok = Number(value) === item.answer;
    setPadState(ok ? 'ok' : 'bad');
    playSfx(ok ? 'correct' : 'wrong');
    audio.pushOneOff(t(ok ? item.audio.on_correct : item.audio.on_wrong));
    if (!ok) setTimeout(() => { setValue(''); setPadState(null); }, 1400);
    register(ok, value, String(item.answer));
  };
  const pickOption = (option) => {
    if (!ready || solvedItem || flashKey !== null) return;
    attempts.current += 1;
    const ok = option === item.correctIndex;
    if (!ok) flashWrong(option);
    setPicked(option);
    playSfx(ok ? 'correct' : 'wrong');
    // Har bir variantning o'z izohi aytiladi; umumiy on_wrong faqat zaxira.
    audio.pushOneOff(t(item.feedbackAudio?.[option] ?? (ok ? item.audio.on_correct : item.audio.on_wrong)));
    register(ok, t(item.options[option]), t(item.options[item.correctIndex]));
  };
  const nextItem = () => {
    if (index >= total - 1) return;
    setIndex((current) => current + 1);
    setPicked(null);
    setSolvedItem(false);
    clearFlash();
    setValue('');
    setPadState(null);
    attempts.current = 0;
  };
  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!done || !ready}>
      <div className="stack">
        <Heading c={c} />
        <span className="round-meter">{t({ uz: 'Topshiriq', ru: 'Задание', en: 'Task' })} {Math.min(index + 1, total)} / {total}</span>
        <section className="question round-question">
          <h2 className="mono">{t(item.question)}</h2>
          {item.kind === 'num'
            ? (
              <TapNumPad
                value={solvedItem ? String(item.answer) : value}
                onDigit={(digit) => { if (ready && !solvedItem && value.length < 4) { setPadState(null); setValue((previous) => previous + digit); } }}
                onBack={() => { if (ready && !solvedItem) { setPadState(null); setValue((previous) => previous.slice(0, -1)); } }}
                onCheck={checkNumber}
                disabled={!ready || solvedItem}
                state={padState}
              />
            )
            : <Options values={item.options} picked={picked} onPick={pickOption} correctIndex={item.correctIndex} solved={solvedItem} disabled={!ready} order={mcOrder} flashKey={flashKey} />}
          <FeedbackBlock show={item.kind === 'num' ? padState !== null : picked !== null} correct={solvedItem} proof={solvedItem ? t(item.proof) : null}>
            {item.kind === 'num'
              ? (solvedItem || padState === null ? '' : t(item.hint))
              : (picked === null ? '' : t(item.feedback[picked]))}
          </FeedbackBlock>
          {solvedItem && index < total - 1 && (
            <button type="button" className="btn-step" onClick={nextItem}>
              {t({ uz: 'Keyingi topshiriq', ru: 'Следующее задание', en: 'Next task' })}
            </button>
          )}
        </section>
        <FactCard show={done} text={c.fact} />
      </div>
    </Stage>
  );
}

// Variantli ekranlar uchun umumiy tana. Model har ekranda boshqa.
function ChoiceBody({ screen, c, ordinal, storedAnswer, onAnswer, onNext, onPrev, model = null, bit = null, compact = false }) {
  const t = useT();
  const audio = useNarration(c.audio, screen);
  const ready = audio.muted || audio.completed;
  const order = useMemo(
    () => buildOptionOrder(c.options.length, c.correctIndex, LESSON_META.lessonId, ordinal),
    [c.correctIndex, c.options.length, ordinal],
  );
  const [picked, setPicked] = useState(storedAnswer?.studentAnswerIndex ?? null);
  const [solved, setSolved] = useState(storedAnswer?.correct === true);
  const [flashKey, flashWrong] = useWrongFlash();
  const attempts = useRef(storedAnswer?.attempts ?? 0);
  const clean = useRef(storedAnswer?.firstTry ?? true);
  const pick = (index) => {
    if (!ready || solved || flashKey !== null) return;
    attempts.current += 1;
    const ok = index === c.correctIndex;
    if (!ok) { clean.current = false; flashWrong(index); }
    setPicked(index);
    setSolved(ok);
    playSfx(ok ? 'correct' : 'wrong');
    audio.pushOneOff(t(c.feedbackAudio[index]));
    onAnswer({
      screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question),
      options: c.options.map(t), correctIndex: c.correctIndex, correctAnswer: t(c.options[c.correctIndex]),
      studentAnswerIndex: index, studentAnswer: t(c.options[index]),
      correct: ok, firstTry: ok && clean.current && attempts.current === 1,
      attempts: attempts.current, solved: ok,
    });
  };
  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!solved || !ready}>
      <div className="stack">
        <Heading c={c} bit={bit} />
        {model && <section className={'model-card' + (compact ? ' compact' : '')} data-g4-role="visual-frame">{model}</section>}
        <section className="question">
          <h2>{t(c.question)}</h2>
          <Options values={c.options} picked={picked} onPick={pick} correctIndex={c.correctIndex} solved={solved} disabled={!ready} order={order} flashKey={flashKey} />
          <FeedbackBlock show={picked !== null} correct={solved} proof={solved && c.proof ? t(c.proof) : null}>
            {picked === null ? '' : t(c.feedback[picked])}
          </FeedbackBlock>
        </section>
      </div>
    </Stage>
  );
}


// ---------------------------------------------------------------------------
// YAKUNIY EKRAN — etalon Dars01 tuzilishi (metodist talabi 2026-08-19).
// Tarkibi: yakuniy bosqich sarlavhasi -> yakuniy savol kartasi (uch variant) ->
// yopilib turadigan qoida ro'yxati -> mukofot paneli (yopiq holatdan ochiladi).
// Unvon faqat yakuniy savolga to'g'ri javob berilgandan keyin ochiladi, dars ham
// shundan keyin yakunlanadi. Javob storedAnswer orqali saqlanadi: orqaga qaytib
// qaytganda tanlov joyida qoladi.
// ---------------------------------------------------------------------------
function G4TitleReveal({ active, title, onComplete }) {
  const t = useT();
  const [visible, setVisible] = useState(false);
  const wasActiveRef = useRef(active);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);
  useEffect(() => {
    const wasActive = wasActiveRef.current;
    wasActiveRef.current = active;
    if (!active || wasActive || typeof window === 'undefined') return undefined;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const frame = window.requestAnimationFrame(() => setVisible(true));
    const timer = window.setTimeout(() => { setVisible(false); onCompleteRef.current?.(); }, reduced ? 120 : 3900);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [active]);
  if (!visible || typeof document === 'undefined') return null;
  return createPortal(
    <div className="rank-boost-overlay g4-title-reveal-overlay" data-g4-role="rank-overlay" role="status" aria-live="assertive" aria-atomic="true">
      <div className="rank-boost-card g4-title-reveal-card">
        <div className="rank-boost-rays g4-title-reveal-rays" aria-hidden="true" />
        <div className="rank-boost-confetti g4-title-reveal-confetti" aria-hidden="true">
          {Array.from({ length: 18 }, (_, index) => <i key={index} />)}
        </div>
        <div className="rank-boost-medal g4-title-reveal-medal" aria-hidden="true">★</div>
        <h2 className="g4-title-reveal-title">{t(title)}</h2>
      </div>
    </div>,
    document.body,
  );
}

// Mukofot paneli: yakuniy savolga to'g'ri javob berilgunicha yopiq turadi.
const G4TitleCard = ({ title, solved, firstTry, total }) => {
  const t = useT();
  return (
    <div className={`reward-stage reward-stage-compact ${solved ? 'reward-unlocked' : 'reward-locked'}`} data-g4-role="title-card">
      {solved && (
        <div className="reward-confetti" data-g4-role="reward-confetti" aria-hidden="true">
          {Array.from({ length: 12 }, (_, index) => <i key={index} />)}
        </div>
      )}
      <div className="reward-bit" data-g4-role="reward-bit"><BitSVG state={solved ? 'happy' : 'present'} /></div>
      <div className="reward-medal" data-g4-role="reward-medal" aria-hidden="true">{solved ? '★' : '○'}</div>
      <span className="reward-kicker">
        {t(solved
          ? { uz: 'UNVON OLINDI', ru: 'ЗВАНИЕ ПОЛУЧЕНО', en: 'TITLE EARNED' }
          : { uz: 'MUKOFOT KUTILMOQDA', ru: 'НАГРАДА ЖДЁТ', en: 'THE REWARD AWAITS' })}
      </span>
      <h2>{t(solved ? title : { uz: 'Unvonni oching', ru: 'Открой звание', en: 'Unlock your title' })}</h2>
      <div className="reward-score">
        <strong>{firstTry}/{total}</strong>
        <span>{t({ uz: 'birinchi urinishda', ru: 'с первой попытки', en: 'on the first attempt' })}</span>
      </div>
    </div>
  );
};

const EtalonFinalScreen = ({ screen, c, answers, storedAnswer, onAnswer, onPrev, finishLesson }) => {
  const t = useT();
  const audio = useNarration(c.audio, screen);
  /* eslint-disable react-hooks/exhaustive-deps -- CONTENT modul konstantasi: tartib bir marta hisoblanadi */
  const order = useMemo(
    () => buildOptionOrder(c.options.length, c.correctIndex, LESSON_META.lessonId, 9),
    [],
  );
  /* eslint-enable react-hooks/exhaustive-deps */
  const [reflection, setReflection] = useState(storedAnswer?.reflection ?? null);
  const [flashKey, flashWrong] = useWrongFlash();
  const attempts = useRef(storedAnswer?.attempts ?? 0);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [revealRequested, setRevealRequested] = useState(false);
  const [finished, setFinished] = useState(false);
  const solved = reflection === c.correctIndex;
  const scored = SCREEN_META
    .map((meta, index) => (meta.scored ? { index, units: meta.scoreUnits ?? 1 } : null))
    .filter(Boolean);
  const totalUnits = scored.reduce((sum, item) => sum + item.units, 0);
  const firstTryUnits = scored.reduce((sum, item) => {
    const answer = answers?.[item.index];
    if (!answer) return sum;
    if (typeof answer.firstTryCount === 'number') return sum + Math.min(answer.firstTryCount, item.units);
    return sum + (answer.firstTry === true ? item.units : 0);
  }, 0);

  const chooseReflection = (sourceIndex) => {
    if (solved || flashKey !== null || !(audio.muted || audio.completed)) return;
    setReflection(sourceIndex);
    const ok = sourceIndex === c.correctIndex;
    if (!ok) flashWrong(sourceIndex);
    attempts.current += 1;
    playSfx(ok ? 'correct' : 'wrong');
    audio.pushOneOff(t(c.feedbackAudio[sourceIndex]));
    if (ok) setRevealRequested(true);
    onAnswer({
      screenIdx: screen,
      stage: SCREEN_META[screen].scope,
      question: t(c.question),
      options: order.map((index) => t(c.options[index])),
      correctIndex: order.indexOf(c.correctIndex),
      correctAnswer: t(c.options[c.correctIndex]),
      studentAnswerIndex: order.indexOf(sourceIndex),
      studentAnswer: t(c.options[sourceIndex]),
      correct: ok,
      firstTry: ok && attempts.current === 1,
      attempts: attempts.current,
      solved: ok,
      reflection: sourceIndex,
    });
  };

  const finish = () => {
    if (!solved || finished || revealRequested) return;
    setFinished(true);
    finishLesson();
  };

  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={finish} nextDisabled={!solved || finished || revealRequested} canFinish={solved} finish>
      <div className="screen-stack summary-stack">
        <G4TitleReveal active={revealRequested} title={c.award} onComplete={() => setRevealRequested(false)} />
        <div className="final-mission-heading">
          <span><i aria-hidden="true">◆</i> {t({ uz: 'YAKUNIY BOSQICH', ru: 'ФИНАЛЬНЫЙ ЭТАП', en: 'FINAL STAGE' })}</span>
          <h1>{t(c.title)}</h1>
          <p>{t(c.lead)}</p>
        </div>
        <div className="summary-action-layout summary-final-layout">
          <div className="summary-card reflection-card final-question-card">
            <span className="summary-question-kicker">
              <i aria-hidden="true">◇</i>
              {t({ uz: 'YAKUNIY SAVOL', ru: 'ФИНАЛЬНЫЙ ВОПРОС', en: 'FINAL QUESTION' })}
              <b>{t({ uz: '1 QADAM', ru: '1 ШАГ', en: '1 STEP' })}</b>
            </span>
            <h2 className="summary-question">{t(c.question)}</h2>
            <p className="summary-question-stem">{t(c.stem)}</p>
            <div className={`reflection-options ${solved ? 'reflection-options-solved' : ''}`} data-g4-role="reflection-options">
              {order.map((sourceIndex, displayIndex) => (
                <button
                  type="button"
                  key={t(c.options[sourceIndex])}
                  data-g4-role="answer-card"
                  data-g4-source-index={sourceIndex}
                  data-g4-correct={sourceIndex === c.correctIndex ? 'true' : 'false'}
                  className={`reflection-option ${solved && sourceIndex === c.correctIndex ? 'option-answer-confirm' : ''} ${solved && sourceIndex !== c.correctIndex ? 'option-answer-dismiss' : ''}`}
                  data-g4-wrong-flash={flashKey === sourceIndex ? 'true' : undefined}
                  disabled={solved || flashKey !== null}
                  onClick={() => chooseReflection(sourceIndex)}
                >
                  <span>{String.fromCharCode(65 + displayIndex)}</span>
                  {t(c.options[sourceIndex])}
                </button>
              ))}
            </div>
            {solved && (
              <div className="reflection-resolution">
                <FeedbackBlock show correct proof={t(c.proof)}>{t(c.resolution)}</FeedbackBlock>
              </div>
            )}
            <FeedbackBlock show={reflection !== null && !solved} correct={false}>
              {reflection === null || solved ? '' : t(c.feedback[reflection])}
            </FeedbackBlock>
          </div>
          <div className="summary-support-column">
            <div className={`summary-rules-disclosure ${rulesOpen ? 'summary-rules-open' : ''}`}>
              <button type="button" className="summary-rules-toggle" aria-expanded={rulesOpen} onClick={() => setRulesOpen((open) => !open)}>
                <span aria-hidden="true">3 &rarr; |</span>
                <div>
                  <strong>{t(c.rulesLabel)}</strong>
                  <small>
                    {t(rulesOpen
                      ? { uz: 'Qoidalarni yopish', ru: 'Скрыть правила', en: 'Hide the rules' }
                      : { uz: 'Eslab olish uchun bosing', ru: 'Нажми, чтобы вспомнить', en: 'Press to remember' })}
                  </small>
                </div>
                <i aria-hidden="true">&#8964;</i>
              </button>
              <div className="summary-rules-panel" aria-hidden={!rulesOpen}>
                <div className="summary-rule-items">
                  {c.rules.map((item, index) => (
                    <span key={t(item)}>
                      <i>{index + 1}</i>
                      <p>{t(item)}</p>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <G4TitleCard title={c.award} solved={solved} firstTry={firstTryUnits} total={totalUnits} />
          </div>
        </div>
      </div>
    </Stage>
  );
};

const Screen15 = (props) => <EtalonFinalScreen {...props} c={CONTENT.s15} />;


const SCREENS = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15];

export default function Grade4Dars23({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished, previewMode }) {
  useGrade4MobileZoom();
  const showPreviewControls = langProp === undefined || langProp === null;
  const preview = previewMode ?? showPreviewControls;
  const initialLang = normalizeLang(langProp);
  const [previewLang, setPreviewLang] = useState(initialLang);
  const lang = showPreviewControls ? normalizeLang(previewLang) : initialLang;
  configureLesson({ ttsApiBase: ttsApiBase || '', voiceGender: voiceGender || 'f', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', previewMode: preview });
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  // eslint-disable-next-line react-hooks/purity -- lesson duration starts when this component mounts
  const started = useRef(Date.now());
  const finished = useRef(false);
  const recordAnswer = useCallback((answer) => setAnswers((previous) => {
    const next = [...previous];
    const old = previous[answer.screenIdx];
    next[answer.screenIdx] = { ...answer, firstTry: old?.firstTry === false ? false : answer.firstTry };
    return next;
  }), []);
  const finishLesson = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    const scoredScreens = SCREEN_META
      .map((meta, index) => (meta.scored ? { index, units: meta.scoreUnits ?? 1 } : null))
      .filter(Boolean);
    const totalUnits = scoredScreens.reduce((sum, item) => sum + item.units, 0);
    const solvedUnits = scoredScreens.reduce((sum, item) => {
      const answer = answers[item.index];
      if (!answer) return sum;
      if (typeof answer.correctCount === 'number') return sum + Math.min(answer.correctCount, item.units);
      return sum + (answer.correct === true || answer.solved === true ? item.units : 0);
    }, 0);
    const firstTryUnits = scoredScreens.reduce((sum, item) => {
      const answer = answers[item.index];
      if (!answer) return sum;
      if (typeof answer.firstTryCount === 'number') return sum + Math.min(answer.firstTryCount, item.units);
      return sum + (answer.firstTry === true ? item.units : 0);
    }, 0);
    const payload = {
      lessonId: LESSON_META.lessonId,
      lessonTitle: LESSON_META.lessonTitle[lang],
      studentName: studentName || null,
      durationSec: Math.floor((Date.now() - started.current) / 1000),
      totalQuestions: totalUnits,
      correctAnswers: solvedUnits,
      scorePercent: totalUnits ? Math.round(solvedUnits / totalUnits * 100) : 0,
      finalScore: solvedUnits,
      finalTotal: totalUnits,
      passed: totalUnits ? solvedUnits / totalUnits >= 0.6 : false,
      firstTryStats: { total: totalUnits, firstTryCorrect: firstTryUnits },
      attemptsTotal: scoredScreens.reduce((sum, item) => sum + (answers[item.index]?.attempts ?? 0), 0),
      skillTags: LESSON_META.skillTags,
      answers: answers.filter(Boolean),
    };
    if (onFinished) onFinished(payload); else console.log('[Grade4 Dars23 preview]', payload);
  }, [answers, lang, onFinished, studentName]);
  const Current = SCREENS[current];
  return (
    <LangContext.Provider value={lang}>
      <style>{STYLES + G4_ETALON_OVERRIDES + LESSON_STYLES + WRONG_FLASH_CSS + EMPTY_FEEDBACK_CSS}</style>
      <div className={'lesson-root ' + (preview ? 'lesson-root-preview' : '')}>
        {showPreviewControls && (
          <div className="preview-language" aria-label={LANGUAGE_LABELS[lang]}>
            {SUPPORTED_LANGS.map((code) => (
              <button type="button" key={code} className={previewLang === code ? 'preview-active' : ''} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>
            ))}
          </div>
        )}
        <Current
          key={current}
          screen={current}
          storedAnswer={answers[current]}
          answers={answers}
          onAnswer={recordAnswer}
          onPrev={() => setCurrent((value) => Math.max(0, value - 1))}
          onNext={() => setCurrent((value) => Math.min(TOTAL_SCREENS - 1, value + 1))}
          finishLesson={finishLesson}
        />
      </div>
    </LangContext.Provider>
  );
}

const G4_ETALON_OVERRIDES = `
/* Local Dars01 visual contract. Content, narration and scoring stay lesson-owned. */
html:has(.lesson-root),body:has(.lesson-root),.lesson-root,.lesson-root button,.lesson-root input,.lesson-root textarea,.lesson-root select{font-family:'Manrope',system-ui,sans-serif}
.lesson-root h1,.lesson-root [data-g4-role="hook-title"] h1{font-family:'Source Serif 4',Georgia,serif!important;font-size:clamp(26px,4.2vw,36px)!important;font-weight:650!important;line-height:1.08!important;letter-spacing:-.012em!important;text-align:left!important}
.lesson-root .question h2,.lesson-root .hook-question-prompt{font-family:'Manrope',system-ui,sans-serif!important;font-size:clamp(17px,2.5vw,21px)!important;font-weight:800!important;line-height:1.28!important;text-align:left!important}
.lesson-root .summary-stack h2,.lesson-root .final-reflection h2,.lesson-root .reflection-card h2,.lesson-root [data-g4-role="title-card"] h2{font-family:'Source Serif 4',Georgia,serif!important}
.lesson-root .screen-count,.lesson-root .formula,.lesson-root .formula-card,.lesson-root .equation,.lesson-root .proof,.lesson-root .proof-label,.lesson-root .result-chip,.lesson-root .model-label,.lesson-root .frac{font-family:'JetBrains Mono',monospace!important}
.lesson-root [data-g4-role="hook-topic"]{font-size:clamp(14px,1.8vw,16px)!important}.lesson-root .summary-stack h2{font-size:25px}.lesson-root .option{font-size:clamp(15px,2vw,18px)}
[data-g4-role="hook-title"]{display:block;width:100%;font-size:36px!important;justify-content:flex-start!important;text-align:left}
.hook-stack{height:100%;min-height:0;display:flex!important;flex-direction:column;align-items:stretch;gap:9px!important;overflow:hidden}
.hook-stack>.heading{height:auto!important;min-height:0!important;overflow:visible!important;align-items:flex-start!important;flex:0 0 auto}
.hook-question-prompt{flex:0 0 auto;margin:0;padding:0 2px;color:#173B52;font-size:21px!important}
.hook-stack>.question{flex:0 0 auto;height:auto!important;min-height:0}
.hook-stack .feedback[aria-hidden="true"]{display:none!important}
.stage-hook .hook-question>h2,.hook-stack>.question>h2{display:none}
[data-g4-role="hook-scene"]{position:relative;isolation:isolate;width:100%!important;height:206px!important;min-width:0;min-height:206px!important;flex:0 0 206px!important;display:block!important;grid-template-columns:1fr!important;overflow:hidden}
[data-g4-role~="visual-frame"]{position:relative;isolation:isolate;min-width:0;min-height:0;max-width:100%;overflow:hidden!important;contain:paint}
[data-g4-screen="hook"] [data-g4-role~="visual-frame"],.stage-hook [data-g4-role="hook-scene"]>[data-g4-role~="visual-frame"]{width:min(760px,100%);min-height:206px;height:100%;margin-inline:auto;border:1px solid rgba(144,228,235,.12);border-radius:24px;background:radial-gradient(circle at 87% 24%,rgba(121,211,218,.16),transparent 24%),radial-gradient(circle at 9% 88%,rgba(149,201,61,.11),transparent 25%),linear-gradient(145deg,rgba(22,143,163,.25),transparent 48%),linear-gradient(135deg,#153B50,#0B2232 72%);box-shadow:0 22px 50px -30px rgba(14,33,44,.75)}
.stage-hook .hook-card{padding:0!important;border:0!important;background:transparent!important;box-shadow:none!important}
.hook-scene-visual{width:100%!important;max-width:100%!important;height:100%;min-height:130px;padding:14px 112px 14px 16px;box-sizing:border-box}
.hook-scene-visual>[data-g4-role~="visual-frame"]{height:100%;padding:0;background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;contain:layout paint}
.hook-frame-bit{position:absolute;right:42px;bottom:-4px;z-index:4;width:88px;height:110px;overflow:hidden;pointer-events:none}
.hook-frame-bit>.g1-char,.hook-frame-bit>.bit,.hook-frame-bit>svg{width:100%;height:100%;display:block}
[data-g4-role~="visual-frame"] img,[data-g4-role~="visual-frame"] picture,[data-g4-role~="visual-frame"] video,[data-g4-role~="visual-frame"] canvas,[data-g4-role~="visual-frame"] svg{display:block;max-width:100%!important;max-height:100%!important;object-fit:contain;overflow:hidden!important}
.visual-shell,.attempt-model,.model-card,.test-model,.topic-visual,.conversion-visual,.time-visual,.area-visual,.length-visual,.mass-visual,.hook-model{min-width:0;min-height:0;max-width:100%;overflow:hidden}
.lesson-root .feedback[data-g4-role~="feedback-frame"]{height:auto!important;min-height:88px!important;padding:8px 15px 8px 9px!important;border-radius:18px!important;display:grid!important;grid-template-columns:62px minmax(0,1fr)!important;align-items:center!important;gap:12px!important;overflow:hidden}
.lesson-root .feedback[data-g4-role~="feedback-frame"] [data-g4-role="feedback-bit"],.lesson-root .feedback[data-g4-role~="feedback-frame"]>.feedback-bit{width:62px!important;height:76px!important;display:block;overflow:hidden}
.lesson-root .feedback[data-g4-role~="feedback-frame"] [data-g4-role="feedback-bit"]>.g1-char,.lesson-root .feedback[data-g4-role~="feedback-frame"] [data-g4-role="feedback-bit"]>.bit,.lesson-root .feedback[data-g4-role~="feedback-frame"] [data-g4-role="feedback-bit"]>svg{width:100%!important;height:100%!important}
.lesson-root .feedback[data-g4-feedback="solution"][data-g4-role~="bit-answer-comment"]{height:auto!important;min-height:72px!important;border-radius:15px!important;grid-template-columns:51px minmax(0,1fr)!important;background:linear-gradient(135deg,#FFFFFF,#E7F3EC)!important;box-shadow:inset 5px 0 #227A53,0 13px 26px -23px rgba(34,122,83,.75)!important}
.lesson-root .feedback[data-g4-feedback="solution"][data-g4-role~="bit-answer-comment"] [data-g4-role="feedback-bit"],.lesson-root .feedback[data-g4-feedback="solution"][data-g4-role~="bit-answer-comment"]>.feedback-bit{width:51px!important;height:64px!important}
.lesson-root .feedback[data-g4-feedback="wrong"]{height:auto!important;min-height:88px!important;border-radius:18px!important;background:linear-gradient(135deg,#FFFFFF,#FFF5D9)!important;box-shadow:inset 5px 0 #A96F13,0 13px 26px -23px rgba(169,111,19,.72)!important}
.lesson-root .feedback[data-g4-role~="feedback-frame"] p{min-width:0;margin:0;font-family:'Manrope',system-ui,sans-serif!important;font-size:15px!important;line-height:1.42!important;text-align:left}
.rank-boost-overlay{position:fixed;inset:0;z-index:120;padding:0;display:grid;place-items:center;overflow:hidden;overscroll-behavior:contain;background:rgba(8,13,24,.64);backdrop-filter:blur(2px) saturate(.78);animation:g4-title-reveal-life 3.9s ease both}.rank-boost-overlay .g4-title-reveal-title{font-size:58px!important}
[data-g4-role="title-card"]{position:relative;isolation:isolate;max-width:100%;overflow:hidden}
[data-g4-role="title-claim"]{font-family:'Manrope',system-ui,sans-serif}
.hook-scene-visual{width:min(760px,100%)!important;margin-inline:auto!important}
.lesson-frame .preview-language{display:none!important}
@media(max-width:639.98px){
  .lesson-root h1,.lesson-root [data-g4-role="hook-title"] h1{font-size:clamp(22px,6.2vw,28px)!important}
  .lesson-root [data-g4-role="hook-title"]{font-size:25px!important}
  .lesson-root .question h2,.lesson-root .hook-question-prompt{font-size:17px!important}
  [data-g4-role="hook-scene"]{height:164px!important;min-height:164px!important;flex:0 0 164px!important}
  [data-g4-screen="hook"] [data-g4-role~="visual-frame"],.stage-hook [data-g4-role="hook-scene"]>[data-g4-role~="visual-frame"]{min-height:164px;border-radius:18px}
  .hook-scene-visual{min-height:112px;padding:10px 78px 10px 11px}
  .hook-stack>.question .options,.stage-hook .hook-question .options{grid-template-columns:repeat(3,minmax(0,1fr))!important}
  .hook-stack>.question .option,.stage-hook .hook-question .option{min-height:44px!important;grid-template-columns:1fr!important;justify-items:center!important;text-align:center!important}
  .hook-frame-bit{right:12px;bottom:-7px;width:68px;height:85px}
  .lesson-root .feedback[data-g4-role~="feedback-frame"]{height:auto!important;min-height:88px!important;grid-template-columns:54px minmax(0,1fr)!important;gap:9px!important}
  .lesson-root .feedback[data-g4-role~="feedback-frame"] [data-g4-role="feedback-bit"],.lesson-root .feedback[data-g4-role~="feedback-frame"]>.feedback-bit{width:54px!important;height:68px!important}
  .lesson-root .feedback[data-g4-feedback="solution"][data-g4-role~="bit-answer-comment"]{height:auto!important;min-height:68px!important;border-radius:15px!important;grid-template-columns:47px minmax(0,1fr)!important}
  .lesson-root .feedback[data-g4-feedback="solution"][data-g4-role~="bit-answer-comment"] [data-g4-role="feedback-bit"],.lesson-root .feedback[data-g4-feedback="solution"][data-g4-role~="bit-answer-comment"]>.feedback-bit{width:47px!important;height:59px!important}
  .lesson-root .feedback[data-g4-role~="feedback-frame"] p{font-size:14px!important}.rank-boost-overlay .g4-title-reveal-title{font-size:29px!important}
}
.hook-scene-visual>.hook-model{height:100%!important;padding:5px!important;gap:3px!important;transform:scale(.9);transform-origin:center}
.hook-scene-visual>.hook-model .tank-model{gap:3px!important}
.hook-scene-visual>.hook-model .tank-shell{width:190px!important;height:92px!important;padding:7px!important;border-width:3px!important;border-radius:0 0 18px 18px!important}
.hook-scene-visual>.hook-model .tank-spout{width:32px!important;height:10px!important;left:-27px!important;border-width:3px!important}
.hook-scene-visual>.hook-model .tank-handle{width:34px!important;height:45px!important;right:-24px!important;top:18px!important;border-width:7px!important}
.hook-scene-visual>.hook-model .model-label{padding:4px 8px!important;font-size:12px!important}
@media(prefers-reduced-motion:reduce){.rank-boost-overlay,.rank-boost-overlay * ,[data-g4-role="title-card"],[data-g4-role="title-card"] *{animation:none!important;transition:none!important}.rank-boost-overlay{opacity:1}.g4-title-reveal-confetti,.g4-title-card-confetti{display:none!important}}
.lesson-root [class*="formula"],.lesson-root [class*="equation"]{font-family:'JetBrains Mono',monospace!important}
.hook-stack>.question[data-g4-role="answer-card"]{display:contents!important}
.lesson-root [data-g4-role="title-card"]{width:100%!important;min-height:116px!important;height:auto!important;margin:0!important;padding:12px 82px 11px 67px!important;border-radius:17px!important;display:flex!important;flex-direction:column!important;justify-content:center!important;gap:4px!important;color:#FFF!important;background:radial-gradient(circle at 82% 20%,rgba(255,194,60,.26),transparent 30%),linear-gradient(135deg,#173B52,#0E6978)!important;box-shadow:0 28px 58px -27px rgba(22,143,163,.8)!important}
.lesson-root [data-g4-role="title-card"] [data-g4-role="reward-bit"]{width:72px!important;height:90px!important}
.lesson-root [data-g4-role="title-card"] [data-g4-role="reward-medal"]{width:44px!important;height:44px!important}
@media(max-width:639.98px){
  .lesson-root [data-g4-role="title-card"]{min-height:88px!important;padding:9px 59px 8px 51px!important;border-radius:14px!important}
  .lesson-root [data-g4-role="title-card"] [data-g4-role="reward-bit"]{width:57px!important;height:71px!important}
  .lesson-root [data-g4-role="title-card"] [data-g4-role="reward-medal"]{width:34px!important;height:34px!important}
}

/* MOBIL O'QIY OLISH (etalon shkalasi) :: boshi */
/* --- Platforma chrome'i uchun xavfsiz zona.
   Ilgari 52px edi: "Darslar ro'yxati" pilli 52px, til pilli 60px da tugaydi,
   shuning uchun progress bar ularning ostiga tushib qolardi.
   Etalon Dars01 da 70px. --- */
@media(max-width:1100px){
  .lesson-root-preview .stage-header,.lesson-frame .lesson-root-preview .stage-header{padding-top:74px!important}
}

/* Mobil yagona masshtab (useMobileZoom, MOBIL_DESKTOP_MOSLASH.md):
   layout doim 390px etalon kenglikda, zoom real ekranga moslaydi.
   Etalon Dars01 bilan bir xil. */
@media(max-width:639.98px){
  .lesson-root{width:390px!important}
}

@media(max-width:639.98px){
  /* Sarlavha: min-height 40px h1 ni kesardi. Balandlik kontentga qarab. */
  .lesson-root .heading,.lesson-root .stage-hook .heading{min-height:0!important;height:auto!important;align-items:flex-start!important}
  .lesson-root .heading h1,.lesson-root .stage-hook .heading h1{font-size:20px!important;line-height:1.2!important}
  .lesson-root .heading>div>span,.lesson-root [data-g4-role="hook-topic"]{font-size:12px!important;line-height:1.2!important}
  .lesson-root .chrome-title>span:last-child{font-size:12px!important}
  .lesson-root .screen-count{font-size:12px!important}

  /* Javoblar: etalon Dars01 - ustunma-ustun, 15-16px. 3 ustun 9px o'rniga. */
  .lesson-root .options,.lesson-root .hook-stack>.question .options,.lesson-root .stage-hook .hook-question .options,.lesson-root .stage-hook .options{grid-template-columns:1fr!important;gap:6px!important}
  .lesson-root .option,.lesson-root .hook-stack>.question .option,.lesson-root .stage-hook .hook-question .option,.lesson-root .stage-hook .option{min-height:48px!important;padding:8px 10px!important;border-radius:13px!important;font-size:15px!important;line-height:1.24!important;grid-template-columns:26px minmax(0,1fr)!important;justify-items:start!important;text-align:left!important}
  .lesson-root .option>b{width:24px!important;height:24px!important;font-size:12px!important}

  /* Izoh va subtitr: bular bolaning o'qiydigan matni. */
  .lesson-root .feedback p,.lesson-root .feedback[data-g4-role~="feedback-frame"] p{font-size:14px!important;line-height:1.32!important}
  .lesson-root .feedback.feedback-slot{height:auto!important;min-height:60px!important;padding:6px 8px!important;grid-template-columns:36px minmax(0,1fr)!important;gap:7px!important}
  .lesson-root .feedback-bit{width:34px!important;height:43px!important}
  .lesson-root .caption-slot{min-height:32px!important;padding:5px 9px!important;font-size:12px!important;line-height:1.26!important}

  /* Navigatsiya. */
  .lesson-root .btn-white-accent,.lesson-root .btn-ghost{min-height:46px!important;font-size:14px!important}
  .lesson-root .stage-nav{min-height:58px!important}

  /* Model yorliqlari va holat chiplari. */
  .lesson-root .model-label{padding:5px 9px!important;font-size:13px!important}
  .lesson-root .boundary-grid .model-label{padding:4px 7px!important;font-size:12px!important}
  .lesson-root .state-note{font-size:12px!important;line-height:1.24!important}
  .lesson-root .formula-card{font-size:15px!important}
  .lesson-root .result-chip{font-size:17px!important}

  .lesson-root .stage-content{padding-top:5px!important;padding-bottom:5px!important}
  .lesson-root .stack{gap:6px!important}

  /* Ochilmagan chiplar (formula-card, result-chip, state-note) boshlang'ich
     holatda translateY(7px) bilan pastga suriladi va model-card ning
     overflow:hidden chegarasidan chiqib qirqilardi. Pastdan bo'shliq beramiz. */
  .lesson-root .model-card{padding:7px 7px 12px!important;gap:5px!important;align-content:center!important}
  .lesson-root .attempt-model{padding-bottom:10px!important}
  .lesson-root .hook-frame-bit{bottom:0!important}

  /* Yakun ekrani umumiy Grade4Finale modulida yashaydi va u 8-10px qatlamga
     tushadi. Modul 40 ta darsda ishlaganligi uchun uni global o'zgartirmaymiz -
     shkalani faqat shu dars ichida ko'taramiz. */
  .lesson-root .g4-shared-finale .finale-takeaway p{font-size:13px!important;line-height:1.28!important}
  .lesson-root .g4-shared-finale .finale-takeaway{min-height:44px!important;padding:6px 8px!important;grid-template-columns:24px minmax(0,1fr)!important;gap:7px!important}
  .lesson-root .g4-shared-finale .finale-takeaway>span{width:26px!important;height:26px!important;font-size:12px!important}
  .lesson-root .g4-shared-finale .finale-heading>span,.lesson-root .g4-shared-finale .finale-proof>span,.lesson-root .g4-shared-finale .finale-bridge>div>strong{font-size:12px!important;line-height:1.2!important}
  .lesson-root .g4-shared-finale .finale-proof>strong{font-size:14px!important}
  .lesson-root .g4-shared-finale .finale-layout,.lesson-root .g4-shared-finale .finale-main,.lesson-root .g4-shared-finale .finale-mastery{gap:5px!important}
  /* Ochilmagan finale-proof/bridge translateY(7-8px) bilan pastga suriladi va
     finale-layout ning overflow:hidden chegarasidan chiqib qirqilardi. */
  .lesson-root .g4-shared-finale .finale-layout{padding-bottom:9px!important}
  .lesson-root .g4-shared-finale .finale-proof,.lesson-root .g4-shared-finale .finale-bridge{padding:6px 8px!important}
  .lesson-root .g4-shared-finale .finale-proof p,.lesson-root .g4-shared-finale .finale-bridge p{font-size:12px!important;line-height:1.28!important}
  .lesson-root .g4-shared-finale .finale-heading h1{font-size:19px!important}
  .lesson-root [data-g4-role="title-claim"]{font-size:14px!important}
}

/* Past telefon (masalan 360x640): joy vizual balandliklardan olinadi,
   shrift kamaymaydi. */
@media(max-width:639.98px) and (max-height:700px){
  .lesson-root .stack{gap:4px!important}
  .lesson-root .heading h1,.lesson-root .stage-hook .heading h1{font-size:18px!important}
  .lesson-root .option,.lesson-root .stage-hook .option{min-height:44px!important;padding:6px 9px!important;font-size:14px!important}
  .lesson-root .caption-slot{min-height:28px!important;padding:4px 8px!important}
  .lesson-root .stage-nav{min-height:52px!important}
  .lesson-root .btn-white-accent,.lesson-root .btn-ghost{min-height:44px!important}
  .lesson-root [data-g4-role="hook-scene"]{height:132px!important;min-height:132px!important;flex:0 0 132px!important}
  .lesson-root [data-g4-screen="hook"] [data-g4-role~="visual-frame"],.lesson-root .stage-hook [data-g4-role="hook-scene"]>[data-g4-role~="visual-frame"]{min-height:132px!important}
  .lesson-root .hook-scene-visual{min-height:96px!important;padding:6px 66px 6px 9px!important}
  .lesson-root .hook-frame-bit{width:56px!important;height:70px!important}
}

@media(max-width:639.98px){
  /* Bak modeli: jo'mrak va tutqich qobiqdan tashqariga chiqadi, ota-element
     esa overflow:hidden - mobil ekranda ular qirqilardi (300>254).
     Konteynerga ichki bo'shliq beramiz. DIQQAT: faqat hook'dan tashqaridagi
     modellarga, chunki hook bakining o'z (kichik) o'lchamlari bor. */
  .lesson-root .model-card .tank-model,.lesson-root .attempt-model .tank-model{width:100%!important;padding-inline:46px!important;box-sizing:border-box!important}
  .lesson-root .model-card .tank-shell,.lesson-root .attempt-model .tank-shell{width:100%!important;max-width:172px!important;height:132px!important;padding:8px!important;border-width:4px!important}
  .lesson-root .model-card .tank-spout,.lesson-root .attempt-model .tank-spout{width:40px!important;height:12px!important;left:-34px!important;border-width:4px!important}
  .lesson-root .model-card .tank-handle,.lesson-root .attempt-model .tank-handle{width:38px!important;height:50px!important;right:-27px!important;top:26px!important;border-width:7px!important}

  /* Hook baki: mavjud kichik o'lchamlar saqlanadi, faqat sig'adigan qilinadi. */
  .lesson-root .hook-scene-visual>.hook-model .tank-model{width:100%!important;padding-inline:30px!important;box-sizing:border-box!important;gap:4px!important}
  .lesson-root .hook-scene-visual>.hook-model .tank-shell{width:100%!important;max-width:158px!important;height:86px!important}
  .lesson-root .hook-scene-visual>.hook-model .model-label{font-size:12px!important;padding:3px 7px!important}
  .lesson-root .hook-frame-bit{bottom:0!important}

  /* Holat chiplari 4 ustunda 11px edi; 2 ustun 12px o'qishga qulay. */
  .lesson-root .state-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:5px!important}
  .lesson-root .state-grid span{min-height:40px!important;padding:6px!important;font-size:12px!important;line-height:1.18!important}

  .lesson-root .fraction-bar{height:58px!important}
  .lesson-root .boundary-grid{grid-template-columns:1fr!important;gap:5px!important;padding:6px!important}
  .lesson-root .boundary-grid>.state-note{grid-column:1!important}
  .lesson-root .boundary-grid .fraction-bar{height:42px!important}
  .lesson-root .model-choices{grid-template-columns:1fr!important;gap:6px!important}
  /* DIQQAT: bu ekranda variantlar <button class="model-choice">, shuning uchun
     bazadagi ".model-choices>div" qoidalari umuman ishlamaydi (o'lik CSS).
     To'g'ri klassga murojaat: nishon va matn birinchi qatorda, model ikkinchi. */
  .lesson-root .model-choice{min-height:0!important;padding:8px 10px!important;grid-template-columns:26px minmax(0,1fr)!important;grid-template-areas:"badge text" "model model"!important;gap:6px 8px!important;align-items:center!important}
  .lesson-root .model-choice>b{grid-area:badge!important;width:24px!important;height:24px!important;font-size:12px!important}
  .lesson-root .model-choice>span{grid-area:text!important;font-size:14px!important;line-height:1.22!important}
  .lesson-root .model-choice .fraction-model{grid-area:model!important;width:100%!important}
  .lesson-root .rule-line{padding:9px!important;font-size:16px!important}
  .lesson-root .wrong-formula{padding:8px!important;font-size:16px!important}
  .lesson-root .marker-control{font-size:12px!important;padding:8px 10px!important}
  .lesson-root .strategy-replay,.lesson-root .tiny-action{min-height:44px!important;font-size:13px!important}
  .lesson-root .bit-error{padding:9px!important;font-size:16px!important}
  .lesson-root .hospital-model{padding:9px!important}
  .lesson-root .hospital-model>span{width:32px!important;height:32px!important;font-size:20px!important}
  .lesson-root .number-line{height:126px!important;padding-inline:11%!important}
  .lesson-root .nl-dot{width:40px!important;height:32px!important;font-size:12px!important}

  /* Chegara modelidagi amal belgisi: mobilda grid 1 ustunga tushadi va
     rotate(90deg) butun qatorni aylantirib, uni ~300px balandlikka
     cho'zib yuborardi. Belgini kichik kvadratga qamab qo'yamiz. */
  .lesson-root .rule-boundary-models{grid-template-columns:1fr!important;gap:6px!important;padding:9px!important}
  .lesson-root .rule-boundary-models>div{padding:7px!important;grid-template-columns:38px minmax(0,1fr)!important;gap:7px!important}
  .lesson-root .rule-boundary-models>strong{width:30px!important;height:30px!important;justify-self:center!important;display:grid!important;place-items:center!important;transform:none!important;font-size:20px!important}
}

@media(max-width:639.98px) and (max-height:700px){
  .lesson-root .model-card .tank-shell,.lesson-root .attempt-model .tank-shell{height:112px!important}
  .lesson-root .hook-scene-visual>.hook-model .tank-shell{max-width:134px!important;height:72px!important}
  .lesson-root .fraction-bar{height:48px!important}
  .lesson-root .state-grid span{min-height:36px!important}
  .lesson-root .number-line{height:112px!important}
  .lesson-root .rule-boundary-models{padding:5px!important;gap:3px!important}
  .lesson-root .rule-boundary-models>div{padding:4px!important;grid-template-columns:30px minmax(0,1fr)!important;gap:5px!important}
  .lesson-root .rule-boundary-models>strong{width:22px!important;height:22px!important;font-size:15px!important}
  .lesson-root .rule-boundary-models .frac{font-size:13px!important}
  .lesson-root .rule-boundary-models .fraction-bar{height:22px!important}
  .lesson-root .model-choice .fraction-bar{height:28px!important}
  .lesson-root .model-choice{padding:6px 8px!important;gap:4px 6px!important}
  .lesson-root .hospital-model{padding:6px!important;gap:8px!important}
  .lesson-root .hospital-model>span{width:26px!important;height:26px!important;font-size:16px!important}
  .lesson-root .hospital-model .tank-model.compact .tank-shell{width:120px!important;height:64px!important}
}
/* MOBIL O'QIY OLISH (etalon shkalasi) :: oxiri */

/* ICHKI TEKSHIRUV VA FACTCARD :: boshi */
/* Ichki tekshiruv (haqiqiy matematik harakat) va FactCard. Ranglar etalon
   palitrasidan: cyan #168FA3, cyanSoft #E5F5F6, navy #173B52, lime #95C93D,
   success #227A53, warn #A96F13 / #FFF5D9, accent #FF5B35. */
.lesson-root .inline-check{display:grid;gap:6px;justify-items:center;padding:9px 11px;border-radius:15px;background:#E5F5F6;box-shadow:inset 3px 0 #168FA3}
.lesson-root .inline-check-prompt{color:#173B52;font-size:13px;font-weight:850;text-align:center}
.lesson-root .inline-check-row{display:flex;flex-wrap:wrap;gap:7px;justify-content:center}
.lesson-root .inline-chip{min-height:44px;min-width:66px;padding:6px 14px;border:0;border-radius:12px;color:#173B52;background:#FFF;cursor:pointer;box-shadow:0 10px 20px -18px rgba(58,53,48,.6);font:900 15px 'JetBrains Mono',monospace}
.lesson-root .inline-chip:focus-visible{outline:3px solid #FF5B35;outline-offset:2px}
.lesson-root .inline-chip.is-right{color:#FFF;background:#227A53}
.lesson-root .inline-chip.is-bad{color:#A96F13;background:#FFF5D9}
.lesson-root .inline-chip:disabled{cursor:default}
.lesson-root .inline-check-note{min-height:15px;color:#227A53;font-size:12px;font-weight:800;text-align:center}

.lesson-root .fact-card{padding:9px 12px;border-radius:14px;display:grid;grid-template-columns:auto minmax(0,1fr);align-items:center;gap:10px;opacity:.12;transform:translateY(6px);background:linear-gradient(135deg,#FFFFFF,#E5F5F6);box-shadow:inset 3px 0 #95C93D;transition:.4s ease}
.lesson-root .fact-card.show{opacity:1;transform:none}
.lesson-root .fact-card>b{color:#168FA3;font:900 10px 'JetBrains Mono',monospace;letter-spacing:.1em}
.lesson-root .fact-card p{color:#173B52;font-size:13px;line-height:1.34}

/* Sonlar nuridagi erkin belgi: ilgari o'qdan uzilib, hech narsaga
   ulanmagan holda suzib turardi. Endi o'qqa ulagich chiziq bilan bog'lanadi. */
.lesson-root .marker-note{min-height:15px;color:#227A53;font-size:12px;font-weight:800}
.lesson-root .nl-dot.free{top:76px}
.lesson-root .nl-dot.free::before{content:"";position:absolute;left:50%;top:-20px;width:2px;height:20px;background:#173B52;transform:translateX(-50%)}

@media(max-width:639.98px){
  .lesson-root .inline-check{padding:7px 9px!important;gap:5px!important}
  .lesson-root .inline-check-prompt{font-size:13px!important}
  .lesson-root .inline-chip{min-height:44px!important;min-width:58px!important;padding:5px 11px!important;font-size:15px!important}
  .lesson-root .inline-check-note{font-size:12px!important}
  .lesson-root .fact-card{padding:7px 9px!important;gap:8px!important}
  .lesson-root .fact-card p{font-size:12px!important;line-height:1.28!important}
}
/* ICHKI TEKSHIRUV VA FACTCARD :: oxiri */

/* OCHILMAGAN CHIPLAR SIG'IMI :: boshi */
@media(max-width:639.98px){
  .lesson-root .frame-note:not(.show),.lesson-root .formula-card:not(.show),.lesson-root .result-chip:not(.show),.lesson-root .state-note:not(.show),.lesson-root .rule-line:not(.show),.lesson-root .wrong-formula:not(.show),.lesson-root .fact-card:not(.show),.lesson-root .state-grid span:not(.show),.lesson-root .boundary-grid>div:not(.show){transform:none!important}
  .lesson-root .g4-shared-finale .finale-takeaway:not(.is-visible),.lesson-root .g4-shared-finale .finale-proof:not(.is-visible),.lesson-root .g4-shared-finale .finale-bridge:not(.is-visible){transform:none!important}

  /* strategy-slot ichidagi feedback position:absolute + inset:0 bo'lib,
     translateY(7px) bilan slot chegarasidan chiqadi. Fade qoladi. */
  .lesson-root .strategy-slot .feedback{transform:none!important}

  /* FactCard yorlig'i 10px edi. */
  .lesson-root .fact-card>b{font-size:12px!important}
}

@media(max-width:639.98px) and (max-height:700px){
  .lesson-root .stage-hook .group-cell{min-height:26px!important}
  .lesson-root .stage-hook .frame-note{padding:4px 5px!important}
}
/* OCHILMAGAN CHIPLAR SIG'IMI :: oxiri */

/* PLANSHET MASSHTAB QATLAMI :: boshi */
/* Desktop va planshetda ham ochilmagan bloklar translateY bilan pastga
   surilib, yakun ekrani va hook sahnasi chegarasidan chiqadi (yakun 7px,
   Bit oyoqlari 2-3px). Mobilda bu allaqachon tuzatilgan. */
.lesson-root .hook-frame-bit{bottom:0}
.lesson-root .g4-shared-finale .finale-layout{padding-bottom:9px}
.lesson-root .g4-shared-finale .finale-takeaway:not(.is-visible),.lesson-root .g4-shared-finale .finale-proof:not(.is-visible),.lesson-root .g4-shared-finale .finale-bridge:not(.is-visible){transform:none}
.lesson-root .hook-scene-visual{padding-top:10px;padding-bottom:10px}

@media(min-width:640px) and (max-height:870px){ .lesson-root{zoom:.96} }
@media(min-width:640px) and (max-height:830px){ .lesson-root{zoom:.92} }
@media(min-width:640px) and (max-height:790px){ .lesson-root{zoom:.87} }
@media(min-width:640px) and (max-height:750px){ .lesson-root{zoom:.83} }
@media(min-width:640px) and (max-height:700px){ .lesson-root{zoom:.77} }
@media(min-width:640px) and (max-height:650px){ .lesson-root{zoom:.72} }

/* Masshtab kichrayganda mikro yorliqlar vizual jihatdan yana kichrayadi,
   shuning uchun ularning shrifti ko'tariladi: .96-.83 masshtabda 12-13px
   asl 10-11px bilan bir xil ko'rinishni beradi. */
@media(min-width:640px) and (max-height:870px){
  .lesson-root .screen-type{font-size:12px}
  .lesson-root .heading>div>span,.lesson-root [data-g4-role="hook-topic"]{font-size:13px}
  .lesson-root .chrome-title>span:last-child{font-size:12px}
  .lesson-root .state-grid span{font-size:13px}
  .lesson-root .nl-dot{font-size:13px}
  .lesson-root .fact-card>b{font-size:12px}
  .lesson-root .option>b{font-size:12px}
  .lesson-root .model-choice>b{font-size:12px}
  .lesson-root .frame-note{font-size:13px}
  .lesson-root .frame-note>b{font-size:12px}
  .lesson-root .group-cell small,.lesson-root .group-cell b{font-size:13px}
  .lesson-root .g4-shared-finale .finale-heading>span,.lesson-root .g4-shared-finale .finale-proof>span,.lesson-root .g4-shared-finale .finale-bridge>div>strong{font-size:12px}
  .lesson-root .g4-shared-finale .finale-takeaway>span{font-size:12px}
}
/* PLANSHET MASSHTAB QATLAMI :: oxiri */

/* MASSHTABLANGAN BANDDA XAVFSIZ ZONA :: boshi */
@media(min-width:640px) and (max-width:1100px) and (max-height:870px){
  .lesson-root-preview .stage-header,.lesson-frame .lesson-root-preview .stage-header{padding-top:74px!important}
}
@media(min-width:640px) and (max-width:1100px) and (max-height:830px){
  .lesson-root-preview .stage-header,.lesson-frame .lesson-root-preview .stage-header{padding-top:78px!important}
}
@media(min-width:640px) and (max-width:1100px) and (max-height:790px){
  .lesson-root-preview .stage-header,.lesson-frame .lesson-root-preview .stage-header{padding-top:82px!important}
}
@media(min-width:640px) and (max-width:1100px) and (max-height:750px){
  .lesson-root-preview .stage-header,.lesson-frame .lesson-root-preview .stage-header{padding-top:86px!important}
}
@media(min-width:640px) and (max-width:1100px) and (max-height:700px){
  .lesson-root-preview .stage-header,.lesson-frame .lesson-root-preview .stage-header{padding-top:92px!important}
}
@media(min-width:640px) and (max-width:1100px) and (max-height:650px){
  .lesson-root-preview .stage-header,.lesson-frame .lesson-root-preview .stage-header{padding-top:98px!important}
}
/* MASSHTABLANGAN BANDDA XAVFSIZ ZONA :: oxiri */

/* OXIRGI SIG'IM TUZATISHLARI :: boshi */
/* Unvon tugmasi bosilganda translateY(-2px) bilan ko'tariladi va
   finale-layout ning yuqori chegarasidan chiqib qirqilardi. */
.lesson-root .g4-shared-finale .finale-layout{padding-top:3px}

/* Planshetda model ekrani ichki tekshiruv qo'shilgach 6-7px
   sig'masdi: bo'shliqlar hisobidan yechamiz, shrift tegilmaydi. */
@media(min-width:640px) and (max-width:1100px) and (max-height:870px){
  .lesson-root .inline-check{padding:7px 10px;gap:5px}
  .lesson-root .model-card{padding-bottom:12px}
  .lesson-root .stack{row-gap:8px}
}

/* Kichik telefonda ruscha matn uzunroq: model kartasiga zapas. */
@media(max-width:639.98px) and (max-height:700px){
  .lesson-root .model-card{padding-bottom:14px!important}
  .lesson-root .fraction-bar{height:44px!important}
  .lesson-root .inline-check{gap:4px!important}
}
/* OXIRGI SIG'IM TUZATISHLARI :: oxiri */
`;

const STYLES = `
.stage-hook .hook-model{position:relative;isolation:isolate;overflow:hidden;border:1px solid rgba(144,228,235,.12);border-radius:24px;background:radial-gradient(circle at 87% 24%,rgba(121,211,218,.16),transparent 24%),radial-gradient(circle at 9% 88%,rgba(149,201,61,.11),transparent 25%),linear-gradient(145deg,rgba(22,143,163,.25),transparent 48%),linear-gradient(135deg,#153B50,#0B2232 72%);box-shadow:0 22px 50px -30px rgba(14,33,44,.75)}
@media(max-width:639.98px){.stage-hook .hook-model{border-radius:18px}}
.g4-title-card-placeholder{width:100%;min-height:116px}
.g4-title-card{position:relative;isolation:isolate;width:100%;min-height:116px;margin:0;padding:12px 82px 11px 67px;border-radius:17px;display:flex;flex-direction:column;justify-content:center;gap:4px;overflow:hidden;color:#FFF;background:radial-gradient(circle at 82% 20%,rgba(255,194,60,.26),transparent 30%),linear-gradient(135deg,#173B52,#0E6978);box-shadow:0 28px 58px -27px rgba(22,143,163,.8);transform:translateY(-2px)}
.g4-title-card-medal{position:absolute;left:11px;top:50%;width:44px;height:44px;border:3px solid rgba(255,255,255,.58);border-radius:50%;display:grid;place-items:center;transform:translateY(-50%);color:#5A3A00;background:linear-gradient(145deg,#FFE284,#FFC23C);box-shadow:0 0 0 8px rgba(255,255,255,.08),0 15px 30px -15px rgba(0,0,0,.6);font-size:19px;z-index:2}
.g4-title-card-bit{position:absolute;right:3px;bottom:2px;width:72px;height:90px;z-index:2;animation:g4-title-card-bit-float 2.8s ease-in-out 1 both}.g4-title-card-bit>svg,.g4-title-card-bit .bit,.g4-title-card-bit .g1-char{width:100%;height:100%}
.g4-title-card-kicker{position:relative;color:#A8EAF0;font:900 10px/1.2 'JetBrains Mono',monospace;letter-spacing:.13em;z-index:2}.g4-title-card-title{position:relative;margin:0!important;font:750 clamp(16px,2.2vw,21px)/1.05 'Source Serif 4',Georgia,serif;z-index:2}.g4-title-card-score{position:relative;align-self:flex-start;margin-top:5px;padding:5px 9px;border-radius:10px;display:flex;align-items:center;gap:7px;background:rgba(255,255,255,.10);z-index:2}.g4-title-card-score strong{color:#FFE284;font-family:'JetBrains Mono',monospace}.g4-title-card-score span{color:rgba(255,255,255,.72);font-size:9px}
.g4-title-card-confetti{position:absolute;inset:0;pointer-events:none}.g4-title-card-confetti i{position:absolute;top:-16px;width:7px;height:12px;border-radius:2px;animation:g4-title-card-fall 2.4s linear 2 both}.g4-title-card-confetti i:nth-child(4n+1){background:#FFC23C}.g4-title-card-confetti i:nth-child(4n+2){background:#FF5B35}.g4-title-card-confetti i:nth-child(4n+3){background:#77E1EA}.g4-title-card-confetti i:nth-child(4n){background:#95C93D}.g4-title-card-confetti i:nth-child(1){left:8%;animation-delay:-.3s}.g4-title-card-confetti i:nth-child(2){left:17%;animation-delay:-1.1s}.g4-title-card-confetti i:nth-child(3){left:29%;animation-delay:-.7s}.g4-title-card-confetti i:nth-child(4){left:41%;animation-delay:-1.7s}.g4-title-card-confetti i:nth-child(5){left:52%;animation-delay:-.2s}.g4-title-card-confetti i:nth-child(6){left:63%;animation-delay:-1.3s}.g4-title-card-confetti i:nth-child(7){left:73%;animation-delay:-.8s}.g4-title-card-confetti i:nth-child(8){left:84%;animation-delay:-1.9s}.g4-title-card-confetti i:nth-child(9){left:12%;animation-delay:-2s}.g4-title-card-confetti i:nth-child(10){left:36%;animation-delay:-1.4s}.g4-title-card-confetti i:nth-child(11){left:68%;animation-delay:-.5s}.g4-title-card-confetti i:nth-child(12){left:91%;animation-delay:-1.6s}
.g4-title-reveal-overlay{position:fixed;inset:0;z-index:120;padding:0;display:grid;place-items:center;overflow:hidden;overscroll-behavior:contain;pointer-events:none;background:rgba(8,13,24,.64);backdrop-filter:blur(2px) saturate(.78);animation:g4-title-reveal-life 3.9s ease both}.g4-title-reveal-card{position:relative;isolation:isolate;width:100%;min-height:100dvh;padding:36px 24px;border:0;border-radius:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;overflow:hidden;color:#FFF;text-align:center;background:radial-gradient(circle at 50% 50%,rgba(255,214,80,.17),transparent 31%)}.g4-title-reveal-card::after{content:'';position:absolute;z-index:0;top:50%;left:50%;width:min(440px,82vw);height:min(440px,82vw);border-radius:50%;background:radial-gradient(circle,rgba(255,222,105,.17),transparent 68%);transform:translate(-50%,-50%)}
.g4-title-reveal-rays{position:absolute;z-index:0;top:50%;left:50%;width:160vmax;height:160vmax;border-radius:50%;opacity:.28;background:repeating-conic-gradient(from -4deg,rgba(255,218,91,.88) 0 8deg,transparent 8deg 20deg);transform:translate(-50%,-50%);animation:g4-title-reveal-rays-in .8s cubic-bezier(.16,1,.3,1) both,g4-title-reveal-rays-turn 26s linear .8s 1 both}.g4-title-reveal-medal{position:absolute;top:50%;left:50%;z-index:2;width:112px;height:112px;border:6px solid rgba(255,255,255,.72);border-radius:50%;display:grid;place-items:center;color:#653C00;background:linear-gradient(145deg,#FFF2A0,#FFC13B);box-shadow:0 0 0 13px rgba(255,255,255,.09),0 0 54px 10px rgba(255,204,63,.38),0 22px 38px -18px rgba(0,0,0,.7);font-size:52px;animation:g4-title-reveal-medal-in 1s cubic-bezier(.16,1,.3,1) .15s both}.g4-title-reveal-title{position:absolute;top:calc(50% + 82px);left:50%;z-index:2;width:min(680px,calc(100vw - 48px));margin:0!important;font:750 clamp(34px,5vw,58px)/1.02 'Source Serif 4',Georgia,serif;text-shadow:0 4px 24px rgba(0,0,0,.72);transform:translateX(-50%);animation:g4-title-reveal-title-in .7s ease .52s both}
.g4-title-reveal-confetti{position:absolute;inset:0;pointer-events:none}.g4-title-reveal-confetti i{position:absolute;top:-20px;width:8px;height:14px;border-radius:2px;background:#FFE284;animation:g4-title-reveal-fall 2.4s linear 2 both}.g4-title-reveal-confetti i:nth-child(3n+2){background:#FF7050}.g4-title-reveal-confetti i:nth-child(3n){background:#77E1EA}
@keyframes g4-title-card-bit-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}@keyframes g4-title-card-fall{to{transform:translateY(230px) rotate(460deg)}}@keyframes g4-title-reveal-life{0%{opacity:0}12%,84%{opacity:1}100%{opacity:0}}@keyframes g4-title-reveal-medal-in{from{opacity:0;transform:translate(-50%,-50%) scale(.25) rotate(-25deg)}to{opacity:1;transform:translate(-50%,-50%) scale(1) rotate(0)}}@keyframes g4-title-reveal-title-in{from{opacity:0;transform:translate(-50%,14px)}to{opacity:1;transform:translate(-50%,0)}}@keyframes g4-title-reveal-rays-in{from{opacity:0;transform:translate(-50%,-50%) scale(.5)}to{opacity:.28;transform:translate(-50%,-50%) scale(1)}}@keyframes g4-title-reveal-rays-turn{from{transform:translate(-50%,-50%) rotate(0)}to{transform:translate(-50%,-50%) rotate(360deg)}}@keyframes g4-title-reveal-fall{to{transform:translateY(470px) rotate(560deg)}}
@media(max-width:639.98px){.g4-title-card-placeholder{min-height:88px}.g4-title-card{min-height:88px;padding:9px 59px 8px 51px;border-radius:14px}.g4-title-card-medal{left:8px;width:34px;height:34px;font-size:14px}.g4-title-card-bit{width:57px;height:71px}.g4-title-card-title{font-size:14px}.g4-title-reveal-card{min-height:100dvh;padding:24px 18px}.g4-title-reveal-medal{width:88px;height:88px;border-width:5px;font-size:40px}.g4-title-reveal-title{top:calc(50% + 62px);font-size:29px}}
@media(prefers-reduced-motion:reduce){.g4-title-card,.g4-title-card-bit,.g4-title-reveal-overlay,.g4-title-reveal-rays,.g4-title-reveal-medal,.g4-title-reveal-title{animation:none!important}.g4-title-card{opacity:1;transform:none!important}.g4-title-card-confetti,.g4-title-reveal-confetti{display:none}.g4-title-reveal-overlay{opacity:1}.g4-title-reveal-rays{opacity:.28;transform:translate(-50%,-50%)}.g4-title-reveal-medal{opacity:1;transform:translate(-50%,-50%)}.g4-title-reveal-title{opacity:1;transform:translateX(-50%)}}
html:has(.lesson-root),body:has(.lesson-root),#root:has(.lesson-root),.lesson-page:has(.lesson-root),.lesson-frame:has(.lesson-root){width:100%;height:100%;min-height:0!important;margin:0;overflow:hidden!important;overscroll-behavior:none}
.lesson-root,.lesson-root *{box-sizing:border-box}.lesson-root h1,.lesson-root h2,.lesson-root h3,.lesson-root h4,.lesson-root h5,.lesson-root h6,.lesson-root p,.lesson-root ul,.lesson-root ol{margin:0}.lesson-root button,.lesson-root input{font:inherit}
.lesson-root{position:fixed;inset:0;width:100%;height:100%;min-height:0;overflow:hidden;zoom:var(--g4z,1);color:${T.ink};background:radial-gradient(circle at 88% 9%,rgba(22,143,163,.11),transparent 25%),linear-gradient(145deg,#F7F8F4,#EEF3F1);font-family:'Manrope',system-ui,sans-serif}
.stage{width:min(936px,100%);height:100%;margin:0 auto;display:flex;flex-direction:column;overflow:hidden}.stage-header{flex-shrink:0;padding-top:10px;padding-bottom:8px;background:rgba(247,248,244,.88);backdrop-filter:blur(14px);z-index:5}.progress-track{width:100%;height:6px;margin-bottom:10px;border-radius:999px;background:rgba(80,97,109,.16);overflow:hidden}.progress-fill{height:100%;border-radius:inherit;background:linear-gradient(90deg,${T.cyan},${T.accent});box-shadow:0 0 12px rgba(255,91,53,.42);transition:width .45s ease}.stage-chrome{min-width:0;display:flex;justify-content:space-between;align-items:center;gap:12px}.chrome-title,.chrome-actions,.audio-controls{display:flex;align-items:center;gap:9px}.chrome-title{min-width:0;overflow:hidden;color:${T.ink2};font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}.chrome-title>span:last-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.chrome-actions{flex:none}.status-dot{width:8px;height:8px;flex:none;border-radius:50%;background:${T.accent};box-shadow:0 0 10px rgba(255,91,53,.65)}.screen-type{padding:4px 8px;border-radius:999px;color:${T.cyan};background:${T.cyanSoft};font-size:10px;font-weight:800}.screen-count{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700}.icon-btn{width:44px;height:44px;padding:0;border:0;border-radius:10px;color:${T.ink2};background:rgba(255,255,255,.75);cursor:pointer;box-shadow:0 4px 12px -7px rgba(${T.shadowBase},.3)}
.stage-content{flex:1 1 auto;min-height:0;padding-top:10px;padding-bottom:16px;overflow:hidden}.stage-nav{flex:0 0 auto;min-height:72px;display:flex;align-items:center;justify-content:space-between;gap:12px;background:rgba(245,245,240,.95)}.btn-white-accent,.btn-ghost{min-width:128px;min-height:50px;padding:0 18px;border:0;border-radius:15px;cursor:pointer;font-weight:900}.btn-white-accent{color:${T.accent};background:#fff;box-shadow:0 12px 24px -17px rgba(255,91,53,.8)}.btn-white-accent:hover:not(:disabled){color:#fff;background:${T.accent}}.btn-white-accent:disabled{opacity:.42;cursor:not-allowed}.btn-ghost{color:${T.ink2};background:transparent}.btn-ghost:hover{background:#fff;box-shadow:0 10px 20px -16px rgba(${T.shadowBase},.5)}.compact{min-width:118px}.stack{height:100%;min-height:0;overflow:hidden;display:grid;align-content:start;gap:14px;animation:page-in .45s cubic-bezier(.16,1,.3,1) both}.heading{min-height:78px;display:flex;align-items:center;justify-content:space-between;gap:16px}.heading>div>span{color:${T.cyan};font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.heading h1{margin-top:4px!important;font:750 clamp(25px,4vw,38px)/1.06 'Source Serif 4',Georgia,serif}.heading .g1-char{width:78px;height:98px;flex:0 0 auto;overflow:visible;filter:drop-shadow(0 9px 11px rgba(23,59,82,.2))}.question,.model-card,.duel,.why-grid,.compare-card,.rule-card,.boundary,.summary-grid{padding:18px;border-radius:22px;background:rgba(255,255,255,.9);box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.48)}.question{display:grid;gap:13px}.question h2{font:720 clamp(17px,2.5vw,22px)/1.25 'Source Serif 4',Georgia,serif}.options{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.option{min-height:62px;padding:10px;border:0;border-radius:16px;display:grid;grid-template-columns:28px 1fr;align-items:center;gap:8px;color:${T.ink};background:#F8F8F4;text-align:left;cursor:pointer;box-shadow:0 10px 22px -20px rgba(${T.shadowBase},.46)}.option>b{width:27px;height:27px;border-radius:9px;display:grid;place-items:center;color:${T.cyan};background:${T.cyanSoft};font:900 11px 'JetBrains Mono',monospace}.option.picked{transform:translateY(-2px);background:${T.accentSoft};box-shadow:inset 0 0 0 2px rgba(255,91,53,.27)}.option.right{background:${T.successSoft};box-shadow:inset 0 0 0 2px rgba(34,122,83,.25)}.option.bad{background:${T.warnSoft};box-shadow:inset 0 0 0 2px rgba(169,111,19,.25)}.feedback{padding:12px 14px;border-radius:15px;display:grid;grid-template-columns:28px 1fr;gap:9px;align-items:start;opacity:0;transform:translateY(7px)}.feedback.open{opacity:1;transform:none;transition:.3s ease}.feedback.correct{background:${T.successSoft};box-shadow:inset 4px 0 ${T.success}}.feedback.wrong{background:${T.warnSoft};box-shadow:inset 4px 0 ${T.warn}}.feedback>b{font-size:18px}.feedback p{font-size:13px;line-height:1.45}.caption{position:static;bottom:4px;margin-top:12px;padding:9px 13px;border-radius:13px;color:#fff;background:rgba(23,59,82,.94);font-size:12px;line-height:1.4;z-index:3}
.proof{padding:12px;border-radius:14px;color:${T.success};background:${T.successSoft};text-align:center;font:900 15px 'JetBrains Mono',monospace;animation:proof-in .35s ease both}.frac{display:inline-flex;min-width:25px;flex-direction:column;align-items:center;vertical-align:middle;color:inherit;font:800 1em/1 'JetBrains Mono',monospace}.frac i{width:100%;height:2px;margin:2px 0;border-radius:2px;background:currentColor}.frac-lg{font-size:1.35em}.hook-model,.whole-card,.rule-card,.finale-payoff{padding:18px;border-radius:22px;background:rgba(255,255,255,.9);box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.48)}
.lesson-root button:focus-visible,.lesson-root input:focus-visible,.lesson-root input[type='range']:focus-visible{outline:3px solid ${T.cyan};outline-offset:3px}
.hook-model{display:grid;place-items:center;gap:12px;background:linear-gradient(135deg,#E5F5F6,#FFF)}.fraction-model{width:min(620px,94%);margin:0 auto;display:grid;gap:10px}.fraction-bar{height:112px;display:grid;overflow:hidden;border-radius:18px;background:#F4F5F1;box-shadow:inset 0 0 0 3px rgba(23,59,82,.16)}.fraction-bar i{min-width:0;border-right:2px solid rgba(23,59,82,.18);background:#F4F5F1;transition:background .45s ease,transform .45s ease}.fraction-bar i:last-child{border-right:0}.fraction-bar i.cyan{background:#46B8C5}.fraction-bar i.lime{background:#95C93D}.fraction-bar i.removed{background:repeating-linear-gradient(135deg,rgba(255,91,53,.12),rgba(255,91,53,.12) 7px,rgba(255,91,53,.42) 7px,rgba(255,91,53,.42) 14px)}.fraction-bar i.merged{background:linear-gradient(135deg,#168FA3,#95C93D)}.fraction-bar.whole i{border-right:0}.fraction-model.compact .fraction-bar{height:48px;border-radius:11px}.model-label{justify-self:center;padding:8px 13px;border-radius:12px;color:#173B52;background:#E5F5F6;font:900 16px "JetBrains Mono",monospace}.state-note,.formula-card,.result-chip{padding:12px 15px;border-radius:14px;opacity:.12;transform:translateY(7px);transition:.4s ease;text-align:center}.state-note{color:#227A53;background:#E7F3EC;font-size:13px;font-weight:850}.formula-card{color:#FFF;background:#173B52;font:900 17px "JetBrains Mono",monospace}.result-chip{justify-self:center;color:#FFF;background:#FF5B35;font:900 20px "JetBrains Mono",monospace}.show{opacity:1!important;transform:none!important}.tokens{display:flex;align-items:center;justify-content:center;gap:8px;color:#50616D;font-size:12px;font-weight:800}.tokens i{width:28px;height:28px;border-radius:9px;background:#95C93D;animation:token-pop .4s ease both}.tokens i:nth-child(2){animation-delay:.1s}.tokens i:nth-child(3){animation-delay:.2s}.rule-card,.whole-card{display:grid;gap:12px}.rule-line{padding:13px;border-radius:14px;opacity:.12;transform:translateY(6px);color:#173B52;background:#E5F5F6;text-align:center;font:900 18px "JetBrains Mono",monospace;transition:.4s ease}.rule-line.accent{color:#FFF;background:#173B52}.wrong-formula{padding:12px;position:relative;opacity:.12;color:#A96F13;background:#FFF5D9;text-align:center;font:900 18px "JetBrains Mono",monospace;transition:.4s ease}.wrong-formula::after{content:"";position:absolute;left:28%;right:28%;top:50%;height:3px;transform:rotate(-8deg);background:#FF5B35}.tank-model{width:min(560px,96%);margin:0 auto;display:grid;place-items:center;gap:10px}.tank-shell{width:min(360px,82%);height:210px;position:relative;padding:16px 16px 14px;border:5px solid ${T.navy};border-top:0;border-radius:0 0 34px 34px;background:rgba(255,255,255,.72);filter:drop-shadow(0 14px 16px rgba(${T.shadowBase},.13))}.tank-body{height:100%;overflow:hidden;border-radius:6px 6px 22px 22px;display:flex;flex-direction:column-reverse;background:#F4F5F1}.tank-body i{min-height:0;flex:1;border-top:2px solid rgba(23,59,82,.18);transition:background .38s ease,opacity .38s ease,transform .38s ease}.tank-body i:first-child{border-top:0}.tank-body i.tank-fill{background:linear-gradient(90deg,#46B8C5,${T.cyan})}.tank-body i.tank-outline{box-shadow:inset 0 0 0 3px ${T.lime}}.tank-body i.tank-removed{background:repeating-linear-gradient(135deg,rgba(255,91,53,.16),rgba(255,91,53,.16) 8px,rgba(255,91,53,.48) 8px,rgba(255,91,53,.48) 16px);animation:tank-out .42s ease both}.tank-shell.undivided .tank-body i{border-top-color:transparent}.tank-spout{width:76px;height:19px;position:absolute;left:-63px;top:-4px;border:5px solid ${T.navy};border-right:0;border-radius:13px 0 0 13px;background:#fff}.tank-handle{width:70px;height:90px;position:absolute;right:-46px;top:44px;border:12px solid ${T.navy};border-left:0;border-radius:0 38px 38px 0}.tank-model.compact .tank-shell{width:190px;height:92px;padding:7px;border-width:3px;border-radius:0 0 18px 18px}.tank-model.compact .tank-spout{width:32px;height:10px;left:-27px;border-width:3px}.tank-model.compact .tank-handle{width:34px;height:45px;right:-24px;top:18px;border-width:7px}.state-grid{margin-top:12px;display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.state-grid span{min-height:52px;padding:9px;border-radius:13px;display:grid;place-items:center;opacity:.12;transform:translateY(6px);color:${T.navy};background:${T.cyanSoft};text-align:center;font-size:11px;font-weight:850;transition:.38s ease}.boundary-grid{padding:18px;border-radius:22px;display:grid;grid-template-columns:1fr 1fr;gap:12px;background:rgba(255,255,255,.9);box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.48)}.boundary-grid>div{padding:10px;border-radius:16px;opacity:.12;transform:translateY(6px);background:#F8F8F4;transition:.4s ease}.boundary-grid>.state-note{grid-column:1/-1}.hospital-model{padding:14px;border-radius:18px;display:flex;align-items:center;justify-content:center;gap:14px;background:${T.cyanSoft}}.hospital-model>span{width:42px;height:42px;border-radius:13px;display:grid;place-items:center;color:#fff;background:${T.accent};font:900 27px 'JetBrains Mono',monospace}.nl-arrow.back{border-right:0;border-left:3px solid ${T.accent};border-radius:14px 0 0 0}.nl-arrow.back::after{right:auto;left:-5px;border-left:0;border-right:8px solid ${T.accent}}.number-line{height:150px;position:relative;padding:54px 7% 0}.nl-track{height:4px;position:relative;border-radius:4px;background:#173B52}.nl-tick{width:2px;height:18px;position:absolute;top:-7px;background:#87949D}.nl-tick span{position:absolute;top:20px;left:50%;transform:translateX(-50%);font:800 12px "JetBrains Mono",monospace}.nl-dot{width:44px;height:38px;position:absolute;top:27px;transform:translateX(-50%);border-radius:12px;display:grid;place-items:center;color:#FFF;font:900 11px "JetBrains Mono",monospace;z-index:2;animation:dot-pop .35s ease both}.nl-dot.cyan{background:#168FA3}.nl-dot.lime{background:#95C93D}.nl-arrow{height:22px;position:absolute;top:84px;border-top:3px solid #FF5B35;border-right:3px solid #FF5B35;border-radius:0 14px 0 0;animation:arrow-grow .45s ease both}.nl-arrow::after{content:"";position:absolute;right:-5px;top:-7px;border-left:8px solid #FF5B35;border-top:5px solid transparent;border-bottom:5px solid transparent}.model-choices{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.model-choices>div{padding:10px;border-radius:15px;display:grid;grid-template-columns:26px 1fr;align-items:center;gap:6px;background:#FFF;box-shadow:0 12px 24px -20px rgba(58,53,48,.6)}.model-choices>div>b{width:25px;height:25px;border-radius:8px;display:grid;place-items:center;color:#FFF;background:#168FA3;font:900 10px "JetBrains Mono",monospace}.bit-error{padding:14px;border-radius:18px;display:flex;align-items:center;justify-content:center;gap:12px;color:#A96F13;background:#FFF5D9;font:900 19px "JetBrains Mono",monospace}.bit-error b{position:relative}.bit-error b::after{content:"";position:absolute;left:-5px;right:-5px;top:50%;height:3px;transform:rotate(-8deg);background:#FF5B35}.energy-model{display:grid;grid-template-columns:1fr 32px 1fr;align-items:center;gap:8px}.energy-model>div{padding:10px;border-radius:15px;display:grid;grid-template-columns:30px 1fr;align-items:center;gap:8px;background:#FFF}.energy-model>div>span{font-size:23px}.energy-model>strong{text-align:center;color:#FF5B35;font-size:23px}.finale-heading{padding:11px 15px;border-radius:17px;background:linear-gradient(100deg,rgba(255,91,53,.09),transparent 52%),rgba(255,255,255,.92);box-shadow:0 13px 28px -24px rgba(255,91,53,.72)}.finale-heading>span{color:#FF5B35;font:900 9px "JetBrains Mono",monospace;letter-spacing:.12em}.finale-heading h1{margin-top:4px!important;color:#173B52;font:750 clamp(21px,3vw,28px)/1.08 "Source Serif 4",Georgia,serif}.finale-heading p{margin-top:4px!important;color:#50616D;font-size:11px}.finale-main{display:grid;grid-template-columns:minmax(270px,.9fr) minmax(310px,1.1fr);gap:10px}.finale-payoff{display:grid;align-content:center;gap:8px}.finale-payoff>small{color:#168FA3;font-size:9px;font-weight:900;letter-spacing:.09em}.finale-answer{padding:8px 10px;border-radius:11px;opacity:.14;transform:translateY(5px);color:#227A53;background:#E7F3EC;text-align:center;font:900 13px "JetBrains Mono",monospace;transition:.42s ease}.finale-takeaways{display:grid;gap:6px}.finale-takeaway{min-height:42px;padding:7px 10px;border-radius:12px;display:grid;grid-template-columns:27px 1fr;align-items:center;gap:8px;opacity:.14;transform:translateY(6px);background:#F8F8F4;transition:.42s ease}.finale-takeaway.show{background:#E5F5F6}.finale-takeaway>b{width:26px;height:26px;border-radius:9px;display:grid;place-items:center;color:#FFF;background:#168FA3;font:900 9px "JetBrains Mono",monospace}.finale-takeaway span{display:grid;gap:2px;font-size:11px;font-weight:800}.finale-takeaway small{color:#168FA3;font-size:8px;text-transform:uppercase}.finale-takeaway strong{color:#173B52;font-family:"JetBrains Mono",monospace}.finale-bottom{display:grid;grid-template-columns:1.2fr .8fr;gap:10px}.finale-bridge{padding:12px 15px;border-radius:16px;display:grid;align-content:center;gap:4px;opacity:.14;transform:translateY(6px);color:#FFF;background:#173B52;transition:.42s ease}.finale-bridge small{color:#98E1E5;font-size:9px;font-weight:900;letter-spacing:.1em}.finale-bridge strong{font:750 15px "Source Serif 4",Georgia,serif}.finale-reward{min-height:100px;position:relative;overflow:hidden;padding:12px 70px 11px 52px;border-radius:17px;display:grid;align-content:center;color:#FFF;background:linear-gradient(135deg,#234B62,#173B52)}.finale-reward>div:nth-child(2){display:grid;gap:3px}.finale-reward small{color:#98E1E5;font-size:8px;font-weight:900}.finale-reward strong{font:750 14px "Source Serif 4",Georgia,serif}.finale-reward b{color:#FFE284;font:900 11px "JetBrains Mono",monospace}.finale-reward>.g1-char{position:absolute;right:2px;bottom:-5px;width:67px;height:84px}.finale-medal{position:absolute;left:10px;top:50%;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;transform:translateY(-50%);color:#173B52;background:#95C93D}.preview-language{position:fixed;top:9px;right:9px;z-index:30;display:flex;gap:3px;padding:3px;border-radius:999px;background:rgba(255,255,255,.94)}.preview-language button{padding:4px 9px;border:0;border-radius:999px;background:transparent;cursor:pointer;font-size:10px;font-weight:900}.preview-language .preview-active{color:#FFF;background:#FF5B35}.tiny-action{min-height:46px;padding:8px 12px;border:0;border-radius:13px;justify-self:end;color:${T.accent};background:${T.accentSoft};cursor:pointer;box-shadow:0 8px 18px -16px rgba(${T.shadowBase},.5);font-size:12px;font-weight:800}.marker-control{width:min(620px,94%);padding:10px 13px;border-radius:14px;display:grid;gap:7px;color:${T.navy};background:${T.cyanSoft};font:850 12px 'Manrope',sans-serif}.free-marker{width:100%;min-height:44px;margin:0;accent-color:${T.accent};cursor:pointer}.nl-dot.free{top:102px;background:${T.navy};animation-duration:.4s}.attempt-model{border-radius:20px;transition:box-shadow .32s ease,background .32s ease}.attempt-highlight{box-shadow:0 0 0 3px rgba(22,143,163,.38),0 14px 26px -20px rgba(22,143,163,.8)!important;background:rgba(229,245,246,.72)!important}.attempt-cue{padding:9px 12px;border-radius:12px;color:${T.cyan};background:${T.cyanSoft};font-size:12px;font-weight:850;animation:attempt-cue-in .3s ease both}.stack{animation-duration:.5s}.caption{animation:caption-in .32s ease both}.formula-card{transition-duration:.32s!important}.result-chip{transition-duration:.22s!important}
@keyframes tank-out{from{opacity:0;transform:translateY(-10px)}}@keyframes caption-in{from{opacity:0;transform:translateY(5px)}}@keyframes attempt-cue-in{from{opacity:0;transform:translateY(5px)}}@keyframes page-in{from{opacity:0;transform:translateY(10px)}}@keyframes proof-in{from{opacity:0;transform:translateY(5px)}}@keyframes token-pop{from{opacity:0;transform:scale(.45)}}@keyframes dot-pop{from{opacity:0;transform:translateX(-50%) scale(.55)}}@keyframes arrow-grow{from{transform:scaleX(0);transform-origin:left}}@keyframes pulse{to{transform:scale(1.07)}}
@media(max-width:639.98px){.stage-header{padding-top:58px}.screen-type{display:none}.stage{width:min(390px,100%)}.heading{min-height:72px}.heading h1{font-size:26px}.heading .g1-char{width:65px;height:80px}.model-card,.hook-model,.whole-card,.rule-card,.question{padding:13px;border-radius:18px}.options{grid-template-columns:1fr}.option{min-height:52px}.fraction-bar{height:82px}.tank-shell{width:min(292px,78%);height:168px}.state-grid{grid-template-columns:1fr 1fr}.boundary-grid{grid-template-columns:1fr}.boundary-grid>.state-note{grid-column:1}.hospital-model{padding-inline:7px}.model-choices{grid-template-columns:1fr}.energy-model{grid-template-columns:1fr}.energy-model>strong{transform:rotate(90deg)}.stage-nav{min-height:68px}.btn-white-accent,.btn-ghost{min-width:112px;padding:0 12px}.finale-main,.finale-bottom{grid-template-columns:1fr}.finale-main,.finale-bottom{gap:8px}.finale-takeaway{min-height:36px}.number-line{height:135px;padding-inline:9%}}
.g4-title-claim{width:100%;min-height:100px;padding:13px 18px;border:0;border-radius:17px;display:grid;grid-template-columns:42px 1fr;grid-template-rows:auto auto;align-items:center;column-gap:12px;color:#fff;background:linear-gradient(135deg,#0E6978,#173B52);cursor:pointer;text-align:left;box-shadow:0 22px 42px -25px rgba(14,105,120,.9)}.g4-title-claim>span{grid-row:1/3;width:40px;height:40px;border-radius:50%;display:grid;place-items:center;color:#5A3A00;background:linear-gradient(145deg,#FFE284,#FFC23C);font-size:19px}.g4-title-claim>strong{font:750 16px 'Source Serif 4',Georgia,serif}.g4-title-claim>small{color:#A8EAF0;font-size:11px;font-weight:800}
.feedback{min-height:76px!important;padding:11px 15px 11px 10px!important;grid-template-columns:52px 1fr!important;align-items:center!important;gap:11px!important}.feedback.correct{background:linear-gradient(135deg,#DDF2E6,#F7FFF9)!important;box-shadow:inset 5px 0 ${T.success},0 13px 26px -23px rgba(34,122,83,.75)!important}.feedback.wrong{background:linear-gradient(135deg,#FFF0BE,#FFF9E8)!important;box-shadow:inset 5px 0 ${T.warn},0 13px 26px -23px rgba(169,111,19,.72)!important}.feedback-bit{width:50px;height:62px;display:block;overflow:visible}.feedback-bit .g1-char,.feedback-bit .bit,.feedback-bit>svg{width:100%;height:100%}.feedback p{display:grid;gap:7px;font-size:15px!important;line-height:1.48!important}.feedback-proof{padding-top:7px;border-top:1px solid rgba(34,122,83,.2);color:${T.success};font:900 15px/1.35 'JetBrains Mono',monospace}
.model-choices{grid-template-columns:1fr!important;gap:11px!important}.model-choice{width:100%;min-height:100px;padding:11px 13px;border:0;border-radius:16px;display:grid;grid-template-columns:32px minmax(140px,.8fr) minmax(250px,1.2fr);align-items:center;gap:11px;color:${T.ink};background:#fff;cursor:pointer;text-align:left;box-shadow:0 12px 24px -20px rgba(58,53,48,.6)}.model-choice>b{width:30px;height:30px;border-radius:9px;display:grid;place-items:center;color:#fff;background:${T.cyan};font:900 11px 'JetBrains Mono',monospace}.model-choice>span{font-size:14px;font-weight:850}.model-choice .fraction-model{width:100%}.model-choice.picked{background:${T.accentSoft};box-shadow:inset 0 0 0 3px rgba(255,91,53,.25)}.model-choice.right{background:${T.successSoft};box-shadow:inset 0 0 0 3px rgba(34,122,83,.3)}.model-choice.bad{background:${T.warnSoft};box-shadow:inset 0 0 0 3px rgba(169,111,19,.26)}.model-choice:disabled{cursor:default}
.rule-boundary-models{padding:13px;border-radius:19px;display:grid;grid-template-columns:1fr 34px 1fr;align-items:center;gap:10px;background:${T.cyanSoft}}.rule-boundary-models>div{padding:10px;border-radius:14px;display:grid;grid-template-columns:44px 1fr;align-items:center;gap:9px;background:#fff}.rule-boundary-models>strong{text-align:center;color:${T.accent};font:900 24px 'JetBrains Mono',monospace}.rule-boundary-models .frac{font-size:18px}.tank-body i.tank-removed{opacity:.58}
@media(max-width:639.98px){.g4-title-claim{min-height:88px}.feedback{grid-template-columns:44px 1fr!important}.feedback-bit{width:43px;height:54px}.feedback p{font-size:14px!important}.model-choice{min-height:126px;grid-template-columns:30px 1fr}.model-choice>.fraction-model{grid-column:1/-1}.rule-boundary-models{grid-template-columns:1fr}.rule-boundary-models>strong{transform:rotate(90deg)}}
@media(prefers-reduced-motion:reduce){.lesson-root *,.lesson-root *::before,.lesson-root *::after{scroll-behavior:auto!important;animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important}.state-note,.formula-card,.result-chip,.rule-line,.wrong-formula,.finale-answer,.finale-takeaway,.finale-bridge{opacity:1!important;transform:none!important}}
.caption-slot{flex:none;min-height:38px;padding:6px 10px;border-radius:11px;display:flex;align-items:center;visibility:hidden;color:#fff;background:rgba(23,59,82,.94);font-size:10px;line-height:1.22}.caption-slot.is-visible{visibility:visible}.feedback.feedback-slot{height:76px;min-height:76px;overflow:hidden;visibility:hidden;opacity:0;animation:none}.feedback.feedback-slot.open{visibility:visible;opacity:1}.feedback-bit{width:48px;height:58px;display:block}.feedback-bit .g1-char,.feedback-bit>svg{width:100%;height:100%}.feedback-proof{display:block;margin-top:4px;padding-top:4px;border-top:1px solid rgba(34,122,83,.2);color:${T.success};font:900 12px/1.2 'JetBrains Mono',monospace}.feedback-proof small{display:block;font-size:8px;letter-spacing:.1em}.lesson-root{height:100%!important;min-height:0!important;overflow:hidden!important}.stage-content{display:flex;flex-direction:column;gap:4px;overflow:hidden!important}.stage-content>.stack{flex:1;min-height:0}.btn-white-accent:disabled{cursor:not-allowed;opacity:.46}
@media(max-width:639.98px){.stage-header{padding-top:11px!important;padding-bottom:4px!important}.lesson-root-preview .stage-header{padding-top:52px!important}.progress-track{height:4px!important;margin-bottom:5px!important}.stage-content{padding-top:3px!important;padding-bottom:3px!important}.stage-nav{min-height:52px!important}.stack{gap:4px!important}.heading{min-height:40px!important}.heading h1{font-size:17px!important}.heading .g1-char{width:38px!important;height:48px!important}.question,.model-card,.visual-card,.hook-model,.whole-card,.rule-card,.beat-list{padding:5px!important;border-radius:11px!important}.boundary-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:4px!important;padding:5px!important;border-radius:11px!important}.boundary-grid>div{padding:4px!important;border-radius:9px!important}.boundary-grid>.state-note{grid-column:1/-1!important}.boundary-grid .fraction-model{gap:3px!important}.boundary-grid .fraction-bar{height:44px!important;border-radius:9px!important}.boundary-grid .model-label{padding:4px 6px!important;border-radius:8px!important;font-size:9px!important}.options{gap:3px!important}.option{min-height:44px!important;padding:4px!important;border-radius:9px!important;font-size:9px!important}.feedback.feedback-slot{height:54px;min-height:54px!important;padding:4px 6px!important;grid-template-columns:32px 1fr!important;gap:4px!important}.feedback-bit{width:31px;height:39px}.feedback p{font-size:9px!important;line-height:1.16!important}.caption-slot{min-height:28px;padding:3px 7px;font-size:8px}.beat-list{gap:3px!important}.beat{min-height:29px!important;padding:3px!important;font-size:8px!important}.btn-white-accent,.btn-ghost{min-height:44px!important;min-width:104px!important;padding:0 8px!important;font-size:11px!important}.finale-main,.finale-bottom{grid-template-columns:1fr 1fr!important;gap:4px!important}}
.strategy-replay{min-height:44px;padding:7px 12px;border:0;border-radius:11px;justify-self:center;color:${T.cyan};background:${T.cyanSoft};cursor:pointer;font-size:11px;font-weight:850}.strategy-replay:disabled{cursor:not-allowed;opacity:.46}
@media(min-width:640px) and (max-width:1100px) and (max-height:800px){.stage-discovery .stack{grid-template-columns:minmax(0,1fr) minmax(0,1fr);grid-template-rows:auto minmax(0,1fr) auto;align-content:stretch;column-gap:12px;row-gap:8px}.stage-discovery .heading{grid-column:1/-1;min-height:64px}.stage-discovery .heading h1{font-size:29px}.stage-discovery .heading .g1-char{width:60px;height:75px}.stage-discovery .model-card{grid-column:1/-1;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);align-items:center;gap:10px;padding:12px}.stage-discovery .tank-model{width:100%}.stage-discovery .tank-shell{width:min(300px,80%);height:174px}.stage-discovery .formula-card,.stage-discovery .state-note,.stage-discovery .result-chip{min-height:44px;display:grid;place-items:center}.stage-discovery .strategy-replay{grid-column:1/-1}}
.final-reflection{padding:6px 8px;border-radius:12px;display:grid;gap:5px;background:rgba(255,255,255,.9)}.final-reflection>strong{font:750 12px/1.2 'Source Serif 4',Georgia,serif}.final-reflection>div{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px}.final-reflection button{min-height:44px;padding:4px;border:0;border-radius:9px;display:grid;grid-template-columns:20px 1fr;align-items:center;gap:3px;color:${T.navy};background:${T.cyanSoft};cursor:pointer;text-align:left;font-size:8px;font-weight:850}.final-reflection button>span{width:19px;height:19px;border-radius:6px;display:grid;place-items:center;color:#fff;background:${T.cyan}}.final-reflection button.is-selected{color:#fff;background:${T.cyan}}.final-reflection button:disabled{cursor:default}.g4-title-claim:disabled{cursor:not-allowed;opacity:.46}
`;

// ---------------------------------------------------------------------------
// 21-DARS USLUBLARI. s0 dan boshqa hamma ekranda ramka och ko'k (T.cyanSoft).
// Balandlik dvh bilan chegaralangan: joy kamayganda model kichrayadi, matn
// esa qirqilmaydi - shuning uchun skroll ham, yo'qolgan element ham yo'q.
// Takrorlanuvchi (cheksiz) animatsiya yo'q; reduced-motion hammasini o'chiradi.

const LESSON_STYLES = `
.lesson-root .mono { font-family: 'JetBrains Mono', monospace; font-weight: 800; }
/* Asosiy model ramkasi ekran balandligining bir qismini egallaydi: shunda
   pastda katta bo'sh joy qolmaydi, lekin dvh chegarasi tufayli sig'maslik ham
   yuz bermaydi. */
.lesson-root .stack > .model-card { min-height: clamp(128px, 24dvh, 236px); }
/* Kontent yuqoridan boshlanadi (metodist talabi 2026-08-19): sarlavha va
   ramkalar ekranning yuqori qismidan yoziladi, markazga surilmaydi. */
.lesson-root .stage-content > .stack { align-content: start; }
.lesson-root .stack > .model-card.compact { min-height: 0; }
/* Model kartasi ichidagi yorliq va natija qatori ham markazda turadi. */
.lesson-root .stack > .model-card { justify-items: center; }
/* Tanlangan noto'g'ri variant joyida qoladi, lekin xiralashadi va bosilmaydi. */
.lesson-root .option.bad { opacity: .6; cursor: default; }
.lesson-root .option:disabled { cursor: default; }
/* To'rt variant 2x2 setkada (uch variant bir qatorda qoladi). */
.lesson-root .options:has(> :nth-child(4)) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.lesson-root .lead-line {
  margin: 0;
  color: ${T.ink2};
  font-size: clamp(13px, 1.7vw, 15px);
  line-height: 1.36;
  font-weight: 650;
}

/* --- Qadamli tushuntirish paneli ------------------------------------------ */
.step-panel {
  position: relative;
  isolation: isolate;
  min-width: 0;
  min-height: clamp(228px, 44dvh, 392px);
  overflow: hidden;
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto auto auto;
  gap: clamp(6px, 1.1dvh, 12px);
  padding: clamp(9px, 1.4dvh, 14px);
  border: 1px solid rgba(22,143,163,.22);
  border-radius: 18px;
  background: ${T.cyanSoft};
  box-shadow: 0 14px 30px -26px rgba(${T.shadowBase},.5);
}
.step-model {
  min-height: 0;
  max-height: clamp(118px, 32dvh, 286px);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.step-model > * { width: 100%; }
.step-chips { display: flex; flex-wrap: wrap; gap: 6px; }
.step-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 26px;
  padding: 4px 10px 4px 5px;
  border-radius: 999px;
  color: ${T.ink3};
  background: rgba(255,255,255,.66);
  font-size: 11px;
  font-weight: 800;
  transition: color .3s ease, background .3s ease;
}
.step-chip b {
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  color: #FFFFFF;
  background: ${T.ink3};
  font-size: 10px;
}
.step-chip.is-done { color: ${T.ink}; background: #FFFFFF; }
.step-chip.is-done b { background: ${T.success}; }
.step-chip.is-active { box-shadow: 0 0 0 2px rgba(22,143,163,.35); }
.step-caption {
  margin: 0;
  min-height: 40px;
  color: ${T.ink};
  font-size: clamp(13px, 1.8vw, 15px);
  line-height: 1.36;
  font-weight: 700;
}
.step-actions { display: flex; align-items: center; gap: 10px; }
.btn-step {
  min-height: 44px;
  padding: 0 18px;
  border: 0;
  border-radius: 13px;
  color: #FFFFFF;
  background: ${T.cyan};
  font-family: inherit;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  transition: background .25s ease, transform .25s ease;
}
.btn-step:hover:not(:disabled) { background: ${T.navy}; transform: translateY(-1px); }
.btn-step:disabled { opacity: .45; cursor: default; }
.btn-step:focus-visible { outline: 3px solid ${T.accent}; outline-offset: 2px; }
.step-done {
  color: ${T.success};
  font-size: clamp(12px, 1.6vw, 14px);
  font-weight: 800;
  line-height: 1.32;
}

/* --- Quvvat zaxirasi modeli ----------------------------------------------- */
.model-note { color: ${T.cyan}; font-size: clamp(16px, 2.4vw, 21px); }
.stack-model { display: grid; gap: 8px; justify-items: center; width: 100%; }

/* --- Yozuvning qadamlab yig'ilishi ---------------------------------------- */
.record-steps { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; }
.record-step {
  padding: 5px 12px;
  border-radius: 11px;
  color: ${T.ink};
  background: #FFFFFF;
  box-shadow: inset 0 0 0 1px rgba(22,143,163,.22);
  font-size: clamp(13px, 1.9vw, 16px);
}

/* --- Komil yozuvlari (bir amal / ikki amal) ------------------------------- */

/* --- Raqam terish paneli (klaviatura yo'q) -------------------------------- */
.tap-pad { display: grid; gap: 8px; justify-items: center; width: 100%; }
.tap-display {
  min-width: 132px;
  min-height: 44px;
  padding: 4px 16px;
  border-radius: 13px;
  display: inline-flex;
  align-items: baseline;
  justify-content: center;
  gap: 6px;
  color: ${T.ink};
  background: #FFFFFF;
  box-shadow: inset 0 0 0 2px rgba(22,143,163,.28);
  font-size: clamp(19px, 3vw, 25px);
}
.tap-display small { color: ${T.ink2}; font-size: 12px; font-weight: 800; }
.tap-display.is-ok { color: ${T.success}; box-shadow: inset 0 0 0 2px ${T.success}; }
.tap-display.is-bad { color: #B85C32; box-shadow: inset 0 0 0 2px #B85C32; }
.tap-keys {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 5px;
  width: min(430px, 100%);
}
.tap-key {
  min-height: 44px;
  padding: 0;
  border: 1px solid rgba(22,143,163,.3);
  border-radius: 11px;
  color: ${T.ink};
  background: #FFFFFF;
  font-family: 'JetBrains Mono', monospace;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  transition: background .22s ease;
}
.tap-key:hover:not(:disabled) { background: ${T.cyanSoft}; }
.tap-key:focus-visible { outline: 3px solid ${T.accent}; outline-offset: 2px; }
.tap-key:disabled { opacity: .5; cursor: default; }
.tap-back { color: ${T.ink2}; }
.tap-check {
  grid-column: span 2;
  color: #FFFFFF;
  background: ${T.cyan};
  border-color: ${T.cyan};
  font-family: inherit;
  font-size: 13px;
}
.tap-check:hover:not(:disabled) { background: ${T.navy}; }
.match-value { color: ${T.cyan}; font-size: clamp(16px, 2.4vw, 21px); }


/* --- Bit xatosi ----------------------------------------------------------- */
.error-card {
  position: relative;
  isolation: isolate;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: clamp(10px, 1.6dvh, 16px);
  border: 1px solid rgba(169,111,19,.28);
  border-radius: 18px;
  background: ${T.warnSoft};
}
.error-record { display: grid; gap: 3px; justify-items: center; }
.error-record span { color: ${T.ink2}; font-size: clamp(15px, 2.2vw, 19px); }
.error-record b { color: #B85C32; font-size: clamp(19px, 3vw, 26px); }
.error-mark { color: #B85C32; font-size: 22px; font-weight: 900; }

/* --- Jadval --------------------------------------------------------------- */
.task-table { width: min(430px, 100%); display: grid; gap: 3px; }
.task-row { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 3px; }
.task-row span {
  padding: 6px 5px;
  border-radius: 9px;
  background: #FFFFFF;
  text-align: center;
  font-size: 13px;
  font-weight: 800;
}
.task-head span { color: ${T.ink2}; background: rgba(255,255,255,.6); font-size: 10px; font-weight: 800; }
.task-chip {
  padding: 3px 11px;
  border-radius: 999px;
  color: ${T.cyan};
  background: #FFFFFF;
  font-size: 14px;
}
.remaining-line { color: ${T.ink2}; font-size: 13px; font-weight: 700; }
.remaining-line b { color: ${T.cyan}; font-size: 15px; }

/* --- Ikki yo'l: ramkalar bir xil o'lchamda, markazda --------------------- */

/* --- Moslashtirish: ikki ustun bir xil o'lchamda, markazda ---------------- */
/* Ikkala ustun bir xil kenglikda, kartalar bir xil balandlikda (grid qatorlari
   teng) va butun taxta markazda - metodist sharti 5. */
.matching-board {
  position: relative;
  isolation: isolate;
  width: min(620px, 100%);
  margin-inline: auto;
  min-height: clamp(206px, 40dvh, 340px);
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(28px, 6vw, 56px);
}
.matching-column {
  display: grid;
  grid-template-rows: repeat(3, minmax(0, 1fr));
  gap: 9px;
  align-content: stretch;
}
.match-card {
  position: relative;
  z-index: 2;
  height: 100%;
  min-height: 62px;
  padding: 9px;
  border: 1px solid rgba(22,143,163,.26);
  border-radius: 14px;
  display: grid;
  align-content: center;
  justify-items: center;
  gap: 5px;
  color: ${T.ink};
  background: ${T.cyanSoft};
  font-family: inherit;
  font-size: 14px;
  cursor: pointer;
  transition: background .25s ease, border-color .25s ease;
}
.match-card:hover:not(:disabled) { background: #FFFFFF; }
.match-card:focus-visible { outline: 3px solid ${T.accent}; outline-offset: 2px; }
.match-card.is-active { border-color: ${T.accent}; background: #FFFFFF; box-shadow: 0 0 0 2px rgba(255,91,53,.28); }
.match-card.is-done { border-color: ${T.success}; background: ${T.successSoft}; cursor: default; }
.match-caption { color: ${T.cyan}; font-size: 13px; }
.match-card .fraction-model { width: 100%; }

/* --- Qoida ramkasi -------------------------------------------------------- */
.rule-frame {
  position: relative;
  min-width: 0;
  min-height: clamp(168px, 30dvh, 264px);
  align-content: center;
  overflow: hidden;
  display: grid;
  gap: 7px;
  padding: clamp(10px, 1.5dvh, 15px);
  border: 1px solid rgba(22,143,163,.24);
  border-left: 4px solid ${T.accent};
  border-radius: 16px;
  background: ${T.cyanSoft};
}
.rule-badge {
  justify-self: start;
  padding: 2px 10px;
  border-radius: 999px;
  color: #FFFFFF;
  background: ${T.accent};
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .08em;
}
.rule-text {
  margin: 0;
  color: ${T.ink};
  font-size: clamp(13px, 1.9vw, 16px);
  line-height: 1.38;
  font-weight: 750;
  opacity: .25;
  transition: opacity .5s ease;
}
.rule-text.show { opacity: 1; }
.rule-lines { display: flex; flex-wrap: wrap; gap: 6px; }
.rule-lines .rule-line { padding: 5px 11px; border-radius: 999px; background: #FFFFFF; font: 800 12px 'Manrope', system-ui, sans-serif; color: ${T.ink2}; }
.rule-formula {
  justify-self: center;
  color: ${T.cyan};
  font-size: clamp(17px, 2.6vw, 22px);
  opacity: .25;
  transition: opacity .5s ease;
}
.rule-formula.show { opacity: 1; }
.rule-source { color: ${T.ink3}; font-size: 10px; font-weight: 700; }

/* --- Xuk yozuvi va mayda joylar ------------------------------------------ */
.hook-record {
  margin-top: 7px;
  color: #EAF9FB;
  font-size: clamp(14px, 2.1vw, 18px);
  opacity: 0;
  transition: opacity .6s ease;
}
.hook-record.show { opacity: 1; }
.hook-record b { color: #FF9F80; }
.round-meter {
  justify-self: start;
  padding: 3px 10px;
  border-radius: 999px;
  color: ${T.cyan};
  background: ${T.cyanSoft};
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 800;
}
.round-question { display: grid; gap: 9px; }
.round-question > h2 { color: ${T.ink}; font-size: clamp(18px, 2.8vw, 24px); }
.strategy-question, .case-question {
  margin: 0;
  color: ${T.ink};
  font-size: clamp(15px, 2.2vw, 18px);
  line-height: 1.3;
  font-weight: 800;
}

@media (max-width: 639.98px) {
  .step-panel { padding: 8px; gap: 6px; }
  .step-caption { min-height: 34px; font-size: 12.5px; }
  .step-chip { font-size: 10px; }
  .tap-keys { gap: 4px; }
  .tap-key { font-size: 14px; }
  .route-cards { grid-template-columns: 1fr; gap: 7px; }
  .route-card { min-height: 74px; }
  .matching-board { gap: 22px; }
  .match-card { min-height: 54px; font-size: 12.5px; }
  .komil-grid { grid-template-columns: 1fr; gap: 7px; }
  .energy-blocks { padding: 5px; }
}

@media (prefers-reduced-motion: reduce) {
  .step-chip, .btn-step, .route-card, .match-card, .tap-key,
  .rule-text, .rule-formula, .hook-record, .energy-block, .komil-case { transition: none !important; }
}

/* --- Yakuniy slayd (etalon Dars01 tuzilishi) ---------------------------- */
.option-answer-dismiss {
  animation: answer-option-dismiss .46s cubic-bezier(.4,0,.7,1) var(--answer-exit-delay, 0ms) both;
}
.option-answer-confirm {
  animation: answer-option-confirm .62s cubic-bezier(.16,1,.3,1) .08s both;
}
@keyframes answer-option-dismiss {
  from { opacity: 1; transform: translateY(0) scale(1); }
  to { opacity: 0; transform: translateY(-8px) scale(.96); }
}
@keyframes answer-option-confirm {
  0% { transform: translateY(0) scale(1); box-shadow: 0 10px 24px -17px rgba(${T.shadowBase},.44); }
  45% { transform: translateY(-7px) scale(1.025); box-shadow: 0 0 0 6px rgba(34,122,83,.10); }
  100% { transform: translateY(-3px) scale(1); box-shadow: 0 12px 26px -17px rgba(34,122,83,.45); }
}

.summary-stack { gap: 12px; }
.reward-stage {
  position: relative;
  width: min(840px, 100%);
  min-height: 154px;
  margin: 0 auto;
  padding: 16px 145px 15px 108px;
  border-radius: 25px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  overflow: hidden;
  color: #FFFFFF;
  background:
    radial-gradient(circle at 82% 20%, rgba(255,194,60,.26), transparent 30%),
    linear-gradient(135deg, #173B52, #0E6978);
  box-shadow: 0 24px 50px -30px rgba(14,33,44,.8);
  transition: transform .5s ease, box-shadow .5s ease;
}
.reward-locked { filter: saturate(.72); }
.reward-unlocked {
  transform: translateY(-2px);
  box-shadow: 0 28px 58px -27px rgba(22,143,163,.8);
}
.reward-bit {
  position: absolute;
  right: 24px;
  bottom: 7px;
  width: 92px;
  height: 115px;
}
.reward-bit .g1-char { width: 100%; height: 100%; }
.reward-unlocked .reward-bit { animation: g4bitfloat 2.8s ease-in-out 4; }
.reward-medal {
  position: absolute;
  left: 24px;
  top: 50%;
  width: 66px;
  height: 66px;
  border: 4px solid rgba(255,255,255,.58);
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #5A3A00;
  background: linear-gradient(145deg, #FFE284, #FFC23C);
  box-shadow: 0 0 0 8px rgba(255,255,255,.08), 0 15px 30px -15px rgba(0,0,0,.6);
  font-size: 30px;
}
.reward-kicker {
  color: #A8EAF0;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: .13em;
}
.reward-stage h1 {
  max-width: 590px;
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: clamp(21px, 3vw, 30px);
  line-height: 1.05;
}
.reward-stage > p {
  max-width: 580px;
  color: rgba(255,255,255,.78);
  font-size: 12px;
  line-height: 1.4;
}
.reward-score {
  align-self: flex-start;
  margin-top: 5px;
  padding: 5px 9px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 7px;
  background: rgba(255,255,255,.10);
}
.reward-score strong { color: #FFE284; font-family: 'JetBrains Mono', monospace; }
.reward-score span { color: rgba(255,255,255,.72); font-size: 9px; }
.reward-confetti { position: absolute; inset: 0; pointer-events: none; }
.reward-confetti i {
  position: absolute;
  top: -16px;
  width: 7px;
  height: 12px;
  border-radius: 2px;
  animation: reward-confetti 2.4s linear 3;
}
.reward-confetti i:nth-child(4n+1) { background: #FFC23C; }
.reward-confetti i:nth-child(4n+2) { background: #FF5B35; }
.reward-confetti i:nth-child(4n+3) { background: #77E1EA; }
.reward-confetti i:nth-child(4n) { background: #95C93D; }
.reward-confetti i:nth-child(1) { left: 8%; animation-delay: -.3s; }
.reward-confetti i:nth-child(2) { left: 17%; animation-delay: -1.1s; }
.reward-confetti i:nth-child(3) { left: 29%; animation-delay: -.7s; }
.reward-confetti i:nth-child(4) { left: 41%; animation-delay: -1.7s; }
.reward-confetti i:nth-child(5) { left: 52%; animation-delay: -.2s; }
.reward-confetti i:nth-child(6) { left: 63%; animation-delay: -1.3s; }
.reward-confetti i:nth-child(7) { left: 73%; animation-delay: -.8s; }
.reward-confetti i:nth-child(8) { left: 84%; animation-delay: -1.9s; }
.reward-confetti i:nth-child(9) { left: 12%; animation-delay: -2s; }
.reward-confetti i:nth-child(10) { left: 36%; animation-delay: -1.4s; }
.reward-confetti i:nth-child(11) { left: 68%; animation-delay: -.5s; }
.reward-confetti i:nth-child(12) { left: 91%; animation-delay: -1.6s; }
@keyframes reward-confetti {
  to { transform: translateY(230px) rotate(460deg); }
}

.summary-action-layout {
  min-height: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  align-items: stretch;
}

.summary-rule-items {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: 1fr;
  gap: 6px;
}
.summary-rule-items > span {
  min-width: 0;
  padding: 7px;
  border: 1px solid rgba(22,143,163,.11);
  border-radius: 11px;
  display: grid;
  grid-template-columns: 22px 1fr;
  align-items: center;
  gap: 6px;
  color: ${T.ink2};
  background: rgba(255,255,255,.82);
}
.reflection-card > .summary-question-kicker,
.reflection-card > .summary-question,
.reflection-card > .summary-question-stem,
.reflection-card > .reflection-options,
.reflection-card > .reflection-resolution,
.reflection-card > .feedback {
  flex-shrink: 0;
}
.reflection-resolution {
  display: grid;
  gap: 7px;
}
.summary-card h2 { margin-bottom: 8px; font-size: 14px; }
.summary-card ul { padding-left: 17px; display: grid; gap: 5px; color: ${T.ink2}; font-size: 12px; line-height: 1.35; }
.summary-question-kicker {
  margin-bottom: 4px;
  color: ${T.accent};
  font-family: 'JetBrains Mono', monospace;
  font-size: 8px;
  font-weight: 900;
  letter-spacing: .1em;
}
.summary-card .summary-question {
  margin-bottom: 4px;
  color: ${T.navy};
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: 15px;
  line-height: 1.18;
}
.summary-question-stem {
  margin-bottom: 7px !important;
  color: ${T.ink2};
  font-size: 10px;
  line-height: 1.3;
}
.reflection-options {
  max-height: 180px;
  display: grid;
  gap: 6px;
  overflow: hidden;
  opacity: 1;
  transition:
    max-height .75s cubic-bezier(.22,.8,.3,1) .48s,
    opacity .28s ease .52s,
    margin .75s cubic-bezier(.22,.8,.3,1) .48s;
}
.reflection-options-solved {
  max-height: 0;
  margin-block: 0;
  opacity: 0;
  pointer-events: none;
}
.reflection-option {
  min-height: 34px;
  padding: 7px 9px;
  border: 0;
  border-radius: 10px;
  color: ${T.ink};
  background: #F4F7F5;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  text-align: left;
  font-size: 11px;
  font-weight: 700;
}
.reflection-option > span {
  width: 21px;
  height: 21px;
  flex: 0 0 21px;
  border-radius: 7px;
  display: grid;
  place-items: center;
  color: ${T.cyan};
  background: ${T.cyanSoft};
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  font-weight: 900;
}
.reflection-correct { color: ${T.success}; background: ${T.successSoft}; }
.reflection-wrong { color: ${T.warn}; background: ${T.warnSoft}; }
.reflection-solved {
  min-height: 42px;
  padding: 9px 11px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  color: ${T.success};
  background: ${T.successSoft};
  font-size: 11px;
  font-weight: 800;
}
.reflection-card .feedback-card {
  min-height: 62px;
  padding: 5px 10px 5px 6px;
}
.reflection-card .g4-bit-reaction-figure {
  width: 44px;
  height: 54px;
  flex-basis: 44px;
}
.reflection-card .g4-bit-reaction-copy { font-size: 14px; }
.final-mission-heading {
  width: min(840px, 100%);
  margin: 0 auto;
  padding: 12px 16px;
  border: 1px solid rgba(255,91,53,.17);
  border-radius: 17px;
  background:
    linear-gradient(100deg, rgba(255,91,53,.09), transparent 48%),
    rgba(255,255,255,.9);
  box-shadow: 0 13px 28px -24px rgba(255,91,53,.72);
}
.final-mission-heading > span {
  display: flex;
  align-items: center;
  gap: 7px;
  color: ${T.accent};
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: .12em;
}
.final-mission-heading > span i {
  font-size: 8px;
  animation: final-marker-pulse 1.5s ease-in-out 3;
}
.final-mission-heading h1 {
  margin-top: 3px;
  color: ${T.navy};
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: clamp(21px, 3vw, 28px);
  line-height: 1.08;
}
.final-mission-heading p {
  margin-top: 3px;
  color: ${T.ink2};
  font-size: 11px;
  line-height: 1.32;
}
@keyframes final-marker-pulse {
  50% { opacity: .45; transform: scale(.8); }
}
.summary-final-layout {
  width: min(840px, 100%);
  margin: 0 auto;
  grid-template-columns: minmax(0, 1fr);
  align-items: start;
}
.summary-card {
  min-width: 0;
  height: 100%;
  padding: 13px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  background: rgba(255,255,255,.92);
  box-shadow: 0 12px 26px -21px rgba(${T.shadowBase},.5);
}
.reflection-card > .summary-question-kicker,
.reflection-card > .summary-question,
.reflection-card > .summary-question-stem,
.reflection-card > .reflection-options,
.reflection-card > .reflection-resolution,
.reflection-card > .feedback {
  flex-shrink: 0;
}
.final-question-card {
  height: auto;
  border: 2px solid rgba(255,91,53,.22);
  box-shadow:
    inset 0 4px 0 rgba(255,91,53,.88),
    0 18px 38px -28px rgba(255,91,53,.7);
}
.final-question-card .summary-question-kicker {
  min-height: 25px;
  margin-bottom: 8px;
  padding: 4px 6px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #FFFFFF;
  background: linear-gradient(90deg, ${T.accent}, #FF7658);
}
.final-question-card .summary-question-kicker > b {
  margin-left: auto;
  padding: 3px 6px;
  border-radius: 999px;
  color: #7D250F;
  background: rgba(255,255,255,.76);
  font-size: 7px;
  letter-spacing: .08em;
}
.final-question-card .summary-question {
  font-size: clamp(17px, 2.4vw, 22px);
  line-height: 1.18;
}
.summary-support-column {
  min-width: 0;
  display: grid;
  gap: 9px;
}
.summary-rules-disclosure {
  min-width: 0;
  border: 1px solid rgba(22,143,163,.2);
  border-radius: 16px;
  overflow: hidden;
  background: rgba(255,255,255,.94);
  box-shadow: 0 14px 30px -24px rgba(22,143,163,.72);
}
.summary-rules-toggle {
  width: 100%;
  min-height: 64px;
  padding: 8px 10px;
  border: 0;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 9px;
  color: ${T.ink};
  background:
    linear-gradient(135deg, rgba(230,247,250,.8), transparent 62%),
    #FFFFFF;
  cursor: pointer;
  text-align: left;
}
.summary-rules-toggle > span {
  min-width: 55px;
  padding: 7px 8px;
  border-radius: 10px;
  color: #FFFFFF;
  background: ${T.cyan};
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 900;
  text-align: center;
}
.summary-rules-toggle > div { min-width: 0; display: grid; gap: 2px; }
.summary-rules-toggle strong { font-size: 13px; line-height: 1.2; }
.summary-rules-toggle small { color: ${T.cyan}; font-size: 9px; font-weight: 800; }
.summary-rules-toggle > i {
  color: ${T.cyan};
  font-size: 24px;
  font-style: normal;
  transform: rotate(0);
  transition: transform .55s cubic-bezier(.16,1,.3,1);
}
.summary-rules-open .summary-rules-toggle > i { transform: rotate(180deg); }
.summary-rules-panel {
  max-height: 0;
  padding: 0 9px;
  overflow: hidden;
  opacity: 0;
  transform: translateY(-7px);
  transition:
    max-height .65s cubic-bezier(.22,.8,.3,1),
    padding .65s cubic-bezier(.22,.8,.3,1),
    opacity .4s ease,
    transform .55s ease;
}
.summary-rules-open .summary-rules-panel {
  max-height: 260px;
  padding: 0 9px 9px;
  opacity: 1;
  transform: translateY(0);
}
.summary-rules-panel .summary-rule-items > span {
  padding: 6px;
  grid-template-columns: 20px 1fr;
  gap: 5px;
}
.summary-rules-panel .summary-rule-items > span > i {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: ${T.cyan};
  background: ${T.cyanSoft};
  font-family: 'JetBrains Mono', monospace;
  font-size: 8px;
  font-style: normal;
}
.summary-rules-panel .summary-rule-items p { font-size: 9px; line-height: 1.22; }
.reward-stage-compact {
  width: 100%;
  min-height: 116px;
  margin: 0;
  padding: 12px 82px 11px 67px;
  border-radius: 17px;
  gap: 4px;
}
.reward-stage-compact .reward-medal {
  left: 11px;
  width: 44px;
  height: 44px;
  border-width: 3px;
  font-size: 19px;
}
.reward-stage-compact .reward-bit {
  right: 3px;
  bottom: 2px;
  width: 72px;
  height: 90px;
}
.reward-stage-compact h2 {
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: clamp(16px, 2.2vw, 21px);
  line-height: 1.05;
}

/* Yakuniy slaydning mobil o'lchamlari (etalon Dars01 bilan bir xil) */
@media (max-width: 639.98px) {
  .summary-action-layout {
    grid-template-columns: 1fr;
    grid-auto-rows: auto;
    align-items: start;
    gap: 6px;
  }
  .summary-card { height: auto; }
  .summary-rule-items { gap: 4px; }
  .summary-rule-items > span { padding: 4px; grid-template-columns: 18px 1fr; gap: 4px; }
  .summary-card { padding: 8px; }
  .summary-card h2 { margin-bottom: 5px; font-size: 12px; }
  .summary-question-kicker { font-size: 7px; }
  .summary-card .summary-question { margin-bottom: 3px; font-size: 12px; }
  .summary-question-stem { margin-bottom: 4px !important; font-size: 8px; }
  .reflection-options { grid-template-columns: 1fr; gap: 4px; }
  .reflection-option { min-height: 30px; padding: 4px 6px; font-size: 9px; }
  .reflection-option > span { width: 18px; height: 18px; flex-basis: 18px; font-size: 7px; }
  .final-mission-heading { padding: 8px 10px; border-radius: 13px; }
  .final-mission-heading > span { font-size: 7px; }
  .final-mission-heading h1 { margin-top: 2px; font-size: 18px; }
  .final-mission-heading p { font-size: 8px; line-height: 1.25; }
  .summary-final-layout { grid-template-columns: 1fr; gap: 6px; }
  .final-question-card { padding: 9px; }
  .final-question-card .summary-question-kicker { min-height: 23px; margin-bottom: 6px; font-size: 7px; }
  .final-question-card .summary-question { margin-bottom: 4px; font-size: 17px; line-height: 1.16; }
  .final-question-card .summary-question-stem { font-size: 9px; }
  .summary-support-column { gap: 6px; }
  .summary-rules-toggle { min-height: 52px; padding: 6px 8px; gap: 7px; }
  .summary-rules-toggle > span { min-width: 48px; padding: 6px; font-size: 9px; }
  .summary-rules-toggle strong { font-size: 11px; }
  .summary-rules-toggle small { font-size: 7px; }
  .summary-rules-toggle > i { font-size: 20px; }
  .summary-rules-open .summary-rules-panel { max-height: 210px; padding: 0 7px 7px; }
  .summary-rules-panel .summary-rule-items > span { padding: 4px; grid-template-columns: 18px 1fr; }
  .summary-rules-panel .summary-rule-items > span > i { width: 18px; height: 18px; font-size: 7px; }
  .summary-rules-panel .summary-rule-items p { font-size: 7px; }
  .reward-stage-compact {
    min-height: 88px;
    padding: 9px 59px 8px 51px;
    border-radius: 14px;
  }
  .reward-stage-compact .reward-medal { left: 8px; width: 34px; height: 34px; font-size: 14px; }
  .reward-stage-compact .reward-bit { width: 57px; height: 71px; }
  .reward-stage-compact h2 { margin: 0; font-size: 14px; }
}

/* Yakuniy slayd 360x640 da ham to'liq sig'adi: savol va variantlar bir pog'ona
   kichrayadi, mukofot paneli ixchamlashadi. */
@media (max-width: 639.98px) {
  .summary-stack { gap: 5px; }
  .final-mission-heading { padding: 6px 9px; }
  .final-mission-heading h1 { font-size: 15px; }
  .final-mission-heading p { font-size: 8px; }
  .final-question-card { padding: 8px; }
  .final-question-card .summary-question { margin-bottom: 3px; font-size: 13px; line-height: 1.18; }
  .final-question-card .summary-question-kicker { min-height: 19px; margin-bottom: 4px; }
  .reflection-options { gap: 3px; }
  .reflection-option { min-height: 26px; padding: 3px 6px; font-size: 8.5px; }
  .summary-support-column { gap: 5px; }
  .summary-rules-toggle { min-height: 40px; padding: 5px 7px; }
  .reward-stage-compact { min-height: 74px; padding: 7px 52px 6px 46px; }
  .reward-stage-compact h2 { font-size: 12px; }
  .reward-stage-compact .reward-bit { width: 48px; height: 60px; }
  .reward-stage-compact .reward-medal { width: 28px; height: 28px; font-size: 12px; }
}

/* Eng kichik ekran (360x640) uchun yakuniy pog'ona: 13 px yetishmasligi
   yopiladi, matn o'lchamlari o'zgarmaydi. */
@media (max-width: 400px) {
  .summary-stack { gap: 4px; }
  .final-mission-heading { padding: 5px 8px; }
  .reflection-option { min-height: 24px; }
  .summary-rules-toggle { min-height: 36px; }
  .reward-stage-compact { min-height: 66px; padding: 6px 50px 5px 44px; }
}

/* Javobdan keyingi yechim ramkasi mobilda ixchamlashadi: aks holda yakuniy
   slayd 360 px da 11 px ga sig'may qolardi. */
@media (max-width: 639.98px) {
  .reflection-resolution .feedback { min-height: 58px !important; padding: 6px 10px 6px 7px !important; }
  .reflection-resolution .feedback-bit { width: 42px !important; height: 52px !important; }
  .reflection-resolution .feedback p { font-size: 9px !important; line-height: 1.28 !important; }
  .reflection-resolution .proof-label { font-size: 7px !important; }
  .reflection-resolution .feedback-proof { font-size: 9px !important; }
}

/* Yakuniy savoldagi izoh ramkasi mobilda ixcham: xato javobdan keyin ham slayd
   sig'adi. Kanonik 88 px o'lchami boshqa ekranlarda o'zgarmaydi. */
@media (max-width: 639.98px) {
  .lesson-root .reflection-card .feedback[data-g4-role~="feedback-frame"] {
    min-height: 56px !important;
    padding: 5px 9px 5px 6px !important;
    grid-template-columns: 40px minmax(0, 1fr) !important;
  }
  .lesson-root .reflection-card .feedback[data-g4-role~="feedback-frame"] .feedback-bit { width: 40px !important; height: 50px !important; }
  .lesson-root .reflection-card .feedback[data-g4-role~="feedback-frame"] p { font-size: 8.5px !important; line-height: 1.26 !important; }
  .lesson-root .reflection-card .feedback[data-g4-role~="feedback-frame"] .proof-label { font-size: 7px !important; }
  .lesson-root .reflection-card .feedback[data-g4-role~="feedback-frame"] .feedback-proof { font-size: 8.5px !important; }
}

/* 360 px da yakuniy slaydning yordamchi qatori yashiriladi: variantlar to'liq
   gap bo'lgani uchun "Ayirishda men..." kirish qatori ma'no yo'qotmaydi. */
@media (max-width: 400px) {
  .final-question-card .summary-question-stem { display: none; }
  .final-mission-heading p { font-size: 7.5px; line-height: 1.2; }
  .summary-question-kicker > b { font-size: 6.5px; }
}

/* --- Yakuniy savol ramkasi: etalon o'lchamlari (override qatlamidan ustun) --- */
.lesson-root .final-question-card .summary-question { font-size: clamp(17px, 2.4vw, 22px); line-height: 1.18; }
.lesson-root .reflection-card .reflection-option { font-size: 11px; font-weight: 700; }
.lesson-root .reflection-card .reflection-option > span { font-size: 9px; }
/* Javob berilmaganda izoh sloti joy egallamaydi: etalonda ham balandligi nol. */
.lesson-root .reflection-card > .feedback:not(.open) { min-height: 0 !important; height: 0; padding: 0 !important; overflow: hidden; }
@media (max-width: 639.98px) {
  .lesson-root .final-question-card .summary-question { font-size: 13px; line-height: 1.18; }
  .lesson-root .reflection-card .reflection-option { font-size: 8.5px; }
  .lesson-root .reflection-card .reflection-option > span { font-size: 7px; }
}

/* --- "Davom etish" tugmasi: yumshoq hover ------------------------------- */
.lesson-root .stage-nav .btn-white-accent:hover:not(:disabled) {
  color: ${T.accent};
  background: ${T.accentSoft};
  box-shadow: 0 12px 26px -18px rgba(255,91,53,.55), inset 0 0 0 1px rgba(255,91,53,.28);
  transform: translateY(-1px);
}
.lesson-root .stage-nav .btn-white-accent:active:not(:disabled) {
  background: ${T.accentSoft};
  transform: translateY(0);
}

/* -------------------------------------------------------------------------
   23-DARSNING O'Z QATLAMI. Imzo modeli - qism va butun tasmasi: daftarda
   qolgan qism to'q rangda, noma'lum ulushlar uzuq chiziqli bo'sh joyda.
   ------------------------------------------------------------------------- */
.pwbar {
  display: grid;
  gap: 7px;
  justify-items: center;
  width: 100%;
}
.pwbar-track {
  display: grid;
  gap: 6px;
  width: min(520px, 100%);
}
.pwbar.compact .pwbar-track { width: min(440px, 100%); }
.pwbar-cell {
  height: 44px;
  border-radius: 12px;
  transition: background .28s ease, box-shadow .28s ease;
}
.pwbar.compact .pwbar-cell { height: 34px; }
.pwbar-cell.is-known {
  background: linear-gradient(160deg, #1E7285 0%, #10505F 100%);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .18), 0 6px 14px -10px rgba(16, 80, 95, .8);
}
.pwbar-cell.is-spent {
  background: linear-gradient(160deg, #CBD6DC 0%, #A9B9C1 100%);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .35);
}
.pwbar-cell.is-unknown {
  background: repeating-linear-gradient(135deg, ${T.paper} 0 6px, #EEF3F5 6px 12px);
  box-shadow: inset 0 0 0 2px #C9D5DB;
}
.pwbar-legend {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  width: min(520px, 100%);
}
.pwbar.compact .pwbar-legend { width: min(440px, 100%); }
.pwbar-known {
  font-size: 14px;
  font-weight: 800;
  color: #10505F;
}
.pwbar-whole {
  font-size: 20px;
  font-weight: 800;
  color: ${T.accent};
  min-width: 42px;
  text-align: right;
}
.pwbar-one {
  display: inline-flex;
  align-items: baseline;
  gap: 5px;
  padding: 4px 12px;
  border-radius: 999px;
  background: ${T.cyanSoft};
  box-shadow: inset 0 0 0 1px rgba(22, 143, 163, .28);
}
.pwbar-one b { font-size: 19px; color: ${T.cyan}; }
.pwbar-one small { font-size: 12px; color: ${T.ink2}; }

/* Ombor daftarining qatori: butun ustuni o'chgan holatda xira turadi. */
.ledger {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  width: min(520px, 100%);
}
.ledger-cell {
  display: grid;
  gap: 3px;
  justify-items: center;
  padding: 9px 10px;
  border-radius: 14px;
  background: ${T.paper};
  box-shadow: inset 0 0 0 1px rgba(${T.shadowBase}, .14), 0 8px 18px -16px rgba(${T.shadowBase}, .5);
}
.ledger-cell small {
  font-size: 11px;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: ${T.ink3};
}
.ledger-cell b { font-size: 19px; color: ${T.ink}; }
.ledger-cell.is-faded {
  background: repeating-linear-gradient(135deg, #FBFBF8 0 7px, #F1F1EC 7px 14px);
}
.ledger-cell.is-faded b { color: ${T.ink3}; }

/* Butunni ulushdan yig'ish. Bola maxrajga yetganda o'zi to'xtaydi. */
.builder {
  display: grid;
  gap: 10px;
  justify-items: center;
  width: 100%;
}
.builder-track {
  display: flex;
  gap: 6px;
  justify-content: center;
  flex-wrap: wrap;
}
.builder-cell {
  display: grid;
  place-items: center;
  width: 46px;
  height: 40px;
  border-radius: 12px;
  font: 700 14px/1 'JetBrains Mono', monospace;
  color: ${T.paper};
  background: repeating-linear-gradient(135deg, ${T.paper} 0 6px, #EEF3F5 6px 12px);
  box-shadow: inset 0 0 0 2px #C9D5DB;
  transition: background .24s ease, box-shadow .24s ease;
}
.builder-cell.is-filled {
  background: linear-gradient(160deg, #1E7285 0%, #10505F 100%);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .18), 0 6px 14px -10px rgba(16, 80, 95, .8);
}
.builder-sum {
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
  min-width: 128px;
  justify-content: center;
  padding: 7px 16px;
  border-radius: 14px;
  background: ${T.paper};
  box-shadow: inset 0 0 0 1px rgba(${T.shadowBase}, .16);
}
.builder-sum span { font-size: 24px; font-weight: 800; color: ${T.ink}; }
.builder-sum small { font-size: 12px; color: ${T.ink2}; }
.builder-sum.is-ok {
  background: ${T.successSoft};
  box-shadow: inset 0 0 0 2px rgba(34, 122, 83, .4);
}
.builder-sum.is-ok span { color: ${T.success}; }
.builder-sum.is-bad {
  background: ${T.accentSoft};
  box-shadow: inset 0 0 0 2px rgba(255, 91, 53, .38);
}
.builder-sum.is-bad span { color: ${T.accent}; }
.builder-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}
.builder-actions .btn-ghost {
  min-width: 44px;
  min-height: 44px;
  border: none;
  border-radius: 12px;
  background: ${T.paper};
  color: ${T.ink2};
  font-size: 17px;
  cursor: pointer;
  box-shadow: inset 0 0 0 1px rgba(${T.shadowBase}, .16);
}
.builder-actions .btn-ghost:disabled { opacity: .45; cursor: default; }
.btn-step-done {
  background: ${T.cyan};
  color: ${T.paper};
}

/* Amallar tartibi: ikkita karta, o'lchami bir xil va markazda. */
.order-cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  width: min(460px, 100%);
  margin: 0 auto;
}
.order-card {
  display: grid;
  gap: 3px;
  justify-items: center;
  min-height: 92px;
  padding: 10px 12px;
  border: none;
  border-radius: 16px;
  background: ${T.paper};
  cursor: pointer;
  box-shadow: inset 0 0 0 1px rgba(${T.shadowBase}, .16), 0 10px 22px -18px rgba(${T.shadowBase}, .55);
  transition: box-shadow .22s ease, transform .22s ease;
}
.order-card:hover:not(:disabled) { transform: translateY(-1px); }
.order-card.is-placed {
  background: ${T.cyanSoft};
  box-shadow: inset 0 0 0 2px rgba(22, 143, 163, .45);
}
.order-card.is-wrong {
  background: ${T.accentSoft};
  box-shadow: inset 0 0 0 2px rgba(255, 91, 53, .45);
}
.order-index {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  font: 700 12px/1 'Manrope', system-ui, sans-serif;
  color: ${T.paper};
  background: ${T.cyan};
  opacity: 0;
}
.order-card.is-placed .order-index { opacity: 1; }
.order-label { font-size: 22px; font-weight: 800; color: ${T.ink}; }
.order-caption { font-size: 12px; color: ${T.ink2}; text-align: center; }
.order-line {
  margin-top: 10px;
  text-align: center;
  font-size: 19px;
  font-weight: 800;
  color: ${T.ink};
  letter-spacing: .04em;
}

/* Ikki yo'nalishni ajratish: karta bosiladi, keyin ustun bosiladi. */
.sort-board {
  display: grid;
  gap: 10px;
  width: min(560px, 100%);
  margin: 0 auto;
  padding: 12px;
  border-radius: 18px;
  background: ${T.paper};
  box-shadow: inset 0 0 0 1px rgba(${T.shadowBase}, .14), 0 12px 26px -22px rgba(${T.shadowBase}, .5);
}
.sort-cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 7px;
}
.sort-card {
  min-height: 52px;
  padding: 7px 9px;
  border: none;
  border-radius: 13px;
  background: ${T.bg};
  color: ${T.ink};
  font: 600 12px/1.25 'Manrope', system-ui, sans-serif;
  text-align: left;
  cursor: pointer;
  box-shadow: inset 0 0 0 1px rgba(${T.shadowBase}, .14);
  transition: box-shadow .2s ease, opacity .2s ease;
}
.sort-card.is-active { box-shadow: inset 0 0 0 2px ${T.cyan}; background: ${T.cyanSoft}; }
.sort-card.is-wrong { box-shadow: inset 0 0 0 2px ${T.accent}; background: ${T.accentSoft}; }
.sort-card.is-done { opacity: .64; cursor: default; }
.sort-buckets {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
.sort-bucket {
  position: relative;
  display: grid;
  gap: 2px;
  justify-items: center;
  min-height: 68px;
  padding: 9px 10px;
  border: none;
  border-radius: 15px;
  background: repeating-linear-gradient(135deg, #FBFBF8 0 7px, #F2F4F1 7px 14px);
  cursor: pointer;
  box-shadow: inset 0 0 0 2px rgba(${T.shadowBase}, .14);
  transition: box-shadow .2s ease;
}
.sort-bucket.is-open { box-shadow: inset 0 0 0 2px rgba(22, 143, 163, .55); }
.sort-bucket:disabled { cursor: default; }
.sort-bucket b { font-size: 14px; color: ${T.ink}; }
.sort-bucket small { font-size: 11px; color: ${T.ink2}; }
.sort-count {
  position: absolute;
  top: 6px;
  right: 8px;
  font-size: 13px;
  font-weight: 800;
  color: ${T.cyan};
}

/* Ikki yo'nalish jadvali: yuqorida butun ma'lum, pastda butun noma'lum. */
.dir-table {
  display: grid;
  gap: 5px;
  width: min(520px, 100%);
  margin: 0 auto;
}
.dir-row {
  display: grid;
  grid-template-columns: 1.1fr .9fr 1fr;
  gap: 6px;
  align-items: center;
  padding: 7px 10px;
  border-radius: 12px;
  background: ${T.paper};
  font-size: 12.5px;
  color: ${T.ink};
  box-shadow: inset 0 0 0 1px rgba(${T.shadowBase}, .12);
}
.dir-head {
  background: transparent;
  box-shadow: none;
  font-size: 11px;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: ${T.ink3};
  padding-bottom: 0;
}
.dir-row.is-now {
  background: ${T.cyanSoft};
  box-shadow: inset 0 0 0 2px rgba(22, 143, 163, .4);
}
.dir-row span:last-child { font-weight: 800; }

.hook-scene-visual .pwbar-known { color: #A9DCE6; }
.hook-scene-visual .pwbar-cell.is-unknown {
  background: repeating-linear-gradient(135deg, rgba(255, 255, 255, .92) 0 6px, rgba(223, 236, 240, .86) 6px 12px);
  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, .42);
}
.sort-tag {
  display: block;
  margin-top: 4px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .04em;
  text-transform: uppercase;
  color: ${T.cyan};
}

@media (max-width: 640px) {
  .pwbar-cell { height: 34px; }
  .pwbar.compact .pwbar-cell { height: 28px; }
  .pwbar-whole { font-size: 18px; }
  .ledger-cell b { font-size: 17px; }
  .builder-cell { width: 40px; height: 34px; font-size: 13px; }
  .builder-sum span { font-size: 21px; }
  .order-card { min-height: 84px; }
  .order-label { font-size: 20px; }
  .order-line { font-size: 17px; }
  .sort-card { font-size: 11.5px; min-height: 48px; }
  .dir-row { font-size: 11.5px; padding: 6px 8px; }
}
`;
