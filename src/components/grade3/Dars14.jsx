import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { BackLabel, BitSVG, CheckStrip, Chiroq, Confetti, D2Defs, D2Motes, FREE_NAV, FeedbackBlock, FoldRow, FrameFx, GradientDefs, HeroContext, LUMO_CAST, LangContext, Lenta, NavBack, NavNext, NextLabel, Panel, ProgressContext, Reaction, ReadinessMeter, Stage, StageHero, T, configureLesson, getAudioEngine, npKey, shuffleArr, ttsConfig, useAdvanceGate, useAudio, useCanAnswer, useLang, useMobileZoom, usePrefersReducedMotion, useRevealScroll, useSfx, useT, useTapSteps, makeBrgSeg } from './_kit/index.jsx';
import { BASE_STYLES } from './_kit/styles.js';

// ============================================================================
// DD 3-SINF | Dars14 — "Komponentlar bog'lanishi" (num-3-14) | Б2 | × va : bog'lanishi
// Syujet: «Yorug' bog'» davomi — bog' chekkasidagi JO'NATISH MAYDONCHASI: relslar, ustida
//   shaffof yashikli VAGONETKA, yog'och yorliqda 40. Yashiklar mato ostida: lampa qirqta,
//   yashik nechta? Teskari yo'l (bo'lish) yashiringan sonni qaytaradi.
// Metodist 2026-08-05: sahna HAR DARSDA BOSHQA bo'lsin (12-14 da yo'lak-plita, ajratish va
//   buyurtma taxtasi edi) — shu yerda relsli yuk yo'li.
// DARSLIK ASOSI (Burxonov, 3-sinf, «Sharq» 2019): 26-bet «Bo'lish va ko'paytirishni
//   tekshirish» — «Bo'lishni tekshirish uchun bo'linma bo'luvchiga ko'paytiriladi.
//   Ko'paytirishni tekshirish uchun ko'paytma ko'paytuvchilardan biriga bo'linadi.»
//   Metodika (uzb 2022) 27-28-dars, 108-109-bet: SON UCHBURCHAGI (150/50/3) dan to'rt yozuv,
//   14 × 6 = 84 va 286 : 2 = 143 namunalari. `x` harfi darslikda bor (14-bet x × 9 = 54,
//   17-bet 20 × x = 80) — shuning uchun s10 BONUS darslikka tayanadi.
// YADRO: bitta uchlik 5, 8, 40 -> to'rt yozuv: 5 × 8 = 40, 8 × 5 = 40, 40 : 5 = 8, 40 : 8 = 5.
//   Sonlar JADVAL doirasida (Б2), darslikdagi jadvaldan tashqari sonlar Б3 ga qoladi.
// MEXANIKA: xuk (s0), ikki karta ko'prik (s1), TESKARI YO'L — vagonetka ochiladi (s2),
//   SON UCHBURCHAGI to'rt yozuv (s3), savol-oldin-QOIDA (s4), Bit tuzog'i (s5),
//   TEKSHIRISH xatoni tutadi (s6), 5s soat (s7), NumPad ×3 (s8), test MC ×3 (s9),
//   BONUS `x` harfi (s10), trenajyor + tekshirish satri (s11), masala (s12),
//   final 5 savol + FactCard (s13), yakun (s14).
// Misconception: M1 noma'lum ko'paytuvchini ko'paytirish bilan qidirish (40 × 5 = 200),
//   M2 noma'lum bo'linuvchini bo'lish bilan qidirish, M3 kichikni kattaga bo'lish,
//   M4 «bo'lishda ham o'rin almashtirsa bo'ladi» (5 : 40).
// FactCard: ko'rshapalak eholokatsiyasi — tovush borib qaytadi, butun yo'l ikkiga bo'linadi
//   (matematika + fan, dars mavzusi bilan bir xil: teskari amal).
// Infra: grade3 Dars13.jsx dan ko'chirildi (Stage, audio, NumPad, MCRoundD2, yashil javob,
//   FactCard freym ostida, orbital anim, TAP bilan ochilish). Metodist 2026-08-05: ketma-ket
//   savolli ekranlarda OXIRGI SAVOL ekranda qoladi, natija boksi `reveal-soft` bilan chiqadi.
// YANGI: CargoCart (vagonetka + shaffof yashiklar), FamilyTriangle (son uchburchagi),
//   CheckStrip (tekshirish satri), BatFig, YardBg/YardScene (jo'natish maydonchasi).
// Kontent: src/books/grade3/KONTENT_3SINF.md, «Dars 14» (tasdiq 2026-08-05).
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
  lessonId: 'num-3-14',
  lessonTitle: { ru: 'Урок 14. Связь умножения и деления', uz: "14-dars. Ko'paytirish va bo'lishning bog'lanishi" }
};
// STRUKTURA (metodist tasdig'i 2026-08-05, KONTENT_3SINF.md «Dars 14»): bitta uchlik
// 5, 8, 40 ustida qurilgan. s0 xuk (vagonetka, yorliq 40) · s1 ko'prik (ikki tayyor yozuv) ·
// s2 TESKARI YO'L (mato ochiladi, sakkiz yashik) · s3 SON UCHBURCHAGI (to'rt yozuv) ·
// s4 savol-oldin-QOIDA · s5 Bit tuzog'i (40 × 5 = 200) · s6 TEKSHIRISH xatoni tutadi ·
// s7 5s soat · s8 NumPad ×3 · s9 test ×3 · s10 BONUS `x` harfi · s11 trenajyor +
// tekshirish satri · s12 masala (yozuv + javob + tekshirish) · s13 final 5 savol +
// FactCard · s14 yakun.
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'MCScreen', scored: false, scope: 'hook' },
  { id: 's1',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's4',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's5',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's6',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's7',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's8',  type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
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
    topic: { ru: 'Связь умножения и деления', uz: "Ko'paytirish va bo'lishning bog'lanishi" },
    lead: { ru: 'Лампы уехали в город, а сколько ящиков — не видно', uz: "Lampalar shaharga ketdi, yashiklar soni esa ko'rinmaydi" },
    tag_cap: { ru: 'накладная', uz: 'yorliq' },
    crate_cap: { ru: 'в ящике по 5', uz: 'yashikda beshtadan' },
    q: { ru: 'Как узнать, сколько ящиков, не снимая чехол?', uz: "Matoni ochmasdan yashiklar sonini qanday bilish mumkin?" },
    opt0: { ru: 'Разделить сорок на пять', uz: "Qirqni beshga bo'lish" },
    opt1: { ru: 'Умножить сорок на пять', uz: "Qirqni beshga ko'paytirish" },
    opt2: { ru: 'Вычесть из сорока пять', uz: 'Qirqdan beshni ayirish' },
    opt3: { ru: 'Снять чехол и посчитать', uz: 'Matoni ochib sanash' },
    audio: {
      intro: {
        ru: [
          'Тема урока называется связь умножения и деления. Узнаем, как найти число, которое спряталось в записи.',
          'Светящийся сад отправляет лампы в город. На площадке отправки стоит вагонетка, на ней ящики, и в каждом ящике по пять ламп.',
          'На бирке написано, сколько ламп уехало. Всего сорок. А ящиков не видно, они под чехлом.',
          'На приёмке Бит должен назвать число ящиков. Как думаешь, что ему сделать?'
        ],
        uz: [
          "Dars mavzusi ko'paytirish va bo'lishning bog'lanishi deb ataladi. Yozuvda yashiringan sonni qanday topishni bilib olamiz.",
          "Yorug' bog' lampalarni shaharga jo'natadi. Jo'natish maydonchasida vagonetka turadi, ustida yashiklar bor, har yashikda beshta lampa.",
          "Yorliqda nechta lampa ketgani yozilgan. Jami qirq. Yashiklar esa ko'rinmaydi, ular mato ostida.",
          "Qabulda Bit yashiklar sonini aytishi kerak. Sizningcha, u nima qilishi kerak?"
        ]
      },
      on_correct: {
        ru: 'Верно! Сорок разделить на пять, и число ящиков найдено. Сейчас проверим это на самой вагонетке.',
        uz: "To'g'ri! Qirqni beshga bo'lsak, yashiklar soni topiladi. Hozir buni vagonettada tekshiramiz."
      },
      on_wrong1: {
        ru: 'Умножение собирает целое, а целое мы уже знаем, это сорок. Искать надо часть.',
        uz: "Ko'paytirish butunni yig'adi, butunni esa bilamiz, u qirq. Qismni topish kerak."
      },
      on_wrong2: {
        ru: 'Вычитание уберёт один ящик, а нам нужно, сколько их всего.',
        uz: "Ayirish bitta yashikni olib qo'yadi, bizga esa ularning jami soni kerak."
      },
      on_idk: {
        ru: 'Посчитать можно, но если ящиков сто, счёт затянется. Есть действие, которое даёт ответ сразу.',
        uz: "Sanash mumkin, lekin yashik yuzta bo'lsa, sanoq uzoq davom etadi. Javobni darrov beradigan amal bor."
      }
    }
  },

  s1: {
    eyebrow: { ru: 'Вспоминаем', uz: 'Eslaymiz' },
    lead: { ru: 'Две записи, которые ты уже знаешь', uz: 'Siz allaqachon bilgan ikki yozuv' },
    tap_label: { ru: 'Нажми на карточку', uz: 'Kartani bosing' },
    card1: { ru: '5 × 8 = 40', uz: '5 × 8 = 40' },
    card1_cap: { ru: 'таблица умножения, урок 9', uz: "ko'paytirish jadvali, 9-dars" },
    card2: { ru: '40 : 5 = 8', uz: '40 : 5 = 8' },
    card2_cap: { ru: 'деление, урок 9', uz: "bo'lish, 9-dars" },
    audio: {
      ru: [
        'Смотри, обе записи ты уже знаешь. Открой первую карточку.',
        'Пять умножить на восемь, сорок. Это из таблицы.',
        'Сорок разделить на пять, восемь. Тоже знакомо.',
        'А теперь заметь главное. В двух записях одни и те же три числа. Пять, восемь и сорок.'
      ],
      uz: [
        "Qarang, ikkala yozuvni ham bilasiz. Birinchi kartani oching.",
        "Besh karra sakkiz, qirq. Bu jadvaldan.",
        "Qirqni beshga bo'lsak, sakkiz. Bu ham tanish.",
        "Endi asosiy narsani sezing. Ikki yozuvda o'sha uchta son bor. Besh, sakkiz va qirq."
      ]
    }
  },

  s2: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: { ru: 'Обратная дорога: от сорока к числу ящиков', uz: "Teskari yo'l: qirqdan yashiklar soniga" },
    btn1: { ru: 'Разделить сорок на пять', uz: "Qirqni beshga bo'lish" },
    btn2: { ru: 'Открыть ящики', uz: 'Yashiklarni ochish' },
    btn3: { ru: 'Посчитать', uz: 'Sanash' },
    count_cap: { ru: 'ящиков', uz: 'yashik' },
    done_text: { ru: 'Сорок ламп, по пять в ящике, восемь ящиков. Накладная сошлась.', uz: "Qirq lampa, yashikda beshtadan, sakkiz yashik. Yorliq to'g'ri chiqdi." },
    audio: {
      ru: [
        'Смотри на вагонетку. Всего сорок ламп, и в каждом ящике по пять.',
        'Делим сорок на пять. Это значит, узнаём, сколько раз пятёрка помещается в сорок.',
        'Ящики появляются один за другим. Пять, десять, пятнадцать и дальше до сорока.',
        'Ящиков вышло восемь. Сорок разделить на пять, восемь.',
        'Запомни этот ход. Мы шли обратной дорогой, от целого к части, и деление вернуло спрятанное число.'
      ],
      uz: [
        "Vagonettaga qarang. Jami qirq lampa, har yashikda esa beshta.",
        "Qirqni beshga bo'lamiz. Ya'ni beshlik qirqqa necha marta joylashishini bilamiz.",
        "Yashiklar birin-ketin paydo bo'ladi. Besh, o'n, o'n besh va shu tartibda qirqqacha.",
        "Yashiklar sakkizta chiqdi. Qirqni beshga bo'lsak, sakkiz.",
        "Bu yo'lni eslab qoling. Biz teskari yo'ldan bordik, butundan qismga, va bo'lish yashiringan sonni qaytardi."
      ]
    }
  },

  s3: {
    eyebrow: { ru: 'Три числа', uz: 'Uchta son' },
    lead: { ru: 'Одна тройка чисел — четыре записи', uz: "Bitta uchlik son — to'rtta yozuv" },
    tri_cap: { ru: 'сорок, пять и восемь держатся вместе', uz: 'qirq, besh va sakkiz birga turadi' },
    rows: [
      { expr: '5 × 8 = 40', cap: { ru: 'множитель, множитель, произведение', uz: "ko'paytuvchi, ko'paytuvchi, ko'paytma" } },
      { expr: '8 × 5 = 40', cap: { ru: 'множители можно поменять местами', uz: "ko'paytuvchilar o'rnini almashtirsa bo'ladi" } },
      { expr: '40 : 5 = 8', cap: { ru: 'делимое, делитель, частное', uz: "bo'linuvchi, bo'luvchi, bo'linma" } },
      { expr: '40 : 8 = 5', cap: { ru: 'делим на другое число тройки', uz: "uchlikdagi boshqa songa bo'lamiz" } }
    ],
    btn1: { ru: 'Первая запись', uz: 'Birinchi yozuv' },
    btn2: { ru: 'Вторая запись', uz: 'Ikkinchi yozuv' },
    btn3: { ru: 'Третья запись', uz: 'Uchinchi yozuv' },
    btn4: { ru: 'Четвёртая запись', uz: "To'rtinchi yozuv" },
    done_text: { ru: 'Из трёх чисел вышли четыре записи. Две с умножением и две с делением.', uz: "Uchta sondan to'rtta yozuv chiqdi. Ikkitasi ko'paytirish, ikkitasi bo'lish." },
    audio: {
      ru: [
        'Три числа держатся вместе, как одна семья. Сорок наверху, пять и восемь внизу.',
        'Пять умножить на восемь, сорок. Пять и восемь тут множители, а сорок произведение.',
        'Восемь умножить на пять, тоже сорок. Множители можно поменять местами, произведение не изменится.',
        'Сорок разделить на пять, восемь. Здесь сорок это делимое, пять делитель, а восемь частное.',
        'Сорок разделить на восемь, пять. Тот же треугольник, только делим на другое число.',
        'Из трёх чисел получились четыре записи. Две с умножением и две с делением. Поэтому от ответа всегда можно вернуться назад.'
      ],
      uz: [
        "Uchta son bir oila kabi birga turadi. Qirq tepada, besh va sakkiz pastda.",
        "Besh karra sakkiz, qirq. Besh va sakkiz bu yerda ko'paytuvchilar, qirq esa ko'paytma.",
        "Sakkiz karra besh, u ham qirq. Ko'paytuvchilar o'rnini almashtirsa bo'ladi, ko'paytma o'zgarmaydi.",
        "Qirqni beshga bo'lsak, sakkiz. Bu yerda qirq bo'linuvchi, besh bo'luvchi, sakkiz esa bo'linma.",
        "Qirqni sakkizga bo'lsak, besh. O'sha uchburchak, faqat boshqa songa bo'ldik.",
        "Uchta sondan to'rtta yozuv chiqdi. Ikkitasi ko'paytirish, ikkitasi bo'lish. Shuning uchun javobdan doim ortga qaytish mumkin."
      ]
    }
  },

  s4: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    q: { ru: 'Какое-то число умножили на пять и вышло сорок. Как найти это число?', uz: "Qaysidir son beshga ko'paytirilib, qirq chiqdi. Bu sonni qanday topamiz?" },
    opts: [
      { ru: 'Сорок разделить на пять', uz: "Qirqni beshga bo'lish" },
      { ru: 'Сорок умножить на пять', uz: "Qirqni beshga ko'paytirish" },
      { ru: 'К сорока прибавить пять', uz: "Qirqqa beshni qo'shish" },
      { ru: 'Из сорока вычесть пять', uz: 'Qirqdan beshni ayirish' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Умножение уже сделано, его результат сорок. Второй раз умножать нечего.', uz: "Ko'paytirish allaqachon bajarilgan, natijasi qirq. Ikkinchi marta ko'paytiradigan narsa yo'q." },
      2: { ru: 'Сложение тут не при чём. В записи стоит умножение, значит вернёт нас деление.', uz: "Qo'shishning bunga aloqasi yo'q. Yozuvda ko'paytirish turadi, demak bizni bo'lish qaytaradi." },
      3: { ru: 'Вычитание убирает пять ламп, а нам нужно, сколько раз по пять уложилось в сорок.', uz: "Ayirish beshta lampani olib qo'yadi, bizga esa qirqqa beshtadan necha marta joylashgani kerak." }
    },
    on_correct: { ru: 'Именно так! Неизвестный множитель находят делением.', uz: "Aynan shunday! Noma'lum ko'paytuvchi bo'lish bilan topiladi." },
    rule_lines: {
      ru: [
        'Неизвестный множитель = произведение : известный множитель',
        'Умножение проверяют делением: произведение : множитель',
        'Деление проверяют умножением: частное × делитель'
      ],
      uz: [
        "Noma'lum ko'paytuvchi = ko'paytma : ma'lum ko'paytuvchi",
        "Ko'paytirishni tekshirish: ko'paytma : ko'paytuvchi",
        "Bo'lishni tekshirish: bo'linma × bo'luvchi"
      ]
    },
    rule_ex: '5 × 8 = 40 · 40 : 5 = 8 · 40 : 8 = 5',
    rule_speech: {
      ru: 'Правило такое. Если один множитель неизвестен, делим произведение на известный множитель. Чтобы проверить умножение, произведение делят на один из множителей. А чтобы проверить деление, частное умножают на делитель.',
      uz: "Qoida shunday. Bitta ko'paytuvchi noma'lum bo'lsa, ko'paytmani ma'lum ko'paytuvchiga bo'lamiz. Ko'paytirishni tekshirish uchun ko'paytmani ko'paytuvchilardan biriga bo'lamiz. Bo'lishni tekshirish uchun esa bo'linmani bo'luvchiga ko'paytiramiz."
    },
    audio: {
      intro: { ru: 'Одну вагонетку мы разобрали. Теперь главный вопрос урока.', uz: "Bitta vagonettani ko'rib chiqdik. Endi darsning asosiy savoli." }
    }
  },

  s5: {
    eyebrow: { ru: 'Ловушка Бита', uz: 'Bit tuzogi' },
    lead: { ru: 'Бит увидел умножение и умножил сам', uz: "Bit ko'paytirishni ko'rib, o'zi ham ko'paytirdi" },
    lines: ['☐ × 5 = 40', '40 × 5', '200'],
    trap_label: { ru: 'Верно ли посчитал Бит?', uz: "Bit to'g'ri hisobladimi?" },
    trap_opts: { ru: ['Верно', 'Неверно'], uz: ["To'g'ri", "Noto'g'ri"] },
    trap_ci: 1,
    trap_correct: {
      ru: 'Точно! Двести это не выдумка, но это ответ на другую задачу, где сорок само стало множителем. А у нас сорок уже целое, поэтому его делят.',
      uz: "Aniq! Ikki yuz o'ydirma emas, lekin bu boshqa masalaning javobi, unda qirqning o'zi ko'paytuvchi bo'ladi. Bizda esa qirq allaqachon butun, shuning uchun u bo'linadi."
    },
    trap_wrong: {
      ru: 'Посмотри на вагонетку. Ламп всего сорок, больше их стать не может. Значит действие обратное, деление.',
      uz: "Vagonettaga qarang. Lampa jami qirq, undan ko'p bo'la olmaydi. Demak amal teskari, bo'lish."
    },
    audio: {
      ru: [
        'Бит увидел в записи умножение и умножил сам. Сорок умножить на пять, двести!',
        'Верно ли посчитал Бит?'
      ],
      uz: [
        "Bit yozuvda ko'paytirishni ko'rib, o'zi ham ko'paytirdi. Qirq karra besh, ikki yuz!",
        "Bit to'g'ri hisobladimi?"
      ]
    }
  },

  s6: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshirish' },
    lead: { ru: 'Проверка ловит ошибку', uz: 'Tekshirish xatoni tutadi' },
    left_title: { ru: 'Бит разделил', uz: "Bit bo'ldi" },
    left_lines: ['54 : 9 = 7', '7 × 9 = 63', '54 : 9 = 6'],
    left_cap: { ru: 'шестьдесят три это не пятьдесят четыре, значит ошибка', uz: "oltmish uch ellik to'rt emas, demak xato" },
    right_title: { ru: 'Бит умножил', uz: "Bit ko'paytirdi" },
    right_lines: ['6 × 9 = 54', '54 : 6 = 9', '54 : 9 = 6'],
    right_cap: { ru: 'произведение разделили на множитель', uz: "ko'paytmani ko'paytuvchiga bo'ldik" },
    btn1: { ru: 'Проверить деление', uz: "Bo'lishni tekshirish" },
    btn2: { ru: 'Проверить умножение', uz: "Ko'paytirishni tekshirish" },
    mc_q: { ru: 'Бит разделил и получил семь. Как проверить его ответ?', uz: "Bit bo'lib, yetti chiqardi. Javobini qanday tekshiramiz?" },
    mc_opts: [
      { ru: 'Умножить семь на девять', uz: "Yettini to'qqizga ko'paytirish" },
      { ru: 'Разделить семь на девять', uz: "Yettini to'qqizga bo'lish" },
      { ru: 'Разделить девять на семь', uz: "To'qqizni yettiga bo'lish" },
      { ru: 'Прибавить к семи девять', uz: "Yettiga to'qqizni qo'shish" }
    ],
    mc_ci: 0,
    mc_hints: {
      1: { ru: 'Частное делить не нужно, его умножают. Деление уже было, теперь идём обратно.', uz: "Bo'linmani bo'lish kerak emas, uni ko'paytiradilar. Bo'lish bo'lib o'tdi, endi ortga qaytamiz." },
      2: { ru: 'Порядок в делении важен. Девять на семь и семь на девять это не одно и то же.', uz: "Bo'lishda tartib muhim. To'qqizni yettiga va yettini to'qqizga bo'lish bir xil emas." },
      3: { ru: 'Сложение не вернёт делимое. Делимое собирают умножением.', uz: "Qo'shish bo'linuvchini qaytarmaydi. Bo'linuvchi ko'paytirish bilan yig'iladi." }
    },
    mc_ok: { ru: 'Верно! Деление проверяют умножением.', uz: "To'g'ri! Bo'lish ko'paytirish bilan tekshiriladi." },
    audio: {
      ru: [
        'В книге это называется проверка. Бит разделил пятьдесят четыре на девять и получил семь. Нажми и проверим.',
        'Частное умножаем на делитель. Семь умножить на девять, шестьдесят три. А ламп было пятьдесят четыре, значит Бит ошибся. Верный ответ шесть, и шесть умножить на девять как раз пятьдесят четыре.',
        'Умножение проверяют наоборот. Шесть умножить на девять, пятьдесят четыре. Делим пятьдесят четыре на шесть и получаем девять. Сошлось.',
        'Вот зачем нужна связь. Она не только ищет спрятанное число, но и ловит ошибку.'
      ],
      uz: [
        "Kitobda bu tekshirish deb ataladi. Bit ellik to'rtni to'qqizga bo'lib, yetti chiqardi. Bosing va tekshiramiz.",
        "Bo'linmani bo'luvchiga ko'paytiramiz. Yetti karra to'qqiz, oltmish uch. Lampa esa ellik to'rtta edi, demak Bit xato qildi. To'g'ri javob olti, olti karra to'qqiz aynan ellik to'rt.",
        "Ko'paytirish teskarisiga tekshiriladi. Olti karra to'qqiz, ellik to'rt. Ellik to'rtni oltiga bo'lsak, to'qqiz chiqadi. Mos keldi.",
        "Bog'lanish shuning uchun kerak. U yashiringan sonni topadi va xatoni ham tutadi."
      ]
    }
  },

  s7: {
    eyebrow: { ru: 'Пять секунд', uz: 'Besh soniya' },
    q: { ru: 'Каким действием найти спрятанный множитель?', uz: "Yashiringan ko'paytuvchini qaysi amal topadi?" },
    expr: '☐ × 7 = 56',
    items: [
      {
        opts: [{ ru: '56 : 7', uz: '56 : 7' }, { ru: '56 × 7', uz: '56 × 7' }, { ru: '56 − 7', uz: '56 − 7' }, { ru: '7 × 56', uz: '7 × 56' }],
        hints: [
          null,
          { ru: 'Так число станет больше, а нам нужна часть от пятидесяти шести.', uz: "Bunda son kattalashadi, bizga esa ellik oltining qismi kerak." },
          { ru: 'Вычитание убирает семь, а не показывает, сколько раз по семь.', uz: "Ayirish yettini olib qo'yadi, necha marta yettidan borligini ko'rsatmaydi." },
          { ru: 'Это то же умножение, только с другого конца. Умножать здесь нечего.', uz: "Bu o'sha ko'paytirish, faqat boshqa tomondan. Bu yerda ko'paytiradigan narsa yo'q." }
        ],
        ci: 0
      }
    ],
    audio: {
      intro: { ru: 'Пять секунд на подумать. В записи неизвестен множитель, а произведение пятьдесят шесть. Выбери не ответ, а действие, которым его найдут.', uz: "O'ylash uchun besh soniya. Yozuvda ko'paytuvchi noma'lum, ko'paytma esa ellik olti. Javobni emas, uni topadigan amalni tanlang." },
      on_correct: { ru: 'Успел! Пятьдесят шесть разделить на семь, восемь.', uz: "Ulguribsiz! Ellik oltini yettiga bo'lsak, sakkiz." },
      on_wrong: { ru: 'Неизвестен множитель, значит нужно деление.', uz: "Ko'paytuvchi noma'lum, demak bo'lish kerak." }
    }
  },

  s8: {
    eyebrow: { ru: 'Тренировка', uz: 'Mashq' },
    items: [
      { q: { ru: 'Найди спрятанное число: ☐ × 6 = 42', uz: "Yashiringan sonni toping: ☐ × 6 = 42" }, q_speech: { ru: 'Спрятанное число умножить на шесть, сорок два.', uz: 'Yashiringan son karra olti, qirq ikki.' }, ans: 7, hint: { ru: 'Неизвестен множитель. Раздели произведение на шесть.', uz: "Ko'paytuvchi noma'lum. Ko'paytmani oltiga bo'ling." } },
      { q: { ru: 'Найди спрятанное число: 9 × ☐ = 45', uz: "Yashiringan sonni toping: 9 × ☐ = 45" }, q_speech: { ru: 'Девять умножить на спрятанное число, сорок пять.', uz: "To'qqiz karra yashiringan son, qirq besh." }, ans: 5, hint: { ru: 'Второй множитель прячется. Сорок пять разделить на девять.', uz: "Ikkinchi ko'paytuvchi yashiringan. Qirq beshni to'qqizga bo'ling." } },
      { q: { ru: 'Найди спрятанное число: ☐ : 4 = 8', uz: "Yashiringan sonni toping: ☐ : 4 = 8" }, q_speech: { ru: 'Спрятанное число разделить на четыре, восемь.', uz: "Yashiringan sonni to'rtga bo'lsak, sakkiz." }, ans: 32, hint: { ru: 'Здесь спряталось целое, делимое. Целое собирают умножением, восемь умножить на четыре.', uz: "Bu yerda butun, ya'ni bo'linuvchi yashiringan. Butun ko'paytirish bilan yig'iladi, sakkiz karra to'rt." } }
    ],
    audio: {
      intro: { ru: 'Теперь сам. В каждой записи одно число спряталось, найди его.', uz: "Endi o'zingiz. Har yozuvda bitta son yashiringan, uni toping." },
      on_correct: { ru: 'Верно. И проверить легко, умножь обратно.', uz: "To'g'ri. Tekshirish oson, teskarisiga ko'paytiring." }
    }
  },

  s9: {
    eyebrow: { ru: 'Тест', uz: 'Test' },
    items: [
      {
        q: { ru: 'В семье чисел 7, 8 и 56 какая запись верна?', uz: "7, 8 va 56 sonlari oilasida qaysi yozuv to'g'ri?" },
        q_speech: { ru: 'В семье чисел семь, восемь и пятьдесят шесть какая запись верна?', uz: "Yetti, sakkiz va ellik olti sonlari oilasida qaysi yozuv to'g'ri?" },
        expr: '7 · 8 · 56',
        opts: [{ ru: '56 : 7 = 8', uz: '56 : 7 = 8' }, { ru: '56 : 7 = 7', uz: '56 : 7 = 7' }, { ru: '7 + 8 = 56', uz: '7 + 8 = 56' }, { ru: '56 × 8 = 7', uz: '56 × 8 = 7' }],
        hints: [
          null,
          { ru: 'Тогда семёрок было бы семь, а это сорок девять. Проверь умножением.', uz: "Unda yettitalik yetti bo'lardi, u esa qirq to'qqiz. Ko'paytirib tekshiring." },
          { ru: 'Семь и восемь дают пятнадцать. Пятьдесят шесть получается умножением.', uz: "Yetti va sakkiz o'n beshni beradi. Ellik olti ko'paytirish bilan chiqadi." },
          { ru: 'Умножение делает число больше, а не меньше. Здесь нужно деление.', uz: "Ko'paytirish sonni kichraytirmaydi, kattalashtiradi. Bu yerda bo'lish kerak." }
        ],
        ci: 0
      },
      {
        q: { ru: 'Как называется число, которое делят?', uz: "Bo'linadigan son qanday ataladi?" },
        expr: '40 : 5 = 8',
        opts: [
          { ru: 'делимое', uz: "bo'linuvchi" },
          { ru: 'делитель', uz: "bo'luvchi" },
          { ru: 'частное', uz: "bo'linma" },
          { ru: 'множитель', uz: "ko'paytuvchi" }
        ],
        hints: [
          null,
          { ru: 'Делитель это то, на что делят. А нам нужно то, что делят.', uz: "Bo'luvchi bu nimaga bo'linsa, o'sha. Bizga esa bo'linadigan son kerak." },
          { ru: 'Частное это уже результат деления.', uz: "Bo'linma bu bo'lishning natijasi." },
          { ru: 'Множитель живёт в умножении, а вопрос про деление.', uz: "Ko'paytuvchi ko'paytirishda bo'ladi, savol esa bo'lish haqida." }
        ],
        ci: 0
      },
      {
        q: { ru: 'Как проверяют умножение?', uz: "Ko'paytirish qanday tekshiriladi?" },
        expr: '6 × 9 = 54',
        opts: [
          { ru: 'произведение делят на множитель', uz: "ko'paytma ko'paytuvchiga bo'linadi" },
          { ru: 'произведение умножают на множитель', uz: "ko'paytma ko'paytuvchiga ko'paytiriladi" },
          { ru: 'множители складывают', uz: "ko'paytuvchilar qo'shiladi" },
          { ru: 'произведение делят на частное', uz: "ko'paytma bo'linmaga bo'linadi" }
        ],
        hints: [
          null,
          { ru: 'Тогда число уедет ещё дальше. Проверка идёт обратным действием.', uz: "Unda son yana ham uzoqlashadi. Tekshirish teskari amal bilan boradi." },
          { ru: 'Сложение не проверяет умножение, у них разные семьи.', uz: "Qo'shish ko'paytirishni tekshirmaydi, ularning oilasi boshqa." },
          { ru: 'Частного в умножении нет, там множители и произведение.', uz: "Ko'paytirishda bo'linma yo'q, unda ko'paytuvchilar va ko'paytma bor." }
        ],
        ci: 0
      }
    ],
    audio: {
      intro: { ru: 'Три вопроса на проверку. Слова тоже важны, ими пользуются в книге.', uz: "Tekshirish uchun uch savol. So'zlar ham muhim, kitobda ular ishlatiladi." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Посмотри на тройку чисел ещё раз.', uz: "Uchlik sonlarga yana bir qarang." }
    }
  },

  s10: {
    eyebrow: { ru: 'Бонус', uz: 'Bonus' },
    lead: { ru: 'Взрослая запись: вместо окошка буква', uz: "Kattalar yozuvi: katakcha o'rniga harf" },
    steps: ['☐ × 5 = 40', 'x × 5 = 40', 'x = 40 : 5', 'x = 8', '8 × 5 = 40'],
    btn1: { ru: 'Поставить букву', uz: "Harfni qo'yish" },
    btn2: { ru: 'Записать решение', uz: 'Yechimni yozish' },
    btn3: { ru: 'Найти икс', uz: 'Iksni topish' },
    btn4: { ru: 'Проверить ответ', uz: 'Javobni tekshirish' },
    book_note: { ru: 'так записано в учебнике 3 класса', uz: '3-sinf darsligida shunday yozilgan' },
    mc_q: { ru: 'Что означает буква x в записи?', uz: 'Yozuvdagi x harfi nimani bildiradi?' },
    mc_opts: [
      { ru: 'Неизвестное число', uz: "Noma'lum sonni" },
      { ru: 'Знак умножения', uz: "Ko'paytirish belgisini" },
      { ru: 'Ответ примера', uz: 'Misolning javobini' },
      { ru: 'Ноль', uz: 'Nolni' }
    ],
    mc_ci: 0,
    mc_hints: {
      1: { ru: 'Похоже, но нет. Знак умножения стоит между числами, а буква на месте числа.', uz: "O'xshaydi, lekin yo'q. Ko'paytirish belgisi sonlar orasida turadi, harf esa son o'rnida." },
      2: { ru: 'Ответ мы находим, а буква только держит место, пока число не найдено.', uz: "Javobni biz topamiz, harf esa son topilmagunicha faqat joyni ushlab turadi." },
      3: { ru: 'Ноль это число. А буква это любое число, которое надо найти.', uz: "Nol bu son. Harf esa topish kerak bo'lgan har qanday son." }
    },
    mc_ok: { ru: 'Верно! Буква держит место неизвестного числа.', uz: "To'g'ri! Harf noma'lum son o'rnini ushlab turadi." },
    audio: {
      ru: [
        'Небольшой бонус. В книге вместо окошка ставят букву, и читается она икс.',
        'Икс умножить на пять, сорок. Запись стала взрослой, а смысл тот же.',
        'Ищем неизвестный множитель, значит икс равен сорок разделить на пять.',
        'Икс равен восьми.',
        'И сразу проверка. Восемь умножить на пять, сорок. Верно.'
      ],
      uz: [
        "Kichik bonus. Kitobda katakcha o'rniga harf qo'yiladi, u iks deb o'qiladi.",
        "Iks karra besh, qirq. Yozuv kattalarnikiga o'xshadi, ma'no esa o'sha.",
        "Noma'lum ko'paytuvchini topamiz, demak iks qirqni beshga bo'lganga teng.",
        "Iks sakkizga teng.",
        "Va darrov tekshirish. Sakkiz karra besh, qirq. To'g'ri."
      ]
    }
  },

  s11: {
    eyebrow: { ru: 'Тренажёр', uz: 'Trenajyor' },
    items: [
      { q: { ru: 'Набери спрятанное число: ☐ : 8 = 6', uz: "Yashiringan sonni tering: ☐ : 8 = 6" }, q_speech: { ru: 'Спрятанное число разделить на восемь, шесть.', uz: "Yashiringan sonni sakkizga bo'lsak, olti." }, ans: 48, check: '6 × 8 = 48', hint: { ru: 'Спряталось делимое. Частное умножь на делитель.', uz: "Bo'linuvchi yashiringan. Bo'linmani bo'luvchiga ko'paytiring." } },
      { q: { ru: 'Набери спрятанное число: 30 : ☐ = 5', uz: "Yashiringan sonni tering: 30 : ☐ = 5" }, q_speech: { ru: 'Тридцать разделить на спрятанное число, пять.', uz: "O'ttizni yashiringan songa bo'lsak, besh." }, ans: 6, check: '30 : 6 = 5', hint: { ru: 'Спрятался делитель. Раздели делимое на частное.', uz: "Bo'luvchi yashiringan. Bo'linuvchini bo'linmaga bo'ling." } },
      { q: { ru: 'Набери спрятанное число: ☐ × 9 = 36', uz: "Yashiringan sonni tering: ☐ × 9 = 36" }, q_speech: { ru: 'Спрятанное число умножить на девять, тридцать шесть.', uz: "Yashiringan son karra to'qqiz, o'ttiz olti." }, ans: 4, check: '36 : 9 = 4', hint: { ru: 'Неизвестен множитель. Тридцать шесть раздели на девять.', uz: "Ko'paytuvchi noma'lum. O'ttiz oltini to'qqizga bo'ling." } }
    ],
    check_label: { ru: 'проверка', uz: 'tekshirish' },
    audio: {
      intro: { ru: 'Три записи, и после каждой сразу проверка. Так делают в книге.', uz: "Uch yozuv, har biridan keyin darrov tekshirish. Kitobda shunday qiladi." },
      on_correct: { ru: 'Верно, и проверка это подтвердила.', uz: "To'g'ri, tekshirish ham buni tasdiqladi." }
    }
  },

  s12: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    lead: { ru: 'Рано отправляет лампы в город.', uz: "Ra'no lampalarni shaharga jo'natadi." },
    q: { ru: 'Рано отправила 54 лампы. В один ящик кладут 9 ламп. Сколько ящиков?', uz: "Ra'no 54 lampa jo'natdi. Bitta yashikka 9 lampa solinadi. Nechta yashik bo'ladi?" },
    q_speech: { ru: 'Рано отправила в город пятьдесят четыре лампы. В один ящик кладут девять ламп. Сколько ящиков?', uz: "Ra'no shaharga ellik to'rt lampa jo'natdi. Bitta yashikka to'qqizta lampa solinadi. Nechta yashik bo'ladi?" },
    pick_label: { ru: 'Сначала выбери запись', uz: 'Avval yozuvni tanlang' },
    opts: [
      { ru: '54 : 9', uz: '54 : 9' },
      { ru: '54 × 9', uz: '54 × 9' },
      { ru: '9 : 54', uz: '9 : 54' },
      { ru: '54 − 9', uz: '54 − 9' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Умножение соберёт ещё больше ламп, а у Рано их всего пятьдесят четыре.', uz: "Ko'paytirish yana ko'p lampa yig'adi, Ra'noda esa jami ellik to'rtta." },
      2: { ru: 'Делят целое на часть. Целое здесь пятьдесят четыре.', uz: "Butunni qismga bo'ladilar. Bu yerda butun ellik to'rt." },
      3: { ru: 'Вычитание уберёт один ящик ламп, а нужно число ящиков.', uz: "Ayirish bitta yashik lampani olib qo'yadi, bizga esa yashiklar soni kerak." }
    },
    pick_ok: { ru: 'Запись верная. Теперь набери ответ.', uz: "Yozuv to'g'ri. Endi javobni tering." },
    ans: 6,
    check: '6 × 9 = 54',
    setup_audio: { ru: 'Задача с площадки отправки. Пятьдесят четыре лампы, в ящике по девять. Сначала выбери запись, потом посчитай.', uz: "Jo'natish maydonchasidan masala. Ellik to'rt lampa, yashikda to'qqiztadan. Avval yozuvni tanlang, keyin hisoblang." },
    audio: {
      intro: { ru: 'Тут пригодится всё, что мы разобрали.', uz: "Bu yerda ko'rib chiqqanimizning hammasi kerak bo'ladi." },
      on_correct: { ru: 'Шесть ящиков! И проверка сошлась, шесть умножить на девять, пятьдесят четыре.', uz: "Olti yashik! Tekshirish ham mos keldi, olti karra to'qqiz, ellik to'rt." },
      on_wrong: { ru: 'Пятьдесят четыре разделить на девять. Сколько раз по девять уложится?', uz: "Ellik to'rtni to'qqizga bo'ling. Necha marta to'qqiztadan joylashadi?" }
    }
  },

  s13: {
    eyebrow: { ru: 'Финал', uz: 'Final' },
    intro_line: { ru: 'Пять вопросов — и накладная закрыта', uz: 'Besh savol va yorliq yopiladi' },
    items: [
      {
        kind: 'num',
        q: { ru: '☐ × 8 = 24. Набери спрятанное число.', uz: "☐ × 8 = 24. Yashiringan sonni tering." },
        q_speech: { ru: 'Спрятанное число умножить на восемь, двадцать четыре.', uz: "Yashiringan son karra sakkiz, yigirma to'rt." },
        ans: 3,
        hint: { ru: 'Раздели двадцать четыре на восемь.', uz: "Yigirma to'rtni sakkizga bo'ling." }
      },
      {
        kind: 'mc',
        q: { ru: 'Бит разделил 35 на 5 и получил 7. Какая запись это подтверждает?', uz: "Bit 35 ni 5 ga bo'lib, 7 chiqardi. Buni qaysi yozuv tasdiqlaydi?" },
        q_speech: { ru: 'Бит разделил тридцать пять на пять и получил семь. Какая запись это подтверждает?', uz: "Bit o'ttiz beshni beshga bo'lib, yetti chiqardi. Buni qaysi yozuv tasdiqlaydi?" },
        opt0: { ru: '7 × 5 = 35', uz: '7 × 5 = 35' },
        opt1: { ru: '35 × 5 = 7', uz: '35 × 5 = 7' },
        opt2: { ru: '7 : 5 = 35', uz: '7 : 5 = 35' },
        opt3: { ru: '5 : 7 = 35', uz: '5 : 7 = 35' },
        wrong_1: { ru: 'Умножение делает число больше, семёрка так не выйдет.', uz: "Ko'paytirish sonni kattalashtiradi, yetti bunday chiqmaydi." },
        wrong_2: { ru: 'Деление уменьшает. Проверяют умножением частного на делитель.', uz: "Bo'lish kichraytiradi. Bo'linmani bo'luvchiga ko'paytirib tekshiriladi." },
        wrong_3: { ru: 'И порядок не тот, и действие не то.', uz: "Tartib ham noto'g'ri, amal ham noto'g'ri." }
      },
      {
        kind: 'mc',
        q: { ru: 'В записи ☐ : 3 = 7 спряталось делимое. Какое действие его найдёт?', uz: "☐ : 3 = 7 yozuvida bo'linuvchi yashiringan. Qaysi amal uni topadi?" },
        q_speech: { ru: 'В записи спрятано делимое, его делят на три и выходит семь. Какое действие найдёт делимое?', uz: "Yozuvda bo'linuvchi yashiringan, u uchga bo'linadi va yetti chiqadi. Qaysi amal bo'linuvchini topadi?" },
        opt0: { ru: 'семь умножить на три', uz: "yettini uchga ko'paytirish" },
        opt1: { ru: 'семь разделить на три', uz: "yettini uchga bo'lish" },
        opt2: { ru: 'три разделить на семь', uz: "uchni yettiga bo'lish" },
        opt3: { ru: 'к семи прибавить три', uz: "yettiga uchni qo'shish" },
        wrong_1: { ru: 'Делимое больше частного, делением его не получишь.', uz: "Bo'linuvchi bo'linmadan katta, bo'lish bilan uni topolmaysiz." },
        wrong_2: { ru: 'Порядок в делении важен, и целое так не соберётся.', uz: "Bo'lishda tartib muhim, butun bunday yig'ilmaydi." },
        wrong_3: { ru: 'Сложение даст десять, а в записи было деление на три.', uz: "Qo'shish o'nni beradi, yozuvda esa uchga bo'lish bor edi." }
      },
      {
        kind: 'num',
        q: { ru: '72 : ☐ = 8. Набери спрятанное число.', uz: "72 : ☐ = 8. Yashiringan sonni tering." },
        q_speech: { ru: 'Семьдесят два разделить на спрятанное число, восемь.', uz: "Yetmish ikkini yashiringan songa bo'lsak, sakkiz." },
        ans: 9,
        hint: { ru: 'Делимое раздели на частное, семьдесят два на восемь.', uz: "Bo'linuvchini bo'linmaga bo'ling, yetmish ikkini sakkizga." }
      },
      {
        kind: 'mc',
        q: { ru: 'Какая запись неверна?', uz: "Qaysi yozuv noto'g'ri?" },
        opt0: { ru: '7 : 28 = 4', uz: '7 : 28 = 4' },
        opt1: { ru: '28 : 7 = 4', uz: '28 : 7 = 4' },
        opt2: { ru: '4 × 7 = 28', uz: '4 × 7 = 28' },
        opt3: { ru: '28 : 4 = 7', uz: '28 : 4 = 7' },
        wrong_1: { ru: 'Эта запись из семьи чисел и она верна. Ищи другую.', uz: "Bu yozuv sonlar oilasidan va to'g'ri. Boshqasini qidiring." },
        wrong_2: { ru: 'Эта запись из семьи чисел и она верна. Ищи другую.', uz: "Bu yozuv sonlar oilasidan va to'g'ri. Boshqasini qidiring." },
        wrong_3: { ru: 'Эта запись из семьи чисел и она верна. Ищи другую.', uz: "Bu yozuv sonlar oilasidan va to'g'ri. Boshqasini qidiring." }
      }
    ],
    fact_badge: { ru: 'Знаешь ли ты?', uz: 'Bilasizmi?' },
    fact_text: {
      ru: 'Летучая мышь в темноте кричит и слушает, когда звук вернётся. Звук идёт до стены и обратно, значит весь путь в два раза длиннее. Чтобы узнать расстояние до стены, весь путь делят на два. Мышь не видит стену, она находит её обратным действием.',
      uz: "Ko'rshapalak qorong'ida qichqiradi va tovush qaytishini tinglaydi. Tovush devorgacha borib qaytadi, ya'ni butun yo'l ikki barobar uzun. Devorgacha masofani bilish uchun butun yo'lni ikkiga bo'ladi. Ko'rshapalak devorni ko'rmaydi, uni teskari amal bilan topadi."
    },
    fact_audio: {
      ru: 'Летучая мышь в темноте кричит и слушает, когда звук вернётся. Звук идёт до стены и обратно, значит весь путь в два раза длиннее. Чтобы узнать расстояние до стены, весь путь делят на два. Мы весь урок возвращались от ответа к спрятанному числу. Летучая мышь делает то же самое, только со звуком.',
      uz: "Ko'rshapalak qorong'ida qichqiradi va tovush qaytishini tinglaydi. Tovush devorgacha borib qaytadi, ya'ni butun yo'l ikki barobar uzun. Devorgacha masofani bilish uchun butun yo'lni ikkiga bo'ladi. Butun dars javobdan yashiringan songa qaytdik. Ko'rshapalak ham shuni qiladi, faqat tovush bilan."
    },
    audio: {
      intro: { ru: 'Финальная проверка, пять вопросов.', uz: 'Yakuniy tekshiruv, besh savol.' },
      on_correct: { ru: 'Верно!', uz: "To'g'ri!" },
      on_wrong: { ru: 'Вернись к тройке чисел и проверь обратным действием.', uz: "Uchlik sonlarga qaytib, teskari amal bilan tekshiring." }
    }
  },

  s14: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    mission_done: { ru: 'Вагонетка отправлена, накладная сошлась!', uz: "Vagonetka jo'natildi, yorliq to'g'ri chiqdi!" },
    cando: { ru: 'Теперь ты знаешь, как найти спрятанное число и как проверить себя.', uz: "Endi siz yashiringan sonni topishni va o'zingizni tekshirishni bilasiz." },
    rule_recap: {
      ru: 'Неизвестный множитель = произведение : известный множитель. Умножение проверяют делением, деление проверяют умножением. 5 × 8 = 40, значит 40 : 5 = 8 и 40 : 8 = 5.',
      uz: "Noma'lum ko'paytuvchi = ko'paytma : ma'lum ko'paytuvchi. Ko'paytirish bo'lish bilan, bo'lish ko'paytirish bilan tekshiriladi. 5 × 8 = 40, demak 40 : 5 = 8 va 40 : 8 = 5."
    },
    conn_label_refs: { ru: 'опирается на', uz: 'tayanadi' },
    conn_refs: { ru: 'урок 9: таблица умножения; уроки 11 и 12: умножение и деление суммы', uz: "9-dars: ko'paytirish jadvali; 11 va 12-darslar: yig'indini ko'paytirish va bo'lish" },
    conn_label_next: { ru: 'дальше', uz: 'keyingi' },
    conn_next: { ru: 'задачи на умножение и деление', uz: "ko'paytirish va bo'lishga masalalar" },
    audio: {
      ru: 'Неизвестный множитель находят так, произведение делят на известный множитель. Умножение проверяют делением, а деление проверяют умножением. И запомни главное. Три числа держатся вместе, поэтому от ответа всегда можно вернуться назад и проверить себя. А если в задаче нет ни знака умножения, ни знака деления, только слова? Например, в шесть раз больше. Об этом в следующем уроке!',
      uz: "Noma'lum ko'paytuvchi shunday topiladi, ko'paytma ma'lum ko'paytuvchiga bo'linadi. Ko'paytirish bo'lish bilan, bo'lish esa ko'paytirish bilan tekshiriladi. Va asosiysini eslab qoling. Uchta son birga turadi, shuning uchun javobdan doim ortga qaytib, o'zingizni tekshirsangiz bo'ladi. Agar masalada ko'paytirish belgisi ham, bo'lish belgisi ham bo'lmasa, faqat so'zlar bo'lsa-chi? Masalan, olti marta ko'p. Bu haqda keyingi darsda!"
    }
  }
};

