import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { BackLabel, BitSVG, CheckStrip, Chiroq, Confetti, D2Defs, D2Motes, FREE_NAV, FeedbackBlock, FoldRow, FrameFx, GradientDefs, HeroContext, LUMO_CAST, LangContext, Lenta, NavBack, NavNext, NextLabel, Panel, ProgressContext, Reaction, ReadinessMeter, Stage, StageHero, T, TaskTable, configureLesson, getAudioEngine, npKey, shuffleArr, ttsConfig, useAdvanceGate, useAudio, useCanAnswer, useLang, useMobileZoom, usePrefersReducedMotion, useRevealScroll, useSfx, useT, useTapSteps, makeBrgSeg } from './_kit/index.jsx';
import { BASE_STYLES } from './_kit/styles.js';

// ============================================================================
// DD 3-SINF | Dars15 — "Ko'paytirish va bo'lishga masalalar" (num-3-15) | Б2
// Syujet: «bog' vazifasi» (SYUJET_3SINF.md 143-satr). Bit bog'da vazifa berdi: Ra'noda
//   bitta gulzor (8 o'simlik), Anvarda uch marta ko'p — uchastka to'r ostida.
// SAHNA (metodist 2026-08-05: «sahnani 1-9-darslardan olib, elementlarini o'zgartirib
//   unikal qil»): 4-darsning zali asos — deraza KUNDUZGI, ortida bog' terrasalari
//   (9-dars elementi), markaziy panel «vazifa» (8 · ×3 · ?), minoralar o'rniga IKKI GULZOR.
// MEXANIKA (metodist: «yangi mexanika YARATMA, tayyoridan foydalan») — hammasi tayyor:
//   MC xuk, ikki karta ko'prik, TAP bilan ochilish, MC + qoida kartasi, yopiq maydon,
//   5 soniyalik soat, MCRoundD2 ×3 (ikki marta), NumPad trenajyor + CheckStrip,
//   masala (yozuv + javob + tekshirish), «xatoni top» (stmts, 13-dars), final panel.
//   1-darsdan KONSOL ko'chirildi (`.lm-cons*` CSS): bitta yacheyka, merka va `×3` / `+3`.
//   YANGI faqat JADVAL (uch ustun, shapka tepada) — metodist tanlovi.
// DARSLIK ASOSI (Burxonov, 3-sinf, «Sharq» 2019): «marta ko'p» -> ko'paytirish (17-bet
//   8-topshiriq, 29-bet 7-topshiriq); «marta kam» -> bo'lish; «necha marta ko'p» -> kattani
//   kichikka bo'lish (155-bet); JADVAL «bittasiga - soni - jami» (26-bet 4-topshiriq);
//   tarkibli masalalar (111-112-bet) — s10 bonus.
// YADRO: bitta uchlik 8, 3, 24 uchta so'z qolipiga xizmat qiladi. Sonlar jadval doirasida.
// Misconception: M1 «uch marta ko'p» ni «uchta ko'p» deb o'qish; M2 «necha marta ko'p» ni
//   ayirish bilan yechish; M3 amalni «jami» so'ziga qarab tanlash; M4 tarkibli masalada
//   oraliq javobda to'xtash.
// FactCard: chumoli o'zidan ellik marta og'ir yukni ko'taradi (necha marta — bo'lish).
// Infra: grade3 Dars14.jsx dan ko'chirildi (oxirgi savol ekranda qoladi, reveal-soft,
//   CheckStrip, FactCard freym ostida, MCRoundD2 da q_speech).
// Kontent: src/books/grade3/KONTENT_3SINF.md, «Dars 15» (tasdiq 2026-08-05).
//
// FREE_NAV=true (blokirovka o'chiq — 3-sinf to'liq tayyor bo'lgach false, metodist qarori).
// ============================================================================
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



