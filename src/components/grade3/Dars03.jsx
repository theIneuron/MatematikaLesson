import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { BackLabel, BigNum, BitSVG, Chiroq, Confetti, D2Defs, D2Motes, FREE_NAV, FeedbackBlock, FrameFx, GradientDefs, HeroContext, LUMO_CAST, LangContext, Lenta, NavBack, NavNext, NextLabel, Panel, ProgressContext, Reaction, ReadinessMeter, Stage, StageHero, T, ZuhraSVG, configureLesson, getAudioEngine, npKey, shuffleArr, ttsConfig, useAdvanceGate, useAudio, useCanAnswer, useLang, useMobileZoom, usePrefersReducedMotion, useRevealScroll, useSfx, useT, makeBrgSeg } from './_kit/index.jsx';
import { BASE_STYLES } from './_kit/styles.js';

// ============================================================================
// DD 3-SINF | Dars03 — "Razryad qo'shiluvchilari" (num-3-03) | B1 | son <-> yoyilma
// Syujet: Bit sayyorasi LUMO, razryad paneli (SYUJET_3SINF.md B1 d.3). Son razryad
//   qo'shiluvchilariga ajraladi (345 = 300 + 40 + 5) va qaytadan yig'iladi. Bit — mezbon-gid.
// Infra: grade3 Dars01.jsx (etalon nomzodi) dan BAYT-ANIQ ko'chirildi. O'zgarmadi.
// YADRO: son = yuzlik qiymati + o'nlik qiymati + birlik qiymati; bo'sh xona qo'shiluvchi bermaydi.
// MEXANIKA: recall qiymat (s1), ajratish 345 (s2), ishlangan misollar (s3), yig'ish teskari (s4),
//   nol yoyilmada (s5), QOIDA (s6), ajratish MC (s7), yig'ish NumPad (s8), nol MC (s9),
//   xatoni top (s10), panel yozuvi masala (s11), final panel (s12), yakun (s13).
// Misconception: M1 raqam qiymati emas yuzi (462->4+6+2), M2 nol xona ortiqcha (305->300+50),
//   M3 teskari yig'ishda xato, M4 xona qiymatini adashtirish (40 vs 4).
//
// FREE_NAV=true (blokirovka o'chiq — push oldidan false ga qaytariladi).
// ============================================================






   // TEST/EDIT — blokirovka o'chiq (erkin navigatsiya). PUSH oldidan false ga qaytaring!














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
const TOTAL_SCREENS = 14;
const LESSON_META = {
  lessonId: 'num-3-03',
  lessonTitle: { ru: 'Урок 3. Разрядные слагаемые', uz: "3-dars. Razryad qo'shiluvchilari" }
};
// STRUKTURA (14 ekran): s0 hook · s1–s5 kashfiyot · s6 qoida · s7–s10 mashq · s11 masala · s12 final · s13 xulosa.
// Grade2 Dars01 etaloni yoyi, yuzlik qo'shilgan (uch pog'onali razryad). Syujet: Bit sayyorasi Lumo (SYUJET_3SINF.md Б1 d.1).
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'MCScreen', scored: false, scope: 'hook' },
  { id: 's1',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's4',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's5',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's6',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's7',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's8',  type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's9',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's10', type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's11', type: 'case',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's12', type: 'test',        template: 'custom',   scored: true,  scope: 'final' },
  { id: 's13', type: 'summary',     template: 'custom',   scored: false, scope: 'final' }
];





// ============================================================
// CONTENT — 3-sinf Dars03 «Razryad qo'shiluvchilari» (num-3-03). RU + UZ to'liq.
// Audio TTS-toza: sonlar so'z bilan, «» va matematik belgilar yo'q, bir segment = bir fikr.
// Rekvizit: razryad paneli · yoyilma (300 + 40 + 5). Lumo shahri, Bit sayyorasi.
// ============================================================

