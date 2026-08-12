import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// 4-SINF · 14-DARS · Harakatga doir masalalar

const T = {
  bg: '#F5F5F0', ink: '#12212C', ink2: '#50616D', ink3: '#87949D', paper: '#FFFFFF',
  accent: '#FF5B35', accentSoft: '#FFF0EA', cyan: '#168FA3', cyanSoft: '#E5F5F6',
  navy: '#173B52', lime: '#95C93D', success: '#227A53', successSoft: '#E7F3EC',
  warn: '#A96F13', warnSoft: '#FFF5D9', shadowBase: '58, 53, 48',
};

const TOTAL_SCREENS = 15;
const BASE_FRAME_COUNTS = [3, 4, 4, 4, 3, 4, 4, 4, 2, 2, 2, 2, 2, 3, 5];
const SCREEN_FLOW = [0, 1, 8, 3, 9, 2, 10, 5, 11, 6, 12, 7, 13, 4, 14];
const FRAME_COUNTS = SCREEN_FLOW.map((sourceIndex) => BASE_FRAME_COUNTS[sourceIndex]);
const SUPPORTED_LANGS = ['uz', 'ru', 'en'];
const normalizeLang = (value) => SUPPORTED_LANGS.includes(value) ? value : 'uz';
const SPEECH_LOCALES = { uz: 'uz-UZ', ru: 'ru-RU', en: 'en-GB' };
const LESSON_META = {
  lessonId: 'num-4-14-v1',
  slug: 'dars14-harakat-masalalari',
  lessonTitle: { uz: "14-dars. Harakatga doir masalalar", ru: 'Урок 14. Задачи на движение', en: 'Lesson 14. Problems about motion' },
  skillTags: ['distance', 'speed', 'time', 'uniform_motion', 'units', 'word_problems'],
};

const SCREEN_META = [
  { id: 's0', type: 'hook', goal: 'Predict speed from a journey situation', template: 'DiagnosticChoice', mechanic: 'diagnostic-choice', active: true, scored: false, scope: 'hook', misconceptions: ['multiply distance and time'], resetOnReturn: true },
  { id: 's1', type: 'model', goal: 'Observe equal distance per hour', template: 'TrackReveal', mechanic: 'model-reveal', active: true, scored: false, scope: 'concept', misconceptions: [] },
  { id: 's2', type: 'guided-practice', goal: 'Match situations to distance speed and time', template: 'PairClassification', mechanic: 'matching-retry', active: true, scored: true, scope: 'module-mikro', misconceptions: ['confuse quantity units'] },
  { id: 's3', type: 'discovery', goal: 'Discover distance as speed multiplied by time', template: 'TrackReveal', mechanic: 'model-reveal', active: true, scored: false, scope: 'concept', misconceptions: [] },
  { id: 's4', type: 'guided-practice', goal: 'Calculate distance with units', template: 'NumericRetry', mechanic: 'numeric-retry', active: true, scored: true, scope: 'module-mikro', misconceptions: ['use only one hour'] },
  { id: 's5', type: 'rule', goal: 'State the speed relationship after model discovery', template: 'RuleReveal', mechanic: 'model-reveal', active: true, scored: false, scope: 'concept', misconceptions: [] },
  { id: 's6', type: 'guided-practice', goal: 'Select the operation for speed', template: 'ChoiceRetry', mechanic: 'choice-retry', active: true, scored: true, scope: 'module-mikro', misconceptions: ['multiply instead of divide'] },
  { id: 's7', type: 'model', goal: 'Discover time as distance divided by speed', template: 'TrackReveal', mechanic: 'model-reveal', active: true, scored: false, scope: 'concept', misconceptions: [] },
  { id: 's8', type: 'strategy', goal: 'Choose a formula and compute time', template: 'NumericRetry', mechanic: 'numeric-retry', active: true, scored: true, scope: 'module-mikro', misconceptions: ['choose a formula by numbers only'] },
  { id: 's9', type: 'consolidation', goal: 'Connect all three motion relationships', template: 'SynthesisReveal', mechanic: 'model-reveal', active: true, scored: false, scope: 'transfer', misconceptions: [] },
  { id: 's10', type: 'error-analysis', goal: 'Analyse and repair a units error', template: 'ErrorRepair', mechanic: 'choice-retry', active: true, scored: true, scope: 'module-mikro', misconceptions: ['write distance as speed'] },
  { id: 's11', type: 'guided-example', goal: 'Apply the strategy to a complete worked problem', template: 'WorkedReveal', mechanic: 'model-reveal', active: true, scored: false, scope: 'transfer', misconceptions: [] },
  { id: 's12', type: 'life-case', goal: 'Solve a real multi-part journey', template: 'LifeChoice', mechanic: 'choice-retry', active: true, scored: true, scope: 'final', misconceptions: ['ignore total time'] },
  { id: 's13', type: 'comparison', goal: 'Compare quantity meanings and units', template: 'ComparisonReveal', mechanic: 'model-reveal', active: true, scored: false, scope: 'transfer', misconceptions: [] },
  { id: 's14', type: 'summary', goal: 'Reflect on motion strategy and bridge onward', template: 'ReflectionChoice', mechanic: 'reflection-choice', active: true, scored: false, scope: 'reflection', misconceptions: [] },
];

