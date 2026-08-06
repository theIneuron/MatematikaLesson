import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { BackLabel, BitSVG, Chiroq, Confetti, D2Defs, D2Motes, FREE_NAV, FeedbackBlock, FrameFx, GradientDefs, HeroContext, LUMO_CAST, LangContext, Lenta, NavBack, NavNext, NextLabel, Panel, ProgressContext, Reaction, ReadinessMeter, Stage, StageHero, T, configureLesson, getAudioEngine, npKey, shuffleArr, ttsConfig, useAdvanceGate, useAudio, useCanAnswer, useLang, useMobileZoom, usePrefersReducedMotion, useRevealScroll, useSfx, useT, makeBrgSeg } from './_kit/index.jsx';
import { BASE_STYLES } from './_kit/styles.js';

// ============================================================================
// DD 3-SINF | Dars10 — "10 va 100 ga ko'paytirish va bo'lish" (num-3-10) | Б2 | razryad siljishi
// Syujet: Bit sayyorasi LUMO, Nur bog'lari — katta bog' shkalasi (SYUJET_3SINF.md Б2 d.11).
//   Pushtalar (10 nur-gul) va maydonchalar (100). Bit — mezbon-gid. FactCard: olovqurt sovuq nuri.
// Infra: grade3 Dars09.jsx dan BAYT-ANIQ ko'chirildi. O'zgarmadi.
// YADRO: x10 da raqamlar BIR xona chapga ko'chadi (birlikka nol); x100 — ikki xona (ikkita nol);
//   bo'lish — teskari yo'l. "Nol qo'shish" fokus emas, XONA KO'CHISHI model.
// MEXANIKA: xuk (s0), jadval-ko'prik tap (s1), RazryadShift x10 (s2), x100+tuzoq (s3), QOIDA (s4),
//   ÷ teskari (s5), 5s soat (s6), MC 3 raund (s7), SARALASH savatlar (s8), ZANJIR sayohati (s9),
//   NumPad trenajyor (s10), xatoni top (s11), masala 38x10 (s12), final 5 savol + FactCard (s13), yakun (s14).
// Misconception: M1 "+10" (23x10=33), M2 bitta nol x100 da (7x100=70), M3 nol o'rtaga (450÷10=405),
//   M4 yo'nalish (bo'lishda o'sish). Kontent: src/books/grade3/KONTENT_3SINF.md (tasdiq 2026-08-04).
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
  lessonId: 'num-3-10',
  lessonTitle: { ru: 'Урок 10. Умножение и деление на 10 и 100', uz: "10-dars. 10 va 100 ga ko'paytirish va bo'lish" }
};
// STRUKTURA (metodist tasdig'i 2026-08-04, KONTENT_3SINF.md): s0 xuk · s1 ko'prik · s2 kashfiyot ×10 ·
// s3 kashfiyot ×100 · s4 QOIDA · s5 kashfiyot ÷ · s6 soat-savol · s7 test MC ×3 · s8 SARALASH ·
// s9 ZANJIR · s10 NumPad ×3 · s11 xatoni top · s12 masala · s13 final 5 savol + FactCard · s14 yakun.
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
  { id: 's9',  type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's10', type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's11', type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's12', type: 'case',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's13', type: 'test',        template: 'custom',   scored: true,  scope: 'final' },
  { id: 's14', type: 'summary',     template: 'custom',   scored: false, scope: 'final' }
];







