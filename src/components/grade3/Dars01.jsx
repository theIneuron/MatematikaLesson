import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { AnsPop, AudioEngine, AudioIndicator, BackLabel, BigNum, BitSVG, Chiroq, Confetti, D2Defs, D2Motes, ENCOURAGE, FREE_NAV, FeedbackBlock, Frac, FrameFx, GradientDefs, HeroContext, ICON, InfoNote, LUMO_CAST, LangContext, Lenta, LumoCityBg, NavBack, NavNext, NextLabel, Obj, Op, PRAISE, Panel, Pips, ProgressContext, QuestionScreen, Reaction, ReadinessMeter, Slider, SparkBurst, Stage, StageHero, T, autoScrollTo, buildTtsUrl, configureLesson, getAudioEngine, mt, nextEncourage, nextPraise, npKey, playChime, shuffleArr, ttsConfig, useAdvanceGate, useAudio, useCanAnswer, useCountOnce, useHero, useIsMobile, useLang, useMobileZoom, usePrefersReducedMotion, useRevealScroll, useSfx, useT, makeBrgSeg } from './_kit/index.jsx';
import { BASE_STYLES } from './_kit/styles.js';

// ============================================================================
// ░░ 3-SINF · Dars01 — "Yuzliklar, o'nliklar, birliklar" (num-3-01-v1) · Б1 · GRADE3 ETALON NOMZODI ░░
// Syujet: Bit sayyorasi LUMO (SYUJET_3SINF.md Б1 d.1). Do'stlar Lumoga qo'ndi, Bit — mezbon;
//   shahar chiroqlari yuzlab; 10 o'nlik = 1 yuzlik razryad birligi. FactCard: qizil mitti yulduz.
// Infra: grade2 Dars01.jsx dan BAYT-ANIQ ko'chirildi (AudioEngine v5.2 ayol ovoz g=f, useAudio,
//   useCanAnswer/useAdvanceGate, Stage/QuestionScreen, Bit-kartochka, CSS v15). O'zgarmadi.
// YADRO: uch xonali son = yuzlik + o'nlik + birlik; o'rin qiymatni belgilaydi; nol o'rinni saqlaydi (305).
// REKVIZIT (Lumo, yorug'lik): chiroq (birlik) · lenta = 10 chiroq (o'nlik) · panel = 10 lenta (yuzlik).
//   Fon: qizil mitti osmon + chiroqli minoralar (LumoCityBg). Razryad-mat 3 ustun (RazryadTable).
// MEXANIKA: unitizing 10 lenta->panel (s2), build 245 (s3), razryad-karta 345=300+40+5 (s4),
//   o'rin 345/435/543 (s5), son o'qi 470 (s6), QOIDA (s7), build 362 (s8), tasniflash 528 (s9),
//   MC nol-o'rin 305 (s10), taqqoslash 345/354 (s11), shahar hisobi 346 (sCASE), final panel 4 savol (s14).
// s1 (1-sinf recall) — endi kosmik: o'nta porlovchi birlik-element suzib bitta blokka birlashadi.
// Misconception'lar: M1 45<->54 · M2 o'nlik+birlikni QO'SHISH · M3 "502" · M4 kasseta/batareya farqi.
//
// FREE_NAV=true (blokirovka o'chiq — push oldidan false ga qaytariladi).
//
// ETALON KIT bloklari (grade1 Dars28 merosi):
//   1) INFRA — T, ttsConfig/configureLesson, buildTtsUrl, useSfx/playChime, LangContext/useT,
//      useIsMobile/useMobileZoom, AudioEngine/useAudio, useCanAnswer/useAdvanceGate,
//      Op/Frac/mt, AudioIndicator, autoScrollTo/useRevealScroll, FeedbackBlock, Slider,
//      Stage/NavBack/NavNext, QuestionScreen (keep-visible)
//   2) ANIMATSION KIT — usePrefersReducedMotion, useCountOnce, GradientDefs, ICON/Obj/Pips
//   3) BIT-KARTOCHKA + rag'bat — Reaction, PRAISE/ENCOURAGE, nextPraise/nextEncourage
//   4) PERSONAJ — BitSVG (yakka cast), HeroContext/useHero, StageHero, Confetti
//   5) AnsPop + SparkBurst; CSS (STYLES) — bazaviy + mobil zoom-qatlam + reduced-motion
// ============================================================================






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
  lessonId: 'num-3-01-v1',
  lessonTitle: { ru: 'Урок 1. Сотни, десятки и единицы', uz: "1-dars. Yuzliklar, o'nliklar va birliklar" }
};
// STRUKTURA: 1–7 tushuntirish · 8–13 mashq · 14 final · 15 xulosa. Grade2 Dars01 etaloni yoyi,
// yuzlik qo'shilgan (uch pog'onali razryad). Syujet: Bit sayyorasi Lumo (SYUJET_3SINF.md Б1 d.1).
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },      // 0  hook: Lumoga qo'nish
  { id: 's1',  type: 'exploration', template: 'custom',   scored: false, scope: null },        // 1  recall 72 + unitizing (birlashgan, ketma-ket)
  { id: 's3',  type: 'exploration', template: 'custom',   scored: false, scope: null },        // 2  245 ni yig'ish
  { id: 's4',  type: 'exploration', template: 'custom',   scored: false, scope: null },        // 4  razryad kartasi 345=300+40+5
  { id: 's5',  type: 'exploration', template: 'custom',   scored: false, scope: null },        // 5  o'rin hal qiladi 345/435/543
  { id: 's6',  type: 'exploration', template: 'custom',   scored: false, scope: null },        // 6  son o'qi 300-800
  { id: 'sming', type: 'exploration', template: 'custom', scored: false, scope: null },        // 7  KASHFIYOT: 10 yuzlik = 1000
  { id: 's7',  type: 'rule',        template: 'custom',   scored: false, scope: null },        // 8  QOIDA (hookga qaytadi)
  { id: 's8',  type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },  // 8  mashq: 362 ni yig'ish
  { id: 's9',  type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },  // 9  tasniflash (528 tap-to-bin)
  { id: 's10', type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },  // 10 MC nol-o'rin 305
  { id: 's11', type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },  // 11 taqqoslash 345/354
  { id: 'sCASE', type: 'case',      template: 'custom',   scored: true,  scope: 'practice' },  // 12 shahar hisobi (s12+s13): jami 346
  { id: 's14',  type: 'test',       template: 'custom',   scored: true,  scope: 'final' },     // 13 FINAL panel: 4 savol + FactCard
  { id: 's15',  type: 'summary',    template: 'custom',   scored: false, scope: 'final' }      // 14 yakun + QOIDA recap
];





// ============================================================
// CONTENT — 3-sinf Dars01 «Yuzliklar, o'nliklar, birliklar» (num-3-01-v1). RU + UZ to'liq.
// Audio TTS-toza: sonlar so'z bilan, «» va matematik belgilar yo'q, bir segment = bir fikr.
// Rekvizit: chiroq (birlik) · lenta = 10 chiroq (o'nlik) · panel = 10 lenta (yuzlik). Lumo shahri.
// ============================================================

