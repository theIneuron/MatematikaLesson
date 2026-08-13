import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { GridFig, LumoCityBg, BackLabel, BitSVG, CheckStrip, Chiroq, Confetti, D2Defs, D2Motes, FREE_NAV, FeedbackBlock, FoldRow, FrameFx, GradientDefs, HeroContext, LUMO_CAST, LangContext, Lenta, NavBack, NavNext, NextLabel, Panel, ProgressContext, Reaction, ReadinessMeter, Stage, StageHero, T, TaskTable, configureLesson, getAudioEngine, nextPraise, npKey, shuffleArr, ttsConfig, useAdvanceGate, useAudio, useCanAnswer, useLang, useMobileZoom, usePrefersReducedMotion, useRevealScroll, useSfx, useT, useTapSteps, makeBrgSeg, gridCols , pickSib , tri } from './_kit/index.jsx';
import { BASE_STYLES } from './_kit/styles.js';

// ============================================================================
// DD 3-SINF | Dars34 — "Yuza birliklari" (num-3-34) | Б5 «KRISTALL ARXITEKTURA»
// Syujet: kristall kvartal davom etadi (SYUJET_3SINF.md 193-satr, reja 38-satr).
// SAHNA: blok foni O'ZGARMAYDI — 1-DARSNING Lumo shahri, kitdagi `LumoCityBg`. Darsning
//   o'z qatlami BOSHQA: panel kataklarga bo'lingan, bir katak yoritilgan — o'lchov birligi.
// FIGURALAR: kitning geometriya to'plamidan (`GridFig`), yuza rejimida.
// DARSLIK ASOSI (Burxonov, 3-sinf, «Sharq» 2019, 161-bet): yuza — ichkariga sig'gan
//   kataklar soni; tomoni 1 sm bo'lgan katak 1 sm², tomoni 1 dm bo'lgani 1 dm².
// YADRO: 4 ga 3 panel. Kataklar bittalab sanaladi, keyin birlik nomlanadi: 12 sm².
// Misconception: M1 yuzani oddiy santimetrda yozish; M2 yuza o'rniga perimetrni sanash;
//   M3 faqat bo'yalgan kataklarni sanash; M4 dm² va sm² ni chalkashtirish.
// FactCard: 1 dm² ichiga roppa-rosa 100 sm² sig'adi — o'ntadan o'n qator.
// Kontent: src/books/grade3/KONTENT_3SINF.md, «Dars 34». Karkas: BLOK_B5_KARKAS.md.
//
// FREE_NAV kitdan keladi (hozircha true).
// ============================================================================
// AI-проверка открытых ответов — единственный разрешённый fetch (кроме <audio>.src).
// Возвращает { correct, feedback, transcript? } или бросает.
async function gradeAnswer({ screenIdx, question, rubric, lang, mode, answerText, audioBlob }) {
  const endpoint = ttsConfig.aiGradingEndpoint;
  if (!endpoint) throw new Error('No grading endpoint configured');
  const lessonId = (typeof LESSON_META !== 'undefined' && LESSON_META.lessonId) || '';
  let res;
  if (mode === 'voice') {
    const fd = new FormData();
    fd.append('lessonId', lessonId); fd.append('screenIdx', String(screenIdx));
    fd.append('question', question || ''); fd.append('rubric', rubric || '');
    fd.append('lang', lang); fd.append('mode', 'voice');
    if (audioBlob) fd.append('audio', audioBlob, 'answer.webm');
    res = await fetch(endpoint, { method: 'POST', body: fd });
  } else {
    res = await fetch(endpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId, screenIdx, question: question || '', rubric: rubric || '', lang, mode: 'text', answerText: answerText || '' }),
    });
  }
  if (!res.ok) throw new Error(`Grading failed: ${res.status}`);
  const data = await res.json();
  if (typeof data.correct !== 'boolean' || typeof data.feedback !== 'string') throw new Error('Malformed grading response');
  return data;
}

























































// ============================================================
// --- 2-SINF DARS: num_2_01 — O'nliklar va birliklar (Б1, 100 gacha) ---
// 7-8 yosh: ovoz yetakchi kanal, typing YO'Q (tap), concrete-avval (batareya/kasseta ->
// pult-bloklar -> displey kartasi), bar model YO'Q. Manba: 2sinf_metodologiya.md +
// ETALON_2SINF.md + Dars01_CONTENT.md v2 (Yulduz porti). Barcha sonlar 100 ichida (Б1).
// ============================================================

// v5 IXCHAMLASH (18 -> 15): test tomoni ixchamlashdi (tushuntirish s2-s6 + qoida s7 TEGILMADI).
//   sPANEL «Bort testi» = eski s11 + sCMP + sERR (3 ketma-ket sub).
//   sCASE «Yuk xati» = eski s12 (kirish) + s13 (savol) BITTA ekranда.
// v6 FAKT ALOHIDA (bekor): sPANEL sub-1 dagi FactCard SKROLL chiqargani uchun undan olindi.
// v7 FAKT FINAL SLAYDGA (16 -> 15): alohida fakt-slaydi BEKOR; fakt endi FINAL test s14 ga
//   factOnCorrect bilan (bitta savolli slaydда joy bor, skrollsiz — etalon naqsh). sPANEL faktsiz qoladi.



