import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { canUseGrade4TheoryContinue } from './theoryNavigation.js';

// ============================================================================
// 4-SINF · Dars 32 · Hajm birliklari
//
// SYUJET. O'lchov xizmatining suv ta'minoti nazorati. Sensor idish hajmini
// kub santimetrda beradi, Bit esa uni litr deb o'qib, shaharga bo'lmagan
// buyurtma yuboradi.
//
// YADRO. Hajm birlik kublar soni bilan o'lchanadi. Qirrasi 1 dm bo'lgan kub
// 1 000 ta 1 cm³ dan yig'iladi, unga 1 litr suv sig'adi. Shundan: har qadam
// 1 000 barobar, chunki qirra 10 barobar uzayadi.
//
// USUL. Bir qatlamdagi kublarni sanaymiz, qatlamlar soniga ko'paytiramiz,
// kub birlikni yozamiz, kerak bo'lsa litrga aylantiramiz.
//
// XATO MODELLARI. Kub santimetrni litr deb o'qish · qatlamlarni qo'shib
// yuborish · hajm qadamini uzunlik qadami (10) bilan almashtirish · o'lchamlarni
// qo'shish · birlikni umuman yozmaslik.
//
// Sonlar shu dars uchun tanlangan, darslik misollari ko'chirilmagan.
// Vizual kontrakt: ETALON_4SINF.md va Dars01.
// ============================================================================

const T = {
  bg: '#F5F5F0', ink: '#12212C', ink2: '#50616D', ink3: '#87949D', paper: '#FFFFFF',
  accent: '#FF5B35', accentSoft: '#FFF0EA', cyan: '#168FA3', cyanSoft: '#E5F5F6',
  navy: '#173B52', lime: '#95C93D', success: '#227A53', successSoft: '#E7F3EC',
  warn: '#A96F13', warnSoft: '#FFF5D9', shadowBase: '58, 53, 48',
};
// Har ekrandagi ovoz segmentlari soni.
const FRAME_COUNTS = [4, 3, 2, 3, 2, 3, 2, 2, 3, 2, 3, 2, 3, 2, 2, 5];
const TOTAL_SCREENS = FRAME_COUNTS.length;

const SCREEN_META = [
  { id: 's0', type: 'hook', template: 'mission-console', goal: 'predict-vessel-capacity', mechanic: 'prediction-choice', active: true, assessed: false, scored: false, scope: 'hook', misconceptions: ['unit-name-swap'] },
  { id: 's1', type: 'exploration', template: 'cube-fill', goal: 'build-a-cubic-decimetre', mechanic: 'tap-to-stack', active: true, assessed: false, scored: false, scope: null, misconceptions: [] },
  { id: 's2', type: 'test', template: 'choice', goal: 'read-the-sensor-value', mechanic: 'choice-retry', active: true, assessed: true, scored: true, scope: 'module-mikro', misconceptions: ['unit-name-swap'] },
  { id: 's3', type: 'model', template: 'three-step-track', goal: 'count-volume-by-layers', mechanic: 'tap-steps', active: true, assessed: false, scored: false, scope: null, misconceptions: [] },
  { id: 's4', type: 'test', template: 'value-builder', goal: 'apply-layer-method', mechanic: 'tile-build', active: true, assessed: true, scored: true, scope: 'module-mikro', misconceptions: ['missing-cubic-unit'] },
  { id: 's5', type: 'exploration', template: 'unit-ladder', goal: 'discover-the-thousand-step', mechanic: 'tap-to-open', active: true, assessed: false, scored: false, scope: null, misconceptions: ['length-step-instead-of-volume-step'] },
  { id: 's6', type: 'test', template: 'choice', goal: 'convert-between-volume-units', mechanic: 'choice-retry', active: true, assessed: true, scored: true, scope: 'module-mikro', misconceptions: ['length-step-instead-of-volume-step'] },
  { id: 's7', type: 'error', template: 'row-repair', goal: 'repair-the-broken-step', mechanic: 'tap-the-row', active: true, assessed: true, scored: true, scope: 'module-mikro', misconceptions: ['added-layers-instead-of-multiplying'] },
  { id: 's8', type: 'exploration', template: 'estimate-band', goal: 'estimate-before-calculating', mechanic: 'tap-the-band', active: true, assessed: false, scored: false, scope: null, misconceptions: [] },
  { id: 's9', type: 'test', template: 'choice', goal: 'compute-the-exact-volume', mechanic: 'choice-retry', active: true, assessed: true, scored: true, scope: 'module-mikro', misconceptions: ['sum-instead-of-product'] },
  { id: 's10', type: 'rule', template: 'rule-builder', goal: 'formulate-the-method', mechanic: 'order-parts', active: true, assessed: false, scored: false, scope: null, misconceptions: [] },
  { id: 's11', type: 'test', template: 'rapid-console', goal: 'convert-three-volumes', mechanic: 'tile-rounds', active: true, assessed: true, scored: true, scoreUnits: 3, scope: 'module-mikro', misconceptions: ['zero-count-slip'] },
  { id: 's12', type: 'strategy', template: 'route-compare', goal: 'compare-two-valid-routes', mechanic: 'route-choice', active: true, assessed: false, scored: false, scope: null, misconceptions: ['strategy-without-check'] },
  { id: 's13', type: 'case', template: 'choice', goal: 'check-the-reserve', mechanic: 'choice-retry', active: true, assessed: true, scored: true, scope: 'final', misconceptions: ['unit-name-swap'] },
  { id: 's14', type: 'case', template: 'choice', goal: 'transfer-to-inverse-task', mechanic: 'choice-retry', active: true, assessed: true, scored: true, scope: 'final', misconceptions: ['inverse-conversion'] },
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
  lessonId: 'measure-4-32-v1',
  slug: 'dars32-hajm-birliklari',
  lessonTitle: {
    uz: "Hajm birliklari",
    ru: 'Единицы объёма',
    en: 'Units of volume',
  },
  skillTags: ['unit-cubes', 'volume-by-layers', 'volume-unit-ladder', 'litre-relation'],
  finalReflectionRequired: false,
};