const CONTENT = {
  // s0 — HOOK (scope: hook): Lumoga qo'nish, shahar chiroqlari yuzlab
  s0: {
    eyebrow: { ru: 'Миссия', uz: 'Missiya' },
    topic: { ru: 'Тема: Сотни, десятки и единицы', uz: "Mavzu: Yuzliklar, o'nliklar va birliklar" },
    lead: { ru: 'Корабль сел на планету Бита — Лумо!', uz: "Kema Bitning sayyorasi — Lumoga qo'ndi!" },
    q: { ru: 'Как быстро сосчитать сотни огней города?', uz: "Shaharning yuzlab chirog'ini qanday tez sanaymiz?" },
    opt0: { ru: 'По одному', uz: 'Bittalab' },
    opt1: { ru: 'Собирать по сто', uz: "Yuzlab yig'ib" },
    opt2: { ru: 'Не знаю', uz: 'Bilmayman' },
    audio: {
      intro: {
        ru: [
          'Сегодня тема урока — сотни, десятки и единицы. Научимся видеть, сколько в числе сотен, десятков и единиц.',
          'В прошлый раз мы довезли Бита домой. Наш корабль сел на планету Бита, она называется Лумо. Теперь мы у Бита в гостях.',
          'Бит показывает свой город. Огней здесь очень много, сотни. Считать их по одному долго.',
          'Вот наша миссия. Научимся считать огни сотнями, и тогда Бит покажет нам весь свой город. Вперёд!'
        ],
        uz: [
          "Bugungi dars mavzusi — yuzliklar, o'nliklar va birliklar. Sonda nechta yuzlik, o'nlik va birlik borligini ko'rishni o'rganamiz.",
          "O'tgan safar biz Bitni uyiga yetkazdik. Kemamiz Bitning sayyorasiga qo'ndi, uning nomi Lumo. Endi biz Bitning mehmonimiz.",
          "Bit o'z shahrini ko'rsatmoqda. Bu yerda chiroqlar juda ko'p, yuzlab. Ularni bittalab sanash uzoq.",
          "Mana bizning missiyamiz. Chiroqlarni yuzlab sanashni o'rganamiz, shunda Bit bizga butun shahrini ko'rsatadi. Olg'a!"
        ]
      },
      on_correct: { ru: 'Верная мысль. Соберём по сто, и станет видно.', uz: "To'g'ri fikr. Yuzlab yig'amiz, va ko'rinadi." },
      on_wrong: { ru: 'Так можно, но это долго. В городе есть способ быстрее.', uz: "Bunday bo'ladi, lekin uzoq. Shaharda tezroq yo'l bor." },
      on_unknown: { ru: 'Ничего. Сейчас увидим способ города.', uz: "Hechqisi yo'q. Hozir shaharning yo'lini ko'ramiz." }
    }
  },

  // s1 — RECALL (72) + UNITIZING (10 o'nlik -> 1 yuzlik) birlashgan, ketma-ket ochiladi.
  s1: {
    eyebrow: { ru: 'Вспомним и откроем', uz: 'Eslaymiz va ochamiz' },
    lead: { ru: 'От десятков — к сотне.', uz: "O'nlikdan yuzlikka." },
    tens_label: { ru: 'десятки', uz: "o'nliklar" },
    ones_label: { ru: 'единицы', uz: 'birliklar' },
    recall_eq: { ru: '72 = 7 десятков и 2 единицы', uz: "72 = 7 o'nlik va 2 birlik" },
    unit_eq: { ru: '10 десятков = 1 сотня', uz: "10 o'nlik = 1 yuzlik" },
    audio: {
      ru: [
        'Начнём с того, что вам уже знакомо с первого класса. В двузначном числе слева десятки, справа единицы. В числе семьдесят два семь десятков и две единицы. Молодцы, это вы помните.',
        'Считать десятками быстро. Но в городе Бита десятков очень много. Давайте соберём их дальше.',
        'Собираем десять десятков вместе. Каждый десяток это одна лента.',
        'Смотрите, что получилось! Десять десятков стали одной сотней. Одну такую панель мы называем сотня. Сотня это сто вместе.'
      ],
      uz: [
        "Avval sizga 1-sinfdan ma'lum narsadan boshlaymiz. Ikki xonali sonda chapda o'nlik, o'ngda birlik. Yetmish ikkida yetti o'nlik va ikki birlik bor. Barakalla, buni siz bilasiz.",
        "O'nlab sanash tez. Lekin Bit shahrida o'nliklar juda ko'p. Keling, ularni yana yig'amiz.",
        "O'nta o'nlikni birga to'playmiz. Har o'nlik bitta lenta.",
        "Qarang, nima bo'ldi! O'nta o'nlik bitta yuzlik bo'ldi. Bitta panelni yuzlik deymiz. Yuzlik bu yuzta birga."
      ]
    }
  },

  // s2 — UNITIZING: 10 o'nlik -> 1 yuzlik
  s2: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: { ru: 'Собери десятки в сотню.', uz: "O'nliklarni yuzlikka yig'ing." },
    done_text: { ru: 'Одна панель — это одна сотня, сто огней. Теперь считать удобно.', uz: "Bitta panel — bu bitta yuzlik, yuz chiroq. Endi sanash qulay." },
    audio: {
      ru: [
        'Смотри. В городе Бита огни собраны в ленты, в каждой ленте десять огней. Одна лента это десяток.',
        'Считать десятками уже быстрее. Но лент так много, что удобнее собрать их дальше. Складывай ленты по десять в одну панель.',
        'Когда лент станет ровно десять, панель загорится целиком. Десять десятков стали одной сотней. Одну такую панель мы называем сотня. Запомни это слово. Сотня это сто вместе.'
      ],
      uz: [
        "Qarang. Bitning shahrida chiroqlar lentalarga yig'ilgan, har lentada o'nta chiroq. Bitta lenta bu o'nlik.",
        "O'nlab sanash tezroq. Lekin lentalar shunchalik ko'pki, ularni yana yig'ish qulayroq. Lentalarni o'ntadan bitta panelga to'plang.",
        "Lentalar roppa-rosa o'nta bo'lganda panel to'liq yonadi. O'nta o'nlik bitta yuzlik bo'ldi. Bitta shunday panelni yuzlik deymiz. Shu so'zni yodda tuting. Yuzlik bu yuzta birga."
      ]
    }
  },

  // s3 — BUILD 245 (yuzlik + o'nlik + birlik)
  s3: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: { ru: 'Собери 245.', uz: "245 ni yig'ing." },
    src_hundreds: { ru: 'панель +', uz: 'panel +' },
    src_tens: { ru: 'лента +', uz: 'lenta +' },
    src_ones: { ru: 'огонёк +', uz: 'chiroq +' },
    hundreds_label: { ru: 'сотни', uz: 'yuzliklar' },
    tens_label: { ru: 'десятки', uz: "o'nliklar" },
    ones_label: { ru: 'единицы', uz: 'birliklar' },
    done_text: { ru: 'Две сотни, четыре десятка и пять единиц — двести сорок пять.', uz: "Ikki yuzlik, to'rt o'nlik va besh birlik — ikki yuz qirq besh." },
    audio: {
      ru: [
        'Теперь соберём число сами. Возьми две панели. В каждой по сто, значит вместе это две сотни, двести.',
        'Добавь четыре ленты. В каждой по десять, это четыре десятка, сорок. И добавь пять отдельных огоньков, это пять единиц.',
        'Посмотри на табло и сосчитай, сколько всего получилось.'
      ],
      uz: [
        "Endi sonni o'zimiz yig'amiz. Ikkita panel oling. Har birida yuzdan, demak birga bu ikki yuzlik, ikki yuz.",
        "To'rtta lenta qo'shing. Har birida o'ndan, bu to'rt o'nlik, qirq. Va beshta alohida chiroq qo'shing, bu besh birlik.",
        "Displeyga qarang va jami nechta bo'lganini sanang."
      ]
    }
  },

  // s4 — RAZRYAD KARTASI: 345 = 300 + 40 + 5
  s4: {
    eyebrow: { ru: 'Два способа', uz: 'Ikki usul' },
    lead: { ru: 'Разберём 345 двумя способами.', uz: "345 ni ikki usulda ochamiz." },
    hundreds_label: { ru: 'сотни', uz: 'yuzliklar' },
    tens_label: { ru: 'десятки', uz: "o'nliklar" },
    ones_label: { ru: 'единицы', uz: 'birliklar' },
    m1_label: { ru: 'Способ 1 — разрядная таблица', uz: "1-usul — razryad jadvali" },
    m1_text: { ru: 'Ставим каждую цифру на своё место.', uz: "Har raqamni o'z xonasiga qo'yamiz." },
    m2_label: { ru: 'Способ 2 — разрядные слагаемые', uz: "2-usul — yoyilma yig'indi" },
    m2_text: { ru: 'Пишем значение каждого разряда.', uz: "Har xonaning qiymatini yozamiz." },
    m3_label: { ru: 'Бонус — чтение числа', uz: "Bonus — o'qilishi" },
    m3_text: { ru: 'Число можно прочитать словами.', uz: "Sonni so'z bilan ham o'qiymiz." },
    m3_parts: [
      { num: '300', ru: 'триста', uz: 'uch yuz' },
      { num: '40', ru: 'сорок', uz: 'qirq' },
      { num: '5', ru: 'пять', uz: 'besh' }
    ],
    audio: {
      ru: [
        'У числа есть несколько способов раскрыть его. Давайте разберём триста сорок пять двумя основными способами.',
        'Первый способ — разрядная таблица. Ставим каждую цифру на своё место. Сотни три, десятки четыре, единицы пять.',
        'Второй способ — разрядные слагаемые. Пишем значение каждого разряда. Триста, сорок и пять.',
        'Отлично! Теперь вы знаете два способа. А в качестве бонуса открою вам ещё один секрет — это число можно прочитать словами. Триста сорок пять.',
        'Показали по-разному, а число одно — триста сорок пять. Молодцы!'
      ],
      uz: [
        "Bir sonni ochishning bir necha yo'li bor. Keling, uch yuz qirq beshni ikki asosiy usulda ochamiz.",
        "Birinchi usul — razryad jadvali. Har raqamni o'z o'rniga qo'yamiz. Yuzlik uch, o'nlik to'rt, birlik besh.",
        "Ikkinchi usul — yoyilma yig'indi. Har xonaning qiymatini yozamiz. Uch yuz, qirq va besh.",
        "Zo'r! Endi siz ikki usulni o'rganib oldingiz. Bonus tariqasida esa yana bir sirni aytaman — bu sonni so'z bilan ham o'qish mumkin. Uch yuz qirq besh.",
        "Ko'rsatish har xil, lekin son bitta — uch yuz qirq besh. Barakalla!"
      ]
    }
  },

  // s5 — O'RIN HAL QILADI: 345 / 435 / 543
  s5: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: { ru: 'Одни и те же цифры — а числа разные.', uz: 'Bir xil raqamlar — lekin sonlar har xil.' },
    hundreds_label: { ru: 'сотни', uz: 'yuzliklar' },
    tens_label: { ru: 'десятки', uz: "o'nliklar" },
    ones_label: { ru: 'единицы', uz: 'birliklar' },
    done_text: { ru: 'Место цифры решает. Слева сотни, справа единицы.', uz: "Raqamning o'rni hal qiladi. Chapda yuzlik, o'ngda birlik." },
    audio: {
      ru: [
        'Возьмём три цифры — три, четыре и пять. Из них можно собрать разные числа. Сейчас триста сорок пять.',
        'А теперь самое интересное! Меняем карточки местами. Смотрите — четыреста тридцать пять.',
        'Меняем ещё раз — пятьсот сорок три. Цифры те же самые, но их места поменялись.',
        'Посмотрите на пятёрку. В единицах она значит пять. А в сотнях та же пятёрка значит пятьсот. Место цифры решает!'
      ],
      uz: [
        "Uchta raqam olamiz — uch, to'rt va besh. Ulardan har xil son yig'ish mumkin. Hozir uch yuz qirq besh.",
        "Endi eng qizig'i! Kartalarni almashtiramiz. Qarang — to'rt yuz o'ttiz besh.",
        "Yana almashtiramiz — besh yuz qirq uch. Raqamlar aynan o'sha, lekin o'rni almashdi.",
        "Besh raqamiga qarang. Birlikda u besh degani. Yuzlikda esa o'sha beshlik besh yuz degani. Raqamning o'rni hal qiladi!"
      ]
    }
  },

  // s6 — SON O'QI: 470 (0-1000)
  s6: {
    eyebrow: { ru: 'Число на прямой', uz: "Son o'qida" },
    lead: { ru: 'Где стоит 470?', uz: "470 qayerda turadi?" },
    q: { ru: 'Линия от 300 до 800. Где стоит 470? Нажми.', uz: "Chiziq 300 dan 800 gacha. 470 qayerda? Bosing." },
    q_audio: { ru: 'Эта линия идёт от трёхсот до восьмисот. Как думаешь, где на ней стоит четыреста семьдесят? Нажми туда, где считаешь.', uz: "Bu chiziq uch yuzdan sakkiz yuzgacha. Sizningcha, unda to'rt yuz yetmish qayerda turadi? O'zingiz o'ylagan joyni bosing." },
    done_text: { ru: 'Четыреста семьдесят стоит между четырьмястами и пятьюстами.', uz: "To'rt yuz yetmish to'rt yuz bilan besh yuz orasida turadi." },
    info_badge: { ru: 'Полезно', uz: 'Foydali' },
    info: { ru: 'На числовой прямой числа стоят по порядку: чем правее, тем больше. Большие метки — это сотни. Между ними стоят десятки.', uz: "Son o'qida sonlar tartib bilan turadi: qancha o'ngda bo'lsa, shuncha katta. Katta belgilar — yuzliklar. Ular orasida o'nliklar turadi." },
    audio: {
      ru: [
        'Покажем четыреста семьдесят. Линия идёт от трёхсот до восьмисот.',
        'Один большой шаг по сто — доходим до четырёхсот.',
        'Потом семь маленьких шагов по десять — доходим до четырёхсот семидесяти. Это между четырьмястами и пятьюстами.'
      ],
      uz: [
        "To'rt yuz yetmishni ko'rsatamiz. Chiziq uch yuzdan sakkiz yuzgacha.",
        "Bir katta qadam yuzga — to'rt yuzga yetamiz.",
        "Keyin yetti kichik qadam o'ndan — to'rt yuz yetmishga yetamiz. Bu to'rt yuz bilan besh yuz orasida."
      ]
    }
  },

  // sMING — KASHFIYOT: 10 yuzlik = 1000 (keyingi darsga ko'prik)
  sming: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: { ru: 'А если собрать десять сотен?', uz: "Agar o'nta yuzlikni yig'sak-chi?" },
    ming_eq: { ru: '10 сотен = 1000', uz: '10 yuzlik = 1000' },
    ming_word: { ru: 'ТЫСЯЧА', uz: 'MING' },
    done_text: { ru: 'Тысяча — это десять сотен вместе. Самое большое число нашего урока!', uz: "Ming — bu o'nta yuzlik birga. Darsimizning eng katta soni!" },
    audio: {
      ru: [
        'Помните? Десять десятков дали нам сотню. А теперь интересный вопрос. Что будет, если собрать десять сотен? Подумай немного.',
        'Давайте посчитаем вместе. Один, два, три и так до десяти — десять панелей, в каждой по сто огней.',
        'Смотрите, что получилось! Десять сотен — это тысяча. Целая тысяча огней!',
        'Тысяча — это новое большое число. В следующий раз мы научимся читать и записывать такие числа. Вот это будет приключение!'
      ],
      uz: [
        "Esingizdami? O'nta o'nlik bizga yuzlikni berdi. Endi qiziq savol. Agar o'nta yuzlikni yig'sak, nima bo'ladi? Bir oz o'ylab ko'ring.",
        "Keling, birga sanab chiqamiz. Bir, ikki, uch va shunday o'ngacha — o'nta panel, har birida yuzdan chiroq.",
        "Qarang, nima chiqdi! O'nta yuzlik — bu ming. Butun boshli ming chiroq!",
        "Ming — bu yangi katta son. Keyingi safar shunday sonlarni o'qish va yozishni o'rganamiz. Bu haqiqiy sarguzasht bo'ladi!"
      ]
    }
  },

  // s7 — QOIDA
  s7: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    rule: { ru: 'В трёхзначном числе три разряда: слева сотни, потом десятки, справа единицы.', uz: "Uch xonali sonda uch xona: chapda yuzlik, keyin o'nlik, o'ngda birlik." },
    hundreds_label: { ru: 'сотни', uz: 'yuzliklar' },
    tens_label: { ru: 'десятки', uz: "o'nliklar" },
    ones_label: { ru: 'единицы', uz: 'birliklar' },
    check_q: { ru: 'Нажми цифру сотен.', uz: "Yuzliklar raqamini bosing." },
    check_ok: { ru: 'Верно! Слева — сотни.', uz: "To'g'ri! Chapda — yuzliklar." },
    check_no: { ru: 'Сотни стоят слева. Нажми левую цифру.', uz: "Yuzliklar chapda turadi. Chap raqamni bosing." },
    audio: {
      ru: [
        'Отлично, теперь вы всё поняли! Пришло время запомнить это как правило — оно нам будет нужно всегда. Слушайте внимательно.',
        'В трёхзначном числе три цифры. Как понять, где сотни, где десятки, а где единицы? Только по их месту.',
        'Левая цифра это всегда сотни. Она считает панели, целые сотни. Здесь слева три, значит три сотни.',
        'Средняя цифра это десятки, а правая это единицы. Здесь четыре десятка и пять единиц.',
        'И запомни ещё. Рядом это не сложение. Три, четыре и пять рядом дают триста сорок пять, а не двенадцать.',
        'А ещё есть ноль. Ноль держит пустое место. Триста пять это три сотни, ноль десятков и пять единиц. Ноль нельзя выбрасывать.',
        'А теперь сам. Нажми цифру, которая показывает сотни.'
      ],
      uz: [
        "Zo'r, endi hammasini tushundingiz! Endi buni qoida qilib eslab qolamiz — bu bizga doim kerak bo'ladi. Diqqat bilan tinglang.",
        "Uch xonali sonda uchta raqam bor. Qaysi biri yuzlik, qaysi biri o'nlik, qaysi biri birlik, buni faqat o'rniga qarab bilamiz.",
        "Chap raqam bu har doim yuzliklar. U panellarni, butun yuzliklarni sanaydi. Bu yerda chapda uch, demak uch yuzlik.",
        "O'rtadagi raqam bu o'nliklar, o'ngdagi raqam bu birliklar. Bu yerda to'rt o'nlik va besh birlik.",
        "Va yana yodda tuting. Yonma-yon bu qo'shish emas. Uch, to'rt va besh yonma-yon uch yuz qirq besh beradi, o'n ikki emas.",
        "Yana nol ham bor. Nol bo'sh o'rinni saqlaydi. Uch yuz besh bu uch yuzlik, nol o'nlik va besh birlik. Nolni tashlab bo'lmaydi.",
        "Endi o'zingiz. Yuzliklarni ko'rsatadigan raqamni bosing."
      ]
    }
  },

  // s8 — MASHQ build 362
  s8: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    q: { ru: 'Собери 362.', uz: "362 ni yig'ing." },
    src_hundreds: { ru: 'панель +', uz: 'panel +' },
    src_tens: { ru: 'лента +', uz: 'lenta +' },
    src_ones: { ru: 'огонёк +', uz: 'chiroq +' },
    hundreds_label: { ru: 'сотни', uz: 'yuzliklar' },
    tens_label: { ru: 'десятки', uz: "o'nliklar" },
    ones_label: { ru: 'единицы', uz: 'birliklar' },
    check_label: { ru: 'Проверить', uz: 'Tekshirish' },
    audio: {
      intro: { ru: 'Собирай число из панелей, лент и огоньков. Сначала сотни, потом десятки, потом единицы. После нажми проверить.', uz: "Sonni panel, lenta va chiroqlardan yig'ing. Avval yuzlik, keyin o'nlik, keyin birlik. So'ng tekshirishni bosing." },
      on_correct: { ru: 'Отлично. Собрано верно.', uz: "Zo'r. To'g'ri yig'dingiz." },
      on_wrong: { ru: 'Проверь. Сначала набери сотни, потом десятки, потом единицы.', uz: "Tekshiring. Avval yuzlik, keyin o'nlik, keyin birlikni yig'ing." }
    }
  },

  // s9 — TASNIFLASH 528
  s9: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    q: { ru: 'Разложи цифры числа 528 по разрядам.', uz: "528 sonining raqamlarini xonalarga ajrating." },
    hold_hundreds: { ru: 'СОТНИ', uz: 'YUZLIKLAR' },
    hold_tens: { ru: 'ДЕСЯТКИ', uz: "O'NLIKLAR" },
    hold_ones: { ru: 'ЕДИНИЦЫ', uz: 'BIRLIKLAR' },
    audio: {
      intro: { ru: 'Сортировщик города. Каждую цифру поставь в свой разряд. Слева сотни, в середине десятки, справа единицы. Но будь внимателен, среди карточек есть лишние цифры. Бери только нужные.', uz: "Shahar saralagichi. Har raqamni o'z xonasiga qo'ying. Chapda yuzlik, o'rtada o'nlik, o'ngda birlik. Lekin ehtiyot bo'ling, kartochkalar orasida ortiqcha raqamlar ham bor. Faqat keraklilarini oling." },
      on_correct: { ru: 'Верно. Каждая цифра в своём разряде.', uz: "To'g'ri. Har raqam o'z xonasida." },
      on_wrong: { ru: 'Читай слева направо: первая цифра сотни, последняя единицы.', uz: "Chapdan o'ngga o'qing: birinchi raqam yuzlik, oxirgisi birlik." }
    }
  },

  // s10 — MC nol-o'rin 305
  s10: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    items: [
      {
        q: { ru: 'Какое число — 3 сотни, 0 десятков и 5 единиц?', uz: "Qaysi son — 3 yuzlik, 0 o'nlik, 5 birlik?" },
        hto: [3, 0, 5], ci: 1,
        opts: [{ ru: '35', uz: '35' }, { ru: '305', uz: '305' }, { ru: '350', uz: '350' }, { ru: '503', uz: '503' }],
        hints: {
          0: { ru: 'Разряд десятков пустой, ноль держит его место: 305, а не 35.', uz: "O'nlik xonasi bo'sh, nol o'rinni saqlaydi: 305, 35 emas." },
          2: { ru: 'Ноль в середине, в десятках, а не в конце: 305.', uz: "Nol o'rtada, o'nlikda, oxirida emas: 305." },
          3: { ru: 'Сотен три, значит слева тройка: 305.', uz: "Yuzlik uchta, demak chapda uch: 305." }
        }
      },
      {
        q: { ru: 'Какое число — 7 сотен, 0 десятков и 2 единицы?', uz: "Qaysi son — 7 yuzlik, 0 o'nlik, 2 birlik?" },
        hto: [7, 0, 2], ci: 0,
        opts: [{ ru: '702', uz: '702' }, { ru: '720', uz: '720' }, { ru: '72', uz: '72' }, { ru: '207', uz: '207' }],
        hints: {
          1: { ru: 'Ноль в десятках, не в единицах: 702.', uz: "Nol o'nlikda, birlikda emas: 702." },
          2: { ru: 'Это трёхзначное число, сотни есть: 702.', uz: "Bu uch xonali son, yuzlik bor: 702." },
          3: { ru: 'Сотен семь, значит слева семёрка: 702.', uz: "Yuzlik yettita, demak chapda yetti: 702." }
        }
      },
      {
        q: { ru: 'Какое число — 5 сотен, 4 десятка и 0 единиц?', uz: "Qaysi son — 5 yuzlik, 4 o'nlik, 0 birlik?" },
        hto: [5, 4, 0], ci: 1,
        opts: [{ ru: '504', uz: '504' }, { ru: '540', uz: '540' }, { ru: '54', uz: '54' }, { ru: '450', uz: '450' }],
        hints: {
          0: { ru: 'Ноль в конце, в единицах, а не в середине: 540.', uz: "Nol oxirida, birlikda, o'rtada emas: 540." },
          2: { ru: 'Сотни есть, пять сотен: 540.', uz: "Yuzlik bor, besh yuzlik: 540." },
          3: { ru: 'Сотен пять, значит слева пятёрка: 540.', uz: "Yuzlik beshta, demak chapda besh: 540." }
        }
      }
    ],
    audio: {
      intro: { ru: 'В городе бывает пустой разряд. Ноль держит его место. Три задания подряд.', uz: "Shaharda ba'zan bo'sh xona bo'ladi. Nol uning o'rnini saqlaydi. Uchta topshiriq ketma-ket." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Ноль держит пустое место. Попробуй ещё.', uz: "Nol bo'sh o'rinni saqlaydi. Yana urinib ko'ring." }
    }
  },

  // s11 — MC taqqoslash 345/354
  s11: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    items: [
      { pair: [345, 354], sign: '<', hint: { ru: 'Сотни равны, десятки: 5 больше 4. Значит 345 меньше 354, знак меньше.', uz: "Yuzliklar teng, o'nlik: 5, 4 dan katta. Demak 345 kichik 354 dan, kichik belgisi." } },
      { pair: [482, 428], sign: '>', hint: { ru: 'Сотни равны, десятки: 8 больше 2. Значит 482 больше 428, знак больше.', uz: "Yuzliklar teng, o'nlik: 8, 2 dan katta. Demak 482 katta 428 dan, katta belgisi." } },
      { pair: [600, 599], sign: '>', hint: { ru: 'Сотни: 6 больше 5. Значит 600 больше 599, знак больше.', uz: "Yuzlik: 6, 5 dan katta. Demak 600 katta 599 dan, katta belgisi." } }
    ],
    audio: {
      intro: { ru: 'Ставь знак между числами. Открытый рот знака смотрит на большее число. Три задания.', uz: "Sonlar orasiga belgi qo'ying. Belgining ochiq og'zi katta songa qaraydi. Uchta topshiriq." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Сравни разряды слева направо. Знак открывается к большему.', uz: "Xonalarni chapdan o'ngga solishtiring. Belgi kattaga ochiladi." }
    }
  },

  // s12 — MASALA kirish (shahar hisobi), Anvar
  s12: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    lead: { ru: 'Отчёт района: 3 панели, 4 ленты и 6 огоньков.', uz: 'Tuman hisobi: 3 panel, 4 lenta va 6 chiroq.' },
    manifest_label: { ru: 'отчёт', uz: 'hisob' },
    audio: {
      ru: 'Анвар принёс отчёт по району. Три панели по сто это три сотни. Четыре ленты по десять это четыре десятка. И шесть отдельных огоньков это шесть единиц.',
      uz: "Anvar tuman hisobini keltirdi. Uchta panel yuzdan bu uch yuzlik. To'rtta lenta o'ndan bu to'rt o'nlik. Va oltita alohida chiroq bu olti birlik."
    }
  },

  // s13 — MASALA savol: jami 346
  s13: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    q: { ru: 'Сколько всего огней?', uz: 'Jami nechta chiroq?' },
    opt0: { ru: '346', uz: '346' },
    opt1: { ru: '436', uz: '436' },
    opt2: { ru: '13', uz: '13' },
    opt3: { ru: '340', uz: '340' },
    wrong_1: { ru: 'Панели это сотни, их три. Поставь сотни слева: получается 346.', uz: "Panellar — yuzlik, ular uchta. Yuzlikni chapga qo'ying: 346 chiqadi." },
    wrong_2: { ru: 'Тринадцать получится, если просто сложить 3, 4 и 6. А панели по сто, ленты по десять.', uz: "O'n uch — 3, 4 va 6 ni shunchaki qo'shsak chiqadi. Panellar yuzdan, lentalar o'ndan." },
    wrong_3: { ru: 'Не забудь шесть отдельных огоньков. С ними получается 346.', uz: "Oltita alohida chiroqni unutmang. Ular bilan 346 chiqadi." },
    audio: {
      intro: { ru: 'Посчитаем, сколько всего огней в районе. Панели сотни, ленты десятки, огоньки единицы.', uz: "Tumanda jami nechta chiroq borligini sanaymiz. Panellar yuzlik, lentalar o'nlik, chiroqlar birlik." },
      on_correct: { ru: 'Верно. Три сотни, четыре десятка и шесть единиц, триста сорок шесть.', uz: "To'g'ri. Uch yuzlik, to'rt o'nlik va olti birlik, uch yuz qirq olti." },
      on_wrong: { ru: 'Посмотри разбор. Панели сотни, их три, слева.', uz: "Tushuntirishga qarang. Panellar yuzlik, ular uchta, chapda." }
    }
  },

  // s14 — FINAL panel (4 savol) + FactCard
  s14: {
    eyebrow: { ru: 'Финал', uz: 'Final' },
    intro_line: { ru: 'Городской компьютер проверит тебя. Пять заданий.', uz: "Shahar kompyuteri sizni tekshiradi. Beshta topshiriq." },
    // Aralash panel: kind 'num' — raqam-plita bilan JAVOB TERILADI (produksiya); kind 'mc' — konsept/tanish.
    // Masalalar ziyoly.uz «Xona birliklari» turlariga moslangan; 5-savol — son-jumboq (mantiq).
    items: [
      {
        kind: 'num', ans: 645,
        q: { ru: 'Сложи по разрядам: 600 + 40 + 5. Набери ответ.', uz: "Razryadlab qo'sh: 600 + 40 + 5. Javobni ter." },
        hint: { ru: 'По местам: шесть сотен, четыре десятка, пять единиц.', uz: "O'z o'rniga: olti yuzlik, to'rt o'nlik, besh birlik." }
      },
      {
        kind: 'num', ans: 230,
        q: { ru: 'Запиши цифрами число двести тридцать.', uz: "Ikki yuz o'ttiz sonini raqamlab ter." },
        hint: { ru: 'Две сотни, три десятка, единиц нет — ноль в конце.', uz: "Ikki yuzlik, uch o'nlik, birlik yo'q — oxirida nol." }
      },
      {
        kind: 'mc',
        q: { ru: 'Сколько сотен в числе 682?', uz: "682 sonida nechta yuzlik bor?" },
        opt0: { ru: '6 сотен', uz: '6 yuzlik' },
        opt1: { ru: '8 сотен', uz: '8 yuzlik' },
        opt2: { ru: '2 сотни', uz: '2 yuzlik' },
        wrong_1: { ru: 'Восемь стоит в десятках, а не в сотнях. Сотни слева: шесть.', uz: "Sakkiz o'nlikda turadi, yuzlikda emas. Yuzlik chapda: olti." },
        wrong_2: { ru: 'Два стоит в единицах. Сотни это левая цифра: шесть.', uz: "Ikki birlikda turadi. Yuzlik bu chap raqam: olti." }
      },
      {
        kind: 'mc',
        q: { ru: 'Что больше: 519 или 591?', uz: "Qaysi biri katta: 519 yoki 591?" },
        opt0: { ru: '591', uz: '591' },
        opt1: { ru: '519', uz: '519' },
        opt2: { ru: 'Они равны', uz: 'Ular teng' },
        wrong_1: { ru: 'Сотни равны, значит сравни десятки. Девять десятков больше одного: 591 больше.', uz: "Yuzliklar teng, demak o'nlikni solishtiring. To'qqiz o'nlik birdan katta: 591 katta." },
        wrong_2: { ru: 'Цифры одни и те же, но места разные, значит числа не равны. 591 больше.', uz: "Raqamlar bir xil, lekin o'rni har xil, demak sonlar teng emas. 591 katta." }
      },
      {
        kind: 'num', ans: 522,
        q: { ru: 'Загадка. Я трёхзначное число. Сотен 5, единиц 2, а десятков на 3 меньше, чем сотен. Кто я?', uz: "Jumboq. Men uch xonali sonman. Yuzligim 5, birligim 2, o'nligim yuzligimdan 3 kam. Men kimman?" },
        hint: { ru: 'Начни с сотен: пять. Десятков на три меньше пяти. Единиц два.', uz: "Yuzlikdan boshla: besh. O'nlik beshdan uch kam. Birlik ikki." }
      }
    ],
    fact_badge: { ru: 'Знаешь?', uz: 'Bilasizmi?' },
    fact_text: { ru: 'Планета Лумо вращается вокруг красного карлика. Такие звёзды в космосе встречаются чаще всего и светят очень долго.', uz: "Lumo sayyorasi qizil mitti yulduz atrofida aylanadi. Bunday yulduzlar koinotda eng ko'p uchraydi va juda uzoq nur sochadi." },
    fact_audio: { ru: 'Планета Бита вращается вокруг красного карлика. Такие звёзды в космосе встречаются чаще всего и светят очень долго.', uz: "Bitning sayyorasi qizil mitti yulduz atrofida aylanadi. Bunday yulduzlar koinotda eng ko'p uchraydi va juda uzoq nur sochadi." },
    audio: {
      intro: { ru: 'Финальная проверка. Городской компьютер показывает числа, отвечай на каждое.', uz: "Yakuniy tekshiruv. Shahar kompyuteri sonlar ko'rsatadi, har biriga javob bering." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Посмотри разбор справа.', uz: "O'ngdagi tushuntirishga qarang." }
    }
  },

  // s15 — YAKUN
  s15: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    praise: { ru: 'Молодец!', uz: 'Barakalla!' },
    mission_done: { ru: 'Миссия выполнена — город открыт!', uz: 'Missiya bajarildi — shahar ochildi!' },
    cando: { ru: 'Мы научились считать огни сотнями. Теперь ты видишь в числе сотни, десятки и единицы.', uz: "Chiroqlarni yuzlab sanashni o'rgandik. Endi siz sonda yuzlik, o'nlik va birlikni ko'rasiz." },
    rule_recap: { ru: 'Слева сотни, потом десятки, справа единицы. Ноль держит место.', uz: "Chapda yuzlik, keyin o'nlik, o'ngda birlik. Nol o'rinni saqlaydi." },
    conn_label_refs: { ru: 'Опирается на', uz: 'Tayanadi' },
    conn_refs: { ru: 'второй класс: десятки и единицы, десять единиц — один десяток', uz: "ikkinchi sinf: o'nlik va birlik, o'nta birlik — bitta o'nlik" },
    conn_label_next: { ru: 'Дальше', uz: 'Keyingi' },
    conn_next: { ru: 'Урок 2: чтение и запись чисел до тысячи', uz: "2-dars: minggacha sonlarni o'qish va yozish" },
    audio: {
      ru: 'Город Бита открыт. Мы научились собирать сотни из десятков и видеть в числе сотни, десятки и единицы. Запомни правило. Десять десятков это одна сотня. Слева сотни, потом десятки, справа единицы. А ноль держит пустое место. В следующий раз научимся читать и записывать большие числа города.',
      uz: "Bitning shahri ochildi. Biz o'nliklardan yuzlik yig'ishni va sonda yuzlik, o'nlik, birlikni ko'rishni o'rgandik. Qoidani yodda tuting. O'nta o'nlik bu bitta yuzlik. Chapda yuzlik, keyin o'nlik, o'ngda birlik. Nol esa bo'sh o'rinni saqlaydi. Keyingi safar shaharning katta sonlarini o'qish va yozishni o'rganamiz."
    }
  }
};

