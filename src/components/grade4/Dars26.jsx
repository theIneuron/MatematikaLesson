import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// 4-SINF · 26-DARS · Uzunlik birliklari
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
  lessonId: 'measure-4-26-v1',
  slug: 'dars26-uzunlik-birliklari',
  lessonTitle: { uz: "26-dars. Uzunlik birliklari", ru: 'Урок 26. Единицы длины', en: 'Lesson 26. Units of length' },
  skillTags: ['length', 'mm', 'cm', 'dm', 'm', 'km', 'unit_conversion'],
};

const SCREEN_META = [
  { id: 's0', type: 'hook', subtype: 'story-prediction', template: 'StoryChoice', mechanic: 'StoryChoice', goal: 'Predict whether two length notations are equivalent', misconceptions: ['unit labels ignored'], active: true, scored: false, scope: 'hook', resetOnReturn: true },
  { id: 's1', type: 'model', subtype: 'millimetre-centimetre-model', template: 'StrategyReplay', mechanic: 'StrategyReplay', goal: 'Connect ruler divisions with millimetres and centimetres', misconceptions: ['ten relation reversed'], active: true, scored: false, scope: null },
  { id: 's2', type: 'exploration', subtype: 'centimetre-decimetre-model', template: 'StrategyReplay', mechanic: 'StrategyReplay', goal: 'Build the centimetre-decimetre relation', misconceptions: ['hundred relation assumed'], active: true, scored: false, scope: null },
  { id: 's3', type: 'discovery', subtype: 'metric-unit-rail', template: 'StrategyReplay', mechanic: 'StrategyReplay', goal: 'Discover neighbouring metric-unit relations', misconceptions: ['all steps use one factor'], active: true, scored: false, scope: null },
  { id: 's4', type: 'discovery', subtype: 'kilometre-model', template: 'StrategyReplay', mechanic: 'StrategyReplay', goal: 'Connect metres with kilometres', misconceptions: ['kilometre uses factor ten'], active: true, scored: false, scope: null },
  { id: 's5', type: 'rule', subtype: 'conversion-direction-rule', template: 'StrategyReplay', mechanic: 'StrategyReplay', goal: 'Formulate multiply-or-divide conversion direction', misconceptions: ['operation direction reversed'], active: true, scored: false, scope: null },
  { id: 's6', type: 'strategy', subtype: 'unit-choice-strategy', template: 'StrategyReplay', mechanic: 'StrategyReplay', goal: 'Choose a sensible unit for an object', misconceptions: ['unit scale ignored'], active: true, scored: false, scope: null },
  { id: 's7', type: 'consolidation', subtype: 'mixed-length-transfer', template: 'StrategyReplay', mechanic: 'StrategyReplay', goal: 'Transfer conversions to a mixed length', misconceptions: ['units combined before conversion'], active: true, scored: false, scope: null },
  { id: 's8', type: 'test', subtype: 'mm-cm-practice', template: 'MCScreen', mechanic: 'MCScreen', goal: 'Convert millimetres and centimetres', misconceptions: ['factor ten reversed'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's9', type: 'test', subtype: 'cm-dm-practice', template: 'MCScreen', mechanic: 'MCScreen', goal: 'Convert centimetres and decimetres', misconceptions: ['wrong factor'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's10', type: 'strategy', subtype: 'm-km-check', template: 'MCScreen', mechanic: 'MCScreen', goal: 'Choose the correct metre-kilometre conversion', misconceptions: ['factor one hundred'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's11', type: 'error', subtype: 'misconception-repair', template: 'ErrorRepairChoice', mechanic: 'ErrorRepairChoice', goal: "Repair Bit's reversed conversion", misconceptions: ['multiply when converting to a larger unit'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's12', type: 'test', subtype: 'comparison-practice', template: 'MCScreen', mechanic: 'MCScreen', goal: 'Compare lengths after conversion', misconceptions: ['numbers compared without units'], active: true, scored: true, scoreUnits: 1, scope: 'module-mikro' },
  { id: 's13', type: 'case', subtype: 'life-context-transfer', template: 'NumInputScreen', mechanic: 'NumInputScreen', goal: 'Combine converted road lengths in context', misconceptions: ['mixed units added directly'], active: true, scored: true, scoreUnits: 1, scope: 'final' },
  { id: 's14', type: 'summary', subtype: 'reflection-and-title', template: 'ReflectionClaim', mechanic: 'ReflectionClaim', goal: 'Reflect on conversion and bridge to mass', misconceptions: ['unit label omitted'], active: true, scored: false, scope: null },
];

const CONTENT = {
  s0: {
    eyebrow: { uz: "O'lchov xizmati", ru: 'Измерительная служба', en: 'Measurement service' },
    title: { uz: "3 m va 300 cm tengmi?", ru: 'Равны ли 3 м и 300 см?', en: 'Are 3 m and 300 cm equal?' },
    frames: [{ uz: "Bitta kabel", ru: 'Один кабель', en: 'One cable' }, { uz: "Birinchi yorliq: 3 m", ru: 'Первая метка: 3 м', en: 'First label: 3 m' }, { uz: "Ikkinchi yorliq: 300 cm", ru: 'Вторая метка: 300 см', en: 'Second label: 300 cm' }],
    question: { uz: "Ikki yorliq bir xil uzunlikni ko'rsatadimi?", ru: 'Показывают ли две метки одну длину?', en: 'Do the two labels show the same length?' }, options: [{ uz: "Ha, teng", ru: 'Да, равны', en: 'Yes, they are equal' }, { uz: "Yo'q, 3 m uzunroq", ru: 'Нет, 3 м длиннее', en: 'No, 3 m is longer' }, { uz: "Yo'q, 300 cm uzunroq", ru: 'Нет, 300 см длиннее', en: 'No, 300 cm is longer' }],
    neutral: { uz: "Taxmin saqlandi. Endi birliklar orasidagi bog'lanishni modelda ochamiz.", ru: 'Гипотеза сохранена. Теперь раскроем связь между единицами на модели.', en: 'Your prediction has been recorded. Now we will use a model to reveal how the units are related.' },
    audio: { intro: { uz: ["O'lchov xizmatida bitta kabel turibdi.", "Kabelning bir yorlig'ida uch metr deb yozilgan.", "Ikkinchi yorliqda uch yuz santimetr yozilgan. Ular tengligini taxmin qiling."], ru: ['В измерительной службе лежит один кабель.', 'На одной метке кабеля написано три метра.', 'На второй метке написано триста сантиметров. Предположи, равны ли эти записи.'], en: ['There is one cable at the measurement service.', 'One label on the cable says three metres.', 'The second label says three hundred centimetres. Predict whether the two measurements are equal.'] } },
  },
  s1: {
    eyebrow: { uz: "Eng kichik bo'linmalar", ru: 'Самые мелкие деления', en: 'The smallest divisions' }, title: { uz: "Santimetr va millimetr", ru: 'Сантиметр и миллиметр', en: 'Centimetres and millimetres' },
    frames: [{ uz: "1 cm = 10 mm", ru: '1 см = 10 мм', en: '1 cm = 10 mm' }, { uz: "7 cm = 7 × 10 mm", ru: '7 см = 7 × 10 мм', en: '7 cm = 7 × 10 mm' }, { uz: "7 cm = 70 mm", ru: '7 см = 70 мм', en: '7 cm = 70 mm' }, { uz: "70 mm = 7 cm", ru: '70 мм = 7 см', en: '70 mm = 7 cm' }],
    audio: { uz: ["Bir santimetr o'n millimetrga teng.", "Yetti santimetrda o'ntadan yettita millimetr guruhi bor.", "Shuning uchun yetti santimetr yetmish millimetrga teng.", "Teskari yo'nalishda yetmish millimetrni o'ntadan guruhlasak, yetti santimetr chiqadi."], ru: ['Один сантиметр равен десяти миллиметрам.', 'В семи сантиметрах семь групп по десять миллиметров.', 'Поэтому семь сантиметров равны семидесяти миллиметрам.', 'В обратную сторону делим семьдесят миллиметров на группы по десять и получаем семь сантиметров.'], en: ['One centimetre equals ten millimetres.', 'Seven centimetres contain seven groups of ten millimetres.', 'Therefore, seven centimetres equals seventy millimetres.', 'In the opposite direction, group seventy millimetres into tens to get seven centimetres.'] },
  },
  s2: {
    eyebrow: { uz: "Keyingi bog'lanish", ru: 'Следующая связь', en: 'The next relationship' }, title: { uz: "Detsimetr va santimetr", ru: 'Дециметр и сантиметр', en: 'Decimetres and centimetres' },
    frames: [{ uz: "1 dm = 10 cm", ru: '1 дм = 10 см', en: '1 dm = 10 cm' }, { uz: "4 dm = 4 × 10 cm", ru: '4 дм = 4 × 10 см', en: '4 dm = 4 × 10 cm' }, { uz: "4 dm = 40 cm", ru: '4 дм = 40 см', en: '4 dm = 40 cm' }, { uz: "40 cm = 4 dm", ru: '40 см = 4 дм', en: '40 cm = 4 dm' }],
    audio: { uz: ["Bir detsimetr o'n santimetrga teng.", "To'rt detsimetrda o'ntadan to'rtta santimetr guruhi bor.", "Shuning uchun to'rt detsimetr qirq santimetrga teng.", "Teskari yo'nalishda qirq santimetrni o'ntadan guruhlasak, to'rt detsimetr chiqadi."], ru: ['Один дециметр равен десяти сантиметрам.', 'В четырёх дециметрах четыре группы по десять сантиметров.', 'Поэтому четыре дециметра равны сорока сантиметрам.', 'В обратную сторону делим сорок сантиметров на группы по десять и получаем четыре дециметра.'], en: ['One decimetre equals ten centimetres.', 'Four decimetres contain four groups of ten centimetres.', 'Therefore, four decimetres equals forty centimetres.', 'In the opposite direction, group forty centimetres into tens to get four decimetres.'] },
  },
  s3: {
    eyebrow: { uz: "Bir metr ichida", ru: 'Внутри одного метра', en: 'Inside one metre' }, title: { uz: "Metr, detsimetr va santimetr", ru: 'Метр, дециметр и сантиметр', en: 'Metres, decimetres and centimetres' },
    frames: [{ uz: "1 m = 10 dm", ru: '1 м = 10 дм', en: '1 m = 10 dm' }, { uz: "1 dm = 10 cm", ru: '1 дм = 10 см', en: '1 dm = 10 cm' }, { uz: "10 × 10 = 100", ru: '10 × 10 = 100', en: '10 × 10 = 100' }, { uz: "1 m = 100 cm", ru: '1 м = 100 см', en: '1 m = 100 cm' }],
    audio: { uz: ["Bir metr o'nta detsimetrga teng.", "Har bir detsimetrda o'nta santimetr bor.", "O'nta guruhning har birida o'ntadan santimetr, jami yuz santimetr bo'ladi.", "Shuning uchun bir metr yuz santimetrga teng."], ru: ['Один метр равен десяти дециметрам.', 'В каждом дециметре десять сантиметров.', 'В десяти группах по десять сантиметров, всего сто сантиметров.', 'Поэтому один метр равен ста сантиметрам.'], en: ['One metre equals ten decimetres.', 'Each decimetre contains ten centimetres.', 'Ten groups with ten centimetres in each make one hundred centimetres altogether.', 'Therefore, one metre equals one hundred centimetres.'] },
  },
  s4: {
    eyebrow: { uz: "Katta masofalar", ru: 'Большие расстояния', en: 'Long distances' }, title: { uz: "Kilometr va metr", ru: 'Километр и метр', en: 'Kilometres and metres' },
    frames: [{ uz: "1 km = 1000 m", ru: '1 км = 1000 м', en: '1 km = 1000 m' }, { uz: "2 km = 2 × 1000 m", ru: '2 км = 2 × 1000 м', en: '2 km = 2 × 1000 m' }, { uz: "2 km = 2000 m", ru: '2 км = 2000 м', en: '2 km = 2000 m' }, { uz: "2000 m = 2 km", ru: '2000 м = 2 км', en: '2000 m = 2 km' }],
    audio: { uz: ["Bir kilometr ming metrga teng.", "Ikki kilometrda mingtadan ikkita metr guruhi bor.", "Shuning uchun ikki kilometr ikki ming metrga teng.", "Teskari yo'nalishda ikki ming metrni mingtadan guruhlasak, ikki kilometr chiqadi."], ru: ['Один километр равен тысяче метров.', 'В двух километрах две группы по тысяче метров.', 'Поэтому два километра равны двум тысячам метров.', 'В обратную сторону делим две тысячи метров на группы по тысяче и получаем два километра.'], en: ['One kilometre equals one thousand metres.', 'Two kilometres contain two groups of one thousand metres.', 'Therefore, two kilometres equals two thousand metres.', 'In the opposite direction, group two thousand metres into thousands to get two kilometres.'] },
  },
  s5: {
    eyebrow: { uz: "Birliklar relsi", ru: 'Лента единиц', en: 'Unit ladder' }, title: { uz: "mm — cm — dm — m — km", ru: 'мм — см — дм — м — км', en: 'mm — cm — dm — m — km' },
    frames: [{ uz: "Katta birlikdan kichikka: ko'paytiring", ru: 'Из крупной единицы в мелкую: умножай', en: 'Larger unit to smaller: multiply' }, { uz: "Kichik birlikdan kattaga: bo'ling", ru: 'Из мелкой единицы в крупную: дели', en: 'Smaller unit to larger: divide' }, { uz: "mm — cm — dm — m: 10, 10, 10", ru: 'мм — см — дм — м: 10, 10, 10', en: 'mm — cm — dm — m: 10, 10, 10' }, { uz: "m va km orasida: 1000", ru: 'Между м и км: 1000', en: 'Between m and km: 1000' }],
    audio: { uz: ["Katta birlikdan kichik birlikka o'tganda sonni mos nisbatga ko'paytiring.", "Kichik birlikdan katta birlikka o'tganda sonni mos nisbatga bo'ling.", "Millimetr, santimetr, detsimetr va metr orasidagi ketma-ket nisbatlarning har biri o'nga teng.", "Metr bilan kilometr orasidagi nisbat mingga teng."], ru: ['При переходе из крупной единицы в мелкую умножай число на нужное отношение.', 'При переходе из мелкой единицы в крупную дели число на нужное отношение.', 'Между миллиметром, сантиметром, дециметром и метром каждое соседнее отношение равно десяти.', 'Отношение метра и километра равно тысяче.'], en: ['When converting from a larger unit to a smaller unit, multiply the number by the correct factor.', 'When converting from a smaller unit to a larger unit, divide the number by the correct factor.', 'Each step between millimetres, centimetres, decimetres and metres has a factor of ten.', 'The factor between metres and kilometres is one thousand.'] },
  },
  s6: {
    eyebrow: { uz: "Mos birlik", ru: 'Подходящая единица', en: 'A suitable unit' }, title: { uz: "Obyektga qarab birlik tanlang", ru: 'Выбирай единицу по объекту', en: 'Choose the unit to suit the object' },
    frames: [{ uz: "Sim qalinligi: 2 mm", ru: 'Толщина провода: 2 мм', en: 'Wire thickness: 2 mm' }, { uz: "Qalam uzunligi: 18 cm", ru: 'Длина карандаша: 18 см', en: 'Pencil length: 18 cm' }, { uz: "Xona uzunligi: 5 m", ru: 'Длина комнаты: 5 м', en: 'Room length: 5 m' }, { uz: "Shaharlar oralig'i: 300 km", ru: 'Между городами: 300 км', en: 'Distance between cities: 300 km' }],
    audio: { uz: ["Ingichka sim qalinligini ikki millimetr deb yozish qulay.", "Qalam uzunligini o'n sakkiz santimetr deb yozamiz.", "Xona uzunligi besh metr bo'lishi mumkin.", "Shaharlar orasidagi masofa uch yuz kilometr bilan ifodalanadi."], ru: ['Толщину тонкого провода удобно записать как два миллиметра.', 'Длину карандаша запишем как восемнадцать сантиметров.', 'Длина комнаты может быть равна пяти метрам.', 'Расстояние между городами выражают как триста километров.'], en: ['It is convenient to record the thickness of a thin wire as two millimetres.', 'We record the length of a pencil as eighteen centimetres.', 'A room may be five metres long.', 'The distance between cities can be expressed as three hundred kilometres.'] },
  },
  s7: {
    eyebrow: { uz: "Aralash yozuv", ru: 'Смешанная запись', en: 'Mixed-unit notation' }, title: { uz: "Katta birlikni ajratib aylantiring", ru: 'Преобразуй крупную единицу отдельно', en: 'Convert the larger unit separately' },
    frames: [{ uz: "2 m = 200 cm", ru: '2 м = 200 см', en: '2 m = 200 cm' }, { uz: "2 m 35 cm = 200 cm + 35 cm", ru: '2 м 35 см = 200 см + 35 см', en: '2 m 35 cm = 200 cm + 35 cm' }, { uz: "2 m 35 cm = 235 cm", ru: '2 м 35 см = 235 см', en: '2 m 35 cm = 235 cm' }, { uz: "4 km = 4000 m", ru: '4 км = 4000 м', en: '4 km = 4000 m' }, { uz: "4 km 300 m = 4300 m", ru: '4 км 300 м = 4300 м', en: '4 km 300 m = 4300 m' }],
    audio: { uz: ["Avval ikki metrni ikki yuz santimetrga aylantiramiz.", "Ikki metr o'ttiz besh santimetr endi ikki yuz santimetr va yana o'ttiz besh santimetr bo'ladi.", "Ularni qo'shsak, ikki yuz o'ttiz besh santimetr hosil bo'ladi.", "Keyingi yozuvda to'rt kilometrni to'rt ming metrga aylantiramiz.", "Uch yuz metrni qo'shsak, to'rt ming uch yuz metr hosil bo'ladi."], ru: ['Сначала преобразуем два метра в двести сантиметров.', 'Два метра тридцать пять сантиметров теперь записаны как двести сантиметров и ещё тридцать пять сантиметров.', 'Складываем и получаем двести тридцать пять сантиметров.', 'В следующей записи преобразуем четыре километра в четыре тысячи метров.', 'Прибавляем триста метров и получаем четыре тысячи триста метров.'], en: ['First, convert two metres to two hundred centimetres.', 'Two metres thirty-five centimetres is now two hundred centimetres plus another thirty-five centimetres.', 'Add them to get two hundred and thirty-five centimetres.', 'In the next measurement, convert four kilometres to four thousand metres.', 'Add three hundred metres to get four thousand three hundred metres.'] },
  },
  s8: {
    eyebrow: { uz: "Tekshiruv · 1/6", ru: 'Проверка · 1/6', en: 'Check · 1/6' }, title: { uz: "Santimetrdan millimetrga", ru: 'Из сантиметров в миллиметры', en: 'Centimetres to millimetres' },
    frames: [{ uz: "1 cm = 10 mm", ru: '1 см = 10 мм', en: '1 cm = 10 mm' }, { uz: "7 cm = ? mm", ru: '7 см = ? мм', en: '7 cm = ? mm' }],
    question: { uz: "7 cm necha millimetr?", ru: 'Сколько миллиметров в 7 см?', en: 'How many millimetres are in 7 cm?' }, options: [{ uz: '7 mm', ru: '7 мм', en: '7 mm' }, { uz: '70 mm', ru: '70 мм', en: '70 mm' }, { uz: '700 mm', ru: '700 мм', en: '700 mm' }, { uz: '17 mm', ru: '17 мм', en: '17 mm' }], correctIndex: 1,
    feedback: [{ uz: "Bir santimetrning o'zida o'n millimetr bor.", ru: 'Уже в одном сантиметре десять миллиметров.', en: 'One centimetre already contains ten millimetres.' }, { uz: "To'g'ri. Yetti karra o'n — yetmish.", ru: 'Верно. Семь раз по десять — семьдесят.', en: 'Correct. Seven groups of ten make seventy.' }, { uz: "Yuzga emas, o'nga ko'paytiring.", ru: 'Умножай на десять, а не на сто.', en: 'Multiply by ten, not by one hundred.' }, { uz: "Yettiga o'nni qo'shmang; o'nga ko'paytiring.", ru: 'Не прибавляй десять к семи; умножь на десять.', en: 'Do not add ten to seven; multiply by ten.' }],
    feedbackAudio: [{ uz: "Bir santimetrning o'zida o'n millimetr bor.", ru: 'Уже в одном сантиметре десять миллиметров.', en: 'One centimetre already contains ten millimetres.' }, { uz: "To'g'ri. Yetti karra o'n, yetmish.", ru: 'Верно. Семь раз по десять, семьдесят.', en: 'Correct. Seven groups of ten make seventy.' }, { uz: "Yuzga emas, o'nga ko'paytiring.", ru: 'Умножай на десять, а не на сто.', en: 'Multiply by ten, not by one hundred.' }, { uz: "Yettiga o'nni qo'shmang. O'nga ko'paytiring.", ru: 'Не прибавляй десять к семи. Умножь на десять.', en: 'Do not add ten to seven. Multiply by ten.' }],
    proof: { uz: "7 × 10 = 70 mm", ru: '7 × 10 = 70 мм', en: '7 × 10 = 70 mm' },
    audio: { intro: { uz: ["Bir santimetr o'n millimetrga tengligini eslang.", "Yetti santimetrni millimetrda ifodalang."], ru: ['Вспомни, что один сантиметр равен десяти миллиметрам.', 'Вырази семь сантиметров в миллиметрах.'], en: ['Remember that one centimetre equals ten millimetres.', 'Express seven centimetres in millimetres.'] } },
  },
  s9: {
    eyebrow: { uz: "Tekshiruv · 2/6", ru: 'Проверка · 2/6', en: 'Check · 2/6' }, title: { uz: "Detsimetrdan santimetrga", ru: 'Из дециметров в сантиметры', en: 'Decimetres to centimetres' },
    frames: [{ uz: "1 dm = 10 cm", ru: '1 дм = 10 см', en: '1 dm = 10 cm' }, { uz: "8 dm = ? cm", ru: '8 дм = ? см', en: '8 dm = ? cm' }],
    question: { uz: "8 dm necha santimetr?", ru: 'Сколько сантиметров в 8 дм?', en: 'How many centimetres are in 8 dm?' }, options: [{ uz: '8 cm', ru: '8 см', en: '8 cm' }, { uz: '18 cm', ru: '18 см', en: '18 cm' }, { uz: '80 cm', ru: '80 см', en: '80 cm' }, { uz: '800 cm', ru: '800 см', en: '800 cm' }], correctIndex: 2,
    feedback: [{ uz: "Bir detsimetr o'n santimetrga teng.", ru: 'Один дециметр равен десяти сантиметрам.', en: 'One decimetre equals ten centimetres.' }, { uz: "Sakkizga o'nni qo'shmang; o'nga ko'paytiring.", ru: 'Не прибавляй десять к восьми; умножь на десять.', en: 'Do not add ten to eight; multiply by ten.' }, { uz: "To'g'ri. Sakkiz karra o'n — sakson.", ru: 'Верно. Восемь раз по десять — восемьдесят.', en: 'Correct. Eight groups of ten make eighty.' }, { uz: "Yuzga emas, o'nga ko'paytiring.", ru: 'Умножай на десять, а не на сто.', en: 'Multiply by ten, not by one hundred.' }],
    feedbackAudio: [{ uz: "Bir detsimetr o'n santimetrga teng.", ru: 'Один дециметр равен десяти сантиметрам.', en: 'One decimetre equals ten centimetres.' }, { uz: "Sakkizga o'nni qo'shmang. O'nga ko'paytiring.", ru: 'Не прибавляй десять к восьми. Умножь на десять.', en: 'Do not add ten to eight. Multiply by ten.' }, { uz: "To'g'ri. Sakkiz karra o'n, sakson.", ru: 'Верно. Восемь раз по десять, восемьдесят.', en: 'Correct. Eight groups of ten make eighty.' }, { uz: "Yuzga emas, o'nga ko'paytiring.", ru: 'Умножай на десять, а не на сто.', en: 'Multiply by ten, not by one hundred.' }],
    proof: { uz: "8 × 10 = 80 cm", ru: '8 × 10 = 80 см', en: '8 × 10 = 80 cm' },
    audio: { intro: { uz: ["Bir detsimetr o'n santimetrga teng.", "Sakkiz detsimetrni santimetrda ifodalang."], ru: ['Один дециметр равен десяти сантиметрам.', 'Вырази восемь дециметров в сантиметрах.'], en: ['One decimetre equals ten centimetres.', 'Express eight decimetres in centimetres.'] } },
  },
  s10: {
    eyebrow: { uz: "Tekshiruv · 3/6", ru: 'Проверка · 3/6', en: 'Check · 3/6' }, title: { uz: "Kilometrdan metrga", ru: 'Из километров в метры', en: 'Kilometres to metres' },
    frames: [{ uz: "1 km = 1000 m", ru: '1 км = 1000 м', en: '1 km = 1000 m' }, { uz: "3 km = ? m", ru: '3 км = ? м', en: '3 km = ? m' }],
    question: { uz: "3 km necha metr?", ru: 'Сколько метров в 3 км?', en: 'How many metres are in 3 km?' }, options: [{ uz: '30 m', ru: '30 м', en: '30 m' }, { uz: '300 m', ru: '300 м', en: '300 m' }, { uz: '3000 m', ru: '3000 м', en: '3000 m' }, { uz: '30 000 m', ru: '30 000 м', en: '30,000 m' }], correctIndex: 2,
    feedback: [{ uz: "Bir kilometrda o'n emas, ming metr bor.", ru: 'В одном километре не десять, а тысяча метров.', en: 'One kilometre contains one thousand metres, not ten.' }, { uz: "Bir kilometrda yuz emas, ming metr bor.", ru: 'В одном километре не сто, а тысяча метров.', en: 'One kilometre contains one thousand metres, not one hundred.' }, { uz: "To'g'ri. Uch karra ming — uch ming.", ru: 'Верно. Три раза по тысяче — три тысячи.', en: 'Correct. Three groups of one thousand make three thousand.' }, { uz: "Mingni o'nga ortiq ko'paytirmang.", ru: 'Не увеличивай тысячу ещё в десять раз.', en: 'Do not make one thousand ten times too large.' }],
    feedbackAudio: [{ uz: "Bir kilometrda o'n emas, ming metr bor.", ru: 'В одном километре не десять, а тысяча метров.', en: 'One kilometre contains one thousand metres, not ten.' }, { uz: "Bir kilometrda yuz emas, ming metr bor.", ru: 'В одном километре не сто, а тысяча метров.', en: 'One kilometre contains one thousand metres, not one hundred.' }, { uz: "To'g'ri. Uch karra ming, uch ming.", ru: 'Верно. Три раза по тысяче, три тысячи.', en: 'Correct. Three groups of one thousand make three thousand.' }, { uz: "Mingni o'nga ortiq ko'paytirmang.", ru: 'Не увеличивай тысячу ещё в десять раз.', en: 'Do not make one thousand ten times too large.' }],
    proof: { uz: "3 × 1000 = 3000 m", ru: '3 × 1000 = 3000 м', en: '3 × 1000 = 3000 m' },
    audio: { intro: { uz: ["Bir kilometr ming metrga teng.", "Uch kilometrni metrda ifodalang."], ru: ['Один километр равен тысяче метров.', 'Вырази три километра в метрах.'], en: ['One kilometre equals one thousand metres.', 'Express three kilometres in metres.'] } },
  },
  s11: {
    eyebrow: { uz: "Tekshiruv · 4/6", ru: 'Проверка · 4/6', en: 'Check · 4/6' }, title: { uz: "Bitning xatosini tuzating", ru: 'Исправь ошибку Бита', en: "Correct Bit's mistake" },
    frames: [{ uz: "Bit: 4 m = 4000 cm", ru: 'Бит: 4 м = 4000 см', en: 'Bit: 4 m = 4000 cm' }, { uz: "1 m = 100 cm", ru: '1 м = 100 см', en: '1 m = 100 cm' }],
    question: { uz: "4 m ning to'g'ri yozuvi qaysi?", ru: 'Как правильно выразить 4 м?', en: 'Which is the correct conversion of 4 m?' }, options: [{ uz: '4 cm', ru: '4 см', en: '4 cm' }, { uz: '40 cm', ru: '40 см', en: '40 cm' }, { uz: '400 cm', ru: '400 см', en: '400 cm' }, { uz: '4000 cm', ru: '4000 см', en: '4000 cm' }], correctIndex: 2,
    feedback: [{ uz: "Bir metrning o'zi yuz santimetr.", ru: 'Уже один метр равен ста сантиметрам.', en: 'One metre already equals one hundred centimetres.' }, { uz: "To'rt metrda qirq emas, to'rt yuz santimetr bor.", ru: 'В четырёх метрах не сорок, а четыреста сантиметров.', en: 'Four metres contains four hundred centimetres, not forty.' }, { uz: "To'g'ri. To'rt karra yuz — to'rt yuz santimetr.", ru: 'Верно. Четыре раза по сто — четыреста сантиметров.', en: 'Correct. Four groups of one hundred make four hundred centimetres.' }, { uz: "Bit metrni millimetrga aylantirgandek uchta nol qo'shgan.", ru: 'Бит добавил три нуля, словно переводил метры в миллиметры.', en: 'Bit added three zeros as if converting metres to millimetres.' }],
    feedbackAudio: [{ uz: "Bir metrning o'zi yuz santimetr.", ru: 'Уже один метр равен ста сантиметрам.', en: 'One metre already equals one hundred centimetres.' }, { uz: "To'rt metrda qirq emas, to'rt yuz santimetr bor.", ru: 'В четырёх метрах не сорок, а четыреста сантиметров.', en: 'Four metres contains four hundred centimetres, not forty.' }, { uz: "To'g'ri. To'rt karra yuz, to'rt yuz santimetr.", ru: 'Верно. Четыре раза по сто, четыреста сантиметров.', en: 'Correct. Four groups of one hundred make four hundred centimetres.' }, { uz: "Bit metrni millimetrga aylantirgandek uchta nol qo'shgan.", ru: 'Бит добавил три нуля, словно переводил метры в миллиметры.', en: 'Bit added three zeros as if converting metres to millimetres.' }],
    proof: { uz: "4 × 100 = 400 cm", ru: '4 × 100 = 400 см', en: '4 × 100 = 400 cm' },
    audio: { intro: { uz: ["Bit to'rt metrni to'rt ming santimetr deb yozdi.", "Bir metrda nechta santimetr borligini tekshirib, to'g'ri javobni tanlang."], ru: ['Бит записал четыре метра как четыре тысячи сантиметров.', 'Проверь, сколько сантиметров в одном метре, и выбери верный ответ.'], en: ['Bit wrote four metres as four thousand centimetres.', 'Check how many centimetres are in one metre and choose the correct answer.'] } },
  },
  s12: {
    eyebrow: { uz: "Tekshiruv · 5/6", ru: 'Проверка · 5/6', en: 'Check · 5/6' }, title: { uz: "Aralash uzunlik", ru: 'Смешанная длина', en: 'A mixed-unit length' },
    frames: [{ uz: "2 m 8 cm", ru: '2 м 8 см', en: '2 m 8 cm' }, { uz: "208 cm", ru: '208 см', en: '208 cm' }],
    question: { uz: "2 m 8 cm ? 208 cm. Qaysi belgi mos?", ru: '2 м 8 см ? 208 см. Какой знак подходит?', en: '2 m 8 cm ? 208 cm. Which symbol belongs?' }, options: ['>', '<', '=', { uz: "Taqqoslab bo'lmaydi", ru: 'Нельзя сравнить', en: 'They cannot be compared' }], correctIndex: 2,
    feedback: [{ uz: "Ikki metr sakkiz santimetr 208 santimetrdan katta emas.", ru: 'Два метра восемь сантиметров не больше двухсот восьми сантиметров.', en: 'Two metres eight centimetres is not greater than two hundred and eight centimetres.' }, { uz: "Ikki yozuv bir uzunlikni bildiradi, kichik emas.", ru: 'Обе записи обозначают одну длину, первая не меньше.', en: 'The two measurements describe the same length, so the first is not smaller.' }, { uz: "To'g'ri. 2 m 8 cm = 208 cm.", ru: 'Верно. 2 м 8 см = 208 см.', en: 'Correct. 2 m 8 cm = 208 cm.' }, { uz: "Bir xil birlikka o'tkazilgach, ularni taqqoslash mumkin.", ru: 'После перевода в одну единицу величины можно сравнить.', en: 'Once both lengths use the same unit, they can be compared.' }],
    feedbackAudio: [{ uz: "Ikki metr sakkiz santimetr ikki yuz sakkiz santimetrdan katta emas.", ru: 'Два метра восемь сантиметров не больше двухсот восьми сантиметров.', en: 'Two metres eight centimetres is not greater than two hundred and eight centimetres.' }, { uz: "Ikki yozuv bir uzunlikni bildiradi, kichik emas.", ru: 'Обе записи обозначают одну длину, первая не меньше.', en: 'The two measurements describe the same length, so the first is not smaller.' }, { uz: "To'g'ri. Ikki metr sakkiz santimetr ikki yuz sakkiz santimetrga teng.", ru: 'Верно. Два метра восемь сантиметров равны двумстам восьми сантиметрам.', en: 'Correct. Two metres eight centimetres equals two hundred and eight centimetres.' }, { uz: "Bir xil birlikka o'tkazilgach, ularni taqqoslash mumkin.", ru: 'После перевода в одну единицу величины можно сравнить.', en: 'Once both lengths use the same unit, they can be compared.' }],
    proof: { uz: "2 m 8 cm = 200 cm + 8 cm = 208 cm", ru: '2 м 8 см = 200 см + 8 см = 208 см', en: '2 m 8 cm = 200 cm + 8 cm = 208 cm' },
    audio: { intro: { uz: ["Ikki metr sakkiz santimetrni santimetrda tasavvur qiling.", "Uni ikki yuz sakkiz santimetr bilan taqqoslab, mos belgini tanlang."], ru: ['Представь два метра восемь сантиметров в сантиметрах.', 'Сравни с двумястами восемью сантиметрами и выбери подходящий знак.'], en: ['Express two metres eight centimetres in centimetres.', 'Compare it with two hundred and eight centimetres and choose the correct symbol.'] } },
  },
  s13: {
    eyebrow: { uz: "Tekshiruv · 6/6", ru: 'Проверка · 6/6', en: 'Check · 6/6' }, title: { uz: "Javobni kiriting", ru: 'Введи ответ', en: 'Enter the answer' },
    frames: [{ uz: "1 km = 1000 m", ru: '1 км = 1000 м', en: '1 km = 1000 m' }, { uz: "+ 250 m", ru: '+ 250 м', en: '+ 250 m' }, { uz: "Jami metrni yozing", ru: 'Запиши общее число метров', en: 'Enter the total number of metres' }],
    question: { uz: "1 km 250 m necha metr?", ru: 'Сколько метров в 1 км 250 м?', en: 'How many metres are in 1 km 250 m?' }, inputAnswer: 1250,
    inputFeedback: { correct: { uz: "To'g'ri. Ming metrga ikki yuz ellik metr qo'shildi.", ru: 'Верно. К тысяче метров прибавили двести пятьдесят.', en: 'Correct. Two hundred and fifty metres were added to one thousand metres.' }, wrong: { uz: "Bir kilometrni ming metrga aylantirib, ikki yuz ellikni qo'shing.", ru: 'Преобразуй один километр в тысячу метров и прибавь двести пятьдесят.', en: 'Convert one kilometre to one thousand metres, then add two hundred and fifty.' } },
    feedbackAudio: { correct: { uz: "To'g'ri. Ming metrga ikki yuz ellik metr qo'shildi.", ru: 'Верно. К тысяче метров прибавили двести пятьдесят.', en: 'Correct. Two hundred and fifty metres were added to one thousand metres.' }, wrong: { uz: "Bir kilometrni ming metrga aylantirib, ikki yuz ellikni qo'shing.", ru: 'Преобразуй один километр в тысячу метров и прибавь двести пятьдесят.', en: 'Convert one kilometre to one thousand metres, then add two hundred and fifty.' } },
    proof: { uz: "1000 m + 250 m = 1250 m", ru: '1000 м + 250 м = 1250 м', en: '1000 m + 250 m = 1250 m' },
    audio: { intro: { uz: ["Bir kilometr ming metrga teng.", "Unga ikki yuz ellik metrni qo'shing.", "Natijani faqat metr soni bilan kiriting."], ru: ['Один километр равен тысяче метров.', 'Прибавь к нему двести пятьдесят метров.', 'Введи результат только числом метров.'], en: ['One kilometre equals one thousand metres.', 'Add two hundred and fifty metres.', 'Enter the result using only the number of metres.'] } },
  },
  s14: {
    eyebrow: { uz: "Yakun", ru: 'Итог', en: 'Summary' }, title: { uz: "3 m va 300 cm — bir uzunlik", ru: '3 м и 300 см — одна длина', en: '3 m and 300 cm are the same length' },
    frames: [{ uz: "1 cm = 10 mm", ru: '1 см = 10 мм', en: '1 cm = 10 mm' }, { uz: "1 dm = 10 cm", ru: '1 дм = 10 см', en: '1 dm = 10 cm' }, { uz: "1 m = 100 cm", ru: '1 м = 100 см', en: '1 m = 100 cm' }, { uz: "3 m = 300 cm", ru: '3 м = 300 см', en: '3 m = 300 cm' }, { uz: "Keyingi mavzu: massa birliklari", ru: 'Следующая тема: единицы массы', en: 'Next topic: units of mass' }],
    audio: { uz: ["Bir santimetr o'n millimetrga teng.", "Bir detsimetr o'n santimetrga teng.", "Bir metr yuz santimetrga teng.", "Shuning uchun boshlang'ich kabeldagi uch metr va uch yuz santimetr bir xil uzunlikdir.", "Keyingi darsda gramm, kilogramm, sentner va tonna orasidagi bog'lanishni o'rganamiz."], ru: ['Один сантиметр равен десяти миллиметрам.', 'Один дециметр равен десяти сантиметрам.', 'Один метр равен ста сантиметрам.', 'Поэтому три метра и триста сантиметров на исходном кабеле обозначают одну длину.', 'На следующем уроке изучим связь между граммом, килограммом, центнером и тонной.'], en: ['One centimetre equals ten millimetres.', 'One decimetre equals ten centimetres.', 'One metre equals one hundred centimetres.', 'Therefore, the three metres and three hundred centimetres on the original cable describe the same length.', 'In the next lesson, we will study the relationships between grams, kilograms, centners and tonnes.'] },
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
  return <div data-g4-role={show ? (correct ? 'feedback-frame bit-answer-comment' : 'feedback-frame') : undefined} data-g4-feedback={show ? (correct ? 'solution' : 'wrong') : undefined} role={show ? 'status' : undefined} aria-hidden={!show} className={`feedback feedback-slot ${correct ? 'correct' : 'wrong'} ${open ? 'open' : ''}`}><span className="feedback-bit" data-g4-role="feedback-bit"><BitSVG state={correct ? 'nod' : 'awkward'}/></span><p data-g4-role={show && correct ? 'bit-answer-comment' : undefined}>{show && correct && <b className="proof-label">{t({ uz: 'YECHIM', ru: 'РЕШЕНИЕ', en: 'SOLUTION' })}</b>}<span>{show ? children : ''}</span>{show && proof && <strong className="feedback-proof">{proof}</strong>}</p></div>;
};

const Stage = ({ screen, audio, onPrev, onNext, nextDisabled = false, finish = false, children }) => {
  const t = useT(); const mobile = useIsMobile(); const pad = mobile ? 14 : 48; const c = CONTENT[`s${screen}`]; const meta = SCREEN_META[screen];
  return <main className={`stage stage-${meta.type}`}><header className="stage-header" style={{ paddingLeft: pad, paddingRight: pad }}><div className="progress-track" aria-label={`${screen + 1} / ${TOTAL_SCREENS}`}><div className="progress-fill progress-bar" style={{ width: `${(screen + 1) / TOTAL_SCREENS * 100}%` }}/></div><div className="stage-chrome"><div className="chrome-title"><span className="status-dot"/><span>{t(c.eyebrow)}</span></div><div className="chrome-actions"><ScreenTypeLabel type={meta.type}/>{audio && <AudioIndicator audio={audio}/>}<span className="screen-count">{String(screen + 1).padStart(2, '0')} / {TOTAL_SCREENS}</span></div></div></header><section className="stage-content" style={{ paddingLeft: pad, paddingRight: pad }}>{children}<div className={`caption-slot ${audio?.caption && (audio.muted || audio.visualOnly) ? 'is-visible' : ''}`} aria-live="polite"><span>{audio?.caption && (audio.muted || audio.visualOnly) ? audio.caption : ''}</span></div></section><footer className="stage-nav" style={{ paddingLeft: pad, paddingRight: pad }}>{screen === 0 ? <span/> : <button type="button" className="btn-ghost" onClick={onPrev}>← {t({ uz: "Orqaga", ru: 'Назад', en: 'Back' })}</button>}<button type="button" className="btn-white-accent" disabled={nextDisabled || !onNext} onClick={onNext}>{finish ? t({ uz: "Darsni yakunlash", ru: 'Завершить урок', en: 'Finish lesson' }) : t({ uz: "Davom etish", ru: 'Продолжить', en: 'Continue' })} →</button></footer></main>;
};

const Heading = ({ c, bit, hook = false }) => { const t = useT(); return <div className="heading"><div><span data-g4-role={hook ? 'hook-topic' : undefined}>{t(c.eyebrow)}</span><h1 data-g4-role={hook ? 'hook-title' : undefined}>{t(c.title)}</h1></div>{bit && !hook && <BitSVG state={bit}/>}</div>; };
const Options = ({ values, picked, onPick, correctIndex, solved, neutral = false, disabled = false }) => {
  const t = useT();
  return <div className="options">{values.map((value, index) => <button type="button" data-g4-role="answer-card" key={index + '-' + t(value)} className={'option ' + (picked === index ? 'picked ' : '') + (!neutral && solved && index === correctIndex ? 'right ' : '') + (!neutral && picked === index && picked !== correctIndex ? 'bad' : '')} disabled={disabled || (!neutral && solved)} onClick={() => onPick(index)}><b>{String.fromCharCode(65 + index)}</b><span>{t(value)}</span></button>)}</div>;
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

const UNITS = [
  { key: 'mm', short: { uz: 'mm', ru: 'мм', en: 'mm' }, uz: 'millimetr', ru: 'миллиметр', en: 'millimetre' },
  { key: 'cm', short: { uz: 'cm', ru: 'см', en: 'cm' }, uz: 'santimetr', ru: 'сантиметр', en: 'centimetre' },
  { key: 'dm', short: { uz: 'dm', ru: 'дм', en: 'dm' }, uz: 'detsimetr', ru: 'дециметр', en: 'decimetre' },
  { key: 'm', short: { uz: 'm', ru: 'м', en: 'm' }, uz: 'metr', ru: 'метр', en: 'metre' },
  { key: 'km', short: { uz: 'km', ru: 'км', en: 'km' }, uz: 'kilometr', ru: 'километр', en: 'kilometre' },
];

function UnitRail({ frame = 4, active = [] }) {
  const t = useT();
  const links = ['10', '10', '10', '1000'];
  return <div className="unit-rail">{UNITS.map((unit, index) => <React.Fragment key={unit.key}><div className={'unit-node ' + (index <= frame ? 'show ' : '') + (active.includes(unit.key) ? 'active' : '')}><b>{t(unit.short)}</b><span>{t(unit)}</span></div>{index < UNITS.length - 1 && <i className={index < frame ? 'show' : ''}>{links[index]}</i>}</React.Fragment>)}</div>;
}

const Ruler = ({ divisions = 10, frame = 3, label }) => (
  <div className="ruler-model"><strong>{label}</strong><div>{Array.from({ length: divisions + 1 }, (_, index) => <i key={index} className={index <= frame * Math.ceil(divisions / 3) ? 'on' : ''}><span>{index}</span></i>)}</div></div>
);

function ConversionBoard({ lines, frame }) {
  return <div className="conversion-board">{lines.map((line, index) => <div key={line} className={index <= frame ? 'show' : ''}>{line}</div>)}</div>;
}

function LengthVisual({ screen, frame, solved = false }) {
  const t = useT();
  if (screen === 0) return <div className="visual-card"><div className="cable"><i/><i/><i/></div><ConversionBoard frame={frame} lines={[t({ uz: 'Bitta kabel', ru: 'Один кабель', en: 'One cable' }), t({ uz: '3 m', ru: '3 м', en: '3 m' }), t({ uz: '300 cm', ru: '300 см', en: '300 cm' })]}/></div>;
  if (screen === 1) return <div className="visual-card"><Ruler frame={frame} label={t({ uz: '1 cm', ru: '1 см', en: '1 cm' })}/><ConversionBoard frame={frame} lines={CONTENT.s1.frames.map(t)}/></div>;
  if (screen === 2) return <div className="visual-card"><div className="strip-ten">{Array.from({ length: 10 }, (_, i) => <i key={i} className={i <= frame * 3 ? 'on' : ''}/>)}</div><ConversionBoard frame={frame} lines={CONTENT.s2.frames.map(t)}/></div>;
  if (screen === 3) return <div className="visual-card"><UnitRail frame={Math.min(frame + 1, 4)} active={['cm','dm','m']}/><ConversionBoard frame={frame} lines={CONTENT.s3.frames.map(t)}/></div>;
  if (screen === 4) return <div className="visual-card road-map"><div className="road"><span>0</span><i/><strong>{t({ uz: '1 km', ru: '1 км', en: '1 km' })}</strong></div><ConversionBoard frame={frame} lines={CONTENT.s4.frames.map(t)}/></div>;
  if (screen === 5) return <div className="visual-card"><UnitRail frame={Math.min(frame + 1, 4)}/><div className="direction-map"><span className={frame >= 0 ? 'show' : ''}>{t({ uz: "Katta → kichik: ko'paytiring", ru: 'Крупная → мелкая: умножай', en: 'Large → small: multiply' })}</span><span className={frame >= 1 ? 'show' : ''}>{t({ uz: "Kichik → katta: bo'ling", ru: 'Мелкая → крупная: дели', en: 'Small → large: divide' })}</span></div></div>;
  if (screen === 6) return <div className="visual-card object-grid"><div>〰<b>{t({ uz: '2 mm', ru: '2 мм', en: '2 mm' })}</b></div><div>✏️<b>{t({ uz: '18 cm', ru: '18 см', en: '18 cm' })}</b></div><div>🏠<b>{t({ uz: '5 m', ru: '5 м', en: '5 m' })}</b></div><div>🛣️<b>{t({ uz: '300 km', ru: '300 км', en: '300 km' })}</b></div></div>;
  if (screen === 7) return <div className="visual-card mixed-board"><ConversionBoard frame={frame} lines={CONTENT.s7.frames.map(t)}/></div>;
  if (screen >= 8 && screen <= 12) return <div className="visual-card"><UnitRail frame={4} active={screen === 8 ? ['mm','cm'] : screen === 9 ? ['cm','dm'] : screen === 10 ? ['m','km'] : ['cm','m']}/><ConversionBoard frame={solved ? 2 : Math.min(frame, 1)} lines={CONTENT['s' + screen].frames.map(t)}/></div>;
  if (screen === 13) return <div className="visual-card"><UnitRail frame={4} active={['m','km']}/><ConversionBoard frame={frame} lines={[t({ uz: '1 km', ru: '1 км', en: '1 km' }), t({ uz: '+ 250 m', ru: '+ 250 м', en: '+ 250 m' }), solved ? t({ uz: '1250 m', ru: '1250 м', en: '1250 m' }) : t({ uz: '? m', ru: '? м', en: '? m' })]}/></div>;
  if (screen === 14) return <div className="visual-card cable-final"><div className="cable"><i/><i/><i/></div><div className="cable-labels"><span className={frame >= 0 ? 'show' : ''}>{t({ uz: '3 m', ru: '3 м', en: '3 m' })}</span><span className={frame >= 2 ? 'show' : ''}>{t({ uz: '300 cm', ru: '300 см', en: '300 cm' })}</span></div><div className={frame >= 3 ? 'equality-brace show' : 'equality-brace'}><i/><b>=</b><i/></div><small className={frame >= 4 ? 'show' : ''}>{t({ uz: 'Keyingi dars: massa birliklari', ru: 'Следующий урок: единицы массы', en: 'Next lesson: units of mass' })}</small></div>;
  return <div className="visual-card"><UnitRail frame={frame}/></div>;
}

function ChoiceExercise({ screen, storedAnswer, onAnswer, onNext, onPrev }) {
  const t = useT(); const c = CONTENT['s' + screen]; const audio = useNarration(c.audio, screen);
  const narrationReady = audio.muted || audio.completed;
  const [picked, setPicked] = useState(storedAnswer?.studentAnswerIndex ?? null); const [solved, setSolved] = useState(storedAnswer?.correct === true);
  const attempts = useRef(storedAnswer?.attempts ?? 0); const clean = useRef(storedAnswer?.firstTry ?? true);
  const pick = (index) => {
    if (solved || !narrationReady) return; attempts.current += 1; const ok = index === c.correctIndex; if (!ok) clean.current = false; setPicked(index); setSolved(ok);
    playSfx(ok ? 'correct' : 'wrong'); const spoken = c.feedbackAudio?.[index]; if (spoken) audio.pushOneOff(t(spoken));
    onAnswer({ screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question), options: c.options.map(t), correctIndex: c.correctIndex, correctAnswer: t(c.options[c.correctIndex]), studentAnswerIndex: index, studentAnswer: t(c.options[index]), correct: ok, firstTry: ok && clean.current && attempts.current === 1, attempts: attempts.current, solved: ok });
  };
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!solved || !narrationReady}><div className="stack"><Heading c={c} bit={screen === 11 ? 'awkward' : null}/><LengthVisual screen={screen} frame={audio.frame} solved={solved} disabled={!narrationReady}/><BeatList frames={c.frames} frame={audio.frame} solved={solved}/><section className="question"><h2>{t(c.question)}</h2><Options values={c.options} picked={picked} onPick={pick} correctIndex={c.correctIndex} solved={solved}/><FeedbackBlock show={picked !== null} correct={solved} proof={solved && c.proof ? t(c.proof) : null}>{picked !== null ? t(c.feedback[picked]) : ''}</FeedbackBlock></section></div></Stage>;
}

function InputExercise({ screen, storedAnswer, onAnswer, onNext, onPrev }) {
  const t = useT(); const c = CONTENT['s' + screen]; const audio = useNarration(c.audio, screen);
  const narrationReady = audio.muted || audio.completed;
  const [value, setValue] = useState(storedAnswer?.studentAnswer ?? ''); const [checked, setChecked] = useState(storedAnswer?.attempts > 0); const [solved, setSolved] = useState(storedAnswer?.correct === true);
  const attempts = useRef(storedAnswer?.attempts ?? 0); const clean = useRef(storedAnswer?.firstTry ?? true);
  const check = () => { if (!narrationReady || solved) return;
    const parsed = Number(String(value).replace(/\s/g, '')); if (!Number.isFinite(parsed)) return; attempts.current += 1; const ok = parsed === c.inputAnswer; if (!ok) clean.current = false; setChecked(true); setSolved(ok);
    playSfx(ok ? 'correct' : 'wrong'); audio.pushOneOff(t(ok ? c.feedbackAudio.correct : c.feedbackAudio.wrong));
    onAnswer({ screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question), options: null, correctIndex: null, correctAnswer: String(c.inputAnswer), studentAnswerIndex: null, studentAnswer: String(value), correct: ok, firstTry: ok && clean.current && attempts.current === 1, attempts: attempts.current, solved: ok });
  };
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!solved || !narrationReady}><div className="stack"><Heading c={c}/><LengthVisual screen={screen} frame={audio.frame} solved={solved}/><BeatList frames={c.frames} frame={audio.frame} solved={solved}/><section className="question"><h2>{t(c.question)}</h2><div className="input-row"><input inputMode="numeric" value={value} onChange={(event) => { setValue(event.target.value.replace(/[^\d]/g, '')); setChecked(false); }} aria-label={t(c.question)}/><span>{t({ uz: 'm', ru: 'м', en: 'm' })}</span></div><div className="input-check-row"><button type="button" className="btn-white-accent" disabled={!narrationReady || solved || !value} onClick={check}>{t({ uz: 'Tekshirish', ru: 'Проверить', en: 'Check' })}</button></div><FeedbackBlock show={checked} correct={solved} proof={solved && c.proof ? t(c.proof) : null}>{t(solved ? c.inputFeedback.correct : c.inputFeedback.wrong)}</FeedbackBlock></section></div></Stage>;
}

function Screen0({ screen, storedAnswer, onAnswer, onNext }) {
  const t = useT(); const c = CONTENT.s0; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [picked, setPicked] = useState(storedAnswer?.neutralChoice ?? null);
  const pick = (index) => { if (!narrationReady) return; setPicked(index); audio.pushOneOff(t(c.neutral)); onAnswer({ screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question), options: c.options.map(t), correctIndex: null, correctAnswer: null, studentAnswerIndex: index, studentAnswer: t(c.options[index]), correct: true, firstTry: true, attempts: 1, solved: true, neutralChoice: index }); };
  return <Stage screen={screen} audio={audio} onNext={onNext} nextDisabled={picked === null || !narrationReady}><div className="stack hook-stack" data-g4-screen="hook"><Heading c={c} bit="think" hook/><h2 className="hook-question-prompt" data-g4-role="hook-question">{t(c.question)}</h2><section className="hook-scene-adapter" data-g4-role="hook-scene"><div className="hook-scene-visual" data-g4-role="visual-frame"><LengthVisual screen={screen} frame={audio.frame}/><BeatList frames={c.frames} frame={audio.frame}/><div className="hook-frame-bit" data-g4-role="hook-bit"><BitSVG state="think"/></div></div></section><section className="question" data-g4-role="answer-card"><h2>{t(c.question)}</h2><Options values={c.options} picked={picked} onPick={pick} neutral disabled={!narrationReady}/><FeedbackBlock show={picked !== null} correct>{t(c.neutral)}</FeedbackBlock></section></div></Stage>;
}
function TheoryScreen({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT['s' + screen]; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [strategyUsed, setStrategyUsed] = useState(false); const replayStep = (index) => { setStrategyUsed(true); audio.pushOneOff(t(c.frames[index])); };
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext} nextDisabled={!strategyUsed || !narrationReady}><div className="stack"><Heading c={c}/><LengthVisual screen={screen} frame={audio.frame}/><BeatList frames={c.frames} frame={audio.frame} onReplay={replayStep}/></div></Stage>;
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
  const t = useT(); const c = CONTENT.s14; const audio = useNarration(c.audio, screen); const narrationReady = audio.muted || audio.completed; const [reflectionChoice, setReflectionChoice] = useState(storedAnswer?.reflectionChoice ?? null); const [titleClaimed, setTitleClaimed] = useState(storedAnswer?.titleClaimed === true); const title = { uz: "O'lchov yo'lboshchisi", ru: 'Навигатор измерений', en: 'Measurement Navigator' }; const reflectionOptions = [{ uz: 'Model bilan tekshiraman', ru: 'Проверю по модели', en: 'I will check with a model' }, { uz: 'Qoida va birlikni tekshiraman', ru: 'Проверю правило и единицу', en: 'I will check the rule and unit' }, { uz: 'Teskari amal bilan tekshiraman', ru: 'Проверю обратным действием', en: 'I will use the inverse operation' }]; const chooseReflection = (index) => { if (!narrationReady || titleClaimed) return; setReflectionChoice(index); onAnswer({ ...(storedAnswer ?? {}), screenIdx: screen, stage: null, reflectionChoice: index, titleClaimed: false }); audio.pushOneOff(t(reflectionOptions[index])); }; const claimTitle = () => { if (!narrationReady || reflectionChoice === null || titleClaimed) return; setTitleClaimed(true); onAnswer({ screenIdx: screen, stage: null, question: t({ uz: 'Tanlangan tekshiruv', ru: 'Выбранная проверка', en: 'Chosen check' }), options: reflectionOptions.map(t), correctIndex: null, correctAnswer: null, studentAnswerIndex: reflectionChoice, studentAnswer: t(reflectionOptions[reflectionChoice]), correct: true, firstTry: true, attempts: 1, solved: true, reflectionChoice, titleClaimed: true }); };
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={titleClaimed ? finishLesson : undefined} nextDisabled={!titleClaimed} finish><div className="stack"><Heading c={c} bit="happy"/><LengthVisual screen={screen} frame={audio.frame}/><BeatList frames={c.frames} frame={audio.frame}/><ReflectionPanel choices={reflectionOptions} choice={reflectionChoice} onChoose={chooseReflection} disabled={!narrationReady || titleClaimed}/><G4FinalTitleReward ready={narrationReady} titleClaimed={titleClaimed} reflectionChoice={reflectionChoice} onClaim={claimTitle} title={title} answers={answers}/></div></Stage>;
}
const Screen1 = TheoryScreen; const Screen2 = TheoryScreen; const Screen3 = TheoryScreen; const Screen4 = TheoryScreen; const Screen5 = TheoryScreen; const Screen6 = TheoryScreen; const Screen7 = TheoryScreen;
function Screen8(props) { return <ChoiceExercise {...props}/>; } function Screen9(props) { return <ChoiceExercise {...props}/>; } function Screen10(props) { return <ChoiceExercise {...props}/>; } function Screen11(props) { return <ChoiceExercise {...props}/>; } function Screen12(props) { return <ChoiceExercise {...props}/>; }
function Screen13(props) { return <InputExercise {...props}/>; }
const SCREENS = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14];

