import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// 4-SINF · 25-DARS · To'plamlar va Eyler–Venn diagrammasi
// Approved frame vector: 3,4,4,4,4,4,4,5,2,2,2,2,2,3,5.

const T = {
  bg: '#F5F5F0', ink: '#12212C', ink2: '#50616D', ink3: '#87949D', paper: '#FFFFFF',
  accent: '#FF5B35', accentSoft: '#FFF0EA', cyan: '#168FA3', cyanSoft: '#E5F5F6',
  navy: '#173B52', lime: '#95C93D', success: '#227A53', successSoft: '#E7F3EC',
  warn: '#A96F13', warnSoft: '#FFF5D9', shadowBase: '58, 53, 48',
};

const TOTAL_SCREENS = 15;
const FRAME_COUNTS = [3, 4, 4, 4, 4, 4, 4, 5, 2, 2, 2, 2, 2, 3, 5];
const LESSON_META = {
  lessonId: 'sets-4-25-v1',
  slug: 'dars25-toplamlar-eyler-venn-diagrammasi',
  lessonTitle: { uz: "25-dars. To'plamlar va Eyler–Venn diagrammasi", ru: 'Урок 25. Множества и диаграмма Эйлера–Венна', en: 'Lesson 25. Sets and Euler–Venn diagrams' },
  skillTags: ['sets', 'element', 'two_criteria', 'euler_venn', 'classification'],
};

