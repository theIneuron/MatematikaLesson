import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { BackLabel, BigNum, BitSVG, Chiroq, Confetti, D2Defs, D2Motes, FREE_NAV, FeedbackBlock, FrameFx, GradientDefs, HeroContext, LUMO_CAST, LangContext, Lenta, NavBack, NavNext, NextLabel, Panel, ProgressContext, Reaction, ReadinessMeter, Stage, StageHero, T, configureLesson, getAudioEngine, npKey, shuffleArr, ttsConfig, useAdvanceGate, useAudio, useCanAnswer, useLang, useMobileZoom, usePrefersReducedMotion, useRevealScroll, useSfx, useT, makeBrgSeg } from './_kit/index.jsx';
import { BASE_STYLES } from './_kit/styles.js';

// ============================================================================
// DD 3-SINF | Dars04 — "Uch xonali sonlarni taqqoslash" (num-3-04) | B1 | > < =
// Syujet: Bit sayyorasi LUMO, ikki tuman (SYUJET_3SINF.md B1 d.4). Qaysi tumanda chiroq
//   ko'p? Sonlarni xonama-xona, chapdan o'ngga taqqoslaymiz. Bit — mezbon-gid.
// Infra: grade3 Dars01.jsx (etalon nomzodi) dan BAYT-ANIQ ko'chirildi. O'zgarmadi.
// YADRO: chapdan o'ngga xonama-xona; yuzlik hal qiladi, teng bo'lsa o'nlik, keyin birlik; belgi kattaga.
// MEXANIKA: recall og'irlik (s1), yuzlik hal (s2), o'nlik hal (s3), birlik hal (s4), belgi+ayyor 600/599 (s5),
//   QOIDA (s6), belgi qo'yish (s7), kattasini tanla (s8), xatoni top (s9), tuman masala (s10),
//   final panel (s11), yakun (s12). CompareViz/CompareRound (etalon taqqoslash UI).
// Misconception: M1 oxirgi raqamdan taqqoslash, M2 belgi yo'nalishi, M3 raqam sonidan (600<599),
//   M4 raqamlar yig'indisidan.
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
const TOTAL_SCREENS = 13;
const LESSON_META = {
  lessonId: 'num-3-04',
  lessonTitle: { ru: 'Урок 4. Сравнение трёхзначных чисел', uz: "4-dars. Uch xonali sonlarni taqqoslash" }
};
// STRUKTURA: s0 hook · s1–s5 tushuntirish · s6 qoida · s7–s10 mashq · s11 final · s12 xulosa (13 ekran).
// Syujet: Bit sayyorasi Lumo, uch xonali sonlarni taqqoslash (SYUJET_3SINF.md Б1 d.4).
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'MCScreen', scored: false, scope: 'hook' },
  { id: 's1',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's4',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's5',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's6',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's7',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's8',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's9',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's10', type: 'case',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's11', type: 'test',        template: 'custom',   scored: true,  scope: 'final' },
  { id: 's12', type: 'summary',     template: 'custom',   scored: false, scope: 'final' }
];





// ============================================================
// CONTENT — 3-sinf Dars04 «Uch xonali sonlarni taqqoslash» (num-3-04). RU + UZ to'liq.
// Audio TTS-toza: sonlar so'z bilan, «» va matematik belgilar yo'q, bir segment = bir fikr.
// Rekvizit: chiroq (birlik) · lenta = 10 chiroq (o'nlik) · panel = 10 lenta (yuzlik). Lumo shahri.
// ============================================================