// v9 KO'PRIK — ekranda ko'rinmaydi, faqat ovozda (brgSeg orqali birinchi segment).
const BRIDGES = {
  s1:  { ru: 'Сначала вспомним, что умеем.', uz: 'Avval bilganimizni eslaymiz.' },
  s2:  { ru: 'Теперь к вагонетке.', uz: 'Endi vagonettaga.' },
  s3:  { ru: 'Соберём три числа вместе.', uz: "Uchta sonni birga yig'amiz." },
  s4:  { ru: 'Запишем это правилом.', uz: 'Buni qoida qilib olamiz.' },
  s5:  { ru: 'А вот и Бит со своим счётом.', uz: "Mana Bit ham o'z hisobi bilan." },
  s6:  { ru: 'Теперь про проверку.', uz: 'Endi tekshirish haqida.' },
  s7:  { ru: 'Проверь себя на скорость.', uz: "O'zingizni tezlikka sinang." },
  s8:  { ru: 'Потренируем главный навык.', uz: "Asosiy ko'nikmani mashq qilamiz." },
  s9:  { ru: 'Теперь вопросы на слова и записи.', uz: "Endi so'z va yozuvlarga savollar." },
  s10: { ru: 'Открою тебе один секрет.', uz: 'Sizga bir sirni ochaman.' },
  s11: { ru: 'Теперь набирай ответы сам.', uz: "Endi javoblarni o'zingiz tering." },
  s12: { ru: 'Рано нужна помощь с отправкой.', uz: "Ra'noga jo'natishda yordam kerak." },
  s13: { ru: 'Финальная проверка.', uz: 'Yakuniy tekshiruv.' },
  s14: { ru: 'Вагонетка отправлена. Идём дальше!', uz: "Vagonetka jo'natildi. Davom etamiz!" }
};