const CONTENT = {
  s0: {
    eyebrow: { uz: "Yo'l sirlari", ru: 'Секрет пути', en: 'The secret of the journey' },
    title: { uz: "180 kilometrli yo'l", ru: 'Путь длиной 180 километров', en: 'A journey of 180 kilometres' },
    question: { uz: "Tezlik qaysi?", ru: 'Какова скорость?', en: 'What is the speed?' },
    options: [
      { uz: "60 km/soat", ru: '60 км/ч', en: '60 km/h' },
      { uz: "177 km/soat", ru: '177 км/ч', en: '177 km/h' },
      { uz: "540 km/soat", ru: '540 км/ч', en: '540 km/h' },
    ],
    feedback: { uz: "Taxmin saqlandi. Endi uch kattalikni o'rganamiz.", ru: 'Предположение сохранено. Теперь разберём три величины.', en: 'Your estimate has been saved. Now we will explore three quantities.' },
    feedbackAudio: { uz: "Taxmin saqlandi. Endi uch kattalikni o'rganamiz.", ru: 'Предположение сохранено. Теперь разберём три величины.', en: 'Your estimate has been saved. Now we will explore three quantities.' },
    audio: {
      uz: ["Bit uch soatda bir yuz sakson kilometr yuradigan transport uchun tezlikni topmoqchi.", "Har bir soatda teng masofa bosib o'tiladi.", "Hozircha taxminingizni tanlang."],
      ru: ['Бит хочет найти скорость транспорта, проходящего сто восемьдесят километров за три часа.', 'За каждый час проходит одинаковое расстояние.', 'Пока выбери свой вариант.'],
      en: ['Bit wants to find the speed of a vehicle that travels one hundred and eighty kilometres in three hours.', 'It covers the same distance in each hour.', 'For now, choose your estimate.'],
    },
  },
  s1: {
    eyebrow: { uz: "Uch kattalik", ru: 'Три величины', en: 'Three quantities' },
    title: { uz: "Masofa, vaqt va tezlik", ru: 'Расстояние, время и скорость', en: 'Distance, time and speed' },
    audio: {
      uz: ["Qirq sakkiz kilometr bosib o'tilgan masofadir.", "To'rt soat harakat vaqtidir.", "Masofani to'rtta teng vaqt bo'lagiga ajratsak, har bir soatga o'n ikki kilometr to'g'ri keladi.", "Soatiga o'n ikki kilometr harakat tezligidir."],
      ru: ['Сорок восемь километров это пройденное расстояние.', 'Четыре часа это время движения.', 'Если разделить путь на четыре равных часа, на каждый час приходится двенадцать километров.', 'Двенадцать километров в час это скорость движения.'],
      en: ['Forty-eight kilometres is the distance travelled.', 'Four hours is the travel time.', 'If we divide the distance into four equal one-hour parts, each hour accounts for twelve kilometres.', 'Twelve kilometres per hour is the speed of travel.'],
    },
  },
  s2: {
    eyebrow: { uz: "Tezlik", ru: 'Скорость', en: 'Speed' },
    title: { uz: "Bir soatdagi masofani topamiz", ru: 'Находим путь за один час', en: 'Find the distance travelled in one hour' },
    audio: {
      uz: ["Masofa va vaqt ma'lum, tezlik noma'lum.", "Har bir soatdagi masofani topish uchun umumiy masofani vaqtga bo'lamiz.", "Qirq sakkizni to'rtga bo'lsak, o'n ikki chiqadi.", "Tezlikni topish uchun masofani vaqtga bo'lamiz."],
      ru: ['Расстояние и время известны, скорость неизвестна.', 'Чтобы найти путь за один час, общее расстояние делим на время.', 'Сорок восемь разделить на четыре равно двенадцати.', 'Чтобы найти скорость, расстояние делим на время.'],
      en: ['The distance and time are known, but the speed is unknown.', 'To find the distance travelled in each hour, we divide the total distance by the time.', 'Forty-eight divided by four is twelve.', 'To find speed, we divide distance by time.'],
    },
  },
  s3: {
    eyebrow: { uz: "Masofa", ru: 'Расстояние', en: 'Distance' },
    title: { uz: "Teng bo'laklarni yig'amiz", ru: 'Собираем равные участки', en: 'Combine equal sections' },
    audio: {
      uz: ["Piyoda har bir soatda to'rt kilometr yuradi.", "Ikki soatda masofa sakkiz kilometr bo'ladi.", "Uch soatda uchta to'rt kilometrlik bo'lak yig'iladi.", "Masofani topish uchun tezlikni vaqtga ko'paytiramiz."],
      ru: ['Пешеход проходит по четыре километра каждый час.', 'За два часа расстояние становится равным восьми километрам.', 'За три часа складываются три участка по четыре километра.', 'Чтобы найти расстояние, скорость умножаем на время.'],
      en: ['The walker travels four kilometres every hour.', 'In two hours, the distance is eight kilometres.', 'In three hours, there are three sections of four kilometres.', 'To find distance, we multiply speed by time.'],
    },
  },
  s4: {
    eyebrow: { uz: "O'lchov birliklari", ru: 'Единицы измерения', en: 'Units of measure' },
    title: { uz: "Birliklar nimani aytadi?", ru: 'О чём говорят единицы?', en: 'What do the units tell us?' },
    audio: {
      uz: ["Masofa uzunlik birligida o'lchanadi.", "Vaqt soat yoki minut bilan o'lchanadi.", "Tezlik bir vaqt birligida bosib o'tilgan masofani ko'rsatadi."],
      ru: ['Расстояние измеряют единицами длины.', 'Время измеряют часами или минутами.', 'Скорость показывает расстояние, пройденное за единицу времени.'],
      en: ['Distance is measured in units of length.', 'Time is measured in hours or minutes.', 'Speed shows the distance travelled in one unit of time.'],
    },
  },
  s5: {
    eyebrow: { uz: "Vaqt", ru: 'Время', en: 'Time' },
    title: { uz: "Yo'lga nechta soat kerak?", ru: 'Сколько часов нужно на путь?', en: 'How many hours does the journey take?' },
    audio: {
      uz: ["Masofa va tezlik ma'lum, vaqt noma'lum.", "Bir soatda qirq besh kilometr bosib o'tiladi.", "Yana bir soatda jami masofa to'qson kilometr bo'ladi.", "Vaqtni topish uchun masofani tezlikka bo'lamiz."],
      ru: ['Расстояние и скорость известны, время неизвестно.', 'За один час проходит сорок пять километров.', 'Ещё за один час общий путь становится равным девяноста километрам.', 'Чтобы найти время, расстояние делим на скорость.'],
      en: ['The distance and speed are known, but the time is unknown.', 'Forty-five kilometres are travelled in one hour.', 'After one more hour, the total distance is ninety kilometres.', 'To find time, we divide distance by speed.'],
    },
  },
  s6: {
    eyebrow: { uz: "Bog'lanishlar", ru: 'Связи', en: 'Connections' },
    title: { uz: "Uchta kattalik, uchta qoida", ru: 'Три величины, три правила', en: 'Three quantities, three rules' },
    audio: {
      uz: ["Tezlik noma'lum bo'lsa, masofani vaqtga bo'lamiz.", "Masofa noma'lum bo'lsa, tezlikni vaqtga ko'paytiramiz.", "Vaqt noma'lum bo'lsa, masofani tezlikka bo'lamiz.", "Avval noma'lum kattalikni aniqlaymiz, keyin mos amalni tanlaymiz."],
      ru: ['Если неизвестна скорость, расстояние делим на время.', 'Если неизвестно расстояние, скорость умножаем на время.', 'Если неизвестно время, расстояние делим на скорость.', 'Сначала определяем неизвестную величину, затем выбираем действие.'],
      en: ['If speed is unknown, we divide distance by time.', 'If distance is unknown, we multiply speed by time.', 'If time is unknown, we divide distance by speed.', 'First identify the unknown quantity, then choose the matching operation.'],
    },
  },
  s7: {
    eyebrow: { uz: "Masalani o'qish", ru: 'Чтение задачи', en: 'Reading the problem' },
    title: { uz: "Ma'lumlar → amal → natija", ru: 'Данные → действие → результат', en: 'Known values → operation → result' },
    audio: {
      uz: ["Masalada ikki yuz qirq kilometr masofa va soatiga oltmish kilometr tezlik berilgan.", "Noma'lum kattalik vaqt ekanini belgilaymiz.", "Vaqtni topish uchun ikki yuz qirqni oltmishga bo'lamiz.", "Natija to'rt soat. Javobni vaqt birligi bilan yozamiz."],
      ru: ['В задаче даны расстояние двести сорок километров и скорость шестьдесят километров в час.', 'Отмечаем, что неизвестная величина в этой задаче это время.', 'Чтобы найти время, двести сорок делим на шестьдесят.', 'Получается четыре часа. Записываем ответ с единицей времени.'],
      en: ['The problem gives a distance of two hundred and forty kilometres and a speed of sixty kilometres per hour.', 'We identify time as the unknown quantity.', 'To find the time, we divide two hundred and forty by sixty.', 'The result is four hours. We write the answer with a unit of time.'],
    },
  },
  s8: {
    eyebrow: { uz: "Moslashtirish", ru: 'Соответствие' , en: "Matching"},
    title: { uz: "Noma'lum kattalikni toping", ru: 'Найди неизвестную величину', en: 'Find the unknown quantity' },
    question: { uz: "Har bir vaziyatda qaysi kattalik noma'lum?", ru: 'Какая величина неизвестна в каждой ситуации?', en: 'Which quantity is unknown in each situation?' },
    situations: [
      { uz: "48 km va 4 soat → ?", ru: '48 км и 4 часа → ?', en: '48 km and 4 hours → ?' },
      { uz: "15 km/soat va 3 soat → ?", ru: '15 км/ч и 3 часа → ?', en: '15 km/h and 3 hours → ?' },
      { uz: "180 km va 60 km/soat → ?", ru: '180 км и 60 км/ч → ?', en: '180 km and 60 km/h → ?' },
    ],
    labels: [{ uz: "tezlik", ru: 'скорость', en: 'speed' }, { uz: "masofa", ru: 'расстояние', en: 'distance' }, { uz: "vaqt", ru: 'время', en: 'time' }],
    feedbackAudio: {
      wrong: [
        { uz: "Kilometr va soat berilgan. Ularning nisbatidan tezlik topiladi.", ru: 'Даны километры и часы. Их отношение даёт скорость.', en: 'Distance in kilometres and time in hours are given. Their quotient gives the speed.' },
        { uz: "Tezlik va vaqt berilgan. Ularning ko'paytmasidan masofa topiladi.", ru: 'Даны скорость и время. Их произведение даёт расстояние.', en: 'Speed and time are given. Their product gives the distance.' },
        { uz: "Masofa va tezlik berilgan. Ularning nisbatidan vaqt topiladi.", ru: 'Даны расстояние и скорость. Их отношение даёт время.', en: 'Distance and speed are given. Their quotient gives the time.' },
      ],
      partial: { uz: "Bu juftlik to'g'ri. Qolgan vaziyatni ham tekshiring.", ru: 'Эта пара верна. Проверь следующую ситуацию.', en: 'This pair is correct. Check the next situation as well.' },
      correct: { uz: "To'g'ri. Birliklar tezlik, masofa va vaqtni ajratishga yordam berdi.", ru: 'Верно. Единицы помогли различить скорость, расстояние и время.', en: 'Correct. The units helped distinguish speed, distance and time.' },
    },
    audio: {
      uz: ["Birinchi vaziyatda qirq sakkiz kilometr va to'rt soat berilgan, demak tezlik noma'lum.", "Ikkinchi vaziyatda soatiga o'n besh kilometr tezlik va uch soat berilgan, demak masofa noma'lum.", "Uchinchi vaziyatda bir yuz sakson kilometr va soatiga oltmish kilometr tezlik berilgan, demak vaqt noma'lum.", "Har bir vaziyatni tegishli kattalik bilan moslashtiring."],
      ru: ['В первой ситуации даны сорок восемь километров и четыре часа, значит неизвестна скорость.', 'Во второй ситуации даны скорость пятнадцать километров в час и три часа, значит неизвестно расстояние.', 'В третьей ситуации даны сто восемьдесят километров и скорость шестьдесят километров в час, значит неизвестно время.', 'Соедини каждую ситуацию с подходящей величиной.'],
      en: ['In the first situation, forty-eight kilometres and four hours are given, so speed is unknown.', 'In the second situation, a speed of fifteen kilometres per hour and three hours are given, so distance is unknown.', 'In the third situation, one hundred and eighty kilometres and a speed of sixty kilometres per hour are given, so time is unknown.', 'Match each situation to the appropriate quantity.'],
    },
  },
  s9: {
    eyebrow: { uz: "Masofani hisoblash", ru: 'Вычисление расстояния', en: 'Calculating distance' },
    title: { uz: "Ikki soatlik yo'l", ru: 'Путь за два часа', en: 'Distance travelled in two hours' },
    question: { uz: "Masofani toping.", ru: 'Найди расстояние.', en: 'Find the distance.' },
    feedbackAudio: {
      correct: { uz: "To'g'ri. Masofa sakson kilometr.", ru: 'Верно. Расстояние равно восьмидесяти километрам.', en: 'Correct. The distance is eighty kilometres.' },
      wrong: { uz: "Masofani topish uchun tezlikni vaqtga ko'paytiring.", ru: 'Чтобы найти расстояние, умножь скорость на время.', en: 'To find the distance, multiply the speed by the time.' },
    },
    audio: {
      uz: ["Transport ikki soat davomida soatiga qirq kilometr tezlikda yurdi.", "Masofani toping."],
      ru: ['Транспорт ехал два часа со скоростью сорок километров в час.', 'Найди расстояние.'],
      en: ['A vehicle travelled for two hours at forty kilometres per hour.', 'Find the distance.'],
    },
  },
  s10: {
    eyebrow: { uz: "Amalni tanlash", ru: 'Выбор действия', en: 'Choosing an operation' },
    title: { uz: "Tezlik uchun qaysi amal?", ru: 'Какое действие найдёт скорость?', en: 'Which operation finds the speed?' },
    question: { uz: "Tezlikni topadigan yozuvni tanlang.", ru: 'Выбери запись для нахождения скорости.', en: 'Choose the expression that finds the speed.' },
    options: [{ uz: "230 : 2", ru: '230 : 2' , en: "230 : 2"}, { uz: "230 × 2", ru: '230 × 2' , en: "230 × 2"}, { uz: "230 − 2", ru: '230 − 2' , en: "230 − 2"}],
    feedback: [
      { uz: "To'g'ri. Bir soatdagi masofani topish uchun 230 ni 2 ga bo'lamiz.", ru: 'Верно. Чтобы найти путь за один час, делим 230 на 2.', en: 'Correct. To find the distance travelled in one hour, divide 230 by 2.' },
      { uz: "Ko'paytirish ma'lum tezlikdan masofani topadi. Bu masalada tezlik noma'lum.", ru: 'Умножение находит расстояние по известной скорости. В этой задаче скорость неизвестна.', en: 'Multiplication finds distance from a known speed. In this problem, the speed is unknown.' },
      { uz: "Vaqtni masofadan ayirish turli kattaliklarni aralashtiradi. Masofani vaqtga bo'lish kerak.", ru: 'Нельзя вычитать время из расстояния. Нужно разделить расстояние на время.', en: 'Subtracting time from distance mixes different quantities. Divide distance by time instead.' },
    ],
    feedbackAudio: [
      { uz: "To'g'ri. Ikki yuz o'ttizni ikkiga bo'lib, bir yuz o'n besh topiladi.", ru: 'Верно. Двести тридцать делим на два и получаем сто пятнадцать.', en: 'Correct. Two hundred and thirty divided by two is one hundred and fifteen.' },
      { uz: "Bu masalada tezlik noma'lum. Masofani vaqtga bo'ling.", ru: 'В этой задаче скорость неизвестна. Раздели расстояние на время.', en: 'The speed is unknown in this problem. Divide the distance by the time.' },
      { uz: "Masofadan vaqtni ayirib bo'lmaydi. Masofani vaqtga bo'ling.", ru: 'Время нельзя вычитать из расстояния. Раздели расстояние на время.', en: 'You cannot subtract time from distance. Divide the distance by the time.' },
    ],
    audio: {
      uz: ["Vertolyot ikki soatda ikki yuz o'ttiz kilometr uchdi.", "Tezlikni topadigan yozuvni tanlang."],
      ru: ['Вертолёт пролетел двести тридцать километров за два часа.', 'Выбери запись для нахождения скорости.'],
      en: ['A helicopter flew two hundred and thirty kilometres in two hours.', 'Choose the expression that finds the speed.'],
    },
  },
  s11: {
    eyebrow: { uz: "Vaqtni hisoblash", ru: 'Вычисление времени', en: 'Calculating time' },
    title: { uz: "300 kilometrga qancha vaqt?", ru: 'Сколько времени на 300 километров?', en: 'How long does 300 kilometres take?' },
    question: { uz: "Harakat vaqtini toping.", ru: 'Найди время движения.', en: 'Find the travel time.' },
    feedbackAudio: {
      correct: { uz: "To'g'ri. Harakat vaqti besh soat.", ru: 'Верно. Время движения равно пяти часам.', en: 'Correct. The travel time is five hours.' },
      wrong: { uz: "Vaqtni topish uchun masofani tezlikka bo'ling.", ru: 'Чтобы найти время, раздели расстояние на скорость.', en: 'To find the time, divide the distance by the speed.' },
    },
    audio: {
      uz: ["Poyezd uch yuz kilometrni soatiga oltmish kilometr tezlikda yuradi.", "Harakat vaqtini toping."],
      ru: ['Поезд проходит триста километров со скоростью шестьдесят километров в час.', 'Найди время движения.'],
      en: ['A train travels three hundred kilometres at sixty kilometres per hour.', 'Find the travel time.'],
    },
  },
  s12: {
    eyebrow: { uz: "Bit xatosi", ru: 'Ошибка Бита' , en: "Bit's error"},
    title: { uz: "Noto'g'ri amalni tuzating", ru: 'Исправь неверное действие', en: 'Correct the wrong operation' },
    question: { uz: "Bir soatga to'g'ri keladigan masofani toping.", ru: 'Найди расстояние, приходящееся на один час.', en: 'Find the distance travelled in one hour.' },
    options: [{ uz: "12 : 3 = 4", ru: '12 : 3 = 4' , en: "12 : 3 = 4"}, { uz: "12 × 3 = 36", ru: '12 × 3 = 36' , en: "12 × 3 = 36"}, { uz: "12 − 3 = 9", ru: '12 − 3 = 9' , en: "12 − 3 = 9"}],
    feedback: [
      { uz: "To'g'ri. O'n ikki kilometrni uch soatga teng ajratsak, bir soatda to'rt kilometr yuriladi.", ru: 'Верно. Если разделить двенадцать километров на три часа, за один час получится четыре километра.', en: 'Correct. If twelve kilometres are shared equally across three hours, four kilometres are travelled in one hour.' },
      { uz: "Bu Bitning xatosini takrorlaydi. Tezlik uchun masofani vaqtga ko'paytirmaymiz, bo'lamiz.", ru: 'Это повторяет ошибку Бита. Для скорости расстояние не умножаем на время, а делим.', en: "This repeats Bit's mistake. To find speed, we divide distance by time rather than multiplying." },
      { uz: "Masofadan vaqtni ayirib bo'lmaydi. Ular turli kattaliklar.", ru: 'Нельзя вычитать время из расстояния. Это разные величины.', en: 'You cannot subtract time from distance. They are different quantities.' },
    ],
    feedbackAudio: [
      { uz: "To'g'ri. O'n ikki kilometrni uch soatga bo'lsak, soatiga to'rt kilometr chiqadi.", ru: 'Верно. Двенадцать километров делим на три часа и получаем четыре километра в час.', en: 'Correct. Twelve kilometres divided by three hours gives four kilometres per hour.' },
      { uz: "Bu Bitning xatosini takrorlaydi. Tezlik uchun masofani vaqtga bo'ling.", ru: 'Это повторяет ошибку Бита. Для скорости раздели расстояние на время.', en: "This repeats Bit's mistake. To find speed, divide the distance by the time." },
      { uz: "Masofadan vaqtni ayirib bo'lmaydi. Ular turli kattaliklar.", ru: 'Время нельзя вычитать из расстояния. Это разные величины.', en: 'You cannot subtract time from distance. They are different quantities.' },
    ],
    audio: {
      uz: ["Bit tezlikni topishda masofani vaqtga ko'paytirdi.", "Bir soatga to'g'ri keladigan masofani toping."],
      ru: ['Бит умножил расстояние на время, когда искал скорость.', 'Найди расстояние, приходящееся на один час.'],
      en: ['Bit multiplied distance by time when trying to find speed.', 'Find the distance travelled in one hour.'],
    },
  },
  s13: {
    eyebrow: { uz: "Bir xil tezlik", ru: 'Одинаковая скорость', en: 'Constant speed' },
    title: { uz: "Ikki qismli yo'l", ru: 'Путь из двух частей', en: 'A journey in two parts' },
    question: { uz: "Har bir qismdagi masofani topadigan rejani tanlang.", ru: 'Выбери план вычисления расстояния на каждом участке.', en: 'Choose the plan that finds the distance of each part.' },
    options: [
      { uz: "300 : (2 + 4) = 50; 50 × 2 = 100; 50 × 4 = 200", ru: '300 : (2 + 4) = 50; 50 × 2 = 100; 50 × 4 = 200' , en: "300 : (2 + 4) = 50; 50 × 2 = 100; 50 × 4 = 200"},
      { uz: "300 : 2 = 150; 300 : 4 = 75", ru: '300 : 2 = 150; 300 : 4 = 75' , en: "300 : 2 = 150; 300 : 4 = 75"},
      { uz: "300 × (2 + 4) = 1 800", ru: '300 × (2 + 4) = 1 800' , en: "300 × (2 + 4) = 1 800"},
    ],
    feedback: [
      { uz: "To'g'ri. Jami olti soat orqali tezlik 50 km/soat, qismlar esa 100 va 200 kilometr bo'ladi.", ru: 'Верно. По общим шести часам скорость равна 50 км/ч, а участки равны 100 и 200 километрам.', en: 'Correct. Using the total time of six hours gives a speed of 50 km/h, so the two distances are 100 and 200 kilometres.' },
      { uz: "Bu reja 300 kilometrni har bir qismning alohida jami deb oladi. Aslida 300 kilometr ikkala qismning umumiy masofasi.", ru: 'Этот план считает 300 километров отдельным итогом каждого участка. На самом деле это общий путь двух участков.', en: 'This plan treats 300 kilometres as the separate total for each part. It is actually the combined distance of both parts.' },
      { uz: "300 kilometr tezlik emas, umumiy masofa. Uni vaqtga ko'paytirish kerak emas.", ru: 'Триста километров это общий путь, а не скорость. Его не нужно умножать на время.', en: 'Three hundred kilometres is the total distance, not the speed. It should not be multiplied by time.' },
    ],
    feedbackAudio: [
      { uz: "To'g'ri. Avval olti soat orqali tezlikni topamiz, so'ng ikki qism masofasini hisoblaymiz.", ru: 'Верно. Сначала по шести часам находим скорость, затем вычисляем расстояния двух участков.', en: 'Correct. First use the six hours to find the speed, then calculate the distance of each part.' },
      { uz: "Uch yuz kilometr ikkala qismning umumiy masofasi. Uni har bir qism uchun alohida olmang.", ru: 'Триста километров это общий путь двух участков. Не считай его отдельным путём каждого участка.', en: 'Three hundred kilometres is the combined distance of both parts. Do not use it as the separate distance of each part.' },
      { uz: "Uch yuz kilometr umumiy masofa, tezlik emas. Avval uni jami vaqtga bo'ling.", ru: 'Триста километров это общий путь, а не скорость. Сначала раздели его на общее время.', en: 'Three hundred kilometres is the total distance, not the speed. First divide it by the total time.' },
    ],
    audio: {
      uz: ["Avtomobil jami uch yuz kilometr yo'lning birinchi qismini ikki soat, ikkinchi qismini to'rt soat bir xil tezlikda yurdi.", "Jami vaqt ikki va to'rt soatning yig'indisi, ya'ni olti soat.", "Uch yuzni oltiga bo'lib, soatiga ellik kilometr tezlikni topamiz.", "Keyin ellikni ikki va to'rt soatga ko'paytiradigan rejani tanlang."],
      ru: ['Автомобиль проехал общий путь триста километров: первый участок за два часа, второй за четыре часа с той же скоростью.', 'Общее время равно сумме двух и четырёх часов, то есть шести часам.', 'Триста делим на шесть и получаем скорость пятьдесят километров в час.', 'Затем выбери план, где пятьдесят умножают на два и на четыре часа.'],
      en: ['A car travelled a total of three hundred kilometres at the same speed, taking two hours for the first part and four hours for the second.', 'The total time is the sum of two hours and four hours, which is six hours.', 'Three hundred divided by six gives a speed of fifty kilometres per hour.', 'Then choose the plan that multiplies fifty by two hours and by four hours.'],
    },
  },
  s14: {
    eyebrow: { uz: "Yakun", ru: 'Итог' , en: "Summary"},
    title: { uz: "Masofa, tezlik va vaqt", ru: 'Расстояние, скорость и время', en: 'Distance, speed and time' },
    audio: {
      uz: ["Masofa yo'l uzunligini, vaqt harakat davomiyligini, tezlik esa bir vaqt birligidagi masofani bildiradi.", "Tezlikni topish uchun masofani vaqtga bo'lamiz.", "Masofani topish uchun tezlikni vaqtga ko'paytiramiz.", "Vaqtni topish uchun masofani tezlikka bo'lamiz.", "Keyingi darsda teng sharoitda olingan bir nechta natijani bitta o'rtacha qiymat bilan ifodalashni o'rganamiz."],
      ru: ['Расстояние показывает длину пути, время показывает длительность движения, а скорость показывает путь за единицу времени.', 'Чтобы найти скорость, расстояние делим на время.', 'Чтобы найти расстояние, скорость умножаем на время.', 'Чтобы найти время, расстояние делим на скорость.', 'На следующем уроке научимся выражать несколько результатов одним средним значением.'],
      en: ['Distance describes the length of a journey, time describes its duration, and speed describes the distance travelled in one unit of time.', 'To find speed, we divide distance by time.', 'To find distance, we multiply speed by time.', 'To find time, we divide distance by speed.', 'In the next lesson, we will learn to represent several results obtained under the same conditions with one mean value.'],
    },
  },
};
const ORDERED_CONTENT = SCREEN_FLOW.map((sourceIndex) => CONTENT[`s${sourceIndex}`]);

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

