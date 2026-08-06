import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { BackLabel, BitSVG, Chiroq, Confetti, D2Defs, D2Motes, FREE_NAV, FeedbackBlock, FrameFx, GradientDefs, HeroContext, LUMO_CAST, LangContext, Lenta, NavBack, NavNext, NextLabel, Panel, ProgressContext, Reaction, ReadinessMeter, Stage, StageHero, T, configureLesson, getAudioEngine, npKey, shuffleArr, ttsConfig, useAdvanceGate, useAudio, useCanAnswer, useLang, useMobileZoom, usePrefersReducedMotion, useRevealScroll, useSfx, useT, makeBrgSeg } from './_kit/index.jsx';
import { BASE_STYLES } from './_kit/styles.js';

// ============================================================================
// DD 3-SINF | Dars05 — "Yaxlitlash / yumaloq sonlar" (num-3-05) | B1 | o'nlik/yuzlikkacha
// Syujet: Bit sayyorasi LUMO, shahar shkalasi (SYUJET_3SINF.md B1 d.5). Sonni eng yaqin
//   yumaloq belgiga yaxlitlaymiz. Bit — mezbon-gid.
// Infra: grade3 Dars01.jsx (etalon nomzodi) dan BAYT-ANIQ ko'chirildi. O'zgarmadi.
// YADRO: yaxlitlash xonasidan o'ngdagi raqam >=5 yuqoriga, <5 pastga; yumaloq son nol bilan tugaydi.
// MEXANIKA: recall shkala (s1), yumaloq son (s2), o'nlikkacha 47 (s3), chegara 45 (s4), yuzlikkacha 347 (s5),
//   QOIDA (s6), o'nlik MC (s7), yuzlik MC (s8), xatoni top (s9), taxminiy hisob masala (s10),
//   final panel (s11), yakun (s12). RoundLine (son o'qi snap).
// Misconception: M1 doim past/doim yuqori, M2 5 pastga (chegara), M3 qaysi xona chalkash, M4 boshqa raqam o'zgardi.
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
  lessonId: 'num-3-05',
  lessonTitle: { ru: 'Урок 5. Округление чисел', uz: "5-dars. Sonlarni yaxlitlash" }
};
// STRUKTURA: 1–7 tushuntirish · 8–11 mashq · 12 final · 13 xulosa. Grade2 Dars01 etaloni yoyi,
// yuzlik qo'shilgan (uch pog'onali razryad). Syujet: Bit sayyorasi Lumo (SYUJET_3SINF.md Б1 d.1).
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
// CONTENT — 3-sinf Dars05 «Sonlarni yaxlitlash» (num-3-05). RU + UZ to'liq.
// Audio TTS-toza: sonlar so'z bilan, «» va matematik belgilar yo'q, bir segment = bir fikr.
// Rekvizit: chiroq (birlik) · lenta = 10 chiroq (o'nlik) · panel = 10 lenta (yuzlik). Lumo shahri.
// ============================================================