// s14 payoff (xulosadan oldin aytiladi)
const S14_PAYOFF = {
  ru: 'Миссия выполнена! Вагонетка ушла в город, накладная сошлась, и число ящиков нашлось делением. Спасибо за помощь!',
  uz: "Missiya bajarildi! Vagonetka shaharga ketdi, yorliq to'g'ri chiqdi, yashiklar soni esa bo'lish bilan topildi. Yordamingiz uchun rahmat!"
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



// --- JO'NATISH MAYDONCHASI SAHNASI (D15): bog' chekkasi, relslar shaharga ketadi.
// Metodist 2026-08-05: har darsda BOSHQA sahna. 11-13-darsda yo'lak-plita, ajratish va
// buyurtma taxtasi bo'lgan; bu yerda bog'dan SHAHARGA ketadigan yuk yo'li: relslar,
// shpallar, platforma, uzoqda shahar. Kunduzgi yorug' palitra (metodist qarori).
const YardBg = () => (
  <svg className="lm-scene-bg" viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="d15sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#BCE4F7"/><stop offset="54%" stopColor="#E4F3FB"/><stop offset="100%" stopColor="#FBEFD4"/></linearGradient>
      <linearGradient id="d15hill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#CCE8B8"/><stop offset="100%" stopColor="#A6CF92"/></linearGradient>
      <linearGradient id="d15ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F1DFB4"/><stop offset="100%" stopColor="#DCC392"/></linearGradient>
      <linearGradient id="d15plat" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E2CFAE"/><stop offset="100%" stopColor="#C6AE82"/></linearGradient>
      <radialGradient id="d15sun" cx="50%" cy="50%" r="55%"><stop offset="0%" stopColor="#FFF8DC"/><stop offset="52%" stopColor="#FFE49A" stopOpacity="0.9"/><stop offset="100%" stopColor="#FFD36A" stopOpacity="0"/></radialGradient>
    </defs>
    {/* osmon, quyosh, bulutlar */}
    <rect x="0" y="0" width="400" height="132" fill="url(#d15sky)"/>
    <circle cx="64" cy="36" r="38" fill="url(#d15sun)"/><circle cx="64" cy="36" r="12" fill="#FFF3C4"/>
    <g fill="#FFFFFF" opacity="0.9">
      <ellipse cx="212" cy="30" rx="24" ry="9"/><ellipse cx="230" cy="26" rx="16" ry="7"/><ellipse cx="196" cy="27" rx="13" ry="6"/>
      <ellipse cx="322" cy="22" rx="18" ry="7"/><ellipse cx="336" cy="19" rx="11" ry="5"/>
    </g>
    {/* uzoq tepaliklar */}
    <path d="M0 126 Q54 100 110 120 Q160 134 204 112 Q254 90 314 116 Q358 132 400 114 L400 134 L0 134 Z" fill="url(#d15hill)"/>
    {/* UZOQDA SHAHAR — yuk shu tomonga ketadi */}
    <g opacity="0.9">
      {[[300, 16, 26], [318, 12, 34], [334, 18, 22], [356, 14, 30], [374, 20, 24]].map(([x, w, h], i) => (
        <g key={`ct${i}`}>
          <rect x={x} y={124 - h} width={w} height={h} rx="3" fill="#C9D8E8"/>
          <rect x={x + 2} y={124 - h - 3} width={w - 4} height="4" rx="2" fill="#AFC3D8"/>
          <rect className={i % 2 ? 'lm-cwin' : ''} x={x + 3} y={124 - h + 5} width="4" height="5" rx="1" fill="url(#lmGlow)"/>
          <rect x={x + w - 7} y={124 - h + 12} width="4" height="5" rx="1" fill="url(#lmGlow)"/>
        </g>
      ))}
      <text x="300" y="136" fontSize="7" fill="#8FA6BC" fontFamily="'JetBrains Mono', monospace">LUMO</text>
    </g>
    {/* yer */}
    <rect x="0" y="134" width="400" height="96" fill="url(#d15ground)"/>
    <line x1="0" y1="134" x2="400" y2="134" stroke="#9A8058" strokeWidth="1.6"/>
    {/* BOG' CHEKKASI (chapda): porlovchi o'simliklar — bu yerdan lampalar keladi */}
    {[16, 42, 66].map((x, i) => (
      <g key={`pl${i}`} transform={`translate(${x} 150)`}>
        <path d="M0 30 Q-4 12 0 0" stroke="#6FBF8E" strokeWidth="2.6" fill="none"/>
        <path d="M0 16 q-9 -4 -13 -12 q10 1 13 9Z" fill="#8FD8B8"/>
        <path d="M0 22 q9 -4 13 -12 q-10 1 -13 9Z" fill="#7FCFA8"/>
        <circle className="lm-glow" style={{ animationDelay: `${i * 0.5}s` }} cx="0" cy="-4" r="4.6" fill="#FFD98A"/>
      </g>
    ))}
    {/* PLATFORMA (o'rtada): yuk shu yerdan ortiladi */}
    <rect x="86" y="168" width="104" height="10" rx="3" fill="url(#d15plat)"/>
    <rect x="86" y="178" width="104" height="6" rx="2" fill="#B79B70" opacity="0.8"/>
    {/* RELSLAR: platformadan shaharga (perspektiva) */}
    <g>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const t = i / 7;
        const y = 196 - t * 44;
        const half = 78 - t * 62;
        const cx = 150 + t * 168;
        return <rect key={`sl${i}`} x={cx - half / 2} y={y} width={half} height={3 - t * 1.6} rx="1" fill="#A98C64" opacity={0.85 - t * 0.3}/>;
      })}
      <path d="M112 200 L308 154" stroke="#8E8A82" strokeWidth="2.4"/>
      <path d="M190 200 L330 154" stroke="#8E8A82" strokeWidth="2.4"/>
    </g>
    {/* yerdagi mayda gullar */}
    {[[210, '#8FE0D0'], [240, '#F0A0C8'], [268, '#8FD8F0'], [98, '#C6A6F0']].map(([x, col], i) => (
      <g key={`fl${i}`} transform={`translate(${x} 214)`}>
        <path d="M0 0 v-8" stroke="#6FBF8E" strokeWidth="1.4"/><circle className="lm-glow" style={{ animationDelay: `${i * 0.4}s` }} cx="0" cy="-10" r="2.8" fill={col}/>
      </g>
    ))}
  </svg>
);