function useReducedMotion() {
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
    if (this.timer) window.clearTimeout(this.timer);
    this.timer = null;
    if (this.audio) { this.audio.pause(); this.audio.onended = null; this.audio.onerror = null; }
    if (this.previewUtterance) {
      this.previewUtterance.onstart = null;
      this.previewUtterance.onend = null;
      this.previewUtterance.onerror = null;
      this.previewUtterance = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try { window.speechSynthesis.cancel(); } catch { /* preview speech is optional */ }
    }
  }
  load(queue) { this.stop(); this.queue = queue || []; this.index = 0; this.emit({ completed: false, currentSegment: null }); }
  start() { this.play(); }
  timed(item, duration = 900) {
    if (this.timer) window.clearTimeout(this.timer);
    this.timer = null;
    if (this.audio) { this.audio.onended = null; this.audio.onerror = null; }
    if (this.previewUtterance) {
      this.previewUtterance.onstart = null;
      this.previewUtterance.onend = null;
      this.previewUtterance.onerror = null;
      this.previewUtterance = null;
    }
    this.emit({ isPlaying: false, completed: false, currentSegment: item.id, visualOnly: true });
    this.timer = window.setTimeout(() => { this.index += 1; this.play(); }, duration);
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
          this.timer = window.setTimeout(() => {
            this.timer = null;
            try { window.speechSynthesis.speak(utterance); } catch { this.timed(item); }
          }, 50);
          return;
        } catch { /* use the deterministic visual timer */ }
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
  /* eslint-disable react-hooks/refs -- audio queue stabilizer */
  const segmentsRef = useRef(segments);
  const segmentsKey = segments ? JSON.stringify(segments) : '';
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
  const reducedMotion = useReducedMotion();
  const segments = useMemo(() => {
    const texts = value?.[lang] ?? [];
    const expected = FRAME_COUNTS[screen];
    return (Array.isArray(texts) ? texts : [texts]).filter(Boolean).slice(0, expected).map((text, index) => ({ id: `s${screen}-beat-${index}`, text }));
  }, [lang, screen, value]);
  const audio = useAudio(segments);
  const active = segments.findIndex((segment) => segment.id === audio.currentSegment);
  const feedbackPlaying = String(audio.currentSegment || '').startsWith('feedback-');
  const naturalBeat = active >= 0 ? active : ((audio.completed || feedbackPlaying) ? Math.max(0, segments.length - 1) : 0);
  return { ...audio, beat: reducedMotion ? Math.max(0, segments.length - 1) : naturalBeat, caption: active >= 0 ? segments[active].text : '' };
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
    exploration: { uz: "Kashfiyot", ru: 'Исследование', en: 'Explore' },
    rule: { uz: "Qoida", ru: 'Правило', en: 'Rule' },
    practice: { uz: "Mashq", ru: 'Практика', en: 'Practice' },
    test: { uz: "Tekshiruv", ru: 'Проверка', en: 'Check' },
    case: { uz: "Vazifa", ru: 'Задача', en: 'Problem' },
    summary: { uz: "Yakun", ru: 'Итог', en: 'Summary' },
    comparison: { uz: "Kashfiyot", ru: 'Исследование', en: 'Explore' },
    synthesis: { uz: "Kashfiyot", ru: 'Исследование', en: 'Explore' },
    'guided-example': { uz: "Kashfiyot", ru: 'Исследование', en: 'Explore' },
  };
  return <span className="screen-type">{labels[type] ? t(labels[type]) : type}</span>;
};

const Feedback = ({ show, correct, children }) => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!show) { const frame = requestAnimationFrame(() => setOpen(false)); return () => cancelAnimationFrame(frame); }
    let second = 0;
    const first = requestAnimationFrame(() => { second = requestAnimationFrame(() => setOpen(true)); });
    return () => { cancelAnimationFrame(first); cancelAnimationFrame(second); };
  }, [show]);
  return <div role="status" aria-hidden={!show} data-g4-feedback={correct ? 'correct' : 'wrong'} className={`feedback ${correct ? 'correct' : 'wrong'} ${open ? 'open' : ''}`}><span className="feedback-bit"><BitSVG state={correct ? 'nod' : 'awkward'}/></span><p>{show ? children : ''}</p></div>;
};

const ContractActivity = ({ screen, value, onComplete }) => {
  const t = useT(); const meta = SCREEN_META[screen];
  if (meta.template === 'ReflectionChoice') return null;
  if (!meta.template.includes('Reveal')) return null;
  return <div className="activity-slot"><button type="button" className={value !== undefined ? 'selected' : ''} onClick={() => onComplete(screen, true)}>{value !== undefined ? t({ uz: "Model tekshirildi", ru: 'Модель проверена', en: 'Model checked' }) : t({ uz: "Modelni tekshirish", ru: 'Проверить модель', en: 'Check the model' })}</button></div>;
};

const Stage = ({ screen, audio, onPrev, onNext, finish = false, activityDone, children }) => {
  const t = useT(); const mobile = useIsMobile(); const pad = mobile ? 14 : 48; const c = ORDERED_CONTENT[screen]; const meta = SCREEN_META[screen]; const { activityState, markActivity } = useContext(ActivityContext);
  const storedActivity = Object.prototype.hasOwnProperty.call(activityState, screen); const activityReady = !meta.active || activityDone === true || storedActivity; const audioReady = !audio || audio.muted || audio.visualOnly || audio.completed; const canAdvance = activityReady && audioReady;
  useEffect(() => { if (activityDone === true && !storedActivity) markActivity(screen, true); }, [activityDone, markActivity, screen, storedActivity]);
  const showCaption = Boolean(audio?.caption && (audio.muted || audio.visualOnly));
  return <main className={`stage stage-${meta.type}`}><header className="stage-header" style={{ paddingLeft: pad, paddingRight: pad }}><div className="progress-track" aria-label={`${screen + 1} / ${TOTAL_SCREENS}`}><div className="progress-fill progress-bar" style={{ width: `${(screen + 1) / TOTAL_SCREENS * 100}%` }}/></div><div className="stage-chrome"><div className="chrome-title"><span className="status-dot"/><span>{t(c.eyebrow)}</span></div><div className="chrome-actions"><ScreenTypeLabel type={meta.type}/>{audio && <AudioIndicator audio={audio}/>}<span className="screen-count">{String(screen + 1).padStart(2, '0')} / {TOTAL_SCREENS}</span></div></div></header><section className="stage-content" style={{ paddingLeft: pad, paddingRight: pad }}>{meta.type === 'summary' && <div className="summary-happy-bit"><BitSVG state="happy" /></div>}<div className="stage-body">{children}<ContractActivity screen={screen} value={activityState[screen]} onComplete={markActivity}/></div><div className={`caption caption-slot ${showCaption ? 'visible' : ''}`} aria-hidden={!showCaption}>{showCaption ? audio.caption : ''}</div></section><footer className="stage-nav" style={{ paddingLeft: pad, paddingRight: pad }}>{screen === 0 ? <span /> : <button type="button" className="btn ghost" onClick={onPrev}>← {t({ uz: "Orqaga", ru: 'Назад' , en: "Back"})}</button>}<button type="button" className="btn next" onClick={onNext} disabled={!canAdvance}>{finish ? t({ uz: "Darsni yakunlash", ru: 'Завершить урок' , en: "Finish lesson"}) : t({ uz: "Davom etish", ru: 'Продолжить' , en: "Continue"})} →</button></footer></main>;
};

const Heading = ({ c }) => {
  const t = useT(); const hook = c === CONTENT.s0;
  return <div className="heading" data-g4-screen={hook ? 'hook' : undefined} data-g4-role={hook ? 'hook-scene' : undefined}><div><span>{t(c.eyebrow)}</span><h1>{t(c.title)}</h1></div><BitSVG state="happy" className="primary-happy-bit" />{hook && <span className="sr-only" data-g4-role="answer-card">{t(c.question)}</span>}</div>;
};

const Options = ({ values, picked, onPick, correctIndex = null, solved = false, wrong = false, disabled = false }) => {
  const t = useT();
  return <div className="options">{values.map((value, index) => <button type="button" key={`${index}-${t(value)}`} className={`option ${picked === index ? 'picked' : ''} ${solved && index === correctIndex ? 'right' : ''} ${wrong && picked === index ? 'bad' : ''}`} onClick={() => onPick(index)} disabled={disabled}><b>{String.fromCharCode(65 + index)}</b>{t(value)}</button>)}</div>;
};

const Reveal = ({ show, children, className = '' }) => <div className={`reveal-item ${show ? 'show' : ''} ${className}`}>{children}</div>;

const FixedTrack = ({ distance, chunks = 3, progress = 1, labels = [] }) => {
  const safeProgress = Math.max(0, Math.min(1, progress));
  const start = 54; const end = 666; const width = end - start;
  const ticks = Array.from({ length: chunks + 1 }, (_, index) => start + width * index / chunks);
  return (
    <svg className="route-svg" viewBox="0 0 720 168" aria-hidden="true" focusable="false">
      <rect className="route-panel" x="2" y="2" width="716" height="164" rx="24" />
      <path className="route-road" d={`M${start} 104H${end}`} />
      <path className="route-trail" d={`M${start} 104H${start + width * safeProgress}`} />
      {ticks.map((x, index) => <g className="route-tick" key={x}><path d={`M${x} 89V119`} /><circle cx={x} cy="104" r="6" /><text x={x} y="139" textAnchor="middle">{labels[index] ?? index}</text></g>)}
      <g className="route-marker" style={{ transform: `translateX(${width * safeProgress}px)` }}><circle cx={start} cy="73" r="18" /><path d={`M${start - 8} 73h16m-5-5 5 5-5 5`} /><path d={`M${start} 91V98`} /></g>
      <text className="route-distance" x="360" y="35" textAnchor="middle">{distance}</text>
    </svg>
  );
};

const FormulaRow = ({ label, formula, active, tone = 'cyan' }) => (
  <div className={`formula-row ${tone} ${active ? 'active' : ''}`}><span>{label}</span><strong>{formula}</strong></div>
);

const cleanNumber = (value) => String(value ?? '').replace(/[^0-9]/g, '').replace(/^0+(?=\d)/, '').slice(0, 8);

function Screen0({ screen, storedAnswer, onAnswer, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s0; const audio = useNarration(c.audio, screen); const picked = storedAnswer?.studentAnswerIndex ?? null;
  const pick = (index) => {
    audio.pushOneOff(t(c.feedbackAudio));
    onAnswer({ screenIdx: screen, stage: 'hook', question: t(c.question), options: c.options.map(t), correctIndex: 0, correctAnswer: t(c.options[0]), studentAnswerIndex: index, studentAnswer: t(c.options[index]), correct: index === 0, firstTry: storedAnswer?.firstTry === false ? false : index === 0, attempts: (storedAnswer?.attempts ?? 0) + 1, solved: true });
  };
  const progress = audio.beat === 0 ? 0 : audio.beat === 1 ? 0.66 : 1;
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} bit="think" /><section className="motion-card hook-motion"><FixedTrack distance="180 km" chunks={3} progress={progress} labels={['0', '1', '2', '3']} /><div className="hook-facts"><Reveal show={audio.beat >= 0}><span>{t({ uz: "Masofa", ru: 'Расстояние', en: 'Distance' })}</span><b>180 km</b></Reveal><Reveal show={audio.beat >= 1}><span>{t({ uz: "Vaqt", ru: 'Время', en: 'Time' })}</span><b>3 {t({ uz: "soat", ru: 'часа', en: 'hours' })}</b></Reveal><Reveal show={audio.beat >= 2}><span>{t({ uz: "Tezlik", ru: 'Скорость', en: 'Speed' })}</span><b>?</b></Reveal></div></section><section className={`question frame-question ${audio.beat >= 2 ? 'ready' : ''}`}><h2>{t(c.question)}</h2><Options values={c.options} picked={picked} onPick={pick} /><Feedback show={picked !== null} correct>{t(c.feedback)}</Feedback></section></div></Stage>;
}

function Screen1({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s1; const audio = useNarration(c.audio, screen); const progress = (audio.beat + 1) / 4;
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} /><section className="motion-card"><FixedTrack distance="48 km" chunks={4} progress={progress} labels={['0', '1', '2', '3', '4']} /><div className="three-values"><Reveal show={audio.beat >= 0}><span>{t({ uz: "Masofa", ru: 'Расстояние', en: 'Distance' })}</span><b>48 km</b></Reveal><Reveal show={audio.beat >= 1}><span>{t({ uz: "Vaqt", ru: 'Время', en: 'Time' })}</span><b>4 {t({ uz: "soat", ru: 'часа', en: 'hours' })}</b></Reveal><Reveal show={audio.beat >= 3} className="speed-value"><span>{t({ uz: "Tezlik", ru: 'Скорость', en: 'Speed' })}</span><b>{t({ uz: '12 km/soat', ru: '12 км/ч', en: '12 km/h' })}</b></Reveal></div><Reveal show={audio.beat >= 2} className="equal-note">{t({ uz: '48 km : 4 = 12 km/soat', ru: '48 км : 4 = 12 км/ч', en: '48 km ÷ 4 = 12 km/h' })}</Reveal></section></div></Stage>;
}

function Screen2({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s2; const audio = useNarration(c.audio, screen);
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} bit="focus" /><section className="rule-board"><div className="known-strip"><Reveal show={audio.beat >= 0}><span>{t({ uz: "Ma'lum", ru: 'Известно', en: 'Known' })}</span><b>48 km</b></Reveal><Reveal show={audio.beat >= 0}><span>{t({ uz: "Ma'lum", ru: 'Известно', en: 'Known' })}</span><b>4 {t({ uz: "soat", ru: 'часа', en: 'hours' })}</b></Reveal><Reveal show={audio.beat >= 0}><span>{t({ uz: "Noma'lum", ru: 'Неизвестно', en: 'Unknown' })}</span><b>?</b></Reveal></div><FixedTrack distance="48 km" chunks={4} progress={audio.beat >= 2 ? 1 : 0.25} labels={['0', '1', '2', '3', '4']} /><Reveal show={audio.beat >= 1} className="operation-line">{t({ uz: '48 km : 4 soat', ru: '48 км : 4 часа', en: '48 km ÷ 4 hours' })}</Reveal><Reveal show={audio.beat >= 2} className="answer-chip">{t({ uz: '12 km/soat', ru: '12 км/ч', en: '12 km/h' })}</Reveal><FormulaRow active={audio.beat >= 3} label={t({ uz: "Tezlik", ru: 'Скорость', en: 'Speed' })} formula={t({ uz: "masofa : vaqt", ru: 'расстояние : время', en: 'distance ÷ time' })} /></section></div></Stage>;
}

function Screen3({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s3; const audio = useNarration(c.audio, screen); const progress = Math.min(1, (audio.beat + 1) / 3);
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} /><section className="rule-board"><FixedTrack distance="12 km" chunks={3} progress={progress} labels={['0', '1', '2', '3']} /><div className="segment-cards">{[1, 2, 3].map((hour, index) => <Reveal show={audio.beat >= index} key={hour}><span>{hour} {t({ uz: "soat", ru: hour === 1 ? 'час' : 'часа', en: hour === 1 ? 'hour' : 'hours' })}</span><b>{hour * 4} km</b></Reveal>)}</div><Reveal show={audio.beat >= 2} className="operation-line">{t({ uz: '4 km/soat × 3 soat = 12 km', ru: '4 км/ч × 3 часа = 12 км', en: '4 km/h × 3 hours = 12 km' })}</Reveal><FormulaRow active={audio.beat >= 3} label={t({ uz: "Masofa", ru: 'Расстояние', en: 'Distance' })} formula={t({ uz: "tezlik × vaqt", ru: 'скорость × время', en: 'speed × time' })} tone="orange" /></section></div></Stage>;
}

function Screen4({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s4; const audio = useNarration(c.audio, screen); const cards = [
    { icon: '↔', name: { uz: "Masofa", ru: 'Расстояние', en: 'Distance' }, unit: 'km' },
    { icon: '◷', name: { uz: "Vaqt", ru: 'Время', en: 'Time' }, unit: t({ uz: "soat", ru: 'час', en: 'hour' }) },
    { icon: '➜', name: { uz: "Tezlik", ru: 'Скорость', en: 'Speed' }, unit: t({ uz: 'km/soat', ru: 'км/ч', en: 'km/h' }) },
  ];
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} /><section className="unit-grid">{cards.map((card, index) => <Reveal show={audio.beat >= index} key={card.unit}><i>{card.icon}</i><span>{t(card.name)}</span><b>{card.unit}</b><small>{index === 0 ? t({ uz: "yo'l uzunligi", ru: 'длина пути', en: 'length of the journey' }) : index === 1 ? t({ uz: "harakat davomiyligi", ru: 'длительность движения', en: 'duration of travel' }) : t({ uz: "bir soatdagi masofa", ru: 'путь за один час', en: 'distance travelled in one hour' })}</small></Reveal>)}</section></div></Stage>;
}

