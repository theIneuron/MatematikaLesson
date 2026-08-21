import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { canUseGrade4TheoryContinue } from './theoryNavigation.js';
import { WRONG_FLASH_CSS, useWrongFlash } from './wrongAnswerFlash.js';
import { FINALE_FIT_CSS, SPLIT_STEPS_FIT_CSS } from './grade4LayoutFixStyles.js';

// ============================================================================
// 4-SINF · Dars 31 · Kattaliklarga doir masalalar
//
// SYUJET. O'lchov xizmatining tungi ta'mirlash dispetcherligi. Oyna 23:40 dan
// 02:10 gacha ochiq: shu vaqt ichida kabel ulanadi, yuk ortiladi va smena
// yopiladi. Har uch vazifa bitta usulni talab qiladi.
//
// YADRO. Bit ikki g'altakni qo'shadi: 3 m 45 cm va 2 m 80 cm. U "5 m 125 cm"
// deb yozadi. Son to'g'ri, yozuv tugallanmagan: 125 cm ichida yana bir butun
// metr bor. To'g'ri javob 6 m 25 cm.
//
// USUL (uch qadam + tekshiruv): bitta birlikka keltir, amalni bajar, javobni
// o'qishga qulay birlikka qaytar, javob mantiqiymi deb tekshir.
//
// EKRAN RITMI (metodist talabi): qisqa tushuntirish, darrov misol, yana
// tushuntirish, yana misol. Uzun ketma-ket tushuntirish bloklari yo'q.
//
// XATO MODELLARI. Tugallanmagan yozuv (5 m 125 cm) · sonni aylantirib birlikni
// unutish · katta birlikdan noto'g'ri qarz olish · amalni "jami" kalit so'ziga
// qarab tanlash · javobning mantiqiyligini tekshirmaslik.
//
// Vizual kontrakt: ETALON_4SINF.md va Dars01 (xuk freymi, tipografika,
// obratnaya svyaz geometriyasi, yakun). Mavzuga xos chizmalar shu darsniki.
// ============================================================================

const T = {
  bg: '#F5F5F0', ink: '#12212C', ink2: '#50616D', ink3: '#87949D', paper: '#FFFFFF',
  accent: '#FF5B35', accentSoft: '#FFF0EA', cyan: '#168FA3', cyanSoft: '#E5F5F6',
  navy: '#173B52', lime: '#95C93D', success: '#227A53', successSoft: '#E7F3EC',
  warn: '#A96F13', warnSoft: '#FFF5D9', shadowBase: '58, 53, 48',
};

// Har ekrandagi ovoz segmentlari soni. useNarration shu son bo'yicha oxirgi
// kadrni aniqlaydi, shuning uchun CONTENT.audio.intro uzunligi bilan mos.
const FRAME_COUNTS = [4, 3, 2, 3, 2, 3, 2, 2, 3, 2, 3, 2, 3, 2, 2, 6];
const TOTAL_SCREENS = FRAME_COUNTS.length;

const SCREEN_META = [
  { id: 's0', type: 'hook', template: 'mission-console', goal: 'predict-total-length', mechanic: 'prediction-choice', active: true, assessed: false, scored: false, scope: 'hook', misconceptions: ['unfinished-record'] },
  { id: 's1', type: 'exploration', template: 'unit-split', goal: 'find-the-hidden-whole-unit', mechanic: 'tap-to-split', active: true, assessed: false, scored: false, scope: null, misconceptions: [] },
  { id: 's2', type: 'test', template: 'choice', goal: 'finish-the-record', mechanic: 'choice-retry', active: true, assessed: true, scored: true, scope: 'module-mikro', misconceptions: ['unfinished-record'] },
  { id: 's3', type: 'model', template: 'three-step-track', goal: 'run-the-three-step-method', mechanic: 'tap-steps', active: true, assessed: false, scored: false, scope: null, misconceptions: [] },
  { id: 's4', type: 'test', template: 'value-builder', goal: 'apply-method-to-mass', mechanic: 'tile-build', active: true, assessed: true, scored: true, scope: 'module-mikro', misconceptions: ['gram-overflow'] },
  { id: 's5', type: 'exploration', template: 'relation-bars', goal: 'choose-operation-from-relation', mechanic: 'tap-to-assign', active: true, assessed: false, scored: false, scope: null, misconceptions: ['keyword-operation'] },
  { id: 's6', type: 'test', template: 'choice', goal: 'select-operation-and-answer', mechanic: 'choice-retry', active: true, assessed: true, scored: true, scope: 'module-mikro', misconceptions: ['keyword-operation'] },
  { id: 's7', type: 'error', template: 'row-repair', goal: 'repair-the-broken-step', mechanic: 'tap-the-row', active: true, assessed: true, scored: true, scope: 'module-mikro', misconceptions: ['borrow-in-wrong-unit'] },
  { id: 's8', type: 'exploration', template: 'estimate-band', goal: 'estimate-before-calculating', mechanic: 'tap-the-band', active: true, assessed: false, scored: false, scope: null, misconceptions: [] },
  { id: 's9', type: 'test', template: 'choice', goal: 'reject-unreasonable-answer', mechanic: 'choice-retry', active: true, assessed: true, scored: true, scope: 'module-mikro', misconceptions: ['unreasonable-answer'] },
  { id: 's10', type: 'rule', template: 'rule-builder', goal: 'formulate-the-method', mechanic: 'order-parts', active: true, assessed: false, scored: false, scope: null, misconceptions: [] },
  { id: 's11', type: 'test', template: 'rapid-console', goal: 'convert-three-quantities', mechanic: 'tile-rounds', active: true, assessed: true, scored: true, scoreUnits: 3, scope: 'module-mikro', misconceptions: ['mixed-unit-slip'] },
  { id: 's12', type: 'strategy', template: 'route-compare', goal: 'compare-two-valid-routes', mechanic: 'route-choice', active: true, assessed: false, scored: false, scope: null, misconceptions: ['strategy-without-check'] },
  { id: 's13', type: 'case', template: 'choice', goal: 'fit-the-jobs-into-the-window', mechanic: 'choice-retry', active: true, assessed: true, scored: true, scope: 'final', misconceptions: ['unfinished-record'] },
  { id: 's14', type: 'case', template: 'choice', goal: 'transfer-to-inverse-task', mechanic: 'choice-retry', active: true, assessed: true, scored: true, scope: 'final', misconceptions: ['inverse-operation'] },
  { id: 's15', type: 'summary', subtype: 'title-claim', template: 'TitleClaim', goal: 'consolidate-and-bridge', mechanic: 'TitleClaim', active: true, assessed: false, scored: false, scope: null, misconceptions: [] },
];

const bi = (uz, ru, en) => ({ uz, ru, en });

const stableChoiceOffset = (lessonId, length) => {
  const key = `${lessonId}:${length}`;
  let hash = 2166136261;
  for (let index = 0; index < key.length; index += 1) {
    hash ^= key.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % length;
};

const buildOptionOrder = (length, correctIndex, lessonId, ordinal = 0) => {
  const order = Array.from({ length }, (_, index) => index);
  if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= length) return order;
  const target = (stableChoiceOffset(lessonId, length) + ordinal * (length - 1)) % length;
  order.splice(correctIndex, 1);
  order.splice(target, 0, correctIndex);
  return order;
};

// Variant tartibi ekranma-ekran suriladi: to'g'ri javob bir joyda qotib qolmaydi.
const ANSWER_ORDINAL_BY_SCREEN = Object.freeze({ 2: 0, 6: 1, 9: 2, 13: 3, 14: 4 });

const SOLUTION_LABEL = bi('YECHIM', 'РЕШЕНИЕ', 'SOLUTION');
const STEP_LABEL = bi('Keyingi qadam', 'Следующий шаг', 'Next step');
const CHECK_LABEL = bi('Tekshirish', 'Проверить', 'Check');

const LESSON_META = {
  lessonId: 'measure-4-31-v1',
  slug: 'dars31-kattaliklarga-doir-masalalar',
  lessonTitle: {
    uz: "Kattaliklarga doir masalalar",
    ru: 'Задачи с величинами',
    en: 'Problems with quantities',
  },
  skillTags: ['single-unit-conversion', 'regrouping-in-quantities', 'operation-choice', 'reasonableness-check'],
  finalReflectionRequired: true,
};

