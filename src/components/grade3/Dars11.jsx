import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { BackLabel, BitSVG, Chiroq, Confetti, D2Defs, D2Motes, FREE_NAV, FeedbackBlock, FrameFx, GradientDefs, HeroContext, LUMO_CAST, LangContext, Lenta, NavBack, NavNext, NextLabel, Panel, ProgressContext, Reaction, ReadinessMeter, Stage, StageHero, T, configureLesson, getAudioEngine, npKey, shuffleArr, ttsConfig, useAdvanceGate, useAudio, useCanAnswer, useLang, useMobileZoom, usePrefersReducedMotion, useRevealScroll, useSfx, useT, useTapSteps, makeBrgSeg } from './_kit/index.jsx';
import { BASE_STYLES } from './_kit/styles.js';

// ============================================================================
// DD 3-SINF | Dars11 — "Yig'indini ko'paytirish" (num-3-11) | Б2 | distributivlik
// Syujet: Bit sayyorasi LUMO, Nur bog'lari — «YORUG' YO'LAKLAR» (metodist tanlovi 2026-08-04).
//   Tungi bog', 4 yo'lak; yo'lak = 2 PLITA (10 nur) + 3 TOSHCHA = 23. Bit — mezbon-gid.
//   FactCard: fotosintez (nihol + quyosh-uchqun orbitada).
// Infra: grade3 Dars10.jsx dan BAYT-ANIQ ko'chirildi (unda yashil-javob, FactCard freym
//   ostida, orbital anim naqshlari bor). O'zgarmadi.
// YADRO: (20+3)x4 = 20x4 + 3x4. Jadval 10 da tugaydi — sonni XONA qo'shiluvchilariga
//   bo'lib, HAR BIRINI ko'paytiramiz, keyin qo'shamiz.
// MEXANIKA: xuk (s0), ikki karta ko'prik (s1), KESISH SplitArray (s2), qismlar hisobi (s3),
//   QOIDA (s4), Bit tuzog'i M1 (s5), 5s soat (s6), «qanday bo'lamiz» MC×3 (s7), test MC×3 (s8),
//   USTUN-ko'prik bonus (s9), NumPad trenajyor (s10), masala 32x3 (s11), xatoni top (s12),
//   final 5 savol + FactCard (s13), yakun (s14).
// Misconception: M1 faqat birinchi qo'shiluvchi (80+3=83), M2 qo'shish (23+4), M3 noto'g'ri
//   bo'lish (23=2+3), M4 yonma-yon qo'yish (80 va 12 -> 8012).
// Kontent: src/books/grade3/KONTENT_3SINF.md, «Dars 11» (tasdiq 2026-08-04).
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
  lessonId: 'num-3-11',
  lessonTitle: { ru: 'Урок 11. Умножение суммы', uz: "11-dars. Yig'indini ko'paytirish" }
};
// STRUKTURA (metodist tasdig'i 2026-08-04, KONTENT_3SINF.md «Dars 11»): s0 xuk · s1 ko'prik ·
// s2 KESISH (SplitArray) · s3 qismlar hisobi · s4 QOIDA · s5 Bit tuzog'i (M1) · s6 soat ·
// s7 «qanday bo'lamiz?» ×3 · s8 test ×3 · s9 USTUN-ko'prik (bonus) · s10 NumPad ×3 ·
// s11 masala · s12 xatoni top · s13 final 5 savol + FactCard · s14 yakun.
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
  { id: 's9',  type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's10', type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's11', type: 'case',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's12', type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's13', type: 'test',        template: 'custom',   scored: true,  scope: 'final' },
  { id: 's14', type: 'summary',     template: 'custom',   scored: false, scope: 'final' }
];







