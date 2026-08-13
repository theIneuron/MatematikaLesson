import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// 4-SINF · 20-DARS · Kasrlarni qo'shish
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
  lessonId: 'frac-4-20-v1',
  slug: 'dars20-kasrlarni-qoshish',
  lessonTitle: { uz: "20-dars. Kasrlarni qo'shish", ru: 'Урок 20. Сложение дробей', en: 'Lesson 20. Adding fractions' },
  skillTags: ['fraction_addition', 'same_denominator', 'fraction_model', 'number_line', 'whole'],
};

const SCREEN_META = [
  { id: 's0', type: 'hook', subtype: 'story-prediction', template: 'StoryChoice', mechanic: 'StoryChoice', goal: 'Predict whether the denominator changes when equal parts are combined', misconceptions: ['adding denominators'], active: true, scored: false, scope: 'hook', resetOnReturn: true },
  { id: 's1', type: 'model', subtype: 'unit-fraction-check', template: 'ModelTap', mechanic: 'ModelTap', goal: 'Identify equal eighths in one whole', misconceptions: ['different part sizes'], active: true, scored: false, scope: null },
  { id: 's2', type: 'exploration', subtype: 'first-addend-model', template: 'AnimatedBar', mechanic: 'AnimatedBar', goal: 'Represent the first addend on a fraction bar', misconceptions: ['counting divisions as filled parts'], active: false, scored: false, scope: null },
  { id: 's3', type: 'exploration', subtype: 'second-addend-model', template: 'AnimatedBar', mechanic: 'AnimatedBar', goal: 'Add more equal parts to the same whole', misconceptions: ['changing the whole'], active: false, scored: false, scope: null },
  { id: 's4', type: 'discovery', subtype: 'combine-equal-parts', template: 'MergeToggle', mechanic: 'MergeToggle', goal: 'Discover that equal parts are counted together', misconceptions: ['adding denominators'], active: true, scored: false, scope: null },
  { id: 's5', type: 'rule', subtype: 'same-denominator-rule', template: 'RuleBuild', mechanic: 'RuleBuild', goal: 'Formulate the same-denominator addition rule', misconceptions: ['changing the unit fraction'], active: false, scored: false, scope: null },
  { id: 's6', type: 'strategy', subtype: 'number-line-strategy', template: 'LineMarker', mechanic: 'LineMarker', goal: 'Check the sum on a number line', misconceptions: ['starting the second jump at zero'], active: true, scored: false, scope: null },
  { id: 's7', type: 'consolidation', subtype: 'whole-boundary', template: 'WholeModel', mechanic: 'WholeModel', goal: 'Connect a complete set of parts with one whole', misconceptions: ['proper fraction required'], active: false, scored: false, scope: null },
  { id: 's8', type: 'test', subtype: 'notation-practice', template: 'MCScreen', mechanic: 'MCScreen', goal: 'Add fractions with a common denominator', misconceptions: ['adding denominators'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's9', type: 'test', subtype: 'model-selection', template: 'ModelChoice', mechanic: 'ModelChoice', goal: 'Select the model of a fraction sum', misconceptions: ['wrong partition count'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's10', type: 'strategy', subtype: 'result-check-strategy', template: 'MCScreen', mechanic: 'MCScreen', goal: 'Choose a reliable way to check the result', misconceptions: ['checking only the numerator'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's11', type: 'error', subtype: 'misconception-repair', template: 'ErrorRepairChoice', mechanic: 'ErrorRepairChoice', goal: "Repair Bit's denominator-addition error", misconceptions: ['adding denominators'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's12', type: 'test', subtype: 'boundary-transfer', template: 'MCScreen', mechanic: 'MCScreen', goal: 'Decide when the common-denominator rule applies', misconceptions: ['using the rule with unlike denominators'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's13', type: 'case', subtype: 'life-context-transfer', template: 'CaseChoice', mechanic: 'CaseChoice', goal: 'Apply fraction addition in an energy-tank context', misconceptions: ['mixing different wholes'], active: true, scored: true, scoreUnits: 1, scope: 'final' },
  { id: 's14', type: 'summary', subtype: 'reflection-and-title', template: 'ReflectionClaim', mechanic: 'ReflectionClaim', goal: 'Reflect on the addition strategy and bridge to subtraction', misconceptions: ['partial result check'], active: true, scored: false, scope: null },
];

const CONTENT = {
  s0: {
    eyebrow: { uz: "Taqsimlash markazi", ru: 'Центр распределения' , en: "Distribution centre"},
    title: { uz: "Ikki yetkazib berish bir bakda", ru: 'Две поставки в одном баке', en: 'Two deliveries in one tank' },
    question: { uz: "Bakdagi bo'linmalar soni o'zgardimi?", ru: 'Изменилось ли число делений в баке?', en: 'Did the number of divisions in the tank change?' },
    options: [
      { uz: "Yo'q, sakkizta bo'linma qoldi", ru: 'Нет, осталось восемь делений', en: 'No, there are still eight divisions' },
      { uz: "Ha, o'n oltita bo'linma bo'ldi", ru: 'Да, стало шестнадцать делений', en: 'Yes, there are now sixteen divisions' },
      { uz: "Hali aniq emas", ru: 'Пока трудно ответить' , en: "I am not sure yet"},
    ],
    neutral: { uz: "Taxmin saqlandi. Endi bir xil sakkizdan ulushlarni modelda tekshiramiz.", ru: 'Гипотеза сохранена. Теперь проверим одинаковые восьмые доли на модели.', en: 'Your prediction is saved. Now we will check equal eighths in the model.' },
    audio: { intro: {
      uz: ["Bitta bakka avval sakkizdan ikki, keyin sakkizdan uch qism suyuqlik quyildi.", "Bit sakkizdan ikki qo'shuv sakkizdan uch teng o'n oltidan besh bo'lishi mumkin deb o'yladi.", "Bakdagi bo'linmalar soni o'zgarganmi? Taxminingizni tanlang."],
      ru: ['В один бак сначала налили две восьмых, а затем ещё три восьмых жидкости.', 'Бит предположил, что две восьмых плюс три восьмых может быть равно пяти шестнадцатым.', 'Изменилось ли число делений в баке? Выбери свою гипотезу.'],
      en: ['First, two eighths of liquid were poured into one tank, followed by another three eighths.', 'Bit thought that two eighths plus three eighths might equal five sixteenths.', 'Did the number of divisions in the tank change? Choose your prediction.'],
    } },
  },
  s1: {
    eyebrow: { uz: "Bitta butun", ru: 'Одно целое', en: 'One whole' },
    title: { uz: "Ulushlarning o'lchami bir xil", ru: 'Размер долей одинаковый', en: 'The parts are the same size' },
    audio: {
      uz: ["Mana bitta butun bak.", "U sakkizta teng ulushga bo'lingan.", "Avval sakkizdan ikki, keyin yana sakkizdan uch ulush quyiladi.", "Ikkala yetkazib berishdagi ulushlar ham sakkizdan; ularning o'lchami o'zgarmaydi."],
      ru: ['Перед нами один целый бак.', 'Он разделён на восемь равных долей.', 'Сначала наливают две восьмых, затем ещё три восьмых.', 'В обеих поставках доли остаются восьмыми; их размер не меняется.'],
      en: ['Here is one whole tank.', 'It is divided into eight equal parts.', 'First, two eighths are poured in, followed by another three eighths.', 'Both deliveries are made of eighths, so the size of each part does not change.'],
    },
  },
  s2: {
    eyebrow: { uz: "Birinchi yetkazib berish", ru: 'Первая поставка', en: 'First delivery' },
    title: { uz: "Sakkizdan ikkini yasaymiz", ru: 'Собираем две восьмых', en: 'Building two eighths' },
    audio: {
      uz: ["Avval bakdagi sakkiz ulushning hammasi bo'sh.", "Birinchi sakkizdan ulush to'ladi.", "Ikkinchi sakkizdan ulush ham to'ladi.", "Ikki bir xil ulush sakkizdan ikkini hosil qildi."],
      ru: ['Сначала все восемь долей бака пусты.', 'Заполняется первая восьмая доля.', 'Заполняется вторая восьмая доля.', 'Две одинаковые доли образовали две восьмых.'],
      en: ['At first, all eight parts of the tank are empty.', 'The first eighth fills up.', 'The second eighth fills up too.', 'Two equal parts make two eighths.'],
    },
  },
  s3: {
    eyebrow: { uz: "Ikkinchi yetkazib berish", ru: 'Вторая поставка', en: 'Second delivery' },
    title: { uz: "Yana uchta sakkizdan ulush", ru: 'Ещё три восьмых доли', en: 'Three more eighths' },
    audio: {
      uz: ["Bakda sakkizdan ikki qism bor.", "Yana uchta xuddi shunday ulush keladi.", "Ular keyingi uchta bo'sh bo'linmani to'ldiradi.", "Endi ifoda sakkizdan ikki qo'shuv sakkizdan uch ko'rinishida yoziladi."],
      ru: ['В баке уже есть две восьмых.', 'Поступают ещё три такие же доли.', 'Они заполняют следующие три пустых деления.', 'Теперь действие записывается как две восьмых плюс три восьмых.'],
      en: ['There are already two eighths in the tank.', 'Three more parts of the same size arrive.', 'They fill the next three empty divisions.', 'The calculation can now be written as two eighths plus three eighths.'],
    },
  },
  s4: {
    eyebrow: { uz: "Kashfiyot", ru: 'Открытие', en: 'Discovery' },
    title: { uz: "Bir xil ulushlarni sanaymiz", ru: 'Считаем одинаковые доли', en: 'Counting equal parts' },
    audio: {
      uz: ["Birinchi yetkazib berishda ikkita, ikkinchisida uchta sakkizdan ulush bor.", "Ulushlar sonini qo'shamiz: ikki qo'shuv uch teng besh.", "Beshta ulushni bitta rangda ko'rsatsak, ularning barchasi bir xil kattalikda ekanini ko'ramiz.", "Natija sakkizdan besh bo'ladi."],
      ru: ['В первой поставке две, а во второй три восьмых доли.', 'Складываем число долей: два плюс три равно пяти.', 'Если показать пять долей одним цветом, видно, что все они одинакового размера.', 'Получаем пять восьмых.'],
      en: ['The first delivery has two eighths, and the second has three eighths.', 'Add the number of parts: two plus three equals five.', 'Showing all five parts in one colour makes it clear that they are the same size.', 'The result is five eighths.'],
    },
  },
  s5: {
    eyebrow: { uz: "Qoida", ru: 'Правило', en: 'Rule' },
    title: { uz: "Maxraj o'zgarmaydi", ru: 'Знаменатель не меняется' , en: "The denominator does not change"},
    audio: {
      uz: ["Bir xil maxrajli kasrlarda suratlar qo'shiladi.", "Ikki qo'shuv uch teng besh, shuning uchun natijaning surati besh.", "Bak sakkizta teng bo'linmaga bo'linganicha qoldi, shuning uchun maxraj sakkiz.", "Surat va maxrajlarni birga qo'shib, o'n oltidan besh yozish noto'g'ri."],
      ru: ['У дробей с одинаковыми знаменателями складывают числители.', 'Два плюс три равно пяти, поэтому числитель результата равен пяти.', 'Бак по-прежнему разделён на восемь равных частей, поэтому знаменатель равен восьми.', 'Складывать одновременно числители и знаменатели и писать пять шестнадцатых неверно.'],
      en: ['When fractions have the same denominator, add the numerators.', 'Two plus three equals five, so the numerator of the result is five.', 'The tank is still divided into eight equal parts, so the denominator remains eight.', 'It is incorrect to add both the numerators and denominators and write five sixteenths.'],
    },
  },
  s6: {
    eyebrow: { uz: "Sonlar nurida", ru: 'На числовом луче' , en: "On the number line"},
    title: { uz: "Qo'shish — oldinga siljish", ru: 'Сложение — движение вперёд', en: 'Addition means moving forwards' },
    audio: {
      uz: ["Sonlar nurida noldan boshlaymiz.", "Avval ikki qadam yurib, sakkizdan ikkiga kelamiz.", "Yana uchta sakkizdan qadam oldinga yuramiz.", "Sakkizdan besh nuqtasiga kelamiz; model va sonlar nuri bir xil natijani ko'rsatdi."],
      ru: ['На числовом луче начинаем с нуля.', 'Сначала делаем два шага и приходим к двум восьмым.', 'Затем проходим ещё три восьмых шага вперёд.', 'Приходим к пяти восьмым; модель и числовой луч показывают один результат.'],
      en: ['Start at zero on the number line.', 'First, move two steps to reach two eighths.', 'Then move forwards another three eighth-sized steps.', 'We arrive at five eighths; the model and the number line show the same result.'],
    },
  },
  s7: {
    eyebrow: { uz: "Chegaraviy holat", ru: 'Граничный случай', en: 'Boundary case' },
    title: { uz: "Barcha ulushlar yig'ilsa — bir butun", ru: 'Все доли вместе дают целое', en: 'All the parts together make one whole' },
    audio: {
      uz: ["Olti teng ulushdan avval uchtasi to'lgan: bu oltidan uch.", "Yana oltidan uchni qo'shamiz.", "Uch qo'shuv uch teng olti, demak oltidan olti hosil bo'ladi.", "Oltidan olti bir butunga teng.", "Qoida: teng maxrajlarda suratlarni qo'shamiz, maxrajni saqlaymiz; surat maxrajga teng bo'lsa, natija bir butun."],
      ru: ['Из шести равных долей сначала заполнены три: это три шестых.', 'Добавляем ещё три шестых.', 'Три плюс три равно шести, значит получаем шесть шестых.', 'Шесть шестых равны одному целому.', 'Правило: при равных знаменателях складываем числители и сохраняем знаменатель; если числитель равен знаменателю, результат равен одному целому.'],
      en: ['Three of six equal parts are filled at first: that is three sixths.', 'Add another three sixths.', 'Three plus three equals six, so the result is six sixths.', 'Six sixths equal one whole.', 'The rule is to add the numerators and keep the denominator when the denominators are equal. If the numerator equals the denominator, the result is one whole.'],
    },
  },
  s8: {
    eyebrow: { uz: "Mashq · 1/6", ru: 'Тренировка · 1/6' , en: "Practice · 1/6"},
    title: { uz: "Bir xil maxrajlar", ru: 'Одинаковые знаменатели' , en: "Equal denominators"},
    question: { uz: "2/9 + 5/9 = ?", ru: '2/9 + 5/9 = ?' , en: "2/9 + 5/9 = ?"},
    options: ['7/9', '7/18', '3/9'],
    correctIndex: 0,
    feedback: [
      { uz: "To'g'ri. Ikki va besh ulush jami yetti; ulushlar to'qqizdanligicha qoldi.", ru: 'Верно. Две и пять долей дают семь; доли остаются девятыми.', en: 'Correct. Two parts and five parts make seven, and the parts remain ninths.' },
      { uz: "Maxrajlarni qo'shmang. To'qqiz ulushning o'lchamini bildiradi va o'zgarmaydi.", ru: 'Не складывай знаменатели. Девять задаёт размер доли и не меняется.', en: 'Do not add the denominators. Nine defines the size of each part and does not change.' },
      { uz: "Uch ayirish natijasiga o'xshaydi. Bu yerda suratlar: ikki qo'shuv besh.", ru: 'Три похоже на результат вычитания. Здесь нужно сложить числители: два плюс пять.', en: 'Three looks like the result of subtraction. Here, add the numerators: two plus five.' },
    ],
    proof: { uz: "2/9 + 5/9 = (2 + 5)/9 = 7/9", ru: '2/9 + 5/9 = (2 + 5)/9 = 7/9' , en: "2/9 + 5/9 = (2 + 5)/9 = 7/9"},
    audio: { intro: {
      uz: ["To'qqizdan ikki va to'qqizdan beshni qo'shing. Ulushlarning o'lchami bir xil; faqat ularning sonini qo'shing."],
      ru: ['Сложи две девятых и пять девятых. Размер долей одинаковый; сложи только их количество.'],
      en: ['Add two ninths and five ninths. The parts are the same size, so add only their number.'],
    }, on_correct: { uz: "To'g'ri. Ikki va besh ulush jami yetti; ulushlar to'qqizdanligicha qoldi.", ru: 'Верно. Две и пять долей дают семь; доли остаются девятыми.', en: 'Correct. Two parts and five parts make seven, and the parts remain ninths.' }, on_wrong: { uz: "Maxrajni saqlab, suratlarni yana qo'shing.", ru: 'Сохрани знаменатель и ещё раз сложи числители.', en: 'Keep the denominator and add the numerators again.' } },
  },
  s9: {
    eyebrow: { uz: "Mashq · 2/6", ru: 'Тренировка · 2/6' , en: "Practice · 2/6"},
    title: { uz: "Mos modelni toping", ru: 'Найди подходящую модель' , en: "Find the matching model"},
    question: { uz: "2/6 + 3/6 ni qaysi model ko'rsatadi?", ru: 'Какая модель показывает 2/6 + 3/6?', en: 'Which model shows 2/6 + 3/6?' },
    options: [
      { uz: "A: 6 qismdan 5 tasi bo'yalgan", ru: 'A: закрашено 5 из 6 частей', en: 'A: 5 of 6 parts are shaded' },
      { uz: "B: 12 qismdan 5 tasi bo'yalgan", ru: 'Б: закрашено 5 из 12 частей', en: 'B: 5 of 12 parts are shaded' },
      { uz: "C: 6 qismdan 1 tasi bo'yalgan", ru: 'В: закрашена 1 из 6 частей', en: 'C: 1 of 6 parts is shaded' },
    ],
    correctIndex: 0,
    feedback: [
      { uz: "To'g'ri. Ikki va uchta oltidan ulush jami oltidan besh.", ru: 'Верно. Две и три шестых доли вместе дают пять шестых.', en: 'Correct. Two sixths and three sixths together make five sixths.' },
      { uz: "Butun qayta bo'linmadi. O'n ikkita emas, oltita teng bo'linma qoladi.", ru: 'Целое не делили заново. Остаётся шесть, а не двенадцать равных частей.', en: 'The whole was not divided again. There are still six equal parts, not twelve.' },
      { uz: "Bitta bo'yalgan ulush ayirmani ko'rsatadi. Qo'shishda beshta ulush bo'yaladi.", ru: 'Одна закрашенная доля показывает разность. При сложении закрашено пять долей.', en: 'One shaded part shows the difference. For this addition, five parts should be shaded.' },
    ],
    proof: { uz: "2/6 + 3/6 = 5/6", ru: '2/6 + 3/6 = 5/6' , en: "2/6 + 3/6 = 5/6"},
    audio: { intro: {
      uz: ["Oltidan ikki qo'shuv oltidan uch uchun mos modelni tanlang. Maxraj oltita teng bo'linmani, surat esa jami bo'yalgan ulushlarni ko'rsatadi."],
      ru: ['Выбери модель для двух шестых плюс трёх шестых. Знаменатель показывает шесть равных частей, а числитель показывает общее число закрашенных долей.'],
      en: ['Choose the model for two sixths plus three sixths. The denominator shows six equal parts, and the numerator shows the total number of shaded parts.'],
    }, on_correct: { uz: "To'g'ri. Ikki va uchta oltidan ulush jami oltidan besh.", ru: 'Верно. Две и три шестых доли вместе дают пять шестых.', en: 'Correct. Two sixths and three sixths together make five sixths.' }, on_wrong: { uz: "Bo'linmalar soni va jami bo'yalgan ulushlarni tekshiring.", ru: 'Проверь число делений и общее число закрашенных долей.', en: 'Check the number of divisions and the total number of shaded parts.' } },
  },
  s10: {
    eyebrow: { uz: "Mashq · 3/6", ru: 'Тренировка · 3/6' , en: "Practice · 3/6"},
    title: { uz: "Noma'lum qo'shiluvchi", ru: 'Неизвестное слагаемое', en: 'The unknown addend' },
    question: { uz: "□/8 + 3/8 = 7/8. Katakka qaysi son yoziladi?", ru: '□/8 + 3/8 = 7/8. Какое число нужно записать в клетку?', en: '□/8 + 3/8 = 7/8. Which number belongs in the box?' },
    options: ['4', '5', '10'],
    correctIndex: 0,
    feedback: [
      { uz: "To'g'ri. To'rt qo'shuv uch teng yetti.", ru: 'Верно. Четыре плюс три равно семи.', en: 'Correct. Four plus three equals seven.' },
      { uz: "Besh qo'shuv uch sakkiz bo'ladi. Bizga surat yetti kerak.", ru: 'Пять плюс три равно восьми. Нам нужен числитель семь.', en: 'Five plus three equals eight. We need a numerator of seven.' },
      { uz: "O'n maxrajlarni qo'shishdan kelmaydi. Noma'lum suratni yettidan uchni ayirib toping.", ru: 'Десять не получают сложением знаменателей. Найди неизвестный числитель: из семи вычти три.', en: 'Ten does not come from adding the denominators. Find the unknown numerator by subtracting three from seven.' },
    ],
    proof: { uz: "7 - 3 = 4; 4/8 + 3/8 = 7/8", ru: '7 − 3 = 4; 4/8 + 3/8 = 7/8', en: '7 − 3 = 4; 4/8 + 3/8 = 7/8' },
    audio: { intro: {
      uz: ["Noma'lum suratni toping: katak sakkizdan ulushlar sonini bildiradi. Qaysi songa uchni qo'shsak, yetti hosil bo'ladi?"],
      ru: ['Найди неизвестный числитель: клетка показывает число восьмых долей. К какому числу нужно прибавить три, чтобы получить семь?'],
      en: ['Find the unknown numerator. The box shows the number of eighths. Which number plus three equals seven?'],
    }, on_correct: { uz: "To'g'ri. To'rt qo'shuv uch teng yetti.", ru: 'Верно. Четыре плюс три равно семи.', en: 'Correct. Four plus three equals seven.' }, on_wrong: { uz: "Yetti ulushdan ma'lum uch ulushni ayiring.", ru: 'Вычти известные три доли из семи.', en: 'Subtract the three known parts from seven.' } },
  },
  s11: {
    eyebrow: { uz: "Mashq · 4/6", ru: 'Тренировка · 4/6' , en: "Practice · 4/6"},
    title: { uz: "Bitning xatosini toping", ru: 'Найди ошибку Бита' , en: "Find Bit's mistake"},
    question: { uz: "Bit: 2/8 + 3/8 = 5/16. Xato nimada?", ru: 'Бит: 2/8 + 3/8 = 5/16. В чём ошибка?', en: 'Bit wrote 2/8 + 3/8 = 5/16. What is the mistake?' },
    options: [
      { uz: "Bit maxrajlarni ham qo'shgan", ru: 'Бит сложил и знаменатели', en: 'Bit added the denominators too' },
      { uz: "Bit suratlarni qo'shmagan", ru: 'Бит не сложил числители', en: 'Bit did not add the numerators' },
      { uz: "Bitning natijasi birdan katta", ru: 'Результат Бита больше единицы', en: "Bit's result is greater than one" },
    ],
    correctIndex: 0,
    feedback: [
      { uz: "To'g'ri. Sakkiz ulush o'lchamini bildiradi; uni sakkizga qo'shmaymiz.", ru: 'Верно. Восемь задаёт размер доли; его не складывают с восьмью.', en: 'Correct. Eight defines the size of each part, so we do not add it to eight.' },
      { uz: "Suratlar to'g'ri qo'shilgan: ikki qo'shuv uch teng besh. Xato pastki sonda.", ru: 'Числители сложены верно: два плюс три равно пяти. Ошибка в нижнем числе.', en: 'The numerators were added correctly: two plus three equals five. The mistake is in the bottom number.' },
      { uz: "O'n oltidan besh birdan kichik. Xato natijaning kattaligida emas, maxrajni o'zgartirishda.", ru: 'Пять шестнадцатых меньше единицы. Ошибка не в величине результата, а в изменении знаменателя.', en: 'Five sixteenths is less than one. The mistake is not the size of the result, but changing the denominator.' },
    ],
    proof: { uz: "2/8 + 3/8 = 5/8, 5/16 emas", ru: '2/8 + 3/8 = 5/8, а не 5/16', en: '2/8 + 3/8 = 5/8, not 5/16' },
    audio: { intro: {
      uz: ["Bit sakkizdan ikki qo'shuv sakkizdan uch teng o'n oltidan besh deb yozdi. Uning mulohazasidagi aniq xatoni toping."],
      ru: ['Бит записал: две восьмых плюс три восьмых равно пяти шестнадцатым. Найди точную ошибку в его рассуждении.'],
      en: ['Bit wrote that two eighths plus three eighths equals five sixteenths. Find the exact mistake in his reasoning.'],
    }, on_correct: { uz: "To'g'ri. Sakkiz ulush o'lchamini bildiradi; uni sakkizga qo'shmaymiz.", ru: 'Верно. Восемь задаёт размер доли; его не складывают с восьмью.', en: 'Correct. Eight defines the size of each part, so we do not add it to eight.' }, on_wrong: { uz: "Suratlar va maxraj qanday ma'no bildirishini tekshiring.", ru: 'Проверь, что обозначают числитель и знаменатель.', en: 'Check what the numerator and denominator mean.' } },
  },
  s12: {
    eyebrow: { uz: "Mashq · 5/6", ru: 'Тренировка · 5/6' , en: "Practice · 5/6"},
    title: { uz: "Qoida qachon ishlaydi?", ru: 'Когда работает правило?' , en: "When does the rule work?"},
    question: { uz: "1/4 + 1/6 ni bugungi qoida bilan hisoblay olamizmi?", ru: 'Можно ли вычислить 1/4 + 1/6 по сегодняшнему правилу?', en: "Can we calculate 1/4 + 1/6 using today's rule?" },
    options: [
      { uz: "Ha, javob 2/10", ru: 'Да, ответ 2/10', en: 'Yes, the answer is 2/10' },
      { uz: "Yo'q, maxrajlar har xil", ru: 'Нет, знаменатели разные' , en: "No, the denominators are different"},
      { uz: "Ha, javob 2/6", ru: 'Да, ответ 2/6' , en: "Yes, the answer is 2/6"},
    ],
    correctIndex: 1,
    feedback: [
      { uz: "Surat va maxrajlarni alohida qo'shish mumkin emas. Bugungi qoida faqat teng maxrajlar uchun.", ru: 'Нельзя отдельно складывать числители и знаменатели. Сегодняшнее правило работает только при равных знаменателях.', en: "You cannot add the numerators and denominators separately. Today's rule works only for equal denominators." },
      { uz: "To'g'ri. To'rtdan va oltidan ulushlarning o'lchami boshqa; bugun ularni hisoblamaymiz.", ru: 'Верно. Четвёртые и шестые доли имеют разный размер; сегодня мы их не вычисляем.' , en: "Correct. Fourths and sixths are different-sized parts, so we will not calculate this sum today."},
      { uz: "Maxrajni shunchaki oltida qoldirib bo'lmaydi. Ulushlar bir xil o'lchamda emas.", ru: 'Нельзя просто оставить знаменатель шесть. Доли имеют разный размер.' , en: "You cannot simply keep six as the denominator. The parts are not the same size."},
    ],
    proof: { uz: "Bugungi qoida: a/b + c/b = (a + c)/b", ru: 'Правило урока: a/b + c/b = (a + c)/b', en: "Today's rule: a/b + c/b = (a + c)/b" },
    audio: { intro: {
      uz: ["To'rtdan bir va oltidan birning maxrajlariga qarang. Bugungi teng maxrajlar qoidasini bu misolga ishlatish mumkinmi?"],
      ru: ['Посмотри на знаменатели одной четвёртой и одной шестой. Можно ли применить к этому примеру сегодняшнее правило равных знаменателей?'],
      en: ["Look at the denominators of one fourth and one sixth. Can today's equal-denominator rule be applied to this example?"],
    }, on_correct: { uz: "To'g'ri. To'rtdan va oltidan ulushlarning o'lchami boshqa; bugun ularni hisoblamaymiz.", ru: 'Верно. Четвёртые и шестые доли имеют разный размер; сегодня мы их не вычисляем.' , en: "Correct. Fourths and sixths are different-sized parts, so we will not calculate this sum today."}, on_wrong: { uz: "Avval maxrajlar teng yoki teng emasligini tekshiring.", ru: 'Сначала проверь, равны ли знаменатели.' , en: "First check whether the denominators are equal."} },
  },
  s13: {
    eyebrow: { uz: "Mashq · 6/6", ru: 'Тренировка · 6/6' , en: "Practice · 6/6"},
    title: { uz: "Shahar energiyasini birlashtiramiz", ru: 'Объединяем энергию города', en: "Combining the city's energy" },
    question: { uz: "Quyosh 3/10, shamol 4/10 energiya berdi. Jami qancha?", ru: 'Солнце дало 3/10, ветер — 4/10 энергии. Сколько всего?', en: 'Solar power supplied 3/10 and wind power supplied 4/10 of the energy. How much is that altogether?' },
    options: ['7/10', '7/20', '1/10'],
    correctIndex: 0,
    feedback: [
      { uz: "To'g'ri. Uchta va to'rtta o'ndan ulush jami o'ndan yetti.", ru: 'Верно. Три и четыре десятых доли вместе дают семь десятых.', en: 'Correct. Three tenths and four tenths together make seven tenths.' },
      { uz: "Energiya shkalasi yigirmaga qayta bo'linmadi. Maxraj o'n bo'lib qoladi.", ru: 'Шкалу энергии не делили заново на двадцать частей. Знаменатель остаётся десять.', en: 'The energy scale was not divided again into twenty parts. The denominator remains ten.' },
      { uz: "O'ndan bir ayirmani ko'rsatadi. Vaziyatda energiya manbalari qo'shilmoqda.", ru: 'Одна десятая показывает разность. В задаче источники энергии складываются.', en: 'One tenth shows the difference. In this problem, the energy sources are being added.' },
    ],
    proof: { uz: "3/10 + 4/10 = 7/10", ru: '3/10 + 4/10 = 7/10' , en: "3/10 + 4/10 = 7/10"},
    audio: { intro: {
      uz: ["Taqsimlash markaziga quyosh manbai o'ndan uch qism energiya berdi.", "Shamol manbai yana o'ndan to'rt qism berdi. Bir xil o'ndan ulushlarni qo'shib, jami energiyani toping."],
      ru: ['Солнечный источник дал центру распределения три десятых энергии.', 'Ветровой источник дал ещё четыре десятых. Сложи одинаковые десятые доли и найди общее количество энергии.'],
      en: ['The solar source supplied three tenths of the energy to the distribution centre.', 'The wind source supplied another four tenths. Add the equal tenths to find the total amount of energy.'],
    }, on_correct: { uz: "To'g'ri. Uchta va to'rtta o'ndan ulush jami o'ndan yetti.", ru: 'Верно. Три и четыре десятых доли вместе дают семь десятых.', en: 'Correct. Three tenths and four tenths together make seven tenths.' }, on_wrong: { uz: "Ikkala miqdor ham o'ndan ulushlarda. Suratlarni qo'shing.", ru: 'Обе величины выражены в десятых долях. Сложи числители.', en: 'Both amounts are in tenths. Add the numerators.' } },
  },
  s14: {
    eyebrow: { uz: "Yakun", ru: 'Итог' , en: "Summary"},
    title: { uz: "Bir xil ulushlarni birlashtiramiz", ru: 'Объединяем одинаковые доли', en: 'Combining equal parts' },
    audio: {
      uz: ["Boshlang'ich bakda sakkizdan ikki qism bor edi.", "Unga yana sakkizdan uch qism qo'shildi.", "Ulushlar soni ikki qo'shuv uch teng besh bo'ldi.", "Bo'linma o'lchami o'zgarmadi, natija sakkizdan besh.", "Keyingi darsda bir xil ulushlarning bir qismini olib tashlab, kasrlarni ayirishni o'rganamiz."],
      ru: ['В исходном баке было две восьмых.', 'К ним добавили ещё три восьмых.', 'Число долей стало равно двум плюс три, то есть пяти.', 'Размер деления не изменился, поэтому результат равен пяти восьмым.', 'На следующем уроке научимся убирать часть одинаковых долей и вычитать дроби.'],
      en: ['The starting tank contained two eighths.', 'Another three eighths were added.', 'The number of parts became two plus three, which is five.', 'The size of each division did not change, so the result is five eighths.', 'In the next lesson, we will remove some equal parts and learn to subtract fractions.'],
    },
  },
};

let runtimeConfig = { ttsApiBase: '', voiceGender: 'f', correctSoundUrl: '', wrongSoundUrl: '', previewMode: false };
const configureLesson = (next) => { runtimeConfig = { ...runtimeConfig, ...next }; };
const LangContext = createContext('uz');
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
      {!audio.muted && (
        <button type="button" className="icon-btn" onClick={audio.replay} aria-label={replayLabel} title={replayLabel}>
          ↻
        </button>
      )}
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

const Stage = ({ screen, audio, onPrev, onNext, nextDisabled = false, finish = false, children }) => {
  const t = useT(); const mobile = useIsMobile(); const pad = mobile ? 14 : 48; const c = CONTENT[`s${screen}`]; const meta = SCREEN_META[screen];
  return <main className={`stage stage-${meta.type}`} data-g4-screen={meta.type === 'hook' ? 'hook' : meta.type}><header className="stage-header" style={{ paddingLeft: pad, paddingRight: pad }}><div className="progress-track" aria-label={`${screen + 1} / ${TOTAL_SCREENS}`}><div className="progress-fill progress-bar" style={{ width: `${(screen + 1) / TOTAL_SCREENS * 100}%` }}/></div><div className="stage-chrome"><div className="chrome-title"><span className="status-dot"/><span>{t(c.eyebrow)}</span></div><div className="chrome-actions"><ScreenTypeLabel type={meta.type}/>{audio && <AudioIndicator audio={audio}/>}<span className="screen-count">{String(screen + 1).padStart(2, '0')} / {TOTAL_SCREENS}</span></div></div></header><section className="stage-content" style={{ paddingLeft: pad, paddingRight: pad }}>{children}<div className={`caption-slot ${audio?.caption && (audio.muted || audio.visualOnly) ? 'is-visible' : ''}`} aria-live="polite"><span>{audio?.caption && (audio.muted || audio.visualOnly) ? audio.caption : ''}</span></div></section><footer className="stage-nav" style={{ paddingLeft: pad, paddingRight: pad }}>{screen === 0 ? <span/> : <button type="button" className="btn-ghost" onClick={onPrev}>← {t({ uz: "Orqaga", ru: 'Назад' , en: "Back"})}</button>}<button type="button" className="btn-white-accent" disabled={nextDisabled || !onNext} onClick={onNext}>{finish ? t({ uz: "Darsni yakunlash", ru: 'Завершить урок' , en: "Finish lesson"}) : t({ uz: "Davom etish", ru: 'Продолжить' , en: "Continue"})} →</button></footer></main>;
};

const Heading = ({ c, bit, hook = false }) => { const t = useT(); return <div className="heading"><div><span data-g4-role={hook ? 'hook-topic' : undefined}>{t(c.eyebrow)}</span><h1 data-g4-role={hook ? 'hook-title' : undefined}>{t(c.title)}</h1></div>{bit && !hook && <BitSVG state={bit}/>}</div>; };
const Frac = ({ n, d, size = 'sm' }) => <span className={'frac ' + (size === 'lg' ? 'frac-lg' : '')}><span>{n}</span><i/><span>{d}</span></span>;
const Options = ({ values, picked, onPick, correctIndex, solved, neutral = false, disabled = false }) => {
  const t = useT();
  return <div className="options">{values.map((value, index) => <button type="button" data-g4-role="answer-card" key={index + '-' + t(value)} className={'option ' + (picked === index ? 'picked ' : '') + (!neutral && solved && index === correctIndex ? 'right ' : '') + (!neutral && picked === index && picked !== correctIndex ? 'bad' : '')} disabled={disabled || (!neutral && solved)} onClick={() => onPick(index)}><b>{String.fromCharCode(65 + index)}</b><span>{t(value)}</span></button>)}</div>;
};

const FractionBar = ({ den = 8, cyan = 0, lime = 0, merged = false, divisions = true, label = null, compact = false }) => {
  const cells = Array.from({ length: den }, (_, index) => {
    const filled = index < cyan + lime;
    const kind = merged && filled ? 'merged' : index < cyan ? 'cyan' : index < cyan + lime ? 'lime' : '';
    return <i key={index} className={kind}/>;
  });
  return <div className={'fraction-model ' + (compact ? 'compact' : '')}><div className={'fraction-bar ' + (divisions ? 'divided' : 'whole')} style={{ gridTemplateColumns: 'repeat(' + den + ', 1fr)' }}>{cells}</div>{label && <div className="model-label">{label}</div>}</div>;
};

const NumberLine = ({ den = 8, first = 2, second = 5, frame = 0, marker = null }) => {
  const ticks = Array.from({ length: den + 1 }, (_, index) => <i key={index} className="nl-tick" style={{ left: (index / den * 100) + '%' }}><span>{index === 0 ? '0' : index === den ? '1' : ''}</span></i>);
  return <div className="number-line">
    <div className="nl-track">{ticks}</div>
    {frame >= 1 && <div className="nl-arrow first-hop" style={{ left: '0%', width: (first / den * 100) + '%' }}/>}
    {frame >= 1 && <b className="nl-dot cyan" style={{ left: (first / den * 100) + '%' }}>{first}/{den}</b>}
    {frame >= 2 && <div className="nl-arrow second-hop" style={{ left: (first / den * 100) + '%', width: ((second - first) / den * 100) + '%' }}/>}
    {frame >= 2 && <b className="nl-dot lime" style={{ left: (second / den * 100) + '%' }}>{second}/{den}</b>}
    {marker !== null && <b className="nl-dot free" style={{ left: (marker / den * 100) + '%' }}>{marker}/{den}</b>}
  </div>;
};

const ModelChoices = ({ mode = 'addition', picked, solved, correctIndex, onPick, options = [], disabled = false }) => {
  const t = useT();
  const items = mode === 'addition'
    ? [{ den: 6, cyan: 2, lime: 3 }, { den: 12, cyan: 2, lime: 3 }, { den: 6, cyan: 1, lime: 0 }]
    : [];
  return <div className="model-choices">{items.map((item, index) => <button type="button" key={index} className={`model-choice ${picked === index ? 'picked' : ''} ${solved && correctIndex === index ? 'right' : ''} ${picked === index && !solved ? 'bad' : ''}`} onClick={() => onPick(index)} disabled={disabled || solved}><b>{String.fromCharCode(65 + index)}</b><span>{t(options[index])}</span><FractionBar {...item} compact/></button>)}</div>;
};

const RuleBoundaryModels = ({ operation }) => <div className="rule-boundary-models"><div><Frac n="1" d="4"/><FractionBar den={4} cyan={1} compact/></div><strong>{operation}</strong><div><Frac n="1" d="6"/><FractionBar den={6} lime={1} compact/></div></div>;

function ChoiceExercise({ screen, storedAnswer, onAnswer, onNext, onPrev, visual = null, renderVisual = null, bit = null, modelChoices = false }) {
  const t = useT();
  const c = CONTENT['s' + screen];
  const audio = useNarration(c.audio, screen);
  const narrationReady = audio.muted || audio.completed;
  const [picked, setPicked] = useState(storedAnswer?.studentAnswerIndex ?? null);
  const [solved, setSolved] = useState(storedAnswer?.correct === true);
  const [hintLevel, setHintLevel] = useState((storedAnswer?.attempts ?? 0) >= 2 ? 1 : 0);
  const attempts = useRef(storedAnswer?.attempts ?? 0);
  const clean = useRef(storedAnswer?.firstTry ?? true);
  const pick = (index) => {
    if (solved || !narrationReady) return;
    attempts.current += 1;
    const ok = index === c.correctIndex;
    if (!ok) clean.current = false;
    setPicked(index);
    setSolved(ok);
    if (!ok && attempts.current >= 2) setHintLevel(1);
    playSfx(ok ? 'correct' : 'wrong');
    audio.pushOneOff(t(ok ? c.audio.on_correct : c.feedback[index]));
    onAnswer({ screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question), options: c.options.map(t), correctIndex: c.correctIndex, correctAnswer: t(c.options[c.correctIndex]), studentAnswerIndex: index, studentAnswer: t(c.options[index]), correct: ok, firstTry: ok && clean.current && attempts.current === 1, attempts: attempts.current, solved: ok });
  };
  const contextVisual = modelChoices ? <ModelChoices picked={picked} solved={solved} correctIndex={c.correctIndex} onPick={pick} options={c.options} disabled={!narrationReady}/> : renderVisual ? renderVisual({ frame: Math.min(audio.frame, 1), solved }) : visual;
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!solved || !narrationReady}><div className="stack"><Heading c={c} bit={bit}/>{contextVisual && <div className={'attempt-model ' + (hintLevel > 0 ? 'attempt-highlight' : '')}>{contextVisual}</div>}<section className={'question ' + (hintLevel > 0 ? 'attempt-highlight' : '')}><h2>{t(c.question)}</h2>{hintLevel > 0 && <div className="attempt-cue" role="status">{t({ uz: "Modelda teng bo'linmalarni ajrating: maxraj ulush o'lchamini ko'rsatadi.", ru: 'Выделите равные деления модели: знаменатель показывает размер доли.', en: 'Identify the equal divisions in the model: the denominator shows the size of each part.' })}</div>}{!modelChoices && <Options values={c.options} picked={picked} onPick={pick} correctIndex={c.correctIndex} solved={solved} disabled={!narrationReady}/>}<FeedbackBlock show={picked !== null} correct={solved} proof={solved && c.proof ? t(c.proof) : null}>{picked !== null ? t(c.feedback[picked]) : ''}</FeedbackBlock></section></div></Stage>;
}

function Screen0({ screen, storedAnswer, onAnswer, onNext }) {
  const t = useT();
  const c = CONTENT.s0;
  const audio = useNarration(c.audio, screen);
  const narrationReady = audio.muted || audio.completed;
  const frame = audio.frame;
  const [picked, setPicked] = useState(storedAnswer?.neutralChoice ?? null);
  const pick = (index) => { if (!narrationReady) return; setPicked(index); audio.pushOneOff(t(c.neutral)); onAnswer({ screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question), options: c.options.map(t), correctIndex: null, correctAnswer: null, studentAnswerIndex: index, studentAnswer: t(c.options[index]), correct: true, firstTry: true, attempts: 1, solved: true, neutralChoice: index }); };
  return <Stage screen={screen} audio={audio} onNext={onNext} nextDisabled={picked === null || !narrationReady}><div className="stack hook-stack" data-g4-screen="hook"><Heading c={c} bit="think" hook/><h2 className="hook-question-prompt" data-g4-role="hook-question">{t(c.question)}</h2><section className="hook-scene-adapter" data-g4-role="hook-scene"><div className="hook-scene-visual" data-g4-role="visual-frame"><section className="hook-model"><FractionBar den={8} cyan={2} lime={frame >= 1 ? 3 : 0} label={frame >= 2 ? <span><Frac n="2" d="8"/> + <Frac n="3" d="8"/> = <Frac n="5" d="16"/> ?</span> : null}/></section><div className="hook-frame-bit" data-g4-role="hook-bit"><BitSVG state="think"/></div></div></section><section className="question" data-g4-role="answer-card"><h2>{t(c.question)}</h2><Options values={c.options} picked={picked} onPick={pick} neutral disabled={!narrationReady}/><FeedbackBlock show={picked !== null} correct>{t(c.neutral)}</FeedbackBlock></section></div></Stage>;
}

function Screen1({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s1; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [strategyUsed, setStrategyUsed] = useState(false); const frame = audio.frame;
  const [unitTapped, setUnitTapped] = useState(false);
  const unitFeedback = { uz: "Har bir bo'linma sakkizdan bir ulushni ko'rsatadi.", ru: 'Каждое деление показывает одну восьмую долю.', en: 'Each division represents one eighth.' };
  const revealUnit = () => { setUnitTapped(true); audio.pushOneOff(t(unitFeedback)); };
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!strategyUsed || !narrationReady}><div className="stack"><Heading c={c}/><section className="model-card"><FractionBar den={frame === 0 ? 1 : 8} cyan={frame >= 2 ? 2 : 0} lime={frame >= 2 ? 3 : 0} divisions={frame >= 1}/><button type="button" className="tiny-action" aria-pressed={unitTapped} onClick={revealUnit}>{t({ uz: "Har biri 1/8", ru: 'Каждая часть: 1/8', en: 'Each part: 1/8' })}</button><FeedbackBlock show={unitTapped} correct>{t(unitFeedback)}</FeedbackBlock><div className={'state-note ' + (frame >= 3 ? 'show' : '')}>{t({ uz: "Ikkalasi ham bir xil sakkizdan ulushlar", ru: 'Обе величины состоят из одинаковых восьмых долей', en: 'Both amounts are made of equal eighths' })}</div></section><button type="button" className="strategy-replay" disabled={!narrationReady} onClick={() => { setStrategyUsed(true); audio.replay(); }}>{t({ uz: "Qadamlarni qayta ko'rish", ru: 'Повторить шаги', en: 'Replay the steps' })}</button></div></Stage>;
}
function Screen2({ screen, onNext, onPrev }) {
  const t = useT();
  const c = CONTENT.s2; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [strategyUsed, setStrategyUsed] = useState(false); const frame = audio.frame;
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!strategyUsed || !narrationReady}><div className="stack"><Heading c={c}/><section className="model-card"><FractionBar den={8} cyan={Math.min(frame, 2)} label={frame >= 3 ? <Frac n="2" d="8" size="lg"/> : null}/></section><button type="button" className="strategy-replay" disabled={!narrationReady} onClick={() => { setStrategyUsed(true); audio.replay(); }}>{t({ uz: "Qadamlarni qayta ko'rish", ru: 'Повторить шаги', en: 'Replay the steps' })}</button></div></Stage>;
}

function Screen3({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s3; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [strategyUsed, setStrategyUsed] = useState(false); const frame = audio.frame;
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!strategyUsed || !narrationReady}><div className="stack"><Heading c={c}/><section className="model-card"><FractionBar den={8} cyan={2} lime={frame >= 2 ? 3 : 0}/>{frame >= 1 && <div className="tokens"><i/><i/><i/><span>{t({ uz: "yana 3 ta ulush", ru: 'ещё 3 доли', en: '3 more parts' })}</span></div>}<div className={'formula-card ' + (frame >= 3 ? 'show' : '')}><Frac n="2" d="8"/> + <Frac n="3" d="8"/></div></section><button type="button" className="strategy-replay" disabled={!narrationReady} onClick={() => { setStrategyUsed(true); audio.replay(); }}>{t({ uz: "Qadamlarni qayta ko'rish", ru: 'Повторить шаги', en: 'Replay the steps' })}</button></div></Stage>;
}

function Screen4({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s4; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [strategyUsed, setStrategyUsed] = useState(false); const frame = audio.frame;
  const [groupView, setGroupView] = useState(null);
  const merged = groupView ?? frame >= 2;
  const toggleGroups = () => setGroupView((current) => !(current ?? frame >= 2));
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!strategyUsed || !narrationReady}><div className="stack"><Heading c={c} bit="idea"/><section className="model-card"><FractionBar den={8} cyan={merged ? 5 : 2} lime={merged ? 0 : 3} merged={merged}/><button type="button" className="tiny-action" aria-pressed={merged} onClick={toggleGroups}>{merged ? t({ uz: "Ikki guruhni ko'rsatish", ru: 'Показать две группы', en: 'Show two groups' }) : t({ uz: "Bitta guruhga birlashtirish", ru: 'Объединить в одну группу', en: 'Combine into one group' })}</button><div className={'formula-card ' + (frame >= 1 ? 'show' : '')}>2 + 3 = 5</div><div className={'result-chip ' + (frame >= 3 ? 'show' : '')}><Frac n="5" d="8" size="lg"/></div></section><button type="button" className="strategy-replay" disabled={!narrationReady} onClick={() => { setStrategyUsed(true); audio.replay(); }}>{t({ uz: "Qadamlarni qayta ko'rish", ru: 'Повторить шаги', en: 'Replay the steps' })}</button></div></Stage>;
}
function Screen5({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s5; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [strategyUsed, setStrategyUsed] = useState(false); const frame = audio.frame;
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!strategyUsed || !narrationReady}><div className="stack"><Heading c={c}/><section className="rule-card"><div className={'rule-line ' + (frame >= 0 ? 'show' : '')}>(2 + 3) / 8</div><div className={'rule-line accent ' + (frame >= 1 ? 'show' : '')}>5 / 8</div><div className={'state-note ' + (frame >= 2 ? 'show' : '')}>{t({ uz: "8 ta bo'linma o'zgarmadi", ru: '8 делений не изменились', en: 'The 8 divisions did not change' })}</div><div className={'wrong-formula ' + (frame >= 3 ? 'show' : '')}>5 / 16</div></section><button type="button" className="strategy-replay" disabled={!narrationReady} onClick={() => { setStrategyUsed(true); audio.replay(); }}>{t({ uz: "Qadamlarni qayta ko'rish", ru: 'Повторить шаги', en: 'Replay the steps' })}</button></div></Stage>;
}

function Screen6({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s6; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [strategyUsed, setStrategyUsed] = useState(false); const [marker, setMarker] = useState(4);
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!strategyUsed || !narrationReady}><div className="stack"><Heading c={c}/><section className="model-card"><NumberLine den={8} first={2} second={5} frame={audio.frame} marker={marker}/><label className="marker-control"><span>{t({ uz: "Erkin belgi", ru: 'Свободная метка' , en: "Free marker"})}: {marker}/8</span><input className="free-marker" type="range" min="0" max="8" step="1" value={marker} onChange={(event) => setMarker(Number(event.target.value))}/></label><div className={'formula-card ' + (audio.frame >= 3 ? 'show' : '')}><Frac n="2" d="8"/> + <Frac n="3" d="8"/> = <Frac n="5" d="8"/></div></section><button type="button" className="strategy-replay" disabled={!narrationReady} onClick={() => { setStrategyUsed(true); audio.replay(); }}>{t({ uz: "Qadamlarni qayta ko'rish", ru: 'Повторить шаги', en: 'Replay the steps' })}</button></div></Stage>;
}
function Screen7({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s7; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [strategyUsed, setStrategyUsed] = useState(false); const frame = audio.frame;
  const label = frame === 0 ? <Frac n="3" d="6"/> : frame === 1 ? <span><Frac n="3" d="6"/> + <Frac n="3" d="6"/></span> : <Frac n="6" d="6"/>;
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!strategyUsed || !narrationReady}><div className="stack"><Heading c={c}/><section className="whole-card"><FractionBar den={6} cyan={3} lime={frame >= 1 ? 3 : 0} merged={frame >= 2} label={label}/><div className={'formula-card ' + (frame >= 3 ? 'show' : '')}><Frac n="6" d="6"/> = 1</div><div className={'state-note ' + (frame >= 4 ? 'show' : '')}>{t({ uz: "Suratlarni qo'shing, maxrajni saqlang", ru: 'Сложи числители, сохрани знаменатель', en: 'Add the numerators and keep the denominator' })}</div></section><button type="button" className="strategy-replay" disabled={!narrationReady} onClick={() => { setStrategyUsed(true); audio.replay(); }}>{t({ uz: "Qadamlarni qayta ko'rish", ru: 'Повторить шаги', en: 'Replay the steps' })}</button></div></Stage>;
}

function Screen8(props) { return <ChoiceExercise {...props}/>; }
function Screen9(props) { return <ChoiceExercise {...props} modelChoices/>; }
function Screen10(props) { return <ChoiceExercise {...props}/>; }
function Screen11(props) { return <ChoiceExercise {...props} bit="happy" visual={<div className="bit-error"><span>2/8 + 3/8</span><b>= 5/16</b></div>}/>; }
function Screen12(props) { return <ChoiceExercise {...props} visual={<RuleBoundaryModels operation="+"/>}/>; }
function Screen13(props) { return <ChoiceExercise {...props} renderVisual={({ frame }) => <div className="energy-model"><div><span>☀</span><FractionBar den={10} cyan={3} compact/></div><strong className={'context-step ' + (frame >= 1 ? 'show' : '')}>+</strong><div className={'context-step ' + (frame >= 1 ? 'show' : '')}><span>≈</span><FractionBar den={10} lime={4} compact/></div></div>}/>; }

function G4TitleReveal({ active, title, onComplete }) {
  const t = useT();
  const [visible, setVisible] = useState(false);
  const wasActiveRef = useRef(active);
  useEffect(() => {
    const wasActive = wasActiveRef.current;
    wasActiveRef.current = active;
    if (!active || wasActive || typeof window === 'undefined') return undefined;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const frame = window.requestAnimationFrame(() => setVisible(true));
    const timer = window.setTimeout(() => { setVisible(false); onComplete?.(); }, reduced ? 120 : 3900);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [active, onComplete]);
  if (!visible || typeof document === 'undefined') return null;
  return createPortal(<div className="rank-boost-overlay g4-title-reveal-overlay" data-g4-role="rank-overlay" role="status" aria-live="assertive" aria-atomic="true"><div className="rank-boost-card g4-title-reveal-card"><div className="rank-boost-rays g4-title-reveal-rays" aria-hidden="true"/><div className="rank-boost-confetti g4-title-reveal-confetti" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <i key={index}/>)}</div><div className="rank-boost-medal g4-title-reveal-medal" aria-hidden="true">★</div><h2 className="g4-title-reveal-title">{t(title)}</h2></div></div>, document.body);
}

