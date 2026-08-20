// ============================================================================
// 4-SINF · Dars 51 · O'rganilgan mavzularni yakuniy takrorlash
//
// Manba: N. U. Bikbayeva, "Matematika. 4-sinf", o'zbek nashri, 202-204-bet —
// yakuniy takrorlash bloki. Har hududdan bittadan topshiriq olindi:
//   xonalar jadvali va nol (uch yuz besh ming yigirma olti);
//   ko'p xonali sonlarni ustun qilib qo'shish (692 503 + 243 497 = 936 000);
//   butunning qismi (240 : 4 · 3 = 180);
//   o'lchov birliklari (4 m 56 cm = 456 cm);
//   to'rtburchak perimetri va yuzasi (7 va 5: P = 24 cm, S = 35 cm kv).
// Syujet: BOSH PULT (SYUJET_4SINF.md, 6-blok yakuni). Oltala hudud bir vaqtda
// hisobot yubordi, pult ularni bitta yakuniy hisobotga yig'moqda.
// 50-darsdan ko'prik: chizmalar o'qildi, endi butun shahar hisoboti yig'iladi.
//
// YADRO. Yakuniy takrorlash amallar ro'yxati emas: har topshiriqda avval
// SAVOL NIMANI SO'RAYAPTI degan savolga javob beriladi, keyin mos model
// tanlanadi, va faqat oxirida hisoblanadi. Perimetr va yuzani chalkashtirish
// aynan shu birinchi qadam tashlab ketilganda paydo bo'ladi.
//
// RITM: qisqa tushuntirish -> misol -> yana tushuntirish -> misol.
// Baholanadigan olti ekran: s2, s4, s6, s8, s10, s13.
// ============================================================================
import {
  BitSVG, Caption, ChoiceScreen, FitSvg, KIT_STYLES, NumPadScreen, RecordRow,
  RevealScreen, RuleRows, StepList, SummaryScreen, T, TheoryLessonRoot,
  assertScreenTypeLabels, useT,
} from './kit/index.js';

const LESSON_META = {
  lessonId: 'final-4-51-v2',
  slug: 'dars51-yakuniy-takrorlash',
  lessonTitle: {
    uz: "51-dars. O'rganilgan mavzularni yakuniy takrorlash",
    ru: 'Урок 51. Итоговое повторение изученных тем',
    en: 'Lesson 51. Final revision of the topics studied',
  },
  skillTags: ['place_value', 'column_add', 'part_of_number', 'unit_convert', 'perimeter_vs_area'],
};

const SCREEN_META = [
  { id: 's0', type: 'hook', scored: false, scope: 'hook' },
  { id: 's1', type: 'exploration', scored: false, scope: null },
  { id: 's2', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 's3', type: 'exploration', scored: false, scope: null },
  { id: 's4', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 's5', type: 'exploration', scored: false, scope: null },
  { id: 's6', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 's7', type: 'exploration', scored: false, scope: null },
  { id: 's8', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 's9', type: 'exploration', scored: false, scope: null },
  { id: 's10', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 's11', type: 'rule', scored: false, scope: null },
  { id: 's12', type: 'strategy', scored: false, scope: null },
  { id: 's13', type: 'error-analysis', scored: true, scope: 'module-mikro' },
  { id: 's14', type: 'life-case', scored: false, scope: 'final' },
  { id: 's15', type: 'summary', scored: false, scope: null },
];

const TOTAL_SCREENS = SCREEN_META.length;
assertScreenTypeLabels(SCREEN_META, LESSON_META.lessonId);

const FRAME_COUNTS = [4, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 3, 3, 3, 3, 3];