// ============================================================
// CONTENT — 3-sinf Dars11 «Yig'indini ko'paytirish» (num-3-11). RU + UZ to'liq.
// Manba: src/books/grade3/KONTENT_3SINF.md, «Dars 11» bo'limi (tasdiq 2026-08-04).
// Syujet: «Yorug' yo'laklar» — tungi bog', 4 yo'lak; plita=10 nur (lenta), toshcha=1 nur (chiroq).
// YADRO: (20+3)x4 = 20x4 + 3x4. M1: faqat birinchi qo'shiluvchi ko'paytiriladi (83).
// BONUS s9: USTUN-ko'prik — 23x4 stolbikda, o'tkazish bilan (to'liq mashq Б3 da).
// ============================================================
const CONTENT = {
  // s0 — XUK
  s0: {
    eyebrow: { ru: 'Миссия', uz: 'Missiya' },
    topic: { ru: 'Тема: умножение суммы', uz: "Mavzu: yig'indini ko'paytirish" },
    lead: { ru: 'Сад пока без тропинок. Нужны светящиеся!', uz: "Bog'da hali yo'lak yo'q. Yorug' yo'laklar kerak!" },
    q: { ru: 'Одна тропинка — 23 камня: две плиты и три камешка. Тропинок четыре. Как посчитать 23 × 4?', uz: "Bitta yo'lak — 23 tosh: ikkita plita va uchta toshcha. Yo'laklar to'rtta. 23 × 4 ni qanday hisoblaymiz?" },
    opt0: { ru: 'Разбить 23 на части', uz: "23 ni qismlarga bo'lamiz" },
    opt1: { ru: 'Считать по одному', uz: 'Bittalab sanaymiz' },
    opt2: { ru: 'Не знаю', uz: 'Bilmayman' },
    audio: {
      intro: {
        ru: [
          'Тема урока называется умножение суммы. Научимся умножать числа, которых нет в таблице.',
          'Утро в саду Бита. К домикам ещё нет дорог. Бит решил выложить четыре светящиеся тропинки.',
          'На одну тропинку нужно двадцать три камня. Две длинные плиты, в каждой десять огней, и три камешка.',
          'Сколько камней нужно на все четыре тропинки? Таблица тут не поможет, она кончается на десяти. Подумай и выбери.'
        ],
        uz: [
          "Dars mavzusi yig'indini ko'paytirish deb ataladi. Jadvalda yo'q sonlarni ko'paytirishni o'rganamiz.",
          "Bit bog'ida ertalab. Uychalarga hali yo'l yo'q. Bit to'rtta yorug' yo'lak yotqizishga qaror qildi.",
          "Bitta yo'lakka yigirma uchta tosh kerak. Ikkita uzun plita, har birida o'nta nur, va uchta toshcha.",
          "To'rtta yo'lakka jami nechta tosh kerak? Jadval bu yerda yordam bermaydi, u o'nda tugaydi. O'ylab ko'ring va tanlang."
        ]
      },
      on_correct: { ru: 'Отличная идея! Двадцать три можно разбить на двадцать и три. А их умножать мы уже умеем. Сейчас всё получится.', uz: "Ajoyib fikr! Yigirma uchni yigirma va uchga bo'lish mumkin. Ularni ko'paytirishni esa bilamiz. Hozir hammasi chiqadi." },
      on_wrong: { ru: 'Можно, но камней почти сотня, и на дворе ночь. Есть путь быстрее.', uz: "Mumkin, lekin toshlar yuzga yaqin, tashqarida esa tun. Tezroq yo'l bor." },
      on_idk: { ru: 'Честный ответ! Смотри, сейчас откроем секрет.', uz: "Halol javob! Qarang, hozir sirni ochamiz." }
    }
  },

  // s1 — KO'PRIK: ikki karta (23=20+3, 20x4=80)
  s1: {
    eyebrow: { ru: 'Вспомним и откроем', uz: 'Eslaymiz va ochamiz' },
    lead: { ru: 'Две половинки секрета.', uz: 'Sirning ikki bo\'lagi.' },
    card1: { ru: '23 = 20 + 3', uz: '23 = 20 + 3' },
    card1_cap: { ru: 'урок 3: разрядные слагаемые', uz: '3-dars: xona qo\'shiluvchilari' },
    card2: { ru: '20 × 4 = 80', uz: '20 × 4 = 80' },
    card2_cap: { ru: 'урок 9: два десятка по четыре', uz: "9-dars: to'rttadan ikki o'nlik" },
    tap_label: { ru: 'Открой карточки по одной', uz: 'Kartalarni bittalab oching' },
    audio: {
      ru: [
        'У тебя уже есть обе половинки секрета. Открой первую карточку.',
        'Двадцать три это двадцать и три. Разрядные слагаемые, помнишь из урока про разряды.',
        'А двадцать умножить на четыре, это два десятка по четыре. Два на четыре, восемь. Восемь десятков, восемьдесят.',
        'Осталось соединить эти две половинки. Пошли к тропинкам.'
      ],
      uz: [
        "Sirning ikkala bo'lagi allaqachon sizda bor. Birinchi kartani oching.",
        "Yigirma uch bu yigirma va uch. Xona qo'shiluvchilari, xonalar darsidan eslaysiz.",
        "Yigirmani to'rtga ko'paytirish esa to'rttadan ikki o'nlik. Ikki karra to'rt, sakkiz. Sakkiz o'nlik, sakson.",
        "Endi shu ikki bo'lakni ulash qoldi. Yo'laklarga boramiz."
      ]
    }
  },

  // s2 — KESISH (SplitArray)
  s2: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: { ru: 'Разрежь тропинки на две команды.', uz: "Yo'laklarni ikki jamoaga ajrating." },
    btn: { ru: 'Разрезать', uz: 'Kesish' },
    label_left: { ru: '20 × 4', uz: '20 × 4' },
    label_right: { ru: '3 × 4', uz: '3 × 4' },
    audio: {
      ru: [
        'Вот все четыре тропинки. В каждом ряду двадцать три камня, из них плиты слева, камешки справа.',
        'Нажми разрезать и раздели камни на две команды.',
        'Смотри! Слева остались только плиты, двадцать камней в ряду, четыре ряда. Справа только камешки, три в ряду, четыре ряда. Одно трудное умножение превратилось в два лёгких.'
      ],
      uz: [
        "Mana to'rtta yo'lak. Har qatorda yigirma uchta tosh, chapda plitalar, o'ngda toshchalar.",
        "Kesish tugmasini bosing va toshlarni ikki jamoaga ajrating.",
        "Qarang! Chapda faqat plitalar qoldi, qatorda yigirmatadan, to'rt qator. O'ngda faqat toshchalar, qatorda uchtadan, to'rt qator. Bitta qiyin ko'paytirish ikkita osonga aylandi."
      ]
    }
  },

  // s3 — QISMLAR HISOBI (uch satr ketma-ket)
  s3: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: { ru: 'Считаем части и складываем.', uz: 'Qismlarni sanab qo\'shamiz.' },
    line1: { ru: '20 × 4 = 80', uz: '20 × 4 = 80' },
    line2: { ru: '3 × 4 = 12', uz: '3 × 4 = 12' },
    line3: { ru: '80 + 12 = 92', uz: '80 + 12 = 92' },
    done_text: { ru: 'Девяносто два камня на четыре тропинки. И никакой таблицы до двадцати трёх не понадобилось.', uz: "To'rt yo'lakka to'qson ikkita tosh. Yigirma uchgacha jadval kerak bo'lmadi." },
    audio: {
      ru: [
        'Считаем плиты. Двадцать на четыре, это два десятка по четыре. Восемь десятков, восемьдесят.',
        'Теперь камешки. Три на четыре, это из таблицы. Двенадцать.',
        'Складываем. Восемьдесят и двенадцать, девяносто два. Смотри, тропинки загораются!',
        'Девяносто два камня на четыре тропинки. И никакой таблицы до двадцати трёх не понадобилось.'
      ],
      uz: [
        "Plitalarni sanaymiz. Yigirma karra to'rt, bu to'rttadan ikki o'nlik. Sakkiz o'nlik, sakson.",
        "Endi toshchalar. Uch karra to'rt, bu jadvaldan. O'n ikki.",
        "Qo'shamiz. Sakson va o'n ikki, to'qson ikki. Qarang, yo'laklar yonmoqda!",
        "To'rt yo'lakka to'qson ikkita tosh. Yigirma uchgacha jadval kerak bo'lmadi."
      ]
    }
  },

  // s4 — SAVOL-OLDIN-QOIDA
  s4: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    q: { ru: 'Как умножить сумму на число?', uz: "Yig'indini songa qanday ko'paytiramiz?" },
    opts: [
      { ru: 'Умножить каждое слагаемое и сложить', uz: "Har qo'shiluvchini ko'paytirib, keyin qo'shish" },
      { ru: 'Умножить только первое слагаемое', uz: "Faqat birinchi qo'shiluvchini ko'paytirish" },
      { ru: 'Сложить все числа', uz: 'Hamma sonlarni qo\'shish' },
      { ru: 'Умножить только второе слагаемое', uz: "Faqat ikkinchi qo'shiluvchini ko'paytirish" }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Тогда камешки останутся без умножения. Их тоже четыре ряда.', uz: "Unda toshchalar ko'paytirilmay qoladi. Ular ham to'rt qator." },
      2: { ru: 'Сложение здесь не поможет, ряды повторяются четыре раза. Это умножение.', uz: "Qo'shish bu yerda yordam bermaydi, qatorlar to'rt marta takrorlanadi. Bu ko'paytirish." },
      3: { ru: 'А плиты? Их тоже надо умножить.', uz: "Plitalar-chi? Ularni ham ko'paytirish kerak." }
    },
    rule: { ru: 'Чтобы умножить сумму на число, умножь каждое слагаемое на это число и сложи результаты. (20+3)×4 = 20×4 + 3×4.', uz: "Yig'indini songa ko'paytirish uchun har qo'shiluvchini shu songa ko'paytiring va natijalarni qo'shing." },
    rule_speech: { ru: 'Чтобы умножить сумму на число, умножь каждое слагаемое на это число и сложи результаты.', uz: "Yig'indini songa ko'paytirish uchun har qo'shiluvchini shu songa ko'paytiring va natijalarni qo'shing." },
    audio: {
      ru: ['Мы видели это на тропинках. Теперь вопрос.', 'Как умножить сумму на число? Выбери ответ.'],
      uz: ["Buni yo'laklarda ko'rdik. Endi savol.", "Yig'indini songa qanday ko'paytiramiz? Javobni tanlang."]
    },
    on_correct: { ru: 'Именно так!', uz: 'Aynan shunday!' }
  },

  // s5 — BIT TUZOG'I (M1: 80+3=83)
  s5: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot' },
    lead: { ru: 'Бит считает быстрее всех. Или нет?', uz: 'Bit hammadan tez hisoblaydi. Yoki yo\'qmi?' },
    lines: ['(20 + 3) × 4', '20 × 4 = 80', '80 + 3 = 83'],
    trap_label: { ru: 'Бит получил 83. Верно?', uz: 'Bit 83 chiqardi. To\'g\'rimi?' },
    trap_opts: { ru: ['Верно', 'Неверно'], uz: ["To'g'ri", "Noto'g'ri"] },
    trap_ci: 1,
    audio: {
      ru: [
        'Бит решил посчитать быстрее всех. Двадцать на четыре, восемьдесят. Плюс три. Восемьдесят три!',
        'Верно ли посчитал Бит?'
      ],
      uz: [
        "Bit hammadan tez hisoblamoqchi bo'ldi. Yigirma karra to'rt, sakson. Qo'shuv uch. Sakson uch!",
        "Bit to'g'ri hisobladimi?"
      ]
    },
    trap_correct: { ru: 'Точно подмечено! Бит забыл умножить тройку. Камешки лежат на каждой из четырёх тропинок, их три на четыре, двенадцать. Верный ответ девяносто два.', uz: "Aniq sezdingiz! Bit uchni ko'paytirishni unutdi. Toshchalar to'rtala yo'lakda ham bor, uch karra to'rt, o'n ikki. To'g'ri javob to'qson ikki." },
    trap_wrong: { ru: 'Посмотри на тропинки. Камешки есть на каждой, значит тройку тоже умножаем на четыре.', uz: "Yo'laklarga qarang. Toshchalar har birida bor, demak uchni ham to'rtga ko'paytiramiz." }
  },

  // s6 — 5 soniya SOAT
  s6: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    q: { ru: 'Сколько будет (10 + 5) × 3?', uz: '(10 + 5) × 3 nechta bo\'ladi?' },
    items: [
      {
        ci: 0,
        opts: [{ ru: '45', uz: '45' }, { ru: '35', uz: '35' }, { ru: '18', uz: '18' }, { ru: '153', uz: '153' }],
        hints: {
          1: { ru: 'Пятёрка тоже умножается на три. Тридцать плюс пятнадцать.', uz: "Besh ham uchga ko'paytiriladi. O'ttiz qo'shuv o'n besh." },
          2: { ru: 'Это сложение всех чисел. А нужно умножить каждое слагаемое.', uz: "Bu hamma sonlarni qo'shish. Har qo'shiluvchini ko'paytirish kerak." },
          3: { ru: 'Тридцать и пятнадцать не приставляют рядом, их складывают.', uz: "O'ttiz bilan o'n besh yonma-yon qo'yilmaydi, ular qo'shiladi." }
        }
      }
    ],
    audio: {
      intro: { ru: 'Проверь себя. Десять плюс пять, и всё это умножить на три. Пять секунд подумай.', uz: "O'zingizni sinang. O'n qo'shuv besh, hammasini uchga ko'paytiring. Besh soniya o'ylang." },
      on_correct: { ru: 'Сорок пять!', uz: 'Qirq besh!' },
      on_wrong: { ru: 'Разбей, умножь каждое, сложи. Попробуй ещё.', uz: "Bo'ling, har birini ko'paytiring, qo'shing. Yana urinib ko'ring." }
    }
  },

  // s7 — «QANDAY BO'LAMIZ?» MC x3
  s7: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    q: { ru: 'Как разбить число для умножения?', uz: "Ko'paytirish uchun sonni qanday bo'lamiz?" },
    items: [
      {
        num: 17, ci: 0,
        opts: [{ ru: '10 + 7', uz: '10 + 7' }, { ru: '1 + 7', uz: '1 + 7' }, { ru: '15 + 2', uz: '15 + 2' }, { ru: '10 + 17', uz: '10 + 17' }],
        hints: {
          1: { ru: 'Единица здесь это десяток. Семнадцать, это десять и семь.', uz: "Bu yerdagi bir bu o'nlik. O'n yetti bu o'n va yetti." },
          2: { ru: 'Так тоже семнадцать, но умножать неудобно. Разбивай на десятки и единицы.', uz: "Bunday ham o'n yetti, lekin ko'paytirish noqulay. O'nlik va birlikka bo'ling." },
          3: { ru: 'Вместе получится двадцать семь, а не семнадцать.', uz: "Birga yigirma yetti chiqadi, o'n yetti emas." }
        }
      },
      {
        num: 24, ci: 0,
        opts: [{ ru: '20 + 4', uz: '20 + 4' }, { ru: '2 + 4', uz: '2 + 4' }, { ru: '14 + 10', uz: '14 + 10' }, { ru: '20 + 14', uz: '20 + 14' }],
        hints: {
          1: { ru: 'Двойка здесь это два десятка, двадцать.', uz: "Bu yerdagi ikki bu ikki o'nlik, yigirma." },
          2: { ru: 'Так тоже двадцать четыре, но удобнее двадцать и четыре.', uz: "Bunday ham yigirma to'rt, lekin yigirma va to'rt qulayroq." },
          3: { ru: 'Вместе получится тридцать четыре.', uz: "Birga o'ttiz to'rt chiqadi." }
        }
      },
      {
        num: 35, ci: 0,
        opts: [{ ru: '30 + 5', uz: '30 + 5' }, { ru: '3 + 5', uz: '3 + 5' }, { ru: '25 + 10', uz: '25 + 10' }, { ru: '30 + 15', uz: '30 + 15' }],
        hints: {
          1: { ru: 'Тройка здесь это три десятка, тридцать.', uz: "Bu yerdagi uch bu uch o'nlik, o'ttiz." },
          2: { ru: 'Удобнее разбивать на десятки и единицы, то есть тридцать и пять.', uz: "O'nlik va birlikka bo'lish qulayroq, ya'ni o'ttiz va besh." },
          3: { ru: 'Вместе получится сорок пять.', uz: 'Birga qirq besh chiqadi.' }
        }
      }
    ],
    audio: {
      intro: { ru: 'Сначала главный шаг. Разбей число на десятки и единицы. Три задания.', uz: "Avval asosiy qadam. Sonni o'nlik va birlikka bo'ling. Uchta topshiriq." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Разбивай на десятки и единицы. Попробуй ещё.', uz: "O'nlik va birlikka bo'ling. Yana urinib ko'ring." }
    }
  },

  // s8 — TEST MC x3
  s8: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    items: [
      {
        q: { ru: 'Сколько будет (20 + 3) × 4?', uz: '(20 + 3) × 4 nechta bo\'ladi?' }, expr: '(20 + 3) × 4', ci: 0,
        opts: [{ ru: '92', uz: '92' }, { ru: '83', uz: '83' }, { ru: '27', uz: '27' }, { ru: '8012', uz: '8012' }],
        hints: {
          1: { ru: 'Тройка тоже умножается на четыре. Восемьдесят плюс двенадцать.', uz: "Uch ham to'rtga ko'paytiriladi. Sakson qo'shuv o'n ikki." },
          2: { ru: 'Это сложение. А ряды повторяются четыре раза, это умножение.', uz: "Bu qo'shish. Qatorlar to'rt marta takrorlanadi, bu ko'paytirish." },
          3: { ru: 'Восемьдесят и двенадцать складывают, а не ставят рядом.', uz: "Sakson bilan o'n ikki qo'shiladi, yonma-yon qo'yilmaydi." }
        }
      },
      {
        q: { ru: 'Сколько будет (30 + 2) × 3?', uz: '(30 + 2) × 3 nechta bo\'ladi?' }, expr: '(30 + 2) × 3', ci: 0,
        opts: [{ ru: '96', uz: '96' }, { ru: '92', uz: '92' }, { ru: '35', uz: '35' }, { ru: '906', uz: '906' }],
        hints: {
          1: { ru: 'Двойка тоже умножается на три. Девяносто плюс шесть.', uz: "Ikki ham uchga ko'paytiriladi. To'qson qo'shuv olti." },
          2: { ru: 'Это сложение всех чисел.', uz: "Bu hamma sonlarni qo'shish." },
          3: { ru: 'Девяносто и шесть складывают, девяносто шесть.', uz: "To'qson bilan olti qo'shiladi, to'qson olti." }
        }
      },
      {
        q: { ru: 'Сколько будет (10 + 7) × 5?', uz: '(10 + 7) × 5 nechta bo\'ladi?' }, expr: '(10 + 7) × 5', ci: 0,
        opts: [{ ru: '85', uz: '85' }, { ru: '57', uz: '57' }, { ru: '22', uz: '22' }, { ru: '350', uz: '350' }],
        hints: {
          1: { ru: 'Семёрка тоже умножается на пять. Пятьдесят плюс тридцать пять.', uz: "Yetti ham beshga ko'paytiriladi. Ellik qo'shuv o'ttiz besh." },
          2: { ru: 'Это сложение.', uz: "Bu qo'shish." },
          3: { ru: 'Это пятьдесят умножить на семь. А нужно пятьдесят плюс тридцать пять.', uz: "Bu ellik karra yetti. Kerakli esa ellik qo'shuv o'ttiz besh." }
        }
      }
    ],
    audio: {
      intro: { ru: 'Теперь весь приём целиком. Разбей, умножь, сложи. Три задания.', uz: "Endi usul to'liq. Bo'ling, ko'paytiring, qo'shing. Uchta topshiriq." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Разбей, умножь каждое, сложи. Попробуй ещё.', uz: "Bo'ling, har birini ko'paytiring, qo'shing. Yana urinib ko'ring." }
    }
  },

  // s9 — BONUS: USTUN-KO'PRIK (23x4 stolbikda) + 1 savol
  s9: {
    eyebrow: { ru: 'Бонус', uz: 'Bonus' },
    lead: { ru: 'Секрет: взрослая запись.', uz: 'Sir: kattalar yozuvi.' },
    left_title: { ru: 'Наша запись', uz: 'Bizning yozuv' },
    left_lines: ['(20 + 3) × 4', '80 + 12 = 92'],
    right_title: { ru: 'Столбик', uz: 'Ustun' },
    mc_q: { ru: 'Откуда в столбике маленькая единичка над двойкой?', uz: "Ustundagi ikkining tepasidagi kichkina bir qayerdan keldi?" },
    mc_opts: [
      { ru: 'Это десяток из 12', uz: "Bu o'n ikkidagi o'nlik" },
      { ru: 'Это цифра из 80', uz: 'Bu saksondagi raqam' },
      { ru: 'Это украшение', uz: 'Bu bezak' },
      { ru: 'Это ошибка записи', uz: 'Bu yozuv xatosi' }
    ],
    mc_ci: 0,
    mc_hints: {
      1: { ru: 'Восемьдесят приходит позже, из плит. А единичка родилась из двенадцати.', uz: "Sakson keyinroq keladi, plitalardan. Birlik esa o'n ikkidan tug'ildi." },
      2: { ru: 'В математике нет украшений, каждая цифра работает. Это десяток из двенадцати.', uz: "Matematikada bezak yo'q, har raqam ishlaydi. Bu o'n ikkidan chiqqan o'nlik." },
      3: { ru: 'Это не ошибка, а перенос. Десяток из двенадцати переехал к десяткам.', uz: "Bu xato emas, o'tkazish. O'n ikkidagi o'nlik o'nliklarga ko'chdi." }
    },
    mc_ok: { ru: 'Именно! Десяток из двенадцати переезжает к десяткам. Это и есть перенос.', uz: "Aynan! O'n ikkidagi o'nlik o'nliklarga ko'chadi. Bu o'tkazish deyiladi." },
    audio: {
      ru: [
        'А теперь секрет. Взрослые записывают наш приём коротко, в столбик. Смотри.',
        'Три на четыре, двенадцать. Двойку пишем под единицами, а десяток из двенадцати переносим наверх, маленькой цифрой.',
        'Двадцать на четыре, восемьдесят. Плюс перенесённый десяток, девять десятков.',
        'Девяносто два! Тот же ответ, что на тропинках. Столбик это наше разрезание, записанное коротко. Подробно научимся ему чуть позже. А теперь вопрос.'
      ],
      uz: [
        "Endi esa sir. Kattalar bizning usulni qisqa yozadi, ustunda. Qarang.",
        "Uch karra to'rt, o'n ikki. Ikkini birliklar ostiga yozamiz, o'n ikkidagi o'nlikni esa tepaga, kichkina raqam bilan ko'chiramiz.",
        "Yigirma karra to'rt, sakson. Qo'shuv ko'chirilgan o'nlik, to'qqiz o'nlik.",
        "To'qson ikki! Yo'laklardagi bilan bir xil javob. Ustun bu bizning kesishimiz, qisqa yozilgani. Unga birozdan keyin batafsil o'rganamiz. Endi esa savol."
      ]
    }
  },

  // s10 — TRENAJYOR NumPad x3
  s10: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    items: [
      { q: { ru: 'Набери ответ: (40 + 5) × 2.', uz: 'Javobni ter: (40 + 5) × 2.' }, ans: 90, hint: { ru: 'Сорок на два и пять на два, потом сложи.', uz: "Qirqni ikkiga va beshni ikkiga, keyin qo'shing." } },
      { q: { ru: 'Набери ответ: (20 + 6) × 4.', uz: 'Javobni ter: (20 + 6) × 4.' }, ans: 104, hint: { ru: 'Восемьдесят плюс двадцать четыре.', uz: "Sakson qo'shuv yigirma to'rt." } },
      { q: { ru: 'Набери ответ: (30 + 3) × 3.', uz: 'Javobni ter: (30 + 3) × 3.' }, ans: 99, hint: { ru: 'Девяносто плюс девять.', uz: "To'qson qo'shuv to'qqiz." } }
    ],
    audio: {
      intro: { ru: 'Теперь сам, без вариантов. Разбей, умножь, сложи и набери ответ.', uz: "Endi o'zingiz, variantlarsiz. Bo'ling, ko'paytiring, qo'shing va javobni tering." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." }
    }
  },

  // s11 — MASALA (sCASE): Jasur, 3 yo'lak x 32 tosh
  s11: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    lead: { ru: 'Жасур выкладывает дорожки к теплице: 3 тропинки, на каждую нужно 32 камня.', uz: "Jasur issiqxonaga yo'laklar yotqizmoqda: 3 yo'lak, har biriga 32 tosh kerak." },
    q: { ru: 'Сколько камней приготовить?', uz: 'Nechta tosh tayyorlash kerak?' },
    ans: 96,
    setup_audio: { ru: 'Жасур строит дорожки к теплице. Три тропинки, на каждую тридцать два камня.', uz: "Jasur issiqxonaga yo'lak qurmoqda. Uchta yo'lak, har biriga o'ttiz ikkita tosh." },
    audio: {
      intro: { ru: 'Помоги Жасуру посчитать камни. Набери ответ.', uz: "Jasurga toshlarni sanashga yordam bering. Javobni tering." },
      on_correct: { ru: 'Девяносто шесть камней! Дорожки к теплице будут светиться.', uz: "To'qson oltita tosh! Issiqxona yo'laklari porlab turadi." },
      on_wrong: { ru: 'Разбей тридцать два на тридцать и два. Умножь каждое на три и сложи.', uz: "O'ttiz ikkini o'ttiz va ikkiga bo'ling. Har birini uchga ko'paytirib qo'shing." }
    }
  },

  // s12 — XATONI TOP (4 yozuv; 65 IKKI MARTA uchraydi, biri to'g'ri!)
  s12: {
    eyebrow: { ru: 'Практика', uz: 'Mashq' },
    q: { ru: 'Какая запись неверна?', uz: "Qaysi yozuv noto'g'ri?" },
    items: [
      {
        stmts: ['(20+4) × 2 = 48', '(30+5) × 2 = 65', '(10+3) × 5 = 65', '(40+2) × 2 = 84'],
        wrong: 1,
        hint: { ru: 'Эта запись верна. Проверь остальные. Умножено ли каждое слагаемое.', uz: "Bu yozuv to'g'ri. Boshqalarini tekshiring. Har qo'shiluvchi ko'paytirilganmi." }
      }
    ],
    audio: {
      intro: { ru: 'Бит записал четыре примера, в один закралась ошибка. Найди её.', uz: "Bit to'rtta misol yozdi, bittasiga xato yashiringan. Uni toping." },
      on_correct: { ru: 'Да! Тридцать умножили, а пятёрку забыли. Шестьдесят плюс десять, семьдесят.', uz: "Ha! O'ttiz ko'paytirilgan, besh esa unutilgan. Oltmish qo'shuv o'n, yetmish." },
      on_wrong: { ru: 'Эта запись верна. Проверь остальные. Умножено ли каждое слагаемое.', uz: "Bu yozuv to'g'ri. Boshqalarini tekshiring. Har qo'shiluvchi ko'paytirilganmi." }
    }
  },

  // s13 — FINAL 5 savol + FactCard
  s13: {
    eyebrow: { ru: 'Финал', uz: 'Final' },
    intro_line: { ru: 'Финальная проверка тропинок. Пять заданий.', uz: "Yo'laklarning yakuniy tekshiruvi. Beshta topshiriq." },
    items: [
      {
        kind: 'num', ans: 88,
        q: { ru: 'Набери ответ: (20 + 2) × 4.', uz: 'Javobni ter: (20 + 2) × 4.' },
        hint: { ru: 'Восемьдесят плюс восемь.', uz: "Sakson qo'shuv sakkiz." }
      },
      {
        kind: 'mc',
        q: { ru: 'Сколько будет (30 + 1) × 3?', uz: '(30 + 1) × 3 nechta bo\'ladi?' },
        opt0: { ru: '93', uz: '93' },
        opt1: { ru: '91', uz: '91' },
        opt2: { ru: '34', uz: '34' },
        opt3: { ru: '903', uz: '903' },
        wrong_1: { ru: 'Единица тоже умножается на три.', uz: "Bir ham uchga ko'paytiriladi." },
        wrong_2: { ru: 'Это сложение.', uz: "Bu qo'shish." },
        wrong_3: { ru: 'Девяносто и три складывают.', uz: "To'qson bilan uch qo'shiladi." }
      },
      {
        kind: 'mc',
        q: { ru: 'Как разбить 47 для умножения?', uz: "Ko'paytirish uchun 47 ni qanday bo'lamiz?" },
        opt0: { ru: '40 + 7', uz: '40 + 7' },
        opt1: { ru: '4 + 7', uz: '4 + 7' },
        opt2: { ru: '45 + 2', uz: '45 + 2' },
        opt3: { ru: '40 + 17', uz: '40 + 17' },
        wrong_1: { ru: 'Четвёрка здесь это четыре десятка.', uz: "Bu yerdagi to'rt bu to'rt o'nlik." },
        wrong_2: { ru: 'Удобнее на десятки и единицы, то есть сорок и семь.', uz: "O'nlik va birlikka qulayroq, ya'ni qirq va yetti." },
        wrong_3: { ru: 'Вместе получится пятьдесят семь.', uz: 'Birga ellik yetti chiqadi.' }
      },
      {
        kind: 'num', ans: 38,
        q: { ru: 'Набери ответ: 19 × 2.', uz: 'Javobni ter: 19 × 2.' },
        hint: { ru: 'Разбей сам на десять и девять, каждое по два раза.', uz: "O'zingiz o'n va to'qqizga bo'ling, har biri ikki marta." }
      },
      {
        kind: 'mc',
        q: { ru: 'Какая запись неверна?', uz: "Qaysi yozuv noto'g'ri?" },
        opt0: { ru: '(20+3) × 2 = 43', uz: '(20+3) × 2 = 43' },
        opt1: { ru: '(10+5) × 4 = 60', uz: '(10+5) × 4 = 60' },
        opt2: { ru: '(30+2) × 2 = 64', uz: '(30+2) × 2 = 64' },
        opt3: { ru: '(40+1) × 2 = 82', uz: '(40+1) × 2 = 82' },
        wrong_1: { ru: 'Эта запись верна. Ищи другую.', uz: "Bu yozuv to'g'ri. Boshqasini qidiring." },
        wrong_2: { ru: 'Эта запись верна. Ищи другую.', uz: "Bu yozuv to'g'ri. Boshqasini qidiring." },
        wrong_3: { ru: 'Эта запись верна. Ищи другую.', uz: "Bu yozuv to'g'ri. Boshqasini qidiring." }
      }
    ],
    fact_badge: { ru: 'Знаешь ли ты?', uz: 'Bilasizmi?' },
    fact_text: { ru: 'Листья растений ловят солнечный свет и превращают его в питание. Это фотосинтез. Заодно листья выпускают кислород, которым мы дышим.', uz: "O'simlik barglari quyosh nurini tutib, uni oziqqa aylantiradi. Bu fotosintez. Shu bilan birga barglar biz nafas oladigan kislorodni chiqaradi." },
    fact_audio: { ru: 'Листья растений ловят солнечный свет и превращают его в питание. Это фотосинтез. Заодно листья выпускают кислород, которым мы дышим. Огни тропинок светят для нас, а листья сада весь день собирали свет для себя.', uz: "O'simlik barglari quyosh nurini tutib, uni oziqqa aylantiradi. Bu fotosintez. Shu bilan birga barglar biz nafas oladigan kislorodni chiqaradi. Yo'lak nurlari biz uchun porlaydi, bog' barglari esa kun bo'yi o'zi uchun nur yig'di." },
    audio: {
      intro: { ru: 'Финальная проверка тропинок. Пять заданий, отвечай на каждое.', uz: "Yo'laklarning yakuniy tekshiruvi. Beshta topshiriq, har biriga javob bering." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Посмотри разбор и попробуй ещё.', uz: "Tahlilga qarang va yana urinib ko'ring." }
    }
  },

  // s14 — YAKUN
  s14: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    praise: { ru: 'Молодец!', uz: 'Barakalla!' },
    mission_done: { ru: 'Тропинки светятся!', uz: "Yo'laklar porlayapti!" },
    cando: { ru: 'Теперь ты умеешь умножать числа, которых нет в таблице.', uz: "Endi siz jadvalda yo'q sonlarni ko'paytira olasiz." },
    rule_recap: { ru: 'Разбей число на десятки и единицы, умножь каждое слагаемое, сложи результаты. (20+3)×4 = 80+12 = 92.', uz: "Sonni o'nlik va birlikka bo'ling, har qo'shiluvchini ko'paytiring, natijalarni qo'shing." },
    conn_label_refs: { ru: 'Опирается на', uz: 'Tayanadi' },
    conn_refs: { ru: 'урок 3: разрядные слагаемые; уроки 9, 10', uz: "3-dars: xona qo'shiluvchilari; 9, 10-darslar" },
    conn_label_next: { ru: 'Дальше', uz: 'Keyingi' },
    conn_next: { ru: 'деление суммы', uz: "yig'indini bo'lish" },
    audio: {
      ru: 'Тропинки светятся, и у тебя новый приём. Разбей число на десятки и единицы, умножь каждое, сложи. И взрослая запись, столбик, тебе уже знакома. А завтра обратная задача. Девяносто два камня надо раздать поровну на четыре тропинки. Получится ли? Узнаем в следующем уроке!',
      uz: "Yo'laklar porlayapti, sizda esa yangi usul bor. Sonni o'nlik va birlikka bo'ling, har birini ko'paytiring, qo'shing. Kattalar yozuvi, ustun ham endi sizga tanish. Ertaga esa teskari masala. To'qson ikkita toshni to'rtta yo'lakka teng bo'lish kerak. Chiqarmikan? Keyingi darsda bilamiz!"
    }
  }
};