const CONTENT = {
  // s0 — HOOK: razryad paneli, 352 dagi 5 raqami qiymati (o'rin qiymati seed)
  s0: {
    eyebrow: { ru: 'Миссия', uz: 'Missiya' },
    topic: { ru: 'Тема: разрядные слагаемые', uz: "Mavzu: razryad qo'shiluvchilari" },
    lead: { ru: 'Разрядная панель показывает число 352.', uz: 'Razryad paneli 352 sonini ko\'rsatadi.' },
    num_display: { ru: '352', uz: '352' },
    q: { ru: 'Сколько значит цифра 5 в этом числе?', uz: 'Bu sonda 5 raqami qancha degani?' },
    opt0: { ru: '5', uz: '5' },
    opt1: { ru: '50', uz: '50' },
    opt2: { ru: '500', uz: '500' },
    audio: {
      intro: {
        ru: [
          'Тема урока — разрядные слагаемые. Научимся раскладывать число на части по разрядам.',
          'В прошлой области мы читали числа. Теперь Бит привёл нас к разрядной панели.',
          'На панели число триста пятьдесят два. Смотри на среднюю цифру, это пять.',
          'Как думаешь, сколько значит эта пятёрка в числе? Выбери один вариант.'
        ],
        uz: [
          "Dars mavzusi — razryad qo'shiluvchilari. Sonni xonalar bo'yicha qismlarga ajratishni o'rganamiz.",
          "O'tgan hududda sonlarni o'qidik. Endi Bit bizni razryad paneliga olib keldi.",
          "Panelda uch yuz ellik ikki soni. O'rtadagi raqamga qarang, bu besh.",
          "Sizningcha, bu beshlik sonda qancha degani? Bittasini tanlang."
        ]
      },
      on_correct: { ru: 'Верно. Пятёрка стоит в десятках, значит она значит пятьдесят.', uz: "To'g'ri. Beshlik o'nlikda turadi, demak u ellik degani." },
      on_wrong: { ru: 'Смотри на место. Пятёрка в десятках — это пятьдесят, не пять.', uz: "O'rniga qarang. Beshlik o'nlikda, bu ellik, besh emas." }
    }
  },

  // s1 — RECALL: har xonaning o'z QIYMATI (3->300, 4->40, 5->5)
  s1: {
    eyebrow: { ru: 'Вспомним и откроем', uz: 'Eslaymiz va ochamiz' },
    lead: { ru: 'У каждой цифры — своё значение по месту.', uz: "Har raqamning o'rniga qarab qiymati bor." },
    hundreds_label: { ru: 'сотни', uz: 'yuzliklar' },
    tens_label: { ru: 'десятки', uz: "o'nliklar" },
    ones_label: { ru: 'единицы', uz: 'birliklar' },
    vals: [
      { dig: '3', val: '300', ru: 'триста', uz: 'uch yuz' },
      { dig: '4', val: '40', ru: 'сорок', uz: 'qirq' },
      { dig: '5', val: '5', ru: 'пять', uz: 'besh' }
    ],
    audio: {
      ru: [
        'Возьмём число триста сорок пять. Каждая цифра стоит на своём месте.',
        'Тройка стоит в сотнях, её значение триста. Четвёрка в десятках, её значение сорок.',
        'Пятёрка в единицах, её значение пять. У каждой цифры своё значение по месту.'
      ],
      uz: [
        "Uch yuz qirq besh sonini olamiz. Har raqam o'z o'rnida turadi.",
        "Uchlik yuzlikda turadi, qiymati uch yuz. To'rtlik o'nlikda, qiymati qirq.",
        "Beshlik birlikda turadi, qiymati besh. Har raqamning o'rniga qarab qiymati bor."
      ]
    }
  },

  // s2 — AJRATISH: 345 -> 300 + 40 + 5
  s2: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: { ru: 'Разложим число на разрядные слагаемые.', uz: "Sonni razryad qo'shiluvchilariga ajratamiz." },
    num: { ru: '345', uz: '345' },
    parts: ['300', '40', '5'],
    done_text: { ru: 'Триста сорок пять — это триста плюс сорок плюс пять.', uz: "Uch yuz qirq besh — bu uch yuz, qirq va besh." },
    audio: {
      ru: [
        'Разложим число триста сорок пять на части. Каждая часть это значение одного разряда.',
        'Сотни дают триста. Десятки дают сорок. Единицы дают пять.',
        'Собрали разрядные слагаемые. Триста, сорок и пять. Это и есть число триста сорок пять.'
      ],
      uz: [
        "Uch yuz qirq besh sonini qismlarga ajratamiz. Har qism bitta xonaning qiymati.",
        "Yuzliklar uch yuzni beradi. O'nliklar qirqni beradi. Birliklar beshni beradi.",
        "Razryad qo'shiluvchilarini yig'dik. Uch yuz, qirq va besh. Bu uch yuz qirq besh sonining o'zi."
      ]
    }
  },

  // s3 — ISHLANGAN MISOLLAR (uchta yoyilma)
  s3: {
    eyebrow: { ru: 'Ещё примеры', uz: 'Yana misollar' },
    lead: { ru: 'Так раскладывается любое число.', uz: "Har qanday son shunday ajraladi." },
    examples: [
      { n: '528', h: '500', t: '20', o: '8' },
      { n: '764', h: '700', t: '60', o: '4' },
      { n: '216', h: '200', t: '10', o: '6' }
    ],
    audio: {
      ru: [
        'Посмотрим ещё примеры. Так можно разложить любое число.',
        'Пятьсот двадцать восемь это пятьсот, двадцать и восемь. Семьсот шестьдесят четыре это семьсот, шестьдесят и четыре.',
        'Двести шестнадцать это двести, десять и шесть. Каждый раз сотни, десятки и единицы отдельно.'
      ],
      uz: [
        "Yana misollarni ko'ramiz. Har qanday sonni shunday ajratish mumkin.",
        "Besh yuz yigirma sakkiz bu besh yuz, yigirma va sakkiz. Yetti yuz oltmish to'rt bu yetti yuz, oltmish va to'rt.",
        "Ikki yuz o'n olti bu ikki yuz, o'n va olti. Har safar yuzlik, o'nlik va birlik alohida."
      ]
    }
  },

  // s4 — YIG'ISH (teskari): 300 + 40 + 5 -> 345
  s4: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: { ru: 'Теперь наоборот: соберём число из частей.', uz: 'Endi teskari: qismlardan sonni yig\'amiz.' },
    parts: ['300', '40', '5'],
    result: { ru: '345', uz: '345' },
    done_text: { ru: 'Триста плюс сорок плюс пять — вместе триста сорок пять.', uz: "Uch yuz, qirq va besh — birga uch yuz qirq besh." },
    audio: {
      ru: [
        'Теперь наоборот. У нас есть части: триста, сорок и пять. Соберём из них число.',
        'Триста ставим в сотни. Сорок в десятки. Пять в единицы.',
        'Части сложились в одно число. Триста сорок пять. Так части превращаются обратно в число.'
      ],
      uz: [
        "Endi teskari. Bizda qismlar bor: uch yuz, qirq va besh. Ulardan sonni yig'amiz.",
        "Uch yuzni yuzlikka qo'yamiz. Qirqni o'nlikka. Beshni birlikka.",
        "Qismlar bitta songa qo'shildi. Uch yuz qirq besh. Shunday qismlar qaytadan songa aylanadi."
      ]
    }
  },

  // s5 — NOL YOYILMADA: 305 -> 300 + 5 (bo'sh xona qo'shiluvchida yo'q)
  s5: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: { ru: 'Если разряд пустой — его слагаемого нет.', uz: "Xona bo'sh bo'lsa — uning qo'shiluvchisi yo'q." },
    num: { ru: '305', uz: '305' },
    parts: ['300', '5'],
    missing: { ru: 'десятков нет', uz: "o'nlik yo'q" },
    examples: [
      { n: '470', exp: '400 + 70' },
      { n: '508', exp: '500 + 8' },
      { n: '640', exp: '600 + 40' }
    ],
    done_text: { ru: 'В числе 305 десятков нет, поэтому в сумме только триста и пять.', uz: "305 sonida o'nlik yo'q, shuning uchun yig'indida faqat uch yuz va besh." },
    audio: {
      ru: [
        'Возьмём число триста пять. Разложим его на части.',
        'Сотни дают триста. Единицы дают пять. А десятков в этом числе нет, значит их слагаемого тоже нет.',
        'Получилось триста плюс пять. Пустой разряд слагаемого не даёт. Но в самой записи числа ноль остаётся.'
      ],
      uz: [
        "Uch yuz besh sonini olamiz. Uni qismlarga ajratamiz.",
        "Yuzliklar uch yuzni beradi. Birliklar beshni beradi. Bu sonda o'nlik yo'q, demak uning qo'shiluvchisi ham yo'q.",
        "Uch yuz va besh chiqdi. Bo'sh xona qo'shiluvchi bermaydi. Lekin sonning o'zida nol saqlanadi."
      ]
    }
  },

  // s6 — QOIDA
  s6: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    rule: { ru: 'Число равно сумме разрядных слагаемых: значение сотен плюс значение десятков плюс значение единиц.', uz: "Son razryad qo'shiluvchilari yig'indisiga teng: yuzlik qiymati, o'nlik qiymati va birlik qiymati." },
    num: { ru: '345', uz: '345' },
    exp: { ru: '300 + 40 + 5', uz: '300 + 40 + 5' },
    check_q: { ru: 'Сколько значит цифра десятков? Нажми верное значение.', uz: "O'nlik raqamining qiymati qancha? To'g'ri qiymatni bosing." },
    check_opts: ['300', '40', '5'],
    check_ci: 1,
    check_ok: { ru: 'Верно! Четвёрка в десятках значит сорок.', uz: "To'g'ri! O'nlikdagi to'rtlik qirq degani." },
    check_no: { ru: 'Это цифра десятков — её значение сорок.', uz: "Bu o'nlik raqami — uning qiymati qirq." },
    audio: {
      ru: [
        'Отлично, теперь запомним это как правило.',
        'Число равно сумме своих разрядных слагаемых. Берём значение сотен, значение десятков и значение единиц.',
        'Триста сорок пять это триста плюс сорок плюс пять. Не три плюс четыре плюс пять, а именно значения разрядов.',
        'Если разряд пустой, его слагаемого в сумме нет. А теперь сам. Нажми, сколько значит цифра десятков.'
      ],
      uz: [
        "Zo'r, endi buni qoida qilib eslab qolamiz.",
        "Son o'zining razryad qo'shiluvchilari yig'indisiga teng. Yuzlik qiymati, o'nlik qiymati va birlik qiymatini olamiz.",
        "Uch yuz qirq besh bu uch yuz, qirq va besh. Uch, to'rt, besh emas, aynan xonalar qiymati.",
        "Xona bo'sh bo'lsa, uning qo'shiluvchisi yig'indida yo'q. Endi o'zingiz. O'nlik raqamining qiymatini bosing."
      ]
    }
  },

  // s7 — MASHQ ajratish (son -> yoyilma, MC), 3 raund
  s7: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    q: { ru: 'Выбери верное разложение.', uz: "To'g'ri yoyilmani tanlang." },
    items: [
      {
        num: 462, ci: 0,
        opts: [
          { ru: '400 + 60 + 2', uz: '400 + 60 + 2' },
          { ru: '4 + 6 + 2', uz: '4 + 6 + 2' },
          { ru: '400 + 6 + 2', uz: '400 + 6 + 2' },
          { ru: '40 + 60 + 2', uz: '40 + 60 + 2' }
        ],
        hints: {
          1: { ru: 'Это значения цифр, а не сами цифры. Сотни дают четыреста, а не четыре.', uz: "Bu raqamlarning qiymati, raqamning o'zi emas. Yuzlik to'rt yuz beradi, to'rt emas." },
          2: { ru: 'Шестёрка в десятках значит шестьдесят, а не шесть.', uz: "Oltilik o'nlikda oltmish degani, olti emas." },
          3: { ru: 'Четвёрка в сотнях значит четыреста, а не сорок.', uz: "To'rtlik yuzlikda to'rt yuz degani, qirq emas." }
        }
      },
      {
        num: 813, ci: 0,
        opts: [
          { ru: '800 + 10 + 3', uz: '800 + 10 + 3' },
          { ru: '8 + 1 + 3', uz: '8 + 1 + 3' },
          { ru: '800 + 1 + 3', uz: '800 + 1 + 3' },
          { ru: '80 + 10 + 3', uz: '80 + 10 + 3' }
        ],
        hints: {
          1: { ru: 'Нужны значения по месту: восемьсот, десять и три.', uz: "O'ringa qarab qiymat kerak: sakkiz yuz, o'n va uch." },
          2: { ru: 'Единица в десятках значит десять, а не один.', uz: "Birlik o'nlikda o'n degani, bir emas." },
          3: { ru: 'Восьмёрка в сотнях значит восемьсот.', uz: "Sakkizlik yuzlikda sakkiz yuz degani." }
        }
      },
      {
        num: 275, ci: 0,
        opts: [
          { ru: '200 + 70 + 5', uz: '200 + 70 + 5' },
          { ru: '2 + 7 + 5', uz: '2 + 7 + 5' },
          { ru: '200 + 7 + 5', uz: '200 + 7 + 5' },
          { ru: '20 + 70 + 5', uz: '20 + 70 + 5' }
        ],
        hints: {
          1: { ru: 'Складываем значения разрядов, не цифры.', uz: "Xonalar qiymatini qo'shamiz, raqamlarni emas." },
          2: { ru: 'Семёрка в десятках значит семьдесят.', uz: "Yettilik o'nlikda yetmish degani." },
          3: { ru: 'Двойка в сотнях значит двести.', uz: "Ikkilik yuzlikda ikki yuz degani." }
        }
      }
    ],
    audio: {
      intro: { ru: 'Теперь раскладываешь сам. Выбери верное разложение числа. Три задания.', uz: "Endi o'zingiz ajratasiz. Sonning to'g'ri yoyilmasini tanlang. Uchta topshiriq." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Бери значение каждого разряда. Попробуй ещё.', uz: "Har xonaning qiymatini oling. Yana urinib ko'ring." }
    }
  },

  // s8 — MASHQ yig'ish (yoyilma -> son, NumPad), 3 raund
  s8: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    q: { ru: 'Собери число из слагаемых.', uz: "Qo'shiluvchilardan sonni yig'ing." },
    check_label: { ru: 'Проверить', uz: 'Tekshirish' },
    items: [
      { exp: '400 + 60 + 3', ans: 463, hint: { ru: 'Четыре сотни, шесть десятков, три единицы.', uz: "To'rt yuzlik, olti o'nlik, uch birlik." } },
      { exp: '500 + 20 + 9', ans: 529, hint: { ru: 'Пять сотен, два десятка, девять единиц.', uz: "Besh yuzlik, ikki o'nlik, to'qqiz birlik." } },
      { exp: '700 + 80', ans: 780, hint: { ru: 'Семь сотен, восемь десятков, единиц нет — в конце ноль.', uz: "Yetti yuzlik, sakkiz o'nlik, birlik yo'q — oxirida nol." } }
    ],
    audio: {
      intro: { ru: 'Теперь собираешь число из частей. Набери ответ и нажми проверить.', uz: "Endi qismlardan sonni yig'asiz. Javobni terib, tekshirishni bosing." },
      on_correct: { ru: 'Отлично. Собрано верно.', uz: "Zo'r. To'g'ri yig'dingiz." },
      on_wrong: { ru: 'Каждая часть в свой разряд. Попробуй ещё.', uz: "Har qism o'z xonasiga. Yana urinib ko'ring." }
    }
  },

  // s9 — MASHQ nol yoyilmada (son -> yoyilma, MC), 3 raund
  s9: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    q: { ru: 'Выбери верное разложение.', uz: "To'g'ri yoyilmani tanlang." },
    items: [
      {
        num: 305, ci: 0,
        opts: [
          { ru: '300 + 5', uz: '300 + 5' },
          { ru: '300 + 50', uz: '300 + 50' },
          { ru: '30 + 5', uz: '30 + 5' },
          { ru: '3 + 5', uz: '3 + 5' }
        ],
        hints: {
          1: { ru: 'Пятёрка в единицах — это пять, а не пятьдесят.', uz: "Beshlik birlikda — bu besh, ellik emas." },
          2: { ru: 'Тройка в сотнях значит триста, а не тридцать.', uz: "Uchlik yuzlikda uch yuz degani, o'ttiz emas." },
          3: { ru: 'Это значения разрядов: триста и пять.', uz: "Bu xonalar qiymati: uch yuz va besh." }
        }
      },
      {
        num: 640, ci: 0,
        opts: [
          { ru: '600 + 40', uz: '600 + 40' },
          { ru: '600 + 4', uz: '600 + 4' },
          { ru: '60 + 40', uz: '60 + 40' },
          { ru: '6 + 4', uz: '6 + 4' }
        ],
        hints: {
          1: { ru: 'Четвёрка в десятках значит сорок, а не четыре. Единиц нет.', uz: "To'rtlik o'nlikda qirq degani, to'rt emas. Birlik yo'q." },
          2: { ru: 'Шестёрка в сотнях значит шестьсот.', uz: "Oltilik yuzlikda olti yuz degani." },
          3: { ru: 'Бери значения по месту: шестьсот и сорок.', uz: "O'ringa qarab qiymat oling: olti yuz va qirq." }
        }
      },
      {
        num: 507, ci: 0,
        opts: [
          { ru: '500 + 7', uz: '500 + 7' },
          { ru: '500 + 70', uz: '500 + 70' },
          { ru: '50 + 7', uz: '50 + 7' },
          { ru: '5 + 7', uz: '5 + 7' }
        ],
        hints: {
          1: { ru: 'Семёрка в единицах — это семь, а не семьдесят. Десятков нет.', uz: "Yettilik birlikda — bu yetti, yetmish emas. O'nlik yo'q." },
          2: { ru: 'Пятёрка в сотнях значит пятьсот.', uz: "Beshlik yuzlikda besh yuz degani." },
          3: { ru: 'Бери значения разрядов: пятьсот и семь.', uz: "Xonalar qiymatini oling: besh yuz va yetti." }
        }
      }
    ],
    audio: {
      intro: { ru: 'В этих числах один разряд пустой. Его слагаемого нет. Три задания.', uz: "Bu sonlarda bitta xona bo'sh. Uning qo'shiluvchisi yo'q. Uchta topshiriq." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Пустой разряд слагаемого не даёт. Попробуй ещё.', uz: "Bo'sh xona qo'shiluvchi bermaydi. Yana urinib ko'ring." }
    }
  },

  // s10 — MASHQ xatoni top (son = yoyilma juftlari), 3 raund
  s10: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    q: { ru: 'Найди неверное разложение.', uz: "Noto'g'ri yoyilmani toping." },
    items: [
      {
        pairs: [
          { num: 246, exp: '200 + 4 + 6' },
          { num: 318, exp: '300 + 10 + 8' },
          { num: 505, exp: '500 + 5' }
        ],
        wrong: 0,
        hint: { ru: 'В числе 246 четвёрка в десятках, её значение сорок: 200 + 40 + 6, а не 200 + 4 + 6.', uz: "246 sonida to'rtlik o'nlikda, qiymati qirq: 200 + 40 + 6, 200 + 4 + 6 emas." }
      },
      {
        pairs: [
          { num: 729, exp: '700 + 20 + 9' },
          { num: 803, exp: '800 + 30' },
          { num: 470, exp: '400 + 70' }
        ],
        wrong: 1,
        hint: { ru: 'В числе 803 тройка стоит в единицах: 800 + 3, а не 800 + 30. Десятков нет.', uz: "803 sonida uchlik birlikda turadi: 800 + 3, 800 + 30 emas. O'nlik yo'q." }
      },
      {
        pairs: [
          { num: 560, exp: '500 + 60' },
          { num: 384, exp: '300 + 80 + 4' },
          { num: 490, exp: '400 + 9' }
        ],
        wrong: 2,
        hint: { ru: 'В числе 490 девятка в десятках: 400 + 90, а не 400 + 9.', uz: "490 sonida to'qqizlik o'nlikda: 400 + 90, 400 + 9 emas." }
      }
    ],
    audio: {
      intro: { ru: 'Даю три разложения. Одно неверное. Найди неверное разложение.', uz: "Uchta yoyilma beraman. Bittasi noto'g'ri. Noto'g'ri yoyilmani toping." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Сверь каждый разряд со значением. Посмотри ещё.', uz: "Har xonani qiymati bilan solishtiring. Yana qarang." }
    }
  },

  // s11 — MASALA (case): Zuhra yoyilma keltiradi -> NumPad
  s11: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    lead: { ru: 'Зухра принесла запись с разрядной панели.', uz: 'Zuhra razryad panelidan yozuv keltirdi.' },
    manifest_label: { ru: 'запись', uz: 'yozuv' },
    exp_display: { ru: '500 + 80 + 2', uz: '500 + 80 + 2' },
    q: { ru: 'Собери число и набери ответ.', uz: "Sonni yig'ib, javobni tering." },
    ans: 582,
    setup_audio: { ru: 'Зухра принесла запись с панели. Пятьсот плюс восемьдесят плюс два.', uz: "Zuhra paneldan yozuv keltirdi. Besh yuz, sakson va ikki." },
    audio: {
      intro: { ru: 'Собери из этих частей число и набери ответ. Потом нажми проверить.', uz: "Bu qismlardan sonni yig'ib, javobni tering. So'ng tekshirishni bosing." },
      on_correct: { ru: 'Верно. Пятьсот, восемьдесят и два — пятьсот восемьдесят два.', uz: "To'g'ri. Besh yuz, sakson va ikki — besh yuz sakson ikki." },
      on_wrong: { ru: 'Посмотри разбор. Каждая часть в свой разряд.', uz: "Tushuntirishga qarang. Har qism o'z xonasiga." }
    }
  },

  // s12 — FINAL panel (5 savol) + FactCard
  s12: {
    eyebrow: { ru: 'Финал', uz: 'Final' },
    intro_line: { ru: 'Городской компьютер проверит тебя. Пять заданий.', uz: "Shahar kompyuteri sizni tekshiradi. Beshta topshiriq." },
    items: [
      {
        kind: 'num', ans: 493,
        q: { ru: 'Собери число: 400 + 90 + 3.', uz: "Sonni yig'ing: 400 + 90 + 3." },
        hint: { ru: 'Четыре сотни, девять десятков, три единицы.', uz: "To'rt yuzlik, to'qqiz o'nlik, uch birlik." }
      },
      {
        kind: 'mc',
        q: { ru: 'Какое разложение у числа 648?', uz: "648 sonining yoyilmasi qanday?" },
        opt0: { ru: '600 + 40 + 8', uz: '600 + 40 + 8' },
        opt1: { ru: '6 + 4 + 8', uz: '6 + 4 + 8' },
        opt2: { ru: '600 + 4 + 8', uz: '600 + 4 + 8' },
        wrong_1: { ru: 'Это значения разрядов, а не цифры: шестьсот, сорок и восемь.', uz: "Bu xonalar qiymati, raqamlar emas: olti yuz, qirq va sakkiz." },
        wrong_2: { ru: 'Четвёрка в десятках значит сорок, а не четыре.', uz: "To'rtlik o'nlikda qirq degani, to'rt emas." }
      },
      {
        kind: 'num', ans: 760,
        q: { ru: 'Собери число: 700 + 60.', uz: "Sonni yig'ing: 700 + 60." },
        hint: { ru: 'Семь сотен, шесть десятков, единиц нет — ноль в конце.', uz: "Yetti yuzlik, olti o'nlik, birlik yo'q — oxirida nol." }
      },
      {
        kind: 'mc',
        q: { ru: 'Какое разложение у числа 805?', uz: "805 sonining yoyilmasi qanday?" },
        opt0: { ru: '800 + 5', uz: '800 + 5' },
        opt1: { ru: '800 + 50', uz: '800 + 50' },
        opt2: { ru: '80 + 5', uz: '80 + 5' },
        wrong_1: { ru: 'Пятёрка в единицах — это пять, а не пятьдесят. Десятков нет.', uz: "Beshlik birlikda — bu besh, ellik emas. O'nlik yo'q." },
        wrong_2: { ru: 'Восьмёрка в сотнях значит восемьсот.', uz: "Sakkizlik yuzlikda sakkiz yuz degani." }
      },
      {
        kind: 'num', ans: 530,
        q: { ru: 'Загадка. Сотен у меня пять, десятков три, единиц нет. Кто я?', uz: "Jumboq. Yuzligim besh, o'nligim uch, birligim yo'q. Men kimman?" },
        hint: { ru: 'Пятьсот плюс тридцать. Единиц нет — в конце ноль.', uz: "Besh yuz va o'ttiz. Birlik yo'q — oxirida nol." }
      }
    ],
    fact_badge: { ru: 'Знаешь?', uz: 'Bilasizmi?' },
    fact_text: { ru: 'Большинство звёзд нашей Галактики — красные карлики. Их так много, что они самые обычные звёзды во Вселенной.', uz: "Galaktikamizdagi yulduzlarning ko'pchiligi — qizil mitti yulduzlar. Ular shunchalik ko'pki, Koinotda eng oddiy yulduzlar." },
    fact_audio: { ru: 'Большинство звёзд нашей Галактики — красные карлики. Их так много, что они самые обычные звёзды во Вселенной.', uz: "Galaktikamizdagi yulduzlarning ko'pchiligi — qizil mitti yulduzlar. Ular shunchalik ko'pki, Koinotda eng oddiy yulduzlar." },
    audio: {
      intro: { ru: 'Финальная проверка. Городской компьютер показывает задания, отвечай на каждое.', uz: "Yakuniy tekshiruv. Shahar kompyuteri topshiriq ko'rsatadi, har biriga javob bering." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Посмотри разбор справа.', uz: "O'ngdagi tushuntirishga qarang." }
    }
  },

  // s13 — YAKUN
  s13: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    praise: { ru: 'Молодец!', uz: 'Barakalla!' },
    mission_done: { ru: 'Разрядная панель освоена!', uz: 'Razryad paneli egallandi!' },
    cando: { ru: 'Теперь ты раскладываешь число на разрядные слагаемые и собираешь обратно.', uz: "Endi siz sonni razryad qo'shiluvchilariga ajratasiz va qaytadan yig'asiz." },
    rule_recap: { ru: 'Число равно значению сотен плюс значению десятков плюс значению единиц. Пустой разряд слагаемого не даёт.', uz: "Son yuzlik qiymati, o'nlik qiymati va birlik qiymatiga teng. Bo'sh xona qo'shiluvchi bermaydi." },
    conn_label_refs: { ru: 'Опирается на', uz: 'Tayanadi' },
    conn_refs: { ru: 'второй урок: чтение и запись чисел', uz: "ikkinchi dars: sonlarni o'qish va yozish" },
    conn_label_next: { ru: 'Дальше', uz: 'Keyingi' },
    conn_next: { ru: 'Урок 4: сравнение трёхзначных чисел', uz: "4-dars: uch xonali sonlarni taqqoslash" },
    audio: {
      ru: 'Разрядная панель освоена. Мы научились раскладывать число на разрядные слагаемые и собирать его обратно. Запомни правило. Число равно значению сотен плюс значению десятков плюс значению единиц. А если разряд пустой, его слагаемого в сумме нет. В следующий раз научимся сравнивать трёхзначные числа.',
      uz: "Razryad paneli egallandi. Biz sonni razryad qo'shiluvchilariga ajratishni va uni qaytadan yig'ishni o'rgandik. Qoidani yodda tuting. Son yuzlik qiymati, o'nlik qiymati va birlik qiymatiga teng. Agar xona bo'sh bo'lsa, uning qo'shiluvchisi yig'indida yo'q. Keyingi safar uch xonali sonlarni taqqoslashni o'rganamiz."
    }
  }
};

