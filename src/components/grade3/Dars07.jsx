import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { BackLabel, BitSVG, Chiroq, Confetti, D2Defs, D2Motes, FREE_NAV, FeedbackBlock, FrameFx, GradientDefs, HeroContext, LUMO_CAST, LangContext, Lenta, NavBack, NavNext, NextLabel, Panel, ProgressContext, Reaction, ReadinessMeter, Stage, StageHero, T, configureLesson, getAudioEngine, npKey, shuffleArr, ttsConfig, useAdvanceGate, useAudio, useCanAnswer, useLang, useMobileZoom, usePrefersReducedMotion, useRevealScroll, useSfx, useT, makeBrgSeg } from './_kit/index.jsx';
import { BASE_STYLES } from './_kit/styles.js';

// ============================================================================
// DD 3-SINF | Dars07 — "Yozma qo'shish va ayirish" (num-3-07) | B1 | 10000 gacha, ustun
// Syujet: Bit sayyorasi LUMO, hisob terminali (SYUJET_3SINF.md B1 d.7). Katta sonlarni
//   ustunda qo'shish va ayirish. Bit — mezbon-gid.
// Infra: grade3 Dars01.jsx (etalon nomzodi) dan BAYT-ANIQ ko'chirildi. O'zgarmadi.
// YADRO: xona xona ostida; o'ngdan chapga; qo'shishda o'tkazish, ayirishda qarz.
// MEXANIKA: recall razryad (s1), ustunga qo'yish (s2), qo'shish o'tkazish bilan (s3), ayirish qarz (s4),
//   QOIDA (s5), qo'shish NumPad (s6), ayirish NumPad (s7), xatoni top (s8), terminal masala (s9),
//   final panel (s10), yakun (s11). ColumnCalc (ustun-hisob, o'tkazish/qarz belgilari).
// Misconception: M1 xonalar tekislanmagan, M2 o'tkazishni unutish, M3 qarzni unutish, M4 chapdan hisoblash.
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
// --- 3-SINF DARS: num-3-07 — Yozma qo'shish va ayirish (ustunda) ---
// Ovoz yetakchi kanal. Ustunda qo'shish/ayirish, uch pog'onali razryad
// (birlik/o'nlik/yuzlik), minglikkacha sonlar. Syujet: Bit sayyorasi Lumo
// (SYUJET_3SINF.md Б1 d.1).
// ============================================================

// v5 IXCHAMLASH (18 -> 15): test tomoni ixchamlashdi (tushuntirish s2-s6 + qoida s7 TEGILMADI).
//   sPANEL «Bort testi» = eski s11 + sCMP + sERR (3 ketma-ket sub).
//   sCASE «Yuk xati» = eski s12 (kirish) + s13 (savol) BITTA ekranда.
// v6 FAKT ALOHIDA (bekor): sPANEL sub-1 dagi FactCard SKROLL chiqargani uchun undan olindi.
// v7 FAKT FINAL SLAYDGA (16 -> 15): alohida fakt-slaydi BEKOR; fakt endi FINAL test s14 ga
//   factOnCorrect bilan (bitta savolli slaydда joy bor, skrollsiz — etalon naqsh). sPANEL faktsiz qoladi.
const TOTAL_SCREENS = 12;
const LESSON_META = {
  lessonId: 'num-3-07',
  lessonTitle: { ru: 'Урок 7. Письменное сложение и вычитание', uz: "7-dars. Yozma qo'shish va ayirish" }
};
// STRUKTURA (12 ekran): 1 hook · 2–6 tushuntirish · 7–10 mashq · 11 final · 12 xulosa.
// Grade2 Dars01 etaloni yoyi, yuzlik qo'shilgan (uch pog'onali razryad).
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'MCScreen', scored: false, scope: 'hook' },
  { id: 's1',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's4',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's5',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's6',  type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's7',  type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's8',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's9',  type: 'case',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's10', type: 'test',        template: 'custom',   scored: true,  scope: 'final' },
  { id: 's11', type: 'summary',     template: 'custom',   scored: false, scope: 'final' }
];





// ============================================================
// CONTENT — 3-sinf Dars01 «Yuzliklar, o'nliklar, birliklar» (num-3-01-v1). RU + UZ to'liq.
// Audio TTS-toza: sonlar so'z bilan, «» va matematik belgilar yo'q, bir segment = bir fikr.
// Rekvizit: chiroq (birlik) · lenta = 10 chiroq (o'nlik) · panel = 10 lenta (yuzlik). Lumo shahri.
// ============================================================