// slaydlararo ko'priklar (audio-intro boshiga; ekranda ko'rinmaydi). TTS-toza.
const BRIDGES = {
  s1:  { ru: 'Начнём с того, что вам знакомо с первого класса.', uz: "Sizga birinchi sinfdan tanish narsadan boshlaymiz." },
  s2:  { ru: 'Огней много. Посмотрим, как собрать сотню.', uz: "Chiroq ko'p. Yuzlikni qanday yig'ishni ko'ramiz." },
  s3:  { ru: 'Сотню поняли. Теперь соберём из них число.', uz: "Yuzlikni bildik. Endi undan son yig'amiz." },
  s4:  { ru: 'Собрали. Теперь заглянем внутрь числа.', uz: "Yig'dik. Endi sonning ichiga qaraymiz." },
  s5:  { ru: 'Внимание. Место цифры решает.', uz: "Diqqat. Raqamning o'rni muhim." },
  s6:  { ru: 'Покажем это число на прямой.', uz: "Shu sonni o'qda ko'rsatamiz." },
  sming: { ru: 'А теперь маленькое чудо.', uz: "Endi esa kichik mo'jiza." },
  s7:  { ru: 'Запишем это правилом.', uz: 'Buni qoida qilib olamiz.' },
  s8:  { ru: 'Правило знаем. Теперь собирай число сам.', uz: "Qoidani bilamiz. Endi sonni o'zingiz yig'ing." },
  s9:  { ru: 'Разложи цифры по разрядам.', uz: 'Raqamlarni xonalarga ajrating.' },
  s10: { ru: 'Один разряд будет пустым.', uz: "Bitta xona bo'sh bo'ladi." },
  s11: { ru: 'Сравним два района города.', uz: 'Shaharning ikki tumanini solishtiramiz.' },
  s12: { ru: 'Последний отчёт. Сколько по нему?', uz: "Oxirgi hisob. Unda nechta?" },
  s13: { ru: 'Считаем всё вместе.', uz: 'Hammasini birga sanaymiz.' },
  s14: { ru: 'Городской компьютер сделает финальную проверку.', uz: 'Shahar kompyuteri yakuniy tekshiradi.' },
  s15: { ru: 'Город открыт. Идём дальше!', uz: 'Shahar ochildi. Davom etamiz!' }
};

// s15 payoff (xulosadan oldin aytiladi)
const S15_PAYOFF = {
  ru: 'Миссия выполнена! Мы научились считать огни сотнями, и Бит показал нам весь свой город. Спасибо за помощь!',
  uz: "Missiya bajarildi! Biz chiroqlarni yuzlab sanashni o'rgandik, va Bit bizga butun shaharni ko'rsatdi. Yordamingiz uchun rahmat!"
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
                      <span key={i} className="lm-dock" style={{ animationDelay: `${i * 0.08}s` }}>
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

// --- ENERGIYA KONSOLI (sanoq): har razryad uchun BITTA belgi + ×son badge + qiymat + stepper.
// Blok yig'ish o'rniga (metodist tanlovi «energiya konsoli»). Base-10 mantiqi saqlanadi: yuzlik ×N = N·100.
const CONS_META = [
  { k: 'h', pv: 100, Ico: Panel,  cls: 'lm-cons-ico-h' },
  { k: 't', pv: 10,  Ico: Lenta,  cls: 'lm-cons-ico-t' },
  { k: 'o', pv: 1,   Ico: Chiroq, cls: 'lm-cons-ico-o' },
];
// neutral — test-figurasi uchun: hech bir razryad AKSENTLANMAYDI (bo'sh xona ham,
// to'la xona ham teng ko'rinadi). showVal — razryad qiymati (×N·pv) ko'rsatilsinmi.
const RazryadConsole = ({ vals, labels, onStep = null, disabled = false, neutral = false, showVal = true }) => (
  <div className={`lm-console ${neutral ? 'lm-cons-neutral' : ''}`}>
    {CONS_META.map(({ k, pv, Ico, cls }) => {
      const n = vals[k];
      return (
        <div key={k} className={`lm-cons ${!neutral && n > 0 ? 'lm-cons-lit' : ''}`}>
          <div className="lm-cons-head mono">{labels[k]}</div>
          <div className="lm-cons-screen">
            <Ico className={`lm-cons-ico ${cls}`}/>
            <span key={n} className={`lm-cons-x mono ${!neutral && n === 0 ? 'lm-cons-x-dim' : ''}`}>×{n}</span>
          </div>
          {showVal && <div className="lm-cons-val mono">{n * pv}</div>}
          {onStep && (
            <div className="lm-cons-steps">
              <button className="lm-cons-btn" disabled={disabled || n <= 0} onClick={() => onStep(k, -1)} aria-label="kamaytir">−</button>
              <button className="lm-cons-btn lm-cons-btn-up" disabled={disabled || n >= 9} onClick={() => onStep(k, 1)} aria-label="ko'paytir">+</button>
            </div>
          )}
        </div>
      );
    })}
  </div>
);






























// --- HOOK SAHNASI: Lumo shahri + butun ekipaj sayyorada qo'ngan. Bit mezbon MARKAZDA, do'stlar yon-atrofda.
const HookScene = ({ gathered = false }) => {
  const kid = ({ key, El, hook }, i) => (
    <span key={key} className="lm-crew lm-crew-kid g1-pop-in" style={{ animationDelay: `${0.25 + i * 0.12}s` }}>
      <El {...(gathered ? { mood: 'happy', pose: 'happy' } : hook)}/>
    </span>
  );
  return (
    <div className="lm-scene">
      <LumoCityBg fill/>
      <div className="lm-scene-cast">
        {LUMO_CAST.slice(0, 2).map(kid)}
        <span className={`lm-crew lm-crew-host ${gathered ? 'd2-bit-cheer' : 'lm-bob'}`}><span className="g1-cast-fig"><BitSVG state={gathered ? 'happy' : 'present'}/></span></span>
        {LUMO_CAST.slice(2).map((c, i) => kid(c, i + 2))}
      </div>
    </div>
  );
};




// ============================================================
// EKRANLAR
// ============================================================

// s0 — HOOK: Lumoga qo'nish (picked to'liq reset qaytishda)
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
  const revealed = picked !== null;
  const fbKey = (i) => (i === 1 ? 'on_correct' : (i === 0 ? 'on_wrong' : 'on_unknown'));
  const pick = (i) => {
    if (picked !== null || !canAct) return;
    setPicked(i);
    if (!audio.muted) {
      const e = getAudioEngine();
      if (e) {
        e.pushOneOff(c.audio[fbKey(i)][lang]);
        if (i !== 1) e.pushOneOff(c.audio.on_correct[lang]);   // noto'g'ri/bilmayman -> to'g'ri javob emotsiya bilan ochiladi
      }
    }
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
          <HookScene gathered={revealed}/>
        </div>
        <p className="fade-up delay-1" style={{ textAlign: 'center', color: T.ink2, fontWeight: 600, fontSize: 'clamp(15px, 2vw, 18px)', margin: 0 }}>{t(c.q)}</p>
        <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {opts.map((o, i) => {
            const cls = revealed
              ? (i === 1 ? 'option option-correct' : (picked === i ? 'option option-picked-wrong' : 'option'))
              : 'option';
            return (
              <button key={i} className={cls} disabled={!canAct || revealed} onClick={() => pick(i)}
                style={{ position: 'relative', padding: 'clamp(10px, 1.5vw, 12px) clamp(12px, 2vw, 16px)', fontSize: 'clamp(13px, 1.7vw, 15px)', minHeight: 'clamp(48px, 7vw, 58px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                {revealed && i === 1 && <span className="mono" style={{ position: 'absolute', top: 4, right: 7, color: '#1F7A4D', fontWeight: 800 }}>✓</span>}
                {t(o)}
              </button>
            );
          })}
        </div>
        {revealed && (
          <FeedbackBlock show={true} isCorrect={ok} wrongClass="frame-tip">
            <Reaction state={ok ? 'correct' : 'wrong'} praise={t(c.audio[fbKey(picked)])}/>
            {!ok && (
              <p className="fade-up" style={{ margin: 'clamp(6px, 1.4vw, 10px) 0 0', textAlign: 'center', color: '#1F7A4D', fontWeight: 700, fontSize: 'clamp(13px, 1.8vw, 16px)' }}>
                {(lang === 'ru' ? 'Верный ответ' : "To'g'ri javob")}: <b>{t(c.opt1)}</b>. {t(c.audio.on_correct)}
              </p>
            )}
          </FeedbackBlock>
        )}
      </div>
    </Stage>
  );
};

// s1 — RECALL (ballsiz): 34 = 3 o'nlik 4 birlik
// Recall (72 = 7 o'nlik 2 birlik) -> Unitizing (10 o'nlik -> 1 yuzlik), audio bilan ketma-ket ochiladi.
const Screen1 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s1;
  const audio = useAudio([
    brgSeg('s1', lang),
    ...c.audio[lang].map((text, i) => ({ id: `s1_${i}`, text, trigger: 'after_previous', waits_for: null }))
  ]);
  const seg = audio.currentSegment;
  const [reached, setReached] = useState(0);
  useEffect(() => { if (seg && /^s1_\d+$/.test(seg)) setReached((r) => Math.max(r, +seg.slice(3))); }, [seg]);
  const done = reached >= c.audio[lang].length - 1;
  const canAdv = useAdvanceGate(done, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  const Lbl = ({ x }) => <span className="mono" style={{ fontWeight: 800, color: T.ink2, fontSize: 'clamp(11px, 1.5vw, 13px)' }}>{x}</span>;
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'clamp(10px, 2vw, 14px)', padding: 'clamp(12px, 2.4vw, 20px)', minHeight: 'clamp(180px, 38vw, 240px)' }}>
          {reached < 2 ? (
            // 1-BOSQICH — RECALL 72
            <>
              <div style={{ display: 'flex', gap: 'clamp(18px, 5vw, 40px)', alignItems: 'flex-end', justifyContent: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {Array.from({ length: 7 }).map((_, i) => <span key={i} className="lm-drop" style={{ animationDelay: `${i * 0.06}s`, display: 'inline-flex' }}><Lenta className="lm-mat-lenta"/></span>)}
                  </div>
                  <Lbl x={t(c.tens_label)}/>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {Array.from({ length: 2 }).map((_, i) => <span key={i} className="lm-drop" style={{ animationDelay: `${(7 + i) * 0.06}s`, display: 'inline-flex' }}><Chiroq/></span>)}
                  </div>
                  <Lbl x={t(c.ones_label)}/>
                </div>
              </div>
              <span className="mono lm-eq lm-reveal" style={{ fontSize: 'clamp(15px, 2.8vw, 22px)', fontWeight: 800 }}>{t(c.recall_eq)}</span>
            </>
          ) : reached < 3 ? (
            // 2-BOSQICH — 10 o'nlikni yig'ish
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, auto)', gap: 'clamp(4px, 1vw, 7px)', justifyItems: 'center' }}>
              {Array.from({ length: 10 }).map((_, i) => <span key={i} className="lm-drop" style={{ animationDelay: `${i * 0.09}s`, display: 'inline-flex' }}><Lenta className="lm-mat-lenta"/></span>)}
            </div>
          ) : (
            // 3-BOSQICH — 1 yuzlik panel
            <>
              <span className="lm-reveal lm-bob" style={{ display: 'inline-flex' }}><Panel className="lm-panel-big"/></span>
              <span className="mono lm-eq lm-reveal" style={{ fontSize: 'clamp(16px, 3vw, 24px)', fontWeight: 800, color: T.success }}>{t(c.unit_eq)}</span>
            </>
          )}
        </div>
      </div>
    </Stage>
  );
};

