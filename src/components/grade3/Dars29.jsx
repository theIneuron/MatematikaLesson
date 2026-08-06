import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { BackLabel, BitSVG, CheckStrip, Chiroq, Confetti, D2Defs, D2Motes, FREE_NAV, FeedbackBlock, FoldRow, FrameFx, GradientDefs, HeroContext, LUMO_CAST, LangContext, Lenta, NavBack, NavNext, NextLabel, Panel, ProgressContext, Reaction, ReadinessMeter, Stage, StageHero, T, TaskTable, configureLesson, getAudioEngine, nextPraise, npKey, shuffleArr, ttsConfig, useAdvanceGate, useAudio, useCanAnswer, useLang, useMobileZoom, usePrefersReducedMotion, useRevealScroll, useSfx, useT, useTapSteps, makeBrgSeg } from './_kit/index.jsx';
import { BASE_STYLES } from './_kit/styles.js';

// ============================================================================
// DD 3-SINF | Dars29 — "Kasrlarni taqqoslash" (num-3-29) | Б4 «ULUSH HUDUDI»
// Syujet: qadimgi chorak davom etadi (SYUJET_3SINF.md 184-satr, reja 32-satr).
// SAHNA: blok foni O'ZGARMAYDI. Ishchi tugun BOSHQA: stelada ikki YOZUV O'RAMI yonma-yon,
//   biri 5/12, ikkinchisi 7/12 ga yozilgan; o'ngda yarim ulush shkalasi.
// MEXANIKA (yangi mexanika YARATILMAGAN): 28-darsning `SharePair` i, har figurada o'z
//   to'ldirilishi. Qolgani tayyor.
// DARSLIK ASOSI (Burxonov, 3-sinf, «Sharq» 2019):
//   143-bet «Maxraji bir xil bo'lgan kasrlarni taqqoslash» — birinchi belgi;
//   145-bet «Surati bir xil bo'lgan kasrlarni taqqoslash» — ikkinchi belgi;
//   148-bet «Kasrlarni yarim ulush bilan taqqoslash» — uchinchi yo'l, s5 va s6.
// YADRO: avval NIMA MOS KELGANIGA qaraymiz. Maxraj mos kelsa suratlarni sanaymiz, surat mos
//   kelsa maxrajlarga qaraymiz, hech nima mos kelmasa yarim bilan solishtiramiz.
// Misconception: M1 teng suratlarda maxrajga sonlar qoidasini qo'llash; M2 qavatlarni
//   qo'shib taqqoslash; M3 belgini chamalab qo'yish; M4 noto'g'ri kasrni to'g'risidan kichik
//   deb hisoblash.
// FactCard: yarim nazoratchi — biri yarimdan katta, ikkinchisi kichik bo'lsa, javob darrov.
// Kontent: src/books/grade3/KONTENT_3SINF.md, «Dars 29». Karkas: BLOK_B4_KARKAS.md.
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
  lessonId: 'num-3-29',
  lessonTitle: { ru: 'Урок 29. Сравнение дробей', uz: "29-dars. Kasrlarni taqqoslash" }
};
// STRUKTURA (KONTENT_3SINF.md «Dars 29»): s0 xuk 3/8 va 5/8 · s1 ikki belgi · s2 model bir
// xil maxraj · s3 savol-oldin-QOIDA · s4 rasm bo'yicha 2/3 va 2/5 · s5 saralash yarim bilan ·
// s6 test 5/6 va 1/2 · s7 konsol ikki juftlik · s8 xatoni top (teng suratlar) · s9 Bit
// tuzog'i (qavatlarni qo'shish) · s10 trenajyor bir xil maxraj · s11 trenajyor bir xil surat ·
// s12 masala (7 − 5, keyin 12 − 7) · s13 final 3 topshiriq + FactCard · s14 yakun.
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
  // s0 — XUK: maxrajlar bir xil (darslik 143-bet).
  s0: {
    eyebrow: { ru: 'Крючок', uz: 'Qiziqtirish' },
    topic: { ru: 'Сравнение дробей', uz: 'Kasrlarni taqqoslash' },
    lead: { ru: 'Две одинаковые полосы разрезали на 8 частей', uz: "Ikkita bir xil tasma 8 bo'lakka kesilgan" },
    order_cap: { ru: 'на первой закрашено 3 части, на второй 5', uz: "birinchisida 3 ta, ikkinchisida 5 ta bo'lak bo'yalgan" },
    q: { ru: 'Какая дробь больше?', uz: 'Qaysi kasr katta?' },
    opt0: { ru: '5/8', uz: '5/8' },
    opt1: { ru: '3/8', uz: '3/8' },
    opt2: { ru: 'они равны', uz: 'ular teng' },
    opt3: { ru: 'сравнить нельзя', uz: "taqqoslab bo'lmaydi" },
    audio: {
      intro: {
        ru: [
          'Доли сравнивать ты умеешь. Сегодня научишься сравнивать любые дроби.',
          'Две одинаковые полосы разрезали на восемь частей.',
          'На первой закрашено три части, на второй пять.',
          'Как думаешь, какая дробь больше?'
        ],
        uz: [
          "Ulushlarni taqqoslashni bilasiz. Bugun istalgan kasrni taqqoslashni o'rganasiz.",
          "Ikkita bir xil tasma sakkizta bo'lakka kesildi.",
          "Birinchisida uchta bo'lak, ikkinchisida beshta bo'lak bo'yalgan.",
          "Sizningcha, qaysi kasr katta?"
        ]
      },
      on_correct: { ru: 'Верно! А сейчас увидишь, когда так рассуждать можно, а когда нет.', uz: "To'g'ri! Endi qachon bunday mulohaza qilish mumkin, qachon yo'qligini ko'rasiz." },
      on_wrong1: { ru: 'Куски одинаковые, а закрашено меньше. Значит и дробь меньше.', uz: "Bo'laklar bir xil, bo'yalgani esa kam. Demak kasr ham kichik." },
      on_wrong2: { ru: 'Закрашено разное число частей, равными дроби быть не могут.', uz: "Har xil sondagi bo'lak bo'yalgan, kasrlar teng bo'la olmaydi." },
      on_idk: { ru: 'Ничего. Сейчас положим полосы рядом и посмотрим.', uz: "Hechqisi yo'q. Hozir tasmalarni yonma-yon qo'yib ko'ramiz." }
    }
  },

  // s1 — IKKI BELGI: maxraj bir xil / surat bir xil (darslik 143 va 145-bet).
  s1: {
    eyebrow: { ru: 'Разбор', uz: 'Tahlil' },
    lead: { ru: 'Смотрим, что у дробей совпало', uz: "Kasrlarda nima mos kelganiga qaraymiz" },
    task_line: 'два признака сравнения',
    task_line_uz: 'ikkita taqqoslash belgisi',
    step1: '3/8 < 5/8',
    step1_cap: { ru: 'знаменатели равны, смотрим числители', uz: "maxrajlar teng, suratlarga qaraymiz" },
    step2: '2/3 > 2/5',
    step2_cap: { ru: 'числители равны, смотрим знаменатели', uz: "suratlar teng, maxrajlarga qaraymiz" },
    res: 'сначала смотрим, что совпало',
    btn1: { ru: 'Одинаковые знаменатели', uz: 'Maxrajlar bir xil' },
    btn2: { ru: 'Одинаковые числители', uz: 'Suratlar bir xil' },
    done_text: { ru: 'Признак выбирается по тому, что совпало', uz: "Belgi nima mos kelganiga qarab tanlanadi" },
    audio: {
      ru: [
        'Есть два простых случая, и оба ты уже видел.',
        'Если знаменатели одинаковые, куски одного размера. Больше та дробь, где кусков больше. Три восьмых меньше пяти восьмых.',
        'Если одинаковые числители, кусков поровну, но они разного размера. Больше та дробь, где знаменатель меньше. Две трети больше двух пятых.'
      ],
      uz: [
        "Ikkita oddiy holat bor, ikkalasini ham ko'rgansiz.",
        "Maxrajlar bir xil bo'lsa, bo'laklar bir kattalikda. Bo'lagi ko'p kasr katta. Sakkizdan uch sakkizdan beshdan kichik.",
        "Suratlar bir xil bo'lsa, bo'lak soni teng, lekin kattaligi har xil. Maxraji kichik kasr katta. Uchdan ikki beshdan ikkidan katta."
      ]
    }
  },

  // s2 — MODEL: bir xil maxrajli ikki tasma.
  s2: {
    eyebrow: { ru: 'Модель', uz: 'Model' },
    left_parts: 8,
    left_filled: 3,
    right_parts: 8,
    right_filled: 5,
    lead: { ru: 'При одном знаменателе считать легко', uz: "Maxraj bir xil bo'lsa, sanash oson" },
    capA: { ru: 'слева 3 части из 8', uz: "chapda 8 tadan 3 ta" },
    capB: { ru: 'справа 5 частей, кусков больше', uz: "o'ngda 5 ta, bo'lak ko'proq" },
    res: '3/8 < 5/8',
    btn1: { ru: 'Показать первую', uz: "Birinchisini ko'rsatish" },
    btn2: { ru: 'Показать вторую', uz: "Ikkinchisini ko'rsatish" },
    done_text: { ru: 'Куски одного размера, значит решает их число', uz: "Bo'laklar bir kattalikda, demak ularning soni hal qiladi" },
    audio: {
      ru: [
        'Положим полосы рядом.',
        'На первой закрашено три части из восьми.',
        'На второй пять таких же частей. Куски одинаковые, значит больше та дробь, у которой их больше.'
      ],
      uz: [
        "Tasmalarni yonma-yon qo'yamiz.",
        "Birinchisida sakkiztadan uchta bo'lak bo'yalgan.",
        "Ikkinchisida xuddi shunday beshta bo'lak. Bo'laklar bir xil, demak soni ko'p bo'lgan kasr katta."
      ]
    }
  },

  // s3 — SAVOL-OLDIN-QOIDA: nima mos kelganiga qarab belgi tanlanadi.
  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    q: { ru: 'У дробей 4/9 и 7/9 совпали знаменатели. На что смотрим?', uz: "4/9 va 7/9 kasrlarining maxraji mos keldi. Nimaga qaraymiz?" },
    opts: [
      { ru: 'на числители', uz: 'suratlarga' },
      { ru: 'на знаменатели', uz: 'maxrajlarga' },
      { ru: 'на сумму этажей', uz: "qavatlar yig'indisiga" },
      { ru: 'сравнить нельзя', uz: "taqqoslab bo'lmaydi" }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Знаменатели уже одинаковые, сравнивать в них нечего.', uz: "Maxrajlar allaqachon bir xil, ularda taqqoslaydigan narsa yo'q." },
      2: { ru: 'Складывать этажи нельзя, это не одно число.', uz: "Qavatlarni qo'shib bo'lmaydi, bu bitta son emas." },
      3: { ru: 'Целое одно и то же, сравнить можно всегда.', uz: "Butun bitta va o'sha, taqqoslash har doim mumkin." }
    },
    on_correct: { ru: 'Да. Куски одинаковые, решает их количество.', uz: "Ha. Bo'laklar bir xil, ularning soni hal qiladi." },
    rule_lines: {
      ru: ['Если знаменатели одинаковые, больше та дробь, у которой числитель больше.', 'Если числители одинаковые, больше та, у которой знаменатель меньше. Если не совпало ничего, сравниваем каждую с половиной.'],
      uz: ["Maxrajlar bir xil bo'lsa, surati katta kasr katta.", "Suratlar bir xil bo'lsa, maxraji kichigi katta. Hech nima mos kelmasa, har birini yarim bilan solishtiramiz."]
    },
    rule_ex: '4/9 < 7/9',
    rule_speech: { ru: 'четыре девятых меньше семи девятых', uz: "to'qqizdan to'rt to'qqizdan yettidan kichik" },
    audio: {
      intro: {
        ru: 'Сначала решаем, каким признаком пользоваться. У дробей четыре девятых и семь девятых совпали знаменатели. На что смотрим?',
        uz: "Avval qaysi belgidan foydalanishni hal qilamiz. To'qqizdan to'rt va to'qqizdan yetti kasrlarining maxraji mos keldi. Nimaga qaraymiz?"
      }
    }
  },

  // s4 — RASM BO'YICHA: suratlar bir xil, maxrajlar boshqa.
  s4: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv' },
    q: { ru: 'Какой знак поставить между 2/3 и 2/5?', uz: "2/3 va 2/5 orasiga qaysi belgi qo'yiladi?" },
    fig_left: 3,
    fig_left_filled: 2,
    fig_right: 5,
    fig_right_filled: 2,
    opts: [
      { ru: 'больше', uz: 'katta' },
      { ru: 'меньше', uz: 'kichik' },
      { ru: 'равно', uz: 'teng' },
      { ru: 'сравнить нельзя', uz: "taqqoslab bo'lmaydi" }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Кусков поровну, но слева они крупнее.', uz: "Bo'lak soni teng, lekin chapdagilari yirikroq." },
      2: { ru: 'Куски разного размера, равными дроби быть не могут.', uz: "Bo'laklar har xil, kasrlar teng bo'la olmaydi." },
      3: { ru: 'Целые одинаковые, сравнить можно.', uz: "Butunlar bir xil, taqqoslasa bo'ladi." }
    },
    audio: {
      intro: { ru: 'Здесь числители совпали, а знаменатели разные. Какой знак поставить?', uz: "Bu yerda suratlar mos keldi, maxrajlar esa boshqa. Qaysi belgi qo'yiladi?" },
      on_correct: { ru: 'Верно. Куски по три крупнее, чем куски по пять.', uz: "To'g'ri. Uchga bo'lingan bo'laklar beshga bo'linganidan yirik." },
      on_wrong: { ru: 'Кусков поровну. Значит решает их размер.', uz: "Bo'lak soni teng. Demak ularning kattaligi hal qiladi." }
    }
  },

  // s5 — SARALASH: yarim bilan solishtirish (darslik 148-bet).
  s5: {
    eyebrow: { ru: 'Сортировка', uz: 'Saralash' },
    lead: { ru: 'Сравни каждую дробь с половиной', uz: 'Har bir kasrni yarim bilan solishtiring' },
    bin_a: { ru: 'больше половины', uz: 'yarimdan katta' },
    bin_b: { ru: 'меньше половины', uz: 'yarimdan kichik' },
    items: [
      { n: { ru: '5/6', uz: '5/6' }, a: true, hint: { ru: 'Половина это три шестых, а тут пять.', uz: "Yarim bu oltidan uch, bu yerda esa besh." } },
      { n: { ru: '2/8', uz: '2/8' }, a: false, hint: { ru: 'Половина это четыре восьмых, а тут две.', uz: "Yarim bu sakkizdan to'rt, bu yerda esa ikki." } },
      { n: { ru: '3/4', uz: '3/4' }, a: true, hint: { ru: 'Половина это две четвёртых, а тут три.', uz: "Yarim bu to'rtdan ikki, bu yerda esa uch." } },
      { n: { ru: '1/3', uz: '1/3' }, a: false, hint: { ru: 'До половины не хватает, три части это больше двух.', uz: "Yarimga yetmaydi, uchta bo'lak ikkitadan ko'p." } }
    ],
    audio: {
      intro: { ru: 'Четыре дроби. Сравни каждую с половиной и отправь на свою полку.', uz: "To'rtta kasr. Har birini yarim bilan solishtirib, o'z tokchasiga yuboring." },
      on_correct: { ru: 'Все на месте. Половина это когда числитель ровно вдвое меньше знаменателя.', uz: "Hammasi joyida. Yarim bu surat maxrajdan roppa-rosa ikki barobar kichik bo'lgani." },
      on_wrong: { ru: 'Прикинь, сколько будет половина от этих частей.', uz: "Bu bo'laklarning yarmi qancha bo'lishini chamalang." }
    }
  },

  // s6 — TEST: yarim bilan taqqoslash.
  s6: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv' },
    q: { ru: 'Что больше: 5/6 или 1/2?', uz: '5/6 mi yoki 1/2 mi katta?' },
    opts: [
      { ru: '5/6', uz: '5/6' },
      { ru: '1/2', uz: '1/2' },
      { ru: 'они равны', uz: 'ular teng' },
      { ru: 'сравнить нельзя', uz: "taqqoslab bo'lmaydi" }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Половина это три шестых. Пять больше трёх.', uz: "Yarim bu oltidan uch. Besh uchdan katta." },
      2: { ru: 'Равными они быть не могут, частей взято разное число.', uz: "Ular teng bo'la olmaydi, har xil sondagi bo'lak olingan." },
      3: { ru: 'Целое одно и то же, значит сравнить можно.', uz: "Butun bitta va o'sha, demak taqqoslasa bo'ladi." }
    },
    audio: {
      intro: { ru: 'Быстрый вопрос. Что больше, пять шестых или одна вторая?', uz: "Tez savol. Oltidan besh mi yoki ikkidan bir mi katta?" },
      on_correct: { ru: 'Верно. Половина это три шестых, а взяли пять.', uz: "To'g'ri. Yarim bu oltidan uch, olingani esa besh." },
      on_wrong: { ru: 'Переведи половину в шестые доли и сравни.', uz: "Yarimni oltidan bo'lakka aylantirib solishtiring." }
    }
  },

  // s7 — KONSOL: uchta juftlik, har birida katta kasrning surati yoki maxraji.
  s7: {
    eyebrow: { ru: 'Консоль', uz: 'Konsol' },
    lead: { ru: 'Заполни консоль по признакам', uz: "Konsolni belgilar bo'yicha to'ldiring" },
    swap_line: '7/10 и 3/10, потом 4/5 и 4/9',
    cells: [
      { head: { ru: 'первая пара', uz: 'birinchi juft' }, label: 'числитель большей', ans: 7, hint: { ru: 'Знаменатели совпали, решают числители.', uz: "Maxrajlar mos keldi, suratlar hal qiladi." } },
      { head: { ru: 'вторая пара', uz: 'ikkinchi juft' }, label: 'знаменатель большей', ans: 5, hint: { ru: 'Числители совпали, крупнее там, где частей меньше.', uz: "Suratlar mos keldi, bo'lak kam joyda yirikroq." } },
      { head: { ru: 'проверка', uz: 'tekshirish' }, label: 'половина от 10', ans: 5, hint: { ru: 'Половина десяти это пять.', uz: "O'nning yarmi besh." } }
    ],
    check: '7/10 > 3/10, 4/5 > 4/9',
    check_label: { ru: 'два признака подряд', uz: 'ketma-ket ikki belgi' },
    audio: {
      intro: { ru: 'Заполни три окна. В первой паре совпали знаменатели, во второй числители.', uz: "Uchta oynani to'ldiring. Birinchi juftda maxrajlar, ikkinchisida suratlar mos keldi." },
      on_correct: { ru: 'Оба признака сработали. Смотри сначала, что совпало.', uz: "Ikkala belgi ham ishladi. Avval nima mos kelganiga qarang." }
    }
  },

  // s8 — XATONI TOP: suratlar bir xil, maxrajga noto'g'ri qoida (M1).
  s8: {
    eyebrow: { ru: 'Найди ошибку', uz: 'Xatoni toping' },
    q: { ru: 'Кто-то написал: 2/5 больше 2/3, потому что 5 больше 3. В чём ошибка?', uz: "Kimdir yozibdi: 2/5 2/3 dan katta, chunki 5 uchdan katta. Xato nimada?" },
    fig_line: '2/5 > 2/3',
    opts: [
      { ru: 'при равных числителях больше та, где знаменатель меньше', uz: "suratlar teng bo'lsa, maxraji kichigi katta" },
      { ru: 'надо было сравнить числители', uz: 'suratlarni taqqoslash kerak edi' },
      { ru: 'такие дроби сравнивать нельзя', uz: "bunday kasrlarni taqqoslab bo'lmaydi" },
      { ru: 'ошибки нет', uz: "xato yo'q" }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Числители и так равны, сравнивать в них нечего.', uz: "Suratlar allaqachon teng, ularda taqqoslaydigan narsa yo'q." },
      2: { ru: 'Целое одно и то же, сравнить можно.', uz: "Butun bitta va o'sha, taqqoslasa bo'ladi." },
      3: { ru: 'Ошибка есть. На пять частей режут мельче, чем на три.', uz: "Xato bor. Beshga bo'lganda uchga bo'lgandan mayda chiqadi." }
    },
    audio: {
      intro: { ru: 'Здесь сравнили дроби и получили наоборот. Найди ошибку в рассуждении.', uz: "Bu yerda kasrlar taqqoslanib, teskarisi chiqqan. Mulohazadagi xatoni toping." },
      on_correct: { ru: 'Точно. Кусков поровну, но пятые доли мельче третьих.', uz: "Aniq. Bo'lak soni teng, lekin beshdan bo'laklar uchdan boshqasidan mayda." },
      on_wrong: { ru: 'Посмотри, что здесь совпало, и вспомни нужный признак.', uz: "Bu yerda nima mos kelganiga qarang va kerakli belgini eslang." }
    }
  },

  // s9 — BIT TUZOG'I: qavatlarni qo'shib taqqoslash (M2, yopiq maydon).
  s9: {
    eyebrow: { ru: 'Ловушка Бита', uz: 'Bit tuzog\'i' },
    lead: { ru: 'Бит придумал быстрый способ', uz: "Bit tezkor usul o'ylab topdi" },
    lines: ['сравним 3/4 и 5/8', 'Бит: 3 и 4 это 7, а 5 и 8 это 13'],
    lines_uz: ["3/4 va 5/8 ni taqqoslaymiz", "Bit: 3 va 4 bu 7, 5 va 8 esa 13"],
    line_cap: { ru: 'Бит: сумма больше, значит и дробь больше', uz: "Bit: yig'indi katta, demak kasr ham katta" },
    trap_label: { ru: 'Так ли это?', uz: 'Shundaymi?' },
    trap_opts: { ru: ['нет, так считать нельзя', 'да, способ рабочий'], uz: ["yo'q, bunday hisoblab bo'lmaydi", 'ha, usul ishlaydi'] },
    trap_ci: 0,
    trap_correct: { ru: 'Да. Три четвёртых это шесть восьмых, и это больше пяти восьмых. Сумма этажей ничего не говорит о размере дроби.', uz: "Ha. To'rtdan uch bu sakkizdan olti, u sakkizdan beshdan katta. Qavatlar yig'indisi kasrning kattaligi haqida hech nima aytmaydi." },
    trap_wrong: { ru: 'Проверь по рисунку. Три четвёртых это шесть восьмых, а у Бита вышло меньше.', uz: "Rasm bo'yicha tekshiring. To'rtdan uch bu sakkizdan olti, Bitda esa kamroq chiqdi." },
    audio: {
      ru: [
        'Бит придумал быстрый способ сравнивать дроби.',
        'Складываю оба этажа. Три и четыре это семь, пять и восемь это тринадцать. Сумма больше, значит и дробь больше.',
        'Так ли это?'
      ],
      uz: [
        "Bit kasrlarni taqqoslashning tezkor usulini o'ylab topdi.",
        "Ikkala qavatni qo'shaman. Uch va to'rt bu yetti, besh va sakkiz bu o'n uch. Yig'indi katta, demak kasr ham katta.",
        "Shundaymi?"
      ]
    }
  },

  // s10 — TRENAJYOR: bir xil maxraj.
  s10: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq' },
    q: { ru: 'Что больше: 4/9 или 7/9? Набери числитель большей дроби.', uz: "4/9 mi yoki 7/9 mi katta? Katta kasrning suratini tering." },
    ans: 7,
    check: '7/9 > 4/9',
    check_label: { ru: 'знаменатели равны', uz: 'maxrajlar teng' },
    hint: { ru: 'Куски одинаковые, считай их число.', uz: "Bo'laklar bir xil, sonini sanang." },
    audio: {
      intro: { ru: 'Что больше, четыре девятых или семь девятых? Набери числитель большей дроби.', uz: "To'qqizdan to'rt mi yoki to'qqizdan yetti mi katta? Katta kasrning suratini tering." },
      on_correct: { ru: 'Семь. Куски одного размера, значит решает их число.', uz: "Yetti. Bo'laklar bir kattalikda, demak soni hal qiladi." }
    }
  },

  // s11 — TRENAJYOR NumPad: bir xil surat.
  s11: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq' },
    q: { ru: 'Что больше: 3/5 или 3/10? Набери знаменатель большей дроби.', uz: "3/5 mi yoki 3/10 mi katta? Katta kasrning maxrajini tering." },
    ans: 5,
    check: '3/5 > 3/10',
    check_label: { ru: 'числители равны', uz: 'suratlar teng' },
    hint: { ru: 'Кусков поровну, крупнее там, где частей меньше.', uz: "Bo'lak soni teng, bo'lak kam joyda yirikroq." },
    audio: {
      intro: { ru: 'Что больше, три пятых или три десятых? Набери знаменатель большей дроби.', uz: "Beshdan uch mi yoki o'ndan uch mi katta? Katta kasrning maxrajini tering." },
      on_correct: { ru: 'Пять. Кусков поровну, но пятые доли крупнее десятых.', uz: "Besh. Bo'lak soni teng, lekin beshdan bo'laklar o'ndan boshqasidan yirik." }
    }
  },

  // s12 — MASALA: jadval bilan, ikki qadam.
  s12: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    lead: { ru: 'Два свитка у стелы', uz: 'Stela yonidagi ikki o\'ram' },
    q: { ru: 'Два одинаковых свитка. Первый исписан на 5/12, второй на 7/12. Насколько больше частей исписано во втором?', uz: "Ikkita bir xil o'ram. Birinchisi 5/12 ga, ikkinchisi 7/12 ga yozilgan. Ikkinchisida nechta bo'lak ko'p yozilgan?" },
    q_speech: { ru: 'два одинаковых свитка. Первый исписан на пять двенадцатых, второй на семь двенадцатых. Насколько больше частей исписано во втором?', uz: "ikkita bir xil o'ram. Birinchisi o'n ikkidan besh, ikkinchisi o'n ikkidan yetti qismiga yozilgan. Ikkinchisida nechta bo'lak ko'p yozilgan?" },
    tbl_heads: [
      { ru: 'частей всего', uz: "jami bo'lak" },
      { ru: 'первый', uz: 'birinchi' },
      { ru: 'второй', uz: 'ikkinchi' }
    ],
    tbl_cells: ['12', '5', '7'],
    pick_label: { ru: 'С какого действия начинаем?', uz: 'Qaysi amaldan boshlaymiz?' },
    opts: [
      { ru: '7 − 5', uz: '7 − 5' },
      { ru: '7 + 5', uz: '7 + 5' },
      { ru: '12 − 7', uz: '12 − 7' },
      { ru: '12 : 5', uz: '12 : 5' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Спрашивают, насколько больше. Это вычитание числителей.', uz: "Qanchaga ko'p deb so'ralyapti. Bu suratlarni ayirish." },
      2: { ru: 'Складывать исписанные части двух свитков не нужно.', uz: "Ikki o'ramning yozilgan qismini qo'shish shart emas." },
      3: { ru: 'Так мы найдём чистую часть второго свитка, а спрашивают другое.', uz: "Bunda ikkinchi o'ramning toza qismi topiladi, so'ralgani esa boshqa." }
    },
    pick_ok: { ru: 'Верно. Знаменатели равны, значит сравниваем числители.', uz: "To'g'ri. Maxrajlar teng, demak suratlarni taqqoslaymiz." },
    step1_q: { ru: 'На сколько частей больше исписано во втором?', uz: "Ikkinchisida nechta bo'lak ko'p yozilgan?" },
    ans1: 2,
    hint1: { ru: 'Из семи убери пять.', uz: "Yettidan beshni olib tashlang." },
    step2_q: { ru: 'Сколько частей второго свитка ещё чистые?', uz: "Ikkinchi o'ramning nechta bo'lagi hali toza?" },
    ans2: 5,
    hint2: { ru: 'Из двенадцати убери семь.', uz: "O'n ikkitadan yettini olib tashlang." },
    check: '7/12 > 5/12',
    setup_audio: { ru: 'У стелы нашли два свитка. Посмотри на таблицу и реши, с чего начинать.', uz: "Stela yonidan ikkita o'ram topildi. Jadvalga qarang va nimadan boshlashni hal qiling." },
    audio: {
      intro: { ru: 'Два одинаковых свитка. Первый исписан на пять двенадцатых, второй на семь. Насколько больше частей исписано во втором?', uz: "Ikkita bir xil o'ram. Birinchisi o'n ikkidan besh, ikkinchisi yetti qismiga yozilgan. Ikkinchisida nechta bo'lak ko'p yozilgan?" },
      on_correct: { ru: 'На две части больше, и пять частей ещё чистые.', uz: "Ikkita bo'lakka ko'p, beshta bo'lak esa hali toza." },
      on_wrong: { ru: 'Вернись к первому шагу. Знаменатели одинаковые, работай с числителями.', uz: "Birinchi qadamga qayting. Maxrajlar bir xil, suratlar bilan ishlang." }
    }
  },

  // s13 — FINAL: uch topshiriq, sonlar darsda uchramagan.
  s13: {
    eyebrow: { ru: 'Финал', uz: 'Yakuniy' },
    intro_line: { ru: 'Три задания. Сначала смотри, что совпало', uz: "Uchta topshiriq. Avval nima mos kelganiga qarang" },
    items: [
      {
        kind: 'num',
        q: { ru: 'Что больше: 2/7 или 6/7? Набери числитель большей дроби.', uz: "2/7 mi yoki 6/7 mi katta? Katta kasrning suratini tering." },
        q_speech: { ru: 'что больше, две седьмых или шесть седьмых? Набери числитель большей дроби.', uz: "yettidan ikki mi yoki yettidan olti mi katta? Katta kasrning suratini tering." },
        ans: 6,
        hint: { ru: 'Знаменатели совпали, считай куски.', uz: "Maxrajlar mos keldi, bo'laklarni sanang." }
      },
      {
        kind: 'num',
        q: { ru: 'Что больше: 5/6 или 5/11? Набери знаменатель большей дроби.', uz: "5/6 mi yoki 5/11 mi katta? Katta kasrning maxrajini tering." },
        q_speech: { ru: 'что больше, пять шестых или пять одиннадцатых? Набери знаменатель большей дроби.', uz: "oltidan besh mi yoki o'n birdan besh mi katta? Katta kasrning maxrajini tering." },
        ans: 6,
        hint: { ru: 'Кусков поровну, крупнее там, где частей меньше.', uz: "Bo'lak soni teng, bo'lak kam joyda yirikroq." }
      },
      {
        kind: 'num',
        q: { ru: 'Дробь 7/14 равна половине. Сколько получится, если взять половину от 14?', uz: "7/14 kasri yarimga teng. 14 ning yarmi nechaga teng?" },
        q_speech: { ru: 'дробь семь четырнадцатых равна половине. Сколько получится, если взять половину от четырнадцати?', uz: "o'n to'rtdan yetti kasri yarimga teng. O'n to'rtning yarmi nechaga teng?" },
        ans: 7,
        hint: { ru: 'Половина это ровно вдвое меньше.', uz: "Yarim bu roppa-rosa ikki barobar kam." }
      }
    ],
    fact_badge: { ru: 'Знаешь ли ты?', uz: 'Bilasizmi?' },
    fact_text: {
      ru: 'Половина работает как контролёр. Если одна дробь больше половины, а другая меньше, сравнивать этажи уже не нужно: ответ известен сразу.',
      uz: "Yarim nazoratchi bo'lib ishlaydi. Bitta kasr yarimdan katta, ikkinchisi kichik bo'lsa, qavatlarni taqqoslash shart emas: javob darrov ma'lum."
    },
    fact_audio: {
      ru: 'Половина работает как контролёр. Если одна дробь больше половины, а другая меньше, сравнивать этажи уже не нужно, ответ известен сразу. Три четвёртых больше половины, а две восьмых меньше, и этого достаточно. Такой приём выручает, когда ни числители, ни знаменатели не совпали.',
      uz: "Yarim nazoratchi bo'lib ishlaydi. Bitta kasr yarimdan katta, ikkinchisi kichik bo'lsa, qavatlarni taqqoslash shart emas, javob darrov ma'lum. To'rtdan uch yarimdan katta, sakkizdan ikki esa kichik, shuning o'zi yetarli. Bunday usul na surat, na maxraj mos kelmaganda yordam beradi."
    },
    audio: {
      intro: { ru: 'Три задания напоследок. В каждом сначала найди совпадение.', uz: "Oxirida uchta topshiriq. Har birida avval mos kelganini toping." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Посмотри, что одинаково у дробей, и выбери признак.', uz: "Kasrlarda nima bir xil ekaniga qarang va belgini tanlang." }
    }
  },

  // s14 — YAKUN: keyingisi bir xil maxrajli kasrlarni qo'shish (reja 33-satr).
  s14: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    mission_done: { ru: 'Свитки сравнены!', uz: "O'ramlar taqqoslandi!" },
    cando: {
      ru: ['сравниваю дроби с одинаковым знаменателем', 'сравниваю дроби с одинаковым числителем', 'если не совпало ничего, сравниваю с половиной'],
      uz: ["maxraji bir xil kasrlarni taqqoslayman", "surati bir xil kasrlarni taqqoslayman", "hech nima mos kelmasa, yarim bilan solishtiraman"]
    },
    rule_recap: { ru: 'Смотри, что совпало. Совпал знаменатель — считай числители, совпал числитель — смотри знаменатели.', uz: "Nima mos kelganiga qarang. Maxraj mos kelsa suratlarni sanang, surat mos kelsa maxrajlarga qarang." },
    conn_label_refs: { ru: 'опирается на', uz: 'nimaga tayanadi' },
    conn_refs: { ru: 'урок 26: сравнение долей; урок 28: дроби больше целого', uz: '26-dars: ulushlarni taqqoslash; 28-dars: butundan katta kasrlar' },
    conn_label_next: { ru: 'дальше', uz: 'keyin' },
    conn_next: { ru: 'сложение и вычитание дробей с одинаковым знаменателем', uz: "bir xil maxrajli kasrlarni qo'shish va ayirish" },
    audio: {
      ru: 'Свитки сравнены. Запомни главное. Сначала смотри, что у дробей совпало. Если знаменатели, больше та, где числитель больше. Если числители, больше та, где знаменатель меньше. А если ничего не совпало, сравни каждую с половиной. В следующий раз начнём дроби складывать!',
      uz: "O'ramlar taqqoslandi. Asosiysini eslab qoling. Avval kasrlarda nima mos kelganiga qarang. Maxrajlar bo'lsa, surati katta kasr katta. Suratlar bo'lsa, maxraji kichigi katta. Hech nima mos kelmasa, har birini yarim bilan solishtiring. Keyingi safar kasrlarni qo'sha boshlaymiz!"
    }
  }
};

