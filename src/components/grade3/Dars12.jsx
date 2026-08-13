import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { BackLabel, BitSVG, Chiroq, Confetti, D2Defs, D2Motes, FREE_NAV, FeedbackBlock, FrameFx, GradientDefs, HeroContext, LUMO_CAST, LangContext, Lenta, NavBack, NavNext, NextLabel, Panel, ProgressContext, Reaction, ReadinessMeter, Stage, StageHero, T, configureLesson, getAudioEngine, npKey, shuffleArr, ttsConfig, useAdvanceGate, useAudio, useCanAnswer, useLang, useMobileZoom, usePrefersReducedMotion, useRevealScroll, useSfx, useT, useTapSteps, makeBrgSeg, gridCols , tri } from './_kit/index.jsx';
import { BASE_STYLES } from './_kit/styles.js';

// ============================================================================
// DD 3-SINF | Dars12 — "Yig'indini bo'lish" (num-3-12) | Б2 | teskari distributivlik
// Syujet: «Yorug' yo'laklar» davomi (11-darsning TESKARI masalasi): ertalab, toshlar TAYYOR
//   (sandiqda 9 plita + 6 toshcha = 96), ularni 3 yo'lakka TENG tarqatamiz.
//   FactCard: ildizlar suvni bo'ladi (ildizli nihol + suv tomchisi orbitada).
// Infra: grade3 Dars11.jsx dan BAYT-ANIQ ko'chirildi (tuproq-yo'laklar, plita/toshcha/uycha,
//   yashil javob, FactCard freym ostida, orbital anim, TAP bilan ochilish). O'zgarmadi.
// YADRO: 96 : 3 = (90 + 6) : 3 = 30 + 2 = 32. Qismlar HAR BIRI bo'linishi shart —
//   shu sababli s7 «QULAY bo'lish» mashqi (75 = 50 + 25, 70 + 5 EMAS).
// MEXANIKA: xuk (s0), ikki karta ko'prik (s1), TARQATISH ShareOut (s2), qismlar hisobi (s3),
//   QOIDA (s4), Bit tuzog'i M1 (s5), 5s soat (s6), «qanday bo'lamiz» MC×3 (s7), test MC×3 (s8),
//   BURCHAK USULI ko'prigi bonus (s9), NumPad trenajyor (s10), masala 96:3 (s11),
//   xatoni top (s12), final 5 savol + FactCard (s13), yakun (s14).
// Misconception: M1 faqat birinchi qismni bo'lish (30+6=36), M2 bo'luvchini bo'laklash,
//   M3 noqulay bo'lish (qism bo'linmaydi), M4 yo'nalish (ko'paytirish).
// Kontent: src/books/grade3/KONTENT_3SINF.md, «Dars 12» (tasdiq 2026-08-04).
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
  lessonId: 'grade3-12',
  lessonTitle: { ru: 'Урок 12. Деление суммы', uz: "12-dars. Yig'indini bo'lish", en: 'Lesson 12. Dividing a sum' }
};
// STRUKTURA (metodist tasdig'i 2026-08-04, KONTENT_3SINF.md «Dars 12»): 11-darsning TESKARI
// masalasi. s0 xuk · s1 ko'prik · s2 TARQATISH (ShareOut) · s3 qismlar hisobi · s4 QOIDA ·
// s5 Bit tuzog'i (M1) · s6 soat · s7 «qanday bo'lamiz?» ×3 (QULAY bo'lish) · s8 test ×3 ·
// s9 BURCHAK-ko'prik (ugolok, bonus) · s10 NumPad ×3 · s11 masala · s12 xatoni top ·
// s13 final 5 savol + FactCard · s14 yakun.
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
// CONTENT — 3-sinf Dars12 «Yig'indini bo'lish» (num-3-12). RU + UZ to'liq.
// Manba: src/books/grade3/KONTENT_3SINF.md, «Dars 12» bo'limi (tasdiq 2026-08-04).
// Syujet: «Yorug' yo'laklar» (11-darsning TESKARI masalasi): toshlar TAYYOR, ularni
//   3 yo'lakka TENG tarqatamiz. Plita = 10 nur (o'nlik), toshcha = 1 nur (birlik).
// YADRO: 96 : 3 = (90 + 6) : 3 = 30 + 2 = 32. Qismlar HAR BIRI bo'linishi kerak.
// M1: faqat birinchi qismni bo'lish (30 + 6 = 36). M2: bo'luvchini bo'laklash.
// M3: noqulay bo'lish (75 = 70 + 5). M4: yo'nalish (ko'paytirish).
// BONUS s9: BURCHAK USULI ko'prigi — 96 : 3, 5-sinf DivBoard naqshida.
// ============================================================
const CONTENT = {
  // s0 — XUK
  s0: {
    eyebrow: { ru: 'Миссия', uz: 'Missiya', en: 'Mission' },
    topic: { ru: 'Тема: деление суммы', uz: "Mavzu: yig'indini bo'lish", en: 'Topic: dividing a sum' },
    lead: { ru: 'Ящик камней и три новые тропинки.', uz: 'Tosh sandig\'i va uchta yangi yo\'lak.', en: 'A box of stones and three new paths.' },
    q: { ru: 'В ящике 96 камней: девять плит и шесть камешков. Тропинок три. Сколько камней на каждую тропинку?', uz: "Sandiqda 96 tosh bor: to'qqizta plita va oltita toshcha. Yo'laklar uchta. Har bir yo'lakka nechta tosh tushadi?", en: 'The box has 96 stones: nine slabs and six pebbles. There are three paths. How many stones go on each path?' },
    opt0: { ru: 'Разбить 96 на части', uz: "96 ni qismlarga bo'lamiz", en: 'Split 96 into parts' },
    opt1: { ru: 'Раскладывать по одному', uz: 'Bittalab tarqatamiz', en: 'Lay them out one by one' },
    opt2: { ru: 'Не знаю', uz: 'Bilmayman', en: "I don't know" },
    audio: {
      intro: {
        ru: [
          'Тема урока называется деление суммы. Научимся делить числа, которых нет в таблице.',
          'Утро. Вчерашние тропинки светятся, и Бит принёс ящик камней для новых. Но сегодня задача обратная.',
          'Вчера мы считали, сколько камней нужно. Сегодня камни уже есть, их девяносто шесть. Девять плит и шесть камешков.',
          'Тропинок три, и на каждую нужно поровну. Сколько камней достанется одной тропинке? Подумай и выбери.'
        ],
        uz: [
          "Dars mavzusi yig'indini bo'lish deb ataladi. Jadvalda yo'q sonlarni bo'lishni o'rganamiz.",
          "Ertalab. Kechagi yo'laklar porlayapti, Bit yangilari uchun tosh sandig'ini keltirdi. Lekin bugun masala teskari.",
          "Kecha nechta tosh kerakligini hisobladik. Bugun toshlar bor, ular to'qson oltita. To'qqizta plita va oltita toshcha.",
          "Yo'laklar uchta, har biriga teng tushishi kerak. Bitta yo'lakka nechta tosh tegadi? O'ylab ko'ring va tanlang."
        ],
        en: ['The topic of the lesson is called dividing a sum. We will learn to divide numbers that are not in the table.', 'Morning. Yesterday paths are glowing, and Bit has brought a box of stones for new ones. But today the task is the other way round.', 'Yesterday we counted how many stones were needed. Today the stones are already here, ninety six of them. Nine slabs and six pebbles.', 'There are three paths, and each needs an equal share. How many stones will one path get? Think and choose.']
      },
      on_correct: { ru: 'Верно! Разобьём девяносто шесть на удобные части и поделим каждую на три.', uz: "To'g'ri! To'qson oltini qulay qismlarga bo'lib, har birini uchga bo'lamiz.", en: 'Right! We will split ninety six into handy parts and divide each of them by three.' },
      on_wrong: { ru: 'Можно, но камней почти сотня. Раскладывать по одному долго, а работы ещё много.', uz: "Mumkin, lekin toshlar yuzga yaqin. Bittalab tarqatish uzoq, ish esa hali ko'p.", en: 'You could, but there are almost a hundred stones. Laying them out one by one takes long, and there is much work left.' },
      on_idk: { ru: 'Честный ответ! Сейчас увидишь приём, и всё станет просто.', uz: "Halol javob! Hozir usulni ko'rasiz va hammasi oson bo'ladi.", en: 'An honest answer! You will see the method now and it will all become simple.' }
    }
  },

  // s1 — KO'PRIK: 90:3=30 va 6:3=2
  s1: {
    eyebrow: { ru: 'Вспомним и откроем', uz: 'Eslaymiz va ochamiz', en: 'Recall and discover' },
    lead: { ru: 'Две половинки приёма.', uz: 'Usulning ikki bo\'lagi.', en: 'Two halves of the method.' },
    card1: { ru: '90 : 3 = 30', uz: '90 : 3 = 30', en: '90 : 3 = 30' },
    card1_cap: { ru: 'урок 10: цифры едут вправо', uz: "10-dars: raqamlar o'ngga ko'chadi", en: 'lesson 10: the digits move right' },
    card2: { ru: '6 : 3 = 2', uz: '6 : 3 = 2', en: '6 : 3 = 2' },
    card2_cap: { ru: 'таблица умножения', uz: "ko'paytirish jadvali", en: 'the multiplication table' },
    tap_label: { ru: 'Открой карточки по одной', uz: 'Kartalarni bittalab oching', en: 'Open the cards one by one' },
    audio: {
      ru: [
        'И снова обе половинки приёма у тебя уже есть. Открой первую карточку.',
        'Девяносто разделить на три, тридцать. Девять десятков делим на три, получаем три десятка.',
        'Шесть разделить на три, два. Это из таблицы умножения.',
        'Теперь соединим их и разделим весь ящик.'
      ],
      uz: [
        "Yana usulning ikkala bo'lagi sizda bor. Birinchi kartani oching.",
        "To'qsonni uchga bo'lsak, o'ttiz. To'qqiz o'nlikni uchga bo'lamiz, uch o'nlik chiqadi.",
        "Oltini uchga bo'lsak, ikki. Bu ko'paytirish jadvalidan.",
        "Endi ularni ulab, butun sandiqni bo'lamiz."
      ],
      en: ['And again you already have both halves of the method. Open the first card.', 'Ninety divided by three is thirty. We divide nine tens by three and get three tens.', 'Six divided by three is two. That is from the multiplication table.', 'Now let us join them and divide the whole box.']
    }
  },

  // s2 — TARQATISH (ShareOut): sandiqdan 3 yo'lakka
  s2: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    lead: { ru: 'Разложи камни по тропинкам поровну.', uz: "Toshlarni yo'laklarga teng tarqating.", en: 'Lay the stones out on the paths equally.' },
    box_cap: { ru: 'ящик: 9 плит + 6 камешков', uz: 'sandiq: 9 plita + 6 toshcha', en: 'box: 9 slabs + 6 pebbles' },
    btn: { ru: 'Разложить по тропинкам', uz: 'Yo\'laklarga tarqatish', en: 'Lay out on the paths' },
    tag_plita: { ru: 'по 3 плиты = 30', uz: '3 plitadan = 30', en: '3 slabs each = 30' },
    tag_full: { ru: '32', uz: '32', en: '32' },
    audio: {
      ru: [
        'Вот весь ящик. Девять плит и шесть камешков, всего девяносто шесть камней.',
        'Нажми разложить. Сначала разойдутся плиты, потом камешки.',
        'Девять плит на три тропинки. По три плиты каждой. Это тридцать камней.',
        'Шесть камешков на три тропинки. По два каждой. Смотри, тропинки одинаковые!'
      ],
      uz: [
        "Mana butun sandiq. To'qqizta plita va oltita toshcha, jami to'qson oltita tosh.",
        "Tarqatish tugmasini bosing. Avval plitalar, keyin toshchalar taqsimlanadi.",
        "To'qqiz plita uch yo'lakka. Har biriga uchta plita. Bu o'ttiz tosh.",
        "Olti toshcha uch yo'lakka. Har biriga ikkitadan. Qarang, yo'laklar bir xil!"
      ],
      en: ['Here is the whole box. Nine slabs and six pebbles, ninety six stones in all.', 'Tap lay out. First the slabs will go round, then the pebbles.', 'Nine slabs among three paths. Three slabs each. That is thirty stones.', 'Six pebbles among three paths. Two each. Look, the paths are the same!']
    }
  },

  // s3 — QISMLAR HISOBI (tap bilan)
  s3: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    lead: { ru: 'Делим части и складываем частные.', uz: "Qismlarni bo'lib, bo'linmalarni qo'shamiz.", en: 'We divide the parts and add the quotients.' },
    line1: { ru: '90 : 3 = 30', uz: '90 : 3 = 30', en: '90 : 3 = 30' },
    line2: { ru: '6 : 3 = 2', uz: '6 : 3 = 2', en: '6 : 3 = 2' },
    line3: { ru: '30 + 2 = 32', uz: '30 + 2 = 32', en: '30 + 2 = 32' },
    btn1: { ru: 'Разделить плиты', uz: 'Plitalarni bo\'lish', en: 'Divide the slabs' },
    btn2: { ru: 'Разделить камешки', uz: 'Toshchalarni bo\'lish', en: 'Divide the pebbles' },
    btn3: { ru: 'Сложить', uz: 'Qo\'shish', en: 'Add' },
    done_text: { ru: 'Девяносто шесть разделить на три, тридцать два. Части делятся легко, а ответ собирается сложением.', uz: "To'qson olti bo'linsa uchga, o'ttiz ikki. Qismlar oson bo'linadi, javob esa qo'shish bilan yig'iladi.", en: 'Ninety six divided by three is thirty two. The parts divide easily, and the answer comes together by adding.' },
    audio: {
      ru: [
        'Делим плиты. Девяносто разделить на три, тридцать.',
        'Делим камешки. Шесть разделить на три, два.',
        'Складываем части ответа. Тридцать и два, тридцать два.',
        'На каждой тропинке тридцать два камня. Мы разделили девяносто шесть, а таблицу до девяноста шести никто не учил.'
      ],
      uz: [
        "Plitalarni bo'lamiz. To'qsonni uchga bo'lsak, o'ttiz.",
        "Toshchalarni bo'lamiz. Oltini uchga bo'lsak, ikki.",
        "Javob qismlarini qo'shamiz. O'ttiz va ikki, o'ttiz ikki.",
        "Har yo'lakda o'ttiz ikkita tosh. Biz to'qson oltini bo'ldik, to'qson oltigacha jadvalni esa hech kim o'rganmagan."
      ],
      en: ['We divide the slabs. Ninety divided by three is thirty.', 'We divide the pebbles. Six divided by three is two.', 'We add the parts of the answer. Thirty and two, thirty two.', 'Each path has thirty two stones. We divided ninety six, and nobody ever learned a table up to ninety six.']
    }
  },

  // s4 — SAVOL-OLDIN-QOIDA
  s4: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    q: { ru: 'Как разделить сумму на число?', uz: "Yig'indini songa qanday bo'lamiz?", en: 'How do you divide a sum by a number?' },
    opts: [
      { ru: 'Разделить каждое слагаемое и сложить частные', uz: "Har qo'shiluvchini bo'lib, bo'linmalarni qo'shish", en: 'Divide each addend and add the quotients' },
      { ru: 'Разделить только первое слагаемое', uz: "Faqat birinchi qo'shiluvchini bo'lish", en: 'Divide only the first addend' },
      { ru: 'Разделить сам делитель на части', uz: "Bo'luvchining o'zini bo'laklash", en: 'Split the divisor itself into parts' },
      { ru: 'Сложить все числа', uz: 'Hamma sonlarni qo\'shish', en: 'Add all the numbers' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Тогда камешки останутся неразделёнными. Их тоже надо раздать на три тропинки.', uz: "Unda toshchalar bo'linmay qoladi. Ularni ham uch yo'lakka tarqatish kerak.", en: 'Then the pebbles stay undivided. They have to be shared among the three paths too.' },
      2: { ru: 'Делитель не делят. Тропинок всё время три, а на части разбиваем камни.', uz: "Bo'luvchi bo'laklanmaydi. Yo'laklar doim uchta, qismlarga esa toshlarni bo'lamiz.", en: 'The divisor is not divided. There are always three paths, and it is the stones we split into parts.' },
      3: { ru: 'Сложение здесь не поможет. Камни надо раздать поровну, а это деление.', uz: "Qo'shish yordam bermaydi. Toshlarni teng tarqatish kerak, bu esa bo'lish.", en: 'Adding will not help here. The stones must be shared equally, and that is division.' }
    },
    rule: { ru: 'Чтобы разделить сумму на число, раздели каждое слагаемое на это число и сложи частные. (90 + 6) : 3 = 90 : 3 + 6 : 3 = 32. Слагаемые выбирай так, чтобы каждое делилось.', uz: "Yig'indini songa bo'lish uchun har qo'shiluvchini shu songa bo'ling va bo'linmalarni qo'shing. Qo'shiluvchilarni har biri bo'linadigan qilib tanlang.", en: 'To divide a sum by a number, divide each addend by that number and add the quotients. (90 + 6) : 3 = 90 : 3 + 6 : 3 = 32. Choose the addends so that each of them divides.' },
    rule_speech: { ru: 'Чтобы разделить сумму на число, раздели каждое слагаемое на это число и сложи частные. И выбирай слагаемые так, чтобы каждое делилось без остатка.', uz: "Yig'indini songa bo'lish uchun har qo'shiluvchini shu songa bo'ling va bo'linmalarni qo'shing. Qo'shiluvchilarni har biri qoldiqsiz bo'linadigan qilib tanlang.", en: 'To divide a sum by a number, divide each addend by that number and add the quotients. And choose the addends so that each one divides with nothing left over.' },
    audio: {
      ru: ['Мы разложили камни по тропинкам. Теперь вопрос.', 'Как разделить сумму на число? Выбери ответ.'],
      uz: ["Toshlarni yo'laklarga tarqatdik. Endi savol.", "Yig'indini songa qanday bo'lamiz? Javobni tanlang."],
      en: ['We laid the stones out on the paths. Now a question.', 'How do you divide a sum by a number? Choose an answer.']
    },
    on_correct: { ru: 'Именно так!', uz: 'Aynan shunday!', en: 'Exactly so!' }
  },

  // s5 — BIT TUZOG'I (M1: 30+6=36)
  s5: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    lead: { ru: 'Бит опять спешит. Проверим?', uz: 'Bit yana shoshdi. Tekshiramizmi?', en: 'Bit is in a hurry again. Shall we check?' },
    lines: ['(90 + 6) : 3', '90 : 3 = 30', '30 + 6 = 36'],
    trap_label: { ru: 'Бит получил 36. Верно?', uz: 'Bit 36 chiqardi. To\'g\'rimi?', en: 'Bit got 36. Is that right?' },
    trap_opts: { ru: ['Верно', 'Неверно'], uz: ["To'g'ri", "Noto'g'ri"], en: ['Right', 'Wrong'] },
    trap_ci: 1,
    audio: {
      ru: [
        'Бит снова спешит. Девяносто разделить на три, тридцать. Плюс шесть. Тридцать шесть!',
        'Верно ли посчитал Бит?'
      ],
      uz: [
        "Bit yana shoshildi. To'qsonni uchga bo'ldi, o'ttiz. Qo'shuv olti. O'ttiz olti!",
        "Bit to'g'ri hisobladimi?"
      ],
      en: ['Bit is in a hurry again. Ninety divided by three, thirty. Plus six. Thirty six!', 'Did Bit count correctly?']
    },
    trap_correct: { ru: 'Точно подмечено! Бит не разделил камешки, а просто приписал их. Шесть камешков делятся на три тропинки, по два. Верный ответ тридцать два.', uz: "Aniq sezdingiz! Bit toshchalarni bo'lmadi, shunchaki qo'shib qo'ydi. Olti toshcha uch yo'lakka bo'linadi, ikkitadan. To'g'ri javob o'ttiz ikki.", en: 'Well spotted! Bit did not divide the pebbles, he just wrote them on. Six pebbles divide among three paths, two each. The correct answer is thirty two.' },
    trap_wrong: { ru: 'Посмотри на камешки. Их шесть, а тропинок три. Их тоже надо разделить.', uz: "Toshchalarga qarang. Ular oltita, yo'laklar uchta. Ularni ham bo'lish kerak.", en: 'Look at the pebbles. There are six of them and three paths. They have to be divided too.' }
  },

  // s6 — 5 soniya SOAT
  s6: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    q: { ru: 'Сколько будет (60 + 8) : 2?', uz: '(60 + 8) : 2 nechta bo\'ladi?', en: 'What is (60 + 8) : 2?' },
    items: [
      {
        ci: 0,
        opts: [{ ru: '34', uz: '34', en: '34' }, { ru: '38', uz: '38', en: '38' }, { ru: '30', uz: '30', en: '30' }, { ru: '68', uz: '68', en: '68' }],
        hints: {
          1: { ru: 'Восемь тоже делится на два. Тридцать плюс четыре.', uz: "Sakkiz ham ikkiga bo'linadi. O'ttiz qo'shuv to'rt.", en: 'The eight divides by two as well. Thirty plus four.' },
          2: { ru: 'Это только первая часть. Осталось разделить восемь.', uz: "Bu faqat birinchi qism. Sakkizni bo'lish qoldi.", en: 'That is only the first part. The eight still has to be divided.' },
          3: { ru: 'Это сумма без деления. А делить надо на два.', uz: "Bu bo'lishsiz yig'indi. Ikkiga bo'lish kerak.", en: 'That is the sum without dividing. But we must divide by two.' }
        }
      }
    ],
    audio: {
      intro: { ru: 'Проверь себя. Шестьдесят плюс восемь, и всё это разделить на два. Пять секунд подумай.', uz: "O'zingizni sinang. Oltmish qo'shuv sakkiz, hammasini ikkiga bo'ling. Besh soniya o'ylang.", en: 'Test yourself. Sixty plus eight, and all of it divided by two. Think for five seconds.' },
      on_correct: { ru: 'Тридцать четыре!', uz: "O'ttiz to'rt!", en: 'Thirty four!' },
      on_wrong: { ru: 'Раздели каждую часть и сложи. Попробуй ещё.', uz: "Har qismni bo'lib qo'shing. Yana urinib ko'ring.", en: 'Divide each part and add. Try again.' }
    }
  },

  // s7 — «QANDAY BO'LAMIZ?» (QULAY bo'lish) MC x3
  s7: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    q: { ru: 'Как удобно разбить число для деления?', uz: "Bo'lish uchun sonni qanday qulay bo'lamiz?", en: 'How is it handy to split a number for dividing?' },
    items: [
      {
        expr: '84 : 4', ci: 0,
        opts: [{ ru: '80 + 4', uz: '80 + 4', en: '80 + 4' }, { ru: '8 + 4', uz: '8 + 4', en: '8 + 4' }, { ru: '40 + 44', uz: '40 + 44', en: '40 + 44' }, { ru: '84 + 4', uz: '84 + 4', en: '84 + 4' }],
        hints: {
          1: { ru: 'Восемь здесь это восемь десятков, восемьдесят.', uz: "Bu yerdagi sakkiz aslida sakkiz o'nlik, ya'ni sakson.", en: 'The eight here is eight tens, eighty.' },
          2: { ru: 'Так тоже восемьдесят четыре, но сорок четыре на четыре делить неудобно. Бери круглые десятки.', uz: "Bu ham sakson to'rt, lekin qirq to'rtni to'rtga bo'lish noqulay. Yumaloq o'nlikni oling.", en: 'That is eighty four too, but forty four is awkward to divide by four. Take round tens.' },
          3: { ru: 'Вместе получится восемьдесят восемь.', uz: "Birga sakson sakkiz chiqadi.", en: 'Together that gives eighty eight.' }
        }
      },
      {
        expr: '75 : 5', ci: 0,
        opts: [{ ru: '50 + 25', uz: '50 + 25', en: '50 + 25' }, { ru: '70 + 5', uz: '70 + 5', en: '70 + 5' }, { ru: '7 + 5', uz: '7 + 5', en: '7 + 5' }, { ru: '50 + 20', uz: '50 + 20', en: '50 + 20' }],
        hints: {
          1: { ru: 'Пять делится, а семьдесят на пять делить трудно. Возьми пятьдесят и двадцать пять.', uz: "Besh bo'linadi, lekin yetmishni beshga bo'lish qiyin. Ellik va yigirma beshni oling.", en: 'Five divides, but seventy is hard to divide by five. Take fifty and twenty five.' },
          2: { ru: 'Семь здесь это семь десятков.', uz: "Bu yerdagi yetti aslida yetti o'nlik.", en: 'The seven here is seven tens.' },
          3: { ru: 'Вместе получится семьдесят, а нужно семьдесят пять.', uz: "Birga yetmish chiqadi, kerakli esa yetmish besh.", en: 'Together that gives seventy, and we need seventy five.' }
        }
      },
      {
        expr: '96 : 3', ci: 0,
        opts: [{ ru: '90 + 6', uz: '90 + 6', en: '90 + 6' }, { ru: '9 + 6', uz: '9 + 6', en: '9 + 6' }, { ru: '80 + 16', uz: '80 + 16', en: '80 + 16' }, { ru: '90 + 16', uz: '90 + 16', en: '90 + 16' }],
        hints: {
          1: { ru: 'Девять здесь это девяносто.', uz: "Bu yerdagi to'qqiz aslida to'qson.", en: 'The nine here is ninety.' },
          2: { ru: 'Так тоже девяносто шесть, но восемьдесят на три не делится. Бери девяносто.', uz: "Bu ham to'qson olti, lekin sakson uchga bo'linmaydi. To'qsonni oling.", en: 'That is ninety six too, but eighty does not divide by three. Take ninety.' },
          3: { ru: 'Вместе получится сто шесть.', uz: 'Birga bir yuz olti chiqadi.', en: 'Together that gives one hundred six.' }
        }
      }
    ],
    audio: {
      intro: { ru: 'Главный шаг. Разбивай так, чтобы каждая часть делилась. Три задания.', uz: "Asosiy qadam. Har qism bo'linadigan bo'lsin. Uchta topshiriq.", en: 'The main step. Split it so that every part divides. Three tasks.' },
      on_correct: { ru: 'Верно.', uz: "To'g'ri.", en: 'Correct.' },
      on_wrong: { ru: 'Проверь, делится ли каждая часть. Попробуй ещё.', uz: "Tekshiring, har qism bo'linadimi. Yana urinib ko'ring.", en: 'Check whether every part divides. Try again.' }
    }
  },

  // s8 — TEST MC x3
  s8: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    items: [
      {
        q: { ru: 'Сколько будет 96 : 3?', uz: '96 : 3 nechta bo\'ladi?', en: 'What is 96 : 3?' }, expr: '96 : 3', ci: 0,
        opts: [{ ru: '32', uz: '32', en: '32' }, { ru: '36', uz: '36', en: '36' }, { ru: '23', uz: '23', en: '23' }, { ru: '96', uz: '96', en: '96' }],
        hints: {
          1: { ru: 'Шесть тоже делится на три. Тридцать плюс два.', uz: "Olti ham uchga bo'linadi. O'ttiz qo'shuv ikki.", en: 'The six divides by three as well. Thirty plus two.' },
          2: { ru: 'Цифры на месте, но ответ другой. Тридцать плюс два, тридцать два.', uz: "Raqamlar o'sha, javob boshqa. O'ttiz qo'shuv ikki, o'ttiz ikki.", en: 'The digits are right, but the answer is different. Thirty plus two, thirty two.' },
          3: { ru: 'Это само делимое. Его надо разделить на три.', uz: "Bu bo'linuvchining o'zi. Uni uchga bo'lish kerak.", en: 'That is the dividend itself. It has to be divided by three.' }
        }
      },
      {
        q: { ru: 'Сколько будет (80 + 4) : 4?', uz: '(80 + 4) : 4 nechta bo\'ladi?', en: 'What is (80 + 4) : 4?' }, expr: '(80 + 4) : 4', ci: 0,
        opts: [{ ru: '21', uz: '21', en: '21' }, { ru: '24', uz: '24', en: '24' }, { ru: '20', uz: '20', en: '20' }, { ru: '84', uz: '84', en: '84' }],
        hints: {
          1: { ru: 'Четыре тоже делится на четыре. Двадцать плюс один.', uz: "To'rt ham to'rtga bo'linadi. Yigirma qo'shuv bir.", en: 'The four divides by four as well. Twenty plus one.' },
          2: { ru: 'Это только первая часть. Осталось четыре разделить на четыре.', uz: "Bu faqat birinchi qism. To'rtni to'rtga bo'lish qoldi.", en: 'That is only the first part. Four still has to be divided by four.' },
          3: { ru: 'Это сумма без деления.', uz: "Bu bo'lishsiz yig'indi.", en: 'That is the sum without dividing.' }
        }
      },
      {
        q: { ru: 'Сколько будет 75 : 5?', uz: '75 : 5 nechta bo\'ladi?', en: 'What is 75 : 5?' }, expr: '75 : 5', ci: 0,
        opts: [{ ru: '15', uz: '15', en: '15' }, { ru: '25', uz: '25', en: '25' }, { ru: '14', uz: '14', en: '14' }, { ru: '70', uz: '70', en: '70' }],
        hints: {
          1: { ru: 'Разбей на пятьдесят и двадцать пять. Десять плюс пять.', uz: "Ellik va yigirma beshga bo'ling. O'n qo'shuv besh.", en: 'Split it into fifty and twenty five. Ten plus five.' },
          2: { ru: 'Это семьдесят на пять. Так разбивать неудобно.', uz: "Bu yetmishni beshga. Bunday bo'lish noqulay.", en: 'That is seventy divided by five. Splitting it that way is awkward.' },
          3: { ru: 'Это часть делимого, а не ответ.', uz: "Bu bo'linuvchining qismi, javob emas.", en: 'That is a part of the dividend, not the answer.' }
        }
      }
    ],
    audio: {
      intro: { ru: 'Теперь весь приём. Разбей на делимые части, раздели каждую, сложи. Три задания.', uz: "Endi usul to'liq. Bo'linadigan qismlarga bo'ling, har birini bo'ling, qo'shing. Uchta topshiriq.", en: 'Now the whole method. Split into parts that divide, divide each one, add. Three tasks.' },
      on_correct: { ru: 'Верно.', uz: "To'g'ri.", en: 'Correct.' },
      on_wrong: { ru: 'Раздели каждую часть и сложи частные. Попробуй ещё.', uz: "Har qismni bo'lib, bo'linmalarni qo'shing. Yana urinib ko'ring.", en: 'Divide each part and add the quotients. Try again.' }
    }
  },

  // s9 — BONUS: BURCHAK USULI (ugolok) 96 : 3
  s9: {
    eyebrow: { ru: 'Бонус', uz: 'Bonus', en: 'Bonus' },
    lead: { ru: 'Секрет: деление уголком.', uz: 'Sir: burchak usulida bo\'lish.', en: 'A secret: long division.' },
    left_title: { ru: 'Наша запись', uz: 'Bizning yozuv', en: 'Our way' },
    left_lines: ['(90 + 6) : 3', '30 + 2 = 32'],
    right_title: { ru: 'Уголком', uz: 'Burchak usuli', en: 'Long division' },
    btn1: { ru: 'Разделить десятки', uz: 'O\'nliklarni bo\'lish', en: 'Divide the tens' },
    btn2: { ru: 'Снести единицы', uz: 'Birliklarni tushirish', en: 'Bring down the ones' },
    btn3: { ru: 'Разделить единицы', uz: 'Birliklarni bo\'lish', en: 'Divide the ones' },
    mc_q: { ru: 'Что означает цифра 3 в частном?', uz: "Bo'linmadagi 3 raqami nimani bildiradi?", en: 'What does the digit 3 in the quotient mean?' },
    mc_opts: [
      { ru: 'Три десятка', uz: "Uch o'nlik", en: 'Three tens' },
      { ru: 'Три единицы', uz: 'Uch birlik', en: 'Three ones' },
      { ru: 'Три камешка', uz: 'Uchta toshcha', en: 'Three pebbles' },
      { ru: 'Остаток', uz: 'Qoldiq', en: 'A remainder' }
    ],
    mc_ci: 0,
    mc_hints: {
      1: { ru: 'Тройка стоит в разряде десятков. Это тридцать, три десятка.', uz: "Uch o'nlik xonasida turadi. Bu o'ttiz, uch o'nlik.", en: 'The three stands in the tens place. That is thirty, three tens.' },
      2: { ru: 'Камешки мы делили отдельно, их по два. А тройка это три плиты, три десятка.', uz: "Toshchalarni alohida bo'ldik, ular ikkitadan. Uch esa uch plita, uch o'nlik.", en: 'We divided the pebbles separately, two each. And the three is three slabs, three tens.' },
      3: { ru: 'Остатка здесь нет, всё разделилось. Тройка это часть ответа.', uz: "Bu yerda qoldiq yo'q, hammasi bo'lindi. Uch — javobning qismi.", en: 'There is no remainder here, everything divided. The three is part of the answer.' }
    },
    mc_ok: { ru: 'Именно! Тройка стоит в десятках, это тридцать. А двойка в единицах, это два.', uz: "Aynan! Uch o'nlikda turadi, bu o'ttiz. Ikki esa birlikda, bu ikki.", en: 'Exactly! The three stands in the tens, that is thirty. And the two is in the ones, that is two.' },
    audio: {
      ru: [
        'А теперь взрослая запись. Деление уголком. Это тот же приём, только записанный столбиком.',
        'Берём девять десятков и делим на три. Три десятка, пишем тройку в частное. Три умножить на три, девять, вычитаем. Осталось ноль.',
        'Сносим шесть единиц.',
        'Шесть разделить на три, два. Пишем двойку. Шесть минус шесть, ноль. Остатка нет.',
        'Тридцать два! Тот же ответ, что на тропинках. Уголком мы делим по разрядам, точно как раскладывали плиты и камешки. Подробно научимся ему чуть позже. А теперь вопрос.'
      ],
      uz: [
        "Endi kattalar yozuvi. Burchak usulida bo'lish. Bu o'sha usul, faqat ustun shaklida yozilgan.",
        "To'qqiz o'nlikni olib uchga bo'lamiz. Uch o'nlik, bo'linmaga uchni yozamiz. Uch karra uch, to'qqiz, ayiramiz. Nol qoldi.",
        "Olti birlikni tushiramiz.",
        "Oltini uchga bo'lsak, ikki. Ikkini yozamiz. Olti ayiruv olti, nol. Qoldiq yo'q.",
        "O'ttiz ikki! Yo'laklardagi bilan bir xil javob. Burchak usulida xonalab bo'lamiz, xuddi plita va toshchalarni tarqatgandek. Unga birozdan keyin batafsil o'rganamiz. Endi esa savol."
      ],
      en: ['And now the grown up way of writing. Long division. It is the same method, only written in a column.', 'We take nine tens and divide by three. Three tens, we write a three in the quotient. Three times three is nine, we subtract. Zero is left.', 'We bring down six ones.', 'Six divided by three is two. We write a two. Six minus six, zero. There is no remainder.', 'Thirty two! The same answer as on the paths. In long division we divide place by place, exactly as we laid out the slabs and the pebbles. We will learn it properly a little later. And now a question.']
    }
  },

  // s10 — TRENAJYOR NumPad x3
  s10: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    items: [
      { q: { ru: 'Набери ответ: 84 : 4.', uz: 'Javobni tering: 84 : 4.', en: 'Type the answer: 84 : 4.' }, ans: 21, hint: { ru: 'Восемьдесят на четыре и четыре на четыре, потом сложи.', uz: "Saksonni to'rtga va to'rtni to'rtga, keyin qo'shing.", en: 'Eighty by four and four by four, then add.' } },
      { q: { ru: 'Набери ответ: 65 : 5.', uz: 'Javobni tering: 65 : 5.', en: 'Type the answer: 65 : 5.' }, ans: 13, hint: { ru: 'Разбей на пятьдесят и пятнадцать.', uz: "Ellik va o'n beshga bo'ling.", en: 'Split it into fifty and fifteen.' } },
      { q: { ru: 'Набери ответ: 78 : 6.', uz: 'Javobni tering: 78 : 6.', en: 'Type the answer: 78 : 6.' }, ans: 13, hint: { ru: 'Разбей на шестьдесят и восемнадцать.', uz: "Oltmish va o'n sakkizga bo'ling.", en: 'Split it into sixty and eighteen.' } }
    ],
    audio: {
      intro: { ru: 'Теперь без вариантов. Разбей, раздели, сложи и набери ответ.', uz: "Endi variantlarsiz. Bo'ling, taqsimlang, qo'shing va javobni tering.", en: 'Now without answer choices. Split, divide, add and type the answer.' },
      on_correct: { ru: 'Верно.', uz: "To'g'ri.", en: 'Correct.' }
    }
  },

  // s11 — MASALA (sCASE): Zuhra 96 : 3
  s11: {
    eyebrow: { ru: 'Задача', uz: 'Masala', en: 'Word problem' },
    lead: { ru: 'Зухра раскладывает 96 камней на 3 тропинки поровну.', uz: "Zuhra 96 toshni 3 yo'lakka teng tarqatadi.", en: 'Zuhra is sharing 96 stones equally among 3 paths.' },
    q: { ru: 'Сколько камней на одной тропинке?', uz: 'Bitta yo\'lakda nechta tosh bo\'ladi?', en: 'How many stones go on one path?' },
    ans: 32,
    setup_audio: { ru: 'Зухра взялась за ящик. Девяносто шесть камней, три тропинки, всем поровну.', uz: "Zuhra sandiqqa qo'l urdi. To'qson oltita tosh, uchta yo'lak, hammaga teng.", en: 'Zuhra has taken on the box. Ninety six stones, three paths, equal shares for all.' },
    audio: {
      intro: { ru: 'Помоги Зухре. Набери ответ.', uz: "Zuhraga yordam bering. Javobni tering.", en: 'Help Zuhra. Type the answer.' },
      on_correct: { ru: 'Тридцать два камня на тропинку! Зухра справилась.', uz: "Yo'lakka o'ttiz ikkita tosh! Zuhra bajardi.", en: 'Thirty two stones per path! Zuhra managed it.' },
      on_wrong: { ru: 'Разбей девяносто шесть на девяносто и шесть. Раздели каждое на три и сложи.', uz: "To'qson oltini to'qson va oltiga bo'ling. Har birini uchga bo'lib qo'shing.", en: 'Split ninety six into ninety and six. Divide each by three and add.' }
    }
  },

  // s12 — XATONI TOP
  s12: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    q: { ru: 'Какая запись неверна?', uz: "Qaysi yozuv noto'g'ri?", en: 'Only one zero appeared. By a hundred means two zeros.' },
    items: [
      {
        stmts: ['(60+9) : 3 = 23', '(80+6) : 2 = 46', '(40+8) : 4 = 12', '(90+5) : 5 = 19'],
        wrong: 1,
        hint: { ru: 'Эта запись верна. Проверь остальные. Разделено ли каждое слагаемое.', uz: "Bu yozuv to'g'ri. Boshqalarini tekshiring. Har qo'shiluvchi bo'linganmi.", en: 'This line is correct. Check the others. Was every addend divided?' }
      }
    ],
    audio: {
      intro: { ru: 'Бит записал четыре примера, в один закралась ошибка. Найди её.', uz: "Bit to'rtta misol yozdi, bittasiga xato yashiringan. Uni toping.", en: 'The lights in the garden were changing and Bit did not write down how. Look at each card and work out what happened.' },
      on_correct: { ru: 'Да! Восемьдесят разделили, а шесть просто приписали. Шесть на два, три. Сорок плюс три, сорок три.', uz: "Ha! Saksonni bo'ldi, oltini esa shunchaki qo'shib qo'ydi. Oltini ikkiga, uch. Qirq qo'shuv uch, qirq uch.", en: 'Yes! Eighty was divided, and the six was simply written on. Six by two is three. Forty plus three, forty three.' },
      on_wrong: { ru: 'Эта запись верна. Проверь остальные. Разделено ли каждое слагаемое.', uz: "Bu yozuv to'g'ri. Boshqalarini tekshiring. Har qo'shiluvchi bo'linganmi.", en: 'This line is correct. Check the others. Was every addend divided?' }
    }
  },

  // s13 — FINAL 5 savol + FactCard
  s13: {
    eyebrow: { ru: 'Финал', uz: 'Final', en: 'Final' },
    intro_line: { ru: 'Финальная проверка. Пять заданий.', uz: 'Yakuniy tekshiruv. Beshta topshiriq.', en: 'The final check. Five tasks.' },
    items: [
      {
        kind: 'num', ans: 22,
        q: { ru: 'Набери ответ: (60 + 6) : 3.', uz: 'Javobni tering: (60 + 6) : 3.', en: 'Type the answer: (60 + 6) : 3.' },
        hint: { ru: 'Двадцать плюс два.', uz: "Yigirma qo'shuv ikki.", en: 'Twenty plus two.' }
      },
      {
        kind: 'mc',
        q: { ru: 'Сколько будет 84 : 4?', uz: '84 : 4 nechta bo\'ladi?', en: 'What is 84 : 4?' },
        opt0: { ru: '21', uz: '21', en: '21' },
        opt1: { ru: '24', uz: '24', en: '24' },
        opt2: { ru: '20', uz: '20', en: '20' },
        opt3: { ru: '214', uz: '214', en: '214' },
        wrong_1: { ru: 'Четыре тоже делится на четыре.', uz: "To'rt ham to'rtga bo'linadi.", en: 'The four divides by four as well.' },
        wrong_2: { ru: 'Это только первая часть.', uz: 'Bu faqat birinchi qism.', en: 'That is only the first part.' },
        wrong_3: { ru: 'Части ответа складывают, а не ставят рядом.', uz: "Javob qismlari qo'shiladi, yonma-yon qo'yilmaydi.", en: 'The parts of the answer are added, not put side by side.' }
      },
      {
        kind: 'mc',
        q: { ru: 'Как удобно разбить 72 для деления на 6?', uz: "6 ga bo'lish uchun 72 ni qanday qulay bo'lamiz?", en: 'How is it handy to split 72 for dividing by 6?' },
        opt0: { ru: '60 + 12', uz: '60 + 12', en: '60 + 12' },
        opt1: { ru: '70 + 2', uz: '70 + 2', en: '70 + 2' },
        opt2: { ru: '7 + 2', uz: '7 + 2', en: '7 + 2' },
        opt3: { ru: '60 + 22', uz: '60 + 22', en: '60 + 22' },
        wrong_1: { ru: 'Семьдесят на шесть не делится. Возьми шестьдесят.', uz: "Yetmish oltiga bo'linmaydi. Oltmishni oling.", en: 'Seventy does not divide by six. Take sixty.' },
        wrong_2: { ru: 'Семь здесь это семь десятков.', uz: "Bu yerdagi yetti aslida yetti o'nlik.", en: 'The seven here is seven tens.' },
        wrong_3: { ru: 'Вместе получится восемьдесят два.', uz: 'Birga sakson ikki chiqadi.', en: 'Together that gives eighty two.' }
      },
      {
        kind: 'num', ans: 13,
        q: { ru: 'Набери ответ: 65 : 5.', uz: 'Javobni tering: 65 : 5.', en: 'Type the answer: 65 : 5.' },
        hint: { ru: 'Пятьдесят и пятнадцать.', uz: "Ellik va o'n besh.", en: 'Fifty and fifteen.' }
      },
      {
        kind: 'mc',
        q: { ru: 'Какая запись неверна?', uz: "Qaysi yozuv noto'g'ri?", en: 'Only one zero appeared. By a hundred means two zeros.' },
        opt0: { ru: '(80+6) : 2 = 46', uz: '(80+6) : 2 = 46', en: '(80+6) : 2 = 46' },
        opt1: { ru: '(60+9) : 3 = 23', uz: '(60+9) : 3 = 23', en: '(60+9) : 3 = 23' },
        opt2: { ru: '(40+8) : 4 = 12', uz: '(40+8) : 4 = 12', en: '(40+8) : 4 = 12' },
        opt3: { ru: '(90+5) : 5 = 19', uz: '(90+5) : 5 = 19', en: '(90+5) : 5 = 19' },
        wrong_1: { ru: 'Эта запись верна. Ищи другую.', uz: "Bu yozuv to'g'ri. Boshqasini qidiring.", en: 'Now without ready answers. Type the answer yourself.' },
        wrong_2: { ru: 'Эта запись верна. Ищи другую.', uz: "Bu yozuv to'g'ri. Boshqasini qidiring.", en: 'Now without ready answers. Type the answer yourself.' },
        wrong_3: { ru: 'Эта запись верна. Ищи другую.', uz: "Bu yozuv to'g'ri. Boshqasini qidiring.", en: 'Now without ready answers. Type the answer yourself.' }
      }
    ],
    fact_badge: { ru: 'Знаешь ли ты?', uz: 'Bilasizmi?', en: 'Which line is wrong?' },
    fact_text: { ru: 'Пчёлы строят соты из одинаковых шестиугольников. Такие ячейки ложатся вплотную, без щелей, и воска уходит меньше всего. Математики доказали, что фигуры лучше шестиугольника для этого нет.', uz: "Asalarilar uyani bir xil oltiburchaklardan quradi. Bunday katakchalar bo'shliqsiz, zich joylashadi va mum eng kam ketadi. Matematiklar buning uchun oltiburchakdan yaxshiroq shakl yo'qligini isbotlagan.", en: 'Bees build honeycombs from identical hexagons. Such cells fit tightly, with no gaps, and the least wax is used. Mathematicians proved that there is no better shape for this than a hexagon.' },
    fact_audio: { ru: 'Пчёлы строят соты из одинаковых шестиугольников. Такие ячейки ложатся вплотную, без щелей, и воска уходит меньше всего. Математики доказали, что фигуры лучше шестиугольника для этого нет. Мы разделили девяносто шесть камней на три тропинки поровну, а пчёлы делят соты на равные ячейки.', uz: "Asalarilar uyani bir xil oltiburchaklardan quradi. Bunday katakchalar bo'shliqsiz, zich joylashadi va mum eng kam ketadi. Matematiklar buning uchun oltiburchakdan yaxshiroq shakl yo'qligini isbotlagan. Biz to'qson oltita toshni uch yo'lakka teng bo'ldik, asalarilar esa uyani teng katakchalarga bo'ladi.", en: 'Bees build honeycombs from identical hexagons. Such cells fit tightly, with no gaps, and the least wax is used. Mathematicians proved that there is no better shape for this than a hexagon. We divided ninety six stones equally among three paths, and bees divide a comb into equal cells.' },
    audio: {
      intro: { ru: 'Финальная проверка. Пять заданий, отвечай на каждое.', uz: 'Yakuniy tekshiruv. Beshta topshiriq, har biriga javob bering.', en: 'The final check. Five tasks, answer each one.' },
      on_correct: { ru: 'Верно.', uz: "To'g'ri.", en: 'Correct.' },
      on_wrong: { ru: 'Посмотри разбор и попробуй ещё.', uz: "Tahlilga qarang va yana urinib ko'ring.", en: 'Word problem' }
    }
  },

  // s14 — YAKUN
  s14: {
    eyebrow: { ru: 'Итог', uz: 'Yakun', en: 'Result' },
    praise: { ru: 'Молодец!', uz: 'Barakalla!', en: 'Well done!' },
    mission_done: { ru: 'Три новые тропинки светятся!', uz: "Uchta yangi yo'lak porlayapti!", en: 'Three new paths are glowing!' },
    cando: { ru: 'Теперь ты умеешь делить числа, которых нет в таблице.', uz: "Endi siz jadvalda yo'q sonlarni bo'la olasiz.", en: 'Now you can divide numbers that are not in the table.' },
    rule_recap: { ru: 'Разбей делимое на части, которые делятся, раздели каждую и сложи частные. (90+6) : 3 = 30 + 2 = 32.', uz: "Bo'linuvchini bo'linadigan qismlarga bo'ling, har birini bo'ling va bo'linmalarni qo'shing.", en: 'Split the dividend into parts that divide, divide each one and add the quotients. (90+6) : 3 = 30 + 2 = 32.' },
    conn_label_refs: { ru: 'Опирается на', uz: 'Tayanadi', en: 'Builds on' },
    conn_refs: { ru: 'урок 11: умножение суммы; уроки 9, 10', uz: "11-dars: yig'indini ko'paytirish; 9, 10-darslar", en: 'lesson 11: multiplying a sum; lessons 9, 10' },
    conn_label_next: { ru: 'Дальше', uz: 'Keyingi', en: 'Next' },
    conn_next: { ru: 'порядок действий', uz: 'amallar tartibi', en: 'the order of operations' },
    audio: {
      ru: 'Три новые тропинки готовы, и у тебя новый приём. Разбей на делимые части, раздели каждую, сложи частные. И взрослая запись, уголок, тебе уже знакома. А если в одном примере сразу и плюс, и умножение? Что делать первым? Об этом в следующем уроке!',
      uz: "Uchta yangi yo'lak tayyor, sizda esa yangi usul bor. Bo'linadigan qismlarga bo'ling, har birini bo'ling, bo'linmalarni qo'shing. Kattalar yozuvi, burchak usuli ham endi tanish. Agar bitta misolda ham qo'shuv, ham ko'paytirish bo'lsa-chi? Nimani birinchi qilamiz? Bu haqda keyingi darsda!",
      en: 'Three new paths are ready and you have a new method. Split into parts that divide, divide each one, add the quotients. And the grown-up way, long division, is already familiar to you. And what if one example has both a plus and a multiplication? Which comes first? That is in the next lesson!'
    }
  }
};