// s2 — UNITIZING: 10 lenta (o'nlik) -> 1 panel (yuzlik)
const S2_POS = [
  { x: 8, y: 12, r: -18 }, { x: 40, y: 8, r: 14 }, { x: 68, y: 10, r: -8 }, { x: 88, y: 18, r: 22 },
  { x: 5, y: 46, r: 18 }, { x: 90, y: 46, r: -22 },
  { x: 8, y: 80, r: 10 }, { x: 40, y: 86, r: 20 }, { x: 68, y: 84, r: -16 }, { x: 88, y: 76, r: 8 }
];
const Screen2 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s2;
  const sfx = useSfx();
  const audio = useAudio([
    brgSeg('s2', lang),
    { id: 's2_0', text: c.audio[lang][0], trigger: 'after_previous', waits_for: null },
    { id: 's2_1', text: c.audio[lang][1], trigger: 'after_previous', waits_for: null },
    { id: 's2_2', text: c.audio[lang][2], trigger: 'on_event:done', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [moved, setMoved] = useState(() => new Set());
  const [tied, setTied] = useState(false);
  const revealRef = useRevealScroll(tied, 700);
  const tap = (i) => {
    if (!canAct || tied || moved.has(i)) return;
    const n = new Set(moved); n.add(i);
    setMoved(n);
    if (n.size === 10) setTimeout(() => { setTied(true); sfx.playCorrect(); audio.triggerInternal('done'); }, 500);
  };
  const canAdv = useAdvanceGate(tied, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ padding: 'clamp(10px, 2vw, 16px)' }}>
          <div className="lm-field">
            <LumoCityBg fill/>
            {S2_POS.map((p, i) => !moved.has(i) && (
              <button key={i} className="lm-flenta" disabled={!canAct} onClick={() => tap(i)}
                style={{ left: `${p.x}%`, top: `${p.y}%`, ['--r']: `${p.r}deg`, animationDelay: `${0.1 + i * 0.07}s` }} aria-label={`${i + 1}`}>
                <Lenta/>
              </button>
            ))}
            <div className={`lm-panelzone ${tied ? 'lm-panelzone-tied' : ''}`}>
              {tied ? (
                <span className="lm-reveal lm-bob" style={{ display: 'inline-flex' }}><Panel className="lm-panel-big"/></span>
              ) : (
                <span className="lm-slotgrid">
                  {Array.from({ length: 10 }).map((_, k) => (
                    <span key={k} className={`lm-slot ${k < moved.size ? 'lm-slot-full' : ''}`}>
                      {k < moved.size && <span className="g1-pop-in" style={{ display: 'inline-flex' }}><Lenta className="lm-lenta-slot"/></span>}
                    </span>
                  ))}
                </span>
              )}
              <span className={`lm-count mono ${tied ? 'lm-count-ok' : ''}`}>{moved.size} / 10</span>
            </div>
          </div>
        </div>
        {tied && (
          <div ref={revealRef} className="frame-success fade-up">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(8px, 2vw, 14px)', flexWrap: 'wrap', marginBottom: 'clamp(8px, 1.6vw, 12px)' }}>
              <span style={{ display: 'inline-flex', flexDirection: 'column', gap: 2, maxWidth: 120 }}>
                {Array.from({ length: 10 }).map((_, i) => <Lenta key={i} className="lm-lenta-slot"/>)}
              </span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 800, color: T.ink2 }}>=</span>
              <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <Panel/>
                <b style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(12px, 1.9vw, 14px)', color: T.accent }}>{lang === 'ru' ? '1 сотня' : "1 yuzlik"}</b>
              </span>
            </div>
            <Reaction state="correct" praise={t(c.done_text)}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s3 — BUILD 245 (yuzlik + o'nlik + birlik)
const Screen3 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s3;
  const sfx = useSfx();
  const audio = useAudio([
    brgSeg('s3', lang),
    { id: 's3_0', text: c.audio[lang][0], trigger: 'after_previous', waits_for: null },
    { id: 's3_1', text: c.audio[lang][1], trigger: 'after_previous', waits_for: null },
    { id: 's3_2', text: c.audio[lang][2], trigger: 'on_event:done', waits_for: null },
    { id: 's3_ans', text: c.done_text[lang], trigger: 'after_previous', waits_for: null }   // JAVOBni ovozlash (245 = ...)
  ]);
  const canAct = useCanAnswer(audio);
  const [h, setH] = useState(0);
  const [tn, setTn] = useState(0);
  const [o, setO] = useState(0);
  const done = h === 2 && tn === 4 && o === 5;
  const firedRef = useRef(false);
  const revealRef = useRevealScroll(done, 600);
  const step = (k, d) => {
    if (!canAct || done) return;
    const clamp = (v) => Math.max(0, Math.min(9, v + d));
    if (k === 'h') setH(clamp); else if (k === 't') setTn(clamp); else setO(clamp);
  };
  useEffect(() => {
    if (done && !firedRef.current) { firedRef.current = true; sfx.playCorrect(); audio.triggerInternal('done'); }
  }, [done]);   // eslint-disable-line react-hooks/exhaustive-deps
  const labels = { h: t(c.hundreds_label), t: t(c.tens_label), o: t(c.ones_label) };
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
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(12px, 2.4vw, 18px)', padding: 'clamp(14px, 2.6vw, 22px)' }}>
          <RazryadConsole vals={{ h, t: tn, o }} labels={labels} onStep={step} disabled={done}/>
          <BigNum v={h === 0 && tn === 0 && o === 0 ? '?' : h * 100 + tn * 10 + o} accent={done}/>
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

// s4 — RAZRYAD KARTASI: 345 = 300 + 40 + 5 (real-vaqt, ovozga sinxron)
// Ishlangan misollar — yoyilma shaklni bir nechta sonда ko'rsatadi (grade3: «qanday ishlaydi» ko'p misol bilan).
// 703 — nol o'nlikda, 640 — nol birlikda (nol-o'rin misollari).
const EX_MORE = [[528, 500, 20, 8], [703, 700, 0, 3], [640, 600, 40, 0]];
const WorkedExamples = ({ lang }) => (
  <div className="frame-tip fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(5px, 1.2vw, 8px)', padding: 'clamp(8px, 1.6vw, 12px)' }}>
    <span className="mono" style={{ color: T.accent, fontWeight: 800, fontSize: 'clamp(11px, 1.5vw, 13px)' }}>{lang === 'ru' ? 'Ещё примеры — как это работает' : "Yana misollar — qanday ishlaydi"}</span>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(8px, 2.2vw, 18px)', justifyContent: 'center' }}>
      {EX_MORE.map(([n, h, tn, o]) => (
        <span key={n} className="mono g1-pop-in" style={{ fontWeight: 800, fontSize: 'clamp(13px, 2.2vw, 17px)', color: T.ink, whiteSpace: 'nowrap' }}>
          {n} = <span style={{ color: '#C0392B' }}>{h}</span> + <span style={{ color: '#1F7A4D' }}>{tn}</span> + <span style={{ color: T.blue }}>{o}</span>
        </span>
      ))}
    </div>
  </div>
);
// M1 harakati: 345 tepada, raqam dublikatlari yuzlik/o'nlik/birlik ustunlariga bittalab tushadi.
const M1Drop = ({ labels }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(8px, 2vw, 14px)' }}>
    <span className="mono lm-reveal" style={{ fontSize: 'clamp(24px, 5.5vw, 34px)', fontWeight: 800, color: T.ink2 }}>345</span>
    <div style={{ display: 'flex', gap: 'clamp(8px, 2.4vw, 18px)' }}>
      {[['3', 'h', '#C0392B'], ['4', 't', '#1F7A4D'], ['5', 'o', T.blue]].map(([d, k, col], i) => (
        <div key={k} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <span className="mono lm-drop" style={{ animationDelay: `${0.4 + i * 0.6}s`, fontSize: 'clamp(22px, 5vw, 32px)', fontWeight: 800, color: col, border: `2.5px solid ${col}`, borderRadius: 10, minWidth: 'clamp(32px, 8vw, 44px)', textAlign: 'center', padding: '3px 0', background: T.paper }}>{d}</span>
          <span className="mono" style={{ fontSize: 'clamp(10px, 1.4vw, 12px)', color: T.ink2, fontWeight: 700 }}>{labels[k]}</span>
        </div>
      ))}
    </div>
  </div>
);
// M2 harakati: 345 bo'linib 300, keyin 40, keyin 5 tushadi; oralariga + qo'yiladi.
const M2Drop = () => (
  <div className="mono" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 'clamp(4px, 1.2vw, 8px)', fontSize: 'clamp(19px, 3.8vw, 27px)', fontWeight: 800 }}>
    <span className="lm-drop" style={{ animationDelay: '0.4s', color: '#C0392B' }}>300</span>
    <span className="lm-fadein" style={{ animationDelay: '0.8s' }}>+</span>
    <span className="lm-drop" style={{ animationDelay: '1.0s', color: '#1F7A4D' }}>40</span>
    <span className="lm-fadein" style={{ animationDelay: '1.4s' }}>+</span>
    <span className="lm-drop" style={{ animationDelay: '1.6s', color: T.blue }}>5</span>
  </div>
);
// BONUS harakati: son qismlari (300/40/5) tepada, ostiga so'zi bittalab tushadi (so'z <-> son bog'lanadi).
const M3Drop = ({ parts, lang }) => {
  const cols = ['#C0392B', '#1F7A4D', T.blue];
  return (
    <div style={{ display: 'flex', gap: 'clamp(12px, 3.5vw, 30px)', alignItems: 'flex-start', justifyContent: 'center' }}>
      {parts.map((p, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <span className="mono" style={{ fontSize: 'clamp(16px, 3.2vw, 22px)', fontWeight: 800, color: cols[i] }}>{p.num}</span>
          <span className="lm-drop" style={{ animationDelay: `${0.4 + i * 0.5}s`, fontSize: 'clamp(12px, 1.8vw, 15px)', fontWeight: 700, color: T.ink }}>{p[lang]}</span>
        </div>
      ))}
    </div>
  );
};
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
  const done = reached >= (c.audio[lang].length - 1);
  const showM1 = reached >= 1;
  const showM2 = reached >= 2;
  const showM3 = reached >= 3;
  const labels = { h: t(c.hundreds_label), t: t(c.tens_label), o: t(c.ones_label) };
  const canAdv = useAdvanceGate(done, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  const MLabel = ({ x }) => <span className="mono" style={{ color: T.accent, fontWeight: 800, fontSize: 'clamp(12px, 1.7vw, 14px)', textAlign: 'center' }}>{x}</span>;
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'clamp(10px, 2vw, 14px)', padding: 'clamp(12px, 2.4vw, 20px)', minHeight: 'clamp(170px, 36vw, 230px)' }}>
          {!showM1 && <span className="mono" style={{ fontSize: 'clamp(30px, 7vw, 44px)', fontWeight: 800, color: T.ink }}>345</span>}
          {showM1 && (
            <div className="lm-reveal" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
              <MLabel x={t(c.m1_label)}/>
              <span className="lm-reveal lm-d1" style={{ color: T.ink2, fontSize: 'clamp(12px, 1.6vw, 14px)', textAlign: 'center', fontWeight: 600 }}>{t(c.m1_text)}</span>
              <M1Drop labels={labels}/>
            </div>
          )}
          {showM2 && (
            <div className="lm-reveal" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, borderTop: `1.5px dashed ${T.ink3}`, paddingTop: 'clamp(8px, 1.8vw, 14px)', width: '100%' }}>
              <MLabel x={t(c.m2_label)}/>
              <span className="lm-reveal lm-d1" style={{ color: T.ink2, fontSize: 'clamp(12px, 1.6vw, 14px)', textAlign: 'center', fontWeight: 600 }}>{t(c.m2_text)}</span>
              <M2Drop/>
            </div>
          )}
          {showM3 && (
            <div className="lm-reveal" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: '100%', background: '#FFF6DC', border: '1.5px solid #E8CB7A', borderRadius: 12, padding: 'clamp(8px, 1.8vw, 14px)' }}>
              <span className="mono" style={{ color: T.accent, fontWeight: 800, fontSize: 'clamp(12px, 1.7vw, 14px)', textAlign: 'center' }}>★ {t(c.m3_label)}</span>
              <span className="lm-reveal lm-d1" style={{ color: T.ink2, fontSize: 'clamp(12px, 1.6vw, 14px)', textAlign: 'center', fontWeight: 600 }}>{t(c.m3_text)}</span>
              <M3Drop parts={c.m3_parts} lang={lang}/>
            </div>
          )}
        </div>
      </div>
    </Stage>
  );
};

// s5 — O'RIN HAL QILADI: 345 / 435 / 543
const S5_NUMS = [345, 435, 543];
const Screen5 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s5;
  const audio = useAudio([
    brgSeg('s5', lang),
    ...c.audio[lang].map((text, i) => ({ id: `s5_${i}`, text, trigger: 'after_previous', waits_for: null }))
  ]);
  const seg = audio.currentSegment;
  const [reached, setReached] = useState(0);
  useEffect(() => { if (seg && /^s5_\d+$/.test(seg)) setReached((r) => Math.max(r, +seg.slice(3))); }, [seg]);
  const num = S5_NUMS[Math.min(reached, 2)];
  const digs = { h: Math.floor(num / 100), t: Math.floor((num % 100) / 10), o: num % 10 };
  const done = reached >= (c.audio[lang].length - 1);
  const labels = { h: t(c.hundreds_label), t: t(c.tens_label), o: t(c.ones_label) };
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
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(12px, 2.4vw, 18px)', padding: 'clamp(14px, 2.6vw, 22px)' }}>
          <div className="lm-digrow">
            {[digs.h, digs.t, digs.o].map((d, i) => (
              <span key={`${num}-${i}`} className={`lm-digcard lm-cardflip mono lm-dig-${d}`} style={{ animationDelay: `${i * 0.12}s` }}>{d}</span>
            ))}
          </div>
          <RazryadTable h={digs.h} t={digs.t} o={digs.o} labels={labels} digits/>
          <BigNum v={num} accent={done}/>
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

