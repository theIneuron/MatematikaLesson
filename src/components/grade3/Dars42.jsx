import React from 'react';
import { BitSVG, LUMO_CAST, LumoCityBg, createLesson, useLang, tri } from './_kit/index.jsx';
import { LESSON_STYLES } from './_kit/styles.js';

// ============================================================================
// DD 3-SINF | Dars42 — "Massa: gramm va kilogramm" (num-3-42) | Б6 «O'LCHOVLAR»
// Syujet: yangi blok — Lumo shahri omborlari (reja 47-satr).
// SAHNA: metodist qarori 2026-08-10 — qolgan darslarda 1-DARSNING sahnasi, Lumo shahri
//   (kitdagi `LumoCityBg`). Dars faqat o'z tugunini qo'yadi: tarozi.
// DARSLIK ASOSI (Burxonov, 3-sinf, «Sharq» 2019, massa boblari).
// YADRO: massa tarozi bilan taqqoslash orqali topiladi. 1 kg = 1000 g. Kichik narsa
//   grammda, katta narsa kilogrammda o'lchanadi.
// Misconception: M1 «katta narsa har doim og'ir»; M2 kilogramm va grammni qo'shishda
//   birlikni tenglashtirmaslik; M3 1 kg ni 100 g deb bilish; M4 tarozida faqat bir tomonni
//   sanash.
// FactCard: kosmosda narsa vaznsiz bo'ladi, lekin massasi qoladi — shuning uchun u yerda
//   massani tebranish davri bilan o'lchashadi.
// Bu dars MA'LUMOT fayli: ekranlar va mexanika kitda (`createLesson`).
// ============================================================================
const TOTAL_SCREENS = 15;
const LESSON_META = {
  lessonId: 'grade3-42',
  lessonTitle: { ru: 'Урок 42. Масса: грамм и килограмм', uz: '42-dars. Massa: gramm va kilogramm', en: 'Lesson 42. Mass: the gram and the kilogram' }
};
// STRUKTURA: s0 xuk tarozi · s1 taqqoslash · s2 birlik tanlash · s3 QOIDA 1 kg = 1000 g ·
// s4 chizma bo'yicha massa · s5 saralash gramm yoki kilogramm · s6 test aylantirish ·
// s7 konsol tarozi · s8 xatoni top (birlik qo'shilgan) · s9 Bit tuzog'i (katta demak og'ir) ·
// s10 trenajyor kg dan g ga · s11 trenajyor ayirish · s12 masala ombor ·
// s13 final + FactCard · s14 yakun.
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'MCScreen', scored: false, scope: 'hook' },
  { id: 's1',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's4',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's5',  type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's6',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's7',  type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's8',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's9',  type: 'exploration', template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's10', type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's11', type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's12', type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's13', type: 'test',        template: 'custom',   scored: true,  scope: 'diagnostic' },
  { id: 's14', type: 'summary',     template: 'custom',   scored: false, scope: null }
];