// v9 KO'PRIK — ekranda ko'rinmaydi, faqat ovozda (brgSeg orqali birinchi segment).
const BRIDGES = {
  s1:  { ru: 'Посмотрим на два признака.', uz: 'Ikkita belgiga qaraymiz.' },
  s2:  { ru: 'Положим полосы рядом.', uz: "Tasmalarni yonma-yon qo'yamiz." },
  s3:  { ru: "Соберём это в правило.", uz: "Buni qoidaga yig'amiz." },
  s4:  { ru: 'Прочитай рисунок.', uz: "Rasmni o'qing." },
  s5:  { ru: 'Сравни с половиной.', uz: 'Yarim bilan solishtiring.' },
  s6:  { ru: 'Быстрый вопрос.', uz: 'Tez savol.' },
  s7:  { ru: 'Заполни консоль.', uz: "Konsolni to'ldiring." },
  s8:  { ru: 'Кто-то взял не тот признак.', uz: "Kimdir belgini adashtiribdi." },
  s9:  { ru: 'А вот и Бит со своей идеей.', uz: "Mana Bit ham o'z fikri bilan." },
  s10: { ru: 'Теперь считай сам.', uz: "Endi o'zingiz hisoblang." },
  s11: { ru: 'И ещё одна пара.', uz: 'Yana bitta juftlik.' },
  s12: { ru: 'Два свитка у стелы.', uz: "Stela yonidagi ikki o'ram." },
  s13: { ru: 'Финальная проверка.', uz: 'Yakuniy tekshiruv.' },
  s14: { ru: 'Свитки сравнены. Идём дальше!', uz: "O'ramlar taqqoslandi. Davom etamiz!" }
};