const TOTAL_SCREENS = 15;
const LESSON_META = {
  lessonId: 'grade3-34',
  lessonTitle: { ru: 'Урок 34. Единицы площади', uz: "34-dars. Yuza birliklari", en: 'Lesson 34. Units of area' }
};
// STRUKTURA (KONTENT_3SINF.md «Dars 34»): s0 xuk 4 ga 3 panel · s1 kataklarni sanash va
// birlikni nomlash · s2 model, kataklar to'ldiriladi · s3 savol-oldin-QOIDA · s4 rasm
// bo'yicha 5 ga 4 · s5 saralash sm yoki sm² · s6 test dm² · s7 konsol yuza va perimetr ·
// s8 xatoni top (perimetr yuza deb yozilgan) · s9 Bit tuzog'i (kvadrat birlik ortiqcha) ·
// s10 trenajyor 7 ga 3 · s11 trenajyor 9 ga 2 · s12 masala (8 · 3, keyin 30 − 24) ·
// s13 final 3 topshiriq + FactCard · s14 yakun.
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
  { id: 's12', type: 'case',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's13', type: 'test',        template: 'custom',   scored: true,  scope: 'final' },
  { id: 's14', type: 'summary',     template: 'custom',   scored: false, scope: 'final' }
];
// ============================================================
// CONTENT — 3-sinf Dars13 «Amallar tartibi» (num-3-13). RU + UZ to'liq.
// Manba: src/books/grade3/KONTENT_3SINF.md, «Dars 13» bo'limi (tasdiq 2026-08-05).
// Syujet: «Yorug' bog'» davomi — bog' kirishidagi BUYURTMA TAXTASI: 3 + 6 × 2.
// YADRO: qoida bo'yicha 15, chapdan o'ngga esa 18; 18 — QAVSLI yozuvning javobi.
// M1: chapdan o'ngga hisoblash. M2: qavsni e'tiborsiz qoldirish. M3: bitta amalda
// to'xtash. M4: «tartib ahamiyatsiz».
// BONUS s9: USTUN — ifoda ichida ko'paytirish, keyin qo'shish va ayirish ustunda.
// ============================================================
const CONTENT = {
  // s0 — XUK: ichkaridagi kataklar (darslik 161-bet).
  s0: {
    eyebrow: { ru: 'Крючок', uz: 'Qiziqtirish', en: 'Hook' },
    topic: { ru: 'Единицы площади', uz: 'Yuza birliklari', en: 'Units of area' },
    lead: { ru: 'Панель разбита на клетки со стороной 1 см: 4 в ряд и 3 ряда', uz: "Panel tomoni 1 sm bo'lgan kataklarga bo'lingan: qatorda 4 ta, qator 3 ta", en: 'A panel is divided into squares with a side of 1 cm: 4 in a row and 3 rows' },
    order_cap: { ru: 'теперь считаем не край, а то, что внутри', uz: "endi chekkani emas, ichkaridagini sanaymiz", en: 'now we count not the edge but what is inside' },
    q: { ru: 'Сколько места занимает панель?', uz: 'Panel qancha joy egallaydi?', en: 'How much space does the panel take up?' },
    opt0: { ru: '12 см²', uz: '12 sm²', en: '12 sq cm' },
    opt1: { ru: '14 см²', uz: '14 sm²', en: '14 sq cm' },
    opt2: { ru: '7 см²', uz: '7 sm²', en: '7 sq cm' },
    opt3: { ru: '4 см²', uz: '4 sm²', en: '4 sq cm' },
    audio: {
      intro: {
        ru: [
          'В прошлый раз мы обошли панель по краю. Сегодня заглянем внутрь.',
          'Панель разбита на клетки. Сторона каждой клетки один сантиметр.',
          'В ряду четыре клетки, а рядов три.',
          'Как думаешь, сколько места занимает панель?'
        ],
        uz: [
          "O'tgan safar panelni chekka bo'ylab aylandik. Bugun ichkariga qaraymiz.",
          "Panel kataklarga bo'lingan. Har bir katakning tomoni bir santimetr.",
          "Qatorda to'rtta katak, qator esa uchta.",
          "Sizningcha, panel qancha joy egallaydi?"
        ],
        en: ['Last time we went round the panel along the edge. Today we will look inside.', 'The panel is divided into squares. The side of each square is one centimetre.', 'A row has four squares, and there are three rows.', 'How much space do you think the panel takes up?']
      },
      on_correct: { ru: 'Верно! А сейчас узнаешь, почему единица называется квадратной.', uz: "To'g'ri! Endi birlik nega kvadrat deb atalishini bilasiz.", en: 'Right! And now you will find out why the unit is called square.' },
      on_wrong1: { ru: 'Четырнадцать это путь по краю. Мы считаем клетки внутри.', uz: "O'n to'rt bu chekka yo'li. Biz ichkaridagi kataklarni sanaymiz.", en: 'Fourteen is the path along the edge. We are counting the squares inside.' },
      on_wrong2: { ru: 'Семь это длина и ширина вместе. А клеток больше.', uz: "Yetti bu uzunlik va en birga. Kataklar esa ko'proq.", en: 'Seven is the length and the width together. And there are more squares.' },
      on_idk: { ru: 'Ничего. Сейчас посчитаем клетки по одной.', uz: "Hechqisi yo'q. Hozir kataklarni bittalab sanaymiz.", en: 'Never mind. Let us count the squares one by one.' }
    }
  },

  // s1 — KATAKLARNI SANASH: bittalab, keyin birlik nomlanadi (darslik 161-bet).
  s1: {
    eyebrow: { ru: 'Разбор', uz: 'Tahlil', en: 'Working it out' },
    lead: { ru: 'Площадь считают клетками, а клетка сама квадрат', uz: "Yuza kataklab sanaladi, katakning o'zi esa kvadrat", en: 'Area is counted in squares, and a square is itself a square' },
    task_line: 'панель 4 клетки на 3',
    task_line_uz: "panel 4 katakka 3 katak",
    task_line_en: 'panel 4 squares by 3',
    step1: { ru: '12 клеток', uz: '12 katak', en: '12 squares' },
    step1_cap: { ru: 'посчитали все клетки внутри', uz: "ichkaridagi hamma katak sanaldi", en: 'we counted all the squares inside' },
    step2: { ru: '12 см²', uz: '12 sm²', en: '12 sq cm' },
    step2_cap: { ru: 'сторона клетки 1 см, значит клетка это 1 см²', uz: "katak tomoni 1 sm, demak katak 1 sm²", en: 'the side of a square is 1 cm, so the square is 1 sq cm' },
    res: { ru: 'площадь мерят квадратными единицами', uz: "yuza kvadrat birliklarda o'lchanadi", en: 'area is measured in square units' },
    btn1: { ru: 'Посчитать клетки', uz: 'Kataklarni sanash', en: 'Count the squares' },
    btn2: { ru: 'Назвать единицу', uz: 'Birlikni nomlash', en: 'Name the unit' },
    done_text: { ru: 'Мерка это квадрат со стороной в один сантиметр', uz: "O'lchov bu tomoni bir santimetrli kvadrat", en: 'The measure is a square with a side of one centimetre' },
    audio: {
      ru: [
        'Заглянем внутрь панели.',
        'Считаем клетки по одной. В первом ряду четыре, во втором четыре, в третьем четыре. Всего двенадцать клеток.',
        'Сторона каждой клетки один сантиметр, поэтому сама клетка это один квадратный сантиметр. Значит площадь панели двенадцать квадратных сантиметров.'
      ],
      uz: [
        "Panel ichkarisiga qaraymiz.",
        "Kataklarni bittalab sanaymiz. Birinchi qatorda to'rtta, ikkinchisida to'rtta, uchinchisida to'rtta. Jami o'n ikkita katak.",
        "Har bir katakning tomoni bir santimetr, shuning uchun katakning o'zi bir kvadrat santimetr. Demak panelning yuzasi o'n ikki kvadrat santimetr."
      ],
      en: ['Let us look inside the panel.', 'We count the squares one by one. Four in the first row, four in the second, four in the third. Twelve squares in all.', 'The side of each square is one centimetre, so the square itself is one square centimetre. So the area of the panel is twelve square centimetres.']
    }
  },

  // s2 — MODEL: kataklar birin-ketin bo'yaladi.
  s2: {
    eyebrow: { ru: 'Модель', uz: 'Model', en: 'The model' },
    w: 4,
    h: 3,
    lead: { ru: 'Заполним панель клетками и посчитаем', uz: "Panelni kataklar bilan to'ldirib sanaymiz", en: 'Let us fill the panel with squares and count them' },
    capA: { ru: 'первый ряд, 4 клетки', uz: "birinchi qator, 4 katak", en: 'the first row, 4 squares' },
    capB: { ru: 'все ряды, 12 клеток', uz: "hamma qator, 12 katak", en: 'all the rows, 12 squares' },
    res: { ru: 'S = 12 см²', uz: 'S = 12 sm²', en: 'S = 12 sq cm' },
    name_a: { ru: 'ряд', uz: 'qator', en: 'row' },
    name_b: { ru: 'площадь', uz: 'yuza', en: 'area' },
    btn1: { ru: 'Заполнить ряд', uz: "Qatorni to'ldirish", en: 'Fill a row' },
    btn2: { ru: 'Заполнить всё', uz: "Hammasini to'ldirish", en: 'Fill it all' },
    done_text: { ru: 'Двенадцать квадратных сантиметров', uz: "O'n ikki kvadrat santimetr", en: 'Twelve square centimetres' },
    audio: {
      ru: [
        'Посмотри на пустую панель из клеток.',
        'Заполняем первый ряд. В нём четыре клетки.',
        'Теперь остальные ряды. Всего двенадцать клеток, и площадь панели двенадцать квадратных сантиметров.'
      ],
      uz: [
        "Kataklardan iborat bo'sh panelga qarang.",
        "Birinchi qatorni to'ldiramiz. Unda to'rtta katak bor.",
        "Endi qolgan qatorlarni. Jami o'n ikkita katak, panel yuzasi o'n ikki kvadrat santimetr."
      ],
      en: ['Look at the empty panel of squares.', 'We fill the first row. It has four squares.', 'Now the other rows. Twelve squares in all, and the area of the panel is twelve square centimetres.']
    }
  },

  // s3 — SAVOL-OLDIN-QOIDA: yuza nimani ko'rsatadi.
  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    q: { ru: 'Что показывает площадь фигуры?', uz: "Shaklning yuzasi nimani ko'rsatadi?", en: 'What does the area of a figure show?' },
    opts: [
      { ru: 'сколько клеток помещается внутри', uz: "ichkariga nechta katak sig'ishini", en: 'how many squares fit inside' },
      { ru: 'длину пути по краю', uz: "chekka bo'ylab yo'l uzunligini", en: 'the length of the path along the edge' },
      { ru: 'длину самой длинной стороны', uz: 'eng uzun tomon uzunligini', en: 'the length of the longest side' },
      { ru: 'сколько у фигуры сторон', uz: 'shaklning nechta tomoni borligini', en: 'how many sides the figure has' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Путь по краю это периметр, он был в прошлом уроке.', uz: "Chekka yo'li bu perimetr, u o'tgan darsda edi.", en: 'The path along the edge is the perimeter, that was in the last lesson.' },
      2: { ru: 'Одна сторона про площадь ничего не говорит.', uz: "Bitta tomon yuza haqida hech nima aytmaydi.", en: 'One side says nothing about the area.' },
      3: { ru: 'Число сторон у прямоугольника всегда четыре, а площади разные.', uz: "To'rtburchakda tomon doim to'rtta, yuzalar esa har xil.", en: 'A rectangle always has four sides, and the areas are different.' }
    },
    on_correct: { ru: 'Да. Площадь это место внутри, и мерят его клетками.', uz: "Ha. Yuza bu ichkaridagi joy, u kataklab o'lchanadi.", en: 'Yes. Area is the space inside, and it is measured in squares.' },
    rule_lines: {
      ru: ['Площадь показывает, сколько клеток помещается внутри фигуры.', 'Мерка это квадрат. Квадрат со стороной 1 см даёт 1 см², со стороной 1 дм даёт 1 дм².'],
      uz: ["Yuza shakl ichiga nechta katak sig'ishini ko'rsatadi.", "O'lchov bu kvadrat. Tomoni 1 sm bo'lgan kvadrat 1 sm², tomoni 1 dm bo'lgani 1 dm² beradi."],
      en: ['Area shows how many squares fit inside a figure.', 'The measure is a square. A square with a side of 1 cm gives 1 sq cm, with a side of 1 dm it gives 1 sq dm.']
    },
    rule_ex: { ru: 'S = 12 см²', uz: 'S = 12 sm²', en: 'S = 12 sq cm' },
    rule_speech: { ru: 'площадь двенадцать квадратных сантиметров', uz: "yuza o'n ikki kvadrat santimetr", en: 'the area is twelve square centimetres' },
    audio: {
      intro: {
        ru: 'Назовём величину точно. Что показывает площадь фигуры?',
        uz: "Kattalikni aniq nomlaymiz. Shaklning yuzasi nimani ko'rsatadi?",
        en: 'Let us name the quantity exactly. What does the area of a figure show?'
      }
    }
  },

  // s4 — RASM BO'YICHA: 5 ga 4 panel yuzasi.
  s4: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv', en: 'Checking' },
    q: { ru: 'Чему равна площадь этой панели?', uz: 'Bu panelning yuzasi nechaga teng?', en: 'What is the area of this panel?' },
    fig_w: 5,
    fig_h: 4,
    opts: [
      { ru: '20 см²', uz: '20 sm²', en: '20 sq cm' },
      { ru: '18 см²', uz: '18 sm²', en: '18 sq cm' },
      { ru: '9 см²', uz: '9 sm²', en: '9 sq cm' },
      { ru: '20 см', uz: '20 sm', en: '20 cm' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Восемнадцать это путь по краю, а не клетки.', uz: "O'n sakkiz bu chekka yo'li, kataklar emas.", en: 'Eighteen is the path along the edge, not the squares.' },
      2: { ru: 'Девять это длина и ширина вместе.', uz: "To'qqiz bu uzunlik va en birga.", en: 'Nine is the length and the width together.' },
      3: { ru: 'Число верное, а единица не та. Площадь мерят квадратными.', uz: "Son to'g'ri, birlik esa boshqa. Yuza kvadrat birlikda o'lchanadi.", en: 'The number is right and the unit is wrong. Area is measured in square units.' }
    },
    audio: {
      intro: { ru: 'В ряду пять клеток, рядов четыре. Чему равна площадь панели?', uz: "Qatorda beshta katak, qator to'rtta. Panel yuzasi nechaga teng?", en: 'A row has five squares and there are four rows. What is the area of the panel?' },
      on_correct: { ru: 'Верно. Двадцать клеток, значит двадцать квадратных сантиметров.', uz: "To'g'ri. Yigirmata katak, demak yigirma kvadrat santimetr.", en: 'Right. Twenty squares, so twenty square centimetres.' },
      on_wrong: { ru: 'Считай клетки внутри и не забудь квадратную единицу.', uz: "Ichkaridagi kataklarni sanang va kvadrat birlikni unutmang.", en: 'Count the squares inside and do not forget the square unit.' }
    }
  },

  // s5 — SARALASH: santimetr yoki kvadrat santimetr.
  s5: {
    eyebrow: { ru: 'Сортировка', uz: 'Saralash', en: 'Sorting' },
    lead: { ru: 'Что мерят в см, а что в см²', uz: "Nima sm da, nima sm² da o'lchanadi", en: 'What is measured in cm and what in sq cm' },
    bin_a: { ru: 'в см', uz: 'sm da', en: 'in cm' },
    bin_b: { ru: 'в см²', uz: 'sm² da', en: 'in sq cm' },
    items: [
      { n: { ru: 'длина ленты', uz: 'tasma uzunligi', en: 'the length of a strip' }, a: true, hint: { ru: 'Лента это длина, у неё нет ширины.', uz: "Tasma bu uzunlik, uning eni yo'q.", en: 'A strip is a length, it has no width.' } },
      { n: { ru: 'место на панели', uz: 'paneldagi joy', en: 'the space on a panel' }, a: false, hint: { ru: 'Место внутри мерят клетками.', uz: "Ichkaridagi joy kataklab o'lchanadi.", en: 'The space inside is measured in squares.' } },
      { n: { ru: 'периметр', uz: 'perimetr', en: 'the perimeter' }, a: true, hint: { ru: 'Периметр это путь, а путь измеряют в сантиметрах.', uz: "Perimetr bu yo'l, yo'l esa santimetrda o'lchanadi.", en: 'The perimeter is a path, and a path is measured in centimetres.' } },
      { n: { ru: 'сколько плитки', uz: 'nechta plitka', en: 'how much tiling' }, a: false, hint: { ru: 'Плитка закрывает место внутри.', uz: "Plitka ichkaridagi joyni yopadi.", en: 'Tiling covers the space inside.' } }
    ],
    audio: {
      intro: { ru: 'Четыре величины. Отправь каждую на свою полку по единице.', uz: "To'rtta kattalik. Har birini birligiga qarab o'z tokchasiga yuboring.", en: 'Four quantities. Send each one to its shelf by the unit.' },
      on_correct: { ru: 'Все на месте. Длина в сантиметрах, место в квадратных.', uz: "Hammasi joyida. Uzunlik santimetrda, joy kvadrat santimetrda.", en: 'All in place. Length in centimetres, space in square ones.' },
      on_wrong: { ru: 'Спроси себя, это путь или это место внутри.', uz: "O'zingizdan so'rang, bu yo'lmi yoki ichkaridagi joymi.", en: 'Ask yourself whether this is a path or the space inside.' }
    }
  },

  // s6 — TEST: dm² birligi.
  s6: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv', en: 'Checking' },
    q: { ru: 'Клетка со стороной 1 дм. Как называется её площадь?', uz: "Tomoni 1 dm bo'lgan katak. Uning yuzasi qanday ataladi?", en: 'A square has a side of 1 dm. What is its area called?' },
    opts: [
      { ru: '1 дм²', uz: '1 dm²', en: '1 sq dm' },
      { ru: '1 дм', uz: '1 dm', en: '1 dm' },
      { ru: '10 см', uz: '10 sm', en: '10 cm' },
      { ru: '1 см²', uz: '1 sm²', en: '1 sq cm' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Один дециметр это длина стороны, а не площадь.', uz: "Bir detsimetr bu tomon uzunligi, yuza emas.", en: 'One decimetre is the length of the side, not the area.' },
      2: { ru: 'Десять сантиметров это тоже длина.', uz: "O'n santimetr ham uzunlik.", en: 'Ten centimetres is a length too.' },
      3: { ru: 'Сторона у клетки дециметр, а не сантиметр.', uz: "Katakning tomoni detsimetr, santimetr emas.", en: 'The square has a side of a decimetre, not a centimetre.' }
    },
    audio: {
      intro: { ru: 'Быстрый вопрос. У клетки сторона один дециметр. Как называется её площадь?', uz: "Tez savol. Katakning tomoni bir detsimetr. Uning yuzasi qanday ataladi?", en: 'A quick question. A square has a side of one decimetre. What is its area called?' },
      on_correct: { ru: 'Верно. Один квадратный дециметр.', uz: "To'g'ri. Bir kvadrat detsimetr.", en: 'Right. One square decimetre.' },
      on_wrong: { ru: 'Единица площади всегда квадратная, по стороне мерки.', uz: "Yuza birligi har doim kvadrat, o'lchov tomoni bo'yicha.", en: 'A unit of area is always square, by the side of the measure.' }
    }
  },

  // s7 — KONSOL: yuza va perimetr bitta shaklda.
  s7: {
    eyebrow: { ru: 'Консоль', uz: 'Konsol', en: 'Console' },
    lead: { ru: 'Посчитай обе величины у панели 6 на 4', uz: "6 ga 4 panelning ikkala kattaligini hisoblang", en: 'Work out both quantities for a 6 by 4 panel' },
    swap_line: { ru: 'панель 6 и 4', uz: 'panel 6 va 4', en: 'panel 6 and 4' },
    cells: [
      { head: { ru: 'клеток', uz: 'katak', en: 'squares' }, label: { ru: 'внутри', uz: 'ichida', en: 'inside' }, ans: 24, hint: { ru: 'Шесть в ряду, рядов четыре.', uz: "Qatorda oltita, qator to'rtta.", en: 'Six in a row, four rows.' } },
      { head: { ru: 'по краю', uz: 'chekkadan', en: 'along the edge' }, label: { ru: 'периметр', uz: 'perimetr', en: 'the perimeter' }, ans: 20, hint: { ru: 'Сложи все четыре стороны.', uz: "To'rtala tomonni qo'shing.", en: 'Add all four sides.' } },
      { head: { ru: 'разница', uz: 'farq', en: 'difference' }, label: '24 − 20', ans: 4, hint: { ru: 'Убери периметр из числа клеток.', uz: "Kataklar sonidan perimetrni olib tashlang.", en: 'Take the perimeter away from the number of squares.' } }
    ],
    check: { ru: 'S = 24 см², P = 20 см', uz: 'S = 24 sm², P = 20 sm', en: 'S = 24 sq cm, P = 20 cm' },
    check_label: { ru: 'две величины у одной панели', uz: 'bitta panelning ikki kattaligi', en: 'two quantities of one panel' },
    audio: {
      intro: { ru: 'Заполни три окна. Клетки внутри, путь по краю и разница между числами.', uz: "Uchta oynani to'ldiring. Ichkaridagi kataklar, chekka yo'li va sonlar orasidagi farq.", en: 'Fill three windows. The squares inside, the path along the edge and the difference between the numbers.' },
      on_correct: { ru: 'Числа разные и единицы разные. Площадь в квадратных сантиметрах, периметр просто в сантиметрах.', uz: "Sonlar ham, birliklar ham har xil. Yuza kvadrat santimetrda, perimetr oddiy santimetrda.", en: 'The numbers are different and the units are different. Area in square centimetres, perimeter simply in centimetres.' }
    }
  },

  // s8 — XATONI TOP: perimetr yuza deb yozilgan (M2).
  s8: {
    eyebrow: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    q: { ru: 'Для панели 5 на 3 записали площадь 16 см². В чём ошибка?', uz: "5 ga 3 panel uchun yuza 16 sm² deb yozilgan. Xato nimada?", en: 'For a 5 by 3 panel the area was written as 16 sq cm. What is the mistake?' },
    fig_line: { ru: 'S = 16 см²', uz: 'S = 16 sm²', en: 'S = 16 sq cm' },
    opts: [
      { ru: 'посчитали путь по краю, а не клетки', uz: "kataklar emas, chekka yo'li sanalgan", en: 'they counted the path along the edge, not the squares' },
      { ru: 'сложили неверно', uz: "noto'g'ri qo'shilgan", en: 'the adding was wrong' },
      { ru: 'единица должна быть в сантиметрах', uz: 'birlik santimetrda bo\'lishi kerak', en: 'the unit should be in centimetres' },
      { ru: 'ошибки нет', uz: "xato yo'q", en: 'there is no mistake' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Пять и три и пять и три это шестнадцать, счёт верный. Считали не ту величину.', uz: "Besh va uch va besh va uch bu o'n olti, hisob to'g'ri. Boshqa kattalik sanalgan.", en: 'Five and three and five and three is sixteen, the counting is right. The wrong quantity was counted.' },
      2: { ru: 'Единицу назвали правильно, ошибка в самом числе.', uz: "Birlik to'g'ri aytilgan, xato sonning o'zida.", en: 'The unit was named correctly, the mistake is in the number itself.' },
      3: { ru: 'Ошибка есть. Клеток внутри пятнадцать, а не шестнадцать.', uz: "Xato bor. Ichkarida o'n beshta katak, o'n oltita emas.", en: 'There is a mistake. There are fifteen squares inside, not sixteen.' }
    },
    audio: {
      intro: { ru: 'Здесь величину назвали площадью, а посчитали периметр. Найди ошибку.', uz: "Bu yerda kattalik yuza deb atalgan, sanalgani esa perimetr. Xatoni toping.", en: 'Here the quantity was called the area and the perimeter was counted. Find the mistake.' },
      on_correct: { ru: 'Точно. Клеток внутри пятнадцать, значит площадь пятнадцать квадратных сантиметров.', uz: "Aniq. Ichkarida o'n beshta katak, demak yuza o'n besh kvadrat santimetr.", en: 'Exactly. There are fifteen squares inside, so the area is fifteen square centimetres.' },
      on_wrong: { ru: 'Посчитай клетки внутри и сравни с записью.', uz: "Ichkaridagi kataklarni sanab, yozuv bilan solishtiring.", en: 'Count the squares inside and compare with the line.' }
    }
  },

  // s9 — BIT TUZOG'I: yuzani oddiy santimetrda o'lchash (M1).
  s9: {
    eyebrow: { ru: 'Ловушка Бита', uz: 'Bit tuzog\'i', en: "Bit's trap" },
    lead: { ru: 'Бит записывает результат измерения', uz: "Bit o'lchov natijasini yozadi", en: 'Bit writes down the result of the measuring' },
    lines: ['клеток внутри 12', 'Бит пишет: S = 12 см'],
    lines_uz: ["ichkarida 12 katak", "Bit yozadi: S = 12 sm"],
    lines_en: ['12 squares inside', 'Bit writes: S = 12 cm'],
    line_cap: { ru: 'Бит: сантиметр он и есть сантиметр, квадрат тут лишний', uz: "Bit: santimetr baribir santimetr, kvadrat ortiqcha", en: 'Bit: a centimetre is a centimetre, the square here is unnecessary' },
    trap_label: { ru: 'Так ли это?', uz: 'Shundaymi?', en: 'Is that so?' },
    trap_opts: { ru: ['нет, мерка сама квадрат', 'да, квадрат лишний'], uz: ["yo'q, o'lchovning o'zi kvadrat", 'ha, kvadrat ortiqcha'], en: ['no, the measure is itself a square', 'yes, the square is unnecessary'] },
    trap_ci: 0,
    trap_correct: { ru: 'Да. Мы считали не отрезки, а квадратики со стороной один сантиметр. Поэтому и единица квадратная.', uz: "Ha. Biz kesmalarni emas, tomoni bir santimetr bo'lgan kvadratchalarni sanadik. Shuning uchun birlik ham kvadrat.", en: 'Yes. We counted not segments but little squares with a side of one centimetre. That is why the unit is square too.' },
    trap_wrong: { ru: 'В сантиметрах меряют длину, а мы считали клетки. Клетка это квадрат, и единица тоже квадратная.', uz: "Santimetrda uzunlik o'lchanadi, biz esa kataklarni sanadik. Katak bu kvadrat, birlik ham kvadrat.", en: 'Centimetres measure length, and we counted squares. A square is a square, and the unit is square too.' },
    audio: {
      ru: [
        'Бит посчитал клетки и записывает ответ.',
        'Клеток двенадцать. Пишу так. Площадь двенадцать сантиметров. Сантиметр он и есть сантиметр, квадрат тут лишний.',
        'Так ли это?'
      ],
      uz: [
        "Bit kataklarni sanab, javobni yozadi.",
        "Katak o'n ikkita. Mana yozdim. Yuza o'n ikki santimetr. Santimetr baribir santimetr, kvadrat ortiqcha.",
        "Shundaymi?"
      ],
      en: ['Bit counted the squares and is writing down the answer.', 'There are twelve squares. I write it like this. The area is twelve centimetres. A centimetre is a centimetre, the square here is unnecessary.', 'Is that so?']
    }
  },

  // s10 — TRENAJYOR: kataklarni sanash.
  s10: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq', en: 'Trainer' },
    q: { ru: 'В ряду 7 клеток, рядов 3. Сколько квадратных сантиметров?', uz: "Qatorda 7 katak, qator 3 ta. Necha kvadrat santimetr?", en: 'A row has 7 squares and there are 3 rows. How many square centimetres?' },
    ans: 21,
    check: { ru: 'S = 21 см²', uz: 'S = 21 sm²', en: 'S = 21 sq cm' },
    check_label: { ru: 'три ряда по семь', uz: 'yettitadan uch qator', en: 'three rows of seven' },
    hint: { ru: 'Посчитай клетки рядами.', uz: "Kataklarni qatorlab sanang.", en: 'Count the squares by rows.' },
    audio: {
      intro: { ru: 'В ряду семь клеток, рядов три. Сколько квадратных сантиметров?', uz: "Qatorda yettita katak, qator uchta. Necha kvadrat santimetr?", en: 'A row has seven squares and there are three rows. How many square centimetres?' },
      on_correct: { ru: 'Двадцать один квадратный сантиметр.', uz: "Yigirma bir kvadrat santimetr.", en: 'Twenty one square centimetres.' }
    }
  },

  // s11 — TRENAJYOR NumPad: ikki qator.
  s11: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq', en: 'Trainer' },
    q: { ru: 'Панель 9 клеток в ряд и 2 ряда. Чему равна площадь?', uz: "Panelda qatorda 9 katak, qator 2 ta. Yuzasi nechaga teng?", en: 'A panel is 9 squares in a row and 2 rows. What is the area?' },
    ans: 18,
    check: { ru: 'S = 18 см²', uz: 'S = 18 sm²', en: 'S = 18 sq cm' },
    check_label: { ru: 'два ряда по девять', uz: "to'qqiztadan ikki qator", en: 'two rows of nine' },
    hint: { ru: 'Девять клеток дважды.', uz: "To'qqizta katak ikki marta.", en: 'Nine squares twice.' },
    audio: {
      intro: { ru: 'Панель девять клеток в ряд и два ряда. Чему равна площадь?', uz: "Panelda qatorda to'qqizta katak, qator ikkita. Yuzasi nechaga teng?", en: 'A panel is nine squares in a row and two rows. What is the area?' },
      on_correct: { ru: 'Восемнадцать квадратных сантиметров.', uz: "O'n sakkiz kvadrat santimetr.", en: 'Eighteen square centimetres.' }
    }
  },

  // s12 — MASALA: jadval bilan, ikki qadam.
  s12: {
    eyebrow: { ru: 'Задача', uz: 'Masala', en: 'Word problem' },
    lead: { ru: 'Заказ на плитку', uz: 'Plitka buyurtmasi', en: 'An order for tiles' },
    q: { ru: 'Пол панели 8 клеток на 3. Каждая клетка одна плитка. Сколько плиток нужно и сколько останется от 30?', uz: "Panel poli 8 katakka 3 katak. Har bir katak bitta plitka. Nechta plitka kerak va 30 tadan nechtasi ortadi?", en: 'The floor of a panel is 8 squares by 3. Each square is one tile. How many tiles are needed and how many will be left out of 30?' },
    q_speech: { ru: 'пол панели восемь клеток на три. Каждая клетка это одна плитка. Сколько плиток нужно и сколько останется от тридцати?', uz: "panel poli sakkiz katakka uch katak. Har bir katak bitta plitka. Nechta plitka kerak va o'ttiztadan nechtasi ortadi?", en: 'the floor of a panel is eight squares by three. Each square is one tile. How many tiles are needed and how many will be left out of thirty?' },
    tbl_heads: [
      { ru: 'в ряду', uz: 'qatorda', en: 'in a row' },
      { ru: 'рядов', uz: 'qator', en: 'rows' },
      { ru: 'есть плиток', uz: 'plitka bor', en: 'tiles available' }
    ],
    tbl_cells: ['8', '3', '30'],
    pick_label: { ru: 'С какого действия начинаем?', uz: 'Qaysi amaldan boshlaymiz?', en: 'Which operation do we start with?' },
    opts: [
      { ru: '8 · 3', uz: '8 · 3', en: '8 · 3' },
      { ru: '(8 + 3) · 2', uz: '(8 + 3) · 2', en: '(8 + 3) · 2' },
      { ru: '30 − 8', uz: '30 − 8', en: '30 − 8' },
      { ru: '8 + 3', uz: '8 + 3', en: '8 + 3' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Так считают путь по краю, а плитка ложится внутри.', uz: "Bunda chekka yo'li sanaladi, plitka esa ichkariga yotadi.", en: 'That is how the path along the edge is counted, and tiles are laid inside.' },
      2: { ru: 'Вычитать рано, сначала узнаем, сколько плиток нужно.', uz: "Ayirish erta, avval nechta plitka kerakligini bilamiz.", en: 'It is too early to subtract, first we find out how many tiles are needed.' },
      3: { ru: 'Длина и ширина вместе это не число клеток.', uz: "Uzunlik va en birga kataklar soni emas.", en: 'The length and the width together are not the number of squares.' }
    },
    pick_ok: { ru: 'Верно. Клетки считают рядами.', uz: "To'g'ri. Kataklar qatorlab sanaladi.", en: 'Right. Squares are counted by rows.' },
    step1_q: { ru: 'Сколько плиток нужно?', uz: 'Nechta plitka kerak?', en: 'How many tiles are needed?' },
    ans1: 24,
    hint1: { ru: 'Восемь клеток три раза.', uz: "Sakkizta katak uch marta.", en: 'Eight squares three times.' },
    step2_q: { ru: 'Сколько плиток останется?', uz: 'Nechta plitka ortadi?', en: 'How many tiles will be left?' },
    ans2: 6,
    hint2: { ru: 'Из тридцати убери двадцать четыре.', uz: "O'ttiztadan yigirma to'rttani olib tashlang.", en: 'Take twenty four away from thirty.' },
    check: { ru: 'S = 24 см²', uz: 'S = 24 sm²', en: 'S = 24 sq cm' },
    setup_audio: { ru: 'Строителям привезли плитку. Посмотри на таблицу и реши, с чего начинать.', uz: "Quruvchilarga plitka keltirildi. Jadvalga qarang va nimadan boshlashni hal qiling.", en: 'Tiles were delivered to the builders. Look at the table and decide where to start.' },
    audio: {
      intro: { ru: 'Пол панели восемь клеток на три. Сколько плиток нужно и сколько останется от тридцати?', uz: "Panel poli sakkiz katakka uch katak. Nechta plitka kerak va o'ttiztadan nechtasi ortadi?", en: 'The floor of a panel is eight squares by three. How many tiles are needed and how many will be left out of thirty?' },
      on_correct: { ru: 'Двадцать четыре плитки ушло, шесть осталось.', uz: "Yigirma to'rtta plitka ketdi, oltitasi qoldi.", en: 'Twenty four tiles were used, six are left.' },
      on_wrong: { ru: 'Вернись к первому шагу. Сколько клеток на полу.', uz: "Birinchi qadamga qayting. Polda nechta katak bor.", en: 'Go back to the first step. How many squares there are on the floor.' }
    }
  },

  // s13 — FINAL: uch topshiriq, sonlar darsda uchramagan.
  s13: {
    eyebrow: { ru: 'Финал', uz: 'Yakuniy', en: 'Final' },
    intro_line: { ru: 'Три задания. Считай клетки внутри', uz: "Uchta topshiriq. Ichkaridagi kataklarni sanang", en: 'Three tasks. Count the squares inside' },
    items: [
      {
        kind: 'num',
        q: { ru: 'В ряду 6 клеток, рядов 5. Чему равна площадь в см²?', uz: "Qatorda 6 katak, qator 5 ta. Yuza sm² da nechaga teng?", en: 'A row has 6 squares and there are 5 rows. What is the area in sq cm?' },
        q_speech: { ru: 'в ряду шесть клеток, рядов пять. Чему равна площадь в квадратных сантиметрах?', uz: "qatorda oltita katak, qator beshta. Yuza kvadrat santimetrda nechaga teng?", en: 'a row has six squares and there are five rows. What is the area in square centimetres?' },
        ans: 30,
        hint: { ru: 'Шесть клеток пять раз.', uz: "Oltita katak besh marta.", en: 'Six squares five times.' }
      },
      {
        kind: 'num',
        q: { ru: 'Квадратная панель 4 клетки в ряд. Чему равна её площадь?', uz: "Kvadrat panelda qatorda 4 katak. Yuzasi nechaga teng?", en: 'A square panel is 4 squares in a row. What is its area?' },
        q_speech: { ru: 'квадратная панель четыре клетки в ряд. Чему равна её площадь?', uz: "kvadrat panelda qatorda to'rtta katak. Yuzasi nechaga teng?", en: 'a square panel is four squares in a row. What is its area?' },
        ans: 16,
        hint: { ru: 'У квадрата рядов столько же, сколько клеток в ряду.', uz: "Kvadratda qator soni qatordagi katak soniga teng.", en: 'A square has as many rows as there are squares in a row.' }
      },
      {
        kind: 'num',
        q: { ru: 'Внутри 12 клеток, в ряду 3. Сколько рядов?', uz: "Ichkarida 12 katak, qatorda 3 ta. Nechta qator bor?", en: 'There are 12 squares inside and 3 in a row. How many rows?' },
        q_speech: { ru: 'внутри двенадцать клеток, в ряду три. Сколько рядов?', uz: "ichkarida o'n ikkita katak, qatorda uchta. Nechta qator bor?", en: 'there are twelve squares inside and three in a row. How many rows?' },
        ans: 4,
        hint: { ru: 'Раздели все клетки на число клеток в ряду.', uz: "Hamma katakni qatordagi katak soniga bo'ling.", en: 'Divide all the squares by the number of squares in a row.' }
      }
    ],
    fact_badge: { ru: 'Знаешь ли ты?', uz: 'Bilasizmi?', en: 'Which line is wrong?' },
    fact_text: {
      ru: 'Единица площади всегда квадрат. Один квадратный дециметр это квадрат со стороной 10 см, и в него помещается ровно 100 квадратных сантиметров: десять рядов по десять клеток.',
      uz: "Yuza birligi har doim kvadrat. Bir kvadrat detsimetr bu tomoni 10 sm bo'lgan kvadrat, unga roppa-rosa 100 kvadrat santimetr sig'adi: o'ntadan o'n qator.",
      en: 'A unit of area is always a square. One square decimetre is a square with a side of 10 cm, and exactly 100 square centimetres fit into it: ten rows of ten squares.'
    },
    fact_audio: {
      ru: 'Единица площади всегда квадрат. Один квадратный дециметр это квадрат со стороной десять сантиметров. Разлинуй его на клетки по сантиметру, и получится десять рядов по десять клеток, то есть сто квадратных сантиметров. Поэтому дециметровая мерка сразу заменяет сотню сантиметровых, и большие панели удобнее мерить именно ею.',
      uz: "Yuza birligi har doim kvadrat. Bir kvadrat detsimetr bu tomoni o'n santimetr bo'lgan kvadrat. Uni santimetrli kataklarga bo'lsangiz, o'ntadan o'n qator chiqadi, ya'ni yuz kvadrat santimetr. Shuning uchun detsimetrli o'lchov birdaniga yuzta santimetrlini almashtiradi va katta panellarni o'shanda o'lchash qulay.",
      en: 'A unit of area is always a square. One square decimetre is a square with a side of ten centimetres. Rule it into centimetre squares and you get ten rows of ten squares, that is one hundred square centimetres. So a decimetre measure replaces a hundred centimetre ones at once, and big panels are easier to measure with it.'
    },
    audio: {
      intro: { ru: 'Три задания напоследок. Везде считай клетки внутри.', uz: "Oxirida uchta topshiriq. Hamma joyda ichkaridagi kataklarni sanang.", en: 'Three tasks at the end. Count the squares inside everywhere.' },
      on_correct: { ru: 'Верно.', uz: "To'g'ri.", en: 'Correct.' },
      on_wrong: { ru: 'Посчитай клетки рядами и не бери путь по краю.', uz: "Kataklarni qatorlab sanang, chekka yo'lini olmang.", en: 'Count the squares by rows and do not take the path along the edge.' }
    }
  },

  // s14 — YAKUN: keyingisi to'rtburchak yuzasi formulasi (reja 39-satr).
  s14: {
    eyebrow: { ru: 'Итог', uz: 'Yakun', en: 'Result' },
    mission_done: { ru: 'Панель измерена!', uz: "Panel o'lchandi!", en: 'The panel is measured!' },
    cando: {
      ru: ['считаю площадь клетками', 'называю квадратную единицу', 'не путаю площадь с периметром'],
      uz: ["yuzani kataklab sanayman", "kvadrat birlikni nomlayman", "yuzani perimetr bilan chalkashtirmayman"],
      en: ['I count area in squares', 'I name the square unit', 'I do not confuse area with perimeter']
    },
    rule_recap: { ru: 'Площадь это клетки внутри, а мерка сама квадрат.', uz: "Yuza bu ichkaridagi kataklar, o'lchovning o'zi esa kvadrat.", en: 'Area is the squares inside, and the measure is itself a square.' },
    conn_label_refs: { ru: 'опирается на', uz: 'nimaga tayanadi', en: 'builds on' },
    conn_refs: { ru: 'урок 33: периметр; урок 9: таблица умножения', uz: '33-dars: perimetr; 9-dars: ko\'paytirish jadvali', en: 'lesson 33: perimeter; lesson 9: the multiplication table' },
    conn_label_next: { ru: 'дальше', uz: 'keyin', en: 'next' },
    conn_next: { ru: 'площадь прямоугольника: длина на ширину', uz: "to'rtburchak yuzasi: uzunlikni enga ko'paytirish", en: 'the area of a rectangle: length times width' },
    audio: {
      ru: 'Панель измерена. Запомни главное. Площадь показывает, сколько клеток помещается внутри фигуры, и мерка при этом сама квадрат. Клетка со стороной один сантиметр это один квадратный сантиметр. Периметр меряют по краю в сантиметрах, а площадь внутри в квадратных. В следующий раз найдём короткий способ считать клетки!',
      uz: "Panel o'lchandi. Asosiysini eslab qoling. Yuza shakl ichiga nechta katak sig'ishini ko'rsatadi, o'lchovning o'zi esa kvadrat. Tomoni bir santimetr bo'lgan katak bir kvadrat santimetr. Perimetr chekkadan santimetrda, yuza ichkaridan kvadrat santimetrda o'lchanadi. Keyingi safar kataklarni sanashning qisqa yo'lini topamiz!",
      en: 'The panel is measured. Remember the main thing. Area shows how many squares fit inside a figure, and the measure itself is a square. A square with a side of one centimetre is one square centimetre. The perimeter is measured along the edge in centimetres, and the area inside in square ones. Next time we will find a short way to count the squares!'
    }
  }
};