const CONTENT = {
  s0: {
    eyebrow: { uz: 'Bosh pult', ru: 'Главный пульт', en: 'The master panel' },
    title: {
      uz: 'Yakuniy hisobotda qizil qator',
      ru: 'Красная строка в итоговом отчёте',
      en: 'A red line in the final report',
    },
    question: {
      uz: 'Bit sonni yozishda qanday xato qildi?',
      ru: 'Какую ошибку сделал Bit при записи числа?',
      en: 'What mistake did Bit make writing the number?',
    },
    options: [
      { uz: 'Bitta nol tushib qolgan', ru: 'Пропущен один нуль', en: 'One zero is missing' },
      { uz: "Raqamlar tartibi buzilgan", ru: 'Нарушен порядок цифр', en: 'The order of the digits is broken' },
      { uz: 'Son juda katta yozilgan', ru: 'Число записано слишком большим', en: 'The number was written too large' },
      { uz: 'Xato yo\'q', ru: 'Ошибки нет', en: 'There is no error' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Yuzlar xonasi bo'sh edi, unga nol yozilishi kerak edi.",
      ru: 'Верно. Разряд сотен был пустым, туда нужно было поставить нуль.',
      en: 'Correct. The hundreds place was empty and a zero had to go there.',
    },
    wrong: [
      null,
      {
        uz: "Raqamlar tartibi to'g'ri: uch, besh, ikki, olti. Faqat bittasi tushib qolgan.",
        ru: 'Порядок цифр верный: три, пять, два, шесть. Пропущена только одна.',
        en: 'The order of the digits is right: three, five, two, six. Only one is missing.',
      },
      {
        uz: "Aksincha, yozilgan son kerakligidan kichik chiqdi.",
        ru: 'Наоборот, записанное число вышло меньше нужного.',
        en: 'On the contrary, the number written came out smaller than needed.',
      },
      {
        uz: "Xato bor: aytilgan son va yozilgan son bir xil emas.",
        ru: 'Ошибка есть: названное число и записанное не совпадают.',
        en: 'There is an error: the number named and the number written are not the same.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Salom, do'stim! Bugun Lumo Sitining oltala hududi bir vaqtda hisobot yubordi.",
          "Bosh pult ularni bitta yakuniy hisobotga yig'moqda.",
          "Birinchi qator qizarib turibdi: sonlar hududi uch yuz besh ming yigirma olti dedi, Bit esa boshqacha yozdi.",
          "Bit qanday xato qildi? Javobni tanlang.",
        ],
        ru: [
          'Привет, друг! Сегодня все шесть районов Лумо Сити прислали отчёт разом.',
          'Главный пульт собирает их в один итоговый отчёт.',
          'Первая строка горит красным: район чисел назвал триста пять тысяч двадцать шесть, а Bit записал иначе.',
          'Какую ошибку сделал Bit? Выбери ответ.',
        ],
        en: [
          'Hello, friend! Today all six districts of Lumo City sent their reports at once.',
          'The master panel is gathering them into one final report.',
          'The first line is red: the district of numbers said three hundred and five thousand and twenty six, but Bit wrote it differently.',
          'What mistake did Bit make? Choose an answer.',
        ],
      },
    },
  },

  s1: {
    eyebrow: { uz: 'Xonalar', ru: 'Разряды', en: 'Places' },
    title: {
      uz: 'Bo\'sh xona nol bilan to\'ldiriladi',
      ru: 'Пустой разряд заполняют нулём',
      en: 'An empty place is filled with a zero',
    },
    lead: {
      uz: "Har raqam o'z xonasida turadi, bo'sh xona esa nolsiz qolmaydi.",
      ru: 'Каждая цифра стоит в своём разряде, а пустой разряд без нуля не остаётся.',
      en: 'Every digit stands in its own place, and an empty place is never left without a zero.',
    },
    note: {
      uz: 'Nol o\'rinni ushlab turadi: usiz qolgan raqamlar siljib ketadi.',
      ru: 'Нуль держит место: без него остальные цифры сдвигаются.',
      en: 'A zero holds the place: without it the other digits slide over.',
    },
    audio: {
      intro: {
        uz: [
          "Xonalar jadvaliga qaraymiz. O'ngdan chapga: birlar, o'nlar, yuzlar, minglar, o'n minglar, yuz minglar.",
          "Uch yuz besh ming yigirma olti sonida yuz minglar xonasida uch, minglar xonasida besh turadi.",
          "Yuzlar xonasi va o'n minglar xonasi bo'sh, shuning uchun ularga nol yoziladi.",
          "Nol tushib qolsa, qolgan raqamlar siljiydi va son butunlay boshqa bo'ladi.",
        ],
        ru: [
          'Посмотрим на таблицу разрядов. Справа налево: единицы, десятки, сотни, тысячи, десятки тысяч, сотни тысяч.',
          'В числе триста пять тысяч двадцать шесть в разряде сотен тысяч стоит три, в разряде тысяч пять.',
          'Разряд сотен и разряд десятков тысяч пусты, поэтому туда пишут нуль.',
          'Если нуль пропустить, остальные цифры сдвинутся и число станет совсем другим.',
        ],
        en: [
          'Look at the table of places. From right to left: units, tens, hundreds, thousands, ten thousands, hundred thousands.',
          'In three hundred and five thousand and twenty six the hundred thousands place holds three and the thousands place holds five.',
          'The hundreds place and the ten thousands place are empty, so a zero is written there.',
          'If a zero is dropped, the other digits slide over and the number becomes a different one.',
        ],
      },
    },
  },

  s2: {
    eyebrow: { uz: 'Yozuvni tasdiqlang', ru: 'Подтверди запись', en: 'Confirm the record' },
    title: {
      uz: 'Son qanday yoziladi?',
      ru: 'Как записывают число?',
      en: 'How is the number written?',
    },
    question: {
      uz: 'Uch yuz besh ming yigirma olti qanday yoziladi?',
      ru: 'Как записать триста пять тысяч двадцать шесть?',
      en: 'How is three hundred and five thousand and twenty six written?',
    },
    options: [
      { uz: '305 026', ru: '305 026', en: '305 026' },
      { uz: '30 526', ru: '30 526', en: '30 526' },
      { uz: '350 026', ru: '350 026', en: '350 026' },
      { uz: '305 260', ru: '305 260', en: '305 260' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Bo'sh xonalarga nol qo'yildi va son o'z o'rnini topdi.",
      ru: 'Верно. В пустые разряды поставили нули, и число встало на своё место.',
      en: 'Correct. Zeros went into the empty places and the number found its place.',
    },
    wrong: [
      null,
      {
        uz: "Bu Bitning yozuvi: bitta nol yetishmaydi, shuning uchun son o'n barobar kichik.",
        ru: 'Это запись Bit: не хватает одного нуля, поэтому число в десять раз меньше.',
        en: 'That is Bit record: one zero is missing, so the number is ten times smaller.',
      },
      {
        uz: "Bunda besh minglar emas, o'n minglar xonasiga tushib qolgan.",
        ru: 'Здесь пятёрка попала в разряд десятков тысяч, а не тысяч.',
        en: 'Here the five landed in the ten thousands place instead of the thousands.',
      },
      {
        uz: "Bunda yigirma olti o'ng chetga emas, bir xona chapga surilgan.",
        ru: 'Здесь двадцать шесть сдвинуто на разряд влево от правого края.',
        en: 'Here the twenty six is shifted one place left of the right edge.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Sonlar hududi yozuvni tasdiqlashni so'rayapti.",
          "Har raqamni jadvaldagi o'z xonasiga qo'ying va bo'sh xonalarni unutmang.",
          "Qaysi yozuv to'g'ri? Javobni tanlang.",
        ],
        ru: [
          'Район чисел просит подтвердить запись.',
          'Поставь каждую цифру в свой разряд и не забудь пустые разряды.',
          'Какая запись верна? Выбери ответ.',
        ],
        en: [
          'The district of numbers asks you to confirm the record.',
          'Put every digit into its own place and do not forget the empty places.',
          'Which record is right? Choose an answer.',
        ],
      },
    },
  },

  s3: {
    eyebrow: { uz: 'Amallar hududi', ru: 'Район действий', en: 'The district of operations' },
    title: {
      uz: 'Ustun qilib qo\'shamiz',
      ru: 'Складываем столбиком',
      en: 'Adding in a column',
    },
    lead: {
      uz: "Xonalar bir-birining tagida turadi, qo'shish birlardan boshlanadi.",
      ru: 'Разряды стоят один под другим, сложение начинают с единиц.',
      en: 'The places stand one under another and the adding starts from the units.',
    },
    note: {
      uz: 'To\'lgan o\'nlik keyingi xonaga bir bo\'lib o\'tadi.',
      ru: 'Полный десяток переходит в следующий разряд единицей.',
      en: 'A full ten passes into the next place as one.',
    },
    audio: {
      intro: {
        uz: [
          "Ikkinchi hudud amallar hududi. U ikki brigadaning ishini qo'shmoqda.",
          "Birinchi brigada olti yuz to'qson ikki ming besh yuz uch dona, ikkinchisi ikki yuz qirq uch ming to'rt yuz to'qson yetti dona tayyorladi.",
          "Ustun qilib qo'shamiz: birlardan boshlaymiz va har to'lgan o'nlik keyingi xonaga o'tadi.",
          "Natija to'qqiz yuz o'ttiz olti ming. Oxirida uchta nol turibdi.",
        ],
        ru: [
          'Второй район это район действий. Он складывает работу двух бригад.',
          'Первая бригада сделала шестьсот девяносто две тысячи пятьсот три штуки, вторая двести сорок три тысячи четыреста девяносто семь.',
          'Складываем столбиком: начинаем с единиц, и каждый полный десяток переходит в следующий разряд.',
          'Результат девятьсот тридцать шесть тысяч. На конце стоят три нуля.',
        ],
        en: [
          'The second district is the district of operations. It adds the work of two teams.',
          'The first team made six hundred and ninety two thousand five hundred and three pieces, the second two hundred and forty three thousand four hundred and ninety seven.',
          'We add in a column: we begin with the units, and every full ten passes into the next place.',
          'The result is nine hundred and thirty six thousand. Three zeros stand at the end.',
        ],
      },
    },
  },

  s4: {
    eyebrow: { uz: 'Terib javob bering', ru: 'Набери ответ', en: 'Type the answer' },
    title: {
      uz: 'Ikki brigada birga',
      ru: 'Две бригады вместе',
      en: 'Two teams together',
    },
    question: {
      uz: 'Ikki brigada jami qancha dona tayyorladi?',
      ru: 'Сколько штук изготовили две бригады вместе?',
      en: 'How many pieces did the two teams make together?',
    },
    answer: 936000,
    unit: { uz: 'dona', ru: 'шт.', en: 'pcs' },
    correctText: {
      uz: "To'g'ri. Har xonada o'tish hisobga olindi va yig'indi to'qqiz yuz o'ttiz olti ming chiqdi.",
      ru: 'Верно. Переходы в каждом разряде учтены, и сумма вышла девятьсот тридцать шесть тысяч.',
      en: 'Correct. The carries in every place were counted and the sum came to nine hundred and thirty six thousand.',
    },
    wrong: {
      uz: "Hali emas. Birlar xonasidan boshlang va har to'lgan o'nlikni keyingi xonaga o'tkazing.",
      ru: 'Пока нет. Начни с разряда единиц и переноси каждый полный десяток в следующий разряд.',
      en: 'Not yet. Start from the units place and carry every full ten into the next place.',
    },
    hintAfter: {
      uz: "Birlar: uch va yetti o'nni beradi, demak birlar xonasida nol qoladi.",
      ru: 'Единицы: три и семь дают десять, значит в разряде единиц остаётся нуль.',
      en: 'Units: three and seven give ten, so a zero stays in the units place.',
    },
    audio: {
      intro: {
        uz: [
          "Endi qo'shishni o'zingiz yakunlang.",
          "Ustunni birlar xonasidan boshlang va o'tishlarni unutmang.",
          "Yig'indi qancha? Javobni tering va tasdiqlang.",
        ],
        ru: [
          'Теперь заверши сложение сам.',
          'Начни столбик с разряда единиц и не забудь про переходы.',
          'Чему равна сумма? Набери ответ и подтверди.',
        ],
        en: [
          'Now finish the addition yourself.',
          'Start the column from the units place and do not forget the carries.',
          'What is the sum? Type the answer and confirm.',
        ],
      },
    },
  },

  s5: {
    eyebrow: { uz: 'Qismlar hududi', ru: 'Район частей', en: 'The district of parts' },
    title: {
      uz: 'Butunning bir necha qismi',
      ru: 'Несколько частей целого',
      en: 'Several parts of a whole',
    },
    lead: {
      uz: "Avval bitta qismni topamiz, keyin uni kerakli qismlar soniga ko'paytiramiz.",
      ru: 'Сначала находим одну часть, затем умножаем её на нужное число частей.',
      en: 'First we find one part, then multiply it by the number of parts needed.',
    },
    note: {
      uz: 'Ikki qadam: bo\'lish, keyin ko\'paytirish.',
      ru: 'Два шага: деление, затем умножение.',
      en: 'Two steps: division, then multiplication.',
    },
    audio: {
      intro: {
        uz: [
          "Uchinchi hudud qismlar hududi.",
          "Ikki yuz qirq tonna g'alladan to'rtdan uch qismi jo'natildi.",
          "Avval butunni to'rtga bo'lamiz: bir qism oltmish tonna.",
          "Keyin bir qismni uchga ko'paytiramiz: bir yuz sakson tonna jo'natilgan.",
        ],
        ru: [
          'Третий район это район частей.',
          'Из двухсот сорока тонн зерна отправили три четверти.',
          'Сначала делим целое на четыре: одна часть шестьдесят тонн.',
          'Затем умножаем одну часть на три: отправлено сто восемьдесят тонн.',
        ],
        en: [
          'The third district is the district of parts.',
          'Three quarters of two hundred and forty tonnes of grain were sent out.',
          'First we divide the whole by four: one part is sixty tonnes.',
          'Then we multiply one part by three: one hundred and eighty tonnes were sent.',
        ],
      },
    },
  },

  s6: {
    eyebrow: { uz: 'Terib javob bering', ru: 'Набери ответ', en: 'Type the answer' },
    title: {
      uz: 'Ombordagi unning qismi',
      ru: 'Часть муки со склада',
      en: 'A part of the flour in the store',
    },
    question: {
      uz: '280 kg unning to\'rtdan uch qismi necha kilogramm?',
      ru: 'Сколько килограммов составляют три четверти от 280 кг?',
      en: 'How many kilograms are three quarters of 280 kg?',
    },
    answer: 210,
    unit: { uz: 'kg', ru: 'кг', en: 'kg' },
    correctText: {
      uz: "To'g'ri. Ikki yuz saksonni to'rtga bo'lsak yetmish, yetmishni uchga ko'paytirsak ikki yuz o'n.",
      ru: 'Верно. Двести восемьдесят делим на четыре и получаем семьдесят, а семьдесят умножаем на три и получаем двести десять.',
      en: 'Correct. Two hundred and eighty divided by four is seventy, and seventy times three is two hundred and ten.',
    },
    wrong: {
      uz: "Hali emas. Avval bitta qismni toping, keyin uni uchga ko'paytiring.",
      ru: 'Пока нет. Сначала найди одну часть, затем умножь её на три.',
      en: 'Not yet. First find one part, then multiply it by three.',
    },
    hintAfter: {
      uz: "Bitta qism yetmish kilogramm. Uchta qism kerak.",
      ru: 'Одна часть семьдесят килограммов. Нужны три части.',
      en: 'One part is seventy kilograms. Three parts are needed.',
    },
    audio: {
      intro: {
        uz: [
          "Omborda ikki yuz sakson kilogramm un bor.",
          "Uning to'rtdan uch qismi jo'natildi.",
          "Necha kilogramm jo'natildi? Javobni tering va tasdiqlang.",
        ],
        ru: [
          'На складе двести восемьдесят килограммов муки.',
          'Отправили три четверти этого количества.',
          'Сколько килограммов отправили? Набери ответ и подтверди.',
        ],
        en: [
          'The store holds two hundred and eighty kilograms of flour.',
          'Three quarters of it were sent out.',
          'How many kilograms were sent? Type the answer and confirm.',
        ],
      },
    },
  },

  s7: {
    eyebrow: { uz: 'O\'lchovlar hududi', ru: 'Район измерений', en: 'The district of measures' },
    title: {
      uz: 'Metrni santimetrga aylantiramiz',
      ru: 'Переводим метры в сантиметры',
      en: 'Turning metres into centimetres',
    },
    lead: {
      uz: "Bir metrda yuz santimetr bor, shuning uchun metrlar soni yuzga ko'paytiriladi.",
      ru: 'В одном метре сто сантиметров, поэтому число метров умножают на сто.',
      en: 'One metre holds a hundred centimetres, so the number of metres is multiplied by a hundred.',
    },
    note: {
      uz: 'Qoldiq santimetrlar shundan keyin qo\'shiladi.',
      ru: 'Остаток в сантиметрах прибавляют после этого.',
      en: 'The leftover centimetres are added after that.',
    },
    audio: {
      intro: {
        uz: [
          "To'rtinchi hudud o'lchovlar hududi.",
          "Bir metrda yuz santimetr bor.",
          "To'rt metr ellik olti santimetrni olamiz: to'rt metr bu to'rt yuz santimetr.",
          "To'rt yuzga ellik oltini qo'shamiz va to'rt yuz ellik olti santimetr chiqadi.",
        ],
        ru: [
          'Четвёртый район это район измерений.',
          'В одном метре сто сантиметров.',
          'Возьмём четыре метра пятьдесят шесть сантиметров: четыре метра это четыреста сантиметров.',
          'К четырёмстам прибавляем пятьдесят шесть и получаем четыреста пятьдесят шесть сантиметров.',
        ],
        en: [
          'The fourth district is the district of measures.',
          'One metre holds a hundred centimetres.',
          'Take four metres and fifty six centimetres: four metres is four hundred centimetres.',
          'Add fifty six to four hundred and it gives four hundred and fifty six centimetres.',
        ],
      },
    },
  },

  s8: {
    eyebrow: { uz: 'Aylantiring', ru: 'Переведи', en: 'Convert it' },
    title: {
      uz: '7 m 8 cm necha santimetr?',
      ru: 'Сколько сантиметров в 7 м 8 см?',
      en: 'How many centimetres are 7 m 8 cm?',
    },
    question: {
      uz: '7 m 8 cm qiymatini santimetrda yozing',
      ru: 'Запиши 7 м 8 см в сантиметрах',
      en: 'Write 7 m 8 cm in centimetres',
    },
    options: [
      { uz: '708 cm', ru: '708 см', en: '708 cm' },
      { uz: '78 cm', ru: '78 см', en: '78 cm' },
      { uz: '780 cm', ru: '780 см', en: '780 cm' },
      { uz: '7008 cm', ru: '7008 см', en: '7008 cm' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Yetti metr bu yetti yuz santimetr, unga sakkiz qo'shiladi.",
      ru: 'Верно. Семь метров это семьсот сантиметров, к ним прибавляют восемь.',
      en: 'Correct. Seven metres is seven hundred centimetres and eight is added to them.',
    },
    wrong: [
      null,
      {
        uz: "Bunda sakkiz o'nlar xonasiga tushib qolgan. U birlar xonasida turishi kerak.",
        ru: 'Здесь восьмёрка попала в разряд десятков. Она должна стоять в разряде единиц.',
        en: 'Here the eight landed in the tens place. It must stand in the units place.',
      },
      {
        uz: "Bu yetti metr sakson santimetr. Bizda sakkiz santimetr edi.",
        ru: 'Это семь метров восемьдесят сантиметров. У нас было восемь сантиметров.',
        en: 'That is seven metres and eighty centimetres. We had eight centimetres.',
      },
      {
        uz: "Bir metrda yuz santimetr, ming emas. Yetti metr yetti yuz santimetr.",
        ru: 'В метре сто сантиметров, а не тысяча. Семь метров это семьсот сантиметров.',
        en: 'A metre has a hundred centimetres, not a thousand. Seven metres is seven hundred.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "O'lchovlar hududi yangi qiymat yubordi.",
          "Metrlarni santimetrga aylantiring va qoldiqni qo'shing.",
          "Yetti metr sakkiz santimetr necha santimetr? Javobni tanlang.",
        ],
        ru: [
          'Район измерений прислал новое значение.',
          'Переведи метры в сантиметры и прибавь остаток.',
          'Сколько сантиметров в семи метрах восьми сантиметрах? Выбери ответ.',
        ],
        en: [
          'The district of measures sent a new value.',
          'Turn the metres into centimetres and add the leftover.',
          'How many centimetres are seven metres and eight centimetres? Choose an answer.',
        ],
      },
    },
  },

  s9: {
    eyebrow: { uz: 'Geometriya hududi', ru: 'Район геометрии', en: 'The district of geometry' },
    title: {
      uz: 'Perimetr va yuza bir xil emas',
      ru: 'Периметр и площадь не одно и то же',
      en: 'Perimeter and area are not the same',
    },
    lead: {
      uz: "Perimetr chegaraning uzunligi, yuza esa ichkarining o'lchovi.",
      ru: 'Периметр это длина границы, а площадь мера внутренней части.',
      en: 'The perimeter is the length of the border, the area measures the inside.',
    },
    note: {
      uz: 'Chegara santimetrda, ichkari kvadrat santimetrda o\'lchanadi.',
      ru: 'Границу измеряют в сантиметрах, внутреннюю часть в квадратных сантиметрах.',
      en: 'The border is measured in centimetres, the inside in square centimetres.',
    },
    audio: {
      intro: {
        uz: [
          "Beshinchi hudud geometriya hududi.",
          "To'rtburchakning tomonlari yetti santimetr va besh santimetr.",
          "Perimetr chegara uzunligi: yetti bilan beshni qo'shib ikkiga ko'paytiramiz, yigirma to'rt santimetr chiqadi.",
          "Yuza esa boshqa narsa: yettini beshga ko'paytiramiz va o'ttiz besh kvadrat santimetr chiqadi.",
        ],
        ru: [
          'Пятый район это район геометрии.',
          'Стороны прямоугольника семь сантиметров и пять сантиметров.',
          'Периметр это длина границы: складываем семь и пять, умножаем на два, выходит двадцать четыре сантиметра.',
          'Площадь совсем другое: умножаем семь на пять и выходит тридцать пять квадратных сантиметров.',
        ],
        en: [
          'The fifth district is the district of geometry.',
          'The sides of the rectangle are seven centimetres and five centimetres.',
          'The perimeter is the length of the border: add seven and five, multiply by two, and it gives twenty four centimetres.',
          'The area is a different thing: multiply seven by five and it gives thirty five square centimetres.',
        ],
      },
    },
  },

  s10: {
    eyebrow: { uz: 'Perimetrni toping', ru: 'Найди периметр', en: 'Find the perimeter' },
    title: {
      uz: 'Yangi to\'rtburchak',
      ru: 'Новый прямоугольник',
      en: 'A new rectangle',
    },
    question: {
      uz: 'Tomonlari 9 cm va 4 cm. Perimetri qancha?',
      ru: 'Стороны 9 см и 4 см. Чему равен периметр?',
      en: 'The sides are 9 cm and 4 cm. What is the perimeter?',
    },
    options: [
      { uz: '26 cm', ru: '26 см', en: '26 cm' },
      { uz: '36 cm kv', ru: '36 кв. см', en: '36 sq cm' },
      { uz: '13 cm', ru: '13 см', en: '13 cm' },
      { uz: '18 cm', ru: '18 см', en: '18 cm' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. To'qqiz bilan to'rtni qo'shdik va ikkiga ko'paytirdik.",
      ru: 'Верно. Сложили девять и четыре и умножили на два.',
      en: 'Correct. We added nine and four and multiplied by two.',
    },
    wrong: [
      null,
      {
        uz: "Bu yuza: tomonlar ko'paytirilgan. Perimetr uchun ular qo'shiladi.",
        ru: 'Это площадь: стороны перемножили. Для периметра их складывают.',
        en: 'That is the area: the sides were multiplied. For the perimeter they are added.',
      },
      {
        uz: "Bu faqat ikki tomon. To'rtburchakda to'rtta tomon bor.",
        ru: 'Это только две стороны. У прямоугольника их четыре.',
        en: 'That is only two sides. A rectangle has four.',
      },
      {
        uz: "Bu to'qqiz va to'qqiz. Ikkinchi tomon to'rt santimetr edi.",
        ru: 'Это девять и девять. Вторая сторона была четыре сантиметра.',
        en: 'That is nine and nine. The second side was four centimetres.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Geometriya hududi yangi to'rtburchak yubordi.",
          "Uning tomonlari to'qqiz santimetr va to'rt santimetr.",
          "Perimetri qancha? Javobni tanlang.",
        ],
        ru: [
          'Район геометрии прислал новый прямоугольник.',
          'Его стороны девять сантиметров и четыре сантиметра.',
          'Чему равен периметр? Выбери ответ.',
        ],
        en: [
          'The district of geometry sent a new rectangle.',
          'Its sides are nine centimetres and four centimetres.',
          'What is the perimeter? Choose an answer.',
        ],
      },
    },
  },

  s11: {
    eyebrow: { uz: 'Yodda tuting', ru: 'Запомни', en: 'Keep in mind' },
    title: {
      uz: 'Har topshiriqning uch qadami',
      ru: 'Три шага любого задания',
      en: 'Three steps of any task',
    },
    lead: {
      uz: 'Mavzu qanday bo\'lmasin, tartib o\'zgarmaydi.',
      ru: 'Какой бы ни была тема, порядок не меняется.',
      en: 'Whatever the topic, the order stays the same.',
    },
    audio: {
      intro: {
        uz: [
          "Yakuniy qoidani yig'amiz. Birinchi qadam: savol nimani so'rayotganini aniqlang.",
          "Ikkinchi qadam: mos modelni tanlang. Qism kerakmi, chegara kerakmi yoki yig'indi kerakmi.",
          "Uchinchi qadam: hisoblang va javobni tekshiring. Tekshirilmagan javob hisobotga tushmaydi.",
        ],
        ru: [
          'Соберём итоговое правило. Первый шаг: определи, о чём спрашивает вопрос.',
          'Второй шаг: выбери подходящую модель. Нужна часть, нужна граница или нужна сумма.',
          'Третий шаг: вычисли и проверь ответ. Непроверенный ответ в отчёт не попадает.',
        ],
        en: [
          'Let us put the final rule together. Step one: work out what the question is asking.',
          'Step two: choose the fitting model. A part, a border or a sum.',
          'Step three: calculate and check the answer. An unchecked answer never reaches the report.',
        ],
      },
    },
  },

  s12: {
    eyebrow: { uz: 'Yo\'lni tanlang', ru: 'Выбери путь', en: 'Choose the path' },
    title: {
      uz: 'Butunning bir necha qismi so\'ralsa',
      ru: 'Если спрашивают несколько частей целого',
      en: 'When several parts of a whole are asked',
    },
    question: {
      uz: 'Qanday tartibda ishlanadi?',
      ru: 'В каком порядке действуют?',
      en: 'In what order do we work?',
    },
    options: [
      { uz: "Avval bo'lamiz, keyin ko'paytiramiz", ru: 'Сначала делим, потом умножаем', en: 'First divide, then multiply' },
      { uz: "Avval ko'paytiramiz, keyin bo'lamiz", ru: 'Сначала умножаем, потом делим', en: 'First multiply, then divide' },
      { uz: "Faqat bo'lamiz", ru: 'Только делим', en: 'We only divide' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Bo'lish bitta qismni beradi, ko'paytirish esa kerakli qismlar sonini yig'adi.",
      ru: 'Верно. Деление даёт одну часть, а умножение собирает нужное число частей.',
      en: 'Correct. Division gives one part and multiplication gathers the number of parts needed.',
    },
    wrong: [
      null,
      {
        uz: "Bu tartib butunni kattalashtirib yuboradi. Avval bitta qism topilishi kerak.",
        ru: 'Такой порядок увеличивает целое. Сначала нужно найти одну часть.',
        en: 'That order makes the whole larger. One part has to be found first.',
      },
      {
        uz: "Bo'lish faqat bitta qismni beradi. Uchta qism uchun ko'paytirish ham kerak.",
        ru: 'Деление даёт только одну часть. Для трёх частей нужно ещё умножение.',
        en: 'Division gives only one part. Three parts need a multiplication as well.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Bosh pult yana bir savol berdi.",
          "Butunning bir necha qismi so'ralganda qanday yo'l tutiladi?",
          "To'g'ri tartibni tanlang.",
        ],
        ru: [
          'Главный пульт задал ещё один вопрос.',
          'Как действуют, когда спрашивают несколько частей целого?',
          'Выбери верный порядок.',
        ],
        en: [
          'The master panel asked one more question.',
          'How do we act when several parts of a whole are asked for?',
          'Choose the right order.',
        ],
      },
    },
  },

  s13: {
    eyebrow: { uz: "Bitning yozuvi", ru: 'Запись Bit', en: 'Bit record' },
    title: {
      uz: 'Bit perimetrni ko\'paytirdi',
      ru: 'Bit умножил вместо периметра',
      en: 'Bit multiplied instead',
    },
    question: {
      uz: 'Bit hisobotni to\'ldirdi. Xato qayerda?',
      ru: 'Bit заполнил отчёт. Где ошибка?',
      en: 'Bit filled in the report. Where is the error?',
    },
    steps: [
      { uz: 'Tomonlari: 7 cm va 5 cm', ru: 'Стороны: 7 см и 5 см', en: 'Sides: 7 cm and 5 cm' },
      { uz: 'Bit: 7 · 5 = 35', ru: 'Bit: 7 · 5 = 35', en: 'Bit: 7 · 5 = 35' },
      { uz: 'Bit: perimetr 35 cm', ru: 'Bit: периметр 35 см', en: 'Bit: the perimeter is 35 cm' },
      { uz: 'Hisobotga 35 cm yozildi', ru: 'В отчёт записано 35 см', en: '35 cm was written into the report' },
    ],
    options: [
      { uz: "Perimetr uchun tomonlar qo'shiladi", ru: 'Для периметра стороны складывают', en: 'For a perimeter the sides are added' },
      { uz: "Ko'paytirish noto'g'ri hisoblangan", ru: 'Умножение посчитано неверно', en: 'The multiplication was worked out wrongly' },
      { uz: "Tomonlar noto'g'ri yozilgan", ru: 'Стороны записаны неверно', en: 'The sides were written down wrongly' },
      { uz: 'Xato yo\'q', ru: 'Ошибки нет', en: 'There is no error' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Yetti bilan beshni qo'shib ikkiga ko'paytirish kerak edi: yigirma to'rt santimetr.",
      ru: 'Верно. Нужно было сложить семь и пять и умножить на два: двадцать четыре сантиметра.',
      en: 'Correct. Seven and five had to be added and multiplied by two: twenty four centimetres.',
    },
    wrong: [
      null,
      {
        uz: "Ko'paytirish to'g'ri bajarilgan: o'ttiz besh chiqadi. Lekin bu yuza.",
        ru: 'Умножение выполнено верно: выходит тридцать пять. Но это площадь.',
        en: 'The multiplication is right: it gives thirty five. But that is the area.',
      },
      {
        uz: "Tomonlar to'g'ri yozilgan. Xato ulardan keyingi amalda.",
        ru: 'Стороны записаны верно. Ошибка в действии после них.',
        en: 'The sides are written correctly. The error is in the step after them.',
      },
      {
        uz: "Xato bor: o'ttiz besh bu yuza, perimetr esa yigirma to'rt santimetr.",
        ru: 'Ошибка есть: тридцать пять это площадь, а периметр двадцать четыре сантиметра.',
        en: 'There is an error: thirty five is the area, while the perimeter is twenty four centimetres.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Bit geometriya hududining hisobotini to'ldirdi.",
          "Uning to'rt qatori ekranda.",
          "Xato qayerda? Javobni tanlang.",
        ],
        ru: [
          'Bit заполнил отчёт района геометрии.',
          'Его четыре строки на экране.',
          'Где ошибка? Выбери ответ.',
        ],
        en: [
          'Bit filled in the report of the district of geometry.',
          'His four lines are on the screen.',
          'Where is the error? Choose an answer.',
        ],
      },
    },
  },

  s14: {
    eyebrow: { uz: 'Shahar qarori', ru: 'Решение города', en: 'The city decision' },
    title: {
      uz: 'Qaysi yozuv qabul qilinadi?',
      ru: 'Какую запись примут?',
      en: 'Which record is accepted?',
    },
    question: {
      uz: 'Tomonlari 7 cm va 5 cm. Perimetr uchun qaysi yozuv?',
      ru: 'Стороны 7 см и 5 см. Какая запись для периметра?',
      en: 'The sides are 7 cm and 5 cm. Which record gives the perimeter?',
    },
    options: [
      { uz: '(7 + 5) · 2 = 24 cm', ru: '(7 + 5) · 2 = 24 см', en: '(7 + 5) · 2 = 24 cm' },
      { uz: '7 · 5 = 35 cm', ru: '7 · 5 = 35 см', en: '7 · 5 = 35 cm' },
      { uz: '7 + 5 = 12 cm', ru: '7 + 5 = 12 см', en: '7 + 5 = 12 cm' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. To'rtta tomon hisobga olindi va bosh pult yozuvni qabul qildi.",
      ru: 'Верно. Все четыре стороны учтены, и главный пульт принял запись.',
      en: 'Correct. All four sides were counted and the master panel accepted the record.',
    },
    wrong: [
      null,
      {
        uz: "Bu yuzaning yozuvi. Perimetr chegara bo'ylab o'lchanadi.",
        ru: 'Это запись площади. Периметр измеряют вдоль границы.',
        en: 'That is the record of the area. A perimeter is measured along the border.',
      },
      {
        uz: "Bu faqat ikki tomon. Qolgan ikkitasi hisobga olinmagan.",
        ru: 'Это только две стороны. Оставшиеся две не учтены.',
        en: 'That is only two sides. The other two were not counted.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Bosh pult uchta yakuniy yozuvni ko'rib chiqmoqda.",
          "To'rtburchakning tomonlari yetti va besh santimetr, undan perimetr so'ralgan.",
          "Qaysi yozuv qabul qilinadi? Javobni tanlang.",
        ],
        ru: [
          'Главный пульт рассматривает три итоговые записи.',
          'Стороны прямоугольника семь и пять сантиметров, нужен периметр.',
          'Какую запись примут? Выбери ответ.',
        ],
        en: [
          'The master panel is looking at three final records.',
          'The sides of the rectangle are seven and five centimetres and the perimeter is wanted.',
          'Which record is accepted? Choose an answer.',
        ],
      },
    },
  },

  s15: {
    eyebrow: { uz: 'Mukofot', ru: 'Награда', en: 'Reward' },
    stageLabel: { uz: 'YAKUNIY BOSQICH', ru: 'ФИНАЛЬНЫЙ ЭТАП', en: 'FINAL STAGE' },
    headTitle: {
      uz: 'Unvongacha bitta savol',
      ru: 'Один вопрос до звания',
      en: 'One question before your title',
    },
    headLead: {
      uz: 'Qoidani tanlang va kursni yopilgan hisobot bilan yakunlang.',
      ru: 'Выбери правило и заверши курс закрытым отчётом.',
      en: 'Choose the rule and close the course with a finished report.',
    },
    questionKicker: { uz: 'YAKUNIY SAVOL', ru: 'ФИНАЛЬНЫЙ ВОПРОС', en: 'FINAL QUESTION' },
    stepLabel: { uz: '1 QADAM', ru: '1 ШАГ', en: '1 STEP' },
    reflectionQuestion: {
      uz: 'Javobni hisobotga yozishdan oldin nima qilinadi?',
      ru: 'Что делают перед тем, как записать ответ в отчёт?',
      en: 'What is done before writing an answer into the report?',
    },
    reflectionStart: {
      uz: 'Bitta javobni tanlang.',
      ru: 'Выбери один ответ.',
      en: 'Choose one answer.',
    },
    reflectionOptions: [
      { uz: 'Javob tekshiriladi', ru: 'Ответ проверяют', en: 'The answer is checked' },
      { uz: 'Javob yaxlitlanadi', ru: 'Ответ округляют', en: 'The answer is rounded' },
      { uz: 'Javob qayta yoziladi', ru: 'Ответ переписывают', en: 'The answer is rewritten' },
    ],
    reflectionCorrectIndex: 0,
    reflectionCorrect: {
      uz: 'Shunday. Tekshirilmagan javob butun hisobotni buzishi mumkin.',
      ru: 'Именно так. Непроверенный ответ может испортить весь отчёт.',
      en: 'Exactly. An unchecked answer can spoil the whole report.',
    },
    reflectionWrong: {
      uz: "Hali emas. Bitning ikkala xatosini eslang: ikkalasi ham tekshiruvda ushlanardi.",
      ru: 'Пока нет. Вспомни обе ошибки Bit: обе поймала бы проверка.',
      en: 'Not yet. Remember both of Bit errors: a check would have caught them both.',
    },
    rewardAnnounce: { uz: 'Unvon olindi:', ru: 'Звание получено:', en: 'Title earned:' },
    mainLabel: { uz: 'Kursning to\'rt tayanchi', ru: 'Четыре опоры курса', en: 'The four supports of the course' },
    main: [
      { uz: "Sonda bo'sh xona nol bilan to'ldiriladi.", ru: 'Пустой разряд в числе заполняют нулём.', en: 'An empty place in a number is filled with a zero.' },
      { uz: "Butunning qismi uchun avval bo'lamiz, keyin ko'paytiramiz.", ru: 'Для части целого сначала делят, потом умножают.', en: 'For a part of a whole we divide first and multiply after.' },
      { uz: 'Bir metrda yuz santimetr bor.', ru: 'В одном метре сто сантиметров.', en: 'One metre holds a hundred centimetres.' },
      { uz: "Perimetr chegara uzunligi, yuza esa ichkarining o'lchovi.", ru: 'Периметр это длина границы, площадь мера внутренней части.', en: 'The perimeter is the border length, the area measures the inside.' },
    ],
    awards: [
      {
        min: 6,
        title: { uz: 'Bosh muhandis', ru: 'Главный инженер', en: 'Chief engineer' },
        text: { uz: 'Oltala hudud birinchi urinishda tasdiqlandi.', ru: 'Все шесть районов подтверждены с первой попытки.', en: 'All six districts were confirmed on the first attempt.' },
      },
      {
        min: 4,
        title: { uz: 'Hudud nazoratchisi', ru: 'Контролёр района', en: 'District controller' },
        text: { uz: "Siz modelni ishonchli tanlaysiz va javobni tekshirasiz.", ru: 'Ты уверенно выбираешь модель и проверяешь ответ.', en: 'You choose the model with confidence and check the answer.' },
      },
      {
        min: 0,
        title: { uz: 'Pult xodimi', ru: 'Сотрудник пульта', en: 'Panel clerk' },
        text: { uz: "Asos qo'yildi. Qoidani takrorlab, natijani yaxshilashga harakat qiling.", ru: 'Основа заложена. Повтори правило и попробуй улучшить результат.', en: 'The base is laid. Repeat the rule and try to improve the result.' },
      },
    ],
    nextLabel: { uz: 'Keyingi missiya', ru: 'Следующая миссия', en: 'Next mission' },
    nextText: {
      uz: 'Lumo Siti to\'liq ishga tushdi. Endi bilim amaliyot mashg\'ulotlarida sinovdan o\'tadi.',
      ru: 'Лумо Сити заработал полностью. Теперь знание проверяется на практических занятиях.',
      en: 'Lumo City is fully running. Now the knowledge is tested in the practice sessions.',
    },
    audio: {
      intro: {
        uz: [
          "Bosh pult yakuniy hisobotni yopdi: oltala hudud tasdiqlandi.",
          "Bitta savol qoldi. Javobni tanlang va unvonni oling.",
          "Javobni hisobotga yozishdan oldin nima qilinadi? Javobni tanlang.",
        ],
        ru: [
          'Главный пульт закрыл итоговый отчёт: все шесть районов подтверждены.',
          'Остался один вопрос. Выбери ответ и получи звание.',
          'Что делают перед тем, как записать ответ в отчёт? Выбери ответ.',
        ],
        en: [
          'The master panel closed the final report: all six districts are confirmed.',
          'One question is left. Choose the answer and claim your title.',
          'What is done before writing an answer into the report? Choose an answer.',
        ],
      },
    },
  },
};

