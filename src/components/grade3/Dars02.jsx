import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { AnvarSVG, BackLabel, BigNum, BitSVG, Chiroq, Confetti, D2Defs, D2Motes, FREE_NAV, FeedbackBlock, FrameFx, GradientDefs, HeroContext, LUMO_CAST, LangContext, Lenta, NavBack, NavNext, NextLabel, Panel, ProgressContext, Reaction, ReadinessMeter, Stage, StageHero, T, configureLesson, getAudioEngine, npKey, shuffleArr, ttsConfig, useAdvanceGate, useAudio, useCanAnswer, useLang, useMobileZoom, usePrefersReducedMotion, useRevealScroll, useSfx, useT, makeBrgSeg , tri } from './_kit/index.jsx';
import { BASE_STYLES } from './_kit/styles.js';

// ============================================================================
// DD 3-SINF | Dars02 — "Sonlarni o'qish va yozish (1000 gacha)" (num-3-02) | B1 | so'z<->raqam
// Syujet: Bit sayyorasi LUMO, ma'lumot minorasi (SYUJET_3SINF.md B1 d.2). Kod so'z bilan aytiladi,
//   raqam bilan yoziladi. Bit — mezbon-gid. FactCard: qizil mitti yulduz (uzoq yashashi).
// Infra: grade3 Dars01.jsx (etalon nomzodi) dan BAYT-ANIQ ko'chirildi. O'zgarmadi.
// YADRO: son nomi <-> raqamli yozuv; har xona o'z nomi; nol o'rinni yozuvda saqlaydi (305, 35 emas).
// MEXANIKA: recall (s1), son nomlari xaritasi (s2), raqam->so'z (s3), so'z->raqam (s4),
//   nol-o'rin (s5), 1000 ko'prigi (s6), QOIDA (s7), o'qish MC (s8), yozish NumPad (s9),
//   nol-o'rin MC (s10), xatoni top (s11), minora kodi masala (s12), final panel 5 savol (s13), yakun (s14).
// Misconception: M1 nol tushishi (305->35), M2 konkatenatsiya (410->4010), M3 xona tartibi,
//   M4 yuzlikni tushirib qoldirish. LessonScene: ma'lumot minorasi.
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
const TOTAL_SCREENS = 15;
const LESSON_META = {
  lessonId: 'grade3-02',
  lessonTitle: { ru: 'Урок 2. Читаем и записываем числа', uz: "2-dars. Sonlarni o'qish va yozish", en: 'Lesson 2. Reading and writing numbers' }
};
// STRUKTURA: 1–7 tushuntirish · 8–13 mashq · 14 final · 15 xulosa. Grade2 Dars01 etaloni yoyi,
// yuzlik qo'shilgan (uch pog'onali razryad). Syujet: Bit sayyorasi Lumo (SYUJET_3SINF.md Б1 d.1).
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'MCScreen', scored: false, scope: 'hook' },
  { id: 's1',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's4',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's5',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's6',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's7',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's8',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's9',  type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's10', type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's11', type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's12', type: 'case',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's13', type: 'test',        template: 'custom',   scored: true,  scope: 'final' },
  { id: 's14', type: 'summary',     template: 'custom',   scored: false, scope: 'final' }
];





// ============================================================
// CONTENT — 3-sinf Dars02 «Sonlarni o'qish va yozish» (num-3-02). RU + UZ to'liq.
// Audio TTS-toza: sonlar so'z bilan, «» va matematik belgilar yo'q, bir segment = bir fikr.
// Rekvizit: chiroq (birlik) · lenta = 10 chiroq (o'nlik) · panel = 10 lenta (yuzlik). Lumo shahri.
// ============================================================

