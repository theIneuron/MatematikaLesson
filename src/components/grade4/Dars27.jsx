import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { canUseGrade4TheoryContinue } from './theoryNavigation.js';

// 4-SINF · 27-DARS · Massa birliklari
// Approved frame vector: 3,4,4,4,4,4,4,5,2,2,2,2,2,3,5.

const T = {
  bg: '#F5F5F0', ink: '#12212C', ink2: '#50616D', ink3: '#87949D', paper: '#FFFFFF',
  accent: '#FF5B35', accentSoft: '#FFF0EA', cyan: '#168FA3', cyanSoft: '#E5F5F6',
  navy: '#173B52', lime: '#95C93D', success: '#227A53', successSoft: '#E7F3EC',
  warn: '#A96F13', warnSoft: '#FFF5D9', shadowBase: '58, 53, 48',
};

const stableChoiceOffset = (lessonId, length) => {
  let hash = 2166136261;
  for (const char of `${lessonId}:${length}`) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return length > 0 ? (hash >>> 0) % length : 0;
};

const buildOptionOrder = (length, correctIndex, lessonId, ordinal = 0) => {
  const natural = Array.from({ length: Math.max(0, length) }, (_, index) => index);
  if (length < 2 || !Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= length) return natural;
  const target = (stableChoiceOffset(lessonId, length) + ordinal * (length - 1)) % length;
  const order = natural.filter((index) => index !== correctIndex);
  order.splice(target, 0, correctIndex);
  return order;
};

const TOTAL_SCREENS = 15;
const FRAME_COUNTS = [3, 4, 4, 4, 4, 4, 4, 5, 2, 2, 2, 2, 2, 3, 5];
const SUPPORTED_LANGS = ['uz', 'ru', 'en'];
const SPEECH_LOCALES = { uz: 'uz-UZ', ru: 'ru-RU', en: 'en-GB' };
const LANGUAGE_SELECTOR_LABEL = { uz: 'Tilni tanlash', ru: 'Выбор языка', en: 'Choose language' };
const normalizeLang = (value) => SUPPORTED_LANGS.includes(value) ? value : 'uz';
const LESSON_META = {
  lessonId: 'measure-4-27-v1',
  slug: 'dars27-massa-birliklari',
  lessonTitle: { uz: "27-dars. Massa birliklari", ru: 'Урок 27. Единицы массы', en: "Lesson 27. Units of mass" },
  skillTags: ['mass', 'g', 'kg', 'sentner', 't', 'unit_conversion'],
};