// v9 KO'PRIK — ekranda ko'rinmaydi, faqat ovozda (brgSeg orqali birinchi segment).
const BRIDGES = {
  s1:  { ru: 'Заглянем внутрь.', uz: 'Ichkariga qaraymiz.', en: 'Let us look inside.' },
  s2:  { ru: 'Заполним клетками.', uz: "Kataklar bilan to'ldiramiz.", en: 'Let us fill it with squares.' },
  s3:  { ru: "Соберём это в правило.", uz: "Buni qoidaga yig'amiz.", en: 'Let us gather this into a rule.' },
  s4:  { ru: 'Прочитай чертёж.', uz: "Chizmani o'qing.", en: 'Read the drawing.' },
  s5:  { ru: 'Разложи по единицам.', uz: 'Birliklarga ajrating.', en: 'Sort them by units.' },
  s6:  { ru: 'Быстрый вопрос.', uz: 'Tez savol.', en: 'A quick question.' },
  s7:  { ru: 'Заполни консоль.', uz: "Konsolni to'ldiring.", en: 'Fill the console.' },
  s8:  { ru: 'Величину назвали не ту.', uz: 'Kattalik boshqa atalibdi.', en: 'The wrong quantity was named.' },
  s9:  { ru: 'А вот и Бит со своей идеей.', uz: "Mana Bit ham o'z fikri bilan.", en: 'And here is Bit with his idea.' },
  s10: { ru: 'Теперь считай сам.', uz: "Endi o'zingiz hisoblang.", en: 'Now count on your own.' },
  s11: { ru: 'И ещё одна панель.', uz: 'Yana bitta panel.', en: 'And one more panel.' },
  s12: { ru: 'Заказ на плитку.', uz: 'Plitka buyurtmasi.', en: 'An order for tiles.' },
  s13: { ru: 'Финальная проверка.', uz: 'Yakuniy tekshiruv.', en: 'The final check.' },
  s14: { ru: 'Панель измерена. Идём дальше!', uz: "Panel o'lchandi. Davom etamiz!", en: 'The panel is measured. Let us move on!' }
};

// s14 payoff (xulosadan oldin aytiladi)
const S14_PAYOFF = {
  ru: 'Миссия выполнена! Клетки сосчитаны, единица названа верно. Спасибо за помощь!',
  uz: "Missiya bajarildi! Kataklar sanaldi, birlik to'g'ri ataldi. Yordamingiz uchun rahmat!",
  en: 'Mission complete! The squares are counted and the unit is named correctly. Thank you for your help!'
};

// ============================================================
// 1-SINF ANIMATSION KIT (etalon — keyingi darslar shundan meros oladi)
// Barcha sikllar prefers-reduced-motion bilan to'xtaydi (CSS @media + usePrefersReducedMotion).
// ============================================================



































// ============================================================
// LUMO VIZUALIZATORLAR — «BIT SHAHRI» (yuzlik/o'nlik/birlik):
// chiroq (birlik) · lenta = 10 chiroq (o'nlik) · panel = 10 lenta (yuzlik).
// Qizil mitti yulduz osmoni, chiroqli minoralar. Razryad-mat (3 ustun).
// ============================================================


const brgSeg = makeBrgSeg(BRIDGES);
const withBridgeAudio = (c, key) => {
  const b = BRIDGES[key];
  if (!b || !c.audio || !c.audio.intro) return c;
  return { ...c, audio: { ...c.audio, intro: { ru: `${b.ru} ${c.audio.intro.ru}`, uz: `${b.uz} ${c.audio.intro.uz}` } } };
};



















