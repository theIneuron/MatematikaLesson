import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { canUseGrade4TheoryContinue } from './theoryNavigation.js';

// ============================================================================
// 4-SINF · Dars 33 · Burchak turlari
//
// SYUJET. Arxitektura byurosi ochiladi (blok 5). Loyiha stoliga chorraha
// chizmalari keladi; Bit burchakni yo'l uzunligiga qarab baholaydi.
//
// YADRO. Burchakni tomon uzunligi emas, ochilish o'lchaydi. To'g'ri burchak
// 90° — asosiy o'lchov: undan kichigi o'tkir, kattasi o'tmas, tomonlar bitta
// chiziqqa tushsa yoyiq (180°).
//
// USUL. Burchakni 90° bilan solishtiramiz, keyin turini aytamiz.
//
// XATO MODELLARI. Burchakni tomon uzunligi bilan baholash · 90° dan katta
// burchakni to'g'ri deb atash · yoyiq burchakni 90° yoki 360° deb hisoblash ·
// "kichik" so'ziga qarab qo'shib yuborish.
//
// ESLATMA. 4-sinf darsligida transportir va gradus yo'q; bu dars RUz dasturi
// va reja bo'yicha (metodist qarori) gradus bilan olib boriladi.
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
  { id: 's0', type: 'hook', template: 'mission-console', goal: 'predict-which-angle-is-bigger', mechanic: 'prediction-choice', active: true, assessed: false, scored: false, scope: 'hook', misconceptions: ['ray-length-decides'] },
  { id: 's1', type: 'exploration', template: 'angle-open', goal: 'see-that-opening-measures', mechanic: 'tap-to-open', active: true, assessed: false, scored: false, scope: null, misconceptions: ['ray-length-decides'] },
  { id: 's2', type: 'test', template: 'choice', goal: 'classify-an-acute-angle', mechanic: 'choice-retry', active: true, assessed: true, scored: true, scope: 'module-mikro', misconceptions: ['right-angle-confusion'] },
  { id: 's3', type: 'model', template: 'three-step-track', goal: 'run-the-comparison-rule', mechanic: 'tap-steps', active: true, assessed: false, scored: false, scope: null, misconceptions: [] },
  { id: 's4', type: 'test', template: 'value-builder', goal: 'name-type-and-reason', mechanic: 'tile-build', active: true, assessed: true, scored: true, scope: 'module-mikro', misconceptions: ['type-without-reason'] },
  { id: 's5', type: 'exploration', template: 'angle-scale', goal: 'map-the-zones-on-a-scale', mechanic: 'tap-to-open', active: true, assessed: false, scored: false, scope: null, misconceptions: [] },
  { id: 's6', type: 'test', template: 'choice', goal: 'read-a-range-from-the-scale', mechanic: 'choice-retry', active: true, assessed: true, scored: true, scope: 'module-mikro', misconceptions: ['range-vs-value'] },
  { id: 's7', type: 'error', template: 'row-repair', goal: 'repair-the-broken-step', mechanic: 'tap-the-row', active: true, assessed: true, scored: true, scope: 'module-mikro', misconceptions: ['bigger-than-90-called-right'] },
  { id: 's8', type: 'exploration', template: 'estimate-band', goal: 'estimate-without-measuring', mechanic: 'tap-the-band', active: true, assessed: false, scored: false, scope: null, misconceptions: [] },
  { id: 's9', type: 'test', template: 'choice', goal: 'know-the-straight-angle', mechanic: 'choice-retry', active: true, assessed: true, scored: true, scope: 'module-mikro', misconceptions: ['straight-vs-full-turn'] },
  { id: 's10', type: 'rule', template: 'rule-builder', goal: 'formulate-the-method', mechanic: 'order-parts', active: true, assessed: false, scored: false, scope: null, misconceptions: [] },
  { id: 's11', type: 'test', template: 'rapid-console', goal: 'classify-three-angles', mechanic: 'tile-rounds', active: true, assessed: true, scored: true, scoreUnits: 3, scope: 'module-mikro', misconceptions: ['type-slip'] },
  { id: 's12', type: 'strategy', template: 'route-compare', goal: 'choose-the-right-tool', mechanic: 'route-choice', active: true, assessed: false, scored: false, scope: null, misconceptions: ['strategy-without-check'] },
  { id: 's13', type: 'case', template: 'choice', goal: 'find-the-obtuse-corner', mechanic: 'choice-retry', active: true, assessed: true, scored: true, scope: 'final', misconceptions: ['right-angle-confusion'] },
  { id: 's14', type: 'case', template: 'choice', goal: 'transfer-from-description-to-degrees', mechanic: 'choice-retry', active: true, assessed: true, scored: true, scope: 'final', misconceptions: ['added-instead-of-subtracted'] },
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
  lessonId: 'geometry-4-33-v1',
  slug: 'dars33-burchak-turlari',
  lessonTitle: {
    uz: "Burchak turlari",
    ru: 'Виды углов',
    en: 'Types of angles',
  },
  skillTags: ['angle-opening', 'right-angle-reference', 'angle-classification', 'degree-reading'],
  finalReflectionRequired: false,
};

