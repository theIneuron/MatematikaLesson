import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { BackLabel, BitSVG, CheckStrip, Chiroq, Confetti, D2Defs, D2Motes, FREE_NAV, FeedbackBlock, FoldRow, FrameFx, GradientDefs, HeroContext, LUMO_CAST, LangContext, Lenta, NavBack, NavNext, NextLabel, Panel, ProgressContext, Reaction, ReadinessMeter, Stage, StageHero, T, TaskTable, configureLesson, getAudioEngine, nextPraise, npKey, shuffleArr, ttsConfig, useAdvanceGate, useAudio, useCanAnswer, useLang, useMobileZoom, usePrefersReducedMotion, useRevealScroll, useSfx, useT, useTapSteps, makeBrgSeg } from './_kit/index.jsx';
import { BASE_STYLES } from './_kit/styles.js';

// ============================================================================
// DD 3-SINF | Dars18 — "Ikki xonali sonni bir xonaliga bo'lish" (num-3-18) | Б3
// Syujet: «taqsimot rafi» (SYUJET_3SINF.md 160-satr). Ustaxonaga 86 ta detal keladi,
//   ularni ikki tokchaga TENG terish kerak; jadval bunday sonni bilmaydi.
// SAHNA: blokka BITTA fon (metodist qarori 2026-08-06) — 17-darsning ustaxonasi;
//   ishchi tugun BOSHQA: yig'ish stoli o'rniga TAQSIMOT RAFI (ikki bo'limli tokcha,
//   tepasida buyurtma yorlig'i 86).
// MEXANIKA (yangi mexanika YARATILMAGAN): MC xuk, TAP bilan ochilish (ikki ekran),
//   savol-oldin-qoida, konsol qismlab (15-dars), tokchaga saralash (16-dars),
//   bitta savolli MC va NumPad (17-dars), xatoni top, BONUS (tanlash + MC),
//   masala jadval bilan, final panel + FactCard.
// DARSLIK ASOSI (Burxonov, 3-sinf, «Sharq» 2019):
//   24-bet «Yig'indini songa bo'lish»: 86 : 2 = (80 + 6) : 2 = 40 + 3 = 43 (dosloven);
//   25-bet «42 : 3, 72 : 4»: 42 : 3 = (30 + 12) : 3 = 10 + 4 = 14 (dosloven);
//   27-bet «Ikki xonali sonni ikki xonali songa bo'lish»: 36 : 12 podbor bilan — BONUS s9;
//   25-bet 5-topshiriq tuzilishi — s12 masalasi.
// YADRO: 86 : 2 (xonalar to'g'ri keladi) va 42 : 3 (xonalar TO'G'RI KELMAYDI — darsning
//   yangiligi). 96 : 3 ISHLATILMAYDI: u 12-dars yadrosi.
// Misconception: M1 faqat o'nlikni bo'lish; M2 xonalarni zo'rlash; M3 bo'luvchini ajratish;
//   M4 bo'linmalarni qo'shmaslik.
// FactCard: qismlarni har xil tanlash mumkin, javob bir xil (86 : 2 uch xil ajratishda 43).
// Kontent: src/books/grade3/KONTENT_3SINF.md, «Dars 18». Karkas: BLOK_B3_KARKAS.md.
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
  lessonId: 'num-3-18',
  lessonTitle: { ru: 'Урок 18. Деление двузначного на однозначное', uz: "18-dars. Ikki xonali sonni bir xonaliga bo'lish" }
};
// STRUKTURA (KONTENT_3SINF.md «Dars 18»): s0 xuk 86:2 · s1 ajratish 80+6 · s2 burilish
// 42:3 · s3 savol-oldin-QOIDA · s4 konsol 84:6 · s5 yozuvni tanlash 48:3 · s6 saralash ·
// s7 trenajyor 91:7 · s8 xatoni top 96:8 · s9 BONUS 36:12 · s10 trenajyor 88:8 ·
// s11 test 63:3 · s12 masala · s13 final 3 misol + FactCard · s14 yakun.
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'MCScreen', scored: false, scope: 'hook' },
  { id: 's1',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's4',  type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's5',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's6',  type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's7',  type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's8',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's9',  type: 'exploration', template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's10', type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's11', type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
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
    topic: { ru: 'Деление двузначного на однозначное', uz: "Ikki xonalini bir xonaliga bo'lish" },
    lead: { ru: 'В мастерскую привезли 86 деталей на 2 полки', uz: "Ustaxonaga 2 tokcha uchun 86 ta detal keldi" },
    order_cap: { ru: 'заказ: 86 деталей, 2 полки поровну', uz: 'buyurtma: 86 detal, 2 tokchaga tengdan' },
    q: { ru: 'Сколько деталей окажется на каждой полке?', uz: "Har bir tokchada nechta detal bo'ladi?" },
    opt0: { ru: '43', uz: '43' },
    opt1: { ru: '40', uz: '40' },
    opt2: { ru: '44', uz: '44' },
    opt3: { ru: '806', uz: '806' },
    audio: {
      intro: {
        ru: [
          'Тема урока называется деление двузначного числа на однозначное.',
          'В мастерскую привезли восемьдесят шесть деталей. Их надо разложить на две полки поровну.',
          'Таблица деления такого числа не знает. Значит, будем делить по частям.',
          'Как думаешь, сколько деталей окажется на каждой полке?'
        ],
        uz: [
          "Dars mavzusi ikki xonali sonni bir xonali songa bo'lish deb ataladi.",
          "Ustaxonaga sakson oltita detal keldi. Ularni ikki tokchaga teng qilib terish kerak.",
          "Bo'lish jadvali bunday sonni bilmaydi. Demak, qismlarga bo'lib bo'lamiz.",
          "Sizningcha, har bir tokchada nechta detal bo'ladi?"
        ]
      },
      on_correct: {
        ru: 'Верно! А сейчас увидишь, как это считают быстро и без подбора.',
        uz: "To'g'ri! Endi buni tez va taxminsiz qanday hisoblashni ko'rasiz."
      },
      on_wrong1: {
        ru: 'Разделили только восемьдесят. Шесть деталей остались лежать в ящике.',
        uz: "Faqat sakson bo'lindi. Oltita detal yashikda qolib ketdi."
      },
      on_wrong2: {
        ru: 'На две полки поровну это половина. Половина восьмидесяти шести меньше сорока четырёх.',
        uz: "Ikki tokchaga tengdan bu yarmi. Sakson oltining yarmi qirq to'rtdan kichik."
      },
      on_idk: {
        ru: 'Каждая цифра разделена отдельно, а ответы склеены. Так число рассыпается.',
        uz: "Har bir raqam alohida bo'lingan, javoblar esa yelimlangan. Bunda son buzilib ketadi."
      }
    }
  },

  s1: {
    eyebrow: { ru: 'Разбираем', uz: 'Ajratamiz' },
    lead: { ru: 'Разберём 86 на удобные части', uz: "86 ni qulay qismlarga ajratamiz" },
    plate: '86',
    part1: '80',
    part2: '6',
    res1: '80 : 2 = 40',
    res2: '6 : 2 = 3',
    formula: '86 : 2 = 40 + 3 = 43',
    btn1: { ru: 'Разделить число', uz: 'Sonni ajratish' },
    btn2: { ru: 'Разделить каждую часть', uz: "Har qismni bo'lish" },
    btn3: { ru: 'Сложить', uz: "Qo'shish" },
    done_text: { ru: 'Части делятся легко, а вместе они дают ответ.', uz: "Qismlar oson bo'linadi, birgalikda esa javobni beradi." },
    audio: {
      ru: [
        'Разберём восемьдесят шесть на удобные части.',
        'Восемьдесят и шесть. Обе части делятся на два.',
        'Восемьдесят на два, сорок. Шесть на два, три.',
        'Складываем частные. Сорок и три, сорок три. На каждой полке сорок три детали.'
      ],
      uz: [
        "Sakson oltini qulay qismlarga ajratamiz.",
        "Sakson va olti. Ikkala qism ham ikkiga bo'linadi.",
        "Saksonni ikkiga bo'lsak, qirq. Oltini ikkiga bo'lsak, uch.",
        "Bo'linmalarni qo'shamiz. Qirq va uch, qirq uch. Har bir tokchada qirq uchta detal."
      ]
    }
  },

  s2: {
    eyebrow: { ru: 'Поворот', uz: 'Burilish' },
    lead: { ru: 'А теперь 42 : 3 — разряды не подойдут', uz: "Endi 42 : 3 — xonalar to'g'ri kelmaydi" },
    try_line: '42 = 40 + 2',
    try_cap: { ru: '40 на 3 не делится', uz: "40 uchga bo'linmaydi" },
    good_line: '42 = 30 + 12',
    good_cap: { ru: 'обе части делятся на 3', uz: "ikkala qism ham 3 ga bo'linadi" },
    res: '42 : 3 = 10 + 4 = 14',
    btn1: { ru: 'Взять разряды', uz: 'Xonalarni olish' },
    btn2: { ru: 'Искать другие части', uz: 'Boshqa qismlarni qidirish' },
    btn3: { ru: 'Сосчитать', uz: 'Hisoblash' },
    done_text: { ru: 'Части выбирают не по разрядам, а по тому, что делится.', uz: "Qismlar xonalarga qarab emas, bo'linishiga qarab tanlanadi." },
    audio: {
      ru: [
        'А теперь сорок два разделить на три. Возьмём разряды, как привыкли.',
        'Сорок на три не делится. Разряды тут не помогли.',
        'Ищем другие части. Тридцать и двенадцать. Обе делятся на три.',
        'Тридцать на три, десять. Двенадцать на три, четыре. Вместе четырнадцать.'
      ],
      uz: [
        "Endi qirq ikkini uchga bo'lamiz. Odatdagidek xonalarni olamiz.",
        "Qirqni uchga bo'lib bo'lmaydi. Xonalar bu yerda yordam bermadi.",
        "Boshqa qismlarni qidiramiz. O'ttiz va o'n ikki. Ikkalasi ham uchga bo'linadi.",
        "O'ttizni uchga bo'lsak, o'n. O'n ikkini uchga bo'lsak, to'rt. Birgalikda o'n to'rt."
      ]
    }
  },

  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    q: { ru: 'Как выбрать части, на которые разбиваем число?', uz: 'Sonni qaysi qismlarga ajratishni qanday tanlaymiz?' },
    opts: [
      { ru: 'чтобы каждая часть делилась на делитель', uz: "har bir qism bo'luvchiga bo'linsin" },
      { ru: 'всегда по разрядам, десятки и единицы', uz: "doim xonalarga, o'nlik va birlik" },
      { ru: 'чтобы части были одинаковыми', uz: "qismlar bir xil bo'lsin" },
      { ru: 'чтобы первая часть была больше', uz: "birinchi qism kattaroq bo'lsin" }
    ],
    ci: 0,
    hints: {
      1: { ru: 'В сорок два разряды дали сорок, а сорок на три не делится. Значит, не всегда.', uz: "Qirq ikkida xonalar qirqni berdi, qirq esa uchga bo'linmaydi. Demak, doim emas." },
      2: { ru: 'Тридцать и двенадцать разные, а приём сработал.', uz: "O'ttiz va o'n ikki har xil, usul esa ishladi." },
      3: { ru: 'Размер частей не решает. Решает то, делятся они или нет.', uz: "Qismlarning kattaligi hal qilmaydi. Bo'linadimi yoki yo'qmi, asosiysi shu." }
    },
    on_correct: { ru: 'Верно! Части выбираем по делимости.', uz: "To'g'ri! Qismlarni bo'linishiga qarab tanlaymiz." },
    rule_lines: {
      ru: [
        'разбей число на два слагаемых',
        'каждое должно делиться на делитель',
        'раздели каждое и сложи частные'
      ],
      uz: [
        "sonni ikki qo'shiluvchiga ajrating",
        "har biri bo'luvchiga bo'linsin",
        "har birini bo'lib, bo'linmalarni qo'shing"
      ]
    },
    rule_ex: '86 : 2 = 40 + 3 = 43 · 42 : 3 = 10 + 4 = 14',
    rule_speech: {
      ru: 'Правило такое. Разбиваем число на две части, но не как попало, а так, чтобы каждая делилась. Делим каждую часть и складываем то, что вышло.',
      uz: "Qoida shunday. Sonni ikki qismga ajratamiz, lekin qanday bo'lsa unday emas, har biri bo'linadigan qilib. Har qismni bo'lamiz va chiqqanini qo'shamiz."
    },
    audio: {
      intro: { ru: 'Теперь главный вопрос урока.', uz: 'Endi darsning asosiy savoli.' }
    }
  },

  s4: {
    eyebrow: { ru: 'Консоль', uz: 'Konsol' },
    lead: { ru: '84 : 6 — заполни консоль по частям', uz: "84 : 6 — konsolni qismlab to'ldiring" },
    swap_line: '84 = 60 + 24',
    cells: [
      { head: { ru: 'первая часть', uz: 'birinchi qism' }, label: '60 : 6', ans: 10, hint: { ru: 'Шестьдесят разделить на шесть.', uz: "Oltmishni oltiga bo'ling." } },
      { head: { ru: 'вторая часть', uz: 'ikkinchi qism' }, label: '24 : 6', ans: 4, hint: { ru: 'Двадцать четыре разделить на шесть.', uz: "Yigirma to'rtni oltiga bo'ling." } },
      { head: { ru: 'вместе', uz: 'birgalikda' }, label: '10 + 4', ans: 14, hint: { ru: 'Сложи десять и четыре.', uz: "O'n bilan to'rtni qo'shing." } }
    ],
    check: '10 + 4 = 14',
    check_label: { ru: 'проверка', uz: 'tekshirish' },
    audio: {
      intro: { ru: 'Восемьдесят четыре разделить на шесть. Восемьдесят на шесть не делится, поэтому части взяли другие: шестьдесят и двадцать четыре.', uz: "Sakson to'rtni oltiga bo'lamiz. Saksonni oltiga bo'lib bo'lmaydi, shuning uchun qismlar boshqa olindi: oltmish va yigirma to'rt." },
      on_correct: { ru: 'Верно! Десять и четыре, четырнадцать.', uz: "To'g'ri! O'n va to'rt, o'n to'rt." }
    }
  },

  s5: {
    eyebrow: { ru: 'Тест', uz: 'Test' },
    q: { ru: '48 : 3. Какое разбиение подходит?', uz: "48 : 3. Qaysi ajratish to'g'ri keladi?" },
    opts: [
      { ru: '(30 + 18) : 3', uz: '(30 + 18) : 3' },
      { ru: '(40 + 8) : 3', uz: '(40 + 8) : 3' },
      { ru: '(45 + 3) : 3', uz: '(45 + 3) : 3' },
      { ru: '48 : (1 + 2)', uz: '48 : (1 + 2)' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Сорок на три не делится, и восемь тоже. Обе части не подошли.', uz: "Qirq uchga bo'linmaydi, sakkiz ham. Ikkala qism ham to'g'ri kelmadi." },
      2: { ru: 'Обе части и правда делятся. Но сорок пять на три в уме считать долго, возьми части попроще.', uz: "Ikkala qism ham bo'linadi, bu to'g'ri. Lekin qirq beshni uchga og'zaki hisoblash uzoq, soddaroq qismlarni oling." },
      3: { ru: 'Здесь разделили делитель, а не делимое. Делят то, что раздают.', uz: "Bu yerda bo'luvchi ajratilgan, bo'linuvchi emas. Taqsimlanadigan narsa bo'linadi." }
    },
    audio: {
      intro: { ru: 'Сорок восемь разделить на три. Выбери удобное разбиение.', uz: "Qirq sakkizni uchga bo'lamiz. Qulay ajratishni tanlang." },
      on_correct: { ru: 'Верно! Тридцать на три, десять. Восемнадцать на три, шесть. Всего шестнадцать.', uz: "To'g'ri! O'ttizni uchga, o'n. O'n sakkizni uchga, olti. Jami o'n olti." },
      on_wrong: { ru: 'Проверь обе части: каждая должна делиться на три.', uz: "Ikkala qismni tekshiring: har biri uchga bo'linishi kerak." }
    }
  },

  s6: {
    eyebrow: { ru: 'Сортировка', uz: 'Saralash' },
    lead: { ru: 'Разложи примеры по полкам', uz: 'Misollarni tokchalarga ajrating' },
    bin_a: { ru: 'разряды подходят', uz: "xonalar to'g'ri keladi" },
    bin_b: { ru: 'нужны другие части', uz: 'boshqa qismlar kerak' },
    items: [
      { n: '66 : 6', a: true, hint: { ru: 'Шестьдесят на шесть делится, и шесть тоже. Разряды подошли.', uz: "Oltmish oltiga bo'linadi, olti ham. Xonalar to'g'ri keldi." } },
      { n: '91 : 7', a: false, hint: { ru: 'Девяносто на семь не делится. Нужны другие части: семьдесят и двадцать один.', uz: "To'qsonni yettiga bo'lib bo'lmaydi. Boshqa qismlar kerak: yetmish va yigirma bir." } },
      { n: '84 : 4', a: true, hint: { ru: 'Восемьдесят на четыре делится, и четыре тоже.', uz: "Sakson to'rtga bo'linadi, to'rt ham." } },
      { n: '72 : 3', a: false, hint: { ru: 'Семьдесят на три не делится. Возьми шестьдесят и двенадцать.', uz: "Yetmishni uchga bo'lib bo'lmaydi. Oltmish va o'n ikkini oling." } }
    ],
    audio: {
      intro: { ru: 'Разложи примеры по полкам. Слева те, где разряды подходят, справа те, где нужны другие части.', uz: "Misollarni tokchalarga ajrating. Chapda xonalar to'g'ri keladiganlari, o'ngda boshqa qism kerak bo'lganlari." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Проверь первую часть: делится ли она нацело.', uz: "Birinchi qismni tekshiring: u butun bo'linadimi." }
    }
  },

  s7: {
    eyebrow: { ru: 'Тренажёр', uz: 'Trenajyor' },
    q: { ru: '91 : 7. Набери ответ.', uz: "91 : 7. Javobni tering." },
    ans: 13,
    check: '70 : 7 + 21 : 7 = 10 + 3',
    check_label: { ru: 'проверка', uz: 'tekshirish' },
    hint: { ru: 'Девяносто на семь не делится. Возьми семьдесят и двадцать один.', uz: "To'qsonni yettiga bo'lib bo'lmaydi. Yetmish va yigirma birni oling." },
    audio: {
      intro: { ru: 'Девяносто один разделить на семь. Части ты только что нашёл на полке.', uz: "To'qson birni yettiga bo'ling. Qismlarni hozirgina tokchada topdingiz." },
      on_correct: { ru: 'Верно! Десять и три, тринадцать.', uz: "To'g'ri! O'n va uch, o'n uch." }
    }
  },

  s8: {
    eyebrow: { ru: 'Найди ошибку', uz: 'Xatoni toping' },
    q: { ru: 'Здесь начали делить и застряли. В чём ошибка?', uz: "Bu yerda bo'la boshlab, to'xtab qolishdi. Xato nimada?" },
    fig_line: '96 : 8 = (90 + 6) : 8',
    opts: [
      { ru: 'девяносто на восемь не делится', uz: "to'qson sakkizga bo'linmaydi" },
      { ru: 'шесть на восемь не делится', uz: "olti sakkizga bo'linmaydi" },
      { ru: 'части сложили неверно', uz: "qismlar noto'g'ri qo'shilgan" },
      { ru: 'ошибки нет', uz: "xato yo'q" }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Шесть и правда меньше восьми, но первая часть мешает раньше. Смотри на девяносто.', uz: "Olti haqiqatan sakkizdan kichik, lekin birinchi qism oldinroq xalaqit beradi. To'qsonga qarang." },
      2: { ru: 'До сложения дело не дошло: части ещё не поделены.', uz: "Qo'shishgacha ish yetmadi: qismlar hali bo'linmagan." },
      3: { ru: 'Проверь первую часть. Девяносто на восемь не делится нацело.', uz: "Birinchi qismni tekshiring. To'qson sakkizga butun bo'linmaydi." }
    },
    audio: {
      intro: {
        ru: ['Девяносто шесть разделить на восемь. Кто-то взял разряды и остановился.', 'Найди, почему так вышло.'],
        uz: ["To'qson oltini sakkizga bo'lish kerak. Kimdir xonalarni olib, to'xtab qoldi.", "Nega bunday bo'lganini toping."]
      },
      on_correct: { ru: 'Точно! Нужны другие части: восемьдесят и шестнадцать. Десять и два, двенадцать.', uz: "Aniq! Boshqa qismlar kerak: sakson va o'n olti. O'n va ikki, o'n ikki." },
      on_wrong: { ru: 'Проверь каждую часть по очереди.', uz: 'Har bir qismni navbat bilan tekshiring.' }
    }
  },

  s9: {
    eyebrow: { ru: 'Бонус', uz: 'Bonus' },
    lead: { ru: 'А если делитель сам двузначный?', uz: "Bo'luvchining o'zi ikki xonali bo'lsa-chi?" },
    task_line: '36 : 12',
    task_cap: { ru: 'частей поровну по двенадцать', uz: "o'n ikkitadan teng qismlar" },
    step1: '12 · 2 = 24',
    step1_cap: { ru: 'мало', uz: 'kam' },
    step2: '12 · 3 = 36',
    step2_cap: { ru: 'столько и есть', uz: 'roppa-rosa shuncha' },
    res: '36 : 12 = 3',
    btn1: { ru: 'Взять два раза', uz: 'Ikki marta olish' },
    btn2: { ru: 'Взять три раза', uz: 'Uch marta olish' },
    mc_q: { ru: 'Почему здесь не разбивают на части?', uz: 'Nega bu yerda qismlarga ajratilmaydi?' },
    mc_opts: [
      { ru: 'делитель двузначный, части на него не делятся', uz: "bo'luvchi ikki xonali, qismlar unga bo'linmaydi" },
      { ru: 'число слишком маленькое', uz: 'son juda kichik' },
      { ru: 'так быстрее считать', uz: 'bunday hisoblash tezroq' },
      { ru: 'на двенадцать делить нельзя', uz: "o'n ikkiga bo'lib bo'lmaydi" }
    ],
    mc_ci: 0,
    mc_hints: {
      1: { ru: 'Размер тут ни при чём. Дело в делителе.', uz: "Kattalikning aloqasi yo'q. Gap bo'luvchida." },
      2: { ru: 'Иногда и правда быстрее. Но причина в другом: тридцать и шесть на двенадцать не делятся.', uz: "Ba'zan haqiqatan tezroq. Lekin sabab boshqa: o'ttiz ham, olti ham o'n ikkiga bo'linmaydi." },
      3: { ru: 'Делить на двенадцать можно. Просто способ другой.', uz: "O'n ikkiga bo'lish mumkin. Faqat usul boshqa." }
    },
    mc_ok: { ru: 'Верно! На двузначный делитель части не делятся, поэтому подбираем умножением.', uz: "To'g'ri! Ikki xonali bo'luvchiga qismlar bo'linmaydi, shuning uchun ko'paytirib tanlaymiz." },
    audio: {
      ru: [
        'Небольшой бонус. А если делитель сам двузначный?',
        'Смотрим, сколько раз двенадцать помещается в тридцать шесть. Дважды двенадцать, двадцать четыре. Мало.',
        'Трижды двенадцать, тридцать шесть. Ровно столько и было.',
        'Значит, тридцать шесть на двенадцать, три. Этот приём пригодится уже на следующем уроке.'
      ],
      uz: [
        "Kichik bonus. Bo'luvchining o'zi ikki xonali bo'lsa-chi?",
        "O'n ikki o'ttiz oltiga necha marta sig'ishini qaraymiz. Ikki karra o'n ikki, yigirma to'rt. Kam.",
        "Uch karra o'n ikki, o'ttiz olti. Roppa-rosa shuncha edi.",
        "Demak, o'ttiz oltini o'n ikkiga bo'lsak, uch. Bu usul keyingi darsdayoq asqotadi."
      ]
    }
  },

  s10: {
    eyebrow: { ru: 'Тренажёр', uz: 'Trenajyor' },
    q: { ru: '88 : 8. Набери ответ.', uz: "88 : 8. Javobni tering." },
    ans: 11,
    check: '80 : 8 + 8 : 8 = 10 + 1',
    check_label: { ru: 'проверка', uz: 'tekshirish' },
    hint: { ru: 'Восемьдесят и восемь. Обе части делятся на восемь.', uz: "Sakson va sakkiz. Ikkala qism ham sakkizga bo'linadi." },
    audio: {
      intro: { ru: 'Восемьдесят восемь разделить на восемь. Здесь разряды подходят.', uz: "Sakson sakkizni sakkizga bo'ling. Bu yerda xonalar to'g'ri keladi." },
      on_correct: { ru: 'Верно! Десять и один, одиннадцать.', uz: "To'g'ri! O'n va bir, o'n bir." }
    }
  },

  s11: {
    eyebrow: { ru: 'Тест', uz: 'Test' },
    q: { ru: '63 : 3 = ?', uz: '63 : 3 = ?' },
    opts: [
      { ru: '21', uz: '21' },
      { ru: '20', uz: '20' },
      { ru: '23', uz: '23' },
      { ru: '12', uz: '12' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Разделили только шестьдесят. Три единицы остались.', uz: "Faqat oltmish bo'lindi. Uch birlik qoldi." },
      2: { ru: 'Шестьдесят разделили, а три приписали. Три тоже делится: три на три, один.', uz: "Oltmish bo'lindi, uch esa yozib qo'yildi. Uch ham bo'linadi: uchni uchga, bir." },
      3: { ru: 'Цифры ответа переставлены местами. Двадцать один, а не двенадцать.', uz: "Javob raqamlari o'rin almashgan. Yigirma bir, o'n ikki emas." }
    },
    audio: {
      intro: { ru: 'Шестьдесят три разделить на три.', uz: "Oltmish uchni uchga bo'ling." },
      on_correct: { ru: 'Верно! Двадцать и один, двадцать один.', uz: "To'g'ri! Yigirma va bir, yigirma bir." },
      on_wrong: { ru: 'Раздели шестьдесят, потом три, и сложи.', uz: "Oltmishni, keyin uchni bo'ling va qo'shing." }
    }
  },

  s12: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    lead: { ru: 'Задача из мастерской.', uz: 'Ustaxonadan masala.' },
    q: { ru: 'Привезли 32 детали в первой партии и 34 во второй. Их разложили поровну на 3 полки. Сколько деталей на одной полке?', uz: "Birinchi partiyada 32 ta, ikkinchisida 34 ta detal keldi. Ular 3 tokchaga teng taqsimlandi. Bitta tokchada nechta detal bor?" },
    q_speech: { ru: 'Тридцать две детали и тридцать четыре разложили на три полки поровну. Сколько на одной?', uz: "O'ttiz ikkita va o'ttiz to'rtta detal uch tokchaga tengdan terildi. Bittasida nechta?" },
    tbl_heads: [
      { ru: 'Первая партия', uz: 'Birinchi partiya' },
      { ru: 'Вторая партия', uz: 'Ikkinchi partiya' },
      { ru: 'Полок', uz: 'Tokchalar' }
    ],
    tbl_cells: ['32', '34', '3'],
    pick_label: { ru: 'Сначала выбери запись', uz: 'Avval yozuvni tanlang' },
    opts: [
      { ru: '(32 + 34) : 3', uz: '(32 + 34) : 3' },
      { ru: '32 + 34 : 3', uz: '32 + 34 : 3' },
      { ru: '32 : 3 + 34', uz: '32 : 3 + 34' },
      { ru: '(34 − 32) : 3', uz: '(34 − 32) : 3' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Без скобок разделится только вторая партия. А раскладывают обе вместе.', uz: "Qavssiz faqat ikkinchi partiya bo'linadi. Ular esa birga taqsimlanadi." },
      2: { ru: 'Тридцать два на три поровну не делится, да и вторую партию тут забыли разделить.', uz: "O'ttiz ikki uchga teng bo'linmaydi, ikkinchi partiyani bo'lish ham unutilgan." },
      3: { ru: 'Вычитание нашло бы разницу партий. А нам нужно всё вместе.', uz: "Ayirish partiyalar farqini topadi. Bizga esa hammasi birga kerak." }
    },
    pick_ok: { ru: 'Запись верная. Теперь считай по шагам.', uz: "Yozuv to'g'ri. Endi qadamlab hisoblang." },
    step1_q: '32 + 34 = ?',
    ans1: 66,
    hint1: { ru: 'Сложи обе партии.', uz: "Ikkala partiyani qo'shing." },
    step2_q: '66 : 3 = ?',
    ans2: 22,
    hint2: { ru: 'Шестьдесят и шесть. Обе части делятся на три.', uz: "Oltmish va olti. Ikkala qism ham uchga bo'linadi." },
    check: '22 · 3 = 66',
    setup_audio: { ru: 'Задача из мастерской. Две партии деталей и три полки. Сначала выбери запись, потом считай по шагам.', uz: "Ustaxonadan masala. Ikki partiya detal va uchta tokcha. Avval yozuvni tanlang, keyin qadamlab hisoblang." },
    audio: {
      intro: { ru: 'Тут пригодится всё правило.', uz: "Bu yerda butun qoida kerak bo'ladi." },
      on_correct: { ru: 'Двадцать две детали на полке! И проверка сошлась: двадцать два на три, шестьдесят шесть.', uz: "Tokchada yigirma ikkita detal! Tekshirish ham mos keldi: yigirma ikki karra uch, oltmish olti." },
      on_wrong: { ru: 'Посчитай ещё раз, по шагам.', uz: 'Yana bir bor, qadamlab hisoblang.' }
    }
  },

  s13: {
    eyebrow: { ru: 'Финал', uz: 'Final' },
    intro_line: { ru: 'Три примера — и приём твой', uz: 'Uch misol va usul sizniki' },
    items: [
      {
        kind: 'num',
        q: { ru: '78 : 6. Набери ответ.', uz: "78 : 6. Javobni tering." },
        q_speech: { ru: 'Семьдесят восемь разделить на шесть.', uz: "Yetmish sakkizni oltiga bo'lish." },
        ans: 13,
        hint: { ru: 'Шестьдесят и восемнадцать.', uz: "Oltmish va o'n sakkiz." }
      },
      {
        kind: 'mc',
        q: { ru: '92 : 4 = ?', uz: '92 : 4 = ?' },
        q_speech: { ru: 'Девяносто два разделить на четыре.', uz: "To'qson ikkini to'rtga bo'lish." },
        opt0: { ru: '23', uz: '23' },
        opt1: { ru: '22', uz: '22' },
        opt2: { ru: '24', uz: '24' },
        opt3: { ru: '20', uz: '20' },
        wrong_1: { ru: 'Восемьдесят на четыре, двадцать. Двенадцать на четыре, три. Сложи ещё раз.', uz: "Saksonni to'rtga, yigirma. O'n ikkini to'rtga, uch. Yana qo'shing." },
        wrong_2: { ru: 'Проверь вторую часть: двенадцать на четыре это три, а не четыре.', uz: "Ikkinchi qismni tekshiring: o'n ikkini to'rtga bo'lsak uch, to'rt emas." },
        wrong_3: { ru: 'Это только восемьдесят на четыре. Двенадцать остались.', uz: "Bu faqat sakson to'rtga. O'n ikki qolib ketdi." }
      },
      {
        kind: 'mc',
        q: { ru: '75 : 3 = ?', uz: '75 : 3 = ?' },
        q_speech: { ru: 'Семьдесят пять разделить на три.', uz: "Yetmish beshni uchga bo'lish." },
        opt0: { ru: '25', uz: '25' },
        opt1: { ru: '24', uz: '24' },
        opt2: { ru: '21', uz: '21' },
        opt3: { ru: '35', uz: '35' },
        wrong_1: { ru: 'Шестьдесят на три, двадцать. Пятнадцать на три, пять. Вместе больше.', uz: "Oltmishni uchga, yigirma. O'n beshni uchga, besh. Birgalikda ko'proq." },
        wrong_2: { ru: 'Это ответ для шестидесяти трёх. Здесь число другое.', uz: "Bu oltmish uch uchun javob. Bu yerda son boshqa." },
        wrong_3: { ru: 'Слишком много: трижды тридцать пять это больше ста.', uz: "Juda ko'p: uch karra o'ttiz besh yuzdan katta." }
      }
    ],
    fact_badge: { ru: 'Знаешь ли ты?', uz: 'Bilasizmi?' },
    fact_text: {
      ru: 'Части можно выбирать по-разному, а ответ будет один и тот же. Восемьдесят шесть на два можно считать как восемьдесят и шесть, а можно как шестьдесят и двадцать шесть, и даже как сорок и сорок шесть. Каждый раз получится сорок три. Математики проверили это сразу для всех чисел и доказали, что иначе не бывает. Поэтому смело выбирай те части, которые тебе удобнее.',
      uz: "Qismlarni har xil tanlash mumkin, javob esa bir xil chiqadi. Sakson oltini ikkiga bo'lishda sakson va olti deb ham, oltmish va yigirma olti deb ham, hatto qirq va qirq olti deb ham olish mumkin. Har safar qirq uch chiqadi. Matematiklar buni hamma sonlar uchun tekshirib, boshqacha bo'lmasligini isbotlashgan. Shuning uchun o'zingizga qulay qismlarni bemalol tanlang."
    },
    fact_audio: {
      ru: 'Части можно выбирать по-разному, а ответ будет один и тот же. Восемьдесят шесть на два можно считать как восемьдесят и шесть, а можно как шестьдесят и двадцать шесть, и даже как сорок и сорок шесть. Каждый раз получится сорок три. Математики проверили это сразу для всех чисел и доказали, что иначе не бывает. Мы весь урок искали удобные части, и вот почему это можно делать смело.',
      uz: "Qismlarni har xil tanlash mumkin, javob esa bir xil chiqadi. Sakson oltini ikkiga bo'lishda sakson va olti deb ham, oltmish va yigirma olti deb ham, hatto qirq va qirq olti deb ham olish mumkin. Har safar qirq uch chiqadi. Matematiklar buni hamma sonlar uchun tekshirib, boshqacha bo'lmasligini isbotlashgan. Butun dars qulay qismlarni qidirdik, mana nega buni bemalol qilish mumkin."
    },
    audio: {
      intro: { ru: 'Финальная проверка, три примера.', uz: 'Yakuniy tekshiruv, uch misol.' },
      on_correct: { ru: 'Верно!', uz: "To'g'ri!" },
      on_wrong: { ru: 'Разбей число на части, которые делятся, и сложи частные.', uz: "Sonni bo'linadigan qismlarga ajrating va bo'linmalarni qo'shing." }
    }
  },

  s14: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    mission_done: { ru: 'Полки заполнены поровну!', uz: "Tokchalar tengdan to'ldi!" },
    cando: { ru: 'Теперь ты делишь двузначное число на однозначное без таблицы.', uz: "Endi siz ikki xonali sonni bir xonaliga jadvalsiz bo'lasiz." },
    rule_recap: {
      ru: '86 : 2 = (80 + 6) : 2 = 40 + 3 = 43. Части выбирай по делимости, а не по разрядам.',
      uz: "86 : 2 = (80 + 6) : 2 = 40 + 3 = 43. Qismlarni xonaga emas, bo'linishiga qarab tanlang."
    },
    conn_label_refs: { ru: 'опирается на', uz: 'tayanadi' },
    conn_refs: { ru: 'урок 12: деление суммы; урок 17: умножение по частям', uz: "12-dars: yig'indini bo'lish; 17-dars: qismlab ko'paytirish" },
    conn_label_next: { ru: 'дальше', uz: 'keyingi' },
    conn_next: { ru: 'деление с остатком', uz: "qoldiqli bo'lish" },
    audio: {
      ru: 'Полки заполнены поровну, и ни одна деталь не потерялась. Запомни главное. Разбей число на части, которые делятся, раздели каждую и сложи. А если поровну не выходит и что-то остаётся? В следующий раз узнаем, как это записывают!',
      uz: "Tokchalar tengdan to'ldi, birorta detal yo'qolmadi. Asosiysini eslab qoling. Sonni bo'linadigan qismlarga ajrating, har birini bo'ling va qo'shing. Teng chiqmasa va biror narsa ortib qolsa-chi? Keyingi safar buni qanday yozishni bilib olamiz!"
    }
  }
};

// v9 KO'PRIK — ekranda ko'rinmaydi, faqat ovozda (brgSeg orqali birinchi segment).
const BRIDGES = {
  s1:  { ru: 'Разберём заказ по частям.', uz: 'Buyurtmani qismlarga ajratamiz.' },
  s2:  { ru: 'А теперь случай похитрее.', uz: 'Endi biroz qiyinroq holat.' },
  s3:  { ru: "Соберём это в правило.", uz: "Buni qoidaga yig'amiz." },
  s4:  { ru: 'Соберём по частям.', uz: "Qismlab yig'amiz." },
  s5:  { ru: 'Проверим приём.', uz: 'Usulni tekshiramiz.' },
  s6:  { ru: 'Разложи по полкам.', uz: 'Tokchalarga ajrating.' },
  s7:  { ru: 'Теперь считай сам.', uz: "Endi o'zingiz hisoblang." },
  s8:  { ru: 'Кто-то застрял на середине.', uz: "Kimdir yarmida to'xtab qoldi." },
  s9:  { ru: 'Открою тебе один секрет.', uz: 'Sizga bir sirni ochaman.' },
  s10: { ru: 'И ещё один сам.', uz: "Yana bittasini o'zingiz." },
  s11: { ru: 'Быстрый вопрос.', uz: 'Tez savol.' },
  s12: { ru: 'Задача из мастерской.', uz: 'Ustaxonadan masala.' },
  s13: { ru: 'Финальная проверка.', uz: 'Yakuniy tekshiruv.' },
  s14: { ru: 'Заказ выполнен. Идём дальше!', uz: 'Buyurtma bajarildi. Davom etamiz!' }
};

// s14 payoff (xulosadan oldin aytiladi)
const S14_PAYOFF = {
  ru: 'Миссия выполнена! Полки заполнены поровну, и теперь ты делишь двузначное число без таблицы. Спасибо за помощь!',
  uz: "Missiya bajarildi! Tokchalar tengdan to'ldi, endi siz ikki xonali sonni jadvalsiz bo'lasiz. Yordamingiz uchun rahmat!"
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



// --- TAQSIMOT RAFI (D18): blokning umumiy foni (17-darsning ustaxonasi) SAQLANADI,
// ishchi tugun BOSHQA: yig'ish stoli o'rniga ikki bo'limli TAQSIMOT RAFI, tepasida
// buyurtma yorlig'i 86, chapda sterjenlar, o'ngda kubiklar (detal zaxirasi).
const RackBg = () => (
  <svg className="lm-scene-bg" viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="d18wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ECDBC4"/><stop offset="100%" stopColor="#DBC3A2"/></linearGradient>
      <linearGradient id="d18sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#BCE4F7"/><stop offset="58%" stopColor="#E4F3FB"/><stop offset="100%" stopColor="#F6EFD6"/></linearGradient>
      <linearGradient id="d18floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#D9C29D"/><stop offset="100%" stopColor="#BBA078"/></linearGradient>
      <linearGradient id="d18rack" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E2CFAE"/><stop offset="100%" stopColor="#C6AE82"/></linearGradient>
      <radialGradient id="d18sun" cx="50%" cy="50%" r="55%"><stop offset="0%" stopColor="#FFF8DC"/><stop offset="52%" stopColor="#FFE49A" stopOpacity="0.9"/><stop offset="100%" stopColor="#FFD36A" stopOpacity="0"/></radialGradient>
      <radialGradient id="d18lamp" cx="50%" cy="20%" r="80%"><stop offset="0%" stopColor="#FFF0C4"/><stop offset="100%" stopColor="#FFE39A" stopOpacity="0"/></radialGradient>
      <clipPath id="d18winClip"><rect x="46" y="32" width="308" height="62" rx="4"/></clipPath>
    </defs>
    {/* sex: blok bo'ylab bitta fon */}
    <rect x="0" y="0" width="400" height="180" fill="url(#d18wall)"/>
    <rect x="0" y="0" width="400" height="22" fill="#D2B892"/><rect x="0" y="21" width="400" height="3" fill="#B4976F"/>
    {[90, 200, 310].map((cx, i) => (
      <g key={`lm${i}`}>
        <rect x={cx - 18} y="4" width="36" height="6" rx="3" fill="#FFEBB0"/>
        <polygon points={`${cx - 20},11 ${cx + 20},11 ${cx + 46},96 ${cx - 46},96`} fill="url(#d18lamp)" opacity="0.26"/>
        <ellipse className="lm-glow" style={{ animationDelay: `${i * 0.7}s` }} cx={cx} cy="12" rx="14" ry="4" fill="#FFF0C4" opacity="0.5"/>
      </g>
    ))}
    <rect x="42" y="28" width="316" height="70" rx="7" fill="#0D1928"/>
    <rect x="46" y="32" width="308" height="62" rx="4" fill="url(#d18sky)"/>
    <g clipPath="url(#d18winClip)">
      <circle cx="96" cy="48" r="20" fill="url(#d18sun)"/><circle cx="96" cy="48" r="7" fill="#FFF3C4"/>
      <g fill="#FFFFFF" opacity="0.9"><ellipse cx="250" cy="44" rx="18" ry="6"/><ellipse cx="264" cy="41" rx="12" ry="4.6"/></g>
      <path d="M46 84 Q140 62 220 82 Q300 98 354 80 L354 94 L46 94 Z" fill="#BFE0A8"/>
      <path d="M46 90 Q160 74 354 88 L354 94 L46 94 Z" fill="#A8D290"/>
      {[120, 168, 216, 264, 312].map((x, i) => (
        <g key={`tr${i}`} transform={`translate(${x} ${84 - (i % 2) * 3})`}>
          <rect x="-1" y="-4" width="2" height="6" fill="#8A6B42"/>
          <circle cx="0" cy="-7" r="4.6" fill="#6FBF8E"/>
        </g>
      ))}
    </g>
    <g fill="none" stroke="#C9B79A" strokeWidth="3"><rect x="42" y="28" width="316" height="70" rx="7"/></g>
    <g stroke="#C9B79A" strokeWidth="2.4" opacity="0.9"><path d="M148 32 V94"/><path d="M256 32 V94"/></g>
    <rect x="42" y="95" width="316" height="5" rx="2" fill="#B4976F"/>
    {/* BUYURTMA YORLIG'I */}
    <rect x="170" y="104" width="60" height="16" rx="4" fill="#FBF7F0" stroke="#B4976F" strokeWidth="1.4"/>
    <text x="200" y="115.5" textAnchor="middle" fontSize="9" fontWeight="800" fill="#6B5636" fontFamily="'JetBrains Mono', monospace">86</text>
    {/* TAQSIMOT RAFI: ikki bo'lim, har birida uch tokcha */}
    {[[104, 'A'], [212, 'B']].map(([x, tag], i) => (
      <g key={`rk${i}`} transform={`translate(${x} 124)`}>
        <rect x="0" y="0" width="84" height="50" rx="5" fill="url(#d18rack)" stroke="#B4976F" strokeWidth="1.6"/>
        {[0, 1, 2].map((r) => (
          <g key={r}>
            <rect x="4" y={6 + r * 15} width="76" height="3" rx="1.5" fill="#A98C64"/>
            {[0, 1, 2, 3, 4].map((k) => (
              <rect key={k} x={7 + k * 15} y={1 + r * 15} width="11" height="5" rx="1.6" fill={r === 2 && k > 2 ? '#E6D8BF' : '#F2A85C'} stroke="#C97F35" strokeWidth="0.6"/>
            ))}
          </g>
        ))}
        <text x="42" y="-3" textAnchor="middle" fontSize="7" fontWeight="800" fill="#8A7452" fontFamily="'JetBrains Mono', monospace">{tag}</text>
      </g>
    ))}
    <path d="M150 174 h100 l10 18 h-120 Z" fill="#C3A87E"/><rect x="146" y="190" width="108" height="4" fill="#A98C64"/>
    {/* chap: sterjenlar zaxirasi */}
    <g transform="translate(10 116)">
      <rect x="0" y="0" width="64" height="58" rx="5" fill="#C3A87E" opacity="0.55"/>
      {[0, 1, 2].map((r) => (
        <g key={`sh${r}`} transform={`translate(6 ${7 + r * 17})`}>
          <rect x="-2" y="11" width="56" height="3" rx="1.5" fill="#A98C64"/>
          {[0, 1].map((k) => (
            <g key={k} transform={`translate(${k * 27} 0)`}>
              <rect x="0" y="0" width="25" height="9" rx="3" fill="#F2A85C" stroke="#C97F35" strokeWidth="0.8"/>
              <g stroke="#C97F35" strokeWidth="0.5" opacity="0.7">{[1, 2, 3, 4].map((m) => <line key={m} x1={m * 5} y1="1" x2={m * 5} y2="8"/>)}</g>
            </g>
          ))}
        </g>
      ))}
    </g>
    {/* o'ng: kubiklar yashigi */}
    <g transform="translate(328 122)">
      <rect x="0" y="8" width="62" height="46" rx="5" fill="#C3A87E"/>
      <rect x="3" y="11" width="56" height="40" rx="3" fill="#B49670"/>
      {[0, 1, 2, 3, 4, 5].map((k) => (
        <rect key={`cb${k}`} x={7 + (k % 3) * 17} y={15 + Math.floor(k / 3) * 17} width="13" height="13" rx="2.5" fill="#6FD0E4" stroke="#3E8FA8" strokeWidth="0.9"/>
      ))}
    </g>
    <rect x="0" y="176" width="400" height="54" fill="url(#d18floor)"/>
    <line x1="0" y1="176" x2="400" y2="176" stroke="#9A8058" strokeWidth="2"/>
    <g stroke="#A98C64" strokeWidth="1" opacity="0.4"><path d="M20 230 L176 178"/><path d="M120 230 L192 178"/><path d="M280 230 L208 178"/><path d="M380 230 L224 178"/></g>
    <g transform="translate(16 176)"><path d="M0 0 Q-3 -16 0 -24" stroke="#7CB69E" strokeWidth="2.6" fill="none"/><circle className="lm-glow" cx="0" cy="-27" r="5" fill="#A6E0C6"/></g>
    <g transform="translate(392 176)"><path d="M0 0 Q-2 -10 0 -15" stroke="#7CB69E" strokeWidth="2.2" fill="none"/><circle className="lm-glow" cx="0" cy="-17" r="3.6" fill="#A6E0C6"/></g>
  </svg>
);

const RackScene = ({ gathered = false }) => {
  const kid = ({ key, El, hook }, i) => (
    <span key={key} className="lm-crew lm-crew-kid g1-pop-in" style={{ animationDelay: `${0.25 + i * 0.12}s` }}>
      <El {...(gathered ? { mood: 'happy', pose: 'happy' } : hook)}/>
    </span>
  );
  return (
    <div className="lm-scene">
      <RackBg/>
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





// --- DETALLAR: o'nlik-sterjen va birlik-kubik (17-darsdan ko'chirilgan).
const RodSVG = () => (
  <svg viewBox="0 0 56 12" className="d18-rod" aria-hidden="true">
    <rect x="1" y="1" width="54" height="10" rx="3" fill="#F2A85C" stroke="#C97F35" strokeWidth="1"/>
    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => <line key={k} x1={1 + k * 5.4} y1="2" x2={1 + k * 5.4} y2="10" stroke="#C97F35" strokeWidth="0.7" opacity="0.7"/>)}
  </svg>
);
const CubeSVG = () => (
  <svg viewBox="0 0 12 12" className="d18-cube" aria-hidden="true">
    <rect x="1" y="1" width="10" height="10" rx="2.4" fill="#6FD0E4" stroke="#3E8FA8" strokeWidth="1"/>
  </svg>
);

// --- IKKI TOKCHA: qismni tokchalarga tengdan tarqatish (s1 va s2 uchun).
// tone: 'ok' — qism bo'linadi, 'no' — bo'linmaydi (qizil ramka).
const ShelfPair = ({ label, per, tone = 'ok', shelves = 2 }) => (
  <span className={`d18-shelfpair d18-shelfpair-${tone}`}>
    <span className="mono d18-shelf-label">{label}</span>
    <span className="d18-shelf-row">
      {Array.from({ length: shelves }).map((_, i) => (
        <span key={i} className="d18-shelf">
          <span className="mono d18-shelf-val">{per}</span>
        </span>
      ))}
    </span>
  </span>
);

// --- FACTCARD QAHRAMONI: 86 : 2 uch xil ajratishda ham 43 beradi.
const SplitFig = () => (
  <svg viewBox="0 0 220 118" style={{ width: 'min(270px, 84%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <defs>
      <linearGradient id="d18card" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FFF6E9"/><stop offset="100%" stopColor="#F1E2C6"/></linearGradient>
    </defs>
    <text x="110" y="16" textAnchor="middle" fontSize="12" fontWeight="800" fill="#3A3530" fontFamily="'JetBrains Mono', monospace">86 : 2</text>
    {[['80 + 6', 0], ['60 + 26', 1], ['40 + 46', 2]].map(([txt, k]) => (
      <g key={txt} className="d18-split" style={{ animationDelay: `${k}s` }}>
        <rect x="20" y={26 + k * 24} width="118" height="20" rx="7" fill="url(#d18card)" stroke="#C9B79A" strokeWidth="2"/>
        <text x="79" y={40 + k * 24} textAnchor="middle" fontSize="11" fontWeight="800" fill="#3A3530" fontFamily="'JetBrains Mono', monospace">{txt}</text>
        <path d={`M142 ${36 + k * 24} H160`} stroke="#FF4F28" strokeWidth="2" strokeLinecap="round"/>
        <path d={`M156 ${31 + k * 24} L161 ${36 + k * 24} L156 ${41 + k * 24}`} stroke="#FF4F28" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
    ))}
    <rect x="166" y="38" width="42" height="40" rx="9" fill="#E3F0E8" stroke="#1F7A4D" strokeWidth="2.4"/>
    <text x="187" y="64" textAnchor="middle" fontSize="17" fontWeight="800" fill="#1F7A4D" fontFamily="'JetBrains Mono', monospace">43</text>
    <text x="110" y="112" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#8A8378" fontFamily="'JetBrains Mono', monospace">bir xil javob</text>
  </svg>
);
const MCOne = ({ props, ck, mono = false, figLine = null }) => {
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
          {figLine && <span className="mono d19-errline">{figLine}</span>}
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
        <div className="frame fade-up delay-1 d18-hook-scene" style={{ padding: 'clamp(8px, 1.8vw, 14px)', overflow: 'hidden' }}>
          <RackScene gathered={ok}/>
        </div>
        {picked === null && (
          <div className="frame fade-up delay-1" style={{ padding: 'clamp(6px, 1.2vw, 9px)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <span className="d18-order">
              <span className="mono d18-order-plate">86</span>
              <span className="d18-order-sep mono">:</span>
              <span className="mono d18-order-plate">2</span>
            </span>
            <span className="d18-note">{t(c.order_cap)}</span>
          </div>
        )}
        <p className="fade-up delay-1" style={{ textAlign: 'center', color: T.ink2, fontWeight: 600, fontSize: 'clamp(13px, 1.8vw, 16px)', margin: 0 }}>{t(c.q)}</p>
        {picked === null && (
          <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
            {order.map((k, i) => (
              <button key={i} className="option mono" disabled={!canAct} onClick={() => pick(i)}
                style={{ padding: 'clamp(9px, 1.4vw, 12px)', fontSize: 'clamp(15px, 2.4vw, 19px)', minHeight: 'clamp(44px, 6.2vw, 54px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                {t(opts[k])}
              </button>
            ))}
          </div>
        )}
        {picked !== null && (
          <div className="fade-up" style={{ display: 'flex', justifyContent: 'center' }}>
            <button className={`option ${ok ? 'option-correct' : 'option-picked-wrong'}`} disabled
              style={{ padding: 'clamp(10px, 1.5vw, 12px) clamp(16px, 2.4vw, 22px)', fontSize: 'clamp(14px, 2.2vw, 18px)', minHeight: 'clamp(44px, 6.2vw, 54px)', width: 'auto', display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800 }}>
              <span className="mono small">{ok ? '✓' : '↺'}</span>
              <span className="mono">{t(opts[order[picked]])}</span>
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

// s1 — AJRATISH: 86 = 80 + 6, har qism ikkiga bo'linadi (TAP bilan)
const Screen1 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s1;
  const audio = useAudio([
    brgSeg('s1', lang),
    { id: 's1_0', text: c.audio[lang][0], trigger: 'after_previous', waits_for: null },
    { id: 's1_1', text: c.audio[lang][1], trigger: 'on_event:step1', waits_for: null },
    { id: 's1_2', text: c.audio[lang][2], trigger: 'on_event:step2', waits_for: null },
    { id: 's1_3', text: c.audio[lang][3], trigger: 'on_event:step3', waits_for: null }
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
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1.4vw, 10px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(6px, 1.4vw, 10px)', padding: 'clamp(10px, 2vw, 15px)' }}>
          <FrameFx/>
          {step === 0 && <span className="mono d18-plate">{c.plate}</span>}
          {step >= 1 && (
            <span className="d18-partrow lm-reveal">
              <span className="mono d18-partnum" style={{ color: '#C97F35' }}>{c.part1}</span>
              <span className="mono" style={{ color: T.ink3, fontWeight: 800 }}>+</span>
              <span className="mono d18-partnum" style={{ color: '#2E7E9E' }}>{c.part2}</span>
            </span>
          )}
          {step >= 2 && (
            <span className="d18-pairrow lm-reveal">
              <ShelfPair label={c.res1.split(' = ')[0]} per="40"/>
              <ShelfPair label={c.res2.split(' = ')[0]} per="3"/>
            </span>
          )}
          {step >= 3 && <span className="mono d18-final lm-reveal">{c.formula}</span>}
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

// s2 — BURILISH: 42 : 3, xonalar to'g'ri kelmaydi (TAP bilan)
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
    { id: 's2_3', text: c.audio[lang][3], trigger: 'on_event:step3', waits_for: null }
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
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1.4vw, 10px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(6px, 1.4vw, 10px)', padding: 'clamp(10px, 2vw, 15px)' }}>
          <FrameFx/>
          {step >= 1 && (
            <>
              <span className="mono d18-bad lm-reveal">{c.try_line}</span>
              <span className="d18-note lm-reveal" style={{ color: '#C0392B' }}>{t(c.try_cap)}</span>
            </>
          )}
          {step >= 2 && (
            <>
              <span className="mono d18-expr lm-reveal">{c.good_line}</span>
              <span className="d18-note lm-reveal">{t(c.good_cap)}</span>
            </>
          )}
          {step >= 3 && <span className="mono d18-final lm-reveal">{c.res}</span>}
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

// s4 — KONSOL: 84 : 6 uch qadamda (15-darsning MeasureCell'i)
const Screen4 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s4;
  const audio = useAudio([
    brgSeg('s4', lang),
    { id: 's4_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
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
        correctAnswer: '14', studentAnswer: '14', correct: firstRef.current,
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
          <span className="mono d18-expr">{c.swap_line}</span>
          <div className="lm-console">
            {c.cells.map((cl, i) => (
              <MeasureCell key={i} head={t(cl.head)} label={cl.label} val={phase > i ? String(cl.ans) : null} lit={phase === i}/>
            ))}
          </div>
          {!solved && (
            <>
              <NumPad value={val} setValue={setVal} disabled={!canAct || numLock} max={2}/>
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

// s5 — TEST: qaysi ajratish to'g'ri (48 : 3), rasm YO'Q
const Screen5 = (props) => <MCOne props={props} ck="s5" mono/>;

// s6 — SARALASH: xonalar to'g'ri keladimi (16-dars mexanikasi)
const Screen6 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s6;
  const audio = useAudio([
    brgSeg('s6', lang),
    { id: 's6_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
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
      <span className="lm-bin-slot mono">{okBin === key ? it.n : ''}</span>
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
                  ? <button className={`lm-digchip mono ${sel ? 'lm-digchip-sel' : ''}`} disabled={!canAct || done} onClick={() => setSel(true)}>{it.n}</button>
                  : <span className="lm-digtray-empty mono">{it.n}</span>}
              </div>
              <div className="d18-bins">
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

// s7 — TRENAJYOR NumPad: 91 : 7
const Screen7 = (props) => <NumOne props={props} ck="s7"/>;

// s8 — XATONI TOP: 96 : 8 = (90 + 6) : 8
const Screen8 = (props) => <MCOne props={props} ck="s8" figLine={CONTENT.s8.fig_line}/>;

// s9 — BONUS: ikki xonali bo'luvchi, podbor (darslik 27-bet)
const Screen9 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s9;
  const audio = useAudio([
    brgSeg('s9', lang),
    { id: 's9_0', text: c.audio[lang][0], trigger: 'after_previous', waits_for: null },
    { id: 's9_1', text: c.audio[lang][1], trigger: 'on_event:step1', waits_for: null },
    { id: 's9_2', text: c.audio[lang][2], trigger: 'on_event:step2', waits_for: null },
    { id: 's9_3', text: c.audio[lang][3], trigger: 'after_previous', waits_for: null }
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
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(5px, 1.2vw, 9px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(5px, 1.2vw, 9px)', padding: 'clamp(10px, 2vw, 15px)' }}>
          <FrameFx/>
          <span className="mono d18-plate">{c.task_line}</span>
          <span className="d18-note">{t(c.task_cap)}</span>
          {step >= 1 && (
            <span className="d18-partrow lm-reveal">
              <span className="mono d18-expr">{c.step1}</span>
              <span className="d18-note" style={{ color: '#C0392B' }}>{t(c.step1_cap)}</span>
            </span>
          )}
          {step >= 2 && (
            <span className="d18-partrow lm-reveal">
              <span className="mono d18-expr">{c.step2}</span>
              <span className="d18-note" style={{ color: '#1F7A4D' }}>{t(c.step2_cap)}</span>
            </span>
          )}
          {step >= 2 && <span className="mono d18-final lm-reveal" style={{ animationDelay: '0.25s' }}>{c.res}</span>}
          {!built && (
            <button className="btn-white-accent" disabled={!canAct} onClick={tap}
              style={{ fontSize: 'clamp(13px, 2.1vw, 16px)' }}>{t(step === 0 ? c.btn1 : c.btn2)}</button>
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
                  style={{ padding: 'clamp(8px, 1.4vw, 11px)', fontSize: 'clamp(11.5px, 1.7vw, 14px)', minHeight: 'clamp(40px, 5.6vw, 50px)', fontWeight: 800 }}>{t(c.mc_opts[k])}</button>
              ))}
            </div>
            {hintMsg && !solved && <p className="fade-up" style={{ margin: 0, color: T.ink2, textAlign: 'center', fontSize: 'clamp(12px, 1.7vw, 14px)' }}>{t(hintMsg)}</p>}
          </div>
        )}
        {solved && (
          <div ref={revealRef} className="frame-success reveal-soft">
            <Reaction state="correct" praise={t(c.mc_ok)}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s10 — TRENAJYOR NumPad: 88 : 8
const Screen10 = (props) => <NumOne props={props} ck="s10"/>;

// s11 — TEST: qiymat 63 : 3
const Screen11 = (props) => <MCOne props={props} ck="s11" mono/>;

// s12 — MASALA: jadval + yozuv + ikki qadam javob + tekshirish
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
        <h1 className="title h-sub fade-up" style={{ margin: 0, fontSize: 'clamp(14px, 2.2vw, 19px)' }}>{t(c.q)}</h1>
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
                    style={{ padding: 'clamp(9px, 1.5vw, 12px)', fontSize: 'clamp(13px, 2.2vw, 17px)', minHeight: 'clamp(42px, 6vw, 52px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>{t(c.opts[k])}</button>
                ))}
              </div>
            </>
          )}
          {chosen && (
            <>
              <span className="mono lm-reveal" style={{ fontSize: 'clamp(16px, 3vw, 22px)', fontWeight: 800, color: '#1F7A4D' }}>{t(c.opts[c.ci])}</span>
              {!solved && (
                <>
                  <span className="mono d18-steplabel lm-reveal">{stepNum === 0 ? c.step1_q : c.step2_q}</span>
                  <NumPad value={val} setValue={setVal} disabled={!canAct || numLock} max={2}/>
                  <button className="btn-white-accent" disabled={!canAct || numLock || val === ''} onClick={check}>{lang === 'ru' ? 'Проверить' : 'Tekshir'}</button>
                </>
              )}
              {solved && <span className="mono d18-res lm-reveal">{c.ans2}</span>}
            </>
          )}
          {solved && <CheckStrip expr={c.check} cap={t(CONTENT.s4.check_label)} ok/>}
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
                      style={{ padding: 'clamp(9px, 1.5vw, 12px)', fontSize: 'clamp(15px, 2.4vw, 20px)', minHeight: 'clamp(42px, 6vw, 52px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>
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
              <div className="d2-fact-hero"><SplitFig/></div>
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
        <div className="d18-final-scene fade-up delay-1"><RackScene gathered/></div>
      </div>
    </Stage>
  );
};

// ============================================================
// KORNEVOY KOMPONENT (shablon: infrastructure_v1 / grade1 Dars28)
// ============================================================
export default function TwoDigitDivLesson({
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
.d18-order { display: inline-flex; gap: clamp(6px, 1.6vw, 12px); align-items: center; padding: clamp(4px, 1vw, 7px) clamp(8px, 1.8vw, 12px);
  border-radius: 10px; background: rgba(255,236,200,.5); box-shadow: inset 0 0 0 1px rgba(190,150,90,.26); }
.d18-order-plate { font-size: clamp(15px, 3vw, 21px); font-weight: 800; color: #3A3530; padding: 3px 10px;
  border-radius: 8px; background: #FFFFFF; box-shadow: 0 2px 8px -4px rgba(58,53,48,0.35); }
.d18-order-sep { font-size: clamp(13px, 2.4vw, 17px); font-weight: 800; color: #8A8378; }
.d18-note { font-size: clamp(9.5px, 1.5vw, 12px); font-weight: 700; color: #5A5A60; text-align: center; }

/* --- DETALLAR --- */
.d18-rod { width: clamp(40px, 9vw, 56px); height: auto; display: block; }
.d18-cube { width: clamp(10px, 2.4vw, 13px); height: auto; display: block; }
.d18-partrow { display: inline-flex; align-items: center; gap: clamp(4px, 1vw, 8px); }
.d18-partnum { font-size: clamp(17px, 3.4vw, 24px); font-weight: 800; }

/* --- TOKCHALAR (qismni tengdan tarqatish) --- */
.d18-shelfpair { display: inline-flex; flex-direction: column; align-items: center; gap: 4px;
  padding: clamp(5px, 1.2vw, 8px) clamp(7px, 1.6vw, 11px); border-radius: 12px; background: #FBF7F0;
  box-shadow: inset 0 0 0 1.5px rgba(58,53,48,0.08); }
.d18-shelfpair-no { background: rgba(192,57,43,.06); box-shadow: inset 0 0 0 1.5px rgba(192,57,43,0.34); }
.d18-shelf-label { font-size: clamp(13px, 2.4vw, 18px); font-weight: 800; color: #3A3530; }
.d18-shelf-row { display: inline-flex; gap: clamp(4px, 1vw, 8px); }
.d18-shelf { display: inline-flex; align-items: center; justify-content: center; min-width: clamp(34px, 7.5vw, 46px);
  min-height: clamp(26px, 5.5vw, 34px); border-radius: 8px; background: #FFFFFF; box-shadow: inset 0 0 0 1px rgba(58,53,48,0.07); }
.d18-shelf-val { font-size: clamp(14px, 2.8vw, 20px); font-weight: 800; color: #C97F35; }
.d18-pairrow { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: clamp(6px, 1.6vw, 12px); }

/* --- IFODA SATRLARI --- */
.d18-expr { font-size: clamp(16px, 3.2vw, 23px); font-weight: 800; color: #3A3530; }
.d18-final { font-size: clamp(19px, 3.8vw, 27px); font-weight: 800; color: #1F7A4D; }
.d18-bad { font-size: clamp(16px, 3.2vw, 23px); font-weight: 800; color: #C0392B; }
.d18-errline { font-size: clamp(15px, 3vw, 22px); font-weight: 800; color: #C0392B; padding: 3px 12px;
  border-radius: 9px; background: rgba(192,57,43,.08); box-shadow: inset 0 0 0 1px rgba(192,57,43,.3); }
.d18-steplabel { font-size: clamp(15px, 3vw, 21px); font-weight: 800; color: #3A3530; }
.d18-res { font-size: clamp(19px, 3.8vw, 26px); font-weight: 800; color: #1F7A4D; }
.d18-plate { font-size: clamp(24px, 5vw, 34px); font-weight: 800; color: #0E0E10; padding: 4px 16px;
  border-radius: 12px; background: rgba(255,236,200,.55); box-shadow: inset 0 0 0 1px rgba(190,150,90,.28); }

/* --- TOKCHAGA SARALASH (16-darsdan ko'chirilgan mexanika, chip kengroq) --- */
.lm-digtray { display: flex; gap: 10px; justify-content: center; min-height: clamp(44px, 10vw, 58px); align-items: center; }
.lm-digtray-empty { font-size: clamp(15px, 3.2vw, 21px); font-weight: 800; color: #C4BEB4; letter-spacing: 1px; }
.lm-digchip { min-width: clamp(76px, 17vw, 104px); height: clamp(42px, 9vw, 56px); border: none; border-radius: 12px; background: #FFFFFF;
  font-size: clamp(15px, 3.2vw, 22px); font-weight: 800; color: #3A3530; cursor: pointer; padding: 0 10px;
  box-shadow: 0 3px 10px -4px rgba(58,53,48,0.35); transition: transform 0.12s; }
.lm-digchip-sel { background: #FFF3E9; color: #FF4F28; transform: translateY(-3px); box-shadow: 0 6px 16px -5px rgba(255,79,40,0.55); }
.d18-bins { display: grid; grid-template-columns: repeat(2, minmax(120px, 1fr)); gap: clamp(8px, 2vw, 16px); width: 100%; max-width: 440px; }
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
.d18-hook-scene .lm-scene { width: min(100%, calc(clamp(180px, calc(100dvh - 570px), 372px) * 400 / 210)); }
.d18-final-scene .lm-scene { width: min(100%, calc(clamp(200px, calc(100dvh - 560px), 372px) * 400 / 210)); }

/* --- FACTCARD: uch xil ajratish navbat bilan yonadi --- */
.d18-split { animation: d18split 4.5s ease-in-out infinite; }
@keyframes d18split { 0%, 6% { opacity: 0.25; } 24%, 100% { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .d18-split { animation: none; opacity: 1; } }
`;