// ============================================================
// CONTENT — 3-sinf Dars10 «10 va 100 ga ko'paytirish va bo'lish» (num-3-10). RU + UZ to'liq.
// Manba: src/books/grade3/KONTENT_3SINF.md (metodist tasdig'i 2026-08-04).
// Audio TTS-toza: sonlar so'z bilan, matematik belgilar yo'q, bir segment = bir fikr.
// Rekvizit: nur-gul (birlik) · pushta = 10 nur-gul (o'nlik) · maydoncha 10x10 (yuzlik).
// YADRO: x10 da raqamlar BIR xona chapga ko'chadi, birlikka nol; x100 — ikki xona, ikkita nol.
// ============================================================
const CONTENT = {
  // s0 — XUK: 23 pushta x 10 nur-gul
  s0: {
    eyebrow: { ru: 'Миссия', uz: 'Missiya' },
    topic: { ru: 'Тема: умножение и деление на 10 и 100', uz: "Mavzu: 10 va 100 ga ko'paytirish va bo'lish" },
    lead: { ru: 'Вечер в светящемся саду Бита!', uz: "Bitning nurli bog'ida oqshom!" },
    q: { ru: 'В саду 23 грядки, в каждой по 10 огоньков. Как быстро узнать, сколько всего?', uz: "Bog'da 23 pushta bor, har birida 10 nur-gul. Hammasi nechta ekanini qanday tez bilamiz?" },
    opt0: { ru: '23 раза по 10', uz: '23 marta 10 tadan' },
    opt1: { ru: 'Считать по одному', uz: 'Bittalab sanaymiz' },
    opt2: { ru: 'Не знаю', uz: 'Bilmayman' },
    audio: {
      intro: {
        ru: [
          'Тема урока называется умножение и деление на десять и на сто.',
          'Солнце садится, и сад Бита готовится светиться. Огоньки растут грядками, в каждой грядке ровно десять.',
          'Бит касается грядки, и вся грядка вспыхивает разом. В саду двадцать три грядки.',
          'Сколько огоньков загорится? Подумай и выбери.'
        ],
        uz: [
          "Dars mavzusi o'nga va yuzga ko'paytirish va bo'lish deb ataladi.",
          "Quyosh botmoqda, Bitning bog'i porlashga tayyorlanmoqda. Nur-gullar pushta-pushta o'sadi, har pushtada roppa-rosa o'nta.",
          "Bit pushtaga teginadi, butun pushta birdan yonadi. Bog'da yigirma uchta pushta bor.",
          "Nechta nur-gul yonadi? O'ylab ko'ring va tanlang."
        ]
      },
      on_correct: { ru: 'Отличная мысль! Двадцать три раза по десять, это умножение на десять. Сегодня научимся делать это мгновенно.', uz: "Ajoyib fikr! Yigirma uch marta o'ntadan, bu o'nga ko'paytirish. Bugun buni bir zumda qilishni o'rganamiz." },
      on_wrong: { ru: 'Можно и так. Но огоньков здесь сотни, до утра не сосчитаешь. Есть путь быстрее.', uz: "Shunday ham mumkin. Lekin nur-gullar yuzlab, tonggacha sanab bo'lmaydi. Tezroq yo'l bor." },
      on_idk: { ru: 'Честный ответ! К концу урока будешь знать точно. Смотри.', uz: "Halol javob! Dars oxirida aniq bilasiz. Qarang." }
    }
  },

  // s1 — KO'PRIK: jadvaldan o'nlikka (3 pushta tap)
  s1: {
    eyebrow: { ru: 'Вспомним и откроем', uz: 'Eslaymiz va ochamiz' },
    lead: { ru: 'От таблицы — к десяткам.', uz: "Jadvaldan o'nliklarga." },
    counts: { ru: ['Десять.', 'Двадцать.', 'Тридцать!'], uz: ["O'n.", 'Yigirma.', "O'ttiz!"] },
    tap_label: { ru: 'Зажигай грядки по одной', uz: 'Pushtalarni bittalab yoqing' },
    audio: {
      ru: [
        'Таблицу умножения ты уже знаешь. Три умножить на четыре, двенадцать. Это три ряда по четыре.',
        'А теперь три грядки по десять. Зажигай грядки по одной и считай.'
      ],
      uz: [
        "Ko'paytirish jadvalini bilasiz. Uch karra to'rt, o'n ikki. Bu to'rttadan uch qator.",
        "Endi esa o'ntadan uch pushta. Pushtalarni bittalab yoqing va sanang."
      ]
    },
    done_text: { ru: 'Три умножить на десять, тридцать. Была тройка, стало тридцать. Рядом с тройкой появился ноль. Почему? Сейчас разберёмся.', uz: "Uch karra o'n, o'ttiz. Uch edi, o'ttiz bo'ldi. Uch yoniga nol keldi. Nega? Hozir aniqlaymiz." }
  },

  // s2 — KASHFIYOT x10: xonalar ko'chishi (23, keyin o'zi 40 va 51)
  s2: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: { ru: 'Цифры переезжают влево.', uz: "Raqamlar chapga ko'chadi." },
    steps: [
      { from: 23, factor: 10 },
      { from: 40, factor: 10 },
      { from: 51, factor: 10 }
    ],
    btn: { ru: '× 10', uz: '× 10' },
    audio: {
      ru: [
        'Вот число двадцать три на табло разрядов. Двойка в десятках, тройка в единицах.',
        'Нажми умножить на десять и следи за цифрами.',
        'Каждый огонёк стал целой грядкой! Всё выросло в десять раз. Двойка переехала в сотни, тройка в десятки, а на пустое место единиц встал ноль. Двести тридцать.',
        'Теперь сам. Умножь сорок на десять.',
        'Четыреста! Четвёрка уехала в сотни.',
        'И ещё одно. Пятьдесят один умножь на десять.',
        'Пятьсот десять. Цифры едут влево, ноль встаёт справа.'
      ],
      uz: [
        "Mana xonalar taxtasida yigirma uch. Ikki o'nlikda, uch birlikda.",
        "O'nga ko'paytirish tugmasini bosing va raqamlarni kuzating.",
        "Har nur-gul butun pushtaga aylandi! Hammasi o'n barobar o'sdi. Ikki yuzlikka ko'chdi, uch o'nlikka, bo'sh birlik o'rniga esa nol keldi. Ikki yuz o'ttiz.",
        "Endi o'zingiz. Qirqni o'nga ko'paytiring.",
        "To'rt yuz! To'rt yuzlikka ko'chdi.",
        "Yana bitta. Ellik birni o'nga ko'paytiring.",
        "Besh yuz o'n. Raqamlar chapga ko'chadi, nol o'ngdan keladi."
      ]
    }
  },

  // s3 — KASHFIYOT x100 + Bitning tuzog'i (7 -> 700, xato-namoyish 70)
  s3: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: { ru: 'А если умножить на 100?', uz: 'Yuzga ko\'paytirsak-chi?' },
    from: 7,
    btn: { ru: '× 100', uz: '× 100' },
    trap_label: { ru: 'Бит: получилось 70. Верно?', uz: 'Bit: 70 chiqdi. To\'g\'rimi?' },
    trap_opts: { ru: ['Верно', 'Неверно'], uz: ["To'g'ri", "Noto'g'ri"] },
    trap_ci: 1,
    audio: {
      ru: [
        'А если умножить на сто? Огонёк вырастает в целый квадратный участок, сто огоньков! Смотри на семёрку.',
        'Нажми умножить на сто.',
        'Семёрка перепрыгнула сразу через два разряда, в сотни. За ней два ноля. Семьсот.',
        'Бит решил схитрить и переехал только на один разряд. Получилось семьдесят. Верно ли это?'
      ],
      uz: [
        "Yuzga ko'paytirsak-chi? Nur-gul butun kvadrat maydonchaga aylanadi, yuzta nur-gul! Yettiga qarang.",
        "Yuzga ko'paytirish tugmasini bosing.",
        "Yetti birdan ikki xona oshib, yuzlikka sakradi. Ortidan ikkita nol. Yetti yuz.",
        "Bit ayyorlik qilib faqat bitta xonaga ko'chdi. Yetmish chiqdi. Bu to'g'rimi?"
      ]
    },
    trap_correct: { ru: 'Нет! Семьдесят это семь десятков. А нужно семь сотен. Умножаем на сто, значит два разряда и два ноля.', uz: "Yo'q! Yetmish bu yetti o'nlik. Kerakli esa yetti yuzlik. Yuzga ko'paytirsak, ikki xona va ikkita nol." },
    trap_wrong: { ru: 'Посмотри внимательно. Семьдесят это семь десятков, а не семь сотен. Бит ошибся.', uz: "Diqqat bilan qarang. Yetmish bu yetti o'nlik, yetti yuzlik emas. Bit xato qildi." }
  },

  // s4 — SAVOL-OLDIN-QOIDA
  s4: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    q: { ru: 'Что делают цифры при умножении на 10?', uz: "O'nga ko'paytirganda raqamlar nima qiladi?" },
    opts: [
      { ru: 'Переезжают на один разряд влево', uz: 'Bir xona chapga ko\'chadi' },
      { ru: 'Переезжают вправо', uz: 'O\'ngga ko\'chadi' },
      { ru: 'Число просто увеличивается на 10', uz: 'Son shunchaki o\'nga ortadi' },
      { ru: 'Цифры меняются местами', uz: 'Raqamlar o\'rin almashadi' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Вправо цифры едут при делении. Мы умножаем, всё растёт.', uz: "O'ngga bo'lishda ko'chadi. Biz ko'paytiryapmiz, hammasi o'sadi." },
      2: { ru: 'На десять число растёт при сложении. Умножение делает его больше в десять раз.', uz: "O'nga qo'shganda son o'nga ortadi. Ko'paytirish esa uni o'n barobar katta qiladi." },
      3: { ru: 'Цифры не меняются местами. Они все вместе едут влево.', uz: "Raqamlar o'rin almashmaydi. Hammasi birga chapga ko'chadi." }
    },
    rule: { ru: 'При умножении на 10 цифры переезжают на один разряд влево, на место единиц встаёт ноль. При умножении на 100 переезжают на два разряда, и встают два ноля.', uz: "O'nga ko'paytirganda raqamlar bir xona chapga ko'chadi, birlik o'rniga nol keladi. Yuzga ko'paytirganda ikki xona ko'chadi va ikkita nol keladi." },
    audio: {
      ru: ['Мы видели переезд цифр своими глазами. А теперь вопрос.', 'Что делают цифры при умножении на десять? Выбери ответ.'],
      uz: ["Raqamlar ko'chishini o'z ko'zimiz bilan ko'rdik. Endi esa savol.", "O'nga ko'paytirganda raqamlar nima qiladi? Javobni tanlang."]
    },
    on_correct: { ru: 'Именно! Цифры переезжают на один разряд влево, и это правило.', uz: "Aynan! Raqamlar bir xona chapga ko'chadi, va bu qoida." }
  },

  // s5 — KASHFIYOT ÷10 va ÷100 (teskari yo'l): 230->23, o'zi 800->80, 600->6
  s5: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: { ru: 'Деление — обратный путь.', uz: "Bo'lish — teskari yo'l." },
    steps: [
      { from: 230, factor: -10 },
      { from: 800, factor: -10 },
      { from: 600, factor: -100 }
    ],
    audio: {
      ru: [
        'Деление на десять, это обратный путь. Нажми и смотри.',
        'Ноль погас, цифры съехали вправо. Двадцать три. Умножение и деление на десять, туда и обратно.',
        'Сам. Восемьсот раздели на десять.',
        'Восемьдесят.',
        'И шестьсот раздели на сто.',
        'Шесть! Два ноля погасли, шестёрка вернулась в единицы.'
      ],
      uz: [
        "O'nga bo'lish, bu teskari yo'l. Bosing va kuzating.",
        "Nol o'chdi, raqamlar o'ngga ko'chdi. Yigirma uch. O'nga ko'paytirish va bo'lish, borish va qaytish.",
        "O'zingiz. Sakkiz yuzni o'nga bo'ling.",
        'Sakson.',
        "Endi olti yuzni yuzga bo'ling.",
        "Olti! Ikkita nol o'chdi, olti birlikka qaytdi."
      ]
    }
  },

  // s6 — 5 soniya SOAT + savol (45x10)
  s6: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    q: { ru: 'Сколько будет 45 × 10?', uz: '45 × 10 nechta bo\'ladi?' },
    items: [
      {
        ci: 0,
        opts: [{ ru: '450', uz: '450' }, { ru: '55', uz: '55' }, { ru: '405', uz: '405' }, { ru: '4500', uz: '4500' }],
        hints: {
          1: { ru: 'Это сорок пять плюс десять. А нужно в десять раз больше.', uz: "Bu qirq besh qo'shuv o'n. Kerakli esa o'n barobar katta." },
          2: { ru: 'Ноль встаёт в конец, в единицы, а не в середину.', uz: "Nol oxiriga, birlikka keladi, o'rtaga emas." },
          3: { ru: 'Это умножение на сто. У нас на десять, один ноль.', uz: "Bu yuzga ko'paytirilgan. Bizda o'nga, bitta nol." }
        }
      }
    ],
    audio: {
      intro: { ru: 'Проверь себя. Сорок пять умножить на десять. Пять секунд подумай, не спеши.', uz: "O'zingizni sinang. Qirq beshni o'nga ko'paytiring. Besh soniya o'ylang, shoshilmang." },
      on_correct: { ru: 'Четыреста пятьдесят!', uz: "To'rt yuz ellik!" },
      on_wrong: { ru: 'Вспомни переезд цифр. Попробуй ещё.', uz: "Raqamlar ko'chishini eslang. Yana urinib ko'ring." }
    }
  },

  // s7 — TEST MC, 3 raund (4 variant)
  s7: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    q_mul10: { ru: 'Сколько будет 23 × 10?', uz: '23 × 10 nechta bo\'ladi?' },
    q_mul100: { ru: 'Сколько будет 7 × 100?', uz: '7 × 100 nechta bo\'ladi?' },
    q_div10: { ru: 'Сколько будет 450 ÷ 10?', uz: '450 ÷ 10 nechta bo\'ladi?' },
    items: [
      {
        qk: 'q_mul10', ci: 0,
        opts: [{ ru: '230', uz: '230' }, { ru: '33', uz: '33' }, { ru: '203', uz: '203' }, { ru: '2300', uz: '2300' }],
        hints: {
          1: { ru: 'Это плюс десять. Умножить на десять, значит в десять раз больше.', uz: "Bu qo'shuv o'n. O'nga ko'paytirish, demak o'n barobar katta." },
          2: { ru: 'Ноль встаёт в конец, а не в середину. Цифры едут вместе.', uz: "Nol oxirga keladi, o'rtaga emas. Raqamlar birga ko'chadi." },
          3: { ru: 'Два ноля, это умножение на сто. У нас на десять.', uz: "Ikkita nol, bu yuzga ko'paytirish. Bizda o'nga." }
        }
      },
      {
        qk: 'q_mul100', ci: 0,
        opts: [{ ru: '700', uz: '700' }, { ru: '70', uz: '70' }, { ru: '107', uz: '107' }, { ru: '7100', uz: '7100' }],
        hints: {
          1: { ru: 'Один разряд мало. На сто, значит два разряда, два ноля.', uz: "Bitta xona kam. Yuzga bo'lsa, ikki xona, ikkita nol." },
          2: { ru: 'Это сто плюс семь. А нужно семь раз по сто.', uz: "Bu yuz qo'shuv yetti. Kerakli esa yetti marta yuztadan." },
          3: { ru: 'Семь и сто нельзя просто поставить рядом. Семь сотен, это семьсот.', uz: "Yetti bilan yuzni shunchaki yonma-yon qo'yib bo'lmaydi. Yetti yuzlik, bu yetti yuz." }
        }
      },
      {
        qk: 'q_div10', ci: 0,
        opts: [{ ru: '45', uz: '45' }, { ru: '440', uz: '440' }, { ru: '405', uz: '405' }, { ru: '4500', uz: '4500' }],
        hints: {
          1: { ru: 'Это минус десять. Мы делим, значит в десять раз меньше.', uz: "Bu ayiruv o'n. Biz bo'lyapmiz, demak o'n barobar kichik." },
          2: { ru: 'Гаснет ноль единиц, а не цифра из середины.', uz: "Birlikdagi nol o'chadi, o'rtadagi raqam emas." },
          3: { ru: 'Число выросло. А при делении оно уменьшается.', uz: "Son o'sib ketdi. Bo'lishda esa u kichrayadi." }
        }
      }
    ],
    audio: {
      intro: { ru: 'Три задания. Цифры переезжают, ты следишь.', uz: "Uchta topshiriq. Raqamlar ko'chadi, siz kuzatasiz." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Вспомни правило переезда. Попробуй ещё.', uz: "Ko'chish qoidasini eslang. Yana urinib ko'ring." }
    }
  },

  // s8 — SARALASH «Nima bo'ldi?» (tap-to-bin, kartalar ketma-ket)
  s8: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    q: { ru: 'Что произошло с числом?', uz: 'Songa nima bo\'ldi?' },
    bins: [
      { key: 'm10', label: { ru: '× 10', uz: '× 10' } },
      { key: 'm100', label: { ru: '× 100', uz: '× 100' } },
      { key: 'd10', label: { ru: '÷ 10', uz: '÷ 10' } }
    ],
    cards: [
      { from: 40, to: 400, bin: 'm10' },
      { from: 250, to: 25, bin: 'd10' },
      { from: 3, to: 300, bin: 'm100' },
      { from: 62, to: 620, bin: 'm10' },
      { from: 90, to: 9, bin: 'd10' }
    ],
    ok_word: { m10: { ru: 'Точно, на десять!', uz: "Aniq, o'nga!" }, m100: { ru: 'Да, на сто!', uz: 'Ha, yuzga!' }, d10: { ru: 'Верно, разделили!', uz: "To'g'ri, bo'lindi!" } },
    wrong_map: {
      'shrunk-mul': { ru: 'Число стало меньше. А умножение делает больше. Это деление.', uz: "Son kichraydi. Ko'paytirish esa kattalashtiradi. Bu bo'lish." },
      'm100-as-m10': { ru: 'Смотри, цифра уехала на два разряда, за ней два ноля. Это не десять.', uz: "Qarang, raqam ikki xona ko'chdi, ortidan ikkita nol. Bu o'n emas." },
      'm10-as-m100': { ru: 'Появился только один ноль. На сто, это два ноля.', uz: "Faqat bitta nol paydo bo'ldi. Yuzga bo'lsa, ikkita nol." },
      'grew-div': { ru: 'Число выросло. А деление уменьшает.', uz: "Son o'sdi. Bo'lish esa kichraytiradi." }
    },
    audio: {
      intro: { ru: 'Огоньки в саду превращались, а Бит не записал как. Посмотри на каждую карточку и определи, что произошло.', uz: "Bog'dagi nur-gullar aylandi, Bit esa qandayligini yozib olmadi. Har kartaga qarang va nima bo'lganini aniqlang." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Сравни. Ноль появился или пропал? Число выросло или уменьшилось?', uz: "Solishtiring. Nol paydo bo'ldimi yoki yo'qoldimi? Son o'sdimi yoki kichraydimi?" }
    }
  },

  // s9 — ZANJIR SAYOHATI: 4 -> x10 -> ? -> x10 -> ? -> ÷100 -> ?
  s9: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    lead: { ru: 'Проведи четвёрку по цепочке превращений.', uz: "To'rtni aylanishlar zanjiri bo'ylab olib o'ting." },
    steps: [
      {
        q: { ru: 'Сколько будет 4 × 10?', uz: '4 × 10 nechta?' },
        from: 4, factor: 10, ans: 40, ci: 0,
        opts: [{ ru: '40', uz: '40' }, { ru: '14', uz: '14' }, { ru: '44', uz: '44' }, { ru: '400', uz: '400' }],
        hints: {
          1: { ru: 'Это четыре плюс десять. Нужно в десять раз больше.', uz: "Bu to'rt qo'shuv o'n. O'n barobar katta kerak." },
          2: { ru: 'Четвёрка не удваивается. Она переезжает влево, справа ноль.', uz: "To'rt ikkilanmaydi. U chapga ko'chadi, o'ngdan nol." },
          3: { ru: 'Это сразу на сто. Пока только на десять.', uz: "Bu birdan yuzga. Hozircha faqat o'nga." }
        },
        ok: { ru: 'Сорок! Едем дальше.', uz: 'Qirq! Davom etamiz.' }
      },
      {
        q: { ru: 'Сколько будет 40 × 10?', uz: '40 × 10 nechta?' },
        from: 40, factor: 10, ans: 400, ci: 0,
        opts: [{ ru: '400', uz: '400' }, { ru: '50', uz: '50' }, { ru: '4000', uz: '4000' }, { ru: '410', uz: '410' }],
        hints: {
          1: { ru: 'Это сорок плюс десять. А нужно в десять раз больше.', uz: "Bu qirq qo'shuv o'n. O'n barobar katta kerak." },
          2: { ru: 'Слишком далеко. Один переезд, один ноль.', uz: 'Juda uzoq. Bitta ko\'chish, bitta nol.' },
          3: { ru: 'Ноль встаёт на место единиц, а не внутрь числа.', uz: 'Nol birlik o\'rniga keladi, son ichiga emas.' }
        },
        ok: { ru: 'Четыреста! Четвёрка добралась до сотен.', uz: "To'rt yuz! To'rt yuzlikkacha yetib keldi." }
      },
      {
        q: { ru: 'Сколько будет 400 ÷ 100?', uz: '400 ÷ 100 nechta?' },
        from: 400, factor: -100, ans: 4, ci: 0,
        opts: [{ ru: '4', uz: '4' }, { ru: '40', uz: '40' }, { ru: '300', uz: '300' }, { ru: '4000', uz: '4000' }],
        hints: {
          1: { ru: 'Погас только один ноль. Делим на сто, гаснут два.', uz: "Faqat bitta nol o'chdi. Yuzga bo'lsak, ikkitasi o'chadi." },
          2: { ru: 'Это минус сто. Мы делим.', uz: 'Bu ayiruv yuz. Biz bo\'lyapmiz.' },
          3: { ru: 'Число выросло, а деление уменьшает.', uz: "Son o'sdi, bo'lish esa kichraytiradi." }
        },
        ok: { ru: 'Четыре! Число вернулось домой.', uz: "To'rt! Son uyiga qaytdi." }
      }
    ],
    payoff: { ru: 'Смотри, что получилось. Дважды умножили на десять, и вышло как один раз на сто. А потом разделили на сто, и четвёрка вернулась домой. Умножение и деление, дорога туда и обратно.', uz: "Qarang, nima bo'ldi. Ikki marta o'nga ko'paytirdik, xuddi bir marta yuzga ko'paytirgandek chiqdi. Keyin yuzga bo'ldik, to'rt uyiga qaytdi. Ko'paytirish va bo'lish, borish va qaytish yo'li." },
    audio: {
      intro: { ru: 'Четвёрка отправляется в путешествие по саду. Проведи её по цепочке превращений.', uz: "To'rt raqami bog' bo'ylab sayohatga chiqadi. Uni aylanishlar zanjiri bo'ylab olib o'ting." },
      on_wrong: { ru: 'Вспомни переезд цифр. Попробуй ещё.', uz: "Raqamlar ko'chishini eslang. Yana urinib ko'ring." }
    }
  },

  // s10 — TRENAJYOR NumPad, 3 topshiriq
  s10: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    items: [
      { q: { ru: 'Набери ответ: 60 × 10.', uz: 'Javobni ter: 60 × 10.' }, ans: 600, hint: { ru: 'Цифры влево, справа ноль. Шесть десятков станут шестью сотнями.', uz: "Raqamlar chapga, o'ngdan nol. Olti o'nlik olti yuzlik bo'ladi." } },
      { q: { ru: 'Набери ответ: 9 × 100.', uz: 'Javobni ter: 9 × 100.' }, ans: 900, hint: { ru: 'Два разряда влево, два ноля.', uz: 'Ikki xona chapga, ikkita nol.' } },
      { q: { ru: 'Набери ответ: 320 ÷ 10.', uz: 'Javobni ter: 320 ÷ 10.' }, ans: 32, hint: { ru: 'Ноль единиц гаснет, цифры съезжают вправо.', uz: "Birlikdagi nol o'chadi, raqamlar o'ngga ko'chadi." } }
    ],
    audio: {
      intro: { ru: 'Теперь без готовых вариантов. Набери ответ сам.', uz: "Endi tayyor variantlarsiz. Javobni o'zingiz tering." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." }
    }
  },

  // s11 — XATONI TOP (4 yozuv)
  s11: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    q: { ru: 'Какая запись неверна?', uz: "Qaysi yozuv noto'g'ri?" },
    items: [
      {
        stmts: ['8 × 100 = 80', '30 ÷ 10 = 3', '12 × 10 = 120', '50 ÷ 10 = 5'],
        wrong: 0,
        hint: { ru: 'Эта запись верна. Проверь переезд разрядов в других.', uz: "Bu yozuv to'g'ri. Boshqalarida xonalar ko'chishini tekshiring." }
      }
    ],
    audio: {
      intro: { ru: 'Бит записал четыре примера, в один закралась ошибка. Найди её.', uz: "Bit to'rtta misol yozdi, bittasiga xato yashiringan. Uni toping." },
      on_correct: { ru: 'Да! Восемьдесят это восемь десятков. А умножили на сто, значит восемь сотен, восемьсот.', uz: "Ha! Sakson bu sakkiz o'nlik. Yuzga ko'paytirilgan, demak sakkiz yuzlik, sakkiz yuz." },
      on_wrong: { ru: 'Эта запись верна. Проверь переезд разрядов в других.', uz: "Bu yozuv to'g'ri. Boshqalarida xonalar ko'chishini tekshiring." }
    }
  },

  // s12 — MASALA (case): 38 pushta x 10, NumPad, verniygacha
  s12: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    lead: { ru: 'Бит подготовил 38 грядок, в каждой по 10 огоньков.', uz: "Bit 38 pushta tayyorladi, har birida 10 nur-gul." },
    q: { ru: 'Сколько огоньков зажжётся вечером?', uz: 'Kechqurun nechta nur-gul yonadi?' },
    ans: 380,
    setup_audio: { ru: 'Вечер близко. Бит подготовил тридцать восемь грядок, в каждой по десять огоньков.', uz: "Oqshom yaqin. Bit o'ttiz sakkizta pushta tayyorladi, har birida o'ntadan nur-gul." },
    audio: {
      intro: { ru: 'Помоги Биту посчитать огоньки. Набери ответ.', uz: "Bitga nur-gullarni sanashga yordam bering. Javobni tering." },
      on_correct: { ru: 'Триста восемьдесят огоньков! Сад готов к вечеру.', uz: "Uch yuz sakson nur-gul! Bog' oqshomga tayyor." },
      on_wrong: { ru: 'Тридцать восемь раз по десять. Цифры влево, ноль справа.', uz: "O'ttiz sakkiz marta o'ntadan. Raqamlar chapga, nol o'ngdan." }
    }
  },

  // s13 — FINAL panel (5 savol) + FactCard (o'sha ekranda, 5-savoldan keyin)
  s13: {
    eyebrow: { ru: 'Финал', uz: 'Final' },
    intro_line: { ru: 'Финальная проверка сада. Пять заданий.', uz: "Bog'ning yakuniy tekshiruvi. Beshta topshiriq." },
    items: [
      {
        kind: 'num', ans: 520,
        q: { ru: 'Набери ответ: 52 × 10.', uz: 'Javobni ter: 52 × 10.' },
        hint: { ru: 'Цифры влево, ноль в единицы.', uz: 'Raqamlar chapga, nol birlikka.' }
      },
      {
        kind: 'mc',
        q: { ru: 'Сколько будет 700 ÷ 100?', uz: '700 ÷ 100 nechta bo\'ladi?' },
        opt0: { ru: '7', uz: '7' },
        opt1: { ru: '70', uz: '70' },
        opt2: { ru: '600', uz: '600' },
        opt3: { ru: '7000', uz: '7000' },
        wrong_1: { ru: 'Гасим два ноля, а не один.', uz: "Ikkita nolni o'chiramiz, bittasini emas." },
        wrong_2: { ru: 'Это минус сто. Мы делим.', uz: 'Bu ayiruv yuz. Biz bo\'lyapmiz.' },
        wrong_3: { ru: 'Число выросло, а при делении оно уменьшается.', uz: "Son o'sdi, bo'lishda esa kichrayadi." }
      },
      {
        kind: 'mc',
        q: { ru: 'В одном участке 100 огоньков. Сколько огоньков в 6 участках?', uz: 'Bitta maydonchada 100 nur-gul. 6 maydonchada nechta nur-gul bor?' },
        opt0: { ru: '600', uz: '600' },
        opt1: { ru: '60', uz: '60' },
        opt2: { ru: '106', uz: '106' },
        opt3: { ru: '6000', uz: '6000' },
        wrong_1: { ru: 'Это шесть десятков. В участке сотня.', uz: "Bu olti o'nlik. Maydonchada yuzta." },
        wrong_2: { ru: 'Это сто плюс шесть. А нужно шесть раз по сто.', uz: "Bu yuz qo'shuv olti. Kerakli esa olti marta yuztadan." },
        wrong_3: { ru: 'Слишком много. Шесть сотен, это шестьсот.', uz: 'Juda ko\'p. Olti yuzlik, bu olti yuz.' }
      },
      {
        kind: 'num', ans: 90,
        q: { ru: 'Набери ответ: 900 ÷ 10.', uz: 'Javobni ter: 900 ÷ 10.' },
        hint: { ru: 'Ноль единиц гаснет.', uz: "Birlikdagi nol o'chadi." }
      },
      {
        kind: 'mc',
        q: { ru: 'Какая запись неверна?', uz: "Qaysi yozuv noto'g'ri?" },
        opt0: { ru: '6 × 100 = 60', uz: '6 × 100 = 60' },
        opt1: { ru: '30 × 10 = 300', uz: '30 × 10 = 300' },
        opt2: { ru: '500 ÷ 100 = 5', uz: '500 ÷ 100 = 5' },
        opt3: { ru: '14 × 10 = 140', uz: '14 × 10 = 140' },
        wrong_1: { ru: 'Эта запись верна. Ищи другую.', uz: "Bu yozuv to'g'ri. Boshqasini qidiring." },
        wrong_2: { ru: 'Эта запись верна. Ищи другую.', uz: "Bu yozuv to'g'ri. Boshqasini qidiring." },
        wrong_3: { ru: 'Эта запись верна. Ищи другую.', uz: "Bu yozuv to'g'ri. Boshqasini qidiring." }
      }
    ],
    fact_badge: { ru: 'Знаешь ли ты?', uz: 'Bilasizmi?' },
    fact_text: { ru: 'Свет светлячка холодный: почти вся энергия становится светом, а не теплом. А у старой лампочки наоборот, большая часть энергии уходит в тепло.', uz: "Olovqurt nuri sovuq, energiyaning deyarli hammasi issiqlikka emas, yorug'likka aylanadi. Eski cho'g'lanma lampada esa aksincha, energiyaning ko'p qismi issiqlikka ketadi." },
    fact_audio: { ru: 'Свет светлячка холодный. Почти вся энергия становится светом, а не теплом. У старой лампочки наоборот, большая часть энергии уходит в тепло. Огоньки в саду Бита светят так же холодно, как светлячки.', uz: "Olovqurt nuri sovuq. Energiyaning deyarli hammasi issiqlikka emas, yorug'likka aylanadi. Eski cho'g'lanma lampada esa aksincha, energiyaning ko'p qismi issiqlikka ketadi. Bit bog'idagi nur-gullar ham olovqurt kabi sovuq nur sochadi." },
    audio: {
      intro: { ru: 'Финальная проверка сада. Пять заданий, отвечай на каждое.', uz: "Bog'ning yakuniy tekshiruvi. Beshta topshiriq, har biriga javob bering." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Посмотри разбор и попробуй ещё.', uz: "Tahlilga qarang va yana urinib ko'ring." }
    }
  },

  // s14 — YAKUN
  s14: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    praise: { ru: 'Молодец!', uz: 'Barakalla!' },
    mission_done: { ru: 'Сад зажжён!', uz: "Bog' yoqildi!" },
    cando: { ru: 'Теперь ты умеешь умножать и делить на 10 и 100 мгновенно.', uz: "Endi siz 10 va 100 ga bir zumda ko'paytira va bo'la olasiz." },
    rule_recap: { ru: 'При ×10 цифры переезжают на один разряд влево, на место единиц встаёт ноль. При ×100 — на два разряда и два ноля. Деление — обратный путь.', uz: "10 ga ko'paytirganda raqamlar bir xona chapga ko'chadi, birlik o'rniga nol keladi. 100 ga — ikki xona va ikkita nol. Bo'lish — teskari yo'l." },
    conn_label_refs: { ru: 'Опирается на', uz: 'Tayanadi' },
    conn_refs: { ru: 'урок 9: таблица умножения; блок 1: разряды', uz: "9-dars: ko'paytirish jadvali; 1-blok: xonalar" },
    conn_label_next: { ru: 'Дальше', uz: 'Keyingi' },
    conn_next: { ru: 'умножение суммы', uz: "yig'indini ko'paytirish" },
    audio: {
      ru: 'Теперь ты знаешь секрет десятки и сотни. Цифры переезжают, а ноль занимает пустое место. А если грядок двадцать три и каждую нужно умножить на четыре? Это уже хитрее. Разберёмся в следующем уроке!',
      uz: "Endi siz o'n va yuz sirini bilasiz. Raqamlar ko'chadi, nol esa bo'sh o'rinni egallaydi. Agar pushta yigirma uchta bo'lsa va har birini to'rtga ko'paytirish kerak bo'lsa-chi? Bu endi qiziqroq. Keyingi darsda aniqlaymiz!"
    }
  }
};

