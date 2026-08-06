import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { BackLabel, BitSVG, Chiroq, Confetti, D2Defs, D2Motes, FREE_NAV, FeedbackBlock, FrameFx, GradientDefs, HeroContext, LUMO_CAST, LangContext, Lenta, NavBack, NavNext, NextLabel, Panel, ProgressContext, Reaction, ReadinessMeter, Stage, StageHero, T, configureLesson, getAudioEngine, npKey, shuffleArr, ttsConfig, useAdvanceGate, useAudio, useCanAnswer, useLang, useMobileZoom, usePrefersReducedMotion, useRevealScroll, useSfx, useT, makeBrgSeg } from './_kit/index.jsx';
import { BASE_STYLES } from './_kit/styles.js';

// ============================================================================
// DD 3-SINF | Dars06 — "Son o'qida son" (num-3-06) | B1 | katta shkala 0-1000
// Syujet: Bit sayyorasi LUMO, katta shkala (SYUJET_3SINF.md B1 d.6). Sonni son o'qida
//   joylash va belgi bo'yicha o'qish. Bit — mezbon-gid.
// Infra: grade3 Dars01.jsx (etalon nomzodi) dan BAYT-ANIQ ko'chirildi. O'zgarmadi.
// YADRO: katta belgi=yumaloq yuzlik, kichik=o'nlik(+10); sonni qadamlab topamiz, belgini o'qiymiz.
// MEXANIKA: recall tartib (s1), shkala tuzilishi (s2), joylash 470 (s3), o'qish 650 (s4),
//   QOIDA (s5), qaysi orasida MC (s6), belgi o'qish MC (s7), qaysi belgi A/B/C (s8),
//   modul masala (s9), final panel (s10), yakun (s11). NumLine (son o'qi).
// Misconception: M1 belgi noto'g'ri sanash, M2 yo'nalish, M3 qadam qiymati (100 vs 10), M4 yuzlik chalkash.
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
  lessonId: 'num-3-06',
  lessonTitle: { ru: 'Урок 6. Число на числовой прямой', uz: "6-dars. Son o'qida son" }
};
// STRUKTURA: 1–6 tushuntirish · 7–10 mashq · 11 final · 12 xulosa. Grade2 Dars01 etaloni yoyi,
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
// CONTENT — 3-sinf Dars06 «Son o'qida son» (num-3-06). RU + UZ to'liq.
// Audio TTS-toza: sonlar so'z bilan, «» va matematik belgilar yo'q, bir segment = bir fikr.
// Rekvizit: chiroq (birlik) · lenta = 10 chiroq (o'nlik) · panel = 10 lenta (yuzlik). Lumo shahri.
// ============================================================