const CONTENT = {
  // s0 — XUK: ikki qutini ko'z bilan solishtirib bo'lmaydi.
  s0: {
    eyebrow: { ru: 'Крючок', uz: 'Qiziqtirish', en: 'Hook' },
    topic: { ru: 'Масса: грамм и килограмм', uz: 'Massa: gramm va kilogramm', en: 'Mass: the gram and the kilogram' },
    lead: { ru: 'Две коробки: большая и маленькая', uz: 'Ikki quti: katta va kichik', en: 'Two boxes: a big one and a small one' },
    order_cap: { ru: 'какая тяжелее', uz: "qaysi biri og'irroq", en: 'which is heavier' },
    plate: ['1', 'kg', '1000'],
    q: { ru: 'Как узнать, какая коробка тяжелее?', uz: "Qaysi quti og'irroq ekanini qanday bilamiz?", en: 'How can we find out which box is heavier?' },
    opt0: { ru: 'поставить на весы', uz: 'taroziga qo\'yish', en: 'put them on the scales' },
    opt1: { ru: 'посмотреть, какая больше', uz: 'qaysi biri kattaroq ekaniga qarash', en: 'look at which is bigger' },
    opt2: { ru: 'измерить линейкой', uz: "chizg'ich bilan o'lchash", en: 'measure with a ruler' },
    opt3: { ru: 'посчитать углы', uz: 'burchaklarni sanash', en: 'count the angles' },
    audio: {
      intro: {
        ru: [
          'Фигуры остались позади. Теперь возьмёмся за величины.',
          'На складе две коробки. Одна большая, другая маленькая.',
          'Большая с ватой, маленькая с гвоздями.',
          'Как думаешь, как узнать, какая коробка тяжелее?'
        ],
        uz: [
          "Shakllar ortda qoldi. Endi kattaliklarga o'tamiz.",
          "Omborda ikki quti bor. Biri katta, ikkinchisi kichik.",
          "Kattasida paxta, kichigida mixlar.",
          "Sizningcha, qaysi quti og'irroq ekanini qanday bilamiz?"
        ],
        en: ['The figures are behind us. Now we take on quantities.', 'There are two boxes in the store. One is big, the other small.', 'The big one has cotton wool in it, the small one nails.', 'How do you think we can find out which box is heavier?']
      },
      on_correct: { ru: 'Верно! Только весы дают точный ответ. Глаз тут легко ошибается.', uz: "To'g'ri! Faqat tarozi aniq javob beradi. Ko'z bu yerda oson adashadi.", en: 'Right! Only the scales give an exact answer. The eye is easily wrong here.' },
      on_wrong1: { ru: 'Размер не решает. Коробка ваты большая, а гвозди тяжелее.', uz: "O'lcham hal qilmaydi. Paxta qutisi katta, mixlar esa og'irroq.", en: 'Size does not decide it. A box of cotton wool is big, and the nails are heavier.' },
      on_wrong2: { ru: 'Линейка меряет длину, а не тяжесть.', uz: "Chizg'ich uzunlikni o'lchaydi, og'irlikni emas.", en: 'A ruler measures length, not heaviness.' },
      on_idk: { ru: 'Ничего. Сейчас поставим обе на весы.', uz: "Hechqisi yo'q. Hozir ikkalasini taroziga qo'yamiz.", en: 'Never mind. Let us put both on the scales.' }
    }
  },

  // s1 — MODEL: tarozi taqqoslaydi.
  s1: {
    eyebrow: { ru: 'Разбор', uz: 'Tahlil', en: 'Working it out' },
    lead: { ru: 'Ставим коробки на весы', uz: "Qutilarni taroziga qo'yamiz", en: 'We put the boxes on the scales' },
    task_line: 'вата и гвозди',
    task_line_uz: "paxta va mixlar",

    task_line_en: 'cotton wool and nails',
    step1: { ru: 'чаша с гвоздями ниже', uz: 'mixli tovoq pastroq', en: 'the pan with the nails is lower' },
    step1_cap: { ru: 'ниже — значит тяжелее', uz: 'pastroq — demak og\'irroq', en: 'lower means heavier' },
    step2: { ru: 'гвозди 500 г, вата 300 г', uz: 'mix 500 g, paxta 300 g', en: 'nails 500 g, cotton wool 300 g' },
    step2_cap: { ru: 'весы дают число', uz: 'tarozi son beradi', en: 'the scales give a number' },
    res: { ru: '500 г > 300 г', uz: '500 g > 300 g', en: '500 g > 300 g' },
    btn1: { ru: 'Поставить на весы', uz: "Taroziga qo'yish", en: 'Put them on the scales' },
    btn2: { ru: 'Посмотреть числа', uz: 'Sonlarga qarash', en: 'Look at the numbers' },
    done_text: { ru: 'Маленькая коробка оказалась тяжелее. Решает не размер, а масса.', uz: "Kichik quti og'irroq chiqdi. O'lcham emas, massa hal qiladi.", en: 'The small box turned out to be heavier. It is not size that decides, but mass.' },
    audio: {
      ru: [
        'Ставим обе коробки на весы и смотрим.',
        'Чаша с гвоздями опустилась ниже. Значит гвозди тяжелее.',
        'Весы показывают числа. Гвозди пятьсот граммов, вата триста граммов. Маленькая коробка оказалась тяжелее большой.'
      ],
      uz: [
        "Ikkala qutini taroziga qo'yib qaraymiz.",
        "Mixli tovoq pastroq tushdi. Demak mixlar og'irroq.",
        "Tarozi sonlarni ko'rsatadi. Mixlar besh yuz gramm, paxta uch yuz gramm. Kichik quti kattasidan og'irroq chiqdi."
      ],
      en: ['We put both boxes on the scales and look.', 'The pan with the nails went lower. So the nails are heavier.', 'The scales show numbers. The nails are five hundred grams, the cotton wool three hundred grams. The small box turned out to be heavier than the big one.']
    }
  },

  // s2 — MODEL: qaysi birlikda o'lchaymiz.
  s2: {
    eyebrow: { ru: 'Разбор', uz: 'Tahlil', en: 'Working it out' },
    w: 4,
    h: 4,
    lead: { ru: 'Выбираем мерку по предмету', uz: "Narsaga qarab o'lchov tanlaymiz", en: 'We choose the measure by the object' },
    capA: { ru: 'ручка — граммы', uz: 'ruchka — gramm', en: 'a pen — grams' },
    capB: { ru: 'мешок муки — килограммы', uz: 'un qopi — kilogramm', en: 'a sack of flour — kilograms' },
    res: { ru: 'мелкое в г, крупное в кг', uz: 'maydasi g da, yirigi kg da', en: 'small things in g, big ones in kg' },
    btn1: { ru: 'Взвесить ручку', uz: "Ruchkani tortish", en: 'Weigh the pen' },
    btn2: { ru: 'Взвесить мешок', uz: 'Qopni tortish', en: 'Weigh the sack' },
    done_text: { ru: 'Для лёгкого берут граммы, для тяжёлого килограммы. Мерку выбирают по предмету.', uz: "Yengil narsaga gramm, og'iriga kilogramm olinadi. O'lchov narsaga qarab tanlanadi.", en: 'For light things we take grams, for heavy ones kilograms. The measure is chosen by the object.' },
    audio: {
      ru: [
        'Мерку выбирают по предмету, как раньше выбирали сантиметры или метры.',
        'Ручка лёгкая, её масса десять граммов. В килограммах такое число не запишешь.',
        'Мешок муки тяжёлый, его масса пять килограммов. В граммах вышло бы пять тысяч, читать неудобно.'
      ],
      uz: [
        "O'lchov narsaga qarab tanlanadi, avval santimetr yoki metrni tanlagandek.",
        "Ruchka yengil, uning massasi o'n gramm. Kilogrammda bunday sonni yozib bo'lmaydi.",
        "Un qopi og'ir, uning massasi besh kilogramm. Grammda besh ming chiqardi, o'qish noqulay."
      ],
      en: ['The measure is chosen by the object, just as we chose centimetres or metres before.', 'A pen is light, its mass is ten grams. You could not write such a number in kilograms.', 'A sack of flour is heavy, its mass is five kilograms. In grams it would come out as five thousand, which is awkward to read.']
    }
  },

  // s3 — QOIDA: 1 kg = 1000 g.
  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    q: { ru: 'Сколько граммов в одном килограмме?', uz: 'Bir kilogrammda necha gramm bor?', en: 'How many grams are in one kilogram?' },
    opts: [
      { ru: '1000 г', uz: '1000 g', en: '1000 g' },
      { ru: '100 г', uz: '100 g', en: '100 g' },
      { ru: '10 г', uz: '10 g', en: '10 g' },
      { ru: '500 г', uz: '500 g', en: '500 g' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Сто граммов это лишь десятая часть килограмма.', uz: "Yuz gramm bu kilogrammning atigi o'ndan bir qismi.", en: 'A hundred grams is only a tenth of a kilogram.' },
      2: { ru: 'Десять граммов это совсем мало, столько весит ручка.', uz: "O'n gramm juda kam, ruchka shuncha tortadi.", en: 'Ten grams is very little, that is what a pen weighs.' },
      3: { ru: 'Пятьсот граммов это половина килограмма.', uz: "Besh yuz gramm bu kilogrammning yarmi.", en: 'Five hundred grams is half a kilogram.' }
    },
    on_correct: { ru: 'Верно. В килограмме тысяча граммов.', uz: "To'g'ri. Kilogrammda ming gramm bor.", en: 'Right. There are a thousand grams in a kilogram.' },
    rule_lines: {
      ru: ['1 кг = 1000 г', 'лёгкое меряют в граммах', 'тяжёлое в килограммах'],
      uz: ["1 kg = 1000 g", "yengil narsa grammda", "og'ir narsa kilogrammda"],
      en: ['1 kg = 1000 g', 'light things are measured in grams', 'heavy ones in kilograms']
    },
    rule_ex: { ru: '2 кг = 2000 г', uz: '2 kg = 2000 g', en: '2 kg = 2000 g' },
    rule_speech: { ru: 'В одном килограмме тысяча граммов. Лёгкие предметы меряют в граммах, тяжёлые в килограммах. Чтобы перевести килограммы в граммы, умножают на тысячу.', uz: "Bir kilogrammda ming gramm bor. Yengil narsalar grammda, og'irlari kilogrammda o'lchanadi. Kilogrammni grammga o'tkazish uchun mingga ko'paytiriladi.", en: 'There are a thousand grams in one kilogram. Light objects are measured in grams, heavy ones in kilograms. To turn kilograms into grams you multiply by a thousand.' },
    audio: {
      intro: { ru: 'Соберём правило. Две мерки массы связаны между собой.', uz: "Qoidani yig'amiz. Massaning ikki o'lchovi o'zaro bog'liq.", en: 'Let us gather the rule. The two measures of mass are linked to each other.' }
    }
  },

  // s4 — CHIZMA: tarozidagi toshlar.
  s4: {
    eyebrow: { ru: 'Чертёж', uz: 'Chizma', en: 'The drawing' },
    q: { ru: 'На чаше три гири по 200 г. Какова масса?', uz: "Tovoqda 200 g dan uchta tosh bor. Massasi qancha?", en: 'There are three 200 g weights on the pan. What is the mass?' },
    fig_w: 3,
    fig_h: 2,
    opts: [
      { ru: '600 г', uz: '600 g', en: '600 g' },
      { ru: '200 г', uz: '200 g', en: '200 g' },
      { ru: '203 г', uz: '203 g', en: '203 g' },
      { ru: '6 кг', uz: '6 kg', en: '6 kg' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Двести это одна гиря, а их три.', uz: "Ikki yuz bu bitta tosh, ular esa uchta.", en: 'Two hundred is one weight, and there are three of them.' },
      2: { ru: 'Числа гирь складывают, а не приписывают друг к другу.', uz: "Toshlar soni qo'shiladi, yonma-yon yozilmaydi.", en: 'The numbers of the weights are added, not written next to each other.' },
      3: { ru: 'Шесть килограммов это шесть тысяч граммов, слишком много.', uz: "Olti kilogramm bu olti ming gramm, juda ko'p.", en: 'Six kilograms is six thousand grams, far too much.' }
    },
    audio: {
      intro: { ru: 'Посмотри на чертёж. На чаше три гири по двести граммов. Какова масса?', uz: "Chizmaga qarang. Tovoqda ikki yuz grammdan uchta tosh bor. Massasi qancha?", en: 'Look at the drawing. There are three weights of two hundred grams on the pan. What is the mass?' },
      on_correct: { ru: 'Верно. Три раза по двести, шестьсот граммов.', uz: "To'g'ri. Ikki yuzdan uch marta, olti yuz gramm.", en: 'Right. Three times two hundred, six hundred grams.' },
      on_wrong: { ru: 'Сложи массы всех гирь.', uz: "Hamma toshning massasini qo'shing.", en: 'Add the masses of all the weights.' }
    }
  },

  // s5 — SARALASH: qaysi birlik.
  s5: {
    eyebrow: { ru: 'Сортировка', uz: 'Saralash', en: 'Sorting' },
    lead: { ru: 'Разложи предметы по меркам', uz: "Narsalarni o'lchovlarga ajrating", en: 'Sort the objects by measure' },
    bin_a: { ru: 'граммы', uz: 'gramm', en: 'grams' },
    bin_b: { ru: 'килограммы', uz: 'kilogramm', en: 'kilograms' },
    items: [
      { n: { ru: 'карандаш', uz: 'qalam', en: 'a pencil' }, a: true, hint: { ru: 'Карандаш лёгкий, его масса несколько граммов.', uz: "Qalam yengil, massasi bir necha gramm.", en: 'A pencil is light, its mass is a few grams.' } },
      { n: { ru: 'мешок картошки', uz: 'kartoshka qopi', en: 'a sack of potatoes' }, a: false, hint: { ru: 'Мешок тяжёлый, счёт идёт на килограммы.', uz: "Qop og'ir, hisob kilogrammda boradi.", en: 'A sack is heavy, the count goes in kilograms.' } },
      { n: { ru: 'конфета', uz: 'konfet', en: 'a sweet' }, a: true, hint: { ru: 'Конфета лёгкая, это граммы.', uz: "Konfet yengil, bu gramm.", en: 'A sweet is light, that is grams.' } },
      { n: { ru: 'школьник', uz: "o'quvchi", en: 'a schoolchild' }, a: false, hint: { ru: 'Массу человека называют в килограммах.', uz: "Odam massasi kilogrammda aytiladi.", en: "A person's mass is given in kilograms." } }
    ],
    audio: {
      intro: { ru: 'Четыре предмета. Отправь каждый к своей мерке.', uz: "To'rtta narsa. Har birini o'z o'lchoviga yuboring.", en: 'Four objects. Send each one to its measure.' },
      on_correct: { ru: 'Всё на месте. Лёгкое меряют в граммах, тяжёлое в килограммах.', uz: "Hammasi joyida. Yengil narsa grammda, og'iri kilogrammda o'lchanadi.", en: 'All in place. Light things are measured in grams, heavy ones in kilograms.' },
      on_wrong: { ru: 'Прикинь, поднимешь ли ты это одной рукой.', uz: "Buni bir qo'l bilan ko'tara olasizmi, chamalab ko'ring.", en: 'Think whether you could lift it with one hand.' }
    }
  },

  // s6 — TEST: kg dan g ga.
  s6: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv', en: 'Checking' },
    q: { ru: 'Сколько граммов в 3 кг?', uz: '3 kg da necha gramm bor?', en: 'How many grams are in 3 kg?' },
    opts: [
      { ru: '3000 г', uz: '3000 g', en: '3000 g' },
      { ru: '300 г', uz: '300 g', en: '300 g' },
      { ru: '30 г', uz: '30 g', en: '30 g' },
      { ru: '1003 г', uz: '1003 g', en: '1003 g' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Триста граммов это меньше половины килограмма.', uz: "Uch yuz gramm bu kilogrammning yarmidan kam.", en: 'Three hundred grams is less than half a kilogram.' },
      2: { ru: 'Тридцать граммов это совсем немного.', uz: "O'ttiz gramm juda oz.", en: 'Thirty grams is very little.' },
      3: { ru: 'Килограммы не приписывают к тысяче, их умножают.', uz: "Kilogramm mingga yonma-yon yozilmaydi, ko'paytiriladi.", en: 'Kilograms are not written next to a thousand, they are multiplied by it.' }
    },
    audio: {
      intro: { ru: 'Быстрый вопрос. Сколько граммов в трёх килограммах?', uz: "Tez savol. Uch kilogrammda necha gramm bor?", en: 'A quick question. How many grams are in three kilograms?' },
      on_correct: { ru: 'Верно. Три раза по тысяче.', uz: "To'g'ri. Mingdan uch marta.", en: 'Right. Three times a thousand.' },
      on_wrong: { ru: 'В одном килограмме тысяча граммов, значит умножай на тысячу.', uz: "Bir kilogrammda ming gramm, demak mingga ko'paytiring.", en: 'There are a thousand grams in one kilogram, so multiply by a thousand.' }
    }
  },

  // s7 — KONSOL: tarozini muvozanatga keltirish.
  s7: {
    eyebrow: { ru: 'Консоль', uz: 'Konsol', en: 'Console' },
    lead: { ru: 'Уравновесь весы: слева 2 кг', uz: "Tarozini muvozanatga keltiring: chapda 2 kg", en: 'Balance the scales: 2 kg on the left' },
    swap_line: { ru: 'весы 2 кг', uz: 'tarozi 2 kg', en: 'scales 2 kg' },
    cells: [
      { head: { ru: 'слева, граммов', uz: 'chapda, gramm', en: 'on the left, grams' }, label: { ru: '2 кг', uz: '2 kg', en: '2 kg' }, ans: 2000, hint: { ru: 'Два раза по тысяче.', uz: "Mingdan ikki marta.", en: 'Two times a thousand.' } },
      { head: { ru: 'уже справа', uz: "o'ngda bor", en: 'already on the right' }, label: { ru: 'граммов', uz: 'gramm', en: 'grams' }, ans: 800, hint: { ru: 'Это число дано в условии.', uz: 'Bu son shartda berilgan.', en: 'That number is given in the problem.' } },
      { head: { ru: 'добавить', uz: "qo'shish kerak", en: 'to add' }, label: '2000 − 800', ans: 1200, hint: { ru: 'Из левой массы вычти то, что уже справа.', uz: "Chap massadan o'ngda borini ayiring.", en: 'Take what is already on the right away from the mass on the left.' } }
    ],
    check: { ru: '2000 г = 800 г + 1200 г', uz: '2000 g = 800 g + 1200 g', en: '2000 g = 800 g + 1200 g' },
    check_label: { ru: 'обе чаши в граммах', uz: 'ikkala tovoq grammda', en: 'both pans in grams' },
    audio: {
      intro: { ru: 'Заполни три окна. Слева два килограмма, справа уже восемьсот граммов.', uz: "Uchta oynani to'ldiring. Chapda ikki kilogramm, o'ngda esa sakkiz yuz gramm bor.", en: 'Fill three windows. Two kilograms on the left, eight hundred grams already on the right.' },
      on_correct: { ru: 'Две тысячи граммов слева, восемьсот справа, добавить надо тысячу двести. Обе чаши считали в одной мерке.', uz: "Chapda ikki ming gramm, o'ngda sakkiz yuz, ming ikki yuz qo'shish kerak. Ikkala tovoq bitta o'lchovda hisoblandi.", en: 'Two thousand grams on the left, eight hundred on the right, so one thousand two hundred must be added. Both pans were counted in one measure.' }
    }
  },

  // s8 — XATONI TOP: birliklar tenglashtirilmagan (M2).
  s8: {
    eyebrow: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    q: { ru: 'Записали: 2 кг + 500 г = 502. Где ошибка?', uz: "2 kg + 500 g = 502 deb yozilibdi. Xato qayerda?", en: 'They wrote: 2 kg + 500 g = 502. Where is the mistake?' },
    fig_line: { ru: '2 кг + 500 г', uz: '2 kg + 500 g', en: '2 kg + 500 g' },
    opts: [
      { ru: 'не привели к одной мерке', uz: "bitta o'lchovga keltirilmagan", en: 'they did not bring them to one measure' },
      { ru: 'ошибки нет', uz: "xato yo'q", en: 'there is no mistake' },
      { ru: 'неверно сложили', uz: "noto'g'ri qo'shilgan", en: 'the adding was wrong' },
      { ru: 'взяли не те числа', uz: "sonlar noto'g'ri olingan", en: 'the wrong numbers were taken' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Килограммы и граммы это разные мерки, их числа не складывают.', uz: "Kilogramm va gramm har xil o'lchov, ularning soni qo'shilmaydi.", en: 'Kilograms and grams are different measures, their numbers are not added.' },
      2: { ru: 'Сложение само по себе верное, подвели мерки.', uz: "Qo'shishning o'zi to'g'ri, o'lchovlar aldadi.", en: 'The adding itself is right, it is the measures that let it down.' },
      3: { ru: 'Числа из условия взяты правильно.', uz: "Sonlar shartdan to'g'ri olingan.", en: 'The numbers from the problem were taken correctly.' }
    },
    audio: {
      intro: { ru: 'Кто-то сложил килограммы с граммами напрямую. Найди ошибку.', uz: "Kimdir kilogrammni gramm bilan to'g'ridan-to'g'ri qo'shibdi. Xatoni toping.", en: 'Someone added kilograms to grams directly. Find the mistake.' },
      on_correct: { ru: 'Верно. Сначала переводят к одной мерке. Два килограмма это две тысячи граммов, и тогда выйдет две тысячи пятьсот.', uz: "To'g'ri. Avval bitta o'lchovga o'tkaziladi. Ikki kilogramm bu ikki ming gramm, shunda ikki ming besh yuz chiqadi.", en: 'Right. First they are brought to one measure. Two kilograms is two thousand grams, and then it comes out as two thousand five hundred.' },
      on_wrong: { ru: 'Посмотри на мерки рядом с числами.', uz: "Sonlar yonidagi o'lchovlarga qarang.", en: 'Look at the measures next to the numbers.' }
    }
  },

  // s9 — BIT TUZOG'I: katta demak og'ir (M1).
  s9: {
    eyebrow: { ru: 'Ловушка Бита', uz: "Bit tuzog'i", en: "Bit's trap" },
    lead: { ru: 'Бит сортирует ящики склада', uz: 'Bit ombor yashiklarini saralayapti', en: 'Bit is sorting the boxes in the store' },
    lines: ['большой ящик с ватой, маленький с болтами', 'Бит: большой тяжелее, он же больше'],
    lines_uz: ["katta yashikda paxta, kichigida bolt", "Bit: kattasi og'irroq, axir u kattaroq"],

    lines_en: ['a big box of cotton wool, a small one of bolts', 'Bit: the big one is heavier, it is bigger after all'],
    line_cap: { ru: 'Бит: размер решает', uz: "Bit: o'lcham hal qiladi", en: 'Bit: size decides it' },
    trap_label: { ru: 'Так ли это?', uz: 'Shundaymi?', en: 'Is that so?' },
    trap_opts: { ru: ['нет, надо взвесить', 'да, большой всегда тяжелее'], uz: ["yo'q, tortib ko'rish kerak", "ha, kattasi har doim og'irroq"], en: ['no, you have to weigh it', 'yes, a big one is always heavier'] },
    trap_ci: 0,
    trap_correct: { ru: 'Да. Размер и масса это разные вещи. Ящик ваты большой и лёгкий, ящик болтов маленький и тяжёлый. Ответ даёт только весы.', uz: "Ha. O'lcham va massa har xil narsa. Paxta yashigi katta va yengil, bolt yashigi kichik va og'ir. Javobni faqat tarozi beradi.", en: 'Yes. Size and mass are different things. A box of cotton wool is big and light, a box of bolts is small and heavy. Only the scales give the answer.' },
    trap_wrong: { ru: 'Вспомни коробку ваты и коробку гвоздей. Большая была легче.', uz: "Paxta qutisi va mix qutisini eslang. Kattasi yengilroq edi.", en: 'Remember the box of cotton wool and the box of nails. The big one was lighter.' },
    audio: {
      ru: [
        'Бит сортирует ящики на складе.',
        'Этот ящик больше, значит он и тяжелее. Ставлю его вниз.',
        'Так ли это?'
      ],
      uz: [
        "Bit omborda yashiklarni saralayapti.",
        "Bu yashik kattaroq, demak og'irroq ham. Uni pastga qo'yaman.",
        "Shundaymi?"
      ],
      en: ['Bit is sorting boxes in the store.', 'This box is bigger, so it is heavier. I put it at the bottom.', 'Is that so?']
    }
  },

  // s10 — TRENAJYOR: kg dan g ga.
  s10: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq', en: 'Trainer' },
    q: { ru: 'Сколько граммов в 5 кг?', uz: '5 kg da necha gramm bor?', en: 'How many grams are in 5 kg?' },
    ans: 5000,
    check: '5 · 1000',
    check_label: { ru: 'килограммы в граммы', uz: 'kilogrammdan grammga', en: 'kilograms into grams' },
    hint: { ru: 'Умножь пять на тысячу.', uz: "Beshni mingga ko'paytiring.", en: 'Multiply five by a thousand.' },
    audio: {
      intro: { ru: 'Теперь считай сам. Сколько граммов в пяти килограммах?', uz: "Endi o'zingiz hisoblang. Besh kilogrammda necha gramm bor?", en: 'Now count on your own. How many grams are in five kilograms?' },
      on_correct: { ru: 'Пять тысяч граммов.', uz: "Besh ming gramm.", en: 'Five thousand grams.' }
    }
  },

  // s11 — TRENAJYOR: massa ayirmasi.
  s11: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq', en: 'Trainer' },
    q: { ru: 'В пакете было 900 г риса, отсыпали 400 г. Сколько граммов осталось?', uz: "Paketda 900 g guruch bor edi, 400 g olindi. Necha gramm qoldi?", en: 'A bag had 900 g of rice, 400 g was poured out. How many grams are left?' },
    ans: 500,
    check: '900 − 400',
    check_label: { ru: 'мерка одна, вычитаем', uz: "o'lchov bitta, ayiramiz", en: 'one measure, we subtract' },
    hint: { ru: 'Из девятисот вычти четыреста.', uz: "To'qqiz yuzdan to'rt yuzni ayiring.", en: 'Take four hundred away from nine hundred.' },
    audio: {
      intro: { ru: 'В пакете было девятьсот граммов риса, отсыпали четыреста. Сколько осталось?', uz: "Paketda to'qqiz yuz gramm guruch bor edi, to'rt yuz olindi. Qancha qoldi?", en: 'A bag had nine hundred grams of rice, four hundred was poured out. How much is left?' },
      on_correct: { ru: 'Пятьсот граммов, это половина килограмма.', uz: "Besh yuz gramm, bu kilogrammning yarmi.", en: 'Five hundred grams, that is half a kilogram.' }
    }
  },

  // s12 — MASALA: ikki amal, birlik tenglashtirish.
  s12: {
    eyebrow: { ru: 'Задача', uz: 'Masala', en: 'Word problem' },
    lead: { ru: 'Склад кристаллов', uz: 'Kristall ombori', en: 'The crystal store' },
    q: { ru: 'В ящике 3 кг кристаллов. Отсыпали 700 г. Сколько граммов было и сколько осталось?', uz: "Yashikda 3 kg kristall bor. 700 g olindi. Necha gramm bor edi va qancha qoldi?", en: 'A box has 3 kg of crystals. 700 g was poured out. How many grams were there and how many are left?' },
    q_speech: { ru: 'в ящике три килограмма кристаллов, отсыпали семьсот граммов. Сколько граммов было и сколько осталось?', uz: "yashikda uch kilogramm kristall bor, yetti yuz gramm olindi. Necha gramm bor edi va qancha qoldi?", en: 'a box has three kilograms of crystals, seven hundred grams was poured out. How many grams were there and how many are left?' },
    tbl_heads: [
      { ru: 'было', uz: 'bor edi', en: 'there was' },
      { ru: 'взяли', uz: 'olindi', en: 'taken' },
      { ru: 'вопрос', uz: 'savol', en: 'question' }
    ],
    tbl_cells: [{ ru: '3 кг', uz: '3 kg', en: '3 kg' }, { ru: '700 г', uz: '700 g', en: '700 g' }, '?'],
    pick_label: { ru: 'С какого действия начинаем?', uz: 'Qaysi amaldan boshlaymiz?', en: 'Which operation do we start with?' },
    opts: [
      { ru: 'перевести кг в граммы', uz: 'kg ni grammga o\'tkazish', en: 'turn the kg into grams' },
      { ru: 'сразу вычесть 700', uz: "darrov 700 ni ayirish", en: 'subtract 700 straight away' },
      { ru: 'сложить 3 и 700', uz: "3 va 700 ni qo'shish", en: 'add 3 and 700' },
      { ru: 'разделить на 700', uz: "700 ga bo'lish", en: 'divide by 700' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Из трёх килограммов семьсот граммов вычесть нельзя. Мерки разные.', uz: "Uch kilogrammdan yetti yuz grammni ayirib bo'lmaydi. O'lchovlar har xil.", en: 'You cannot take seven hundred grams away from three kilograms. The measures are different.' },
      2: { ru: 'Складывать числа разных мерок тоже нельзя.', uz: "Har xil o'lchov sonlarini qo'shib ham bo'lmaydi.", en: 'Adding numbers of different measures is not allowed either.' },
      3: { ru: 'Деление тут ничего не даёт.', uz: "Bo'lish bu yerda hech nima bermaydi.", en: 'Dividing gives nothing here.' }
    },
    pick_ok: { ru: 'Верно. Сначала одна мерка, потом вычитание.', uz: "To'g'ri. Avval bitta o'lchov, keyin ayirish.", en: 'Right. First one measure, then the subtraction.' },
    step1_q: { ru: 'Сколько граммов было в ящике?', uz: 'Yashikda necha gramm bor edi?', en: 'How many grams were in the box?' },
    ans1: 3000,
    hint1: { ru: 'Три умножь на тысячу.', uz: "Uchni mingga ko'paytiring.", en: 'Multiply three by a thousand.' },
    step2_q: { ru: 'Сколько граммов осталось?', uz: 'Necha gramm qoldi?', en: 'How many grams are left?' },
    ans2: 2300,
    hint2: { ru: 'Из трёх тысяч вычти семьсот.', uz: "Uch mingdan yetti yuzni ayiring.", en: 'Take seven hundred away from three thousand.' },
    check: '3000 − 700 = 2300',
    setup_audio: { ru: 'На складе считают кристаллы. Посмотри на таблицу и реши, с чего начать.', uz: "Omborda kristallar hisoblanmoqda. Jadvalga qarang va nimadan boshlashni hal qiling.", en: 'The crystals in the store are being counted. Look at the table and decide where to start.' },
    audio: {
      intro: { ru: 'В ящике три килограмма кристаллов, отсыпали семьсот граммов. Сколько было и сколько осталось?', uz: "Yashikda uch kilogramm kristall bor, yetti yuz gramm olindi. Qancha bor edi va qancha qoldi?", en: 'A box has three kilograms of crystals, seven hundred grams was poured out. How much was there and how much is left?' },
      on_correct: { ru: 'Было три тысячи граммов, осталось две тысячи триста. Сначала привели к одной мерке.', uz: "Uch ming gramm bor edi, ikki ming uch yuz qoldi. Avval bitta o'lchovga keltirdik.", en: 'There were three thousand grams, and two thousand three hundred are left. First we brought them to one measure.' },
      on_wrong: { ru: 'Разные мерки сначала приводят к одной.', uz: "Har xil o'lchovlar avval bittaga keltiriladi.", en: 'Different measures are first brought to one.' }
    }
  },

  // s13 — FINAL: uchta topshiriq + FaktCard.
  s13: {
    eyebrow: { ru: 'Финал', uz: 'Yakuniy', en: 'Final' },
    intro_line: { ru: 'Три задания. Следи за меркой', uz: "Uchta topshiriq. O'lchovga qarang", en: 'Three tasks. Watch the measure' },
    items: [
      {
        kind: 'num',
        q: { ru: 'Сколько граммов в 4 кг?', uz: '4 kg da necha gramm bor?', en: 'How many grams are in 4 kg?' },
        q_speech: { ru: 'сколько граммов в четырёх килограммах?', uz: "to'rt kilogrammda necha gramm bor?", en: 'how many grams are in four kilograms?' },
        ans: 4000,
        hint: { ru: 'Умножь четыре на тысячу.', uz: "To'rtni mingga ko'paytiring.", en: 'Multiply four by a thousand.' }
      },
      {
        kind: 'num',
        q: { ru: 'Масса дыни 2 кг, арбуза 6 кг. На сколько килограммов арбуз тяжелее?', uz: "Qovun 2 kg, tarvuz 6 kg. Tarvuz necha kilogramm og'ir?", en: 'A melon has a mass of 2 kg, a watermelon 6 kg. How many kilograms heavier is the watermelon?' },
        q_speech: { ru: 'масса дыни два килограмма, арбуза шесть. На сколько килограммов арбуз тяжелее?', uz: "qovun ikki kilogramm, tarvuz olti. Tarvuz necha kilogramm og'ir?", en: 'a melon has a mass of two kilograms, a watermelon six. How many kilograms heavier is the watermelon?' },
        ans: 4,
        hint: { ru: 'Из шести вычти два.', uz: "Oltidan ikkini ayiring.", en: 'Take two away from six.' }
      },
      {
        kind: 'num',
        q: { ru: 'В пачке 500 г. Сколько граммов в двух таких пачках?', uz: "Bir paketda 500 g. Shunday ikki paketda necha gramm bor?", en: 'A pack holds 500 g. How many grams are in two such packs?' },
        q_speech: { ru: 'в пачке пятьсот граммов. Сколько граммов в двух таких пачках?', uz: "bir paketda besh yuz gramm. Shunday ikki paketda necha gramm bor?", en: 'a pack holds five hundred grams. How many grams are in two such packs?' },
        ans: 1000,
        hint: { ru: 'Две пачки по пятьсот дают ровно килограмм.', uz: "Besh yuzdan ikki paket rosa bir kilogramm beradi.", en: 'Two packs of five hundred give exactly a kilogram.' }
      }
    ],
    fact_badge: { ru: 'Знаешь ли ты?', uz: 'Bilasizmi?', en: 'Which line is wrong?' },
    fact_text: {
      ru: 'В космосе обычные весы бесполезны: там ничего не давит на чашу. Но масса у предмета остаётся. Космонавты меряют её качанием: предмет закрепляют на пружине и считают, как быстро он качается. Тяжёлый качается медленнее лёгкого.',
      uz: "Kosmosda oddiy tarozi foydasiz: u yerda hech nima tovoqqa bosmaydi. Lekin narsaning massasi qoladi. Kosmonavtlar uni tebranish bilan o'lchaydi: narsa prujinaga mahkamlanib, qanchalik tez tebranishi sanaladi. Og'iri yengilidan sekinroq tebranadi.",
      en: 'In space ordinary scales are useless: nothing presses on the pan there. But an object still has mass. Cosmonauts measure it by rocking: the object is fixed to a spring and they count how fast it rocks. A heavy one rocks more slowly than a light one.'
    },
    fact_audio: {
      ru: 'Вот что интересно. В космосе обычные весы бесполезны. Там ничего не давит на чашу, и стрелка стоит на нуле, даже если положить кирпич. Но масса у предмета никуда не делась. Космонавты придумали мерить её качанием. Предмет закрепляют на пружине и смотрят, как быстро он качается. Тяжёлый качается медленно, лёгкий быстро. По времени качания и узнают массу.',
      uz: "Mana qizig'i. Kosmosda oddiy tarozi foydasiz. U yerda hech nima tovoqqa bosmaydi, g'isht qo'ysangiz ham strelka nolda turadi. Lekin narsaning massasi yo'qolgani yo'q. Kosmonavtlar uni tebranish bilan o'lchashni o'ylab topishgan. Narsa prujinaga mahkamlanib, qanchalik tez tebranishi kuzatiladi. Og'iri sekin, yengili tez tebranadi. Tebranish vaqtiga qarab massa aniqlanadi.",
      en: 'Here is something interesting. In space ordinary scales are useless. Nothing presses on the pan there, and the needle stays at zero even if you put a brick on it. But the mass of the object has not gone anywhere. Cosmonauts thought of measuring it by rocking. The object is fixed to a spring and they watch how fast it rocks. A heavy one rocks slowly, a light one fast. From the time of the rocking they find the mass.'
    },
    audio: {
      intro: { ru: 'Три задания напоследок. Каждый раз смотри, в какой мерке спрашивают.', uz: "Oxirida uchta topshiriq. Har safar qaysi o'lchovda so'ralganiga qarang.", en: 'Three tasks at the end. Each time look at which measure is being asked for.' },
      on_correct: { ru: 'Верно.', uz: "To'g'ri.", en: 'Correct.' },
      on_wrong: { ru: 'Приведи величины к одной мерке.', uz: "Kattaliklarni bitta o'lchovga keltiring.", en: 'Bring the quantities to one measure.' }
    }
  },

  // s14 — YAKUN: keyingisi vaqt (reja 48-satr).
  s14: {
    eyebrow: { ru: 'Итог', uz: 'Yakun', en: 'Result' },
    mission_done: { ru: 'Склад взвешен!', uz: 'Ombor tortildi!', en: 'The store is weighed!' },
    cando: {
      ru: ['узнаю массу по весам', 'перевожу килограммы в граммы', 'привожу мерки к одной'],
      uz: ["tarozi bo'yicha massani bilaman", "kilogrammni grammga o'tkazaman", "o'lchovlarni bittaga keltiraman"],
      en: ['I find mass with the scales', 'I turn kilograms into grams', 'I bring the measures to one']
    },
    rule_recap: { ru: 'В одном килограмме тысяча граммов, а размер о массе ничего не говорит.', uz: "Bir kilogrammda ming gramm bor, o'lcham esa massa haqida hech nima aytmaydi.", en: 'There are a thousand grams in one kilogram, and size says nothing about mass.' },
    conn_label_refs: { ru: 'опирается на', uz: 'nimaga tayanadi', en: 'builds on' },
    conn_refs: { ru: 'урок 10: умножение на 1000; урок 34: единицы измерения', uz: "10-dars: 1000 ga ko'paytirish; 34-dars: o'lchov birliklari", en: 'lesson 10: multiplying by 1000; lesson 34: units of measurement' },
    conn_label_next: { ru: 'дальше', uz: 'keyin', en: 'next' },
    conn_next: { ru: 'время: час, минута и секунда', uz: 'vaqt: soat, daqiqa va soniya', en: 'time: the hour, the minute and the second' },
    audio: {
      ru: 'Склад взвешен. Запомни главное. Массу узнают весами, а не глазом. Большая коробка ваты легче маленькой коробки гвоздей. Лёгкое меряют в граммах, тяжёлое в килограммах, и в одном килограмме ровно тысяча граммов. А самое важное правило такое. Прежде чем складывать или вычитать, приведи обе величины к одной мерке. В следующий раз возьмём другую величину, которую нельзя потрогать. Это время!',
      uz: "Ombor tortildi. Asosiysini eslab qoling. Massa ko'z bilan emas, tarozi bilan bilinadi. Katta paxta qutisi kichik mix qutisidan yengil. Yengil narsa grammda, og'iri kilogrammda o'lchanadi, bir kilogrammda esa rosa ming gramm bor. Eng muhim qoida esa bu. Qo'shish yoki ayirishdan oldin ikkala kattalikni bitta o'lchovga keltiring. Keyingi safar ushlab bo'lmaydigan boshqa kattalikni olamiz. Bu vaqt!",
      en: 'The store is weighed. Remember the main thing. Mass is found with scales, not by eye. A big box of cotton wool is lighter than a small box of nails. Light things are measured in grams, heavy ones in kilograms, and there are exactly a thousand grams in one kilogram. And the most important rule is this. Before adding or subtracting, bring both quantities to one measure. Next time we will take another quantity, one you cannot touch. It is time!'
    }
  }
};

const BRIDGES = {
  s1:  { ru: 'Поставим на весы.', uz: "Taroziga qo'yamiz.", en: 'Let us put them on the scales.' },
  s2:  { ru: 'Теперь выберем мерку.', uz: "Endi o'lchov tanlaymiz.", en: 'Now let us choose the measure.' },
  s3:  { ru: "Соберём это в правило.", uz: "Buni qoidaga yig'amiz.", en: 'Let us gather this into a rule.' },
  s4:  { ru: 'Прочитай чертёж.', uz: "Chizmani o'qing.", en: 'Read the drawing.' },
  s5:  { ru: 'Разложи предметы.', uz: 'Narsalarni ajrating.', en: 'Sort the objects.' },
  s6:  { ru: 'Быстрый вопрос.', uz: 'Tez savol.', en: 'A quick question.' },
  s7:  { ru: 'Заполни консоль.', uz: "Konsolni to'ldiring.", en: 'Fill the console.' },
  s8:  { ru: 'Тут сложили разные мерки.', uz: "Bu yerda har xil o'lchov qo'shilibdi.", en: 'Here different measures were added.' },
  s9:  { ru: 'А вот и Бит со своим правилом.', uz: "Mana Bit ham o'z qoidasi bilan.", en: 'And here is Bit with his rule.' },
  s10: { ru: 'Теперь считай сам.', uz: "Endi o'zingiz hisoblang.", en: 'Now count on your own.' },
  s11: { ru: 'И ещё один пакет.', uz: 'Yana bitta paket.', en: 'And one more bag.' },
  s12: { ru: 'Задача со склада.', uz: 'Ombordan masala.', en: 'A task from the store.' },
  s13: { ru: 'Финальная проверка.', uz: 'Yakuniy tekshiruv.', en: 'The final check.' },
  s14: { ru: 'Подведём итог.', uz: 'Yakun yasaymiz.', en: 'Let us sum up.' }
};

const S14_PAYOFF = {
  ru: 'Склад взвешен. Мерка выбрана, и обе чаши сошлись.',
  uz: "Ombor tortildi. O'lchov tanlandi va ikkala tovoq tenglashdi.",
  en: 'The store is weighed. The measure is chosen and both pans agreed.'
};

// --- SAHNA TUGUNI (D42): 1-DARSNING Lumo shahri kitdan (`LumoCityBg`), ustiga darsning
// o'z qatlami — tarozi va toshlar. Metodist qarori 2026-08-10: qolgan darslarda shu sahna.
const ScaleNodeLayer = () => (
  <svg className="lm-scene-bg" viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <g transform="translate(196 118)">
      <rect x="-30" y="52" width="60" height="10" rx="3" fill="#C6AE7E" stroke="#8A7550" strokeWidth="1.2"/>
      <rect x="-4" y="-4" width="8" height="58" fill="#B7A176" stroke="#8A7550" strokeWidth="1"/>
      <line x1="-52" y1="-6" x2="52" y2="-6" stroke="#8A7550" strokeWidth="3" strokeLinecap="round"/>
      <g>
        <line x1="-52" y1="-6" x2="-52" y2="8" stroke="#8A7550" strokeWidth="1.4"/>
        <path d="M-70 8 h36 l-8 14 h-20 Z" fill="#DCEBF5" stroke="#7FA8BF" strokeWidth="1.4"/>
        <text x="-52" y="19" textAnchor="middle" fontSize="7" fontWeight="800" fill="#3F5A6B" fontFamily="'JetBrains Mono', monospace">g</text>
      </g>
      <g>
        <line x1="52" y1="-6" x2="52" y2="14" stroke="#8A7550" strokeWidth="1.4"/>
        <path d="M34 14 h36 l-8 14 h-20 Z" fill="#FFD98A" stroke="#C06A2E" strokeWidth="1.4"/>
        <text x="52" y="25" textAnchor="middle" fontSize="7" fontWeight="800" fill="#8A5A2E" fontFamily="'JetBrains Mono', monospace">kg</text>
      </g>
      <circle cx="0" cy="-6" r="4" fill="#FFE6A6" stroke="#8A7550" strokeWidth="1.2"/>
      <text x="0" y="74" textAnchor="middle" fontSize="7" letterSpacing="1.4" fill="#3F5A6B" fontFamily="'JetBrains Mono', monospace">1 kg = 1000 g</text>
    </g>
    <g transform="translate(96 176)">
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${i * 20} 0)`}>
          <path d="M0 0 h14 l3 12 h-20 Z" fill="#C9BCA2" stroke="#8A7550" strokeWidth="1"/>
          <rect x="4" y="-4" width="6" height="4" rx="1.5" fill="none" stroke="#8A7550" strokeWidth="1"/>
        </g>
      ))}
    </g>
  </svg>
);

const LessonScene = ({ gathered = false }) => {
  const kid = ({ key, El, hook }, i) => (
    <span key={key} className="lm-crew lm-crew-kid g1-pop-in" style={{ animationDelay: `${0.25 + i * 0.12}s` }}>
      <El {...(gathered ? { mood: 'happy', pose: 'happy' } : hook)}/>
    </span>
  );
  return (
    <div className="lm-scene">
      <LumoCityBg fill/>
      <ScaleNodeLayer/>
      <div className="lm-scene-cast">
        {LUMO_CAST.slice(0, 2).map(kid)}
        <span className={`lm-crew lm-crew-host ${gathered ? 'd2-bit-cheer' : 'lm-bob'}`}><span className="g1-cast-fig"><BitSVG state={gathered ? 'happy' : 'present'}/></span></span>
        {LUMO_CAST.slice(2).map((c, i) => kid(c, i + 2))}
      </div>
    </div>
  );
};

// --- EKRAN CHIZMASI (s4): tovoqda uchta bir xil tosh.
const WeightsFig = () => (
  <svg viewBox="0 0 220 120" style={{ width: 'min(260px, 82%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <path d="M20 46 h180 l-24 40 h-132 Z" fill="#F7F1E4" stroke="#8A7550" strokeWidth="2" strokeLinejoin="round"/>
    <line x1="110" y1="46" x2="110" y2="18" stroke="#8A7550" strokeWidth="2"/>
    <line x1="60" y1="18" x2="160" y2="18" stroke="#8A7550" strokeWidth="2.4" strokeLinecap="round"/>
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(${58 + i * 38} 22)`}>
        <path d="M0 0 h26 l5 20 h-36 Z" fill="#DCEBF5" stroke="#2E7E9E" strokeWidth="1.6"/>
        <rect x="9" y="-6" width="8" height="6" rx="2" fill="none" stroke="#2E7E9E" strokeWidth="1.4"/>
        <text x="13" y="15" textAnchor="middle" fontSize="8" fontWeight="800" fill="#2E7E9E" fontFamily="'JetBrains Mono', monospace">200</text>
      </g>
    ))}
    <text x="110" y="108" textAnchor="middle" fontSize="10" fontWeight="800" fill="#8A7550" fontFamily="'JetBrains Mono', monospace">? g</text>
  </svg>
);

