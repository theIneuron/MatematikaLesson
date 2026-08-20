import React, { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// 4-SINF · 21-DARS · Kasrlarni ayirish (frac-4-21-v2)
// ---------------------------------------------------------------------------
// SYUJET: Taqsimot markazi, ish zonasi - SUV ZAXIRASI. Rezervuar yetti teng
//   bo'limga bo'lingan; tumanga bir necha bo'lim jo'natiladi, qolgan ulushni
//   o'quvchi aniqlaydi.
// YADRO: 6/7 - 2/7. Bit suratni ham, maxrajni ham ayirib 4/0 oladi. Maxraj
//   nolga aylanadi, bunday son yo'q - demak maxraj ayirilmaydi: u bo'lak
//   kattaligini bildiradi, bo'lak kattaligi esa o'zgarmagan.
// DARSLIK ASOSI (4-sinf UZ darsligi, 148-151-betlar "Kasrlarni qo'shish va
//   ayirish"): qoida so'zma-so'z 150-betdan; tasma modeli 150-bet 1-topshiriq
//   (5/7 - 3/7); son o'qi modeli 150-151-bet 1-topshiriq; butun = maxraj bo'lgan
//   kasr g'oyasi 148-bet 1-topshiriqdan (36/36); qo'shish bilan tekshirish 151-bet.
// RITM (metodist sharti 1): tushuntirish -> misol -> tushuntirish -> misol:
//   s2 tushuntirish, s3 misol, s4 tushuntirish, s5 misol, s6 tushuntirish,
//   s7 misol, s8 qoida, keyin mashq va qo'llash.
// KADR: kadrli (ovoz bilan o'zi suriladigan) slaydlar kamaytirildi - faqat s0,
//   s8 va s15 ovoz bilan ochiladi, tushuntirish ekranlari bolaning bosishi
//   bilan qadamlanadi (useStepReveal).
// FRAME: s0 - to'q ko'k sahna (canonical hook frame), qolgan hamma ekran och
//   ko'k (T.cyanSoft) ramkada.
// BIT: faqat s0 (missiya), s9 (o'z xatosi), s15 (yakun) va javob izohida.
// Misconception: M1 maxrajni ham ayirish; M2 suratni maxrajdan ayirish;
//   M3 butunni kasrga aylantirmaslik; M4 natija nol bo'lsa maxraj yo'qoladi.
// ---------------------------------------------------------------------------

const T = {
  bg: '#F5F5F0', ink: '#12212C', ink2: '#50616D', ink3: '#87949D', paper: '#FFFFFF',
  accent: '#FF5B35', accentSoft: '#FFF0EA', cyan: '#168FA3', cyanSoft: '#E5F5F6',
  navy: '#173B52', lime: '#95C93D', success: '#227A53', successSoft: '#E7F3EC',
  warn: '#A96F13', warnSoft: '#FFF5D9', shadowBase: '58, 53, 48',
};

// Uch tilli qiymat. Uch argument ham majburiy: bo'sh qolsa bola boshqa tildagi
// matnni ko'radi.
const bi = (uz, ru, en) => ({ uz, ru, en });

const stableChoiceOffset = (lessonId, length) => {
  let hash = 2166136261;
  for (const char of `${lessonId}:${length}`) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return length > 0 ? (hash >>> 0) % length : 0;
};

// To'g'ri javob har ekranda boshqa pozitsiyada turadi, lekin tartib barqaror:
// orqaga qaytganda variantlar joyidan sakramaydi.
const buildOptionOrder = (length, correctIndex, lessonId, ordinal = 0) => {
  const natural = Array.from({ length: Math.max(0, length) }, (_, index) => index);
  if (length < 2 || !Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= length) return natural;
  const target = (stableChoiceOffset(lessonId, length) + ordinal * (length - 1)) % length;
  const order = natural.filter((index) => index !== correctIndex);
  order.splice(target, 0, correctIndex);
  return order;
};

// Har ekranning kirish ovozidagi segment soni. Ovoz bilan ochiladigan ekranlar
// kadrni shundan oladi; qolganlari bosish bilan qadamlanadi.
const FRAME_COUNTS = [3, 2, 3, 2, 3, 3, 3, 2, 3, 3, 3, 3, 3, 3, 3, 5];
// FRAME_COUNTS.length bilan bir xil bo'lishi shart (auditlar shu literalni o'qiydi).
const TOTAL_SCREENS = 16;

const LESSON_META = {
  lessonId: 'frac-4-21-v2',
  slug: 'dars21-kasrlarni-ayirish',
  lessonTitle: bi('21-dars. Kasrlarni ayirish', 'Урок 21. Вычитание дробей', 'Lesson 21. Subtracting fractions'),
  skillTags: ['fraction_subtraction', 'same_denominator', 'fraction_model', 'number_line', 'whole_as_fraction', 'inverse_check'],
  finalReflectionRequired: true,
};

const SCREEN_META = [
  { id: 's0', type: 'hook', subtype: 'story-prediction', template: 'HookPredict', mechanic: 'HookPredict', goal: 'Predict whether the denominator changes when equal parts leave the whole', misconceptions: ['subtracting denominators'], active: true, scored: false, scope: 'hook', resetOnReturn: true },
  { id: 's1', type: 'diagnostic', subtype: 'prior-knowledge', template: 'InlineCheckScreen', mechanic: 'InlineCheckScreen', goal: 'Recall what the denominator names in a fraction', misconceptions: ['denominator counts taken parts'], active: true, scored: false, scope: null },
  { id: 's2', type: 'exploration', subtype: 'remove-equal-parts', template: 'StepReveal', mechanic: 'StepReveal', goal: 'See subtraction as removing equal parts from one whole', misconceptions: ['changing the whole'], active: true, scored: false, scope: null },
  { id: 's3', type: 'model', subtype: 'student-removes-parts', template: 'TapRemove', mechanic: 'TapRemove', goal: 'Remove the named number of equal parts and read the remainder', misconceptions: ['removing the wrong count'], active: true, scored: false, scope: null },
  { id: 's4', type: 'exploration', subtype: 'number-line-step', template: 'StepReveal', mechanic: 'StepReveal', goal: 'Show the same subtraction as a backward jump of equal steps', misconceptions: ['jumping in the wrong direction'], active: true, scored: false, scope: null },
  { id: 's5', type: 'test', subtype: 'numeric-entry', template: 'NumPadScreen', mechanic: 'NumPadScreen', goal: 'Subtract numerators and keep the denominator', misconceptions: ['subtracting denominators'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's6', type: 'discovery', subtype: 'whole-as-fraction', template: 'StepReveal', mechanic: 'StepReveal', goal: 'Rewrite one whole as a fraction with the needed denominator', misconceptions: ['cannot subtract from one'], active: true, scored: false, scope: null },
  { id: 's7', type: 'test', subtype: 'whole-minus-fraction', template: 'MCScreen', mechanic: 'MCScreen', goal: 'Subtract a fraction from one whole', misconceptions: ['keeping the subtrahend as the answer'], active: true, scored: false, scope: null },
  { id: 's8', type: 'rule', subtype: 'textbook-rule', template: 'RuleScreen', mechanic: 'RuleScreen', goal: 'Name the same-denominator subtraction rule and apply it once', misconceptions: ['changing the unit fraction'], active: true, scored: false, scope: null },
  { id: 's9', type: 'error', subtype: 'misconception-repair', template: 'ErrorRepair', mechanic: 'ErrorRepair', goal: 'Repair the zero-denominator record made by Bit', misconceptions: ['subtracting denominators'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's10', type: 'test', subtype: 'three-rounds', template: 'RoundsScreen', mechanic: 'RoundsScreen', goal: 'Subtract in three cases including zero and one whole', misconceptions: ['zero denominator', 'cannot subtract from one'], active: true, scored: true, scoreUnits: 3, scope: 'module-mikro' },
  { id: 's11', type: 'strategy', subtype: 'strategy-compare', template: 'StrategyPick', mechanic: 'StrategyPick', goal: 'Compare two correct routes and choose the shorter one', misconceptions: ['counting steps one by one'], active: true, scored: false, scope: null },
  { id: 's12', type: 'case', subtype: 'life-context', template: 'CaseScreen', mechanic: 'CaseScreen', goal: 'Solve the reservoir hand-over problem with fraction subtraction', misconceptions: ['removed parts counted as remaining'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's13', type: 'matching', subtype: 'representation-link', template: 'MatchingBoard', mechanic: 'MatchingBoard', goal: 'Link each written difference with the model of its result', misconceptions: ['matching by digits only'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's14', type: 'test', subtype: 'final-diagnostic', template: 'FinalRounds', mechanic: 'FinalRounds', goal: 'Apply the rule to new numbers and check the result with addition', misconceptions: ['no check of the result'], active: true, scored: true, scoreUnits: 3, scope: 'final' },
  { id: 's15', type: 'summary', subtype: 'title-claim', template: 'TitleClaim', mechanic: 'TitleClaim', goal: 'Consolidate the rule and bridge to a fraction of a number', misconceptions: ['partial result check'], active: true, scored: false, scope: null },
];

// ---------------------------------------------------------------------------
// KONTENT. Ekranda ko'rinadigan matnda raqam va belgi bo'lishi mumkin; ovozga
// ketadigan har bir maydon (audio..., feedbackAudio) faqat so'z bilan yoziladi.
// ---------------------------------------------------------------------------
const CONTENT = {
  s0: {
    eyebrow: bi('Taqsimot markazi', 'Центр распределения', 'Distribution centre'),
    title: bi('Zaxiradan ikki bo\'lim ketdi', 'Из запаса ушли два отсека', 'Two sections left the reserve'),
    question: bi('Bitning yozuvi to\'g\'rimi?', 'Верна ли запись Бита?', 'Is the record made by Bit correct?'),
    options: [
      bi('Yo\'q, zaxira baribir yetti bo\'lim', 'Нет, запас всё равно из семи отсеков', 'No, the reserve is still made of seven sections'),
      bi('Ha, olti minus ikki va yetti minus yetti', 'Да, шесть минус два и семь минус семь', 'Yes, six minus two and seven minus seven'),
      bi('Hali aniq emas', 'Пока не ясно', 'Not clear yet'),
    ],
    neutral: bi('Taxmin saqlandi. Endi zaxira modelida nima kamayishini va nima o\'zgarmasligini tekshiramiz.', 'Гипотеза сохранена. Теперь на модели запаса проверим, что уменьшается, а что остаётся прежним.', 'Your prediction is saved. Now the reserve model will show what decreases and what stays the same.'),
    audio: {
      intro: {
        uz: [
          'Taqsimot markazidagi suv zaxirasi yetti teng bo\'limga bo\'lingan, ulardan oltitasi to\'la edi.',
          'Tumanga ikki bo\'lim jo\'natildi. Bit hisobladi: olti ayirish ikki, yetti ayirish yetti. Uning javobi noldan to\'rt bo\'lib chiqdi.',
          'Zaxira nechta bo\'limga bo\'lingani o\'zgardimi? Taxminingizni tanlang.',
        ],
        ru: [
          'Запас воды в центре распределения разделён на семь равных отсеков, шесть из них были полными.',
          'В район отправили два отсека. Бит посчитал: шесть минус два и семь минус семь. У него получилось четыре нулевых.',
          'Изменилось ли то, на сколько отсеков разделён запас? Выбери свою гипотезу.',
        ],
        en: [
          'The water reserve in the distribution centre is divided into seven equal sections, and six of them were full.',
          'Two sections were sent to the district. Bit worked out six minus two and seven minus seven. His answer came out as four over zero.',
          'Did the number of sections the reserve is divided into change? Choose your prediction.',
        ],
      },
    },
  },

  s1: {
    eyebrow: bi('Tayanch bilim', 'Опорное знание', 'Prior knowledge'),
    title: bi('Pastdagi son nimani bildiradi', 'Что означает число под чертой', 'What the number below the line means'),
    prompt: bi('Kasr chizig\'i tagidagi 7 nimani ko\'rsatadi?', 'Что показывает 7 под чертой дроби?', 'What does the 7 below the fraction line show?'),
    chips: [
      bi('nechta bo\'lim olingani', 'сколько отсеков забрали', 'how many sections were taken'),
      bi('butun nechta teng bo\'limga bo\'lingani', 'на сколько равных отсеков разделено целое', 'how many equal sections the whole is divided into'),
      bi('zaxiradagi litr soni', 'число литров в запасе', 'the number of litres in the reserve'),
    ],
    correctIndex: 1,
    note: {
      right: bi('To\'g\'ri. Maxraj butun nechta teng bo\'lakka bo\'linganini bildiradi, ya\'ni bir bo\'lakning kattaligini.', 'Верно. Знаменатель показывает, на сколько равных частей разделено целое, то есть размер одной части.', 'Correct. The denominator shows how many equal parts the whole is divided into, that is the size of one part.'),
      wrong: bi('Olingan bo\'laklar soni tepada yoziladi. Pastdagi son butunning bo\'linishini bildiradi.', 'Число взятых частей пишут сверху. Число под чертой говорит о делении целого.', 'The number of parts taken is written above. The number below the line tells about the division of the whole.'),
    },
    audio: {
      intro: {
        uz: [
          'Ayirishni boshlashdan oldin bitta narsani eslaymiz.',
          'Kasr chizig\'i tagidagi son nimani ko\'rsatadi? Javobni tanlang.',
        ],
        ru: [
          'Прежде чем вычитать, вспомним одно.',
          'Что показывает число под чертой дроби? Выбери ответ.',
        ],
        en: [
          'Before we subtract, let us remember one thing.',
          'What does the number below the fraction line show? Choose the answer.',
        ],
      },
    },
  },

  s2: {
    eyebrow: bi('Tushuntirish', 'Объяснение', 'Explanation'),
    title: bi('Teng bo\'limlar zaxiradan chiqadi', 'Равные отсеки уходят из запаса', 'Equal sections leave the reserve'),
    lead: bi('Bosib boring: har qadamda zaxirada nima o\'zgarganini kuzatasiz.', 'Нажимай: на каждом шаге видно, что изменилось в запасе.', 'Tap to move on: each step shows what changed in the reserve.'),
    steps: [
      {
        chip: bi('Bor edi: 6/7', 'Было: 6/7', 'At the start: 6/7'),
        caption: bi('Zaxira 7 teng bo\'limga bo\'lingan, 6 tasi to\'la.', 'Запас разделён на 7 равных отсеков, 6 из них полные.', 'The reserve is divided into 7 equal sections and 6 of them are full.'),
      },
      {
        chip: bi('Chiqdi: 2/7', 'Ушло: 2/7', 'Left: 2/7'),
        caption: bi('Ikki bo\'lim tumanga ketdi. Bo\'limlar soni 7 ligicha qoldi.', 'Два отсека ушли в район. Отсеков по-прежнему 7.', 'Two sections went to the district. There are still 7 sections.'),
      },
      {
        chip: bi('Qoldi: 4/7', 'Осталось: 4/7', 'Remaining: 4/7'),
        caption: bi('6 − 2 = 4 to\'la bo\'lim. Maxraj o\'zgarmadi: 6/7 − 2/7 = 4/7.', '6 − 2 = 4 полных отсека. Знаменатель не изменился: 6/7 − 2/7 = 4/7.', '6 − 2 = 4 full sections. The denominator did not change: 6/7 − 2/7 = 4/7.'),
      },
    ],
    done: bi('Ayirish to\'la bo\'limlar sonini kamaytiradi, bo\'lim kattaligini emas.', 'Вычитание уменьшает число полных отсеков, а не размер отсека.', 'Subtraction reduces the number of full sections, not the size of a section.'),
    audio: {
      intro: {
        uz: [
          'Zaxirani modelda ko\'ramiz.',
          'Har qadamni ochish uchun tugmani bosing.',
          'Yettidan olti bor edi.',
        ],
        ru: [
          'Посмотрим на запас в модели.',
          'Чтобы открыть каждый шаг, нажимай кнопку.',
          'Было шесть седьмых.',
        ],
        en: [
          'Let us look at the reserve on the model.',
          'Tap the button to open each step.',
          'We started with six sevenths.',
        ],
      },
      steps: {
        uz: [
          'Zaxira yetti teng bo\'limga bo\'lingan, ulardan oltitasi to\'la. Bu yettidan olti.',
          'Ikki bo\'lim tumanga ketdi. Diqqat qiling: bo\'limlar soni baribir yetti, chunki zaxiraning o\'zi bo\'linmadi.',
          'To\'la bo\'lim to\'rtta qoldi. Demak yettidan oltidan yettidan ikkini ayirsak, yettidan to\'rt bo\'ladi.',
        ],
        ru: [
          'Запас разделён на семь равных отсеков, шесть из них полные. Это шесть седьмых.',
          'Два отсека ушли в район. Обрати внимание: отсеков по-прежнему семь, ведь сам запас никто не делил заново.',
          'Полных отсеков осталось четыре. Значит, из шести седьмых вычесть две седьмых даёт четыре седьмых.',
        ],
        en: [
          'The reserve is divided into seven equal sections and six of them are full. That is six sevenths.',
          'Two sections went to the district. Notice that there are still seven sections, because the reserve itself was not divided again.',
          'Four full sections are left. So six sevenths minus two sevenths gives four sevenths.',
        ],
      },
    },
  },

  s3: {
    eyebrow: bi('Misol', 'Пример', 'Example'),
    title: bi('Endi o\'zingiz jo\'natasiz', 'Теперь отправляешь ты', 'Now it is your turn to send'),
    lead: bi('Zaxirada 5 to\'la bo\'lim bor. Tumanga 2 bo\'lim jo\'nating: to\'la bo\'limlarni bosing.', 'В запасе 5 полных отсеков. Отправь в район 2 отсека: нажми на полные отсеки.', 'The reserve has 5 full sections. Send 2 sections to the district by tapping full sections.'),
    task: bi('5/7 − 2/7', '5/7 − 2/7', '5/7 − 2/7'),
    remaining: bi('Qolgan ulush', 'Оставшаяся доля', 'The part left'),
    hint: bi('Ikkita bo\'limni bosish kerak. Bo\'limlar soni o\'zgarmaydi.', 'Нужно нажать два отсека. Число отсеков не меняется.', 'You need to tap two sections. The number of sections does not change.'),
    proof: bi('5/7 − 2/7 = 3/7', '5/7 − 2/7 = 3/7', '5/7 − 2/7 = 3/7'),
    doneText: bi('Uchta to\'la bo\'lim qoldi, ya\'ni 3/7.', 'Осталось три полных отсека, то есть 3/7.', 'Three full sections are left, that is 3/7.'),
    audio: {
      intro: {
        uz: [
          'Zaxirada beshta to\'la bo\'lim bor.',
          'Tumanga ikki bo\'lim jo\'nating. To\'la bo\'limlarni bosib chiqaring.',
        ],
        ru: [
          'В запасе пять полных отсеков.',
          'Отправь в район два отсека. Нажимай на полные отсеки.',
        ],
        en: [
          'The reserve has five full sections.',
          'Send two sections to the district. Tap the full sections.',
        ],
      },
      on_correct: bi('Uchta to\'la bo\'lim qoldi. Yettidan beshdan yettidan ikkini ayirsak, yettidan uch bo\'ladi.', 'Осталось три полных отсека. Из пяти седьмых вычесть две седьмых даёт три седьмых.', 'Three full sections are left. Five sevenths minus two sevenths gives three sevenths.'),
      on_wrong: bi('Ikkita bo\'lim jo\'natilishi kerak edi. Yana bir bor sanab ko\'ring.', 'Нужно было отправить два отсека. Пересчитай ещё раз.', 'Two sections had to be sent. Count them once more.'),
    },
  },

  s4: {
    eyebrow: bi('Tushuntirish', 'Объяснение', 'Explanation'),
    title: bi('Xuddi shu ayirish son o\'qida', 'То же вычитание на числовом луче', 'The same subtraction on a number line'),
    lead: bi('Bosib boring: belgi orqaga teng qadamlar bilan siljiydi.', 'Нажимай: метка идёт назад равными шагами.', 'Tap to move on: the marker steps back in equal steps.'),
    steps: [
      {
        chip: bi('Boshlanish: 13/16', 'Начало: 13/16', 'Start: 13/16'),
        caption: bi('0 dan 1 gacha oraliq 16 teng qadamga bo\'lingan.', 'Отрезок от 0 до 1 разделён на 16 равных шагов.', 'The line from 0 to 1 is divided into 16 equal steps.'),
      },
      {
        chip: bi('Orqaga: 6 qadam', 'Назад: 6 шагов', 'Back: 6 steps'),
        caption: bi('Har qadam 1/16. Qadam kattaligi o\'zgarmaydi.', 'Каждый шаг равен 1/16. Размер шага не меняется.', 'Each step is 1/16. The step size does not change.'),
      },
      {
        chip: bi('Natija: 7/16', 'Результат: 7/16', 'Result: 7/16'),
        caption: bi('13/16 − 6/16 = 7/16. Tekshirish: 7/16 + 6/16 = 13/16.', '13/16 − 6/16 = 7/16. Проверка: 7/16 + 6/16 = 13/16.', '13/16 − 6/16 = 7/16. Check: 7/16 + 6/16 = 13/16.'),
      },
    ],
    done: bi('Orqaga sakrash ham suratni kamaytiradi, qadam kattaligi esa maxrajda qoladi.', 'Прыжок назад тоже уменьшает числитель, а размер шага остаётся в знаменателе.', 'A jump back also reduces the numerator, while the step size stays in the denominator.'),
    audio: {
      intro: {
        uz: [
          'Darslik ayirishni son o\'qida ham ko\'rsatadi.',
          'Qadamlarni ochish uchun tugmani bosing.',
          'Boshlang\'ich nuqta o\'n oltidan o\'n uch.',
        ],
        ru: [
          'Учебник показывает вычитание и на числовом луче.',
          'Нажимай кнопку, чтобы открыть шаги.',
          'Начальная точка тринадцать шестнадцатых.',
        ],
        en: [
          'The textbook also shows subtraction on a number line.',
          'Tap the button to open the steps.',
          'The starting point is thirteen sixteenths.',
        ],
      },
      steps: {
        uz: [
          'Noldan birgacha oraliq o\'n olti teng qadamga bo\'lingan. Belgi o\'n oltidan o\'n uchda turadi.',
          'Endi olti qadam orqaga sanaymiz. Har qadam o\'n oltidan bir, ya\'ni qadam kattaligi o\'zgarmaydi.',
          'Belgi o\'n oltidan yettiga keldi. Tekshiramiz: o\'n oltidan yettiga o\'n oltidan oltini qo\'shsak, yana o\'n oltidan o\'n uch bo\'ladi.',
        ],
        ru: [
          'Отрезок от нуля до единицы разделён на шестнадцать равных шагов. Метка стоит на тринадцати шестнадцатых.',
          'Теперь отсчитаем шесть шагов назад. Каждый шаг равен одной шестнадцатой, то есть размер шага не меняется.',
          'Метка пришла в семь шестнадцатых. Проверим: если к семи шестнадцатым прибавить шесть шестнадцатых, снова получится тринадцать шестнадцатых.',
        ],
        en: [
          'The line from zero to one is divided into sixteen equal steps. The marker stands on thirteen sixteenths.',
          'Now we count six steps back. Each step is one sixteenth, so the size of a step does not change.',
          'The marker arrived at seven sixteenths. Let us check: seven sixteenths plus six sixteenths gives thirteen sixteenths again.',
        ],
      },
    },
  },

  s5: {
    eyebrow: bi('Misol', 'Пример', 'Example'),
    title: bi('Suratni o\'zingiz hisoblang', 'Посчитай числитель сам', 'Work out the numerator yourself'),
    question: bi('15/16 − 9/16 = ?/16', '15/16 − 9/16 = ?/16', '15/16 − 9/16 = ?/16'),
    hint: bi('Maxraj 16 ligicha qoladi. Faqat suratlarni ayiring.', 'Знаменатель остаётся 16. Вычти только числители.', 'The denominator stays 16. Subtract only the numerators.'),
    answer: 6,
    proof: bi('15/16 − 9/16 = 6/16', '15/16 − 9/16 = 6/16', '15/16 − 9/16 = 6/16'),
    audio: {
      intro: {
        uz: [
          'O\'n oltidan o\'n beshdan o\'n oltidan to\'qqizni ayiramiz.',
          'Suratni hisoblab, raqamni tanlang.',
        ],
        ru: [
          'Из пятнадцати шестнадцатых вычитаем девять шестнадцатых.',
          'Посчитай числитель и выбери цифру.',
        ],
        en: [
          'We subtract nine sixteenths from fifteen sixteenths.',
          'Work out the numerator and choose the digit.',
        ],
      },
      on_correct: bi('To\'g\'ri. O\'n besh ayirish to\'qqiz olti, maxraj esa o\'n olti bo\'lib qoladi.', 'Верно. Пятнадцать минус девять равно шесть, а знаменатель остаётся шестнадцать.', 'Correct. Fifteen minus nine is six, and the denominator stays sixteen.'),
      on_wrong: bi('Faqat suratlarni ayiring. Maxrajga tegmang.', 'Вычитай только числители. Знаменатель не трогай.', 'Subtract only the numerators. Do not touch the denominator.'),
    },
  },

  s6: {
    eyebrow: bi('Tushuntirish', 'Объяснение', 'Explanation'),
    title: bi('Butunni kasr ko\'rinishida yozamiz', 'Записываем целое в виде дроби', 'Writing one whole as a fraction'),
    lead: bi('Zaxira to\'la bo\'lsa, u ham kasr bilan yoziladi.', 'Если запас полон, его тоже можно записать дробью.', 'When the reserve is full, it can also be written as a fraction.'),
    steps: [
      {
        chip: bi('1 = 15/15', '1 = 15/15', '1 = 15/15'),
        caption: bi('To\'la zaxira 15 bo\'limga bo\'lingan: 15 bo\'limning 15 tasi to\'la.', 'Полный запас разделён на 15 отсеков: полны все 15 из 15.', 'The full reserve is divided into 15 sections: all 15 out of 15 are full.'),
      },
      {
        chip: bi('15/15 − 4/15 = 11/15', '15/15 − 4/15 = 11/15', '15/15 − 4/15 = 11/15'),
        caption: bi('Endi butundan ayirish mumkin: 4 bo\'lim ketdi, 11 bo\'lim qoldi.', 'Теперь можно вычитать из целого: 4 отсека ушли, 11 осталось.', 'Now we can subtract from the whole: 4 sections left, 11 remain.'),
      },
    ],
    done: bi('Butunni kerakli maxraj bilan yozsak, ayirish oddiy holatga aylanadi.', 'Если записать целое с нужным знаменателем, вычитание становится обычным.', 'Once the whole is written with the needed denominator, the subtraction becomes an ordinary one.'),
    audio: {
      intro: {
        uz: [
          'Zaxira to\'la bo\'lsa, undan ham ayirish kerak bo\'ladi.',
          'Qadamlarni bosib ochib boring.',
          'To\'la zaxira bir butun deb aytiladi.',
        ],
        ru: [
          'Если запас полон, из него тоже придётся вычитать.',
          'Открывай шаги нажатием.',
          'Полный запас называют одним целым.',
        ],
        en: [
          'When the reserve is full, we still need to subtract from it.',
          'Open the steps by tapping.',
          'A full reserve is called one whole.',
        ],
      },
      steps: {
        uz: [
          'Bir butun o\'n besh bo\'limga bo\'lingan bo\'lsa, uni o\'n beshdan o\'n besh deb yozamiz. Barcha bo\'limlar to\'la.',
          'Endi to\'rt bo\'lim ketsa, o\'n beshdan o\'n beshdan o\'n beshdan to\'rtni ayiramiz va o\'n beshdan o\'n bir qoladi.',
        ],
        ru: [
          'Если одно целое разделено на пятнадцать отсеков, мы записываем его как пятнадцать пятнадцатых. Все отсеки полные.',
          'Теперь, если ушли четыре отсека, из пятнадцати пятнадцатых вычитаем четыре пятнадцатых и остаётся одиннадцать пятнадцатых.',
        ],
        en: [
          'If one whole is divided into fifteen sections, we write it as fifteen fifteenths. All the sections are full.',
          'Now, if four sections leave, we subtract four fifteenths from fifteen fifteenths and eleven fifteenths remain.',
        ],
      },
    },
  },

  s7: {
    eyebrow: bi('Misol', 'Пример', 'Example'),
    title: bi('Butundan ayirish', 'Вычитание из целого', 'Subtracting from one whole'),
    question: bi('1 − 7/15 = ?', '1 − 7/15 = ?', '1 − 7/15 = ?'),
    options: [
      bi('8/15', '8/15', '8/15'),
      bi('7/15', '7/15', '7/15'),
      bi('8/0', '8/0', '8/0'),
    ],
    correctIndex: 0,
    feedback: [
      bi('To\'g\'ri. 1 = 15/15, keyin 15 − 7 = 8. Javob 8/15.', 'Верно. 1 = 15/15, затем 15 − 7 = 8. Ответ 8/15.', 'Correct. 1 = 15/15, then 15 − 7 = 8. The answer is 8/15.'),
      bi('Bu ketgan qism, qolgan qism emas. Butundan ayirilgach boshqa son chiqadi.', 'Это ушедшая часть, а не остаток. После вычитания из целого получается другое число.', 'That is the part which left, not the part remaining. Subtracting from the whole gives a different number.'),
      bi('Maxraj ayirilmaydi. Bo\'limlar soni o\'n beshligicha qoladi.', 'Знаменатель не вычитают. Число отсеков остаётся пятнадцать.', 'The denominator is not subtracted. The number of sections stays fifteen.'),
    ],
    feedbackAudio: [
      bi('To\'g\'ri. Bir butun o\'n beshdan o\'n besh, keyin o\'n besh ayirish yetti sakkiz.', 'Верно. Одно целое это пятнадцать пятнадцатых, затем пятнадцать минус семь равно восемь.', 'Correct. One whole is fifteen fifteenths, then fifteen minus seven is eight.'),
      bi('Bu ketgan qism, qolgani emas. Butundan ayirib ko\'ring.', 'Это ушедшая часть, а не остаток. Попробуй вычесть из целого.', 'That is the part which left, not the remainder. Try subtracting from the whole.'),
      bi('Maxraj ayirilmaydi, u bo\'lak kattaligini bildiradi.', 'Знаменатель не вычитают, он задаёт размер части.', 'The denominator is not subtracted, it sets the size of a part.'),
    ],
    proof: bi('1 = 15/15, 15/15 − 7/15 = 8/15', '1 = 15/15, 15/15 − 7/15 = 8/15', '1 = 15/15, 15/15 − 7/15 = 8/15'),
    audio: {
      intro: {
        uz: [
          'Bir butundan o\'n beshdan yettini ayiramiz.',
          'Javobni tanlang.',
        ],
        ru: [
          'Из одного целого вычитаем семь пятнадцатых.',
          'Выбери ответ.',
        ],
        en: [
          'We subtract seven fifteenths from one whole.',
          'Choose the answer.',
        ],
      },
      on_correct: bi('Yaxshi. Butunni kerakli maxraj bilan yozdingiz.', 'Хорошо. Ты записал целое с нужным знаменателем.', 'Good. You wrote the whole with the needed denominator.'),
      on_wrong: bi('Avval butunni o\'n beshdan o\'n besh deb yozing.', 'Сначала запиши целое как пятнадцать пятнадцатых.', 'First write the whole as fifteen fifteenths.'),
    },
  },

  s8: {
    eyebrow: bi('Qoida', 'Правило', 'Rule'),
    title: bi('Darslik qoidasi', 'Правило из учебника', 'The rule from the textbook'),
    rule: bi(
      'Bir xil maxrajli kasrlar ayirmasini topish uchun kasrlarning suratlari ayirmasi topiladi, maxraji esa o\'zgarishsiz qoldiriladi.',
      'Чтобы найти разность дробей с одинаковым знаменателем, находят разность числителей, а знаменатель оставляют без изменения.',
      'To find the difference of fractions with the same denominator, subtract the numerators and leave the denominator unchanged.',
    ),
    ruleSource: bi('4-sinf darsligi, 150-bet', 'Учебник 4 класса, стр. 150', 'Grade 4 textbook, page 150'),
    lines: [
      bi('suratlar: 6 − 2 = 4', 'числители: 6 − 2 = 4', 'numerators: 6 − 2 = 4'),
      bi('maxraj: 7 o\'zgarmaydi', 'знаменатель: 7 не меняется', 'denominator: 7 stays the same'),
    ],
    formula: bi('6/7 − 2/7 = 4/7', '6/7 − 2/7 = 4/7', '6/7 − 2/7 = 4/7'),
    check: {
      prompt: bi('Qoidani qo\'llang: 10/23 − 4/23 = ?', 'Применим правило: 10/23 − 4/23 = ?', 'Apply the rule: 10/23 − 4/23 = ?'),
      chips: [
        bi('6/23', '6/23', '6/23'),
        bi('6/0', '6/0', '6/0'),
        bi('6/19', '6/19', '6/19'),
      ],
      correctIndex: 0,
      note: {
        right: bi('To\'g\'ri. Suratlar ayirildi, maxraj 23 ligicha qoldi.', 'Верно. Числители вычли, знаменатель остался 23.', 'Correct. The numerators were subtracted and the denominator stayed 23.'),
        wrong: bi('Maxraj hisoblanmaydi va kamaymaydi: u qanday bo\'lsa, shunday qoladi.', 'Знаменатель не вычисляют и не уменьшают: он остаётся таким же.', 'The denominator is not calculated and not reduced: it stays as it was.'),
      },
    },
    audio: {
      intro: {
        uz: [
          'Kashf qilganimizni darslik qoidasi bilan aytamiz.',
          'Bir xil maxrajli kasrlar ayirmasini topish uchun suratlar ayirmasi topiladi, maxraj esa o\'zgarishsiz qoldiriladi.',
          'Endi shu qoidani yangi kasrlarga qo\'llang.',
        ],
        ru: [
          'То, что мы открыли, назовём правилом из учебника.',
          'Чтобы найти разность дробей с одинаковым знаменателем, находят разность числителей, а знаменатель оставляют без изменения.',
          'Теперь примени это правило к новым дробям.',
        ],
        en: [
          'Let us name what we discovered with the rule from the textbook.',
          'To find the difference of fractions with the same denominator, subtract the numerators and leave the denominator unchanged.',
          'Now apply this rule to new fractions.',
        ],
      },
    },
  },

  s9: {
    eyebrow: bi('Xato tahlili', 'Разбор ошибки', 'Error analysis'),
    title: bi('Bitning yozuvi', 'Запись Бита', 'The record made by Bit'),
    question: bi('Bit 11/15 − 4/15 = 7/0 deb yozdi. Xato qayerda?', 'Бит написал 11/15 − 4/15 = 7/0. Где ошибка?', 'Bit wrote 11/15 − 4/15 = 7/0. Where is the mistake?'),
    errorTop: bi('11/15 − 4/15', '11/15 − 4/15', '11/15 − 4/15'),
    errorBottom: bi('= 7/0', '= 7/0', '= 7/0'),
    options: [
      bi('Maxrajlar ham ayirilgan', 'Знаменатели тоже вычли', 'The denominators were subtracted too'),
      bi('Suratlar ayirilmagan', 'Числители не вычли', 'The numerators were not subtracted'),
      bi('Maxraj kattaroq bo\'lishi kerak edi', 'Знаменатель должен был стать больше', 'The denominator had to become larger'),
      bi('Xato yo\'q', 'Ошибки нет', 'There is no mistake'),
    ],
    correctIndex: 0,
    feedback: [
      bi('To\'g\'ri. 15 − 15 = 0 hisoblangan, shuning uchun maxraj nolga aylandi. Maxrajlar ayirilmaydi: javob 7/15.', 'Верно. Посчитали 15 − 15 = 0, поэтому знаменатель стал нулём. Знаменатели не вычитают: ответ 7/15.', 'Correct. The record used 15 − 15 = 0, so the denominator became zero. Denominators are not subtracted: the answer is 7/15.'),
      bi('Suratlar aynan to\'g\'ri ayirilgan: 11 − 4 = 7. Muammo pastdagi sonda.', 'Числители как раз вычли верно: 11 − 4 = 7. Проблема в числе под чертой.', 'The numerators were subtracted correctly: 11 − 4 = 7. The problem is in the number below the line.'),
      bi('Maxraj o\'smaydi ham. Bo\'lim kattaligi o\'zgarmagan, demak maxraj 15 ligicha qoladi.', 'Знаменатель и не растёт. Размер отсека не изменился, значит знаменатель остаётся 15.', 'The denominator does not grow either. The size of a section did not change, so it stays 15.'),
      bi('Xato bor: 0 maxraj bo\'la olmaydi, chunki butunni nol bo\'lakka bo\'lish mumkin emas.', 'Ошибка есть: 0 не может быть знаменателем, ведь целое нельзя разделить на нуль частей.', 'There is a mistake: 0 cannot be a denominator, because a whole cannot be divided into zero parts.'),
    ],
    feedbackAudio: [
      bi('To\'g\'ri. Maxrajlar ayirilgan, shuning uchun nol chiqib qoldi. To\'g\'ri javob o\'n beshdan yetti.', 'Верно. Вычли знаменатели, поэтому получился нуль. Правильный ответ семь пятнадцатых.', 'Correct. The denominators were subtracted, so a zero appeared. The right answer is seven fifteenths.'),
      bi('Suratlar to\'g\'ri ayirilgan. Pastdagi songa qarang.', 'Числители вычли верно. Посмотри на число под чертой.', 'The numerators were subtracted correctly. Look at the number below the line.'),
      bi('Maxraj o\'smaydi. Bo\'lim kattaligi o\'zgarmadi.', 'Знаменатель не растёт. Размер отсека не изменился.', 'The denominator does not grow. The size of a section did not change.'),
      bi('Xato bor. Nol maxraj bo\'la olmaydi.', 'Ошибка есть. Нуль не может быть знаменателем.', 'There is a mistake. Zero cannot be a denominator.'),
    ],
    proof: bi('11/15 − 4/15 = 7/15', '11/15 − 4/15 = 7/15', '11/15 − 4/15 = 7/15'),
    audio: {
      intro: {
        uz: [
          'Bit o\'n beshdan o\'n birdan o\'n beshdan to\'rtni ayirdi va javobni yetti bo\'lib nol deb yozdi.',
          'Xato qayerda ekanini toping.',
        ],
        ru: [
          'Бит вычел четыре пятнадцатых из одиннадцати пятнадцатых и записал ответ как семь и нуль под чертой.',
          'Найди, где ошибка.',
        ],
        en: [
          'Bit subtracted four fifteenths from eleven fifteenths and wrote the answer as seven over zero.',
          'Find where the mistake is.',
        ],
      },
      on_correct: bi('Aniq. Maxraj bo\'lim kattaligini bildiradi, u ayirilmaydi.', 'Точно. Знаменатель задаёт размер отсека, его не вычитают.', 'Exactly. The denominator sets the size of a section and it is not subtracted.'),
      on_wrong: bi('Yozuvni modeldagi bo\'limlar bilan solishtiring.', 'Сравни запись с отсеками на модели.', 'Compare the record with the sections on the model.'),
    },
  },

  s10: {
    eyebrow: bi('Mustaqil mashq', 'Самостоятельно', 'On your own'),
    title: bi('Uch holat', 'Три случая', 'Three cases'),
    rounds: [
      {
        question: bi('11/14 − 5/14 = ?', '11/14 − 5/14 = ?', '11/14 − 5/14 = ?'),
        options: [bi('6/14', '6/14', '6/14'), bi('6/0', '6/0', '6/0'), bi('16/14', '16/14', '16/14')],
        correctIndex: 0,
        feedback: [
          bi('11 − 5 = 6, maxraj 14 ligicha qoladi.', '11 − 5 = 6, знаменатель остаётся 14.', '11 − 5 = 6 and the denominator stays 14.'),
          bi('Maxrajlar ayirilmaydi.', 'Знаменатели не вычитают.', 'Denominators are not subtracted.'),
          bi('Bu qo\'shish natijasi. Bu yerda ayirish kerak.', 'Это результат сложения. Здесь нужно вычитание.', 'That is the result of adding. Here you need subtraction.'),
        ],
        feedbackAudio: [
          bi('O\'n bir ayirish besh olti, maxraj o\'n to\'rt bo\'lib qoladi.', 'Одиннадцать минус пять равно шесть, знаменатель остаётся четырнадцать.', 'Eleven minus five is six and the denominator stays fourteen.'),
          bi('Maxrajlar ayirilmaydi.', 'Знаменатели не вычитают.', 'Denominators are not subtracted.'),
          bi('Bu qo\'shish natijasi, bu yerda ayirish kerak.', 'Это результат сложения, а здесь нужно вычитание.', 'That is the result of adding, but here you need subtraction.'),
        ],
        proof: bi('11/14 − 5/14 = 6/14', '11/14 − 5/14 = 6/14', '11/14 − 5/14 = 6/14'),
      },
      {
        question: bi('9/20 − 9/20 = ?', '9/20 − 9/20 = ?', '9/20 − 9/20 = ?'),
        options: [bi('0', '0', '0'), bi('1', '1', '1'), bi('9/20', '9/20', '9/20')],
        correctIndex: 0,
        feedback: [
          bi('Hamma olingan bo\'lak ketdi, hech nima qolmadi: 0/20, ya\'ni 0.', 'Все взятые части ушли, ничего не осталось: 0/20, то есть 0.', 'Every part taken has left and nothing remains: 0/20, that is 0.'),
          bi('1 butun zaxira degani. Bu yerda zaxira bo\'shab qoldi.', '1 означает полный запас. Здесь запас опустел.', '1 means a full reserve. Here the reserve became empty.'),
          bi('Bu boshlang\'ich miqdor. Undan o\'zini ayirsak, hech nima qolmaydi.', 'Это исходное количество. Если вычесть его из себя, ничего не останется.', 'That is the starting amount. Subtracting it from itself leaves nothing.'),
        ],
        feedbackAudio: [
          bi('Bir xil kasrni o\'zidan ayirsak, hech nima qolmaydi.', 'Если вычесть дробь из самой себя, ничего не останется.', 'Subtracting a fraction from itself leaves nothing.'),
          bi('Bir butun zaxira degani, bu yerda esa zaxira bo\'shadi.', 'Один это полный запас, а здесь запас опустел.', 'One means a full reserve, but here the reserve became empty.'),
          bi('Bu boshlang\'ich miqdor, javob esa boshqa.', 'Это исходное количество, а ответ другой.', 'That is the starting amount, and the answer is different.'),
        ],
        proof: bi('9/20 − 9/20 = 0', '9/20 − 9/20 = 0', '9/20 − 9/20 = 0'),
      },
      {
        question: bi('1 − 13/14 = ?', '1 − 13/14 = ?', '1 − 13/14 = ?'),
        options: [bi('1/14', '1/14', '1/14'), bi('13/14', '13/14', '13/14'), bi('1/0', '1/0', '1/0')],
        correctIndex: 0,
        feedback: [
          bi('1 = 14/14, keyin 14 − 13 = 1. Javob 1/14.', '1 = 14/14, затем 14 − 13 = 1. Ответ 1/14.', '1 = 14/14, then 14 − 13 = 1. The answer is 1/14.'),
          bi('Bu ketgan qism. Qolgani ancha kichik.', 'Это ушедшая часть. Остаток намного меньше.', 'That is the part which left. The remainder is much smaller.'),
          bi('Maxraj nol bo\'lmaydi. Butunni 14 bo\'lakka bo\'lganmiz.', 'Знаменатель не бывает нулём. Целое мы разделили на 14 частей.', 'A denominator is never zero. We divided the whole into 14 parts.'),
        ],
        feedbackAudio: [
          bi('Bir butun o\'n to\'rtdan o\'n to\'rt, keyin o\'n to\'rt ayirish o\'n uch bir.', 'Одно целое это четырнадцать четырнадцатых, затем четырнадцать минус тринадцать равно один.', 'One whole is fourteen fourteenths, then fourteen minus thirteen is one.'),
          bi('Bu ketgan qism, qolgani ancha kichik.', 'Это ушедшая часть, остаток намного меньше.', 'That is the part which left, the remainder is much smaller.'),
          bi('Maxraj nol bo\'lmaydi.', 'Знаменатель не бывает нулём.', 'A denominator is never zero.'),
        ],
        proof: bi('1 = 14/14, 14/14 − 13/14 = 1/14', '1 = 14/14, 14/14 − 13/14 = 1/14', '1 = 14/14, 14/14 − 13/14 = 1/14'),
      },
    ],
    audio: {
      intro: {
        uz: [
          'Uchta holat: oddiy ayirish, natija nol va butundan ayirish.',
          'Har bir savolga javob bering.',
        ],
        ru: [
          'Три случая: обычное вычитание, нулевой результат и вычитание из целого.',
          'Ответь на каждый вопрос.',
        ],
        en: [
          'Three cases: an ordinary subtraction, a zero result and subtracting from one whole.',
          'Answer each question.',
        ],
      },
      on_correct: bi('To\'g\'ri.', 'Верно.', 'Correct.'),
      on_wrong: bi('Suratlarni ayiring, maxrajni saqlang.', 'Вычитай числители, знаменатель сохраняй.', 'Subtract the numerators and keep the denominator.'),
    },
  },

  s11: {
    eyebrow: bi('Strategiya', 'Стратегия', 'Strategy'),
    title: bi('Qaysi yo\'l qulayroq', 'Какой путь удобнее', 'Which route is more convenient'),
    question: bi('1 − 7/15 ni hisoblash uchun qaysi yo\'l tezroq?', 'Какой путь быстрее для 1 − 7/15?', 'Which route is faster for 1 − 7/15?'),
    routes: [
      {
        label: bi('Butunni kasrga aylantirish', 'Перевести целое в дробь', 'Turn the whole into a fraction'),
        body: bi('1 = 15/15, keyin 15 − 7 = 8', '1 = 15/15, затем 15 − 7 = 8', '1 = 15/15, then 15 − 7 = 8'),
        steps: bi('2 qadam', '2 шага', '2 steps'),
      },
      {
        label: bi('Son o\'qida bittalab sanash', 'Считать по одному на луче', 'Count one by one on the line'),
        body: bi('15/15 dan 7 marta bittalab orqaga', 'От 15/15 семь раз по одному шагу назад', 'From 15/15 step back one at a time, seven times'),
        steps: bi('7 qadam', '7 шагов', '7 steps'),
      },
    ],
    correctIndex: 0,
    feedback: [
      bi('Ha. Ikkala yo\'l ham to\'g\'ri javob beradi, lekin maxraj katta bo\'lsa, butunni kasrga aylantirish qisqaroq.', 'Да. Оба пути дают верный ответ, но при большом знаменателе перевод целого в дробь короче.', 'Yes. Both routes give the right answer, but with a large denominator turning the whole into a fraction is shorter.'),
      bi('Bu yo\'l ham to\'g\'ri, lekin yetti qadam sanash kerak. Birinchi yo\'l ikki qadamda tugaydi.', 'Этот путь тоже верный, но нужно отсчитать семь шагов. Первый путь занимает два шага.', 'This route is also correct, but you have to count seven steps. The first route takes two steps.'),
    ],
    feedbackAudio: [
      bi('Ha. Ikkala yo\'l ham to\'g\'ri, lekin maxraj katta bo\'lsa butunni kasrga aylantirish qisqaroq.', 'Да. Оба пути верны, но при большом знаменателе перевод целого в дробь короче.', 'Yes. Both routes are correct, but with a large denominator turning the whole into a fraction is shorter.'),
      bi('Bu yo\'l ham to\'g\'ri, lekin qadam ko\'p. Birinchisi qisqaroq.', 'Этот путь тоже верный, но шагов много. Первый короче.', 'This route is correct too, but it has many steps. The first one is shorter.'),
    ],
    audio: {
      intro: {
        uz: [
          'Bir butundan o\'n beshdan yettini ayirishning ikki yo\'li bor.',
          'Ikkalasi ham to\'g\'ri javob beradi.',
          'Qaysi biri kamroq qadam talab qiladi? Tanlang.',
        ],
        ru: [
          'Есть два пути, чтобы вычесть семь пятнадцатых из одного целого.',
          'Оба дают верный ответ.',
          'Какой требует меньше шагов? Выбери.',
        ],
        en: [
          'There are two routes for subtracting seven fifteenths from one whole.',
          'Both give the right answer.',
          'Which one needs fewer steps? Choose.',
        ],
      },
    },
  },

  s12: {
    eyebrow: bi('Hayotiy vazifa', 'Задача из жизни', 'Real-life task'),
    title: bi('Zaxirani tumanga topshirish', 'Передача запаса району', 'Handing the reserve to the district'),
    story: bi('Zaxiraning 5/7 qismi to\'la edi. Tumanga 2/7 qismi topshirildi.', 'Запас был полон на 5/7. Району передали 2/7.', 'The reserve was 5/7 full. The district received 2/7 of it.'),
    table: {
      heads: [
        bi('bo\'limlar soni', 'число отсеков', 'number of sections'),
        bi('to\'la edi', 'было полно', 'was full'),
        bi('topshirildi', 'передали', 'handed over'),
      ],
      cells: ['7', '5/7', '2/7'],
    },
    question: bi('Shahar uchun qancha qism qoldi? Suratni tanlang: ?/7', 'Сколько частей осталось городу? Выбери числитель: ?/7', 'How much is left for the city? Choose the numerator: ?/7'),
    answer: 3,
    hint: bi('Bor edi 5 bo\'lim, ketdi 2 bo\'lim. Maxraj 7 ligicha qoladi.', 'Было 5 отсеков, ушло 2. Знаменатель остаётся 7.', 'There were 5 sections and 2 left. The denominator stays 7.'),
    proof: bi('5/7 − 2/7 = 3/7', '5/7 − 2/7 = 3/7', '5/7 − 2/7 = 3/7'),
    audio: {
      intro: {
        uz: [
          'Zaxiraning yettidan besh qismi to\'la edi, tumanga yettidan ikki qismi topshirildi.',
          'Shahar uchun qancha qism qoldi? Suratni tanlang.',
        ],
        ru: [
          'Запас был полон на пять седьмых, району передали две седьмых.',
          'Сколько частей осталось городу? Выбери числитель.',
        ],
        en: [
          'The reserve was five sevenths full and two sevenths went to the district.',
          'How much is left for the city? Choose the numerator.',
        ],
      },
      on_correct: bi('To\'g\'ri. Yettidan uch qism qoldi, ya\'ni uch bo\'lim.', 'Верно. Осталось три седьмых, то есть три отсека.', 'Correct. Three sevenths are left, that is three sections.'),
      on_wrong: bi('Jadvalga qarang: bor edi besh, ketdi ikki.', 'Посмотри в таблицу: было пять, ушло два.', 'Look at the table: there were five and two left.'),
    },
  },

  s13: {
    eyebrow: bi('Moslashtirish', 'Сопоставление', 'Matching'),
    title: bi('Yozuvni natija modeli bilan ulang', 'Соедини запись с моделью результата', 'Link each record with the model of its result'),
    prompt: bi('Chapdagi yozuvni bosing, keyin o\'ngdagi mos modelni bosing.', 'Нажми запись слева, затем подходящую модель справа.', 'Tap a record on the left, then tap the matching model on the right.'),
    left: [
      { id: 'a', label: bi('6/7 − 2/7', '6/7 − 2/7', '6/7 − 2/7'), den: 7, filled: 4 },
      { id: 'b', label: bi('13/16 − 6/16', '13/16 − 6/16', '13/16 − 6/16'), den: 16, filled: 7 },
      { id: 'c', label: bi('9/20 − 9/20', '9/20 − 9/20', '9/20 − 9/20'), den: 20, filled: 0 },
    ],
    right: [
      { id: 'r1', pair: 'b', den: 16, filled: 7, caption: bi('7/16', '7/16', '7/16') },
      { id: 'r2', pair: 'c', den: 20, filled: 0, caption: bi('0/20', '0/20', '0/20') },
      { id: 'r3', pair: 'a', den: 7, filled: 4, caption: bi('4/7', '4/7', '4/7') },
    ],
    wrongNote: bi('Bu model boshqa yozuvning natijasi. Bo\'limlar sonini va to\'la bo\'limlarni sanang.', 'Эта модель является результатом другой записи. Посчитай число отсеков и полные отсеки.', 'This model is the result of a different record. Count the sections and the full ones.'),
    doneNote: bi('Uch juft ham to\'g\'ri ulandi. Maxraj bo\'limlar sonini, surat to\'la bo\'limlarni bildiradi.', 'Все три пары соединены верно. Знаменатель задаёт число отсеков, числитель полные отсеки.', 'All three pairs are linked correctly. The denominator gives the number of sections, the numerator the full ones.'),
    audio: {
      intro: {
        uz: [
          'Uchta yozuv va uchta model bor.',
          'Har bir yozuvni o\'z natijasi bilan ulang.',
        ],
        ru: [
          'Есть три записи и три модели.',
          'Соедини каждую запись с её результатом.',
        ],
        en: [
          'There are three records and three models.',
          'Link each record with its result.',
        ],
      },
      on_correct: bi('Hammasi joyida. Maxraj bo\'limlar sonini, surat to\'la bo\'limlarni ko\'rsatadi.', 'Всё на месте. Знаменатель показывает число отсеков, числитель полные отсеки.', 'All in place. The denominator shows the number of sections and the numerator the full ones.'),
      on_wrong: bi('Bu model boshqa yozuvga tegishli. Bo\'limlarni sanab ko\'ring.', 'Эта модель относится к другой записи. Пересчитай отсеки.', 'This model belongs to a different record. Count the sections again.'),
    },
  },

  s14: {
    eyebrow: bi('Yakuniy tekshiruv', 'Итоговая проверка', 'Final check'),
    title: bi('Yangi sonlar bilan', 'С новыми числами', 'With new numbers'),
    items: [
      {
        kind: 'num',
        question: bi('17/25 − 8/25 = ?/25', '17/25 − 8/25 = ?/25', '17/25 − 8/25 = ?/25'),
        answer: 9,
        hint: bi('Suratlarni ayiring: 17 − 8.', 'Вычти числители: 17 − 8.', 'Subtract the numerators: 17 − 8.'),
        proof: bi('17/25 − 8/25 = 9/25', '17/25 − 8/25 = 9/25', '17/25 − 8/25 = 9/25'),
        audio: {
          question: bi('Yigirma beshdan o\'n yettidan yigirma beshdan sakkizni ayiring.', 'Вычти восемь двадцать пятых из семнадцати двадцать пятых.', 'Subtract eight twenty fifths from seventeen twenty fifths.'),
          on_correct: bi('To\'g\'ri, yigirma beshdan to\'qqiz.', 'Верно, девять двадцать пятых.', 'Correct, nine twenty fifths.'),
          on_wrong: bi('Faqat suratlarni ayiring.', 'Вычитай только числители.', 'Subtract only the numerators.'),
        },
      },
      {
        kind: 'mc',
        question: bi('1 − 11/25 = ?', '1 − 11/25 = ?', '1 − 11/25 = ?'),
        options: [bi('14/25', '14/25', '14/25'), bi('11/25', '11/25', '11/25'), bi('14/0', '14/0', '14/0')],
        correctIndex: 0,
        feedback: [
          bi('1 = 25/25, keyin 25 − 11 = 14.', '1 = 25/25, затем 25 − 11 = 14.', '1 = 25/25, then 25 − 11 = 14.'),
          bi('Bu ketgan qism, qolgani emas.', 'Это ушедшая часть, а не остаток.', 'That is the part which left, not the remainder.'),
          bi('Maxraj nol bo\'lmaydi.', 'Знаменатель не бывает нулём.', 'A denominator is never zero.'),
        ],
        feedbackAudio: [
          bi('To\'g\'ri. Bir butun yigirma beshdan yigirma besh, keyin yigirma besh ayirish o\'n bir o\'n to\'rt.', 'Верно. Одно целое это двадцать пять двадцать пятых, затем двадцать пять минус одиннадцать равно четырнадцать.', 'Correct. One whole is twenty five twenty fifths, then twenty five minus eleven is fourteen.'),
          bi('Bu ketgan qism, qolgani emas.', 'Это ушедшая часть, а не остаток.', 'That is the part which left, not the remainder.'),
          bi('Maxraj nol bo\'lmaydi.', 'Знаменатель не бывает нулём.', 'A denominator is never zero.'),
        ],
        proof: bi('1 = 25/25, 25/25 − 11/25 = 14/25', '1 = 25/25, 25/25 − 11/25 = 14/25', '1 = 25/25, 25/25 − 11/25 = 14/25'),
        audio: {
          question: bi('Bir butundan yigirma beshdan o\'n birni ayiring.', 'Вычти одиннадцать двадцать пятых из одного целого.', 'Subtract eleven twenty fifths from one whole.'),
          on_correct: bi('To\'g\'ri, yigirma beshdan o\'n to\'rt.', 'Верно, четырнадцать двадцать пятых.', 'Correct, fourteen twenty fifths.'),
          on_wrong: bi('Butunni yigirma beshdan yigirma besh deb yozing.', 'Запиши целое как двадцать пять двадцать пятых.', 'Write the whole as twenty five twenty fifths.'),
        },
      },
      {
        kind: 'mc',
        question: bi('Javobni qanday tekshiramiz: 9/25 + 8/25 = ?', 'Как проверить ответ: 9/25 + 8/25 = ?', 'How do we check the answer: 9/25 + 8/25 = ?'),
        options: [bi('17/25', '17/25', '17/25'), bi('17/50', '17/50', '17/50'), bi('1/25', '1/25', '1/25')],
        correctIndex: 0,
        feedback: [
          bi('Ha. Qolgan qismga ketganini qo\'shsak, boshlang\'ich miqdor chiqadi.', 'Да. Если к остатку прибавить ушедшее, получится исходное количество.', 'Yes. Adding what left to what remains gives the starting amount.'),
          bi('Qo\'shishda ham maxraj ayirilmaydi va ko\'paytirilmaydi.', 'При сложении знаменатель тоже не вычитают и не умножают.', 'When adding, the denominator is not subtracted or multiplied either.'),
          bi('Suratlarni qo\'shish kerak: 9 va 8.', 'Нужно сложить числители: 9 и 8.', 'You need to add the numerators: 9 and 8.'),
        ],
        feedbackAudio: [
          bi('Ha. Qolgan qismga ketganini qo\'shsak, boshlang\'ich miqdor chiqadi.', 'Да. Если к остатку прибавить ушедшее, получится исходное количество.', 'Yes. Adding what left to what remains gives the starting amount.'),
          bi('Qo\'shishda ham maxraj o\'zgarmaydi.', 'При сложении знаменатель тоже не меняется.', 'When adding, the denominator does not change either.'),
          bi('Suratlarni qo\'shish kerak.', 'Нужно сложить числители.', 'You need to add the numerators.'),
        ],
        proof: bi('9/25 + 8/25 = 17/25', '9/25 + 8/25 = 17/25', '9/25 + 8/25 = 17/25'),
        audio: {
          question: bi('Tekshirish uchun yigirma beshdan to\'qqizga yigirma beshdan sakkizni qo\'shamiz. Nima chiqadi?', 'Для проверки к девяти двадцать пятым прибавим восемь двадцать пятых. Что получится?', 'To check, we add eight twenty fifths to nine twenty fifths. What do we get?'),
          on_correct: bi('Aniq. Boshlang\'ich miqdor qaytdi, demak ayirish to\'g\'ri.', 'Точно. Исходное количество вернулось, значит вычитание верное.', 'Exactly. The starting amount came back, so the subtraction is right.'),
          on_wrong: bi('Suratlarni qo\'shing, maxrajni saqlang.', 'Сложи числители, знаменатель сохрани.', 'Add the numerators and keep the denominator.'),
        },
      },
    ],
    fact: bi(
      'Qadimgi Misrda kasrlarni faqat surati bir bo\'lgan ulushlar bilan yozishgan: 3/4 ni 1/2 va 1/4 yig\'indisi sifatida ko\'rsatgan.',
      'В Древнем Египте дроби записывали только долями с числителем один: 3/4 показывали как сумму 1/2 и 1/4.',
      'In ancient Egypt fractions were written only as parts with numerator one: 3/4 was shown as the sum of 1/2 and 1/4.',
    ),
    factAudio: bi(
      'Qadimgi Misrda kasrlarni faqat surati bir bo\'lgan ulushlar bilan yozishgan. To\'rtdan uchni yarim va to\'rtdan bir yig\'indisi sifatida ko\'rsatishgan. Bugungi yozuv esa bir amalda ayirishga ham imkon beradi.',
      'В Древнем Египте дроби записывали только долями с числителем один. Три четвёртых показывали как сумму половины и одной четвёртой. Современная запись позволяет вычитать в одно действие.',
      'In ancient Egypt fractions were written only as parts with numerator one. Three fourths was shown as a half plus one fourth. Our modern way of writing lets us subtract in a single step.',
    ),
    audio: {
      intro: {
        uz: [
          'Uchta yakuniy topshiriq. Sonlar darsda uchramagan.',
          'Birinchisida suratlarni ayirasiz.',
          'Oxirgisi javobni qo\'shish bilan tekshirishga tegishli.',
        ],
        ru: [
          'Три итоговых задания. Числа в уроке не встречались.',
          'В первом ты вычитаешь числители.',
          'Последнее задание про проверку ответа сложением.',
        ],
        en: [
          'Three final tasks. These numbers did not appear in the lesson.',
          'In the first one you subtract the numerators.',
          'The last one is about checking the answer by adding.',
        ],
      },
    },
  },

  s15: {
    eyebrow: bi('Missiya mukofoti', 'Награда миссии', 'Mission reward'),
    title: bi('Unvongacha bitta savol', 'Один вопрос до звания', 'One question before your title'),
    lead: bi('Usulni tanlang va ayirishni tushunganingizni ko\'rsating.', 'Выбери способ вычитания.', 'Choose the subtraction method.'),
    question: bi('Kasrlarni ayirganda nima o\'zgarmaydi?', 'Что не меняется при вычитании дробей?', 'What does not change when we subtract fractions?'),
    stem: bi('Ayirishda men...', 'При вычитании я...', 'When I subtract, I...'),
    options: [
      bi('suratlarni ayiraman, maxraj o\'zgarmaydi', 'вычитаю числители, знаменатель не меняется', 'subtract the numerators and keep the denominator'),
      bi('suratlarni ham, maxrajlarni ham ayiraman', 'вычитаю и числители, и знаменатели', 'subtract numerators and denominators'),
      bi('maxrajlarni qo\'shaman', 'складываю знаменатели', 'add the denominators'),
    ],
    correctIndex: 0,
    feedback: [
      bi('To\'g\'ri. Maxraj bo\'lak kattaligini bildiradi, u o\'zgarmaydi.', 'Верно. Знаменатель задаёт размер части и не меняется.', 'Correct. The denominator sets the size of a part and does not change.'),
      bi('Maxrajlar ayirilsa nol chiqadi. Faqat suratlar ayiriladi.', 'Вычтешь знаменатели — получится нуль. Вычитают только числители.', 'Subtracting the denominators gives zero. Only the numerators are subtracted.'),
      bi('Qo\'shishda ham maxraj o\'zgarmaydi. Bu yerda esa ayirish.', 'При сложении знаменатель тоже не меняется. А здесь вычитание.', 'When adding, the denominator does not change either. And here we subtract.'),
    ],
    feedbackAudio: [
      bi('To\'g\'ri. Maxraj bo\'lak kattaligini bildiradi, shuning uchun o\'zgarmaydi.', 'Верно. Знаменатель задаёт размер части, поэтому он не меняется.', 'Correct. The denominator sets the size of a part, so it does not change.'),
      bi('Maxrajlar ayirilsa nol chiqadi, bunday son yo\'q.', 'Если вычесть знаменатели, получится нуль, а такого числа нет.', 'Subtracting the denominators gives zero, and there is no such number.'),
      bi('Bu qo\'shish haqida, bu yerda esa ayirish.', 'Это про сложение, а здесь вычитание.', 'That is about adding, and here we subtract.'),
    ],
    resolution: bi('Maxraj bo\'lak kattaligini bildiradi, u o\'zgarmadi.', 'Знаменатель задаёт размер части, а он не изменился.', 'The denominator sets the size of a part, and it did not change.'),
    proof: bi('6/7 − 2/7 = 4/7', '6/7 − 2/7 = 4/7', '6/7 − 2/7 = 4/7'),
    rulesLabel: bi('Qoida', 'Правило', 'Rule'),
    rules: [
      bi('Suratlar ayiriladi, maxraj o\'zgarmaydi.', 'Числители вычитают, знаменатель не меняется.', 'The numerators are subtracted, the denominator does not change.'),
      bi('Butunni kerakli maxraj bilan yozish mumkin: 1 = 15/15.', 'Целое можно записать с нужным знаменателем: 1 = 15/15.', 'A whole can be written with the needed denominator: 1 = 15/15.'),
      bi('Javobni qo\'shish bilan tekshiramiz.', 'Ответ проверяем сложением.', 'We check the answer by adding.'),
    ],
    award: bi('Taqsimot muhandisi', 'Инженер распределения', 'Distribution engineer'),
    audio: {
      intro: {
        uz: [
          'Zaxira taqsimlandi. Missiya bajarildi.',
          'Bir xil maxrajli kasrlarni ayirganda suratlar ayiriladi, maxraj esa o\'zgarmaydi.',
          'Butunni kerakli maxraj bilan kasr qilib yozish mumkin, javobni esa qo\'shish bilan tekshiramiz.',
          'Keyingi darsda ulushning o\'zi emas, uning necha litr ekanini topamiz.',
          'Unvongacha bitta savol qoldi. Usulni tanlang.',
        ],
        ru: [
          'Запас распределён. Миссия выполнена.',
          'При вычитании дробей с одинаковым знаменателем вычитают числители, а знаменатель не меняется.',
          'Целое можно записать дробью с нужным знаменателем, а ответ проверяем сложением.',
          'На следующем уроке найдём не саму долю, а сколько это литров.',
          'До звания остался один вопрос. Выбери способ.',
        ],
        en: [
          'The reserve is distributed. The mission is complete.',
          'When subtracting fractions with the same denominator, the numerators are subtracted and the denominator does not change.',
          'A whole can be written as a fraction with the denominator we need, and we check the answer by adding.',
          'In the next lesson we will find not the part itself but how many litres it is.',
          'One question is left before your title. Choose the method.',
        ],
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Navigatsiya gate. Qiymat src/components/grade4/theoryNavigation.js dagi
// GRADE4_THEORY_CONTINUE_UNLOCKED bilan bir xil ushlanadi: dars LMS uchun
// bitta fayl bo'lishi kerak, shuning uchun helper ichkarida turadi.
// true - ko'rib chiqish rejimi: "Davom etish" har ekranda ochiq.
// false - o'quv rejimi: tugma faqat mazmunli harakatdan keyin ochiladi.
// ---------------------------------------------------------------------------
const GRADE4_THEORY_CONTINUE_UNLOCKED = true;
function canUseGrade4TheoryContinue(gatePassed, finish = false) {
  return (!finish && GRADE4_THEORY_CONTINUE_UNLOCKED) || Boolean(gatePassed);
}

// ---------------------------------------------------------------------------
// Mobil masshtab qatlami (ETALON_4SINF §10). <640px da layout 390px etalon
// kenglikda qoladi va real ekranga eng kichik masshtab bilan sig'adi, shuning
// uchun barcha telefonlarda bir xil ko'rinish chiqadi. Hook dars ichida turadi:
// LMS uchun dars bitta fayl bo'lishi kerak.
// ---------------------------------------------------------------------------
const GRADE4_MOBILE_DESIGN_W = 390;
const GRADE4_MOBILE_DESIGN_H = 760;
const GRADE4_MOBILE_BREAKPOINT = 640;
function useGrade4MobileZoom({
  designWidth = GRADE4_MOBILE_DESIGN_W,
  designHeight = GRADE4_MOBILE_DESIGN_H,
  breakpoint = GRADE4_MOBILE_BREAKPOINT,
  fitHeight = true,
} = {}) {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const root = document.documentElement;
    const update = () => {
      const widthScale = window.innerWidth / designWidth;
      const heightScale = window.innerHeight / designHeight;
      const zoom = window.innerWidth < breakpoint
        ? (fitHeight ? Math.min(widthScale, heightScale, 1) : widthScale)
        : 1;
      root.style.setProperty('--g4z', String(zoom));
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
      root.style.removeProperty('--g4z');
    };
  }, [breakpoint, designHeight, designWidth, fitHeight]);
}

let runtimeConfig = { ttsApiBase: '', voiceGender: 'f', correctSoundUrl: '', wrongSoundUrl: '', previewMode: false };
const configureLesson = (next) => { runtimeConfig = { ...runtimeConfig, ...next }; };
const SUPPORTED_LANGS = ['uz', 'ru', 'en'];
const SPEECH_LOCALES = { uz: 'uz-UZ', ru: 'ru-RU', en: 'en-GB' };
const LANGUAGE_LABELS = { uz: 'Til', ru: 'Язык', en: 'Language' };
const normalizeLang = (value) => SUPPORTED_LANGS.includes(value) ? value : 'uz';
const LangContext = createContext('uz');
const useLang = () => useContext(LangContext);
const useT = () => {
  const lang = useLang();
  return useCallback((value) => {
    if (value == null) return '';
    if (React.isValidElement(value)) return value;
    if (typeof value === 'string' || typeof value === 'number') return String(value);
    return value[lang] ?? '';
  }, [lang]);
};

function useIsMobile(breakpoint = 640) {
  const [mobile, setMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < breakpoint : false);
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const update = () => setMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [breakpoint]);
  return mobile;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, []);
  return reduced;
}

const buildTtsUrl = (base, text, gender) => base + '/api/tts?text=' + encodeURIComponent(String(text).slice(0, 1000)) + '&g=' + (gender === 'm' ? 'm' : 'f');

const visualBeatMs = (text) => {
  const words = String(text ?? '').trim().split(/\s+/).filter(Boolean).length;
  return Math.min(9000, Math.max(2600, 900 + words * 320));
};

class AudioEngine {
  constructor() { this.queue = []; this.index = 0; this.audio = null; this.previewUtterance = null; this.timer = null; this.lang = 'uz'; this.muted = false; this.listener = null; }
  emit(extra = {}) { this.listener?.({ muted: this.muted, ...extra }); }
  setLang(lang) { this.lang = lang; }
  stop() {
    if (this.timer && typeof window !== 'undefined') window.clearTimeout(this.timer);
    this.timer = null;
    if (this.audio) { this.audio.pause(); this.audio.onended = null; this.audio.onerror = null; }
    if (this.previewUtterance) { this.previewUtterance.onstart = null; this.previewUtterance.onend = null; this.previewUtterance.onerror = null; this.previewUtterance = null; }
    if (typeof window !== 'undefined' && window.speechSynthesis) { try { window.speechSynthesis.cancel(); } catch { /* preview only */ } }
  }
  load(queue) { this.stop(); this.queue = queue || []; this.index = 0; this.emit({ completed: false, currentSegment: null }); }
  start() { this.play(); }
  timed(item, duration = null) {
    if (this.timer) window.clearTimeout(this.timer);
    if (this.audio) { this.audio.onended = null; this.audio.onerror = null; }
    this.emit({ isPlaying: false, completed: false, currentSegment: item.id, visualOnly: true });
    this.timer = window.setTimeout(() => { this.index += 1; this.play(); }, duration ?? visualBeatMs(item.text));
  }
  play() {
    const item = this.queue[this.index];
    if (!item) { this.emit({ isPlaying: false, completed: true, currentSegment: null, visualOnly: this.muted || !runtimeConfig.ttsApiBase }); return; }
    if (this.muted || !runtimeConfig.ttsApiBase) {
      if (!this.muted && runtimeConfig.previewMode && typeof window !== 'undefined' && window.speechSynthesis) {
        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(String(item.text));
          utterance.lang = SPEECH_LOCALES[this.lang] ?? SPEECH_LOCALES.uz;
          utterance.rate = 0.94;
          utterance.onstart = () => this.emit({ isPlaying: true, completed: false, currentSegment: item.id, visualOnly: false });
          utterance.onend = () => { this.emit({ isPlaying: false, currentSegment: null }); this.index += 1; this.play(); };
          utterance.onerror = () => this.timed(item);
          this.previewUtterance = utterance;
          this.timer = window.setTimeout(() => { try { window.speechSynthesis.speak(utterance); } catch { this.timed(item); } }, 50);
          return;
        } catch { /* deterministic timer fallback */ }
      }
      this.timed(item);
      return;
    }
    if (!this.audio) { this.audio = new Audio(); this.audio.crossOrigin = 'anonymous'; }
    this.audio.onended = () => { this.index += 1; this.play(); };
    this.audio.onerror = () => this.timed(item);
    this.audio.src = buildTtsUrl(runtimeConfig.ttsApiBase, item.text, runtimeConfig.voiceGender);
    this.audio.play().then(() => this.emit({ isPlaying: true, completed: false, currentSegment: item.id, visualOnly: false })).catch(() => this.timed(item));
  }
  toggleMute() { this.muted = !this.muted; this.stop(); this.index = 0; this.emit({ muted: this.muted }); this.start(); }
  pushOneOff(text) { this.load([{ id: 'feedback-' + Date.now(), text }]); this.start(); }
}

let audioEngineInstance = null;
const getAudioEngine = () => {
  if (typeof window === 'undefined') return null;
  if (!audioEngineInstance) audioEngineInstance = new AudioEngine();
  return audioEngineInstance;
};

function useAudio(segments) {
  const lang = useLang();
  const [state, setState] = useState({ muted: audioEngineInstance?.muted ?? false, completed: false, currentSegment: null, visualOnly: !runtimeConfig.ttsApiBase });
  /* eslint-disable react-hooks/refs -- stable audio queue */
  const segmentsRef = useRef(segments);
  const segmentsKey = JSON.stringify(segments || []);
  const prevKeyRef = useRef(segmentsKey);
  if (prevKeyRef.current !== segmentsKey) { segmentsRef.current = segments; prevKeyRef.current = segmentsKey; }
  const stableSegments = segmentsRef.current;
  /* eslint-enable react-hooks/refs */
  useEffect(() => {
    const engine = getAudioEngine();
    if (!engine) return undefined;
    engine.setLang(lang);
    engine.listener = (next) => setState((previous) => ({ ...previous, ...next }));
    engine.load(stableSegments);
    const timer = window.setTimeout(() => engine.start(), 220);
    return () => { window.clearTimeout(timer); engine.stop(); engine.listener = null; };
  }, [lang, stableSegments]);
  return {
    ...state,
    replay: () => { const engine = getAudioEngine(); engine?.load(stableSegments); engine?.start(); },
    toggleMute: () => getAudioEngine()?.toggleMute(),
    pushOneOff: (text) => getAudioEngine()?.pushOneOff(text),
  };
}

function useNarration(value, screen) {
  const lang = useLang();
  const reduced = usePrefersReducedMotion();
  const segments = useMemo(() => {
    const source = value?.intro ?? value;
    const texts = source?.[lang] ?? [];
    return (Array.isArray(texts) ? texts : [texts]).filter(Boolean).map((text, index) => ({ id: 's' + screen + '-beat-' + index, text }));
  }, [lang, screen, value]);
  const audio = useAudio(segments);
  const active = segments.findIndex((segment) => segment.id === audio.currentSegment);
  const finalFrame = Math.max(0, FRAME_COUNTS[screen] - 1);
  const feedbackPlaying = audio.currentSegment?.startsWith('feedback-') === true;
  // Ovoz o'chirilgan bo'lsa kadr darhol oxirgi holatga o'tadi. Aks holda bola
  // ovozsiz rejimda ekrandagi matnni ko'rmay qolardi: kadr jimjit taymer bilan
  // sekin surilardi (2026-08-19 da topilgan nuqson).
  const frame = reduced || audio.muted || feedbackPlaying || audio.completed ? finalFrame : active >= 0 ? active : 0;
  return { ...audio, frame, caption: active >= 0 ? segments[active].text : '' };
}

const playSfx = (kind) => {
  const url = kind === 'correct' ? runtimeConfig.correctSoundUrl : runtimeConfig.wrongSoundUrl;
  if (!url || typeof window === 'undefined') return;
  try { new Audio(url).play().catch(() => {}); } catch { /* optional */ }
};
const BitSVG = ({ state = 'present', className = '' }) => {
  const isWave = state === 'wave';
  const isHappy = state === 'happy' || isWave || state === 'idea' || state === 'nod';
  const isThinking = state === 'hint' || state === 'think';
  const isAwkward = state === 'awkward';

  return (
  <svg className={`g1-char g1-char-bit g1-char-state-${state} ${className}`} viewBox="0 0 120 150" aria-hidden="true">
    <defs>
      <linearGradient id="g421bbody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#E2ECF2" />
        <stop offset="100%" stopColor="#B6C7D2" />
      </linearGradient>
      <linearGradient id="g421bhead" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#EBF2F6" />
        <stop offset="100%" stopColor="#C4D3DC" />
      </linearGradient>
    </defs>
    <ellipse cx="60" cy="140" rx="30" ry="5" fill="rgba(58,53,48,0.13)" />
    <g className="g1-bit-ant">
      <path d="M60 30 V14" stroke="#9FB3BF" strokeWidth="4" strokeLinecap="round" />
      <circle cx="60" cy="11" r="6" fill="#FF4F28" />
      <circle cx="58" cy="9" r="2" fill="#FFB9A6" />
    </g>
    <rect x="44" y="118" width="12" height="16" rx="5" fill="#9FB3BF" />
    <rect x="64" y="118" width="12" height="16" rx="5" fill="#9FB3BF" />
    <rect x="34" y="60" width="52" height="62" rx="18" fill="url(#g421bbody)" stroke="#A9BCC8" strokeWidth="2" />
    <rect x="44" y="104" width="32" height="10" rx="5" fill="#A9BCC8" opacity="0.5" />
    {(state === 'happy' || isWave) && (
      <g className={isWave ? 'bit-double-wave' : ''}>
        <g className="bit-wave-left">
          <path d="M36 74 C 26 66 22 56 22 48" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="22" cy="47" r="5" fill="#B6C7D2" />
        </g>
        <g className="bit-wave-right">
          <path d="M84 74 C 94 66 98 56 98 48" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="98" cy="47" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    {state === 'present' && (
      <g>
        <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="103" r="5" fill="#B6C7D2" />
        <g className="g1-bit-wave">
          <path d="M84 74 C 96 66 100 54 98 44" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="98" cy="43" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    {isThinking && (
      <g>
        <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="103" r="5" fill="#B6C7D2" />
        <g className="bit-think-hand">
          <path d="M84 76 C 92 74 92 66 84 61" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="83" cy="60" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    {isAwkward && (
      <g className="bit-awkward-hands">
        <path d="M36 76 C 39 88 46 96 54 99" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="54" cy="99" r="5" fill="#B6C7D2" />
        <path d="M84 76 C 81 88 74 96 66 99" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="66" cy="99" r="5" fill="#B6C7D2" />
      </g>
    )}
    {state === 'point' && (
      <g>
        <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="103" r="5" fill="#B6C7D2" />
        <g className="bit-point-arm">
          <path d="M84 76 C 94 72 101 67 108 62" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="109" cy="61" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    {state === 'idea' && (
      <g>
        <path d="M36 76 C 29 82 27 91 30 101" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="102" r="5" fill="#B6C7D2" />
        <path d="M84 76 C 92 68 95 58 94 50" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="94" cy="49" r="5" fill="#B6C7D2" />
      </g>
    )}
    {state === 'focus' && (
      <g className="bit-focus-hands">
        <path d="M36 77 C 41 88 47 93 53 94" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="53" cy="94" r="5" fill="#B6C7D2" />
        <path d="M84 77 C 79 88 73 93 67 94" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="67" cy="94" r="5" fill="#B6C7D2" />
      </g>
    )}
    {state === 'nod' && (
      <g>
        <path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="103" r="5" fill="#B6C7D2" />
        <g className="bit-nod-hand">
          <path d="M84 75 C 93 70 99 62 99 54" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="99" cy="53" r="5" fill="#B6C7D2" />
        </g>
      </g>
    )}
    <rect x="28" y="28" width="64" height="46" rx="16" fill="url(#g421bhead)" stroke="#A9BCC8" strokeWidth="2" />
    <rect x="36" y="36" width="48" height="30" rx="10" fill="#16242C" />
    <path d="M40 40 h18 a4 4 0 0 1 -4 8 h-14 Z" fill="rgba(255,255,255,0.08)" />
    <g className="g1-eyes" fill="#5BD6F2">
      {isAwkward
        ? <><ellipse cx="50" cy="53" rx="4.8" ry="3.2" /><ellipse cx="70" cy="53" rx="4.8" ry="3.2" /></>
        : isThinking
        ? <><circle cx="50" cy="50" r="4.5" /><circle cx="70" cy="49" r="5.5" /></>
        : <><circle cx="50" cy="50" r="5" /><circle cx="70" cy="50" r="5" /></>}
    </g>
    {isHappy && <path d="M50 58 Q60 65 70 58" stroke="#5BD6F2" strokeWidth="2.6" fill="none" strokeLinecap="round" />}
    {(state === 'present' || state === 'point' || state === 'focus') && <path d="M52 58 h16" stroke="#5BD6F2" strokeWidth="2.6" strokeLinecap="round" />}
    {isThinking && <circle cx="60" cy="59" r="2.4" fill="#5BD6F2" />}
    {isAwkward && (
      <g className="bit-awkward-face">
        <path d="M53 62 Q60 57 67 62" stroke="#5BD6F2" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <circle cx="43" cy="59" r="4" fill="#FF9B8A" opacity=".5" />
        <circle cx="77" cy="59" r="4" fill="#FF9B8A" opacity=".5" />
      </g>
    )}
    {isThinking && (
      <g>
        <circle cx="99" cy="38" r="9" fill="#FFC23C" />
        <text x="99" y="42.5" textAnchor="middle" fontSize="12" fontWeight="800" fill="#5A3A00">?</text>
      </g>
    )}
    {state === 'point' && (
      <g className="bit-point-target">
        <circle cx="110" cy="61" r="8" fill="none" stroke="#FF5B35" strokeWidth="2" />
        <circle cx="110" cy="61" r="2" fill="#FF5B35" />
      </g>
    )}
    {state === 'idea' && (
      <g className="bit-idea-bulb">
        <circle cx="99" cy="36" r="9" fill="#FFC23C" />
        <path d="M95 36 Q99 31 103 36 M97 42 h4" stroke="#7A5200" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </g>
    )}
    {state === 'focus' && (
      <g className="bit-focus-scan">
        <path d="M43 45 h34" stroke="#95C93D" strokeWidth="2" strokeLinecap="round" />
        <circle cx="80" cy="45" r="3" fill="#95C93D" />
      </g>
    )}
    {state === 'nod' && (
      <g className="bit-nod-check">
        <circle cx="99" cy="38" r="9" fill="#95C93D" />
        <path d="M95 38 l3 3 6-7" stroke="#FFFFFF" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    )}
  </svg>
  );
};
const AudioIndicator = ({ audio }) => {
  const lang = useLang();
  const labels = {
    uz: { unmute: "Ovozni yoqish", mute: "Ovozni o'chirish", replay: 'Qayta eshitish' },
    ru: { unmute: 'Включить звук', mute: 'Выключить звук', replay: 'Повторить' },
    en: { unmute: 'Turn sound on', mute: 'Turn sound off', replay: 'Replay' },
  }[lang];
  const muteLabel = audio.muted
    ? labels.unmute
    : labels.mute;
  const replayLabel = labels.replay;
  return (
    <div className="audio-controls">
      <button type="button" className="icon-btn" onClick={audio.toggleMute} aria-label={muteLabel} title={muteLabel}>
        {audio.muted ? '🔇' : (audio.isPlaying ? '🔊' : '🔉')}
      </button>
      {!audio.muted && (
        <button type="button" className="icon-btn" onClick={audio.replay} aria-label={replayLabel} title={replayLabel}>
          ↻
        </button>
      )}
    </div>
  );
};

const ScreenTypeLabel = ({ type }) => {
  const lang = useLang();
  const labels = {
    uz: { hook: 'Missiya', diagnostic: 'Diagnostika', model: 'Model', exploration: 'Tadqiqot', discovery: 'Kashfiyot', rule: 'Qoida', strategy: 'Strategiya', consolidation: 'Mustahkamlash', practice: 'Mashq', test: 'Tekshiruv', error: 'Xato tahlili', matching: 'Moslashtirish', case: 'Vazifa', summary: 'Yakun' },
    ru: { hook: 'Миссия', diagnostic: 'Диагностика', model: 'Модель', exploration: 'Исследование', discovery: 'Открытие', rule: 'Правило', strategy: 'Стратегия', consolidation: 'Закрепление', practice: 'Практика', test: 'Проверка', error: 'Разбор ошибки', matching: 'Сопоставление', case: 'Задача', summary: 'Итог' },
    en: { hook: 'Mission', diagnostic: 'Diagnostic', model: 'Model', exploration: 'Exploration', discovery: 'Discovery', rule: 'Rule', strategy: 'Strategy', consolidation: 'Consolidation', practice: 'Practice', test: 'Check', error: 'Error analysis', matching: 'Matching', case: 'Problem', summary: 'Summary' },
  }[lang];
  return <span className="screen-type">{labels[type] ?? type}</span>;
};

const FeedbackBlock = ({ show, correct, children, proof = null }) => {
  const t = useT();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!show) { const frameId = requestAnimationFrame(() => setOpen(false)); return () => cancelAnimationFrame(frameId); }
    let second = 0;
    const first = requestAnimationFrame(() => { second = requestAnimationFrame(() => setOpen(true)); });
    return () => { cancelAnimationFrame(first); cancelAnimationFrame(second); };
  }, [show]);
  return <div data-g4-role={show ? (correct ? 'feedback-frame bit-answer-comment' : 'feedback-frame') : undefined} data-g4-feedback={show ? (correct ? 'solution' : 'wrong') : undefined} role={show ? 'status' : undefined} aria-hidden={!show} className={`feedback feedback-slot ${correct ? 'correct' : 'wrong'} ${open ? 'open' : ''}`}><span className="feedback-bit" data-g4-role="feedback-bit"><BitSVG state={correct ? 'nod' : 'awkward'}/></span><p data-g4-role={show && correct ? 'bit-answer-comment' : undefined}>{show && correct && <b className="proof-label">{t({ uz: 'YECHIM', ru: 'РЕШЕНИЕ', en: 'SOLUTION' })}</b>}<span>{show ? children : ''}</span>{show && proof && <strong className="feedback-proof">{proof}</strong>}</p></div>;
};

const Stage = ({ screen, audio, onPrev, onNext, nextDisabled: originalNextDisabled = false, finish = false, children }) => {
  const originalGatePassed = !originalNextDisabled && Boolean(onNext);
  const nextDisabled = !canUseGrade4TheoryContinue(originalGatePassed, finish);
  const t = useT(); const mobile = useIsMobile(); const pad = mobile ? 14 : 48; const c = CONTENT[`s${screen}`]; const meta = SCREEN_META[screen];
  return <main className={`stage stage-${meta.type}`}><header className="stage-header" style={{ paddingLeft: pad, paddingRight: pad }}><div className="progress-track" role="progressbar" aria-valuemin={1} aria-valuemax={TOTAL_SCREENS} aria-valuenow={screen + 1} aria-label={`${screen + 1} / ${TOTAL_SCREENS}`}><div className="progress-fill progress-bar" style={{ width: `${(screen + 1) / TOTAL_SCREENS * 100}%` }}/></div><div className="stage-chrome"><div className="chrome-title"><span className="status-dot"/><span>{t(c.eyebrow)}</span></div><div className="chrome-actions"><ScreenTypeLabel type={meta.type}/>{audio && <AudioIndicator audio={audio}/>}<span className="screen-count">{String(screen + 1).padStart(2, '0')} / {TOTAL_SCREENS}</span></div></div></header><section className="stage-content" style={{ paddingLeft: pad, paddingRight: pad }}>{children}<div className={`caption-slot ${audio?.caption && (audio.muted || audio.visualOnly) ? 'is-visible' : ''}`} aria-live="polite"><span>{audio?.caption && (audio.muted || audio.visualOnly) ? audio.caption : ''}</span></div></section><footer className="stage-nav" style={{ paddingLeft: pad, paddingRight: pad }}>{screen === 0 ? <span/> : <button type="button" className="btn-ghost" onClick={onPrev}>← {t({ uz: "Orqaga", ru: 'Назад', en: 'Back' })}</button>}<button type="button" className="btn-white-accent" disabled={nextDisabled || !onNext} onClick={onNext}>{finish ? t({ uz: "Darsni yakunlash", ru: 'Завершить урок', en: 'Finish lesson' }) : t({ uz: "Davom etish", ru: 'Продолжить', en: 'Continue' })} →</button></footer></main>;
};

const InlineCheck = ({ prompt, options, correctIndex, picked, onPick, disabled, note }) => {
  const t = useT();
  const done = picked === correctIndex;
  return <div className="inline-check" data-g4-role="inline-check">
    <span className="inline-check-prompt">{t(prompt)}</span>
    <div className="inline-check-row">{options.map((option, index) => <button type="button" key={index} className={'inline-chip' + (picked === index ? (index === correctIndex ? ' is-right' : ' is-bad') : '')} disabled={disabled || done} onClick={() => onPick(index)}>{t(option)}</button>)}</div>
    <span className="inline-check-note" role="status">{picked === null ? '' : t(done ? note.right : note.wrong)}</span>
  </div>;
};

const FactCard = ({ show, text }) => {
  const t = useT();
  return <div className={'fact-card ' + (show ? 'show' : '')} data-g4-role="fact-card"><b>{t({ uz: 'FAKT', ru: 'ФАКТ', en: 'FACT' })}</b><p>{t(text)}</p></div>;
};

// Kicker doim dars mavzusini ko'rsatadi: ilgari u Stage yuqorisidagi yorliqni
// so'zma-so'z takrorlar edi va ekranda bir xil matn ikki marta turardi.
const TOPIC_KICKER = bi('Kasrlarni ayirish', 'Вычитание дробей', 'Subtracting fractions');
const Heading = ({ c, bit, hook = false, kicker = null }) => { const t = useT(); return <div className="heading"><div><span data-g4-role={hook ? 'hook-topic' : undefined}>{t(kicker ?? TOPIC_KICKER)}</span><h1 data-g4-role={hook ? 'hook-title' : undefined}>{t(c.title)}</h1></div>{bit && !hook && <BitSVG state={bit}/>}</div>; };
const FRAC_ARIA = {
  uz: (n, d) => `kasr ${d} dan ${n}`,
  ru: (n, d) => `дробь ${n} / ${d}`,
  en: (n, d) => `fraction ${n} / ${d}`,
};
const Frac = ({ n, d, size = 'sm' }) => {
  const lang = useLang();
  return <span className={'frac ' + (size === 'lg' ? 'frac-lg' : '')} role="math" aria-label={(FRAC_ARIA[lang] ?? FRAC_ARIA.uz)(n, d)}><span aria-hidden="true">{n}</span><i aria-hidden="true"/><span aria-hidden="true">{d}</span></span>;
};
// wrongSet - allaqachon tanlangan noto'g'ri variantlar. Ular joyida qoladi
// (keep-visible), lekin xiralashadi va qayta bosilmaydi: bola bir xil xatoni
// takrorlab urinmaydi, to'g'ri javobga yo'naltiriladi.
const Options = ({ values, picked, onPick, correctIndex, solved, neutral = false, disabled = false, order = null, wrongSet = null }) => {
  const t = useT();
  const sourceOrder = order ?? values.map((_, index) => index);
  return <div className="options">{sourceOrder.map((sourceIndex, displayIndex) => { const value = values[sourceIndex]; const isWrong = !neutral && (wrongSet ? wrongSet.has(sourceIndex) : picked === sourceIndex && picked !== correctIndex); return <button type="button" data-g4-role="answer-card" data-g4-source-index={order ? sourceIndex : undefined} data-g4-correct={order ? (sourceIndex === correctIndex ? 'true' : 'false') : undefined} key={sourceIndex + '-' + t(value)} className={'option ' + (picked === sourceIndex ? 'picked ' : '') + (!neutral && solved && sourceIndex === correctIndex ? 'right ' : '') + (isWrong ? 'bad' : '')} disabled={disabled || (!neutral && solved) || isWrong} onClick={() => onPick(sourceIndex)}><b>{String.fromCharCode(65 + displayIndex)}</b><span>{t(value)}</span></button>; })}</div>;
};

const FractionBar = ({ den = 8, filled = 0, removed = 0, label = null, compact = false }) => {
  const cells = Array.from({ length: den }, (_, index) => <i key={index} className={index < filled ? 'cyan' : index < filled + removed ? 'removed' : ''}/>);
  return <div className={'fraction-model ' + (compact ? 'compact' : '')}><div className="fraction-bar divided" style={{ gridTemplateColumns: 'repeat(' + den + ', 1fr)' }}>{cells}</div>{label && <div className="model-label">{label}</div>}</div>;
};
const SubtractionLine = ({ den = 10, start = 7, amount = 3, frame = 0, marker = null }) => {
  const end = start - amount;
  const ticks = Array.from({ length: den + 1 }, (_, index) => <i key={index} className="nl-tick" style={{ left: (index / den * 100) + '%' }}><span>{index === 0 ? '0' : index === den ? '1' : ''}</span></i>);
  return <div className="number-line">
    <div className="nl-track">{ticks}</div>
    <b className="nl-dot lime" style={{ left: (start / den * 100) + '%' }}>{start}/{den}</b>
    {frame >= 1 && <div className="nl-arrow back" style={{ left: (end / den * 100) + '%', width: (amount / den * 100) + '%' }}/>}
    {frame >= 2 && <b className="nl-dot cyan" style={{ left: (end / den * 100) + '%' }}>{end}/{den}</b>}
    {marker !== null && <b className="nl-dot free" style={{ left: (marker / den * 100) + '%' }}>{marker}/{den}</b>}
  </div>;
};
const readPoint = (element, board, side) => {
  const box = element.getBoundingClientRect();
  const host = board.getBoundingClientRect();
  return {
    x: side === 'left' ? box.right - host.left : box.left - host.left,
    y: box.top + box.height / 2 - host.top,
  };
};

function MatchingLines({ boardRef, pairs = [], wrongPair = null, localeKey = 'uz' }) {
  const [geometry, setGeometry] = useState({ width: 0, height: 0, lines: [] });

  useLayoutEffect(() => {
    const board = boardRef.current;
    if (!board) return undefined;

    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const host = board.getBoundingClientRect();
        const allPairs = wrongPair ? [...pairs, { ...wrongPair, wrong: true }] : pairs;
        const lines = allPairs.map((pair) => {
          const left = board.querySelector(`[data-match-left="${pair.left}"]`);
          const right = board.querySelector(`[data-match-right="${pair.right}"]`);
          if (!left || !right) return null;
          return { from: readPoint(left, board, 'left'), to: readPoint(right, board, 'right'), wrong: pair.wrong };
        }).filter(Boolean);
        setGeometry({ width: host.width, height: host.height, lines });
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(board);
    board.querySelectorAll('[data-match-left],[data-match-right]').forEach((node) => observer.observe(node));
    window.addEventListener('resize', measure);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [boardRef, pairs, wrongPair, localeKey]);

  return (
    <svg
      className="matching-connectors"
      width={geometry.width}
      height={geometry.height}
      viewBox={`0 0 ${geometry.width || 1} ${geometry.height || 1}`}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, zIndex: 1, overflow: 'visible', pointerEvents: 'none' }}
    >
      {geometry.lines.map((line, index) => {
        const bend = Math.max(24, (line.to.x - line.from.x) * 0.42);
        const path = `M ${line.from.x} ${line.from.y} C ${line.from.x + bend} ${line.from.y}, ${line.to.x - bend} ${line.to.y}, ${line.to.x} ${line.to.y}`;
        return (
          <path
            key={`${path}-${index}`}
            className={line.wrong ? 'matching-connector-wrong' : 'matching-connector-correct'}
            d={path}
            fill="none"
            stroke={line.wrong ? '#B85C32' : '#227A53'}
            strokeWidth="4"
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 2px 3px ${line.wrong ? 'rgba(184,92,50,.28)' : 'rgba(34,122,83,.28)'})`, transition: 'd .55s ease, stroke .55s ease' }}
          />
        );
      })}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// QADAMLI OCHILISH. Tushuntirish ovoz bilan o'zi surilmaydi: bola tugmani
// bosadi, qadam ochiladi va aynan shu qadam ovozlanadi. Ovoz o'chirilganda
// ham butun tushuntirish ko'rinadi - kadr yo'qolib qolmaydi.
// ---------------------------------------------------------------------------
function useStepReveal(content, screen, total) {
  const lang = useLang();
  const audio = useNarration(content.audio, screen);
  const [step, setStep] = useState(0);
  const ready = audio.muted || audio.completed;
  const advance = () => {
    if (!ready || step >= total) return;
    const next = step + 1;
    setStep(next);
    const spoken = content.audio.steps?.[lang]?.[next - 1];
    if (spoken) audio.pushOneOff(spoken);
  };
  return { audio, step, advance, ready, done: step >= total };
}

// Ochilgan qadamlar tepada ixcham chip bo'lib yig'iladi, faol qadamning izohi
// to'liq ko'rinadi. Shu tufayli ekranda ko'p tushuntirish sig'adi va skroll
// paydo bo'lmaydi.
const StepPanel = ({ steps, step, children, done, doneText, onAdvance, ready }) => {
  const t = useT();
  const active = step > 0 ? steps[step - 1] : null;
  return (
    <section className="step-panel" data-g4-role="visual-frame">
      <div className="step-model">{children}</div>
      <div className="step-chips">
        {steps.map((item, index) => (
          <span key={index} className={'step-chip' + (index < step ? ' is-done' : '') + (index === step - 1 ? ' is-active' : '')}>
            <b aria-hidden="true">{index < step ? '✓' : index + 1}</b>
            <span>{t(item.chip)}</span>
          </span>
        ))}
      </div>
      <p className="step-caption" role="status" aria-live="polite">{active ? t(active.caption) : ''}</p>
      <div className="step-actions">
        {!done && (
          <button type="button" className="btn-step" disabled={!ready} onClick={onAdvance}>
            {t(step === 0
              ? { uz: 'Boshlash', ru: 'Начать', en: 'Start' }
              : { uz: 'Keyingi qadam', ru: 'Следующий шаг', en: 'Next step' })}
          </button>
        )}
        {done && <span className="step-done">{t(doneText)}</span>}
      </div>
    </section>
  );
};

// Zaxira modeli: gorizontal rezervuar, o'ngda tumanga ketadigan quvur.
// Darsning imzo modeli, faqat maxraji yetti bo'lgan holatlarda ishlatiladi.
const ReserveStrip = ({ den = 7, filled = 0, leaving = 0, sent = null, onTap = null, label = null, compact = false }) => {
  const lang = useLang();
  const cellLabel = (index, state) => ({
    uz: `${index + 1} bo'lim, ${state}`,
    ru: `отсек ${index + 1}, ${state}`,
    en: `section ${index + 1}, ${state}`,
  }[lang]);
  const stateName = (state) => ({
    uz: { full: "to'la", leaving: 'jo\'natilyapti', empty: "bo'sh" },
    ru: { full: 'полный', leaving: 'отправляется', empty: 'пустой' },
    en: { full: 'full', leaving: 'being sent', empty: 'empty' },
  }[lang][state]);
  const cells = Array.from({ length: den }, (_, index) => {
    const dispatched = sent ? sent.has(index) : index >= filled - leaving && index < filled;
    const state = index >= filled ? 'empty' : dispatched ? 'leaving' : 'full';
    if (!onTap) return <i key={index} className={'reserve-cell is-' + state} />;
    return (
      <button
        type="button"
        key={index}
        className={'reserve-cell is-' + state}
        aria-label={cellLabel(index, stateName(state))}
        onClick={() => onTap(index)}
      />
    );
  });
  return (
    <div className={'reserve ' + (compact ? 'compact' : '')}>
      <div className="reserve-shell">
        <span className="reserve-scale" aria-hidden="true">{den}</span>
        <div className="reserve-cells" style={{ gridTemplateColumns: 'repeat(' + den + ', 1fr)' }}>{cells}</div>
        <span className="reserve-pipe" aria-hidden="true" />
      </div>
      {label && <div className="model-label">{label}</div>}
    </div>
  );
};

// Butun -> kasr. Bir bo'lak butun tasma, keyin maxrajga bo'linadi, keyin bir
// qismi chiqib ketadi.
const WholeSplitBar = ({ den = 15, split = false, removed = 0, label = null }) => {
  const cells = Array.from({ length: den }, (_, index) => (
    <i key={index} className={index >= den - removed ? 'removed' : 'cyan'} />
  ));
  return (
    <div className="whole-split">
      {split
        ? <div className="fraction-bar divided" style={{ gridTemplateColumns: 'repeat(' + den + ', 1fr)' }}>{cells}</div>
        : <div className="fraction-bar whole-solid"><span>1</span></div>}
      {label && <div className="model-label">{label}</div>}
    </div>
  );
};

// Klaviatura yo'q: javob raqam plitasini bosish bilan beriladi (44 px zona).
const DigitChoice = ({ picked, onPick, disabled, solved, answer }) => {
  const t = useT();
  return (
    <div className="digit-pad" role="group" aria-label={t({ uz: 'Raqamlar', ru: 'Цифры', en: 'Digits' })}>
      {Array.from({ length: 10 }, (_, digit) => (
        <button
          type="button"
          key={digit}
          className={'digit-key' + (picked === digit ? (digit === answer ? ' is-right' : ' is-bad') : '') + (solved && digit === answer ? ' is-right' : '')}
          disabled={disabled || solved}
          onClick={() => onPick(digit)}
        >
          {digit}
        </button>
      ))}
    </div>
  );
};

const ErrorCard = ({ top, bottom }) => (
  <div className="error-card" data-g4-role="visual-frame">
    <div className="error-record">
      <span className="mono">{top}</span>
      <b className="mono">{bottom}</b>
    </div>
    <span className="error-mark" aria-hidden="true">✗</span>
  </div>
);

const TaskTable = ({ heads, cells }) => {
  const t = useT();
  return (
    <div className="task-table" role="table">
      <div className="task-row task-head" role="row">{heads.map((head, index) => <span key={index} role="columnheader">{t(head)}</span>)}</div>
      <div className="task-row" role="row">{cells.map((cell, index) => <span key={index} className="mono" role="cell">{cell}</span>)}</div>
    </div>
  );
};

// Ikki yo'l yonma-yon, ramkalar o'lchami bir xil va markazda.
const RouteCards = ({ routes, picked, onPick, disabled, correctIndex }) => {
  const t = useT();
  return (
    <div className="route-cards">
      {routes.map((route, index) => (
        <button
          type="button"
          key={index}
          className={'route-card' + (picked === index ? ' is-picked' : '') + (picked !== null && index === correctIndex ? ' is-best' : '')}
          disabled={disabled || picked !== null}
          onClick={() => onPick(index)}
        >
          <span className="route-label">{t(route.label)}</span>
          <span className="route-body mono">{t(route.body)}</span>
          <span className="route-steps">{t(route.steps)}</span>
        </button>
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------------
// EKRANLAR
// ---------------------------------------------------------------------------

function Screen0({ screen, storedAnswer, onAnswer, onNext }) {
  const t = useT();
  const c = CONTENT.s0;
  const audio = useNarration(c.audio, screen);
  const ready = audio.muted || audio.completed;
  const frame = audio.frame;
  const [picked, setPicked] = useState(storedAnswer?.studentAnswerIndex ?? null);
  const pick = (index) => {
    if (!ready || picked !== null) return;
    setPicked(index);
    audio.pushOneOff(t(c.neutral));
    onAnswer({
      screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question),
      options: c.options.map(t), correctIndex: null, correctAnswer: null,
      studentAnswerIndex: index, studentAnswer: t(c.options[index]),
      correct: true, firstTry: true, attempts: 1, solved: true,
    });
  };
  return (
    <Stage screen={screen} audio={audio} onNext={onNext} nextDisabled={picked === null || !ready}>
      <div className="stack hook-stack" data-g4-screen="hook">
        <Heading c={c} hook />
        <h2 className="hook-question-prompt" data-g4-role="hook-question">{t(c.question)}</h2>
        <section className="hook-scene-adapter" data-g4-role="hook-scene">
          <div className="hook-scene-visual" data-g4-role="visual-frame">
            <section className="hook-model">
              <ReserveStrip den={7} filled={6} leaving={frame >= 1 ? 2 : 0} />
              <div className={'hook-record mono' + (frame >= 2 ? ' show' : '')}>
                6/7 − 2/7 = <b>4/0</b> ?
              </div>
            </section>
            <div className="hook-frame-bit" data-g4-role="hook-bit"><BitSVG state="think" /></div>
          </div>
        </section>
        <section className="question" data-g4-role="answer-card">
          <Options values={c.options} picked={picked} onPick={pick} neutral disabled={!ready || picked !== null} />
          <FeedbackBlock show={picked !== null} correct>{t(c.neutral)}</FeedbackBlock>
        </section>
      </div>
    </Stage>
  );
}

function Screen1({ screen, onNext, onPrev }) {
  const c = CONTENT.s1;
  const audio = useNarration(c.audio, screen);
  const ready = audio.muted || audio.completed;
  const [picked, setPicked] = useState(null);
  const solved = picked === c.correctIndex;
  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!solved || !ready}>
      <div className="stack">
        <Heading c={c} />
        <section className="model-card">
          <FractionBar den={7} filled={6} label={<span><Frac n="6" d="7" size="lg" /></span>} />
        </section>
        <InlineCheck
          prompt={c.prompt}
          options={c.chips}
          correctIndex={c.correctIndex}
          picked={picked}
          onPick={(index) => { if (ready) setPicked(index); }}
          disabled={!ready}
          note={c.note}
        />
      </div>
    </Stage>
  );
}

function Screen2({ screen, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s2;
  const { audio, step, advance, ready, done } = useStepReveal(c, screen, 3);
  const filled = step >= 3 ? 4 : 6;
  const leaving = step === 2 ? 2 : 0;
  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!done}>
      <div className="stack">
        <Heading c={c} />
        <p className="lead-line">{t(c.lead)}</p>
        <StepPanel steps={c.steps} step={step} done={done} doneText={c.done} onAdvance={advance} ready={ready}>
          <ReserveStrip den={7} filled={filled} leaving={leaving} label={step >= 3 ? <span><Frac n="4" d="7" size="lg" /></span> : null} />
        </StepPanel>
      </div>
    </Stage>
  );
}

function Screen3({ screen, storedAnswer, onAnswer, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s3;
  const audio = useNarration(c.audio, screen);
  const ready = audio.muted || audio.completed;
  const [sent, setSent] = useState(() => new Set(storedAnswer?.sentCells ?? []));
  const [hint, setHint] = useState(false);
  const clean = useRef(storedAnswer?.firstTry ?? true);
  const solved = sent.size === 2;
  const reported = useRef(storedAnswer?.solved === true);
  const tap = (index) => {
    if (!ready || solved) return;
    if (index >= 5) { clean.current = false; setHint(true); playSfx('wrong'); return; }
    setSent((previous) => {
      const next = new Set(previous);
      if (next.has(index)) next.delete(index);
      else if (next.size < 2) next.add(index);
      else { clean.current = false; setHint(true); }
      return next;
    });
  };
  useEffect(() => {
    if (!solved || reported.current) return;
    reported.current = true;
    setHint(false);
    playSfx('correct');
    audio.pushOneOff(t(c.audio.on_correct));
    onAnswer({
      screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.task),
      options: [], correctIndex: null, correctAnswer: t(c.proof),
      studentAnswerIndex: null, studentAnswer: t(c.proof),
      correct: true, firstTry: clean.current, attempts: 1, solved: true,
      sentCells: [...sent],
    });
  }, [solved, sent, audio, c, onAnswer, screen, t]);
  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!solved || !ready}>
      <div className="stack">
        <Heading c={c} />
        <p className="lead-line">{t(c.lead)}</p>
        <section className="model-card" data-g4-role="visual-frame">
          <span className="task-chip mono">{t(c.task)}</span>
          <ReserveStrip den={7} filled={5} sent={sent} onTap={tap} />
          <span className="remaining-line">{t(c.remaining)}: <b className="mono">{5 - sent.size}/7</b></span>
        </section>
        <FeedbackBlock show={solved || hint} correct={solved} proof={solved ? t(c.proof) : null}>
          {solved ? t(c.doneText) : t(c.hint)}
        </FeedbackBlock>
      </div>
    </Stage>
  );
}

function Screen4({ screen, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s4;
  const { audio, step, advance, ready, done } = useStepReveal(c, screen, 3);
  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!done}>
      <div className="stack">
        <Heading c={c} />
        <p className="lead-line">{t(c.lead)}</p>
        <StepPanel steps={c.steps} step={step} done={done} doneText={c.done} onAdvance={advance} ready={ready}>
          <SubtractionLine den={16} start={13} amount={6} frame={Math.max(0, step - 1)} />
        </StepPanel>
      </div>
    </Stage>
  );
}

function Screen5({ screen, storedAnswer, onAnswer, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s5;
  const audio = useNarration(c.audio, screen);
  const ready = audio.muted || audio.completed;
  const [picked, setPicked] = useState(storedAnswer?.studentAnswerIndex ?? null);
  const [solved, setSolved] = useState(storedAnswer?.correct === true);
  const attempts = useRef(storedAnswer?.attempts ?? 0);
  const clean = useRef(storedAnswer?.firstTry ?? true);
  const pick = (digit) => {
    if (!ready || solved) return;
    attempts.current += 1;
    const ok = digit === c.answer;
    if (!ok) clean.current = false;
    setPicked(digit);
    setSolved(ok);
    playSfx(ok ? 'correct' : 'wrong');
    audio.pushOneOff(t(ok ? c.audio.on_correct : c.audio.on_wrong));
    onAnswer({
      screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question),
      options: [], correctIndex: c.answer, correctAnswer: String(c.answer),
      studentAnswerIndex: digit, studentAnswer: String(digit),
      correct: ok, firstTry: ok && clean.current && attempts.current === 1,
      attempts: attempts.current, solved: ok,
    });
  };
  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!solved || !ready}>
      <div className="stack">
        <Heading c={c} />
        <section className="model-card" data-g4-role="visual-frame">
          <FractionBar den={16} filled={15} removed={0} label={<span className="mono">{t(c.question)}</span>} />
        </section>
        <DigitChoice picked={picked} onPick={pick} disabled={!ready} solved={solved} answer={c.answer} />
        <FeedbackBlock show={picked !== null} correct={solved} proof={solved ? t(c.proof) : null}>
          {solved || picked === null ? '' : t(c.hint)}
        </FeedbackBlock>
      </div>
    </Stage>
  );
}

function Screen6({ screen, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s6;
  const { audio, step, advance, ready, done } = useStepReveal(c, screen, 2);
  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!done}>
      <div className="stack">
        <Heading c={c} />
        <p className="lead-line">{t(c.lead)}</p>
        <StepPanel steps={c.steps} step={step} done={done} doneText={c.done} onAdvance={advance} ready={ready}>
          <WholeSplitBar
            den={15}
            split={step >= 1}
            removed={step >= 2 ? 4 : 0}
            label={step >= 2 ? <span className="mono">15/15 − 4/15 = 11/15</span> : (step >= 1 ? <span className="mono">1 = 15/15</span> : <span className="mono">1</span>)}
          />
        </StepPanel>
      </div>
    </Stage>
  );
}

// Bir xil yozuvli variantli ekranlar uchun umumiy tana. Har ekranda model
// boshqa bo'ladi, shuning uchun qolip takrorlanmaydi.
function ChoiceBody({ screen, c, ordinal, storedAnswer, onAnswer, onNext, onPrev, model = null, bit = null, compact = false }) {
  const t = useT();
  const audio = useNarration(c.audio, screen);
  const ready = audio.muted || audio.completed;
  const order = useMemo(
    () => buildOptionOrder(c.options.length, c.correctIndex, LESSON_META.lessonId, ordinal),
    [c.correctIndex, c.options.length, ordinal],
  );
  const [picked, setPicked] = useState(storedAnswer?.studentAnswerIndex ?? null);
  const [solved, setSolved] = useState(storedAnswer?.correct === true);
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const attempts = useRef(storedAnswer?.attempts ?? 0);
  const clean = useRef(storedAnswer?.firstTry ?? true);
  const scored = SCREEN_META[screen].scored === true;
  const pick = (index) => {
    if (!ready || solved || wrongSet.has(index)) return;
    attempts.current += 1;
    const ok = index === c.correctIndex;
    if (!ok) { clean.current = false; setWrongSet((previous) => new Set([...previous, index])); }
    setPicked(index);
    setSolved(ok);
    playSfx(ok ? 'correct' : 'wrong');
    audio.pushOneOff(t(c.feedbackAudio[index]));
    onAnswer({
      screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question),
      options: c.options.map(t), correctIndex: c.correctIndex, correctAnswer: t(c.options[c.correctIndex]),
      studentAnswerIndex: index, studentAnswer: t(c.options[index]),
      correct: ok, firstTry: ok && clean.current && attempts.current === 1,
      attempts: attempts.current, solved: ok, scoredScreen: scored,
    });
  };
  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!solved || !ready}>
      <div className="stack">
        <Heading c={c} bit={bit} />
        {model && <section className={'model-card' + (compact ? ' compact' : '')} data-g4-role="visual-frame">{model}</section>}
        <section className="question">
          <h2>{t(c.question)}</h2>
          <Options values={c.options} picked={picked} onPick={pick} correctIndex={c.correctIndex} solved={solved} disabled={!ready} order={order} wrongSet={wrongSet} />
          <FeedbackBlock show={picked !== null} correct={solved} proof={solved && c.proof ? t(c.proof) : null}>
            {picked === null ? '' : t(c.feedback[picked])}
          </FeedbackBlock>
        </section>
      </div>
    </Stage>
  );
}

function Screen7(props) {
  const c = CONTENT.s7;
  return <ChoiceBody {...props} c={c} ordinal={0} model={<WholeSplitBar den={15} split removed={0} label={<span className="mono">1 = 15/15</span>} />} />;
}

function Screen8({ screen, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s8;
  const audio = useNarration(c.audio, screen);
  const ready = audio.muted || audio.completed;
  const frame = audio.frame;
  const [picked, setPicked] = useState(null);
  const solved = picked === c.check.correctIndex;
  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!solved || !ready}>
      <div className="stack">
        <Heading c={c} />
        <section className="rule-frame">
          <span className="rule-badge">{t({ uz: 'QOIDA', ru: 'ПРАВИЛО', en: 'RULE' })}</span>
          {/* Qoida matni darhol to'liq ko'rinadi: bola uni o'qishi kerak, ovoz
              esa faqat uni takrorlaydi. Faqat tayanch chiplar va yozuv ovoz
              bilan yonadi. */}
          <p className="rule-text show">{t(c.rule)}</p>
          <div className="rule-lines">
            {c.lines.map((line, index) => (
              <span key={index} className={'rule-line' + (frame >= 1 ? ' show' : '')}>{t(line)}</span>
            ))}
          </div>
          <strong className={'rule-formula mono' + (frame >= 2 ? ' show' : '')}>{t(c.formula)}</strong>
          <small className="rule-source">{t(c.ruleSource)}</small>
        </section>
        <InlineCheck
          prompt={c.check.prompt}
          options={c.check.chips}
          correctIndex={c.check.correctIndex}
          picked={picked}
          onPick={(index) => { if (ready) setPicked(index); }}
          disabled={!ready}
          note={c.check.note}
        />
      </div>
    </Stage>
  );
}

function Screen9(props) {
  const c = CONTENT.s9;
  const t = useT();
  return <ChoiceBody {...props} c={c} ordinal={1} bit="hint" compact model={<ErrorCard top={t(c.errorTop)} bottom={t(c.errorBottom)} />} />;
}

// Uch savol ketma-ket. Oxirgi savol ekranda qoladi, natija ramkasi tagida
// ochiladi (3-sinf qoidasi 33).
function Screen10({ screen, storedAnswer, onAnswer, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s10;
  const audio = useNarration(c.audio, screen);
  const ready = audio.muted || audio.completed;
  const total = c.rounds.length;
  const [index, setIndex] = useState(storedAnswer?.roundIndex ?? 0);
  const [picked, setPicked] = useState(null);
  const [solvedRound, setSolvedRound] = useState(false);
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const [correctCount, setCorrectCount] = useState(storedAnswer?.correctCount ?? 0);
  const [firstTryCount, setFirstTryCount] = useState(storedAnswer?.firstTryCount ?? 0);
  const attempts = useRef(0);
  const done = index >= total - 1 && solvedRound;
  const round = c.rounds[Math.min(index, total - 1)];
  // Har raund uchun alohida ordinal: to'g'ri javob uch savolda uch xil
  // pozitsiyada turadi va tartib dars ochilishida barqaror qoladi.
  /* eslint-disable react-hooks/exhaustive-deps -- CONTENT modul konstantasi: tartib bir marta hisoblanadi */
  const roundOrder0 = useMemo(() => buildOptionOrder(c.rounds[0].options.length, c.rounds[0].correctIndex, LESSON_META.lessonId, 2), []);
  const roundOrder1 = useMemo(() => buildOptionOrder(c.rounds[1].options.length, c.rounds[1].correctIndex, LESSON_META.lessonId, 3), []);
  const roundOrder2 = useMemo(() => buildOptionOrder(c.rounds[2].options.length, c.rounds[2].correctIndex, LESSON_META.lessonId, 4), []);
  /* eslint-enable react-hooks/exhaustive-deps */
  const roundOrders = [roundOrder0, roundOrder1, roundOrder2];
  const order = roundOrders[Math.min(index, total - 1)];
  const pick = (option) => {
    if (!ready || solvedRound || wrongSet.has(option)) return;
    attempts.current += 1;
    const ok = option === round.correctIndex;
    if (!ok) setWrongSet((previous) => new Set([...previous, option]));
    setPicked(option);
    playSfx(ok ? 'correct' : 'wrong');
    audio.pushOneOff(t(round.feedbackAudio[option]));
    if (!ok) return;
    setSolvedRound(true);
    const nextCorrect = correctCount + 1;
    const nextFirstTry = firstTryCount + (attempts.current === 1 ? 1 : 0);
    setCorrectCount(nextCorrect);
    setFirstTryCount(nextFirstTry);
    onAnswer({
      screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(round.question),
      options: round.options.map(t), correctIndex: round.correctIndex, correctAnswer: t(round.options[round.correctIndex]),
      studentAnswerIndex: option, studentAnswer: t(round.options[option]),
      correct: nextCorrect === total, firstTry: nextFirstTry === total,
      attempts: attempts.current, solved: nextCorrect === total,
      roundIndex: index, correctCount: nextCorrect, firstTryCount: nextFirstTry,
    });
  };
  const nextRound = () => {
    if (index >= total - 1) return;
    setIndex((value) => value + 1);
    setPicked(null);
    setSolvedRound(false);
    setWrongSet(new Set());
    attempts.current = 0;
  };
  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!done || !ready}>
      <div className="stack">
        <Heading c={c} />
        <span className="round-meter">{t({ uz: 'Savol', ru: 'Вопрос', en: 'Question' })} {Math.min(index + 1, total)} / {total}</span>
        <section className="question round-question">
          <h2 className="mono">{t(round.question)}</h2>
          <Options values={round.options} picked={picked} onPick={pick} correctIndex={round.correctIndex} solved={solvedRound} disabled={!ready} order={order} wrongSet={wrongSet} />
          <FeedbackBlock show={picked !== null} correct={solvedRound} proof={solvedRound ? t(round.proof) : null}>
            {picked === null ? '' : t(round.feedback[picked])}
          </FeedbackBlock>
          {solvedRound && index < total - 1 && (
            <button type="button" className="btn-step" onClick={nextRound}>
              {t({ uz: 'Keyingi savol', ru: 'Следующий вопрос', en: 'Next question' })}
            </button>
          )}
        </section>
      </div>
    </Stage>
  );
}

