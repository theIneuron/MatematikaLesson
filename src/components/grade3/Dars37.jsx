import React from 'react';
import { AncientHallBg, BitSVG, HALL_SLAB, LUMO_CAST, createLesson, useLang, tri } from './_kit/index.jsx';
import { LESSON_STYLES } from './_kit/styles.js';

// ============================================================================
// DD 3-SINF | Dars37 — "Shakllarni o'lchov bo'yicha solishtirish" (num-3-37)
// Б5 «KRISTALL ARXITEKTURA»
// Syujet: kristall kvartal davom etadi (SYUJET_3SINF.md 194-satr, reja 41-satr).
// SAHNA: metodist qarori 2026-08-09 — qolgan darslarda 8-DARS sahnasi, qadimgi zal.
//   Zalning o'zi kitda (`AncientHallBg`), dars markazga o'z narsasini qo'yadi: yonma-yon
//   turgan ikki panel.
// DARSLIK ASOSI (Burxonov, 3-sinf, «Sharq» 2019, 162-bet): bir xil yuzali shakllarning
//   perimetri har xil bo'lishi mumkin.
// YADRO: 2 ga 8 va 4 ga 4 panellarda kataklar TENG (16), chekka esa har xil (20 va 16).
//   Demak «kattaroq» degan so'z o'zi yetarli emas — qaysi o'lchov bo'yicha, deb so'rash kerak.
// Misconception: M1 «perimetr katta bo'lsa yuza ham katta»; M2 har xil kattaliklarni
//   solishtirish; M3 sm² ni sm bilan solishtirish; M4 «cho'ziq shakl har doim kattaroq».
// FactCard: asalarilar uyani olti burchakli qiladi — bir xil yuzaga eng kam mum ketadi.
// Bu dars MA'LUMOT fayli: ekranlar va mexanika kitda (`createLesson`), bu yerda faqat
// darsning o'zi — matnlar, sahna tuguni va fakt rasmi.
// ============================================================================
const TOTAL_SCREENS = 15;
const LESSON_META = {
  lessonId: 'grade3-37',
  lessonTitle: { ru: 'Урок 37. Сравнение фигур по мерке', uz: "37-dars. Shakllarni o'lchov bo'yicha solishtirish", en: 'Lesson 37. Comparing figures by a measure' }
};
// STRUKTURA: s0 xuk ikki panel · s1 kataklarni sanash · s2 chekkani o'lchash · s3 QOIDA
// «qaysi o'lchov» · s4 chizma bo'yicha 3 ga 6 va 2 ga 9 · s5 saralash teng yoki har xil ·
// s6 test chekka qaysida uzun · s7 konsol ikki panel · s8 xatoni top (sm va sm²) ·
// s9 Bit tuzog'i (cho'ziq demak katta) · s10 trenajyor perimetr · s11 trenajyor yuza ·
// s12 masala ikki xona · s13 final 3 topshiriq + FactCard · s14 yakun.
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
  // s0 — XUK: ikki panel, kataklar teng, ko'rinish har xil.
  s0: {
    eyebrow: { ru: 'Крючок', uz: 'Qiziqtirish', en: 'Hook' },
    topic: { ru: 'Сравнение фигур по мерке', uz: "Shakllarni o'lchov bo'yicha solishtirish", en: 'Comparing figures by a measure' },
    lead: { ru: 'Две панели: 2 на 8 и 4 на 4', uz: "Ikki panel: 2 ga 8 va 4 ga 4", en: 'Two panels: 2 by 8 and 4 by 4' },
    order_cap: { ru: 'какая из них больше', uz: 'qaysi biri kattaroq', en: 'which of them is bigger' },
    plate: ['2·8', '?', '4·4'],
    q: { ru: 'У какой панели больше клеток?', uz: 'Qaysi panelda katak ko\'proq?', en: 'Which panel has more squares?' },
    opt0: { ru: 'поровну', uz: 'teng', en: 'the same' },
    opt1: { ru: 'у длинной', uz: "cho'zig'ida", en: 'the long one' },
    opt2: { ru: 'у квадратной', uz: 'kvadratida', en: 'the square one' },
    opt3: { ru: 'у длинной вдвое больше', uz: "cho'zig'ida ikki barobar ko'p", en: 'the long one has twice as many' },
    audio: {
      intro: {
        ru: [
          'Площадь и периметр ты уже находишь. Сегодня научимся сравнивать фигуры.',
          'Вот две панели. Одна длинная, два на восемь. Другая квадратная, четыре на четыре.',
          'На вид они совсем разные.',
          'Как думаешь, у какой панели больше клеток?'
        ],
        uz: [
          "Yuza va perimetrni topa olasiz. Bugun shakllarni solishtirishni o'rganamiz.",
          "Mana ikki panel. Biri cho'ziq, ikki ga sakkiz. Ikkinchisi kvadrat, to'rt ga to'rt.",
          "Ko'rinishdan ular butunlay boshqacha.",
          "Sizningcha, qaysi panelda katak ko'proq?"
        ],
        en: ['You can already find area and perimeter. Today we will learn to compare figures.', 'Here are two panels. One is long, two by eight. The other is square, four by four.', 'They look completely different.', 'Which panel do you think has more squares?']
      },
      on_correct: { ru: 'Верно! Клеток поровну. Сейчас увидишь, чем эти панели всё же различаются.', uz: "To'g'ri! Kataklar teng. Endi bu panellar baribir nimasi bilan farq qilishini ko'rasiz.", en: 'Right! There is the same number of squares. Now you will see how these panels do differ.' },
      on_wrong1: { ru: 'Длинная только кажется больше. Посчитай клетки, их шестнадцать и там, и там.', uz: "Cho'ziq faqat kattaroq bo'lib ko'rinadi. Kataklarni sanang, ikkalasida ham o'n oltita.", en: 'The long one only looks bigger. Count the squares, there are sixteen in both.' },
      on_wrong2: { ru: 'У квадратной тоже шестнадцать. Обе панели вмещают поровну.', uz: "Kvadratida ham o'n oltita. Ikkala panel ham teng sig'diradi.", en: 'The square one has sixteen too. Both panels hold the same amount.' },
      on_idk: { ru: 'Ничего. Сейчас посчитаем клетки в обеих.', uz: "Hechqisi yo'q. Hozir ikkalasidagi kataklarni sanaymiz.", en: 'Never mind. Let us count the squares in both.' }
    }
  },

  // s1 — MODEL: kataklarni sanaymiz, teng chiqadi.
  s1: {
    eyebrow: { ru: 'Разбор', uz: 'Tahlil', en: 'Working it out' },
    lead: { ru: 'Считаем клетки в обеих панелях', uz: "Ikkala paneldagi kataklarni sanaymiz", en: 'We count the squares in both panels' },
    task_line: 'панели 2 на 8 и 4 на 4',
    task_line_uz: "panellar 2 ga 8 va 4 ga 4",
    task_line_en: 'panels 2 by 8 and 4 by 4',
    step1: '2 · 8 = 16',
    step1_cap: { ru: 'длинная панель', uz: "cho'ziq panel", en: 'the long panel' },
    step2: '4 · 4 = 16',
    step2_cap: { ru: 'квадратная панель', uz: 'kvadrat panel', en: 'the square panel' },
    res: { ru: 'S одинаковая', uz: 'S bir xil', en: 'S is the same' },
    btn1: { ru: 'Посчитать длинную', uz: "Cho'ziqni sanash", en: 'Count the long one' },
    btn2: { ru: 'Посчитать квадратную', uz: 'Kvadratni sanash', en: 'Count the square one' },
    done_text: { ru: 'Клеток поровну, по шестнадцать. По площади панели равны.', uz: "Kataklar teng, o'n oltitadan. Yuza bo'yicha panellar teng.", en: 'The same number of squares, sixteen each. By area the panels are equal.' },
    audio: {
      ru: [
        'Посчитаем клетки в каждой панели.',
        'В длинной два ряда по восемь, шестнадцать клеток.',
        'В квадратной четыре ряда по четыре, тоже шестнадцать. По площади панели равны.'
      ],
      uz: [
        "Har bir paneldagi kataklarni sanaymiz.",
        "Cho'ziqda sakkiztadan ikki qator, o'n oltita katak.",
        "Kvadratda to'rttadan to'rt qator, ham o'n oltita. Yuza bo'yicha panellar teng."
      ],
      en: ['Let us count the squares in each panel.', 'The long one has two rows of eight, sixteen squares.', 'The square one has four rows of four, sixteen too. By area the panels are equal.']
    }
  },

  // s2 — MODEL: chekkani o'lchaymiz, har xil chiqadi.
  s2: {
    eyebrow: { ru: 'Разбор', uz: 'Tahlil', en: 'Working it out' },
    w: 2,
    h: 8,
    lead: { ru: 'А теперь измерим край каждой панели', uz: "Endi har bir panelning chekkasini o'lchaymiz", en: 'And now let us measure the edge of each panel' },
    capA: { ru: 'длинная: (2 + 8) · 2 = 20', uz: "cho'ziq: (2 + 8) · 2 = 20", en: 'the long one: (2 + 8) · 2 = 20' },
    capB: { ru: 'квадратная: 4 · 4 = 16', uz: 'kvadrat: 4 · 4 = 16', en: 'the square one: 4 · 4 = 16' },
    res: { ru: 'P разный', uz: 'P har xil', en: 'P is different' },
    btn1: { ru: 'Обойти длинную', uz: "Cho'ziqni aylanish", en: 'Go round the long one' },
    btn2: { ru: 'Обойти квадратную', uz: 'Kvadratni aylanish', en: 'Go round the square one' },
    done_text: { ru: 'Край разный, двадцать и шестнадцать. Площадь равна, а периметр нет.', uz: "Chekka har xil, yigirma va o'n olti. Yuza teng, perimetr esa yo'q.", en: 'The edge is different, twenty and sixteen. The area is equal, the perimeter is not.' },
    audio: {
      ru: [
        'Клеток поровну, а край посмотрим отдельно.',
        'Длинную панель обходим по краю, получается двадцать.',
        'Квадратную обходим, получается шестнадцать. Площадь одинаковая, а край разный.'
      ],
      uz: [
        "Kataklar teng, chekkaga esa alohida qaraymiz.",
        "Cho'ziq panelni chekka bo'ylab aylanamiz, yigirma chiqadi.",
        "Kvadratni aylanamiz, o'n olti chiqadi. Yuza bir xil, chekka esa har xil."
      ],
      en: ['The number of squares is the same, and we will look at the edge separately.', 'We go round the long panel along the edge and get twenty.', 'We go round the square one and get sixteen. The area is the same and the edge is different.']
    }
  },

  // s3 — QOIDA: avval kattalikni ayt, keyin solishtir.
  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    q: { ru: 'Что нужно сделать раньше, чем сказать «эта фигура больше»?', uz: "«Bu shakl kattaroq» deyishdan oldin nima qilish kerak?", en: 'What has to be done before saying "this figure is bigger"?' },
    opts: [
      { ru: 'назвать величину', uz: 'kattalikni aytish', en: 'name the quantity' },
      { ru: 'посмотреть на глаз', uz: "ko'z bilan qarash", en: 'look at it by eye' },
      { ru: 'сравнить длину сторон', uz: 'tomonlar uzunligini solishtirish', en: 'compare the lengths of the sides' },
      { ru: 'взять ту, что длиннее', uz: "cho'ziqroq bo'lganini olish", en: 'take the longer one' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'На глаз длинная кажется больше, а клеток у неё столько же.', uz: "Ko'z bilan cho'ziq kattaroq ko'rinadi, kataklari esa shuncha.", en: 'By eye the long one looks bigger, and it has just as many squares.' },
      2: { ru: 'Стороны разные, но это ещё не ответ. Спрашивают про величину.', uz: "Tomonlar har xil, lekin bu hali javob emas. Kattalik so'ralgan.", en: 'The sides are different, but that is not the answer yet. The question is about a quantity.' },
      3: { ru: 'Длина не решает, по площади они равны.', uz: "Uzunlik hal qilmaydi, yuza bo'yicha ular teng.", en: 'Length does not decide it, by area they are equal.' }
    },
    on_correct: { ru: 'Верно. Сначала величина, потом сравнение.', uz: "To'g'ri. Avval kattalik, keyin solishtirish.", en: 'Right. First the quantity, then the comparison.' },
    rule_lines: {
      ru: ['сравнивают по одной величине', 'площадь с площадью, периметр с периметром', 'см² не сравнивают с см'],
      uz: ["bitta kattalik bo'yicha solishtiriladi", "yuza yuza bilan, perimetr perimetr bilan", "sm² sm bilan solishtirilmaydi"],
      en: ['we compare by one quantity', 'area with area, perimeter with perimeter', 'sq cm are not compared with cm']
    },
    rule_ex: 'S = 16 = 16, P = 20 > 16',
    rule_speech: { ru: 'Сравнивают всегда по одной величине. Площадь сравнивают с площадью, а край с краем. У наших панелей площадь равна, а край у длинной больше.', uz: "Har doim bitta kattalik bo'yicha solishtiriladi. Yuza yuza bilan, chekka chekka bilan. Bizning panellarda yuza teng, chekka esa cho'ziqda kattaroq.", en: 'We always compare by one quantity. Area is compared with area, and the edge with the edge. Our panels have equal area, and the long one has a bigger edge.' },
    audio: {
      intro: { ru: 'Соберём правило. Мы увидели, что одна и та же пара фигур может быть и равной, и разной.', uz: "Qoidani yig'amiz. Bitta juft shakl ham teng, ham har xil bo'la olishini ko'rdik.", en: 'Let us gather the rule. We saw that the same pair of figures can be both equal and different.' }
    }
  },

  // s4 — CHIZMA: 3 ga 6 va 2 ga 9, yuzasi teng.
  s4: {
    eyebrow: { ru: 'Чертёж', uz: 'Chizma', en: 'The drawing' },
    q: { ru: 'Панели 3 на 6 и 2 на 9. Что у них одинаково?', uz: "Panellar 3 ga 6 va 2 ga 9. Ularda nima bir xil?", en: 'Panels 3 by 6 and 2 by 9. What is the same about them?' },
    fig_w: 3,
    fig_h: 6,
    opts: [
      { ru: 'площадь', uz: 'yuza', en: 'the area' },
      { ru: 'периметр', uz: 'perimetr', en: 'the perimeter' },
      { ru: 'длина', uz: 'uzunlik', en: 'the length' },
      { ru: 'ничего', uz: 'hech nima', en: 'nothing' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Край посчитай. У первой восемнадцать, у второй двадцать два.', uz: "Chekkani sanang. Birinchisida o'n sakkiz, ikkinchisida yigirma ikki.", en: 'Work out the edge. The first has eighteen, the second twenty two.' },
      2: { ru: 'Длина у них разная, шесть и девять.', uz: "Uzunligi har xil, olti va to'qqiz.", en: 'Their length is different, six and nine.' },
      3: { ru: 'Кое-что всё же совпало. Посчитай клетки внутри.', uz: "Baribir bir narsa mos tushdi. Ichkaridagi kataklarni sanang.", en: 'Something did match after all. Count the squares inside.' }
    },
    audio: {
      intro: { ru: 'Посмотри на чертёж. Две панели, три на шесть и два на девять. Что у них одинаково?', uz: "Chizmaga qarang. Ikki panel, uch ga olti va ikki ga to'qqiz. Ularda nima bir xil?", en: 'Look at the drawing. Two panels, three by six and two by nine. What is the same about them?' },
      on_correct: { ru: 'Верно. Восемнадцать клеток и там, и там.', uz: "To'g'ri. Ikkalasida ham o'n sakkizta katak.", en: 'Right. Eighteen squares in both.' },
      on_wrong: { ru: 'Посчитай сначала клетки, потом край.', uz: "Avval kataklarni, keyin chekkani sanang.", en: 'Count the squares first, then the edge.' }
    }
  },

  // s5 — SARALASH: shu juftlikda nima teng, nima har xil.
  s5: {
    eyebrow: { ru: 'Сортировка', uz: 'Saralash', en: 'Sorting' },
    lead: { ru: 'Панели 2 на 8 и 4 на 4. Разложи, что совпало', uz: "Panellar 2 ga 8 va 4 ga 4. Nima mos tushganini ajrating", en: 'Panels 2 by 8 and 4 by 4. Sort out what matched' },
    bin_a: { ru: 'одинаково', uz: 'bir xil', en: 'the same' },
    bin_b: { ru: 'по-разному', uz: 'har xil', en: 'different' },
    items: [
      { n: { ru: 'клетки внутри', uz: 'ichkaridagi kataklar', en: 'the squares inside' }, a: true, hint: { ru: 'Шестнадцать и там, и там.', uz: "Ikkalasida ham o'n oltita.", en: 'Sixteen in both.' } },
      { n: { ru: 'путь по краю', uz: "chekka bo'ylab yo'l", en: 'the path along the edge' }, a: false, hint: { ru: 'Двадцать и шестнадцать.', uz: "Yigirma va o'n olti.", en: 'Twenty and sixteen.' } },
      { n: { ru: 'длина стороны', uz: 'tomon uzunligi', en: 'the length of a side' }, a: false, hint: { ru: 'Восемь и четыре, это разные числа.', uz: "Sakkiz va to'rt, bu har xil sonlar.", en: 'Eight and four, those are different numbers.' } },
      { n: { ru: 'площадь', uz: 'yuza', en: 'the area' }, a: true, hint: { ru: 'Площадь это и есть клетки внутри.', uz: "Yuza bu ichkaridagi kataklarning o'zi.", en: 'Area is exactly the squares inside.' } }
    ],
    audio: {
      intro: { ru: 'Четыре записи про одну и ту же пару панелей. Отправь каждую в свою корзину.', uz: "Bitta juft panel haqida to'rtta yozuv. Har birini o'z savatiga yuboring.", en: 'Four lines about the very same pair of panels. Send each one to its basket.' },
      on_correct: { ru: 'Всё на месте. Одна пара фигур, а ответ зависит от того, что мы меряем.', uz: "Hammasi joyida. Shakllar bitta juft, javob esa nimani o'lchashimizga bog'liq.", en: 'All in place. One pair of figures, and the answer depends on what we measure.' },
      on_wrong: { ru: 'Посчитай обе панели по этой величине и сравни числа.', uz: "Ikkala panelni shu kattalik bo'yicha hisoblab, sonlarni solishtiring.", en: 'Work out both panels by this quantity and compare the numbers.' }
    }
  },

  // s6 — TEST: chekka qaysida uzun.
  s6: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv', en: 'Checking' },
    q: { ru: 'Панели 1 на 12 и 3 на 4. У какой край длиннее?', uz: "Panellar 1 ga 12 va 3 ga 4. Qaysinisida chekka uzunroq?", en: 'Panels 1 by 12 and 3 by 4. Which has the longer edge?' },
    opts: [
      { ru: 'у 1 на 12', uz: '1 ga 12 da', en: '1 by 12' },
      { ru: 'у 3 на 4', uz: '3 ga 4 da', en: '3 by 4' },
      { ru: 'одинаково', uz: 'bir xil', en: 'the same' },
      { ru: 'нельзя сравнить', uz: "solishtirib bo'lmaydi", en: 'they cannot be compared' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'У три на четыре край четырнадцать, а у длинной двадцать шесть.', uz: "Uch ga to'rtda chekka o'n to'rt, cho'ziqda esa yigirma olti.", en: 'Three by four has an edge of fourteen, and the long one has twenty six.' },
      2: { ru: 'Клеток поровну, по двенадцать, а край разный.', uz: "Kataklar teng, o'n ikkitadan, chekka esa har xil.", en: 'There is the same number of squares, twelve each, and the edge is different.' },
      3: { ru: 'Сравнить можно, обе величины это длина, обе в сантиметрах.', uz: "Solishtirsa bo'ladi, ikkala kattalik ham uzunlik, ikkalasi ham santimetrda.", en: 'They can be compared, both quantities are lengths, both in centimetres.' }
    },
    audio: {
      intro: { ru: 'Быстрый вопрос. Панели один на двенадцать и три на четыре. У какой край длиннее?', uz: "Tez savol. Panellar bir ga o'n ikki va uch ga to'rt. Qaysinisida chekka uzunroq?", en: 'A quick question. Panels one by twelve and three by four. Which has the longer edge?' },
      on_correct: { ru: 'Верно. Чем сильнее фигура вытянута, тем длиннее её край.', uz: "To'g'ri. Shakl qanchalik cho'ziq bo'lsa, chekkasi shunchalik uzun.", en: 'Right. The more stretched out a figure is, the longer its edge.' },
      on_wrong: { ru: 'Обойди по краю обе панели и сравни числа.', uz: "Ikkala panelni chekka bo'ylab aylanib, sonlarni solishtiring.", en: 'Go round both panels along the edge and compare the numbers.' }
    }
  },

  // s7 — KONSOL: ikki panel yonma-yon.
  s7: {
    eyebrow: { ru: 'Консоль', uz: 'Konsol', en: 'Console' },
    lead: { ru: 'Заполни консоль для панелей 3 на 6 и 2 на 9', uz: "3 ga 6 va 2 ga 9 panellar uchun konsolni to'ldiring", en: 'Fill the console for panels 3 by 6 and 2 by 9' },
    swap_line: { ru: 'панели 3 на 6 и 2 на 9', uz: 'panellar 3 ga 6 va 2 ga 9', en: 'panels 3 by 6 and 2 by 9' },
    cells: [
      { head: { ru: 'площадь первой', uz: 'birinchining yuzasi', en: 'the area of the first' }, label: '3 · 6', ans: 18, hint: { ru: 'Длину умножь на ширину.', uz: "Uzunlikni enga ko'paytiring.", en: 'Multiply the length by the width.' } },
      { head: { ru: 'площадь второй', uz: 'ikkinchining yuzasi', en: 'the area of the second' }, label: '2 · 9', ans: 18, hint: { ru: 'И здесь длина на ширину.', uz: "Bu yerda ham uzunlik enga.", en: 'Length times width here too.' } },
      { head: { ru: 'край второй', uz: 'ikkinchining chekkasi', en: 'the edge of the second' }, label: '(2 + 9) · 2', ans: 22, hint: { ru: 'Сложи две стороны и удвой.', uz: "Ikki tomonni qo'shib, ikkilantiring.", en: 'Add two sides and double it.' } }
    ],
    check: 'S = 18 = 18, P = 22',
    check_label: { ru: 'площадь равна, край нет', uz: "yuza teng, chekka yo'q", en: 'the area is equal, the edge is not' },
    audio: {
      intro: { ru: 'Заполни три окна. Площадь каждой панели и край второй.', uz: "Uchta oynani to'ldiring. Har bir panelning yuzasi va ikkinchisining chekkasi.", en: 'Fill three windows. The area of each panel and the edge of the second.' },
      on_correct: { ru: 'Восемнадцать и восемнадцать, а край двадцать два. Площадь равна, край нет.', uz: "O'n sakkiz va o'n sakkiz, chekka esa yigirma ikki. Yuza teng, chekka yo'q.", en: 'Eighteen and eighteen, and the edge is twenty two. The area is equal, the edge is not.' }
    }
  },

  // s8 — XATONI TOP: sm² ni sm bilan solishtirish (M3).
  s8: {
    eyebrow: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    q: { ru: 'Записали: S = 16 см² больше, чем P = 16 см. Где ошибка?', uz: "S = 16 sm², P = 16 sm dan katta deb yozilibdi. Xato qayerda?", en: 'They wrote: S = 16 sq cm is bigger than P = 16 cm. Where is the mistake?' },
    fig_line: { ru: '16 см² ? 16 см', uz: '16 sm² ? 16 sm', en: '16 sq cm ? 16 cm' },
    opts: [
      { ru: 'сравнили разные величины', uz: 'har xil kattalik solishtirilgan', en: 'different quantities were compared' },
      { ru: 'ошибки нет', uz: "xato yo'q", en: 'there is no mistake' },
      { ru: 'посчитали площадь', uz: 'yuza noto\'g\'ri hisoblangan', en: 'the area was worked out' },
      { ru: 'забыли единицы', uz: 'birliklar unutilgan', en: 'the units were forgotten' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Числа равны, но одно про клетки, другое про длину.', uz: "Sonlar teng, biri kataklar haqida, ikkinchisi uzunlik haqida.", en: 'The numbers are equal, but one is about squares and the other about length.' },
      2: { ru: 'Площадь посчитана верно, шестнадцать.', uz: "Yuza to'g'ri hisoblangan, o'n olti.", en: 'The area was worked out correctly, sixteen.' },
      3: { ru: 'Единицы как раз написаны, и они разные.', uz: "Birliklar yozilgan, va ular har xil.", en: 'The units are written in fact, and they are different.' }
    },
    audio: {
      intro: { ru: 'Кто-то сравнил площадь с периметром. Найди ошибку.', uz: "Kimdir yuzani perimetr bilan solishtiribdi. Xatoni toping.", en: 'Someone compared area with perimeter. Find the mistake.' },
      on_correct: { ru: 'Верно. Квадратные сантиметры и просто сантиметры это разные мерки, их не сравнивают.', uz: "To'g'ri. Kvadrat santimetr va oddiy santimetr har xil o'lchov, ular solishtirilmaydi.", en: 'Right. Square centimetres and plain centimetres are different measures, they are not compared.' },
      on_wrong: { ru: 'Посмотри на единицы. Одна мерка про клетки, другая про длину.', uz: "Birliklarga qarang. Bir o'lchov kataklar haqida, ikkinchisi uzunlik haqida.", en: 'Look at the units. One measure is about squares, the other about length.' }
    }
  },

  // s9 — BIT TUZOG'I: cho'ziq demak kattaroq (M4).
  s9: {
    eyebrow: { ru: 'Ловушка Бита', uz: "Bit tuzog'i", en: "Bit's trap" },
    lead: { ru: 'Бит выбирает панель для склада', uz: "Bit ombor uchun panel tanlayapti", en: 'Bit is choosing a panel for the store' },
    lines: ['панели 2 на 8 и 4 на 4', 'Бит: длинная больше, беру её'],
    lines_uz: ["panellar 2 ga 8 va 4 ga 4", "Bit: cho'ziq kattaroq, shuni olaman"],
    lines_en: ['panels 2 by 8 and 4 by 4', 'Bit: the long one is bigger, I take it'],
    line_cap: { ru: 'Бит: она же длиннее', uz: "Bit: axir u cho'ziqroq", en: 'Bit: it is longer, after all' },
    trap_label: { ru: 'Так ли это?', uz: 'Shundaymi?', en: 'Is that so?' },
    trap_opts: { ru: ['нет, места в них поровну', 'да, длинная больше'], uz: ["yo'q, ularda joy teng", "ha, cho'ziq kattaroq"], en: ['no, they have the same room', 'yes, the long one is bigger'] },
    trap_ci: 0,
    trap_correct: { ru: 'Да. Клеток в обеих по шестнадцать, места одинаково. Длиннее у неё только край, а на склад важно как раз место внутри.', uz: "Ha. Ikkalasida ham o'n oltitadan katak, joy bir xil. Unda faqat chekka uzunroq, omborga esa aynan ichkaridagi joy kerak.", en: 'Yes. Both have sixteen squares, the room is the same. Only its edge is longer, and for a store it is exactly the room inside that matters.' },
    trap_wrong: { ru: 'Посчитай клетки в обеих панелях. Шестнадцать и шестнадцать, места поровну.', uz: "Ikkala paneldagi kataklarni sanang. O'n olti va o'n olti, joy teng.", en: 'Count the squares in both panels. Sixteen and sixteen, the room is the same.' },
    audio: {
      ru: [
        'Бит выбирает панель для склада.',
        'Эта длиннее, значит на неё влезет больше. Беру длинную.',
        'Так ли это?'
      ],
      uz: [
        "Bit ombor uchun panel tanlayapti.",
        "Bu cho'ziqroq, demak unga ko'proq sig'adi. Cho'ziqni olaman.",
        "Shundaymi?"
      ],
      en: ['Bit is choosing a panel for the store.', 'This one is longer, so more will fit on it. I take the long one.', 'Is that so?']
    }
  },

  // s10 — TRENAJYOR: perimetr.
  s10: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq', en: 'Trainer' },
    q: { ru: 'Панель 3 на 6 см. Чему равен периметр в см?', uz: "Panel 3 ga 6 sm. Perimetri sm da nechaga teng?", en: 'A panel is 3 by 6 cm. What is the perimeter in cm?' },
    ans: 18,
    check: '(3 + 6) · 2',
    check_label: { ru: 'путь по краю', uz: "chekka bo'ylab yo'l", en: 'the path along the edge' },
    hint: { ru: 'Сложи две соседние стороны и удвой.', uz: "Ikki qo'shni tomonni qo'shib, ikkilantiring.", en: 'Add two neighbouring sides and double it.' },
    audio: {
      intro: { ru: 'Теперь считай сам. Панель три на шесть, чему равен периметр?', uz: "Endi o'zingiz hisoblang. Panel uch ga olti, perimetri nechaga teng?", en: 'Now count on your own. A panel three by six, what is the perimeter?' },
      on_correct: { ru: 'Восемнадцать сантиметров.', uz: "O'n sakkiz santimetr.", en: 'Eighteen centimetres.' }
    }
  },

  // s11 — TRENAJYOR: yuza shu juftlikda.
  s11: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq', en: 'Trainer' },
    q: { ru: 'Панель 2 на 9 см. Чему равна площадь в см²?', uz: "Panel 2 ga 9 sm. Yuzasi sm² da nechaga teng?", en: 'A panel is 2 by 9 cm. What is the area in sq cm?' },
    ans: 18,
    check: '2 · 9',
    check_label: { ru: 'клетки внутри', uz: 'ichkaridagi kataklar', en: 'the squares inside' },
    hint: { ru: 'Два умножь на девять.', uz: "Ikkini to'qqizga ko'paytiring.", en: 'Multiply two by nine.' },
    audio: {
      intro: { ru: 'И вторая панель. Два на девять, чему равна площадь?', uz: "Ikkinchi panel ham. Ikki ga to'qqiz, yuzasi nechaga teng?", en: 'And the second panel. Two by nine, what is the area?' },
      on_correct: { ru: 'Восемнадцать квадратных сантиметров, столько же, сколько у первой.', uz: "O'n sakkiz kvadrat santimetr, birinchisidagi bilan bir xil.", en: 'Eighteen square centimetres, the same as the first one.' }
    }
  },

  // s12 — MASALA: ikki xona, savolga qarab kattalik tanlanadi.
  s12: {
    eyebrow: { ru: 'Задача', uz: 'Masala', en: 'Word problem' },
    lead: { ru: 'Две кладовые кристаллов', uz: 'Ikki kristall omborxona', en: 'Two crystal storerooms' },
    q: { ru: 'Первая кладовая 4 на 5 м, вторая 2 на 10 м. В какую влезет больше кристаллов и на сколько метров длиннее край второй?', uz: "Birinchi omborxona 4 ga 5 m, ikkinchisi 2 ga 10 m. Qaysi biriga ko'proq kristall sig'adi va ikkinchisining chekkasi necha metr uzunroq?", en: 'The first storeroom is 4 by 5 m, the second is 2 by 10 m. Which holds more crystals and how many metres longer is the edge of the second?' },
    q_speech: { ru: 'первая кладовая четыре на пять метров, вторая два на десять. В какую влезет больше кристаллов и на сколько метров длиннее край второй?', uz: "birinchi omborxona to'rt ga besh metr, ikkinchisi ikki ga o'n. Qaysi biriga ko'proq kristall sig'adi va ikkinchisining chekkasi necha metr uzunroq?", en: 'the first storeroom is four by five metres, the second is two by ten. Which holds more crystals and how many metres longer is the edge of the second?' },
    tbl_heads: [
      { ru: 'первая', uz: 'birinchi', en: 'the first' },
      { ru: 'вторая', uz: 'ikkinchi', en: 'the second' },
      { ru: 'вопрос', uz: 'savol', en: 'question' }
    ],
    tbl_cells: ['4 · 5', '2 · 10', '?'],
    pick_label: { ru: 'С какого действия начинаем?', uz: 'Qaysi amaldan boshlaymiz?', en: 'Which operation do we start with?' },
    opts: [
      { ru: 'посчитать площади', uz: 'yuzalarni hisoblash', en: 'work out the areas' },
      { ru: 'посчитать края', uz: 'chekkalarni hisoblash', en: 'work out the edges' },
      { ru: 'сравнить длины', uz: 'uzunliklarni solishtirish', en: 'compare the lengths' },
      { ru: 'сложить стороны', uz: "tomonlarni qo'shish", en: 'add the sides' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Край понадобится, но во втором вопросе. Первым спрашивают про место.', uz: "Chekka kerak bo'ladi, lekin ikkinchi savolda. Birinchi bo'lib joy so'ralgan.", en: 'The edge will be needed, but in the second question. The room is asked about first.' },
      2: { ru: 'Длина одной стороны не скажет, сколько влезет.', uz: "Bitta tomon uzunligi qancha sig'ishini aytmaydi.", en: 'The length of one side will not say how much fits in.' },
      3: { ru: 'Сумма сторон это про край, а не про место.', uz: "Tomonlar yig'indisi chekka haqida, joy haqida emas.", en: 'The sum of the sides is about the edge, not about the room.' }
    },
    pick_ok: { ru: 'Верно. Сначала место, потом край.', uz: "To'g'ri. Avval joy, keyin chekka.", en: 'Right. First the room, then the edge.' },
    step1_q: { ru: 'Сколько квадратных метров в каждой кладовой?', uz: 'Har bir omborxonada necha kvadrat metr bor?', en: 'How many square metres are in each storeroom?' },
    ans1: 20,
    hint1: { ru: 'Четыре на пять и два на десять дают одно и то же число.', uz: "To'rt ga besh va ikki ga o'n bitta sonni beradi.", en: 'Four by five and two by ten give the very same number.' },
    step2_q: { ru: 'На сколько метров край второй длиннее?', uz: 'Ikkinchisining chekkasi necha metr uzunroq?', en: 'How many metres longer is the edge of the second?' },
    ans2: 6,
    hint2: { ru: 'Край первой восемнадцать, второй двадцать четыре.', uz: "Birinchisining chekkasi o'n sakkiz, ikkinchisiniki yigirma to'rt.", en: 'The edge of the first is eighteen, of the second twenty four.' },
    check: 'S = 20 = 20, P: 24 − 18',
    setup_audio: { ru: 'Кладовые готовят к загрузке. Посмотри на таблицу и реши, с чего начать.', uz: "Omborxonalar yuklashga tayyorlanmoqda. Jadvalga qarang va nimadan boshlashni hal qiling.", en: 'The storerooms are being prepared for loading. Look at the table and decide where to start.' },
    audio: {
      intro: { ru: 'Первая кладовая четыре на пять метров, вторая два на десять. Куда влезет больше и на сколько длиннее край второй?', uz: "Birinchi omborxona to'rt ga besh metr, ikkinchisi ikki ga o'n. Qayerga ko'proq sig'adi va ikkinchisining chekkasi nechaga uzun?", en: 'The first storeroom is four by five metres, the second is two by ten. Which holds more and how many metres longer is the edge of the second?' },
      on_correct: { ru: 'В обе влезет поровну, по двадцать квадратных метров, а край второй длиннее на шесть метров.', uz: "Ikkalasiga ham teng sig'adi, yigirma kvadrat metrdan, ikkinchisining chekkasi esa olti metr uzunroq.", en: 'Both hold the same, twenty square metres each, and the edge of the second is six metres longer.' },
      on_wrong: { ru: 'Смотри, о чём спрашивают. Место это клетки внутри, край это путь вокруг.', uz: "Nima so'ralayotganiga qarang. Joy bu ichkaridagi kataklar, chekka bu atrofdagi yo'l.", en: 'Watch what is being asked. The room is the squares inside, the edge is the path around.' }
    }
  },

  // s13 — FINAL: uchta topshiriq + FaktCard.
  s13: {
    eyebrow: { ru: 'Финал', uz: 'Yakuniy', en: 'Final' },
    intro_line: { ru: 'Три задания. Сначала пойми, о какой мерке речь', uz: "Uchta topshiriq. Avval qaysi o'lchov haqida ekanini tushuning", en: 'Three tasks. First work out which measure is meant' },
    items: [
      {
        kind: 'num',
        q: { ru: 'Панель 5 на 4 см. Чему равна площадь в см²?', uz: "Panel 5 ga 4 sm. Yuzasi sm² da nechaga teng?", en: 'A panel is 5 by 4 cm. What is the area in sq cm?' },
        q_speech: { ru: 'панель пять на четыре. Чему равна площадь?', uz: "panel besh ga to'rt. Yuzasi nechaga teng?", en: 'a panel five by four. What is the area?' },
        ans: 20,
        hint: { ru: 'Пять умножь на четыре.', uz: "Beshni to'rtga ko'paytiring.", en: 'Multiply five by four.' }
      },
      {
        kind: 'num',
        q: { ru: 'Панель 5 на 4 см. Чему равен периметр в см?', uz: "Panel 5 ga 4 sm. Perimetri sm da nechaga teng?", en: 'A panel is 5 by 4 cm. What is the perimeter in cm?' },
        q_speech: { ru: 'та же панель пять на четыре. Чему равен периметр?', uz: "o'sha panel besh ga to'rt. Perimetri nechaga teng?", en: 'the same panel five by four. What is the perimeter?' },
        ans: 18,
        hint: { ru: 'Сложи пять и четыре, потом удвой.', uz: "Besh va to'rtni qo'shib, keyin ikkilantiring.", en: 'Add five and four, then double it.' }
      },
      {
        kind: 'num',
        q: { ru: 'У панели 1 на 8 площадь 8 см². Какая ещё панель даёт 8 см², если её стороны 2 и ?', uz: "1 ga 8 panelning yuzasi 8 sm². Tomonlari 2 va ? bo'lgan qaysi panel ham 8 sm² beradi?", en: 'A 1 by 8 panel has an area of 8 sq cm. Which other panel gives 8 sq cm if its sides are 2 and ?' },
        q_speech: { ru: 'панель один на восемь даёт восемь квадратных сантиметров. Какая вторая сторона нужна панели с первой стороной два, чтобы вышло столько же?', uz: "bir ga sakkiz panel sakkiz kvadrat santimetr beradi. Birinchi tomoni ikki bo'lgan panelga shuncha chiqishi uchun ikkinchi tomon qanday kerak?", en: 'a panel one by eight gives eight square centimetres. What second side does a panel with a first side of two need to give the same?' },
        ans: 4,
        hint: { ru: 'Какое число, умноженное на два, даёт восемь.', uz: "Qaysi son ikkiga ko'paytirilganda sakkiz beradi.", en: 'Which number multiplied by two gives eight.' }
      }
    ],
    fact_badge: { ru: 'Знаешь ли ты?', uz: 'Bilasizmi?', en: 'Which line is wrong?' },
    fact_text: {
      ru: 'Пчёлы строят соты шестиугольными. При одинаковой площади ячейки у шестиугольника край короче, чем у квадрата или треугольника, а значит на стенки уходит меньше воска. Пчёлы не считают, но природа отобрала самую выгодную форму.',
      uz: "Asalarilar uyachalarni olti burchakli qiladi. Yuzasi bir xil bo'lganda olti burchakning chekkasi kvadrat yoki uchburchaknikidan qisqa, demak devorlarga kamroq mum ketadi. Asalarilar hisoblamaydi, lekin tabiat eng foydali shaklni tanlagan.",
      en: 'Bees build hexagonal honeycombs. For the same cell area a hexagon has a shorter edge than a square or a triangle, which means less wax goes into the walls. Bees do not count, but nature picked the most economical shape.'
    },
    fact_audio: {
      ru: 'Вот что интересно. Пчёлы строят соты шестиугольными, и это не случайность. Если взять ячейки одинаковой площади, то у шестиугольника край получается короче, чем у квадрата или треугольника. А короче край, значит меньше стенок, значит меньше воска. Пчёлы, конечно, ничего не считают. Просто те семьи, что строили выгоднее, тратили меньше сил, и такая форма осталась.',
      uz: "Mana qizig'i. Asalarilar uyachalarni olti burchakli quradi, va bu tasodif emas. Yuzasi bir xil uyachalarni olsak, olti burchakning chekkasi kvadrat yoki uchburchaknikidan qisqa chiqadi. Chekka qisqa bo'lsa, devor kam, demak mum ham kam ketadi. Asalarilar hech nima hisoblamaydi, albatta. Shunchaki foydaliroq qurgan oilalar kam kuch sarflagan va shu shakl qolgan.",
      en: 'Here is something interesting. Bees build hexagonal honeycombs, and that is no accident. If you take cells of the same area, a hexagon comes out with a shorter edge than a square or a triangle. And a shorter edge means fewer walls, which means less wax. Bees of course count nothing. It is simply that the colonies that built more economically spent less effort, and this shape stayed.'
    },
    audio: {
      intro: { ru: 'Три задания напоследок. Каждый раз сначала пойми, о какой мерке спрашивают.', uz: "Oxirida uchta topshiriq. Har safar avval qaysi o'lchov so'ralganini tushuning.", en: 'Three tasks at the end. Each time first work out which measure is being asked about.' },
      on_correct: { ru: 'Верно.', uz: "To'g'ri.", en: 'Correct.' },
      on_wrong: { ru: 'Смотри на мерку в вопросе.', uz: "Savoldagi o'lchovga qarang.", en: 'Look at the measure in the question.' }
    }
  },

  // s14 — YAKUN: keyingisi blok masalalari (reja 42-satr).
  s14: {
    eyebrow: { ru: 'Итог', uz: 'Yakun', en: 'Result' },
    mission_done: { ru: 'Панели сравнены!', uz: 'Panellar solishtirildi!', en: 'The panels are compared!' },
    cando: {
      ru: ['сравниваю по названной величине', 'вижу, что равная площадь не значит равный край', 'не сравниваю см² с см'],
      uz: ["aytilgan kattalik bo'yicha solishtiraman", "teng yuza teng chekka degani emasligini ko'raman", "sm² ni sm bilan solishtirmayman"],
      en: ['I compare by the named quantity', 'I see that equal area does not mean an equal edge', 'I do not compare sq cm with cm']
    },
    rule_recap: { ru: 'Сравнивают всегда по одной величине: площадь с площадью, край с краем.', uz: "Har doim bitta kattalik bo'yicha solishtiriladi: yuza yuza bilan, chekka chekka bilan.", en: 'We always compare by one quantity: area with area, edge with edge.' },
    conn_label_refs: { ru: 'опирается на', uz: 'nimaga tayanadi', en: 'builds on' },
    conn_refs: { ru: 'урок 36: площадь квадрата; урок 31: периметр', uz: "36-dars: kvadrat yuzasi; 31-dars: perimetr", en: 'lesson 36: the area of a square; lesson 31: perimeter' },
    conn_label_next: { ru: 'дальше', uz: 'keyin', en: 'next' },
    conn_next: { ru: 'задачи блока: выбрать величину по вопросу', uz: "blok masalalari: savolga qarab kattalikni tanlash", en: 'word problems of the block: choosing the quantity from the question' },
    audio: {
      ru: 'Панели сравнены. Запомни главное. Слово больше само по себе ничего не значит, пока не названа величина. У двух фигур площадь может совпасть, а край разойтись, и наоборот. Поэтому сначала спрашивай, по какой мерке сравниваем, а уже потом считай. И никогда не сравнивай квадратные сантиметры с обычными. В следующий раз возьмём задачи, где мерку придётся выбирать самому!',
      uz: "Panellar solishtirildi. Asosiysini eslab qoling. Kattaroq degan so'z kattalik aytilmaguncha o'zi hech nima anglatmaydi. Ikki shaklning yuzasi mos tushib, chekkasi ajralib ketishi mumkin, aksincha ham. Shuning uchun avval qaysi o'lchov bo'yicha solishtirayotganingizni so'rang, keyin hisoblang. Kvadrat santimetrni oddiy santimetr bilan esa hech qachon solishtirmang. Keyingi safar o'lchovni o'zingiz tanlaydigan masalalarni olamiz!",
      en: 'The panels are compared. Remember the main thing. The word bigger means nothing on its own until the quantity is named. Two figures can have matching areas and different edges, and the other way round. So first ask by which measure we are comparing, and only then count. And never compare square centimetres with ordinary ones. Next time we will take problems where the measure has to be chosen by yourself!'
    }
  }
};