// slaydlararo ko'priklar (audio-intro boshiga; ekranda ko'rinmaydi). TTS-toza.
const BRIDGES = {
  s1:  { ru: 'Сначала вспомним, что умеем.', uz: 'Avval bilganimizni eslaymiz.' },
  s2:  { ru: 'Теперь к тропинкам.', uz: "Endi yo'laklarga." },
  s3:  { ru: 'Части готовы. Считаем.', uz: 'Qismlar tayyor. Sanaymiz.' },
  s4:  { ru: 'Запишем это правилом.', uz: 'Buni qoida qilib olamiz.' },
  s5:  { ru: 'А вот и Бит со своим счётом.', uz: "Mana Bit ham o'z hisobi bilan." },
  s6:  { ru: 'Проверь себя на скорость.', uz: "O'zingizni tezlikka sinang." },
  s7:  { ru: 'Потренируем первый шаг.', uz: 'Birinchi qadamni mashq qilamiz.' },
  s8:  { ru: 'Теперь приём целиком.', uz: "Endi usul to'liq." },
  s9:  { ru: 'Открою тебе один секрет.', uz: 'Sizga bir sirni ochaman.' },
  s10: { ru: 'Теперь набирай ответы сам.', uz: "Endi javoblarni o'zingiz tering." },
  s11: { ru: 'Жасуру нужна помощь.', uz: 'Jasurga yordam kerak.' },
  s12: { ru: 'Проверим записи Бита.', uz: 'Bitning yozuvlarini tekshiramiz.' },
  s13: { ru: 'Финальная проверка тропинок.', uz: "Yo'laklarning yakuniy tekshiruvi." },
  s14: { ru: 'Тропинки готовы. Идём домой!', uz: "Yo'laklar tayyor. Uyga boramiz!" }
};