// slaydlararo ko'priklar (audio-intro boshiga; ekranda ko'rinmaydi). TTS-toza.
const BRIDGES = {
  s1:  { ru: 'Вспомним значение цифр.', uz: 'Raqamlar qiymatini eslaymiz.' },
  s2:  { ru: 'Разложим число на части.', uz: 'Sonni qismlarga ajratamiz.' },
  s3:  { ru: 'Посмотрим ещё примеры.', uz: "Yana misollarni ko'ramiz." },
  s4:  { ru: 'А теперь соберём обратно.', uz: 'Endi qaytadan yig\'amiz.' },
  s5:  { ru: 'Внимание. Бывает пустой разряд.', uz: "Diqqat. Bo'sh xona bo'ladi." },
  s6:  { ru: 'Запишем это правилом.', uz: 'Buni qoida qilib olamiz.' },
  s7:  { ru: 'Правило знаем. Раскладывай сам.', uz: "Qoidani bilamiz. O'zingiz ajrating." },
  s8:  { ru: 'А теперь собирай число.', uz: 'Endi sonni yig\'ing.' },
  s9:  { ru: 'Один разряд будет пустым.', uz: "Bitta xona bo'sh bo'ladi." },
  s10: { ru: 'Проверим разложения на ошибку.', uz: 'Yoyilmalarni xatoga tekshiramiz.' },
  s11: { ru: 'Последняя запись с панели.', uz: 'Paneldan oxirgi yozuv.' },
  s12: { ru: 'Городской компьютер сделает финальную проверку.', uz: 'Shahar kompyuteri yakuniy tekshiradi.' },
  s13: { ru: 'Панель освоена. Идём дальше!', uz: 'Panel egallandi. Davom etamiz!' }
};

