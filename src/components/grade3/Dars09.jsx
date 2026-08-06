import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { BackLabel, BitSVG, Chiroq, Confetti, D2Defs, D2Motes, FREE_NAV, FeedbackBlock, FrameFx, GradientDefs, HeroContext, LUMO_CAST, LangContext, Lenta, NavBack, NavNext, NextLabel, Panel, ProgressContext, Reaction, ReadinessMeter, Stage, StageHero, T, configureLesson, getAudioEngine, npKey, shuffleArr, ttsConfig, useAdvanceGate, useAudio, useCanAnswer, useLang, useMobileZoom, usePrefersReducedMotion, useRevealScroll, useSfx, useT, makeBrgSeg } from './_kit/index.jsx';
import { BASE_STYLES } from './_kit/styles.js';

// ============================================================================
// DD 3-SINF | Dars09 — "Ko'paytirish jadvali" (num-3-09) | B2 «Nur bog'lari» boshi | massiv
// Syujet: Bit sayyorasi LUMO, Nur bog'lari (SYUJET_3SINF.md B2 d.10). Nurli o'simliklar tekis
//   qatorlarda (satr x ustun = massiv). Bit — mezbon-gid. FactCard: bioluminessensiya (B2 fakti).
// Infra: grade3 Dars01.jsx (etalon nomzodi) dan BAYT-ANIQ ko'chirildi. Sahna hozircha Lumo shahri
//   (HookScene) qayta ishlatildi; kelajakda bog' sahnasi qilinishi mumkin. ArrayViz = Chiroq massivi.
// YADRO: ko'paytirish = teng guruhlarning qisqa yozuvi; massiv satr x ustun; a x b = b x a.
// MEXANIKA: recall guruh (s1), massiv (s2), takroriy qo'shish (s3), o'rin almashinuvi (s4),
//   QOIDA (s5), massiv->ko'paytma MC (s6), jadval eslash MC (s7), xatoni top (s8), bog' masala (s9),
//   final panel (s10), yakun (s11).
// Misconception: M1 ko'paytirish=qo'shish (3x4=7), M2 massiv sanash xato, M3 kommutativlik, M4 jadval xato.
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
const TOTAL_SCREENS = 12;
const LESSON_META = {
  lessonId: 'num-3-09',
  lessonTitle: { ru: 'Урок 9. Таблица умножения', uz: "9-dars. Ko'paytirish jadvali" }
};
// STRUKTURA: s0 hook · s1–s5 tushuntirish · s6–s9 mashq · s10 final · s11 xulosa (12 ekran). Grade2 Dars01 etaloni yoyi,
// yuzlik qo'shilgan (uch pog'onali razryad). Syujet: Bit sayyorasi Lumo (SYUJET_3SINF.md Б1 d.1).
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'MCScreen', scored: false, scope: 'hook' },
  { id: 's1',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's4',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's5',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's6',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's7',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's8',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's9',  type: 'case',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's10', type: 'test',        template: 'custom',   scored: true,  scope: 'final' },
  { id: 's11', type: 'summary',     template: 'custom',   scored: false, scope: 'final' }
];





// ============================================================
// CONTENT — 3-sinf Dars09 «Ko'paytirish jadvali» (num-3-09). RU + UZ to'liq.
// Audio TTS-toza: sonlar so'z bilan, «» va matematik belgilar yo'q, bir segment = bir fikr.
// Rekvizit: chiroq (birlik) · lenta = 10 chiroq (o'nlik) · panel = 10 lenta (yuzlik). Lumo shahri.
// ============================================================