const TOTAL_SCREENS = 15;
const LESSON_META = {
  lessonId: 'num-3-15',
  lessonTitle: { ru: 'Урок 15. Задачи на умножение и деление', uz: "15-dars. Ko'paytirish va bo'lishga masalalar" }
};
// STRUKTURA (KONTENT_3SINF.md «Dars 15»): s0 xuk (ikki gulzor) · s1 ko'prik · s2 IKKI KONSOL
// (×3 va +3) · s3 DARSLIK JADVALI · s4 savol-oldin-QOIDA · s5 Bit tuzog'i (M1) · s6 «marta
// kam» · s7 5 soniya soat · s8 «necha marta ko'p» ×3 · s9 test ×3 · s10 BONUS tarkibli
// masala + XATONI TOP · s11 trenajyor + tekshirish · s12 teskari masala · s13 final 5 savol
// + FactCard · s14 yakun.
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'MCScreen', scored: false, scope: 'hook' },
  { id: 's1',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's4',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's5',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's6',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's7',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's8',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's9',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
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
  s0: {
    eyebrow: { ru: 'Крючок', uz: 'Qiziqtirish' },
    topic: { ru: 'Задачи на умножение и деление', uz: "Ko'paytirish va bo'lishga masalalar" },
    lead: { ru: 'У Рано одна грядка, у Анвара участок под сеткой', uz: "Ra'noda bitta gulzor, Anvarda uchastka to'r ostida" },
    panel_cap: { ru: 'задание в саду', uz: "bog' vazifasi" },
    bed_a_cap: { ru: 'грядка Рано', uz: "Ra'no gulzori" },
    bed_b_cap: { ru: 'в 3 раза больше', uz: "3 marta ko'p" },
    q: { ru: 'Сколько растений у Анвара?', uz: "Anvarda nechta o'simlik?" },
    opt0: { ru: '24', uz: '24' },
    opt1: { ru: '11', uz: '11' },
    opt2: { ru: '5', uz: '5' },
    opt3: { ru: '3', uz: '3' },
    audio: {
      intro: {
        ru: [
          'Тема урока называется задачи на умножение и деление. Узнаем, как слова в задаче показывают действие.',
          'Бит раздал задание в саду. У Рано одна грядка, на ней восемь светящихся растений.',
          'А у Анвара растений в три раза больше, но его участок пока под сеткой.',
          'Как думаешь, сколько растений у Анвара?'
        ],
        uz: [
          "Dars mavzusi ko'paytirish va bo'lishga masalalar deb ataladi. Masaladagi so'zlar amalni qanday ko'rsatishini bilib olamiz.",
          "Bit bog'da vazifa berdi. Ra'noda bitta gulzor, unda sakkizta nurli o'simlik.",
          "Anvarda esa o'simlik uch marta ko'p, lekin uning uchastkasi hozircha to'r ostida.",
          "Sizningcha, Anvarda nechta o'simlik bor?"
        ]
      },
      on_correct: {
        ru: 'Верно! В три раза больше значит взять восемь три раза, и это двадцать четыре. Сейчас увидим это на грядках.',
        uz: "To'g'ri! Uch marta ko'p degani sakkizni uch marta olish, bu esa yigirma to'rt. Hozir buni gulzorlarda ko'ramiz."
      },
      on_wrong1: {
        ru: 'Одиннадцать получается, если прибавить три. А сказано в три раза больше, это про мерку, а не про добавку.',
        uz: "O'n bir uchni qo'shsak chiqadi. Aytilgani esa uch marta ko'p, bu qo'shimcha emas, merka haqida."
      },
      on_wrong2: {
        ru: 'Пять это меньше, а у Анвара растений больше.',
        uz: "Besh bu kamroq, Anvarda esa o'simlik ko'proq."
      },
      on_idk: {
        ru: 'Три это сколько раз, а вопрос про число растений.',
        uz: "Uch bu necha marta, savol esa o'simliklar soni haqida."
      }
    }
  },

  s1: {
    eyebrow: { ru: 'Вспоминаем', uz: 'Eslaymiz' },
    lead: { ru: 'Считать ты уже умеешь', uz: 'Hisoblashni allaqachon bilasiz' },
    tap_label: { ru: 'Нажми на карточку', uz: 'Kartani bosing' },
    card1: { ru: '8 × 3 = 24', uz: '8 × 3 = 24' },
    card1_cap: { ru: 'таблица умножения, урок 9', uz: "ko'paytirish jadvali, 9-dars" },
    card2: { ru: '24 : 3 = 8', uz: '24 : 3 = 8' },
    card2_cap: { ru: 'связь умножения и деления, урок 14', uz: "ko'paytirish va bo'lish bog'lanishi, 14-dars" },
    audio: {
      ru: [
        'Обе записи ты уже знаешь. Открой первую карточку.',
        'Восемь умножить на три, двадцать четыре.',
        'Двадцать четыре разделить на три, восемь.',
        'Считать ты умеешь. Новое сегодня одно. По словам задачи выбрать, какое из этих действий нужно.'
      ],
      uz: [
        "Ikkala yozuvni ham bilasiz. Birinchi kartani oching.",
        "Sakkiz karra uch, yigirma to'rt.",
        "Yigirma to'rtni uchga bo'lsak, sakkiz.",
        "Hisoblashni bilasiz. Bugun yangisi bitta. Masaladagi so'zlarga qarab qaysi amal kerakligini tanlash."
      ]
    }
  },

  s2: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: { ru: 'В 3 раза больше и на 3 больше — это разное', uz: "3 marta ko'p va 3 ta ko'p — bular boshqacha" },
    cap_mul: { ru: 'в 3 раза больше', uz: "3 marta ko'p" },
    cap_add: { ru: 'на 3 больше', uz: "3 ta ko'p" },
    mul_badge: '×3',
    add_badge: '+3',
    mul_val: 24,
    add_val: 11,
    row_n: 8,
    btn1: { ru: 'Взять мерку три раза', uz: 'Merkani uch marta olish' },
    btn2: { ru: 'А если на три больше?', uz: "Uchta ko'p bo'lsa-chi?" },
    done_text: { ru: 'В три раза больше это двадцать четыре, а на три больше только одиннадцать.', uz: "Uch marta ko'p bu yigirma to'rt, uchta ko'p esa faqat o'n bir." },
    audio: {
      ru: [
        'Смотри на мерку. Одна грядка Рано, на ней восемь растений.',
        'В три раза больше значит взять эту мерку три раза. Восемь, шестнадцать, двадцать четыре.',
        'А на три больше значит добавить всего три растения. Получается одиннадцать.',
        'Разница в одном слове. Раз это про мерку и умножение, а на это про добавку и сложение.'
      ],
      uz: [
        "Merkaga qarang. Ra'noning bitta gulzori, unda sakkizta o'simlik.",
        "Uch marta ko'p degani bu merkani uch marta olish. Sakkiz, o'n olti, yigirma to'rt.",
        "Uchta ko'p degani esa faqat uchta o'simlik qo'shish. O'n bir chiqadi.",
        "Farq bitta so'zda. Marta bu merka va ko'paytirish, ta esa qo'shimcha va qo'shish."
      ]
    }
  },

  s3: {
    eyebrow: { ru: 'Таблица задачи', uz: 'Masala jadvali' },
    lead: { ru: 'Задачу записывают таблицей, как в учебнике', uz: 'Masala kitobdagidek jadval bilan yoziladi' },
    h1: { ru: 'На одну грядку', uz: 'Bitta gulzorga' },
    h2: { ru: 'Грядок', uz: 'Gulzorlar' },
    h3: { ru: 'Всего', uz: 'Jami' },
    a: 8,
    b: 3,
    total: 24,
    expr_mul: '8 × 3 = 24',
    expr_div: '24 : 8 = 3',
    note_mul: { ru: 'неизвестно всего — умножаем', uz: "jami noma'lum — ko'paytiramiz" },
    note_div: { ru: 'неизвестно, сколько грядок — делим', uz: "gulzorlar soni noma'lum — bo'lamiz" },
    btn1: { ru: 'Найти всего', uz: 'Jamini topish' },
    btn2: { ru: 'Перевернуть задачу', uz: 'Masalani teskari qilish' },
    done_text: { ru: 'Одна таблица, а действия два. Слово подсказывает, какое взять.', uz: "Jadval bitta, amal esa ikkita. Qaysi birini olishni so'z aytadi." },
    audio: {
      ru: [
        'Задачу удобно записать в таблицу, как в учебнике. На одну грядку восемь, грядок три, а всего пока неизвестно.',
        'Всего находим умножением. Восемь умножить на три, двадцать четыре.',
        'Теперь наоборот. Всего двадцать четыре, на одну грядку восемь, а число грядок неизвестно. Здесь нужно деление.',
        'Запомни по таблице. Неизвестно всего, умножаем. Неизвестно, сколько грядок, делим.'
      ],
      uz: [
        "Masalani kitobdagidek jadvalga yozish qulay. Bitta gulzorga sakkizta, gulzor uchta, jami esa hozircha noma'lum.",
        "Jamini ko'paytirish bilan topamiz. Sakkiz karra uch, yigirma to'rt.",
        "Endi teskarisiga. Jami yigirma to'rt, bitta gulzorga sakkizta, gulzorlar soni esa noma'lum. Bu yerda bo'lish kerak.",
        "Jadval bo'yicha eslab qoling. Jami noma'lum bo'lsa, ko'paytiramiz. Gulzorlar soni noma'lum bo'lsa, bo'lamiz."
      ]
    }
  },

  s4: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    q: { ru: 'В задаче сказано: у Жасура в 3 раза меньше. Какое действие?', uz: "Masalada aytilgan: Jasurda 3 marta kam. Qaysi amal?" },
    opts: [
      { ru: 'Деление', uz: "Bo'lish" },
      { ru: 'Умножение', uz: "Ko'paytirish" },
      { ru: 'Сложение', uz: "Qo'shish" },
      { ru: 'Вычитание', uz: 'Ayirish' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Умножение делает больше, а сказано меньше.', uz: "Ko'paytirish ko'paytiradi, aytilgani esa kam." },
      2: { ru: 'Сложение тоже делает больше. И слово раз тут про мерку, а не про добавку.', uz: "Qo'shish ham ko'paytiradi. Marta so'zi esa merka haqida, qo'shimcha haqida emas." },
      3: { ru: 'Вычитание убирает три растения. А в три раза меньше значит мерка уложилась три раза.', uz: "Ayirish uchta o'simlikni olib qo'yadi. Uch marta kam esa merka uch marta joylashgan degani." }
    },
    on_correct: { ru: 'Верно! В несколько раз меньше находят делением.', uz: "To'g'ri! Bir necha marta kam bo'lish bilan topiladi." },
    rule_lines: {
      ru: [
        'в несколько раз больше — умножаем',
        'в несколько раз меньше — делим',
        'во сколько раз больше — делим большее на меньшее'
      ],
      uz: [
        "bir necha marta ko'p — ko'paytiramiz",
        "bir necha marta kam — bo'lamiz",
        "necha marta ko'p — kattani kichigiga bo'lamiz"
      ]
    },
    rule_ex: '8 × 3 = 24 · 24 : 3 = 8 · 24 : 8 = 3',
    rule_speech: {
      ru: 'Правило такое. Если в задаче сказано в несколько раз больше, умножаем. Если в несколько раз меньше, делим. А если спрашивают, во сколько раз больше, делим большее число на меньшее.',
      uz: "Qoida shunday. Masalada bir necha marta ko'p deyilsa, ko'paytiramiz. Bir necha marta kam deyilsa, bo'lamiz. Necha marta ko'p deb so'ralsa esa, katta sonni kichigiga bo'lamiz."
    },
    audio: {
      intro: { ru: 'Теперь главный вопрос урока.', uz: "Endi darsning asosiy savoli." }
    }
  },

  s5: {
    eyebrow: { ru: 'Ловушка Бита', uz: 'Bit tuzogi' },
    lead: { ru: 'Бит прочитал в 3 раза больше и посчитал так', uz: "Bit 3 marta ko'p deb o'qidi va shunday hisobladi" },
    lines: ['8 + 3', '11'],
    line_cap: { ru: 'в 3 раза больше', uz: "3 marta ko'p" },
    trap_label: { ru: 'Верно ли посчитал Бит?', uz: "Bit to'g'ri hisobladimi?" },
    trap_opts: { ru: ['Верно', 'Неверно'], uz: ["To'g'ri", "Noto'g'ri"] },
    trap_ci: 1,
    trap_correct: {
      ru: 'Точно! Одиннадцать это ответ на другую фразу, на три больше. А в три раза больше значит взять мерку три раза, двадцать четыре.',
      uz: "Aniq! O'n bir boshqa iboraning javobi, uchta ko'p. Uch marta ko'p esa merkani uch marta olish, yigirma to'rt."
    },
    trap_wrong: {
      ru: 'Посмотри на грядки. У Анвара три такие же полосы, а не одна полоса и три растения.',
      uz: "Gulzorlarga qarang. Anvarda xuddi shunday uchta polosa bor, bitta polosa va uchta o'simlik emas."
    },
    audio: {
      ru: [
        'Бит прочитал в три раза больше и посчитал так. Восемь плюс три, одиннадцать!',
        'Верно ли посчитал Бит?'
      ],
      uz: [
        "Bit uch marta ko'p deb o'qidi va shunday hisobladi. Sakkiz qo'shuv uch, o'n bir!",
        "Bit to'g'ri hisobladimi?"
      ]
    }
  },

  s6: {
    eyebrow: { ru: 'Больше и меньше', uz: "Ko'p va kam" },
    lead: { ru: 'Одна грядка читается в две стороны', uz: "Bitta gulzor ikki tomonga o'qiladi" },
    left_title: { ru: 'в 3 раза больше', uz: "3 marta ko'p" },
    left_lines: ['8', '8 × 3', '24'],
    left_cap: { ru: 'от Рано к Анвару, умножаем', uz: "Ra'nodan Anvarga, ko'paytiramiz" },
    right_title: { ru: 'в 3 раза меньше', uz: '3 marta kam' },
    right_lines: ['24', '24 : 3', '8'],
    right_cap: { ru: 'от Анвара к Жасуру, делим', uz: "Anvardan Jasurga, bo'lamiz" },
    btn1: { ru: 'Больше', uz: "Ko'p" },
    btn2: { ru: 'Меньше', uz: 'Kam' },
    mc_q: { ru: 'У Жасура в 3 раза меньше, чем 24. Сколько у Жасура?', uz: "Jasurda 24 dan 3 marta kam. Jasurda nechta?" },
    mc_q_speech: { ru: 'У Жасура в три раза меньше, чем двадцать четыре. Сколько растений у Жасура?', uz: "Jasurda yigirma to'rtdan uch marta kam. Jasurda nechta o'simlik?" },
    mc_opts: [
      { ru: '8', uz: '8' },
      { ru: '21', uz: '21' },
      { ru: '72', uz: '72' },
      { ru: '27', uz: '27' }
    ],
    mc_ci: 0,
    mc_hints: {
      1: { ru: 'Двадцать один получается, если убрать три растения. А в три раза меньше значит мерка уложилась три раза.', uz: "Yigirma bir uchta o'simlikni olib qo'ysak chiqadi. Uch marta kam esa merka uch marta joylashgan degani." },
      2: { ru: 'Так число стало больше, а сказано меньше.', uz: "Bunda son kattalashdi, aytilgani esa kam." },
      3: { ru: 'Сложение делает больше. Здесь нужно деление.', uz: "Qo'shish ko'paytiradi. Bu yerda bo'lish kerak." }
    },
    mc_ok: { ru: 'Верно! Двадцать четыре разделить на три, восемь.', uz: "To'g'ri! Yigirma to'rtni uchga bo'lsak, sakkiz." },
    audio: {
      ru: [
        'Одна и та же грядка читается в две стороны. Нажми и посмотри.',
        'От Рано к Анвару. В три раза больше, умножаем, двадцать четыре.',
        'От Анвара к Жасуру. В три раза меньше, делим, восемь.',
        'Больше и меньше это одна дорога в две стороны. Одно слово меняет действие.'
      ],
      uz: [
        "Bitta gulzor ikki tomonga o'qiladi. Bosing va qarang.",
        "Ra'nodan Anvarga. Uch marta ko'p, ko'paytiramiz, yigirma to'rt.",
        "Anvardan Jasurga. Uch marta kam, bo'lamiz, sakkiz.",
        "Ko'p va kam bu bitta yo'lning ikki tomoni. Bitta so'z amalni o'zgartiradi."
      ]
    }
  },

  s7: {
    eyebrow: { ru: 'Пять секунд', uz: 'Besh soniya' },
    q: { ru: 'Какая запись подходит?', uz: 'Qaysi yozuv mos keladi?' },
    setup: { ru: 'У Рано 9 растений, у Зухры в 2 раза больше.', uz: "Ra'noda 9 o'simlik, Zuhrada 2 marta ko'p." },
    items: [
      {
        opts: [{ ru: '9 × 2', uz: '9 × 2' }, { ru: '9 + 2', uz: '9 + 2' }, { ru: '9 − 2', uz: '9 − 2' }, { ru: '9 : 2', uz: '9 : 2' }],
        hints: [
          null,
          { ru: 'Это на два больше. А сказано в два раза больше.', uz: "Bu ikkita ko'p. Aytilgani esa ikki marta ko'p." },
          { ru: 'Вычитание делает меньше, а у Зухры больше.', uz: "Ayirish kamaytiradi, Zuhrada esa ko'p." },
          { ru: 'Деление тоже делает меньше. Оно нужно, когда сказано в несколько раз меньше.', uz: "Bo'lish ham kamaytiradi. U bir necha marta kam deyilganda kerak." }
        ],
        ci: 0
      }
    ],
    audio: {
      intro: { ru: 'Пять секунд на подумать. У Рано девять растений, у Зухры в два раза больше. Выбери не ответ, а запись.', uz: "O'ylash uchun besh soniya. Ra'noda to'qqiz o'simlik, Zuhrada ikki marta ko'p. Javobni emas, yozuvni tanlang." },
      on_correct: { ru: 'Успел! Девять умножить на два, восемнадцать.', uz: "Ulguribsiz! To'qqiz karra ikki, o'n sakkiz." },
      on_wrong: { ru: 'В несколько раз больше это умножение.', uz: "Bir necha marta ko'p bu ko'paytirish." }
    }
  },

  s8: {
    eyebrow: { ru: 'Во сколько раз', uz: 'Necha marta' },
    items: [
      {
        q: { ru: 'Во сколько раз 24 больше, чем 8?', uz: "24 soni 8 dan necha marta ko'p?" },
        q_speech: { ru: 'Во сколько раз двадцать четыре больше, чем восемь?', uz: "Yigirma to'rt sakkizdan necha marta ko'p?" },
        big: 24, small: 8,
        opts: [{ ru: '3', uz: '3' }, { ru: '16', uz: '16' }, { ru: '32', uz: '32' }, { ru: '4', uz: '4' }],
        hints: [
          null,
          { ru: 'Шестнадцать это разность. А во сколько раз показывает деление.', uz: "O'n olti bu ayirma. Necha marta ko'pligini bo'lish ko'rsatadi." },
          { ru: 'Тридцать два больше обоих чисел. Мы ищем, сколько мерок уложилось.', uz: "O'ttiz ikki ikkala sondan katta. Biz nechta merka joylashganini qidiramiz." },
          { ru: 'Проверь умножением. Восемь умножить на четыре, тридцать два, а не двадцать четыре.', uz: "Ko'paytirib tekshiring. Sakkiz karra to'rt, o'ttiz ikki, yigirma to'rt emas." }
        ],
        ci: 0
      },
      {
        q: { ru: 'Во сколько раз 30 больше, чем 5?', uz: "30 soni 5 dan necha marta ko'p?" },
        q_speech: { ru: 'Во сколько раз тридцать больше, чем пять?', uz: "O'ttiz beshdan necha marta ko'p?" },
        big: 30, small: 5,
        opts: [{ ru: '6', uz: '6' }, { ru: '25', uz: '25' }, { ru: '35', uz: '35' }, { ru: '5', uz: '5' }],
        hints: [
          null,
          { ru: 'Двадцать пять это разность, а нужно деление.', uz: "Yigirma besh bu ayirma, kerakli amal esa bo'lish." },
          { ru: 'Это сумма. Она не показывает, сколько раз.', uz: "Bu yig'indi. U necha marta ekanini ko'rsatmaydi." },
          { ru: 'Проверь. Пять умножить на пять, двадцать пять, а не тридцать.', uz: "Tekshiring. Besh karra besh, yigirma besh, o'ttiz emas." }
        ],
        ci: 0
      },
      {
        q: { ru: 'Во сколько раз 36 больше, чем 4?', uz: "36 soni 4 dan necha marta ko'p?" },
        q_speech: { ru: 'Во сколько раз тридцать шесть больше, чем четыре?', uz: "O'ttiz olti to'rtdan necha marta ko'p?" },
        big: 36, small: 4,
        opts: [{ ru: '9', uz: '9' }, { ru: '32', uz: '32' }, { ru: '40', uz: '40' }, { ru: '8', uz: '8' }],
        hints: [
          null,
          { ru: 'Тридцать два это разность.', uz: "O'ttiz ikki bu ayirma." },
          { ru: 'Это сумма, а не число мерок.', uz: "Bu yig'indi, merkalar soni emas." },
          { ru: 'Проверь. Четыре умножить на восемь, тридцать два.', uz: "Tekshiring. To'rt karra sakkiz, o'ttiz ikki." }
        ],
        ci: 0
      }
    ],
    audio: {
      intro: { ru: 'Третий вопрос задачи звучит так. Во сколько раз больше. Тут тоже деление, только делим большее число на меньшее.', uz: "Masalaning uchinchi savoli shunday. Necha marta ko'p. Bu yerda ham bo'lish, faqat katta sonni kichigiga bo'lamiz." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Раздели большее на меньшее.', uz: "Kattani kichigiga bo'ling." }
    }
  },

  s9: {
    eyebrow: { ru: 'Тест', uz: 'Test' },
    items: [
      {
        q: { ru: 'У Анвара 7 растений, у Зухры в 5 раз больше. Какая запись?', uz: "Anvarda 7 o'simlik, Zuhrada 5 marta ko'p. Qaysi yozuv?" },
        q_speech: { ru: 'У Анвара семь растений, у Зухры в пять раз больше. Какая запись?', uz: "Anvarda yetti o'simlik, Zuhrada besh marta ko'p. Qaysi yozuv?" },
        // Metodist 2026-08-05: SHU savolda rasm YO'Q — shart matnda to'liq aytilgan,
        // bola yozuvni so'zdan tanlaydi. `fig` yo'q bo'lsa, figura umuman chizilmaydi.
        fig: null,
        opts: [{ ru: '7 × 5', uz: '7 × 5' }, { ru: '7 + 5', uz: '7 + 5' }, { ru: '7 − 5', uz: '7 − 5' }, { ru: '7 : 5', uz: '7 : 5' }],
        hints: [
          null,
          { ru: 'Это на пять больше.', uz: "Bu beshta ko'p." },
          { ru: 'Вычитание делает меньше.', uz: 'Ayirish kamaytiradi.' },
          { ru: 'Деление нужно, когда меньше или когда спрашивают во сколько раз.', uz: "Bo'lish kam bo'lganda yoki necha marta deb so'ralganda kerak." }
        ],
        ci: 0
      },
      {
        q: { ru: 'В 6 раз меньше, чем 42. Какая запись?', uz: "42 dan 6 marta kam. Qaysi yozuv?" },
        q_speech: { ru: 'В шесть раз меньше, чем сорок два. Какая запись?', uz: "Qirq ikkidan olti marta kam. Qaysi yozuv?" },
        fig: null,   // metodist 2026-08-05: bu savolda ham rasm YO'Q
        opts: [{ ru: '42 : 6', uz: '42 : 6' }, { ru: '42 × 6', uz: '42 × 6' }, { ru: '42 − 6', uz: '42 − 6' }, { ru: '6 : 42', uz: '6 : 42' }],
        hints: [
          null,
          { ru: 'Умножение делает больше.', uz: "Ko'paytirish ko'paytiradi." },
          { ru: 'Это на шесть меньше, а сказано в шесть раз меньше.', uz: "Bu oltita kam, aytilgani esa olti marta kam." },
          { ru: 'Делят большее на меньшее, а не наоборот.', uz: "Kattani kichigiga bo'ladilar, teskarisiga emas." }
        ],
        ci: 0
      },
      {
        q: { ru: 'Во сколько раз 45 больше, чем 9?', uz: "45 soni 9 dan necha marta ko'p?" },
        q_speech: { ru: 'Во сколько раз сорок пять больше, чем девять?', uz: "Qirq besh to'qqizdan necha marta ko'p?" },
        fig: null,   // butun test ekrani rasmsiz: faqat savol va to'rt variant
        opts: [{ ru: '5', uz: '5' }, { ru: '36', uz: '36' }, { ru: '54', uz: '54' }, { ru: '4', uz: '4' }],
        hints: [
          null,
          { ru: 'Тридцать шесть это разность.', uz: "O'ttiz olti bu ayirma." },
          { ru: 'Это сумма.', uz: "Bu yig'indi." },
          { ru: 'Проверь. Девять умножить на четыре, тридцать шесть.', uz: "Tekshiring. To'qqiz karra to'rt, o'ttiz olti." }
        ],
        ci: 0
      }
    ],
    audio: {
      intro: { ru: 'Три вопроса вперемешку. Сначала читай слова, потом выбирай действие.', uz: "Uch savol aralash. Avval so'zlarni o'qing, keyin amalni tanlang." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Прочитай слова ещё раз.', uz: "So'zlarni yana bir o'qing." }
    }
  },

  s10: {
    eyebrow: { ru: 'Бонус', uz: 'Bonus' },
    lead: { ru: 'Задача в два шага', uz: 'Ikki qadamli masala' },
    task: { ru: 'У Рано 7 растений, у Анвара в 3 раза больше. Сколько ВСЕГО?', uz: "Ra'noda 7 o'simlik, Anvarda 3 marta ko'p. JAMI nechta?" },
    task_speech: { ru: 'У Рано семь растений, у Анвара в три раза больше. Сколько всего?', uz: "Ra'noda yetti o'simlik, Anvarda uch marta ko'p. Jami nechta?" },
    step1: '7 × 3 = 21',
    step1_cap: { ru: 'столько у Анвара', uz: 'Anvarda shuncha' },
    step2: '21 + 7 = 28',
    step2_cap: { ru: 'а это всего', uz: 'bu esa jami' },
    btn1: { ru: 'Первый шаг', uz: 'Birinchi qadam' },
    btn2: { ru: 'Второй шаг', uz: 'Ikkinchi qadam' },
    btn3: { ru: 'Проверить записи Бита', uz: "Bitning yozuvlarini tekshirish" },
    find_label: { ru: 'Найди неверную запись Бита', uz: "Bitning noto'g'ri yozuvini toping" },
    stmts: ['7 × 3 = 21', 'Jami 21', '21 + 7 = 28'],
    stmt_caps: [
      { ru: 'у Анвара', uz: 'Anvarda' },
      { ru: 'всего', uz: 'jami' },
      { ru: 'всего', uz: 'jami' }
    ],
    wrong: 1,
    wrong_hint: {
      ru: 'Двадцать один это только у Анвара. Вопрос был про всех, поэтому нужно прибавить растения Рано.',
      uz: "Yigirma bir bu faqat Anvarda. Savol esa hamma haqida edi, shuning uchun Ra'noning o'simliklarini qo'shish kerak."
    },
    other_hint: {
      ru: 'Эта запись верна. Проверь остальные.',
      uz: "Bu yozuv to'g'ri. Boshqalarini tekshiring."
    },
    audio: {
      ru: [
        'Небольшой бонус. Бывают задачи в два шага, в учебнике они называются составными.',
        'Сначала находим, сколько у Анвара. Семь умножить на три, двадцать один.',
        'Теперь всего. Двадцать один плюс семь, двадцать восемь.',
        'А теперь найди у Бита неверную запись.',
        'Главное в составной задаче это дойти до вопроса, а не остановиться на середине.'
      ],
      uz: [
        "Kichik bonus. Ikki qadamli masalalar bo'ladi, kitobda ular tarkibli deb ataladi.",
        "Avval Anvarda nechta ekanini topamiz. Yetti karra uch, yigirma bir.",
        "Endi jami. Yigirma bir qo'shuv yetti, yigirma sakkiz.",
        "Endi Bitning noto'g'ri yozuvini toping.",
        "Tarkibli masalada asosiysi savolga yetib borish, o'rtada to'xtab qolish emas."
      ]
    }
  },

  s11: {
    eyebrow: { ru: 'Тренажёр', uz: 'Trenajyor' },
    items: [
      { q: { ru: 'В 6 раз меньше, чем 48. Набери ответ.', uz: "48 dan 6 marta kam. Javobni tering." }, q_speech: { ru: 'В шесть раз меньше, чем сорок восемь.', uz: "Qirq sakkizdan olti marta kam." }, ans: 8, check: '8 × 6 = 48', hint: { ru: 'В несколько раз меньше находят делением. Сорок восемь разделить на шесть.', uz: "Bir necha marta kam bo'lish bilan topiladi. Qirq sakkizni oltiga bo'ling." } },
      { q: { ru: 'В 9 раз больше, чем 6. Набери ответ.', uz: "6 dan 9 marta ko'p. Javobni tering." }, q_speech: { ru: 'В девять раз больше, чем шесть.', uz: "Oltidan to'qqiz marta ko'p." }, ans: 54, check: '54 : 9 = 6', hint: { ru: 'В несколько раз больше находят умножением. Шесть умножить на девять.', uz: "Bir necha marta ko'p ko'paytirish bilan topiladi. Olti karra to'qqiz." } },
      { q: { ru: 'Во сколько раз 56 больше, чем 8? Набери ответ.', uz: "56 soni 8 dan necha marta ko'p? Javobni tering." }, q_speech: { ru: 'Во сколько раз пятьдесят шесть больше, чем восемь?', uz: "Ellik olti sakkizdan necha marta ko'p?" }, ans: 7, check: '7 × 8 = 56', hint: { ru: 'Раздели большее на меньшее, пятьдесят шесть на восемь.', uz: "Kattani kichigiga bo'ling, ellik oltini sakkizga." } }
    ],
    check_label: { ru: 'проверка', uz: 'tekshirish' },
    audio: {
      intro: { ru: 'Три задачи, и после каждой сразу проверка обратным действием.', uz: "Uch masala, har biridan keyin darrov teskari amal bilan tekshirish." },
      on_correct: { ru: 'Верно, и проверка это подтвердила.', uz: "To'g'ri, tekshirish ham buni tasdiqladi." }
    }
  },

  s12: {
    eyebrow: { ru: 'Обратная задача', uz: 'Teskari masala' },
    lead: { ru: 'Задача с другого конца.', uz: 'Masala boshqa tomondan.' },
    q: { ru: 'У Зухры 32 растения, это в 4 раза больше, чем у Жасура. Сколько растений у Жасура?', uz: "Zuhrada 32 o'simlik, bu Jasurdagidan 4 marta ko'p. Jasurda nechta o'simlik?" },
    q_speech: { ru: 'У Зухры тридцать два растения, это в четыре раза больше, чем у Жасура. Сколько растений у Жасура?', uz: "Zuhrada o'ttiz ikki o'simlik, bu Jasurdagidan to'rt marta ko'p. Jasurda nechta o'simlik?" },
    pick_label: { ru: 'Сначала выбери запись', uz: 'Avval yozuvni tanlang' },
    opts: [
      { ru: '32 : 4', uz: '32 : 4' },
      { ru: '32 × 4', uz: '32 × 4' },
      { ru: '32 − 4', uz: '32 − 4' },
      { ru: '4 : 32', uz: '4 : 32' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Умножение даст ещё больше, а у Жасура меньше.', uz: "Ko'paytirish yana ko'p beradi, Jasurda esa kam." },
      2: { ru: 'Это на четыре меньше. А сказано в четыре раза больше у Зухры.', uz: "Bu to'rtta kam. Aytilgani esa Zuhrada to'rt marta ko'p." },
      3: { ru: 'Делят большее на меньшее.', uz: "Kattani kichigiga bo'ladilar." }
    },
    pick_ok: { ru: 'Запись верная. Теперь набери ответ.', uz: "Yozuv to'g'ri. Endi javobni tering." },
    ans: 8,
    check: '8 × 4 = 32',
    setup_audio: { ru: 'Задача с другого конца. Известно у Зухры, а найти нужно у Жасура. Сначала выбери запись, потом посчитай.', uz: "Masala boshqa tomondan. Zuhradagi ma'lum, topish kerak esa Jasurdagi. Avval yozuvni tanlang, keyin hisoblang." },
    audio: {
      intro: { ru: 'Тут пригодится всё правило.', uz: "Bu yerda butun qoida kerak bo'ladi." },
      on_correct: { ru: 'Восемь растений! И проверка сошлась, восемь умножить на четыре, тридцать два.', uz: "Sakkizta o'simlik! Tekshirish ham mos keldi, sakkiz karra to'rt, o'ttiz ikki." },
      on_wrong: { ru: 'Тридцать два разделить на четыре. Сколько мерок уложилось?', uz: "O'ttiz ikkini to'rtga bo'ling. Nechta merka joylashdi?" }
    }
  },

  s13: {
    eyebrow: { ru: 'Финал', uz: 'Final' },
    intro_line: { ru: 'Пять вопросов — и задание в саду закрыто', uz: "Besh savol va bog' vazifasi yopiladi" },
    items: [
      {
        kind: 'num',
        q: { ru: 'В 7 раз больше, чем 9. Набери ответ.', uz: "9 dan 7 marta ko'p. Javobni tering." },
        q_speech: { ru: 'В семь раз больше, чем девять.', uz: "To'qqizdan yetti marta ko'p." },
        ans: 63,
        hint: { ru: 'В несколько раз больше это умножение. Девять умножить на семь.', uz: "Bir necha marta ko'p bu ko'paytirish. To'qqiz karra yetti." }
      },
      {
        kind: 'mc',
        q: { ru: 'Во сколько раз 72 больше, чем 8?', uz: "72 soni 8 dan necha marta ko'p?" },
        q_speech: { ru: 'Во сколько раз семьдесят два больше, чем восемь?', uz: "Yetmish ikki sakkizdan necha marta ko'p?" },
        opt0: { ru: '9', uz: '9' },
        opt1: { ru: '64', uz: '64' },
        opt2: { ru: '80', uz: '80' },
        opt3: { ru: '8', uz: '8' },
        wrong_1: { ru: 'Шестьдесят четыре это разность.', uz: "Oltmish to'rt bu ayirma." },
        wrong_2: { ru: 'Это сумма.', uz: "Bu yig'indi." },
        wrong_3: { ru: 'Проверь. Восемь умножить на восемь, шестьдесят четыре.', uz: "Tekshiring. Sakkiz karra sakkiz, oltmish to'rt." }
      },
      {
        kind: 'mc',
        q: { ru: 'В 9 раз меньше, чем 81. Какая запись?', uz: "81 dan 9 marta kam. Qaysi yozuv?" },
        q_speech: { ru: 'В девять раз меньше, чем восемьдесят один. Какая запись?', uz: "Sakson birdan to'qqiz marta kam. Qaysi yozuv?" },
        opt0: { ru: '81 : 9', uz: '81 : 9' },
        opt1: { ru: '81 × 9', uz: '81 × 9' },
        opt2: { ru: '81 − 9', uz: '81 − 9' },
        opt3: { ru: '9 : 81', uz: '9 : 81' },
        wrong_1: { ru: 'Умножение делает больше.', uz: "Ko'paytirish ko'paytiradi." },
        wrong_2: { ru: 'Это на девять меньше.', uz: "Bu to'qqizta kam." },
        wrong_3: { ru: 'Порядок в делении важен.', uz: "Bo'lishda tartib muhim." }
      },
      {
        kind: 'num',
        q: { ru: '40 растений это в 5 раз больше, чем у Бита. Сколько у Бита?', uz: "40 o'simlik Bitdagidan 5 marta ko'p. Bitda nechta?" },
        q_speech: { ru: 'Сорок растений это в пять раз больше, чем у Бита. Сколько растений у Бита?', uz: "Qirq o'simlik Bitdagidan besh marta ko'p. Bitda nechta o'simlik?" },
        ans: 8,
        hint: { ru: 'Сорок разделить на пять.', uz: "Qirqni beshga bo'ling." }
      },
      {
        kind: 'mc',
        q: { ru: 'У Рано 10 растений. Сначала на 2 больше, потом в 2 раза больше. Какая пара верна?', uz: "Ra'noda 10 o'simlik. Avval 2 ta ko'p, keyin 2 marta ko'p. Qaysi juftlik to'g'ri?" },
        q_speech: { ru: 'У Рано десять растений. Сначала на два больше, потом в два раза больше. Какая пара верна?', uz: "Ra'noda o'n o'simlik. Avval ikkita ko'p, keyin ikki marta ko'p. Qaysi juftlik to'g'ri?" },
        opt0: { ru: '12 и 20', uz: '12 va 20' },
        opt1: { ru: '20 и 12', uz: '20 va 12' },
        opt2: { ru: '12 и 12', uz: '12 va 12' },
        opt3: { ru: '20 и 20', uz: '20 va 20' },
        wrong_1: { ru: 'Наоборот. На два больше это добавить два, а в два раза больше это взять мерку два раза.', uz: "Teskarisi. Ikkita ko'p bu ikkitani qo'shish, ikki marta ko'p esa merkani ikki marta olish." },
        wrong_2: { ru: 'Тогда слова не различались бы, а они разные. Раз это мерка.', uz: "Unda so'zlar farq qilmas edi, ular esa boshqacha. Marta bu merka." },
        wrong_3: { ru: 'На два больше это только двенадцать.', uz: "Ikkita ko'p bu faqat o'n ikki." }
      }
    ],
    fact_badge: { ru: 'Знаешь ли ты?', uz: 'Bilasizmi?' },
    fact_text: {
      ru: 'Муравей поднимает груз в пятьдесят раз тяжелее себя. Во сколько раз тяжелее, узнают делением: вес груза делят на вес муравья. Если бы человек мог так же, он поднял бы легковую машину.',
      uz: "Chumoli o'zidan ellik marta og'ir yukni ko'taradi. Necha marta og'irligini bo'lish bilan biladilar: yuk vaznini chumoli vazniga bo'ladilar. Odam ham shunday qila olsa, yengil mashinani ko'tarib ketardi."
    },
    fact_audio: {
      ru: 'Муравей поднимает груз в пятьдесят раз тяжелее себя. Во сколько раз тяжелее, узнают делением. Вес груза делят на вес муравья. Если бы человек мог так же, он поднял бы легковую машину. Мы весь урок считали, во сколько раз больше, и здесь то же деление.',
      uz: "Chumoli o'zidan ellik marta og'ir yukni ko'taradi. Necha marta og'irligini bo'lish bilan biladilar. Yuk vaznini chumoli vazniga bo'ladilar. Odam ham shunday qila olsa, yengil mashinani ko'tarib ketardi. Butun dars necha marta ko'p ekanini hisobladik, bu yerda ham o'sha bo'lish."
    },
    audio: {
      intro: { ru: 'Финальная проверка, пять вопросов.', uz: 'Yakuniy tekshiruv, besh savol.' },
      on_correct: { ru: 'Верно!', uz: "To'g'ri!" },
      on_wrong: { ru: 'Прочитай слова задачи ещё раз.', uz: "Masaladagi so'zlarni yana bir o'qing." }
    }
  },

  s14: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    mission_done: { ru: 'Задание в саду выполнено!', uz: "Bog'dagi vazifa bajarildi!" },
    cando: { ru: 'Теперь ты выбираешь действие по словам задачи.', uz: "Endi siz masaladagi so'zlarga qarab amalni tanlaysiz." },
    rule_recap: {
      ru: 'В несколько раз больше — умножаем. В несколько раз меньше — делим. Во сколько раз больше — делим большее на меньшее. 8 × 3 = 24, 24 : 3 = 8, 24 : 8 = 3.',
      uz: "Bir necha marta ko'p — ko'paytiramiz. Bir necha marta kam — bo'lamiz. Necha marta ko'p — kattani kichigiga bo'lamiz."
    },
    conn_label_refs: { ru: 'опирается на', uz: 'tayanadi' },
    conn_refs: { ru: 'урок 9: таблица умножения; урок 14: связь умножения и деления', uz: "9-dars: ko'paytirish jadvali; 14-dars: ko'paytirish va bo'lish bog'lanishi" },
    conn_label_next: { ru: 'дальше', uz: 'keyingi' },
    conn_next: { ru: 'делители и кратные числа', uz: "bo'luvchilar va karrali sonlar" },
    audio: {
      ru: 'Задание в саду закрыто. И у тебя новое умение. Ты читаешь слова задачи и выбираешь действие. Запомни главное. В несколько раз больше умножаем, в несколько раз меньше делим, а во сколько раз больше делим большее на меньшее. А если растения нужно разложить по грядкам ровно, без остатка? Какие числа для этого подходят? Об этом в следующем уроке!',
      uz: "Bog'dagi vazifa yopildi. Sizda esa yangi ko'nikma bor. Masaladagi so'zlarni o'qib, amalni tanlaysiz. Asosiysini eslab qoling. Bir necha marta ko'p bo'lsa ko'paytiramiz, bir necha marta kam bo'lsa bo'lamiz, necha marta ko'p deb so'ralsa kattani kichigiga bo'lamiz. Agar o'simliklarni gulzorlarga qoldiqsiz, tekis joylash kerak bo'lsa-chi? Buning uchun qanday sonlar mos keladi? Bu haqda keyingi darsda!"
    }
  }
};

// v9 KO'PRIK — ekranda ko'rinmaydi, faqat ovozda (brgSeg orqali birinchi segment).
const BRIDGES = {
  s1:  { ru: 'Сначала вспомним, что умеем.', uz: 'Avval bilganimizni eslaymiz.' },
  s2:  { ru: 'Теперь к грядкам.', uz: 'Endi gulzorlarga.' },
  s3:  { ru: 'Запишем задачу таблицей.', uz: 'Masalani jadval bilan yozamiz.' },
  s4:  { ru: 'Соберём это в правило.', uz: 'Buni qoidaga yig\'amiz.' },
  s5:  { ru: 'А вот и Бит со своим счётом.', uz: "Mana Bit ham o'z hisobi bilan." },
  s6:  { ru: 'Теперь в другую сторону.', uz: 'Endi boshqa tomonga.' },
  s7:  { ru: 'Проверь себя на скорость.', uz: "O'zingizni tezlikka sinang." },
  s8:  { ru: 'Третий вопрос задачи.', uz: 'Masalaning uchinchi savoli.' },
  s9:  { ru: 'Теперь все три вперемешку.', uz: 'Endi uchtasi aralash.' },
  s10: { ru: 'Открою тебе один секрет.', uz: 'Sizga bir sirni ochaman.' },
  s11: { ru: 'Теперь считай сам.', uz: "Endi o'zingiz hisoblang." },
  s12: { ru: 'Зухре нужна помощь.', uz: 'Zuhraga yordam kerak.' },
  s13: { ru: 'Финальная проверка.', uz: 'Yakuniy tekshiruv.' },
  s14: { ru: 'Задание закрыто. Идём дальше!', uz: 'Vazifa yopildi. Davom etamiz!' }
};

// s14 payoff (xulosadan oldin aytiladi)
const S14_PAYOFF = {
  ru: 'Миссия выполнена! Обе грядки политы, задание в саду закрыто, и слова задачи больше не путают. Спасибо за помощь!',
  uz: "Missiya bajarildi! Ikki gulzor ham sug'orildi, bog'dagi vazifa yopildi, masaladagi so'zlar endi chalkashtirmaydi. Yordamingiz uchun rahmat!"
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



// --- BOG' VAZIFASI ZALI (D16): 4-darsning zali qayta ishlangan.
// O'zgargani (metodist 2026-08-05: sahnani 1-10 dan olib, elementlarini o'zgartirib unikal qil):
//   deraza KUNDUZGI (osmon, quyosh, bulut — 13-14-dars palitrasi), deraza ortida bog'
//   terrasalari (9-dars elementi), markaziy panel «vazifa» (8 · ×3 · ?), minoralar o'rniga
//   IKKI GULZOR: chapda bitta polosa (8 o'simlik), o'ngda uch barobar.
const D16_BED_A = [0, 1, 2, 3, 4, 5, 6, 7];
const TaskHallBg = () => (
  <svg className="lm-scene-bg" viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="d16wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ECDBC4"/><stop offset="100%" stopColor="#DBC3A2"/></linearGradient>
      <linearGradient id="d16sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#BCE4F7"/><stop offset="58%" stopColor="#E4F3FB"/><stop offset="100%" stopColor="#F6EFD6"/></linearGradient>
      <linearGradient id="d16floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#D9C29D"/><stop offset="100%" stopColor="#BBA078"/></linearGradient>
      <linearGradient id="d16panel" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#20344C"/><stop offset="100%" stopColor="#0E1B2C"/></linearGradient>
      <linearGradient id="d16soil" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#A87E5C"/><stop offset="100%" stopColor="#7C5A3E"/></linearGradient>
      <radialGradient id="d16sun" cx="50%" cy="50%" r="55%"><stop offset="0%" stopColor="#FFF8DC"/><stop offset="52%" stopColor="#FFE49A" stopOpacity="0.9"/><stop offset="100%" stopColor="#FFD36A" stopOpacity="0"/></radialGradient>
      <radialGradient id="d16lamp" cx="50%" cy="20%" r="80%"><stop offset="0%" stopColor="#FFF0C4"/><stop offset="100%" stopColor="#FFE39A" stopOpacity="0"/></radialGradient>
      <clipPath id="d16winClip"><rect x="46" y="32" width="308" height="62" rx="4"/></clipPath>
    </defs>
    {/* zal devori va shift chiroqlari (4-dars karkasi) */}
    <rect x="0" y="0" width="400" height="180" fill="url(#d16wall)"/>
    <rect x="0" y="0" width="400" height="22" fill="#D2B892"/><rect x="0" y="21" width="400" height="3" fill="#B4976F"/>
    {[90, 200, 310].map((cx, i) => (
      <g key={`lm${i}`}>
        <rect x={cx - 18} y="4" width="36" height="6" rx="3" fill="#FFEBB0"/>
        <polygon points={`${cx - 20},11 ${cx + 20},11 ${cx + 46},96 ${cx - 46},96`} fill="url(#d16lamp)" opacity="0.28"/>
        <ellipse className="lm-glow" style={{ animationDelay: `${i * 0.7}s` }} cx={cx} cy="12" rx="14" ry="4" fill="#FFF0C4" opacity="0.5"/>
      </g>
    ))}
    {/* DERAZA: kunduzgi osmon va bog' terrasalari */}
    <rect x="42" y="28" width="316" height="70" rx="7" fill="#0D1928"/>
    <rect x="46" y="32" width="308" height="62" rx="4" fill="url(#d16sky)"/>
    <g clipPath="url(#d16winClip)">
      <circle cx="96" cy="48" r="22" fill="url(#d16sun)"/><circle cx="96" cy="48" r="8" fill="#FFF3C4"/>
      <g fill="#FFFFFF" opacity="0.9">
        <ellipse cx="212" cy="44" rx="18" ry="6"/><ellipse cx="226" cy="41" rx="12" ry="4.6"/>
        <ellipse cx="300" cy="40" rx="14" ry="5"/>
      </g>
      {/* bog' terrasalari: nurli o'simlik qatorlari (9-dars elementi) */}
      <rect x="46" y="74" width="308" height="20" fill="#CCE8B8"/>
      {[58, 96, 134, 172, 210, 248, 286, 324].map((x, i) => (
        <g key={`pl${i}`} transform={`translate(${x} 88)`}>
          <path d="M0 0 Q-2 -8 0 -13" stroke="#6FBF8E" strokeWidth="1.8" fill="none"/>
          <circle className="lm-glow" style={{ animationDelay: `${(i % 4) * 0.5}s` }} cx="0" cy="-15" r="3" fill="#FFD98A"/>
        </g>
      ))}
    </g>
    <g fill="none" stroke="#C9B79A" strokeWidth="3"><rect x="42" y="28" width="316" height="70" rx="7"/></g>
    <g stroke="#C9B79A" strokeWidth="2.4" opacity="0.9"><path d="M148 32 V94"/><path d="M256 32 V94"/></g>
    <rect x="42" y="95" width="316" height="5" rx="2" fill="#B4976F"/>
    {/* MARKAZIY PANEL: bugungi vazifa merkasi */}
    <rect x="104" y="104" width="192" height="46" rx="7" fill="url(#d16panel)" stroke="#3E6E90" strokeWidth="1.6"/>
    <rect x="110" y="108" width="180" height="10" rx="3" fill="#122236"/>
    <text x="200" y="115.5" textAnchor="middle" fontSize="6.6" letterSpacing="1.4" fill="#7FB8D8" fontFamily="'JetBrains Mono', monospace">VAZIFA</text>
    <text x="146" y="142" textAnchor="middle" fontSize="19" fontWeight="800" fill="#8FE6C0" fontFamily="'JetBrains Mono', monospace">8</text>
    <text x="200" y="142" textAnchor="middle" fontSize="19" fontWeight="800" fill="#FFD86E" fontFamily="'JetBrains Mono', monospace">×3</text>
    <text x="254" y="142" textAnchor="middle" fontSize="19" fontWeight="800" fill="#F2A85C" fontFamily="'JetBrains Mono', monospace">?</text>
    {/* CHAP GULZOR: bitta polosa, 8 o'simlik */}
    <g transform="translate(24 116)">
      <rect x="0" y="14" width="52" height="9" rx="3" fill="url(#d16soil)"/>
      {D16_BED_A.map((i) => (
        <g key={`ba${i}`} transform={`translate(${4 + i * 6.2} 14)`}>
          <path d="M0 0 Q-1 -6 0 -10" stroke="#6FBF8E" strokeWidth="1.5" fill="none"/>
          <circle className="lm-glow" style={{ animationDelay: `${(i % 3) * 0.4}s` }} cx="0" cy="-12" r="2.6" fill="#FFD98A"/>
        </g>
      ))}
    </g>
    {/* O'NG UCHASTKA: uch xuddi shunday polosa */}
    <g transform="translate(320 104)">
      {[0, 1, 2].map((r) => (
        <g key={`bb${r}`} transform={`translate(0 ${r * 13})`}>
          <rect x="0" y="14" width="52" height="8" rx="3" fill="url(#d16soil)"/>
          {D16_BED_A.map((i) => (
            <g key={`bp${r}${i}`} transform={`translate(${4 + i * 6.2} 14)`}>
              <path d="M0 0 Q-1 -5 0 -8" stroke="#6FBF8E" strokeWidth="1.3" fill="none"/>
              <circle className="lm-glow" style={{ animationDelay: `${((r + i) % 4) * 0.35}s` }} cx="0" cy="-10" r="2.2" fill="#FFD98A"/>
            </g>
          ))}
        </g>
      ))}
    </g>
    {/* pol */}
    <rect x="0" y="176" width="400" height="54" fill="url(#d16floor)"/>
    <line x1="0" y1="176" x2="400" y2="176" stroke="#9A8058" strokeWidth="2"/>
    <g stroke="#A98C64" strokeWidth="1" opacity="0.4"><path d="M20 230 L176 178"/><path d="M120 230 L192 178"/><path d="M280 230 L208 178"/><path d="M380 230 L224 178"/></g>
    <g transform="translate(16 176)"><path d="M0 0 Q-3 -16 0 -24" stroke="#7CB69E" strokeWidth="2.6" fill="none"/><circle className="lm-glow" cx="0" cy="-27" r="5" fill="#A6E0C6"/><path d="M-1 -14 q-8 -3 -11 -10 q9 1 12 8Z" fill="#8FD8B8"/></g>
    <g transform="translate(388 176)"><path d="M0 0 Q-2 -10 0 -15" stroke="#7CB69E" strokeWidth="2.2" fill="none"/><circle className="lm-glow" cx="0" cy="-17" r="3.6" fill="#A6E0C6"/></g>
  </svg>
);

// Sahna + ekipaj (donor naqshi, faqat fon boshqa).
const TaskScene = ({ gathered = false }) => {
  const kid = ({ key, El, hook }, i) => (
    <span key={key} className="lm-crew lm-crew-kid g1-pop-in" style={{ animationDelay: `${0.25 + i * 0.12}s` }}>
      <El {...(gathered ? { mood: 'happy', pose: 'happy' } : hook)}/>
    </span>
  );
  return (
    <div className="lm-scene">
      <TaskHallBg/>
      <div className="lm-scene-cast">
        {LUMO_CAST.slice(0, 2).map(kid)}
        <span className={`lm-crew lm-crew-host ${gathered ? 'd2-bit-cheer' : 'lm-bob'}`}><span className="g1-cast-fig"><BitSVG state={gathered ? 'happy' : 'present'}/></span></span>
        {LUMO_CAST.slice(2).map((c, i) => kid(c, i + 2))}
      </div>
    </div>
  );
};


const NumPad = ({ value, setValue, disabled, max = 2, state = null }) => {
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
  const [score, setScore] = useState(props.storedAnswer ? (props.storedAnswer.studentAnswer | 0) : 0);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const firstAllRef = useRef(props.storedAnswer ? props.storedAnswer.firstTry : true);
  const it = items[Math.min(idx, items.length - 1)];
  const done = idx >= items.length;
  const revealRef = useRevealScroll(done, 400);
  // Savol matnida belgi (56 : 7), OVOZDA esa so'z bilan — KONTENT_3SINF.md «Ovoz variantlari».
  useEffect(() => {
    if (done || audio.muted || !it || !it.q_speech) return;
    const e = getAudioEngine(); if (e) e.pushOneOff(it.q_speech[lang]);
  }, [idx]);
  const [okPick, setOkPick] = useState(props.storedAnswer && items.length ? items[items.length - 1].ci : null);   // to'g'ri variant YASHIL yonadi (metodist 2026-08-04)
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
            <Reaction state="correct" praise={lang === 'ru' ? `Верно: ${score} из ${items.length}` : `To'g'ri: ${items.length} tadan ${score} ta`}/>
          </div>
        )}
      </div>
    </Stage>
  );
};