// ---------------------------------------------------------------------------
// KONTENT. Sonlar shu darsning o'zi uchun tanlangan: hammasi 4-sinf doirasida,
// aralash birlikli qo'shish va ayirish, qarz olish, birlikni qaytarish.
// Usul manbasi metodik jihatdan darslik bilan bir xil (bir xil o'lchov
// birligiga keltirish), lekin misollar ko'chirilmagan.
// ---------------------------------------------------------------------------
const CONTENT = {
  s0: {
    eyebrow: { uz: "Missiya", ru: "Миссия", en: "Mission" },
    topic: { uz: "Dars mavzusi: Kattaliklarga doir masalalar", ru: "Тема урока: Задачи с величинами", en: "Lesson topic: Problems with quantities" },
    title: { uz: "Tungi buyurtma", ru: "Ночной заказ", en: "The night order" },
    question: { uz: "Ikki bo'lakda jami qancha kabel bor?", ru: "Сколько всего кабеля в двух отрезках?", en: "How much cable is there in the two pieces together?" },
    neutral: true,
    coilA: { uz: "48 m 60 cm", ru: "48 м 60 см", en: "48 m 60 cm" },
    coilB: { uz: "25 m 70 cm", ru: "25 м 70 см", en: "25 m 70 cm" },
    botOrder: { uz: "73 m 130 cm", ru: "73 м 130 см", en: "73 m 130 cm" },
    nodeName: { uz: "TUNGI TA'MIRLASH · OYNA 23:40 – 02:10", ru: "НОЧНОЙ РЕМОНТ · ОКНО 23:40 – 02:10", en: "NIGHT REPAIR · WINDOW 23:40 – 02:10" },
    stateBad: { uz: "ZAVOD BUYURTMANI QAYTARDI", ru: "ЗАВОД ВЕРНУЛ ЗАКАЗ", en: "THE FACTORY RETURNED THE ORDER" },
    labelA: { uz: "birinchi bo'lak", ru: "первый отрезок", en: "first piece" },
    labelB: { uz: "ikkinchi bo'lak", ru: "второй отрезок", en: "second piece" },
    labelOrder: { uz: "Bit yuborgan buyurtma", ru: "заказ, отправленный Битом", en: "the order Bit sent" },
    options: [
      { uz: "74 m 30 cm", ru: "74 м 30 см", en: "74 m 30 cm" },
      { uz: "73 m 130 cm", ru: "73 м 130 см", en: "73 m 130 cm" },
      { uz: "73 m 30 cm", ru: "73 м 30 см", en: "73 m 30 cm" },
      { uz: "74 m 130 cm", ru: "74 м 130 см", en: "74 m 130 cm" },
    ],
    feedback: {
      uz: "Taxminingiz yozib olindi. Endi Bitning yozuvini birga tekshiramiz.",
      ru: "Твоё предположение записано. Теперь вместе проверим запись Бита.",
      en: "Your prediction is saved. Now we will check the record together.",
    },
    audio: {
      intro: {
        uz: [
          "Tungi ta'mirlash dispetcherligidamiz. Oyna ochiq, brigada kabel kutmoqda.",
          "Birinchi bo'lak qirq sakkiz metr oltmish santimetr, ikkinchisi yigirma besh metr yetmish santimetr.",
          "Bit metrni metrga, santimetrni santimetrga qo'shdi va zavodga buyurtma yubordi. Zavod buyurtmani qaytardi.",
          "Hisoblashdan oldin taxmin qiling, ikki bo'lakda jami qancha kabel bor.",
        ],
        ru: [
          "Мы в ночной диспетчерской ремонта. Окно открыто, бригада ждёт кабель.",
          "Первый отрезок сорок восемь метров шестьдесят сантиметров, второй двадцать пять метров семьдесят сантиметров.",
          "Бит сложил метры с метрами, сантиметры с сантиметрами и отправил заказ. Завод заказ вернул.",
          "Прежде чем считать, предположи, сколько кабеля в двух отрезках вместе.",
        ],
        en: [
          "We are in the night repair control room. The window is open and the crew is waiting for cable.",
          "The first piece is forty eight metres sixty centimetres, the second is twenty five metres seventy centimetres.",
          "Bit added metres to metres and centimetres to centimetres, then sent the order. The factory returned it.",
          "Before you calculate, predict how much cable the two pieces hold together.",
        ],
      },
    },
  },

  s1: {
    eyebrow: { uz: "Kashfiyot", ru: "Исследование", en: "Discovery" },
    title: { uz: "Yashiringan metr", ru: "Спрятанный метр", en: "The hidden metre" },
    lead: { uz: "Santimetr ustunidagi sonni bosing", ru: "Нажми на число в столбце сантиметров", en: "Tap the number in the centimetre column" },
    startM: "73",
    startC: "130",
    finalM: "74",
    finalC: "30",
    steps: [
      { uz: "Bit ikki ustunni alohida qo'shdi", ru: "Бит сложил два столбца по отдельности", en: "Bit added the two columns separately" },
      { uz: "130 cm ichida bir butun metr bor", ru: "В 130 см есть один целый метр", en: "130 cm contains one whole metre" },
      { uz: "Metr o'z ustuniga o'tadi: 74 m 30 cm", ru: "Метр переходит в свой столбец: 74 м 30 см", en: "The metre moves to its own column: 74 m 30 cm" },
    ],
    tapHint: { uz: "130 cm ni bosing", ru: "Нажми 130 см", en: "Tap 130 cm" },
    doneLabel: { uz: "Yozuv tugallandi", ru: "Запись завершена", en: "The record is finished" },
    audio: {
      intro: {
        uz: [
          "Bitning xatosi qayerda ekanini ko'ramiz. U metrni metrga, santimetrni santimetrga qo'shdi.",
          "Santimetr ustunida bir yuz o'ttiz chiqdi. Bir yuz santimetr bu bir butun metr, demak u yerda metr yashiringan.",
          "Yashiringan metrni o'z ustuniga o'tkazamiz. O'ttiz santimetr qoladi, javob esa yetmish to'rt metr o'ttiz santimetr.",
        ],
        ru: [
          "Посмотрим, где ошибка Бита. Он сложил метры с метрами, а сантиметры с сантиметрами.",
          "В столбце сантиметров вышло сто тридцать. Сто сантиметров это один целый метр, значит там спрятан метр.",
          "Переносим спрятанный метр в его столбец. Остаётся тридцать сантиметров, а ответ семьдесят четыре метра тридцать сантиметров.",
        ],
        en: [
          "Let us see where Bit went wrong. He added metres to metres and centimetres to centimetres.",
          "The centimetre column gave one hundred thirty. One hundred centimetres is one whole metre, so a metre is hidden there.",
          "We move the hidden metre into its own column. Thirty centimetres are left and the answer is seventy four metres thirty centimetres.",
        ],
      },
    },
  },

  s2: {
    eyebrow: { uz: "Mashq", ru: "Задание", en: "Task" },
    title: { uz: "Ikkinchi buyurtma", ru: "Второй заказ", en: "The second order" },
    task: { uz: "152 m 55 cm + 36 m 65 cm", ru: "152 м 55 см + 36 м 65 см", en: "152 m 55 cm + 36 m 65 cm" },
    taskNote: { uz: "Ikkinchi uchastka", ru: "Второй участок", en: "Second section" },
    question: { uz: "Qaysi yozuv tugallangan javob?", ru: "Какая запись является завершённым ответом?", en: "Which record is the finished answer?" },
    correctIndex: 0,
    options: [
      { uz: "189 m 20 cm", ru: "189 м 20 см", en: "189 m 20 cm" },
      { uz: "188 m 120 cm", ru: "188 м 120 см", en: "188 m 120 cm" },
      { uz: "189 m 120 cm", ru: "189 м 120 см", en: "189 m 120 cm" },
      { uz: "188 m 20 cm", ru: "188 м 20 см", en: "188 m 20 cm" },
    ],
    feedback: [
      { uz: "To'g'ri. 55 va 65 dan 120 cm chiqdi, undagi butun metr metrlar ustuniga o'tdi.", ru: "Верно. Из 55 и 65 вышло 120 см, целый метр перешёл в столбец метров.", en: "Right. 55 and 65 gave 120 cm, and the whole metre moved into the metre column." },
      { uz: "Santimetr to'g'ri qo'shildi, lekin 120 cm ichidagi butun metr o'z joyiga ko'chmagan.", ru: "Сантиметры сложены верно, но целый метр внутри 120 см не перенесён на своё место.", en: "The centimetres are added correctly, but the whole metre inside 120 cm has not moved to its place." },
      { uz: "Metr ustuniga bir metr qo'shilgan, ammo santimetrdan o'sha metr olib tashlanmagan.", ru: "К метрам метр прибавлен, но из сантиметров он не убран.", en: "One metre was added to the metres, but it was not taken away from the centimetres." },
      { uz: "Santimetr to'g'ri, metr esa kam. Butun metrni qo'shishni unutmang.", ru: "Сантиметры верные, а метров мало. Не забудь прибавить целый метр.", en: "The centimetres are right, but there are too few metres. Do not forget the whole metre." },
    ],
    proof: { uz: "15 255 + 3 665 = 18 920 → 189 m 20 cm", ru: "15 255 + 3 665 = 18 920 → 189 м 20 см", en: "15 255 + 3 665 = 18 920 → 189 m 20 cm" },
    audio: {
      intro: {
        uz: [
          "Zavodga ikkinchi buyurtma ketmoqda. Ikki uchastkani qo'shing.",
          "Santimetrlarni qo'shganda yuzdan katta son chiqadi. Tugallangan yozuvni tanlang.",
        ],
        ru: [
          "На завод уходит второй заказ. Сложи два участка.",
          "При сложении сантиметров получается число больше ста. Выбери завершённую запись.",
        ],
        en: [
          "A second order is going to the factory. Add the two sections.",
          "Adding the centimetres gives a number larger than one hundred. Choose the finished record.",
        ],
      },
      on_correct: {
        uz: "To'g'ri. Yuz santimetr metrga aylanib, o'z ustuniga ko'chdi.",
        ru: "Верно. Сто сантиметров стали метром и перешли в свой столбец.",
        en: "Right. One hundred centimetres became a metre and moved into its own column.",
      },
      on_wrong: [
        { uz: "To'g'ri javob.", ru: "Верный ответ.", en: "The correct answer." },
        { uz: "Santimetr ustunida yuzdan katta son qoldi. Undan butun metrni ajrating.", ru: "В столбце сантиметров осталось число больше ста. Выдели из него целый метр.", en: "The centimetre column still holds more than one hundred. Take the whole metre out of it." },
        { uz: "Bir metr ikki marta hisoblandi. U santimetrdan olinishi kerak edi.", ru: "Один метр посчитан дважды. Его нужно было взять из сантиметров.", en: "One metre was counted twice. It had to be taken from the centimetres." },
        { uz: "Metr yetishmayapti. Santimetrdagi butun metrni qo'shing.", ru: "Не хватает метра. Прибавь целый метр из сантиметров.", en: "One metre is missing. Add the whole metre from the centimetres." },
      ],
    },
  },

  s3: {
    eyebrow: { uz: "Model", ru: "Модель", en: "Model" },
    title: { uz: "Uch qadamli yo'l", ru: "Путь в три шага", en: "The three-step way" },
    lead: { uz: "Har qadamni bosib oching", ru: "Открывай каждый шаг нажатием", en: "Tap to open each step" },
    leftLabel: { uz: "Aralash yozuv", ru: "Смешанная запись", en: "Mixed record" },
    rightLabel: { uz: "Bitta birlik", ru: "Одна единица", en: "One unit" },
    rows: [
      {
        step: { uz: "1-qadam. Bir xil birlikka keltiramiz", ru: "Шаг 1. Приводим к одной единице", en: "Step 1. Bring to one unit" },
        left: { uz: "48 m 60 cm\n25 m 70 cm", ru: "48 м 60 см\n25 м 70 см", en: "48 m 60 cm\n25 m 70 cm" },
        right: { uz: "4 860 cm\n2 570 cm", ru: "4 860 см\n2 570 см", en: "4 860 cm\n2 570 cm" },
      },
      {
        step: { uz: "2-qadam. Sonlar kabi qo'shamiz", ru: "Шаг 2. Складываем как числа", en: "Step 2. Add them like numbers" },
        left: { uz: "ustun shaklida", ru: "столбиком", en: "in a column" },
        right: { uz: "4 860 + 2 570 = 7 430", ru: "4 860 + 2 570 = 7 430", en: "4 860 + 2 570 = 7 430" },
      },
      {
        step: { uz: "3-qadam. O'qishga qulay birlikka qaytaramiz", ru: "Шаг 3. Возвращаем к удобной единице", en: "Step 3. Return to the convenient unit" },
        left: { uz: "74 m 30 cm", ru: "74 м 30 см", en: "74 m 30 cm" },
        right: { uz: "7 430 cm", ru: "7 430 см", en: "7 430 cm" },
      },
    ],
    ruleNote: { uz: "Kattaliklarning qiymati bir xil o'lchov birligida ifodalanadi", ru: "Значения величин выражают в одной и той же единице измерения", en: "The values of quantities are expressed in one and the same unit" },
    audio: {
      intro: {
        uz: [
          "Endi boshqa yo'lni ko'ramiz. Avval ikkala kattalikni bitta birlikka keltiramiz.",
          "Endi ular oddiy sonlar. Ularni ustun shaklida qo'shamiz va yetti ming to'rt yuz o'ttiz chiqadi.",
          "Oxirgi qadam. Santimetrni metr va santimetrga qaytaramiz, javob yetmish to'rt metr o'ttiz santimetr.",
        ],
        ru: [
          "Теперь посмотрим другой путь. Сначала приводим обе величины к одной единице.",
          "Теперь это обычные числа. Складываем их столбиком и получаем семь тысяч четыреста тридцать.",
          "Последний шаг. Возвращаем сантиметры к метрам и сантиметрам, ответ семьдесят четыре метра тридцать сантиметров.",
        ],
        en: [
          "Now we look at another way. First we bring both quantities to one unit.",
          "Now they are ordinary numbers. We add them in a column and get seven thousand four hundred thirty.",
          "The last step. We turn the centimetres back into metres and centimetres, and the answer is seventy four metres thirty centimetres.",
        ],
      },
    },
  },

  s4: {
    eyebrow: { uz: "Mashq", ru: "Задание", en: "Task" },
    title: { uz: "Yuk tarozida", ru: "Груз на весах", en: "The load on the scales" },
    task: { uz: "8 t 2 q − 3 t 6 q", ru: "8 т 2 ц − 3 т 6 ц", en: "8 t 2 q − 3 t 6 q" },
    taskNote: { uz: "Yuk hisoboti", ru: "Отчёт по грузу", en: "Load report" },
    question: { uz: "Javobni yig'ing", ru: "Собери ответ", en: "Build the answer" },
    slots: [
      { key: "t", label: { uz: "tonna", ru: "тонны", en: "tonnes" }, answer: 4, tiles: [5, 4, 6] },
      { key: "q", label: { uz: "sentner", ru: "центнеры", en: "centners" }, answer: 6, tiles: [4, 6, 16] },
    ],
    unitT: { uz: "t", ru: "т", en: "t" },
    unitQ: { uz: "q", ru: "ц", en: "q" },
    okText: { uz: "To'g'ri. 82 q dan 36 q ni ayirdik va 46 q qoldi, ya'ni 4 t 6 q.", ru: "Верно. Из 82 ц вычли 36 ц, осталось 46 ц, то есть 4 т 6 ц.", en: "Right. We took 36 q from 82 q and 46 q were left, that is 4 t 6 q." },
    wrongT: { uz: "Tonnalar soni boshqacha. 2 q dan 6 q ni ayirib bo'lmaydi, tonnadan qarz olinadi.", ru: "Число тонн другое. Из 2 ц нельзя вычесть 6 ц, заём берётся у тонны.", en: "The number of tonnes is different. You cannot take 6 q from 2 q, so you borrow from a tonne." },
    wrongQ: { uz: "Sentnerlar soni boshqacha. Bitta tonna o'nta sentner beradi.", ru: "Число центнеров другое. Одна тонна даёт десять центнеров.", en: "The number of centners is different. One tonne gives ten centners." },
    proof: { uz: "82 q − 36 q = 46 q → 4 t 6 q", ru: "82 ц − 36 ц = 46 ц → 4 т 6 ц", en: "82 q − 36 q = 46 q → 4 t 6 q" },
    audio: {
      intro: {
        uz: [
          "Yuk mashinasini yengillashtirish kerak. Bir qism yuk tushiriladi.",
          "Bir tonnada o'nta sentner bor. Ikkala massani sentnerga keltiring, ayiring va javobni yig'ing.",
        ],
        ru: [
          "Машину нужно облегчить. Часть груза снимают.",
          "В одной тонне десять центнеров. Приведи обе массы к центнерам, вычти и собери ответ.",
        ],
        en: [
          "The truck has to be made lighter. Part of the load is taken off.",
          "One tonne holds ten centners. Bring both masses to centners, subtract and build the answer.",
        ],
      },
      on_correct: { uz: "To'g'ri. Bitta tonna sentnerga almashtirildi va qarz olindi.", ru: "Верно. Одна тонна обменяна на центнеры, заём взят.", en: "Right. One tonne was exchanged for centners and the borrow was taken." },
      on_wrong: { uz: "Ikkala massani sentnerga keltiring, keyin ayiring.", ru: "Приведи обе массы к центнерам, а потом вычитай.", en: "Bring both masses to centners first, then subtract." },
    },
  },

  s5: {
    eyebrow: { uz: "Kashfiyot", ru: "Исследование", en: "Discovery" },
    title: { uz: "Amalni nima tanlaydi", ru: "Что выбирает действие", en: "What chooses the operation" },
    lead: { uz: "Har qatorga o'z amalini bosing", ru: "Назначь каждой строке своё действие", en: "Give each row its own operation" },
    source: { uz: "Ombor tarozisi", ru: "Весы склада", en: "Store scales" },
    baseLabel: { uz: "Birinchi quti", ru: "Первый ящик", en: "First crate" },
    baseValue: { uz: "6 kg 400 g", ru: "6 кг 400 г", en: "6 kg 400 g" },
    bars: [
      {
        who: { uz: "Ikkinchi quti", ru: "Второй ящик", en: "Second crate" },
        phrase: { uz: "birinchisidan 2 kg 750 g yengil", ru: "на 2 кг 750 г легче первого", en: "2 kg 750 g lighter than the first" },
        sign: "minus", pct: 32,
        result: { uz: "3 kg 650 g", ru: "3 кг 650 г", en: "3 kg 650 g" },
      },
      {
        who: { uz: "Uchinchi quti", ru: "Третий ящик", en: "Third crate" },
        phrase: { uz: "birinchi va ikkinchisi birgalikdagidan 1 kg 500 g og'ir", ru: "на 1 кг 500 г тяжелее первого и второго вместе", en: "1 kg 500 g heavier than the first and second together" },
        sign: "plus", pct: 100,
        result: { uz: "11 kg 550 g", ru: "11 кг 550 г", en: "11 kg 550 g" },
      },
    ],
    signMinus: { uz: "ayirish", ru: "вычитание", en: "subtraction" },
    signPlus: { uz: "qo'shish", ru: "сложение", en: "addition" },
    keywordTrap: { uz: "«birgalikda» so'zi bor, lekin amalni bog'lanish tanlaydi", ru: "слово «вместе» есть, но действие выбирает связь величин", en: "the word together appears, but the relation chooses the operation" },
    audio: {
      intro: {
        uz: [
          "Uchta quti tarozida. Amalni kalit so'z emas, kattaliklar orasidagi bog'lanish tanlaydi.",
          "Ikkinchi quti birinchisidan yengil. Yengil degani kamroq, demak bu yerda ayirish.",
          "Uchinchi quti esa ikkovining birgalikdagi massasidan og'ir. Og'ir degani ko'proq, demak avval qo'shamiz, keyin yana qo'shamiz.",
        ],
        ru: [
          "Три ящика на весах. Действие выбирает не ключевое слово, а связь между величинами.",
          "Второй ящик легче первого. Легче значит меньше, поэтому здесь вычитание.",
          "А третий ящик тяжелее их общей массы. Тяжелее значит больше, поэтому сначала складываем, потом прибавляем ещё раз.",
        ],
        en: [
          "Three crates are on the scales. The operation is chosen by the relation between the quantities, not by a key word.",
          "The second crate is lighter than the first. Lighter means less, so here we subtract.",
          "The third crate is heavier than the two of them together. Heavier means more, so first we add, then we add once again.",
        ],
      },
    },
  },

  s6: {
    eyebrow: { uz: "Mashq", ru: "Задание", en: "Task" },
    title: { uz: "Uchinchi quti", ru: "Третий ящик", en: "The third crate" },
    task: { uz: "6 kg 400 g + 3 kg 650 g = 10 kg 50 g", ru: "6 кг 400 г + 3 кг 650 г = 10 кг 50 г", en: "6 kg 400 g + 3 kg 650 g = 10 kg 50 g" },
    taskNote: { uz: "Birinchi va ikkinchi quti birgalikda", ru: "Первый и второй ящик вместе", en: "The first and the second crate together" },
    question: {
      uz: "Uchinchi quti ikkovining birgalikdagi massasidan 1 kg 500 g og'ir. Uning massasi qancha?",
      ru: "Третий ящик на 1 кг 500 г тяжелее их общей массы. Какова его масса?",
      en: "The third crate is 1 kg 500 g heavier than their combined mass. What is its mass?",
    },
    sumLabel: { uz: "Birgalikda", ru: "Вместе", en: "Together" },
    thirdLabel: { uz: "Uchinchi quti", ru: "Третий ящик", en: "Third crate" },
    thirdPhrase: { uz: "1 kg 500 g og'ir", ru: "на 1 кг 500 г тяжелее", en: "1 kg 500 g heavier" },
    correctIndex: 0,
    options: [
      { uz: "11 kg 550 g", ru: "11 кг 550 г", en: "11 kg 550 g" },
      { uz: "10 kg 50 g", ru: "10 кг 50 г", en: "10 kg 50 g" },
      { uz: "8 kg 550 g", ru: "8 кг 550 г", en: "8 kg 550 g" },
      { uz: "11 kg 50 g", ru: "11 кг 50 г", en: "11 kg 50 g" },
    ],
    feedback: [
      { uz: "To'g'ri. 10 050 g ga 1 500 g qo'shildi va 11 550 g chiqdi.", ru: "Верно. К 10 050 г прибавили 1 500 г и вышло 11 550 г.", en: "Right. We added 1 500 g to 10 050 g and got 11 550 g." },
      { uz: "Bu oraliq javob, ya'ni birinchi va ikkinchi quti. Uchinchisi ulardan og'irroq.", ru: "Это промежуточный ответ, первый и второй ящик. Третий тяжелее их.", en: "That is the middle answer, the first and second crate. The third is heavier than they are." },
      { uz: "Bu yerda ayirilgan. Uchinchi quti og'irroq, demak qo'shish kerak.", ru: "Здесь вычли. Третий ящик тяжелее, значит нужно сложить.", en: "This one subtracted. The third crate is heavier, so you have to add." },
      { uz: "Kilogramm to'g'ri, gramm yetishmayapti. 50 va 500 ni qo'shing.", ru: "Килограммы верные, граммов не хватает. Сложи 50 и 500.", en: "The kilograms are right but the grams are short. Add 50 and 500." },
    ],
    proof: { uz: "10 050 g + 1 500 g = 11 550 g → 11 kg 550 g", ru: "10 050 г + 1 500 г = 11 550 г → 11 кг 550 г", en: "10 050 g + 1 500 g = 11 550 g → 11 kg 550 g" },
    audio: {
      intro: {
        uz: [
          "Birinchi va ikkinchi quti birgalikda o'n kilogramm ellik gramm.",
          "Uchinchisi shundan bir kilogramm besh yuz gramm og'ir. Uning massasini toping.",
        ],
        ru: [
          "Первый и второй ящик вместе весят десять килограммов пятьдесят граммов.",
          "Третий тяжелее их на один килограмм пятьсот граммов. Найди его массу.",
        ],
        en: [
          "The first and the second crate together weigh ten kilograms fifty grams.",
          "The third one is one kilogram five hundred grams heavier. Find its mass.",
        ],
      },
      on_correct: { uz: "To'g'ri. Oraliq javobda to'xtamadingiz va savolga javob berdingiz.", ru: "Верно. Ответ дан на сам вопрос, а не на промежуточный результат.", en: "Right. You did not stop at the middle answer and answered the question itself." },
      on_wrong: [
        { uz: "To'g'ri javob.", ru: "Верный ответ.", en: "The correct answer." },
        { uz: "Bu oraliq natija. Masala uchinchi quti haqida so'raydi.", ru: "Это промежуточный результат. Вопрос про третий ящик.", en: "That is the middle result. The question is about the third crate." },
        { uz: "Og'irroq degani ko'proq. Amalni almashtirib yubordingiz.", ru: "Тяжелее значит больше. Здесь действие поменялось местами.", en: "Heavier means more. The operation was swapped here." },
        { uz: "Grammlarni sanang. Ellik va besh yuz birga besh yuz ellik beradi.", ru: "Посчитай граммы. Пятьдесят и пятьсот вместе дают пятьсот пятьдесят.", en: "Count the grams. Fifty and five hundred together give five hundred fifty." },
      ],
    },
  },

  s7: {
    eyebrow: { uz: "Xatoni topish", ru: "Разбор ошибки", en: "Spot the error" },
    title: { uz: "Bitning hisobi", ru: "Расчёт Бита", en: "Bit's calculation" },
    lead: { uz: "Xato boshlangan qatorni bosing", ru: "Нажми на строку, где началась ошибка", en: "Tap the row where the error starts" },
    source: { uz: "Yuk qoldig'i", ru: "Остаток груза", en: "Remaining load" },
    answerIndex: 1,
    rows: [
      { uz: "15 t 300 kg − 6 t 700 kg", ru: "15 т 300 кг − 6 т 700 кг", en: "15 t 300 kg − 6 t 700 kg" },
      { uz: "300 − 700 bo'lmaydi, shuning uchun 700 − 300 = 400", ru: "300 − 700 не выходит, поэтому 700 − 300 = 400", en: "300 − 700 does not work, so 700 − 300 = 400" },
      { uz: "15 − 6 = 9", ru: "15 − 6 = 9", en: "15 − 6 = 9" },
      { uz: "Javob: 9 t 400 kg", ru: "Ответ: 9 т 400 кг", en: "Answer: 9 t 400 kg" },
    ],
    rowFeedback: [
      { uz: "Bu qator to'g'ri. Masala shu yozuvdan boshlanadi.", ru: "Эта строка верная. С этой записи задача и начинается.", en: "This row is correct. The task starts from this record." },
      { uz: "Aynan shu yerda. Kichikdan kattani ayirib bo'lmaganda o'rin almashtirilmaydi, tonnadan bir tonna qarz olinadi.", ru: "Именно здесь. Когда из меньшего не вычесть большее, местами не меняют, а берут заём у тонны.", en: "Exactly here. When the smaller cannot take the bigger, you do not swap them, you borrow one tonne." },
      { uz: "Bu qator hozircha to'g'ri ko'rinadi. Xato undan oldin boshlangan va shu sababli tonna soni ham o'zgaradi.", ru: "Эта строка пока выглядит верной. Ошибка началась раньше, из-за неё изменится и число тонн.", en: "This row still looks correct. The error started earlier and because of it the number of tonnes changes too." },
      { uz: "Bu javob, ya'ni xatoning natijasi. Xato yuqoriroqda boshlangan.", ru: "Это ответ, то есть последствие ошибки. Ошибка началась выше.", en: "This is the answer, the consequence of the error. The error started higher up." },
    ],
    fixLabel: { uz: "To'g'ri yo'l", ru: "Верный путь", en: "The correct way" },
    fix: { uz: "15 300 kg − 6 700 kg = 8 600 kg → 8 t 600 kg", ru: "15 300 кг − 6 700 кг = 8 600 кг → 8 т 600 кг", en: "15 300 kg − 6 700 kg = 8 600 kg → 8 t 600 kg" },
    audio: {
      intro: {
        uz: [
          "Bit qolgan yukni hisobladi. Yozuvlari chiroyli, javobi esa xato.",
          "Qaysi qatorda xato boshlanganini toping va bosing.",
        ],
        ru: [
          "Бит посчитал оставшийся груз. Записи аккуратные, а ответ неверный.",
          "Найди строку, где началась ошибка, и нажми на неё.",
        ],
        en: [
          "Bit calculated the remaining load. The records look neat but the answer is wrong.",
          "Find the row where the error starts and tap it.",
        ],
      },
      on_correct: { uz: "To'g'ri. Kichik sondan katta sonni ayirish uchun katta birlikdan qarz olinadi.", ru: "Верно. Чтобы вычесть большее из меньшего, берут заём у старшей единицы.", en: "Right. To take a bigger number from a smaller one, you borrow from the larger unit." },
      on_wrong: { uz: "Har bir qatorni ketma-ket o'qing. Birinchi buzilgan qadamni qidiring.", ru: "Читай строки по порядку. Ищи первый сломанный шаг.", en: "Read the rows in order. Look for the first broken step." },
    },
  },

  s8: {
    eyebrow: { uz: "Kashfiyot", ru: "Исследование", en: "Discovery" },
    title: { uz: "Avval taxmin, keyin hisob", ru: "Сначала оценка, потом расчёт", en: "Estimate first, then calculate" },
    lead: { uz: "Javob qaysi oraliqda bo'lishini tanlang", ru: "Выбери, в каком промежутке будет ответ", en: "Choose the range the answer falls into" },
    task: { uz: "3 m 40 cm + 2 m 85 cm + 1 m 95 cm", ru: "3 м 40 см + 2 м 85 см + 1 м 95 см", en: "3 m 40 cm + 2 m 85 cm + 1 m 95 cm" },
    bands: [
      { uz: "5 – 6 m", ru: "5 – 6 м", en: "5 – 6 m" },
      { uz: "8 – 9 m", ru: "8 – 9 м", en: "8 – 9 m" },
      { uz: "12 – 13 m", ru: "12 – 13 м", en: "12 – 13 m" },
    ],
    answerIndex: 1,
    bandFeedback: [
      { uz: "Kam. Faqat butun metrlar oltita, santimetrlar esa yana qo'shiladi.", ru: "Мало. Одних целых метров шесть, а сантиметры ещё прибавятся.", en: "Too little. The whole metres alone are six and the centimetres still add up." },
      { uz: "Ha. Butun metrlar oltita, santimetrlar esa yana ikki metrga yaqin.", ru: "Да. Целых метров шесть, а сантиметры дают ещё почти два метра.", en: "Yes. There are six whole metres and the centimetres add almost two more." },
      { uz: "Ko'p. Uchala bo'lak ham to'rt metrdan qisqa.", ru: "Много. Все три отрезка короче четырёх метров.", en: "Too much. All three pieces are shorter than four metres." },
    ],
    exact: { uz: "820 cm = 8 m 20 cm", ru: "820 см = 8 м 20 см", en: "820 cm = 8 m 20 cm" },
    exactLabel: { uz: "Aniq javob taxmin ichiga tushdi", ru: "Точный ответ попал в оценку", en: "The exact answer landed inside the estimate" },
    audio: {
      intro: {
        uz: [
          "Uzun hisobdan oldin javobni baholaymiz. Bu keyin xatoni darrov ko'rsatadi.",
          "Butun metrlar uch, ikki va bir. Santimetrlar esa yana ikki metrga yaqin. Oraliqni tanlang.",
          "Aniq hisob sakkiz yuz yigirma santimetr berdi, ya'ni sakkiz metr yigirma santimetr. Taxmin to'g'ri chiqdi.",
        ],
        ru: [
          "Перед длинным расчётом оцениваем ответ. Потом это сразу покажет ошибку.",
          "Целых метров три, два и один. А сантиметры дают ещё почти два метра. Выбери промежуток.",
          "Точный расчёт дал восемьсот двадцать сантиметров, то есть восемь метров двадцать сантиметров. Оценка подтвердилась.",
        ],
        en: [
          "Before a long calculation we estimate the answer. Later that shows a mistake at once.",
          "The whole metres are three, two and one. The centimetres add almost two more metres. Choose the range.",
          "The exact calculation gave eight hundred twenty centimetres, that is eight metres twenty centimetres. The estimate held.",
        ],
      },
    },
  },

  s9: {
    eyebrow: { uz: "Mashq", ru: "Задание", en: "Task" },
    title: { uz: "Uch bo'lak birga", ru: "Три отрезка вместе", en: "Three pieces together" },
    task: { uz: "3 m 40 cm + 2 m 85 cm + 1 m 95 cm", ru: "3 м 40 см + 2 м 85 см + 1 м 95 см", en: "3 m 40 cm + 2 m 85 cm + 1 m 95 cm" },
    question: { uz: "Uch bo'lakning umumiy uzunligi qancha?", ru: "Какова общая длина трёх отрезков?", en: "What is the total length of the three pieces?" },
    correctIndex: 0,
    options: [
      { uz: "8 m 20 cm", ru: "8 м 20 см", en: "8 m 20 cm" },
      { uz: "6 m 220 cm", ru: "6 м 220 см", en: "6 m 220 cm" },
      { uz: "7 m 20 cm", ru: "7 м 20 см", en: "7 m 20 cm" },
      { uz: "8 m 220 cm", ru: "8 м 220 см", en: "8 m 220 cm" },
    ],
    feedback: [
      { uz: "To'g'ri. 820 cm ichida sakkizta butun metr va yana 20 cm bor.", ru: "Верно. В 820 см помещаются восемь целых метров и ещё 20 см.", en: "Right. 820 cm holds eight whole metres and 20 cm more." },
      { uz: "Uzunlik to'g'ri, yozuv tugallanmagan. 220 cm ichida yana ikki metr bor.", ru: "Длина верная, а запись не завершена. В 220 см есть ещё два метра.", en: "The length is right but the record is unfinished. 220 cm holds two more metres." },
      { uz: "Bir metr yo'qolgan. Taxmin sakkizga yaqin edi.", ru: "Потерялся один метр. Оценка была ближе к восьми.", en: "One metre went missing. The estimate was closer to eight." },
      { uz: "Metrlar to'g'ri, ammo santimetrdagi ikki metr ikki marta hisoblangan.", ru: "Метры верные, но два метра из сантиметров посчитаны дважды.", en: "The metres are right, but two metres from the centimetres are counted twice." },
    ],
    proof: { uz: "340 + 285 + 195 = 820 → 8 m 20 cm", ru: "340 + 285 + 195 = 820 → 8 м 20 см", en: "340 + 285 + 195 = 820 → 8 m 20 cm" },
    audio: {
      intro: {
        uz: [
          "Taxmin tayyor. Endi aniq javobni toping.",
          "Uchala bo'lakni santimetrga keltiring va qo'shing. Javobni taxmin bilan solishtiring.",
        ],
        ru: [
          "Оценка есть. Теперь найди точный ответ.",
          "Приведи все три отрезка к сантиметрам и сложи. Сравни ответ с оценкой.",
        ],
        en: [
          "The estimate is ready. Now find the exact answer.",
          "Bring all three pieces to centimetres and add them. Compare the answer with the estimate.",
        ],
      },
      on_correct: { uz: "To'g'ri. Javob taxmin ichiga tushdi, demak hisob ishonchli.", ru: "Верно. Ответ попал в оценку, значит расчёт надёжный.", en: "Right. The answer landed inside the estimate, so the calculation is trustworthy." },
      on_wrong: [
        { uz: "To'g'ri javob.", ru: "Верный ответ.", en: "The correct answer." },
        { uz: "Santimetr yuzdan katta qolmasin. Undagi butun metrlarni ajrating.", ru: "Сантиметры не должны оставаться больше ста. Выдели из них целые метры.", en: "The centimetres must not stay above one hundred. Take the whole metres out of them." },
        { uz: "Javobni taxmin bilan solishtiring. Yetti metr oraliqdan tashqarida.", ru: "Сравни ответ с оценкой. Семь метров вне промежутка.", en: "Compare the answer with the estimate. Seven metres is outside the range." },
        { uz: "Bir xil metr ikki joyda turibdi. Faqat bitta joyda qolsin.", ru: "Одни и те же метры стоят в двух местах. Оставь их только в одном.", en: "The same metres appear in two places. Leave them in one place only." },
      ],
    },
  },

  s10: {
    eyebrow: { uz: "Qoida", ru: "Правило", en: "Rule" },
    title: { uz: "Dispetcher qoidasi", ru: "Правило диспетчера", en: "The dispatcher's rule" },
    lead: { uz: "Qadamlarni tartib bilan bosing", ru: "Нажимай шаги по порядку", en: "Tap the steps in order" },
    parts: [
      { uz: "Bir xil o'lchov birligiga keltiramiz", ru: "Приводим к одной единице измерения", en: "Bring to one unit of measurement" },
      { uz: "Amalni sonlar bilan bajarilgani kabi bajaramiz", ru: "Выполняем действие как с числами", en: "Carry out the operation as with numbers" },
      { uz: "Natijani o'qishga qulay birlikka qaytaramiz", ru: "Возвращаем результат к удобной единице", en: "Return the result to the convenient unit" },
      { uz: "Javob taxminga to'g'ri kelishini tekshiramiz", ru: "Проверяем, сходится ли ответ с оценкой", en: "Check that the answer matches the estimate" },
    ],
    slotLabel: { uz: "Qoida", ru: "Правило", en: "Rule" },
    bankLabel: { uz: "Qadamlar", ru: "Шаги", en: "Steps" },
    resetLabel: { uz: "Qayta tuzish", ru: "Собрать заново", en: "Start again" },
    memo: { uz: "Bir birlik → amal → qaytarish → tekshirish", ru: "Одна единица → действие → возврат → проверка", en: "One unit → operation → return → check" },
    okText: { uz: "Qoida yig'ildi", ru: "Правило собрано", en: "The rule is assembled" },
    wrongText: { uz: "Tartib buzildi. Avval birlik, keyin amal, keyin qaytarish.", ru: "Порядок нарушен. Сначала единица, потом действие, потом возврат.", en: "The order is broken. First the unit, then the operation, then the return." },
    audio: {
      intro: {
        uz: [
          "Bugungi usulni bitta qoidaga yig'amiz.",
          "To'rtta qadam bor va ularning tartibi muhim. Qadamlarni ketma-ket bosing.",
          "Shu qoida uzunlikka ham, massaga ham, vaqtga ham bir xil ishlaydi.",
        ],
        ru: [
          "Соберём сегодняшний способ в одно правило.",
          "Шагов четыре и их порядок важен. Нажимай шаги по очереди.",
          "Это правило одинаково работает и для длины, и для массы, и для времени.",
        ],
        en: [
          "Let us gather today's method into one rule.",
          "There are four steps and their order matters. Tap the steps one after another.",
          "The rule works the same way for length, for mass and for time.",
        ],
      },
    },
  },

  s11: {
    eyebrow: { uz: "Tekshiruv", ru: "Проверка", en: "Check" },
    title: { uz: "Uchta tez savol", ru: "Три быстрых вопроса", en: "Three quick questions" },
    source: { uz: "Dispetcher jurnali", ru: "Журнал диспетчера", en: "Dispatcher log" },
    rounds: [
      {
        prompt: { uz: "85 min ni soat va minutda ifodalang", ru: "Вырази 85 мин в часах и минутах", en: "Express 85 min in hours and minutes" },
        tiles: [
          { uz: "1 h 25 min", ru: "1 ч 25 мин", en: "1 h 25 min" },
          { uz: "8 h 5 min", ru: "8 ч 5 мин", en: "8 h 5 min" },
          { uz: "1 h 35 min", ru: "1 ч 35 мин", en: "1 h 35 min" },
        ],
        answer: 0,
        ok: { uz: "60 min bitta soat, qolgani 25 min.", ru: "60 мин это один час, остаётся 25 мин.", en: "60 min is one hour and 25 min are left." },
        no: { uz: "Bir soatda 60 daqiqa. Ortiqchasini sanang.", ru: "В одном часе 60 минут. Посчитай остаток.", en: "One hour holds 60 minutes. Count what is left." },
      },
      {
        prompt: { uz: "150 min ni soat va minutda ifodalang", ru: "Вырази 150 мин в часах и минутах", en: "Express 150 min in hours and minutes" },
        tiles: [
          { uz: "1 h 50 min", ru: "1 ч 50 мин", en: "1 h 50 min" },
          { uz: "2 h 30 min", ru: "2 ч 30 мин", en: "2 h 30 min" },
          { uz: "15 h", ru: "15 ч", en: "15 h" },
        ],
        answer: 1,
        ok: { uz: "Ikki soat 120 min, qolgani 30 min.", ru: "Два часа это 120 мин, остаётся 30 мин.", en: "Two hours are 120 min and 30 min are left." },
        no: { uz: "Bitta soat yetmaydi. Ikkita soat necha daqiqa?", ru: "Одного часа мало. Сколько минут в двух часах?", en: "One hour is not enough. How many minutes are in two hours?" },
      },
      {
        prompt: { uz: "3 060 g ni kilogramm va grammda ifodalang", ru: "Вырази 3 060 г в килограммах и граммах", en: "Express 3 060 g in kilograms and grams" },
        tiles: [
          { uz: "30 kg 60 g", ru: "30 кг 60 г", en: "30 kg 60 g" },
          { uz: "3 kg 600 g", ru: "3 кг 600 г", en: "3 kg 600 g" },
          { uz: "3 kg 60 g", ru: "3 кг 60 г", en: "3 kg 60 g" },
        ],
        answer: 2,
        ok: { uz: "Har ming gramm bitta kilogramm. Uch ming va yana 60 g.", ru: "Каждая тысяча граммов это килограмм. Три тысячи и ещё 60 г.", en: "Every thousand grams is one kilogram. Three thousand and 60 g more." },
        no: { uz: "Nollarni sanang. Bir kilogrammda ming gramm bor.", ru: "Посчитай нули. В одном килограмме тысяча граммов.", en: "Count the zeros. One kilogram holds a thousand grams." },
      },
    ],
    counter: { uz: "savol", ru: "вопрос", en: "question" },
    doneText: { uz: "Uch savol ham yopildi", ru: "Все три вопроса закрыты", en: "All three questions are closed" },
    audio: {
      intro: {
        uz: [
          "Dispetcher jurnalida uchta yozuv qoldi.",
          "Har birini ikki birlikda ifodalang. Javobni bosing.",
        ],
        ru: [
          "В журнале диспетчера осталось три записи.",
          "Вырази каждую в двух единицах. Нажми ответ.",
        ],
        en: [
          "Three records are left in the dispatcher's log.",
          "Express each one in two units. Tap the answer.",
        ],
      },
    },
  },

  s12: {
    eyebrow: { uz: "Strategiya", ru: "Стратегия", en: "Strategy" },
    title: { uz: "Qaysi yo'l qulayroq", ru: "Какой путь удобнее", en: "Which way is more convenient" },
    lead: { uz: "2 h 25 min · 4 — ikki yo'l ham to'g'ri", ru: "2 ч 25 мин · 4 — оба пути верны", en: "2 h 25 min · 4 — both ways are correct" },
    source: { uz: "To'rtta smena", ru: "Четыре смены", en: "Four shifts" },
    routes: [
      {
        name: { uz: "Bitta birlikka keltirib", ru: "Приведя к одной единице", en: "By bringing to one unit" },
        lines: [
          { uz: "2 h 25 min = 145 min", ru: "2 ч 25 мин = 145 мин", en: "2 h 25 min = 145 min" },
          { uz: "145 · 4 = 580", ru: "145 · 4 = 580", en: "145 · 4 = 580" },
          { uz: "580 min = 9 h 40 min", ru: "580 мин = 9 ч 40 мин", en: "580 min = 9 h 40 min" },
        ],
      },
      {
        name: { uz: "Bo'laklab", ru: "По частям", en: "Part by part" },
        lines: [
          { uz: "2 h · 4 = 8 h", ru: "2 ч · 4 = 8 ч", en: "2 h · 4 = 8 h" },
          { uz: "25 min · 4 = 100 min = 1 h 40 min", ru: "25 мин · 4 = 100 мин = 1 ч 40 мин", en: "25 min · 4 = 100 min = 1 h 40 min" },
          { uz: "8 h + 1 h 40 min = 9 h 40 min", ru: "8 ч + 1 ч 40 мин = 9 ч 40 мин", en: "8 h + 1 h 40 min = 9 h 40 min" },
        ],
      },
    ],
    answerIndex: 1,
    routeFeedback: [
      { uz: "Bu yo'l ham to'g'ri javob beradi, lekin 580 daqiqani soatga qaytarish uzoqroq. Massada esa aynan shu yo'l qulay.", ru: "Этот путь тоже даёт верный ответ, но возвращать 580 минут в часы дольше. Зато для массы удобен именно он.", en: "This way also gives the correct answer, but turning 580 minutes back into hours takes longer. For mass, however, this is the handy one." },
      { uz: "Ha. Vaqtda bo'laklab ishlash qulay, chunki katta songa o'tish shart emas.", ru: "Да. Со временем удобнее по частям, потому что не нужно переходить к большому числу.", en: "Yes. With time it is easier part by part, because you do not have to go through a big number." },
    ],
    note: { uz: "Massada esa: 5 t 250 kg · 3 = 5 250 kg · 3 = 15 750 kg = 15 t 750 kg", ru: "А для массы: 5 т 250 кг · 3 = 5 250 кг · 3 = 15 750 кг = 15 т 750 кг", en: "And for mass: 5 t 250 kg · 3 = 5 250 kg · 3 = 15 750 kg = 15 t 750 kg" },
    audio: {
      intro: {
        uz: [
          "Ba'zan bitta masalani ikki yo'l bilan yechish mumkin. Ikkalasi ham to'g'ri.",
          "Chapda hammasini daqiqaga aylantiramiz. O'ngda soat va daqiqani alohida ko'paytiramiz.",
          "Shu misolda qaysi biri qulayroq deb o'ylaysiz. Kartani bosing.",
        ],
        ru: [
          "Иногда одну задачу можно решить двумя путями. Оба верны.",
          "Слева переводим всё в минуты. Справа умножаем часы и минуты по отдельности.",
          "Как думаешь, какой путь удобнее именно здесь. Нажми на карточку.",
        ],
        en: [
          "Sometimes one task can be solved in two ways. Both are correct.",
          "On the left we turn everything into minutes. On the right we multiply the hours and the minutes separately.",
          "Which one do you think is handier here. Tap a card.",
        ],
      },
    },
  },

  s13: {
    eyebrow: { uz: "Hayotiy vazifa", ru: "Задача из жизни", en: "Real-life task" },
    title: { uz: "Oyna yopilmoqda", ru: "Окно закрывается", en: "The window is closing" },
    task: { uz: "oyna: 2 h 30 min · ishlar: 45 min, 1 h 10 min, 25 min", ru: "окно: 2 ч 30 мин · работы: 45 мин, 1 ч 10 мин, 25 мин", en: "window: 2 h 30 min · jobs: 45 min, 1 h 10 min, 25 min" },
    question: { uz: "Ishlar jami qancha vaqt oladi va oynaga sig'adimi?", ru: "Сколько времени займут работы и уместятся ли они в окно?", en: "How long will the jobs take and do they fit into the window?" },
    correctIndex: 0,
    options: [
      { uz: "2 h 20 min, sig'adi", ru: "2 ч 20 мин, умещаются", en: "2 h 20 min, they fit" },
      { uz: "1 h 80 min, sig'adi", ru: "1 ч 80 мин, умещаются", en: "1 h 80 min, they fit" },
      { uz: "2 h 40 min, sig'maydi", ru: "2 ч 40 мин, не умещаются", en: "2 h 40 min, they do not fit" },
      { uz: "2 h 20 min, sig'maydi", ru: "2 ч 20 мин, не умещаются", en: "2 h 20 min, they do not fit" },
    ],
    feedback: [
      { uz: "To'g'ri. 140 min bu 2 h 20 min, oynada esa 150 min bor. 10 min zaxira qoladi.", ru: "Верно. 140 мин это 2 ч 20 мин, а в окне 150 мин. Остаётся 10 мин запаса.", en: "Right. 140 min is 2 h 20 min and the window holds 150 min. 10 min are left over." },
      { uz: "Vaqt to'g'ri, yozuv tugallanmagan. 80 min ichida yana bir butun soat bor.", ru: "Время верное, а запись не завершена. В 80 мин есть ещё целый час.", en: "The time is right but the record is unfinished. 80 min holds one more whole hour." },
      { uz: "Yig'indi katta chiqdi. 45 va 25 birga bir soat emas, atigi 70 min beradi.", ru: "Сумма получилась больше. 45 и 25 вместе дают не час, а 70 мин.", en: "The sum came out too big. 45 and 25 together give 70 min, not an hour." },
      { uz: "Vaqt to'g'ri. Endi solishtiring, 2 h 20 min oynadagi 2 h 30 min dan kam.", ru: "Время верное. Теперь сравни, 2 ч 20 мин меньше, чем 2 ч 30 мин окна.", en: "The time is right. Now compare, 2 h 20 min is less than the 2 h 30 min of the window." },
    ],
    proof: { uz: "45 + 70 + 25 = 140 min = 2 h 20 min · zaxira 10 min", ru: "45 + 70 + 25 = 140 мин = 2 ч 20 мин · запас 10 мин", en: "45 + 70 + 25 = 140 min = 2 h 20 min · 10 min spare" },
    audio: {
      intro: {
        uz: [
          "Smena oxiri. Tungi oyna ikki yarim soat davom etadi.",
          "Uch ishga qirq besh daqiqa, bir soat o'n daqiqa va yigirma besh daqiqa ketadi. Jami qancha va sig'adimi.",
        ],
        ru: [
          "Конец смены. Ночное окно длится два с половиной часа.",
          "На три работы уходит сорок пять минут, час десять и двадцать пять минут. Сколько всего и умещаются ли они.",
        ],
        en: [
          "The end of the shift. The night window lasts two and a half hours.",
          "The three jobs take forty five minutes, one hour ten minutes and twenty five minutes. How much in total and do they fit.",
        ],
      },
      on_correct: { uz: "To'g'ri. Brigada oynaga ulgurdi va bir oz zaxira ham qoldi.", ru: "Верно. Бригада успела в окно, и запас тоже остался.", en: "Right. The crew fitted into the window and some spare time was left." },
      on_wrong: [
        { uz: "To'g'ri javob.", ru: "Верный ответ.", en: "The correct answer." },
        { uz: "Daqiqalar oltmishdan oshsa, ular soatga aylanadi.", ru: "Если минут больше шестидесяти, они превращаются в час.", en: "When the minutes pass sixty, they turn into an hour." },
        { uz: "Uch sonni qaytadan qo'shing. Avval daqiqalarni jamlang.", ru: "Сложи три числа заново. Сначала собери минуты.", en: "Add the three numbers again. Collect the minutes first." },
        { uz: "Ikki vaqtni solishtiring. Qaysi biri katta.", ru: "Сравни два времени. Какое из них больше.", en: "Compare the two times. Which one is larger." },
      ],
    },
  },

  s14: {
    eyebrow: { uz: "Yangi holat", ru: "Новый случай", en: "New case" },
    title: { uz: "Ombor hisoboti", ru: "Отчёт склада", en: "The store report" },
    task: { uz: "boshida 12 m 50 cm · oxirida 7 m 70 cm qoldi", ru: "было 12 м 50 см · осталось 7 м 70 см", en: "at the start 12 m 50 cm · at the end 7 m 70 cm left" },
    question: { uz: "Smena davomida qancha kabel ishlatildi?", ru: "Сколько кабеля израсходовали за смену?", en: "How much cable was used during the shift?" },
    correctIndex: 0,
    options: [
      { uz: "4 m 80 cm", ru: "4 м 80 см", en: "4 m 80 cm" },
      { uz: "5 m 20 cm", ru: "5 м 20 см", en: "5 m 20 cm" },
      { uz: "4 m 20 cm", ru: "4 м 20 см", en: "4 m 20 cm" },
      { uz: "5 m 80 cm", ru: "5 м 80 см", en: "5 m 80 cm" },
    ],
    feedback: [
      { uz: "To'g'ri. 1 250 dan 770 ni ayirdik va 480 cm qoldi, ya'ni 4 m 80 cm.", ru: "Верно. Из 1 250 вычли 770 и осталось 480 см, то есть 4 м 80 см.", en: "Right. We took 770 from 1 250 and 480 cm were left, that is 4 m 80 cm." },
      { uz: "Bir metr ortiqcha. Tekshiring: 7 m 70 cm ga javobingizni qo'shsa, 12 m 50 cm chiqishi kerak.", ru: "Один метр лишний. Проверь: если к 7 м 70 см прибавить твой ответ, должно выйти 12 м 50 см.", en: "One metre too many. Check it: adding your answer to 7 m 70 cm must give 12 m 50 cm." },
      { uz: "Santimetrda kichikdan katta ayirilgan. 50 dan 70 ni ayirish uchun metrdan qarz olinadi.", ru: "В сантиметрах из меньшего вычли большее. Чтобы из 50 вычесть 70, берут заём у метра.", en: "In the centimetres the bigger was taken from the smaller. To take 70 from 50 you borrow from a metre." },
      { uz: "Ikkala xona ham surildi. Avval santimetrni, keyin metrni hisoblang.", ru: "Сдвинулись оба разряда. Посчитай сначала сантиметры, потом метры.", en: "Both places slipped. Count the centimetres first, then the metres." },
    ],
    proof: { uz: "1 250 cm − 770 cm = 480 cm → 4 m 80 cm", ru: "1 250 см − 770 см = 480 см → 4 м 80 см", en: "1 250 cm − 770 cm = 480 cm → 4 m 80 cm" },
    audio: {
      intro: {
        uz: [
          "Ombor hisoboti yopilmoqda. Boshida o'n ikki metr ellik santimetr kabel bor edi.",
          "Oxirida yetti metr yetmish santimetr qoldi. Qancha ishlatilganini toping va javobni teskari amal bilan tekshiring.",
        ],
        ru: [
          "Отчёт склада закрывается. В начале было двенадцать метров пятьдесят сантиметров кабеля.",
          "В конце осталось семь метров семьдесят сантиметров. Найди, сколько израсходовали, и проверь обратным действием.",
        ],
        en: [
          "The store report is closing. At the start there were twelve metres fifty centimetres of cable.",
          "At the end seven metres seventy centimetres were left. Find how much was used and check it with the inverse operation.",
        ],
      },
      on_correct: { uz: "To'g'ri. Teskari amal ham shuni tasdiqlaydi.", ru: "Верно. Обратное действие это подтверждает.", en: "Right. The inverse operation confirms it." },
      on_wrong: [
        { uz: "To'g'ri javob.", ru: "Верный ответ.", en: "The correct answer." },
        { uz: "Javobingizni qoldiqqa qo'shib ko'ring. Boshlang'ich son chiqmaydi.", ru: "Прибавь свой ответ к остатку. Начальное число не выходит.", en: "Add your answer to what is left. The starting number does not come out." },
        { uz: "Santimetrda qarz kerak. Bir metrni yuz santimetrga almashtiring.", ru: "В сантиметрах нужен заём. Обменяй один метр на сто сантиметров.", en: "The centimetres need a borrow. Exchange one metre for one hundred centimetres." },
        { uz: "Ikkala birlikni alohida tekshiring, keyin teskari amal bilan sinang.", ru: "Проверь каждую единицу отдельно, потом проверь обратным действием.", en: "Check each unit separately, then test it with the inverse operation." },
      ],
    },
  },

  s15: {
    eyebrow: { uz: "Yakun", ru: "Итог", en: "Summary" },
    title: { uz: "Unvongacha bitta savol", ru: "Один вопрос до звания", en: "One question before your title" },
    rewardTitle: { uz: "Miqdorlar dispetcheri", ru: "Диспетчер величин", en: "Quantity dispatcher" },
    question: { uz: "Ikkita kattalikni qo'shishdan oldin nima qilamiz?", ru: "Что делаем перед сложением двух величин?", en: "What do we do before adding two quantities?" },
    stem: { uz: "Qo'shishdan oldin men...", ru: "Перед сложением я...", en: "Before adding, I..." },
    correctIndex: 0,
    options: [
      { uz: "ularni bir xil o'lchov birligiga keltiraman", ru: "привожу их к одной единице измерения", en: "bring them to one unit of measurement" },
      { uz: "kattaroq sonni oldinga yozaman", ru: "записываю большее число первым", en: "write the bigger number first" },
      { uz: "masaladagi kalit so'zga qarayman", ru: "смотрю на ключевое слово в задаче", en: "look at the key word in the task" },
    ],
    feedback: [
      { uz: "To'g'ri. Bir xil birlik bo'lmasa, sonlarni qo'shib bo'lmaydi.", ru: "Верно. Без одной единицы числа складывать нельзя.", en: "Right. Without a shared unit the numbers cannot be added." },
      { uz: "Sonlarning tartibi javobni o'zgartirmaydi. Muhimi birliklar bir xil bo'lishi.", ru: "Порядок чисел не меняет ответ. Важно, чтобы единицы были одинаковыми.", en: "The order of the numbers does not change the answer. What matters is a shared unit." },
      { uz: "Kalit so'z amalni tanlamaydi. Amalni kattaliklar orasidagi bog'lanish tanlaydi.", ru: "Ключевое слово не выбирает действие. Действие выбирает связь величин.", en: "A key word does not choose the operation. The relation between the quantities does." },
    ],
    feedbackAudio: [
      { uz: "To'g'ri. Bir xil birlikka keltirgandan keyin amal oddiy sonlar kabi bajariladi.", ru: "Верно. После приведения к одной единице действие идёт как с обычными числами.", en: "Right. Once brought to one unit the operation runs like ordinary numbers." },
      { uz: "Sonlarning o'rnini almashtirish yetarli emas. Avval birliklar bir xil bo'lishi kerak.", ru: "Поменять числа местами недостаточно. Сначала единицы должны стать одинаковыми.", en: "Swapping the numbers is not enough. The units must match first." },
      { uz: "Kalit so'zga ishonmang. Amalni kattaliklar orasidagi bog'lanish tanlaydi.", ru: "Не доверяй ключевому слову. Действие выбирает связь величин.", en: "Do not trust the key word. The relation between the quantities chooses the operation." },
    ],
    proof: { uz: "48 m 60 cm + 25 m 70 cm = 74 m 30 cm", ru: "48 м 60 см + 25 м 70 см = 74 м 30 см", en: "48 m 60 cm + 25 m 70 cm = 74 m 30 cm" },
    resolution: { uz: "Bir xil birlikka keltirilgach, amal oddiy sonlar kabi bajariladi va javob yana ikki birlikda yoziladi.", ru: "После приведения к одной единице действие выполняется как с обычными числами, а ответ снова записывается в двух единицах.", en: "Once brought to one unit, the operation runs like ordinary numbers and the answer goes back into two units." },
    lead: { uz: "Usulni tanlang va kattaliklarni qo'shishni tushunganingizni ko'rsating.", ru: "Выбери способ и покажи, что понимаешь сложение величин.", en: "Choose the method and show that you understand adding quantities." },
    frames: [
      { uz: "Bir xil o'lchov birligiga keltiramiz", ru: "Приводим к одной единице измерения", en: "Bring to one unit of measurement" },
      { uz: "Amalni sonlar kabi bajaramiz va qaytaramiz", ru: "Выполняем действие как с числами и возвращаем", en: "Do the operation as with numbers and return" },
      { uz: "Amalni kalit so'z emas, bog'lanish tanlaydi", ru: "Действие выбирает связь величин, а не ключевое слово", en: "The relation chooses the operation, not a key word" },
      { uz: "48 m 60 cm + 25 m 70 cm = 74 m 30 cm", ru: "48 м 60 см + 25 м 70 см = 74 м 30 см", en: "48 m 60 cm + 25 m 70 cm = 74 m 30 cm" },
      { uz: "Keyingi missiya: hajm birliklari", ru: "Следующая миссия: единицы объёма", en: "Next mission: units of volume" },
    ],
    audio: {
      intro: {
        uz: [
          "Tungi oyna yopildi va brigada ishni tugatdi. Bugun kattaliklar bilan ishlashni o'rgandingiz.",
          "Birinchi qadam doim bitta. Qiymatlarni bir xil o'lchov birligiga keltiramiz.",
          "Keyin amalni oddiy sonlar kabi bajaramiz va natijani o'qishga qulay birlikka qaytaramiz.",
          "Amalni kalit so'z emas, kattaliklar orasidagi bog'lanish tanlaydi. Boshlang'ich buyurtma ham shu bilan yopildi.",
          "Keyingi missiyada hajm birliklari kutmoqda. Idishga qancha suv sig'ishini qanday bilamiz.",
          "Unvongacha bitta savol qoldi. Uchta javobdan to'g'risini tanlang.",
        ],
        ru: [
          "Ночное окно закрыто, бригада закончила работу. Сегодня главной темой были величины.",
          "Первый шаг всегда один. Приводим значения к одной и той же единице измерения.",
          "Потом выполняем действие как с обычными числами и возвращаем результат к удобной единице.",
          "Действие выбирает не ключевое слово, а связь между величинами. Этим закрылся и стартовый заказ.",
          "В следующей миссии ждут единицы объёма. Как узнать, сколько воды помещается в сосуд.",
          "До звания остался один вопрос. Выбери верный ответ из трёх.",
        ],
        en: [
          "The night window is closed and the crew has finished. Today you learned to work with quantities.",
          "The first step is always the same. Bring the values to one and the same unit of measurement.",
          "Then do the operation as with ordinary numbers and return the result to a convenient unit.",
          "The operation is chosen by the relation between the quantities, not by a key word. That also closed the starting order.",
          "The next mission holds the units of volume. How do we tell how much water a vessel takes.",
          "One question is left before your title. Choose the correct answer out of three.",
        ],
      },
    },
  },
};