const CONTENT = {
  s0: {
    eyebrow: { uz: "Missiya", ru: "Миссия", en: "Mission" },
    topic: { uz: "Dars mavzusi: Hajm birliklari", ru: "Тема урока: Единицы объёма", en: "Lesson topic: Units of volume" },
    title: { uz: "Sensor raqam yubordi", ru: "Датчик прислал число", en: "The sensor sent a number" },
    question: { uz: "Idishga qancha suv sig'adi?", ru: "Сколько воды помещается в сосуд?", en: "How much water does the vessel hold?" },
    neutral: true,
    reading: { uz: "2 000 cm³", ru: "2 000 см³", en: "2 000 cm³" },
    botOrder: { uz: "2 000 litr", ru: "2 000 литров", en: "2 000 litres" },
    nodeName: { uz: "SUV TA'MINOTI · O'LCHOV XIZMATI", ru: "ВОДОСНАБЖЕНИЕ · СЛУЖБА ИЗМЕРЕНИЙ", en: "WATER SUPPLY · MEASUREMENT SERVICE" },
    stateBad: { uz: "BUYURTMA JUDA KATTA", ru: "ЗАКАЗ СЛИШКОМ БОЛЬШОЙ", en: "THE ORDER IS FAR TOO LARGE" },
    labelA: { uz: "sensor ko'rsatkichi", ru: "показание датчика", en: "sensor reading" },
    labelOrder: { uz: "Bit yozgan buyurtma", ru: "заказ, записанный Битом", en: "the order Bit wrote" },
    tankLabel: { uz: "shahar idishi", ru: "городской сосуд", en: "city vessel" },
    options: [
      { uz: "2 l", ru: "2 л", en: "2 l" },
      { uz: "2 000 l", ru: "2 000 л", en: "2 000 l" },
      { uz: "20 l", ru: "20 л", en: "20 l" },
      { uz: "200 l", ru: "200 л", en: "200 l" },
    ],
    feedback: {
      uz: "Taxminingiz yozib olindi. Endi kub santimetr qanchaligini birga ko'ramiz.",
      ru: "Твоё предположение записано. Теперь вместе посмотрим, каков кубический сантиметр.",
      en: "Your prediction is saved. Now we will see together how big a cubic centimetre is.",
    },
    audio: {
      intro: {
        uz: [
          "Suv ta'minoti nazoratidamiz. Shahar idishlariga qancha suv ketishini shu yerda hisoblashadi.",
          "Sensor idish hajmini ikki ming kub santimetr deb ko'rsatdi.",
          "Bit buyurtmaga ikki ming litr deb yozdi. Bunday idish bir xonaga sig'mas edi.",
          "Hisoblashdan oldin taxmin qiling, idishga qancha suv sig'adi.",
        ],
        ru: [
          "Мы в контроле водоснабжения. Здесь считают, сколько воды уходит в городские сосуды.",
          "Датчик показал объём сосуда две тысячи кубических сантиметров.",
          "Бит записал в заказ две тысячи литров. Такой сосуд не поместился бы в комнату.",
          "Прежде чем считать, предположи, сколько воды помещается в сосуд.",
        ],
        en: [
          "We are in the water supply control room. Here they count how much water goes into the city vessels.",
          "The sensor showed the volume of the vessel as two thousand cubic centimetres.",
          "Bit wrote two thousand litres into the order. A vessel like that would not fit in a room.",
          "Before you calculate, predict how much water the vessel holds.",
        ],
      },
    },
  },

  s1: {
    eyebrow: { uz: "Kashfiyot", ru: "Исследование", en: "Discovery" },
    title: { uz: "Kub detsimetr nimadan yig'iladi", ru: "Из чего собран кубический дециметр", en: "What a cubic decimetre is made of" },
    lead: { uz: "Qatlamlarni bosib qo'shing", ru: "Добавляй слои нажатием", en: "Tap to add the layers" },
    unitCube: { uz: "1 cm³", ru: "1 см³", en: "1 cm³" },
    rowLabel: { uz: "bir qator", ru: "один ряд", en: "one row" },
    layerLabel: { uz: "bir qatlam", ru: "один слой", en: "one layer" },
    cubeLabel: { uz: "butun kub", ru: "весь куб", en: "the whole cube" },
    steps: [
      { uz: "Bir qatorda 10 ta kubcha", ru: "В одном ряду 10 кубиков", en: "One row holds 10 cubes" },
      { uz: "Bir qatlamda 10 qator, ya'ni 100 ta", ru: "В одном слое 10 рядов, то есть 100", en: "One layer holds 10 rows, that is 100" },
      { uz: "10 qatlam: 1 dm³ = 1 000 cm³ = 1 l", ru: "10 слоёв: 1 дм³ = 1 000 см³ = 1 л", en: "10 layers: 1 dm³ = 1 000 cm³ = 1 l" },
    ],
    tapHint: { uz: "Qatlam qo'shing", ru: "Добавь слой", en: "Add a layer" },
    doneLabel: { uz: "Kub to'ldi", ru: "Куб заполнен", en: "The cube is full" },
    doneValue: { uz: "1 dm³ = 1 000 cm³", ru: "1 дм³ = 1 000 см³", en: "1 dm³ = 1 000 cm³" },
    audio: {
      intro: {
        uz: [
          "Hajmni birlik kublar bilan o'lchaymiz. Qirrasi bir santimetr bo'lgan kubcha bir kub santimetr.",
          "Qirrasi bir detsimetr bo'lgan kubni shunday kubchalar bilan to'ldiramiz. Bir qatorga o'nta sig'adi, bir qatlamga esa yuzta.",
          "O'nta qatlam yig'ilsa, ming kubcha bo'ladi. Bir kub detsimetr ming kub santimetrga teng va unga bir litr suv sig'adi.",
        ],
        ru: [
          "Объём измеряем единичными кубами. Кубик с ребром один сантиметр это один кубический сантиметр.",
          "Куб с ребром один дециметр заполняем такими кубиками. В один ряд помещается десять, в один слой сто.",
          "Когда слоёв десять, кубиков тысяча. Один кубический дециметр равен тысяче кубических сантиметров, и в него входит литр воды.",
        ],
        en: [
          "Volume is measured with unit cubes. A cube with an edge of one centimetre is one cubic centimetre.",
          "We fill a cube with an edge of one decimetre with such cubes. One row takes ten, one layer takes one hundred.",
          "With ten layers there are one thousand cubes. One cubic decimetre equals one thousand cubic centimetres and holds one litre of water.",
        ],
      },
    },
  },

  s2: {
    eyebrow: { uz: "Mashq", ru: "Задание", en: "Task" },
    title: { uz: "Sensor ko'rsatkichi", ru: "Показание датчика", en: "The sensor reading" },
    task: { uz: "2 000 cm³", ru: "2 000 см³", en: "2 000 cm³" },
    taskNote: { uz: "Shahar idishi", ru: "Городской сосуд", en: "City vessel" },
    question: { uz: "Idishga qancha suv sig'adi?", ru: "Сколько воды помещается в сосуд?", en: "How much water does the vessel hold?" },
    correctIndex: 0,
    options: [
      { uz: "2 l", ru: "2 л", en: "2 l" },
      { uz: "2 000 l", ru: "2 000 л", en: "2 000 l" },
      { uz: "20 l", ru: "20 л", en: "20 l" },
      { uz: "200 l", ru: "200 л", en: "200 l" },
    ],
    feedback: [
      { uz: "To'g'ri. Har 1 000 cm³ bitta litr, demak 2 000 cm³ bu 2 l.", ru: "Верно. Каждые 1 000 см³ это литр, значит 2 000 см³ это 2 л.", en: "Right. Every 1 000 cm³ is a litre, so 2 000 cm³ is 2 l." },
      { uz: "Bu Bitning xatosi: son ko'chirilgan, birlik esa almashtirilmagan.", ru: "Это ошибка Бита: число переписано, а единица не переведена.", en: "That is Bit's mistake: the number was copied but the unit was not converted." },
      { uz: "Nollarni sanang. Bir litrda 1 000 cm³ bor, 100 emas.", ru: "Посчитай нули. В литре 1 000 см³, а не 100.", en: "Count the zeros. A litre holds 1 000 cm³, not 100." },
      { uz: "Nollarni sanang. Bir litrda 1 000 cm³ bor, 10 emas.", ru: "Посчитай нули. В литре 1 000 см³, а не 10.", en: "Count the zeros. A litre holds 1 000 cm³, not 10." },
    ],
    proof: { uz: "2 000 cm³ = 2 dm³ = 2 l", ru: "2 000 см³ = 2 дм³ = 2 л", en: "2 000 cm³ = 2 dm³ = 2 l" },
    audio: {
      intro: {
        uz: [
          "Endi sensor ko'rsatkichini o'qiymiz.",
          "Har ming kub santimetr bitta litr edi. Javobni tanlang.",
        ],
        ru: [
          "Теперь прочитаем показание датчика.",
          "Каждая тысяча кубических сантиметров была литром. Выбери ответ.",
        ],
        en: [
          "Now let us read the sensor value.",
          "Every thousand cubic centimetres was one litre. Choose the answer.",
        ],
      },
      on_correct: { uz: "To'g'ri. Son emas, birlik o'zgardi.", ru: "Верно. Изменилось не число, а единица.", en: "Right. It is not the number that changed but the unit." },
      on_wrong: [
        { uz: "To'g'ri javob.", ru: "Верный ответ.", en: "The correct answer." },
        { uz: "Birlik almashtirilmagan. Kub santimetr litr emas.", ru: "Единица не переведена. Кубический сантиметр это не литр.", en: "The unit was not converted. A cubic centimetre is not a litre." },
        { uz: "Bir litrda ming kub santimetr bor. Nollarni qaytadan sanang.", ru: "В литре тысяча кубических сантиметров. Пересчитай нули.", en: "A litre holds a thousand cubic centimetres. Count the zeros again." },
        { uz: "Bir litrda ming kub santimetr bor. Nollarni qaytadan sanang.", ru: "В литре тысяча кубических сантиметров. Пересчитай нули.", en: "A litre holds a thousand cubic centimetres. Count the zeros again." },
      ],
    },
  },

  s3: {
    eyebrow: { uz: "Model", ru: "Модель", en: "Model" },
    title: { uz: "Hajm qanday sanaladi", ru: "Как считают объём", en: "How volume is counted" },
    lead: { uz: "Har qadamni bosib oching", ru: "Открывай каждый шаг нажатием", en: "Tap to open each step" },
    leftLabel: { uz: "Qutida nima ko'rinadi", ru: "Что видно в коробке", en: "What the box shows" },
    rightLabel: { uz: "Hisob", ru: "Расчёт", en: "The count" },
    rows: [
      {
        step: { uz: "1-qadam. Bir qatlamdagi kublarni sanaymiz", ru: "Шаг 1. Считаем кубы в одном слое", en: "Step 1. Count the cubes in one layer" },
        left: { uz: "asos: 4 ta va 3 ta", ru: "основание: 4 и 3", en: "base: 4 and 3" },
        right: { uz: "4 · 3 = 12", ru: "4 · 3 = 12", en: "4 · 3 = 12" },
      },
      {
        step: { uz: "2-qadam. Qatlamlar soniga ko'paytiramiz", ru: "Шаг 2. Умножаем на число слоёв", en: "Step 2. Multiply by the number of layers" },
        left: { uz: "qatlam: 2 ta", ru: "слоёв: 2", en: "layers: 2" },
        right: { uz: "12 · 2 = 24", ru: "12 · 2 = 24", en: "12 · 2 = 24" },
      },
      {
        step: { uz: "3-qadam. Birlikni yozamiz", ru: "Шаг 3. Записываем единицу", en: "Step 3. Write the unit" },
        left: { uz: "kubcha qirrasi 1 cm", ru: "ребро кубика 1 см", en: "cube edge 1 cm" },
        right: { uz: "24 cm³", ru: "24 см³", en: "24 cm³" },
      },
    ],
    ruleNote: { uz: "Hajm birlik kublar soniga teng", ru: "Объём равен числу единичных кубов", en: "Volume equals the number of unit cubes" },
    audio: {
      intro: {
        uz: [
          "Qutining hajmini topamiz. Avval bitta qatlamdagi kubchalarni sanaymiz.",
          "Qatlamlar soniga ko'paytiramiz va butun qutidagi kubchalar soni chiqadi.",
          "Oxirida birlikni yozamiz. Kubcha qirrasi bir santimetr, demak javob kub santimetrda.",
        ],
        ru: [
          "Находим объём коробки. Сначала считаем кубики в одном слое.",
          "Умножаем на число слоёв и получаем, сколько кубиков во всей коробке.",
          "В конце записываем единицу. Ребро кубика один сантиметр, значит ответ в кубических сантиметрах.",
        ],
        en: [
          "We find the volume of the box. First we count the cubes in one layer.",
          "We multiply by the number of layers and get how many cubes the whole box holds.",
          "At the end we write the unit. The cube edge is one centimetre, so the answer is in cubic centimetres.",
        ],
      },
    },
  },

  s4: {
    eyebrow: { uz: "Mashq", ru: "Задание", en: "Task" },
    title: { uz: "Yangi quti", ru: "Новая коробка", en: "A new box" },
    task: { uz: "5 cm · 3 cm · 2 cm", ru: "5 см · 3 см · 2 см", en: "5 cm · 3 cm · 2 cm" },
    taskNote: { uz: "Filtr qutisi", ru: "Коробка фильтра", en: "Filter box" },
    question: { uz: "Javobni yig'ing", ru: "Собери ответ", en: "Build the answer" },
    slots: [
      { key: "value", label: { uz: "kublar soni", ru: "число кубов", en: "number of cubes" }, answer: 30, tiles: [10, 30, 60] },
      { key: "unit", label: { uz: "birlik", ru: "единица", en: "unit" }, answer: 1, tiles: [0, 1, 2] },
    ],
    unitNames: [
      { uz: "cm", ru: "см", en: "cm" },
      { uz: "cm³", ru: "см³", en: "cm³" },
      { uz: "cm²", ru: "см²", en: "cm²" },
    ],
    okText: { uz: "To'g'ri. Bir qatlamda 15 ta kub, qatlam ikkita, jami 30 cm³.", ru: "Верно. В слое 15 кубов, слоёв два, всего 30 см³.", en: "Right. A layer holds 15 cubes, there are two layers, so 30 cm³ in all." },
    wrongT: { uz: "Kublar soni boshqacha. Avval asosdagi kublarni sanang, keyin qatlamga ko'paytiring.", ru: "Число кубов другое. Сначала посчитай кубы в основании, потом умножь на слои.", en: "The number of cubes is different. Count the base cubes first, then multiply by the layers." },
    wrongQ: { uz: "Birlik boshqacha. Hajm kub birlikda o'lchanadi.", ru: "Единица другая. Объём измеряется в кубических единицах.", en: "The unit is different. Volume is measured in cubic units." },
    proof: { uz: "5 · 3 = 15 · 2 = 30 → 30 cm³", ru: "5 · 3 = 15 · 2 = 30 → 30 см³", en: "5 · 3 = 15 · 2 = 30 → 30 cm³" },
    audio: {
      intro: {
        uz: [
          "Filtr qutisiga nechta kubcha sig'adi.",
          "Asosdagi kublarni sanang, qatlamga ko'paytiring va birlikni ham tanlang.",
        ],
        ru: [
          "Сколько кубиков помещается в коробку фильтра.",
          "Посчитай кубы в основании, умножь на слои и выбери единицу.",
        ],
        en: [
          "How many cubes fit into the filter box.",
          "Count the base cubes, multiply by the layers and choose the unit as well.",
        ],
      },
      on_correct: { uz: "To'g'ri. Hajm kub birlikda yoziladi.", ru: "Верно. Объём записывают в кубических единицах.", en: "Right. Volume is written in cubic units." },
      on_wrong: { uz: "Asosni sanang, keyin qatlamga ko'paytiring.", ru: "Посчитай основание, потом умножь на слои.", en: "Count the base, then multiply by the layers." },
    },
  },

  s5: {
    eyebrow: { uz: "Kashfiyot", ru: "Исследование", en: "Discovery" },
    title: { uz: "Uchta kub, bitta qadam", ru: "Три куба, один шаг", en: "Three cubes, one step" },
    lead: { uz: "O'qlarni bosib oching", ru: "Открывай стрелки нажатием", en: "Tap the arrows to open them" },
    source: { uz: "Hajm birliklari zinapoyasi", ru: "Лестница единиц объёма", en: "Ladder of volume units" },
    rungs: [
      { name: { uz: "1 cm³", ru: "1 см³", en: "1 cm³" }, edge: { uz: "qirrasi 1 cm", ru: "ребро 1 см", en: "edge 1 cm" } },
      { name: { uz: "1 dm³", ru: "1 дм³", en: "1 dm³" }, edge: { uz: "qirrasi 1 dm", ru: "ребро 1 дм", en: "edge 1 dm" } },
      { name: { uz: "1 m³", ru: "1 м³", en: "1 m³" }, edge: { uz: "qirrasi 1 m", ru: "ребро 1 м", en: "edge 1 m" } },
    ],
    stepLabel: { uz: "· 1 000", ru: "· 1 000", en: "· 1 000" },
    litreNote: { uz: "1 dm³ ga 1 litr suv sig'adi", ru: "В 1 дм³ помещается 1 литр воды", en: "1 dm³ holds 1 litre of water" },
    litreValue: { uz: "1 dm³ = 1 l", ru: "1 дм³ = 1 л", en: "1 dm³ = 1 l" },
    audio: {
      intro: {
        uz: [
          "Hajm birliklari ham zinapoya bo'lib turadi. Har qadamda kub qirrasi o'n barobar uzayadi.",
          "Qirra o'n barobar uzaysa, kubchalar soni ming barobar ortadi. Kub santimetrdan kub detsimetrga o'tamiz.",
          "Yana bir qadam va kub metr chiqadi. Bir kub detsimetrga esa bir litr suv sig'adi.",
        ],
        ru: [
          "Единицы объёма тоже стоят лесенкой. На каждом шаге ребро куба становится в десять раз длиннее.",
          "Когда ребро длиннее в десять раз, кубиков становится в тысячу раз больше. Переходим от кубического сантиметра к кубическому дециметру.",
          "Ещё шаг и получается кубический метр. А в один кубический дециметр входит литр воды.",
        ],
        en: [
          "The volume units also stand like a ladder. At every step the cube edge becomes ten times longer.",
          "When the edge is ten times longer, the number of cubes grows a thousand times. We move from the cubic centimetre to the cubic decimetre.",
          "One more step and the cubic metre appears. And one cubic decimetre holds one litre of water.",
        ],
      },
    },
  },

  s6: {
    eyebrow: { uz: "Mashq", ru: "Задание", en: "Task" },
    title: { uz: "Katta rezervuar", ru: "Большой резервуар", en: "The big tank" },
    task: { uz: "2 m³", ru: "2 м³", en: "2 m³" },
    taskNote: { uz: "Rezervuar hajmi", ru: "Объём резервуара", en: "Tank volume" },
    question: { uz: "2 m³ necha dm³ ga teng?", ru: "Скольким дм³ равны 2 м³?", en: "How many dm³ are 2 m³?" },
    correctIndex: 0,
    options: [
      { uz: "2 000 dm³", ru: "2 000 дм³", en: "2 000 dm³" },
      { uz: "200 dm³", ru: "200 дм³", en: "200 dm³" },
      { uz: "20 000 dm³", ru: "20 000 дм³", en: "20 000 dm³" },
      { uz: "20 dm³", ru: "20 дм³", en: "20 dm³" },
    ],
    feedback: [
      { uz: "To'g'ri. Bir kub metrda 1 000 kub detsimetr bor, ikkitasida 2 000.", ru: "Верно. В кубическом метре 1 000 кубических дециметров, в двух 2 000.", en: "Right. A cubic metre holds 1 000 cubic decimetres, two hold 2 000." },
      { uz: "Bu yuz barobar. Zinapoyada qadam ming barobar edi.", ru: "Это в сто раз. А шаг на лестнице был в тысячу раз.", en: "That is a hundred times. The ladder step was a thousand times." },
      { uz: "Bu o'n ming barobar. Bitta qadam ortiqcha olindi.", ru: "Это в десять тысяч раз. Взят лишний шаг.", en: "That is ten thousand times. One extra step was taken." },
      { uz: "Bu o'n barobar. Uzunlik zinapoyasi bilan aralashib ketdi.", ru: "Это в десять раз. Перепуталось с лестницей длины.", en: "That is ten times. It got mixed up with the length ladder." },
    ],
    proof: { uz: "1 m³ = 1 000 dm³ → 2 m³ = 2 000 dm³", ru: "1 м³ = 1 000 дм³ → 2 м³ = 2 000 дм³", en: "1 m³ = 1 000 dm³ → 2 m³ = 2 000 dm³" },
    audio: {
      intro: {
        uz: [
          "Shahar rezervuarining hajmi ikki kub metr.",
          "Uni kub detsimetrda ifodalang. Zinapoyadagi qadamni eslang.",
        ],
        ru: [
          "Объём городского резервуара два кубических метра.",
          "Вырази его в кубических дециметрах. Вспомни шаг на лестнице.",
        ],
        en: [
          "The volume of the city tank is two cubic metres.",
          "Express it in cubic decimetres. Remember the step on the ladder.",
        ],
      },
      on_correct: { uz: "To'g'ri. Bir qadam ming barobar.", ru: "Верно. Один шаг это тысяча раз.", en: "Right. One step is a thousand times." },
      on_wrong: [
        { uz: "To'g'ri javob.", ru: "Верный ответ.", en: "The correct answer." },
        { uz: "Qadam yuz barobar emas. Kub ichida ming kubcha bor.", ru: "Шаг не в сто раз. В кубе тысяча кубиков.", en: "The step is not a hundred times. A cube holds a thousand cubes." },
        { uz: "Bitta qadam yetadi. Kub metrdan darrov kub detsimetrga o'tamiz.", ru: "Хватит одного шага. От кубометра сразу переходим к кубическому дециметру.", en: "One step is enough. From the cubic metre we go straight to the cubic decimetre." },
        { uz: "Bu uzunlik qadami. Hajmda qadam ming barobar.", ru: "Это шаг длины. В объёме шаг в тысячу раз.", en: "That is the length step. In volume the step is a thousand times." },
      ],
    },
  },

  s7: {
    eyebrow: { uz: "Xatoni topish", ru: "Разбор ошибки", en: "Spot the error" },
    title: { uz: "Bitning hisobi", ru: "Расчёт Бита", en: "Bit's calculation" },
    lead: { uz: "Xato boshlangan qatorni bosing", ru: "Нажми на строку, где началась ошибка", en: "Tap the row where the error starts" },
    source: { uz: "Nasos qutisi", ru: "Коробка насоса", en: "Pump box" },
    answerIndex: 2,
    rows: [
      { uz: "Qutining o'lchamlari: 6 cm, 2 cm, 3 cm", ru: "Размеры коробки: 6 см, 2 см, 3 см", en: "Box sizes: 6 cm, 2 cm, 3 cm" },
      { uz: "6 · 2 = 12, bir qatlamda 12 kubcha", ru: "6 · 2 = 12, в одном слое 12 кубиков", en: "6 · 2 = 12, one layer holds 12 cubes" },
      { uz: "12 + 3 = 15, ya'ni 15 cm³", ru: "12 + 3 = 15, то есть 15 см³", en: "12 + 3 = 15, that is 15 cm³" },
      { uz: "Javob: 15 cm³", ru: "Ответ: 15 см³", en: "Answer: 15 cm³" },
    ],
    rowFeedback: [
      { uz: "Bu qator to'g'ri. Uch o'lcham shu yerdan olinadi.", ru: "Эта строка верная. Три размера берутся отсюда.", en: "This row is correct. The three sizes come from here." },
      { uz: "Bu ham to'g'ri. Asosdagi kubchalar shunday sanaladi.", ru: "И это верно. Кубики в основании считаются именно так.", en: "This is correct too. The base cubes are counted exactly like this." },
      { uz: "Aynan shu yerda. Qatlamlar qo'shilmaydi, balki qatlam soniga ko'paytiriladi.", ru: "Именно здесь. Слои не прибавляют, а умножают на их число.", en: "Exactly here. The layers are not added, they are multiplied by their number." },
      { uz: "Bu javob, ya'ni xatoning natijasi. Xato yuqoriroqda boshlangan.", ru: "Это ответ, то есть последствие ошибки. Ошибка началась выше.", en: "This is the answer, the consequence of the error. The error started higher up." },
    ],
    fixLabel: { uz: "To'g'ri yo'l", ru: "Верный путь", en: "The correct way" },
    fix: { uz: "6 · 2 = 12 · 3 = 36 → 36 cm³", ru: "6 · 2 = 12 · 3 = 36 → 36 см³", en: "6 · 2 = 12 · 3 = 36 → 36 cm³" },
    audio: {
      intro: {
        uz: [
          "Bit nasos qutisining hajmini hisobladi. Javobi juda kichik chiqdi.",
          "Qaysi qatorda xato boshlanganini toping va bosing.",
        ],
        ru: [
          "Бит посчитал объём коробки насоса. Ответ вышел слишком маленьким.",
          "Найди строку, где началась ошибка, и нажми на неё.",
        ],
        en: [
          "Bit calculated the volume of the pump box. The answer came out far too small.",
          "Find the row where the error starts and tap it.",
        ],
      },
      on_correct: { uz: "To'g'ri. Har bir qatlamda o'n ikkitadan kubcha bor, qatlam esa uchta.", ru: "Верно. В каждом слое по двенадцать кубиков, а слоёв три.", en: "Right. Each layer holds twelve cubes and there are three layers." },
      on_wrong: { uz: "Har bir qatorni ketma-ket o'qing. Birinchi buzilgan qadamni qidiring.", ru: "Читай строки по порядку. Ищи первый сломанный шаг.", en: "Read the rows in order. Look for the first broken step." },
    },
  },

  s8: {
    eyebrow: { uz: "Kashfiyot", ru: "Исследование", en: "Discovery" },
    title: { uz: "Avval taxmin, keyin hisob", ru: "Сначала оценка, потом расчёт", en: "Estimate first, then calculate" },
    lead: { uz: "Javob qaysi oraliqda bo'lishini tanlang", ru: "Выбери, в каком промежутке будет ответ", en: "Choose the range the answer falls into" },
    task: { uz: "9 cm · 4 cm · 5 cm", ru: "9 см · 4 см · 5 см", en: "9 cm · 4 cm · 5 cm" },
    bands: [
      { uz: "50 – 100 cm³", ru: "50 – 100 см³", en: "50 – 100 cm³" },
      { uz: "150 – 200 cm³", ru: "150 – 200 см³", en: "150 – 200 cm³" },
      { uz: "600 – 700 cm³", ru: "600 – 700 см³", en: "600 – 700 cm³" },
    ],
    answerIndex: 1,
    bandFeedback: [
      { uz: "Kam. Faqat bitta qatlamda ham o'ttiz oltita kubcha bor.", ru: "Мало. Даже в одном слое тридцать шесть кубиков.", en: "Too little. Even one layer holds thirty six cubes." },
      { uz: "Ha. Qatlamda taxminan qirqta kubcha, qatlam esa beshta.", ru: "Да. В слое примерно сорок кубиков, а слоёв пять.", en: "Yes. A layer holds about forty cubes and there are five layers." },
      { uz: "Ko'p. Bunday son uchun qatlam ancha kattaroq bo'lishi kerak.", ru: "Много. Для такого числа слой должен быть заметно больше.", en: "Too much. For such a number the layer would have to be much bigger." },
    ],
    exact: { uz: "9 · 4 · 5 = 180 cm³", ru: "9 · 4 · 5 = 180 см³", en: "9 · 4 · 5 = 180 cm³" },
    exactLabel: { uz: "Aniq javob taxmin ichiga tushdi", ru: "Точный ответ попал в оценку", en: "The exact answer landed inside the estimate" },
    audio: {
      intro: {
        uz: [
          "Uzun hisobdan oldin javobni baholaymiz.",
          "Bir qatlamda taxminan qirqta kubcha, qatlam esa beshta. Oraliqni tanlang.",
          "Aniq hisob bir yuz sakson kub santimetr berdi. Taxmin to'g'ri chiqdi.",
        ],
        ru: [
          "Перед длинным расчётом оцениваем ответ.",
          "В одном слое примерно сорок кубиков, а слоёв пять. Выбери промежуток.",
          "Точный расчёт дал сто восемьдесят кубических сантиметров. Оценка подтвердилась.",
        ],
        en: [
          "Before a long calculation we estimate the answer.",
          "One layer holds about forty cubes and there are five layers. Choose the range.",
          "The exact calculation gave one hundred eighty cubic centimetres. The estimate held.",
        ],
      },
    },
  },

  s9: {
    eyebrow: { uz: "Mashq", ru: "Задание", en: "Task" },
    title: { uz: "Aniq hajm", ru: "Точный объём", en: "The exact volume" },
    task: { uz: "9 cm · 4 cm · 5 cm", ru: "9 см · 4 см · 5 см", en: "9 cm · 4 cm · 5 cm" },
    taskNote: { uz: "taxmin: 150 – 200 cm³", ru: "оценка: 150 – 200 см³", en: "estimate: 150 – 200 cm³" },
    question: { uz: "Qutining hajmi qancha?", ru: "Каков объём коробки?", en: "What is the volume of the box?" },
    correctIndex: 0,
    options: [
      { uz: "180 cm³", ru: "180 см³", en: "180 cm³" },
      { uz: "18 cm³", ru: "18 см³", en: "18 cm³" },
      { uz: "45 cm³", ru: "45 см³", en: "45 cm³" },
      { uz: "1 800 cm³", ru: "1 800 см³", en: "1 800 cm³" },
    ],
    feedback: [
      { uz: "To'g'ri. Qatlamda 36 kubcha, qatlam beshta, jami 180.", ru: "Верно. В слое 36 кубиков, слоёв пять, всего 180.", en: "Right. A layer holds 36 cubes, there are five layers, 180 in all." },
      { uz: "Bu uch o'lchamning yig'indisi. Hajmda ular ko'paytiriladi.", ru: "Это сумма трёх размеров. В объёме их умножают.", en: "That is the sum of the three sizes. In volume they are multiplied." },
      { uz: "Bu ikki o'lchamning ko'paytmasi. Uchinchisi qolib ketdi.", ru: "Это произведение двух размеров. Третий остался в стороне.", en: "That is the product of two sizes. The third one was left out." },
      { uz: "Bitta nol ortiqcha. Taxmin ikki yuzdan kichik edi.", ru: "Один ноль лишний. Оценка была меньше двухсот.", en: "One zero too many. The estimate was below two hundred." },
    ],
    proof: { uz: "9 · 4 = 36 · 5 = 180 → 180 cm³", ru: "9 · 4 = 36 · 5 = 180 → 180 см³", en: "9 · 4 = 36 · 5 = 180 → 180 cm³" },
    audio: {
      intro: {
        uz: [
          "Taxmin tayyor. Endi aniq javobni toping.",
          "Asosni sanang, keyin qatlamga ko'paytiring. Javobni taxmin bilan solishtiring.",
        ],
        ru: [
          "Оценка есть. Теперь найди точный ответ.",
          "Посчитай основание, потом умножь на слои. Сравни ответ с оценкой.",
        ],
        en: [
          "The estimate is ready. Now find the exact answer.",
          "Count the base, then multiply by the layers. Compare the answer with the estimate.",
        ],
      },
      on_correct: { uz: "To'g'ri. Javob taxmin ichiga tushdi.", ru: "Верно. Ответ попал в оценку.", en: "Right. The answer landed inside the estimate." },
      on_wrong: [
        { uz: "To'g'ri javob.", ru: "Верный ответ.", en: "The correct answer." },
        { uz: "O'lchamlar qo'shilmaydi. Kubchalar soni ko'paytirish bilan topiladi.", ru: "Размеры не складывают. Число кубиков находят умножением.", en: "The sizes are not added. The number of cubes is found by multiplying." },
        { uz: "Uchinchi o'lchamni ham hisobga oling. Qatlam bitta emas.", ru: "Учти и третий размер. Слой не один.", en: "Take the third size into account too. There is more than one layer." },
        { uz: "Javobni taxmin bilan solishtiring. Ming sakkiz yuz oraliqdan tashqarida.", ru: "Сравни ответ с оценкой. Тысяча восемьсот вне промежутка.", en: "Compare the answer with the estimate. One thousand eight hundred is outside the range." },
      ],
    },
  },

  s10: {
    eyebrow: { uz: "Qoida", ru: "Правило", en: "Rule" },
    title: { uz: "Hajm qoidasi", ru: "Правило объёма", en: "The volume rule" },
    lead: { uz: "Qadamlarni tartib bilan bosing", ru: "Нажимай шаги по порядку", en: "Tap the steps in order" },
    parts: [
      { uz: "Bir qatlamdagi kublarni sanaymiz", ru: "Считаем кубы в одном слое", en: "Count the cubes in one layer" },
      { uz: "Qatlamlar soniga ko'paytiramiz", ru: "Умножаем на число слоёв", en: "Multiply by the number of layers" },
      { uz: "Javobga kub birlikni yozamiz", ru: "Записываем к ответу кубическую единицу", en: "Write the cubic unit with the answer" },
      { uz: "Kerak bo'lsa litrga aylantiramiz", ru: "Если нужно, переводим в литры", en: "If needed, convert to litres" },
    ],
    slotLabel: { uz: "Qoida", ru: "Правило", en: "Rule" },
    bankLabel: { uz: "Qadamlar", ru: "Шаги", en: "Steps" },
    resetLabel: { uz: "Qayta tuzish", ru: "Собрать заново", en: "Start again" },
    memo: { uz: "Qatlam → qatlamlar soni → birlik", ru: "Слой → число слоёв → единица", en: "Layer → number of layers → unit" },
    okText: { uz: "Qoida yig'ildi", ru: "Правило собрано", en: "The rule is assembled" },
    wrongText: { uz: "Tartib buzildi. Avval qatlam, keyin qatlamlar soni.", ru: "Порядок нарушен. Сначала слой, потом число слоёв.", en: "The order is broken. First the layer, then the number of layers." },
    audio: {
      intro: {
        uz: [
          "Bugungi usulni bitta qoidaga yig'amiz.",
          "To'rtta qadam bor va ularning tartibi muhim. Qadamlarni ketma-ket bosing.",
          "Shu qoida kichik qutiga ham, katta rezervuarga ham bir xil ishlaydi.",
        ],
        ru: [
          "Соберём сегодняшний способ в одно правило.",
          "Шагов четыре и их порядок важен. Нажимай шаги по очереди.",
          "Это правило одинаково работает и для маленькой коробки, и для большого резервуара.",
        ],
        en: [
          "Let us gather today's method into one rule.",
          "There are four steps and their order matters. Tap the steps one after another.",
          "The rule works the same way for a small box and for a big tank.",
        ],
      },
    },
  },

  s11: {
    eyebrow: { uz: "Tekshiruv", ru: "Проверка", en: "Check" },
    title: { uz: "Uchta tez savol", ru: "Три быстрых вопроса", en: "Three quick questions" },
    source: { uz: "O'lchov jurnali", ru: "Журнал измерений", en: "Measurement log" },
    rounds: [
      {
        prompt: { uz: "5 dm³ necha litr?", ru: "Сколько литров в 5 дм³?", en: "How many litres are 5 dm³?" },
        tiles: [
          { uz: "5 l", ru: "5 л", en: "5 l" },
          { uz: "50 l", ru: "50 л", en: "50 l" },
          { uz: "5 000 l", ru: "5 000 л", en: "5 000 l" },
        ],
        answer: 0,
        ok: { uz: "Bir kub detsimetr bitta litr.", ru: "Один кубический дециметр это литр.", en: "One cubic decimetre is one litre." },
        no: { uz: "Kub detsimetr va litr bir xil hajm.", ru: "Кубический дециметр и литр это один и тот же объём.", en: "A cubic decimetre and a litre are the same volume." },
      },
      {
        prompt: { uz: "3 000 cm³ necha dm³?", ru: "Сколько дм³ в 3 000 см³?", en: "How many dm³ are 3 000 cm³?" },
        tiles: [
          { uz: "30 dm³", ru: "30 дм³", en: "30 dm³" },
          { uz: "3 dm³", ru: "3 дм³", en: "3 dm³" },
          { uz: "300 dm³", ru: "300 дм³", en: "300 dm³" },
        ],
        answer: 1,
        ok: { uz: "Har ming kub santimetr bitta kub detsimetr.", ru: "Каждая тысяча кубических сантиметров это кубический дециметр.", en: "Every thousand cubic centimetres is one cubic decimetre." },
        no: { uz: "Qadam ming barobar. Nollarni sanang.", ru: "Шаг в тысячу раз. Посчитай нули.", en: "The step is a thousand times. Count the zeros." },
      },
      {
        prompt: { uz: "1 m³ necha dm³?", ru: "Сколько дм³ в 1 м³?", en: "How many dm³ are in 1 m³?" },
        tiles: [
          { uz: "100 dm³", ru: "100 дм³", en: "100 dm³" },
          { uz: "10 dm³", ru: "10 дм³", en: "10 dm³" },
          { uz: "1 000 dm³", ru: "1 000 дм³", en: "1 000 dm³" },
        ],
        answer: 2,
        ok: { uz: "Qirra o'n barobar, kublar soni ming barobar.", ru: "Ребро в десять раз, а кубиков в тысячу раз.", en: "The edge is ten times, the cubes a thousand times." },
        no: { uz: "Bu yuz emas. Hajmda qadam ming barobar.", ru: "Это не сто. В объёме шаг в тысячу раз.", en: "That is not a hundred. In volume the step is a thousand times." },
      },
    ],
    counter: { uz: "savol", ru: "вопрос", en: "question" },
    doneText: { uz: "Uch savol ham yopildi", ru: "Все три вопроса закрыты", en: "All three questions are closed" },
    audio: {
      intro: {
        uz: [
          "O'lchov jurnalida uchta yozuv qoldi.",
          "Har birini kerakli birlikda ifodalang. Javobni bosing.",
        ],
        ru: [
          "В журнале измерений осталось три записи.",
          "Вырази каждую в нужной единице. Нажми ответ.",
        ],
        en: [
          "Three records are left in the measurement log.",
          "Express each one in the unit that is asked for. Tap the answer.",
        ],
      },
    },
  },

  s12: {
    eyebrow: { uz: "Strategiya", ru: "Стратегия", en: "Strategy" },
    title: { uz: "Qaysi yo'l qulayroq", ru: "Какой путь удобнее", en: "Which way is more convenient" },
    lead: { uz: "Qirrasi 20 cm bo'lgan kub idish — ikki yo'l ham to'g'ri", ru: "Кубический сосуд с ребром 20 см — оба пути верны", en: "A cube vessel with a 20 cm edge — both ways are correct" },
    source: { uz: "Idish hisobi", ru: "Расчёт сосуда", en: "Vessel calculation" },
    routes: [
      {
        name: { uz: "Santimetrda hisoblab", ru: "Считая в сантиметрах", en: "Counting in centimetres" },
        lines: [
          { uz: "20 · 20 = 400", ru: "20 · 20 = 400", en: "20 · 20 = 400" },
          { uz: "400 · 20 = 8 000 cm³", ru: "400 · 20 = 8 000 см³", en: "400 · 20 = 8 000 cm³" },
          { uz: "8 000 cm³ = 8 l", ru: "8 000 см³ = 8 л", en: "8 000 cm³ = 8 l" },
        ],
      },
      {
        name: { uz: "Avval detsimetrga o'tib", ru: "Сначала перейдя к дециметрам", en: "By moving to decimetres first" },
        lines: [
          { uz: "20 cm = 2 dm", ru: "20 см = 2 дм", en: "20 cm = 2 dm" },
          { uz: "2 · 2 · 2 = 8 dm³", ru: "2 · 2 · 2 = 8 дм³", en: "2 · 2 · 2 = 8 dm³" },
          { uz: "8 dm³ = 8 l", ru: "8 дм³ = 8 л", en: "8 dm³ = 8 l" },
        ],
      },
    ],
    answerIndex: 1,
    routeFeedback: [
      { uz: "Bu yo'l ham to'g'ri javob beradi, lekin sakkiz mingni litrga qaytarish uzoqroq. Kichik qutilarda esa aynan shu yo'l qulay.", ru: "Этот путь тоже даёт верный ответ, но возвращать восемь тысяч в литры дольше. Зато для маленьких коробок удобен именно он.", en: "This way also gives the correct answer, but turning eight thousand back into litres takes longer. For small boxes, however, this is the handy one." },
      { uz: "Ha. Detsimetrda sonlar kichik qoladi va javob darrov litrda chiqadi.", ru: "Да. В дециметрах числа остаются маленькими и ответ сразу выходит в литрах.", en: "Yes. In decimetres the numbers stay small and the answer comes out in litres at once." },
    ],
    note: { uz: "Kichik qutida: 5 cm · 3 cm · 2 cm = 30 cm³", ru: "В маленькой коробке: 5 см · 3 см · 2 см = 30 см³", en: "In a small box: 5 cm · 3 cm · 2 cm = 30 cm³" },
    audio: {
      intro: {
        uz: [
          "Bitta idishni ikki yo'l bilan hisoblash mumkin. Ikkalasi ham to'g'ri.",
          "Chapda hammasini santimetrda sanaymiz. O'ngda avval detsimetrga o'tamiz.",
          "Shu misolda qaysi biri qulayroq deb o'ylaysiz. Kartani bosing.",
        ],
        ru: [
          "Один сосуд можно посчитать двумя путями. Оба верны.",
          "Слева считаем всё в сантиметрах. Справа сначала переходим к дециметрам.",
          "Как думаешь, какой путь удобнее именно здесь. Нажми на карточку.",
        ],
        en: [
          "One vessel can be counted in two ways. Both are correct.",
          "On the left we count everything in centimetres. On the right we move to decimetres first.",
          "Which one do you think is handier here. Tap a card.",
        ],
      },
    },
  },

  s13: {
    eyebrow: { uz: "Hayotiy vazifa", ru: "Задача из жизни", en: "Real-life task" },
    title: { uz: "Tungi zaxira", ru: "Ночной запас", en: "The night reserve" },
    task: { uz: "rezervuar: 3 m · 2 m · 2 m · kerak: 12 000 l", ru: "резервуар: 3 м · 2 м · 2 м · нужно: 12 000 л", en: "tank: 3 m · 2 m · 2 m · needed: 12 000 l" },
    question: { uz: "Rezervuar hajmi qancha va zaxira yetadimi?", ru: "Каков объём резервуара и хватит ли запаса?", en: "What is the tank volume and is the reserve enough?" },
    correctIndex: 0,
    options: [
      { uz: "12 m³, yetadi", ru: "12 м³, хватит", en: "12 m³, it is enough" },
      { uz: "12 m³, yetmaydi", ru: "12 м³, не хватит", en: "12 m³, it is not enough" },
      { uz: "7 m³, yetmaydi", ru: "7 м³, не хватит", en: "7 m³, it is not enough" },
      { uz: "120 m³, yetadi", ru: "120 м³, хватит", en: "120 m³, it is enough" },
    ],
    feedback: [
      { uz: "To'g'ri. 12 m³ bu 12 000 dm³, ya'ni roppa-rosa 12 000 l.", ru: "Верно. 12 м³ это 12 000 дм³, то есть ровно 12 000 л.", en: "Right. 12 m³ is 12 000 dm³, that is exactly 12 000 l." },
      { uz: "Hajm to'g'ri. Endi litrga aylantiring: 1 m³ bu 1 000 l.", ru: "Объём верный. Теперь переведи в литры: 1 м³ это 1 000 л.", en: "The volume is right. Now convert to litres: 1 m³ is 1 000 l." },
      { uz: "O'lchamlar qo'shilgan. Hajmda ular ko'paytiriladi.", ru: "Размеры сложены. В объёме их умножают.", en: "The sizes were added. In volume they are multiplied." },
      { uz: "Bitta nol ortiqcha. Uch, ikki va ikkini ko'paytiring.", ru: "Один ноль лишний. Умножь три, два и два.", en: "One zero too many. Multiply three, two and two." },
    ],
    proof: { uz: "3 · 2 · 2 = 12 m³ = 12 000 l", ru: "3 · 2 · 2 = 12 м³ = 12 000 л", en: "3 · 2 · 2 = 12 m³ = 12 000 l" },
    audio: {
      intro: {
        uz: [
          "Tungi zaxira uchun rezervuar to'ldiriladi. Uning o'lchamlari uch, ikki va ikki metr.",
          "Shaharga o'n ikki ming litr kerak. Hajmni toping va yetadimi deb tekshiring.",
        ],
        ru: [
          "Для ночного запаса наполняют резервуар. Его размеры три, два и два метра.",
          "Городу нужно двенадцать тысяч литров. Найди объём и проверь, хватит ли.",
        ],
        en: [
          "The tank is filled for the night reserve. Its sizes are three, two and two metres.",
          "The city needs twelve thousand litres. Find the volume and check whether it is enough.",
        ],
      },
      on_correct: { uz: "To'g'ri. Rezervuar roppa-rosa yetadi.", ru: "Верно. Резервуара хватает ровно.", en: "Right. The tank is exactly enough." },
      on_wrong: [
        { uz: "To'g'ri javob.", ru: "Верный ответ.", en: "The correct answer." },
        { uz: "Bir kub metrga ming litr sig'adi. Qaytadan solishtiring.", ru: "В один кубометр входит тысяча литров. Сравни ещё раз.", en: "One cubic metre holds a thousand litres. Compare again." },
        { uz: "Uch o'lchamni ko'paytiring, qo'shmang.", ru: "Три размера нужно умножить, а не сложить.", en: "The three sizes must be multiplied, not added." },
        { uz: "Ko'paytmani qaytadan hisoblang. Nollar soniga diqqat qiling.", ru: "Пересчитай произведение. Обрати внимание на нули.", en: "Recount the product. Watch the zeros." },
      ],
    },
  },

  s14: {
    eyebrow: { uz: "Yangi holat", ru: "Новый случай", en: "New case" },
    title: { uz: "Teskari savol", ru: "Обратный вопрос", en: "The inverse question" },
    task: { uz: "idishga 6 l suv sig'adi", ru: "в сосуд помещается 6 л воды", en: "the vessel holds 6 l of water" },
    question: { uz: "Idishning hajmi necha cm³?", ru: "Каков объём сосуда в см³?", en: "What is the volume of the vessel in cm³?" },
    correctIndex: 0,
    options: [
      { uz: "6 000 cm³", ru: "6 000 см³", en: "6 000 cm³" },
      { uz: "600 cm³", ru: "600 см³", en: "600 cm³" },
      { uz: "60 000 cm³", ru: "60 000 см³", en: "60 000 cm³" },
      { uz: "6 cm³", ru: "6 см³", en: "6 cm³" },
    ],
    feedback: [
      { uz: "To'g'ri. Har litr 1 000 cm³, oltitasi 6 000 cm³.", ru: "Верно. Каждый литр это 1 000 см³, шесть литров 6 000 см³.", en: "Right. Every litre is 1 000 cm³, six litres are 6 000 cm³." },
      { uz: "Bu yuz barobar. Litrda ming kub santimetr bor.", ru: "Это в сто раз. В литре тысяча кубических сантиметров.", en: "That is a hundred times. A litre holds a thousand cubic centimetres." },
      { uz: "Bu o'n ming barobar. Bitta qadam ortiqcha olindi.", ru: "Это в десять тысяч раз. Взят лишний шаг.", en: "That is ten thousand times. One extra step was taken." },
      { uz: "Bu yerda birlik umuman almashtirilmagan.", ru: "Здесь единица вообще не переведена.", en: "Here the unit was not converted at all." },
    ],
    proof: { uz: "1 l = 1 000 cm³ → 6 l = 6 000 cm³", ru: "1 л = 1 000 см³ → 6 л = 6 000 см³", en: "1 l = 1 000 cm³ → 6 l = 6 000 cm³" },
    audio: {
      intro: {
        uz: [
          "Endi teskari savol. Idishga olti litr suv sig'adi.",
          "Uning hajmini kub santimetrda ifodalang va javobni teskari yo'l bilan tekshiring.",
        ],
        ru: [
          "Теперь обратный вопрос. В сосуд помещается шесть литров воды.",
          "Вырази его объём в кубических сантиметрах и проверь ответ обратным ходом.",
        ],
        en: [
          "Now the inverse question. The vessel holds six litres of water.",
          "Express its volume in cubic centimetres and check the answer the other way round.",
        ],
      },
      on_correct: { uz: "To'g'ri. Teskari yo'l ham shuni beradi.", ru: "Верно. Обратный ход даёт то же самое.", en: "Right. The inverse path gives the same." },
      on_wrong: [
        { uz: "To'g'ri javob.", ru: "Верный ответ.", en: "The correct answer." },
        { uz: "Bir litr ming kub santimetr. Nollarni sanang.", ru: "Один литр это тысяча кубических сантиметров. Посчитай нули.", en: "One litre is a thousand cubic centimetres. Count the zeros." },
        { uz: "Bitta qadam yetadi. Litrdan darrov kub santimetrga o'tamiz.", ru: "Хватит одного шага. От литра сразу переходим к кубическому сантиметру.", en: "One step is enough. From the litre we go straight to the cubic centimetre." },
        { uz: "Birlik almashtirilmagan. Litr kub santimetr emas.", ru: "Единица не переведена. Литр это не кубический сантиметр.", en: "The unit was not converted. A litre is not a cubic centimetre." },
      ],
    },
  },

  s15: {
    eyebrow: { uz: "Yakun", ru: "Итог", en: "Summary" },
    title: { uz: "Nazorat yopildi", ru: "Контроль закрыт", en: "The control room is closed" },
    rewardTitle: { uz: "Hajm nazoratchisi", ru: "Контролёр объёма", en: "Volume controller" },
    lead: {
      uz: "Bugungi usul bitta xaritaga yig'ildi.",
      ru: "Сегодняшний способ собрался в одну карту.",
      en: "Today's method now fits on one map.",
    },
    frames: [
      { uz: "Hajm birlik kublar soni bilan o'lchanadi", ru: "Объём измеряется числом единичных кубов", en: "Volume is measured by the number of unit cubes" },
      { uz: "Qatlamdagi kublarni qatlamlar soniga ko'paytiramiz", ru: "Кубы в слое умножаем на число слоёв", en: "Multiply the cubes in a layer by the number of layers" },
      { uz: "Hajm zinapoyasida qadam 1 000 barobar", ru: "На лестнице объёма шаг в 1 000 раз", en: "On the volume ladder the step is 1 000 times" },
      { uz: "2 000 cm³ = 2 dm³ = 2 l", ru: "2 000 см³ = 2 дм³ = 2 л", en: "2 000 cm³ = 2 dm³ = 2 l" },
      { uz: "Keyingi missiya: burchak turlari", ru: "Следующая миссия: виды углов", en: "Next mission: types of angles" },
    ],
    audio: {
      intro: {
        uz: [
          "Nazorat xonasi yopildi. Bugun hajm bilan ishlashni o'rgandingiz.",
          "Hajm birlik kublar soni bilan o'lchanadi. Bir qatlamni sanab, qatlamlar soniga ko'paytiramiz.",
          "Hajm zinapoyasida har qadam ming barobar, chunki qirra o'n barobar uzayadi.",
          "Bir kub detsimetrga bir litr suv sig'adi. Sensor yozuvi ham shu bilan tushunarli bo'ldi.",
          "Keyingi missiyada arxitektura byurosi kutmoqda. Burchaklarni qanday ajratamiz.",
        ],
        ru: [
          "Контрольная закрыта. Сегодня главной темой был объём.",
          "Объём измеряется числом единичных кубов. Считаем один слой и умножаем на число слоёв.",
          "На лестнице объёма каждый шаг в тысячу раз, потому что ребро длиннее в десять раз.",
          "В один кубический дециметр входит литр воды. Запись датчика тоже стала понятной.",
          "В следующей миссии ждёт архитектурное бюро. Как различают углы.",
        ],
        en: [
          "The control room is closed. Today you learned to work with volume.",
          "Volume is measured by the number of unit cubes. We count one layer and multiply by the number of layers.",
          "On the volume ladder every step is a thousand times, because the edge is ten times longer.",
          "One cubic decimetre holds one litre of water. The sensor record became clear as well.",
          "The next mission holds the architecture bureau. How are angles told apart.",
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
const AudioIndicator = ({ audio }) => { const t = useT(); const muteLabel = t(audio.muted ? bi("Ovozni yoqish", 'Включить звук', 'Turn sound on') : bi("Ovozni o'chirish", 'Выключить звук', 'Turn sound off')); const replayLabel = t(bi('Qayta eshitish', 'Повторить', 'Replay')); return <div className="audio-indicator"><button type="button" onClick={audio.toggleMute} aria-label={muteLabel} title={muteLabel}>{audio.muted ? '🔇' : '🔊'}</button><span className={audio.isPlaying ? 'audio-wave playing' : 'audio-wave'}><i/><i/><i/></span>{!audio.muted && <button type="button" onClick={audio.replay} aria-label={replayLabel} title={replayLabel}>↻</button>}</div>; };
const ScreenTypeLabel = ({ type }) => { const t = useT(); const labels = { hook: bi('Taxmin', 'Гипотеза', "Estimate"), exploration: bi('Tadqiqot', 'Исследование', "Explore"), model: bi('Model', 'Модель', 'Model'), rule: bi('Qoida', 'Правило', "Rule"), strategy: bi('Strategiya', 'Стратегия', 'Strategy'), error: bi('Xatoni tuzatish', 'Исправление ошибки', 'Error repair'), test: bi('Mashq', 'Задание', "Task"), case: bi('Vaziyat', 'Ситуация', "Situation"), summary: bi('Yakun', 'Итог', "Summary") }; return <span className="screen-type">{t(labels[type])}</span>; };
const Stage = ({ screen, audio, onPrev, onNext, canAdvance = true, canFinish = true, finish = false, children }) => { const t = useT(); const mobile = useIsMobile(); const meta = SCREEN_META[screen]; const c = CONTENT[`s${screen}`]; const pad = mobile ? 12 : 24; const ready = canUseGrade4TheoryContinue(canAdvance && canFinish && isAudioReady(audio), finish); return <main className={`stage stage-${meta.type}`}><header className="stage-header" style={{ paddingLeft: pad, paddingRight: pad }}><div className="progress-track" aria-label={`${screen + 1} / ${TOTAL_SCREENS}`}><div className="progress-fill progress-bar" style={{ width: `${(screen + 1) / TOTAL_SCREENS * 100}%` }}/></div><div className="stage-chrome"><div className="chrome-title"><span className="status-dot"/><span>{t(c.eyebrow)}</span></div><div className="chrome-actions"><ScreenTypeLabel type={meta.type}/>{audio && <AudioIndicator audio={audio}/>}<span className="screen-count">{String(screen + 1).padStart(2, '0')} / {TOTAL_SCREENS}</span></div></div></header><section className="stage-content" style={{ paddingLeft: pad, paddingRight: pad }}><div className="stage-body">{children}</div></section><footer className="stage-nav" style={{ paddingLeft: pad, paddingRight: pad }}>{screen === 0 ? <span/> : <button type="button" className="btn-ghost" onClick={onPrev}>← {t(bi('Orqaga', 'Назад', "Back"))}</button>}<button type="button" className="btn-white-accent" disabled={!ready} aria-disabled={!ready} onClick={onNext}>{finish ? t(bi('Darsni yakunlash', 'Завершить урок', "Finish lesson")) : t(bi('Davom etish', 'Продолжить', "Continue"))} →</button></footer></main>; };
const Heading = ({ c, state = 'present', showBit = false, hook = false }) => { const t = useT(); return <div className={'heading ' + (showBit && !hook ? '' : 'heading-solo')}><div><span data-g4-role={hook ? 'hook-topic' : undefined}>{t(c.eyebrow)}</span><h1 data-g4-role={hook ? 'hook-title' : undefined}>{t(c.title)}</h1></div>{showBit && !hook && <BitSVG state={state}/>}</div>; };

const G4TitleReveal = ({ active, title, onComplete }) => {
  const t = useT();
  useEffect(() => { if (!active) return undefined; const timer = window.setTimeout(() => onComplete?.(), window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 80 : 3900); return () => window.clearTimeout(timer); }, [active, onComplete]);
  if (!active || typeof document === 'undefined') return null;
  return createPortal(<div className="rank-boost-overlay g4-title-reveal-overlay" data-g4-role="rank-overlay" role="status" aria-live="assertive" aria-atomic="true" aria-label={`${t(bi('Unvon olindi', 'Звание получено', 'Title earned'))}: ${t(title)}`}><div className="rank-boost-card g4-title-reveal-card"><div className="rank-boost-rays g4-title-reveal-rays" aria-hidden="true"/><div className="rank-boost-confetti g4-title-reveal-confetti" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <i key={index} style={{ '--g4-title-i': index, '--g4-title-delay': `${(index % 7) * -0.21}s` }}/>)}</div><div className="rank-boost-medal g4-title-reveal-medal" aria-hidden="true">★</div><h2>{t(title)}</h2></div></div>, document.body);
};
const G4TitleCard = ({ title, answers = [] }) => {
  const t = useT(); const scored = SCREEN_META.map((item, index) => item.scored ? index : null).filter((index) => index !== null); const firstTry = scored.filter((index) => answers[index]?.firstTry === true).length;
  return <aside className="g4-title-card-stage" data-g4-role="title-card" role="status" aria-live="polite" aria-atomic="true"><div className="g4-title-card-confetti" data-g4-role="reward-confetti" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i key={index}/>)}</div><div className="g4-title-card-bit" data-g4-role="reward-bit"><BitSVG state="happy"/></div><div className="g4-title-card-medal" data-g4-role="reward-medal" aria-hidden="true">★</div><span className="g4-title-card-kicker">{t(bi('UNVON OLINDI', 'ЗВАНИЕ ПОЛУЧЕНО', 'TITLE EARNED'))}</span><h2>{t(title)}</h2><div className="g4-title-card-score"><strong>{firstTry}/{scored.length}</strong><span>{t(bi('birinchi urinishda', 'с первой попытки', 'on the first attempt'))}</span></div></aside>;
};

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

/* --- ikki panelli tushuntirish ekrani (umumiy) --------------------------- */
.split-layout{width:min(800px,100%);display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;overflow:hidden}
.split-model{min-width:0;padding:16px;display:grid;align-content:start;gap:12px;overflow:hidden;border-radius:19px;background:rgba(255,255,255,.95);box-shadow:0 14px 30px -26px rgba(${T.shadowBase},.5)}
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
/* --- 32-darsning chizmalari ------------------------------------------------ */
.tank-figure{display:grid;justify-items:center;gap:5px}
.tank-figure>svg{width:96px;height:78px}
.tank-figure>span{color:#9FC4CE;font-size:9px;font-weight:800}
.tank-body{fill:rgba(255,255,255,.06);stroke:rgba(144,228,235,.5);stroke-width:3}
.tank-water{fill:rgba(22,143,163,.55)}
.tank-lid,.tank-pipe{fill:none;stroke:rgba(144,228,235,.6);stroke-width:4;stroke-linecap:round}
.tank-lid{fill:rgba(144,228,235,.18);stroke-width:2}
.sensor-pair{min-width:0;display:grid;gap:8px}

.cube-stack{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:14px;padding:12px;border-radius:15px;background:${T.cyanSoft}}
.cube-figure{display:grid;place-items:center;min-height:150px;padding:6px 22px 6px 6px}
.cube-row{display:grid;grid-template-columns:repeat(10,1fr);gap:3px;width:min(190px,100%)}
.cube-row>i{aspect-ratio:1;border-radius:3px;background:linear-gradient(145deg,#7FD6DE,${T.cyan});box-shadow:1px 1px 0 rgba(23,59,82,.18)}
.cube-layer{display:grid;grid-template-columns:repeat(10,1fr);gap:2px;width:min(150px,100%);transform:skewX(-22deg) skewY(4deg)}
.cube-layer>i{aspect-ratio:1;border-radius:2px;background:linear-gradient(145deg,#7FD6DE,${T.cyan})}
.cube-solid{position:relative;width:min(140px,100%);margin:14px 18px 0 0;display:block}
.cube-solid>.cube-layer{width:100%}
.cube-layer.is-stack{box-shadow:3px -3px 0 #BFE2E4,6px -6px 0 #A9D9DC,9px -9px 0 #93D0D4,12px -12px 0 #7FC7CC,15px -15px 0 #6BBEC4,18px -18px 0 rgba(22,143,163,.85),21px -21px 0 rgba(22,143,163,.7)}
.cube-stack-chip{position:absolute;right:-6px;bottom:-4px;padding:3px 9px;border-radius:999px;color:#fff;background:${T.accent};font:900 12px 'JetBrains Mono',monospace}
.cube-count{display:grid;justify-items:center;gap:2px}
.cube-count>strong{color:${T.navy};font:900 26px 'JetBrains Mono',monospace}
.cube-count>span{color:${T.ink2};font-size:12px;font-weight:800}

.ladder-layout{align-self:start;height:auto;max-height:100%;margin-inline:auto;width:min(780px,100%);padding:16px;display:grid;grid-template-rows:auto auto auto;gap:13px;overflow:hidden;border-radius:19px;background:rgba(255,255,255,.95);box-shadow:0 14px 30px -26px rgba(${T.shadowBase},.5)}
.ladder-head{display:grid;gap:6px}
.ladder-row{display:flex;align-items:center;justify-content:center;gap:10px}
.ladder-cube{display:grid;justify-items:center;gap:3px;opacity:.3;transition:opacity .4s ease}
.ladder-cube.is-open{opacity:1}
.ladder-cube>svg{width:54px;height:54px}
.ladder-cube.size-1>svg{width:66px;height:66px}
.ladder-cube.size-2>svg{width:78px;height:78px}
.ladder-cube>strong{color:${T.navy};font:900 15px 'JetBrains Mono',monospace}
.lc-face{fill:rgba(22,143,163,.16);stroke:${T.navy};stroke-width:3}
.lc-top{fill:rgba(22,143,163,.3);stroke:${T.navy};stroke-width:3;stroke-linejoin:round}
.lc-side{fill:rgba(22,143,163,.08);stroke:${T.navy};stroke-width:3;stroke-linejoin:round}
.ladder-step{min-height:44px;padding:0 12px;border:2px dashed ${T.accent};border-radius:12px;color:${T.accent};background:${T.accentSoft};cursor:pointer;font:900 13px 'JetBrains Mono',monospace;transition:.25s}
.ladder-step:hover:not(:disabled){transform:translateY(-2px)}
.ladder-step.is-open{border-style:solid;color:#fff;background:${T.accent}}
.ladder-mini{display:flex;align-items:center;gap:7px;color:${T.navy};font-family:'JetBrains Mono',monospace}
.ladder-mini>i{padding:4px 8px;border-radius:8px;background:#FFFFFF;font-style:normal;font-size:12px;font-weight:900}
.ladder-mini>b{color:${T.accent};font-size:11px}

.box-grid{width:min(210px,100%);display:grid;grid-template-columns:repeat(9,1fr);gap:2px}
.box-grid>i{aspect-ratio:1;border-radius:2px;background:rgba(22,143,163,.45)}
.reserve-bar{position:relative;height:30px;border-radius:10px;overflow:hidden;background:#FFFFFF}
.reserve-bar>.fill{position:absolute;inset:0 12% 0 0;background:linear-gradient(90deg,${T.cyan},#7FD6DE)}
.reserve-bar>em{position:absolute;right:12px;top:50%;transform:translateY(-50%);color:${T.accent};font:900 16px 'JetBrains Mono',monospace;font-style:normal}
.litre-row{display:grid;grid-template-columns:repeat(6,1fr);gap:5px}
.litre-row>i{height:34px;border-radius:8px;display:grid;place-items:center;background:rgba(22,143,163,.5)}
.litre-row>i>em{color:#fff;font:900 11px 'JetBrains Mono',monospace;font-style:normal}
.litre-total{justify-self:center;color:${T.accent};font:900 15px 'JetBrains Mono',monospace}

@media(max-width:639.98px){
  .tank-figure>svg{width:70px;height:56px}
  .cube-stack{gap:9px;padding:9px}
  .cube-figure{min-height:104px}
  .cube-row{width:min(150px,100%)}
  .cube-layer{width:min(118px,100%)}
  .cube-layer.is-stack{box-shadow:2px -2px 0 #BFE2E4,4px -4px 0 #A9D9DC,6px -6px 0 #93D0D4,8px -8px 0 #7FC7CC,10px -10px 0 #6BBEC4,12px -12px 0 rgba(22,143,163,.85),14px -14px 0 rgba(22,143,163,.7)}
  .cube-count>strong{font-size:20px}
  .ladder-layout{padding:10px;border-radius:14px;gap:9px}
  .ladder-row{gap:6px}
  .ladder-cube>svg{width:40px;height:40px}
  .ladder-cube.size-1>svg{width:48px;height:48px}
  .ladder-cube.size-2>svg{width:56px;height:56px}
  .ladder-cube>strong{font-size:12px}
  .ladder-step{min-height:44px;padding:0 7px;font-size:11px}
  .box-grid{width:min(150px,100%)}
  .litre-row>i{height:26px}
}
/* Konsol ichidagi ikkita karta 206 px freymga sig'adi */
.sensor-pair>.cable-card,.sensor-pair>.order-card{padding:7px 10px;gap:3px}
.sensor-pair>.cable-card>strong,.sensor-pair>.order-card>strong{font-size:clamp(14px,1.9vw,18px)}
.sensor-pair>.cable-card>.cable-line{display:none}
@media(max-width:639.98px){
  .sensor-pair>.cable-card,.sensor-pair>.order-card{padding:5px 7px}
  .sensor-pair>.cable-card>strong,.sensor-pair>.order-card>strong{font-size:13px}
}
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
@media(max-width:639.98px){
  .finale-heading h1{font-size:18px}
  .finale-heading p{-webkit-line-clamp:1}
  .finale-mastery>span>p{font-size:11px;line-height:1.22}
  .finale-mastery>span{min-height:0}
  .finale-proof>b,.finale-bridge>b{font-size:8px}
}
`;

// ---------------------------------------------------------------------------
// DARSGA XOS CHIZMALAR VA MEXANIKALAR
// ---------------------------------------------------------------------------

// Xuk sahnasi: suv ta'minoti nazorat konsoli.
const HookScene = ({ c, resolved }) => {
  const t = useT();
  return (
    <div className={`dispatch-visual ${resolved ? 'is-resolved' : ''}`}>
      <div className="dispatch-head">
        <span className="dispatch-node"><i />{t(c.nodeName)}</span>
        <span className="dispatch-state">{t(c.stateBad)}</span>
      </div>
      <div className="dispatch-body">
        <div className="tank-figure" aria-hidden="true">
          <svg viewBox="0 0 120 96">
            <path className="tank-body" d="M18 22h84v58a8 8 0 0 1-8 8H26a8 8 0 0 1-8-8z" />
            <path className="tank-water" d="M18 52h84v28a8 8 0 0 1-8 8H26a8 8 0 0 1-8-8z" />
            <path className="tank-lid" d="M12 16h96v8H12z" />
            <path className="tank-pipe" d="M60 4v12" />
          </svg>
          <span>{t(c.tankLabel)}</span>
        </div>
        <div className="sensor-pair">
          <div className="cable-card">
            <span>{t(c.labelA)}</span>
            <strong>{t(c.reading)}</strong>
            <i className="cable-line" />
          </div>
          <div className="order-card">
            <span>{t(c.labelOrder)}</span>
            <strong>{t(c.botOrder)}</strong>
            <i className="order-flag" />
          </div>
        </div>
      </div>
    </div>
  );
};

// s1 — kub detsimetrni birlik kublardan yig'ish.
function CubeFillScreen({ screen, onPrev, onNext }) {
  const t = useT();
  const c = CONTENT.s1;
  const [step, setStep] = useState(0);
  const audio = useGuidedNarration(c.audio, screen, step);
  const ready = isAudioReady(audio);
  const add = () => {
    if (!ready || step > 1) return;
    const next = step + 1;
    setStep(next);
    audio.speakStep(next);
  };
  const counter = step === 0 ? '10' : step === 1 ? '100' : '1 000';
  const counterLabel = step === 0 ? c.rowLabel : step === 1 ? c.layerLabel : c.cubeLabel;
  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} canAdvance={step === 2}>
      <div className="stack">
        <Heading c={c} />
        <section className="split-layout">
          <div className="split-model">
            <span className="panel-label">{t(c.lead)}</span>
            <div className="cube-stack" data-g4-role="visual-frame">
              <div className={`cube-figure stage-${step}`} aria-hidden="true">
                {step === 0 && <div className="cube-row">{Array.from({ length: 10 }, (_, index) => <i key={index} />)}</div>}
                {step === 1 && <div className="cube-layer">{Array.from({ length: 100 }, (_, index) => <i key={index} />)}</div>}
                {step === 2 && (
                  <div className="cube-solid">
                    <div className="cube-layer is-stack">{Array.from({ length: 100 }, (_, cell) => <i key={cell} />)}</div>
                    <span className="cube-stack-chip">· 10</span>
                  </div>
                )}
              </div>
              <div className="cube-count"><strong>{counter}</strong><span>{t(counterLabel)}</span></div>
            </div>
            {step < 2
              ? <button type="button" className="btn-white-accent step-button" disabled={!ready} onClick={add}>{t(c.tapHint)} →</button>
              : (
                <div className="split-done">
                  <SolutionBit />
                  <span>{t(c.doneLabel)}</span>
                  <strong>{t(c.doneValue)}</strong>
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

// s5 — hajm birliklari zinapoyasi.
function UnitLadderScreen({ screen, onPrev, onNext }) {
  const t = useT();
  const c = CONTENT.s5;
  const [step, setStep] = useState(0);
  const audio = useGuidedNarration(c.audio, screen, step);
  const ready = isAudioReady(audio);
  // O'q index'i 1 va 2: u faqat oldingi qadam ochilgach faollashadi.
  const open = (index) => {
    if (!ready || index - 1 !== step) return;
    setStep(index);
    audio.speakStep(index);
  };
  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} canAdvance={step === 2}>
      <div className="stack">
        <Heading c={c} />
        <section className="ladder-layout">
          <div className="ladder-head">
            <span className="panel-label">{t(c.source)}</span>
            <p className="relation-lead">{t(c.lead)}</p>
          </div>
          <div className="ladder-row">
            {c.rungs.map((rung, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <button
                    type="button"
                    className={`ladder-step ${index <= step ? 'is-open' : ''}`}
                    disabled={!ready || index - 1 !== step}
                    onClick={() => open(index)}
                  >
                    {t(c.stepLabel)}
                  </button>
                )}
                <div className={`ladder-cube size-${index} ${index <= step ? 'is-open' : ''}`}>
                  <svg viewBox="0 0 60 60" aria-hidden="true">
                    <path className="lc-face" d="M12 20h28v28H12z" />
                    <path className="lc-top" d="M12 20l8-8h28l-8 8z" />
                    <path className="lc-side" d="M40 20l8-8v28l-8 8z" />
                  </svg>
                  <strong>{t(rung.name)}</strong>
                  <span>{t(rung.edge)}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
          {step === 2 && (
            <div className="split-done">
              <SolutionBit />
              <span>{t(c.litreNote)}</span>
              <strong>{t(c.litreValue)}</strong>
            </div>
          )}
        </section>
      </div>
    </Stage>
  );
}

// s2 — sensor yozuvi.
const SensorRead = ({ c }) => {
  const t = useT();
  return (
    <div className="mini-frame" data-g4-role="visual-frame">
      <span className="panel-label">{t(c.taskNote)}</span>
      <strong className="task-expression">{t(c.task)}</strong>
    </div>
  );
};

// s6 — rezervuar shkalasi.
const TankScale = ({ c }) => {
  const t = useT();
  return (
    <div className="mini-frame" data-g4-role="visual-frame">
      <span className="panel-label">{t(c.taskNote)}</span>
      <strong className="task-expression">{t(c.task)}</strong>
      <div className="ladder-mini"><i>m³</i><b>· 1 000</b><i>dm³</i><b>· 1 000</b><i>cm³</i></div>
    </div>
  );
};

// s9 — quti to'ri.
const BoxGrid = ({ c }) => {
  const t = useT();
  return (
    <div className="mini-frame" data-g4-role="visual-frame">
      <strong className="task-expression small">{t(c.task)}</strong>
      <div className="box-grid" aria-hidden="true">
        {Array.from({ length: 36 }, (_, index) => <i key={index} />)}
      </div>
      <span className="panel-label">{t(c.taskNote)}</span>
    </div>
  );
};

// s13 — zaxira tasmasi.
const ReserveBar = ({ c }) => {
  const t = useT();
  return (
    <div className="mini-frame" data-g4-role="visual-frame">
      <span className="panel-label">{t(c.task)}</span>
      <div className="reserve-bar"><i className="fill" /><em>?</em></div>
      <div className="window-scale"><span>0</span><span>12 000 l</span></div>
    </div>
  );
};

// s14 — litr tasmasi.
const LitreBar = ({ c }) => {
  const t = useT();
  return (
    <div className="mini-frame" data-g4-role="visual-frame">
      <span className="panel-label">{t(c.task)}</span>
      <div className="litre-row">
        {Array.from({ length: 6 }, (_, index) => <i key={index}><em>1 l</em></i>)}
      </div>
      <div className="litre-total">? cm³</div>
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
            <HookScene c={c} resolved={picked !== null} />
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
  const [wrongChoices, setWrongChoices] = useState(storedAnswer?.wrongChoices ?? []);
  const correct = picked === c.correctIndex;
  const choose = (index) => {
    if (!canAnswer || correct || wrongChoices.includes(index)) return;
    const ok = index === c.correctIndex;
    const nextAttempts = attempts + 1;
    const nextWrong = ok ? wrongChoices : [...wrongChoices, index];
    setPicked(index);
    setAttempts(nextAttempts);
    setWrongChoices(nextWrong);
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
                const state = sourceIndex === c.correctIndex && correct ? 'right'
                  : wrongChoices.includes(sourceIndex) ? 'bad' : '';
                return (
                  <button
                    type="button" key={sourceIndex}
                    data-g4-source-index={sourceIndex}
                    data-g4-correct={sourceIndex === c.correctIndex ? 'true' : 'false'}
                    className={`option ${state}`}
                    disabled={!canAnswer || correct || wrongChoices.includes(sourceIndex)}
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
                  <b>{values[slotIndex] === null ? '?' : ((c.unitNames && slotIndex === 1) || c.tileNames ? '✓' : values[slotIndex])}</b>
                  <span>{c.tileNames ? (values[slotIndex] === null ? '' : t(c.tileNames[slotIndex][values[slotIndex]])) : c.unitNames ? (values[slotIndex] === null ? '' : t(c.unitNames[values[slotIndex]])) : t(slotIndex === 0 ? c.unitT : c.unitQ)}</span>
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
                      {c.tileNames ? t(c.tileNames[slotIndex][tile]) : c.unitNames ? t(c.unitNames[tile]) : `${tile} ${t(slotIndex === 0 ? c.unitT : c.unitQ)}`}
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

function RowRepairScreen({ screen, storedAnswer, onAnswer, onPrev, onNext }) {
  const t = useT();
  const c = CONTENT.s7;
  const audio = useNarration(c.audio, screen);
  const canAnswer = isAudioReady(audio);
  const [picked, setPicked] = useState(storedAnswer?.studentAnswerIndex ?? null);
  const [wrongRows, setWrongRows] = useState(storedAnswer?.wrongChoices ?? []);
  const [attempts, setAttempts] = useState(storedAnswer?.attempts ?? 0);
  const correct = picked === c.answerIndex;
  const tap = (index) => {
    if (!canAnswer || correct || wrongRows.includes(index)) return;
    const ok = index === c.answerIndex;
    const nextAttempts = attempts + 1;
    const nextWrong = ok ? wrongRows : [...wrongRows, index];
    setPicked(index);
    setAttempts(nextAttempts);
    setWrongRows(nextWrong);
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
                className={`repair-row ${index === c.answerIndex && correct ? 'is-found' : ''} ${wrongRows.includes(index) ? 'is-ruled' : ''}`}
                disabled={!canAnswer || correct || wrongRows.includes(index)}
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
  const tap = (index) => {
    if (!canAnswer || done || solvedRound) return;
    const ok = index === current.answer;
    setPicked(index);
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
                    className={`tile wide ${picked === index ? (index === current.answer ? 'right' : 'bad') : ''}`}
                    disabled={!canAnswer || solvedRound}
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
const PROOF_LABEL = bi("BOSHLANG'ICH MISSIYA YECHIMI", 'РЕШЕНИЕ СТАРТОВОЙ МИССИИ', 'STARTING MISSION SOLVED');
const BRIDGE_LABEL = bi('KEYINGI MISSIYA', 'СЛЕДУЮЩАЯ МИССИЯ', 'NEXT MISSION');
const REWARD_WAIT = bi('MUKOFOT KUTILMOQDA', 'НАГРАДА ЖДЁТ', 'THE REWARD AWAITS');
const REWARD_OPEN = bi('Unvonni oching', 'Открой звание', 'Unlock your title');
const FIRST_TRY_LABEL = bi('birinchi urinishda', 'с первой попытки', 'on the first attempt');
const CLAIM_LABEL = bi('Unvonni olish', 'Получить звание', 'Claim title');
const PENDING_LABEL = bi('Avval yakuniy xulosani tinglang', 'Сначала дослушайте итог', 'Listen to the summary first');

function FinaleScreen({ screen, answers, onAnswer, onPrev, finishLesson, finalState, onFinalState }) {
  const t = useT();
  const c = CONTENT.s15;
  const storedAnswer = finalState;
  const audio = useNarration(c.audio, screen);
  const reduced = usePrefersReducedMotion();
  const visible = audio.frame + 1;
  const [titleClaimed, setTitleClaimed] = useState(storedAnswer?.titleClaimed === true);
  const [revealRequested, setRevealRequested] = useState(false);
  const canClaimTitle = audio.completed || audio.muted;
  const scored = SCREEN_META.map((meta, index) => (meta.scored ? index : null)).filter((index) => index !== null);
  const firstTryCorrect = scored.filter((index) => answers[index]?.firstTry === true).length;
  useEffect(() => {
    if (!revealRequested) return undefined;
    const timer = window.setTimeout(() => setRevealRequested(false), reduced ? 350 : 4300);
    return () => window.clearTimeout(timer);
  }, [reduced, revealRequested]);
  const claimTitle = () => {
    if (!canClaimTitle || titleClaimed) return;
    setTitleClaimed(true);
    setRevealRequested(true);
    onFinalState((previous) => ({ ...previous, titleClaimed: true }));
    onAnswer({
      screenIdx: screen, stage: null, question: t(CLAIM_LABEL),
      options: [t(c.rewardTitle)], correctIndex: 0, correctAnswer: t(c.rewardTitle),
      studentAnswerIndex: 0, studentAnswer: t(c.rewardTitle),
      correct: true, firstTry: true, attempts: 1, solved: true, titleClaimed: true,
    });
  };
  return (
    <Stage
      screen={screen} audio={titleClaimed ? { ...audio, completed: true } : audio}
      onPrev={onPrev} onNext={titleClaimed ? finishLesson : undefined}
      canAdvance canFinish={titleClaimed} finish
    >
      <div className="screen-stack finale-screen">
        <div className="finale-heading">
          <span><i aria-hidden="true">◆</i>{t(FINAL_STAGE)}</span>
          <h1>{t(c.title)}</h1>
          <p>{t(c.lead)}</p>
        </div>
        <div className="finale-body">
          <div className="finale-column">
            <div className="finale-mastery">
              {c.frames.slice(0, 3).map((item, index) => (
                <span key={index} className={index < visible ? 'is-open' : ''}><i>{index + 1}</i><p>{t(item)}</p></span>
              ))}
            </div>
            <div className={`finale-proof ${visible >= 4 ? 'is-open' : ''}`}>
              <b>{t(PROOF_LABEL)}</b>
              <span>{t(c.frames[3])}</span>
            </div>
            <div className={`finale-bridge ${visible >= 5 ? 'is-open' : ''}`}>
              <i aria-hidden="true">→</i>
              <b>{t(BRIDGE_LABEL)}</b>
              <span>{t(c.frames[4])}</span>
            </div>
          </div>
          <div className="finale-actions" data-g4-final-reflection="none">
            {titleClaimed
              ? <G4TitleCard title={c.rewardTitle} answers={answers} />
              : (
                <div className="reward-stage reward-stage-compact reward-locked">
                  <div className="reward-bit" data-g4-role="reward-bit"><BitSVG state="present" /></div>
                  <div className="reward-medal" data-g4-role="reward-medal" aria-hidden="true">🔒</div>
                  <span className="reward-kicker">{t(REWARD_WAIT)}</span>
                  <h2>{t(REWARD_OPEN)}</h2>
                  <div className="reward-score"><strong>{firstTryCorrect}/{scored.length}</strong><span>{t(FIRST_TRY_LABEL)}</span></div>
                </div>
              )}
            {!titleClaimed && (
              <button type="button" className="g4-title-claim" disabled={!canClaimTitle} onClick={claimTitle}>
                {t(CLAIM_LABEL)}
              </button>
            )}
            {!titleClaimed && !canClaimTitle && <small className="finale-pending">{t(PENDING_LABEL)}</small>}
          </div>
        </div>
        {titleClaimed && <G4TitleReveal active={revealRequested} title={c.rewardTitle} />}
      </div>
    </Stage>
  );
}

const Screen0 = (props) => <HookScreen {...props} />;
const Screen1 = (props) => <CubeFillScreen {...props} />;
const Screen2 = (props) => <ChoiceScreen {...props} visual={<SensorRead c={CONTENT.s2} />} />;
const Screen3 = (props) => <ThreeStepScreen {...props} />;
const Screen4 = (props) => <TileBuildScreen {...props} />;
const Screen5 = (props) => <UnitLadderScreen {...props} />;
const Screen6 = (props) => <ChoiceScreen {...props} visual={<TankScale c={CONTENT.s6} />} />;
const Screen7 = (props) => <RowRepairScreen {...props} />;
const Screen8 = (props) => <EstimateBandScreen {...props} />;
const Screen9 = (props) => <ChoiceScreen {...props} visual={<BoxGrid c={CONTENT.s9} />} />;
const Screen10 = (props) => <RuleBuilderScreen {...props} />;
const Screen11 = (props) => <RapidConsoleScreen {...props} />;
const Screen12 = (props) => <RouteCompareScreen {...props} />;
const Screen13 = (props) => <ChoiceScreen {...props} visual={<ReserveBar c={CONTENT.s13} />} />;
const Screen14 = (props) => <ChoiceScreen {...props} visual={<LitreBar c={CONTENT.s14} />} />;
const Screen15 = (props) => <FinaleScreen {...props} />;
const SCREENS = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15];

export default function Grade4Dars32({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished, previewMode }) {
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
    else console.log('[Grade4 Dars32 preview]', payload);
  }, [answers, lang, onFinished, startedAt, studentName]);
  const Current = SCREENS[current];
  return (
    <LangContext.Provider value={lang}>
      <style>{STYLES + TOPIC_STYLES + G4_ETALON_OVERRIDES}</style>
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
}const G4_TITLE_STYLES = `
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
