import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// 4-SINF · 17-DARS · Shkalalar
// Approved frame vector: 3,4,4,4,4,4,4,5,2,2,2,2,2,3,5.

const T = {
  bg: '#F5F5F0', ink: '#12212C', ink2: '#50616D', ink3: '#87949D', paper: '#FFFFFF',
  accent: '#FF5B35', accentSoft: '#FFF0EA', cyan: '#168FA3', cyanSoft: '#E5F5F6',
  navy: '#173B52', lime: '#95C93D', success: '#227A53', successSoft: '#E7F3EC',
  warn: '#A96F13', warnSoft: '#FFF5D9', shadowBase: '58, 53, 48',
};

const TOTAL_SCREENS = 15;
const FRAME_COUNTS = [3, 4, 4, 4, 4, 4, 4, 5, 2, 2, 2, 2, 2, 3, 5];
const SUPPORTED_LANGS = ['uz', 'ru', 'en'];
const normalizeLang = (value) => SUPPORTED_LANGS.includes(value) ? value : 'uz';
const SPEECH_LOCALES = { uz: 'uz-UZ', ru: 'ru-RU', en: 'en-GB' };
const LESSON_META = {
  lessonId: 'num-4-17-v1',
  slug: 'dars17-shkalalar',
  lessonTitle: { uz: "17-dars. Shkalalar", ru: 'Урок 17. Шкалы', en: 'Lesson 17. Scales' },
  skillTags: ['scale', 'division_value', 'reading_scales', 'intervals', 'measurement'],
};

const SCREEN_META = [
  { id: 's0', type: 'hook', goal: 'Read Bit position on a story scale', template: 'DiagnosticChoice', mechanic: 'diagnostic-choice', active: true, scored: false, scope: 'hook', misconceptions: ['read the destination instead of pointer'], resetOnReturn: true },
  { id: 's1', type: 'diagnostic', goal: 'Find one division from a known interval', template: 'GuidedChoice', mechanic: 'guided-choice', active: true, scored: false, scope: 'concept', misconceptions: ['use interval value without division'] },
  { id: 's2', type: 'model', goal: 'Explore all structural parts of a scale', template: 'TapParts', mechanic: 'tap-parts', active: true, scored: false, scope: 'concept', misconceptions: [] },
  { id: 's3', type: 'discovery', goal: 'Discover division value by marking equal gaps', template: 'TapDivisions', mechanic: 'tap-divisions', active: true, scored: false, scope: 'concept', misconceptions: ['count marks instead of gaps'] },
  { id: 's4', type: 'error-analysis', goal: 'Analyse the marks-versus-gaps error', template: 'GuidedChoice', mechanic: 'guided-choice', active: true, scored: false, scope: 'concept', misconceptions: ['divide by number of marks'] },
  { id: 's5', type: 'model', goal: 'Read a moving pointer on a second model', template: 'PointerSlider', mechanic: 'pointer-slider', active: true, scored: false, scope: 'concept', misconceptions: [] },
  { id: 's6', type: 'strategy', goal: 'Choose a strategy for a non-zero scale start', template: 'StrategyChoice', mechanic: 'guided-choice', active: true, scored: false, scope: 'transfer', misconceptions: ['assume every scale starts at zero'] },
  { id: 's7', type: 'rule', goal: 'State the scale-division rule after discovery', template: 'RuleReveal', mechanic: 'model-reveal', active: true, scored: false, scope: 'concept', misconceptions: [] },
  { id: 's8', type: 'guided-practice', goal: 'Calculate one division', template: 'ChoiceRetry', mechanic: 'choice-retry', active: true, scored: true, scope: 'module-mikro', misconceptions: ['count marks'] },
  { id: 's9', type: 'independent-practice', goal: 'Read an unlabelled pointer', template: 'ChoiceRetry', mechanic: 'choice-retry', active: true, scored: true, scope: 'module-mikro', misconceptions: ['read nearest labelled mark'] },
  { id: 's10', type: 'transfer', goal: 'Transfer the method to a shifted interval', template: 'ChoiceRetry', mechanic: 'choice-retry', active: true, scored: true, scope: 'module-mikro', misconceptions: ['ignore starting value'] },
  { id: 's11', type: 'strategy', goal: 'Select the correct visual scale', template: 'VisualChoice', mechanic: 'visual-choice-retry', active: true, scored: true, scope: 'module-mikro', misconceptions: ['match endpoints only'] },
  { id: 's12', type: 'error-analysis', goal: 'Repair Bit calculation based on five marks', template: 'ErrorRepair', mechanic: 'choice-retry', active: true, scored: true, scope: 'module-mikro', misconceptions: ['divide by marks rather than gaps'] },
  { id: 's13', type: 'life-case', goal: 'Read a fuel gauge in context', template: 'LifeChoice', mechanic: 'choice-retry', active: true, scored: true, scope: 'final', misconceptions: ['ignore the initial fuel value'] },
  { id: 's14', type: 'summary', goal: 'Reflect on scale reading and bridge to fractions', template: 'ReflectionChoice', mechanic: 'reflection-choice', active: true, scored: false, scope: 'reflection', misconceptions: [] },
];

