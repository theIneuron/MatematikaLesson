import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { BackLabel, BitSVG, CheckStrip, Chiroq, Confetti, D2Defs, D2Motes, FREE_NAV, FeedbackBlock, FoldRow, FrameFx, GradientDefs, HeroContext, LUMO_CAST, LangContext, Lenta, NavBack, NavNext, NextLabel, Panel, ProgressContext, Reaction, ReadinessMeter, Stage, StageHero, T, TaskTable, configureLesson, getAudioEngine, nextPraise, npKey, shuffleArr, ttsConfig, useAdvanceGate, useAudio, useCanAnswer, useLang, useMobileZoom, usePrefersReducedMotion, useRevealScroll, useSfx, useT, useTapSteps, makeBrgSeg } from './_kit/index.jsx';
import { BASE_STYLES } from './_kit/styles.js';

// ============================================================================
// DD 3-SINF | Dars27 — "Sonning ulushi" (num-3-27) | Б4 «ULUSH HUDUDI»
// Syujet: qadimgi chorak davom etadi (SYUJET_3SINF.md 182-satr, reja 30-satr).
// SAHNA: blok foni O'ZGARMAYDI — 8-darsning qadimgi choragi. Ishchi tugun BOSHQA: stelada
//   12 dona uchta teng uyumga ajratilgan, ikkitasi yoritilgan; o'ngda uyumlar ustuni.
// MEXANIKA (yangi mexanika YARATILMAGAN): `ShareFig` (24-darsdan) bitta figura ko'rinishida,
//   qolgani tayyor: MC xuk, TAP bilan ochilish, savol-oldin-qoida, rasm bilan MC, tokchaga
//   saralash, konsol uch katak, xatoni top, Bit tuzog'i, NumPad ikki marta, masala, final.
// DARSLIK ASOSI (Burxonov, 3-sinf, «Sharq» 2019):
//   151-bet 1-topshiriq a bandi DOSLOVEN — 9 cm ning 2/3 qismi: 9 : 3 = 3, 3 · 2 = 6;
//   130-bet 6-topshiriq — 8 yashikda 96 kg, bitta yashik 96 ning sakkizdan biri;
//   130-bet 4-topshiriq — perimetri 64 bo'lgan kvadrat tomoni, ya'ni to'rtdan bir;
//   151-bet 1-topshiriq b bandi (ulushdan butunni topish) — FactCard va 32-darsga ko'prik.
// YADRO: sonning ulushi IKKI qadamda topiladi. Avval maxrajga bo'lamiz (bitta bo'lak),
//   keyin suratga ko'paytiramiz. Tartib qat'iy — 23-darsning ikki amalli masalasi davomi.
// Misconception: M1 suratga bo'lish; M2 bo'lishdan keyin to'xtash; M3 avval ko'paytirish;
//   M4 ulushni butundan katta chiqarish.
// FactCard: masalani teskari burish — yarmi 5 kg bo'lsa, butun 10 kg.
// Kontent: src/books/grade3/KONTENT_3SINF.md, «Dars 27». Karkas: BLOK_B4_KARKAS.md.
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
  lessonId: 'num-3-27',
  lessonTitle: { ru: 'Урок 27. Доля числа', uz: "27-dars. Sonning ulushi" }
};
// STRUKTURA (KONTENT_3SINF.md «Dars 27»): s0 xuk 12 ning uchdan biri · s1 ikki qadam
// (9 sm ning 2/3) · s2 model 12 dona uch uyumga · s3 savol-oldin-QOIDA · s4 rasm bo'yicha
// (12 sm tasma) · s5 saralash qadamlar tartibi · s6 test 20 ning 1/4 · s7 konsol 24 ning 2/3 ·
// s8 xatoni top (bo'lish o'rniga ko'paytirish) · s9 Bit tuzog'i (tartibni almashtirish) ·
// s10 trenajyor 96 : 8 · s11 trenajyor 64 : 4 · s12 masala (40 : 5, keyin 8 · 2) ·
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
  // s0 — XUK: sonning ulushi (darslik 151-bet). Javob DONADA chiqadi.
  s0: {
    eyebrow: { ru: 'Крючок', uz: 'Qiziqtirish' },
    topic: { ru: 'Доля числа', uz: 'Sonning ulushi' },
    lead: { ru: 'В корзине у стелы 12 фиников', uz: "Stela yonidagi savatda 12 ta xurmo" },
    order_cap: { ru: 'нужно взять одну третью часть', uz: "uchdan bir qismini olish kerak" },
    q: { ru: 'Сколько фиников надо взять?', uz: 'Nechta xurmo olish kerak?' },
    opt0: { ru: '4', uz: '4' },
    opt1: { ru: '3', uz: '3' },
    opt2: { ru: '9', uz: '9' },
    opt3: { ru: '12', uz: '12' },
    audio: {
      intro: {
        ru: [
          'Ты умеешь сравнивать доли. Сегодня узнаешь, сколько это в штуках.',
          'В корзине у стелы двенадцать фиников.',
          'Нужно взять одну третью часть корзины.',
          'Как думаешь, сколько фиников надо взять?'
        ],
        uz: [
          "Siz ulushlarni taqqoslashni bilasiz. Bugun bu donada qancha ekanini bilasiz.",
          "Stela yonidagi savatda o'n ikkita xurmo.",
          "Savatning uchdan bir qismini olish kerak.",
          "Sizningcha, nechta xurmo olish kerak?"
        ]
      },
      on_correct: { ru: 'Верно! А сейчас увидишь, как это считают.', uz: "To'g'ri! Endi buni qanday hisoblashini ko'rasiz." },
      on_wrong1: { ru: 'Три это на сколько частей делим, а не сколько берём.', uz: "Uch bu nechta bo'lakka bo'linishi, olinadigan soni emas." },
      on_wrong2: { ru: 'Девять это то, что останется. Спрашивают про взятую часть.', uz: "To'qqiz bu qoladigani. Olingan qism haqida so'ralyapti." },
      on_idk: { ru: 'Ничего. Сейчас разложим финики на равные кучки.', uz: "Hechqisi yo'q. Hozir xurmolarni teng uyumlarga ajratamiz." }
    }
  },

  // s1 — IKKI QADAM: darslik 151-bet 1-topshiriq, a bandi dosloven.
  s1: {
    eyebrow: { ru: 'Разбор', uz: 'Tahlil' },
    lead: { ru: 'Доля числа ищется в два шага, и порядок жёсткий', uz: "Sonning ulushi ikki qadamda topiladi, tartibi qat'iy" },
    task_line: 'отрезок 9 см, взять 2/3',
    task_line_uz: "kesma 9 cm, 2/3 qismini olish",
    step1: '9 : 3 = 3',
    step1_cap: { ru: 'делим на знаменатель, это одна часть', uz: "maxrajga bo'lamiz, bu bitta bo'lak" },
    step2: '3 · 2 = 6',
    step2_cap: { ru: 'умножаем на числитель, берём две части', uz: "suratga ko'paytiramiz, ikkita bo'lak olamiz" },
    res: '2/3 от 9 см это 6 см',
    btn1: { ru: 'Разделить на 3', uz: "3 ga bo'lish" },
    btn2: { ru: 'Взять 2 части', uz: "2 ta bo'lak olish" },
    done_text: { ru: 'Сначала деление, потом умножение', uz: "Avval bo'lish, keyin ko'paytirish" },
    audio: {
      ru: [
        'Разберём по шагам. Отрезок девять сантиметров, взять надо две трети.',
        'Сначала делим на знаменатель. Девять разделить на три, получается три сантиметра. Это одна часть.',
        'Теперь умножаем на числитель. Три умножить на два, шесть сантиметров. Это и есть две трети.'
      ],
      uz: [
        "Qadamma-qadam ko'ramiz. Kesma to'qqiz santimetr, uchdan ikki qismini olish kerak.",
        "Avval maxrajga bo'lamiz. To'qqizni uchga bo'lsak, uch santimetr chiqadi. Bu bitta bo'lak.",
        "Endi suratga ko'paytiramiz. Uchni ikkiga ko'paytiramiz, olti santimetr. Bu uchdan ikki bo'ladi."
      ]
    }
  },

  // s2 — MODEL: 12 dona uchta uyumga, ikkitasi olinadi.
  s2: {
    eyebrow: { ru: 'Модель', uz: 'Model' },
    shape: 'bar',
    parts: 3,
    filled: 2,
    lead: { ru: 'Целое делится на равные кучки, потом кучки считают', uz: "Butun teng uyumlarga bo'linadi, keyin uyumlar sanaladi" },
    capA: { ru: 'разделили на 3, в каждой части по 4', uz: "3 ga bo'ldik, har bo'lakda 4 tadan" },
    capB: { ru: 'взяли 2 части, это 8', uz: "2 ta bo'lak oldik, bu 8 ta" },
    res: '2/3 от 12 это 8',
    name_a: { ru: 'делим', uz: "bo'lamiz" },
    name_b: { ru: 'умножаем', uz: "ko'paytiramiz" },
    btn1: { ru: 'Разложить на 3 кучки', uz: '3 uyumga ajratish' },
    btn2: { ru: 'Взять 2 кучки', uz: '2 uyumni olish' },
    done_text: { ru: 'Две трети от двенадцати это восемь', uz: "O'n ikkining uchdan ikkisi sakkiz" },
    audio: {
      ru: [
        'Посмотри на двенадцать фиников.',
        'Раскладываем их на три равные кучки. В каждой по четыре штуки.',
        'Берём две кучки. Получается восемь фиников. Это две трети от двенадцати.'
      ],
      uz: [
        "O'n ikkita xurmoga qarang.",
        "Ularni uchta teng uyumga ajratamiz. Har birida to'rttadan.",
        "Ikkita uyumni olamiz. Sakkizta xurmo chiqadi. Bu o'n ikkining uchdan ikkisi."
      ]
    }
  },

  // s3 — SAVOL-OLDIN-QOIDA: qaysi amaldan boshlanadi.
  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    q: { ru: 'С какого действия начинаем, когда ищем долю числа?', uz: "Sonning ulushini qidirganda qaysi amaldan boshlaymiz?" },
    opts: [
      { ru: 'делим на знаменатель', uz: "maxrajga bo'lamiz" },
      { ru: 'умножаем на числитель', uz: "suratga ko'paytiramiz" },
      { ru: 'делим на числитель', uz: "suratga bo'lamiz" },
      { ru: 'складываем оба числа', uz: "ikkala sonni qo'shamiz" }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Умножать пока нечего. Сколько в одной части, ещё неизвестно.', uz: "Hozircha ko'paytiradigan narsa yo'q. Bitta bo'lakda nechta ekani noma'lum." },
      2: { ru: 'Числитель говорит, сколько частей взять, а не на сколько делить.', uz: "Surat nechta bo'lak olishni aytadi, nechtaga bo'lishni emas." },
      3: { ru: 'Складывать этажи дроби не нужно.', uz: "Kasrning qavatlarini qo'shish shart emas." }
    },
    on_correct: { ru: 'Да. Сначала одна часть, потом столько частей, сколько нужно.', uz: "Ha. Avval bitta bo'lak, keyin kerakligicha bo'lak." },
    rule_lines: {
      ru: ['Чтобы найти долю числа, делим число на знаменатель и узнаём одну часть.', 'Потом умножаем её на числитель и берём столько частей, сколько нужно.'],
      uz: ["Sonning ulushini topish uchun sonni maxrajga bo'lib, bitta bo'lakni bilamiz.", "Keyin uni suratga ko'paytirib, kerakli miqdorda bo'lak olamiz."]
    },
    rule_ex: '9 : 3 · 2 = 6',
    rule_speech: { ru: 'девять разделить на три и умножить на два, шесть', uz: "to'qqizni uchga bo'lib ikkiga ko'paytirsak, olti" },
    audio: {
      intro: {
        ru: 'Порядок здесь решает всё. С какого действия начинаем, когда ищем долю числа?',
        uz: "Bu yerda tartib hal qiladi. Sonning ulushini qidirganda qaysi amaldan boshlaymiz?"
      }
    }
  },

  // s4 — RASM BO'YICHA: 12 sm li tasma to'rtga bo'lingan, uchtasi bo'yalgan.
  s4: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv' },
    q: { ru: 'Вся полоса 12 см, она разделена на 4 части. Сколько сантиметров закрашено?', uz: "Butun tasma 12 sm, u 4 bo'lakka bo'lingan. Necha santimetr bo'yalgan?" },
    fig_shape: 'bar',
    fig_parts: 4,
    fig_filled: 3,
    opts: [
      { ru: '9 см', uz: '9 sm' },
      { ru: '3 см', uz: '3 sm' },
      { ru: '4 см', uz: '4 sm' },
      { ru: '12 см', uz: '12 sm' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Три это одна часть. А закрашено три части.', uz: "Uch bu bitta bo'lak. Bo'yalgani esa uchta bo'lak." },
      2: { ru: 'Четыре это число частей, а не сантиметры.', uz: "To'rt bu bo'laklar soni, santimetr emas." },
      3: { ru: 'Двенадцать это вся полоса. Закрашена не вся.', uz: "O'n ikki bu butun tasma. Hammasi bo'yalmagan." }
    },
    audio: {
      intro: { ru: 'Вся полоса двенадцать сантиметров, разделена на четыре части. Сколько сантиметров закрашено?', uz: "Butun tasma o'n ikki santimetr, to'rt bo'lakka bo'lingan. Necha santimetr bo'yalgan?" },
      on_correct: { ru: 'Верно. Одна часть три сантиметра, три части девять.', uz: "To'g'ri. Bitta bo'lak uch santimetr, uchta bo'lak to'qqiz." },
      on_wrong: { ru: 'Сначала найди одну часть, потом умножь.', uz: "Avval bitta bo'lakni toping, keyin ko'paytiring." }
    }
  },

  // s5 — SARALASH: qaysi amal birinchi, qaysi ikkinchi.
  s5: {
    eyebrow: { ru: 'Сортировка', uz: 'Saralash' },
    lead: { ru: 'Разложи шаги по порядку', uz: 'Qadamlarni tartib bilan ajrating' },
    bin_a: { ru: 'первый шаг', uz: '1-qadam' },
    bin_b: { ru: 'второй шаг', uz: '2-qadam' },
    items: [
      { n: { ru: 'разделить на знаменатель', uz: "maxrajga bo'lish" }, a: true, hint: { ru: 'С этого начинают всегда.', uz: "Har doim shundan boshlanadi." } },
      { n: { ru: 'умножить на числитель', uz: "suratga ko'paytirish" }, a: false, hint: { ru: 'Это делают, когда одна часть уже известна.', uz: "Bu bitta bo'lak ma'lum bo'lgach qilinadi." } },
      { n: { ru: 'узнать одну часть', uz: "bitta bo'lakni bilish" }, a: true, hint: { ru: 'Одна часть получается делением.', uz: "Bitta bo'lak bo'lish bilan chiqadi." } },
      { n: { ru: 'взять нужные части', uz: 'kerakli bo\'laklarni olish' }, a: false, hint: { ru: 'Части берут после того, как узнали одну.', uz: "Bo'laklar bittasi bilingandan keyin olinadi." } }
    ],
    audio: {
      intro: { ru: 'Четыре шага. Отправь каждый на свою полку, первый шаг или второй.', uz: "To'rtta qadam. Har birini o'z tokchasiga yuboring, birinchi qadammi yoki ikkinchi." },
      on_correct: { ru: 'Все на месте. Сначала делим, потом умножаем.', uz: "Hammasi joyida. Avval bo'lamiz, keyin ko'paytiramiz." },
      on_wrong: { ru: 'Спроси себя, что можно сделать сразу, а что только потом.', uz: "O'zingizdan so'rang, nimani darrov, nimani keyin qilish mumkin." }
    }
  },

  // s6 — TEST: 20 ning to'rtdan biri.
  s6: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv' },
    q: { ru: 'Сколько будет 1/4 от 20?', uz: "20 ning 1/4 qismi nechaga teng?" },
    opts: [
      { ru: '5', uz: '5' },
      { ru: '4', uz: '4' },
      { ru: '16', uz: '16' },
      { ru: '80', uz: '80' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Четыре это на сколько делим, а не ответ.', uz: "To'rt bu nechtaga bo'linishi, javob emas." },
      2: { ru: 'Шестнадцать это то, что осталось.', uz: "O'n olti bu qolgani." },
      3: { ru: 'Умножать на четыре не надо, надо делить.', uz: "To'rtga ko'paytirish emas, bo'lish kerak." }
    },
    audio: {
      intro: { ru: 'Быстрый вопрос. Сколько будет одна четвёртая от двадцати?', uz: "Tez savol. Yigirmaning to'rtdan bir qismi nechaga teng?" },
      on_correct: { ru: 'Верно. Двадцать разделить на четыре, пять.', uz: "To'g'ri. Yigirmani to'rtga bo'lsak, besh." },
      on_wrong: { ru: 'Числитель единица, значит хватит одного деления.', uz: "Surat bir, demak bitta bo'lishning o'zi yetadi." }
    }
  },

  // s7 — KONSOL: 24 ning uchdan ikkisi qadamlab.
  s7: {
    eyebrow: { ru: 'Консоль', uz: 'Konsol' },
    lead: { ru: 'Найди 2/3 от 24 по шагам', uz: "24 ning 2/3 qismini qadamlab toping" },
    swap_line: '2/3 от 24',
    cells: [
      { head: { ru: 'шаг 1', uz: '1-qadam' }, label: '24 : 3', ans: 8, hint: { ru: 'Раздели на знаменатель.', uz: "Maxrajga bo'ling." } },
      { head: { ru: 'шаг 2', uz: '2-qadam' }, label: '8 · 2', ans: 16, hint: { ru: 'Возьми две части.', uz: "Ikkita bo'lak oling." } },
      { head: { ru: 'осталось', uz: 'qoldi' }, label: '24 − 16', ans: 8, hint: { ru: 'Из всего убери взятое.', uz: "Hammasidan olinganini olib tashlang." } }
    ],
    check: '24 : 3 · 2 = 16',
    check_label: { ru: 'две трети от двадцати четырёх', uz: "yigirma to'rtning uchdan ikkisi" },
    audio: {
      intro: { ru: 'Заполни три окна. Одна часть, две части и сколько осталось.', uz: "Uchta oynani to'ldiring. Bitta bo'lak, ikkita bo'lak va nechtasi qolgani." },
      on_correct: { ru: 'Шестнадцать. И ровно столько же осталось бы, будь взята одна треть.', uz: "O'n olti. Uchdan bir olinganda ham xuddi shuncha qolardi." }
    }
  },

  // s8 — XATONI TOP: bo'lish o'rniga ko'paytirilgan (darslik 130-bet 6-topshiriq soni).
  s8: {
    eyebrow: { ru: 'Найди ошибку', uz: 'Xatoni toping' },
    q: { ru: 'Искали 1/8 от 96 и записали 96 · 8 = 768. В чём ошибка?', uz: "96 ning 1/8 qismi qidirilib, 96 · 8 = 768 deb yozilgan. Xato nimada?" },
    fig_line: '96 · 8 = 768',
    opts: [
      { ru: 'надо было делить, а не умножать', uz: "ko'paytirish emas, bo'lish kerak edi" },
      { ru: 'надо было делить на 96', uz: "96 ga bo'lish kerak edi" },
      { ru: 'умножили неверно', uz: "noto'g'ri ko'paytirilgan" },
      { ru: 'ошибки нет', uz: "xato yo'q" }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Делят целое на знаменатель, а не наоборот.', uz: "Butun maxrajga bo'linadi, teskarisi emas." },
      2: { ru: 'Умножение здесь посчитано верно, дело не в счёте.', uz: "Ko'paytirish to'g'ri hisoblangan, gap hisobda emas." },
      3: { ru: 'Ошибка есть. Часть числа не может быть больше самого числа.', uz: "Xato bor. Sonning qismi sonning o'zidan katta bo'la olmaydi." }
    },
    audio: {
      intro: { ru: 'Здесь искали долю числа и получили больше, чем было. Найди ошибку.', uz: "Bu yerda sonning ulushi qidirilib, borigidan ko'p chiqqan. Xatoni toping." },
      on_correct: { ru: 'Точно. Девяносто шесть разделить на восемь, двенадцать.', uz: "Aniq. To'qson oltini sakkizga bo'lsak, o'n ikki." },
      on_wrong: { ru: 'Часть всегда меньше целого. Значит действие выбрано не то.', uz: "Qism har doim butundan kichik. Demak amal noto'g'ri tanlangan." }
    }
  },

  // s9 — BIT TUZOG'I: qadamlar o'rin almashtirilgan (M3, yopiq maydon).
  s9: {
    eyebrow: { ru: 'Ловушка Бита', uz: 'Bit tuzog\'i' },
    lead: { ru: 'Бит предлагает свой порядок действий', uz: "Bit o'z amal tartibini taklif qiladi" },
    lines: ['ищем 2/3 от 9', 'Бит: 9 · 2 = 18, потом 18 : 3 = 6'],
    lines_uz: ["9 ning 2/3 qismini qidiramiz", "Bit: 9 · 2 = 18, keyin 18 : 3 = 6"],
    line_cap: { ru: 'Бит: ответ тот же, значит порядок не важен', uz: "Bit: javob o'sha, demak tartib muhim emas" },
    trap_label: { ru: 'Так ли это?', uz: 'Shundaymi?' },
    trap_opts: { ru: ['ответ тот же, но так делить труднее', 'да, порядок не важен'], uz: ["javob o'sha, lekin bunday bo'lish qiyinroq", "ha, tartib muhim emas"] },
    trap_ci: 0,
    trap_correct: { ru: 'Верно подмечено. Ответ и правда совпадёт, но делить большое число труднее, а иногда оно и не делится нацело. Поэтому сначала делим.', uz: "To'g'ri payqadingiz. Javob haqiqatan mos keladi, lekin katta sonni bo'lish qiyinroq, ba'zan u butun bo'linmaydi ham. Shuning uchun avval bo'lamiz." },
    trap_wrong: { ru: 'Здесь ответ совпал. А если взять две трети от десяти, умножение первым даст двадцать, и оно на три не делится.', uz: "Bu yerda javob mos keldi. O'nning uchdan ikki qismini olsak, avval ko'paytirganda yigirma chiqadi, u uchga bo'linmaydi." },
    audio: {
      ru: [
        'Бит посмотрел на решение и предлагает своё.',
        'Сначала умножу девять на два, получится восемнадцать, потом разделю на три. Ответ тот же, значит порядок не важен.',
        'Так ли это?'
      ],
      uz: [
        "Bit yechimga qaradi va o'zinikini taklif qiladi.",
        "Avval to'qqizni ikkiga ko'paytiraman, o'n sakkiz chiqadi, keyin uchga bo'laman. Javob o'sha, demak tartib muhim emas.",
        "Shundaymi?"
      ]
    }
  },

  // s10 — TRENAJYOR: darslik 130-bet 6-topshiriq (96 kg, 8 yashik).
  s10: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq' },
    q: { ru: 'В 8 ящиках 96 кг хурмы поровну. Сколько килограммов в одном ящике?', uz: "8 ta yashikda 96 kg xurmo teng. Bitta yashikda necha kilogramm bor?" },
    ans: 12,
    check: '96 : 8 = 12',
    check_label: { ru: 'одна восьмая от 96', uz: "96 ning sakkizdan biri" },
    hint: { ru: 'Один ящик это одна восьмая всего груза.', uz: "Bitta yashik butun yukning sakkizdan biri." },
    audio: {
      intro: { ru: 'В восьми ящиках девяносто шесть килограммов хурмы поровну. Сколько килограммов в одном ящике?', uz: "Sakkizta yashikda to'qson olti kilogramm xurmo teng. Bitta yashikda necha kilogramm bor?" },
      on_correct: { ru: 'Двенадцать. Это и есть одна восьмая от девяноста шести.', uz: "O'n ikki. Bu to'qson oltining sakkizdan biri." }
    }
  },

  // s11 — TRENAJYOR NumPad: darslik 130-bet 4-topshiriq (perimetr 64).
  s11: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq' },
    q: { ru: 'Периметр квадрата 64 см. Чему равна одна четвёртая часть, то есть сторона?', uz: "Kvadratning perimetri 64 sm. To'rtdan bir qismi, ya'ni tomoni nechaga teng?" },
    ans: 16,
    check: '64 : 4 = 16',
    check_label: { ru: 'одна четвёртая от 64', uz: "64 ning to'rtdan biri" },
    hint: { ru: 'У квадрата четыре равные стороны.', uz: "Kvadratning to'rtta teng tomoni bor." },
    audio: {
      intro: { ru: 'Периметр квадрата шестьдесят четыре сантиметра. Чему равна его сторона?', uz: "Kvadratning perimetri oltmish to'rt santimetr. Uning tomoni nechaga teng?" },
      on_correct: { ru: 'Шестнадцать. Сторона это одна четвёртая периметра.', uz: "O'n olti. Tomon perimetrning to'rtdan biri." }
    }
  },

  // s12 — MASALA: jadval bilan, ikki qadam (2/5 dan 40).
  s12: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    lead: { ru: 'Находка у стелы', uz: 'Stela yonidagi topilma' },
    q: { ru: 'В сундуке 40 монет. Учёные забрали 2/5 монет в музей. Сколько монет забрали?', uz: "Sandiqda 40 ta tanga. Olimlar tangalarning 2/5 qismini muzeyga olib ketdi. Nechta tanga olib ketildi?" },
    q_speech: { ru: 'в сундуке сорок монет. Учёные забрали две пятых монет в музей. Сколько монет забрали?', uz: "sandiqda qirqta tanga. Olimlar tangalarning beshdan ikki qismini muzeyga olib ketdi. Nechta tanga olib ketildi?" },
    tbl_heads: [
      { ru: 'всего монет', uz: 'jami tanga' },
      { ru: 'частей', uz: "bo'lak" },
      { ru: 'взяли частей', uz: "olingan bo'lak" }
    ],
    tbl_cells: ['40', '5', '2'],
    pick_label: { ru: 'С какого действия начинаем?', uz: 'Qaysi amaldan boshlaymiz?' },
    opts: [
      { ru: '40 : 5', uz: '40 : 5' },
      { ru: '40 · 2', uz: '40 · 2' },
      { ru: '40 : 2', uz: '40 : 2' },
      { ru: '5 · 2', uz: '5 · 2' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Сначала узнаём, сколько монет в одной части.', uz: "Avval bitta bo'lakda nechta tanga borligini bilamiz." },
      2: { ru: 'Умножать целое на числитель нельзя, монет станет больше.', uz: "Butunni suratga ko'paytirib bo'lmaydi, tanga ko'payib ketadi." },
      3: { ru: 'Делят на знаменатель, а не на числитель.', uz: "Maxrajga bo'linadi, suratga emas." }
    },
    pick_ok: { ru: 'Верно. Сначала одна часть, потом две.', uz: "To'g'ri. Avval bitta bo'lak, keyin ikkita." },
    step1_q: { ru: 'Сколько монет в одной части?', uz: "Bitta bo'lakda nechta tanga?" },
    ans1: 8,
    hint1: { ru: 'Сорок раздели на пять.', uz: "Qirqni beshga bo'ling." },
    step2_q: { ru: 'Сколько монет забрали?', uz: 'Nechta tanga olib ketildi?' },
    ans2: 16,
    hint2: { ru: 'Восемь возьми два раза.', uz: "Sakkizni ikki marta oling." },
    check: '40 : 5 · 2 = 16',
    setup_audio: { ru: 'У стелы нашли сундук с монетами. Посмотри на таблицу и реши, с чего начинать.', uz: "Stela yonidan tangali sandiq topildi. Jadvalga qarang va nimadan boshlashni hal qiling." },
    audio: {
      intro: { ru: 'В сундуке сорок монет. Учёные забрали две пятых в музей. Сколько монет забрали?', uz: "Sandiqda qirqta tanga. Olimlar beshdan ikki qismini muzeyga olib ketdi. Nechta tanga olib ketildi?" },
      on_correct: { ru: 'Шестнадцать монет. В сундуке осталось двадцать четыре.', uz: "O'n oltita tanga. Sandiqda yigirma to'rttasi qoldi." },
      on_wrong: { ru: 'Вернись к первому шагу. Сколько монет в одной части.', uz: "Birinchi qadamga qayting. Bitta bo'lakda nechta tanga bor." }
    }
  },

  // s13 — FINAL: uch topshiriq, sonlar darsda uchramagan.
  s13: {
    eyebrow: { ru: 'Финал', uz: 'Yakuniy' },
    intro_line: { ru: 'Три задания. Сначала одна часть, потом сколько нужно', uz: "Uchta topshiriq. Avval bitta bo'lak, keyin kerakligicha" },
    items: [
      {
        kind: 'num',
        q: { ru: 'Сколько будет 1/3 от 18?', uz: "18 ning 1/3 qismi nechaga teng?" },
        q_speech: { ru: 'сколько будет одна третья от восемнадцати?', uz: "o'n sakkizning uchdan bir qismi nechaga teng?" },
        ans: 6,
        hint: { ru: 'Раздели восемнадцать на три.', uz: "O'n sakkizni uchga bo'ling." }
      },
      {
        kind: 'num',
        q: { ru: 'Сколько будет 3/4 от 20?', uz: "20 ning 3/4 qismi nechaga teng?" },
        q_speech: { ru: 'сколько будет три четвёртых от двадцати?', uz: "yigirmaning to'rtdan uch qismi nechaga teng?" },
        ans: 15,
        hint: { ru: 'Одна часть пять, а взять надо три части.', uz: "Bitta bo'lak besh, olish kerak esa uchta bo'lak." }
      },
      {
        kind: 'num',
        q: { ru: 'Сколько будет 1/6 от 54?', uz: "54 ning 1/6 qismi nechaga teng?" },
        q_speech: { ru: 'сколько будет одна шестая от пятидесяти четырёх?', uz: "ellik to'rtning oltidan bir qismi nechaga teng?" },
        ans: 9,
        hint: { ru: 'Раздели пятьдесят четыре на шесть.', uz: "Ellik to'rtni oltiga bo'ling." }
      }
    ],
    fact_badge: { ru: 'Знаешь ли ты?', uz: 'Bilasizmi?' },
    fact_text: {
      ru: 'Задачу можно повернуть наоборот. Если известно, что половина арбуза 5 кг, то весь арбуз 10 кг: одну часть умножаем на знаменатель. Так по доле находят целое.',
      uz: "Masalani teskari burish mumkin. Tarvuzning yarmi 5 kg ekani ma'lum bo'lsa, butun tarvuz 10 kg: bitta bo'lakni maxrajga ko'paytiramiz. Shunday qilib ulushdan butun topiladi."
    },
    fact_audio: {
      ru: 'Задачу можно повернуть наоборот. Пусть известно, что половина арбуза пять килограммов. Тогда весь арбуз десять, потому что половин в целом две. Мы весь урок делили целое на части, а тут наоборот, из части собираем целое. Такие задачи встретятся в конце блока.',
      uz: "Masalani teskari burish mumkin. Faraz qiling, tarvuzning yarmi besh kilogramm ekani ma'lum. Unda butun tarvuz o'n kilogramm, chunki butunda ikkita yarim bor. Butun dars davomida biz butunni bo'laklarga bo'ldik, bu yerda esa aksincha, bo'lakdan butunni yig'amiz. Bunday masalalar bo'lim oxirida uchraydi."
    },
    audio: {
      intro: { ru: 'Три задания напоследок. В каждом сначала найди одну часть.', uz: "Oxirida uchta topshiriq. Har birida avval bitta bo'lakni toping." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Перечитай задание. На сколько частей делим и сколько берём.', uz: "Topshiriqni qayta o'qing. Nechtaga bo'lamiz va nechtasini olamiz." }
    }
  },

  // s14 — YAKUN: keyingisi to'g'ri va noto'g'ri kasrlar (reja 31-satr).
  s14: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    mission_done: { ru: 'Сундук разобран!', uz: 'Sandiq ajratildi!' },
    cando: {
      ru: ['нахожу долю числа в два шага', 'сначала делю на знаменатель, потом умножаю на числитель', 'проверяю себя: часть всегда меньше целого'],
      uz: ["sonning ulushini ikki qadamda topaman", "avval maxrajga bo'laman, keyin suratga ko'paytiraman", "o'zimni tekshiraman: qism har doim butundan kichik"]
    },
    rule_recap: { ru: 'Делим на знаменатель, умножаем на числитель.', uz: "Maxrajga bo'lamiz, suratga ko'paytiramiz." },
    conn_label_refs: { ru: 'опирается на', uz: 'nimaga tayanadi' },
    conn_refs: { ru: 'урок 23: два действия; урок 25: числитель и знаменатель', uz: '23-dars: ikki amal; 25-dars: surat va maxraj' },
    conn_label_next: { ru: 'дальше', uz: 'keyin' },
    conn_next: { ru: 'дроби больше целого и смешанное число', uz: "butundan katta kasrlar va aralash son" },
    audio: {
      ru: 'Сундук разобран. Запомни главное. Чтобы найти долю числа, сначала делим число на знаменатель и узнаём одну часть, а потом умножаем её на числитель. И часть всегда меньше целого, это хорошая проверка. В следующий раз встретим дробь, которая больше целого!',
      uz: "Sandiq ajratildi. Asosiysini eslab qoling. Sonning ulushini topish uchun avval sonni maxrajga bo'lib, bitta bo'lakni bilamiz, keyin uni suratga ko'paytiramiz. Qism har doim butundan kichik, bu yaxshi tekshiruv. Keyingi safar butundan katta kasrni uchratamiz!"
    }
  }
};