// ---------------------------------------------------------------------------
// CHIZMALAR
//
// Har hududning o'z chizmasi bor, lekin ular bitta tilda gapiradi: qiymat
// avval o'z o'rniga qo'yiladi, keyingina hisoblanadi.
// ---------------------------------------------------------------------------

// 1-hudud. Xonalar jadvali: 305 026 va uning bo'sh xonalari.
const PLACE_DIGITS = ['3', '0', '5', '0', '2', '6'];
const PLACE_ZEROS = [1, 3];

const PlaceTable = ({ frame = 9 }) => {
  const t = useT();
  const heads = [
    { uz: 'yuz ming', ru: 'сотни тыс.', en: 'hundred th.' },
    { uz: "o'n ming", ru: 'десятки тыс.', en: 'ten th.' },
    { uz: 'ming', ru: 'тысячи', en: 'thousands' },
    { uz: 'yuz', ru: 'сотни', en: 'hundreds' },
    { uz: "o'n", ru: 'десятки', en: 'tens' },
    { uz: 'bir', ru: 'единицы', en: 'units' },
  ];
  const w = 86;
  const gap = 8;
  const x0 = (660 - (6 * w + 5 * gap)) / 2;
  const top = 44;
  const h = 62;
  return (
    <FitSvg viewBox="0 0 660 168">
      {heads.map((head, index) => {
        const x = x0 + index * (w + gap);
        const zero = PLACE_ZEROS.includes(index);
        const lit = frame >= 3 && zero;
        return (
          <g key={head.en}>
            <text x={x + w / 2} y={top - 12} textAnchor="middle" fill={T.ink3} fontSize="11" fontWeight="750" fontFamily="Manrope, sans-serif">
              {t(head)}
            </text>
            <rect
              x={x}
              y={top}
              width={w}
              height={h}
              rx="12"
              fill={lit ? T.accentSoft : '#FBFDF7'}
              stroke={lit ? T.accent : T.ink3}
              strokeWidth={lit ? 2.8 : 1.6}
            />
            {frame >= 2 && (
              <text x={x + w / 2} y={top + h / 2 + 11} textAnchor="middle" fill={lit ? T.accent : T.ink} fontSize="30" fontWeight="800" fontFamily="JetBrains Mono, monospace">
                {PLACE_DIGITS[index]}
              </text>
            )}
          </g>
        );
      })}
      {frame >= 4 && (
        <Caption x={330} y={148} text="305 026" tone={T.success} size={19} />
      )}
    </FitSvg>
  );
};