const CONTENT = {
  // s0 — HOOK: hisob terminali, katta sonlarni qanday qo'shamiz
  s0: {
    eyebrow: { ru: 'Миссия', uz: 'Missiya' },
    topic: { ru: 'Тема: письменное сложение и вычитание', uz: "Mavzu: yozma qo'shish va ayirish" },
    lead: { ru: 'Счётный терминал складывает большие числа.', uz: 'Hisob terminali katta sonlarni qo\'shadi.' },
    a: 2456, b: 3178,
    q: { ru: 'Можно ли сложить их в уме?', uz: 'Bularni xayolda qo\'shib bo\'ladimi?' },
    opt0: { ru: 'Да, легко', uz: 'Ha, oson' },
    opt1: { ru: 'Нет, нужен способ', uz: "Yo'q, usul kerak" },
    opt2: { ru: 'Не знаю', uz: 'Bilmayman' },
    audio: {
      intro: {
        ru: [
          'Тема урока — письменное сложение и вычитание. Научимся считать большие числа столбиком.',
          'В прошлой области мы читали шкалу города. Теперь Бит привёл нас к счётному терминалу.',
          'На терминале два больших числа. Две тысячи четыреста пятьдесят шесть и три тысячи сто семьдесят восемь.',
          'Как думаешь, легко ли сложить такие числа в уме? Выбери вариант.'
        ],
        uz: [
          "Dars mavzusi — yozma qo'shish va ayirish. Katta sonlarni ustunda hisoblashni o'rganamiz.",
          "O'tgan hududda shahar shkalasini o'qidik. Endi Bit bizni hisob terminaliga olib keldi.",
          "Terminalda ikkita katta son. Ikki ming to'rt yuz ellik olti va uch ming bir yuz yetmish sakkiz.",
          "Sizningcha, bunday sonlarni xayolda qo'shish osonmi? Variantni tanlang."
        ]
      },
      on_correct: { ru: 'Верно. В уме трудно. Есть удобный способ — столбик.', uz: "To'g'ri. Xayolda qiyin. Qulay usul bor — ustun." },
      on_wrong: { ru: 'В уме такие числа складывать трудно. Поможет столбик.', uz: "Bunday sonlarni xayolda qo'shish qiyin. Ustun yordam beradi." }
    }
  },

  // s1 — RECALL: to'rt xonali sonda razryadlar (minglik/yuzlik/o'nlik/birlik)
  s1: {
    eyebrow: { ru: 'Вспомним и откроем', uz: 'Eslaymiz va ochamiz' },
    lead: { ru: 'У большого числа четыре разряда.', uz: 'Katta sonning to\'rt xonasi bor.' },
    num: 3456,
    labels_ru: ['тысячи', 'сотни', 'десятки', 'единицы'],
    labels_uz: ['minglik', 'yuzlik', "o'nlik", 'birlik'],
    audio: {
      ru: [
        'Вспомним разряды. В числе три тысячи четыреста пятьдесят шесть четыре разряда.',
        'Слева тысячи, потом сотни, потом десятки, справа единицы. Каждая цифра на своём месте.',
        'Чтобы складывать столбиком, одинаковые разряды ставят строго друг под другом.'
      ],
      uz: [
        "Xonalarni eslaymiz. Uch ming to'rt yuz ellik olti sonida to'rt xona bor.",
        "Chapda minglik, keyin yuzlik, keyin o'nlik, o'ngda birlik. Har raqam o'z o'rnida.",
        "Ustunda qo'shish uchun bir xil xonalar aynan bir-birining ostiga qo'yiladi."
      ]
    }
  },

  // s2 — TIKLASH (align): 3456 + 2178 ustunga
  s2: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: { ru: 'Ставим числа в столбик по разрядам.', uz: "Sonlarni xonama-xona ustunga qo'yamiz." },
    a: 3456, b: 2178, op: '+',
    done_text: { ru: 'Единицы под единицами, десятки под десятками. Так удобно складывать.', uz: "Birlik birlik ostida, o'nlik o'nlik ostida. Shunday qo'shish qulay." },
    audio: {
      ru: [
        'Возьмём три тысячи четыреста пятьдесят шесть и две тысячи сто семьдесят восемь.',
        'Ставим одно число под другим. Единицы под единицами, десятки под десятками, сотни под сотнями.',
        'Снизу проводим черту. Теперь будем складывать по столбикам, справа налево.'
      ],
      uz: [
        "Uch ming to'rt yuz ellik olti va ikki ming bir yuz yetmish sakkizni olamiz.",
        "Bir sonni ikkinchisining ostiga qo'yamiz. Birlik birlik ostida, o'nlik o'nlik ostida, yuzlik yuzlik ostida.",
        "Pastdan chiziq tortamiz. Endi ustunlab, o'ngdan chapga qo'shamiz."
      ]
    }
  },

  // s3 — QO'SHISH o'tkazish bilan: 3456 + 2178 = 5634
  s3: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: { ru: 'Складываем справа налево, с переносом.', uz: "O'ngdan chapga, o'tkazish bilan qo'shamiz." },
    a: 3456, b: 2178, op: '+', result: 5634,
    done_text: { ru: 'Если в разряде получилось больше девяти, десяток переносим в следующий разряд.', uz: "Xonada to'qqizdan ko'p chiqsa, o'nlikni keyingi xonaga o'tkazamiz." },
    audio: {
      ru: [
        'Складываем единицы. Шесть плюс восемь это четырнадцать. Пишем четыре, а один десяток переносим влево.',
        'Складываем десятки. Пять плюс семь это двенадцать, и ещё один перенос, всего тринадцать. Пишем три, один переносим.',
        'Складываем сотни. Четыре плюс один это пять, и ещё перенос, всего шесть. Пишем шесть.',
        'Складываем тысячи. Три плюс два это пять. Получилось пять тысяч шестьсот тридцать четыре.'
      ],
      uz: [
        "Birlikni qo'shamiz. Olti qo'shuv sakkiz bu o'n to'rt. To'rtni yozamiz, bir o'nlikni chapga o'tkazamiz.",
        "O'nlikni qo'shamiz. Besh qo'shuv yetti bu o'n ikki, yana bitta o'tkazish, jami o'n uch. Uchni yozamiz, bir o'tkazamiz.",
        "Yuzlikni qo'shamiz. To'rt qo'shuv bir bu besh, yana o'tkazish, jami olti. Oltini yozamiz.",
        "Minglikni qo'shamiz. Uch qo'shuv ikki bu besh. Besh ming olti yuz o'ttiz to'rt chiqdi."
      ]
    }
  },

  // s4 — AYIRISH qarz bilan: 5342 - 1867 = 3475
  s4: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: { ru: 'Вычитаем справа налево, с займом.', uz: "O'ngdan chapga, qarz bilan ayiramiz." },
    a: 5342, b: 1867, op: '-', result: 3475,
    done_text: { ru: 'Если цифры не хватает, занимаем десяток у соседа слева.', uz: "Raqam yetmasa, chap qo'shnidan bitta o'nlik qarz olamiz." },
    audio: {
      ru: [
        'Вычитаем единицы. От двух отнять семь нельзя. Занимаем десяток у соседа. Двенадцать минус семь это пять.',
        'Вычитаем десятки. Осталось три, отнять шесть нельзя. Снова занимаем. Тринадцать минус шесть это семь.',
        'Вычитаем сотни. Осталось два, отнять восемь нельзя. Занимаем. Двенадцать минус восемь это четыре.',
        'Вычитаем тысячи. Осталось четыре, отнять один это три. Получилось три тысячи четыреста семьдесят пять.'
      ],
      uz: [
        "Birlikni ayiramiz. Ikkidan yettini ayirib bo'lmaydi. Qo'shnidan o'nlik qarz olamiz. O'n ikki ayir yetti bu besh.",
        "O'nlikni ayiramiz. Uch qoldi, oltini ayirib bo'lmaydi. Yana qarz olamiz. O'n uch ayir olti bu yetti.",
        "Yuzlikni ayiramiz. Ikki qoldi, sakkizni ayirib bo'lmaydi. Qarz olamiz. O'n ikki ayir sakkiz bu to'rt.",
        "Minglikni ayiramiz. To'rt qoldi, birni ayirsak bu uch. Uch ming to'rt yuz yetmish besh chiqdi."
      ]
    }
  },

  // s5 — QOIDA
  s5: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    rule: { ru: 'Пишем разряд под разрядом. Считаем справа налево. При сложении лишний десяток переносим влево, при вычитании занимаем десяток у соседа.', uz: "Xonani xona ostiga yozamiz. O'ngdan chapga hisoblaymiz. Qo'shishda ortiqcha o'nlikni chapga o'tkazamiz, ayirishda qo'shnidan o'nlik qarz olamiz." },
    a: 346, b: 128, op: '+', result: 474,
    check_q: { ru: 'Сложи столбиком: чему равно 346 плюс 128?', uz: "Ustunda qo'sh: 346 qo'shuv 128 nechaga teng?" },
    check_opts: ['474', '464'],
    check_ci: 0,
    check_ok: { ru: 'Верно! Шесть плюс восемь четырнадцать, перенос — получается 474.', uz: "To'g'ri! Olti qo'shuv sakkiz o'n to'rt, o'tkazish — 474 chiqadi." },
    check_no: { ru: 'Не забудь перенос из единиц. Шесть плюс восемь это четырнадцать. Ответ 474.', uz: "Birlikdan o'tkazishni unutma. Olti qo'shuv sakkiz o'n to'rt. Javob 474." },
    audio: {
      ru: [
        'Отлично, теперь запомним правило письменного счёта.',
        'Пишем число под числом, разряд строго под разрядом. Считаем всегда справа налево, от единиц.',
        'При сложении, если в разряде вышло больше девяти, лишний десяток переносим в следующий разряд влево.',
        'При вычитании, если цифры не хватает, занимаем один десяток у соседа слева. А теперь сам. Сложи столбиком триста сорок шесть и сто двадцать восемь.'
      ],
      uz: [
        "Zo'r, endi yozma hisob qoidasini eslab qolamiz.",
        "Sonni son ostiga, xonani aynan xona ostiga yozamiz. Doim o'ngdan chapga, birlikdan hisoblaymiz.",
        "Qo'shishda, agar xonada to'qqizdan ko'p chiqsa, ortiqcha o'nlikni keyingi chap xonaga o'tkazamiz.",
        "Ayirishda, agar raqam yetmasa, chap qo'shnidan bitta o'nlik qarz olamiz. Endi o'zingiz. Uch yuz qirq olti va bir yuz yigirma sakkizni ustunda qo'shing."
      ]
    }
  },

  // s6 — MASHQ qo'shish (NumPad), 3 raund
  s6: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    q: { ru: 'Сложи столбиком.', uz: "Ustunda qo'sh." },
    op: '+',
    check_label: { ru: 'Проверить', uz: 'Tekshirish' },
    items: [
      { a: 2345, b: 1432, ans: 3777, hint: { ru: 'Складывай справа налево, разряд за разрядом.', uz: "O'ngdan chapga, xonama-xona qo'sh." } },
      { a: 3456, b: 2178, ans: 5634, hint: { ru: 'Не забудь переносы: шесть плюс восемь четырнадцать.', uz: "O'tkazishni unutma: olti qo'shuv sakkiz o'n to'rt." } },
      { a: 4508, b: 2394, ans: 6902, hint: { ru: 'Восемь плюс четыре двенадцать — перенос десятка.', uz: "Sakkiz qo'shuv to'rt o'n ikki — o'nlik o'tkaziladi." } }
    ],
    audio: {
      intro: { ru: 'Складывай числа столбиком. Набери ответ и нажми проверить. Три задания.', uz: "Sonlarni ustunda qo'sh. Javobni terib, tekshirishni bos. Uchta topshiriq." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Считай справа налево, не забывай переносы.', uz: "O'ngdan chapga hisobla, o'tkazishlarni unutma." }
    }
  },

  // s7 — MASHQ ayirish (NumPad), 3 raund
  s7: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    q: { ru: 'Вычти столбиком.', uz: "Ustunda ayir." },
    op: '-',
    check_label: { ru: 'Проверить', uz: 'Tekshirish' },
    items: [
      { a: 4785, b: 2341, ans: 2444, hint: { ru: 'Вычитай справа налево, разряд за разрядом.', uz: "O'ngdan chapga, xonama-xona ayir." } },
      { a: 5342, b: 1867, ans: 3475, hint: { ru: 'Где не хватает, занимай десяток у соседа.', uz: "Yetmagan joyda qo'shnidan o'nlik qarz ol." } },
      { a: 6003, b: 2748, ans: 3255, hint: { ru: 'Занимай через нули по очереди, справа налево.', uz: "Nollar orqali navbatma-navbat qarz ol, o'ngdan chapga." } }
    ],
    audio: {
      intro: { ru: 'Вычитай числа столбиком. Набери ответ и нажми проверить. Три задания.', uz: "Sonlarni ustunda ayir. Javobni terib, tekshirishni bos. Uchta topshiriq." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Считай справа налево. Где не хватает — занимай.', uz: "O'ngdan chapga hisobla. Yetmasa — qarz ol." }
    }
  },

  // s8 — MASHQ xatoni top (hisob yozuvlari), 3 raund
  s8: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    q: { ru: 'Найди неверный пример.', uz: "Noto'g'ri misolni toping." },
    items: [
      {
        stmts: ['3456 + 2178 = 5534', '2345 + 1432 = 3777', '4000 + 500 = 4500'],
        wrong: 0,
        hint: { ru: 'В сотнях с переносом выходит шесть: 3456 плюс 2178 это 5634, а не 5534.', uz: "Yuzlikda o'tkazish bilan olti chiqadi: 3456 qo'shuv 2178 bu 5634, 5534 emas." }
      },
      {
        stmts: ['5342 - 1867 = 3475', '4785 - 2341 = 2544', '6000 - 2000 = 4000'],
        wrong: 1,
        hint: { ru: 'Семь сотен минус три это четыре: 4785 минус 2341 это 2444, а не 2544.', uz: "Yetti yuzlik ayir uch bu to'rt: 4785 ayir 2341 bu 2444, 2544 emas." }
      },
      {
        stmts: ['7250 + 1300 = 8550', '3200 + 2900 = 5100', '9000 - 4500 = 4500'],
        wrong: 1,
        hint: { ru: 'Три плюс два тысячи это пять, с переносом сотен — шесть тысяч: 3200 плюс 2900 это 6100.', uz: "Uch qo'shuv ikki minglik besh, yuzlik o'tkazish bilan — olti ming: 3200 qo'shuv 2900 bu 6100." }
      }
    ],
    audio: {
      intro: { ru: 'Даю три примера. Один посчитан неверно. Найди неверный пример.', uz: "Uchta misol beraman. Bittasi noto'g'ri hisoblangan. Noto'g'ri misolni toping." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Пересчитай столбиком, справа налево. Посмотри ещё.', uz: "Ustunda o'ngdan chapga qayta hisobla. Yana qara." }
    }
  },

  // s9 — MASALA (case): hisob terminali (Jasur jami), NumPad
  s9: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    lead: { ru: 'Джасур собрал модули: 2640 днём и 1785 вечером.', uz: 'Jasur modul yig\'di: kunduzi 2640, kechqurun 1785.' },
    a: 2640, b: 1785, op: '+', ans: 4425,
    q: { ru: 'Сколько всего модулей? Сложи столбиком.', uz: "Jami nechta modul? Ustunda qo'sh." },
    setup_audio: { ru: 'Джасур собирал модули для города. Днём собрал две тысячи шестьсот сорок, вечером ещё тысячу семьсот восемьдесят пять.', uz: "Jasur shahar uchun modul yig'di. Kunduzi ikki ming olti yuz qirqta, kechqurun yana bir ming yetti yuz sakson beshta." },
    audio: {
      intro: { ru: 'Сложи столбиком, сколько всего модулей, и набери ответ.', uz: "Jami nechta modul ekanini ustunda qo'sh va javobni ter." },
      on_correct: { ru: 'Верно. Две тысячи шестьсот сорок плюс тысяча семьсот восемьдесят пять это четыре тысячи четыреста двадцать пять.', uz: "To'g'ri. Ikki ming olti yuz qirq qo'shuv bir ming yetti yuz sakson besh bu to'rt ming to'rt yuz yigirma besh." },
      on_wrong: { ru: 'Считай справа налево, не забывай переносы.', uz: "O'ngdan chapga hisobla, o'tkazishni unutma." }
    }
  },

  // s10 — FINAL panel (5 savol) + FactCard
  s10: {
    eyebrow: { ru: 'Финал', uz: 'Final' },
    intro_line: { ru: 'Городской компьютер проверит тебя. Пять заданий.', uz: "Shahar kompyuteri sizni tekshiradi. Beshta topshiriq." },
    items: [
      {
        kind: 'num', ans: 5685,
        q: { ru: 'Сложи столбиком: 3254 + 2431.', uz: "Ustunda qo'sh: 3254 + 2431." },
        hint: { ru: 'Справа налево, разряд за разрядом.', uz: "O'ngdan chapga, xonama-xona." }
      },
      {
        kind: 'num', ans: 3200,
        q: { ru: 'Вычти столбиком: 5600 − 2400.', uz: "Ustunda ayir: 5600 − 2400." },
        hint: { ru: 'Из шести сотен отними четыре — две сотни. Тысячи: пять минус два.', uz: "Olti yuzlikdan to'rtni ayir — ikki yuzlik. Minglik: besh ayir ikki." }
      },
      {
        kind: 'mc',
        q: { ru: 'Какой ответ верный: 2345 + 1432?', uz: "Qaysi javob to'g'ri: 2345 + 1432?" },
        opt0: { ru: '3777', uz: '3777' },
        opt1: { ru: '3677', uz: '3677' },
        opt2: { ru: '3877', uz: '3877' },
        wrong_1: { ru: 'В сотнях три плюс четыре это семь: 3777.', uz: "Yuzlikda uch qo'shuv to'rt bu yetti: 3777." },
        wrong_2: { ru: 'Пересчитай сотни: три плюс четыре семь, а не восемь.', uz: "Yuzlikni qayta sana: uch qo'shuv to'rt yetti, sakkiz emas." }
      },
      {
        kind: 'num', ans: 7005,
        q: { ru: 'Сложи столбиком: 4067 + 2938.', uz: "Ustunda qo'sh: 4067 + 2938." },
        hint: { ru: 'Семь плюс восемь пятнадцать, дальше переносы до тысяч.', uz: "Yetti qo'shuv sakkiz o'n besh, keyin o'tkazishlar minglikkacha." }
      },
      {
        kind: 'num', ans: 3500,
        q: { ru: 'Загадка. Я между 3000 и 4000. Если ко мне прибавить 2000, будет 5500. Кто я?', uz: "Jumboq. Men 3000 bilan 4000 orasidaman. Menga 2000 qo'shsa, 5500 chiqadi. Men kimman?" },
        hint: { ru: 'От пяти тысяч пятисот отними две тысячи.', uz: "Besh ming besh yuzdan ikki mingni ayir." }
      }
    ],
    fact_badge: { ru: 'Знаешь?', uz: 'Bilasizmi?' },
    fact_text: { ru: 'Красные карлики иногда сильно вспыхивают: за минуты становятся во много раз ярче. Такие вспышки видно даже с далёких планет.', uz: "Qizil mitti yulduzlar ba'zan kuchli chaqnaydi: bir necha daqiqada ancha yorug'roq bo'ladi. Bunday chaqnashlar uzoq sayyoralardan ham ko'rinadi." },
    fact_audio: { ru: 'Красные карлики иногда сильно вспыхивают. За минуты они становятся во много раз ярче. Такие вспышки видно даже с далёких планет.', uz: "Qizil mitti yulduzlar ba'zan kuchli chaqnaydi. Bir necha daqiqada ancha yorug'roq bo'ladi. Bunday chaqnashlar uzoq sayyoralardan ham ko'rinadi." },
    audio: {
      intro: { ru: 'Финальная проверка. Городской компьютер показывает примеры, отвечай на каждый.', uz: "Yakuniy tekshiruv. Shahar kompyuteri misollar ko'rsatadi, har biriga javob bering." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Посмотри разбор справа.', uz: "O'ngdagi tushuntirishga qarang." }
    }
  },

  // s11 — YAKUN
  s11: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    praise: { ru: 'Молодец!', uz: 'Barakalla!' },
    mission_done: { ru: 'Счётный терминал заработал!', uz: 'Hisob terminali ishga tushdi!' },
    cando: { ru: 'Теперь ты складываешь и вычитаешь большие числа столбиком.', uz: "Endi siz katta sonlarni ustunda qo'shasiz va ayirasiz." },
    rule_recap: { ru: 'Разряд под разрядом, считаем справа налево. Сложение — перенос влево, вычитание — заём у соседа.', uz: "Xona xona ostida, o'ngdan chapga hisoblaymiz. Qo'shishda — chapga o'tkazish, ayirishda — qo'shnidan qarz." },
    conn_label_refs: { ru: 'Опирается на', uz: 'Tayanadi' },
    conn_refs: { ru: 'третий урок: разрядные слагаемые', uz: "uchinchi dars: razryad qo'shiluvchilari" },
    conn_label_next: { ru: 'Дальше', uz: 'Keyingi' },
    conn_next: { ru: 'Урок 8: системы счисления и римские цифры', uz: "8-dars: sanoq sistemalari va Rim raqamlari" },
    audio: {
      ru: 'Счётный терминал заработал. Мы научились складывать и вычитать большие числа столбиком. Запомни. Пишем разряд под разрядом и считаем справа налево. При сложении лишний десяток переносим влево, при вычитании занимаем десяток у соседа. В следующий раз познакомимся с системами счисления и римскими цифрами.',
      uz: "Hisob terminali ishga tushdi. Biz katta sonlarni ustunda qo'shish va ayirishni o'rgandik. Yodda tuting. Xonani xona ostiga yozamiz va o'ngdan chapga hisoblaymiz. Qo'shishda ortiqcha o'nlikni chapga o'tkazamiz, ayirishda qo'shnidan o'nlik qarz olamiz. Keyingi safar sanoq sistemalari va Rim raqamlari bilan tanishamiz."
    }
  }
};