function Screen11({ screen, storedAnswer, onAnswer, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s11;
  const audio = useNarration(c.audio, screen);
  const ready = audio.muted || audio.completed;
  const [picked, setPicked] = useState(storedAnswer?.studentAnswerIndex ?? null);
  const pick = (index) => {
    if (!ready || picked !== null) return;
    setPicked(index);
    audio.pushOneOff(t(c.feedbackAudio[index]));
    onAnswer({
      screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question),
      options: c.routes.map((route) => t(route.label)), correctIndex: c.correctIndex,
      correctAnswer: t(c.routes[c.correctIndex].label),
      studentAnswerIndex: index, studentAnswer: t(c.routes[index].label),
      correct: true, firstTry: index === c.correctIndex, attempts: 1, solved: true,
    });
  };
  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={picked === null || !ready}>
      <div className="stack">
        <Heading c={c} />
        <h2 className="strategy-question">{t(c.question)}</h2>
        <RouteCards routes={c.routes} picked={picked} onPick={pick} disabled={!ready} correctIndex={c.correctIndex} />
        <FeedbackBlock show={picked !== null} correct={picked === c.correctIndex}>
          {picked === null ? '' : t(c.feedback[picked])}
        </FeedbackBlock>
      </div>
    </Stage>
  );
}