function Screen5({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s5; const audio = useNarration(c.audio, screen); const progress = audio.beat < 2 ? 0.5 : 1;
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} /><section className="rule-board"><div className="known-strip"><Reveal show={audio.beat >= 0}><span>{t({ uz: "Masofa", ru: 'Расстояние', en: 'Distance' })}</span><b>90 km</b></Reveal><Reveal show={audio.beat >= 0}><span>{t({ uz: "Tezlik", ru: 'Скорость', en: 'Speed' })}</span><b>{t({ uz: '45 km/soat', ru: '45 км/ч', en: '45 km/h' })}</b></Reveal><Reveal show={audio.beat >= 0}><span>{t({ uz: "Vaqt", ru: 'Время', en: 'Time' })}</span><b>?</b></Reveal></div><FixedTrack distance="90 km" chunks={2} progress={progress} labels={['0', '1', '2']} /><Reveal show={audio.beat >= 1} className="chunk-note">1 {t({ uz: "soat", ru: 'час', en: 'hour' })} → 45 km</Reveal><Reveal show={audio.beat >= 2} className="answer-chip">2 {t({ uz: "soat", ru: 'часа', en: 'hours' })}</Reveal><FormulaRow active={audio.beat >= 3} label={t({ uz: "Vaqt", ru: 'Время', en: 'Time' })} formula={t({ uz: "masofa : tezlik", ru: 'расстояние : скорость', en: 'distance ÷ speed' })} /></section></div></Stage>;
}

function Screen6({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s6; const audio = useNarration(c.audio, screen); const rows = [
    { label: { uz: "Tezlik", ru: 'Скорость', en: 'Speed' }, formula: { uz: "masofa : vaqt", ru: 'расстояние : время', en: 'distance ÷ time' } },
    { label: { uz: "Masofa", ru: 'Расстояние', en: 'Distance' }, formula: { uz: "tezlik × vaqt", ru: 'скорость × время', en: 'speed × time' } },
    { label: { uz: "Vaqt", ru: 'Время', en: 'Time' }, formula: { uz: "masofa : tezlik", ru: 'расстояние : скорость', en: 'distance ÷ speed' } },
  ];
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} bit="focus" /><section className="formula-board">{rows.map((row, index) => <FormulaRow key={t(row.label)} label={t(row.label)} formula={t(row.formula)} active={audio.beat >= index} tone={index === 1 ? 'orange' : 'cyan'} />)}<Reveal show={audio.beat >= 3} className="decision-card"><b>1</b><span>{t({ uz: "Noma'lum kattalikni aniqlang", ru: 'Определи неизвестную величину', en: 'Identify the unknown quantity' })}</span><i>→</i><b>2</b><span>{t({ uz: "Mos amalni tanlang", ru: 'Выбери подходящее действие', en: 'Choose the appropriate operation' })}</span></Reveal></section></div></Stage>;
}

function Screen7({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s7; const audio = useNarration(c.audio, screen); const flow = [
    { label: { uz: "Ma'lumlar", ru: 'Данные', en: 'Known values' }, value: t({ uz: '240 km · 60 km/soat', ru: '240 км · 60 км/ч', en: '240 km · 60 km/h' }) },
    { label: { uz: "Noma'lum", ru: 'Неизвестно', en: 'Unknown' }, value: t({ uz: "vaqt", ru: 'время', en: 'time' }) },
    { label: { uz: "Amal", ru: 'Действие', en: 'Operation' }, value: '240 : 60' },
    { label: { uz: "Natija", ru: 'Результат' , en: "Result"}, value: `4 ${t({ uz: "soat", ru: 'часа', en: 'hours' })}` },
  ];
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} /><section className="flow-board">{flow.map((item, index) => <React.Fragment key={t(item.label)}><Reveal show={audio.beat >= index} className={index === 3 ? 'flow-result' : ''}><span>{t(item.label)}</span><b>{item.value}</b></Reveal>{index < flow.length - 1 && <i className={audio.beat > index ? 'show' : ''}>→</i>}</React.Fragment>)}</section><Reveal show={audio.beat >= 3} className="unit-reminder">{t({ uz: "Javob noma'lum kattalik birligi bilan yozildi.", ru: 'Ответ записан с единицей неизвестной величины.', en: 'The answer includes the unit of the unknown quantity.' })}</Reveal></div></Stage>;
}

function Screen8({ screen, storedAnswer, onAnswer, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s8; const audio = useNarration(c.audio, screen); const correct = [0, 1, 2];
  const [picks, setPicks] = useState(storedAnswer?.correct ? correct : [null, null, null]);
  const [wrongRow, setWrongRow] = useState(null); const [message, setMessage] = useState(null);
  const attempts = useRef(storedAnswer?.attempts ?? 0); const clean = useRef(storedAnswer?.firstTry ?? true); const solved = picks.every((value, index) => value === correct[index]);
  const pick = (row, option) => {
    if (solved || picks[row] !== null) return;
    attempts.current += 1;
    if (option !== correct[row]) {
      clean.current = false; setWrongRow(row);
      const text = row === 0 ? { uz: "Kilometr va soat berilgan. Ularning nisbatidan tezlik topiladi.", ru: 'Даны километры и часы. Их отношение даёт скорость.', en: 'Distance in kilometres and time in hours are given. Their quotient gives the speed.' } : row === 1 ? { uz: "Tezlik va vaqt berilgan. Ularning ko'paytmasidan masofa topiladi.", ru: 'Даны скорость и время. Их произведение даёт расстояние.', en: 'Speed and time are given. Their product gives the distance.' } : { uz: "Masofa va tezlik berilgan. Ularning nisbatidan vaqt topiladi.", ru: 'Даны расстояние и скорость. Их отношение даёт время.', en: 'Distance and speed are given. Their quotient gives the time.' };
      setMessage(text); playSfx('wrong'); audio.pushOneOff(t(c.feedbackAudio.wrong[row]));
      onAnswer({ screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question), options: c.labels.map(t), correctIndex: null, correctAnswer: c.labels.map(t).join('|'), studentAnswerIndex: null, studentAnswer: `${row}:${option}`, correct: false, firstTry: false, attempts: attempts.current, solved: false });
      return;
    }
    const next = [...picks]; next[row] = option; setPicks(next); setWrongRow(null);
    const done = next.every((value, index) => value === correct[index]);
    const text = done ? { uz: "To'g'ri. Birliklar tezlik, masofa va vaqtni ajratishga yordam berdi.", ru: 'Верно. Единицы помогли различить скорость, расстояние и время.', en: 'Correct. The units helped distinguish speed, distance and time.' } : { uz: "Bu juftlik to'g'ri. Qolgan vaziyatni ham tekshiring.", ru: 'Эта пара верна. Проверьте следующую ситуацию.', en: 'This pair is correct. Check the next situation as well.' };
    setMessage(text);
    if (done) { playSfx('correct'); audio.pushOneOff(t(c.feedbackAudio.correct)); onAnswer({ screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question), options: c.labels.map(t), correctIndex: null, correctAnswer: c.labels.map(t).join('|'), studentAnswerIndex: null, studentAnswer: next.map((value) => t(c.labels[value])).join('|'), correct: true, firstTry: clean.current && attempts.current === 3, attempts: attempts.current, solved: true }); }
  };
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} /><section className={`match-board ${audio.beat >= 1 ? 'units-on' : ''}`}>{c.situations.map((situation, row) => <div className={wrongRow === row ? 'match-row wrong-row' : 'match-row'} key={t(situation)}><strong>{t(situation)}</strong><div>{c.labels.map((label, option) => <button type="button" key={t(label)} className={picks[row] === option ? 'matched' : ''} onClick={() => pick(row, option)} disabled={picks[row] !== null || solved}>{t(label)}</button>)}</div></div>)}</section><Feedback show={message !== null} correct={solved}>{message ? t(message) : ''}</Feedback></div></Stage>;
}

function NumericPractice({ screen, c, correctAnswer, unit, storedAnswer, onAnswer, onNext, onPrev, visual, getWrong }) {
  const t = useT(); const audio = useNarration(c.audio, screen); const [value, setValue] = useState(storedAnswer?.studentAnswer ?? ''); const [solved, setSolved] = useState(storedAnswer?.correct === true); const [message, setMessage] = useState(null); const attempts = useRef(storedAnswer?.attempts ?? 0); const clean = useRef(storedAnswer?.firstTry ?? true);
  const submit = () => {
    const answer = cleanNumber(value); if (!answer || solved) return;
    attempts.current += 1; const ok = answer === correctAnswer; if (!ok) clean.current = false; setSolved(ok);
    const text = ok ? { uz: `To'g'ri. Javob ${correctAnswer} ${unit.uz}.`, ru: `Верно. Ответ ${correctAnswer} ${unit.ru}.`, en: `Correct. The answer is ${correctAnswer} ${unit.en}.` } : getWrong(answer);
    setMessage(text); playSfx(ok ? 'correct' : 'wrong'); audio.pushOneOff(t(ok ? c.feedbackAudio.correct : c.feedbackAudio.wrong));
    onAnswer({ screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question), options: null, correctIndex: null, correctAnswer: `${correctAnswer} ${t(unit)}`, studentAnswerIndex: null, studentAnswer: answer, correct: ok, firstTry: ok && clean.current && attempts.current === 1, attempts: attempts.current, solved: ok });
  };
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} />{visual}<section className={`question frame-question ${audio.beat >= 1 ? 'ready' : ''}`}><h2>{t(c.question)}</h2><div className="input-row"><div className="input-with-unit"><input className={solved ? 'answer correct-input' : message ? 'answer wrong-input' : 'answer'} inputMode="numeric" placeholder="0" value={value} disabled={solved} onChange={(event) => { setValue(cleanNumber(event.target.value)); setMessage(null); }} onKeyDown={(event) => event.key === 'Enter' && submit()} /><span>{t(unit)}</span></div><button type="button" className="btn next check" onClick={submit} disabled={!value || solved}>{t({ uz: "Tekshirish", ru: 'Проверить' , en: "Check"})}</button></div><Feedback show={message !== null} correct={solved}>{message ? t(message) : ''}</Feedback></section></div></Stage>;
}

function ChoicePractice({ screen, c, correctIndex, storedAnswer, onAnswer, onNext, onPrev, visual, middle = null, optionBeat = 1, proof, bit = null }) {
  const t = useT(); const audio = useNarration(c.audio, screen); const [picked, setPicked] = useState(storedAnswer?.studentAnswerIndex ?? null); const [solved, setSolved] = useState(storedAnswer?.correct === true); const attempts = useRef(storedAnswer?.attempts ?? 0); const clean = useRef(storedAnswer?.firstTry ?? true);
  const pick = (index) => {
    if (solved) return;
    attempts.current += 1; const ok = index === correctIndex; if (!ok) clean.current = false; setPicked(index); setSolved(ok); playSfx(ok ? 'correct' : 'wrong'); audio.pushOneOff(t(c.feedbackAudio[index]));
    onAnswer({ screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question), options: c.options.map(t), correctIndex, correctAnswer: t(c.options[correctIndex]), studentAnswerIndex: index, studentAnswer: t(c.options[index]), correct: ok, firstTry: ok && clean.current && attempts.current === 1, attempts: attempts.current, solved: ok });
  };
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} bit={bit ? (solved ? 'nod' : bit) : null} />{visual}{middle && <Reveal show={audio.beat >= 1}>{middle}</Reveal>}<section className={`question frame-question ${audio.beat >= optionBeat ? 'ready' : ''}`}><h2>{t(c.question)}</h2><Options values={c.options} picked={picked} onPick={pick} correctIndex={correctIndex} solved={solved} wrong={picked !== null && !solved} disabled={solved} /><Feedback show={picked !== null} correct={solved}>{picked !== null ? t(c.feedback[picked]) : ''}</Feedback>{solved && proof}</section></div></Stage>;
}

function Screen9(props) {
  const t = useT(); const c = CONTENT.s9;
  return <NumericPractice {...props} c={c} correctAnswer="80" unit={{ uz: "km", ru: 'км' , en: "km"}} visual={<section className="practice-visual"><div><span>{t({ uz: '40 km/soat', ru: '40 км/ч', en: '40 km/h' })}</span><b>×</b><span>2 {t({ uz: "soat", ru: 'часа', en: 'hours' })}</span></div><FixedTrack distance="? km" chunks={2} progress={1} labels={['0', '1', '2']} /></section>} getWrong={(answer) => answer === '40' ? { uz: "40 faqat bir soatdagi masofa. Ikki soat uchun uni ikkiga ko'paytiring.", ru: 'Сорок это путь только за один час. Для двух часов умножьте его на два.', en: 'Forty is the distance travelled in just one hour. For two hours, multiply it by two.' } : { uz: "Masofa noma'lum. Tezlikni vaqtga ko'paytiring.", ru: 'Неизвестно расстояние. Умножьте скорость на время.', en: 'The distance is unknown. Multiply the speed by the time.' }} />;
}

function Screen10(props) {
  const t = useT(); const c = CONTENT.s10;
  return <ChoicePractice {...props} c={c} correctIndex={0} visual={<section className="practice-visual compact"><div><span>230 km</span><b>:</b><span>2 {t({ uz: "soat", ru: 'часа', en: 'hours' })}</span></div><div className="unknown-badge">{t({ uz: '? km/soat', ru: '? км/ч', en: '? km/h' })}</div></section>} proof={<div className="proof-grid"><span>230 : 2</span><b>{t({ uz: '115 km/soat', ru: '115 км/ч', en: '115 km/h' })}</b></div>} />;
}

function Screen11(props) {
  const t = useT(); const c = CONTENT.s11;
  return <NumericPractice {...props} c={c} correctAnswer="5" unit={{ uz: "soat", ru: 'часов', en: 'hours' }} visual={<section className="practice-visual"><div><span>300 km</span><b>:</b><span>{t({ uz: '60 km/soat', ru: '60 км/ч', en: '60 km/h' })}</span></div><FixedTrack distance="300 km" chunks={5} progress={1} labels={['0', '1', '2', '3', '4', '5']} /></section>} getWrong={() => ({ uz: "Vaqt noma'lum. Uch yuz kilometrni soatiga oltmish kilometrga bo'ling.", ru: 'Неизвестно время. Разделите триста километров на шестьдесят километров в час.', en: 'The time is unknown. Divide three hundred kilometres by sixty kilometres per hour.' })} />;
}

function Screen12(props) {
  const c = CONTENT.s12;
  const t = useT();
  return <ChoicePractice {...props} c={c} correctIndex={0} bit="awkward" visual={<section className="error-board"><div><span>12 km</span><span>{t({ uz: '3 soat', ru: '3 часа', en: '3 hours' })}</span></div><strong>{t({ uz: '12 × 3 = 36 km/soat', ru: '12 × 3 = 36 км/ч', en: '12 × 3 = 36 km/h' })}</strong><i>?</i></section>} proof={<div className="proof-grid"><span>{t({ uz: '12 km : 3 soat', ru: '12 км : 3 часа', en: '12 km ÷ 3 hours' })}</span><b>{t({ uz: '4 km/soat', ru: '4 км/ч', en: '4 km/h' })}</b></div>} />;
}

function Screen13(props) {
  const t = useT(); const c = CONTENT.s13;
  return <ChoicePractice {...props} c={c} correctIndex={0} optionBeat={2} visual={<section className="two-part-route"><div className="part small"><span>2 {t({ uz: "soat", ru: 'часа', en: 'hours' })}</span></div><div className="part large"><span>4 {t({ uz: "soat", ru: 'часа', en: 'hours' })}</span></div><strong>300 km</strong></section>} middle={<div className="total-time">2 + 4 = <b>6 {t({ uz: "soat", ru: 'часов', en: 'hours' })}</b></div>} proof={<div className="proof-grid"><span>{t({ uz: '2 + 4 = 6 soat', ru: '2 + 4 = 6 часов', en: '2 + 4 = 6 hours' })}</span><span>{t({ uz: '300 : 6 = 50 km/soat', ru: '300 : 6 = 50 км/ч', en: '300 ÷ 6 = 50 km/h' })}</span><b>100 km + 200 km = 300 km</b></div>} />;
}