// 2-hudud. Ustun qo'shish: 692 503 + 243 497.
const SUM_A = '692503';
const SUM_B = '243497';
const SUM_S = '936000';
const SUM_CARRY = [0, 2, 3, 4];

const ColumnSum = ({ frame = 9, solved = false }) => {
  const cw = 40;
  const x0 = 210;
  const cx = (index) => x0 + index * cw + cw / 2;
  const showResult = frame >= 4 || solved;
  return (
    <FitSvg viewBox="0 0 660 186">
      {frame >= 3 && SUM_CARRY.map((index) => (
        <text key={index} x={cx(index)} y={26} textAnchor="middle" fill={T.accent} fontSize="15" fontWeight="800" fontFamily="JetBrains Mono, monospace">
          1
        </text>
      ))}
      {SUM_A.split('').map((digit, index) => (
        <text key={`a${index}`} x={cx(index)} y={62} textAnchor="middle" fill={T.ink} fontSize="30" fontWeight="800" fontFamily="JetBrains Mono, monospace">
          {digit}
        </text>
      ))}
      <text x={x0 - 34} y={104} textAnchor="middle" fill={T.cyan} fontSize="28" fontWeight="800" fontFamily="JetBrains Mono, monospace">+</text>
      {SUM_B.split('').map((digit, index) => (
        <text key={`b${index}`} x={cx(index)} y={104} textAnchor="middle" fill={T.ink} fontSize="30" fontWeight="800" fontFamily="JetBrains Mono, monospace">
          {digit}
        </text>
      ))}
      <line x1={x0 - 46} y1={118} x2={x0 + 6 * cw + 6} y2={118} stroke={T.ink2} strokeWidth="2.4" />
      {showResult && SUM_S.split('').map((digit, index) => (
        <text key={`s${index}`} x={cx(index)} y={156} textAnchor="middle" fill={T.success} fontSize="30" fontWeight="800" fontFamily="JetBrains Mono, monospace">
          {digit}
        </text>
      ))}
      {!showResult && (
        <rect x={x0 + 4} y={130} width={6 * cw - 8} height={32} rx="10" fill="none" stroke={T.ink3} strokeWidth="1.6" strokeDasharray="7 6" />
      )}
    </FitSvg>
  );
};