// slaydlararo ko'priklar (audio-intro boshiga; ekranda ko'rinmaydi). TTS-toza.
const BRIDGES = {
  s1:  { ru: 'Сначала вспомним, что умеем.', uz: 'Avval bilganimizni eslaymiz.', en: 'First let us recall what we can do.' },
  s2:  { ru: 'Теперь к ящику.', uz: 'Endi sandiqqa.', en: 'Now to the box.' },
  s3:  { ru: 'Камни разложены. Считаем.', uz: 'Toshlar tarqatildi. Sanaymiz.', en: 'The stones are laid out. We count.' },
  s4:  { ru: 'Запишем это правилом.', uz: 'Buni qoida qilib olamiz.', en: 'Let us write this down as a rule.' },
  s5:  { ru: 'А вот и Бит со своим счётом.', uz: "Mana Bit ham o'z hisobi bilan.", en: 'And here is Bit with his counting.' },
  s6:  { ru: 'Проверь себя на скорость.', uz: "O'zingizni tezlikka sinang.", en: 'That is a hundred plus six. But we need six times a hundred.' },
  s7:  { ru: 'Потренируем главный шаг.', uz: 'Asosiy qadamni mashq qilamiz.', en: 'Let us practise the main step.' },
  s8:  { ru: 'Теперь приём целиком.', uz: "Endi usul to'liq.", en: 'Now the whole method.' },
  s9:  { ru: 'Открою тебе один секрет.', uz: 'Sizga bir sirni ochaman.', en: 'Let me tell you one secret.' },
  s10: { ru: 'Теперь набирай ответы сам.', uz: "Endi javoblarni o'zingiz tering.", en: '6 × 100 = 60' },
  s11: { ru: 'Зухре нужна помощь.', uz: 'Zuhraga yordam kerak.', en: 'Zuhra needs help.' },
  s12: { ru: 'Проверим записи Бита.', uz: 'Bitning yozuvlarini tekshiramiz.', en: '30 × 10 = 300' },
  s13: { ru: 'Финальная проверка.', uz: 'Yakuniy tekshiruv.', en: 'The final check.' },
  s14: { ru: 'Тропинки готовы. Идём дальше!', uz: "Yo'laklar tayyor. Davom etamiz!", en: 'The paths are ready. Let us move on!' }
};