export default function Grade4Dars26({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished, previewMode }) {
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
    if (onFinished) onFinished(payload); else console.log('[Grade4 Dars26 preview]', payload);
  }, [answers, lang, onFinished, studentName]);
  const Current = SCREENS[current];
  return <LangContext.Provider value={lang}><style>{STYLES + G4_ETALON_OVERRIDES}</style><div className={'lesson-root ' + (preview ? 'lesson-root-preview' : '')}>{showPreviewControls && <div className="preview-language" aria-label={{ uz: "Ko'rib chiqish tili", ru: 'Язык предпросмотра', en: 'Preview language' }[lang]}>{SUPPORTED_LANGS.map((code) => <button type="button" key={code} className={previewLang === code ? 'preview-active' : ''} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>)}</div>}<Current key={current} screen={current} storedAnswer={answers[current]} answers={answers} onAnswer={recordAnswer} onPrev={() => setCurrent((value) => Math.max(0, value - 1))} onNext={() => setCurrent((value) => Math.min(TOTAL_SCREENS - 1, value + 1))} finishLesson={finishLesson}/></div></LangContext.Provider>;
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
.hook-scene-visual>.visual-card{width:100%!important;height:100%!important;min-height:0!important;padding:4px!important;gap:3px!important}
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
.beat-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:8px}.beat{min-height:50px;padding:9px 10px;border-radius:14px;display:grid;grid-template-columns:25px 1fr;align-items:center;gap:8px;opacity:.12;transform:translateY(6px);background:rgba(255,255,255,.88);transition:.36s ease}.beat.show{opacity:1;transform:none}.beat>b{width:25px;height:25px;border-radius:8px;display:grid;place-items:center;color:#fff;background:#168FA3;font:900 10px 'JetBrains Mono',monospace}.beat>span{font-size:11px;font-weight:800;line-height:1.3}.visual-card{min-height:205px;padding:15px;border-radius:22px;display:grid;place-items:center;gap:12px;background:rgba(255,255,255,.9);box-shadow:0 18px 34px -28px rgba(58,53,48,.48)}.unit-rail{width:100%;display:grid;grid-template-columns:repeat(9,auto);align-items:center;justify-content:center;gap:6px}.unit-node{width:76px;min-height:72px;padding:8px;border-radius:15px;display:grid;place-items:center;opacity:.12;transform:translateY(5px);background:#F8F8F4;transition:.36s ease}.unit-node.show{opacity:1;transform:none}.unit-node.active{background:#E5F5F6;box-shadow:inset 0 0 0 2px rgba(22,143,163,.28)}.unit-node b{color:#168FA3;font:900 20px 'JetBrains Mono',monospace}.unit-node span{font-size:9px;font-weight:800}.unit-rail>i{opacity:.12;color:#FF5B35;font:900 10px 'JetBrains Mono',monospace;transition:.35s ease}.unit-rail>i.show{opacity:1}.conversion-board{width:min(600px,100%);display:grid;grid-template-columns:repeat(auto-fit,minmax(135px,1fr));gap:8px}.conversion-board>div{min-height:45px;padding:10px;border-radius:13px;display:grid;place-items:center;opacity:.12;transform:translateY(5px);color:#173B52;background:#E5F5F6;font:900 14px 'JetBrains Mono',monospace;transition:.36s ease}.conversion-board>div.show{opacity:1;transform:none}.ruler-model{width:min(610px,100%);display:grid;gap:8px}.ruler-model>strong{text-align:center;color:#173B52}.ruler-model>div{height:74px;display:flex;align-items:flex-end;border-bottom:5px solid #173B52}.ruler-model i{height:22px;flex:1;position:relative;border-left:2px solid #87949D;opacity:.15;transition:.3s ease}.ruler-model i.on{height:38px;opacity:1}.ruler-model i:last-child{border-right:2px solid #87949D}.ruler-model i span{position:absolute;bottom:42px;left:-4px;font:800 8px 'JetBrains Mono',monospace}.strip-ten{width:min(620px,100%);height:70px;display:grid;grid-template-columns:repeat(10,1fr);overflow:hidden;border:3px solid #173B52;border-radius:14px}.strip-ten i{border-right:1px solid #87949D;background:#F8F8F4;transition:.35s ease}.strip-ten i.on{background:#46B8C5}.cable{width:min(600px,100%);display:grid;grid-template-columns:repeat(3,1fr);gap:5px}.cable i{height:32px;border-radius:999px;background:linear-gradient(90deg,#168FA3,#46B8C5);animation:arrow-grow .45s ease both}.cable i:nth-child(2){animation-delay:.12s}.cable i:nth-child(3){animation-delay:.24s}.road-map{align-content:center}.road{width:min(620px,100%);height:64px;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:8px}.road i{height:9px;border-radius:999px;background:repeating-linear-gradient(90deg,#173B52 0 30px,transparent 30px 42px)}.direction-map{display:grid;grid-template-columns:1fr 1fr;gap:9px}.direction-map span{padding:10px;border-radius:13px;opacity:.12;background:#FFF0EA;color:#173B52;font:850 13px 'JetBrains Mono',monospace;transition:.35s ease}.direction-map b{color:#FF5B35}.object-grid{grid-template-columns:repeat(4,1fr)}.object-grid>div{min-width:120px;padding:15px;border-radius:17px;display:grid;place-items:center;gap:7px;background:#F8F8F4;font-size:34px}.object-grid b{color:#168FA3;font:900 18px 'JetBrains Mono',monospace}.input-row{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center}.input-row input{min-height:54px;padding:10px;border:2px solid rgba(22,143,163,.3);border-radius:14px;background:#fff;font:900 20px 'JetBrains Mono',monospace}.input-row span{font:900 18px 'JetBrains Mono',monospace}.input-check-row{display:flex;justify-content:flex-end}
.cable-final{align-content:center}.cable-final .cable-labels{width:min(600px,100%);display:grid;grid-template-columns:1fr 1fr;gap:12px}.cable-labels span{padding:10px;border-radius:14px;opacity:.12;transform:translateY(5px);color:#173B52;background:#E5F5F6;text-align:center;font:900 18px 'JetBrains Mono',monospace;transition:.36s ease}.equality-brace{width:min(430px,82%);display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:10px;opacity:.12;transform:translateY(5px);transition:.36s ease}.equality-brace i{height:2px;background:#FF5B35}.equality-brace b{color:#FF5B35;font:900 24px 'JetBrains Mono',monospace}.cable-final small{padding:8px 12px;border-radius:12px;opacity:.12;transform:translateY(5px);color:#fff;background:#173B52;font-weight:900;transition:.36s ease}
@keyframes caption-in{from{opacity:0;transform:translateY(5px)}}@keyframes attempt-cue-in{from{opacity:0;transform:translateY(5px)}}@keyframes page-in{from{opacity:0;transform:translateY(10px)}}@keyframes proof-in{from{opacity:0;transform:translateY(5px)}}@keyframes token-pop{from{opacity:0;transform:scale(.45)}}@keyframes dot-pop{from{opacity:0;transform:translateX(-50%) scale(.55)}}@keyframes arrow-grow{from{transform:scaleX(0);transform-origin:left}}@keyframes bit-move{to{transform:translateY(-2px) rotate(2deg)}}@keyframes pulse{to{transform:scale(1.07)}}
@media(max-width:639.98px){.stage-header{padding-top:58px}.screen-type{display:none}.stage{width:min(390px,100%)}.heading{min-height:72px}.heading h1{font-size:26px}.heading .g1-char{width:65px;height:80px}.model-card,.hook-model,.whole-card,.rule-card,.question{padding:13px;border-radius:18px}.options{grid-template-columns:1fr}.option{min-height:52px}.fraction-bar{height:82px}.model-choices{grid-template-columns:1fr}.energy-model{grid-template-columns:1fr}.energy-model>strong{transform:rotate(90deg)}.stage-nav{min-height:68px}.btn-white-accent,.btn-ghost{min-width:112px;padding:0 12px}.finale-main,.finale-bottom{grid-template-columns:1fr}.finale-main,.finale-bottom{gap:8px}.finale-takeaway{min-height:36px}.number-line{height:135px;padding-inline:9%}}
@media(prefers-reduced-motion:reduce){.lesson-root *,.lesson-root *::before,.lesson-root *::after{scroll-behavior:auto!important;animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important}.state-note,.formula-card,.result-chip,.rule-line,.wrong-formula,.finale-answer,.finale-takeaway,.finale-bridge{opacity:1!important;transform:none!important}}
.caption-slot{flex:none;min-height:38px;padding:6px 10px;border-radius:11px;display:flex;align-items:center;visibility:hidden;color:#fff;background:rgba(23,59,82,.94);font-size:10px;line-height:1.22}.caption-slot.is-visible{visibility:visible}.feedback.feedback-slot{height:76px;min-height:76px;overflow:hidden;visibility:hidden;opacity:0;animation:none}.feedback.feedback-slot.open{visibility:visible;opacity:1}.feedback-bit{width:48px;height:58px;display:block}.feedback-bit .g1-char,.feedback-bit>svg{width:100%;height:100%}.feedback-proof{display:block;margin-top:4px;padding-top:4px;border-top:1px solid rgba(34,122,83,.2);color:${T.success};font:900 12px/1.2 'JetBrains Mono',monospace}.feedback-proof small{display:block;font-size:8px;letter-spacing:.1em}.lesson-root{height:100dvh!important;min-height:0!important;overflow:hidden!important}.stage-content{display:flex;flex-direction:column;gap:4px;overflow:hidden!important}.stage-content>.stack{flex:1;min-height:0}.btn-white-accent:disabled{cursor:not-allowed;opacity:.46}
@media(max-width:639.98px){.stage-header{padding-top:7px!important;padding-bottom:4px!important}.lesson-root-preview .stage-header{padding-top:48px!important}.progress-track{height:4px!important;margin-bottom:5px!important}.stage-content{padding-top:3px!important;padding-bottom:3px!important}.stage-nav{min-height:52px!important}.stack{gap:4px!important}.heading{min-height:40px!important}.heading h1{font-size:17px!important}.heading .g1-char{width:38px!important;height:48px!important}.question,.model-card,.visual-card,.hook-model,.whole-card,.rule-card,.beat-list{padding:5px!important;border-radius:11px!important}.options{gap:3px!important}.option{min-height:44px!important;padding:4px!important;border-radius:9px!important;font-size:9px!important}.feedback.feedback-slot{height:54px;min-height:54px!important;padding:4px 6px!important;grid-template-columns:32px 1fr!important;gap:4px!important}.feedback-bit{width:31px;height:39px}.feedback p{font-size:9px!important;line-height:1.16!important}.caption-slot{min-height:28px;padding:3px 7px;font-size:8px}.beat-list{gap:3px!important}.beat{min-height:29px!important;padding:3px!important;font-size:8px!important}.btn-white-accent,.btn-ghost{min-height:44px!important;min-width:104px!important;padding:0 8px!important;font-size:11px!important}.finale-main,.finale-bottom{grid-template-columns:1fr 1fr!important;gap:4px!important}}
.final-reflection{padding:6px 8px;border-radius:12px;display:grid;gap:5px;background:rgba(255,255,255,.9)}.final-reflection>strong{font:750 12px/1.2 'Source Serif 4',Georgia,serif}.final-reflection>div{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px}.final-reflection button{min-height:44px;padding:4px;border:0;border-radius:9px;display:grid;grid-template-columns:20px 1fr;align-items:center;gap:3px;color:${T.navy};background:${T.cyanSoft};cursor:pointer;text-align:left;font-size:8px;font-weight:850}.final-reflection button>span{width:19px;height:19px;border-radius:6px;display:grid;place-items:center;color:#fff;background:${T.cyan}}.final-reflection button.is-selected{color:#fff;background:${T.cyan}}.final-reflection button:disabled{cursor:default}.g4-title-claim:disabled{cursor:not-allowed;opacity:.46}
@media(max-width:639.98px){.stage-header{padding-top:11px!important}.lesson-root-preview .stage-header{padding-top:52px!important}}
@media(max-width:639.98px){.stage-content>.stack,.visual-card,.question,.input-row,.input-check-row{width:100%;min-width:0;max-width:100%}.input-row{grid-template-columns:minmax(0,1fr) auto}.input-row input{width:100%;min-width:0;max-width:100%}.input-check-row .btn-white-accent{min-width:104px;max-width:100%}.unit-rail{width:100%;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr) auto minmax(0,1fr) auto minmax(0,1fr) auto minmax(0,1fr);justify-content:stretch;gap:2px}.unit-node{width:auto;min-width:0;min-height:44px;padding:2px}.unit-node b{font-size:13px}.unit-node span{font-size:7px}}
`;