// --- FACTCARD QAHRAMONI: prujinada tebranayotgan narsa — kosmosdagi tarozi.
const SpringFig = () => {
  const lang = useLang();
  return (
  <svg viewBox="0 0 220 104" style={{ width: 'min(266px, 84%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <line x1="30" y1="16" x2="190" y2="16" stroke="#8A7550" strokeWidth="3" strokeLinecap="round"/>
    <g transform="translate(74 16)">
      <path d="M0 0 v8 l-10 6 l20 8 l-20 8 l20 8 l-10 6 v6" fill="none" stroke="#2E7E9E" strokeWidth="2.2" strokeLinejoin="round"/>
      <rect x="-14" y="50" width="28" height="20" rx="4" fill="#DCEBF5" stroke="#2E7E9E" strokeWidth="1.8"/>
      <text x="0" y="86" textAnchor="middle" fontSize="9" fontWeight="800" fill="#2E7E9E" fontFamily="'JetBrains Mono', monospace">{tri(lang, 'быстро', 'tez', 'fast')}</text>
    </g>
    <g transform="translate(150 16)">
      <path d="M0 0 v12 l-12 8 l24 10 l-24 10 l24 10 l-12 8 v4" fill="none" stroke="#C06A2E" strokeWidth="2.2" strokeLinejoin="round"/>
      <rect x="-18" y="62" width="36" height="24" rx="4" fill="#FFD98A" stroke="#C06A2E" strokeWidth="1.8"/>
      <text x="0" y="100" textAnchor="middle" fontSize="9" fontWeight="800" fill="#C06A2E" fontFamily="'JetBrains Mono', monospace">{tri(lang, 'медленно', 'sekin', 'slowly')}</text>
    </g>
  </svg>
  );
};

export default createLesson({
  TOTAL_SCREENS, LESSON_META, SCREEN_META, CONTENT, BRIDGES, S14_PAYOFF,
  STYLES: LESSON_STYLES,
  Scene: LessonScene,
  FactFig: SpringFig,
  figs: { s4: <WeightsFig/> }
});