const BRIDGES = {
  s1:  { ru: 'Посчитаем клетки.', uz: 'Kataklarni sanaymiz.', en: 'Let us count the squares.' },
  s2:  { ru: 'Теперь обойдём по краю.', uz: "Endi chekka bo'ylab aylanamiz.", en: 'Now let us go round the edge.' },
  s3:  { ru: "Соберём это в правило.", uz: "Buni qoidaga yig'amiz.", en: 'Let us gather this into a rule.' },
  s4:  { ru: 'Прочитай чертёж.', uz: "Chizmani o'qing.", en: 'Read the drawing.' },
  s5:  { ru: 'Разложи записи.', uz: 'Yozuvlarni ajrating.', en: 'Sort the lines.' },
  s6:  { ru: 'Быстрый вопрос.', uz: 'Tez savol.', en: 'A quick question.' },
  s7:  { ru: 'Заполни консоль.', uz: "Konsolni to'ldiring.", en: 'Fill the console.' },
  s8:  { ru: 'Тут сравнили не то с тем.', uz: 'Bu yerda noto\'g\'ri narsa solishtirilibdi.', en: 'Here the wrong things were compared.' },
  s9:  { ru: 'А вот и Бит со своим выбором.', uz: "Mana Bit ham o'z tanlovi bilan.", en: 'And here is Bit with his choice.' },
  s10: { ru: 'Теперь считай сам.', uz: "Endi o'zingiz hisoblang.", en: 'Now count on your own.' },
  s11: { ru: 'И вторая панель.', uz: 'Ikkinchi panel ham.', en: 'And the second panel.' },
  s12: { ru: 'Задача от кладовщиков.', uz: 'Omborchilardan masala.', en: 'A task from the storekeepers.' },
  s13: { ru: 'Финальная проверка.', uz: 'Yakuniy tekshiruv.', en: 'The final check.' },
  s14: { ru: 'Подведём итог.', uz: 'Yakun yasaymiz.', en: 'Let us sum up.' }
};