// s14 payoff (xulosadan oldin aytiladi)
const S14_PAYOFF = {
  ru: 'Миссия выполнена! Ящик разобран, три новые тропинки светятся одинаково. Спасибо за помощь!',
  uz: "Missiya bajarildi! Sandiq bo'shatildi, uchta yangi yo'lak bir xil porlayapti. Yordamingiz uchun rahmat!",
  en: 'Mission complete! The box is sorted out and three new paths glow the same. Thank you for your help!'
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
    <text x="200" y="63" textAnchor="middle" fontSize="11" fontWeight="800" fill="#8A4E64" fontFamily="'JetBrains Mono', monospace">96 : 3 = 32</text>
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
    {/* 13-DARS YAKUNI: uchta tayyor yo'lak porlaydi (to'siq yechildi) */}
    <g>
      <path d="M181 178 L188 178 L92 230 L26 230 Z" fill="#FFE6A6" opacity="0.42" stroke="#FFF0C4" strokeWidth="0.6" strokeOpacity="0.5"/>
      <path d="M196 178 L203 178 L222 230 L166 230 Z" fill="#FFE6A6" opacity="0.42" stroke="#FFF0C4" strokeWidth="0.6" strokeOpacity="0.5"/>
      <path d="M211 178 L218 178 L372 230 L306 230 Z" fill="#FFE6A6" opacity="0.42" stroke="#FFF0C4" strokeWidth="0.6" strokeOpacity="0.5"/>
      <g fill="#FFF0C4">
        <circle className="lm-glow" cx="171" cy="190" r="1.6"/><circle className="lm-glow" style={{ animationDelay: '0.4s' }} cx="146" cy="206" r="2"/><circle className="lm-glow" style={{ animationDelay: '0.8s' }} cx="108" cy="224" r="2.4"/>
        <circle className="lm-glow" style={{ animationDelay: '0.2s' }} cx="199" cy="190" r="1.6"/><circle className="lm-glow" style={{ animationDelay: '0.6s' }} cx="201" cy="206" r="2"/><circle className="lm-glow" style={{ animationDelay: '1s' }} cx="203" cy="224" r="2.4"/>
        <circle className="lm-glow" style={{ animationDelay: '0.3s' }} cx="228" cy="190" r="1.6"/><circle className="lm-glow" style={{ animationDelay: '0.7s' }} cx="264" cy="206" r="2"/><circle className="lm-glow" style={{ animationDelay: '1.1s' }} cx="308" cy="224" r="2.4"/>
      </g>
    </g>
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
              {hintMsg && <p className="lm-hint-bad fade-up">{t(hintMsg)}</p>}
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
      <span className="lm-clock-cap mono">{tri(lang, 'Подумай…', "O'ylab ko'ring…", 'Think…')}</span>
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
// DARS13 EKRANLARI (15). Donor: Dars11 (tuproq-yo'laklar, uycha, yashil javob, FactCard
// freym ostida, orbital anim, TAP bilan ochilish).
// YANGI: ShareOutBoard (sandiqdan 3 yo'lakka TARQATISH) va DivBoard (BURCHAK USULI —
//   5-sinf grade5/Dars05.jsx DivBoard naqshidan port: monoshrift setka, vertikal tayoq,
//   ayirish chizig'i, minus ayiriluvchining chap yonida).
// ============================================================

// --- TOSH SANDIQ: 9 plita (3x3) + 6 toshcha. Tarqatishdan oldingi holat.
const StoreBox = ({ plitas = 9, toshchas = 6 }) => (
  <div className="d13-box" aria-hidden="true">
    <span className="d13-box-plitas">
      {Array.from({ length: plitas }).map((_, i) => <PlitaViz key={i}/>)}
    </span>
    {toshchas > 0 && (
      <span className="d13-box-toshchas">
        {Array.from({ length: toshchas }).map((_, i) => <ToshchaViz key={i} delay={i * 0.12}/>)}
      </span>
    )}
  </div>
);

// --- TARQATISH: phase 0 sandiq to'la · 1 plitalar tarqaldi · 2 toshchalar ham tarqaldi
const ShareOutBoard = ({ phase, tagPlita, tagFull }) => (
  <div className="d13-share">
    {phase < 2 && (
      <div className="d13-share-src">
        <StoreBox plitas={phase === 0 ? 9 : 0} toshchas={6}/>
      </div>
    )}
    <div className="d12-ground d13-share-dst">
      <span className="d12-grass d12-grass-top" aria-hidden="true">
        {D12_GRASS.slice(0, 6).map((x, i) => <i key={i} style={{ left: `${x + 3}%`, animationDelay: `${i * 0.3}s` }}/>)}
      </span>
      <div className="d12-field">
        {[0, 1, 2].map((r) => (
          <div key={r} className="d12-row">
            <span className="d12-plitas">
              {phase >= 1
                ? [0, 1, 2].map((k) => <span key={k} className="lm-reveal" style={{ animationDelay: `${r * 0.12 + k * 0.08}s`, display: 'inline-block' }}><PlitaViz/></span>)
                : [0, 1, 2].map((k) => <span key={k} className="d13-slot"/>)}
            </span>
            <span className="d12-toshchas">
              {phase >= 2
                ? [0, 1].map((k) => <span key={k} className="lm-reveal" style={{ animationDelay: `${0.3 + r * 0.1 + k * 0.1}s`, display: 'inline-block' }}><ToshchaViz delay={r * 0.2 + k * 0.2}/></span>)
                : [0, 1].map((k) => <span key={k} className="d13-slot d13-slot-sm"/>)}
            </span>
            <HutViz/>
            {phase >= 1 && (
              <span className={`mono d13-tag ${phase >= 2 ? 'd13-tag-full' : ''}`}>{phase >= 2 ? tagFull : '30'}</span>
            )}
          </div>
        ))}
      </div>
      <span className="d12-grass d12-grass-bot" aria-hidden="true">
        {D12_GRASS.slice(0, 6).map((x, i) => <i key={i} style={{ left: `${97 - x}%`, animationDelay: `${i * 0.24}s` }}/>)}
      </span>
    </div>
    {phase === 1 && <span className="mono d13-note">{tagPlita}</span>}
  </div>
);

// ============================================================
// BURCHAK USULI (ugolok) — grade5/Dars05.jsx DivBoard naqshidan PORT.
// O'sha texnika: monoshrift «setka» (xonalar ustma-ust), o'ngdagi bo'luvchi vertikal
// tayoq bilan ajratilgan, ayirish chizig'i absolyut joylashtirilgan, MINUS ayiriluvchining
// chap YONIDA. reveal butun son — tugallangan qadamlar; reveal + 0.5 — «tushirildi» holati.
// plan: { dividend, divisor, quotient, finalRemainder, steps: [{ pd, col, qd, prod }] }
// ============================================================
const D13_MONO = { fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(19px, 4.4vw, 28px)', lineHeight: 1.25, fontWeight: 800, whiteSpace: 'pre', margin: 0 };
const d13grid = (s, endCol, L) => {
  const a = Array(L).fill(' ');
  const start = endCol - s.length + 1;
  for (let i = 0; i < s.length; i++) { const idx = start + i; if (idx >= 0 && idx < L) a[idx] = s[i]; }
  return a.join('');
};
const DivBoard = ({ plan, reveal }) => {
  const L = plan.dividend.length;
  const shown = Math.floor(reveal);
  const half = reveal - shown >= 0.5;
  const rows = [];
  rows.push({ kind: 'num', s: d13grid(plan.dividend, L - 1, L), color: T.ink });
  for (let k = 0; k < shown; k++) {
    const st = plan.steps[k];
    if (k >= 1) rows.push({ kind: 'num', s: d13grid(st.pd, st.col, L), color: T.ink });
    rows.push({ kind: 'num', s: d13grid(st.prod, st.col, L), color: T.ink2, minus: true, start: st.col - st.prod.length + 1 });
    rows.push({ kind: 'bar', start: st.col - st.prod.length + 1, len: st.prod.length });
  }
  // «tushirildi»: keyingi qadamning to'liqsiz bo'linuvchisi ko'rinadi, lekin hali bo'linmadi
  if (half && shown < plan.steps.length) {
    const st = plan.steps[shown];
    rows.push({ kind: 'num', s: d13grid(st.pd, st.col, L), color: T.accent });
  }
  if (shown === plan.steps.length) rows.push({ kind: 'num', s: d13grid(plan.finalRemainder, L - 1, L), color: plan.finalRemainder !== '0' ? T.accent : T.ink3 });
  const qShown = plan.quotient.slice(0, shown);
  const lineW = Math.max(plan.divisor.length, plan.quotient.length) + 0.6;
  return (
    <div className="d13-div" style={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
      <div>
        {rows.map((r, ri) => (
          r.kind === 'bar' ? (
            <div key={ri} style={{ position: 'relative', height: '0.3em' }}>
              <div style={{ position: 'absolute', top: '50%', left: `calc(0.9ch + ${r.start}ch)`, width: `${r.len + (ri <= 2 ? Math.max(0, Math.min(3, L - (r.start + r.len))) : 3)}ch`, height: 2, background: T.ink, transform: 'translateY(-50%)' }}/>
            </div>
          ) : (
            <div key={ri} style={{ display: 'flex', position: 'relative' }}>
              <span style={{ ...D13_MONO, width: '0.9ch' }}>{' '}</span>
              <span style={{ ...D13_MONO, color: r.color }}>{r.s}</span>
              {/* MINUS o'z satrining O'RTASIDA turadi (top 50%), aks holda yuqoridagi
                  satrga chiqib ketadi — 5-sinfda lineHeight 1 edi, bizda 1.25. */}
              {r.minus && (
                <span style={{ position: 'absolute', top: '50%', left: `calc(0.9ch + ${r.start}ch)`, transform: 'translate(-120%, -50%)', ...D13_MONO, color: T.ink2 }}>{'−'}</span>
              )}
            </div>
          )
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', borderLeft: `2px solid ${T.ink}`, paddingLeft: 4, alignItems: 'flex-start' }}>
        <div style={{ ...D13_MONO, color: T.ink }}>{plan.divisor}</div>
        <div style={{ height: 2, background: T.ink, width: `${lineW}ch`, ...D13_MONO, borderRadius: 1, margin: '2px 0' }}/>
        <div style={{ ...D13_MONO, color: T.success }}>{qShown || ' '}</div>
      </div>
    </div>
  );
};
const D13_DIV_PLAN = {
  dividend: '96', divisor: '3', quotient: '32', finalRemainder: '0',
  steps: [{ pd: '9', col: 0, qd: '3', prod: '9' }, { pd: '6', col: 1, qd: '2', prod: '6' }]
};

// FactCard illyustratsiyasi (s13): ASALARI UYASI (oltiburchak katakchalar) + ASALARI orbitada
// (Dars10/12 orbital texnikasi). Fakt matematika va fanga tegishli: teng bo'lish + oltiburchak.
const D13_STARS = [
  [18, 20, 1.0, 0], [42, 12, 0.7, 0.6], [68, 34, 0.9, 1.2], [28, 62, 0.8, 0.3],
  [250, 18, 1.0, 0.5], [286, 12, 0.7, 1.0], [312, 30, 1.1, 1.5], [268, 48, 0.6, 2.0],
  [148, 10, 0.8, 0.8], [200, 14, 0.7, 1.3]
];
// oltiburchak (yotiq: uchi chapda va o'ngda) — qo'shnilar markazi 1.732*r masofada
const hexPts = (cx, cy, r = 17) => [
  [cx + r, cy], [cx + r / 2, cy + r * 0.866], [cx - r / 2, cy + r * 0.866],
  [cx - r, cy], [cx - r / 2, cy - r * 0.866], [cx + r / 2, cy - r * 0.866]
].map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
// markaz + 6 qo'shni: bo'shliqsiz yopishadi (tekislikni to'ldirish)
const D13_CELLS = [
  [170, 70, true], [195.5, 84.7, true], [170, 99.4, false], [144.5, 84.7, true],
  [144.5, 55.3, false], [170, 40.6, true], [195.5, 55.3, false]
];
const BeeFig = () => (
  <>
    <circle cx="170" cy="70" r="9" fill="url(#d13Glow)"/>
    <g transform="rotate(-12 170 70)">
      <ellipse cx="165.6" cy="66.4" rx="4.2" ry="2.2" fill="rgba(255,255,255,0.72)" transform="rotate(-34 165.6 66.4)"/>
      <ellipse cx="169.4" cy="65.6" rx="4.6" ry="2.4" fill="rgba(255,255,255,0.85)" transform="rotate(-18 169.4 65.6)"/>
      <ellipse cx="170" cy="70" rx="6.4" ry="4.3" fill="#F2C14A" stroke="#A87C24" strokeWidth="0.7"/>
      <path d="M168.2 66.1 q1.3 3.9 0 7.8" stroke="#3A2A16" strokeWidth="1.6" fill="none"/>
      <path d="M171.8 66.5 q1.1 3.5 0 7" stroke="#3A2A16" strokeWidth="1.6" fill="none"/>
      <circle cx="175.4" cy="69.4" r="2.5" fill="#3A2A16"/>
      <circle cx="176.4" cy="68.4" r="0.7" fill="#FFF6E8"/>
    </g>
  </>
);
const HoneycombFig = () => (
  <span className="d2-factfig" aria-hidden="true">
    <svg viewBox="0 0 340 150" width="340" height="150" preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="d13Sky" cx="50%" cy="30%" r="75%"><stop offset="0%" stopColor="#1E2C52"/><stop offset="60%" stopColor="#141E3C"/><stop offset="100%" stopColor="#0A1024"/></radialGradient>
        <radialGradient id="d13Glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#FFE7A8" stopOpacity="0.85"/><stop offset="60%" stopColor="#F0C46A" stopOpacity="0.35"/><stop offset="100%" stopColor="#F0C46A" stopOpacity="0"/></radialGradient>
        <radialGradient id="d13Honey" cx="38%" cy="30%" r="75%"><stop offset="0%" stopColor="#FFEEB4"/><stop offset="100%" stopColor="#E8A93C"/></radialGradient>
        <linearGradient id="d13Wax" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3A3050"/><stop offset="100%" stopColor="#241E38"/></linearGradient>
        <clipPath id="d13Clip"><rect x="0" y="0" width="340" height="150" rx="16"/></clipPath>
      </defs>
      <g clipPath="url(#d13Clip)">
        <rect x="0" y="0" width="340" height="150" fill="url(#d13Sky)"/>
        <g fill="#FFF6E8">{D13_STARS.map(([x, y, r, d], i) => <circle key={i} className="star-tw" style={{ animationDelay: `${d}s` }} cx={x} cy={y} r={r}/>)}</g>
        {/* uzoqdagi porlayotgan yo'laklar */}
        <g opacity="0.5">
          <rect x="18" y="128" width="44" height="4" rx="2" fill="#2C4433"/><rect x="70" y="128" width="44" height="4" rx="2" fill="#2C4433"/>
          <rect x="232" y="128" width="44" height="4" rx="2" fill="#2C4433"/><rect x="284" y="128" width="40" height="4" rx="2" fill="#2C4433"/>
          <circle className="star-tw" style={{ animationDelay: '0.5s' }} cx="40" cy="130" r="1.4" fill="#FFE6A6"/>
          <circle className="star-tw" style={{ animationDelay: '1.3s' }} cx="92" cy="130" r="1.4" fill="#FFE6A6"/>
          <circle className="star-tw" style={{ animationDelay: '0.9s' }} cx="254" cy="130" r="1.4" fill="#FFE6A6"/>
        </g>
        {/* orbita izi */}
        <ellipse cx="170" cy="70" rx="74" ry="41.4" fill="none" stroke="rgba(248,232,200,0.22)" strokeWidth="1.1"/>
        {/* ORQA asalari */}
        <g className="lumo-orbit-back"><BeeFig/></g>
        {/* UYA: markaz + 6 qo'shni oltiburchak, bo'shliqsiz yopishgan */}
        <circle className="rd-glow" cx="170" cy="70" r="52" fill="url(#d13Glow)"/>
        <g>
          {D13_CELLS.map(([cx, cy, full], i) => (
            <g key={i} className="g1-pop-in" style={{ animationDelay: `${0.12 + i * 0.09}s` }}>
              <polygon points={hexPts(cx, cy)} fill={full ? 'url(#d13Honey)' : 'url(#d13Wax)'} stroke="#C79A46" strokeWidth="1.6" strokeLinejoin="round"/>
              {full && <polygon points={hexPts(cx, cy, 10)} fill="rgba(255,255,255,0.16)"/>}
            </g>
          ))}
        </g>
        {/* asal tomchisi (o'ng pastdagi katakdan) */}
        <path d="M195.5 99.4 q3.4 5 3.4 7.4 q0 3.4 -3.4 3.4 q-3.4 0 -3.4 -3.4 q0 -2.4 3.4 -7.4 Z" fill="#E8A93C" opacity="0.9"/>
        {/* OLD asalari */}
        <g className="lumo-orbit-front"><BeeFig/></g>
      </g>
    </svg>
  </span>
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1.3vw, 10px)' }}>
        <div className="fade-up" style={{ alignSelf: 'center', background: T.accentSoft, color: T.accent, fontWeight: 800, fontSize: 'clamp(12px, 1.8vw, 15px)', padding: '5px 14px', borderRadius: 999 }}>{t(c.topic)}</div>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        {/* ERTALAB: 12-darsda sahna tungi qatlamsiz (11-darsda kechqurun edi) */}
        <div className="frame fade-up delay-1 d13-hook-scene" style={{ padding: 'clamp(8px, 1.8vw, 14px)', overflow: 'hidden' }}>
          <LessonScene gathered={ok}/>
        </div>
        {picked === null && (
          <div className="frame fade-up delay-1 d13-boxrow" style={{ padding: 'clamp(8px, 1.6vw, 12px)' }}>
            <StoreBox/>
            <span className="mono d13-boxcap">{tri(lang, '9 плит + 6 камешков = 96', '9 plita + 6 toshcha = 96', '9 slabs + 6 pebbles = 96')}</span>
          </div>
        )}
        <p className="fade-up delay-1" style={{ textAlign: 'center', color: T.ink2, fontWeight: 600, fontSize: 'clamp(13px, 1.8vw, 16px)', margin: 0 }}>{t(c.q)}</p>
        {picked === null && (
          <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {order.map((k, i) => (
              <button key={i} className="option" disabled={!canAct} onClick={() => pick(i)}
                style={{ padding: 'clamp(10px, 1.5vw, 12px)', fontSize: 'clamp(12px, 1.8vw, 16px)', minHeight: 'clamp(46px, 6.6vw, 56px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
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

// s1 — KO'PRIK: ikki karta BITTALAB ochiladi
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

// s2 — TARQATISH (ShareOut): tugma bosiladi, plitalar keyin toshchalar tarqaladi
const Screen2 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s2;
  const audio = useAudio([
    brgSeg('s2', lang),
    { id: 's2_0', text: c.audio[lang][0], trigger: 'after_previous', waits_for: null },
    { id: 's2_1', text: c.audio[lang][1], trigger: 'after_previous', waits_for: null },
    { id: 's2_2', text: c.audio[lang][2], trigger: 'on_event:share', waits_for: null },
    { id: 's2_3', text: c.audio[lang][3], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [phase, setPhase] = useState(0);
  const share = () => {
    if (!canAct || phase > 0) return;
    setPhase(1); sfx.playCorrect();
    audio.triggerInternal('share');
    setTimeout(() => setPhase(2), 1900);
  };
  const done = phase >= 2;
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
          <ShareOutBoard phase={phase} tagPlita={t(c.tag_plita)} tagFull={t(c.tag_full)}/>
          {phase === 0 && (
            <button className="btn-white-accent" disabled={!canAct} onClick={share}
              style={{ fontSize: 'clamp(14px, 2.2vw, 17px)' }}>{t(c.btn)}</button>
          )}
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

// s3 — QISMLAR HISOBI: uch satr BOLANING TAP'i bilan
const Screen3 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s3;
  const audio = useAudio([
    brgSeg('s3', lang),
    ...c.audio[lang].map((text, i) => ({ id: `s3_${i}`, text, trigger: i === 0 ? 'on_event:step1' : `on_event:step${i + 1}`, waits_for: null }))
  ]);
  const canAct = useCanAnswer(audio);
  const { step, done, advance } = useTapSteps(audio, c.audio[lang].length + 1);
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
  const btnLabel = step === 0 ? c.btn1 : (step === 1 ? c.btn2 : c.btn3);
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.8vw, 12px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(8px, 1.8vw, 12px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
          <FrameFx/>
          <div style={{ transform: 'scale(0.78)', transformOrigin: 'center', margin: 'calc(-0.11 * clamp(120px, 26vw, 190px)) 0' }}>
            <ShareOutBoard phase={2} tagPlita={t(c.line1)} tagFull="32"/>
          </div>
          {lines.map((l, i) => step >= i + 1 && (
            <span key={i} className="mono lm-reveal" style={{ fontSize: `clamp(${i === 2 ? 19 : 16}px, ${i === 2 ? 3.8 : 3}vw, ${i === 2 ? 28 : 22}px)`, fontWeight: 800, color: colors[i] }}>{t(l)}</span>
          ))}
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <h1 className="title h-sub fade-up" style={{ textAlign: 'center', color: T.accent }}>{t(c.q)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10, padding: 'clamp(12px, 2.4vw, 18px)' }}>
          <FrameFx/>
          {order.map((k, i) => (
            <button key={i} className={`option ${solved && i === ci ? 'option-correct' : ''} ${wrongSet.has(i) ? 'option-picked-wrong' : ''}`}
              disabled={!canAct || solved || wrongSet.has(i)} onClick={() => pick(i)}
              style={{ padding: 'clamp(10px, 1.6vw, 13px)', minHeight: 'clamp(44px, 6.2vw, 54px)', fontSize: 'clamp(12px, 1.8vw, 15px)', fontWeight: 800, textAlign: 'center' }}>
              {t(c.opts[k])}
            </button>
          ))}
          {hintMsg && !solved && <p className="lm-hint-bad fade-up">{t(hintMsg)}</p>}
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

// s5 — BIT TUZOG'I (M1)
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

// s6 — 5 SONIYA SOAT
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
        correctAnswer: '34', studentAnswer: '34', correct: firstRef.current,
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
              {hintMsg && !solved && <p className="lm-hint-bad fade-up">{t(hintMsg)}</p>}
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

// s7 — «QANDAY BO'LAMIZ?» MC x3 (figura — ifoda)
const Screen7 = (props) => {
  const t = useT();
  const c = CONTENT.s7;
  const heading = () => t(c.q);
  const renderFig = (it) => <span className="mono" style={{ fontSize: 'clamp(26px, 5.8vw, 38px)', fontWeight: 800, color: T.ink }}>{it.expr}</span>;
  return <MCRoundD2 props={props} ck="s7" cols={2} heading={heading} renderFig={renderFig}/>;
};

// s8 — TEST MC x3
const Screen8 = (props) => {
  const t = useT();
  const c = CONTENT.s8;
  const heading = (it) => t(it.q);
  const renderFig = (it) => <span className="mono" style={{ fontSize: 'clamp(24px, 5.4vw, 36px)', fontWeight: 800, color: T.ink }}>{it.expr}</span>;
  return <MCRoundD2 props={props} ck="s8" cols={2} heading={heading} renderFig={renderFig}/>;
};

// s9 — BONUS: BURCHAK USULI (ugolok) + 1 savol
const Screen9 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s9;
  const audio = useAudio([
    brgSeg('s9', lang),
    ...c.audio[lang].map((text, i) => ({ id: `s9_${i}`, text, trigger: i === 0 ? 'after_previous' : `on_event:step${i}`, waits_for: null }))
  ]);
  const canAct = useCanAnswer(audio);
  // 3 tap: o'nliklarni bo'lish · birliklarni tushirish · birliklarni bo'lish
  const { step, done: built, advance } = useTapSteps(audio, 4);
  const tapDiv = () => { if (!canAct || built) return; sfx.playCorrect(); advance(); };
  const reveal = step === 0 ? 0 : (step === 1 ? 1 : (step === 2 ? 1.5 : 2));
  // yakuniy savol
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
  const btnLabel = step === 0 ? c.btn1 : (step === 1 ? c.btn2 : c.btn3);
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.8vw, 12px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(10px, 2.4vw, 20px)', flexWrap: 'wrap', padding: 'clamp(12px, 2.4vw, 18px)' }}>
          <FrameFx/>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <span className="mono" style={{ fontSize: 'clamp(10px, 1.5vw, 12px)', fontWeight: 800, color: T.ink3, textTransform: 'uppercase', letterSpacing: 0.5 }}>{t(c.left_title)}</span>
            {c.left_lines.map((l, i) => (
              <span key={i} className="mono" style={{ fontSize: 'clamp(14px, 2.6vw, 19px)', fontWeight: 800, color: i === 1 ? '#1F7A4D' : T.ink }}>{l}</span>
            ))}
          </div>
          <span className="mono" style={{ fontSize: 'clamp(16px, 3vw, 22px)', fontWeight: 800, color: T.ink3 }}>=</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <span className="mono" style={{ fontSize: 'clamp(10px, 1.5vw, 12px)', fontWeight: 800, color: T.accent, textTransform: 'uppercase', letterSpacing: 0.5 }}>{t(c.right_title)}</span>
            <DivBoard plan={D13_DIV_PLAN} reveal={reveal}/>
            {!built && (
              <button className="btn-white-accent" disabled={!canAct} onClick={tapDiv}
                style={{ fontSize: 'clamp(12px, 1.9vw, 15px)', marginTop: 2 }}>{t(btnLabel)}</button>
            )}
          </div>
        </div>
        {built && (
          <div className="frame fade-up" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10, padding: 'clamp(12px, 2.4vw, 18px)' }}>
            <FrameFx/>
            <p className="fade-up" style={{ margin: 0, textAlign: 'center', color: T.ink2, fontWeight: 700, fontSize: 'clamp(13px, 1.9vw, 16px)' }}>{t(c.mc_q)}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(110px, 1fr))', gap: 10 }}>
              {orderMC.map((k, i) => (
                <button key={i} className={`option ${solved && i === mcCi ? 'option-correct' : ''} ${wrongSet.has(i) ? 'option-picked-wrong' : ''}`}
                  disabled={!canAct || solved || wrongSet.has(i)} onClick={() => pick(i)}
                  style={{ padding: 'clamp(9px, 1.5vw, 12px)', fontSize: 'clamp(12px, 1.8vw, 15px)', minHeight: 'clamp(42px, 6vw, 52px)', fontWeight: 800 }}>{t(c.mc_opts[k])}</button>
              ))}
            </div>
            {hintMsg && !solved && <p className="lm-hint-bad fade-up">{t(hintMsg)}</p>}
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
              <NumPad value={done ? String(it.ans) : val} setValue={(u) => { setNumState(null); setVal(u); }} disabled={!canAct || numLock || done} max={3} state={numState}/>
              <button className="btn-white-accent" disabled={!canAct || numLock || done || val === ''} onClick={check}>{tri(lang, 'Проверить', 'Tekshiring', 'Check')}</button>
              {hintMsg && <p className="lm-hint-bad fade-up">{t(hintMsg)}</p>}
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

// s11 — MASALA (sCASE)
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
    setNumState(isOk ? 'ok' : 'bad');
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.8vw, 12px)' }}>
        <p className="fade-up" style={{ textAlign: 'center', color: T.ink2, fontWeight: 700, margin: 0 }}>{t(c.lead)}</p>
        <h1 className="title h-sub fade-up delay-1" style={{ margin: 0 }}>{t(c.q)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(8px, 1.6vw, 12px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
          <FrameFx/>
          <div style={{ transform: 'scale(0.6)', transformOrigin: 'center', margin: 'calc(-0.2 * clamp(90px, 20vw, 150px)) 0' }}>
            <StoreBox/>
          </div>
          <NumPad value={val} setValue={(u) => { setNumState(null); setVal(u); }} disabled={!canAct || numLock || solved} max={3} state={numState}/>
          <button className="btn-white-accent" disabled={!canAct || numLock || solved || val === ''} onClick={check}>{tri(lang, 'Проверить', 'Tekshiring', 'Check')}</button>
          {hintMsg && !solved && <p className="lm-hint-bad fade-up">{t(hintMsg)}</p>}
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

// s12 — XATONI TOP
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
                  style={{ padding: 'clamp(10px, 1.6vw, 14px)', minHeight: 'clamp(44px, 6.2vw, 54px)', fontSize: 'clamp(14px, 2.6vw, 20px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, letterSpacing: 1 }}>{stmt}</button>
              ))}
              {wrongSet.size > 0 && !solvedRound && <p className="lm-hint-bad fade-up">{t(it.hint)}</p>}
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

// s13 — FINAL 5 savol + FactCard (freym OSTIDA, orbital anim)
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
                  <button className="btn-white-accent" disabled={!canAct || numLock || val === ''} onClick={checkNum}>{tri(lang, 'Проверить', 'Tekshiring', 'Check')}</button>
                </div>
                {hintMsg && <p className="lm-hint-bad fade-up">{t(it.hint)}</p>}
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
                  <p className="lm-hint-bad fade-up">{t(hintMsg)}</p>
                )}
              </>
            )}
          </div>
        )}
        {done && (
          <div ref={factRef}>
            <div className="frame-success fade-up" style={{ marginBottom: 12 }}>
              <Reaction state="correct" praise={lang === 'ru' ? `Верно: ${score} из ${items.length}` : `To'g'ri: ${items.length} tadan ${score} ta`}/>
            </div>
            <div className="d2-factcard fade-up">
              <span className="d2-factcard-badge mono">{t(c.fact_badge)}</span>
              <div className="d2-fact-hero"><HoneycombFig/></div>
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
          <span className="d2-rulecard-badge mono">{tri(lang, 'Помни', 'Yodda tuting', 'Remember')}</span>
          <p className="d2-rulecard-txt">{t(c.rule_recap)}</p>
        </div>
        {/* yakuniy sahna — ETALON o'lchamida (Dars01 s14): xuk budjeti bu ekranda kerak emas */}
        <div className="d13-final-scene fade-up delay-1"><LessonScene gathered/></div>
      </div>
    </Stage>
  );
};

// ============================================================
// KORNEVOY KOMPONENT (shablon: infrastructure_v1 / grade1 Dars28)
// ============================================================
export default function DivSumLesson({
  studentName, lang: langProp, ttsApiBase, voiceGender,
  correctSoundUrl, wrongSoundUrl, aiGradingEndpoint, onFinished,
}) {
  useMobileZoom();
  const isPreview = (langProp === undefined || langProp === null);
  const [previewLang, setPreviewLang] = useState('ru');
  const lang = langProp || previewLang;
  const safeName = studentName || (lang === 'uz' ? "O'quvchi" : 'Ученик');
  configureLesson({ ttsApiBase: ttsApiBase || '', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', aiGradingEndpoint: aiGradingEndpoint || '', studentName: safeName, voiceGender: voiceGender || 'f', lessonId: (LESSON_META && LESSON_META.lessonId) || '', lessonTitle: (LESSON_META && LESSON_META.lessonTitle) || null });
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
            {['ru', 'uz', 'en'].map(l => (
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
/* Хук с дополнительной панелью: рамка тянется, сцена занимает ровно остаток места.
   Так не нужен магический запас высоты — экран сходится на любом окне. */
.lm-scene-host { flex: 1 1 auto; min-height: 0; display: flex; align-items: center; justify-content: center; }
.lm-scene-host .lm-scene { width: auto; height: 100%; max-width: 100%; max-height: 372px; }
.lm-scene { position: relative; width: min(100%, calc(clamp(120px, calc(100dvh - 720px), 372px) * 400 / 210)); aspect-ratio: 400 / 210; margin-inline: auto; border-radius: 14px; overflow: hidden; }
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
/* metodist 2026-08-05: xuk panelida PLITA animatsiyasi yo'q (bola diqqati savolda) */
.d13-boxrow .d12-spark, .d13-boxrow .lm-glow { animation: none !important; }
/* xuk ekrani (s0): sahna ham ETALON o'lchamida (Dars01 s0 = 629x330) */
.d13-hook-scene .lm-scene { width: min(100%, calc(clamp(180px, calc(100dvh - 570px), 372px) * 400 / 210)); }
/* yakuniy ekran (s14): sahna ETALON o'lchamida — Dars01 dagi 570px budjet */
.d13-final-scene .lm-scene { width: min(100%, calc(clamp(200px, calc(100dvh - 560px), 372px) * 400 / 210)); }
/* === DARS13: TOSH SANDIQ va TARQATISH (ShareOut) === */
.d13-box { display: inline-flex; flex-direction: column; gap: clamp(4px, 1vw, 7px); padding: clamp(8px, 1.8vw, 13px) clamp(9px, 2vw, 14px);
  border-radius: 12px; background: linear-gradient(180deg, #B99164 0%, #97714A 100%); box-shadow: inset 0 0 0 2px #C9A87C, inset 0 6px 14px -8px rgba(90,66,38,0.4); }
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
`;