let runtimeConfig = { ttsApiBase: '', voiceGender: 'f', correctSoundUrl: '', wrongSoundUrl: '', previewMode: false };
const configureLesson = (next) => { runtimeConfig = { ...runtimeConfig, ...next }; };
const normalizeLang = (value) => ['uz', 'ru', 'en'].includes(value) ? value : 'uz';
const LangContext = createContext('uz');
const useLang = () => useContext(LangContext);
const useT = () => { const lang = useLang(); return useCallback((value) => { if (value == null) return ''; if (React.isValidElement(value)) return value; if (typeof value === 'string' || typeof value === 'number') return String(value); return value[lang] ?? value.uz ?? ''; }, [lang]); };
function useIsMobile(breakpoint = 640) { const [mobile, setMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < breakpoint : false); useEffect(() => { if (typeof window === 'undefined') return undefined; const update = () => setMobile(window.innerWidth < breakpoint); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update); }, [breakpoint]); return mobile; }
function usePrefersReducedMotion() { const [reduced, setReduced] = useState(typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches); useEffect(() => { if (typeof window === 'undefined' || !window.matchMedia) return undefined; const media = window.matchMedia('(prefers-reduced-motion: reduce)'); const update = () => setReduced(media.matches); media.addEventListener?.('change', update); return () => media.removeEventListener?.('change', update); }, []); return reduced; }
const buildTtsUrl = (base, text, gender) => base + '/api/tts?text=' + encodeURIComponent(String(text).slice(0, 1000)) + '&g=' + (gender === 'm' ? 'm' : 'f');
class AudioEngine {
  constructor() { this.queue = []; this.index = 0; this.audio = null; this.previewUtterance = null; this.timer = null; this.lang = 'uz'; this.muted = false; this.listener = null; }
  emit(extra = {}) { this.listener?.({ muted: this.muted, ...extra }); }
  setLang(lang) { this.lang = lang; }
  stop() { if (this.timer && typeof window !== 'undefined') window.clearTimeout(this.timer); this.timer = null; if (this.audio) { this.audio.onended = null; this.audio.onerror = null; this.audio.pause(); this.audio.removeAttribute('src'); } if (this.previewUtterance) { this.previewUtterance.onstart = null; this.previewUtterance.onend = null; this.previewUtterance.onerror = null; } if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel(); this.previewUtterance = null; }
  load(queue) { this.stop(); this.queue = queue; this.index = 0; this.emit({ isPlaying: false, completed: false, currentSegment: null }); }
  start() { if (!this.queue.length) { this.emit({ completed: true }); return; } this.play(); }
  timed(item) { const ms = Math.max(1500, Math.min(6500, String(item.text).split(/\s+/).length * 330)); this.emit({ isPlaying: true, completed: false, currentSegment: item.id, visualOnly: true }); this.timer = window.setTimeout(() => { this.emit({ isPlaying: false, currentSegment: null }); this.index += 1; this.play(); }, ms); }
  play() { const item = this.queue[this.index]; if (!item) { this.emit({ isPlaying: false, completed: true, currentSegment: null, visualOnly: this.muted || !runtimeConfig.ttsApiBase }); return; } if (this.muted || !runtimeConfig.ttsApiBase) { if (!this.muted && runtimeConfig.previewMode && typeof window !== 'undefined' && window.speechSynthesis) { try { window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(String(item.text)); utterance.lang = { uz: 'uz-UZ', ru: 'ru-RU', en: 'en-GB' }[this.lang] || 'uz-UZ'; utterance.rate = 0.94; utterance.onstart = () => this.emit({ isPlaying: true, completed: false, currentSegment: item.id, visualOnly: false }); utterance.onend = () => { this.emit({ isPlaying: false, currentSegment: null }); this.index += 1; this.play(); }; utterance.onerror = () => this.timed(item); this.previewUtterance = utterance; this.timer = window.setTimeout(() => { try { window.speechSynthesis.speak(utterance); } catch { this.timed(item); } }, 50); return; } catch { /* deterministic timer fallback */ } } this.timed(item); return; } if (!this.audio) { this.audio = new Audio(); this.audio.crossOrigin = 'anonymous'; } this.audio.onended = () => { this.index += 1; this.play(); }; this.audio.onerror = () => this.timed(item); this.audio.src = buildTtsUrl(runtimeConfig.ttsApiBase, item.text, runtimeConfig.voiceGender); this.audio.play().then(() => this.emit({ isPlaying: true, completed: false, currentSegment: item.id, visualOnly: false })).catch(() => this.timed(item)); }
  toggleMute() { this.muted = !this.muted; this.stop(); this.emit({ isPlaying: false, completed: this.muted, currentSegment: null, muted: this.muted, visualOnly: true }); }
  pushOneOff(text) { if (!text) return; this.stop(); this.queue = [{ id: 'feedback-' + Date.now(), text }]; this.index = 0; this.play(); }
}
let audioEngineInstance = null;
const getAudioEngine = () => { if (!audioEngineInstance) audioEngineInstance = new AudioEngine(); return audioEngineInstance; };
function useAudio(segments) { const lang = useLang(); const stableKey = useMemo(() => JSON.stringify(segments), [segments]); const stableSegments = useMemo(() => JSON.parse(stableKey), [stableKey]); const [state, setState] = useState({ isPlaying: false, completed: false, currentSegment: null, muted: false, visualOnly: false }); useEffect(() => { const engine = getAudioEngine(); engine.setLang(lang); engine.listener = (next) => setState((previous) => ({ ...previous, ...next })); engine.load(stableSegments); const timer = window.setTimeout(() => engine.start(), 120); return () => { window.clearTimeout(timer); engine.stop(); }; }, [lang, stableSegments]); return { ...state, replay: () => { const engine = getAudioEngine(); engine.load(stableSegments); engine.start(); }, toggleMute: () => getAudioEngine().toggleMute(), pushOneOff: (text) => getAudioEngine().pushOneOff(text) }; }
function useNarration(value, screen) { const lang = useLang(); const reduced = usePrefersReducedMotion(); const segments = useMemo(() => { const source = value?.intro ?? value; const texts = source?.[lang] ?? source?.uz ?? []; return (Array.isArray(texts) ? texts : [texts]).filter(Boolean).map((text, index) => ({ id: 's' + screen + '-beat-' + index, text })); }, [lang, screen, value]); const audio = useAudio(segments); const active = segments.findIndex((segment) => segment.id === audio.currentSegment); const finalFrame = Math.max(0, FRAME_COUNTS[screen] - 1); const feedbackPlaying = audio.currentSegment?.startsWith('feedback-') === true; const frame = reduced || feedbackPlaying || audio.completed ? finalFrame : active >= 0 ? active : 0; return { ...audio, frame, caption: active >= 0 ? segments[active].text : '' }; }
function useGuidedNarration(value, screen, step) { const lang = useLang(); const texts = useMemo(() => { const source = value?.intro ?? value; const localized = source?.[lang] ?? source?.uz ?? []; return (Array.isArray(localized) ? localized : [localized]).filter(Boolean); }, [lang, value]); const intro = useMemo(() => texts.length ? [{ id: 's' + screen + '-beat-0', text: texts[0] }] : [], [screen, texts]); const audio = useAudio(intro); const speakStep = useCallback((index) => { const text = texts[index]; if (text) audio.pushOneOff(text); }, [audio, texts]); return { ...audio, frame: step, caption: texts[step] ?? '', speakStep }; }
const isAudioReady = (audio) => !audio || audio.muted || audio.visualOnly || audio.completed;
const playSfx = (kind) => { const url = kind === 'correct' ? runtimeConfig.correctSoundUrl : runtimeConfig.wrongSoundUrl; if (!url || typeof window === 'undefined') return; try { new Audio(url).play().catch(() => {}); } catch { /* optional */ } };