const CONTENT = {
  s0: {
    eyebrow: { uz: "Missiya", ru: "Миссия", en: "Mission" },
    topic: { uz: "Dars mavzusi: Burchak turlari", ru: "Тема урока: Виды углов", en: "Lesson topic: Types of angles" },
    title: { uz: "Ikkita chorraha", ru: "Два перекрёстка", en: "Two junctions" },
    question: { uz: "Qaysi chorrahaning burchagi katta?", ru: "У какого перекрёстка угол больше?", en: "Which junction has the bigger angle?" },
    neutral: true,
    nodeName: { uz: "ARXITEKTURA BYUROSI · LOYIHA STOLI", ru: "АРХИТЕКТУРНОЕ БЮРО · СТОЛ ПРОЕКТОВ", en: "ARCHITECTURE BUREAU · DRAFTING TABLE" },
    stateBad: { uz: "BIT UZUN TOMONNI TANLADI", ru: "БИТ ВЫБРАЛ ДЛИННУЮ СТОРОНУ", en: "BIT CHOSE THE LONG SIDE" },
    planA: { uz: "A chorraha", ru: "Перекрёсток A", en: "Junction A" },
    planB: { uz: "B chorraha", ru: "Перекрёсток B", en: "Junction B" },
    botClaim: { uz: "Bit: A katta, chunki yo'llari uzun", ru: "Бит: A больше, потому что дороги длиннее", en: "Bit: A is bigger, because its roads are longer" },
    options: [
      { uz: "B chorraha", ru: "Перекрёсток B", en: "Junction B" },
      { uz: "A chorraha", ru: "Перекрёсток A", en: "Junction A" },
      { uz: "Ikkalasi teng", ru: "Они равны", en: "They are equal" },
      { uz: "Aniqlab bo'lmaydi", ru: "Определить нельзя", en: "It cannot be told" },
    ],
    feedback: {
      uz: "Taxminingiz yozib olindi. Endi burchakni nima o'lchashini birga ko'ramiz.",
      ru: "Твоё предположение записано. Теперь вместе посмотрим, чем измеряется угол.",
      en: "Your prediction is saved. Now we will see together what measures an angle.",
    },
    audio: {
      intro: {
        uz: [
          "Arxitektura byurosidamiz. Loyiha stoliga ikkita chorraha chizmasi keldi.",
          "Birinchi chizmada yo'llar uzun, ikkinchisida qisqa.",
          "Bit birinchi chorrahaning burchagi katta dedi, chunki uning yo'llari uzun.",
          "Sizningcha, qaysi chorrahaning burchagi katta.",
        ],
        ru: [
          "Мы в архитектурном бюро. На стол проектов пришли два чертежа перекрёстков.",
          "На первом чертеже дороги длинные, на втором короткие.",
          "Бит сказал, что у первого перекрёстка угол больше, потому что дороги длиннее.",
          "Как думаешь, у какого перекрёстка угол больше.",
        ],
        en: [
          "We are in the architecture bureau. Two junction drawings arrived at the drafting table.",
          "On the first drawing the roads are long, on the second they are short.",
          "Bit said the first junction has the bigger angle because its roads are longer.",
          "Which junction do you think has the bigger angle.",
        ],
      },
    },
  },

  s1: {
    eyebrow: { uz: "Kashfiyot", ru: "Исследование", en: "Discovery" },
    title: { uz: "Burchakni nima o'lchaydi", ru: "Чем измеряется угол", en: "What measures an angle" },
    lead: { uz: "Burchakni bosib oching", ru: "Открывай угол нажатием", en: "Tap to open the angle" },
    degrees: [30, 90, 130],
    steps: [
      { uz: "Tomonlar uzunligi burchakni o'zgartirmaydi", ru: "Длина сторон не меняет угол", en: "The length of the sides does not change the angle" },
      { uz: "To'g'ri burchak 90° — asosiy o'lchov", ru: "Прямой угол 90° — главная мерка", en: "The right angle 90° is the main measure" },
      { uz: "Ochilish katta bo'lsa, burchak ham katta", ru: "Чем больше раскрытие, тем больше угол", en: "The wider the opening, the bigger the angle" },
    ],
    tapHint: { uz: "Burchakni ochish", ru: "Открыть угол", en: "Open the angle" },
    doneLabel: { uz: "Burchakni ochilish o'lchaydi", ru: "Угол измеряет раскрытие", en: "The opening measures the angle" },
    doneValue: { uz: "130° > 90°", ru: "130° > 90°", en: "130° > 90°" },
    audio: {
      intro: {
        uz: [
          "Burchakni ochib ko'ramiz. Tomonlar bir xil qoladi, faqat ochilish o'zgaradi.",
          "Mana to'g'ri burchak. U to'qson gradus va hamma burchak shu bilan solishtiriladi.",
          "Ochilish yana kattalashdi. Demak burchakni tomon uzunligi emas, ochilish o'lchaydi.",
        ],
        ru: [
          "Раскроем угол. Стороны остаются теми же, меняется только раскрытие.",
          "Вот прямой угол. Он равен девяноста градусам, и с ним сравнивают все углы.",
          "Раскрытие стало ещё больше. Значит угол измеряет не длина сторон, а раскрытие.",
        ],
        en: [
          "Let us open the angle. The sides stay the same, only the opening changes.",
          "Here is the right angle. It is ninety degrees and every angle is compared with it.",
          "The opening grew wider again. So an angle is measured by its opening, not by the length of its sides.",
        ],
      },
    },
  },

  s2: {
    eyebrow: { uz: "Mashq", ru: "Задание", en: "Task" },
    title: { uz: "Birinchi chizma", ru: "Первый чертёж", en: "The first drawing" },
    task: { uz: "40°", ru: "40°", en: "40°" },
    taskNote: { uz: "Yo'l burilishi", ru: "Поворот дороги", en: "Road turn" },
    figDegree: 40,
    question: { uz: "Bu burchak qaysi turga kiradi?", ru: "К какому виду относится этот угол?", en: "Which type does this angle belong to?" },
    correctIndex: 0,
    options: [
      { uz: "o'tkir", ru: "острый", en: "acute" },
      { uz: "to'g'ri", ru: "прямой", en: "right" },
      { uz: "o'tmas", ru: "тупой", en: "obtuse" },
      { uz: "yoyiq", ru: "развёрнутый", en: "straight" },
    ],
    feedback: [
      { uz: "To'g'ri. 40° to'g'ri burchakdan kichik, demak o'tkir.", ru: "Верно. 40° меньше прямого угла, значит острый.", en: "Right. 40° is smaller than the right angle, so it is acute." },
      { uz: "To'g'ri burchak roppa-rosa 90°. Bu esa undan kichik.", ru: "Прямой угол ровно 90°. А этот меньше.", en: "The right angle is exactly 90°. This one is smaller." },
      { uz: "O'tmas burchak 90° dan katta bo'ladi. Bu esa kichik.", ru: "Тупой угол больше 90°. А этот меньше.", en: "An obtuse angle is bigger than 90°. This one is smaller." },
      { uz: "Yoyiq burchak 180°, ya'ni to'g'ri chiziq. Bu unga o'xshamaydi.", ru: "Развёрнутый угол 180°, то есть прямая линия. Этот на неё не похож.", en: "A straight angle is 180°, a straight line. This one does not look like that." },
    ],
    proof: { uz: "40° < 90° → o'tkir burchak", ru: "40° < 90° → острый угол", en: "40° < 90° → acute angle" },
    audio: {
      intro: {
        uz: [
          "Loyihadagi birinchi burilishni tekshiramiz.",
          "Uni to'g'ri burchak bilan solishtiring va turini tanlang.",
        ],
        ru: [
          "Проверим первый поворот в проекте.",
          "Сравни его с прямым углом и выбери вид.",
        ],
        en: [
          "Let us check the first turn in the plan.",
          "Compare it with the right angle and choose the type.",
        ],
      },
      on_correct: { uz: "To'g'ri. To'g'ri burchakdan kichik burchak o'tkir deyiladi.", ru: "Верно. Угол меньше прямого называют острым.", en: "Right. An angle smaller than the right angle is called acute." },
      on_wrong: [
        { uz: "To'g'ri javob.", ru: "Верный ответ.", en: "The correct answer." },
        { uz: "To'g'ri burchakni burchakning burchagi bilan solishtiring.", ru: "Сравни его с прямым углом ещё раз.", en: "Compare it with the right angle once more." },
        { uz: "O'tmas burchak kengroq ochiladi. Bu esa tor.", ru: "Тупой угол раскрыт шире. А этот узкий.", en: "An obtuse angle opens wider. This one is narrow." },
        { uz: "Yoyiq burchakda ikki tomon bitta chiziq bo'ladi.", ru: "У развёрнутого угла обе стороны образуют одну линию.", en: "In a straight angle both sides form one line." },
      ],
    },
  },

  s3: {
    eyebrow: { uz: "Model", ru: "Модель", en: "Model" },
    title: { uz: "Uch qadamli qaror", ru: "Решение в три шага", en: "A decision in three steps" },
    lead: { uz: "Har qadamni bosib oching", ru: "Открывай каждый шаг нажатием", en: "Tap to open each step" },
    leftLabel: { uz: "Burchak", ru: "Угол", en: "The angle" },
    rightLabel: { uz: "Qaror", ru: "Решение", en: "The decision" },
    rows: [
      {
        step: { uz: "1-qadam. 90° dan kichikmi", ru: "Шаг 1. Меньше ли 90°", en: "Step 1. Is it smaller than 90°" },
        left: { uz: "35°", ru: "35°", en: "35°" },
        right: { uz: "o'tkir burchak", ru: "острый угол", en: "acute angle" },
      },
      {
        step: { uz: "2-qadam. Roppa-rosa 90° mi", ru: "Шаг 2. Ровно ли 90°", en: "Step 2. Is it exactly 90°" },
        left: { uz: "90°", ru: "90°", en: "90°" },
        right: { uz: "to'g'ri burchak", ru: "прямой угол", en: "right angle" },
      },
      {
        step: { uz: "3-qadam. 90° dan katta, 180° dan kichikmi", ru: "Шаг 3. Больше 90° и меньше 180°", en: "Step 3. Bigger than 90° and smaller than 180°" },
        left: { uz: "125°", ru: "125°", en: "125°" },
        right: { uz: "o'tmas burchak", ru: "тупой угол", en: "obtuse angle" },
      },
    ],
    ruleNote: { uz: "Har bir burchak to'g'ri burchak bilan solishtiriladi", ru: "Каждый угол сравнивают с прямым углом", en: "Every angle is compared with the right angle" },
    audio: {
      intro: {
        uz: [
          "Burchak turini uch qadamda aniqlaymiz. Avval to'qson gradusdan kichikmi deb qaraymiz.",
          "Agar roppa-rosa to'qson gradus bo'lsa, bu to'g'ri burchak.",
          "Agar to'qsondan katta, bir yuz saksondan kichik bo'lsa, bu o'tmas burchak.",
        ],
        ru: [
          "Вид угла определяем в три шага. Сначала смотрим, меньше ли он девяноста градусов.",
          "Если ровно девяносто градусов, это прямой угол.",
          "Если больше девяноста и меньше ста восьмидесяти, это тупой угол.",
        ],
        en: [
          "We decide the type of an angle in three steps. First we look whether it is smaller than ninety degrees.",
          "If it is exactly ninety degrees, it is a right angle.",
          "If it is bigger than ninety and smaller than one hundred eighty, it is an obtuse angle.",
        ],
      },
    },
  },

  s4: {
    eyebrow: { uz: "Mashq", ru: "Задание", en: "Task" },
    title: { uz: "Tom burchagi", ru: "Угол крыши", en: "The roof angle" },
    task: { uz: "125°", ru: "125°", en: "125°" },
    taskNote: { uz: "Loyiha chizmasi", ru: "Чертёж проекта", en: "Project drawing" },
    figDegree: 125,
    question: { uz: "Javobni yig'ing", ru: "Собери ответ", en: "Build the answer" },
    slots: [
      { key: "type", label: { uz: "burchak turi", ru: "вид угла", en: "angle type" }, answer: 2, tiles: [0, 1, 2] },
      { key: "reason", label: { uz: "sabab", ru: "причина", en: "reason" }, answer: 1, tiles: [0, 1, 2] },
    ],
    tileNames: [
      [
        { uz: "o'tkir", ru: "острый", en: "acute" },
        { uz: "to'g'ri", ru: "прямой", en: "right" },
        { uz: "o'tmas", ru: "тупой", en: "obtuse" },
      ],
      [
        { uz: "90° dan kichik", ru: "меньше 90°", en: "smaller than 90°" },
        { uz: "90° dan katta", ru: "больше 90°", en: "bigger than 90°" },
        { uz: "roppa-rosa 180°", ru: "ровно 180°", en: "exactly 180°" },
      ],
    ],
    okText: { uz: "To'g'ri. 125° to'g'ri burchakdan katta, lekin yoyiqdan kichik.", ru: "Верно. 125° больше прямого угла, но меньше развёрнутого.", en: "Right. 125° is bigger than the right angle but smaller than the straight one." },
    wrongT: { uz: "Tur boshqacha. Avval 90° bilan solishtiring.", ru: "Вид другой. Сначала сравни с 90°.", en: "The type is different. Compare with 90° first." },
    wrongQ: { uz: "Sabab boshqacha. 125° ni 90° bilan solishtiring.", ru: "Причина другая. Сравни 125° с 90°.", en: "The reason is different. Compare 125° with 90°." },
    proof: { uz: "90° < 125° < 180° → o'tmas", ru: "90° < 125° < 180° → тупой", en: "90° < 125° < 180° → obtuse" },
    audio: {
      intro: {
        uz: [
          "Tom burchagi chizmada bir yuz yigirma besh gradus.",
          "Turini tanlang va sababini ham ko'rsating.",
        ],
        ru: [
          "Угол крыши на чертеже сто двадцать пять градусов.",
          "Выбери вид и укажи причину.",
        ],
        en: [
          "The roof angle on the drawing is one hundred twenty five degrees.",
          "Choose the type and show the reason as well.",
        ],
      },
      on_correct: { uz: "To'g'ri. Sabab ham to'g'ri ko'rsatildi.", ru: "Верно. Причина указана правильно.", en: "Right. The reason is shown correctly." },
      on_wrong: { uz: "Burchakni to'g'ri burchak bilan solishtiring.", ru: "Сравни угол с прямым углом.", en: "Compare the angle with the right angle." },
    },
  },

  s5: {
    eyebrow: { uz: "Kashfiyot", ru: "Исследование", en: "Discovery" },
    title: { uz: "Burchak shkalasi", ru: "Шкала углов", en: "The angle scale" },
    lead: { uz: "Zonalarni bosib oching", ru: "Открывай зоны нажатием", en: "Tap to open the zones" },
    source: { uz: "Byuro shkalasi", ru: "Шкала бюро", en: "Bureau scale" },
    zones: [
      { name: { uz: "o'tkir", ru: "острый", en: "acute" }, range: { uz: "0° – 90°", ru: "0° – 90°", en: "0° – 90°" }, from: 0, to: 90 },
      { name: { uz: "to'g'ri va o'tmas", ru: "прямой и тупой", en: "right and obtuse" }, range: { uz: "90° – 180°", ru: "90° – 180°", en: "90° – 180°" }, from: 90, to: 180 },
      { name: { uz: "yoyiq", ru: "развёрнутый", en: "straight" }, range: { uz: "180°", ru: "180°", en: "180°" }, from: 178, to: 180 },
    ],
    doneLabel: { uz: "Shkala to'liq ochildi", ru: "Шкала открыта полностью", en: "The scale is fully open" },
    doneValue: { uz: "90° va 180° — chegaralar", ru: "90° и 180° — границы", en: "90° and 180° are the borders" },
    audio: {
      intro: {
        uz: [
          "Byuro shkalasida hamma burchak turi bir joyda turadi.",
          "Nol gradusdan to'qsongacha o'tkir burchaklar zonasi.",
          "To'qsondan bir yuz saksongacha to'g'ri va o'tmas burchaklar. Bir yuz sakson gradusda esa yoyiq burchak.",
        ],
        ru: [
          "На шкале бюро все виды углов стоят в одном месте.",
          "От нуля до девяноста градусов зона острых углов.",
          "От девяноста до ста восьмидесяти прямой и тупые углы. А на ста восьмидесяти развёрнутый угол.",
        ],
        en: [
          "On the bureau scale all types of angles stand in one place.",
          "From zero to ninety degrees is the zone of acute angles.",
          "From ninety to one hundred eighty are the right and obtuse angles. And at one hundred eighty is the straight angle.",
        ],
      },
    },
  },

  s6: {
    eyebrow: { uz: "Mashq", ru: "Задание", en: "Task" },
    title: { uz: "Ta'rif bo'yicha", ru: "По описанию", en: "By the description" },
    task: { uz: "90° < burchak < 180°", ru: "90° < угол < 180°", en: "90° < angle < 180°" },
    taskNote: { uz: "Shkala oralig'i", ru: "Промежуток шкалы", en: "Scale range" },
    question: { uz: "Bunday burchak qanday ataladi?", ru: "Как называется такой угол?", en: "What is such an angle called?" },
    correctIndex: 0,
    options: [
      { uz: "o'tmas", ru: "тупой", en: "obtuse" },
      { uz: "o'tkir", ru: "острый", en: "acute" },
      { uz: "to'g'ri", ru: "прямой", en: "right" },
      { uz: "yoyiq", ru: "развёрнутый", en: "straight" },
    ],
    feedback: [
      { uz: "To'g'ri. 90° dan katta, 180° dan kichik burchak o'tmas deyiladi.", ru: "Верно. Угол больше 90° и меньше 180° называют тупым.", en: "Right. An angle bigger than 90° and smaller than 180° is called obtuse." },
      { uz: "O'tkir burchak 90° dan kichik. Bu oraliq esa undan yuqorida.", ru: "Острый угол меньше 90°. А этот промежуток выше.", en: "An acute angle is smaller than 90°. This range is above it." },
      { uz: "To'g'ri burchak roppa-rosa 90°, oraliq emas.", ru: "Прямой угол ровно 90°, а не промежуток.", en: "The right angle is exactly 90°, not a range." },
      { uz: "Yoyiq burchak roppa-rosa 180°, oraliqning oxiri.", ru: "Развёрнутый угол ровно 180°, это конец промежутка.", en: "A straight angle is exactly 180°, the end of the range." },
    ],
    proof: { uz: "90° < 125° < 180° → o'tmas burchak", ru: "90° < 125° < 180° → тупой угол", en: "90° < 125° < 180° → obtuse angle" },
    audio: {
      intro: {
        uz: [
          "Shkaladagi oraliqni o'qiymiz.",
          "To'qson va bir yuz sakson orasidagi burchak qanday ataladi.",
        ],
        ru: [
          "Читаем промежуток на шкале.",
          "Как называется угол между девяноста и ста восемьюдесятью.",
        ],
        en: [
          "We read the range on the scale.",
          "What is an angle between ninety and one hundred eighty called.",
        ],
      },
      on_correct: { uz: "To'g'ri. Bu o'tmas burchaklar zonasi.", ru: "Верно. Это зона тупых углов.", en: "Right. This is the zone of obtuse angles." },
      on_wrong: [
        { uz: "To'g'ri javob.", ru: "Верный ответ.", en: "The correct answer." },
        { uz: "O'tkir zona to'qsongacha edi. Shkalaga qarang.", ru: "Зона острых была до девяноста. Посмотри на шкалу.", en: "The acute zone was up to ninety. Look at the scale." },
        { uz: "To'g'ri burchak bitta qiymat, oraliq emas.", ru: "Прямой угол это одно значение, а не промежуток.", en: "The right angle is one value, not a range." },
        { uz: "Yoyiq burchak oraliqning chetida turadi.", ru: "Развёрнутый угол стоит на краю промежутка.", en: "The straight angle stands at the edge of the range." },
      ],
    },
  },

  s7: {
    eyebrow: { uz: "Xatoni topish", ru: "Разбор ошибки", en: "Spot the error" },
    title: { uz: "Bitning qarori", ru: "Решение Бита", en: "Bit's decision" },
    lead: { uz: "Xato boshlangan qatorni bosing", ru: "Нажми на строку, где началась ошибка", en: "Tap the row where the error starts" },
    source: { uz: "Chorraha chizmasi", ru: "Чертёж перекрёстка", en: "Junction drawing" },
    answerIndex: 2,
    rows: [
      { uz: "Chizmadagi burchak 100°", ru: "Угол на чертеже 100°", en: "The angle on the drawing is 100°" },
      { uz: "100° to'g'ri burchakdan katta", ru: "100° больше прямого угла", en: "100° is bigger than the right angle" },
      { uz: "Demak bu to'g'ri burchak", ru: "Значит это прямой угол", en: "So it is a right angle" },
      { uz: "Javob: to'g'ri burchak", ru: "Ответ: прямой угол", en: "Answer: a right angle" },
    ],
    rowFeedback: [
      { uz: "Bu qator to'g'ri. Chizmadan olingan qiymat.", ru: "Эта строка верная. Значение взято с чертежа.", en: "This row is correct. The value comes from the drawing." },
      { uz: "Bu ham to'g'ri. 100° haqiqatan 90° dan katta.", ru: "И это верно. 100° действительно больше 90°.", en: "This is correct too. 100° really is bigger than 90°." },
      { uz: "Aynan shu yerda. 90° dan katta burchak to'g'ri emas, o'tmas bo'ladi.", ru: "Именно здесь. Угол больше 90° не прямой, а тупой.", en: "Exactly here. An angle bigger than 90° is not right, it is obtuse." },
      { uz: "Bu javob, ya'ni xatoning natijasi. Xato yuqoriroqda boshlangan.", ru: "Это ответ, то есть последствие ошибки. Ошибка началась выше.", en: "This is the answer, the consequence of the error. The error started higher up." },
    ],
    fixLabel: { uz: "To'g'ri yo'l", ru: "Верный путь", en: "The correct way" },
    fix: { uz: "90° < 100° < 180° → o'tmas burchak", ru: "90° < 100° < 180° → тупой угол", en: "90° < 100° < 180° → obtuse angle" },
    audio: {
      intro: {
        uz: [
          "Bit chorraha burchagini aniqladi. Qadamlari chiroyli, javobi esa xato.",
          "Qaysi qatorda xato boshlanganini toping va bosing.",
        ],
        ru: [
          "Бит определил угол перекрёстка. Шаги аккуратные, а ответ неверный.",
          "Найди строку, где началась ошибка, и нажми на неё.",
        ],
        en: [
          "Bit decided the junction angle. The steps look neat but the answer is wrong.",
          "Find the row where the error starts and tap it.",
        ],
      },
      on_correct: { uz: "To'g'ri. To'g'ri burchak roppa-rosa to'qson gradus bo'ladi.", ru: "Верно. Прямой угол равен ровно девяноста градусам.", en: "Right. A right angle is exactly ninety degrees." },
      on_wrong: { uz: "Har bir qatorni ketma-ket o'qing. Birinchi buzilgan qadamni qidiring.", ru: "Читай строки по порядку. Ищи первый сломанный шаг.", en: "Read the rows in order. Look for the first broken step." },
    },
  },

  s8: {
    eyebrow: { uz: "Kashfiyot", ru: "Исследование", en: "Discovery" },
    title: { uz: "O'lchamasdan baholash", ru: "Оценка без измерения", en: "Estimating without measuring" },
    lead: { uz: "Burchak qaysi zonada ekanini tanlang", ru: "Выбери, в какой зоне находится угол", en: "Choose the zone the angle falls into" },
    task: { uz: "Chizmadagi burchak", ru: "Угол на чертеже", en: "The angle on the drawing" },
    figDegree: 135,
    bands: [
      { uz: "0° – 90°", ru: "0° – 90°", en: "0° – 90°" },
      { uz: "90° – 180°", ru: "90° – 180°", en: "90° – 180°" },
      { uz: "180° dan katta", ru: "больше 180°", en: "bigger than 180°" },
    ],
    answerIndex: 1,
    bandFeedback: [
      { uz: "Kam. Burchak to'g'ri burchakdan kengroq ochilgan.", ru: "Мало. Угол раскрыт шире прямого.", en: "Too little. The angle opens wider than the right angle." },
      { uz: "Ha. To'g'ri burchakdan keng, lekin to'g'ri chiziqqa yetmagan.", ru: "Да. Шире прямого, но до прямой линии не дошёл.", en: "Yes. Wider than the right angle but it has not reached a straight line." },
      { uz: "Ko'p. Tomonlar hali bitta chiziqqa yetmadi.", ru: "Много. Стороны ещё не вышли на одну линию.", en: "Too much. The sides have not reached one line yet." },
    ],
    exact: { uz: "135°", ru: "135°", en: "135°" },
    exactLabel: { uz: "O'lchov taxminni tasdiqladi", ru: "Измерение подтвердило оценку", en: "The measurement confirmed the estimate" },
    audio: {
      intro: {
        uz: [
          "Transportirsiz ham burchakni baholash mumkin.",
          "Uni to'g'ri burchak bilan solishtiring va zonani tanlang.",
          "O'lchov bir yuz o'ttiz besh gradus berdi. Taxmin to'g'ri chiqdi.",
        ],
        ru: [
          "Угол можно оценить и без транспортира.",
          "Сравни его с прямым углом и выбери зону.",
          "Измерение дало сто тридцать пять градусов. Оценка подтвердилась.",
        ],
        en: [
          "An angle can be estimated even without a protractor.",
          "Compare it with the right angle and choose the zone.",
          "The measurement gave one hundred thirty five degrees. The estimate held.",
        ],
      },
    },
  },

  s9: {
    eyebrow: { uz: "Mashq", ru: "Задание", en: "Task" },
    title: { uz: "Yoyiq burchak", ru: "Развёрнутый угол", en: "The straight angle" },
    task: { uz: "Ikki tomon bitta chiziqda", ru: "Обе стороны на одной линии", en: "Both sides on one line" },
    taskNote: { uz: "Byuro shkalasi", ru: "Шкала бюро", en: "Bureau scale" },
    figDegree: 180,
    question: { uz: "Yoyiq burchak necha gradus?", ru: "Сколько градусов в развёрнутом угле?", en: "How many degrees are in a straight angle?" },
    correctIndex: 0,
    options: [
      { uz: "180°", ru: "180°", en: "180°" },
      { uz: "90°", ru: "90°", en: "90°" },
      { uz: "360°", ru: "360°", en: "360°" },
      { uz: "100°", ru: "100°", en: "100°" },
    ],
    feedback: [
      { uz: "To'g'ri. Ikki tomon bitta chiziq bo'lsa, burchak 180°.", ru: "Верно. Когда обе стороны образуют одну линию, угол 180°.", en: "Right. When both sides form one line the angle is 180°." },
      { uz: "Bu to'g'ri burchak. Yoyiq undan ikki barobar keng.", ru: "Это прямой угол. Развёрнутый шире его вдвое.", en: "That is the right angle. The straight one is twice as wide." },
      { uz: "Bu to'liq aylanish. Yoyiq esa uning yarmi.", ru: "Это полный оборот. Развёрнутый это его половина.", en: "That is a full turn. The straight angle is half of it." },
      { uz: "Bu o'tmas burchak, lekin hali chiziqqa yetmagan.", ru: "Это тупой угол, но до линии он ещё не дошёл.", en: "That is an obtuse angle, it has not reached the line yet." },
    ],
    proof: { uz: "yoyiq burchak = 180° = 2 · 90°", ru: "развёрнутый угол = 180° = 2 · 90°", en: "straight angle = 180° = 2 · 90°" },
    audio: {
      intro: {
        uz: [
          "Shkalaning eng chetidagi burchakni ko'ramiz.",
          "Ikki tomon bitta chiziq bo'lganda burchak necha gradus bo'ladi.",
        ],
        ru: [
          "Посмотрим угол на самом краю шкалы.",
          "Сколько градусов в угле, у которого обе стороны на одной линии.",
        ],
        en: [
          "Let us look at the angle at the very edge of the scale.",
          "How many degrees are in an angle whose sides lie on one line.",
        ],
      },
      on_correct: { uz: "To'g'ri. Yoyiq burchak ikkita to'g'ri burchakka teng.", ru: "Верно. Развёрнутый угол равен двум прямым.", en: "Right. A straight angle equals two right angles." },
      on_wrong: [
        { uz: "To'g'ri javob.", ru: "Верный ответ.", en: "The correct answer." },
        { uz: "To'g'ri burchak yoyiqning yarmi. Shkalaga qarang.", ru: "Прямой угол это половина развёрнутого. Посмотри на шкалу.", en: "The right angle is half of the straight one. Look at the scale." },
        { uz: "To'liq aylanish ikki yoyiq burchakdan iborat.", ru: "Полный оборот состоит из двух развёрнутых углов.", en: "A full turn is made of two straight angles." },
        { uz: "Tomonlar hali bitta chiziqqa yetmagan.", ru: "Стороны ещё не вышли на одну линию.", en: "The sides have not reached one line yet." },
      ],
    },
  },

  s10: {
    eyebrow: { uz: "Qoida", ru: "Правило", en: "Rule" },
    title: { uz: "Byuro qoidasi", ru: "Правило бюро", en: "The bureau rule" },
    lead: { uz: "Qadamlarni tartib bilan bosing", ru: "Нажимай шаги по порядку", en: "Tap the steps in order" },
    parts: [
      { uz: "Burchakni to'g'ri burchak bilan solishtiramiz", ru: "Сравниваем угол с прямым углом", en: "Compare the angle with the right angle" },
      { uz: "Kichik bo'lsa — o'tkir", ru: "Меньше — острый", en: "Smaller means acute" },
      { uz: "Katta, lekin chiziqdan kichik bo'lsa — o'tmas", ru: "Больше, но меньше прямой линии — тупой", en: "Bigger but less than a line means obtuse" },
      { uz: "Tomonlar bitta chiziqda bo'lsa — yoyiq", ru: "Стороны на одной линии — развёрнутый", en: "Sides on one line means straight" },
    ],
    slotLabel: { uz: "Qoida", ru: "Правило", en: "Rule" },
    bankLabel: { uz: "Qadamlar", ru: "Шаги", en: "Steps" },
    resetLabel: { uz: "Qayta tuzish", ru: "Собрать заново", en: "Start again" },
    memo: { uz: "90° → o'tkir · to'g'ri · o'tmas · 180° yoyiq", ru: "90° → острый · прямой · тупой · 180° развёрнутый", en: "90° → acute · right · obtuse · 180° straight" },
    okText: { uz: "Qoida yig'ildi", ru: "Правило собрано", en: "The rule is assembled" },
    wrongText: { uz: "Tartib buzildi. Avval solishtirish, keyin turlar.", ru: "Порядок нарушен. Сначала сравнение, потом виды.", en: "The order is broken. First the comparison, then the types." },
    audio: {
      intro: {
        uz: [
          "Bugungi usulni bitta qoidaga yig'amiz.",
          "To'rtta qadam bor va ularning tartibi muhim. Qadamlarni ketma-ket bosing.",
          "Shu qoida har qanday chizmadagi burchakka ishlaydi.",
        ],
        ru: [
          "Соберём сегодняшний способ в одно правило.",
          "Шагов четыре и их порядок важен. Нажимай шаги по очереди.",
          "Это правило работает для угла на любом чертеже.",
        ],
        en: [
          "Let us gather today's method into one rule.",
          "There are four steps and their order matters. Tap the steps one after another.",
          "The rule works for an angle on any drawing.",
        ],
      },
    },
  },

  s11: {
    eyebrow: { uz: "Tekshiruv", ru: "Проверка", en: "Check" },
    title: { uz: "Uchta tez savol", ru: "Три быстрых вопроса", en: "Three quick questions" },
    source: { uz: "Loyiha jurnali", ru: "Журнал проекта", en: "Project log" },
    rounds: [
      {
        prompt: { uz: "45° qaysi tur?", ru: "Какой вид у 45°?", en: "Which type is 45°?" },
        tiles: [
          { uz: "o'tkir", ru: "острый", en: "acute" },
          { uz: "to'g'ri", ru: "прямой", en: "right" },
          { uz: "o'tmas", ru: "тупой", en: "obtuse" },
        ],
        answer: 0,
        ok: { uz: "45° to'g'ri burchakdan kichik.", ru: "45° меньше прямого угла.", en: "45° is smaller than the right angle." },
        no: { uz: "Uni 90° bilan solishtiring.", ru: "Сравни его с 90°.", en: "Compare it with 90°." },
      },
      {
        prompt: { uz: "90° qaysi tur?", ru: "Какой вид у 90°?", en: "Which type is 90°?" },
        tiles: [
          { uz: "o'tmas", ru: "тупой", en: "obtuse" },
          { uz: "to'g'ri", ru: "прямой", en: "right" },
          { uz: "yoyiq", ru: "развёрнутый", en: "straight" },
        ],
        answer: 1,
        ok: { uz: "Roppa-rosa 90° — bu to'g'ri burchak.", ru: "Ровно 90° это прямой угол.", en: "Exactly 90° is the right angle." },
        no: { uz: "Bu asosiy o'lchov burchagi.", ru: "Это главный угол-мерка.", en: "This is the main measuring angle." },
      },
      {
        prompt: { uz: "180° qaysi tur?", ru: "Какой вид у 180°?", en: "Which type is 180°?" },
        tiles: [
          { uz: "o'tkir", ru: "острый", en: "acute" },
          { uz: "o'tmas", ru: "тупой", en: "obtuse" },
          { uz: "yoyiq", ru: "развёрнутый", en: "straight" },
        ],
        answer: 2,
        ok: { uz: "Tomonlar bitta chiziqda, demak yoyiq.", ru: "Стороны на одной линии, значит развёрнутый.", en: "The sides lie on one line, so it is straight." },
        no: { uz: "Bu shkalaning eng cheti.", ru: "Это самый край шкалы.", en: "This is the very edge of the scale." },
      },
    ],
    counter: { uz: "savol", ru: "вопрос", en: "question" },
    doneText: { uz: "Uch savol ham yopildi", ru: "Все три вопроса закрыты", en: "All three questions are closed" },
    audio: {
      intro: {
        uz: [
          "Loyiha jurnalida uchta burchak qoldi.",
          "Har birining turini tanlang.",
        ],
        ru: [
          "В журнале проекта осталось три угла.",
          "Выбери вид каждого.",
        ],
        en: [
          "Three angles are left in the project log.",
          "Choose the type of each one.",
        ],
      },
    },
  },

  s12: {
    eyebrow: { uz: "Strategiya", ru: "Стратегия", en: "Strategy" },
    title: { uz: "Qaysi yo'l qulayroq", ru: "Какой путь удобнее", en: "Which way is more convenient" },
    lead: { uz: "Chizmada 12 ta burchak bor — turini aniqlash kerak", ru: "На чертеже 12 углов — нужно определить вид", en: "The drawing has 12 angles — the type must be told" },
    source: { uz: "Byuro amaliyoti", ru: "Практика бюро", en: "Bureau practice" },
    routes: [
      {
        name: { uz: "Go'niya bilan solishtirib", ru: "Сравнивая угольником", en: "Comparing with a set square" },
        lines: [
          { uz: "go'niyani burchakka qo'yamiz", ru: "прикладываем угольник к углу", en: "we put the set square on the angle" },
          { uz: "kichik, teng yoki katta — ko'rinadi", ru: "меньше, равно или больше — видно сразу", en: "smaller, equal or bigger is seen at once" },
          { uz: "12 burchak tez tekshiriladi", ru: "12 углов проверяются быстро", en: "12 angles are checked quickly" },
        ],
      },
      {
        name: { uz: "Transportir bilan o'lchab", ru: "Измеряя транспортиром", en: "Measuring with a protractor" },
        lines: [
          { uz: "markazni uchga qo'yamiz", ru: "ставим центр на вершину", en: "we put the centre on the vertex" },
          { uz: "shkalani o'qiymiz", ru: "читаем шкалу", en: "we read the scale" },
          { uz: "har burchakka alohida vaqt ketadi", ru: "на каждый угол уходит время", en: "each angle takes time" },
        ],
      },
    ],
    answerIndex: 0,
    routeFeedback: [
      { uz: "Ha. Faqat tur kerak bo'lsa, go'niya yetadi va ish tez bitadi.", ru: "Да. Если нужен только вид, хватит угольника и работа идёт быстро.", en: "Yes. If only the type is needed, a set square is enough and the work goes fast." },
      { uz: "Bu yo'l ham to'g'ri va aniq gradusni beradi. Lekin faqat tur kerak bo'lsa, u uzoqroq.", ru: "Этот путь тоже верен и даёт точные градусы. Но если нужен только вид, он дольше.", en: "This way is correct too and gives the exact degrees. But if only the type is needed it takes longer." },
    ],
    note: { uz: "Aniq gradus kerak bo'lsa, transportir zarur", ru: "Если нужны точные градусы, нужен транспортир", en: "If exact degrees are needed, a protractor is required" },
    audio: {
      intro: {
        uz: [
          "Bitta ishni ikki asbob bilan bajarish mumkin. Ikkalasi ham to'g'ri.",
          "Chapda go'niya bilan solishtiramiz. O'ngda transportir bilan o'lchaymiz.",
          "Faqat tur kerak bo'lsa, qaysi biri qulayroq. Kartani bosing.",
        ],
        ru: [
          "Одну работу можно сделать двумя инструментами. Оба верны.",
          "Слева сравниваем угольником. Справа измеряем транспортиром.",
          "Если нужен только вид, какой удобнее. Нажми на карточку.",
        ],
        en: [
          "One job can be done with two tools. Both are correct.",
          "On the left we compare with a set square. On the right we measure with a protractor.",
          "If only the type is needed, which one is handier. Tap a card.",
        ],
      },
    },
  },

  s13: {
    eyebrow: { uz: "Hayotiy vazifa", ru: "Задача из жизни", en: "Real-life task" },
    title: { uz: "Yangi chorraha", ru: "Новый перекрёсток", en: "The new junction" },
    task: { uz: "burchaklar: 70°, 90°, 145°", ru: "углы: 70°, 90°, 145°", en: "angles: 70°, 90°, 145°" },
    taskNote: { uz: "Chorraha loyihasi", ru: "Проект перекрёстка", en: "Junction plan" },
    junction: [70, 90, 145],
    question: { uz: "Qaysi burchak o'tmas?", ru: "Какой угол тупой?", en: "Which angle is obtuse?" },
    correctIndex: 0,
    options: [
      { uz: "145°", ru: "145°", en: "145°" },
      { uz: "90°", ru: "90°", en: "90°" },
      { uz: "70°", ru: "70°", en: "70°" },
      { uz: "hech qaysi", ru: "ни один", en: "none of them" },
    ],
    feedback: [
      { uz: "To'g'ri. 145° to'g'ri burchakdan katta, yoyiqdan kichik.", ru: "Верно. 145° больше прямого угла и меньше развёрнутого.", en: "Right. 145° is bigger than the right angle and smaller than the straight one." },
      { uz: "Bu roppa-rosa to'g'ri burchak, o'tmas emas.", ru: "Это ровно прямой угол, а не тупой.", en: "That is exactly a right angle, not an obtuse one." },
      { uz: "Bu 90° dan kichik, demak o'tkir.", ru: "Это меньше 90°, значит острый.", en: "That is smaller than 90°, so it is acute." },
      { uz: "Uchta burchakdan bittasi 90° dan katta. Qaytadan qarang.", ru: "Один из трёх углов больше 90°. Посмотри ещё раз.", en: "One of the three angles is bigger than 90°. Look again." },
    ],
    proof: { uz: "70° o'tkir · 90° to'g'ri · 145° o'tmas", ru: "70° острый · 90° прямой · 145° тупой", en: "70° acute · 90° right · 145° obtuse" },
    audio: {
      intro: {
        uz: [
          "Yangi chorraha loyihasida uchta burchak bor. Yetmish, to'qson va bir yuz qirq besh gradus.",
          "Ular orasidan o'tmas burchakni toping.",
        ],
        ru: [
          "В проекте нового перекрёстка три угла. Семьдесят, девяносто и сто сорок пять градусов.",
          "Найди среди них тупой угол.",
        ],
        en: [
          "The new junction plan has three angles. Seventy, ninety and one hundred forty five degrees.",
          "Find the obtuse angle among them.",
        ],
      },
      on_correct: { uz: "To'g'ri. Faqat bittasi to'g'ri burchakdan kengroq.", ru: "Верно. Только один из них шире прямого.", en: "Right. Only one of them opens wider than the right angle." },
      on_wrong: [
        { uz: "To'g'ri javob.", ru: "Верный ответ.", en: "The correct answer." },
        { uz: "To'g'ri burchak o'tmas emas. Undan kattasini qidiring.", ru: "Прямой угол не тупой. Ищи больше него.", en: "A right angle is not obtuse. Look for a bigger one." },
        { uz: "Bu o'tkir burchak. O'tmas burchak to'g'ri burchakdan katta.", ru: "Это острый угол. Тупой больше прямого.", en: "That is an acute angle. An obtuse one is bigger than the right angle." },
        { uz: "Uch qiymatni to'g'ri burchak bilan solishtiring.", ru: "Сравни три значения с прямым углом.", en: "Compare the three values with the right angle." },
      ],
    },
  },

  s14: {
    eyebrow: { uz: "Yangi holat", ru: "Новый случай", en: "New case" },
    title: { uz: "Ta'rifdan gradusga", ru: "От описания к градусам", en: "From description to degrees" },
    task: { uz: "to'g'ri burchakdan 30° kichik", ru: "на 30° меньше прямого угла", en: "30° smaller than the right angle" },
    taskNote: { uz: "Panjara burchagi", ru: "Угол ограды", en: "Fence angle" },
    figDegree: 60,
    question: { uz: "Bu burchak necha gradus va qaysi tur?", ru: "Сколько градусов в этом угле и какой он вид?", en: "How many degrees is this angle and which type is it?" },
    correctIndex: 0,
    options: [
      { uz: "60°, o'tkir", ru: "60°, острый", en: "60°, acute" },
      { uz: "120°, o'tmas", ru: "120°, тупой", en: "120°, obtuse" },
      { uz: "60°, o'tmas", ru: "60°, тупой", en: "60°, obtuse" },
      { uz: "30°, o'tkir", ru: "30°, острый", en: "30°, acute" },
    ],
    feedback: [
      { uz: "To'g'ri. 90° dan 30° ni ayirdik, 60° qoldi va u o'tkir.", ru: "Верно. Из 90° вычли 30°, осталось 60°, и это острый угол.", en: "Right. We took 30° from 90°, 60° were left and that is acute." },
      { uz: "Bu qo'shilgan. Kichik degani ayirish kerakligini bildiradi.", ru: "Здесь прибавили. Меньше значит нужно вычитать.", en: "Here it was added. Smaller means you have to subtract." },
      { uz: "Gradus to'g'ri, tur esa xato. 60° to'g'ri burchakdan kichik.", ru: "Градусы верные, а вид нет. 60° меньше прямого угла.", en: "The degrees are right but the type is not. 60° is smaller than the right angle." },
      { uz: "Bu ayirilgan son, javob emas. 90° dan ayiring.", ru: "Это вычитаемое, а не ответ. Вычти из 90°.", en: "That is the number being taken away, not the answer. Subtract it from 90°." },
    ],
    proof: { uz: "90° − 30° = 60° → o'tkir burchak", ru: "90° − 30° = 60° → острый угол", en: "90° − 30° = 60° → acute angle" },
    audio: {
      intro: {
        uz: [
          "Panjara burchagi to'g'ri burchakdan o'ttiz gradus kichik.",
          "Uning gradusini toping va turini ham ayting.",
        ],
        ru: [
          "Угол ограды на тридцать градусов меньше прямого.",
          "Найди его градусы и назови вид.",
        ],
        en: [
          "The fence angle is thirty degrees smaller than the right angle.",
          "Find its degrees and name its type as well.",
        ],
      },
      on_correct: { uz: "To'g'ri. Avval gradus, keyin tur.", ru: "Верно. Сначала градусы, потом вид.", en: "Right. First the degrees, then the type." },
      on_wrong: [
        { uz: "To'g'ri javob.", ru: "Верный ответ.", en: "The correct answer." },
        { uz: "Kichik degani ayirish. Qo'shish katta burchak beradi.", ru: "Меньше значит вычитание. Сложение даст больший угол.", en: "Smaller means subtraction. Adding gives a bigger angle." },
        { uz: "Gradusni topdingiz. Endi uni to'g'ri burchak bilan solishtiring.", ru: "Градусы найдены. Теперь сравни их с прямым углом.", en: "The degrees are found. Now compare them with the right angle." },
        { uz: "Bu ayiriladigan son edi. Javob to'g'ri burchakdan ayirilgach chiqadi.", ru: "Это было вычитаемое. Ответ выходит после вычитания из прямого угла.", en: "That was the amount taken away. The answer comes after subtracting from the right angle." },
      ],
    },
  },

  s15: {
    eyebrow: { uz: "Yakun", ru: "Итог", en: "Summary" },
    title: { uz: "Loyiha tasdiqlandi", ru: "Проект утверждён", en: "The plan is approved" },
    rewardTitle: { uz: "Burchak nazoratchisi", ru: "Контролёр углов", en: "Angle controller" },
    lead: {
      uz: "Bugungi usul bitta xaritaga yig'ildi.",
      ru: "Сегодняшний способ собрался в одну карту.",
      en: "Today's method now fits on one map.",
    },
    frames: [
      { uz: "Burchakni ochilish o'lchaydi, tomon uzunligi emas", ru: "Угол измеряет раскрытие, а не длина сторон", en: "The opening measures an angle, not the length of the sides" },
      { uz: "Har bir burchak 90° bilan solishtiriladi", ru: "Каждый угол сравнивают с 90°", en: "Every angle is compared with 90°" },
      { uz: "O'tkir · to'g'ri · o'tmas · yoyiq", ru: "Острый · прямой · тупой · развёрнутый", en: "Acute · right · obtuse · straight" },
      { uz: "B chorraha kattaroq: 120° > 35°", ru: "Перекрёсток B больше: 120° > 35°", en: "Junction B is bigger: 120° > 35°" },
      { uz: "Keyingi missiya: burchaklarni yasash", ru: "Следующая миссия: построение углов", en: "Next mission: constructing angles" },
    ],
    audio: {
      intro: {
        uz: [
          "Loyiha tasdiqlandi. Bugun burchak turlarini ajratishni o'rgandingiz.",
          "Burchakni tomon uzunligi emas, ochilish o'lchaydi.",
          "Har bir burchak to'g'ri burchak bilan solishtiriladi va shundan turi kelib chiqadi.",
          "Boshlang'ich savol ham yopildi. B chorrahaning burchagi kattaroq ekan.",
          "Keyingi missiyada transportir kutmoqda. Berilgan burchakni qanday yasaymiz.",
        ],
        ru: [
          "Проект утверждён. Сегодня главной темой были виды углов.",
          "Угол измеряет раскрытие, а не длина сторон.",
          "Каждый угол сравнивают с прямым, и отсюда получается его вид.",
          "Стартовый вопрос тоже закрыт. У перекрёстка B угол оказался больше.",
          "В следующей миссии ждёт транспортир. Как построить заданный угол.",
        ],
        en: [
          "The plan is approved. Today you learned to tell the types of angles apart.",
          "An angle is measured by its opening, not by the length of its sides.",
          "Every angle is compared with the right angle and that gives its type.",
          "The starting question is closed too. Junction B turned out to have the bigger angle.",
          "The next mission holds the protractor. How do we construct a given angle.",
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
/* --- 33-darsning chizmalari ------------------------------------------------ */
.angle-svg{width:100%;max-width:180px;height:auto}
.ang-arm{fill:none;stroke:${T.navy};stroke-width:5;stroke-linecap:round}
.ang-arc{fill:none;stroke:${T.accent};stroke-width:4}
.ang-right{fill:none;stroke:${T.cyan};stroke-width:3}
.ang-vertex{fill:${T.accent}}
.tone-dark .ang-arm{stroke:#CFEFF2}
.tone-dark .ang-arc{stroke:#FFC3AE}
.tone-dark .ang-vertex{fill:#FFC3AE}
.tone-dark .ang-right{stroke:#8FD8E2}

.plan-body{grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;align-items:start}
.plan-card{position:relative;min-width:0;padding:4px 6px;border-radius:12px;display:grid;justify-items:center;gap:1px;background:rgba(255,255,255,.07);box-shadow:inset 0 0 0 1px rgba(144,228,235,.16)}
.plan-card>span{color:#9FC4CE;font-size:9px;font-weight:800}
.plan-card>svg{width:86px;max-width:86px}
.plan-card>b{position:absolute;right:8px;top:6px;color:#FFC3AE;font:900 12px 'JetBrains Mono',monospace}
.plan-claim{grid-column:1/-1;align-self:end;margin-right:98px;padding:4px 9px;border-radius:9px;color:#FFC3AE;background:rgba(255,91,53,.14);font-size:10px;font-weight:800}

.angle-frame{padding:10px;border-radius:15px;display:grid;justify-items:center;gap:5px;background:${T.cyanSoft}}
.angle-frame.small{padding:7px}
.angle-readout{color:${T.navy};font:900 clamp(17px,2.4vw,22px) 'JetBrains Mono',monospace}

.scale-layout{align-self:start;height:auto;max-height:100%;margin-inline:auto;width:min(760px,100%);padding:16px;display:grid;grid-template-rows:auto auto auto auto;gap:11px;overflow:hidden;border-radius:19px;background:rgba(255,255,255,.95);box-shadow:0 14px 30px -26px rgba(${T.shadowBase},.5)}
.scale-head{display:grid;gap:6px}
.scale-figure{display:grid;place-items:center}
.scale-figure>svg{width:min(300px,100%);height:auto}
.sc-base{fill:none;stroke:${T.ink3};stroke-width:3}
.sc-dial{fill:none;stroke:#DDE7E6;stroke-width:9}
.sc-tick{fill:none;stroke:${T.ink3};stroke-width:2;stroke-dasharray:5 5}
.sc-centre{fill:${T.navy}}
.sc-zone{fill:none;stroke-width:9;stroke-linecap:round;opacity:0;transition:opacity .4s ease}
.sc-zone.is-open{opacity:1}
.sc-zone.z0{stroke:${T.lime}}
.sc-zone.z1{stroke:${T.cyan}}
.sc-zone.z2{stroke:${T.accent};stroke-width:11}
.scale-zones{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}
.scale-zone{min-height:58px;padding:8px;border:2px dashed #D8E2DF;border-radius:13px;display:grid;gap:2px;background:#F7F9F8;cursor:pointer;transition:.25s}
.scale-zone>b{color:${T.navy};font:900 13px 'JetBrains Mono',monospace}
.scale-zone.is-open{border-style:solid}
.scale-zone.z0.is-open{border-color:${T.lime};background:rgba(149,201,61,.14)}
.scale-zone.z1.is-open{border-color:${T.cyan};background:${T.cyanSoft}}
.scale-zone.z2.is-open{border-color:${T.accent};background:${T.accentSoft}}
.scale-zone:hover:not(:disabled){transform:translateY(-2px)}

.range-strip{display:grid;grid-template-columns:1fr 1fr 1fr;gap:3px;height:14px}
.range-strip>i{border-radius:999px}
.range-strip>i.a{background:${T.lime}}
.range-strip>i.b{background:${T.cyan}}
.range-strip>i.c{background:${T.accent}}
.junction-row{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.junction-cell{display:grid;justify-items:center;gap:2px;padding:6px;border-radius:11px;background:#FFFFFF}
.junction-cell>b{color:${T.navy};font:900 13px 'JetBrains Mono',monospace}

@media(max-width:639.98px){
  .plan-body{gap:5px}
  .plan-claim{margin-right:72px}
  .plan-card{padding:4px 6px}
  .plan-card>svg{width:66px;max-width:66px}
  .angle-frame{padding:7px}
  .angle-svg{max-width:132px}
  .scale-layout{padding:10px;border-radius:14px;gap:8px}
  .scale-figure>svg{width:min(230px,100%)}
  .scale-zones{gap:5px}
  .scale-zone{min-height:50px;padding:6px}
  .scale-zone>b{font-size:11px}
  .junction-row{gap:5px}
  .junction-cell{padding:4px}
}
/* Tanlov ekranidagi burchak kartasi ixcham: chizma chapda, qiymat o'ngda */
.angle-frame.small{grid-template-columns:auto minmax(0,1fr);align-items:center;justify-items:start;gap:12px}
.angle-frame.small .angle-svg{width:112px;max-width:112px}
@media(max-width:639.98px){
  .angle-frame.small .angle-svg{width:92px;max-width:92px}
  .lesson-root .split-model{padding:8px;gap:8px}
  .split-model .angle-frame{padding:4px}
  .split-model .angle-svg{max-width:92px}
  .angle-readout{font-size:16px}
  .lesson-root .split-layout{grid-template-rows:auto auto;align-content:start}
  .split-steps{padding:8px}
  .step-list{gap:4px}
  .lesson-root .step-list>li{min-height:36px;padding:5px 7px}
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

// Burchak chizmasi: uch (vertex) chapda pastda, bir tomon gorizontal.
// `arm` — tomon uzunligi: burchak kattaligiga bog'liq emasligini ko'rsatish uchun.
const AngleSvg = ({ degree, arm = 74, showRight = false, tone = 'cyan' }) => {
  const rad = (degree * Math.PI) / 180;
  const cx = 26;
  const cy = 92;
  const x = cx + arm * Math.cos(rad);
  const y = cy - arm * Math.sin(rad);
  const arcR = 26;
  const ax = cx + arcR * Math.cos(rad);
  const ay = cy - arcR * Math.sin(rad);
  const large = degree > 180 ? 1 : 0;
  return (
    <svg className={`angle-svg tone-${tone}`} viewBox="0 0 140 110" aria-hidden="true">
      <path className="ang-arm" d={`M${cx} ${cy}H${cx + arm}`} />
      <path className="ang-arm" d={`M${cx} ${cy}L${x} ${y}`} />
      <path className="ang-arc" d={`M${cx + arcR} ${cy}A${arcR} ${arcR} 0 ${large} 0 ${ax} ${ay}`} />
      {showRight && <path className="ang-right" d={`M${cx + 15} ${cy}v-15h-15`} />}
      <circle className="ang-vertex" cx={cx} cy={cy} r="4" />
    </svg>
  );
};

// Xuk sahnasi: loyiha stolida ikkita chorraha chizmasi.
const HookScene = ({ c, resolved }) => {
  const t = useT();
  return (
    <div className={`dispatch-visual ${resolved ? 'is-resolved' : ''}`}>
      <div className="dispatch-head">
        <span className="dispatch-node"><i />{t(c.nodeName)}</span>
        <span className="dispatch-state">{t(c.stateBad)}</span>
      </div>
      <div className="dispatch-body plan-body">
        <div className="plan-card">
          <span>{t(c.planA)}</span>
          <AngleSvg degree={35} arm={92} tone="dark" />
          <b>A</b>
        </div>
        <div className="plan-card">
          <span>{t(c.planB)}</span>
          <AngleSvg degree={120} arm={48} tone="dark" />
          <b>B</b>
        </div>
        <div className="plan-claim">{t(c.botClaim)}</div>
      </div>
    </div>
  );
};

// s1 — burchakni ochish: tomon uzunligi o'zgarmaydi, ochilish o'zgaradi.
function AngleOpenScreen({ screen, onPrev, onNext }) {
  const t = useT();
  const c = CONTENT.s1;
  const [step, setStep] = useState(0);
  const audio = useGuidedNarration(c.audio, screen, step);
  const ready = isAudioReady(audio);
  const open = () => {
    if (!ready || step > 1) return;
    const next = step + 1;
    setStep(next);
    audio.speakStep(next);
  };
  const degree = c.degrees[step];
  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} canAdvance={step === 2}>
      <div className="stack">
        <Heading c={c} />
        <section className="split-layout">
          <div className="split-model">
            <span className="panel-label">{t(c.lead)}</span>
            <div className="angle-frame" data-g4-role="visual-frame">
              <AngleSvg degree={degree} arm={86} showRight={step >= 1} />
              <strong className="angle-readout">{degree}°</strong>
            </div>
            {step < 2
              ? <button type="button" className="btn-white-accent step-button" disabled={!ready} onClick={open}>{t(c.tapHint)} →</button>
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

// s5 — burchak shkalasi: zonalar ketma-ket ochiladi.
function AngleScaleScreen({ screen, onPrev, onNext }) {
  const t = useT();
  const c = CONTENT.s5;
  const [step, setStep] = useState(0);
  const audio = useGuidedNarration(c.audio, screen, step);
  const ready = isAudioReady(audio);
  const open = (index) => {
    if (!ready || index !== step) return;
    const next = step + 1;
    setStep(next);
    audio.speakStep(Math.min(next, 2));
  };
  const arc = (from, to) => {
    const r = 84;
    const p = (deg) => [110 + r * Math.cos((deg * Math.PI) / 180), 100 - r * Math.sin((deg * Math.PI) / 180)];
    const [x1, y1] = p(from);
    const [x2, y2] = p(to);
    return `M${x1} ${y1}A${r} ${r} 0 0 0 ${x2} ${y2}`;
  };
  return (
    <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} canAdvance={step === 3}>
      <div className="stack">
        <Heading c={c} />
        <section className="scale-layout">
          <div className="scale-head">
            <span className="panel-label">{t(c.source)}</span>
            <p className="relation-lead">{t(c.lead)}</p>
          </div>
          <div className="scale-figure" data-g4-role="visual-frame">
            <svg viewBox="0 0 220 116" aria-hidden="true">
              <path className="sc-base" d="M26 100h168" />
              <path className="sc-dial" d="M26 100A84 84 0 0 1 194 100" />
              {c.zones.map((zone, index) => (
                <path key={index} className={`sc-zone z${index} ${index < step ? 'is-open' : ''}`} d={arc(180 - zone.from, 180 - zone.to)} />
              ))}
              <path className="sc-tick" d="M110 100V22" />
              <circle className="sc-centre" cx="110" cy="100" r="5" />
            </svg>
          </div>
          <div className="scale-zones">
            {c.zones.map((zone, index) => (
              <button
                type="button" key={index}
                className={`scale-zone z${index} ${index < step ? 'is-open' : ''}`}
                disabled={!ready || index !== step}
                onClick={() => open(index)}
              >
                <b>{t(zone.range)}</b>
                <span>{t(zone.name)}</span>
              </button>
            ))}
          </div>
          {step === 3 && (
            <div className="split-done">
              <SolutionBit />
              <span>{t(c.doneLabel)}</span>
              <strong>{t(c.doneValue)}</strong>
            </div>
          )}
        </section>
      </div>
    </Stage>
  );
}

// Tanlov ekranlaridagi chizmalar.
const AngleCard = ({ c }) => {
  const t = useT();
  return (
    <div className="mini-frame" data-g4-role="visual-frame">
      <span className="panel-label">{t(c.taskNote)}</span>
      <div className="angle-frame small">
        <AngleSvg degree={c.figDegree} arm={78} showRight />
        <strong className="angle-readout">{t(c.task)}</strong>
      </div>
    </div>
  );
};

const RangeCard = ({ c }) => {
  const t = useT();
  return (
    <div className="mini-frame" data-g4-role="visual-frame">
      <span className="panel-label">{t(c.taskNote)}</span>
      <strong className="task-expression">{t(c.task)}</strong>
      <div className="range-strip"><i className="a" /><i className="b" /><i className="c" /></div>
    </div>
  );
};

const JunctionPlan = ({ c }) => {
  const t = useT();
  return (
    <div className="mini-frame" data-g4-role="visual-frame">
      <span className="panel-label">{t(c.taskNote)}</span>
      <div className="junction-row">
        {c.junction.map((degree, index) => (
          <div key={index} className="junction-cell">
            <AngleSvg degree={degree} arm={54} />
            <b>{degree}°</b>
          </div>
        ))}
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
const Screen1 = (props) => <AngleOpenScreen {...props} />;
const Screen2 = (props) => <ChoiceScreen {...props} visual={<AngleCard c={CONTENT.s2} />} />;
const Screen3 = (props) => <ThreeStepScreen {...props} />;
const Screen4 = (props) => <TileBuildScreen {...props} />;
const Screen5 = (props) => <AngleScaleScreen {...props} />;
const Screen6 = (props) => <ChoiceScreen {...props} visual={<RangeCard c={CONTENT.s6} />} />;
const Screen7 = (props) => <RowRepairScreen {...props} />;
const Screen8 = (props) => <EstimateBandScreen {...props} />;
const Screen9 = (props) => <ChoiceScreen {...props} visual={<AngleCard c={CONTENT.s9} />} />;
const Screen10 = (props) => <RuleBuilderScreen {...props} />;
const Screen11 = (props) => <RapidConsoleScreen {...props} />;
const Screen12 = (props) => <RouteCompareScreen {...props} />;
const Screen13 = (props) => <ChoiceScreen {...props} visual={<JunctionPlan c={CONTENT.s13} />} />;
const Screen14 = (props) => <ChoiceScreen {...props} visual={<AngleCard c={CONTENT.s14} />} />;
const Screen15 = (props) => <FinaleScreen {...props} />;
const SCREENS = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15];

export default function Grade4Dars33({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished, previewMode }) {
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
    else console.log('[Grade4 Dars33 preview]', payload);
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