const CONTENT = {
  s0: {
    eyebrow: { uz: "Bitning parvozi", ru: 'Полёт Бита', en: "Bit's flight" },
    title: { uz: "Sirli shkala", ru: 'Загадочная шкала', en: 'The mysterious scale' },
    story: { uz: "Bit kemasida biroz uchishni xohladi. U yo'lni 0 nuqtadan boshladi va 40 nuqtagacha uchib bormoqchi.", ru: 'Бит решил немного полетать на своём корабле. Он начал путь в точке 0 и хочет долететь до точки 40.', en: 'Bit wanted to take a short flight in his ship. He started at point 0 and wants to fly to point 40.' },
    question: { uz: "Bit hozir qaysi nuqtada turibdi?", ru: 'В какой точке сейчас находится Бит?', en: 'Which point is Bit at now?' },
    options: ['20', '30', '40'],
    correctIndex: 1,
    feedback: [
      { uz: "Bit 20 nuqtadan o'tib bo'ldi. Kema keyingi belgida turibdi.", ru: 'Бит уже пролетел точку 20. Корабль находится у следующей отметки.', en: 'Bit has already passed point 20. The ship is at the next mark.' },
      { uz: "To'g'ri. Bit kemasi 30 nuqtada turibdi.", ru: 'Верно. Корабль Бита находится в точке 30.', en: "Correct. Bit's ship is at point 30." },
      { uz: "40 — Bit yetib bormoqchi bo'lgan oxirgi nuqta. U hali yo'lda.", ru: '40 — конечная точка, до которой хочет долететь Бит. Он ещё в пути.', en: '40 is the destination Bit wants to reach. He is still on the way.' },
    ],
    proof: { uz: "Yechim: 0 → 10 → 20 → 30", ru: 'Решение: 0 → 10 → 20 → 30', en: 'Solution: 0 → 10 → 20 → 30' },
    audio: { intro: {
      uz: ["Bit kemasida biroz uchishni xohladi.", "U yo'lni nol nuqtadan boshladi va qirq nuqtagacha uchib bormoqchi.", "Bit hozir qaysi nuqtada turganini toping."],
      ru: ['Бит решил немного полетать на своём корабле.', 'Он начал путь в точке ноль и хочет долететь до точки сорок.', 'Определите, в какой точке сейчас находится Бит.'],
      en: ['Bit wanted to take a short flight in his ship.', 'He started at point zero and wants to fly to point forty.', 'Work out which point Bit is at now.'],
    }, on_pick: [
      { uz: "Bit yigirma nuqtadan o'tib bo'ldi. Kema keyingi belgida turibdi.", ru: 'Бит уже пролетел точку двадцать. Корабль находится у следующей отметки.', en: 'Bit has already passed point twenty. The ship is at the next mark.' },
      { uz: "To'g'ri. Bit kemasi o'ttiz nuqtada turibdi.", ru: 'Верно. Корабль Бита находится в точке тридцать.', en: "Correct. Bit's ship is at point thirty." },
      { uz: "Qirq Bitning manzili. U hali o'ttiz nuqtada turibdi.", ru: 'Сорок является целью Бита. Сейчас он ещё в точке тридцать.', en: "Forty is Bit's destination. He is still at point thirty." },
    ] },
  },
  s1: {
    eyebrow: { uz: "Tayanch bilim", ru: 'Опорное знание', en: 'Prior knowledge' },
    title: { uz: "Farqni teng bo'linmalarga ajratamiz", ru: 'Делим разность на равные деления', en: 'Divide the difference into equal divisions' },
    prompt: { uz: "20 birlikni 4 ta teng bo'linmaga ajrating.", ru: 'Разделите 20 единиц на 4 равных деления.', en: 'Divide 20 units into 4 equal divisions.' },
    audio: {
      uz: ["Qirq bilan yigirmaning farqi yigirmaga teng. Bu butun oraliqning qiymati.", "Endi yigirma birlikni to'rtta teng bo'linmaga ajratamiz.", "Har bir bo'linmaga bir xil miqdor to'g'ri keladi. Hozircha bu miqdor noma'lum.", "Yigirmani to'rtga bo'ling va bitta bo'linma qiymatini variantlardan tanlang."],
      ru: ['Разность сорока и двадцати равна двадцати. Это значение всего промежутка.', 'Теперь разделим двадцать единиц на четыре равных деления.', 'На каждое деление приходится одинаковое количество. Пока оно неизвестно.', 'Разделите двадцать на четыре и выберите цену одного деления из вариантов.'],
      en: ['The difference between forty and twenty is twenty. This is the value of the whole interval.', 'Now divide twenty units into four equal divisions.', 'Each division represents the same amount. For now, this amount is unknown.', 'Divide twenty by four and choose the value of one division.'],
      feedback: [
        { uz: "To'rt soni bo'linmalar sonini bildiradi. Har bir bo'linmadagi birliklar sonini kuzating.", ru: 'Четыре это число делений. Проследите число единиц в каждом делении.', en: 'Four is the number of divisions. Find how many units each division represents.' },
        { uz: "To'g'ri. Yigirmani to'rtga bo'lsak, besh.", ru: 'Верно. Двадцать разделить на четыре получится пять.', en: 'Correct. Twenty divided by four is five.' },
        { uz: "Yigirma butun oraliqning qiymati. Uni to'rtga bo'ling.", ru: 'Двадцать это значение всего промежутка. Разделите его на четыре.', en: 'Twenty is the value of the whole interval. Divide it by four.' },
      ],
    },
  },
  s2: {
    eyebrow: { uz: "Shkala tuzilishi", ru: 'Устройство шкалы', en: 'Parts of a scale' },
    title: { uz: "Shkala nimalardan tuzilgan?", ru: 'Из чего состоит шкала?', en: 'What is a scale made of?' },
    audio: {
      uz: ["Shkalaning asosi to'g'ri chiziqdir. U barcha qiymatlarni bir yo'nalishda joylashtiradi.", "Chiziqdagi qisqa belgilar qiymatlarning aniq o'rnini ko'rsatadi.", "Ikki qo'shni belgi orasidagi teng oraliq bo'linma deyiladi.", "Ko'rsatkich o'lchanayotgan qiymat qaysi belgida ekanini bildiradi."],
      ru: ['Основа шкалы это прямая линия. Она располагает все значения в одном направлении.', 'Короткие штрихи отмечают точные места значений.', 'Равный промежуток между соседними штрихами называется делением.', 'Указатель показывает, на какой отметке находится измеряемое значение.'],
      en: ['The base of a scale is a straight line. It places all the values in one direction.', 'Short marks on the line show the exact positions of values.', 'An equal interval between two neighbouring marks is called a division.', 'The pointer shows which mark corresponds to the measured value.'],
    },
    tapFeedback: [
      { uz: "Bu shkala chizig'i.", ru: 'Это линия шкалы.', en: 'This is the scale line.' },
      { uz: "Bu belgi.", ru: 'Это штрих.', en: 'This is a mark.' },
      { uz: "Bu bo'linma.", ru: 'Это деление.', en: 'This is a division.' },
      { uz: "Bu ko'rsatkich.", ru: 'Это указатель.', en: 'This is the pointer.' },
    ],
  },
  s3: {
    eyebrow: { uz: "Kashfiyot", ru: 'Исследование' , en: "Explore"},
    title: { uz: "Bitta bo'linma qiymatini topamiz", ru: 'Находим цену одного деления', en: 'Find the value of one division' },
    audio: {
      uz: ["Endi misolni qiyinlashtiramiz. Shkala bir yuzdan boshlanib, ikki yuzda tugaydi.", "Avval ikki yuzdan bir yuzni ayiramiz. Butun oraliqning qiymati bir yuzga teng.", "Yozilgan sonlar orasida to'rtta teng bo'linma bor.", "Bir yuzni to'rtga bo'lsak, bitta bo'linma qiymati yigirma besh bo'ladi."],
      ru: ['Теперь усложним пример. Шкала начинается со ста и заканчивается на двухстах.', 'Сначала вычтем из двухсот сто. Значение всего промежутка равно ста.', 'Между подписанными числами четыре равных деления.', 'Сто разделить на четыре. Цена одного деления равна двадцати пяти.'],
      en: ['Now make the example more challenging. The scale starts at one hundred and ends at two hundred.', 'First subtract one hundred from two hundred. The whole interval has a value of one hundred.', 'There are four equal divisions between the labelled numbers.', 'One hundred divided by four gives twenty-five for the value of one division.'],
    },
    tapFeedback: [
      { uz: "Siz bitta bo'linmani belgiladingiz.", ru: 'Вы отметили одно деление.', en: 'You marked one division.' },
      { uz: "Siz ikkita bo'linmani belgiladingiz.", ru: 'Вы отметили два деления.', en: 'You marked two divisions.' },
      { uz: "Siz uchta bo'linmani belgiladingiz.", ru: 'Вы отметили три деления.', en: 'You marked three divisions.' },
      { uz: "Siz to'rtta bo'linmani belgiladingiz.", ru: 'Вы отметили четыре деления.', en: 'You marked four divisions.' },
    ],
  },
  s4: {
    eyebrow: { uz: "Muhim farq", ru: 'Важное различие', en: 'An important distinction' },
    title: { uz: "Belgilarni emas, bo'linmalarni sanaymiz", ru: 'Считаем деления, а не штрихи', en: 'Count the divisions, not the marks' },
    prompt: { uz: "Bo'linma qiymatini topishda nimani sanaymiz?", ru: 'Что нужно считать, чтобы найти цену деления?', en: 'What do we count to find the value of one division?' },
    audio: {
      uz: ["Bu shkalada beshta belgi ko'rinmoqda.", "Ammo belgilar orasida to'rtta bo'linma bor.", "Bit belgilarni sanab, qirqni beshga bo'ldi.", "Biz bo'linmalarni sanaymiz: qirqni to'rtga bo'lsak, javob o'n."],
      ru: ['На этой шкале видно пять штрихов.', 'Но между ними только четыре деления.', 'Бит посчитал штрихи и разделил сорок на пять.', 'Мы считаем деления. Сорок разделить на четыре получится десять.'],
      en: ['There are five marks visible on this scale.', 'However, there are only four divisions between the marks.', 'Bit counted the marks and divided forty by five.', 'We count the divisions. Forty divided by four is ten.'],
      feedback: [
        { uz: "Belgilar soni bo'linmalar sonidan bittaga ko'p. Bo'linmalarni sanang.", ru: 'Штрихов на один больше, чем делений. Считайте деления.', en: 'There is one more mark than there are divisions. Count the divisions.' },
        { uz: "To'g'ri. Ikki qo'shni belgi orasidagi bo'linmalar sanaladi.", ru: 'Верно. Считают деления между соседними штрихами.', en: 'Correct. Count the divisions between neighbouring marks.' },
      ],
    },
  },
  s5: {
    eyebrow: { uz: "Ko'rsatkich", ru: 'Указатель', en: 'Pointer' },
    title: { uz: "Ko'rsatkich qiymatini o'qiymiz", ru: 'Читаем значение указателя', en: 'Read the value indicated by the pointer' },
    audio: {
      uz: ["Avval bitta bo'linma qiymatini eslaymiz. Har ikki qo'shni belgi orasida besh birlik bor.", "Yigirmadan boshlaymiz. Birinchi bo'linmada yigirma besh, ikkinchisida o'ttiz, uchinchisida o'ttiz besh bo'ladi.", "Yigirmadan ko'rsatkichgacha aynan uchta bo'linma bor. Boshlang'ich belgini bo'linma deb sanamaymiz.", "Shuning uchun yigirmaga uch karra beshni qo'shamiz. Natija o'ttiz besh, demak ko'rsatkich o'ttiz beshda turibdi."],
      ru: ['Сначала вспомним цену одного деления. Между каждыми соседними штрихами пять единиц.', 'Начинаем с двадцати. На первом делении двадцать пять, на втором тридцать, на третьем тридцать пять.', 'От двадцати до указателя ровно три деления. Начальную отметку делением не считаем.', 'Поэтому к двадцати прибавляем три раза по пять. Получаем тридцать пять, значит указатель стоит на тридцати пяти.'],
      en: ['First recall the value of one division. There are five units between each pair of neighbouring marks.', 'Start at twenty. The first division gives twenty-five, the second gives thirty, and the third gives thirty-five.', 'There are exactly three divisions from twenty to the pointer. We do not count the starting mark as a division.', 'So we add three lots of five to twenty. The result is thirty-five, so the pointer is at thirty-five.'],
    },
  },
  s6: {
    eyebrow: { uz: "Nol shart emas", ru: 'Ноль не обязателен', en: 'Zero is not required' },
    title: { uz: "Shkala noldan boshlanmasa-chi?", ru: 'А если шкала начинается не с нуля?', en: 'What if the scale does not start at zero?' },
    prompt: { uz: "Shkala noldan boshlanishi kerakmi?", ru: 'Должна ли шкала начинаться с нуля?', en: 'Does a scale have to start at zero?' },
    options: [{ uz: "Ha", ru: 'Да', en: 'Yes' }, { uz: "Yo'q", ru: 'Нет', en: 'No' }],
    feedback: [
      { uz: "Yo'q. Ikki ma'lum qiymatning farqi yetarli.", ru: 'Нет. Достаточно разности двух известных значений.', en: 'No. The difference between two known values is enough.' },
      { uz: "To'g'ri. Ikki ma'lum qiymatning farqi yetarli.", ru: 'Верно. Достаточно разности двух известных значений.', en: 'Correct. The difference between two known values is enough.' },
    ],
    audio: {
      uz: ["Bu shkala bir yuz yigirmadan boshlanadi.", "Bir yuz sakson bilan bir yuz yigirmaning farqi oltmish.", "Uchta bo'linma bor, demak bitta bo'linma yigirmaga teng.", "Ko'rsatkich bir yuz oltmish qiymatida turibdi."],
      ru: ['Эта шкала начинается со ста двадцати.', 'Разность ста восьмидесяти и ста двадцати равна шестидесяти.', 'Есть три деления, значит цена деления равна двадцати.', 'Указатель стоит на значении сто шестьдесят.'],
      en: ['This scale starts at one hundred and twenty.', 'The difference between one hundred and eighty and one hundred and twenty is sixty.', 'There are three divisions, so one division has a value of twenty.', 'The pointer is at one hundred and sixty.'],
      feedback: [
        { uz: "Yo'q. Ikki ma'lum qiymatning farqi yetarli.", ru: 'Нет. Достаточно разности двух известных значений.', en: 'No. The difference between two known values is enough.' },
        { uz: "To'g'ri. Ikki ma'lum qiymatning farqi yetarli.", ru: 'Верно. Достаточно разности двух известных значений.', en: 'Correct. The difference between two known values is enough.' },
      ],
    },
  },
  s7: {
    eyebrow: { uz: "Umumiy qoida", ru: 'Общее правило', en: 'General rule' },
    title: { uz: "Yo'nalish o'zgarsa ham usul o'zgarmaydi", ru: 'Направление меняется, способ остаётся', en: 'The direction changes, but the method stays the same' },
    audio: {
      uz: ["Endi shkala vertikal joylashgan.", "O'ndan o'ttizgacha to'rtta teng bo'linma bor.", "O'ttiz bilan o'nning farqi yigirmaga teng.", "Yigirmani to'rtga bo'lsak, har bir bo'linma besh daraja.", "Suyuqlik yigirma besh daraja belgisigacha ko'tarilgan."],
      ru: ['Теперь шкала расположена вертикально.', 'От десяти до тридцати четыре равных деления.', 'Разность тридцати и десяти равна двадцати.', 'Двадцать разделить на четыре. Каждое деление равно пяти градусам.', 'Столбик жидкости поднялся до отметки двадцать пять градусов.'],
      en: ['The scale is now vertical.', 'There are four equal divisions from ten to thirty.', 'The difference between thirty and ten is twenty.', 'Twenty divided by four gives five degrees for each division.', 'The liquid has risen to the twenty-five-degree mark.'],
    },
  },
  s8: {
    eyebrow: { uz: "Mashq · 1/6", ru: 'Тренировка · 1/6' , en: "Practice · 1/6"},
    title: { uz: "Bitta bo'linma nechaga teng?", ru: 'Чему равна цена деления?', en: 'What is the value of one division?' },
    question: { uz: "0 dan 60 gacha 6 ta teng bo'linma bor.", ru: 'От 0 до 60 есть 6 равных делений.', en: 'There are 6 equal divisions from 0 to 60.' },
    options: ['6', '10', '12'], correctIndex: 1,
    feedback: [
      { uz: "6 — bo'linmalar soni. 60 ni 6 ga bo'ling.", ru: '6 — число делений. Разделите 60 на 6.', en: '6 is the number of divisions. Divide 60 by 6.' },
      { uz: "To'g'ri: 60 ni 6 ga bo'lsak, 10.", ru: 'Верно: 60 разделить на 6 — 10.', en: 'Correct: 60 divided by 6 is 10.' },
      { uz: "Shkalada 6 ta bo'linma bor. 60 ni 6 ga bo'ling.", ru: 'На шкале 6 делений. Разделите 60 на 6.', en: 'The scale has 6 divisions. Divide 60 by 6.' },
    ],
    proof: { uz: "60 ÷ 6 = 10", ru: '60 ÷ 6 = 10' , en: "60 ÷ 6 = 10"},
    audio: { intro: { uz: ["Noldan oltmishgacha oltita teng bo'linma bor. Bitta bo'linma qiymatini toping."], ru: ['От нуля до шестидесяти шесть равных делений. Найдите цену одного деления.'], en: ['There are six equal divisions from zero to sixty. Find the value of one division.'] }, on_correct: { uz: "To'g'ri. Oltmishni oltiga bo'lsak, bitta bo'linma o'nga teng.", ru: 'Верно. Шестьдесят разделить на шесть. Цена деления равна десяти.', en: 'Correct. Sixty divided by six gives a value of ten for one division.' }, on_wrong: [
      { uz: "Olti soni bo'linmalar sonini bildiradi. Oltmishni oltiga bo'ling.", ru: 'Шесть это число делений. Разделите шестьдесят на шесть.', en: 'Six is the number of divisions. Divide sixty by six.' },
      { uz: "Bitta bo'linma qiymatini yana tekshiring.", ru: 'Ещё раз проверьте цену одного деления.', en: 'Check the value of one division again.' },
      { uz: "Shkalada oltita bo'linma bor. Oltmishni oltiga bo'ling.", ru: 'На шкале шесть делений. Разделите шестьдесят на шесть.', en: 'The scale has six divisions. Divide sixty by six.' },
    ] },
  },
  s9: {
    eyebrow: { uz: "Mashq · 2/6", ru: 'Тренировка · 2/6' , en: "Practice · 2/6"},
    title: { uz: "Ko'rsatkich qayerda?", ru: 'Где стоит указатель?', en: 'Where is the pointer?' },
    question: { uz: "Bitta bo'linma 5 ga teng. Ko'rsatkich qaysi qiymatda?", ru: 'Цена деления равна 5. На каком значении стоит указатель?', en: 'One division is worth 5. What value is the pointer showing?' },
    options: ['40', '45', '50'], correctIndex: 1,
    feedback: [
      { uz: "Siz ikki bo'linma sanadingiz. Ko'rsatkich uchinchi bo'linmada.", ru: 'Вы посчитали два деления. Указатель стоит на третьем.', en: 'You counted two divisions. The pointer is on the third division.' },
      { uz: "To'g'ri: 30, 35, 40, 45.", ru: 'Верно: 30, 35, 40, 45.', en: 'Correct: 30, 35, 40, 45.' },
      { uz: "50 — oxirgi yozilgan qiymat. Ko'rsatkich undan oldin turibdi.", ru: '50 — последнее подписанное значение. Указатель находится раньше.', en: '50 is the last labelled value. The pointer comes before it.' },
    ],
    proof: { uz: "30 + 3 × 5 = 45", ru: '30 + 3 × 5 = 45' , en: "30 + 3 × 5 = 45"},
    audio: { intro: { uz: ["Ko'rsatkich o'ttizdan keyingi uchinchi bo'linmada turibdi. Qiymatni toping."], ru: ['Указатель стоит на третьем делении после тридцати. Найдите значение.'], en: ['The pointer is on the third division after thirty. Find its value.'] }, on_correct: { uz: "To'g'ri. O'ttizga uch marta beshni qo'shsak, qirq besh.", ru: 'Верно. К тридцати прибавим три раза по пять. Получаем сорок пять.', en: 'Correct. Add five to thirty three times to get forty-five.' }, on_wrong: [
      { uz: "Siz ikki bo'linma sanadingiz. Ko'rsatkich uchinchi bo'linmada.", ru: 'Вы посчитали два деления. Указатель стоит на третьем.', en: 'You counted two divisions. The pointer is on the third division.' },
      { uz: "Ko'rsatkich qiymatini yana tekshiring.", ru: 'Ещё раз проверьте значение указателя.', en: 'Check the pointer value again.' },
      { uz: "Ellik oxirgi yozilgan qiymat. Ko'rsatkich undan oldin turibdi.", ru: 'Пятьдесят это последнее подписанное значение. Указатель находится раньше.', en: 'Fifty is the last labelled value. The pointer comes before it.' },
    ] },
  },
  s10: {
    eyebrow: { uz: "Mashq · 3/6", ru: 'Тренировка · 3/6' , en: "Practice · 3/6"},
    title: { uz: "Yetishmayotgan son", ru: 'Пропущенное число', en: 'The missing number' },
    question: { uz: "100, 120, ?, 160. ? o'rniga qaysi son yoziladi?", ru: '100, 120, ?, 160. Какое число нужно записать вместо ?', en: '100, 120, ?, 160. Which number should replace the question mark?' },
    options: ['130', '140', '150'], correctIndex: 1,
    feedback: [
      { uz: "Bu shkalaning qadami 10 emas, 20.", ru: 'Шаг этой шкалы не 10, а 20.', en: 'The step of this scale is 20, not 10.' },
      { uz: "To'g'ri. Har bo'linmada 20 tadan qo'shiladi.", ru: 'Верно. На каждом делении прибавляется 20.', en: 'Correct. Add 20 at each division.' },
      { uz: "120 dan keyingi bitta bo'linma 140 bo'ladi.", ru: 'Одно деление после 120 — это 140.', en: 'One division after 120 is 140.' },
    ],
    proof: { uz: "120 + 20 = 140", ru: '120 + 20 = 140' , en: "120 + 20 = 140"},
    audio: { intro: { uz: ["Qo'shni belgilar orasidagi farq yigirmaga teng. Yetishmayotgan sonni toping."], ru: ['Разность между соседними значениями равна двадцати. Найдите пропущенное число.'], en: ['The difference between neighbouring values is twenty. Find the missing number.'] }, on_correct: { uz: "To'g'ri. Bir yuz yigirmaga yigirmani qo'shsak, bir yuz qirq.", ru: 'Верно. К ста двадцати прибавим двадцать. Получаем сто сорок.', en: 'Correct. Add twenty to one hundred and twenty to get one hundred and forty.' }, on_wrong: [
      { uz: "Bu shkalaning qadami o'n emas, yigirma.", ru: 'Шаг этой шкалы не десять, а двадцать.', en: 'The step of this scale is twenty, not ten.' },
      { uz: "Yetishmayotgan sonni yana tekshiring.", ru: 'Ещё раз проверьте пропущенное число.', en: 'Check the missing number again.' },
      { uz: "Bir yuz yigirmadan keyingi bitta bo'linma bir yuz qirq bo'ladi.", ru: 'Одно деление после ста двадцати это сто сорок.', en: 'One division after one hundred and twenty is one hundred and forty.' },
    ] },
  },
  s11: {
    eyebrow: { uz: "Mashq · 4/6", ru: 'Тренировка · 4/6' , en: "Practice · 4/6"},
    title: { uz: "Qaysi shkalaning qadami 25?", ru: 'У какой шкалы шаг 25?', en: 'Which scale has a step of 25?' },
    question: { uz: "0 dan 100 gacha bitta bo'linmasi 25 bo'lgan shkalani tanlang.", ru: 'Выберите шкалу от 0 до 100 с ценой деления 25.', en: 'Choose the scale from 0 to 100 where one division is worth 25.' },
    options: [
      { uz: "A · 0, 25, 50, 75, 100", ru: 'А · 0, 25, 50, 75, 100', en: 'A · 0, 25, 50, 75, 100' },
      { uz: "B · 0, 20, 40, 60, 80, 100", ru: 'Б · 0, 20, 40, 60, 80, 100', en: 'B · 0, 20, 40, 60, 80, 100' },
      { uz: "C · 0, 50, 100", ru: 'В · 0, 50, 100', en: 'C · 0, 50, 100' },
    ], correctIndex: 0,
    feedback: [
      { uz: "To'g'ri: 100 ni 4 ga bo'lsak, 25.", ru: 'Верно: 100 разделить на 4 — 25.', en: 'Correct: 100 divided by 4 is 25.' },
      { uz: "B shkalada 5 ta bo'linma bor, shuning uchun bo'linma qiymati 20.", ru: 'На шкале Б 5 делений, поэтому цена деления 20.', en: 'Scale B has 5 divisions, so each division is worth 20.' },
      { uz: "C shkalada 2 ta bo'linma bor, shuning uchun bo'linma qiymati 50.", ru: 'На шкале В 2 деления, поэтому цена деления 50.', en: 'Scale C has 2 divisions, so each division is worth 50.' },
    ],
    proof: { uz: "100 ÷ 4 = 25", ru: '100 ÷ 4 = 25' , en: "100 ÷ 4 = 25"},
    audio: { intro: { uz: ["Uchta shkalani solishtiring va bitta bo'linmasi yigirma besh bo'lganini tanlang."], ru: ['Сравните три шкалы и выберите шкалу с ценой деления двадцать пять.'], en: ['Compare the three scales and choose the one where each division is worth twenty-five.'] }, on_correct: { uz: "To'g'ri. Yuzni to'rtta bo'linmaga bo'lsak, yigirma besh.", ru: 'Верно. Сто разделить на четыре деления. Цена деления равна двадцати пяти.', en: 'Correct. One hundred divided into four divisions gives twenty-five.' }, on_wrong: [
      { uz: "Bu to'g'ri variantni yana tanlashga urinish uchun yordamchi matn.", ru: 'Это подсказка для повторной проверки верного варианта.', en: 'Use the values on each scale and try choosing the correct option again.' },
      { uz: "Bu shkalada beshta bo'linma bor. Bitta bo'linma yigirmaga teng.", ru: 'На этой шкале пять делений. Цена деления равна двадцати.', en: 'This scale has five divisions. Each division is worth twenty.' },
      { uz: "Bu shkalada ikkita bo'linma bor. Bitta bo'linma ellikka teng.", ru: 'На этой шкале два деления. Цена деления равна пятидесяти.', en: 'This scale has two divisions. Each division is worth fifty.' },
    ] },
  },
  s12: {
    eyebrow: { uz: "Mashq · 5/6", ru: 'Тренировка · 5/6' , en: "Practice · 5/6"},
    title: { uz: "Bitning xatosini toping", ru: 'Найдите ошибку Бита', en: "Find Bit's mistake" },
    question: { uz: "Bit qayerda xato qildi?", ru: 'Где ошибся Бит?', en: 'Where did Bit make a mistake?' },
    options: [
      { uz: "Belgilarni sanadi", ru: 'Посчитал штрихи', en: 'He counted the marks' },
      { uz: "Ayirishni unutdi", ru: 'Забыл вычесть', en: 'He forgot to subtract' },
      { uz: "Shkala noldan boshlandi", ru: 'Шкала началась с нуля', en: 'The scale started at zero' },
    ], correctIndex: 0,
    feedback: [
      { uz: "To'g'ri. 5 ta belgi orasida 4 ta bo'linma bor.", ru: 'Верно. Между 5 штрихами 4 деления.', en: 'Correct. There are 4 divisions between 5 marks.' },
      { uz: "0 dan 40 gacha farq 40. Xato bo'linmalar sonida.", ru: 'Разность от 0 до 40 равна 40. Ошибка в числе делений.', en: 'The difference from 0 to 40 is 40. The mistake is in the number of divisions.' },
      { uz: "Shkalaning noldan boshlanishi xato emas.", ru: 'То, что шкала начинается с нуля, не является ошибкой.', en: 'There is nothing wrong with the scale starting at zero.' },
    ],
    proof: { uz: "4 ta bo'linma: 40 ÷ 4 = 10", ru: '4 деления: 40 ÷ 4 = 10', en: '4 divisions: 40 ÷ 4 = 10' },
    audio: { intro: { uz: ["Bit beshta belgini sanab, qirqni beshga bo'ldi. Uning xatosini toping."], ru: ['Бит посчитал пять штрихов и разделил сорок на пять. Найдите его ошибку.'], en: ['Bit counted five marks and divided forty by five. Find his mistake.'] }, on_correct: { uz: "To'g'ri. Beshta belgi orasida to'rtta bo'linma bor. Qirqni to'rtga bo'lsak, o'n.", ru: 'Верно. Между пятью штрихами четыре деления. Сорок разделить на четыре получится десять.', en: 'Correct. There are four divisions between five marks. Forty divided by four is ten.' }, on_wrong: [
      { uz: "Xato aynan belgilarni sanashda. Bu variant to'g'ri.", ru: 'Ошибка именно в подсчёте штрихов. Этот вариант верный.', en: 'The mistake is counting the marks. This option is correct.' },
      { uz: "Noldan qirqgacha farq qirq. Xato bo'linmalar sonida.", ru: 'Разность от нуля до сорока равна сорока. Ошибка в числе делений.', en: 'The difference from zero to forty is forty. The mistake is in the number of divisions.' },
      { uz: "Shkalaning noldan boshlanishi xato emas.", ru: 'То, что шкала начинается с нуля, не является ошибкой.', en: 'There is nothing wrong with the scale starting at zero.' },
    ] },
  },
  s13: {
    eyebrow: { uz: "Mashq · 6/6", ru: 'Тренировка · 6/6' , en: "Practice · 6/6"},
    title: { uz: "Yoqilg'i sensori", ru: 'Датчик топлива', en: 'Fuel gauge' },
    question: { uz: "Sensor bakdagi necha litr yoqilg'ini ko'rsatmoqda?", ru: 'Сколько литров топлива показывает датчик?', en: 'How many litres of fuel does the gauge show?' },
    options: [
      { uz: "350 litr", ru: '350 литров', en: '350 litres' },
      { uz: "400 litr", ru: '400 литров', en: '400 litres' },
      { uz: "450 litr", ru: '450 литров', en: '450 litres' },
    ], correctIndex: 1,
    feedback: [
      { uz: "Siz uchta bo'linma sanadingiz. Ko'rsatkich to'rtinchi bo'linmada.", ru: 'Вы посчитали три деления. Указатель стоит на четвёртом.', en: 'You counted three divisions. The pointer is on the fourth division.' },
      { uz: "To'g'ri. Sensor 400 litrni ko'rsatmoqda.", ru: 'Верно. Датчик показывает 400 литров.', en: 'Correct. The gauge shows 400 litres.' },
      { uz: "450 — ko'rsatkichdan keyingi belgi.", ru: '450 — следующая отметка после указателя.', en: '450 is the next mark after the pointer.' },
    ],
    proof: { uz: "(500 − 200) ÷ 6 = 50; 200 + 4 × 50 = 400 litr", ru: '(500 − 200) ÷ 6 = 50; 200 + 4 × 50 = 400 литров', en: '(500 − 200) ÷ 6 = 50; 200 + 4 × 50 = 400 litres' },
    audio: { intro: { uz: ["Ikki yuzdan besh yuzgacha oltita teng bo'linma bor.", "Uch yuzni oltiga bo'lsak, har bir bo'linma ellik litr."], ru: ['От двухсот до пятисот шесть равных делений.', 'Триста разделить на шесть. Цена деления равна пятидесяти литрам.'], en: ['There are six equal divisions from two hundred to five hundred.', 'Three hundred divided by six gives fifty litres for each division.'] }, on_correct: { uz: "To'g'ri. To'rt bo'linmadan keyingi qiymat to'rt yuz litr.", ru: 'Верно. Через четыре деления получаем четыреста литров.', en: 'Correct. After four divisions, the value is four hundred litres.' }, on_wrong: [
      { uz: "Siz uchta bo'linma sanadingiz. Ko'rsatkich to'rtinchi bo'linmada.", ru: 'Вы посчитали три деления. Указатель стоит на четвёртом.', en: 'You counted three divisions. The pointer is on the fourth division.' },
      { uz: "Sensor qiymatini yana tekshiring.", ru: 'Ещё раз проверьте показание датчика.', en: 'Check the gauge reading again.' },
      { uz: "To'rt yuz ellik ko'rsatkichdan keyingi belgidir.", ru: 'Четыреста пятьдесят это следующая отметка после указателя.', en: 'Four hundred and fifty is the mark after the pointer.' },
    ] },
  },
  s14: {
    eyebrow: { uz: "Yakun", ru: 'Итог' , en: "Summary"},
    title: { uz: "Shkala kodi ochildi", ru: 'Код шкалы раскрыт', en: 'The scale code is unlocked' },
    audio: {
      uz: ["Boshlang'ich sensorda yigirma va qirq sonlari yozilgan edi. Qirqdan yigirmani ayirsak, butun oraliqning qiymati yigirma bo'ladi.", "Bu oraliqda to'rtta teng bo'linma bor. Yigirmani to'rtga bo'lsak, har bir bo'linma beshga teng.", "Ko'rsatkich yigirmadan keyingi uchinchi bo'linmada. Beshtadan yuramiz: yigirma besh, o'ttiz va o'ttiz besh.", "Demak, ko'rsatkich o'ttiz beshda turibdi. Transport sensori to'g'ri sozlandi va shkala kodi ochildi.", "Keyingi darsda teng bo'linmalar g'oyasini butunning teng qismlari va kasrlarga o'tkazamiz."],
      ru: ['На стартовом датчике были подписаны двадцать и сорок. Вычитаем из сорока двадцать и получаем значение всего промежутка двадцать.', 'В этом промежутке четыре равных деления. Двадцать разделить на четыре, поэтому каждое деление равно пяти.', 'Указатель стоит на третьем делении после двадцати. Идём по пять: двадцать пять, тридцать и тридцать пять.', 'Значит, указатель стоит на тридцати пяти. Транспортный датчик настроен, и код шкалы раскрыт.', 'На следующем уроке перенесём идею равных делений на равные части целого и дроби.'],
      en: ['The starting gauge was labelled twenty and forty. Subtracting twenty from forty gives an interval value of twenty.', 'There are four equal divisions in this interval. Twenty divided by four means each division is worth five.', 'The pointer is on the third division after twenty. Count in fives: twenty-five, thirty and thirty-five.', 'So the pointer is at thirty-five. The vehicle gauge is set correctly, and the scale code is unlocked.', 'In the next lesson, we will apply equal divisions to equal parts of a whole and fractions.'],
    },
  },
};