function G4TitleCard({ title, answers = [] }) {
  const t = useT();
  const scored = SCREEN_META.map((item, index) => item.scored ? index : null).filter((index) => index !== null);
  const firstTry = scored.filter((index) => answers[index]?.firstTry === true).length;
  return <aside className="g4-title-card g4-title-card-stage" data-g4-role="title-card" role="status" aria-live="polite"><div className="g4-title-card-confetti" data-g4-role="reward-confetti" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i key={index}/>)}</div><div className="g4-title-card-bit" data-g4-role="reward-bit"><BitSVG state="happy"/></div><div className="g4-title-card-medal" data-g4-role="reward-medal" aria-hidden="true">★</div><span className="g4-title-card-kicker">{t({ uz: 'UNVON OLINDI', ru: 'ЗВАНИЕ ПОЛУЧЕНО', en: 'TITLE EARNED' })}</span><h2 className="g4-title-card-title">{t(title)}</h2><div className="g4-title-card-score"><strong>{firstTry}/{scored.length}</strong><span>{t({ uz: 'birinchi urinishda', ru: 'с первой попытки', en: 'on the first try' })}</span></div></aside>;
}

function G4FinalTitleReward({ ready, titleClaimed, reflectionChoice, onClaim, title, answers }) {
  const t = useT();
  const [revealRequested, setRevealRequested] = useState(false);
  const completeReveal = () => { setRevealRequested(false); onClaim(); };
  return <><G4TitleReveal active={revealRequested} title={title} onComplete={completeReveal}/>{titleClaimed && <G4TitleCard title={title} answers={answers}/>} {!titleClaimed && <button type="button" className="g4-title-claim" data-g4-role="title-claim" disabled={!ready || reflectionChoice === null || revealRequested} onClick={() => setRevealRequested(true)}><span aria-hidden="true">★</span><strong>{t({ uz: 'Unvonni olish', ru: 'Получить звание', en: 'Claim title' })}</strong><small>{t(title)}</small></button>}</>;
}