const SCREEN_META = [
  { id: 's0', type: 'hook', subtype: 'story-prediction', template: 'StoryChoice', mechanic: 'StoryChoice', goal: 'Predict where an object belongs under two criteria', misconceptions: ['one object copied into two sets'], active: true, scored: false, scope: 'hook', resetOnReturn: true },
  { id: 's1', type: 'model', subtype: 'single-set-model', template: 'StrategyReplay', mechanic: 'StrategyReplay', goal: 'Identify elements of one set', misconceptions: ['set label treated as element'], active: true, scored: false, scope: null },
  { id: 's2', type: 'exploration', subtype: 'overlap-model', template: 'StrategyReplay', mechanic: 'StrategyReplay', goal: 'Build the overlap of two criteria', misconceptions: ['duplicating shared elements'], active: true, scored: false, scope: null },
  { id: 's3', type: 'discovery', subtype: 'zone-classification', template: 'StrategyReplay', mechanic: 'StrategyReplay', goal: 'Discover the four classification zones', misconceptions: ['outside zone omitted'], active: true, scored: false, scope: null },
  { id: 's4', type: 'discovery', subtype: 'yes-no-strategy', template: 'StrategyReplay', mechanic: 'StrategyReplay', goal: 'Connect two criterion answers with a zone', misconceptions: ['criteria order ignored'], active: true, scored: false, scope: null },
  { id: 's5', type: 'rule', subtype: 'intersection-rule', template: 'StrategyReplay', mechanic: 'StrategyReplay', goal: 'Formulate the rule for the overlap', misconceptions: ['overlap means either set'], active: true, scored: false, scope: null },
  { id: 's6', type: 'strategy', subtype: 'outside-check-strategy', template: 'StrategyReplay', mechanic: 'StrategyReplay', goal: 'Check objects that satisfy neither criterion', misconceptions: ['all objects forced into a circle'], active: true, scored: false, scope: null },
  { id: 's7', type: 'consolidation', subtype: 'zone-transfer', template: 'StrategyReplay', mechanic: 'StrategyReplay', goal: 'Transfer the classification strategy to a new object', misconceptions: ['shared element duplicated'], active: true, scored: false, scope: null },
  { id: 's8', type: 'test', subtype: 'first-zone-practice', template: 'MCScreen', mechanic: 'MCScreen', goal: 'Classify an object in the first set only', misconceptions: ['overlap selected'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's9', type: 'test', subtype: 'intersection-practice', template: 'MCScreen', mechanic: 'MCScreen', goal: 'Classify an object in both sets', misconceptions: ['object copied into two zones'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's10', type: 'strategy', subtype: 'second-zone-check', template: 'MCScreen', mechanic: 'MCScreen', goal: 'Use both criteria to justify a zone', misconceptions: ['first criterion ignored'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's11', type: 'test', subtype: 'outside-practice', template: 'MCScreen', mechanic: 'MCScreen', goal: 'Classify an object outside both sets', misconceptions: ['outside zone omitted'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's12', type: 'error', subtype: 'misconception-repair', template: 'ErrorRepairChoice', mechanic: 'ErrorRepairChoice', goal: "Repair Bit's duplicated-element error", misconceptions: ['one object counted twice'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's13', type: 'case', subtype: 'life-context-transfer', template: 'CaseChoice', mechanic: 'CaseChoice', goal: 'Classify a device using two real criteria', misconceptions: ['criteria reversed'], active: true, scored: true, scoreUnits: 1, scope: 'final' },
  { id: 's14', type: 'summary', subtype: 'reflection-and-title', template: 'ReflectionClaim', mechanic: 'ReflectionClaim', goal: 'Reflect on classification and bridge to measurement', misconceptions: ['single-criterion check'], active: true, scored: false, scope: null },
];

const CONTENT = {
  s0: {
    eyebrow: { uz: "Saralash markazi", ru: 'Центр сортировки', en: 'Sorting centre' },
    title: { uz: "Ko'k uchburchak qayerga joylashadi?", ru: 'Куда поместить синий треугольник?', en: 'Where does the blue triangle belong?' },
    frames: [
      { uz: "A belgisi: ko'k", ru: 'Признак A: синие', en: 'Property A: blue' },
      { uz: "B belgisi: uchburchak", ru: 'Признак B: треугольники', en: 'Property B: triangles' },
      { uz: "Ko'k uchburchak qayerga joylashadi?", ru: 'Куда поместить синий треугольник?', en: 'Where does the blue triangle belong?' },
    ],
    question: { uz: "Ko'k uchburchak uchun qaysi joyni taxmin qilasiz?", ru: 'Какую область ты выберешь для синего треугольника?', en: 'Which region would you choose for the blue triangle?' },
    options: [{ uz: "Faqat A", ru: 'Только A', en: 'A only' }, { uz: "Ikkalasi", ru: 'Обе', en: 'Both' }, { uz: "Faqat B", ru: 'Только B', en: 'B only' }],
    neutral: { uz: "Taxmin saqlandi. Endi har bir joyning ma'nosini tekshiramiz.", ru: 'Гипотеза сохранена. Теперь разберём смысл каждой области.', en: 'Your prediction has been recorded. Now let us explore what each region means.' },
    audio: { intro: {
      uz: ["Saralash markazida A belgisi ko'k figuralarni bildiradi.", "B belgisi uchburchaklarni bildiradi.", "Ko'k uchburchak qayerga joylashishini taxmin qiling."],
      ru: ['В центре сортировки признак A означает синие фигуры.', 'Признак B означает треугольники.', 'Предположи, куда нужно поместить синий треугольник.'],
      en: ['At the sorting centre, property A means blue shapes.', 'Property B means triangles.', 'Predict where the blue triangle should be placed.'],
    } },
  },
  s1: {
    eyebrow: { uz: "Asosiy tushuncha", ru: 'Основное понятие', en: 'Key idea' },
    title: { uz: "To'plam va uning elementlari", ru: 'Множество и его элементы', en: 'A set and its elements' },
    frames: [
      { uz: "Figuralar bitta belgi bilan jamlandi", ru: 'Фигуры собраны по одному признаку', en: 'The shapes are grouped by one property' },
      { uz: "Guruh — to'plam", ru: 'Группа — это множество', en: 'The group is a set' },
      { uz: "Har bir figura — element", ru: 'Каждая фигура — элемент', en: 'Each shape is an element' },
      { uz: "Mos element doira ichida turadi", ru: 'Подходящий элемент находится внутри круга', en: 'A matching element belongs inside the circle' },
    ],
    audio: {
      uz: ["Bir xil belgi bo'yicha jamlangan obyektlar guruhini kuzating.", "Bunday guruhni to'plam deb ataymiz.", "To'plamdagi har bir obyekt uning elementi bo'ladi.", "Element berilgan belgiga mos bo'lsa, uni doira ichida ko'rsatamiz."],
      ru: ['Рассмотри группу объектов, собранных по одному признаку.', 'Такую группу называют множеством.', 'Каждый объект в множестве является его элементом.', 'Если элемент подходит признаку, его показывают внутри круга.'],
      en: ['Look at a group of objects collected by the same property.', 'We call such a group a set.', 'Every object in the set is one of its elements.', 'If an element matches the given property, we show it inside the circle.'],
    },
  },
  s2: {
    eyebrow: { uz: "Ikki belgi", ru: 'Два признака', en: 'Two properties' },
    title: { uz: "Ikki xira nusxa bitta elementga qaytadi", ru: 'Две полупрозрачные копии снова становятся одним элементом', en: 'Two faded copies become one element again' },
    frames: [
      { uz: "Bitta ko'k uchburchak", ru: 'Один синий треугольник', en: 'One blue triangle' },
      { uz: "Ko'k belgi uchun A nusxasi", ru: 'Копия для признака A: синий цвет', en: 'Copy A for the blue property' },
      { uz: "Uchburchak belgisi uchun B nusxasi", ru: 'Копия для признака B: форма треугольника', en: 'Copy B for the triangle property' },
      { uz: "Nusxalar o'rtada birlashadi", ru: 'Копии объединяются в середине', en: 'The copies join in the middle' },
    ],
    audio: {
      uz: ["Bitta ko'k uchburchakni ikki belgi bo'yicha kuzatamiz.", "Animatsiyadagi xira nusxa rang belgisi bo'yicha A doirasiga yo'naladi.", "Ikkinchi xira nusxa shakl belgisi bo'yicha B doirasiga yo'naladi.", "O'rtada nusxalar yana bitta elementga birlashadi; figura ikkala belgiga mos."],
      ru: ['Рассмотрим один синий треугольник по двум признакам.', 'Полупрозрачная копия в анимации направляется в круг A по признаку цвета.', 'Вторая полупрозрачная копия направляется в круг B по признаку формы.', 'В середине копии снова объединяются в один элемент; фигура подходит обоим признакам.'],
      en: ['Let us examine one blue triangle using two properties.', 'In the animation, a faded copy moves to circle A because of its colour.', 'The second faded copy moves to circle B because of its shape.', 'In the middle, the copies join into one element again because the shape matches both properties.'],
    },
  },
  s3: {
    eyebrow: { uz: "Diagramma", ru: 'Диаграмма', en: 'Diagram' },
    title: { uz: "To'rtta aniq joy", ru: 'Четыре точные области', en: 'Four precise regions' },
    frames: [{ uz: "Faqat A", ru: 'Только A', en: 'A only' }, { uz: "Ikkalasi", ru: 'Обе', en: 'Both' }, { uz: "Faqat B", ru: 'Только B', en: 'B only' }, { uz: "Tashqarida", ru: 'Снаружи', en: 'Outside' }],
    audio: {
      uz: ["Chap doiraning alohida qismi faqat A belgisiga mos elementlar uchun.", "Doiralar ustma-ust tushgan o'rta qism ikkala belgiga mos elementlar uchun.", "O'ng doiraning alohida qismi faqat B belgisiga mos elementlar uchun.", "Hech bir belgiga mos kelmagan element ikkala doiradan tashqarida turadi."],
      ru: ['Отдельная часть левого круга предназначена для элементов только с признаком A.', 'Средняя часть, где круги перекрываются, предназначена для элементов с обоими признаками.', 'Отдельная часть правого круга предназначена для элементов только с признаком B.', 'Элемент, который не подходит ни одному признаку, находится снаружи обоих кругов.'],
      en: ['The separate part of the left circle is for elements that match only property A.', 'The middle region where the circles overlap is for elements that match both properties.', 'The separate part of the right circle is for elements that match only property B.', 'An element that matches neither property belongs outside both circles.'],
    },
  },
  s4: {
    eyebrow: { uz: "Javoblar xaritasi", ru: 'Карта ответов', en: 'Answer map' },
    title: { uz: "To'rtta figura — to'rtta javob jufti", ru: 'Четыре фигуры — четыре пары ответов', en: 'Four shapes — four pairs of answers' },
    frames: [
      { uz: "Ko'k kvadrat: ha / yo'q — Faqat A", ru: 'Синий квадрат: да / нет — Только A', en: 'Blue square: yes / no — A only' },
      { uz: "Ko'k uchburchak: ha / ha — Ikkalasi", ru: 'Синий треугольник: да / да — Обе', en: 'Blue triangle: yes / yes — Both' },
      { uz: "Sariq uchburchak: yo'q / ha — Faqat B", ru: 'Жёлтый треугольник: нет / да — Только B', en: 'Yellow triangle: no / yes — B only' },
      { uz: "Sariq doira: yo'q / yo'q — Tashqarida", ru: 'Жёлтый круг: нет / нет — Снаружи', en: 'Yellow circle: no / no — Outside' },
    ],
    audio: {
      uz: ["Ko'k kvadrat A ga mos, B ga mos emas; u faqat A qismida turadi.", "Ko'k uchburchak A ga ham, B ga ham mos; u o'rta qismda turadi.", "Sariq uchburchak A ga mos emas, B ga mos; u faqat B qismida turadi.", "Sariq doira ikkala belgiga ham mos emas; u tashqarida turadi."],
      ru: ['Синий квадрат подходит A и не подходит B; он находится только в A.', 'Синий треугольник подходит и A, и B; он находится в середине.', 'Жёлтый треугольник не подходит A и подходит B; он находится только в B.', 'Жёлтый круг не подходит ни одному признаку; он находится снаружи.'],
      en: ['The blue square matches A but not B, so it belongs in A only.', 'The blue triangle matches both A and B, so it belongs in the middle.', 'The yellow triangle does not match A but matches B, so it belongs in B only.', 'The yellow circle matches neither property, so it belongs outside.'],
    },
  },
  s5: {
    eyebrow: { uz: "Muhim bog'lanish", ru: 'Важная связь', en: 'Important connection' },
    title: { uz: "O'rtadagi element ikkala tomonda sanaladi", ru: 'Элемент в середине считают с обеих сторон', en: 'An element in the middle is counted in both sets' },
    frames: [{ uz: "Faqat A: 2", ru: 'Только A: 2', en: 'A only: 2' }, { uz: "O'rtada: 1", ru: 'В середине: 1', en: 'Middle: 1' }, { uz: "A jami: 3", ru: 'Всего в A: 3', en: 'Total in A: 3' }, { uz: "B jami: 2", ru: 'Всего в B: 2', en: 'Total in B: 2' }],
    audio: {
      uz: ["Faqat A qismida ikkita element bor.", "O'rta qismdagi bitta element A ga ham, B ga ham mos.", "A bo'yicha ikkita alohida va bitta o'rta element sanaladi; jami uchta.", "Faqat B qismidagi bitta va o'rtadagi bitta element sanaladi; B bo'yicha jami ikkita."],
      ru: ['В области только A находятся два элемента.', 'Один элемент в середине подходит и A, и B.', 'Для A считаем два отдельных элемента и один средний; всего три.', 'Для B считаем один отдельный элемент и один средний; всего два.'],
      en: ['There are two elements in the A-only region.', 'The one element in the middle matches both A and B.', 'For A, count the two separate elements and the one in the middle: three altogether.', 'For B, count the one separate element and the one in the middle: two altogether.'],
    },
  },
  s6: {
    eyebrow: { uz: "Tashqi qism", ru: 'Внешняя область', en: 'Outside region' },
    title: { uz: "Tashqarida turish ham aniq javob", ru: 'Положение снаружи — тоже точный ответ', en: 'Outside is also a precise answer' },
    frames: [{ uz: "Sariq doira ko'k emas", ru: 'Жёлтый круг не синий', en: 'The yellow circle is not blue' }, { uz: "U uchburchak ham emas", ru: 'Он также не треугольник', en: 'It is not a triangle either' }, { uz: "A ga mos emas, B ga mos emas", ru: 'Не подходит A и не подходит B', en: 'It matches neither A nor B' }, { uz: "Tashqarida, lekin ma'lumotda qoladi", ru: 'Снаружи, но остаётся в данных', en: 'Outside, but still part of the data' }],
    audio: {
      uz: ["Sariq doira A belgisiga mos emas, chunki u ko'k emas.", "U B belgisiga ham mos emas, chunki uchburchak emas.", "Ikki savolga ham yo'q javobi olindi.", "Sariq doira tashqarida turadi, lekin saralash ma'lumotida qoladi."],
      ru: ['Жёлтый круг не подходит признаку A, потому что он не синий.', 'Он не подходит и признаку B, потому что это не треугольник.', 'На оба вопроса получен ответ нет.', 'Жёлтый круг находится снаружи, но остаётся в данных сортировки.'],
      en: ['The yellow circle does not match property A because it is not blue.', 'It does not match property B either because it is not a triangle.', 'Both questions have the answer no.', 'The yellow circle belongs outside, but it remains part of the sorting data.'],
    },
  },
  s7: {
    eyebrow: { uz: "Strategiya", ru: 'Стратегия', en: 'Strategy' },
    title: { uz: "O'qing, so'rang, zonani tanlang", ru: 'Прочитай, спроси, выбери область', en: 'Read, ask, choose the region' },
    frames: [{ uz: "A belgisini o'qing", ru: 'Прочитай признак A', en: 'Read property A' }, { uz: "B belgisini o'qing", ru: 'Прочитай признак B', en: 'Read property B' }, { uz: "A ga mosmi, deb so'rang", ru: 'Спроси: подходит ли A?', en: 'Ask: does it match A?' }, { uz: "B ga mosmi, deb so'rang", ru: 'Спроси: подходит ли B?', en: 'Ask: does it match B?' }, { uz: "Javoblar bo'yicha zonani tanlang", ru: 'Выбери область по ответам', en: 'Choose the region from the two answers' }],
    audio: {
      uz: ["Avval A belgisini diqqat bilan o'qing.", "Keyin B belgisini ham o'qing.", "Element A ga mos kelishini so'rang.", "So'ng element B ga mos kelishini so'rang.", "Ikki javobga mos zonani tanlang."],
      ru: ['Сначала внимательно прочитай признак A.', 'Затем прочитай признак B.', 'Спроси, подходит ли элемент признаку A.', 'После этого спроси, подходит ли элемент признаку B.', 'Выбери область, соответствующую двум ответам.'],
      en: ['First, read property A carefully.', 'Then read property B.', 'Ask whether the element matches property A.', 'Next, ask whether the element matches property B.', 'Choose the region that matches the two answers.'],
    },
  },
  s8: {
    eyebrow: { uz: "Tekshiruv · 1/6", ru: 'Проверка · 1/6', en: 'Check · 1/6' }, title: { uz: "Ko'k kvadrat", ru: 'Синий квадрат', en: 'Blue square' },
    frames: [{ uz: "A: ko'k · B: uchburchak", ru: 'A: синие · B: треугольники', en: 'A: blue · B: triangles' }, { uz: "Ko'k kvadrat qayerda?", ru: 'Где находится синий квадрат?', en: 'Where does the blue square belong?' }],
    question: { uz: "Ko'k kvadrat qaysi joyga tegishli?", ru: 'К какой области относится синий квадрат?', en: 'Which region does the blue square belong to?' },
    options: [{ uz: "Faqat A", ru: 'Только A', en: 'A only' }, { uz: "Ikkalasi", ru: 'Обе', en: 'Both' }, { uz: "Faqat B", ru: 'Только B', en: 'B only' }, { uz: "Tashqarida", ru: 'Снаружи', en: 'Outside' }], correctIndex: 0,
    feedback: [{ uz: "To'g'ri. Kvadrat ko'k, lekin uchburchak emas.", ru: 'Верно. Квадрат синий, но не является треугольником.', en: 'Correct. The square is blue, but it is not a triangle.' }, { uz: "Ikkalasi bo'lishi uchun figura uchburchak ham bo'lishi kerak.", ru: 'Чтобы попасть в обе области, фигура должна быть ещё и треугольником.', en: 'To belong to both sets, the shape must also be a triangle.' }, { uz: "Faqat B uchun figura uchburchak bo'lishi kerak.", ru: 'Для области только B фигура должна быть треугольником.', en: 'For B only, the shape must be a triangle.' }, { uz: "Ko'k rang A belgisiga mos, shuning uchun figura tashqarida emas.", ru: 'Синий цвет подходит признаку A, поэтому фигура не снаружи.', en: 'Blue matches property A, so the shape is not outside.' }],
    feedbackAudio: [{ uz: "To'g'ri. Kvadrat ko'k, lekin uchburchak emas.", ru: 'Верно. Квадрат синий, но не является треугольником.', en: 'Correct. The square is blue, but it is not a triangle.' }, { uz: "Ikkala belgiga mos bo'lishi uchun figura uchburchak ham bo'lishi kerak.", ru: 'Чтобы подойти обоим признакам, фигура должна быть ещё и треугольником.', en: 'To match both properties, the shape must also be a triangle.' }, { uz: "Faqat B uchun figura uchburchak bo'lishi kerak.", ru: 'Для области только B фигура должна быть треугольником.', en: 'For B only, the shape must be a triangle.' }, { uz: "Ko'k rang A belgisiga mos, shuning uchun figura tashqarida emas.", ru: 'Синий цвет подходит признаку A, поэтому фигура не снаружи.', en: 'Blue matches property A, so the shape is not outside.' }],
    proof: { uz: "A: Ha · B: Yo'q → Faqat A", ru: 'A: Да · B: Нет → Только A', en: 'A: Yes · B: No → A only' },
    audio: { intro: { uz: ["A belgisi ko'k figuralar, B belgisi uchburchaklar uchun.", "Ko'k kvadratning joyini ikki savol bilan aniqlang."], ru: ['Признак A относится к синим фигурам, а признак B к треугольникам.', 'Определи место синего квадрата с помощью двух вопросов.'], en: ['Property A is for blue shapes, and property B is for triangles.', 'Use two questions to determine where the blue square belongs.'] }, on_correct: { uz: "To'g'ri. Ko'k kvadrat faqat A ga mos.", ru: 'Верно. Синий квадрат подходит только A.', en: 'Correct. The blue square matches only A.' } },
  },
  s9: {
    eyebrow: { uz: "Tekshiruv · 2/6", ru: 'Проверка · 2/6', en: 'Check · 2/6' }, title: { uz: "Ko'k uchburchak", ru: 'Синий треугольник', en: 'Blue triangle' },
    frames: [{ uz: "A: ko'k · B: uchburchak", ru: 'A: синие · B: треугольники', en: 'A: blue · B: triangles' }, { uz: "Ikki belgi ham tekshiriladi", ru: 'Проверяются оба признака', en: 'Check both properties' }],
    question: { uz: "Ko'k uchburchak qaysi joyga tegishli?", ru: 'К какой области относится синий треугольник?', en: 'Which region does the blue triangle belong to?' },
    options: [{ uz: "Faqat A", ru: 'Только A', en: 'A only' }, { uz: "Ikkalasi", ru: 'Обе', en: 'Both' }, { uz: "Faqat B", ru: 'Только B', en: 'B only' }, { uz: "Tashqarida", ru: 'Снаружи', en: 'Outside' }], correctIndex: 1,
    feedback: [{ uz: "Figura uchburchak ham, shuning uchun faqat A emas.", ru: 'Фигура ещё и треугольник, поэтому это не только A.', en: 'The shape is also a triangle, so it does not belong to A only.' }, { uz: "To'g'ri. Figura ko'k va uchburchak.", ru: 'Верно. Фигура синяя и является треугольником.', en: 'Correct. The shape is blue and it is a triangle.' }, { uz: "Figura ko'k ham, shuning uchun faqat B emas.", ru: 'Фигура ещё и синяя, поэтому это не только B.', en: 'The shape is also blue, so it does not belong to B only.' }, { uz: "Figura ikkala belgiga mos, shuning uchun tashqarida emas.", ru: 'Фигура подходит обоим признакам, поэтому она не снаружи.', en: 'The shape matches both properties, so it is not outside.' }],
    feedbackAudio: [{ uz: "Figura uchburchak ham, shuning uchun faqat A emas.", ru: 'Фигура ещё и треугольник, поэтому это не только A.', en: 'The shape is also a triangle, so it does not belong to A only.' }, { uz: "To'g'ri. Figura ko'k va uchburchak.", ru: 'Верно. Фигура синяя и является треугольником.', en: 'Correct. The shape is blue and it is a triangle.' }, { uz: "Figura ko'k ham, shuning uchun faqat B emas.", ru: 'Фигура ещё и синяя, поэтому это не только B.', en: 'The shape is also blue, so it does not belong to B only.' }, { uz: "Figura ikkala belgiga mos, shuning uchun tashqarida emas.", ru: 'Фигура подходит обоим признакам, поэтому она не снаружи.', en: 'The shape matches both properties, so it is not outside.' }],
    proof: { uz: "A: Ha · B: Ha → Ikkalasi", ru: 'A: Да · B: Да → Обе', en: 'A: Yes · B: Yes → Both' },
    audio: { intro: { uz: ["Ko'k uchburchak A belgisiga mos keladi.", "U B belgisiga ham mos; aniq joyni tanlang."], ru: ['Синий треугольник подходит признаку A.', 'Он подходит и признаку B; выбери точную область.'], en: ['The blue triangle matches property A.', 'It also matches property B. Choose the precise region.'] }, on_correct: { uz: "To'g'ri. Ko'k uchburchak o'rta qismda.", ru: 'Верно. Синий треугольник находится в середине.', en: 'Correct. The blue triangle belongs in the middle.' } },
  },
  s10: {
    eyebrow: { uz: "Tekshiruv · 3/6", ru: 'Проверка · 3/6', en: 'Check · 3/6' }, title: { uz: "Sariq uchburchak", ru: 'Жёлтый треугольник', en: 'Yellow triangle' },
    frames: [{ uz: "A: ko'k · B: uchburchak", ru: 'A: синие · B: треугольники', en: 'A: blue · B: triangles' }, { uz: "Rang va shaklni ajrating", ru: 'Раздели цвет и форму', en: 'Consider colour and shape separately' }],
    question: { uz: "Sariq uchburchak qaysi joyga tegishli?", ru: 'К какой области относится жёлтый треугольник?', en: 'Which region does the yellow triangle belong to?' },
    options: [{ uz: "Faqat A", ru: 'Только A', en: 'A only' }, { uz: "Ikkalasi", ru: 'Обе', en: 'Both' }, { uz: "Faqat B", ru: 'Только B', en: 'B only' }, { uz: "Tashqarida", ru: 'Снаружи', en: 'Outside' }], correctIndex: 2,
    feedback: [{ uz: "Figura ko'k emas, shuning uchun A ga mos emas.", ru: 'Фигура не синяя, поэтому не подходит A.', en: 'The shape is not blue, so it does not match A.' }, { uz: "Ikkalasi uchun figura ko'k ham bo'lishi kerak.", ru: 'Для обеих областей фигура должна быть ещё и синей.', en: 'To belong to both sets, the shape must also be blue.' }, { uz: "To'g'ri. U uchburchak, lekin ko'k emas.", ru: 'Верно. Это треугольник, но он не синий.', en: 'Correct. It is a triangle, but it is not blue.' }, { uz: "Uchburchak shakli B belgisiga mos, shuning uchun tashqarida emas.", ru: 'Форма треугольника подходит B, поэтому фигура не снаружи.', en: 'Its triangular shape matches B, so it is not outside.' }],
    feedbackAudio: [{ uz: "Figura ko'k emas, shuning uchun A ga mos emas.", ru: 'Фигура не синяя, поэтому не подходит A.', en: 'The shape is not blue, so it does not match A.' }, { uz: "Ikkala belgi uchun figura ko'k ham bo'lishi kerak.", ru: 'Для обоих признаков фигура должна быть ещё и синей.', en: 'To match both properties, the shape must also be blue.' }, { uz: "To'g'ri. U uchburchak, lekin ko'k emas.", ru: 'Верно. Это треугольник, но он не синий.', en: 'Correct. It is a triangle, but it is not blue.' }, { uz: "Uchburchak shakli B belgisiga mos, shuning uchun tashqarida emas.", ru: 'Форма треугольника подходит B, поэтому фигура не снаружи.', en: 'Its triangular shape matches B, so it is not outside.' }],
    proof: { uz: "A: Yo'q · B: Ha → Faqat B", ru: 'A: Нет · B: Да → Только B', en: 'A: No · B: Yes → B only' },
    audio: { intro: { uz: ["Sariq uchburchak ko'k rang belgisiga mos emas.", "Uning shakli B belgisiga mos; joyini tanlang."], ru: ['Жёлтый треугольник не подходит признаку синего цвета.', 'Его форма подходит признаку B; выбери область.'], en: ['The yellow triangle does not match the blue property.', 'Its shape matches property B. Choose its region.'] }, on_correct: { uz: "To'g'ri. Sariq uchburchak faqat B ga mos.", ru: 'Верно. Жёлтый треугольник подходит только B.', en: 'Correct. The yellow triangle matches only B.' } },
  },
  s11: {
    eyebrow: { uz: "Tekshiruv · 4/6", ru: 'Проверка · 4/6', en: 'Check · 4/6' }, title: { uz: "Sariq doira", ru: 'Жёлтый круг', en: 'Yellow circle' },
    frames: [{ uz: "A: ko'k · B: uchburchak", ru: 'A: синие · B: треугольники', en: 'A: blue · B: triangles' }, { uz: "Hech bir belgi mos kelmasligi mumkin", ru: 'Может не подойти ни один признак', en: 'An element may match neither property' }],
    question: { uz: "Sariq doira qaysi joyga tegishli?", ru: 'К какой области относится жёлтый круг?', en: 'Which region does the yellow circle belong to?' },
    options: [{ uz: "Faqat A", ru: 'Только A', en: 'A only' }, { uz: "Ikkalasi", ru: 'Обе', en: 'Both' }, { uz: "Faqat B", ru: 'Только B', en: 'B only' }, { uz: "Tashqarida", ru: 'Снаружи', en: 'Outside' }], correctIndex: 3,
    feedback: [{ uz: "Sariq doira ko'k emas, shuning uchun A ga mos emas.", ru: 'Жёлтый круг не синий, поэтому не подходит A.', en: 'The yellow circle is not blue, so it does not match A.' }, { uz: "Figura ko'k ham, uchburchak ham emas.", ru: 'Фигура не синяя и не является треугольником.', en: 'The shape is neither blue nor a triangle.' }, { uz: "Doira uchburchak emas, shuning uchun B ga mos emas.", ru: 'Круг не является треугольником, поэтому не подходит B.', en: 'A circle is not a triangle, so it does not match B.' }, { uz: "To'g'ri. Ikki belgiga ham mos emas, demak tashqarida.", ru: 'Верно. Не подходит ни одному признаку, значит находится снаружи.', en: 'Correct. It matches neither property, so it belongs outside.' }],
    feedbackAudio: [{ uz: "Sariq doira ko'k emas, shuning uchun A ga mos emas.", ru: 'Жёлтый круг не синий, поэтому не подходит A.', en: 'The yellow circle is not blue, so it does not match A.' }, { uz: "Figura ko'k ham, uchburchak ham emas.", ru: 'Фигура не синяя и не является треугольником.', en: 'The shape is neither blue nor a triangle.' }, { uz: "Doira uchburchak emas, shuning uchun B ga mos emas.", ru: 'Круг не является треугольником, поэтому не подходит B.', en: 'A circle is not a triangle, so it does not match B.' }, { uz: "To'g'ri. Ikki belgiga ham mos emas, demak tashqarida.", ru: 'Верно. Не подходит ни одному признаку, значит находится снаружи.', en: 'Correct. It matches neither property, so it belongs outside.' }],
    proof: { uz: "A: Yo'q · B: Yo'q → Tashqarida", ru: 'A: Нет · B: Нет → Снаружи', en: 'A: No · B: No → Outside' },
    audio: { intro: { uz: ["Sariq doira A belgisiga mos emas.", "U B belgisiga ham mos emas; diagrammadagi joyini toping."], ru: ['Жёлтый круг не подходит признаку A.', 'Он также не подходит признаку B; найди его место на диаграмме.'], en: ['The yellow circle does not match property A.', 'It does not match property B either. Find its place on the diagram.'] }, on_correct: { uz: "To'g'ri. Sariq doira tashqi qismda.", ru: 'Верно. Жёлтый круг находится снаружи.', en: 'Correct. The yellow circle belongs outside.' } },
  },
  s12: {
    eyebrow: { uz: "Tekshiruv · 5/6", ru: 'Проверка · 5/6', en: 'Check · 5/6' }, title: { uz: "A bo'yicha sanang", ru: 'Посчитай по признаку A', en: 'Count the elements in A' },
    frames: [{ uz: "Faqat A da 2 ta", ru: 'Только в A: 2', en: 'A only: 2' }, { uz: "O'rtada 2 ta", ru: 'В середине: 2', en: 'Middle: 2' }],
    question: { uz: "A belgisiga jami nechta element mos?", ru: 'Сколько всего элементов подходит признаку A?', en: 'How many elements match property A altogether?' }, options: ['2', '3', '4', '6'], correctIndex: 2,
    feedback: [{ uz: "O'rtadagi 2 ta element ham A ga mos. Ularni ham sanang.", ru: 'Два элемента в середине тоже подходят A. Посчитай и их.', en: 'The two elements in the middle also match A. Count them as well.' }, { uz: "Uchta emas. A ning ikki qismini birga sanang.", ru: 'Не три. Посчитай обе части области A вместе.', en: 'Not three. Count both parts of set A together.' }, { uz: "To'g'ri. Faqat A dagi 2 ta va o'rtadagi 2 ta: jami 4 ta.", ru: 'Верно. Два только в A и два в середине: всего четыре.', en: 'Correct. Two in A only and two in the middle make four altogether.' }, { uz: "A doirasining alohida va o'rta qismini sanang.", ru: 'Посчитай отдельную и среднюю части круга A.', en: 'Count the separate and middle parts of circle A.' }],
    feedbackAudio: [{ uz: "O'rtadagi ikkita element ham A ga mos. Ularni ham sanang.", ru: 'Два элемента в середине тоже подходят A. Посчитай и их.', en: 'The two elements in the middle also match A. Count them as well.' }, { uz: "Uchta emas. A ning ikki qismini birga sanang.", ru: 'Не три. Посчитай обе части области A вместе.', en: 'Not three. Count both parts of set A together.' }, { uz: "To'g'ri. Faqat A dagi ikkita va o'rtadagi ikkita, jami to'rtta.", ru: 'Верно. Два только в A и два в середине, всего четыре.', en: 'Correct. Two in A only and two in the middle make four altogether.' }, { uz: "A doirasining alohida va o'rta qismini sanang.", ru: 'Посчитай отдельную и среднюю части круга A.', en: 'Count the separate and middle parts of circle A.' }],
    proof: { uz: "2 + 2 = 4", ru: '2 + 2 = 4', en: '2 + 2 = 4' },
    audio: { intro: { uz: ["A ning alohida qismida ikkita element bor.", "O'rta qismdagi ikkita element ham A ga mos; jami sonni toping."], ru: ['В отдельной части A находятся два элемента.', 'Два элемента в середине тоже подходят A; найди общее число.'], en: ['There are two elements in the separate part of A.', 'The two elements in the middle also match A. Find the total.'] }, on_correct: { uz: "To'g'ri. A belgisiga to'rtta element mos.", ru: 'Верно. Признаку A подходят четыре элемента.', en: 'Correct. Four elements match property A.' } },
  },
  s13: {
    eyebrow: { uz: "Tekshiruv · 6/6", ru: 'Проверка · 6/6', en: 'Check · 6/6' }, title: { uz: "M7 qurilmasini saralang", ru: 'Распредели устройство M7', en: 'Sort device M7' },
    frames: [{ uz: "A: quyosh energiyasida ishlaydi", ru: 'A: работает от солнечной энергии', en: 'A: powered by solar energy' }, { uz: "B: simsiz ulanadi", ru: 'B: подключается без проводов', en: 'B: connects wirelessly' }, { uz: "M7: quyoshli va simsiz", ru: 'M7: солнечное и беспроводное', en: 'M7: solar-powered and wireless' }],
    question: { uz: "M7 qaysi joyga tegishli?", ru: 'К какой области относится M7?', en: 'Which region does M7 belong to?' },
    options: [{ uz: "Faqat A", ru: 'Только A', en: 'A only' }, { uz: "Ikkalasi", ru: 'Обе', en: 'Both' }, { uz: "Faqat B", ru: 'Только B', en: 'B only' }, { uz: "Tashqarida", ru: 'Снаружи', en: 'Outside' }], correctIndex: 1,
    feedback: [{ uz: "M7 simsiz ham ulanadi, shuning uchun faqat A emas.", ru: 'M7 также подключается без проводов, поэтому это не только A.', en: 'M7 also connects wirelessly, so it does not belong to A only.' }, { uz: "To'g'ri. M7 quyosh energiyasida ishlaydi va simsiz ulanadi.", ru: 'Верно. M7 работает от солнечной энергии и подключается без проводов.', en: 'Correct. M7 is powered by solar energy and connects wirelessly.' }, { uz: "M7 quyosh energiyasida ham ishlaydi, shuning uchun faqat B emas.", ru: 'M7 также работает от солнечной энергии, поэтому это не только B.', en: 'M7 is also powered by solar energy, so it does not belong to B only.' }, { uz: "M7 ikkala belgiga mos, shuning uchun tashqarida emas.", ru: 'M7 подходит обоим признакам, поэтому устройство не снаружи.', en: 'M7 matches both properties, so it does not belong outside.' }],
    feedbackAudio: [{ uz: "M yetti simsiz ham ulanadi, shuning uchun faqat A emas.", ru: 'Эм семь также подключается без проводов, поэтому это не только A.', en: 'M seven also connects wirelessly, so it does not belong to A only.' }, { uz: "To'g'ri. M yetti quyosh energiyasida ishlaydi va simsiz ulanadi.", ru: 'Верно. Эм семь работает от солнечной энергии и подключается без проводов.', en: 'Correct. M seven is powered by solar energy and connects wirelessly.' }, { uz: "M yetti quyosh energiyasida ham ishlaydi, shuning uchun faqat B emas.", ru: 'Эм семь также работает от солнечной энергии, поэтому это не только B.', en: 'M seven is also powered by solar energy, so it does not belong to B only.' }, { uz: "M yetti ikkala belgiga mos, shuning uchun tashqarida emas.", ru: 'Эм семь подходит обоим признакам, поэтому устройство не снаружи.', en: 'M seven matches both properties, so it does not belong outside.' }],
    proof: { uz: "A: Ha · B: Ha → Ikkalasi", ru: 'A: Да · B: Да → Обе', en: 'A: Yes · B: Yes → Both' },
    audio: { intro: { uz: ["A belgisi quyosh energiyasida ishlaydigan qurilmalar uchun.", "B belgisi simsiz ulanadigan qurilmalar uchun.", "M yetti ikkala xususiyatga ega; uning joyini tanlang."], ru: ['Признак A относится к устройствам на солнечной энергии.', 'Признак B относится к устройствам с беспроводным подключением.', 'Эм семь имеет оба свойства; выбери его область.'], en: ['Property A is for devices powered by solar energy.', 'Property B is for devices that connect wirelessly.', 'M seven has both properties. Choose its region.'] }, on_correct: { uz: "To'g'ri. M yetti o'rta qismga joylashadi.", ru: 'Верно. Эм семь помещается в среднюю область.', en: 'Correct. M seven belongs in the middle region.' } },
  },
  s14: {
    eyebrow: { uz: "Yakun", ru: 'Итог', en: 'Summary' }, title: { uz: "Ikki belgi bo'yicha aniq saralash", ru: 'Точная сортировка по двум признакам', en: 'Sort precisely by two properties' },
    frames: [{ uz: "To'plam — umumiy belgili elementlar", ru: 'Множество — элементы с общим признаком', en: 'A set contains elements with a shared property' }, { uz: "Faqat A: ha / yo'q", ru: 'Только A: да / нет', en: 'A only: yes / no' }, { uz: "Ikkalasi: ha / ha", ru: 'Обе: да / да', en: 'Both: yes / yes' }, { uz: "Faqat B: yo'q / ha", ru: 'Только B: нет / да', en: 'B only: no / yes' }, { uz: "Tashqarida: yo'q / yo'q; ko'k uchburchak → ikkalasi", ru: 'Снаружи: нет / нет; синий треугольник → обе', en: 'Outside: no / no; blue triangle → both' }],
    audio: {
      uz: ["To'plam umumiy belgiga ega elementlarni bir guruhga jamlaydi.", "Faqat A qismida A uchun ha, B uchun yo'q javobi olinadi.", "O'rta qismda ikkala belgi uchun ham ha javobi olinadi.", "Faqat B qismida A uchun yo'q, B uchun ha javobi olinadi.", "Tashqi qismda ikkala javob ham yo'q bo'ladi, ko'k uchburchak esa ikkala belgiga mos. Keyingi darsda uzunlik birliklarini o'rganamiz."],
      ru: ['Множество объединяет в одну группу элементы с общим признаком.', 'В области только A ответ для A положительный, а для B отрицательный.', 'В средней области ответы для обоих признаков положительные.', 'В области только B ответ для A отрицательный, а для B положительный.', 'Снаружи оба ответа отрицательные, а синий треугольник подходит обоим признакам. На следующем уроке изучим единицы длины.'],
      en: ['A set groups together elements that share a property.', 'In the A-only region, the answer for A is yes and the answer for B is no.', 'In the middle region, the answer is yes for both properties.', 'In the B-only region, the answer for A is no and the answer for B is yes.', 'Outside, both answers are no, while the blue triangle matches both properties. In the next lesson, we will study units of length.'],
    },
  },
};

let runtimeConfig = { ttsApiBase: '', voiceGender: 'f', correctSoundUrl: '', wrongSoundUrl: '', previewMode: false };
const configureLesson = (next) => { runtimeConfig = { ...runtimeConfig, ...next }; };
const SUPPORTED_LANGS = ['uz', 'ru', 'en'];
const SPEECH_LOCALES = { uz: 'uz-UZ', ru: 'ru-RU', en: 'en-GB' };
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
    this.timer = window.setTimeout(() => { this.index += 1; this.play(); }, duration ?? 900);
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
          utterance.onerror = () => this.timed(item, 900);
          this.previewUtterance = utterance;
          this.timer = window.setTimeout(() => { try { window.speechSynthesis.speak(utterance); } catch { this.timed(item, 900); } }, 50);
          return;
        } catch { /* deterministic timer fallback */ }
      }
      this.timed(item);
      return;
    }
    if (!this.audio) { this.audio = new Audio(); this.audio.crossOrigin = 'anonymous'; }
    this.audio.onended = () => { this.index += 1; this.play(); };
    this.audio.onerror = () => this.timed(item, 900);
    this.audio.src = buildTtsUrl(runtimeConfig.ttsApiBase, item.text, runtimeConfig.voiceGender);
    this.audio.play().then(() => this.emit({ isPlaying: true, completed: false, currentSegment: item.id, visualOnly: false })).catch(() => this.timed(item, 900));
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
  const frame = reduced || feedbackPlaying || audio.completed ? finalFrame : active >= 0 ? active : 0;
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
      <linearGradient id="g420bbody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#E2ECF2" />
        <stop offset="100%" stopColor="#B6C7D2" />
      </linearGradient>
      <linearGradient id="g420bhead" x1="0" y1="0" x2="0" y2="1">
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
    <rect x="34" y="60" width="52" height="62" rx="18" fill="url(#g420bbody)" stroke="#A9BCC8" strokeWidth="2" />
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
    <rect x="28" y="28" width="64" height="46" rx="16" fill="url(#g420bhead)" stroke="#A9BCC8" strokeWidth="2" />
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
    uz: { hook: 'Missiya', diagnostic: 'Diagnostika', exploration: 'Kashfiyot', rule: 'Qoida', practice: 'Mashq', test: 'Tekshiruv', case: 'Vazifa', summary: 'Yakun' },
    ru: { hook: 'Миссия', diagnostic: 'Диагностика', exploration: 'Исследование', rule: 'Правило', practice: 'Практика', test: 'Проверка', case: 'Задача', summary: 'Итог' },
    en: { hook: 'Mission', diagnostic: 'Diagnostic', exploration: 'Discovery', rule: 'Rule', practice: 'Practice', test: 'Check', case: 'Problem', summary: 'Summary' },
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
  return <div data-g4-feedback={show ? (correct ? 'correct' : 'wrong') : 'reserved'} role={show ? 'status' : undefined} aria-hidden={!show} className={`feedback feedback-slot ${correct ? 'correct' : 'wrong'} ${open ? 'open' : ''}`}><span className="feedback-bit"><BitSVG state={correct ? 'nod' : 'awkward'}/></span><p><span>{show ? children : ''}</span>{show && proof && <strong className="feedback-proof"><small>{t({ uz: 'YECHIM', ru: 'РЕШЕНИЕ', en: 'SOLUTION' })}</small>{proof}</strong>}</p></div>;
};

const Stage = ({ screen, audio, onPrev, onNext, nextDisabled = false, finish = false, children }) => {
  const t = useT(); const mobile = useIsMobile(); const pad = mobile ? 14 : 48; const c = CONTENT[`s${screen}`]; const meta = SCREEN_META[screen];
  return <main className={`stage stage-${meta.type}`} data-g4-screen={meta.type === 'hook' ? 'hook' : meta.type} data-g4-role={meta.type === 'hook' ? 'hook-scene' : undefined}><header className="stage-header" style={{ paddingLeft: pad, paddingRight: pad }}><div className="progress-track" aria-label={`${screen + 1} / ${TOTAL_SCREENS}`}><div className="progress-fill progress-bar" style={{ width: `${(screen + 1) / TOTAL_SCREENS * 100}%` }}/></div><div className="stage-chrome"><div className="chrome-title"><span className="status-dot"/><span>{t(c.eyebrow)}</span></div><div className="chrome-actions"><ScreenTypeLabel type={meta.type}/>{audio && <AudioIndicator audio={audio}/>}<span className="screen-count">{String(screen + 1).padStart(2, '0')} / {TOTAL_SCREENS}</span></div></div></header><section className="stage-content" style={{ paddingLeft: pad, paddingRight: pad }}>{children}<div className={`caption-slot ${audio?.caption && (audio.muted || audio.visualOnly) ? 'is-visible' : ''}`} aria-live="polite"><span>{audio?.caption && (audio.muted || audio.visualOnly) ? audio.caption : ''}</span></div></section><footer className="stage-nav" style={{ paddingLeft: pad, paddingRight: pad }}>{screen === 0 ? <span/> : <button type="button" className="btn-ghost" onClick={onPrev}>← {t({ uz: "Orqaga", ru: 'Назад', en: 'Back' })}</button>}<button type="button" className="btn-white-accent" disabled={nextDisabled || !onNext} onClick={onNext}>{finish ? t({ uz: "Darsni yakunlash", ru: 'Завершить урок', en: 'Finish lesson' }) : t({ uz: "Davom etish", ru: 'Продолжить', en: 'Continue' })} →</button></footer></main>;
};

const Heading = ({ c, bit }) => { const t = useT(); return <div className="heading"><div><span>{t(c.eyebrow)}</span><h1>{t(c.title)}</h1></div>{bit && <BitSVG state={bit}/>}</div>; };
const Options = ({ values, picked, onPick, correctIndex, solved, neutral = false, disabled = false }) => {
  const t = useT();
  return <div className="options">{values.map((value, index) => <button type="button" key={index + '-' + t(value)} className={'option ' + (picked === index ? 'picked ' : '') + (!neutral && solved && index === correctIndex ? 'right ' : '') + (!neutral && picked === index && picked !== correctIndex ? 'bad ' : '')} disabled={disabled || (!neutral && solved)} onClick={() => onPick(index)}><b>{String.fromCharCode(65 + index)}</b><span>{t(value)}</span></button>)}</div>;
};
const BeatList = ({ frames = [], frame, solved = false, onReplay = null }) => {
  const t = useT();
  return <div className="beat-list">{frames.map((item, index) => {
    const shown = index <= frame || solved;
    const content = <><b>{index + 1}</b><span>{t(item)}</span></>;
    return onReplay
      ? <button type="button" key={index} className={'beat ' + (shown ? 'show' : '')} onClick={() => onReplay(index)}>{content}</button>
      : <div key={index} className={'beat ' + (shown ? 'show' : '')}>{content}</div>;
  })}</div>;
};

const ShapeIcon = ({ color = 'blue', shape = 'triangle', label = '' }) => {
  const t = useT();
  const colourName = color === 'yellow'
    ? { uz: 'sariq', ru: 'жёлтый', en: 'yellow' }
    : { uz: "ko'k", ru: 'синий', en: 'blue' };
  const shapeName = shape === 'square'
    ? { uz: 'kvadrat', ru: 'квадрат', en: 'square' }
    : shape === 'circle'
      ? { uz: 'doira', ru: 'круг', en: 'circle' }
      : { uz: 'uchburchak', ru: 'треугольник', en: 'triangle' };
  const accessibleLabel = label ? t(label) : `${t(colourName)} ${t(shapeName)}`;
  return (
    <span className={'shape-token ' + color + ' ' + shape} aria-label={accessibleLabel}>
      {shape === 'triangle' ? '▲' : shape === 'square' ? '■' : '●'}
    </span>
  );
};

function OverlappingCriteriaDiagram({ frame = 3, focusZone = null, interactive = false, counts = null, device = false, devicePending = false, ghostMerge = false, showAllZones = false }) {
  const t = useT();
  const [selected, setSelected] = useState(null);
  const active = selected ?? focusZone;
  const zones = [
    { key: 'a', label: { uz: 'Faqat A', ru: 'Только A', en: 'A only' }, x: '21%', y: '50%' },
    { key: 'both', label: { uz: 'Ikkalasi', ru: 'Обе', en: 'Both' }, x: '50%', y: '50%' },
    { key: 'b', label: { uz: 'Faqat B', ru: 'Только B', en: 'B only' }, x: '79%', y: '50%' },
    { key: 'outside', label: { uz: 'Tashqarida', ru: 'Снаружи', en: 'Outside' }, x: '50%', y: '88%' },
  ];
  return (
    <div className={'overlap-diagram ' + (active ? 'focus-' + active : '')}>
      <svg viewBox="0 0 640 300" role="img" aria-label={t({ uz: "Ikki belgi diagrammasi", ru: 'Диаграмма двух признаков', en: 'Two-property diagram' })}>
        <rect x="8" y="8" width="624" height="284" rx="24" className="diagram-field"/>
        <circle cx="255" cy="140" r="112" className={'criteria-circle circle-a ' + (frame >= 0 ? 'on' : '')}/>
        <circle cx="385" cy="140" r="112" className={'criteria-circle circle-b ' + (frame >= 1 ? 'on' : '')}/>
        <text x="190" y="50" className="criteria-letter">A</text>
        <text x="450" y="50" className="criteria-letter">B</text>
        {frame >= 2 && <text x="320" y="138" textAnchor="middle" className="middle-label">{t({ uz: 'IKKALASI', ru: 'ОБЕ', en: 'BOTH' })}</text>}
        {ghostMerge && <>
          {frame <= 1 && <text x="320" y="276" textAnchor="middle" className="ghost-shape source">▲</text>}
          {frame >= 1 && frame <= 2 && <text x="238" y="184" textAnchor="middle" className="ghost-shape copy">▲</text>}
          {frame === 2 && <text x="402" y="184" textAnchor="middle" className="ghost-shape copy">▲</text>}
          {frame >= 3 && <text x="320" y="184" textAnchor="middle" className="ghost-shape merged">▲</text>}
        </>}
        {counts && <>
          <text x="205" y="155" textAnchor="middle" className="count-label">{counts.a}</text>
          <text x="320" y="175" textAnchor="middle" className="count-label">{counts.both}</text>
          <text x="435" y="155" textAnchor="middle" className="count-label">{counts.b}</text>
        </>}
        {devicePending && <>
          <circle cx="566" cy="250" r="29" className="device-node pending"/>
          <text x="566" y="256" textAnchor="middle" className="device-label">M7</text>
        </>}
        {device && <>
          <circle cx="320" cy="170" r="29" className="device-node"/>
          <text x="320" y="176" textAnchor="middle" className="device-label">M7</text>
          <path d="M304 153 q16-18 32 0 M310 159 q10-10 20 0" className="device-signal"/>
        </>}
      </svg>
      {zones.map((zone, index) => (showAllZones || frame >= Math.min(index, 3)) && <button
        type="button"
        key={zone.key}
        className={'zone-tap zone-' + zone.key + (active === zone.key ? ' active' : '')}
        style={{ left: zone.x, top: zone.y }}
        onClick={() => interactive && setSelected(zone.key)}
        tabIndex={interactive ? 0 : -1}
        aria-pressed={active === zone.key}
      >{t(zone.label)}</button>)}
      {interactive && selected && <div className="zone-note">{t(zones.find((zone) => zone.key === selected)?.label)}</div>}
    </div>
  );
}

const ObjectAnswerMap = ({ frame }) => {
  const t = useT();
  const rows = [
    { color: 'blue', shape: 'square', answers: { uz: "ha / yo'q", ru: 'да / нет', en: 'yes / no' }, zone: { uz: 'Faqat A', ru: 'Только A', en: 'A only' } },
    { color: 'blue', shape: 'triangle', answers: { uz: 'ha / ha', ru: 'да / да', en: 'yes / yes' }, zone: { uz: 'Ikkalasi', ru: 'Обе', en: 'Both' } },
    { color: 'yellow', shape: 'triangle', answers: { uz: "yo'q / ha", ru: 'нет / да', en: 'no / yes' }, zone: { uz: 'Faqat B', ru: 'Только B', en: 'B only' } },
    { color: 'yellow', shape: 'circle', answers: { uz: "yo'q / yo'q", ru: 'нет / нет', en: 'no / no' }, zone: { uz: 'Tashqarida', ru: 'Снаружи', en: 'Outside' } },
  ];
  return <div className="object-answer-map">{rows.map((row, index) => <div key={row.color + row.shape} className={frame >= index ? 'show' : ''}><ShapeIcon color={row.color} shape={row.shape}/><span>{t(row.answers)}</span><strong>{t(row.zone)}</strong></div>)}</div>;
};

function SetVisual({ screen, frame, solved = false }) {
  if (screen === 0) return <div className="visual-card"><ShapeIcon color="blue" shape="triangle"/><OverlappingCriteriaDiagram frame={frame} interactive/></div>;
  if (screen === 1) return <div className="visual-card set-elements"><div className="single-set"><span>A</span><ShapeIcon color="blue" shape="square"/><ShapeIcon color="blue" shape="triangle"/><ShapeIcon color="blue" shape="circle"/></div></div>;
  if (screen === 2) return <div className="visual-card"><OverlappingCriteriaDiagram frame={frame} ghostMerge/></div>;
  if (screen === 3) return <div className="visual-card"><OverlappingCriteriaDiagram frame={frame} interactive/></div>;
  if (screen === 4) return <div className="visual-card"><ObjectAnswerMap frame={frame}/></div>;
  if (screen === 5) return <div className="visual-card"><OverlappingCriteriaDiagram frame={frame} counts={{ a: 2, both: 1, b: 1 }}/></div>;
  if (screen === 12) return <div className="visual-card"><OverlappingCriteriaDiagram frame={frame} focusZone={solved ? 'a' : null} counts={{ a: 2, both: 2, b: 1 }} showAllZones/></div>;
  if (screen === 6) return <div className="visual-card outside-demo"><ShapeIcon color="yellow" shape="circle"/><OverlappingCriteriaDiagram frame={frame} focusZone={frame >= 3 ? 'outside' : null}/></div>;
  if (screen === 7) return <div className="visual-card"><OverlappingCriteriaDiagram frame={Math.min(frame, 3)} interactive/></div>;
  if (screen === 8) return <div className="visual-card test-figure"><ShapeIcon color="blue" shape="square"/><OverlappingCriteriaDiagram frame={frame} focusZone={solved ? 'a' : null} showAllZones/></div>;
  if (screen === 9) return <div className="visual-card test-figure"><ShapeIcon color="blue" shape="triangle"/><OverlappingCriteriaDiagram frame={frame} focusZone={solved ? 'both' : null} showAllZones/></div>;
  if (screen === 10) return <div className="visual-card test-figure"><ShapeIcon color="yellow" shape="triangle"/><OverlappingCriteriaDiagram frame={frame} focusZone={solved ? 'b' : null} showAllZones/></div>;
  if (screen === 11) return <div className="visual-card test-figure"><ShapeIcon color="yellow" shape="circle"/><OverlappingCriteriaDiagram frame={frame} focusZone={solved ? 'outside' : null} showAllZones/></div>;
  if (screen === 13) return <div className="visual-card"><OverlappingCriteriaDiagram frame={frame} focusZone={solved ? 'both' : null} device={solved} devicePending={!solved} showAllZones/></div>;
  return null;
}

function ChoiceExercise({ screen, storedAnswer, onAnswer, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT['s' + screen];
  const audio = useNarration(c.audio, screen);
  const narrationReady = audio.muted || audio.completed;
  const [picked, setPicked] = useState(storedAnswer?.studentAnswerIndex ?? null);
  const [solved, setSolved] = useState(storedAnswer?.correct === true);
  const attempts = useRef(storedAnswer?.attempts ?? 0);
  const clean = useRef(storedAnswer?.firstTry ?? true);
  const pick = (index) => {
    if (solved || !narrationReady) return;
    attempts.current += 1;
    const ok = index === c.correctIndex;
    if (!ok) clean.current = false;
    setPicked(index);
    setSolved(ok);
    playSfx(ok ? 'correct' : 'wrong');
    const spoken = c.feedbackAudio?.[index] ?? (ok ? c.audio.on_correct : null);
    if (spoken) audio.pushOneOff(t(spoken));
    onAnswer({ screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question), options: c.options.map(t), correctIndex: c.correctIndex, correctAnswer: t(c.options[c.correctIndex]), studentAnswerIndex: index, studentAnswer: t(c.options[index]), correct: ok, firstTry: ok && clean.current && attempts.current === 1, attempts: attempts.current, solved: ok });
  };
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!solved || !narrationReady}><div className="stack"><Heading c={c}/><SetVisual screen={screen} frame={audio.frame} solved={solved} disabled={!narrationReady}/><BeatList frames={c.frames} frame={audio.frame} solved={solved}/><section className="question"><h2>{t(c.question)}</h2><Options values={c.options} picked={picked} onPick={pick} correctIndex={c.correctIndex} solved={solved}/><FeedbackBlock show={picked !== null} correct={solved} proof={solved && c.proof ? t(c.proof) : null}>{picked !== null ? t(c.feedback[picked]) : ''}</FeedbackBlock></section></div></Stage>;
}