const CONTENT = {
  // s0 — HOOK (scope: hook): ma'lumot minorasi, kod so'z bilan; «uch yuz besh» -> 305?
  s0: {
    eyebrow: { ru: 'Миссия', uz: 'Missiya', en: 'Mission' },
    topic: { ru: 'Тема: читаем и записываем числа', uz: "Mavzu: sonlarni o'qish va yozish", en: 'Topic: reading and writing numbers' },
    lead: { ru: 'Башня данных: код называют словом.', uz: "Ma'lumot minorasi: kod so'z bilan aytiladi.", en: 'The data tower: a code is said in words.' },
    code_word: { ru: 'триста пять', uz: 'uch yuz besh', en: 'three hundred five' },
    q: { ru: 'Каким числом это записать?', uz: 'Bu qaysi son bilan yoziladi?', en: 'Which number writes this?' },
    opt0: { ru: '35', uz: '35', en: '35' },
    opt1: { ru: '305', uz: '305', en: '305' },
    opt2: { ru: '350', uz: '350', en: '350' },
    audio: {
      intro: {
        ru: [
          'Тема сегодняшнего урока. Читаем и записываем числа. Число можно назвать словом и записать цифрами.',
          'В прошлой области мы собрали большие числа города. Теперь Бит привёл нас в башню данных.',
          'В башне коды города называют словом, а записывают цифрами. Вот первый код. Триста пять.',
          'Как думаешь, каким числом записывается триста пять? Подумай и выбери один вариант.'
        ],
        uz: [
          "Bugungi dars mavzusi. Sonlarni o'qish va yozish. Sonni so'z bilan aytamiz va raqam bilan yozamiz.",
          "O'tgan hududda biz shaharning katta sonlarini yig'dik. Endi Bit bizni ma'lumot minorasiga olib keldi.",
          "Minorada shahar kodlari so'z bilan aytiladi, lekin raqam bilan yoziladi. Mana birinchi kod. Uch yuz besh.",
          "Sizningcha, uch yuz besh qaysi son bilan yoziladi? O'ylab, bittasini tanlang."
        ],
        en: ["Today's topic. We read and write numbers. A number can be said in words and written in digits.", 'In the last district we built the big numbers of the city. Now Bit has brought us to the data tower.', 'In the tower the city codes are said in words and written in digits. Here is the first code. Three hundred five.', 'How do you think three hundred five is written? Think and choose one answer.']
      },
      on_correct: { ru: 'Верная мысль. Триста пять это три сотни, ноль десятков и пять единиц.', uz: "To'g'ri fikr. Uch yuz besh bu uch yuzlik, nol o'nlik va besh birlik.", en: 'Good thinking. Three hundred five is three hundreds, zero tens and five ones.' },
      on_wrong: { ru: 'Будь внимателен. Ноль держит пустое место. Проверим вместе.', uz: "Diqqat qiling. Nol bo'sh o'rinni saqlaydi. Birga tekshiramiz.", en: 'Be careful. Zero holds an empty place. Let us check together.' },
      on_unknown: { ru: 'Ничего. Сейчас разберём вместе.', uz: "Hechqisi yo'q. Hozir birga o'rganamiz.", en: 'Never mind. We will work it out together now.' }
    }
  },

  // s1 — RECALL (ballsiz): o'rin qiymati -> har xonaning o'z nomi bor (345 -> uch yuz qirq besh)
  s1: {
    eyebrow: { ru: 'Вспомним и откроем', uz: 'Eslaymiz va ochamiz', en: 'Recall and discover' },
    lead: { ru: 'У каждого разряда — своё имя.', uz: "Har xonaning o'z nomi bor.", en: 'Every place has its own name.' },
    hundreds_label: { ru: 'сотни', uz: 'yuzliklar', en: 'hundreds' },
    tens_label: { ru: 'десятки', uz: "o'nliklar", en: 'tens' },
    ones_label: { ru: 'единицы', uz: 'birliklar', en: 'ones' },
    name_full: { ru: 'триста сорок пять', uz: 'uch yuz qirq besh', en: 'three hundred forty-five' },
    audio: {
      ru: [
        'Вспомним первый урок. В трёхзначном числе слева сотни, в середине десятки, справа единицы.',
        'А теперь интересное. У каждого разряда есть своё имя.',
        'Сотни три это триста. Десятки четыре это сорок. Единицы пять это пять.',
        'Прочитаем всё вместе. Триста сорок пять. Вот так мы называем число.'
      ],
      uz: [
        "Birinchi darsni eslaymiz. Uch xonali sonda chapda yuzlik, o'rtada o'nlik, o'ngda birlik.",
        "Endi qiziq narsa. Har xonaning o'z nomi bor.",
        "Yuzlik uch bu uch yuz. O'nlik to'rt bu qirq. Birlik besh bu besh.",
        "Hammasini birga o'qiymiz. Uch yuz qirq besh. Mana shunday sonni nomlaymiz."
      ],
      en: ['Let us recall the first lesson. In a three digit number the hundreds are on the left, the tens are in the middle and the ones are on the right.', 'And now the interesting part. Every place has its own name.', 'Three hundreds is three hundred. Four tens is forty. Five ones is five.', 'Let us read it all together. Three hundred forty five. That is how we say the number.']
    }
  },

  // s2 — SON NOMLARI XARITASI: yuzliklar (100-900) + o'nliklar (10-90)
  s2: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    lead: { ru: 'Карта имён чисел.', uz: 'Son nomlari xaritasi.', en: 'The map of number names.' },
    hundreds_head: { ru: 'сотни', uz: 'yuzliklar', en: 'hundreds' },
    tens_head: { ru: 'десятки', uz: "o'nliklar", en: 'tens' },
    hundreds: [
      { num: '100', ru: 'сто', uz: 'yuz', en: 'one hundred' }, { num: '200', ru: 'двести', uz: 'ikki yuz', en: 'two hundred' },
      { num: '300', ru: 'триста', uz: 'uch yuz', en: 'three hundred' }, { num: '400', ru: 'четыреста', uz: "to'rt yuz", en: 'four hundred' },
      { num: '500', ru: 'пятьсот', uz: 'besh yuz', en: 'five hundred' }, { num: '600', ru: 'шестьсот', uz: 'olti yuz', en: 'six hundred' },
      { num: '700', ru: 'семьсот', uz: 'yetti yuz', en: 'seven hundred' }, { num: '800', ru: 'восемьсот', uz: 'sakkiz yuz', en: 'eight hundred' },
      { num: '900', ru: 'девятьсот', uz: "to'qqiz yuz", en: 'nine hundred' }
    ],
    tens: [
      { num: '10', ru: 'десять', uz: "o'n", en: 'ten' }, { num: '20', ru: 'двадцать', uz: 'yigirma', en: 'twenty' },
      { num: '30', ru: 'тридцать', uz: "o'ttiz", en: 'thirty' }, { num: '40', ru: 'сорок', uz: 'qirq', en: 'forty' },
      { num: '50', ru: 'пятьдесят', uz: 'ellik', en: 'fifty' }, { num: '60', ru: 'шестьдесят', uz: 'oltmish', en: 'sixty' },
      { num: '70', ru: 'семьдесят', uz: 'yetmish', en: 'seventy' }, { num: '80', ru: 'восемьдесят', uz: 'sakson', en: 'eighty' },
      { num: '90', ru: 'девяносто', uz: "to'qson", en: 'ninety' }
    ],
    audio: {
      ru: [
        'Выучим имена разрядов. Сначала сотни.',
        'Сто, двести, триста и так по порядку до девятисот.',
        'Теперь десятки. Десять, двадцать, тридцать, сорок и так до девяноста. С этими именами прочитаем любое число.'
      ],
      uz: [
        "Xona nomlarini o'rganamiz. Avval yuzliklar.",
        "Yuz, ikki yuz, uch yuz va shu tartibda to'qqiz yuzgacha.",
        "Endi o'nliklar. O'n, yigirma, o'ttiz, qirq va shu tartibda to'qsongacha. Bu nomlar bilan har qanday sonni o'qiymiz."
      ],
      en: ['Let us learn the names of the places. First the hundreds.', 'One hundred, two hundred, three hundred and so on in order up to nine hundred.', 'Now the tens. Ten, twenty, thirty, forty and so on up to ninety. With these names we can read any number.']
    }
  },

  // s3 — RAQAM -> SO'Z (o'qish mexanikasi): 268
  s3: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    lead: { ru: 'Читаем число слева направо.', uz: "Sonni chapdan o'ngga o'qiymiz.", en: 'We read a number from left to right.' },
    num: { ru: '268', uz: '268', en: '268' },
    hundreds_label: { ru: 'сотни', uz: 'yuzliklar', en: 'hundreds' },
    tens_label: { ru: 'десятки', uz: "o'nliklar", en: 'tens' },
    ones_label: { ru: 'единицы', uz: 'birliklar', en: 'ones' },
    part_h: { ru: 'двести', uz: 'ikki yuz', en: 'two hundred' },
    part_t: { ru: 'шестьдесят', uz: 'oltmish', en: 'sixty' },
    part_o: { ru: 'восемь', uz: 'sakkiz', en: 'eight' },
    done_text: { ru: 'Двести шестьдесят восемь. Каждый разряд назвали своим именем.', uz: "Ikki yuz oltmish sakkiz. Har xonani o'z nomida o'qidik.", en: 'Two hundred sixty-eight. Each place was called by its own name.' },
    audio: {
      ru: [
        'Читаем число слева направо. Вот число, двести шестьдесят восемь.',
        'Левая цифра два это две сотни, двести.',
        'Средняя цифра шесть это шесть десятков, шестьдесят.',
        'Правая цифра восемь это восемь единиц. Вместе, двести шестьдесят восемь.'
      ],
      uz: [
        "Sonni chapdan o'ngga o'qiymiz. Mana son, ikki yuz oltmish sakkiz.",
        "Chap raqam ikki bu ikki yuzlik, ikki yuz.",
        "O'rtadagi raqam olti bu olti o'nlik, oltmish.",
        "O'ng raqam sakkiz bu sakkiz birlik. Birga, ikki yuz oltmish sakkiz."
      ],
      en: ['We read a number from left to right. Here is the number, two hundred sixty eight.', 'The left digit two is two hundreds, two hundred.', 'The middle digit six is six tens, sixty.', 'The right digit eight is eight ones. Together, two hundred sixty eight.']
    }
  },

  // s4 — SO'Z -> RAQAM (yozish mexanikasi): «ikki yuz oltmish sakkiz» -> 268
  s4: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    lead: { ru: 'Теперь наоборот: имя в цифры.', uz: 'Endi teskari: nomni raqamga.', en: 'Now the other way round: a name into digits.' },
    word_name: { ru: 'двести шестьдесят восемь', uz: 'ikki yuz oltmish sakkiz', en: 'two hundred sixty-eight' },
    hundreds_label: { ru: 'сотни', uz: 'yuzliklar', en: 'hundreds' },
    tens_label: { ru: 'десятки', uz: "o'nliklar", en: 'tens' },
    ones_label: { ru: 'единицы', uz: 'birliklar', en: 'ones' },
    done_text: { ru: 'Каждая часть — в свой разряд. Получилось 268.', uz: "Har qism o'z xonasiga. 268 chiqdi.", en: 'Each part goes to its own place. We got 268.' },
    audio: {
      ru: [
        'Теперь наоборот. Имя превратим в цифры. Имя, двести шестьдесят восемь.',
        'Двести ставим в разряд сотен, это два. Шестьдесят в разряд десятков, это шесть. Восемь в разряд единиц.',
        'Части не приставляем друг к другу. Каждая стоит в своём разряде. Получилось двести шестьдесят восемь.'
      ],
      uz: [
        "Endi teskari. Nomni raqamga o'giramiz. Nom, ikki yuz oltmish sakkiz.",
        "Ikki yuzni yuzlik xonasiga qo'yamiz, bu ikki. Oltmishni o'nlik xonasiga, bu olti. Sakkizni birlik xonasiga.",
        "Qismlarni yonma-yon ulamaymiz. Har biri o'z xonasida turadi. Chiqdi ikki yuz oltmish sakkiz."
      ],
      en: ['Now the other way round. We turn a name into digits. The name, two hundred sixty eight.', 'Two hundred goes into the hundreds place, that is two. Sixty goes into the tens place, that is six. Eight goes into the ones place.', 'We do not put the parts side by side. Each one stands in its own place. We got two hundred sixty eight.']
    }
  },

  // s5 — NOL O'RIN yozuvda (KASHFIYOT): «uch yuz besh» -> 305; misollar 250, 406, 700
  s5: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    lead: { ru: 'Пустой разряд держит ноль.', uz: "Bo'sh xonani nol saqlaydi.", en: 'An empty place is held by zero.' },
    word_name: { ru: 'триста пять', uz: 'uch yuz besh', en: 'three hundred five' },
    empty_label: { ru: 'десятки пусты', uz: "o'nlik bo'sh", en: 'tens are empty' },
    result: { ru: '305', uz: '305', en: '305' },
    examples: [
      { word: { ru: 'двести пятьдесят', uz: 'ikki yuz ellik', en: 'two hundred fifty' }, num: '250', empty: { ru: 'единицы пусты', uz: "birlik bo'sh", en: 'ones are empty' } },
      { word: { ru: 'четыреста шесть', uz: "to'rt yuz olti", en: 'four hundred six' }, num: '406', empty: { ru: 'десятки пусты', uz: "o'nlik bo'sh", en: 'tens are empty' } },
      { word: { ru: 'семьсот', uz: 'yetti yuz', en: 'seven hundred' }, num: '700', empty: { ru: 'десятки и единицы пусты', uz: "o'nlik va birlik bo'sh", en: 'tens and ones are empty' } }
    ],
    done_text: { ru: 'Ноль нельзя выбрасывать — иначе получится другое число.', uz: "Nolni tashlab bo'lmaydi, aks holda boshqa son chiqadi.", en: 'Zero cannot be thrown away — otherwise you get a different number.' },
    audio: {
      ru: [
        'Иногда один разряд пустой. Вот число, триста пять.',
        'Сотни три есть, единицы пять есть. А десятки не назвали, значит десятки пустые.',
        'Пустое место держит ноль. Записываем триста пять как три, ноль, пять.',
        'Ноль выбрасывать нельзя. Иначе вместо триста пять получится другое число.'
      ],
      uz: [
        "Ba'zan bir xona bo'sh bo'ladi. Mana son, uch yuz besh.",
        "Yuzlik uch bor, birlik besh bor. O'nlik esa aytilmadi, demak o'nlik bo'sh.",
        "Bo'sh o'rinni nol saqlaydi. Uch yuz beshni uch, nol, besh deb yozamiz.",
        "Nolni tashlab bo'lmaydi. Aks holda uch yuz besh o'rniga boshqa son chiqadi."
      ],
      en: ['Sometimes one place is empty. Here is the number, three hundred five.', 'There are three hundreds and there are five ones. But the tens were not named, so the tens are empty.', 'An empty place is held by zero. We write three hundred five as three, zero, five.', 'Zero cannot be thrown away. Otherwise instead of three hundred five you get a different number.']
    }
  },

  // s6 — KO'PRIK: 999 dan keyin MING (1000). Mavzu chegarasi + keyingi darsga ko'prik
  s6: {
    eyebrow: { ru: 'Открытие', uz: 'Kashfiyot', en: 'Discovery' },
    lead: { ru: 'А после девятисот девяноста девяти?', uz: "To'qqiz yuz to'qson to'qqizdan keyin-chi?", en: 'And what comes after nine hundred ninety-nine?' },
    near_word: { ru: 'девятьсот девяносто девять', uz: "to'qqiz yuz to'qson to'qqiz", en: 'nine hundred ninety-nine' },
    ming_eq: { ru: '999 + 1 = 1000', uz: '999 + 1 = 1000', en: '999 + 1 = 1000' },
    ming_word: { ru: 'ТЫСЯЧА', uz: 'MING', en: 'ONE THOUSAND' },
    done_text: { ru: 'Тысяча — самое большое число нашего урока. Это уже четыре цифры.', uz: "Ming darsimizning eng katta soni. Bu allaqachon to'rt raqam.", en: 'A thousand is the biggest number of our lesson. It already has four digits.' },
    audio: {
      ru: [
        'Мы читали и записывали числа. Самое большое трёхзначное число это девятьсот девяносто девять.',
        'Прибавим к нему один, и родится новое число, тысяча.',
        'Тысяча это четырёхзначное число, граница нашего урока. Читать и записывать такие числа научимся в следующих областях.'
      ],
      uz: [
        "Sonlarni o'qidik va yozdik. Eng katta uch xonali son bu to'qqiz yuz to'qson to'qqiz.",
        "Unga yana bitta qo'shsak, yangi son tug'iladi, ming.",
        "Ming to'rt xonali son, darsimizning chegarasi. Bunday sonlarni o'qish va yozishni keyingi hududlarda o'rganamiz."
      ],
      en: ['We were reading and writing numbers. The biggest three digit number is nine hundred ninety nine.', 'Let us add one to it, and a new number is born, one thousand.', 'A thousand is a four digit number, the border of our lesson. We will learn to read and write such numbers in the next districts.']
    }
  },

  // s7 — QOIDA
  s7: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    rule: { ru: 'Число читаем слева направо. Каждый разряд — своим именем. Пустой разряд держит ноль.', uz: "Sonni chapdan o'ngga o'qiymiz. Har xonani o'z nomida. Bo'sh xonani nol saqlaydi.", en: 'We read a number from left to right. Each place by its own name. An empty place is held by zero.' },
    num: { ru: '305', uz: '305', en: '305' },
    hundreds_label: { ru: 'сотни', uz: 'yuzliklar', en: 'hundreds' },
    tens_label: { ru: 'десятки', uz: "o'nliklar", en: 'tens' },
    ones_label: { ru: 'единицы', uz: 'birliklar', en: 'ones' },
    check_q: { ru: 'В числе триста пять — нажми пустой разряд.', uz: "Uch yuz beshda bo'sh xonani bosing.", en: 'In the number three hundred five — tap the empty place.' },
    check_ok: { ru: 'Верно! Десятки пусты — там ноль.', uz: "To'g'ri! O'nlik bo'sh, u yerda nol.", en: 'Correct! The tens are empty — there is a zero there.' },
    check_no: { ru: 'Пустой разряд — десятки, в середине. Нажми среднюю цифру.', uz: "Bo'sh xona o'nlik, o'rtada. O'rtadagi raqamni bosing.", en: 'The empty place is the tens, in the middle. Tap the middle digit.' },
    audio: {
      ru: [
        'Отлично, теперь вы всё поняли. Запомним это как правило, оно нам всегда пригодится.',
        'Число читаем слева направо. Каждый разряд называем своим именем, сотни, десятки, единицы.',
        'Цифры рядом не складываются. Три, ноль и пять рядом дают триста пять, а не восемь.',
        'Если разряд не назвали, значит он пустой. Пустое место держит ноль, и ноль из записи не выбрасываем.',
        'А теперь сам. В числе триста пять нажми тот разряд, который пустой.'
      ],
      uz: [
        "Zo'r, endi hammasini tushundingiz. Buni qoida qilib eslab qolamiz, u bizga doim kerak bo'ladi.",
        "Sonni chapdan o'ngga o'qiymiz. Har xonani o'z nomida aytamiz, yuzlik, o'nlik, birlik.",
        "Yonma-yon raqamlar qo'shilmaydi. Uch, nol va besh yonma-yon uch yuz besh beradi, sakkiz emas.",
        "Agar xona aytilmasa, demak u bo'sh. Bo'sh o'rinni nol saqlaydi, va nolni yozuvdan tashlamaymiz.",
        "Endi o'zingiz. Uch yuz beshda qaysi xona bo'sh, o'shani bosing."
      ],
      en: ['Excellent, now you have understood it all. Let us remember this as a rule, it will always be useful.', 'We read a number from left to right. We call each place by its own name, hundreds, tens, ones.', 'Digits side by side are not added. Three, zero and five side by side give three hundred five, not eight.', 'If a place was not named, it is empty. An empty place is held by zero, and we do not throw the zero out of the written number.', 'And now on your own. In the number three hundred five tap the place that is empty.']
    }
  },

  // s8 — MASHQ o'qish (RAQAM -> SO'Z), 3 raund. ci = to'g'ri variant indeksi
  s8: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    q: { ru: 'Как читается это число?', uz: "Bu son qanday o'qiladi?", en: 'How is this number read?' },
    items: [
      {
        num: 268, ci: 0,
        opts: [
          { ru: 'двести шестьдесят восемь', uz: 'ikki yuz oltmish sakkiz', en: 'two hundred sixty-eight' },
          { ru: 'двести восемь шестьдесят', uz: 'ikki yuz sakkiz oltmish', en: 'two hundred eight sixty' },
          { ru: 'шестьдесят восемь', uz: 'oltmish sakkiz', en: 'sixty-eight' },
          { ru: 'шестьсот шестьдесят восемь', uz: 'olti yuz oltmish sakkiz', en: 'six hundred sixty-eight' }
        ],
        hints: {
          1: { ru: 'Читаем по порядку: сначала десятки, потом единицы. Шестьдесят восемь, не восемь шестьдесят.', uz: "Tartib bilan o'qiymiz: avval o'nlik, keyin birlik. Oltmish sakkiz, sakkiz oltmish emas.", en: 'Read in order: first the tens, then the ones. Sixty-eight, not eight sixty.' },
          2: { ru: 'Пропустил сотни. Левая цифра два это двести.', uz: "Yuzlikni tashlab ketdingiz. Chap raqam ikki bu ikki yuz.", en: 'You skipped the hundreds. The left digit two is two hundred.' },
          3: { ru: 'Левая цифра два, а не шесть. Значит двести, не шестьсот.', uz: "Chap raqam ikki, olti emas. Demak ikki yuz, olti yuz emas.", en: 'The left digit is two, not six. So it is two hundred, not six hundred.' }
        }
      },
      {
        num: 350, ci: 0,
        opts: [
          { ru: 'триста пятьдесят', uz: 'uch yuz ellik', en: 'three hundred fifty' },
          { ru: 'триста пять', uz: 'uch yuz besh', en: 'three hundred five' },
          { ru: 'триста', uz: 'uch yuz', en: 'three hundred' },
          { ru: 'пятьдесят триста', uz: 'ellik uch yuz', en: 'fifty three hundred' }
        ],
        hints: {
          1: { ru: 'Средняя цифра пять это пятьдесят, а не пять. Пять единиц было бы в конце.', uz: "O'rtadagi raqam besh bu ellik, besh emas. Besh birlik oxirida bo'lardi.", en: 'The middle digit five is fifty, not five. Five ones would be at the end.' },
          2: { ru: 'Не потеряй десятки. Пять десятков это пятьдесят.', uz: "O'nlikni yo'qotmang. Besh o'nlik bu ellik.", en: "Don't lose the tens. Five tens is fifty." },
          3: { ru: 'Читаем слева направо: сначала сотни, потом десятки.', uz: "Chapdan o'ngga o'qiymiz: avval yuzlik, keyin o'nlik.", en: 'Read from left to right: first the hundreds, then the tens.' }
        }
      },
      {
        num: 604, ci: 0,
        opts: [
          { ru: 'шестьсот четыре', uz: "olti yuz to'rt", en: 'six hundred four' },
          { ru: 'шестьсот сорок', uz: 'olti yuz qirq', en: 'six hundred forty' },
          { ru: 'шестьсот ноль четыре', uz: "olti yuz nol to'rt", en: 'six hundred zero four' },
          { ru: 'шестьдесят четыре', uz: "oltmish to'rt", en: 'sixty-four' }
        ],
        hints: {
          1: { ru: 'Четыре стоит в единицах, значит четыре, а не сорок.', uz: "To'rt birlikda turadi, demak to'rt, qirq emas.", en: 'The four is in the ones, so it is four, not forty.' },
          2: { ru: 'Ноль не читаем вслух. Он держит пустой разряд молча.', uz: "Nolni ovoz chiqarib o'qimaymiz. U bo'sh xonani jimgina saqlaydi.", en: 'We do not say the zero out loud. It holds the empty place silently.' },
          3: { ru: 'Левая цифра шесть это шестьсот, а не шестьдесят.', uz: "Chap raqam olti bu olti yuz, oltmish emas.", en: 'The left digit six is six hundred, not sixty.' }
        }
      }
    ],
    audio: {
      intro: { ru: 'Теперь читаешь сам. На экране появится число, выбери верное чтение. Три задания.', uz: "Endi o'zingiz o'qiysiz. Ekranda son chiqadi, to'g'ri o'qilishini tanlang. Uchta topshiriq.", en: 'Now you read on your own. A number will appear on the screen, choose the correct reading. Three tasks.' },
      on_correct: { ru: 'Верно.', uz: "To'g'ri.", en: 'Correct.' },
      on_wrong: { ru: 'Читай каждый разряд своим именем. Попробуй ещё.', uz: "Har xonani o'z nomida o'qing. Yana urinib ko'ring.", en: 'Read each place by its own name. Try again.' }
    }
  },

  // s9 — MASHQ yozish (SO'Z -> RAQAM, NumPad, PRODUKSIYA), 3 raund
  s9: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    q: { ru: 'Запиши число цифрами.', uz: 'Sonni raqamlab yozing.', en: 'Write the number in digits.' },
    check_label: { ru: 'Проверить', uz: 'Tekshirish', en: 'Check' },
    items: [
      {
        word: { ru: 'двести шестьдесят восемь', uz: 'ikki yuz oltmish sakkiz', en: 'two hundred sixty-eight' }, ans: 268,
        hint: { ru: 'Каждую часть — в свой разряд: двести это два, шестьдесят это шесть, восемь единиц.', uz: "Har qismni o'z xonasiga: ikki yuz bu ikki, oltmish bu olti, sakkiz birlik.", en: 'Each part goes to its own place: two hundred is two, sixty is six, eight ones.' }
      },
      {
        word: { ru: 'четыреста десять', uz: "to'rt yuz o'n", en: 'four hundred ten' }, ans: 410,
        hint: { ru: 'Четыре сотни, один десяток, единиц нет — в конце ноль. Части не приставляй в ряд.', uz: "To'rt yuzlik, bir o'nlik, birlik yo'q, oxirida nol. Qismlarni yonma-yon ulamang.", en: 'Four hundreds, one ten, no ones — a zero at the end. Do not put the parts in a row.' }
      },
      {
        word: { ru: 'семьсот', uz: 'yetti yuz', en: 'seven hundred' }, ans: 700,
        hint: { ru: 'Семь сотен, а десятки и единицы пустые — оба ноль.', uz: "Yetti yuzlik, o'nlik va birlik bo'sh, ikkalasi nol.", en: 'Seven hundreds, and the tens and ones are empty — both zero.' }
      }
    ],
    audio: {
      intro: { ru: 'Теперь записываешь число. Послушай имя и набери цифры, нажимая кнопки. После нажми проверить.', uz: "Endi son yozasiz. Nomni eshiting va raqamlarni bosib tering. So'ng tekshirishni bosing.", en: 'Now you write the number. Listen to the name and type the digits by tapping the buttons. After that tap check.' },
      on_correct: { ru: 'Отлично. Записано верно.', uz: "Zo'r. To'g'ri yozdingiz.", en: 'Excellent. Written correctly.' },
      on_wrong: { ru: 'Каждая часть в свой разряд. Не названный разряд — ноль. Попробуй ещё.', uz: "Har qism o'z xonasiga. Aytilmagan xona nol. Yana urinib ko'ring.", en: 'Each part in its own place. A place that was not named is a zero. Try again.' }
    }
  },

  // s10 — MASHQ nol-o'rin (SO'Z -> RAQAM, MC), 3 raund
  s10: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    items: [
      {
        word: { ru: 'триста пять', uz: 'uch yuz besh', en: 'three hundred five' }, ans: 305,
        opts: [{ ru: '35', uz: '35', en: '35' }, { ru: '305', uz: '305', en: '305' }, { ru: '350', uz: '350', en: '350' }, { ru: '3005', uz: '3005', en: '3005' }], ci: 1,
        hints: {
          0: { ru: 'Десятки пусты, ноль держит место: 305, а не 35.', uz: "O'nlik bo'sh, nol o'rinni saqlaydi: 305, 35 emas.", en: 'The tens are empty, zero holds the place: 305, not 35.' },
          2: { ru: 'Ноль в середине, в десятках, а не в конце: 305.', uz: "Nol o'rtada, o'nlikda, oxirida emas: 305.", en: 'The zero is in the middle, in the tens, not at the end: 305.' },
          3: { ru: 'Части не приставляй в ряд. Триста это уже три сотни: 305.', uz: "Qismlarni yonma-yon ulamang. Uch yuz allaqachon uch yuzlik: 305.", en: 'Do not put the parts in a row. Three hundred is already three hundreds: 305.' }
        }
      },
      {
        word: { ru: 'семьсот двадцать', uz: 'yetti yuz yigirma', en: 'seven hundred twenty' }, ans: 720,
        opts: [{ ru: '72', uz: '72', en: '72' }, { ru: '720', uz: '720', en: '720' }, { ru: '702', uz: '702', en: '702' }, { ru: '7020', uz: '7020', en: '7020' }], ci: 1,
        hints: {
          0: { ru: 'Это трёхзначное число, сотни есть: 720.', uz: "Bu uch xonali son, yuzlik bor: 720.", en: 'This is a three-digit number, it has hundreds: 720.' },
          2: { ru: 'Единицы пусты, ноль в конце, а не в середине: 720.', uz: "Birlik bo'sh, nol oxirida, o'rtada emas: 720.", en: 'The ones are empty, the zero is at the end, not in the middle: 720.' },
          3: { ru: 'Части не приставляй в ряд. Семьсот это семь сотен: 720.', uz: "Qismlarni ulamang. Yetti yuz bu yetti yuzlik: 720.", en: 'Do not put the parts in a row. Seven hundred is seven hundreds: 720.' }
        }
      },
      {
        word: { ru: 'пятьсот шесть', uz: 'besh yuz olti', en: 'five hundred six' }, ans: 506,
        opts: [{ ru: '56', uz: '56', en: '56' }, { ru: '506', uz: '506', en: '506' }, { ru: '560', uz: '560', en: '560' }, { ru: '5006', uz: '5006', en: '5006' }], ci: 1,
        hints: {
          0: { ru: 'Десятки пусты, ноль держит место: 506, а не 56.', uz: "O'nlik bo'sh, nol o'rinni saqlaydi: 506, 56 emas.", en: 'The tens are empty, zero holds the place: 506, not 56.' },
          2: { ru: 'Ноль в середине, в десятках, а не в конце: 506.', uz: "Nol o'rtada, o'nlikda, oxirida emas: 506.", en: 'The zero is in the middle, in the tens, not at the end: 506.' },
          3: { ru: 'Части не приставляй в ряд: 506.', uz: "Qismlarni yonma-yon ulamang: 506.", en: 'Do not put the parts in a row: 506.' }
        }
      }
    ],
    audio: {
      intro: { ru: 'В некоторых числах есть пустой разряд. Ноль держит его место. Три задания подряд.', uz: "Ba'zi sonlarda bo'sh xona bor. Nol uning o'rnini saqlaydi. Uchta topshiriq ketma-ket.", en: 'Some numbers have an empty place. Zero holds it. Three tasks in a row.' },
      on_correct: { ru: 'Верно.', uz: "To'g'ri.", en: 'Correct.' },
      on_wrong: { ru: 'Ноль держит пустое место. Попробуй ещё.', uz: "Nol bo'sh o'rinni saqlaydi. Yana urinib ko'ring.", en: 'Zero holds an empty place. Try again.' }
    }
  },

  // s11 — MASHQ xatoni top: 3 juftdan noto'g'risini top, 3 raund. wrong = xato juft indeksi
  s11: {
    eyebrow: { ru: 'Практика', uz: 'Mashq', en: 'Practice' },
    q: { ru: 'Найди неверную пару.', uz: "Noto'g'ri juftni toping.", en: 'Find the wrong pair.' },
    items: [
      {
        pairs: [
          { word: { ru: 'двести десять', uz: "ikki yuz o'n", en: 'two hundred ten' }, num: 210 },
          { word: { ru: 'четыреста пять', uz: "to'rt yuz besh", en: 'four hundred five' }, num: 45 },
          { word: { ru: 'семьсот', uz: 'yetti yuz', en: 'seven hundred' }, num: 700 }
        ],
        wrong: 1,
        hint: { ru: 'В числе 45 нет сотен. Четыреста пять это четыре сотни, ноль десятков, пять единиц: 405.', uz: "45 da yuzlik yo'q. To'rt yuz besh bu to'rt yuzlik, nol o'nlik, besh birlik: 405.", en: 'The number 45 has no hundreds. Four hundred five is four hundreds, zero tens, five ones: 405.' }
      },
      {
        pairs: [
          { word: { ru: 'триста шестьдесят', uz: "uch yuz oltmish", en: 'three hundred sixty' }, num: 360 },
          { word: { ru: 'пятьсот', uz: 'besh yuz', en: 'five hundred' }, num: 500 },
          { word: { ru: 'шестьсот четыре', uz: "olti yuz to'rt", en: 'six hundred four' }, num: 640 }
        ],
        wrong: 2,
        hint: { ru: 'Шестьсот четыре: четыре в единицах, десятки пусты — 604, а не 640.', uz: "Olti yuz to'rt: to'rt birlikda, o'nlik bo'sh, 604, 640 emas.", en: 'Six hundred four: the four is in the ones, the tens are empty — 604, not 640.' }
      },
      {
        pairs: [
          { word: { ru: 'девятьсот', uz: "to'qqiz yuz", en: 'nine hundred' }, num: 900 },
          { word: { ru: 'двести пятьдесят', uz: 'ikki yuz ellik', en: 'two hundred fifty' }, num: 250 },
          { word: { ru: 'триста пять', uz: 'uch yuz besh', en: 'three hundred five' }, num: 350 }
        ],
        wrong: 2,
        hint: { ru: 'Триста пять: десятки пусты, пять единиц — 305, а не 350.', uz: "Uch yuz besh: o'nlik bo'sh, besh birlik, 305, 350 emas.", en: 'Three hundred five: the tens are empty, five ones — 305, not 350.' }
      }
    ],
    audio: {
      intro: { ru: 'Даю три пары — имя и число. Одна неверная. Найди неверную пару.', uz: "Uchta juft beraman, nom va raqam. Bittasi noto'g'ri. Xato juftni toping.", en: 'I give you three pairs, a name and a number. One is wrong. Find the wrong pair.' },
      on_correct: { ru: 'Верно.', uz: "To'g'ri.", en: 'Correct.' },
      on_wrong: { ru: 'Проверь каждую пару разряд за разрядом. Посмотри ещё.', uz: "Har juftni xonama-xona tekshiring. Yana qarang.", en: 'Check each pair place by place. Look again.' }
    }
  },

  // s12 — MASALA (case): ma'lumot minorasi manzil kodi. Anvar kodni so'z bilan aytadi; NumPad bilan teriladi
  s12: {
    eyebrow: { ru: 'Задача', uz: 'Masala', en: 'Word problem' },
    lead: { ru: 'Анвар принёс код адреса из башни данных.', uz: "Anvar ma'lumot minorasidan manzil kodini keltirdi.", en: 'Anvar brought an address code from the data tower.' },
    manifest_label: { ru: 'код', uz: 'kod', en: 'code' },
    code_word: { ru: 'шестьсот девяносто', uz: "olti yuz to'qson", en: 'six hundred ninety' },
    q: { ru: 'Набери код цифрами.', uz: 'Kodni raqamlab tering.', en: 'Type the code in digits.' },
    ans: 690,
    setup_audio: { ru: 'Анвар принёс код адреса из башни данных. Код назвали словом, шестьсот девяносто.', uz: "Anvar ma'lumot minorasidan manzil kodini keltirdi. Kod so'z bilan aytilgan, olti yuz to'qson.", en: 'Anvar brought an address code from the data tower. The code was said in words, six hundred ninety.' },
    audio: {
      intro: { ru: 'Набери этот код цифрами, нажимая кнопки. После нажми проверить.', uz: "Bu kodni raqamlarni bosib tering. So'ng tekshirishni bosing.", en: 'Type this code in digits by tapping the buttons. After that tap check.' },
      on_correct: { ru: 'Верно. Шестьсот девяносто это шесть сотен, девять десятков, единиц нет, в конце ноль.', uz: "To'g'ri. Olti yuz to'qson bu olti yuzlik, to'qqiz o'nlik, birlik yo'q, oxirida nol.", en: 'Correct. Six hundred ninety is six hundreds, nine tens, no ones, a zero at the end.' },
      on_wrong: { ru: 'Посмотри разбор. Не названный разряд — ноль.', uz: "Tushuntirishga qarang. Aytilmagan xona nol.", en: 'Look at the explanation. A place that was not named is a zero.' }
    }
  },

  // s13 — FINAL panel (5 savol aralash: num/mc) + FactCard
  s13: {
    eyebrow: { ru: 'Финал', uz: 'Final', en: 'Final' },
    intro_line: { ru: 'Городской компьютер проверит тебя. Пять заданий.', uz: "Shahar kompyuteri sizni tekshiradi. Beshta topshiriq.", en: 'The city computer will test you. Five tasks.' },
    items: [
      {
        kind: 'num', ans: 305,
        q: { ru: 'Запиши цифрами число триста пять.', uz: "Uch yuz besh sonini raqamlab yozing.", en: 'Write the number three hundred five in digits.' },
        hint: { ru: 'Три сотни, десятков нет — ноль, пять единиц.', uz: "Uch yuzlik, o'nlik yo'q, nol, besh birlik.", en: 'Three hundreds, no tens — a zero, five ones.' }
      },
      {
        kind: 'mc',
        q: { ru: 'Как читается число 268?', uz: "268 soni qanday o'qiladi?", en: 'How is the number 268 read?' },
        opt0: { ru: 'двести шестьдесят восемь', uz: 'ikki yuz oltmish sakkiz', en: 'two hundred sixty-eight' },
        opt1: { ru: 'двести восемь шестьдесят', uz: 'ikki yuz sakkiz oltmish', en: 'two hundred eight sixty' },
        opt2: { ru: 'шестьдесят восемь', uz: 'oltmish sakkiz', en: 'sixty-eight' },
        wrong_1: { ru: 'Сначала десятки, потом единицы: шестьдесят восемь.', uz: "Avval o'nlik, keyin birlik: oltmish sakkiz.", en: 'First the tens, then the ones: sixty-eight.' },
        wrong_2: { ru: 'Пропустил сотни. Левая цифра два это двести.', uz: "Yuzlikni tashlab ketdingiz. Chap raqam ikki bu ikki yuz.", en: 'You skipped the hundreds. The left digit two is two hundred.' }
      },
      {
        kind: 'num', ans: 700,
        q: { ru: 'Запиши цифрами число семьсот.', uz: "Yetti yuz sonini raqamlab yozing.", en: 'Write the number seven hundred in digits.' },
        hint: { ru: 'Семь сотен, десятки и единицы пустые — два нуля.', uz: "Yetti yuzlik, o'nlik va birlik bo'sh, ikkita nol.", en: 'Seven hundreds, the tens and ones are empty — two zeros.' }
      },
      {
        kind: 'mc',
        q: { ru: 'Какая запись верна для «четыреста десять»?', uz: "«to'rt yuz o'n» uchun qaysi yozuv to'g'ri?", en: 'Which writing is correct for "four hundred ten"?' },
        opt0: { ru: '410', uz: '410', en: '410' },
        opt1: { ru: '4010', uz: '4010', en: '4010' },
        opt2: { ru: '41', uz: '41', en: '41' },
        wrong_1: { ru: 'Части не приставляй в ряд. Четыреста это уже четыре сотни: 410.', uz: "Qismlarni yonma-yon ulamang. To'rt yuz allaqachon to'rt yuzlik: 410.", en: 'Do not put the parts in a row. Four hundred is already four hundreds: 410.' },
        wrong_2: { ru: 'Не потеряй ноль в единицах: 410, а не 41.', uz: "Birlikdagi nolni yo'qotmang: 410, 41 emas.", en: 'Do not lose the zero in the ones: 410, not 41.' }
      },
      {
        kind: 'num', ans: 402,
        q: { ru: 'Загадка. У меня сотен 4, единиц 2, а десятков нет. Запиши меня.', uz: "Jumboq. Yuzligim 4, birligim 2, o'nligim yo'q. Meni yozing.", en: 'A riddle. I have 4 hundreds, 2 ones, and no tens. Write me.' },
        hint: { ru: 'Пустой разряд десятков держит ноль: между четвёркой и двойкой.', uz: "Bo'sh o'nlik xonasini nol saqlaydi: to'rt bilan ikki orasida.", en: 'The empty tens place is held by zero: between the four and the two.' }
      }
    ],
    fact_badge: { ru: 'Знаешь?', uz: 'Bilasizmi?', en: 'Did you know?' },
    fact_text: { ru: 'Красные карлики светят так долго, что ни один из них ещё не успел состариться — для них даже возраст Вселенной пока мал.', uz: "Qizil mitti yulduzlar shunchalik uzoq nur sochadiki, biror qizil mitti hali qarib ulgurmagan, hatto Koinot yoshi ular uchun kam.", en: 'Red dwarfs shine so long that not one of them has had time to grow old — even the age of the Universe is still short for them.' },
    fact_audio: { ru: 'Красные карлики светят так долго, что ни один из них ещё не успел состариться. Даже возраст Вселенной для них пока мал.', uz: "Qizil mitti yulduzlar shunchalik uzoq nur sochadiki, biror qizil mitti hali qarib ulgurmagan. Hatto Koinot yoshi ular uchun kam.", en: 'Red dwarfs shine so long that not one of them has had time to grow old. Even the age of the Universe is still short for them.' },
    audio: {
      intro: { ru: 'Финальная проверка. Городской компьютер показывает числа, отвечай на каждое.', uz: "Yakuniy tekshiruv. Shahar kompyuteri sonlar ko'rsatadi, har biriga javob bering.", en: 'The final check. The city computer shows numbers, answer each one.' },
      on_correct: { ru: 'Верно.', uz: "To'g'ri.", en: 'Correct.' },
      on_wrong: { ru: 'Посмотри разбор справа.', uz: "O'ngdagi tushuntirishga qarang.", en: 'Look at the explanation on the right.' }
    }
  },

  // s14 — YAKUN
  s14: {
    eyebrow: { ru: 'Итог', uz: 'Yakun', en: 'Result' },
    praise: { ru: 'Молодец!', uz: 'Barakalla!', en: 'Well done!' },
    mission_done: { ru: 'Башня данных открыта — коды прочитаны!', uz: "Ma'lumot minorasi ochildi — kodlar o'qildi!", en: 'The data tower is open — the codes are read!' },
    cando: { ru: 'Теперь ты читаешь число словом и записываешь его цифрами.', uz: "Endi siz sonni so'z bilan o'qiysiz va raqam bilan yozasiz.", en: 'Now you read a number in words and write it in digits.' },
    rule_recap: { ru: 'Читай каждый разряд своим именем. Не названный разряд — ноль, держи его в записи.', uz: "Har xonani o'z nomida o'qing. Aytilmagan xona nol, uni yozuvda saqlang.", en: 'Read each place by its own name. A place that was not named is a zero, keep it in the written number.' },
    conn_label_refs: { ru: 'Опирается на', uz: 'Tayanadi', en: 'Builds on' },
    conn_refs: { ru: 'первый урок: сотни, десятки и единицы', uz: "birinchi dars: yuzlik, o'nlik va birlik", en: 'lesson one: hundreds, tens and ones' },
    conn_label_next: { ru: 'Дальше', uz: 'Keyingi', en: 'Next' },
    conn_next: { ru: 'Урок 3: разложение числа на разрядные слагаемые', uz: "3-dars: sonni razryad qo'shiluvchilariga yoyish", en: 'Lesson 3: breaking a number into place-value parts' },
    audio: {
      ru: 'Башня данных открыта. Мы научились читать число словом и записывать его цифрами. Запомни правило. Каждый разряд читаем своим именем. А если разряд не назвали, значит он пустой, и там ноль, который нельзя выбрасывать. В следующий раз научимся раскладывать число на разрядные слагаемые.',
      uz: "Ma'lumot minorasi ochildi. Biz sonni so'z bilan o'qishni va raqam bilan yozishni o'rgandik. Qoidani yodda tuting. Har xonani o'z nomida o'qiymiz. Agar xona aytilmasa, demak u bo'sh, u yerda nol turadi va uni tashlab bo'lmaydi. Keyingi safar sonni razryad qo'shiluvchilariga yoyishni o'rganamiz.",
      en: 'The data tower is open. We learned to read a number in words and to write it in digits. Remember the rule. We read each place by its own name. And if a place was not named, it is empty, and there is a zero there which cannot be thrown away. Next time we will learn to break a number into place value parts.'
    }
  }
};