const SCREEN_META = [
  { id: 's0', type: 'hook', subtype: 'story-prediction', template: 'StoryChoice', mechanic: 'StoryChoice', goal: 'Predict whether two mass notations are equivalent', misconceptions: ['unit labels ignored'], active: true, scored: false, scope: 'hook', resetOnReturn: true },
  { id: 's1', type: 'model', subtype: 'gram-kilogram-model', template: 'StrategyReplay', mechanic: 'StrategyReplay', goal: 'Connect grams with one kilogram', misconceptions: ['factor one hundred'], active: true, scored: false, scope: null },
  { id: 's2', type: 'exploration', subtype: 'kilogram-centner-model', template: 'StrategyReplay', mechanic: 'StrategyReplay', goal: 'Build the kilogram-centner relation', misconceptions: ['factor ten'], active: true, scored: false, scope: null },
  { id: 's3', type: 'discovery', subtype: 'centner-tonne-model', template: 'StrategyReplay', mechanic: 'StrategyReplay', goal: 'Discover the centner-tonne relation', misconceptions: ['neighbouring factors assumed equal'], active: true, scored: false, scope: null },
  { id: 's4', type: 'discovery', subtype: 'mass-unit-rail', template: 'StrategyReplay', mechanic: 'StrategyReplay', goal: 'Connect all supported mass units', misconceptions: ['scale order reversed'], active: true, scored: false, scope: null },
  { id: 's5', type: 'rule', subtype: 'conversion-direction-rule', template: 'StrategyReplay', mechanic: 'StrategyReplay', goal: 'Formulate multiply-or-divide conversion direction', misconceptions: ['operation direction reversed'], active: true, scored: false, scope: null },
  { id: 's6', type: 'strategy', subtype: 'unit-choice-strategy', template: 'StrategyReplay', mechanic: 'StrategyReplay', goal: 'Choose a sensible mass unit for an object', misconceptions: ['unit scale ignored'], active: true, scored: false, scope: null },
  { id: 's7', type: 'consolidation', subtype: 'mixed-mass-transfer', template: 'StrategyReplay', mechanic: 'StrategyReplay', goal: 'Transfer conversions to a mixed mass', misconceptions: ['units combined before conversion'], active: true, scored: false, scope: null },
  { id: 's8', type: 'test', subtype: 'g-kg-practice', template: 'MCScreen', mechanic: 'MCScreen', goal: 'Convert grams and kilograms', misconceptions: ['factor hundred'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's9', type: 'test', subtype: 'kg-centner-practice', template: 'MCScreen', mechanic: 'MCScreen', goal: 'Convert kilograms and centners', misconceptions: ['wrong factor'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's10', type: 'strategy', subtype: 'centner-tonne-check', template: 'MCScreen', mechanic: 'MCScreen', goal: 'Choose a correct mass conversion strategy', misconceptions: ['factor thousand used everywhere'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's11', type: 'error', subtype: 'misconception-repair', template: 'ErrorRepairChoice', mechanic: 'ErrorRepairChoice', goal: "Repair Bit's reversed mass conversion", misconceptions: ['multiply when converting to a larger unit'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's12', type: 'test', subtype: 'comparison-practice', template: 'MCScreen', mechanic: 'MCScreen', goal: 'Compare masses after conversion', misconceptions: ['numbers compared without units'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's13', type: 'case', subtype: 'life-context-transfer', template: 'NumInputScreen', mechanic: 'NumInputScreen', goal: 'Combine converted masses in context', misconceptions: ['mixed units added directly'], active: true, scored: true, scoreUnits: 1, scope: 'final' },
  { id: 's14', type: 'summary', subtype: 'reflection-and-title', template: 'ReflectionClaim', mechanic: 'ReflectionClaim', goal: 'Reflect on conversion and bridge forward', misconceptions: ['unit label omitted'], active: true, scored: false, scope: null },
];

const CONTENT = {
  s0: {
    eyebrow: { uz: "Yuk nazorati", ru: 'Контроль груза', en: "Cargo check" }, title: { uz: "1 t va 1000 kg tengmi?", ru: 'Равны ли 1 т и 1000 кг?', en: "Are 1 t and 1000 kg equal?" },
    frames: [{ uz: "Bitta yuk", ru: 'Один груз', en: "One load" }, { uz: "Birinchi yorliq: 1 t", ru: 'Первая метка: 1 т', en: "First label: 1 t" }, { uz: "Ikkinchi yorliq: 1000 kg", ru: 'Вторая метка: 1000 кг', en: "Second label: 1000 kg" }],
    question: { uz: "Ikki yorliq bir xil massani ko'rsatadimi?", ru: 'Показывают ли две метки одну массу?', en: "Do both labels show the same mass?" }, options: [{ uz: 'Ha, teng', ru: 'Да, равны', en: "Yes, they are equal" }, { uz: "Yo'q, 1 t og'irroq", ru: 'Нет, 1 т тяжелее', en: "No, 1 t is heavier" }, { uz: "Yo'q, 1000 kg og'irroq", ru: 'Нет, 1000 кг тяжелее', en: "No, 1000 kg is heavier" }],
    neutral: { uz: "Taxmin saqlandi. Endi massa birliklari orasidagi bog'lanishni ochamiz.", ru: 'Гипотеза сохранена. Теперь раскроем связь между единицами массы.', en: "Your prediction has been saved. Now we will discover how units of mass are related." },
    audio: { intro: { uz: ["Salom, do'stim! Bugun massa birliklari orasidagi bog'lanishni o'rganamiz. Yuk nazoratida bitta yuk turibdi.", "Yukning birinchi yorlig'ida bir tonna deb yozilgan.", "Ikkinchi yorliqda ming kilogramm yozilgan. Ular tengligini taxmin qiling."], ru: ['Привет, друг! Сегодня мы изучим связь между единицами массы. На контроле находится один груз.', 'На первой метке груза написана одна тонна.', 'На второй метке написана тысяча килограммов. Предположи, равны ли эти записи.'], en: ["Hey, buddy! Today we'll learn how units of mass are related. There is one load at the cargo checkpoint.", "The first label on the load says one tonne.", "The second label says one thousand kilograms. Predict whether the two measurements are equal."] } },
  },
  s1: {
    eyebrow: { uz: "Kichik massa", ru: 'Малая масса', en: "Small masses" }, title: { uz: "Kilogramm va gramm", ru: 'Килограмм и грамм', en: "Kilograms and grams" },
    frames: [{ uz: "1 kg = 1000 g", ru: '1 кг = 1000 г', en: "1 kg = 1000 g" }, { uz: "3 kg = 3 × 1000 g", ru: '3 кг = 3 × 1000 г', en: "3 kg = 3 × 1000 g" }, { uz: "3 kg = 3000 g", ru: '3 кг = 3000 г', en: "3 kg = 3000 g" }, { uz: "3000 g = 3 kg", ru: '3000 г = 3 кг', en: "3000 g = 3 kg" }],
    audio: { uz: ["Bir kilogramm ming grammga teng.", "Uch kilogrammda mingtadan uchta gramm guruhi bor.", "Shuning uchun uch kilogramm uch ming grammga teng.", "Teskari yo'nalishda uch ming grammni mingtadan guruhlasak, uch kilogramm chiqadi."], ru: ['Один килограмм равен тысяче граммов.', 'В трёх килограммах три группы по тысяче граммов.', 'Поэтому три килограмма равны трём тысячам граммов.', 'В обратную сторону делим три тысячи граммов на группы по тысяче и получаем три килограмма.'], en: ["One kilogram equals one thousand grams.", "Three kilograms contain three groups of one thousand grams.", "Therefore, three kilograms equal three thousand grams.", "In the opposite direction, group three thousand grams into thousands to get three kilograms."] },
  },
  s2: {
    eyebrow: { uz: "O'rta yuklar", ru: 'Средние грузы', en: "Medium-sized loads" }, title: { uz: "Sentner va kilogramm", ru: 'Центнер и килограмм', en: "Centners and kilograms" },
    frames: [{ uz: "1 sentner = 100 kg", ru: '1 центнер = 100 кг', en: "1 centner = 100 kg" }, { uz: "4 sentner = 4 × 100 kg", ru: '4 центнера = 4 × 100 кг', en: "4 centners = 4 × 100 kg" }, { uz: "4 sentner = 400 kg", ru: '4 центнера = 400 кг', en: "4 centners = 400 kg" }, { uz: "400 kg = 4 sentner", ru: '400 кг = 4 центнера', en: "400 kg = 4 centners" }],
    audio: { uz: ["Bir sentner yuz kilogrammga teng.", "To'rt sentnerda yuztadan to'rtta kilogramm guruhi bor.", "Shuning uchun to'rt sentner to'rt yuz kilogrammga teng.", "Teskari yo'nalishda to'rt yuz kilogrammni yuztadan guruhlasak, to'rt sentner chiqadi."], ru: ['Один центнер равен ста килограммам.', 'В четырёх центнерах четыре группы по сто килограммов.', 'Поэтому четыре центнера равны четырёмстам килограммам.', 'В обратную сторону делим четыреста килограммов на группы по сто и получаем четыре центнера.'], en: ["One centner equals one hundred kilograms.", "Four centners contain four groups of one hundred kilograms.", "Therefore, four centners equal four hundred kilograms.", "In the opposite direction, group four hundred kilograms into hundreds to get four centners."] },
  },
  s3: {
    eyebrow: { uz: "Katta yuklar", ru: 'Крупные грузы', en: "Large loads" }, title: { uz: "Tonna va sentner", ru: 'Тонна и центнер', en: "Tonnes and centners" },
    frames: [{ uz: "1 t = 10 sentner", ru: '1 т = 10 центнеров', en: "1 t = 10 centners" }, { uz: "3 t = 3 × 10 sentner", ru: '3 т = 3 × 10 центнеров', en: "3 t = 3 × 10 centners" }, { uz: "3 t = 30 sentner", ru: '3 т = 30 центнеров', en: "3 t = 30 centners" }, { uz: "30 sentner = 3 t", ru: '30 центнеров = 3 т', en: "30 centners = 3 t" }],
    audio: { uz: ["Bir tonna o'n sentnerga teng.", "Uch tonnada o'ntadan uchta sentner guruhi bor.", "Shuning uchun uch tonna o'ttiz sentnerga teng.", "Teskari yo'nalishda o'ttiz sentnerni o'ntadan guruhlasak, uch tonna chiqadi."], ru: ['Одна тонна равна десяти центнерам.', 'В трёх тоннах три группы по десять центнеров.', 'Поэтому три тонны равны тридцати центнерам.', 'В обратную сторону делим тридцать центнеров на группы по десять и получаем три тонны.'], en: ["One tonne equals ten centners.", "Three tonnes contain three groups of ten centners.", "Therefore, three tonnes equal thirty centners.", "In the opposite direction, group thirty centners into tens to get three tonnes."] },
  },
  s4: {
    eyebrow: { uz: "Bog'lanish isboti", ru: 'Обоснование связи', en: "Proving the relationship" }, title: { uz: "Nega 1 t = 1000 kg?", ru: 'Почему 1 т = 1000 кг?', en: "Why is 1 t = 1000 kg?" },
    frames: [{ uz: "1 t = 10 sentner", ru: '1 т = 10 центнеров', en: "1 t = 10 centners" }, { uz: "1 sentner = 100 kg", ru: '1 центнер = 100 кг', en: "1 centner = 100 kg" }, { uz: "10 × 100 = 1000", ru: '10 × 100 = 1000', en: "10 × 100 = 1000" }, { uz: "1 t = 1000 kg", ru: '1 т = 1000 кг', en: "1 t = 1000 kg" }],
    audio: { uz: ["Bir tonna o'n sentnerga teng.", "Har bir sentnerda yuz kilogramm bor.", "O'nta guruhning har birida yuztadan kilogramm, jami ming kilogramm bo'ladi.", "Shuning uchun bir tonna ming kilogrammga teng."], ru: ['Одна тонна равна десяти центнерам.', 'В каждом центнере сто килограммов.', 'В десяти группах по сто килограммов, всего тысяча килограммов.', 'Поэтому одна тонна равна тысяче килограммов.'], en: ["One tonne equals ten centners.", "Each centner contains one hundred kilograms.", "There are ten groups with one hundred kilograms in each, making one thousand kilograms altogether.", "Therefore, one tonne equals one thousand kilograms."] },
  },
  s5: {
    eyebrow: { uz: "To'g'ridan-to'g'ri yo'l", ru: 'Прямой переход', en: "Direct conversion" }, title: { uz: "Tonnadan kilogrammga birdan o'ting", ru: 'Переходи из тонн сразу в килограммы', en: "Convert tonnes directly to kilograms" },
    frames: [{ uz: "t → kg", ru: 'т → кг', en: "t → kg" }, { uz: "1 t = 1000 kg", ru: '1 т = 1000 кг', en: "1 t = 1000 kg" }, { uz: "t → kg: ×1000", ru: 'т → кг: ×1000', en: "t → kg: ×1000" }, { uz: "kg → t: ÷1000", ru: 'кг → т: ÷1000', en: "kg → t: ÷1000" }],
    audio: { uz: ["Tonnadan kilogrammga to'g'ridan-to'g'ri o'tish mumkin.", "Bir tonna ming kilogrammga teng.", "Shuning uchun tonnadan kilogrammga o'tganda sonni mingga ko'paytiramiz.", "Teskari yo'nalishda kilogrammdan tonnaga o'tganda sonni mingga bo'lamiz."], ru: ['Из тонн можно сразу перейти в килограммы.', 'Одна тонна равна тысяче килограммов.', 'Поэтому при переходе из тонн в килограммы число умножаем на тысячу.', 'В обратную сторону при переходе из килограммов в тонны число делим на тысячу.'], en: ["You can convert directly from tonnes to kilograms.", "One tonne equals one thousand kilograms.", "Therefore, when converting from tonnes to kilograms, multiply the number by one thousand.", "In the opposite direction, divide the number by one thousand when converting from kilograms to tonnes."] },
  },
  s6: {
    eyebrow: { uz: "Zavod yorliqlari", ru: 'Заводские этикетки', en: "Factory labels" }, title: { uz: "Har bir yuk uchun mos birlik", ru: 'Подходящая единица для каждого груза', en: "A suitable unit for each load" },
    frames: [{ uz: "Shakar paketi: 500 g", ru: 'Пакет сахара: 500 г', en: "Packet of sugar: 500 g" }, { uz: "Un qopi: 25 kg", ru: 'Мешок муки: 25 кг', en: "Sack of flour: 25 kg" }, { uz: "G'alla: 1 sentner", ru: 'Зерно: 1 центнер', en: "Grain: 1 centner" }, { uz: "Konteyner: 4 t", ru: 'Контейнер: 4 т', en: "Container: 4 t" }],
    audio: { uz: ["Zavod shakar paketiga besh yuz gramm deb yorliq qo'ydi.", "Un qopiga yigirma besh kilogramm deb yozildi.", "G'alla yukiga bir sentner deb yozish qulay.", "Katta konteyner yukiga to'rt tonna deb yorliq qo'yildi."], ru: ['На заводе пакет сахара получил метку пятьсот граммов.', 'На мешке муки написано двадцать пять килограммов.', 'Для груза зерна удобно указать один центнер.', 'На большом контейнере указано четыре тонны.'], en: ["At the factory, the packet of sugar was labelled five hundred grams.", "The sack of flour was labelled twenty-five kilograms.", "It is convenient to label the load of grain as one centner.", "The large container was labelled four tonnes."] },
  },
  s7: {
    eyebrow: { uz: "Aralash yozuv", ru: 'Смешанная запись', en: "Mixed-unit notation" }, title: { uz: "Katta birlikni alohida aylantiring", ru: 'Преобразуй крупную единицу отдельно', en: "Convert the larger unit separately" },
    frames: [{ uz: "2 sentner 40 kg", ru: '2 центнера 40 кг', en: "2 centners 40 kg" }, { uz: "2 sentner = 200 kg", ru: '2 центнера = 200 кг', en: "2 centners = 200 kg" }, { uz: "200 kg + 40 kg = 240 kg", ru: '200 кг + 40 кг = 240 кг', en: "200 kg + 40 kg = 240 kg" }, { uz: "2 t 3 sentner", ru: '2 т 3 центнера', en: "2 t 3 centners" }, { uz: "20 sentner + 3 sentner = 23 sentner", ru: '20 центнеров + 3 центнера = 23 центнера', en: "20 centners + 3 centners = 23 centners" }],
    audio: { uz: ["Ikki sentner qirq kilogrammni faqat kilogrammda yozamiz.", "Ikki sentner ikki yuz kilogrammga teng.", "Ikki yuz kilogrammga qirq kilogrammni qo'shsak, ikki yuz qirq kilogramm bo'ladi.", "Endi ikki tonna uch sentnerni faqat sentnerda yozamiz.", "Ikki tonna yigirma sentner, unga uch sentner qo'shsak, yigirma uch sentner bo'ladi."], ru: ['Запишем два центнера сорок килограммов только в килограммах.', 'Два центнера равны двумстам килограммам.', 'К двумстам килограммам прибавляем сорок и получаем двести сорок килограммов.', 'Теперь запишем две тонны три центнера только в центнерах.', 'Две тонны равны двадцати центнерам, прибавляем три и получаем двадцать три центнера.'], en: ["We will express two centners forty kilograms using kilograms only.", "Two centners equal two hundred kilograms.", "Add forty kilograms to two hundred kilograms to get two hundred and forty kilograms.", "Now express two tonnes three centners using centners only.", "Two tonnes equal twenty centners. Add three centners to get twenty-three centners."] },
  },
  s8: {
    eyebrow: { uz: "Tekshiruv · 1/6", ru: 'Проверка · 1/6', en: "Check · 1/6" }, title: { uz: "Kilogrammdan grammga", ru: 'Из килограммов в граммы', en: "Kilograms to grams" },
    frames: [{ uz: "1 kg = 1000 g", ru: '1 кг = 1000 г', en: "1 kg = 1000 g" }, { uz: "6 kg = ? g", ru: '6 кг = ? г', en: "6 kg = ? g" }],
    question: { uz: "6 kg necha gramm?", ru: 'Сколько граммов в 6 кг?', en: "How many grams are in 6 kg?" }, options: [{ uz: '600 g', ru: '600 г', en: "600 g" }, { uz: '6000 g', ru: '6000 г', en: "6000 g" }, { uz: '60 000 g', ru: '60 000 г', en: "60 000 g" }, { uz: '6 g', ru: '6 г', en: "6 g" }], correctIndex: 1,
    feedback: [{ uz: "Bir kilogrammda yuz emas, ming gramm bor.", ru: 'В одном килограмме не сто, а тысяча граммов.', en: "One kilogram contains one thousand grams, not one hundred." }, { uz: "To'g'ri. Olti karra ming — olti ming.", ru: 'Верно. Шесть раз по тысяче — шесть тысяч.', en: "Correct. Six lots of one thousand is six thousand." }, { uz: "Mingni yana o'nga ortiq ko'paytirmang.", ru: 'Не увеличивай тысячу ещё в десять раз.', en: "Do not multiply one thousand by ten again." }, { uz: "Birlik kichrayganda son o'zgarishsiz qolmaydi.", ru: 'При переходе к мелкой единице число не остаётся прежним.', en: "When you convert to a smaller unit, the number does not stay the same." }],
    feedbackAudio: [{ uz: "Bir kilogrammda yuz emas, ming gramm bor.", ru: 'В одном килограмме не сто, а тысяча граммов.', en: "One kilogram contains one thousand grams, not one hundred." }, { uz: "To'g'ri. Olti karra ming, olti ming.", ru: 'Верно. Шесть раз по тысяче, шесть тысяч.', en: "Correct. Six lots of one thousand is six thousand." }, { uz: "Mingni yana o'nga ortiq ko'paytirmang.", ru: 'Не увеличивай тысячу ещё в десять раз.', en: "Do not multiply one thousand by ten again." }, { uz: "Birlik kichrayganda son o'zgarishsiz qolmaydi.", ru: 'При переходе к мелкой единице число не остаётся прежним.', en: "When you convert to a smaller unit, the number does not stay the same." }],
    proof: { uz: "6 × 1000 = 6000 g", ru: '6 × 1000 = 6000 г', en: "6 × 1000 = 6000 g" },
    audio: { intro: { uz: ["Bir kilogramm ming grammga teng.", "Olti kilogrammni grammda ifodalang."], ru: ['Один килограмм равен тысяче граммов.', 'Вырази шесть килограммов в граммах.'], en: ["One kilogram equals one thousand grams.", "Express six kilograms in grams."] } },
  },
  s9: {
    eyebrow: { uz: "Tekshiruv · 2/6", ru: 'Проверка · 2/6', en: "Check · 2/6" }, title: { uz: "Sentnerdan kilogrammga", ru: 'Из центнеров в килограммы', en: "Centners to kilograms" },
    frames: [{ uz: "1 sentner = 100 kg", ru: '1 центнер = 100 кг', en: "1 centner = 100 kg" }, { uz: "4 sentner = ? kg", ru: '4 центнера = ? кг', en: "4 centners = ? kg" }],
    question: { uz: "4 sentner necha kilogramm?", ru: 'Сколько килограммов в 4 центнерах?', en: "How many kilograms are in 4 centners?" }, options: [{ uz: '40 kg', ru: '40 кг', en: "40 kg" }, { uz: '400 kg', ru: '400 кг', en: "400 kg" }, { uz: '4000 kg', ru: '4000 кг', en: "4000 kg" }, { uz: '4 kg', ru: '4 кг', en: "4 kg" }], correctIndex: 1,
    feedback: [{ uz: "Bir sentnerda o'n emas, yuz kilogramm bor.", ru: 'В одном центнере не десять, а сто килограммов.', en: "One centner contains one hundred kilograms, not ten." }, { uz: "To'g'ri. To'rt karra yuz — to'rt yuz.", ru: 'Верно. Четыре раза по сто — четыреста.', en: "Correct. Four lots of one hundred is four hundred." }, { uz: "Yuzni o'nga ortiq ko'paytirmang.", ru: 'Не увеличивай сто ещё в десять раз.', en: "Do not multiply one hundred by ten again." }, { uz: "Sentnerni kilogrammga o'tkazganda son o'zgaradi.", ru: 'При переводе центнеров в килограммы число меняется.', en: "The number changes when you convert centners to kilograms." }],
    feedbackAudio: [{ uz: "Bir sentnerda o'n emas, yuz kilogramm bor.", ru: 'В одном центнере не десять, а сто килограммов.', en: "One centner contains one hundred kilograms, not ten." }, { uz: "To'g'ri. To'rt karra yuz, to'rt yuz.", ru: 'Верно. Четыре раза по сто, четыреста.', en: "Correct. Four lots of one hundred is four hundred." }, { uz: "Yuzni o'nga ortiq ko'paytirmang.", ru: 'Не увеличивай сто ещё в десять раз.', en: "Do not multiply one hundred by ten again." }, { uz: "Sentnerni kilogrammga o'tkazganda son o'zgaradi.", ru: 'При переводе центнеров в килограммы число меняется.', en: "The number changes when you convert centners to kilograms." }],
    proof: { uz: "4 × 100 = 400 kg", ru: '4 × 100 = 400 кг', en: "4 × 100 = 400 kg" },
    audio: { intro: { uz: ["Bir sentner yuz kilogrammga teng.", "To'rt sentnerni kilogrammda ifodalang."], ru: ['Один центнер равен ста килограммам.', 'Вырази четыре центнера в килограммах.'], en: ["One centner equals one hundred kilograms.", "Express four centners in kilograms."] } },
  },
  s10: {
    eyebrow: { uz: "Tekshiruv · 3/6", ru: 'Проверка · 3/6', en: "Check · 3/6" }, title: { uz: "Kilogrammdan tonnaga", ru: 'Из килограммов в тонны', en: "Kilograms to tonnes" },
    frames: [{ uz: "1000 kg = 1 t", ru: '1000 кг = 1 т', en: "1000 kg = 1 t" }, { uz: "3000 kg = ? t", ru: '3000 кг = ? т', en: "3000 kg = ? t" }],
    question: { uz: "3000 kg necha tonna?", ru: 'Сколько тонн в 3000 кг?', en: "How many tonnes are in 3000 kg?" }, options: [{ uz: '3 t', ru: '3 т', en: "3 t" }, { uz: '30 t', ru: '30 т', en: "30 t" }, { uz: '300 t', ru: '300 т', en: "300 t" }, { uz: '3000 t', ru: '3000 т', en: "3000 t" }], correctIndex: 0,
    feedback: [{ uz: "To'g'ri. Uchta ming kilogramm uch tonna bo'ladi.", ru: 'Верно. Три тысячи килограммов равны трём тоннам.', en: "Correct. Three groups of one thousand kilograms make three tonnes." }, { uz: "Har bir tonnaga ming kilogrammdan guruhlang.", ru: 'Собери группы по тысяче килограммов на каждую тонну.', en: "Make one group of one thousand kilograms for each tonne." }, { uz: "Ming kilogrammlik guruhlar sonini sanang.", ru: 'Посчитай число групп по тысяче килограммов.', en: "Count the groups of one thousand kilograms." }, { uz: "Birlik kattalashganda son uch ming bo'lib qolmaydi.", ru: 'При переходе к крупной единице число не остаётся равным трём тысячам.', en: "When you convert to a larger unit, the number does not stay at three thousand." }],
    feedbackAudio: [{ uz: "To'g'ri. Uchta ming kilogramm uch tonna bo'ladi.", ru: 'Верно. Три тысячи килограммов равны трём тоннам.', en: "Correct. Three groups of one thousand kilograms make three tonnes." }, { uz: "Har bir tonnaga ming kilogrammdan guruhlang.", ru: 'Собери группы по тысяче килограммов на каждую тонну.', en: "Make one group of one thousand kilograms for each tonne." }, { uz: "Ming kilogrammlik guruhlar sonini sanang.", ru: 'Посчитай число групп по тысяче килограммов.', en: "Count the groups of one thousand kilograms." }, { uz: "Birlik kattalashganda son uch ming bo'lib qolmaydi.", ru: 'При переходе к крупной единице число не остаётся равным трём тысячам.', en: "When you convert to a larger unit, the number does not stay at three thousand." }],
    proof: { uz: "3000 ÷ 1000 = 3 t", ru: '3000 ÷ 1000 = 3 т', en: "3000 ÷ 1000 = 3 t" },
    audio: { intro: { uz: ["Ming kilogramm bir tonnaga teng.", "Uch ming kilogrammda nechta minglik guruh borligini toping."], ru: ['Тысяча килограммов равна одной тонне.', 'Определи, сколько групп по тысяче содержится в трёх тысячах килограммов.'], en: ["One thousand kilograms equals one tonne.", "Find how many groups of one thousand are in three thousand kilograms."] } },
  },
  s11: {
    eyebrow: { uz: "Tekshiruv · 4/6", ru: 'Проверка · 4/6', en: "Check · 4/6" }, title: { uz: "Bitning xatosini tuzating", ru: 'Исправь ошибку Бита', en: "Correct Bit's mistake" },
    frames: [{ uz: "Bit: 5 t = 500 kg", ru: 'Бит: 5 т = 500 кг', en: "Bit: 5 t = 500 kg" }, { uz: "1 t = 1000 kg", ru: '1 т = 1000 кг', en: "1 t = 1000 kg" }],
    question: { uz: "5 t ning to'g'ri yozuvi qaysi?", ru: 'Как правильно выразить 5 т?', en: "Which is the correct conversion of 5 t?" }, options: [{ uz: '500 kg', ru: '500 кг', en: "500 kg" }, { uz: '5000 kg', ru: '5000 кг', en: "5000 kg" }, { uz: '50 000 kg', ru: '50 000 кг', en: "50 000 kg" }, { uz: '50 kg', ru: '50 кг', en: "50 kg" }], correctIndex: 1,
    feedback: [{ uz: "Bu Bitning xato yozuvi. Bir tonnada ming kilogramm bor.", ru: 'Это ошибочная запись Бита. В одной тонне тысяча килограммов.', en: "This is Bit's incorrect conversion. One tonne contains one thousand kilograms." }, { uz: "To'g'ri. Besh karra ming — besh ming kilogramm.", ru: 'Верно. Пять раз по тысяче — пять тысяч килограммов.', en: "Correct. Five lots of one thousand is five thousand kilograms." }, { uz: "Mingni yana o'nga ortiq ko'paytirmang.", ru: 'Не увеличивай тысячу ещё в десять раз.', en: "Do not multiply one thousand by ten again." }, { uz: "Bir tonnada o'n kilogramm emas, ming kilogramm bor.", ru: 'В одной тонне не десять, а тысяча килограммов.', en: "One tonne contains one thousand kilograms, not ten." }],
    feedbackAudio: [{ uz: "Bu Bitning xato yozuvi. Bir tonnada ming kilogramm bor.", ru: 'Это ошибочная запись Бита. В одной тонне тысяча килограммов.', en: "This is Bit's incorrect conversion. One tonne contains one thousand kilograms." }, { uz: "To'g'ri. Besh karra ming, besh ming kilogramm.", ru: 'Верно. Пять раз по тысяче, пять тысяч килограммов.', en: "Correct. Five lots of one thousand is five thousand kilograms." }, { uz: "Mingni yana o'nga ortiq ko'paytirmang.", ru: 'Не увеличивай тысячу ещё в десять раз.', en: "Do not multiply one thousand by ten again." }, { uz: "Bir tonnada o'n kilogramm emas, ming kilogramm bor.", ru: 'В одной тонне не десять, а тысяча килограммов.', en: "One tonne contains one thousand kilograms, not ten." }],
    proof: { uz: "5 × 1000 = 5000 kg", ru: '5 × 1000 = 5000 кг', en: "5 × 1000 = 5000 kg" },
    audio: { intro: { uz: ["Bit besh tonnani besh yuz kilogramm deb yozdi.", "Bir tonnadagi kilogrammlar sonini tekshirib, to'g'ri javobni tanlang."], ru: ['Бит записал пять тонн как пятьсот килограммов.', 'Проверь число килограммов в одной тонне и выбери верный ответ.'], en: ["Bit wrote five tonnes as five hundred kilograms.", "Check how many kilograms are in one tonne and choose the correct answer."] } },
  },
  s12: {
    eyebrow: { uz: "Tekshiruv · 5/6", ru: 'Проверка · 5/6', en: "Check · 5/6" }, title: { uz: "Ikki massa yozuvini taqqoslang", ru: 'Сравни две записи массы', en: "Compare two mass measurements" },
    frames: [{ uz: "2 t 4 sentner", ru: '2 т 4 центнера', en: "2 t 4 centners" }, { uz: "2400 kg", ru: '2400 кг', en: "2400 kg" }],
    question: { uz: "2 t 4 sentner ? 2400 kg. Qaysi belgi mos?", ru: '2 т 4 центнера ? 2400 кг. Какой знак подходит?', en: "2 t 4 centners ? 2400 kg. Which symbol belongs here?" }, options: ['>', '<', '=', { uz: "Taqqoslab bo'lmaydi", ru: 'Нельзя сравнить', en: "They cannot be compared" }], correctIndex: 2,
    feedback: [{ uz: "Ikki tonna to'rt sentner ikki ming to'rt yuz kilogrammdan katta emas.", ru: 'Две тонны четыре центнера не больше двух тысяч четырёхсот килограммов.', en: "Two tonnes four centners is not greater than two thousand four hundred kilograms." }, { uz: "Birinchi massa ikkinchisidan kichik emas; ular bir xil massani bildiradi.", ru: 'Первая масса не меньше второй; записи обозначают одну массу.', en: "The first mass is not less than the second; both measurements describe the same mass." }, { uz: "To'g'ri. Ikki yozuv bir xil massani bildiradi.", ru: 'Верно. Обе записи обозначают одну массу.', en: "Correct. Both measurements describe the same mass." }, { uz: "Bir xil birlikka o'tkazilgach, bu massalarni taqqoslash mumkin.", ru: 'После перевода в одну единицу эти массы можно сравнить.', en: "After converting them to the same unit, these masses can be compared." }],
    feedbackAudio: [{ uz: "Ikki tonna to'rt sentner ikki ming to'rt yuz kilogrammdan katta emas.", ru: 'Две тонны четыре центнера не больше двух тысяч четырёхсот килограммов.', en: "Two tonnes four centners is not greater than two thousand four hundred kilograms." }, { uz: "Birinchi massa ikkinchisidan kichik emas. Ular bir xil massani bildiradi.", ru: 'Первая масса не меньше второй. Записи обозначают одну массу.', en: "The first mass is not less than the second. Both measurements describe the same mass." }, { uz: "To'g'ri. Ikki yozuv bir xil massani bildiradi.", ru: 'Верно. Обе записи обозначают одну массу.', en: "Correct. Both measurements describe the same mass." }, { uz: "Bir xil birlikka o'tkazilgach, bu massalarni taqqoslash mumkin.", ru: 'После перевода в одну единицу эти массы можно сравнить.', en: "After converting them to the same unit, these masses can be compared." }],
    proof: { uz: "2 t 4 sentner = 2400 kg", ru: '2 т 4 центнера = 2400 кг', en: "2 t 4 centners = 2400 kg" },
    audio: { intro: { uz: ["Birinchi yozuvda ikki tonna to'rt sentner berilgan.", "Uni ikki ming to'rt yuz kilogramm bilan bir xil birlikda taqqoslab, mos belgini tanlang."], ru: ['В первой записи даны две тонны четыре центнера.', 'Сравни эту массу с двумя тысячами четырьмястами килограммами в одной единице и выбери знак.'], en: ["The first measurement is two tonnes four centners.", "Convert it to the same unit as two thousand four hundred kilograms, compare them and choose the correct symbol."] } },
  },
  s13: {
    eyebrow: { uz: "Tekshiruv · 6/6", ru: 'Проверка · 6/6', en: "Check · 6/6" }, title: { uz: "Javobni kiriting", ru: 'Введи ответ', en: "Enter the answer" },
    frames: [{ uz: "1 t = 1000 kg", ru: '1 т = 1000 кг', en: "1 t = 1000 kg" }, { uz: "6 sentner = 600 kg", ru: '6 центнеров = 600 кг', en: "6 centners = 600 kg" }, { uz: "Jami kilogrammni yozing", ru: 'Запиши общее число килограммов', en: "Write the total number of kilograms" }],
    question: { uz: "1 t 6 sentner necha kilogramm?", ru: 'Сколько килограммов в 1 т 6 центнерах?', en: "How many kilograms are in 1 t 6 centners?" }, inputAnswer: 1600,
    inputFeedback: { correct: { uz: "To'g'ri. Ming kilogrammga olti yuz kilogramm qo'shildi.", ru: 'Верно. К тысяче килограммов прибавили шестьсот.', en: "Correct. Six hundred kilograms was added to one thousand kilograms." }, wrong: { uz: "Bir tonnani ming kilogrammga, olti sentnerni olti yuz kilogrammga aylantiring.", ru: 'Преобразуй одну тонну в тысячу килограммов, а шесть центнеров в шестьсот килограммов.', en: "Convert one tonne to one thousand kilograms and six centners to six hundred kilograms." } },
    feedbackAudio: { correct: { uz: "To'g'ri. Ming kilogrammga olti yuz kilogramm qo'shildi.", ru: 'Верно. К тысяче килограммов прибавили шестьсот.', en: "Correct. Six hundred kilograms was added to one thousand kilograms." }, wrong: { uz: "Bir tonnani ming kilogrammga, olti sentnerni olti yuz kilogrammga aylantiring.", ru: 'Преобразуй одну тонну в тысячу килограммов, а шесть центнеров в шестьсот килограммов.', en: "Convert one tonne to one thousand kilograms and six centners to six hundred kilograms." } },
    proof: { uz: "1000 kg + 600 kg = 1600 kg", ru: '1000 кг + 600 кг = 1600 кг', en: "1000 kg + 600 kg = 1600 kg" },
    audio: { intro: { uz: ["Bir tonna ming kilogrammga teng.", "Olti sentner olti yuz kilogrammga teng.", "Ikki miqdorni qo'shib, natijani faqat kilogramm soni bilan kiriting."], ru: ['Одна тонна равна тысяче килограммов.', 'Шесть центнеров равны шестистам килограммам.', 'Сложи две величины и введи результат только числом килограммов.'], en: ["One tonne equals one thousand kilograms.", "Six centners equal six hundred kilograms.", "Add the two quantities and enter only the number of kilograms."] } },
  },
  s14: {
    eyebrow: { uz: "Yakun", ru: 'Итог', en: "Summary" }, title: { uz: "Ikki yorliq bir xil massani ko'rsatdi", ru: 'Две метки показали одну массу', en: "Both labels showed the same mass" },
    frames: [{ uz: "Katta birlikdan kichikka: ko'paytiring", ru: 'Из крупной единицы в мелкую: умножай', en: "Larger unit to smaller unit: multiply" }, { uz: "Kichik birlikdan kattaga: bo'ling", ru: 'Из мелкой единицы в крупную: дели', en: "Smaller unit to larger unit: divide" }, { uz: "Boshlang'ich yorliqlar: 1 t va 1000 kg", ru: 'Исходные метки: 1 т и 1000 кг', en: "Starting labels: 1 t and 1000 kg" }, { uz: "1 t = 1000 kg — yorliqlar teng", ru: '1 т = 1000 кг — метки равны', en: "1 t = 1000 kg — the labels are equal" }, { uz: "Keyingi dars: vaqt birliklari", ru: 'Следующий урок: единицы времени', en: "Next lesson: units of time" }],
    audio: { uz: ["Katta massa birligidan kichigiga o'tganda sonni mos nisbatga ko'paytiring.", "Kichik massa birligidan kattasiga o'tganda sonni mos nisbatga bo'ling.", "Dars boshidagi yukda bir tonna va ming kilogramm yorliqlari bor edi.", "Bir tonna ming kilogrammga teng, demak ikki yorliq bir xil massani ko'rsatadi.", "Keyingi darsda vaqt birliklari orasidagi bog'lanishni o'rganamiz."], ru: ['При переходе от крупной единицы массы к мелкой умножай число на нужное отношение.', 'При переходе от мелкой единицы массы к крупной дели число на нужное отношение.', 'На грузе в начале урока были метки одна тонна и тысяча килограммов.', 'Одна тонна равна тысяче килограммов, значит две метки показывают одну массу.', 'На следующем уроке изучим связь между единицами времени.'], en: ["When converting from a larger unit of mass to a smaller one, multiply the number by the correct conversion factor.", "When converting from a smaller unit of mass to a larger one, divide the number by the correct conversion factor.", "At the start of the lesson, the load had labels showing one tonne and one thousand kilograms.", "One tonne equals one thousand kilograms, so the two labels show the same mass.", "In the next lesson, we will learn how units of time are related."] },
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
    const texts = source?.[lang] ?? source?.uz ?? [];
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
  const muteLabel = t(audio.muted
    ? { uz: "Ovozni yoqish", ru: 'Включить звук', en: 'Turn sound on' }
    : { uz: "Ovozni o'chirish", ru: 'Выключить звук', en: 'Turn sound off' });
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
    exploration: { uz: "Kashfiyot", ru: 'Исследование', en: 'Explore' },
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

const Stage = ({ screen, audio, onPrev, onNext, nextDisabled: originalNextDisabled = false, finish = false, children }) => {
  const originalGatePassed = !originalNextDisabled && Boolean(onNext);
  const nextDisabled = !canUseGrade4TheoryContinue(originalGatePassed, finish);
  const t = useT(); const mobile = useIsMobile(); const pad = mobile ? 14 : 48; const c = CONTENT[`s${screen}`]; const meta = SCREEN_META[screen];
  return <main className={`stage stage-${meta.type}`}><header className="stage-header" style={{ paddingLeft: pad, paddingRight: pad }}><div className="progress-track" aria-label={`${screen + 1} / ${TOTAL_SCREENS}`}><div className="progress-fill progress-bar" style={{ width: `${(screen + 1) / TOTAL_SCREENS * 100}%` }}/></div><div className="stage-chrome"><div className="chrome-title"><span className="status-dot"/><span>{t(c.eyebrow)}</span></div><div className="chrome-actions"><ScreenTypeLabel type={meta.type}/>{audio && <AudioIndicator audio={audio}/>}<span className="screen-count">{String(screen + 1).padStart(2, '0')} / {TOTAL_SCREENS}</span></div></div></header><section className="stage-content" style={{ paddingLeft: pad, paddingRight: pad }}>{children}<div className={`caption-slot ${audio?.caption && (audio.muted || audio.visualOnly) ? 'is-visible' : ''}`} aria-live="polite"><span>{audio?.caption && (audio.muted || audio.visualOnly) ? audio.caption : ''}</span></div></section><footer className="stage-nav" style={{ paddingLeft: pad, paddingRight: pad }}>{screen === 0 ? <span/> : <button type="button" className="btn-ghost" onClick={onPrev}>← {t({ uz: "Orqaga", ru: 'Назад', en: "Back" })}</button>}<button type="button" className="btn-white-accent" disabled={nextDisabled || !onNext} onClick={onNext}>{finish ? t({ uz: "Darsni yakunlash", ru: 'Завершить урок', en: "Finish lesson" }) : t({ uz: "Davom etish", ru: 'Продолжить', en: "Continue" })} →</button></footer></main>;
};

const Heading = ({ c, bit, hook = false }) => { const t = useT(); return <div className="heading"><div><span data-g4-role={hook ? 'hook-topic' : undefined}>{t(c.eyebrow)}</span><h1 data-g4-role={hook ? 'hook-title' : undefined}>{t(c.title)}</h1></div>{bit && !hook && <BitSVG state={bit}/>}</div>; };
const Options = ({ values, picked, onPick, correctIndex, solved, neutral = false, disabled = false, order = null }) => {
  const t = useT();
  const sourceOrder = order ?? values.map((_, index) => index);
  return <div className="options">{sourceOrder.map((sourceIndex, displayIndex) => { const value = values[sourceIndex]; return <button type="button" data-g4-role="answer-card" data-g4-source-index={order ? sourceIndex : undefined} data-g4-correct={order ? (sourceIndex === correctIndex ? 'true' : 'false') : undefined} key={sourceIndex + '-' + t(value)} className={'option ' + (picked === sourceIndex ? 'picked ' : '') + (!neutral && solved && sourceIndex === correctIndex ? 'right ' : '') + (!neutral && picked === sourceIndex && picked !== correctIndex ? 'bad ' : '')} disabled={disabled || (!neutral && solved)} onClick={() => onPick(sourceIndex)}><b>{String.fromCharCode(65 + displayIndex)}</b><span>{t(value)}</span></button>; })}</div>;
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
const MASS_UNITS = [
  { key: 't', short: { uz: 't', ru: 'т', en: "t" }, uz: 'tonna', ru: 'тонна', en: 'tonne' },
  { key: 'sentner', short: { uz: 'sentner', ru: 'центнер', en: "centner" }, uz: 'sentner', ru: 'центнер', en: 'centner' },
  { key: 'kg', short: { uz: 'kg', ru: 'кг', en: "kg" }, uz: 'kilogramm', ru: 'килограмм', en: 'kilogram' },
  { key: 'g', short: { uz: 'g', ru: 'г', en: "g" }, uz: 'gramm', ru: 'грамм', en: 'gram' },
];
function MassRail({ frame = 3, active = [] }) {
  const t = useT(); const links = ['×10', '×100', '×1000'];
  return <div className="mass-rail">{MASS_UNITS.map((unit, index) => <React.Fragment key={unit.key}><div className={'mass-node ' + (index <= frame ? 'show ' : '') + (active.includes(unit.key) ? 'active' : '')}><b className={unit.key === 'sentner' ? 'long' : ''}>{t(unit.short)}</b><span>{t(unit)}</span></div>{index < MASS_UNITS.length - 1 && <i className={index < frame ? 'show' : ''}>{links[index]}</i>}</React.Fragment>)}</div>;
}
function ConversionBoard({ lines, frame }) {
  return <div className="conversion-board">{lines.map((line, index) => <div key={line} className={index <= frame ? 'show' : ''}>{line}</div>)}</div>;
}
function WeightGroups({ groups = 10, frame = 3, unit = 'sentner' }) {
  const t = useT();
  const label = t(MASS_UNITS.find((item) => item.key === unit)?.short ?? unit);
  return <div className="weight-groups">{Array.from({ length: groups }, (_, index) => <i key={index} className={index < Math.ceil((frame + 1) * groups / 4) ? 'on' : ''}><span>{label}</span></i>)}</div>;
}

function MassVisual({ screen, frame, solved = false }) {
  const t = useT();
  if (screen === 0) return <div className="visual-card cargo-hook"><div className="cargo">🚚</div><ConversionBoard frame={frame} lines={[t({ uz: 'Bitta yuk', ru: 'Один груз', en: "One load" }), t({ uz: 'Birinchi yorliq: 1 t', ru: 'Первая метка: 1 т', en: "First label: 1 t" }), t({ uz: 'Ikkinchi yorliq: 1000 kg', ru: 'Вторая метка: 1000 кг', en: "Second label: 1000 kg" })]}/></div>;
  if (screen === 1) return <div className="visual-card"><div className="scale-model"><span>{t({ uz: '3 kg', ru: '3 кг', en: "3 kg" })}</span><i>⚖</i><span>{t({ uz: '3000 g', ru: '3000 г', en: "3000 g" })}</span></div><ConversionBoard frame={frame} lines={CONTENT.s1.frames.map(t)}/></div>;
  if (screen === 2) return <div className="visual-card"><WeightGroups groups={4} frame={frame}/><ConversionBoard frame={frame} lines={CONTENT.s2.frames.map(t)}/></div>;
  if (screen === 3) return <div className="visual-card"><WeightGroups groups={3} frame={frame} unit="t"/><ConversionBoard frame={frame} lines={CONTENT.s3.frames.map(t)}/></div>;
  if (screen === 4) return <div className="visual-card"><MassRail frame={Math.min(frame + 1, 2)} active={['kg','sentner','t']}/><ConversionBoard frame={frame} lines={CONTENT.s4.frames.map(t)}/></div>;
  if (screen === 5) return <div className="visual-card direct-mass"><div className="direct-nodes"><strong>{t({ uz: 't', ru: 'т', en: "t" })}</strong><i>→</i><strong>{t({ uz: 'kg', ru: 'кг', en: "kg" })}</strong></div><ConversionBoard frame={frame} lines={CONTENT.s5.frames.map(t)}/></div>;
  if (screen === 6) return <div className="visual-card object-grid"><div>🍬<b>{t({ uz: 'Shakar 500 g', ru: 'Сахар 500 г', en: "Sugar 500 g" })}</b></div><div>🌾<b>{t({ uz: 'Un 25 kg', ru: 'Мука 25 кг', en: "Flour 25 kg" })}</b></div><div>🏭<b>{t({ uz: "G'alla 1 sentner", ru: 'Зерно 1 центнер', en: "Grain 1 centner" })}</b></div><div>📦<b>{t({ uz: 'Konteyner 4 t', ru: 'Контейнер 4 т', en: "Container 4 t" })}</b></div></div>;
  if (screen === 7) return <div className="visual-card"><ConversionBoard frame={frame} lines={CONTENT.s7.frames.map(t)}/></div>;
  if (screen >= 8 && screen <= 12) return <div className="visual-card"><MassRail frame={3} active={screen === 8 ? ['g','kg'] : screen === 9 ? ['kg','sentner'] : ['kg','sentner','t']}/><ConversionBoard frame={solved ? 2 : Math.min(frame,1)} lines={CONTENT['s' + screen].frames.map(t)}/></div>;
  if (screen === 13) return <div className="visual-card"><MassRail frame={3} active={['kg','sentner','t']}/><ConversionBoard frame={frame} lines={[t({ uz: '1 t', ru: '1 т', en: "1 t" }), t({ uz: '6 sentner', ru: '6 центнеров', en: "6 centners" }), solved ? t({ uz: '1600 kg', ru: '1600 кг', en: "1600 kg" }) : t({ uz: '? kg', ru: '? кг', en: "? kg" })]}/></div>;
  if (screen === 14) return <div className="visual-card cargo-final"><div className="cargo">🚚</div><div className="cargo-labels"><span className={frame >= 2 ? 'show' : ''}>{t({ uz: '1 t', ru: '1 т', en: "1 t" })}</span><span className={frame >= 2 ? 'show' : ''}>{t({ uz: '1000 kg', ru: '1000 кг', en: "1000 kg" })}</span></div><div className={frame >= 3 ? 'equality-brace show' : 'equality-brace'}><i/><b>=</b><i/></div><small className={frame >= 4 ? 'show' : ''}>{t({ uz: 'Keyingi dars: vaqt birliklari', ru: 'Следующий урок: единицы времени', en: "Next lesson: units of time" })}</small></div>;
  return <div className="visual-card"><MassRail frame={frame}/></div>;
}

function ChoiceExercise({ screen, storedAnswer, onAnswer, onNext, onPrev }) {
  const t = useT(); const c = CONTENT['s' + screen]; const audio = useNarration(c.audio, screen);
  const ordinal = [8, 9, 11, 12].indexOf(screen);
  const order = ordinal >= 0 ? buildOptionOrder(c.options.length, c.correctIndex, LESSON_META.lessonId, ordinal) : null;
  const narrationReady = audio.muted || audio.completed;
  const [picked, setPicked] = useState(storedAnswer?.studentAnswerIndex ?? null); const [solved, setSolved] = useState(storedAnswer?.correct === true);
  const attempts = useRef(storedAnswer?.attempts ?? 0); const clean = useRef(storedAnswer?.firstTry ?? true);
  const pick = (index) => {
    if (solved || !narrationReady) return; attempts.current += 1; const ok = index === c.correctIndex; if (!ok) clean.current = false; setPicked(index); setSolved(ok);
    playSfx(ok ? 'correct' : 'wrong'); const spoken = c.feedbackAudio?.[index]; if (spoken) audio.pushOneOff(t(spoken));
    onAnswer({ screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question), options: c.options.map(t), correctIndex: c.correctIndex, correctAnswer: t(c.options[c.correctIndex]), studentAnswerIndex: index, studentAnswer: t(c.options[index]), correct: ok, firstTry: ok && clean.current && attempts.current === 1, attempts: attempts.current, solved: ok });
  };
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!solved || !narrationReady}><div className="stack"><Heading c={c} bit={screen === 11 ? 'awkward' : null}/><MassVisual screen={screen} frame={audio.frame} solved={solved} disabled={!narrationReady}/><BeatList frames={c.frames} frame={audio.frame} solved={solved}/><section className="question"><h2>{t(c.question)}</h2><Options values={c.options} picked={picked} onPick={pick} correctIndex={c.correctIndex} solved={solved} order={order}/><FeedbackBlock show={picked !== null} correct={solved} proof={solved && c.proof ? t(c.proof) : null}>{picked !== null ? t(c.feedback[picked]) : ''}</FeedbackBlock></section></div></Stage>;
}
function InputExercise({ screen, storedAnswer, onAnswer, onNext, onPrev }) {
  const t = useT(); const c = CONTENT['s' + screen]; const audio = useNarration(c.audio, screen);
  const narrationReady = audio.muted || audio.completed;
  const [value, setValue] = useState(storedAnswer?.studentAnswer ?? ''); const [checked, setChecked] = useState((storedAnswer?.attempts ?? 0) > 0); const [solved, setSolved] = useState(storedAnswer?.correct === true);
  const attempts = useRef(storedAnswer?.attempts ?? 0); const clean = useRef(storedAnswer?.firstTry ?? true);
  const check = () => { if (!narrationReady || solved) return;
    const parsed = Number(String(value).replace(/\s/g, '')); if (!Number.isFinite(parsed)) return; attempts.current += 1; const ok = parsed === c.inputAnswer; if (!ok) clean.current = false; setChecked(true); setSolved(ok);
    playSfx(ok ? 'correct' : 'wrong'); audio.pushOneOff(t(ok ? c.feedbackAudio.correct : c.feedbackAudio.wrong));
    onAnswer({ screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question), options: null, correctIndex: null, correctAnswer: String(c.inputAnswer), studentAnswerIndex: null, studentAnswer: String(value), correct: ok, firstTry: ok && clean.current && attempts.current === 1, attempts: attempts.current, solved: ok });
  };
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!solved || !narrationReady}><div className="stack"><Heading c={c}/><MassVisual screen={screen} frame={audio.frame} solved={solved}/><BeatList frames={c.frames} frame={audio.frame} solved={solved}/><section className="question"><h2>{t(c.question)}</h2><div className="input-row"><input inputMode="numeric" value={value} onChange={(event) => { setValue(event.target.value.replace(/[^\d]/g, '')); setChecked(false); }} aria-label={t(c.question)}/><span>{t({ uz: 'kg', ru: 'кг', en: "kg" })}</span></div><div className="input-check-row"><button type="button" className="btn-white-accent" disabled={!narrationReady || solved || !value} onClick={check}>{t({ uz: 'Tekshirish', ru: 'Проверить', en: "Check" })}</button></div><FeedbackBlock show={checked} correct={solved} proof={solved && c.proof ? t(c.proof) : null}>{t(solved ? c.inputFeedback.correct : c.inputFeedback.wrong)}</FeedbackBlock></section></div></Stage>;
}
function Screen0({ screen, storedAnswer, onAnswer, onNext }) {
  const t = useT(); const c = CONTENT.s0; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [picked, setPicked] = useState(storedAnswer?.neutralChoice ?? null);
  const pick = (index) => { if (!narrationReady) return; setPicked(index); audio.pushOneOff(t(c.neutral)); onAnswer({ screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question), options: c.options.map(t), correctIndex: null, correctAnswer: null, studentAnswerIndex: index, studentAnswer: t(c.options[index]), correct: true, firstTry: true, attempts: 1, solved: true, neutralChoice: index }); };
  return <Stage screen={screen} audio={audio} onNext={onNext} nextDisabled={picked === null || !narrationReady}><div className="stack hook-stack" data-g4-screen="hook"><Heading c={c} bit="think" hook/><h2 className="hook-question-prompt" data-g4-role="hook-question">{t(c.question)}</h2><section className="hook-scene-adapter" data-g4-role="hook-scene"><div className="hook-scene-visual" data-g4-role="visual-frame"><MassVisual screen={screen} frame={audio.frame}/><BeatList frames={c.frames} frame={audio.frame}/><div className="hook-frame-bit" data-g4-role="hook-bit"><BitSVG state="think"/></div></div></section><section className="question" data-g4-role="answer-card"><h2>{t(c.question)}</h2><Options values={c.options} picked={picked} onPick={pick} neutral disabled={!narrationReady}/><FeedbackBlock show={picked !== null} correct>{t(c.neutral)}</FeedbackBlock></section></div></Stage>;
}
function TheoryScreen({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT['s' + screen]; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [strategyUsed, setStrategyUsed] = useState(false); const replayStep = (index) => { setStrategyUsed(true); audio.pushOneOff(t(c.frames[index])); };
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!strategyUsed || !narrationReady}><div className="stack"><Heading c={c}/><MassVisual screen={screen} frame={audio.frame}/><BeatList frames={c.frames} frame={audio.frame} onReplay={replayStep}/></div></Stage>;
}
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
  return createPortal(<div className="rank-boost-overlay g4-title-reveal-overlay" data-g4-role="rank-overlay" role="status" aria-live="assertive" aria-atomic="true"><div className="rank-boost-card g4-title-reveal-card"><div className="rank-boost-rays g4-title-reveal-rays" aria-hidden="true"/><div className="rank-boost-confetti g4-title-reveal-confetti" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <i key={index}/>)}</div><div className="rank-boost-medal g4-title-reveal-medal" aria-hidden="true">★</div><h2 className="g4-title-reveal-title">{t(title)}</h2></div></div>, document.body);
}