function Screen0({ screen, storedAnswer, onAnswer, onNext }) {
  const t = useT(); const c = CONTENT.s0; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [picked, setPicked] = useState(storedAnswer?.neutralChoice ?? null);
  const pick = (index) => { if (!narrationReady) return; setPicked(index); audio.pushOneOff(t(c.neutral)); onAnswer({ screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question), options: c.options.map(t), correctIndex: null, correctAnswer: null, studentAnswerIndex: index, studentAnswer: t(c.options[index]), correct: true, firstTry: true, attempts: 1, solved: true, neutralChoice: index }); };
  return <Stage screen={screen} audio={audio} onNext={onNext} nextDisabled={picked === null || !narrationReady}><div className="stack"><Heading c={c} bit="think"/><SetVisual screen={screen} frame={audio.frame}/><BeatList frames={c.frames} frame={audio.frame}/><section className="question" data-g4-role="answer-card"><h2>{t(c.question)}</h2><Options values={c.options} picked={picked} onPick={pick} neutral disabled={!narrationReady}/><FeedbackBlock show={picked !== null} correct>{t(c.neutral)}</FeedbackBlock></section></div></Stage>;
}

function TheoryScreen({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT['s' + screen]; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [strategyUsed, setStrategyUsed] = useState(false); const replayStep = (index) => { setStrategyUsed(true); audio.pushOneOff(t(c.frames[index])); };
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!strategyUsed || !narrationReady}><div className="stack"><Heading c={c}/><SetVisual screen={screen} frame={audio.frame}/><BeatList frames={c.frames} frame={audio.frame} onReplay={replayStep}/></div></Stage>;
}