// s6 — SON O'QI (grade2 naqshi aynan): bola 470 ni taxmin qilib bosadi, KEYIN marker o'zi sakraydi
// (4 katta +100 arka -> 400, 7 kichik +10 qadam -> 470), ovoz bilan sinxron.
const NL_MIN = 300, NL_MAXV = 800, NL_W = 340, NL_pad = 26, NL_y = 66;
const nlx = (v) => NL_pad + ((v - NL_MIN) / (NL_MAXV - NL_MIN)) * (NL_W - 2 * NL_pad);
const NumberLineAnim = ({ phase, guess = null, onGuess = null }) => {
  const ref = useRef(null);
  const pos = phase >= 2 ? 470 : phase >= 1 ? 400 : NL_MIN;
  const asking = guess === null && !!onGuess;
  const arc = (a, b, h) => { const mid = (nlx(a) + nlx(b)) / 2; return `M ${nlx(a)} ${NL_y} Q ${mid} ${NL_y - h} ${nlx(b)} ${NL_y}`; };
  const handleClick = (e) => {
    if (!asking) return;
    const rect = ref.current.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * NL_W;
    let v = Math.round((NL_MIN + ((svgX - NL_pad) / (NL_W - 2 * NL_pad)) * (NL_MAXV - NL_MIN)) / 10) * 10;
    v = Math.max(NL_MIN, Math.min(NL_MAXV, v));
    onGuess(v);
  };
  return (
    <svg ref={ref} onClick={handleClick} viewBox={`0 0 ${NL_W} 104`} style={{ width: 'min(360px, 98%)', height: 'auto', cursor: asking ? 'pointer' : 'default' }} aria-hidden={!asking}>
      {asking && <rect x="0" y={NL_y - 26} width={NL_W} height="52" fill="transparent"/>}
      {asking && (
        <g className="d2-nlcue-slide" style={{ pointerEvents: 'none' }} aria-hidden="true">
          <circle className="d2-nlcue-ring" cx={nlx(NL_MIN)} cy={NL_y} r="7" fill="none" stroke="#F0A81E" strokeWidth="2"/>
          <text className="d2-nlcue-hand" x={nlx(NL_MIN)} y={NL_y + 30} textAnchor="middle" fontSize="19">👆</text>
        </g>
      )}
      <line x1={nlx(NL_MIN)} y1={NL_y} x2={nlx(NL_MAXV)} y2={NL_y} stroke={T.ink3} strokeWidth="2"/>
      {!asking && <line x1={nlx(NL_MIN)} y1={NL_y} x2={nlx(Math.min(pos, 400))} y2={NL_y} stroke={T.accent} strokeWidth="4" strokeLinecap="round" style={{ transition: 'all 0.6s' }}/>}
      {!asking && pos > 400 && <line x1={nlx(400)} y1={NL_y} x2={nlx(pos)} y2={NL_y} stroke={T.blue} strokeWidth="4" strokeLinecap="round" style={{ transition: 'all 0.6s' }}/>}
      {[300, 400, 500, 600, 700, 800].map((v) => (
        <g key={v}>
          <line x1={nlx(v)} y1={NL_y - 6} x2={nlx(v)} y2={NL_y + 6} stroke={T.ink2} strokeWidth="2.2"/>
          <text x={nlx(v)} y={NL_y + 20} textAnchor="middle" fontSize="11" fill={T.ink2} fontFamily="'JetBrains Mono', monospace">{v}</text>
        </g>
      ))}
      {!asking && (
        <g style={{ opacity: phase >= 1 ? 1 : 0, transition: 'opacity 0.4s' }}>
          <path d={arc(300, 400, 30)} fill="none" stroke={T.accent} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3.5"/>
          <text x={(nlx(300) + nlx(400)) / 2} y={NL_y - 34} textAnchor="middle" fontSize="10" fontWeight="800" fill={T.accent} fontFamily="'JetBrains Mono', monospace">+100</text>
        </g>
      )}
      {!asking && [400, 410, 420, 430, 440, 450, 460].map((a, i) => (
        <path key={i} d={arc(a, a + 10, 12)} fill="none" stroke={T.blue} strokeWidth="2.2" strokeLinecap="round"
          style={{ opacity: phase >= 2 ? 1 : 0, transition: `opacity 0.25s ${i * 0.14}s` }}/>
      ))}
      {guess !== null && (
        <g>
          <line x1={nlx(guess)} y1={NL_y - 20} x2={nlx(guess)} y2={NL_y + 6} stroke="#F0A81E" strokeWidth="2.5" strokeLinecap="round"/>
          <path d={`M ${nlx(guess) - 5} ${NL_y - 20} L ${nlx(guess) + 5} ${NL_y - 20} L ${nlx(guess)} ${NL_y - 13} Z`} fill="#F0A81E"/>
        </g>
      )}
      {!asking && (
        <g style={{ transform: `translateX(${nlx(pos) - nlx(NL_MIN)}px)`, transition: 'transform 0.7s cubic-bezier(0.34, 1.2, 0.4, 1)' }}>
          <text x={nlx(NL_MIN)} y={NL_y - 13} textAnchor="middle" fontSize="14" fontWeight="800" fill={T.ink} fontFamily="'JetBrains Mono', monospace">{pos}</text>
          <circle cx={nlx(NL_MIN)} cy={NL_y} r="6" fill={T.ink}/>
          <text className="d2-nlcue-hand" x={nlx(NL_MIN)} y={NL_y + 34} textAnchor="middle" fontSize="20">👆</text>
        </g>
      )}
    </svg>
  );
};
const Screen6 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s6;
  const sfx = useSfx();
  const audio = useAudio([
    { id: 's6_q', text: c.q_audio[lang], trigger: 'on_mount', waits_for: { type: 'guessed' } },
    ...c.audio[lang].map((text, i) => ({ id: `s6_${i}`, text, trigger: i === 0 ? 'on_event:go' : 'after_previous', waits_for: null })),
    { id: 's6_info', text: c.info[lang], trigger: 'after_previous', waits_for: null }   // «Foydali»ni oxirida ovozlash
  ]);
  const canAns = useCanAnswer(audio);
  const seg = audio.currentSegment;
  const [guess, setGuess] = useState(null);
  const [reached, setReached] = useState(-1);
  useEffect(() => { if (seg && /^s6_\d+$/.test(seg)) setReached((r) => Math.max(r, +seg.slice(3))); }, [seg]);
  const phase = reached >= 2 ? 2 : reached >= 1 ? 1 : 0;
  const done = reached >= 2;
  const revealRef = useRevealScroll(done, 500);
  const onGuess = (v) => {
    if (guess !== null || !canAns) return;
    setGuess(v); sfx.playCorrect();
    audio.triggerInternal('go');
  };
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
        {guess === null && (
          <p className="fade-up delay-1" style={{ textAlign: 'center', color: T.ink2, fontWeight: 600, fontSize: 'clamp(14px, 1.9vw, 16px)', margin: 0 }}>{t(c.q)}</p>
        )}
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'clamp(8px, 1.8vw, 12px)', padding: 'clamp(16px, 3vw, 24px)', minHeight: 'clamp(140px, 30vw, 190px)' }}>
          <NumberLineAnim phase={phase} guess={guess} onGuess={onGuess}/>
        </div>
        {done && (
          <div ref={revealRef} className="frame-success fade-up">
            <Reaction state="correct" praise={t(c.done_text)}/>
          </div>
        )}
        {done && <InfoNote badge={t(c.info_badge)} text={t(c.info)}/>}
      </div>
    </Stage>
  );
};