const BitSVG = ({ state = 'present', className = '' }) => {
  const isWave = state === 'wave';
  const isHappy = state === 'happy' || isWave || state === 'idea' || state === 'nod';
  const isThinking = state === 'hint' || state === 'think';
  const isAwkward = state === 'awkward';

  return (
  <svg className={`g1-char g1-char-bit g1-char-state-${state} ${className}`} viewBox="0 0 120 150" aria-hidden="true">
    <defs>
      <linearGradient id="g4bbody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#E2ECF2" />
        <stop offset="100%" stopColor="#B6C7D2" />
      </linearGradient>
      <linearGradient id="g4bhead" x1="0" y1="0" x2="0" y2="1">
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
    <rect x="34" y="60" width="52" height="62" rx="18" fill="url(#g4bbody)" stroke="#A9BCC8" strokeWidth="2" />
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
    <rect x="28" y="28" width="64" height="46" rx="16" fill="url(#g4bhead)" stroke="#A9BCC8" strokeWidth="2" />
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
const AudioIndicator = ({ audio }) => { const t = useT(); const muteLabel = t(audio.muted ? bi("Ovozni yoqish", 'Включить звук', 'Turn sound on') : bi("Ovozni o'chirish", 'Выключить звук', 'Turn sound off')); const replayLabel = t(bi('Qayta eshitish', 'Повторить', 'Replay')); return <div className="audio-indicator audio-controls"><button type="button" onClick={audio.toggleMute} aria-label={muteLabel} title={muteLabel}>{audio.muted ? '🔇' : '🔊'}</button><span className={audio.isPlaying ? 'audio-wave playing' : 'audio-wave'}><i/><i/><i/></span>{!audio.muted && <button type="button" onClick={audio.replay} aria-label={replayLabel} title={replayLabel}>↻</button>}</div>; };
const ScreenTypeLabel = ({ type }) => { const t = useT(); const labels = { hook: bi('Taxmin', 'Гипотеза', "Estimate"), exploration: bi('Tadqiqot', 'Исследование', "Explore"), model: bi('Model', 'Модель', 'Model'), rule: bi('Qoida', 'Правило', "Rule"), strategy: bi('Strategiya', 'Стратегия', 'Strategy'), error: bi('Xatoni tuzatish', 'Исправление ошибки', 'Error repair'), test: bi('Mashq', 'Задание', "Task"), case: bi('Vaziyat', 'Ситуация', "Situation"), summary: bi('Yakun', 'Итог', "Summary") }; return <span className="screen-type">{t(labels[type])}</span>; };
const Stage = ({ screen, audio, onPrev, onNext, canAdvance = true, canFinish = true, finish = false, nextDisabled = false, children }) => { const t = useT(); const mobile = useIsMobile(); const meta = SCREEN_META[screen]; const c = CONTENT[`s${screen}`]; const pad = mobile ? 12 : 24; const ready = !nextDisabled && canUseGrade4TheoryContinue(canAdvance && canFinish && isAudioReady(audio), finish); return <main className={`stage stage-${meta.type}`}><header className="stage-header" style={{ paddingLeft: pad, paddingRight: pad }}><div className="progress-track" aria-label={`${screen + 1} / ${TOTAL_SCREENS}`}><div className="progress-fill progress-bar" style={{ width: `${(screen + 1) / TOTAL_SCREENS * 100}%` }}/></div><div className="stage-chrome"><div className="chrome-title"><span className="status-dot"/><span>{t(c.eyebrow)}</span></div><div className="chrome-actions"><ScreenTypeLabel type={meta.type}/>{audio && <AudioIndicator audio={audio}/>}<span className="screen-count">{String(screen + 1).padStart(2, '0')} / {TOTAL_SCREENS}</span></div></div></header><section className="stage-content" style={{ paddingLeft: pad, paddingRight: pad }}><div className="stage-body">{children}</div></section><footer className="stage-nav" style={{ paddingLeft: pad, paddingRight: pad }}>{screen === 0 ? <span/> : <button type="button" className="btn-ghost" onClick={onPrev}>← {t(bi('Orqaga', 'Назад', "Back"))}</button>}<button type="button" className="btn-white-accent" disabled={!ready} aria-disabled={!ready} onClick={onNext}>{finish ? t(bi('Darsni yakunlash', 'Завершить урок', "Finish lesson")) : t(bi('Davom etish', 'Продолжить', "Continue"))} →</button></footer></main>; };
const Heading = ({ c, state = 'present', showBit = false, hook = false }) => { const t = useT(); return <div className={'heading ' + (showBit && !hook ? '' : 'heading-solo')}><div><span data-g4-role={hook ? 'hook-topic' : undefined}>{t(c.eyebrow)}</span><h1 data-g4-role={hook ? 'hook-title' : undefined}>{t(c.title)}</h1></div>{showBit && !hook && <BitSVG state={state}/>}</div>; };

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
      <span className="reward-kicker">{t(solved ? REWARD_EARNED : REWARD_WAIT)}</span>
      <h2>{t(solved ? title : REWARD_OPEN)}</h2>
      <div className="reward-score">
        <strong>{firstTry}/{total}</strong>
        <span>{t(FIRST_TRY_LABEL)}</span>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// DARSNING O'Z CSS'i. Umumiy Stage, xuk freymi, obratnaya svyaz va yakun
// STYLES va G4_ETALON_OVERRIDES dan keladi. Har blok kontenti balandligida
// turadi va markazga tortiladi: skroll yo'q, quruq katta freym ham yo'q.
// ---------------------------------------------------------------------------
const TOPIC_STYLES = `
/* Har blok o'z kontenti balandligida turadi va ekran markaziga tortiladi:
   kichik matn ostida katta bo'sh freym qolmaydi. */
.split-layout,.task-layout,.track-layout,.build-layout,.relation-layout,
.repair-layout,.band-layout,.rule-layout,.rapid-layout,.route-layout{
  align-self:start;height:auto;max-height:100%;margin-inline:auto}

.panel-label{display:block;color:${T.cyan};font:900 10px/1.1 'JetBrains Mono',monospace;letter-spacing:.13em;text-transform:uppercase}
.task-expression{display:block;color:${T.navy};font:900 clamp(20px,2.9vw,28px)/1.18 'JetBrains Mono',monospace;overflow-wrap:anywhere}
.task-expression.small{font-size:clamp(17px,2.3vw,21px)}
.mini-frame{min-width:0;padding:16px 20px;display:grid;align-content:start;gap:11px;overflow:hidden;border-radius:19px;background:linear-gradient(150deg,#FFFFFF,${T.cyanSoft});box-shadow:0 14px 30px -26px rgba(${T.shadowBase},.5)}
.task-proof{padding:9px 12px;border-radius:12px;display:grid;grid-template-columns:auto minmax(0,1fr);align-items:center;gap:9px;background:${T.successSoft};box-shadow:inset 4px 0 ${T.success};animation:soft-rise .38s ease both}
.task-proof>b{color:${T.success};font:900 9px 'JetBrains Mono',monospace;letter-spacing:.1em}
.task-proof>span{color:${T.navy};font:800 14px/1.25 'JetBrains Mono',monospace;overflow-wrap:anywhere}
.options-four{grid-template-columns:repeat(2,minmax(0,1fr))}
/* Yechim freymi: chapda Bit, o'ngda YECHIM yorlig'i, formula va izoh. */
/* Yechim figurasi — etalon Dars01 o'lchovi */
.solution-bit{width:51px;height:64px;flex:0 0 51px;display:block;overflow:hidden;animation:solution-hop .6s ease .18s both}
.solution-bit>.g1-char,.solution-bit>svg{width:100%;height:100%;display:block}
.solution-formula{display:block;margin:3px 0 4px;color:${T.navy};font:900 15px/1.2 'JetBrains Mono',monospace;font-style:normal;overflow-wrap:anywhere}
.solution-text{display:block;color:${T.ink2};font-size:14px;line-height:1.36}
/* Bit yo'q freymlar bir ustunli bo'ladi, chap tomonda bo'sh joy qolmaydi. */
.lesson-root .feedback[data-g4-role~="feedback-frame"][data-g4-feedback="wrong"],
.lesson-root .feedback[data-g4-role~="feedback-frame"][data-g4-feedback="diagnostic"]{grid-template-columns:minmax(0,1fr)!important;min-height:64px!important;padding:11px 14px!important}
.lesson-root .hook-stack .feedback[data-g4-role~="feedback-frame"][data-g4-feedback="diagnostic"]{grid-template-columns:minmax(0,1fr)!important;min-height:56px!important}
.check-wide{width:100%;min-height:46px}
.tiny-action{align-self:start;padding:5px 9px;border:0;border-radius:9px;color:${T.ink2};background:#EFF2EF;cursor:pointer;font-size:11px;font-weight:800}

/* --- xuk: tungi dispetcherlik konsoli ------------------------------------ */
.dispatch-visual{width:100%;height:100%;min-height:0;display:grid;grid-template-rows:auto minmax(0,1fr);gap:8px;color:#E7F7F8;overflow:hidden}
.dispatch-head{display:flex;align-items:center;justify-content:space-between;gap:8px;font-family:'JetBrains Mono',monospace}
.dispatch-node{display:flex;align-items:center;gap:6px;color:#8FD8E2;font-size:9px;font-weight:900;letter-spacing:.1em}
.dispatch-node>i{width:7px;height:7px;border-radius:50%;background:${T.lime};box-shadow:0 0 9px rgba(149,201,61,.8)}
.dispatch-state{padding:4px 8px;border:1px solid rgba(255,183,107,.3);border-radius:999px;color:#FFD29E;background:rgba(169,111,19,.2);font-size:8px;font-weight:900;letter-spacing:.06em;white-space:nowrap}
.dispatch-body{min-height:0;display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);align-items:center;gap:12px}
.cable-pair{min-width:0;display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);align-items:center;gap:8px}
.cable-card{min-width:0;padding:10px 11px;border-radius:13px;display:grid;gap:6px;background:rgba(255,255,255,.07);box-shadow:inset 0 0 0 1px rgba(144,228,235,.16)}
.cable-card>span{color:#9FC4CE;font-size:9px;font-weight:800;letter-spacing:.04em}
.cable-card>strong{color:#FFFFFF;font:900 clamp(15px,2vw,19px)/1.1 'JetBrains Mono',monospace;white-space:nowrap}
.cable-line{height:6px;border-radius:999px;background:linear-gradient(90deg,${T.cyan},#7FD6DE)}
.cable-line.b{background:linear-gradient(90deg,${T.lime},#CDE98C)}
.cable-plus{color:#8FD8E2;font:900 19px 'JetBrains Mono',monospace}
.order-card{position:relative;min-width:0;padding:11px 12px;border-radius:14px;display:grid;gap:6px;background:rgba(255,91,53,.14);box-shadow:inset 0 0 0 1px rgba(255,145,110,.34)}
.order-card>span{color:#FFC3AE;font-size:9px;font-weight:800}
.order-card>strong{color:#FFFFFF;font:900 clamp(16px,2.2vw,21px)/1.1 'JetBrains Mono',monospace;white-space:nowrap;text-decoration:line-through;text-decoration-color:rgba(255,145,110,.85)}
.order-flag{position:absolute;right:10px;top:10px;width:9px;height:9px;border-radius:50%;background:${T.accent};box-shadow:0 0 10px rgba(255,91,53,.9)}
.is-resolved .order-card>strong{text-decoration:none;opacity:.55}

/* --- s1: yashiringan metr ------------------------------------------------ */
.split-layout{width:min(800px,100%);display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;overflow:hidden}
.split-model{min-width:0;padding:16px;display:grid;align-content:start;gap:12px;overflow:hidden;border-radius:19px;background:rgba(255,255,255,.95);box-shadow:0 14px 30px -26px rgba(${T.shadowBase},.5)}
.unit-columns{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.unit-col{position:relative;min-width:0;min-height:124px;padding:11px;border-radius:16px;display:grid;align-content:center;justify-items:center;gap:6px;background:${T.cyanSoft};transition:background .4s ease}
.unit-col>span{color:${T.cyan};font:900 10px 'JetBrains Mono',monospace;letter-spacing:.12em;text-transform:uppercase}
.unit-col>strong{color:${T.navy};font:900 clamp(32px,5vw,44px)/1 'JetBrains Mono',monospace}
.unit-col.is-lifted{background:${T.successSoft}}
.unit-carry{position:absolute;top:8px;right:10px;padding:2px 7px;border-radius:999px;color:#fff;background:${T.success};font:900 10px 'JetBrains Mono',monospace;font-style:normal;animation:carry-in .45s cubic-bezier(.2,.9,.3,1) both}
.unit-hot{padding:6px 14px;border:0;border-radius:13px;display:grid;justify-items:center;gap:3px;color:${T.navy};background:#FFFFFF;cursor:pointer;box-shadow:0 0 0 2px ${T.accent},0 10px 20px -14px rgba(255,91,53,.9);font:900 clamp(30px,4.6vw,40px)/1 'JetBrains Mono',monospace}
.unit-hot>em{color:${T.accent};font:900 9px 'Manrope',sans-serif;font-style:normal;letter-spacing:.04em}
.unit-hot:hover:not(:disabled){transform:translateY(-2px)}
.unit-split{display:grid;justify-items:center;gap:6px}
.unit-chunk{padding:5px 13px;border:0;border-radius:11px;color:#fff;background:${T.accent};cursor:pointer;font:900 22px 'JetBrains Mono',monospace;animation:carry-in .4s ease both}
.unit-rest{color:${T.navy};font:900 26px 'JetBrains Mono',monospace}
.split-done{padding:7px 12px 7px 6px;border:1px solid rgba(34,122,83,.18);border-radius:15px;display:grid;grid-template-columns:51px minmax(0,1fr) auto;align-items:center;gap:9px;background:linear-gradient(135deg,#FFFFFF,${T.successSoft});box-shadow:0 12px 26px -20px rgba(34,122,83,.5);animation:soft-rise .4s ease both}
.split-done>span{color:${T.ink2};font-size:12px;font-weight:800}
.split-done>strong{color:${T.navy};font:900 15px 'JetBrains Mono',monospace;white-space:nowrap}
.split-steps{min-width:0;padding:16px;overflow:hidden;border-radius:19px;background:rgba(255,255,255,.95);box-shadow:0 14px 30px -26px rgba(${T.shadowBase},.5)}
.step-list{margin:0;padding:0;display:grid;align-content:center;gap:10px;list-style:none}
.step-list>li{min-height:58px;padding:11px 13px;border-radius:14px;display:grid;grid-template-columns:28px minmax(0,1fr);align-items:center;gap:10px;background:#F5F7F5;opacity:.34;transition:opacity .35s ease,background .35s ease}
.step-list>li>b{width:26px;height:26px;border-radius:9px;display:grid;place-items:center;color:#fff;background:${T.ink3};font:900 10px 'JetBrains Mono',monospace}
.step-list>li>span{color:${T.ink};font-size:14px;font-weight:750;line-height:1.28}
.step-list>li.is-active{opacity:1;background:${T.cyanSoft}}
.step-list>li.is-active>b{background:${T.cyan}}
.step-list>li.is-done{opacity:1;background:${T.successSoft}}
.step-list>li.is-done>b{background:${T.success}}

/* --- tanlov ekranlari: ikki qator, model tepada ---------------------------- */
.task-layout{width:min(720px,100%);display:grid;grid-template-rows:auto auto;gap:12px;overflow:hidden}
.task-model{min-width:0;display:grid;gap:10px;overflow:hidden}
.task-layout>.question{height:auto;padding:14px 16px;display:grid;grid-template-rows:auto auto auto;align-content:start;gap:10px}
.task-layout>.question>h2{font:800 clamp(16px,2.2vw,19px)/1.28 'Manrope',sans-serif}
.task-layout .option{min-height:54px}
.carry-hint{display:flex;align-items:center;gap:9px;color:${T.accent};font:900 13px 'JetBrains Mono',monospace}
.carry-hint>i{font-style:normal;color:${T.navy}}
.carry-hint>em{padding:3px 8px;border-radius:999px;background:${T.accentSoft};font-style:normal;font-size:11px}
.bird-bars{display:grid;gap:9px}
.bird-row{display:grid;grid-template-columns:minmax(74px,auto) minmax(0,1fr) auto;align-items:center;gap:10px}
.bird-row>span{color:${T.ink2};font-size:12px;font-weight:850}
.bird-row>i{height:15px;border-radius:999px;background:${T.cyan};transition:width .5s ease}
.bird-row>i.b{background:${T.lime}}
.bird-row>i.c{background:${T.accent}}
.bird-row>b{color:${T.navy};font:900 13px 'JetBrains Mono',monospace;white-space:nowrap}
.bird-row.is-sum>span{color:${T.accent}}
.bird-row.is-unknown>i{position:relative;height:30px;border:2px dashed ${T.accent};background:${T.accentSoft};display:grid;place-items:center}
.bird-row.is-unknown>i>em{color:${T.accent};font-style:normal;white-space:nowrap}
.bird-row.is-unknown>b{color:${T.accent};font-size:16px}
.estimate-chip{justify-self:start;padding:6px 13px;border-radius:999px;color:${T.cyan};background:#FFFFFF;font:900 13px 'JetBrains Mono',monospace}
.window-bar{height:30px;display:flex;gap:2px;overflow:hidden;border-radius:10px;background:#FFFFFF}
.window-bar>i{position:relative;display:grid;place-items:center}
.window-bar>i>em{color:#fff;font:900 10px 'JetBrains Mono',monospace;font-style:normal}
.window-bar>i.a{background:${T.cyan}}
.window-bar>i.b{background:${T.navy}}
.window-bar>i.c{background:${T.lime}}
.window-bar>i.free{background:repeating-linear-gradient(135deg,#E3EAE8,#E3EAE8 4px,#F5F7F5 4px,#F5F7F5 8px)}
.window-scale{display:flex;justify-content:space-between;color:${T.ink3};font:800 10px 'JetBrains Mono',monospace}
.store-bar{height:34px;display:flex;gap:3px;overflow:hidden;border-radius:10px}
.store-bar>i{display:grid;place-items:center}
.store-bar>i>em{font:900 12px 'JetBrains Mono',monospace;font-style:normal}
.store-bar>i.used{flex:0 0 38%;background:${T.accentSoft};box-shadow:inset 0 0 0 2px ${T.accent}}
.store-bar>i.used>em{color:${T.accent};font-size:16px}
.store-bar>i.left{flex:1;background:${T.cyan}}
.store-bar>i.left>em{color:#fff}
.store-total{justify-self:center;color:${T.navy};font:900 14px 'JetBrains Mono',monospace}

/* --- s3: uch qadam, ikki teng freym -------------------------------------- */
.track-layout{width:min(800px,100%);display:grid;grid-template-rows:auto auto;gap:12px;overflow:hidden}
.track-pair{display:grid;grid-template-columns:1fr 1fr;gap:12px;overflow:hidden}
.track-frame{min-width:0;padding:15px;display:grid;align-content:start;gap:9px;overflow:hidden;border-radius:18px;background:rgba(255,255,255,.95);box-shadow:0 14px 30px -26px rgba(${T.shadowBase},.5)}
.track-frame.is-accent{background:linear-gradient(150deg,#FFFFFF,${T.cyanSoft})}
.track-frame>p{min-height:52px;padding:11px 13px;border-radius:12px;display:flex;align-items:center;color:${T.navy};background:#F5F7F5;font:800 14px/1.3 'JetBrains Mono',monospace;white-space:pre-line;opacity:0;transform:translateY(6px);transition:opacity .38s ease,transform .38s ease;overflow-wrap:anywhere}
.track-frame>p.show{opacity:1;transform:none}
.track-frame.is-accent>p.show{background:#FFFFFF}
.track-steps{min-height:52px;display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:12px}
.track-step-now{min-width:0;padding:10px 12px;border-radius:13px;display:grid;grid-template-columns:28px minmax(0,1fr);align-items:center;gap:9px;background:${T.cyanSoft}}
.track-step-now>b{width:27px;height:27px;border-radius:9px;display:grid;place-items:center;color:#fff;background:${T.cyan};font:900 11px 'JetBrains Mono',monospace}
.track-step-now>span{color:${T.ink};font-size:13px;font-weight:800;line-height:1.2}
.track-rule{min-height:72px;padding:7px 13px 7px 6px;border:1px solid rgba(34,122,83,.18);border-radius:15px;display:grid;grid-template-columns:51px minmax(0,1fr);align-items:center;gap:9px;color:${T.success};background:linear-gradient(135deg,#FFFFFF,${T.successSoft});box-shadow:0 12px 26px -20px rgba(34,122,83,.5);max-width:340px}

/* --- s4: javobni yig'ish -------------------------------------------------- */
.build-layout{width:min(780px,100%);display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);align-items:start;gap:12px;overflow:hidden}
.unit-hint{justify-self:start;padding:5px 11px;border-radius:999px;color:${T.navy};background:#FFFFFF;font:900 12px 'JetBrains Mono',monospace}
.build-panel{min-width:0;padding:15px;display:grid;align-content:start;gap:11px;overflow:hidden;border-radius:19px;background:rgba(255,255,255,.95);box-shadow:0 14px 30px -26px rgba(${T.shadowBase},.5)}
.build-panel>h2{color:${T.ink};font:800 clamp(15px,2vw,18px)/1.25 'Manrope',sans-serif}
.build-slots{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.build-slot{min-height:70px;padding:8px;border-radius:15px;display:grid;justify-items:center;align-content:center;gap:2px;background:#F5F7F5;box-shadow:inset 0 0 0 2px #E1E7E4;transition:.3s}
.build-slot.is-filled{background:${T.cyanSoft};box-shadow:inset 0 0 0 2px ${T.cyan}}
.build-slot>b{color:${T.navy};font:900 28px/1 'JetBrains Mono',monospace}
.build-slot>span{color:${T.cyan};font:900 12px 'JetBrains Mono',monospace}
.build-slot>em{color:${T.ink3};font-size:9px;font-style:normal;font-weight:800}
.build-tiles{display:grid;gap:8px}
.tile-row{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.tile{min-height:46px;padding:6px;border:0;border-radius:12px;color:${T.navy};background:#F5F7F5;cursor:pointer;font:900 15px 'JetBrains Mono',monospace;transition:.22s}
.tile:hover:not(:disabled){transform:translateY(-2px);background:#EDF3F1}
.tile.picked{color:#fff;background:${T.cyan}}
.tile.right{color:#fff;background:${T.success}}
.tile.bad{color:${T.warn};background:${T.warnSoft}}
.tile.wide{min-height:50px;font-size:16px}
.build-feedback-slot{min-height:88px}

/* --- s5: bog'lanish tasmalari --------------------------------------------- */
.relation-layout{width:min(820px,100%);padding:16px;display:grid;grid-template-rows:auto auto auto;gap:12px;overflow:hidden;border-radius:19px;background:rgba(255,255,255,.95);box-shadow:0 14px 30px -26px rgba(${T.shadowBase},.5)}
.relation-head{display:grid;gap:8px}
.relation-base{display:grid;grid-template-columns:minmax(90px,auto) minmax(0,1fr) auto;align-items:center;gap:10px}
.relation-base>span{color:${T.ink2};font-size:12px;font-weight:850}
.relation-base>i{height:15px;border-radius:999px;overflow:hidden;background:#E4EAE7}
.relation-base>i>em{display:block;height:100%;border-radius:999px;background:${T.cyan}}
.relation-base>b{color:${T.navy};font:900 13px 'JetBrains Mono',monospace}
.relation-lead{color:${T.ink2};font-size:12px;font-weight:750}
.relation-rows{display:grid;grid-template-rows:auto auto;gap:11px;overflow:hidden}
.relation-row{padding:12px 14px;border-radius:16px;display:grid;grid-template-columns:minmax(0,1fr) minmax(80px,.7fr) auto;align-items:center;gap:12px;background:#F5F7F5;transition:background .35s ease}
.relation-row.is-done{background:${T.successSoft}}
.relation-text{min-width:0;display:grid;gap:3px}
.relation-text>b{color:${T.navy};font-size:14px;font-weight:900}
.relation-text>span{color:${T.ink2};font-size:12px;line-height:1.25}
.relation-bar{height:14px;border-radius:999px;overflow:hidden;background:#E4EAE7}
.relation-bar>i{display:block;height:100%;border-radius:999px;background:${T.cyan};transition:width .55s cubic-bezier(.2,.9,.3,1)}
.relation-bar>i.plus{background:${T.success}}
.relation-bar>i.minus{background:${T.lime}}
.relation-pick{display:flex;gap:7px}
.relation-pick>button{min-width:100px;min-height:44px;padding:0 12px;border:0;border-radius:12px;color:${T.navy};background:#FFFFFF;cursor:pointer;font-size:12px;font-weight:850;box-shadow:0 8px 18px -14px rgba(${T.shadowBase},.6)}
.relation-pick>button:hover:not(:disabled){color:#fff;background:${T.cyan}}
.relation-result{display:flex;align-items:center;gap:9px}
.relation-result>i{width:32px;height:32px;border-radius:10px;display:grid;place-items:center;color:#fff;font:900 17px 'JetBrains Mono',monospace;font-style:normal}
.relation-result>i.minus{background:${T.accent}}
.relation-result>i.plus{background:${T.success}}
.relation-result>strong{color:${T.navy};font:900 15px 'JetBrains Mono',monospace}
.relation-note{color:${T.warn};font-size:11px;font-weight:800}

/* --- s7: xato qatorini topish --------------------------------------------- */
.repair-layout{width:min(740px,100%);display:grid;grid-template-rows:auto auto;gap:11px;overflow:hidden}
.repair-sheet{padding:16px;display:grid;align-content:start;gap:9px;overflow:hidden;border-radius:19px;background:rgba(255,255,255,.96);box-shadow:0 14px 30px -26px rgba(${T.shadowBase},.5)}
.repair-head{display:flex;align-items:baseline;justify-content:space-between;gap:10px}
.repair-lead{color:${T.ink2};font-size:12px;font-weight:800}
.repair-row{min-height:48px;padding:11px 14px;border:0;border-radius:13px;display:grid;grid-template-columns:26px minmax(0,1fr);align-items:center;gap:11px;background:#F5F7F5;cursor:pointer;text-align:left;transition:.25s}
.repair-row:hover:not(:disabled){transform:translateX(3px);background:#EDF3F1}
.repair-row>b{width:24px;height:24px;border-radius:8px;display:grid;place-items:center;color:${T.cyan};background:${T.cyanSoft};font:900 10px 'JetBrains Mono',monospace}
.repair-row>span{color:${T.navy};font:800 14px/1.25 'JetBrains Mono',monospace;overflow-wrap:anywhere}
.repair-row.is-found{background:${T.warnSoft};box-shadow:inset 4px 0 ${T.warn}}
.repair-row.is-found>b{color:#fff;background:${T.warn}}
.repair-row.is-ruled{opacity:.42}
.repair-fix{padding:10px 12px;border-radius:12px;display:grid;gap:3px;background:${T.successSoft};box-shadow:inset 4px 0 ${T.success};animation:soft-rise .4s ease both}
.repair-fix>b{color:${T.success};font:900 9px 'JetBrains Mono',monospace;letter-spacing:.1em;text-transform:uppercase}
.repair-fix>span{color:${T.navy};font:900 14px 'JetBrains Mono',monospace;overflow-wrap:anywhere}
.repair-feedback-slot{min-height:88px}

/* --- s8: taxmin oralig'i --------------------------------------------------- */
.band-layout{width:min(680px,100%);padding:16px;display:grid;grid-template-rows:auto auto auto;gap:13px;overflow:hidden;border-radius:19px;background:rgba(255,255,255,.95);box-shadow:0 14px 30px -26px rgba(${T.shadowBase},.5)}
.band-task{display:grid;gap:6px;justify-items:center;text-align:center}
.band-task>p{color:${T.ink2};font-size:12px;font-weight:800}
.band-line{display:grid;gap:12px}
.band-track{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.band{min-height:66px;border:0;border-radius:16px;color:${T.navy};background:#F5F7F5;cursor:pointer;font:900 clamp(16px,2.2vw,19px) 'JetBrains Mono',monospace;box-shadow:inset 0 0 0 2px #E4EAE7;transition:.25s}
.band:hover:not(:disabled){transform:translateY(-3px);background:${T.cyanSoft}}
.band.is-right{color:#fff;background:${T.success};box-shadow:inset 0 0 0 2px ${T.success}}
.band.is-wrong{color:${T.warn};background:${T.warnSoft};box-shadow:inset 0 0 0 2px ${T.warn}}
.band-exact{justify-self:center;padding:7px 15px 7px 6px;border:1px solid rgba(34,122,83,.18);border-radius:15px;display:flex;align-items:center;gap:10px;background:linear-gradient(135deg,#FFFFFF,${T.successSoft});box-shadow:0 12px 26px -20px rgba(34,122,83,.5);animation:soft-rise .42s ease both}
.band-exact>span{color:${T.ink2};font-size:12px;font-weight:800}
.band-exact>strong{color:${T.navy};font:900 15px 'JetBrains Mono',monospace}
.band-note{min-height:38px}
.band-note>p{padding:9px 12px;border-radius:11px;font-size:12px;font-weight:800;line-height:1.3}
.band-note>p.is-right{color:${T.success};background:${T.successSoft}}
.band-note>p.is-wrong{color:${T.warn};background:${T.warnSoft}}

/* --- s10: qoidani yig'ish -------------------------------------------------- */
.rule-layout{width:min(820px,100%);display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;overflow:hidden}
.rule-slots,.rule-bank{min-width:0;padding:15px;display:grid;align-content:start;gap:9px;overflow:hidden;border-radius:19px;background:rgba(255,255,255,.95);box-shadow:0 14px 30px -26px rgba(${T.shadowBase},.5)}
.rule-slot{min-height:52px;padding:10px 12px;border-radius:13px;display:grid;grid-template-columns:26px minmax(0,1fr);align-items:center;gap:9px;background:#F5F7F5;transition:.3s}
.rule-slot>b{width:24px;height:24px;border-radius:8px;display:grid;place-items:center;color:#fff;background:${T.ink3};font:900 10px 'JetBrains Mono',monospace}
.rule-slot>span{color:${T.ink};font-size:12px;font-weight:800;line-height:1.22}
.rule-slot.is-right{background:${T.successSoft}}
.rule-slot.is-right>b{background:${T.success}}
.rule-slot.is-wrong{background:${T.warnSoft}}
.rule-slot.is-wrong>b{background:${T.warn}}
.rule-bank-list{display:grid;gap:8px}
.rule-bank-list>button{min-height:52px;padding:10px 12px;border:0;border-radius:12px;color:${T.navy};background:#F5F7F5;cursor:pointer;text-align:left;font-size:12px;font-weight:800;line-height:1.22;transition:.22s}
.rule-bank-list>button:hover:not(:disabled){transform:translateY(-2px);background:${T.cyanSoft}}
.rule-bank-list>button:disabled{color:${T.ink3};background:#F1F4F2;text-decoration:line-through;cursor:default}
.rule-status{min-height:52px}
.rule-memo{padding:7px 12px 7px 6px;border:1px solid rgba(34,122,83,.18);border-radius:15px;display:grid;grid-template-columns:51px minmax(0,1fr);align-items:center;gap:9px;background:linear-gradient(135deg,#FFFFFF,${T.successSoft});box-shadow:0 12px 26px -20px rgba(34,122,83,.5);animation:soft-rise .4s ease both}
.rule-memo>div{min-width:0;display:grid;gap:3px}
.rule-memo b{color:${T.success};font-size:11px;font-weight:900}
.rule-memo span{color:${T.navy};font:900 12px 'JetBrains Mono',monospace}
.rule-warn{padding:9px 12px;border-radius:11px;color:${T.warn};background:${T.warnSoft};font-size:11px;font-weight:800}

/* --- s11: uchta tez savol -------------------------------------------------- */
.rapid-layout{width:min(700px,100%);padding:16px;display:grid;grid-template-rows:auto auto;gap:12px;overflow:hidden;border-radius:19px;background:rgba(255,255,255,.95);box-shadow:0 14px 30px -26px rgba(${T.shadowBase},.5)}
.rapid-head{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:11px}
.rapid-dots{display:flex;gap:5px}
.rapid-dots>i{width:34px;height:6px;border-radius:999px;background:#E1E7E4}
.rapid-dots>i.is-now{background:${T.cyan}}
.rapid-dots>i.is-done{background:${T.success}}
.rapid-count{color:${T.ink3};font:900 10px 'JetBrains Mono',monospace}
.rapid-body{display:grid;grid-template-rows:auto auto auto;gap:11px;overflow:hidden}
.rapid-prompt{color:${T.navy};font:800 clamp(17px,2.4vw,21px)/1.25 'Manrope',sans-serif}
.rapid-tiles{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}
.rapid-feedback-slot{min-height:88px}
.rapid-done{display:grid;gap:11px;overflow:hidden}
.rapid-done-head{padding:7px 12px 7px 6px;border:1px solid rgba(34,122,83,.18);border-radius:15px;display:grid;grid-template-columns:51px minmax(0,1fr) auto;align-items:center;gap:10px;background:linear-gradient(135deg,#FFFFFF,${T.successSoft});box-shadow:0 12px 26px -20px rgba(34,122,83,.5)}
.rapid-done-head>span{color:${T.ink2};font-size:13px;font-weight:800}
.rapid-done-head>strong{color:${T.navy};font:900 17px 'JetBrains Mono',monospace}
.rapid-log{margin:0;padding:0;display:grid;gap:8px;list-style:none}
.rapid-log>li{min-height:48px;padding:10px 13px;border-radius:13px;display:grid;grid-template-columns:22px minmax(0,1fr) auto;align-items:center;gap:11px;background:#F5F7F5}
.rapid-log>li>i{width:20px;height:20px;border-radius:7px;display:grid;place-items:center;color:#fff;background:${T.success};font:900 9px 'JetBrains Mono',monospace;font-style:normal}
.rapid-log>li>span{color:${T.ink2};font-size:12px;font-weight:750;line-height:1.2}
.rapid-log>li>em{color:${T.navy};font:900 15px 'JetBrains Mono',monospace;font-style:normal;white-space:nowrap}

/* --- s12: ikki yo'lni solishtirish ------------------------------------------ */
.route-layout{width:min(720px,100%);display:grid;grid-template-rows:auto auto auto;gap:12px;overflow:hidden}
.route-head{display:grid;justify-items:center;gap:5px;text-align:center}
.route-pair{display:grid;grid-template-columns:1fr 1fr;gap:13px;overflow:hidden}
.route-card{min-width:0;padding:15px;border:0;border-radius:18px;display:grid;align-content:start;gap:9px;background:rgba(255,255,255,.96);cursor:pointer;text-align:left;box-shadow:0 14px 30px -26px rgba(${T.shadowBase},.55);transition:.25s}
.route-card:hover:not(:disabled){transform:translateY(-3px)}
.route-name{color:${T.cyan};font:900 11px 'JetBrains Mono',monospace;letter-spacing:.06em;text-transform:uppercase}
.route-card>em{padding:10px 12px;border-radius:11px;color:${T.navy};background:#F5F7F5;font:800 13px/1.25 'JetBrains Mono',monospace;font-style:normal;overflow-wrap:anywhere}
.route-card.is-best{background:${T.successSoft};box-shadow:inset 0 0 0 2px ${T.success}}
.route-card.is-best>em{background:#FFFFFF}
.route-card.is-other{background:${T.cyanSoft};box-shadow:inset 0 0 0 2px ${T.cyan}}
.route-card.is-other>em{background:#FFFFFF}
.route-note{min-height:48px}
.route-note>p{padding:10px 13px;border-radius:12px;font-size:12px;font-weight:800;line-height:1.3}
.route-note>p.route-hint{color:${T.ink2};background:#FFFFFF}
.route-verdict{min-height:72px;padding:7px 13px 7px 6px;border-radius:15px;display:grid;grid-template-columns:51px minmax(0,1fr);align-items:center;gap:9px;box-shadow:0 12px 26px -20px rgba(34,122,83,.4);animation:soft-rise .4s ease both}
.route-verdict>span{font-size:13px;font-weight:750;line-height:1.35}
.route-verdict.is-right{border:1px solid rgba(34,122,83,.18);color:${T.success};background:linear-gradient(135deg,#FFFFFF,${T.successSoft})}
.route-verdict.is-other{border:1px solid rgba(22,143,163,.2);color:${T.cyan};background:linear-gradient(135deg,#FFFFFF,${T.cyanSoft})}


/* --- TIPOGRAFIKA: asosiy matndan boshqa hamma yozuv guruh bo'yicha bir xil --- */
/* 1. Ikkilamchi matn (izoh, tavsif, holat) — Manrope, 13 px */
.lesson-root :is(.relation-lead,.relation-note,.relation-text>span,.relation-text>b,
.step-list>li>span,.rule-slot>span,.rule-memo>b,.rule-warn,
.band-task>p,.band-note>p,.route-note>p,
.repair-lead,.track-step-now>span,.track-rule,
.bird-row>span,.rapid-log>li>span,.rapid-done-head>span,
.split-done>span,.band-exact>span,.cable-card>span,.order-card>span,
.build-slot>em,.unit-hot>em,.solution-text,.bird-row.is-unknown>i>em),
.lesson-root .options .option,.lesson-root .options .option>span,
.lesson-root .route-verdict>span,.lesson-root .relation-pick>button,
.lesson-root .rule-bank-list>button{
  font-family:'Manrope',system-ui,sans-serif;font-size:15px;font-weight:750;line-height:1.35;letter-spacing:0;text-transform:none}
/* 2. Micro-yorliq (bo'lim nomi) — JetBrains Mono, 10 px */
.lesson-root :is(.panel-label,.route-name,.proof-label,.rapid-count,.window-scale){
  font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:900;line-height:1.1;letter-spacing:.13em;text-transform:uppercase}
/* 3. Hisob yozuvi (formula, qator, natija) — JetBrains Mono, 14 px */
.lesson-root :is(.track-frame>p,.repair-row>span,.route-card>em,.solution-formula){
  font-family:'JetBrains Mono',monospace;font-size:14px;font-weight:800;line-height:1.3;letter-spacing:0}
/* 4. Yirik son va o'lchov qiymatlari — shrift bitta, o'lcham roli bo'yicha */
.lesson-root :is(.task-expression,.tile,.band,.unit-col>span,.unit-col>strong,.unit-rest,
.unit-chunk,.unit-hot,.unit-carry,.build-slot>b,.build-slot>span,.bird-row>b,
.relation-result>strong,.relation-base>b,.rapid-log>li>em,.store-total,.rule-memo>span,
.cable-card>strong,.order-card>strong,.split-done>strong,.band-exact>strong,
.rapid-done-head>strong,.window-bar>i>em,.store-bar>i>em,.repair-row>b,.rule-slot>b,
.step-list>li>b,.track-step-now>b,.rapid-log>li>i){
  font-family:'JetBrains Mono',monospace}
/* Konsol yorliqlari o'zaro bir xil o'lchamda */
.lesson-root :is(.dispatch-node,.dispatch-state){font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:900;letter-spacing:.08em}
@media(max-width:639.98px){
  .lesson-root :is(.relation-lead,.relation-note,.relation-text>span,.relation-text>b,
  .step-list>li>span,.rule-slot>span,.rule-memo>b,.rule-warn,
  .band-task>p,.band-note>p,.route-note>p,
  .repair-lead,.track-step-now>span,.track-rule,
  .bird-row>span,.rapid-log>li>span,.rapid-done-head>span,
  .split-done>span,.band-exact>span,.cable-card>span,.order-card>span,
  .build-slot>em,.unit-hot>em,.solution-text,.bird-row.is-unknown>i>em),
  .lesson-root .options .option,.lesson-root .options .option>span,
  .lesson-root .route-verdict>span,.lesson-root .relation-pick>button,
  .lesson-root .rule-bank-list>button{font-size:13px;line-height:1.3}
  .lesson-root :is(.track-frame>p,.repair-row>span,.route-card>em,.solution-formula){font-size:12px}
  .lesson-root :is(.panel-label,.route-name,.proof-label,.rapid-count,.window-scale){font-size:9px}
}
/* --- Yakuniy slayd: kompozitsiya va tokenlar etalon Dars01 dan ---------- */
.finale-screen{height:100%;min-height:0;display:grid;grid-template-rows:auto minmax(0,1fr);gap:12px;overflow:hidden;animation:page-in .45s cubic-bezier(.16,1,.3,1) both}
.finale-heading{width:min(840px,100%);margin:0 auto;padding:12px 16px;border:1px solid rgba(255,91,53,.17);border-radius:17px;background:linear-gradient(100deg,rgba(255,91,53,.09),transparent 48%),rgba(255,255,255,.9);box-shadow:0 13px 28px -24px rgba(255,91,53,.72)}
.finale-heading>span{display:flex;align-items:center;gap:7px;color:${T.accent};font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:900;letter-spacing:.12em}
.finale-heading>span>i{font-size:8px;font-style:normal}
.finale-heading h1{margin-top:3px;color:${T.navy};font-family:'Source Serif 4',Georgia,serif;font-size:clamp(21px,3vw,28px);line-height:1.08}
.finale-heading p{margin-top:3px;color:${T.ink2};line-height:1.32}
.finale-body{width:min(840px,100%);min-height:0;margin:0 auto;display:grid;grid-template-columns:minmax(0,1.08fr) minmax(0,.92fr);align-items:start;gap:12px;overflow:hidden}
.finale-column{min-width:0;display:grid;align-content:start;gap:9px}
.finale-mastery{display:grid;gap:7px}
.finale-mastery>span{min-width:0;padding:9px 11px;border:1px solid rgba(22,143,163,.11);border-radius:12px;display:grid;grid-template-columns:24px minmax(0,1fr);align-items:center;gap:9px;color:${T.ink2};background:rgba(255,255,255,.85);opacity:.28;transition:opacity .4s ease}
.finale-mastery>span.is-open{opacity:1}
.finale-mastery>span>i{width:23px;height:23px;border-radius:8px;display:grid;place-items:center;color:#fff;background:${T.cyan};font:900 10px 'JetBrains Mono',monospace;font-style:normal}
.finale-proof,.finale-bridge{padding:10px 12px;border-radius:13px;display:grid;gap:3px;opacity:0;transform:translateY(6px);transition:opacity .42s ease,transform .42s ease}
.finale-proof.is-open,.finale-bridge.is-open{opacity:1;transform:none}
.finale-proof{background:${T.successSoft};box-shadow:inset 4px 0 ${T.success}}
.finale-proof>b{color:${T.success};font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:900;letter-spacing:.11em}
.finale-proof>span{color:${T.navy};font:900 14px 'JetBrains Mono',monospace;overflow-wrap:anywhere}
.finale-bridge{grid-template-columns:26px minmax(0,1fr);align-items:center;column-gap:9px;background:${T.accentSoft};box-shadow:inset 4px 0 ${T.accent}}
.finale-bridge>i{grid-row:1/3;width:26px;height:26px;border-radius:9px;display:grid;place-items:center;color:#fff;background:${T.accent};font-style:normal;font-weight:900}
.finale-bridge>b{color:${T.accent};font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:900;letter-spacing:.11em}
.finale-bridge>span{color:${T.navy};font-weight:800}
.finale-actions{min-width:0;display:grid;align-content:start;gap:9px}
.reward-stage{position:relative;width:100%;min-height:116px;padding:12px 82px 11px 67px;border-radius:17px;display:flex;flex-direction:column;justify-content:center;gap:4px;overflow:hidden;color:#FFFFFF;background:radial-gradient(circle at 82% 20%,rgba(255,194,60,.26),transparent 30%),linear-gradient(135deg,#173B52,#0E6978);box-shadow:0 24px 50px -30px rgba(14,33,44,.8)}
.reward-locked{filter:saturate(.72)}
.reward-bit{position:absolute;right:3px;bottom:2px;width:72px;height:90px}
.reward-bit>.g1-char,.reward-bit>svg{width:100%;height:100%;display:block}
.reward-medal{position:absolute;left:11px;top:50%;width:44px;height:44px;margin-top:-22px;border:3px solid rgba(255,255,255,.58);border-radius:50%;display:grid;place-items:center;color:#5A3A00;background:linear-gradient(145deg,#FFE284,#FFC23C);box-shadow:0 0 0 8px rgba(255,255,255,.08),0 15px 30px -15px rgba(0,0,0,.6);font-size:19px}
.reward-kicker{color:#A8EAF0;font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:900;letter-spacing:.13em}
.reward-stage h2{color:#FFFFFF;font-family:'Source Serif 4',Georgia,serif;font-size:clamp(16px,2.2vw,21px);line-height:1.05}
.reward-score{align-self:flex-start;margin-top:5px;padding:5px 9px;border-radius:10px;display:flex;align-items:center;gap:7px;background:rgba(255,255,255,.10)}
.reward-score>strong{color:#FFE284;font-family:'JetBrains Mono',monospace}
.reward-score>span{color:rgba(255,255,255,.72);font-size:9px}
.g4-title-claim{min-height:50px;padding:0 18px;border:0;border-radius:15px;color:#fff;background:${T.accent};cursor:pointer;font-family:'Manrope',system-ui,sans-serif;font-size:15px;font-weight:900;box-shadow:0 14px 28px -18px rgba(255,91,53,.9);transition:.25s}
.g4-title-claim:disabled{color:${T.ink3};background:#EDF0ED;box-shadow:none;cursor:default}
.finale-pending{color:${T.ink3};font-size:11px;font-weight:800;text-align:center}
@media(max-width:639.98px){
  .finale-screen{gap:8px}
  .finale-body{grid-template-columns:1fr;gap:7px}
  .finale-column,.finale-actions{gap:6px}
  .finale-heading{padding:8px 10px;border-radius:14px}
  .finale-heading h1{font-size:19px}
  .finale-heading p{font-size:11px;line-height:1.28;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden}
  .finale-mastery{gap:5px}
  .finale-mastery>span{padding:5px 8px;grid-template-columns:19px minmax(0,1fr);gap:7px;border-radius:10px}
  .finale-mastery>span>i{width:19px;height:19px;font-size:9px}
  .finale-mastery>span>p{font-size:12px;line-height:1.25}
  .finale-proof,.finale-bridge{padding:6px 9px;border-radius:11px}
  .finale-proof>span{font-size:12px}
  .finale-bridge>span{font-size:12px}
  .finale-bridge>i{width:22px;height:22px}
  .finale-bridge{grid-template-columns:22px minmax(0,1fr)}
  .reward-stage{min-height:82px;padding:7px 58px 7px 50px;border-radius:14px}
  .reward-stage h2{font-size:15px}
  .reward-kicker{font-size:9px}
  .reward-score{margin-top:3px;padding:3px 7px}
  .reward-medal{left:8px;width:34px;height:34px;margin-top:-17px;border-width:2px;font-size:14px}
  .reward-bit{width:52px;height:65px}
  .g4-title-claim{min-height:44px;font-size:13px}
}
@media(max-width:639.98px){
  .finale-heading h1{font-size:18px}
  .finale-heading p{-webkit-line-clamp:1}
  .finale-mastery>span>p{font-size:11px;line-height:1.22}
  .finale-mastery>span{min-height:0}
  .finale-proof>b,.finale-bridge>b{font-size:8px}
}
@keyframes carry-in{from{opacity:0;transform:translateY(-9px) scale(.86)}to{opacity:1;transform:none}}
@keyframes soft-rise{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:none}}
@keyframes solution-hop{0%{transform:translateY(0)}42%{transform:translateY(-6px)}100%{transform:translateY(0)}}

/* Xuk ekrani (flex ustun): to'rt variant bitta qatorda, izoh ixcham */
.hook-stack>.question{align-content:start;padding:10px 12px;grid-template-rows:auto auto}
.hook-stack .hook-feedback-slot{min-height:0}
.hook-stack .options-four{grid-template-columns:repeat(4,minmax(0,1fr))}
.hook-stack .options-four .option{min-height:52px;grid-template-columns:1fr;justify-items:center;align-content:center;gap:3px;text-align:center;font-size:15px}
.hook-stack .options-four .option>b{display:none}
.lesson-root .hook-stack .feedback[data-g4-role~="feedback-frame"]{min-height:72px!important;grid-template-columns:54px minmax(0,1fr)!important}
.lesson-root .hook-stack .feedback[data-g4-role~="feedback-frame"] [data-g4-role="feedback-bit"]{width:54px!important;height:66px!important}
.lesson-root .hook-stack .feedback[data-g4-role~="feedback-frame"] p{font-size:14px!important}

@media(max-width:639.98px){
  .split-layout,.build-layout,.rule-layout{grid-template-columns:1fr;grid-template-rows:auto auto}
  .split-model,.split-steps,.relation-layout,.band-layout,.rapid-layout,.repair-sheet,.rule-slots,.rule-bank,.build-panel{padding:10px;border-radius:14px}
  .mini-frame{padding:11px 12px;border-radius:14px;gap:8px}
  .task-expression{font-size:18px}
  .task-layout>.question{padding:10px 11px}
  .unit-col{min-height:96px}
  .unit-col>strong{font-size:30px}
  .step-list{gap:6px}
  .step-list>li{min-height:44px;padding:7px 9px;grid-template-columns:22px minmax(0,1fr);gap:8px}
  .step-list>li>b{width:21px;height:21px;font-size:9px}
  .step-list>li>span{font-size:12px}
  .track-pair{grid-template-columns:1fr;gap:7px}
  .track-frame{padding:9px;border-radius:13px;gap:6px}
  .track-frame>p{min-height:0;padding:6px 8px;font-size:11px}
  .track-steps{grid-template-columns:1fr;gap:7px}
  .track-rule{max-width:none;padding:7px 9px;font-size:11px}
  .build-slots{gap:7px}
  .build-slot{min-height:56px}
  .build-slot>b{font-size:22px}
  .tile{min-height:44px;font-size:13px}
  .relation-row{grid-template-columns:1fr;gap:8px;padding:9px 10px}
  .relation-pick>button{min-width:0;flex:1;font-size:11px}
  .band{min-height:54px;font-size:14px}
  .route-pair{grid-template-columns:1fr;gap:8px}
  .route-card{padding:10px;border-radius:14px;gap:6px}
  .route-card>em{padding:6px 8px;font-size:11px}
  .rapid-tiles{grid-template-columns:1fr;gap:6px}
  .rapid-prompt{font-size:15px}
  .rapid-log>li{min-height:40px;padding:7px 9px;gap:8px}
  .rapid-log>li>span{font-size:11px}
  .rapid-log>li>em{font-size:13px}
  .solution-bit{width:44px;height:55px;flex:0 0 44px}
  :is(.split-done,.track-rule,.rule-memo,.rapid-done-head,.route-verdict){grid-template-columns:44px minmax(0,1fr)}
  .split-done,.rapid-done-head{grid-template-columns:44px minmax(0,1fr) auto}
  .track-rule,.route-verdict{min-height:62px}
  .rule-status{min-height:0}
  .rule-memo{padding:7px 9px;gap:2px}
  .rule-memo>b,.rule-memo>span{font-size:10px}
  .rule-slot{min-height:44px;padding:7px 9px}
  .rule-bank-list>button{min-height:44px;padding:8px 9px;font-size:11px}
  .dispatch-body{grid-template-columns:1fr;gap:6px}
  .cable-card{padding:6px 7px;gap:3px}
  .cable-card>strong{font-size:13px}
  .order-card{padding:7px 8px}
  .order-card>strong{font-size:14px}
  .repair-row{min-height:42px;padding:8px 10px}
  .repair-row>span{font-size:12px}
  .lesson-root .hook-stack>.question .options-four{grid-template-columns:repeat(2,minmax(0,1fr))!important}
  .hook-stack .options-four .option{min-height:46px;font-size:13px}
}
@media(max-height:700px){
  .unit-col{min-height:110px}
  .band{min-height:58px}
  .build-slot{min-height:60px}
  .step-list>li{min-height:48px}
  .route-card{padding:11px}
  .repair-row{min-height:44px}
}
@media(prefers-reduced-motion:reduce){
  .unit-carry,.unit-chunk,.split-done,.band-exact,.rule-memo,.route-verdict,.solution-bit{animation:none}
  .track-frame>p{transition:none}
}
/* --- Yakuniy ekran: Dars01 etaloni (Dars21 dan ko'chirildi) --------------- */
/* --- Yakuniy slayd (etalon Dars01 tuzilishi) ---------------------------- */
.option-answer-dismiss{animation: answer-option-dismiss .46s cubic-bezier(.4,0,.7,1) var(--answer-exit-delay, 0ms) both;}
.option-answer-confirm{animation: answer-option-confirm .62s cubic-bezier(.16,1,.3,1) .08s both;}
.summary-stack{gap: 12px;}
.reward-stage{position: relative;
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
  transition: transform .5s ease, box-shadow .5s ease;}
.reward-locked{filter: saturate(.72);}
.reward-unlocked{transform: translateY(-2px);
  box-shadow: 0 28px 58px -27px rgba(22,143,163,.8);}
.reward-bit{position: absolute;
  right: 24px;
  bottom: 7px;
  width: 92px;
  height: 115px;}
.reward-bit .g1-char{width: 100%; height: 100%;}
.reward-unlocked .reward-bit{animation: g4bitfloat 2.8s ease-in-out 4;}
.reward-medal{position: absolute;
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
  font-size: 30px;}
.reward-kicker{color: #A8EAF0;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: .13em;}
.reward-stage h1{max-width: 590px;
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: clamp(21px, 3vw, 30px);
  line-height: 1.05;}
.reward-stage > p{max-width: 580px;
  color: rgba(255,255,255,.78);
  font-size: 12px;
  line-height: 1.4;}
.reward-score{align-self: flex-start;
  margin-top: 5px;
  padding: 5px 9px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 7px;
  background: rgba(255,255,255,.10);}
.reward-score strong{color: #FFE284; font-family: 'JetBrains Mono', monospace;}
.reward-score span{color: rgba(255,255,255,.72); font-size: 9px;}
.reward-confetti{position: absolute; inset: 0; pointer-events: none;}
.reward-confetti i{position: absolute;
  top: -16px;
  width: 7px;
  height: 12px;
  border-radius: 2px;
  animation: reward-confetti 2.4s linear 3;}
.reward-confetti i:nth-child(4n+1){background: #FFC23C;}
.reward-confetti i:nth-child(4n+2){background: #FF5B35;}
.reward-confetti i:nth-child(4n+3){background: #77E1EA;}
.reward-confetti i:nth-child(4n){background: #95C93D;}
.reward-confetti i:nth-child(1){left: 8%; animation-delay: -.3s;}
.reward-confetti i:nth-child(2){left: 17%; animation-delay: -1.1s;}
.reward-confetti i:nth-child(3){left: 29%; animation-delay: -.7s;}
.reward-confetti i:nth-child(4){left: 41%; animation-delay: -1.7s;}
.reward-confetti i:nth-child(5){left: 52%; animation-delay: -.2s;}
.reward-confetti i:nth-child(6){left: 63%; animation-delay: -1.3s;}
.reward-confetti i:nth-child(7){left: 73%; animation-delay: -.8s;}
.reward-confetti i:nth-child(8){left: 84%; animation-delay: -1.9s;}
.reward-confetti i:nth-child(9){left: 12%; animation-delay: -2s;}
.reward-confetti i:nth-child(10){left: 36%; animation-delay: -1.4s;}
.reward-confetti i:nth-child(11){left: 68%; animation-delay: -.5s;}
.reward-confetti i:nth-child(12){left: 91%; animation-delay: -1.6s;}
.summary-action-layout{min-height: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  align-items: stretch;}
.summary-rule-items{display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: 1fr;
  gap: 6px;}
.summary-rule-items > span{min-width: 0;
  padding: 7px;
  border: 1px solid rgba(22,143,163,.11);
  border-radius: 11px;
  display: grid;
  grid-template-columns: 22px 1fr;
  align-items: center;
  gap: 6px;
  color: ${T.ink2};
  background: rgba(255,255,255,.82);}
.reflection-card > .summary-question-kicker,
.reflection-card > .summary-question,
.reflection-card > .summary-question-stem,
.reflection-card > .reflection-options,
.reflection-card > .reflection-resolution,
.reflection-card > .feedback{flex-shrink: 0;}
.reflection-resolution{display: grid;
  gap: 7px;}
.summary-card h2{margin-bottom: 8px; font-size: 14px;}
.summary-card ul{padding-left: 17px; display: grid; gap: 5px; color: ${T.ink2}; font-size: 12px; line-height: 1.35;}
.summary-question-kicker{margin-bottom: 4px;
  color: ${T.accent};
  font-family: 'JetBrains Mono', monospace;
  font-size: 8px;
  font-weight: 900;
  letter-spacing: .1em;}
.summary-card .summary-question{margin-bottom: 4px;
  color: ${T.navy};
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: 15px;
  line-height: 1.18;}
.summary-question-stem{margin-bottom: 7px !important;
  color: ${T.ink2};
  font-size: 10px;
  line-height: 1.3;}
.reflection-options{max-height: 180px;
  display: grid;
  gap: 6px;
  overflow: hidden;
  opacity: 1;
  transition:
    max-height .75s cubic-bezier(.22,.8,.3,1) .48s,
    opacity .28s ease .52s,
    margin .75s cubic-bezier(.22,.8,.3,1) .48s;}
.reflection-options-solved{max-height: 0;
  margin-block: 0;
  opacity: 0;
  pointer-events: none;}
.reflection-option{min-height: 34px;
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
  font-weight: 700;}
.reflection-option > span{width: 21px;
  height: 21px;
  flex: 0 0 21px;
  border-radius: 7px;
  display: grid;
  place-items: center;
  color: ${T.cyan};
  background: ${T.cyanSoft};
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  font-weight: 900;}
.reflection-wrong{color: ${T.warn}; background: ${T.warnSoft};}
.reflection-card .feedback-card{min-height: 62px;
  padding: 5px 10px 5px 6px;}
.reflection-card .g4-bit-reaction-figure{width: 44px;
  height: 54px;
  flex-basis: 44px;}
.reflection-card .g4-bit-reaction-copy{font-size: 14px;}
.final-mission-heading{width: min(840px, 100%);
  margin: 0 auto;
  padding: 12px 16px;
  border: 1px solid rgba(255,91,53,.17);
  border-radius: 17px;
  background:
    linear-gradient(100deg, rgba(255,91,53,.09), transparent 48%),
    rgba(255,255,255,.9);
  box-shadow: 0 13px 28px -24px rgba(255,91,53,.72);}
.final-mission-heading > span{display: flex;
  align-items: center;
  gap: 7px;
  color: ${T.accent};
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: .12em;}
.final-mission-heading > span i{font-size: 8px;
  animation: final-marker-pulse 1.5s ease-in-out 3;}
.final-mission-heading h1{margin-top: 3px;
  color: ${T.navy};
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: clamp(21px, 3vw, 28px);
  line-height: 1.08;}
.final-mission-heading p{margin-top: 3px;
  color: ${T.ink2};
  font-size: 11px;
  line-height: 1.32;}
.summary-final-layout{width: min(840px, 100%);
  margin: 0 auto;
  grid-template-columns: minmax(0, 1fr);
  align-items: start;}
.summary-card{min-width: 0;
  height: 100%;
  padding: 13px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  background: rgba(255,255,255,.92);
  box-shadow: 0 12px 26px -21px rgba(${T.shadowBase},.5);}
.reflection-card > .summary-question-kicker,
.reflection-card > .summary-question,
.reflection-card > .summary-question-stem,
.reflection-card > .reflection-options,
.reflection-card > .reflection-resolution,
.reflection-card > .feedback{flex-shrink: 0;}
.final-question-card{height: auto;
  border: 2px solid rgba(255,91,53,.22);
  box-shadow:
    inset 0 4px 0 rgba(255,91,53,.88),
    0 18px 38px -28px rgba(255,91,53,.7);}
.final-question-card .summary-question-kicker{min-height: 25px;
  margin-bottom: 8px;
  padding: 4px 6px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #FFFFFF;
  background: linear-gradient(90deg, ${T.accent}, #FF7658);}
.final-question-card .summary-question-kicker > b{margin-left: auto;
  padding: 3px 6px;
  border-radius: 999px;
  color: #7D250F;
  background: rgba(255,255,255,.76);
  font-size: 7px;
  letter-spacing: .08em;}
.final-question-card .summary-question{font-size: clamp(17px, 2.4vw, 22px);
  line-height: 1.18;}
.summary-support-column{min-width: 0;
  display: grid;
  gap: 9px;}
.summary-rules-disclosure{min-width: 0;
  border: 1px solid rgba(22,143,163,.2);
  border-radius: 16px;
  overflow: hidden;
  background: rgba(255,255,255,.94);
  box-shadow: 0 14px 30px -24px rgba(22,143,163,.72);}
.summary-rules-toggle{width: 100%;
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
  text-align: left;}
.summary-rules-toggle > span{min-width: 55px;
  padding: 7px 8px;
  border-radius: 10px;
  color: #FFFFFF;
  background: ${T.cyan};
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 900;
  text-align: center;}
.summary-rules-toggle > div{min-width: 0; display: grid; gap: 2px;}
.summary-rules-toggle strong{font-size: 13px; line-height: 1.2;}
.summary-rules-toggle small{color: ${T.cyan}; font-size: 9px; font-weight: 800;}
.summary-rules-toggle > i{color: ${T.cyan};
  font-size: 24px;
  font-style: normal;
  transform: rotate(0);
  transition: transform .55s cubic-bezier(.16,1,.3,1);}
.summary-rules-open .summary-rules-toggle > i{transform: rotate(180deg);}
.summary-rules-panel{max-height: 0;
  padding: 0 9px;
  overflow: hidden;
  opacity: 0;
  transform: translateY(-7px);
  transition:
    max-height .65s cubic-bezier(.22,.8,.3,1),
    padding .65s cubic-bezier(.22,.8,.3,1),
    opacity .4s ease,
    transform .55s ease;}
.summary-rules-open .summary-rules-panel{max-height: 260px;
  padding: 0 9px 9px;
  opacity: 1;
  transform: translateY(0);}
.summary-rules-panel .summary-rule-items > span{padding: 6px;
  grid-template-columns: 20px 1fr;
  gap: 5px;}
.summary-rules-panel .summary-rule-items > span > i{width: 20px;
  height: 20px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: ${T.cyan};
  background: ${T.cyanSoft};
  font-family: 'JetBrains Mono', monospace;
  font-size: 8px;
  font-style: normal;}
.summary-rules-panel .summary-rule-items p{font-size: 9px; line-height: 1.22;}
.reward-stage-compact{width: 100%;
  min-height: 116px;
  margin: 0;
  padding: 12px 82px 11px 67px;
  border-radius: 17px;
  gap: 4px;}
.reward-stage-compact .reward-medal{left: 11px;
  width: 44px;
  height: 44px;
  border-width: 3px;
  font-size: 19px;}
.reward-stage-compact .reward-bit{right: 3px;
  bottom: 2px;
  width: 72px;
  height: 90px;}
.reward-stage-compact h2{font-family: 'Source Serif 4', Georgia, serif;
  font-size: clamp(16px, 2.2vw, 21px);
  line-height: 1.05;}
/* --- Yakuniy savol ramkasi: etalon o'lchamlari (override qatlamidan ustun) --- */
.lesson-root .final-question-card .summary-question{font-size: clamp(17px, 2.4vw, 22px); line-height: 1.18;}
.lesson-root .reflection-card .reflection-option{font-size: 11px; font-weight: 700;}
.lesson-root .reflection-card .reflection-option > span{font-size: 9px;}
/* Javob berilmaganda izoh sloti joy egallamaydi: etalonda ham balandligi nol. */
.lesson-root .reflection-card > .feedback:not(.open){min-height: 0 !important; height: 0; padding: 0 !important; overflow: hidden;}
@media (max-width: 639.98px){
  .lesson-root .final-question-card .summary-question{font-size: 13px; line-height: 1.18;}
  .lesson-root .reflection-card .reflection-option{font-size: 8.5px;}
  .lesson-root .reflection-card .reflection-option > span{font-size: 7px;}
}
@keyframes answer-option-dismiss{from { opacity: 1; transform: translateY(0) scale(1); }
  to { opacity: 0; transform: translateY(-8px) scale(.96); }}
@keyframes answer-option-confirm{0% { transform: translateY(0) scale(1); box-shadow: 0 10px 24px -17px rgba(${T.shadowBase},.44); }
  45% { transform: translateY(-7px) scale(1.025); box-shadow: 0 0 0 6px rgba(34,122,83,.10); }
  100% { transform: translateY(-3px) scale(1); box-shadow: 0 12px 26px -17px rgba(34,122,83,.45); }}
@keyframes reward-confetti{to { transform: translateY(230px) rotate(460deg); }}
@keyframes final-marker-pulse{50% { opacity: .45; transform: scale(.8); }}
/* Qoida paneli ochilganda ham ekrandan chiqib ketmaydi */
.summary-rules-open .summary-rules-panel{max-height:170px}
.summary-rule-items>span>p{font-size:12px;line-height:1.3}
@media(max-width:639.98px){
  .summary-rules-open .summary-rules-panel{max-height:130px}
}
/* --- Shrift rollari: etalon Dars01 bo'yicha ------------------------------- */
/* Sarlavha — Source Serif 4. Matn va javob variantlari — Manrope.
   Yorliq, son va o'lchov — JetBrains Mono. Bitta chip ichida ikkita shrift
   aralashmaydi: yorliq ham, qiymat ham Mono bo'ladi. */
.lesson-root .tri-reads>b,
.lesson-root .switch-reads>b,
.lesson-root .scale-zone,
.lesson-root .junction-cell,
.lesson-root .form-row>i,
.lesson-root .bin-card>span,
.lesson-root .prop-col>b,
.lesson-root .prop-col>em,
.lesson-root .prop-row>i,
.lesson-root .prop-row>u,
.lesson-root .nest-outer>span,
.lesson-root .nest-inner>span,
.lesson-root .nest-outside>span,
.lesson-root .cable-card>span,
.lesson-root .order-card>span,
.lesson-root .plan-card>span,
.lesson-root .desk-cards>.cable-card>span,
.lesson-root .desk-cards>.order-card>span{font-family:'JetBrains Mono',monospace;letter-spacing:.01em}
/* Javob variantlari to'liq asosiy matn shriftida — ichida son bo'lsa ham */
.lesson-root .option,
.lesson-root .option>span,
.lesson-root .option em,
.lesson-root .option strong,
.lesson-root .reflection-option,
.lesson-root .tile,
.lesson-root .band,
.lesson-root .route-card,
.lesson-root .repair-row>span,
.lesson-root .rule-slot>span,
.lesson-root .rule-bank-list button,
.lesson-root .step-list>li>span{font-family:'Manrope',system-ui,sans-serif}
/* Yechim ramkasidagi qiymat ikkinchi qatorga tushadi, blokni kengaytirmaydi */
.lesson-root .split-done{grid-template-columns:51px minmax(0,1fr);row-gap:1px}
.lesson-root .split-done>strong{grid-column:2;white-space:normal;font-size:14px;line-height:1.2}
/* Telefonda qadamlar ro'yxati ixcham: uzun inglizcha matnda ham ekranga sig'adi */
@media(max-width:639.98px){
  .lesson-root .split-steps{padding:7px}
  .lesson-root .step-list{gap:4px}
  .lesson-root .step-list>li{min-height:32px;padding:4px 7px}
  .lesson-root .step-list>li>span{font-size:13px;line-height:1.22}
}
/* Qolgan chiplar: yorliq ham qiymat bilan bitta shriftda */
.lesson-root .plot-reads>b,
.lesson-root .grid-reads>b,
.lesson-root .twin-card>b,
.lesson-root .twin-card>span,
.lesson-root .tool-card>span,
.lesson-root .plot-row>i,
.lesson-root .plot-figure>span{font-family:'JetBrains Mono',monospace;letter-spacing:.01em}
/* Telefonda variant tugmalari ixchamroq: uzun matnda ham ekranga sig'adi */
@media(max-width:639.98px){
  .lesson-root .option{min-height:44px;padding:8px 10px}
}

`;
// ---------------------------------------------------------------------------
// DARSGA XOS CHIZMALAR VA EKRANLAR
// Har ekranning o'z tuzilishi bor: bitta umumiy "chapda rasm, o'ngda qadamlar"
// qolipi ishlatilmaydi.
// ---------------------------------------------------------------------------

// Xuk sahnasi: tungi dispetcherlik konsoli. Etalon Dars01 dagi to'q ko'k
// freym ichida turadi, shuning uchun o'z foni yo'q.
const DispatchConsole = ({ c, resolved }) => {
  const t = useT();
  return (
    <div className={`dispatch-visual ${resolved ? 'is-resolved' : ''}`}>
      <div className="dispatch-head">
        <span className="dispatch-node"><i />{t(c.nodeName)}</span>
        <span className="dispatch-state">{t(c.stateBad)}</span>
      </div>
      <div className="dispatch-body">
        <div className="cable-pair">
          <div className="cable-card">
            <span>{t(c.labelA)}</span>
            <strong>{t(c.coilA)}</strong>
            <i className="cable-line a" />
          </div>
          <b className="cable-plus">+</b>
          <div className="cable-card">
            <span>{t(c.labelB)}</span>
            <strong>{t(c.coilB)}</strong>
            <i className="cable-line b" />
          </div>
        </div>
        <div className="order-card">
          <span>{t(c.labelOrder)}</span>
          <strong>{t(c.botOrder)}</strong>
          <i className="order-flag" />
        </div>
      </div>
    </div>
  );
};

// Ustunli yozuv: metr va santimetr ustunlari. `carry` bo'lsa santimetrdan
// bir butun metr ajralib, metr ustuniga ko'chadi.
const UnitColumns = ({ big, small, unitBig, unitSmall, step, onSplit, splitLabel }) => {
  const t = useT();
  return (
    <div className="unit-columns" data-g4-role="visual-frame">
      <div className={`unit-col ${step > 1 ? 'is-lifted' : ''}`}>
        <span>{t(unitBig)}</span>
        <strong>{step > 1 ? big.after : big.before}</strong>
        {step === 2 && <i className="unit-carry">+1</i>}
      </div>
      <div className="unit-col">
        <span>{t(unitSmall)}</span>
        {step === 0 && (
          <button type="button" className="unit-hot" onClick={onSplit}>
            {small.before}
            <em>{t(splitLabel)}</em>
          </button>
        )}
        {step === 1 && (
          <div className="unit-split">
            <button type="button" className="unit-chunk" onClick={onSplit}>100</button>
            <span className="unit-rest">{small.after}</span>
          </div>
        )}
        {step === 2 && <strong>{small.after}</strong>}
      </div>
    </div>
  );
};

// Yechim freymidagi Bit. O'lchov va jest etalon Dars01 dagidek.
const SolutionBit = () => (
  <span className="solution-bit"><BitSVG state="nod" /></span>
);

// Bosqichlar ro'yxati: ochilgan qadam yonadi, qolganlari kutadi.
const StepList = ({ steps, step }) => {
  const t = useT();
  return (
    <ol className="step-list">
      {steps.map((item, index) => (
        <li key={index} className={index < step ? 'is-done' : index === step ? 'is-active' : ''}>
          <b>{index + 1}</b>
          <span>{t(item)}</span>
        </li>
      ))}
    </ol>
  );
};

function HookScreen({ screen, storedAnswer, onAnswer, onPrev, onNext }) {
  const t = useT();
  const c = CONTENT.s0;
  const audio = useNarration(c.audio, screen);
  const [picked, setPicked] = useState(storedAnswer?.studentAnswerIndex ?? null);
  const [attempts, setAttempts] = useState(storedAnswer?.attempts ?? 0);
  const canAnswer = isAudioReady(audio);
  const choose = (index) => {
    if (!canAnswer || picked !== null) return;
    const nextAttempts = attempts + 1;
    setPicked(index);
    setAttempts(nextAttempts);
    audio.pushOneOff(t(c.feedback));
    onAnswer({
      stage: SCREEN_META[screen].scope, screenIdx: screen,
      question: t(c.question), options: c.options.map((option) => t(option)),
      correctIndex: null, correctAnswer: null,
      studentAnswerIndex: index, studentAnswer: t(c.options[index]),
      correct: true, firstTry: storedAnswer?.firstTry ?? true, attempts: nextAttempts,
    });
  };
  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} canAdvance={picked !== null}>
      <div className="stack hook-stack" data-g4-screen="hook">
        <Heading c={c} hook />
        <h2 className="hook-question-prompt" data-g4-role="hook-question">{t(c.question)}</h2>
        <section className="model-card hook-card" data-g4-role="hook-scene">
          <div className="hook-scene-visual" data-g4-role="visual-frame">
            <DispatchConsole c={c} resolved={picked !== null} />
            <div className="hook-frame-bit" data-g4-role="hook-bit"><BitSVG state="think" /></div>
          </div>
        </section>
        <section className="question hook-question" data-g4-role="answer-card" aria-live="polite">
          <h2>{t(c.question)}</h2>
          <div className="options options-four">
            {c.options.map((option, index) => (
              <button
                type="button" key={index} data-g4-role="answer-card"
                className={`option ${picked === index ? 'picked' : ''}`}
                disabled={!canAnswer || picked !== null}
                onClick={() => choose(index)}
              >
                <b>{String.fromCharCode(65 + index)}</b>
                <span>{t(option)}</span>
              </button>
            ))}
          </div>
          <div className="feedback-slot hook-feedback-slot">
            {picked !== null && (
              <div className="feedback neutral" data-g4-role="feedback-frame" data-g4-feedback="diagnostic">
                <p>{t(c.feedback)}</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </Stage>
  );
}

function HiddenUnitScreen({ screen, onPrev, onNext }) {
  const t = useT();
  const c = CONTENT.s1;
  const [step, setStep] = useState(0);
  const audio = useGuidedNarration(c.audio, screen, step);
  const ready = isAudioReady(audio);
  const split = () => {
    if (!ready || step > 1) return;
    const next = step + 1;
    setStep(next);
    audio.speakStep(next);
  };
  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} canAdvance={step === 2}>
      <div className="stack">
        <Heading c={c} />
        <section className="split-layout">
          <div className="split-model">
            <span className="panel-label">{t(c.lead)}</span>
            <UnitColumns
              big={{ before: c.startM, after: c.finalM }}
              small={{ before: c.startC, after: c.finalC }}
              unitBig={{ uz: 'm', ru: 'м', en: 'm' }}
              unitSmall={{ uz: 'cm', ru: 'см', en: 'cm' }}
              step={step} onSplit={split} splitLabel={c.tapHint}
            />
            {step === 2 && (
              <div className="split-done">
                <SolutionBit />
                <span>{t(c.doneLabel)}</span>
                <strong>{c.finalM} m {c.finalC} cm</strong>
              </div>
            )}
          </div>
          <div className="split-steps">
            <StepList steps={c.steps} step={step} />
          </div>
        </section>
      </div>
    </Stage>
  );
}