// Sahna + ekipaj (Dars13 LessonScene naqshi, faqat fon boshqa).
const YardScene = ({ gathered = false }) => {
  const kid = ({ key, El, hook }, i) => (
    <span key={key} className="lm-crew lm-crew-kid g1-pop-in" style={{ animationDelay: `${0.25 + i * 0.12}s` }}>
      <El {...(gathered ? { mood: 'happy', pose: 'happy' } : hook)}/>
    </span>
  );
  return (
    <div className="lm-scene">
      <YardBg/>
      <div className="lm-scene-cast">
        {LUMO_CAST.slice(0, 2).map(kid)}
        <span className={`lm-crew lm-crew-host ${gathered ? 'd2-bit-cheer' : 'lm-bob'}`}><span className="g1-cast-fig"><BitSVG state={gathered ? 'happy' : 'present'}/></span></span>
        {LUMO_CAST.slice(2).map((c, i) => kid(c, i + 2))}
      </div>
    </div>
  );
};


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

// --- VAGONETKA (D15 asosiy rekviziti): relsda platforma, ustida SHAFFOF yashiklar,
// har yashikda 5 lampa ko'rinadi. `revealed` — nechta yashik ochiq; qolganlari MATO ostida.
// `tag` — yog'och yorliq (накладная) qiymati. Metodist qoidasi: rekvizit birinchi qarashda
// tanilsin, xuk ekranida animatsiya YO'Q.
const CRATE_LAMPS = [0, 1, 2, 3, 4];
const CargoCart = ({ crates = 8, per = 5, revealed = 0, covered = true, tag = null, tagCap = '', note = '', moving = false }) => (
  <div className={`d15-cart ${moving ? 'd15-cart-go' : ''}`}>
    {tag !== null && (
      <span className="d15-tagrow">
        <span className="d15-tag">
          <span className="mono d15-tag-num">{tag}</span>
          {tagCap ? <span className="d15-tag-cap">{tagCap}</span> : null}
        </span>
        {note ? <span className="d15-tag-note">{note}</span> : null}
      </span>
    )}
    <div className="d15-cart-bed">
      <div className="d15-crates">
        {Array.from({ length: crates }).map((_, i) => (
          i < revealed ? (
            <span key={i} className="d15-crate g1-pop-in" style={{ animationDelay: `${i * 0.12}s` }}>
              {CRATE_LAMPS.slice(0, per).map((k) => (
                <span key={k} className="d15-crate-lamp"><Chiroq/></span>
              ))}
            </span>
          ) : (
            covered ? null : <span key={i} className="d15-crate d15-crate-empty"/>
          )
        ))}
        {covered && revealed < crates && (
          <span className="d15-cover" style={{ flex: crates - revealed }}>
            <span className="d15-cover-txt mono">?</span>
          </span>
        )}
      </div>
      <div className="d15-cart-frame"/>
      <span className="d15-wheel d15-wheel-l"/>
      <span className="d15-wheel d15-wheel-r"/>
    </div>
    <div className="d15-rail"/>
  </div>
);