// slaydlararo ko'priklar (audio-intro boshiga; ekranda ko'rinmaydi). TTS-toza.
const BRIDGES = {
  s1:  { ru: 'Начнём со знакомой таблицы.', uz: 'Tanish jadvaldan boshlaymiz.' },
  s2:  { ru: 'Теперь табло разрядов.', uz: 'Endi xonalar taxtasi.' },
  s3:  { ru: 'А теперь умножим на сто.', uz: 'Endi yuzga ko\'paytiramiz.' },
  s4:  { ru: 'Запишем это правилом.', uz: 'Buni qoida qilib olamiz.' },
  s5:  { ru: 'Пойдём обратной дорогой.', uz: 'Teskari yo\'ldan yuramiz.' },
  s6:  { ru: 'Проверь себя на скорость.', uz: "O'zingizni tezlikka sinang." },
  s7:  { ru: 'Правило знаем. Считай сам.', uz: "Qoidani bilamiz. O'zingiz sanang." },
  s8:  { ru: 'Теперь задача наоборот.', uz: 'Endi teskari topshiriq.' },
  s9:  { ru: 'Отправимся в путешествие.', uz: 'Sayohatga chiqamiz.' },
  s10: { ru: 'Теперь набирай ответы сам.', uz: "Endi javoblarni o'zingiz tering." },
  s11: { ru: 'Проверим записи Бита.', uz: 'Bitning yozuvlarini tekshiramiz.' },
  s12: { ru: 'Вечер близко, поможем Биту.', uz: 'Oqshom yaqin, Bitga yordam beramiz.' },
  s13: { ru: 'Финальная проверка сада.', uz: "Bog'ning yakuniy tekshiruvi." },
  s14: { ru: 'Сад зажжён. Идём дальше!', uz: "Bog' yoqildi. Davom etamiz!" }
};