// Umumiy tanlov ekrani. Chapdagi chizma har ekranda boshqacha: uni `visual`
// propi beradi, shuning uchun beshta tanlov ekrani bir xil ko'rinmaydi.
function ChoiceScreen({ screen, storedAnswer, onAnswer, onPrev, onNext, visual }) {
  const t = useT();
  const c = CONTENT[`s${screen}`];
  const audio = useNarration(c.audio, screen);
  const canAnswer = isAudioReady(audio);
  const answerOrdinal = ANSWER_ORDINAL_BY_SCREEN[screen];
  const optionOrder = buildOptionOrder(c.options.length, c.correctIndex, LESSON_META.lessonId, answerOrdinal);
  const [picked, setPicked] = useState(storedAnswer?.studentAnswerIndex ?? null);
  const [attempts, setAttempts] = useState(storedAnswer?.attempts ?? 0);
  const [flashKey, flashWrong] = useWrongFlash();
  const correct = picked === c.correctIndex;
  const choose = (index) => {
    if (!canAnswer || correct || flashKey !== null) return;
    const ok = index === c.correctIndex;
    const nextAttempts = attempts + 1;
    const nextWrong = ok ? [] : [index];
    setPicked(index);
    setAttempts(nextAttempts);
    if (!ok) flashWrong(index);
    playSfx(ok ? 'correct' : 'wrong');
    audio.pushOneOff(t(ok ? c.audio.on_correct : c.audio.on_wrong[index]));
    onAnswer({
      stage: SCREEN_META[screen].scope, screenIdx: screen,
      question: t(c.question), options: c.options.map((option) => t(option)),
      correctIndex: c.correctIndex, correctAnswer: t(c.options[c.correctIndex]),
      studentAnswerIndex: index, studentAnswer: t(c.options[index]),
      correct: ok,
      firstTry: storedAnswer?.firstTry === false ? false : nextAttempts === 1 && ok,
      attempts: nextAttempts, wrongChoices: nextWrong, solved: ok,
    });
  };
  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} canAdvance={correct}>
      <div className="stack">
        <Heading c={c} />
        <section className="task-layout">
          <div className="task-model">
            {visual}
          </div>
          <div className="question" aria-live="polite">
            <h2>{t(c.question)}</h2>
            <div className="options options-four">
              {optionOrder.map((sourceIndex, displayIndex) => {
                const state = sourceIndex === c.correctIndex && correct ? 'right' : '';
                return (
                  <button
                    type="button" key={sourceIndex}
                    data-g4-source-index={sourceIndex}
                    data-g4-correct={sourceIndex === c.correctIndex ? 'true' : 'false'}
                    className={`option ${state}`}
                    data-g4-wrong-flash={flashKey === sourceIndex ? 'true' : undefined}
                    data-g4-answer-dim={correct && sourceIndex !== c.correctIndex ? 'true' : undefined}
                    disabled={!canAnswer || correct || flashKey !== null}
                    onClick={() => choose(sourceIndex)}
                  >
                    <b>{String.fromCharCode(65 + displayIndex)}</b>
                    <span>{t(c.options[sourceIndex])}</span>
                  </button>
                );
              })}
            </div>
            <div className="feedback-slot question-feedback-slot">
              {picked !== null && (correct ? (
                <div className="feedback open correct" data-g4-role="feedback-frame bit-answer-comment" data-g4-feedback={'solution'}>
                  <span className="feedback-bit" data-g4-role="feedback-bit"><BitSVG state={correct ? "nod" : "awkward"} /></span>
                  <p data-g4-role="bit-answer-comment">
                    <b className="proof-label">{t(SOLUTION_LABEL)}</b>
                    <em className="solution-formula">{t(c.proof)}</em>
                    <span className="solution-text">{t(c.feedback[picked])}</span>
                  </p>
                </div>
              ) : (
                <div className="feedback open wrong" data-g4-role="feedback-frame" data-g4-feedback={'wrong'}>
                  <p>{t(c.feedback[picked])}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Stage>
  );
}

// s2 — ustunli qo'shish chizmasi.
const ColumnSum = ({ c }) => {
  const t = useT();
  return (
    <div className="mini-frame" data-g4-role="visual-frame">
      <span className="panel-label">{t(c.taskNote)}</span>
      <strong className="task-expression">{t(c.task)}</strong>
    </div>
  );
};

// s6 — uch qushning massa tasmasi.
const BirdBars = ({ c }) => {
  const t = useT();
  const s5 = CONTENT.s5;
  return (
    <div className="mini-frame" data-g4-role="visual-frame">
      <span className="panel-label">{t(c.taskNote)}</span>
      <div className="bird-bars">
        <div className="bird-row"><span>{t(s5.baseLabel)}</span><i style={{ width: '64%' }} /><b>{t(s5.baseValue)}</b></div>
        <div className="bird-row"><span>{t(s5.bars[0].who)}</span><i className="b" style={{ width: '36%' }} /><b>{t(s5.bars[0].result)}</b></div>
        <div className="bird-row is-sum"><span>{t(c.sumLabel)}</span><i className="c" style={{ width: '100%' }} /><b>{t(c.task).split('=')[1]}</b></div>
        <div className="bird-row is-unknown"><span>{t(c.thirdLabel)}</span><i className="q"><em>{t(c.thirdPhrase)}</em></i><b>?</b></div>
      </div>
    </div>
  );
};

// s9 — taxmin oralig'i eslatmasi.
const EstimateRecall = ({ c }) => {
  const t = useT();
  return (
    <div className="mini-frame" data-g4-role="visual-frame">
      <strong className="task-expression small">{t(c.task)}</strong>
    </div>
  );
};

// s13 — tungi oyna shkalasi.
const WindowBar = ({ c }) => {
  const t = useT();
  return (
    <div className="mini-frame" data-g4-role="visual-frame">
      <span className="panel-label">{t(c.task)}</span>
      <div className="window-bar">
        <i className="job a" style={{ width: '30%' }}><em>45</em></i>
        <i className="job b" style={{ width: '46.7%' }}><em>70</em></i>
        <i className="job c" style={{ width: '16.6%' }}><em>25</em></i>
        <i className="job free" style={{ width: '6.7%' }} />
      </div>
      <div className="window-scale"><span>0</span><span>150 min</span></div>
    </div>
  );
};

// s14 — ombor hisoboti tasmasi.
const StoreBar = ({ c }) => {
  const t = useT();
  return (
    <div className="mini-frame" data-g4-role="visual-frame">
      <span className="panel-label">{t(c.task)}</span>
      <div className="store-bar">
        <i className="used"><em>?</em></i>
        <i className="left"><em>7 m 70 cm</em></i>
      </div>
      <div className="store-total">12 m 50 cm</div>
    </div>
  );
};

function ThreeStepScreen({ screen, onPrev, onNext }) {
  const t = useT();
  const c = CONTENT.s3;
  const [step, setStep] = useState(0);
  const audio = useGuidedNarration(c.audio, screen, step);
  const ready = isAudioReady(audio);
  const last = c.rows.length - 1;
  const advance = () => {
    if (!ready || step >= last) return;
    const next = step + 1;
    setStep(next);
    audio.speakStep(next);
  };
  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} canAdvance={step >= last}>
      <div className="stack">
        <Heading c={c} />
        <section className="track-layout">
          <div className="track-pair">
            <div className="track-frame">
              <span className="panel-label">{t(c.leftLabel)}</span>
              {c.rows.map((row, index) => (
                <p key={index} className={index <= step ? 'show' : ''}>{t(row.left)}</p>
              ))}
            </div>
            <div className="track-frame is-accent">
              <span className="panel-label">{t(c.rightLabel)}</span>
              {c.rows.map((row, index) => (
                <p key={index} className={index <= step ? 'show' : ''}>{t(row.right)}</p>
              ))}
            </div>
          </div>
          <div className="track-steps">
            <div className="track-step-now"><b>{step + 1}</b><span>{t(c.rows[step].step)}</span></div>
            {step < last
              ? <button type="button" className="btn-white-accent step-button" disabled={!ready} onClick={advance}>{t(STEP_LABEL)} →</button>
              : <div className="track-rule"><SolutionBit /><span>{t(c.ruleNote)}</span></div>}
          </div>
        </section>
      </div>
    </Stage>
  );
}