const CONTENT = {
  // s0 — HOOK: nur bog'i, 4 qator x 3 o'simlik = nechta
  s0: {
    eyebrow: { ru: 'Миссия', uz: 'Missiya' },
    topic: { ru: 'Тема: таблица умножения', uz: "Mavzu: ko'paytirish jadvali" },
    lead: { ru: 'Сады света: растения растут ровными рядами.', uz: "Nur bog'lari: o'simliklar tekis qatorlarda o'sadi." },
    rows: 4, cols: 3,
    q: { ru: 'Сколько всего растений: 4 ряда по 3?', uz: "Jami nechta o'simlik: 4 qator, 3 tadan?" },
    opt0: { ru: '12', uz: '12' },
    opt1: { ru: '7', uz: '7' },
    opt2: { ru: '9', uz: '9' },
    audio: {
      intro: {
        ru: [
          'Тема урока — таблица умножения. Научимся быстро считать ровные ряды.',
          'Мы открыли весь город Бита. Теперь Бит ведёт нас в новую область — Сады света.',
          'Здесь светящиеся растения растут ровными рядами. Тут четыре ряда, в каждом по три растения.',
          'Как думаешь, сколько всего растений? Выбери вариант.'
        ],
        uz: [
          "Dars mavzusi — ko'paytirish jadvali. Tekis qatorlarni tez sanashni o'rganamiz.",
          "Biz Bitning butun shahrini ochdik. Endi Bit bizni yangi hududga — Nur bog'lariga olib boradi.",
          "Bu yerda nurli o'simliklar tekis qatorlarda o'sadi. Bu yerda to'rt qator, har birida uchtadan o'simlik.",
          "Sizningcha, jami nechta o'simlik bor? Variantni tanlang."
        ]
      },
      on_correct: { ru: 'Верно. Четыре ряда по три это четыре умножить на три, двенадцать.', uz: "To'g'ri. To'rt qator uchtadan bu to'rt ko'paytiruv uch, o'n ikki." },
      on_wrong: { ru: 'Это не сложение. Четыре ряда по три считают умножением. Проверим вместе.', uz: "Bu qo'shish emas. To'rt qator uchtadan ko'paytirish bilan sanaladi. Birga tekshiramiz." }
    }
  },

  // s1 — RECALL: teng guruhlar -> ko'paytirish
  s1: {
    eyebrow: { ru: 'Вспомним и откроем', uz: 'Eslaymiz va ochamiz' },
    lead: { ru: 'Равные группы считают умножением.', uz: "Teng guruhlar ko'paytirish bilan sanaladi." },
    audio: {
      ru: [
        'Вспомним из второго класса. Когда группы равны, вместо сложения удобно умножать.',
        'Три группы по четыре это три умножить на четыре. Умножение это короткая запись равных групп.'
      ],
      uz: [
        "Ikkinchi sinfdan eslaymiz. Guruhlar teng bo'lsa, qo'shish o'rniga ko'paytirish qulay.",
        "Uch guruh to'rttadan bu uch ko'paytiruv to'rt. Ko'paytirish teng guruhlarning qisqa yozuvi."
      ]
    }
  },

  // s2 — MASSIV: satr x ustun = 12
  s2: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: { ru: 'Ряды и столбцы — это массив.', uz: 'Qator va ustunlar — bu massiv.' },
    rows: 4, cols: 3, product: 12,
    done_text: { ru: 'Четыре ряда по три растения — всего двенадцать. Это четыре умножить на три.', uz: "To'rt qator uchtadan o'simlik — jami o'n ikki. Bu to'rt ko'paytiruv uch." },
    audio: {
      ru: [
        'Растения стоят рядами и столбцами. Это называют массив.',
        'Считаем рядами. Четыре ряда, в каждом по три. Четыре раза по три.',
        'Всего двенадцать растений. Массив помогает увидеть умножение.'
      ],
      uz: [
        "O'simliklar qator va ustunlarda turadi. Buni massiv deymiz.",
        "Qatorlab sanaymiz. To'rt qator, har birida uchtadan. To'rt marta uchtadan.",
        "Jami o'n ikki o'simlik. Massiv ko'paytirishni ko'rishga yordam beradi."
      ]
    }
  },

  // s3 — KO'PAYTIRISH = takroriy qo'shish
  s3: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: { ru: 'Умножение — это повторное сложение.', uz: "Ko'paytirish — bu takroriy qo'shish." },
    rows: 4, cols: 3, product: 12,
    sum_ru: '3 + 3 + 3 + 3', sum_uz: '3 + 3 + 3 + 3',
    mul_ru: '4 × 3', mul_uz: '4 × 3',
    done_text: { ru: 'Сложить три четыре раза долго. Умножить четыре на три — быстро. Ответ тот же, двенадцать.', uz: "Uchni to'rt marta qo'shish uzoq. To'rtni uchga ko'paytirish tez. Javob bir xil, o'n ikki." },
    audio: {
      ru: [
        'Посмотрим на массив по-другому. Три плюс три плюс три плюс три. Мы сложили три четыре раза.',
        'Это то же самое, что четыре умножить на три. Умножение это короткая запись такого сложения.',
        'Считать умножением быстрее. И ответ тот же самый, двенадцать.'
      ],
      uz: [
        "Massivga boshqacha qaraymiz. Uch qo'shuv uch qo'shuv uch qo'shuv uch. Uchni to'rt marta qo'shdik.",
        "Bu to'rtni uchga ko'paytirish bilan bir xil. Ko'paytirish shunday qo'shishning qisqa yozuvi.",
        "Ko'paytirish bilan sanash tezroq. Va javob bir xil, o'n ikki."
      ]
    }
  },

  // s4 — O'RIN ALMASHINUVI: 4 × 3 = 3 × 4
  s4: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: { ru: 'Множители можно поменять местами.', uz: "Ko'paytuvchilarni o'rin almashtirish mumkin." },
    a: 4, b: 3, product: 12,
    done_text: { ru: 'Четыре на три и три на четыре — ответ одинаковый. Массив тот же, только повернули.', uz: "To'rt ko'paytiruv uch va uch ko'paytiruv to'rt — javob bir xil. Massiv o'sha, faqat aylantirildi." },
    audio: {
      ru: [
        'Возьмём тот же массив и повернём его. Теперь три ряда по четыре.',
        'Было четыре умножить на три, стало три умножить на четыре.',
        'А растений всё столько же, двенадцать. Множители можно менять местами, ответ не меняется.'
      ],
      uz: [
        "O'sha massivni olib aylantiramiz. Endi uch qator to'rttadan.",
        "To'rt ko'paytiruv uch edi, uch ko'paytiruv to'rt bo'ldi.",
        "O'simliklar esa o'sha-o'sha, o'n ikkita. Ko'paytuvchilarni o'rin almashtirsa ham, javob o'zgarmaydi."
      ]
    }
  },

  // s5 — QOIDA
  s5: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    rule: { ru: 'Умножение — короткая запись равных групп. Первый множитель — сколько групп, второй — сколько в группе. Множители можно менять местами.', uz: "Ko'paytirish — teng guruhlarning qisqa yozuvi. Birinchi ko'paytuvchi — nechta guruh, ikkinchisi — guruhda nechta. Ko'paytuvchilarni o'rin almashtirish mumkin." },
    a: 6, b: 3,
    check_q: { ru: 'Сколько будет 6 умножить на 3? Нажми верный ответ.', uz: '6 ni 3 ga ko\'paytirsa nechta bo\'ladi? To\'g\'ri javobni bosing.' },
    check_opts: ['18', '9'],
    check_ci: 0,
    check_ok: { ru: 'Верно! Шесть групп по три это восемнадцать.', uz: "To'g'ri! Olti guruh uchtadan bu o'n sakkiz." },
    check_no: { ru: 'Это умножение, а не сложение. Шесть раз по три это восемнадцать.', uz: "Bu ko'paytirish, qo'shish emas. Olti marta uchtadan bu o'n sakkiz." },
    audio: {
      ru: [
        'Отлично, теперь запомним правило.',
        'Умножение это короткая запись равных групп. Первое число говорит, сколько групп, второе — сколько в каждой группе.',
        'Массив помогает увидеть это: ряды и столбцы. И помни, множители можно менять местами, ответ не изменится.',
        'А теперь сам. Сколько будет шесть умножить на три?'
      ],
      uz: [
        "Zo'r, endi qoidani eslab qolamiz.",
        "Ko'paytirish teng guruhlarning qisqa yozuvi. Birinchi son nechta guruh ekanini, ikkinchisi har guruhda nechtaligini aytadi.",
        "Massiv buni ko'rishga yordam beradi: qator va ustunlar. Va yodda tut, ko'paytuvchilarni o'rin almashtirsa, javob o'zgarmaydi.",
        "Endi o'zingiz. Olti ko'paytiruv uch nechta bo'ladi?"
      ]
    }
  },

  // s6 — MASHQ massiv -> ko'paytma (MC), 3 raund
  s6: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    q: { ru: 'Сколько всего в массиве?', uz: 'Massivda jami nechta?' },
    items: [
      {
        rows: 4, cols: 3, ci: 0,
        opts: [{ ru: '12', uz: '12' }, { ru: '7', uz: '7' }, { ru: '9', uz: '9' }],
        hints: {
          1: { ru: 'Это не сложение рядов. Четыре ряда по три это 12.', uz: "Bu qatorlarni qo'shish emas. To'rt qator uchtadan bu 12." },
          2: { ru: 'Считай все растения: четыре раза по три, 12.', uz: "Hamma o'simlikni sana: to'rt marta uchtadan, 12." }
        }
      },
      {
        rows: 5, cols: 4, ci: 0,
        opts: [{ ru: '20', uz: '20' }, { ru: '9', uz: '9' }, { ru: '16', uz: '16' }],
        hints: {
          1: { ru: 'Пять и четыре не складывают, а умножают: 20.', uz: "Besh va to'rtni qo'shmaymiz, ko'paytiramiz: 20." },
          2: { ru: 'Пять рядов по четыре это 20, а не 16.', uz: "Besh qator to'rttadan bu 20, 16 emas." }
        }
      },
      {
        rows: 6, cols: 3, ci: 0,
        opts: [{ ru: '18', uz: '18' }, { ru: '9', uz: '9' }, { ru: '15', uz: '15' }],
        hints: {
          1: { ru: 'Шесть рядов по три это шесть умножить на три, 18.', uz: "Olti qator uchtadan bu olti ko'paytiruv uch, 18." },
          2: { ru: 'Пересчитай ряды: их шесть. Шесть по три это 18.', uz: "Qatorlarni qayta sana: ular oltita. Olti marta uchtadan bu 18." }
        }
      }
    ],
    audio: {
      intro: { ru: 'Смотри на массив и считай, сколько всего. Три задания.', uz: "Massivga qarab, jami nechta ekanini sana. Uchta topshiriq." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Считай умножением: сколько рядов, столько раз по столбцу.', uz: "Ko'paytirish bilan sana: nechta qator, shuncha marta ustun bo'yicha." }
    }
  },

  // s7 — MASHQ jadval eslash (MC), 3 raund
  s7: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    q: { ru: 'Вспомни таблицу умножения.', uz: "Ko'paytirish jadvalini esla." },
    items: [
      {
        a: 6, b: 7, ci: 0,
        opts: [{ ru: '42', uz: '42' }, { ru: '48', uz: '48' }, { ru: '36', uz: '36' }],
        hints: {
          1: { ru: 'Шесть на семь это сорок два, а не сорок восемь.', uz: "Olti ko'paytiruv yetti bu qirq ikki, qirq sakkiz emas." },
          2: { ru: 'Шесть на семь это сорок два.', uz: "Olti ko'paytiruv yetti bu qirq ikki." }
        }
      },
      {
        a: 8, b: 4, ci: 0,
        opts: [{ ru: '32', uz: '32' }, { ru: '36', uz: '36' }, { ru: '24', uz: '24' }],
        hints: {
          1: { ru: 'Восемь на четыре это тридцать два.', uz: "Sakkiz ko'paytiruv to'rt bu o'ttiz ikki." },
          2: { ru: 'Восемь на четыре это тридцать два, а не двадцать четыре.', uz: "Sakkiz ko'paytiruv to'rt bu o'ttiz ikki, yigirma to'rt emas." }
        }
      },
      {
        a: 9, b: 6, ci: 0,
        opts: [{ ru: '54', uz: '54' }, { ru: '56', uz: '56' }, { ru: '45', uz: '45' }],
        hints: {
          1: { ru: 'Девять на шесть это пятьдесят четыре.', uz: "To'qqiz ko'paytiruv olti bu ellik to'rt." },
          2: { ru: 'Девять на шесть это пятьдесят четыре, а не сорок пять.', uz: "To'qqiz ko'paytiruv olti bu ellik to'rt, qirq besh emas." }
        }
      }
    ],
    audio: {
      intro: { ru: 'Вспоминай таблицу умножения. Выбери верный ответ. Три задания.', uz: "Ko'paytirish jadvalini esla. To'g'ri javobni tanla. Uchta topshiriq." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Вспомни таблицу спокойно. Попробуй ещё.', uz: "Jadvalni xotirjam esla. Yana urinib ko'ring." }
    }
  },

  // s8 — MASHQ xatoni top (jadval), 3 raund
  s8: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    q: { ru: 'Найди неверный пример.', uz: "Noto'g'ri misolni toping." },
    items: [
      {
        stmts: ['6 × 7 = 42', '8 × 3 = 24', '7 × 8 = 54'],
        wrong: 2,
        hint: { ru: 'Семь на восемь это пятьдесят шесть, а не пятьдесят четыре.', uz: "Yetti ko'paytiruv sakkiz bu ellik olti, ellik to'rt emas." }
      },
      {
        stmts: ['9 × 4 = 36', '6 × 6 = 42', '5 × 7 = 35'],
        wrong: 1,
        hint: { ru: 'Шесть на шесть это тридцать шесть, а не сорок два.', uz: "Olti ko'paytiruv olti bu o'ttiz olti, qirq ikki emas." }
      },
      {
        stmts: ['4 × 8 = 32', '9 × 7 = 63', '8 × 6 = 42'],
        wrong: 2,
        hint: { ru: 'Восемь на шесть это сорок восемь, а не сорок два.', uz: "Sakkiz ko'paytiruv olti bu qirq sakkiz, qirq ikki emas." }
      }
    ],
    audio: {
      intro: { ru: 'Даю три примера. Один неверный. Найди неверный пример.', uz: "Uchta misol beraman. Bittasi noto'g'ri. Noto'g'ri misolni toping." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Пересчитай по таблице. Посмотри ещё.', uz: "Jadval bo'yicha qayta sana. Yana qara." }
    }
  },

  // s9 — MASALA (case): nur bog'i (rows x cols), MC
  s9: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    lead: { ru: 'Рано посадила растения: 5 рядов по 6.', uz: "Ra'no o'simlik ekdi: 5 qator, 6 tadan." },
    rows: 5, cols: 6, ci: 0,
    q: { ru: 'Сколько всего растений посадила Рано?', uz: "Ra'no jami nechta o'simlik ekdi?" },
    opts: [{ ru: '30', uz: '30' }, { ru: '11', uz: '11' }, { ru: '25', uz: '25' }],
    hints: {
      1: { ru: 'Это не сложение. Пять рядов по шесть это пять умножить на шесть, 30.', uz: "Bu qo'shish emas. Besh qator oltitadan bu besh ko'paytiruv olti, 30." },
      2: { ru: 'Пять на шесть это тридцать, а не двадцать пять.', uz: "Besh ko'paytiruv olti bu o'ttiz, yigirma besh emas." }
    },
    setup_audio: { ru: 'Рано сажает светящиеся растения в саду. Она сделала пять ровных рядов, в каждом по шесть растений.', uz: "Ra'no bog'da nurli o'simlik ekmoqda. U beshta tekis qator qildi, har birida oltitadan o'simlik." },
    audio: {
      intro: { ru: 'Посчитай, сколько всего растений посадила Рано. Выбери верный ответ.', uz: "Ra'no jami nechta o'simlik ekkanini sana. To'g'ri javobni tanla." },
      on_correct: { ru: 'Верно. Пять рядов по шесть это тридцать растений.', uz: "To'g'ri. Besh qator oltitadan bu o'ttiz o'simlik." },
      on_wrong: { ru: 'Считай умножением: пять на шесть.', uz: "Ko'paytirish bilan sana: besh ko'paytiruv olti." }
    }
  },

  // s10 — FINAL panel (5 savol) + FactCard
  s10: {
    eyebrow: { ru: 'Финал', uz: 'Final' },
    intro_line: { ru: 'Городской компьютер проверит тебя. Пять заданий.', uz: "Shahar kompyuteri sizni tekshiradi. Beshta topshiriq." },
    items: [
      {
        kind: 'mc',
        q: { ru: 'Сколько будет 8 умножить на 7?', uz: '8 ni 7 ga ko\'paytirsa nechta?' },
        opt0: { ru: '56', uz: '56' },
        opt1: { ru: '54', uz: '54' },
        opt2: { ru: '15', uz: '15' },
        wrong_1: { ru: 'Восемь на семь это пятьдесят шесть, а не пятьдесят четыре.', uz: "Sakkiz ko'paytiruv yetti bu ellik olti, ellik to'rt emas." },
        wrong_2: { ru: 'Это умножение, а не сложение. Восемь на семь это 56.', uz: "Bu ko'paytirish, qo'shish emas. Sakkiz ko'paytiruv yetti bu 56." }
      },
      {
        kind: 'mc',
        q: { ru: 'Сколько будет 4 умножить на 9?', uz: '4 ni 9 ga ko\'paytirsa nechta?' },
        opt0: { ru: '36', uz: '36' },
        opt1: { ru: '32', uz: '32' },
        opt2: { ru: '13', uz: '13' },
        wrong_1: { ru: 'Четыре на девять это тридцать шесть.', uz: "To'rt ko'paytiruv to'qqiz bu o'ttiz olti." },
        wrong_2: { ru: 'Это умножение, а не сложение. Четыре на девять это 36.', uz: "Bu ko'paytirish, qo'shish emas. To'rt ko'paytiruv to'qqiz bu 36." }
      },
      {
        kind: 'num', ans: 48,
        q: { ru: 'Набери ответ: 6 × 8.', uz: "Javobni ter: 6 × 8." },
        hint: { ru: 'Шесть на восемь это сорок восемь.', uz: "Olti ko'paytiruv sakkiz bu qirq sakkiz." }
      },
      {
        kind: 'mc',
        q: { ru: 'Что верно про 3 × 4 и 4 × 3?', uz: "3 × 4 va 4 × 3 haqida qaysi to'g'ri?" },
        opt0: { ru: 'Равны, 12', uz: 'Teng, 12' },
        opt1: { ru: 'Разные', uz: 'Har xil' },
        opt2: { ru: 'Равны 7', uz: 'Teng 7' },
        wrong_1: { ru: 'Множители можно менять местами, ответ одинаковый: 12.', uz: "Ko'paytuvchilarni o'rin almashtirsa, javob bir xil: 12." },
        wrong_2: { ru: 'Это умножение, а не сложение. Оба равны 12.', uz: "Bu ko'paytirish, qo'shish emas. Ikkalasi ham 12." }
      },
      {
        kind: 'num', ans: 9,
        q: { ru: 'Загадка. Если меня умножить на 7, будет 63. Кто я?', uz: "Jumboq. Meni 7 ga ko'paytirsa, 63 chiqadi. Men kimman?" },
        hint: { ru: 'Какое число в таблице на семь даёт шестьдесят три? Это девять.', uz: "Yettiga ko'paytirilganda oltmish uch beradigan son qaysi? Bu to'qqiz." }
      }
    ],
    fact_badge: { ru: 'Знаешь?', uz: 'Bilasizmi?' },
    fact_text: { ru: 'Растения Бита сами светятся — это биолюминесценция. На Земле так светят некоторые грибы, светлячки и морские существа.', uz: "Bit sayyorasi o'simliklari o'zi porlaydi — bu bioluminessensiya. Yer'da ba'zi qo'ziqorin, olovqurt va dengiz jonivorlari shunday nur sochadi." },
    fact_audio: { ru: 'Растения Бита сами светятся. Это биолюминесценция. На Земле так светят некоторые грибы, светлячки и морские существа.', uz: "Bit sayyorasi o'simliklari o'zi porlaydi. Bu bioluminessensiya. Yer'da ba'zi qo'ziqorin, olovqurt va dengiz jonivorlari shunday nur sochadi." },
    audio: {
      intro: { ru: 'Финальная проверка. Городской компьютер показывает задания, отвечай на каждое.', uz: "Yakuniy tekshiruv. Shahar kompyuteri topshiriq ko'rsatadi, har biriga javob bering." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Посмотри разбор справа.', uz: "O'ngdagi tushuntirishga qarang." }
    }
  },

  // s11 — YAKUN
  s11: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    praise: { ru: 'Молодец!', uz: 'Barakalla!' },
    mission_done: { ru: 'Первый сад света засажен!', uz: "Birinchi nur bog'i ekildi!" },
    cando: { ru: 'Теперь ты видишь умножение в рядах и помнишь таблицу.', uz: "Endi siz qatorlarda ko'paytirishni ko'rasiz va jadvalni eslaysiz." },
    rule_recap: { ru: 'Умножение — короткая запись равных групп. Ряды и столбцы — массив. Множители можно менять местами.', uz: "Ko'paytirish — teng guruhlarning qisqa yozuvi. Qator va ustunlar — massiv. Ko'paytuvchilarni o'rin almashtirish mumkin." },
    conn_label_refs: { ru: 'Опирается на', uz: 'Tayanadi' },
    conn_refs: { ru: 'второй класс: смысл умножения', uz: "ikkinchi sinf: ko'paytirish ma'nosi" },
    conn_label_next: { ru: 'Дальше', uz: 'Keyingi' },
    conn_next: { ru: 'умножение и деление на 10 и 100', uz: "10 va 100 ga ko'paytirish va bo'lish" },
    audio: {
      ru: 'Первый сад света засажен. Мы вспомнили, что умножение это короткая запись равных групп, и увидели его в массиве из рядов и столбцов. Запомни. Первый множитель — сколько групп, второй — сколько в группе. А множители можно менять местами, ответ не изменится. В следующий раз научимся умножать и делить на десять и на сто.',
      uz: "Birinchi nur bog'i ekildi. Biz ko'paytirish teng guruhlarning qisqa yozuvi ekanini esladik va uni qator hamda ustunli massivda ko'rdik. Yodda tuting. Birinchi ko'paytuvchi — nechta guruh, ikkinchisi — guruhda nechta. Ko'paytuvchilarni o'rin almashtirsa, javob o'zgarmaydi. Keyingi safar o'nga va yuzga ko'paytirish va bo'lishni o'rganamiz."
    }
  }
};