const CONTENT = {
  // s0 — HOOK: shahar shkalasi, 47 chiroq taxminan qancha (o'nlikkacha)
  s0: {
    eyebrow: { ru: 'Миссия', uz: 'Missiya' },
    topic: { ru: 'Тема: округление чисел', uz: 'Mavzu: sonlarni yaxlitlash' },
    lead: { ru: 'Шкала города: тут 47 огней.', uz: 'Shahar shkalasi: bu yerda 47 chiroq.' },
    num_display: { ru: '47', uz: '47' },
    q: { ru: 'Округли до десятков: ближе к 40 или к 50?', uz: "O'nlikkacha yaxlitla: 40 ga yaqinmi yoki 50 ga?" },
    opt0: { ru: '40', uz: '40' },
    opt1: { ru: '50', uz: '50' },
    opt2: { ru: 'Не знаю', uz: 'Bilmayman' },
    audio: {
      intro: {
        ru: [
          'Тема урока — округление чисел. Научимся заменять число ближайшим круглым.',
          'В прошлой области мы сравнивали районы. Теперь Бит показывает шкалу города.',
          'На шкале сорок семь огней. Круглые метки это сорок и пятьдесят.',
          'Как думаешь, к какому круглому числу ближе сорок семь? Выбери вариант.'
        ],
        uz: [
          "Dars mavzusi — sonlarni yaxlitlash. Sonni eng yaqin yumaloq son bilan almashtirishni o'rganamiz.",
          "O'tgan hududda tumanlarni taqqosladik. Endi Bit shahar shkalasini ko'rsatadi.",
          "Shkalada qirq yetti chiroq. Yumaloq belgilar bu qirq va ellik.",
          "Sizningcha, qirq yetti qaysi yumaloq songa yaqinroq? Variantni tanlang."
        ]
      },
      on_correct: { ru: 'Верно. Сорок семь ближе к пятидесяти. Округляем до пятидесяти.', uz: "To'g'ri. Qirq yetti ellikka yaqinroq. Ellikkacha yaxlitlaymiz." },
      on_wrong: { ru: 'Посмотри на шкалу. Сорок семь ближе к пятидесяти, чем к сорока.', uz: "Shkalaga qarang. Qirq yetti qirqqa emas, ellikka yaqinroq." }
    }
  },

  // s1 — RECALL: son o'qida yumaloq belgilar tartib bilan
  s1: {
    eyebrow: { ru: 'Вспомним и откроем', uz: 'Eslaymiz va ochamiz' },
    lead: { ru: 'Круглые числа — метки на шкале.', uz: 'Yumaloq sonlar — shkaladagi belgilar.' },
    audio: {
      ru: [
        'На числовой шкале числа стоят по порядку. Чем правее, тем больше.',
        'Круглые числа это главные метки. Десятки: десять, двадцать, тридцать. Сотни: сто, двести, триста.',
        'Любое число стоит между двумя круглыми метками. Округлить значит выбрать ближайшую метку.'
      ],
      uz: [
        "Son shkalasida sonlar tartib bilan turadi. Qancha o'ngda bo'lsa, shuncha katta.",
        "Yumaloq sonlar bu asosiy belgilar. O'nliklar: o'n, yigirma, o'ttiz. Yuzliklar: yuz, ikki yuz, uch yuz.",
        "Har qanday son ikki yumaloq belgi orasida turadi. Yaxlitlash bu eng yaqin belgini tanlash."
      ]
    }
  },

  // s2 — YUMALOQ SON nima (0 bilan tugaydi)
  s2: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: { ru: 'Круглое число оканчивается на ноль.', uz: 'Yumaloq son nol bilan tugaydi.' },
    tens: ['30', '80', '60'],
    hundreds: ['200', '500', '700'],
    tens_label: { ru: 'круглые десятки', uz: "yumaloq o'nliklar" },
    hundreds_label: { ru: 'круглые сотни', uz: 'yumaloq yuzliklar' },
    audio: {
      ru: [
        'Какие числа называют круглыми? Круглый десяток оканчивается на один ноль. Тридцать, восемьдесят, шестьдесят.',
        'Круглая сотня оканчивается на два нуля. Двести, пятьсот, семьсот. Такие числа удобно считать и запоминать.'
      ],
      uz: [
        "Qaysi sonlar yumaloq deyiladi? Yumaloq o'nlik bitta nol bilan tugaydi. O'ttiz, sakson, oltmish.",
        "Yumaloq yuzlik ikkita nol bilan tugaydi. Ikki yuz, besh yuz, yetti yuz. Bunday sonlarni sanash va eslash qulay."
      ]
    }
  },

  // s3 — O'NLIKKACHA yaxlitlash: 47 -> 50
  s3: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: { ru: 'Округляем до десятков.', uz: "O'nlikkacha yaxlitlaymiz." },
    n: 47, base: 10, rounded: 50,
    done_text: { ru: 'Сорок семь ближе к пятидесяти. Округлили до пятидесяти.', uz: "Qirq yetti ellikka yaqin. Ellikkacha yaxlitladik." },
    audio: {
      ru: [
        'Округлим сорок семь до десятков. Оно стоит между сорока и пятьюдесятью.',
        'Смотрим, к какой метке ближе. Сорок семь ближе к пятидесяти.',
        'Прыгаем к ближайшей метке. Сорок семь округлили до пятидесяти. А сорок три было бы ближе к сорока.'
      ],
      uz: [
        "Qirq yettini o'nlikkacha yaxlitlaymiz. U qirq bilan ellik orasida turadi.",
        "Qaysi belgiga yaqinligiga qaraymiz. Qirq yetti ellikka yaqinroq.",
        "Eng yaqin belgiga sakraymiz. Qirq yettini ellikkacha yaxlitladik. Qirq uch esa qirqqa yaqin bo'lardi."
      ]
    }
  },

  // s4 — CHEGARA qoida: 45 -> 50 (birlik 5 yuqoriga); raqam qoidasi
  s4: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: { ru: 'Ровно пять — округляем вверх.', uz: "Roppa-rosa besh — yuqoriga yaxlitlaymiz." },
    n: 45, base: 10, rounded: 50,
    done_text: { ru: 'Если цифра справа пять или больше — округляем вверх. Если меньше пяти — вниз.', uz: "O'ngdagi raqam besh yoki katta bo'lsa — yuqoriga. Beshdan kichik bo'lsa — pastga." },
    audio: {
      ru: [
        'А если число ровно посередине? Сорок пять стоит точно между сорока и пятьюдесятью.',
        'Есть правило. Смотрим на цифру справа от разряда. Если она пять или больше, округляем вверх.',
        'Пятёрка это пять, значит вверх. Сорок пять округляем до пятидесяти. А если цифра меньше пяти, округляем вниз.'
      ],
      uz: [
        "Agar son roppa-rosa o'rtada bo'lsa-chi? Qirq besh qirq bilan ellik orasida aynan o'rtada.",
        "Qoida bor. Xonaning o'ng tomonidagi raqamga qaraymiz. Agar u besh yoki katta bo'lsa, yuqoriga yaxlitlaymiz.",
        "Beshlik bu besh, demak yuqoriga. Qirq beshni ellikkacha yaxlitlaymiz. Agar raqam beshdan kichik bo'lsa, pastga yaxlitlaymiz."
      ]
    }
  },

  // s5 — YUZLIKKACHA yaxlitlash: 347 -> 300, 380 -> 400
  s5: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: { ru: 'Округляем до сотен.', uz: 'Yuzlikkacha yaxlitlaymiz.' },
    n: 347, base: 100, rounded: 300,
    done_text: { ru: 'До сотен смотрим на десятки. У 347 десятков четыре, это меньше пяти — вниз, к тремстам.', uz: "Yuzlikkacha o'nlikka qaraymiz. 347 da o'nlik to'rt, bu beshdan kichik — pastga, uch yuzga." },
    audio: {
      ru: [
        'Теперь округлим до сотен. Возьмём триста сорок семь. Оно между тремястами и четырьмястами.',
        'До сотен смотрим на цифру десятков. У триста сорок семь в десятках четыре.',
        'Четыре меньше пяти, значит вниз. Триста сорок семь округляем до трёхсот. А триста восемьдесят округлилось бы до четырёхсот.'
      ],
      uz: [
        "Endi yuzlikkacha yaxlitlaymiz. Uch yuz qirq yettini olamiz. U uch yuz bilan to'rt yuz orasida.",
        "Yuzlikkacha o'nlik raqamiga qaraymiz. Uch yuz qirq yettida o'nlik to'rt.",
        "To'rt beshdan kichik, demak pastga. Uch yuz qirq yettini uch yuzgacha yaxlitlaymiz. Uch yuz sakson esa to'rt yuzgacha yaxlitlanardi."
      ]
    }
  },

  // s6 — QOIDA
  s6: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    rule: { ru: 'Смотрим на цифру справа от разряда округления. Пять или больше — округляем вверх, меньше пяти — вниз.', uz: "Yaxlitlash xonasidan o'ngdagi raqamga qaraymiz. Besh yoki katta — yuqoriga, beshdan kichik — pastga yaxlitlaymiz." },
    n: 63, base: 10, rounded: 60,
    check_q: { ru: 'Округли 63 до десятков. Нажми верный ответ.', uz: "63 ni o'nlikkacha yaxlitla. To'g'ri javobni bosing." },
    check_opts: ['60', '70'],
    check_ci: 0,
    check_ok: { ru: 'Верно! Цифра справа три, это меньше пяти — округляем вниз, к 60.', uz: "To'g'ri! O'ngdagi raqam uch, beshdan kichik — pastga, 60 ga." },
    check_no: { ru: 'Цифра единиц три, меньше пяти — округляем вниз, к 60.', uz: "Birlik raqami uch, beshdan kichik — pastga, 60 ga." },
    audio: {
      ru: [
        'Отлично, теперь запомним правило округления.',
        'Смотрим на цифру справа от того разряда, до которого округляем.',
        'Если эта цифра пять или больше, округляем вверх, к следующей метке.',
        'Если меньше пяти, округляем вниз, к своей метке. А теперь сам. Округли шестьдесят три до десятков.'
      ],
      uz: [
        "Zo'r, endi yaxlitlash qoidasini eslab qolamiz.",
        "Qaysi xonagacha yaxlitlasak, o'shaning o'ng tomonidagi raqamga qaraymiz.",
        "Agar bu raqam besh yoki katta bo'lsa, yuqoriga, keyingi belgiga yaxlitlaymiz.",
        "Beshdan kichik bo'lsa, pastga, o'z belgisiga yaxlitlaymiz. Endi o'zingiz. Oltmish uchni o'nlikkacha yaxlitlang."
      ]
    }
  },

  // s7 — MASHQ o'nlikkacha (MC), 3 raund
  s7: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    q: { ru: 'Округли до десятков.', uz: "O'nlikkacha yaxlitla." },
    base: 10,
    items: [
      {
        num: 68, ci: 0,
        opts: [{ ru: '70', uz: '70' }, { ru: '60', uz: '60' }, { ru: '68', uz: '68' }],
        hints: {
          1: { ru: 'Цифра единиц восемь, это больше пяти — округляем вверх, к 70.', uz: "Birlik raqami sakkiz, beshdan katta — yuqoriga, 70 ga." },
          2: { ru: 'Ответ должен быть круглым, оканчиваться на ноль.', uz: "Javob yumaloq bo'lishi kerak, nol bilan tugashi kerak." }
        }
      },
      {
        num: 34, ci: 0,
        opts: [{ ru: '30', uz: '30' }, { ru: '40', uz: '40' }, { ru: '34', uz: '34' }],
        hints: {
          1: { ru: 'Цифра единиц четыре, меньше пяти — округляем вниз, к 30.', uz: "Birlik raqami to'rt, beshdan kichik — pastga, 30 ga." },
          2: { ru: 'Круглый ответ оканчивается на ноль.', uz: "Yumaloq javob nol bilan tugaydi." }
        }
      },
      {
        num: 55, ci: 0,
        opts: [{ ru: '60', uz: '60' }, { ru: '50', uz: '50' }, { ru: '55', uz: '55' }],
        hints: {
          1: { ru: 'Цифра единиц пять — округляем вверх, к 60.', uz: "Birlik raqami besh — yuqoriga, 60 ga." },
          2: { ru: 'Круглый ответ оканчивается на ноль.', uz: "Yumaloq javob nol bilan tugaydi." }
        }
      }
    ],
    audio: {
      intro: { ru: 'Округляй числа до десятков. Смотри на цифру единиц. Три задания.', uz: "Sonlarni o'nlikkacha yaxlitla. Birlik raqamiga qara. Uchta topshiriq." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Смотри на цифру единиц: пять и больше вверх, меньше вниз.', uz: "Birlik raqamiga qara: besh va katta yuqoriga, kichik pastga." }
    }
  },

  // s8 — MASHQ yuzlikkacha (MC), 3 raund
  s8: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    q: { ru: 'Округли до сотен.', uz: 'Yuzlikkacha yaxlitla.' },
    base: 100,
    items: [
      {
        num: 347, ci: 0,
        opts: [{ ru: '300', uz: '300' }, { ru: '400', uz: '400' }, { ru: '350', uz: '350' }],
        hints: {
          1: { ru: 'Цифра десятков четыре, меньше пяти — округляем вниз, к 300.', uz: "O'nlik raqami to'rt, beshdan kichik — pastga, 300 ga." },
          2: { ru: 'До сотен ответ оканчивается на два нуля.', uz: "Yuzlikkacha javob ikkita nol bilan tugaydi." }
        }
      },
      {
        num: 682, ci: 0,
        opts: [{ ru: '700', uz: '700' }, { ru: '600', uz: '600' }, { ru: '680', uz: '680' }],
        hints: {
          1: { ru: 'Цифра десятков восемь, больше пяти — округляем вверх, к 700.', uz: "O'nlik raqami sakkiz, beshdan katta — yuqoriga, 700 ga." },
          2: { ru: 'До сотен ответ оканчивается на два нуля.', uz: "Yuzlikkacha javob ikkita nol bilan tugaydi." }
        }
      },
      {
        num: 450, ci: 0,
        opts: [{ ru: '500', uz: '500' }, { ru: '400', uz: '400' }, { ru: '450', uz: '450' }],
        hints: {
          1: { ru: 'Цифра десятков пять — округляем вверх, к 500.', uz: "O'nlik raqami besh — yuqoriga, 500 ga." },
          2: { ru: 'До сотен ответ оканчивается на два нуля.', uz: "Yuzlikkacha javob ikkita nol bilan tugaydi." }
        }
      }
    ],
    audio: {
      intro: { ru: 'Округляй числа до сотен. Смотри на цифру десятков. Три задания.', uz: "Sonlarni yuzlikkacha yaxlitla. O'nlik raqamiga qara. Uchta topshiriq." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Смотри на цифру десятков: пять и больше вверх, меньше вниз.', uz: "O'nlik raqamiga qara: besh va katta yuqoriga, kichik pastga." }
    }
  },

  // s9 — MASHQ xatoni top (yaxlitlash), 3 raund
  s9: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    q: { ru: 'Найди неверное округление.', uz: "Noto'g'ri yaxlitlashni toping." },
    items: [
      {
        stmts: ['76 → 80', '45 → 40', '23 → 20'],
        wrong: 1,
        hint: { ru: 'У сорока пяти цифра единиц пять — округляем вверх, к 50, а не к 40.', uz: "Qirq beshda birlik raqami besh — yuqoriga, 50 ga, 40 ga emas." }
      },
      {
        stmts: ['350 → 400', '240 → 300', '618 → 600'],
        wrong: 1,
        hint: { ru: 'У двухсот сорока десятков четыре, меньше пяти — вниз, к 200, а не к 300.', uz: "Ikki yuz qirqda o'nlik to'rt, beshdan kichik — pastga, 200 ga, 300 ga emas." }
      },
      {
        stmts: ['92 → 90', '87 → 80', '31 → 30'],
        wrong: 1,
        hint: { ru: 'У восьмидесяти семи единиц семь, больше пяти — вверх, к 90, а не к 80.', uz: "Sakson yettida birlik yetti, beshdan katta — yuqoriga, 90 ga, 80 ga emas." }
      }
    ],
    audio: {
      intro: { ru: 'Даю три округления. Одно неверное. Найди неверное.', uz: "Uchta yaxlitlash beraman. Bittasi noto'g'ri. Noto'g'risini toping." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Проверь цифру справа: пять и больше вверх, меньше вниз.', uz: "O'ngdagi raqamni tekshir: besh va katta yuqoriga, kichik pastga." }
    }
  },

  // s10 — MASALA (case): Anvar taxminiy hisob (yuzlikkacha)
  s10: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    lead: { ru: 'Анвар считает модули: их 623. Сколько это примерно?', uz: 'Anvar modullarni sanayapti: ular 623 ta. Bu taxminan qancha?' },
    num: 623, base: 100, ci: 0,
    q: { ru: 'Округли 623 до сотен.', uz: '623 ni yuzlikkacha yaxlitla.' },
    opts: [{ ru: '600', uz: '600' }, { ru: '700', uz: '700' }, { ru: '620', uz: '620' }],
    hints: {
      1: { ru: 'Цифра десятков два, меньше пяти — округляем вниз, к 600.', uz: "O'nlik raqami ikki, beshdan kichik — pastga, 600 ga." },
      2: { ru: 'До сотен ответ оканчивается на два нуля.', uz: "Yuzlikkacha javob ikkita nol bilan tugaydi." }
    },
    setup_audio: { ru: 'Анвар сосчитал модули района. Их шестьсот двадцать три. Для отчёта нужно примерное круглое число.', uz: "Anvar tuman modullarini sanadi. Ular olti yuz yigirma uchta. Hisob uchun taxminiy yumaloq son kerak." },
    audio: {
      intro: { ru: 'Округли шестьсот двадцать три до сотен. Выбери верный ответ.', uz: "Olti yuz yigirma uchni yuzlikkacha yaxlitla. To'g'ri javobni tanlang." },
      on_correct: { ru: 'Верно. Десятков два, меньше пяти — округляем к шестистам.', uz: "To'g'ri. O'nlik ikki, beshdan kichik — olti yuzga yaxlitlaymiz." },
      on_wrong: { ru: 'Смотри на десятки: 2, это меньше пяти. Округляем вниз.', uz: "O'nlikka qara: 2, bu beshdan kichik. Pastga yaxlitlaymiz." }
    }
  },

  // s11 — FINAL panel (5 savol) + FactCard
  s11: {
    eyebrow: { ru: 'Финал', uz: 'Final' },
    intro_line: { ru: 'Городской компьютер проверит тебя. Пять заданий.', uz: "Shahar kompyuteri sizni tekshiradi. Beshta topshiriq." },
    items: [
      {
        kind: 'mc',
        q: { ru: 'Округли 58 до десятков.', uz: "58 ni o'nlikkacha yaxlitla." },
        opt0: { ru: '60', uz: '60' },
        opt1: { ru: '50', uz: '50' },
        opt2: { ru: '58', uz: '58' },
        wrong_1: { ru: 'Единиц восемь, больше пяти — вверх, к 60.', uz: "Birlik sakkiz, beshdan katta — yuqoriga, 60 ga." },
        wrong_2: { ru: 'Круглый ответ оканчивается на ноль.', uz: "Yumaloq javob nol bilan tugaydi." }
      },
      {
        kind: 'mc',
        q: { ru: 'Округли 412 до сотен.', uz: '412 ni yuzlikkacha yaxlitla.' },
        opt0: { ru: '400', uz: '400' },
        opt1: { ru: '500', uz: '500' },
        opt2: { ru: '410', uz: '410' },
        wrong_1: { ru: 'Десятков один, меньше пяти — вниз, к 400.', uz: "O'nlik bir, beshdan kichik — pastga, 400 ga." },
        wrong_2: { ru: 'До сотен ответ оканчивается на два нуля.', uz: "Yuzlikkacha javob ikkita nol bilan tugaydi." }
      },
      {
        kind: 'num', ans: 280,
        q: { ru: 'Округли 275 до десятков и запиши.', uz: "275 ni o'nlikkacha yaxlitlab yozing." },
        hint: { ru: 'Единиц пять — округляем вверх, к 280.', uz: "Birlik besh — yuqoriga, 280 ga." }
      },
      {
        kind: 'mc',
        q: { ru: 'Округли 94 до десятков.', uz: "94 ni o'nlikkacha yaxlitla." },
        opt0: { ru: '90', uz: '90' },
        opt1: { ru: '100', uz: '100' },
        opt2: { ru: '80', uz: '80' },
        wrong_1: { ru: 'Единиц четыре, меньше пяти — вниз, к 90.', uz: "Birlik to'rt, beshdan kichik — pastga, 90 ga." },
        wrong_2: { ru: 'Смотрим на единицы: четыре. Округляем вниз, к 90.', uz: "Birlikka qaraymiz: to'rt. Pastga, 90 ga." }
      },
      {
        kind: 'num', ans: 58,
        q: { ru: 'Загадка. Если округлить меня до десятков, будет 60. Единиц у меня восемь. Кто я?', uz: "Jumboq. Meni o'nlikkacha yaxlitlasa 60 chiqadi. Birligim sakkiz. Men kimman?" },
        hint: { ru: 'Единиц восемь, округляется вверх к 60. Значит число пятьдесят восемь.', uz: "Birlik sakkiz, yuqoriga 60 ga yaxlitlanadi. Demak son ellik sakkiz." }
      }
    ],
    fact_badge: { ru: 'Знаешь?', uz: 'Bilasizmi?' },
    fact_text: { ru: 'Красные карлики очень маленькие: самые лёгкие из них лишь немного больше планеты Юпитер. Но горят они дольше всех звёзд.', uz: "Qizil mitti yulduzlar juda kichik: eng yengillari Yupiter sayyorasidan atigi sal katta. Lekin ular hamma yulduzdan uzoq yonadi." },
    fact_audio: { ru: 'Красные карлики очень маленькие. Самые лёгкие из них лишь немного больше планеты Юпитер. Но горят они дольше всех звёзд.', uz: "Qizil mitti yulduzlar juda kichik. Eng yengillari Yupiter sayyorasidan atigi sal katta. Lekin ular hamma yulduzdan uzoq yonadi." },
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
    mission_done: { ru: 'Шкала города освоена!', uz: 'Shahar shkalasi egallandi!' },
    cando: { ru: 'Теперь ты округляешь числа до десятков и до сотен.', uz: "Endi siz sonlarni o'nlikkacha va yuzlikkacha yaxlitlaysiz." },
    rule_recap: { ru: 'Смотри на цифру справа от разряда: пять и больше — вверх, меньше пяти — вниз. Круглое число оканчивается на ноль.', uz: "Xonaning o'ngidagi raqamga qara: besh va katta — yuqoriga, beshdan kichik — pastga. Yumaloq son nol bilan tugaydi." },
    conn_label_refs: { ru: 'Опирается на', uz: 'Tayanadi' },
    conn_refs: { ru: 'четвёртый урок: сравнение чисел', uz: "to'rtinchi dars: sonlarni taqqoslash" },
    conn_label_next: { ru: 'Дальше', uz: 'Keyingi' },
    conn_next: { ru: 'Урок 6: число на числовой прямой', uz: "6-dars: son o'qida son" },
    audio: {
      ru: 'Шкала города освоена. Мы научились округлять числа до десятков и до сотен. Запомни правило. Смотрим на цифру справа от разряда округления. Если пять или больше, округляем вверх. Если меньше пяти, вниз. А круглое число всегда оканчивается на ноль. В следующий раз научимся находить место числа на числовой прямой.',
      uz: "Shahar shkalasi egallandi. Biz sonlarni o'nlikkacha va yuzlikkacha yaxlitlashni o'rgandik. Qoidani yodda tuting. Yaxlitlash xonasidan o'ngdagi raqamga qaraymiz. Agar besh yoki katta bo'lsa, yuqoriga. Beshdan kichik bo'lsa, pastga. Yumaloq son esa doim nol bilan tugaydi. Keyingi safar sonning son o'qidagi o'rnini topishni o'rganamiz."
    }
  }
};