const CONTENT = {
  // s0 — HOOK: son o'qi 300-800, 470 qaysi ikki yuzlik orasida
  s0: {
    eyebrow: { ru: 'Миссия', uz: 'Missiya' },
    topic: { ru: 'Тема: число на числовой прямой', uz: "Mavzu: son o'qida son" },
    lead: { ru: 'Большая шкала города от 300 до 800.', uz: "Shaharning katta shkalasi 300 dan 800 gacha." },
    n: 470, lo: 300, hi: 800,
    q: { ru: 'Между какими сотнями стоит 470?', uz: '470 qaysi yuzliklar orasida turadi?' },
    opt0: { ru: '400 и 500', uz: '400 va 500' },
    opt1: { ru: '300 и 400', uz: '300 va 400' },
    opt2: { ru: '500 и 600', uz: '500 va 600' },
    audio: {
      intro: {
        ru: [
          'Тема урока — число на числовой прямой. Научимся находить место числа на большой шкале.',
          'В прошлой области мы округляли числа. Теперь Бит показывает большую шкалу города.',
          'Шкала идёт от трёхсот до восьмисот. Большие метки это сотни. На шкале стоит число четыреста семьдесят.',
          'Как думаешь, между какими сотнями оно стоит? Выбери вариант.'
        ],
        uz: [
          "Dars mavzusi — son o'qida son. Sonning katta shkaladagi o'rnini topishni o'rganamiz.",
          "O'tgan hududda sonlarni yaxlitladik. Endi Bit shaharning katta shkalasini ko'rsatadi.",
          "Shkala uch yuzdan sakkiz yuzgacha. Katta belgilar bu yuzliklar. Shkalada to'rt yuz yetmish soni turadi.",
          "Sizningcha, u qaysi yuzliklar orasida turadi? Variantni tanlang."
        ]
      },
      on_correct: { ru: 'Верно. Четыреста семьдесят стоит между четырьмястами и пятьюстами.', uz: "To'g'ri. To'rt yuz yetmish to'rt yuz bilan besh yuz orasida turadi." },
      on_wrong: { ru: 'Смотри на сотни слева и справа от числа. Проверим вместе.', uz: "Sonning chap va o'ngidagi yuzliklarga qarang. Birga tekshiramiz." }
    }
  },

  // s1 — RECALL: o'qda tartib
  s1: {
    eyebrow: { ru: 'Вспомним и откроем', uz: 'Eslaymiz va ochamiz' },
    lead: { ru: 'На прямой числа стоят по порядку.', uz: "O'qda sonlar tartib bilan turadi." },
    audio: {
      ru: [
        'Вспомним. На числовой прямой числа стоят по порядку. Чем правее, тем больше.',
        'Слева меньшие числа, справа большие. Между двумя метками всегда есть числа поменьше и побольше.'
      ],
      uz: [
        "Eslaymiz. Son o'qida sonlar tartib bilan turadi. Qancha o'ngda bo'lsa, shuncha katta.",
        "Chapda kichik sonlar, o'ngda katta sonlar. Ikki belgi orasida doim kichikroq va kattaroq sonlar bor."
      ]
    }
  },

  // s2 — SHKALA tuzilishi: katta belgi=yuzlik, kichik=o'nlik
  s2: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: { ru: 'Большие метки — сотни, маленькие — десятки.', uz: "Katta belgilar — yuzliklar, kichiklari — o'nliklar." },
    lo: 300, hi: 500,
    audio: {
      ru: [
        'Посмотрим на шкалу от трёхсот до пятисот. Большие метки это круглые сотни.',
        'Между сотнями стоят маленькие метки, это десятки. От метки до метки один шаг это десять.'
      ],
      uz: [
        "Uch yuzdan besh yuzgacha shkalaga qaraymiz. Katta belgilar bu yumaloq yuzliklar.",
        "Yuzliklar orasida kichik belgilar turadi, bu o'nliklar. Belgidan belgigacha bitta qadam bu o'n."
      ]
    }
  },

  // s3 — JOYLASH: 470 ni topish (400 + 7 qadam)
  s3: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: { ru: 'Найдём место числа 470.', uz: "470 sonining o'rnini topamiz." },
    n: 470, lo: 300, hi: 800,
    done_text: { ru: 'Один большой шаг до четырёхсот, потом семь маленьких по десять — четыреста семьдесят.', uz: "Bir katta qadam to'rt yuzga, keyin yetti kichik qadam o'ndan — to'rt yuz yetmish." },
    audio: {
      ru: [
        'Найдём четыреста семьдесят. Начинаем от левого края шкалы.',
        'Делаем большие шаги по сто. Доходим до четырёхсот.',
        'Потом семь маленьких шагов по десять. Доходим до четырёхсот семидесяти. Вот его место, между четырьмястами и пятьюстами.'
      ],
      uz: [
        "To'rt yuz yetmishni topamiz. Shkalaning chap chekkasidan boshlaymiz.",
        "Yuzdan katta qadamlar qo'yamiz. To'rt yuzga yetamiz.",
        "Keyin yetti kichik qadam o'ndan. To'rt yuz yetmishga yetamiz. Mana uning o'rni, to'rt yuz bilan besh yuz orasida."
      ]
    }
  },

  // s4 — O'QISH: belgi 650 da, bu qaysi son
  s4: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: { ru: 'Прочитаем число по метке.', uz: "Belgi bo'yicha sonni o'qiymiz." },
    n: 650, lo: 400, hi: 900,
    done_text: { ru: 'Метка стоит на шестистах и ещё пять десятков — это шестьсот пятьдесят.', uz: "Belgi olti yuzda va yana besh o'nlik — bu olti yuz ellik." },
    audio: {
      ru: [
        'Теперь наоборот. Метка уже стоит на шкале, а число надо прочитать.',
        'Смотрим, где метка. Она прошла шестьсот и стоит на пятом маленьком шаге.',
        'Пять шагов по десять это пятьдесят. Значит метка показывает шестьсот пятьдесят.'
      ],
      uz: [
        "Endi teskari. Belgi shkalada turibdi, sonni esa o'qish kerak.",
        "Belgi qayerda ekaniga qaraymiz. U olti yuzdan o'tib, beshinchi kichik qadamda turibdi.",
        "Beshta qadam o'ndan bu ellik. Demak belgi olti yuz ellikni ko'rsatadi."
      ]
    }
  },

  // s5 — QOIDA
  s5: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    rule: { ru: 'Большие метки — круглые сотни, между ними маленькие метки десятков. Число ищем шагами: сотни большими шагами, десятки маленькими.', uz: "Katta belgilar — yumaloq yuzliklar, ular orasida o'nlik belgilari. Sonni qadamlab topamiz: yuzlik katta qadam, o'nlik kichik qadam." },
    n: 340, lo: 300, hi: 500,
    check_q: { ru: 'Между какими сотнями стоит 340? Нажми верный ответ.', uz: '340 qaysi yuzliklar orasida? To\'g\'ri javobni bosing.' },
    check_opts: ['300 и 400', '400 и 500'],
    check_opts_uz: ['300 va 400', '400 va 500'],
    check_ci: 0,
    check_ok: { ru: 'Верно! 340 стоит между тремястами и четырьмястами.', uz: "To'g'ri! 340 uch yuz bilan to'rt yuz orasida turadi." },
    check_no: { ru: 'Сотни у 340 это три, значит между 300 и 400.', uz: "340 da yuzlik uch, demak 300 bilan 400 orasida." },
    audio: {
      ru: [
        'Отлично, теперь запомним правило числовой прямой.',
        'Большие метки это круглые сотни. Между ними маленькие метки, это десятки. Один маленький шаг это десять.',
        'Чтобы найти число, идём шагами. Сначала большими шагами по сотне, потом маленькими по десятку.',
        'А чтобы прочитать метку, смотрим, сколько сотен и сколько десятков она прошла. А теперь сам. Между какими сотнями стоит триста сорок?'
      ],
      uz: [
        "Zo'r, endi son o'qi qoidasini eslab qolamiz.",
        "Katta belgilar bu yumaloq yuzliklar. Ular orasida kichik belgilar, bu o'nliklar. Bitta kichik qadam bu o'n.",
        "Sonni topish uchun qadamlab boramiz. Avval yuzdan katta qadam, keyin o'ndan kichik qadam.",
        "Belgini o'qish uchun esa u nechta yuzlik va nechta o'nlik o'tganiga qaraymiz. Endi o'zingiz. Uch yuz qirq qaysi yuzliklar orasida?"
      ]
    }
  },

  // s6 — MASHQ qaysi orasida (MC), 3 raund
  s6: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    q: { ru: 'Между какими сотнями стоит число?', uz: 'Son qaysi yuzliklar orasida turadi?' },
    items: [
      {
        num: 380, lo: 200, hi: 600, ci: 0,
        opts: [{ ru: '300 и 400', uz: '300 va 400' }, { ru: '400 и 500', uz: '400 va 500' }, { ru: '200 и 300', uz: '200 va 300' }],
        hints: {
          1: { ru: 'Сотни у 380 это три, значит между 300 и 400.', uz: "380 da yuzlik uch, demak 300 bilan 400 orasida." },
          2: { ru: 'Триста восемьдесят больше трёхсот, значит правее.', uz: "Uch yuz sakson uch yuzdan katta, demak o'ngroqda." }
        }
      },
      {
        num: 720, lo: 600, hi: 900, ci: 0,
        opts: [{ ru: '700 и 800', uz: '700 va 800' }, { ru: '600 и 700', uz: '600 va 700' }, { ru: '800 и 900', uz: '800 va 900' }],
        hints: {
          1: { ru: 'Сотни у 720 это семь, значит между 700 и 800.', uz: "720 da yuzlik yetti, demak 700 bilan 800 orasida." },
          2: { ru: 'Семьсот двадцать чуть больше семисот.', uz: "Yetti yuz yigirma yetti yuzdan sal katta." }
        }
      },
      {
        num: 540, lo: 400, hi: 700, ci: 0,
        opts: [{ ru: '500 и 600', uz: '500 va 600' }, { ru: '400 и 500', uz: '400 va 500' }, { ru: '600 и 700', uz: '600 va 700' }],
        hints: {
          1: { ru: 'Сотни у 540 это пять, значит между 500 и 600.', uz: "540 da yuzlik besh, demak 500 bilan 600 orasida." },
          2: { ru: 'Пятьсот сорок больше пятисот.', uz: "Besh yuz qirq besh yuzdan katta." }
        }
      }
    ],
    audio: {
      intro: { ru: 'Смотри, где стоит метка, и выбери, между какими сотнями число. Три задания.', uz: "Belgi qayerda turganiga qara va son qaysi yuzliklar orasida ekanini tanla. Uchta topshiriq." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Смотри на цифру сотен числа. Попробуй ещё.', uz: "Sonning yuzlik raqamiga qara. Yana urinib ko'ring." }
    }
  },

  // s7 — MASHQ belgini o'qish (MC), 3 raund
  s7: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    q: { ru: 'Какое число показывает метка?', uz: "Belgi qaysi sonni ko'rsatadi?" },
    items: [
      {
        num: 250, lo: 100, hi: 500, ci: 0,
        opts: [{ ru: '250', uz: '250' }, { ru: '200', uz: '200' }, { ru: '350', uz: '350' }],
        hints: {
          1: { ru: 'Метка прошла двести и ещё пять десятков — это 250.', uz: "Belgi ikki yuzdan o'tib yana besh o'nlik — bu 250." },
          2: { ru: 'Сотни у метки две, а не три: 250.', uz: "Belgida yuzlik ikkita, uch emas: 250." }
        }
      },
      {
        num: 630, lo: 400, hi: 900, ci: 0,
        opts: [{ ru: '630', uz: '630' }, { ru: '600', uz: '600' }, { ru: '730', uz: '730' }],
        hints: {
          1: { ru: 'Метка прошла шестьсот и ещё три десятка — это 630.', uz: "Belgi olti yuzdan o'tib yana uch o'nlik — bu 630." },
          2: { ru: 'Сотни у метки шесть, а не семь: 630.', uz: "Belgida yuzlik oltita, yetti emas: 630." }
        }
      },
      {
        num: 480, lo: 300, hi: 700, ci: 0,
        opts: [{ ru: '480', uz: '480' }, { ru: '400', uz: '400' }, { ru: '580', uz: '580' }],
        hints: {
          1: { ru: 'Метка прошла четыреста и ещё восемь десятков — это 480.', uz: "Belgi to'rt yuzdan o'tib yana sakkiz o'nlik — bu 480." },
          2: { ru: 'Сотни у метки четыре, а не пять: 480.', uz: "Belgida yuzlik to'rtta, besh emas: 480." }
        }
      }
    ],
    audio: {
      intro: { ru: 'Метка стоит на шкале. Прочитай, какое это число. Три задания.', uz: "Belgi shkalada turibdi. Bu qaysi son ekanini o'qi. Uchta topshiriq." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Считай сотни и десятки, которые прошла метка.', uz: "Belgi o'tgan yuzlik va o'nliklarni sana." }
    }
  },

  // s8 — MASHQ qaysi belgi (A/B/C), 3 raund
  s8: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    q: { ru: 'На какой метке стоит число?', uz: 'Son qaysi belgida turadi?' },
    items: [
      {
        target: 560, lo: 500, hi: 620, ci: 1,
        cands: [{ k: 'A', v: 520 }, { k: 'B', v: 560 }, { k: 'C', v: 610 }],
        opts: [{ ru: 'A', uz: 'A' }, { ru: 'B', uz: 'B' }, { ru: 'C', uz: 'C' }],
        hints: {
          0: { ru: 'Метка A стоит на 520, а нам нужно 560.', uz: "A belgisi 520 da, bizga 560 kerak." },
          2: { ru: 'Метка C стоит на 610, это больше 560.', uz: "C belgisi 610 da, bu 560 dan katta." }
        }
      },
      {
        target: 340, lo: 300, hi: 460, ci: 0,
        cands: [{ k: 'A', v: 340 }, { k: 'B', v: 390 }, { k: 'C', v: 440 }],
        opts: [{ ru: 'A', uz: 'A' }, { ru: 'B', uz: 'B' }, { ru: 'C', uz: 'C' }],
        hints: {
          1: { ru: 'Метка B стоит на 390, это больше 340.', uz: "B belgisi 390 da, bu 340 dan katta." },
          2: { ru: 'Метка C стоит на 440, это больше 340.', uz: "C belgisi 440 da, bu 340 dan katta." }
        }
      },
      {
        target: 800, lo: 680, hi: 820, ci: 2,
        cands: [{ k: 'A', v: 700 }, { k: 'B', v: 750 }, { k: 'C', v: 800 }],
        opts: [{ ru: 'A', uz: 'A' }, { ru: 'B', uz: 'B' }, { ru: 'C', uz: 'C' }],
        hints: {
          0: { ru: 'Метка A стоит на 700, а нам нужно 800.', uz: "A belgisi 700 da, bizga 800 kerak." },
          1: { ru: 'Метка B стоит на 750, это меньше 800.', uz: "B belgisi 750 da, bu 800 dan kichik." }
        }
      }
    ],
    audio: {
      intro: { ru: 'Три метки на шкале: A, B и C. Выбери, на какой стоит число. Три задания.', uz: "Shkalada uchta belgi: A, B va C. Son qaysi belgida turganini tanla. Uchta topshiriq." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Сравни число с каждой меткой. Попробуй ещё.', uz: "Sonni har belgi bilan solishtir. Yana urinib ko'ring." }
    }
  },

  // s9 — MASALA (case): Zuhra belgini o'qiydi (bir raund MC)
  s9: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    lead: { ru: 'Зухра нашла модуль на шкале города.', uz: 'Zuhra shahar shkalasida modulni topdi.' },
    num: 570, lo: 400, hi: 800, ci: 0,
    q: { ru: 'Какое число показывает метка модуля?', uz: "Modul belgisi qaysi sonni ko'rsatadi?" },
    opts: [{ ru: '570', uz: '570' }, { ru: '500', uz: '500' }, { ru: '670', uz: '670' }],
    hints: {
      1: { ru: 'Метка прошла пятьсот и ещё семь десятков — это 570.', uz: "Belgi besh yuzdan o'tib yana yetti o'nlik — bu 570." },
      2: { ru: 'Сотни у метки пять, а не шесть: 570.', uz: "Belgida yuzlik besh, olti emas: 570." }
    },
    setup_audio: { ru: 'Зухра нашла модуль на большой шкале города. Метка стоит между пятьюстами и шестьюстами.', uz: "Zuhra shaharning katta shkalasida modulni topdi. Belgi besh yuz bilan olti yuz orasida turibdi." },
    audio: {
      intro: { ru: 'Прочитай, какое число показывает метка модуля. Выбери верный ответ.', uz: "Modul belgisi qaysi sonni ko'rsatishini o'qi. To'g'ri javobni tanla." },
      on_correct: { ru: 'Верно. Пятьсот и семь десятков — пятьсот семьдесят.', uz: "To'g'ri. Besh yuz va yetti o'nlik — besh yuz yetmish." },
      on_wrong: { ru: 'Считай сотни и десятки метки: пятьсот и семьдесят.', uz: "Belgining yuzlik va o'nligini sana: besh yuz va yetmish." }
    }
  },

  // s10 — FINAL panel (5 savol) + FactCard
  s10: {
    eyebrow: { ru: 'Финал', uz: 'Final' },
    intro_line: { ru: 'Городской компьютер проверит тебя. Пять заданий.', uz: "Shahar kompyuteri sizni tekshiradi. Beshta topshiriq." },
    items: [
      {
        kind: 'mc',
        q: { ru: 'Между какими сотнями стоит 630?', uz: '630 qaysi yuzliklar orasida?' },
        opt0: { ru: '600 и 700', uz: '600 va 700' },
        opt1: { ru: '500 и 600', uz: '500 va 600' },
        opt2: { ru: '700 и 800', uz: '700 va 800' },
        wrong_1: { ru: 'Сотни у 630 шесть, значит между 600 и 700.', uz: "630 da yuzlik olti, demak 600 bilan 700 orasida." },
        wrong_2: { ru: 'Шестьсот тридцать чуть больше шестисот.', uz: "Olti yuz o'ttiz olti yuzdan sal katta." }
      },
      {
        kind: 'num', ans: 500,
        q: { ru: 'Какая круглая сотня стоит сразу после 460?', uz: "460 dan keyingi yumaloq yuzlik qaysi son?" },
        hint: { ru: 'Следующая метка сотен после четырёхсот шестидесяти это пятьсот.', uz: "To'rt yuz oltmishdan keyingi yuzlik belgisi bu besh yuz." }
      },
      {
        kind: 'mc',
        q: { ru: 'Какое число показывает метка на 250?', uz: '250 dagi belgi qaysi sonni ko\'rsatadi?' },
        opt0: { ru: '250', uz: '250' },
        opt1: { ru: '200', uz: '200' },
        opt2: { ru: '350', uz: '350' },
        wrong_1: { ru: 'Метка прошла двести и ещё пять десятков — 250.', uz: "Belgi ikki yuzdan o'tib besh o'nlik — 250." },
        wrong_2: { ru: 'Сотни у метки две, а не три.', uz: "Belgida yuzlik ikkita, uch emas." }
      },
      {
        kind: 'num', ans: 700,
        q: { ru: 'Какая круглая сотня стоит прямо перед 730?', uz: "730 dan oldingi yumaloq yuzlik qaysi son?" },
        hint: { ru: 'Метка сотен слева от семисот тридцати это семьсот.', uz: "Yetti yuz o'ttizning chapidagi yuzlik belgisi bu yetti yuz." }
      },
      {
        kind: 'num', ans: 280,
        q: { ru: 'Загадка. Я стою между 200 и 300, оканчиваюсь на ноль, а десятков у меня восемь. Кто я?', uz: "Jumboq. Men 200 bilan 300 orasidaman, nol bilan tugayman, o'nligim sakkiz. Men kimman?" },
        hint: { ru: 'Двести и восемь десятков, единиц нет — двести восемьдесят.', uz: "Ikki yuz va sakkiz o'nlik, birlik yo'q — ikki yuz sakson." }
      }
    ],
    fact_badge: { ru: 'Знаешь?', uz: 'Bilasizmi?' },
    fact_text: { ru: 'Вокруг красных карликов тоже есть планеты. Учёные ищут там воду и жизнь, ведь такие звёзды живут очень долго.', uz: "Qizil mitti yulduzlar atrofida ham sayyoralar bor. Olimlar u yerdan suv va hayot izlaydi, chunki bunday yulduzlar juda uzoq yashaydi." },
    fact_audio: { ru: 'Вокруг красных карликов тоже есть планеты. Учёные ищут там воду и жизнь, ведь такие звёзды живут очень долго.', uz: "Qizil mitti yulduzlar atrofida ham sayyoralar bor. Olimlar u yerdan suv va hayot izlaydi, chunki bunday yulduzlar juda uzoq yashaydi." },
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
    mission_done: { ru: 'Большая шкала города прочитана!', uz: "Shaharning katta shkalasi o'qildi!" },
    cando: { ru: 'Теперь ты находишь место числа на прямой и читаешь число по метке.', uz: "Endi siz sonning o'qdagi o'rnini topasiz va belgi bo'yicha sonni o'qiysiz." },
    rule_recap: { ru: 'Большие метки — сотни, маленькие — десятки. Число ищем шагами: сотни большими, десятки маленькими.', uz: "Katta belgilar — yuzliklar, kichiklari — o'nliklar. Sonni qadamlab topamiz: yuzlik katta, o'nlik kichik qadam." },
    conn_label_refs: { ru: 'Опирается на', uz: 'Tayanadi' },
    conn_refs: { ru: 'пятый урок: округление чисел', uz: "beshinchi dars: sonlarni yaxlitlash" },
    conn_label_next: { ru: 'Дальше', uz: 'Keyingi' },
    conn_next: { ru: 'Урок 7: письменное сложение и вычитание до 10000', uz: "7-dars: 10000 gacha yozma qo'shish va ayirish" },
    audio: {
      ru: 'Большая шкала города прочитана. Мы научились находить место числа на числовой прямой и читать число по метке. Запомни. Большие метки это круглые сотни, а маленькие между ними это десятки. Чтобы найти число, идём большими шагами по сотне и маленькими по десятку. В следующий раз научимся складывать и вычитать большие числа столбиком, до десяти тысяч.',
      uz: "Shaharning katta shkalasi o'qildi. Biz sonning son o'qidagi o'rnini topishni va belgi bo'yicha sonni o'qishni o'rgandik. Yodda tuting. Katta belgilar bu yumaloq yuzliklar, ular orasidagi kichiklari esa o'nliklar. Sonni topish uchun yuzdan katta va o'ndan kichik qadam qo'yamiz. Keyingi safar katta sonlarni ustunda qo'shish va ayirishni o'rganamiz, o'n minggacha."
    }
  }
};