// slaydlararo ko'priklar (audio-intro boshiga; ekranda ko'rinmaydi). TTS-toza.
const BRIDGES = {
  s1:  { ru: 'Вспомним разряды.', uz: 'Xonalarni eslaymiz.' },
  s2:  { ru: 'Поставим числа в столбик.', uz: "Sonlarni ustunga qo'yamiz." },
  s3:  { ru: 'Складываем с переносом.', uz: "O'tkazish bilan qo'shamiz." },
  s4:  { ru: 'А теперь вычитаем.', uz: 'Endi ayiramiz.' },
  s5:  { ru: 'Запишем это правилом.', uz: 'Buni qoida qilib olamiz.' },
  s6:  { ru: 'Правило знаем. Складывай сам.', uz: "Qoidani bilamiz. O'zingiz qo'shing." },
  s7:  { ru: 'Теперь вычитай.', uz: 'Endi ayiring.' },
  s8:  { ru: 'Проверим примеры на ошибку.', uz: 'Misollarni xatoga tekshiramiz.' },
  s9:  { ru: 'Джасур собрал модули.', uz: "Jasur modul yig'di." },
  s10: { ru: 'Городской компьютер сделает финальную проверку.', uz: 'Shahar kompyuteri yakuniy tekshiradi.' },
  s11: { ru: 'Терминал заработал. Идём дальше!', uz: 'Terminal ishladi. Davom etamiz!' }
};