// ============================================================
// DARS12 EKRANLARI (15). Donor: Dars10 (barcha yangi naqshlar bilan).
// YANGI: PathRow/SplitArray (yo'lak kesish) va ColumnMulDemo (ustun 23x4, o'tkazish).
// ============================================================



// --- 5 soniyalik o'ylash SOATI (Dars01/11 naqshi).
const CountdownClock = ({ n, total = 5, lang }) => {
  const R = 34, C = 2 * Math.PI * R;
  const frac = Math.max(0, n) / total;
  return (
    <div className="lm-clock fade-up">
      <svg viewBox="0 0 80 80" style={{ width: 'clamp(78px, 20vw, 96px)', height: 'auto' }} aria-hidden="true">
        <circle cx="40" cy="40" r={R} fill="none" stroke="#E6E1D6" strokeWidth="7"/>
        <circle cx="40" cy="40" r={R} fill="none" stroke="#FF4F28" strokeWidth="7" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={C * (1 - frac)} transform="rotate(-90 40 40)" style={{ transition: 'stroke-dashoffset 1s linear' }}/>
        <text x="40" y="40" textAnchor="middle" dominantBaseline="central" fontSize="30" fontWeight="800" fill="#3A3530" fontFamily="'JetBrains Mono', monospace">{Math.max(0, n)}</text>
      </svg>
      <span className="lm-clock-cap mono">{lang === 'ru' ? 'Подумай…' : "O'ylab ko'ring…"}</span>
    </div>
  );
};