const ReflectionPanel = ({ choices, choice, onChoose, disabled }) => {
  const t = useT();
  return <section className="final-reflection" data-g4-role="reflection"><strong>{t({ uz: "Qaysi tekshiruv usulidan foydalanasiz?", ru: 'Какой способ проверки вы выберете?', en: 'Which checking strategy will you use?' })}</strong><div>{choices.map((item, index) => <button type="button" key={index} className={choice === index ? 'is-selected' : ''} aria-pressed={choice === index} disabled={disabled} onClick={() => onChoose(index)}><span>{index + 1}</span>{t(item)}</button>)}</div></section>;
};

function Screen14({ screen, storedAnswer, answers, onAnswer, onPrev, finishLesson }) {
  const t = useT(); const c = CONTENT.s14; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [reflectionChoice, setReflectionChoice] = useState(storedAnswer?.reflectionChoice ?? null); const [titleClaimed, setTitleClaimed] = useState(storedAnswer?.titleClaimed === true); const title = { uz: "Kasrlar yig'indisi ustasi", ru: 'Мастер суммы дробей', en: 'Fraction Addition Master' }; const reflectionOptions = [{ uz: 'Model bilan tekshiraman', ru: 'Проверю по модели', en: 'I will check with a model' }, { uz: 'Qoida va birlikni tekshiraman', ru: 'Проверю правило и единицу', en: 'I will check the rule and unit' }, { uz: 'Teskari amal bilan tekshiraman', ru: 'Проверю обратным действием', en: 'I will use the inverse operation' }]; const chooseReflection = (index) => { if (!narrationReady || titleClaimed) return; setReflectionChoice(index); onAnswer({ ...(storedAnswer ?? {}), screenIdx: screen, stage: null, reflectionChoice: index, titleClaimed: false }); audio.pushOneOff(t(reflectionOptions[index])); }; const claimTitle = () => { if (!narrationReady || reflectionChoice === null || titleClaimed) return; setTitleClaimed(true); onAnswer({ screenIdx: screen, stage: null, question: t({ uz: 'Tanlangan tekshiruv', ru: 'Выбранная проверка', en: 'Chosen check' }), options: reflectionOptions.map(t), correctIndex: null, correctAnswer: null, studentAnswerIndex: reflectionChoice, studentAnswer: t(reflectionOptions[reflectionChoice]), correct: true, firstTry: true, attempts: 1, solved: true, reflectionChoice, titleClaimed: true }); }; const frame = audio.frame; const complete = frame >= 4;
  const takeaways = [
    { label: { uz: "Birinchi qism", ru: 'Первая часть', en: 'First part' }, value: '2/8' },
    { label: { uz: "Ikkinchi qism", ru: 'Вторая часть', en: 'Second part' }, value: '+ 3/8' },
    { label: { uz: "Ulushlar soni", ru: 'Число долей', en: 'Number of parts' }, value: '2 + 3 = 5' },
    { label: { uz: "Natija", ru: 'Результат' , en: "Result"}, value: '5/8' },
  ];
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={titleClaimed ? finishLesson : undefined} nextDisabled={!titleClaimed} finish><div className="stack"><section className="finale-heading"><span>◆ {t({ uz: "YAKUNIY BOSQICH", ru: 'ФИНАЛЬНЫЙ ЭТАП' , en: "FINAL STAGE"})}</span><h1>{t(c.title)}</h1><p>{t({ uz: "Ikki yetkazib berishni bitta bakda to'g'ri birlashtirdik.", ru: 'Мы правильно объединили две поставки в одном баке.', en: 'We combined the two deliveries correctly in one tank.' })}</p></section><section className="finale-main"><div className="finale-payoff"><small>{t({ uz: "BOSHLANG'ICH MISSIYA YECHIMI", ru: 'РЕШЕНИЕ СТАРТОВОЙ МИССИИ', en: 'STARTING MISSION SOLUTION' })}</small><FractionBar den={8} cyan={2} lime={frame >= 1 ? 3 : 0} merged={frame >= 3}/><div className={'finale-answer ' + (frame >= 3 ? 'show' : '')}><Frac n="2" d="8"/> + <Frac n="3" d="8"/> = <Frac n="5" d="8"/></div></div><div className="finale-takeaways">{takeaways.map((item, index) => <div className={'finale-takeaway ' + (frame >= index ? 'show' : '')} key={t(item.label)}><b>{index + 1}</b><span><small>{t(item.label)}</small><strong>{item.value}</strong></span></div>)}</div></section><section className="finale-bottom"><div className={'finale-bridge ' + (complete ? 'show' : '')}><small>{t({ uz: "KEYINGI MAVZU", ru: 'СЛЕДУЮЩАЯ ТЕМА' , en: "NEXT TOPIC"})}</small><strong>{t({ uz: "Bir xil maxrajli kasrlarni ayirish", ru: 'Вычитание дробей с одинаковыми знаменателями', en: 'Subtracting fractions with the same denominator' })}</strong></div><ReflectionPanel choices={reflectionOptions} choice={reflectionChoice} onChoose={chooseReflection} disabled={!narrationReady || titleClaimed}/><G4FinalTitleReward ready={narrationReady} titleClaimed={titleClaimed} reflectionChoice={reflectionChoice} onClaim={claimTitle} title={title} answers={answers}/></section></div></Stage>;
}