// 3-hudud. Butun va uning qismlari: teng bo'laklarga bo'lingan tasma.
const PartsStrip = ({ total, parts, taken, unit, frame = 9, solvedValue = null }) => {
  const t = useT();
  const x0 = 96;
  const x1 = 564;
  const top = 62;
  const h = 54;
  const w = (x1 - x0) / parts;
  const one = total / parts;
  return (
    <FitSvg viewBox="0 0 660 176">
      <Caption x={330} y={34} text={`${total} ${unit}`} tone={T.ink2} size={16} />
      <line x1={x0} y1={44} x2={x1} y2={44} stroke={T.ink3} strokeWidth="1.4" />
      {Array.from({ length: parts }, (unused, index) => {
        const filled = frame >= 2 && index < taken;
        return (
          <g key={index}>
            <rect
              x={x0 + index * w}
              y={top}
              width={w - 6}
              height={h}
              rx="12"
              fill={filled ? 'rgba(149,201,61,.28)' : '#FBFDF7'}
              stroke={filled ? T.lime : T.ink3}
              strokeWidth={filled ? 2.6 : 1.6}
            />
            {frame >= 3 && (
              <text x={x0 + index * w + (w - 6) / 2} y={top + h / 2 + 7} textAnchor="middle" fill={filled ? '#4C6B18' : T.ink3} fontSize="18" fontWeight="800" fontFamily="JetBrains Mono, monospace">
                {one}
              </text>
            )}
          </g>
        );
      })}
      {(frame >= 4 || solvedValue !== null) && (
        <Caption
          x={330}
          y={152}
          text={`${t({ uz: 'olingan qism', ru: 'взятая часть', en: 'the part taken' })}: ${solvedValue ?? one * taken} ${unit}`}
          tone={T.success}
          size={16}
        />
      )}
    </FitSvg>
  );
};