function G4TitleReveal({ active, title }) {
  const t = useT();
  const [visible, setVisible] = useState(false);
  const wasActiveRef = useRef(active);
  useEffect(() => {
    const wasActive = wasActiveRef.current;
    wasActiveRef.current = active;
    if (!active || wasActive || typeof window === 'undefined') return undefined;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const frame = window.requestAnimationFrame(() => setVisible(true));
    const timer = window.setTimeout(() => setVisible(false), reduced ? 120 : 3200);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [active]);
  if (!visible || typeof document === 'undefined') return null;
  return createPortal(<div className="g4-title-reveal-overlay" role="status" aria-live="assertive" aria-atomic="true"><div className="g4-title-reveal-card"><div className="g4-title-reveal-rays" aria-hidden="true"/><div className="g4-title-reveal-confetti" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <i key={index}/>)}</div><div className="g4-title-reveal-medal" aria-hidden="true">★</div><h2 className="g4-title-reveal-title">{t(title)}</h2></div></div>, document.body);
}

function G4TitleCard({ title, answers = [] }) {
  const t = useT();
  const scored = SCREEN_META.map((item, index) => item.scored ? index : null).filter((index) => index !== null);
  const firstTry = scored.filter((index) => answers[index]?.firstTry === true).length;
  return <aside className="g4-title-card" data-g4-role="title-card" role="status" aria-live="polite"><div className="g4-title-card-bit"><BitSVG state="happy"/></div><div className="g4-title-card-medal" aria-hidden="true">★</div><span className="g4-title-card-kicker">{t({ uz: 'UNVON OLINDI', ru: 'ЗВАНИЕ ПОЛУЧЕНО', en: 'TITLE EARNED' })}</span><h2 className="g4-title-card-title">{t(title)}</h2><div className="g4-title-card-score"><strong>{firstTry}/{scored.length}</strong><span>{t({ uz: 'birinchi urinishda', ru: 'с первой попытки', en: 'on the first try' })}</span></div></aside>;
}