// v9 KO'PRIK — ekranda ko'rinmaydi, faqat ovozda (brgSeg orqali birinchi segment).
const BRIDGES = {
  s1:  { ru: 'Разберём по шагам.', uz: "Qadamma-qadam ko'ramiz." },
  s2:  { ru: 'Разложим на кучки.', uz: 'Uyumlarga ajratamiz.' },
  s3:  { ru: "Соберём это в правило.", uz: "Buni qoidaga yig'amiz." },
  s4:  { ru: 'Прочитай рисунок.', uz: "Rasmni o'qing." },
  s5:  { ru: 'Разложи шаги по порядку.', uz: 'Qadamlarni tartibga soling.' },
  s6:  { ru: 'Быстрый вопрос.', uz: 'Tez savol.' },
  s7:  { ru: 'Заполни консоль.', uz: "Konsolni to'ldiring." },
  s8:  { ru: 'Часть вышла больше целого.', uz: 'Qism butundan katta chiqibdi.' },
  s9:  { ru: 'А вот и Бит со своей идеей.', uz: "Mana Bit ham o'z fikri bilan." },
  s10: { ru: 'Теперь считай сам.', uz: "Endi o'zingiz hisoblang." },
  s11: { ru: 'И ещё одна находка.', uz: 'Yana bitta topilma.' },
  s12: { ru: 'Сундук у стелы.', uz: 'Stela yonidagi sandiq.' },
  s13: { ru: 'Финальная проверка.', uz: 'Yakuniy tekshiruv.' },
  s14: { ru: 'Сундук разобран. Идём дальше!', uz: 'Sandiq ajratildi. Davom etamiz!' }
};