// slaydlararo ko'priklar (audio-intro boshiga; ekranda ko'rinmaydi). TTS-toza.
const BRIDGES = {
  s1:  { ru: 'Вспомним про порядок.', uz: 'Tartibni eslaymiz.' },
  s2:  { ru: 'Разберём метки шкалы.', uz: 'Shkala belgilarini ko\'ramiz.' },
  s3:  { ru: 'Найдём число на прямой.', uz: "Sonni o'qda topamiz." },
  s4:  { ru: 'А теперь прочитаем метку.', uz: 'Endi belgini o\'qiymiz.' },
  s5:  { ru: 'Запишем это правилом.', uz: 'Buni qoida qilib olamiz.' },
  s6:  { ru: 'Правило знаем. Ищи сам.', uz: "Qoidani bilamiz. O'zingiz toping." },
  s7:  { ru: 'Теперь читай метки.', uz: 'Endi belgilarni o\'qing.' },
  s8:  { ru: 'Выбери верную метку.', uz: 'To\'g\'ri belgini tanlang.' },
  s9:  { ru: 'Зухра нашла модуль на шкале.', uz: 'Zuhra shkaladan modul topdi.' },
  s10: { ru: 'Городской компьютер сделает финальную проверку.', uz: 'Shahar kompyuteri yakuniy tekshiradi.' },
  s11: { ru: 'Шкала прочитана. Идём дальше!', uz: 'Shkala o\'qildi. Davom etamiz!' }
};