function Screen12({ screen, storedAnswer, onAnswer, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s12;
  const audio = useNarration(c.audio, screen);
  const ready = audio.muted || audio.completed;
  const [picked, setPicked] = useState(storedAnswer?.studentAnswerIndex ?? null);
  const [solved, setSolved] = useState(storedAnswer?.correct === true);
  const attempts = useRef(storedAnswer?.attempts ?? 0);
  const clean = useRef(storedAnswer?.firstTry ?? true);
  const pick = (digit) => {
    if (!ready || solved) return;
    attempts.current += 1;
    const ok = digit === c.answer;
    if (!ok) clean.current = false;
    setPicked(digit);
    setSolved(ok);
    playSfx(ok ? 'correct' : 'wrong');
    audio.pushOneOff(t(ok ? c.audio.on_correct : c.audio.on_wrong));
    onAnswer({
      screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question),
      options: [], correctIndex: c.answer, correctAnswer: String(c.answer),
      studentAnswerIndex: digit, studentAnswer: String(digit),
      correct: ok, firstTry: ok && clean.current && attempts.current === 1,
      attempts: attempts.current, solved: ok,
    });
  };
  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!solved || !ready}>
      <div className="stack">
        <Heading c={c} />
        <p className="lead-line">{t(c.story)}</p>
        <section className="model-card case-card" data-g4-role="visual-frame">
          <TaskTable heads={c.table.heads} cells={c.table.cells} />
          <ReserveStrip den={7} filled={5} leaving={solved ? 2 : 0} compact />
        </section>
        <h2 className="case-question">{t(c.question)}</h2>
        <DigitChoice picked={picked} onPick={pick} disabled={!ready} solved={solved} answer={c.answer} />
        <FeedbackBlock show={picked !== null} correct={solved} proof={solved ? t(c.proof) : null}>
          {solved || picked === null ? '' : t(c.hint)}
        </FeedbackBlock>
      </div>
    </Stage>
  );
}