// slaydlararo ko'priklar (audio-intro boshiga; ekranda ko'rinmaydi). TTS-toza.
const BRIDGES = {
  s1:  { ru: 'Вспомним, что уже знаем.', uz: "Bilganimizni eslaymiz.", en: 'Let us recall what we already know.' },
  s2:  { ru: 'Сначала выучим имена.', uz: "Avval nomlarni o'rganamiz.", en: 'First we learn the names.' },
  s3:  { ru: 'Теперь прочитаем число.', uz: "Endi sonni o'qiymiz.", en: 'Now let us read a number.' },
  s4:  { ru: 'А теперь запишем его.', uz: 'Endi uni yozamiz.', en: 'And now let us write it.' },
  s5:  { ru: 'Внимание. Бывает пустой разряд.', uz: "Diqqat. Bo'sh xona bo'ladi.", en: 'Attention. A place can be empty.' },
  s6:  { ru: 'А что после трёхзначных?', uz: "Uch xonalidan keyin nima?", en: 'And what comes after three-digit numbers?' },
  s7:  { ru: 'Запишем это правилом.', uz: 'Buni qoida qilib olamiz.', en: 'Let us write this down as a rule.' },
  s8:  { ru: 'Правило знаем. Теперь читай сам.', uz: "Qoidani bilamiz. Endi o'zingiz o'qing.", en: 'We know the rule. Now read on your own.' },
  s9:  { ru: 'А теперь записывай число.', uz: 'Endi sonni yozing.', en: 'And now write the number.' },
  s10: { ru: 'Один разряд будет пустым.', uz: "Bitta xona bo'sh bo'ladi.", en: 'One place will be empty.' },
  s11: { ru: 'Проверим пары на ошибку.', uz: 'Juftlarni xatoga tekshiramiz.', en: 'Let us check the pairs for a mistake.' },
  s12: { ru: 'Последний код башни.', uz: "Minoraning oxirgi kodi.", en: 'The last code of the tower.' },
  s13: { ru: 'Городской компьютер сделает финальную проверку.', uz: 'Shahar kompyuteri yakuniy tekshiradi.', en: 'The city computer will run the final check.' },
  s14: { ru: 'Башня открыта. Идём дальше!', uz: 'Minora ochildi. Davom etamiz!', en: 'The tower is open. Let us move on!' }
};