// ============================================================
// DARS14 EKRANLARI (15). Donor: Dars12 (bog' sahnasi, yashil javob, FactCard freym ostida,
// orbital anim, TAP bilan ochilish, NumPad, MCRoundD2).
// YANGI: OrderBoard (buyurtma taxtasi), BasketFig (savat + lampalar), FoldRow (ifoda
//   SVYORTKASI: juftlik yonadi -> bitta plashkaga aylanadi -> yozuv qisqaradi),
//   ColumnCalc (ustun: × , + va − uchun bitta komponent; belgi sonlar orasida, 5-sinf
//   naqshi: monoshrift, ch birligi, zaxira raqami xona ustida).
// ============================================================

// --- KONSOL YACHEYKASI (1-darsdan ko'chirilgan `.lm-cons*` uslubi, metodist tanlovi):
// merka (bir qatorda N lampa) + bejd (`×3` yoki `+3`) + natija. Step tugmalari YO'Q.
// `label` berilsa, merka o'rniga SON ko'rsatiladi (katta sonlarni lampalar bilan chizish
// noqulay: 42 lampa o'qilmaydi). Aks holda `n` ta lampali merka qatori chiziladi.
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
      <span className="lm-cons-x mono">{badge}</span>
    </div>
    {val !== null && val !== undefined ? <div className="lm-cons-val mono lm-reveal">{val}</div> : <div className="lm-cons-val mono" style={{ color: '#C4BEB4' }}>?</div>}
  </div>
);