let runtimeConfig = { ttsApiBase: '', voiceGender: 'f', correctSoundUrl: '', wrongSoundUrl: '', previewMode: false };
const configureLesson = (next) => { runtimeConfig = { ...runtimeConfig, ...next }; };

const LangContext = createContext('uz');
const ActivityContext = createContext({ activityState: {}, markActivity: () => {}, finalRewardState: { reflectionChoice: null, titleState: 'unclaimed' }, setFinalRewardState: () => {} });
const useLang = () => useContext(LangContext);
const useT = () => {
  const lang = useLang();
  return useCallback((value) => {
    if (value == null) return '';
    if (React.isValidElement(value)) return value;
    if (typeof value === 'string' || typeof value === 'number') return String(value);
    return value[lang] ?? value.uz ?? '';
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

const buildTtsUrl = (base, text, gender) => `${base}/api/tts?text=${encodeURIComponent(String(text).slice(0, 1000))}&g=${gender === 'm' ? 'm' : 'f'}`;

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
          utterance.lang = SPEECH_LOCALES[this.lang] ?? SPEECH_LOCALES.uz; utterance.rate = 0.94;
          utterance.onstart = () => this.emit({ isPlaying: true, completed: false, currentSegment: item.id, visualOnly: false });
          utterance.onend = () => { this.emit({ isPlaying: false, currentSegment: null }); this.index += 1; this.play(); };
          utterance.onerror = () => this.timed(item, 900);
          this.previewUtterance = utterance;
          this.timer = window.setTimeout(() => { try { window.speechSynthesis.speak(utterance); } catch { this.timed(item, 900); } }, 50);
          return;
        } catch { /* deterministic timer fallback */ }
      }
      this.timed(item); return;
    }
    if (!this.audio) { this.audio = new Audio(); this.audio.crossOrigin = 'anonymous'; }
    this.audio.onended = () => { this.index += 1; this.play(); };
    this.audio.onerror = () => this.timed(item, 900);
    this.audio.src = buildTtsUrl(runtimeConfig.ttsApiBase, item.text, runtimeConfig.voiceGender);
    this.audio.play().then(() => this.emit({ isPlaying: true, completed: false, currentSegment: item.id, visualOnly: false })).catch(() => this.timed(item, 900));
  }
  toggleMute() { this.muted = !this.muted; this.stop(); this.index = 0; this.emit({ muted: this.muted }); this.start(); }
  pushOneOff(text) { this.load([{ id: `feedback-${Date.now()}`, text }]); this.start(); }
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
    const engine = getAudioEngine(); if (!engine) return undefined;
    engine.setLang(lang); engine.listener = (next) => setState((previous) => ({ ...previous, ...next })); engine.load(stableSegments);
    const timer = window.setTimeout(() => engine.start(), 220);
    return () => { window.clearTimeout(timer); engine.stop(); engine.listener = null; };
  }, [lang, stableSegments]);
  return { ...state, replay: () => { const engine = getAudioEngine(); engine?.load(stableSegments); engine?.start(); }, toggleMute: () => getAudioEngine()?.toggleMute(), pushOneOff: (text) => getAudioEngine()?.pushOneOff(text) };
}