function G4FinalTitleReward({ finalFrameReached, completed = false, muted = false, title, firstTry, total }) {
  const t = useT();
  const [reducedMotion, setReducedMotion] = useState(typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  const [unlocked, setUnlocked] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const revealedRef = useRef(false);
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
  useEffect(() => {
    if (!ready || revealedRef.current || typeof window === 'undefined') return;
    revealedRef.current = true;
    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;
      setUnlocked(true);
      setShowOverlay(true);
      timerRef.current = window.setTimeout(() => {
        timerRef.current = null;
        setShowOverlay(false);
      }, 3900);
    });
  }, [ready]);

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
      <div className="g4-title-card-score"><strong>{firstTry}/{total}</strong><span>{t({ uz: "birinchi urinishda", ru: 'с первой попытки', en: 'on the first attempt' })}</span></div>
    </aside> : <div className="g4-title-card-placeholder" aria-hidden="true" />}
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
  const choices = [{ uz: "Tushuntira olaman", ru: 'Могу объяснить', en: 'I can explain it' }, { uz: "Yana mashq qilaman", ru: 'Ещё потренируюсь', en: 'I will practise again' }];
  const claimTitle = () => { if (reflectionChoice === null) return; setTitleState('revealing'); };
  const completeReveal = useCallback(() => { setTitleState('claimed'); markActivity(14, reflectionChoice); }, [markActivity, reflectionChoice, setTitleState]);
  const localizedTitle = t(title);
  return <div className="contract-final-reward" data-legacy-contract={legacyContract}>{titleState !== 'claimed' && <div className="final-reflection" data-g4-role="reflection">{choices.map((choice, index) => <button type="button" key={t(choice)} className={reflectionChoice === index ? 'selected' : ''} onClick={() => setReflectionChoice(index)}>{t(choice)}</button>)}</div>}{titleState === 'unclaimed' && <button type="button" className="g4-title-claim" disabled={reflectionChoice === null} onClick={claimTitle}><span>★</span><strong>{t({ uz: "Unvonni olish", ru: 'Получить звание', en: 'Claim title' })}</strong></button>}<G4TitleReveal active={titleState === 'revealing'} title={localizedTitle} onComplete={completeReveal}/>{titleState === 'claimed' && <G4TitleCard title={localizedTitle} firstTry={firstTry} total={total} canFinish={titleState === 'claimed'}/>}</div>;
}

const FINAL_AWARDS = [
  { ru: 'Архитектор движения', uz: "Harakat me'mori", en: 'Motion Architect' },
  { ru: 'Мастер скорости и пути', uz: 'Tezlik va masofa ustasi', en: 'Master of Speed and Distance' },
  { ru: 'Исследователь движения', uz: 'Harakat tadqiqotchisi', en: 'Motion Explorer' },
];

const FinaleReward = ({ answers = [] }) => {
  const scored = SCREEN_META.map((item, index) => item.scored ? index : null).filter((index) => index !== null);
  const total = scored.length;
  const firstTry = scored.filter((index) => answers[index]?.firstTry === true).length;
  const award = firstTry === total ? FINAL_AWARDS[0] : firstTry >= Math.max(1, total - 1) ? FINAL_AWARDS[1] : FINAL_AWARDS[2];
  return <ContractFinalReward title={award} firstTry={firstTry} total={total} />;
};

function Screen14({ screen, answers, onPrev, finishLesson }) {
  const t = useT(); const c = CONTENT.s14; const audio = useNarration(c.audio, screen); const frame = audio.beat; const complete = frame >= 4; const rules = [
    { label: { uz: "Uch kattalik", ru: 'Три величины', en: 'Three quantities' }, text: { uz: "Masofa, vaqt va tezlik", ru: 'Расстояние, время и скорость', en: 'Distance, time and speed' } },
    { label: { uz: "Tezlik", ru: 'Скорость', en: 'Speed' }, text: { uz: "masofa : vaqt", ru: 'расстояние : время', en: 'distance ÷ time' } },
    { label: { uz: "Masofa", ru: 'Расстояние', en: 'Distance' }, text: { uz: "tezlik × vaqt", ru: 'скорость × время', en: 'speed × time' } },
    { label: { uz: "Vaqt", ru: 'Время', en: 'Time' }, text: { uz: "masofa : tezlik", ru: 'расстояние : скорость', en: 'distance ÷ speed' } },
  ];
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={finishLesson} finish><div className="stack"><section className="finale-heading"><span>◆ {t({ uz: "YAKUNIY BOSQICH", ru: 'ФИНАЛЬНЫЙ ЭТАП' , en: "FINAL STAGE"})}</span><h1>{t(c.title)}</h1><p>{t({ uz: "Boshlang'ich yo'lni tezlik javobi bilan yopib, uchta bog'lanishni jamlaymiz.", ru: 'Закрываем стартовый маршрут ответом о скорости и собираем три связи.', en: 'We complete the starting journey with the speed answer and bring the three relationships together.' })}</p></section><section className="finale-main"><div className="finale-payoff finale-track"><small>{t({ uz: "BOSHLANG'ICH MISSIYA YECHIMI", ru: 'РЕШЕНИЕ СТАРТОВОЙ МИССИИ', en: 'STARTING MISSION SOLUTION' })}</small><FixedTrack distance={t({ uz: "180 km", ru: '180 км', en: '180 km' })} chunks={3} progress={complete ? 1 : Math.min(1, (frame + 1) / 3)} labels={['0', '1', '2', '3']} /><div className={`finale-hook-answer ${complete ? 'show' : ''}`}>{t({ uz: "180 km : 3 soat =", ru: '180 км : 3 ч =', en: '180 km ÷ 3 hours =' })} <b>{t({ uz: "60 km/soat", ru: '60 км/ч', en: '60 km/h' })}</b></div></div><div className="finale-takeaways">{rules.map((rule, index) => <div className={`finale-takeaway ${frame >= index ? 'show' : ''}`} key={t(rule.label)}><b>{index + 1}</b><span><small>{t(rule.label)}</small>{t(rule.text)}</span></div>)}</div></section><section className="finale-bottom"><div className={`finale-bridge ${complete ? 'show' : ''}`}><small>{t({ uz: "KEYINGI MAVZU", ru: 'СЛЕДУЮЩАЯ ТЕМА' , en: "NEXT TOPIC"})}</small><strong>{t({ uz: "Bir nechta natijaning o'rtacha qiymati", ru: 'Среднее значение нескольких результатов', en: 'The mean of several results' })}</strong></div><FinaleReward answers={answers} complete={complete} audio={audio} /></section></div></Stage>;
}

const BASE_SCREENS = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14];
const SCREENS = SCREEN_FLOW.map((sourceIndex) => BASE_SCREENS[sourceIndex]);

export default function Grade4Dars14({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished, previewMode }) {
  const preview = previewMode ?? (langProp === undefined || langProp === null);
  const [previewLang, setPreviewLang] = useState(normalizeLang(langProp));
  const lang = preview ? previewLang : normalizeLang(langProp);
  configureLesson({ ttsApiBase: ttsApiBase || '', voiceGender: voiceGender || 'f', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', previewMode: preview });
  const [current, setCurrent] = useState(0); const [answers, setAnswers] = useState([]); const [activityState, setActivityState] = useState({}); const [finalRewardState, setFinalRewardState] = useState({ reflectionChoice: null, titleState: 'unclaimed' });
  // eslint-disable-next-line react-hooks/purity -- lesson duration starts when this component mounts
  const started = useRef(Date.now()); const finished = useRef(false);
  const markActivity = useCallback((screen, value = true) => setActivityState((previous) => Object.prototype.hasOwnProperty.call(previous, screen) && previous[screen] === value ? previous : { ...previous, [screen]: value }), []);
  const recordAnswer = useCallback((answer) => { setAnswers((previous) => { const next = [...previous]; const old = previous[answer.screenIdx]; next[answer.screenIdx] = { ...answer, firstTry: old?.firstTry === false ? false : answer.firstTry }; return next; }); if (!SCREEN_META[answer.screenIdx].scored || answer.correct) markActivity(answer.screenIdx, answer.studentAnswerIndex ?? true); }, [markActivity]);
  const finishLesson = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    const scored = SCREEN_META.map((meta, index) => meta.scored ? index : null).filter((index) => index !== null);
    const firstTryCorrect = scored.filter((index) => answers[index]?.firstTry === true).length;
    const payload = { lessonId: LESSON_META.lessonId, lessonTitle: LESSON_META.lessonTitle[lang], studentName: studentName || null, durationSec: Math.floor((Date.now() - started.current) / 1000), totalQuestions: scored.length, correctAnswers: firstTryCorrect, scorePercent: Math.round(firstTryCorrect / scored.length * 100), finalScore: firstTryCorrect, finalTotal: scored.length, passed: firstTryCorrect / scored.length >= 0.6, firstTryStats: { total: scored.length, firstTryCorrect }, attemptsTotal: scored.reduce((sum, index) => sum + (answers[index]?.attempts ?? 0), 0), skillTags: LESSON_META.skillTags, answers: answers.filter(Boolean) };
    if (onFinished) onFinished(payload); else console.log('[Grade4 Dars14 preview]', payload);
  }, [answers, lang, onFinished, studentName]);
  const Current = SCREENS[current];
  return <LangContext.Provider value={lang}><ActivityContext.Provider value={{ activityState, markActivity, finalRewardState, setFinalRewardState }}><style>{STYLES}</style><div className={`lesson-root ${preview ? 'lesson-root-preview' : ''}`}>{preview && <div className="preview-language" aria-label={{ uz: 'Dars tili', ru: 'Язык урока', en: 'Lesson language' }[lang]}>{SUPPORTED_LANGS.map((code) => <button type="button" key={code} className={previewLang === code ? 'preview-active' : ''} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>)}</div>}<Current key={current} screen={current} storedAnswer={answers[current]} answers={answers} onAnswer={recordAnswer} onPrev={() => setCurrent((value) => Math.max(0, value - 1))} onNext={() => setCurrent((value) => Math.min(TOTAL_SCREENS - 1, value + 1))} finishLesson={finishLesson} /></div></ActivityContext.Provider></LangContext.Provider>;
}