// 4-hudud. Metr va santimetr: bitta uzunlik ikki bo'lakda.
// Bo'laklar uzunlikka mutanosib chiziladi — 50-darsdan keyin masshtabi buzilgan
// tasma noto'g'ri signal beradi. Qoldiq juda kichik bo'lsa, u ko'rinarli
// eng kichik kenglikda qoladi va yozuvi tasma tagiga chiqariladi.
const UnitBar = ({ m, cm, frame = 9, solved = false }) => {
  const t = useT();
  const x0 = 84;
  const x1 = 576;
  const top = 54;
  const h = 46;
  const full = m * 100 + cm;
  const span = x1 - x0;
  const wm = Math.min(span - 26, ((m * 100) / full) * span);
  const xm = x0 + wm;
  const cmMid = (xm + 4 + x1) / 2;
  return (
    <FitSvg viewBox="0 0 660 176">
      <Caption x={330} y={30} text={t({ uz: "bitta uzunlik, ikki bo'lak", ru: 'одна длина, две части', en: 'one length, two parts' })} tone={T.ink3} />
      <rect x={x0} y={top} width={wm} height={h} rx="12" fill={T.cyanSoft} stroke={T.cyan} strokeWidth="2" />
      <rect x={xm + 4} y={top} width={x1 - xm - 4} height={h} rx="8" fill={T.warnSoft} stroke={T.warn} strokeWidth="2" />
      <text x={x0 + wm / 2} y={top + h / 2 + 7} textAnchor="middle" fill={T.cyan} fontSize="18" fontWeight="800" fontFamily="JetBrains Mono, monospace">
        {frame >= 3 ? `${m} m = ${m * 100} cm` : `${m} m`}
      </text>
      <line x1={cmMid} y1={top + h + 4} x2={cmMid} y2={top + h + 16} stroke={T.warn} strokeWidth="1.6" />
      <text x={cmMid} y={top + h + 34} textAnchor="middle" fill={T.warn} fontSize="16" fontWeight="800" fontFamily="JetBrains Mono, monospace">
        {cm} cm
      </text>
      {(frame >= 4 || solved) && (
        <Caption x={330} y={158} text={`${m * 100} + ${cm} = ${full} cm`} tone={T.success} size={18} />
      )}
    </FitSvg>
  );
};