// s11 payoff (xulosadan oldin aytiladi)
const S11_PAYOFF = {
  ru: 'Миссия выполнена! Мы научились читать большую шкалу города и находить место любого числа, и Бит открыл нам её. Спасибо за помощь!',
  uz: "Missiya bajarildi! Biz shaharning katta shkalasini o'qishni va har qanday sonning o'rnini topishni o'rgandik, va Bit uni bizga ochdi. Yordamingiz uchun rahmat!"
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
      <SkywayBg/>
      <div className="lm-scene-cast">
        {LUMO_CAST.slice(0, 2).map(kid)}
        <span className={`lm-crew lm-crew-host ${gathered ? 'd2-bit-cheer' : 'lm-bob'}`}><span className="g1-cast-fig"><BitSVG state={gathered ? 'happy' : 'present'}/></span></span>
        {LUMO_CAST.slice(2).map((c, i) => kid(c, i + 2))}
      </div>
    </div>
  );
};




// ============================================================
// EKRANLAR — Dars06 «Son o'qida son» (katta shkala)
// ============================================================



// --- YORUG' MONORELS SAHNASI (D06): osma rels + yuzlik bekatlar + 470 marker
const SkywayBg = () => (
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

    <text x="200" y="108" textAnchor="middle" fontSize="8" letterSpacing="2" fill="#6B5636" fontFamily="'JetBrains Mono', monospace">SON O'QI</text>
    {/* raqamlar rels ustida (ekipaj yopmasin) */}
    {[['300', 40], ['400', 104], ['500', 168], ['600', 232], ['700', 296], ['800', 360]].map(([n, x], i) => (
      <text key={`sl${i}`} x={x} y="124" textAnchor="middle" fontSize="8" fontWeight="700" fill="#5E86A2" fontFamily="'JetBrains Mono', monospace">{n}</text>
    ))}
    <line x1="40" y1="140" x2="360" y2="140" stroke="#8FA6B8" strokeWidth="3" strokeLinecap="round"/>
    <line x1="40" y1="140" x2="360" y2="140" stroke="#CFE8FF" strokeWidth="1" opacity="0.6"/>
    {[40, 104, 168, 232, 296, 360].map((x, i) => (
      <g key={`s${i}`}><rect x={x - 1.5} y="140" width="3" height="12" fill="#9A855C"/><circle cx={x} cy="140" r="4" fill="#E4D3AC" stroke="#8A7550" strokeWidth="1"/></g>
    ))}
    {/* vagon 500 da */}
    <g transform="translate(168 122)"><rect x="-20" y="0" width="40" height="15" rx="6" fill="url(#shPanel)" stroke="#3E6E90" strokeWidth="1.2"/><rect x="-15" y="3" width="30" height="6" rx="3" fill="#8FE0F4" opacity="0.5"/><circle cx="-10" cy="15" r="2.4" fill="#5E86A2"/><circle cx="10" cy="15" r="2.4" fill="#5E86A2"/><path d="M0 -2 V-8" stroke="#9FB3BF" strokeWidth="2"/><circle className="lm-glow" cx="0" cy="-9" r="2.6" fill="#FF6A4A"/></g>
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
      <SkywayBg/>
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

// --- SON O'QI: yumaloq yuzliklar katta belgi, o'nliklar kichik. marker/anim/cands/hideVal.
const NumLine = ({ lo, hi, marker = null, anim = 2, cands = null, hideVal = false }) => {
  const W = 340, pad = 28, y = 54;
  const xp = (v) => pad + ((v - lo) / (hi - lo)) * (W - 2 * pad);
  const hundreds = []; for (let v = lo; v <= hi; v += 100) hundreds.push(v);
  const tens = []; for (let v = lo; v <= hi; v += 10) { if (v % 100 !== 0) tens.push(v); }
  const floorH = marker != null ? Math.floor(marker / 100) * 100 : lo;
  const pos = marker == null ? lo : (anim >= 2 ? marker : anim >= 1 ? floorH : lo);
  return (
    <svg viewBox={`0 0 ${W} 78`} style={{ width: 'min(340px, 99%)', height: 'auto' }} aria-hidden="true">
      <line x1={xp(lo)} y1={y} x2={xp(hi)} y2={y} stroke={T.ink3} strokeWidth="2"/>
      {tens.map((v) => <line key={v} x1={xp(v)} y1={y - 4} x2={xp(v)} y2={y + 4} stroke={T.ink3} strokeWidth="1.4"/>)}
      {hundreds.map((v) => (
        <g key={v}>
          <line x1={xp(v)} y1={y - 8} x2={xp(v)} y2={y + 8} stroke={T.ink2} strokeWidth="2.4"/>
          <text x={xp(v)} y={y + 22} textAnchor="middle" fontSize="11" fontWeight="800" fill={T.ink2} fontFamily="'JetBrains Mono', monospace">{v}</text>
        </g>
      ))}
      {cands && cands.map((cc) => (
        <g key={cc.k}>
          <line x1={xp(cc.v)} y1={y - 20} x2={xp(cc.v)} y2={y} stroke={T.accent} strokeWidth="2.4"/>
          <path d={`M ${xp(cc.v) - 5} ${y - 20} L ${xp(cc.v) + 5} ${y - 20} L ${xp(cc.v)} ${y - 13} Z`} fill={T.accent}/>
          <text x={xp(cc.v)} y={y - 24} textAnchor="middle" fontSize="12" fontWeight="800" fill={T.accent} fontFamily="'JetBrains Mono', monospace">{cc.k}</text>
        </g>
      ))}
      {marker != null && !cands && (
        <g style={{ transform: `translateX(${xp(pos) - xp(lo)}px)`, transition: 'transform 0.7s cubic-bezier(0.34, 1.2, 0.4, 1)' }}>
          {!hideVal && <text x={xp(lo)} y={y - 16} textAnchor="middle" fontSize="14" fontWeight="800" fill={T.accent} fontFamily="'JetBrains Mono', monospace">{pos}</text>}
          <line x1={xp(lo)} y1={y - 12} x2={xp(lo)} y2={y} stroke={T.accent} strokeWidth="2.6"/>
          <circle cx={xp(lo)} cy={y} r="6" fill={T.accent}/>
        </g>
      )}
    </svg>
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
            <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(10px, 2vw, 14px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
              <FrameFx/>
              {renderFig(it)}
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(90px, 1fr))`, gap: 10, width: '100%' }}>
                {it.opts.map((o, i) => (
                  <button key={i} className={`option ${okPick === i ? 'option-correct' : ''} ${wrongSet.has(i) ? 'option-picked-wrong' : ''}`} disabled={!canAct || okPick !== null || wrongSet.has(i)} onClick={() => pick(i)}
                    style={{ padding: 'clamp(10px, 1.6vw, 13px)', fontSize: 'clamp(15px, 2.2vw, 19px)', minHeight: 'clamp(46px, 6.5vw, 56px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>{t(o)}</button>
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

// s0 — HOOK: 470 qaysi ikki yuzlik orasida
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
        <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(16px, 3vw, 24px)' }}>
          <NumLine lo={c.lo} hi={c.hi} marker={c.n} anim={2}/>
        </div>
        <p className="fade-up delay-1" style={{ textAlign: 'center', color: T.ink2, fontWeight: 600, fontSize: 'clamp(14px, 1.9vw, 17px)', margin: 0 }}>{t(c.q)}</p>
        {picked === null && (
          <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {opts.map((o, i) => (
              <button key={i} className="option" disabled={!canAct} onClick={() => pick(i)}
                style={{ padding: 'clamp(10px, 1.5vw, 12px)', fontSize: 'clamp(14px, 2vw, 17px)', minHeight: 'clamp(48px, 7vw, 58px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>
                {t(o)}
              </button>
            ))}
          </div>
        )}
        {picked !== null && (
          <div className="fade-up" style={{ display: 'flex', justifyContent: 'center' }}>
            <button className={`option ${ok ? 'option-correct' : 'option-picked-wrong'}`} disabled
              style={{ padding: 'clamp(10px, 1.5vw, 12px) clamp(16px, 2.4vw, 22px)', fontSize: 'clamp(14px, 2vw, 17px)', minHeight: 'clamp(46px, 6.5vw, 56px)', width: 'auto', display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>
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
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 'clamp(16px, 3vw, 24px)', minHeight: 'clamp(150px, 32vw, 200px)' }}>
          <NumLine lo={100} hi={600}/>
          {reached >= 1 && (
            <div className="lm-reveal" style={{ display: 'flex', justifyContent: 'space-between', width: 'min(300px, 90%)' }}>
              <span className="mono" style={{ fontSize: 'clamp(12px, 1.8vw, 14px)', color: T.blue, fontWeight: 800 }}>{lang === 'ru' ? '← меньше' : "← kichik"}</span>
              <span className="mono" style={{ fontSize: 'clamp(12px, 1.8vw, 14px)', color: '#C0392B', fontWeight: 800 }}>{lang === 'ru' ? 'больше →' : "katta →"}</span>
            </div>
          )}
        </div>
      </div>
    </Stage>
  );
};

// s2 — SHKALA tuzilishi
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
          <NumLine lo={c.lo} hi={c.hi}/>
          {reached >= 1 && (
            <div className="lm-reveal" style={{ display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 3, height: 18, background: T.ink2, borderRadius: 2 }}/><span className="mono" style={{ fontSize: 'clamp(11px, 1.6vw, 13px)', color: T.ink2, fontWeight: 700 }}>{lang === 'ru' ? 'сотни' : 'yuzlik'}</span></span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 2, height: 10, background: T.ink3, borderRadius: 2 }}/><span className="mono" style={{ fontSize: 'clamp(11px, 1.6vw, 13px)', color: T.ink2, fontWeight: 700 }}>{lang === 'ru' ? 'десятки (+10)' : "o'nlik (+10)"}</span></span>
            </div>
          )}
        </div>
      </div>
    </Stage>
  );
};

// s3 — JOYLASH (animated)
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
  const anim = reached >= 2 ? 2 : reached >= 1 ? 1 : 0;
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
        <div className="frame fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', padding: 'clamp(18px, 3.4vw, 28px)', minHeight: 'clamp(150px, 32vw, 200px)', alignItems: 'center' }}>
          <NumLine lo={c.lo} hi={c.hi} marker={c.n} anim={anim}/>
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

// s4 — O'QISH
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
  const showVal = reached >= 2;
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
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 10, padding: 'clamp(18px, 3.4vw, 28px)', minHeight: 'clamp(150px, 32vw, 200px)' }}>
          <NumLine lo={c.lo} hi={c.hi} marker={c.n} anim={2} hideVal={!showVal}/>
          {showVal && <span className="mono lm-reveal" style={{ fontSize: 'clamp(20px, 4vw, 30px)', fontWeight: 800, color: T.success }}>{c.n}</span>}
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

// s5 — QOIDA + check (qaysi orasida)
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
  const order = React.useMemo(() => shuffleArr(optLabels.map((_, i) => i)), []);
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
  const optLabels = lang === 'ru' ? c.check_opts : c.check_opts_uz;
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <div className="d2-rulecard fade-up">
          <span className="d2-rulecard-badge mono">{t(c.eyebrow)}</span>
          <p className="d2-rulecard-txt">{t(c.rule)}</p>
        </div>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(10px, 2vw, 14px)', padding: 'clamp(14px, 2.6vw, 22px)' }}>
          <NumLine lo={c.lo} hi={c.hi} marker={c.n} anim={2}/>
          <p style={{ textAlign: 'center', color: T.ink2, fontWeight: 700, margin: 0 }}>{ok ? t(c.check_ok) : (picked !== null ? t(c.check_no) : t(c.check_q))}</p>
          <div style={{ display: 'flex', gap: 10 }}>
            {order.map((k, i) => (
              <button key={i} className={`option ${ok && i === ci ? 'option-correct' : ''} ${picked === i && i !== ci ? 'option-picked-wrong' : ''}`} disabled={!canAct || ok} onClick={() => pick(i)}
                style={{ padding: 'clamp(10px, 1.6vw, 13px) clamp(14px, 2.4vw, 20px)', fontSize: 'clamp(14px, 2.2vw, 18px)', minHeight: 'clamp(46px, 6.5vw, 56px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>{optLabels[k]}</button>
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

// s6 — MASHQ qaysi orasida (MC)
const Screen6 = (props) => {
  const t = useT();
  const c = CONTENT.s6;
  const heading = () => t(c.q);
  const renderFig = (it) => <NumLine lo={it.lo} hi={it.hi} marker={it.num} anim={2}/>;
  return <MCRoundD2 props={props} ck="s6" cols={3} heading={heading} renderFig={renderFig}/>;
};

// s7 — MASHQ belgini o'qish (MC)
const Screen7 = (props) => {
  const t = useT();
  const c = CONTENT.s7;
  const heading = () => t(c.q);
  const renderFig = (it) => <NumLine lo={it.lo} hi={it.hi} marker={it.num} anim={2} hideVal/>;
  return <MCRoundD2 props={props} ck="s7" cols={3} heading={heading} renderFig={renderFig}/>;
};

// s8 — MASHQ qaysi belgi (A/B/C)
const Screen8 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s8;
  const heading = (it) => `${t(c.q)} ${it.target}`;
  const renderFig = (it) => <NumLine lo={it.lo} hi={it.hi} cands={it.cands}/>;
  return <MCRoundD2 props={props} ck="s8" cols={3} heading={heading} renderFig={renderFig}/>;
};

// s9 — MASALA (case): Zuhra belgini o'qiydi (bir raund MC)
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
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(10px, 2vw, 14px)', padding: 'clamp(14px, 2.6vw, 20px)' }}>
          <FrameFx/>
          <NumLine lo={c.lo} hi={c.hi} marker={c.num} anim={2} hideVal={!solved}/>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, width: '100%' }}>
            {opts.map((o, i) => (
              <button key={i} className={`option ${wrongSet.has(i) ? 'option-picked-wrong' : ''} ${solved && i === ci ? 'option-correct' : ''}`} disabled={!canAct || solved || wrongSet.has(i)} onClick={() => pick(i)}
                style={{ padding: 'clamp(10px, 1.6vw, 13px)', fontSize: 'clamp(16px, 2.6vw, 20px)', minHeight: 'clamp(46px, 6.5vw, 56px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>{t(o)}</button>
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
                {hintMsg && <p className="fade-up" style={{ margin: 0, color: T.ink2, fontSize: 'clamp(13px, 1.7vw, 15px)', textAlign: 'center' }}>{t(hintMsg)}</p>}
              </>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10 }}>
                  {orders[idx].map((k, i) => (
                    <button key={i} className={`option ${picked === i ? 'option-correct' : wrongSet.has(i) ? 'option-picked-wrong' : ''}`} disabled={!canAct || picked !== null || wrongSet.has(i)} onClick={() => pick(i)}
                      style={{ padding: 'clamp(10px, 1.6vw, 13px)', fontSize: 'clamp(15px, 2.2vw, 18px)', minHeight: 'clamp(46px, 6.5vw, 56px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>
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
export default function NumberLineLesson({
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
`;