// slaydlararo ko'priklar (audio-intro boshiga; ekranda ko'rinmaydi). TTS-toza.
const BRIDGES = {
  s1:  { ru: 'Вспомним про шкалу.', uz: 'Shkalani eslaymiz.' },
  s2:  { ru: 'Какие числа круглые?', uz: 'Qaysi sonlar yumaloq?' },
  s3:  { ru: 'Округлим до десятков.', uz: "O'nlikkacha yaxlitlaymiz." },
  s4:  { ru: 'А если ровно посередине?', uz: "Roppa-rosa o'rtada bo'lsa-chi?" },
  s5:  { ru: 'Теперь до сотен.', uz: 'Endi yuzlikkacha.' },
  s6:  { ru: 'Запишем это правилом.', uz: 'Buni qoida qilib olamiz.' },
  s7:  { ru: 'Правило знаем. Округляй сам.', uz: "Qoidani bilamiz. O'zingiz yaxlitlang." },
  s8:  { ru: 'Теперь до сотен.', uz: 'Endi yuzlikkacha.' },
  s9:  { ru: 'Проверим округления на ошибку.', uz: 'Yaxlitlashlarni xatoga tekshiramiz.' },
  s10: { ru: 'Анвару нужно примерное число.', uz: 'Anvarga taxminiy son kerak.' },
  s11: { ru: 'Городской компьютер сделает финальную проверку.', uz: 'Shahar kompyuteri yakuniy tekshiradi.' },
  s12: { ru: 'Шкала освоена. Идём дальше!', uz: 'Shkala egallandi. Davom etamiz!' }
};