// s14 payoff (xulosadan oldin aytiladi)
const S14_PAYOFF = {
  ru: 'Миссия выполнена! Доли посчитаны в штуках и сантиметрах. Спасибо за помощь!',
  uz: "Missiya bajarildi! Ulushlar donada va santimetrda sanaldi. Yordamingiz uchun rahmat!"
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



// --- ULUSH KVARTALI (D27): 8-DARSNING QADIMGI CHORAK sahnasi (`AncientHallBg`) qayta
// ishlangan — o'sha xaroba, ravoq, ustunlar, mox-fonarlar va mozaik pol. Ishchi tugun BOSHQA:
// stelada Rim raqami o'rniga ULUSH yozuvi, o'ngdagi tosh tabletlar o'rniga teng bo'laklarga
// bo'lingan tosh disklar. Quyosh soati joyida qoladi: u ham doirani teng bo'lakka bo'ladi.
const BasketHallBg = () => (
  <svg className="lm-scene-bg" viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="d27wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#EADAB4"/><stop offset="100%" stopColor="#CDB689"/></linearGradient>
      <linearGradient id="d27col" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#A8946A"/><stop offset="42%" stopColor="#E8D8B2"/><stop offset="100%" stopColor="#A8946A"/></linearGradient>
      <linearGradient id="d27sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5E4256"/><stop offset="45%" stopColor="#A8705E"/><stop offset="82%" stopColor="#D89A66"/><stop offset="100%" stopColor="#F2C88E"/></linearGradient>
      <linearGradient id="d27floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#C9B283"/><stop offset="100%" stopColor="#A38A5E"/></linearGradient>
      <linearGradient id="d27slab" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E4D3AC"/><stop offset="100%" stopColor="#C6AE7E"/></linearGradient>
      <radialGradient id="d27sun" cx="50%" cy="50%" r="55%"><stop offset="0%" stopColor="#FFE6B0"/><stop offset="55%" stopColor="#EE9A5A"/><stop offset="100%" stopColor="#C0502E" stopOpacity="0"/></radialGradient>
      <radialGradient id="d27moss" cx="50%" cy="35%" r="70%"><stop offset="0%" stopColor="#BFF0C8"/><stop offset="100%" stopColor="#7FD0A0" stopOpacity="0"/></radialGradient>
      <clipPath id="d27arch"><path d="M124 96 L124 70 Q124 40 200 40 Q276 40 276 70 L276 96 Z"/></clipPath>
    </defs>
    {/* --- DEVOR + shift lintel (8-darsdan) --- */}
    <rect x="0" y="0" width="400" height="180" fill="url(#d27wall)"/>
    <rect x="0" y="0" width="400" height="20" fill="#C2AC7E"/><rect x="0" y="19" width="400" height="3" fill="#9A855C"/>
    <g fill="#B09A6E">{[40, 96, 152, 248, 304, 360].map((x, i) => <rect key={i} x={x} y="6" width="30" height="8" rx="1.5"/>)}</g>
    {[104, 200, 296].map((cx, i) => (
      <g key={i}>
        <line x1={cx} y1="20" x2={cx} y2="30" stroke="#8A7550" strokeWidth="1.6"/>
        <path d={`M${cx - 6} 30 h12 l-2 9 h-8 Z`} fill="#B7A176" stroke="#8A7550" strokeWidth="0.8"/>
        <circle className="lm-glow" style={{ animationDelay: `${i * 0.7}s` }} cx={cx} cy="35" r="4.2" fill="#BFF0C8"/>
        <ellipse cx={cx} cy="34" rx="11" ry="16" fill="url(#d27moss)" opacity="0.5"/>
      </g>
    ))}
    {/* --- ORTDA: RAVOQ -> vayrona mahalla --- */}
    <g clipPath="url(#d27arch)">
      <rect x="120" y="38" width="160" height="60" fill="url(#d27sky)"/>
      <g><circle cx="150" cy="60" r="7" fill="#C79AD6"/><ellipse cx="150" cy="60" rx="12" ry="3" fill="none" stroke="#E6C8F0" strokeWidth="1.3" opacity="0.8"/></g>
      <circle cx="250" cy="88" r="15" fill="url(#d27sun)"/><circle cx="250" cy="88" r="7" fill="#FFD89A"/>
      <g opacity="0.6" fill="#9A6E68"><path d="M132 96 v-16 q6 -8 12 0 v16 Z"/><rect x="160" y="82" width="12" height="14"/><path d="M182 96 v-20 l7 -6 l7 6 v20 Z"/><rect x="214" y="84" width="10" height="12"/></g>
      <g fill="#FFE39A" opacity="0.8"><circle cx="138" cy="88" r="1"/><circle cx="187" cy="86" r="1"/></g>
    </g>
    <path d="M116 96 L116 70 Q116 32 200 32 Q284 32 284 70 L284 96 L276 96 L276 70 Q276 40 200 40 Q124 40 124 70 L124 96 Z" fill="url(#d27col)" stroke="#8A7550" strokeWidth="1.2"/>
    <g stroke="#8A7550" strokeWidth="0.8" opacity="0.7"><path d="M150 43 l-4 -7"/><path d="M200 36 v-8"/><path d="M250 43 l4 -7"/></g>
    {/* --- RAMKA USTUNLARI --- */}
    {[28, 334].map((x, i) => (
      <g key={i}>
        <rect x={x - 6} y="24" width="54" height="12" rx="3" fill="url(#d27col)" stroke="#8A7550" strokeWidth="1"/>
        <rect x={x} y="36" width="42" height="140" fill="url(#d27col)" stroke="#8A7550" strokeWidth="1"/>
        <g stroke="#9A855C" strokeWidth="1.2" opacity="0.55">{[10, 21, 32].map((dx, k) => <line key={k} x1={x + dx} y1="40" x2={x + dx} y2="172"/>)}</g>
        <rect x={x - 4} y="168" width="50" height="10" rx="2" fill="url(#d27col)" stroke="#8A7550" strokeWidth="1"/>
        <circle className="lm-glow" cx={x + 21} cy="30" r="3" fill="#BFF0C8"/>
      </g>
    ))}
    <path d="M356 172 Q346 150 356 130 Q366 110 356 90 Q348 74 356 60" fill="none" stroke="#6FBF8E" strokeWidth="2.4"/>
    <g fill="#8FD8A8">{[[352, 150], [360, 118], [350, 96], [358, 72]].map(([cx, cy], k) => <circle key={k} cx={cx} cy={cy} r="2.6"/>)}</g>
{/* --- MARKAZIY STELA: 12 dona uchta uyumga, ikkitasi yoritilgan --- */}
    <path d="M150 158 h100 l8 18 h-116 Z" fill="#B49A6E"/>
    <rect x="116" y="94" width="168" height="66" rx="5" fill="url(#d27slab)" stroke="#8A7550" strokeWidth="2"/>
    <rect x="122" y="100" width="156" height="54" rx="3" fill="none" stroke="#A8946A" strokeWidth="1" opacity="0.7"/>
    <rect x="130" y="103" width="140" height="11" rx="2" fill="#C6AE7E"/>
    <text x="200" y="111.5" textAnchor="middle" fontSize="7" letterSpacing="2" fill="#6B5636" fontFamily="'JetBrains Mono', monospace">SONNING ULUSHI</text>
    {[0, 1, 2].map((g) => (
      <g key={g} transform={`translate(${140 + g * 44} 122)`}>
        <rect x="-4" y="-3" width="38" height="24" rx="4" fill={g < 2 ? '#E8C79A' : '#EFE6D6'} stroke="#8A7550" strokeWidth="1"/>
        {[0, 1, 2, 3].map((k) => (
          <ellipse key={k} cx={5 + (k % 2) * 18} cy={3 + Math.floor(k / 2) * 12} rx="7" ry="5"
            fill={g < 2 ? '#C06A2E' : '#D8CDB8'} stroke="#8A7550" strokeWidth="0.7"/>
        ))}
      </g>
    ))}
    <text x="200" y="152" textAnchor="middle" fontSize="9" fontWeight="800" fill="#C06A2E" fontFamily="'JetBrains Mono', monospace">2/3 = 8</text>
    {/* --- CHAP artefakt: quyosh soati (8-darsdan) --- */}
    <g transform="translate(88 158)">
      <rect x="-22" y="6" width="44" height="14" rx="3" fill="#B49A6E" stroke="#8A7550" strokeWidth="1"/>
      <ellipse cx="0" cy="4" rx="24" ry="9" fill="url(#d27slab)" stroke="#8A7550" strokeWidth="1.2"/>
      <path d="M0 4 L-2 -6 L2 -6 Z" fill="#8A7550"/>
      <g stroke="#8A7550" strokeWidth="0.8">{[-18, -9, 0, 9, 18].map((dx, k) => <line key={k} x1={dx} y1={4 - Math.abs(dx) * 0.16} x2={dx * 0.8} y2={0 - Math.abs(dx) * 0.14}/>)}</g>
      <text x="0" y="-3" textAnchor="middle" fontSize="5" fill="#6B5636" fontFamily="'JetBrains Mono', monospace">TENG</text>
    </g>
    {/* --- O'NG artefakt: sandiq va tangalar --- */}
    <g transform="translate(300 122)">
      <path d="M0 10 h44 v22 h-44 Z" fill="#B49A6E" stroke="#8A7550" strokeWidth="1"/>
      <path d="M0 10 q22 -14 44 0 Z" fill="#C6AE7E" stroke="#8A7550" strokeWidth="1"/>
      <rect x="18" y="16" width="8" height="9" rx="1.5" fill="#8A7550"/>
      {[0, 1, 2].map((k) => <circle key={k} cx={6 + k * 9} cy="38" r="4" fill="#E0A05A" stroke="#B3803A" strokeWidth="0.8"/>)}
    </g>
    <circle className="lm-glow" cx="300" cy="100" r="2.4" fill="#BFF0C8"/>
    {/* --- POL: mozaik tosh + perspektiva (8-darsdan) --- */}
    <rect x="0" y="176" width="400" height="54" fill="url(#d27floor)"/>
    <line x1="0" y1="176" x2="400" y2="176" stroke="#8A7550" strokeWidth="2"/>
    <g stroke="#8A7550" strokeWidth="1" opacity="0.4"><path d="M30 230 L178 178"/><path d="M120 230 L192 178"/><path d="M280 230 L208 178"/><path d="M370 230 L222 178"/></g>
    <g stroke="#8A7550" strokeWidth="0.8" opacity="0.28"><path d="M0 196 H400"/><path d="M0 212 H400"/></g>
    <g fill="none" stroke="#8A7550" strokeWidth="0.8" opacity="0.3">{[160, 200, 240].map((cx, k) => <path key={k} d={`M${cx} 186 l8 5 l-8 5 l-8 -5 Z`}/>)}</g>
    <g transform="translate(58 176)"><rect x="-2" y="-12" width="34" height="11" rx="3" fill="url(#d27col)" stroke="#8A7550" strokeWidth="1" transform="rotate(-6)"/><circle className="lm-glow" cx="0" cy="-8" r="2.6" fill="#BFF0C8"/></g>
    <g><circle className="lm-glow" cx="96" cy="70" r="1.5" fill="#DFF0C8"/><circle className="lm-glow" style={{ animationDelay: '1s' }} cx="320" cy="150" r="1.4" fill="#CFEFD8"/></g>
  </svg>
);

const BasketHallScene = ({ gathered = false }) => {
  const kid = ({ key, El, hook }, i) => (
    <span key={key} className="lm-crew lm-crew-kid g1-pop-in" style={{ animationDelay: `${0.25 + i * 0.12}s` }}>
      <El {...(gathered ? { mood: 'happy', pose: 'happy' } : hook)}/>
    </span>
  );
  return (
    <div className="lm-scene">
      <BasketHallBg/>
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
      <svg className="d27-fig" viewBox={`0 0 ${w} ${h}`} style={{ width: `min(${w * 2}px, 78%)`, height: 'auto' }} aria-hidden="true">
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
    <svg className="d27-fig" viewBox={`0 0 ${w} ${w}`} style={{ width: size === 'sm' ? 'min(96px, 34%)' : 'min(150px, 46%)', height: 'auto' }} aria-hidden="true">
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

// --- FACTCARD QAHRAMONI: ulushdan butunni yig'ish (yarmi 5 kg -> butun 10 kg).
const WholeFig = () => (
  <svg viewBox="0 0 220 104" style={{ width: 'min(266px, 84%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <g transform="translate(52 46)">
      <path d="M-26 0 A26 26 0 0 1 26 0 Z" fill="#7FBF6A" stroke="#4E8C43" strokeWidth="1.4"/>
      <path d="M-22 0 A22 22 0 0 1 22 0 Z" fill="#E4564A" opacity="0.85"/>
      <text x="0" y="20" textAnchor="middle" fontSize="10" fontWeight="800" fill="#5A4A2E" fontFamily="'JetBrains Mono', monospace">5 kg</text>
    </g>
    <text x="110" y="50" textAnchor="middle" fontSize="15" fontWeight="800" fill="#8A7550" fontFamily="'JetBrains Mono', monospace">&#8594;</text>
    <g transform="translate(168 46)">
      <circle cx="0" cy="0" r="26" fill="#7FBF6A" stroke="#4E8C43" strokeWidth="1.4"/>
      <circle cx="0" cy="0" r="22" fill="#E4564A" opacity="0.85"/>
      <line x1="-26" y1="0" x2="26" y2="0" stroke="#FBF3E2" strokeWidth="2"/>
      <text x="0" y="42" textAnchor="middle" fontSize="10" fontWeight="800" fill="#5A4A2E" fontFamily="'JetBrains Mono', monospace">10 kg</text>
    </g>
    <text x="110" y="96" textAnchor="middle" fontSize="8" fill="#8A8378" fontFamily="'JetBrains Mono', monospace">ulushdan butunga</text>
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
          {figLine && <span className="mono d27-errline">{figLine}</span>}
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
  const [numState, setNumState] = useState(null);   // ekranda KO'RINADIGAN javob holati
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
        <div className="frame fade-up delay-1 d27-hook-scene" style={{ padding: 'clamp(8px, 1.8vw, 14px)', overflow: 'hidden' }}>
          <BasketHallScene gathered={ok}/>
        </div>
        {picked === null && (
          <div className="frame fade-up delay-1" style={{ padding: 'clamp(6px, 1.2vw, 9px)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <span className="d27-order">
              <span className="mono d27-order-plate">11</span>
              <span className="d27-order-sep mono">:</span>
              <span className="mono d27-order-plate">2</span>
            </span>
            <span className="d27-note">{t(c.order_cap)}</span>
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
          <span className="mono d27-plate">{lang === 'ru' ? c.task_line : c.task_line_uz}</span>
          {step >= 1 && (
            <span className="lm-reveal" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <span className="mono d27-expr">{c.step1}</span>
              <span className="d27-note">{t(c.step1_cap)}</span>
            </span>
          )}
          {step >= 2 && (
            <span className="lm-reveal" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <span className="mono d27-expr">{c.step2}</span>
              <span className="d27-note">{t(c.step2_cap)}</span>
            </span>
          )}
          {step >= 2 && <span className="mono d27-final lm-reveal" style={{ animationDelay: '0.25s' }}>{c.res}</span>}
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

// s2 — MODEL: butun teng uyumlarga bo'linadi, keyin kerakli uyumlar olinadi
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
          <div className="d27-figrow">
            <ShareFig shape={c.shape} parts={step >= 1 ? c.parts : 1} filled={step >= 2 ? c.filled : 0}/>
            {step >= 1 && (
              <span className="d27-frac lm-reveal">
                <span className="d27-frac-top">{step >= 2 ? c.filled : '?'}</span>
                <span className="d27-frac-bar"/>
                <span className="d27-frac-bot">{c.parts}</span>
              </span>
            )}
          </div>
          <div className="d27-gridrow">
            {step >= 1 && (
              <span className="d27-gridcap lm-reveal">
                <span className="d27-fracname" style={{ color: '#C97F35' }}>{t(c.name_a)}</span>
                <span className="d27-expr" style={{ fontSize: 'clamp(11px, 1.7vw, 13px)' }}>{t(c.capA)}</span>
              </span>
            )}
            {step >= 2 && (
              <span className="d27-gridcap lm-reveal">
                <span className="d27-fracname" style={{ color: '#2E7E9E' }}>{t(c.name_b)}</span>
                <span className="d27-expr" style={{ fontSize: 'clamp(11px, 1.7vw, 13px)' }}>{t(c.capB)}</span>
              </span>
            )}
          </div>
          {step >= 2 && <span className="mono d27-final lm-reveal" style={{ animationDelay: '0.25s' }}>{c.res}</span>}
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

// s4 — RASM BO'YICHA: tasma butunligicha ma'lum, bo'yalgani necha santimetr
const Screen4 = (props) => (
  <MCOne props={props} ck="s4"
    figNode={<ShareFig shape={CONTENT.s4.fig_shape} parts={CONTENT.s4.fig_parts} filled={CONTENT.s4.fig_filled}/>}/>
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
              <div className="d27-bins">
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
          <span className="mono d27-expr">{c.swap_line}</span>
          <div className="lm-console" style={{ gridTemplateColumns: 'repeat(2, 1fr)', maxWidth: 320 }}>
            {c.cells.map((cl, i) => (
              <MeasureCell key={i} head={t(cl.head)} label={cl.label} val={phase > i ? String(cl.ans) : null} lit={phase === i}/>
            ))}
          </div>
          {!solved && (
            <>
              <NumPad value={val} setValue={setVal} disabled={!canAct || numLock} max={3} state={numState}/>
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
          <span className="mono d27-plate">{lines[0]}</span>
          <span className="d27-bad">{lines[1]}</span>
          <span className="d27-note">{t(c.line_cap)}</span>
          <p className="fade-up" style={{ margin: 0, textAlign: 'center', color: T.ink2, fontWeight: 700 }}>{t(c.trap_label)}</p>
          <div className="d27-trap">
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
                  <span className="d27-steplabel lm-reveal">{t(stepNum === 0 ? c.step1_q : c.step2_q)}</span>
                  <NumPad value={val} setValue={setVal} disabled={!canAct || numLock} max={3} state={numState}/>
                  <button className="btn-white-accent" disabled={!canAct || numLock || val === ''} onClick={check}>{lang === 'ru' ? 'Проверить' : 'Tekshir'}</button>
                </>
              )}
              {solved && <span className="mono d27-res lm-reveal">{c.ans1} · {c.ans2}</span>}
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
            <div className="mono" style={{ textAlign: 'center', color: T.accent, fontWeight: 800 }}>{idx + 1} / {items.length}</div>
            <h2 className="title h-sub" style={{ textAlign: 'center' }}>{t(it.q)}</h2>
            {it.kind === 'num' ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <NumPad value={val} setValue={setVal} disabled={!canAct || numLock} max={3} state={numState}/>
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
              <div className="d2-fact-hero"><WholeFig/></div>
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
        <div className="d27-final-scene fade-up delay-1"><BasketHallScene gathered/></div>
      </div>
    </Stage>
  );
};

// ============================================================
// KORNEVOY KOMPONENT (shablon: infrastructure_v1 / grade1 Dars28)
// ============================================================
export default function ShareOfNumberLesson({
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

.d27-order { display: inline-flex; gap: clamp(6px, 1.6vw, 12px); align-items: center; padding: clamp(4px, 1vw, 7px) clamp(8px, 1.8vw, 12px);
  border-radius: 10px; background: rgba(255,236,200,.5); box-shadow: inset 0 0 0 1px rgba(190,150,90,.26); }
.d27-order-plate { font-size: clamp(15px, 3vw, 21px); font-weight: 800; color: #3A3530; padding: 3px 10px;
  border-radius: 8px; background: #FFFFFF; box-shadow: 0 2px 8px -4px rgba(58,53,48,0.35); }
.d27-note { font-size: clamp(9.5px, 1.5vw, 12px); font-weight: 700; color: #5A5A60; text-align: center; }
.d27-expr { font-size: clamp(15px, 3vw, 22px); font-weight: 800; color: #3A3530; }
.d27-final { font-size: clamp(18px, 3.6vw, 26px); font-weight: 800; color: #1F7A4D; }
.d27-bad { font-size: clamp(14px, 2.8vw, 20px); font-weight: 800; color: #C0392B; }
.d27-errline { font-size: clamp(13px, 2.5vw, 19px); font-weight: 800; color: #C0392B; padding: 3px 12px;
  border-radius: 9px; background: rgba(192,57,43,.08); box-shadow: inset 0 0 0 1px rgba(192,57,43,.3); text-align: center; }
.d27-steplabel { font-size: clamp(13px, 2.4vw, 18px); font-weight: 800; color: #3A3530; text-align: center; }
.d27-res { font-size: clamp(19px, 3.8vw, 26px); font-weight: 800; color: #1F7A4D; }
.d27-plate { font-size: clamp(19px, 4vw, 28px); font-weight: 800; color: #0E0E10; padding: 4px 14px;
  border-radius: 12px; background: rgba(255,236,200,.55); box-shadow: inset 0 0 0 1px rgba(190,150,90,.28); }
.d27-trap { display: flex; gap: 10px; justify-content: center; }
.d27-bins { display: grid; grid-template-columns: repeat(2, minmax(120px, 1fr)); gap: clamp(8px, 2vw, 16px); width: 100%; max-width: 460px; }

/* --- KATAK TO'R --- */
.d27-grid { display: inline-flex; align-items: flex-start; gap: clamp(5px, 1.2vw, 9px);
  padding: clamp(5px, 1.2vw, 8px); border-radius: 10px; background: rgba(255,236,200,.45);
  box-shadow: inset 0 0 0 1px rgba(190,150,90,.26); }
.d27-grid-part { display: inline-flex; flex-direction: column; gap: 2px; }
.d27-grid-row { display: inline-flex; gap: 2px; }
.d27-cell { display: inline-block; width: clamp(6px, 1.5vw, 10px); height: clamp(6px, 1.5vw, 10px); border-radius: 2px; }
.d27-cell-a { background: #F2A85C; box-shadow: inset 0 0 0 0.5px #C97F35; }
.d27-cell-b { background: #6FD0E4; box-shadow: inset 0 0 0 0.5px #3E8FA8; }
.d27-gridrow { display: flex; flex-wrap: wrap; justify-content: center; align-items: flex-start; gap: clamp(6px, 1.6vw, 12px); }
.d27-gridcap { display: flex; flex-direction: column; align-items: center; gap: 3px; }

/* --- sahna o'lchami: budjet donor bilan bir xil (etalon 629x330 @1440x900) --- */
.d27-hook-scene .lm-scene { width: min(100%, calc(clamp(180px, calc(100dvh - 570px), 372px) * 400 / 210)); }
.d27-final-scene .lm-scene { width: min(100%, calc(clamp(200px, calc(100dvh - 560px), 372px) * 400 / 210)); }

/* --- FACTCARD: zinapoya --- */
.d27-stair { animation: d22stair 3.6s ease-in-out infinite; }
@keyframes d22stair { 0%, 12% { opacity: 0.3; } 34%, 100% { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .d27-stair { animation: none; opacity: 1; } }

.d27-boxwrap { display: flex; flex-direction: column; align-items: center; gap: clamp(6px, 1.4vw, 10px); }
.d27-boxrow { display: grid; grid-template-columns: repeat(6, auto); gap: clamp(4px, 1vw, 7px); justify-content: center; }
.d27-box { width: clamp(20px, 3.4vw, 27px); height: clamp(17px, 2.9vw, 23px); border-radius: 3px;
  background: #EFE6D6; border: 1.5px solid #D8CDB8; opacity: 0.5; transition: none; }
.d27-box-on { background: linear-gradient(180deg, #FFCB8E 0 26%, #F2A85C 26% 100%); border-color: #C97F35;
  opacity: 1; animation: d23pop 0.32s ease-out both; }
@keyframes d23pop { 0% { transform: scale(0.7); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
.d27-rest { display: inline-flex; gap: clamp(4px, 1vw, 7px); align-items: center; padding: clamp(4px, 1vw, 7px) clamp(8px, 1.8vw, 13px);
  border-radius: 999px; background: #FDECE7; border: 1.5px dashed #E0563A; }
.d27-kg { width: clamp(11px, 1.9vw, 15px); height: clamp(11px, 1.9vw, 15px); border-radius: 50%;
  background: #E0563A; border: 1.2px solid #B33F27; }

.d27-fig { display: block; margin: 0 auto; }
.d27-figrow { display: flex; align-items: center; justify-content: center; gap: clamp(10px, 2.4vw, 18px); flex-wrap: wrap; }
.d27-frac { display: inline-flex; flex-direction: column; align-items: center; line-height: 1.05;
  font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(20px, 3.4vw, 27px); }
.d27-frac-top { color: #2E7E9E; }
.d27-frac-bar { display: block; width: clamp(24px, 4vw, 32px); height: 2.4px; background: #5D5A52; margin: 3px 0; border-radius: 2px; }
.d27-frac-bot { color: #C97F35; }
.d27-fracname { font-family: 'JetBrains Mono', monospace; font-size: clamp(10px, 1.6vw, 12px); font-weight: 800; letter-spacing: 0.4px; }

/* Yangi uslub yo'q: hamma qoida 24-darsdan ko'chib keldi va nomi almashtirildi. */

.d27-pair { display: inline-flex; align-items: center; justify-content: center; gap: clamp(8px, 2vw, 16px); flex-wrap: nowrap; }
.d27-pair-one { display: inline-flex; flex-direction: column; align-items: center; gap: 4px; }
.d27-pair-cap { font-size: clamp(13px, 2.2vw, 17px); font-weight: 800; color: #5D5A52; }
.d27-pair-sign { font-size: clamp(20px, 3.6vw, 28px); font-weight: 800; color: #C97F35; min-width: clamp(18px, 3vw, 26px); text-align: center; }

/* Yangi uslub yo'q: hamma qoida oldingi darsdan ko'chib keldi va nomi almashtirildi. */
`;