// sMING — KASHFIYOT: 10 yuzlik = 1000 (keyingi darsga ko'prik). Panellar ovoz bilan yig'iladi.
// Countdown soat — 5s o'ylash vaqti (savol berilgach).
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
const ScreenMing = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.sming;
  const audio = useAudio([
    brgSeg('sming', lang),
    { id: 'sming_0', text: c.audio[lang][0], trigger: 'after_previous', waits_for: null },
    { id: 'sming_1', text: c.audio[lang][1], trigger: 'on_event:go', waits_for: null },
    { id: 'sming_2', text: c.audio[lang][2], trigger: 'after_previous', waits_for: null },
    { id: 'sming_3', text: c.audio[lang][3], trigger: 'after_previous', waits_for: null }
  ]);
  const seg = audio.currentSegment;
  const [reached, setReached] = useState(-1);
  useEffect(() => { if (seg && /^sming_\d+$/.test(seg)) setReached((r) => Math.max(r, +seg.slice(6))); }, [seg]);
  // 5s SOAT: savol boshlangach o'ylash vaqti; tugagach 'go' -> sanoq.
  const [clock, setClock] = useState(null);   // null=hali emas, 5..0, -1=tugadi
  useEffect(() => { if (clock === null && reached >= 0) setClock(5); }, [reached, clock]);
  useEffect(() => {
    if (clock === null || clock < 0) return undefined;
    if (clock === 0) { audio.triggerInternal('go'); const id = setTimeout(() => setClock(-1), 300); return () => clearTimeout(id); }
    const id = setTimeout(() => setClock((v) => v - 1), 1000);
    return () => clearTimeout(id);
  }, [clock]);   // eslint-disable-line react-hooks/exhaustive-deps
  const clockRunning = clock !== null && clock >= 0;
  // Panellar sanoq bilan BITTALAB (sanoq boshlangach, ~0.46s oralab).
  const [panelN, setPanelN] = useState(0);
  useEffect(() => {
    if (reached < 1 || panelN >= 10) return undefined;
    const id = setTimeout(() => setPanelN((v) => v + 1), 460);
    return () => clearTimeout(id);
  }, [reached, panelN]);
  const revealed = reached >= 2;
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
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'clamp(10px, 2vw, 14px)', padding: 'clamp(12px, 2.4vw, 20px)', minHeight: 'clamp(180px, 38vw, 240px)' }}>
          {clockRunning && <CountdownClock n={clock} lang={lang}/>}
          {!clockRunning && reached >= 1 && !revealed && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, auto)', gap: 'clamp(4px, 1vw, 8px)' }}>
              {Array.from({ length: 10 }).map((_, i) => (
                <span key={i} className={i < panelN ? 'lm-dock' : ''} style={{ display: 'inline-flex', opacity: i < panelN ? 1 : 0.12, transition: 'opacity 0.3s' }}>
                  <Panel className="lm-mat-panel"/>
                </span>
              ))}
            </div>
          )}
          {revealed && (
            <>
              <div className="lm-reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, auto)', gap: 'clamp(3px, 0.8vw, 6px)' }}>
                {Array.from({ length: 10 }).map((_, i) => <span key={i} style={{ display: 'inline-flex' }}><Panel className="lm-mat-panel"/></span>)}
              </div>
              <span className="mono lm-eq lm-write lm-d1" style={{ fontSize: 'clamp(20px, 4vw, 30px)', fontWeight: 800, color: T.success }}>{t(c.ming_eq)}</span>
              <span className="lm-write lm-d2" style={{ fontSize: 'clamp(16px, 3vw, 22px)', fontWeight: 800, color: T.accent, letterSpacing: 3 }}>{t(c.ming_word)}</span>
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

// s7 — QOIDA: 3 xonali razryad + check (yuzlik raqamini bosish)
const Screen7 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s7;
  const sfx = useSfx();
  // SAVOL avval (aksent) -> javob bergach QOIDA + tushuntirish (s7_0..s7_5) ochiladi.
  const audio = useAudio([
    brgSeg('s7', lang),
    { id: 's7_q', text: c.check_q[lang], trigger: 'after_previous', waits_for: null },
    ...c.audio[lang].slice(0, 6).map((text, i) => ({ id: `s7_${i}`, text, trigger: i === 0 ? 'on_event:answered' : 'after_previous', waits_for: null }))
  ]);
  const canAct = useCanAnswer(audio);
  const [tapped, setTapped] = useState(null);
  const ok = tapped === 'h';
  const revealRef = useRevealScroll(ok, 500);
  const onCell = (k) => {
    if (!canAct || ok) return;
    setTapped(k);
    if (k === 'h') { sfx.playCorrect(); audio.triggerInternal('answered'); }
  };
  const maskLabels = { h: '?', t: '?', o: '?' };
  const realLabels = { h: t(c.hundreds_label), t: t(c.tens_label), o: t(c.ones_label) };
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
        {!ok ? (
          <div className="lm-q-accent fade-up">{t(c.check_q)}</div>
        ) : (
          <div className="d2-rulecard fade-up">
            <span className="d2-rulecard-badge mono">{t(c.eyebrow)}</span>
            <p className="d2-rulecard-txt">{t(c.rule)}</p>
          </div>
        )}
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(10px, 2vw, 14px)', padding: 'clamp(14px, 2.6vw, 22px)' }}>
          <RazryadTable h={3} t={4} o={5} labels={ok ? realLabels : maskLabels} digits onCell={onCell} cellSel={ok ? 'h' : null}/>
          {tapped && !ok && <p style={{ textAlign: 'center', color: T.ink2, fontWeight: 700, margin: 0 }}>{t(c.check_no)}</p>}
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

// s8 — MASHQ build (3 raund: 362, 530, 407). Har raundda berilgan sonni yig'adi.
const S8_TARGETS = [362, 530, 407];
const Screen8 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s8;
  const sfx = useSfx();
  const audio = useAudio([
    brgSeg('s8', lang),
    { id: 's8_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [round, setRound] = useState(props.storedAnswer ? S8_TARGETS.length : 0);
  const [h, setH] = useState(props.storedAnswer ? Math.floor(S8_TARGETS[S8_TARGETS.length - 1] / 100) : 0);
  const [tn, setTn] = useState(props.storedAnswer ? Math.floor((S8_TARGETS[S8_TARGETS.length - 1] % 100) / 10) : 0);
  const [o, setO] = useState(props.storedAnswer ? S8_TARGETS[S8_TARGETS.length - 1] % 10 : 0);
  const [checked, setChecked] = useState(false);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const firstAllRef = useRef(props.storedAnswer ? props.storedAnswer.firstTry : true);
  const [score, setScore] = useState(props.storedAnswer ? (props.storedAnswer.studentAnswer | 0) : 0);
  const triedRef = useRef(false);   // shu raundda xato bo'lganmi: ball faqat birinchi urinishda
  const done = round >= S8_TARGETS.length;
  const target = S8_TARGETS[Math.min(round, S8_TARGETS.length - 1)];
  const built = h * 100 + tn * 10 + o;
  const correct = built === target;
  const revealRef = useRevealScroll(checked, 500);
  const step = (k, d) => {
    if (!canAct || checked || done) return;
    const clamp = (v) => Math.max(0, Math.min(9, v + d));
    if (k === 'h') setH(clamp); else if (k === 't') setTn(clamp); else setO(clamp);
  };
  const check = () => {
    if (!canAct || checked || done) return;
    setChecked(true);
    const isOk = correct;
    if (!isOk) { firstAllRef.current = false; triedRef.current = true; }
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((isOk ? c.audio.on_correct : c.audio.on_wrong)[lang]); }
    if (isOk) { sfx.playCorrect(); if (!triedRef.current) setScore((v) => v + 1); setTimeout(() => { setChecked(false); if (round + 1 < S8_TARGETS.length) { setH(0); setTn(0); setO(0); } triedRef.current = false; setRound((r) => r + 1); }, 950); }
    else { setTimeout(() => setChecked(false), 1600); }
  };
  useEffect(() => {
    if (done && !recorded) {
      setRecorded(true);
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: t(c.q),
        correctAnswer: String(S8_TARGETS.length), studentAnswer: score, correct: firstAllRef.current,
        firstTry: firstAllRef.current, attempts: 1, solved: true
      });
    }
  }, [done]);
  const labels = { h: t(c.hundreds_label), t: t(c.tens_label), o: t(c.ones_label) };
  const canAdv = useAdvanceGate(done, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  const buildLabel = lang === 'ru' ? 'Собери число' : "Sonni yig'ing";
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        {target !== undefined && (
          <>
            <div className="mono fade-up" style={{ textAlign: 'center', color: T.accent, fontWeight: 800 }}>{Math.min(round + 1, S8_TARGETS.length)} / {S8_TARGETS.length}</div>
            <h1 className="title h-sub fade-up">{buildLabel}: <span className="mono" style={{ color: T.accent }}>{target}</span></h1>
            <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(10px, 2vw, 14px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
              <FrameFx/>
              <RazryadConsole vals={{ h, t: tn, o }} labels={labels} onStep={step} disabled={checked || done}/>
              <BigNum v={built} accent={(checked && correct) || done}/>
              <button className="btn-white-accent" disabled={!canAct || checked || done} onClick={check}>{t(c.check_label)}</button>
            </div>
            {checked && (
              <div ref={revealRef} className={correct ? 'frame-success fade-up' : 'frame-tip fade-up'}>
                <Reaction state={correct ? 'correct' : 'wrong'} praise={(correct ? c.audio.on_correct : c.audio.on_wrong)[lang]}/>
              </div>
            )}
          </>
        )}
        {done && (
          <div className="frame-success reveal-soft">
            <Reaction state="correct" praise={lang === 'ru' ? `Верно: ${score} из ${S8_TARGETS.length}` : `To'g'ri: ${S8_TARGETS.length} tadan ${score} ta`}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s9 — TASNIFLASH (3 raund: 528, 703, 461). Har raundda son raqamlarini xonalarga ajratadi.
const S9_NUMS = [528, 703, 461, 350];
// Har raundda 2 ta CHALG'ITUVCHI raqam (songa kirmaydi; asl raqamlar bilan takrorlanmaydi).
const S9_DECOYS = [[4, 9], [5, 8], [9, 2], [7, 2]];
// Tray tartibi ATAYIN aralash (son tartibida emas). Indeks: 0=yuzlik,1=o'nlik,2=birlik, 3-4=chalg'ituvchi.
const S9_ORDERS = [[1, 3, 2, 0, 4], [2, 0, 4, 1, 3], [3, 1, 0, 4, 2], [0, 4, 2, 1, 3]];
const s9digits = (n) => [Math.floor(n / 100), Math.floor((n % 100) / 10), n % 10];

// DEMO: qo'l (👆) bitta misolni (275) ko'rsatib joylaydi — raqamni bosadi, keyin to'g'ri qutiga bosadi.
// Bola AVVAL kuzatadi, keyin o'zi qiladi. Passiv, avtomatik ketma-ket (har xona ~1.9s).
const DEMO_NUM = 275;
const DEMO_DIG = [2, 7, 5];        // 0=yuzlik, 1=o'nlik, 2=birlik
const DEMO_BK = ['h', 't', 'o'];
const TapBinDemo = ({ labels, lang, onDone }) => {
  const [step, setStep] = useState(0);       // faol ustun
  const [sub, setSub] = useState('tap');     // 'tap' (qo'l bosadi) -> 'fly' (elastik uchadi) -> 'placed'
  const [fly, setFly] = useState(null);
  const wrapRef = useRef(null);
  useEffect(() => {
    if (step >= DEMO_DIG.length) { onDone && onDone(); return undefined; }
    let tm;
    if (sub === 'tap') {
      tm = setTimeout(() => setSub('fly'), 1200);          // qo'l bosishini kuzatadi
    } else if (sub === 'fly') {
      const root = wrapRef.current;
      const chip = root && root.querySelector(`.lm-demo-col[data-i="${step}"] .lm-demo-chip`);
      const slot = root && root.querySelector(`.lm-demo-col[data-i="${step}"] .lm-bin-slot`);
      if (root && chip && slot) {
        const w = root.getBoundingClientRect(), c = chip.getBoundingClientRect(), s = slot.getBoundingClientRect();
        setFly({ digit: DEMO_DIG[step], x: c.left - w.left, y: c.top - w.top, w: c.width, h: c.height,
                 dx: (s.left + s.width / 2) - (c.left + c.width / 2), dy: (s.top + s.height / 2) - (c.top + c.height / 2) });
      }
      tm = setTimeout(() => setSub('placed'), 760);        // elastik uchish davomiyligi
    } else {   // placed
      setFly(null);
      tm = setTimeout(() => { setStep((s) => s + 1); setSub('tap'); }, 700);
    }
    return () => clearTimeout(tm);
  }, [step, sub]);   // eslint-disable-line react-hooks/exhaustive-deps
  const done = step >= DEMO_DIG.length;
  const placedN = (i) => i < step || (i === step && sub === 'placed');
  const cap = done
    ? (lang === 'ru' ? 'Готово — так и делаем!' : "Bo'ldi — shunday qilamiz!")
    : `${DEMO_DIG[step]} — ${labels[DEMO_BK[step]]}`;
  return (
    <div className="lm-demo-wrap fade-up" ref={wrapRef}>
      <div className="lm-demo-goal mono">{lang === 'ru' ? 'Собираем число' : "Sonni yig'amiz"}</div>
      <div className="lm-demo-num mono">
        {DEMO_DIG.map((d, i) => (
          <span key={i} className={`lm-demo-num-d ${placedN(i) ? 'lm-demo-num-done' : (i === step ? 'lm-demo-num-on' : '')}`}>{d}</span>
        ))}
      </div>
      <div className={`lm-demo-cap mono ${done ? 'lm-demo-cap-done' : ''}`}>{cap}</div>
      <div className="lm-demo-grid">
        {DEMO_DIG.map((d, i) => {
          const placed = placedN(i);
          const showChip = i > step || (i === step && sub !== 'placed');
          const gone = i === step && sub === 'fly';
          const active = i === step && sub === 'tap';
          return (
            <div key={i} className="lm-demo-col" data-i={i}>
              <div className="lm-demo-chipzone">
                {showChip && <span className={`lm-digchip mono lm-demo-chip ${active ? 'lm-demo-chip-on' : ''} ${gone ? 'lm-demo-chip-gone' : ''}`}>{d}</span>}
                {active && <span className="lm-demo-hand" aria-hidden="true">👆</span>}
              </div>
              <div className={`lm-bin lm-demo-bin ${placed ? 'lm-bin-full' : ''} ${(i === step && sub !== 'tap') ? 'lm-bin-open' : ''}`}>
                <span className="lm-bin-head mono">{labels[DEMO_BK[i]]}</span>
                <span className="lm-bin-slot mono">{placed ? <span className="lm-demo-drop">{d}</span> : ''}</span>
              </div>
            </div>
          );
        })}
      </div>
      {fly && <span className="lm-fly mono" style={{ left: fly.x, top: fly.y, width: fly.w, height: fly.h, '--fx': `${fly.dx}px`, '--fy': `${fly.dy}px` }}>{fly.digit}</span>}
    </div>
  );
};

const Screen9 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s9;
  const sfx = useSfx();
  const audio = useAudio([
    brgSeg('s9', lang),
    { id: 's9_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [round, setRound] = useState(props.storedAnswer ? S9_NUMS.length : 0);
  const [sel, setSel] = useState(null);
  const [bins, setBins] = useState(props.storedAnswer ? { h: 0, t: 1, o: 2 } : { h: null, t: null, o: null });
  const [checked, setChecked] = useState(false);
  const [roundOk, setRoundOk] = useState(false);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const firstAllRef = useRef(props.storedAnswer ? props.storedAnswer.firstTry : true);
  const [score, setScore] = useState(props.storedAnswer ? (props.storedAnswer.studentAnswer | 0) : 0);
  const triedRef = useRef(false);   // shu raundda xato bo'lganmi: ball faqat birinchi urinishda
  // Avval DEMO (qo'l ko'rsatadi), keyin o'quvchi o'zi. storedAnswer bo'lsa (qайта kirish) demo o'tkazib yuboriladi.
  const [phase, setPhase] = useState(props.storedAnswer ? 'play' : 'demo');
  const [demoDone, setDemoDone] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const wrapRef = useRef(null);
  const [selRect, setSelRect] = useState(null);   // tanlangan chip o'rni (uchish uchun)
  const [fly, setFly] = useState(null);           // uchayotgan raqam
  const [flyingIdx, setFlyingIdx] = useState(null);
  const done = round >= S9_NUMS.length;
  const num = S9_NUMS[Math.min(round, S9_NUMS.length - 1)];
  const digits = [...s9digits(num), ...S9_DECOYS[Math.min(round, S9_DECOYS.length - 1)]];
  const revealRef = useRevealScroll(checked, 500);
  const usedIdx = new Set(Object.values(bins).filter(v => v !== null));
  const placeInto = (k, e) => {
    if (!canAct || checked || done || sel === null || bins[k] !== null || flyingIdx !== null) return;
    const wrap = wrapRef.current && wrapRef.current.getBoundingClientRect();
    const slotEl = e && e.currentTarget.querySelector('.lm-bin-slot');
    const from = selRect;
    const selNow = sel;
    if (wrap && slotEl && from) {
      const s = slotEl.getBoundingClientRect();
      setFlyingIdx(selNow); setSel(null);
      setFly({ digit: digits[selNow], x: from.left - wrap.left, y: from.top - wrap.top, w: from.width, h: from.height,
               dx: (s.left + s.width / 2) - (from.left + from.width / 2), dy: (s.top + s.height / 2) - (from.top + from.height / 2) });
      setTimeout(() => {
        setFly(null); setFlyingIdx(null);
        const nb = { ...bins, [k]: selNow };
        setBins(nb);
        if (['h', 't', 'o'].every(kk => nb[kk] !== null)) evaluate(nb);
      }, 760);
    } else {   // o'lchab bo'lmasa — darrov joylash
      const nb = { ...bins, [k]: selNow }; setSel(null); setBins(nb);
      if (['h', 't', 'o'].every(kk => nb[kk] !== null)) evaluate(nb);
    }
  };
  const evaluate = (nb) => {
    const isOk = nb.h === 0 && nb.t === 1 && nb.o === 2;   // raqamlar xona tartibida: indeks 0=yuzlik, 1=o'nlik, 2=birlik
    setChecked(true); setRoundOk(isOk);
    if (!isOk) { firstAllRef.current = false; triedRef.current = true; }
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((isOk ? c.audio.on_correct : c.audio.on_wrong)[lang]); }
    if (isOk) { sfx.playCorrect(); if (!triedRef.current) setScore((v) => v + 1); setTimeout(() => { setChecked(false); if (round + 1 < S9_NUMS.length) setBins({ h: null, t: null, o: null }); setSel(null); triedRef.current = false; setRound((r) => r + 1); }, 1100); }
    else { setTimeout(() => { setChecked(false); setBins({ h: null, t: null, o: null }); setSel(null); }, 1700); }
  };
  useEffect(() => {
    if (done && !recorded) {
      setRecorded(true);
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: t(c.q),
        correctAnswer: String(S9_NUMS.length), studentAnswer: score, correct: firstAllRef.current,
        firstTry: firstAllRef.current, attempts: 1, solved: true
      });
    }
  }, [done]);
  const labels = { h: t(c.hold_hundreds), t: t(c.hold_tens), o: t(c.hold_ones) };
  const canAdv = useAdvanceGate(done, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  const sortLabel = lang === 'ru' ? 'Разложи цифры числа' : "Raqamlarni xonalarga ajrating";
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div ref={wrapRef} style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        {!done && phase === 'demo' && (
          <>
            <div className="lm-demo-banner mono fade-up">👀 {lang === 'ru' ? 'Смотри — покажу на примере' : "Qara — misolda ko'rsataman"}: {DEMO_NUM}</div>
            <TapBinDemo key={replayKey} labels={labels} lang={lang} onDone={() => setDemoDone(true)}/>
            <div className="fade-up" style={{ display: 'flex', gap: 'clamp(8px, 2vw, 12px)', justifyContent: 'center', flexWrap: 'wrap', marginTop: 4 }}>
              <button className="lm-demo-replay" disabled={!demoDone} onClick={() => { setDemoDone(false); setReplayKey((k) => k + 1); }}>↺ {lang === 'ru' ? 'Ещё раз' : "Yana ko'r"}</button>
              <button className="btn-white-accent" disabled={!demoDone} onClick={() => setPhase('play')}>{lang === 'ru' ? 'Теперь я сам! →' : "Endi o'zim! →"}</button>
            </div>
          </>
        )}
        {phase === 'play' && (
          <>
            <div className="lm-play-banner mono fade-up">✋ {lang === 'ru' ? 'Твоя очередь!' : 'Endi sening navbating!'}</div>
            <div className="mono fade-up" style={{ textAlign: 'center', color: T.accent, fontWeight: 800 }}>{Math.min(round + 1, S9_NUMS.length)} / {S9_NUMS.length}</div>
            <h1 className="title h-sub fade-up">{sortLabel}: <span className="mono" style={{ color: T.accent }}>{num}</span></h1>
            <div className="lm-digtray fade-up delay-1">
              {S9_ORDERS[Math.min(round, S9_ORDERS.length - 1)].map((i) => [digits[i], i]).map(([d, i]) => !done && !usedIdx.has(i) && flyingIdx !== i && (
                <button key={i} className={`lm-digchip mono ${sel === i ? 'lm-digchip-sel' : ''}`} disabled={!canAct || checked || done || flyingIdx !== null} onClick={(e) => { setSel(i); setSelRect(e.currentTarget.getBoundingClientRect()); }}>{d}</button>
              ))}
              {usedIdx.size === 3 && <span className="lm-digtray-empty mono">{num}</span>}
            </div>
            <div className="lm-bins fade-up delay-1">
              {['h', 't', 'o'].map((k) => (
                <button key={k} className={`lm-bin ${bins[k] !== null ? 'lm-bin-full' : ''} ${sel !== null && bins[k] === null ? 'lm-bin-open' : ''}`} disabled={!canAct || checked || bins[k] !== null || sel === null || flyingIdx !== null} onClick={(e) => placeInto(k, e)}>
                  <span className="lm-bin-head mono">{labels[k]}</span>
                  <span className="lm-bin-slot mono">{bins[k] !== null ? digits[bins[k]] : ''}</span>
                </button>
              ))}
            </div>
            {checked && (
              <div ref={revealRef} className={roundOk ? 'frame-success fade-up' : 'frame-tip fade-up'}>
                <Reaction state={roundOk ? 'correct' : 'wrong'} praise={(roundOk ? c.audio.on_correct : c.audio.on_wrong)[lang]}/>
              </div>
            )}
          </>
        )}
        {done && (
          <div className="frame-success reveal-soft">
            <Reaction state="correct" praise={lang === 'ru' ? `Верно: ${score} из ${S9_NUMS.length}` : `To'g'ri: ${S9_NUMS.length} tadan ${score} ta`}/>
          </div>
        )}
        {fly && <span className="lm-fly mono" style={{ left: fly.x, top: fly.y, width: fly.w, height: fly.h, '--fx': `${fly.dx}px`, '--fy': `${fly.dy}px` }}>{fly.digit}</span>}
      </div>
    </Stage>
  );
};

// s10 — MC nol-o'rin 305
// MC KO'P-RAUNDLI TEST (3 savol ketma-ket, веди-до-verного: to'g'ri javobgacha keyingi raundга o'tmaydi).
// renderFig — har raund uchun vizual. Grade3 yangiligi: har mashq testi 3 ketma-ket savol.
const MCRoundScreen = ({ props, ck, renderFig, cols = 2 }) => {
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
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: t(items[0].q),
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
            <h1 className="title h-sub fade-up">{t(it.q)}</h1>
            <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(10px, 2vw, 14px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
              <FrameFx/>
              {renderFig(it)}
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(100px, 1fr))`, gap: 10, width: '100%' }}>
                {it.opts.map((o, i) => (
                  <button key={i} className={`option ${okPick === i ? 'option-correct' : ''} ${wrongSet.has(i) ? 'option-picked-wrong' : ''}`} disabled={!canAct || okPick !== null || wrongSet.has(i)} onClick={() => pick(i)}
                    style={{ padding: 'clamp(10px, 1.6vw, 13px)', fontSize: 'clamp(13px, 1.7vw, 15px)', minHeight: 'clamp(46px, 6.5vw, 56px)' }}>{t(o)}</button>
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
const Screen10 = (props) => {
  const lang = useLang();
  const labels = { h: lang === 'ru' ? 'сотни' : 'yuzlik', t: lang === 'ru' ? 'десятки' : "o'nlik", o: lang === 'ru' ? 'единицы' : 'birlik' };
  // Figura — energiya konsoli naqshi (bitta belgi + ×son), razryad bloklarini sanash o'rniga:
  // ixcham va o'quvchiga tushunarli. Aksent YO'Q (neutral), qiymat ko'rsatilmaydi (showVal=false),
  // aks holda 300 va 5 javobni tayyor beradi. key — har topshiriqda ×son qayta «pop» qilsin.
  return <MCRoundScreen props={props} ck="s10" cols={2} renderFig={(it) => (
    <div className="lm-figwrap">
      <RazryadConsole key={it.hto.join('-')} vals={{ h: it.hto[0], t: it.hto[1], o: it.hto[2] }} labels={labels} neutral showVal={false}/>
    </div>
  )}/>;
};

// s11 — MC taqqoslash (3 raund: 345/354, 482/428, 600/599)
// s11 — TAQQOSLASH: bola < > = belgisini tanlaydi, to'g'ri belgi animatsiya bilan slotga tushadi,
// katta son yorishadi (belgining ochiq og'zi kattaga qaraydi). 3 raund, веди-до-verного.
const CMP_SIGNS = ['<', '=', '>'];
const Screen11 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s11;
  const items = c.items;
  const audio = useAudio([
    brgSeg('s11', lang),
    { id: 's11_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
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
  const bigger = it ? (it.pair[0] > it.pair[1] ? 0 : 1) : -1;
  const revealRef = useRevealScroll(done, 400);
  const pick = (s) => {
    if (!canAct || done || solvedRound || wrongSet.has(s)) return;
    if (s === it.sign) {
      setPicked(s); sfx.playCorrect();
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_correct[lang]); }
      if (wrongSet.size === 0) setScore((x) => x + 1);
      setTimeout(() => { if (idx + 1 < items.length) setPicked(null); setWrongSet(new Set()); setIdx((n) => n + 1); }, 1400);
    } else {
      const n = new Set(wrongSet); n.add(s); setWrongSet(n);
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
                {CMP_SIGNS.map((s) => (
                  <button key={s} className={`lm-signbtn mono ${wrongSet.has(s) ? 'lm-signbtn-wrong' : ''} ${picked === s ? 'lm-signbtn-ok' : ''}`} disabled={!canAct || solvedRound || wrongSet.has(s)} onClick={() => pick(s)}>{s}</button>
                ))}
              </div>
              {wrongSet.size > 0 && !solvedRound && (
                <p className="fade-up" style={{ margin: 0, color: T.ink2, fontSize: 'clamp(13px, 1.7vw, 15px)', textAlign: 'center' }}>{t(it.hint)}</p>
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



// --- MINI-SHAHARCHA (final savol vizuali): ixcham Lumo ko'chasi — pastel uylar, porlovchi
// derazalar, uchar kristall va halqali sayyora. Dekorativ, uzun panel-to'plami o'rniga.
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

// sCASE — MASALA: shahar hisobi. YANGILIK — javob MC-tanish emas, raqam-plita bilan TERILADI (346).
// Veди-до-verного: to'g'ri terilmaguncha "Davom" ochilmaydi; xato-hint faqat METODNI aytadi (sonni emas).
const CASE_ANS = 346;
const ScreenCase = (props) => {
  const lang = useLang();
  const t = useT();
  const s12 = CONTENT.s12;
  const s13 = CONTENT.s13;
  const sfx = useSfx();
  const audio = useAudio([
    brgSeg('s12', lang),
    { id: 'sCASE_manifest', text: s12.audio[lang], trigger: 'after_previous', waits_for: null },
    { id: 'sCASE_intro', text: s13.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [val, setVal] = useState(props.storedAnswer ? String(props.storedAnswer.studentAnswer) : '');
  const [checked, setChecked] = useState(props.storedAnswer !== undefined);
  const [solved, setSolved] = useState(props.storedAnswer?.correct === true);
  const firstRef = useRef(props.storedAnswer ? props.storedAnswer.firstTry : null);
  const revealRef = useRevealScroll(checked, 500);
  const correct = parseInt(val, 10) === CASE_ANS;
  const check = () => {
    if (!canAct || solved || val === '') return;
    setChecked(true);
    const isOk = correct;
    if (firstRef.current === null) firstRef.current = isOk;
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((isOk ? s13.audio.on_correct : s13.audio.on_wrong)[lang]); }
    if (isOk) { setSolved(true); sfx.playCorrect(); }
    props.onAnswer({
      stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: t(s13.q),
      correctAnswer: String(CASE_ANS), studentAnswer: val, correct: isOk,
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
  const askLine = lang === 'ru' ? 'Набери ответ, нажимая цифры:' : 'Raqamlarni bosib javobni tering:';
  return (
    <Stage eyebrow={s12.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <p className="fade-up" style={{ textAlign: 'center', color: T.ink2, fontWeight: 700, margin: 0 }}>{t(s12.lead)}</p>
        <h1 className="title h-sub fade-up delay-1" style={{ margin: 0 }}>{t(s13.q)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(8px, 1.6vw, 12px)', padding: 'clamp(10px, 2vw, 16px)' }}>
          <FrameFx/>
          {/* HISOB-KARTA — Anvar keltirgan hisobot (3 USTUN yonma-yon, razryad-ranglar) */}
          <div className="lm-report">
            <span className="lm-report-head mono">{t(s12.manifest_label)}</span>
            <div className="lm-report-cols">
              {[[3, lang === 'ru' ? 'сотни' : 'yuzlik', '#C0392B', '#FBE9E7'], [4, lang === 'ru' ? 'десятки' : "o'nlik", '#1F7A4D', '#E3F0E8'], [6, lang === 'ru' ? 'единицы' : 'birlik', '#019ACB', '#E3F2F8']].map(([n, lbl, col, bg], i) => (
                <div key={lbl} className="lm-report-col lm-reveal" style={{ animationDelay: `${0.25 + i * 0.3}s` }}>
                  <span className="lm-report-n mono" style={{ color: col, background: bg }}>{n}</span>
                  <span className="lm-report-lbl">{lbl}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="fade-up" style={{ margin: 0, textAlign: 'center', color: T.ink2, fontSize: 'clamp(12px, 1.6vw, 14px)', fontWeight: 600 }}>{askLine}</p>
          <NumPad value={val} setValue={setVal} disabled={!canAct || solved} max={3}/>
          <button className="btn-white-accent" disabled={!canAct || solved || val === ''} onClick={check}>{lang === 'ru' ? 'Проверить' : 'Tekshir'}</button>
        </div>
        {checked && (
          <div ref={revealRef} className={correct ? 'frame-success fade-up' : 'frame-tip fade-up'}>
            <Reaction state={correct ? 'correct' : 'wrong'} praise={(correct ? s13.audio.on_correct : s13.audio.on_wrong)[lang]}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// FactCard illyustratsiyasi (s14): qizil mitti yulduz + Lumo 3D ORBITADA aylanadi.
// Orbita SymPy bilan hisoblangan: qiya aylana (incl 62°) -> perspektiv proyeksiya (kamera d=58).
// Old yarim = katta/yaqin (yulduz OLDIDA), orqa yarim = kichik/uzoq (yulduz ORTIDA). Keyframe: lumoOrbitFront/Back.
// Fon yulduzlari (kosmik obyektlar, keng panel 340x150 bo'ylab): [x, y, r, animationDelay]
const STAR_FIELD = [
  [20, 24, 1.1, 0], [44, 14, 0.7, 0.6], [70, 40, 0.9, 1.2], [30, 70, 0.8, 0.3], [16, 104, 1.0, 1.1],
  [54, 122, 0.7, 0.7], [92, 58, 0.8, 1.6], [10, 50, 0.7, 0.2], [86, 106, 0.9, 1.3], [40, 44, 0.6, 1.9],
  [240, 20, 1.1, 0.5], [270, 12, 0.7, 1.0], [302, 30, 1.2, 1.5], [322, 60, 0.8, 0.4], [290, 104, 0.9, 1.7],
  [318, 120, 0.8, 0.9], [248, 114, 0.7, 1.2], [330, 88, 1.0, 0.6], [262, 52, 0.6, 2.0], [300, 136, 0.8, 1.4],
  [150, 10, 0.8, 0.8], [198, 12, 0.7, 1.3], [132, 138, 0.8, 0.5], [214, 138, 0.9, 1.1]
];
const LumoPlanet = () => (
  <>
    <circle cx="170" cy="78" r="9" fill="url(#lumoP)"/>
    <ellipse cx="170" cy="78" rx="14" ry="3.8" fill="none" stroke="#E6C8F0" strokeWidth="1.5" opacity="0.85"/>
    <ellipse cx="166" cy="73.5" rx="2.9" ry="1.7" fill="rgba(255,255,255,0.5)"/>
  </>
);
const RedDwarfFig = () => (
  <span className="d2-factfig" aria-hidden="true">
    <svg viewBox="0 0 340 150" width="340" height="150" preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="spaceBg" cx="50%" cy="50%" r="62%"><stop offset="0%" stopColor="#2A1830"/><stop offset="52%" stopColor="#15132C"/><stop offset="100%" stopColor="#090717"/></radialGradient>
        <radialGradient id="rdStar" cx="40%" cy="36%" r="62%"><stop offset="0%" stopColor="#FFE8C0"/><stop offset="40%" stopColor="#FF7A3C"/><stop offset="100%" stopColor="#BE2E0C"/></radialGradient>
        <radialGradient id="rdGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#FF6A3C" stopOpacity="0.6"/><stop offset="100%" stopColor="#FF6A3C" stopOpacity="0"/></radialGradient>
        <radialGradient id="lumoP" cx="38%" cy="34%" r="70%"><stop offset="0%" stopColor="#E6C4EE"/><stop offset="60%" stopColor="#C79AD6"/><stop offset="100%" stopColor="#9A6EB0"/></radialGradient>
        <radialGradient id="neb1" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#6E4A8E" stopOpacity="0.5"/><stop offset="100%" stopColor="#6E4A8E" stopOpacity="0"/></radialGradient>
        <radialGradient id="neb2" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#8E4A66" stopOpacity="0.42"/><stop offset="100%" stopColor="#8E4A66" stopOpacity="0"/></radialGradient>
        <radialGradient id="distP" cx="38%" cy="34%" r="70%"><stop offset="0%" stopColor="#9EE0D6"/><stop offset="100%" stopColor="#3E8E86"/></radialGradient>
        <radialGradient id="distP2" cx="38%" cy="34%" r="70%"><stop offset="0%" stopColor="#A6C4F0"/><stop offset="100%" stopColor="#5A78B0"/></radialGradient>
        <clipPath id="spaceClip"><rect x="0" y="0" width="340" height="150" rx="16"/></clipPath>
      </defs>
      <g clipPath="url(#spaceClip)">
        <rect x="0" y="0" width="340" height="150" fill="url(#spaceBg)"/>
        {/* tumanlik (nebula) — chap va o'ng */}
        <ellipse cx="52" cy="34" rx="70" ry="44" fill="url(#neb1)"/>
        <ellipse cx="292" cy="120" rx="72" ry="46" fill="url(#neb2)"/>
        <ellipse cx="300" cy="34" rx="52" ry="34" fill="url(#neb1)" opacity="0.6"/>
        {/* fon yulduzlari (miltillaydi) */}
        <g fill="#FFF6E8">{STAR_FIELD.map(([x, y, r, d], i) => <circle key={i} className="star-tw" style={{ animationDelay: `${d}s` }} cx={x} cy={y} r={r}/>)}</g>
        {/* uzoq sayyoralar (chap + o'ng) */}
        <g opacity="0.9"><circle cx="306" cy="28" r="6" fill="url(#distP)"/><ellipse cx="306" cy="28" rx="10.5" ry="2.7" fill="none" stroke="#BFEAE4" strokeWidth="1" opacity="0.7"/></g>
        <circle cx="40" cy="120" r="5" fill="url(#distP2)" opacity="0.9"/>
        {/* kometa (uchib o'tadi) */}
        <g className="comet"><line x1="0" y1="0" x2="-24" y2="-11" stroke="#CFE8FF" strokeWidth="1.7" opacity="0.75" strokeLinecap="round"/><line x1="0" y1="0" x2="-14" y2="-6" stroke="#FFFFFF" strokeWidth="1.1" opacity="0.8" strokeLinecap="round"/><circle cx="0" cy="0" r="2.1" fill="#EAF4FF"/></g>
        {/* orbita izi (SymPy: rx=74, ry=41.4 — sayyora AYNAN shu ellipsda yuradi) */}
        <ellipse cx="170" cy="78" rx="74" ry="41.4" fill="none" stroke="rgba(255,238,210,0.26)" strokeWidth="1.1"/>
        {/* ORQA sayyora (yulduz ortida) */}
        <g className="lumo-orbit-back"><LumoPlanet/></g>
        {/* qizil mitti yulduz — 3D sfera */}
        <circle className="rd-glow" cx="170" cy="78" r="62" fill="url(#rdGlow)"/>
        <circle cx="170" cy="78" r="30" fill="url(#rdStar)"/>
        <path d="M147 60 A30 30 0 0 1 173 47" fill="none" stroke="#FFEBC8" strokeWidth="2.8" opacity="0.45" strokeLinecap="round"/>
        <circle cx="158" cy="70" r="4.6" fill="#C43A1E" opacity="0.35"/>
        <circle cx="181" cy="87" r="3.4" fill="#B02810" opacity="0.3"/>
        <circle cx="166" cy="92" r="2.6" fill="#A82810" opacity="0.3"/>
        {/* OLD sayyora (yulduz oldida) */}
        <g className="lumo-orbit-front"><LumoPlanet/></g>
      </g>
    </svg>
  </span>
);

// s14 — FINAL panel (4 savol ketma-ket) + FactCard
const Screen14 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s14;
  const items = c.items;
  const orders = React.useMemo(() => items.map((it) => it.kind === 'num' ? null : shuffleArr([0, 1, 2])), []);
  const audio = useAudio([
    brgSeg('s14', lang),
    { id: 's14_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [idx, setIdx] = useState(props.storedAnswer ? items.length : 0);
  const [picked, setPicked] = useState(null);
  const [val, setVal] = useState('');
  const [numLock, setNumLock] = useState(false);
  const [numState, setNumState] = useState(null);   // ekranda KO'RINADIGAN javob holati
  const [wrongSet, setWrongSet] = useState(() => new Set());   // shu savolda urinilgan xato variantlar
  const [hintMsg, setHintMsg] = useState(null);                // xato tahlili (savol almashmaydi)
  const numTriedRef = useRef(false);                           // raqamli savolda xato bo'lganmi (ball uchun)
  const [score, setScore] = useState(props.storedAnswer ? (props.storedAnswer.studentAnswer | 0) : 0);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const factRef = useRevealScroll(idx >= items.length, 500);
  const it = items[idx];
  const PASS = Math.ceil(items.length * 0.7); // 5 dan 4
  // NOTO'G'RI javob keyingi savolga O'TKAZMAYDI (metodist, 2026-08-04): bola shu savolda
  // qoladi, tahlilni oladi va qayta urinib ko'radi. Ball faqat BIRINCHI urinishda beriladi.
  const pick = (i) => {
    if (!canAct || picked !== null || idx >= items.length || wrongSet.has(i)) return;
    const isOk = orders[idx][i] === 0;
    if (isOk) {
      setPicked(i);
      if (wrongSet.size === 0) setScore(s => s + 1);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.audio.on_correct[lang]); }
      setTimeout(() => { setPicked(null); setWrongSet(new Set()); setHintMsg(null); setIdx(n => n + 1); }, 1500);
    } else {
      const n = new Set(wrongSet); n.add(i); setWrongSet(n);
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
      if (!numTriedRef.current) setScore(s => s + 1);
      setTimeout(() => { setVal(''); setNumLock(false); setNumState(null); setHintMsg(null); numTriedRef.current = false; setIdx(n => n + 1); }, 1700);
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
                {hintMsg && <p className="fade-up" style={{ margin: 0, color: T.ink2, fontSize: 'clamp(13px, 1.7vw, 15px)', textAlign: 'center' }}>{t(hintMsg)}</p>}
              </>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10 }}>
                  {orders[idx].map((k, i) => (
                    <button key={i} className={`option ${picked === i ? 'option-correct' : wrongSet.has(i) ? 'option-picked-wrong' : ''}`} disabled={!canAct || picked !== null || wrongSet.has(i)} onClick={() => pick(i)}
                      style={{ padding: 'clamp(10px, 1.6vw, 13px)', fontSize: 'clamp(13px, 1.7vw, 15px)', minHeight: 'clamp(46px, 6.5vw, 56px)' }}>
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
            <div className="frame-success fade-up">
              <Reaction state="correct" praise={lang === 'ru' ? `Верно: ${score} из ${items.length}` : `To'g'ri: ${items.length} tadan ${score} ta`}/>
            </div>
            <div className="d2-factcard fade-up" style={{ marginTop: 12 }}>
              <span className="d2-factcard-badge mono">{t(c.fact_badge)}</span>
              <div className="d2-fact-hero"><RedDwarfFig/></div>
              <p className="d2-factcard-txt">{t(c.fact_text)}</p>
            </div>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s15 — YAKUN
const Screen15 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s15;
  const audio = useAudio([
    { id: 's15_pay', text: S15_PAYOFF[lang], trigger: 'on_mount', waits_for: null },
    { id: 's15_sum', text: c.audio[lang], trigger: 'after_previous', waits_for: null }
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
        {/* 3 miltirovchi yulduz (grade2 yakun naqshi) */}
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
        {/* to'liq kenglikdagi bayram sahnasi (Lumo + ekipaj quvonadi) */}
        <div className="fade-up delay-1"><HookScene gathered/></div>
      </div>
    </Stage>
  );
};

// ============================================================
// KORNEVOY KOMPONENT (shablon: infrastructure_v1 / grade1 Dars28)
// ============================================================
export default function TensUnitsLesson({
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

  const screens = [Screen0, Screen1, Screen3, Screen4, Screen5, Screen6, ScreenMing, Screen7, Screen8, Screen9, Screen10, Screen11, ScreenCase, Screen14, Screen15];
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
.lm-mat-stack { display: flex; flex-flow: row wrap; align-items: center; justify-content: center; gap: clamp(3px, 0.8vw, 5px); max-width: 100%; }
/* ENERGIYA KONSOLI (slayd 3/9): razryad = belgi + ×son + qiymat + stepper. */
.lm-console { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(8px, 2vw, 14px); width: 100%; max-width: 440px; }
.lm-cons { display: flex; flex-direction: column; align-items: center; gap: clamp(5px, 1.2vw, 8px); padding: clamp(9px, 2vw, 14px) 4px; border-radius: 16px; background: #FBF7F0; box-shadow: inset 0 0 0 1px rgba(58,53,48,0.07); transition: box-shadow 0.28s, background 0.28s; }
.lm-cons-lit { background: #FFF6E9; box-shadow: 0 5px 16px -9px rgba(255,154,46,0.75), inset 0 0 0 1.5px rgba(255,154,46,0.5); }
.lm-cons-head { font-size: clamp(9px, 1.5vw, 11px); font-weight: 800; color: #8A8378; text-transform: uppercase; letter-spacing: 0.4px; }
.lm-cons-screen { display: flex; align-items: center; justify-content: center; gap: clamp(4px, 1.2vw, 8px); min-height: clamp(38px, 8.5vw, 50px); }
.lm-cons-ico { height: auto; transition: opacity 0.25s, filter 0.25s; }
.lm-cons-ico-h { width: clamp(30px, 7vw, 44px); }
.lm-cons-ico-t { width: clamp(38px, 8.5vw, 54px); }
.lm-cons-ico-o { width: clamp(18px, 4vw, 26px); }
.lm-cons:not(.lm-cons-lit) .lm-cons-ico { opacity: 0.26; }
/* Neutral: test-figurasida uch razryad TENG ko'rinadi — biriga ham aksent yo'q. */
.lm-cons-neutral .lm-cons:not(.lm-cons-lit) .lm-cons-ico { opacity: 0.72; }
.lm-cons-lit .lm-cons-ico { filter: drop-shadow(0 0 5px rgba(255,154,46,0.55)); }
.lm-cons-x { font-size: clamp(18px, 3.8vw, 26px); font-weight: 800; color: #3A3530; display: inline-block; animation: lm-cons-pop 0.3s ease; }
.lm-cons-x-dim { color: #C4BEB4; }
.lm-cons-val { font-family: 'JetBrains Mono', monospace; font-size: clamp(15px, 3vw, 20px); font-weight: 800; color: #FF4F28; }
.lm-cons-steps { display: flex; gap: clamp(5px, 1.3vw, 8px); margin-top: 2px; }
.lm-cons-btn { width: clamp(30px, 7vw, 40px); height: clamp(30px, 7vw, 40px); border-radius: 11px; border: none; background: #FFFFFF; box-shadow: 0 2px 8px -3px rgba(58,53,48,0.38); font-size: clamp(18px, 3.6vw, 23px); font-weight: 800; color: #5A5A60; cursor: pointer; transition: transform 0.12s, background 0.15s, opacity 0.15s; }
.lm-cons-btn-up { background: #FF4F28; color: #FFFFFF; }
.lm-cons-btn:disabled { opacity: 0.38; cursor: default; }
.lm-cons-btn:not(:disabled):active { transform: scale(0.92); }
@keyframes lm-cons-pop { 0% { transform: scale(0.65); } 55% { transform: scale(1.2); } 100% { transform: scale(1); } }
.lm-scene { position: relative; width: min(100%, calc(clamp(160px, calc(100dvh - 570px), 372px) * 400 / 210)); aspect-ratio: 400 / 210; margin-inline: auto; border-radius: 14px; overflow: hidden; }
/* QUVVAT XUJAYRASI qo'nishi: pastdagi manba tugmadan uchib chiqib, ustuniga yumshoq qo'nadi va bir marta yorishadi (sakrash yo'q, tartibli grid). */
.lm-dock { display: inline-flex; animation: lm-dock-a 0.52s cubic-bezier(0.3, 0.9, 0.35, 1) both, lm-dock-glow 0.75s ease 0.12s both; }
@keyframes lm-dock-a { 0% { opacity: 0; transform: translateY(16px) scale(0.84); } 66% { opacity: 1; transform: translateY(-2px) scale(1.05); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes lm-dock-glow { 0% { filter: drop-shadow(0 0 0 rgba(255,154,46,0)); } 52% { filter: drop-shadow(0 0 7px rgba(255,154,46,0.85)); } 100% { filter: drop-shadow(0 0 0 rgba(255,154,46,0)); } }
@media (prefers-reduced-motion: reduce) { .lm-reveal, .lm-write, .lm-drop, .lm-fadein, .lm-dock, .lm-cons-x { animation: none; } }
.lm-digtray { display: flex; gap: 10px; justify-content: center; min-height: 54px; align-items: center; }
.lm-digtray-empty { font-size: 22px; font-weight: 800; color: #C4BEB4; letter-spacing: 2px; }
.lm-digchip { display: inline-flex; align-items: center; justify-content: center; width: clamp(42px, 9vw, 56px); height: clamp(42px, 9vw, 56px); border: none; border-radius: 12px; background: #FFFFFF; font-size: clamp(22px, 4.6vw, 32px); font-weight: 800; color: #3A3530; cursor: pointer; box-shadow: 0 3px 10px -4px rgba(58,53,48,0.35); transition: transform 0.12s; }
.lm-digchip-sel { background: #FFF3E9; color: #ff4f28; transform: translateY(-3px); box-shadow: 0 6px 16px -5px rgba(255,79,40,0.55); }
.lm-bins { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(8px, 2vw, 14px); }
.lm-bin { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: clamp(10px, 2vw, 16px) 6px; border: none; border-radius: 14px; background: #FBF7F0; cursor: pointer; box-shadow: inset 0 0 0 1px rgba(58,53,48,0.07); transition: box-shadow 0.2s; }
.lm-bin-open { box-shadow: 0 4px 14px -6px rgba(255,79,40,0.4), inset 0 0 0 1.5px rgba(255,79,40,0.4); animation: lm-bin-pulse 1.1s ease-in-out infinite; }
@keyframes lm-bin-pulse { 0%, 100% { box-shadow: 0 4px 14px -6px rgba(255,79,40,0.4), inset 0 0 0 1.5px rgba(255,79,40,0.4); } 50% { box-shadow: 0 7px 18px -6px rgba(255,79,40,0.6), inset 0 0 0 2px rgba(255,79,40,0.65); } }
/* tap-to-bin mexanika ko'rsatmasi: 1) raqamni tanla -> 2) qutiga bos; bo'sh qutida «bu yerga» strelkasi. */
.lm-onhint { display: inline-flex; align-items: center; gap: 8px; align-self: center; background: #EAF6FB; border: 1px solid rgba(1,154,203,0.3); border-radius: 99px; padding: clamp(6px,1.2vw,9px) clamp(12px,2.2vw,18px); font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(12px,1.7vw,14px); color: #017BA3; transition: background 0.25s, color 0.25s, border-color 0.25s; }
.lm-onhint-2 { background: #FFF3E9; border-color: rgba(255,79,40,0.35); color: #C0392B; }
.lm-onhint-step { display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; flex-shrink: 0; border-radius: 50%; background: #017BA3; color: #FFF; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 800; }
.lm-onhint-2 .lm-onhint-step { background: #FF4F28; }
.lm-bin-cue { color: #FF4F28; font-size: clamp(20px,4vw,26px); font-weight: 800; animation: lm-cue-bounce 0.9s ease-in-out infinite; }
@keyframes lm-cue-bounce { 0%, 100% { transform: translateY(-2px); opacity: 0.55; } 50% { transform: translateY(2px); opacity: 1; } }
/* Slayd 10 DEMO (qo'l ko'rsatadi) — o'yin fazasidan ATAYIN farqli (ko'k «Ko'rsataman» vs to'q «Sening navbating»). */
.lm-demo-banner { align-self: center; background: #EAF6FB; color: #017BA3; border: 1.5px solid rgba(1,154,203,0.4); border-radius: 99px; padding: clamp(7px,1.4vw,10px) clamp(14px,2.6vw,20px); font-weight: 800; font-size: clamp(12px,1.8vw,15px); }
.lm-play-banner { align-self: center; background: #FFF3E9; color: #C0392B; border: 1.5px solid rgba(255,79,40,0.45); border-radius: 99px; padding: clamp(7px,1.4vw,10px) clamp(14px,2.6vw,20px); font-weight: 800; font-size: clamp(12px,1.8vw,15px); }
.lm-demo-wrap { position: relative; display: flex; flex-direction: column; align-items: center; gap: clamp(8px,1.8vw,12px); padding: clamp(10px,2vw,16px); border-radius: 18px; background: #F4FAFD; border: 1.5px dashed rgba(1,154,203,0.35); }
.lm-demo-cap { font-size: clamp(15px,3vw,20px); font-weight: 800; color: #017BA3; min-height: 1.4em; }
.lm-demo-cap-done { color: #1F7A4D; }
.lm-demo-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(8px,2vw,14px); width: 100%; max-width: 360px; }
.lm-demo-col { position: relative; display: flex; flex-direction: column; align-items: center; gap: clamp(8px,2vw,14px); }
.lm-demo-chipzone { position: relative; min-height: clamp(46px,10vw,60px); display: flex; align-items: center; justify-content: center; }
.lm-demo-chip { pointer-events: none; }
.lm-demo-chip-on { background: #FFF3E9; color: #FF4F28; transform: translateY(-3px); box-shadow: 0 6px 16px -5px rgba(255,79,40,0.55); }
.lm-demo-hand { position: absolute; left: 54%; font-size: clamp(22px,5vw,30px); pointer-events: none; z-index: 3; filter: drop-shadow(0 2px 3px rgba(0,0,0,0.28)); animation: dm-hand 2.8s ease-in-out both; }
@keyframes dm-hand { 0% { top: 16%; opacity: 0; } 8% { opacity: 1; } 14% { top: 20%; } 22% { top: 8%; } 30% { top: 20%; } 60% { top: 72%; } 68% { top: 60%; } 76% { top: 74%; } 100% { top: 72%; opacity: 1; } }
.lm-demo-drop { display: inline-block; animation: dm-drop 0.42s cubic-bezier(0.3,0.9,0.35,1) both; }
@keyframes dm-drop { 0% { transform: translateY(-16px); opacity: 0; } 62% { transform: translateY(2px); } 100% { transform: translateY(0); opacity: 1; } }
.lm-demo-replay { background: #FFFFFF; border: 1.5px solid #D8CFBF; border-radius: 99px; padding: clamp(8px,1.6vw,11px) clamp(14px,2.6vw,18px); font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(12px,1.6vw,14px); color: #5A5A60; cursor: pointer; transition: transform 0.12s; }
.lm-demo-replay:disabled { opacity: 0.4; cursor: default; }
.lm-demo-replay:not(:disabled):active { transform: scale(0.95); }
@media (prefers-reduced-motion: reduce) { .lm-demo-hand, .lm-demo-drop { animation: none; } }
/* Uchuvchi raqam — elastik «oborib qo'yish» (demo va mashqlarda). Absolute -> zoom-qatlamга chidamli. */
.lm-fly { position: absolute; z-index: 40; display: flex; align-items: center; justify-content: center; border-radius: 12px; background: #FFF3E9; color: #FF4F28; font-weight: 800; font-size: clamp(22px,4.6vw,32px); box-shadow: 0 8px 20px -6px rgba(255,79,40,0.6); pointer-events: none; animation: dm-fly 0.76s cubic-bezier(0.52, -0.28, 0.3, 1.35) forwards; }
@keyframes dm-fly { to { transform: translate(var(--fx, 0), var(--fy, 0)); } }
/* DEMO «275» aksenti — bola shu son yig'ilayotganini ko'radi; joylangan raqam yashil, joriysi to'q sariq. */
.lm-demo-goal { font-size: clamp(11px,1.6vw,13px); font-weight: 800; color: #017BA3; text-transform: uppercase; letter-spacing: 0.4px; }
.lm-demo-num { display: flex; gap: clamp(4px,1.2vw,8px); }
.lm-demo-num-d { font-size: clamp(30px,7vw,44px); font-weight: 800; color: #C4BEB4; border-radius: 10px; padding: 0 clamp(4px,1.2vw,8px); transition: color 0.3s, background 0.3s, transform 0.3s; }
.lm-demo-num-on { color: #FF4F28; background: #FFF3E9; transform: scale(1.08); animation: lm-cons-pop 0.4s ease; }
.lm-demo-num-done { color: #1F7A4D; }
.lm-demo-chip-gone { opacity: 0; }
@media (prefers-reduced-motion: reduce) { .lm-fly { animation: none; } }
/* 5s o'ylash soati (slayd 7). */
.lm-clock { display: flex; flex-direction: column; align-items: center; gap: clamp(6px,1.4vw,10px); }
.lm-clock-cap { font-size: clamp(13px,1.9vw,16px); font-weight: 800; color: #017BA3; }
/* Aksent savol (slayd 8 QOIDA — javob oldindan berilmasin). */
.lm-q-accent { align-self: center; background: #FFF3E9; color: #C0392B; border: 1.5px solid rgba(255,79,40,0.4); border-radius: 14px; padding: clamp(10px,2vw,14px) clamp(16px,3vw,24px); font-family: 'Fraunces', Georgia, serif; font-weight: 700; font-size: clamp(16px,2.6vw,20px); text-align: center; }
.lm-bin-full { background: #F1EDE5; }
.lm-bin-head { font-size: clamp(9px, 1.5vw, 11px); font-weight: 800; color: #8A8378; text-transform: uppercase; letter-spacing: 0.4px; }
.lm-bin-slot { width: clamp(36px, 8vw, 50px); height: clamp(40px, 9vw, 56px); display: flex; align-items: center; justify-content: center; border-radius: 10px; background: #FFFFFF; font-size: clamp(22px, 4.6vw, 32px); font-weight: 800; color: #3A3530; box-shadow: inset 0 0 0 1px rgba(58,53,48,0.06); }
.d2-factcard { display: flex; flex-direction: column; gap: 8px; background: #FFF3EC; border-left: 4px solid #FF4F28; border-radius: 14px; padding: clamp(10px, 2vw, 15px); }
.d2-factcard-badge { align-self: flex-start; color: #C23A1E; font-size: clamp(10px, 1.3vw, 12px); font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em; }
.d2-factcard-row { display: flex; align-items: center; gap: clamp(10px, 2.4vw, 18px); }
.d2-factfig { flex: 0 0 auto; display: inline-flex; }
.d2-factcard-txt { align-self: center; max-width: 46ch; text-align: center; color: #2A2622; font-size: clamp(13px, 1.8vw, 15px); line-height: 1.42; }
/* --- FactCard KENG kosmos-panel (frame chegarasigacha) + AYNAN orbitada 3D (SymPy: incl=56°, d=170, R=74) --- */
.d2-fact-hero { align-self: stretch; display: block; margin: 6px -16px 12px; }
.d2-fact-hero .d2-factfig { display: block; width: 100%; }
.d2-fact-hero .d2-factfig svg { display: block; width: 100%; height: auto; border-radius: 14px; box-shadow: 0 8px 22px -8px rgba(20,10,30,0.5); }
.lumo-orbit-front, .lumo-orbit-back { transform-box: view-box; transform-origin: 170px 78px; animation: 13s linear infinite; }
.lumo-orbit-front { animation-name: lumoOrbitFront; }
.lumo-orbit-back { animation-name: lumoOrbitBack; }
.rd-glow { transform-box: view-box; transform-origin: 170px 78px; animation: rdPulse 3.8s ease-in-out infinite; }
.star-tw { animation: starTw 2.8s ease-in-out infinite; }
.comet { transform-box: view-box; animation: cometDrift 10s linear infinite; }
@keyframes starTw { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
@keyframes cometDrift { 0% { transform: translate(30px,10px); opacity: 0; } 6% { opacity: 0.85; } 32% { opacity: 0.85; } 46% { transform: translate(250px,120px); opacity: 0; } 100% { transform: translate(250px,120px); opacity: 0; } }
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
@media (prefers-reduced-motion: reduce) { .lumo-orbit-front, .lumo-orbit-back, .rd-glow, .star-tw, .comet { animation: none; } .lumo-orbit-back, .comet { opacity: 0; } }
`;