// --- RAZRYAD-MAT (3 ustun: yuzlik/o'nlik/birlik). concrete -> panel/lenta/chiroq; digits -> raqam.
const RazryadTable = ({ h = 0, t = 0, o = 0, labels, emph = null, concrete = false, digits = false, onCell = null, cellSel = null }) => {
  const cols = [['h', h], ['t', t], ['o', o]];
  return (
    <div className="lm-mat">
      {cols.map(([k, n]) => (
        <div key={k} className={`lm-mat-col ${emph === k ? 'lm-mat-emph' : ''}`}>
          <div className="lm-mat-head mono">{labels[k]}</div>
          <div className="lm-mat-cell">
            {concrete && (
              <div className="lm-mat-stack">
                {n === 0
                  ? <span className="lm-mat-zero mono">0</span>
                  : Array.from({ length: n }).map((_, i) => (
                      <span key={i} className="g1-pop-in" style={{ animationDelay: `${i * 0.05}s` }}>
                        {k === 'h' ? <Panel className="lm-mat-panel"/> : k === 't' ? <Lenta className="lm-mat-lenta"/> : <Chiroq className="lm-mat-chiroq"/>}
                      </span>
                    ))}
              </div>
            )}
            {digits && (
              onCell
                ? <button className={`lm-mat-digit lm-mat-digit-btn mono ${cellSel === k ? 'lm-mat-digit-ok' : ''}`} onClick={() => onCell(k)}>{n}</button>
                : <div className="lm-mat-digit mono">{n}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};






























// --- HOOK SAHNASI: Lumo shahri + butun ekipaj sayyorada qo'ngan. Bit mezbon MARKAZDA, do'stlar yon-atrofda.




// ============================================================
// EKRANLAR — Dars09 «Ko'paytirish jadvali» (Б2 «Nur bog'lari»)
// ============================================================



// --- KRISTALL QATLAMI (D33): blok foni — 1-DARSNING Lumo shahri, kitdagi `LumoCityBg`
// AYNAN o'zi. Nusxa OLINMAYDI: kit hamma darsga umumiy, uni o'zgartirib bo'lmaydi.
// Darsning o'z qatlami ustiga qo'yiladi — kristall panel va yorug' chegara.
const GridNodeLayer = () => {
  const lang = useLang();
  return (
  <svg className="lm-scene-bg" viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <g transform="translate(112 96)">
      <rect x="-6" y="-6" width="180" height="96" rx="6" fill="#0D1928" opacity="0.14"/>
      {Array.from({ length: 3 }).map((_, r) => (
        Array.from({ length: 5 }).map((_, c) => (
          <rect key={`${r}-${c}`} x={c * 34} y={r * 28} width="34" height="28"
            fill={r === 0 && c === 0 ? '#FFD98A' : (r + c) % 2 ? '#DCEBF5' : '#EAF4FA'}
            stroke="#7FA8BF" strokeWidth="0.9" opacity="0.92"/>
        ))
      ))}
      <rect x="0" y="0" width="34" height="28" fill="none" stroke="#FFB92E" strokeWidth="2.6"/>
      <text x="85" y="-12" textAnchor="middle" fontSize="8" letterSpacing="1.4" fill="#3F5A6B" fontFamily="'JetBrains Mono', monospace">{tri(lang, 'СЕТКА КЛЕТОК', "KATAK-TO'R", 'THE GRID OF SQUARES')}</text>
      <text x="85" y="100" textAnchor="middle" fontSize="9" fontWeight="800" fill="#C06A2E" fontFamily="'JetBrains Mono', monospace">{tri(lang, '1 клетка = 1 см²', '1 katak = 1 sm2', '1 square = 1 sq cm')}</text>
    </g>
    <g transform="translate(300 150)">
      <rect x="0" y="-10" width="20" height="20" fill="#FFD98A" stroke="#7FA8BF" strokeWidth="1.4"/>
      <text x="10" y="22" textAnchor="middle" fontSize="7" fill="#3F5A6B" fontFamily="'JetBrains Mono', monospace">{tri(lang, 'мерка', "o'lchov", 'the measure')}</text>
    </g>
  </svg>
  );
};

const CrystalCityScene = ({ gathered = false }) => {
  const kid = ({ key, El, hook }, i) => (
    <span key={key} className="lm-crew lm-crew-kid g1-pop-in" style={{ animationDelay: `${0.25 + i * 0.12}s` }}>
      <El {...(gathered ? { mood: 'happy', pose: 'happy' } : hook)}/>
    </span>
  );
  return (
    <div className="lm-scene">
      <LumoCityBg fill/>
      <GridNodeLayer/>
      <div className="lm-scene-cast">
        {LUMO_CAST.slice(0, 2).map(kid)}
        <span className={`lm-crew lm-crew-host ${gathered ? 'd2-bit-cheer' : 'lm-bob'}`}><span className="g1-cast-fig"><BitSVG state={gathered ? 'happy' : 'present'}/></span></span>
        {LUMO_CAST.slice(2).map((c, i) => kid(c, i + 2))}
      </div>
    </div>
  );
};
const NumPad = ({ value, setValue, disabled, max = 3, state = null }) => {
  const push = (d) => { if (disabled) return; setValue((v) => (v.length >= max ? v : v + d)); };
  const back = () => { if (disabled) return; setValue((v) => v.slice(0, -1)); };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div className={`mono${state === 'bad' ? ' lm-ans-bad' : ''}`} style={{ minWidth: 120, height: 'clamp(40px, min(46px, 6.1dvh), 46px)', borderRadius: 12, border: `2.5px solid ${state === 'ok' ? '#1F7A4D' : state === 'bad' ? '#E0563A' : T.accent}`, background: state === 'ok' ? '#EAF6EF' : state === 'bad' ? '#FDECE7' : T.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, color: state === 'ok' ? '#1F7A4D' : state === 'bad' ? '#B33F27' : T.ink, letterSpacing: 4, padding: '0 14px', transition: 'border-color .18s, background .18s, color .18s' }}>{value || '—'}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: 6 }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
          <button key={d} type="button" disabled={disabled} onClick={() => push(String(d))} style={{ ...npKey, cursor: disabled ? 'default' : 'pointer' }}>{d}</button>
        ))}
        <span/>
        <button type="button" disabled={disabled} onClick={() => push('0')} style={{ ...npKey, cursor: disabled ? 'default' : 'pointer' }}>0</button>
        <button type="button" disabled={disabled} onClick={back} style={{ ...npKey, fontSize: 18, color: T.accent, cursor: disabled ? 'default' : 'pointer' }}>⌫</button>
      </div>
    </div>
  );
};

// ============================================================
// DARS12 EKRANLARI (15). Donor: Dars10 (barcha yangi naqshlar bilan).
// YANGI: PathRow/SplitArray (yo'lak kesish) va ColumnMulDemo (ustun 23x4, o'tkazish).
// ============================================================





// --- KONSOL YACHEYKASI (1-darsdan ko'chirilgan `.lm-cons*` uslubi, 15-darsning komponenti):
// `label` berilsa ekranchada YOZUV ko'rsatiladi (10 · 7), tagida terilgan javob yoki «?».
const MeasureCell = ({ head, n = 8, badge, val, lit = false, label = null }) => {
  const t = useT();
  return (
  <div className={`lm-cons ${lit ? 'lm-cons-lit' : ''}`}>
    {head ? <div className="lm-cons-head mono">{head}</div> : null}
    <div className="lm-cons-screen">
      {label !== null ? (
        <span className="mono d16-plate">{t(label)}</span>
      ) : (
        <span className="d16-row">
          {Array.from({ length: n }).map((_, i) => (
            <span key={i} className="d16-row-lamp"><Chiroq/></span>
          ))}
        </span>
      )}
      {badge ? <span className="lm-cons-x mono">{badge}</span> : null}
    </div>
    {val !== null && val !== undefined ? <div className="lm-cons-val mono lm-reveal">{val}</div> : <div className="lm-cons-val mono" style={{ color: '#C4BEB4' }}>?</div>}
  </div>
  );
};





// --- FACTCARD QAHRAMONI: 1 dm² ichida 100 sm².
const DmFig = () => (
  <svg viewBox="0 0 220 104" style={{ width: 'min(266px, 84%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <g transform="translate(60 6)">
      {Array.from({ length: 10 }).map((_, r) => (
        Array.from({ length: 10 }).map((_, c) => (
          <rect key={`${r}-${c}`} x={c * 9} y={r * 9} width="9" height="9" fill="#F7F1E4" stroke="#C08A3E" strokeWidth="0.5"/>
        ))
      ))}
      <rect x="0" y="0" width="90" height="90" fill="none" stroke="#C06A2E" strokeWidth="2.4"/>
      <rect x="0" y="0" width="9" height="9" fill="#F2A85C" stroke="#C06A2E" strokeWidth="1"/>
    </g>
    <text x="30" y="50" textAnchor="middle" fontSize="10" fontWeight="800" fill="#5A4A2E" fontFamily="'JetBrains Mono', monospace">1 dm2</text>
    <text x="185" y="50" textAnchor="middle" fontSize="10" fontWeight="800" fill="#C06A2E" fontFamily="'JetBrains Mono', monospace">100</text>
    <text x="185" y="64" textAnchor="middle" fontSize="8" fill="#8A8378" fontFamily="'JetBrains Mono', monospace">sm2</text>
  </svg>
);
const MCOne = ({ props, ck, mono = false, figLine = null, figNode = null }) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT[ck];
  const segs = Array.isArray(c.audio.intro[lang]) ? c.audio.intro[lang] : [c.audio.intro[lang]];
  const audio = useAudio([
    brgSeg(ck, lang),
    ...segs.map((text, i) => ({ id: `${ck}_i${i}`, text, trigger: 'after_previous', waits_for: null }))
  ]);
  const canAct = useCanAnswer(audio);
  const order = React.useMemo(() => shuffleArr(c.opts.map((_, i) => i)), []);
  const ci = order.indexOf(c.ci);
  const [picked, setPicked] = useState(null);
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const [hintMsg, setHintMsg] = useState(null);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const firstRef = useRef(true);
  const solved = picked === ci || props.storedAnswer?.correct === true;
  const pick = (i) => {
    if (!canAct || solved || wrongSet.has(i)) return;
    if (i === ci) {
      setPicked(i); sfx.playCorrect(); setHintMsg(null);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_correct[lang]); }
    } else {
      const n = new Set(wrongSet); n.add(i); setWrongSet(n);
      firstRef.current = false;
      const h = c.hints[order[i]];
      setHintMsg(h || null);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((h || c.audio.on_wrong)[lang]); }
    }
  };
  useEffect(() => {
    if (solved && !recorded) {
      setRecorded(true);
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: t(c.q),
        correctAnswer: c.opts[c.ci][lang], studentAnswer: c.opts[c.ci][lang], correct: firstRef.current,
        firstTry: firstRef.current, attempts: 1, solved: true
      });
    }
  }, [solved]);
  const revealRef = useRevealScroll(solved, 500);
  const canAdv = useAdvanceGate(solved, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <h1 className="title h-sub fade-up">{t(c.q)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(10px, 2vw, 14px)', padding: 'clamp(14px, 2.6vw, 20px)' }}>
          <FrameFx/>
          {figNode}
          {figLine && <span className="mono d34-errline">{t(figLine)}</span>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(100px, 1fr))', gap: 10, width: '100%' }}>
            {order.map((k, i) => (
              <button key={i} className={`option ${solved && i === ci ? 'option-correct' : ''} ${wrongSet.has(i) ? 'option-picked-wrong' : ''}`}
                disabled={!canAct || solved || wrongSet.has(i)} onClick={() => pick(i)}
                style={{ padding: 'clamp(9px, 1.5vw, 12px)', fontSize: mono ? 'clamp(15px, 2.5vw, 20px)' : 'clamp(12px, 1.8vw, 15px)', minHeight: 'clamp(44px, 6.2vw, 54px)', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: mono ? "'JetBrains Mono', monospace" : undefined }}>{t(c.opts[k])}</button>
            ))}
          </div>
          {hintMsg && !solved && <p className="lm-hint-bad fade-up">{t(hintMsg)}</p>}
        </div>
        {solved && (
          <div ref={revealRef} className="frame-success reveal-soft">
            <Reaction state="correct" praise={t(c.audio.on_correct)}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// --- BITTA TOPSHIRIQLI NumPad TRENAJYOR (16-darsning s11 naqshi, bitta misolga): javob
// teriladi, to'g'rida CheckStrip bilan teskari tekshirish, noto'g'rida turtki-hint.
const NumOne = ({ props, ck }) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT[ck];
  const audio = useAudio([
    brgSeg(ck, lang),
    { id: `${ck}_intro`, text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [val, setVal] = useState('');
  const [numLock, setNumLock] = useState(false);
  const [numState, setNumState] = useState(null);   // ekranda KO'RINADIGAN javob holati
  const [hintMsg, setHintMsg] = useState(null);
  const [solved, setSolved] = useState(props.storedAnswer !== undefined);
  const firstRef = useRef(props.storedAnswer ? props.storedAnswer.firstTry : true);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const check = () => {
    if (!canAct || numLock || val === '' || solved) return;
    setNumLock(true);
    const isOk = parseInt(val, 10) === c.ans;
    setNumState(isOk ? 'ok' : 'bad');
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((isOk ? c.audio.on_correct : c.hint)[lang]); }
    if (isOk) { setSolved(true); sfx.playCorrect(); setHintMsg(null); }
    else { firstRef.current = false; setHintMsg(c.hint); setTimeout(() => { setVal(''); setNumLock(false); setNumState(null); }, 1500); }
  };
  useEffect(() => {
    if (solved && !recorded) {
      setRecorded(true);
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: t(c.q),
        correctAnswer: String(c.ans), studentAnswer: String(c.ans), correct: firstRef.current,
        firstTry: firstRef.current, attempts: 1, solved: true
      });
    }
  }, [solved]);
  const revealRef = useRevealScroll(solved, 500);
  const canAdv = useAdvanceGate(solved, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <h1 className="title h-sub fade-up">{t(c.q)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(8px, 1.6vw, 12px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
          <FrameFx/>
          <NumPad value={solved ? String(c.ans) : val} setValue={(u) => { setNumState(null); setVal(u); }} disabled={!canAct || numLock || solved} max={3} state={numState}/>
          {!solved && <button className="btn-white-accent" disabled={!canAct || numLock || val === ''} onClick={check}>{tri(lang, 'Проверить', 'Tekshiring', 'Check')}</button>}
          {solved && <CheckStrip expr={c.check} cap={t(c.check_label)} ok/>}
          {hintMsg && !solved && <p className="lm-hint-bad fade-up">{t(hintMsg)}</p>}
        </div>
        {solved && (
          <div ref={revealRef} className="frame-success reveal-soft">
            <Reaction state="correct" praise={c.audio.on_correct[lang]}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

const Screen0 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s0;
  const audio = useAudio(c.audio.intro[lang].map((text, i) => ({
    id: `s0_${i}`, text, trigger: i === 0 ? 'on_mount' : 'after_previous', waits_for: null
  })));
  const canAct = useCanAnswer(audio);
  const [picked, setPicked] = useState(null);
  const order = React.useMemo(() => shuffleArr([0, 1, 2, 3]), []);
  const ok = picked !== null && order[picked] === 0;
  const fbKey = (i) => {
    const k = order[i];
    return k === 0 ? 'on_correct' : (k === 1 ? 'on_wrong1' : (k === 2 ? 'on_wrong2' : 'on_idk'));
  };
  const pick = (i) => {
    if (picked !== null || !canAct) return;
    setPicked(i);
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio[fbKey(i)][lang]); }
  };
  const canAdv = useAdvanceGate(picked !== null, audio);
  const navContent = (
    <>
      {props.screen > 0 && <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>}
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  const opts = [c.opt0, c.opt1, c.opt2, c.opt3];
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(4px, 1vw, 8px)' }}>
        <div className="fade-up" style={{ alignSelf: 'center', background: T.accentSoft, color: T.accent, fontWeight: 800, fontSize: 'clamp(12px, 1.8vw, 15px)', padding: '5px 14px', borderRadius: 999 }}>{t(c.topic)}</div>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1 d34-hook-scene" style={{ padding: 'clamp(8px, 1.8vw, 14px)', overflow: 'hidden' }}>
          <CrystalCityScene gathered={ok}/>
        </div>
        {picked === null && (
          <div className="frame fade-up delay-1" style={{ padding: 'clamp(6px, 1.2vw, 9px)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <span className="d34-order">
              <span className="mono d34-order-plate">11</span>
              <span className="d34-order-sep mono">:</span>
              <span className="mono d34-order-plate">2</span>
            </span>
            <span className="d34-note">{t(c.order_cap)}</span>
          </div>
        )}
        <p className="fade-up delay-1" style={{ textAlign: 'center', color: T.ink2, fontWeight: 600, fontSize: 'clamp(13px, 1.8vw, 16px)', margin: 0 }}>{t(c.q)}</p>
        {picked === null && (
          <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
            {order.map((k, i) => (
              <button key={i} className="option" disabled={!canAct} onClick={() => pick(i)}
                style={{ padding: 'clamp(9px, 1.4vw, 12px)', fontSize: 'clamp(12.5px, 2vw, 16px)', minHeight: 'clamp(44px, 6.2vw, 54px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, textAlign: 'center' }}>
                {t(opts[k])}
              </button>
            ))}
          </div>
        )}
        {picked !== null && (
          <div className="fade-up" style={{ display: 'flex', justifyContent: 'center' }}>
            <button className={`option ${ok ? 'option-correct' : 'option-picked-wrong'}`} disabled
              style={{ padding: 'clamp(10px, 1.5vw, 12px) clamp(16px, 2.4vw, 22px)', fontSize: 'clamp(13px, 2vw, 17px)', minHeight: 'clamp(44px, 6.2vw, 54px)', width: 'auto', display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800 }}>
              <span className="mono small">{ok ? '✓' : '↺'}</span>
              <span>{t(opts[order[picked]])}</span>
            </button>
          </div>
        )}
        {picked !== null && (
          <FeedbackBlock show={true} isCorrect={ok} wrongClass="frame-tip">
            <Reaction state={ok ? 'correct' : 'wrong'} praise={t(c.audio[fbKey(picked)])}/>
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};

// s1 — XONALAR BO'YICHA: tanish usul (darslik 45-bet, a bandi)
const Screen1 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s1;
  const audio = useAudio([
    brgSeg('s1', lang),
    { id: 's1_0', text: c.audio[lang][0], trigger: 'after_previous', waits_for: null },
    { id: 's1_1', text: c.audio[lang][1], trigger: 'on_event:step1', waits_for: null },
    { id: 's1_2', text: c.audio[lang][2], trigger: 'on_event:step2', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const { step, done, advance } = useTapSteps(audio, 3);
  const tap = () => { if (!canAct || done) return; sfx.playCorrect(); advance(); };
  const revealRef = useRevealScroll(done, 400);
  const canAdv = useAdvanceGate(done, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1.4vw, 10px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(6px, 1.4vw, 10px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
          <FrameFx/>
          <span className="mono d34-plate">{pickSib(c, 'task_line', lang)}</span>
          {step >= 1 && (
            <span className="lm-reveal" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <span className="mono d34-expr">{t(c.step1)}</span>
              <span className="d34-note">{t(c.step1_cap)}</span>
            </span>
          )}
          {step >= 2 && (
            <span className="lm-reveal" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <span className="mono d34-expr">{t(c.step2)}</span>
              <span className="d34-note">{t(c.step2_cap)}</span>
            </span>
          )}
          {step >= 2 && <span className="mono d34-final lm-reveal" style={{ animationDelay: '0.25s' }}>{t(c.res)}</span>}
          {!done && (
            <button className="btn-white-accent" disabled={!canAct} onClick={tap}
              style={{ fontSize: 'clamp(13px, 2.1vw, 16px)' }}>{t(step === 0 ? c.btn1 : c.btn2)}</button>
          )}
        </div>
        {done && (
          <div ref={revealRef} className="frame-success fade-up">
            <Reaction state="correct" praise={t(c.done_text)}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s2 — MODEL: chegara bo'ylab kataklab yurish (kitning `GridFig` i, perimetr rejimi)
const Screen2 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s2;
  const audio = useAudio([
    brgSeg('s2', lang),
    { id: 's2_0', text: c.audio[lang][0], trigger: 'after_previous', waits_for: null },
    { id: 's2_1', text: c.audio[lang][1], trigger: 'on_event:step1', waits_for: null },
    { id: 's2_2', text: c.audio[lang][2], trigger: 'on_event:step2', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const { step, done, advance } = useTapSteps(audio, 3);
  const tap = () => { if (!canAct || done) return; sfx.playCorrect(); advance(); };
  const revealRef = useRevealScroll(done, 400);
  const canAdv = useAdvanceGate(done, audio);
  const total = 2 * (c.w + c.h);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1.4vw, 10px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(6px, 1.4vw, 10px)', padding: 'clamp(10px, 2vw, 15px)' }}>
          <FrameFx/>
          <GridFig w={c.w} h={c.h} mode="area" filled={step >= 2 ? c.w * c.h : step >= 1 ? c.w : 0} labels={[String(c.w), String(c.h)]}/>
          <div className="d34-gridrow">
            {step >= 1 && (
              <span className="d34-gridcap lm-reveal">
                <span className="d34-expr" style={{ fontSize: 'clamp(11px, 1.7vw, 13px)', color: '#C97F35' }}>{t(c.capA)}</span>
              </span>
            )}
            {step >= 2 && (
              <span className="d34-gridcap lm-reveal">
                <span className="d34-expr" style={{ fontSize: 'clamp(11px, 1.7vw, 13px)', color: '#2E7E9E' }}>{t(c.capB)}</span>
              </span>
            )}
          </div>
          {step >= 2 && <span className="mono d34-final lm-reveal" style={{ animationDelay: '0.25s' }}>{t(c.res)}</span>}
          {!done && (
            <button className="btn-white-accent" disabled={!canAct} onClick={tap}
              style={{ fontSize: 'clamp(13px, 2.1vw, 16px)' }}>{t(step === 0 ? c.btn1 : c.btn2)}</button>
          )}
        </div>
        {done && (
          <div ref={revealRef} className="frame-success fade-up">
            <Reaction state="correct" praise={t(c.done_text)}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s3 — SAVOL-OLDIN-QOIDA
const Screen3 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s3;
  const audio = useAudio([
    brgSeg('s3', lang),
    { id: 's3_0', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [picked, setPicked] = useState(null);
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const [hintMsg, setHintMsg] = useState(null);
  const order = React.useMemo(() => shuffleArr(c.opts.map((_, i) => i)), []);
  const ci = order.indexOf(c.ci);
  const solved = picked === ci;
  const pick = (i) => {
    if (!canAct || solved || wrongSet.has(i)) return;
    if (i === ci) {
      setPicked(i); sfx.playCorrect(); setHintMsg(null);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(`${c.on_correct[lang]} ${c.rule_speech[lang]}`); }
    } else {
      const n = new Set(wrongSet); n.add(i); setWrongSet(n);
      const h = c.hints[order[i]];
      setHintMsg(h || null);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((h || c.hints[1])[lang]); }
    }
  };
  const revealRef = useRevealScroll(solved, 500);
  const canAdv = useAdvanceGate(solved, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <h1 className="title h-sub fade-up" style={{ textAlign: 'center', color: T.accent }}>{t(c.q)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10, padding: 'clamp(12px, 2.4vw, 18px)' }}>
          <FrameFx/>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(120px, 1fr))', gap: 10 }}>
            {order.map((k, i) => (
              <button key={i} className={`option ${solved && i === ci ? 'option-correct' : ''} ${wrongSet.has(i) ? 'option-picked-wrong' : ''}`}
                disabled={!canAct || solved || wrongSet.has(i)} onClick={() => pick(i)}
                style={{ padding: 'clamp(10px, 1.6vw, 13px)', minHeight: 'clamp(44px, 6.2vw, 54px)', fontSize: 'clamp(12px, 1.8vw, 15px)', fontWeight: 800, textAlign: 'center' }}>
                {t(c.opts[k])}
              </button>
            ))}
          </div>
          {hintMsg && !solved && <p className="lm-hint-bad fade-up">{t(hintMsg)}</p>}
        </div>
        {solved && (
          <div ref={revealRef} className="d2-rulecard fade-up">
            <span className="d2-rulecard-badge mono">{t(c.eyebrow)}</span>
            <div className="d15-rulelines">
              {c.rule_lines[lang].map((l, i) => <span key={i} className="d15-ruleline lm-reveal" style={{ animationDelay: `${i * 0.18}s` }}>{l}</span>)}
              <span className="mono d15-ruleex lm-reveal" style={{ animationDelay: '0.54s' }}>{t(c.rule_ex)}</span>
            </div>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s4 — RASM BO'YICHA: chizmadagi panelning yuzasi
const Screen4 = (props) => (
  <MCOne props={props} ck="s4"
    figNode={<GridFig w={CONTENT.s4.fig_w} h={CONTENT.s4.fig_h} mode="area" filled={CONTENT.s4.fig_w * CONTENT.s4.fig_h} unit="sm2" labels={[String(CONTENT.s4.fig_w), String(CONTENT.s4.fig_h)]}/>}/>
);

// s5 — SARALASH: tekis bo'linadi yoki qoldiq bilan
const Screen5 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s5;
  const audio = useAudio([
    brgSeg('s5', lang),
    { id: 's5_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [idx, setIdx] = useState(props.storedAnswer ? c.items.length : 0);
  const [sel, setSel] = useState(false);
  const [wrongBin, setWrongBin] = useState(null);
  const [okBin, setOkBin] = useState(props.storedAnswer !== undefined ? (c.items[c.items.length - 1].a ? 'a' : 'b') : null);
  const [hintMsg, setHintMsg] = useState(null);
  const [score, setScore] = useState(props.storedAnswer ? (props.storedAnswer.studentAnswer | 0) : 0);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const firstAllRef = useRef(props.storedAnswer ? props.storedAnswer.firstTry : true);
  const triedRef = useRef(false);
  const it = c.items[Math.min(idx, c.items.length - 1)];
  const done = idx >= c.items.length;
  const revealRef = useRevealScroll(done, 400);
  const place = (bin) => {
    if (!canAct || done || okBin !== null) return;
    const right = (bin === 'a') === it.a;
    if (right) {
      setOkBin(bin); sfx.playCorrect(); setHintMsg(null);
      if (!triedRef.current) setScore((s) => s + 1);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_correct[lang]); }
      setTimeout(() => {
        const last = idx + 1 >= c.items.length;
        if (!last) { setOkBin(null); setSel(false); setWrongBin(null); }
        triedRef.current = false;
        setIdx((n) => n + 1);
      }, 1300);
    } else {
      setWrongBin(bin);
      triedRef.current = true;
      firstAllRef.current = false;
      setHintMsg(it.hint);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(it.hint[lang]); }
      setTimeout(() => setWrongBin(null), 900);
    }
  };
  useEffect(() => {
    if (done && !recorded) {
      setRecorded(true);
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: 'sort-bins',
        correctAnswer: String(c.items.length), studentAnswer: score, correct: firstAllRef.current,
        firstTry: firstAllRef.current, attempts: 1, solved: true
      });
    }
  }, [done]);
  const canAdv = useAdvanceGate(done, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  const bin = (key, label) => (
    <button className={`lm-bin ${okBin === key ? 'lm-bin-full' : ''} ${wrongBin === key ? 'option-picked-wrong' : ''} ${sel && okBin === null ? 'lm-bin-open' : ''}`}
      disabled={!canAct || done || okBin !== null} onClick={() => place(key)}>
      <span className="lm-bin-head mono">{t(label)}</span>
      <span className="lm-bin-slot mono">{okBin === key ? t(it.n) : ''}</span>
    </button>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.8vw, 12px)' }}>
        {it && (
          <>
            <div className="mono fade-up" style={{ textAlign: 'center', color: T.accent, fontWeight: 800 }}>{lang === 'ru' ? `Задание ${Math.min(idx + 1, c.items.length)} из ${c.items.length}` : `${Math.min(idx + 1, c.items.length)}-topshiriq, jami ${c.items.length}`}</div>
            <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
            <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(8px, 1.8vw, 12px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
              <FrameFx/>
              <div className="lm-digtray">
                {okBin === null
                  ? <button className={`lm-digchip mono ${sel ? 'lm-digchip-sel' : ''}`} disabled={!canAct || done} onClick={() => setSel(true)}>{t(it.n)}</button>
                  : <span className="lm-digtray-empty mono">{t(it.n)}</span>}
              </div>
              <div className="d34-bins">
                {bin('a', c.bin_a)}
                {bin('b', c.bin_b)}
              </div>
              {hintMsg && <p className="lm-hint-bad fade-up">{t(hintMsg)}</p>}
            </div>
          </>
        )}
        {done && (
          <div ref={revealRef} className="frame-success reveal-soft">
            <Reaction state="correct" praise={lang === 'ru' ? `Верно: ${score} из ${c.items.length}` : `To'g'ri: ${c.items.length} tadan ${score} ta`}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s6 — TEST: 25 : 2, nechtasi ortadi
const Screen6 = (props) => <MCOne props={props} ck="s6" mono/>;

// s7 — KONSOL: 38 : 3, bo'linma va qoldiq
const Screen7 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s7;
  const audio = useAudio([
    brgSeg('s7', lang),
    { id: 's7_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [phase, setPhase] = useState(props.storedAnswer ? c.cells.length : 0);
  const [val, setVal] = useState('');
  const [numLock, setNumLock] = useState(false);
  const [numState, setNumState] = useState(null);   // ekranda KO'RINADIGAN javob holati
  const [hintMsg, setHintMsg] = useState(null);
  const firstRef = useRef(props.storedAnswer ? props.storedAnswer.firstTry : true);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const solved = phase >= c.cells.length;
  const cell = c.cells[Math.min(phase, c.cells.length - 1)];
  const check = () => {
    if (!canAct || numLock || val === '' || solved) return;
    setNumLock(true);
    const isOk = parseInt(val, 10) === cell.ans;
    setNumState(isOk ? 'ok' : 'bad');
    const last = phase + 1 >= c.cells.length;
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(isOk ? (last ? c.audio.on_correct[lang] : nextPraise(lang)) : cell.hint[lang]); }
    if (isOk) {
      sfx.playCorrect(); setHintMsg(null);
      setTimeout(() => { setVal(''); setNumLock(false); setNumState(null); setPhase((p) => p + 1); }, last ? 400 : 900);
    } else {
      firstRef.current = false;
      setHintMsg(cell.hint);
      setTimeout(() => { setVal(''); setNumLock(false); setNumState(null); }, 1500);
    }
  };
  useEffect(() => {
    if (solved && !recorded) {
      setRecorded(true);
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: t(c.lead),
        correctAnswer: '12', studentAnswer: '12', correct: firstRef.current,
        firstTry: firstRef.current, attempts: 1, solved: true
      });
    }
  }, [solved]);
  const revealRef = useRevealScroll(solved, 500);
  const canAdv = useAdvanceGate(solved, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(5px, 1.1vw, 9px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(5px, 1.1vw, 9px)', padding: 'clamp(10px, 2vw, 15px)' }}>
          <FrameFx/>
          <span className="mono d34-expr">{t(c.swap_line)}</span>
          <div className={`lm-console${c.cells.length === 3 ? ' lm-console-3' : ''}`} style={{ gridTemplateColumns: `repeat(${gridCols(c.cells.length)}, 1fr)`, maxWidth: c.cells.length === 4 ? 320 : 520 }}>
            {c.cells.map((cl, i) => (
              <MeasureCell key={i} head={t(cl.head)} label={cl.label} val={phase > i ? String(cl.ans) : null} lit={phase === i}/>
            ))}
          </div>
          {!solved && (
            <>
              <NumPad value={val} setValue={setVal} disabled={!canAct || numLock} max={3} state={numState}/>
              <button className="btn-white-accent" disabled={!canAct || numLock || val === ''} onClick={check}>{tri(lang, 'Проверить', 'Tekshiring', 'Check')}</button>
            </>
          )}
          {solved && <CheckStrip expr={c.check} cap={t(c.check_label)} ok/>}
          {hintMsg && !solved && <p className="lm-hint-bad fade-up">{t(hintMsg)}</p>}
        </div>
        {solved && (
          <div ref={revealRef} className="frame-success reveal-soft">
            <Reaction state="correct" praise={c.audio.on_correct[lang]}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s8 — XATONI TOP: 53 : 4 = 12 (qold. 5)
const Screen8 = (props) => <MCOne props={props} ck="s8" figLine={CONTENT.s8.fig_line}/>;

// s9 — BIT TUZOG'I: «javob chiroyli, tekshirish shart emas» (yopiq maydon)
const Screen9 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s9;
  const audio = useAudio([
    brgSeg('s9', lang),
    { id: 's9_0', text: c.audio[lang][0], trigger: 'after_previous', waits_for: null },
    { id: 's9_1', text: c.audio[lang][1], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [trapPick, setTrapPick] = useState(null);
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const firstRef = useRef(true);
  const solved = trapPick === c.trap_ci || props.storedAnswer?.correct === true;
  const pickTrap = (i) => {
    if (!canAct || solved || wrongSet.has(i)) return;
    if (i === c.trap_ci) {
      setTrapPick(i); sfx.playCorrect();
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.trap_correct[lang]); }
    } else {
      const n = new Set(wrongSet); n.add(i); setWrongSet(n);
      firstRef.current = false;
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.trap_wrong[lang]); }
    }
  };
  useEffect(() => {
    if (solved && !recorded) {
      setRecorded(true);
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: t(c.trap_label),
        correctAnswer: c.trap_opts[lang][c.trap_ci], studentAnswer: c.trap_opts[lang][c.trap_ci], correct: firstRef.current,
        firstTry: firstRef.current, attempts: 1, solved: true
      });
    }
  }, [solved]);
  const revealRef = useRevealScroll(solved, 500);
  const canAdv = useAdvanceGate(solved, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  const lines = pickSib(c, 'lines', lang);
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1.4vw, 10px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(6px, 1.4vw, 10px)', padding: 'clamp(14px, 2.6vw, 20px)' }}>
          <FrameFx/>
          <span className="mono d34-plate">{lines[0]}</span>
          <span className="d34-bad">{lines[1]}</span>
          <span className="d34-note">{t(c.line_cap)}</span>
          <p className="fade-up" style={{ margin: 0, textAlign: 'center', color: T.ink2, fontWeight: 700 }}>{t(c.trap_label)}</p>
          <div className="d34-trap">
            {c.trap_opts[lang].map((o, i) => (
              <button key={i} className={`option ${solved && i === c.trap_ci ? 'option-correct' : ''} ${wrongSet.has(i) ? 'option-picked-wrong' : ''}`}
                disabled={!canAct || solved || wrongSet.has(i)} onClick={() => pickTrap(i)}
                style={{ padding: 'clamp(10px, 1.6vw, 13px) clamp(16px, 2.4vw, 22px)', fontSize: 'clamp(14px, 2.2vw, 18px)', minHeight: 'clamp(44px, 6.2vw, 54px)', fontWeight: 800 }}>{o}</button>
            ))}
          </div>
        </div>
        {solved && (
          <div ref={revealRef} className="frame-success reveal-soft">
            <Reaction state="correct" praise={t(c.trap_correct)}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s10 — TRENAJYOR: ko'paytirishni bo'lish bilan tekshirish (96 : 8)
const Screen10 = (props) => <NumOne props={props} ck="s10"/>;

// s11 — TRENAJYOR NumPad: 53 : 4
const Screen11 = (props) => <NumOne props={props} ck="s11"/>;

// s12 — MASALA: 74 : 6, yashiklar va ortiqcha detallar
const Screen12 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s12;
  const audio = useAudio([
    brgSeg('s12', lang),
    { id: 's12_setup', text: c.setup_audio[lang], trigger: 'after_previous', waits_for: null },
    { id: 's12_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const order = React.useMemo(() => shuffleArr(c.opts.map((_, i) => i)), []);
  const ci = order.indexOf(c.ci);
  const [pickIdx, setPickIdx] = useState(null);
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const [hintMsg, setHintMsg] = useState(null);
  const [val, setVal] = useState('');
  const [numLock, setNumLock] = useState(false);
  const [numState, setNumState] = useState(null);   // ekranda KO'RINADIGAN javob holati
  const [stepNum, setStepNum] = useState(0);
  const [solved, setSolved] = useState(props.storedAnswer?.correct === true);
  const firstRef = useRef(props.storedAnswer ? props.storedAnswer.firstTry : true);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const chosen = pickIdx === ci || solved;
  const pick = (i) => {
    if (!canAct || chosen || wrongSet.has(i)) return;
    if (i === ci) {
      setPickIdx(i); sfx.playCorrect(); setHintMsg(null);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.pick_ok[lang]); }
    } else {
      const n = new Set(wrongSet); n.add(i); setWrongSet(n);
      firstRef.current = false;
      const h = c.hints[order[i]];
      setHintMsg(h || null);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((h || c.hints[1])[lang]); }
    }
  };
  const stepAns = stepNum === 0 ? c.ans1 : c.ans2;
  const stepHint = stepNum === 0 ? c.hint1 : c.hint2;
  const check = () => {
    if (!canAct || numLock || val === '' || solved) return;
    setNumLock(true);
    const isOk = parseInt(val, 10) === stepAns;
    setNumState(isOk ? 'ok' : 'bad');
    const last = stepNum === 1;
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(isOk ? (last ? c.audio.on_correct[lang] : nextPraise(lang)) : stepHint[lang]); }
    if (isOk) {
      sfx.playCorrect(); setHintMsg(null);
      if (last) { setSolved(true); }
      else { setTimeout(() => { setVal(''); setNumLock(false); setNumState(null); setStepNum(1); }, 900); }
    } else {
      firstRef.current = false;
      setHintMsg(stepHint);
      setTimeout(() => { setVal(''); setNumLock(false); setNumState(null); }, 1500);
    }
  };
  useEffect(() => {
    if (solved && !recorded) {
      setRecorded(true);
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: t(c.q),
        correctAnswer: String(c.ans2), studentAnswer: String(c.ans2), correct: firstRef.current,
        firstTry: firstRef.current, attempts: 1, solved: true
      });
    }
  }, [solved]);
  const revealRef = useRevealScroll(solved, 500);
  const canAdv = useAdvanceGate(solved, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(5px, 1.1vw, 9px)' }}>
        <h1 className="title h-sub fade-up" style={{ margin: 0, fontSize: 'clamp(13px, 2.1vw, 18px)' }}>{t(c.q)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(5px, 1.1vw, 9px)', padding: 'clamp(10px, 2vw, 15px)' }}>
          <FrameFx/>
          <TaskTable heads={c.tbl_heads.map((h) => t(h))} cells={c.tbl_cells}/>
          {!chosen && (
            <>
              <p className="fade-up" style={{ margin: 0, textAlign: 'center', color: T.ink2, fontWeight: 700, fontSize: 'clamp(12px, 1.7vw, 14px)' }}>{t(c.pick_label)}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(96px, 1fr))', gap: 10, width: '100%' }}>
                {order.map((k, i) => (
                  <button key={i} className={`option ${wrongSet.has(i) ? 'option-picked-wrong' : ''}`}
                    disabled={!canAct || wrongSet.has(i)} onClick={() => pick(i)}
                    style={{ padding: 'clamp(9px, 1.5vw, 12px)', fontSize: 'clamp(14px, 2.4vw, 19px)', minHeight: 'clamp(42px, 6vw, 52px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>{t(c.opts[k])}</button>
                ))}
              </div>
            </>
          )}
          {chosen && (
            <>
              <span className="mono lm-reveal" style={{ fontSize: 'clamp(16px, 3vw, 22px)', fontWeight: 800, color: '#1F7A4D' }}>{t(c.opts[c.ci])}</span>
              {!solved && (
                <>
                  <span className="d34-steplabel lm-reveal">{t(stepNum === 0 ? c.step1_q : c.step2_q)}</span>
                  <NumPad value={val} setValue={setVal} disabled={!canAct || numLock} max={3} state={numState}/>
                  <button className="btn-white-accent" disabled={!canAct || numLock || val === ''} onClick={check}>{tri(lang, 'Проверить', 'Tekshiring', 'Check')}</button>
                </>
              )}
              {solved && <span className="mono d34-res lm-reveal">{c.ans1} · {c.ans2}</span>}
            </>
          )}
          {solved && <CheckStrip expr={c.check} cap={t(CONTENT.s7.check_label)} ok/>}
          {hintMsg && !solved && <p className="lm-hint-bad fade-up">{t(hintMsg)}</p>}
        </div>
        {solved && (
          <div ref={revealRef} className="frame-success fade-up">
            <Reaction state="correct" praise={c.audio.on_correct[lang]}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s13 — FINAL 3 misol + FactCard
const Screen13 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s13;
  const items = c.items;
  const orders = React.useMemo(() => items.map((it) => it.kind === 'num' ? null : shuffleArr([0, 1, 2, 3])), []);
  const audio = useAudio([
    brgSeg('s13', lang),
    { id: 's13_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [idx, setIdx] = useState(props.storedAnswer ? items.length : 0);
  const [picked, setPicked] = useState(null);
  const [val, setVal] = useState('');
  const [numLock, setNumLock] = useState(false);
  const [numState, setNumState] = useState(null);   // ekranda KO'RINADIGAN javob holati
  const [score, setScore] = useState(props.storedAnswer ? (props.storedAnswer.studentAnswer | 0) : 0);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const factRef = useRevealScroll(idx >= items.length, 500);
  const it = items[Math.min(idx, items.length - 1)];
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const [hintMsg, setHintMsg] = useState(null);
  const numTriedRef = useRef(false);
  const done = idx >= items.length;
  const PASS = Math.ceil(items.length * 0.7);
  useEffect(() => {
    if (done || audio.muted || !it.q_speech) return;
    const e = getAudioEngine(); if (e) e.pushOneOff(it.q_speech[lang]);
  }, [idx]);
  const pick = (i) => {
    if (!canAct || picked !== null || done || wrongSet.has(i)) return;
    const isOk = orders[idx][i] === 0;
    if (isOk) {
      setPicked(i); sfx.playCorrect();
      if (wrongSet.size === 0) setScore((s) => s + 1);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_correct[lang]); }
      setTimeout(() => { setPicked(null); setWrongSet(new Set()); setHintMsg(null); setIdx((n) => n + 1); }, 1500);
    } else {
      const nw = new Set(wrongSet); nw.add(i); setWrongSet(nw);
      const hint = it[`wrong_${orders[idx][i]}`] || it.wrong_1 || c.audio.on_wrong;
      setHintMsg(hint);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(hint[lang]); }
    }
  };
  const checkNum = () => {
    if (!canAct || numLock || val === '' || done) return;
    setNumLock(true);
    const isOk = parseInt(val, 10) === it.ans;
    setNumState(isOk ? 'ok' : 'bad');
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((isOk ? c.audio.on_correct : it.hint)[lang]); }
    if (isOk) {
      sfx.playCorrect();
      if (!numTriedRef.current) setScore((s) => s + 1);
      setTimeout(() => { setVal(''); setNumLock(false); setNumState(null); setHintMsg(null); numTriedRef.current = false; setIdx((n) => n + 1); }, 1700);
    } else {
      numTriedRef.current = true;
      setHintMsg(it.hint);
      setTimeout(() => { setVal(''); setNumLock(false); setNumState(null); }, 1700);
    }
  };
  useEffect(() => {
    if (done && !recorded) {
      setRecorded(true);
      const finalScore = score;
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.fact_audio[lang]); }
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: t(c.intro_line),
        correctAnswer: String(items.length), studentAnswer: finalScore, correct: finalScore >= PASS,
        firstTry: finalScore >= PASS, attempts: 1, solved: finalScore >= PASS
      });
    }
  }, [idx]);
  const canAdv = useAdvanceGate(done, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <p className="fade-up" style={{ textAlign: 'center', color: T.ink2, fontWeight: 700, margin: 0 }}>{t(c.intro_line)}</p>
        {!done && it && (
          <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
            <FrameFx/>
            <div className="mono" style={{ textAlign: 'center', color: T.accent, fontWeight: 800 }}>{lang === 'ru' ? `Задание ${idx + 1} из ${items.length}` : `${idx + 1}-topshiriq, jami ${items.length}`}</div>
            <h2 className="title h-sub" style={{ textAlign: 'center' }}>{t(it.q)}</h2>
            {it.kind === 'num' ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <NumPad value={val} setValue={setVal} disabled={!canAct || numLock} max={3} state={numState}/>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button className="btn-white-accent" disabled={!canAct || numLock || val === ''} onClick={checkNum}>{tri(lang, 'Проверить', 'Tekshiring', 'Check')}</button>
                </div>
                {hintMsg && <p className="lm-hint-bad fade-up">{t(it.hint)}</p>}
              </>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(110px, 1fr))', gap: 10 }}>
                  {orders[idx].map((k, i) => (
                    <button key={i} className={`option ${picked === i ? 'option-correct' : wrongSet.has(i) ? 'option-picked-wrong' : ''}`} disabled={!canAct || picked !== null || wrongSet.has(i)} onClick={() => pick(i)}
                      style={{ padding: 'clamp(9px, 1.5vw, 12px)', fontSize: 'clamp(13px, 2.1vw, 17px)', minHeight: 'clamp(42px, 6vw, 52px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>
                      {t(it[`opt${k}`])}
                    </button>
                  ))}
                </div>
                {hintMsg && (
                  <p className="lm-hint-bad fade-up">{t(hintMsg)}</p>
                )}
              </>
            )}
          </div>
        )}
        {done && (
          <div ref={factRef}>
            <div className="frame-success reveal-soft" style={{ marginBottom: 12 }}>
              <Reaction state="correct" praise={lang === 'ru' ? `Верно: ${score} из ${items.length}` : `To'g'ri: ${items.length} tadan ${score} ta`}/>
            </div>
            <div className="d2-factcard fade-up">
              <span className="d2-factcard-badge mono">{t(c.fact_badge)}</span>
              <div className="d2-fact-hero"><DmFig/></div>
              <p className="d2-factcard-txt">{t(c.fact_text)}</p>
            </div>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s14 — YAKUN
const Screen14 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s14;
  const audio = useAudio([
    { id: 's14_pay', text: S14_PAYOFF[lang], trigger: 'on_mount', waits_for: null },
    { id: 's14_sum', text: c.audio[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={false} onClick={props.finishLesson} label={lang === 'uz' ? 'Tugatish' : 'Завершить'}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2.2vw, 14px)', position: 'relative' }}>
        <div className="fade-up" style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          {[0, 1, 2].map((i) => (
            <span key={i} className="g1-pop-in" style={{ animationDelay: `${0.1 + i * 0.18}s`, display: 'inline-flex' }}>
              <svg viewBox="0 0 40 40" style={{ width: 'clamp(26px, 6vw, 34px)', height: 'auto', animation: `g1twinkle ${1.8 + i * 0.3}s ease-in-out ${0.7 + i * 0.25}s infinite` }} aria-hidden="true">
                <path d="M20 3 L25.2 14.6 L38 16 L28.5 24.6 L31.2 37 L20 30.4 L8.8 37 L11.5 24.6 L2 16 L14.8 14.6 Z" fill="#FFC23C"/>
              </svg>
            </span>
          ))}
        </div>
        <Confetti/>
        <div className="frame-success fade-up">
          <h2 className="title h-title" style={{ margin: 0, textAlign: 'center' }}>{t(c.mission_done)}</h2>
          <p className="title" style={{ margin: 'clamp(4px, 1vw, 8px) 0 0', fontSize: 'clamp(14px, 2vw, 17px)', color: '#1F7A4D', textAlign: 'center' }}>{t(c.cando)}</p>
        </div>
        <div className="d2-rulecard fade-up delay-1">
          <span className="d2-rulecard-badge mono">{tri(lang, 'Помни', 'Yodda tuting', 'Remember')}</span>
          <p className="d2-rulecard-txt">{t(c.rule_recap)}</p>
        </div>
        <div className="d34-final-scene fade-up delay-1"><CrystalCityScene gathered/></div>
      </div>
    </Stage>
  );
};

// ============================================================
// KORNEVOY KOMPONENT (shablon: infrastructure_v1 / grade1 Dars28)
// ============================================================
export default function AreaUnitLesson({
  studentName, lang: langProp, ttsApiBase, voiceGender,
  correctSoundUrl, wrongSoundUrl, aiGradingEndpoint, onFinished,
}) {
  useMobileZoom();
  const isPreview = (langProp === undefined || langProp === null);
  const [previewLang, setPreviewLang] = useState('ru');
  const lang = langProp || previewLang;
  const safeName = studentName || (lang === 'uz' ? "O'quvchi" : 'Ученик');
  configureLesson({ ttsApiBase: ttsApiBase || '', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', aiGradingEndpoint: aiGradingEndpoint || '', studentName: safeName, voiceGender: voiceGender || 'f', lessonId: (LESSON_META && LESSON_META.lessonId) || '', lessonTitle: (LESSON_META && LESSON_META.lessonTitle) || null });
  const safeOnFinished = onFinished || ((payload) => {
    // eslint-disable-next-line no-console
    console.log('[Preview] onFinished payload:', payload);
  });

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [heroMood, setHeroMood] = useState('pointing');   // personaj holati (butun urok bo'ylab bitta overlay)
  const heroCtx = React.useMemo(() => ({ setMood: setHeroMood }), []);
  const startTimeRef = useRef(Date.now());

  const recordAnswer = useCallback((screenIdx, data) => {
    setAnswers(prev => { const next = [...prev]; next[screenIdx] = data; return next; });
  }, []);

  const reset = useCallback(() => { setAnswers([]); setCurrent(0); setHeroMood('pointing'); startTimeRef.current = Date.now(); }, []);

  const finishLesson = useCallback(() => {
  const scored = SCREEN_META.filter(s => s.scored);
  const finalScreens = scored.filter(s => s.scope === 'final');
  const correctCount = answers.filter((a, i) => a && SCREEN_META[i]?.scored && a.correct).length;
  const finalCorrect = answers.filter((a, i) => a && SCREEN_META[i]?.scope === 'final' && SCREEN_META[i]?.scored && a.correct).length;
  const checked = answers.filter(a => a && typeof a.firstTry === 'boolean');
  const payload = {
    lessonId: LESSON_META.lessonId,
    lessonTitle: LESSON_META.lessonTitle,
    durationSec: Math.floor((Date.now() - startTimeRef.current) / 1000),
    totalQuestions: scored.length,
    correctAnswers: correctCount,
    scorePercent: scored.length > 0 ? Math.round((correctCount / scored.length) * 100) : 0,
    finalScore: finalCorrect,
    finalTotal: finalScreens.length,
    passed: finalScreens.length > 0 ? finalCorrect / finalScreens.length >= 0.6 : (scored.length > 0 ? correctCount / scored.length >= 0.6 : false),
    firstTryStats: { total: checked.length, firstTryCorrect: checked.filter(a => a.firstTry === true).length },
    answers: answers.filter(Boolean)
  };
  safeOnFinished(payload);
}, [answers, safeOnFinished]);

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14];
  const CurrentScreen = screens[current];

  // Ekran almashganda personajni "ko'rsatadi" (pointing) holatiga qaytaramiz;
  // javobdan keyin Reaction uni happy/encourage'ga o'zgartiradi.
  const next = () => { setHeroMood('pointing'); setCurrent(s => Math.min(s + 1, TOTAL_SCREENS - 1)); };
  const prev = () => { setHeroMood('pointing'); setCurrent(s => Math.max(s - 1, 0)); };

  const handleAnswer = useCallback((data) => { recordAnswer(current, data); }, [current, recordAnswer]);

  const starTotal = SCREEN_META.filter((s) => s.scored).length;
  const starsEarned = answers.filter((a, i) => a && SCREEN_META[i] && SCREEN_META[i].scored && a.correct).length;

  return (
    <LangContext.Provider value={lang}>
      <ProgressContext.Provider value={{ stars: starsEarned, total: starTotal }}>
      <HeroContext.Provider value={heroCtx}>
      <style>{STYLES}</style>
      <div className="lesson-root">
        <GradientDefs/>
        <D2Defs/>
        <D2Motes/>
        <StageHero mood={heroMood}/>
        {/* v8: «UCHISHGA TAYYORLIK» shkalasi — INFRA/Stage'дан TASHQARIDA (lesson-root darajasi) */}
        <ReadinessMeter screen={current} total={TOTAL_SCREENS} lang={lang}/>
        {isPreview && (
          <div style={{ position: 'fixed', top: 10, right: 10, zIndex: 1000, display: 'flex', gap: 4, background: '#FFFFFF', borderRadius: 99, padding: 4, boxShadow: '0 4px 12px -4px rgba(58, 53, 48, 0.25)' }}>
            {['ru', 'uz', 'en'].map(l => (
              <button key={l} onClick={() => setPreviewLang(l)}
                style={{ border: 'none', cursor: 'pointer', borderRadius: 99, padding: '4px 12px', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600,
                         background: previewLang === l ? '#FF4F28' : 'transparent', color: previewLang === l ? '#FFFFFF' : '#5A5A60' }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        )}
        <CurrentScreen screen={current} studentName={safeName} storedAnswer={answers[current]} answers={answers} onAnswer={handleAnswer} onNext={next} onPrev={prev} onReset={reset} finishLesson={finishLesson}/>
      </div>
      </HeroContext.Provider>
      </ProgressContext.Provider>
    </LangContext.Provider>
  );
}
const STYLES = BASE_STYLES + `
.lm-mat-stack { display: flex; flex-direction: column; align-items: center; gap: 3px; }
/* Хук с дополнительной панелью: рамка тянется, сцена занимает ровно остаток места.
   Так не нужен магический запас высоты — экран сходится на любом окне. */
.lm-scene-host { flex: 1 1 auto; min-height: 0; display: flex; align-items: center; justify-content: center; }
.lm-scene-host .lm-scene { width: auto; height: 100%; max-width: 100%; max-height: 372px; }
.lm-scene { position: relative; width: min(100%, calc(clamp(var(--scene-floor, 160px), calc(100dvh - var(--scene-reserve, 570px)), 372px) * 400 / 210)); aspect-ratio: 400 / 210; margin-inline: auto; border-radius: 14px; overflow: hidden; }
@media (prefers-reduced-motion: reduce) { .lm-reveal, .lm-write, .lm-drop, .lm-fadein { animation: none; } }
.d2-factcard { display: flex; flex-direction: column; gap: 6px; background: #14203C; border-radius: 14px; padding: clamp(12px, 2.4vw, 18px); }
.d2-factcard-badge { align-self: flex-start; background: rgba(255,184,77,0.2); color: #FFC23C; font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.5px; }
.d2-factcard-txt { margin: 0; color: #EAF0F8; font-size: clamp(14px, 1.9vw, 16px); line-height: 1.5; }
/* --- FactCard KENG tungi-bog' paneli + 3D orbita (Dars01 SymPy hisobi bayt-aniq) --- */
.d2-fact-hero { align-self: stretch; display: block; margin: 4px calc(-1 * clamp(12px, 2.4vw, 18px)) 8px; }
.d2-fact-hero .d2-factfig { display: block; width: 100%; }
.d2-fact-hero .d2-factfig svg { display: block; width: 100%; height: auto; border-radius: 14px; box-shadow: 0 8px 22px -8px rgba(5,10,25,0.6); }
.lumo-orbit-front, .lumo-orbit-back { transform-box: view-box; transform-origin: 170px 78px; animation: 13s linear infinite; }
.lumo-orbit-front { animation-name: lumoOrbitFront; }
.lumo-orbit-back { animation-name: lumoOrbitBack; }
.rd-glow { transform-box: view-box; transform-origin: 170px 78px; animation: rdPulse 3.8s ease-in-out infinite; }
.star-tw { animation: starTw 2.8s ease-in-out infinite; }
.comet { transform-box: view-box; animation: cometDrift 10s linear infinite; }
.heat-wave { animation: starTw 2.2s ease-in-out infinite; }
.bulb-rays { animation: rayPulse 3.8s ease-in-out infinite; }
@keyframes rayPulse { 0%, 100% { opacity: 0.22; } 50% { opacity: 0.5; } }
@keyframes starTw { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
@keyframes cometDrift { 0% { transform: translate(30px,116px); opacity: 0; } 6% { opacity: 0.85; } 32% { opacity: 0.85; } 46% { transform: translate(250px,20px); opacity: 0; } 100% { transform: translate(250px,20px); opacity: 0; } }
@keyframes rdPulse { 0%, 100% { opacity: 0.8; transform: scale(1); } 50% { opacity: 1; transform: scale(1.05); } }
@keyframes lumoOrbitFront {
  0% { transform: translate(74px,0px) scale(1); opacity: 1; }
  8.33% { transform: translate(64.09px,-20.69px) scale(1.22); opacity: 1; }
  16.67% { transform: translate(37px,-35.84px) scale(1.455); opacity: 1; }
  25% { transform: translate(0px,-41.38px) scale(1.565); opacity: 1; }
  33.33% { transform: translate(-37px,-35.84px) scale(1.455); opacity: 1; }
  41.67% { transform: translate(-64.09px,-20.69px) scale(1.22); opacity: 1; }
  50% { transform: translate(-74px,0px) scale(1); opacity: 1; }
  58.33% { transform: translate(-64.09px,20.69px) scale(0.847); opacity: 0; }
  66.67% { transform: translate(-37px,35.84px) scale(0.762); opacity: 0; }
  75% { transform: translate(0px,41.38px) scale(0.735); opacity: 0; }
  83.33% { transform: translate(37px,35.84px) scale(0.762); opacity: 0; }
  91.67% { transform: translate(64.09px,20.69px) scale(0.847); opacity: 0; }
  100% { transform: translate(74px,0px) scale(1); opacity: 1; }
}
@keyframes lumoOrbitBack {
  0% { transform: translate(74px,0px) scale(1); opacity: 0; }
  8.33% { transform: translate(64.09px,-20.69px) scale(1.22); opacity: 0; }
  16.67% { transform: translate(37px,-35.84px) scale(1.455); opacity: 0; }
  25% { transform: translate(0px,-41.38px) scale(1.565); opacity: 0; }
  33.33% { transform: translate(-37px,-35.84px) scale(1.455); opacity: 0; }
  41.67% { transform: translate(-64.09px,-20.69px) scale(1.22); opacity: 0; }
  50% { transform: translate(-74px,0px) scale(1); opacity: 0; }
  58.33% { transform: translate(-64.09px,20.69px) scale(0.847); opacity: 1; }
  66.67% { transform: translate(-37px,35.84px) scale(0.762); opacity: 1; }
  75% { transform: translate(0px,41.38px) scale(0.735); opacity: 1; }
  83.33% { transform: translate(37px,35.84px) scale(0.762); opacity: 1; }
  91.67% { transform: translate(64.09px,20.69px) scale(0.847); opacity: 1; }
  100% { transform: translate(74px,0px) scale(1); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) { .lumo-orbit-front, .lumo-orbit-back, .rd-glow, .star-tw, .comet, .heat-wave, .bulb-rays { animation: none; } .lumo-orbit-back, .comet { opacity: 0; } .bulb-rays { opacity: 0.35; } }
/* === DARS11: RazryadShift taxtasi === */
.rz-wrap { display: flex; flex-direction: column; gap: 6px; width: min(340px, 92%); }
.rz-heads { display: grid; grid-template-columns: repeat(3, 1fr); text-align: center; font-size: clamp(9px, 1.5vw, 11px); font-weight: 800; color: #8A8378; text-transform: uppercase; letter-spacing: 0.4px; }
.rz-board { position: relative; height: clamp(56px, 12vw, 72px); }
.rz-cell { position: absolute; top: 0; bottom: 0; width: calc(100% / 3 - 6px); margin: 0 3px; background: #FBF7F0; border-radius: 12px; box-shadow: inset 0 0 0 1.5px rgba(58, 53, 48, 0.08); }
.rz-chip { position: absolute; top: 0; bottom: 0; width: calc(100% / 3); display: flex; align-items: center; justify-content: center; font-size: clamp(26px, 6vw, 38px); font-weight: 800; color: #3A3530; transition: left 0.9s ease, opacity 0.6s ease; }
/* saralash kartasi: to'g'ri savatga "uchib ketadi" */
.rz-fly { animation: rz-fly-a 1s ease forwards; }
@keyframes rz-fly-a { 0% { transform: translateY(0) scale(1); opacity: 1; } 100% { transform: translateY(46px) scale(0.55); opacity: 0; } }
/* zanjir tuguni yonishi */
.rz-node-on { animation: rz-node-a 0.5s ease; }
@keyframes rz-node-a { 0% { transform: scale(0.7); } 60% { transform: scale(1.15); } 100% { transform: scale(1); } }
/* 5 soniyalik soat (Dars01 naqshi) */
@media (prefers-reduced-motion: reduce) { .rz-chip { transition: none; } .rz-fly, .rz-node-on, .lm-reveal { animation: none; } }
/* === DARS12: YO'LAKLAR va KESISH (SplitArray) ===
   Metodist: yo'lak HAQIQIY ko'rinsin. Shuning uchun yo'laklar TUPROQ maydonida yotadi,
   chekkalarida o't tutamlari, har yo'lak oxirida uycha. */
.d12-ground { position: relative; width: 100%; max-width: 470px; padding: clamp(12px, 2.6vw, 18px) clamp(8px, 1.8vw, 14px); border-radius: 16px;
  background: radial-gradient(120% 90% at 50% 0%, #24402C 0%, #1A3021 55%, #12241A 100%); box-shadow: inset 0 0 0 1.5px rgba(20,40,24,0.9), inset 0 8px 18px -10px rgba(0,0,0,0.6); overflow: hidden; }
/* tuproq donadorligi */
.d12-ground::after { content: ''; position: absolute; inset: 0; pointer-events: none; opacity: 0.35;
  background-image: radial-gradient(#3E5A44 0.6px, transparent 0.7px), radial-gradient(#2C4433 0.5px, transparent 0.6px);
  background-size: 13px 11px, 9px 15px; background-position: 0 0, 5px 7px; }
/* o't tutamlari chekkalarda */
.d12-grass { position: absolute; left: 0; right: 0; height: clamp(9px, 2vw, 13px); pointer-events: none; }
.d12-grass-top { top: 2px; }
.d12-grass-bot { bottom: 2px; transform: scaleY(-1); }
.d12-grass i { position: absolute; bottom: 0; width: 2px; height: 100%; border-radius: 2px 2px 0 0; background: linear-gradient(180deg, #4E8A5A 0%, #2E5A38 100%); transform-origin: bottom center; animation: d12-sway 3.4s ease-in-out infinite; }
@keyframes d12-sway { 0%, 100% { transform: rotate(-7deg); } 50% { transform: rotate(7deg); } }
.d12-field { position: relative; z-index: 1; display: flex; flex-direction: column; gap: clamp(6px, 1.4vw, 10px); width: 100%; }
.d12-hut { flex: 0 0 auto; width: clamp(18px, 4.2vw, 26px); margin-left: clamp(4px, 1.2vw, 8px); }
/* xuk ekranidagi bitta namuna yo'lak — pastroq maydon */
.d12-sample-row { display: flex; align-items: center; justify-content: center; gap: clamp(8px, 2vw, 16px); flex-wrap: wrap; }
.d12-sample-cap { font-size: clamp(10px, 1.5vw, 12px); font-weight: 800; color: #5A5A60; max-width: 22ch; line-height: 1.35; }
.d12-ground-sample { max-width: 290px; padding: clamp(7px, 1.6vw, 11px) clamp(7px, 1.6vw, 10px); }
/* SAHNA KECHQURUN: syujet «bog' qorong'i» — tungi qatlam (SVG o'zi o'zgarmaydi) */
/* tungi qatlam AYNAN sahna ichida (freym chetlariga chiqmaydi): .lm-scene overflow hidden */
.d12-night .lm-scene { filter: brightness(0.64) saturate(0.88); }
.d12-night .lm-scene::after { content: ''; position: absolute; inset: 0; z-index: 3; pointer-events: none;
  background: linear-gradient(180deg, rgba(24,34,86,0.42) 0%, rgba(12,18,48,0.5) 100%); }
.d12-row { position: relative; display: flex; align-items: center; gap: clamp(3px, 0.8vw, 6px); }
/* nurlarning YERGA tushgan yorug'i — yo'lak «porlab turgani» shundan ko'rinadi */
.d12-row::before { content: ''; position: absolute; left: -8px; right: -8px; top: -5px; bottom: -5px; border-radius: 14px; pointer-events: none;
  background: radial-gradient(58% 130% at 42% 50%, rgba(255,214,140,0.20) 0%, rgba(255,214,140,0.07) 45%, rgba(255,214,140,0) 72%); }
.d12-plitas { display: flex; gap: clamp(3px, 0.8vw, 6px); flex: 0 0 auto; }
.d12-plitas .d12-plita { width: clamp(58px, 14vw, 82px); }
.d12-toshchas { display: flex; gap: clamp(3px, 0.8vw, 6px); flex: 0 0 auto; }
.d12-toshchas .d12-toshcha { width: clamp(14px, 3.4vw, 20px); }
.d12-plita, .d12-toshcha { display: inline-block; transition: opacity 0.45s; }
/* kesish chizig'i: yorug' vertikal ajratgich */
.d12-cut { flex: 0 0 auto; width: 3px; align-self: stretch; min-height: clamp(14px, 3.4vw, 20px); border-radius: 2px; background: linear-gradient(180deg, rgba(127,224,216,0) 0%, #7FE0D8 22%, #FFF6DC 50%, #7FE0D8 78%, rgba(127,224,216,0) 100%); box-shadow: 0 0 8px 1px rgba(127,224,216,0.75); animation: d12-cut-in 0.5s ease; }
@keyframes d12-cut-in { 0% { opacity: 0; transform: scaleY(0.2); } 100% { opacity: 1; transform: none; } }
.d12-row-split { gap: clamp(6px, 1.6vw, 12px); }
/* yorliqlar guruhlar USTIDA turadi: chapdagi plitalar ustida, o'ngdagi toshchalar ustida
   (satr bilan bir xil o'lchamlar: 2 plita + oraliq, keyin kesish chizig'i) */
.d12-labels { display: flex; align-items: flex-end; gap: clamp(6px, 1.6vw, 12px); font-size: clamp(10px, 1.6vw, 12px); font-weight: 800; color: #8A8378; text-transform: uppercase; letter-spacing: 0.4px; }
/* yorliqlar TUPROQ (to'q) fonida — yorug' ranglar */
.d12-label-l { width: calc(2 * clamp(58px, 14vw, 82px) + clamp(3px, 0.8vw, 6px)); text-align: center; color: #8FE8B4; }
.d12-label-r { width: calc(3 * clamp(14px, 3.4vw, 20px) + 2 * clamp(3px, 0.8vw, 6px) + 3px); text-align: center; color: #8FD8F0; }
.d12-spark { animation: d12-spark-a 3s ease-in-out infinite; }
@keyframes d12-spark-a { 0%, 100% { opacity: 0.55; } 50% { opacity: 1; } }
/* s1: ochiladigan ikki karta */
/* === DARS12: USTUN (stolbik) demo === */
.d12-col { display: inline-flex; flex-direction: column; align-items: flex-start; gap: 0; background: #FFF8EF; border-radius: 14px; padding: clamp(10px, 2vw, 16px) clamp(14px, 3vw, 22px); box-shadow: inset 0 0 0 1.5px rgba(255,79,40,0.18); }
/* ustun satrlari — 5-sinf naqshi: monoshrift, O'NGGA tekislangan, kenglik ch birligida,
   shuning uchun raqamlar xonalar bo'yicha aniq ustun-ustun tushadi va belgi
   ko'paytuvchining chap yonida turadi (kitobdagi joylashuv). */
.d12-colr { white-space: pre; text-align: right; min-width: 3ch; font-size: clamp(21px, 4.4vw, 30px); line-height: 1.42; font-weight: 800; color: #3A3530; }
/* ko'chirilgan o'nlik AYNAN o'nliklar ustuni ustida: satr 3 ustun, o'nlik — o'rtasi (50%) */
.d12-colr-carry { position: relative; width: 3ch; height: clamp(13px, 2.4vw, 17px); font-size: clamp(21px, 4.4vw, 30px); }
.d12-carry { position: absolute; left: 50%; top: 0; transform: translateX(-50%); font-size: clamp(11px, 2vw, 14px); line-height: 1; font-weight: 800; color: #FF4F28; }
.d12-col-sign { color: #8A8378; }
.d12-col-hot { color: #1F7A4D; }
.d12-col-rule { height: 2.5px; width: 3ch; font-size: clamp(21px, 4.4vw, 30px); background: #3A3530; border-radius: 2px; margin: 4px 0; }
.d12-col-total { align-self: center; font-size: clamp(15px, 2.8vw, 20px); font-weight: 800; color: #FF4F28; margin-top: 8px; white-space: nowrap; }
@media (prefers-reduced-motion: reduce) { .d12-spark, .d12-cut { animation: none; } }
/* past ekranlarda (768px) fakt rasmi va masala sahnasi ixchamlashadi — skrollsiz qoladi */
@media (max-height: 820px) {
  .d2-fact-hero .d2-factfig svg { max-width: 268px; margin-inline: auto; }
}
/* xuk ekrani (s0): sahna ham ETALON o'lchamida (Dars01 s0 = 629x330) */
/* yakuniy ekran (s14): sahna ETALON o'lchamida — Dars01 dagi 570px budjet */
.d13-final-scene .lm-scene { width: min(100%, calc(clamp(200px, calc(100dvh - 560px), 372px) * 400 / 210)); }
/* === DARS13: TOSH SANDIQ va TARQATISH (ShareOut) === */
.d13-box { display: inline-flex; flex-direction: column; gap: clamp(4px, 1vw, 7px); padding: clamp(8px, 1.8vw, 13px) clamp(9px, 2vw, 14px);
  border-radius: 12px; background: linear-gradient(180deg, #6B5540 0%, #4E3E2E 100%); box-shadow: inset 0 0 0 2px #7E6A52, inset 0 6px 14px -8px rgba(0,0,0,0.55); }
.d13-box-plitas { display: grid; grid-template-columns: repeat(3, auto); gap: clamp(3px, 0.8vw, 6px); }
.d13-box-plitas .d12-plita { width: clamp(44px, 10vw, 62px); }
.d13-box-toshchas { display: flex; gap: clamp(3px, 0.8vw, 6px); justify-content: center; }
.d13-box-toshchas .d12-toshcha { width: clamp(13px, 3vw, 18px); }
/* xuk ekranida sandiq + izoh yonma-yon */
.d13-boxrow { display: flex; align-items: center; justify-content: center; gap: clamp(8px, 2vw, 16px); flex-wrap: wrap; }
/* xuk panelida sandiq IXCHAM: balandlik tejaladi, skroll chiqmaydi */
.d13-boxrow .d13-box { padding: clamp(6px, 1.4vw, 9px) clamp(7px, 1.6vw, 10px); gap: clamp(3px, 0.7vw, 5px); }
.d13-boxrow .d13-box-plitas { gap: clamp(2px, 0.6vw, 4px); }
.d13-boxrow .d13-box-plitas .d12-plita { width: clamp(34px, 7.6vw, 46px); }
.d13-boxrow .d13-box-toshchas .d12-toshcha { width: clamp(10px, 2.3vw, 14px); }
.d13-boxcap { font-size: clamp(10px, 1.5vw, 12px); font-weight: 800; color: #5A5A60; max-width: 16ch; line-height: 1.35; }
/* tarqatish: sandiq -> uch yo'lak */
.d13-share { display: flex; flex-direction: column; align-items: center; gap: clamp(6px, 1.4vw, 10px); width: 100%; }
.d13-share-src { display: flex; justify-content: center; }
.d13-share-dst { max-width: 470px; }
/* bo'sh o'rin (tarqatishdan oldin) — chiziqli kontur */
.d13-slot { display: inline-block; width: clamp(58px, 14vw, 82px); height: clamp(14px, 3.2vw, 20px); border-radius: 4px; border: 1.5px dashed rgba(160,190,170,0.45); }
.d13-slot-sm { width: clamp(14px, 3.4vw, 20px); border-radius: 50%; }
/* yo'lak yorlig'i (30 -> 32) */
.d13-tag { margin-left: clamp(4px, 1.2vw, 8px); font-size: clamp(11px, 1.9vw, 15px); font-weight: 800; color: #8FE8B4; background: rgba(31,122,77,0.28); border-radius: 999px; padding: 1px 8px; }
.d13-tag-full { color: #FFE6A6; background: rgba(255,184,77,0.24); }
.d13-note { font-size: clamp(10px, 1.6vw, 12px); font-weight: 800; color: #5A5A60; }
/* burchak usuli (ugolok) — 5-sinf DivBoard naqshi */
.d13-div { padding: clamp(4px, 1.2vw, 8px) clamp(6px, 1.6vw, 10px); background: #FFF8EF; border-radius: 12px; box-shadow: inset 0 0 0 1.5px rgba(255,79,40,0.16); }
/* === DARS14: BUYURTMA TAXTASI va SAVATLAR === */
/* === DARS14: IFODA SVYORTKASI === */
/* === DARS14: QOIDA uch satr === */
/* === DARS14: QAVS panellari === */
/* === DARS14: USTUN (stolbik) — 5-sinf naqshi ===
   Har satr: BELGI sloti (2 monoshrift belgisi) + TANA. Ikkisi bir shriftda, shuning uchun
   xonalar aniq ustun-ustun tushadi, belgi esa pastdagi sonning chap yonida turadi. */
/* === DARS14: masala sahnasi (uch tokcha + yerdagi lampalar) === */
/* yakuniy ekran (s14): sahna ETALON o'lchamida (Dars01 s14) */
/* ============================================================
   DARS15 — jo'natish maydonchasi: vagonetka, son uchburchagi, tekshirish satri.
   ============================================================ */
/* sahna o'lchami — ETALON (Dars01 s0: 629x330 @1440x900), ekran uchun alohida klass:
   global .lm-scene budjetini ko'tarish HAMMA darsni kichraytiradi (metodist saboqi). */
/* Sahna o'lchami BALANDLIK BUDJETIDAN chiqadi (Dars13 naqshi): xuk ekranida sahna +
   vagonetka paneli + 4 variant sig'ishi kerak, shuning uchun budjet donor bilan bir xil. */
/* --- VAGONETKA --- */
@keyframes d15roll { from { transform: translateX(0); } to { transform: translateX(14%); } }
/* --- SON UCHBURCHAGI (darslik topshirig'i) --- */
/* --- TEKSHIRISH SATRI --- */
.d15-check { display: inline-flex; align-items: center; gap: 8px; padding: 4px 12px; border-radius: 999px;
  background: #E3F0E8; border: 2px solid #9CCBB0; }
.d15-check-no { background: #FDE8E4; border-color: #E9AFA2; }
.d15-check-sign { font-size: clamp(12px, 1.8vw, 15px); font-weight: 800; color: #1F7A4D; }
.d15-check-no .d15-check-sign { color: #C0392B; }
.d15-check-expr { font-size: clamp(13px, 2.2vw, 17px); font-weight: 800; color: #0E0E10; }
.d15-check-cap { font-size: clamp(9.5px, 1.4vw, 11.5px); font-weight: 700; color: #5A5A60; text-transform: uppercase; letter-spacing: .4px; }
/* --- TESKARI YO'L (s2) --- */
/* --- QOIDA KARTASI (s4) --- */
.d15-rulelines { display: flex; flex-direction: column; gap: 5px; }
.d15-ruleline { font-size: clamp(12.5px, 1.9vw, 15px); font-weight: 700; color: #0E0E10; }
.d15-ruleex { align-self: flex-start; margin-top: 2px; padding: 3px 10px; border-radius: 999px;
  background: #FFE8E1; color: #FF4F28; font-size: clamp(12px, 1.9vw, 15px); font-weight: 800; }
/* --- TEKSHIRISH PANELLARI (s6) --- */
/* --- BONUS: iks harfi (s10) --- */
/* --- FACTCARD: tovush to'lqini borib qaytadi --- */
@keyframes d15wave {
  0%, 100% { opacity: 0; transform: translateX(0); }
  35% { opacity: 1; transform: translateX(18px); }
  70% { opacity: .5; transform: translateX(0); }
}
@media (prefers-reduced-motion: reduce) {
  .d15-cart-go, .d15-wave, .d15-count-tick { animation: none; }
}
/* ============================================================
   DARS16 — bog' vazifasi: 1-darsning konsoli, darslik jadvali, merka-polosalar.
   ============================================================ */
/* --- KONSOL (1-darsdan ko'chirilgan uslub; bu yerda ikki yacheyka) --- */
@keyframes lm-cons-pop { from { transform: scale(0.6); opacity: 0; } to { transform: none; opacity: 1; } }
/* --- MERKA: bir qatorda lampalar --- */
/* --- XUK: ikki gulzor paneli --- */
/* --- DARSLIK JADVALI (26-bet): uch ustun, shapka tepada --- */
/* --- MERKA-POLOSALAR (necha marta ko'p) --- */
/* --- s3, s5, s10, s12 mayda matnlar --- */
/* --- sahna o'lchami: budjet donor bilan bir xil (etalon 629x330 @1440x900) --- */
/* --- FACTCARD: yuk ko'tarilishi --- */
@keyframes d16lift { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
@media (prefers-reduced-motion: reduce) { .d16-load { animation: none; } }
/* ============================================================
   DARS17 — saralash zali: qatorlar massivi, sonlar o'qi, ikki tokcha.
   ============================================================ */
/* --- XUK: 12 lampa uyumi --- */
/* --- QATORLAR MASSIVI (ArrayViz) --- */
/* --- BO'LUVCHILAR RO'YXATI --- */
/* --- IKKI TOKCHA (1-darsning lm-bin mexanikasi) --- */
/* --- sahna o'lchami: budjet donor bilan bir xil (etalon 629x330 @1440x900) --- */
/* --- FACTCARD: soat teng bo'laklarga bo'linadi --- */
@keyframes d17slice { 0%, 45%, 100% { opacity: 0; } 15%, 30% { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .d17-slice { animation: none; opacity: .6; } }
/* ============================================================
   DARS19 — ustaxona: modul detallari, konsol, jadval, svyortka.
   ============================================================ */
/* --- XUK: buyurtma qatori (4 modul-plastinka) --- */
/* --- MODUL QISMLARI (s1) --- */
/* --- YIG'ISH STOLI GURUHLARI (s2-s3) --- */
/* --- IFODA SATRLARI --- */
/* --- KONSOL (1-dars uslubi, 15-darsdan ko'chirilgan CSS) --- */
.lm-console { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(8px, 2vw, 14px); width: 100%; max-width: 440px; }
.lm-cons { display: flex; flex-direction: column; align-items: center; gap: clamp(5px, 1.2vw, 8px); padding: clamp(9px, 2vw, 14px) 4px; border-radius: 16px; background: #FBF7F0; box-shadow: inset 0 0 0 1px rgba(58,53,48,0.07); transition: box-shadow 0.28s, background 0.28s; }
.lm-cons-lit { background: #FFF6E9; box-shadow: 0 5px 16px -9px rgba(255,154,46,0.75), inset 0 0 0 1.5px rgba(255,154,46,0.5); }
.lm-cons-head { font-size: clamp(9px, 1.5vw, 11px); font-weight: 800; color: #8A8378; text-transform: uppercase; letter-spacing: 0.4px; text-align: center; }
.lm-cons-screen { display: flex; align-items: center; justify-content: center; gap: clamp(4px, 1.2vw, 8px); min-height: clamp(32px, 7vw, 44px); }
.lm-cons-x { font-size: clamp(16px, 3.4vw, 23px); font-weight: 800; color: #3A3530; display: inline-block; }
.lm-cons-val { font-family: 'JetBrains Mono', monospace; font-size: clamp(16px, 3.2vw, 22px); font-weight: 800; color: #FF4F28; }
.d16-plate { font-size: clamp(14px, 2.8vw, 20px); font-weight: 800; color: #0E0E10; padding: 2px 8px;
  border-radius: 9px; background: rgba(255,236,200,.55); box-shadow: inset 0 0 0 1px rgba(190,150,90,.28); }
.d16-row { display: inline-flex; gap: clamp(1px, 0.5vw, 3px); padding: clamp(3px, 0.8vw, 5px) clamp(4px, 1vw, 6px);
  border-radius: 8px; background: rgba(255,236,200,.55); box-shadow: inset 0 0 0 1px rgba(190,150,90,.28); }
.d16-row-lamp { display: inline-flex; width: clamp(9px, 2.2vw, 14px); height: clamp(9px, 2.2vw, 14px); }
.d16-row-lamp svg { width: 100%; height: 100%; }
/* --- DARSLIK JADVALI (15-darsdan ko'chirilgan CSS) --- */
.d16-tbl { width: 100%; max-width: 420px; border: 2px solid #C9B79A; border-radius: 10px; overflow: hidden; background: #FFFFFF; }
.d16-tbl-row { display: grid; grid-template-columns: repeat(3, 1fr); }
.d16-tbl-head { background: #F3E7CE; border-bottom: 2px solid #C9B79A; }
.d16-tbl-cell { padding: clamp(5px, 1.2vw, 8px) clamp(3px, 1vw, 6px); text-align: center; font-size: clamp(10px, 1.6vw, 12.5px);
  font-weight: 700; color: #5A5A60; border-right: 1px solid #DCCDB0; display: flex; align-items: center; justify-content: center; }
.d16-tbl-row .d16-tbl-cell:last-child { border-right: none; }
.d16-tbl-val { font-size: clamp(17px, 3.6vw, 24px); font-weight: 800; color: #0E0E10; min-height: clamp(34px, 8vw, 46px); }
.d16-tbl-hot { color: #FF4F28; background: #FFF4EF; }
/* --- IFODA SVYORTKASI (13-darsdan ko'chirilgan CSS) --- */
.d14-expr { display: flex; align-items: center; justify-content: center; gap: clamp(6px, 1.4vw, 11px); flex-wrap: wrap; min-height: clamp(34px, 7vw, 48px); }
.d14-tok { font-size: clamp(22px, 4.8vw, 32px); font-weight: 800; color: #3A3530; padding: 2px 6px; border-radius: 8px; transition: background 0.25s ease, color 0.25s ease; }
.d14-tok-hot { background: rgba(255,79,40,0.16); color: #FF4F28; box-shadow: inset 0 0 0 1.5px rgba(255,79,40,0.45); }
.d14-tok-fresh { background: rgba(31,122,77,0.14); color: #1F7A4D; box-shadow: inset 0 0 0 1.5px rgba(31,122,77,0.4); }
.d14-tok-big { font-size: clamp(28px, 6vw, 42px); color: #1F7A4D; }
/* --- sahna o'lchami: budjet donor bilan bir xil (etalon 629x330 @1440x900) --- */
/* --- FACTCARD: ikkilantirish zanjiri navbat bilan yonadi --- */
@keyframes d19slice { 0%, 8% { opacity: 0.25; } 28%, 100% { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .d19-slice { animation: none; opacity: 1; } }

/* ============================================================
   DARS18 — taqsimot rafi: detallar, tokchalar, saralash.
   ============================================================ */

/* --- XUK: buyurtma yorlig'i --- */

/* --- DETALLAR --- */

/* --- TOKCHALAR (qismni tengdan tarqatish) --- */

/* --- IFODA SATRLARI --- */

/* --- TOKCHAGA SARALASH (16-darsdan ko'chirilgan mexanika, chip kengroq) --- */
.lm-digtray { display: flex; gap: 10px; justify-content: center; min-height: clamp(44px, 10vw, 58px); align-items: center; }
.lm-digtray-empty { font-size: clamp(15px, 3.2vw, 21px); font-weight: 800; color: #C4BEB4; letter-spacing: 1px; }
.lm-digchip { display: inline-flex; align-items: center; justify-content: center; min-width: clamp(76px, 17vw, 104px); height: clamp(42px, 9vw, 56px); border: none; border-radius: 12px; background: #FFFFFF;
  font-size: clamp(15px, 3.2vw, 22px); font-weight: 800; color: #3A3530; cursor: pointer; padding: 0 10px;
  box-shadow: 0 3px 10px -4px rgba(58,53,48,0.35); transition: transform 0.12s; }
.lm-digchip-sel { background: #FFF3E9; color: #FF4F28; transform: translateY(-3px); box-shadow: 0 6px 16px -5px rgba(255,79,40,0.55); }
.lm-bin { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: clamp(10px, 2vw, 16px) 6px; border: none;
  border-radius: 14px; background: #FBF7F0; cursor: pointer; box-shadow: inset 0 0 0 1px rgba(58,53,48,0.07); transition: box-shadow 0.2s; }
.lm-bin-open { box-shadow: 0 4px 14px -6px rgba(255,79,40,0.4), inset 0 0 0 1.5px rgba(255,79,40,0.4); }
.lm-bin-full { background: #E3F0E8; box-shadow: inset 0 0 0 1.5px rgba(31,122,77,0.35); }
.lm-bin-head { font-size: clamp(9px, 1.5vw, 11px); font-weight: 800; color: #8A8378; text-transform: uppercase; letter-spacing: 0.4px; text-align: center; }
.lm-bin-slot { min-width: clamp(60px, 13vw, 84px); height: clamp(34px, 7vw, 44px); display: flex; align-items: center; justify-content: center;
  border-radius: 10px; background: #FFFFFF; font-size: clamp(14px, 3vw, 20px); font-weight: 800; color: #3A3530;
  box-shadow: inset 0 0 0 1px rgba(58,53,48,0.06); }
.lm-bin:disabled { cursor: default; }

/* --- sahna o'lchami: budjet donor bilan bir xil (etalon 629x330 @1440x900) --- */

/* --- FACTCARD: uch xil ajratish navbat bilan yonadi --- */
@keyframes d18split { 0%, 6% { opacity: 0.25; } 24%, 100% { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .d18-split { animation: none; opacity: 1; } }

/* ============================================================
   DARS19 — teng ulash stoli: tarqatish, ortiqcha lagani, qoldiq.
   ============================================================ */

/* --- XUK: buyurtma --- */

/* --- TARQATISH DOSKASI --- */

/* --- IFODA SATRLARI --- */


/* --- YOPIQ MAYDON (Bit tuzog'i) --- */

/* --- sahna o'lchami: budjet donor bilan bir xil (etalon 629x330 @1440x900) --- */

/* --- FACTCARD: hafta strelkasi --- */
@keyframes d19arc { 0%, 10% { transform: rotate(0deg); } 55%, 100% { transform: rotate(308deg); } }
@media (prefers-reduced-motion: reduce) { .d19-arc { animation: none; } }

/* ============================================================
   DARS20 — nazorat terminali: tekshiruv juftliklari, moslik.
   ============================================================ */


/* --- TEKSHIRUV JUFTLIGI --- */

/* --- IFODA SATRLARI --- */

/* --- sahna o'lchami: budjet donor bilan bir xil (etalon 629x330 @1440x900) --- */

/* --- FACTCARD: skaner chizig'i --- */
@keyframes d20scan { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(132px); } }

/* ============================================================
   DARS21 — ustun terminali: yozuv, o'tkazish, qadamlar.
   ============================================================ */


/* --- USTUN (13-darsdan ko'chirilgan CSS) --- */
.d14-col { display: inline-flex; flex-direction: column; align-items: flex-start; gap: 0; background: #FFF8EF; border-radius: 12px;
  padding: clamp(8px, 1.8vw, 13px) clamp(12px, 2.4vw, 18px); box-shadow: inset 0 0 0 1.5px rgba(190,150,90,.3); }
.d14-colr { white-space: pre; text-align: left; font-family: 'JetBrains Mono', monospace; font-size: clamp(17px, 3.6vw, 25px);
  font-weight: 800; color: #3A3530; line-height: 1.25; }
.d14-col-slot { color: #8A8378; }
.d14-col-sign { color: #8A8378; }
.d14-col-hot { color: #1F7A4D; }
.d14-colr-carry { position: relative; height: clamp(11px, 2.1vw, 15px); font-family: 'JetBrains Mono', monospace; font-size: clamp(17px, 3.6vw, 25px); }
.d14-carry { position: absolute; top: 0; transform: translateX(-50%); font-family: 'JetBrains Mono', monospace;
  font-size: clamp(10px, 2vw, 14px); font-weight: 800; color: #FF4F28; }
.d14-col-rule { height: 2.3px; background: #3A3530; border-radius: 2px; margin: 3px 0; font-family: 'JetBrains Mono', monospace; font-size: clamp(17px, 3.6vw, 25px); }

/* --- sahna o'lchami: budjet donor bilan bir xil (etalon 629x330 @1440x900) --- */

/* --- FACTCARD: qadamlar navbat bilan yonadi --- */
@keyframes d21step { 0%, 10% { opacity: 0.3; } 30%, 100% { opacity: 1; } }

/* ============================================================
   DARS22 — katta modul: katak to'r, ikki bo'lak, qismlar.
   ============================================================ */

.d34-order { display: inline-flex; gap: clamp(6px, 1.6vw, 12px); align-items: center; padding: clamp(4px, 1vw, 7px) clamp(8px, 1.8vw, 12px);
  border-radius: 10px; background: rgba(255,236,200,.5); box-shadow: inset 0 0 0 1px rgba(190,150,90,.26); }
.d34-order-plate { font-size: clamp(15px, 3vw, 21px); font-weight: 800; color: #3A3530; padding: 3px 10px;
  border-radius: 8px; background: #FFFFFF; box-shadow: 0 2px 8px -4px rgba(58,53,48,0.35); }
.d34-note { font-size: clamp(9.5px, 1.5vw, 12px); font-weight: 700; color: #5A5A60; text-align: center; }
.d34-expr { font-size: clamp(15px, 3vw, 22px); font-weight: 800; color: #3A3530; }
.d34-final { font-size: clamp(18px, 3.6vw, 26px); font-weight: 800; color: #1F7A4D; }
.d34-bad { font-size: clamp(14px, 2.8vw, 20px); font-weight: 800; color: #C0392B; }
.d34-errline { font-size: clamp(13px, 2.5vw, 19px); font-weight: 800; color: #C0392B; padding: 3px 12px;
  border-radius: 9px; background: rgba(192,57,43,.08); box-shadow: inset 0 0 0 1px rgba(192,57,43,.3); text-align: center; }
.d34-steplabel { font-size: clamp(13px, 2.4vw, 18px); font-weight: 800; color: #3A3530; text-align: center; }
.d34-res { font-size: clamp(19px, 3.8vw, 26px); font-weight: 800; color: #1F7A4D; }
.d34-plate { font-size: clamp(19px, 4vw, 28px); font-weight: 800; color: #0E0E10; padding: 4px 14px;
  border-radius: 12px; background: rgba(255,236,200,.55); box-shadow: inset 0 0 0 1px rgba(190,150,90,.28); }
.d34-trap { display: flex; gap: 10px; justify-content: center; }
.d34-bins { display: grid; grid-template-columns: repeat(2, minmax(120px, 1fr)); gap: clamp(8px, 2vw, 16px); width: 100%; max-width: 460px; }

/* --- KATAK TO'R --- */
.d34-grid { display: inline-flex; align-items: flex-start; gap: clamp(5px, 1.2vw, 9px);
  padding: clamp(5px, 1.2vw, 8px); border-radius: 10px; background: rgba(255,236,200,.45);
  box-shadow: inset 0 0 0 1px rgba(190,150,90,.26); }
.d34-grid-part { display: inline-flex; flex-direction: column; gap: 2px; }
.d34-grid-row { display: inline-flex; gap: 2px; }
.d34-cell { display: inline-block; width: clamp(6px, 1.5vw, 10px); height: clamp(6px, 1.5vw, 10px); border-radius: 2px; }
.d34-cell-a { background: #F2A85C; box-shadow: inset 0 0 0 0.5px #C97F35; }
.d34-cell-b { background: #6FD0E4; box-shadow: inset 0 0 0 0.5px #3E8FA8; }
.d34-gridrow { display: flex; flex-wrap: wrap; justify-content: center; align-items: flex-start; gap: clamp(6px, 1.6vw, 12px); }
.d34-gridcap { display: flex; flex-direction: column; align-items: center; gap: 3px; }

/* --- sahna o'lchami: budjet donor bilan bir xil (etalon 629x330 @1440x900) --- */
.d34-hook-scene .lm-scene { width: min(100%, calc(clamp(180px, calc(100dvh - 570px), 372px) * 400 / 210)); }
.d34-final-scene .lm-scene { width: min(100%, calc(clamp(200px, calc(100dvh - 560px), 372px) * 400 / 210)); }

/* --- FACTCARD: zinapoya --- */
.d34-stair { animation: d22stair 3.6s ease-in-out infinite; }
@keyframes d22stair { 0%, 12% { opacity: 0.3; } 34%, 100% { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .d34-stair { animation: none; opacity: 1; } }

.d34-boxwrap { display: flex; flex-direction: column; align-items: center; gap: clamp(6px, 1.4vw, 10px); }
.d34-boxrow { display: grid; grid-template-columns: repeat(6, auto); gap: clamp(4px, 1vw, 7px); justify-content: center; }
.d34-box { width: clamp(20px, 3.4vw, 27px); height: clamp(17px, 2.9vw, 23px); border-radius: 3px;
  background: #EFE6D6; border: 1.5px solid #D8CDB8; opacity: 0.5; transition: none; }
.d34-box-on { background: linear-gradient(180deg, #FFCB8E 0 26%, #F2A85C 26% 100%); border-color: #C97F35;
  opacity: 1; animation: d23pop 0.32s ease-out both; }
@keyframes d23pop { 0% { transform: scale(0.7); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
.d34-rest { display: inline-flex; gap: clamp(4px, 1vw, 7px); align-items: center; padding: clamp(4px, 1vw, 7px) clamp(8px, 1.8vw, 13px);
  border-radius: 999px; background: #FDECE7; border: 1.5px dashed #E0563A; }
.d34-kg { width: clamp(11px, 1.9vw, 15px); height: clamp(11px, 1.9vw, 15px); border-radius: 50%;
  background: #E0563A; border: 1.2px solid #B33F27; }

.d34-fig { display: block; margin: 0 auto; }
.d34-figrow { display: flex; align-items: center; justify-content: center; gap: clamp(10px, 2.4vw, 18px); flex-wrap: wrap; }
.d34-frac { display: inline-flex; flex-direction: column; align-items: center; line-height: 1.05;
  font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(20px, 3.4vw, 27px); }
.d34-frac-top { color: #2E7E9E; }
.d34-frac-bar { display: block; width: clamp(24px, 4vw, 32px); height: 2.4px; background: #5D5A52; margin: 3px 0; border-radius: 2px; }
.d34-frac-bot { color: #C97F35; }
.d34-fracname { font-family: 'JetBrains Mono', monospace; font-size: clamp(10px, 1.6vw, 12px); font-weight: 800; letter-spacing: 0.4px; }

/* Yangi uslub yo'q: hamma qoida 24-darsdan ko'chib keldi va nomi almashtirildi. */

.d34-pair { display: inline-flex; align-items: center; justify-content: center; gap: clamp(8px, 2vw, 16px); flex-wrap: nowrap; }
.d34-pair-one { display: inline-flex; flex-direction: column; align-items: center; gap: 4px; }
.d34-pair-cap { font-size: clamp(13px, 2.2vw, 17px); font-weight: 800; color: #5D5A52; }
.d34-pair-sign { font-size: clamp(20px, 3.6vw, 28px); font-weight: 800; color: #C97F35; min-width: clamp(18px, 3vw, 26px); text-align: center; }

/* Yangi uslub yo'q: hamma qoida oldingi darsdan ko'chib keldi va nomi almashtirildi. */

/* Yangi uslub yo'q: juftlik uslublari oldingi darsdan ko'chib keldi. */

/* Yangi uslub yo'q: juftlik uslublari oldingi darsdan ko'chib keldi. */

/* Yangi uslub yo'q: juftlik uslublari oldingi darsdan ko'chib keldi. */

/* Yangi uslub yo'q: juftlik uslublari oldingi darsdan ko'chib keldi. */

/* Yangi uslub yo'q: juftlik uslublari oldingi darsdan ko'chib keldi. */

/* Yangi uslub yo'q: figuralar kitdan keladi va CSS ga bog'liq emas. */

/* Yangi uslub yo'q: figuralar kitdan keladi va CSS ga bog'liq emas. */
`;