const S14_PAYOFF = {
  ru: 'Панели сравнены. Теперь ясно, что сравнивать нужно по названной мерке.',
  uz: "Panellar solishtirildi. Endi aytilgan o'lchov bo'yicha solishtirish kerakligi ayon.",
  en: 'The panels are compared. Now it is clear that comparing has to be done by the named measure.'
};

// --- ZAL TAXTASI (D37): markazda ikki panel yonma-yon — bittasi cho'ziq, ikkinchisi kvadrat.
// Kataklar teng (16 va 16), chekka esa har xil: shu qarama-qarshilik butun darsning yadrosi.
const TwoPanelNodeLayer = () => {
  const lang = useLang();
  return (
  <svg className="lm-scene-bg" viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <path d="M150 158 h100 l8 18 h-116 Z" fill="#B49A6E"/>
    <rect x={HALL_SLAB.x} y={HALL_SLAB.y} width={HALL_SLAB.w} height={HALL_SLAB.h} rx="5" fill="#E4D3AC" stroke="#8A7550" strokeWidth="2"/>
    <rect x="130" y="99" width="140" height="11" rx="2" fill="#C6AE7E"/>
    <text x="200" y="107.5" textAnchor="middle" fontSize="7" letterSpacing="2" fill="#6B5636" fontFamily="'JetBrains Mono', monospace">{tri(lang, 'ДВЕ ПАНЕЛИ', 'IKKI PANEL', 'TWO PANELS')}</text>
    <g transform="translate(126 122)">
      {Array.from({ length: 2 }).map((_, r) => (
        Array.from({ length: 8 }).map((_, c) => (
          <rect key={`${r}-${c}`} x={c * 7} y={r * 7} width="7" height="7" fill={(r + c) % 2 ? '#DCEBF5' : '#EAF4FA'} stroke="#7FA8BF" strokeWidth="0.6"/>
        ))
      ))}
      <rect x="0" y="0" width="56" height="14" fill="none" stroke="#C06A2E" strokeWidth="2"/>
      <text x="28" y="24" textAnchor="middle" fontSize="6.5" fill="#3F5A6B" fontFamily="'JetBrains Mono', monospace">2 · 8</text>
    </g>
    <g transform="translate(212 116)">
      {Array.from({ length: 4 }).map((_, r) => (
        Array.from({ length: 4 }).map((_, c) => (
          <rect key={`${r}-${c}`} x={c * 7} y={r * 7} width="7" height="7" fill={(r + c) % 2 ? '#DCEBF5' : '#EAF4FA'} stroke="#7FA8BF" strokeWidth="0.6"/>
        ))
      ))}
      <rect x="0" y="0" width="28" height="28" fill="none" stroke="#FFB92E" strokeWidth="2"/>
      <text x="14" y="38" textAnchor="middle" fontSize="6.5" fill="#3F5A6B" fontFamily="'JetBrains Mono', monospace">4 · 4</text>
    </g>
    <text x="256" y="140" textAnchor="middle" fontSize="10" fontWeight="800" fill="#C06A2E" fontFamily="'JetBrains Mono', monospace">16 = 16</text>
    {/* chap artefakt: tarozi — qaysi o'lchov bo'yicha solishtirilyapti */}
    <g transform="translate(88 158)">
      <rect x="-22" y="6" width="44" height="14" rx="3" fill="#B49A6E" stroke="#8A7550" strokeWidth="1"/>
      <line x1="0" y1="6" x2="0" y2="-14" stroke="#8A7550" strokeWidth="2"/>
      <line x1="-18" y1="-14" x2="18" y2="-14" stroke="#8A7550" strokeWidth="2"/>
      <path d="M-18 -14 l-5 8 h10 Z" fill="#DCEBF5" stroke="#7FA8BF" strokeWidth="1"/>
      <path d="M18 -14 l-5 8 h10 Z" fill="#FFD98A" stroke="#C06A2E" strokeWidth="1"/>
      <text x="0" y="-18" textAnchor="middle" fontSize="5" fill="#6B5636" fontFamily="'JetBrains Mono', monospace">{tri(lang, 'МЕРКА', "O'LCHOV", 'THE MEASURE')}</text>
    </g>
    {/* o'ng artefakt: ikki birlik tosh-tabletlarda */}
    {[['sm', 100], ['sm²', 122]].map(([g, y], i) => (
      <g key={i} transform={`translate(304 ${y})`}>
        <rect x="0" y="0" width="30" height="16" rx="3" fill="#E4D3AC" stroke="#8A7550" strokeWidth="1"/>
        <text x="15" y="12" textAnchor="middle" fontSize="9" fontWeight="800" fill="#5A4A2E" fontFamily="'JetBrains Mono', monospace">{g}</text>
      </g>
    ))}
    <circle className="lm-glow" cx="300" cy="92" r="2.4" fill="#BFF0C8"/>
  </svg>
  );
};