// slaydlararo ko'priklar (audio-intro boshiga; ekranda ko'rinmaydi). TTS-toza.
const BRIDGES = {
  s1:  { ru: 'Вспомним про равные группы.', uz: 'Teng guruhlarni eslaymiz.' },
  s2:  { ru: 'Ряды и столбцы — массив.', uz: 'Qator va ustun — massiv.' },
  s3:  { ru: 'Умножение и сложение.', uz: "Ko'paytirish va qo'shish." },
  s4:  { ru: 'Повернём массив.', uz: 'Massivni aylantiramiz.' },
  s5:  { ru: 'Запишем это правилом.', uz: 'Buni qoida qilib olamiz.' },
  s6:  { ru: 'Правило знаем. Считай сам.', uz: "Qoidani bilamiz. O'zingiz sanang." },
  s7:  { ru: 'Теперь вспомни таблицу.', uz: 'Endi jadvalni esla.' },
  s8:  { ru: 'Проверим примеры на ошибку.', uz: 'Misollarni xatoga tekshiramiz.' },
  s9:  { ru: 'Рано сажает растения.', uz: "Ra'no o'simlik ekmoqda." },
  s10: { ru: 'Городской компьютер сделает финальную проверку.', uz: 'Shahar kompyuteri yakuniy tekshiradi.' },
  s11: { ru: 'Сад засажен. Идём дальше!', uz: 'Bog\' ekildi. Davom etamiz!' }
};