const SCREENS = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14];

export default function Grade4Dars20({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished, previewMode }) {
  const normalizedLang = normalizeLang(langProp);
  const preview = previewMode ?? (langProp === undefined || langProp === null);
  const [previewLang, setPreviewLang] = useState(normalizedLang);
  const lang = preview ? previewLang : normalizedLang;
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
    if (onFinished) onFinished(payload); else console.log('[Grade4 Dars20 preview]', payload);
  }, [answers, lang, onFinished, studentName]);
  const Current = SCREENS[current];
  return <LangContext.Provider value={lang}><style>{STYLES + G4_ETALON_OVERRIDES}</style><div className={'lesson-root ' + (preview ? 'lesson-root-preview' : '')}>{preview && <div className="preview-language" aria-label={{ uz: "Ko'rib chiqish tili", ru: 'Язык предпросмотра', en: 'Preview language' }[lang]}>{SUPPORTED_LANGS.map((code) => <button type="button" key={code} className={previewLang === code ? 'preview-active' : ''} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>)}</div>}<Current key={current} screen={current} storedAnswer={answers[current]} answers={answers} onAnswer={recordAnswer} onPrev={() => setCurrent((value) => Math.max(0, value - 1))} onNext={() => setCurrent((value) => Math.min(TOTAL_SCREENS - 1, value + 1))} finishLesson={finishLesson}/></div></LangContext.Provider>;
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
.rank-boost-overlay{position:fixed;inset:0;z-index:120;padding:0;display:grid;place-items:center;overflow:hidden;overscroll-behavior:contain;background:rgba(8,13,24,.64);backdrop-filter:blur(2px) saturate(.78);animation:g4-title-reveal-life 3.9s ease both}
[data-g4-role="title-card"]{position:relative;isolation:isolate;max-width:100%;overflow:hidden}
[data-g4-role="title-claim"]{font-family:'Manrope',system-ui,sans-serif}
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
  .lesson-root .feedback[data-g4-role~="feedback-frame"] p{font-size:14px!important}
}
@media(prefers-reduced-motion:reduce){.rank-boost-overlay,.rank-boost-overlay * ,[data-g4-role="title-card"],[data-g4-role="title-card"] *{animation:none!important;transition:none!important}.rank-boost-overlay{opacity:1}.g4-title-reveal-confetti,.g4-title-card-confetti{display:none!important}}
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
.lesson-root{position:fixed;inset:0;width:100%;height:100dvh;min-height:0;overflow:hidden;color:${T.ink};background:radial-gradient(circle at 88% 9%,rgba(22,143,163,.11),transparent 25%),linear-gradient(145deg,#F7F8F4,#EEF3F1);font-family:'Manrope',system-ui,sans-serif}
.stage{width:min(936px,100%);height:100dvh;margin:0 auto;display:flex;flex-direction:column;overflow:hidden}.stage-header{flex-shrink:0;padding-top:10px;padding-bottom:8px;background:rgba(247,248,244,.88);backdrop-filter:blur(14px);z-index:5}.progress-track{width:100%;height:6px;margin-bottom:10px;border-radius:999px;background:rgba(80,97,109,.16);overflow:hidden}.progress-fill{height:100%;border-radius:inherit;background:linear-gradient(90deg,${T.cyan},${T.accent});box-shadow:0 0 12px rgba(255,91,53,.42);transition:width .45s ease}.stage-chrome{min-width:0;display:flex;justify-content:space-between;align-items:center;gap:12px}.chrome-title,.chrome-actions,.audio-controls{display:flex;align-items:center;gap:9px}.chrome-title{min-width:0;overflow:hidden;color:${T.ink2};font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}.chrome-title>span:last-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.chrome-actions{flex:none}.status-dot{width:8px;height:8px;flex:none;border-radius:50%;background:${T.accent};box-shadow:0 0 10px rgba(255,91,53,.65)}.screen-type{padding:4px 8px;border-radius:999px;color:${T.cyan};background:${T.cyanSoft};font-size:10px;font-weight:800}.screen-count{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700}.icon-btn{width:44px;height:44px;padding:0;border:0;border-radius:10px;color:${T.ink2};background:rgba(255,255,255,.75);cursor:pointer;box-shadow:0 4px 12px -7px rgba(${T.shadowBase},.3)}
.stage-content{flex:1 1 auto;min-height:0;padding-top:10px;padding-bottom:16px;overflow:hidden}.stage-nav{flex:0 0 auto;min-height:72px;display:flex;align-items:center;justify-content:space-between;gap:12px;background:rgba(245,245,240,.95)}.btn-white-accent,.btn-ghost{min-width:128px;min-height:50px;padding:0 18px;border:0;border-radius:15px;cursor:pointer;font-weight:900}.btn-white-accent{color:${T.accent};background:#fff;box-shadow:0 12px 24px -17px rgba(255,91,53,.8)}.btn-white-accent:hover:not(:disabled){color:#fff;background:${T.accent}}.btn-white-accent:disabled{opacity:.42;cursor:not-allowed}.btn-ghost{color:${T.ink2};background:transparent}.btn-ghost:hover{background:#fff;box-shadow:0 10px 20px -16px rgba(${T.shadowBase},.5)}.compact{min-width:118px}.stack{height:100%;min-height:0;overflow:hidden;display:grid;align-content:center;gap:14px;animation:page-in .45s cubic-bezier(.16,1,.3,1) both}.heading{min-height:78px;display:flex;align-items:center;justify-content:space-between;gap:16px}.heading>div>span{color:${T.cyan};font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.heading h1{margin-top:4px!important;font:750 clamp(25px,4vw,38px)/1.06 'Source Serif 4',Georgia,serif}.heading .g1-char{width:78px;height:98px;flex:0 0 auto;overflow:visible;filter:drop-shadow(0 9px 11px rgba(23,59,82,.2))}.question,.model-card,.duel,.why-grid,.compare-card,.rule-card,.boundary,.summary-grid{padding:18px;border-radius:22px;background:rgba(255,255,255,.9);box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.48)}.question{display:grid;gap:13px}.question h2{font:720 clamp(17px,2.5vw,22px)/1.25 'Source Serif 4',Georgia,serif}.options{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.option{min-height:62px;padding:10px;border:0;border-radius:16px;display:grid;grid-template-columns:28px 1fr;align-items:center;gap:8px;color:${T.ink};background:#F8F8F4;text-align:left;cursor:pointer;box-shadow:0 10px 22px -20px rgba(${T.shadowBase},.46)}.option>b{width:27px;height:27px;border-radius:9px;display:grid;place-items:center;color:${T.cyan};background:${T.cyanSoft};font:900 11px 'JetBrains Mono',monospace}.option.picked{transform:translateY(-2px);background:${T.accentSoft};box-shadow:inset 0 0 0 2px rgba(255,91,53,.27)}.option.right{background:${T.successSoft};box-shadow:inset 0 0 0 2px rgba(34,122,83,.25)}.option.bad{background:${T.warnSoft};box-shadow:inset 0 0 0 2px rgba(169,111,19,.25)}.feedback{padding:12px 14px;border-radius:15px;display:grid;grid-template-columns:28px 1fr;gap:9px;align-items:start;opacity:0;transform:translateY(7px)}.feedback.open{opacity:1;transform:none;transition:.3s ease}.feedback.correct{background:${T.successSoft};box-shadow:inset 4px 0 ${T.success}}.feedback.wrong{background:${T.warnSoft};box-shadow:inset 4px 0 ${T.warn}}.feedback>b{font-size:18px}.feedback p{font-size:13px;line-height:1.45}.caption{position:static;bottom:4px;margin-top:12px;padding:9px 13px;border-radius:13px;color:#fff;background:rgba(23,59,82,.94);font-size:12px;line-height:1.4;z-index:3}
.proof{padding:12px;border-radius:14px;color:${T.success};background:${T.successSoft};text-align:center;font:900 15px 'JetBrains Mono',monospace;animation:proof-in .35s ease both}.frac{display:inline-flex;min-width:25px;flex-direction:column;align-items:center;vertical-align:middle;color:inherit;font:800 1em/1 'JetBrains Mono',monospace}.frac i{width:100%;height:2px;margin:2px 0;border-radius:2px;background:currentColor}.frac-lg{font-size:1.35em}.hook-model,.whole-card,.rule-card,.finale-payoff{padding:18px;border-radius:22px;background:rgba(255,255,255,.9);box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.48)}
.lesson-root button:focus-visible,.lesson-root input:focus-visible,.lesson-root input[type='range']:focus-visible{outline:3px solid ${T.cyan};outline-offset:3px}
.hook-model{display:grid;place-items:center;gap:12px;background:linear-gradient(135deg,#E5F5F6,#FFF)}.fraction-model{width:min(620px,94%);margin:0 auto;display:grid;gap:10px}.fraction-bar{height:112px;display:grid;overflow:hidden;border-radius:18px;background:#F4F5F1;box-shadow:inset 0 0 0 3px rgba(23,59,82,.16)}.fraction-bar i{min-width:0;border-right:2px solid rgba(23,59,82,.18);background:#F4F5F1;transition:background .45s ease,transform .45s ease}.fraction-bar i:last-child{border-right:0}.fraction-bar i.cyan{background:#46B8C5}.fraction-bar i.lime{background:#95C93D}.fraction-bar i.merged{background:linear-gradient(135deg,#168FA3,#95C93D)}.fraction-bar.whole i{border-right:0}.fraction-model.compact .fraction-bar{height:48px;border-radius:11px}.model-label{justify-self:center;padding:8px 13px;border-radius:12px;color:#173B52;background:#E5F5F6;font:900 16px "JetBrains Mono",monospace}.state-note,.formula-card,.result-chip{padding:12px 15px;border-radius:14px;opacity:.12;transform:translateY(7px);transition:.4s ease;text-align:center}.state-note{color:#227A53;background:#E7F3EC;font-size:13px;font-weight:850}.formula-card{color:#FFF;background:#173B52;font:900 17px "JetBrains Mono",monospace}.result-chip{justify-self:center;color:#FFF;background:#FF5B35;font:900 20px "JetBrains Mono",monospace}.show{opacity:1!important;transform:none!important}.tokens{display:flex;align-items:center;justify-content:center;gap:8px;color:#50616D;font-size:12px;font-weight:800}.tokens i{width:28px;height:28px;border-radius:9px;background:#95C93D;animation:token-pop .4s ease both}.tokens i:nth-child(2){animation-delay:.1s}.tokens i:nth-child(3){animation-delay:.2s}.rule-card,.whole-card{display:grid;gap:12px}.rule-line{padding:13px;border-radius:14px;opacity:.12;transform:translateY(6px);color:#173B52;background:#E5F5F6;text-align:center;font:900 18px "JetBrains Mono",monospace;transition:.4s ease}.rule-line.accent{color:#FFF;background:#173B52}.wrong-formula{padding:12px;position:relative;opacity:.12;color:#A96F13;background:#FFF5D9;text-align:center;font:900 18px "JetBrains Mono",monospace;transition:.4s ease}.wrong-formula::after{content:"";position:absolute;left:28%;right:28%;top:50%;height:3px;transform:rotate(-8deg);background:#FF5B35}.number-line{height:150px;position:relative;padding:54px 7% 0}.nl-track{height:4px;position:relative;border-radius:4px;background:#173B52}.nl-tick{width:2px;height:18px;position:absolute;top:-7px;background:#87949D}.nl-tick span{position:absolute;top:20px;left:50%;transform:translateX(-50%);font:800 12px "JetBrains Mono",monospace}.nl-dot{width:44px;height:38px;position:absolute;top:27px;transform:translateX(-50%);border-radius:12px;display:grid;place-items:center;color:#FFF;font:900 11px "JetBrains Mono",monospace;z-index:2;animation:dot-pop .35s ease both}.nl-dot.cyan{background:#168FA3}.nl-dot.lime{background:#95C93D}.nl-arrow{height:22px;position:absolute;top:84px;border-top:3px solid #FF5B35;border-right:3px solid #FF5B35;border-radius:0 14px 0 0;animation:arrow-grow .45s ease both}.nl-arrow::after{content:"";position:absolute;right:-5px;top:-7px;border-left:8px solid #FF5B35;border-top:5px solid transparent;border-bottom:5px solid transparent}.model-choices{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.model-choices>div{padding:10px;border-radius:15px;display:grid;grid-template-columns:26px 1fr;align-items:center;gap:6px;background:#FFF;box-shadow:0 12px 24px -20px rgba(58,53,48,.6)}.model-choices>div>b{width:25px;height:25px;border-radius:8px;display:grid;place-items:center;color:#FFF;background:#168FA3;font:900 10px "JetBrains Mono",monospace}.bit-error{padding:14px;border-radius:18px;display:flex;align-items:center;justify-content:center;gap:12px;color:#A96F13;background:#FFF5D9;font:900 19px "JetBrains Mono",monospace}.bit-error b{position:relative}.bit-error b::after{content:"";position:absolute;left:-5px;right:-5px;top:50%;height:3px;transform:rotate(-8deg);background:#FF5B35}.context-step{opacity:.12;transform:translateY(6px);transition:opacity .38s ease,transform .38s ease}.energy-model{display:grid;grid-template-columns:1fr 32px 1fr;align-items:center;gap:8px}.energy-model>div{padding:10px;border-radius:15px;display:grid;grid-template-columns:30px 1fr;align-items:center;gap:8px;background:#FFF}.energy-model>div>span{font-size:23px}.energy-model>strong{text-align:center;color:#FF5B35;font-size:23px}.finale-heading{padding:11px 15px;border-radius:17px;background:linear-gradient(100deg,rgba(255,91,53,.09),transparent 52%),rgba(255,255,255,.92);box-shadow:0 13px 28px -24px rgba(255,91,53,.72)}.finale-heading>span{color:#FF5B35;font:900 9px "JetBrains Mono",monospace;letter-spacing:.12em}.finale-heading h1{margin-top:4px!important;color:#173B52;font:750 clamp(21px,3vw,28px)/1.08 "Source Serif 4",Georgia,serif}.finale-heading p{margin-top:4px!important;color:#50616D;font-size:11px}.finale-main{display:grid;grid-template-columns:minmax(270px,.9fr) minmax(310px,1.1fr);gap:10px}.finale-payoff{display:grid;align-content:center;gap:8px}.finale-payoff>small{color:#168FA3;font-size:9px;font-weight:900;letter-spacing:.09em}.finale-answer{padding:8px 10px;border-radius:11px;opacity:.14;transform:translateY(5px);color:#227A53;background:#E7F3EC;text-align:center;font:900 13px "JetBrains Mono",monospace;transition:.42s ease}.finale-takeaways{display:grid;gap:6px}.finale-takeaway{min-height:42px;padding:7px 10px;border-radius:12px;display:grid;grid-template-columns:27px 1fr;align-items:center;gap:8px;opacity:.14;transform:translateY(6px);background:#F8F8F4;transition:.42s ease}.finale-takeaway.show{background:#E5F5F6}.finale-takeaway>b{width:26px;height:26px;border-radius:9px;display:grid;place-items:center;color:#FFF;background:#168FA3;font:900 9px "JetBrains Mono",monospace}.finale-takeaway span{display:grid;gap:2px;font-size:11px;font-weight:800}.finale-takeaway small{color:#168FA3;font-size:8px;text-transform:uppercase}.finale-takeaway strong{color:#173B52;font-family:"JetBrains Mono",monospace}.finale-bottom{display:grid;grid-template-columns:1.2fr .8fr;gap:10px}.finale-bridge{padding:12px 15px;border-radius:16px;display:grid;align-content:center;gap:4px;opacity:.14;transform:translateY(6px);color:#FFF;background:#173B52;transition:.42s ease}.finale-bridge small{color:#98E1E5;font-size:9px;font-weight:900;letter-spacing:.1em}.finale-bridge strong{font:750 15px "Source Serif 4",Georgia,serif}.finale-reward{min-height:100px;position:relative;overflow:hidden;padding:12px 70px 11px 52px;border-radius:17px;display:grid;align-content:center;color:#FFF;background:linear-gradient(135deg,#234B62,#173B52)}.finale-reward>div:nth-child(2){display:grid;gap:3px}.finale-reward small{color:#98E1E5;font-size:8px;font-weight:900}.finale-reward strong{font:750 14px "Source Serif 4",Georgia,serif}.finale-reward b{color:#FFE284;font:900 11px "JetBrains Mono",monospace}.finale-reward>.g1-char{position:absolute;right:2px;bottom:-5px;width:67px;height:84px}.finale-medal{position:absolute;left:10px;top:50%;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;transform:translateY(-50%);color:#173B52;background:#95C93D}.preview-language{position:fixed;top:9px;right:9px;z-index:30;display:flex;gap:3px;padding:3px;border-radius:999px;background:rgba(255,255,255,.94)}.preview-language button{padding:4px 9px;border:0;border-radius:999px;background:transparent;cursor:pointer;font-size:10px;font-weight:900}.preview-language .preview-active{color:#FFF;background:#FF5B35}.tiny-action{min-height:46px;padding:8px 12px;border:0;border-radius:13px;justify-self:end;color:${T.accent};background:${T.accentSoft};cursor:pointer;box-shadow:0 8px 18px -16px rgba(${T.shadowBase},.5);font-size:12px;font-weight:800}.marker-control{width:min(620px,94%);padding:10px 13px;border-radius:14px;display:grid;gap:7px;color:${T.navy};background:${T.cyanSoft};font:850 12px 'Manrope',sans-serif}.free-marker{width:100%;min-height:44px;margin:0;accent-color:${T.accent};cursor:pointer}.nl-dot.free{top:102px;background:${T.navy};animation-duration:.4s}.attempt-model{border-radius:20px;transition:box-shadow .32s ease,background .32s ease}.attempt-highlight{box-shadow:0 0 0 3px rgba(22,143,163,.38),0 14px 26px -20px rgba(22,143,163,.8)!important;background:rgba(229,245,246,.72)!important}.attempt-cue{padding:9px 12px;border-radius:12px;color:${T.cyan};background:${T.cyanSoft};font-size:12px;font-weight:850;animation:attempt-cue-in .3s ease both}.stack{animation-duration:.5s}.caption{animation:caption-in .32s ease both}.formula-card{transition-duration:.32s!important}.result-chip{transition-duration:.22s!important}
@keyframes caption-in{from{opacity:0;transform:translateY(5px)}}@keyframes attempt-cue-in{from{opacity:0;transform:translateY(5px)}}@keyframes page-in{from{opacity:0;transform:translateY(10px)}}@keyframes proof-in{from{opacity:0;transform:translateY(5px)}}@keyframes token-pop{from{opacity:0;transform:scale(.45)}}@keyframes dot-pop{from{opacity:0;transform:translateX(-50%) scale(.55)}}@keyframes arrow-grow{from{transform:scaleX(0);transform-origin:left}}@keyframes bit-move{to{transform:translateY(-2px) rotate(2deg)}}@keyframes pulse{to{transform:scale(1.07)}}
@media(max-width:639.98px){.stage-header{padding-top:58px}.screen-type{display:none}.stage{width:min(390px,100%)}.heading{min-height:72px}.heading h1{font-size:26px}.heading .g1-char{width:65px;height:80px}.model-card,.hook-model,.whole-card,.rule-card,.question{padding:13px;border-radius:18px}.options{grid-template-columns:1fr}.option{min-height:52px}.fraction-bar{height:82px}.model-choices{grid-template-columns:1fr}.energy-model{grid-template-columns:1fr}.energy-model>strong{transform:rotate(90deg)}.stage-nav{min-height:68px}.btn-white-accent,.btn-ghost{min-width:112px;padding:0 12px}.finale-main,.finale-bottom{grid-template-columns:1fr}.finale-main,.finale-bottom{gap:8px}.finale-takeaway{min-height:36px}.number-line{height:135px;padding-inline:9%}}
.g4-title-claim{width:100%;min-height:100px;padding:13px 18px;border:0;border-radius:17px;display:grid;grid-template-columns:42px 1fr;grid-template-rows:auto auto;align-items:center;column-gap:12px;color:#fff;background:linear-gradient(135deg,#0E6978,#173B52);cursor:pointer;text-align:left;box-shadow:0 22px 42px -25px rgba(14,105,120,.9)}.g4-title-claim>span{grid-row:1/3;width:40px;height:40px;border-radius:50%;display:grid;place-items:center;color:#5A3A00;background:linear-gradient(145deg,#FFE284,#FFC23C);font-size:19px}.g4-title-claim>strong{font:750 16px 'Source Serif 4',Georgia,serif}.g4-title-claim>small{color:#A8EAF0;font-size:11px;font-weight:800}
.feedback{min-height:76px!important;padding:11px 15px 11px 10px!important;grid-template-columns:52px 1fr!important;align-items:center!important;gap:11px!important}.feedback.correct{background:linear-gradient(135deg,#DDF2E6,#F7FFF9)!important;box-shadow:inset 5px 0 ${T.success},0 13px 26px -23px rgba(34,122,83,.75)!important}.feedback.wrong{background:linear-gradient(135deg,#FFF0BE,#FFF9E8)!important;box-shadow:inset 5px 0 ${T.warn},0 13px 26px -23px rgba(169,111,19,.72)!important}.feedback-bit{width:50px;height:62px;display:block;overflow:visible}.feedback-bit .g1-char,.feedback-bit .bit,.feedback-bit>svg{width:100%;height:100%}.feedback p{display:grid;gap:7px;font-size:15px!important;line-height:1.48!important}.feedback-proof{padding-top:7px;border-top:1px solid rgba(34,122,83,.2);color:${T.success};font:900 15px/1.35 'JetBrains Mono',monospace}
.model-choices{grid-template-columns:1fr!important;gap:11px!important}.model-choice{width:100%;min-height:100px;padding:11px 13px;border:0;border-radius:16px;display:grid;grid-template-columns:32px minmax(140px,.8fr) minmax(250px,1.2fr);align-items:center;gap:11px;color:${T.ink};background:#fff;cursor:pointer;text-align:left;box-shadow:0 12px 24px -20px rgba(58,53,48,.6)}.model-choice>b{width:30px;height:30px;border-radius:9px;display:grid;place-items:center;color:#fff;background:${T.cyan};font:900 11px 'JetBrains Mono',monospace}.model-choice>span{font-size:14px;font-weight:850}.model-choice .fraction-model{width:100%}.model-choice.picked{background:${T.accentSoft};box-shadow:inset 0 0 0 3px rgba(255,91,53,.25)}.model-choice.right{background:${T.successSoft};box-shadow:inset 0 0 0 3px rgba(34,122,83,.3)}.model-choice.bad{background:${T.warnSoft};box-shadow:inset 0 0 0 3px rgba(169,111,19,.26)}.model-choice:disabled{cursor:default}
.rule-boundary-models{padding:13px;border-radius:19px;display:grid;grid-template-columns:1fr 34px 1fr;align-items:center;gap:10px;background:${T.cyanSoft}}.rule-boundary-models>div{padding:10px;border-radius:14px;display:grid;grid-template-columns:44px 1fr;align-items:center;gap:9px;background:#fff}.rule-boundary-models>strong{text-align:center;color:${T.accent};font:900 24px 'JetBrains Mono',monospace}.rule-boundary-models .frac{font-size:18px}
@media(max-width:639.98px){.g4-title-claim{min-height:88px}.feedback{grid-template-columns:44px 1fr!important}.feedback-bit{width:43px;height:54px}.feedback p{font-size:14px!important}.model-choice{min-height:126px;grid-template-columns:30px 1fr}.model-choice>.fraction-model{grid-column:1/-1}.rule-boundary-models{grid-template-columns:1fr}.rule-boundary-models>strong{transform:rotate(90deg)}}
@media(prefers-reduced-motion:reduce){.lesson-root *,.lesson-root *::before,.lesson-root *::after{scroll-behavior:auto!important;animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important}.state-note,.formula-card,.result-chip,.rule-line,.wrong-formula,.finale-answer,.finale-takeaway,.finale-bridge{opacity:1!important;transform:none!important}}
.caption-slot{flex:none;min-height:38px;padding:6px 10px;border-radius:11px;display:flex;align-items:center;visibility:hidden;color:#fff;background:rgba(23,59,82,.94);font-size:10px;line-height:1.22}.caption-slot.is-visible{visibility:visible}.feedback.feedback-slot{height:76px;min-height:76px;overflow:hidden;visibility:hidden;opacity:0;animation:none}.feedback.feedback-slot.open{visibility:visible;opacity:1}.feedback-bit{width:48px;height:58px;display:block}.feedback-bit .g1-char,.feedback-bit>svg{width:100%;height:100%}.feedback-proof{display:block;margin-top:4px;padding-top:4px;border-top:1px solid rgba(34,122,83,.2);color:${T.success};font:900 12px/1.2 'JetBrains Mono',monospace}.feedback-proof small{display:block;font-size:8px;letter-spacing:.1em}.lesson-root{height:100dvh!important;min-height:0!important;overflow:hidden!important}.stage-content{display:flex;flex-direction:column;gap:4px;overflow:hidden!important}.stage-content>.stack{flex:1;min-height:0}.btn-white-accent:disabled{cursor:not-allowed;opacity:.46}
@media(max-width:639.98px){.stage-header{padding-top:11px!important;padding-bottom:4px!important}.lesson-root-preview .stage-header{padding-top:52px!important}.progress-track{height:4px!important;margin-bottom:5px!important}.stage-content{padding-top:3px!important;padding-bottom:3px!important}.stage-nav{min-height:52px!important}.stack{gap:4px!important}.heading{min-height:40px!important}.heading h1{font-size:17px!important}.heading .g1-char{width:38px!important;height:48px!important}.question,.model-card,.visual-card,.hook-model,.whole-card,.rule-card,.beat-list{padding:5px!important;border-radius:11px!important}.options{gap:3px!important}.option{min-height:44px!important;padding:4px!important;border-radius:9px!important;font-size:9px!important}.feedback.feedback-slot{height:54px;min-height:54px!important;padding:4px 6px!important;grid-template-columns:32px 1fr!important;gap:4px!important}.feedback-bit{width:31px;height:39px}.feedback p{font-size:9px!important;line-height:1.16!important}.caption-slot{min-height:28px;padding:3px 7px;font-size:8px}.beat-list{gap:3px!important}.beat{min-height:29px!important;padding:3px!important;font-size:8px!important}.btn-white-accent,.btn-ghost{min-height:44px!important;min-width:104px!important;padding:0 8px!important;font-size:11px!important}.finale-main,.finale-bottom{grid-template-columns:1fr 1fr!important;gap:4px!important}}
.strategy-replay{min-height:44px;padding:7px 12px;border:0;border-radius:11px;justify-self:center;color:${T.cyan};background:${T.cyanSoft};cursor:pointer;font-size:11px;font-weight:850}.strategy-replay:disabled{cursor:not-allowed;opacity:.46}
.final-reflection{padding:6px 8px;border-radius:12px;display:grid;gap:5px;background:rgba(255,255,255,.9)}.final-reflection>strong{font:750 12px/1.2 'Source Serif 4',Georgia,serif}.final-reflection>div{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px}.final-reflection button{min-height:44px;padding:4px;border:0;border-radius:9px;display:grid;grid-template-columns:20px 1fr;align-items:center;gap:3px;color:${T.navy};background:${T.cyanSoft};cursor:pointer;text-align:left;font-size:8px;font-weight:850}.final-reflection button>span{width:19px;height:19px;border-radius:6px;display:grid;place-items:center;color:#fff;background:${T.cyan}}.final-reflection button.is-selected{color:#fff;background:${T.cyan}}.final-reflection button:disabled{cursor:default}.g4-title-claim:disabled{cursor:not-allowed;opacity:.46}
`;