function TileBuildScreen({ screen, storedAnswer, onAnswer, onPrev, onNext }) {
  const t = useT();
  const c = CONTENT.s4;
  const audio = useNarration(c.audio, screen);
  const canAnswer = isAudioReady(audio);
  const [values, setValues] = useState(storedAnswer?.correct ? c.slots.map((slot) => slot.answer) : [null, null]);
  const [checked, setChecked] = useState(storedAnswer?.correct === true);
  const [message, setMessage] = useState(null);
  const [attempts, setAttempts] = useState(storedAnswer?.attempts ?? 0);
  const solved = checked && values.every((value, index) => value === c.slots[index].answer);
  const filled = values.every((value) => value !== null);
  const pick = (slotIndex, value) => {
    if (!canAnswer || solved) return;
    setValues((previous) => previous.map((item, index) => (index === slotIndex ? value : item)));
    setMessage(null);
    setChecked(false);
  };
  const check = () => {
    if (!filled || !canAnswer || solved) return;
    const ok = values.every((value, index) => value === c.slots[index].answer);
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    setChecked(true);
    const text = ok ? c.okText : values[0] !== c.slots[0].answer ? c.wrongT : c.wrongQ;
    setMessage(text);
    playSfx(ok ? 'correct' : 'wrong');
    audio.pushOneOff(t(ok ? c.audio.on_correct : c.audio.on_wrong));
    onAnswer({
      stage: SCREEN_META[screen].scope, screenIdx: screen,
      question: t(c.question), correctAnswer: c.slots.map((slot) => slot.answer).join(' '),
      studentAnswer: values.join(' '), correct: ok,
      firstTry: storedAnswer?.firstTry === false ? false : nextAttempts === 1 && ok,
      attempts: nextAttempts, solved: ok,
    });
  };
  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} canAdvance={solved}>
      <div className="stack">
        <Heading c={c} />
        <section className="build-layout">
          <div className="mini-frame" data-g4-role="visual-frame">
            <span className="panel-label">{t(c.taskNote)}</span>
            <strong className="task-expression">{t(c.task)}</strong>
          </div>
          <div className="build-panel" aria-live="polite">
            <h2>{t(c.question)}</h2>
            <div className="build-slots">
              {c.slots.map((slot, slotIndex) => (
                <div key={slot.key} className={`build-slot ${values[slotIndex] !== null ? 'is-filled' : ''}`}>
                  <b>{values[slotIndex] === null ? '?' : values[slotIndex]}</b>
                  <span>{t(slotIndex === 0 ? c.unitT : c.unitQ)}</span>
                  <em>{t(slot.label)}</em>
                </div>
              ))}
            </div>
            <div className="build-tiles">
              {c.slots.map((slot, slotIndex) => (
                <div key={slot.key} className="tile-row">
                  {slot.tiles.map((tile) => (
                    <button
                      type="button" key={tile}
                      className={`tile ${values[slotIndex] === tile ? 'picked' : ''}`}
                      disabled={!canAnswer || solved}
                      onClick={() => pick(slotIndex, tile)}
                    >
                      {tile} {t(slotIndex === 0 ? c.unitT : c.unitQ)}
                    </button>
                  ))}
                </div>
              ))}
            </div>
            <button type="button" className="btn-white-accent check-wide" disabled={!filled || !canAnswer || solved} onClick={check}>
              {t(CHECK_LABEL)}
            </button>
            <div className="feedback-slot build-feedback-slot">
              {message && (solved ? (
                <div className="feedback open correct" data-g4-role="feedback-frame bit-answer-comment" data-g4-feedback={'solution'}>
                  <span className="feedback-bit" data-g4-role="feedback-bit"><BitSVG state="nod" /></span>
                  <p data-g4-role="bit-answer-comment">
                    <b className="proof-label">{t(SOLUTION_LABEL)}</b>
                    <em className="solution-formula">{t(c.proof)}</em>
                    <span className="solution-text">{t(message)}</span>
                  </p>
                </div>
              ) : (
                <div className="feedback open wrong" data-g4-role="feedback-frame" data-g4-feedback={'wrong'}>
                  <p>{t(message)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Stage>
  );
}

function RelationBarsScreen({ screen, onPrev, onNext }) {
  const t = useT();
  const c = CONTENT.s5;
  const [solvedBars, setSolvedBars] = useState([]);
  const step = solvedBars.length;
  const audio = useGuidedNarration(c.audio, screen, step);
  const ready = isAudioReady(audio);
  const assign = (barIndex, sign) => {
    if (!ready || solvedBars.includes(barIndex) || sign !== c.bars[barIndex].sign) return;
    const next = [...solvedBars, barIndex];
    setSolvedBars(next);
    audio.speakStep(next.length);
  };
  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} canAdvance={solvedBars.length === c.bars.length}>
      <div className="stack">
        <Heading c={c} />
        <section className="relation-layout">
          <div className="relation-head">
            <span className="panel-label">{t(c.source)}</span>
            <div className="relation-base"><span>{t(c.baseLabel)}</span><i><em style={{ width: '51%' }} /></i><b>{t(c.baseValue)}</b></div>
            <p className="relation-lead">{t(c.lead)}</p>
          </div>
          <div className="relation-rows">
            {c.bars.map((bar, index) => {
              const done = solvedBars.includes(index);
              return (
                <div key={index} className={`relation-row ${done ? 'is-done' : ''}`}>
                  <div className="relation-text"><b>{t(bar.who)}</b><span>{t(bar.phrase)}</span></div>
                  <div className="relation-bar"><i className={bar.sign} style={{ width: done ? bar.pct + '%' : '0%' }} /></div>
                  {done ? (
                    <div className="relation-result">
                      <i className={bar.sign === 'plus' ? 'plus' : 'minus'}>{bar.sign === 'plus' ? '+' : '−'}</i>
                      <strong>{t(bar.result)}</strong>
                    </div>
                  ) : (
                    <div className="relation-pick">
                      <button type="button" disabled={!ready} onClick={() => assign(index, 'minus')}>− {t(c.signMinus)}</button>
                      <button type="button" disabled={!ready} onClick={() => assign(index, 'plus')}>+ {t(c.signPlus)}</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <p className="relation-note">{t(c.keywordTrap)}</p>
        </section>
      </div>
    </Stage>
  );
}

function RowRepairScreen({ screen, storedAnswer, onAnswer, onPrev, onNext }) {
  const t = useT();
  const c = CONTENT.s7;
  const audio = useNarration(c.audio, screen);
  const canAnswer = isAudioReady(audio);
  const [picked, setPicked] = useState(storedAnswer?.studentAnswerIndex ?? null);
  const [flashRow, flashWrongRow] = useWrongFlash();
  const [attempts, setAttempts] = useState(storedAnswer?.attempts ?? 0);
  const correct = picked === c.answerIndex;
  const tap = (index) => {
    if (!canAnswer || correct || flashRow !== null) return;
    const ok = index === c.answerIndex;
    const nextAttempts = attempts + 1;
    const nextWrong = ok ? [] : [index];
    setPicked(index);
    setAttempts(nextAttempts);
    if (!ok) flashWrongRow(index);
    playSfx(ok ? 'correct' : 'wrong');
    audio.pushOneOff(t(ok ? c.audio.on_correct : c.audio.on_wrong));
    onAnswer({
      stage: SCREEN_META[screen].scope, screenIdx: screen,
      question: t(c.lead), correctAnswer: t(c.rows[c.answerIndex]),
      studentAnswerIndex: index, studentAnswer: t(c.rows[index]),
      correct: ok,
      firstTry: storedAnswer?.firstTry === false ? false : nextAttempts === 1 && ok,
      attempts: nextAttempts, wrongChoices: nextWrong, solved: ok,
    });
  };
  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} canAdvance={correct}>
      <div className="stack">
        <Heading c={c} />
        <section className="repair-layout">
          <div className="repair-sheet" aria-live="polite">
            <div className="repair-head">
              <span className="panel-label">{t(c.source)}</span>
              <span className="repair-lead">{t(c.lead)}</span>
            </div>
            {c.rows.map((row, index) => (
              <button
                type="button" key={index}
                className={`repair-row ${index === c.answerIndex && correct ? 'is-found' : ''}`}
                data-g4-wrong-flash={flashRow === index ? 'true' : undefined}
                data-g4-answer-dim={correct && index !== c.answerIndex ? 'true' : undefined}
                disabled={!canAnswer || correct || flashRow !== null}
                onClick={() => tap(index)}
              >
                <b>{index + 1}</b>
                <span>{t(row)}</span>
              </button>
            ))}
          </div>
          <div className="feedback-slot repair-feedback-slot">
            {picked !== null && (correct ? (
              <div className="feedback open correct" data-g4-role="feedback-frame bit-answer-comment" data-g4-feedback={'solution'}>
                <span className="feedback-bit" data-g4-role="feedback-bit"><BitSVG state="nod" /></span>
                <p data-g4-role="bit-answer-comment">
                  <b className="proof-label">{t(SOLUTION_LABEL)}</b>
                  <em className="solution-formula">{t(c.fix)}</em>
                  <span className="solution-text">{t(c.rowFeedback[picked])}</span>
                </p>
              </div>
            ) : (
              <div className="feedback open wrong" data-g4-role="feedback-frame" data-g4-feedback={'wrong'}>
                <p>{t(c.rowFeedback[picked])}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Stage>
  );
}

function EstimateBandScreen({ screen, onPrev, onNext }) {
  const t = useT();
  const c = CONTENT.s8;
  const [picked, setPicked] = useState(null);
  const solved = picked === c.answerIndex;
  const step = solved ? 2 : picked !== null ? 1 : 0;
  const audio = useGuidedNarration(c.audio, screen, step);
  const ready = isAudioReady(audio);
  const tap = (index) => {
    if (!ready || solved) return;
    setPicked(index);
    audio.speakStep(index === c.answerIndex ? 2 : 1);
  };
  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} canAdvance={solved}>
      <div className="stack">
        <Heading c={c} />
        <section className="band-layout">
          <div className="band-task">
            <strong className="task-expression">{t(c.task)}</strong>
            <p>{t(c.lead)}</p>
          </div>
          <div className="band-line" data-g4-role="visual-frame">
            <div className="band-track">
              {c.bands.map((band, index) => (
                <button
                  type="button" key={index}
                  className={`band ${picked === index ? (index === c.answerIndex ? 'is-right' : 'is-wrong') : ''}`}
                  disabled={!ready || solved}
                  onClick={() => tap(index)}
                >
                  {t(band)}
                </button>
              ))}
            </div>
            {solved && <div className="band-exact"><SolutionBit /><span>{t(c.exactLabel)}</span><strong>{t(c.exact)}</strong></div>}
          </div>
          <div className="band-note" aria-live="polite">
            {picked !== null && <p className={solved ? 'is-right' : 'is-wrong'}>{t(c.bandFeedback[picked])}</p>}
          </div>
        </section>
      </div>
    </Stage>
  );
}

function RuleBuilderScreen({ screen, onPrev, onNext }) {
  const t = useT();
  const c = CONTENT.s10;
  const audio = useNarration(c.audio, screen);
  const ready = isAudioReady(audio);
  const [order, setOrder] = useState([]);
  const [failed, setFailed] = useState(false);
  const size = c.parts.length;
  const solved = order.length === size && order.every((value, index) => value === index);
  const choose = (index) => {
    if (!ready || solved || order.includes(index)) return;
    const next = [...order, index];
    setOrder(next);
    setFailed(next.some((value, place) => value !== place));
  };
  const reset = () => { setOrder([]); setFailed(false); };
  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} canAdvance={solved}>
      <div className="stack">
        <Heading c={c} />
        <section className="rule-layout">
          <div className="rule-slots">
            <span className="panel-label">{t(c.slotLabel)}</span>
            {Array.from({ length: size }, (_, place) => {
              const index = order[place];
              return (
                <div key={place} className={`rule-slot ${index === undefined ? 'is-empty' : index === place ? 'is-right' : 'is-wrong'}`}>
                  <b>{place + 1}</b>
                  <span>{index === undefined ? '' : t(c.parts[index])}</span>
                </div>
              );
            })}
          </div>
          <div className="rule-bank">
            <span className="panel-label">{t(c.bankLabel)}</span>
            <div className="rule-bank-list">
              {c.parts.map((part, index) => (
                <button type="button" key={index} disabled={!ready || order.includes(index) || solved} onClick={() => choose(index)}>
                  {t(part)}
                </button>
              ))}
            </div>
            {order.length > 0 && !solved && (
              <button type="button" className="tiny-action" onClick={reset}>{t(c.resetLabel)}</button>
            )}
            <div className="rule-status" aria-live="polite">
              {solved && <div className="rule-memo"><SolutionBit /><div><b>{t(c.okText)}</b><span>{t(c.memo)}</span></div></div>}
              {!solved && failed && <p className="rule-warn">{t(c.wrongText)}</p>}
            </div>
          </div>
        </section>
      </div>
    </Stage>
  );
}

function RapidConsoleScreen({ screen, storedAnswer, onAnswer, onPrev, onNext }) {
  const t = useT();
  const c = CONTENT.s11;
  const audio = useNarration(c.audio, screen);
  const canAnswer = isAudioReady(audio);
  // Ekranga qaytilganda yopilgan raundlar qayta so'ralmaydi (etalon: storedAnswer).
  const restored = storedAnswer?.solved === true;
  const [round, setRound] = useState(restored ? c.rounds.length : 0);
  const [picked, setPicked] = useState(null);
  const [correctCount, setCorrectCount] = useState(restored ? c.rounds.length : 0);
  const [cleanCount, setCleanCount] = useState(0);
  const [tries, setTries] = useState(0);
  const done = round >= c.rounds.length;
  const current = c.rounds[Math.min(round, c.rounds.length - 1)];
  const solvedRound = picked === current.answer;
  const [flashTile, flashWrongTile] = useWrongFlash();
  const tap = (index) => {
    if (!canAnswer || done || solvedRound || flashTile !== null) return;
    const ok = index === current.answer;
    setPicked(index);
    if (!ok) flashWrongTile(index);
    setTries((value) => value + 1);
    playSfx(ok ? 'correct' : 'wrong');
    audio.pushOneOff(t(ok ? current.ok : current.no));
    if (!ok) return;
    const nextCorrect = correctCount + 1;
    const clean = cleanCount + (tries === 0 ? 1 : 0);
    setCorrectCount(nextCorrect);
    setCleanCount(clean);
    window.setTimeout(() => { setRound((value) => value + 1); setPicked(null); setTries(0); }, 900);
    onAnswer({
      stage: SCREEN_META[screen].scope, screenIdx: screen,
      question: t(c.title), correctAnswer: String(nextCorrect), studentAnswer: String(nextCorrect),
      correct: nextCorrect === c.rounds.length,
      firstTry: clean === c.rounds.length,
      attempts: tries + 1, solved: nextCorrect === c.rounds.length,
    });
  };
  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} canAdvance={done}>
      <div className="stack">
        <Heading c={c} />
        <section className="rapid-layout">
          <div className="rapid-head">
            <span className="panel-label">{t(c.source)}</span>
            <div className="rapid-dots">
              {c.rounds.map((_, index) => <i key={index} className={index < round ? 'is-done' : index === round ? 'is-now' : ''} />)}
            </div>
            <span className="rapid-count">{Math.min(round + 1, c.rounds.length)} / {c.rounds.length} {t(c.counter)}</span>
          </div>
          {done ? (
            <div className="rapid-done">
              <div className="rapid-done-head"><SolutionBit /><span>{t(c.doneText)}</span><strong>{correctCount} / {c.rounds.length}</strong></div>
              <ul className="rapid-log">
                {c.rounds.map((item, index) => (
                  <li key={index}><i>{index + 1}</i><span>{t(item.prompt)}</span><em>{t(item.tiles[item.answer])}</em></li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="rapid-body" aria-live="polite">
              <strong className="rapid-prompt">{t(current.prompt)}</strong>
              <div className="rapid-tiles">
                {current.tiles.map((tile, index) => (
                  <button
                    type="button" key={index}
                    className={`tile wide ${picked === index && index === current.answer ? 'right' : ''}`}
                    data-g4-wrong-flash={flashTile === index ? 'true' : undefined}
                    data-g4-answer-dim={solvedRound && index !== current.answer ? 'true' : undefined}
                    disabled={!canAnswer || solvedRound || flashTile !== null}
                    onClick={() => tap(index)}
                  >
                    {t(tile)}
                  </button>
                ))}
              </div>
              <div className="feedback-slot rapid-feedback-slot">
                {picked !== null && (solvedRound ? (
                  <div className="feedback open correct" data-g4-role="feedback-frame bit-answer-comment" data-g4-feedback={'solution'}>
                    <span className="feedback-bit" data-g4-role="feedback-bit"><BitSVG state="nod" /></span>
                    <p data-g4-role="bit-answer-comment">
                      <b className="proof-label">{t(SOLUTION_LABEL)}</b>
                      <span className="solution-text">{t(current.ok)}</span>
                    </p>
                  </div>
                ) : (
                  <div className="feedback open wrong" data-g4-role="feedback-frame" data-g4-feedback={'wrong'}>
                    <p>{t(current.no)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </Stage>
  );
}

function RouteCompareScreen({ screen, onPrev, onNext }) {
  const t = useT();
  const c = CONTENT.s12;
  const [picked, setPicked] = useState(null);
  const step = picked === null ? 0 : 2;
  const audio = useGuidedNarration(c.audio, screen, step);
  const ready = isAudioReady(audio);
  const choose = (index) => {
    if (!ready || picked !== null) return;
    setPicked(index);
    audio.pushOneOff(t(c.routeFeedback[index]));
  };
  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} canAdvance={picked !== null}>
      <div className="stack">
        <Heading c={c} />
        <section className="route-layout">
          <div className="route-head">
            <strong className="task-expression">{t(c.lead)}</strong>
            <span className="panel-label">{t(c.source)}</span>
          </div>
          <div className="route-pair">
            {c.routes.map((route, index) => (
              <button
                type="button" key={index}
                className={`route-card ${picked === index ? (index === c.answerIndex ? 'is-best' : 'is-other') : ''}`}
                disabled={!ready || picked !== null}
                onClick={() => choose(index)}
              >
                <span className="route-name">{t(route.name)}</span>
                {route.lines.map((line, lineIndex) => <em key={lineIndex}>{t(line)}</em>)}
              </button>
            ))}
          </div>
          <div className="route-note" aria-live="polite">
            {picked === null
              ? <p className="route-hint">{t(c.note)}</p>
              : <div className={`route-verdict ${picked === c.answerIndex ? 'is-right' : 'is-other'}`}><SolutionBit /><span>{t(c.routeFeedback[picked])}</span></div>}
          </div>
        </section>
      </div>
    </Stage>
  );
}

const FINAL_STAGE = bi('YAKUNIY BOSQICH', 'ФИНАЛЬНЫЙ ЭТАП', 'FINAL STAGE');
const FINAL_QUESTION = bi('YAKUNIY SAVOL', 'ФИНАЛЬНЫЙ ВОПРОС', 'FINAL QUESTION');
const ONE_STEP = bi('1 QADAM', '1 ШАГ', '1 STEP');
const RULES_LABEL = bi('Bugungi qoida', 'Правило урока', 'The lesson rule');
const RULES_SHOW = bi('Eslab olish uchun bosing', 'Нажми, чтобы вспомнить', 'Press to remember');
const RULES_HIDE = bi('Qoidalarni yopish', 'Скрыть правила', 'Hide the rules');
const REWARD_WAIT = bi('MUKOFOT KUTILMOQDA', 'НАГРАДА ЖДЁТ', 'THE REWARD AWAITS');
const REWARD_EARNED = bi('UNVON OLINDI', 'ЗВАНИЕ ПОЛУЧЕНО', 'TITLE EARNED');
const REWARD_OPEN = bi('Unvonni oching', 'Открой звание', 'Unlock your title');
const FIRST_TRY_LABEL = bi('birinchi urinishda', 'с первой попытки', 'on the first attempt');

// ---------------------------------------------------------------------------
// YAKUNIY EKRAN — Dars01 etaloni: yakuniy savol, qoidani eslash, ochiladigan
// mukofot. Unvon faqat to'g'ri javobdan keyin ochiladi.
// ---------------------------------------------------------------------------
function FinaleScreen({ screen, c: cProp, answers, storedAnswer, onAnswer, onPrev, finishLesson }) {
  const t = useT();
  const c = cProp ?? CONTENT.s15;
  const audio = useNarration(c.audio, screen);
  /* eslint-disable react-hooks/exhaustive-deps -- CONTENT modul konstantasi: tartib bir marta hisoblanadi */
  const order = useMemo(
    () => buildOptionOrder(c.options.length, c.correctIndex, LESSON_META.lessonId, 9),
    [],
  );
  /* eslint-enable react-hooks/exhaustive-deps */
  const [reflection, setReflection] = useState(storedAnswer?.reflection ?? null);
  const [flashKey, flashWrong] = useWrongFlash();
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
    if (solved || flashKey !== null || !(audio.muted || audio.completed)) return;
    setReflection(sourceIndex);
    const ok = sourceIndex === c.correctIndex;
    if (!ok) flashWrong(sourceIndex);
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
    <Stage
      screen={screen} audio={audio} onPrev={onPrev} onNext={finish}
      nextDisabled={!solved || finished || revealRequested} canFinish={solved} finish
    >
      <div className="screen-stack summary-stack">
        <G4TitleReveal active={revealRequested} title={c.rewardTitle} onComplete={() => setRevealRequested(false)} />
        <div className="final-mission-heading">
          <span><i aria-hidden="true">◆</i> {t(FINAL_STAGE)}</span>
          <h1>{t(c.title)}</h1>
          <p>{t(c.lead)}</p>
        </div>
        <div className="summary-action-layout summary-final-layout">
          <div className="summary-card reflection-card final-question-card">
            <span className="summary-question-kicker">
              <i aria-hidden="true">◇</i>
              {t(FINAL_QUESTION)}
              <b>{t(ONE_STEP)}</b>
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
                  className={`reflection-option ${solved && sourceIndex === c.correctIndex ? 'option-answer-confirm' : ''} ${solved && sourceIndex !== c.correctIndex ? 'option-answer-dismiss' : ''}`}
                  data-g4-wrong-flash={flashKey === sourceIndex ? 'true' : undefined}
                  disabled={solved || flashKey !== null}
                  onClick={() => chooseReflection(sourceIndex)}
                >
                  <span>{String.fromCharCode(65 + displayIndex)}</span>
                  {t(c.options[sourceIndex])}
                </button>
              ))}
            </div>
            <div className="feedback-slot question-feedback-slot">
              {solved && (
                <div className="feedback open correct" data-g4-role="feedback-frame bit-answer-comment" data-g4-feedback={'solution'}>
                  <span className="feedback-bit" data-g4-role="feedback-bit"><BitSVG state="nod" /></span>
                  <p data-g4-role="bit-answer-comment">
                    <b className="proof-label">{t(SOLUTION_LABEL)}</b>
                    <em className="solution-formula">{t(c.proof)}</em>
                    <span className="solution-text">{t(c.resolution)}</span>
                  </p>
                </div>
              )}
              {reflection !== null && !solved && (
                <div className="feedback open wrong" data-g4-role="feedback-frame" data-g4-feedback={'wrong'}>
                  <p>{t(c.feedback[reflection])}</p>
                </div>
              )}
            </div>
          </div>
          <div className="summary-support-column">
            <div className={`summary-rules-disclosure ${rulesOpen ? 'summary-rules-open' : ''}`}>
              <button type="button" className="summary-rules-toggle" aria-expanded={rulesOpen} onClick={() => setRulesOpen((open) => !open)}>
                <span aria-hidden="true">3 &rarr; |</span>
                <div>
                  <strong>{t(RULES_LABEL)}</strong>
                  <small>{t(rulesOpen ? RULES_HIDE : RULES_SHOW)}</small>
                </div>
                <i aria-hidden="true">&#8964;</i>
              </button>
              <div className="summary-rules-panel" aria-hidden={!rulesOpen}>
                <div className="summary-rule-items">
                  {c.frames.slice(0, 3).map((item, index) => (
                    <span key={t(item)}>
                      <i>{index + 1}</i>
                      <p>{t(item)}</p>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <G4TitleCard title={c.rewardTitle} solved={solved} firstTry={firstTryUnits} total={totalUnits} />
          </div>
        </div>
      </div>
    </Stage>
  );
}


const Screen0 = (props) => <HookScreen {...props} />;
const Screen1 = (props) => <HiddenUnitScreen {...props} />;
const Screen2 = (props) => <ChoiceScreen {...props} visual={<ColumnSum c={CONTENT.s2} />} />;
const Screen3 = (props) => <ThreeStepScreen {...props} />;
const Screen4 = (props) => <TileBuildScreen {...props} />;
const Screen5 = (props) => <RelationBarsScreen {...props} />;
const Screen6 = (props) => <ChoiceScreen {...props} visual={<BirdBars c={CONTENT.s6} />} />;
const Screen7 = (props) => <RowRepairScreen {...props} />;
const Screen8 = (props) => <EstimateBandScreen {...props} />;
const Screen9 = (props) => <ChoiceScreen {...props} visual={<EstimateRecall c={CONTENT.s9} />} />;
const Screen10 = (props) => <RuleBuilderScreen {...props} />;
const Screen11 = (props) => <RapidConsoleScreen {...props} />;
const Screen12 = (props) => <RouteCompareScreen {...props} />;
const Screen13 = (props) => <ChoiceScreen {...props} visual={<WindowBar c={CONTENT.s13} />} />;
const Screen14 = (props) => <ChoiceScreen {...props} visual={<StoreBar c={CONTENT.s14} />} />;
const Screen15 = (props) => <FinaleScreen {...props} />;
const SCREENS = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15];

export default function Grade4Dars31({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished, previewMode }) {
  const showPreviewControls = langProp === undefined || langProp === null;
  const preview = previewMode ?? showPreviewControls;
  const initialLang = normalizeLang(langProp);
  const [previewLang, setPreviewLang] = useState(initialLang);
  const lang = showPreviewControls ? normalizeLang(previewLang) : initialLang;
  configureLesson({
    ttsApiBase: ttsApiBase || '', voiceGender: voiceGender || 'f',
    correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', previewMode: preview,
  });
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [finalState, setFinalState] = useState({ titleClaimed: false });
  const [startedAt] = useState(() => Date.now());
  const finished = useRef(false);
  const recordAnswer = useCallback((answer) => setAnswers((previous) => {
    const next = [...previous];
    const old = previous[answer.screenIdx];
    next[answer.screenIdx] = { ...answer, firstTry: old ? old.firstTry : answer.firstTry };
    return next;
  }), []);
  const finishLesson = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    const scored = SCREEN_META.map((meta, index) => (meta.scored ? index : null)).filter((index) => index !== null);
    const firstTryCorrect = scored.filter((index) => answers[index]?.firstTry === true).length;
    const payload = {
      lessonId: LESSON_META.lessonId,
      lessonTitle: LESSON_META.lessonTitle[lang],
      studentName: studentName || null,
      durationSec: Math.floor((Date.now() - startedAt) / 1000),
      totalQuestions: scored.length,
      correctAnswers: firstTryCorrect,
      scorePercent: Math.round(firstTryCorrect / scored.length * 100),
      finalScore: firstTryCorrect,
      finalTotal: scored.length,
      passed: firstTryCorrect / scored.length >= 0.6,
      firstTryStats: { total: scored.length, firstTryCorrect },
      attemptsTotal: scored.reduce((sum, index) => sum + (answers[index]?.attempts ?? 0), 0),
      skillTags: LESSON_META.skillTags,
      answers: answers.filter(Boolean),
    };
    if (onFinished) onFinished(payload);
    else console.log('[Grade4 Dars31 preview]', payload);
  }, [answers, lang, onFinished, startedAt, studentName]);
  const Current = SCREENS[current];
  return (
    <LangContext.Provider value={lang}>
      <style>{STYLES + TOPIC_STYLES + G4_ETALON_OVERRIDES + WRONG_FLASH_CSS + FINALE_FIT_CSS + SPLIT_STEPS_FIT_CSS}</style>
      <div className={'lesson-root ' + (preview ? 'lesson-root-preview' : '')}>
        {showPreviewControls && (
          <div className="preview-language" aria-label={bi("Ko'rish tili", 'Язык предпросмотра', 'Preview language')[lang]}>
            {['uz', 'ru', 'en'].map((code) => (
              <button type="button" key={code} className={previewLang === code ? 'preview-active' : ''} onClick={() => setPreviewLang(code)}>
                {code.toUpperCase()}
              </button>
            ))}
          </div>
        )}
        <Current
          key={current} screen={current} storedAnswer={answers[current]} answers={answers}
          onAnswer={recordAnswer} finalState={finalState} onFinalState={setFinalState}
          onPrev={() => setCurrent((value) => Math.max(0, value - 1))}
          onNext={() => setCurrent((value) => Math.min(TOTAL_SCREENS - 1, value + 1))}
          finishLesson={finishLesson}
        />
      </div>
    </LangContext.Provider>
  );
}
const G4_TITLE_STYLES = `
.g4-title-reveal-overlay{
  position:fixed;inset:0;z-index:120;padding:0;display:grid;place-items:center;overflow:hidden;overscroll-behavior:contain;pointer-events:none;
  background:rgba(8,13,24,.64);backdrop-filter:blur(2px) saturate(.78);animation:g4-title-reveal-overlay-life 3.9s ease both
}
.g4-title-reveal-card{
  position:relative;isolation:isolate;width:100%;min-height:100dvh;padding:36px 24px;border:0;border-radius:0;
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;overflow:hidden;color:#FFF;text-align:center;
  background:radial-gradient(circle at 50% 50%,rgba(255,214,80,.17),transparent 31%)
}
.g4-title-reveal-card::after{
  content:"";position:absolute;z-index:0;top:50%;left:50%;width:min(440px,82vw);height:min(440px,82vw);border-radius:50%;
  background:radial-gradient(circle,rgba(255,222,105,.17),transparent 68%);transform:translate(-50%,-50%);pointer-events:none
}
.g4-title-reveal-rays{
  position:absolute;z-index:0;top:50%;left:50%;width:160vmax;height:160vmax;border-radius:50%;opacity:.28;
  background:repeating-conic-gradient(from -4deg,rgba(255,218,91,.88) 0 8deg,transparent 8deg 20deg);
  transform:translate(-50%,-50%);
  animation:g4-title-reveal-rays-in .8s cubic-bezier(.16,1,.3,1) both,g4-title-reveal-rays-spin 26s linear .8s 1 both
}
.g4-title-reveal-medal{
  position:absolute;top:50%;left:50%;z-index:2;width:112px;height:112px;margin:0;border:6px solid rgba(255,255,255,.72);border-radius:50%;
  display:grid;place-items:center;color:#653C00;background:linear-gradient(145deg,#FFF2A0,#FFC13B);
  box-shadow:0 0 0 13px rgba(255,255,255,.09),0 0 54px 10px rgba(255,204,63,.38),0 22px 38px -18px rgba(0,0,0,.7);
  font-size:52px;transform:translate(-50%,-50%);animation:g4-title-reveal-medal-in 1s cubic-bezier(.16,1,.3,1) .15s both
}
.g4-title-reveal-card h2{
  position:absolute;top:calc(50% + 82px);left:50%;z-index:2;width:min(680px,calc(100vw - 48px));margin:0;
  font-family:'Source Serif 4',Georgia,serif;font-size:clamp(34px,5vw,58px);line-height:1.02;text-shadow:0 4px 24px rgba(0,0,0,.72);
  transform:translateX(-50%);animation:g4-title-reveal-title-in .7s ease .52s both
}
.g4-title-reveal-confetti{position:absolute;inset:0;pointer-events:none}
.g4-title-reveal-confetti i{
  position:absolute;top:-20px;left:calc(3% + var(--g4-title-i) * 5.35%);width:8px;height:14px;border-radius:2px;background:#FFE284;
  animation:g4-title-reveal-confetti-fall 2.4s linear var(--g4-title-delay) 2 both
}
.g4-title-reveal-confetti i:nth-child(3n+2){background:#FF7050}.g4-title-reveal-confetti i:nth-child(3n){background:#77E1EA}
.g4-title-card-stage{
  position:relative;width:100%;min-height:116px;margin:0;padding:12px 82px 11px 67px;border-radius:17px;
  display:flex;flex-direction:column;justify-content:center;gap:4px;overflow:hidden;color:#FFF;
  background:radial-gradient(circle at 82% 20%,rgba(255,194,60,.26),transparent 30%),linear-gradient(135deg,#173B52,#0E6978);
  box-shadow:0 28px 58px -27px rgba(22,143,163,.8);transform:translateY(-2px)
}
.g4-title-card-bit{position:absolute;right:3px;bottom:2px;width:72px;height:90px;animation:g4-title-card-bit-float 2.8s ease-in-out 1 both}
.g4-title-card-bit .g1-char{width:100%;height:100%}
.g4-title-card-medal{
  position:absolute;left:11px;top:50%;width:44px;height:44px;border:3px solid rgba(255,255,255,.58);border-radius:50%;
  display:grid;place-items:center;transform:translateY(-50%);color:#5A3A00;background:linear-gradient(145deg,#FFE284,#FFC23C);
  box-shadow:0 0 0 8px rgba(255,255,255,.08),0 15px 30px -15px rgba(0,0,0,.6);font-size:19px
}
.g4-title-card-kicker{color:#A8EAF0;font:900 10px 'JetBrains Mono',monospace;letter-spacing:.13em}
.g4-title-card-stage h2{max-width:590px;margin:0;font:750 clamp(16px,2.2vw,21px)/1.05 'Source Serif 4',Georgia,serif}
.g4-title-card-score{
  align-self:flex-start;margin-top:5px;padding:5px 9px;border-radius:10px;display:flex;align-items:center;gap:7px;background:rgba(255,255,255,.10)
}
.g4-title-card-score strong{color:#FFE284;font-family:'JetBrains Mono',monospace}.g4-title-card-score span{color:rgba(255,255,255,.72);font-size:9px}
.g4-title-card-confetti{position:absolute;inset:0;pointer-events:none}
.g4-title-card-confetti i{position:absolute;top:-16px;width:7px;height:12px;border-radius:2px;animation:g4-title-card-confetti-fall 2.4s linear 2 both}
.g4-title-card-confetti i:nth-child(4n+1){background:#FFC23C}.g4-title-card-confetti i:nth-child(4n+2){background:#FF5B35}.g4-title-card-confetti i:nth-child(4n+3){background:#77E1EA}.g4-title-card-confetti i:nth-child(4n){background:#95C93D}
.g4-title-card-confetti i:nth-child(1){left:8%;animation-delay:-.3s}.g4-title-card-confetti i:nth-child(2){left:17%;animation-delay:-1.1s}.g4-title-card-confetti i:nth-child(3){left:29%;animation-delay:-.7s}.g4-title-card-confetti i:nth-child(4){left:41%;animation-delay:-1.7s}.g4-title-card-confetti i:nth-child(5){left:52%;animation-delay:-.2s}.g4-title-card-confetti i:nth-child(6){left:63%;animation-delay:-1.3s}.g4-title-card-confetti i:nth-child(7){left:73%;animation-delay:-.8s}.g4-title-card-confetti i:nth-child(8){left:84%;animation-delay:-1.9s}.g4-title-card-confetti i:nth-child(9){left:12%;animation-delay:-2s}.g4-title-card-confetti i:nth-child(10){left:36%;animation-delay:-1.4s}.g4-title-card-confetti i:nth-child(11){left:68%;animation-delay:-.5s}.g4-title-card-confetti i:nth-child(12){left:91%;animation-delay:-1.6s}
@keyframes g4-title-reveal-overlay-life{0%{opacity:0}12%,84%{opacity:1}100%{opacity:0}}
@keyframes g4-title-reveal-medal-in{from{opacity:0;transform:translate(-50%,-50%) scale(.25) rotate(-25deg)}to{opacity:1;transform:translate(-50%,-50%) scale(1) rotate(0)}}
@keyframes g4-title-reveal-title-in{from{opacity:0;transform:translate(-50%,14px)}to{opacity:1;transform:translate(-50%,0)}}
@keyframes g4-title-reveal-rays-in{from{opacity:0;transform:translate(-50%,-50%) scale(.5)}to{opacity:.28;transform:translate(-50%,-50%) scale(1)}}
@keyframes g4-title-reveal-rays-spin{from{transform:translate(-50%,-50%) rotate(0)}to{transform:translate(-50%,-50%) rotate(360deg)}}
@keyframes g4-title-reveal-confetti-fall{to{transform:translateY(470px) rotate(560deg)}}
@keyframes g4-title-card-confetti-fall{to{transform:translateY(230px) rotate(460deg)}}
@keyframes g4-title-card-bit-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@media(max-width:639.98px){.lesson-root-preview .stage-header{padding-top:52px}.screen-type{display:none}.stage{width:min(390px,100%)}.stage-header{padding-top:6px}.stage-chrome{min-height:46px}.chrome-title{max-width:92px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:9px}.chrome-actions{gap:4px}.screen-count{padding:4px 6px;font-size:9px}.audio-indicator{height:46px;padding:1px 3px}.audio-indicator button{width:44px;height:44px}.stage-content{grid-template-rows:minmax(0,1fr);padding-top:5px;padding-bottom:6px}.stage-nav{min-height:58px}.btn-white-accent,.btn-ghost{min-width:108px;min-height:48px;padding:0 10px;font-size:12px}.stack{gap:7px}.heading{height:56px;gap:8px}.heading h1{font-size:clamp(20px,6vw,24px)}.heading .g1-char{width:48px;height:60px}.model-card,.question,.test-model,.reflection-card{padding:8px;border-radius:15px}.model-card{grid-template-columns:minmax(126px,.86fr) minmax(156px,1.14fr);gap:7px}.hook-stack{grid-template-rows:auto minmax(0,.78fr) minmax(0,1.22fr)}.hook-question{grid-template-rows:auto auto minmax(52px,1fr)}.hook-question .options{grid-template-columns:repeat(3,minmax(0,1fr))}.hook-question .option{grid-template-columns:1fr;justify-items:center;align-content:center;text-align:center}.hook-question .option>b{display:none}.question h2{font-size:14px;line-height:1.16}.options{grid-template-columns:1fr;gap:5px}.option{min-height:44px;padding:5px 6px;border-radius:11px;grid-template-columns:24px 1fr;gap:5px;font-size:11px;line-height:1.15}.option>b{width:24px;height:24px}.feedback{padding:6px 7px;grid-template-columns:20px 1fr;gap:5px;font-size:10px}.proof{padding:5px 7px;font-size:9px}.test-layout{grid-template-columns:minmax(118px,.78fr) minmax(170px,1.22fr);gap:7px}.test-model{padding:6px}.test-model .reveal-grid{display:none}.question-feedback-slot{min-height:84px}.hook-feedback-slot{min-height:52px}.conversion-visual{height:100%;min-height:0;padding:6px;border-radius:13px;gap:6px}.guided-panel{grid-template-rows:8px minmax(58px,1fr) 46px;gap:7px}.guided-frame{min-height:58px;padding:8px;border-radius:13px;grid-template-columns:29px 1fr;gap:7px;font-size:11px}.guided-frame>b{width:29px;height:29px}.guided-action{min-height:46px}.step-button{min-width:124px}.guided-complete{padding:8px;font-size:10px}.summary-complete{grid-template-columns:1fr;grid-template-rows:88px minmax(0,1fr);gap:7px}.summary-complete .g4-title-card-stage{min-height:88px}.reflection-card h2{font-size:14px}.reflection-options{gap:5px}.preview-language{top:7px;left:50%;right:auto;transform:translateX(-50%)}
  .g4-title-reveal-card{min-height:100dvh;padding:24px 18px}
  .g4-title-reveal-medal{width:88px;height:88px;border-width:5px;font-size:40px}
  .g4-title-reveal-card h2{top:calc(50% + 62px);font-size:29px}
  .g4-title-card-stage{min-height:88px;padding:9px 59px 8px 51px;border-radius:14px}
  .g4-title-card-medal{left:8px;width:34px;height:34px;font-size:14px}
  .g4-title-card-bit{width:57px;height:71px}
  .g4-title-card-stage h2{font-size:14px}
}
@media(max-height:700px){.stage-header{padding-top:4px}.stage-chrome{min-height:44px}.stage-content{grid-template-rows:minmax(0,1fr)}.stage-nav{min-height:56px}.heading{height:52px}.heading .g1-char{width:44px;height:55px}.stack{gap:6px}.model-card,.question,.test-model,.reflection-card{padding:7px}.question-feedback-slot{min-height:78px}.hook-feedback-slot{min-height:48px}.guided-panel{grid-template-rows:7px minmax(52px,1fr) 44px;gap:5px}.guided-action{min-height:44px}.step-button{min-height:44px}.summary-complete{grid-template-rows:82px minmax(0,1fr)}}
.summary-complete>.title-claim-card{grid-column:auto}.summary-complete>[data-g4-role="title-card"]{height:100%;min-height:0}
@media(max-width:639.98px){.summary-complete{grid-template-rows:minmax(0,1fr) 88px}.summary-complete>.title-claim-card,.summary-complete>[data-g4-role="title-card"]{height:88px;min-height:0}.title-claim-card{padding:6px 7px;grid-template-columns:30px minmax(0,1fr) auto;place-items:center;align-content:center;gap:6px;text-align:left}.title-claim-card>span{font-size:28px}.title-claim-card h2{font-size:13px;line-height:1.1}.title-claim-card .g4-title-claim{min-width:96px;min-height:44px;padding:0 7px}}
@media(max-height:700px){.summary-complete{grid-template-rows:minmax(0,1fr) 82px}}
@media(max-width:639.98px) and (max-height:700px){.summary-complete>.title-claim-card,.summary-complete>[data-g4-role="title-card"]{height:82px}}
@media(prefers-reduced-motion:reduce){.lesson-root *{animation:none!important;transition:none!important}
  .g4-title-reveal-overlay,.g4-title-reveal-overlay *,.g4-title-card-stage,.g4-title-card-stage *{animation:none!important;transition:none!important}
  .g4-title-reveal-confetti,.g4-title-card-confetti{display:none!important}
  .g4-title-reveal-rays{opacity:.28!important;transform:translate(-50%,-50%)!important}
  .g4-title-reveal-medal{opacity:1!important;transform:translate(-50%,-50%)!important}
  .g4-title-reveal-card h2{opacity:1!important;transform:translateX(-50%)!important}
  .g4-title-card-stage{transform:none!important}
}
`;

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
.hook-scene-visual>.time-visual,.hook-scene-visual>.area-visual,.hook-scene-visual>.conversion-visual{width:100%!important;height:100%!important;min-height:0!important;max-height:100%!important;padding:4px!important;gap:4px!important;overflow:hidden!important}
.hook-scene-visual>.topic-visual{display:grid!important;grid-template-rows:minmax(0,1fr) auto!important;align-content:stretch!important;place-items:center!important}
.hook-scene-visual>.topic-visual>svg{width:min(100%,330px)!important;height:100%!important;min-height:0!important;max-height:100%!important}
.hook-scene-visual>.topic-visual>strong{max-width:100%!important;color:#DDF5F4!important;font-size:10px!important;line-height:1.12!important}
.hook-scene-visual .area-demo{height:100%;min-height:0;gap:3px}
.hook-scene-visual .square-grid{width:min(128px,100%)!important;height:min(128px,100%)!important}
.hook-scene-visual .area-demo strong,.hook-scene-visual .area-pill{padding:3px 7px!important;font-size:10px!important}
.hook-scene-visual .relation-cards{height:100%;min-height:0;gap:4px!important}
.hook-scene-visual .relation-cards span{min-height:0;padding:5px 4px!important;font-size:10px!important;line-height:1.08!important}
.hook-scene-visual .console-screen{padding:7px 14px!important;font-size:20px!important}
.hook-scene-visual .tv-layer-wrap{max-height:100%;width:min(174px,100%);gap:4px}
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
.rank-boost-overlay{position:fixed;inset:0;z-index:120;padding:0;display:grid;place-items:center;overflow:hidden;overscroll-behavior:contain;background:rgba(8,13,24,.64);backdrop-filter:blur(2px) saturate(.78);animation:g4-title-reveal-life 3.9s ease both}
[data-g4-role="title-card"]{position:relative;isolation:isolate;max-width:100%;overflow:hidden}
[data-g4-role="title-claim"]{font-family:'Manrope',system-ui,sans-serif}
.hook-scene-visual{width:min(760px,100%)!important;margin-inline:auto!important}
.lesson-frame .preview-language{display:none!important}
.hook-stack>.reveal-grid{flex:0 0 auto!important;width:100%;min-height:0!important;padding:4px;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;align-content:stretch!important;gap:5px!important;overflow:visible!important;border-radius:14px;background:rgba(255,255,255,.9)}
.hook-stack>.reveal-grid>.reveal-card{min-width:0;min-height:38px!important;height:auto!important;padding:4px 6px!important;border-radius:10px!important;grid-template-columns:22px minmax(0,1fr)!important;gap:4px!important;overflow:visible!important}
.hook-stack>.reveal-grid>.reveal-card>b{width:22px!important;height:22px!important}
.hook-stack>.reveal-grid>.reveal-card>span{min-width:0;font-size:10px;line-height:1.12;overflow-wrap:anywhere}
.hook-stack>.question .feedback-slot:empty{display:none}
.hook-stack>.question:has(.feedback.open) .options{display:none!important}
@media(max-width:639.98px){
  .hook-stack{gap:5px!important}
  .hook-stack>.question{padding:4px!important;border-radius:12px!important}
  .hook-stack>.question .options{gap:4px!important}
  .hook-stack>.question .option{min-height:42px!important;padding:3px!important;font-size:14px!important;line-height:1.08!important}
  .hook-scene-visual>.time-visual,.hook-scene-visual>.area-visual,.hook-scene-visual>.conversion-visual{padding:2px!important;gap:2px!important}
  .hook-scene-visual>.topic-visual>strong{font-size:9px!important;line-height:1.05!important}
  .hook-scene-visual .square-grid{width:min(102px,100%)!important;height:min(102px,100%)!important}
  .hook-scene-visual .area-demo strong,.hook-scene-visual .area-pill{padding:2px 5px!important;font-size:9px!important}
  .hook-scene-visual .relation-cards{gap:3px!important}
  .hook-scene-visual .relation-cards span{padding:3px!important;font-size:9px!important}
  .hook-scene-visual .console-screen{padding:5px 10px!important;font-size:18px!important}
  .hook-scene-visual .tv-layer-wrap{width:min(146px,100%);gap:3px}
  .hook-stack>.reveal-grid{padding:2px;gap:2px!important;border-radius:10px}
  .hook-stack>.reveal-grid>.reveal-card{min-height:32px!important;padding:3px!important;grid-template-columns:18px minmax(0,1fr)!important;gap:3px!important}
  .hook-stack>.reveal-grid>.reveal-card>b{width:18px!important;height:18px!important;font-size:8px!important}
  .hook-stack>.reveal-grid>.reveal-card>span{font-size:9px;line-height:1.08}
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
  .lesson-root .feedback[data-g4-role~="feedback-frame"] p{font-size:14px!important}
}
@media(prefers-reduced-motion:reduce){.rank-boost-overlay,.rank-boost-overlay * ,[data-g4-role="title-card"],[data-g4-role="title-card"] *{animation:none!important;transition:none!important}.rank-boost-overlay{opacity:1}.g4-title-reveal-confetti,.g4-title-card-confetti{display:none!important}}
`;

const STYLES = `${G4_TITLE_STYLES}
.feedback-bit{width:25px;height:31px}.proof-label{margin-right:7px;color:${T.lime}}.title-claim-card{grid-column:1/-1;height:100%;display:grid;place-items:center;align-content:center;gap:12px;border-radius:20px;background:#fff;text-align:center;overflow:hidden}.title-claim-card>span{font-size:48px;color:#FFCE49}
.stage-hook .hook-card{position:relative;isolation:isolate;overflow:hidden;border:1px solid rgba(144,228,235,.12);border-radius:24px;background:radial-gradient(circle at 87% 24%,rgba(121,211,218,.16),transparent 24%),radial-gradient(circle at 9% 88%,rgba(149,201,61,.11),transparent 25%),linear-gradient(145deg,rgba(22,143,163,.25),transparent 48%),linear-gradient(135deg,#153B50,#0B2232 72%);box-shadow:0 22px 50px -30px rgba(14,33,44,.75)}
html:has(.lesson-root),body:has(.lesson-root),#root:has(.lesson-root),.lesson-page:has(.lesson-root),.lesson-frame:has(.lesson-root){width:100%;height:100%;min-height:0!important;margin:0;overflow:hidden!important;overscroll-behavior:none}.lesson-root,.lesson-root *{box-sizing:border-box}.lesson-root h1,.lesson-root h2,.lesson-root p{margin:0}.lesson-root button{font:inherit}.lesson-root{position:fixed;inset:0;width:100%;height:100dvh;min-height:0;overflow:hidden;color:${T.ink};background:radial-gradient(circle at 88% 9%,rgba(22,143,163,.11),transparent 25%),linear-gradient(145deg,#F7F8F4,#EEF3F1);font-family:'Manrope',system-ui,sans-serif}.stage{width:min(936px,100%);height:100dvh;margin:0 auto;display:grid;grid-template-rows:auto minmax(0,1fr) auto;overflow:hidden;background:rgba(245,245,240,.92);box-shadow:0 0 50px -34px rgba(${T.shadowBase},.45)}.stage-header{min-height:0;padding-top:9px;background:rgba(245,245,240,.96);backdrop-filter:blur(10px);z-index:5}.progress-track{height:7px;border-radius:999px;overflow:hidden;background:#DDE5E3}.progress-fill{height:100%;border-radius:inherit;background:linear-gradient(90deg,${T.cyan},${T.lime});transition:width .45s ease}.progress-bar{box-shadow:0 0 15px rgba(22,143,163,.34)}.stage-chrome{min-height:48px;display:flex;align-items:center;justify-content:space-between;gap:12px}.chrome-title,.chrome-actions{display:flex;align-items:center;gap:9px}.chrome-title{color:${T.navy};font-size:12px;font-weight:900}.status-dot{width:9px;height:9px;border-radius:50%;background:${T.accent};box-shadow:0 0 0 5px rgba(255,91,53,.1)}.screen-type,.screen-count{padding:5px 9px;border-radius:999px;color:${T.cyan};background:${T.cyanSoft};font-size:10px;font-weight:900}.screen-count{color:${T.ink2};background:#FFF}.audio-indicator{height:46px;padding:3px 6px;border-radius:13px;display:flex;align-items:center;gap:4px;background:#FFF;box-shadow:0 9px 20px -17px rgba(${T.shadowBase},.6)}.audio-indicator button{width:44px;height:44px;border:0;border-radius:9px;background:transparent;cursor:pointer}.audio-wave{height:20px;display:flex;align-items:center;gap:2px}.audio-wave i{width:3px;height:6px;border-radius:4px;background:${T.cyan};transition:.25s}.audio-wave.playing i:nth-child(1){height:12px}.audio-wave.playing i:nth-child(2){height:18px}.audio-wave.playing i:nth-child(3){height:9px}
.stage-content{min-height:0;padding-top:7px;padding-bottom:8px;display:grid;grid-template-rows:minmax(0,1fr);overflow:hidden}.stage-body{min-height:0;overflow:hidden}.stage-nav{min-height:62px;display:flex;align-items:center;justify-content:space-between;gap:12px;background:rgba(245,245,240,.95)}.btn-white-accent,.btn-ghost{min-width:128px;min-height:50px;padding:0 18px;border:0;border-radius:15px;cursor:pointer;font-weight:900}.btn-white-accent{color:${T.accent};background:#fff;box-shadow:0 12px 24px -17px rgba(255,91,53,.8)}.btn-white-accent:hover:not(:disabled){color:#fff;background:${T.accent}}.btn-ghost{color:${T.ink2};background:transparent}.btn-ghost:hover{background:#fff}.stack{height:100%;min-height:0;display:grid;grid-template-rows:auto minmax(0,1fr);gap:10px;overflow:hidden;animation:page-in .45s cubic-bezier(.16,1,.3,1) both}.heading{height:68px;min-height:0;display:flex;align-items:center;justify-content:space-between;gap:16px}.heading.heading-solo{justify-content:flex-start}.heading>div>span{color:${T.cyan};font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.heading h1{margin-top:4px!important;font:750 clamp(25px,4vw,38px)/1.06 'Source Serif 4',Georgia,serif}.heading .g1-char{width:62px;height:76px;flex:0 0 auto;filter:drop-shadow(0 9px 11px rgba(23,59,82,.2))}.model-card,.question,.test-model{min-height:0;padding:14px;overflow:hidden;border-radius:22px;background:rgba(255,255,255,.9);box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.48)}.model-card{height:100%;display:grid;grid-template-columns:minmax(250px,.85fr) minmax(300px,1.15fr);align-items:stretch;gap:14px}.hook-card{background:linear-gradient(135deg,${T.cyanSoft},#FFF)}.summary-card{background:linear-gradient(135deg,#FFF,${T.successSoft})}.reveal-grid{min-height:0;display:grid;align-content:center;gap:7px;overflow:hidden}.reveal-card{min-height:48px;padding:9px 12px;border-radius:14px;display:grid;grid-template-columns:30px 1fr;align-items:center;gap:9px;opacity:.12;transform:translateY(7px);background:#F8F8F4;transition:.38s ease}.reveal-card.show{opacity:1;transform:none}.reveal-card>b{width:28px;height:28px;border-radius:9px;display:grid;place-items:center;color:#FFF;background:${T.cyan};font:900 10px 'JetBrains Mono',monospace}.reveal-card:last-child.show{background:${T.cyanSoft}}.question{height:100%;display:grid;grid-template-rows:auto auto minmax(92px,1fr);align-content:start;gap:9px}.question h2{font:720 clamp(17px,2.5vw,22px)/1.25 'Source Serif 4',Georgia,serif}.options{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.option{min-height:50px;padding:8px;border:0;border-radius:16px;display:grid;grid-template-columns:28px 1fr;align-items:center;gap:8px;color:${T.ink};background:#F8F8F4;text-align:left;cursor:pointer;transition:.25s}.option:hover:not(:disabled){transform:translateY(-2px)}.option>b{width:27px;height:27px;border-radius:9px;display:grid;place-items:center;color:${T.cyan};background:${T.cyanSoft};font:900 11px 'JetBrains Mono',monospace}.option.picked{background:${T.accentSoft};box-shadow:inset 0 0 0 2px rgba(255,91,53,.27)}.option.right{background:${T.successSoft};box-shadow:inset 0 0 0 2px rgba(34,122,83,.25)}.option.bad{background:${T.warnSoft};box-shadow:inset 0 0 0 2px rgba(169,111,19,.25)}.feedback{padding:8px 10px;border-radius:13px;display:grid;grid-template-columns:25px 1fr;align-items:start;gap:7px;font-size:12px;line-height:1.22}.feedback.correct{background:${T.successSoft};box-shadow:inset 4px 0 ${T.success}}.feedback.wrong{background:${T.warnSoft};box-shadow:inset 4px 0 ${T.warn}}.feedback.neutral{background:${T.cyanSoft};box-shadow:inset 4px 0 ${T.cyan}}.proof{padding:7px 10px;border-radius:11px;overflow:hidden;color:#FFF;background:${T.navy};text-align:center;font:900 15px 'JetBrains Mono',monospace}.test-layout{height:100%;min-height:0;display:grid;grid-template-columns:.86fr 1.14fr;gap:10px;overflow:hidden}.test-model{display:grid;grid-template-rows:minmax(0,1fr) auto;align-content:stretch;gap:8px}.feedback-slot{min-height:0;overflow:hidden}.feedback-stack{height:100%;display:grid;align-content:start;gap:6px;overflow:hidden}.question-feedback-slot{min-height:92px}.hook-feedback-slot{min-height:58px}.guided-panel{min-height:0;display:grid;grid-template-rows:10px minmax(72px,1fr) 50px;gap:10px;overflow:hidden}.guided-progress{display:flex;align-items:center;gap:6px}.guided-progress i{height:6px;flex:1;border-radius:999px;background:#DDE5E3}.guided-progress i.active{background:${T.cyan}}.guided-frame{min-height:72px;padding:12px;border-radius:16px;display:grid;grid-template-columns:34px 1fr;align-items:center;gap:10px;overflow:hidden;background:#F8F8F4;font-weight:850}.guided-frame>b{width:34px;height:34px;border-radius:11px;display:grid;place-items:center;color:#FFF;background:${T.cyan};font:900 12px 'JetBrains Mono',monospace}.guided-action{display:flex;align-items:center;justify-content:flex-end;min-height:50px}.step-button{min-width:150px}.guided-complete{padding:10px 12px;border-radius:12px;color:${T.success};background:${T.successSoft};font-size:12px;font-weight:900}.summary-complete{height:100%;min-height:0;display:grid;grid-template-columns:.9fr 1.1fr;gap:10px;overflow:hidden}.summary-complete .g4-title-card-stage{height:100%;min-height:0}.reflection-card{min-height:0;padding:14px;border-radius:20px;display:grid;grid-template-rows:auto minmax(0,1fr);gap:9px;overflow:hidden;background:#FFF;box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.48)}.reflection-card h2{font:720 18px/1.22 'Source Serif 4',Georgia,serif}.reflection-options{min-height:0;display:grid;grid-template-rows:repeat(3,minmax(44px,1fr));gap:7px;overflow:hidden}
.conversion-visual{min-height:210px;padding:14px;border-radius:20px;display:grid;place-items:center;gap:12px;background:linear-gradient(145deg,${T.cyanSoft},#FFF)}.relation-cards{width:100%;display:grid;grid-template-columns:repeat(2,1fr);gap:8px}.relation-cards span{padding:12px 8px;border-radius:13px;opacity:.18;background:#FFF;text-align:center;font:900 12px 'JetBrains Mono',monospace;transition:.35s}.relation-cards span.active{opacity:1;color:#FFF;background:${T.cyan}}.console-screen{padding:13px 24px;border-radius:14px;color:#FFF;background:${T.navy};font:900 25px 'JetBrains Mono',monospace}.cross{position:absolute;color:${T.accent};font-size:84px;font-weight:900;opacity:0;transform:scale(.6) rotate(-15deg);transition:.4s}.cross.show{opacity:.85;transform:scale(1) rotate(-15deg)}.console{position:relative}.tape-line{width:260px;height:28px;padding:4px;border-radius:10px;background:#FFF}.tape-line i{height:100%;display:block;border-radius:7px;background:${T.cyan};transition:.5s}.tape strong{font:900 18px 'JetBrains Mono',monospace}.area-grid>div{width:150px;height:150px;padding:3px;display:grid;grid-template-columns:repeat(10,1fr);gap:2px;border:3px solid ${T.navy};border-radius:12px;background:#FFF}.area-grid i{border-radius:2px;background:#DDE7E6;transition:.35s}.area-grid i.active{background:${T.cyan}}.area-grid strong{font:900 14px 'JetBrains Mono',monospace}.algorithm{align-content:center}.algorithm span{width:min(380px,100%);padding:10px 14px;border-radius:12px;opacity:.16;background:#FFF;text-align:center;font:900 13px 'JetBrains Mono',monospace;transition:.35s}.algorithm span.active{opacity:1}.algorithm span:last-child.active{color:#FFF;background:${T.success}}.manifest{grid-template-columns:repeat(2,1fr)}.manifest span{padding:20px 12px;border-radius:15px;opacity:.2;background:#FFF;text-align:center;font-weight:900;transition:.35s}.manifest span.active{opacity:1;color:#FFF;background:${T.navy}}.direction>div{display:flex;align-items:center;gap:14px}.direction b{padding:15px;border-radius:13px;background:#FFF}.direction span{color:${T.accent};font-size:30px}.direction small{font-weight:900}.preview-language{position:fixed;top:9px;right:9px;z-index:30;display:flex;gap:3px;padding:3px;border-radius:999px;background:rgba(255,255,255,.94)}.preview-language button{min-width:44px;min-height:44px;padding:4px 9px;border:0;border-radius:999px;background:transparent;cursor:pointer;font-size:10px;font-weight:900}.preview-language .preview-active{color:#FFF;background:${T.accent}}button:focus-visible,input:focus-visible{outline:3px solid rgba(22,143,163,.48);outline-offset:3px}@keyframes page-in{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:none}}
@media(max-width:639.98px){.lesson-root-preview .stage-header{padding-top:52px}.screen-type{display:none}.stage{width:min(390px,100%)}.stage-header{padding-top:6px}.stage-chrome{min-height:46px}.chrome-title{max-width:92px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:9px}.chrome-actions{gap:4px}.screen-count{padding:4px 6px;font-size:9px}.audio-indicator{height:46px;padding:1px 3px}.audio-indicator button{width:44px;height:44px}.stage-content{grid-template-rows:minmax(0,1fr);padding-top:5px;padding-bottom:6px}.stage-nav{min-height:58px}.btn-white-accent,.btn-ghost{min-width:108px;min-height:48px;padding:0 10px;font-size:12px}.stack{gap:7px}.heading{height:56px;gap:8px}.heading h1{font-size:clamp(20px,6vw,24px)}.heading .g1-char{width:48px;height:60px}.model-card,.question,.test-model,.reflection-card{padding:8px;border-radius:15px}.model-card{grid-template-columns:minmax(126px,.86fr) minmax(156px,1.14fr);gap:7px}.hook-stack{grid-template-rows:auto minmax(0,.78fr) minmax(0,1.22fr)}.hook-question{grid-template-rows:auto auto minmax(52px,1fr)}.hook-question .options{grid-template-columns:repeat(3,minmax(0,1fr))}.hook-question .option{grid-template-columns:1fr;justify-items:center;align-content:center;text-align:center}.hook-question .option>b{display:none}.question h2{font-size:14px;line-height:1.16}.options{grid-template-columns:1fr;gap:5px}.option{min-height:44px;padding:5px 6px;border-radius:11px;grid-template-columns:24px 1fr;gap:5px;font-size:11px;line-height:1.15}.option>b{width:24px;height:24px}.feedback{padding:6px 7px;grid-template-columns:20px 1fr;gap:5px;font-size:10px}.proof{padding:5px 7px;font-size:9px}.test-layout{grid-template-columns:minmax(118px,.78fr) minmax(170px,1.22fr);gap:7px}.test-model{padding:6px}.test-model .reveal-grid{display:none}.question-feedback-slot{min-height:84px}.hook-feedback-slot{min-height:52px}.conversion-visual{height:100%;min-height:0;padding:6px;border-radius:13px;gap:6px}.guided-panel{grid-template-rows:8px minmax(58px,1fr) 46px;gap:7px}.guided-frame{min-height:58px;padding:8px;border-radius:13px;grid-template-columns:29px 1fr;gap:7px;font-size:11px}.guided-frame>b{width:29px;height:29px}.guided-action{min-height:46px}.step-button{min-width:124px}.guided-complete{padding:8px;font-size:10px}.summary-complete{grid-template-columns:1fr;grid-template-rows:88px minmax(0,1fr);gap:7px}.summary-complete .g4-title-card-stage{min-height:88px}.reflection-card h2{font-size:14px}.reflection-options{gap:5px}.preview-language{top:7px;left:50%;right:auto;transform:translateX(-50%)}}
@media(max-height:700px){.stage-header{padding-top:4px}.stage-chrome{min-height:44px}.stage-content{grid-template-rows:minmax(0,1fr)}.stage-nav{min-height:56px}.heading{height:52px}.heading .g1-char{width:44px;height:55px}.stack{gap:6px}.model-card,.question,.test-model,.reflection-card{padding:7px}.question-feedback-slot{min-height:78px}.hook-feedback-slot{min-height:48px}.guided-panel{grid-template-rows:7px minmax(52px,1fr) 44px;gap:5px}.guided-action{min-height:44px}.step-button{min-height:44px}.summary-complete{grid-template-rows:82px minmax(0,1fr)}}
@media(prefers-reduced-motion:reduce){.lesson-root *{animation:none!important;transition:none!important}}
.stage-hook .hook-card{overflow:hidden;border:1px solid rgba(144,228,235,.12);border-radius:24px;background:radial-gradient(circle at 87% 24%,rgba(121,211,218,.16),transparent 24%),radial-gradient(circle at 9% 88%,rgba(149,201,61,.11),transparent 25%),linear-gradient(145deg,rgba(22,143,163,.25),transparent 48%),linear-gradient(135deg,#153B50,#0B2232 72%);box-shadow:0 22px 50px -30px rgba(14,33,44,.75)}
@media(max-width:639.98px){.stage-hook .hook-card{border-radius:18px}}
`;