// 5-hudud. To'rtburchak: chegara va ichkari bir chizmada ajratiladi.
const RectFigure = ({ w, h, frame = 9 }) => {
  const t = useT();
  const k = 24;
  const pw = w * k;
  const ph = h * k;
  const x = (660 - pw) / 2;
  const y = 34;
  const perimeter = (w + h) * 2;
  const area = w * h;
  const border = frame >= 2;
  return (
    <FitSvg viewBox="0 0 660 236">
      {frame >= 4 && (
        <g>
          {Array.from({ length: w }, (unused, col) => (
            Array.from({ length: h }, (unusedRow, row) => (
              <rect
                key={`${col}-${row}`}
                x={x + col * k}
                y={y + row * k}
                width={k}
                height={k}
                fill="rgba(149,201,61,.16)"
                stroke="rgba(149,201,61,.55)"
                strokeWidth="1"
              />
            ))
          ))}
        </g>
      )}
      <rect
        x={x}
        y={y}
        width={pw}
        height={ph}
        rx="4"
        fill={frame >= 4 ? 'none' : '#FBFDF7'}
        stroke={border ? T.accent : T.ink2}
        strokeWidth={border ? 4 : 2}
      />
      <text x={x + pw / 2} y={y - 12} textAnchor="middle" fill={T.ink2} fontSize="16" fontWeight="800" fontFamily="JetBrains Mono, monospace">
        {w} cm
      </text>
      <text x={x - 34} y={y + ph / 2 + 6} textAnchor="middle" fill={T.ink2} fontSize="16" fontWeight="800" fontFamily="JetBrains Mono, monospace">
        {h} cm
      </text>
      {frame >= 3 && (
        <Caption x={330} y={y + ph + 34} text={`${t({ uz: 'perimetr', ru: 'периметр', en: 'perimeter' })}: (${w} + ${h}) · 2 = ${perimeter} cm`} tone={T.accent} size={17} />
      )}
      {frame >= 4 && (
        <Caption x={330} y={y + ph + 60} text={`${t({ uz: 'yuza', ru: 'площадь', en: 'area' })}: ${w} · ${h} = ${area} cm kv`} tone={T.success} size={17} />
      )}
    </FitSvg>
  );
};

// Bosh pult: oltala hudud bir ekranda.
const DISTRICTS = [
  { key: 'sonlar', uz: 'SONLAR', ru: 'ЧИСЛА', en: 'NUMBERS' },
  { key: 'amallar', uz: 'AMALLAR', ru: 'ДЕЙСТВИЯ', en: 'OPERATIONS' },
  { key: 'qismlar', uz: 'QISMLAR', ru: 'ЧАСТИ', en: 'PARTS' },
  { key: 'olchov', uz: "O'LCHOVLAR", ru: 'ИЗМЕРЕНИЯ', en: 'MEASURES' },
  { key: 'geometriya', uz: 'GEOMETRIYA', ru: 'ГЕОМЕТРИЯ', en: 'GEOMETRY' },
  { key: 'malumot', uz: "MA'LUMOT", ru: 'ДАННЫЕ', en: 'DATA' },
];

const ControlPanel = ({ solved }) => {
  const t = useT();
  const w = 196;
  const h = 60;
  const gap = 16;
  const x0 = (660 - (3 * w + 2 * gap)) / 2;
  return (
    <FitSvg viewBox="0 0 660 152">
      {DISTRICTS.map((item, index) => {
        const col = index % 3;
        const row = Math.floor(index / 3);
        const x = x0 + col * (w + gap);
        const y = 8 + row * (h + gap);
        const alert = index === 0 && !solved;
        return (
          <g key={item.key}>
            <rect
              x={x}
              y={y}
              width={w}
              height={h}
              rx="14"
              fill={alert ? 'rgba(255,91,53,.14)' : 'rgba(233,250,251,.10)'}
              stroke={alert ? '#FFB39B' : 'rgba(144,228,235,.34)'}
              strokeWidth={alert ? 2.4 : 1.4}
            />
            <text x={x + 18} y={y + 36} fill={alert ? '#FFB39B' : '#D8F4F6'} fontSize="13" fontWeight="800" letterSpacing="2" fontFamily="JetBrains Mono, monospace">
              {t(item)}
            </text>
            <circle cx={x + w - 22} cy={y + h / 2} r="7" fill={alert ? '#FF8A66' : '#95C93D'} />
          </g>
        );
      })}
    </FitSvg>
  );
};