const LessonScene = ({ gathered = false }) => {
  const kid = ({ key, El, hook }, i) => (
    <span key={key} className="lm-crew lm-crew-kid g1-pop-in" style={{ animationDelay: `${0.25 + i * 0.12}s` }}>
      <El {...(gathered ? { mood: 'happy', pose: 'happy' } : hook)}/>
    </span>
  );
  return (
    <div className="lm-scene">
      <AncientHallBg fill/>
      <TwoPanelNodeLayer/>
      <div className="lm-scene-cast">
        {LUMO_CAST.slice(0, 2).map(kid)}
        <span className={`lm-crew lm-crew-host ${gathered ? 'd2-bit-cheer' : 'lm-bob'}`}><span className="g1-cast-fig"><BitSVG state={gathered ? 'happy' : 'present'}/></span></span>
        {LUMO_CAST.slice(2).map((c, i) => kid(c, i + 2))}
      </div>
    </div>
  );
};

// --- FACTCARD QAHRAMONI: bir xil yuzali uchta uyacha — uchburchak, kvadrat, olti burchak.
// Chekka uzunligi kamayib boradi, shuning uchun asalarilar oxirgisini tanlagan.
const HoneycombFig = () => (
  <svg viewBox="0 0 220 104" style={{ width: 'min(266px, 84%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <g transform="translate(34 54)">
      <path d="M0 -26 L23 14 L-23 14 Z" fill="#F7F1E4" stroke="#C06A2E" strokeWidth="2.4" strokeLinejoin="round"/>
      <text x="0" y="34" textAnchor="middle" fontSize="9" fontWeight="800" fill="#8A7550" fontFamily="'JetBrains Mono', monospace">3</text>
    </g>
    <g transform="translate(110 54)">
      <rect x="-19" y="-19" width="38" height="38" fill="#FDF3E0" stroke="#C06A2E" strokeWidth="2.4"/>
      <text x="0" y="34" textAnchor="middle" fontSize="9" fontWeight="800" fill="#8A7550" fontFamily="'JetBrains Mono', monospace">4</text>
    </g>
    <g transform="translate(186 54)">
      <path d="M11 -19 L22 0 L11 19 L-11 19 L-22 0 L-11 -19 Z" fill="#FFE6A6" stroke="#C06A2E" strokeWidth="2.4" strokeLinejoin="round"/>
      <text x="0" y="34" textAnchor="middle" fontSize="9" fontWeight="800" fill="#C06A2E" fontFamily="'JetBrains Mono', monospace">6</text>
    </g>
    <text x="110" y="14" textAnchor="middle" fontSize="8" letterSpacing="1.2" fill="#8A7550" fontFamily="'JetBrains Mono', monospace">S</text>
    <path d="M62 54 h14 m-4 -4 l4 4 l-4 4" fill="none" stroke="#8A7550" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M140 54 h14 m-4 -4 l4 4 l-4 4" fill="none" stroke="#8A7550" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default createLesson({
  TOTAL_SCREENS, LESSON_META, SCREEN_META, CONTENT, BRIDGES, S14_PAYOFF,
  STYLES: LESSON_STYLES,
  Scene: LessonScene,
  FactFig: HoneycombFig
});