function useNarration(value, screen) {
  const lang = useLang(); const reduced = usePrefersReducedMotion();
  const segments = useMemo(() => {
    const source = value?.intro ?? value;
    const texts = source?.[lang] ?? [];
    return (Array.isArray(texts) ? texts : [texts]).filter(Boolean).map((text, index) => ({ id: `s${screen}-beat-${index}`, text }));
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
    <g className="g1-bit-ant"><path d="M60 30 V14" stroke="#9FB3BF" strokeWidth="4" strokeLinecap="round" /><circle cx="60" cy="11" r="6" fill="#FF4F28" /><circle cx="58" cy="9" r="2" fill="#FFB9A6" /></g>
    <rect x="44" y="118" width="12" height="16" rx="5" fill="#9FB3BF" />
    <rect x="64" y="118" width="12" height="16" rx="5" fill="#9FB3BF" />
    <rect x="34" y="60" width="52" height="62" rx="18" fill="url(#g4bbody)" stroke="#A9BCC8" strokeWidth="2" />
    <rect x="44" y="104" width="32" height="10" rx="5" fill="#A9BCC8" opacity="0.5" />
    {(state === 'happy' || isWave) && <g className={isWave ? 'bit-double-wave' : ''}><g className="bit-wave-left"><path d="M36 74 C 26 66 22 56 22 48" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" /><circle cx="22" cy="47" r="5" fill="#B6C7D2" /></g><g className="bit-wave-right"><path d="M84 74 C 94 66 98 56 98 48" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" /><circle cx="98" cy="47" r="5" fill="#B6C7D2" /></g></g>}
    {state === 'present' && <g><path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" /><circle cx="30" cy="103" r="5" fill="#B6C7D2" /><g className="g1-bit-wave"><path d="M84 74 C 96 66 100 54 98 44" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" /><circle cx="98" cy="43" r="5" fill="#B6C7D2" /></g></g>}
    {isThinking && <g><path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" /><circle cx="30" cy="103" r="5" fill="#B6C7D2" /><g className="bit-think-hand"><path d="M84 76 C 92 74 92 66 84 61" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" /><circle cx="83" cy="60" r="5" fill="#B6C7D2" /></g></g>}
    {isAwkward && <g className="bit-awkward-hands"><path d="M36 76 C 39 88 46 96 54 99" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" /><circle cx="54" cy="99" r="5" fill="#B6C7D2" /><path d="M84 76 C 81 88 74 96 66 99" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" /><circle cx="66" cy="99" r="5" fill="#B6C7D2" /></g>}
    {state === 'point' && <g><path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" /><circle cx="30" cy="103" r="5" fill="#B6C7D2" /><g className="bit-point-arm"><path d="M84 76 C 94 72 101 67 108 62" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" /><circle cx="109" cy="61" r="5" fill="#B6C7D2" /></g></g>}
    {state === 'idea' && <g><path d="M36 76 C 29 82 27 91 30 101" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" /><circle cx="30" cy="102" r="5" fill="#B6C7D2" /><path d="M84 76 C 92 68 95 58 94 50" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" /><circle cx="94" cy="49" r="5" fill="#B6C7D2" /></g>}
    {state === 'focus' && <g className="bit-focus-hands"><path d="M36 77 C 41 88 47 93 53 94" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" /><circle cx="53" cy="94" r="5" fill="#B6C7D2" /><path d="M84 77 C 79 88 73 93 67 94" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" /><circle cx="67" cy="94" r="5" fill="#B6C7D2" /></g>}
    {state === 'nod' && <g><path d="M36 76 C 28 84 26 94 30 102" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" /><circle cx="30" cy="103" r="5" fill="#B6C7D2" /><g className="bit-nod-hand"><path d="M84 75 C 93 70 99 62 99 54" stroke="#9FB3BF" strokeWidth="7" strokeLinecap="round" fill="none" /><circle cx="99" cy="53" r="5" fill="#B6C7D2" /></g></g>}
    <rect x="28" y="28" width="64" height="46" rx="16" fill="url(#g4bhead)" stroke="#A9BCC8" strokeWidth="2" />
    <rect x="36" y="36" width="48" height="30" rx="10" fill="#16242C" />
    <path d="M40 40 h18 a4 4 0 0 1 -4 8 h-14 Z" fill="rgba(255,255,255,0.08)" />
    <g className="g1-eyes" fill="#5BD6F2">{isAwkward ? <><ellipse cx="50" cy="53" rx="4.8" ry="3.2" /><ellipse cx="70" cy="53" rx="4.8" ry="3.2" /></> : isThinking ? <><circle cx="50" cy="50" r="4.5" /><circle cx="70" cy="49" r="5.5" /></> : <><circle cx="50" cy="50" r="5" /><circle cx="70" cy="50" r="5" /></>}</g>
    {isHappy && <path d="M50 58 Q60 65 70 58" stroke="#5BD6F2" strokeWidth="2.6" fill="none" strokeLinecap="round" />}
    {(state === 'present' || state === 'point' || state === 'focus') && <path d="M52 58 h16" stroke="#5BD6F2" strokeWidth="2.6" strokeLinecap="round" />}
    {isThinking && <circle cx="60" cy="59" r="2.4" fill="#5BD6F2" />}
    {isAwkward && <g className="bit-awkward-face"><path d="M53 62 Q60 57 67 62" stroke="#5BD6F2" strokeWidth="2.4" fill="none" strokeLinecap="round" /><circle cx="43" cy="59" r="4" fill="#FF9B8A" opacity=".5" /><circle cx="77" cy="59" r="4" fill="#FF9B8A" opacity=".5" /></g>}
    {isThinking && <g><circle cx="99" cy="38" r="9" fill="#FFC23C" /><text x="99" y="42.5" textAnchor="middle" fontSize="12" fontWeight="800" fill="#5A3A00">?</text></g>}
    {state === 'point' && <g className="bit-point-target"><circle cx="110" cy="61" r="8" fill="none" stroke="#FF5B35" strokeWidth="2" /><circle cx="110" cy="61" r="2" fill="#FF5B35" /></g>}
    {state === 'idea' && <g className="bit-idea-bulb"><circle cx="99" cy="36" r="9" fill="#FFC23C" /><path d="M95 36 Q99 31 103 36 M97 42 h4" stroke="#7A5200" strokeWidth="1.6" fill="none" strokeLinecap="round" /></g>}
    {state === 'focus' && <g className="bit-focus-scan"><path d="M43 45 h34" stroke="#95C93D" strokeWidth="2" strokeLinecap="round" /><circle cx="80" cy="45" r="3" fill="#95C93D" /></g>}
    {state === 'nod' && <g className="bit-nod-check"><circle cx="99" cy="38" r="9" fill="#95C93D" /><path d="M95 38 l3 3 6-7" stroke="#FFFFFF" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>}
  </svg>
  );
};

const AudioIndicator = ({ audio }) => {
  const t = useT();
  const muteLabel = audio.muted
    ? t({ uz: "Ovozni yoqish", ru: 'Включить звук', en: 'Turn sound on' })
    : t({ uz: "Ovozni o'chirish", ru: 'Выключить звук', en: 'Turn sound off' });
  const replayLabel = t({ uz: "Qayta eshitish", ru: 'Повторить', en: 'Replay' });
  return (
    <div className="audio-controls">
      <button type="button" className="icon-btn" onClick={audio.toggleMute} aria-label={muteLabel} title={muteLabel}>
        {audio.muted ? '🔇' : (audio.isPlaying ? '🔊' : '🔉')}
      </button>
      {!audio.muted && <button type="button" className="icon-btn" onClick={audio.replay} aria-label={replayLabel} title={replayLabel}>↻</button>}
    </div>
  );
};

const ScreenTypeLabel = ({ type }) => {
  const t = useT();
  const labels = {
    hook: { uz: "Missiya", ru: 'Миссия', en: 'Mission' },
    diagnostic: { uz: "Diagnostika", ru: 'Диагностика', en: 'Diagnostic' },
    exploration: { uz: "Kashfiyot", ru: 'Исследование', en: 'Exploration' },
    rule: { uz: "Qoida", ru: 'Правило', en: 'Rule' },
    practice: { uz: "Mashq", ru: 'Практика', en: 'Practice' },
    test: { uz: "Tekshiruv", ru: 'Проверка', en: 'Check' },
    case: { uz: "Vazifa", ru: 'Задача', en: 'Problem' },
    summary: { uz: "Yakun", ru: 'Итог', en: 'Summary' },
  };
  return <span className="screen-type">{labels[type] ? t(labels[type]) : type}</span>;
};

const BitAnswerComment = ({ correct, bitState }) => <BitSVG state={bitState ?? (correct ? 'nod' : 'awkward')}/>;

const FeedbackBlock = ({ show, correct, children, withBit = false, bitState = null }) => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!show) { const frame = requestAnimationFrame(() => setOpen(false)); return () => cancelAnimationFrame(frame); }
    let second = 0; const first = requestAnimationFrame(() => { second = requestAnimationFrame(() => setOpen(true)); });
    return () => { cancelAnimationFrame(first); cancelAnimationFrame(second); };
  }, [show]);
  return <div role="status" aria-hidden={!show} data-g4-feedback={correct ? 'correct' : 'wrong'} className={`feedback ${correct ? 'correct' : 'wrong'} ${withBit ? 'with-bit' : ''} ${open ? 'open' : ''}`}>{withBit ? <span className="feedback-bit"><BitAnswerComment correct={correct} bitState={bitState}/></span> : <b>{correct ? '✓' : '↻'}</b>}<div className="feedback-content">{show ? children : ''}</div></div>;
};

const ContractActivity = ({ screen, value, onComplete }) => {
  const t = useT(); const meta = SCREEN_META[screen];
  if (meta.template === 'ReflectionChoice') return null;
  if (!meta.template.includes('Reveal')) return null;
  return <div className="activity-slot"><button type="button" className={value !== undefined ? 'selected' : ''} onClick={() => onComplete(screen, true)}>{value !== undefined ? t({ uz: "Model tekshirildi", ru: 'Модель проверена', en: 'Model checked' }) : t({ uz: "Modelni tekshirish", ru: 'Проверить модель', en: 'Check the model' })}</button></div>;
};

const Stage = ({ screen, audio, onPrev, onNext, finish = false, activityDone, children }) => {
  const t = useT(); const mobile = useIsMobile(); const pad = mobile ? 14 : 48; const c = CONTENT[`s${screen}`]; const meta = SCREEN_META[screen]; const { activityState, markActivity } = useContext(ActivityContext);
  const storedActivity = Object.prototype.hasOwnProperty.call(activityState, screen); const activityReady = !meta.active || activityDone === true || storedActivity; const audioReady = !audio || audio.muted || audio.visualOnly || audio.completed; const canAdvance = activityReady && audioReady;
  useEffect(() => { if (activityDone === true && !storedActivity) markActivity(screen, true); }, [activityDone, markActivity, screen, storedActivity]);
  const showCaption = Boolean(audio?.caption && (audio.muted || audio.visualOnly));
  return <main className={`stage stage-${meta.type}`} data-screen={screen}><header className="stage-header" style={{ paddingLeft: pad, paddingRight: pad }}><div className="progress-track" aria-label={`${screen + 1} / ${TOTAL_SCREENS}`}><div className="progress-fill progress-bar" style={{ width: `${(screen + 1) / TOTAL_SCREENS * 100}%` }}/></div><div className="stage-chrome"><div className="chrome-title"><span className="status-dot"/><span>{t(c.eyebrow)}</span></div><div className="chrome-actions"><ScreenTypeLabel type={meta.type}/>{audio && <AudioIndicator audio={audio}/>}<span className="screen-count">{String(screen + 1).padStart(2, '0')} / {TOTAL_SCREENS}</span></div></div></header><section className="stage-content" style={{ paddingLeft: pad, paddingRight: pad }}><div className="stage-body">{children}<ContractActivity screen={screen} value={activityState[screen]} onComplete={markActivity}/></div><div className={`caption caption-slot ${showCaption ? 'visible' : ''}`} aria-hidden={!showCaption}>{showCaption ? audio.caption : ''}</div></section><footer className="stage-nav" style={{ paddingLeft: pad, paddingRight: pad }}>{screen === 0 ? <span/> : <button type="button" className="btn-ghost" onClick={onPrev}>← {t({ uz: "Orqaga", ru: 'Назад' , en: "Back"})}</button>}<button type="button" className="btn-white-accent" onClick={onNext} disabled={!canAdvance}>{finish ? t({ uz: "Darsni yakunlash", ru: 'Завершить урок' , en: "Finish lesson"}) : t({ uz: "Davom etish", ru: 'Продолжить' , en: "Continue"})} →</button></footer></main>;
};

const Heading = ({ c, bit }) => { const t = useT(); return <div className="heading"><div><span>{t(c.eyebrow)}</span><h1>{t(c.title)}</h1></div>{bit && <BitSVG state={bit}/>}</div>; };
const Options = ({ values, picked, onPick, correctIndex, solved, neutral = false }) => { const t = useT(); return <div className="options">{values.map((value, index) => <button type="button" key={`${index}-${t(value)}`} className={`option ${picked === index ? 'picked' : ''} ${!neutral && solved && index === correctIndex ? 'right' : ''} ${!neutral && picked === index && picked !== correctIndex ? 'bad' : ''}`} onClick={() => onPick(index)}><b>{String.fromCharCode(65 + index)}</b><span>{t(value)}</span></button>)}</div>; };
const FormulaFlow = ({ items, frame, slow = false }) => <div className={`formula-flow ${slow ? 'slow-sequence' : ''}`}>{items.map((item, index) => <React.Fragment key={`${index}-${String(item)}`}><div className={`formula-chip ${frame >= index ? 'show' : ''}`}>{item}</div>{index < items.length - 1 && <i className={frame >= index + 1 ? 'show' : ''}>→</i>}</React.Fragment>)}</div>;

const ScaleSVG = ({ min = 20, max = 40, intervals = 4, pointer = null, frame = 3, allLabels = false, labels = null, className = '', activePart = null, slow = false }) => {
  const ticks = Array.from({ length: intervals + 1 }, (_, index) => index);
  const xAt = (index) => 55 + index * (510 / intervals);
  const pointerX = pointer == null ? null : 55 + ((pointer - min) / (max - min)) * 510;
  return <svg className={`scale-svg ${slow ? 'scale-slow' : ''} ${className}`} viewBox="0 0 620 170" role="img" aria-label={`${min}–${max}`}>
    <rect x="18" y="18" width="584" height="134" rx="24" fill="#FFFFFF" stroke="rgba(23,59,82,.12)"/>
    <path className={`scale-line ${frame >= 0 ? 'drawn' : ''} ${activePart === 0 ? 'part-highlight' : ''}`} d="M55 91 H565" stroke={T.navy} strokeWidth="6" strokeLinecap="round"/>
    <g className={`scale-divisions ${activePart === 2 ? 'part-highlight' : ''}`}>{Array.from({ length: intervals }, (_, index) => <rect key={index} x={xAt(index) + 7} y="80" width={(510 / intervals) - 14} height="22" rx="10"/>)}</g>
    <g className={frame >= 1 ? 'ticks-visible' : ''}>{ticks.map((index) => {
      const value = labels?.[index] ?? min + ((max - min) / intervals) * index;
      const showLabel = labels ? labels[index] !== '' : allLabels || index === 0 || index === intervals;
      return <g key={index} className={`scale-tick ${activePart === 1 ? 'part-highlight' : ''}`} style={{ '--delay': `${index * (slow ? 150 : 70)}ms` }}><path d={`M${xAt(index)} 71 V111`} stroke={T.cyan} strokeWidth="5" strokeLinecap="round"/><text x={xAt(index)} y="139" textAnchor="middle">{showLabel ? value : ''}</text></g>;
    })}</g>
    {pointerX != null && <g className={`scale-pointer ${frame >= 2 ? 'pointer-visible' : ''} ${activePart === 3 ? 'part-highlight' : ''}`} style={{ transform: `translateX(${pointerX - 55}px)` }}><path d="M55 31 L41 57 H69 Z" fill={T.accent}/><path d="M55 50 V76" stroke={T.accent} strokeWidth="5" strokeLinecap="round"/></g>}
  </svg>;
};

const ThermometerSVG = ({ frame }) => {
  const ticks = [10, 15, 20, 25, 30];
  return <svg className="thermo-svg" viewBox="0 0 240 330" role="img" aria-label="10–30 °C">
    <rect x="18" y="16" width="204" height="298" rx="28" fill="#FFFFFF" stroke="rgba(23,59,82,.12)"/>
    <path d="M92 56 V248" stroke={T.navy} strokeWidth="28" strokeLinecap="round" opacity=".16"/>
    <path className={frame >= 4 ? 'mercury full' : frame >= 3 ? 'mercury warm' : 'mercury'} d="M92 248 V104" stroke={T.accent} strokeWidth="16" strokeLinecap="round"/>
    <circle cx="92" cy="260" r="28" fill={T.accent}/>
    <g className={frame >= 1 ? 'ticks-visible' : ''}>{ticks.map((value, index) => {
      const y = 238 - index * 40;
      return <g key={value} className="scale-tick" style={{ '--delay': `${index * 70}ms` }}><path d={`M112 ${y} H145`} stroke={T.cyan} strokeWidth="4" strokeLinecap="round"/><text x="158" y={y + 6}>{value}°</text></g>;
    })}</g>
    <text className={frame >= 4 ? 'thermo-value show' : 'thermo-value'} x="120" y="302" textAnchor="middle">25 °C</text>
  </svg>;
};

const FuelGaugeSVG = ({ frame = 2 }) => {
  const t = useT();
  const ticks = Array.from({ length: 7 }, (_, index) => 200 + index * 50);
  return <svg className="fuel-svg" viewBox="0 0 640 230" role="img" aria-label={t({ uz: "200 dan 500 litrgacha bo'lgan shkala", ru: 'Шкала от 200 до 500 литров', en: 'Scale from 200 to 500 litres' })}>
    <rect x="18" y="18" width="604" height="194" rx="28" fill="#FFFFFF" stroke="rgba(23,59,82,.12)"/>
    <path d="M95 166 A225 225 0 0 1 545 166" fill="none" stroke="rgba(23,59,82,.13)" strokeWidth="22" strokeLinecap="round"/>
    <path className={frame >= 1 ? 'gauge-fill show' : 'gauge-fill'} d="M95 166 A225 225 0 0 1 417 56" fill="none" stroke={T.cyan} strokeWidth="16" strokeLinecap="round"/>
    {ticks.map((value, index) => { const angle = Math.PI - index * (Math.PI / 6); const x1 = 320 + Math.cos(angle) * 220; const y1 = 170 - Math.sin(angle) * 150; const x2 = 320 + Math.cos(angle) * 194; const y2 = 170 - Math.sin(angle) * 132; return <g key={value}><path d={`M${x1} ${y1} L${x2} ${y2}`} stroke={T.navy} strokeWidth="5" strokeLinecap="round"/><text x={320 + Math.cos(angle) * 165} y={176 - Math.sin(angle) * 111} textAnchor="middle">{value}</text></g>; })}
    <g className="needle show"><path d="M320 170 L417 56" stroke={T.accent} strokeWidth="8" strokeLinecap="round"/><circle cx="320" cy="170" r="16" fill={T.accent}/></g>
    <text className={frame >= 2 ? 'fuel-value show' : 'fuel-value'} x="320" y="204" textAnchor="middle">{t({ uz: "400 litr", ru: '400 литров', en: '400 litres' })}</text>
  </svg>;
};

function ScaleChoicePanel({ picked, onPick, solved, correctIndex }) {
  return <section className="model-card scale-choice-grid scale-choice-list">{[{ label: 'A', intervals: 4 }, { label: 'B', intervals: 5 }, { label: 'C', intervals: 2 }].map((item, index) => <button type="button" className={`scale-choice ${picked === index ? 'picked' : ''} ${solved && index === correctIndex ? 'right' : ''} ${picked === index && picked !== correctIndex ? 'bad' : ''}`} key={item.label} aria-pressed={picked === index} onClick={() => onPick(index)}><b>{item.label}</b><ScaleSVG min={0} max={100} intervals={item.intervals} frame={3} allLabels/></button>)}</section>;
}

function ChoiceExercise({ screen, storedAnswer, onAnswer, onNext, onPrev, visual = null, bit = null, hideOptions = false, visualChoices = false }) {
  const t = useT(); const c = CONTENT[`s${screen}`]; const audio = useNarration(c.audio, screen);
  const [picked, setPicked] = useState(storedAnswer?.studentAnswerIndex ?? null); const [solved, setSolved] = useState(storedAnswer?.correct === true); const attempts = useRef(storedAnswer?.attempts ?? 0); const clean = useRef(storedAnswer?.firstTry ?? true);
  const [hintLevel, setHintLevel] = useState(storedAnswer && !storedAnswer.correct && storedAnswer.attempts >= 2 ? 2 : 0);
  const pick = (index) => {
    if (solved) return;
    attempts.current += 1; const ok = index === c.correctIndex; if (!ok) clean.current = false;
    const spokenFeedback = ok ? c.audio.on_correct : (Array.isArray(c.audio.on_wrong) ? c.audio.on_wrong[index] : c.audio.on_wrong);
    setPicked(index); setSolved(ok); setHintLevel(ok ? 0 : attempts.current >= 2 ? 2 : 1); playSfx(ok ? 'correct' : 'wrong'); audio.pushOneOff(t(spokenFeedback));
    onAnswer({ screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question), options: c.options.map(t), correctIndex: c.correctIndex, correctAnswer: t(c.options[c.correctIndex]), studentAnswerIndex: index, studentAnswer: t(c.options[index]), correct: ok, firstTry: ok && clean.current && attempts.current === 1, attempts: attempts.current, solved: ok });
  };
  const visualNode = visualChoices ? <ScaleChoicePanel picked={picked} onPick={pick} solved={solved} correctIndex={c.correctIndex}/> : typeof visual === 'function' ? visual({ frame: audio.frame, hintLevel, solved, t }) : visual;
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} activityDone={solved}><div className="stack"><Heading c={c} bit={bit}/>{visualNode && <div className={`exercise-model-wrap ${hintLevel >= 2 && !solved ? 'second-hint' : ''}`}>{visualNode}</div>}<section className="question"><h2>{t(c.question)}</h2>{!hideOptions && <Options values={c.options} picked={picked} onPick={pick} correctIndex={c.correctIndex} solved={solved}/>}<FeedbackBlock show={picked !== null} correct={solved} withBit>{picked !== null && <><span>{t(c.feedback[picked])}</span>{solved && <strong className="feedback-proof">{t(c.proof)}</strong>}</>}</FeedbackBlock></section></div></Stage>;
}

const BitFlightScale = ({ frame = 3 }) => {
  const t = useT();
  const marks = [0, 10, 20, 30, 40];
  return <div className="bit-flight-scale" data-g4-screen="hook" data-g4-role="hook-scene" role="img" aria-label={t({ uz: "Bit kemasi 0 dan 40 gacha bo'lgan shkalada 30 nuqtada turibdi", ru: 'Корабль Бита находится в точке 30 на шкале от 0 до 40', en: "Bit's ship is at point 30 on a scale from 0 to 40" })}>
    <span className="sr-only" data-g4-role="answer-card">{t({ uz: "Javobni tanlang", ru: 'Выберите ответ', en: 'Choose an answer' })}</span>
    <svg viewBox="0 0 620 150" aria-hidden="true">
      <path className={frame >= 0 ? 'flight-line drawn' : 'flight-line'} d="M48 105 H572"/>
      <g className={frame >= 1 ? 'flight-ticks visible' : 'flight-ticks'}>{marks.map((value, index) => { const x = 48 + index * 131; return <g key={value} style={{ '--delay': `${index * 90}ms` }}><path d={`M${x} 94 V116`}/><text x={x} y="139" textAnchor="middle">{value}</text></g>; })}</g>
      <g className="flight-ship visible" transform="translate(441 68)">
        <path className="flight-flame" d="M-39 10 L-68 1 L-43 -8 Z"/>
        <path className="flight-hull" d="M-46 -15 C-13 -34 31 -31 55 -7 L42 18 C12 29 -23 27 -49 12 Z"/>
        <path className="flight-wing" d="M-8 17 L14 42 L34 17 Z"/>
        <circle className="flight-window" cx="9" cy="-9" r="17"/>
        <circle className="flight-face" cx="9" cy="-9" r="12"/>
        <circle className="flight-eye" cx="4" cy="-11" r="2"/><circle className="flight-eye" cx="14" cy="-11" r="2"/>
        <path className="flight-smile" d="M4 -4 Q9 1 14 -4"/>
      </g>
    </svg>
  </div>;
};

function Screen0({ screen, onNext, hookAnswer, onHookAnswer }) {
  const t = useT(); const c = CONTENT.s0; const audio = useNarration(c.audio, screen); const picked = hookAnswer.studentAnswerIndex;
  const correct = picked === c.correctIndex;
  const pick = (index) => { if (correct) return; onHookAnswer(index, index === c.correctIndex); audio.pushOneOff(t(c.audio.on_pick[index])); };
  return <Stage screen={screen} audio={audio} onNext={onNext} activityDone={correct}><div className="stack hook-stack"><section className="hook-mission-frame"><div className="hook-bit"><BitSVG state={picked === null ? 'think' : correct ? 'nod' : 'awkward'}/></div><div className="hook-mission-copy"><span className="hook-kicker">{t(c.eyebrow)}</span><h1>{t(c.title)}</h1><p>{t(c.story)}</p><BitFlightScale frame={audio.frame}/></div></section><section className="hook-question"><h2>{t(c.question)}</h2><div className="hook-answer-frames"><Options values={c.options} picked={picked} onPick={pick} correctIndex={c.correctIndex} solved={correct}/></div><FeedbackBlock show={picked !== null} correct={correct} withBit bitState={correct ? 'nod' : 'awkward'}>{picked !== null && <><span>{t(c.feedback[picked])}</span>{correct && <strong className="feedback-proof">{t(c.proof)}</strong>}</>}</FeedbackBlock></section></div></Stage>;
}

function Screen1({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s1; const audio = useNarration(c.audio, screen); const [picked, setPicked] = useState(null);
  const values = ['4', '5', '20'];
  const pick = (index) => { setPicked(index); audio.pushOneOff(t(c.audio.feedback[index])); };
  const solved = picked === 1;
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} activityDone={solved}><div className="stack"><Heading c={c}/><section className="model-card slow-sequence"><div className="segment-bar">{Array.from({ length: 4 }, (_, index) => <i key={index} className={audio.frame >= 1 ? 'show' : ''}><b className={audio.frame >= 2 ? 'show' : ''}>{solved ? '5' : '?'}</b></i>)}</div><FormulaFlow slow frame={audio.frame} items={['40 − 20 = 20', t({ uz: "4 ta teng bo'linma", ru: '4 равных деления', en: '4 equal divisions' }), '20 ÷ 4', solved ? '5' : '?']}/></section><section className="question compact-question"><h2>{t(c.prompt)}</h2><Options values={values} picked={picked} onPick={pick} neutral/><FeedbackBlock show={picked !== null} correct={solved} withBit>{solved ? t({ uz: "To'g'ri: 20 ni 4 ga bo'lsak, 5.", ru: 'Верно: 20 разделить на 4 — 5.', en: 'Correct: 20 divided by 4 is 5.' }) : picked === 0 ? t({ uz: "4 — bo'linmalar soni. Har bir bo'linmadagi birliklarni toping.", ru: '4 — число делений. Найдите число единиц в каждом делении.', en: '4 is the number of divisions. Find how many units are in each division.' }) : t({ uz: "20 — butun oraliqning qiymati. Uni 4 ga bo'ling.", ru: '20 — значение всего промежутка. Разделите его на 4.', en: '20 is the value of the whole interval. Divide it by 4.' })}</FeedbackBlock></section></div></Stage>;
}

function Screen2({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s2; const audio = useNarration(c.audio, screen); const labels = [
    { uz: "Shkala chizig'i", ru: 'Линия шкалы', en: 'Scale line' }, { uz: "Belgilar", ru: 'Штрихи', en: 'Marks' }, { uz: "Teng oraliqlar — bo'linmalar", ru: 'Равные промежутки — деления', en: 'Equal gaps — divisions' }, { uz: "Ko'rsatkich", ru: 'Указатель', en: 'Pointer' },
  ];
  const [active, setActive] = useState(null); const [visited, setVisited] = useState([]); const highlightTimer = useRef(null);
  useEffect(() => () => { if (highlightTimer.current) window.clearTimeout(highlightTimer.current); }, []);
  const pickPart = (index) => {
    if (highlightTimer.current) window.clearTimeout(highlightTimer.current);
    setActive(index); setVisited((previous) => previous.includes(index) ? previous : [...previous, index]); audio.pushOneOff(t(c.tapFeedback[index]));
    highlightTimer.current = window.setTimeout(() => { setActive(null); highlightTimer.current = null; }, 3000);
  };
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} activityDone={visited.length === labels.length}><div className="stack"><Heading c={c}/><section className="model-card anatomy-card slow-sequence"><ScaleSVG min={20} max={40} intervals={4} pointer={35} frame={audio.frame} activePart={active} slow/><div className="anatomy-grid">{labels.map((label, index) => <button type="button" key={t(label)} aria-pressed={active === index} className={`${audio.frame >= index ? 'show' : ''} ${active === index ? 'active' : ''}`} onClick={() => pickPart(index)}><b>{index + 1}</b><span>{t(label)}</span></button>)}</div><FeedbackBlock show={active !== null} correct>{active !== null ? t(c.tapFeedback[active]) : ''}</FeedbackBlock></section></div></Stage>;
}

function Screen3({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s3; const audio = useNarration(c.audio, screen);
  const [marked, setMarked] = useState(0);
  const markDivisions = (count) => { setMarked(count); audio.pushOneOff(t(c.tapFeedback[count - 1])); };
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} activityDone={marked === 4}><div className="stack"><Heading c={c} bit="idea"/><section className="model-card discovery-card slow-sequence"><ScaleSVG min={100} max={200} intervals={4} frame={audio.frame} allLabels slow/><FormulaFlow slow frame={audio.frame} items={['100 → 200', '200 − 100 = 100', t({ uz: "4 ta bo'linma", ru: '4 деления', en: '4 divisions' }), t({ uz: "100 ÷ 4 = 25", ru: '100 ÷ 4 = 25' , en: "100 ÷ 4 = 25"})]}/><div className="division-taps" aria-label={t({ uz: "Bo'linmalar sonini belgilang", ru: 'Отметьте число делений', en: 'Mark the number of divisions' })}>{Array.from({ length: 4 }, (_, index) => <button type="button" key={index} aria-pressed={marked >= index + 1} className={marked >= index + 1 ? 'marked' : ''} onClick={() => markDivisions(index + 1)}><span>{index + 1}</span></button>)}</div><FeedbackBlock show={marked > 0} correct>{marked > 0 ? t(c.tapFeedback[marked - 1]) : ''}</FeedbackBlock></section></div></Stage>;
}

function Screen4({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s4; const audio = useNarration(c.audio, screen); const [choice, setChoice] = useState(null);
  const answers = [{ uz: "Belgilarni", ru: 'Штрихи', en: 'The marks' }, { uz: "Oraliqlarni", ru: 'Промежутки', en: 'The gaps' }];
  const pick = (index) => { setChoice(index); audio.pushOneOff(t(c.audio.feedback[index])); };
  const scalePart = audio.frame === 0 || audio.frame === 2 ? 1 : 2;
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} activityDone={choice === 1}><div className="stack"><Heading c={c} bit="happy"/><section className="model-card trap-card"><ScaleSVG min={0} max={40} intervals={4} frame={3} allLabels activePart={scalePart} slow/><div className="count-contrast">{[
    { text: t({ uz: "5 ta belgi", ru: '5 штрихов', en: '5 marks' }), className: '' },
    { text: t({ uz: "4 ta bo'linma", ru: '4 деления', en: '4 divisions' }), className: 'good' },
    { text: '40 ÷ 5 = 8?', className: 'wrong-formula' },
    { text: '40 ÷ 4 = 10', className: 'good result-formula' },
  ].map((item, index) => <div key={item.text} className={`${item.className} ${audio.frame >= index ? 'show' : ''} ${audio.frame === index ? 'narration-focus' : ''}`}>{item.text}</div>)}</div></section><section className="question compact-question"><h2>{t(c.prompt)}</h2><Options values={answers} picked={choice} onPick={pick} neutral/><FeedbackBlock show={choice !== null} correct={choice === 1} withBit>{choice === 1 ? t({ uz: "To'g'ri. Ikki qo'shni belgi orasidagi bo'linmalar sanaladi.", ru: 'Верно. Считают деления между соседними штрихами.', en: 'Correct. Count the divisions between neighbouring marks.' }) : t({ uz: "Belgilar soni bo'linmalar sonidan bittaga ko'p. Bo'linmalarni sanang.", ru: 'Штрихов на один больше, чем делений. Считайте деления.', en: 'There is one more mark than there are divisions. Count the divisions.' })}</FeedbackBlock></section></div></Stage>;
}

function Screen5({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s5; const audio = useNarration(c.audio, screen); const [manualPointer, setManualPointer] = useState(null);
  const narratedPointer = [20, 25, 30, 35][Math.min(audio.frame, 3)]; const pointer = manualPointer ?? narratedPointer;
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} activityDone={manualPointer !== null}><div className="stack"><Heading c={c}/><section className="model-card reading-card slow-sequence"><ScaleSVG min={20} max={40} intervals={4} pointer={pointer} frame={audio.frame} slow/><FormulaFlow slow frame={audio.frame} items={[t({ uz: "1 bo'linma = 5", ru: 'Цена деления = 5', en: '1 division = 5' }), '20 → 25 → 30 → 35', '20 + 3 × 5', '35']}/><div className="free-slider"><label htmlFor="scale-pointer">{t({ uz: "Ko'rsatkichni erkin suring", ru: 'Свободно перемещайте указатель', en: 'Move the pointer freely' })}</label><input id="scale-pointer" type="range" min="20" max="40" step="5" value={pointer} onChange={(event) => setManualPointer(Number(event.target.value))}/><output htmlFor="scale-pointer" aria-live="polite">{t({ uz: `Tanlangan qiymat: ${pointer}.`, ru: `Выбрано значение: ${pointer}.`, en: `Selected value: ${pointer}.` })}</output></div></section></div></Stage>;
}

function Screen6({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s6; const audio = useNarration(c.audio, screen); const [choice, setChoice] = useState(null);
  const pick = (index) => { setChoice(index); audio.pushOneOff(t(c.audio.feedback[index])); };
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} activityDone={choice === 1}><div className="stack"><Heading c={c}/><section className="model-card nonzero-card"><ScaleSVG min={120} max={180} intervals={3} pointer={160} frame={audio.frame} allLabels/><FormulaFlow frame={audio.frame} items={['120 → 180', '180 − 120 = 60', '60 ÷ 3 = 20', t({ uz: "Ko'rsatkich = 160", ru: 'Указатель = 160', en: 'Pointer = 160' })]}/></section><section className="question compact-question"><h2>{t(c.prompt)}</h2><Options values={c.options} picked={choice} onPick={pick} neutral/><FeedbackBlock show={choice !== null} correct={choice === 1} withBit>{choice !== null ? t(c.feedback[choice]) : ''}</FeedbackBlock></section></div></Stage>;
}

function Screen7({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s7; const audio = useNarration(c.audio, screen);
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} bit="point"/><section className="rule-card thermo-card"><ThermometerSVG frame={audio.frame}/><div className="thermo-copy"><div className={`rule-formula ${audio.frame >= 3 ? 'show' : ''}`}>{t({ uz: "Bitta bo'linma = (30 − 10) ÷ 4 = 5 °C", ru: 'Цена деления = (30 − 10) ÷ 4 = 5 °C', en: 'One division = (30 − 10) ÷ 4 = 5 °C' })}</div><div className={`rule-note ${audio.frame >= 4 ? 'show' : ''}`}>{t({ uz: "Gorizontal yoki vertikal — qoida bir xil.", ru: 'Горизонтальная или вертикальная — правило одно.', en: 'Horizontal or vertical — the rule is the same.' })}</div></div></section></div></Stage>;
}

function Screen8(props) { return <ChoiceExercise {...props} visual={<section className="model-card exercise-visual"><ScaleSVG min={0} max={60} intervals={6} frame={3} allLabels/></section>}/>; }
function Screen9(props) { return <ChoiceExercise {...props} visual={<section className="model-card exercise-visual"><ScaleSVG min={30} max={50} intervals={4} pointer={45} frame={3} labels={[30, '', '', '', 50]}/></section>}/>; }
function Screen10(props) { return <ChoiceExercise {...props} visual={<section className="model-card exercise-visual"><ScaleSVG min={100} max={160} intervals={3} frame={3} labels={[100, 120, '?', 160]}/></section>}/>; }
function Screen11(props) { return <ChoiceExercise {...props} hideOptions visualChoices/>; }
function Screen12(props) { return <ChoiceExercise {...props} bit="happy" visual={<section className="model-card error-visual"><ScaleSVG min={0} max={40} intervals={4} frame={3} allLabels/><div className="bit-equation">40 ÷ 5 = 8?</div></section>}/>; }
function Screen13(props) { return <ChoiceExercise {...props} visual={({ frame, solved, t }) => { const proofFrame = solved ? 2 : Math.min(frame, 1); return <section className="model-card fuel-card"><FuelGaugeSVG frame={proofFrame}/><div className="fuel-frame-proof"><div className={proofFrame >= 1 ? 'show' : ''}>{t({ uz: "(500 − 200) ÷ 6 = 50 litr", ru: '(500 − 200) ÷ 6 = 50 литров', en: '(500 − 200) ÷ 6 = 50 litres' })}</div><div className="show result">{solved ? t({ uz: "200 + 4 × 50 = 400 litr", ru: '200 + 4 × 50 = 400 литров', en: '200 + 4 × 50 = 400 litres' }) : t({ uz: "200 + 4 × 50 = ? litr", ru: '200 + 4 × 50 = ? литров', en: '200 + 4 × 50 = ? litres' })}</div></div></section>; }}/>; }

function G4FinalTitleReward({ finalFrameReached, completed = false, muted = false, title, firstTry, total }) {
  const t = useT();
  const [reducedMotion, setReducedMotion] = useState(typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  const [unlocked, setUnlocked] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const frameRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, []);

  const ready = finalFrameReached || completed || muted || reducedMotion;
  const claimTitle = () => {
    if (!ready || unlocked || typeof window === 'undefined') return;
    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;
      setUnlocked(true);
      setShowOverlay(true);
      timerRef.current = window.setTimeout(() => {
        timerRef.current = null;
        setShowOverlay(false);
      }, 3900);
    });
  };

  useEffect(() => () => {
    if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
  }, []);

  const localizedTitle = t(title);
  const ariaLabel = t({ uz: `Unvon: ${localizedTitle}`, ru: `Звание: ${localizedTitle}`, en: `Title: ${localizedTitle}` });
  return <>
    {showOverlay && typeof document !== 'undefined' && createPortal(
      <div className="g4-title-reveal-overlay" role="status" aria-live="assertive" aria-atomic="true" aria-label={ariaLabel}>
        <div className="g4-title-reveal-card">
          <div className="g4-title-reveal-rays" aria-hidden="true" />
          <div className="g4-title-reveal-confetti" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <i key={index} style={{ left: `${3 + index * 5.35}%`, animationDelay: `${(index % 7) * -0.21}s` }} />)}</div>
          <div className="g4-title-reveal-medal" aria-hidden="true">★</div>
          <h2 className="g4-title-reveal-title">{localizedTitle}</h2>
        </div>
      </div>,
      document.body,
    )}
    {unlocked ? <aside className="g4-title-card g4-title-card-compact" role="status" aria-live="polite" aria-atomic="true">
      <div className="g4-title-card-confetti" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i key={index} />)}</div>
      <div className="g4-title-card-bit"><BitSVG state="happy" /></div>
      <div className="g4-title-card-medal" aria-hidden="true">★</div>
      <span className="g4-title-card-kicker">{t({ uz: "UNVON OLINDI", ru: 'ЗВАНИЕ ПОЛУЧЕНО' , en: "TITLE EARNED"})}</span>
      <h2 className="g4-title-card-title">{localizedTitle}</h2>
      <div className="g4-title-card-score"><strong>{firstTry}/{total}</strong><span>{t({ uz: "birinchi urinishda", ru: 'с первой попытки', en: 'on the first try' })}</span></div>
    </aside> : <button type="button" className="g4-title-claim" disabled={!ready} onClick={claimTitle} aria-label={t({ uz: "Shkala kalibratori unvonini olish", ru: 'Получить звание Калибровщик шкал', en: 'Claim the Scale Calibrator title' })}><span className="g4-title-claim-medal" aria-hidden="true">★</span><span><small>{ready ? t({ uz: "UNVON TAYYOR", ru: 'ЗВАНИЕ ГОТОВО', en: 'TITLE READY' }) : t({ uz: "YAKUNIY TUSHUNTIRISH", ru: 'ФИНАЛЬНОЕ ОБЪЯСНЕНИЕ', en: 'FINAL EXPLANATION' })}</small><strong>{ready ? t({ uz: "Unvonni olish", ru: 'Получить звание' , en: "Claim title"}) : t({ uz: "Tushuntirishni tinglang", ru: 'Прослушайте объяснение', en: 'Listen to the explanation' })}</strong></span><span className="g4-title-claim-bit"><BitSVG state={ready ? 'happy' : 'think'}/></span></button>}
  </>;
}