function Screen13({ screen, storedAnswer, onAnswer, onNext, onPrev }) {
  const t = useT();
  const lang = useLang();
  const c = CONTENT.s13;
  const audio = useNarration(c.audio, screen);
  const ready = audio.muted || audio.completed;
  const boardRef = useRef(null);
  const [activeLeft, setActiveLeft] = useState(null);
  const [pairs, setPairs] = useState(storedAnswer?.pairs ?? []);
  const [wrongPair, setWrongPair] = useState(null);
  const clean = useRef(storedAnswer?.firstTry ?? true);
  const attempts = useRef(storedAnswer?.attempts ?? 0);
  const solved = pairs.length === c.left.length;
  const reported = useRef(storedAnswer?.solved === true);
  const takenLeft = new Set(pairs.map((pair) => pair.left));
  const takenRight = new Set(pairs.map((pair) => pair.right));
  const pickRight = (rightId) => {
    if (!ready || solved || activeLeft === null || takenRight.has(rightId)) return;
    attempts.current += 1;
    const target = c.right.find((item) => item.id === rightId);
    if (target && target.pair === activeLeft) {
      setPairs((previous) => [...previous, { left: activeLeft, right: rightId }]);
      setActiveLeft(null);
      setWrongPair(null);
      playSfx('correct');
    } else {
      clean.current = false;
      setWrongPair({ left: activeLeft, right: rightId });
      playSfx('wrong');
      audio.pushOneOff(t(c.audio.on_wrong));
    }
  };
  useEffect(() => {
    if (!solved || reported.current) return;
    reported.current = true;
    setWrongPair(null);
    audio.pushOneOff(t(c.audio.on_correct));
    onAnswer({
      screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.title),
      options: c.left.map((item) => t(item.label)), correctIndex: null,
      correctAnswer: t(c.doneNote), studentAnswerIndex: null, studentAnswer: t(c.doneNote),
      correct: true, firstTry: clean.current, attempts: attempts.current, solved: true, pairs,
    });
  }, [solved, pairs, audio, c, onAnswer, screen, t]);
  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!solved || !ready}>
      <div className="stack">
        <Heading c={c} />
        <p className="lead-line">{t(c.prompt)}</p>
        <section className="matching-board" ref={boardRef}>
          <MatchingLines boardRef={boardRef} pairs={pairs} wrongPair={wrongPair} localeKey={lang} />
          <div className="matching-column">
            {c.left.map((item) => (
              <button
                type="button"
                key={item.id}
                data-match-left={item.id}
                className={'match-card' + (activeLeft === item.id ? ' is-active' : '') + (takenLeft.has(item.id) ? ' is-done' : '')}
                disabled={!ready || takenLeft.has(item.id) || solved}
                onClick={() => setActiveLeft(item.id)}
              >
                <span className="mono">{t(item.label)}</span>
              </button>
            ))}
          </div>
          <div className="matching-column">
            {c.right.map((item) => (
              <button
                type="button"
                key={item.id}
                data-match-right={item.id}
                className={'match-card' + (takenRight.has(item.id) ? ' is-done' : '')}
                disabled={!ready || takenRight.has(item.id) || solved}
                onClick={() => pickRight(item.id)}
              >
                <FractionBar den={item.den} filled={item.filled} compact />
                <span className="mono match-caption">{t(item.caption)}</span>
              </button>
            ))}
          </div>
        </section>
        <FeedbackBlock show={solved || wrongPair !== null} correct={solved}>
          {solved ? t(c.doneNote) : t(c.wrongNote)}
        </FeedbackBlock>
      </div>
    </Stage>
  );
}