const CONTENT = {
  // s0 — HOOK: ikki tuman, qaysida ko'p chiroq? (462 vs 458, o'nlik hal qiladi)
  s0: {
    eyebrow: { ru: 'Миссия', uz: 'Missiya' },
    topic: { ru: 'Тема: сравнение чисел', uz: 'Mavzu: sonlarni taqqoslash' },
    lead: { ru: 'Два района города. Огни сосчитаны.', uz: 'Shaharning ikki tumani. Chiroqlar sanalgan.' },
    a: 462, b: 458,
    q: { ru: 'В каком районе больше огней?', uz: 'Qaysi tumanda chiroq ko\'p?' },
    opt0: { ru: '462', uz: '462' },
    opt1: { ru: '458', uz: '458' },
    opt2: { ru: 'Поровну', uz: 'Teng' },
    audio: {
      intro: {
        ru: [
          'Тема урока — сравнение трёхзначных чисел. Научимся понимать, какое число больше.',
          'В прошлой области мы раскладывали числа. Теперь Бит показывает два района своего города.',
          'В одном районе четыреста шестьдесят два огня, в другом четыреста пятьдесят восемь.',
          'Как думаешь, в каком районе огней больше? Выбери один вариант.'
        ],
        uz: [
          "Dars mavzusi — uch xonali sonlarni taqqoslash. Qaysi son katta ekanini bilishni o'rganamiz.",
          "O'tgan hududda sonlarni ajratdik. Endi Bit o'z shahrining ikki tumanini ko'rsatadi.",
          "Bir tumanda to'rt yuz oltmish ikki chiroq, boshqasida to'rt yuz ellik sakkiz.",
          "Sizningcha, qaysi tumanda chiroq ko'proq? Bittasini tanlang."
        ]
      },
      on_correct: { ru: 'Верно. Сотни равны, а десятков в первом больше: шесть больше пяти.', uz: "To'g'ri. Yuzliklar teng, birinchisida o'nlik ko'proq: olti beshdan katta." },
      on_wrong: { ru: 'Смотри не на последнюю цифру, а по разрядам слева. Проверим вместе.', uz: "Oxirgi raqamga emas, chapdan xonalarga qarang. Birga tekshiramiz." }
    }
  },

  // s1 — RECALL: chap raqam eng og'ir (o'rin qiymati)
  s1: {
    eyebrow: { ru: 'Вспомним и откроем', uz: 'Eslaymiz va ochamiz' },
    lead: { ru: 'Левый разряд — самый весомый.', uz: "Chap xona eng og'ir." },
    audio: {
      ru: [
        'Вспомним. В трёхзначном числе слева сотни, потом десятки, потом единицы.',
        'Сотни весят больше всех. Одна сотня это сто, а один десяток только десять.',
        'Поэтому сравнивать числа начинаем слева, с самого весомого разряда.'
      ],
      uz: [
        "Eslaymiz. Uch xonali sonda chapda yuzlik, keyin o'nlik, keyin birlik.",
        "Yuzlik hammadan og'ir. Bitta yuzlik bu yuz, bitta o'nlik esa atigi o'n.",
        "Shuning uchun sonlarni chapdan, eng og'ir xonadan boshlab taqqoslaymiz."
      ]
    }
  },

  // s2 — YUZLIK hal qiladi: 523 vs 481
  s2: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: { ru: 'Сначала сравниваем сотни.', uz: 'Avval yuzliklarni taqqoslaymiz.' },
    a: 523, b: 481, place: 'h', sign: '>',
    done_text: { ru: 'Пять сотен больше четырёх. Значит 523 больше, остальное не важно.', uz: "Besh yuzlik to'rtdan katta. Demak 523 katta, qolgani muhim emas." },
    audio: {
      ru: [
        'Сравним пятьсот двадцать три и четыреста восемьдесят один. Смотрим сотни.',
        'В первом числе пять сотен, во втором четыре. Пять больше четырёх.',
        'Значит пятьсот двадцать три больше. Когда сотни разные, дальше можно не смотреть.'
      ],
      uz: [
        "Besh yuz yigirma uch va to'rt yuz sakson birni taqqoslaymiz. Yuzliklarga qaraymiz.",
        "Birinchi sonda besh yuzlik, ikkinchisida to'rt. Besh to'rtdan katta.",
        "Demak besh yuz yigirma uch katta. Yuzliklar har xil bo'lsa, keyingisiga qaramasa ham bo'ladi."
      ]
    }
  },

  // s3 — O'NLIK hal qiladi: 345 vs 354 (yuzlik teng)
  s3: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: { ru: 'Сотни равны — смотрим десятки.', uz: "Yuzliklar teng — o'nliklarga qaraymiz." },
    a: 345, b: 354, place: 't', sign: '<',
    done_text: { ru: 'Сотни равны. В десятках четыре меньше пяти, значит 345 меньше 354.', uz: "Yuzliklar teng. O'nlikda to'rt beshdan kichik, demak 345 kichik 354 dan." },
    audio: {
      ru: [
        'Сравним триста сорок пять и триста пятьдесят четыре. В сотнях у обоих по три, они равны.',
        'Раз сотни равны, смотрим следующий разряд, десятки.',
        'Четыре десятка меньше пяти десятков. Значит триста сорок пять меньше триста пятьдесят четыре.'
      ],
      uz: [
        "Uch yuz qirq besh va uch yuz ellik to'rtni taqqoslaymiz. Yuzlikda ikkovida uchtadan, ular teng.",
        "Yuzliklar teng ekan, keyingi xonaga, o'nlikka qaraymiz.",
        "To'rt o'nlik besh o'nlikdan kichik. Demak uch yuz qirq besh kichik uch yuz ellik to'rtdan."
      ]
    }
  },

  // s4 — BIRLIK hal qiladi: 272 vs 276 (yuzlik+o'nlik teng)
  s4: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: { ru: 'Сотни и десятки равны — смотрим единицы.', uz: "Yuzlik va o'nlik teng — birlikka qaraymiz." },
    a: 272, b: 276, place: 'o', sign: '<',
    done_text: { ru: 'Сотни и десятки равны. В единицах два меньше шести, значит 272 меньше 276.', uz: "Yuzlik va o'nlik teng. Birlikda ikki oltidan kichik, demak 272 kichik 276 dan." },
    audio: {
      ru: [
        'Сравним двести семьдесят два и двести семьдесят шесть. Сотни равны, десятки тоже равны.',
        'Остаётся последний разряд, единицы.',
        'Два меньше шести. Значит двести семьдесят два меньше двести семьдесят шесть.'
      ],
      uz: [
        "Ikki yuz yetmish ikki va ikki yuz yetmish oltini taqqoslaymiz. Yuzliklar teng, o'nliklar ham teng.",
        "Oxirgi xona, birlik qoldi.",
        "Ikki oltidan kichik. Demak ikki yuz yetmish ikki kichik ikki yuz yetmish oltidan."
      ]
    }
  },

  // s5 — BELGI ma'nosi + tricky 600 vs 599
  s5: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: { ru: 'Открытый рот знака смотрит на большее.', uz: "Belgining ochiq og'zi kattaga qaraydi." },
    a: 600, b: 599, place: 'h', sign: '>',
    done_text: { ru: 'Шесть сотен больше пяти. Значит 600 больше 599, хотя во втором много девяток.', uz: "Olti yuzlik beshdan katta. Demak 600 katta 599 dan, ikkinchisida to'qqizlar ko'p bo'lsa ham." },
    audio: {
      ru: [
        'Между числами ставят знак. Открытый рот знака всегда смотрит на большее число.',
        'Сравним шестьсот и пятьсот девяносто девять. Кажется, во втором больше девяток.',
        'Но смотрим сотни. Шесть сотен больше пяти. Значит шестьсот больше. Число цифр не главное, главное разряды.'
      ],
      uz: [
        "Sonlar orasiga belgi qo'yiladi. Belgining ochiq og'zi doim katta songa qaraydi.",
        "Olti yuz va besh yuz to'qson to'qqizni taqqoslaymiz. Ikkinchisida to'qqizlar ko'proqday.",
        "Lekin yuzlikka qaraymiz. Olti yuzlik beshdan katta. Demak olti yuz katta. Raqam soni emas, xonalar muhim."
      ]
    }
  },

  // s6 — QOIDA
  s6: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    rule: { ru: 'Сравниваем слева направо, разряд за разрядом. Где цифра больше — то число больше. Знак открывается к большему.', uz: "Chapdan o'ngga, xonama-xona taqqoslaymiz. Qaysida raqam katta — o'sha son katta. Belgi kattaga ochiladi." },
    a: 463, b: 468,
    check_q: { ru: 'Поставь знак между 463 и 468.', uz: "463 va 468 orasiga belgi qo'ying." },
    check_sign: '<',
    check_ok: { ru: 'Верно! Сотни и десятки равны, а три меньше восьми: 463 меньше.', uz: "To'g'ri! Yuzlik va o'nlik teng, uch sakkizdan kichik: 463 kichik." },
    check_no: { ru: 'Сотни и десятки равны. Сравни единицы: три меньше восьми.', uz: "Yuzlik va o'nlik teng. Birlikni solishtiring: uch sakkizdan kichik." },
    audio: {
      ru: [
        'Отлично, теперь запомним это как правило.',
        'Сравниваем два числа слева направо, разряд за разрядом. Начинаем с сотен.',
        'Если сотни равны, смотрим десятки. Если и они равны, смотрим единицы.',
        'Где цифра разряда больше, то число и больше. Знак открытым ртом смотрит на большее число.',
        'А теперь сам. Поставь знак между числами четыреста шестьдесят три и четыреста шестьдесят восемь.'
      ],
      uz: [
        "Zo'r, endi buni qoida qilib eslab qolamiz.",
        "Ikki sonni chapdan o'ngga, xonama-xona taqqoslaymiz. Yuzlikdan boshlaymiz.",
        "Yuzliklar teng bo'lsa, o'nlikka qaraymiz. Ular ham teng bo'lsa, birlikka qaraymiz.",
        "Qaysi xona raqami katta bo'lsa, o'sha son katta. Belgi ochiq og'zi bilan katta songa qaraydi.",
        "Endi o'zingiz. To'rt yuz oltmish uch va to'rt yuz oltmish sakkiz orasiga belgi qo'ying."
      ]
    }
  },

  // s7 — MASHQ belgi qo'yish (< = >), 3 raund
  s7: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    items: [
      { pair: [345, 354], sign: '<', hint: { ru: 'Сотни равны, десятки: 4 меньше 5. Значит 345 меньше, знак меньше.', uz: "Yuzliklar teng, o'nlik: 4, 5 dan kichik. Demak 345 kichik, kichik belgisi." } },
      { pair: [482, 428], sign: '>', hint: { ru: 'Сотни равны, десятки: 8 больше 2. Значит 482 больше, знак больше.', uz: "Yuzliklar teng, o'nlik: 8, 2 dan katta. Demak 482 katta, katta belgisi." } },
      { pair: [600, 599], sign: '>', hint: { ru: 'Сотни: 6 больше 5. Значит 600 больше 599, знак больше.', uz: "Yuzlik: 6, 5 dan katta. Demak 600 katta 599 dan, katta belgisi." } }
    ],
    audio: {
      intro: { ru: 'Ставь знак между числами. Открытый рот смотрит на большее число. Три задания.', uz: "Sonlar orasiga belgi qo'ying. Ochiq og'iz katta songa qaraydi. Uchta topshiriq." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Сравни разряды слева направо. Знак открывается к большему.', uz: "Xonalarni chapdan o'ngga solishtiring. Belgi kattaga ochiladi." }
    }
  },

  // s8 — MASHQ kattasini tanla (MC), 3 raund
  s8: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    q: { ru: 'Какое число больше?', uz: 'Qaysi son katta?' },
    items: [
      {
        pair: [730, 703], ci: 0,
        opts: [{ ru: '730', uz: '730' }, { ru: '703', uz: '703' }, { ru: 'поровну', uz: 'teng' }],
        hints: {
          1: { ru: 'Сотни равны, десятки: 3 больше 0. Значит 730 больше.', uz: "Yuzliklar teng, o'nlik: 3, 0 dan katta. Demak 730 katta." },
          2: { ru: 'Числа не равны: в десятках 3 и 0 разные.', uz: "Sonlar teng emas: o'nlikda 3 va 0 har xil." }
        }
      },
      {
        pair: [519, 591], ci: 1,
        opts: [{ ru: '519', uz: '519' }, { ru: '591', uz: '591' }, { ru: 'поровну', uz: 'teng' }],
        hints: {
          0: { ru: 'Сотни равны, десятки: 9 больше 1. Значит 591 больше.', uz: "Yuzliklar teng, o'nlik: 9, 1 dan katta. Demak 591 katta." },
          2: { ru: 'Цифры одни, но места разные, значит не равны.', uz: "Raqamlar bir xil, lekin o'rni har xil, demak teng emas." }
        }
      },
      {
        pair: [380, 380], ci: 2,
        opts: [{ ru: '380', uz: '380' }, { ru: '380', uz: '380' }, { ru: 'поровну', uz: 'teng' }],
        hints: {
          0: { ru: 'Числа одинаковые во всех разрядах — они равны.', uz: "Sonlar barcha xonada bir xil — ular teng." },
          1: { ru: 'Числа одинаковые во всех разрядах — они равны.', uz: "Sonlar barcha xonada bir xil — ular teng." }
        }
      }
    ],
    audio: {
      intro: { ru: 'Выбери, какое число больше. Если равны — нажми поровну. Три задания.', uz: "Qaysi son katta ekanini tanlang. Teng bo'lsa — teng bosing. Uchta topshiriq." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Сравни по разрядам слева направо. Попробуй ещё.', uz: "Xonama-xona chapdan o'ngga solishtiring. Yana urinib ko'ring." }
    }
  },

  // s9 — MASHQ xatoni top (taqqoslash yozuvlari), 3 raund
  s9: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    q: { ru: 'Найди неверную запись.', uz: "Noto'g'ri yozuvni toping." },
    items: [
      {
        stmts: ['517 > 571', '288 < 300', '640 > 604'],
        wrong: 0,
        hint: { ru: 'Пятьсот семнадцать меньше пятисот семидесяти одного: десятки 1 меньше 7. Знак наоборот.', uz: "Besh yuz o'n yetti besh yuz yetmish birdan kichik: o'nlik 1, 7 dan kichik. Belgi teskari." }
      },
      {
        stmts: ['729 > 728', '460 < 406', '815 > 809'],
        wrong: 1,
        hint: { ru: 'Четыреста шестьдесят больше четырёхсот шести: десятки 6 больше 0. Знак наоборот.', uz: "To'rt yuz oltmish to'rt yuz oltidan katta: o'nlik 6, 0 dan katta. Belgi teskari." }
      },
      {
        stmts: ['300 < 299', '555 = 555', '712 > 700'],
        wrong: 0,
        hint: { ru: 'Триста больше двухсот девяноста девяти: сотни 3 больше 2. Знак наоборот.', uz: "Uch yuz ikki yuz to'qson to'qqizdan katta: yuzlik 3, 2 dan katta. Belgi teskari." }
      }
    ],
    audio: {
      intro: { ru: 'Даю три записи со знаками. Одна неверная. Найди неверную запись.', uz: "Uchta belgili yozuv beraman. Bittasi noto'g'ri. Noto'g'ri yozuvni toping." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Проверь знак: он открывается к большему числу. Посмотри ещё.', uz: "Belgini tekshiring: u katta songa ochiladi. Yana qarang." }
    }
  },

  // s10 — MASALA (case): Jasur ikki tuman -> belgi
  s10: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    lead: { ru: 'Джасур сравнил два района: 428 и 482 огня.', uz: 'Jasur ikki tumanni taqqosladi: 428 va 482 chiroq.' },
    pair: [428, 482], sign: '<',
    q: { ru: 'Поставь верный знак между числами.', uz: "Sonlar orasiga to'g'ri belgini qo'ying." },
    setup_audio: { ru: 'Джасур сосчитал огни в двух районах. В первом четыреста двадцать восемь, во втором четыреста восемьдесят два.', uz: "Jasur ikki tumandagi chiroqlarni sanadi. Birinchisida to'rt yuz yigirma sakkiz, ikkinchisida to'rt yuz sakson ikki." },
    audio: {
      intro: { ru: 'Поставь верный знак между числами. Открытый рот смотрит на большее.', uz: "Sonlar orasiga to'g'ri belgini qo'ying. Ochiq og'iz kattaga qaraydi." },
      on_correct: { ru: 'Верно. Сотни равны, а восемь десятков больше двух: 428 меньше 482.', uz: "To'g'ri. Yuzliklar teng, sakkiz o'nlik ikkidan katta: 428 kichik 482 dan." },
      on_wrong: { ru: 'Сравни десятки: 2 и 8. Знак открывается к большему.', uz: "O'nlikni solishtiring: 2 va 8. Belgi kattaga ochiladi." }
    }
  },

  // s11 — FINAL panel (5 savol) + FactCard
  s11: {
    eyebrow: { ru: 'Финал', uz: 'Final' },
    intro_line: { ru: 'Городской компьютер проверит тебя. Пять заданий.', uz: "Shahar kompyuteri sizni tekshiradi. Beshta topshiriq." },
    items: [
      {
        kind: 'mc',
        q: { ru: 'Какое число больше: 618 или 681?', uz: 'Qaysi son katta: 618 yoki 681?' },
        opt0: { ru: '681', uz: '681' },
        opt1: { ru: '618', uz: '618' },
        opt2: { ru: 'Поровну', uz: 'Teng' },
        wrong_1: { ru: 'Сотни равны, десятки: 8 больше 1, значит 681 больше.', uz: "Yuzliklar teng, o'nlik: 8, 1 dan katta, demak 681 katta." },
        wrong_2: { ru: 'Цифры одни, но места разные — числа не равны.', uz: "Raqamlar bir xil, lekin o'rni har xil — sonlar teng emas." }
      },
      {
        kind: 'mc',
        q: { ru: 'Какой знак верен: 507 ... 570?', uz: "Qaysi belgi to'g'ri: 507 ... 570?" },
        opt0: { ru: 'меньше', uz: 'kichik' },
        opt1: { ru: 'больше', uz: 'katta' },
        opt2: { ru: 'равно', uz: 'teng' },
        wrong_1: { ru: 'Сотни равны, десятки: 0 меньше 7. Значит 507 меньше.', uz: "Yuzliklar teng, o'nlik: 0, 7 dan kichik. Demak 507 kichik." },
        wrong_2: { ru: 'Числа разные: в десятках 0 и 7.', uz: "Sonlar har xil: o'nlikda 0 va 7." }
      },
      {
        kind: 'num', ans: 800,
        q: { ru: 'Какое число больше: 800 или 799? Запиши большее.', uz: '800 yoki 799 — qaysi katta? Kattasini yozing.' },
        hint: { ru: 'Сотни: 8 больше 7. Значит больше восемьсот.', uz: "Yuzlik: 8, 7 dan katta. Demak sakkiz yuz katta." }
      },
      {
        kind: 'mc',
        q: { ru: 'Какая запись верна?', uz: "Qaysi yozuv to'g'ri?" },
        opt0: { ru: '640 > 604', uz: '640 > 604' },
        opt1: { ru: '640 < 604', uz: '640 < 604' },
        opt2: { ru: '640 = 604', uz: '640 = 604' },
        wrong_1: { ru: 'Десятки: 4 больше 0, значит 640 больше 604.', uz: "O'nlik: 4, 0 dan katta, demak 640 katta 604 dan." },
        wrong_2: { ru: 'В десятках 4 и 0 — числа не равны.', uz: "O'nlikda 4 va 0 — sonlar teng emas." }
      },
      {
        kind: 'num', ans: 350,
        q: { ru: 'Загадка. Я трёхзначное число, больше 349 и меньше 351. Кто я?', uz: "Jumboq. Men uch xonali sonman, 349 dan katta va 351 dan kichik. Men kimman?" },
        hint: { ru: 'Между 349 и 351 стоит только одно число.', uz: "349 bilan 351 orasida faqat bitta son turadi." }
      }
    ],
    fact_badge: { ru: 'Знаешь?', uz: 'Bilasizmi?' },
    fact_text: { ru: 'Красные карлики холоднее нашего Солнца, поэтому светят красным светом. Чем холоднее звезда, тем краснее её свет.', uz: "Qizil mitti yulduzlar Quyoshimizdan sovuqroq, shuning uchun qizil nur sochadi. Yulduz qancha sovuq bo'lsa, nuri shuncha qizil." },
    fact_audio: { ru: 'Красные карлики холоднее нашего Солнца, поэтому светят красным светом. Чем холоднее звезда, тем краснее её свет.', uz: "Qizil mitti yulduzlar Quyoshimizdan sovuqroq, shuning uchun qizil nur sochadi. Yulduz qancha sovuq bo'lsa, nuri shuncha qizil." },
    audio: {
      intro: { ru: 'Финальная проверка. Городской компьютер показывает задания, отвечай на каждое.', uz: "Yakuniy tekshiruv. Shahar kompyuteri topshiriq ko'rsatadi, har biriga javob bering." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Посмотри разбор справа.', uz: "O'ngdagi tushuntirishga qarang." }
    }
  },

  // s12 — YAKUN
  s12: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    praise: { ru: 'Молодец!', uz: 'Barakalla!' },
    mission_done: { ru: 'Районы сравнены — карта города открыта!', uz: 'Tumanlar taqqoslandi — shahar xaritasi ochildi!' },
    cando: { ru: 'Теперь ты сравниваешь трёхзначные числа по разрядам, слева направо.', uz: "Endi siz uch xonali sonlarni xonama-xona, chapdan o'ngga taqqoslaysiz." },
    rule_recap: { ru: 'Сравнивай слева направо: сначала сотни, потом десятки, потом единицы. Знак открывается к большему.', uz: "Chapdan o'ngga taqqoslang: avval yuzlik, keyin o'nlik, keyin birlik. Belgi kattaga ochiladi." },
    conn_label_refs: { ru: 'Опирается на', uz: 'Tayanadi' },
    conn_refs: { ru: 'третий урок: разрядные слагаемые', uz: "uchinchi dars: razryad qo'shiluvchilari" },
    conn_label_next: { ru: 'Дальше', uz: 'Keyingi' },
    conn_next: { ru: 'Урок 5: округление до десятков и сотен', uz: "5-dars: o'nlik va yuzlikkacha yaxlitlash" },
    audio: {
      ru: 'Районы города сравнены. Мы научились сравнивать трёхзначные числа по разрядам, слева направо. Запомни правило. Сначала сравниваем сотни, потом десятки, потом единицы. Где цифра разряда больше, то число больше. А знак открытым ртом смотрит на большее число. В следующий раз научимся округлять числа до десятков и сотен.',
      uz: "Shahar tumanlari taqqoslandi. Biz uch xonali sonlarni xonama-xona, chapdan o'ngga taqqoslashni o'rgandik. Qoidani yodda tuting. Avval yuzlikni, keyin o'nlikni, keyin birlikni taqqoslaymiz. Qaysi xona raqami katta bo'lsa, o'sha son katta. Belgi esa ochiq og'zi bilan katta songa qaraydi. Keyingi safar sonlarni o'nlik va yuzlikkacha yaxlitlashni o'rganamiz."
    }
  }
};