function G4FinalTitleReward({ ready, titleClaimed, reflectionChoice, onClaim, title, answers }) {
  const t = useT();
  return <><G4TitleReveal active={titleClaimed} title={title}/>{titleClaimed && <G4TitleCard title={title} answers={answers}/>} {!titleClaimed && <button type="button" className="g4-title-claim" disabled={!ready || reflectionChoice === null} onClick={onClaim}><span aria-hidden="true">★</span><strong>{t({ uz: 'Unvonni olish', ru: 'Получить звание', en: 'Claim title' })}</strong><small>{t(title)}</small></button>}</>;
}

const ReflectionPanel = ({ choices, choice, onChoose, disabled }) => {
  const t = useT();
  return <section className="final-reflection" data-g4-role="reflection"><strong>{t({ uz: "Qaysi tekshiruv usulidan foydalanasiz?", ru: 'Какой способ проверки вы выберете?', en: 'Which checking strategy will you use?' })}</strong><div>{choices.map((item, index) => <button type="button" key={index} className={choice === index ? 'is-selected' : ''} aria-pressed={choice === index} disabled={disabled} onClick={() => onChoose(index)}><span>{index + 1}</span>{t(item)}</button>)}</div></section>;
};

function Screen14({ screen, storedAnswer, answers, onAnswer, onPrev, finishLesson }) {
  const t = useT(); const c = CONTENT.s14; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [reflectionChoice, setReflectionChoice] = useState(storedAnswer?.reflectionChoice ?? null); const [titleClaimed, setTitleClaimed] = useState(storedAnswer?.titleClaimed === true); const title = { uz: "Saralash tadqiqotchisi", ru: 'Исследователь сортировки', en: 'Sorting Explorer' }; const reflectionOptions = [{ uz: 'Model bilan tekshiraman', ru: 'Проверю по модели', en: 'I will check with a model' }, { uz: 'Qoida va birlikni tekshiraman', ru: 'Проверю правило и единицу', en: 'I will check the rule and unit' }, { uz: 'Teskari amal bilan tekshiraman', ru: 'Проверю обратным действием', en: 'I will use the inverse operation' }]; const chooseReflection = (index) => { if (!narrationReady || titleClaimed) return; setReflectionChoice(index); onAnswer({ ...(storedAnswer ?? {}), screenIdx: screen, stage: null, reflectionChoice: index, titleClaimed: false }); audio.pushOneOff(t(reflectionOptions[index])); }; const claimTitle = () => { if (!narrationReady || reflectionChoice === null || titleClaimed) return; setTitleClaimed(true); onAnswer({ screenIdx: screen, stage: null, question: t({ uz: 'Tanlangan tekshiruv', ru: 'Выбранная проверка', en: 'Chosen check' }), options: reflectionOptions.map(t), correctIndex: null, correctAnswer: null, studentAnswerIndex: reflectionChoice, studentAnswer: t(reflectionOptions[reflectionChoice]), correct: true, firstTry: true, attempts: 1, solved: true, reflectionChoice, titleClaimed: true }); };
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={titleClaimed ? finishLesson : undefined} nextDisabled={!titleClaimed} finish><div className="stack"><Heading c={c} bit="happy"/><OverlappingCriteriaDiagram frame={Math.min(audio.frame, 3)} focusZone={audio.frame >= 4 ? 'both' : null}/><BeatList frames={c.frames} frame={audio.frame}/><div className={'finale-bridge ' + (audio.frame >= 4 ? 'show' : '')}><small>{t({ uz: 'KEYINGI DARS', ru: 'СЛЕДУЮЩИЙ УРОК', en: 'NEXT LESSON' })}</small><strong>{t({ uz: "Uzunlik birliklari", ru: 'Единицы длины', en: 'Units of length' })}</strong></div><ReflectionPanel choices={reflectionOptions} choice={reflectionChoice} onChoose={chooseReflection} disabled={!narrationReady || titleClaimed}/><G4FinalTitleReward ready={narrationReady} titleClaimed={titleClaimed} reflectionChoice={reflectionChoice} onClaim={claimTitle} title={title} answers={answers}/></div></Stage>;
}