const STYLES = `
.g4-title-card-placeholder{width:100%;min-height:116px}
.g4-title-card{position:relative;isolation:isolate;width:100%;min-height:116px;margin:0;padding:12px 82px 11px 67px;border-radius:17px;display:flex;flex-direction:column;justify-content:center;gap:4px;overflow:hidden;color:#FFF;background:radial-gradient(circle at 82% 20%,rgba(255,194,60,.26),transparent 30%),linear-gradient(135deg,#173B52,#0E6978);box-shadow:0 28px 58px -27px rgba(22,143,163,.8);transform:translateY(-2px)}
.g4-title-card-medal{position:absolute;left:11px;top:50%;width:44px;height:44px;border:3px solid rgba(255,255,255,.58);border-radius:50%;display:grid;place-items:center;transform:translateY(-50%);color:#5A3A00;background:linear-gradient(145deg,#FFE284,#FFC23C);box-shadow:0 0 0 8px rgba(255,255,255,.08),0 15px 30px -15px rgba(0,0,0,.6);font-size:19px;z-index:2}
.g4-title-card-bit{position:absolute;right:3px;bottom:2px;width:72px;height:90px;z-index:2;animation:g4-title-card-bit-float 2.8s ease-in-out 1 both}.g4-title-card-bit>svg,.g4-title-card-bit .bit,.g4-title-card-bit .g1-char{width:100%;height:100%}
.g4-title-card-kicker{position:relative;color:#A8EAF0;font:900 10px/1.2 'JetBrains Mono',monospace;letter-spacing:.13em;z-index:2}.g4-title-card-title{position:relative;margin:0!important;font:750 clamp(16px,2.2vw,21px)/1.05 'Source Serif 4',Georgia,serif;z-index:2}.g4-title-card-score{position:relative;align-self:flex-start;margin-top:5px;padding:5px 9px;border-radius:10px;display:flex;align-items:center;gap:7px;background:rgba(255,255,255,.10);z-index:2}.g4-title-card-score strong{color:#FFE284;font-family:'JetBrains Mono',monospace}.g4-title-card-score span{color:rgba(255,255,255,.72);font-size:9px}
.g4-title-card-confetti{position:absolute;inset:0;pointer-events:none}.g4-title-card-confetti i{position:absolute;top:-16px;width:7px;height:12px;border-radius:2px;animation:g4-title-card-fall 2.4s linear 2 both}.g4-title-card-confetti i:nth-child(4n+1){background:#FFC23C}.g4-title-card-confetti i:nth-child(4n+2){background:#FF5B35}.g4-title-card-confetti i:nth-child(4n+3){background:#77E1EA}.g4-title-card-confetti i:nth-child(4n){background:#95C93D}.g4-title-card-confetti i:nth-child(1){left:8%;animation-delay:-.3s}.g4-title-card-confetti i:nth-child(2){left:17%;animation-delay:-1.1s}.g4-title-card-confetti i:nth-child(3){left:29%;animation-delay:-.7s}.g4-title-card-confetti i:nth-child(4){left:41%;animation-delay:-1.7s}.g4-title-card-confetti i:nth-child(5){left:52%;animation-delay:-.2s}.g4-title-card-confetti i:nth-child(6){left:63%;animation-delay:-1.3s}.g4-title-card-confetti i:nth-child(7){left:73%;animation-delay:-.8s}.g4-title-card-confetti i:nth-child(8){left:84%;animation-delay:-1.9s}.g4-title-card-confetti i:nth-child(9){left:12%;animation-delay:-2s}.g4-title-card-confetti i:nth-child(10){left:36%;animation-delay:-1.4s}.g4-title-card-confetti i:nth-child(11){left:68%;animation-delay:-.5s}.g4-title-card-confetti i:nth-child(12){left:91%;animation-delay:-1.6s}
.g4-title-reveal-overlay{position:fixed;inset:0;z-index:120;padding:0;display:grid;place-items:center;overflow:hidden;overscroll-behavior:contain;pointer-events:none;background:rgba(8,13,24,.64);backdrop-filter:blur(2px) saturate(.78);animation:g4-title-reveal-life 3.8s ease both}.g4-title-reveal-card{position:relative;isolation:isolate;width:100%;min-height:100dvh;padding:36px 24px;border:0;border-radius:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;overflow:hidden;color:#FFF;text-align:center;background:radial-gradient(circle at 50% 50%,rgba(255,214,80,.17),transparent 31%)}.g4-title-reveal-card::after{content:'';position:absolute;z-index:0;top:50%;left:50%;width:min(440px,82vw);height:min(440px,82vw);border-radius:50%;background:radial-gradient(circle,rgba(255,222,105,.17),transparent 68%);transform:translate(-50%,-50%)}
.g4-title-reveal-rays{position:absolute;z-index:0;top:50%;left:50%;width:160vmax;height:160vmax;border-radius:50%;opacity:.28;background:repeating-conic-gradient(from -4deg,rgba(255,218,91,.88) 0 8deg,transparent 8deg 20deg);transform:translate(-50%,-50%);animation:g4-title-reveal-rays-in .8s cubic-bezier(.16,1,.3,1) both,g4-title-reveal-rays-turn 26s linear .8s 1 both}.g4-title-reveal-medal{position:absolute;top:50%;left:50%;z-index:2;width:112px;height:112px;border:6px solid rgba(255,255,255,.72);border-radius:50%;display:grid;place-items:center;color:#653C00;background:linear-gradient(145deg,#FFF2A0,#FFC13B);box-shadow:0 0 0 13px rgba(255,255,255,.09),0 0 54px 10px rgba(255,204,63,.38),0 22px 38px -18px rgba(0,0,0,.7);font-size:52px;animation:g4-title-reveal-medal-in 1s cubic-bezier(.16,1,.3,1) .15s both}.g4-title-reveal-title{position:absolute;top:calc(50% + 82px);left:50%;z-index:2;width:min(680px,calc(100vw - 48px));margin:0!important;font:750 clamp(34px,5vw,58px)/1.02 'Source Serif 4',Georgia,serif;text-shadow:0 4px 24px rgba(0,0,0,.72);transform:translateX(-50%);animation:g4-title-reveal-title-in .7s ease .52s both}
.g4-title-reveal-confetti{position:absolute;inset:0;pointer-events:none}.g4-title-reveal-confetti i{position:absolute;top:-20px;width:8px;height:14px;border-radius:2px;background:#FFE284;animation:g4-title-reveal-fall 2.4s linear 2 both}.g4-title-reveal-confetti i:nth-child(3n+2){background:#FF7050}.g4-title-reveal-confetti i:nth-child(3n){background:#77E1EA}
@keyframes g4-title-card-bit-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}@keyframes g4-title-card-fall{to{transform:translateY(230px) rotate(460deg)}}@keyframes g4-title-reveal-life{0%{opacity:0}12%,84%{opacity:1}100%{opacity:0}}@keyframes g4-title-reveal-medal-in{from{opacity:0;transform:translate(-50%,-50%) scale(.25) rotate(-25deg)}to{opacity:1;transform:translate(-50%,-50%) scale(1) rotate(0)}}@keyframes g4-title-reveal-title-in{from{opacity:0;transform:translate(-50%,14px)}to{opacity:1;transform:translate(-50%,0)}}@keyframes g4-title-reveal-rays-in{from{opacity:0;transform:translate(-50%,-50%) scale(.5)}to{opacity:.28;transform:translate(-50%,-50%) scale(1)}}@keyframes g4-title-reveal-rays-turn{from{transform:translate(-50%,-50%) rotate(0)}to{transform:translate(-50%,-50%) rotate(360deg)}}@keyframes g4-title-reveal-fall{to{transform:translateY(470px) rotate(560deg)}}
@media(max-width:639.98px){.g4-title-card-placeholder{min-height:88px}.g4-title-card{min-height:88px;padding:9px 59px 8px 51px;border-radius:14px}.g4-title-card-medal{left:8px;width:34px;height:34px;font-size:14px}.g4-title-card-bit{width:57px;height:71px}.g4-title-card-title{font-size:14px}.g4-title-reveal-card{min-height:100dvh;padding:24px 18px}.g4-title-reveal-medal{width:88px;height:88px;border-width:5px;font-size:40px}.g4-title-reveal-title{top:calc(50% + 62px);font-size:29px}}
.contract-final-reward{width:100%;min-width:0;min-height:116px;display:grid;align-content:center;gap:6px}.final-reflection{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px}.final-reflection button,.g4-title-claim{min-width:44px;min-height:44px;padding:5px 7px;border:0;border-radius:11px;cursor:pointer;color:${T.navy};background:${T.cyanSoft};font-size:9px;font-weight:900;line-height:1.2}.final-reflection button.selected{color:#fff;background:${T.success}}.g4-title-claim{width:100%;display:flex;align-items:center;justify-content:center;gap:7px;color:#fff;background:${T.accent}}.g4-title-claim:disabled{opacity:.42;cursor:not-allowed}
@media(prefers-reduced-motion:reduce){.g4-title-card,.g4-title-card-bit,.g4-title-reveal-overlay,.g4-title-reveal-rays,.g4-title-reveal-medal,.g4-title-reveal-title{animation:none!important}.g4-title-card{opacity:1;transform:none!important}.g4-title-card-confetti,.g4-title-reveal-confetti{display:none}.g4-title-reveal-overlay{opacity:1}.g4-title-reveal-rays{opacity:.28;transform:translate(-50%,-50%)}.g4-title-reveal-medal{opacity:1;transform:translate(-50%,-50%)}.g4-title-reveal-title{opacity:1;transform:translateX(-50%)}}
html:has(.lesson-root),
body:has(.lesson-root),
#root:has(.lesson-root),
.lesson-page:has(.lesson-root),
.lesson-frame:has(.lesson-root) {
  width: 100%;
  height: 100%;
  min-height: 0 !important;
  margin: 0;
  overflow: hidden !important;
  overscroll-behavior: none;
}
.lesson-root,
.lesson-root * { box-sizing: border-box; }
.lesson-root h1,
.lesson-root h2,
.lesson-root p { margin: 0; }
.lesson-root button,
.lesson-root input { font: inherit; }
.lesson-root {
  position: fixed;
  inset: 0;
  z-index: 0;
  width: 100%;
  min-height: 100dvh;
  overflow: hidden;
  color: ${T.ink};
  background:
    radial-gradient(circle at 7% 9%, rgba(22,143,163,.11), transparent 29%),
    radial-gradient(circle at 94% 89%, rgba(255,91,53,.09), transparent 31%),
    ${T.bg};
  font-family: Manrope, Arial, sans-serif;
}
.stage {
  width: min(936px, 100%);
  height: 100dvh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: transparent;
}
.stage-header {
  flex-shrink: 0;
  padding-top: 10px;
  padding-bottom: 8px;
  z-index: 5;
  background: rgba(247,248,244,.88);
  backdrop-filter: blur(14px);
}
.progress-track {
  width: 100%;
  height: 6px;
  margin-bottom: 10px;
  border-radius: 999px;
  background: rgba(80,97,109,.16);
  overflow: hidden;
}
.progress-fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, ${T.cyan}, ${T.accent});
  box-shadow: 0 0 12px rgba(255,91,53,.42);
  transition: width .45s ease;
}
.chrome-title,
.chrome-actions,
.audio-controls { display: flex; align-items: center; }
.stage-chrome {
  min-width: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.chrome-title,
.chrome-actions,
.audio-controls { gap: 9px; }
.chrome-title {
  min-width: 0;
  overflow: hidden;
  color: ${T.ink2};
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .12em;
  text-transform: uppercase;
}
.chrome-title > span:last-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.chrome-actions { flex: none; }
.status-dot {
  width: 8px;
  height: 8px;
  flex: none;
  border-radius: 50%;
  background: ${T.accent};
  box-shadow: 0 0 10px rgba(255,91,53,.65);
}
.screen-type {
  padding: 4px 8px;
  border-radius: 999px;
  color: ${T.cyan};
  background: ${T.cyanSoft};
  font-size: 10px;
  font-weight: 800;
}
.screen-count {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 700;
}
.icon-btn {
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: 10px;
  color: ${T.ink2};
  background: rgba(255,255,255,.75);
  cursor: pointer;
  box-shadow: 0 4px 12px -7px rgba(${T.shadowBase},.3);
}
.stage-content {
  min-height: 0;
  flex: 1 1 auto;
  overflow: visible;
  padding-top: 12px;
  padding-bottom: 14px;
}
.stage-nav {
  min-height: 72px;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 10px;
  padding-bottom: 12px;
  z-index: 5;
  border-top: 1px solid rgba(23,59,82,.08);
  background: rgba(245,245,240,.94);
  backdrop-filter: blur(12px);
}
.btn {
  min-width: 124px;
  min-height: 50px;
  padding: 0 18px;
  border: 0;
  border-radius: 15px;
  color: ${T.ink2};
  background: transparent;
  font: 850 13px/1 Manrope, sans-serif;
  cursor: pointer;
  transition: transform .2s ease, background .2s ease, color .2s ease, opacity .2s ease;
}
.btn.next {
  color: ${T.accent};
  background: ${T.paper};
  box-shadow: 0 13px 28px -18px rgba(255,91,53,.60);
}
.btn:hover:not(:disabled),
.icon-btn:hover:not(:disabled) { transform: translateY(-2px); }
.btn.next:hover:not(:disabled) { color: white; background: ${T.accent}; }
.btn.ghost:hover:not(:disabled) { background: ${T.paper}; }
.btn:disabled,
button:disabled { cursor: default; opacity: .55; }
.lesson-root button:focus-visible,
.lesson-root input:focus-visible { outline: 3px solid rgba(22,143,163,.38); outline-offset: 3px; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
.stack { display: grid; gap: 14px; animation: pageEnter .5s cubic-bezier(.16,1,.3,1) both; }
.heading {
  min-height: 86px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
}
.heading > div { min-width: 0; }
.heading span,
.bridge > span {
  display: block;
  margin-bottom: 7px;
  color: ${T.cyan};
  font-size: 10px;
  font-weight: 950;
  letter-spacing: .12em;
  text-transform: uppercase;
}
.heading h1 {
  max-width: 770px;
  font: 750 clamp(27px,4vw,41px)/1.05 'Source Serif 4', Georgia, serif;
  letter-spacing: -.025em;
}
.heading .g1-char { width: 90px; height: 112px; flex: none; }
.question,
.motion-card,
.rule-board,
.unit-grid,
.formula-board,
.flow-board,
.match-board,
.practice-visual,
.error-board,
.two-part-route,
.summary-motion,
.summary-rules {
  padding: 17px 19px;
  border-radius: 22px;
  background: ${T.paper};
  box-shadow: 0 18px 42px -31px rgba(${T.shadowBase},.56);
}
.stage-hook .hook-motion {
  background:
    radial-gradient(circle at 87% 24%, rgba(121,211,218,.16), transparent 24%),
    radial-gradient(circle at 9% 88%, rgba(149,201,61,.11), transparent 25%),
    linear-gradient(145deg, rgba(22,143,163,.25), transparent 48%),
    linear-gradient(135deg, #153B50, #0B2232 72%);
}
.question h2 { font: 750 clamp(18px,2.6vw,25px)/1.28 'Source Serif 4', Georgia, serif; }
.frame-question { opacity: .42; transform: translateY(7px); pointer-events: none; transition: .4s ease; }
.frame-question.ready { opacity: 1; transform: none; pointer-events: auto; }
.options {
  display: grid;
  grid-template-columns: repeat(2,minmax(0,1fr));
  gap: 10px;
  margin-top: 14px;
}
.option {
  min-height: 56px;
  padding: 10px 13px;
  border: 0;
  border-radius: 15px;
  display: flex;
  align-items: center;
  gap: 11px;
  color: ${T.ink};
  background: #F8F8F4;
  text-align: left;
  font: 750 13px/1.35 Manrope, sans-serif;
  cursor: pointer;
  box-shadow: inset 0 0 0 1px rgba(135,148,157,.17), 0 8px 17px -14px rgba(${T.shadowBase},.35);
  transition: transform .2s ease, background .2s ease, box-shadow .2s ease;
}
.option:hover:not(:disabled),
.option.picked { transform: translateY(-2px); background: ${T.accentSoft}; }
.option > b {
  width: 32px;
  height: 32px;
  flex: none;
  border-radius: 10px;
  display: grid;
  place-items: center;
  color: ${T.cyan};
  background: ${T.paper};
  font: 900 12px/1 'JetBrains Mono', monospace;
}
.option.right { background: ${T.successSoft}; box-shadow: inset 0 0 0 2px rgba(34,122,83,.28); }
.option.right > b { color: white; background: ${T.success}; }
.option.bad { background: ${T.warnSoft}; box-shadow: inset 0 0 0 2px rgba(169,111,19,.25); }
.feedback {
  min-height: 58px;
  margin-top: 10px;
  padding: 9px 12px;
  visibility: hidden;
  opacity: 0;
  border-radius: 15px;
  display: grid;
  grid-template-columns: 34px minmax(0,1fr);
  align-items: center;
  gap: 9px;
  transform: translateY(6px);
  transition: opacity .28s ease, transform .34s ease;
}
.feedback.open { visibility: visible; opacity: 1; transform: none; }
.feedback > b { width: 32px; height: 32px; border-radius: 10px; display: grid; place-items: center; background: rgba(255,255,255,.72); font-weight: 950; }
.feedback p { min-width: 0; color: ${T.ink2}; font-size: 13px; line-height: 1.4; overflow-wrap: anywhere; }
.feedback.correct { background: ${T.successSoft}; box-shadow: inset 4px 0 ${T.success}; }
.feedback.correct > b { color: ${T.success}; }
.feedback.wrong { background: ${T.warnSoft}; box-shadow: inset 4px 0 ${T.warn}; }
.feedback.wrong > b { color: ${T.warn}; }
.caption {
  position: static;
  z-index: 4;
  width: fit-content;
  max-width: min(680px,100%);
  margin: 13px auto 0;
  padding: 9px 13px;
  border-radius: 12px;
  color: white;
  background: rgba(23,59,82,.94);
  text-align: center;
  font-size: 12px;
  line-height: 1.4;
  box-shadow: 0 12px 28px -18px rgba(23,59,82,.8);
}
.reveal-item { opacity: .12; transform: translateY(8px); transition: opacity .48s ease, transform .48s cubic-bezier(.16,1,.3,1); }
.reveal-item.show { opacity: 1; transform: none; }
.motion-card,
.rule-board,
.formula-board { display: grid; gap: 13px; }
.route-svg { width: 100%; height: auto; display: block; overflow: visible; }
.route-panel { fill: #F8FBF9; stroke: rgba(22,143,163,.18); stroke-width: 2; }
.route-road { fill: none; stroke: rgba(23,59,82,.16); stroke-width: 13; stroke-linecap: round; }
.route-trail { fill: none; stroke: ${T.cyan}; stroke-width: 13; stroke-linecap: round; transition: d .52s cubic-bezier(.16,1,.3,1); }
.route-tick path { stroke: rgba(23,59,82,.27); stroke-width: 2; }
.route-tick circle { fill: white; stroke: ${T.cyan}; stroke-width: 3; }
.route-tick text { fill: ${T.ink2}; font: 850 12px/1 'JetBrains Mono', monospace; }
.route-marker { transform-box: fill-box; transform-origin: left center; transition: transform .52s cubic-bezier(.16,1,.3,1); }
.route-marker circle { fill: ${T.accent}; filter: drop-shadow(0 5px 7px rgba(255,91,53,.32)); }
.route-marker path { fill: none; stroke: white; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
.route-distance { fill: ${T.navy}; font: 900 18px/1 'JetBrains Mono', monospace; }
.hook-facts,
.three-values,
.known-strip,
.segment-cards { display: grid; grid-template-columns: repeat(3,1fr); gap: 9px; }
.hook-facts > div,
.three-values > div,
.known-strip > div,
.segment-cards > div {
  min-height: 70px;
  padding: 11px;
  border-radius: 15px;
  display: grid;
  align-content: center;
  gap: 6px;
  color: ${T.ink2};
  background: #F8F8F4;
  text-align: center;
}
.hook-facts span,
.three-values span,
.known-strip span,
.segment-cards span { color: ${T.ink3}; font-size: 10px; font-weight: 850; text-transform: uppercase; }
.hook-facts b,
.three-values b,
.known-strip b,
.segment-cards b { color: ${T.navy}; font: 900 16px/1.2 'JetBrains Mono', monospace; }
.speed-value { background: ${T.successSoft} !important; }
.speed-value b { color: ${T.success}; }
.equal-note,
.operation-line,
.chunk-note,
.unit-reminder,
.hook-answer {
  padding: 11px 14px;
  border-radius: 14px;
  color: ${T.cyan};
  background: ${T.cyanSoft};
  text-align: center;
  font: 850 15px/1.3 'JetBrains Mono', monospace;
}
.operation-line { color: ${T.accent}; background: ${T.accentSoft}; }
.answer-chip,
.unknown-badge {
  width: fit-content;
  justify-self: center;
  padding: 10px 18px;
  border-radius: 999px;
  color: white;
  background: ${T.success};
  font: 900 17px/1 'JetBrains Mono', monospace;
  box-shadow: 0 10px 22px -16px rgba(34,122,83,.8);
}
.formula-row {
  min-height: 70px;
  padding: 12px 16px;
  border-radius: 17px;
  display: grid;
  grid-template-columns: minmax(100px,.42fr) 1fr;
  align-items: center;
  gap: 14px;
  opacity: .16;
  background: #F8F8F4;
  transform: translateY(7px);
  transition: .48s cubic-bezier(.16,1,.3,1);
}
.formula-row.active { opacity: 1; transform: none; }
.formula-row span { color: ${T.ink2}; font-size: 12px; font-weight: 900; text-transform: uppercase; }
.formula-row strong { color: ${T.cyan}; font: 900 clamp(16px,2.7vw,23px)/1.2 'JetBrains Mono', monospace; }
.formula-row.orange strong { color: ${T.accent}; }
.unit-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 11px; }
.unit-grid > div { min-height: 190px; padding: 16px; border-radius: 18px; display: grid; align-content: center; justify-items: center; gap: 9px; background: #F8F8F4; text-align: center; }
.unit-grid i { width: 46px; height: 46px; border-radius: 15px; display: grid; place-items: center; color: ${T.cyan}; background: ${T.cyanSoft}; font: normal 900 22px/1 Manrope, sans-serif; }
.unit-grid span { color: ${T.ink2}; font-size: 12px; font-weight: 850; }
.unit-grid b { color: ${T.navy}; font: 900 22px/1 'JetBrains Mono', monospace; }
.unit-grid small { color: ${T.ink3}; font-size: 11px; line-height: 1.35; }
.decision-card { min-height: 72px; padding: 12px; border-radius: 16px; display: grid; grid-template-columns: 34px 1fr 24px 34px 1fr; align-items: center; gap: 9px; color: ${T.ink2}; background: ${T.cyanSoft}; font-size: 12px; font-weight: 800; }
.decision-card b { width: 32px; height: 32px; border-radius: 10px; display: grid; place-items: center; color: white; background: ${T.cyan}; font: 900 12px/1 'JetBrains Mono', monospace; }
.decision-card i { color: ${T.accent}; font-style: normal; font-weight: 950; }
.flow-board { min-height: 180px; display: grid; grid-template-columns: repeat(7,auto); align-items: stretch; gap: 8px; }
.flow-board > div { min-width: 0; padding: 13px 10px; border-radius: 15px; display: grid; align-content: center; gap: 7px; background: #F8F8F4; text-align: center; }
.flow-board > div span { color: ${T.ink3}; font-size: 9px; font-weight: 900; text-transform: uppercase; }
.flow-board > div b { color: ${T.navy}; font: 850 13px/1.35 'JetBrains Mono', monospace; overflow-wrap: anywhere; }
.flow-board > div.flow-result { background: ${T.successSoft}; }
.flow-board > div.flow-result b { color: ${T.success}; }
.flow-board > i { align-self: center; opacity: .15; color: ${T.accent}; font-style: normal; font-weight: 950; transition: opacity .35s ease; }
.flow-board > i.show { opacity: 1; }
.match-board { display: grid; gap: 10px; }
.match-row { padding: 11px; border-radius: 16px; display: grid; grid-template-columns: minmax(180px,.8fr) 1fr; align-items: center; gap: 12px; background: #F8F8F4; transition: .25s ease; }
.match-row strong { color: ${T.navy}; font: 850 14px/1.3 'JetBrains Mono', monospace; }
.match-row > div { display: grid; grid-template-columns: repeat(3,1fr); gap: 6px; }
.match-row button { min-height: 44px; padding: 7px; border: 0; border-radius: 12px; color: ${T.ink2}; background: white; cursor: pointer; font-size: 11px; font-weight: 850; box-shadow: 0 8px 18px -16px rgba(${T.shadowBase},.55); }
.match-row button:hover:not(:disabled) { color: ${T.accent}; transform: translateY(-1px); }
.match-row button.matched { color: white; background: ${T.success}; opacity: 1; }
.match-row.wrong-row { background: ${T.warnSoft}; box-shadow: inset 4px 0 ${T.warn}; }
.match-board:not(.units-on) .match-row button { opacity: .55; }
.practice-visual { display: grid; gap: 10px; }
.practice-visual > div:first-child { display: flex; align-items: center; justify-content: center; gap: 14px; flex-wrap: wrap; }
.practice-visual > div:first-child span { padding: 12px 15px; border-radius: 14px; color: ${T.navy}; background: #F8F8F4; font: 900 17px/1 'JetBrains Mono', monospace; }
.practice-visual > div:first-child b { color: ${T.accent}; font: 900 24px/1 'JetBrains Mono', monospace; }
.practice-visual.compact { min-height: 130px; grid-template-columns: 1fr auto; align-items: center; }
.input-row { margin-top: 15px; display: flex; align-items: stretch; justify-content: flex-end; gap: 10px; }
.input-with-unit { min-width: 0; flex: 1; position: relative; }
.answer {
  width: 100%;
  min-height: 54px;
  padding: 10px 80px 10px 16px;
  border: 0;
  border-radius: 15px;
  outline: 0;
  color: ${T.navy};
  background: #F8F8F4;
  font: 900 20px/1 'JetBrains Mono', monospace;
  box-shadow: inset 0 0 0 1px rgba(135,148,157,.24), 0 8px 18px -16px rgba(${T.shadowBase},.42);
}
.answer:focus { box-shadow: inset 0 0 0 2px ${T.cyan}, 0 0 0 4px rgba(22,143,163,.12); }
.answer.correct-input { background: ${T.successSoft}; box-shadow: inset 0 0 0 2px rgba(34,122,83,.42); }
.answer.wrong-input { background: ${T.warnSoft}; box-shadow: inset 0 0 0 2px rgba(169,111,19,.35); }
.input-with-unit > span { position: absolute; right: 15px; top: 50%; color: ${T.ink3}; font-size: 11px; font-weight: 900; transform: translateY(-50%); }
.btn.check { flex: none; }
.proof-grid {
  margin-top: 13px;
  padding: 13px;
  border-radius: 15px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: ${T.navy};
  background: ${T.cyanSoft};
  font: 850 13px/1.3 'JetBrains Mono', monospace;
  animation: proofOpen .62s cubic-bezier(.16,1,.3,1) both;
}
.proof-grid span,
.proof-grid b { padding: 8px 10px; border-radius: 10px; background: rgba(255,255,255,.7); }
.proof-grid b { color: ${T.success}; }
.error-board { min-height: 154px; position: relative; display: grid; justify-items: center; align-content: center; gap: 12px; }
.error-board > div { display: flex; gap: 10px; }
.error-board span { padding: 9px 13px; border-radius: 12px; color: ${T.navy}; background: ${T.cyanSoft}; font: 850 15px/1 'JetBrains Mono', monospace; }
.error-board strong { padding: 10px 15px; border-radius: 13px; color: ${T.warn}; background: ${T.warnSoft}; font: 900 19px/1.2 'JetBrains Mono', monospace; text-decoration: line-through; }
.error-board > i { position: absolute; right: 25px; top: 24px; color: ${T.accent}; font: normal 950 34px/1 'Source Serif 4', serif; }
.two-part-route { min-height: 160px; position: relative; display: grid; grid-template-columns: 1fr 2fr; gap: 6px; align-items: stretch; padding-bottom: 48px; }
.two-part-route .part { min-height: 82px; border-radius: 16px; display: grid; place-items: center; color: white; background: ${T.cyan}; }
.two-part-route .part.large { background: ${T.navy}; }
.two-part-route span { font: 900 18px/1 'JetBrains Mono', monospace; }
.two-part-route > strong { position: absolute; left: 19px; right: 19px; bottom: 15px; color: ${T.accent}; text-align: center; font: 900 18px/1 'JetBrains Mono', monospace; }
.total-time { padding: 10px 15px; border-radius: 14px; color: ${T.ink2}; background: ${T.cyanSoft}; text-align: center; font: 850 14px/1.3 'JetBrains Mono', monospace; }
.total-time b { color: ${T.cyan}; }
.summary-motion { display: grid; gap: 10px; }
.hook-answer b { color: ${T.success}; }
.summary-rules { display: grid; grid-template-columns: repeat(4,1fr); gap: 8px; }
.summary-rules > div { min-height: 92px; padding: 10px; border-radius: 14px; display: grid; align-content: center; justify-items: center; gap: 8px; color: ${T.ink2}; background: #F8F8F4; text-align: center; transition: .22s ease; }
.summary-rules span { color: ${T.ink3}; font-size: 9px; font-weight: 900; text-transform: uppercase; }
.summary-rules b { font: 850 12px/1.35 'JetBrains Mono', monospace; }
.summary-rules > div.active { color: ${T.navy}; background: ${T.accentSoft}; box-shadow: inset 0 0 0 2px rgba(255,91,53,.24); transform: translateY(-3px); }
.bridge { padding: 13px 16px; border-radius: 16px; color: white; background: ${T.navy}; }
.bridge > span { color: #7DE1EE; }
.bridge > strong { font: 750 16px/1.3 'Source Serif 4', Georgia, serif; }
.finale-heading{min-width:0;padding:11px 15px;border-radius:17px;background:linear-gradient(100deg,rgba(255,91,53,.09),transparent 52%),rgba(255,255,255,.92);box-shadow:0 13px 28px -24px rgba(255,91,53,.72)}.finale-heading>span{display:flex;align-items:center;gap:6px;color:${T.accent};font:900 9px/1.2 'JetBrains Mono',monospace;letter-spacing:.12em}.finale-heading h1{margin-top:4px!important;color:${T.navy};font:750 clamp(21px,3vw,28px)/1.08 'Source Serif 4',Georgia,serif}.finale-heading p{margin-top:4px!important;color:${T.ink2};font-size:11px;line-height:1.35}.finale-main{min-width:0;display:grid;grid-template-columns:minmax(220px,.82fr) minmax(320px,1.18fr);align-items:stretch;gap:10px}.finale-payoff{min-width:0;padding:13px;border-radius:18px;display:grid;align-content:center;gap:10px;background:#fff;box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.5)}.finale-payoff>small{color:${T.cyan};font-size:9px;font-weight:900;letter-spacing:.09em}.finale-equation{min-width:0;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:7px}.finale-equation span,.finale-equation strong{min-width:52px;padding:10px;border-radius:12px;text-align:center;font:900 clamp(16px,2.4vw,22px)/1 'JetBrains Mono',monospace}.finale-equation span{color:${T.navy};background:${T.cyanSoft}}.finale-equation strong{color:${T.navy};background:${T.lime}}.finale-equation i{color:${T.accent};font:normal 900 19px/1 'JetBrains Mono',monospace}.finale-check{padding:9px 11px;border-radius:12px;color:${T.ink2};background:#F8F8F4;text-align:center;font:850 12px/1.3 'JetBrains Mono',monospace}.finale-check b{color:${T.success}}.finale-takeaways{min-width:0;display:grid;gap:6px}.finale-takeaway{min-width:0;min-height:40px;padding:7px 10px;border-radius:12px;display:grid;grid-template-columns:27px minmax(0,1fr);align-items:center;gap:8px;opacity:.14;transform:translateY(6px);background:#F8F8F4;transition:opacity .42s ease,transform .42s ease,background .42s ease}.finale-takeaway.show{opacity:1;transform:none;background:${T.cyanSoft}}.finale-takeaway b{width:26px;height:26px;border-radius:9px;display:grid;place-items:center;color:#fff;background:${T.cyan};font:900 9px/1 'JetBrains Mono',monospace}.finale-takeaway span{min-width:0;color:${T.ink2};font-size:11px;font-weight:800;line-height:1.3;overflow-wrap:anywhere}.finale-bottom{min-width:0;display:grid;grid-template-columns:minmax(0,1.2fr) minmax(270px,.8fr);gap:10px}.finale-bridge{min-width:0;padding:12px 15px;border-radius:16px;display:grid;align-content:center;gap:4px;opacity:.14;transform:translateY(6px);color:#fff;background:${T.navy};transition:.42s ease}.finale-bridge.show{opacity:1;transform:none}.finale-bridge small{color:#98E1E5;font-size:9px;font-weight:900;letter-spacing:.1em}.finale-bridge strong{font:750 15px/1.3 'Source Serif 4',Georgia,serif}.finale-reward{min-width:0;min-height:100px;position:relative;overflow:hidden;padding:12px 72px 11px 58px;border-radius:17px;display:grid;align-content:center;color:#fff;background:linear-gradient(135deg,#234B62,${T.navy});box-shadow:0 17px 34px -27px rgba(${T.shadowBase},.74);transition:filter .45s ease,box-shadow .45s ease}.finale-reward:not(.complete){filter:saturate(.72)}.finale-reward.complete{box-shadow:0 17px 36px -22px rgba(149,201,61,.72)}.finale-medal{position:absolute;left:11px;top:50%;width:38px;height:38px;border:3px solid rgba(255,255,255,.72);border-radius:50%;display:grid;place-items:center;transform:translateY(-50%);color:${T.navy};background:${T.lime};font-size:17px;font-weight:900}.finale-reward-copy{min-width:0;display:grid;gap:3px}.finale-reward-copy>small{color:#98E1E5;font-size:8px;font-weight:900;letter-spacing:.09em}.finale-reward-copy>strong{font:750 15px/1.15 'Source Serif 4',Georgia,serif}.finale-status{display:flex;align-items:center;gap:6px}.finale-status b{color:#FFE284;font:900 11px/1 'JetBrains Mono',monospace}.finale-status span{color:rgba(255,255,255,.72);font-size:8px}.finale-reward-bit{position:absolute;right:2px;bottom:-4px;width:68px;height:86px}.finale-reward-bit .bit{width:100%;height:100%}.finale-reward.complete .finale-reward-bit{animation:float 2.8s ease-in-out 2}.finale-confetti{position:absolute;inset:0;pointer-events:none}.finale-confetti i{position:absolute;top:-12px;width:5px;height:9px;border-radius:2px;background:#FFC23C;animation:finaleFall 2.8s linear 2}.finale-confetti i:nth-child(2n){background:${T.accent}}.finale-confetti i:nth-child(3n){background:#77E1EA}.finale-confetti i:nth-child(1){left:9%;animation-delay:-.2s}.finale-confetti i:nth-child(2){left:22%;animation-delay:-1.1s}.finale-confetti i:nth-child(3){left:35%;animation-delay:-.7s}.finale-confetti i:nth-child(4){left:48%;animation-delay:-1.8s}.finale-confetti i:nth-child(5){left:61%;animation-delay:-.4s}.finale-confetti i:nth-child(6){left:73%;animation-delay:-1.4s}.finale-confetti i:nth-child(7){left:84%;animation-delay:-.9s}.finale-confetti i:nth-child(8){left:93%;animation-delay:-2s}@keyframes finaleFall{to{transform:translateY(118px) rotate(180deg)}}
.finale-track .route-svg{max-height:128px}.finale-hook-answer{padding:9px 11px;border-radius:12px;opacity:.14;transform:translateY(6px);color:${T.ink2};background:#F8F8F4;text-align:center;font:850 12px/1.3 'JetBrains Mono',monospace;transition:.42s ease}.finale-hook-answer.show{opacity:1;transform:none}.finale-hook-answer b{color:${T.success}}.finale-takeaway span small{display:block;margin-bottom:2px;color:${T.cyan};font-size:8px;font-weight:900;text-transform:uppercase}.finale-reward-bit .g1-char{width:100%;height:100%}.finale-reward.complete .finale-reward-bit{animation-name:bitFloat}
.stage-summary .stage-content{position:relative}.summary-happy-bit{position:absolute;right:14px;top:4px;width:58px;height:72px;z-index:2}.stage-summary .finale-heading{padding-right:78px}
.preview-language { position: fixed; top: 9px; right: 9px; z-index: 30; display: flex; gap: 3px; padding: 3px; border-radius: 999px; background: rgba(255,255,255,.94); box-shadow: 0 8px 20px -14px rgba(${T.shadowBase},.6); }
.preview-language button { padding: 4px 9px; border: 0; border-radius: 999px; color: ${T.ink2}; background: transparent; cursor: pointer; font-size: 10px; font-weight: 900; }
.preview-language .preview-active { color: #FFFFFF; background: ${T.accent}; }
.g1-char { overflow: visible; filter: drop-shadow(0 9px 11px rgba(23,59,82,.20)); animation: bitFloat 3.2s ease-in-out 2; }
.g1-eyes { animation: blink 4.4s ease-in-out 2; transform-origin: center; }
@keyframes pageEnter { from { opacity: 0; transform: translateY(10px); } }
@keyframes proofOpen { from { opacity: 0; transform: translateY(8px); } }
@keyframes bitFloat { 50% { transform: translateY(-5px); } }
@keyframes blink { 0%,45%,49%,100% { transform: scaleY(1); } 47% { transform: scaleY(.12); } }
@media (max-width: 639.98px) {
  .stage { width: min(390px,100%); }
  .stage-header { padding-top: 60px; }
  .screen-type { display: none; }
  .stage-content { padding-top: 8px; padding-bottom: 8px; }
  .heading { min-height: 64px; gap: 10px; }
  .heading h1 { font-size: 27px; }
  .heading .g1-char { width: 58px; height: 72px; }
  .question,
  .motion-card,
  .rule-board,
  .unit-grid,
  .formula-board,
  .flow-board,
  .match-board,
  .practice-visual,
  .error-board,
  .two-part-route,
  .summary-motion,
  .summary-rules { padding: 14px; border-radius: 18px; }
  .options { grid-template-columns: 1fr; }
  .option { min-height: 52px; }
  .route-distance { font-size: 15px; }
  .hook-facts,
  .three-values,
  .known-strip,
  .segment-cards { gap: 5px; }
  .hook-facts > div,
  .three-values > div,
  .known-strip > div,
  .segment-cards > div { min-height: 62px; padding: 8px 4px; }
  .hook-facts b,
  .three-values b,
  .known-strip b,
  .segment-cards b { font-size: 12px; }
  .formula-row { min-height: 64px; grid-template-columns: 82px 1fr; gap: 8px; padding: 10px; }
  .formula-row strong { font-size: 14px; }
  .unit-grid { grid-template-columns: 1fr; }
  .unit-grid > div { min-height: 85px; grid-template-columns: 44px 1fr auto; justify-items: start; text-align: left; }
  .unit-grid small { grid-column: 2 / -1; }
  .decision-card { grid-template-columns: 32px 1fr; }
  .decision-card > i { display: none; }
  .flow-board { min-height: 0; grid-template-columns: 1fr; }
  .flow-board > i { transform: rotate(90deg); justify-self: center; }
  .match-row { grid-template-columns: 1fr; }
  .match-row > div { gap: 4px; }
  .match-row button { padding: 5px 2px; font-size: 9px; }
  .practice-visual.compact { grid-template-columns: 1fr; }
  .input-row { flex-direction: column; }
  .btn.check { align-self: flex-end; }
  .summary-rules { grid-template-columns: 1fr 1fr; }
  .summary-rules > div { min-height: 76px; }
  .finale-heading { padding: 9px 11px; }
  .finale-heading h1 { font-size: 21px; }
  .finale-heading p { font-size: 9px; }
  .finale-main,
  .finale-bottom { grid-template-columns: 1fr; }
  .finale-payoff { padding: 11px; }
  .finale-track .route-svg { max-height: 105px; }
  .finale-takeaway { min-height: 38px; padding: 6px 8px; }
  .finale-reward { min-height: 92px; padding: 10px 62px 9px 51px; }
  .finale-medal { left: 9px; width: 34px; height: 34px; }
  .finale-reward-bit { width: 58px; height: 74px; }
  .finale-reward-copy > strong { font-size: 14px; }
  .stage-summary .stack { gap: 9px; }
  .stage-summary .finale-heading { padding: 7px 9px; }
  .stage-summary .finale-heading p { font-size: 8.5px; line-height: 1.25; }
  .stage-summary .finale-main,
  .stage-summary .finale-bottom { gap: 8px; }
  .stage-summary .finale-payoff { padding: 8px; gap: 6px; }
  .stage-summary .finale-track .route-svg { max-height: 80px; }
  .stage-summary .finale-hook-answer { padding: 6px 8px; }
  .stage-summary .finale-takeaways { gap: 4px; }
  .stage-summary .finale-takeaway { min-height: 34px; padding: 4px 7px; grid-template-columns: 25px minmax(0,1fr); gap: 6px; }
  .stage-summary .finale-takeaway b { width: 24px; height: 24px; }
  .stage-summary .finale-takeaway span { font-size: 10px; line-height: 1.22; }
  .stage-summary .finale-bridge { padding: 8px 11px; }
  .stage-summary .finale-bridge strong { font-size: 13px; }
  .stage-summary .finale-reward { min-height: 80px; padding: 8px 56px 7px 47px; }
  .stage-summary .finale-medal { left: 8px; width: 30px; height: 30px; }
  .stage-summary .finale-reward-bit { width: 52px; height: 66px; }
  .stage-summary .finale-reward-copy > strong { font-size: 13px; }
  .stage-summary .finale-status span { font-size: 7.5px; }
  .stage-nav { min-height: 60px; padding-top: 7px; padding-bottom: 8px; }
  .btn { min-width: 110px; min-height: 48px; padding: 0 13px; }
  .stack { gap: 9px; }
  .feedback { min-height: 52px; margin-top: 7px; padding: 7px 10px; }
}
@media (prefers-reduced-motion: reduce) {
  .lesson-root *,
  .lesson-root *::before,
  .lesson-root *::after { scroll-behavior: auto !important; animation-duration: .001ms !important; animation-iteration-count: 1 !important; transition-duration: .001ms !important; }
  .reveal-item,
  .formula-row,
  .frame-question,
  .flow-board > i,
  .finale-takeaway,
  .finale-hook-answer,
  .finale-bridge { opacity: 1 !important; transform: none !important; pointer-events: auto !important; }
}
.stage-content{position:relative;overflow:hidden!important;padding-bottom:54px!important}.stage-body{height:auto;min-height:0;overflow:visible}.caption.caption-slot{position:absolute;left:clamp(14px,5vw,48px);right:clamp(14px,5vw,48px);bottom:5px;width:auto;max-width:none;min-height:40px;margin:0;display:grid;place-items:center;visibility:hidden;opacity:0}.caption.caption-slot.visible{visibility:visible;opacity:1}.activity-slot{min-height:48px;margin-top:7px;display:flex;align-items:center;justify-content:center;gap:6px}.activity-slot button{min-height:44px;padding:7px 12px;border:0;border-radius:13px;color:${T.cyan};background:${T.cyanSoft};font-weight:900;cursor:pointer}.activity-slot button.selected{color:#fff;background:${T.success}}.finale-reflection{display:grid;grid-template-columns:repeat(3,minmax(0,1fr))}.finale-reflection button{min-width:0;font-size:11px}.btn.next:disabled{opacity:.42;cursor:not-allowed;transform:none}.lesson-root,.stage,.stage-content,.stage-body{overscroll-behavior:none}@media(max-width:390px){.caption.caption-slot{left:14px;right:14px}.finale-reflection button{padding:5px 6px;font-size:9px}}@media(max-height:700px){.stage-header{padding-top:7px;padding-bottom:5px}.stage-content{padding-top:2px!important}.stack{gap:7px}.heading{min-height:54px}.heading h1{font-size:23px}.heading .g1-char{width:50px;height:62px}.activity-slot{margin-top:4px}.stage-nav{min-height:56px}}
.caption.caption-slot{pointer-events:none}
@media(min-width:640px){.stage:not(.stage-hook):not(.stage-summary) .stage-body{position:relative;padding-right:190px}.stage:not(.stage-hook):not(.stage-summary) .activity-slot{position:absolute;right:0;top:50%;width:180px;transform:translateY(-50%)}.stage:not(.stage-hook):not(.stage-summary) .heading{min-height:66px}.stage:not(.stage-hook):not(.stage-summary) .heading .g1-char{width:60px;height:74px}.stage:not(.stage-hook):not(.stage-summary) .stack{gap:8px}.stage:not(.stage-hook):not(.stage-summary) .route-svg{max-height:130px}.stage:not(.stage-hook):not(.stage-summary) .question,.stage:not(.stage-hook):not(.stage-summary) .motion-card,.stage:not(.stage-hook):not(.stage-summary) .rule-board,.stage:not(.stage-hook):not(.stage-summary) .unit-grid,.stage:not(.stage-hook):not(.stage-summary) .formula-board,.stage:not(.stage-hook):not(.stage-summary) .flow-board,.stage:not(.stage-hook):not(.stage-summary) .match-board,.stage:not(.stage-hook):not(.stage-summary) .practice-visual,.stage:not(.stage-hook):not(.stage-summary) .error-board,.stage:not(.stage-hook):not(.stage-summary) .two-part-route{padding:11px}.stage:not(.stage-hook):not(.stage-summary) .formula-row{min-height:58px;padding:8px 10px}.stage:not(.stage-hook):not(.stage-summary) .unit-grid>div{min-height:140px;padding:10px}.stage:not(.stage-hook):not(.stage-summary) .flow-board{min-height:140px}.stage:not(.stage-hook):not(.stage-summary) .match-row{padding:8px}.stage:not(.stage-hook):not(.stage-summary) .feedback{min-height:48px;margin-top:6px;padding:6px 8px}.stage:not(.stage-hook):not(.stage-summary) .practice-visual.compact{min-height:96px}.stage:not(.stage-hook):not(.stage-summary) .error-board{min-height:110px}.stage:not(.stage-hook):not(.stage-summary) .two-part-route{min-height:118px}.stage:not(.stage-hook):not(.stage-summary) .proof-grid{margin-top:6px;padding:7px}.stage:not(.stage-hook):not(.stage-summary) .options{margin-top:7px}.stage:not(.stage-hook):not(.stage-summary) .option{min-height:50px;padding:7px}}
@media(min-width:640px) and (max-width:1100px){.stage:not(.stage-hook):not(.stage-summary) .stage-body{padding-right:170px}.stage:not(.stage-hook):not(.stage-summary) .activity-slot{width:160px}.stage:not(.stage-hook):not(.stage-summary) .route-svg{max-height:112px}.stage:not(.stage-hook):not(.stage-summary) .heading{min-height:58px}.stage:not(.stage-hook):not(.stage-summary) .heading h1{font-size:27px}.stage:not(.stage-hook):not(.stage-summary) .unit-grid>div{min-height:116px}.stage:not(.stage-hook):not(.stage-summary) .flow-board{min-height:112px}}
@media(min-width:361px) and (max-width:639px){.stage-error-analysis .stack,.stage-life-case .stack{grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);align-items:start;gap:7px}.stage-error-analysis .heading,.stage-life-case .heading{grid-column:1/-1;min-height:58px}.stage-error-analysis .heading .g1-char,.stage-life-case .heading .g1-char{width:52px;height:64px}.stage-error-analysis .error-board,.stage-life-case .two-part-route{min-height:112px;padding:9px}.stage-error-analysis .question,.stage-life-case .question{padding:9px;gap:6px}.stage-error-analysis .options,.stage-life-case .options{grid-template-columns:1fr;gap:5px;margin-top:5px}.stage-error-analysis .option,.stage-life-case .option{min-height:48px;padding:6px}.stage-error-analysis .feedback,.stage-life-case .feedback{min-height:48px;margin-top:4px;padding:5px 7px}.stage-life-case .two-part-route{padding-bottom:34px}.stage-life-case .two-part-route .part{min-height:58px}.stage-life-case .total-time{padding:6px}.stage-life-case .proof-grid{margin-top:4px;padding:5px}}
@media(min-width:640px) and (max-width:1100px){.stage-life-case .heading{min-height:48px}.stage-life-case .two-part-route{min-height:70px;padding-bottom:24px}.stage-life-case .two-part-route .part{min-height:42px}.stage-life-case .total-time{padding:4px}.stage-life-case .proof-grid{margin-top:2px;padding:3px}.stage-life-case .proof-grid span,.stage-life-case .proof-grid b{padding:3px 4px}}
@media(min-width:361px) and (max-width:639px){.stage-error-analysis .stack,.stage-life-case .stack{display:flex;flex-wrap:wrap;align-items:flex-start;gap:6px}.stage-error-analysis .heading,.stage-life-case .heading{flex:0 0 100%;min-height:52px}.stage-error-analysis .error-board,.stage-life-case .two-part-route{flex:1 1 42%;min-width:0;min-height:88px;padding:6px}.stage-error-analysis .question,.stage-life-case .question{flex:1 1 54%;min-width:0;padding:6px;gap:3px}.stage-error-analysis .question h2,.stage-life-case .question h2{font-size:14px}.stage-error-analysis .options,.stage-life-case .options{grid-template-columns:1fr;gap:3px;margin-top:3px}.stage-error-analysis .option,.stage-life-case .option{min-height:44px;padding:4px;font-size:10.5px}.stage-error-analysis .feedback,.stage-life-case .feedback{min-height:44px;margin-top:2px;padding:4px 5px}.stage-life-case .two-part-route{padding-bottom:24px}.stage-life-case .two-part-route .part{min-height:44px}.stage-life-case .total-time{flex:0 0 100%;padding:3px}.stage-life-case .proof-grid{margin-top:2px;padding:3px}}
@media(min-width:640px) and (max-width:1100px){.stage-life-case .stack{display:flex;flex-wrap:wrap;align-items:flex-start;gap:6px}.stage-life-case .heading{flex:0 0 100%}.stage-life-case .two-part-route{flex:1 1 42%;min-width:0}.stage-life-case .question{flex:1 1 54%;min-width:0;padding:7px}.stage-life-case .total-time{flex:0 0 100%}}
@media(min-width:361px) and (max-width:639px){.stage-guided-example .stage-body{position:relative;padding-right:148px}.stage-guided-example .activity-slot{position:absolute;right:0;top:50%;width:140px;transform:translateY(-50%)}.stage-guided-example .heading{min-height:52px}.stage-guided-example .heading .g1-char{width:46px;height:56px}.stage-guided-example .flow-board{min-height:112px;grid-template-columns:repeat(7,minmax(0,auto));gap:3px;padding:6px}.stage-guided-example .flow-board>div{padding:5px 3px;gap:3px}.stage-guided-example .unit-reminder{padding:5px;font-size:11px}}
@media(min-width:640px){.stage-hook .stack{grid-template-columns:minmax(0,1.12fr) minmax(300px,.88fr);align-items:start}.stage-hook .heading{grid-column:1/-1}.stage-hook .question{align-self:stretch}.stage-hook .options{grid-template-columns:1fr}.stage-model .stage-body,.stage-discovery .stage-body,.stage-rule .stage-body,.stage-guided-example .stage-body,.stage-comparison .stage-body{position:relative;padding-right:190px}.stage-model .activity-slot,.stage-discovery .activity-slot,.stage-rule .activity-slot,.stage-guided-example .activity-slot,.stage-comparison .activity-slot{position:absolute;right:0;top:50%;width:180px;transform:translateY(-50%)}}
@media(max-height:700px){.stack{gap:5px}.heading{min-height:48px}.heading h1{font-size:21px}.heading .g1-char{width:44px;height:54px}.question,.motion-card,.rule-board,.unit-grid,.formula-board,.flow-board,.match-board,.practice-visual,.error-board,.two-part-route,.summary-motion,.summary-rules{padding:8px;border-radius:15px}.motion-card,.rule-board,.formula-board{gap:7px}.route-svg{max-height:78px}.hook-facts>div,.three-values>div,.known-strip>div,.segment-cards>div{min-height:46px;padding:5px 3px;gap:3px}.hook-facts b,.three-values b,.known-strip b,.segment-cards b{font-size:11px}.equal-note,.operation-line,.chunk-note,.unit-reminder,.hook-answer{padding:7px 8px;font-size:12px}.formula-row{min-height:50px;padding:6px 8px;grid-template-columns:76px 1fr;gap:6px}.formula-row span{font-size:10px}.formula-row strong{font-size:13px}.decision-card{min-height:54px;padding:7px;gap:5px}.activity-slot{min-height:44px;margin-top:2px}.stage-hook .question{padding:8px;gap:5px}.stage-hook .question h2,.question h2{font-size:15px}.stage-hook .options,.stage-guided-practice .options,.stage-error-analysis .options,.stage-life-case .options{grid-template-columns:repeat(3,minmax(0,1fr));gap:5px;margin-top:6px}.stage-hook .option,.stage-guided-practice .option,.stage-error-analysis .option,.stage-life-case .option{min-height:56px;padding:5px;gap:4px;font-size:11px}.stage-hook .option>b,.stage-guided-practice .option>b,.stage-error-analysis .option>b,.stage-life-case .option>b{width:22px;height:22px}.feedback{min-height:48px;margin-top:5px;padding:5px 7px}.feedback p{font-size:11px;line-height:1.3}.match-row{grid-template-columns:minmax(82px,.62fr) minmax(0,1fr);gap:6px;padding:6px}.match-row strong{font-size:11px}.match-row>div{gap:3px}.match-row button{min-height:44px;padding:4px 2px;font-size:9px}.input-row{margin-top:7px;flex-direction:row;gap:6px}.answer{min-height:48px}.btn.check{min-height:44px}.proof-grid{margin-top:5px;padding:6px;gap:4px;font-size:10px}.proof-grid span,.proof-grid b{padding:5px 6px}.stage-life-case .proof-grid{margin-top:0;padding:3px}.stage-life-case .proof-grid span,.stage-life-case .proof-grid b{padding:3px 4px}.unit-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:5px}.unit-grid>div{min-height:104px;padding:6px;grid-template-columns:1fr;justify-items:center;text-align:center;gap:4px}.unit-grid i{width:36px;height:36px}.unit-grid span,.unit-grid small{font-size:9px}.unit-grid b{font-size:14px}.flow-board{min-height:112px;grid-template-columns:repeat(7,minmax(0,auto));gap:3px}.flow-board>div{padding:6px 3px;gap:3px}.flow-board>div b{font-size:10px}.practice-visual.compact{min-height:82px}.error-board{min-height:94px;gap:6px}.two-part-route{min-height:104px;padding-bottom:34px}.stage-life-case .two-part-route{min-height:88px;padding-bottom:27px}.stage-life-case .two-part-route .part{min-height:46px}.two-part-route .part{min-height:54px}.stage-summary .stack{grid-template-columns:minmax(0,1fr) minmax(0,1fr);align-items:start;gap:6px}.stage-summary .finale-heading{grid-column:1/-1}.stage-summary .finale-main,.stage-summary .finale-bottom{grid-template-columns:1fr;gap:5px}.stage-summary .finale-track .route-svg{max-height:62px}.stage-summary .finale-hook-answer{padding:4px 5px;font-size:9px}.stage-summary .finale-takeaway{min-height:30px;padding:3px 5px}.stage-summary .finale-takeaway span{font-size:8.5px}.stage-summary .finale-bridge{padding:6px 8px}.stage-summary .finale-bridge strong{font-size:11px}.stage-summary .finale-reward{min-height:72px;padding:6px 47px 5px 39px}.stage-summary .finale-reward-bit{width:44px;height:56px}.stage-summary .finale-medal{left:6px;width:27px;height:27px}}
`;