function Screen14({ screen, storedAnswer, onAnswer, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s14;
  const audio = useNarration(c.audio, screen);
  const ready = audio.muted || audio.completed;
  const total = c.items.length;
  const [index, setIndex] = useState(storedAnswer?.itemIndex ?? 0);
  const [picked, setPicked] = useState(null);
  const [solvedItem, setSolvedItem] = useState(false);
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const [correctCount, setCorrectCount] = useState(storedAnswer?.correctCount ?? 0);
  const [firstTryCount, setFirstTryCount] = useState(storedAnswer?.firstTryCount ?? 0);
  const attempts = useRef(0);
  const item = c.items[Math.min(index, total - 1)];
  const done = index >= total - 1 && solvedItem;
  // Yakuniy topshiriqlarning ikkitasi variantli: har biriga o'z ordinali.
  /* eslint-disable react-hooks/exhaustive-deps -- CONTENT modul konstantasi: tartib bir marta hisoblanadi */
  const itemOrder1 = useMemo(() => buildOptionOrder(c.items[1].options.length, c.items[1].correctIndex, LESSON_META.lessonId, 5), []);
  const itemOrder2 = useMemo(() => buildOptionOrder(c.items[2].options.length, c.items[2].correctIndex, LESSON_META.lessonId, 6), []);
  /* eslint-enable react-hooks/exhaustive-deps */
  const itemOrders = [null, itemOrder1, itemOrder2];
  const order = itemOrders[Math.min(index, total - 1)];
  const register = (ok, studentAnswer, correctAnswer) => {
    const nextCorrect = correctCount + (ok ? 1 : 0);
    const nextFirstTry = firstTryCount + (ok && attempts.current === 1 ? 1 : 0);
    if (ok) { setCorrectCount(nextCorrect); setFirstTryCount(nextFirstTry); setSolvedItem(true); }
    onAnswer({
      screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(item.question),
      options: item.options ? item.options.map(t) : [], correctIndex: item.options ? item.correctIndex : item.answer,
      correctAnswer, studentAnswerIndex: null, studentAnswer,
      correct: nextCorrect === total, firstTry: nextFirstTry === total,
      attempts: attempts.current, solved: nextCorrect === total,
      itemIndex: index, correctCount: nextCorrect, firstTryCount: nextFirstTry,
    });
  };
  const pickDigit = (digit) => {
    if (!ready || solvedItem) return;
    attempts.current += 1;
    const ok = digit === item.answer;
    setPicked(digit);
    playSfx(ok ? 'correct' : 'wrong');
    audio.pushOneOff(t(ok ? item.audio.on_correct : item.audio.on_wrong));
    register(ok, String(digit), String(item.answer));
  };
  const pickOption = (option) => {
    if (!ready || solvedItem || wrongSet.has(option)) return;
    attempts.current += 1;
    const ok = option === item.correctIndex;
    if (!ok) setWrongSet((previous) => new Set([...previous, option]));
    setPicked(option);
    playSfx(ok ? 'correct' : 'wrong');
    // Har bir variantning o'z izohi aytiladi; umumiy on_wrong faqat zaxira.
    audio.pushOneOff(t(item.feedbackAudio?.[option] ?? (ok ? item.audio.on_correct : item.audio.on_wrong)));
    register(ok, t(item.options[option]), t(item.options[item.correctIndex]));
  };
  const nextItem = () => {
    if (index >= total - 1) return;
    setIndex((value) => value + 1);
    setPicked(null);
    setSolvedItem(false);
    setWrongSet(new Set());
    attempts.current = 0;
  };
  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!done || !ready}>
      <div className="stack">
        <Heading c={c} />
        <span className="round-meter">{t({ uz: 'Topshiriq', ru: 'Задание', en: 'Task' })} {Math.min(index + 1, total)} / {total}</span>
        <section className="question round-question">
          <h2 className="mono">{t(item.question)}</h2>
          {item.kind === 'num'
            ? <DigitChoice picked={picked} onPick={pickDigit} disabled={!ready} solved={solvedItem} answer={item.answer} />
            : <Options values={item.options} picked={picked} onPick={pickOption} correctIndex={item.correctIndex} solved={solvedItem} disabled={!ready} order={order} wrongSet={wrongSet} />}
          <FeedbackBlock show={picked !== null} correct={solvedItem} proof={solvedItem ? t(item.proof) : null}>
            {picked === null ? '' : (item.kind === 'num' ? (solvedItem ? '' : t(item.hint)) : t(item.feedback[picked]))}
          </FeedbackBlock>
          {solvedItem && index < total - 1 && (
            <button type="button" className="btn-step" onClick={nextItem}>
              {t({ uz: 'Keyingi topshiriq', ru: 'Следующее задание', en: 'Next task' })}
            </button>
          )}
        </section>
        <FactCard show={done} text={c.fact} />
      </div>
    </Stage>
  );
}


// ---------------------------------------------------------------------------
// YAKUNIY EKRAN — etalon Dars01 tuzilishi (metodist talabi 2026-08-19).
// Tarkibi: yakuniy bosqich sarlavhasi -> yakuniy savol kartasi (uch variant) ->
// yopilib turadigan qoida ro'yxati -> mukofot paneli (yopiq holatdan ochiladi).
// Unvon faqat yakuniy savolga to'g'ri javob berilgandan keyin ochiladi, dars ham
// shundan keyin yakunlanadi. Javob storedAnswer orqali saqlanadi: orqaga qaytib
// qaytganda tanlov joyida qoladi.
// ---------------------------------------------------------------------------
function G4TitleReveal({ active, title, onComplete }) {
  const t = useT();
  const [visible, setVisible] = useState(false);
  const wasActiveRef = useRef(active);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);
  useEffect(() => {
    const wasActive = wasActiveRef.current;
    wasActiveRef.current = active;
    if (!active || wasActive || typeof window === 'undefined') return undefined;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const frame = window.requestAnimationFrame(() => setVisible(true));
    const timer = window.setTimeout(() => { setVisible(false); onCompleteRef.current?.(); }, reduced ? 120 : 3900);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [active]);
  if (!visible || typeof document === 'undefined') return null;
  return createPortal(
    <div className="rank-boost-overlay g4-title-reveal-overlay" data-g4-role="rank-overlay" role="status" aria-live="assertive" aria-atomic="true">
      <div className="rank-boost-card g4-title-reveal-card">
        <div className="rank-boost-rays g4-title-reveal-rays" aria-hidden="true" />
        <div className="rank-boost-confetti g4-title-reveal-confetti" aria-hidden="true">
          {Array.from({ length: 18 }, (_, index) => <i key={index} />)}
        </div>
        <div className="rank-boost-medal g4-title-reveal-medal" aria-hidden="true">★</div>
        <h2 className="g4-title-reveal-title">{t(title)}</h2>
      </div>
    </div>,
    document.body,
  );
}

// Mukofot paneli: yakuniy savolga to'g'ri javob berilgunicha yopiq turadi.
const G4TitleCard = ({ title, solved, firstTry, total }) => {
  const t = useT();
  return (
    <div className={`reward-stage reward-stage-compact ${solved ? 'reward-unlocked' : 'reward-locked'}`} data-g4-role="title-card">
      {solved && (
        <div className="reward-confetti" data-g4-role="reward-confetti" aria-hidden="true">
          {Array.from({ length: 12 }, (_, index) => <i key={index} />)}
        </div>
      )}
      <div className="reward-bit" data-g4-role="reward-bit"><BitSVG state={solved ? 'happy' : 'present'} /></div>
      <div className="reward-medal" data-g4-role="reward-medal" aria-hidden="true">{solved ? '★' : '○'}</div>
      <span className="reward-kicker">
        {t(solved
          ? { uz: 'UNVON OLINDI', ru: 'ЗВАНИЕ ПОЛУЧЕНО', en: 'TITLE EARNED' }
          : { uz: 'MUKOFOT KUTILMOQDA', ru: 'НАГРАДА ЖДЁТ', en: 'THE REWARD AWAITS' })}
      </span>
      <h2>{t(solved ? title : { uz: 'Unvonni oching', ru: 'Открой звание', en: 'Unlock your title' })}</h2>
      <div className="reward-score">
        <strong>{firstTry}/{total}</strong>
        <span>{t({ uz: 'birinchi urinishda', ru: 'с первой попытки', en: 'on the first attempt' })}</span>
      </div>
    </div>
  );
};