const Screen1 = TheoryScreen;
const Screen2 = TheoryScreen;
const Screen3 = TheoryScreen;
const Screen4 = TheoryScreen;
const Screen5 = TheoryScreen;
const Screen6 = TheoryScreen;
const Screen7 = TheoryScreen;
function Screen8(props) { return <ChoiceExercise {...props}/>; }
function Screen9(props) { return <ChoiceExercise {...props}/>; }
function Screen10(props) { return <ChoiceExercise {...props}/>; }
function Screen11(props) { return <ChoiceExercise {...props}/>; }
function Screen12(props) { return <ChoiceExercise {...props}/>; }
function Screen13(props) { return <ChoiceExercise {...props}/>; }

const SCREENS = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14];

export default function Grade4Dars25({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished, previewMode }) {
  const preview = previewMode ?? (langProp === undefined || langProp === null);
  const initialLang = normalizeLang(langProp);
  const [previewLang, setPreviewLang] = useState(initialLang);
  const lang = preview ? normalizeLang(previewLang) : initialLang;
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
    const scored = SCREEN_META.map((meta, index) => meta.scored ? index : null).filter((index) => index !== null);
    const firstTryCorrect = scored.filter((index) => answers[index]?.firstTry === true).length;
    const payload = {
      lessonId: LESSON_META.lessonId, lessonTitle: LESSON_META.lessonTitle[lang], studentName: studentName || null,
      durationSec: Math.floor((Date.now() - started.current) / 1000), totalQuestions: scored.length,
      correctAnswers: firstTryCorrect, scorePercent: Math.round(firstTryCorrect / scored.length * 100),
      finalScore: firstTryCorrect, finalTotal: scored.length, passed: firstTryCorrect / scored.length >= 0.6,
      firstTryStats: { total: scored.length, firstTryCorrect },
      attemptsTotal: scored.reduce((sum, index) => sum + (answers[index]?.attempts ?? 0), 0),
      skillTags: LESSON_META.skillTags, answers: answers.filter(Boolean),
    };
    if (onFinished) onFinished(payload); else console.log('[Grade4 Dars25 preview]', payload);
  }, [answers, lang, onFinished, studentName]);
  const Current = SCREENS[current];
  return <LangContext.Provider value={lang}><style>{STYLES}</style><div className={'lesson-root ' + (preview ? 'lesson-root-preview' : '')}>{preview && <div className="preview-language" aria-label={{ uz: "Ko'rib chiqish tili", ru: 'Язык предпросмотра', en: 'Preview language' }[lang]}>{SUPPORTED_LANGS.map((code) => <button type="button" key={code} className={previewLang === code ? 'preview-active' : ''} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>)}</div>}<Current key={current} screen={current} storedAnswer={answers[current]} answers={answers} onAnswer={recordAnswer} onPrev={() => setCurrent((value) => Math.max(0, value - 1))} onNext={() => setCurrent((value) => Math.min(TOTAL_SCREENS - 1, value + 1))} finishLesson={finishLesson}/></div></LangContext.Provider>;
}

const G4_TITLE_STYLES = `
.g4-title-reveal-overlay{
  position:fixed;inset:0;z-index:120;padding:0;display:grid;place-items:center;overflow:hidden;overscroll-behavior:contain;pointer-events:none;
  background:rgba(8,13,24,.64);backdrop-filter:blur(2px) saturate(.78);animation:g4-title-reveal-overlay-life 3.8s ease both
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
@media(max-width:639.98px){
  .g4-title-reveal-card{min-height:100dvh;padding:24px 18px}
  .g4-title-reveal-medal{width:88px;height:88px;border-width:5px;font-size:40px}
  .g4-title-reveal-card h2{top:calc(50% + 62px);font-size:29px}
  .g4-title-card-stage{min-height:88px;padding:9px 59px 8px 51px;border-radius:14px}
  .g4-title-card-medal{left:8px;width:34px;height:34px;font-size:14px}
  .g4-title-card-bit{width:57px;height:71px}
  .g4-title-card-stage h2{font-size:14px}
}
@media(prefers-reduced-motion:reduce){
  .g4-title-reveal-overlay,.g4-title-reveal-overlay *,.g4-title-card-stage,.g4-title-card-stage *{animation:none!important;transition:none!important}
  .g4-title-reveal-confetti,.g4-title-card-confetti{display:none!important}
  .g4-title-reveal-rays{opacity:.28!important;transform:translate(-50%,-50%)!important}
  .g4-title-reveal-medal{opacity:1!important;transform:translate(-50%,-50%)!important}
  .g4-title-reveal-card h2{opacity:1!important;transform:translateX(-50%)!important}
  .g4-title-card-stage{transform:none!important}
}
`;