function G4TitleCard({ title, answers = [] }) {
  const t = useT();
  const scored = SCREEN_META.map((item, index) => item.scored ? index : null).filter((index) => index !== null);
  const firstTry = scored.filter((index) => answers[index]?.firstTry === true).length;
  return <aside className="g4-title-card" data-g4-role="title-card" role="status" aria-live="polite"><div className="g4-title-card-confetti" data-g4-role="reward-confetti" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i key={index}/>)}</div><div className="g4-title-card-bit" data-g4-role="reward-bit"><BitSVG state="happy"/></div><div className="g4-title-card-medal" data-g4-role="reward-medal" aria-hidden="true">★</div><span className="g4-title-card-kicker">{t({ uz: 'UNVON OLINDI', ru: 'ЗВАНИЕ ПОЛУЧЕНО', en: 'TITLE EARNED' })}</span><h2 className="g4-title-card-title">{t(title)}</h2><div className="g4-title-card-score"><strong>{firstTry}/{scored.length}</strong><span>{t({ uz: 'birinchi urinishda', ru: 'с первой попытки', en: 'on the first try' })}</span></div></aside>;
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
  const t = useT(); const c = CONTENT.s14; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [reflectionChoice, setReflectionChoice] = useState(storedAnswer?.reflectionChoice ?? null); const [titleClaimed, setTitleClaimed] = useState(storedAnswer?.titleClaimed === true); const title = { uz: "Massa nazoratchisi", ru: 'Контролёр массы', en: 'Mass inspector' }; const reflectionOptions = [{ uz: 'Model bilan tekshiraman', ru: 'Проверю по модели', en: 'I will check with a model' }, { uz: 'Qoida va birlikni tekshiraman', ru: 'Проверю правило и единицу', en: 'I will check the rule and unit' }, { uz: 'Teskari amal bilan tekshiraman', ru: 'Проверю обратным действием', en: 'I will use the inverse operation' }]; const chooseReflection = (index) => { if (!narrationReady || titleClaimed) return; setReflectionChoice(index); onAnswer({ ...(storedAnswer ?? {}), screenIdx: screen, stage: null, reflectionChoice: index, titleClaimed: false }); audio.pushOneOff(t(reflectionOptions[index])); }; const claimTitle = () => { if (!narrationReady || reflectionChoice === null || titleClaimed) return; setTitleClaimed(true); onAnswer({ screenIdx: screen, stage: null, question: t({ uz: 'Tanlangan tekshiruv', ru: 'Выбранная проверка', en: 'Chosen check' }), options: reflectionOptions.map(t), correctIndex: null, correctAnswer: null, studentAnswerIndex: reflectionChoice, studentAnswer: t(reflectionOptions[reflectionChoice]), correct: true, firstTry: true, attempts: 1, solved: true, reflectionChoice, titleClaimed: true }); };
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={titleClaimed ? finishLesson : undefined} nextDisabled={!titleClaimed} finish><div className="stack"><Heading c={c} bit="happy"/><MassVisual screen={screen} frame={audio.frame}/><BeatList frames={c.frames} frame={audio.frame}/><ReflectionPanel choices={reflectionOptions} choice={reflectionChoice} onChoose={chooseReflection} disabled={!narrationReady || titleClaimed}/><G4FinalTitleReward ready={narrationReady} titleClaimed={titleClaimed} reflectionChoice={reflectionChoice} onClaim={claimTitle} title={title} answers={answers}/></div></Stage>;
}
const Screen1 = TheoryScreen; const Screen2 = TheoryScreen; const Screen3 = TheoryScreen; const Screen4 = TheoryScreen; const Screen5 = TheoryScreen; const Screen6 = TheoryScreen; const Screen7 = TheoryScreen;
function Screen8(props) { return <ChoiceExercise {...props}/>; } function Screen9(props) { return <ChoiceExercise {...props}/>; } function Screen10(props) { return <ChoiceExercise {...props}/>; } function Screen11(props) { return <ChoiceExercise {...props}/>; } function Screen12(props) { return <ChoiceExercise {...props}/>; }
function Screen13(props) { return <InputExercise {...props}/>; }
const SCREENS = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14];