function G4TitleReveal({ active, title, onComplete }) {
  useEffect(() => {
    if (!active || typeof window === 'undefined') return undefined;
    const timer = window.setTimeout(onComplete, window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 120 : 3200);
    return () => window.clearTimeout(timer);
  }, [active, onComplete]);
  if (!active) return null;
  return <div className="g4-title-reveal-overlay" role="status" aria-live="assertive"><div className="g4-title-reveal-card"><div className="g4-title-reveal-medal">★</div><h2 className="g4-title-reveal-title">{title}</h2></div></div>;
}

function G4TitleCard({ title, firstTry, total, canFinish }) {
  return <aside className="g4-title-card" data-g4-role="title-card" data-can-finish={canFinish}><div className="g4-title-card-medal">★</div><span className="g4-title-card-kicker">TITLE EARNED</span><h2 className="g4-title-card-title">{title}</h2><div className="g4-title-card-score"><strong>{firstTry}/{total}</strong></div></aside>;
}

function ContractFinalReward({ title, firstTry, total }) {
  const t = useT(); const { markActivity, finalRewardState, setFinalRewardState } = useContext(ActivityContext); const { reflectionChoice, titleState } = finalRewardState;
  const setReflectionChoice = useCallback((value) => setFinalRewardState((previous) => ({ ...previous, reflectionChoice: value })), [setFinalRewardState]);
  const setTitleState = useCallback((value) => setFinalRewardState((previous) => ({ ...previous, titleState: value })), [setFinalRewardState]);
  const legacyContract = Boolean(G4FinalTitleReward);
  const choices = [{ uz: "Bo'linma qiymatini topaman", ru: 'Нахожу цену деления', en: 'I can find one division' }, { uz: "Oraliqlarni sanayman", ru: 'Считаю промежутки', en: 'I count the gaps' }];
  const claimTitle = () => { if (reflectionChoice === null) return; setTitleState('revealing'); };
  const completeReveal = useCallback(() => { setTitleState('claimed'); markActivity(14, reflectionChoice); }, [markActivity, reflectionChoice, setTitleState]);
  const localizedTitle = t(title);
  return <div className="contract-final-reward" data-legacy-contract={legacyContract}>{titleState !== 'claimed' && <div className="final-reflection" data-g4-role="reflection">{choices.map((choice, index) => <button type="button" key={t(choice)} className={reflectionChoice === index ? 'selected' : ''} onClick={() => setReflectionChoice(index)}>{t(choice)}</button>)}</div>}{titleState === 'unclaimed' && <button type="button" className="g4-title-claim" disabled={reflectionChoice === null} onClick={claimTitle}><span>★</span><strong>{t({ uz: "Unvonni olish", ru: 'Получить звание', en: 'Claim title' })}</strong></button>}<G4TitleReveal active={titleState === 'revealing'} title={localizedTitle} onComplete={completeReveal}/>{titleState === 'claimed' && <G4TitleCard title={localizedTitle} firstTry={firstTry} total={total} canFinish={titleState === 'claimed'}/>}</div>;
}

const FINAL_AWARD = { uz: "Shkala kalibratori", ru: 'Калибровщик шкал', en: 'Scale Calibrator' };

const FinaleReward = ({ answers = [] }) => {
  const scored = SCREEN_META.map((item, index) => item.scored ? index : null).filter((index) => index !== null);
  const total = scored.length;
  const firstTry = scored.filter((index) => answers[index]?.firstTry === true).length;
  return <ContractFinalReward title={FINAL_AWARD} firstTry={firstTry} total={total} />;
};

function Screen14({ screen, answers, onPrev, finishLesson }) {
  const t = useT(); const c = CONTENT.s14; const audio = useNarration(c.audio, screen); const frame = audio.frame; const complete = frame >= 4;
  const equations = ['40 − 20 = 20', '20 ÷ 4 = 5', '20 + 3 × 5 = 35'];
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={finishLesson} finish><div className="stack"><section className="finale-heading"><span>◆ {t({ uz: "YAKUNIY BOSQICH", ru: 'ФИНАЛЬНЫЙ ЭТАП' , en: "FINAL STAGE"})}</span><h1>{t(c.title)}</h1><p>{t({ uz: "Transport sensori aniq qiymatni ko'rsatmoqda.", ru: 'Транспортный датчик показывает точное значение.', en: 'The vehicle gauge is showing an exact value.' })}</p></section><section className="finale-main"><div className="finale-payoff"><small>{t({ uz: "BOSHLANG'ICH MISSIYA YECHIMI", ru: 'РЕШЕНИЕ СТАРТОВОЙ МИССИИ', en: 'STARTING MISSION SOLUTION' })}</small><ScaleSVG min={20} max={40} intervals={4} pointer={35} frame={3}/><div className="finale-hook-answer show">{t({ uz: "Ko'rsatkich", ru: 'Указатель', en: 'Pointer' })}: <b>35</b></div></div><div className="finale-equations">{equations.map((equation, index) => <div className={`finale-equation ${frame >= index + 1 ? 'show' : ''}`} key={equation}><b>{index + 1}</b><strong>{equation}</strong></div>)}<div className={`sensor-status ${frame >= 3 ? 'show' : ''}`}>{t({ uz: "SENSOR SOZLANDI", ru: 'ДАТЧИК НАСТРОЕН', en: 'GAUGE CALIBRATED' })}</div></div></section><section className="finale-bottom"><div className={`finale-bridge ${complete ? 'show' : ''}`}><small>{t({ uz: "KEYINGI MAVZU", ru: 'СЛЕДУЮЩАЯ ТЕМА' , en: "NEXT TOPIC"})}</small><strong>{t({ uz: "Teng qismlar va kasrlar", ru: 'Равные части и дроби', en: 'Equal parts and fractions' })}</strong></div><FinaleReward answers={answers} complete={complete} audio={audio}/></section></div></Stage>;
}

const SCREENS = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14];