// s11 payoff (xulosadan oldin aytiladi)
const S11_PAYOFF = {
  ru: 'Миссия выполнена! Мы научились считать большие числа столбиком, и счётный терминал города заработал. Спасибо за помощь!',
  uz: "Missiya bajarildi! Biz katta sonlarni ustunda hisoblashni o'rgandik, va shaharning hisob terminali ishga tushdi. Yordamingiz uchun rahmat!"
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
      <CountingHallBg/>
      <div className="lm-scene-cast">
        {LUMO_CAST.slice(0, 2).map(kid)}
        <span className={`lm-crew lm-crew-host ${gathered ? 'd2-bit-cheer' : 'lm-bob'}`}><span className="g1-cast-fig"><BitSVG state={gathered ? 'happy' : 'present'}/></span></span>
        {LUMO_CAST.slice(2).map((c, i) => kid(c, i + 2))}
      </div>
    </div>
  );
};




// ============================================================
// EKRANLAR — Dars07 «Yozma qo'shish va ayirish» (10000 gacha, ustun)
// ============================================================



// --- HISOB ZALI SAHNASI (D07): ichki zal, terminal-konsol + daftar-ustunlar
const CountingHallBg = () => (
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

    <rect x="120" y="102" width="160" height="66" rx="7" fill="url(#shPanel)" stroke="#3E6E90" strokeWidth="1.6"/>
    <rect x="126" y="106" width="148" height="10" rx="3" fill="#122236"/>
    <text x="200" y="113.5" textAnchor="middle" fontSize="7" letterSpacing="1.5" fill="#7FB8D8" fontFamily="'JetBrains Mono', monospace">USTUN HISOB</text>
    <text x="214" y="132" textAnchor="middle" fontSize="17" fontWeight="800" fill="#EAF6FB" fontFamily="'JetBrains Mono', monospace">356</text>
    <text x="214" y="152" textAnchor="middle" fontSize="17" fontWeight="800" fill="#EAF6FB" fontFamily="'JetBrains Mono', monospace">428</text>
    {/* + belgisi ikki son ANIQ o'rtasida (vertikal markaz) */}
    <text x="178" y="144" textAnchor="middle" fontSize="17" fontWeight="800" fill="#5AC6F0" fontFamily="'JetBrains Mono', monospace">+</text>
    <line x1="170" y1="158" x2="258" y2="158" stroke="#8FA6B8" strokeWidth="1.5"/>
    <path d="M160 156 h80 l10 20 h-100 Z" fill="#C3A87E"/><rect x="156" y="174" width="88" height="4" fill="#A98C64"/>
    {/* chap: abak (hisob-donalari) */}
    <g transform="translate(20 116)"><rect x="0" y="0" width="30" height="58" rx="4" fill="#C3A87E" stroke="#8A7550" strokeWidth="1"/>{[10, 22, 34, 46].map((y, r) => <g key={r}><line x1="4" y1={y} x2="26" y2={y} stroke="#8A7550" strokeWidth="0.8"/>{[0,1,2,3].map((c)=><circle key={c} cx={7+c*6} cy={y} r="2.4" fill={r%2?'#6FD0E4':'#F2A85C'}/>)}</g>)}</g>
    {/* o'ng: daftar-varaq (tally) */}
    <g transform="translate(352 116)"><rect x="0" y="0" width="32" height="58" rx="3" fill="#EAF6FB" stroke="#8A7550" strokeWidth="1"/><g stroke="#8FA6B8" strokeWidth="0.8">{[12,22,32,42].map((y,k)=><line key={k} x1="4" y1={y} x2="28" y2={y}/>)}</g><text x="16" y="10" textAnchor="middle" fontSize="6" fill="#5E86A2" fontFamily="'JetBrains Mono', monospace">+/-</text></g>
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
      <CountingHallBg/>
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


const NumPad = ({ value, setValue, disabled, max = 4, state = null }) => {
  const push = (d) => { if (disabled) return; setValue((v) => (v.length >= max ? v : v + d)); };
  const back = () => { if (disabled) return; setValue((v) => v.slice(0, -1)); };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div className={`mono${state === 'bad' ? ' lm-ans-bad' : ''}`} style={{ minWidth: 140, height: 'clamp(40px, min(46px, 6.1dvh), 46px)', borderRadius: 12, border: `2.5px solid ${state === 'ok' ? '#1F7A4D' : state === 'bad' ? '#E0563A' : T.accent}`, background: state === 'ok' ? '#EAF6EF' : state === 'bad' ? '#FDECE7' : T.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, color: state === 'ok' ? '#1F7A4D' : state === 'bad' ? '#B33F27' : T.ink, letterSpacing: 4, padding: '0 14px', transition: 'border-color .18s, background .18s, color .18s' }}>{value || '—'}</div>
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

// --- USTUN-HISOB: sonlarni xonama-xona tik ustunda, o'tkazish/qarz belgilari bilan.
const ColumnCalc = ({ a, b, op, width = 4, showResult = false, showMarks = false }) => {
  const res = op === '+' ? a + b : a - b;
  const pad = (n) => String(Math.abs(n)).padStart(width, ' ').split('');
  const da = pad(a), db = pad(b), dr = pad(res);
  const marks = new Array(width).fill('');
  if (op === '+') {
    let carry = 0;
    for (let i = width - 1; i >= 0; i -= 1) { const x = (parseInt(da[i], 10) || 0) + (parseInt(db[i], 10) || 0) + carry; carry = x >= 10 ? 1 : 0; if (i > 0 && carry) marks[i - 1] = '1'; }
  } else {
    let borrow = 0;
    for (let i = width - 1; i >= 0; i -= 1) { const x = (parseInt(da[i], 10) || 0) - (parseInt(db[i], 10) || 0) - borrow; if (x < 0) { borrow = 1; marks[i] = '•'; } else borrow = 0; }
  }
  const CW = 'clamp(20px, 5.5vw, 30px)';
  const Cell = ({ ch, color }) => <span style={{ width: CW, textAlign: 'center', display: 'inline-block', color: color || T.ink }}>{ch === ' ' ? '' : ch}</span>;
  const blanks = new Array(width).fill('');
  return (
    <div className="mono" style={{ fontSize: 'clamp(22px, 5vw, 32px)', fontWeight: 800, lineHeight: 1.2 }}>
      {showMarks && (
        <div style={{ display: 'flex', height: 'clamp(14px, 3vw, 18px)' }}>
          <Cell ch=""/>{marks.map((m, i) => <Cell key={i} ch={m} color="#C0392B"/>)}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Cell ch={op} color={T.accent}/>
        <div>
          <div style={{ display: 'flex' }}>{da.map((ch, i) => <Cell key={i} ch={ch}/>)}</div>
          <div style={{ display: 'flex' }}>{db.map((ch, i) => <Cell key={i} ch={ch}/>)}</div>
        </div>
      </div>
      <div style={{ display: 'flex', borderTop: `3px solid ${T.ink}`, marginTop: 3, paddingTop: 3 }}>
        <Cell ch=""/>{(showResult ? dr : blanks).map((ch, i) => <Cell key={i} ch={showResult ? ch : ''} color={T.success}/>)}
      </div>
    </div>
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
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <div className="fade-up" style={{ alignSelf: 'center', background: T.accentSoft, color: T.accent, fontWeight: 800, fontSize: 'clamp(12px, 1.8vw, 15px)', padding: '5px 14px', borderRadius: 999 }}>{t(c.topic)}</div>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ padding: 'clamp(8px, 1.8vw, 14px)', overflow: 'hidden' }}>
          <LessonScene gathered={ok}/>
        </div>
        <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(16px, 3vw, 24px)' }}>
          <ColumnCalc a={c.a} b={c.b} op="+"/>
        </div>
        <p className="fade-up delay-1" style={{ textAlign: 'center', color: T.ink2, fontWeight: 600, fontSize: 'clamp(14px, 1.9vw, 17px)', margin: 0 }}>{t(c.q)}</p>
        {picked === null && (
          <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {opts.map((o, i) => (
              <button key={i} className="option" disabled={!canAct} onClick={() => pick(i)}
                style={{ padding: 'clamp(10px, 1.5vw, 12px)', fontSize: 'clamp(13px, 1.7vw, 15px)', minHeight: 'clamp(48px, 7vw, 58px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                {t(o)}
              </button>
            ))}
          </div>
        )}
        {picked !== null && (
          <div className="fade-up" style={{ display: 'flex', justifyContent: 'center' }}>
            <button className={`option ${ok ? 'option-correct' : 'option-picked-wrong'}`} disabled
              style={{ padding: 'clamp(10px, 1.5vw, 12px) clamp(16px, 2.4vw, 22px)', fontSize: 'clamp(13px, 1.7vw, 15px)', minHeight: 'clamp(46px, 6.5vw, 56px)', width: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
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

// s1 — RECALL: 4 xonali razryad
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
  const digs = String(c.num).split('');
  const labels = lang === 'ru' ? c.labels_ru : c.labels_uz;
  const cols = ['#7A3FA0', '#C0392B', '#1F7A4D', T.blue];
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(6px, 1.8vw, 14px)', padding: 'clamp(14px, 2.6vw, 22px)', minHeight: 'clamp(150px, 32vw, 200px)', alignItems: 'center' }}>
          {digs.map((d, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <span className="mono" style={{ fontSize: 'clamp(28px, 6.5vw, 42px)', fontWeight: 800, color: cols[i], border: `2.5px solid ${cols[i]}`, borderRadius: 10, minWidth: 'clamp(34px, 8.5vw, 48px)', textAlign: 'center', padding: '2px 0', background: T.paper }}>{d}</span>
              {reached >= 1 && <span className="mono lm-drop" style={{ fontSize: 'clamp(9px, 1.4vw, 11px)', color: T.ink2, fontWeight: 700, writingMode: 'horizontal-tb' }}>{labels[i]}</span>}
            </div>
          ))}
        </div>
      </div>
    </Stage>
  );
};

// s2/s3/s4 — USTUN explore
const ExploreColumn = ({ props, ck, markFrom = 1 }) => {
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
  const done = reached >= (c.audio[lang].length - 1);
  const hasResult = c.result !== undefined;
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
        <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(16px, 3vw, 26px)', minHeight: 'clamp(160px, 34vw, 220px)', alignItems: 'center' }}>
          <ColumnCalc a={c.a} b={c.b} op={c.op} showMarks={hasResult && reached >= markFrom} showResult={hasResult && done}/>
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
const Screen2 = (props) => <ExploreColumn props={props} ck="s2"/>;
const Screen3 = (props) => <ExploreColumn props={props} ck="s3"/>;
const Screen4 = (props) => <ExploreColumn props={props} ck="s4"/>;

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
          <ColumnCalc a={c.a} b={c.b} op={c.op} width={3} showMarks={ok} showResult={ok}/>
          <p style={{ textAlign: 'center', color: T.ink2, fontWeight: 700, margin: 0 }}>{ok ? t(c.check_ok) : (picked !== null ? t(c.check_no) : t(c.check_q))}</p>
          <div style={{ display: 'flex', gap: 10 }}>
            {order.map((k, i) => (
              <button key={i} className={`option ${ok && i === ci ? 'option-correct' : ''} ${picked === i && i !== ci ? 'option-picked-wrong' : ''}`} disabled={!canAct || ok} onClick={() => pick(i)}
                style={{ padding: 'clamp(10px, 1.6vw, 13px) clamp(16px, 2.4vw, 22px)', fontSize: 'clamp(16px, 2.6vw, 20px)', minHeight: 'clamp(46px, 6.5vw, 56px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>{c.check_opts[k]}</button>
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

// s6/s7 — MASHQ ustun-amal (NumPad), 3 raund
const ColumnPractice = ({ props, ck }) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT[ck];
  const sfx = useSfx();
  const items = c.items;
  const audio = useAudio([
    brgSeg(ck, lang),
    { id: `${ck}_intro`, text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
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
    if (isOk) { sfx.playCorrect(); setTimeout(() => { setChecked(false); if (round + 1 < items.length) setVal(''); setRound((r) => r + 1); }, 1100); }
    else { setTimeout(() => { setChecked(false); setVal(''); }, 1800); }
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
              <ColumnCalc a={it.a} b={it.b} op={c.op} showResult={checked && roundOk} showMarks={checked && roundOk}/>
              <NumPad value={val} setValue={setVal} disabled={!canAct || checked || done} max={4}/>
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
const Screen6 = (props) => <ColumnPractice props={props} ck="s6"/>;
const Screen7 = (props) => <ColumnPractice props={props} ck="s7"/>;

// s8 — MASHQ xatoni top (hisob yozuvlari)
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
            <div className="mono fade-up" style={{ textAlign: 'center', color: T.accent, fontWeight: 800 }}>{lang === 'ru' ? `Задание ${Math.min(idx + 1, items.length)} из ${items.length}` : `${Math.min(idx + 1, items.length)}-topshiriq, jami ${items.length}`}</div>
            <h1 className="title h-sub fade-up">{t(c.q)}</h1>
            <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.8vw, 12px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
              <FrameFx/>
              {it.stmts.map((stmt, i) => (
                <button key={i} className={`option ${wrongSet.has(i) ? 'option-picked-wrong' : ''} ${solvedRound && i === it.wrong ? 'option-correct' : ''}`} disabled={!canAct || solvedRound || wrongSet.has(i)} onClick={() => pick(i)}
                  style={{ padding: 'clamp(10px, 1.6vw, 14px)', minHeight: 'clamp(46px, 6.5vw, 56px)', fontSize: 'clamp(14px, 2.6vw, 19px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, letterSpacing: 1 }}>{stmt}</button>
              ))}
              {wrongSet.size > 0 && !solvedRound && <p className="fade-up" style={{ margin: 0, color: T.ink2, textAlign: 'center', fontSize: 'clamp(13px, 1.7vw, 15px)' }}>{t(it.hint)}</p>}
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

// s9 — MASALA (case): hisob terminali (NumPad)
const Screen9 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s9;
  const sfx = useSfx();
  const audio = useAudio([
    brgSeg('s9', lang),
    { id: 's9_setup', text: c.setup_audio[lang], trigger: 'after_previous', waits_for: null },
    { id: 's9_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
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
    if (!isOk) setTimeout(() => { setChecked(false); setVal(''); }, 1700);
  };
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
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(10px, 2vw, 14px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
          <FrameFx/>
          <ColumnCalc a={c.a} b={c.b} op={c.op} showResult={solved} showMarks={solved}/>
          <NumPad value={val} setValue={setVal} disabled={!canAct || solved} max={4}/>
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

// s10 — FINAL panel (5 savol aralash) + FactCard
const Screen10 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s10;
  const items = c.items;
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
                  <NumPad value={val} setValue={setVal} disabled={!canAct || numLock} max={4} state={numState}/>
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
                      style={{ padding: 'clamp(10px, 1.6vw, 13px)', fontSize: 'clamp(16px, 2.4vw, 20px)', minHeight: 'clamp(46px, 6.5vw, 56px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>
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
            <div className="frame-success fade-up" style={{ marginBottom: 12 }}><Reaction state="correct" praise={lang === 'ru' ? `Верно: ${score} из ${items.length}` : `To'g'ri: ${items.length} tadan ${score} ta`}/></div>
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
export default function WrittenCalcLesson({
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