export default function Grade4Dars27({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished, previewMode }) {
  const showPreviewControls = langProp === undefined || langProp === null;
  const preview = previewMode ?? showPreviewControls;
  const [previewLang, setPreviewLang] = useState(normalizeLang(langProp));
  const lang = showPreviewControls ? normalizeLang(previewLang) : normalizeLang(langProp);
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
    if (onFinished) onFinished(payload); else console.log('[Grade4 Dars27 preview]', payload);
  }, [answers, lang, onFinished, studentName]);
  const Current = SCREENS[current];
  return <LangContext.Provider value={lang}><style>{STYLES + G4_ETALON_OVERRIDES}</style><div className={'lesson-root ' + (preview ? 'lesson-root-preview' : '')}>{showPreviewControls && <div className="preview-language" aria-label={LANGUAGE_SELECTOR_LABEL[lang]}>{SUPPORTED_LANGS.map((code) => <button type="button" key={code} className={previewLang === code ? 'preview-active' : ''} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>)}</div>}<Current key={current} screen={current} storedAnswer={answers[current]} answers={answers} onAnswer={recordAnswer} onPrev={() => setCurrent((value) => Math.max(0, value - 1))} onNext={() => setCurrent((value) => Math.min(TOTAL_SCREENS - 1, value + 1))} finishLesson={finishLesson}/></div></LangContext.Provider>;
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
  .hook-scene-visual>.cargo-hook{min-height:0!important;height:100%;padding:4px!important;align-content:center;gap:2px!important}
  .hook-scene-visual>.cargo-hook .cargo{font-size:34px;line-height:1}
  .hook-scene-visual>.cargo-hook .conversion-board{gap:3px}
  .hook-scene-visual>.cargo-hook .conversion-board>div{min-height:26px;padding:1px 3px;font-size:8px;line-height:1.05}
  .hook-scene-visual>.beat-list{display:none!important}
  .hook-stack>.question .options,.stage-hook .hook-question .options{grid-template-columns:repeat(3,minmax(0,1fr))!important}
  .hook-stack>.question .option,.stage-hook .hook-question .option{min-height:44px!important;grid-template-columns:1fr!important;justify-items:center!important;text-align:center!important}
  .hook-frame-bit{right:12px;bottom:-7px;width:68px;height:85px}
  .lesson-root .feedback[data-g4-role~="feedback-frame"]{height:auto!important;min-height:88px!important;grid-template-columns:54px minmax(0,1fr)!important;gap:9px!important}
  .lesson-root .feedback[data-g4-role~="feedback-frame"] [data-g4-role="feedback-bit"],.lesson-root .feedback[data-g4-role~="feedback-frame"]>.feedback-bit{width:54px!important;height:68px!important}
  .lesson-root .feedback[data-g4-feedback="solution"][data-g4-role~="bit-answer-comment"]{height:auto!important;min-height:68px!important;border-radius:15px!important;grid-template-columns:47px minmax(0,1fr)!important}
  .lesson-root .feedback[data-g4-feedback="solution"][data-g4-role~="bit-answer-comment"] [data-g4-role="feedback-bit"],.lesson-root .feedback[data-g4-feedback="solution"][data-g4-role~="bit-answer-comment"]>.feedback-bit{width:47px!important;height:59px!important}
  .lesson-root .feedback[data-g4-role~="feedback-frame"] p{font-size:14px!important}.rank-boost-overlay .g4-title-reveal-title{font-size:29px!important}
}
.hook-scene-visual{display:grid!important;grid-template-columns:minmax(0,1.35fr) minmax(92px,.65fr)!important;grid-template-rows:minmax(0,1fr)!important;gap:5px!important}
.hook-scene-visual>.cargo-hook{width:100%!important;height:100%!important;min-height:0!important;padding:4px!important;grid-template-rows:auto minmax(0,1fr)!important;gap:2px!important}
.hook-scene-visual>.cargo-hook .conversion-board{height:100%!important;min-height:0!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:3px!important}
.hook-scene-visual>.cargo-hook .conversion-board>div{min-width:0!important;min-height:0!important;height:100%!important;padding:3px!important;font-size:9px!important;line-height:1.08!important}
.hook-scene-visual>.beat-list{height:100%!important;min-height:0!important;padding:0!important;display:grid!important;grid-template-columns:1fr!important;grid-template-rows:repeat(3,minmax(0,1fr))!important;gap:3px!important}
.hook-scene-visual>.beat-list .beat{height:100%!important;min-height:0!important;padding:2px!important;grid-template-columns:18px minmax(0,1fr)!important;gap:2px!important}.hook-scene-visual>.beat-list .beat>b{width:18px!important;height:18px!important}.hook-scene-visual>.beat-list .beat>span{font-size:7px!important;line-height:1.05!important}
@media(prefers-reduced-motion:reduce){.rank-boost-overlay,.rank-boost-overlay * ,[data-g4-role="title-card"],[data-g4-role="title-card"] *{animation:none!important;transition:none!important}.rank-boost-overlay{opacity:1}.g4-title-reveal-confetti,.g4-title-card-confetti{display:none!important}}
.lesson-root [class*="formula"],.lesson-root [class*="equation"]{font-family:'JetBrains Mono',monospace!important}
.hook-stack>.question[data-g4-role="answer-card"]{display:contents!important}
.hook-stack>.question[data-g4-role="answer-card"]:has(.feedback.open)>.options{display:none!important}
.lesson-root .question:has(.feedback[data-g4-feedback="solution"].open)>.options{display:none!important}
.lesson-root [data-g4-role="title-card"]{width:100%!important;min-height:116px!important;height:auto!important;margin:0!important;padding:12px 82px 11px 67px!important;border-radius:17px!important;display:flex!important;flex-direction:column!important;justify-content:center!important;gap:4px!important;color:#FFF!important;background:radial-gradient(circle at 82% 20%,rgba(255,194,60,.26),transparent 30%),linear-gradient(135deg,#173B52,#0E6978)!important;box-shadow:0 28px 58px -27px rgba(22,143,163,.8)!important}
.lesson-root [data-g4-role="title-card"] [data-g4-role="reward-bit"]{width:72px!important;height:90px!important}
.lesson-root [data-g4-role="title-card"] [data-g4-role="reward-medal"]{width:44px!important;height:44px!important}
@media(max-width:639.98px){
  .lesson-root [data-g4-role="title-card"]{min-height:88px!important;padding:9px 59px 8px 51px!important;border-radius:14px!important}
  .lesson-root [data-g4-role="title-card"] [data-g4-role="reward-bit"]{width:57px!important;height:71px!important}
  .lesson-root [data-g4-role="title-card"] [data-g4-role="reward-medal"]{width:34px!important;height:34px!important}
}
`;

const STYLES = `${G4_TITLE_STYLES}
.stage-hook .visual-card{position:relative;isolation:isolate;overflow:hidden;border:1px solid rgba(144,228,235,.12);border-radius:24px;background:radial-gradient(circle at 87% 24%,rgba(121,211,218,.16),transparent 24%),radial-gradient(circle at 9% 88%,rgba(149,201,61,.11),transparent 25%),linear-gradient(145deg,rgba(22,143,163,.25),transparent 48%),linear-gradient(135deg,#153B50,#0B2232 72%);box-shadow:0 22px 50px -30px rgba(14,33,44,.75)}
@media(max-width:639.98px){.stage-hook .visual-card{border-radius:18px}}
html:has(.lesson-root),body:has(.lesson-root),#root:has(.lesson-root),.lesson-page:has(.lesson-root),.lesson-frame:has(.lesson-root){width:100%;height:100%;min-height:0!important;margin:0;overflow:hidden!important;overscroll-behavior:none}
.lesson-root,.lesson-root *{box-sizing:border-box}.lesson-root h1,.lesson-root h2,.lesson-root h3,.lesson-root h4,.lesson-root h5,.lesson-root h6,.lesson-root p,.lesson-root ul,.lesson-root ol{margin:0}.lesson-root button,.lesson-root input{font:inherit}
.lesson-root{position:fixed;inset:0;width:100%;height:100dvh;min-height:0;overflow:hidden;color:${T.ink};background:radial-gradient(circle at 88% 9%,rgba(22,143,163,.11),transparent 25%),linear-gradient(145deg,#F7F8F4,#EEF3F1);font-family:'Manrope',system-ui,sans-serif}
.stage{width:min(936px,100%);height:100dvh;margin:0 auto;display:flex;flex-direction:column;overflow:hidden}.stage-header{flex-shrink:0;padding-top:10px;padding-bottom:8px;background:rgba(247,248,244,.88);backdrop-filter:blur(14px);z-index:5}.progress-track{width:100%;height:6px;margin-bottom:10px;border-radius:999px;background:rgba(80,97,109,.16);overflow:hidden}.progress-fill{height:100%;border-radius:inherit;background:linear-gradient(90deg,${T.cyan},${T.accent});box-shadow:0 0 12px rgba(255,91,53,.42);transition:width .45s ease}.stage-chrome{min-width:0;display:flex;justify-content:space-between;align-items:center;gap:12px}.chrome-title,.chrome-actions,.audio-controls{display:flex;align-items:center;gap:9px}.chrome-title{min-width:0;overflow:hidden;color:${T.ink2};font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}.chrome-title>span:last-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.chrome-actions{flex:none}.status-dot{width:8px;height:8px;flex:none;border-radius:50%;background:${T.accent};box-shadow:0 0 10px rgba(255,91,53,.65)}.screen-type{padding:4px 8px;border-radius:999px;color:${T.cyan};background:${T.cyanSoft};font-size:10px;font-weight:800}.screen-count{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700}.icon-btn{width:44px;height:44px;padding:0;border:0;border-radius:10px;color:${T.ink2};background:rgba(255,255,255,.75);cursor:pointer;box-shadow:0 4px 12px -7px rgba(${T.shadowBase},.3)}
.stage-content{flex:1 1 auto;min-height:0;padding-top:10px;padding-bottom:16px;overflow:hidden}.stage-nav{flex:0 0 auto;min-height:72px;display:flex;align-items:center;justify-content:space-between;gap:12px;background:rgba(245,245,240,.95)}.btn-white-accent,.btn-ghost{min-width:128px;min-height:50px;padding:0 18px;border:0;border-radius:15px;cursor:pointer;font-weight:900}.btn-white-accent{color:${T.accent};background:#fff;box-shadow:0 12px 24px -17px rgba(255,91,53,.8)}.btn-white-accent:hover:not(:disabled){color:#fff;background:${T.accent}}.btn-white-accent:disabled{opacity:.42;cursor:not-allowed}.btn-ghost{color:${T.ink2};background:transparent}.btn-ghost:hover{background:#fff;box-shadow:0 10px 20px -16px rgba(${T.shadowBase},.5)}.compact{min-width:118px}.stack{height:100%;min-height:0;overflow:hidden;display:grid;align-content:center;gap:14px;animation:page-in .45s cubic-bezier(.16,1,.3,1) both}.heading{min-height:78px;display:flex;align-items:center;justify-content:space-between;gap:16px}.heading>div>span{color:${T.cyan};font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.heading h1{margin-top:4px!important;font:750 clamp(25px,4vw,38px)/1.06 'Source Serif 4',Georgia,serif}.heading .g1-char{width:78px;height:98px;flex:0 0 auto;overflow:visible;filter:drop-shadow(0 9px 11px rgba(23,59,82,.2))}.question,.model-card,.duel,.why-grid,.compare-card,.rule-card,.boundary,.summary-grid{padding:18px;border-radius:22px;background:rgba(255,255,255,.9);box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.48)}.question{display:grid;gap:13px}.question h2{font:720 clamp(17px,2.5vw,22px)/1.25 'Source Serif 4',Georgia,serif}.options{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.option{min-height:62px;padding:10px;border:0;border-radius:16px;display:grid;grid-template-columns:28px 1fr;align-items:center;gap:8px;color:${T.ink};background:#F8F8F4;text-align:left;cursor:pointer;box-shadow:0 10px 22px -20px rgba(${T.shadowBase},.46)}.option>b{width:27px;height:27px;border-radius:9px;display:grid;place-items:center;color:${T.cyan};background:${T.cyanSoft};font:900 11px 'JetBrains Mono',monospace}.option.picked{transform:translateY(-2px);background:${T.accentSoft};box-shadow:inset 0 0 0 2px rgba(255,91,53,.27)}.option.right{background:${T.successSoft};box-shadow:inset 0 0 0 2px rgba(34,122,83,.25)}.option.bad{background:${T.warnSoft};box-shadow:inset 0 0 0 2px rgba(169,111,19,.25)}.feedback{padding:12px 14px;border-radius:15px;display:grid;grid-template-columns:28px 1fr;gap:9px;align-items:start;opacity:0;transform:translateY(7px)}.feedback.open{opacity:1;transform:none;transition:.3s ease}.feedback.correct{background:${T.successSoft};box-shadow:inset 4px 0 ${T.success}}.feedback.wrong{background:${T.warnSoft};box-shadow:inset 4px 0 ${T.warn}}.feedback>b{font-size:18px}.feedback p{font-size:13px;line-height:1.45}.caption{position:static;bottom:4px;margin-top:12px;padding:9px 13px;border-radius:13px;color:#fff;background:rgba(23,59,82,.94);font-size:12px;line-height:1.4;z-index:3}
.proof{padding:12px;border-radius:14px;color:${T.success};background:${T.successSoft};text-align:center;font:900 15px 'JetBrains Mono',monospace;animation:proof-in .35s ease both}.frac{display:inline-flex;min-width:25px;flex-direction:column;align-items:center;vertical-align:middle;color:inherit;font:800 1em/1 'Source Serif 4',Georgia,serif}.frac i{width:100%;height:2px;margin:2px 0;border-radius:2px;background:currentColor}.frac-lg{font-size:1.35em}.hook-model,.whole-card,.rule-card,.finale-payoff{padding:18px;border-radius:22px;background:rgba(255,255,255,.9);box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.48)}
.lesson-root button:focus-visible,.lesson-root input:focus-visible,.lesson-root input[type='range']:focus-visible{outline:3px solid ${T.cyan};outline-offset:3px}
.hook-model{display:grid;place-items:center;gap:12px;background:linear-gradient(135deg,#E5F5F6,#FFF)}.fraction-model{width:min(620px,94%);margin:0 auto;display:grid;gap:10px}.fraction-bar{height:112px;display:grid;overflow:hidden;border-radius:18px;background:#F4F5F1;box-shadow:inset 0 0 0 3px rgba(23,59,82,.16)}.fraction-bar i{min-width:0;border-right:2px solid rgba(23,59,82,.18);background:#F4F5F1;transition:background .45s ease,transform .45s ease}.fraction-bar i:last-child{border-right:0}.fraction-bar i.cyan{background:#46B8C5}.fraction-bar i.lime{background:#95C93D}.fraction-bar i.merged{background:linear-gradient(135deg,#168FA3,#95C93D)}.fraction-bar.whole i{border-right:0}.fraction-model.compact .fraction-bar{height:48px;border-radius:11px}.model-label{justify-self:center;padding:8px 13px;border-radius:12px;color:#173B52;background:#E5F5F6;font:900 16px "JetBrains Mono",monospace}.state-note,.formula-card,.result-chip{padding:12px 15px;border-radius:14px;opacity:.12;transform:translateY(7px);transition:.4s ease;text-align:center}.state-note{color:#227A53;background:#E7F3EC;font-size:13px;font-weight:850}.formula-card{color:#FFF;background:#173B52;font:900 17px "JetBrains Mono",monospace}.result-chip{justify-self:center;color:#FFF;background:#FF5B35;font:900 20px "JetBrains Mono",monospace}.show{opacity:1!important;transform:none!important}.tokens{display:flex;align-items:center;justify-content:center;gap:8px;color:#50616D;font-size:12px;font-weight:800}.tokens i{width:28px;height:28px;border-radius:9px;background:#95C93D;animation:token-pop .4s ease both}.tokens i:nth-child(2){animation-delay:.1s}.tokens i:nth-child(3){animation-delay:.2s}.rule-card,.whole-card{display:grid;gap:12px}.rule-line{padding:13px;border-radius:14px;opacity:.12;transform:translateY(6px);color:#173B52;background:#E5F5F6;text-align:center;font:900 18px "JetBrains Mono",monospace;transition:.4s ease}.rule-line.accent{color:#FFF;background:#173B52}.wrong-formula{padding:12px;position:relative;opacity:.12;color:#A96F13;background:#FFF5D9;text-align:center;font:900 18px "JetBrains Mono",monospace;transition:.4s ease}.wrong-formula::after{content:"";position:absolute;left:28%;right:28%;top:50%;height:3px;transform:rotate(-8deg);background:#FF5B35}.number-line{height:150px;position:relative;padding:54px 7% 0}.nl-track{height:4px;position:relative;border-radius:4px;background:#173B52}.nl-tick{width:2px;height:18px;position:absolute;top:-7px;background:#87949D}.nl-tick span{position:absolute;top:20px;left:50%;transform:translateX(-50%);font:800 12px "JetBrains Mono",monospace}.nl-dot{width:44px;height:38px;position:absolute;top:27px;transform:translateX(-50%);border-radius:12px;display:grid;place-items:center;color:#FFF;font:900 11px "JetBrains Mono",monospace;z-index:2;animation:dot-pop .35s ease both}.nl-dot.cyan{background:#168FA3}.nl-dot.lime{background:#95C93D}.nl-arrow{height:22px;position:absolute;top:84px;border-top:3px solid #FF5B35;border-right:3px solid #FF5B35;border-radius:0 14px 0 0;animation:arrow-grow .45s ease both}.nl-arrow::after{content:"";position:absolute;right:-5px;top:-7px;border-left:8px solid #FF5B35;border-top:5px solid transparent;border-bottom:5px solid transparent}.model-choices{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.model-choices>div{padding:10px;border-radius:15px;display:grid;grid-template-columns:26px 1fr;align-items:center;gap:6px;background:#FFF;box-shadow:0 12px 24px -20px rgba(58,53,48,.6)}.model-choices>div>b{width:25px;height:25px;border-radius:8px;display:grid;place-items:center;color:#FFF;background:#168FA3;font:900 10px "JetBrains Mono",monospace}.bit-error{padding:14px;border-radius:18px;display:flex;align-items:center;justify-content:center;gap:12px;color:#A96F13;background:#FFF5D9;font:900 19px "JetBrains Mono",monospace}.bit-error b{position:relative}.bit-error b::after{content:"";position:absolute;left:-5px;right:-5px;top:50%;height:3px;transform:rotate(-8deg);background:#FF5B35}.context-step{opacity:.12;transform:translateY(6px);transition:opacity .38s ease,transform .38s ease}.energy-model{display:grid;grid-template-columns:1fr 32px 1fr;align-items:center;gap:8px}.energy-model>div{padding:10px;border-radius:15px;display:grid;grid-template-columns:30px 1fr;align-items:center;gap:8px;background:#FFF}.energy-model>div>span{font-size:23px}.energy-model>strong{text-align:center;color:#FF5B35;font-size:23px}.finale-heading{padding:11px 15px;border-radius:17px;background:linear-gradient(100deg,rgba(255,91,53,.09),transparent 52%),rgba(255,255,255,.92);box-shadow:0 13px 28px -24px rgba(255,91,53,.72)}.finale-heading>span{color:#FF5B35;font:900 9px "JetBrains Mono",monospace;letter-spacing:.12em}.finale-heading h1{margin-top:4px!important;color:#173B52;font:750 clamp(21px,3vw,28px)/1.08 "Source Serif 4",Georgia,serif}.finale-heading p{margin-top:4px!important;color:#50616D;font-size:11px}.finale-main{display:grid;grid-template-columns:minmax(270px,.9fr) minmax(310px,1.1fr);gap:10px}.finale-payoff{display:grid;align-content:center;gap:8px}.finale-payoff>small{color:#168FA3;font-size:9px;font-weight:900;letter-spacing:.09em}.finale-answer{padding:8px 10px;border-radius:11px;opacity:.14;transform:translateY(5px);color:#227A53;background:#E7F3EC;text-align:center;font:900 13px "JetBrains Mono",monospace;transition:.42s ease}.finale-takeaways{display:grid;gap:6px}.finale-takeaway{min-height:42px;padding:7px 10px;border-radius:12px;display:grid;grid-template-columns:27px 1fr;align-items:center;gap:8px;opacity:.14;transform:translateY(6px);background:#F8F8F4;transition:.42s ease}.finale-takeaway.show{background:#E5F5F6}.finale-takeaway>b{width:26px;height:26px;border-radius:9px;display:grid;place-items:center;color:#FFF;background:#168FA3;font:900 9px "JetBrains Mono",monospace}.finale-takeaway span{display:grid;gap:2px;font-size:11px;font-weight:800}.finale-takeaway small{color:#168FA3;font-size:8px;text-transform:uppercase}.finale-takeaway strong{color:#173B52;font-family:"JetBrains Mono",monospace}.finale-bottom{display:grid;grid-template-columns:1.2fr .8fr;gap:10px}.finale-bridge{padding:12px 15px;border-radius:16px;display:grid;align-content:center;gap:4px;opacity:.14;transform:translateY(6px);color:#FFF;background:#173B52;transition:.42s ease}.finale-bridge small{color:#98E1E5;font-size:9px;font-weight:900;letter-spacing:.1em}.finale-bridge strong{font:750 15px "Source Serif 4",Georgia,serif}.finale-reward{min-height:100px;position:relative;overflow:hidden;padding:12px 70px 11px 52px;border-radius:17px;display:grid;align-content:center;color:#FFF;background:linear-gradient(135deg,#234B62,#173B52)}.finale-reward>div:nth-child(2){display:grid;gap:3px}.finale-reward small{color:#98E1E5;font-size:8px;font-weight:900}.finale-reward strong{font:750 14px "Source Serif 4",Georgia,serif}.finale-reward b{color:#FFE284;font:900 11px "JetBrains Mono",monospace}.finale-reward>.g1-char{position:absolute;right:2px;bottom:-5px;width:67px;height:84px}.finale-medal{position:absolute;left:10px;top:50%;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;transform:translateY(-50%);color:#173B52;background:#95C93D}.preview-language{position:fixed;top:9px;right:9px;z-index:30;display:flex;gap:3px;padding:3px;border-radius:999px;background:rgba(255,255,255,.94)}.preview-language button{padding:4px 9px;border:0;border-radius:999px;background:transparent;cursor:pointer;font-size:10px;font-weight:900}.preview-language .preview-active{color:#FFF;background:#FF5B35}.tiny-action{min-height:46px;padding:8px 12px;border:0;border-radius:13px;justify-self:end;color:${T.accent};background:${T.accentSoft};cursor:pointer;box-shadow:0 8px 18px -16px rgba(${T.shadowBase},.5);font-size:12px;font-weight:800}.marker-control{width:min(620px,94%);padding:10px 13px;border-radius:14px;display:grid;gap:7px;color:${T.navy};background:${T.cyanSoft};font:850 12px 'Manrope',sans-serif}.free-marker{width:100%;min-height:44px;margin:0;accent-color:${T.accent};cursor:pointer}.nl-dot.free{top:102px;background:${T.navy};animation-duration:.4s}.attempt-model{border-radius:20px;transition:box-shadow .32s ease,background .32s ease}.attempt-highlight{box-shadow:0 0 0 3px rgba(22,143,163,.38),0 14px 26px -20px rgba(22,143,163,.8)!important;background:rgba(229,245,246,.72)!important}.attempt-cue{padding:9px 12px;border-radius:12px;color:${T.cyan};background:${T.cyanSoft};font-size:12px;font-weight:850;animation:attempt-cue-in .3s ease both}.stack{animation-duration:.5s}.caption{animation:caption-in .32s ease both}.formula-card{transition-duration:.32s!important}.result-chip{transition-duration:.22s!important}
.beat-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:8px}.beat{min-height:50px;padding:9px 10px;border-radius:14px;display:grid;grid-template-columns:25px 1fr;align-items:center;gap:8px;opacity:.12;transform:translateY(6px);background:rgba(255,255,255,.88);transition:.36s ease}.beat.show{opacity:1;transform:none}.beat>b{width:25px;height:25px;border-radius:8px;display:grid;place-items:center;color:#fff;background:#168FA3;font:900 10px 'JetBrains Mono',monospace}.beat>span{font-size:11px;font-weight:800;line-height:1.3}.visual-card{min-height:205px;padding:15px;border-radius:22px;display:grid;place-items:center;gap:12px;background:rgba(255,255,255,.9);box-shadow:0 18px 34px -28px rgba(58,53,48,.48)}.mass-rail{width:100%;display:grid;grid-template-columns:repeat(7,auto);align-items:center;justify-content:center;gap:8px}.mass-node{width:96px;min-height:76px;padding:8px;border-radius:15px;display:grid;place-items:center;opacity:.12;transform:translateY(5px);background:#F8F8F4;transition:.36s ease}.mass-node.show{opacity:1;transform:none}.mass-node.active{background:#E5F5F6;box-shadow:inset 0 0 0 2px rgba(22,143,163,.28)}.mass-node b{color:#168FA3;font:900 19px 'JetBrains Mono',monospace}.mass-node span{font-size:9px;font-weight:800}.mass-rail>i{opacity:.12;color:#FF5B35;font:900 10px 'JetBrains Mono',monospace}.mass-rail>i.show{opacity:1}.conversion-board{width:min(620px,100%);display:grid;grid-template-columns:repeat(auto-fit,minmax(135px,1fr));gap:8px}.conversion-board>div{min-height:45px;padding:10px;border-radius:13px;display:grid;place-items:center;opacity:.12;transform:translateY(5px);color:#173B52;background:#E5F5F6;font:900 13px 'JetBrains Mono',monospace;transition:.36s ease}.conversion-board>div.show{opacity:1;transform:none}.weight-groups{width:min(620px,100%);display:grid;grid-template-columns:repeat(10,1fr);gap:5px}.weight-groups i{min-height:48px;border-radius:10px;display:grid;place-items:center;opacity:.12;transform:scale(.85);background:#F8F8F4;transition:.34s ease}.weight-groups i.on{opacity:1;transform:scale(1);background:#95C93D}.weight-groups span{writing-mode:vertical-rl;color:#173B52;font:900 7px 'JetBrains Mono',monospace}.scale-model{width:min(520px,100%);display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:12px}.scale-model span{padding:18px;border-radius:18px;text-align:center;color:#173B52;background:#E5F5F6;font:900 22px 'JetBrains Mono',monospace}.scale-model i{font-style:normal;font-size:42px}.cargo{display:flex;align-items:center;gap:12px;font-size:54px}.cargo strong{padding:9px 13px;border-radius:13px;color:#fff;background:#FF5B35;font:900 20px 'JetBrains Mono',monospace}.direction-map{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.direction-map span{padding:10px;border-radius:13px;opacity:.12;background:#FFF0EA;color:#173B52;font:850 12px 'JetBrains Mono',monospace;transition:.35s ease}.direction-map b{color:#FF5B35}.object-grid{grid-template-columns:repeat(4,1fr)}.object-grid>div{min-width:120px;padding:15px;border-radius:17px;display:grid;place-items:center;gap:7px;background:#F8F8F4;font-size:34px}.object-grid b{color:#168FA3;font:900 15px 'JetBrains Mono',monospace}.input-row{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center}.input-row input{min-height:54px;padding:10px;border:2px solid rgba(22,143,163,.3);border-radius:14px;background:#fff;font:900 20px 'JetBrains Mono',monospace}.input-row span{font:900 18px 'JetBrains Mono',monospace}.input-check-row{display:flex;justify-content:flex-end}
.mass-node b.long{font-size:12px}.cargo-hook .cargo,.cargo-final .cargo{font-size:64px}.direct-mass{align-content:center}.direct-nodes{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:18px;width:min(430px,90%)}.direct-nodes strong{padding:18px;border-radius:18px;color:#fff;background:#168FA3;text-align:center;font:900 28px 'JetBrains Mono',monospace}.direct-nodes i{color:#FF5B35;font-style:normal;font-size:34px}.cargo-final{align-content:center}.cargo-labels{width:min(560px,100%);display:grid;grid-template-columns:1fr 1fr;gap:12px}.cargo-labels span{padding:11px;border-radius:14px;opacity:.12;transform:translateY(5px);color:#173B52;background:#E5F5F6;text-align:center;font:900 19px 'JetBrains Mono',monospace;transition:.36s ease}.equality-brace{width:min(430px,82%);display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:10px;opacity:.12;transform:translateY(5px);transition:.36s ease}.equality-brace i{height:2px;background:#FF5B35}.equality-brace b{color:#FF5B35;font:900 24px 'JetBrains Mono',monospace}.cargo-final small{padding:8px 12px;border-radius:12px;opacity:.12;transform:translateY(5px);color:#fff;background:#173B52;font-weight:900;transition:.36s ease}
@keyframes caption-in{from{opacity:0;transform:translateY(5px)}}@keyframes attempt-cue-in{from{opacity:0;transform:translateY(5px)}}@keyframes page-in{from{opacity:0;transform:translateY(10px)}}@keyframes proof-in{from{opacity:0;transform:translateY(5px)}}@keyframes token-pop{from{opacity:0;transform:scale(.45)}}@keyframes dot-pop{from{opacity:0;transform:translateX(-50%) scale(.55)}}@keyframes arrow-grow{from{transform:scaleX(0);transform-origin:left}}@keyframes bit-move{to{transform:translateY(-2px) rotate(2deg)}}@keyframes pulse{to{transform:scale(1.07)}}
@media(max-width:639.98px){.stage-header{padding-top:58px}.screen-type{display:none}.stage{width:min(390px,100%)}.heading{min-height:72px}.heading h1{font-size:26px}.heading .g1-char{width:65px;height:80px}.model-card,.hook-model,.whole-card,.rule-card,.question{padding:13px;border-radius:18px}.options{grid-template-columns:1fr}.option{min-height:52px}.fraction-bar{height:82px}.model-choices{grid-template-columns:1fr}.energy-model{grid-template-columns:1fr}.energy-model>strong{transform:rotate(90deg)}.stage-nav{min-height:68px}.btn-white-accent,.btn-ghost{min-width:112px;padding:0 12px}.finale-main,.finale-bottom{grid-template-columns:1fr}.finale-main,.finale-bottom{gap:8px}.finale-takeaway{min-height:36px}.number-line{height:135px;padding-inline:9%}}
@media(prefers-reduced-motion:reduce){.lesson-root *,.lesson-root *::before,.lesson-root *::after{scroll-behavior:auto!important;animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important}.state-note,.formula-card,.result-chip,.rule-line,.wrong-formula,.finale-answer,.finale-takeaway,.finale-bridge{opacity:1!important;transform:none!important}}
.caption-slot{flex:none;min-height:38px;padding:6px 10px;border-radius:11px;display:flex;align-items:center;visibility:hidden;color:#fff;background:rgba(23,59,82,.94);font-size:10px;line-height:1.22}.caption-slot.is-visible{visibility:visible}.feedback.feedback-slot{height:76px;min-height:76px;overflow:hidden;visibility:hidden;opacity:0;animation:none}.feedback.feedback-slot.open{visibility:visible;opacity:1}.feedback-bit{width:48px;height:58px;display:block}.feedback-bit .g1-char,.feedback-bit>svg{width:100%;height:100%}.feedback-proof{display:block;margin-top:4px;padding-top:4px;border-top:1px solid rgba(34,122,83,.2);color:${T.success};font:900 12px/1.2 'JetBrains Mono',monospace}.feedback-proof small{display:block;font-size:8px;letter-spacing:.1em}.lesson-root{height:100dvh!important;min-height:0!important;overflow:hidden!important}.stage-content{display:flex;flex-direction:column;gap:4px;overflow:hidden!important}.stage-content>.stack{flex:1;min-height:0}.btn-white-accent:disabled{cursor:not-allowed;opacity:.46}
@media(max-width:639.98px){.stage-header{padding-top:7px!important;padding-bottom:4px!important}.lesson-root-preview .stage-header{padding-top:48px!important}.progress-track{height:4px!important;margin-bottom:5px!important}.stage-content{padding-top:3px!important;padding-bottom:3px!important}.stage-nav{min-height:52px!important}.stack{gap:4px!important}.heading{min-height:40px!important}.heading h1{font-size:17px!important}.heading .g1-char{width:38px!important;height:48px!important}.question,.model-card,.visual-card,.hook-model,.whole-card,.rule-card,.beat-list{padding:5px!important;border-radius:11px!important}.options{gap:3px!important}.option{min-height:44px!important;padding:4px!important;border-radius:9px!important;font-size:9px!important}.feedback.feedback-slot{height:54px;min-height:54px!important;padding:4px 6px!important;grid-template-columns:32px 1fr!important;gap:4px!important}.feedback-bit{width:31px;height:39px}.feedback p{font-size:9px!important;line-height:1.16!important}.caption-slot{min-height:28px;padding:3px 7px;font-size:8px}.beat-list{gap:3px!important}.beat{min-height:29px!important;padding:3px!important;font-size:8px!important}.btn-white-accent,.btn-ghost{min-height:44px!important;min-width:104px!important;padding:0 8px!important;font-size:11px!important}.finale-main,.finale-bottom{grid-template-columns:1fr 1fr!important;gap:4px!important}}
.final-reflection{padding:6px 8px;border-radius:12px;display:grid;gap:5px;background:rgba(255,255,255,.9)}.final-reflection>strong{font:750 12px/1.2 'Source Serif 4',Georgia,serif}.final-reflection>div{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px}.final-reflection button{min-height:44px;padding:4px;border:0;border-radius:9px;display:grid;grid-template-columns:20px 1fr;align-items:center;gap:3px;color:${T.navy};background:${T.cyanSoft};cursor:pointer;text-align:left;font-size:8px;font-weight:850}.final-reflection button>span{width:19px;height:19px;border-radius:6px;display:grid;place-items:center;color:#fff;background:${T.cyan}}.final-reflection button.is-selected{color:#fff;background:${T.cyan}}.final-reflection button:disabled{cursor:default}.g4-title-claim:disabled{cursor:not-allowed;opacity:.46}
@media(max-width:639.98px){.stage-header{padding-top:11px!important}.lesson-root-preview .stage-header{padding-top:52px!important}}
@media(max-width:639.98px){.stage-content>.stack,.visual-card,.question,.input-row,.input-check-row{width:100%;min-width:0;max-width:100%}.input-row{grid-template-columns:minmax(0,1fr) auto}.input-row input{width:100%;min-width:0;max-width:100%}.input-check-row .btn-white-accent{min-width:104px;max-width:100%}.mass-rail{width:100%;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr) auto minmax(0,1fr) auto minmax(0,1fr);justify-content:stretch;gap:2px}.mass-node{width:auto;min-width:0;min-height:44px;padding:2px}.mass-node b{font-size:13px}.mass-node b.long{font-size:8px}.mass-node span{font-size:7px}}
`;