// s14 payoff (xulosadan oldin aytiladi)
const S14_PAYOFF = {
  ru: 'Миссия выполнена! Свитки сравнены, признак выбран верно. Спасибо за помощь!',
  uz: "Missiya bajarildi! O'ramlar taqqoslandi, belgi to'g'ri tanlandi. Yordamingiz uchun rahmat!"
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



// --- ULUSH KVARTALI (D29): 8-DARSNING QADIMGI CHORAK sahnasi (`AncientHallBg`) qayta
// ishlangan — o'sha xaroba, ravoq, ustunlar, mox-fonarlar va mozaik pol. Ishchi tugun BOSHQA:
// stelada Rim raqami o'rniga ULUSH yozuvi, o'ngdagi tosh tabletlar o'rniga teng bo'laklarga
// bo'lingan tosh disklar. Quyosh soati joyida qoladi: u ham doirani teng bo'lakka bo'ladi.
const ScrollHallBg = () => (
  <svg className="lm-scene-bg" viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="d29wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#EADAB4"/><stop offset="100%" stopColor="#CDB689"/></linearGradient>
      <linearGradient id="d29col" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#A8946A"/><stop offset="42%" stopColor="#E8D8B2"/><stop offset="100%" stopColor="#A8946A"/></linearGradient>
      <linearGradient id="d29sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5E4256"/><stop offset="45%" stopColor="#A8705E"/><stop offset="82%" stopColor="#D89A66"/><stop offset="100%" stopColor="#F2C88E"/></linearGradient>
      <linearGradient id="d29floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#C9B283"/><stop offset="100%" stopColor="#A38A5E"/></linearGradient>
      <linearGradient id="d29slab" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E4D3AC"/><stop offset="100%" stopColor="#C6AE7E"/></linearGradient>
      <radialGradient id="d29sun" cx="50%" cy="50%" r="55%"><stop offset="0%" stopColor="#FFE6B0"/><stop offset="55%" stopColor="#EE9A5A"/><stop offset="100%" stopColor="#C0502E" stopOpacity="0"/></radialGradient>
      <radialGradient id="d29moss" cx="50%" cy="35%" r="70%"><stop offset="0%" stopColor="#BFF0C8"/><stop offset="100%" stopColor="#7FD0A0" stopOpacity="0"/></radialGradient>
      <clipPath id="d29arch"><path d="M124 96 L124 70 Q124 40 200 40 Q276 40 276 70 L276 96 Z"/></clipPath>
    </defs>
    {/* --- DEVOR + shift lintel (8-darsdan) --- */}
    <rect x="0" y="0" width="400" height="180" fill="url(#d29wall)"/>
    <rect x="0" y="0" width="400" height="20" fill="#C2AC7E"/><rect x="0" y="19" width="400" height="3" fill="#9A855C"/>
    <g fill="#B09A6E">{[40, 96, 152, 248, 304, 360].map((x, i) => <rect key={i} x={x} y="6" width="30" height="8" rx="1.5"/>)}</g>
    {[104, 200, 296].map((cx, i) => (
      <g key={i}>
        <line x1={cx} y1="20" x2={cx} y2="30" stroke="#8A7550" strokeWidth="1.6"/>
        <path d={`M${cx - 6} 30 h12 l-2 9 h-8 Z`} fill="#B7A176" stroke="#8A7550" strokeWidth="0.8"/>
        <circle className="lm-glow" style={{ animationDelay: `${i * 0.7}s` }} cx={cx} cy="35" r="4.2" fill="#BFF0C8"/>
        <ellipse cx={cx} cy="34" rx="11" ry="16" fill="url(#d29moss)" opacity="0.5"/>
      </g>
    ))}
    {/* --- ORTDA: RAVOQ -> vayrona mahalla --- */}
    <g clipPath="url(#d29arch)">
      <rect x="120" y="38" width="160" height="60" fill="url(#d29sky)"/>
      <g><circle cx="150" cy="60" r="7" fill="#C79AD6"/><ellipse cx="150" cy="60" rx="12" ry="3" fill="none" stroke="#E6C8F0" strokeWidth="1.3" opacity="0.8"/></g>
      <circle cx="250" cy="88" r="15" fill="url(#d29sun)"/><circle cx="250" cy="88" r="7" fill="#FFD89A"/>
      <g opacity="0.6" fill="#9A6E68"><path d="M132 96 v-16 q6 -8 12 0 v16 Z"/><rect x="160" y="82" width="12" height="14"/><path d="M182 96 v-20 l7 -6 l7 6 v20 Z"/><rect x="214" y="84" width="10" height="12"/></g>
      <g fill="#FFE39A" opacity="0.8"><circle cx="138" cy="88" r="1"/><circle cx="187" cy="86" r="1"/></g>
    </g>
    <path d="M116 96 L116 70 Q116 32 200 32 Q284 32 284 70 L284 96 L276 96 L276 70 Q276 40 200 40 Q124 40 124 70 L124 96 Z" fill="url(#d29col)" stroke="#8A7550" strokeWidth="1.2"/>
    <g stroke="#8A7550" strokeWidth="0.8" opacity="0.7"><path d="M150 43 l-4 -7"/><path d="M200 36 v-8"/><path d="M250 43 l4 -7"/></g>
    {/* --- RAMKA USTUNLARI --- */}
    {[28, 334].map((x, i) => (
      <g key={i}>
        <rect x={x - 6} y="24" width="54" height="12" rx="3" fill="url(#d29col)" stroke="#8A7550" strokeWidth="1"/>
        <rect x={x} y="36" width="42" height="140" fill="url(#d29col)" stroke="#8A7550" strokeWidth="1"/>
        <g stroke="#9A855C" strokeWidth="1.2" opacity="0.55">{[10, 21, 32].map((dx, k) => <line key={k} x1={x + dx} y1="40" x2={x + dx} y2="172"/>)}</g>
        <rect x={x - 4} y="168" width="50" height="10" rx="2" fill="url(#d29col)" stroke="#8A7550" strokeWidth="1"/>
        <circle className="lm-glow" cx={x + 21} cy="30" r="3" fill="#BFF0C8"/>
      </g>
    ))}
    <path d="M356 172 Q346 150 356 130 Q366 110 356 90 Q348 74 356 60" fill="none" stroke="#6FBF8E" strokeWidth="2.4"/>
    <g fill="#8FD8A8">{[[352, 150], [360, 118], [350, 96], [358, 72]].map(([cx, cy], k) => <circle key={k} cx={cx} cy={cy} r="2.6"/>)}</g>
{/* --- MARKAZIY STELA: ikki yozuv o'rami, 5/12 va 7/12 --- */}
    <path d="M150 158 h100 l8 18 h-116 Z" fill="#B49A6E"/>
    <rect x="116" y="94" width="168" height="66" rx="5" fill="url(#d29slab)" stroke="#8A7550" strokeWidth="2"/>
    <rect x="122" y="100" width="156" height="54" rx="3" fill="none" stroke="#A8946A" strokeWidth="1" opacity="0.7"/>
    <rect x="130" y="103" width="140" height="11" rx="2" fill="#C6AE7E"/>
    <text x="200" y="111.5" textAnchor="middle" fontSize="7" letterSpacing="2" fill="#6B5636" fontFamily="'JetBrains Mono', monospace">QAYSI KASR KATTA</text>
    {[[120, 5], [140, 7]].map(([y, fill], i) => (
      <g key={i} transform={`translate(132 ${y})`}>
        {Array.from({ length: 12 }).map((_, k) => (
          <rect key={k} x={k * 11} y="0" width="11" height="13" fill={k < fill ? '#E0A05A' : '#EFE6D6'} stroke="#8A7550" strokeWidth="0.7"/>
        ))}
        <text x="140" y="11" fontSize="7" fontWeight="800" fill="#6B5636" fontFamily="'JetBrains Mono', monospace">{fill}</text>
      </g>
    ))}
    {/* --- CHAP artefakt: quyosh soati (8-darsdan) --- */}
    <g transform="translate(88 158)">
      <rect x="-22" y="6" width="44" height="14" rx="3" fill="#B49A6E" stroke="#8A7550" strokeWidth="1"/>
      <ellipse cx="0" cy="4" rx="24" ry="9" fill="url(#d29slab)" stroke="#8A7550" strokeWidth="1.2"/>
      <path d="M0 4 L-2 -6 L2 -6 Z" fill="#8A7550"/>
      <g stroke="#8A7550" strokeWidth="0.8">{[-18, -9, 0, 9, 18].map((dx, k) => <line key={k} x1={dx} y1={4 - Math.abs(dx) * 0.16} x2={dx * 0.8} y2={0 - Math.abs(dx) * 0.14}/>)}</g>
      <text x="0" y="-3" textAnchor="middle" fontSize="5" fill="#6B5636" fontFamily="'JetBrains Mono', monospace">TENG</text>
    </g>
    {/* --- O'NG artefakt: yarim ulush shkalasi --- */}
    <g transform="translate(300 120)">
      <rect x="0" y="0" width="52" height="14" rx="2" fill="#EFE6D6" stroke="#8A7550" strokeWidth="1"/>
      <rect x="0" y="0" width="26" height="14" fill="#E0A05A" stroke="#8A7550" strokeWidth="1"/>
      <text x="26" y="26" textAnchor="middle" fontSize="7" fontWeight="800" fill="#6B5636" fontFamily="'JetBrains Mono', monospace">YARIM</text>
      <line x1="26" y1="-4" x2="26" y2="18" stroke="#C06A2E" strokeWidth="1.6" strokeDasharray="3 2"/>
    </g>
    <circle className="lm-glow" cx="300" cy="152" r="2.4" fill="#BFF0C8"/>
    {/* --- POL: mozaik tosh + perspektiva (8-darsdan) --- */}
    <rect x="0" y="176" width="400" height="54" fill="url(#d29floor)"/>
    <line x1="0" y1="176" x2="400" y2="176" stroke="#8A7550" strokeWidth="2"/>
    <g stroke="#8A7550" strokeWidth="1" opacity="0.4"><path d="M30 230 L178 178"/><path d="M120 230 L192 178"/><path d="M280 230 L208 178"/><path d="M370 230 L222 178"/></g>
    <g stroke="#8A7550" strokeWidth="0.8" opacity="0.28"><path d="M0 196 H400"/><path d="M0 212 H400"/></g>
    <g fill="none" stroke="#8A7550" strokeWidth="0.8" opacity="0.3">{[160, 200, 240].map((cx, k) => <path key={k} d={`M${cx} 186 l8 5 l-8 5 l-8 -5 Z`}/>)}</g>
    <g transform="translate(58 176)"><rect x="-2" y="-12" width="34" height="11" rx="3" fill="url(#d29col)" stroke="#8A7550" strokeWidth="1" transform="rotate(-6)"/><circle className="lm-glow" cx="0" cy="-8" r="2.6" fill="#BFF0C8"/></g>
    <g><circle className="lm-glow" cx="96" cy="70" r="1.5" fill="#DFF0C8"/><circle className="lm-glow" style={{ animationDelay: '1s' }} cx="320" cy="150" r="1.4" fill="#CFEFD8"/></g>
  </svg>
);

const ScrollHallScene = ({ gathered = false }) => {
  const kid = ({ key, El, hook }, i) => (
    <span key={key} className="lm-crew lm-crew-kid g1-pop-in" style={{ animationDelay: `${0.25 + i * 0.12}s` }}>
      <El {...(gathered ? { mood: 'happy', pose: 'happy' } : hook)}/>
    </span>
  );
  return (
    <div className="lm-scene">
      <ScrollHallBg/>
      <div className="lm-scene-cast">
        {LUMO_CAST.slice(0, 2).map(kid)}
        <span className={`lm-crew lm-crew-host ${gathered ? 'd2-bit-cheer' : 'lm-bob'}`}><span className="g1-cast-fig"><BitSVG state={gathered ? 'happy' : 'present'}/></span></span>
        {LUMO_CAST.slice(2).map((c, i) => kid(c, i + 2))}
      </div>
    </div>
  );
};

const NumPad = ({ value, setValue, disabled, max = 3 }) => {
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

// ============================================================
// DARS12 EKRANLARI (15). Donor: Dars10 (barcha yangi naqshlar bilan).
// YANGI: PathRow/SplitArray (yo'lak kesish) va ColumnMulDemo (ustun 23x4, o'tkazish).
// ============================================================





// --- KONSOL YACHEYKASI (1-darsdan ko'chirilgan `.lm-cons*` uslubi, 15-darsning komponenti):
// `label` berilsa ekranchada YOZUV ko'rsatiladi (10 · 7), tagida terilgan javob yoki «?».
const MeasureCell = ({ head, n = 8, badge, val, lit = false, label = null }) => (
  <div className={`lm-cons ${lit ? 'lm-cons-lit' : ''}`}>
    {head ? <div className="lm-cons-head mono">{head}</div> : null}
    <div className="lm-cons-screen">
      {label !== null ? (
        <span className="mono d16-plate">{label}</span>
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





// --- ULUSH FIGURASI (Б4 ning yagona yangi mexanikasi, 24-darsdan).
const UNEVEN = [0.44, 0.26, 0.18, 0.12];
const ShareFig = ({ shape = 'circle', parts = 4, filled = 0, equal = true, show = true, size = 'md' }) => {
  const w = size === 'sm' ? 96 : 150;
  const weights = equal
    ? Array.from({ length: parts }).map(() => 1 / parts)
    : Array.from({ length: parts }).map((_, i) => UNEVEN[i % UNEVEN.length]);
  const total = weights.reduce((a, b) => a + b, 0);
  const norm = weights.map((v) => v / total);
  if (shape === 'bar') {
    const h = size === 'sm' ? 26 : 38;
    let x = 0;
    return (
      <svg className="d29-fig" viewBox={`0 0 ${w} ${h}`}
        style={{ width: size === 'sm' ? 'min(150px, 42%)' : `min(${w * 2}px, 78%)`, height: 'auto' }} aria-hidden="true">
        {norm.map((p, i) => {
          const bw = p * w;
          const rx = x;
          x += bw;
          return (
            <rect key={i} x={rx} y="0" width={bw} height={h}
              fill={show && i < filled ? '#F2A85C' : '#F7F1E4'} stroke="#C08A3E" strokeWidth="1.2"/>
          );
        })}
      </svg>
    );
  }
  const r = w / 2 - 2;
  const cx = w / 2;
  const cy = w / 2;
  let a0 = -Math.PI / 2;
  return (
    <svg className="d29-fig" viewBox={`0 0 ${w} ${w}`} style={{ width: size === 'sm' ? 'min(96px, 34%)' : 'min(150px, 46%)', height: 'auto' }} aria-hidden="true">
      {norm.map((p, i) => {
        const a1 = a0 + p * Math.PI * 2;
        const x0 = cx + r * Math.cos(a0);
        const y0 = cy + r * Math.sin(a0);
        const x1 = cx + r * Math.cos(a1);
        const y1 = cy + r * Math.sin(a1);
        const large = p > 0.5 ? 1 : 0;
        const d = `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`;
        a0 = a1;
        return <path key={i} d={d} fill={show && i < filled ? '#F2A85C' : '#F7F1E4'} stroke="#C08A3E" strokeWidth="1.4"/>;
      })}
    </svg>
  );
};

// --- IKKI LAGAN YONMA-YON: har birida O'Z to'ldirilishi. Shu bilan noto'g'ri kasr
// KO'RINADI: birinchi butun to'ladi, ikkinchisida qoldiq turadi.
const SharePair = ({ left, leftFilled = 0, right, rightFilled = 0, leftLabel = null, rightLabel = null, sign = null, shape = 'circle' }) => (
  <span className="d29-pair">
    <span className="d29-pair-one">
      <ShareFig shape={shape} parts={left} filled={leftFilled} size="sm"/>
      {leftLabel && <span className="mono d29-pair-cap">{leftLabel}</span>}
    </span>
    <span className="mono d29-pair-sign">{sign || ''}</span>
    <span className="d29-pair-one">
      <ShareFig shape={shape} parts={right} filled={rightFilled} size="sm"/>
      {rightLabel && <span className="mono d29-pair-cap">{rightLabel}</span>}
    </span>
  </span>
);

// --- FACTCARD QAHRAMONI: yarim nazoratchi — biri yarimdan katta, ikkinchisi kichik.
const HalfFig = () => (
  <svg viewBox="0 0 220 104" style={{ width: 'min(266px, 84%)', height: 'auto', display: 'block' }} aria-hidden="true">
    {[[24, 4, 3], [24, 8, 2]].map(([x, parts, fill], row) => (
      <g key={row} transform={`translate(${x} ${row * 40 + 20})`}>
        {Array.from({ length: parts }).map((_, k) => (
          <rect key={k} x={(k * 132) / parts} y="0" width={132 / parts} height="24"
            fill={k < fill ? '#E0A05A' : '#F7F1E4'} stroke="#C08A3E" strokeWidth="1.1"/>
        ))}
        <line x1="66" y1="-4" x2="66" y2="28" stroke="#C06A2E" strokeWidth="1.8" strokeDasharray="3 2"/>
        <text x="150" y="17" fontSize="10" fontWeight="800" fill="#5A4A2E" fontFamily="'JetBrains Mono', monospace">{fill}/{parts}</text>
      </g>
    ))}
    <text x="110" y="96" textAnchor="middle" fontSize="8" fill="#8A8378" fontFamily="'JetBrains Mono', monospace">yarim chizig'i hal qiladi</text>
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
          {figLine && <span className="mono d29-errline">{figLine}</span>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(100px, 1fr))', gap: 10, width: '100%' }}>
            {order.map((k, i) => (
              <button key={i} className={`option ${solved && i === ci ? 'option-correct' : ''} ${wrongSet.has(i) ? 'option-picked-wrong' : ''}`}
                disabled={!canAct || solved || wrongSet.has(i)} onClick={() => pick(i)}
                style={{ padding: 'clamp(9px, 1.5vw, 12px)', fontSize: mono ? 'clamp(15px, 2.5vw, 20px)' : 'clamp(12px, 1.8vw, 15px)', minHeight: 'clamp(44px, 6.2vw, 54px)', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: mono ? "'JetBrains Mono', monospace" : undefined }}>{t(c.opts[k])}</button>
            ))}
          </div>
          {hintMsg && !solved && <p className="fade-up" style={{ margin: 0, color: T.ink2, textAlign: 'center', fontSize: 'clamp(12px, 1.7vw, 14px)' }}>{t(hintMsg)}</p>}
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
  const [hintMsg, setHintMsg] = useState(null);
  const [solved, setSolved] = useState(props.storedAnswer !== undefined);
  const firstRef = useRef(props.storedAnswer ? props.storedAnswer.firstTry : true);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const check = () => {
    if (!canAct || numLock || val === '' || solved) return;
    setNumLock(true);
    const isOk = parseInt(val, 10) === c.ans;
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((isOk ? c.audio.on_correct : c.hint)[lang]); }
    if (isOk) { setSolved(true); sfx.playCorrect(); setHintMsg(null); }
    else { firstRef.current = false; setHintMsg(c.hint); setTimeout(() => { setVal(''); setNumLock(false); }, 1500); }
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
          <NumPad value={solved ? String(c.ans) : val} setValue={setVal} disabled={!canAct || numLock || solved} max={3}/>
          {!solved && <button className="btn-white-accent" disabled={!canAct || numLock || val === ''} onClick={check}>{lang === 'ru' ? 'Проверить' : 'Tekshir'}</button>}
          {solved && <CheckStrip expr={c.check} cap={t(c.check_label)} ok/>}
          {hintMsg && !solved && <p className="fade-up" style={{ margin: 0, color: T.ink2, fontSize: 'clamp(12px, 1.7vw, 14px)', textAlign: 'center' }}>{t(hintMsg)}</p>}
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
        <div className="frame fade-up delay-1 d29-hook-scene" style={{ padding: 'clamp(8px, 1.8vw, 14px)', overflow: 'hidden' }}>
          <ScrollHallScene gathered={ok}/>
        </div>
        {picked === null && (
          <div className="frame fade-up delay-1" style={{ padding: 'clamp(6px, 1.2vw, 9px)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <span className="d29-order">
              <span className="mono d29-order-plate">11</span>
              <span className="d29-order-sep mono">:</span>
              <span className="mono d29-order-plate">2</span>
            </span>
            <span className="d29-note">{t(c.order_cap)}</span>
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
          <span className="mono d29-plate">{lang === 'ru' ? c.task_line : c.task_line_uz}</span>
          {step >= 1 && (
            <span className="lm-reveal" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <span className="mono d29-expr">{c.step1}</span>
              <span className="d29-note">{t(c.step1_cap)}</span>
            </span>
          )}
          {step >= 2 && (
            <span className="lm-reveal" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <span className="mono d29-expr">{c.step2}</span>
              <span className="d29-note">{t(c.step2_cap)}</span>
            </span>
          )}
          {step >= 2 && <span className="mono d29-final lm-reveal" style={{ animationDelay: '0.25s' }}>{c.res}</span>}
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

// s2 — IKKI TASMA: maxraj bir xil, bo'yalgan bo'laklar soni boshqa
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
          <SharePair shape="bar" left={c.left_parts} leftFilled={step >= 1 ? c.left_filled : 0} right={c.right_parts} rightFilled={step >= 2 ? c.right_filled : 0}
            leftLabel={step >= 1 ? '3/8' : null} rightLabel={step >= 2 ? '5/8' : null}/>
          <div className="d29-gridrow">
            {step >= 1 && (
              <span className="d29-gridcap lm-reveal">
                <span className="d29-expr" style={{ fontSize: 'clamp(11px, 1.7vw, 13px)', color: '#C97F35' }}>{t(c.capA)}</span>
              </span>
            )}
            {step >= 2 && (
              <span className="d29-gridcap lm-reveal">
                <span className="d29-expr" style={{ fontSize: 'clamp(11px, 1.7vw, 13px)', color: '#2E7E9E' }}>{t(c.capB)}</span>
              </span>
            )}
          </div>
          {step >= 2 && <span className="mono d29-final lm-reveal" style={{ animationDelay: '0.25s' }}>{c.res}</span>}
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
          {hintMsg && !solved && <p className="fade-up" style={{ margin: 0, color: T.ink2, textAlign: 'center', fontSize: 'clamp(12px, 1.7vw, 14px)' }}>{t(hintMsg)}</p>}
        </div>
        {solved && (
          <div ref={revealRef} className="d2-rulecard fade-up">
            <span className="d2-rulecard-badge mono">{t(c.eyebrow)}</span>
            <div className="d15-rulelines">
              {c.rule_lines[lang].map((l, i) => <span key={i} className="d15-ruleline lm-reveal" style={{ animationDelay: `${i * 0.18}s` }}>{l}</span>)}
              <span className="mono d15-ruleex lm-reveal" style={{ animationDelay: '0.54s' }}>{c.rule_ex}</span>
            </div>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s4 — RASM BO'YICHA: suratlar teng, maxrajlar boshqa — qaysi belgi
const Screen4 = (props) => (
  <MCOne props={props} ck="s4"
    figNode={<SharePair left={CONTENT.s4.fig_left} leftFilled={CONTENT.s4.fig_left_filled}
      right={CONTENT.s4.fig_right} rightFilled={CONTENT.s4.fig_right_filled}/>}/>
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
            <div className="mono fade-up" style={{ textAlign: 'center', color: T.accent, fontWeight: 800 }}>{Math.min(idx + 1, c.items.length)} / {c.items.length}</div>
            <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
            <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(8px, 1.8vw, 12px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
              <FrameFx/>
              <div className="lm-digtray">
                {okBin === null
                  ? <button className={`lm-digchip mono ${sel ? 'lm-digchip-sel' : ''}`} disabled={!canAct || done} onClick={() => setSel(true)}>{t(it.n)}</button>
                  : <span className="lm-digtray-empty mono">{t(it.n)}</span>}
              </div>
              <div className="d29-bins">
                {bin('a', c.bin_a)}
                {bin('b', c.bin_b)}
              </div>
              {hintMsg && <p className="fade-up" style={{ margin: 0, color: T.ink2, textAlign: 'center', fontSize: 'clamp(12px, 1.7vw, 14px)' }}>{t(hintMsg)}</p>}
            </div>
          </>
        )}
        {done && (
          <div ref={revealRef} className="frame-success reveal-soft">
            <Reaction state="correct" praise={`${score} / ${c.items.length}`}/>
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
  const [hintMsg, setHintMsg] = useState(null);
  const firstRef = useRef(props.storedAnswer ? props.storedAnswer.firstTry : true);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const solved = phase >= c.cells.length;
  const cell = c.cells[Math.min(phase, c.cells.length - 1)];
  const check = () => {
    if (!canAct || numLock || val === '' || solved) return;
    setNumLock(true);
    const isOk = parseInt(val, 10) === cell.ans;
    const last = phase + 1 >= c.cells.length;
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(isOk ? (last ? c.audio.on_correct[lang] : nextPraise(lang)) : cell.hint[lang]); }
    if (isOk) {
      sfx.playCorrect(); setHintMsg(null);
      setTimeout(() => { setVal(''); setNumLock(false); setPhase((p) => p + 1); }, last ? 400 : 900);
    } else {
      firstRef.current = false;
      setHintMsg(cell.hint);
      setTimeout(() => { setVal(''); setNumLock(false); }, 1500);
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
          <span className="mono d29-expr">{c.swap_line}</span>
          <div className="lm-console" style={{ gridTemplateColumns: 'repeat(2, 1fr)', maxWidth: 320 }}>
            {c.cells.map((cl, i) => (
              <MeasureCell key={i} head={t(cl.head)} label={cl.label} val={phase > i ? String(cl.ans) : null} lit={phase === i}/>
            ))}
          </div>
          {!solved && (
            <>
              <NumPad value={val} setValue={setVal} disabled={!canAct || numLock} max={3}/>
              <button className="btn-white-accent" disabled={!canAct || numLock || val === ''} onClick={check}>{lang === 'ru' ? 'Проверить' : 'Tekshir'}</button>
            </>
          )}
          {solved && <CheckStrip expr={c.check} cap={t(c.check_label)} ok/>}
          {hintMsg && !solved && <p className="fade-up" style={{ margin: 0, color: T.ink2, fontSize: 'clamp(12px, 1.7vw, 14px)', textAlign: 'center' }}>{t(hintMsg)}</p>}
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
  const lines = lang === 'ru' ? c.lines : c.lines_uz;
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1.4vw, 10px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(6px, 1.4vw, 10px)', padding: 'clamp(14px, 2.6vw, 20px)' }}>
          <FrameFx/>
          <span className="mono d29-plate">{lines[0]}</span>
          <span className="d29-bad">{lines[1]}</span>
          <span className="d29-note">{t(c.line_cap)}</span>
          <p className="fade-up" style={{ margin: 0, textAlign: 'center', color: T.ink2, fontWeight: 700 }}>{t(c.trap_label)}</p>
          <div className="d29-trap">
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
    const last = stepNum === 1;
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(isOk ? (last ? c.audio.on_correct[lang] : nextPraise(lang)) : stepHint[lang]); }
    if (isOk) {
      sfx.playCorrect(); setHintMsg(null);
      if (last) { setSolved(true); }
      else { setTimeout(() => { setVal(''); setNumLock(false); setStepNum(1); }, 900); }
    } else {
      firstRef.current = false;
      setHintMsg(stepHint);
      setTimeout(() => { setVal(''); setNumLock(false); }, 1500);
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
                  <span className="d29-steplabel lm-reveal">{t(stepNum === 0 ? c.step1_q : c.step2_q)}</span>
                  <NumPad value={val} setValue={setVal} disabled={!canAct || numLock} max={3}/>
                  <button className="btn-white-accent" disabled={!canAct || numLock || val === ''} onClick={check}>{lang === 'ru' ? 'Проверить' : 'Tekshir'}</button>
                </>
              )}
              {solved && <span className="mono d29-res lm-reveal">{c.ans1} · {c.ans2}</span>}
            </>
          )}
          {solved && <CheckStrip expr={c.check} cap={t(CONTENT.s7.check_label)} ok/>}
          {hintMsg && !solved && <p className="fade-up" style={{ margin: 0, color: T.ink2, fontSize: 'clamp(12px, 1.7vw, 14px)', textAlign: 'center' }}>{t(hintMsg)}</p>}
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
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((isOk ? c.audio.on_correct : it.hint)[lang]); }
    if (isOk) {
      sfx.playCorrect();
      if (!numTriedRef.current) setScore((s) => s + 1);
      setTimeout(() => { setVal(''); setNumLock(false); setHintMsg(null); numTriedRef.current = false; setIdx((n) => n + 1); }, 1700);
    } else {
      numTriedRef.current = true;
      setHintMsg(it.hint);
      setTimeout(() => { setVal(''); setNumLock(false); }, 1700);
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
            <div className="mono" style={{ textAlign: 'center', color: T.accent, fontWeight: 800 }}>{idx + 1} / {items.length}</div>
            <h2 className="title h-sub" style={{ textAlign: 'center' }}>{t(it.q)}</h2>
            {it.kind === 'num' ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <NumPad value={val} setValue={setVal} disabled={!canAct || numLock} max={3}/>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button className="btn-white-accent" disabled={!canAct || numLock || val === ''} onClick={checkNum}>{lang === 'ru' ? 'Проверить' : 'Tekshir'}</button>
                </div>
                {hintMsg && <p className="fade-up" style={{ margin: 0, color: T.ink2, fontSize: 'clamp(12px, 1.7vw, 14px)', textAlign: 'center' }}>{t(it.hint)}</p>}
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
                  <p className="fade-up" style={{ margin: 0, color: T.ink2, fontSize: 'clamp(12px, 1.7vw, 14px)' }}>{t(hintMsg)}</p>
                )}
              </>
            )}
          </div>
        )}
        {done && (
          <div ref={factRef}>
            <div className="frame-success reveal-soft" style={{ marginBottom: 12 }}>
              <Reaction state="correct" praise={`${score} / ${items.length}`}/>
            </div>
            <div className="d2-factcard fade-up">
              <span className="d2-factcard-badge mono">{t(c.fact_badge)}</span>
              <div className="d2-fact-hero"><HalfFig/></div>
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
          <span className="d2-rulecard-badge mono">{lang === 'ru' ? 'Помни' : 'Yodda tut'}</span>
          <p className="d2-rulecard-txt">{t(c.rule_recap)}</p>
        </div>
        <div className="fade-up delay-2" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', columnGap: 'clamp(10px, 2.4vw, 20px)', rowGap: 3 }}>
          <span className="mono" style={{ fontSize: 'clamp(11px, 1.5vw, 13px)', color: T.ink2 }}>{t(c.conn_label_refs)}: {t(c.conn_refs)}</span>
          <span className="mono" style={{ fontSize: 'clamp(11px, 1.5vw, 13px)', color: T.accent, fontWeight: 700 }}>{t(c.conn_label_next)}: {t(c.conn_next)}</span>
        </div>
        <div className="d29-final-scene fade-up delay-1"><ScrollHallScene gathered/></div>
      </div>
    </Stage>
  );
};

// ============================================================
// KORNEVOY KOMPONENT (shablon: infrastructure_v1 / grade1 Dars28)
// ============================================================
export default function CompareFracLesson({
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

.d29-order { display: inline-flex; gap: clamp(6px, 1.6vw, 12px); align-items: center; padding: clamp(4px, 1vw, 7px) clamp(8px, 1.8vw, 12px);
  border-radius: 10px; background: rgba(255,236,200,.5); box-shadow: inset 0 0 0 1px rgba(190,150,90,.26); }
.d29-order-plate { font-size: clamp(15px, 3vw, 21px); font-weight: 800; color: #3A3530; padding: 3px 10px;
  border-radius: 8px; background: #FFFFFF; box-shadow: 0 2px 8px -4px rgba(58,53,48,0.35); }
.d29-note { font-size: clamp(9.5px, 1.5vw, 12px); font-weight: 700; color: #5A5A60; text-align: center; }
.d29-expr { font-size: clamp(15px, 3vw, 22px); font-weight: 800; color: #3A3530; }
.d29-final { font-size: clamp(18px, 3.6vw, 26px); font-weight: 800; color: #1F7A4D; }
.d29-bad { font-size: clamp(14px, 2.8vw, 20px); font-weight: 800; color: #C0392B; }
.d29-errline { font-size: clamp(13px, 2.5vw, 19px); font-weight: 800; color: #C0392B; padding: 3px 12px;
  border-radius: 9px; background: rgba(192,57,43,.08); box-shadow: inset 0 0 0 1px rgba(192,57,43,.3); text-align: center; }
.d29-steplabel { font-size: clamp(13px, 2.4vw, 18px); font-weight: 800; color: #3A3530; text-align: center; }
.d29-res { font-size: clamp(19px, 3.8vw, 26px); font-weight: 800; color: #1F7A4D; }
.d29-plate { font-size: clamp(19px, 4vw, 28px); font-weight: 800; color: #0E0E10; padding: 4px 14px;
  border-radius: 12px; background: rgba(255,236,200,.55); box-shadow: inset 0 0 0 1px rgba(190,150,90,.28); }
.d29-trap { display: flex; gap: 10px; justify-content: center; }
.d29-bins { display: grid; grid-template-columns: repeat(2, minmax(120px, 1fr)); gap: clamp(8px, 2vw, 16px); width: 100%; max-width: 460px; }

/* --- KATAK TO'R --- */
.d29-grid { display: inline-flex; align-items: flex-start; gap: clamp(5px, 1.2vw, 9px);
  padding: clamp(5px, 1.2vw, 8px); border-radius: 10px; background: rgba(255,236,200,.45);
  box-shadow: inset 0 0 0 1px rgba(190,150,90,.26); }
.d29-grid-part { display: inline-flex; flex-direction: column; gap: 2px; }
.d29-grid-row { display: inline-flex; gap: 2px; }
.d29-cell { display: inline-block; width: clamp(6px, 1.5vw, 10px); height: clamp(6px, 1.5vw, 10px); border-radius: 2px; }
.d29-cell-a { background: #F2A85C; box-shadow: inset 0 0 0 0.5px #C97F35; }
.d29-cell-b { background: #6FD0E4; box-shadow: inset 0 0 0 0.5px #3E8FA8; }
.d29-gridrow { display: flex; flex-wrap: wrap; justify-content: center; align-items: flex-start; gap: clamp(6px, 1.6vw, 12px); }
.d29-gridcap { display: flex; flex-direction: column; align-items: center; gap: 3px; }

/* --- sahna o'lchami: budjet donor bilan bir xil (etalon 629x330 @1440x900) --- */
.d29-hook-scene .lm-scene { width: min(100%, calc(clamp(180px, calc(100dvh - 570px), 372px) * 400 / 210)); }
.d29-final-scene .lm-scene { width: min(100%, calc(clamp(200px, calc(100dvh - 560px), 372px) * 400 / 210)); }

/* --- FACTCARD: zinapoya --- */
.d29-stair { animation: d22stair 3.6s ease-in-out infinite; }
@keyframes d22stair { 0%, 12% { opacity: 0.3; } 34%, 100% { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .d29-stair { animation: none; opacity: 1; } }

.d29-boxwrap { display: flex; flex-direction: column; align-items: center; gap: clamp(6px, 1.4vw, 10px); }
.d29-boxrow { display: grid; grid-template-columns: repeat(6, auto); gap: clamp(4px, 1vw, 7px); justify-content: center; }
.d29-box { width: clamp(20px, 3.4vw, 27px); height: clamp(17px, 2.9vw, 23px); border-radius: 3px;
  background: #EFE6D6; border: 1.5px solid #D8CDB8; opacity: 0.5; transition: none; }
.d29-box-on { background: linear-gradient(180deg, #FFCB8E 0 26%, #F2A85C 26% 100%); border-color: #C97F35;
  opacity: 1; animation: d23pop 0.32s ease-out both; }
@keyframes d23pop { 0% { transform: scale(0.7); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
.d29-rest { display: inline-flex; gap: clamp(4px, 1vw, 7px); align-items: center; padding: clamp(4px, 1vw, 7px) clamp(8px, 1.8vw, 13px);
  border-radius: 999px; background: #FDECE7; border: 1.5px dashed #E0563A; }
.d29-kg { width: clamp(11px, 1.9vw, 15px); height: clamp(11px, 1.9vw, 15px); border-radius: 50%;
  background: #E0563A; border: 1.2px solid #B33F27; }

.d29-fig { display: block; margin: 0 auto; }
.d29-figrow { display: flex; align-items: center; justify-content: center; gap: clamp(10px, 2.4vw, 18px); flex-wrap: wrap; }
.d29-frac { display: inline-flex; flex-direction: column; align-items: center; line-height: 1.05;
  font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(20px, 3.4vw, 27px); }
.d29-frac-top { color: #2E7E9E; }
.d29-frac-bar { display: block; width: clamp(24px, 4vw, 32px); height: 2.4px; background: #5D5A52; margin: 3px 0; border-radius: 2px; }
.d29-frac-bot { color: #C97F35; }
.d29-fracname { font-family: 'JetBrains Mono', monospace; font-size: clamp(10px, 1.6vw, 12px); font-weight: 800; letter-spacing: 0.4px; }

/* Yangi uslub yo'q: hamma qoida 24-darsdan ko'chib keldi va nomi almashtirildi. */

.d29-pair { display: inline-flex; align-items: center; justify-content: center; gap: clamp(8px, 2vw, 16px); flex-wrap: nowrap; }
.d29-pair-one { display: inline-flex; flex-direction: column; align-items: center; gap: 4px; }
.d29-pair-cap { font-size: clamp(13px, 2.2vw, 17px); font-weight: 800; color: #5D5A52; }
.d29-pair-sign { font-size: clamp(20px, 3.6vw, 28px); font-weight: 800; color: #C97F35; min-width: clamp(18px, 3vw, 26px); text-align: center; }

/* Yangi uslub yo'q: hamma qoida oldingi darsdan ko'chib keldi va nomi almashtirildi. */

/* Yangi uslub yo'q: juftlik uslublari oldingi darsdan ko'chib keldi. */

/* Yangi uslub yo'q: juftlik uslublari oldingi darsdan ko'chib keldi. */
`;