// s13 payoff (xulosadan oldin aytiladi)
const S13_PAYOFF = {
  ru: 'Миссия выполнена! Мы разобрали, как число делится на разрядные слагаемые, и Бит открыл разрядную панель города. Спасибо за помощь!',
  uz: "Missiya bajarildi! Biz son razryad qo'shiluvchilariga qanday bo'linishini ochdik, va Bit shaharning razryad panelini ochdi. Yordamingiz uchun rahmat!"
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
const HookScene = ({ gathered = false }) => {
  const kid = ({ key, El, hook }, i) => (
    <span key={key} className="lm-crew lm-crew-kid g1-pop-in" style={{ animationDelay: `${0.25 + i * 0.12}s` }}>
      <El {...(gathered ? { mood: 'happy', pose: 'happy' } : hook)}/>
    </span>
  );
  return (
    <div className="lm-scene">
      <RazryadPlazaBg/>
      <div className="lm-scene-cast">
        {LUMO_CAST.slice(0, 2).map(kid)}
        <span className={`lm-crew lm-crew-host ${gathered ? 'd2-bit-cheer' : 'lm-bob'}`}><span className="g1-cast-fig"><BitSVG state={gathered ? 'happy' : 'present'}/></span></span>
        {LUMO_CAST.slice(2).map((c, i) => kid(c, i + 2))}
      </div>
    </div>
  );
};




// ============================================================
// EKRANLAR — Dars03 «Razryad qo'shiluvchilari» (son <-> yoyilma)
// ============================================================

const RCOL = ['#C0392B', '#1F7A4D', T.blue]; // yuzlik / o'nlik / birlik ranglari



// --- RAZRYAD MAYDONI SAHNASI (D03): uch yorug' razryad-ustun (3 4 5)
const RazryadPlazaBg = () => (
  <svg className="lm-scene-bg" viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="shWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ECDBC4"/><stop offset="100%" stopColor="#DBC3A2"/></linearGradient>
      <linearGradient id="shSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#33284E"/><stop offset="46%" stopColor="#7C4A66"/><stop offset="82%" stopColor="#CE8A58"/><stop offset="100%" stopColor="#F0C088"/></linearGradient>
      <linearGradient id="shFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#D9C29D"/><stop offset="100%" stopColor="#BBA078"/></linearGradient>
      <radialGradient id="shSun" cx="50%" cy="50%" r="55%"><stop offset="0%" stopColor="#FFE6B0"/><stop offset="55%" stopColor="#F0985A"/><stop offset="100%" stopColor="#C0502E" stopOpacity="0"/></radialGradient>
      <linearGradient id="shPanel" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#20344C"/><stop offset="100%" stopColor="#0E1B2C"/></linearGradient>
      <radialGradient id="shLamp" cx="50%" cy="20%" r="80%"><stop offset="0%" stopColor="#FFF0C4"/><stop offset="100%" stopColor="#FFE39A" stopOpacity="0"/></radialGradient>
      <clipPath id="shWinClip"><rect x="46" y="32" width="308" height="62" rx="4"/></clipPath>
    </defs>
    <rect x="0" y="0" width="400" height="180" fill="url(#shWall)"/>
    <rect x="0" y="0" width="400" height="22" fill="#D2B892"/><rect x="0" y="21" width="400" height="3" fill="#B4976F"/>
    <g stroke="#C7AC82" strokeWidth="1" opacity="0.5"><path d="M60 24 V96"/><path d="M340 24 V96"/></g>
    {[90, 200, 310].map((cx, i) => (
      <g key={`lamp${i}`}>
        <rect x={cx - 18} y="4" width="36" height="6" rx="3" fill="#FFEBB0"/><rect x={cx - 18} y="4" width="36" height="2" rx="1" fill="#FFF6DA"/>
        <polygon points={`${cx - 20},11 ${cx + 20},11 ${cx + 46},96 ${cx - 46},96`} fill="url(#shLamp)" opacity="0.32"/>
        <ellipse className="lm-glow" style={{ animationDelay: `${i * 0.7}s` }} cx={cx} cy="12" rx="14" ry="4" fill="#FFF0C4" opacity="0.5"/>
      </g>
    ))}
    <rect x="42" y="28" width="316" height="70" rx="7" fill="#0D1928"/>
    <rect x="46" y="32" width="308" height="62" rx="4" fill="url(#shSky)"/>
    <g clipPath="url(#shWinClip)">
      <circle cx="78" cy="46" r="8" fill="#C79AD6"/><ellipse cx="78" cy="46" rx="14" ry="3.4" fill="none" stroke="#E6C8F0" strokeWidth="1.5" opacity="0.8"/>
      <circle cx="324" cy="46" r="13" fill="url(#shSun)"/><circle cx="324" cy="46" r="6" fill="#FFD89A"/>
      <g opacity="0.62">
        <rect x="70" y="72" width="16" height="22" rx="2" fill="#B98BA8"/><rect x="92" y="78" width="11" height="16" rx="2" fill="#A87E9C"/>
        <rect x="112" y="66" width="14" height="28" rx="2" fill="#C29AB4"/><rect x="176" y="70" width="15" height="24" rx="2" fill="#BE93B0"/>
        <rect x="256" y="68" width="14" height="26" rx="2" fill="#C29AB4"/><rect x="284" y="74" width="11" height="20" rx="2" fill="#AD82A0"/>
        <g fill="#FFE39A" opacity="0.85"><circle cx="77" cy="80" r="1.2"/><circle cx="118" cy="76" r="1.2"/><circle cx="183" cy="80" r="1.2"/><circle cx="262" cy="78" r="1.2"/></g>
      </g>
      <g className="lm-float"><ellipse cx="212" cy="52" rx="11" ry="4" fill="#5A6B88"/><ellipse cx="212" cy="49.6" rx="8" ry="2.6" fill="#8FA6C0"/><circle className="lm-glow" cx="206" cy="53" r="1.3" fill="#FFD0C2"/></g>
    </g>
    <g fill="none" stroke="#C9B79A" strokeWidth="3"><rect x="42" y="28" width="316" height="70" rx="7"/></g>
    <g stroke="#C9B79A" strokeWidth="2.4" opacity="0.9"><path d="M148 32 V94"/><path d="M256 32 V94"/><path d="M46 63 H354"/></g>
    <rect x="42" y="95" width="316" height="5" rx="2" fill="#B4976F"/>

    <rect x="98" y="104" width="204" height="48" rx="7" fill="url(#shPanel)" stroke="#3E6E90" strokeWidth="1.6"/>
    <rect x="104" y="108" width="192" height="10" rx="3" fill="#122236"/>
    <text x="200" y="115.5" textAnchor="middle" fontSize="7" letterSpacing="1.5" fill="#7FB8D8" fontFamily="'JetBrains Mono', monospace">YOYILMA</text>
    <text x="126" y="142" textAnchor="middle" fontSize="19" fontWeight="800" fill="#FFD86E" fontFamily="'JetBrains Mono', monospace">305</text>
    <text x="158" y="141" textAnchor="middle" fontSize="14" fill="#9FE0FF" fontFamily="'JetBrains Mono', monospace">=</text>
    <text x="190" y="142" textAnchor="middle" fontSize="15" fontWeight="800" fill="#F2A85C" fontFamily="'JetBrains Mono', monospace">300</text>
    <text x="214" y="141" textAnchor="middle" fontSize="13" fill="#8FA6B8" fontFamily="'JetBrains Mono', monospace">+</text>
    <text x="232" y="142" textAnchor="middle" fontSize="15" fontWeight="800" fill="#B7C2CC" fontFamily="'JetBrains Mono', monospace">0</text>
    <text x="252" y="141" textAnchor="middle" fontSize="13" fill="#8FA6B8" fontFamily="'JetBrains Mono', monospace">+</text>
    <text x="272" y="142" textAnchor="middle" fontSize="15" fontWeight="800" fill="#6FD0E4" fontFamily="'JetBrains Mono', monospace">5</text>
    <path d="M150 156 h100 l10 20 h-120 Z" fill="#C3A87E"/><rect x="146" y="174" width="108" height="4" fill="#A98C64"/>
    {/* chap: yuzlik bloklari (3x100) */}
    <g transform="translate(10 120)"><rect x="-2" y="-2" width="60" height="56" rx="4" fill="#C3A87E" opacity="0.5"/>
      {[0, 1, 2].map((k) => <g key={k} transform={`translate(${2 + k * 18} 4)`}><rect x="0" y="0" width="15" height="15" rx="1.5" fill="#8FD8B8" stroke="#5FA888" strokeWidth="0.8"/><g stroke="#5FA888" strokeWidth="0.4" opacity="0.6"><path d="M5 0V15M10 0V15M0 5H15M0 10H15"/></g></g>)}
      <text x="28" y="34" textAnchor="middle" fontSize="8" fontWeight="800" fill="#4E7E64" fontFamily="'JetBrains Mono', monospace">100</text>
      <text x="28" y="45" textAnchor="middle" fontSize="6" fill="#6B5636" fontFamily="'JetBrains Mono', monospace">YUZLIK</text>
    </g>
    {/* o'ng: birlik kublari (5x1) + bo'sh o'nlik slot */}
    <g transform="translate(330 120)"><rect x="-4" y="-2" width="62" height="56" rx="4" fill="#C3A87E" opacity="0.5"/>
      {[0, 1, 2, 3, 4].map((k) => <rect key={k} x={k % 3 * 12} y={Math.floor(k / 3) * 12} width="9" height="9" rx="1.5" fill="#6FD0E4" stroke="#3E8FA8" strokeWidth="0.7"/>)}
      <rect x="30" y="26" width="24" height="10" rx="2" fill="none" stroke="#8FA6B8" strokeWidth="1" strokeDasharray="2 2"/><text x="42" y="34" textAnchor="middle" fontSize="6" fill="#8FA6B8" fontFamily="'JetBrains Mono', monospace">0 o</text>
      <text x="26" y="52" textAnchor="middle" fontSize="6" fill="#6B5636" fontFamily="'JetBrains Mono', monospace">BIRLIK</text>
    </g>
    <rect x="0" y="176" width="400" height="54" fill="url(#shFloor)"/>
    <line x1="0" y1="176" x2="400" y2="176" stroke="#9A8058" strokeWidth="2"/>
    <g stroke="#A98C64" strokeWidth="1" opacity="0.4"><path d="M20 230 L176 178"/><path d="M120 230 L192 178"/><path d="M280 230 L208 178"/><path d="M380 230 L224 178"/></g>
    <g stroke="#A98C64" strokeWidth="0.8" opacity="0.28"><path d="M0 196 H400"/><path d="M0 212 H400"/></g>
    <g transform="translate(18 176)"><path d="M0 0 Q-3 -16 0 -24" stroke="#7CB69E" strokeWidth="2.6" fill="none"/><circle className="lm-glow" cx="0" cy="-27" r="5" fill="#A6E0C6"/><path d="M-1 -14 q-8 -3 -11 -10 q9 1 12 8Z" fill="#8FD8B8"/></g>
    <g transform="translate(392 176)"><path d="M0 0 Q-2 -10 0 -15" stroke="#7CB69E" strokeWidth="2.2" fill="none"/><circle className="lm-glow" cx="0" cy="-17" r="3.6" fill="#A6E0C6"/></g>
    <g><circle className="lm-glow" cx="120" cy="60" r="1.5" fill="#FFE0B0"/><circle className="lm-glow" style={{ animationDelay: '0.8s' }} cx="300" cy="70" r="1.5" fill="#CFE8FF"/><circle className="lm-glow" style={{ animationDelay: '1.4s' }} cx="250" cy="40" r="1.3" fill="#FFD0C2"/></g>
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
      <RazryadPlazaBg/>
      <div className="lm-scene-cast">
        {LUMO_CAST.slice(0, 2).map(kid)}
        <span className={`lm-crew lm-crew-host ${gathered ? 'd2-bit-cheer' : 'lm-bob'}`}><span className="g1-cast-fig"><BitSVG state={gathered ? 'happy' : 'present'}/></span></span>
        {LUMO_CAST.slice(2).map((c, i) => kid(c, i + 2))}
      </div>
    </div>
  );
};