export default function Grade4Dars17({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished, previewMode }) {
  const normalizedLang = normalizeLang(langProp); const preview = previewMode ?? (langProp === undefined || langProp === null); const [previewLang, setPreviewLang] = useState(normalizedLang); const lang = preview ? previewLang : normalizedLang;
  configureLesson({ ttsApiBase: ttsApiBase || '', voiceGender: voiceGender || 'f', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', previewMode: preview });
  const [current, setCurrent] = useState(0); const [answers, setAnswers] = useState([]); const [activityState, setActivityState] = useState({}); const [finalRewardState, setFinalRewardState] = useState({ reflectionChoice: null, titleState: 'unclaimed' }); const [hookAnswer, setHookAnswer] = useState({ studentAnswerIndex: null, attempts: 0, firstTry: null, correct: false });
  // eslint-disable-next-line react-hooks/purity -- lesson duration starts when this component mounts
  const started = useRef(Date.now()); const finished = useRef(false);
  const markActivity = useCallback((screen, value = true) => setActivityState((previous) => Object.prototype.hasOwnProperty.call(previous, screen) && previous[screen] === value ? previous : { ...previous, [screen]: value }), []);
  const recordHookAnswer = useCallback((studentAnswerIndex, correct) => setHookAnswer((previous) => { const attempts = previous.attempts + 1; return { studentAnswerIndex, attempts, correct, firstTry: previous.firstTry === false ? false : correct && attempts === 1 }; }), []);
  const recordAnswer = useCallback((answer) => { setAnswers((previous) => { const next = [...previous]; const old = previous[answer.screenIdx]; next[answer.screenIdx] = { ...answer, firstTry: old?.firstTry === false ? false : answer.firstTry }; return next; }); if (!SCREEN_META[answer.screenIdx].scored || answer.correct) markActivity(answer.screenIdx, answer.studentAnswerIndex ?? true); }, [markActivity]);
  const finishLesson = useCallback(() => { if (finished.current) return; finished.current = true; const scored = SCREEN_META.map((meta, index) => meta.scored ? index : null).filter((index) => index !== null); const firstTryCorrect = scored.filter((index) => answers[index]?.firstTry === true).length; const payload = { lessonId: LESSON_META.lessonId, lessonTitle: LESSON_META.lessonTitle[lang], studentName: studentName || null, durationSec: Math.floor((Date.now() - started.current) / 1000), totalQuestions: scored.length, correctAnswers: firstTryCorrect, scorePercent: Math.round(firstTryCorrect / scored.length * 100), finalScore: firstTryCorrect, finalTotal: scored.length, passed: firstTryCorrect / scored.length >= 0.6, firstTryStats: { total: scored.length, firstTryCorrect }, attemptsTotal: scored.reduce((sum, index) => sum + (answers[index]?.attempts ?? 0), 0), skillTags: LESSON_META.skillTags, answers: answers.filter(Boolean) }; if (onFinished) onFinished(payload); else console.log('[Grade4 Dars17 preview]', payload); }, [answers, lang, onFinished, studentName]);
  const Current = SCREENS[current];
  return <LangContext.Provider value={lang}><ActivityContext.Provider value={{ activityState, markActivity, finalRewardState, setFinalRewardState }}><style>{STYLES}</style><div className={`lesson-root ${preview ? 'lesson-root-preview' : ''}`}>{preview && <div className="preview-language" aria-label={{ uz: "Ko'rib chiqish tili", ru: 'Язык предпросмотра', en: 'Preview language' }[lang]}>{SUPPORTED_LANGS.map((code) => <button type="button" key={code} className={previewLang === code ? 'preview-active' : ''} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>)}</div>}<Current key={current} screen={current} storedAnswer={answers[current]} answers={answers} hookAnswer={hookAnswer} onHookAnswer={recordHookAnswer} onAnswer={recordAnswer} onPrev={() => setCurrent((value) => Math.max(0, value - 1))} onNext={() => setCurrent((value) => Math.min(TOTAL_SCREENS - 1, value + 1))} finishLesson={finishLesson}/></div></ActivityContext.Provider></LangContext.Provider>;
}

const STYLES = `
.g4-title-card-placeholder{width:100%;min-height:116px}
.g4-title-claim{position:relative;isolation:isolate;width:100%;min-height:116px;padding:12px 82px 12px 68px;border:0;border-radius:17px;display:grid;grid-template-columns:1fr auto;align-items:center;gap:10px;overflow:hidden;color:#fff;background:radial-gradient(circle at 82% 20%,rgba(255,194,60,.28),transparent 30%),linear-gradient(135deg,#173B52,#0E6978);box-shadow:0 22px 44px -27px rgba(22,143,163,.85);text-align:left;cursor:pointer;transition:.28s ease}.g4-title-claim:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 26px 48px -25px rgba(22,143,163,.9)}.g4-title-claim:disabled{cursor:default;filter:saturate(.55);opacity:.72}.g4-title-claim>span:nth-child(2){display:grid;gap:5px}.g4-title-claim small{color:#A8EAF0;font:900 9px/1.2 'JetBrains Mono',monospace;letter-spacing:.12em}.g4-title-claim strong{font:750 clamp(16px,2.2vw,21px)/1.08 'Source Serif 4',Georgia,serif}.g4-title-claim-medal{position:absolute;left:12px;top:50%;width:43px;height:43px;border:3px solid rgba(255,255,255,.58);border-radius:50%;display:grid;place-items:center;transform:translateY(-50%);color:#5A3A00;background:linear-gradient(145deg,#FFE284,#FFC23C);font-size:19px}.g4-title-claim-bit{position:absolute;right:3px;bottom:1px;width:72px;height:90px}.g4-title-claim-bit .g1-char{width:100%;height:100%}
.g4-title-card{position:relative;isolation:isolate;width:100%;min-height:116px;margin:0;padding:12px 82px 11px 67px;border-radius:17px;display:flex;flex-direction:column;justify-content:center;gap:4px;overflow:hidden;color:#FFF;background:radial-gradient(circle at 82% 20%,rgba(255,194,60,.26),transparent 30%),linear-gradient(135deg,#173B52,#0E6978);box-shadow:0 28px 58px -27px rgba(22,143,163,.8);transform:translateY(-2px)}
.g4-title-card-medal{position:absolute;left:11px;top:50%;width:44px;height:44px;border:3px solid rgba(255,255,255,.58);border-radius:50%;display:grid;place-items:center;transform:translateY(-50%);color:#5A3A00;background:linear-gradient(145deg,#FFE284,#FFC23C);box-shadow:0 0 0 8px rgba(255,255,255,.08),0 15px 30px -15px rgba(0,0,0,.6);font-size:19px;z-index:2}
.g4-title-card-bit{position:absolute;right:3px;bottom:2px;width:72px;height:90px;z-index:2;animation:g4-title-card-bit-float 2.8s ease-in-out 1 both}.g4-title-card-bit>svg,.g4-title-card-bit .bit,.g4-title-card-bit .g1-char{width:100%;height:100%}
.g4-title-card-kicker{position:relative;color:#A8EAF0;font:900 10px/1.2 'JetBrains Mono',monospace;letter-spacing:.13em;z-index:2}.g4-title-card-title{position:relative;margin:0!important;font:750 clamp(16px,2.2vw,21px)/1.05 'Source Serif 4',Georgia,serif;z-index:2}.g4-title-card-score{position:relative;align-self:flex-start;margin-top:5px;padding:5px 9px;border-radius:10px;display:flex;align-items:center;gap:7px;background:rgba(255,255,255,.10);z-index:2}.g4-title-card-score strong{color:#FFE284;font-family:'JetBrains Mono',monospace}.g4-title-card-score span{color:rgba(255,255,255,.72);font-size:9px}
.g4-title-card-confetti{position:absolute;inset:0;pointer-events:none}.g4-title-card-confetti i{position:absolute;top:-16px;width:7px;height:12px;border-radius:2px;animation:g4-title-card-fall 2.4s linear 2 both}.g4-title-card-confetti i:nth-child(4n+1){background:#FFC23C}.g4-title-card-confetti i:nth-child(4n+2){background:#FF5B35}.g4-title-card-confetti i:nth-child(4n+3){background:#77E1EA}.g4-title-card-confetti i:nth-child(4n){background:#95C93D}.g4-title-card-confetti i:nth-child(1){left:8%;animation-delay:-.3s}.g4-title-card-confetti i:nth-child(2){left:17%;animation-delay:-1.1s}.g4-title-card-confetti i:nth-child(3){left:29%;animation-delay:-.7s}.g4-title-card-confetti i:nth-child(4){left:41%;animation-delay:-1.7s}.g4-title-card-confetti i:nth-child(5){left:52%;animation-delay:-.2s}.g4-title-card-confetti i:nth-child(6){left:63%;animation-delay:-1.3s}.g4-title-card-confetti i:nth-child(7){left:73%;animation-delay:-.8s}.g4-title-card-confetti i:nth-child(8){left:84%;animation-delay:-1.9s}.g4-title-card-confetti i:nth-child(9){left:12%;animation-delay:-2s}.g4-title-card-confetti i:nth-child(10){left:36%;animation-delay:-1.4s}.g4-title-card-confetti i:nth-child(11){left:68%;animation-delay:-.5s}.g4-title-card-confetti i:nth-child(12){left:91%;animation-delay:-1.6s}
.g4-title-reveal-overlay{position:fixed;inset:0;z-index:120;padding:0;display:grid;place-items:center;overflow:hidden;overscroll-behavior:contain;pointer-events:none;background:rgba(8,13,24,.64);backdrop-filter:blur(2px) saturate(.78);animation:g4-title-reveal-life 3.8s ease both}.g4-title-reveal-card{position:relative;isolation:isolate;width:100%;min-height:100dvh;padding:36px 24px;border:0;border-radius:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;overflow:hidden;color:#FFF;text-align:center;background:radial-gradient(circle at 50% 50%,rgba(255,214,80,.17),transparent 31%)}.g4-title-reveal-card::after{content:'';position:absolute;z-index:0;top:50%;left:50%;width:min(440px,82vw);height:min(440px,82vw);border-radius:50%;background:radial-gradient(circle,rgba(255,222,105,.17),transparent 68%);transform:translate(-50%,-50%)}
.g4-title-reveal-rays{position:absolute;z-index:0;top:50%;left:50%;width:160vmax;height:160vmax;border-radius:50%;opacity:.28;background:repeating-conic-gradient(from -4deg,rgba(255,218,91,.88) 0 8deg,transparent 8deg 20deg);transform:translate(-50%,-50%);animation:g4-title-reveal-rays-in .8s cubic-bezier(.16,1,.3,1) both,g4-title-reveal-rays-turn 26s linear .8s 1 both}.g4-title-reveal-medal{position:absolute;top:50%;left:50%;z-index:2;width:112px;height:112px;border:6px solid rgba(255,255,255,.72);border-radius:50%;display:grid;place-items:center;color:#653C00;background:linear-gradient(145deg,#FFF2A0,#FFC13B);box-shadow:0 0 0 13px rgba(255,255,255,.09),0 0 54px 10px rgba(255,204,63,.38),0 22px 38px -18px rgba(0,0,0,.7);font-size:52px;animation:g4-title-reveal-medal-in 1s cubic-bezier(.16,1,.3,1) .15s both}.g4-title-reveal-title{position:absolute;top:calc(50% + 82px);left:50%;z-index:2;width:min(680px,calc(100vw - 48px));margin:0!important;font:750 clamp(34px,5vw,58px)/1.02 'Source Serif 4',Georgia,serif;text-shadow:0 4px 24px rgba(0,0,0,.72);transform:translateX(-50%);animation:g4-title-reveal-title-in .7s ease .52s both}
.g4-title-reveal-confetti{position:absolute;inset:0;pointer-events:none}.g4-title-reveal-confetti i{position:absolute;top:-20px;width:8px;height:14px;border-radius:2px;background:#FFE284;animation:g4-title-reveal-fall 2.4s linear 2 both}.g4-title-reveal-confetti i:nth-child(3n+2){background:#FF7050}.g4-title-reveal-confetti i:nth-child(3n){background:#77E1EA}
@keyframes g4-title-card-bit-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}@keyframes g4-title-card-fall{to{transform:translateY(230px) rotate(460deg)}}@keyframes g4-title-reveal-life{0%{opacity:0}12%,84%{opacity:1}100%{opacity:0}}@keyframes g4-title-reveal-medal-in{from{opacity:0;transform:translate(-50%,-50%) scale(.25) rotate(-25deg)}to{opacity:1;transform:translate(-50%,-50%) scale(1) rotate(0)}}@keyframes g4-title-reveal-title-in{from{opacity:0;transform:translate(-50%,14px)}to{opacity:1;transform:translate(-50%,0)}}@keyframes g4-title-reveal-rays-in{from{opacity:0;transform:translate(-50%,-50%) scale(.5)}to{opacity:.28;transform:translate(-50%,-50%) scale(1)}}@keyframes g4-title-reveal-rays-turn{from{transform:translate(-50%,-50%) rotate(0)}to{transform:translate(-50%,-50%) rotate(360deg)}}@keyframes g4-title-reveal-fall{to{transform:translateY(470px) rotate(560deg)}}
@media(max-width:639.98px){.g4-title-card-placeholder{min-height:88px}.g4-title-claim,.g4-title-card{min-height:88px;padding:9px 59px 8px 51px;border-radius:14px}.g4-title-claim-medal,.g4-title-card-medal{left:8px;width:34px;height:34px;font-size:14px}.g4-title-claim-bit,.g4-title-card-bit{width:57px;height:71px}.g4-title-claim strong,.g4-title-card-title{font-size:14px}.g4-title-reveal-card{min-height:100dvh;padding:24px 18px}.g4-title-reveal-medal{width:88px;height:88px;border-width:5px;font-size:40px}.g4-title-reveal-title{top:calc(50% + 62px);font-size:29px}}
.contract-final-reward{width:100%;min-width:0;min-height:116px;display:grid;align-content:center;gap:6px}.final-reflection{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px}.final-reflection button,.g4-title-claim{min-width:44px;min-height:44px;padding:5px 7px;border:0;border-radius:11px;cursor:pointer;color:${T.navy};background:${T.cyanSoft};font-size:9px;font-weight:900;line-height:1.2}.final-reflection button.selected{color:#fff;background:${T.success}}.g4-title-claim{width:100%;display:flex;align-items:center;justify-content:center;gap:7px;color:#fff;background:${T.accent}}.g4-title-claim:disabled{opacity:.42;cursor:not-allowed}
@media(prefers-reduced-motion:reduce){.g4-title-card,.g4-title-card-bit,.g4-title-reveal-overlay,.g4-title-reveal-rays,.g4-title-reveal-medal,.g4-title-reveal-title{animation:none!important}.g4-title-card{opacity:1;transform:none!important}.g4-title-card-confetti,.g4-title-reveal-confetti{display:none}.g4-title-reveal-overlay{opacity:1}.g4-title-reveal-rays{opacity:.28;transform:translate(-50%,-50%)}.g4-title-reveal-medal{opacity:1;transform:translate(-50%,-50%)}.g4-title-reveal-title{opacity:1;transform:translateX(-50%)}}
html:has(.lesson-root),body:has(.lesson-root),#root:has(.lesson-root),.lesson-page:has(.lesson-root),.lesson-frame:has(.lesson-root){width:100%;height:100%;min-height:0!important;margin:0;overflow:hidden!important;overscroll-behavior:none}
.lesson-root,.lesson-root *{box-sizing:border-box}.lesson-root h1,.lesson-root h2,.lesson-root h3,.lesson-root h4,.lesson-root h5,.lesson-root h6,.lesson-root p,.lesson-root ul,.lesson-root ol{margin:0}.lesson-root button,.lesson-root input{font:inherit}
.lesson-root{position:fixed;inset:0;width:100%;min-height:100dvh;color:${T.ink};background:radial-gradient(circle at 88% 9%,rgba(22,143,163,.11),transparent 25%),linear-gradient(145deg,#F7F8F4,#EEF3F1);font-family:'Manrope',system-ui,sans-serif}
.lesson-root button:focus-visible,.lesson-root input:focus-visible{outline:3px solid rgba(22,143,163,.42);outline-offset:3px}
.stage{width:min(936px,100%);height:100dvh;margin:0 auto;display:flex;flex-direction:column;overflow:hidden}.stage-header{flex-shrink:0;padding-top:10px;padding-bottom:8px;background:rgba(247,248,244,.88);backdrop-filter:blur(14px);z-index:5}.progress-track{width:100%;height:6px;margin-bottom:10px;border-radius:999px;background:rgba(80,97,109,.16);overflow:hidden}.progress-fill{height:100%;border-radius:inherit;background:linear-gradient(90deg,${T.cyan},${T.accent});box-shadow:0 0 12px rgba(255,91,53,.42);transition:width .45s ease}.stage-chrome{min-width:0;display:flex;justify-content:space-between;align-items:center;gap:12px}.chrome-title,.chrome-actions,.audio-controls{display:flex;align-items:center;gap:9px}.chrome-title{min-width:0;overflow:hidden;color:${T.ink2};font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}.chrome-title>span:last-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.chrome-actions{flex:none}.status-dot{width:8px;height:8px;flex:none;border-radius:50%;background:${T.accent};box-shadow:0 0 10px rgba(255,91,53,.65)}.screen-type{padding:4px 8px;border-radius:999px;color:${T.cyan};background:${T.cyanSoft};font-size:10px;font-weight:800}.screen-count{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700}.icon-btn{width:44px;height:44px;padding:0;border:0;border-radius:12px;color:${T.ink2};background:rgba(255,255,255,.75);cursor:pointer;box-shadow:0 4px 12px -7px rgba(${T.shadowBase},.3)}
.stage-content{flex:1 1 auto;min-height:0;padding-top:10px;padding-bottom:16px;overflow:hidden}.stage-nav{flex:0 0 auto;min-height:72px;display:flex;align-items:center;justify-content:space-between;gap:12px;background:rgba(245,245,240,.95)}.btn-white-accent,.btn-ghost{min-width:128px;min-height:50px;padding:0 18px;border:0;border-radius:15px;cursor:pointer;font-weight:900}.btn-white-accent{color:${T.accent};background:#fff;box-shadow:0 12px 24px -17px rgba(255,91,53,.8)}.btn-white-accent:hover:not(:disabled){color:#fff;background:${T.accent}}.btn-ghost{color:${T.ink2};background:transparent}.btn-ghost:hover{background:#fff;box-shadow:0 10px 20px -16px rgba(${T.shadowBase},.5)}
.stack{display:grid;gap:14px;animation:page-in .5s cubic-bezier(.16,1,.3,1) both}.heading{min-height:78px;display:flex;align-items:center;justify-content:space-between;gap:16px}.heading>div>span{color:${T.cyan};font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.heading h1{margin-top:4px!important;font:750 clamp(25px,4vw,38px)/1.06 'Source Serif 4',Georgia,serif}.heading .g1-char{width:78px;height:98px;flex:0 0 auto;overflow:visible;filter:drop-shadow(0 9px 11px rgba(23,59,82,.2))}
.question,.model-card,.rule-card{padding:18px;border-radius:22px;background:rgba(255,255,255,.9);box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.48)}.question{display:grid;gap:13px}.compact-question{padding:14px 18px}.question h2{font:720 clamp(17px,2.5vw,22px)/1.25 'Source Serif 4',Georgia,serif}.options{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.option{min-height:62px;padding:10px;border:0;border-radius:16px;display:grid;grid-template-columns:28px 1fr;align-items:center;gap:8px;color:${T.ink};background:#F8F8F4;text-align:left;cursor:pointer;box-shadow:0 10px 22px -20px rgba(${T.shadowBase},.46);transition:.25s ease}.option>b{width:27px;height:27px;border-radius:9px;display:grid;place-items:center;color:${T.cyan};background:${T.cyanSoft};font:900 11px 'JetBrains Mono',monospace}.option.picked{transform:translateY(-2px);background:${T.accentSoft};box-shadow:inset 0 0 0 2px rgba(255,91,53,.27)}.option.right{background:${T.successSoft};box-shadow:inset 0 0 0 2px rgba(34,122,83,.25)}.option.bad{background:${T.warnSoft};box-shadow:inset 0 0 0 2px rgba(169,111,19,.25)}
.feedback{min-height:58px;padding:13px 15px;border-radius:16px;display:grid;grid-template-columns:28px minmax(0,1fr);gap:10px;align-items:center;visibility:hidden;opacity:0;transform:translateY(7px)}.feedback.open{visibility:visible;opacity:1;transform:none;transition:.35s ease}.feedback.correct{background:linear-gradient(115deg,#DDF3E6,#F2FBF6);box-shadow:inset 5px 0 ${T.success},0 12px 25px -21px rgba(34,122,83,.75)}.feedback.wrong{background:linear-gradient(115deg,#FFEBC4,#FFF8E8);box-shadow:inset 5px 0 ${T.warn},0 12px 25px -21px rgba(169,111,19,.72)}.feedback>b{font-size:18px}.feedback.with-bit{min-height:74px;grid-template-columns:58px minmax(0,1fr);padding:10px 16px 10px 10px}.feedback-bit{width:54px;height:66px;align-self:center}.feedback-bit .g1-char{width:100%;height:100%}.feedback-content{min-width:0;font-size:15px;font-weight:750;line-height:1.48}.feedback-proof{display:block;margin-top:8px;padding-top:8px;border-top:1px solid rgba(34,122,83,.2);color:${T.success};font:900 15px/1.35 'JetBrains Mono',monospace}.proof{padding:12px;border-radius:14px;color:${T.success};background:${T.successSoft};text-align:center;font:900 15px 'JetBrains Mono',monospace;animation:proof-in .32s ease both}.caption{position:static;bottom:4px;margin-top:12px;padding:9px 13px;border-radius:13px;color:#fff;background:rgba(23,59,82,.94);font-size:12px;line-height:1.4;z-index:3}
.mission-panel{position:relative;padding-top:29px;background:linear-gradient(145deg,#153B50,#0B2232)}.mission-panel .scale-svg>rect:first-child{fill:rgba(255,255,255,.96)}.city-label{position:absolute;top:10px;left:18px;color:#9DE3E7;font:900 9px 'JetBrains Mono',monospace;letter-spacing:.12em}.scale-svg{display:block;width:100%;height:min(190px,24vh);overflow:visible}.scale-line{stroke-dasharray:520;stroke-dashoffset:520;transition:stroke-dashoffset .62s ease,stroke .28s ease,filter .28s ease}.scale-line.drawn{stroke-dashoffset:0}.scale-slow .scale-line{transition-duration:1.15s}.scale-tick{opacity:0;transform:translateY(5px);transition:.62s ease var(--delay)}.scale-slow .scale-tick{transition-duration:1s}.ticks-visible .scale-tick{opacity:1;transform:none}.scale-tick text,.thermo-svg text,.fuel-svg text{fill:${T.navy};font:900 15px 'JetBrains Mono',monospace}.scale-pointer{opacity:0;transform-origin:55px 62px;transition:opacity .48s ease,transform .58s cubic-bezier(.16,1,.3,1)}.scale-slow .scale-pointer{transition-duration:.9s}.scale-pointer.pointer-visible{opacity:1}.scale-divisions rect{fill:${T.accent};opacity:0;pointer-events:none}.scale-divisions.part-highlight rect{animation:division-spotlight 3s ease both}.scale-line.part-highlight{animation:line-spotlight 3s ease both}.scale-tick.part-highlight path{animation:tick-spotlight 3s ease both}.scale-pointer.part-highlight{filter:drop-shadow(0 0 9px rgba(255,91,53,.95));animation:pointer-spotlight 3s ease both}.exercise-visual .scale-svg,.error-visual .scale-svg{height:min(160px,21vh)}
.stage-hook{background:radial-gradient(circle at 88% 8%,rgba(22,143,163,.14),transparent 27%),linear-gradient(145deg,#F2FAFA,#E5F5F6)}.stage-hook .stage-header{background:rgba(239,249,249,.9)}.stage-hook .stage-nav{background:rgba(229,245,246,.94)}.stage-hook .stage-content{overflow:hidden}.hook-stack{gap:11px}.hook-mission-frame{min-height:260px;padding:17px 20px 14px;border:1px solid rgba(128,225,232,.16);border-radius:24px;display:grid;grid-template-columns:116px minmax(0,1fr);align-items:center;gap:14px;overflow:hidden;color:#fff;background:radial-gradient(circle at 78% 22%,rgba(41,190,201,.2),transparent 31%),linear-gradient(145deg,#153B50,#0B2232);box-shadow:inset 0 1px rgba(255,255,255,.08),0 22px 42px -28px rgba(11,34,50,.85)}.hook-bit{width:108px;height:136px;align-self:center;filter:drop-shadow(0 15px 18px rgba(0,0,0,.28))}.hook-bit .g1-char{width:100%;height:100%;overflow:visible}.hook-mission-copy{min-width:0;display:grid;gap:5px;align-content:center}.hook-kicker{color:#97E2E6;font:900 9px/1.2 'JetBrains Mono',monospace;letter-spacing:.14em;text-transform:uppercase}.hook-mission-copy h1{color:#fff;font:750 clamp(24px,3.2vw,34px)/1.04 'Source Serif 4',Georgia,serif}.hook-mission-copy>p{max-width:720px;color:rgba(255,255,255,.78);font-size:12px;font-weight:700;line-height:1.42}.bit-flight-scale{min-width:0;height:132px;margin-top:-2px;border-radius:18px;background:rgba(111,213,222,.14)}.bit-flight-scale svg{display:block;width:100%;height:100%;overflow:visible}.flight-line{fill:none;stroke:#9DE3E7;stroke-width:4;stroke-linecap:round;stroke-dasharray:524;stroke-dashoffset:524;transition:stroke-dashoffset .8s ease}.flight-line.drawn{stroke-dashoffset:0}.flight-ticks g{opacity:0;transform:translateY(4px);transition:opacity .65s ease var(--delay),transform .65s ease var(--delay)}.flight-ticks.visible g{opacity:1;transform:none}.flight-ticks path{stroke:#D7F7F8;stroke-width:3;stroke-linecap:round}.flight-ticks text{fill:#EAFBFC;font:900 12px 'JetBrains Mono',monospace}.flight-ship{opacity:0;transform:translate(441px,68px) translateX(-34px);transition:opacity .75s ease,transform 1.05s cubic-bezier(.16,1,.3,1)}.flight-ship.visible{opacity:1;transform:translate(441px,68px)}.flight-hull{fill:#FF704D;stroke:#FFD5CA;stroke-width:2}.flight-wing{fill:#16A6B8}.flight-window{fill:#B9EFF2;stroke:#fff;stroke-width:3}.flight-face{fill:#F7FAF5}.flight-eye{fill:#173B52}.flight-smile{fill:none;stroke:#173B52;stroke-width:2;stroke-linecap:round}.flight-flame{fill:#FFC23C;animation:ship-flame 2.6s ease-in-out 2 alternate}.hook-question{display:grid;gap:9px}.hook-question>h2{color:${T.navy};font:750 clamp(18px,2.4vw,22px)/1.2 'Source Serif 4',Georgia,serif}.hook-answer-frames .options{gap:11px}.hook-answer-frames .option{min-height:54px;border:1px solid rgba(23,59,82,.08);background:linear-gradient(145deg,#FFFFFF,#F7FBFA);box-shadow:0 13px 25px -21px rgba(${T.shadowBase},.62)}.hook-question .feedback{transition:opacity .68s ease,transform .68s cubic-bezier(.16,1,.3,1)}
.segment-bar{min-height:78px;display:grid;grid-template-columns:repeat(4,1fr);border-radius:18px;overflow:hidden;background:#F8F8F4}.segment-bar i{min-width:0;display:grid;place-items:center;opacity:.15;background:${T.cyanSoft};box-shadow:inset -2px 0 rgba(23,59,82,.2);transition:.72s ease}.slow-sequence .segment-bar i{transition-duration:1.15s}.segment-bar i.show{opacity:1}.segment-bar b{opacity:0;color:${T.navy};font:900 20px 'JetBrains Mono',monospace;transition:.85s ease}.segment-bar b.show{opacity:1;animation:pop .36s ease}.formula-flow{min-height:94px;display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap}.formula-chip{padding:12px 14px;border-radius:14px;opacity:.12;transform:translateY(7px);color:${T.navy};background:${T.cyanSoft};font:900 clamp(13px,2.1vw,18px) 'JetBrains Mono',monospace;transition:.42s ease}.formula-flow i{opacity:.12;color:${T.accent};font:900 20px 'JetBrains Mono',monospace;font-style:normal;transition:.42s ease}.formula-flow.slow-sequence .formula-chip,.formula-flow.slow-sequence i{transition-duration:.9s}.show{opacity:1!important;transform:none!important}
.anatomy-card{display:grid;gap:8px}.anatomy-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.anatomy-grid button{min-height:58px;padding:8px;border:0;border-radius:13px;display:grid;grid-template-columns:25px 1fr;align-items:center;gap:6px;opacity:.14;color:${T.ink2};background:#F8F8F4;text-align:left;cursor:pointer;transition:.35s ease}.anatomy-grid button.show{background:${T.cyanSoft}}.anatomy-grid button.active{box-shadow:inset 0 0 0 2px rgba(22,143,163,.35)}.anatomy-grid b{width:24px;height:24px;border-radius:8px;display:grid;place-items:center;color:#fff;background:${T.cyan};font:900 10px 'JetBrains Mono',monospace}.anatomy-grid span{font-size:11px;font-weight:850;line-height:1.25}
.division-taps{display:grid;grid-template-columns:repeat(4,1fr);gap:7px}.division-taps button{min-height:44px;border:0;border-radius:12px;color:${T.cyan};background:${T.cyanSoft};cursor:pointer;font:900 12px 'JetBrains Mono',monospace;box-shadow:inset 0 0 0 2px rgba(22,143,163,.08)}.division-taps button.marked{color:#fff;background:${T.cyan};box-shadow:0 8px 18px -12px rgba(22,143,163,.8)}
.discovery-card,.reading-card,.nonzero-card{display:grid;gap:8px}.count-contrast{display:grid;grid-template-columns:1fr 1fr;gap:8px}.count-contrast>div{padding:10px;border-radius:12px;opacity:.12;color:${T.ink2};background:#F8F8F4;text-align:center;font:900 14px 'JetBrains Mono',monospace;transition:.55s ease}.count-contrast>div.good{color:${T.success};background:${T.successSoft}}.count-contrast>div.wrong-formula{color:${T.warn};background:${T.warnSoft};text-decoration:line-through}.count-contrast>div.narration-focus{animation:narration-spotlight 3s ease both}.free-slider{display:grid;grid-template-columns:1fr minmax(160px,2fr) minmax(150px,auto);align-items:center;gap:10px;padding:9px 12px;border-radius:14px;background:#F8F8F4}.free-slider label{color:${T.ink2};font-size:11px;font-weight:850}.free-slider input{min-height:44px;accent-color:${T.accent};cursor:pointer}.free-slider output{min-width:150px;padding:7px;border-radius:9px;color:#fff;background:${T.navy};text-align:center;font:900 12px 'JetBrains Mono',monospace}
.thermo-card{display:grid;grid-template-columns:minmax(170px,.55fr) minmax(260px,1.45fr);align-items:center;gap:18px}.thermo-svg{width:100%;height:min(330px,43vh)}.mercury{stroke-dasharray:150;stroke-dashoffset:150;transition:stroke-dashoffset .8s ease}.mercury.warm,.mercury.full{stroke-dashoffset:0}.thermo-value,.fuel-value{opacity:.12;fill:${T.success}!important}.thermo-copy{display:grid;gap:12px}.rule-formula,.rule-note{padding:16px;border-radius:16px;opacity:.12;transform:translateY(7px);transition:.32s ease}.rule-formula{color:#fff;background:${T.navy};text-align:center;font:900 clamp(14px,2.3vw,19px) 'JetBrains Mono',monospace}.rule-note{color:${T.success};background:${T.successSoft};font-weight:900;text-align:center}
.exercise-model-wrap{min-width:0;border-radius:22px}.exercise-model-wrap.second-hint .model-card{box-shadow:inset 0 0 0 3px rgba(169,111,19,.38),0 18px 34px -24px rgba(169,111,19,.55);animation:hint-pulse .18s ease 2 alternate}.scale-choice-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;padding:12px}.scale-choice-list{grid-template-columns:1fr;gap:10px}.scale-choice{min-width:0;width:100%;position:relative;padding:7px;border:0;border-radius:15px;background:#F8F8F4;cursor:pointer;transition:.25s ease}.scale-choice:hover{background:${T.cyanSoft}}.scale-choice.picked{background:${T.accentSoft};box-shadow:inset 0 0 0 3px rgba(255,91,53,.24)}.scale-choice.right{background:${T.successSoft};box-shadow:inset 0 0 0 3px rgba(34,122,83,.28)}.scale-choice.bad{background:${T.warnSoft};box-shadow:inset 0 0 0 3px rgba(169,111,19,.25)}.scale-choice>b{position:absolute;top:10px;left:12px;z-index:1;width:31px;height:31px;border-radius:10px;display:grid;place-items:center;color:#fff;background:${T.cyan};font:900 12px 'JetBrains Mono',monospace}.scale-choice .scale-svg{height:146px}.scale-choice .scale-tick text{font-size:14px}
.bit-equation{padding:10px;border-radius:13px;color:${T.warn};background:${T.warnSoft};text-align:center;font:900 18px 'JetBrains Mono',monospace}.fuel-card{min-width:0;padding-block:10px;overflow:hidden}.fuel-svg{display:block;width:min(100%,680px);height:auto;max-height:min(210px,27vh);margin:0 auto;overflow:hidden}.gauge-fill{opacity:.12;transition:.7s ease}.needle,.fuel-value{opacity:.12;transition:.65s ease}.needle{transform:rotate(-42deg);transform-origin:320px 170px}.needle.show{transform:none}.fuel-value{font-size:17px!important}.gauge-fill.show{opacity:1}.fuel-frame-proof{min-width:0;display:grid;grid-template-columns:1fr 1fr;gap:8px}.fuel-frame-proof>div{min-width:0;min-height:44px;padding:10px;border-radius:12px;display:grid;place-items:center;opacity:.12;transform:translateY(6px);color:${T.navy};background:${T.cyanSoft};font:900 13px 'JetBrains Mono',monospace;transition:.5s ease;text-align:center;overflow-wrap:anywhere}.fuel-frame-proof>div.result{color:${T.success};background:${T.successSoft}}
.finale-heading{min-width:0;padding:11px 15px;border-radius:17px;background:linear-gradient(100deg,rgba(255,91,53,.09),transparent 52%),rgba(255,255,255,.92);box-shadow:0 13px 28px -24px rgba(255,91,53,.72)}.finale-heading>span{display:flex;align-items:center;gap:6px;color:${T.accent};font:900 9px/1.2 'JetBrains Mono',monospace;letter-spacing:.12em}.finale-heading h1{margin-top:4px!important;color:${T.navy};font:750 clamp(21px,3vw,28px)/1.08 'Source Serif 4',Georgia,serif}.finale-heading p{margin-top:4px!important;color:${T.ink2};font-size:11px;line-height:1.35}.finale-main{min-width:0;display:grid;grid-template-columns:minmax(270px,.9fr) minmax(310px,1.1fr);align-items:stretch;gap:10px}.finale-payoff{min-width:0;padding:11px 13px;border-radius:18px;display:grid;align-content:center;gap:7px;background:#fff;box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.5)}.finale-payoff>small{color:${T.cyan};font-size:9px;font-weight:900;letter-spacing:.09em}.finale-payoff .scale-svg{height:126px}.finale-hook-answer{min-width:0;padding:8px 10px;border-radius:11px;opacity:.14;transform:translateY(5px);color:${T.ink2};background:#F8F8F4;text-align:center;font:900 12px/1.25 'JetBrains Mono',monospace;transition:.42s ease}.finale-hook-answer b{color:${T.success}}
.finale-equations{min-width:0;display:grid;gap:6px}.finale-equation{min-width:0;min-height:42px;padding:8px 10px;border-radius:12px;display:grid;grid-template-columns:27px minmax(0,1fr);align-items:center;gap:8px;opacity:.14;transform:translateY(6px);color:${T.navy};background:${T.cyanSoft};transition:.32s ease}.finale-equation>b{width:26px;height:26px;border-radius:9px;display:grid;place-items:center;color:#fff;background:${T.cyan};font:900 9px 'JetBrains Mono',monospace}.finale-equation>strong{font:900 14px 'JetBrains Mono',monospace}.sensor-status{min-height:38px;padding:8px 12px;border-radius:12px;display:grid;place-items:center;opacity:.14;transform:translateY(6px);color:${T.success};background:${T.successSoft};font:900 11px 'JetBrains Mono',monospace;letter-spacing:.08em;transition:.32s ease}.finale-bottom{min-width:0;display:grid;grid-template-columns:minmax(0,1.2fr) minmax(270px,.8fr);gap:10px}.finale-bridge{min-width:0;padding:12px 15px;border-radius:16px;display:grid;align-content:center;gap:4px;opacity:.14;transform:translateY(6px);color:#fff;background:${T.navy};transition:.32s ease}.finale-bridge small{color:#98E1E5;font-size:9px;font-weight:900;letter-spacing:.1em}.finale-bridge strong{font:750 15px/1.3 'Source Serif 4',Georgia,serif}
.finale-reward{min-width:0;min-height:100px;position:relative;overflow:hidden;padding:12px 72px 11px 58px;border-radius:17px;display:grid;align-content:center;color:#fff;background:linear-gradient(135deg,#234B62,${T.navy});box-shadow:0 17px 34px -27px rgba(${T.shadowBase},.74);transition:.45s ease}.finale-reward.complete{box-shadow:0 17px 36px -22px rgba(149,201,61,.72)}.finale-medal{position:absolute;left:11px;top:50%;width:38px;height:38px;border:3px solid rgba(255,255,255,.72);border-radius:50%;display:grid;place-items:center;transform:translateY(-50%);color:${T.navy};background:${T.lime};font-size:17px;font-weight:900}.finale-reward-copy{min-width:0;display:grid;gap:3px}.finale-reward-copy>small{color:#98E1E5;font-size:8px;font-weight:900;letter-spacing:.09em}.finale-reward-copy>strong{font:750 15px/1.15 'Source Serif 4',Georgia,serif}.finale-status{min-width:0;display:flex;align-items:center;gap:6px}.finale-status b{flex:none;color:#FFE284;font:900 11px 'JetBrains Mono',monospace}.finale-status span{min-width:0;color:rgba(255,255,255,.72);font-size:8px;line-height:1.2}.finale-reward-bit{position:absolute;right:2px;bottom:-4px;width:68px;height:86px}.finale-reward-bit .g1-char{width:100%;height:100%}.finale-reward.complete .finale-reward-bit{animation:happy .72s ease-out 1 both}.finale-confetti{position:absolute;inset:0;pointer-events:none}.finale-confetti i{position:absolute;top:-12px;width:5px;height:9px;border-radius:2px;background:#FFC23C;animation:finaleFall 1.2s linear 1 both}.finale-confetti i:nth-child(2n){background:${T.accent}}.finale-confetti i:nth-child(3n){background:#77E1EA}.finale-confetti i:nth-child(1){left:9%;animation-delay:.02s}.finale-confetti i:nth-child(2){left:22%;animation-delay:.14s}.finale-confetti i:nth-child(3){left:35%;animation-delay:.08s}.finale-confetti i:nth-child(4){left:48%;animation-delay:.2s}.finale-confetti i:nth-child(5){left:61%;animation-delay:.05s}.finale-confetti i:nth-child(6){left:73%;animation-delay:.17s}.finale-confetti i:nth-child(7){left:84%;animation-delay:.11s}.finale-confetti i:nth-child(8){left:93%;animation-delay:.23s}
.preview-language{position:fixed;top:9px;right:9px;z-index:30;display:flex;gap:3px;padding:3px;border-radius:999px;background:rgba(255,255,255,.94);box-shadow:0 8px 20px -14px rgba(${T.shadowBase},.6)}.preview-language button{padding:4px 9px;border:0;border-radius:999px;color:${T.ink2};background:transparent;cursor:pointer;font-size:10px;font-weight:900}.preview-language .preview-active{color:#FFFFFF;background:${T.accent}}
.g1-bit-ant{transform-origin:60px 28px;animation:antenna .7s ease-out 1 both}.g1-bit-wave,.bit-wave-left,.bit-wave-right,.bit-think-hand,.bit-point-arm,.bit-nod-hand{transform-origin:84px 76px;animation:think .7s ease-out 1 both}.bit-double-wave,.bit-awkward-hands,.bit-focus-hands{transform-origin:center;animation:happy .65s ease-out 1 both}.bit-idea-bulb,.bit-point-target,.bit-focus-scan,.bit-nod-check{animation:pulse .65s ease-out 1 both}
@keyframes page-in{from{opacity:0;transform:translateY(10px)}}@keyframes proof-in{from{opacity:0;transform:translateY(7px)}}@keyframes pop{50%{transform:scale(1.08)}}@keyframes hint-pulse{to{transform:scale(1.012)}}@keyframes antenna{50%{transform:rotate(5deg)}}@keyframes think{50%{transform:rotate(-5deg) translateY(-2px)}}@keyframes happy{to{transform:translateY(-3px)}}@keyframes pulse{to{transform:scale(1.06)}}@keyframes ship-flame{0%,100%{opacity:.72;transform:scaleX(.82)}50%{opacity:1;transform:scaleX(1.08)}}@keyframes narration-spotlight{0%,100%{box-shadow:none}12%,72%{opacity:1;box-shadow:inset 0 0 0 3px rgba(255,91,53,.55),0 0 20px rgba(255,91,53,.28);transform:scale(1.025)}}@keyframes line-spotlight{12%,72%{stroke:${T.accent};filter:drop-shadow(0 0 7px rgba(255,91,53,.9))}}@keyframes tick-spotlight{12%,72%{stroke:${T.accent};filter:drop-shadow(0 0 6px rgba(255,91,53,.9))}}@keyframes division-spotlight{0%,100%{opacity:0}12%,72%{opacity:.3}}@keyframes pointer-spotlight{12%,72%{filter:drop-shadow(0 0 12px rgba(255,91,53,1))}}@keyframes finaleFall{to{transform:translateY(118px) rotate(180deg)}}
@media(max-width:639.98px){.stage-header{padding-top:60px}.screen-type{display:none}.stage{width:min(390px,100%)}.heading{min-height:68px}.heading h1{font-size:25px}.heading .g1-char{width:66px;height:82px}.question,.model-card,.rule-card{padding:13px;border-radius:18px}.options{grid-template-columns:1fr}.option{min-height:52px}.feedback.with-bit{grid-template-columns:49px minmax(0,1fr)}.feedback-bit{width:46px;height:58px}.feedback-content{font-size:14px}.stage-nav{min-height:68px}.btn-white-accent,.btn-ghost{min-width:112px;padding:0 12px}.scale-svg{height:150px}.formula-flow{min-height:82px}.formula-chip{padding:9px 10px;font-size:12px}.anatomy-grid{grid-template-columns:1fr 1fr}.anatomy-grid button{min-height:51px}.free-slider{grid-template-columns:1fr minmax(140px,auto)}.free-slider label{grid-column:1/-1}.free-slider output{min-width:140px;font-size:10px}.scale-choice-grid{grid-template-columns:1fr;gap:8px}.scale-choice{padding:5px 7px}.scale-choice .scale-svg{height:110px}.fuel-frame-proof{grid-template-columns:1fr}.fuel-svg{max-height:180px}.thermo-card{grid-template-columns:135px 1fr;gap:8px}.thermo-svg{height:250px}.rule-formula,.rule-note{padding:11px;font-size:11px}.finale-main,.finale-bottom{grid-template-columns:1fr}.finale-payoff{padding:9px}.finale-payoff .scale-svg{height:105px}.finale-equation{min-height:34px;padding:5px 7px}.sensor-status{min-height:32px}.finale-reward{min-height:84px;padding:9px 60px 8px 50px}.finale-reward-bit{width:56px;height:72px}.stage-summary .stack{gap:8px}.stage-summary .finale-heading{padding:8px 10px}.stage-summary .finale-heading h1{font-size:21px}.stage-summary .finale-heading p{font-size:9px}.stage-summary .finale-main,.stage-summary .finale-bottom{gap:7px}.stage-summary .finale-equations{gap:4px}.stage-summary .finale-bridge{padding:9px 11px}.stage-summary .finale-bridge strong{font-size:13px}}
@media(max-width:639.98px){.stage-hook .stage-header{padding-top:60px}.hook-stack{gap:8px}.hook-mission-frame{min-height:238px;padding:11px 11px 9px;grid-template-columns:72px minmax(0,1fr);gap:7px;border-radius:19px}.hook-bit{width:69px;height:91px}.hook-kicker{font-size:7px}.hook-mission-copy h1{font-size:22px}.hook-mission-copy>p{font-size:9px;line-height:1.34}.bit-flight-scale{height:101px;border-radius:14px}.flight-ticks text{font-size:15px}.hook-question{gap:6px}.hook-question>h2{font-size:17px}.hook-answer-frames .options{grid-template-columns:repeat(3,1fr);gap:6px}.hook-answer-frames .option{min-height:46px;padding:7px 5px;grid-template-columns:23px 1fr;gap:4px}.hook-answer-frames .option>b{width:22px;height:22px}.hook-question .feedback.with-bit{min-height:64px}.hook-question .feedback-content{font-size:12px;line-height:1.35}.hook-question .feedback-proof{margin-top:5px;padding-top:5px;font-size:11px}}
@media(prefers-reduced-motion:reduce){.lesson-root *,.lesson-root *::before,.lesson-root *::after{scroll-behavior:auto!important;animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important}.formula-chip,.formula-flow i,.scale-tick,.scale-pointer,.count-contrast>*,.rule-formula,.rule-note,.thermo-value,.gauge-fill,.needle,.fuel-value,.fuel-frame-proof>div,.finale-equation,.sensor-status,.finale-hook-answer,.finale-bridge,.flight-ticks g,.flight-ship{opacity:1!important;transform:none!important}.flight-ship{transform:translate(441px,68px)!important}.flight-line{stroke-dashoffset:0!important}.scale-line{stroke-dashoffset:0!important}.scale-line.part-highlight{stroke:${T.accent}!important;filter:drop-shadow(0 0 7px rgba(255,91,53,.9))}.scale-tick.part-highlight path{stroke:${T.accent}!important}.scale-divisions.part-highlight rect{opacity:.3!important}.scale-pointer.part-highlight{filter:drop-shadow(0 0 12px rgba(255,91,53,1))}.mercury{stroke-dashoffset:0!important}}
.lesson-root,.stage,.stage-content,.stage-body{overflow:hidden;overscroll-behavior:none}.stage-content{position:relative;padding-bottom:54px!important}.stage-body{height:100%;min-height:0}.caption.caption-slot{position:absolute;left:clamp(14px,5vw,48px);right:clamp(14px,5vw,48px);bottom:5px;width:auto;max-width:none;min-height:40px;margin:0;display:grid;place-items:center;visibility:hidden;opacity:0}.caption.caption-slot.visible{visibility:visible;opacity:1}.activity-slot{min-height:48px;margin-top:7px;display:flex;align-items:center;justify-content:center;gap:6px}.activity-slot button{min-height:44px;padding:7px 12px;border:0;border-radius:13px;color:${T.cyan};background:${T.cyanSoft};font-weight:900;cursor:pointer}.activity-slot button.selected{color:#fff;background:${T.success}}.finale-reflection{display:grid;grid-template-columns:repeat(3,minmax(0,1fr))}.finale-reflection button{min-width:0;font-size:11px}.btn-white-accent:disabled{opacity:.42;cursor:not-allowed;transform:none}@media(max-width:390px){.caption.caption-slot{left:14px;right:14px}.finale-reflection button{padding:5px 6px;font-size:9px}}@media(max-height:700px){.stage-header{padding-top:7px;padding-bottom:5px}.stage-content{padding-top:5px!important}.stack{gap:6px}.heading{min-height:52px}.heading h1{font-size:22px}.heading .g1-char{width:48px;height:60px}.activity-slot{margin-top:4px}.stage-nav{min-height:56px}.scale-svg{height:120px}.formula-flow{min-height:64px}.model-card{padding:9px}.feedback.with-bit{min-height:62px}.feedback-bit{width:43px;height:54px}.stage-summary .finale-main,.stage-summary .finale-bottom{grid-template-columns:1fr 1fr}.stage-summary .g4-title-claim,.stage-summary .g4-title-card{min-height:70px}}@media(max-width:390px) and (max-height:700px){.stage-header,.stage-hook .stage-header{padding-top:42px}.hook-mission-frame{min-height:192px}.bit-flight-scale{height:78px}.stage-summary .finale-heading p{font-size:9px}.stage-summary .finale-payoff .scale-svg{height:82px}.stage-summary .finale-equation{min-height:30px}}
@media(max-width:390px) and (max-height:700px){.stage-exploration .stack{gap:4px}.stage-exploration .heading{min-height:42px}.stage-exploration .heading h1{font-size:18px}.stage-exploration .model-card{padding:5px}.stage-exploration .scale-svg{height:88px}.stage-exploration .anatomy-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:3px}.stage-exploration .anatomy-grid button{min-height:44px;padding:3px;font-size:8px}.stage-exploration .feedback.with-bit{min-height:48px;padding:4px;grid-template-columns:32px minmax(0,1fr);gap:4px}.stage-exploration .feedback-bit{width:31px;height:39px}.stage-exploration .feedback-content{font-size:9px;line-height:1.12}}
@media(min-width:640px) and (max-height:800px){.stage-discovery .stack{gap:7px}.stage-discovery .heading{min-height:56px}.stage-discovery .heading h1{font-size:25px}.stage-discovery .reading-card{padding:9px;display:grid;grid-template-columns:minmax(0,1fr) minmax(260px,.7fr);gap:7px}.stage-discovery .reading-card .scale-svg{height:112px;grid-column:1}.stage-discovery .reading-card .formula-flow{min-height:60px;grid-column:1}.stage-discovery .reading-card .free-slider{grid-column:2;grid-row:1/3;align-content:center}.stage-discovery .activity-slot{margin-top:4px}}
@media(max-width:390px) and (max-height:700px){.stage[data-screen="1"] .stack{gap:4px}.stage[data-screen="1"] .heading{min-height:42px}.stage[data-screen="1"] .heading h1{font-size:18px}.stage[data-screen="1"] .model-card{padding:5px}.stage[data-screen="1"] .segment-bar{min-height:44px}.stage[data-screen="1"] .formula-flow{min-height:48px;gap:3px}.stage[data-screen="1"] .formula-chip{padding:5px;font-size:9px}.stage[data-screen="1"] .compact-question{padding:5px;gap:4px}.stage[data-screen="1"] .compact-question h2{font-size:14px;line-height:1.15}.stage[data-screen="1"] .options{grid-template-columns:repeat(3,minmax(0,1fr));gap:4px}.stage[data-screen="1"] .option{min-height:44px;padding:4px;grid-template-columns:20px minmax(0,1fr);gap:3px;font-size:9px}.stage[data-screen="1"] .option>b{width:20px;height:20px}.stage[data-screen="1"] .feedback.with-bit{min-height:48px;padding:4px;grid-template-columns:32px minmax(0,1fr);gap:4px}.stage[data-screen="1"] .feedback-bit{width:31px;height:39px}.stage[data-screen="1"] .feedback-content{font-size:9px;line-height:1.12}}
@media(min-width:640px) and (max-height:800px){.stage[data-screen="4"] .stack{grid-template-columns:minmax(0,1.18fr) minmax(300px,.82fr);align-items:start;gap:8px}.stage[data-screen="4"] .heading{grid-column:1/-1;min-height:56px}.stage[data-screen="4"] .heading h1{font-size:25px}.stage[data-screen="4"] .trap-card{grid-column:1;padding:9px}.stage[data-screen="4"] .trap-card .scale-svg{height:120px}.stage[data-screen="4"] .compact-question{grid-column:2;padding:10px;gap:8px}.stage[data-screen="4"] .compact-question .options{grid-template-columns:1fr 1fr;gap:6px}.stage[data-screen="4"] .compact-question .option{min-height:52px;padding:7px}.stage[data-screen="4"] .compact-question .feedback.with-bit{min-height:70px;padding:7px}}
@media(max-width:390px) and (max-height:700px){.stage[data-screen="4"] .stack{gap:4px}.stage[data-screen="4"] .heading{min-height:42px}.stage[data-screen="4"] .heading h1{font-size:18px}.stage[data-screen="4"] .heading .g1-char{width:38px;height:48px}.stage[data-screen="4"] .trap-card{padding:5px}.stage[data-screen="4"] .trap-card .scale-svg{height:78px}.stage[data-screen="4"] .count-contrast{grid-template-columns:repeat(4,minmax(0,1fr));gap:3px}.stage[data-screen="4"] .count-contrast>div{padding:4px;font-size:8px;line-height:1.15}.stage[data-screen="4"] .compact-question{padding:5px;gap:4px}.stage[data-screen="4"] .compact-question h2{font-size:14px;line-height:1.15}.stage[data-screen="4"] .compact-question .options{grid-template-columns:1fr 1fr;gap:4px}.stage[data-screen="4"] .compact-question .option{min-height:44px;padding:4px;grid-template-columns:22px minmax(0,1fr);gap:3px;font-size:9px}.stage[data-screen="4"] .compact-question .option>b{width:22px;height:22px}.stage[data-screen="4"] .compact-question .feedback.with-bit{min-height:48px;padding:4px;grid-template-columns:32px minmax(0,1fr);gap:4px}.stage[data-screen="4"] .compact-question .feedback-bit{width:31px;height:39px}.stage[data-screen="4"] .compact-question .feedback-content{font-size:9px;line-height:1.12}}
@media(min-width:640px) and (max-height:800px){.stage[data-screen="6"] .stack{grid-template-columns:minmax(0,1.18fr) minmax(300px,.82fr);align-items:start;gap:8px}.stage[data-screen="6"] .heading{grid-column:1/-1;min-height:56px}.stage[data-screen="6"] .heading h1{font-size:25px}.stage[data-screen="6"] .nonzero-card{grid-column:1;padding:9px}.stage[data-screen="6"] .nonzero-card .scale-svg{height:120px}.stage[data-screen="6"] .nonzero-card .formula-flow{min-height:60px}.stage[data-screen="6"] .compact-question{grid-column:2;padding:10px;gap:8px}.stage[data-screen="6"] .compact-question .options{grid-template-columns:1fr 1fr;gap:6px}.stage[data-screen="6"] .compact-question .option{min-height:52px;padding:7px}.stage[data-screen="6"] .compact-question .feedback.with-bit{min-height:70px;padding:7px}}
@media(max-width:390px) and (max-height:700px){.stage[data-screen="6"] .stack{gap:4px}.stage[data-screen="6"] .heading{min-height:42px}.stage[data-screen="6"] .heading h1{font-size:18px}.stage[data-screen="6"] .nonzero-card{padding:5px}.stage[data-screen="6"] .nonzero-card .scale-svg{height:78px}.stage[data-screen="6"] .nonzero-card .formula-flow{min-height:48px;gap:3px}.stage[data-screen="6"] .nonzero-card .formula-chip{padding:5px;font-size:9px}.stage[data-screen="6"] .compact-question{padding:5px;gap:4px}.stage[data-screen="6"] .compact-question h2{font-size:14px;line-height:1.15}.stage[data-screen="6"] .compact-question .options{grid-template-columns:1fr 1fr;gap:4px}.stage[data-screen="6"] .compact-question .option{min-height:44px;padding:4px;grid-template-columns:22px minmax(0,1fr);gap:3px;font-size:9px}.stage[data-screen="6"] .compact-question .option>b{width:22px;height:22px}.stage[data-screen="6"] .compact-question .feedback.with-bit{min-height:48px;padding:4px;grid-template-columns:32px minmax(0,1fr);gap:4px}.stage[data-screen="6"] .compact-question .feedback-bit{width:31px;height:39px}.stage[data-screen="6"] .compact-question .feedback-content{font-size:9px;line-height:1.12}}
@media(min-width:640px) and (max-height:800px){.stage[data-screen="7"] .stack{gap:7px}.stage[data-screen="7"] .heading{min-height:56px}.stage[data-screen="7"] .heading h1{font-size:25px}.stage[data-screen="7"] .thermo-card{padding:9px;grid-template-columns:150px minmax(0,1fr);gap:8px}.stage[data-screen="7"] .thermo-svg{height:210px}.stage[data-screen="7"] .thermo-copy{gap:7px}.stage[data-screen="7"] .rule-formula,.stage[data-screen="7"] .rule-note{padding:10px}.stage[data-screen="7"] .activity-slot{margin-top:4px}}
@media(max-width:390px) and (max-height:700px){.stage[data-screen="7"] .stack{gap:4px}.stage[data-screen="7"] .heading{min-height:42px}.stage[data-screen="7"] .heading h1{font-size:18px}.stage[data-screen="7"] .heading .g1-char{width:38px;height:48px}.stage[data-screen="7"] .thermo-card{padding:5px;grid-template-columns:90px minmax(0,1fr);gap:5px}.stage[data-screen="7"] .thermo-svg{height:150px}.stage[data-screen="7"] .thermo-copy{gap:4px}.stage[data-screen="7"] .rule-formula,.stage[data-screen="7"] .rule-note{padding:6px;font-size:9px;line-height:1.2}.stage[data-screen="7"] .activity-slot{margin-top:2px}}
@media(max-width:390px) and (max-height:700px){.stage[data-screen="13"] .stack{gap:4px}.stage[data-screen="13"] .heading{min-height:42px}.stage[data-screen="13"] .heading h1{font-size:18px}.stage[data-screen="13"] .fuel-card{padding:5px}.stage[data-screen="13"] .fuel-svg{max-height:110px}.stage[data-screen="13"] .fuel-frame-proof{grid-template-columns:1fr 1fr;gap:4px}.stage[data-screen="13"] .fuel-frame-proof>div{min-height:44px;padding:4px;font-size:9px}.stage[data-screen="13"] .question{padding:5px;gap:4px}.stage[data-screen="13"] .question h2{font-size:14px;line-height:1.15}.stage[data-screen="13"] .options{grid-template-columns:repeat(3,minmax(0,1fr));gap:4px}.stage[data-screen="13"] .option{min-height:44px;padding:4px;grid-template-columns:22px minmax(0,1fr);gap:3px;font-size:9px}.stage[data-screen="13"] .option>b{width:22px;height:22px}.stage[data-screen="13"] .feedback.with-bit{min-height:48px;padding:4px;grid-template-columns:32px minmax(0,1fr);gap:4px}.stage[data-screen="13"] .feedback-bit{width:31px;height:39px}.stage[data-screen="13"] .feedback-content{font-size:9px;line-height:1.12}}
@media(max-width:390px) and (max-height:700px){.stage:is([data-screen="8"],[data-screen="9"],[data-screen="10"],[data-screen="12"]) .stack{gap:4px}.stage:is([data-screen="8"],[data-screen="9"],[data-screen="10"],[data-screen="12"]) .heading{min-height:42px}.stage:is([data-screen="8"],[data-screen="9"],[data-screen="10"],[data-screen="12"]) .heading h1{font-size:18px}.stage:is([data-screen="8"],[data-screen="9"],[data-screen="10"],[data-screen="12"]) .heading .g1-char{width:38px;height:48px}.stage:is([data-screen="8"],[data-screen="9"],[data-screen="10"],[data-screen="12"]) .exercise-visual{padding:5px}.stage:is([data-screen="8"],[data-screen="9"],[data-screen="10"],[data-screen="12"]) .exercise-visual .scale-svg{height:88px}.stage:is([data-screen="8"],[data-screen="9"],[data-screen="10"],[data-screen="12"]) .bit-equation{padding:5px;font-size:13px}.stage:is([data-screen="8"],[data-screen="9"],[data-screen="10"],[data-screen="12"]) .question{padding:5px;gap:4px}.stage:is([data-screen="8"],[data-screen="9"],[data-screen="10"],[data-screen="12"]) .question h2{font-size:14px;line-height:1.15}.stage:is([data-screen="8"],[data-screen="9"],[data-screen="10"],[data-screen="12"]) .options{grid-template-columns:repeat(3,minmax(0,1fr));gap:4px}.stage:is([data-screen="8"],[data-screen="9"],[data-screen="10"],[data-screen="12"]) .option{min-height:44px;padding:4px;grid-template-columns:22px minmax(0,1fr);gap:3px;font-size:9px}.stage:is([data-screen="8"],[data-screen="9"],[data-screen="10"],[data-screen="12"]) .option>b{width:22px;height:22px}.stage:is([data-screen="8"],[data-screen="9"],[data-screen="10"],[data-screen="12"]) .feedback.with-bit{min-height:48px;padding:4px;grid-template-columns:32px minmax(0,1fr);gap:4px}.stage:is([data-screen="8"],[data-screen="9"],[data-screen="10"],[data-screen="12"]) .feedback-bit{width:31px;height:39px}.stage:is([data-screen="8"],[data-screen="9"],[data-screen="10"],[data-screen="12"]) .feedback-content{font-size:9px;line-height:1.12}}
@media(max-width:390px) and (max-height:700px){.stage[data-screen="11"] .stack{gap:4px}.stage[data-screen="11"] .heading{min-height:42px}.stage[data-screen="11"] .heading h1{font-size:18px}.stage[data-screen="11"] .scale-choice-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:4px;padding:5px}.stage[data-screen="11"] .scale-choice{min-height:88px;padding:4px}.stage[data-screen="11"] .scale-choice>b{top:6px;left:6px;width:24px;height:24px}.stage[data-screen="11"] .scale-choice .scale-svg{height:80px}.stage[data-screen="11"] .question{padding:5px;gap:4px}.stage[data-screen="11"] .question h2{font-size:14px;line-height:1.15}.stage[data-screen="11"] .feedback.with-bit{min-height:48px;padding:4px;grid-template-columns:32px minmax(0,1fr);gap:4px}.stage[data-screen="11"] .feedback-bit{width:31px;height:39px}.stage[data-screen="11"] .feedback-content{font-size:9px;line-height:1.12}}
`;