// --- FACTCARD QAHRAMONI: chumoli o'zidan ellik marta og'ir yukni ko'taradi.
const AntFig = () => (
  <svg viewBox="0 0 200 120" style={{ width: 'min(280px, 86%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <defs>
      <linearGradient id="d16ant" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8A5A3C"/><stop offset="100%" stopColor="#5E3A24"/></linearGradient>
      <linearGradient id="d16load" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F2CB9E"/><stop offset="100%" stopColor="#DCA265"/></linearGradient>
    </defs>
    {/* yer chizig'i */}
    <rect x="18" y="102" width="164" height="4" rx="2" fill="#D9C29D"/>
    {/* ko'tarilgan yuk */}
    <g className="d16-load">
      <rect x="76" y="16" width="48" height="34" rx="5" fill="url(#d16load)" stroke="#B8834A" strokeWidth="1.6"/>
      <path d="M76 28 h48" stroke="#B8834A" strokeWidth="1.2" opacity="0.7"/>
      <path d="M100 16 v34" stroke="#B8834A" strokeWidth="1.2" opacity="0.7"/>
    </g>
    {/* chumoli */}
    <g transform="translate(100 74)">
      <ellipse cx="18" cy="4" rx="16" ry="12" fill="url(#d16ant)"/>
      <ellipse cx="0" cy="0" rx="9" ry="8" fill="#6B4529"/>
      <ellipse cx="-16" cy="-4" rx="10" ry="9" fill="url(#d16ant)"/>
      <circle cx="-19" cy="-6" r="1.9" fill="#FFF3C4"/>
      <path d="M-22 -12 q-6 -8 -12 -10" stroke="#5E3A24" strokeWidth="2" fill="none"/>
      <path d="M-18 -13 q-3 -9 -1 -14" stroke="#5E3A24" strokeWidth="2" fill="none"/>
      <g stroke="#5E3A24" strokeWidth="2.4" fill="none">
        <path d="M-6 6 q-6 10 -14 14"/><path d="M4 8 q-2 12 -8 18"/><path d="M14 8 q4 12 12 16"/>
      </g>
      {/* yukni ushlab turgan oldingi oyoqlar */}
      <g stroke="#5E3A24" strokeWidth="2.4" fill="none"><path d="M-8 -8 q-4 -14 6 -20"/><path d="M2 -8 q4 -14 14 -18"/></g>
    </g>
  </svg>
);

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
        {/* ETALON (Dars01 s0): xuk ekranida sahna — bola avval joyni ko'radi */}
        <div className="frame fade-up delay-1 d16-hook-scene" style={{ padding: 'clamp(8px, 1.8vw, 14px)', overflow: 'hidden' }}>
          <TaskScene gathered={ok}/>
        </div>
        {picked === null && (
          <div className="frame fade-up delay-1 d16-bedrow" style={{ padding: 'clamp(6px, 1.2vw, 9px)' }}>
            <span className="d16-bedbox">
              <span className="d16-row">
                {Array.from({ length: 8 }).map((_, i) => <span key={i} className="d16-row-lamp"><Chiroq/></span>)}
              </span>
              <span className="d16-bedcap">{t(c.bed_a_cap)}</span>
            </span>
            <span className="d16-bedbox">
              <span className="d16-cover mono">?</span>
              <span className="d16-bedcap">{t(c.bed_b_cap)}</span>
            </span>
          </div>
        )}
        <p className="fade-up delay-1" style={{ textAlign: 'center', color: T.ink2, fontWeight: 600, fontSize: 'clamp(13px, 1.8vw, 16px)', margin: 0 }}>{t(c.q)}</p>
        {picked === null && (
          <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
            {order.map((k, i) => (
              <button key={i} className="option" disabled={!canAct} onClick={() => pick(i)}
                style={{ padding: 'clamp(9px, 1.4vw, 12px)', fontSize: 'clamp(15px, 2.4vw, 20px)', minHeight: 'clamp(44px, 6.2vw, 54px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>
                {t(opts[k])}
              </button>
            ))}
          </div>
        )}
        {picked !== null && (
          <div className="fade-up" style={{ display: 'flex', justifyContent: 'center' }}>
            <button className={`option ${ok ? 'option-correct' : 'option-picked-wrong'}`} disabled
              style={{ padding: 'clamp(10px, 1.5vw, 12px) clamp(16px, 2.4vw, 22px)', fontSize: 'clamp(15px, 2.4vw, 20px)', minHeight: 'clamp(44px, 6.2vw, 54px)', width: 'auto', display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>
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

// s1 — KO'PRIK: ikki tayyor yozuv BITTALAB ochiladi
const Screen1 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s1;
  const audio = useAudio([
    brgSeg('s1', lang),
    { id: 's1_0', text: c.audio[lang][0], trigger: 'after_previous', waits_for: null },
    { id: 's1_1', text: c.audio[lang][1], trigger: 'on_event:card1', waits_for: null },
    { id: 's1_2', text: c.audio[lang][2], trigger: 'on_event:card2', waits_for: null },
    { id: 's1_3', text: c.audio[lang][3], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [opened, setOpened] = useState(0);
  const done = opened >= 2;
  const open = (i) => {
    if (!canAct || i !== opened) return;
    setOpened(i + 1); sfx.playCorrect();
    audio.triggerInternal(`card${i + 1}`);
  };
  const revealRef = useRevealScroll(done, 400);
  const canAdv = useAdvanceGate(done, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  const cards = [{ v: c.card1, cap: c.card1_cap }, { v: c.card2, cap: c.card2_cap }];
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <p className="fade-up delay-1" style={{ margin: 0, textAlign: 'center', color: T.ink2, fontWeight: 700, fontSize: 'clamp(12px, 1.7vw, 14px)' }}>{t(c.tap_label)}</p>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 'clamp(8px, 2vw, 14px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
          <FrameFx/>
          {cards.map((cd, i) => (
            <button key={i} className={`d12-card ${opened > i ? 'd12-card-on' : ''}`} disabled={!canAct || opened !== i} onClick={() => open(i)}>
              {opened > i ? (
                <>
                  <span className="mono lm-reveal" style={{ fontSize: 'clamp(17px, 3.2vw, 24px)', fontWeight: 800, color: '#1F7A4D' }}>{t(cd.v)}</span>
                  <span style={{ fontSize: 'clamp(10px, 1.5vw, 12px)', fontWeight: 700, color: T.ink2 }}>{t(cd.cap)}</span>
                </>
              ) : (
                <span className="mono" style={{ fontSize: 'clamp(22px, 4.4vw, 30px)', fontWeight: 800, color: T.ink3 }}>?</span>
              )}
            </button>
          ))}
        </div>
        {done && (
          <div ref={revealRef} className="frame-success fade-up">
            <Reaction state="correct" praise={c.audio[lang][3]}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s2 — IKKI KONSOL: «uch marta ko'p» va «uchta ko'p» (1-dars konsoli, TAP bilan)
const Screen2 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s2;
  const audio = useAudio([
    brgSeg('s2', lang),
    { id: 's2_0', text: c.audio[lang][0], trigger: 'after_previous', waits_for: null },
    { id: 's2_1', text: c.audio[lang][1], trigger: 'on_event:step1', waits_for: null },
    { id: 's2_2', text: c.audio[lang][2], trigger: 'on_event:step2', waits_for: null },
    { id: 's2_3', text: c.audio[lang][3], trigger: 'after_previous', waits_for: null }
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.8vw, 12px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(8px, 1.8vw, 12px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
          <FrameFx/>
          <div className="lm-console d16-console2">
            <MeasureCell head={t(c.cap_mul)} n={c.row_n} badge={c.mul_badge} val={step >= 1 ? c.mul_val : null} lit={step >= 1}/>
            <MeasureCell head={t(c.cap_add)} n={c.row_n} badge={c.add_badge} val={step >= 2 ? c.add_val : null} lit={step >= 2}/>
          </div>
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

// s3 — DARSLIK JADVALI (26-bet): uch ustun, shapka tepada; ikkinchi tapda masala teskari
const Screen3 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s3;
  const audio = useAudio([
    brgSeg('s3', lang),
    { id: 's3_0', text: c.audio[lang][0], trigger: 'after_previous', waits_for: null },
    { id: 's3_1', text: c.audio[lang][1], trigger: 'on_event:step1', waits_for: null },
    { id: 's3_2', text: c.audio[lang][2], trigger: 'on_event:step2', waits_for: null },
    { id: 's3_3', text: c.audio[lang][3], trigger: 'after_previous', waits_for: null }
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
  const heads = [t(c.h1), t(c.h2), t(c.h3)];
  const cells = step >= 2 ? [String(c.a), '?', String(c.total)] : [String(c.a), String(c.b), step >= 1 ? String(c.total) : '?'];
  const hot = step >= 2 ? 1 : (step >= 1 ? 2 : -1);
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.8vw, 12px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(8px, 1.8vw, 12px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
          <FrameFx/>
          <TaskTable heads={heads} cells={cells} hot={hot}/>
          {step >= 1 && <span className="mono d16-expr lm-reveal">{step >= 2 ? c.expr_div : c.expr_mul}</span>}
          {step >= 1 && <span className="d16-note lm-reveal">{t(step >= 2 ? c.note_div : c.note_mul)}</span>}
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

// s4 — SAVOL-OLDIN-QOIDA
const Screen4 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s4;
  const audio = useAudio([
    brgSeg('s4', lang),
    { id: 's4_0', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
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
          {/* Metodist qoidasi 1: variantlar AYNAN 2x2 setkada */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(120px, 1fr))', gap: 10 }}>
            {order.map((k, i) => (
              <button key={i} className={`option ${solved && i === ci ? 'option-correct' : ''} ${wrongSet.has(i) ? 'option-picked-wrong' : ''}`}
                disabled={!canAct || solved || wrongSet.has(i)} onClick={() => pick(i)}
                style={{ padding: 'clamp(10px, 1.6vw, 13px)', minHeight: 'clamp(44px, 6.2vw, 54px)', fontSize: 'clamp(13px, 1.9vw, 16px)', fontWeight: 800, textAlign: 'center' }}>
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

// s5 — BIT TUZOG'I (M1: «marta ko'p» ni «ta ko'p» deb o'qish)
const Screen5 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s5;
  const audio = useAudio([
    brgSeg('s5', lang),
    { id: 's5_0', text: c.audio[lang][0], trigger: 'after_previous', waits_for: null },
    { id: 's5_1', text: c.audio[lang][1], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [trapPick, setTrapPick] = useState(null);
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const solved = trapPick === c.trap_ci;
  const pickTrap = (i) => {
    if (!canAct || solved || wrongSet.has(i)) return;
    if (i === c.trap_ci) {
      setTrapPick(i); sfx.playCorrect();
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.trap_correct[lang]); }
    } else {
      const n = new Set(wrongSet); n.add(i); setWrongSet(n);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.trap_wrong[lang]); }
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
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(8px, 1.8vw, 12px)', padding: 'clamp(14px, 2.6vw, 20px)' }}>
          <FrameFx/>
          <span className="d16-note">{t(c.line_cap)}</span>
          {c.lines.map((l, i) => (
            <span key={i} className="mono lm-reveal" style={{ animationDelay: `${i * 0.25}s`, fontSize: `clamp(${i === 1 ? 19 : 16}px, ${i === 1 ? 3.8 : 3}vw, ${i === 1 ? 28 : 22}px)`, fontWeight: 800, color: i === 1 ? '#C0392B' : T.ink }}>{l}</span>
          ))}
          <p className="fade-up" style={{ margin: 0, textAlign: 'center', color: T.ink2, fontWeight: 700 }}>{t(c.trap_label)}</p>
          <div style={{ display: 'flex', gap: 10 }}>
            {c.trap_opts[lang].map((o, i) => (
              <button key={i} className={`option ${solved && i === c.trap_ci ? 'option-correct' : ''} ${wrongSet.has(i) ? 'option-picked-wrong' : ''}`}
                disabled={!canAct || solved || wrongSet.has(i)} onClick={() => pickTrap(i)}
                style={{ padding: 'clamp(10px, 1.6vw, 13px) clamp(16px, 2.4vw, 22px)', fontSize: 'clamp(14px, 2.2vw, 18px)', minHeight: 'clamp(44px, 6.2vw, 54px)', fontWeight: 800 }}>{o}</button>
            ))}
          </div>
        </div>
        {solved && (
          <div ref={revealRef} className="frame-success fade-up">
            <Reaction state="correct" praise={t(c.trap_correct)}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s6 — «MARTA KAM»: ikki panel (2 tap) + savol
const Screen6 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s6;
  const audio = useAudio([
    brgSeg('s6', lang),
    { id: 's6_0', text: c.audio[lang][0], trigger: 'after_previous', waits_for: null },
    { id: 's6_1', text: c.audio[lang][1], trigger: 'on_event:step1', waits_for: null },
    { id: 's6_2', text: c.audio[lang][2], trigger: 'on_event:step2', waits_for: null },
    { id: 's6_3', text: c.audio[lang][3], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const { step, done: built, advance } = useTapSteps(audio, 3);
  const tap = () => { if (!canAct || built) return; sfx.playCorrect(); advance(); };
  const orderMC = React.useMemo(() => shuffleArr(c.mc_opts.map((_, i) => i)), []);
  const mcCi = orderMC.indexOf(c.mc_ci);
  const [picked, setPicked] = useState(null);
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const [hintMsg, setHintMsg] = useState(null);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const firstRef = useRef(true);
  const solved = picked === mcCi || props.storedAnswer?.correct === true;
  useEffect(() => {
    if (!built || audio.muted || !c.mc_q_speech) return;
    const e = getAudioEngine(); if (e) e.pushOneOff(c.mc_q_speech[lang]);
  }, [built]);
  const pick = (i) => {
    if (!canAct || solved || wrongSet.has(i)) return;
    if (i === mcCi) {
      setPicked(i); sfx.playCorrect(); setHintMsg(null);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.mc_ok[lang]); }
    } else {
      const n = new Set(wrongSet); n.add(i); setWrongSet(n);
      firstRef.current = false;
      const h = c.mc_hints[orderMC[i]];
      setHintMsg(h || null);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((h || c.mc_hints[1])[lang]); }
    }
  };
  useEffect(() => {
    if (solved && !recorded) {
      setRecorded(true);
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: t(c.mc_q),
        correctAnswer: c.mc_opts[c.mc_ci][lang], studentAnswer: c.mc_opts[c.mc_ci][lang], correct: firstRef.current,
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
  const panel = (title, lines, cap, shown, tone) => (
    <div className={`d15-pan ${shown ? 'd15-pan-on' : ''}`}>
      <span className="mono d15-pan-title">{t(title)}</span>
      {lines.map((l, i) => (i === 0 || shown) && (
        <span key={i} className={`mono d15-pan-line ${i === 2 ? 'd15-pan-res' : ''} ${i > 0 ? 'lm-reveal' : ''}`}
          style={{ animationDelay: `${i * 0.2}s`, color: i === 2 ? (tone === 'a' ? '#1F7A4D' : '#2E5AA8') : T.ink }}>{l}</span>
      ))}
      {shown && <span className="d15-pan-cap lm-reveal" style={{ animationDelay: '0.5s' }}>{t(cap)}</span>}
    </div>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.8vw, 12px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(8px, 1.8vw, 12px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
          <FrameFx/>
          <div className="d15-panrow">
            {panel(c.left_title, c.left_lines, c.left_cap, step >= 1, 'a')}
            {panel(c.right_title, c.right_lines, c.right_cap, step >= 2, 'b')}
          </div>
          {!built && (
            <button className="btn-white-accent" disabled={!canAct} onClick={tap}
              style={{ fontSize: 'clamp(13px, 2.1vw, 16px)' }}>{t(step === 0 ? c.btn1 : c.btn2)}</button>
          )}
        </div>
        {built && (
          <div className="frame fade-up" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10, padding: 'clamp(12px, 2.4vw, 18px)' }}>
            <FrameFx/>
            <p className="fade-up" style={{ margin: 0, textAlign: 'center', color: T.ink2, fontWeight: 700, fontSize: 'clamp(13px, 1.9vw, 16px)' }}>{t(c.mc_q)}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(110px, 1fr))', gap: 10 }}>
              {orderMC.map((k, i) => (
                <button key={i} className={`option ${solved && i === mcCi ? 'option-correct' : ''} ${wrongSet.has(i) ? 'option-picked-wrong' : ''}`}
                  disabled={!canAct || solved || wrongSet.has(i)} onClick={() => pick(i)}
                  style={{ padding: 'clamp(9px, 1.5vw, 12px)', fontSize: 'clamp(16px, 2.6vw, 21px)', minHeight: 'clamp(42px, 6vw, 52px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>{t(c.mc_opts[k])}</button>
              ))}
            </div>
            {hintMsg && !solved && <p className="fade-up" style={{ margin: 0, color: T.ink2, textAlign: 'center', fontSize: 'clamp(12px, 1.7vw, 14px)' }}>{t(hintMsg)}</p>}
          </div>
        )}
        {solved && (
          <div ref={revealRef} className="frame-success fade-up">
            <Reaction state="correct" praise={t(c.mc_ok)}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s7 — 5 SONIYA SOAT: variantlar YOZUV ko'rinishida
const Screen7 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s7;
  const it0 = c.items[0];
  const items = React.useMemo(() => {
    const order = shuffleArr(it0.opts.map((_, i) => i));
    return { opts: order.map((i) => it0.opts[i]), hints: order.map((i) => it0.hints[i]), ci: order.indexOf(it0.ci) };
  }, []);
  const audio = useAudio([
    brgSeg('s7', lang),
    { id: 's7_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [clock, setClock] = useState(5);
  const [clockDone, setClockDone] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setClock((n) => {
      if (n <= 1) { clearInterval(id); setClockDone(true); return 0; }
      return n - 1;
    }), 1000);
    return () => clearInterval(id);
  }, []);
  const [picked, setPicked] = useState(null);
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const [hintMsg, setHintMsg] = useState(null);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const firstRef = useRef(true);
  const solved = picked === items.ci || props.storedAnswer?.correct === true;
  const pick = (i) => {
    if (!canAct || !clockDone || solved || wrongSet.has(i)) return;
    if (i === items.ci) {
      setPicked(i); sfx.playCorrect(); setHintMsg(null);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_correct[lang]); }
    } else {
      const n = new Set(wrongSet); n.add(i); setWrongSet(n);
      firstRef.current = false;
      const h = items.hints[i];
      setHintMsg(h || null);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((h || c.audio.on_wrong)[lang]); }
    }
  };
  useEffect(() => {
    if (solved && !recorded) {
      setRecorded(true);
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: t(c.setup),
        correctAnswer: '9 × 2', studentAnswer: '9 × 2', correct: firstRef.current,
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
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(10px, 2vw, 14px)', padding: 'clamp(14px, 2.6vw, 20px)', minHeight: 'clamp(150px, 30vw, 190px)', justifyContent: 'center' }}>
          <FrameFx/>
          <p className="d16-setup">{t(c.setup)}</p>
          {!clockDone && <CountdownClock n={clock} lang={lang}/>}
          {clockDone && (
            <>
              <div className="lm-reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(100px, 1fr))', gap: 10, width: '100%' }}>
                {items.opts.map((o, i) => (
                  <button key={i} className={`option ${solved && i === items.ci ? 'option-correct' : ''} ${wrongSet.has(i) ? 'option-picked-wrong' : ''}`}
                    disabled={!canAct || solved || wrongSet.has(i)} onClick={() => pick(i)}
                    style={{ padding: 'clamp(10px, 1.6vw, 13px)', fontSize: 'clamp(17px, 2.8vw, 22px)', minHeight: 'clamp(46px, 6.5vw, 56px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>{t(o)}</button>
                ))}
              </div>
              {hintMsg && !solved && <p className="fade-up" style={{ margin: 0, color: T.ink2, textAlign: 'center', fontSize: 'clamp(12px, 1.7vw, 14px)' }}>{t(hintMsg)}</p>}
            </>
          )}
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

// --- IKKI MERKA-POLOSA (s8 vizuali): katta va kichik son yonma-yon
const RatioBars = ({ big, small }) => (
  <span className="d16-bars">
    <span className="d16-bar" style={{ width: '100%' }}><span className="mono">{big}</span></span>
    <span className="d16-bar d16-bar-small" style={{ width: `${Math.max(14, Math.round((small / big) * 100))}%` }}><span className="mono">{small}</span></span>
  </span>
);

// s8 — «NECHA MARTA KO'P» ×3
const Screen8 = (props) => {
  const t = useT();
  const heading = (it) => t(it.q);
  const renderFig = (it) => <RatioBars big={it.big} small={it.small}/>;
  return <MCRoundD2 props={props} ck="s8" cols={2} heading={heading} renderFig={renderFig}/>;
};

// s9 — TEST MC ×3 (uch qolip aralash)
const Screen9 = (props) => {
  const t = useT();
  const heading = (it) => t(it.q);
  // Har savolda figura MASALA SHARTINI ko'rsatadi: merka va bejd (marta ko'p), son va bejd
  // (marta kam) yoki ikki polosa (necha marta ko'p). Ma'nosiz belgi qatori EMAS.
  const renderFig = (it) => {
    const f = it.fig;
    if (!f) return null;   // rasm yo'q: faqat savol va to'rt variant
    if (f.kind === 'bars') return <RatioBars big={f.big} small={f.small}/>;
    if (f.kind === 'plate') return <div className="lm-console d16-console1"><MeasureCell label={f.label} badge={f.badge} val={null}/></div>;
    return <div className="lm-console d16-console1"><MeasureCell n={f.n} badge={f.badge} val={null}/></div>;
  };
  return <MCRoundD2 props={props} ck="s9" cols={2} heading={heading} renderFig={renderFig}/>;
};

// s10 — BONUS: tarkibli masala (TAP) + XATONI TOP (13-dars vidjeti)
const Screen10 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s10;
  const audio = useAudio([
    brgSeg('s10', lang),
    ...c.audio[lang].map((text, i) => ({
      id: `s10_${i}`,
      text,
      trigger: i === 0 ? 'after_previous' : (i === 4 ? 'after_previous' : `on_event:step${i}`),
      waits_for: null
    }))
  ]);
  const canAct = useCanAnswer(audio);
  const { step, done: built, advance } = useTapSteps(audio, 4);
  const tap = () => { if (!canAct || built) return; sfx.playCorrect(); advance(); };
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const [foundWrong, setFoundWrong] = useState(props.storedAnswer?.correct !== undefined);
  const [hintMsg, setHintMsg] = useState(null);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const firstRef = useRef(true);
  const pickStmt = (i) => {
    if (!canAct || foundWrong || wrongSet.has(i)) return;
    if (i === c.wrong) {
      setFoundWrong(true); sfx.playCorrect(); setHintMsg(c.wrong_hint);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.wrong_hint[lang]); }
    } else {
      const n = new Set(wrongSet); n.add(i); setWrongSet(n);
      firstRef.current = false;
      setHintMsg(c.other_hint);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.other_hint[lang]); }
    }
  };
  useEffect(() => {
    if (foundWrong && !recorded) {
      setRecorded(true);
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: 'find-error',
        correctAnswer: c.stmts[c.wrong], studentAnswer: c.stmts[c.wrong], correct: firstRef.current,
        firstTry: firstRef.current, attempts: 1, solved: true
      });
    }
  }, [foundWrong]);
  const revealRef = useRevealScroll(foundWrong, 500);
  const canAdv = useAdvanceGate(foundWrong, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  const btnLabel = step === 0 ? c.btn1 : (step === 1 ? c.btn2 : c.btn3);
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.6vw, 11px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(5px, 1.2vw, 8px)', padding: 'clamp(10px, 2vw, 15px)' }}>
          <FrameFx/>
          <p className="d16-setup">{t(c.task)}</p>
          {step >= 1 && (
            <span className="d16-steprow lm-reveal">
              <span className="mono d16-expr">{c.step1}</span>
              <span className="d16-note">{t(c.step1_cap)}</span>
            </span>
          )}
          {step >= 2 && (
            <span className="d16-steprow lm-reveal">
              <span className="mono d16-expr">{c.step2}</span>
              <span className="d16-note">{t(c.step2_cap)}</span>
            </span>
          )}
          {!built && (
            <button className="btn-white-accent" disabled={!canAct} onClick={tap}
              style={{ fontSize: 'clamp(12px, 1.9vw, 15px)' }}>{t(btnLabel)}</button>
          )}
        </div>
        {built && (
          <div className="frame fade-up" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 8, padding: 'clamp(10px, 2vw, 15px)' }}>
            <FrameFx/>
            <p className="fade-up" style={{ margin: 0, textAlign: 'center', color: T.ink2, fontWeight: 700, fontSize: 'clamp(12px, 1.8vw, 15px)' }}>{t(c.find_label)}</p>
            {c.stmts.map((stmt, i) => (
              <button key={i} className={`option ${wrongSet.has(i) ? 'option-picked-wrong' : ''} ${foundWrong && i === c.wrong ? 'option-correct' : ''}`}
                disabled={!canAct || foundWrong || wrongSet.has(i)} onClick={() => pickStmt(i)}
                style={{ padding: 'clamp(8px, 1.5vw, 12px)', minHeight: 'clamp(40px, 5.6vw, 50px)', fontSize: 'clamp(14px, 2.4vw, 19px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, letterSpacing: 1 }}>{stmt}</button>
            ))}
            {hintMsg && <p className="fade-up" style={{ margin: 0, color: T.ink2, textAlign: 'center', fontSize: 'clamp(12px, 1.7vw, 14px)' }}>{t(hintMsg)}</p>}
          </div>
        )}
        {foundWrong && (
          <div ref={revealRef} className="frame-success fade-up">
            <Reaction state="correct" praise={c.audio[lang][4]}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s11 — TRENAJYOR NumPad ×3 (har javobdan keyin TEKSHIRISH satri)
const Screen11 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s11;
  const audio = useAudio([
    brgSeg('s11', lang),
    { id: 's11_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [idx, setIdx] = useState(props.storedAnswer ? c.items.length : 0);
  const [val, setVal] = useState('');
  const [numLock, setNumLock] = useState(false);
  const [numState, setNumState] = useState(null);   // ekranda KO'RINADIGAN javob holati
  const [hintMsg, setHintMsg] = useState(null);
  const [showCheck, setShowCheck] = useState(props.storedAnswer !== undefined);
  const triedRef = useRef(false);
  const [score, setScore] = useState(props.storedAnswer ? (props.storedAnswer.studentAnswer | 0) : 0);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const firstAllRef = useRef(props.storedAnswer ? props.storedAnswer.firstTry : true);
  const it = c.items[Math.min(idx, c.items.length - 1)];
  const done = idx >= c.items.length;
  const revealRef = useRevealScroll(done, 400);
  useEffect(() => {
    if (done || audio.muted || !it.q_speech) return;
    const e = getAudioEngine(); if (e) e.pushOneOff(it.q_speech[lang]);
  }, [idx]);
  const check = () => {
    if (!canAct || numLock || val === '' || done) return;
    setNumLock(true);
    const isOk = parseInt(val, 10) === it.ans;
    setNumState(isOk ? 'ok' : 'bad');
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((isOk ? c.audio.on_correct : it.hint)[lang]); }
    if (isOk) {
      sfx.playCorrect();
      setShowCheck(true);
      if (!triedRef.current) setScore((s) => s + 1);
      setTimeout(() => {
        if (idx + 1 < c.items.length) { setVal(''); setShowCheck(false); }
        setNumLock(false); setHintMsg(null); triedRef.current = false; setIdx((n) => n + 1);
      }, 2100);
    } else {
      triedRef.current = true;
      firstAllRef.current = false;
      setHintMsg(it.hint);
      setTimeout(() => { setVal(''); setNumLock(false); setNumState(null); }, 1500);
    }
  };
  useEffect(() => {
    if (done && !recorded) {
      setRecorded(true);
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: 'numpad-trainer',
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
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        {it && (
          <>
            <div className="mono fade-up" style={{ textAlign: 'center', color: T.accent, fontWeight: 800 }}>{lang === 'ru' ? `Задание ${Math.min(idx + 1, c.items.length)} из ${c.items.length}` : `${Math.min(idx + 1, c.items.length)}-topshiriq, jami ${c.items.length}`}</div>
            <h1 className="title h-sub fade-up">{t(it.q)}</h1>
            <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(8px, 1.6vw, 12px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
              <FrameFx/>
              <NumPad value={done ? String(it.ans) : val} setValue={setVal} disabled={!canAct || numLock || done} max={3}/>
              <button className="btn-white-accent" disabled={!canAct || numLock || done || val === ''} onClick={check}>{lang === 'ru' ? 'Проверить' : 'Tekshir'}</button>
              {(showCheck || done) && <CheckStrip expr={it.check} cap={t(c.check_label)} ok/>}
              {hintMsg && <p className="fade-up" style={{ margin: 0, color: T.ink2, fontSize: 'clamp(12px, 1.7vw, 14px)', textAlign: 'center' }}>{t(hintMsg)}</p>}
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

// s12 — TESKARI MASALA: yozuv + javob + tekshirish
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
  const check = () => {
    if (!canAct || numLock || val === '' || solved) return;
    setNumLock(true);
    const isOk = parseInt(val, 10) === c.ans;
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((isOk ? c.audio.on_correct : c.audio.on_wrong)[lang]); }
    if (isOk) { setSolved(true); sfx.playCorrect(); setHintMsg(null); }
    else { firstRef.current = false; setHintMsg(c.audio.on_wrong); setTimeout(() => { setVal(''); setNumLock(false); setNumState(null); }, 1500); }
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(5px, 1.1vw, 9px)' }}>
        <p className="fade-up" style={{ textAlign: 'center', color: T.ink2, fontWeight: 700, margin: 0 }}>{t(c.lead)}</p>
        <h1 className="title h-sub fade-up delay-1" style={{ margin: 0 }}>{t(c.q)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(5px, 1.1vw, 9px)', padding: 'clamp(10px, 2vw, 15px)' }}>
          <FrameFx/>
          <RatioBars big={32} small={solved ? 8 : 4}/>
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
              <span className="mono lm-reveal" style={{ fontSize: 'clamp(17px, 3.2vw, 24px)', fontWeight: 800, color: '#1F7A4D' }}>{t(c.opts[c.ci])}</span>
              {!solved && (
                <>
                  <NumPad value={val} setValue={setVal} disabled={!canAct || numLock} max={3} state={numState}/>
                  <button className="btn-white-accent" disabled={!canAct || numLock || val === ''} onClick={check}>{lang === 'ru' ? 'Проверить' : 'Tekshir'}</button>
                </>
              )}
              {solved && <span className="mono d16-res lm-reveal">{c.ans}</span>}
            </>
          )}
          {solved && <CheckStrip expr={c.check} cap={t(CONTENT.s11.check_label)} ok/>}
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

// s13 — FINAL 5 savol + FactCard (freym OSTIDA)
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
                  <button className="btn-white-accent" disabled={!canAct || numLock || val === ''} onClick={checkNum}>{lang === 'ru' ? 'Проверить' : 'Tekshir'}</button>
                </div>
                {hintMsg && <p className="fade-up" style={{ margin: 0, color: T.ink2, fontSize: 'clamp(12px, 1.7vw, 14px)', textAlign: 'center' }}>{t(it.hint)}</p>}
              </>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(110px, 1fr))', gap: 10 }}>
                  {orders[idx].map((k, i) => (
                    <button key={i} className={`option ${picked === i ? 'option-correct' : wrongSet.has(i) ? 'option-picked-wrong' : ''}`} disabled={!canAct || picked !== null || wrongSet.has(i)} onClick={() => pick(i)}
                      style={{ padding: 'clamp(9px, 1.5vw, 12px)', fontSize: 'clamp(14px, 2.2vw, 18px)', minHeight: 'clamp(42px, 6vw, 52px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>
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
              <Reaction state="correct" praise={lang === 'ru' ? `Верно: ${score} из ${items.length}` : `To'g'ri: ${items.length} tadan ${score} ta`}/>
            </div>
            <div className="d2-factcard fade-up">
              <span className="d2-factcard-badge mono">{t(c.fact_badge)}</span>
              <div className="d2-fact-hero"><AntFig/></div>
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
        {/* yakuniy sahna — ETALON o'lchamida: ikki gulzor ham sug'orilgan */}
        <div className="d16-final-scene fade-up delay-1"><TaskScene gathered/></div>
      </div>
    </Stage>
  );
};

// ============================================================
// KORNEVOY KOMPONENT (shablon: infrastructure_v1 / grade1 Dars28)
// ============================================================
export default function WordProblemLesson({
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
.lm-clock { display: flex; flex-direction: column; align-items: center; gap: clamp(6px, 1.4vw, 10px); }
.lm-clock-cap { font-size: clamp(13px, 1.9vw, 16px); font-weight: 800; color: #017BA3; }
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
.d12-card { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; min-height: clamp(74px, 16vw, 96px); padding: clamp(10px, 2vw, 14px); border: none; border-radius: 16px; background: #FBF7F0; box-shadow: inset 0 0 0 1.5px rgba(58,53,48,0.09); cursor: pointer; transition: background 0.35s, box-shadow 0.35s, transform 0.15s; }
.d12-card:disabled { cursor: default; }
.d12-card:not(:disabled):active { transform: scale(0.97); }
.d12-card-on { background: #E3F0E8; box-shadow: inset 0 0 0 1.5px rgba(31,122,77,0.35); }
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
.d15-panrow { display: flex; flex-wrap: wrap; gap: clamp(8px, 2vw, 14px); width: 100%; justify-content: center; }
.d15-pan { flex: 1 1 clamp(130px, 40%, 220px); display: flex; flex-direction: column; align-items: center; gap: 3px;
  padding: clamp(8px, 1.8vw, 13px); border-radius: 12px; background: #F6F4EF; border: 2px dashed #D8D2C4; }
.d15-pan-on { background: #FFFFFF; border-style: solid; border-color: #E6D9BC; box-shadow: 0 3px 0 rgba(190,170,130,.28); }
.d15-pan-title { font-size: clamp(9.5px, 1.4vw, 11.5px); font-weight: 800; color: #5A5A60; text-transform: uppercase; letter-spacing: .5px; }
.d15-pan-line { font-size: clamp(13px, 2.3vw, 18px); font-weight: 800; }
.d15-pan-res { font-size: clamp(15px, 2.8vw, 21px); }
.d15-pan-cap { font-size: clamp(9.5px, 1.4vw, 11.5px); font-weight: 700; color: #5A5A60; text-align: center; }
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
.lm-console { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(8px, 2vw, 14px); width: 100%; max-width: 440px; }
.d16-console2 { grid-template-columns: repeat(2, 1fr); max-width: 520px; }
.d16-console1 { grid-template-columns: 1fr; max-width: 300px; margin: 0 auto; }
.d16-plate { font-size: clamp(20px, 4.4vw, 28px); font-weight: 800; color: #0E0E10; padding: 2px 10px;
  border-radius: 9px; background: rgba(255,236,200,.55); box-shadow: inset 0 0 0 1px rgba(190,150,90,.28); }
.lm-cons { display: flex; flex-direction: column; align-items: center; gap: clamp(5px, 1.2vw, 8px); padding: clamp(9px, 2vw, 14px) 4px; border-radius: 16px; background: #FBF7F0; box-shadow: inset 0 0 0 1px rgba(58,53,48,0.07); transition: box-shadow 0.28s, background 0.28s; }
.lm-cons-lit { background: #FFF6E9; box-shadow: 0 5px 16px -9px rgba(255,154,46,0.75), inset 0 0 0 1.5px rgba(255,154,46,0.5); }
.lm-cons-head { font-size: clamp(9px, 1.5vw, 11px); font-weight: 800; color: #8A8378; text-transform: uppercase; letter-spacing: 0.4px; text-align: center; }
.lm-cons-screen { display: flex; align-items: center; justify-content: center; gap: clamp(4px, 1.2vw, 8px); min-height: clamp(32px, 7vw, 44px); }
.lm-cons-x { font-size: clamp(16px, 3.4vw, 23px); font-weight: 800; color: #3A3530; display: inline-block; animation: lm-cons-pop 0.3s ease; }
.lm-cons-val { font-family: 'JetBrains Mono', monospace; font-size: clamp(16px, 3.2vw, 22px); font-weight: 800; color: #FF4F28; }
@keyframes lm-cons-pop { from { transform: scale(0.6); opacity: 0; } to { transform: none; opacity: 1; } }
/* --- MERKA: bir qatorda lampalar --- */
.d16-row { display: inline-flex; gap: clamp(1px, 0.5vw, 3px); padding: clamp(3px, 0.8vw, 5px) clamp(4px, 1vw, 6px);
  border-radius: 8px; background: rgba(255,236,200,.55); box-shadow: inset 0 0 0 1px rgba(190,150,90,.28); }
.d16-row-lamp { display: inline-flex; width: clamp(9px, 2.2vw, 14px); height: clamp(9px, 2.2vw, 14px); }
.d16-row-lamp svg { width: 100%; height: 100%; }
/* --- XUK: ikki gulzor paneli --- */
.d16-bedrow { display: flex; align-items: center; justify-content: center; gap: clamp(10px, 3vw, 26px); flex-wrap: wrap; }
.d16-bedbox { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.d16-bedcap { font-size: clamp(9.5px, 1.4vw, 11.5px); font-weight: 700; color: #5A5A60; }
.d16-cover { display: inline-flex; align-items: center; justify-content: center; min-width: clamp(70px, 18vw, 110px);
  height: clamp(20px, 5vw, 28px); border-radius: 8px; background: linear-gradient(160deg, #C9B7A0, #A9917A);
  border: 2px solid #8E7862; color: #FFF6E6; font-size: clamp(14px, 2.8vw, 19px); font-weight: 800; }
/* --- DARSLIK JADVALI (26-bet): uch ustun, shapka tepada --- */
.d16-tbl { width: 100%; max-width: 420px; border: 2px solid #C9B79A; border-radius: 10px; overflow: hidden; background: #FFFFFF; }
.d16-tbl-row { display: grid; grid-template-columns: repeat(3, 1fr); }
.d16-tbl-head { background: #F3E7CE; border-bottom: 2px solid #C9B79A; }
.d16-tbl-cell { padding: clamp(5px, 1.2vw, 8px) clamp(3px, 1vw, 6px); text-align: center; font-size: clamp(10px, 1.6vw, 12.5px);
  font-weight: 700; color: #5A5A60; border-right: 1px solid #DCCDB0; display: flex; align-items: center; justify-content: center; }
.d16-tbl-row .d16-tbl-cell:last-child { border-right: none; }
.d16-tbl-val { font-size: clamp(17px, 3.6vw, 24px); font-weight: 800; color: #0E0E10; min-height: clamp(34px, 8vw, 46px); }
.d16-tbl-hot { color: #FF4F28; background: #FFF4EF; }
/* --- MERKA-POLOSALAR (necha marta ko'p) --- */
.d16-bars { display: flex; flex-direction: column; gap: 6px; width: min(100%, 320px); }
.d16-bar { display: flex; align-items: center; justify-content: flex-end; height: clamp(22px, 5vw, 30px); padding: 0 8px;
  border-radius: 7px; background: linear-gradient(180deg, #FFD98A, #F2A85C); color: #4A3A22; font-weight: 800;
  font-size: clamp(12px, 2.2vw, 16px); box-shadow: inset 0 0 0 1px rgba(150,110,60,.28); }
.d16-bar-small { background: linear-gradient(180deg, #A6D8C2, #7CB69E); color: #23453A; }
/* --- s3, s5, s10, s12 mayda matnlar --- */
.d16-expr { font-size: clamp(15px, 3vw, 21px); font-weight: 800; color: #0E0E10; letter-spacing: 1px; }
.d16-note { font-size: clamp(9.5px, 1.5vw, 12px); font-weight: 700; color: #5A5A60; text-align: center; }
.d16-setup { margin: 0; text-align: center; font-size: clamp(12px, 1.9vw, 15px); font-weight: 700; color: #0E0E10; }
.d16-steprow { display: flex; flex-direction: column; align-items: center; gap: 1px; }
.d16-res { font-size: clamp(19px, 3.8vw, 26px); font-weight: 800; color: #1F7A4D; }
/* --- sahna o'lchami: budjet donor bilan bir xil (etalon 629x330 @1440x900) --- */
.d16-hook-scene .lm-scene { width: min(100%, calc(clamp(180px, calc(100dvh - 570px), 372px) * 400 / 210)); }
.d16-final-scene .lm-scene { width: min(100%, calc(clamp(200px, calc(100dvh - 560px), 372px) * 400 / 210)); }
/* --- FACTCARD: yuk ko'tarilishi --- */
.d16-load { animation: d16lift 3s ease-in-out infinite; transform-origin: center bottom; }
@keyframes d16lift { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
@media (prefers-reduced-motion: reduce) { .d16-load { animation: none; } }
`;