// s14 payoff (xulosadan oldin aytiladi)
const S14_PAYOFF = {
  ru: 'Миссия выполнена! Мы прочитали все коды башни данных, и Бит открыл нам новую часть города. Спасибо за помощь!',
  uz: "Missiya bajarildi! Biz ma'lumot minorasining barcha kodlarini o'qidik, va Bit bizga shaharning yangi qismini ochdi. Yordamingiz uchun rahmat!",
  en: 'Mission complete! We read all the codes of the data tower, and Bit opened a new part of the city for us. Thank you for your help!'
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
const RazryadTable = ({ h = 0, t = 0, o = 0, labels, emph = null, concrete = false, digits = false, onCell = null, cellSel = null, cellBad = null }) => {
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
                ? <button className={`lm-mat-digit lm-mat-digit-btn mono ${cellSel === k ? 'lm-mat-digit-ok' : cellBad === k ? 'lm-mat-digit-bad' : ''}`} onClick={() => onCell(k)}>{n}</button>
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
      <AxborotMinorasiBg/>
      <div className="lm-scene-cast">
        {LUMO_CAST.slice(0, 2).map(kid)}
        <span className={`lm-crew lm-crew-host ${gathered ? 'd2-bit-cheer' : 'lm-bob'}`}><span className="g1-cast-fig"><BitSVG state={gathered ? 'happy' : 'present'}/></span></span>
        {LUMO_CAST.slice(2).map((c, i) => kid(c, i + 2))}
      </div>
    </div>
  );
};