// s11 payoff (xulosadan oldin aytiladi)
const S11_PAYOFF = {
  ru: 'Миссия выполнена! Мы засадили первый сад света ровными рядами, посчитав всё умножением. Спасибо за помощь!',
  uz: "Missiya bajarildi! Biz birinchi nur bog'ini tekis qatorlarda ekdik, hammasini ko'paytirish bilan sanab. Yordamingiz uchun rahmat!"
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
      <GardenTerraceBg/>
      <div className="lm-scene-cast">
        {LUMO_CAST.slice(0, 2).map(kid)}
        <span className={`lm-crew lm-crew-host ${gathered ? 'd2-bit-cheer' : 'lm-bob'}`}><span className="g1-cast-fig"><BitSVG state={gathered ? 'happy' : 'present'}/></span></span>
        {LUMO_CAST.slice(2).map((c, i) => kid(c, i + 2))}
      </div>
    </div>
  );
};




// ============================================================
// EKRANLAR — Dars09 «Ko'paytirish jadvali» (Б2 «Nur bog'lari»)
// ============================================================



// --- NUR BOG'I TERRASALARI SAHNASI (D10): qatorli porlovchi o'simliklar (massiv)
const GardenTerraceBg = () => (
  <svg className="lm-scene-bg" viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="g0sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8E86C6"/><stop offset="48%" stopColor="#C79AB4"/><stop offset="100%" stopColor="#F0D2A0"/></linearGradient>
      <linearGradient id="g0wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E2CFAE"/><stop offset="100%" stopColor="#CBB488"/></linearGradient>
      <linearGradient id="g0floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#D6C29A"/><stop offset="100%" stopColor="#B69C70"/></linearGradient>
      <linearGradient id="g0col" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#B49A6E"/><stop offset="42%" stopColor="#E4D2AC"/><stop offset="100%" stopColor="#B49A6E"/></linearGradient>
      <linearGradient id="g0bed" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#A87E5C"/><stop offset="100%" stopColor="#7C5A3E"/></linearGradient>
      <radialGradient id="g0sun" cx="50%" cy="50%" r="55%"><stop offset="0%" stopColor="#FFE6B0"/><stop offset="55%" stopColor="#F0985A"/><stop offset="100%" stopColor="#C0502E" stopOpacity="0"/></radialGradient>
    </defs>
    {/* --- OSMON + sayyora + quyosh --- */}
    <rect x="0" y="0" width="400" height="130" fill="url(#g0sky)"/>
    <g><circle cx="70" cy="40" r="9" fill="#C79AD6"/><ellipse cx="70" cy="40" rx="16" ry="4" fill="none" stroke="#E6C8F0" strokeWidth="1.6" opacity="0.85"/></g>
    <circle cx="330" cy="42" r="18" fill="url(#g0sun)"/><circle cx="330" cy="42" r="8" fill="#FFD89A"/>
    {/* uzoq shahar silueti (bog' devori ortida) */}
    <g opacity="0.5" fill="#B98BA8"><rect x="60" y="98" width="16" height="24" rx="2"/><rect x="82" y="104" width="11" height="18" rx="2"/><rect x="300" y="100" width="14" height="22" rx="2"/><rect x="322" y="106" width="10" height="16" rx="2"/><rect x="180" y="96" width="13" height="26" rx="2"/></g>
    {/* bog' o'rtaligi (midground to'ldirish — oq bo'shliq bo'lmasin) */}
    <rect x="0" y="120" width="400" height="58" fill="url(#g0floor)"/>
    {/* --- BOG' DEVORI (past, panjarali) --- */}
    <rect x="0" y="120" width="400" height="12" fill="url(#g0wall)"/><rect x="0" y="118" width="400" height="4" rx="2" fill="#EAD9B8"/>
    <g stroke="#B49A6E" strokeWidth="1.2" opacity="0.6">{[40, 90, 140, 260, 310, 360].map((x, i) => <line key={i} x1={x} y1="122" x2={x} y2="130"/>)}</g>
    {/* --- MARKAZIY MASSIV: 3 x 4 o'simlik (ko'paytirish) --- */}
    <rect x="104" y="146" width="192" height="16" rx="4" fill="url(#g0bed)"/><rect x="104" y="146" width="192" height="4" rx="2" fill="#B78E64"/>
    <g><path d="M130 148 Q128 127 130 111" stroke="#6FBF8E" strokeWidth="2.2" fill="none"/><path d="M130 126 q-7 -3 -10 -9 q8 1 11 7Z" fill="#7CCFA0"/><path d="M130 120 q7 -3 10 -9 q-8 1 -11 7Z" fill="#8FD8B0"/><circle cx="130" cy="106" r="6" fill="#FFA6D0" stroke="#E87FB0" strokeWidth="1"/><circle className="lm-glow" style={{ animationDelay: '0s' }} cx="130" cy="106" r="3" fill="#FFF4D0"/></g>
    <g><path d="M172 148 Q170 127 172 111" stroke="#6FBF8E" strokeWidth="2.2" fill="none"/><path d="M172 126 q-7 -3 -10 -9 q8 1 11 7Z" fill="#7CCFA0"/><path d="M172 120 q7 -3 10 -9 q-8 1 -11 7Z" fill="#8FD8B0"/><circle cx="172" cy="106" r="6" fill="#8FE8C0" stroke="#5FC898" strokeWidth="1"/><circle className="lm-glow" style={{ animationDelay: '0.18s' }} cx="172" cy="106" r="3" fill="#FFF4D0"/></g>
    <g><path d="M214 148 Q212 127 214 111" stroke="#6FBF8E" strokeWidth="2.2" fill="none"/><path d="M214 126 q-7 -3 -10 -9 q8 1 11 7Z" fill="#7CCFA0"/><path d="M214 120 q7 -3 10 -9 q-8 1 -11 7Z" fill="#8FD8B0"/><circle cx="214" cy="106" r="6" fill="#FFA6D0" stroke="#E87FB0" strokeWidth="1"/><circle className="lm-glow" style={{ animationDelay: '0.36s' }} cx="214" cy="106" r="3" fill="#FFF4D0"/></g>
    <g><path d="M256 148 Q254 127 256 111" stroke="#6FBF8E" strokeWidth="2.2" fill="none"/><path d="M256 126 q-7 -3 -10 -9 q8 1 11 7Z" fill="#7CCFA0"/><path d="M256 120 q7 -3 10 -9 q-8 1 -11 7Z" fill="#8FD8B0"/><circle cx="256" cy="106" r="6" fill="#8FE8C0" stroke="#5FC898" strokeWidth="1"/><circle className="lm-glow" style={{ animationDelay: '0.54s' }} cx="256" cy="106" r="3" fill="#FFF4D0"/></g>
    <g><path d="M130 148 Q128 136 130 129" stroke="#6FBF8E" strokeWidth="2.2" fill="none"/><path d="M130 144 q-7 -3 -10 -9 q8 1 11 7Z" fill="#7CCFA0"/><path d="M130 138 q7 -3 10 -9 q-8 1 -11 7Z" fill="#8FD8B0"/><circle cx="130" cy="124" r="6" fill="#8FE8C0" stroke="#5FC898" strokeWidth="1"/><circle className="lm-glow" style={{ animationDelay: '0.72s' }} cx="130" cy="124" r="3" fill="#FFF4D0"/></g>
    <g><path d="M172 148 Q170 136 172 129" stroke="#6FBF8E" strokeWidth="2.2" fill="none"/><path d="M172 144 q-7 -3 -10 -9 q8 1 11 7Z" fill="#7CCFA0"/><path d="M172 138 q7 -3 10 -9 q-8 1 -11 7Z" fill="#8FD8B0"/><circle cx="172" cy="124" r="6" fill="#FFA6D0" stroke="#E87FB0" strokeWidth="1"/><circle className="lm-glow" style={{ animationDelay: '0.8999999999999999s' }} cx="172" cy="124" r="3" fill="#FFF4D0"/></g>
    <g><path d="M214 148 Q212 136 214 129" stroke="#6FBF8E" strokeWidth="2.2" fill="none"/><path d="M214 144 q-7 -3 -10 -9 q8 1 11 7Z" fill="#7CCFA0"/><path d="M214 138 q7 -3 10 -9 q-8 1 -11 7Z" fill="#8FD8B0"/><circle cx="214" cy="124" r="6" fill="#8FE8C0" stroke="#5FC898" strokeWidth="1"/><circle className="lm-glow" style={{ animationDelay: '1.08s' }} cx="214" cy="124" r="3" fill="#FFF4D0"/></g>
    <g><path d="M256 148 Q254 136 256 129" stroke="#6FBF8E" strokeWidth="2.2" fill="none"/><path d="M256 144 q-7 -3 -10 -9 q8 1 11 7Z" fill="#7CCFA0"/><path d="M256 138 q7 -3 10 -9 q-8 1 -11 7Z" fill="#8FD8B0"/><circle cx="256" cy="124" r="6" fill="#FFA6D0" stroke="#E87FB0" strokeWidth="1"/><circle className="lm-glow" style={{ animationDelay: '1.26s' }} cx="256" cy="124" r="3" fill="#FFF4D0"/></g>
    <g><path d="M130 148 Q128 145 130 147" stroke="#6FBF8E" strokeWidth="2.2" fill="none"/><path d="M130 162 q-7 -3 -10 -9 q8 1 11 7Z" fill="#7CCFA0"/><path d="M130 156 q7 -3 10 -9 q-8 1 -11 7Z" fill="#8FD8B0"/><circle cx="130" cy="142" r="6" fill="#FFA6D0" stroke="#E87FB0" strokeWidth="1"/><circle className="lm-glow" style={{ animationDelay: '1.44s' }} cx="130" cy="142" r="3" fill="#FFF4D0"/></g>
    <g><path d="M172 148 Q170 145 172 147" stroke="#6FBF8E" strokeWidth="2.2" fill="none"/><path d="M172 162 q-7 -3 -10 -9 q8 1 11 7Z" fill="#7CCFA0"/><path d="M172 156 q7 -3 10 -9 q-8 1 -11 7Z" fill="#8FD8B0"/><circle cx="172" cy="142" r="6" fill="#8FE8C0" stroke="#5FC898" strokeWidth="1"/><circle className="lm-glow" style={{ animationDelay: '1.6199999999999999s' }} cx="172" cy="142" r="3" fill="#FFF4D0"/></g>
    <g><path d="M214 148 Q212 145 214 147" stroke="#6FBF8E" strokeWidth="2.2" fill="none"/><path d="M214 162 q-7 -3 -10 -9 q8 1 11 7Z" fill="#7CCFA0"/><path d="M214 156 q7 -3 10 -9 q-8 1 -11 7Z" fill="#8FD8B0"/><circle cx="214" cy="142" r="6" fill="#FFA6D0" stroke="#E87FB0" strokeWidth="1"/><circle className="lm-glow" style={{ animationDelay: '1.7999999999999998s' }} cx="214" cy="142" r="3" fill="#FFF4D0"/></g>
    <g><path d="M256 148 Q254 145 256 147" stroke="#6FBF8E" strokeWidth="2.2" fill="none"/><path d="M256 162 q-7 -3 -10 -9 q8 1 11 7Z" fill="#7CCFA0"/><path d="M256 156 q7 -3 10 -9 q-8 1 -11 7Z" fill="#8FD8B0"/><circle cx="256" cy="142" r="6" fill="#8FE8C0" stroke="#5FC898" strokeWidth="1"/><circle className="lm-glow" style={{ animationDelay: '1.98s' }} cx="256" cy="142" r="3" fill="#FFF4D0"/></g>
    {/* massiv ramkasi + tenglama banneri (pergoladan osilgan) */}
    <path d="M160 52 h80 v14 l-6 5 l-6 -5 l-6 5 l-6 -5 l-6 5 l-6 -5 l-6 5 l-6 -5 l-6 5 l-6 -5 l-6 5 Z" fill="#E8B4C4" stroke="#D08FA6" strokeWidth="1"/>
    <text x="200" y="63" textAnchor="middle" fontSize="11" fontWeight="800" fill="#8A4E64" fontFamily="'JetBrains Mono', monospace">3 × 4 = 12</text>
    {/* --- PERGOLA (ramka: 2 ustun + ustki to'sinlar + osma uzumcha) --- */}
    {[26, 356].map((x, i) => (
      <g key={`col${i}`}>
        <rect x={x - 6} y="40" width="30" height="12" rx="3" fill="url(#g0col)" stroke="#9A855C" strokeWidth="1"/>
        <rect x={x} y="52" width="18" height="124" fill="url(#g0col)" stroke="#9A855C" strokeWidth="1"/>
        <rect x={x - 4} y="168" width="26" height="10" rx="2" fill="url(#g0col)" stroke="#9A855C" strokeWidth="1"/>
        <path d={`M${x + 9} 66 Q${x + 3} 90 ${x + 9} 116 Q${x + 15} 140 ${x + 9} 164`} fill="none" stroke="#6FBF8E" strokeWidth="2"/>
        <g fill="#8FD8A8">{[80, 120, 150].map((cy, k) => <circle key={k} cx={x + (k % 2 ? 4 : 14)} cy={cy} r="2.4"/>)}</g>
      </g>
    ))}
    {/* ustki to'sinlar */}
    <g fill="url(#g0col)" stroke="#9A855C" strokeWidth="0.8" opacity="0.9">{[44, 92, 140, 200, 260, 308, 356].map((x, i) => <rect key={i} x={x} y="40" width="8" height="7" rx="2"/>)}</g>
    <rect x="30" y="40" width="340" height="6" rx="2" fill="#C9B084"/>
    {/* osma gul-savatlar */}
    {[120, 280].map((x, i) => (
      <g key={`bk${i}`}><line x1={x} y1="46" x2={x} y2="58" stroke="#9A855C" strokeWidth="1"/><path d={`M${x - 8} 58 h16 l-2 8 h-12 Z`} fill="#B78E64"/><circle className="lm-glow" cx={x} cy="60" r="3.5" fill="#FFB6D0"/></g>
    ))}
    {/* --- POL: bog' yo'lagi + perspektiva --- */}
    <rect x="0" y="176" width="400" height="54" fill="url(#g0floor)"/>
    <line x1="0" y1="176" x2="400" y2="176" stroke="#9A8058" strokeWidth="2"/>
    <g stroke="#A98C64" strokeWidth="1" opacity="0.4"><path d="M40 230 L182 178"/><path d="M140 230 L196 178"/><path d="M260 230 L204 178"/><path d="M360 230 L218 178"/></g>
    {/* --- OLD PLAN: gultuvaklar + kapalak --- */}
    <g transform="translate(20 176)"><path d="M-10 0 h20 l-3 -14 h-14 Z" fill="#C98A6A"/><path d="M0 -14 Q-4 -28 0 -34" stroke="#6FBF8E" strokeWidth="2.4" fill="none"/><circle className="lm-glow" cx="0" cy="-36" r="5" fill="#FFB6D0"/><path d="M-4 -22 q-8 -3 -11 -10 q9 1 12 8Z" fill="#8FD8B8"/></g>
    <g transform="translate(380 176)"><path d="M-9 0 h18 l-3 -12 h-12 Z" fill="#C98A6A"/><path d="M0 -12 Q3 -24 0 -30" stroke="#6FBF8E" strokeWidth="2.2" fill="none"/><circle className="lm-glow" cx="0" cy="-32" r="4.2" fill="#8FE8C0"/></g>
    <g className="lm-float"><g transform="translate(300 96)"><path d="M0 0 q-5 -4 -9 0 q4 3 9 0 q5 -4 9 0 q-4 3 -9 0Z" fill="#FFA6D0" opacity="0.9"/><circle cx="0" cy="0" r="1.4" fill="#FFF"/></g></g>
    <g><circle className="lm-glow" cx="110" cy="80" r="1.5" fill="#FFE0B0"/><circle className="lm-glow" style={{ animationDelay: '1s' }} cx="290" cy="70" r="1.4" fill="#CFE8FF"/></g>
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
      <GardenTerraceBg/>
      <div className="lm-scene-cast">
        {LUMO_CAST.slice(0, 2).map(kid)}
        <span className={`lm-crew lm-crew-host ${gathered ? 'd2-bit-cheer' : 'lm-bob'}`}><span className="g1-cast-fig"><BitSVG state={gathered ? 'happy' : 'present'}/></span></span>
        {LUMO_CAST.slice(2).map((c, i) => kid(c, i + 2))}
      </div>
    </div>
  );
};