const STYLES = `${G4_TITLE_STYLES}
.stage-hook .visual-card{background:radial-gradient(circle at 87% 24%,rgba(121,211,218,.16),transparent 24%),radial-gradient(circle at 9% 88%,rgba(149,201,61,.11),transparent 25%),linear-gradient(145deg,rgba(22,143,163,.25),transparent 48%),linear-gradient(135deg,#153B50,#0B2232 72%)}
html:has(.lesson-root),body:has(.lesson-root),#root:has(.lesson-root),.lesson-page:has(.lesson-root),.lesson-frame:has(.lesson-root){width:100%;height:100%;min-height:0!important;margin:0;overflow:hidden!important;overscroll-behavior:none}
.lesson-root,.lesson-root *{box-sizing:border-box}.lesson-root h1,.lesson-root h2,.lesson-root h3,.lesson-root h4,.lesson-root h5,.lesson-root h6,.lesson-root p,.lesson-root ul,.lesson-root ol{margin:0}.lesson-root button,.lesson-root input{font:inherit}
.lesson-root{position:fixed;inset:0;width:100%;height:100dvh;min-height:0;overflow:hidden;color:${T.ink};background:radial-gradient(circle at 88% 9%,rgba(22,143,163,.11),transparent 25%),linear-gradient(145deg,#F7F8F4,#EEF3F1);font-family:'Manrope',system-ui,sans-serif}
.stage{width:min(936px,100%);height:100dvh;margin:0 auto;display:flex;flex-direction:column;overflow:hidden}.stage-header{flex-shrink:0;padding-top:10px;padding-bottom:8px;background:rgba(247,248,244,.88);backdrop-filter:blur(14px);z-index:5}.progress-track{width:100%;height:6px;margin-bottom:10px;border-radius:999px;background:rgba(80,97,109,.16);overflow:hidden}.progress-fill{height:100%;border-radius:inherit;background:linear-gradient(90deg,${T.cyan},${T.accent});box-shadow:0 0 12px rgba(255,91,53,.42);transition:width .45s ease}.stage-chrome{min-width:0;display:flex;justify-content:space-between;align-items:center;gap:12px}.chrome-title,.chrome-actions,.audio-controls{display:flex;align-items:center;gap:9px}.chrome-title{min-width:0;overflow:hidden;color:${T.ink2};font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}.chrome-title>span:last-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.chrome-actions{flex:none}.status-dot{width:8px;height:8px;flex:none;border-radius:50%;background:${T.accent};box-shadow:0 0 10px rgba(255,91,53,.65)}.screen-type{padding:4px 8px;border-radius:999px;color:${T.cyan};background:${T.cyanSoft};font-size:10px;font-weight:800}.screen-count{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700}.icon-btn{width:44px;height:44px;padding:0;border:0;border-radius:10px;color:${T.ink2};background:rgba(255,255,255,.75);cursor:pointer;box-shadow:0 4px 12px -7px rgba(${T.shadowBase},.3)}
.stage-content{flex:1 1 auto;min-height:0;padding-top:10px;padding-bottom:16px;overflow:hidden}.stage-nav{flex:0 0 auto;min-height:72px;display:flex;align-items:center;justify-content:space-between;gap:12px;background:rgba(245,245,240,.95)}.btn-white-accent,.btn-ghost{min-width:128px;min-height:50px;padding:0 18px;border:0;border-radius:15px;cursor:pointer;font-weight:900}.btn-white-accent{color:${T.accent};background:#fff;box-shadow:0 12px 24px -17px rgba(255,91,53,.8)}.btn-white-accent:hover:not(:disabled){color:#fff;background:${T.accent}}.btn-white-accent:disabled{opacity:.42;cursor:not-allowed}.btn-ghost{color:${T.ink2};background:transparent}.btn-ghost:hover{background:#fff;box-shadow:0 10px 20px -16px rgba(${T.shadowBase},.5)}.compact{min-width:118px}.stack{height:100%;min-height:0;overflow:hidden;display:grid;align-content:center;gap:14px;animation:page-in .45s cubic-bezier(.16,1,.3,1) both}.heading{min-height:78px;display:flex;align-items:center;justify-content:space-between;gap:16px}.heading>div>span{color:${T.cyan};font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.heading h1{margin-top:4px!important;font:750 clamp(25px,4vw,38px)/1.06 'Source Serif 4',Georgia,serif}.heading .g1-char{width:78px;height:98px;flex:0 0 auto;overflow:visible;filter:drop-shadow(0 9px 11px rgba(23,59,82,.2))}.question,.model-card,.duel,.why-grid,.compare-card,.rule-card,.boundary,.summary-grid{padding:18px;border-radius:22px;background:rgba(255,255,255,.9);box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.48)}.question{display:grid;gap:13px}.question h2{font:720 clamp(17px,2.5vw,22px)/1.25 'Source Serif 4',Georgia,serif}.options{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.option{min-height:62px;padding:10px;border:0;border-radius:16px;display:grid;grid-template-columns:28px 1fr;align-items:center;gap:8px;color:${T.ink};background:#F8F8F4;text-align:left;cursor:pointer;box-shadow:0 10px 22px -20px rgba(${T.shadowBase},.46)}.option>b{width:27px;height:27px;border-radius:9px;display:grid;place-items:center;color:${T.cyan};background:${T.cyanSoft};font:900 11px 'JetBrains Mono',monospace}.option.picked{transform:translateY(-2px);background:${T.accentSoft};box-shadow:inset 0 0 0 2px rgba(255,91,53,.27)}.option.right{background:${T.successSoft};box-shadow:inset 0 0 0 2px rgba(34,122,83,.25)}.option.bad{background:${T.warnSoft};box-shadow:inset 0 0 0 2px rgba(169,111,19,.25)}.feedback{padding:12px 14px;border-radius:15px;display:grid;grid-template-columns:28px 1fr;gap:9px;align-items:start;opacity:0;transform:translateY(7px)}.feedback.open{opacity:1;transform:none;transition:.3s ease}.feedback.correct{background:${T.successSoft};box-shadow:inset 4px 0 ${T.success}}.feedback.wrong{background:${T.warnSoft};box-shadow:inset 4px 0 ${T.warn}}.feedback>b{font-size:18px}.feedback p{font-size:13px;line-height:1.45}.caption{position:static;bottom:4px;margin-top:12px;padding:9px 13px;border-radius:13px;color:#fff;background:rgba(23,59,82,.94);font-size:12px;line-height:1.4;z-index:3}
.proof{padding:12px;border-radius:14px;color:${T.success};background:${T.successSoft};text-align:center;font:900 15px 'JetBrains Mono',monospace;animation:proof-in .35s ease both}.frac{display:inline-flex;min-width:25px;flex-direction:column;align-items:center;vertical-align:middle;color:inherit;font:800 1em/1 'Fraunces','Source Serif 4',serif}.frac i{width:100%;height:2px;margin:2px 0;border-radius:2px;background:currentColor}.frac-lg{font-size:1.35em}.hook-model,.whole-card,.rule-card,.finale-payoff{padding:18px;border-radius:22px;background:rgba(255,255,255,.9);box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.48)}
.lesson-root button:focus-visible,.lesson-root input:focus-visible,.lesson-root input[type='range']:focus-visible{outline:3px solid ${T.cyan};outline-offset:3px}
.hook-model{display:grid;place-items:center;gap:12px;background:linear-gradient(135deg,#E5F5F6,#FFF)}.fraction-model{width:min(620px,94%);margin:0 auto;display:grid;gap:10px}.fraction-bar{height:112px;display:grid;overflow:hidden;border-radius:18px;background:#F4F5F1;box-shadow:inset 0 0 0 3px rgba(23,59,82,.16)}.fraction-bar i{min-width:0;border-right:2px solid rgba(23,59,82,.18);background:#F4F5F1;transition:background .45s ease,transform .45s ease}.fraction-bar i:last-child{border-right:0}.fraction-bar i.cyan{background:#46B8C5}.fraction-bar i.lime{background:#95C93D}.fraction-bar i.merged{background:linear-gradient(135deg,#168FA3,#95C93D)}.fraction-bar.whole i{border-right:0}.fraction-model.compact .fraction-bar{height:48px;border-radius:11px}.model-label{justify-self:center;padding:8px 13px;border-radius:12px;color:#173B52;background:#E5F5F6;font:900 16px "JetBrains Mono",monospace}.state-note,.formula-card,.result-chip{padding:12px 15px;border-radius:14px;opacity:.12;transform:translateY(7px);transition:.4s ease;text-align:center}.state-note{color:#227A53;background:#E7F3EC;font-size:13px;font-weight:850}.formula-card{color:#FFF;background:#173B52;font:900 17px "JetBrains Mono",monospace}.result-chip{justify-self:center;color:#FFF;background:#FF5B35;font:900 20px "JetBrains Mono",monospace}.show{opacity:1!important;transform:none!important}.tokens{display:flex;align-items:center;justify-content:center;gap:8px;color:#50616D;font-size:12px;font-weight:800}.tokens i{width:28px;height:28px;border-radius:9px;background:#95C93D;animation:token-pop .4s ease both}.tokens i:nth-child(2){animation-delay:.1s}.tokens i:nth-child(3){animation-delay:.2s}.rule-card,.whole-card{display:grid;gap:12px}.rule-line{padding:13px;border-radius:14px;opacity:.12;transform:translateY(6px);color:#173B52;background:#E5F5F6;text-align:center;font:900 18px "JetBrains Mono",monospace;transition:.4s ease}.rule-line.accent{color:#FFF;background:#173B52}.wrong-formula{padding:12px;position:relative;opacity:.12;color:#A96F13;background:#FFF5D9;text-align:center;font:900 18px "JetBrains Mono",monospace;transition:.4s ease}.wrong-formula::after{content:"";position:absolute;left:28%;right:28%;top:50%;height:3px;transform:rotate(-8deg);background:#FF5B35}.number-line{height:150px;position:relative;padding:54px 7% 0}.nl-track{height:4px;position:relative;border-radius:4px;background:#173B52}.nl-tick{width:2px;height:18px;position:absolute;top:-7px;background:#87949D}.nl-tick span{position:absolute;top:20px;left:50%;transform:translateX(-50%);font:800 12px "JetBrains Mono",monospace}.nl-dot{width:44px;height:38px;position:absolute;top:27px;transform:translateX(-50%);border-radius:12px;display:grid;place-items:center;color:#FFF;font:900 11px "JetBrains Mono",monospace;z-index:2;animation:dot-pop .35s ease both}.nl-dot.cyan{background:#168FA3}.nl-dot.lime{background:#95C93D}.nl-arrow{height:22px;position:absolute;top:84px;border-top:3px solid #FF5B35;border-right:3px solid #FF5B35;border-radius:0 14px 0 0;animation:arrow-grow .45s ease both}.nl-arrow::after{content:"";position:absolute;right:-5px;top:-7px;border-left:8px solid #FF5B35;border-top:5px solid transparent;border-bottom:5px solid transparent}.model-choices{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.model-choices>div{padding:10px;border-radius:15px;display:grid;grid-template-columns:26px 1fr;align-items:center;gap:6px;background:#FFF;box-shadow:0 12px 24px -20px rgba(58,53,48,.6)}.model-choices>div>b{width:25px;height:25px;border-radius:8px;display:grid;place-items:center;color:#FFF;background:#168FA3;font:900 10px "JetBrains Mono",monospace}.bit-error{padding:14px;border-radius:18px;display:flex;align-items:center;justify-content:center;gap:12px;color:#A96F13;background:#FFF5D9;font:900 19px "JetBrains Mono",monospace}.bit-error b{position:relative}.bit-error b::after{content:"";position:absolute;left:-5px;right:-5px;top:50%;height:3px;transform:rotate(-8deg);background:#FF5B35}.context-step{opacity:.12;transform:translateY(6px);transition:opacity .38s ease,transform .38s ease}.energy-model{display:grid;grid-template-columns:1fr 32px 1fr;align-items:center;gap:8px}.energy-model>div{padding:10px;border-radius:15px;display:grid;grid-template-columns:30px 1fr;align-items:center;gap:8px;background:#FFF}.energy-model>div>span{font-size:23px}.energy-model>strong{text-align:center;color:#FF5B35;font-size:23px}.finale-heading{padding:11px 15px;border-radius:17px;background:linear-gradient(100deg,rgba(255,91,53,.09),transparent 52%),rgba(255,255,255,.92);box-shadow:0 13px 28px -24px rgba(255,91,53,.72)}.finale-heading>span{color:#FF5B35;font:900 9px "JetBrains Mono",monospace;letter-spacing:.12em}.finale-heading h1{margin-top:4px!important;color:#173B52;font:750 clamp(21px,3vw,28px)/1.08 "Source Serif 4",Georgia,serif}.finale-heading p{margin-top:4px!important;color:#50616D;font-size:11px}.finale-main{display:grid;grid-template-columns:minmax(270px,.9fr) minmax(310px,1.1fr);gap:10px}.finale-payoff{display:grid;align-content:center;gap:8px}.finale-payoff>small{color:#168FA3;font-size:9px;font-weight:900;letter-spacing:.09em}.finale-answer{padding:8px 10px;border-radius:11px;opacity:.14;transform:translateY(5px);color:#227A53;background:#E7F3EC;text-align:center;font:900 13px "JetBrains Mono",monospace;transition:.42s ease}.finale-takeaways{display:grid;gap:6px}.finale-takeaway{min-height:42px;padding:7px 10px;border-radius:12px;display:grid;grid-template-columns:27px 1fr;align-items:center;gap:8px;opacity:.14;transform:translateY(6px);background:#F8F8F4;transition:.42s ease}.finale-takeaway.show{background:#E5F5F6}.finale-takeaway>b{width:26px;height:26px;border-radius:9px;display:grid;place-items:center;color:#FFF;background:#168FA3;font:900 9px "JetBrains Mono",monospace}.finale-takeaway span{display:grid;gap:2px;font-size:11px;font-weight:800}.finale-takeaway small{color:#168FA3;font-size:8px;text-transform:uppercase}.finale-takeaway strong{color:#173B52;font-family:"JetBrains Mono",monospace}.finale-bottom{display:grid;grid-template-columns:1.2fr .8fr;gap:10px}.finale-bridge{padding:12px 15px;border-radius:16px;display:grid;align-content:center;gap:4px;opacity:.14;transform:translateY(6px);color:#FFF;background:#173B52;transition:.42s ease}.finale-bridge small{color:#98E1E5;font-size:9px;font-weight:900;letter-spacing:.1em}.finale-bridge strong{font:750 15px "Source Serif 4",Georgia,serif}.finale-reward{min-height:100px;position:relative;overflow:hidden;padding:12px 70px 11px 52px;border-radius:17px;display:grid;align-content:center;color:#FFF;background:linear-gradient(135deg,#234B62,#173B52)}.finale-reward>div:nth-child(2){display:grid;gap:3px}.finale-reward small{color:#98E1E5;font-size:8px;font-weight:900}.finale-reward strong{font:750 14px "Source Serif 4",Georgia,serif}.finale-reward b{color:#FFE284;font:900 11px "JetBrains Mono",monospace}.finale-reward>.g1-char{position:absolute;right:2px;bottom:-5px;width:67px;height:84px}.finale-medal{position:absolute;left:10px;top:50%;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;transform:translateY(-50%);color:#173B52;background:#95C93D}.preview-language{position:fixed;top:9px;right:9px;z-index:30;display:flex;gap:3px;padding:3px;border-radius:999px;background:rgba(255,255,255,.94)}.preview-language button{padding:4px 9px;border:0;border-radius:999px;background:transparent;cursor:pointer;font-size:10px;font-weight:900}.preview-language .preview-active{color:#FFF;background:#FF5B35}.tiny-action{min-height:46px;padding:8px 12px;border:0;border-radius:13px;justify-self:end;color:${T.accent};background:${T.accentSoft};cursor:pointer;box-shadow:0 8px 18px -16px rgba(${T.shadowBase},.5);font-size:12px;font-weight:800}.marker-control{width:min(620px,94%);padding:10px 13px;border-radius:14px;display:grid;gap:7px;color:${T.navy};background:${T.cyanSoft};font:850 12px 'Manrope',sans-serif}.free-marker{width:100%;min-height:44px;margin:0;accent-color:${T.accent};cursor:pointer}.nl-dot.free{top:102px;background:${T.navy};animation-duration:.4s}.attempt-model{border-radius:20px;transition:box-shadow .32s ease,background .32s ease}.attempt-highlight{box-shadow:0 0 0 3px rgba(22,143,163,.38),0 14px 26px -20px rgba(22,143,163,.8)!important;background:rgba(229,245,246,.72)!important}.attempt-cue{padding:9px 12px;border-radius:12px;color:${T.cyan};background:${T.cyanSoft};font-size:12px;font-weight:850;animation:attempt-cue-in .3s ease both}.stack{animation-duration:.5s}.caption{animation:caption-in .32s ease both}.formula-card{transition-duration:.32s!important}.result-chip{transition-duration:.22s!important}
.beat-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:8px}.beat{min-height:52px;padding:9px 10px;border-radius:14px;display:grid;grid-template-columns:25px 1fr;align-items:center;gap:8px;opacity:.12;transform:translateY(6px);background:rgba(255,255,255,.88);transition:.36s ease}.beat.show{opacity:1;transform:none}.beat>b{width:25px;height:25px;border-radius:8px;display:grid;place-items:center;color:#fff;background:#168FA3;font:900 10px 'JetBrains Mono',monospace}.beat>span{font-size:11px;font-weight:800;line-height:1.3}.visual-card{min-height:210px;padding:14px;border-radius:22px;display:grid;place-items:center;gap:10px;background:rgba(255,255,255,.9);box-shadow:0 18px 34px -28px rgba(58,53,48,.48)}.shape-token{width:64px;height:64px;display:grid;place-items:center;font-size:54px;line-height:1;filter:drop-shadow(0 8px 10px rgba(23,59,82,.2));animation:token-pop .4s ease both}.shape-token.blue{color:#249DB5}.shape-token.yellow{color:#F2B934}.overlap-diagram{width:min(650px,100%);height:250px;position:relative;margin:auto}.overlap-diagram svg{width:100%;height:100%;overflow:visible}.diagram-field{fill:#F8F8F4;stroke:rgba(23,59,82,.12);stroke-width:2}.criteria-circle{opacity:.12;transform-origin:center;transform:scale(.9);transition:.42s ease;stroke-width:5}.criteria-circle.on{opacity:1;transform:scale(1)}.circle-a{fill:rgba(22,143,163,.20);stroke:#168FA3}.circle-b{fill:rgba(149,201,61,.20);stroke:#78A72E}.criteria-letter{fill:#173B52;font:900 20px 'JetBrains Mono',monospace}.middle-label,.count-label,.device-label{fill:#173B52;font:900 14px 'JetBrains Mono',monospace}.count-label{font-size:28px}.device-node{fill:#fff;stroke:#FF5B35;stroke-width:4}.device-signal{fill:none;stroke:#168FA3;stroke-width:3;stroke-linecap:round}.zone-tap{position:absolute;z-index:2;min-height:34px;padding:6px 9px;border:0;border-radius:11px;transform:translate(-50%,-50%);color:#173B52;background:rgba(255,255,255,.9);box-shadow:0 8px 18px -14px rgba(58,53,48,.7);font-size:10px;font-weight:900;cursor:pointer;transition:.28s ease}.zone-tap.active,.focus-a .zone-a,.focus-b .zone-b,.focus-both .zone-both,.focus-outside .zone-outside{color:#fff;background:#FF5B35;transform:translate(-50%,-50%) scale(1.08)}.zone-note{position:absolute;right:8px;bottom:6px;padding:7px 10px;border-radius:10px;color:#fff;background:#173B52;font-size:10px;font-weight:900}.set-elements .single-set{width:290px;height:180px;border:5px solid #168FA3;border-radius:50%;display:flex;align-items:center;justify-content:center;gap:16px;position:relative;background:#E5F5F6}.single-set>span{position:absolute;left:22px;top:15px;font:900 20px 'JetBrains Mono',monospace}.single-set .shape-token{width:50px;height:50px;font-size:42px}.split-check{grid-template-columns:80px 100px 1fr}.split-check>div:nth-child(2){display:grid;gap:9px}.split-check>div:nth-child(2)>span{padding:8px;border-radius:10px;opacity:.12;background:#E7F3EC;color:#227A53;font-weight:900;transition:.35s ease}.split-check .overlap-diagram{height:190px}.two-question-card{display:grid;grid-template-columns:1fr 1fr;gap:8px;width:min(520px,100%)}.two-question-card>div{padding:10px;border-radius:14px;display:grid;grid-template-columns:28px 1fr auto;align-items:center;gap:8px;opacity:.12;background:#E5F5F6;transition:.35s ease}.two-question-card b{width:26px;height:26px;border-radius:8px;display:grid;place-items:center;color:#fff;background:#168FA3}.two-question-card strong{color:#227A53}.two-question-card p{grid-column:1/-1;padding:9px;border-radius:12px;opacity:.12;text-align:center;color:#fff;background:#173B52;font-weight:900;transition:.35s ease}.outside-demo,.test-figure{grid-template-columns:80px 1fr}.outside-demo .overlap-diagram,.test-figure .overlap-diagram{height:190px}
.ghost-shape{fill:#249DB5;font:900 43px 'Manrope',sans-serif;filter:drop-shadow(0 7px 7px rgba(23,59,82,.18));animation:ghost-arrive .4s ease both}.ghost-shape.copy{opacity:.34}.ghost-shape.merged{fill:#168FA3;opacity:1}.device-node.pending{fill:#FFF5D9;stroke:#A96F13}.object-answer-map{width:min(700px,100%);display:grid;grid-template-columns:repeat(2,1fr);gap:9px}.object-answer-map>div{min-height:88px;padding:9px 12px;border-radius:16px;display:grid;grid-template-columns:54px 1fr;align-items:center;gap:4px 10px;opacity:.12;transform:translateY(6px);background:#F8F8F4;transition:.36s ease}.object-answer-map .shape-token{grid-row:1/3;width:48px;height:48px;font-size:40px}.object-answer-map span{color:#50616D;font:850 12px 'JetBrains Mono',monospace}.object-answer-map strong{color:#168FA3;font-size:13px}
@keyframes caption-in{from{opacity:0;transform:translateY(5px)}}@keyframes attempt-cue-in{from{opacity:0;transform:translateY(5px)}}@keyframes page-in{from{opacity:0;transform:translateY(10px)}}@keyframes proof-in{from{opacity:0;transform:translateY(5px)}}@keyframes token-pop{from{opacity:0;transform:scale(.45)}}@keyframes ghost-arrive{from{opacity:0;transform:translateY(14px) scale(.72)}}@keyframes dot-pop{from{opacity:0;transform:translateX(-50%) scale(.55)}}@keyframes arrow-grow{from{transform:scaleX(0);transform-origin:left}}@keyframes bit-move{to{transform:translateY(-2px) rotate(2deg)}}@keyframes pulse{to{transform:scale(1.07)}}
@media(max-width:639.98px){.stage-header{padding-top:58px}.screen-type{display:none}.stage{width:min(390px,100%)}.heading{min-height:72px}.heading h1{font-size:26px}.heading .g1-char{width:65px;height:80px}.model-card,.hook-model,.whole-card,.rule-card,.question{padding:13px;border-radius:18px}.options{grid-template-columns:1fr}.option{min-height:52px}.fraction-bar{height:82px}.model-choices{grid-template-columns:1fr}.energy-model{grid-template-columns:1fr}.energy-model>strong{transform:rotate(90deg)}.stage-nav{min-height:68px}.btn-white-accent,.btn-ghost{min-width:112px;padding:0 12px}.finale-main,.finale-bottom{grid-template-columns:1fr}.finale-main,.finale-bottom{gap:8px}.finale-takeaway{min-height:36px}.number-line{height:135px;padding-inline:9%}}
@media(prefers-reduced-motion:reduce){.lesson-root *,.lesson-root *::before,.lesson-root *::after{scroll-behavior:auto!important;animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important}.state-note,.formula-card,.result-chip,.rule-line,.wrong-formula,.finale-answer,.finale-takeaway,.finale-bridge{opacity:1!important;transform:none!important}}
.caption-slot{flex:none;min-height:38px;padding:6px 10px;border-radius:11px;display:flex;align-items:center;visibility:hidden;color:#fff;background:rgba(23,59,82,.94);font-size:10px;line-height:1.22}.caption-slot.is-visible{visibility:visible}.feedback.feedback-slot{height:76px;min-height:76px;overflow:hidden;visibility:hidden;opacity:0;animation:none}.feedback.feedback-slot.open{visibility:visible;opacity:1}.feedback-bit{width:48px;height:58px;display:block}.feedback-bit .g1-char,.feedback-bit>svg{width:100%;height:100%}.feedback-proof{display:block;margin-top:4px;padding-top:4px;border-top:1px solid rgba(34,122,83,.2);color:${T.success};font:900 12px/1.2 'JetBrains Mono',monospace}.feedback-proof small{display:block;font-size:8px;letter-spacing:.1em}.lesson-root{height:100dvh!important;min-height:0!important;overflow:hidden!important}.stage-content{display:flex;flex-direction:column;gap:4px;overflow:hidden!important}.stage-content>.stack{flex:1;min-height:0}.btn-white-accent:disabled{cursor:not-allowed;opacity:.46}
@media(max-width:639.98px){.stage-header{padding-top:7px!important;padding-bottom:4px!important}.lesson-root-preview .stage-header{padding-top:48px!important}.progress-track{height:4px!important;margin-bottom:5px!important}.stage-content{padding-top:3px!important;padding-bottom:3px!important}.stage-nav{min-height:52px!important}.stack{gap:4px!important}.heading{min-height:40px!important}.heading h1{font-size:17px!important}.heading .g1-char{width:38px!important;height:48px!important}.question,.model-card,.visual-card,.hook-model,.whole-card,.rule-card,.beat-list{padding:5px!important;border-radius:11px!important}.options{gap:3px!important}.option{min-height:44px!important;padding:4px!important;border-radius:9px!important;font-size:9px!important}.feedback.feedback-slot{height:54px;min-height:54px!important;padding:4px 6px!important;grid-template-columns:32px 1fr!important;gap:4px!important}.feedback-bit{width:31px;height:39px}.feedback p{font-size:9px!important;line-height:1.16!important}.caption-slot{min-height:28px;padding:3px 7px;font-size:8px}.beat-list{gap:3px!important}.beat{min-height:29px!important;padding:3px!important;font-size:8px!important}.btn-white-accent,.btn-ghost{min-height:44px!important;min-width:104px!important;padding:0 8px!important;font-size:11px!important}.finale-main,.finale-bottom{grid-template-columns:1fr 1fr!important;gap:4px!important}}
.final-reflection{padding:6px 8px;border-radius:12px;display:grid;gap:5px;background:rgba(255,255,255,.9)}.final-reflection>strong{font:750 12px/1.2 'Source Serif 4',Georgia,serif}.final-reflection>div{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px}.final-reflection button{min-height:44px;padding:4px;border:0;border-radius:9px;display:grid;grid-template-columns:20px 1fr;align-items:center;gap:3px;color:${T.navy};background:${T.cyanSoft};cursor:pointer;text-align:left;font-size:8px;font-weight:850}.final-reflection button>span{width:19px;height:19px;border-radius:6px;display:grid;place-items:center;color:#fff;background:${T.cyan}}.final-reflection button.is-selected{color:#fff;background:${T.cyan}}.final-reflection button:disabled{cursor:default}.g4-title-claim:disabled{cursor:not-allowed;opacity:.46}
@media(max-width:639.98px){.stage-header{padding-top:11px!important}.lesson-root-preview .stage-header{padding-top:52px!important}}
@media(max-width:639.98px) and (max-height:700px){.stage-test .options,.stage-error .options{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
`;