const EtalonFinalScreen = ({ screen, c, answers, storedAnswer, onAnswer, onPrev, finishLesson }) => {
  const t = useT();
  const audio = useNarration(c.audio, screen);
  /* eslint-disable react-hooks/exhaustive-deps -- CONTENT modul konstantasi: tartib bir marta hisoblanadi */
  const order = useMemo(
    () => buildOptionOrder(c.options.length, c.correctIndex, LESSON_META.lessonId, 9),
    [],
  );
  /* eslint-enable react-hooks/exhaustive-deps */
  const [reflection, setReflection] = useState(storedAnswer?.reflection ?? null);
  const [wrongSet, setWrongSet] = useState(() => new Set());
  const attempts = useRef(storedAnswer?.attempts ?? 0);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [revealRequested, setRevealRequested] = useState(false);
  const [finished, setFinished] = useState(false);
  const solved = reflection === c.correctIndex;
  const scored = SCREEN_META
    .map((meta, index) => (meta.scored ? { index, units: meta.scoreUnits ?? 1 } : null))
    .filter(Boolean);
  const totalUnits = scored.reduce((sum, item) => sum + item.units, 0);
  const firstTryUnits = scored.reduce((sum, item) => {
    const answer = answers?.[item.index];
    if (!answer) return sum;
    if (typeof answer.firstTryCount === 'number') return sum + Math.min(answer.firstTryCount, item.units);
    return sum + (answer.firstTry === true ? item.units : 0);
  }, 0);

  const chooseReflection = (sourceIndex) => {
    if (solved || wrongSet.has(sourceIndex) || !(audio.muted || audio.completed)) return;
    setReflection(sourceIndex);
    const ok = sourceIndex === c.correctIndex;
    if (!ok) setWrongSet((previous) => new Set([...previous, sourceIndex]));
    attempts.current += 1;
    playSfx(ok ? 'correct' : 'wrong');
    audio.pushOneOff(t(c.feedbackAudio[sourceIndex]));
    if (ok) setRevealRequested(true);
    onAnswer({
      screenIdx: screen,
      stage: SCREEN_META[screen].scope,
      question: t(c.question),
      options: order.map((index) => t(c.options[index])),
      correctIndex: order.indexOf(c.correctIndex),
      correctAnswer: t(c.options[c.correctIndex]),
      studentAnswerIndex: order.indexOf(sourceIndex),
      studentAnswer: t(c.options[sourceIndex]),
      correct: ok,
      firstTry: ok && attempts.current === 1,
      attempts: attempts.current,
      solved: ok,
      reflection: sourceIndex,
    });
  };

  const finish = () => {
    if (!solved || finished || revealRequested) return;
    setFinished(true);
    finishLesson();
  };

  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={finish} nextDisabled={!solved || finished || revealRequested} canFinish={solved} finish>
      <div className="screen-stack summary-stack">
        <G4TitleReveal active={revealRequested} title={c.award} onComplete={() => setRevealRequested(false)} />
        <div className="final-mission-heading">
          <span><i aria-hidden="true">◆</i> {t({ uz: 'YAKUNIY BOSQICH', ru: 'ФИНАЛЬНЫЙ ЭТАП', en: 'FINAL STAGE' })}</span>
          <h1>{t(c.title)}</h1>
          <p>{t(c.lead)}</p>
        </div>
        <div className="summary-action-layout summary-final-layout">
          <div className="summary-card reflection-card final-question-card">
            <span className="summary-question-kicker">
              <i aria-hidden="true">◇</i>
              {t({ uz: 'YAKUNIY SAVOL', ru: 'ФИНАЛЬНЫЙ ВОПРОС', en: 'FINAL QUESTION' })}
              <b>{t({ uz: '1 QADAM', ru: '1 ШАГ', en: '1 STEP' })}</b>
            </span>
            <h2 className="summary-question">{t(c.question)}</h2>
            <p className="summary-question-stem">{t(c.stem)}</p>
            <div className={`reflection-options ${solved ? 'reflection-options-solved' : ''}`} data-g4-role="reflection-options">
              {order.map((sourceIndex, displayIndex) => (
                <button
                  type="button"
                  key={t(c.options[sourceIndex])}
                  data-g4-role="answer-card"
                  data-g4-source-index={sourceIndex}
                  data-g4-correct={sourceIndex === c.correctIndex ? 'true' : 'false'}
                  className={`reflection-option ${wrongSet.has(sourceIndex) ? 'reflection-wrong' : ''} ${solved && sourceIndex === c.correctIndex ? 'option-answer-confirm' : ''} ${solved && sourceIndex !== c.correctIndex ? 'option-answer-dismiss' : ''}`}
                  disabled={solved || wrongSet.has(sourceIndex)}
                  onClick={() => chooseReflection(sourceIndex)}
                >
                  <span>{String.fromCharCode(65 + displayIndex)}</span>
                  {t(c.options[sourceIndex])}
                </button>
              ))}
            </div>
            {solved && (
              <div className="reflection-resolution">
                <FeedbackBlock show correct proof={t(c.proof)}>{t(c.resolution)}</FeedbackBlock>
              </div>
            )}
            <FeedbackBlock show={reflection !== null && !solved} correct={false}>
              {reflection === null || solved ? '' : t(c.feedback[reflection])}
            </FeedbackBlock>
          </div>
          <div className="summary-support-column">
            <div className={`summary-rules-disclosure ${rulesOpen ? 'summary-rules-open' : ''}`}>
              <button type="button" className="summary-rules-toggle" aria-expanded={rulesOpen} onClick={() => setRulesOpen((open) => !open)}>
                <span aria-hidden="true">3 &rarr; |</span>
                <div>
                  <strong>{t(c.rulesLabel)}</strong>
                  <small>
                    {t(rulesOpen
                      ? { uz: 'Qoidalarni yopish', ru: 'Скрыть правила', en: 'Hide the rules' }
                      : { uz: 'Eslab olish uchun bosing', ru: 'Нажми, чтобы вспомнить', en: 'Press to remember' })}
                  </small>
                </div>
                <i aria-hidden="true">&#8964;</i>
              </button>
              <div className="summary-rules-panel" aria-hidden={!rulesOpen}>
                <div className="summary-rule-items">
                  {c.rules.map((item, index) => (
                    <span key={t(item)}>
                      <i>{index + 1}</i>
                      <p>{t(item)}</p>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <G4TitleCard title={c.award} solved={solved} firstTry={firstTryUnits} total={totalUnits} />
          </div>
        </div>
      </div>
    </Stage>
  );
};

const Screen15 = (props) => <EtalonFinalScreen {...props} c={CONTENT.s15} />;

const SCREENS = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15];

export default function Grade4Dars21({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished, previewMode }) {
  useGrade4MobileZoom();
  const showPreviewControls = langProp === undefined || langProp === null;
  const preview = previewMode ?? showPreviewControls;
  const initialLang = normalizeLang(langProp);
  const [previewLang, setPreviewLang] = useState(initialLang);
  const lang = showPreviewControls ? normalizeLang(previewLang) : initialLang;
  configureLesson({ ttsApiBase: ttsApiBase || '', voiceGender: voiceGender || 'f', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', previewMode: preview });
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  // eslint-disable-next-line react-hooks/purity -- lesson duration starts when this component mounts
  const started = useRef(Date.now());
  const finished = useRef(false);
  const recordAnswer = useCallback((answer) => setAnswers((previous) => {
    const next = [...previous];
    const old = previous[answer.screenIdx];
    next[answer.screenIdx] = { ...answer, firstTry: old?.firstTry === false ? false : answer.firstTry };
    return next;
  }), []);
  const finishLesson = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    const scoredScreens = SCREEN_META
      .map((meta, index) => (meta.scored ? { index, units: meta.scoreUnits ?? 1 } : null))
      .filter(Boolean);
    const totalUnits = scoredScreens.reduce((sum, item) => sum + item.units, 0);
    const solvedUnits = scoredScreens.reduce((sum, item) => {
      const answer = answers[item.index];
      if (!answer) return sum;
      if (typeof answer.correctCount === 'number') return sum + Math.min(answer.correctCount, item.units);
      return sum + (answer.correct === true || answer.solved === true ? item.units : 0);
    }, 0);
    const firstTryUnits = scoredScreens.reduce((sum, item) => {
      const answer = answers[item.index];
      if (!answer) return sum;
      if (typeof answer.firstTryCount === 'number') return sum + Math.min(answer.firstTryCount, item.units);
      return sum + (answer.firstTry === true ? item.units : 0);
    }, 0);
    const payload = {
      lessonId: LESSON_META.lessonId,
      lessonTitle: LESSON_META.lessonTitle[lang],
      studentName: studentName || null,
      durationSec: Math.floor((Date.now() - started.current) / 1000),
      totalQuestions: totalUnits,
      correctAnswers: solvedUnits,
      scorePercent: totalUnits ? Math.round(solvedUnits / totalUnits * 100) : 0,
      finalScore: solvedUnits,
      finalTotal: totalUnits,
      passed: totalUnits ? solvedUnits / totalUnits >= 0.6 : false,
      firstTryStats: { total: totalUnits, firstTryCorrect: firstTryUnits },
      attemptsTotal: scoredScreens.reduce((sum, item) => sum + (answers[item.index]?.attempts ?? 0), 0),
      skillTags: LESSON_META.skillTags,
      answers: answers.filter(Boolean),
    };
    if (onFinished) onFinished(payload); else console.log('[Grade4 Dars21 preview]', payload);
  }, [answers, lang, onFinished, studentName]);
  const Current = SCREENS[current];
  return (
    <LangContext.Provider value={lang}>
      <style>{STYLES + G4_ETALON_OVERRIDES + LESSON_STYLES}</style>
      <div className={'lesson-root ' + (preview ? 'lesson-root-preview' : '')}>
        {showPreviewControls && (
          <div className="preview-language" aria-label={LANGUAGE_LABELS[lang]}>
            {SUPPORTED_LANGS.map((code) => (
              <button type="button" key={code} className={previewLang === code ? 'preview-active' : ''} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>
            ))}
          </div>
        )}
        <Current
          key={current}
          screen={current}
          storedAnswer={answers[current]}
          answers={answers}
          onAnswer={recordAnswer}
          onPrev={() => setCurrent((value) => Math.max(0, value - 1))}
          onNext={() => setCurrent((value) => Math.min(TOTAL_SCREENS - 1, value + 1))}
          finishLesson={finishLesson}
        />
      </div>
    </LangContext.Provider>
  );
}
const G4_ETALON_OVERRIDES = `
/* Local Dars01 visual contract. Content, narration and scoring stay lesson-owned. */
html:has(.lesson-root),body:has(.lesson-root),.lesson-root,.lesson-root button,.lesson-root input,.lesson-root textarea,.lesson-root select{font-family:'Manrope',system-ui,sans-serif}
.lesson-root h1,.lesson-root [data-g4-role="hook-title"] h1{font-family:'Source Serif 4',Georgia,serif!important;font-size:clamp(26px,4.2vw,36px)!important;font-weight:650!important;line-height:1.08!important;letter-spacing:-.012em!important;text-align:left!important}
.lesson-root .question h2,.lesson-root .hook-question-prompt{font-family:'Manrope',system-ui,sans-serif!important;font-size:clamp(17px,2.5vw,21px)!important;font-weight:800!important;line-height:1.28!important;text-align:left!important}
.lesson-root .summary-stack h2,.lesson-root .final-reflection h2,.lesson-root .reflection-card h2,.lesson-root [data-g4-role="title-card"] h2{font-family:'Source Serif 4',Georgia,serif!important}
.lesson-root .screen-count,.lesson-root .formula,.lesson-root .formula-card,.lesson-root .equation,.lesson-root .proof,.lesson-root .proof-label,.lesson-root .result-chip,.lesson-root .model-label,.lesson-root .frac{font-family:'JetBrains Mono',monospace!important}
.lesson-root [data-g4-role="hook-topic"]{font-size:clamp(14px,1.8vw,16px)!important}.lesson-root .summary-stack h2{font-size:25px}.lesson-root .option{font-size:clamp(15px,2vw,18px)}
[data-g4-role="hook-title"]{display:block;width:100%;font-size:36px!important;justify-content:flex-start!important;text-align:left}
.hook-stack{height:100%;min-height:0;display:flex!important;flex-direction:column;align-items:stretch;gap:9px!important;overflow:hidden}
.hook-stack>.heading{height:auto!important;min-height:0!important;overflow:visible!important;align-items:flex-start!important;flex:0 0 auto}
.hook-question-prompt{flex:0 0 auto;margin:0;padding:0 2px;color:#173B52;font-size:21px!important}
.hook-stack>.question{flex:0 0 auto;height:auto!important;min-height:0}
.hook-stack .feedback[aria-hidden="true"]{display:none!important}
.stage-hook .hook-question>h2,.hook-stack>.question>h2{display:none}
[data-g4-role="hook-scene"]{position:relative;isolation:isolate;width:100%!important;height:206px!important;min-width:0;min-height:206px!important;flex:0 0 206px!important;display:block!important;grid-template-columns:1fr!important;overflow:hidden}
[data-g4-role~="visual-frame"]{position:relative;isolation:isolate;min-width:0;min-height:0;max-width:100%;overflow:hidden!important;contain:paint}
[data-g4-screen="hook"] [data-g4-role~="visual-frame"],.stage-hook [data-g4-role="hook-scene"]>[data-g4-role~="visual-frame"]{width:min(760px,100%);min-height:206px;height:100%;margin-inline:auto;border:1px solid rgba(144,228,235,.12);border-radius:24px;background:radial-gradient(circle at 87% 24%,rgba(121,211,218,.16),transparent 24%),radial-gradient(circle at 9% 88%,rgba(149,201,61,.11),transparent 25%),linear-gradient(145deg,rgba(22,143,163,.25),transparent 48%),linear-gradient(135deg,#153B50,#0B2232 72%);box-shadow:0 22px 50px -30px rgba(14,33,44,.75)}
.stage-hook .hook-card{padding:0!important;border:0!important;background:transparent!important;box-shadow:none!important}
.hook-scene-visual{width:100%!important;max-width:100%!important;height:100%;min-height:130px;padding:14px 112px 14px 16px;box-sizing:border-box}
.hook-scene-visual>[data-g4-role~="visual-frame"]{height:100%;padding:0;background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;contain:layout paint}
.hook-frame-bit{position:absolute;right:42px;bottom:-4px;z-index:4;width:88px;height:110px;overflow:hidden;pointer-events:none}
.hook-frame-bit>.g1-char,.hook-frame-bit>.bit,.hook-frame-bit>svg{width:100%;height:100%;display:block}
[data-g4-role~="visual-frame"] img,[data-g4-role~="visual-frame"] picture,[data-g4-role~="visual-frame"] video,[data-g4-role~="visual-frame"] canvas,[data-g4-role~="visual-frame"] svg{display:block;max-width:100%!important;max-height:100%!important;object-fit:contain;overflow:hidden!important}
.visual-shell,.attempt-model,.model-card,.test-model,.topic-visual,.conversion-visual,.time-visual,.area-visual,.length-visual,.mass-visual,.hook-model{min-width:0;min-height:0;max-width:100%;overflow:hidden}
.lesson-root .feedback[data-g4-role~="feedback-frame"]{height:auto!important;min-height:88px!important;padding:8px 15px 8px 9px!important;border-radius:18px!important;display:grid!important;grid-template-columns:62px minmax(0,1fr)!important;align-items:center!important;gap:12px!important;overflow:hidden}
.lesson-root .feedback[data-g4-role~="feedback-frame"] [data-g4-role="feedback-bit"],.lesson-root .feedback[data-g4-role~="feedback-frame"]>.feedback-bit{width:62px!important;height:76px!important;display:block;overflow:hidden}
.lesson-root .feedback[data-g4-role~="feedback-frame"] [data-g4-role="feedback-bit"]>.g1-char,.lesson-root .feedback[data-g4-role~="feedback-frame"] [data-g4-role="feedback-bit"]>.bit,.lesson-root .feedback[data-g4-role~="feedback-frame"] [data-g4-role="feedback-bit"]>svg{width:100%!important;height:100%!important}
.lesson-root .feedback[data-g4-feedback="solution"][data-g4-role~="bit-answer-comment"]{height:auto!important;min-height:72px!important;border-radius:15px!important;grid-template-columns:51px minmax(0,1fr)!important;background:linear-gradient(135deg,#FFFFFF,#E7F3EC)!important;box-shadow:inset 5px 0 #227A53,0 13px 26px -23px rgba(34,122,83,.75)!important}
.lesson-root .feedback[data-g4-feedback="solution"][data-g4-role~="bit-answer-comment"] [data-g4-role="feedback-bit"],.lesson-root .feedback[data-g4-feedback="solution"][data-g4-role~="bit-answer-comment"]>.feedback-bit{width:51px!important;height:64px!important}
.lesson-root .feedback[data-g4-feedback="wrong"]{height:auto!important;min-height:88px!important;border-radius:18px!important;background:linear-gradient(135deg,#FFFFFF,#FFF5D9)!important;box-shadow:inset 5px 0 #A96F13,0 13px 26px -23px rgba(169,111,19,.72)!important}
.lesson-root .feedback[data-g4-role~="feedback-frame"] p{min-width:0;margin:0;font-family:'Manrope',system-ui,sans-serif!important;font-size:15px!important;line-height:1.42!important;text-align:left}
.rank-boost-overlay{position:fixed;inset:0;z-index:120;padding:0;display:grid;place-items:center;overflow:hidden;overscroll-behavior:contain;background:rgba(8,13,24,.64);backdrop-filter:blur(2px) saturate(.78);animation:g4-title-reveal-life 3.9s ease both}.rank-boost-overlay .g4-title-reveal-title{font-size:58px!important}
[data-g4-role="title-card"]{position:relative;isolation:isolate;max-width:100%;overflow:hidden}
[data-g4-role="title-claim"]{font-family:'Manrope',system-ui,sans-serif}
.hook-scene-visual{width:min(760px,100%)!important;margin-inline:auto!important}
.lesson-frame .preview-language{display:none!important}
@media(max-width:639.98px){
  .lesson-root h1,.lesson-root [data-g4-role="hook-title"] h1{font-size:clamp(22px,6.2vw,28px)!important}
  .lesson-root [data-g4-role="hook-title"]{font-size:25px!important}
  .lesson-root .question h2,.lesson-root .hook-question-prompt{font-size:17px!important}
  [data-g4-role="hook-scene"]{height:164px!important;min-height:164px!important;flex:0 0 164px!important}
  [data-g4-screen="hook"] [data-g4-role~="visual-frame"],.stage-hook [data-g4-role="hook-scene"]>[data-g4-role~="visual-frame"]{min-height:164px;border-radius:18px}
  .hook-scene-visual{min-height:112px;padding:10px 78px 10px 11px}
  .hook-stack>.question .options,.stage-hook .hook-question .options{grid-template-columns:repeat(3,minmax(0,1fr))!important}
  .hook-stack>.question .option,.stage-hook .hook-question .option{min-height:44px!important;grid-template-columns:1fr!important;justify-items:center!important;text-align:center!important}
  .hook-frame-bit{right:12px;bottom:-7px;width:68px;height:85px}
  .lesson-root .feedback[data-g4-role~="feedback-frame"]{height:auto!important;min-height:88px!important;grid-template-columns:54px minmax(0,1fr)!important;gap:9px!important}
  .lesson-root .feedback[data-g4-role~="feedback-frame"] [data-g4-role="feedback-bit"],.lesson-root .feedback[data-g4-role~="feedback-frame"]>.feedback-bit{width:54px!important;height:68px!important}
  .lesson-root .feedback[data-g4-feedback="solution"][data-g4-role~="bit-answer-comment"]{height:auto!important;min-height:68px!important;border-radius:15px!important;grid-template-columns:47px minmax(0,1fr)!important}
  .lesson-root .feedback[data-g4-feedback="solution"][data-g4-role~="bit-answer-comment"] [data-g4-role="feedback-bit"],.lesson-root .feedback[data-g4-feedback="solution"][data-g4-role~="bit-answer-comment"]>.feedback-bit{width:47px!important;height:59px!important}
  .lesson-root .feedback[data-g4-role~="feedback-frame"] p{font-size:14px!important}.rank-boost-overlay .g4-title-reveal-title{font-size:29px!important}
}
.hook-scene-visual>.hook-model{height:100%!important;padding:5px!important;gap:3px!important;transform:scale(.9);transform-origin:center}
.hook-scene-visual>.hook-model .tank-model{gap:3px!important}
.hook-scene-visual>.hook-model .tank-shell{width:190px!important;height:92px!important;padding:7px!important;border-width:3px!important;border-radius:0 0 18px 18px!important}
.hook-scene-visual>.hook-model .tank-spout{width:32px!important;height:10px!important;left:-27px!important;border-width:3px!important}
.hook-scene-visual>.hook-model .tank-handle{width:34px!important;height:45px!important;right:-24px!important;top:18px!important;border-width:7px!important}
.hook-scene-visual>.hook-model .model-label{padding:4px 8px!important;font-size:12px!important}
@media(prefers-reduced-motion:reduce){.rank-boost-overlay,.rank-boost-overlay * ,[data-g4-role="title-card"],[data-g4-role="title-card"] *{animation:none!important;transition:none!important}.rank-boost-overlay{opacity:1}.g4-title-reveal-confetti,.g4-title-card-confetti{display:none!important}}
.lesson-root [class*="formula"],.lesson-root [class*="equation"]{font-family:'JetBrains Mono',monospace!important}
.hook-stack>.question[data-g4-role="answer-card"]{display:contents!important}
.lesson-root [data-g4-role="title-card"]{width:100%!important;min-height:116px!important;height:auto!important;margin:0!important;padding:12px 82px 11px 67px!important;border-radius:17px!important;display:flex!important;flex-direction:column!important;justify-content:center!important;gap:4px!important;color:#FFF!important;background:radial-gradient(circle at 82% 20%,rgba(255,194,60,.26),transparent 30%),linear-gradient(135deg,#173B52,#0E6978)!important;box-shadow:0 28px 58px -27px rgba(22,143,163,.8)!important}
.lesson-root [data-g4-role="title-card"] [data-g4-role="reward-bit"]{width:72px!important;height:90px!important}
.lesson-root [data-g4-role="title-card"] [data-g4-role="reward-medal"]{width:44px!important;height:44px!important}
@media(max-width:639.98px){
  .lesson-root [data-g4-role="title-card"]{min-height:88px!important;padding:9px 59px 8px 51px!important;border-radius:14px!important}
  .lesson-root [data-g4-role="title-card"] [data-g4-role="reward-bit"]{width:57px!important;height:71px!important}
  .lesson-root [data-g4-role="title-card"] [data-g4-role="reward-medal"]{width:34px!important;height:34px!important}
}

/* MOBIL O'QIY OLISH (etalon shkalasi) :: boshi */
/* --- Platforma chrome'i uchun xavfsiz zona.
   Ilgari 52px edi: "Darslar ro'yxati" pilli 52px, til pilli 60px da tugaydi,
   shuning uchun progress bar ularning ostiga tushib qolardi.
   Etalon Dars01 da 70px. --- */
@media(max-width:1100px){
  .lesson-root-preview .stage-header,.lesson-frame .lesson-root-preview .stage-header{padding-top:74px!important}
}

/* Mobil yagona masshtab (useMobileZoom, MOBIL_DESKTOP_MOSLASH.md):
   layout doim 390px etalon kenglikda, zoom real ekranga moslaydi.
   Etalon Dars01 bilan bir xil. */
@media(max-width:639.98px){
  .lesson-root{width:390px!important}
}

@media(max-width:639.98px){
  /* Sarlavha: min-height 40px h1 ni kesardi. Balandlik kontentga qarab. */
  .lesson-root .heading,.lesson-root .stage-hook .heading{min-height:0!important;height:auto!important;align-items:flex-start!important}
  .lesson-root .heading h1,.lesson-root .stage-hook .heading h1{font-size:20px!important;line-height:1.2!important}
  .lesson-root .heading>div>span,.lesson-root [data-g4-role="hook-topic"]{font-size:12px!important;line-height:1.2!important}
  .lesson-root .chrome-title>span:last-child{font-size:12px!important}
  .lesson-root .screen-count{font-size:12px!important}

  /* Javoblar: etalon Dars01 - ustunma-ustun, 15-16px. 3 ustun 9px o'rniga. */
  .lesson-root .options,.lesson-root .hook-stack>.question .options,.lesson-root .stage-hook .hook-question .options,.lesson-root .stage-hook .options{grid-template-columns:1fr!important;gap:6px!important}
  .lesson-root .option,.lesson-root .hook-stack>.question .option,.lesson-root .stage-hook .hook-question .option,.lesson-root .stage-hook .option{min-height:48px!important;padding:8px 10px!important;border-radius:13px!important;font-size:15px!important;line-height:1.24!important;grid-template-columns:26px minmax(0,1fr)!important;justify-items:start!important;text-align:left!important}
  .lesson-root .option>b{width:24px!important;height:24px!important;font-size:12px!important}

  /* Izoh va subtitr: bular bolaning o'qiydigan matni. */
  .lesson-root .feedback p,.lesson-root .feedback[data-g4-role~="feedback-frame"] p{font-size:14px!important;line-height:1.32!important}
  .lesson-root .feedback.feedback-slot{height:auto!important;min-height:60px!important;padding:6px 8px!important;grid-template-columns:36px minmax(0,1fr)!important;gap:7px!important}
  .lesson-root .feedback-bit{width:34px!important;height:43px!important}
  .lesson-root .caption-slot{min-height:32px!important;padding:5px 9px!important;font-size:12px!important;line-height:1.26!important}

  /* Navigatsiya. */
  .lesson-root .btn-white-accent,.lesson-root .btn-ghost{min-height:46px!important;font-size:14px!important}
  .lesson-root .stage-nav{min-height:58px!important}

  /* Model yorliqlari va holat chiplari. */
  .lesson-root .model-label{padding:5px 9px!important;font-size:13px!important}
  .lesson-root .boundary-grid .model-label{padding:4px 7px!important;font-size:12px!important}
  .lesson-root .state-note{font-size:12px!important;line-height:1.24!important}
  .lesson-root .formula-card{font-size:15px!important}
  .lesson-root .result-chip{font-size:17px!important}

  .lesson-root .stage-content{padding-top:5px!important;padding-bottom:5px!important}
  .lesson-root .stack{gap:6px!important}

  /* Ochilmagan chiplar (formula-card, result-chip, state-note) boshlang'ich
     holatda translateY(7px) bilan pastga suriladi va model-card ning
     overflow:hidden chegarasidan chiqib qirqilardi. Pastdan bo'shliq beramiz. */
  .lesson-root .model-card{padding:7px 7px 12px!important;gap:5px!important;align-content:center!important}
  .lesson-root .attempt-model{padding-bottom:10px!important}
  .lesson-root .hook-frame-bit{bottom:0!important}

  /* Yakun ekrani umumiy Grade4Finale modulida yashaydi va u 8-10px qatlamga
     tushadi. Modul 40 ta darsda ishlaganligi uchun uni global o'zgartirmaymiz -
     shkalani faqat shu dars ichida ko'taramiz. */
  .lesson-root .g4-shared-finale .finale-takeaway p{font-size:13px!important;line-height:1.28!important}
  .lesson-root .g4-shared-finale .finale-takeaway{min-height:44px!important;padding:6px 8px!important;grid-template-columns:24px minmax(0,1fr)!important;gap:7px!important}
  .lesson-root .g4-shared-finale .finale-takeaway>span{width:26px!important;height:26px!important;font-size:12px!important}
  .lesson-root .g4-shared-finale .finale-heading>span,.lesson-root .g4-shared-finale .finale-proof>span,.lesson-root .g4-shared-finale .finale-bridge>div>strong{font-size:12px!important;line-height:1.2!important}
  .lesson-root .g4-shared-finale .finale-proof>strong{font-size:14px!important}
  .lesson-root .g4-shared-finale .finale-layout,.lesson-root .g4-shared-finale .finale-main,.lesson-root .g4-shared-finale .finale-mastery{gap:5px!important}
  /* Ochilmagan finale-proof/bridge translateY(7-8px) bilan pastga suriladi va
     finale-layout ning overflow:hidden chegarasidan chiqib qirqilardi. */
  .lesson-root .g4-shared-finale .finale-layout{padding-bottom:9px!important}
  .lesson-root .g4-shared-finale .finale-proof,.lesson-root .g4-shared-finale .finale-bridge{padding:6px 8px!important}
  .lesson-root .g4-shared-finale .finale-proof p,.lesson-root .g4-shared-finale .finale-bridge p{font-size:12px!important;line-height:1.28!important}
  .lesson-root .g4-shared-finale .finale-heading h1{font-size:19px!important}
  .lesson-root [data-g4-role="title-claim"]{font-size:14px!important}
}

/* Past telefon (masalan 360x640): joy vizual balandliklardan olinadi,
   shrift kamaymaydi. */
@media(max-width:639.98px) and (max-height:700px){
  .lesson-root .stack{gap:4px!important}
  .lesson-root .heading h1,.lesson-root .stage-hook .heading h1{font-size:18px!important}
  .lesson-root .option,.lesson-root .stage-hook .option{min-height:44px!important;padding:6px 9px!important;font-size:14px!important}
  .lesson-root .caption-slot{min-height:28px!important;padding:4px 8px!important}
  .lesson-root .stage-nav{min-height:52px!important}
  .lesson-root .btn-white-accent,.lesson-root .btn-ghost{min-height:44px!important}
  .lesson-root [data-g4-role="hook-scene"]{height:132px!important;min-height:132px!important;flex:0 0 132px!important}
  .lesson-root [data-g4-screen="hook"] [data-g4-role~="visual-frame"],.lesson-root .stage-hook [data-g4-role="hook-scene"]>[data-g4-role~="visual-frame"]{min-height:132px!important}
  .lesson-root .hook-scene-visual{min-height:96px!important;padding:6px 66px 6px 9px!important}
  .lesson-root .hook-frame-bit{width:56px!important;height:70px!important}
}

@media(max-width:639.98px){
  /* Bak modeli: jo'mrak va tutqich qobiqdan tashqariga chiqadi, ota-element
     esa overflow:hidden - mobil ekranda ular qirqilardi (300>254).
     Konteynerga ichki bo'shliq beramiz. DIQQAT: faqat hook'dan tashqaridagi
     modellarga, chunki hook bakining o'z (kichik) o'lchamlari bor. */
  .lesson-root .model-card .tank-model,.lesson-root .attempt-model .tank-model{width:100%!important;padding-inline:46px!important;box-sizing:border-box!important}
  .lesson-root .model-card .tank-shell,.lesson-root .attempt-model .tank-shell{width:100%!important;max-width:172px!important;height:132px!important;padding:8px!important;border-width:4px!important}
  .lesson-root .model-card .tank-spout,.lesson-root .attempt-model .tank-spout{width:40px!important;height:12px!important;left:-34px!important;border-width:4px!important}
  .lesson-root .model-card .tank-handle,.lesson-root .attempt-model .tank-handle{width:38px!important;height:50px!important;right:-27px!important;top:26px!important;border-width:7px!important}

  /* Hook baki: mavjud kichik o'lchamlar saqlanadi, faqat sig'adigan qilinadi. */
  .lesson-root .hook-scene-visual>.hook-model .tank-model{width:100%!important;padding-inline:30px!important;box-sizing:border-box!important;gap:4px!important}
  .lesson-root .hook-scene-visual>.hook-model .tank-shell{width:100%!important;max-width:158px!important;height:86px!important}
  .lesson-root .hook-scene-visual>.hook-model .model-label{font-size:12px!important;padding:3px 7px!important}
  .lesson-root .hook-frame-bit{bottom:0!important}

  /* Holat chiplari 4 ustunda 11px edi; 2 ustun 12px o'qishga qulay. */
  .lesson-root .state-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:5px!important}
  .lesson-root .state-grid span{min-height:40px!important;padding:6px!important;font-size:12px!important;line-height:1.18!important}

  .lesson-root .fraction-bar{height:58px!important}
  .lesson-root .boundary-grid{grid-template-columns:1fr!important;gap:5px!important;padding:6px!important}
  .lesson-root .boundary-grid>.state-note{grid-column:1!important}
  .lesson-root .boundary-grid .fraction-bar{height:42px!important}
  .lesson-root .model-choices{grid-template-columns:1fr!important;gap:6px!important}
  /* DIQQAT: bu ekranda variantlar <button class="model-choice">, shuning uchun
     bazadagi ".model-choices>div" qoidalari umuman ishlamaydi (o'lik CSS).
     To'g'ri klassga murojaat: nishon va matn birinchi qatorda, model ikkinchi. */
  .lesson-root .model-choice{min-height:0!important;padding:8px 10px!important;grid-template-columns:26px minmax(0,1fr)!important;grid-template-areas:"badge text" "model model"!important;gap:6px 8px!important;align-items:center!important}
  .lesson-root .model-choice>b{grid-area:badge!important;width:24px!important;height:24px!important;font-size:12px!important}
  .lesson-root .model-choice>span{grid-area:text!important;font-size:14px!important;line-height:1.22!important}
  .lesson-root .model-choice .fraction-model{grid-area:model!important;width:100%!important}
  .lesson-root .rule-line{padding:9px!important;font-size:16px!important}
  .lesson-root .wrong-formula{padding:8px!important;font-size:16px!important}
  .lesson-root .marker-control{font-size:12px!important;padding:8px 10px!important}
  .lesson-root .strategy-replay,.lesson-root .tiny-action{min-height:44px!important;font-size:13px!important}
  .lesson-root .bit-error{padding:9px!important;font-size:16px!important}
  .lesson-root .hospital-model{padding:9px!important}
  .lesson-root .hospital-model>span{width:32px!important;height:32px!important;font-size:20px!important}
  .lesson-root .number-line{height:126px!important;padding-inline:11%!important}
  .lesson-root .nl-dot{width:40px!important;height:32px!important;font-size:12px!important}

  /* Chegara modelidagi amal belgisi: mobilda grid 1 ustunga tushadi va
     rotate(90deg) butun qatorni aylantirib, uni ~300px balandlikka
     cho'zib yuborardi. Belgini kichik kvadratga qamab qo'yamiz. */
  .lesson-root .rule-boundary-models{grid-template-columns:1fr!important;gap:6px!important;padding:9px!important}
  .lesson-root .rule-boundary-models>div{padding:7px!important;grid-template-columns:38px minmax(0,1fr)!important;gap:7px!important}
  .lesson-root .rule-boundary-models>strong{width:30px!important;height:30px!important;justify-self:center!important;display:grid!important;place-items:center!important;transform:none!important;font-size:20px!important}
}

@media(max-width:639.98px) and (max-height:700px){
  .lesson-root .model-card .tank-shell,.lesson-root .attempt-model .tank-shell{height:112px!important}
  .lesson-root .hook-scene-visual>.hook-model .tank-shell{max-width:134px!important;height:72px!important}
  .lesson-root .fraction-bar{height:48px!important}
  .lesson-root .state-grid span{min-height:36px!important}
  .lesson-root .number-line{height:112px!important}
  .lesson-root .rule-boundary-models{padding:5px!important;gap:3px!important}
  .lesson-root .rule-boundary-models>div{padding:4px!important;grid-template-columns:30px minmax(0,1fr)!important;gap:5px!important}
  .lesson-root .rule-boundary-models>strong{width:22px!important;height:22px!important;font-size:15px!important}
  .lesson-root .rule-boundary-models .frac{font-size:13px!important}
  .lesson-root .rule-boundary-models .fraction-bar{height:22px!important}
  .lesson-root .model-choice .fraction-bar{height:28px!important}
  .lesson-root .model-choice{padding:6px 8px!important;gap:4px 6px!important}
  .lesson-root .hospital-model{padding:6px!important;gap:8px!important}
  .lesson-root .hospital-model>span{width:26px!important;height:26px!important;font-size:16px!important}
  .lesson-root .hospital-model .tank-model.compact .tank-shell{width:120px!important;height:64px!important}
}
/* MOBIL O'QIY OLISH (etalon shkalasi) :: oxiri */

/* ICHKI TEKSHIRUV VA FACTCARD :: boshi */
/* Ichki tekshiruv (haqiqiy matematik harakat) va FactCard. Ranglar etalon
   palitrasidan: cyan #168FA3, cyanSoft #E5F5F6, navy #173B52, lime #95C93D,
   success #227A53, warn #A96F13 / #FFF5D9, accent #FF5B35. */
.lesson-root .inline-check{display:grid;gap:6px;justify-items:center;padding:9px 11px;border-radius:15px;background:#E5F5F6;box-shadow:inset 3px 0 #168FA3}
.lesson-root .inline-check-prompt{color:#173B52;font-size:13px;font-weight:850;text-align:center}
.lesson-root .inline-check-row{display:flex;flex-wrap:wrap;gap:7px;justify-content:center}
.lesson-root .inline-chip{min-height:44px;min-width:66px;padding:6px 14px;border:0;border-radius:12px;color:#173B52;background:#FFF;cursor:pointer;box-shadow:0 10px 20px -18px rgba(58,53,48,.6);font:900 15px 'JetBrains Mono',monospace}
.lesson-root .inline-chip:focus-visible{outline:3px solid #FF5B35;outline-offset:2px}
.lesson-root .inline-chip.is-right{color:#FFF;background:#227A53}
.lesson-root .inline-chip.is-bad{color:#A96F13;background:#FFF5D9}
.lesson-root .inline-chip:disabled{cursor:default}
.lesson-root .inline-check-note{min-height:15px;color:#227A53;font-size:12px;font-weight:800;text-align:center}

.lesson-root .fact-card{padding:9px 12px;border-radius:14px;display:grid;grid-template-columns:auto minmax(0,1fr);align-items:center;gap:10px;opacity:.12;transform:translateY(6px);background:linear-gradient(135deg,#FFFFFF,#E5F5F6);box-shadow:inset 3px 0 #95C93D;transition:.4s ease}
.lesson-root .fact-card.show{opacity:1;transform:none}
.lesson-root .fact-card>b{color:#168FA3;font:900 10px 'JetBrains Mono',monospace;letter-spacing:.1em}
.lesson-root .fact-card p{color:#173B52;font-size:13px;line-height:1.34}

/* Sonlar nuridagi erkin belgi: ilgari o'qdan uzilib, hech narsaga
   ulanmagan holda suzib turardi. Endi o'qqa ulagich chiziq bilan bog'lanadi. */
.lesson-root .marker-note{min-height:15px;color:#227A53;font-size:12px;font-weight:800}
.lesson-root .nl-dot.free{top:76px}
.lesson-root .nl-dot.free::before{content:"";position:absolute;left:50%;top:-20px;width:2px;height:20px;background:#173B52;transform:translateX(-50%)}

@media(max-width:639.98px){
  .lesson-root .inline-check{padding:7px 9px!important;gap:5px!important}
  .lesson-root .inline-check-prompt{font-size:13px!important}
  .lesson-root .inline-chip{min-height:44px!important;min-width:58px!important;padding:5px 11px!important;font-size:15px!important}
  .lesson-root .inline-check-note{font-size:12px!important}
  .lesson-root .fact-card{padding:7px 9px!important;gap:8px!important}
  .lesson-root .fact-card p{font-size:12px!important;line-height:1.28!important}
}
/* ICHKI TEKSHIRUV VA FACTCARD :: oxiri */

/* OCHILMAGAN CHIPLAR SIG'IMI :: boshi */
@media(max-width:639.98px){
  .lesson-root .frame-note:not(.show),.lesson-root .formula-card:not(.show),.lesson-root .result-chip:not(.show),.lesson-root .state-note:not(.show),.lesson-root .rule-line:not(.show),.lesson-root .wrong-formula:not(.show),.lesson-root .fact-card:not(.show),.lesson-root .state-grid span:not(.show),.lesson-root .boundary-grid>div:not(.show){transform:none!important}
  .lesson-root .g4-shared-finale .finale-takeaway:not(.is-visible),.lesson-root .g4-shared-finale .finale-proof:not(.is-visible),.lesson-root .g4-shared-finale .finale-bridge:not(.is-visible){transform:none!important}

  /* strategy-slot ichidagi feedback position:absolute + inset:0 bo'lib,
     translateY(7px) bilan slot chegarasidan chiqadi. Fade qoladi. */
  .lesson-root .strategy-slot .feedback{transform:none!important}

  /* FactCard yorlig'i 10px edi. */
  .lesson-root .fact-card>b{font-size:12px!important}
}

@media(max-width:639.98px) and (max-height:700px){
  .lesson-root .stage-hook .group-cell{min-height:26px!important}
  .lesson-root .stage-hook .frame-note{padding:4px 5px!important}
}
/* OCHILMAGAN CHIPLAR SIG'IMI :: oxiri */

/* PLANSHET MASSHTAB QATLAMI :: boshi */
/* Desktop va planshetda ham ochilmagan bloklar translateY bilan pastga
   surilib, yakun ekrani va hook sahnasi chegarasidan chiqadi (yakun 7px,
   Bit oyoqlari 2-3px). Mobilda bu allaqachon tuzatilgan. */
.lesson-root .hook-frame-bit{bottom:0}
.lesson-root .g4-shared-finale .finale-layout{padding-bottom:9px}
.lesson-root .g4-shared-finale .finale-takeaway:not(.is-visible),.lesson-root .g4-shared-finale .finale-proof:not(.is-visible),.lesson-root .g4-shared-finale .finale-bridge:not(.is-visible){transform:none}
.lesson-root .hook-scene-visual{padding-top:10px;padding-bottom:10px}

@media(min-width:640px) and (max-height:870px){ .lesson-root{zoom:.96} }
@media(min-width:640px) and (max-height:830px){ .lesson-root{zoom:.92} }
@media(min-width:640px) and (max-height:790px){ .lesson-root{zoom:.87} }
@media(min-width:640px) and (max-height:750px){ .lesson-root{zoom:.83} }
@media(min-width:640px) and (max-height:700px){ .lesson-root{zoom:.77} }
@media(min-width:640px) and (max-height:650px){ .lesson-root{zoom:.72} }

/* Masshtab kichrayganda mikro yorliqlar vizual jihatdan yana kichrayadi,
   shuning uchun ularning shrifti ko'tariladi: .96-.83 masshtabda 12-13px
   asl 10-11px bilan bir xil ko'rinishni beradi. */
@media(min-width:640px) and (max-height:870px){
  .lesson-root .screen-type{font-size:12px}
  .lesson-root .heading>div>span,.lesson-root [data-g4-role="hook-topic"]{font-size:13px}
  .lesson-root .chrome-title>span:last-child{font-size:12px}
  .lesson-root .state-grid span{font-size:13px}
  .lesson-root .nl-dot{font-size:13px}
  .lesson-root .fact-card>b{font-size:12px}
  .lesson-root .option>b{font-size:12px}
  .lesson-root .model-choice>b{font-size:12px}
  .lesson-root .frame-note{font-size:13px}
  .lesson-root .frame-note>b{font-size:12px}
  .lesson-root .group-cell small,.lesson-root .group-cell b{font-size:13px}
  .lesson-root .g4-shared-finale .finale-heading>span,.lesson-root .g4-shared-finale .finale-proof>span,.lesson-root .g4-shared-finale .finale-bridge>div>strong{font-size:12px}
  .lesson-root .g4-shared-finale .finale-takeaway>span{font-size:12px}
}
/* PLANSHET MASSHTAB QATLAMI :: oxiri */

/* MASSHTABLANGAN BANDDA XAVFSIZ ZONA :: boshi */
@media(min-width:640px) and (max-width:1100px) and (max-height:870px){
  .lesson-root-preview .stage-header,.lesson-frame .lesson-root-preview .stage-header{padding-top:74px!important}
}
@media(min-width:640px) and (max-width:1100px) and (max-height:830px){
  .lesson-root-preview .stage-header,.lesson-frame .lesson-root-preview .stage-header{padding-top:78px!important}
}
@media(min-width:640px) and (max-width:1100px) and (max-height:790px){
  .lesson-root-preview .stage-header,.lesson-frame .lesson-root-preview .stage-header{padding-top:82px!important}
}
@media(min-width:640px) and (max-width:1100px) and (max-height:750px){
  .lesson-root-preview .stage-header,.lesson-frame .lesson-root-preview .stage-header{padding-top:86px!important}
}
@media(min-width:640px) and (max-width:1100px) and (max-height:700px){
  .lesson-root-preview .stage-header,.lesson-frame .lesson-root-preview .stage-header{padding-top:92px!important}
}
@media(min-width:640px) and (max-width:1100px) and (max-height:650px){
  .lesson-root-preview .stage-header,.lesson-frame .lesson-root-preview .stage-header{padding-top:98px!important}
}
/* MASSHTABLANGAN BANDDA XAVFSIZ ZONA :: oxiri */

/* OXIRGI SIG'IM TUZATISHLARI :: boshi */
/* Unvon tugmasi bosilganda translateY(-2px) bilan ko'tariladi va
   finale-layout ning yuqori chegarasidan chiqib qirqilardi. */
.lesson-root .g4-shared-finale .finale-layout{padding-top:3px}

/* Planshetda Dars22 ning model ekrani ichki tekshiruv qo'shilgach 6-7px
   sig'masdi: bo'shliqlar hisobidan yechamiz, shrift tegilmaydi. */
@media(min-width:640px) and (max-width:1100px) and (max-height:870px){
  .lesson-root .inline-check{padding:7px 10px;gap:5px}
  .lesson-root .model-card{padding-bottom:12px}
  .lesson-root .stack{row-gap:8px}
}

/* Kichik telefonda ruscha matn uzunroq: model kartasiga zapas. */
@media(max-width:639.98px) and (max-height:700px){
  .lesson-root .model-card{padding-bottom:14px!important}
  .lesson-root .fraction-bar{height:44px!important}
  .lesson-root .inline-check{gap:4px!important}
}
/* OXIRGI SIG'IM TUZATISHLARI :: oxiri */
`;

const STYLES = `
.stage-hook .hook-model{position:relative;isolation:isolate;overflow:hidden;border:1px solid rgba(144,228,235,.12);border-radius:24px;background:radial-gradient(circle at 87% 24%,rgba(121,211,218,.16),transparent 24%),radial-gradient(circle at 9% 88%,rgba(149,201,61,.11),transparent 25%),linear-gradient(145deg,rgba(22,143,163,.25),transparent 48%),linear-gradient(135deg,#153B50,#0B2232 72%);box-shadow:0 22px 50px -30px rgba(14,33,44,.75)}
@media(max-width:639.98px){.stage-hook .hook-model{border-radius:18px}}
.g4-title-card-placeholder{width:100%;min-height:116px}
.g4-title-card{position:relative;isolation:isolate;width:100%;min-height:116px;margin:0;padding:12px 82px 11px 67px;border-radius:17px;display:flex;flex-direction:column;justify-content:center;gap:4px;overflow:hidden;color:#FFF;background:radial-gradient(circle at 82% 20%,rgba(255,194,60,.26),transparent 30%),linear-gradient(135deg,#173B52,#0E6978);box-shadow:0 28px 58px -27px rgba(22,143,163,.8);transform:translateY(-2px)}
.g4-title-card-medal{position:absolute;left:11px;top:50%;width:44px;height:44px;border:3px solid rgba(255,255,255,.58);border-radius:50%;display:grid;place-items:center;transform:translateY(-50%);color:#5A3A00;background:linear-gradient(145deg,#FFE284,#FFC23C);box-shadow:0 0 0 8px rgba(255,255,255,.08),0 15px 30px -15px rgba(0,0,0,.6);font-size:19px;z-index:2}
.g4-title-card-bit{position:absolute;right:3px;bottom:2px;width:72px;height:90px;z-index:2;animation:g4-title-card-bit-float 2.8s ease-in-out 1 both}.g4-title-card-bit>svg,.g4-title-card-bit .bit,.g4-title-card-bit .g1-char{width:100%;height:100%}
.g4-title-card-kicker{position:relative;color:#A8EAF0;font:900 10px/1.2 'JetBrains Mono',monospace;letter-spacing:.13em;z-index:2}.g4-title-card-title{position:relative;margin:0!important;font:750 clamp(16px,2.2vw,21px)/1.05 'Source Serif 4',Georgia,serif;z-index:2}.g4-title-card-score{position:relative;align-self:flex-start;margin-top:5px;padding:5px 9px;border-radius:10px;display:flex;align-items:center;gap:7px;background:rgba(255,255,255,.10);z-index:2}.g4-title-card-score strong{color:#FFE284;font-family:'JetBrains Mono',monospace}.g4-title-card-score span{color:rgba(255,255,255,.72);font-size:9px}
.g4-title-card-confetti{position:absolute;inset:0;pointer-events:none}.g4-title-card-confetti i{position:absolute;top:-16px;width:7px;height:12px;border-radius:2px;animation:g4-title-card-fall 2.4s linear 2 both}.g4-title-card-confetti i:nth-child(4n+1){background:#FFC23C}.g4-title-card-confetti i:nth-child(4n+2){background:#FF5B35}.g4-title-card-confetti i:nth-child(4n+3){background:#77E1EA}.g4-title-card-confetti i:nth-child(4n){background:#95C93D}.g4-title-card-confetti i:nth-child(1){left:8%;animation-delay:-.3s}.g4-title-card-confetti i:nth-child(2){left:17%;animation-delay:-1.1s}.g4-title-card-confetti i:nth-child(3){left:29%;animation-delay:-.7s}.g4-title-card-confetti i:nth-child(4){left:41%;animation-delay:-1.7s}.g4-title-card-confetti i:nth-child(5){left:52%;animation-delay:-.2s}.g4-title-card-confetti i:nth-child(6){left:63%;animation-delay:-1.3s}.g4-title-card-confetti i:nth-child(7){left:73%;animation-delay:-.8s}.g4-title-card-confetti i:nth-child(8){left:84%;animation-delay:-1.9s}.g4-title-card-confetti i:nth-child(9){left:12%;animation-delay:-2s}.g4-title-card-confetti i:nth-child(10){left:36%;animation-delay:-1.4s}.g4-title-card-confetti i:nth-child(11){left:68%;animation-delay:-.5s}.g4-title-card-confetti i:nth-child(12){left:91%;animation-delay:-1.6s}
.g4-title-reveal-overlay{position:fixed;inset:0;z-index:120;padding:0;display:grid;place-items:center;overflow:hidden;overscroll-behavior:contain;pointer-events:none;background:rgba(8,13,24,.64);backdrop-filter:blur(2px) saturate(.78);animation:g4-title-reveal-life 3.9s ease both}.g4-title-reveal-card{position:relative;isolation:isolate;width:100%;min-height:100dvh;padding:36px 24px;border:0;border-radius:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;overflow:hidden;color:#FFF;text-align:center;background:radial-gradient(circle at 50% 50%,rgba(255,214,80,.17),transparent 31%)}.g4-title-reveal-card::after{content:'';position:absolute;z-index:0;top:50%;left:50%;width:min(440px,82vw);height:min(440px,82vw);border-radius:50%;background:radial-gradient(circle,rgba(255,222,105,.17),transparent 68%);transform:translate(-50%,-50%)}
.g4-title-reveal-rays{position:absolute;z-index:0;top:50%;left:50%;width:160vmax;height:160vmax;border-radius:50%;opacity:.28;background:repeating-conic-gradient(from -4deg,rgba(255,218,91,.88) 0 8deg,transparent 8deg 20deg);transform:translate(-50%,-50%);animation:g4-title-reveal-rays-in .8s cubic-bezier(.16,1,.3,1) both,g4-title-reveal-rays-turn 26s linear .8s 1 both}.g4-title-reveal-medal{position:absolute;top:50%;left:50%;z-index:2;width:112px;height:112px;border:6px solid rgba(255,255,255,.72);border-radius:50%;display:grid;place-items:center;color:#653C00;background:linear-gradient(145deg,#FFF2A0,#FFC13B);box-shadow:0 0 0 13px rgba(255,255,255,.09),0 0 54px 10px rgba(255,204,63,.38),0 22px 38px -18px rgba(0,0,0,.7);font-size:52px;animation:g4-title-reveal-medal-in 1s cubic-bezier(.16,1,.3,1) .15s both}.g4-title-reveal-title{position:absolute;top:calc(50% + 82px);left:50%;z-index:2;width:min(680px,calc(100vw - 48px));margin:0!important;font:750 clamp(34px,5vw,58px)/1.02 'Source Serif 4',Georgia,serif;text-shadow:0 4px 24px rgba(0,0,0,.72);transform:translateX(-50%);animation:g4-title-reveal-title-in .7s ease .52s both}
.g4-title-reveal-confetti{position:absolute;inset:0;pointer-events:none}.g4-title-reveal-confetti i{position:absolute;top:-20px;width:8px;height:14px;border-radius:2px;background:#FFE284;animation:g4-title-reveal-fall 2.4s linear 2 both}.g4-title-reveal-confetti i:nth-child(3n+2){background:#FF7050}.g4-title-reveal-confetti i:nth-child(3n){background:#77E1EA}
@keyframes g4-title-card-bit-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}@keyframes g4-title-card-fall{to{transform:translateY(230px) rotate(460deg)}}@keyframes g4-title-reveal-life{0%{opacity:0}12%,84%{opacity:1}100%{opacity:0}}@keyframes g4-title-reveal-medal-in{from{opacity:0;transform:translate(-50%,-50%) scale(.25) rotate(-25deg)}to{opacity:1;transform:translate(-50%,-50%) scale(1) rotate(0)}}@keyframes g4-title-reveal-title-in{from{opacity:0;transform:translate(-50%,14px)}to{opacity:1;transform:translate(-50%,0)}}@keyframes g4-title-reveal-rays-in{from{opacity:0;transform:translate(-50%,-50%) scale(.5)}to{opacity:.28;transform:translate(-50%,-50%) scale(1)}}@keyframes g4-title-reveal-rays-turn{from{transform:translate(-50%,-50%) rotate(0)}to{transform:translate(-50%,-50%) rotate(360deg)}}@keyframes g4-title-reveal-fall{to{transform:translateY(470px) rotate(560deg)}}
@media(max-width:639.98px){.g4-title-card-placeholder{min-height:88px}.g4-title-card{min-height:88px;padding:9px 59px 8px 51px;border-radius:14px}.g4-title-card-medal{left:8px;width:34px;height:34px;font-size:14px}.g4-title-card-bit{width:57px;height:71px}.g4-title-card-title{font-size:14px}.g4-title-reveal-card{min-height:100dvh;padding:24px 18px}.g4-title-reveal-medal{width:88px;height:88px;border-width:5px;font-size:40px}.g4-title-reveal-title{top:calc(50% + 62px);font-size:29px}}
@media(prefers-reduced-motion:reduce){.g4-title-card,.g4-title-card-bit,.g4-title-reveal-overlay,.g4-title-reveal-rays,.g4-title-reveal-medal,.g4-title-reveal-title{animation:none!important}.g4-title-card{opacity:1;transform:none!important}.g4-title-card-confetti,.g4-title-reveal-confetti{display:none}.g4-title-reveal-overlay{opacity:1}.g4-title-reveal-rays{opacity:.28;transform:translate(-50%,-50%)}.g4-title-reveal-medal{opacity:1;transform:translate(-50%,-50%)}.g4-title-reveal-title{opacity:1;transform:translateX(-50%)}}
html:has(.lesson-root),body:has(.lesson-root),#root:has(.lesson-root),.lesson-page:has(.lesson-root),.lesson-frame:has(.lesson-root){width:100%;height:100%;min-height:0!important;margin:0;overflow:hidden!important;overscroll-behavior:none}
.lesson-root,.lesson-root *{box-sizing:border-box}.lesson-root h1,.lesson-root h2,.lesson-root h3,.lesson-root h4,.lesson-root h5,.lesson-root h6,.lesson-root p,.lesson-root ul,.lesson-root ol{margin:0}.lesson-root button,.lesson-root input{font:inherit}
.lesson-root{position:fixed;inset:0;width:100%;height:100%;min-height:0;overflow:hidden;zoom:var(--g4z,1);color:${T.ink};background:radial-gradient(circle at 88% 9%,rgba(22,143,163,.11),transparent 25%),linear-gradient(145deg,#F7F8F4,#EEF3F1);font-family:'Manrope',system-ui,sans-serif}
.stage{width:min(936px,100%);height:100%;margin:0 auto;display:flex;flex-direction:column;overflow:hidden}.stage-header{flex-shrink:0;padding-top:10px;padding-bottom:8px;background:rgba(247,248,244,.88);backdrop-filter:blur(14px);z-index:5}.progress-track{width:100%;height:6px;margin-bottom:10px;border-radius:999px;background:rgba(80,97,109,.16);overflow:hidden}.progress-fill{height:100%;border-radius:inherit;background:linear-gradient(90deg,${T.cyan},${T.accent});box-shadow:0 0 12px rgba(255,91,53,.42);transition:width .45s ease}.stage-chrome{min-width:0;display:flex;justify-content:space-between;align-items:center;gap:12px}.chrome-title,.chrome-actions,.audio-controls{display:flex;align-items:center;gap:9px}.chrome-title{min-width:0;overflow:hidden;color:${T.ink2};font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}.chrome-title>span:last-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.chrome-actions{flex:none}.status-dot{width:8px;height:8px;flex:none;border-radius:50%;background:${T.accent};box-shadow:0 0 10px rgba(255,91,53,.65)}.screen-type{padding:4px 8px;border-radius:999px;color:${T.cyan};background:${T.cyanSoft};font-size:10px;font-weight:800}.screen-count{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700}.icon-btn{width:44px;height:44px;padding:0;border:0;border-radius:10px;color:${T.ink2};background:rgba(255,255,255,.75);cursor:pointer;box-shadow:0 4px 12px -7px rgba(${T.shadowBase},.3)}
.stage-content{flex:1 1 auto;min-height:0;padding-top:10px;padding-bottom:16px;overflow:hidden}.stage-nav{flex:0 0 auto;min-height:72px;display:flex;align-items:center;justify-content:space-between;gap:12px;background:rgba(245,245,240,.95)}.btn-white-accent,.btn-ghost{min-width:128px;min-height:50px;padding:0 18px;border:0;border-radius:15px;cursor:pointer;font-weight:900}.btn-white-accent{color:${T.accent};background:#fff;box-shadow:0 12px 24px -17px rgba(255,91,53,.8)}.btn-white-accent:hover:not(:disabled){color:#fff;background:${T.accent}}.btn-white-accent:disabled{opacity:.42;cursor:not-allowed}.btn-ghost{color:${T.ink2};background:transparent}.btn-ghost:hover{background:#fff;box-shadow:0 10px 20px -16px rgba(${T.shadowBase},.5)}.compact{min-width:118px}.stack{height:100%;min-height:0;overflow:hidden;display:grid;align-content:start;gap:14px;animation:page-in .45s cubic-bezier(.16,1,.3,1) both}.heading{min-height:78px;display:flex;align-items:center;justify-content:space-between;gap:16px}.heading>div>span{color:${T.cyan};font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.heading h1{margin-top:4px!important;font:750 clamp(25px,4vw,38px)/1.06 'Source Serif 4',Georgia,serif}.heading .g1-char{width:78px;height:98px;flex:0 0 auto;overflow:visible;filter:drop-shadow(0 9px 11px rgba(23,59,82,.2))}.question,.model-card,.duel,.why-grid,.compare-card,.rule-card,.boundary,.summary-grid{padding:18px;border-radius:22px;background:rgba(255,255,255,.9);box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.48)}.question{display:grid;gap:13px}.question h2{font:720 clamp(17px,2.5vw,22px)/1.25 'Source Serif 4',Georgia,serif}.options{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.option{min-height:62px;padding:10px;border:0;border-radius:16px;display:grid;grid-template-columns:28px 1fr;align-items:center;gap:8px;color:${T.ink};background:#F8F8F4;text-align:left;cursor:pointer;box-shadow:0 10px 22px -20px rgba(${T.shadowBase},.46)}.option>b{width:27px;height:27px;border-radius:9px;display:grid;place-items:center;color:${T.cyan};background:${T.cyanSoft};font:900 11px 'JetBrains Mono',monospace}.option.picked{transform:translateY(-2px);background:${T.accentSoft};box-shadow:inset 0 0 0 2px rgba(255,91,53,.27)}.option.right{background:${T.successSoft};box-shadow:inset 0 0 0 2px rgba(34,122,83,.25)}.option.bad{background:${T.warnSoft};box-shadow:inset 0 0 0 2px rgba(169,111,19,.25)}.feedback{padding:12px 14px;border-radius:15px;display:grid;grid-template-columns:28px 1fr;gap:9px;align-items:start;opacity:0;transform:translateY(7px)}.feedback.open{opacity:1;transform:none;transition:.3s ease}.feedback.correct{background:${T.successSoft};box-shadow:inset 4px 0 ${T.success}}.feedback.wrong{background:${T.warnSoft};box-shadow:inset 4px 0 ${T.warn}}.feedback>b{font-size:18px}.feedback p{font-size:13px;line-height:1.45}.caption{position:static;bottom:4px;margin-top:12px;padding:9px 13px;border-radius:13px;color:#fff;background:rgba(23,59,82,.94);font-size:12px;line-height:1.4;z-index:3}
.proof{padding:12px;border-radius:14px;color:${T.success};background:${T.successSoft};text-align:center;font:900 15px 'JetBrains Mono',monospace;animation:proof-in .35s ease both}.frac{display:inline-flex;min-width:25px;flex-direction:column;align-items:center;vertical-align:middle;color:inherit;font:800 1em/1 'JetBrains Mono',monospace}.frac i{width:100%;height:2px;margin:2px 0;border-radius:2px;background:currentColor}.frac-lg{font-size:1.35em}.hook-model,.whole-card,.rule-card,.finale-payoff{padding:18px;border-radius:22px;background:rgba(255,255,255,.9);box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.48)}
.lesson-root button:focus-visible,.lesson-root input:focus-visible,.lesson-root input[type='range']:focus-visible{outline:3px solid ${T.cyan};outline-offset:3px}
.hook-model{display:grid;place-items:center;gap:12px;background:linear-gradient(135deg,#E5F5F6,#FFF)}.fraction-model{width:min(620px,94%);margin:0 auto;display:grid;gap:10px}.fraction-bar{height:112px;display:grid;overflow:hidden;border-radius:18px;background:#F4F5F1;box-shadow:inset 0 0 0 3px rgba(23,59,82,.16)}.fraction-bar i{min-width:0;border-right:2px solid rgba(23,59,82,.18);background:#F4F5F1;transition:background .45s ease,transform .45s ease}.fraction-bar i:last-child{border-right:0}.fraction-bar i.cyan{background:#46B8C5}.fraction-bar i.lime{background:#95C93D}.fraction-bar i.removed{background:repeating-linear-gradient(135deg,rgba(255,91,53,.12),rgba(255,91,53,.12) 7px,rgba(255,91,53,.42) 7px,rgba(255,91,53,.42) 14px)}.fraction-bar i.merged{background:linear-gradient(135deg,#168FA3,#95C93D)}.fraction-bar.whole i{border-right:0}.fraction-model.compact .fraction-bar{height:48px;border-radius:11px}.model-label{justify-self:center;padding:8px 13px;border-radius:12px;color:#173B52;background:#E5F5F6;font:900 16px "JetBrains Mono",monospace}.state-note,.formula-card,.result-chip{padding:12px 15px;border-radius:14px;opacity:.12;transform:translateY(7px);transition:.4s ease;text-align:center}.state-note{color:#227A53;background:#E7F3EC;font-size:13px;font-weight:850}.formula-card{color:#FFF;background:#173B52;font:900 17px "JetBrains Mono",monospace}.result-chip{justify-self:center;color:#FFF;background:#FF5B35;font:900 20px "JetBrains Mono",monospace}.show{opacity:1!important;transform:none!important}.tokens{display:flex;align-items:center;justify-content:center;gap:8px;color:#50616D;font-size:12px;font-weight:800}.tokens i{width:28px;height:28px;border-radius:9px;background:#95C93D;animation:token-pop .4s ease both}.tokens i:nth-child(2){animation-delay:.1s}.tokens i:nth-child(3){animation-delay:.2s}.rule-card,.whole-card{display:grid;gap:12px}.rule-line{padding:13px;border-radius:14px;opacity:.12;transform:translateY(6px);color:#173B52;background:#E5F5F6;text-align:center;font:900 18px "JetBrains Mono",monospace;transition:.4s ease}.rule-line.accent{color:#FFF;background:#173B52}.wrong-formula{padding:12px;position:relative;opacity:.12;color:#A96F13;background:#FFF5D9;text-align:center;font:900 18px "JetBrains Mono",monospace;transition:.4s ease}.wrong-formula::after{content:"";position:absolute;left:28%;right:28%;top:50%;height:3px;transform:rotate(-8deg);background:#FF5B35}.tank-model{width:min(560px,96%);margin:0 auto;display:grid;place-items:center;gap:10px}.tank-shell{width:min(360px,82%);height:210px;position:relative;padding:16px 16px 14px;border:5px solid ${T.navy};border-top:0;border-radius:0 0 34px 34px;background:rgba(255,255,255,.72);filter:drop-shadow(0 14px 16px rgba(${T.shadowBase},.13))}.tank-body{height:100%;overflow:hidden;border-radius:6px 6px 22px 22px;display:flex;flex-direction:column-reverse;background:#F4F5F1}.tank-body i{min-height:0;flex:1;border-top:2px solid rgba(23,59,82,.18);transition:background .38s ease,opacity .38s ease,transform .38s ease}.tank-body i:first-child{border-top:0}.tank-body i.tank-fill{background:linear-gradient(90deg,#46B8C5,${T.cyan})}.tank-body i.tank-outline{box-shadow:inset 0 0 0 3px ${T.lime}}.tank-body i.tank-removed{background:repeating-linear-gradient(135deg,rgba(255,91,53,.16),rgba(255,91,53,.16) 8px,rgba(255,91,53,.48) 8px,rgba(255,91,53,.48) 16px);animation:tank-out .42s ease both}.tank-shell.undivided .tank-body i{border-top-color:transparent}.tank-spout{width:76px;height:19px;position:absolute;left:-63px;top:-4px;border:5px solid ${T.navy};border-right:0;border-radius:13px 0 0 13px;background:#fff}.tank-handle{width:70px;height:90px;position:absolute;right:-46px;top:44px;border:12px solid ${T.navy};border-left:0;border-radius:0 38px 38px 0}.tank-model.compact .tank-shell{width:190px;height:92px;padding:7px;border-width:3px;border-radius:0 0 18px 18px}.tank-model.compact .tank-spout{width:32px;height:10px;left:-27px;border-width:3px}.tank-model.compact .tank-handle{width:34px;height:45px;right:-24px;top:18px;border-width:7px}.state-grid{margin-top:12px;display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.state-grid span{min-height:52px;padding:9px;border-radius:13px;display:grid;place-items:center;opacity:.12;transform:translateY(6px);color:${T.navy};background:${T.cyanSoft};text-align:center;font-size:11px;font-weight:850;transition:.38s ease}.boundary-grid{padding:18px;border-radius:22px;display:grid;grid-template-columns:1fr 1fr;gap:12px;background:rgba(255,255,255,.9);box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.48)}.boundary-grid>div{padding:10px;border-radius:16px;opacity:.12;transform:translateY(6px);background:#F8F8F4;transition:.4s ease}.boundary-grid>.state-note{grid-column:1/-1}.hospital-model{padding:14px;border-radius:18px;display:flex;align-items:center;justify-content:center;gap:14px;background:${T.cyanSoft}}.hospital-model>span{width:42px;height:42px;border-radius:13px;display:grid;place-items:center;color:#fff;background:${T.accent};font:900 27px 'JetBrains Mono',monospace}.nl-arrow.back{border-right:0;border-left:3px solid ${T.accent};border-radius:14px 0 0 0}.nl-arrow.back::after{right:auto;left:-5px;border-left:0;border-right:8px solid ${T.accent}}.number-line{height:150px;position:relative;padding:54px 7% 0}.nl-track{height:4px;position:relative;border-radius:4px;background:#173B52}.nl-tick{width:2px;height:18px;position:absolute;top:-7px;background:#87949D}.nl-tick span{position:absolute;top:20px;left:50%;transform:translateX(-50%);font:800 12px "JetBrains Mono",monospace}.nl-dot{width:44px;height:38px;position:absolute;top:27px;transform:translateX(-50%);border-radius:12px;display:grid;place-items:center;color:#FFF;font:900 11px "JetBrains Mono",monospace;z-index:2;animation:dot-pop .35s ease both}.nl-dot.cyan{background:#168FA3}.nl-dot.lime{background:#95C93D}.nl-arrow{height:22px;position:absolute;top:84px;border-top:3px solid #FF5B35;border-right:3px solid #FF5B35;border-radius:0 14px 0 0;animation:arrow-grow .45s ease both}.nl-arrow::after{content:"";position:absolute;right:-5px;top:-7px;border-left:8px solid #FF5B35;border-top:5px solid transparent;border-bottom:5px solid transparent}.model-choices{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.model-choices>div{padding:10px;border-radius:15px;display:grid;grid-template-columns:26px 1fr;align-items:center;gap:6px;background:#FFF;box-shadow:0 12px 24px -20px rgba(58,53,48,.6)}.model-choices>div>b{width:25px;height:25px;border-radius:8px;display:grid;place-items:center;color:#FFF;background:#168FA3;font:900 10px "JetBrains Mono",monospace}.bit-error{padding:14px;border-radius:18px;display:flex;align-items:center;justify-content:center;gap:12px;color:#A96F13;background:#FFF5D9;font:900 19px "JetBrains Mono",monospace}.bit-error b{position:relative}.bit-error b::after{content:"";position:absolute;left:-5px;right:-5px;top:50%;height:3px;transform:rotate(-8deg);background:#FF5B35}.energy-model{display:grid;grid-template-columns:1fr 32px 1fr;align-items:center;gap:8px}.energy-model>div{padding:10px;border-radius:15px;display:grid;grid-template-columns:30px 1fr;align-items:center;gap:8px;background:#FFF}.energy-model>div>span{font-size:23px}.energy-model>strong{text-align:center;color:#FF5B35;font-size:23px}.finale-heading{padding:11px 15px;border-radius:17px;background:linear-gradient(100deg,rgba(255,91,53,.09),transparent 52%),rgba(255,255,255,.92);box-shadow:0 13px 28px -24px rgba(255,91,53,.72)}.finale-heading>span{color:#FF5B35;font:900 9px "JetBrains Mono",monospace;letter-spacing:.12em}.finale-heading h1{margin-top:4px!important;color:#173B52;font:750 clamp(21px,3vw,28px)/1.08 "Source Serif 4",Georgia,serif}.finale-heading p{margin-top:4px!important;color:#50616D;font-size:11px}.finale-main{display:grid;grid-template-columns:minmax(270px,.9fr) minmax(310px,1.1fr);gap:10px}.finale-payoff{display:grid;align-content:center;gap:8px}.finale-payoff>small{color:#168FA3;font-size:9px;font-weight:900;letter-spacing:.09em}.finale-answer{padding:8px 10px;border-radius:11px;opacity:.14;transform:translateY(5px);color:#227A53;background:#E7F3EC;text-align:center;font:900 13px "JetBrains Mono",monospace;transition:.42s ease}.finale-takeaways{display:grid;gap:6px}.finale-takeaway{min-height:42px;padding:7px 10px;border-radius:12px;display:grid;grid-template-columns:27px 1fr;align-items:center;gap:8px;opacity:.14;transform:translateY(6px);background:#F8F8F4;transition:.42s ease}.finale-takeaway.show{background:#E5F5F6}.finale-takeaway>b{width:26px;height:26px;border-radius:9px;display:grid;place-items:center;color:#FFF;background:#168FA3;font:900 9px "JetBrains Mono",monospace}.finale-takeaway span{display:grid;gap:2px;font-size:11px;font-weight:800}.finale-takeaway small{color:#168FA3;font-size:8px;text-transform:uppercase}.finale-takeaway strong{color:#173B52;font-family:"JetBrains Mono",monospace}.finale-bottom{display:grid;grid-template-columns:1.2fr .8fr;gap:10px}.finale-bridge{padding:12px 15px;border-radius:16px;display:grid;align-content:center;gap:4px;opacity:.14;transform:translateY(6px);color:#FFF;background:#173B52;transition:.42s ease}.finale-bridge small{color:#98E1E5;font-size:9px;font-weight:900;letter-spacing:.1em}.finale-bridge strong{font:750 15px "Source Serif 4",Georgia,serif}.finale-reward{min-height:100px;position:relative;overflow:hidden;padding:12px 70px 11px 52px;border-radius:17px;display:grid;align-content:center;color:#FFF;background:linear-gradient(135deg,#234B62,#173B52)}.finale-reward>div:nth-child(2){display:grid;gap:3px}.finale-reward small{color:#98E1E5;font-size:8px;font-weight:900}.finale-reward strong{font:750 14px "Source Serif 4",Georgia,serif}.finale-reward b{color:#FFE284;font:900 11px "JetBrains Mono",monospace}.finale-reward>.g1-char{position:absolute;right:2px;bottom:-5px;width:67px;height:84px}.finale-medal{position:absolute;left:10px;top:50%;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;transform:translateY(-50%);color:#173B52;background:#95C93D}.preview-language{position:fixed;top:9px;right:9px;z-index:30;display:flex;gap:3px;padding:3px;border-radius:999px;background:rgba(255,255,255,.94)}.preview-language button{padding:4px 9px;border:0;border-radius:999px;background:transparent;cursor:pointer;font-size:10px;font-weight:900}.preview-language .preview-active{color:#FFF;background:#FF5B35}.tiny-action{min-height:46px;padding:8px 12px;border:0;border-radius:13px;justify-self:end;color:${T.accent};background:${T.accentSoft};cursor:pointer;box-shadow:0 8px 18px -16px rgba(${T.shadowBase},.5);font-size:12px;font-weight:800}.marker-control{width:min(620px,94%);padding:10px 13px;border-radius:14px;display:grid;gap:7px;color:${T.navy};background:${T.cyanSoft};font:850 12px 'Manrope',sans-serif}.free-marker{width:100%;min-height:44px;margin:0;accent-color:${T.accent};cursor:pointer}.nl-dot.free{top:102px;background:${T.navy};animation-duration:.4s}.attempt-model{border-radius:20px;transition:box-shadow .32s ease,background .32s ease}.attempt-highlight{box-shadow:0 0 0 3px rgba(22,143,163,.38),0 14px 26px -20px rgba(22,143,163,.8)!important;background:rgba(229,245,246,.72)!important}.attempt-cue{padding:9px 12px;border-radius:12px;color:${T.cyan};background:${T.cyanSoft};font-size:12px;font-weight:850;animation:attempt-cue-in .3s ease both}.stack{animation-duration:.5s}.caption{animation:caption-in .32s ease both}.formula-card{transition-duration:.32s!important}.result-chip{transition-duration:.22s!important}
@keyframes tank-out{from{opacity:0;transform:translateY(-10px)}}@keyframes caption-in{from{opacity:0;transform:translateY(5px)}}@keyframes attempt-cue-in{from{opacity:0;transform:translateY(5px)}}@keyframes page-in{from{opacity:0;transform:translateY(10px)}}@keyframes proof-in{from{opacity:0;transform:translateY(5px)}}@keyframes token-pop{from{opacity:0;transform:scale(.45)}}@keyframes dot-pop{from{opacity:0;transform:translateX(-50%) scale(.55)}}@keyframes arrow-grow{from{transform:scaleX(0);transform-origin:left}}@keyframes pulse{to{transform:scale(1.07)}}
@media(max-width:639.98px){.stage-header{padding-top:58px}.screen-type{display:none}.stage{width:min(390px,100%)}.heading{min-height:72px}.heading h1{font-size:26px}.heading .g1-char{width:65px;height:80px}.model-card,.hook-model,.whole-card,.rule-card,.question{padding:13px;border-radius:18px}.options{grid-template-columns:1fr}.option{min-height:52px}.fraction-bar{height:82px}.tank-shell{width:min(292px,78%);height:168px}.state-grid{grid-template-columns:1fr 1fr}.boundary-grid{grid-template-columns:1fr}.boundary-grid>.state-note{grid-column:1}.hospital-model{padding-inline:7px}.model-choices{grid-template-columns:1fr}.energy-model{grid-template-columns:1fr}.energy-model>strong{transform:rotate(90deg)}.stage-nav{min-height:68px}.btn-white-accent,.btn-ghost{min-width:112px;padding:0 12px}.finale-main,.finale-bottom{grid-template-columns:1fr}.finale-main,.finale-bottom{gap:8px}.finale-takeaway{min-height:36px}.number-line{height:135px;padding-inline:9%}}
.g4-title-claim{width:100%;min-height:100px;padding:13px 18px;border:0;border-radius:17px;display:grid;grid-template-columns:42px 1fr;grid-template-rows:auto auto;align-items:center;column-gap:12px;color:#fff;background:linear-gradient(135deg,#0E6978,#173B52);cursor:pointer;text-align:left;box-shadow:0 22px 42px -25px rgba(14,105,120,.9)}.g4-title-claim>span{grid-row:1/3;width:40px;height:40px;border-radius:50%;display:grid;place-items:center;color:#5A3A00;background:linear-gradient(145deg,#FFE284,#FFC23C);font-size:19px}.g4-title-claim>strong{font:750 16px 'Source Serif 4',Georgia,serif}.g4-title-claim>small{color:#A8EAF0;font-size:11px;font-weight:800}
.feedback{min-height:76px!important;padding:11px 15px 11px 10px!important;grid-template-columns:52px 1fr!important;align-items:center!important;gap:11px!important}.feedback.correct{background:linear-gradient(135deg,#DDF2E6,#F7FFF9)!important;box-shadow:inset 5px 0 ${T.success},0 13px 26px -23px rgba(34,122,83,.75)!important}.feedback.wrong{background:linear-gradient(135deg,#FFF0BE,#FFF9E8)!important;box-shadow:inset 5px 0 ${T.warn},0 13px 26px -23px rgba(169,111,19,.72)!important}.feedback-bit{width:50px;height:62px;display:block;overflow:visible}.feedback-bit .g1-char,.feedback-bit .bit,.feedback-bit>svg{width:100%;height:100%}.feedback p{display:grid;gap:7px;font-size:15px!important;line-height:1.48!important}.feedback-proof{padding-top:7px;border-top:1px solid rgba(34,122,83,.2);color:${T.success};font:900 15px/1.35 'JetBrains Mono',monospace}
.model-choices{grid-template-columns:1fr!important;gap:11px!important}.model-choice{width:100%;min-height:100px;padding:11px 13px;border:0;border-radius:16px;display:grid;grid-template-columns:32px minmax(140px,.8fr) minmax(250px,1.2fr);align-items:center;gap:11px;color:${T.ink};background:#fff;cursor:pointer;text-align:left;box-shadow:0 12px 24px -20px rgba(58,53,48,.6)}.model-choice>b{width:30px;height:30px;border-radius:9px;display:grid;place-items:center;color:#fff;background:${T.cyan};font:900 11px 'JetBrains Mono',monospace}.model-choice>span{font-size:14px;font-weight:850}.model-choice .fraction-model{width:100%}.model-choice.picked{background:${T.accentSoft};box-shadow:inset 0 0 0 3px rgba(255,91,53,.25)}.model-choice.right{background:${T.successSoft};box-shadow:inset 0 0 0 3px rgba(34,122,83,.3)}.model-choice.bad{background:${T.warnSoft};box-shadow:inset 0 0 0 3px rgba(169,111,19,.26)}.model-choice:disabled{cursor:default}
.rule-boundary-models{padding:13px;border-radius:19px;display:grid;grid-template-columns:1fr 34px 1fr;align-items:center;gap:10px;background:${T.cyanSoft}}.rule-boundary-models>div{padding:10px;border-radius:14px;display:grid;grid-template-columns:44px 1fr;align-items:center;gap:9px;background:#fff}.rule-boundary-models>strong{text-align:center;color:${T.accent};font:900 24px 'JetBrains Mono',monospace}.rule-boundary-models .frac{font-size:18px}.tank-body i.tank-removed{opacity:.58}
@media(max-width:639.98px){.g4-title-claim{min-height:88px}.feedback{grid-template-columns:44px 1fr!important}.feedback-bit{width:43px;height:54px}.feedback p{font-size:14px!important}.model-choice{min-height:126px;grid-template-columns:30px 1fr}.model-choice>.fraction-model{grid-column:1/-1}.rule-boundary-models{grid-template-columns:1fr}.rule-boundary-models>strong{transform:rotate(90deg)}}
@media(prefers-reduced-motion:reduce){.lesson-root *,.lesson-root *::before,.lesson-root *::after{scroll-behavior:auto!important;animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important}.state-note,.formula-card,.result-chip,.rule-line,.wrong-formula,.finale-answer,.finale-takeaway,.finale-bridge{opacity:1!important;transform:none!important}}
.caption-slot{flex:none;min-height:38px;padding:6px 10px;border-radius:11px;display:flex;align-items:center;visibility:hidden;color:#fff;background:rgba(23,59,82,.94);font-size:10px;line-height:1.22}.caption-slot.is-visible{visibility:visible}.feedback.feedback-slot{height:76px;min-height:76px;overflow:hidden;visibility:hidden;opacity:0;animation:none}.feedback.feedback-slot.open{visibility:visible;opacity:1}.feedback-bit{width:48px;height:58px;display:block}.feedback-bit .g1-char,.feedback-bit>svg{width:100%;height:100%}.feedback-proof{display:block;margin-top:4px;padding-top:4px;border-top:1px solid rgba(34,122,83,.2);color:${T.success};font:900 12px/1.2 'JetBrains Mono',monospace}.feedback-proof small{display:block;font-size:8px;letter-spacing:.1em}.lesson-root{height:100%!important;min-height:0!important;overflow:hidden!important}.stage-content{display:flex;flex-direction:column;gap:4px;overflow:hidden!important}.stage-content>.stack{flex:1;min-height:0}.btn-white-accent:disabled{cursor:not-allowed;opacity:.46}
@media(max-width:639.98px){.stage-header{padding-top:11px!important;padding-bottom:4px!important}.lesson-root-preview .stage-header{padding-top:52px!important}.progress-track{height:4px!important;margin-bottom:5px!important}.stage-content{padding-top:3px!important;padding-bottom:3px!important}.stage-nav{min-height:52px!important}.stack{gap:4px!important}.heading{min-height:40px!important}.heading h1{font-size:17px!important}.heading .g1-char{width:38px!important;height:48px!important}.question,.model-card,.visual-card,.hook-model,.whole-card,.rule-card,.beat-list{padding:5px!important;border-radius:11px!important}.boundary-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:4px!important;padding:5px!important;border-radius:11px!important}.boundary-grid>div{padding:4px!important;border-radius:9px!important}.boundary-grid>.state-note{grid-column:1/-1!important}.boundary-grid .fraction-model{gap:3px!important}.boundary-grid .fraction-bar{height:44px!important;border-radius:9px!important}.boundary-grid .model-label{padding:4px 6px!important;border-radius:8px!important;font-size:9px!important}.options{gap:3px!important}.option{min-height:44px!important;padding:4px!important;border-radius:9px!important;font-size:9px!important}.feedback.feedback-slot{height:54px;min-height:54px!important;padding:4px 6px!important;grid-template-columns:32px 1fr!important;gap:4px!important}.feedback-bit{width:31px;height:39px}.feedback p{font-size:9px!important;line-height:1.16!important}.caption-slot{min-height:28px;padding:3px 7px;font-size:8px}.beat-list{gap:3px!important}.beat{min-height:29px!important;padding:3px!important;font-size:8px!important}.btn-white-accent,.btn-ghost{min-height:44px!important;min-width:104px!important;padding:0 8px!important;font-size:11px!important}.finale-main,.finale-bottom{grid-template-columns:1fr 1fr!important;gap:4px!important}}
.strategy-replay{min-height:44px;padding:7px 12px;border:0;border-radius:11px;justify-self:center;color:${T.cyan};background:${T.cyanSoft};cursor:pointer;font-size:11px;font-weight:850}.strategy-replay:disabled{cursor:not-allowed;opacity:.46}
@media(min-width:640px) and (max-width:1100px) and (max-height:800px){.stage-discovery .stack{grid-template-columns:minmax(0,1fr) minmax(0,1fr);grid-template-rows:auto minmax(0,1fr) auto;align-content:stretch;column-gap:12px;row-gap:8px}.stage-discovery .heading{grid-column:1/-1;min-height:64px}.stage-discovery .heading h1{font-size:29px}.stage-discovery .heading .g1-char{width:60px;height:75px}.stage-discovery .model-card{grid-column:1/-1;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);align-items:center;gap:10px;padding:12px}.stage-discovery .tank-model{width:100%}.stage-discovery .tank-shell{width:min(300px,80%);height:174px}.stage-discovery .formula-card,.stage-discovery .state-note,.stage-discovery .result-chip{min-height:44px;display:grid;place-items:center}.stage-discovery .strategy-replay{grid-column:1/-1}}
.final-reflection{padding:6px 8px;border-radius:12px;display:grid;gap:5px;background:rgba(255,255,255,.9)}.final-reflection>strong{font:750 12px/1.2 'Source Serif 4',Georgia,serif}.final-reflection>div{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px}.final-reflection button{min-height:44px;padding:4px;border:0;border-radius:9px;display:grid;grid-template-columns:20px 1fr;align-items:center;gap:3px;color:${T.navy};background:${T.cyanSoft};cursor:pointer;text-align:left;font-size:8px;font-weight:850}.final-reflection button>span{width:19px;height:19px;border-radius:6px;display:grid;place-items:center;color:#fff;background:${T.cyan}}.final-reflection button.is-selected{color:#fff;background:${T.cyan}}.final-reflection button:disabled{cursor:default}.g4-title-claim:disabled{cursor:not-allowed;opacity:.46}
`;

// ---------------------------------------------------------------------------
// 21-DARS USLUBLARI. s0 dan boshqa hamma ekranda ramka och ko'k (T.cyanSoft).
// Balandlik dvh bilan chegaralangan: joy kamayganda model kichrayadi, matn
// esa qirqilmaydi - shuning uchun skroll ham, yo'qolgan element ham yo'q.
// Takrorlanuvchi (cheksiz) animatsiya yo'q; reduced-motion hammasini o'chiradi.
// ---------------------------------------------------------------------------
const LESSON_STYLES = `
.lesson-root .mono { font-family: 'JetBrains Mono', monospace; font-weight: 800; }
/* Asosiy model ramkasi ekran balandligining bir qismini egallaydi: shunda
   pastda katta bo'sh joy qolmaydi, lekin dvh chegarasi tufayli sig'maslik ham
   yuz bermaydi. */
.lesson-root .stack > .model-card { min-height: clamp(128px, 24dvh, 236px); }
/* Kontent yuqoridan boshlanadi (metodist talabi 2026-08-19): sarlavha va
   ramkalar ekranning yuqori qismidan yoziladi, markazga surilmaydi. */
.lesson-root .stage-content > .stack { align-content: start; }
.lesson-root .stack > .model-card.compact { min-height: 0; }
/* Model kartasi ichidagi yorliq va natija qatori ham markazda turadi. */
.lesson-root .stack > .model-card { justify-items: center; }
/* Tanlangan noto'g'ri variant joyida qoladi, lekin xiralashadi va bosilmaydi. */
.lesson-root .option.bad { opacity: .6; cursor: default; }
.lesson-root .option:disabled { cursor: default; }
/* To'rt variant 2x2 setkada (uch variant bir qatorda qoladi). */
.lesson-root .options:has(> :nth-child(4)) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.lesson-root .lead-line {
  margin: 0;
  color: ${T.ink2};
  font-size: clamp(13px, 1.7vw, 15px);
  line-height: 1.36;
  font-weight: 650;
}

/* --- Qadamli tushuntirish paneli ------------------------------------------ */
.step-panel {
  position: relative;
  isolation: isolate;
  min-width: 0;
  min-height: clamp(228px, 44dvh, 392px);
  overflow: hidden;
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto auto auto;
  gap: clamp(6px, 1.1dvh, 12px);
  padding: clamp(9px, 1.4dvh, 14px);
  border: 1px solid rgba(22,143,163,.22);
  border-radius: 18px;
  background: ${T.cyanSoft};
  box-shadow: 0 14px 30px -26px rgba(${T.shadowBase},.5);
}
.step-model {
  min-height: 0;
  max-height: clamp(118px, 32dvh, 286px);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.step-model > * { width: 100%; }
.step-chips { display: flex; flex-wrap: wrap; gap: 6px; }
.step-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 26px;
  padding: 4px 10px 4px 5px;
  border-radius: 999px;
  color: ${T.ink3};
  background: rgba(255,255,255,.66);
  font-size: 11px;
  font-weight: 800;
  transition: color .3s ease, background .3s ease;
}
.step-chip b {
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  color: #FFFFFF;
  background: ${T.ink3};
  font-size: 10px;
}
.step-chip.is-done { color: ${T.ink}; background: #FFFFFF; }
.step-chip.is-done b { background: ${T.success}; }
.step-chip.is-active { box-shadow: 0 0 0 2px rgba(22,143,163,.35); }
.step-caption {
  margin: 0;
  min-height: 40px;
  color: ${T.ink};
  font-size: clamp(13px, 1.8vw, 15px);
  line-height: 1.36;
  font-weight: 700;
}
.step-actions { display: flex; align-items: center; gap: 10px; }
.btn-step {
  min-height: 44px;
  padding: 0 18px;
  border: 0;
  border-radius: 13px;
  color: #FFFFFF;
  background: ${T.cyan};
  font-family: inherit;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  transition: background .25s ease, transform .25s ease;
}
.btn-step:hover:not(:disabled) { background: ${T.navy}; transform: translateY(-1px); }
.btn-step:disabled { opacity: .45; cursor: default; }
.btn-step:focus-visible { outline: 3px solid ${T.accent}; outline-offset: 2px; }
.step-done {
  color: ${T.success};
  font-size: clamp(12px, 1.6vw, 14px);
  font-weight: 800;
  line-height: 1.32;
}

/* --- Zaxira modeli -------------------------------------------------------- */
.reserve { display: grid; gap: 7px; justify-items: center; width: 100%; }
.reserve-shell {
  position: relative;
  width: min(430px, 100%);
  padding: 20px 26px 9px 11px;
  border: 3px solid ${T.navy};
  border-radius: 14px;
  background: linear-gradient(180deg, #FFFFFF, #EDF6F7);
}
/* Yorliq ramka ICHIDA turadi: tashqarida bo'lganda yuqori qirrada qirqilardi. */
.reserve-scale {
  position: absolute;
  top: 4px;
  left: 11px;
  padding: 0 7px;
  border-radius: 999px;
  color: #FFFFFF;
  background: ${T.navy};
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 800;
  line-height: 13px;
}
.reserve-cells { display: grid; gap: 3px; }
.reserve-cell {
  height: clamp(30px, 7dvh, 52px);
  padding: 0;
  border: 1px solid rgba(23,59,82,.22);
  border-radius: 5px;
  background: #FFFFFF;
  transition: background .4s ease, border-color .4s ease, opacity .4s ease;
}
.reserve-cell.is-full { background: linear-gradient(180deg, #4FC3D6, ${T.cyan}); border-color: ${T.cyan}; }
.reserve-cell.is-leaving { background: repeating-linear-gradient(135deg, ${T.accentSoft} 0 5px, #FFFFFF 5px 10px); border-color: ${T.accent}; }
.reserve-cell.is-empty { background: #F4F7F7; }
button.reserve-cell { min-height: 44px; cursor: pointer; }
button.reserve-cell:focus-visible { outline: 3px solid ${T.accent}; outline-offset: 2px; }
button.reserve-cell.is-empty { cursor: default; }
.reserve-pipe {
  position: absolute;
  top: 50%;
  right: -13px;
  width: 22px;
  height: 9px;
  border-radius: 3px;
  background: ${T.navy};
  transform: translateY(-50%);
}
.reserve.compact .reserve-cell { height: clamp(22px, 4dvh, 34px); }
.reserve.compact .reserve-shell { padding: 7px 22px 7px 9px; }

/* --- Butun -> kasr -------------------------------------------------------- */
.whole-split { display: grid; gap: 8px; justify-items: center; width: 100%; }
.whole-split .fraction-bar { width: min(430px, 100%); }
.whole-solid {
  display: grid;
  place-items: center;
  height: clamp(34px, 7dvh, 52px);
  border: 3px solid ${T.navy};
  border-radius: 11px;
  background: linear-gradient(180deg, #4FC3D6, ${T.cyan});
}
.whole-solid span { color: #FFFFFF; font-family: 'JetBrains Mono', monospace; font-size: 20px; font-weight: 800; }
.whole-split .removed { background: repeating-linear-gradient(135deg, ${T.accentSoft} 0 5px, #FFFFFF 5px 10px) !important; }

/* --- Raqam plitalari (klaviatura yo'q) ------------------------------------ */
.digit-pad {
  display: grid;
  grid-template-columns: repeat(10, minmax(0, 1fr));
  gap: 5px;
  width: min(470px, 100%);
  margin-inline: auto;
}
.digit-key {
  min-height: 44px;
  padding: 0;
  border: 1px solid rgba(22,143,163,.3);
  border-radius: 11px;
  color: ${T.ink};
  background: #FFFFFF;
  font-family: 'JetBrains Mono', monospace;
  font-size: 17px;
  font-weight: 800;
  cursor: pointer;
  transition: background .22s ease, color .22s ease, border-color .22s ease;
}
.digit-key:hover:not(:disabled) { background: ${T.cyanSoft}; }
.digit-key:focus-visible { outline: 3px solid ${T.accent}; outline-offset: 2px; }
.digit-key:disabled { opacity: .5; cursor: default; }
.digit-key.is-right { color: #FFFFFF; background: ${T.success}; border-color: ${T.success}; }
.digit-key.is-bad { color: #FFFFFF; background: #B85C32; border-color: #B85C32; }

/* --- Bit xatosi ----------------------------------------------------------- */
.error-card {
  position: relative;
  isolation: isolate;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: clamp(10px, 1.6dvh, 16px);
  border: 1px solid rgba(169,111,19,.28);
  border-radius: 18px;
  background: ${T.warnSoft};
}
.error-record { display: grid; gap: 3px; justify-items: center; }
.error-record span { color: ${T.ink2}; font-size: clamp(15px, 2.2vw, 19px); }
.error-record b { color: #B85C32; font-size: clamp(19px, 3vw, 26px); }
.error-mark { color: #B85C32; font-size: 22px; font-weight: 900; }

/* --- Jadval --------------------------------------------------------------- */
.task-table { width: min(430px, 100%); display: grid; gap: 3px; }
.task-row { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 3px; }
.task-row span {
  padding: 6px 5px;
  border-radius: 9px;
  background: #FFFFFF;
  text-align: center;
  font-size: 13px;
  font-weight: 800;
}
.task-head span { color: ${T.ink2}; background: rgba(255,255,255,.6); font-size: 10px; font-weight: 800; }
.task-chip {
  padding: 3px 11px;
  border-radius: 999px;
  color: ${T.cyan};
  background: #FFFFFF;
  font-size: 14px;
}
.remaining-line { color: ${T.ink2}; font-size: 13px; font-weight: 700; }
.remaining-line b { color: ${T.cyan}; font-size: 15px; }

/* --- Ikki yo'l: ramkalar bir xil o'lchamda, markazda --------------------- */
.route-cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  width: min(600px, 100%);
  margin-inline: auto;
}
.route-card {
  min-height: clamp(104px, 22dvh, 188px);
  padding: 11px;
  border: 1px solid rgba(22,143,163,.26);
  border-radius: 16px;
  display: grid;
  align-content: start;
  gap: 6px;
  color: ${T.ink};
  background: ${T.cyanSoft};
  text-align: left;
  font-family: inherit;
  cursor: pointer;
  transition: background .25s ease, border-color .25s ease, transform .25s ease;
}
.route-card:hover:not(:disabled) { transform: translateY(-2px); }
.route-card:focus-visible { outline: 3px solid ${T.accent}; outline-offset: 2px; }
.route-card:disabled { cursor: default; }
.route-label { font-size: 13px; font-weight: 800; }
.route-body { color: ${T.cyan}; font-size: 14px; }
.route-steps { color: ${T.ink2}; font-size: 11px; font-weight: 800; }
.route-card.is-picked { border-color: ${T.cyan}; background: #FFFFFF; }
.route-card.is-best { border-color: ${T.success}; box-shadow: inset 0 0 0 2px rgba(34,122,83,.3); }

/* --- Moslashtirish: ikki ustun bir xil o'lchamda, markazda ---------------- */
/* Ikkala ustun bir xil kenglikda, kartalar bir xil balandlikda (grid qatorlari
   teng) va butun taxta markazda - metodist sharti 5. */
.matching-board {
  position: relative;
  isolation: isolate;
  width: min(620px, 100%);
  margin-inline: auto;
  min-height: clamp(206px, 40dvh, 340px);
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(28px, 6vw, 56px);
}
.matching-column {
  display: grid;
  grid-template-rows: repeat(3, minmax(0, 1fr));
  gap: 9px;
  align-content: stretch;
}
.match-card {
  position: relative;
  z-index: 2;
  height: 100%;
  min-height: 62px;
  padding: 9px;
  border: 1px solid rgba(22,143,163,.26);
  border-radius: 14px;
  display: grid;
  align-content: center;
  justify-items: center;
  gap: 5px;
  color: ${T.ink};
  background: ${T.cyanSoft};
  font-family: inherit;
  font-size: 14px;
  cursor: pointer;
  transition: background .25s ease, border-color .25s ease;
}
.match-card:hover:not(:disabled) { background: #FFFFFF; }
.match-card:focus-visible { outline: 3px solid ${T.accent}; outline-offset: 2px; }
.match-card.is-active { border-color: ${T.accent}; background: #FFFFFF; box-shadow: 0 0 0 2px rgba(255,91,53,.28); }
.match-card.is-done { border-color: ${T.success}; background: ${T.successSoft}; cursor: default; }
.match-caption { color: ${T.cyan}; font-size: 13px; }
.match-card .fraction-model { width: 100%; }

/* --- Qoida ramkasi -------------------------------------------------------- */
.rule-frame {
  position: relative;
  min-width: 0;
  min-height: clamp(168px, 30dvh, 264px);
  align-content: center;
  overflow: hidden;
  display: grid;
  gap: 7px;
  padding: clamp(10px, 1.5dvh, 15px);
  border: 1px solid rgba(22,143,163,.24);
  border-left: 4px solid ${T.accent};
  border-radius: 16px;
  background: ${T.cyanSoft};
}
.rule-badge {
  justify-self: start;
  padding: 2px 10px;
  border-radius: 999px;
  color: #FFFFFF;
  background: ${T.accent};
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .08em;
}
.rule-text {
  margin: 0;
  color: ${T.ink};
  font-size: clamp(13px, 1.9vw, 16px);
  line-height: 1.38;
  font-weight: 750;
  opacity: .25;
  transition: opacity .5s ease;
}
.rule-text.show { opacity: 1; }
.rule-lines { display: flex; flex-wrap: wrap; gap: 6px; }
.rule-lines .rule-line { padding: 5px 11px; border-radius: 999px; background: #FFFFFF; font: 800 12px 'Manrope', system-ui, sans-serif; color: ${T.ink2}; }
.rule-formula {
  justify-self: center;
  color: ${T.cyan};
  font-size: clamp(17px, 2.6vw, 22px);
  opacity: .25;
  transition: opacity .5s ease;
}
.rule-formula.show { opacity: 1; }
.rule-source { color: ${T.ink3}; font-size: 10px; font-weight: 700; }

/* --- Xuk yozuvi va mayda joylar ------------------------------------------ */
.hook-record {
  margin-top: 7px;
  color: #EAF9FB;
  font-size: clamp(14px, 2.1vw, 18px);
  opacity: 0;
  transition: opacity .6s ease;
}
.hook-record.show { opacity: 1; }
.hook-record b { color: #FF9F80; }
.round-meter {
  justify-self: start;
  padding: 3px 10px;
  border-radius: 999px;
  color: ${T.cyan};
  background: ${T.cyanSoft};
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 800;
}
.round-question { display: grid; gap: 9px; }
.round-question > h2 { color: ${T.ink}; font-size: clamp(18px, 2.8vw, 24px); }
.strategy-question, .case-question {
  margin: 0;
  color: ${T.ink};
  font-size: clamp(15px, 2.2vw, 18px);
  line-height: 1.3;
  font-weight: 800;
}
.case-card { gap: 9px; }

@media (max-width: 639.98px) {
  .step-panel { padding: 8px; gap: 6px; }
  .step-caption { min-height: 34px; font-size: 12.5px; }
  .step-chip { font-size: 10px; }
  .digit-pad { gap: 4px; }
  .digit-key { font-size: 15px; }
  .route-cards { grid-template-columns: 1fr; gap: 7px; }
  .route-card { min-height: 74px; }
  .matching-board { gap: 22px; }
  .match-card { min-height: 54px; font-size: 12.5px; }
  .reserve-shell { padding: 7px 22px 7px 9px; }
}

@media (prefers-reduced-motion: reduce) {
  .step-chip, .btn-step, .route-card, .match-card, .digit-key,
  .rule-text, .rule-formula, .hook-record, .reserve-cell { transition: none !important; }
}

/* --- Yakuniy slayd (etalon Dars01 tuzilishi) ---------------------------- */
.option-answer-dismiss {
  animation: answer-option-dismiss .46s cubic-bezier(.4,0,.7,1) var(--answer-exit-delay, 0ms) both;
}
.option-answer-confirm {
  animation: answer-option-confirm .62s cubic-bezier(.16,1,.3,1) .08s both;
}
@keyframes answer-option-dismiss {
  from { opacity: 1; transform: translateY(0) scale(1); }
  to { opacity: 0; transform: translateY(-8px) scale(.96); }
}
@keyframes answer-option-confirm {
  0% { transform: translateY(0) scale(1); box-shadow: 0 10px 24px -17px rgba(${T.shadowBase},.44); }
  45% { transform: translateY(-7px) scale(1.025); box-shadow: 0 0 0 6px rgba(34,122,83,.10); }
  100% { transform: translateY(-3px) scale(1); box-shadow: 0 12px 26px -17px rgba(34,122,83,.45); }
}

.summary-stack { gap: 12px; }
.reward-stage {
  position: relative;
  width: min(840px, 100%);
  min-height: 154px;
  margin: 0 auto;
  padding: 16px 145px 15px 108px;
  border-radius: 25px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  overflow: hidden;
  color: #FFFFFF;
  background:
    radial-gradient(circle at 82% 20%, rgba(255,194,60,.26), transparent 30%),
    linear-gradient(135deg, #173B52, #0E6978);
  box-shadow: 0 24px 50px -30px rgba(14,33,44,.8);
  transition: transform .5s ease, box-shadow .5s ease;
}
.reward-locked { filter: saturate(.72); }
.reward-unlocked {
  transform: translateY(-2px);
  box-shadow: 0 28px 58px -27px rgba(22,143,163,.8);
}
.reward-bit {
  position: absolute;
  right: 24px;
  bottom: 7px;
  width: 92px;
  height: 115px;
}
.reward-bit .g1-char { width: 100%; height: 100%; }
.reward-unlocked .reward-bit { animation: g4bitfloat 2.8s ease-in-out 4; }
.reward-medal {
  position: absolute;
  left: 24px;
  top: 50%;
  width: 66px;
  height: 66px;
  border: 4px solid rgba(255,255,255,.58);
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #5A3A00;
  background: linear-gradient(145deg, #FFE284, #FFC23C);
  box-shadow: 0 0 0 8px rgba(255,255,255,.08), 0 15px 30px -15px rgba(0,0,0,.6);
  font-size: 30px;
}
.reward-kicker {
  color: #A8EAF0;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: .13em;
}
.reward-stage h1 {
  max-width: 590px;
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: clamp(21px, 3vw, 30px);
  line-height: 1.05;
}
.reward-stage > p {
  max-width: 580px;
  color: rgba(255,255,255,.78);
  font-size: 12px;
  line-height: 1.4;
}
.reward-score {
  align-self: flex-start;
  margin-top: 5px;
  padding: 5px 9px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 7px;
  background: rgba(255,255,255,.10);
}
.reward-score strong { color: #FFE284; font-family: 'JetBrains Mono', monospace; }
.reward-score span { color: rgba(255,255,255,.72); font-size: 9px; }
.reward-confetti { position: absolute; inset: 0; pointer-events: none; }
.reward-confetti i {
  position: absolute;
  top: -16px;
  width: 7px;
  height: 12px;
  border-radius: 2px;
  animation: reward-confetti 2.4s linear 3;
}
.reward-confetti i:nth-child(4n+1) { background: #FFC23C; }
.reward-confetti i:nth-child(4n+2) { background: #FF5B35; }
.reward-confetti i:nth-child(4n+3) { background: #77E1EA; }
.reward-confetti i:nth-child(4n) { background: #95C93D; }
.reward-confetti i:nth-child(1) { left: 8%; animation-delay: -.3s; }
.reward-confetti i:nth-child(2) { left: 17%; animation-delay: -1.1s; }
.reward-confetti i:nth-child(3) { left: 29%; animation-delay: -.7s; }
.reward-confetti i:nth-child(4) { left: 41%; animation-delay: -1.7s; }
.reward-confetti i:nth-child(5) { left: 52%; animation-delay: -.2s; }
.reward-confetti i:nth-child(6) { left: 63%; animation-delay: -1.3s; }
.reward-confetti i:nth-child(7) { left: 73%; animation-delay: -.8s; }
.reward-confetti i:nth-child(8) { left: 84%; animation-delay: -1.9s; }
.reward-confetti i:nth-child(9) { left: 12%; animation-delay: -2s; }
.reward-confetti i:nth-child(10) { left: 36%; animation-delay: -1.4s; }
.reward-confetti i:nth-child(11) { left: 68%; animation-delay: -.5s; }
.reward-confetti i:nth-child(12) { left: 91%; animation-delay: -1.6s; }
@keyframes reward-confetti {
  to { transform: translateY(230px) rotate(460deg); }
}

.summary-action-layout {
  min-height: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  align-items: stretch;
}

.summary-rule-items {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: 1fr;
  gap: 6px;
}
.summary-rule-items > span {
  min-width: 0;
  padding: 7px;
  border: 1px solid rgba(22,143,163,.11);
  border-radius: 11px;
  display: grid;
  grid-template-columns: 22px 1fr;
  align-items: center;
  gap: 6px;
  color: ${T.ink2};
  background: rgba(255,255,255,.82);
}
.reflection-card > .summary-question-kicker,
.reflection-card > .summary-question,
.reflection-card > .summary-question-stem,
.reflection-card > .reflection-options,
.reflection-card > .reflection-resolution,
.reflection-card > .feedback {
  flex-shrink: 0;
}
.reflection-resolution {
  display: grid;
  gap: 7px;
}
.summary-card h2 { margin-bottom: 8px; font-size: 14px; }
.summary-card ul { padding-left: 17px; display: grid; gap: 5px; color: ${T.ink2}; font-size: 12px; line-height: 1.35; }
.summary-question-kicker {
  margin-bottom: 4px;
  color: ${T.accent};
  font-family: 'JetBrains Mono', monospace;
  font-size: 8px;
  font-weight: 900;
  letter-spacing: .1em;
}
.summary-card .summary-question {
  margin-bottom: 4px;
  color: ${T.navy};
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: 15px;
  line-height: 1.18;
}
.summary-question-stem {
  margin-bottom: 7px !important;
  color: ${T.ink2};
  font-size: 10px;
  line-height: 1.3;
}
.reflection-options {
  max-height: 180px;
  display: grid;
  gap: 6px;
  overflow: hidden;
  opacity: 1;
  transition:
    max-height .75s cubic-bezier(.22,.8,.3,1) .48s,
    opacity .28s ease .52s,
    margin .75s cubic-bezier(.22,.8,.3,1) .48s;
}
.reflection-options-solved {
  max-height: 0;
  margin-block: 0;
  opacity: 0;
  pointer-events: none;
}
.reflection-option {
  min-height: 34px;
  padding: 7px 9px;
  border: 0;
  border-radius: 10px;
  color: ${T.ink};
  background: #F4F7F5;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  text-align: left;
  font-size: 11px;
  font-weight: 700;
}
.reflection-option > span {
  width: 21px;
  height: 21px;
  flex: 0 0 21px;
  border-radius: 7px;
  display: grid;
  place-items: center;
  color: ${T.cyan};
  background: ${T.cyanSoft};
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  font-weight: 900;
}
.reflection-correct { color: ${T.success}; background: ${T.successSoft}; }
.reflection-wrong { color: ${T.warn}; background: ${T.warnSoft}; }
.reflection-solved {
  min-height: 42px;
  padding: 9px 11px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  color: ${T.success};
  background: ${T.successSoft};
  font-size: 11px;
  font-weight: 800;
}
.reflection-card .feedback-card {
  min-height: 62px;
  padding: 5px 10px 5px 6px;
}
.reflection-card .g4-bit-reaction-figure {
  width: 44px;
  height: 54px;
  flex-basis: 44px;
}
.reflection-card .g4-bit-reaction-copy { font-size: 14px; }
.final-mission-heading {
  width: min(840px, 100%);
  margin: 0 auto;
  padding: 12px 16px;
  border: 1px solid rgba(255,91,53,.17);
  border-radius: 17px;
  background:
    linear-gradient(100deg, rgba(255,91,53,.09), transparent 48%),
    rgba(255,255,255,.9);
  box-shadow: 0 13px 28px -24px rgba(255,91,53,.72);
}
.final-mission-heading > span {
  display: flex;
  align-items: center;
  gap: 7px;
  color: ${T.accent};
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: .12em;
}
.final-mission-heading > span i {
  font-size: 8px;
  animation: final-marker-pulse 1.5s ease-in-out 3;
}
.final-mission-heading h1 {
  margin-top: 3px;
  color: ${T.navy};
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: clamp(21px, 3vw, 28px);
  line-height: 1.08;
}
.final-mission-heading p {
  margin-top: 3px;
  color: ${T.ink2};
  font-size: 11px;
  line-height: 1.32;
}
@keyframes final-marker-pulse {
  50% { opacity: .45; transform: scale(.8); }
}
.summary-final-layout {
  width: min(840px, 100%);
  margin: 0 auto;
  grid-template-columns: minmax(0, 1fr);
  align-items: start;
}
.summary-card {
  min-width: 0;
  height: 100%;
  padding: 13px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  background: rgba(255,255,255,.92);
  box-shadow: 0 12px 26px -21px rgba(${T.shadowBase},.5);
}
.reflection-card > .summary-question-kicker,
.reflection-card > .summary-question,
.reflection-card > .summary-question-stem,
.reflection-card > .reflection-options,
.reflection-card > .reflection-resolution,
.reflection-card > .feedback {
  flex-shrink: 0;
}
.final-question-card {
  height: auto;
  border: 2px solid rgba(255,91,53,.22);
  box-shadow:
    inset 0 4px 0 rgba(255,91,53,.88),
    0 18px 38px -28px rgba(255,91,53,.7);
}
.final-question-card .summary-question-kicker {
  min-height: 25px;
  margin-bottom: 8px;
  padding: 4px 6px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #FFFFFF;
  background: linear-gradient(90deg, ${T.accent}, #FF7658);
}
.final-question-card .summary-question-kicker > b {
  margin-left: auto;
  padding: 3px 6px;
  border-radius: 999px;
  color: #7D250F;
  background: rgba(255,255,255,.76);
  font-size: 7px;
  letter-spacing: .08em;
}
.final-question-card .summary-question {
  font-size: clamp(17px, 2.4vw, 22px);
  line-height: 1.18;
}
.summary-support-column {
  min-width: 0;
  display: grid;
  gap: 9px;
}
.summary-rules-disclosure {
  min-width: 0;
  border: 1px solid rgba(22,143,163,.2);
  border-radius: 16px;
  overflow: hidden;
  background: rgba(255,255,255,.94);
  box-shadow: 0 14px 30px -24px rgba(22,143,163,.72);
}
.summary-rules-toggle {
  width: 100%;
  min-height: 64px;
  padding: 8px 10px;
  border: 0;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 9px;
  color: ${T.ink};
  background:
    linear-gradient(135deg, rgba(230,247,250,.8), transparent 62%),
    #FFFFFF;
  cursor: pointer;
  text-align: left;
}
.summary-rules-toggle > span {
  min-width: 55px;
  padding: 7px 8px;
  border-radius: 10px;
  color: #FFFFFF;
  background: ${T.cyan};
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 900;
  text-align: center;
}
.summary-rules-toggle > div { min-width: 0; display: grid; gap: 2px; }
.summary-rules-toggle strong { font-size: 13px; line-height: 1.2; }
.summary-rules-toggle small { color: ${T.cyan}; font-size: 9px; font-weight: 800; }
.summary-rules-toggle > i {
  color: ${T.cyan};
  font-size: 24px;
  font-style: normal;
  transform: rotate(0);
  transition: transform .55s cubic-bezier(.16,1,.3,1);
}
.summary-rules-open .summary-rules-toggle > i { transform: rotate(180deg); }
.summary-rules-panel {
  max-height: 0;
  padding: 0 9px;
  overflow: hidden;
  opacity: 0;
  transform: translateY(-7px);
  transition:
    max-height .65s cubic-bezier(.22,.8,.3,1),
    padding .65s cubic-bezier(.22,.8,.3,1),
    opacity .4s ease,
    transform .55s ease;
}
.summary-rules-open .summary-rules-panel {
  max-height: 260px;
  padding: 0 9px 9px;
  opacity: 1;
  transform: translateY(0);
}
.summary-rules-panel .summary-rule-items > span {
  padding: 6px;
  grid-template-columns: 20px 1fr;
  gap: 5px;
}
.summary-rules-panel .summary-rule-items > span > i {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: ${T.cyan};
  background: ${T.cyanSoft};
  font-family: 'JetBrains Mono', monospace;
  font-size: 8px;
  font-style: normal;
}
.summary-rules-panel .summary-rule-items p { font-size: 9px; line-height: 1.22; }
.reward-stage-compact {
  width: 100%;
  min-height: 116px;
  margin: 0;
  padding: 12px 82px 11px 67px;
  border-radius: 17px;
  gap: 4px;
}
.reward-stage-compact .reward-medal {
  left: 11px;
  width: 44px;
  height: 44px;
  border-width: 3px;
  font-size: 19px;
}
.reward-stage-compact .reward-bit {
  right: 3px;
  bottom: 2px;
  width: 72px;
  height: 90px;
}
.reward-stage-compact h2 {
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: clamp(16px, 2.2vw, 21px);
  line-height: 1.05;
}

/* Yakuniy slaydning mobil o'lchamlari (etalon Dars01 bilan bir xil) */
@media (max-width: 639.98px) {
  .summary-action-layout {
    grid-template-columns: 1fr;
    grid-auto-rows: auto;
    align-items: start;
    gap: 6px;
  }
  .summary-card { height: auto; }
  .summary-rule-items { gap: 4px; }
  .summary-rule-items > span { padding: 4px; grid-template-columns: 18px 1fr; gap: 4px; }
  .summary-card { padding: 8px; }
  .summary-card h2 { margin-bottom: 5px; font-size: 12px; }
  .summary-question-kicker { font-size: 7px; }
  .summary-card .summary-question { margin-bottom: 3px; font-size: 12px; }
  .summary-question-stem { margin-bottom: 4px !important; font-size: 8px; }
  .reflection-options { grid-template-columns: 1fr; gap: 4px; }
  .reflection-option { min-height: 30px; padding: 4px 6px; font-size: 9px; }
  .reflection-option > span { width: 18px; height: 18px; flex-basis: 18px; font-size: 7px; }
  .final-mission-heading { padding: 8px 10px; border-radius: 13px; }
  .final-mission-heading > span { font-size: 7px; }
  .final-mission-heading h1 { margin-top: 2px; font-size: 18px; }
  .final-mission-heading p { font-size: 8px; line-height: 1.25; }
  .summary-final-layout { grid-template-columns: 1fr; gap: 6px; }
  .final-question-card { padding: 9px; }
  .final-question-card .summary-question-kicker { min-height: 23px; margin-bottom: 6px; font-size: 7px; }
  .final-question-card .summary-question { margin-bottom: 4px; font-size: 17px; line-height: 1.16; }
  .final-question-card .summary-question-stem { font-size: 9px; }
  .summary-support-column { gap: 6px; }
  .summary-rules-toggle { min-height: 52px; padding: 6px 8px; gap: 7px; }
  .summary-rules-toggle > span { min-width: 48px; padding: 6px; font-size: 9px; }
  .summary-rules-toggle strong { font-size: 11px; }
  .summary-rules-toggle small { font-size: 7px; }
  .summary-rules-toggle > i { font-size: 20px; }
  .summary-rules-open .summary-rules-panel { max-height: 210px; padding: 0 7px 7px; }
  .summary-rules-panel .summary-rule-items > span { padding: 4px; grid-template-columns: 18px 1fr; }
  .summary-rules-panel .summary-rule-items > span > i { width: 18px; height: 18px; font-size: 7px; }
  .summary-rules-panel .summary-rule-items p { font-size: 7px; }
  .reward-stage-compact {
    min-height: 88px;
    padding: 9px 59px 8px 51px;
    border-radius: 14px;
  }
  .reward-stage-compact .reward-medal { left: 8px; width: 34px; height: 34px; font-size: 14px; }
  .reward-stage-compact .reward-bit { width: 57px; height: 71px; }
  .reward-stage-compact h2 { margin: 0; font-size: 14px; }
}

/* Yakuniy slayd 360x640 da ham to'liq sig'adi: savol va variantlar bir pog'ona
   kichrayadi, mukofot paneli ixchamlashadi. */
@media (max-width: 639.98px) {
  .summary-stack { gap: 5px; }
  .final-mission-heading { padding: 6px 9px; }
  .final-mission-heading h1 { font-size: 15px; }
  .final-mission-heading p { font-size: 8px; }
  .final-question-card { padding: 8px; }
  .final-question-card .summary-question { margin-bottom: 3px; font-size: 13px; line-height: 1.18; }
  .final-question-card .summary-question-kicker { min-height: 19px; margin-bottom: 4px; }
  .reflection-options { gap: 3px; }
  .reflection-option { min-height: 26px; padding: 3px 6px; font-size: 8.5px; }
  .summary-support-column { gap: 5px; }
  .summary-rules-toggle { min-height: 40px; padding: 5px 7px; }
  .reward-stage-compact { min-height: 74px; padding: 7px 52px 6px 46px; }
  .reward-stage-compact h2 { font-size: 12px; }
  .reward-stage-compact .reward-bit { width: 48px; height: 60px; }
  .reward-stage-compact .reward-medal { width: 28px; height: 28px; font-size: 12px; }
}

/* Eng kichik ekran (360x640) uchun yakuniy pog'ona: 13 px yetishmasligi
   yopiladi, matn o'lchamlari o'zgarmaydi. */
@media (max-width: 400px) {
  .summary-stack { gap: 4px; }
  .final-mission-heading { padding: 5px 8px; }
  .reflection-option { min-height: 24px; }
  .summary-rules-toggle { min-height: 36px; }
  .reward-stage-compact { min-height: 66px; padding: 6px 50px 5px 44px; }
}

/* Javobdan keyingi yechim ramkasi mobilda ixchamlashadi: aks holda yakuniy
   slayd 360 px da 11 px ga sig'may qolardi. */
@media (max-width: 639.98px) {
  .reflection-resolution .feedback { min-height: 58px !important; padding: 6px 10px 6px 7px !important; }
  .reflection-resolution .feedback-bit { width: 42px !important; height: 52px !important; }
  .reflection-resolution .feedback p { font-size: 9px !important; line-height: 1.28 !important; }
  .reflection-resolution .proof-label { font-size: 7px !important; }
  .reflection-resolution .feedback-proof { font-size: 9px !important; }
}

/* Yakuniy savoldagi izoh ramkasi mobilda ixcham: xato javobdan keyin ham slayd
   sig'adi. Kanonik 88 px o'lchami boshqa ekranlarda o'zgarmaydi. */
@media (max-width: 639.98px) {
  .lesson-root .reflection-card .feedback[data-g4-role~="feedback-frame"] {
    min-height: 56px !important;
    padding: 5px 9px 5px 6px !important;
    grid-template-columns: 40px minmax(0, 1fr) !important;
  }
  .lesson-root .reflection-card .feedback[data-g4-role~="feedback-frame"] .feedback-bit { width: 40px !important; height: 50px !important; }
  .lesson-root .reflection-card .feedback[data-g4-role~="feedback-frame"] p { font-size: 8.5px !important; line-height: 1.26 !important; }
  .lesson-root .reflection-card .feedback[data-g4-role~="feedback-frame"] .proof-label { font-size: 7px !important; }
  .lesson-root .reflection-card .feedback[data-g4-role~="feedback-frame"] .feedback-proof { font-size: 8.5px !important; }
}

/* 360 px da yakuniy slaydning yordamchi qatori yashiriladi: variantlar to'liq
   gap bo'lgani uchun "Ayirishda men..." kirish qatori ma'no yo'qotmaydi. */
@media (max-width: 400px) {
  .final-question-card .summary-question-stem { display: none; }
  .final-mission-heading p { font-size: 7.5px; line-height: 1.2; }
  .summary-question-kicker > b { font-size: 6.5px; }
}

/* --- Yakuniy savol ramkasi: etalon o'lchamlari (override qatlamidan ustun) --- */
.lesson-root .final-question-card .summary-question { font-size: clamp(17px, 2.4vw, 22px); line-height: 1.18; }
.lesson-root .reflection-card .reflection-option { font-size: 11px; font-weight: 700; }
.lesson-root .reflection-card .reflection-option > span { font-size: 9px; }
/* Javob berilmaganda izoh sloti joy egallamaydi: etalonda ham balandligi nol. */
.lesson-root .reflection-card > .feedback:not(.open) { min-height: 0 !important; height: 0; padding: 0 !important; overflow: hidden; }
@media (max-width: 639.98px) {
  .lesson-root .final-question-card .summary-question { font-size: 13px; line-height: 1.18; }
  .lesson-root .reflection-card .reflection-option { font-size: 8.5px; }
  .lesson-root .reflection-card .reflection-option > span { font-size: 7px; }
}

/* --- "Davom etish" tugmasi: yumshoq hover ------------------------------- */
.lesson-root .stage-nav .btn-white-accent:hover:not(:disabled) {
  color: ${T.accent};
  background: ${T.accentSoft};
  box-shadow: 0 12px 26px -18px rgba(255,91,53,.55), inset 0 0 0 1px rgba(255,91,53,.28);
  transform: translateY(-1px);
}
.lesson-root .stage-nav .btn-white-accent:active:not(:disabled) {
  background: ${T.accentSoft};
  transform: translateY(0);
}
`;