// --- MINI-SHAHARCHA (final savol vizuali).
const MINI_HOUSES = [
  [10, 30, 34, '#F2B49A', '#DF8A6C', 'pitch'], [50, 24, 44, '#F5D592', '#E0AE5A', 'dome'],
  [80, 34, 26, '#BEA9E0', '#9A7CC6', 'pitch'], [120, 26, 40, '#A6D8C2', '#7CB69E', 'flat'],
  [152, 30, 30, '#F6BCC6', '#E489A2', 'dome'], [188, 26, 42, '#AECDEC', '#83A9D2', 'pitch'], [220, 30, 32, '#F3CB9E', '#DCA265', 'flat']
];
const MiniCity = () => (
  <svg viewBox="0 0 260 92" style={{ width: 'min(300px, 88%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <g>
      <circle cx="30" cy="16" r="8" fill="#C79AD6"/>
      <ellipse cx="30" cy="16" rx="13.5" ry="3" fill="none" stroke="#E6C8F0" strokeWidth="1.6" opacity="0.85"/>
    </g>
    <circle cx="228" cy="14" r="9" fill="#FFE39A" opacity="0.55"/>
    <circle cx="228" cy="14" r="5.5" fill="url(#lmSun)"/>
    <g className="lm-float"><path d="M120 14 L125 21 L120 28 L115 21 Z" fill="#7FE0D8" opacity="0.9"/></g>
    {MINI_HOUSES.map(([x, w, h, body, roof, type], i) => {
      const ty = 84 - h;
      return (
        <g key={i}>
          {type === 'pitch' && <path d={`M${x - 2} ${ty + 1} L${x + w / 2 - 4} ${ty - 8} Q${x + w / 2} ${ty - 12} ${x + w / 2 + 4} ${ty - 8} L${x + w + 2} ${ty + 1} Z`} fill={roof}/>}
          {type === 'dome' && <path d={`M${x} ${ty + 1} A ${w / 2} ${w / 2.4} 0 0 1 ${x + w} ${ty + 1} Z`} fill={roof}/>}
          {type === 'flat' && <rect x={x - 2} y={ty - 5} width={w + 4} height="7" rx="3" fill={roof}/>}
          <rect x={x} y={ty} width={w} height={84 - ty} rx="5" fill={body}/>
          {[0, 1].map((r) => [0, 1].map((cc) => {
            const wy = ty + 8 + r * 12;
            if (wy > 78) return null;
            return <rect key={`${r}-${cc}`} className={(i + r + cc) % 3 === 0 ? 'lm-cwin' : ''} x={x + 5 + cc * (w - 14)} y={wy} width="5" height="6" rx="1.4" fill="url(#lmGlow)"/>;
          }))}
        </g>
      );
    })}
    <rect x="0" y="84" width="260" height="8" rx="3" fill="#DAC090"/>
    {[[70, '#8FE0D0'], [140, '#F0A0C8'], [206, '#8FD8F0']].map(([x, c], i) => (
      <circle key={i} className="lm-glow" style={{ animationDelay: `${i * 0.6}s` }} cx={x} cy="88" r="2" fill={c}/>
    ))}
  </svg>
);


const NumPad = ({ value, setValue, disabled, max = 3 }) => {
  const push = (d) => { if (disabled) return; setValue((v) => (v.length >= max ? v : v + d)); };
  const back = () => { if (disabled) return; setValue((v) => v.slice(0, -1)); };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div className="mono" style={{ minWidth: 124, height: 'clamp(40px, min(46px, 6.1dvh), 46px)', borderRadius: 12, border: `2.5px solid ${T.accent}`, background: T.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, color: T.ink, letterSpacing: 4, padding: '0 14px' }}>{value || '—'}</div>
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

// --- Yoyilma matni (rangli: yuzlik/o'nlik/birlik). "300 + 40 + 5" -> rangli qismlar.
const ExpandRow = ({ text, size = 'clamp(19px, 3.8vw, 27px)' }) => {
  const parts = String(text).split('+').map((x) => x.trim());
  return (
    <span className="mono" style={{ display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.3em', fontSize: size, fontWeight: 800, justifyContent: 'center' }}>
      {parts.map((p, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span style={{ color: T.ink3 }}>+</span>}
          <span style={{ color: RCOL[Math.min(i, 2)] }}>{p}</span>
        </React.Fragment>
      ))}
    </span>
  );
};

// --- KO'P-RAUNDLI MC (heading/renderFig render-props). Etalon MCRoundScreen naqshi.
const MCRoundD2 = ({ props, ck, heading, renderFig, cols = 2 }) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT[ck];
  // Variantlar har mount'da aralashadi (to'g'ri javob doim 1-o'rinda qolmasin).
  // opts/hints yangi tartibga ko'chadi, ci yangi indeksni ko'rsatadi; grading buzilmaydi.
  const items = React.useMemo(() => c.items.map((it) => {
    const order = shuffleArr(it.opts.map((_, i) => i));
    return { ...it, opts: order.map((i) => it.opts[i]), hints: it.hints ? order.map((i) => it.hints[i]) : it.hints, ci: order.indexOf(it.ci) };
  }), []);
  const audio = useAudio([
    brgSeg(ck, lang),
    { id: `${ck}_intro`, text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [idx, setIdx] = useState(props.storedAnswer ? items.length : 0);
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const [hintMsg, setHintMsg] = useState(null);
  const [okPick, setOkPick] = useState(props.storedAnswer && items.length ? items[items.length - 1].ci : null);   // to'g'ri variant YASHIL yonadi (metodist 2026-08-04)
  const [score, setScore] = useState(props.storedAnswer ? (props.storedAnswer.studentAnswer | 0) : 0);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const firstAllRef = useRef(props.storedAnswer ? props.storedAnswer.firstTry : true);
  const it = items[Math.min(idx, items.length - 1)];
  const done = idx >= items.length;
  const revealRef = useRevealScroll(done, 400);
  const pick = (i) => {
    if (!canAct || done || okPick !== null || wrongSet.has(i)) return;
    if (i === it.ci) {
      setOkPick(i); sfx.playCorrect();
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_correct[lang]); }
      if (wrongSet.size === 0) setScore((s) => s + 1);
      setTimeout(() => { if (idx + 1 < items.length) setOkPick(null); setWrongSet(new Set()); setHintMsg(null); setIdx((n) => n + 1); }, 1200);
    } else {
      const n = new Set(wrongSet); n.add(i); setWrongSet(n);
      firstAllRef.current = false;
      setHintMsg((it.hints && it.hints[i]) || null);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(((it.hints && it.hints[i]) || c.audio.on_wrong)[lang]); }
    }
  };
  useEffect(() => {
    if (done && !recorded) {
      setRecorded(true);
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: ck,
        correctAnswer: String(items.length), studentAnswer: score, correct: firstAllRef.current,
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
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        {it && (
          <>
            <div className="mono fade-up" style={{ textAlign: 'center', color: T.accent, fontWeight: 800 }}>{Math.min(idx + 1, items.length)} / {items.length}</div>
            <h1 className="title h-sub fade-up">{heading(it)}</h1>
            <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(10px, 2vw, 14px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
              <FrameFx/>
              {renderFig(it)}
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(90px, 1fr))`, gap: 10, width: '100%' }}>
                {it.opts.map((o, i) => (
                  <button key={i} className={`option ${okPick === i ? 'option-correct' : ''} ${wrongSet.has(i) ? 'option-picked-wrong' : ''}`} disabled={!canAct || okPick !== null || wrongSet.has(i)} onClick={() => pick(i)}
                    style={{ padding: 'clamp(10px, 1.6vw, 13px)', fontSize: 'clamp(13px, 1.7vw, 15px)', minHeight: 'clamp(46px, 6.5vw, 56px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{t(o)}</button>
                ))}
              </div>
              {hintMsg && <p className="fade-up" style={{ margin: 0, color: T.ink2, fontSize: 'clamp(13px, 1.7vw, 15px)', textAlign: 'center' }}>{t(hintMsg)}</p>}
            </div>
          </>
        )}
        {done && (
          <div ref={revealRef} className="frame-success reveal-soft">
            <Reaction state="correct" praise={`${score} / ${items.length}`}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s0 — HOOK: 352 dagi 5 qiymati (o'rin qiymati)
const Screen0 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s0;
  const audio = useAudio(c.audio.intro[lang].map((text, i) => ({
    id: `s0_${i}`, text, trigger: i === 0 ? 'on_mount' : 'after_previous', waits_for: null
  })));
  const canAct = useCanAnswer(audio);
  const [picked, setPicked] = useState(null);
  const ok = picked === 1;
  const fbKey = (i) => (i === 1 ? 'on_correct' : 'on_wrong');
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
  const opts = [c.opt0, c.opt1, c.opt2];
  const digs = ['3', '5', '2'];
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <div className="fade-up" style={{ alignSelf: 'center', background: T.accentSoft, color: T.accent, fontWeight: 800, fontSize: 'clamp(12px, 1.8vw, 15px)', padding: '5px 14px', borderRadius: 999 }}>{t(c.topic)}</div>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ padding: 'clamp(8px, 1.8vw, 14px)', overflow: 'hidden' }}>
          <LessonScene gathered={ok}/>
        </div>
        <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(14px, 2.6vw, 22px)' }}>
          <div style={{ display: 'flex', gap: 'clamp(6px, 1.8vw, 12px)' }}>
            {digs.map((d, i) => (
              <span key={i} className="mono" style={{ fontSize: 'clamp(34px, 8vw, 52px)', fontWeight: 800, color: i === 1 ? T.accent : T.ink, background: i === 1 ? T.accentSoft : 'transparent', borderRadius: 12, padding: '2px 12px' }}>{d}</span>
            ))}
          </div>
        </div>
        <p className="fade-up delay-1" style={{ textAlign: 'center', color: T.ink2, fontWeight: 600, fontSize: 'clamp(15px, 2vw, 18px)', margin: 0 }}>{t(c.q)}</p>
        {picked === null && (
          <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {opts.map((o, i) => (
              <button key={i} className="option" disabled={!canAct} onClick={() => pick(i)}
                style={{ padding: 'clamp(10px, 1.5vw, 12px)', fontSize: 'clamp(16px, 2.4vw, 22px)', minHeight: 'clamp(48px, 7vw, 58px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>
                {t(o)}
              </button>
            ))}
          </div>
        )}
        {picked !== null && (
          <div className="fade-up" style={{ display: 'flex', justifyContent: 'center' }}>
            <button className={`option ${ok ? 'option-correct' : 'option-picked-wrong'}`} disabled
              style={{ padding: 'clamp(10px, 1.5vw, 12px) clamp(16px, 2.4vw, 22px)', fontSize: 'clamp(16px, 2.4vw, 22px)', minHeight: 'clamp(46px, 6.5vw, 56px)', width: 'auto', display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>
              <span className="mono small">{ok ? '✓' : '↺'}</span>
              <span>{t(opts[picked])}</span>
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

// s1 — RECALL: har raqamning o'z qiymati (3->300, 4->40, 5->5)
const Screen1 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s1;
  const audio = useAudio([
    brgSeg('s1', lang),
    ...c.audio[lang].map((text, i) => ({ id: `s1_${i}`, text, trigger: 'after_previous', waits_for: null }))
  ]);
  const seg = audio.currentSegment;
  const [reached, setReached] = useState(-1);
  useEffect(() => { if (seg && /^s1_\d+$/.test(seg)) setReached((r) => Math.max(r, +seg.slice(3))); }, [seg]);
  const done = reached >= (c.audio[lang].length - 1);
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
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(10px, 3vw, 24px)', padding: 'clamp(14px, 2.6vw, 22px)', minHeight: 'clamp(170px, 36vw, 230px)', alignItems: 'center' }}>
          {c.vals.map((v, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <span className="mono" style={{ fontSize: 'clamp(30px, 7vw, 44px)', fontWeight: 800, color: RCOL[i], border: `2.5px solid ${RCOL[i]}`, borderRadius: 12, minWidth: 'clamp(40px, 10vw, 56px)', textAlign: 'center', padding: '2px 0', background: T.paper }}>{v.dig}</span>
              {reached >= i && (
                <>
                  <span className="lm-drop" style={{ fontSize: 18, color: T.ink3 }}>↓</span>
                  <span className="lm-drop mono" style={{ fontSize: 'clamp(18px, 3.6vw, 26px)', fontWeight: 800, color: RCOL[i] }}>{v.val}</span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </Stage>
  );
};

// s2 — AJRATISH: 345 -> 300 + 40 + 5
const Screen2 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s2;
  const audio = useAudio([
    brgSeg('s2', lang),
    ...c.audio[lang].map((text, i) => ({ id: `s2_${i}`, text, trigger: 'after_previous', waits_for: null }))
  ]);
  const seg = audio.currentSegment;
  const [reached, setReached] = useState(-1);
  useEffect(() => { if (seg && /^s2_\d+$/.test(seg)) setReached((r) => Math.max(r, +seg.slice(3))); }, [seg]);
  const showParts = reached >= 1;
  const done = reached >= (c.audio[lang].length - 1);
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
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'clamp(12px, 2.4vw, 18px)', padding: 'clamp(14px, 2.6vw, 22px)', minHeight: 'clamp(170px, 36vw, 230px)' }}>
          <span className="mono" style={{ fontSize: 'clamp(34px, 7vw, 48px)', fontWeight: 800, color: T.ink }}>{t(c.num)}</span>
          {showParts && (
            <>
              <span className="lm-drop" style={{ fontSize: 20, color: T.ink3 }}>↓</span>
              <span className="lm-reveal"><ExpandRow text={c.parts.join(' + ')}/></span>
            </>
          )}
        </div>
        {done && (
          <div className="frame-success fade-up">
            <Reaction state="correct" praise={t(c.done_text)}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s3 — ISHLANGAN MISOLLAR
const Screen3 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s3;
  const audio = useAudio([
    brgSeg('s3', lang),
    ...c.audio[lang].map((text, i) => ({ id: `s3_${i}`, text, trigger: 'after_previous', waits_for: null }))
  ]);
  const seg = audio.currentSegment;
  const [reached, setReached] = useState(-1);
  useEffect(() => { if (seg && /^s3_\d+$/.test(seg)) setReached((r) => Math.max(r, +seg.slice(3))); }, [seg]);
  const done = reached >= (c.audio[lang].length - 1);
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
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(12px, 2.6vw, 20px)', padding: 'clamp(16px, 3vw, 24px)' }}>
          {c.examples.map((ex, i) => (
            <div key={i} className="g1-pop-in" style={{ animationDelay: `${i * 0.18}s`, display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1.6vw, 12px)', flexWrap: 'wrap', justifyContent: 'center' }}>
              <span className="mono" style={{ fontSize: 'clamp(20px, 4.2vw, 30px)', fontWeight: 800, color: T.ink }}>{ex.n}</span>
              <span className="mono" style={{ fontSize: 'clamp(18px, 3.4vw, 24px)', color: T.ink3, fontWeight: 800 }}>=</span>
              <ExpandRow text={`${ex.h} + ${ex.t} + ${ex.o}`} size="clamp(17px, 3.4vw, 24px)"/>
            </div>
          ))}
        </div>
      </div>
    </Stage>
  );
};

// s4 — YIG'ISH (teskari): 300 + 40 + 5 -> 345
const Screen4 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s4;
  const audio = useAudio([
    brgSeg('s4', lang),
    ...c.audio[lang].map((text, i) => ({ id: `s4_${i}`, text, trigger: 'after_previous', waits_for: null }))
  ]);
  const seg = audio.currentSegment;
  const [reached, setReached] = useState(-1);
  useEffect(() => { if (seg && /^s4_\d+$/.test(seg)) setReached((r) => Math.max(r, +seg.slice(3))); }, [seg]);
  const showResult = reached >= 1;
  const done = reached >= (c.audio[lang].length - 1);
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
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'clamp(12px, 2.4vw, 18px)', padding: 'clamp(14px, 2.6vw, 22px)', minHeight: 'clamp(170px, 36vw, 230px)' }}>
          <ExpandRow text={c.parts.join(' + ')}/>
          {showResult && (
            <>
              <span className="lm-drop" style={{ fontSize: 20, color: T.ink3 }}>↓</span>
              <BigNum v={t(c.result)} accent/>
            </>
          )}
        </div>
        {done && (
          <div className="frame-success fade-up">
            <Reaction state="correct" praise={t(c.done_text)}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s5 — NOL YOYILMADA: 305 -> 300 + 5
const Screen5 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s5;
  const audio = useAudio([
    brgSeg('s5', lang),
    ...c.audio[lang].map((text, i) => ({ id: `s5_${i}`, text, trigger: 'after_previous', waits_for: null }))
  ]);
  const seg = audio.currentSegment;
  const [reached, setReached] = useState(-1);
  useEffect(() => { if (seg && /^s5_\d+$/.test(seg)) setReached((r) => Math.max(r, +seg.slice(3))); }, [seg]);
  const showParts = reached >= 1;
  const showEx = reached >= 2;
  const done = reached >= (c.audio[lang].length - 1);
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
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(12px, 2.4vw, 18px)', padding: 'clamp(14px, 2.6vw, 22px)' }}>
          <span className="mono" style={{ fontSize: 'clamp(30px, 6.5vw, 44px)', fontWeight: 800, color: T.ink }}>{t(c.num)}</span>
          {showParts && (
            <>
              <span className="lm-drop" style={{ fontSize: 18, color: T.ink3 }}>↓</span>
              <span className="lm-reveal"><ExpandRow text={c.parts.join(' + ')}/></span>
              <span className="mono lm-reveal" style={{ fontSize: 'clamp(11px, 1.6vw, 13px)', color: T.accent, fontWeight: 700 }}>{t(c.missing)}</span>
            </>
          )}
          {showEx && (
            <div className="frame-tip lm-reveal" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(5px, 1.2vw, 8px)', padding: 'clamp(8px, 1.6vw, 12px)', width: '100%' }}>
              {c.examples.map((ex, i) => (
                <div key={i} className="g1-pop-in" style={{ animationDelay: `${i * 0.14}s`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span className="mono" style={{ fontSize: 'clamp(16px, 3vw, 22px)', fontWeight: 800, color: T.ink }}>{ex.n}</span>
                  <span className="mono" style={{ fontSize: 'clamp(14px, 2.4vw, 18px)', color: T.ink3, fontWeight: 800 }}>=</span>
                  <ExpandRow text={ex.exp} size="clamp(14px, 2.8vw, 19px)"/>
                </div>
              ))}
            </div>
          )}
        </div>
        {done && (
          <div className="frame-success fade-up">
            <Reaction state="correct" praise={t(c.done_text)}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s6 — QOIDA + qiymat-tanlash check
const Screen6 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s6;
  const sfx = useSfx();
  const audio = useAudio([
    brgSeg('s6', lang),
    ...c.audio[lang].map((text, i) => ({ id: `s6_${i}`, text, trigger: 'after_previous', waits_for: null }))
  ]);
  const canAct = useCanAnswer(audio);
  const [picked, setPicked] = useState(null);
  // Variantlar har mount'da ARALASHADI: to'g'ri javob doim bir joyda turmasin (metodist,
  // 2026-08-04). `order` — ko'rsatish tartibi, `ci` — to'g'ri javobning YANGI o'rni.
  const order = React.useMemo(() => shuffleArr(c.check_opts.map((_, i) => i)), []);
  const ci = order.indexOf(c.check_ci);
  const ok = picked === ci;
  const revealRef = useRevealScroll(ok, 500);
  const pick = (i) => {
    if (!canAct || ok) return;
    setPicked(i);
    if (i === ci) sfx.playCorrect();
  };
  const canAdv = useAdvanceGate(ok, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <div className="d2-rulecard fade-up">
          <span className="d2-rulecard-badge mono">{t(c.eyebrow)}</span>
          <p className="d2-rulecard-txt">{t(c.rule)}</p>
        </div>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(12px, 2.4vw, 16px)', padding: 'clamp(14px, 2.6vw, 22px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            <span className="mono" style={{ fontSize: 'clamp(24px, 5vw, 34px)', fontWeight: 800, color: T.ink }}>{t(c.num)}</span>
            <span className="mono" style={{ fontSize: 'clamp(18px, 3vw, 24px)', color: T.ink3, fontWeight: 800 }}>=</span>
            <ExpandRow text={t(c.exp)} size="clamp(18px, 3.6vw, 26px)"/>
          </div>
          <p style={{ textAlign: 'center', color: T.ink2, fontWeight: 700, margin: 0 }}>{ok ? t(c.check_ok) : (picked !== null ? t(c.check_no) : t(c.check_q))}</p>
          <div style={{ display: 'flex', gap: 10 }}>
            {order.map((k, i) => (
              <button key={i} className={`option ${ok && i === ci ? 'option-correct' : ''} ${picked === i && i !== ci ? 'option-picked-wrong' : ''}`} disabled={!canAct || ok} onClick={() => pick(i)}
                style={{ padding: 'clamp(10px, 1.6vw, 13px) clamp(14px, 2.4vw, 20px)', fontSize: 'clamp(16px, 2.6vw, 20px)', minHeight: 'clamp(46px, 6.5vw, 56px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>{c.check_opts[k]}</button>
            ))}
          </div>
        </div>
        {ok && (
          <div ref={revealRef} className="frame-success fade-up">
            <Reaction state="correct" praise={t(c.check_ok)}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s7 — MASHQ ajratish (son -> yoyilma, MC), 3 raund
const Screen7 = (props) => {
  const t = useT();
  const c = CONTENT.s7;
  const heading = () => t(c.q);
  const renderFig = (it) => (
    <div className="lm-figwrap">
      <span className="mono" style={{ fontSize: 'clamp(34px, 8vw, 52px)', fontWeight: 800, color: T.ink, letterSpacing: 2 }}>{it.num}</span>
    </div>
  );
  return <MCRoundD2 props={props} ck="s7" cols={1} heading={heading} renderFig={renderFig}/>;
};

// s8 — MASHQ yig'ish (yoyilma -> son, NumPad), 3 raund
const Screen8 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s8;
  const sfx = useSfx();
  const items = c.items;
  const audio = useAudio([
    brgSeg('s8', lang),
    { id: 's8_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [round, setRound] = useState(props.storedAnswer ? items.length : 0);
  const [val, setVal] = useState(props.storedAnswer ? String(items[items.length - 1].ans) : '');
  const [checked, setChecked] = useState(false);
  const [roundOk, setRoundOk] = useState(false);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const firstAllRef = useRef(props.storedAnswer ? props.storedAnswer.firstTry : true);
  const done = round >= items.length;
  const it = items[Math.min(round, items.length - 1)];
  const correct = parseInt(val, 10) === it.ans;
  const revealRef = useRevealScroll(checked, 500);
  const check = () => {
    if (!canAct || checked || done || val === '') return;
    setChecked(true);
    const isOk = correct;
    setRoundOk(isOk);
    if (!isOk) firstAllRef.current = false;
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((isOk ? c.audio.on_correct : c.audio.on_wrong)[lang]); }
    if (isOk) { sfx.playCorrect(); setTimeout(() => { setChecked(false); if (round + 1 < items.length) setVal(''); setRound((r) => r + 1); }, 1000); }
    else { setTimeout(() => { setChecked(false); setVal(''); }, 1700); }
  };
  useEffect(() => {
    if (done && !recorded) {
      setRecorded(true);
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: t(c.q),
        correctAnswer: String(items.length), studentAnswer: String(items.length), correct: firstAllRef.current,
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
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        {it && (
          <>
            <div className="mono fade-up" style={{ textAlign: 'center', color: T.accent, fontWeight: 800 }}>{Math.min(round + 1, items.length)} / {items.length}</div>
            <h1 className="title h-sub fade-up">{t(c.q)}</h1>
            <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(10px, 2vw, 14px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
              <FrameFx/>
              <ExpandRow text={it.exp}/>
              <NumPad value={val} setValue={setVal} disabled={!canAct || checked || done} max={3}/>
              <button className="btn-white-accent" disabled={!canAct || checked || done || val === ''} onClick={check}>{t(c.check_label)}</button>
            </div>
            {checked && (
              <div ref={revealRef} className={roundOk ? 'frame-success fade-up' : 'frame-tip fade-up'}>
                <Reaction state={roundOk ? 'correct' : 'wrong'} praise={(roundOk ? c.audio.on_correct : c.audio.on_wrong)[lang]}/>
                {!roundOk && <p style={{ margin: '8px 0 0', color: T.ink2, textAlign: 'center', fontSize: 'clamp(13px, 1.7vw, 15px)' }}>{t(it.hint)}</p>}
              </div>
            )}
          </>
        )}
        {done && (
          <div className="frame-success reveal-soft">
            <Reaction state="correct" praise={`${items.length} / ${items.length}`}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s9 — MASHQ nol yoyilmada (son -> yoyilma, MC), 3 raund
const Screen9 = (props) => {
  const t = useT();
  const c = CONTENT.s9;
  const heading = () => t(c.q);
  const renderFig = (it) => (
    <div className="lm-figwrap">
      <span className="mono" style={{ fontSize: 'clamp(34px, 8vw, 52px)', fontWeight: 800, color: T.ink, letterSpacing: 2 }}>{it.num}</span>
    </div>
  );
  return <MCRoundD2 props={props} ck="s9" cols={2} heading={heading} renderFig={renderFig}/>;
};

// s10 — MASHQ xatoni top (son = yoyilma juftlari), 3 raund
const Screen10 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s10;
  const sfx = useSfx();
  const items = c.items;
  const audio = useAudio([
    brgSeg('s10', lang),
    { id: 's10_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [idx, setIdx] = useState(props.storedAnswer ? items.length : 0);
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const [solvedRound, setSolvedRound] = useState(false);
  const [score, setScore] = useState(props.storedAnswer ? (props.storedAnswer.studentAnswer | 0) : 0);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const firstAllRef = useRef(props.storedAnswer ? props.storedAnswer.firstTry : true);
  const it = items[Math.min(idx, items.length - 1)];
  const done = idx >= items.length;
  const revealRef = useRevealScroll(done, 400);
  const pick = (i) => {
    if (!canAct || done || solvedRound || wrongSet.has(i)) return;
    if (i === it.wrong) {
      setSolvedRound(true); sfx.playCorrect();
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_correct[lang]); }
      if (wrongSet.size === 0) setScore((s) => s + 1);
      setTimeout(() => { setSolvedRound(false); setWrongSet(new Set()); setIdx((n) => n + 1); }, 1300);
    } else {
      const n = new Set(wrongSet); n.add(i); setWrongSet(n);
      firstAllRef.current = false;
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_wrong[lang]); }
    }
  };
  useEffect(() => {
    if (done && !recorded) {
      setRecorded(true);
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: 'find-error',
        correctAnswer: String(items.length), studentAnswer: score, correct: firstAllRef.current,
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
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        {it && (
          <>
            <div className="mono fade-up" style={{ textAlign: 'center', color: T.accent, fontWeight: 800 }}>{Math.min(idx + 1, items.length)} / {items.length}</div>
            <h1 className="title h-sub fade-up">{t(c.q)}</h1>
            <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.8vw, 12px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
              <FrameFx/>
              {it.pairs.map((p, i) => (
                <button key={i} className={`option ${wrongSet.has(i) ? 'option-picked-wrong' : ''} ${solvedRound && i === it.wrong ? 'option-correct' : ''}`} disabled={!canAct || solvedRound || wrongSet.has(i)} onClick={() => pick(i)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: 'clamp(10px, 1.6vw, 14px) clamp(14px, 2.4vw, 20px)', minHeight: 'clamp(48px, 7vw, 58px)' }}>
                  <span className="mono" style={{ fontSize: 'clamp(18px, 3.4vw, 24px)', fontWeight: 800, color: T.ink }}>{p.num}</span>
                  <span className="mono" style={{ fontSize: 'clamp(14px, 2.4vw, 18px)', fontWeight: 800, color: T.ink3 }}>=</span>
                  <ExpandRow text={p.exp} size="clamp(14px, 2.8vw, 19px)"/>
                </button>
              ))}
              {wrongSet.size > 0 && !solvedRound && <p className="fade-up" style={{ margin: 0, color: T.ink2, textAlign: 'center', fontSize: 'clamp(13px, 1.7vw, 15px)' }}>{t(it.hint)}</p>}
            </div>
          </>
        )}
        {done && (
          <div ref={revealRef} className="frame-success reveal-soft">
            <Reaction state="correct" praise={`${score} / ${items.length}`}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s11 — MASALA (case): Zuhra yoyilmasi -> NumPad
const Screen11 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s11;
  const sfx = useSfx();
  const audio = useAudio([
    brgSeg('s11', lang),
    { id: 's11_setup', text: c.setup_audio[lang], trigger: 'after_previous', waits_for: null },
    { id: 's11_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [val, setVal] = useState(props.storedAnswer ? String(props.storedAnswer.studentAnswer) : '');
  const [checked, setChecked] = useState(props.storedAnswer !== undefined);
  const [solved, setSolved] = useState(props.storedAnswer?.correct === true);
  const firstRef = useRef(props.storedAnswer ? props.storedAnswer.firstTry : null);
  const revealRef = useRevealScroll(checked, 500);
  const correct = parseInt(val, 10) === c.ans;
  const check = () => {
    if (!canAct || solved || val === '') return;
    setChecked(true);
    const isOk = correct;
    if (firstRef.current === null) firstRef.current = isOk;
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((isOk ? c.audio.on_correct : c.audio.on_wrong)[lang]); }
    if (isOk) { setSolved(true); sfx.playCorrect(); }
    props.onAnswer({
      stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: t(c.q),
      correctAnswer: String(c.ans), studentAnswer: val, correct: isOk,
      firstTry: firstRef.current, attempts: 1, solved: isOk
    });
    if (!isOk) setTimeout(() => { setChecked(false); setVal(''); }, 1600);
  };
  const canAdv = useAdvanceGate(solved, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  const askLine = lang === 'ru' ? 'Набери число цифрами:' : 'Sonni raqamlab tering:';
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <p className="fade-up" style={{ textAlign: 'center', color: T.ink2, fontWeight: 700, margin: 0 }}>{t(c.lead)}</p>
        <h1 className="title h-sub fade-up delay-1" style={{ margin: 0 }}>{t(c.q)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(8px, 1.6vw, 12px)', padding: 'clamp(10px, 2vw, 16px)' }}>
          <FrameFx/>
          <div className="lm-report">
            <span className="lm-report-head mono">{t(c.manifest_label)}</span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 6 }}>
              <span className="g1-cast-fig" style={{ width: 'clamp(40px, 12vw, 54px)' }}><ZuhraSVG mood="pointing"/></span>
              <ExpandRow text={t(c.exp_display)} size="clamp(18px, 3.6vw, 26px)"/>
            </div>
          </div>
          <p className="fade-up" style={{ margin: 0, textAlign: 'center', color: T.ink2, fontSize: 'clamp(12px, 1.6vw, 14px)', fontWeight: 600 }}>{askLine}</p>
          <NumPad value={val} setValue={setVal} disabled={!canAct || solved} max={3}/>
          <button className="btn-white-accent" disabled={!canAct || solved || val === ''} onClick={check}>{lang === 'ru' ? 'Проверить' : 'Tekshir'}</button>
        </div>
        {checked && (
          <div ref={revealRef} className={correct ? 'frame-success fade-up' : 'frame-tip fade-up'}>
            <Reaction state={correct ? 'correct' : 'wrong'} praise={(correct ? c.audio.on_correct : c.audio.on_wrong)[lang]}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s12 — FINAL panel (5 savol aralash) + FactCard
const Screen12 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s12;
  const items = c.items;
  // Final MC variantlari har mount'da aralashadi. orders[idx][pos] = ASL indeks; to'g'ri = ASL 0.
  const orders = React.useMemo(() => items.map((it) => it.kind === 'num' ? null : shuffleArr([0, 1, 2])), []);
  const audio = useAudio([
    brgSeg('s12', lang),
    { id: 's12_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [idx, setIdx] = useState(props.storedAnswer ? items.length : 0);
  const [picked, setPicked] = useState(null);
  const [val, setVal] = useState('');
  const [numLock, setNumLock] = useState(false);
  const [score, setScore] = useState(props.storedAnswer ? (props.storedAnswer.studentAnswer | 0) : 0);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const factRef = useRevealScroll(idx >= items.length, 500);
  const it = items[idx];
  const [wrongSet, setWrongSet] = useState(() => new Set());   // shu savolda urinilgan xato variantlar
  const [hintMsg, setHintMsg] = useState(null);                // xato tahlili (savol almashmaydi)
  const numTriedRef = useRef(false);                           // raqamli savolda xato bo'lganmi (ball uchun)
  const PASS = Math.ceil(items.length * 0.7);
  // NOTO'G'RI javob keyingi savolga O'TKAZMAYDI (metodist, 2026-08-04): bola shu savolda
  // qoladi, tahlilni oladi va qayta urinib ko'radi. Ball faqat BIRINCHI urinishda beriladi.
  const pick = (i) => {
    if (!canAct || picked !== null || idx >= items.length || wrongSet.has(i)) return;
    const isOk = orders[idx][i] === 0;
    if (isOk) {
      setPicked(i);
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
    if (!canAct || numLock || val === '' || idx >= items.length) return;
    setNumLock(true);
    const isOk = parseInt(val, 10) === it.ans;
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((isOk ? c.audio.on_correct : it.hint)[lang]); }
    if (isOk) {
      if (!numTriedRef.current) setScore((s) => s + 1);
      setTimeout(() => { setVal(''); setNumLock(false); setHintMsg(null); numTriedRef.current = false; setIdx((n) => n + 1); }, 1700);
    } else {
      numTriedRef.current = true;
      setHintMsg(it.hint);
      setTimeout(() => { setVal(''); setNumLock(false); }, 1700);
    }
  };
  useEffect(() => {
    if (idx >= items.length && !recorded) {
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
  const done = idx >= items.length;
  const canAdv = useAdvanceGate(done, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <p className="fade-up" style={{ textAlign: 'center', color: T.ink2, fontWeight: 700, margin: 0 }}>{t(c.intro_line)}</p>
        {!done && it && (
          <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)', padding: 'clamp(14px, 2.6vw, 20px)' }}>
            <FrameFx/>
            <div className="mono" style={{ textAlign: 'center', color: T.accent, fontWeight: 800 }}>{idx + 1} / {items.length}</div>
            <h2 className="title h-sub" style={{ textAlign: 'center' }}>{t(it.q)}</h2>
            {it.kind === 'num' ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'center' }}><MiniCity/></div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <NumPad value={val} setValue={setVal} disabled={!canAct || numLock} max={3}/>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button className="btn-white-accent" disabled={!canAct || numLock || val === ''} onClick={checkNum}>{lang === 'ru' ? 'Проверить' : 'Tekshir'}</button>
                </div>
                {hintMsg && <p className="fade-up" style={{ margin: 0, color: T.ink2, fontSize: 'clamp(13px, 1.7vw, 15px)', textAlign: 'center' }}>{t(it.hint)}</p>}
              </>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10 }}>
                  {orders[idx].map((k, i) => (
                    <button key={i} className={`option ${picked === i ? 'option-correct' : wrongSet.has(i) ? 'option-picked-wrong' : ''}`} disabled={!canAct || picked !== null || wrongSet.has(i)} onClick={() => pick(i)}
                      style={{ padding: 'clamp(10px, 1.6vw, 13px)', fontSize: 'clamp(13px, 1.7vw, 15px)', minHeight: 'clamp(46px, 6.5vw, 56px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                      {t(it[`opt${k}`])}
                    </button>
                  ))}
                </div>
                {hintMsg && (
                  <p className="fade-up" style={{ margin: 0, color: T.ink2, fontSize: 'clamp(13px, 1.7vw, 15px)' }}>{t(hintMsg)}</p>
                )}
              </>
            )}
          </div>
        )}
        {done && (
          <div ref={factRef}>
            <div className="frame-success fade-up" style={{ marginBottom: 12 }}><Reaction state="correct" praise={`${score} / ${items.length}`}/></div>
            <div className="d2-factcard fade-up">
              <span className="d2-factcard-badge mono">{t(c.fact_badge)}</span>
              <p className="d2-factcard-txt">{t(c.fact_text)}</p>
            </div>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s13 — YAKUN
const Screen13 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s13;
  const audio = useAudio([
    { id: 's13_pay', text: S13_PAYOFF[lang], trigger: 'on_mount', waits_for: null },
    { id: 's13_sum', text: c.audio[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={false} onClick={props.finishLesson} label={lang === 'uz' ? 'Tugatish' : 'Завершить'}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.4vw, 16px)', position: 'relative' }}>
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
          <span className="d2-rulecard-badge mono">{lang === 'ru' ? 'Помни' : 'Yodda tut'}</span>
          <p className="d2-rulecard-txt">{t(c.rule_recap)}</p>
        </div>
        <div className="fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <span className="mono" style={{ fontSize: 'clamp(11px, 1.5vw, 13px)', color: T.ink2 }}>{t(c.conn_label_refs)}: {t(c.conn_refs)}</span>
          <span className="mono" style={{ fontSize: 'clamp(11px, 1.5vw, 13px)', color: T.accent, fontWeight: 700 }}>{t(c.conn_label_next)}: {t(c.conn_next)}</span>
        </div>
        <div className="fade-up delay-1"><LessonScene gathered/></div>
      </div>
    </Stage>
  );
};

// ============================================================
// KORNEVOY KOMPONENT (shablon: infrastructure_v1 / grade1 Dars28)
// ============================================================
export default function RazryadSumLesson({
  studentName, lang: langProp, ttsApiBase, voiceGender,
  correctSoundUrl, wrongSoundUrl, aiGradingEndpoint, onFinished,
}) {
  useMobileZoom();
  const isPreview = (langProp === undefined || langProp === null);
  const [previewLang, setPreviewLang] = useState('ru');
  const lang = langProp || previewLang;
  const safeName = studentName || (lang === 'uz' ? "O'quvchi" : 'Ученик');
  configureLesson({ ttsApiBase: ttsApiBase || '', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', aiGradingEndpoint: aiGradingEndpoint || '', studentName: safeName, voiceGender: voiceGender || 'f' });
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13];
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
            {['ru', 'uz'].map(l => (
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
.lm-scene { position: relative; width: min(100%, calc(clamp(160px, calc(100dvh - 570px), 372px) * 400 / 210)); aspect-ratio: 400 / 210; margin-inline: auto; border-radius: 14px; overflow: hidden; }
@media (prefers-reduced-motion: reduce) { .lm-reveal, .lm-write, .lm-drop, .lm-fadein { animation: none; } }
.lm-digtray { display: flex; gap: 10px; justify-content: center; min-height: 54px; align-items: center; }
.lm-digtray-empty { font-size: 22px; font-weight: 800; color: #C4BEB4; letter-spacing: 2px; }
.lm-digchip { display: inline-flex; align-items: center; justify-content: center; width: clamp(42px, 9vw, 56px); height: clamp(42px, 9vw, 56px); border: none; border-radius: 12px; background: #FFFFFF; font-size: clamp(22px, 4.6vw, 32px); font-weight: 800; color: #3A3530; cursor: pointer; box-shadow: 0 3px 10px -4px rgba(58,53,48,0.35); transition: transform 0.12s; }
.lm-digchip-sel { background: #FFF3E9; color: #ff4f28; transform: translateY(-3px); box-shadow: 0 6px 16px -5px rgba(255,79,40,0.55); }
.lm-bins { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(8px, 2vw, 14px); }
.lm-bin { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: clamp(10px, 2vw, 16px) 6px; border: none; border-radius: 14px; background: #FBF7F0; cursor: pointer; box-shadow: inset 0 0 0 1px rgba(58,53,48,0.07); transition: box-shadow 0.2s; }
.lm-bin-open { box-shadow: 0 4px 14px -6px rgba(255,79,40,0.4), inset 0 0 0 1.5px rgba(255,79,40,0.4); }
.lm-bin-full { background: #F1EDE5; }
.lm-bin-head { font-size: clamp(9px, 1.5vw, 11px); font-weight: 800; color: #8A8378; text-transform: uppercase; letter-spacing: 0.4px; }
.lm-bin-slot { width: clamp(36px, 8vw, 50px); height: clamp(40px, 9vw, 56px); display: flex; align-items: center; justify-content: center; border-radius: 10px; background: #FFFFFF; font-size: clamp(22px, 4.6vw, 32px); font-weight: 800; color: #3A3530; box-shadow: inset 0 0 0 1px rgba(58,53,48,0.06); }
.d2-factcard { display: flex; flex-direction: column; gap: 6px; background: #14203C; border-radius: 14px; padding: clamp(12px, 2.4vw, 18px); }
.d2-factcard-badge { align-self: flex-start; background: rgba(255,184,77,0.2); color: #FFC23C; font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.5px; }
.d2-factcard-txt { margin: 0; color: #EAF0F8; font-size: clamp(14px, 1.9vw, 16px); line-height: 1.5; }
`;