// s14 payoff (xulosadan oldin aytiladi)
const S14_PAYOFF = {
  ru: 'Миссия выполнена! Весь сад зажёгся одним умножением. Спасибо за помощь!',
  uz: "Missiya bajarildi! Butun bog' bitta ko'paytirish bilan yondi. Yordamingiz uchun rahmat!"
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
      <GardenTerraceBg/>
      <div className="lm-scene-cast">
        {LUMO_CAST.slice(0, 2).map(kid)}
        <span className={`lm-crew lm-crew-host ${gathered ? 'd2-bit-cheer' : 'lm-bob'}`}><span className="g1-cast-fig"><BitSVG state={gathered ? 'happy' : 'present'}/></span></span>
        {LUMO_CAST.slice(2).map((c, i) => kid(c, i + 2))}
      </div>
    </div>
  );
};




// ============================================================
// EKRANLAR — Dars09 «Ko'paytirish jadvali» (Б2 «Nur bog'lari»)
// ============================================================



// --- NUR BOG'I TERRASALARI SAHNASI (D10): qatorli porlovchi o'simliklar (massiv)
const GardenTerraceBg = () => (
  <svg className="lm-scene-bg" viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="g0sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8E86C6"/><stop offset="48%" stopColor="#C79AB4"/><stop offset="100%" stopColor="#F0D2A0"/></linearGradient>
      <linearGradient id="g0wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E2CFAE"/><stop offset="100%" stopColor="#CBB488"/></linearGradient>
      <linearGradient id="g0floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#D6C29A"/><stop offset="100%" stopColor="#B69C70"/></linearGradient>
      <linearGradient id="g0col" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#B49A6E"/><stop offset="42%" stopColor="#E4D2AC"/><stop offset="100%" stopColor="#B49A6E"/></linearGradient>
      <linearGradient id="g0bed" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#A87E5C"/><stop offset="100%" stopColor="#7C5A3E"/></linearGradient>
      <radialGradient id="g0sun" cx="50%" cy="50%" r="55%"><stop offset="0%" stopColor="#FFE6B0"/><stop offset="55%" stopColor="#F0985A"/><stop offset="100%" stopColor="#C0502E" stopOpacity="0"/></radialGradient>
    </defs>
    {/* --- OSMON + sayyora + quyosh --- */}
    <rect x="0" y="0" width="400" height="130" fill="url(#g0sky)"/>
    <g><circle cx="70" cy="40" r="9" fill="#C79AD6"/><ellipse cx="70" cy="40" rx="16" ry="4" fill="none" stroke="#E6C8F0" strokeWidth="1.6" opacity="0.85"/></g>
    <circle cx="330" cy="42" r="18" fill="url(#g0sun)"/><circle cx="330" cy="42" r="8" fill="#FFD89A"/>
    {/* uzoq shahar silueti (bog' devori ortida) */}
    <g opacity="0.5" fill="#B98BA8"><rect x="60" y="98" width="16" height="24" rx="2"/><rect x="82" y="104" width="11" height="18" rx="2"/><rect x="300" y="100" width="14" height="22" rx="2"/><rect x="322" y="106" width="10" height="16" rx="2"/><rect x="180" y="96" width="13" height="26" rx="2"/></g>
    {/* bog' o'rtaligi (midground to'ldirish — oq bo'shliq bo'lmasin) */}
    <rect x="0" y="120" width="400" height="58" fill="url(#g0floor)"/>
    {/* --- BOG' DEVORI (past, panjarali) --- */}
    <rect x="0" y="120" width="400" height="12" fill="url(#g0wall)"/><rect x="0" y="118" width="400" height="4" rx="2" fill="#EAD9B8"/>
    <g stroke="#B49A6E" strokeWidth="1.2" opacity="0.6">{[40, 90, 140, 260, 310, 360].map((x, i) => <line key={i} x1={x} y1="122" x2={x} y2="130"/>)}</g>
    {/* --- MARKAZIY MASSIV: 3 x 4 o'simlik (ko'paytirish) --- */}
    <rect x="104" y="146" width="192" height="16" rx="4" fill="url(#g0bed)"/><rect x="104" y="146" width="192" height="4" rx="2" fill="#B78E64"/>
    <g><path d="M130 148 Q128 127 130 111" stroke="#6FBF8E" strokeWidth="2.2" fill="none"/><path d="M130 126 q-7 -3 -10 -9 q8 1 11 7Z" fill="#7CCFA0"/><path d="M130 120 q7 -3 10 -9 q-8 1 -11 7Z" fill="#8FD8B0"/><circle cx="130" cy="106" r="6" fill="#FFA6D0" stroke="#E87FB0" strokeWidth="1"/><circle className="lm-glow" style={{ animationDelay: '0s' }} cx="130" cy="106" r="3" fill="#FFF4D0"/></g>
    <g><path d="M172 148 Q170 127 172 111" stroke="#6FBF8E" strokeWidth="2.2" fill="none"/><path d="M172 126 q-7 -3 -10 -9 q8 1 11 7Z" fill="#7CCFA0"/><path d="M172 120 q7 -3 10 -9 q-8 1 -11 7Z" fill="#8FD8B0"/><circle cx="172" cy="106" r="6" fill="#8FE8C0" stroke="#5FC898" strokeWidth="1"/><circle className="lm-glow" style={{ animationDelay: '0.18s' }} cx="172" cy="106" r="3" fill="#FFF4D0"/></g>
    <g><path d="M214 148 Q212 127 214 111" stroke="#6FBF8E" strokeWidth="2.2" fill="none"/><path d="M214 126 q-7 -3 -10 -9 q8 1 11 7Z" fill="#7CCFA0"/><path d="M214 120 q7 -3 10 -9 q-8 1 -11 7Z" fill="#8FD8B0"/><circle cx="214" cy="106" r="6" fill="#FFA6D0" stroke="#E87FB0" strokeWidth="1"/><circle className="lm-glow" style={{ animationDelay: '0.36s' }} cx="214" cy="106" r="3" fill="#FFF4D0"/></g>
    <g><path d="M256 148 Q254 127 256 111" stroke="#6FBF8E" strokeWidth="2.2" fill="none"/><path d="M256 126 q-7 -3 -10 -9 q8 1 11 7Z" fill="#7CCFA0"/><path d="M256 120 q7 -3 10 -9 q-8 1 -11 7Z" fill="#8FD8B0"/><circle cx="256" cy="106" r="6" fill="#8FE8C0" stroke="#5FC898" strokeWidth="1"/><circle className="lm-glow" style={{ animationDelay: '0.54s' }} cx="256" cy="106" r="3" fill="#FFF4D0"/></g>
    <g><path d="M130 148 Q128 136 130 129" stroke="#6FBF8E" strokeWidth="2.2" fill="none"/><path d="M130 144 q-7 -3 -10 -9 q8 1 11 7Z" fill="#7CCFA0"/><path d="M130 138 q7 -3 10 -9 q-8 1 -11 7Z" fill="#8FD8B0"/><circle cx="130" cy="124" r="6" fill="#8FE8C0" stroke="#5FC898" strokeWidth="1"/><circle className="lm-glow" style={{ animationDelay: '0.72s' }} cx="130" cy="124" r="3" fill="#FFF4D0"/></g>
    <g><path d="M172 148 Q170 136 172 129" stroke="#6FBF8E" strokeWidth="2.2" fill="none"/><path d="M172 144 q-7 -3 -10 -9 q8 1 11 7Z" fill="#7CCFA0"/><path d="M172 138 q7 -3 10 -9 q-8 1 -11 7Z" fill="#8FD8B0"/><circle cx="172" cy="124" r="6" fill="#FFA6D0" stroke="#E87FB0" strokeWidth="1"/><circle className="lm-glow" style={{ animationDelay: '0.8999999999999999s' }} cx="172" cy="124" r="3" fill="#FFF4D0"/></g>
    <g><path d="M214 148 Q212 136 214 129" stroke="#6FBF8E" strokeWidth="2.2" fill="none"/><path d="M214 144 q-7 -3 -10 -9 q8 1 11 7Z" fill="#7CCFA0"/><path d="M214 138 q7 -3 10 -9 q-8 1 -11 7Z" fill="#8FD8B0"/><circle cx="214" cy="124" r="6" fill="#8FE8C0" stroke="#5FC898" strokeWidth="1"/><circle className="lm-glow" style={{ animationDelay: '1.08s' }} cx="214" cy="124" r="3" fill="#FFF4D0"/></g>
    <g><path d="M256 148 Q254 136 256 129" stroke="#6FBF8E" strokeWidth="2.2" fill="none"/><path d="M256 144 q-7 -3 -10 -9 q8 1 11 7Z" fill="#7CCFA0"/><path d="M256 138 q7 -3 10 -9 q-8 1 -11 7Z" fill="#8FD8B0"/><circle cx="256" cy="124" r="6" fill="#FFA6D0" stroke="#E87FB0" strokeWidth="1"/><circle className="lm-glow" style={{ animationDelay: '1.26s' }} cx="256" cy="124" r="3" fill="#FFF4D0"/></g>
    <g><path d="M130 148 Q128 145 130 147" stroke="#6FBF8E" strokeWidth="2.2" fill="none"/><path d="M130 162 q-7 -3 -10 -9 q8 1 11 7Z" fill="#7CCFA0"/><path d="M130 156 q7 -3 10 -9 q-8 1 -11 7Z" fill="#8FD8B0"/><circle cx="130" cy="142" r="6" fill="#FFA6D0" stroke="#E87FB0" strokeWidth="1"/><circle className="lm-glow" style={{ animationDelay: '1.44s' }} cx="130" cy="142" r="3" fill="#FFF4D0"/></g>
    <g><path d="M172 148 Q170 145 172 147" stroke="#6FBF8E" strokeWidth="2.2" fill="none"/><path d="M172 162 q-7 -3 -10 -9 q8 1 11 7Z" fill="#7CCFA0"/><path d="M172 156 q7 -3 10 -9 q-8 1 -11 7Z" fill="#8FD8B0"/><circle cx="172" cy="142" r="6" fill="#8FE8C0" stroke="#5FC898" strokeWidth="1"/><circle className="lm-glow" style={{ animationDelay: '1.6199999999999999s' }} cx="172" cy="142" r="3" fill="#FFF4D0"/></g>
    <g><path d="M214 148 Q212 145 214 147" stroke="#6FBF8E" strokeWidth="2.2" fill="none"/><path d="M214 162 q-7 -3 -10 -9 q8 1 11 7Z" fill="#7CCFA0"/><path d="M214 156 q7 -3 10 -9 q-8 1 -11 7Z" fill="#8FD8B0"/><circle cx="214" cy="142" r="6" fill="#FFA6D0" stroke="#E87FB0" strokeWidth="1"/><circle className="lm-glow" style={{ animationDelay: '1.7999999999999998s' }} cx="214" cy="142" r="3" fill="#FFF4D0"/></g>
    <g><path d="M256 148 Q254 145 256 147" stroke="#6FBF8E" strokeWidth="2.2" fill="none"/><path d="M256 162 q-7 -3 -10 -9 q8 1 11 7Z" fill="#7CCFA0"/><path d="M256 156 q7 -3 10 -9 q-8 1 -11 7Z" fill="#8FD8B0"/><circle cx="256" cy="142" r="6" fill="#8FE8C0" stroke="#5FC898" strokeWidth="1"/><circle className="lm-glow" style={{ animationDelay: '1.98s' }} cx="256" cy="142" r="3" fill="#FFF4D0"/></g>
    {/* massiv ramkasi + tenglama banneri (pergoladan osilgan) */}
    <path d="M160 52 h80 v14 l-6 5 l-6 -5 l-6 5 l-6 -5 l-6 5 l-6 -5 l-6 5 l-6 -5 l-6 5 l-6 -5 l-6 5 Z" fill="#E8B4C4" stroke="#D08FA6" strokeWidth="1"/>
    <text x="200" y="63" textAnchor="middle" fontSize="11" fontWeight="800" fill="#8A4E64" fontFamily="'JetBrains Mono', monospace">3 × 4 = 12</text>
    {/* --- PERGOLA (ramka: 2 ustun + ustki to'sinlar + osma uzumcha) --- */}
    {[26, 356].map((x, i) => (
      <g key={`col${i}`}>
        <rect x={x - 6} y="40" width="30" height="12" rx="3" fill="url(#g0col)" stroke="#9A855C" strokeWidth="1"/>
        <rect x={x} y="52" width="18" height="124" fill="url(#g0col)" stroke="#9A855C" strokeWidth="1"/>
        <rect x={x - 4} y="168" width="26" height="10" rx="2" fill="url(#g0col)" stroke="#9A855C" strokeWidth="1"/>
        <path d={`M${x + 9} 66 Q${x + 3} 90 ${x + 9} 116 Q${x + 15} 140 ${x + 9} 164`} fill="none" stroke="#6FBF8E" strokeWidth="2"/>
        <g fill="#8FD8A8">{[80, 120, 150].map((cy, k) => <circle key={k} cx={x + (k % 2 ? 4 : 14)} cy={cy} r="2.4"/>)}</g>
      </g>
    ))}
    {/* ustki to'sinlar */}
    <g fill="url(#g0col)" stroke="#9A855C" strokeWidth="0.8" opacity="0.9">{[44, 92, 140, 200, 260, 308, 356].map((x, i) => <rect key={i} x={x} y="40" width="8" height="7" rx="2"/>)}</g>
    <rect x="30" y="40" width="340" height="6" rx="2" fill="#C9B084"/>
    {/* osma gul-savatlar */}
    {[120, 280].map((x, i) => (
      <g key={`bk${i}`}><line x1={x} y1="46" x2={x} y2="58" stroke="#9A855C" strokeWidth="1"/><path d={`M${x - 8} 58 h16 l-2 8 h-12 Z`} fill="#B78E64"/><circle className="lm-glow" cx={x} cy="60" r="3.5" fill="#FFB6D0"/></g>
    ))}
    {/* --- POL: bog' yo'lagi + perspektiva --- */}
    <rect x="0" y="176" width="400" height="54" fill="url(#g0floor)"/>
    <line x1="0" y1="176" x2="400" y2="176" stroke="#9A8058" strokeWidth="2"/>
    <g stroke="#A98C64" strokeWidth="1" opacity="0.4"><path d="M40 230 L182 178"/><path d="M140 230 L196 178"/><path d="M260 230 L204 178"/><path d="M360 230 L218 178"/></g>
    {/* --- OLD PLAN: gultuvaklar + kapalak --- */}
    <g transform="translate(20 176)"><path d="M-10 0 h20 l-3 -14 h-14 Z" fill="#C98A6A"/><path d="M0 -14 Q-4 -28 0 -34" stroke="#6FBF8E" strokeWidth="2.4" fill="none"/><circle className="lm-glow" cx="0" cy="-36" r="5" fill="#FFB6D0"/><path d="M-4 -22 q-8 -3 -11 -10 q9 1 12 8Z" fill="#8FD8B8"/></g>
    <g transform="translate(380 176)"><path d="M-9 0 h18 l-3 -12 h-12 Z" fill="#C98A6A"/><path d="M0 -12 Q3 -24 0 -30" stroke="#6FBF8E" strokeWidth="2.2" fill="none"/><circle className="lm-glow" cx="0" cy="-32" r="4.2" fill="#8FE8C0"/></g>
    <g className="lm-float"><g transform="translate(300 96)"><path d="M0 0 q-5 -4 -9 0 q4 3 9 0 q5 -4 9 0 q-4 3 -9 0Z" fill="#FFA6D0" opacity="0.9"/><circle cx="0" cy="0" r="1.4" fill="#FFF"/></g></g>
    <g><circle className="lm-glow" cx="110" cy="80" r="1.5" fill="#FFE0B0"/><circle className="lm-glow" style={{ animationDelay: '1s' }} cx="290" cy="70" r="1.4" fill="#CFE8FF"/></g>
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
      <GardenTerraceBg/>
      <div className="lm-scene-cast">
        {LUMO_CAST.slice(0, 2).map(kid)}
        <span className={`lm-crew lm-crew-host ${gathered ? 'd2-bit-cheer' : 'lm-bob'}`}><span className="g1-cast-fig"><BitSVG state={gathered ? 'happy' : 'present'}/></span></span>
        {LUMO_CAST.slice(2).map((c, i) => kid(c, i + 2))}
      </div>
    </div>
  );
};