// slaydlararo ko'priklar (audio-intro boshiga; ekranda ko'rinmaydi). TTS-toza.
const BRIDGES = {
  s1:  { ru: 'Вспомним про разряды.', uz: 'Xonalarni eslaymiz.' },
  s2:  { ru: 'Начнём сравнивать с сотен.', uz: 'Yuzlikdan taqqoslay boshlaymiz.' },
  s3:  { ru: 'А если сотни равны?', uz: 'Yuzliklar teng bo\'lsa-chi?' },
  s4:  { ru: 'А если и десятки равны?', uz: 'O\'nliklar ham teng bo\'lsa-chi?' },
  s5:  { ru: 'Про знак и хитрый случай.', uz: 'Belgi va ayyor holat haqida.' },
  s6:  { ru: 'Запишем это правилом.', uz: 'Buni qoida qilib olamiz.' },
  s7:  { ru: 'Правило знаем. Ставь знак сам.', uz: "Qoidani bilamiz. O'zingiz belgi qo'ying." },
  s8:  { ru: 'Теперь выбирай большее число.', uz: 'Endi katta sonni tanlang.' },
  s9:  { ru: 'Проверим записи на ошибку.', uz: 'Yozuvlarni xatoga tekshiramiz.' },
  s10: { ru: 'Последнее сравнение районов.', uz: 'Tumanlarning oxirgi taqqoslashi.' },
  s11: { ru: 'Городской компьютер сделает финальную проверку.', uz: 'Shahar kompyuteri yakuniy tekshiradi.' },
  s12: { ru: 'Карта открыта. Идём дальше!', uz: 'Xarita ochildi. Davom etamiz!' }
};