// s12 payoff (xulosadan oldin aytiladi)
const S12_PAYOFF = {
  ru: 'Миссия выполнена! Мы научились быстро прикидывать число круглыми метками, и Бит открыл шкалу города. Спасибо за помощь!',
  uz: "Missiya bajarildi! Biz sonni yumaloq belgilar bilan tez chamalashni o'rgandik, va Bit shahar shkalasini ochdi. Yordamingiz uchun rahmat!"
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
      <MeasureTowerBg/>
      <div className="lm-scene-cast">
        {LUMO_CAST.slice(0, 2).map(kid)}
        <span className={`lm-crew lm-crew-host ${gathered ? 'd2-bit-cheer' : 'lm-bob'}`}><span className="g1-cast-fig"><BitSVG state={gathered ? 'happy' : 'present'}/></span></span>
        {LUMO_CAST.slice(2).map((c, i) => kid(c, i + 2))}
      </div>
    </div>
  );
};




// ============================================================
// EKRANLAR — Dars05 «Yaxlitlash / yumaloq sonlar» (o'nlik va yuzlikkacha)
// ============================================================



// --- O'LCHOV MINORASI SAHNASI (D05): markaziy o'lchov-minora (dial) + belgi ustunlar
const MeasureTowerBg = () => (
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

    <rect x="96" y="104" width="208" height="52" rx="7" fill="url(#shPanel)" stroke="#3E6E90" strokeWidth="1.6"/>
    <rect x="102" y="108" width="196" height="10" rx="3" fill="#122236"/>
    <text x="200" y="115.5" textAnchor="middle" fontSize="7" letterSpacing="1.5" fill="#7FB8D8" fontFamily="'JetBrains Mono', monospace">YAXLITLASH</text>
    <line x1="116" y1="140" x2="284" y2="140" stroke="#5E86A2" strokeWidth="2"/>
    {[['40', 116], ['45', 158], ['50', 200], ['55', 242], ['60', 284]].map(([n, x], i) => (<g key={`t${i}`}><line x1={x} y1="135" x2={x} y2="145" stroke="#5E86A2" strokeWidth="1.5"/><text x={x} y="153" textAnchor="middle" fontSize="7" fill="#8FB8D0" fontFamily="'JetBrains Mono', monospace">{n}</text></g>))}
    <g><circle cx="149" cy="140" r="3.5" fill="#F2A85C"/><text x="149" y="130" textAnchor="middle" fontSize="9" fontWeight="800" fill="#F2A85C" fontFamily="'JetBrains Mono', monospace">47</text></g>
    <g stroke="#FFD86E" strokeWidth="2" strokeLinecap="round"><path d="M155 126 Q178 116 198 128"/></g><path d="M198 128 l-6 -1 l3 -5 Z" fill="#FFD86E"/>
    <circle cx="200" cy="140" r="4.5" fill="none" stroke="#8FE6C0" strokeWidth="2"/><text x="200" y="128" textAnchor="middle" fontSize="10" fontWeight="800" fill="#8FE6C0" fontFamily="'JetBrains Mono', monospace">50</text>
    <path d="M150 156 h100 l10 20 h-120 Z" fill="#C3A87E"/><rect x="146" y="174" width="108" height="4" fill="#A98C64"/>
    {/* chap: o'lchov shkalasi */}
    <g transform="translate(20 118)"><rect x="0" y="0" width="20" height="58" rx="3" fill="url(#shPanel)" stroke="#3E6E90" strokeWidth="1"/><g stroke="#6FD0E4" strokeWidth="1" opacity="0.7">{[0,1,2,3,4,5].map((k)=><line key={k} x1="3" y1={8+k*8} x2={k%2?12:16} y2={8+k*8}/>)}</g><rect x="2" y="30" width="16" height="4" fill="#F2A85C"/></g>
    {/* o'ng: baland/past o'qi belgisi */}
    <g transform="translate(360 120)"><rect x="0" y="0" width="24" height="54" rx="3" fill="url(#shPanel)" stroke="#3E6E90" strokeWidth="1"/><text x="12" y="20" textAnchor="middle" fontSize="12" fill="#8FE6C0">▲</text><text x="12" y="46" textAnchor="middle" fontSize="12" fill="#F2A85C">▼</text></g>
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
      <MeasureTowerBg/>
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

// --- YAXLITLASH SHKALASI: son ikki yumaloq belgi orasida, snap=true -> yaqiniga sakraydi.
const RoundLine = ({ n, base, snap }) => {
  const low = Math.floor(n / base) * base;
  const high = low + base;
  const mid = low + base / 2;
  const W = 300, pad = 34, y = 46;
  const xp = (v) => pad + ((v - low) / (high - low)) * (W - 2 * pad);
  const rounded = (n - low) >= base / 2 ? high : low;
  const pos = snap ? rounded : n;
  return (
    <svg viewBox={`0 0 ${W} 82`} style={{ width: 'min(320px, 98%)', height: 'auto' }} aria-hidden="true">
      <line x1={xp(low)} y1={y} x2={xp(high)} y2={y} stroke={T.ink3} strokeWidth="2"/>
      {[low, mid, high].map((v, i) => (
        <g key={i}>
          <line x1={xp(v)} y1={y - 6} x2={xp(v)} y2={y + 6} stroke={i === 1 ? T.ink3 : T.ink2} strokeWidth={i === 1 ? 1.4 : 2.4} strokeDasharray={i === 1 ? '3 3' : undefined}/>
          {i !== 1 && <text x={xp(v)} y={y + 22} textAnchor="middle" fontSize="12" fontWeight="800" fill={T.ink2} fontFamily="'JetBrains Mono', monospace">{v}</text>}
        </g>
      ))}
      <g style={{ transform: `translateX(${xp(pos) - xp(low)}px)`, transition: 'transform 0.7s cubic-bezier(0.34, 1.2, 0.4, 1)' }}>
        <text x={xp(low)} y={y - 14} textAnchor="middle" fontSize="14" fontWeight="800" fill={snap ? T.success : T.accent} fontFamily="'JetBrains Mono', monospace">{pos}</text>
        <circle cx={xp(low)} cy={y} r="6" fill={snap ? T.success : T.accent}/>
      </g>
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
                    style={{ padding: 'clamp(10px, 1.6vw, 13px)', fontSize: 'clamp(16px, 2.4vw, 20px)', minHeight: 'clamp(46px, 6.5vw, 56px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>{t(o)}</button>
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

// s0 — HOOK: 47 ni o'nlikkacha (40/50)
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
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: 'clamp(14px, 2.6vw, 22px)' }}>
          <span className="mono" style={{ fontSize: 'clamp(30px, 7vw, 44px)', fontWeight: 800, color: T.ink }}>{t(c.num_display)}</span>
          <RoundLine n={47} base={10} snap={false}/>
        </div>
        <p className="fade-up delay-1" style={{ textAlign: 'center', color: T.ink2, fontWeight: 600, fontSize: 'clamp(14px, 1.9vw, 17px)', margin: 0 }}>{t(c.q)}</p>
        {picked === null && (
          <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {opts.map((o, i) => (
              <button key={i} className="option" disabled={!canAct} onClick={() => pick(i)}
                style={{ padding: 'clamp(10px, 1.5vw, 12px)', fontSize: 'clamp(15px, 2.2vw, 20px)', minHeight: 'clamp(48px, 7vw, 58px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>
                {t(o)}
              </button>
            ))}
          </div>
        )}
        {picked !== null && (
          <div className="fade-up" style={{ display: 'flex', justifyContent: 'center' }}>
            <button className={`option ${ok ? 'option-correct' : 'option-picked-wrong'}`} disabled
              style={{ padding: 'clamp(10px, 1.5vw, 12px) clamp(16px, 2.4vw, 22px)', fontSize: 'clamp(15px, 2.2vw, 20px)', minHeight: 'clamp(46px, 6.5vw, 56px)', width: 'auto', display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>
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

// s1 — RECALL (audio reveal)
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
  const marks = [200, 300, 400, 500];
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: 'clamp(16px, 3vw, 24px)', minHeight: 'clamp(150px, 32vw, 200px)' }}>
          <svg viewBox="0 0 320 60" style={{ width: 'min(340px, 98%)', height: 'auto' }} aria-hidden="true">
            <line x1="20" y1="34" x2="300" y2="34" stroke={T.ink3} strokeWidth="2"/>
            {marks.map((m, i) => {
              const x = 30 + i * 86;
              return (
                <g key={m} className={reached >= 1 ? 'g1-pop-in' : ''} style={{ animationDelay: `${i * 0.15}s`, opacity: reached >= 1 ? 1 : 0.2 }}>
                  <line x1={x} y1="28" x2={x} y2="40" stroke={T.accent} strokeWidth="2.6"/>
                  <circle cx={x} cy="34" r="4.5" fill={T.accent}/>
                  <text x={x} y="54" textAnchor="middle" fontSize="12" fontWeight="800" fill={T.ink2} fontFamily="'JetBrains Mono', monospace">{m}</text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </Stage>
  );
};

// s2 — YUMALOQ SON nima
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
  const showH = reached >= 1;
  const done = reached >= (c.audio[lang].length - 1);
  const canAdv = useAdvanceGate(done, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  const Row = ({ label, data, col }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
      <span className="mono" style={{ color: T.accent, fontWeight: 800, fontSize: 'clamp(11px, 1.5vw, 13px)' }}>{label}</span>
      <div style={{ display: 'flex', gap: 'clamp(8px, 2.4vw, 16px)' }}>
        {data.map((d, i) => (
          <span key={i} className="mono g1-pop-in" style={{ animationDelay: `${i * 0.08}s`, fontSize: 'clamp(20px, 4.2vw, 30px)', fontWeight: 800, color: col, background: T.paper, borderRadius: 10, padding: '4px 12px', boxShadow: '0 3px 10px -4px rgba(58, 53, 48, 0.22)' }}>{d}</span>
        ))}
      </div>
    </div>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'clamp(16px, 3vw, 24px)', padding: 'clamp(16px, 3vw, 24px)', minHeight: 'clamp(160px, 34vw, 210px)' }}>
          <Row label={t(c.tens_label)} data={c.tens} col={T.blue}/>
          {showH && <div className="lm-reveal"><Row label={t(c.hundreds_label)} data={c.hundreds} col="#C0392B"/></div>}
        </div>
      </div>
    </Stage>
  );
};

// s3/s4/s5 — YAXLITLASH VIZUALI (explore, RoundLine snap)
const ExploreRound = ({ props, ck }) => {
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
  const snap = reached >= 2;
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
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'clamp(10px, 2vw, 14px)', padding: 'clamp(16px, 3vw, 24px)', minHeight: 'clamp(150px, 32vw, 200px)' }}>
          <span className="mono" style={{ fontSize: 'clamp(26px, 5.5vw, 38px)', fontWeight: 800, color: T.ink }}>{c.n}</span>
          <RoundLine n={c.n} base={c.base} snap={snap}/>
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
const Screen3 = (props) => <ExploreRound props={props} ck="s3"/>;
const Screen4 = (props) => <ExploreRound props={props} ck="s4"/>;
const Screen5 = (props) => <ExploreRound props={props} ck="s5"/>;

// s6 — QOIDA + check (63 -> 60)
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
          <span className="mono" style={{ fontSize: 'clamp(28px, 6vw, 40px)', fontWeight: 800, color: T.ink }}>{c.n}</span>
          <RoundLine n={c.n} base={c.base} snap={ok}/>
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

// s7 — MASHQ o'nlikkacha (MC)
const Screen7 = (props) => {
  const t = useT();
  const c = CONTENT.s7;
  const heading = () => t(c.q);
  const renderFig = (it) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <span className="mono" style={{ fontSize: 'clamp(28px, 6vw, 40px)', fontWeight: 800, color: T.ink }}>{it.num}</span>
      <RoundLine n={it.num} base={c.base} snap={false}/>
    </div>
  );
  return <MCRoundD2 props={props} ck="s7" cols={3} heading={heading} renderFig={renderFig}/>;
};

// s8 — MASHQ yuzlikkacha (MC)
const Screen8 = (props) => {
  const t = useT();
  const c = CONTENT.s8;
  const heading = () => t(c.q);
  const renderFig = (it) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <span className="mono" style={{ fontSize: 'clamp(28px, 6vw, 40px)', fontWeight: 800, color: T.ink }}>{it.num}</span>
      <RoundLine n={it.num} base={c.base} snap={false}/>
    </div>
  );
  return <MCRoundD2 props={props} ck="s8" cols={3} heading={heading} renderFig={renderFig}/>;
};

// s9 — MASHQ xatoni top (yaxlitlash)
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
            <div className="mono fade-up" style={{ textAlign: 'center', color: T.accent, fontWeight: 800 }}>{Math.min(idx + 1, items.length)} / {items.length}</div>
            <h1 className="title h-sub fade-up">{t(c.q)}</h1>
            <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.8vw, 12px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
              <FrameFx/>
              {it.stmts.map((stmt, i) => (
                <button key={i} className={`option ${wrongSet.has(i) ? 'option-picked-wrong' : ''} ${solvedRound && i === it.wrong ? 'option-correct' : ''}`} disabled={!canAct || solvedRound || wrongSet.has(i)} onClick={() => pick(i)}
                  style={{ padding: 'clamp(10px, 1.6vw, 14px)', minHeight: 'clamp(48px, 7vw, 58px)', fontSize: 'clamp(17px, 3.2vw, 23px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, letterSpacing: 1 }}>{stmt}</button>
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

// s10 — MASALA (case): Anvar taxminiy hisob (bir raund MC)
const Screen10 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s10;
  const sfx = useSfx();
  // Variantlar har mount'da aralashadi (to'g'ri javob doim 1-o'rinda qolmasin).
  const order = React.useMemo(() => shuffleArr([0, 1, 2]), []);
  const opts = order.map((k) => c.opts[k]);
  const ci = order.indexOf(c.ci);
  const hints = order.map((k) => c.hints[k]);
  const audio = useAudio([
    brgSeg('s10', lang),
    { id: 's10_setup', text: c.setup_audio[lang], trigger: 'after_previous', waits_for: null },
    { id: 's10_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
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
          <span className="mono" style={{ fontSize: 'clamp(30px, 6.5vw, 44px)', fontWeight: 800, color: T.ink }}>{c.num}</span>
          <RoundLine n={c.num} base={c.base} snap={solved}/>
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

// s11 — FINAL panel (5 savol aralash) + FactCard
const Screen11 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s11;
  const items = c.items;
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
export default function RoundingLesson({
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