// --- MASSIV (nurli o'simlik qatorlari): rows x cols Chiroq.
const ArrayViz = ({ rows, cols }) => (
  <div style={{ display: 'inline-grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 'clamp(3px, 1vw, 7px)', padding: 'clamp(7px, 1.8vw, 13px)', background: '#152342', borderRadius: 12 }}>
    {Array.from({ length: rows * cols }).map((_, i) => (
      <span key={i} className="g1-pop-in" style={{ animationDelay: `${i * 0.03}s`, width: 'clamp(14px, 4vw, 24px)', height: 'clamp(14px, 4vw, 24px)', display: 'inline-flex' }}><Chiroq/></span>
    ))}
  </div>
);

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
// DARS11 EKRANLARI (15). Naqshlar: Dars09 (xuk, MCRoundD2, final, yakun),
// Dars01 (CountdownClock, saralash g'oyasi). YANGI: RazryadShiftBoard (xonalar ko'chishi).
// ============================================================

// --- 5 soniyalik o'ylash SOATI (Dars01 naqshi, bayt-aniq).
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
// RAZRYAD-SHIFT taxtasi (YANGI mexanika, darsning yuragi).
// Raqam-chiplar xonalar (yuzlik|o'nlik|birlik) orasida SILLIQ ko'chadi:
// x10 — bir xona chapga + o'ngdan nol; x100 — ikki xona + ikkita nol;
// ÷ — teskari: oxirgi nol(lar) so'nadi, raqamlar o'ngga qaytadi.
// played=false -> boshlang'ich holat; true -> natija (CSS transition o'ynaydi).
// ============================================================
const RZ_LBL = { ru: ['сотни', 'десятки', 'единицы'], uz: ['yuzlik', "o'nlik", 'birlik'] };
const rzChips = (from, factor) => {
  const shift = Math.abs(factor) === 10 ? 1 : 2;
  const digits = String(from).split('');
  const base = digits.map((d, i) => ({ d, p0: 3 - digits.length + i }));
  if (factor > 0) {
    const moved = base.map((c) => ({ ...c, p1: c.p0 - shift, kind: 'move' }));
    const zeros = Array.from({ length: shift }, (_, k) => ({ d: '0', p0: 3 - shift + k, p1: 3 - shift + k, kind: 'appear' }));
    return moved.concat(zeros);
  }
  const gone = base.slice(-shift).map((c) => ({ ...c, p1: c.p0, kind: 'vanish' }));
  const moved = base.slice(0, -shift).map((c) => ({ ...c, p1: c.p0 + shift, kind: 'move' }));
  return moved.concat(gone);
};
const RazryadShiftBoard = ({ from, factor, played }) => {
  const lang = useLang();
  const chips = React.useMemo(() => rzChips(from, factor), [from, factor]);
  return (
    <div className="rz-wrap">
      <div className="rz-heads mono">{RZ_LBL[lang].map((l) => <span key={l}>{l}</span>)}</div>
      <div className="rz-board">
        {[0, 1, 2].map((i) => <span key={i} className="rz-cell" style={{ left: `${i * (100 / 3)}%` }}/>)}
        {chips.map((c, i) => {
          const p = played ? c.p1 : c.p0;
          const op = c.kind === 'appear' ? (played ? 1 : 0) : (c.kind === 'vanish' ? (played ? 0 : 1) : 1);
          return (
            <span key={i} className="rz-chip mono" style={{ left: `${p * (100 / 3)}%`, opacity: op }}>{c.d}</span>
          );
        })}
      </div>
    </div>
  );
};
// Tenglama satri: 23 × 10 = 230 (natija played'dan keyin).
const rzResult = (from, factor) => (factor > 0 ? from * factor : from / -factor);
const rzOpChar = (factor) => (factor > 0 ? '×' : '÷');
const RzEq = ({ from, factor, played }) => (
  <span className="mono lm-reveal" style={{ fontSize: 'clamp(18px, 3.6vw, 26px)', fontWeight: 800, color: played ? T.success : T.ink }}>
    {from} {rzOpChar(factor)} {Math.abs(factor)}{played ? ` = ${rzResult(from, factor)}` : ''}
  </span>
);

// --- PUSHTA (10 nur-gul bir qatorda) — xuk va ko'prik vizuali.
const PushtaViz = ({ lit = true, delay = 0 }) => (
  <div style={{ display: 'inline-grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 'clamp(2px, 0.7vw, 5px)', padding: 'clamp(5px, 1.2vw, 9px)', background: '#152342', borderRadius: 10, opacity: lit ? 1 : 0.35, transition: 'opacity 0.5s' }}>
    {Array.from({ length: 10 }).map((_, i) => (
      <span key={i} className={lit ? 'g1-pop-in' : ''} style={{ animationDelay: `${delay + i * 0.05}s`, width: 'clamp(12px, 3vw, 20px)', height: 'clamp(12px, 3vw, 20px)', display: 'inline-flex' }}><Chiroq/></span>
    ))}
  </div>
);

// s0 — XUK (prognoz): 23 pushta x 10
const Screen0 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s0;
  const audio = useAudio(c.audio.intro[lang].map((text, i) => ({
    id: `s0_${i}`, text, trigger: i === 0 ? 'on_mount' : 'after_previous', waits_for: null
  })));
  const canAct = useCanAnswer(audio);
  const [picked, setPicked] = useState(null);
  // Prognoz-istisno: 3 variant. Tartib har mount'da aralashadi (to'g'ri doim 1-o'rinda emas).
  const order = React.useMemo(() => shuffleArr([0, 1, 2]), []);
  const ok = picked !== null && order[picked] === 0;
  const fbKey = (i) => (order[i] === 0 ? 'on_correct' : (order[i] === 2 ? 'on_idk' : 'on_wrong'));
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
        {picked === null && (
          <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: 'clamp(10px, 2vw, 16px)' }}>
            <PushtaViz/>
            <span className="mono" style={{ fontSize: 'clamp(11px, 1.6vw, 13px)', fontWeight: 800, color: T.ink2 }}>{lang === 'ru' ? '1 грядка = 10 огоньков' : '1 pushta = 10 nur-gul'}</span>
          </div>
        )}
        <p className="fade-up delay-1" style={{ textAlign: 'center', color: T.ink2, fontWeight: 600, fontSize: 'clamp(14px, 1.9vw, 17px)', margin: 0 }}>{t(c.q)}</p>
        {picked === null && (
          <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {order.map((k, i) => (
              <button key={i} className="option" disabled={!canAct} onClick={() => pick(i)}
                style={{ padding: 'clamp(10px, 1.5vw, 12px)', fontSize: 'clamp(13px, 1.9vw, 17px)', minHeight: 'clamp(48px, 7vw, 58px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                {t(opts[k])}
              </button>
            ))}
          </div>
        )}
        {picked !== null && (
          <div className="fade-up" style={{ display: 'flex', justifyContent: 'center' }}>
            <button className={`option ${ok ? 'option-correct' : 'option-picked-wrong'}`} disabled
              style={{ padding: 'clamp(10px, 1.5vw, 12px) clamp(16px, 2.4vw, 22px)', fontSize: 'clamp(13px, 1.9vw, 17px)', minHeight: 'clamp(46px, 6.5vw, 56px)', width: 'auto', display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800 }}>
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

// s1 — KO'PRIK: 3 x 4 karta + 3 pushta BITTALAB yoqiladi (10-20-30)
const Screen1 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s1;
  const audio = useAudio([
    brgSeg('s1', lang),
    ...c.audio[lang].map((text, i) => ({ id: `s1_${i}`, text, trigger: 'after_previous', waits_for: null })),
    ...c.counts[lang].map((text, i) => ({ id: `s1_c${i}`, text, trigger: `on_event:tap${i}`, waits_for: null })),
    { id: 's1_done', text: c.done_text[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [litCount, setLitCount] = useState(0);
  const done = litCount >= 3;
  const tap = (i) => {
    if (!canAct || i !== litCount || done) return;   // faqat navbatdagi pushta
    setLitCount(i + 1);
    audio.triggerInternal(`tap${i}`);
  };
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(10px, 2vw, 14px)', padding: 'clamp(14px, 2.6vw, 20px)' }}>
          <span className="mono" style={{ fontSize: 'clamp(16px, 3vw, 22px)', fontWeight: 800, color: T.ink3 }}>3 × 4 = 12</span>
          <span style={{ fontSize: 'clamp(12px, 1.7vw, 14px)', fontWeight: 700, color: T.ink2 }}>{t(c.tap_label)}</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[0, 1, 2].map((i) => (
              <button key={i} onClick={() => tap(i)} disabled={!canAct || i !== litCount}
                style={{ border: 'none', background: 'transparent', cursor: i === litCount ? 'pointer' : 'default', padding: 0 }}>
                <PushtaViz lit={i < litCount}/>
              </button>
            ))}
          </div>
          {litCount > 0 && (
            <span className="mono lm-reveal" key={litCount} style={{ fontSize: 'clamp(22px, 4.4vw, 32px)', fontWeight: 800, color: done ? T.success : T.ink }}>{litCount * 10}</span>
          )}
          {done && <span className="mono lm-reveal" style={{ fontSize: 'clamp(18px, 3.6vw, 26px)', fontWeight: 800, color: T.success }}>3 × 10 = 30</span>}
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

// --- s2/s5 umumiy KASHFIYOT ekrani: RazryadShift qadamlari (tugma -> ko'chish animatsiyasi).
// eventAt[i] — nechanchi audio-segment i-qadam tugmasini kutadi (on_event:goI).
const ShiftExploreScreen = ({ props, ck, eventAt }) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT[ck];
  const audio = useAudio([
    brgSeg(ck, lang),
    ...c.audio[lang].map((text, i) => {
      const ev = eventAt.indexOf(i);
      return { id: `${ck}_${i}`, text, trigger: ev >= 0 ? `on_event:go${ev}` : 'after_previous', waits_for: null };
    })
  ]);
  const canAct = useCanAnswer(audio);
  const [step, setStep] = useState(0);
  const [played, setPlayed] = useState(false);
  const total = c.steps.length;
  const done = step >= total;
  const cur = c.steps[Math.min(step, total - 1)];
  const go = () => {
    if (!canAct || played || done) return;
    setPlayed(true);
    sfx.playCorrect();
    audio.triggerInternal(`go${step}`);
    setTimeout(() => { setPlayed(false); setStep((s) => s + 1); }, 2300);
  };
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(10px, 2vw, 14px)', padding: 'clamp(14px, 2.6vw, 20px)' }}>
          <FrameFx/>
          <div className="mono" style={{ color: T.accent, fontWeight: 800 }}>{Math.min(step + 1, total)} / {total}</div>
          <RazryadShiftBoard key={step} from={cur.from} factor={cur.factor} played={played || done}/>
          <RzEq from={cur.from} factor={cur.factor} played={played || done}/>
          <button className="btn-white-accent" disabled={!canAct || played || done} onClick={go}
            style={{ fontSize: 'clamp(16px, 2.6vw, 20px)', fontFamily: "'JetBrains Mono', monospace" }}>
            {rzOpChar(cur.factor)} {Math.abs(cur.factor)}
          </button>
          {/* tugallangan qadamlar tarixi */}
          {step > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {c.steps.slice(0, step).map((s0, i) => (
                <span key={i} className="mono" style={{ fontSize: 'clamp(12px, 1.7vw, 14px)', fontWeight: 800, color: '#1F7A4D', background: '#E3F0E8', borderRadius: 999, padding: '3px 12px' }}>
                  {s0.from} {rzOpChar(s0.factor)} {Math.abs(s0.factor)} = {rzResult(s0.from, s0.factor)}
                </span>
              ))}
            </div>
          )}
        </div>
        {done && (
          <div ref={revealRef} className="frame-success fade-up">
            <Reaction state="correct" praise={lang === 'ru' ? 'Все переезды выполнены!' : "Barcha ko'chishlar bajarildi!"}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s2 — KASHFIYOT x10 (23, 40, 51). Audio xaritasi: 2->go0, 4->go1, 6->go2.
const Screen2 = (props) => <ShiftExploreScreen props={props} ck="s2" eventAt={[2, 4, 6]}/>;

// s3 — KASHFIYOT x100 + Bit tuzog'i (70 to'g'rimi?)
const Screen3 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s3;
  const audio = useAudio([
    brgSeg('s3', lang),
    { id: 's3_0', text: c.audio[lang][0], trigger: 'after_previous', waits_for: null },
    { id: 's3_1', text: c.audio[lang][1], trigger: 'after_previous', waits_for: null },
    { id: 's3_2', text: c.audio[lang][2], trigger: 'on_event:go', waits_for: null },
    { id: 's3_3', text: c.audio[lang][3], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [played, setPlayed] = useState(false);
  const [trapPick, setTrapPick] = useState(null);
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const solved = trapPick === c.trap_ci;
  const go = () => {
    if (!canAct || played) return;
    setPlayed(true);
    sfx.playCorrect();
    audio.triggerInternal('go');
  };
  const pickTrap = (i) => {
    if (!canAct || !played || solved || wrongSet.has(i)) return;
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
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(10px, 2vw, 14px)', padding: 'clamp(14px, 2.6vw, 20px)' }}>
          <FrameFx/>
          <RazryadShiftBoard from={c.from} factor={100} played={played}/>
          <RzEq from={c.from} factor={100} played={played}/>
          {!played && (
            <button className="btn-white-accent" disabled={!canAct} onClick={go}
              style={{ fontSize: 'clamp(16px, 2.6vw, 20px)', fontFamily: "'JetBrains Mono', monospace" }}>{t(c.btn)}</button>
          )}
          {played && (
            <>
              <p className="fade-up" style={{ margin: 0, textAlign: 'center', color: T.ink2, fontWeight: 700 }}>{t(c.trap_label)}</p>
              <div style={{ display: 'flex', gap: 10 }}>
                {c.trap_opts[lang].map((o, i) => (
                  <button key={i} className={`option ${solved && i === c.trap_ci ? 'option-correct' : ''} ${wrongSet.has(i) ? 'option-picked-wrong' : ''}`}
                    disabled={!canAct || solved || wrongSet.has(i)} onClick={() => pickTrap(i)}
                    style={{ padding: 'clamp(10px, 1.6vw, 13px) clamp(16px, 2.4vw, 22px)', fontSize: 'clamp(15px, 2.2vw, 18px)', minHeight: 'clamp(46px, 6.5vw, 56px)', fontWeight: 800 }}>{o}</button>
                ))}
              </div>
            </>
          )}
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

// s4 — SAVOL-OLDIN-QOIDA: savol tepada, variantlar, qoida FAQAT to'g'ri javobdan keyin
const Screen4 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s4;
  const audio = useAudio([
    brgSeg('s4', lang),
    ...c.audio[lang].map((text, i) => ({ id: `s4_${i}`, text, trigger: 'after_previous', waits_for: null }))
  ]);
  const canAct = useCanAnswer(audio);
  const [picked, setPicked] = useState(null);
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const [hintMsg, setHintMsg] = useState(null);
  // Variantlar har mount'da aralashadi.
  const order = React.useMemo(() => shuffleArr(c.opts.map((_, i) => i)), []);
  const ci = order.indexOf(c.ci);
  const solved = picked === ci;
  const pick = (i) => {
    if (!canAct || solved || wrongSet.has(i)) return;
    if (i === ci) {
      setPicked(i); sfx.playCorrect(); setHintMsg(null);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(`${c.on_correct[lang]} ${c.rule[lang]}`); }
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.2vw, 16px)' }}>
        <h1 className="title h-sub fade-up" style={{ textAlign: 'center', color: T.accent }}>{t(c.q)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10, padding: 'clamp(14px, 2.6vw, 20px)' }}>
          <FrameFx/>
          {order.map((k, i) => (
            <button key={i} className={`option ${solved && i === ci ? 'option-correct' : ''} ${wrongSet.has(i) ? 'option-picked-wrong' : ''}`}
              disabled={!canAct || solved || wrongSet.has(i)} onClick={() => pick(i)}
              style={{ padding: 'clamp(10px, 1.6vw, 14px)', minHeight: 'clamp(46px, 6.5vw, 56px)', fontSize: 'clamp(13px, 1.9vw, 16px)', fontWeight: 800, textAlign: 'center' }}>
              {t(c.opts[k])}
            </button>
          ))}
          {hintMsg && !solved && <p className="fade-up" style={{ margin: 0, color: T.ink2, textAlign: 'center', fontSize: 'clamp(13px, 1.7vw, 15px)' }}>{t(hintMsg)}</p>}
        </div>
        {solved && (
          <div ref={revealRef} className="d2-rulecard fade-up">
            <span className="d2-rulecard-badge mono">{t(c.eyebrow)}</span>
            <p className="d2-rulecard-txt">{t(c.rule)}</p>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s5 — KASHFIYOT ÷ (230÷10, 800÷10, 600÷100). Audio xaritasi: 1->go0, 3->go1, 5->go2.
const Screen5 = (props) => <ShiftExploreScreen props={props} ck="s5" eventAt={[1, 3, 5]}/>;

// s6 — 5 soniya SOAT + savol (45 x 10), 4 variant 2x2
const Screen6 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s6;
  const it0 = c.items[0];
  const items = React.useMemo(() => {
    const order = shuffleArr(it0.opts.map((_, i) => i));
    return { opts: order.map((i) => it0.opts[i]), hints: order.map((i) => it0.hints[i]), ci: order.indexOf(it0.ci) };
  }, []);
  const audio = useAudio([
    brgSeg('s6', lang),
    { id: 's6_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [clock, setClock] = useState(5);
  const [clockDone, setClockDone] = useState(false);
  useEffect(() => {
    // Soat mount'dan keyin yuradi (ovozsiz rejimda ham). 5 -> 0, keyin variantlar ochiladi.
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
        correctAnswer: '450', studentAnswer: '450', correct: firstRef.current,
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
              {hintMsg && !solved && <p className="fade-up" style={{ margin: 0, color: T.ink2, textAlign: 'center', fontSize: 'clamp(13px, 1.7vw, 15px)' }}>{t(hintMsg)}</p>}
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

// s7 — TEST MC, 3 raund (4 variant, 2x2)
const S7_EXPR = { q_mul10: '23 × 10', q_mul100: '7 × 100', q_div10: '450 ÷ 10' };
const Screen7 = (props) => {
  const t = useT();
  const c = CONTENT.s7;
  const heading = (it) => t(c[it.qk]);
  const renderFig = (it) => <span className="mono" style={{ fontSize: 'clamp(28px, 6.4vw, 42px)', fontWeight: 800, color: T.ink }}>{S7_EXPR[it.qk]}</span>;
  return <MCRoundD2 props={props} ck="s7" cols={2} heading={heading} renderFig={renderFig}/>;
};

// s8 — SARALASH «Nima bo'ldi?»: kartalar KETMA-KET, 3 savat (x10 / x100 / ÷10)
const sortWrongKey = (card, binKey) => {
  if (card.to < card.from && binKey !== 'd10') return 'shrunk-mul';
  if (card.bin === 'm100' && binKey === 'm10') return 'm100-as-m10';
  if (card.bin === 'm10' && binKey === 'm100') return 'm10-as-m100';
  if (card.to > card.from && binKey === 'd10') return 'grew-div';
  return null;
};
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
  const [idx, setIdx] = useState(props.storedAnswer ? c.cards.length : 0);
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const [hintMsg, setHintMsg] = useState(null);
  const [flying, setFlying] = useState(false);
  const [score, setScore] = useState(props.storedAnswer ? (props.storedAnswer.studentAnswer | 0) : 0);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const firstAllRef = useRef(props.storedAnswer ? props.storedAnswer.firstTry : true);
  const card = c.cards[idx];
  const done = idx >= c.cards.length;
  const revealRef = useRevealScroll(done, 400);
  const drop = (binKey) => {
    if (!canAct || done || flying || wrongSet.has(binKey)) return;
    if (binKey === card.bin) {
      setFlying(true); sfx.playCorrect(); setHintMsg(null);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.ok_word[binKey][lang]); }
      if (wrongSet.size === 0) setScore((s) => s + 1);
      setTimeout(() => { setFlying(false); setWrongSet(new Set()); setIdx((n) => n + 1); }, 1100);
    } else {
      const n = new Set(wrongSet); n.add(binKey); setWrongSet(n);
      firstAllRef.current = false;
      const wk = sortWrongKey(card, binKey);
      const h = (wk && c.wrong_map[wk]) || c.audio.on_wrong;
      setHintMsg(h);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(h[lang]); }
    }
  };
  useEffect(() => {
    if (done && !recorded) {
      setRecorded(true);
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: t(c.q),
        correctAnswer: String(c.cards.length), studentAnswer: score, correct: firstAllRef.current,
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
        {!done && card && (
          <>
            <div className="mono fade-up" style={{ textAlign: 'center', color: T.accent, fontWeight: 800 }}>{idx + 1} / {c.cards.length}</div>
            <h1 className="title h-sub fade-up">{t(c.q)}</h1>
            <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(12px, 2.4vw, 16px)', padding: 'clamp(14px, 2.6vw, 20px)' }}>
              <FrameFx/>
              <div key={idx} className={`g1-pop-in ${flying ? 'rz-fly' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: 'clamp(10px, 2.4vw, 16px)', background: '#152342', borderRadius: 14, padding: 'clamp(10px, 2vw, 16px) clamp(16px, 3vw, 26px)' }}>
                <span className="mono" style={{ fontSize: 'clamp(24px, 5.4vw, 36px)', fontWeight: 800, color: '#FFE6A6' }}>{card.from}</span>
                <span className="lm-glow mono" style={{ fontSize: 'clamp(22px, 5vw, 32px)', fontWeight: 800, color: '#7FE0D8' }}>→</span>
                <span className="mono" style={{ fontSize: 'clamp(24px, 5.4vw, 36px)', fontWeight: 800, color: '#FFE6A6' }}>{card.to}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, width: '100%' }}>
                {c.bins.map((b) => (
                  <button key={b.key} className={`option ${flying && b.key === card.bin ? 'option-correct' : ''} ${wrongSet.has(b.key) ? 'option-picked-wrong' : ''}`}
                    disabled={!canAct || flying || wrongSet.has(b.key)} onClick={() => drop(b.key)}
                    style={{ padding: 'clamp(12px, 2vw, 16px)', fontSize: 'clamp(17px, 2.8vw, 22px)', minHeight: 'clamp(52px, 7.5vw, 62px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>{t(b.label)}</button>
                ))}
              </div>
              {hintMsg && <p className="fade-up" style={{ margin: 0, color: T.ink2, textAlign: 'center', fontSize: 'clamp(13px, 1.7vw, 15px)' }}>{t(hintMsg)}</p>}
            </div>
          </>
        )}
        {done && (
          <div ref={revealRef} className="frame-success fade-up">
            <Reaction state="correct" praise={`${score} / ${c.cards.length}`}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s9 — ZANJIR SAYOHATI: 4 -> [x10] -> ? -> [x10] -> ? -> [÷100] -> ? (bitta slaydda ketma-ket)
const Screen9 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s9;
  // Har qadam variantlari har mount'da aralashadi.
  const orders = React.useMemo(() => c.steps.map((st) => shuffleArr(st.opts.map((_, i) => i))), []);
  const audio = useAudio([
    brgSeg('s9', lang),
    { id: 's9_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [step, setStep] = useState(props.storedAnswer ? c.steps.length : 0);
  const [played, setPlayed] = useState(false);
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const [hintMsg, setHintMsg] = useState(null);
  const [score, setScore] = useState(props.storedAnswer ? (props.storedAnswer.studentAnswer | 0) : 0);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const firstAllRef = useRef(props.storedAnswer ? props.storedAnswer.firstTry : true);
  const done = step >= c.steps.length;
  const cur = c.steps[Math.min(step, c.steps.length - 1)];
  const order = orders[Math.min(step, c.steps.length - 1)];
  const ci = order.indexOf(cur.ci);
  const pick = (i) => {
    if (!canAct || done || played || wrongSet.has(i)) return;
    if (i === ci) {
      setPlayed(true); sfx.playCorrect(); setHintMsg(null);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(step === c.steps.length - 1 ? `${cur.ok[lang]} ${c.payoff[lang]}` : cur.ok[lang]); }
      if (wrongSet.size === 0) setScore((s) => s + 1);
      setTimeout(() => { setPlayed(false); setWrongSet(new Set()); setStep((n) => n + 1); }, 2100);
    } else {
      const n = new Set(wrongSet); n.add(i); setWrongSet(n);
      firstAllRef.current = false;
      const h = cur.hints[order[i]];
      setHintMsg(h || null);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((h || c.audio.on_wrong)[lang]); }
    }
  };
  useEffect(() => {
    if (done && !recorded) {
      setRecorded(true);
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: 'chain',
        correctAnswer: String(c.steps.length), studentAnswer: score, correct: firstAllRef.current,
        firstTry: firstAllRef.current, attempts: 1, solved: true
      });
    }
  }, [done]);
  const revealRef = useRevealScroll(done, 400);
  const canAdv = useAdvanceGate(done, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  // Zanjir yo'li: 4 -> [x10] -> ? -> [x10] -> ? -> [÷100] -> ?
  const nodeVal = (k) => {
    if (k === 0) return '4';
    const st = c.steps[k - 1];
    return (step > k - 1 || done) ? String(st.ans) : '?';
  };
  const OPS = ['× 10', '× 10', '÷ 100'];
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="fade-up delay-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(4px, 1vw, 8px)', flexWrap: 'wrap' }}>
          {[0, 1, 2, 3].map((k) => (
            <React.Fragment key={k}>
              <span className={`mono ${nodeVal(k) !== '?' ? 'rz-node-on' : ''}`} style={{ minWidth: 'clamp(40px, 8vw, 56px)', textAlign: 'center', padding: 'clamp(6px, 1.2vw, 9px) clamp(8px, 1.6vw, 12px)', borderRadius: 12, fontWeight: 800, fontSize: 'clamp(16px, 2.8vw, 22px)', background: nodeVal(k) !== '?' ? '#E3F0E8' : '#FBF7F0', color: nodeVal(k) !== '?' ? '#1F7A4D' : T.ink3, boxShadow: 'inset 0 0 0 1.5px rgba(58,53,48,0.1)', transition: 'background 0.4s, color 0.4s' }}>{nodeVal(k)}</span>
              {k < 3 && <span className="mono" style={{ fontSize: 'clamp(11px, 1.7vw, 14px)', fontWeight: 800, color: step === k && !done ? T.accent : T.ink3 }}>{OPS[k]} →</span>}
            </React.Fragment>
          ))}
        </div>
        {!done && (
          <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(10px, 2vw, 14px)', padding: 'clamp(14px, 2.6vw, 20px)' }}>
            <FrameFx/>
            <RazryadShiftBoard key={step} from={cur.from} factor={cur.factor} played={played}/>
            <h2 className="title h-sub" style={{ margin: 0, textAlign: 'center' }}>{t(cur.q)}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(100px, 1fr))', gap: 10, width: '100%' }}>
              {order.map((k, i) => (
                <button key={i} className={`option ${played && i === ci ? 'option-correct' : ''} ${wrongSet.has(i) ? 'option-picked-wrong' : ''}`}
                  disabled={!canAct || played || wrongSet.has(i)} onClick={() => pick(i)}
                  style={{ padding: 'clamp(10px, 1.6vw, 13px)', fontSize: 'clamp(17px, 2.8vw, 22px)', minHeight: 'clamp(46px, 6.5vw, 56px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>{t(cur.opts[k])}</button>
              ))}
            </div>
            {hintMsg && <p className="fade-up" style={{ margin: 0, color: T.ink2, textAlign: 'center', fontSize: 'clamp(13px, 1.7vw, 15px)' }}>{t(hintMsg)}</p>}
          </div>
        )}
        {done && (
          <div ref={revealRef} className="frame-success fade-up">
            <div style={{ marginBottom: 8 }}><Reaction state="correct" praise={`${score} / ${c.steps.length}`}/></div>
            <p style={{ margin: 0, color: '#1F7A4D', fontWeight: 700, fontSize: 'clamp(13px, 1.9vw, 16px)', textAlign: 'center' }}>{t(c.payoff)}</p>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s10 — TRENAJYOR NumPad, 3 topshiriq (javob TERILADI)
const Screen10 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s10;
  const audio = useAudio([
    brgSeg('s10', lang),
    { id: 's10_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
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
  const check = () => {
    if (!canAct || numLock || val === '' || done) return;
    setNumLock(true);
    const isOk = parseInt(val, 10) === it.ans;
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((isOk ? c.audio.on_correct : it.hint)[lang]); }
    if (isOk) {
      sfx.playCorrect();
      if (!triedRef.current) setScore((s) => s + 1);
      setTimeout(() => { setVal(''); setNumLock(false); setHintMsg(null); triedRef.current = false; setIdx((n) => n + 1); }, 1500);
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
              {hintMsg && <p className="fade-up" style={{ margin: 0, color: T.ink2, fontSize: 'clamp(13px, 1.7vw, 15px)', textAlign: 'center' }}>{t(hintMsg)}</p>}
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

// s11 — XATONI TOP (4 yozuv, Dars09 s8 naqshi)
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
      setTimeout(() => { setSolvedRound(false); setWrongSet(new Set()); setIdx((n) => n + 1); }, 1500);
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
            <h1 className="title h-sub fade-up">{t(c.q)}</h1>
            <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.8vw, 12px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
              <FrameFx/>
              {it.stmts.map((stmt, i) => (
                <button key={i} className={`option ${wrongSet.has(i) ? 'option-picked-wrong' : ''} ${solvedRound && i === it.wrong ? 'option-correct' : ''}`} disabled={!canAct || solvedRound || wrongSet.has(i)} onClick={() => pick(i)}
                  style={{ padding: 'clamp(10px, 1.6vw, 14px)', minHeight: 'clamp(46px, 6.5vw, 56px)', fontSize: 'clamp(16px, 3vw, 22px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, letterSpacing: 1 }}>{stmt}</button>
              ))}
              {wrongSet.size > 0 && !solvedRound && <p className="fade-up" style={{ margin: 0, color: T.ink2, textAlign: 'center', fontSize: 'clamp(13px, 1.7vw, 15px)' }}>{t(it.hint)}</p>}
            </div>
          </>
        )}
        {done && (
          <div ref={revealRef} className="frame-success reveal-soft">
            <Reaction state="correct" praise={c.audio.on_correct[lang]}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s12 — MASALA (case): 38 pushta x 10, NumPad, VERNIYGACHA
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
  const [val, setVal] = useState('');
  const [numLock, setNumLock] = useState(false);
  const [hintMsg, setHintMsg] = useState(null);
  const [solved, setSolved] = useState(props.storedAnswer?.correct === true);
  const firstRef = useRef(props.storedAnswer ? props.storedAnswer.firstTry : null);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const check = () => {
    if (!canAct || numLock || val === '' || solved) return;
    setNumLock(true);
    const isOk = parseInt(val, 10) === c.ans;
    if (firstRef.current === null) firstRef.current = isOk;
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((isOk ? c.audio.on_correct : c.audio.on_wrong)[lang]); }
    if (isOk) { setSolved(true); sfx.playCorrect(); setHintMsg(null); }
    else { setHintMsg(c.audio.on_wrong); setTimeout(() => { setVal(''); setNumLock(false); }, 1500); }
  };
  useEffect(() => {
    if (solved && !recorded) {
      setRecorded(true);
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: t(c.q),
        correctAnswer: String(c.ans), studentAnswer: String(c.ans), correct: firstRef.current === null ? true : firstRef.current,
        firstTry: firstRef.current === null ? true : firstRef.current, attempts: 1, solved: true
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
        <p className="fade-up" style={{ textAlign: 'center', color: T.ink2, fontWeight: 700, margin: 0 }}>{t(c.lead)}</p>
        <h1 className="title h-sub fade-up delay-1" style={{ margin: 0 }}>{t(c.q)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(8px, 1.6vw, 12px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
          <FrameFx/>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <PushtaViz/>
            <span className="mono" style={{ fontSize: 'clamp(14px, 2.2vw, 18px)', fontWeight: 800, color: T.ink2 }}>× 38</span>
          </div>
          <NumPad value={val} setValue={setVal} disabled={!canAct || numLock || solved} max={3}/>
          <button className="btn-white-accent" disabled={!canAct || numLock || solved || val === ''} onClick={check}>{lang === 'ru' ? 'Проверить' : 'Tekshir'}</button>
          {hintMsg && !solved && <p className="fade-up" style={{ margin: 0, color: T.ink2, fontSize: 'clamp(13px, 1.7vw, 15px)', textAlign: 'center' }}>{t(hintMsg)}</p>}
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

// FactCard illyustratsiyasi (s13): tungi bog'da ESKI LAMPA (issiq, pulsli nur) va uning
// atrofida OLOVQURT (sovuq nur) 3D ORBITADA aylanadi — fakt mazmunining o'zi.
// Orbita Dars01 dagi SymPy hisobidan BAYT-ANIQ (qiya aylana 62° -> perspektiv, R=74):
// old yarim = katta/yaqin (lampa OLDIDA), orqa yarim = kichik/uzoq (lampa ORTIDA).
// Fon yulduzlari: [x, y, r, animationDelay]
const NIGHT_STARS = [
  [20, 24, 1.1, 0], [44, 14, 0.7, 0.6], [70, 40, 0.9, 1.2], [30, 70, 0.8, 0.3], [16, 104, 1.0, 1.1],
  [92, 58, 0.8, 1.6], [10, 50, 0.7, 0.2], [40, 44, 0.6, 1.9],
  [240, 20, 1.1, 0.5], [270, 12, 0.7, 1.0], [302, 30, 1.2, 1.5], [322, 60, 0.8, 0.4],
  [330, 88, 1.0, 0.6], [262, 52, 0.6, 2.0],
  [150, 10, 0.8, 0.8], [198, 12, 0.7, 1.3]
];
// Realistik olovqurt (metodist 2026-08-04): nur TANANING OXIRIDAN (qorin uchidan) chiqadi,
// butun tanadan emas; qo'ng'izsimon tana — bosh + mo'ylov, qattiq ustki qanotlar ochilgan,
// ostida shaffof uchish qanotlari.
const FireflyBody = () => (
  <>
    {/* nur — faqat qorin uchida */}
    <circle cx="174.6" cy="78.6" r="7.5" fill="url(#ffGlow)"/>
    {/* shaffof uchish qanotlari (orqaga-yuqoriga ko'tarilgan) */}
    <ellipse cx="168.2" cy="73.4" rx="4.6" ry="1.9" fill="rgba(210,232,255,0.5)" transform="rotate(-34 168.2 73.4)"/>
    <ellipse cx="170.4" cy="73.8" rx="4.2" ry="1.7" fill="rgba(210,232,255,0.38)" transform="rotate(-16 170.4 73.8)"/>
    {/* qattiq ustki qanotlar (elytra, ochilgan) */}
    <path d="M167.4 76.2 q4.2 -3.4 7 -1.2 q-2.4 3 -6.2 3Z" fill="#5A4638" stroke="#403026" strokeWidth="0.5"/>
    <path d="M167.2 77.6 q4.6 -0.6 6.8 1.8 q-3.2 1.9 -6.4 0.4Z" fill="#6A5240" stroke="#403026" strokeWidth="0.5"/>
    {/* qorin — segmentli, uchi YORUG' */}
    <ellipse cx="172.6" cy="78.8" rx="4.4" ry="2.3" fill="#7A5A3C" transform="rotate(9 172.6 78.8)"/>
    <path d="M174.2 77.4 q2.9 0.3 3.4 1.9 q-0.6 1.7 -3.2 1.6 Z" fill="#E9F6A2"/>
    <circle cx="176.2" cy="79.2" r="1.35" fill="#FDFFE0"/>
    <path d="M171.2 77.5 l0.5 2.9 M173 77.6 l0.4 2.8" stroke="#54402C" strokeWidth="0.5" opacity="0.8"/>
    {/* ko'krak + bosh + mo'ylovlar */}
    <ellipse cx="168" cy="77.9" rx="2.4" ry="2" fill="#3E3028"/>
    <circle cx="165.7" cy="77.4" r="1.5" fill="#2E241E"/>
    <circle cx="165.2" cy="76.9" r="0.5" fill="#E8F0D8"/>
    <path d="M164.8 76.6 q-1.8 -1 -2.2 -2.6 M165.4 76.2 q-0.9 -1.7 -0.3 -3" fill="none" stroke="#2E241E" strokeWidth="0.55" strokeLinecap="round"/>
    {/* oyoqchalar */}
    <path d="M167 79.6 l-1 1.7 M169 79.9 l-0.4 1.8 M171.4 80.3 l0.4 1.7" stroke="#2E241E" strokeWidth="0.5" strokeLinecap="round"/>
  </>
);
const FireflyLampFig = () => (
  <span className="d2-factfig" aria-hidden="true">
    <svg viewBox="0 0 340 150" width="340" height="150" preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="nightBg" cx="50%" cy="42%" r="70%"><stop offset="0%" stopColor="#1B2A46"/><stop offset="58%" stopColor="#121C34"/><stop offset="100%" stopColor="#0A101F"/></radialGradient>
        <radialGradient id="bulbGlass" cx="42%" cy="34%" r="66%"><stop offset="0%" stopColor="#FFF2CC"/><stop offset="55%" stopColor="#FFC864"/><stop offset="100%" stopColor="#C87828"/></radialGradient>
        <radialGradient id="bulbGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#FFB050" stopOpacity="0.55"/><stop offset="100%" stopColor="#FFB050" stopOpacity="0"/></radialGradient>
        <radialGradient id="ffGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#C8F0A8" stopOpacity="0.9"/><stop offset="60%" stopColor="#9BE87C" stopOpacity="0.4"/><stop offset="100%" stopColor="#9BE87C" stopOpacity="0"/></radialGradient>
        <linearGradient id="grassBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#14301F"/><stop offset="100%" stopColor="#0C1E13"/></linearGradient>
        <clipPath id="nightClip"><rect x="0" y="0" width="340" height="150" rx="16"/></clipPath>
      </defs>
      <g clipPath="url(#nightClip)">
        <rect x="0" y="0" width="340" height="150" fill="url(#nightBg)"/>
        {/* fon yulduzlari (miltillaydi) */}
        <g fill="#FFF6E8">{NIGHT_STARS.map(([x, y, r, d], i) => <circle key={i} className="star-tw" style={{ animationDelay: `${d}s` }} cx={x} cy={y} r={r}/>)}</g>
        {/* tungi bog' silueti: o't va pushta shakllari */}
        <path d="M0 138 Q30 128 60 136 Q95 126 130 136 Q170 128 210 136 Q248 126 285 136 Q315 129 340 136 L340 150 L0 150 Z" fill="url(#grassBg)"/>
        <g stroke="#1E4A2E" strokeWidth="1.6" strokeLinecap="round" opacity="0.9">
          <path d="M24 138 q-2 -8 2 -13"/><path d="M31 138 q3 -7 0 -12"/><path d="M296 138 q-3 -8 1 -13"/><path d="M304 138 q3 -6 0 -11"/><path d="M118 139 q-2 -7 2 -11"/><path d="M226 139 q2 -7 -1 -11"/>
        </g>
        {/* uzoq nur-gullar (xira, sovuq) */}
        <circle className="star-tw" style={{ animationDelay: '0.4s' }} cx="52" cy="131" r="1.8" fill="#8FE8C0"/>
        <circle className="star-tw" style={{ animationDelay: '1.5s' }} cx="278" cy="132" r="1.8" fill="#8FD8F0"/>
        <circle className="star-tw" style={{ animationDelay: '0.9s' }} cx="150" cy="133" r="1.5" fill="#B0F0C0"/>
        {/* ikkinchi olovqurt (uchib o'tadi, sovuq uchqun) */}
        <g className="comet"><circle cx="0" cy="0" r="2" fill="#C8F0A8"/><circle cx="0" cy="0" r="4.5" fill="url(#ffGlow)"/></g>
        {/* orbita izi (Dars01 SymPy: rx=74, ry=41.4) */}
        <ellipse cx="170" cy="78" rx="74" ry="41.4" fill="none" stroke="rgba(214,236,210,0.22)" strokeWidth="1.1"/>
        {/* ORQA olovqurt (lampa ortida) */}
        <g className="lumo-orbit-back"><FireflyBody/></g>
        {/* ESKI LAMPA: simda osilgan, ISSIQ pulsli nur */}
        <line x1="170" y1="0" x2="170" y2="42" stroke="#3A4456" strokeWidth="2"/>
        <circle className="rd-glow" cx="170" cy="78" r="58" fill="url(#bulbGlow)"/>
        <rect x="163" y="42" width="14" height="10" rx="2.5" fill="#5A6478"/>
        <line x1="163" y1="45.4" x2="177" y2="45.4" stroke="#454F63" strokeWidth="1.4"/>
        <line x1="163" y1="48.8" x2="177" y2="48.8" stroke="#454F63" strokeWidth="1.4"/>
        {/* zaif NURLAR — cho'g'lanma lampa haqiqatan yoritayotganini ko'rsatadi */}
        <g className="bulb-rays" stroke="#FFD9A0" strokeWidth="1.5" strokeLinecap="round" fill="none">
          <path d="M201 78 L210 78"/><path d="M139 78 L130 78"/>
          <path d="M196.8 93.5 L203.8 97.5"/><path d="M143.2 93.5 L136.2 97.5"/>
          <path d="M185.5 104.8 L189.5 111.8"/><path d="M154.5 104.8 L150.5 111.8"/>
          <path d="M170 109 L170 118"/>
          <path d="M196.8 62.5 L203.8 58.5"/><path d="M143.2 62.5 L136.2 58.5"/>
        </g>
        <circle cx="170" cy="78" r="26" fill="url(#bulbGlass)"/>
        <path d="M158 56 Q170 64 182 56" fill="none" stroke="#8A6A34" strokeWidth="1.4" opacity="0.5"/>
        {/* volfram ipi: dujkalar TSOKOLDAN pastga, zigzag PASTDA (lampa osilgan — haqiqiy joylashuv) */}
        <path d="M164 58 L164 76 L167 83 L170 76 L173 83 L176 76 L176 58" fill="none" stroke="#FFF6DC" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="167" cy="79.5" r="3.2" fill="#FFFDF0" opacity="0.55"/>
        <circle cx="173" cy="79.5" r="3.2" fill="#FFFDF0" opacity="0.55"/>
        <path d="M150 66 A26 26 0 0 1 172 52" fill="none" stroke="#FFEFC8" strokeWidth="2.6" opacity="0.5" strokeLinecap="round"/>
        {/* issiqlik to'lqinlari (lampa TEPASIDA — energiya issiqqa ketadi) */}
        <g className="heat-wave" stroke="#FFB050" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.55">
          <path d="M158 40 q3 -5 0 -10 q-3 -5 0 -9"/>
          <path d="M182 40 q-3 -5 0 -10 q3 -5 0 -9"/>
        </g>
        {/* OLD olovqurt (lampa oldida) */}
        <g className="lumo-orbit-front"><FireflyBody/></g>
      </g>
    </svg>
  </span>
);

// s13 — FINAL panel (5 savol, 4 variantli MC + terish) + FactCard (o'sha ekranda, 5-savoldan keyin)
const Screen13 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s13;
  const items = c.items;
  // Final MC variantlari har mount'da aralashadi. orders[idx][pos] = ASL indeks; to'g'ri = ASL 0.
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
  const it = items[idx];
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const [hintMsg, setHintMsg] = useState(null);
  const numTriedRef = useRef(false);
  const PASS = Math.ceil(items.length * 0.7);
  // NOTO'G'RI javob keyingi savolga O'TKAZMAYDI (metodist, 2026-08-04).
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(110px, 1fr))', gap: 10 }}>
                  {orders[idx].map((k, i) => (
                    <button key={i} className={`option ${picked === i ? 'option-correct' : wrongSet.has(i) ? 'option-picked-wrong' : ''}`} disabled={!canAct || picked !== null || wrongSet.has(i)} onClick={() => pick(i)}
                      style={{ padding: 'clamp(10px, 1.6vw, 13px)', fontSize: 'clamp(14px, 2.2vw, 18px)', minHeight: 'clamp(46px, 6.5vw, 56px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>
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
              <div className="d2-fact-hero"><FireflyLampFig/></div>
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
export default function MulDivTensLesson({
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
`;