// --- MASSIV (nurli o'simlik qatorlari): rows x cols Chiroq.
const ArrayViz = ({ rows, cols }) => (
  <div style={{ display: 'inline-grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 'clamp(3px, 1vw, 7px)', padding: 'clamp(7px, 1.8vw, 13px)', background: '#152342', borderRadius: 12 }}>
    {Array.from({ length: rows * cols }).map((_, i) => (
      <span key={i} className="g1-pop-in" style={{ animationDelay: `${i * 0.03}s`, width: 'clamp(14px, 4vw, 24px)', height: 'clamp(14px, 4vw, 24px)', display: 'inline-flex' }}><Chiroq/></span>
    ))}
  </div>
);

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


const NumPad = ({ value, setValue, disabled, max = 2 }) => {
  const push = (d) => { if (disabled) return; setValue((v) => (v.length >= max ? v : v + d)); };
  const back = () => { if (disabled) return; setValue((v) => v.slice(0, -1)); };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div className="mono" style={{ minWidth: 120, height: 'clamp(40px, min(46px, 6.1dvh), 46px)', borderRadius: 12, border: `2.5px solid ${T.accent}`, background: T.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, color: T.ink, letterSpacing: 4, padding: '0 14px' }}>{value || '—'}</div>
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

// --- KO'P-RAUNDLI MC (heading/renderFig render-props).
const MCRoundD2 = ({ props, ck, heading, renderFig, cols = 2 }) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT[ck];
  // Variantlar har mount'da aralashadi (to'g'ri javob doim 1-o'rinda qolmasin).
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
            <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(12px, 2.4vw, 18px)', padding: 'clamp(14px, 2.6vw, 20px)' }}>
              <FrameFx/>
              {renderFig(it)}
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(90px, 1fr))`, gap: 10, width: '100%' }}>
                {it.opts.map((o, i) => (
                  <button key={i} className={`option ${okPick === i ? 'option-correct' : ''} ${wrongSet.has(i) ? 'option-picked-wrong' : ''}`} disabled={!canAct || okPick !== null || wrongSet.has(i)} onClick={() => pick(i)}
                    style={{ padding: 'clamp(10px, 1.6vw, 13px)', fontSize: 'clamp(17px, 2.8vw, 22px)', minHeight: 'clamp(46px, 6.5vw, 56px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>{t(o)}</button>
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

// s0 — HOOK
const Screen0 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s0;
  const audio = useAudio(c.audio.intro[lang].map((text, i) => ({
    id: `s0_${i}`, text, trigger: i === 0 ? 'on_mount' : 'after_previous', waits_for: null
  })));
  const canAct = useCanAnswer(audio);
  const [picked, setPicked] = useState(null);
  const ok = picked === 0;
  const fbKey = (i) => (i === 0 ? 'on_correct' : 'on_wrong');
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
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <div className="fade-up" style={{ alignSelf: 'center', background: T.accentSoft, color: T.accent, fontWeight: 800, fontSize: 'clamp(12px, 1.8vw, 15px)', padding: '5px 14px', borderRadius: 999 }}>{t(c.topic)}</div>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ padding: 'clamp(8px, 1.8vw, 14px)', overflow: 'hidden' }}>
          <LessonScene gathered={ok}/>
        </div>
        <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(14px, 2.8vw, 22px)' }}>
          <ArrayViz rows={c.rows} cols={c.cols}/>
        </div>
        <p className="fade-up delay-1" style={{ textAlign: 'center', color: T.ink2, fontWeight: 600, fontSize: 'clamp(14px, 1.9vw, 17px)', margin: 0 }}>{t(c.q)}</p>
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

// s1 — RECALL
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
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: 'clamp(16px, 3vw, 24px)', minHeight: 'clamp(150px, 32vw, 200px)' }}>
          <div style={{ display: 'flex', gap: 'clamp(8px, 2.4vw, 16px)' }}>
            {[0, 1, 2].map((g) => (
              <div key={g} style={{ display: 'inline-grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 4, padding: 6, background: '#152342', borderRadius: 10 }}>
                {[0, 1, 2, 3].map((k) => <span key={k} style={{ width: 'clamp(13px, 3.6vw, 20px)', height: 'clamp(13px, 3.6vw, 20px)', display: 'inline-flex' }}><Chiroq/></span>)}
              </div>
            ))}
          </div>
          {reached >= 1 && <span className="mono lm-reveal" style={{ fontSize: 'clamp(20px, 4vw, 30px)', fontWeight: 800, color: T.success }}>3 × 4 = 12</span>}
        </div>
      </div>
    </Stage>
  );
};

// s2 — MASSIV
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
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: 'clamp(16px, 3vw, 24px)', minHeight: 'clamp(150px, 32vw, 200px)' }}>
          <ArrayViz rows={c.rows} cols={c.cols}/>
          {reached >= 1 && <span className="mono lm-reveal" style={{ fontSize: 'clamp(20px, 4vw, 30px)', fontWeight: 800, color: reached >= 2 ? T.success : T.ink }}>{c.rows} × {c.cols}{reached >= 2 ? ` = ${c.product}` : ''}</span>}
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

// s3 — KO'PAYTIRISH = takroriy qo'shish
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
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 'clamp(16px, 3vw, 24px)', minHeight: 'clamp(160px, 34vw, 210px)' }}>
          <ArrayViz rows={c.rows} cols={c.cols}/>
          <span className="mono" style={{ fontSize: 'clamp(17px, 3.4vw, 24px)', fontWeight: 800, color: T.blue }}>{lang === 'ru' ? c.sum_ru : c.sum_uz}</span>
          {reached >= 1 && (
            <span className="mono lm-reveal" style={{ fontSize: 'clamp(19px, 3.8vw, 27px)', fontWeight: 800, color: T.accent }}>{lang === 'ru' ? c.mul_ru : c.mul_uz}{reached >= 2 ? ` = ${c.product}` : ''}</span>
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

// s4 — O'RIN ALMASHINUVI
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
  const showSwap = reached >= 1;
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
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: 'clamp(16px, 3vw, 24px)', minHeight: 'clamp(160px, 34vw, 210px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(10px, 3vw, 22px)', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <ArrayViz rows={c.a} cols={c.b}/>
              <span className="mono" style={{ fontSize: 'clamp(14px, 2.6vw, 18px)', fontWeight: 800, color: T.ink }}>{c.a} × {c.b}</span>
            </div>
            {showSwap && (
              <div className="lm-reveal" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(10px, 3vw, 22px)' }}>
                <span className="mono" style={{ fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 800, color: T.ink3 }}>=</span>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <ArrayViz rows={c.b} cols={c.a}/>
                  <span className="mono" style={{ fontSize: 'clamp(14px, 2.6vw, 18px)', fontWeight: 800, color: T.ink }}>{c.b} × {c.a}</span>
                </div>
              </div>
            )}
          </div>
          {reached >= 2 && <span className="mono lm-reveal" style={{ fontSize: 'clamp(18px, 3.6vw, 26px)', fontWeight: 800, color: T.success }}>= {c.product}</span>}
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

// s5 — QOIDA + check
const Screen5 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s5;
  const sfx = useSfx();
  const audio = useAudio([
    brgSeg('s5', lang),
    ...c.audio[lang].map((text, i) => ({ id: `s5_${i}`, text, trigger: 'after_previous', waits_for: null }))
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
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(10px, 2vw, 14px)', padding: 'clamp(14px, 2.6vw, 22px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <ArrayViz rows={c.a} cols={c.b}/>
            <span className="mono" style={{ fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 800, color: T.ink }}>{c.a} × {c.b}</span>
          </div>
          <p style={{ textAlign: 'center', color: T.ink2, fontWeight: 700, margin: 0 }}>{ok ? t(c.check_ok) : (picked !== null ? t(c.check_no) : t(c.check_q))}</p>
          <div style={{ display: 'flex', gap: 10 }}>
            {order.map((k, i) => (
              <button key={i} className={`option ${ok && i === ci ? 'option-correct' : ''} ${picked === i && i !== ci ? 'option-picked-wrong' : ''}`} disabled={!canAct || ok} onClick={() => pick(i)}
                style={{ padding: 'clamp(10px, 1.6vw, 13px) clamp(16px, 2.4vw, 22px)', fontSize: 'clamp(17px, 2.8vw, 22px)', minHeight: 'clamp(46px, 6.5vw, 56px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>{c.check_opts[k]}</button>
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

// s6 — MASHQ massiv -> ko'paytma (MC)
const Screen6 = (props) => {
  const t = useT();
  const c = CONTENT.s6;
  const heading = () => t(c.q);
  const renderFig = (it) => <ArrayViz rows={it.rows} cols={it.cols}/>;
  return <MCRoundD2 props={props} ck="s6" cols={3} heading={heading} renderFig={renderFig}/>;
};

// s7 — MASHQ jadval eslash (MC)
const Screen7 = (props) => {
  const t = useT();
  const c = CONTENT.s7;
  const heading = () => t(c.q);
  const renderFig = (it) => <span className="mono" style={{ fontSize: 'clamp(30px, 7vw, 46px)', fontWeight: 800, color: T.ink }}>{it.a} × {it.b}</span>;
  return <MCRoundD2 props={props} ck="s7" cols={3} heading={heading} renderFig={renderFig}/>;
};

// s8 — MASHQ xatoni top
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
              {it.stmts.map((stmt, i) => (
                <button key={i} className={`option ${wrongSet.has(i) ? 'option-picked-wrong' : ''} ${solvedRound && i === it.wrong ? 'option-correct' : ''}`} disabled={!canAct || solvedRound || wrongSet.has(i)} onClick={() => pick(i)}
                  style={{ padding: 'clamp(10px, 1.6vw, 14px)', minHeight: 'clamp(46px, 6.5vw, 56px)', fontSize: 'clamp(16px, 3vw, 22px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, letterSpacing: 1 }}>{stmt}</button>
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

// s9 — MASALA (case): nur bog'i
const Screen9 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s9;
  const sfx = useSfx();
  // Variantlar har mount'da aralashadi (to'g'ri javob doim 1-o'rinda qolmasin).
  const order = React.useMemo(() => shuffleArr([0, 1, 2]), []);
  const opts = order.map((k) => c.opts[k]);
  const ci = order.indexOf(c.ci);
  const hints = order.map((k) => c.hints[k]);
  const audio = useAudio([
    brgSeg('s9', lang),
    { id: 's9_setup', text: c.setup_audio[lang], trigger: 'after_previous', waits_for: null },
    { id: 's9_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [picked, setPicked] = useState(props.storedAnswer ? props.storedAnswer.studentAnswerIndex : null);
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const solved = picked === ci || props.storedAnswer?.correct === true;
  const firstRef = useRef(props.storedAnswer ? props.storedAnswer.firstTry : null);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const revealRef = useRevealScroll(solved, 500);
  const pick = (i) => {
    if (!canAct || solved || wrongSet.has(i)) return;
    if (i === ci) {
      setPicked(i); sfx.playCorrect();
      if (firstRef.current === null) firstRef.current = wrongSet.size === 0;
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_correct[lang]); }
    } else {
      const n = new Set(wrongSet); n.add(i); setWrongSet(n);
      firstRef.current = false;
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((hints[i] || c.audio.on_wrong)[lang]); }
    }
  };
  useEffect(() => {
    if (solved && !recorded) {
      setRecorded(true);
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: t(c.q),
        studentAnswerIndex: ci, correctAnswer: String(c.opts[c.ci][lang]), studentAnswer: String(c.opts[c.ci][lang]), correct: firstRef.current === null ? true : firstRef.current,
        firstTry: firstRef.current === null ? true : firstRef.current, attempts: 1, solved: true
      });
    }
  }, [solved]);
  const canAdv = useAdvanceGate(solved, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  const hintMsg = wrongSet.size > 0 ? [...wrongSet].map((i) => hints[i]).filter(Boolean).slice(-1)[0] : null;
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <p className="fade-up" style={{ textAlign: 'center', color: T.ink2, fontWeight: 700, margin: 0 }}>{t(c.lead)}</p>
        <h1 className="title h-sub fade-up delay-1" style={{ margin: 0 }}>{t(c.q)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(12px, 2.4vw, 16px)', padding: 'clamp(14px, 2.6vw, 20px)' }}>
          <FrameFx/>
          <ArrayViz rows={c.rows} cols={c.cols}/>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, width: '100%' }}>
            {opts.map((o, i) => (
              <button key={i} className={`option ${wrongSet.has(i) ? 'option-picked-wrong' : ''} ${solved && i === ci ? 'option-correct' : ''}`} disabled={!canAct || solved || wrongSet.has(i)} onClick={() => pick(i)}
                style={{ padding: 'clamp(10px, 1.6vw, 13px)', fontSize: 'clamp(17px, 2.8vw, 22px)', minHeight: 'clamp(46px, 6.5vw, 56px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>{t(o)}</button>
            ))}
          </div>
          {hintMsg && !solved && <p className="fade-up" style={{ margin: 0, color: T.ink2, textAlign: 'center', fontSize: 'clamp(13px, 1.7vw, 15px)' }}>{t(hintMsg)}</p>}
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

// s10 — FINAL panel (5 savol aralash) + FactCard
const Screen10 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s10;
  const items = c.items;
  // Final MC variantlari har mount'da aralashadi. orders[idx][pos] = ASL indeks; to'g'ri = ASL 0.
  const orders = React.useMemo(() => items.map((it) => it.kind === 'num' ? null : shuffleArr([0, 1, 2])), []);
  const audio = useAudio([
    brgSeg('s10', lang),
    { id: 's10_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
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
                      style={{ padding: 'clamp(10px, 1.6vw, 13px)', fontSize: 'clamp(15px, 2.4vw, 20px)', minHeight: 'clamp(46px, 6.5vw, 56px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>
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

// s11 — YAKUN
const Screen11 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s11;
  const audio = useAudio([
    { id: 's11_pay', text: S11_PAYOFF[lang], trigger: 'on_mount', waits_for: null },
    { id: 's11_sum', text: c.audio[lang], trigger: 'after_previous', waits_for: null }
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
export default function MultTableLesson({
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11];
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