// s12 payoff (xulosadan oldin aytiladi)
const S12_PAYOFF = {
  ru: 'Миссия выполнена! Мы научились сравнивать районы по числу огней, и Бит открыл карту города. Спасибо за помощь!',
  uz: "Missiya bajarildi! Biz tumanlarni chiroqlar soni bo'yicha taqqoslashni o'rgandik, va Bit shahar xaritasini ochdi. Yordamingiz uchun rahmat!"
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
      <TwoDistrictBridgeBg/>
      <div className="lm-scene-cast">
        {LUMO_CAST.slice(0, 2).map(kid)}
        <span className={`lm-crew lm-crew-host ${gathered ? 'd2-bit-cheer' : 'lm-bob'}`}><span className="g1-cast-fig"><BitSVG state={gathered ? 'happy' : 'present'}/></span></span>
        {LUMO_CAST.slice(2).map((c, i) => kid(c, i + 2))}
      </div>
    </div>
  );
};




// ============================================================
// EKRANLAR — Dars04 «Uch xonali sonlarni taqqoslash» (> < =)
// ============================================================

const CMP_SIGNS = ['<', '=', '>'];
const digits3 = (n) => [Math.floor(n / 100), Math.floor((n % 100) / 10), n % 10];



// --- IKKI TUMAN KO'PRIGI SAHNASI (D04): ikki yonib turgan tuman + kanal
const TwoDistrictBridgeBg = () => {
  const lang = useLang();
  return (
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

    <rect x="104" y="104" width="192" height="46" rx="7" fill="url(#shPanel)" stroke="#3E6E90" strokeWidth="1.6"/>
    <rect x="110" y="108" width="180" height="10" rx="3" fill="#122236"/>
    <text x="200" y="115.5" textAnchor="middle" fontSize="7" letterSpacing="1.5" fill="#7FB8D8" fontFamily="'JetBrains Mono', monospace">{lang === 'ru' ? 'СРАВНЕНИЕ' : 'TAQQOSLASH'}</text>
    <text x="150" y="142" textAnchor="middle" fontSize="20" fontWeight="800" fill="#8FE6C0" fontFamily="'JetBrains Mono', monospace">546</text>
    <text x="200" y="143" textAnchor="middle" fontSize="22" fontWeight="800" fill="#FFD86E" fontFamily="'JetBrains Mono', monospace">&gt;</text>
    <text x="250" y="142" textAnchor="middle" fontSize="20" fontWeight="800" fill="#F2A85C" fontFamily="'JetBrains Mono', monospace">465</text>
    <path d="M150 156 h100 l10 20 h-120 Z" fill="#C3A87E"/><rect x="146" y="174" width="108" height="4" fill="#A98C64"/>
    {/* chap tuman: baland minora (546) — deraza tagida, devorda */}
    <g transform="translate(60 106)"><rect x="-14" y="0" width="28" height="70" rx="4" fill="#A6D8C2"/><path d="M-14 0 l14 -12 l14 12 Z" fill="#7CB69E"/><g fill="#FFE39A" opacity="0.8">{[0, 1, 2].map((r) => [0, 1].map((c) => <rect key={`${r}${c}`} x={-9 + c * 10} y={22 + r * 16} width="6" height="8" rx="1"/>))}</g><rect x="-13" y="4" width="26" height="13" rx="2" fill="#2E4A3E"/><text x="0" y="14" textAnchor="middle" fontSize="9" fontWeight="800" fill="#BFF0D4" fontFamily="'JetBrains Mono', monospace">546</text></g>
    {/* o'ng tuman: past minora (465) */}
    <g transform="translate(340 118)"><rect x="-13" y="0" width="26" height="58" rx="4" fill="#F2CB9E"/><path d="M-13 0 l13 -11 l13 11 Z" fill="#DCA265"/><g fill="#FFE39A" opacity="0.8">{[0, 1].map((r) => [0, 1].map((c) => <rect key={`${r}${c}`} x={-8 + c * 9} y={22 + r * 16} width="6" height="8" rx="1"/>))}</g><rect x="-12" y="4" width="24" height="13" rx="2" fill="#6B4526"/><text x="0" y="14" textAnchor="middle" fontSize="9" fontWeight="800" fill="#FFD9B0" fontFamily="'JetBrains Mono', monospace">465</text></g>
    <rect x="0" y="176" width="400" height="54" fill="url(#shFloor)"/>
    <line x1="0" y1="176" x2="400" y2="176" stroke="#9A8058" strokeWidth="2"/>
    <g stroke="#A98C64" strokeWidth="1" opacity="0.4"><path d="M20 230 L176 178"/><path d="M120 230 L192 178"/><path d="M280 230 L208 178"/><path d="M380 230 L224 178"/></g>
    <g stroke="#A98C64" strokeWidth="0.8" opacity="0.28"><path d="M0 196 H400"/><path d="M0 212 H400"/></g>
    <g transform="translate(18 176)"><path d="M0 0 Q-3 -16 0 -24" stroke="#7CB69E" strokeWidth="2.6" fill="none"/><circle className="lm-glow" cx="0" cy="-27" r="5" fill="#A6E0C6"/><path d="M-1 -14 q-8 -3 -11 -10 q9 1 12 8Z" fill="#8FD8B8"/></g>
    <g transform="translate(392 176)"><path d="M0 0 Q-2 -10 0 -15" stroke="#7CB69E" strokeWidth="2.2" fill="none"/><circle className="lm-glow" cx="0" cy="-17" r="3.6" fill="#A6E0C6"/></g>
    <g><circle className="lm-glow" cx="120" cy="60" r="1.5" fill="#FFE0B0"/><circle className="lm-glow" style={{ animationDelay: '0.8s' }} cx="300" cy="70" r="1.5" fill="#CFE8FF"/><circle className="lm-glow" style={{ animationDelay: '1.4s' }} cx="250" cy="40" r="1.3" fill="#FFD0C2"/></g>
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
      <TwoDistrictBridgeBg/>
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
  <svg viewBox="0 0 260 92" style={{ width: '100%', maxWidth: 300, height: 'auto', display: 'block' }} aria-hidden="true">
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


const NumPad = ({ value, setValue, disabled, max = 3, state = null }) => {
  const push = (d) => { if (disabled) return; setValue((v) => (v.length >= max ? v : v + d)); };
  const back = () => { if (disabled) return; setValue((v) => v.slice(0, -1)); };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div className={`mono${state === 'bad' ? ' lm-ans-bad' : ''}`} style={{ minWidth: 124, height: 'clamp(40px, min(46px, 6.1dvh), 46px)', borderRadius: 12, border: `2.5px solid ${state === 'ok' ? '#1F7A4D' : state === 'bad' ? '#E0563A' : T.accent}`, background: state === 'ok' ? '#EAF6EF' : state === 'bad' ? '#FDECE7' : T.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, color: state === 'ok' ? '#1F7A4D' : state === 'bad' ? '#B33F27' : T.ink, letterSpacing: 4, padding: '0 14px', transition: 'border-color .18s, background .18s, color .18s' }}>{value || '—'}</div>
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

// --- TAQQOSLASH VIZUALI (explore): a [sign] b, hal qiluvchi xona yoritiladi.
const CompareViz = ({ a, b, place, sign, highlight, showSign }) => {
  const da = digits3(a), db = digits3(b);
  const hi = place === 'h' ? 0 : place === 't' ? 1 : 2;
  const Cell = ({ d, on }) => (
    <span className="mono" style={{ fontSize: 'clamp(24px, 5.5vw, 36px)', fontWeight: 800, color: on ? T.accent : T.ink, background: on ? T.accentSoft : 'transparent', borderRadius: 8, padding: '2px 7px', minWidth: 'clamp(26px, 6.5vw, 38px)', textAlign: 'center' }}>{d}</span>
  );
  const Num = ({ ds }) => <span style={{ display: 'inline-flex', gap: 2 }}>{ds.map((d, i) => <Cell key={i} d={d} on={highlight && i === hi}/>)}</span>;
  return (
    <div className="lm-cmprow">
      <div className="lm-cmpcell"><Num ds={da}/></div>
      <span className="lm-cmpslot mono">{showSign ? <span className="lm-sign-in">{sign}</span> : '?'}</span>
      <div className="lm-cmpcell"><Num ds={db}/></div>
    </div>
  );
};

// --- TAQQOSLASH TESTI (belgi tanlash, 3 raund; веди-до-verного). Etalon Screen11 naqshi.
const CompareRound = ({ props, ck }) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT[ck];
  const items = c.items;
  const audio = useAudio([
    brgSeg(ck, lang),
    { id: `${ck}_intro`, text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [idx, setIdx] = useState(props.storedAnswer ? items.length : 0);
  const [picked, setPicked] = useState(props.storedAnswer && items.length ? items[items.length - 1].sign : null);
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const [score, setScore] = useState(props.storedAnswer ? (props.storedAnswer.studentAnswer | 0) : 0);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const firstAllRef = useRef(props.storedAnswer ? props.storedAnswer.firstTry : true);
  const it = items[Math.min(idx, items.length - 1)];
  const done = idx >= items.length;
  const solvedRound = !!it && picked === it.sign;
  const bigger = it ? (it.pair[0] > it.pair[1] ? 0 : (it.pair[0] < it.pair[1] ? 1 : -1)) : -1;
  const revealRef = useRevealScroll(done, 400);
  const pick = (sgn) => {
    if (!canAct || done || solvedRound || wrongSet.has(sgn)) return;
    if (sgn === it.sign) {
      setPicked(sgn); sfx.playCorrect();
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_correct[lang]); }
      if (wrongSet.size === 0) setScore((x) => x + 1);
      setTimeout(() => { if (idx + 1 < items.length) setPicked(null); setWrongSet(new Set()); setIdx((n) => n + 1); }, 1400);
    } else {
      const n = new Set(wrongSet); n.add(sgn); setWrongSet(n);
      firstAllRef.current = false;
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((it.hint || c.audio.on_wrong)[lang]); }
    }
  };
  useEffect(() => {
    if (done && !recorded) {
      setRecorded(true);
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: 'compare',
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
            <div className="mono fade-up" style={{ textAlign: 'center', color: T.accent, fontWeight: 800 }}>{lang === 'ru' ? `Задание ${Math.min(idx + 1, items.length)} из ${items.length}` : `${Math.min(idx + 1, items.length)}-topshiriq, jami ${items.length}`}</div>
            <h1 className="title h-sub fade-up">{lang === 'ru' ? 'Поставь знак' : "Belgini qo'ying"}</h1>
            <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(12px, 2.6vw, 20px)', padding: 'clamp(14px, 2.6vw, 20px)' }}>
              <FrameFx/>
              <div className="lm-cmprow">
                <div className={`lm-cmpcell ${solvedRound && bigger === 0 ? 'lm-cmp-big' : ''}`}><BigNum v={it.pair[0]}/></div>
                <span className="lm-cmpslot mono">{picked ? <span key={idx} className="lm-sign-in">{picked}</span> : '?'}</span>
                <div className={`lm-cmpcell ${solvedRound && bigger === 1 ? 'lm-cmp-big' : ''}`}><BigNum v={it.pair[1]}/></div>
              </div>
              <div className="lm-signrow">
                {CMP_SIGNS.map((sgn) => (
                  <button key={sgn} className={`lm-signbtn mono ${wrongSet.has(sgn) ? 'lm-signbtn-wrong' : ''} ${picked === sgn ? 'lm-signbtn-ok' : ''}`} disabled={!canAct || solvedRound || wrongSet.has(sgn)} onClick={() => pick(sgn)}>{sgn}</button>
                ))}
              </div>
              {wrongSet.size > 0 && !solvedRound && (
                <p className="lm-hint-bad fade-up">{t(it.hint)}</p>
              )}
            </div>
          </>
        )}
        {done && (
          <div ref={revealRef} className="frame-success reveal-soft">
            <Reaction state="correct" praise={lang === 'ru' ? `Верно: ${score} из ${items.length}` : `To'g'ri: ${items.length} tadan ${score} ta`}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// --- KO'P-RAUNDLI MC (heading/renderFig render-props).
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
            <div className="mono fade-up" style={{ textAlign: 'center', color: T.accent, fontWeight: 800 }}>{lang === 'ru' ? `Задание ${Math.min(idx + 1, items.length)} из ${items.length}` : `${Math.min(idx + 1, items.length)}-topshiriq, jami ${items.length}`}</div>
            <h1 className="title h-sub fade-up">{heading(it)}</h1>
            <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(10px, 2vw, 14px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
              <FrameFx/>
              {renderFig(it)}
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(90px, 1fr))`, gap: 10, width: '100%' }}>
                {it.opts.map((o, i) => (
                  <button key={i} className={`option ${okPick === i ? 'option-correct' : ''} ${wrongSet.has(i) ? 'option-picked-wrong' : ''}`} disabled={!canAct || okPick !== null || wrongSet.has(i)} onClick={() => pick(i)}
                    style={{ padding: 'clamp(10px, 1.6vw, 13px)', fontSize: 'clamp(14px, 2vw, 17px)', minHeight: 'clamp(46px, 6.5vw, 56px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{t(o)}</button>
                ))}
              </div>
              {hintMsg && <p className="lm-hint-bad fade-up">{t(hintMsg)}</p>}
            </div>
          </>
        )}
        {done && (
          <div ref={revealRef} className="frame-success reveal-soft">
            <Reaction state="correct" praise={lang === 'ru' ? `Верно: ${score} из ${items.length}` : `To'g'ri: ${items.length} tadan ${score} ta`}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s0 — HOOK: ikki tuman, qaysida ko'p?
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
  // Два района должны стоять В РЯД и на телефоне: раньше картинка занимала 300px,
  // районы переносились и панель вырастала до 330px — экран уезжал вниз.
  const District = ({ n }) => (
    <div style={{ flex: '1 1 0', minWidth: 0, maxWidth: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: 'clamp(8px, 1.8vw, 14px) clamp(12px, 2.4vw, 20px)', background: T.paper, borderRadius: 14, boxShadow: '0 6px 16px -6px rgba(58, 53, 48, 0.25)' }}>
      <MiniCity/>
      <span className="mono" style={{ fontSize: 'clamp(24px, 5vw, 34px)', fontWeight: 800, color: T.ink }}>{n}</span>
    </div>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <div className="fade-up" style={{ alignSelf: 'center', background: T.accentSoft, color: T.accent, fontWeight: 800, fontSize: 'clamp(12px, 1.8vw, 15px)', padding: '5px 14px', borderRadius: 999 }}>{t(c.topic)}</div>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1 lm-scene-host" style={{ padding: 'clamp(8px, 1.8vw, 14px)', overflow: 'hidden' }}>
          <LessonScene gathered={ok}/>
        </div>
        <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(10px, 3vw, 24px)', padding: 'clamp(10px, 2vw, 16px)', flexWrap: 'wrap' }}>
          <District n={c.a}/>
          <District n={c.b}/>
        </div>
        <p className="fade-up delay-1" style={{ textAlign: 'center', color: T.ink2, fontWeight: 600, fontSize: 'clamp(15px, 2vw, 18px)', margin: 0 }}>{t(c.q)}</p>
        {picked === null && (
          <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {opts.map((o, i) => (
              <button key={i} className="option" disabled={!canAct} onClick={() => pick(i)}
                style={{ padding: 'clamp(10px, 1.5vw, 12px)', fontSize: 'clamp(14px, 2vw, 18px)', minHeight: 'clamp(48px, 7vw, 58px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>
                {t(o)}
              </button>
            ))}
          </div>
        )}
        {picked !== null && (
          <div className="fade-up" style={{ display: 'flex', justifyContent: 'center' }}>
            <button className={`option ${ok ? 'option-correct' : 'option-picked-wrong'}`} disabled
              style={{ padding: 'clamp(10px, 1.5vw, 12px) clamp(16px, 2.4vw, 22px)', fontSize: 'clamp(14px, 2vw, 18px)', minHeight: 'clamp(46px, 6.5vw, 56px)', width: 'auto', display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>
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

// s1 — RECALL: chap xona eng og'ir
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
  const labels = { h: lang === 'ru' ? 'сотни' : 'yuzlik', t: lang === 'ru' ? 'десятки' : "o'nlik", o: lang === 'ru' ? 'единицы' : 'birlik' };
  const weights = [['3', 'h', '100'], ['4', 't', '10'], ['5', 'o', '1']];
  const RCOL = ['#C0392B', '#1F7A4D', T.blue];
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(12px, 3.5vw, 30px)', padding: 'clamp(14px, 2.6vw, 22px)', minHeight: 'clamp(160px, 34vw, 220px)', alignItems: 'flex-end' }}>
          {weights.map(([d, k, w], i) => (
            <div key={k} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <span className="mono" style={{ fontSize: 'clamp(26px, 6vw, 40px)', fontWeight: 800, color: RCOL[i] }}>{d}</span>
              <span className="mono" style={{ fontSize: 'clamp(10px, 1.5vw, 12px)', color: T.ink2, fontWeight: 700 }}>{labels[k]}</span>
              {reached >= 1 && <div className="lm-drop" style={{ width: `clamp(28px, ${8 - i * 2}vw, ${52 - i * 14}px)`, height: `clamp(28px, ${8 - i * 2}vw, ${52 - i * 14}px)`, borderRadius: 8, background: RCOL[i], opacity: 0.85, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span className="mono" style={{ color: '#fff', fontWeight: 800, fontSize: 'clamp(9px, 1.4vw, 12px)' }}>{w}</span></div>}
            </div>
          ))}
        </div>
      </div>
    </Stage>
  );
};

// s2/s3/s4/s5 — TAQQOSLASH VIZUALI (explore)
const ExploreCompare = ({ props, ck }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT[ck];
  const audio = useAudio([
    brgSeg(ck, lang),
    ...c.audio[lang].map((text, i) => ({ id: `${ck}_${i}`, text, trigger: 'after_previous', waits_for: null }))
  ]);
  const seg = audio.currentSegment;
  const [reached, setReached] = useState(-1);
  const re = new RegExp(`^${ck}_\\d+$`);
  useEffect(() => { if (seg && re.test(seg)) setReached((r) => Math.max(r, +seg.slice(ck.length + 1))); }, [seg]);
  const highlight = reached >= 1;
  const showSign = reached >= 2;
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
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'clamp(16px, 3vw, 24px)', minHeight: 'clamp(150px, 32vw, 200px)' }}>
          <CompareViz a={c.a} b={c.b} place={c.place} sign={c.sign} highlight={highlight} showSign={showSign}/>
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
const Screen2 = (props) => <ExploreCompare props={props} ck="s2"/>;
const Screen3 = (props) => <ExploreCompare props={props} ck="s3"/>;
const Screen4 = (props) => <ExploreCompare props={props} ck="s4"/>;
const Screen5 = (props) => <ExploreCompare props={props} ck="s5"/>;

// s6 — QOIDA + belgi tanlash check
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
  const ok = picked === c.check_sign;
  const revealRef = useRevealScroll(ok, 500);
  const pick = (sgn) => {
    if (!canAct || ok) return;
    setPicked(sgn);
    if (sgn === c.check_sign) sfx.playCorrect();
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
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(12px, 2.6vw, 18px)', padding: 'clamp(14px, 2.6vw, 22px)' }}>
          <div className="lm-cmprow">
            <div className={`lm-cmpcell ${ok && c.a < c.b ? '' : ''}`}><BigNum v={c.a}/></div>
            <span className="lm-cmpslot mono">{ok ? <span className="lm-sign-in">{c.check_sign}</span> : '?'}</span>
            <div className="lm-cmpcell"><BigNum v={c.b}/></div>
          </div>
          <p style={{ textAlign: 'center', color: T.ink2, fontWeight: 700, margin: 0 }}>{ok ? t(c.check_ok) : (picked !== null ? t(c.check_no) : t(c.check_q))}</p>
          <div className="lm-signrow">
            {CMP_SIGNS.map((sgn) => (
              <button key={sgn} className={`lm-signbtn mono ${picked === sgn && sgn !== c.check_sign ? 'lm-signbtn-wrong' : ''} ${ok && sgn === c.check_sign ? 'lm-signbtn-ok' : ''}`} disabled={!canAct || ok} onClick={() => pick(sgn)}>{sgn}</button>
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

// s7 — MASHQ belgi qo'yish
const Screen7 = (props) => <CompareRound props={props} ck="s7"/>;

// s8 — MASHQ kattasini tanla (MC)
const Screen8 = (props) => {
  const t = useT();
  const c = CONTENT.s8;
  const heading = () => t(c.q);
  const renderFig = (it) => (
    <div style={{ display: 'flex', gap: 'clamp(14px, 5vw, 34px)', alignItems: 'center', justifyContent: 'center' }}>
      {it.pair.map((n, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="mono" style={{ fontSize: 'clamp(18px, 3vw, 24px)', color: T.ink3, fontWeight: 800 }}>?</span>}
          <span className="mono" style={{ fontSize: 'clamp(28px, 6.5vw, 44px)', fontWeight: 800, color: T.ink }}>{n}</span>
        </React.Fragment>
      ))}
    </div>
  );
  return <MCRoundD2 props={props} ck="s8" cols={3} heading={heading} renderFig={renderFig}/>;
};

// s9 — MASHQ xatoni top (yozuvlar)
const Screen9 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s9;
  const sfx = useSfx();
  const items = c.items;
  const audio = useAudio([
    brgSeg('s9', lang),
    { id: 's9_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
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
            <div className="mono fade-up" style={{ textAlign: 'center', color: T.accent, fontWeight: 800 }}>{lang === 'ru' ? `Задание ${Math.min(idx + 1, items.length)} из ${items.length}` : `${Math.min(idx + 1, items.length)}-topshiriq, jami ${items.length}`}</div>
            <h1 className="title h-sub fade-up">{t(c.q)}</h1>
            <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.8vw, 12px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
              <FrameFx/>
              {it.stmts.map((stmt, i) => (
                <button key={i} className={`option ${wrongSet.has(i) ? 'option-picked-wrong' : ''} ${solvedRound && i === it.wrong ? 'option-correct' : ''}`} disabled={!canAct || solvedRound || wrongSet.has(i)} onClick={() => pick(i)}
                  style={{ padding: 'clamp(10px, 1.6vw, 14px)', minHeight: 'clamp(48px, 7vw, 58px)', fontSize: 'clamp(18px, 3.6vw, 26px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, letterSpacing: 2 }}>{stmt}</button>
              ))}
              {wrongSet.size > 0 && !solvedRound && <p className="lm-hint-bad fade-up">{t(it.hint)}</p>}
            </div>
          </>
        )}
        {done && (
          <div ref={revealRef} className="frame-success reveal-soft">
            <Reaction state="correct" praise={lang === 'ru' ? `Верно: ${score} из ${items.length}` : `To'g'ri: ${items.length} tadan ${score} ta`}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s10 — MASALA (case): Jasur ikki tuman -> belgi (bir raund)
const Screen10 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s10;
  const sfx = useSfx();
  const audio = useAudio([
    brgSeg('s10', lang),
    { id: 's10_setup', text: c.setup_audio[lang], trigger: 'after_previous', waits_for: null },
    { id: 's10_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [picked, setPicked] = useState(props.storedAnswer ? props.storedAnswer.studentAnswer : null);
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const solved = picked === c.sign;
  const firstRef = useRef(props.storedAnswer ? props.storedAnswer.firstTry : null);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const revealRef = useRevealScroll(solved, 500);
  const bigger = c.pair[0] > c.pair[1] ? 0 : (c.pair[0] < c.pair[1] ? 1 : -1);
  const pick = (sgn) => {
    if (!canAct || solved || wrongSet.has(sgn)) return;
    if (sgn === c.sign) {
      setPicked(sgn); sfx.playCorrect();
      if (firstRef.current === null) firstRef.current = wrongSet.size === 0;
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_correct[lang]); }
    } else {
      const n = new Set(wrongSet); n.add(sgn); setWrongSet(n);
      firstRef.current = false;
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_wrong[lang]); }
    }
  };
  useEffect(() => {
    if (solved && !recorded) {
      setRecorded(true);
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: t(c.q),
        correctAnswer: c.sign, studentAnswer: c.sign, correct: firstRef.current === null ? true : firstRef.current,
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
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <p className="fade-up" style={{ textAlign: 'center', color: T.ink2, fontWeight: 700, margin: 0 }}>{t(c.lead)}</p>
        <h1 className="title h-sub fade-up delay-1" style={{ margin: 0 }}>{t(c.q)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(12px, 2.6vw, 18px)', padding: 'clamp(14px, 2.6vw, 20px)' }}>
          <FrameFx/>
          <div className="lm-cmprow">
            <div className={`lm-cmpcell ${solved && bigger === 0 ? 'lm-cmp-big' : ''}`}><BigNum v={c.pair[0]}/></div>
            <span className="lm-cmpslot mono">{picked ? <span className="lm-sign-in">{picked}</span> : '?'}</span>
            <div className={`lm-cmpcell ${solved && bigger === 1 ? 'lm-cmp-big' : ''}`}><BigNum v={c.pair[1]}/></div>
          </div>
          <div className="lm-signrow">
            {CMP_SIGNS.map((sgn) => (
              <button key={sgn} className={`lm-signbtn mono ${wrongSet.has(sgn) ? 'lm-signbtn-wrong' : ''} ${picked === sgn ? 'lm-signbtn-ok' : ''}`} disabled={!canAct || solved || wrongSet.has(sgn)} onClick={() => pick(sgn)}>{sgn}</button>
            ))}
          </div>
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

// FaktCard rasmi: rang shkalasi. Chapda issiq ko'k yulduz, o'rtada Quyosh, o'ngda sovuqroq
// qizil mitti — har biri o'z rangining ustida turadi.
const ColorScaleFig = () => (
  <span className="d2-factfig" aria-hidden="true">
    <svg viewBox="0 0 340 150" width="340" height="150" preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="d4Bg" cx="50%" cy="42%" r="66%"><stop offset="0%" stopColor="#241A34"/><stop offset="55%" stopColor="#14122A"/><stop offset="100%" stopColor="#080716"/></radialGradient>
        <linearGradient id="d4Scale" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#9EC6FF"/><stop offset="30%" stopColor="#FFF6E8"/><stop offset="58%" stopColor="#FFD86B"/><stop offset="82%" stopColor="#FF7A3C"/><stop offset="100%" stopColor="#C42C0E"/></linearGradient>
        <radialGradient id="d4Hot" cx="38%" cy="34%" r="66%"><stop offset="0%" stopColor="#FFFFFF"/><stop offset="52%" stopColor="#CFE4FF"/><stop offset="100%" stopColor="#6E96D8"/></radialGradient>
        <radialGradient id="d4Sun" cx="38%" cy="34%" r="66%"><stop offset="0%" stopColor="#FFFBE8"/><stop offset="46%" stopColor="#FFD24C"/><stop offset="100%" stopColor="#E08A18"/></radialGradient>
        <radialGradient id="d4Cold" cx="38%" cy="34%" r="66%"><stop offset="0%" stopColor="#FFD2A8"/><stop offset="44%" stopColor="#FF6A3C"/><stop offset="100%" stopColor="#B02810"/></radialGradient>
        <clipPath id="d4Clip"><rect x="0" y="0" width="340" height="150" rx="16"/></clipPath>
      </defs>
      <g clipPath="url(#d4Clip)">
        <rect width="340" height="150" fill="url(#d4Bg)"/>
        <g fill="#FFF6E8">
          {[[24, 20, 1.2, 0], [124, 16, 1, 0.9], [300, 24, 1.3, 1.6], [320, 62, 1, 2.2]].map(([x, y, r, d], i) => (
            <circle key={i} className="lm-ff-tw" style={{ animationDelay: d + 's' }} cx={x} cy={y} r={r}/>
          ))}
        </g>
        <circle cx="70" cy="60" r="17" fill="url(#d4Hot)"/>
        <circle cx="170" cy="62" r="14" fill="url(#d4Sun)"/>
        <circle className="lm-ff-glow" cx="272" cy="66" r="12.5" fill="#FF6A3C" opacity="0.28"/>
        <circle cx="272" cy="66" r="9.5" fill="url(#d4Cold)"/>
        <g stroke="rgba(255,238,210,0.5)" strokeWidth="1.4" strokeDasharray="3 3">
          <line x1="70" y1="80" x2="70" y2="100"/>
          <line x1="170" y1="79" x2="170" y2="100"/>
          <line x1="272" y1="78" x2="272" y2="100"/>
        </g>
        <rect x="26" y="102" width="288" height="14" rx="7" fill="url(#d4Scale)"/>
        <g fill="#FFF6E8" opacity="0.9">
          <circle cx="70" cy="109" r="3.2"/>
          <circle cx="170" cy="109" r="3.2"/>
          <circle cx="272" cy="109" r="3.2"/>
        </g>
      </g>
    </svg>
  </span>
);

// s11 — FINAL panel (5 savol aralash) + FactCard
const Screen11 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s11;
  const items = c.items;
  // Final MC variantlari har mount'da aralashadi. orders[idx][pos] = ASL indeks; to'g'ri = ASL 0.
  const orders = React.useMemo(() => items.map((it) => it.kind === 'num' ? null : shuffleArr([0, 1, 2])), []);
  const audio = useAudio([
    brgSeg('s11', lang),
    { id: 's11_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
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
    setNumState(isOk ? 'ok' : 'bad');
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((isOk ? c.audio.on_correct : it.hint)[lang]); }
    if (isOk) {
      if (!numTriedRef.current) setScore((s) => s + 1);
      setTimeout(() => { setVal(''); setNumLock(false); setNumState(null); setHintMsg(null); numTriedRef.current = false; setIdx((n) => n + 1); }, 1700);
    } else {
      numTriedRef.current = true;
      setHintMsg(it.hint);
      setTimeout(() => { setVal(''); setNumLock(false); setNumState(null); }, 1700);
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
            <div className="mono" style={{ textAlign: 'center', color: T.accent, fontWeight: 800 }}>{lang === 'ru' ? `Задание ${idx + 1} из ${items.length}` : `${idx + 1}-topshiriq, jami ${items.length}`}</div>
            <h2 className="title h-sub" style={{ textAlign: 'center' }}>{t(it.q)}</h2>
            {it.kind === 'num' ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'center' }}><MiniCity/></div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <NumPad value={val} setValue={setVal} disabled={!canAct || numLock} max={3} state={numState}/>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button className="btn-white-accent" disabled={!canAct || numLock || val === ''} onClick={checkNum}>{lang === 'ru' ? 'Проверить' : 'Tekshir'}</button>
                </div>
                {hintMsg && <p className="lm-hint-bad fade-up">{t(it.hint)}</p>}
              </>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10 }}>
                  {orders[idx].map((k, i) => (
                    <button key={i} className={`option ${picked === i ? 'option-correct' : wrongSet.has(i) ? 'option-picked-wrong' : ''}`} disabled={!canAct || picked !== null || wrongSet.has(i)} onClick={() => pick(i)}
                      style={{ padding: 'clamp(10px, 1.6vw, 13px)', fontSize: 'clamp(14px, 2vw, 17px)', minHeight: 'clamp(46px, 6.5vw, 56px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
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
            <div className="frame-success fade-up" style={{ marginBottom: 12 }}><Reaction state="correct" praise={lang === 'ru' ? `Верно: ${score} из ${items.length}` : `To'g'ri: ${items.length} tadan ${score} ta`}/></div>
            <div className="d2-factcard fade-up">
              <span className="d2-factcard-badge mono">{t(c.fact_badge)}</span>
              <div className="d2-fact-hero"><ColorScaleFig/></div>
              <p className="d2-factcard-txt">{t(c.fact_text)}</p>
            </div>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s12 — YAKUN
const Screen12 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s12;
  const audio = useAudio([
    { id: 's12_pay', text: S12_PAYOFF[lang], trigger: 'on_mount', waits_for: null },
    { id: 's12_sum', text: c.audio[lang], trigger: 'after_previous', waits_for: null }
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
        <div className="fade-up delay-1"><LessonScene gathered/></div>
      </div>
    </Stage>
  );
};

// ============================================================
// KORNEVOY KOMPONENT (shablon: infrastructure_v1 / grade1 Dars28)
// ============================================================
export default function CompareLesson({
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12];
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
/* Хук с дополнительной панелью: рамка тянется, сцена занимает ровно остаток места.
   Так не нужен магический запас высоты — экран сходится на любом окне. */
.lm-scene-host { flex: 1 1 auto; min-height: 0; display: flex; align-items: center; justify-content: center; }
.lm-scene-host .lm-scene { width: auto; height: 100%; max-width: 100%; max-height: 372px; }
.lm-scene { position: relative; width: min(100%, calc(clamp(var(--scene-floor, 160px), calc(100dvh - var(--scene-reserve, 570px)), 372px) * 400 / 210)); aspect-ratio: 400 / 210; margin-inline: auto; border-radius: 14px; overflow: hidden; }
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
