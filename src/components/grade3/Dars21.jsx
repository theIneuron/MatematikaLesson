import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { BackLabel, BitSVG, CheckStrip, Chiroq, Confetti, D2Defs, D2Motes, FREE_NAV, FeedbackBlock, FoldRow, FrameFx, GradientDefs, HeroContext, LUMO_CAST, LangContext, Lenta, NavBack, NavNext, NextLabel, Panel, ProgressContext, Reaction, ReadinessMeter, Stage, StageHero, T, TaskTable, configureLesson, getAudioEngine, nextPraise, npKey, shuffleArr, ttsConfig, useAdvanceGate, useAudio, useCanAnswer, useLang, useMobileZoom, usePrefersReducedMotion, useRevealScroll, useSfx, useT, useTapSteps, makeBrgSeg, gridCols , pickSib , tri } from './_kit/index.jsx';
import { BASE_STYLES } from './_kit/styles.js';

// ============================================================================
// DD 3-SINF | Dars21 — "Yozma usul: ustun" (num-3-21) | Б3 «USTAXONA»
// Syujet: «ustun terminali» (SYUJET_3SINF.md 163-satr). Sonlar kattalashdi, og'zaki
//   hisoblash uzoq — daftardagi qisqa yozuv, ya'ni USTUN kiritiladi.
// SAHNA: blokka bitta fon (17-darsning ustaxonasi), ishchi tugun BOSHQA: USTUN TERMINALI —
//   xonalar bo'yicha chiziqli tablo, tepasida o'tkazish uchun kichik oyna.
// MEXANIKA (yangi mexanika YARATILMAGAN): MC xuk, TAP bilan ochilish, USTUN qadamlab
//   (13-darsning `ColumnCalc` komponenti), savol-oldin-qoida, xatoni top (ikki marta),
//   tokchaga saralash, konsol uch katak, bitta savolli MC va NumPad, Bit tuzog'i,
//   masala jadval bilan, final panel + FactCard.
// DARSLIK ASOSI (Burxonov, 3-sinf, «Sharq» 2019):
//   45-bet «Xonadan o'tmasdan ko'paytirish» — 123 · 3 = (100 + 20 + 3) · 3 = 369 va
//   ustun yozuvining QOIDASI dosloven (ikkinchi ko'paytuvchi birliklar tagiga, avval
//   birliklar, keyin o'nliklar va yuzliklar, har ko'paytma o'z xonasi tagiga);
//   46-bet «O'nlikdan o'tib ko'paytirish» — 328 · 3, o'nlik dilda saqlanadi;
//   45-bet 2-topshiriq: 43 · 2, 213 · 3, 122 · 4, 124 · 2, 111 · 8;
//   46-bet 6-topshiriq — masala (154 parta, stol 2 marta ko'p);
//   47-bet 2-topshiriq: 48 · 2, 146 · 2 (o'tkazishli misollar, s5 saralash).
// YADRO: 123 · 3 — avval xonalar bo'yicha (tanish usul), keyin O'SHA hisob ustunda.
// Misconception: M1 ikkinchi ko'paytuvchini yuqori xona tagiga yozish; M2 o'tkazishni
//   unutish; M3 o'tkazishni boshqa xonaga qo'shish; M4 chapdan o'ngga hisoblash.
// FactCard: ustunga ~1200 yil, uni al-Xorazmiy tavsiflagan — «algoritm» so'zi shundan.
// Kontent: src/books/grade3/KONTENT_3SINF.md, «Dars 21». Karkas: BLOK_B3_KARKAS.md.
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
  lessonId: 'grade3-21',
  lessonTitle: { ru: 'Урок 21. Письменный приём: столбик', uz: '21-dars. Yozma usul: ustun', en: 'Lesson 21. The written method: the column' }
};
// STRUKTURA (KONTENT_3SINF.md «Dars 21»): s0 xuk 123·3 · s1 xonalar bo'yicha · s2 USTUN
// qadamlab · s3 savol-oldin-QOIDA · s4 xatoni top (yozuv siljigan) · s5 saralash
// o'tkazish kerakmi · s6 test 43·2 · s7 konsol 328·3 · s8 xatoni top (o'tkazish yo'qolgan) ·
// s9 Bit tuzog'i (chapdan o'ngga) · s10 trenajyor 213·3 · s11 trenajyor 122·4 ·
// s12 masala 154·2+154 · s13 final 3 misol + FactCard · s14 yakun.
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'MCScreen', scored: false, scope: 'hook' },
  { id: 's1',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's4',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's5',  type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's6',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's7',  type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's8',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's9',  type: 'exploration', template: 'custom',   scored: true,  scope: 'practice' },
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
    eyebrow: { ru: 'Крючок', uz: 'Qiziqtirish', en: 'Hook' },
    topic: { ru: 'Письменный приём: столбик', uz: 'Yozma usul: ustun', en: 'The written method: the column' },
    lead: { ru: 'Заказ: 123 детали на каждый из 3 модулей', uz: "Buyurtma: 3 modulning har biriga 123 tadan detal", en: 'Order: 123 parts for each of the 3 modules' },
    order_cap: { ru: 'в уме такое считать долго', uz: "bunday hisobni og'zaki qilish uzoq", en: 'counting that in your head takes long' },
    q: { ru: 'Сколько деталей нужно всего?', uz: 'Jami nechta detal kerak?', en: 'How many parts are needed in all?' },
    opt0: { ru: '369', uz: '369', en: '369' },
    opt1: { ru: '366', uz: '366', en: '366' },
    opt2: { ru: '129', uz: '129', en: '129' },
    opt3: { ru: '3639', uz: '3639', en: '3639' },
    audio: {
      intro: {
        ru: [
          'Тема урока называется письменный приём умножения, или столбик.',
          'Мастерской нужно три модуля, и в каждом сто двадцать три детали.',
          'Числа стали большими. В уме считать долго, и легко сбиться.',
          'Как думаешь, сколько деталей понадобится всего?'
        ],
        uz: [
          "Dars mavzusi yozma ko'paytirish usuli, ya'ni ustun deb ataladi.",
          "Ustaxonaga uchta modul kerak, har birida bir yuz yigirma uchta detal.",
          "Sonlar kattalashdi. Og'zaki hisoblash uzoq, adashish oson.",
          "Sizningcha, jami nechta detal kerak bo'ladi?"
        ],
        en: ['The topic of the lesson is called the written method of multiplication, or the column.', 'The workshop needs three modules, and each one has one hundred twenty three parts.', 'The numbers have grown big. Counting in your head takes long and it is easy to slip.', 'How many parts do you think will be needed in all?']
      },
      on_correct: {
        ru: 'Верно! А сейчас увидишь, как такую запись делают в тетради, столбиком.',
        uz: "To'g'ri! Endi bunday yozuv daftarda, ustunda qanday qilinishini ko'rasiz.",
        en: 'Right! And now you will see how such a line is written in a notebook, in a column.'
      },
      on_wrong1: {
        ru: 'Почти. Три сотни и шесть десятков верно, а единицы посчитаны неточно.',
        uz: "Deyarli. Uch yuzlik va olti o'nlik to'g'ri, birliklar noaniq sanalgan.",
        en: 'Almost. Three hundreds and six tens are right, and the units were counted inexactly.'
      },
      on_wrong2: {
        ru: 'Это только сто двадцать три и ещё шесть. А брать надо три раза по сто двадцать три.',
        uz: "Bu faqat bir yuz yigirma uch va yana olti. Olish kerak esa bir yuz yigirma uchtadan uch marta.",
        en: 'That is only one hundred twenty three and six more. But one hundred twenty three has to be taken three times.'
      },
      on_idk: {
        ru: 'Цифры перемножены по отдельности и склеены. Так число рассыпается.',
        uz: "Raqamlar alohida ko'paytirilib yelimlangan. Bunda son buzilib ketadi.",
        en: 'The digits were multiplied separately and glued together. A number falls apart that way.'
      }
    }
  },

  s1: {
    eyebrow: { ru: 'Разбираем', uz: 'Ajratamiz', en: 'Taking it apart' },
    lead: { ru: 'Сначала по разрядам, как умеем', uz: 'Avval xonalarga, bilganimizdek', en: 'First by place, the way we can' },
    task_line: '123 · 3',
    task_line_uz: '123 · 3',
    task_line_en: '123 · 3',
    step1: '100 · 3 + 20 · 3 + 3 · 3',
    step1_cap: { ru: 'каждый разряд отдельно', uz: 'har bir xona alohida', en: 'each place on its own' },
    step2: '300 + 60 + 9 = 369',
    step2_cap: { ru: 'и собираем обратно', uz: "va qaytadan yig'amiz", en: 'and we gather it back' },
    res: '123 · 3 = 369',
    btn1: { ru: 'Разложить на разряды', uz: 'Xonalarga ajratish', en: 'Split into places' },
    btn2: { ru: 'Сложить', uz: "Qo'shish", en: 'Add' },
    done_text: { ru: 'Приём знакомый, но записи много. В тетради её сокращают.', uz: "Usul tanish, lekin yozuv ko'p. Daftarda uni qisqartirishadi.", en: 'The method is familiar, but there is a lot of writing. In a notebook it is made shorter.' },
    audio: {
      ru: [
        'Сто двадцать три умножить на три. Начнём привычно, по разрядам.',
        'Сто на три, двадцать на три, три на три.',
        'Триста, шестьдесят и девять. Вместе триста шестьдесят девять.'
      ],
      uz: [
        "Bir yuz yigirma uchni uchga ko'paytiramiz. Odatdagidek, xonalardan boshlaymiz.",
        "Yuzni uchga, yigirmani uchga, uchni uchga.",
        "Uch yuz, oltmish va to'qqiz. Birgalikda uch yuz oltmish to'qqiz."
      ],
      en: ['One hundred twenty three times three. Let us start as usual, by place.', 'A hundred times three, twenty times three, three times three.', 'Three hundred, sixty and nine. Together three hundred sixty nine.']
    }
  },

  s2: {
    eyebrow: { ru: 'Столбик', uz: 'Ustun', en: 'The column' },
    lead: { ru: 'Та же запись, но короче', uz: 'O\'sha yozuv, lekin qisqaroq', en: 'The same line, only shorter' },
    book_note: { ru: 'правило записи из учебника, стр. 45', uz: 'kitobdagi yozuv qoidasi, 45-bet', en: 'the writing rule from the textbook, page 45' },
    top: '123',
    bot: '3',
    res: '369',
    steps: [
      { cap: { ru: 'второй множитель пишем под единицами', uz: "ikkinchi ko'paytuvchini birliklar tagiga yozamiz", en: 'we write the second factor under the units' }, res: '' },
      { cap: { ru: 'умножаем единицы: 3 · 3 = 9', uz: "birliklarni ko'paytiramiz: 3 · 3 = 9", en: 'we multiply the units: 3 · 3 = 9' }, res: '__9' },
      { cap: { ru: 'десятки: 2 · 3 = 6', uz: "o'nliklar: 2 · 3 = 6", en: 'the tens: 2 · 3 = 6' }, res: '_69' },
      { cap: { ru: 'сотни: 1 · 3 = 3', uz: "yuzliklar: 1 · 3 = 3", en: 'the hundreds: 1 · 3 = 3' }, res: '369' }
    ],
    btn: { ru: 'Следующий разряд', uz: 'Keyingi xona', en: 'The next place' },
    done_text: { ru: 'Ответ тот же, а записи в три раза меньше.', uz: "Javob o'sha, yozuv esa uch barobar kam.", en: 'The answer is the same, and there is three times less writing.' },
    audio: {
      ru: [
        'Теперь та же работа, но столбиком. Второй множитель пишем под разрядом единиц.',
        'Умножаем единицы. Три на три, девять. Пишем под единицами.',
        'Десятки. Два на три, шесть. Пишем под десятками.',
        'Сотни. Один на три, три. Пишем под сотнями. Получилось триста шестьдесят девять.'
      ],
      uz: [
        "Endi o'sha ish, lekin ustunda. Ikkinchi ko'paytuvchini birliklar xonasi tagiga yozamiz.",
        "Birliklarni ko'paytiramiz. Uch karra uch, to'qqiz. Birliklar tagiga yozamiz.",
        "O'nliklar. Ikki karra uch, olti. O'nliklar tagiga yozamiz.",
        "Yuzliklar. Bir karra uch, uch. Yuzliklar tagiga yozamiz. Uch yuz oltmish to'qqiz chiqdi."
      ],
      en: ['Now the same work, but in a column. We write the second factor under the units place.', 'We multiply the units. Three times three, nine. We write it under the units.', 'The tens. Two times three, six. We write it under the tens.', 'The hundreds. One times three, three. We write it under the hundreds. We got three hundred sixty nine.']
    }
  },

  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    q: { ru: 'Под каким разрядом пишут второй множитель?', uz: "Ikkinchi ko'paytuvchi qaysi xona tagiga yoziladi?", en: 'Under which place is the second factor written?' },
    opts: [
      { ru: 'под единицами', uz: 'birliklar tagiga', en: 'under the units' },
      { ru: 'под сотнями', uz: 'yuzliklar tagiga', en: 'under the hundreds' },
      { ru: 'под десятками', uz: "o'nliklar tagiga", en: 'under the tens' },
      { ru: 'где удобно', uz: 'qulay joyga', en: 'wherever is handy' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Под сотнями он окажется не в своём разряде, и всё сдвинется.', uz: "Yuzliklar tagida u o'z xonasida bo'lmaydi va hammasi siljib ketadi.", en: 'Under the hundreds it will be in the wrong place, and everything will shift.' },
      2: { ru: 'Десятки не подходят, ведь у второго множителя всего один разряд, единицы.', uz: "O'nliklar to'g'ri kelmaydi, chunki ikkinchi ko'paytuvchida bitta xona bor, birliklar.", en: 'The tens do not fit, because the second factor has only one place, the units.' },
      3: { ru: 'Место не выбирают. Разряд пишут под своим разрядом.', uz: "Joy tanlanmaydi. Xona o'z xonasi tagiga yoziladi.", en: 'The place is not chosen. A place is written under its own place.' }
    },
    on_correct: { ru: 'Верно! Единицы под единицами, и умножение начинают с них.', uz: "To'g'ri! Birliklar birliklar tagida, ko'paytirish ham shulardan boshlanadi.", en: 'Right! Units under units, and multiplying starts with them.' },
    rule_lines: {
      ru: [
        'второй множитель пишут под единицами',
        'умножают справа налево, начиная с единиц',
        'каждое произведение пишут под своим разрядом'
      ],
      uz: [
        "ikkinchi ko'paytuvchi birliklar tagiga yoziladi",
        "o'ngdan chapga, birliklardan boshlab ko'paytiriladi",
        "har bir ko'paytma o'z xonasi tagiga yoziladi"
      ],
      en: ['the second factor is written under the units', 'we multiply from right to left, starting with the units', 'each product is written under its own place']
    },
    rule_ex: '123 · 3 = 369',
    rule_speech: {
      ru: 'Правило такое. Второй множитель пишем под разрядом единиц. Умножаем справа налево, начиная с единиц. Каждое произведение пишем под своим разрядом.',
      uz: "Qoida shunday. Ikkinchi ko'paytuvchini birliklar xonasi tagiga yozamiz. O'ngdan chapga, birliklardan boshlab ko'paytiramiz. Har bir ko'paytmani o'z xonasi tagiga yozamiz.",
      en: 'The rule is this. We write the second factor under the units place. We multiply from right to left, starting with the units. We write each product under its own place.'
    },
    audio: {
      intro: { ru: 'Теперь главный вопрос урока.', uz: 'Endi darsning asosiy savoli.', en: 'Now the main question of the lesson.' }
    }
  },

  s4: {
    eyebrow: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    q: { ru: 'Столбик записан неверно. В чём ошибка?', uz: "Ustun noto'g'ri yozilgan. Xato nimada?", en: 'The column is written wrongly. What is the mistake?' },
    fig_line: { ru: '213 · 3 → множитель 3 стоит под цифрой 2', uz: "213 · 3 → 3 ko'paytuvchi 2 raqami tagida", en: '213 · 3 → the factor 3 stands under the digit 2' },
    opts: [
      { ru: 'множитель стоит не под единицами', uz: "ko'paytuvchi birliklar tagida emas", en: 'the factor is not under the units' },
      { ru: 'множитель слишком маленький', uz: "ko'paytuvchi juda kichik", en: 'the factor is too small' },
      { ru: 'начали умножать не с той стороны', uz: "ko'paytirish noto'g'ri tomondan boshlangan", en: 'they started multiplying from the wrong side' },
      { ru: 'ошибки нет', uz: "xato yo'q", en: 'there is no mistake' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Размер множителя ни при чём. Смотри, где он стоит.', uz: "Ko'paytuvchining kattaligi muhim emas. Qayerda turganiga qarang.", en: 'The size of the factor has nothing to do with it. Look at where it stands.' },
      2: { ru: 'До умножения дело не дошло. Запись уже сдвинута.', uz: "Ko'paytirishgacha ish yetmadi. Yozuvning o'zi siljigan.", en: 'It never got as far as multiplying. The writing is already shifted.' },
      3: { ru: 'Сравни разряды. Тройка это единицы, а стоит она под сотнями.', uz: "Xonalarni solishtiring. Uch bu birlik, u esa yuzliklar tagida turibdi.", en: 'Compare the places. The three is units, and it stands under the hundreds.' }
    },
    audio: {
      intro: {
        ru: ['Двести тринадцать умножить на три. Кто-то записал столбик так, что тройка оказалась под двойкой.', 'Найди ошибку в записи.'],
        uz: ["Ikki yuz o'n uchni uchga ko'paytirish. Kimdir ustunni shunday yozdiki, uch ikkining tagida qoldi.", 'Yozuvdagi xatoni toping.'],
        en: ['Two hundred thirteen times three. Someone wrote the column so that the three ended up under the two.', 'Find the mistake in the writing.']
      },
      on_correct: { ru: 'Точно! Единицы пишут под единицами, иначе разряды перепутаются.', uz: "Aniq! Birliklar birliklar tagiga yoziladi, aks holda xonalar chalkashadi.", en: 'Exactly! Units are written under units, otherwise the places get mixed up.' },
      on_wrong: { ru: 'Посмотри, под каким разрядом стоит второй множитель.', uz: "Ikkinchi ko'paytuvchi qaysi xona tagida turganiga qarang.", en: 'Look at which place the second factor stands under.' }
    }
  },

  s5: {
    eyebrow: { ru: 'Сортировка', uz: 'Saralash', en: 'Sorting' },
    lead: { ru: 'Нужен ли перенос?', uz: "O'tkazish kerakmi?", en: 'Is a carry needed?' },
    bin_a: { ru: 'без переноса', uz: "o'tkazishsiz", en: 'without a carry' },
    bin_b: { ru: 'с переносом', uz: "o'tkazish bilan", en: 'with a carry' },
    items: [
      { n: '213 · 3', a: true, hint: { ru: 'Три на три девять, это одна цифра. Переносить нечего.', uz: "Uch karra uch to'qqiz, bu bitta raqam. O'tkazadigan narsa yo'q.", en: 'Three times three is nine, that is one digit. There is nothing to carry.' } },
      { n: '48 · 2', a: false, hint: { ru: 'Восемь на два шестнадцать. Шесть пишем, один десяток в уме.', uz: "Sakkiz karra ikki o'n olti. Oltini yozamiz, bitta o'nlik dilda.", en: 'Eight times two is sixteen. We write six and keep one ten in mind.' } },
      { n: '122 · 4', a: true, hint: { ru: 'Два на четыре восемь, одна цифра. Перенос не нужен.', uz: "Ikki karra to'rt sakkiz, bitta raqam. O'tkazish kerak emas.", en: 'Two times four is eight, one digit. No carry is needed.' } },
      { n: '146 · 2', a: false, hint: { ru: 'Шесть на два двенадцать. Два пишем, один десяток в уме.', uz: "Olti karra ikki o'n ikki. Ikkini yozamiz, bitta o'nlik dilda.", en: 'Six times two is twelve. We write two and keep one ten in mind.' } }
    ],
    audio: {
      intro: { ru: 'Разложи примеры по полкам. Слева те, где каждое произведение однозначное, справа те, где придётся держать десяток в уме.', uz: "Misollarni tokchalarga ajrating. Chapda har bir ko'paytma bir xonali bo'lganlari, o'ngda o'nlikni dilda saqlash kerak bo'lganlari.", en: 'Lay the examples out on the shelves. On the left those where every product is one digit, on the right those where a ten has to be kept in mind.' },
      on_correct: { ru: 'Верно.', uz: "To'g'ri.", en: 'Correct.' },
      on_wrong: { ru: 'Умножь единицы и посмотри, одна цифра получилась или две.', uz: "Birliklarni ko'paytiring va bitta raqam chiqdimi yoki ikkita, qarang.", en: 'Multiply the units and see whether one digit came out or two.' }
    }
  },

  s6: {
    eyebrow: { ru: 'Тест', uz: 'Test', en: 'Test' },
    q: { ru: '43 · 2 = ?', uz: '43 · 2 = ?', en: '43 · 2 = ?' },
    opts: [
      { ru: '86', uz: '86', en: '86' },
      { ru: '68', uz: '68', en: '68' },
      { ru: '46', uz: '46', en: '46' },
      { ru: '806', uz: '806', en: '806' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Цифры ответа переставлены. Восемь десятков и шесть единиц.', uz: "Javob raqamlari o'rin almashgan. Sakkiz o'nlik va olti birlik.", en: 'The digits of the answer are swapped. Eight tens and six units.' },
      2: { ru: 'Умножили только десятки и приписали тройку. Три тоже умножают.', uz: "Faqat o'nliklar ko'paytirilib, uch yozib qo'yilgan. Uch ham ko'paytiriladi.", en: 'Only the tens were multiplied and the three was written on. Three is multiplied too.' },
      3: { ru: 'Разряды склеены в одно число. Восемьдесят и шесть это восемьдесят шесть.', uz: "Xonalar bitta songa yelimlangan. Sakson va olti bu sakson olti.", en: 'The places are glued into one number. Eighty and six is eighty six.' }
    },
    audio: {
      intro: { ru: 'Сорок три умножить на два. Считай столбиком, справа налево.', uz: "Qirq uchni ikkiga ko'paytiring. Ustunda, o'ngdan chapga hisoblang.", en: 'Forty three times two. Count in a column, from right to left.' },
      on_correct: { ru: 'Верно! Шесть единиц и восемь десятков.', uz: "To'g'ri! Olti birlik va sakkiz o'nlik.", en: 'Right! Six units and eight tens.' },
      on_wrong: { ru: 'Умножь сначала единицы, потом десятки.', uz: "Avval birliklarni, keyin o'nliklarni ko'paytiring.", en: 'Multiply the units first, then the tens.' }
    }
  },

  s7: {
    eyebrow: { ru: 'Консоль', uz: 'Konsol', en: 'Console' },
    lead: { ru: '328 · 3 — с переходом через десяток', uz: "328 · 3 — o'nlikdan o'tib", en: '328 · 3 — with a carry over the ten' },
    swap_line: '328 · 3',
    cells: [
      { head: { ru: 'единицы', uz: 'birliklar', en: 'ones' }, label: '8 · 3', ans: 24, hint: { ru: 'Восемь умножить на три. Четыре пишем, два десятка в уме.', uz: "Sakkizni uchga ko'paytiring. To'rtni yozamiz, ikki o'nlik dilda.", en: 'Eight times three. We write four and keep two tens in mind.' } },
      { head: { ru: 'десятки и в уме', uz: "o'nliklar va dildagi", en: 'the tens and the carry' }, label: '2 · 3 + 2', ans: 8, hint: { ru: 'Два десятка на три, и прибавь два, которые держали в уме.', uz: "Ikki o'nlik karra uch, ustiga dilda saqlangan ikkini qo'shing.", en: 'Two tens times three, and add the two we kept in mind.' } },
      { head: { ru: 'сотни', uz: 'yuzliklar', en: 'hundreds' }, label: '3 · 3', ans: 9, hint: { ru: 'Три сотни умножить на три.', uz: "Uch yuzlikni uchga ko'paytiring.", en: 'Three hundreds times three.' } }
    ],
    check: '328 · 3 = 984',
    check_label: { ru: 'проверка', uz: 'tekshirish', en: 'check' },
    audio: {
      intro: { ru: 'Триста двадцать восемь умножить на три. Здесь единицы дадут две цифры, и один разряд придётся держать в уме.', uz: "Uch yuz yigirma sakkizni uchga ko'paytiramiz. Bu yerda birliklar ikki raqam beradi, bitta xonani dilda saqlash kerak.", en: 'Three hundred twenty eight times three. Here the units give two digits, and one place will have to be kept in mind.' },
      on_correct: { ru: 'Верно! Девятьсот восемьдесят четыре.', uz: "To'g'ri! To'qqiz yuz sakson to'rt.", en: 'Right! Nine hundred eighty four.' }
    }
  },

  s8: {
    eyebrow: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    q: { ru: 'В столбике потеряли перенос. Где это видно?', uz: "Ustunda o'tkazish yo'qolgan. Qayerdan bilinadi?", en: 'The carry was lost in the column. Where can you see it?' },
    fig_line: '146 · 2 = 282',
    opts: [
      { ru: 'десятки посчитаны без переноса', uz: "o'nliklar o'tkazishsiz sanalgan", en: 'the tens were counted without the carry' },
      { ru: 'единицы посчитаны неверно', uz: "birliklar noto'g'ri sanalgan", en: 'the units were counted wrongly' },
      { ru: 'сотни посчитаны неверно', uz: "yuzliklar noto'g'ri sanalgan", en: 'the hundreds were counted wrongly' },
      { ru: 'ошибки нет', uz: "xato yo'q", en: 'there is no mistake' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Шесть на два двенадцать, и двойка на месте единиц записана верно.', uz: "Olti karra ikki o'n ikki, birliklar o'rnidagi ikki to'g'ri yozilgan.", en: 'Six times two is twelve, and the two in the units place is written correctly.' },
      2: { ru: 'Одна сотня на два это две сотни, тут всё честно.', uz: "Bir yuzlik karra ikki ikki yuzlik, bu joyi to'g'ri.", en: 'One hundred times two is two hundreds, that part is honest.' },
      3: { ru: 'Проверь десятки. Четыре на два восемь, да ещё один десяток из единиц.', uz: "O'nliklarni tekshiring. To'rt karra ikki sakkiz, ustiga birliklardan bitta o'nlik.", en: 'Check the tens. Four times two is eight, and one more ten from the units.' }
    },
    audio: {
      intro: {
        ru: ['Сто сорок шесть умножить на два. Получилось двести восемьдесят два.', 'Один десяток куда-то делся. Найди где.'],
        uz: ["Bir yuz qirq oltini ikkiga ko'paytirishdi. Ikki yuz sakson ikki chiqdi.", "Bitta o'nlik qayoqqadir yo'qolgan. Qayerdaligini toping."],
        en: ['One hundred forty six times two. Two hundred eighty two came out.', 'One ten went missing. Find where.']
      },
      on_correct: { ru: 'Точно! Из единиц пришёл десяток, и десятков стало девять. Правильный ответ двести девяносто два.', uz: "Aniq! Birliklardan bitta o'nlik keldi, o'nliklar to'qqizta bo'ldi. To'g'ri javob ikki yuz to'qson ikki.", en: 'Exactly! A ten came from the units, and the tens became nine. The right answer is two hundred ninety two.' },
      on_wrong: { ru: 'Посчитай каждый разряд по очереди и следи за десятком в уме.', uz: "Har bir xonani navbat bilan sanang va dildagi o'nlikni kuzating.", en: 'Count each place in turn and watch the ten you keep in mind.' }
    }
  },

  s9: {
    eyebrow: { ru: 'Ловушка Бита', uz: 'Bit tuzogi', en: "Bit's trap" },
    lead: { ru: 'Бит начал умножать слева', uz: 'Bit chapdan boshlab ko\'paytirdi', en: 'Bit started multiplying from the left' },
    lines: ['124 · 2', 'сначала сотни, потом единицы'],
    lines_uz: ['124 · 2', 'avval yuzliklar, keyin birliklar'],
    lines_en: ['124 · 2', 'first the hundreds, then the units'],
    line_cap: { ru: 'так ведь тоже получится, говорит Бит', uz: 'shunday ham chiqadi, deydi Bit', en: 'it works this way too, says Bit' },
    trap_label: { ru: 'Прав ли Бит?', uz: 'Bit haqmi?', en: 'Is Bit right?' },
    trap_opts: { ru: ['Верно', 'Неверно'], uz: ["To'g'ri", "Noto'g'ri"], en: ['Right', 'Wrong'] },
    trap_ci: 1,
    trap_correct: {
      ru: 'Точно! Здесь переноса нет, и ответ случайно совпал. Но как только появится перенос, слева направо считать нельзя. Десяток придёт уже после того, как разряд записан.',
      uz: "Aniq! Bu yerda o'tkazish yo'q, javob tasodifan to'g'ri chiqdi. Lekin o'tkazish paydo bo'lishi bilan chapdan o'ngga hisoblab bo'lmaydi. O'nlik xona yozilgandan keyin keladi.",
      en: 'Exactly! There is no carry here, and the answer matched by chance. But as soon as there is a carry, you cannot count from left to right. The ten will arrive after the place is already written.'
    },
    trap_wrong: {
      ru: 'Тут ответ и правда сошёлся, потому что переноса нет. Возьми пример с переносом, и слева направо всё сломается.',
      uz: "Bu yerda javob haqiqatan mos keldi, chunki o'tkazish yo'q. O'tkazishli misolni oling va chapdan o'ngga hammasi buziladi.",
      en: 'Here the answer really did match, because there is no carry. Take an example with a carry and left to right will fall apart.'
    },
    audio: {
      ru: [
        'Бит умножил сто двадцать четыре на два, но начал с сотен и закончил единицами. Говорит, разницы никакой.',
        'Прав ли Бит?'
      ],
      uz: [
        "Bit bir yuz yigirma to'rtni ikkiga ko'paytirdi, lekin yuzliklardan boshlab birliklar bilan tugatdi. Farqi yo'q deydi.",
        "Bit haqmi?"
      ],
      en: ['Bit multiplied one hundred twenty four by two, but started with the hundreds and finished with the units. He says it makes no difference.', 'Is Bit right?']
    }
  },

  s10: {
    eyebrow: { ru: 'Тренажёр', uz: 'Trenajyor', en: 'Trainer' },
    q: { ru: '213 · 3. Набери ответ.', uz: '213 · 3. Javobni tering.', en: '213 · 3. Type the answer.' },
    ans: 639,
    check: '600 + 30 + 9 = 639',
    check_label: { ru: 'проверка', uz: 'tekshirish', en: 'check' },
    hint: { ru: 'Единицы, десятки, сотни. Три на три девять, один на три три, два на три шесть.', uz: "Birliklar, o'nliklar, yuzliklar. Uch karra uch to'qqiz, bir karra uch uch, ikki karra uch olti.", en: 'Units, tens, hundreds. Three times three is nine, one times three is three, two times three is six.' },
    audio: {
      intro: { ru: 'Двести тринадцать умножить на три. Переноса тут не будет.', uz: "Ikki yuz o'n uchni uchga ko'paytiring. Bu yerda o'tkazish bo'lmaydi.", en: 'Two hundred thirteen times three. There will be no carry here.' },
      on_correct: { ru: 'Верно! Шестьсот тридцать девять.', uz: "To'g'ri! Olti yuz o'ttiz to'qqiz.", en: 'Right! Six hundred thirty nine.' }
    }
  },

  s11: {
    eyebrow: { ru: 'Тренажёр', uz: 'Trenajyor', en: 'Trainer' },
    q: { ru: '122 · 4. Набери ответ.', uz: '122 · 4. Javobni tering.', en: '122 · 4. Type the answer.' },
    ans: 488,
    check: '400 + 80 + 8 = 488',
    check_label: { ru: 'проверка', uz: 'tekshirish', en: 'check' },
    hint: { ru: 'Два на четыре восемь, ещё два на четыре восемь, один на четыре четыре.', uz: "Ikki karra to'rt sakkiz, yana ikki karra to'rt sakkiz, bir karra to'rt to'rt.", en: 'Two times four is eight, two times four is eight again, one times four is four.' },
    audio: {
      intro: { ru: 'Сто двадцать два умножить на четыре.', uz: "Bir yuz yigirma ikkini to'rtga ko'paytiring.", en: 'One hundred twenty two times four.' },
      on_correct: { ru: 'Верно! Четыреста восемьдесят восемь.', uz: "To'g'ri! To'rt yuz sakson sakkiz.", en: 'Right! Four hundred eighty eight.' }
    }
  },

  s12: {
    eyebrow: { ru: 'Задача', uz: 'Masala', en: 'Word problem' },
    lead: { ru: 'Задача из мастерской.', uz: 'Ustaxonadan masala.', en: 'A problem from the workshop.' },
    q: { ru: 'В мастерской сделали 154 парты, а столов в 2 раза больше. Сколько парт и столов сделали всего?', uz: "Ustaxonada 154 ta parta, stol esa 2 marta ko'p yasaldi. Jami nechta parta va stol yasalgan?", en: 'The workshop made 154 desks, and 2 times more tables. How many desks and tables were made in all?' },
    q_speech: { ru: 'Сто пятьдесят четыре парты, а столов в два раза больше. Сколько всего?', uz: "Bir yuz ellik to'rtta parta, stol esa ikki marta ko'p. Jami nechta?", en: 'One hundred fifty four desks, and two times more tables. How many in all?' },
    tbl_heads: [
      { ru: 'Парт', uz: 'Parta', en: 'Desks' },
      { ru: 'Столов', uz: 'Stol', en: 'Tables' },
      { ru: 'Всего', uz: 'Jami', en: 'In all' }
    ],
    tbl_cells: ['154', '?', '?'],
    pick_label: { ru: 'Сначала выбери запись', uz: 'Avval yozuvni tanlang', en: 'First choose the line' },
    opts: [
      { ru: '154 · 2 + 154', uz: '154 · 2 + 154', en: '154 · 2 + 154' },
      { ru: '154 · 2', uz: '154 · 2', en: '154 · 2' },
      { ru: '154 + 2', uz: '154 + 2', en: '154 + 2' },
      { ru: '154 · 2 − 154', uz: '154 · 2 − 154', en: '154 · 2 − 154' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Это только столы. Парты тоже считают.', uz: "Bu faqat stollar. Partalar ham hisobga olinadi.", en: 'That is only the tables. The desks are counted too.' },
      2: { ru: 'В два раза больше это не на два больше. Тут умножение.', uz: "Ikki marta ko'p bu ikkitaga ko'p emas. Bu yerda ko'paytirish.", en: 'Two times more is not two more. There is multiplication here.' },
      3: { ru: 'Вычитание уберёт парты, а их надо прибавить.', uz: "Ayirish partalarni olib tashlaydi, ularni esa qo'shish kerak.", en: 'Subtraction takes the desks away, and they have to be added.' }
    },
    pick_ok: { ru: 'Запись верная. Теперь считай по шагам.', uz: "Yozuv to'g'ri. Endi qadamlab hisoblang.", en: 'The line is correct. Now count step by step.' },
    step1_q: { ru: 'Сколько столов?', uz: 'Nechta stol?', en: 'How many tables?' },
    ans1: 308,
    hint1: { ru: 'Сто пятьдесят четыре умножить на два, столбиком.', uz: "Bir yuz ellik to'rtni ikkiga ko'paytiring, ustunda.", en: 'One hundred fifty four times two, in a column.' },
    step2_q: { ru: 'Сколько всего?', uz: 'Jami nechta?', en: 'How many in all?' },
    ans2: 462,
    hint2: { ru: 'К столам прибавь парты.', uz: "Stollarga partalarni qo'shing.", en: 'Add the desks to the tables.' },
    check: '154 + 308 = 462',
    setup_audio: { ru: 'Задача из мастерской. Сто пятьдесят четыре парты, а столов в два раза больше. Сначала выбери запись, потом считай по шагам.', uz: "Ustaxonadan masala. Bir yuz ellik to'rtta parta, stol esa ikki marta ko'p. Avval yozuvni tanlang, keyin qadamlab hisoblang.", en: 'A problem from the workshop. One hundred fifty four desks, and two times more tables. First choose the line, then count step by step.' },
    audio: {
      intro: { ru: 'Тут пригодится и столбик, и внимание к вопросу.', uz: "Bu yerda ustun ham, savolga e'tibor ham kerak bo'ladi.", en: 'Both the column and attention to the question come in handy here.' },
      on_correct: { ru: 'Четыреста шестьдесят два! Триста восемь столов и сто пятьдесят четыре парты.', uz: "To'rt yuz oltmish ikki! Uch yuz sakkizta stol va bir yuz ellik to'rtta parta.", en: 'Four hundred sixty two! Three hundred eight tables and one hundred fifty four desks.' },
      on_wrong: { ru: 'Посчитай ещё раз, по шагам.', uz: 'Yana bir bor, qadamlab hisoblang.', en: 'Count it again, step by step.' }
    }
  },

  s13: {
    eyebrow: { ru: 'Финал', uz: 'Final', en: 'Final' },
    intro_line: { ru: 'Три столбика — и приём твой', uz: 'Uch ustun va usul sizniki', en: 'Three columns and the method is yours' },
    items: [
      {
        kind: 'num',
        q: { ru: '124 · 2. Набери ответ.', uz: '124 · 2. Javobni tering.', en: '124 · 2. Type the answer.' },
        q_speech: { ru: 'Сто двадцать четыре умножить на два.', uz: "Bir yuz yigirma to'rtni ikkiga ko'paytirish.", en: 'One hundred twenty four times two.' },
        ans: 248,
        hint: { ru: 'Четыре на два восемь, два на два четыре, один на два два.', uz: "To'rt karra ikki sakkiz, ikki karra ikki to'rt, bir karra ikki ikki.", en: 'Four times two is eight, two times two is four, one times two is two.' }
      },
      {
        kind: 'mc',
        q: { ru: '133 · 3 = ?', uz: '133 · 3 = ?', en: '133 · 3 = ?' },
        q_speech: { ru: 'Сто тридцать три умножить на три.', uz: "Bir yuz o'ttiz uchni uchga ko'paytirish.", en: 'One hundred thirty three times three.' },
        opt0: { ru: '399', uz: '399', en: '399' },
        opt1: { ru: '369', uz: '369', en: '369' },
        opt2: { ru: '939', uz: '939', en: '939' },
        opt3: { ru: '396', uz: '396', en: '396' },
        wrong_1: { ru: 'Это ответ для ста двадцати трёх. Здесь десятков больше.', uz: "Bu bir yuz yigirma uch uchun javob. Bu yerda o'nliklar ko'proq.", en: 'That is the answer for one hundred twenty three. There are more tens here.' },
        wrong_2: { ru: 'Разряды переставлены. Сотен три, десятков девять, единиц девять.', uz: "Xonalar o'rin almashgan. Yuzlik uchta, o'nlik to'qqizta, birlik to'qqizta.", en: 'The places are swapped round. Three hundreds, nine tens, nine units.' },
        wrong_3: { ru: 'Единицы посчитаны неверно. Три на три это девять.', uz: "Birliklar noto'g'ri sanalgan. Uch karra uch to'qqiz.", en: 'The units were counted wrongly. Three times three is nine.' }
      },
      {
        kind: 'mc',
        q: { ru: '111 · 8 = ?', uz: '111 · 8 = ?', en: '111 · 8 = ?' },
        q_speech: { ru: 'Сто одиннадцать умножить на восемь.', uz: "Bir yuz o'n birni sakkizga ko'paytirish.", en: 'One hundred eleven times eight.' },
        opt0: { ru: '888', uz: '888', en: '888' },
        opt1: { ru: '188', uz: '188', en: '188' },
        opt2: { ru: '818', uz: '818', en: '818' },
        opt3: { ru: '8888', uz: '8888', en: '8888' },
        wrong_1: { ru: 'Сотню тоже умножают. Одна сотня на восемь это восемь сотен.', uz: "Yuzlik ham ko'paytiriladi. Bir yuzlik karra sakkiz sakkiz yuzlik.", en: 'The hundred is multiplied too. One hundred times eight is eight hundreds.' },
        wrong_2: { ru: 'Десятки пропущены. Один десяток на восемь это восемь десятков.', uz: "O'nliklar tashlab ketilgan. Bir o'nlik karra sakkiz sakkiz o'nlik.", en: 'The tens were skipped. One ten times eight is eight tens.' },
        wrong_3: { ru: 'Цифр стало больше, чем нужно. Разряда всего три.', uz: "Raqamlar keragidan ko'p bo'lib ketdi. Xona jami uchta.", en: 'There are more digits than needed. There are only three places.' }
      }
    ],
    fact_badge: { ru: 'Знаешь ли ты?', uz: 'Bilasizmi?', en: 'Which line is wrong?' },
    fact_text: {
      ru: 'Столбику примерно тысяча двести лет. Его описал учёный аль-Хорезми, который жил в Хорезме, и от его имени пошло слово алгоритм. Алгоритм это точный порядок шагов, который приводит к ответу всегда, а не только у того, кто хорошо считает в уме. Столбик и есть такой порядок: единицы, десятки, сотни, и перенос на своё место.',
      uz: "Ustunga taxminan bir yarim ming yil. Uni Xorazmda yashagan olim al-Xorazmiy tavsiflagan, uning nomidan algoritm so'zi kelib chiqqan. Algoritm bu javobga doim olib keladigan aniq qadamlar tartibi, faqat og'zaki yaxshi hisoblaydigan odam uchun emas. Ustun ham ana shunday tartib: birliklar, o'nliklar, yuzliklar va o'tkazish o'z o'rniga.",
      en: 'The column is about twelve hundred years old. It was described by the scholar al-Khwarizmi, who lived in Khorezm, and the word algorithm comes from his name. An algorithm is an exact order of steps that always leads to the answer, not only for someone who is good at counting in their head. The column is exactly such an order: units, tens, hundreds, and the carry in its place.'
    },
    fact_audio: {
      ru: 'Столбику примерно тысяча двести лет. Его описал учёный аль-Хорезми, который жил в Хорезме, и от его имени пошло слово алгоритм. Алгоритм это точный порядок шагов, который приводит к ответу всегда, а не только у того, кто хорошо считает в уме. Столбик и есть такой порядок. Единицы, десятки, сотни, и перенос на своё место. Ты сегодня научился древнему приёму, которым пользуется весь мир.',
      uz: "Ustunga taxminan bir yarim ming yil. Uni Xorazmda yashagan olim al-Xorazmiy tavsiflagan, uning nomidan algoritm so'zi kelib chiqqan. Algoritm bu javobga doim olib keladigan aniq qadamlar tartibi, faqat og'zaki yaxshi hisoblaydigan odam uchun emas. Ustun ham ana shunday tartib. Birliklar, o'nliklar, yuzliklar va o'tkazish o'z o'rniga. Siz bugun butun dunyo ishlatadigan qadimiy usulni o'rgandingiz.",
      en: 'The column is about twelve hundred years old. It was described by the scholar al-Khwarizmi, who lived in Khorezm, and the word algorithm comes from his name. An algorithm is an exact order of steps that always leads to the answer, not only for someone who is good at counting in their head. The column is exactly such an order. Units, tens, hundreds, and the carry in its place. Today you learned an ancient method that the whole world uses.'
    },
    audio: {
      intro: { ru: 'Финальная проверка, три примера.', uz: 'Yakuniy tekshiruv, uch misol.', en: 'The final check, three examples.' },
      on_correct: { ru: 'Верно!', uz: "To'g'ri!", en: 'Correct!' },
      on_wrong: { ru: 'Считай справа налево и не забывай перенос.', uz: "O'ngdan chapga hisoblang va o'tkazishni unutmang.", en: 'Count from right to left and do not forget the carry.' }
    }
  },

  s14: {
    eyebrow: { ru: 'Итог', uz: 'Yakun', en: 'Result' },
    mission_done: { ru: 'Записи стали короткими, а ответы точными!', uz: 'Yozuvlar qisqardi, javoblar aniq!', en: 'The lines got short and the answers exact!' },
    cando: { ru: 'Теперь ты умножаешь столбиком и не теряешь перенос.', uz: "Endi siz ustunda ko'paytirasiz va o'tkazishni yo'qotmaysiz.", en: 'Now you multiply in a column and do not lose the carry.' },
    rule_recap: {
      ru: '123 · 3 = 369. Второй множитель под единицами, считаем справа налево, перенос над своим разрядом.',
      uz: "123 · 3 = 369. Ikkinchi ko'paytuvchi birliklar tagida, o'ngdan chapga hisoblaymiz, o'tkazish o'z xonasi ustida.",
      en: '123 · 3 = 369. The second factor under the units, we count from right to left, the carry above its own place.'
    },
    conn_label_refs: { ru: 'опирается на', uz: 'tayanadi', en: 'builds on' },
    conn_refs: { ru: 'урок 11: умножение суммы; урок 17: умножение по частям', uz: "11-dars: yig'indini ko'paytirish; 17-dars: qismlab ko'paytirish", en: 'lesson 11: multiplying a sum; lesson 17: multiplying by parts' },
    conn_label_next: { ru: 'дальше', uz: 'keyingi', en: 'next' },
    conn_next: { ru: 'умножение двузначного на двузначное', uz: "ikki xonalini ikki xonaliga ko'paytirish", en: 'multiplying a two-digit number by a two-digit number' },
    audio: {
      ru: 'Записи стали короткими, а ответы точными. Запомни главное. Второй множитель пишем под единицами, считаем справа налево, а перенос ставим над своим разрядом. В следующий раз возьмём два двузначных числа сразу!',
      uz: "Yozuvlar qisqardi, javoblar aniq bo'ldi. Asosiysini eslab qoling. Ikkinchi ko'paytuvchini birliklar tagiga yozamiz, o'ngdan chapga hisoblaymiz, o'tkazishni o'z xonasi ustiga qo'yamiz. Keyingi safar ikkita ikki xonali sonni birga olamiz!",
      en: 'The lines got short and the answers exact. Remember the main thing. We write the second factor under the units, we count from right to left, and we put the carry above its own place. Next time we will take two two-digit numbers at once!'
    }
  }
};

// v9 KO'PRIK — ekranda ko'rinmaydi, faqat ovozda (brgSeg orqali birinchi segment).
const BRIDGES = {
  s1:  { ru: 'Начнём с того, что умеем.', uz: 'Bilganimizdan boshlaymiz.', en: 'Let us start with what we can do.' },
  s2:  { ru: 'А теперь короче.', uz: 'Endi qisqaroq.', en: 'And now shorter.' },
  s3:  { ru: "Соберём это в правило.", uz: "Buni qoidaga yig'amiz.", en: 'Let us gather this into a rule.' },
  s4:  { ru: 'Кто-то сдвинул запись.', uz: 'Kimdir yozuvni siljitib yubordi.', en: 'Someone shifted the writing.' },
  s5:  { ru: 'Разложи по полкам.', uz: 'Tokchalarga ajrating.', en: 'Lay them out on the shelves.' },
  s6:  { ru: 'Быстрый вопрос.', uz: 'Tez savol.', en: 'A quick question.' },
  s7:  { ru: 'Теперь с переносом.', uz: "Endi o'tkazish bilan.", en: 'Now with a carry.' },
  s8:  { ru: 'Один десяток потерялся.', uz: "Bitta o'nlik yo'qoldi.", en: 'One ten got lost.' },
  s9:  { ru: 'А вот и Бит со своим порядком.', uz: "Mana Bit ham o'z tartibi bilan.", en: 'And here is Bit with his order.' },
  s10: { ru: 'Теперь считай сам.', uz: "Endi o'zingiz hisoblang.", en: 'Now count on your own.' },
  s11: { ru: 'И ещё один столбик.', uz: 'Yana bitta ustun.', en: 'And one more column.' },
  s12: { ru: 'Задача из мастерской.', uz: 'Ustaxonadan masala.', en: 'A problem from the workshop.' },
  s13: { ru: 'Финальная проверка.', uz: 'Yakuniy tekshiruv.', en: 'The final check.' },
  s14: { ru: 'Записи готовы. Идём дальше!', uz: 'Yozuvlar tayyor. Davom etamiz!', en: 'The lines are ready. Let us move on!' }
};

// s14 payoff (xulosadan oldin aytiladi)
const S14_PAYOFF = {
  ru: 'Миссия выполнена! Все записи сделаны столбиком, и ни один разряд не потерялся. Спасибо за помощь!',
  uz: "Missiya bajarildi! Barcha yozuvlar ustunda qilindi, birorta xona yo'qolmadi. Yordamingiz uchun rahmat!",
  en: 'Mission complete! All the lines are written in a column, and not a single place got lost. Thank you for your help!'
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



// --- USTUN TERMINALI (D21): blokning umumiy foni SAQLANADI, ishchi tugun BOSHQA:
// xonalar bo'yicha chiziqli tablo — yuqorida son, ostida ko'paytuvchi, tag chizig'i va
// natija; tepada o'tkazish uchun kichik oyna.
const ColumnBg = () => {
  const lang = useLang();
  return (
  <svg className="lm-scene-bg" viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="d21wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ECDBC4"/><stop offset="100%" stopColor="#DBC3A2"/></linearGradient>
      <linearGradient id="d21sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#BCE4F7"/><stop offset="58%" stopColor="#E4F3FB"/><stop offset="100%" stopColor="#F6EFD6"/></linearGradient>
      <linearGradient id="d21floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#D9C29D"/><stop offset="100%" stopColor="#BBA078"/></linearGradient>
      <linearGradient id="d21board" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FFF8EF"/><stop offset="100%" stopColor="#F1E2C6"/></linearGradient>
      <radialGradient id="d21sun" cx="50%" cy="50%" r="55%"><stop offset="0%" stopColor="#FFF8DC"/><stop offset="52%" stopColor="#FFE49A" stopOpacity="0.9"/><stop offset="100%" stopColor="#FFD36A" stopOpacity="0"/></radialGradient>
      <radialGradient id="d21lamp" cx="50%" cy="20%" r="80%"><stop offset="0%" stopColor="#FFF0C4"/><stop offset="100%" stopColor="#FFE39A" stopOpacity="0"/></radialGradient>
      <clipPath id="d21winClip"><rect x="46" y="32" width="308" height="62" rx="4"/></clipPath>
    </defs>
    <rect x="0" y="0" width="400" height="180" fill="url(#d21wall)"/>
    <rect x="0" y="0" width="400" height="22" fill="#D2B892"/><rect x="0" y="21" width="400" height="3" fill="#B4976F"/>
    {[90, 200, 310].map((cx, i) => (
      <g key={`lm${i}`}>
        <rect x={cx - 18} y="4" width="36" height="6" rx="3" fill="#FFEBB0"/>
        <polygon points={`${cx - 20},11 ${cx + 20},11 ${cx + 46},96 ${cx - 46},96`} fill="url(#d21lamp)" opacity="0.26"/>
        <ellipse className="lm-glow" style={{ animationDelay: `${i * 0.7}s` }} cx={cx} cy="12" rx="14" ry="4" fill="#FFF0C4" opacity="0.5"/>
      </g>
    ))}
    <rect x="42" y="28" width="316" height="70" rx="7" fill="#0D1928"/>
    <rect x="46" y="32" width="308" height="62" rx="4" fill="url(#d21sky)"/>
    <g clipPath="url(#d21winClip)">
      <circle cx="96" cy="48" r="20" fill="url(#d21sun)"/><circle cx="96" cy="48" r="7" fill="#FFF3C4"/>
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
    {/* USTUN TABLOSI */}
    <rect x="120" y="106" width="160" height="66" rx="7" fill="url(#d21board)" stroke="#C9B79A" strokeWidth="2.4"/>
    <text x="200" y="103" textAnchor="middle" fontSize="7" letterSpacing="1.4" fill="#8A7452" fontFamily="'JetBrains Mono', monospace">{tri(lang, 'СТОЛБИК', 'USTUN', 'THE COLUMN')}</text>
    {/* o'tkazish oynasi */}
    <rect x="188" y="110" width="16" height="12" rx="3" fill="#FFF3E9" stroke="#FF4F28" strokeWidth="1.2"/>
    <text x="196" y="119.5" textAnchor="middle" fontSize="8" fontWeight="800" fill="#FF4F28" fontFamily="'JetBrains Mono', monospace">2</text>
    <text x="252" y="136" textAnchor="end" fontSize="17" fontWeight="800" fill="#3A3530" fontFamily="'JetBrains Mono', monospace">328</text>
    <text x="252" y="152" textAnchor="end" fontSize="17" fontWeight="800" fill="#3A3530" fontFamily="'JetBrains Mono', monospace">3</text>
    <text x="214" y="152" textAnchor="middle" fontSize="14" fontWeight="800" fill="#8A8378" fontFamily="'JetBrains Mono', monospace">·</text>
    <rect x="204" y="156" width="48" height="2.4" rx="1.2" fill="#3A3530"/>
    <text x="252" y="170" textAnchor="end" fontSize="17" fontWeight="800" fill="#1F7A4D" fontFamily="'JetBrains Mono', monospace">984</text>
    {/* chapda daftar, o'ngda qalam-stakan */}
    <g transform="translate(24 118)">
      <rect x="0" y="0" width="52" height="54" rx="4" fill="#FBF7F0" stroke="#C9B79A" strokeWidth="1.6"/>
      {[0, 1, 2, 3].map((k) => <rect key={k} x="7" y={10 + k * 11} width="38" height="2" rx="1" fill="#DCCDB0"/>)}
    </g>
    <g transform="translate(322 126)">
      <rect x="0" y="14" width="34" height="32" rx="4" fill="#C3A87E" stroke="#9A8058" strokeWidth="1.2"/>
      {[0, 1, 2].map((k) => (
        <g key={k} transform={`translate(${7 + k * 10} 0)`}>
          <rect x="0" y="2" width="4" height="16" rx="1.4" fill={['#F2A85C', '#6FD0E4', '#A6D8C2'][k]}/>
          <path d="M0 2 l2 -4 l2 4 Z" fill="#8A7452"/>
        </g>
      ))}
    </g>
    <rect x="0" y="176" width="400" height="54" fill="url(#d21floor)"/>
    <line x1="0" y1="176" x2="400" y2="176" stroke="#9A8058" strokeWidth="2"/>
    <g stroke="#A98C64" strokeWidth="1" opacity="0.4"><path d="M20 230 L176 178"/><path d="M120 230 L192 178"/><path d="M280 230 L208 178"/><path d="M380 230 L224 178"/></g>
    <g transform="translate(16 176)"><path d="M0 0 Q-3 -16 0 -24" stroke="#7CB69E" strokeWidth="2.6" fill="none"/><circle className="lm-glow" cx="0" cy="-27" r="5" fill="#A6E0C6"/></g>
    <g transform="translate(392 176)"><path d="M0 0 Q-2 -10 0 -15" stroke="#7CB69E" strokeWidth="2.2" fill="none"/><circle className="lm-glow" cx="0" cy="-17" r="3.6" fill="#A6E0C6"/></g>
  </svg>
  );
};

const ColumnScene = ({ gathered = false }) => {
  const kid = ({ key, El, hook }, i) => (
    <span key={key} className="lm-crew lm-crew-kid g1-pop-in" style={{ animationDelay: `${0.25 + i * 0.12}s` }}>
      <El {...(gathered ? { mood: 'happy', pose: 'happy' } : hook)}/>
    </span>
  );
  return (
    <div className="lm-scene">
      <ColumnBg/>
      <div className="lm-scene-cast">
        {LUMO_CAST.slice(0, 2).map(kid)}
        <span className={`lm-crew lm-crew-host ${gathered ? 'd2-bit-cheer' : 'lm-bob'}`}><span className="g1-cast-fig"><BitSVG state={gathered ? 'happy' : 'present'}/></span></span>
        {LUMO_CAST.slice(2).map((c, i) => kid(c, i + 2))}
      </div>
    </div>
  );
};
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

// ============================================================
// DARS12 EKRANLARI (15). Donor: Dars10 (barcha yangi naqshlar bilan).
// YANGI: PathRow/SplitArray (yo'lak kesish) va ColumnMulDemo (ustun 23x4, o'tkazish).
// ============================================================





// --- KONSOL YACHEYKASI (1-darsdan ko'chirilgan `.lm-cons*` uslubi, 15-darsning komponenti):
// `label` berilsa ekranchada YOZUV ko'rsatiladi (10 · 7), tagida terilgan javob yoki «?».
const MeasureCell = ({ head, n = 8, badge, val, lit = false, label = null }) => {
  const t = useT();
  return (
  <div className={`lm-cons ${lit ? 'lm-cons-lit' : ''}`}>
    {head ? <div className="lm-cons-head mono">{head}</div> : null}
    <div className="lm-cons-screen">
      {label !== null ? (
        <span className="mono d16-plate">{t(label)}</span>
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
};





// --- USTUN (13-darsdan ko'chirilgan `ColumnCalc`, matni o'zgarmagan): har satr = BELGI
// sloti (ikki monoshrift belgisi) va TANA, shuning uchun raqamlar xona ostiga aniq tushadi.
// carries: [k] — zaxira raqami k-xona USTIDA.
const ColumnCalc = ({ w = 3, sign, top, bot, res, carries = [], show = true }) => (
  <div className="d14-col mono" aria-hidden="true">
    <div className="d14-colr-carry" style={{ width: `${w + 2}ch` }}>
      {carries.map((k) => (
        <span key={k} className="d14-carry lm-reveal" style={{ left: `${k + 2.5}ch` }}>1</span>
      ))}
    </div>
    <div className="d14-colr"><span className="d14-col-slot">{'  '}</span>{top}</div>
    <div className="d14-colr"><span className="d14-col-slot d14-col-sign">{`${sign} `}</span>{bot}</div>
    <div className="d14-col-rule" style={{ width: `${w + 2}ch` }}/>
    <div className={`d14-colr${show ? ' d14-col-hot' : ''}`}><span className="d14-col-slot">{'  '}</span>{show ? res : ' '.repeat(w)}</div>
  </div>
);

// --- FACTCARD QAHRAMONI: al-Xorazmiy qo'lyozmasi va «algoritm» so'zi.
const AlgoFig = () => {
  const lang = useLang();
  return (
  <svg viewBox="0 0 220 116" style={{ width: 'min(268px, 84%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <defs>
      <linearGradient id="d21scroll" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FFF6E9"/><stop offset="100%" stopColor="#EFDFC0"/></linearGradient>
    </defs>
    <rect x="30" y="14" width="118" height="76" rx="8" fill="url(#d21scroll)" stroke="#C9B79A" strokeWidth="2.4"/>
    <g stroke="#C0A87E" strokeWidth="1.6" opacity="0.75">
      {[26, 36, 46, 56, 66].map((y) => <line key={y} x1="42" y1={y} x2="118" y2={y}/>)}
    </g>
    <text x="89" y="82" textAnchor="middle" fontSize="9" fontWeight="800" fill="#8A7452" fontFamily="'JetBrains Mono', monospace">{tri(lang, 'аль-Хорезми', 'al-Xorazmiy', 'al-Khwarizmi')}</text>
    {[0, 1, 2].map((k) => (
      <g key={k} className="d21-step" style={{ animationDelay: `${k * 0.8}s` }}>
        <circle cx="168" cy={28 + k * 26} r="11" fill="#FFF3E9" stroke="#FF4F28" strokeWidth="2"/>
        <text x="168" y={32 + k * 26} textAnchor="middle" fontSize="10" fontWeight="800" fill="#FF4F28" fontFamily="'JetBrains Mono', monospace">{k + 1}</text>
      </g>
    ))}
    <text x="168" y="104" textAnchor="middle" fontSize="8.5" fontWeight="800" fill="#8A8378" fontFamily="'JetBrains Mono', monospace">{tri(lang, 'алгоритм', 'algoritm', 'algorithm')}</text>
  </svg>
  );
};
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
          {figLine && <span className="mono d21-errline">{t(figLine)}</span>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(100px, 1fr))', gap: 10, width: '100%' }}>
            {order.map((k, i) => (
              <button key={i} className={`option ${solved && i === ci ? 'option-correct' : ''} ${wrongSet.has(i) ? 'option-picked-wrong' : ''}`}
                disabled={!canAct || solved || wrongSet.has(i)} onClick={() => pick(i)}
                style={{ padding: 'clamp(9px, 1.5vw, 12px)', fontSize: mono ? 'clamp(15px, 2.5vw, 20px)' : 'clamp(12px, 1.8vw, 15px)', minHeight: 'clamp(44px, 6.2vw, 54px)', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: mono ? "'JetBrains Mono', monospace" : undefined }}>{t(c.opts[k])}</button>
            ))}
          </div>
          {hintMsg && !solved && <p className="lm-hint-bad fade-up">{t(hintMsg)}</p>}
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
  const [numState, setNumState] = useState(null);   // ekranda KO'RINADIGAN javob holati
  const [hintMsg, setHintMsg] = useState(null);
  const [solved, setSolved] = useState(props.storedAnswer !== undefined);
  const firstRef = useRef(props.storedAnswer ? props.storedAnswer.firstTry : true);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const check = () => {
    if (!canAct || numLock || val === '' || solved) return;
    setNumLock(true);
    const isOk = parseInt(val, 10) === c.ans;
    setNumState(isOk ? 'ok' : 'bad');
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((isOk ? c.audio.on_correct : c.hint)[lang]); }
    if (isOk) { setSolved(true); sfx.playCorrect(); setHintMsg(null); }
    else { firstRef.current = false; setHintMsg(c.hint); setTimeout(() => { setVal(''); setNumLock(false); setNumState(null); }, 1500); }
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
          <NumPad value={solved ? String(c.ans) : val} setValue={(u) => { setNumState(null); setVal(u); }} disabled={!canAct || numLock || solved} max={3} state={numState}/>
          {!solved && <button className="btn-white-accent" disabled={!canAct || numLock || val === ''} onClick={check}>{tri(lang, 'Проверить', 'Tekshiring', 'Check')}</button>}
          {solved && <CheckStrip expr={c.check} cap={t(c.check_label)} ok/>}
          {hintMsg && !solved && <p className="lm-hint-bad fade-up">{t(hintMsg)}</p>}
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
        <div className="frame fade-up delay-1 d21-hook-scene" style={{ padding: 'clamp(8px, 1.8vw, 14px)', overflow: 'hidden' }}>
          <ColumnScene gathered={ok}/>
        </div>
        {picked === null && (
          <div className="frame fade-up delay-1" style={{ padding: 'clamp(6px, 1.2vw, 9px)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <span className="d21-order">
              <span className="mono d21-order-plate">11</span>
              <span className="d21-order-sep mono">:</span>
              <span className="mono d21-order-plate">2</span>
            </span>
            <span className="d21-note">{t(c.order_cap)}</span>
          </div>
        )}
        <p className="fade-up delay-1" style={{ textAlign: 'center', color: T.ink2, fontWeight: 600, fontSize: 'clamp(13px, 1.8vw, 16px)', margin: 0 }}>{t(c.q)}</p>
        {picked === null && (
          <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
            {order.map((k, i) => (
              <button key={i} className="option" disabled={!canAct} onClick={() => pick(i)}
                style={{ padding: 'clamp(9px, 1.4vw, 12px)', fontSize: 'clamp(12.5px, 2vw, 16px)', minHeight: 'clamp(44px, 6.2vw, 54px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, textAlign: 'center' }}>
                {t(opts[k])}
              </button>
            ))}
          </div>
        )}
        {picked !== null && (
          <div className="fade-up" style={{ display: 'flex', justifyContent: 'center' }}>
            <button className={`option ${ok ? 'option-correct' : 'option-picked-wrong'}`} disabled
              style={{ padding: 'clamp(10px, 1.5vw, 12px) clamp(16px, 2.4vw, 22px)', fontSize: 'clamp(13px, 2vw, 17px)', minHeight: 'clamp(44px, 6.2vw, 54px)', width: 'auto', display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800 }}>
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

// s1 — XONALAR BO'YICHA: tanish usul (darslik 45-bet, a bandi)
const Screen1 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s1;
  const audio = useAudio([
    brgSeg('s1', lang),
    { id: 's1_0', text: c.audio[lang][0], trigger: 'after_previous', waits_for: null },
    { id: 's1_1', text: c.audio[lang][1], trigger: 'on_event:step1', waits_for: null },
    { id: 's1_2', text: c.audio[lang][2], trigger: 'on_event:step2', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const { step, done, advance } = useTapSteps(audio, 3);
  const tap = () => { if (!canAct || done) return; sfx.playCorrect(); advance(); };
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1.4vw, 10px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(6px, 1.4vw, 10px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
          <FrameFx/>
          <span className="mono d21-plate">{pickSib(c, 'task_line', lang)}</span>
          {step >= 1 && (
            <span className="lm-reveal" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <span className="mono d21-expr">{t(c.step1)}</span>
              <span className="d21-note">{t(c.step1_cap)}</span>
            </span>
          )}
          {step >= 2 && (
            <span className="lm-reveal" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <span className="mono d21-expr">{t(c.step2)}</span>
              <span className="d21-note">{t(c.step2_cap)}</span>
            </span>
          )}
          {step >= 2 && <span className="mono d21-final lm-reveal" style={{ animationDelay: '0.25s' }}>{t(c.res)}</span>}
          {!done && (
            <button className="btn-white-accent" disabled={!canAct} onClick={tap}
              style={{ fontSize: 'clamp(13px, 2.1vw, 16px)' }}>{t(step === 0 ? c.btn1 : c.btn2)}</button>
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

// s2 — USTUN QADAMLAB: o'sha 123 · 3, endi ustunda (13-darsning ColumnCalc'i).
// Har tapda bitta xona ko'paytiriladi va natija o'z ustuniga tushadi.
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
  const cur = c.steps[step];
  // bo'sh o'rinlar pastki chiziqcha bilan yozilgan (`__9`), ekranda esa probel bo'lishi kerak
  const res = (cur.res || '').split('_').join(' ');
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1.4vw, 10px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(6px, 1.4vw, 10px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
          <FrameFx/>
          <span className="d21-note">{t(c.book_note)}</span>
          <div className="d21-colwrap">
            <ColumnCalc w={3} sign="·" top={c.top} bot={`  ${c.bot}`} res={res} show={step > 0}/>
            <span className="d21-note lm-reveal" key={step}>{t(cur.cap)}</span>
          </div>
          {!done && (
            <button className="btn-white-accent" disabled={!canAct} onClick={tap}
              style={{ fontSize: 'clamp(13px, 2.1vw, 16px)' }}>{t(c.btn)}</button>
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
          {hintMsg && !solved && <p className="lm-hint-bad fade-up">{t(hintMsg)}</p>}
        </div>
        {solved && (
          <div ref={revealRef} className="d2-rulecard fade-up">
            <span className="d2-rulecard-badge mono">{t(c.eyebrow)}</span>
            <div className="d15-rulelines">
              {c.rule_lines[lang].map((l, i) => <span key={i} className="d15-ruleline lm-reveal" style={{ animationDelay: `${i * 0.18}s` }}>{l}</span>)}
              <span className="mono d15-ruleex lm-reveal" style={{ animationDelay: '0.54s' }}>{t(c.rule_ex)}</span>
            </div>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s4 — XATONI TOP: tekshirishda qoldiq unutilgan (rasm yo'q, faqat yozuv)
const Screen4 = (props) => <MCOne props={props} ck="s4" figLine={CONTENT.s4.fig_line}/>;

// s5 — SARALASH: tekis bo'linadi yoki qoldiq bilan
const Screen5 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s5;
  const audio = useAudio([
    brgSeg('s5', lang),
    { id: 's5_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
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
            <div className="mono fade-up" style={{ textAlign: 'center', color: T.accent, fontWeight: 800 }}>{lang === 'ru' ? `Задание ${Math.min(idx + 1, c.items.length)} из ${c.items.length}` : `${Math.min(idx + 1, c.items.length)}-topshiriq, jami ${c.items.length}`}</div>
            <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
            <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(8px, 1.8vw, 12px)', padding: 'clamp(12px, 2.4vw, 18px)' }}>
              <FrameFx/>
              <div className="lm-digtray">
                {okBin === null
                  ? <button className={`lm-digchip mono ${sel ? 'lm-digchip-sel' : ''}`} disabled={!canAct || done} onClick={() => setSel(true)}>{it.n}</button>
                  : <span className="lm-digtray-empty mono">{it.n}</span>}
              </div>
              <div className="d21-bins">
                {bin('a', c.bin_a)}
                {bin('b', c.bin_b)}
              </div>
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

// s6 — TEST: 25 : 2, nechtasi ortadi
const Screen6 = (props) => <MCOne props={props} ck="s6" mono/>;

// s7 — KONSOL: 38 : 3, bo'linma va qoldiq
const Screen7 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s7;
  const audio = useAudio([
    brgSeg('s7', lang),
    { id: 's7_intro', text: c.audio.intro[lang], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [phase, setPhase] = useState(props.storedAnswer ? c.cells.length : 0);
  const [val, setVal] = useState('');
  const [numLock, setNumLock] = useState(false);
  const [numState, setNumState] = useState(null);   // ekranda KO'RINADIGAN javob holati
  const [hintMsg, setHintMsg] = useState(null);
  const firstRef = useRef(props.storedAnswer ? props.storedAnswer.firstTry : true);
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const solved = phase >= c.cells.length;
  const cell = c.cells[Math.min(phase, c.cells.length - 1)];
  const check = () => {
    if (!canAct || numLock || val === '' || solved) return;
    setNumLock(true);
    const isOk = parseInt(val, 10) === cell.ans;
    setNumState(isOk ? 'ok' : 'bad');
    const last = phase + 1 >= c.cells.length;
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(isOk ? (last ? c.audio.on_correct[lang] : nextPraise(lang)) : cell.hint[lang]); }
    if (isOk) {
      sfx.playCorrect(); setHintMsg(null);
      setTimeout(() => { setVal(''); setNumLock(false); setNumState(null); setPhase((p) => p + 1); }, last ? 400 : 900);
    } else {
      firstRef.current = false;
      setHintMsg(cell.hint);
      setTimeout(() => { setVal(''); setNumLock(false); setNumState(null); }, 1500);
    }
  };
  useEffect(() => {
    if (solved && !recorded) {
      setRecorded(true);
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: t(c.lead),
        correctAnswer: '12', studentAnswer: '12', correct: firstRef.current,
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
          <span className="mono d21-expr">{t(c.swap_line)}</span>
          <div className={`lm-console${c.cells.length === 3 ? ' lm-console-3' : ''}`} style={{ gridTemplateColumns: `repeat(${gridCols(c.cells.length)}, 1fr)`, maxWidth: c.cells.length === 4 ? 320 : 520 }}>
            {c.cells.map((cl, i) => (
              <MeasureCell key={i} head={t(cl.head)} label={cl.label} val={phase > i ? String(cl.ans) : null} lit={phase === i}/>
            ))}
          </div>
          {!solved && (
            <>
              <NumPad value={val} setValue={setVal} disabled={!canAct || numLock} max={2} state={numState}/>
              <button className="btn-white-accent" disabled={!canAct || numLock || val === ''} onClick={check}>{tri(lang, 'Проверить', 'Tekshiring', 'Check')}</button>
            </>
          )}
          {solved && <CheckStrip expr={c.check} cap={t(c.check_label)} ok/>}
          {hintMsg && !solved && <p className="lm-hint-bad fade-up">{t(hintMsg)}</p>}
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

// s8 — XATONI TOP: 53 : 4 = 12 (qold. 5)
const Screen8 = (props) => <MCOne props={props} ck="s8" figLine={CONTENT.s8.fig_line}/>;

// s9 — BIT TUZOG'I: «javob chiroyli, tekshirish shart emas» (yopiq maydon)
const Screen9 = (props) => {
  const lang = useLang();
  const t = useT();
  const sfx = useSfx();
  const c = CONTENT.s9;
  const audio = useAudio([
    brgSeg('s9', lang),
    { id: 's9_0', text: c.audio[lang][0], trigger: 'after_previous', waits_for: null },
    { id: 's9_1', text: c.audio[lang][1], trigger: 'after_previous', waits_for: null }
  ]);
  const canAct = useCanAnswer(audio);
  const [trapPick, setTrapPick] = useState(null);
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const [recorded, setRecorded] = useState(props.storedAnswer !== undefined);
  const firstRef = useRef(true);
  const solved = trapPick === c.trap_ci || props.storedAnswer?.correct === true;
  const pickTrap = (i) => {
    if (!canAct || solved || wrongSet.has(i)) return;
    if (i === c.trap_ci) {
      setTrapPick(i); sfx.playCorrect();
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.trap_correct[lang]); }
    } else {
      const n = new Set(wrongSet); n.add(i); setWrongSet(n);
      firstRef.current = false;
      if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(c.trap_wrong[lang]); }
    }
  };
  useEffect(() => {
    if (solved && !recorded) {
      setRecorded(true);
      props.onAnswer({
        stage: SCREEN_META[props.screen].scope, screenIdx: props.screen, question: t(c.trap_label),
        correctAnswer: c.trap_opts[lang][c.trap_ci], studentAnswer: c.trap_opts[lang][c.trap_ci], correct: firstRef.current,
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
  const lines = pickSib(c, 'lines', lang);
  return (
    <Stage eyebrow={c.eyebrow} screen={props.screen} totalScreens={TOTAL_SCREENS} navContent={navContent} audioState={audio}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1.4vw, 10px)' }}>
        <h1 className="title h-sub fade-up">{t(c.lead)}</h1>
        <div className="frame fade-up delay-1" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(6px, 1.4vw, 10px)', padding: 'clamp(14px, 2.6vw, 20px)' }}>
          <FrameFx/>
          <span className="mono d21-plate">{lines[0]}</span>
          <span className="d21-bad">{lines[1]}</span>
          <span className="d21-note">{t(c.line_cap)}</span>
          <p className="fade-up" style={{ margin: 0, textAlign: 'center', color: T.ink2, fontWeight: 700 }}>{t(c.trap_label)}</p>
          <div className="d21-trap">
            {c.trap_opts[lang].map((o, i) => (
              <button key={i} className={`option ${solved && i === c.trap_ci ? 'option-correct' : ''} ${wrongSet.has(i) ? 'option-picked-wrong' : ''}`}
                disabled={!canAct || solved || wrongSet.has(i)} onClick={() => pickTrap(i)}
                style={{ padding: 'clamp(10px, 1.6vw, 13px) clamp(16px, 2.4vw, 22px)', fontSize: 'clamp(14px, 2.2vw, 18px)', minHeight: 'clamp(44px, 6.2vw, 54px)', fontWeight: 800 }}>{o}</button>
            ))}
          </div>
        </div>
        {solved && (
          <div ref={revealRef} className="frame-success reveal-soft">
            <Reaction state="correct" praise={t(c.trap_correct)}/>
          </div>
        )}
      </div>
    </Stage>
  );
};

// s10 — TRENAJYOR: ko'paytirishni bo'lish bilan tekshirish (96 : 8)
const Screen10 = (props) => <NumOne props={props} ck="s10"/>;

// s11 — TRENAJYOR NumPad: 53 : 4
const Screen11 = (props) => <NumOne props={props} ck="s11"/>;

// s12 — MASALA: 74 : 6, yashiklar va ortiqcha detallar
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
  const [numState, setNumState] = useState(null);   // ekranda KO'RINADIGAN javob holati
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
    setNumState(isOk ? 'ok' : 'bad');
    const last = stepNum === 1;
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff(isOk ? (last ? c.audio.on_correct[lang] : nextPraise(lang)) : stepHint[lang]); }
    if (isOk) {
      sfx.playCorrect(); setHintMsg(null);
      if (last) { setSolved(true); }
      else { setTimeout(() => { setVal(''); setNumLock(false); setNumState(null); setStepNum(1); }, 900); }
    } else {
      firstRef.current = false;
      setHintMsg(stepHint);
      setTimeout(() => { setVal(''); setNumLock(false); setNumState(null); }, 1500);
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
        <h1 className="title h-sub fade-up" style={{ margin: 0, fontSize: 'clamp(13px, 2.1vw, 18px)' }}>{t(c.q)}</h1>
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
                    style={{ padding: 'clamp(9px, 1.5vw, 12px)', fontSize: 'clamp(14px, 2.4vw, 19px)', minHeight: 'clamp(42px, 6vw, 52px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>{t(c.opts[k])}</button>
                ))}
              </div>
            </>
          )}
          {chosen && (
            <>
              <span className="mono lm-reveal" style={{ fontSize: 'clamp(16px, 3vw, 22px)', fontWeight: 800, color: '#1F7A4D' }}>{t(c.opts[c.ci])}</span>
              {!solved && (
                <>
                  <span className="d21-steplabel lm-reveal">{t(stepNum === 0 ? c.step1_q : c.step2_q)}</span>
                  <NumPad value={val} setValue={setVal} disabled={!canAct || numLock} max={3} state={numState}/>
                  <button className="btn-white-accent" disabled={!canAct || numLock || val === ''} onClick={check}>{tri(lang, 'Проверить', 'Tekshiring', 'Check')}</button>
                </>
              )}
              {solved && <span className="mono d21-res lm-reveal">{c.ans1} · {c.ans2}</span>}
            </>
          )}
          {solved && <CheckStrip expr={c.check} cap={t(CONTENT.s7.check_label)} ok/>}
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
  const [numState, setNumState] = useState(null);   // ekranda KO'RINADIGAN javob holati
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
    setNumState(isOk ? 'ok' : 'bad');
    if (!audio.muted) { const e = getAudioEngine(); if (e) e.pushOneOff((isOk ? c.audio.on_correct : it.hint)[lang]); }
    if (isOk) {
      sfx.playCorrect();
      if (!numTriedRef.current) setScore((s) => s + 1);
      setTimeout(() => { setVal(''); setNumLock(false); setNumState(null); setHintMsg(null); numTriedRef.current = false; setIdx((n) => n + 1); }, 1700);
    } else {
      numTriedRef.current = true;
      setHintMsg(it.hint);
      setTimeout(() => { setVal(''); setNumLock(false); setNumState(null); }, 1700);
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
                      style={{ padding: 'clamp(9px, 1.5vw, 12px)', fontSize: 'clamp(13px, 2.1vw, 17px)', minHeight: 'clamp(42px, 6vw, 52px)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>
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
            <div className="frame-success reveal-soft" style={{ marginBottom: 12 }}>
              <Reaction state="correct" praise={lang === 'ru' ? `Верно: ${score} из ${items.length}` : `To'g'ri: ${items.length} tadan ${score} ta`}/>
            </div>
            <div className="d2-factcard fade-up">
              <span className="d2-factcard-badge mono">{t(c.fact_badge)}</span>
              <div className="d2-fact-hero"><AlgoFig/></div>
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
        <div className="d21-final-scene fade-up delay-1"><ColumnScene gathered/></div>
      </div>
    </Stage>
  );
};

// ============================================================
// KORNEVOY KOMPONENT (shablon: infrastructure_v1 / grade1 Dars28)
// ============================================================
export default function WrittenColumnLesson({
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

/* --- DETALLAR --- */

/* --- TOKCHALAR (qismni tengdan tarqatish) --- */

/* --- IFODA SATRLARI --- */

/* --- TOKCHAGA SARALASH (16-darsdan ko'chirilgan mexanika, chip kengroq) --- */
.lm-digtray { display: flex; gap: 10px; justify-content: center; min-height: clamp(44px, 10vw, 58px); align-items: center; }
.lm-digtray-empty { font-size: clamp(15px, 3.2vw, 21px); font-weight: 800; color: #C4BEB4; letter-spacing: 1px; }
.lm-digchip { display: inline-flex; align-items: center; justify-content: center; min-width: clamp(76px, 17vw, 104px); height: clamp(42px, 9vw, 56px); border: none; border-radius: 12px; background: #FFFFFF;
  font-size: clamp(15px, 3.2vw, 22px); font-weight: 800; color: #3A3530; cursor: pointer; padding: 0 10px;
  box-shadow: 0 3px 10px -4px rgba(58,53,48,0.35); transition: transform 0.12s; }
.lm-digchip-sel { background: #FFF3E9; color: #FF4F28; transform: translateY(-3px); box-shadow: 0 6px 16px -5px rgba(255,79,40,0.55); }
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

/* --- FACTCARD: uch xil ajratish navbat bilan yonadi --- */
@keyframes d18split { 0%, 6% { opacity: 0.25; } 24%, 100% { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .d18-split { animation: none; opacity: 1; } }

/* ============================================================
   DARS19 — teng ulash stoli: tarqatish, ortiqcha lagani, qoldiq.
   ============================================================ */

/* --- XUK: buyurtma --- */

/* --- TARQATISH DOSKASI --- */

/* --- IFODA SATRLARI --- */


/* --- YOPIQ MAYDON (Bit tuzog'i) --- */

/* --- sahna o'lchami: budjet donor bilan bir xil (etalon 629x330 @1440x900) --- */

/* --- FACTCARD: hafta strelkasi --- */
@keyframes d19arc { 0%, 10% { transform: rotate(0deg); } 55%, 100% { transform: rotate(308deg); } }
@media (prefers-reduced-motion: reduce) { .d19-arc { animation: none; } }

/* ============================================================
   DARS20 — nazorat terminali: tekshiruv juftliklari, moslik.
   ============================================================ */

.d20-order { display: inline-flex; gap: clamp(6px, 1.6vw, 12px); align-items: center; padding: clamp(4px, 1vw, 7px) clamp(8px, 1.8vw, 12px);
  border-radius: 10px; background: rgba(255,236,200,.5); box-shadow: inset 0 0 0 1px rgba(190,150,90,.26); }
.d20-order-plate { font-size: clamp(15px, 3vw, 21px); font-weight: 800; color: #3A3530; padding: 3px 10px;
  border-radius: 8px; background: #FFFFFF; box-shadow: 0 2px 8px -4px rgba(58,53,48,0.35); }
.d20-note { font-size: clamp(9.5px, 1.5vw, 12px); font-weight: 700; color: #5A5A60; text-align: center; }

/* --- TEKSHIRUV JUFTLIGI --- */
.d20-pair { display: inline-flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: clamp(5px, 1.2vw, 9px);
  padding: clamp(6px, 1.4vw, 10px) clamp(8px, 1.8vw, 13px); border-radius: 12px; background: #FBF7F0;
  box-shadow: inset 0 0 0 1.5px rgba(58,53,48,0.08); }
.d20-pair-line { font-size: clamp(14px, 2.8vw, 20px); font-weight: 800; color: #3A3530; }
.d20-pair-arrow { font-size: clamp(13px, 2.4vw, 18px); font-weight: 800; color: #C4BEB4; }
.d20-pair-check { font-size: clamp(14px, 2.8vw, 20px); font-weight: 800; color: #1F7A4D; }
.d20-pairrow { display: flex; flex-direction: column; align-items: center; gap: clamp(6px, 1.4vw, 10px); }

/* --- IFODA SATRLARI --- */
.d20-expr { font-size: clamp(16px, 3.2vw, 23px); font-weight: 800; color: #3A3530; }
.d20-final { font-size: clamp(18px, 3.6vw, 26px); font-weight: 800; color: #1F7A4D; }
.d20-bad { font-size: clamp(15px, 3vw, 22px); font-weight: 800; color: #C0392B; }
.d20-errline { font-size: clamp(14px, 2.8vw, 20px); font-weight: 800; color: #C0392B; padding: 3px 12px;
  border-radius: 9px; background: rgba(192,57,43,.08); box-shadow: inset 0 0 0 1px rgba(192,57,43,.3); }
.d20-steplabel { font-size: clamp(13px, 2.4vw, 18px); font-weight: 800; color: #3A3530; text-align: center; }
.d20-res { font-size: clamp(19px, 3.8vw, 26px); font-weight: 800; color: #1F7A4D; }
.d20-plate { font-size: clamp(19px, 4vw, 28px); font-weight: 800; color: #0E0E10; padding: 4px 14px;
  border-radius: 12px; background: rgba(255,236,200,.55); box-shadow: inset 0 0 0 1px rgba(190,150,90,.28); }
.d20-trap { display: flex; gap: 10px; justify-content: center; }
.d20-bins { display: grid; grid-template-columns: repeat(2, minmax(120px, 1fr)); gap: clamp(8px, 2vw, 16px); width: 100%; max-width: 440px; }

/* --- sahna o'lchami: budjet donor bilan bir xil (etalon 629x330 @1440x900) --- */
.d20-hook-scene .lm-scene { width: min(100%, calc(clamp(180px, calc(100dvh - 570px), 372px) * 400 / 210)); }
.d20-final-scene .lm-scene { width: min(100%, calc(clamp(200px, calc(100dvh - 560px), 372px) * 400 / 210)); }

/* --- FACTCARD: skaner chizig'i --- */
.d20-scan { animation: d20scan 3.4s ease-in-out infinite; }
@keyframes d20scan { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(132px); } }
@media (prefers-reduced-motion: reduce) { .d20-scan { animation: none; } }

/* ============================================================
   DARS21 — ustun terminali: yozuv, o'tkazish, qadamlar.
   ============================================================ */

.d21-order { display: inline-flex; gap: clamp(6px, 1.6vw, 12px); align-items: center; padding: clamp(4px, 1vw, 7px) clamp(8px, 1.8vw, 12px);
  border-radius: 10px; background: rgba(255,236,200,.5); box-shadow: inset 0 0 0 1px rgba(190,150,90,.26); }
.d21-order-plate { font-size: clamp(15px, 3vw, 21px); font-weight: 800; color: #3A3530; padding: 3px 10px;
  border-radius: 8px; background: #FFFFFF; box-shadow: 0 2px 8px -4px rgba(58,53,48,0.35); }
.d21-note { font-size: clamp(9.5px, 1.5vw, 12px); font-weight: 700; color: #5A5A60; text-align: center; }
.d21-expr { font-size: clamp(15px, 3vw, 22px); font-weight: 800; color: #3A3530; }
.d21-final { font-size: clamp(18px, 3.6vw, 26px); font-weight: 800; color: #1F7A4D; }
.d21-bad { font-size: clamp(14px, 2.8vw, 20px); font-weight: 800; color: #C0392B; }
.d21-errline { font-size: clamp(13px, 2.5vw, 19px); font-weight: 800; color: #C0392B; padding: 3px 12px;
  border-radius: 9px; background: rgba(192,57,43,.08); box-shadow: inset 0 0 0 1px rgba(192,57,43,.3); text-align: center; }
.d21-steplabel { font-size: clamp(13px, 2.4vw, 18px); font-weight: 800; color: #3A3530; text-align: center; }
.d21-res { font-size: clamp(19px, 3.8vw, 26px); font-weight: 800; color: #1F7A4D; }
.d21-plate { font-size: clamp(19px, 4vw, 28px); font-weight: 800; color: #0E0E10; padding: 4px 14px;
  border-radius: 12px; background: rgba(255,236,200,.55); box-shadow: inset 0 0 0 1px rgba(190,150,90,.28); }
.d21-trap { display: flex; gap: 10px; justify-content: center; }
.d21-bins { display: grid; grid-template-columns: repeat(2, minmax(120px, 1fr)); gap: clamp(8px, 2vw, 16px); width: 100%; max-width: 440px; }
.d21-colwrap { display: flex; flex-direction: column; align-items: center; gap: clamp(5px, 1.2vw, 9px); }

/* --- USTUN (13-darsdan ko'chirilgan CSS) --- */
.d14-col { display: inline-flex; flex-direction: column; align-items: flex-start; gap: 0; background: #FFF8EF; border-radius: 12px;
  padding: clamp(8px, 1.8vw, 13px) clamp(12px, 2.4vw, 18px); box-shadow: inset 0 0 0 1.5px rgba(190,150,90,.3); }
.d14-colr { white-space: pre; text-align: left; font-family: 'JetBrains Mono', monospace; font-size: clamp(17px, 3.6vw, 25px);
  font-weight: 800; color: #3A3530; line-height: 1.25; }
.d14-col-slot { color: #8A8378; }
.d14-col-sign { color: #8A8378; }
.d14-col-hot { color: #1F7A4D; }
.d14-colr-carry { position: relative; height: clamp(11px, 2.1vw, 15px); font-family: 'JetBrains Mono', monospace; font-size: clamp(17px, 3.6vw, 25px); }
.d14-carry { position: absolute; top: 0; transform: translateX(-50%); font-family: 'JetBrains Mono', monospace;
  font-size: clamp(10px, 2vw, 14px); font-weight: 800; color: #FF4F28; }
.d14-col-rule { height: 2.3px; background: #3A3530; border-radius: 2px; margin: 3px 0; font-family: 'JetBrains Mono', monospace; font-size: clamp(17px, 3.6vw, 25px); }

/* --- sahna o'lchami: budjet donor bilan bir xil (etalon 629x330 @1440x900) --- */
.d21-hook-scene .lm-scene { width: min(100%, calc(clamp(180px, calc(100dvh - 570px), 372px) * 400 / 210)); }
.d21-final-scene .lm-scene { width: min(100%, calc(clamp(200px, calc(100dvh - 560px), 372px) * 400 / 210)); }

/* --- FACTCARD: qadamlar navbat bilan yonadi --- */
.d21-step { animation: d21step 3.6s ease-in-out infinite; }
@keyframes d21step { 0%, 10% { opacity: 0.3; } 30%, 100% { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .d21-step { animation: none; opacity: 1; } }
`;