// s14 payoff (xulosadan oldin aytiladi)
const S14_PAYOFF = {
  ru: 'Миссия выполнена! Все четыре тропинки светятся, и дорога домой открыта. Спасибо за помощь!',
  uz: "Missiya bajarildi! To'rtala yo'lak porlayapti, uyga yo'l ochiq. Yordamingiz uchun rahmat!"
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
      <linearGradient id="g0sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#BCE4F7"/><stop offset="52%" stopColor="#E2F2FB"/><stop offset="100%" stopColor="#FBEFD4"/></linearGradient>
      <linearGradient id="g0hill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#CCE8B8"/><stop offset="100%" stopColor="#A6CF92"/></linearGradient>
      <linearGradient id="g0wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E2CFAE"/><stop offset="100%" stopColor="#CBB488"/></linearGradient>
      <linearGradient id="g0floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F1DFB4"/><stop offset="100%" stopColor="#DCC392"/></linearGradient>
      <linearGradient id="g0col" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#CDB489"/><stop offset="42%" stopColor="#F4E7C8"/><stop offset="100%" stopColor="#CDB489"/></linearGradient>
      <linearGradient id="g0bed" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#A87E5C"/><stop offset="100%" stopColor="#7C5A3E"/></linearGradient>
      <radialGradient id="g0sun" cx="50%" cy="50%" r="55%"><stop offset="0%" stopColor="#FFF8DC"/><stop offset="52%" stopColor="#FFE49A" stopOpacity="0.9"/><stop offset="100%" stopColor="#FFD36A" stopOpacity="0"/></radialGradient>
    </defs>
    {/* --- OSMON + sayyora + quyosh --- */}
    <rect x="0" y="0" width="400" height="130" fill="url(#g0sky)"/>
    {/* KUNDUZ: quyosh + oq bulutlar (metodist 2026-08-05: fon YORUG' bo'lsin) */}
    <circle cx="330" cy="38" r="40" fill="url(#g0sun)"/><circle cx="330" cy="38" r="13" fill="#FFF3C4"/>
    <g fill="#FFFFFF" opacity="0.9">
      <ellipse cx="76" cy="34" rx="25" ry="9"/><ellipse cx="94" cy="30" rx="17" ry="7.5"/><ellipse cx="58" cy="31" rx="14" ry="6.5"/>
      <ellipse cx="214" cy="24" rx="19" ry="7.5"/><ellipse cx="229" cy="21" rx="12" ry="5.5"/>
      <ellipse cx="150" cy="44" rx="14" ry="5.5" opacity="0.7"/>
    </g>
    {/* uzoq yashil tepaliklar (kunduzgi ufq) */}
    <path d="M0 124 Q52 98 108 118 Q158 132 202 110 Q252 88 312 114 Q356 130 400 112 L400 132 L0 132 Z" fill="url(#g0hill)"/>
    {/* uzoq shahar silueti (bog' devori ortida) */}
    <g opacity="0.75" fill="#8FC08A">
      <ellipse cx="66" cy="118" rx="16" ry="9"/><ellipse cx="88" cy="120" rx="11" ry="7"/>
      <ellipse cx="306" cy="118" rx="15" ry="9"/><ellipse cx="326" cy="121" rx="10" ry="6"/>
      <ellipse cx="186" cy="117" rx="13" ry="8"/>
    </g>
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
    <text x="200" y="63" textAnchor="middle" fontSize="11" fontWeight="800" fill="#8A4E64" fontFamily="'JetBrains Mono', monospace">23 × 4 = ?</text>
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
// YO'LAK va KESISH (YANGI mexanika SplitArray) — darsning yuragi.
// Yo'lak = 2 PLITA (har biri 10 nur) + 3 TOSHCHA (bittalik nur) = 23.
// split=false: yo'laklar yaxlit; split=true: yorug' chiziq plitalar bilan toshchalarni
// ajratadi, chap guruh «20x4», o'ng guruh «3x4» yorliqlari bilan porlaydi.
// ============================================================
// Metodist 2026-08-04: «yo'laklar HAQIQIY ko'rinsin — bola bu YO'LAK ekanini tushunsin».
// Shuning uchun: yo'lak TUPROQ ustida yotadi (chekkalarida o't), plita — TOSH plita
// (relyef + ichiga o'rnatilgan 10 nur), toshcha — dumaloq yumaloq tosh (bitta nur),
// har yo'lak oxirida UYCHA (yo'lak QAYERGA olib boradi — yo'nalish ko'rinadi).
const D12_SHADE = ({ id }) => (
  <defs>
    <linearGradient id={`${id}-stone`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#C2CFDD"/><stop offset="46%" stopColor="#9BAABC"/><stop offset="100%" stopColor="#77899F"/>
    </linearGradient>
    <linearGradient id={`${id}-pebble`} x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0%" stopColor="#C9D5E2"/><stop offset="100%" stopColor="#7C8DA3"/>
    </linearGradient>
  </defs>
);
const PlitaViz = ({ dim = false }) => (
  <span className="d12-plita" style={{ opacity: dim ? 0.4 : 1 }} aria-hidden="true">
    <svg viewBox="0 0 62 20" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <D12_SHADE id="pl"/>
      {/* tuproqqa botgan soya */}
      <rect x="1.4" y="4.4" width="59.2" height="14.6" rx="4" fill="#6E5334" opacity="0.34"/>
      {/* tosh plita: yuzasi + qirrasi */}
      <rect x="0.8" y="2.4" width="60.4" height="14.4" rx="4" fill="url(#pl-stone)" stroke="#3C4C60" strokeWidth="0.9"/>
      <rect x="2.4" y="3.6" width="57.2" height="4.6" rx="2.4" fill="#A9B8C8" opacity="0.35"/>
      {/* tosh relyefi (mayda nuqta va chizmalar) */}
      <g fill="#3F4E62" opacity="0.35">
        <circle cx="9" cy="13.4" r="0.7"/><circle cx="24" cy="12.9" r="0.55"/><circle cx="41" cy="13.6" r="0.65"/><circle cx="54" cy="12.8" r="0.5"/>
      </g>
      <path d="M14 5.6 l3 1.6 M33 5.4 l2.6 1.8 M49 5.8 l3 1.5" stroke="#465768" strokeWidth="0.5" opacity="0.5" fill="none"/>
      {/* plitaga O'RNATILGAN 10 nur (chuqurcha + yorug' yadro) */}
      {Array.from({ length: 10 }).map((_, i) => (
        <g key={i}>
          <circle cx={5 + i * 5.8} cy="10.2" r="2.3" fill="#2A3546" opacity="0.85"/>
          <circle className="d12-spark" style={{ animationDelay: `${i * 0.12}s` }} cx={5 + i * 5.8} cy="10.2" r="1.6" fill="#FFB92E"/>
        </g>
      ))}
    </svg>
  </span>
);
const ToshchaViz = ({ dim = false, delay = 0 }) => (
  <span className="d12-toshcha" style={{ opacity: dim ? 0.4 : 1 }} aria-hidden="true">
    <svg viewBox="0 0 18 20" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <D12_SHADE id="tc"/>
      <ellipse cx="9" cy="15.4" rx="7.4" ry="3.4" fill="#0E1A10" opacity="0.45"/>
      {/* dumaloq yumaloq tosh (notekis chekka — haqiqiy toshdek) */}
      <path d="M9 3.2 C13.1 3 16.2 6 16 9.6 C15.8 13.2 12.6 15.6 8.8 15.4 C5.2 15.2 2.2 12.8 2.3 9.4 C2.4 5.9 5.3 3.4 9 3.2 Z"
        fill="url(#tc-pebble)" stroke="#3C4C60" strokeWidth="0.9"/>
      <path d="M4.6 7.4 C6 5.4 8.4 4.6 10.6 5" stroke="#B6C4D2" strokeWidth="1" opacity="0.45" fill="none"/>
      <circle cx="9" cy="9.5" r="3" fill="#2A3546" opacity="0.85"/>
      <circle className="d12-spark" style={{ animationDelay: `${delay}s` }} cx="9" cy="9.5" r="2.1" fill="#FFB92E"/>
    </svg>
  </span>
);
// Yo'lak oxiridagi UYCHA — yo'lak qayerga olib borishini ko'rsatadi
const HutViz = () => (
  <span className="d12-hut" aria-hidden="true">
    <svg viewBox="0 0 26 22" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <path d="M13 2 L24 10 L21.6 10 L21.6 20 L4.4 20 L4.4 10 L2 10 Z" fill="#7C6A56" stroke="#5A4B3C" strokeWidth="0.9"/>
      <rect x="10.6" y="13" width="4.8" height="7" rx="1" fill="#3E3428"/>
      <rect x="6.4" y="12" width="3.2" height="3.2" rx="0.7" fill="url(#lmGlow)"/>
      <rect x="16.4" y="12" width="3.2" height="3.2" rx="0.7" fill="url(#lmGlow)"/>
    </svg>
  </span>
);
// Bitta yo'lak qatori: [plita][plita] | [toshcha x3]
const PathRow = ({ split = false, dimLeft = false, dimRight = false, idx = 0, hut = true }) => (
  <div className={`d12-row ${split ? 'd12-row-split' : ''}`}>
    <span className="d12-plitas">
      <PlitaViz dim={dimLeft}/><PlitaViz dim={dimLeft}/>
    </span>
    {split && <span className="d12-cut" aria-hidden="true"/>}
    <span className="d12-toshchas">
      {[0, 1, 2].map((k) => <ToshchaViz key={k} dim={dimRight} delay={idx * 0.1 + k * 0.15}/>)}
    </span>
    {hut && <HutViz/>}
  </div>
);
// 4 yo'lak TUPROQ ustida: o't chekkalari, yo'laklar orasida yer, oxirida uycha
const D12_GRASS = [6, 14, 26, 41, 58, 72, 84, 93];
// Bitta namuna yo'lak (xuk ekranida) — u ham TUPROQ ustida turadi
const PathSample = () => (
  <div className="d12-ground d12-ground-sample">
    <span className="d12-grass d12-grass-top" aria-hidden="true">
      {D12_GRASS.slice(0, 5).map((x, i) => <i key={i} style={{ left: `${x + 4}%`, animationDelay: `${i * 0.3}s` }}/>)}
    </span>
    <div className="d12-field"><PathRow/></div>
    <span className="d12-grass d12-grass-bot" aria-hidden="true">
      {D12_GRASS.slice(0, 5).map((x, i) => <i key={i} style={{ left: `${96 - x}%`, animationDelay: `${i * 0.22}s` }}/>)}
    </span>
  </div>
);
const PathField = ({ split = false, labels = null, dim = { left: false, right: false } }) => (
  <div className="d12-ground">
    {/* o't tutamlari — yuqori va pastki chekkada (yo'laklar YER ustida yotadi) */}
    <span className="d12-grass d12-grass-top" aria-hidden="true">
      {D12_GRASS.map((x, i) => <i key={i} style={{ left: `${x}%`, animationDelay: `${i * 0.3}s` }}/>)}
    </span>
    <div className="d12-field">
      {labels && split && (
        <div className="d12-labels mono">
          <span className="d12-label-l">{labels.left}</span>
          <span className="d12-label-r">{labels.right}</span>
        </div>
      )}
      {[0, 1, 2, 3].map((i) => (
        <PathRow key={i} split={split} idx={i} dimLeft={dim.left} dimRight={dim.right}/>
      ))}
    </div>
    <span className="d12-grass d12-grass-bot" aria-hidden="true">
      {D12_GRASS.map((x, i) => <i key={i} style={{ left: `${100 - x}%`, animationDelay: `${i * 0.25}s` }}/>)}
    </span>
  </div>
);

// ============================================================
// USTUN (stolbik) 23 x 4 — qadam-baqadam. YANGI mexanika ColumnMulDemo.
// step 0: yozuv qo'yildi · 1: 3x4=12, birlikka 2, o'tkazish 1 tepaga ·
// 2: 20x4=80 + o'tkazilgan o'nlik -> 9 · 3: natija 92 porlaydi.
// ============================================================
// USTUN (stolbik) — 5-SINF NAQSHI bilan bir xil (metodist 2026-08-04: «ustunlarda belgi
// TO'G'RI joyda bo'lsin, 5-sinf 3-4 darsiga qara»). O'sha texnika: monoshрифt, satr O'NGGA
// tekislangan (white-space pre + text-align right + kenglik ch birligida), amal belgisi
// SHU satrning boshida — ya'ni ko'paytuvchi birlik ustunida, belgi esa uning chap yonida.
// grade5/Dars04.jsx MulColumnStepwise bilan solishtirilgan.
const D12_COL_ROWS = { top: '23', mul: '× 4', res: '92' };
const ColumnMulDemo = ({ step }) => (
  <div className="d12-col mono" aria-hidden="true">
    {/* ko'chirilgan o'nlik — o'nliklar ustuni USTIDA (satr «1 » o'ngga tekislanadi) */}
    <div className="d12-colr-carry">{step >= 1 ? <span className="d12-carry lm-reveal">1</span> : null}</div>
    <div className="d12-colr">{D12_COL_ROWS.top}</div>
    <div className="d12-colr"><span className="d12-col-sign">{'×'}</span>{' 4'}</div>
    <div className="d12-col-rule"/>
    <div className={`d12-colr ${step >= 1 ? 'd12-col-hot' : ''}`}>
      {step >= 2 ? D12_COL_ROWS.res : (step >= 1 ? ' 2' : ' ')}
    </div>
    {step >= 3 && <div className="d12-col-total lm-reveal">23 {'×'} 4 = 92</div>}
  </div>
);

// s0 — XUK (prognoz, 3 variant aralash)
const Screen0 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s0;
  const audio = useAudio(c.audio.intro[lang].map((text, i) => ({
    id: `s0_${i}`, text, trigger: i === 0 ? 'on_mount' : 'after_previous', waits_for: null
  })));
  const canAct = useCanAnswer(audio);
  const [picked, setPicked] = useState(null);
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.6vw, 12px)' }}>
        <div className="fade-up" style={{ alignSelf: 'center', background: T.accentSoft, color: T.accent, fontWeight: 800, fontSize: 'clamp(12px, 1.8vw, 15px)', padding: '5px 14px', borderRadius: 999 }}>{t(c.topic)}</div>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        {/* sahna KUNDUZI (metodist 2026-08-05: fon yorug'; syujet «yo'lak hali yo'q») */}
        <div className="frame fade-up delay-1 d12-hook-scene" style={{ padding: 'clamp(8px, 1.8vw, 14px)', overflow: 'hidden' }}>
          <LessonScene gathered={ok}/>
        </div>
        {/* namuna yo'lak — TUPROQ ustida; izoh YONIDA (balandlikni tejash uchun) */}
        {picked === null && (
          <div className="frame fade-up delay-1 d12-sample-row" style={{ padding: 'clamp(8px, 1.6vw, 12px)' }}>
            <PathSample/>
            <span className="mono d12-sample-cap">{lang === 'ru' ? '1 тропинка = 2 плиты + 3 камешка = 23' : "1 yo'lak = 2 plita + 3 toshcha = 23"}</span>
          </div>
        )}
        <p className="fade-up delay-1" style={{ textAlign: 'center', color: T.ink2, fontWeight: 600, fontSize: 'clamp(14px, 1.9vw, 17px)', margin: 0 }}>{t(c.q)}</p>
        {picked === null && (
          <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {order.map((k, i) => (
              <button key={i} className="option" disabled={!canAct} onClick={() => pick(i)}
                style={{ padding: 'clamp(10px, 1.5vw, 12px)', fontSize: 'clamp(13px, 1.9vw, 16px)', minHeight: 'clamp(48px, 7vw, 58px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                {t(opts[k])}
              </button>
            ))}
          </div>
        )}
        {picked !== null && (
          <div className="fade-up" style={{ display: 'flex', justifyContent: 'center' }}>
            <button className={`option ${ok ? 'option-correct' : 'option-picked-wrong'}`} disabled
              style={{ padding: 'clamp(10px, 1.5vw, 12px) clamp(16px, 2.4vw, 22px)', fontSize: 'clamp(13px, 1.9vw, 16px)', minHeight: 'clamp(46px, 6.5vw, 56px)', width: 'auto', display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800 }}>
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

// s1 — KO'PRIK: ikki karta bittalab ochiladi
const Screen1 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s1;
  const audio = useAudio([
    brgSeg('s1', lang),
    { id: 's1_0', text: c.audio[lang][0], trigger: 'after_previous', waits_for: null },
    { id: 's1_1', text: c.audio[lang][1], trigger: 'on_event:card0', waits_for: null },
    { id: 's1_2', text: c.audio[lang][2], trigger: 'on_event:card1', waits_for: null },
    { id: 's1_3', text: c.audio[lang][3], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [opened, setOpened] = useState(0);
  const done = opened >= 2;
  const open = (i) => {
    if (!canAct || i !== opened || done) return;
    setOpened(i + 1);
    sfx.playCorrect();
    audio.triggerInternal(`card${i}`);
  };
  const revealRef = useRevealScroll(done, 400);
  const canAdv = useAdvanceGate(done, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  const cards = [
    { txt: c.card1, cap: c.card1_cap },
    { txt: c.card2, cap: c.card2_cap }
  ];
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(10px, 2vw, 14px)', padding: 'clamp(14px, 2.6vw, 20px)' }}>
          <FrameFx/>
          {!done && <span style={{ fontSize: 'clamp(12px, 1.7vw, 14px)', fontWeight: 700, color: T.ink2 }}>{t(c.tap_label)}</span>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'clamp(8px, 2vw, 14px)', width: '100%' }}>
            {cards.map((cd, i) => (
              <button key={i} onClick={() => open(i)} disabled={!canAct || i !== opened}
                className={`d12-card ${opened > i ? 'd12-card-on' : ''}`}>
                {opened > i ? (
                  <>
                    <span className="mono lm-reveal" style={{ fontSize: 'clamp(17px, 3.2vw, 24px)', fontWeight: 800, color: '#1F7A4D' }}>{t(cd.txt)}</span>
                    <span style={{ fontSize: 'clamp(10px, 1.5vw, 12px)', fontWeight: 700, color: T.ink2 }}>{t(cd.cap)}</span>
                  </>
                ) : (
                  <span className="mono" style={{ fontSize: 'clamp(22px, 4.4vw, 30px)', fontWeight: 800, color: T.ink3 }}>?</span>
                )}
              </button>
            ))}
          </div>
        </div>
        {done && (
          <div ref={revealRef} className="frame-success fade-up">
            <Reaction state="correct" praise={lang === 'ru' ? 'Обе половинки готовы. Соединяем!' : "Ikkala bo'lak tayyor. Ulaymiz!"}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s2 — KESISH (SplitArray)
const Screen2 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s2;
  const audio = useAudio([
    brgSeg('s2', lang),
    { id: 's2_0', text: c.audio[lang][0], trigger: 'after_previous', waits_for: null },
    { id: 's2_1', text: c.audio[lang][1], trigger: 'after_previous', waits_for: null },
    { id: 's2_2', text: c.audio[lang][2], trigger: 'on_event:cut', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [split, setSplit] = useState(false);
  const [phase, setPhase] = useState(0);   // 0 yaxlit · 1 kesildi · 2 chap porlaydi · 3 o'ng porlaydi
  const cut = () => {
    if (!canAct || split) return;
    setSplit(true); setPhase(1); sfx.playCorrect();
    audio.triggerInternal('cut');
    setTimeout(() => setPhase(2), 900);
    setTimeout(() => setPhase(3), 2100);
  };
  const done = phase >= 3;
  const revealRef = useRevealScroll(done, 400);
  const canAdv = useAdvanceGate(done, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  const dim = phase === 2 ? { left: false, right: true } : (phase === 3 ? { left: false, right: false } : { left: false, right: false });
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(10px, 2vw, 14px)', padding: 'clamp(14px, 2.6vw, 20px)' }}>
          <FrameFx/>
          <PathField split={split} dim={dim} labels={split ? { left: t(c.label_left), right: t(c.label_right) } : null}/>
          {!split && (
            <button className="btn-white-accent" disabled={!canAct} onClick={cut}
              style={{ fontSize: 'clamp(15px, 2.4vw, 18px)' }}>{t(c.btn)}</button>
          )}
          {phase >= 2 && (
            <div className="lm-reveal" style={{ display: 'flex', gap: 'clamp(8px, 2vw, 16px)', flexWrap: 'wrap', justifyContent: 'center' }}>
              <span className="mono" style={{ fontSize: 'clamp(15px, 2.6vw, 20px)', fontWeight: 800, color: '#1F7A4D', background: '#E3F0E8', borderRadius: 999, padding: '4px 14px' }}>{t(c.label_left)}</span>
              {phase >= 3 && <span className="mono lm-reveal" style={{ fontSize: 'clamp(15px, 2.6vw, 20px)', fontWeight: 800, color: '#017BA3', background: '#E3F2F8', borderRadius: 999, padding: '4px 14px' }}>{t(c.label_right)}</span>}
            </div>
          )}
        </div>
        {done && (
          <div ref={revealRef} className="frame-success fade-up">
            <Reaction state="correct" praise={lang === 'ru' ? 'Одно трудное умножение стало двумя лёгкими!' : "Bitta qiyin ko'paytirish ikkita osonga aylandi!"}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s3 — QISMLAR HISOBI: uch satr BOLANING TAP'i bilan ketma-ket ochiladi (audio sinxron)
const Screen3 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s3;
  const audio = useAudio([
    brgSeg('s3', lang),
    // 0-segment darrov, keyingilari BOSISH bilan (on_event:stepN)
    ...c.audio[lang].map((text, i) => ({ id: `s3_${i}`, text, trigger: i === 0 ? 'after_previous' : `on_event:step${i}`, waits_for: null }))
  ]);
  const canAct = useCanAnswer(audio);
  const { step, done, advance } = useTapSteps(audio, c.audio[lang].length);
  const tap = () => { if (!canAct || done) return; sfx.playCorrect(); advance(); };
  const revealRef = useRevealScroll(done, 400);
  const canAdv = useAdvanceGate(done, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  const lines = [c.line1, c.line2, c.line3];
  const colors = ['#1F7A4D', '#017BA3', '#FF4F28'];
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(10px, 2vw, 14px)', padding: 'clamp(14px, 2.6vw, 20px)' }}>
          <FrameFx/>
          <div style={{ transform: 'scale(0.82)', transformOrigin: 'center' }}>
            {/* 1-qadam: plitalar yorqin · 2-qadam: toshchalar yorqin · 3-qadam (yig'indi): IKKALASI yorqin */}
            <PathField split dim={{ left: step === 2, right: step === 1 }}/>
          </div>
          {lines.map((l, i) => step >= i + 1 && (
            <span key={i} className="mono lm-reveal" style={{ fontSize: `clamp(${i === 2 ? 20 : 17}px, ${i === 2 ? 4 : 3.2}vw, ${i === 2 ? 30 : 24}px)`, fontWeight: 800, color: colors[i] }}>{t(l)}</span>
          ))}
          {!done && (
            <button className="btn-white-accent" disabled={!canAct} onClick={tap}
              style={{ fontSize: 'clamp(14px, 2.2vw, 17px)' }}>
              {step === 0 ? (lang === 'ru' ? 'Считать плиты' : 'Plitalarni sanash') : (step === 1 ? (lang === 'ru' ? 'Считать камешки' : 'Toshchalarni sanash') : (lang === 'ru' ? 'Сложить' : "Qo'shish"))}
            </button>
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
    ...c.audio[lang].map((text, i) => ({ id: `s4_${i}`, text, trigger: 'after_previous', waits_for: null }))
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

// s5 — BIT TUZOG'I (M1: 80+3=83)
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
            <span key={i} className="mono" style={{ fontSize: `clamp(${i === 2 ? 20 : 16}px, ${i === 2 ? 4 : 3}vw, ${i === 2 ? 28 : 22}px)`, fontWeight: 800, color: i === 2 ? '#C0392B' : T.ink }}>{l}</span>
          ))}
          <p className="fade-up" style={{ margin: '4px 0 0', textAlign: 'center', color: T.ink2, fontWeight: 700 }}>{t(c.trap_label)}</p>
          <div style={{ display: 'flex', gap: 10 }}>
            {c.trap_opts[lang].map((o, i) => (
              <button key={i} className={`option ${solved && i === c.trap_ci ? 'option-correct' : ''} ${wrongSet.has(i) ? 'option-picked-wrong' : ''}`}
                disabled={!canAct || solved || wrongSet.has(i)} onClick={() => pickTrap(i)}
                style={{ padding: 'clamp(10px, 1.6vw, 13px) clamp(16px, 2.4vw, 22px)', fontSize: 'clamp(15px, 2.2vw, 18px)', minHeight: 'clamp(46px, 6.5vw, 56px)', fontWeight: 800 }}>{o}</button>
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

// s6 — 5 SONIYA SOAT + savol
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
        correctAnswer: '45', studentAnswer: '45', correct: firstRef.current,
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

// s7 — «QANDAY BO'LAMIZ?» MC x3 (figura — katta son)
const Screen7 = (props) => {
  const t = useT();
  const c = CONTENT.s7;
  const heading = () => t(c.q);
  const renderFig = (it) => <span className="mono" style={{ fontSize: 'clamp(34px, 8vw, 52px)', fontWeight: 800, color: T.accent }}>{it.num}</span>;
  return <MCRoundD2 props={props} ck="s7" cols={2} heading={heading} renderFig={renderFig}/>;
};

// s8 — TEST MC x3 (figura — ifoda)
const Screen8 = (props) => {
  const t = useT();
  const c = CONTENT.s8;
  const heading = (it) => t(it.q);
  const renderFig = (it) => <span className="mono" style={{ fontSize: 'clamp(22px, 5vw, 34px)', fontWeight: 800, color: T.ink }}>{it.expr}</span>;
  return <MCRoundD2 props={props} ck="s8" cols={2} heading={heading} renderFig={renderFig}/>;
};

// s9 — BONUS: USTUN-KO'PRIK (23x4) + savol o'tkazish haqida
const Screen9 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s9;
  const audio = useAudio([
    brgSeg('s9', lang),
    // 0-segment darrov («kattalar shunday yozadi»), ustun qadamlari BOSISH bilan
    ...c.audio[lang].map((text, i) => ({ id: `s9_${i}`, text, trigger: i === 0 ? 'after_previous' : `on_event:step${i}`, waits_for: null }))
  ]);
  const canAct = useCanAnswer(audio);
  const { step: reached, done: built, advance } = useTapSteps(audio, c.audio[lang].length);
  const tapCol = () => { if (!canAct || built) return; sfx.playCorrect(); advance(); };
  const order = React.useMemo(() => shuffleArr(c.mc_opts.map((_, i) => i)), []);
  const ci = order.indexOf(c.mc_ci);
  const [picked, setPicked] = useState(null);
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const [hintMsg, setHintMsg] = useState(null);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const firstRef = useRef(true);
  const solved = picked === ci || props.storedAnswer?.correct === true;
  const pick = (i) => {
    if (!canAct || !built || solved || wrongSet.has(i)) return;
    if (i === ci) {
      setPicked(i); sfx.playCorrect(); setHintMsg(null);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.mc_ok[lang]); }
    } else {
      const n = new Set(wrongSet); n.add(i); setWrongSet(n);
      firstRef.current = false;
      const h = c.mc_hints[order[i]];
      setHintMsg(h || null);
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((h || c.mc_hints[1])[lang]); }
    }
  };
  useEffect(() => {
    if (solved && !recorded) {
      setRecorded(true);
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: t(c.mc_q),
        correctAnswer: t(c.mc_opts[c.mc_ci]), studentAnswer: t(c.mc_opts[c.mc_ci]), correct: firstRef.current,
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
  // ustun qadami: audio 1 -> step1 (12, o'tkazish), 2 -> step2 (9), 3 -> step3 (natija)
  const colStep = Math.max(0, Math.min(3, reached));
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 'clamp(14px, 3vw, 28px)', padding: 'clamp(14px, 2.6vw, 20px)' }}>
          <FrameFx/>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <span className="mono" style={{ fontSize: 'clamp(10px, 1.5vw, 12px)', fontWeight: 800, color: T.ink2, textTransform: 'uppercase', letterSpacing: 0.5 }}>{t(c.left_title)}</span>
            {c.left_lines.map((l, i) => (
              <span key={i} className="mono" style={{ fontSize: 'clamp(14px, 2.6vw, 19px)', fontWeight: 800, color: i === 1 ? '#1F7A4D' : T.ink }}>{l}</span>
            ))}
          </div>
          <span className="mono" style={{ fontSize: 'clamp(18px, 3.4vw, 26px)', color: T.ink3, fontWeight: 800 }}>=</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <span className="mono" style={{ fontSize: 'clamp(10px, 1.5vw, 12px)', fontWeight: 800, color: T.accent, textTransform: 'uppercase', letterSpacing: 0.5 }}>{t(c.right_title)}</span>
            <ColumnMulDemo step={colStep}/>
            {!built && (
              <button className="btn-white-accent" disabled={!canAct} onClick={tapCol}
                style={{ fontSize: 'clamp(13px, 2vw, 16px)', marginTop: 4 }}>
                {reached === 0 ? (lang === 'ru' ? 'Умножить единицы' : 'Birliklarni ko\'paytirish') : (reached === 1 ? (lang === 'ru' ? 'Умножить десятки' : 'O\'nliklarni ko\'paytirish') : (lang === 'ru' ? 'Показать ответ' : 'Javobni ko\'rsatish'))}
              </button>
            )}
          </div>
        </div>
        {built && (
          <div className="frame fade-up" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10, padding: 'clamp(14px, 2.6vw, 20px)' }}>
            <FrameFx/>
            <h2 className="title h-sub" style={{ margin: 0, textAlign: 'center', fontSize: 'clamp(14px, 2.1vw, 18px)' }}>{t(c.mc_q)}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(110px, 1fr))', gap: 10 }}>
              {order.map((k, i) => (
                <button key={i} className={`option ${solved && i === ci ? 'option-correct' : ''} ${wrongSet.has(i) ? 'option-picked-wrong' : ''}`}
                  disabled={!canAct || solved || wrongSet.has(i)} onClick={() => pick(i)}
                  style={{ padding: 'clamp(10px, 1.6vw, 13px)', fontSize: 'clamp(13px, 1.9vw, 16px)', minHeight: 'clamp(46px, 6.5vw, 56px)', fontWeight: 800 }}>{t(c.mc_opts[k])}</button>
              ))}
            </div>
            {hintMsg && !solved && <p className="fade-up" style={{ margin: 0, color: T.ink2, textAlign: 'center', fontSize: 'clamp(13px, 1.7vw, 15px)' }}>{t(hintMsg)}</p>}
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

// s10 — TRENAJYOR NumPad x3
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
  const [numState, setNumState] = useState(null);   // ekranda KO'RINADIGAN javob holati
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
    setNumState(isOk ? 'ok' : 'bad');
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((isOk ? c.audio.on_correct : it.hint)[lang]); }
    if (isOk) {
      sfx.playCorrect();
      if (!triedRef.current) setScore((s) => s + 1);
      setTimeout(() => { setVal(''); setNumLock(false); setNumState(null); setHintMsg(null); triedRef.current = false; setIdx((n) => n + 1); }, 1500);
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
              {hintMsg && <p className="fade-up" style={{ margin: 0, color: T.ink2, fontSize: 'clamp(13px, 1.7vw, 15px)', textAlign: 'center' }}>{t(hintMsg)}</p>}
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

// s11 — MASALA (sCASE): 3 yo'lak x 32 tosh, NumPad verniygacha
const Screen11 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s11;
  const audio = useAudio([
    brgSeg('s11', lang),
    { id: 's11_setup', text: c.setup_audio[lang], trigger: 'after_previous', waits_for: null },
    { id: 's11_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [val, setVal] = useState('');
  const [numLock, setNumLock] = useState(false);
  const [numState, setNumState] = useState(null);   // ekranda KO'RINADIGAN javob holati
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
    else { setHintMsg(c.audio.on_wrong); setTimeout(() => { setVal(''); setNumLock(false); setNumState(null); }, 1500); }
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="mono" style={{ fontSize: 'clamp(14px, 2.2vw, 18px)', fontWeight: 800, color: T.ink2 }}>32 × 3</span>
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

// s12 — XATONI TOP (4 yozuv)
const Screen12 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s12;
  const items = c.items;
  const audio = useAudio([
    brgSeg('s12', lang),
    { id: 's12_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
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
      setTimeout(() => { setSolvedRound(false); setWrongSet(new Set()); setIdx((n) => n + 1); }, 1600);
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
                  style={{ padding: 'clamp(10px, 1.6vw, 14px)', minHeight: 'clamp(46px, 6.5vw, 56px)', fontSize: 'clamp(14px, 2.6vw, 20px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, letterSpacing: 0.5 }}>{stmt}</button>
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

// FactCard illyustratsiyasi (s13): tungi bog'da NIHOL (barglari porlaydi), atrofida
// QUYOSH-UCHQUNI 3D orbitada aylanadi va barg ortiga o'tadi (Dars10 orbita texnikasi,
// SymPy hisobi bayt-aniq). Pastda porlayotgan yo'laklar — dars syujeti.
const NIGHT_STARS = [
  [20, 24, 1.1, 0], [44, 14, 0.7, 0.6], [70, 40, 0.9, 1.2], [30, 70, 0.8, 0.3], [16, 104, 1.0, 1.1],
  [92, 58, 0.8, 1.6], [10, 50, 0.7, 0.2], [40, 44, 0.6, 1.9],
  [240, 20, 1.1, 0.5], [270, 12, 0.7, 1.0], [302, 30, 1.2, 1.5], [322, 60, 0.8, 0.4],
  [330, 88, 1.0, 0.6], [262, 52, 0.6, 2.0],
  [150, 10, 0.8, 0.8], [198, 12, 0.7, 1.3]
];
const SunSpark = () => (
  <>
    <circle cx="170" cy="78" r="9" fill="url(#ssGlow)"/>
    <circle cx="170" cy="78" r="3.6" fill="#FFF6D0"/>
    <g stroke="#FFE08A" strokeWidth="1.1" strokeLinecap="round" opacity="0.9">
      <path d="M170 71.5 L170 68"/><path d="M170 84.5 L170 88"/><path d="M163.5 78 L160 78"/><path d="M176.5 78 L180 78"/>
    </g>
  </>
);
const SproutFig = () => (
  <span className="d2-factfig" aria-hidden="true">
    <svg viewBox="0 0 340 150" width="340" height="150" preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="nightBg2" cx="50%" cy="42%" r="70%"><stop offset="0%" stopColor="#1B2A46"/><stop offset="58%" stopColor="#121C34"/><stop offset="100%" stopColor="#0A101F"/></radialGradient>
        <radialGradient id="ssGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#FFE08A" stopOpacity="0.95"/><stop offset="55%" stopColor="#FFC24A" stopOpacity="0.4"/><stop offset="100%" stopColor="#FFC24A" stopOpacity="0"/></radialGradient>
        <radialGradient id="leafGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#9BE87C" stopOpacity="0.5"/><stop offset="100%" stopColor="#9BE87C" stopOpacity="0"/></radialGradient>
        <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#8FE0A0"/><stop offset="100%" stopColor="#4FA86A"/></linearGradient>
        <linearGradient id="grassBg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#14301F"/><stop offset="100%" stopColor="#0C1E13"/></linearGradient>
        <clipPath id="nightClip2"><rect x="0" y="0" width="340" height="150" rx="16"/></clipPath>
      </defs>
      <g clipPath="url(#nightClip2)">
        <rect x="0" y="0" width="340" height="150" fill="url(#nightBg2)"/>
        <g fill="#FFF6E8">{NIGHT_STARS.map(([x, y, r, d], i) => <circle key={i} className="star-tw" style={{ animationDelay: `${d}s` }} cx={x} cy={y} r={r}/>)}</g>
        {/* tungi bog' yer sathi */}
        <path d="M0 136 Q40 128 80 134 Q130 126 180 134 Q230 126 280 134 Q315 129 340 134 L340 150 L0 150 Z" fill="url(#grassBg2)"/>
        {/* porlayotgan YO'LAKLAR (dars syujeti): plitalar va toshchalar */}
        <g>
          <rect x="18" y="140" width="44" height="5" rx="2.5" fill="#1B2C4A"/>
          {[0, 1, 2, 3, 4].map((i) => <circle key={i} className="star-tw" style={{ animationDelay: `${i * 0.2}s` }} cx={24 + i * 9} cy="142.5" r="1.5" fill="#FFE6A6"/>)}
          <rect x="278" y="140" width="44" height="5" rx="2.5" fill="#1B2C4A"/>
          {[0, 1, 2, 3, 4].map((i) => <circle key={i} className="star-tw" style={{ animationDelay: `${0.5 + i * 0.2}s` }} cx={284 + i * 9} cy="142.5" r="1.5" fill="#FFE6A6"/>)}
        </g>
        {/* ikkinchi uchqun (uchib o'tadi) */}
        <g className="comet"><circle cx="0" cy="0" r="1.8" fill="#FFE08A"/><circle cx="0" cy="0" r="4.5" fill="url(#ssGlow)"/></g>
        {/* orbita izi */}
        <ellipse cx="170" cy="78" rx="74" ry="41.4" fill="none" stroke="rgba(226,240,210,0.2)" strokeWidth="1.1"/>
        {/* ORQA uchqun (nihol ortida) */}
        <g className="lumo-orbit-back"><SunSpark/></g>
        {/* NIHOL: tuproq, poya, ikki barg (mayin porlaydi) */}
        <ellipse className="rd-glow" cx="170" cy="80" r="1" rx="52" ry="34" fill="url(#leafGlow)"/>
        <path d="M158 116 q12 6 24 0 q-2 8 -12 8 q-10 0 -12 -8Z" fill="#6A4A32"/>
        <path d="M170 116 Q168 96 170 62" stroke="#5FB878" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <path d="M170 92 Q150 86 142 70 Q160 68 170 84 Z" fill="url(#leafGrad)" stroke="#3E8E5A" strokeWidth="0.8"/>
        <path d="M170 82 Q190 76 198 60 Q180 58 170 74 Z" fill="url(#leafGrad)" stroke="#3E8E5A" strokeWidth="0.8"/>
        <path d="M166 88 Q156 82 148 72" stroke="#3E8E5A" strokeWidth="0.7" fill="none" opacity="0.7"/>
        <path d="M174 78 Q184 72 192 62" stroke="#3E8E5A" strokeWidth="0.7" fill="none" opacity="0.7"/>
        <circle className="star-tw" cx="170" cy="60" r="3.2" fill="#C8F0A8"/>
        {/* OLD uchqun (nihol oldida) */}
        <g className="lumo-orbit-front"><SunSpark/></g>
      </g>
    </svg>
  </span>
);

// s13 — FINAL panel (5 savol) + FactCard (freym OSTIDA)
const Screen13 = (props) => {
  const lang = useLang();
  const t = useT();
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(110px, 1fr))', gap: 10 }}>
                  {orders[idx].map((k, i) => (
                    <button key={i} className={`option ${picked === i ? 'option-correct' : wrongSet.has(i) ? 'option-picked-wrong' : ''}`} disabled={!canAct || picked !== null || wrongSet.has(i)} onClick={() => pick(i)}
                      style={{ padding: 'clamp(10px, 1.6vw, 13px)', fontSize: 'clamp(13px, 2vw, 17px)', minHeight: 'clamp(46px, 6.5vw, 56px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>
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
              <div className="d2-fact-hero"><SproutFig/></div>
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
        <div className="fade-up delay-2" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', columnGap: 'clamp(10px, 2.4vw, 20px)', rowGap: 3 }}>
          <span className="mono" style={{ fontSize: 'clamp(11px, 1.5vw, 13px)', color: T.ink2 }}>{t(c.conn_label_refs)}: {t(c.conn_refs)}</span>
          <span className="mono" style={{ fontSize: 'clamp(11px, 1.5vw, 13px)', color: T.accent, fontWeight: 700 }}>{t(c.conn_label_next)}: {t(c.conn_next)}</span>
        </div>
        <div className="d12-final-scene fade-up delay-1"><LessonScene gathered/></div>
      </div>
    </Stage>
  );
};

// ============================================================
// KORNEVOY KOMPONENT (shablon: infrastructure_v1 / grade1 Dars28)
// ============================================================
export default function MulSumLesson({
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
.lm-scene { position: relative; width: min(100%, calc(clamp(140px, calc(100dvh - 700px), 372px) * 400 / 210)); aspect-ratio: 400 / 210; margin-inline: auto; border-radius: 14px; overflow: hidden; }
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
  background: radial-gradient(120% 90% at 50% 0%, #D3B489 0%, #BC9A66 55%, #A57E52 100%); box-shadow: inset 0 0 0 1.5px rgba(140,110,72,0.55), inset 0 8px 18px -10px rgba(90,66,38,0.35); overflow: hidden; }
/* tuproq donadorligi */
.d12-ground::after { content: ''; position: absolute; inset: 0; pointer-events: none; opacity: 0.35;
  background-image: radial-gradient(#8E6E48 0.6px, transparent 0.7px), radial-gradient(#A9835A 0.5px, transparent 0.6px);
  background-size: 13px 11px, 9px 15px; background-position: 0 0, 5px 7px; }
/* o't tutamlari chekkalarda */
.d12-grass { position: absolute; left: 0; right: 0; height: clamp(9px, 2vw, 13px); pointer-events: none; }
.d12-grass-top { top: 2px; }
.d12-grass-bot { bottom: 2px; transform: scaleY(-1); }
.d12-grass i { position: absolute; bottom: 0; width: 2px; height: 100%; border-radius: 2px 2px 0 0; background: linear-gradient(180deg, #8FD08A 0%, #4E8A5A 100%); transform-origin: bottom center; animation: d12-sway 3.4s ease-in-out infinite; }
@keyframes d12-sway { 0%, 100% { transform: rotate(-7deg); } 50% { transform: rotate(7deg); } }
.d12-field { position: relative; z-index: 1; display: flex; flex-direction: column; gap: clamp(6px, 1.4vw, 10px); width: 100%; }
.d12-hut { flex: 0 0 auto; width: clamp(18px, 4.2vw, 26px); margin-left: clamp(4px, 1.2vw, 8px); }
/* xuk ekranidagi bitta namuna yo'lak — pastroq maydon */
.d12-sample-row { display: flex; align-items: center; justify-content: center; gap: clamp(8px, 2vw, 16px); flex-wrap: wrap; }
.d12-sample-cap { font-size: clamp(10px, 1.5vw, 12px); font-weight: 800; color: #5A5A60; max-width: 22ch; line-height: 1.35; }
.d12-ground-sample { max-width: 290px; padding: clamp(7px, 1.6vw, 11px) clamp(7px, 1.6vw, 10px); }
/* SAHNA KECHQURUN: syujet «bog' qorong'i» — tungi qatlam (SVG o'zi o'zgarmaydi) */
/* tungi qatlam AYNAN sahna ichida (freym chetlariga chiqmaydi): .lm-scene overflow hidden */
/* metodist 2026-08-05: xuk sahnasi YORUG' — tungi filtr olib tashlandi (qoida saqlanadi, ishlatilmaydi) */
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
/* metodist 2026-08-05: xuk panelida PLITA animatsiyasi yo'q (bola diqqati savolda) */
.d12-sample-row .d12-spark, .d12-sample-row .lm-glow { animation: none !important; }
/* xuk ekrani (s0): sahna ham ETALON o'lchamida (Dars01 s0 = 629x330) */
.d12-hook-scene .lm-scene { width: min(100%, calc(clamp(180px, calc(100dvh - 570px), 372px) * 400 / 210)); }
/* yakuniy ekran (s14): sahna ETALON o'lchamida — Dars01 dagi 570px budjet */
.d12-final-scene .lm-scene { width: min(100%, calc(clamp(200px, calc(100dvh - 560px), 372px) * 400 / 210)); }
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
`;