// QOIDA kartasi: umumiy `RuleRows` bloki, mazmuni darsniki.
const RuleCard = ({ frame }) => {
  const t = useT();
  return (
    <RuleRows
      frame={frame}
      rows={[
        {
          tone: T.cyan,
          head: t({ uz: 'Savolni aniqlang', ru: 'Определите вопрос', en: 'Find the question' }),
          body: t({ uz: 'nima so\'ralyapti: qism, chegara yoki yig\'indi', ru: 'о чём спрашивают: часть, граница или сумма', en: 'what is asked: a part, a border or a sum' }),
          formula: null,
        },
        {
          tone: T.accent,
          head: t({ uz: 'Modelni tanlang', ru: 'Выберите модель', en: 'Choose the model' }),
          body: t({ uz: 'tasma, jadval, chizma yoki ustun yozuvi', ru: 'полоса, таблица, чертёж или запись столбиком', en: 'a strip, a table, a chart or a column record' }),
          formula: null,
        },
        {
          tone: T.success,
          head: t({ uz: 'Hisoblang va tekshiring', ru: 'Вычислите и проверьте', en: 'Calculate and check' }),
          body: t({ uz: 'tekshirilmagan javob hisobotga tushmaydi', ru: 'непроверенный ответ в отчёт не попадает', en: 'an unchecked answer never reaches the report' }),
          formula: null,
        },
      ]}
    />
  );
};

// ---------------------------------------------------------------------------
// EKRANLAR
// ---------------------------------------------------------------------------
const Screen0 = (props) => {
  const t = useT();
  return (
    <ChoiceScreen
      {...props}
      plain
      ratio="30 / 11"
      ordinal={3}
      figure={({ solved }) => (
        <div className="hero-scene">
          <div className="hero-head">
            <span>LUMO CITY · BOSH PULT · YAKUNIY HISOBOT</span>
            <span className={solved ? 'hero-state' : 'hero-state hero-state-alert'}>
              {solved ? 'QABUL QILINDI' : 'TEKSHIRUV'}
            </span>
          </div>
          <div className="hero-body">
            <div className="d51-hero-row">
              <div className="d51-hero-panel"><ControlPanel solved={solved} /></div>
              <div className="d51-hero-bit" aria-hidden="true"><BitSVG state={solved ? 'nod' : 'awkward'} /></div>
            </div>
          </div>
          <div className="d51-hero-note">
            {solved
              ? t({ uz: 'sonlar hududi: 305 026', ru: 'район чисел: 305 026', en: 'district of numbers: 305 026' })
              : t({ uz: 'Bit yozdi: 30 526', ru: 'Bit записал: 30 526', en: 'Bit wrote: 30 526' })}
          </div>
        </div>
      )}
    />
  );
};
const Screen1 = (props) => <RevealScreen {...props} ratio="66 / 17" figure={({ frame }) => <PlaceTable frame={frame} />} />;
const Screen2 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={1}
    ratio="66 / 17"
    figure={({ solved }) => <PlaceTable frame={solved ? 4 : 1} />}
  />
);
const Screen3 = (props) => <RevealScreen {...props} ratio="66 / 19" figure={({ frame }) => <ColumnSum frame={frame} />} />;
const Screen4 = (props) => (
  <NumPadScreen
    {...props}
    ratio="66 / 19"
    figure={({ solved }) => <ColumnSum frame={3} solved={solved} />}
  />
);
const Screen5 = (props) => (
  <RevealScreen {...props} ratio="66 / 18" figure={({ frame }) => <PartsStrip total={240} parts={4} taken={3} unit="t" frame={frame} />} />
);
const Screen6 = (props) => (
  <NumPadScreen
    {...props}
    ratio="66 / 18"
    figure={({ solved }) => <PartsStrip total={280} parts={4} taken={3} unit="kg" frame={solved ? 3 : 2} solvedValue={solved ? 210 : null} />}
  />
);
const Screen7 = (props) => <RevealScreen {...props} ratio="66 / 17" figure={({ frame }) => <UnitBar m={4} cm={56} frame={frame} />} />;
const Screen8 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={2}
    ratio="66 / 17"
    figure={({ solved }) => <UnitBar m={7} cm={8} frame={solved ? 3 : 2} solved={solved} />}
  />
);
const Screen9 = (props) => <RevealScreen {...props} ratio="66 / 24" figure={({ frame }) => <RectFigure w={7} h={5} frame={frame} />} />;
const Screen10 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={4}
    ratio="66 / 24"
    figure={({ solved }) => <RectFigure w={9} h={4} frame={solved ? 3 : 1} />}
  />
);
const Screen11 = (props) => <RevealScreen {...props} plain ratio="auto" figure={({ frame }) => <RuleCard frame={frame} />} />;
const Screen12 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={5}
    ratio="66 / 18"
    figure={({ solved }) => <PartsStrip total={240} parts={4} taken={3} unit="t" frame={solved ? 4 : 3} />}
  />
);
const Screen13 = (props) => {
  const t = useT();
  return (
    <ChoiceScreen
      {...props}
      plain
      ratio="auto"
      ordinal={6}
      figure={({ solved, picked }) => (
        <StepList
          steps={CONTENT.s13.steps.map((step) => t(step))}
          badIndex={1}
          revealBad={solved}
          badLabel={t({ uz: 'xato shu yerda', ru: 'ошибка здесь', en: 'the error is here' })}
          showHint={picked !== null && !solved}
          hint={t({
            uz: 'Perimetr chegara bo\'ylab yuriladi: nechta tomon bor?',
            ru: 'Периметр идёт вдоль границы: сколько там сторон?',
            en: 'A perimeter runs along the border: how many sides are there?',
          })}
        />
      )}
    />
  );
};
const Screen14 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={7}
    ratio="72 / 21"
    figure={({ solved, picked }) => (
      <RecordRow
        records={['(7 + 5) · 2 = 24 cm', '7 · 5 = 35 cm', '7 + 5 = 12 cm']}
        picked={picked}
        solved={solved}
        correctIndex={0}
        width={720}
        cardW={210}
        cardH={92}
        gap={24}
        top={34}
        size={17}
      />
    )}
  />
);
const Screen15 = (props) => <SummaryScreen {...props} />;

const SCREENS = [
  Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7,
  Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15,
];

const LESSON_STYLES = `
/* Hook ekranida sahna uch qatorli: sarlavha, pult va izoh. Kit dagi ikki
   qatorli grid uchinchi bolani yashirin qatorga tashlaydi va pult qatori
   nolga siqiladi — shuning uchun qatorlar shu darsda qayta e'lon qilinadi. */
.hero-scene { grid-template-rows: auto minmax(0, 1fr) auto; }
.d51-hero-row {
  width: 100%;
  height: 100%;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 56px;
  gap: 10px;
  align-items: center;
}
.d51-hero-panel { width: 100%; height: 100%; min-height: 0; }
.d51-hero-panel svg { width: 100%; height: 100%; }
.d51-hero-note {
  text-align: center;
  color: #9DE3E7;
  font-size: clamp(10px, 1.2vw, 12px);
  font-weight: 750;
}
.d51-hero-bit { width: 56px; height: 100%; max-height: 70px; pointer-events: none; }
.d51-hero-bit svg { width: 100%; height: 100%; }
/* Telefonda karta biroz balandroq: 366 px kenglikda 30/11 nisbati oltita
   plitkaga joy qoldirmaydi. Faqat hook kartasi kattalashadi.
   !important kerak: nisbat ModelCard dan inline style bilan keladi, inline
   esa oddiy qoidadan kuchli. */
@media (max-width: 639.98px) {
  .model-card:has(.hero-scene) { --g4-model-ratio: 30 / 17 !important; }
}
`;

export default function Grade4Dars51(props) {
  return (
    <TheoryLessonRoot
      {...props}
      lessonMeta={LESSON_META}
      screenMeta={SCREEN_META}
      totalScreens={TOTAL_SCREENS}
      frameCounts={FRAME_COUNTS}
      content={CONTENT}
      screens={SCREENS}
      styles={KIT_STYLES + LESSON_STYLES}
    />
  );
}