// --- SON UCHBURCHAGI (darslik 27-darsining 5-topshirig'i: 150 / 50 va 3 dan to'rt yozuv).
// Bizda uchlik 40 / 5 va 8. `shown` — nechta yozuv ochilgan (0..4).
const FamilyTriangle = ({ top, left, right, rows, shown = 0, lang }) => (
  <div className="d15-trirow">
    <div className="d15-tri">
      <svg viewBox="0 0 160 108" className="d15-tri-svg" aria-hidden="true">
        <path d="M80 16 L20 92 M80 16 L140 92 M20 92 L140 92" stroke="#D9C9A6" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
      </svg>
      <span className="mono d15-tri-node d15-tri-top">{top}</span>
      <span className="mono d15-tri-node d15-tri-left">{left}</span>
      <span className="mono d15-tri-node d15-tri-right">{right}</span>
    </div>
    <div className="d15-trilist">
      {rows.map((r, i) => (i < shown) && (
        <span key={i} className="d15-trirec lm-reveal" style={{ animationDelay: `${i * 0.12}s` }}>
          <span className="mono d15-trirec-expr">{r.expr}</span>
          <span className="d15-trirec-cap">{r.cap[lang]}</span>
        </span>
      ))}
    </div>
  </div>
);



// --- FACTCARD QAHRAMONI: ko'rshapalak va qaytadigan tovush to'lqini (teskari amal).
const BatFig = () => (
  <svg viewBox="0 0 200 120" style={{ width: 'min(280px, 86%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <defs>
      <linearGradient id="d15bat" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7E6BA8"/><stop offset="100%" stopColor="#5A4A80"/></linearGradient>
    </defs>
    {/* qoya (tovush qaytadigan devor) */}
    <path d="M168 112 L168 24 Q182 32 186 48 L186 112 Z" fill="#C8BFAE"/>
    <path d="M168 112 L168 24 Q160 40 162 60 L162 112 Z" fill="#B4A992" opacity="0.7"/>
    {/* tovush to'lqini: boradi va qaytadi */}
    <g fill="none" stroke="#8FD8F0" strokeWidth="2.4" strokeLinecap="round">
      <path className="d15-wave" d="M78 52 Q98 60 118 52"/>
      <path className="d15-wave" style={{ animationDelay: '0.5s' }} d="M78 64 Q104 74 130 64"/>
      <path className="d15-wave" style={{ animationDelay: '1s' }} d="M78 76 Q110 88 142 76"/>
    </g>
    {/* ko'rshapalak */}
    <g transform="translate(52 60)">
      <path d="M0 0 q-22 -18 -40 -10 q10 6 12 16 q-8 -2 -14 2 q14 6 20 14 q10 -6 22 -4Z" fill="url(#d15bat)"/>
      <path d="M0 0 q22 -18 40 -10 q-10 6 -12 16 q8 -2 14 2 q-14 6 -20 14 q-10 -6 -22 -4Z" fill="url(#d15bat)" opacity="0.92"/>
      <ellipse cx="0" cy="2" rx="8" ry="11" fill="#6B5A94"/>
      <path d="M-6 -8 l-3 -10 l7 5Z" fill="#6B5A94"/><path d="M6 -8 l3 -10 l-7 5Z" fill="#6B5A94"/>
      <circle cx="-3" cy="0" r="1.7" fill="#FFF3C4"/><circle cx="3" cy="0" r="1.7" fill="#FFF3C4"/>
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
        <div className="frame fade-up delay-1 d15-hook-scene" style={{ padding: 'clamp(8px, 1.8vw, 14px)', overflow: 'hidden' }}>
          <YardScene gathered={ok}/>
        </div>
        {picked === null && (
          <div className="frame fade-up delay-1" style={{ padding: 'clamp(6px, 1.2vw, 9px)' }}>
            <CargoCart crates={8} per={5} revealed={1} covered tag={40} tagCap={t(c.tag_cap)} note={t(c.crate_cap)}/>
          </div>
        )}
        <p className="fade-up delay-1" style={{ textAlign: 'center', color: T.ink2, fontWeight: 600, fontSize: 'clamp(13px, 1.8vw, 16px)', margin: 0 }}>{t(c.q)}</p>
        {picked === null && (
          <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
            {order.map((k, i) => (
              <button key={i} className="option" disabled={!canAct} onClick={() => pick(i)}
                style={{ padding: 'clamp(9px, 1.4vw, 12px)', fontSize: 'clamp(12px, 1.7vw, 15px)', minHeight: 'clamp(44px, 6.2vw, 54px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                {t(opts[k])}
              </button>
            ))}
          </div>
        )}
        {picked !== null && (
          <div className="fade-up" style={{ display: 'flex', justifyContent: 'center' }}>
            <button className={`option ${ok ? 'option-correct' : 'option-picked-wrong'}`} disabled
              style={{ padding: 'clamp(10px, 1.5vw, 12px) clamp(16px, 2.4vw, 22px)', fontSize: 'clamp(12px, 1.8vw, 16px)', minHeight: 'clamp(44px, 6.2vw, 54px)', width: 'auto', display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800 }}>
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

// s1 — KO'PRIK: ikki tayyor yozuv BITTALAB ochiladi (9-dars materiali)
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

// s2 — TESKARI YO'L: qirqdan yashiklar soniga (TAP bilan 3 qadam)
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
    { id: 's2_3', text: c.audio[lang][3], trigger: 'on_event:step3', waits_for: null },
    { id: 's2_4', text: c.audio[lang][4], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const { step, done, advance } = useTapSteps(audio, 4);
  const tap = () => { if (!canAct || done) return; sfx.playCorrect(); advance(); };
  const revealRef = useRevealScroll(done, 400);
  const canAdv = useAdvanceGate(done, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  const btnLabel = step === 0 ? c.btn1 : (step === 1 ? c.btn2 : c.btn3);
  const revealed = step >= 2 ? 8 : 1;
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.8vw, 12px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(8px, 1.8vw, 12px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
          <FrameFx/>
          <CargoCart crates={8} per={5} revealed={revealed} covered={step < 2} tag={40} tagCap={t(CONTENT.s0.tag_cap)}/>
          {step >= 1 && <span className="mono d15-step-expr lm-reveal">{step >= 3 ? '40 : 5 = 8' : '40 : 5'}</span>}
          {step >= 2 && (
            <span className="mono d15-count lm-reveal">
              {[5, 10, 15, 20, 25, 30, 35, 40].map((n, i) => (
                <span key={i} className="d15-count-tick" style={{ animationDelay: `${i * 0.09}s` }}>{n}</span>
              ))}
            </span>
          )}
          {step >= 3 && <span className="mono d15-res lm-reveal">{`8 ${t(c.count_cap)}`}</span>}
          {!done && (
            <button className="btn-white-accent" disabled={!canAct} onClick={tap}
              style={{ fontSize: 'clamp(13px, 2.1vw, 16px)' }}>{t(btnLabel)}</button>
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

// s3 — SON UCHBURCHAGI: bitta uchlik, to'rtta yozuv (darslik 27-dars, 5-topshiriq)
const Screen3 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s3;
  const audio = useAudio([
    brgSeg('s3', lang),
    ...c.audio[lang].map((text, i) => ({
      id: `s3_${i}`,
      text,
      trigger: i === 0 ? 'after_previous' : (i === 5 ? 'after_previous' : `on_event:step${i}`),
      waits_for: null
    }))
  ]);
  const canAct = useCanAnswer(audio);
  const { step, done, advance } = useTapSteps(audio, 5);
  const tap = () => { if (!canAct || done) return; sfx.playCorrect(); advance(); };
  const revealRef = useRevealScroll(done, 400);
  const canAdv = useAdvanceGate(done, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  const btnLabel = step === 0 ? c.btn1 : (step === 1 ? c.btn2 : (step === 2 ? c.btn3 : c.btn4));
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.8vw, 12px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(6px, 1.4vw, 10px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
          <FrameFx/>
          <FamilyTriangle top={40} left={5} right={8} rows={c.rows} shown={step} lang={lang}/>
          {step === 0 && <span className="d15-tri-hint">{t(c.tri_cap)}</span>}
          {!done && (
            <button className="btn-white-accent" disabled={!canAct} onClick={tap}
              style={{ fontSize: 'clamp(13px, 2.1vw, 16px)' }}>{t(btnLabel)}</button>
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

// s4 — SAVOL-OLDIN-QOIDA (qoida kartasi uch satr + darslik namunasi)
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
          {/* Metodist qoidasi 1: variantlar AYNAN 2x2 setkada (ustun ko'rinishi emas). */}
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

// s5 — BIT TUZOG'I (M1: noma'lum ko'paytuvchini ko'paytirish bilan qidirish)
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
          {c.lines.map((l, i) => (
            <span key={i} className="mono lm-reveal" style={{ animationDelay: `${i * 0.25}s`, fontSize: `clamp(${i === 2 ? 19 : 16}px, ${i === 2 ? 3.8 : 3}vw, ${i === 2 ? 28 : 22}px)`, fontWeight: 800, color: i === 2 ? '#C0392B' : T.ink }}>{l}</span>
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

// s6 — TEKSHIRISH XATONI TUTADI (darslik 26-beti): ikki panel (2 tap) + 1 savol
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
          style={{ animationDelay: `${i * 0.2}s`, color: i === 2 ? '#1F7A4D' : (i === 1 && tone === 'a' ? '#C0392B' : T.ink) }}>{l}</span>
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
                  style={{ padding: 'clamp(9px, 1.5vw, 12px)', fontSize: 'clamp(12px, 1.7vw, 15px)', minHeight: 'clamp(42px, 6vw, 52px)', fontWeight: 800 }}>{t(c.mc_opts[k])}</button>
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

// s7 — 5 SONIYA SOAT: variantlar AMAL ko'rinishida (javob emas)
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
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: t(c.q),
        correctAnswer: '56 : 7', studentAnswer: '56 : 7', correct: firstRef.current,
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
          <span className="mono d15-step-expr">{c.expr}</span>
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

// s8 — ASOSIY KO'NIKMA: NumPad x3 (noma'lum ko'paytuvchi va bo'linuvchi)
const Screen8 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s8;
  const audio = useAudio([
    brgSeg('s8', lang),
    { id: 's8_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [idx, setIdx] = useState(props.storedAnswer ? c.items.length : 0);
  const [val, setVal] = useState('');
  const [numLock, setNumLock] = useState(false);
  const [hintMsg, setHintMsg] = useState(null);
  const triedRef = useRef(false);
  const [score, setScore] = useState(props.storedAnswer ? (props.storedAnswer.studentAnswer | 0) : 0);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const firstAllRef = useRef(props.storedAnswer ? props.storedAnswer.firstTry : true);
  const it = c.items[Math.min(idx, c.items.length - 1)];
  const done = idx >= c.items.length;
  const revealRef = useRevealScroll(done, 400);
  // Ekran matnida belgi (☐ × 6 = 42), OVOZDA esa so'z bilan (KONTENT_3SINF.md «Ovoz variantlari»).
  useEffect(() => {
    if (done || audio.muted || !it.q_speech) return;
    const e = getAudioEngine(); if (e) e.pushOneOff(it.q_speech[lang]);
  }, [idx]);
  const check = () => {
    if (!canAct || numLock || val === '' || done) return;
    setNumLock(true);
    const isOk = parseInt(val, 10) === it.ans;
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((isOk ? c.audio.on_correct : it.hint)[lang]); }
    if (isOk) {
      sfx.playCorrect();
      if (!triedRef.current) setScore((s) => s + 1);
      setTimeout(() => { if (idx + 1 < c.items.length) setVal(''); setNumLock(false); setHintMsg(null); triedRef.current = false; setIdx((n) => n + 1); }, 1500);
    } else {
      triedRef.current = true;
      firstAllRef.current = false;
      setHintMsg(it.hint);
      setTimeout(() => { setVal(''); setNumLock(false); }, 1500);
    }
  };
  useEffect(() => {
    if (done && !recorded) {
      setRecorded(true);
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: 'numpad-skill',
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
            <div className="mono fade-up" style={{ textAlign: 'center', color: T.accent, fontWeight: 800 }}>{Math.min(idx + 1, c.items.length)} / {c.items.length}</div>
            <h1 className="title h-sub fade-up">{t(it.q)}</h1>
            <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(8px, 1.6vw, 12px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
              <FrameFx/>
              <NumPad value={done ? String(it.ans) : val} setValue={setVal} disabled={!canAct || numLock || done} max={3}/>
              <button className="btn-white-accent" disabled={!canAct || numLock || done || val === ''} onClick={check}>{lang === 'ru' ? 'Проверить' : 'Tekshir'}</button>
              {hintMsg && <p className="fade-up" style={{ margin: 0, color: T.ink2, fontSize: 'clamp(12px, 1.7vw, 14px)', textAlign: 'center' }}>{t(hintMsg)}</p>}
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

// s9 — TEST MC x3 (uchlik oilasi va terminlar)
const Screen9 = (props) => {
  const t = useT();
  const heading = (it) => t(it.q);
  const renderFig = (it) => <span className="mono" style={{ fontSize: 'clamp(20px, 4.4vw, 30px)', fontWeight: 800, color: T.ink }}>{it.expr}</span>;
  return <MCRoundD2 props={props} ck="s9" cols={2} heading={heading} renderFig={renderFig}/>;
};

// s10 — BONUS: `x` harfi (darslik 14 va 17-bet) + 1 savol
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
      trigger: i === 0 ? 'after_previous' : `on_event:step${i}`,
      waits_for: null
    }))
  ]);
  const canAct = useCanAnswer(audio);
  const { step, done: built, advance } = useTapSteps(audio, 5);
  const tapStep = () => { if (!canAct || built) return; sfx.playCorrect(); advance(); };
  const orderMC = React.useMemo(() => shuffleArr(c.mc_opts.map((_, i) => i)), []);
  const mcCi = orderMC.indexOf(c.mc_ci);
  const [picked, setPicked] = useState(null);
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const [hintMsg, setHintMsg] = useState(null);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const firstRef = useRef(true);
  const solved = picked === mcCi || props.storedAnswer?.correct === true;
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
  const btnLabel = step === 0 ? c.btn1 : (step === 1 ? c.btn2 : (step === 2 ? c.btn3 : c.btn4));
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.8vw, 12px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(6px, 1.4vw, 10px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
          <FrameFx/>
          {/* MC ochilgach qadamlar BITTA satrga yig'iladi: past ekranda (1366x768) skroll bo'lmaydi */}
          <div className={`d15-xrow ${built ? 'd15-xrow-flat' : ''}`}>
            {c.steps.map((s, i) => (i <= step) && (
              <span key={i} className={`mono d15-xline ${i === step && !built ? 'd15-xline-hot' : ''} ${i > 0 ? 'lm-reveal' : ''}`}>{s}</span>
            ))}
          </div>
          {step >= 1 && <span className="d15-booknote lm-reveal">{t(c.book_note)}</span>}
          {step >= 4 && <CheckStrip expr={c.steps[4]} ok/>}
          {!built && (
            <button className="btn-white-accent" disabled={!canAct} onClick={tapStep}
              style={{ fontSize: 'clamp(12px, 1.9vw, 15px)' }}>{t(btnLabel)}</button>
          )}
        </div>
        {built && (
          <div className="frame fade-up" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10, padding: 'clamp(10px, 2.2vw, 16px)' }}>
            <FrameFx/>
            <p className="fade-up" style={{ margin: 0, textAlign: 'center', color: T.ink2, fontWeight: 700, fontSize: 'clamp(12px, 1.8vw, 15px)' }}>{t(c.mc_q)}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(110px, 1fr))', gap: 10 }}>
              {orderMC.map((k, i) => (
                <button key={i} className={`option ${solved && i === mcCi ? 'option-correct' : ''} ${wrongSet.has(i) ? 'option-picked-wrong' : ''}`}
                  disabled={!canAct || solved || wrongSet.has(i)} onClick={() => pick(i)}
                  style={{ padding: 'clamp(8px, 1.4vw, 11px)', fontSize: 'clamp(12px, 1.7vw, 14px)', minHeight: 'clamp(40px, 5.6vw, 50px)', fontWeight: 800 }}>{t(c.mc_opts[k])}</button>
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

// s11 — TRENAJYOR NumPad x3: har javobdan keyin TEKSHIRISH satri (darslik talabi)
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
      setTimeout(() => { setVal(''); setNumLock(false); }, 1500);
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
            <div className="mono fade-up" style={{ textAlign: 'center', color: T.accent, fontWeight: 800 }}>{Math.min(idx + 1, c.items.length)} / {c.items.length}</div>
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
            <Reaction state="correct" praise={`${score} / ${c.items.length}`}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s12 — MASALA: avval YOZUVNI tanlash, keyin javob, keyin TEKSHIRISH
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
    else { firstRef.current = false; setHintMsg(c.audio.on_wrong); setTimeout(() => { setVal(''); setNumLock(false); }, 1500); }
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
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(4px, 1vw, 8px)', padding: 'clamp(8px, 1.8vw, 14px)' }}>
          <FrameFx/>
          <CargoCart crates={6} per={5} revealed={solved ? 6 : 0} covered={!solved} tag={54} tagCap={t(CONTENT.s0.tag_cap)} moving={solved}/>
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
              {/* Javob berilgach klaviatura yopiladi (savol, yozuv va javob ekranda qoladi):
                  bu ekranda vagonetka ham bor, aks holda 1366x768 da skroll chiqadi. */}
              {!solved && (
                <>
                  <NumPad value={val} setValue={setVal} disabled={!canAct || numLock} max={3}/>
                  <button className="btn-white-accent" disabled={!canAct || numLock || val === ''} onClick={check}>{lang === 'ru' ? 'Проверить' : 'Tekshir'}</button>
                </>
              )}
              {solved && <span className="mono d15-res lm-reveal">{`${c.ans} ${lang === 'ru' ? 'ящиков' : 'yashik'}`}</span>}
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

// s13 — FINAL 5 savol + FactCard (freym OSTIDA, orbital anim)
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
                      style={{ padding: 'clamp(9px, 1.5vw, 12px)', fontSize: 'clamp(13px, 2vw, 17px)', minHeight: 'clamp(42px, 6vw, 52px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>
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
              <div className="d2-fact-hero"><BatFig/></div>
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
        {/* yakuniy sahna — ETALON o'lchamida (Dars01 s14): vagonetka shaharga jo'nadi */}
        <div className="d15-final-scene fade-up delay-1"><YardScene gathered/></div>
      </div>
    </Stage>
  );
};

// ============================================================
// KORNEVOY KOMPONENT (shablon: infrastructure_v1 / grade1 Dars28)
// ============================================================
export default function CompLinkLesson({
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
.lm-digchip { width: clamp(42px, 9vw, 56px); height: clamp(42px, 9vw, 56px); border: none; border-radius: 12px; background: #FFFFFF; font-size: clamp(22px, 4.6vw, 32px); font-weight: 800; color: #3A3530; cursor: pointer; box-shadow: 0 3px 10px -4px rgba(58,53,48,0.35); transition: transform 0.12s; }
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
.d15-hook-scene .lm-scene { width: min(100%, calc(clamp(180px, calc(100dvh - 570px), 372px) * 400 / 210)); }
.d15-final-scene .lm-scene { width: min(100%, calc(clamp(200px, calc(100dvh - 560px), 372px) * 400 / 210)); }
/* --- VAGONETKA --- */
.d15-cart { display: flex; flex-direction: column; align-items: center; gap: 4px; width: 100%; }
.d15-cart-go { animation: d15roll 1.6s cubic-bezier(.4,0,.6,1) both; }
@keyframes d15roll { from { transform: translateX(0); } to { transform: translateX(14%); } }
.d15-tag { display: inline-flex; align-items: center; gap: 7px; background: #E2CFAE; border: 2px solid #B79B70;
  border-radius: 8px; padding: 2px 10px; box-shadow: 0 2px 0 rgba(122,98,64,.35); }
.d15-tag-num { font-size: clamp(16px, 3.2vw, 22px); font-weight: 800; color: #4A3A22; }
.d15-tag-cap { font-size: clamp(9px, 1.4vw, 11px); font-weight: 700; color: #7A6240; text-transform: uppercase; letter-spacing: .5px; }
.d15-cart-bed { position: relative; width: 100%; max-width: 520px; padding: 4px 8px 10px; }
.d15-crates { display: flex; align-items: flex-end; gap: clamp(3px, 0.8vw, 6px); min-height: clamp(24px, 6vw, 40px); }
.d15-crate { flex: 1; display: grid; grid-template-columns: repeat(5, 1fr); gap: 1px; align-items: center;
  padding: clamp(3px, 0.8vw, 5px) 2px; border: 2px solid #A9C4D8; border-radius: 5px;
  background: rgba(226,242,251,.72); box-shadow: inset 0 1px 0 rgba(255,255,255,.8); }
.d15-crate-empty { background: rgba(226,242,251,.3); border-style: dashed; min-height: clamp(20px, 5vw, 32px); }
.d15-crate-lamp { display: inline-flex; width: 100%; aspect-ratio: 1; }
.d15-crate-lamp svg { width: 100%; height: 100%; }
.d15-cover { display: flex; align-items: center; justify-content: center; align-self: stretch; min-height: clamp(22px, 5.4vw, 36px);
  border-radius: 6px; background: linear-gradient(160deg, #C9B7A0, #A9917A); border: 2px solid #8E7862;
  box-shadow: inset 0 2px 6px rgba(0,0,0,.12); }
.d15-cover-txt { font-size: clamp(15px, 3vw, 21px); font-weight: 800; color: #FFF6E6; }
.d15-cart-frame { height: 7px; border-radius: 3px; background: linear-gradient(180deg, #C6AE82, #A98C64); margin-top: 4px; }
.d15-wheel { position: absolute; bottom: -1px; width: clamp(12px, 3vw, 17px); height: clamp(12px, 3vw, 17px);
  border-radius: 50%; background: #6E6A62; border: 2px solid #4E4A44; }
.d15-wheel-l { left: 16%; }
.d15-wheel-r { right: 16%; }
.d15-rail { width: 100%; max-width: 560px; height: 4px; border-radius: 2px; background: #8E8A82; }
.d15-tagrow { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 8px; }
.d15-tag-note { font-size: clamp(10px, 1.5vw, 12px); font-weight: 700; color: #5A5A60; }
/* --- SON UCHBURCHAGI (darslik topshirig'i) --- */
.d15-trirow { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: clamp(10px, 2.4vw, 22px); width: 100%; }
.d15-tri { position: relative; width: clamp(130px, 30vw, 180px); aspect-ratio: 160 / 108; }
.d15-tri-svg { position: absolute; inset: 0; width: 100%; height: 100%; }
.d15-tri-node { position: absolute; transform: translate(-50%, -50%); background: #FFFFFF; border: 2px solid #E6D9BC;
  border-radius: 9px; padding: 2px 9px; font-size: clamp(14px, 2.8vw, 19px); font-weight: 800; color: #0E0E10;
  box-shadow: 0 2px 0 rgba(190,170,130,.4); }
.d15-tri-top { left: 50%; top: 12%; }
.d15-tri-left { left: 13%; top: 86%; }
.d15-tri-right { left: 87%; top: 86%; }
.d15-tri-hint { font-size: clamp(11px, 1.6vw, 13px); font-weight: 700; color: #5A5A60; text-align: center; }
.d15-trilist { display: flex; flex-direction: column; gap: 5px; min-width: clamp(150px, 40vw, 240px); }
.d15-trirec { display: flex; flex-direction: column; gap: 1px; padding: 5px 10px; border-radius: 9px;
  background: #F6F4EF; border-left: 3px solid #FF4F28; }
.d15-trirec-expr { font-size: clamp(14px, 2.6vw, 19px); font-weight: 800; color: #0E0E10; }
.d15-trirec-cap { font-size: clamp(9.5px, 1.4vw, 11.5px); font-weight: 700; color: #5A5A60; }
/* --- TEKSHIRISH SATRI --- */
.d15-check { display: inline-flex; align-items: center; gap: 8px; padding: 4px 12px; border-radius: 999px;
  background: #E3F0E8; border: 2px solid #9CCBB0; }
.d15-check-no { background: #FDE8E4; border-color: #E9AFA2; }
.d15-check-sign { font-size: clamp(12px, 1.8vw, 15px); font-weight: 800; color: #1F7A4D; }
.d15-check-no .d15-check-sign { color: #C0392B; }
.d15-check-expr { font-size: clamp(13px, 2.2vw, 17px); font-weight: 800; color: #0E0E10; }
.d15-check-cap { font-size: clamp(9.5px, 1.4vw, 11.5px); font-weight: 700; color: #5A5A60; text-transform: uppercase; letter-spacing: .4px; }
/* --- TESKARI YO'L (s2) --- */
.d15-step-expr { font-size: clamp(19px, 4vw, 27px); font-weight: 800; color: #0E0E10; letter-spacing: 1px; }
.d15-count { display: inline-flex; flex-wrap: wrap; justify-content: center; gap: 4px 8px; }
.d15-count-tick { font-size: clamp(11px, 1.8vw, 14px); font-weight: 800; color: #7A6240;
  animation: revealSoft .4s ease-out both; }
.d15-res { font-size: clamp(17px, 3.4vw, 24px); font-weight: 800; color: #1F7A4D; }
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
.d15-xrow { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.d15-xline { font-size: clamp(16px, 3.2vw, 23px); font-weight: 800; color: #5A5A60; letter-spacing: 1px; }
.d15-xline-hot { color: #FF4F28; }
.d15-xrow-flat { flex-direction: row; flex-wrap: wrap; justify-content: center; gap: 4px 12px; }
.d15-xrow-flat .d15-xline { font-size: clamp(13px, 2.4vw, 17px); }
.d15-booknote { font-size: clamp(9.5px, 1.4vw, 11.5px); font-weight: 700; color: #5A5A60; text-transform: uppercase; letter-spacing: .4px; }
/* --- FACTCARD: tovush to'lqini borib qaytadi --- */
.d15-wave { animation: d15wave 2.6s ease-in-out infinite; }
@keyframes d15wave {
  0%, 100% { opacity: 0; transform: translateX(0); }
  35% { opacity: 1; transform: translateX(18px); }
  70% { opacity: .5; transform: translateX(0); }
}
@media (prefers-reduced-motion: reduce) {
  .d15-cart-go, .d15-wave, .d15-count-tick { animation: none; }
}
`;