// ============================================================
// EKRANLAR — Dars02 «Sonlarni o'qish va yozish» (so'z<->raqam ko'prigi)
// ============================================================



// --- AXBOROT MINORASI ICHI (D02 immersiv interyer): pastel xona, derazadan Bit shahri,
//     markazda so'z<->raqam konsoli, chapda boshqaruv stoli, o'ngda manzil-kod javoni, perspektiv pol.
const AxborotMinorasiBg = () => {
  const lang = useLang();
  return (
  <svg className="lm-scene-bg" viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="a2wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ECDBC4"/><stop offset="100%" stopColor="#DBC3A2"/></linearGradient>
      <linearGradient id="a2sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#33284E"/><stop offset="46%" stopColor="#7C4A66"/><stop offset="82%" stopColor="#CE8A58"/><stop offset="100%" stopColor="#F0C088"/></linearGradient>
      <linearGradient id="a2floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#D9C29D"/><stop offset="100%" stopColor="#BBA078"/></linearGradient>
      <radialGradient id="a2sun" cx="50%" cy="50%" r="55%"><stop offset="0%" stopColor="#FFE6B0"/><stop offset="55%" stopColor="#F0985A"/><stop offset="100%" stopColor="#C0502E" stopOpacity="0"/></radialGradient>
      <linearGradient id="a2panel" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#20344C"/><stop offset="100%" stopColor="#0E1B2C"/></linearGradient>
      <radialGradient id="a2lamp" cx="50%" cy="20%" r="80%"><stop offset="0%" stopColor="#FFF0C4"/><stop offset="100%" stopColor="#FFE39A" stopOpacity="0"/></radialGradient>
    </defs>
    {/* --- WALL + shift (interyer) --- */}
    <rect x="0" y="0" width="400" height="180" fill="url(#a2wall)"/>
    <rect x="0" y="0" width="400" height="22" fill="#D2B892"/>
    <rect x="0" y="21" width="400" height="3" fill="#B4976F"/>
    {/* devor-panel choklari (chuqurlik uchun yengil) */}
    <g stroke="#C7AC82" strokeWidth="1" opacity="0.5"><path d="M60 24 V96"/><path d="M340 24 V96"/></g>
    {/* --- SHIFT chiroqlari + yumshoq nur konusi --- */}
    {[90, 200, 310].map((cx, i) => (
      <g key={i}>
        <rect x={cx - 18} y="4" width="36" height="6" rx="3" fill="#FFEBB0"/>
        <rect x={cx - 18} y="4" width="36" height="2" rx="1" fill="#FFF6DA"/>
        <polygon points={`${cx - 20},11 ${cx + 20},11 ${cx + 46},96 ${cx - 46},96`} fill="url(#a2lamp)" opacity="0.35"/>
        <ellipse className="lm-glow" style={{ animationDelay: `${i * 0.7}s` }} cx={cx} cy="12" rx="14" ry="4" fill="#FFF0C4" opacity="0.5"/>
      </g>
    ))}
    {/* --- DERAZA: Bit shahri tashqarida (fon, chuqurlik) --- */}
    <rect x="42" y="28" width="316" height="70" rx="7" fill="#0D1928"/>
    <rect x="46" y="32" width="308" height="62" rx="4" fill="url(#a2sky)"/>
    {/* deraza ichi: sayyora + quyosh + uzoq shahar silueti + uchar pod */}
    <g clipPath="url(#a2winclip)">
      <circle cx="78" cy="46" r="8" fill="#C79AD6"/><ellipse cx="78" cy="46" rx="14" ry="3.4" fill="none" stroke="#E6C8F0" strokeWidth="1.5" opacity="0.8"/>
      <circle cx="324" cy="46" r="13" fill="url(#a2sun)"/><circle cx="324" cy="46" r="6" fill="#FFD89A"/>
    </g>
    <clipPath id="a2winclip"><rect x="46" y="32" width="308" height="62" rx="4"/></clipPath>
    {/* uzoq shahar silueti (deraza tubida, xira => uzoqlik) */}
    <g opacity="0.62">
      <rect x="70" y="72" width="16" height="22" rx="2" fill="#B98BA8"/><rect x="90" y="78" width="11" height="16" rx="2" fill="#A87E9C"/>
      <rect x="112" y="66" width="14" height="28" rx="2" fill="#C29AB4"/><rect x="150" y="74" width="12" height="20" rx="2" fill="#AD82A0"/>
      <rect x="176" y="70" width="15" height="24" rx="2" fill="#BE93B0"/><rect x="232" y="76" width="12" height="18" rx="2" fill="#A87E9C"/>
      <rect x="256" y="68" width="14" height="26" rx="2" fill="#C29AB4"/><rect x="284" y="74" width="11" height="20" rx="2" fill="#AD82A0"/>
      <g fill="#FFE39A" opacity="0.85"><circle cx="77" cy="80" r="1.2"/><circle cx="118" cy="76" r="1.2"/><circle cx="183" cy="80" r="1.2"/><circle cx="262" cy="78" r="1.2"/></g>
    </g>
    <g className="lm-float"><ellipse cx="204" cy="52" rx="11" ry="4" fill="#5A6B88"/><ellipse cx="204" cy="49.6" rx="8" ry="2.6" fill="#8FA6C0"/><circle className="lm-glow" cx="198" cy="53" r="1.3" fill="#FFD0C2"/></g>
    {/* deraza romi + mulonlar */}
    <g fill="none" stroke="#C9B79A" strokeWidth="3"><rect x="42" y="28" width="316" height="70" rx="7"/></g>
    <g stroke="#C9B79A" strokeWidth="2.4" opacity="0.9"><path d="M148 32 V94"/><path d="M256 32 V94"/><path d="M46 63 H354"/></g>
    <rect x="42" y="95" width="316" height="5" rx="2" fill="#B4976F"/>
    {/* --- MARKAZIY KONSOL: so'z <-> raqam ko'prigi (mavzu shu yerda) --- */}
    <rect x="104" y="104" width="192" height="44" rx="7" fill="url(#a2panel)" stroke="#3E6E90" strokeWidth="1.6"/>
    <rect x="110" y="108" width="180" height="11" rx="3" fill="#122236"/>
    <text x="200" y="116.5" textAnchor="middle" fontSize="7" letterSpacing="1.5" fill="#7FB8D8" fontFamily="'JetBrains Mono', monospace">{tri(lang, 'КОД АДРЕСА', 'MANZIL KODI', 'ADDRESS CODE')}</text>
    <text x="157" y="139" textAnchor="middle" fontSize="10.5" fill="#9FE0FF" fontFamily="'JetBrains Mono', monospace">{tri(lang, 'триста пять', 'uch yuz besh', 'three hundred five')}</text>
    {/* ikki tomonlama strelka */}
    <g stroke="#FFD86E" strokeWidth="2.2" strokeLinecap="round"><path d="M206 135 H230"/></g>
    <path d="M206 135 l6 -4 v8 Z" fill="#FFD86E"/><path d="M230 135 l-6 -4 v8 Z" fill="#FFD86E"/>
    <text x="264" y="142" textAnchor="middle" fontSize="20" fontWeight="800" fill="#FFD86E" fontFamily="'JetBrains Mono', monospace">305</text>
    {/* konsol tagligi (poydevor) */}
    <path d="M154 148 h92 l12 28 h-116 Z" fill="#C3A87E"/><rect x="150" y="174" width="100" height="4" fill="#A98C64"/>
    {/* --- CHAP: boshqaruv stoli (old plan) --- */}
    <rect x="8" y="126" width="72" height="30" rx="4" fill="url(#a2panel)" stroke="#3E6E90" strokeWidth="1.2"/>
    <polyline points="14,150 24,140 34,146 44,134 52,142 62,132 72,138" fill="none" stroke="#6FD0E4" strokeWidth="1.6"/>
    <text x="44" y="139" textAnchor="middle" fontSize="8" fontWeight="800" fill="#8FE6C0" fontFamily="'JetBrains Mono', monospace">700</text>
    <rect x="2" y="156" width="92" height="20" rx="3" fill="#C3A87E"/><rect x="2" y="156" width="92" height="4" rx="2" fill="#D8BE94"/>
    <g fill="#3E6E90"><circle cx="16" cy="167" r="2.4"/><circle cx="28" cy="167" r="2.4"/></g>
    <g fill="#6FD0E4" opacity="0.85"><circle cx="16" cy="167" r="1.1"/></g>
    <rect x="40" y="162" width="46" height="9" rx="2" fill="#152342"/><text x="63" y="169" textAnchor="middle" fontSize="7" fill="#9FE0FF" fontFamily="'JetBrains Mono', monospace">1000</text>
    {/* --- O'NG: manzil-kod javoni (raqamlarni o'qish-yozish mavzusi) --- */}
    <rect x="308" y="104" width="86" height="66" rx="5" fill="#C9B79A"/><rect x="308" y="104" width="86" height="66" rx="5" fill="none" stroke="#A88C64" strokeWidth="1.5"/>
    <g stroke="#A88C64" strokeWidth="1"><path d="M308 126 H394"/><path d="M308 148 H394"/><path d="M336 104 V170"/><path d="M366 104 V170"/></g>
    {[['312','40'],['366','12'],['312','88'],['312','512'],['366','93']].map(([x, n], i) => (
      <text key={i} x={Number(x) + 12} y={[120, 120, 142, 164, 164][i]} textAnchor="middle" fontSize="8" fill="#6B5636" fontFamily="'JetBrains Mono', monospace">{n}</text>
    ))}
    {/* bitta yorqin (faol) manzil */}
    <rect x="338" y="128" width="26" height="18" rx="2" fill="#152342"/><text x="351" y="140" textAnchor="middle" fontSize="9" fontWeight="800" fill="#8FE6C0" fontFamily="'JetBrains Mono', monospace">210</text>
    {/* --- POL + perspektiva --- */}
    <rect x="0" y="176" width="400" height="54" fill="url(#a2floor)"/>
    <line x1="0" y1="176" x2="400" y2="176" stroke="#9A8058" strokeWidth="2"/>
    <g stroke="#A98C64" strokeWidth="1" opacity="0.45"><path d="M20 230 L176 178"/><path d="M120 230 L192 178"/><path d="M280 230 L208 178"/><path d="M380 230 L224 178"/></g>
    <g stroke="#A98C64" strokeWidth="0.8" opacity="0.3"><path d="M0 196 H400"/><path d="M0 212 H400"/></g>
    {/* --- OLD PLAN ramka proplari (chuqurlik) --- */}
    <g transform="translate(18 176)"><path d="M0 0 Q-3 -16 0 -24" stroke="#7CB69E" strokeWidth="2.6" fill="none"/><circle className="lm-glow" cx="0" cy="-27" r="5" fill="#A6E0C6"/><path d="M-1 -14 q-8 -3 -11 -10 q9 1 12 8Z" fill="#8FD8B8"/><path d="M1 -10 q7 -3 10 -9 q-8 1 -11 7Z" fill="#7CB69E" opacity="0.85"/></g>
    <g transform="translate(392 176)"><path d="M0 0 Q-2 -10 0 -15" stroke="#7CB69E" strokeWidth="2.2" fill="none"/><circle className="lm-glow" cx="0" cy="-17" r="3.6" fill="#A6E0C6"/></g>
    {/* havoda porlovchi sporalar (iliqlik) */}
    <g><circle className="lm-glow" cx="120" cy="60" r="1.5" fill="#FFE0B0"/><circle className="lm-glow" style={{ animationDelay: '0.8s' }} cx="300" cy="70" r="1.5" fill="#CFE8FF"/><circle className="lm-glow" style={{ animationDelay: '1.4s' }} cx="250" cy="40" r="1.3" fill="#FFD0C2"/></g>
  </svg>
  );
};

const LessonScene = ({ gathered = false }) => {
  const kid = ({ key, El, hook }, i) => (
    <span key={key} className="lm-crew lm-crew-kid g1-pop-in" style={{ animationDelay: `${0.25 + i * 0.12}s` }}>
      <El {...(gathered ? { mood: 'happy', pose: 'happy' } : hook)}/>
    </span>
  );
  return (
    <div className="lm-scene">
      <AxborotMinorasiBg/>
      <div className="lm-scene-cast">
        {LUMO_CAST.slice(0, 2).map(kid)}
        <span className={`lm-crew lm-crew-host ${gathered ? 'd2-bit-cheer' : 'lm-bob'}`}><span className="g1-cast-fig"><BitSVG state={gathered ? 'happy' : 'present'}/></span></span>
        {LUMO_CAST.slice(2).map((c, i) => kid(c, i + 2))}
      </div>
    </div>
  );
};

// --- MINI-SHAHARCHA (final savol vizuali): ixcham Lumo ko'chasi.
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

// --- KO'P-RAUNDLI MC (3 savol ketma-ket, веди-до-verного). heading/renderFig — render-props.
// So'z<->raqam mashqlari uchun (s8 o'qish, s10 nol-o'rin). Etalon MCRoundScreen naqshi.
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
            <div className="mono fade-up" style={{ textAlign: 'center', color: T.accent, fontWeight: 800 }}>{lang === 'ru' ? `Задание ${Math.min(idx + 1, items.length)} из ${items.length}` : `${Math.min(idx + 1, items.length)}-topshiriq, jami ${items.length}`}</div>
            <h1 className="title h-sub fade-up">{heading(it)}</h1>
            <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(10px, 2vw, 14px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
              <FrameFx/>
              {renderFig(it)}
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(90px, 1fr))`, gap: 10, width: '100%' }}>
                {it.opts.map((o, i) => (
                  <button key={i} className={`option ${okPick === i ? 'option-correct' : ''} ${wrongSet.has(i) ? 'option-picked-wrong' : ''}`} disabled={!canAct || okPick !== null || wrongSet.has(i)} onClick={() => pick(i)}
                    style={{ padding: 'clamp(10px, 1.6vw, 13px)', fontSize: 'clamp(13px, 1.7vw, 15px)', minHeight: 'clamp(46px, 6.5vw, 56px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>{t(o)}</button>
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

// s0 — HOOK: ma'lumot minorasi kodi (picked to'liq reset qaytishda)
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
        <div className="frame fade-up delay-1 lm-scene-host" style={{ padding: 'clamp(8px, 1.8vw, 14px)', overflow: 'hidden'  }}>
          <LessonScene gathered={ok}/>
        </div>
        <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <span className="mono" style={{ fontSize: 'clamp(10px, 1.5vw, 12px)', color: T.ink2, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{tri(lang, 'код', 'kod', 'code')}</span>
          <span className="title" style={{ fontSize: 'clamp(22px, 5vw, 34px)', fontWeight: 700, color: T.ink }}>{t(c.code_word)}</span>
        </div>
        <p className="fade-up delay-1" style={{ textAlign: 'center', color: T.ink2, fontWeight: 600, fontSize: 'clamp(15px, 2vw, 18px)', margin: 0 }}>{t(c.q)}</p>
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

// s1 — RECALL: har xonaning o'z nomi bor (345 -> uch yuz qirq besh)
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'clamp(12px, 2.4vw, 18px)', padding: 'clamp(14px, 2.6vw, 22px)', minHeight: 'clamp(170px, 36vw, 230px)' }}>
          <RazryadTable h={3} t={4} o={5} labels={labels} digits/>
          {reached >= 3 && <span className="mono lm-eq lm-reveal" style={{ fontSize: 'clamp(18px, 3.4vw, 26px)', fontWeight: 800, color: T.success }}>{t(c.name_full)}</span>}
        </div>
      </div>
    </Stage>
  );
};

// s2 — SON NOMLARI XARITASI
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
  const showT = reached >= 2;
  const done = reached >= (c.audio[lang].length - 1);
  const canAdv = useAdvanceGate(done, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  const Row = ({ head, data }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
      <span className="mono" style={{ color: T.accent, fontWeight: 800, fontSize: 'clamp(11px, 1.5vw, 13px)' }}>{head}</span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(5px, 1.4vw, 9px)', justifyContent: 'center' }}>
        {data.map((d, i) => (
          <span key={i} className="g1-pop-in" style={{ animationDelay: `${i * 0.05}s`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, minWidth: 'clamp(46px, 12vw, 62px)', padding: '6px 4px', background: T.paper, borderRadius: 10, boxShadow: '0 3px 10px -4px rgba(58, 53, 48, 0.22)' }}>
            <b className="mono" style={{ fontSize: 'clamp(14px, 2.4vw, 18px)', color: T.ink }}>{d.num}</b>
            <span style={{ fontSize: 'clamp(10px, 1.5vw, 12px)', color: T.ink2, fontWeight: 600, textAlign: 'center' }}>{d[lang]}</span>
          </span>
        ))}
      </div>
    </div>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.6vw, 18px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
          <Row head={t(c.hundreds_head)} data={c.hundreds}/>
          {showT && <div className="lm-reveal" style={{ width: '100%' }}><Row head={t(c.tens_head)} data={c.tens}/></div>}
        </div>
      </div>
    </Stage>
  );
};

// s3 — RAQAM -> SO'Z (o'qish): 268
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
  const done = reached >= (c.audio[lang].length - 1);
  const digits = ['2', '6', '8'];
  const parts = [c.part_h, c.part_t, c.part_o];
  const cols = ['#C0392B', '#1F7A4D', T.blue];
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
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'clamp(10px, 2vw, 14px)', padding: 'clamp(14px, 2.6vw, 22px)', minHeight: 'clamp(170px, 36vw, 230px)' }}>
          <div style={{ display: 'flex', gap: 'clamp(10px, 3vw, 22px)', alignItems: 'flex-start', justifyContent: 'center' }}>
            {digits.map((d, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <span className="mono" style={{ fontSize: 'clamp(30px, 7vw, 44px)', fontWeight: 800, color: cols[i], border: `2.5px solid ${cols[i]}`, borderRadius: 12, minWidth: 'clamp(40px, 10vw, 56px)', textAlign: 'center', padding: '2px 0', background: T.paper }}>{d}</span>
                {reached >= i + 1 && <span className="lm-drop" style={{ fontSize: 'clamp(12px, 1.9vw, 15px)', fontWeight: 700, color: T.ink }}>{t(parts[i])}</span>}
              </div>
            ))}
          </div>
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

// s4 — SO'Z -> RAQAM (yozish): 268
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
  const showSlots = reached >= 1;
  const done = reached >= (c.audio[lang].length - 1);
  const labels = { h: t(c.hundreds_label), t: t(c.tens_label), o: t(c.ones_label) };
  const slots = [['2', 'h'], ['6', 't'], ['8', 'o']];
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
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'clamp(12px, 2.4vw, 18px)', padding: 'clamp(14px, 2.6vw, 22px)', minHeight: 'clamp(170px, 36vw, 230px)' }}>
          <span className="title" style={{ fontSize: 'clamp(18px, 3.6vw, 26px)', fontWeight: 700, color: T.accent, textAlign: 'center' }}>{t(c.word_name)}</span>
          <div style={{ display: 'flex', gap: 'clamp(8px, 2.4vw, 18px)' }}>
            {slots.map(([d, k], i) => (
              <div key={k} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span className="mono" style={{ fontSize: 'clamp(24px, 5.5vw, 34px)', fontWeight: 800, color: T.ink, border: `2.5px solid ${showSlots ? T.success : T.ink3}`, borderRadius: 10, minWidth: 'clamp(36px, 9vw, 48px)', textAlign: 'center', padding: '3px 0', background: T.paper }}>
                  {showSlots ? <span className="lm-drop" style={{ animationDelay: `${i * 0.22}s`, display: 'inline-block' }}>{d}</span> : '?'}
                </span>
                <span className="mono" style={{ fontSize: 'clamp(10px, 1.4vw, 12px)', color: T.ink2, fontWeight: 700 }}>{labels[k]}</span>
              </div>
            ))}
          </div>
          {done && <BigNum v={268} accent/>}
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

// s5 — NOL O'RIN yozuvda: 305 + misollar
const Screen5 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s5;
  const audio = useAudio([
    brgSeg('s5', lang),
    ...c.audio[lang].map((text, i) => ({ id: `s5_${i}`, text, trigger: 'after_previous', waits_for: null }))
  ]);
  const seg = audio.currentSegment;
  const [reached, setReached] = useState(-1);
  useEffect(() => { if (seg && /^s5_\d+$/.test(seg)) setReached((r) => Math.max(r, +seg.slice(3))); }, [seg]);
  const emptyOn = reached >= 1;
  const showZero = reached >= 2;
  const showEx = reached >= 3;
  const done = reached >= (c.audio[lang].length - 1);
  const canAdv = useAdvanceGate(done, audio);
  const navContent = (
    <>
      <NavBack onPrev={props.onPrev} label={<BackLabel/>}/>
      <NavNext disabled={!canAdv} onClick={props.onNext} label={<NextLabel/>}/>
    </>
  );
  const Slot = ({ d, col = T.ink, hi = false }) => (
    <span className="mono" style={{ fontSize: 'clamp(24px, 5.5vw, 34px)', fontWeight: 800, color: col, border: `2.5px solid ${hi ? T.accent : T.ink3}`, borderRadius: 10, minWidth: 'clamp(36px, 9vw, 48px)', textAlign: 'center', padding: '3px 0', background: T.paper }}>{d}</span>
  );
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(12px, 2.4vw, 18px)', padding: 'clamp(14px, 2.6vw, 22px)' }}>
          <span className="title" style={{ fontSize: 'clamp(18px, 3.6vw, 26px)', fontWeight: 700, color: T.accent }}>{t(c.word_name)}</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ display: 'flex', gap: 'clamp(8px, 2.4vw, 18px)', alignItems: 'center' }}>
              <Slot d="3"/>
              <Slot d={showZero ? '0' : (emptyOn ? '·' : '')} col={showZero ? T.accent : T.ink3} hi={emptyOn && !showZero}/>
              <Slot d="5"/>
            </div>
            {emptyOn && !showZero && <span className="mono lm-reveal" style={{ fontSize: 'clamp(11px, 1.6vw, 13px)', color: T.accent, fontWeight: 700 }}>{t(c.empty_label)}</span>}
          </div>
          {showZero && <BigNum v={305} accent/>}
          {showEx && (
            <div className="frame-tip lm-reveal" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(5px, 1.2vw, 8px)', padding: 'clamp(8px, 1.6vw, 12px)', width: '100%' }}>
              {c.examples.map((ex, i) => (
                <div key={i} className="g1-pop-in" style={{ animationDelay: `${i * 0.14}s`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span className="title" style={{ fontSize: 'clamp(13px, 2vw, 16px)', fontWeight: 600, color: T.ink2 }}>{t(ex.word)}</span>
                  <span className="mono" style={{ fontSize: 'clamp(16px, 3vw, 22px)', fontWeight: 800, color: T.accent }}>{ex.num}</span>
                </div>
              ))}
            </div>
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

// s6 — KO'PRIK: 999 -> MING
const Screen6 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s6;
  const audio = useAudio([
    brgSeg('s6', lang),
    ...c.audio[lang].map((text, i) => ({ id: `s6_${i}`, text, trigger: 'after_previous', waits_for: null }))
  ]);
  const seg = audio.currentSegment;
  const [reached, setReached] = useState(-1);
  useEffect(() => { if (seg && /^s6_\d+$/.test(seg)) setReached((r) => Math.max(r, +seg.slice(3))); }, [seg]);
  const showMing = reached >= 2;
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
        <div className="frame fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'clamp(10px, 2vw, 14px)', padding: 'clamp(14px, 2.6vw, 22px)', minHeight: 'clamp(170px, 36vw, 230px)' }}>
          {!showMing && (
            <>
              <span className="mono lm-reveal" style={{ fontSize: 'clamp(30px, 7vw, 44px)', fontWeight: 800, color: T.ink }}>999</span>
              <span className="title lm-reveal lm-d1" style={{ fontSize: 'clamp(14px, 2.4vw, 18px)', color: T.ink2, textAlign: 'center' }}>{t(c.near_word)}</span>
            </>
          )}
          {showMing && (
            <>
              <span className="mono lm-eq lm-write" style={{ fontSize: 'clamp(20px, 4vw, 30px)', fontWeight: 800, color: T.success }}>{t(c.ming_eq)}</span>
              <span className="lm-write lm-d1" style={{ fontSize: 'clamp(20px, 4vw, 30px)', fontWeight: 800, color: T.accent, letterSpacing: 3 }}>{t(c.ming_word)}</span>
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

// s7 — QOIDA: 305 razryad + check (bo'sh xonani bos)
const Screen7 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s7;
  const sfx = useSfx();
  const audio = useAudio([
    brgSeg('s7', lang),
    ...c.audio[lang].map((text, i) => ({ id: `s7_${i}`, text, trigger: 'after_previous', waits_for: null }))
  ]);
  const canAct = useCanAnswer(audio);
  const [tapped, setTapped] = useState(null);
  const [badCell, setBadCell] = useState(null);   // promax: qaysi katak qizarib turibdi
  const ok = tapped === 't';
  const revealRef = useRevealScroll(ok, 500);
  const onCell = (k) => {
    if (!canAct || ok) return;
    setTapped(k);
    if (k === 't') { sfx.playCorrect(); setBadCell(null); return; }
    // Xato katakni KO'RSATAMIZ: ilgari faqat jadval ostidagi yozuv o'zgarardi va bola
    // qayerga bosgani bilinmasdi (metodist e'tirozi 2026-08-09).
    setBadCell(k);
    setTimeout(() => setBadCell(null), 900);
  };
  const labels = { h: t(c.hundreds_label), t: t(c.tens_label), o: t(c.ones_label) };
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
          <RazryadTable h={3} t={0} o={5} labels={labels} digits onCell={onCell} cellSel={ok ? 't' : null} cellBad={badCell}/>
          {ok || !tapped
            ? <p style={{ textAlign: 'center', color: T.ink2, fontWeight: 700, margin: 0 }}>{ok ? t(c.check_ok) : t(c.check_q)}</p>
            : <p className="lm-hint-bad fade-up">{t(c.check_no)}</p>}
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

// s8 — MASHQ o'qish (RAQAM -> SO'Z), 3 raund
const Screen8 = (props) => {
  const t = useT();
  const c = CONTENT.s8;
  const heading = () => t(c.q);
  const renderFig = (it) => (
    <div className="lm-figwrap">
      <span className="mono" style={{ fontSize: 'clamp(34px, 8vw, 52px)', fontWeight: 800, color: T.ink, letterSpacing: 2 }}>{it.num}</span>
    </div>
  );
  return <MCRoundD2 props={props} ck="s8" cols={1} heading={heading} renderFig={renderFig}/>;
};

// s9 — MASHQ yozish (SO'Z -> RAQAM, NumPad), 3 raund
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
  const [round, setRound] = useState(props.storedAnswer ? items.length : 0);
  const [numState, setNumState] = useState(null);   // javob maydonining KO'RINISHI: ok / bad
  const [val, setVal] = useState(props.storedAnswer ? String(items[items.length - 1].ans) : '');
  const [checked, setChecked] = useState(false);
  const [roundOk, setRoundOk] = useState(false);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const firstAllRef = useRef(props.storedAnswer ? props.storedAnswer.firstTry : true);
  const [score, setScore] = useState(props.storedAnswer ? (props.storedAnswer.studentAnswer | 0) : 0);
  const triedRef = useRef(false);   // shu raundda xato bo'lganmi: ball faqat birinchi urinishda
  const done = round >= items.length;
  const it = items[Math.min(round, items.length - 1)];
  const correct = parseInt(val, 10) === it.ans;
  const revealRef = useRevealScroll(checked, 500);
  const check = () => {
    if (!canAct || checked || done || val === '') return;
    setChecked(true);
    const isOk = correct;
    setNumState(isOk ? 'ok' : 'bad');
    setRoundOk(isOk);
    if (!isOk) { firstAllRef.current = false; triedRef.current = true; }
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((isOk ? c.audio.on_correct : c.audio.on_wrong)[lang]); }
    if (isOk) { sfx.playCorrect(); if (!triedRef.current) setScore((v) => v + 1); setTimeout(() => { setChecked(false); if (round + 1 < items.length) setVal(''); triedRef.current = false; setRound((r) => r + 1); }, 1000); }
    else { setTimeout(() => { setChecked(false); setVal(''); }, 1700); }
  };
  useEffect(() => {
    if (done && !recorded) {
      setRecorded(true);
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: t(c.q),
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
  const askLine = tri(lang, 'Набери число цифрами:', 'Sonni raqamlab tering:', 'Type the number in digits:');
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vw, 14px)' }}>
        {it && (
          <>
            <div className="mono fade-up" style={{ textAlign: 'center', color: T.accent, fontWeight: 800 }}>{lang === 'ru' ? `Задание ${Math.min(round + 1, items.length)} из ${items.length}` : `${Math.min(round + 1, items.length)}-topshiriq, jami ${items.length}`}</div>
            <h1 className="title h-sub fade-up">{t(c.q)}</h1>
            <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(10px, 2vw, 14px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
              <FrameFx/>
              <span className="title" style={{ fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 700, color: T.accent, textAlign: 'center' }}>{t(it.word)}</span>
              <p style={{ margin: 0, textAlign: 'center', color: T.ink2, fontSize: 'clamp(12px, 1.6vw, 14px)', fontWeight: 600 }}>{askLine}</p>
              <NumPad value={val} setValue={(u) => { setNumState(null); setVal(u); }} disabled={!canAct || checked || done} max={3} state={numState}/>
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
            <Reaction state="correct" praise={lang === 'ru' ? `Верно: ${score} из ${items.length}` : `To'g'ri: ${items.length} tadan ${score} ta`}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s10 — MASHQ nol-o'rin (SO'Z -> RAQAM, MC), 3 raund
const Screen10 = (props) => {
  const lang = useLang();
  const t = useT();
  const heading = () => (tri(lang, 'Какое это число?', 'Bu qaysi son?', 'What number is this?'));
  const renderFig = (it) => (
    <div className="lm-figwrap">
      <span className="title" style={{ fontSize: 'clamp(22px, 5vw, 34px)', fontWeight: 700, color: T.accent, textAlign: 'center' }}>{t(it.word)}</span>
    </div>
  );
  return <MCRoundD2 props={props} ck="s10" cols={2} heading={heading} renderFig={renderFig}/>;
};

// s11 — MASHQ xatoni top (noto'g'ri juftni top), 3 raund
const Screen11 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s11;
  const sfx = useSfx();
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
              {it.pairs.map((p, i) => (
                <button key={i} className={`option ${wrongSet.has(i) ? 'option-picked-wrong' : ''} ${solvedRound && i === it.wrong ? 'option-correct' : ''}`} disabled={!canAct || solvedRound || wrongSet.has(i)} onClick={() => pick(i)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: 'clamp(10px, 1.6vw, 14px) clamp(14px, 2.4vw, 20px)', minHeight: 'clamp(48px, 7vw, 58px)' }}>
                  <span className="title" style={{ fontSize: 'clamp(14px, 2.3vw, 18px)', fontWeight: 700 }}>{t(p.word)}</span>
                  <span className="mono" style={{ fontSize: 'clamp(16px, 2.8vw, 22px)', fontWeight: 800, color: T.ink3 }}>=</span>
                  <span className="mono" style={{ fontSize: 'clamp(18px, 3.4vw, 24px)', fontWeight: 800, color: T.accent }}>{p.num}</span>
                </button>
              ))}
              {wrongSet.size > 0 && !solvedRound && <p className="lm-hint-bad fade-up">{t(it.hint)}</p>}
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

// s12 — MASALA (case): ma'lumot minorasi kodi (NumPad, so'z -> raqam)
const Screen12 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s12;
  const sfx = useSfx();
  const audio = useAudio([
    brgSeg('s12', lang),
    { id: 's12_setup', text: c.setup_audio[lang], trigger: 'after_previous', waits_for: null },
    { id: 's12_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [val, setVal] = useState(props.storedAnswer ? String(props.storedAnswer.studentAnswer) : '');
  const [numState, setNumState] = useState(null);   // javob maydonining KO'RINISHI: ok / bad
  const [checked, setChecked] = useState(props.storedAnswer !== undefined);
  const [solved, setSolved] = useState(props.storedAnswer?.correct === true);
  const firstRef = useRef(props.storedAnswer ? props.storedAnswer.firstTry : null);
  const revealRef = useRevealScroll(checked, 500);
  const correct = parseInt(val, 10) === c.ans;
  const check = () => {
    if (!canAct || solved || val === '') return;
    setChecked(true);
    const isOk = correct;
    setNumState(isOk ? 'ok' : 'bad');
    if (firstRef.current === null) firstRef.current = isOk;
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((isOk ? c.audio.on_correct : c.audio.on_wrong)[lang]); }
    if (isOk) { setSolved(true); sfx.playCorrect(); }
    props.onAnswer({
      stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: t(c.q),
      correctAnswer: String(c.ans), studentAnswer: val, correct: isOk,
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
  const askLine = tri(lang, 'Набери код цифрами:', 'Kodni raqamlab tering:', 'Type the code in digits:');
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.5vw, 11px)' }}>
        <p className="fade-up" style={{ textAlign: 'center', color: T.ink2, fontWeight: 700, margin: 0 }}>{t(c.lead)}</p>
        <h1 className="title h-sub fade-up delay-1" style={{ margin: 0 }}>{t(c.q)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(6px, 1.2vw, 9px)', padding: 'clamp(8px, 1.6vw, 12px)' }}>
          <FrameFx/>
          <div className="lm-report">
            <span className="lm-report-head mono">{t(c.manifest_label)}</span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 6 }}>
              <span className="g1-cast-fig" style={{ width: 'clamp(40px, 12vw, 54px)' }}><AnvarSVG pose="door"/></span>
              <span className="title" style={{ fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 700, color: T.accent }}>{t(c.code_word)}</span>
            </div>
          </div>
          <p className="fade-up" style={{ margin: 0, textAlign: 'center', color: T.ink2, fontSize: 'clamp(12px, 1.6vw, 14px)', fontWeight: 600 }}>{askLine}</p>
          <NumPad value={val} setValue={(u) => { setNumState(null); setVal(u); }} disabled={!canAct || solved} max={3} state={numState}/>
          <button className="btn-white-accent" disabled={!canAct || solved || val === ''} onClick={check}>{tri(lang, 'Проверить', 'Tekshiring', 'Check')}</button>
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

// FaktCard rasmi: yuqori chiziq — Olam yoshi, pastki — qizil mittining umri. Pastkisi kadrdan
// chiqib ketadi: yulduz hali qarigani yo'q.
const LifeSpanFig = () => (
  <span className="d2-factfig" aria-hidden="true">
    <svg viewBox="0 0 340 150" width="340" height="150" preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="d2Bg" cx="50%" cy="50%" r="62%"><stop offset="0%" stopColor="#2A1830"/><stop offset="52%" stopColor="#15132C"/><stop offset="100%" stopColor="#090717"/></radialGradient>
        <linearGradient id="d2BarU" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#4E5EA0"/><stop offset="100%" stopColor="#9B87D8"/></linearGradient>
        <linearGradient id="d2BarS" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#C43A1E"/><stop offset="100%" stopColor="#FFB067"/></linearGradient>
        <radialGradient id="d2Star" cx="40%" cy="36%" r="62%"><stop offset="0%" stopColor="#FFE8C0"/><stop offset="40%" stopColor="#FF7A3C"/><stop offset="100%" stopColor="#BE2E0C"/></radialGradient>
        <radialGradient id="d2Glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#FF6A3C" stopOpacity="0.55"/><stop offset="100%" stopColor="#FF6A3C" stopOpacity="0"/></radialGradient>
        <clipPath id="d2Clip"><rect x="0" y="0" width="340" height="150" rx="16"/></clipPath>
      </defs>
      <g clipPath="url(#d2Clip)">
        <rect width="340" height="150" fill="url(#d2Bg)"/>
        <g fill="#FFF6E8">
          {[[26, 18, 1.3, 0], [86, 134, 1, 0.7], [150, 16, 1.1, 1.4], [232, 24, 1.4, 0.4], [302, 128, 1.2, 1.1], [268, 14, 1, 2]].map(([x, y, r, d], i) => (
            <circle key={i} className="lm-ff-tw" style={{ animationDelay: d + 's' }} cx={x} cy={y} r={r}/>
          ))}
        </g>
        <g transform="translate(50 48)">
          <ellipse cx="0" cy="0" rx="16" ry="6.4" fill="none" stroke="#9B87D8" strokeWidth="2"/>
          <ellipse cx="0" cy="0" rx="8.4" ry="3.4" fill="#C6B6F0" opacity="0.85"/>
          <circle cx="0" cy="0" r="2.4" fill="#FFFFFF"/>
        </g>
        <rect x="80" y="41" width="122" height="14" rx="7" fill="url(#d2BarU)"/>
        <g transform="translate(50 101)">
          <circle className="lm-ff-glow" cx="0" cy="0" r="25" fill="url(#d2Glow)"/>
          <circle cx="0" cy="0" r="12.5" fill="url(#d2Star)"/>
          <path d="M-9 -5 A12.5 12.5 0 0 1 1 -11.5" fill="none" stroke="#FFEBC8" strokeWidth="1.7" opacity="0.5" strokeLinecap="round"/>
        </g>
        <rect x="80" y="94" width="228" height="14" rx="7" fill="url(#d2BarS)"/>
        <path d="M306 87 L332 101 L306 115 Z" fill="#FFC59A"/>
      </g>
    </svg>
  </span>
);

// s13 — FINAL panel (5 savol aralash) + FactCard
const Screen13 = (props) => {
  const lang = useLang();
  const t = useT();
  const c = CONTENT.s13;
  const items = c.items;
  const orders = React.useMemo(() => items.map((it) => it.kind === 'num' ? null : shuffleArr([0, 1, 2])), []);
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
                  <NumPad value={val} setValue={setVal} disabled={!canAct || numLock} max={3} state={numState}/>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button className="btn-white-accent" disabled={!canAct || numLock || val === ''} onClick={checkNum}>{tri(lang, 'Проверить', 'Tekshiring', 'Check')}</button>
                </div>
                {hintMsg && <p className="lm-hint-bad fade-up">{t(it.hint)}</p>}
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
                  <p className="lm-hint-bad fade-up">{t(hintMsg)}</p>
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
              <div className="d2-fact-hero"><LifeSpanFig/></div>
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
          <span className="d2-rulecard-badge mono">{tri(lang, 'Помни', 'Yodda tuting', 'Remember')}</span>
          <p className="d2-rulecard-txt">{t(c.rule_recap)}</p>
        </div>
        <div className="fade-up delay-1"><LessonScene gathered/></div>
      </div>
    </Stage>
  );
};

// ============================================================
// KORNEVOY KOMPONENT (shablon: infrastructure_v1 / grade1 Dars28)
// ============================================================
export default function ReadWriteLesson({
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
.lm-scene { position: relative; width: min(100%, calc(clamp(var(--scene-floor, 160px), calc(100dvh - var(--scene-reserve, 570px)), 372px) * 400 / 210)); aspect-ratio: 400 / 210; margin-inline: auto; border-radius: 14px; overflow: hidden; }
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
