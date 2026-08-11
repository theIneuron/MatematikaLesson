import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// 4-SINF · 15-DARS · O'rtacha arifmetik
// Approved frame vector: 3,5,4,3,4,3,3,4,2,2,2,2,2,3,5.

const T = {
  bg: '#F5F5F0', ink: '#12212C', ink2: '#50616D', ink3: '#87949D', paper: '#FFFFFF',
  accent: '#FF5B35', accentSoft: '#FFF0EA', cyan: '#168FA3', cyanSoft: '#E5F5F6',
  navy: '#173B52', lime: '#95C93D', success: '#227A53', successSoft: '#E7F3EC',
  warn: '#A96F13', warnSoft: '#FFF5D9', shadowBase: '58, 53, 48',
};

const TOTAL_SCREENS = 15;
const BASE_FRAME_COUNTS = [3, 5, 4, 3, 4, 3, 3, 4, 2, 2, 2, 2, 2, 3, 5];
const SCREEN_FLOW = [0, 1, 8, 2, 9, 3, 10, 4, 11, 6, 12, 7, 13, 5, 14];
const FRAME_COUNTS = SCREEN_FLOW.map((sourceIndex) => BASE_FRAME_COUNTS[sourceIndex]);
const SUPPORTED_LANGS = ['uz', 'ru', 'en'];
const normalizeLang = (value) => SUPPORTED_LANGS.includes(value) ? value : 'uz';
const SPEECH_LOCALES = { uz: 'uz-UZ', ru: 'ru-RU', en: 'en-GB' };
const LESSON_META = {
  lessonId: 'num-4-15-v1',
  slug: 'dars15-ortacha-arifmetik',
  lessonTitle: { uz: "15-dars. O'rtacha arifmetik", ru: 'Урок 15. Среднее арифметическое', en: 'Lesson 15. Arithmetic mean' },
  skillTags: ['arithmetic_mean', 'equalization', 'sum', 'value_count', 'comparison'],
};

const BASE_SCREEN_META = [
  { id: 's0', type: 'hook', template: 'MCScreen', scored: false, scope: 'hook' },
  { id: 's1', type: 'exploration', template: 'custom', scored: false, scope: null },
  { id: 's2', type: 'exploration', template: 'custom', scored: false, scope: null },
  { id: 's3', type: 'exploration', template: 'custom', scored: false, scope: null },
  { id: 's4', type: 'exploration', template: 'custom', scored: false, scope: null },
  { id: 's5', type: 'exploration', template: 'custom', scored: false, scope: null },
  { id: 's6', type: 'rule', template: 'custom', scored: false, scope: null },
  { id: 's7', type: 'exploration', template: 'custom', scored: false, scope: null },
  { id: 's8', type: 'test', template: 'MCScreen', scored: true, scope: 'module-mikro' },
  { id: 's9', type: 'test', template: 'custom', scored: true, scope: 'module-mikro' },
  { id: 's10', type: 'test', template: 'NumInputScreen', scored: true, scope: 'module-mikro' },
  { id: 's11', type: 'test', template: 'MCScreen', scored: true, scope: 'module-mikro' },
  { id: 's12', type: 'test', template: 'MCScreen', scored: true, scope: 'module-mikro' },
  { id: 's13', type: 'case', template: 'MCScreen', scored: true, scope: 'module-mikro' },
  { id: 's14', type: 'summary', template: 'custom', scored: false, scope: null },
];
const SCREEN_META = SCREEN_FLOW.map((sourceIndex, screenIndex) => ({
  ...BASE_SCREEN_META[sourceIndex],
  id: `s${screenIndex}`,
  scope: screenIndex === 12 ? 'final' : BASE_SCREEN_META[sourceIndex].scope,
}));

const CONTENT = {
  s0: {
    eyebrow: { uz: "Sport maydoni", ru: 'Спортивная площадка', en: 'Sports field' },
    title: { uz: "Faqat eng yaxshi natija yetarlimi?", ru: 'Достаточно ли лучшего результата?', en: 'Is the best result enough?' },
    question: { uz: "Barcha urinishlarni qanday adolatli taqqoslaymiz?", ru: 'Как честно сравнить все попытки?', en: 'How can we compare all the attempts fairly?' },
    options: [
      { uz: "Faqat 15 metrni olamiz", ru: 'Берём только 15 метров', en: 'Use only the 15-metre result' },
      { uz: "Barcha natijalarni bitta teng qiymatga keltiramiz", ru: 'Уравниваем все результаты до одного значения', en: 'Redistribute all the results into one equal value' },
      { uz: "Faqat oxirgi urinishni olamiz", ru: 'Берём только последнюю попытку', en: 'Use only the final attempt' },
    ],
    neutral: { uz: "Eng katta natija ikkalasida ham bir xil. Barcha urinishlarni hisobga oladigan usul kerak.", ru: 'Лучший результат у обоих одинаков. Нужен способ учесть все попытки.', en: 'Their best results are the same. We need a method that takes every attempt into account.' },
    audio: { intro: {
      uz: ["Anvar besh marta uloqtirdi.", "Ulug'bek ham besh marta uloqtirdi.", "Eng katta natija ikkalasida ham bir xil. Barcha urinishlarni hisobga oladigan usul kerak."],
      ru: ['Анвар выполнил пять бросков.', 'Улугбек тоже выполнил пять бросков.', 'Лучший результат у обоих одинаков. Нужен способ учесть все попытки.'],
      en: ['Anvar made five throws.', 'Ulugbek also made five throws.', 'Their best results are the same. We need a method that takes every attempt into account.'],
    }, on_correct: { uz: "Taxmin saqlandi.", ru: 'Гипотеза сохранена.', en: 'Your estimate has been saved.' }, on_wrong: { uz: "Taxmin saqlandi.", ru: 'Гипотеза сохранена.', en: 'Your estimate has been saved.' } },
  },
  s1: {
    eyebrow: { uz: "Tenglashtirish", ru: 'Выравнивание', en: 'Equalising' },
    title: { uz: "Anvarning natijalarini tenglashtiramiz", ru: 'Выравниваем результаты Анвара', en: "Equalise Anvar's results" },
    audio: {
      uz: ["Anvarning beshta natijasi bir xil emas.", "Barcha natijalarni qo'shsak, oltmish metr chiqadi.", "Endi jami natijani beshta urinishga teng taqsimlaymiz.", "Har bir ustunga o'n ikki metrdan to'g'ri keladi.", "Tenglashtirilgan qiymat Anvarning o'rtacha natijasidir."],
      ru: ['Пять результатов Анвара различаются.', 'Сумма всех результатов равна шестидесяти метрам.', 'Теперь поровну распределим общий результат между пятью попытками.', 'На каждый столбец приходится по двенадцать метров.', 'Выровненное значение является средним результатом Анвара.'],
      en: ["Anvar's five results are not all the same.", 'The sum of all the results is sixty metres.', 'Now we redistribute the total equally across the five attempts.', 'Each column receives twelve metres.', "The equalised value is Anvar's mean result."],
    },
  },
  s2: {
    eyebrow: { uz: "Matematik yozuv", ru: 'Математическая запись', en: 'Mathematical expression' },
    title: { uz: "Qo'shamiz va soniga bo'lamiz", ru: 'Складываем и делим на количество', en: 'Add and divide by how many values there are' },
    audio: {
      uz: ["To'qqiz, o'n to'rt, to'qqiz, o'n besh va o'n uch qiymatlarini qo'shamiz.", "Ularning yig'indisi oltmishga teng.", "Ro'yxatda beshta qiymat bor, shuning uchun oltmishni beshga bo'lamiz.", "Oltmishni beshga bo'lsak, o'rtacha arifmetik o'n ikki chiqadi."],
      ru: ['Складываем девять, четырнадцать, девять, пятнадцать и тринадцать.', 'Их сумма равна шестидесяти.', 'В списке пять значений, поэтому шестьдесят делим на пять.', 'Шестьдесят разделить на пять равно двенадцати. Это среднее арифметическое.'],
      en: ['We add nine, fourteen, nine, fifteen and thirteen.', 'Their sum is sixty.', 'There are five values in the list, so we divide sixty by five.', 'Sixty divided by five is twelve. This is the arithmetic mean.'],
    },
  },
  s3: {
    eyebrow: { uz: "Bo'luvchi", ru: 'Делитель', en: 'Divisor' },
    title: { uz: "Nega aynan 5 ga bo'lamiz?", ru: 'Почему делим именно на 5?', en: 'Why do we divide by 5?' },
    audio: {
      uz: ["Bo'luvchi eng katta son emas, qiymatlar sonidir.", "To'rtga bo'lish bitta urinishni hisobdan chiqarib yuboradi.", "Beshta qiymat bo'lsa, yig'indini beshga bo'lamiz."],
      ru: ['Делитель не является самым большим числом, это количество значений.', 'Деление на четыре исключит из расчёта одну попытку.', 'Если значений пять, сумму делим на пять.'],
      en: ['The divisor is not the greatest number. It is the number of values.', 'Dividing by four would leave one attempt out of the calculation.', 'When there are five values, we divide the sum by five.'],
    },
  },
  s4: {
    eyebrow: { uz: "Ikkinchi ishtirokchi", ru: 'Второй участник', en: 'The second participant' },
    title: { uz: "Ulug'bekning o'rtacha natijasi", ru: 'Средний результат Улугбека', en: "Ulugbek's mean result" },
    audio: {
      uz: ["Ulug'bekning barcha natijalarini qo'shamiz.", "Yig'indi ellik besh metr.", "Ellik beshni beshta qiymatga teng taqsimlaymiz.", "Ulug'bekning o'rtacha natijasi o'n bir metr."],
      ru: ['Складываем все результаты Улугбека.', 'Сумма равна пятидесяти пяти метрам.', 'Поровну распределяем пятьдесят пять между пятью значениями.', 'Средний результат Улугбека равен одиннадцати метрам.'],
      en: ["We add all of Ulugbek's results.", 'The sum is fifty-five metres.', 'We redistribute fifty-five equally across five values.', "Ulugbek's mean result is eleven metres."],
    },
  },
  s5: {
    eyebrow: { uz: "Adolatli taqqoslash", ru: 'Честное сравнение', en: 'A fair comparison' },
    title: { uz: "O'rtacha natijalarni taqqoslaymiz", ru: 'Сравниваем средние результаты', en: 'Compare the mean results' },
    audio: {
      uz: ["Endi ikkala ishtirokchining barcha urinishlari hisobga olindi.", "Anvarning o'rtacha natijasi bir metrga yuqori.", "O'rtacha natija bo'yicha Anvar g'olib."],
      ru: ['Теперь учтены все попытки обоих участников.', 'Средний результат Анвара на один метр выше.', 'По среднему результату побеждает Анвар.'],
      en: ['Now every attempt by both participants has been taken into account.', "Anvar's mean result is one metre higher.", 'Anvar wins based on the mean result.'],
    },
  },
  s6: {
    eyebrow: { uz: "Qoida", ru: 'Правило', en: 'Rule' },
    title: { uz: "O'rtacha arifmetik", ru: 'Среднее арифметическое', en: 'Arithmetic mean' },
    audio: {
      uz: ["Birinchi navbatda barcha sonlarni qo'shamiz.", "Keyin nechta qiymat borligini sanaymiz.", "Yig'indini qiymatlar soniga bo'lib, o'rtacha arifmetikni topamiz."],
      ru: ['Сначала складываем все числа.', 'Затем считаем количество значений.', 'Делим сумму на количество значений и находим среднее арифметическое.'],
      en: ['First, we add all the numbers.', 'Then we count how many values there are.', 'We divide the sum by the number of values to find the arithmetic mean.'],
    },
  },
  s7: {
    eyebrow: { uz: "Muhim chegara holat", ru: 'Важный граничный случай', en: 'An important special case' },
    title: { uz: "O'rtacha ro'yxatda bo'lmasligi mumkin", ru: 'Среднего может не быть в списке', en: 'The mean may not be in the list' },
    audio: {
      uz: ["Uch, besh va o'n qiymatlarini olaylik.", "Ularning yig'indisi o'n sakkiz.", "O'n sakkizni uchga bo'lsak, olti chiqadi.", "Olti dastlabki ro'yxatda yo'q, lekin u tenglashtirilgan o'rtacha qiymatdir."],
      ru: ['Возьмём значения три, пять и десять.', 'Их сумма равна восемнадцати.', 'Восемнадцать разделить на три равно шести.', 'Шести нет в исходном списке, но это выровненное среднее значение.'],
      en: ['Take the values three, five and ten.', 'Their sum is eighteen.', 'Eighteen divided by three is six.', 'Six is not in the original list, but it is the equalised mean value.'],
    },
  },
  s8: {
    eyebrow: { uz: "Mashq · 1/6", ru: 'Тренировка · 1/6' , en: "Practice · 1/6"},
    title: { uz: "To'g'ri yozuvni tanlang", ru: 'Выбери верную запись', en: 'Choose the correct expression' },
    question: { uz: "12, 17, 18, 20 va 28 sonlarining o'rtacha arifmetigini qaysi yozuv topadi?", ru: 'Какая запись находит среднее арифметическое чисел 12, 17, 18, 20 и 28?', en: 'Which expression finds the arithmetic mean of 12, 17, 18, 20 and 28?' },
    options: [
      { uz: "(12 + 17 + 18 + 20 + 28) : 5 = 19", ru: '(12 + 17 + 18 + 20 + 28) : 5 = 19' , en: "(12 + 17 + 18 + 20 + 28) : 5 = 19"},
      { uz: "(12 + 17 + 18 + 20 + 28) : 4", ru: '(12 + 17 + 18 + 20 + 28) : 4' , en: "(12 + 17 + 18 + 20 + 28) : 4"},
      { uz: "28 − 12 = 16", ru: '28 − 12 = 16' , en: "28 − 12 = 16"},
    ],
    correctIndex: 0,
    feedback: [
      { uz: "To'g'ri. Yig'indi beshta qiymat soniga bo'lindi.", ru: 'Верно. Сумма разделена на количество пяти значений.', en: 'Correct. The sum is divided by the number of values, which is five.' },
      { uz: "Ro'yxatda to'rtta emas, beshta qiymat bor. Bo'luvchi besh bo'lishi kerak.", ru: 'В списке не четыре, а пять значений. Делитель должен быть равен пяти.', en: 'There are five values in the list, not four. The divisor must be five.' },
      { uz: "Ayirma oraliq kengligini ko'rsatadi, o'rtacha qiymatni emas. Barcha sonlar yig'indisi kerak.", ru: 'Разность показывает ширину диапазона, а не среднее значение. Нужна сумма всех чисел.', en: 'The difference shows the width of the range, not the mean. You need the sum of all the numbers.' },
    ],
    audio: { intro: { uz: ["O'n ikki, o'n yetti, o'n sakkiz, yigirma va yigirma sakkiz sonlarining o'rtacha arifmetigini topadigan yozuvni tanlang.", "Avval beshta sonni qo'shib, yig'indini qiymatlar soni bo'lgan beshga bo'lish kerak."], ru: ['Выбери запись для среднего арифметического чисел двенадцать, семнадцать, восемнадцать, двадцать и двадцать восемь.', 'Сначала нужно сложить пять чисел. Затем сумму нужно разделить на пять, потому что значений пять.'], en: ['Choose the expression that finds the arithmetic mean of twelve, seventeen, eighteen, twenty and twenty-eight.', 'First add the five numbers, then divide the sum by five because there are five values.'] }, on_correct: { uz: "To'g'ri. Yig'indi beshta qiymat soniga bo'lindi.", ru: 'Верно. Сумма разделена на количество пяти значений.', en: 'Correct. The sum is divided by the number of values, which is five.' }, on_wrong: { uz: "Qiymatlar sonini qayta sanang.", ru: 'Ещё раз посчитай количество значений.', en: 'Count the number of values again.' } },
  },
  s9: {
    eyebrow: { uz: "Mashq · 2/6", ru: 'Тренировка · 2/6' , en: "Practice · 2/6"},
    title: { uz: "Amallar tartibini tuzing", ru: 'Составь порядок действий', en: 'Put the steps in order' },
    question: { uz: "O'rtacha arifmetikni topish tartibini tuzing.", ru: 'Составь порядок нахождения среднего арифметического.', en: 'Put the steps for finding the arithmetic mean in order.' },
    cards: [
      { uz: "Barcha sonlarni qo'shing", ru: 'Сложи все числа', en: 'Add all the numbers' },
      { uz: "Qiymatlar sonini sanang", ru: 'Посчитай количество значений', en: 'Count the number of values' },
      { uz: "Yig'indini qiymatlar soniga bo'ling", ru: 'Раздели сумму на количество значений', en: 'Divide the sum by the number of values' },
    ],
    audio: { intro: { uz: ["O'rtacha arifmetikni topish tartibini tuzing.", "Avval yig'indi, keyin qiymatlar soni, so'ng bo'lish kerak."], ru: ['Составь порядок нахождения среднего арифметического.', 'Сначала нужна сумма, затем количество значений, потом деление.'], en: ['Put the steps for finding the arithmetic mean in order.', 'First find the sum, then count the values, and finally divide.'] }, on_correct: { uz: "To'g'ri tartib tuzildi.", ru: 'Верный порядок составлен.', en: 'The steps are in the correct order.' }, on_wrong: { uz: "Avval yig'indini topish kerak.", ru: 'Сначала нужно найти сумму.', en: 'First, find the sum.' } },
  },
  s10: {
    eyebrow: { uz: "Mashq · 3/6", ru: 'Тренировка · 3/6' , en: "Practice · 3/6"},
    title: { uz: "Mustaqil hisob", ru: 'Самостоятельное вычисление' , en: "Independent calculation"},
    question: { uz: "28, 36, 19 va 41 sonlarining o'rtacha arifmetigi nechaga teng?", ru: 'Чему равно среднее арифметическое чисел 28, 36, 19 и 41?', en: 'What is the arithmetic mean of 28, 36, 19 and 41?' },
    answer: '31',
    audio: { intro: { uz: ["Yigirma sakkiz, o'ttiz olti, o'n to'qqiz va qirq bir sonlarining o'rtacha arifmetigini toping.", "Ularning yig'indisi bir yuz yigirma to'rt, qiymatlar soni esa to'rtta.", "Bir yuz yigirma to'rtni to'rtga bo'lib javobni kiriting."], ru: ['Найди среднее арифметическое чисел двадцать восемь, тридцать шесть, девятнадцать и сорок один.', 'Их сумма равна ста двадцати четырём, а значений четыре.', 'Раздели сто двадцать четыре на четыре и введи ответ.'], en: ['Find the arithmetic mean of twenty-eight, thirty-six, nineteen and forty-one.', 'Their sum is one hundred and twenty-four, and there are four values.', 'Divide one hundred and twenty-four by four and enter the answer.'] }, on_correct: { uz: "To'g'ri. Bir yuz yigirma to'rtni to'rtga bo'lsak, o'ttiz bir chiqadi.", ru: 'Верно. Сто двадцать четыре разделить на четыре равно тридцати одному.', en: 'Correct. One hundred and twenty-four divided by four is thirty-one.' }, on_wrong: { uz: "Yig'indi bir yuz yigirma to'rt, qiymatlar soni to'rtta.", ru: 'Сумма равна ста двадцати четырём, значений четыре.', en: 'The sum is one hundred and twenty-four, and there are four values.' } },
  },
  s11: {
    eyebrow: { uz: "Mashq · 4/6", ru: 'Тренировка · 4/6' , en: "Practice · 4/6"},
    title: { uz: "Sonlar orasidagi o'rtacha nuqta", ru: 'Средняя точка между числами', en: 'The midpoint between two numbers' },
    question: { uz: "57 va 65 sonlarining o'rtacha arifmetigi nechaga teng?", ru: 'Чему равно среднее арифметическое чисел 57 и 65?', en: 'What is the arithmetic mean of 57 and 65?' },
    options: ['59', '61', '63'], correctIndex: 1,
    feedback: [
      { uz: "Ellik to'qqiz 57 dan ikki, 65 dan olti uzoqda. Masofalar teng emas.", ru: 'Пятьдесят девять находится на расстоянии двух от 57 и шести от 65. Расстояния не равны.', en: 'Fifty-nine is two away from 57 and six away from 65. The distances are not equal.' },
      { uz: "To'g'ri. Oltmish bir ikkala sondan to'rt birlik uzoqda.", ru: 'Верно. Шестьдесят один находится на расстоянии четырёх от обоих чисел.', en: 'Correct. Sixty-one is four units away from both numbers.' },
      { uz: "Oltmish uch 57 dan olti, 65 dan ikki uzoqda. Masofalar teng emas.", ru: 'Шестьдесят три находится на расстоянии шести от 57 и двух от 65. Расстояния не равны.', en: 'Sixty-three is six away from 57 and two away from 65. The distances are not equal.' },
    ],
    audio: { intro: { uz: ["Ellik yetti va oltmish beshning o'rtacha arifmetigini toping.", "Ikki sonning o'rtachasi ularning orasidagi teng masofali nuqtadir."], ru: ['Найди среднее арифметическое пятидесяти семи и шестидесяти пяти.', 'Среднее двух чисел является равноудалённой точкой между ними.'], en: ['Find the arithmetic mean of fifty-seven and sixty-five.', 'The mean of two numbers is the point that is equally far from both of them.'] }, on_correct: { uz: "To'g'ri. Oltmish bir teng masofali nuqta.", ru: 'Верно. Шестьдесят один является равноудалённой точкой.', en: 'Correct. Sixty-one is the point that is equally far from both numbers.' }, on_wrong: { uz: "Ikki songacha bo'lgan masofalarni solishtiring.", ru: 'Сравни расстояния до обоих чисел.', en: 'Compare the distances to both numbers.' } },
  },
  s12: {
    eyebrow: { uz: "Mashq · 5/6", ru: 'Тренировка · 5/6' , en: "Practice · 5/6"},
    title: { uz: "Bitning xatosini tuzating", ru: 'Исправь ошибку Бита' , en: "Correct Bit's mistake"},
    question: { uz: "To'rtta natijaning o'rtacha arifmetigini qaysi hisob topadi?", ru: 'Какое вычисление находит среднее арифметическое четырёх результатов?', en: 'Which calculation finds the arithmetic mean of four results?' },
    options: ['924 : 4 = 231', '924 : 3 = 308', '924 : 924 = 1'], correctIndex: 0,
    feedback: [
      { uz: "To'g'ri. To'rtta natija bor, shuning uchun yig'indi to'rtga bo'linadi.", ru: 'Верно. Результатов четыре, поэтому сумма делится на четыре.', en: 'Correct. There are four results, so the sum is divided by four.' },
      { uz: "Uchga bo'lish bitta natijani hisobdan chiqaradi. Qiymatlar soni to'rtta.", ru: 'Деление на три исключает один результат. Значений четыре.', en: 'Dividing by three leaves out one result. There are four values.' },
      { uz: "Yig'indini o'ziga bo'lish o'rtachani bermaydi. Bo'luvchi qiymatlar soni bo'lishi kerak.", ru: 'Деление суммы на саму себя не даёт среднего. Делитель должен быть количеством значений.', en: 'Dividing the sum by itself does not give the mean. The divisor must be the number of values.' },
    ],
    audio: { intro: { uz: ["Bit to'rtta natija bo'lsa ham, yig'indini uchga bo'ldi.", "Qiymatlar sonini qayta sanang."], ru: ['Бит разделил сумму на три, хотя результатов четыре.', 'Ещё раз пересчитай количество значений.'], en: ['Bit divided the sum by three even though there are four results.', 'Count the number of values again.'] }, on_correct: { uz: "To'g'ri. To'rtta natija hisobga olindi.", ru: 'Верно. Учтены все четыре результата.', en: 'Correct. All four results have been included.' }, on_wrong: { uz: "Bo'luvchi qiymatlar soniga teng bo'lishi kerak.", ru: 'Делитель должен быть равен количеству значений.', en: 'The divisor must equal the number of values.' } },
  },
  s13: {
    eyebrow: { uz: "Mashq · 6/6", ru: 'Тренировка · 6/6' , en: "Practice · 6/6"},
    title: { uz: "Yo'lovchilarning o'rtacha soni", ru: 'Среднее число пассажиров', en: 'Mean number of passengers' },
    question: { uz: "Bir kundagi o'rtacha yo'lovchilar soni nechta?", ru: 'Каково среднее число пассажиров за один день?', en: 'What is the mean number of passengers per day?' },
    options: ['141', '423', '140'], correctIndex: 0,
    feedback: [
      { uz: "To'g'ri. To'rt yuz yigirma uchni uch kunga bo'lsak, bir yuz qirq bir chiqadi.", ru: 'Верно. Четыреста двадцать три разделить на три дня равно ста сорока одному.', en: 'Correct. Four hundred and twenty-three divided by three days is one hundred and forty-one.' },
      { uz: "To'rt yuz yigirma uch uch kunlik jami, bir kunlik o'rtacha emas. Uni uchga bo'lish kerak.", ru: 'Четыреста двадцать три — итог за три дня, а не среднее за день. Его нужно разделить на три.', en: 'Four hundred and twenty-three is the total for three days, not the mean for one day. Divide it by three.' },
      { uz: "Bir yuz qirq ro'yxatdagi qiymat, lekin uch kunning tenglashtirilgan o'rtachasi emas.", ru: 'Сто сорок есть в списке, но это не выровненное среднее трёх дней.', en: 'One hundred and forty is in the list, but it is not the equalised mean for the three days.' },
    ],
    audio: { intro: { uz: ["Uch kunda bir yuz o'ttiz olti, bir yuz qirq va bir yuz qirq yettita yo'lovchi qayd etildi.", "Uch kunlik jami to'rt yuz yigirma uch.", "Bir kundagi o'rtacha sonni toping."], ru: ['За три дня зарегистрировали сто тридцать шесть, сто сорок и сто сорок семь пассажиров.', 'Общее количество за три дня равно четырёмстам двадцати трём.', 'Найди среднее количество за один день.'], en: ['The passenger counts for three days were one hundred and thirty-six, one hundred and forty, and one hundred and forty-seven.', 'The total for the three days is four hundred and twenty-three.', 'Find the mean number for one day.'] }, on_correct: { uz: "To'g'ri. Bir kunlik o'rtacha bir yuz qirq bir.", ru: 'Верно. Среднее за один день равно ста сорока одному.', en: 'Correct. The mean for one day is one hundred and forty-one.' }, on_wrong: { uz: "Uch kunlik yig'indini uchga bo'ling.", ru: 'Раздели сумму за три дня на три.', en: 'Divide the total for the three days by three.' } },
  },
  s14: {
    eyebrow: { uz: "Yakun", ru: 'Итог' , en: "Summary"},
    title: { uz: "O'rtacha arifmetik nimani bildiradi?", ru: 'Что показывает среднее арифметическое?', en: 'What does the arithmetic mean represent?' },
    audio: {
      uz: ["O'rtacha arifmetik bir nechta qiymatni bitta tenglashtirilgan qiymat bilan ifodalaydi.", "Barcha qiymatlarni qo'shamiz.", "Nechta qiymat borligini sanaymiz.", "Yig'indini qiymatlar soniga bo'lamiz.", "Keyingi darsda takrorlanadigan matematik bog'lanishlarni harflar yordamida qisqa yozishni o'rganamiz."],
      ru: ['Среднее арифметическое выражает несколько значений одним выровненным значением.', 'Складываем все значения.', 'Считаем количество значений.', 'Делим сумму на количество значений.', 'На следующем уроке научимся кратко записывать повторяющиеся математические связи с помощью букв.'],
      en: ['The arithmetic mean represents several values with one equalised value.', 'We add all the values.', 'We count how many values there are.', 'We divide the sum by the number of values.', 'In the next lesson, we will learn to use letters to write repeated mathematical relationships concisely.'],
    },
  },
};
const ORDERED_CONTENT = SCREEN_FLOW.map((sourceIndex) => CONTENT[`s${sourceIndex}`]);

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
  };
  return <span className="screen-type">{labels[type] ? t(labels[type]) : type}</span>;
};

const FeedbackBlock = ({ show, correct, children }) => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!show) { const frame = requestAnimationFrame(() => setOpen(false)); return () => cancelAnimationFrame(frame); }
    let second = 0; const first = requestAnimationFrame(() => { second = requestAnimationFrame(() => setOpen(true)); });
    return () => { cancelAnimationFrame(first); cancelAnimationFrame(second); };
  }, [show]);
  return <div role="status" aria-hidden={!show} className={`feedback ${correct ? 'correct' : 'wrong'} ${open ? 'open' : ''}`}><b>{correct ? '✓' : '↻'}</b><p>{show ? children : ''}</p></div>;
};

const Stage = ({ screen, audio, onPrev, onNext, finish = false, children }) => {
  const t = useT(); const mobile = useIsMobile(); const pad = mobile ? 14 : 48; const c = ORDERED_CONTENT[screen]; const meta = SCREEN_META[screen];
  return <main className={`stage stage-${meta.type}`}><header className="stage-header" style={{ paddingLeft: pad, paddingRight: pad }}><div className="progress-track" aria-label={`${screen + 1} / ${TOTAL_SCREENS}`}><div className="progress-fill progress-bar" style={{ width: `${(screen + 1) / TOTAL_SCREENS * 100}%` }}/></div><div className="stage-chrome"><div className="chrome-title"><span className="status-dot"/><span>{t(c.eyebrow)}</span></div><div className="chrome-actions"><ScreenTypeLabel type={meta.type}/>{audio && <AudioIndicator audio={audio}/>}<span className="screen-count">{String(screen + 1).padStart(2, '0')} / {TOTAL_SCREENS}</span></div></div></header><section className="stage-content" style={{ paddingLeft: pad, paddingRight: pad }}>{meta.type === 'summary' && <div className="summary-happy-bit"><BitSVG state="happy" /></div>}{children}{audio?.caption && (audio.muted || audio.visualOnly) && <div className="caption">{audio.caption}</div>}</section><footer className="stage-nav" style={{ paddingLeft: pad, paddingRight: pad }}>{screen === 0 ? <span/> : <button type="button" className="btn-ghost" onClick={onPrev}>← {t({ uz: "Orqaga", ru: 'Назад' , en: "Back"})}</button>}<button type="button" className="btn-white-accent" onClick={onNext}>{finish ? t({ uz: "Darsni yakunlash", ru: 'Завершить урок' , en: "Finish lesson"}) : t({ uz: "Davom etish", ru: 'Продолжить' , en: "Continue"})} →</button></footer></main>;
};

const Heading = ({ c }) => { const t = useT(); return <div className="heading"><div><span>{t(c.eyebrow)}</span><h1>{t(c.title)}</h1></div><BitSVG state="happy" className="primary-happy-bit"/></div>; };
const Options = ({ values, picked, onPick, correctIndex, solved, neutral = false }) => { const t = useT(); return <div className="options">{values.map((value, index) => <button type="button" key={`${index}-${t(value)}`} className={`option ${picked === index ? 'picked' : ''} ${!neutral && solved && index === correctIndex ? 'right' : ''} ${!neutral && picked === index && picked !== correctIndex ? 'bad' : ''}`} onClick={() => onPick(index)}><b>{String.fromCharCode(65 + index)}</b><span>{t(value)}</span></button>)}</div>; };

const ResultBars = ({ values, target = null, frame = 0, name }) => {
  const equalized = target !== null && frame >= 3;
  return <div className="bars-wrap"><div className="bars-title">{name}</div><div className="bars">{values.map((value, index) => <div className="bar-col" key={`${value}-${index}`}><div className={`bar ${equalized ? 'equalized' : ''}`} style={{ height: `${(equalized ? target : value) * 8}px` }}><b>{equalized ? target : value}</b></div></div>)}</div>{target !== null && frame >= 2 && <div className="target-line" style={{ bottom: `${target * 8 + 30}px` }}><span>{target} m</span></div>}</div>;
};

const FormulaFlow = ({ items, frame }) => <div className="formula-flow">{items.map((item, index) => <React.Fragment key={item}><div className={`formula-chip ${frame >= index ? 'show' : ''}`}>{item}</div>{index < items.length - 1 && <i className={frame >= index + 1 ? 'show' : ''}>→</i>}</React.Fragment>)}</div>;

function ChoiceExercise({ screen, storedAnswer, onAnswer, onNext, onPrev, visual = null }) {
  const t = useT(); const c = ORDERED_CONTENT[screen]; const audio = useNarration(c.audio, screen);
  const [picked, setPicked] = useState(storedAnswer?.studentAnswerIndex ?? null); const [solved, setSolved] = useState(storedAnswer?.correct === true); const attempts = useRef(storedAnswer?.attempts ?? 0); const clean = useRef(storedAnswer?.firstTry ?? true);
  const pick = (index) => { if (solved) return; attempts.current += 1; const ok = index === c.correctIndex; if (!ok) clean.current = false; setPicked(index); setSolved(ok); playSfx(ok ? 'correct' : 'wrong'); audio.pushOneOff(t(ok ? c.audio.on_correct : c.audio.on_wrong)); onAnswer({ screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question), options: c.options.map(t), correctIndex: c.correctIndex, correctAnswer: t(c.options[c.correctIndex]), studentAnswerIndex: index, studentAnswer: t(c.options[index]), correct: ok, firstTry: ok && clean.current && attempts.current === 1, attempts: attempts.current, solved: ok }); };
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} bit={screen === 12 ? 'awkward' : null}/>{visual}<section className="question"><h2>{t(c.question)}</h2><Options values={c.options} picked={picked} onPick={pick} correctIndex={c.correctIndex} solved={solved}/><FeedbackBlock show={picked !== null} correct={solved}>{picked !== null ? t(c.feedback[picked]) : ''}</FeedbackBlock></section></div></Stage>;
}

function NumericExercise({ screen, storedAnswer, onAnswer, onNext, onPrev, proof }) {
  const t = useT(); const c = ORDERED_CONTENT[screen]; const audio = useNarration(c.audio, screen); const [value, setValue] = useState(storedAnswer?.studentAnswer ?? ''); const [solved, setSolved] = useState(storedAnswer?.correct === true); const [message, setMessage] = useState(null); const attempts = useRef(storedAnswer?.attempts ?? 0); const clean = useRef(storedAnswer?.firstTry ?? true);
  const submit = () => { const answer = String(value).replace(/\D/g, ''); if (!answer || solved) return; attempts.current += 1; const ok = answer === c.answer; if (!ok) clean.current = false; setSolved(ok); const text = ok ? c.audio.on_correct : c.audio.on_wrong; setMessage(text); playSfx(ok ? 'correct' : 'wrong'); audio.pushOneOff(t(text)); onAnswer({ screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question), correctAnswer: c.answer, studentAnswer: answer, correct: ok, firstTry: ok && clean.current && attempts.current === 1, attempts: attempts.current, solved: ok }); };
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c}/><section className="question"><h2>{t(c.question)}</h2><div className="input-row"><input className={`answer-input ${message ? solved ? 'is-correct' : 'is-wrong' : ''}`} inputMode="numeric" placeholder="0" value={value} disabled={solved} onChange={(event) => { setValue(event.target.value.replace(/\D/g, '').slice(0, 5)); setMessage(null); }} onKeyDown={(event) => event.key === 'Enter' && submit()}/><button type="button" className="btn-white-accent compact" onClick={submit} disabled={!value || solved}>{t({ uz: "Tekshirish", ru: 'Проверить' , en: "Check"})}</button></div><FeedbackBlock show={message !== null} correct={solved}>{message ? t(message) : ''}</FeedbackBlock>{solved && <div className="proof">{proof}</div>}</section></div></Stage>;
}

function Screen0({ screen, onNext }) {
  const t = useT(); const c = CONTENT.s0; const audio = useNarration(c.audio, screen); const [picked, setPicked] = useState(null);
  return <Stage screen={screen} audio={audio} onNext={onNext}><div className="stack"><Heading c={c} bit="think"/><section className="duel"><ResultBars values={[9,14,9,15,13]} name="Anvar"/><ResultBars values={[10,15,11,10,9]} name="Ulug'bek"/><div className="best"><span>15 m</span><b>=</b><span>15 m</span></div></section><section className="question"><h2>{t(c.question)}</h2><Options values={c.options} picked={picked} onPick={setPicked} neutral/><FeedbackBlock show={picked !== null} correct>{t(c.neutral)}</FeedbackBlock></section></div></Stage>;
}

function Screen1({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s1; const audio = useNarration(c.audio, screen);
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c}/><section className="model-card"><ResultBars values={[9,14,9,15,13]} target={12} frame={audio.frame} name="Anvar"/><div className={`sum-badge ${audio.frame >= 1 ? 'show' : ''}`}>9 + 14 + 9 + 15 + 13 = 60 m</div><div className={`mean-badge ${audio.frame >= 4 ? 'show' : ''}`}>{t({ uz: "O'rtacha: 12 m", ru: 'Среднее: 12 м', en: 'Mean: 12 m' })}</div></section></div></Stage>;
}

function Screen2({ screen, onNext, onPrev }) { const c = CONTENT.s2; const audio = useNarration(c.audio, screen); return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c}/><section className="model-card"><FormulaFlow frame={audio.frame} items={['9 + 14 + 9 + 15 + 13', '60', '5', '60 : 5 = 12']}/></section></div></Stage>; }

function Screen3({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s3; const audio = useNarration(c.audio, screen);
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c}/><section className="why-grid"><div className={audio.frame >= 0 ? 'active' : ''}><s>60 : 4</s><small>{t({ uz: "1 urinish yo'qoldi", ru: '1 попытка потеряна', en: '1 attempt left out' })}</small></div><div className={audio.frame >= 2 ? 'active correct-tile' : ''}><b>60 : 5 = 12</b><small>{t({ uz: "5 ta qiymat", ru: '5 значений', en: '5 values' })}</small></div></section></div></Stage>;
}

function Screen4({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s4; const audio = useNarration(c.audio, screen);
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c}/><section className="model-card"><ResultBars values={[10,15,11,10,9]} target={11} frame={Math.min(3, audio.frame)} name="Ulug'bek"/><div className={`sum-badge ${audio.frame >= 1 ? 'show' : ''}`}>10 + 15 + 11 + 10 + 9 = 55 m</div><div className={`mean-badge ${audio.frame >= 3 ? 'show' : ''}`}>{t({ uz: "O'rtacha: 11 m", ru: 'Среднее: 11 м', en: 'Mean: 11 m' })}</div></section></div></Stage>;
}

function Screen5({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s5; const audio = useNarration(c.audio, screen);
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c}/><section className="compare-card"><div className={audio.frame >= 0 ? 'show' : ''}><span>Anvar</span><b>12 m</b></div><i>−</i><div className={audio.frame >= 0 ? 'show' : ''}><span>Ulug'bek</span><b>11 m</b></div><strong className={audio.frame >= 1 ? 'show' : ''}>1 m</strong><p className={audio.frame >= 2 ? 'show' : ''}>{t({ uz: "O'rtacha natija bo'yicha Anvar g'olib", ru: 'По среднему результату побеждает Анвар', en: 'Anvar wins based on the mean result' })}</p></section></div></Stage>;
}

function Screen6({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s6; const audio = useNarration(c.audio, screen); const rules = [{ uz: "Barcha sonlarni qo'shing", ru: 'Сложи все числа', en: 'Add all the numbers' }, { uz: "Qiymatlar sonini sanang", ru: 'Посчитай значения', en: 'Count the values' }, { uz: "Yig'indini qiymatlar soniga bo'ling", ru: 'Раздели сумму на количество', en: 'Divide the sum by the number of values' }];
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c}/><section className="rule-card"><div className="rule-formula">{t({ uz: "O'rtacha arifmetik = sonlar yig'indisi : qiymatlar soni", ru: 'Среднее арифметическое = сумма чисел : количество значений', en: 'Arithmetic mean = sum of the numbers ÷ number of values' })}</div><div className="rule-steps">{rules.map((rule,index)=><div className={audio.frame >= index ? 'show active' : ''} key={t(rule)}><b>{index+1}</b><span>{t(rule)}</span></div>)}</div></section></div></Stage>;
}

function Screen7({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s7; const audio = useNarration(c.audio, screen);
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c}/><section className="boundary"><div className="number-line"><span style={{left:'5%'}}>3</span><span style={{left:'28%'}}>5</span><b className={audio.frame >= 2 ? 'show' : ''} style={{left:'40%'}}>6</b><span style={{left:'90%'}}>10</span></div><FormulaFlow frame={audio.frame} items={['3 + 5 + 10', '18', '18 : 3', '6']}/><p className={audio.frame >= 3 ? 'show' : ''}>{t({ uz: "6 soni dastlabki ro'yxatda yo'q", ru: 'Числа 6 нет в исходном списке', en: '6 is not in the original list' })}</p></section></div></Stage>;
}

function Screen8(props) { return <ChoiceExercise {...props} visual={<div className="data-row"><span>12</span><span>17</span><span>18</span><span>20</span><span>28</span></div>}/>; }

function Screen9({ screen, storedAnswer, onAnswer, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s9; const audio = useNarration(c.audio, screen); const [order, setOrder] = useState(storedAnswer?.correct ? [0,1,2] : []); const [message, setMessage] = useState(null); const attempts = useRef(storedAnswer?.attempts ?? 0); const clean = useRef(storedAnswer?.firstTry ?? true); const solved = order.length === 3 && order.every((value,index)=>value===index);
  const choose = (index) => { if (solved || order.includes(index)) return; const next=[...order,index]; setOrder(next); if(next.length===3){ attempts.current+=1; const ok=next.every((value,place)=>value===place); if(!ok) clean.current=false; const text=ok?c.audio.on_correct:c.audio.on_wrong; setMessage(text); playSfx(ok?'correct':'wrong'); audio.pushOneOff(t(text)); onAnswer({screenIdx:screen,stage:SCREEN_META[screen].scope,question:t(c.question),correctAnswer:'0,1,2',studentAnswer:next.join(','),correct:ok,firstTry:ok&&clean.current&&attempts.current===1,attempts:attempts.current,solved:ok}); } };
  const reset=()=>{if(!solved){setOrder([]);setMessage(null);}};
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c}/><section className="question"><h2>{t(c.question)}</h2><div className="order-area"><div className="order-result">{order.map((index,place)=><div key={`${index}-${place}`}><b>{place+1}</b>{t(c.cards[index])}</div>)}</div><div className="card-bank">{c.cards.map((card,index)=><button type="button" key={t(card)} onClick={()=>choose(index)} disabled={order.includes(index)||solved}>{t(card)}</button>)}</div>{order.length>0&&!solved&&<button type="button" className="tiny-action" onClick={reset}>{t({uz:"Qayta tuzish",ru:'Собрать заново',en:'Start again'})}</button>}</div><FeedbackBlock show={message!==null} correct={solved}>{message?t(message):''}</FeedbackBlock></section></div></Stage>;
}

function Screen10(props) { return <NumericExercise {...props} proof="28 + 36 + 19 + 41 = 124; 124 : 4 = 31"/>; }
function Screen11(props) { return <ChoiceExercise {...props} visual={<div className="line-choice"><span>57</span><i/><b>61</b><i/><span>65</span></div>}/>; }
function Screen12(props) { return <ChoiceExercise {...props} visual={<div className="bit-error"><span>224</span><span>200</span><span>270</span><span>230</span><b>924 : <s>3</s> = 308</b></div>}/>; }
function Screen13(props) { return <ChoiceExercise {...props} visual={<div className="passengers"><div><span>1</span><b>136</b></div><div><span>2</span><b>140</b></div><div><span>3</span><b>147</b></div><strong>423 : 3 = ?</strong></div>}/>; }

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

const FINAL_AWARDS = [
  { ru: 'Архитектор среднего', uz: "O'rtacha qiymat me'mori", en: 'Mean Architect' },
  { ru: 'Мастер выравнивания', uz: 'Tenglashtirish ustasi', en: 'Equalising Master' },
  { ru: 'Исследователь среднего', uz: "O'rtacha tadqiqotchisi", en: 'Mean Explorer' },
];

const FinaleReward = ({ answers = [], complete, audio }) => {
  const scored = SCREEN_META.map((item, index) => item.scored ? index : null).filter((index) => index !== null);
  const total = scored.length;
  const firstTry = scored.filter((index) => answers[index]?.firstTry === true).length;
  const award = firstTry === total ? FINAL_AWARDS[0] : firstTry >= Math.max(1, total - 1) ? FINAL_AWARDS[1] : FINAL_AWARDS[2];
  return <G4FinalTitleReward finalFrameReached={complete} completed={audio?.completed} muted={audio?.muted} title={award} firstTry={firstTry} total={total} />;
};

function Screen14({ screen, answers, onPrev, finishLesson }) {
  const t = useT(); const c = CONTENT.s14; const audio = useNarration(c.audio, screen); const frame = audio.frame; const complete = frame >= 4;
  const rules = [
    { uz: "Bir nechta qiymatni bitta tenglashtirilgan qiymat bilan ifodalaymiz", ru: 'Несколько значений выражаем одним выровненным значением', en: 'Represent several values with one equalised value' },
    { uz: "Barcha qiymatlarni qo'shamiz", ru: 'Складываем все значения', en: 'Add all the values' },
    { uz: "Qiymatlar sonini sanaymiz", ru: 'Считаем количество значений', en: 'Count the number of values' },
    { uz: "Yig'indini qiymatlar soniga bo'lamiz", ru: 'Делим сумму на количество значений', en: 'Divide the sum by the number of values' },
  ];
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={finishLesson} finish><div className="stack"><section className="finale-heading"><span>◆ {t({ uz: "YAKUNIY BOSQICH", ru: 'ФИНАЛЬНЫЙ ЭТАП' , en: "FINAL STAGE"})}</span><h1>{t(c.title)}</h1><p>{t({ uz: "Boshlang'ich uloqtirishlar missiyasini tenglashtirilgan natijalar bilan yakunlaymiz.", ru: 'Завершаем стартовую миссию с бросками выровненными результатами.', en: 'We complete the starting throwing mission with equalised results.' })}</p></section><section className="finale-main"><div className="finale-payoff finale-bars"><small>{t({ uz: "BOSHLANG'ICH MISSIYA YECHIMI", ru: 'РЕШЕНИЕ СТАРТОВОЙ МИССИИ', en: 'STARTING MISSION SOLUTION' })}</small><ResultBars values={[9,14,9,15,13]} target={12} frame={frame} name="Anvar"/><div className={`finale-mean-formula ${frame >= 1 ? 'show' : ''}`}>(9 + 14 + 9 + 15 + 13) : 5 = {t({ uz: "12 m", ru: '12 м', en: '12 m' })}</div><div className={`finale-comparison ${frame >= 3 ? 'show' : ''}`}><span>Anvar <b>{t({ uz: "12 m", ru: '12 м', en: '12 m' })}</b></span><span>Ulug'bek <b>{t({ uz: "11 m", ru: '11 м', en: '11 m' })}</b></span><strong>{t({ uz: "Anvar +1 m", ru: 'Анвар +1 м', en: 'Anvar +1 m' })}</strong></div></div><div className="finale-takeaways">{rules.map((rule, index) => <div className={`finale-takeaway ${frame >= index ? 'show' : ''}`} key={t(rule)}><b>{index + 1}</b><span>{t(rule)}</span></div>)}</div></section><section className="finale-bottom"><div className={`finale-bridge ${complete ? 'show' : ''}`}><small>{t({ uz: "KEYINGI MAVZU", ru: 'СЛЕДУЮЩАЯ ТЕМА' , en: "NEXT TOPIC"})}</small><strong>{t({ uz: "Takrorlanadigan matematik bog'lanishlarni harflar bilan yozish", ru: 'Запись повторяющихся математических связей с помощью букв', en: 'Using letters to write repeated mathematical relationships' })}</strong></div><FinaleReward answers={answers} complete={complete} audio={audio}/></section></div></Stage>;
}

const BASE_SCREENS=[Screen0,Screen1,Screen2,Screen3,Screen4,Screen5,Screen6,Screen7,Screen8,Screen9,Screen10,Screen11,Screen12,Screen13,Screen14];
const SCREENS=SCREEN_FLOW.map((sourceIndex)=>BASE_SCREENS[sourceIndex]);

export default function Grade4Dars15({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished, previewMode }) {
  const preview=previewMode??(langProp===undefined||langProp===null); const [previewLang,setPreviewLang]=useState(normalizeLang(langProp)); const lang=preview?previewLang:normalizeLang(langProp);
  configureLesson({ttsApiBase:ttsApiBase||'',voiceGender:voiceGender||'f',correctSoundUrl:correctSoundUrl||'',wrongSoundUrl:wrongSoundUrl||'',previewMode:preview});
  const [current,setCurrent]=useState(0); const [answers,setAnswers]=useState([]);
  // eslint-disable-next-line react-hooks/purity -- lesson duration starts when this component mounts
  const started=useRef(Date.now()); const finished=useRef(false);
  const recordAnswer=useCallback((answer)=>setAnswers((previous)=>{const next=[...previous];const old=previous[answer.screenIdx];next[answer.screenIdx]={...answer,firstTry:old?.firstTry===false?false:answer.firstTry};return next;}),[]);
  const finishLesson=useCallback(()=>{if(finished.current)return;finished.current=true;const scored=SCREEN_META.map((meta,index)=>meta.scored?index:null).filter((index)=>index!==null);const firstTryCorrect=scored.filter((index)=>answers[index]?.firstTry===true).length;const payload={lessonId:LESSON_META.lessonId,lessonTitle:LESSON_META.lessonTitle[lang],studentName:studentName||null,durationSec:Math.floor((Date.now()-started.current)/1000),totalQuestions:scored.length,correctAnswers:firstTryCorrect,scorePercent:Math.round(firstTryCorrect/scored.length*100),finalScore:firstTryCorrect,finalTotal:scored.length,passed:firstTryCorrect/scored.length>=0.6,firstTryStats:{total:scored.length,firstTryCorrect},attemptsTotal:scored.reduce((sum,index)=>sum+(answers[index]?.attempts??0),0),skillTags:LESSON_META.skillTags,answers:answers.filter(Boolean)};if(onFinished)onFinished(payload);else console.log('[Grade4 Dars15 preview]',payload);},[answers,lang,onFinished,studentName]);
  const Current=SCREENS[current];
  return <LangContext.Provider value={lang}><style>{STYLES}</style><div className={`lesson-root ${preview?'lesson-root-preview':''}`}>{preview&&<div className="preview-language" aria-label={{ uz: 'Dars tili', ru: 'Язык урока', en: 'Lesson language' }[lang]}>{SUPPORTED_LANGS.map((code)=><button type="button" key={code} className={previewLang===code?'preview-active':''} onClick={()=>setPreviewLang(code)}>{code.toUpperCase()}</button>)}</div>}<Current key={current} screen={current} storedAnswer={answers[current]} answers={answers} onAnswer={recordAnswer} onPrev={()=>setCurrent((value)=>Math.max(0,value-1))} onNext={()=>setCurrent((value)=>Math.min(TOTAL_SCREENS-1,value+1))} finishLesson={finishLesson}/></div></LangContext.Provider>;
}

const STYLES=`
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
@media(prefers-reduced-motion:reduce){.g4-title-card,.g4-title-card-bit,.g4-title-reveal-overlay,.g4-title-reveal-rays,.g4-title-reveal-medal,.g4-title-reveal-title{animation:none!important}.g4-title-card{opacity:1;transform:none!important}.g4-title-card-confetti,.g4-title-reveal-confetti{display:none}.g4-title-reveal-overlay{opacity:1}.g4-title-reveal-rays{opacity:.28;transform:translate(-50%,-50%)}.g4-title-reveal-medal{opacity:1;transform:translate(-50%,-50%)}.g4-title-reveal-title{opacity:1;transform:translateX(-50%)}}
html:has(.lesson-root),body:has(.lesson-root),#root:has(.lesson-root),.lesson-page:has(.lesson-root),.lesson-frame:has(.lesson-root){width:100%;height:100%;min-height:0!important;margin:0;overflow:hidden!important;overscroll-behavior:none}
.lesson-root,.lesson-root *{box-sizing:border-box}.lesson-root h1,.lesson-root h2,.lesson-root h3,.lesson-root h4,.lesson-root h5,.lesson-root h6,.lesson-root p,.lesson-root ul,.lesson-root ol{margin:0}.lesson-root button,.lesson-root input{font:inherit}.lesson-root button:focus-visible,.lesson-root input:focus-visible{outline:3px solid ${T.cyan};outline-offset:3px}
.lesson-root{position:fixed;inset:0;width:100%;min-height:100dvh;color:${T.ink};background:radial-gradient(circle at 88% 9%,rgba(22,143,163,.11),transparent 25%),linear-gradient(145deg,#F7F8F4,#EEF3F1);font-family:'Manrope',system-ui,sans-serif}
.stage{width:min(936px,100%);height:100dvh;margin:0 auto;display:flex;flex-direction:column;overflow:hidden}.stage-header{flex-shrink:0;padding-top:10px;padding-bottom:8px;background:rgba(247,248,244,.88);backdrop-filter:blur(14px);z-index:5}.progress-track{width:100%;height:6px;margin-bottom:10px;border-radius:999px;background:rgba(80,97,109,.16);overflow:hidden}.progress-fill{height:100%;border-radius:inherit;background:linear-gradient(90deg,${T.cyan},${T.accent});box-shadow:0 0 12px rgba(255,91,53,.42);transition:width .45s ease}.stage-chrome{min-width:0;display:flex;justify-content:space-between;align-items:center;gap:12px}.chrome-title,.chrome-actions,.audio-controls{display:flex;align-items:center;gap:9px}.chrome-title{min-width:0;overflow:hidden;color:${T.ink2};font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}.chrome-title>span:last-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.chrome-actions{flex:none}.status-dot{width:8px;height:8px;flex:none;border-radius:50%;background:${T.accent};box-shadow:0 0 10px rgba(255,91,53,.65)}.screen-type{padding:4px 8px;border-radius:999px;color:${T.cyan};background:${T.cyanSoft};font-size:10px;font-weight:800}.screen-count{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700}.icon-btn{width:32px;height:32px;padding:0;border:0;border-radius:10px;color:${T.ink2};background:rgba(255,255,255,.75);cursor:pointer;box-shadow:0 4px 12px -7px rgba(${T.shadowBase},.3)}
.stage-content{flex:1 1 auto;min-height:0;padding-top:10px;padding-bottom:12px;overflow:visible}.stage-nav{flex:0 0 auto;min-height:64px;display:flex;align-items:center;justify-content:space-between;gap:12px;background:rgba(245,245,240,.95)}.btn-white-accent,.btn-ghost{min-width:128px;min-height:48px;padding:0 18px;border:0;border-radius:15px;cursor:pointer;font-weight:900}.btn-white-accent{color:${T.accent};background:#fff;box-shadow:0 12px 24px -17px rgba(255,91,53,.8)}.btn-white-accent:hover:not(:disabled){color:#fff;background:${T.accent}}.btn-white-accent:disabled{opacity:.42;cursor:not-allowed}.btn-ghost{color:${T.ink2};background:transparent}.btn-ghost:hover{background:#fff;box-shadow:0 10px 20px -16px rgba(${T.shadowBase},.5)}.compact{min-width:118px}.stack{display:grid;gap:12px;animation:page-in .45s cubic-bezier(.16,1,.3,1) both}.heading{min-height:72px;display:flex;align-items:center;justify-content:space-between;gap:16px}.heading>div{min-width:0}.heading>div>span{color:${T.cyan};font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.heading h1{margin-top:4px!important;font:750 clamp(25px,4vw,38px)/1.06 'Source Serif 4',Georgia,serif;overflow-wrap:anywhere}.heading .g1-char{width:68px;height:84px;flex:0 0 auto;overflow:visible;filter:drop-shadow(0 9px 11px rgba(23,59,82,.2))}.question,.model-card,.duel,.why-grid,.compare-card,.rule-card,.boundary,.summary-grid{padding:16px;border-radius:22px;background:rgba(255,255,255,.9);box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.48)}.question{display:grid;gap:10px}.question h2{font:720 clamp(17px,2.5vw,22px)/1.25 'Source Serif 4',Georgia,serif}.options{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}.option{min-width:0;min-height:58px;padding:9px;border:0;border-radius:16px;display:grid;grid-template-columns:28px minmax(0,1fr);align-items:center;gap:8px;color:${T.ink};background:#F8F8F4;text-align:left;cursor:pointer;box-shadow:0 10px 22px -20px rgba(${T.shadowBase},.46)}.option span{min-width:0;overflow-wrap:anywhere}.option>b{width:27px;height:27px;border-radius:9px;display:grid;place-items:center;color:${T.cyan};background:${T.cyanSoft};font:900 11px 'JetBrains Mono',monospace}.option.picked{transform:translateY(-2px);background:${T.accentSoft};box-shadow:inset 0 0 0 2px rgba(255,91,53,.27)}.option.right{background:${T.successSoft};box-shadow:inset 0 0 0 2px rgba(34,122,83,.25)}.option.bad{background:${T.warnSoft};box-shadow:inset 0 0 0 2px rgba(169,111,19,.25)}.feedback{min-height:54px;padding:9px 12px;border-radius:15px;visibility:hidden;display:grid;grid-template-columns:28px minmax(0,1fr);gap:9px;align-items:start;opacity:0;transform:translateY(6px)}.feedback.open{visibility:visible;opacity:1;transform:none;transition:.3s ease}.feedback.correct{background:${T.successSoft};box-shadow:inset 4px 0 ${T.success}}.feedback.wrong{background:${T.warnSoft};box-shadow:inset 4px 0 ${T.warn}}.feedback>b{font-size:18px}.feedback p{min-width:0;font-size:13px;line-height:1.4;overflow-wrap:anywhere}.caption{position:static;margin-top:10px;padding:8px 12px;border-radius:13px;color:#fff;background:rgba(23,59,82,.94);font-size:12px;line-height:1.4;z-index:3}.stage-summary .stage-content{position:relative}.summary-happy-bit{position:absolute;right:14px;top:4px;width:58px;height:72px;z-index:2}.stage-summary .finale-heading{padding-right:78px}
.duel{display:grid;grid-template-columns:1fr 1fr;gap:12px;position:relative}.duel .best{grid-column:1/-1;display:flex;justify-content:center;align-items:center;gap:14px;color:${T.navy};font:900 18px 'JetBrains Mono',monospace}.duel .best b{color:${T.accent}}.bars-wrap{min-height:190px;position:relative;padding:12px 8px 8px}.bars-title{text-align:center;color:${T.navy};font-weight:900}.bars{height:150px;display:flex;align-items:flex-end;justify-content:center;gap:7px;border-bottom:2px solid rgba(23,59,82,.18)}.bar-col{width:min(42px,16%);height:140px;display:flex;align-items:flex-end}.bar{width:100%;min-height:22px;border-radius:10px 10px 4px 4px;display:grid;place-items:start center;padding-top:5px;color:#fff;background:linear-gradient(180deg,${T.cyan},${T.navy});transition:height .9s cubic-bezier(.16,1,.3,1)}.bar.equalized{background:linear-gradient(180deg,${T.lime},${T.success})}.bar b{font:900 11px 'JetBrains Mono',monospace}.target-line{position:absolute;left:7%;right:7%;height:2px;background:${T.accent};transition:.5s ease}.target-line span{position:absolute;right:0;bottom:5px;color:${T.accent};font:900 11px 'JetBrains Mono',monospace}.sum-badge.show,.mean-badge.show,.bridge.show,.show{opacity:1!important;transform:none!important}.sum-badge,.mean-badge{margin-top:8px;padding:10px 13px;border-radius:13px;opacity:.12;color:${T.navy};background:${T.cyanSoft};text-align:center;font:900 15px 'JetBrains Mono',monospace;transition:.4s ease}.mean-badge{color:${T.success};background:${T.successSoft}}.formula-flow{min-height:190px;display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap}.formula-chip{padding:13px 15px;border-radius:15px;opacity:.12;transform:translateY(8px);color:${T.navy};background:${T.cyanSoft};font:900 clamp(15px,2.3vw,20px) 'JetBrains Mono',monospace;transition:.45s ease}.formula-flow i{opacity:.12;color:${T.accent};font:900 22px 'JetBrains Mono',monospace;font-style:normal;transition:.35s ease}.why-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.why-grid>div{min-height:170px;padding:18px;border-radius:18px;display:grid;place-items:center;gap:8px;opacity:.32;background:#F8F8F4}.why-grid>div.active{opacity:1}.why-grid s,.why-grid b{font:900 25px 'JetBrains Mono',monospace}.why-grid s{color:${T.warn}}.why-grid small{color:${T.ink2}}.why-grid .correct-tile{background:${T.successSoft};color:${T.success}}.compare-card{min-height:230px;display:grid;grid-template-columns:1fr 30px 1fr;align-items:center;gap:10px;text-align:center}.compare-card>div{padding:18px;border-radius:18px;display:grid;gap:8px;opacity:.12;background:${T.cyanSoft}}.compare-card span{color:${T.ink2};font-weight:800}.compare-card b{color:${T.navy};font:900 28px 'JetBrains Mono',monospace}.compare-card i{color:${T.accent};font-style:normal;font-weight:900}.compare-card>strong,.compare-card>p{grid-column:1/-1;opacity:.12}.compare-card>strong{color:${T.success};font:900 22px 'JetBrains Mono',monospace}.compare-card>p{font-weight:850}.rule-card{display:grid;gap:14px}.rule-formula{padding:16px;border-radius:16px;color:#fff;background:${T.navy};text-align:center;font:800 clamp(14px,2.3vw,19px) 'JetBrains Mono',monospace}.rule-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.rule-steps>div{min-height:90px;padding:11px;border-radius:15px;display:grid;grid-template-columns:30px 1fr;align-items:center;gap:8px;opacity:.18;background:#F8F8F4}.rule-steps>div.active{background:${T.accentSoft};box-shadow:inset 0 0 0 2px rgba(255,91,53,.2)}.rule-steps b{width:28px;height:28px;border-radius:9px;display:grid;place-items:center;color:#fff;background:${T.accent};font:900 11px 'JetBrains Mono',monospace}.rule-steps span{font-size:12px;font-weight:800;line-height:1.35}.boundary{display:grid;gap:18px}.number-line{height:80px;position:relative;margin:15px 4%;border-top:4px solid ${T.navy}}.number-line span,.number-line b{position:absolute;top:-19px;transform:translateX(-50%);width:38px;height:38px;border-radius:50%;display:grid;place-items:center;background:#fff;box-shadow:0 8px 18px -12px rgba(${T.shadowBase},.6);font:900 13px 'JetBrains Mono',monospace}.number-line b{opacity:.12;color:#fff;background:${T.accent}}.boundary>p{opacity:.12;color:${T.success};text-align:center;font-weight:850}.data-row{padding:14px;display:flex;justify-content:center;gap:8px}.data-row span{padding:12px 14px;border-radius:13px;color:${T.navy};background:${T.cyanSoft};font:900 17px 'JetBrains Mono',monospace}.input-row{display:flex;gap:10px}.answer-input{min-width:0;min-height:54px;flex:1;padding:10px 16px;border:0;border-radius:15px;outline:0;color:${T.navy};background:#F8F8F4;box-shadow:inset 0 0 0 2px rgba(135,148,157,.2);font:900 20px 'JetBrains Mono',monospace}.answer-input:focus{box-shadow:0 0 0 4px rgba(22,143,163,.14)}.answer-input.is-correct{background:${T.successSoft};box-shadow:inset 0 0 0 2px rgba(34,122,83,.3)}.answer-input.is-wrong{background:${T.warnSoft};box-shadow:inset 0 0 0 2px rgba(169,111,19,.3)}.proof{padding:12px;border-radius:14px;color:${T.success};background:${T.successSoft};text-align:center;font:900 15px 'JetBrains Mono',monospace}.order-area{display:grid;gap:11px}.order-result{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;min-height:76px}.order-result>div{padding:10px;border-radius:14px;display:grid;grid-template-columns:25px 1fr;align-items:center;gap:7px;background:${T.cyanSoft};font-size:11px;font-weight:800}.order-result b{width:24px;height:24px;border-radius:8px;display:grid;place-items:center;color:#fff;background:${T.cyan}}.card-bank{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}.card-bank button,.tiny-action{min-height:46px;padding:8px 12px;border:0;border-radius:13px;cursor:pointer;background:#F8F8F4;box-shadow:0 8px 18px -16px rgba(${T.shadowBase},.5);font-size:12px;font-weight:800}.card-bank button:disabled{opacity:.35}.tiny-action{justify-self:end;color:${T.accent};background:${T.accentSoft}}.line-choice{padding:22px;display:flex;align-items:center;justify-content:center;gap:0}.line-choice span,.line-choice b{width:48px;height:48px;border-radius:50%;display:grid;place-items:center;color:${T.navy};background:${T.cyanSoft};font:900 15px 'JetBrains Mono',monospace}.line-choice b{color:#fff;background:${T.accent}}.line-choice i{width:90px;height:4px;background:linear-gradient(90deg,${T.cyan},${T.accent})}.bit-error{padding:14px;display:grid;grid-template-columns:repeat(4,1fr);gap:7px}.bit-error span{padding:9px;border-radius:12px;background:${T.cyanSoft};text-align:center;font:900 14px 'JetBrains Mono',monospace}.bit-error b{grid-column:1/-1;padding:12px;border-radius:13px;color:${T.warn};background:${T.warnSoft};text-align:center;font:900 17px 'JetBrains Mono',monospace}.passengers{padding:14px;display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.passengers>div{padding:12px;border-radius:15px;display:grid;gap:6px;text-align:center;background:${T.cyanSoft}}.passengers span{color:${T.ink3};font-size:11px}.passengers b{color:${T.navy};font:900 18px 'JetBrains Mono',monospace}.passengers strong{grid-column:1/-1;padding:11px;border-radius:13px;color:#fff;background:${T.navy};text-align:center;font:900 16px 'JetBrains Mono',monospace}.summary-grid{display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:12px}.summary-formula{padding:16px;border-radius:16px;color:#fff;background:${T.navy};font:900 clamp(15px,2.4vw,20px) 'JetBrains Mono',monospace;text-align:center}.summary-rules{grid-template-columns:repeat(4,1fr)}.bridge{padding:13px 16px;border-radius:16px;display:grid;gap:4px;opacity:.15;color:#fff;background:${T.navy}}.bridge span{color:#9DE3E7;font-size:10px;font-weight:900;letter-spacing:.08em}.bridge strong{font:750 16px 'Source Serif 4',Georgia,serif}.preview-language{position:fixed;top:9px;right:9px;z-index:30;display:flex;gap:3px;padding:3px;border-radius:999px;background:rgba(255,255,255,.94);box-shadow:0 8px 20px -14px rgba(${T.shadowBase},.6)}.preview-language button{padding:4px 9px;border:0;border-radius:999px;color:${T.ink2};background:transparent;cursor:pointer;font-size:10px;font-weight:900}.preview-language .preview-active{color:#FFFFFF;background:${T.accent}}.g1-bit-ant{transform-origin:60px 28px;animation:antenna 2.1s ease-in-out infinite}.g1-bit-wave,.bit-wave-left,.bit-wave-right,.bit-think-hand,.bit-point-arm,.bit-nod-hand{transform-origin:84px 76px;animation:think 1.7s ease-in-out infinite}.bit-double-wave,.bit-awkward-hands,.bit-focus-hands{transform-origin:center;animation:happy 1.2s ease-in-out infinite alternate}.bit-idea-bulb,.bit-point-target,.bit-focus-scan,.bit-nod-check{animation:pulse 1.35s ease-in-out infinite alternate}
.finale-heading{min-width:0;padding:11px 15px;border-radius:17px;background:linear-gradient(100deg,rgba(255,91,53,.09),transparent 52%),rgba(255,255,255,.92);box-shadow:0 13px 28px -24px rgba(255,91,53,.72)}.finale-heading>span{display:flex;align-items:center;gap:6px;color:${T.accent};font:900 9px/1.2 'JetBrains Mono',monospace;letter-spacing:.12em}.finale-heading h1{margin-top:4px!important;color:${T.navy};font:750 clamp(21px,3vw,28px)/1.08 'Source Serif 4',Georgia,serif}.finale-heading p{margin-top:4px!important;color:${T.ink2};font-size:11px;line-height:1.35}
.finale-main{min-width:0;display:grid;grid-template-columns:minmax(260px,.92fr) minmax(300px,1.08fr);align-items:stretch;gap:10px}.finale-payoff{min-width:0;padding:11px 13px;border-radius:18px;display:grid;align-content:center;gap:7px;background:#fff;box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.5)}.finale-payoff>small{color:${T.cyan};font-size:9px;font-weight:900;letter-spacing:.09em}.finale-bars .bars-wrap{min-height:148px;padding:0 4px}.finale-bars .bars{height:128px}.finale-bars .bar-col{height:122px}.finale-bars .bars-title{font-size:11px}.finale-mean-formula{min-width:0;padding:7px 9px;border-radius:11px;opacity:.14;transform:translateY(5px);color:${T.navy};background:${T.cyanSoft};text-align:center;font:900 10px/1.25 'JetBrains Mono',monospace;transition:.42s ease}.finale-comparison{min-width:0;display:grid;grid-template-columns:1fr 1fr auto;align-items:center;gap:5px;opacity:.14;transform:translateY(5px);transition:.42s ease}.finale-comparison span,.finale-comparison strong{min-width:0;padding:6px;border-radius:9px;text-align:center;font:850 9px/1.2 'JetBrains Mono',monospace}.finale-comparison span{color:${T.ink2};background:#F8F8F4}.finale-comparison span b{color:${T.navy}}.finale-comparison strong{color:${T.success};background:${T.successSoft}}
.finale-takeaways{min-width:0;display:grid;gap:6px}.finale-takeaway{min-width:0;min-height:40px;padding:7px 10px;border-radius:12px;display:grid;grid-template-columns:27px minmax(0,1fr);align-items:center;gap:8px;opacity:.14;transform:translateY(6px);background:#F8F8F4;transition:opacity .42s ease,transform .42s ease,background .42s ease}.finale-takeaway.show{opacity:1;transform:none;background:${T.cyanSoft}}.finale-takeaway b{width:26px;height:26px;border-radius:9px;display:grid;place-items:center;color:#fff;background:${T.cyan};font:900 9px/1 'JetBrains Mono',monospace}.finale-takeaway span{min-width:0;color:${T.ink2};font-size:11px;font-weight:800;line-height:1.3;overflow-wrap:anywhere}
.finale-bottom{min-width:0;display:grid;grid-template-columns:minmax(0,1.2fr) minmax(270px,.8fr);gap:10px}.finale-bridge{min-width:0;padding:12px 15px;border-radius:16px;display:grid;align-content:center;gap:4px;opacity:.14;transform:translateY(6px);color:#fff;background:${T.navy};transition:.42s ease}.finale-bridge.show{opacity:1;transform:none}.finale-bridge small{color:#98E1E5;font-size:9px;font-weight:900;letter-spacing:.1em}.finale-bridge strong{font:750 15px/1.3 'Source Serif 4',Georgia,serif}
.finale-reward{min-width:0;min-height:100px;position:relative;overflow:hidden;padding:12px 72px 11px 58px;border-radius:17px;display:grid;align-content:center;color:#fff;background:linear-gradient(135deg,#234B62,${T.navy});box-shadow:0 17px 34px -27px rgba(${T.shadowBase},.74);transition:filter .45s ease,box-shadow .45s ease}.finale-reward:not(.complete){filter:saturate(.72)}.finale-reward.complete{box-shadow:0 17px 36px -22px rgba(149,201,61,.72)}.finale-medal{position:absolute;left:11px;top:50%;width:38px;height:38px;border:3px solid rgba(255,255,255,.72);border-radius:50%;display:grid;place-items:center;transform:translateY(-50%);color:${T.navy};background:${T.lime};font-size:17px;font-weight:900}.finale-reward-copy{min-width:0;display:grid;gap:3px}.finale-reward-copy>small{color:#98E1E5;font-size:8px;font-weight:900;letter-spacing:.09em}.finale-reward-copy>strong{font:750 15px/1.15 'Source Serif 4',Georgia,serif}.finale-status{min-width:0;display:flex;align-items:center;gap:6px}.finale-status b{flex:none;color:#FFE284;font:900 11px/1 'JetBrains Mono',monospace}.finale-status span{min-width:0;color:rgba(255,255,255,.72);font-size:8px;line-height:1.2}.finale-reward-bit{position:absolute;right:2px;bottom:-4px;width:68px;height:86px}.finale-reward-bit .g1-char{width:100%;height:100%}.finale-reward.complete .finale-reward-bit{animation:happy 2.8s ease-in-out infinite alternate}.finale-confetti{position:absolute;inset:0;pointer-events:none}.finale-confetti i{position:absolute;top:-12px;width:5px;height:9px;border-radius:2px;background:#FFC23C;animation:finaleFall 2.8s linear infinite}.finale-confetti i:nth-child(2n){background:${T.accent}}.finale-confetti i:nth-child(3n){background:#77E1EA}.finale-confetti i:nth-child(1){left:9%;animation-delay:-.2s}.finale-confetti i:nth-child(2){left:22%;animation-delay:-1.1s}.finale-confetti i:nth-child(3){left:35%;animation-delay:-.7s}.finale-confetti i:nth-child(4){left:48%;animation-delay:-1.8s}.finale-confetti i:nth-child(5){left:61%;animation-delay:-.4s}.finale-confetti i:nth-child(6){left:73%;animation-delay:-1.4s}.finale-confetti i:nth-child(7){left:84%;animation-delay:-.9s}.finale-confetti i:nth-child(8){left:93%;animation-delay:-2s}@keyframes finaleFall{to{transform:translateY(118px) rotate(180deg)}}
@keyframes page-in{from{opacity:0;transform:translateY(10px)}}@keyframes antenna{50%{transform:rotate(5deg)}}@keyframes think{50%{transform:rotate(-5deg) translateY(-2px)}}@keyframes happy{to{transform:translateY(-3px)}}@keyframes pulse{to{transform:scale(1.06)}}
@media(max-width:639.98px){.stage-header{padding-top:60px}.screen-type{display:none}.stage{width:min(390px,100%)}.heading{min-height:68px}.heading h1{font-size:26px}.heading .g1-char{width:66px;height:82px}.question,.model-card,.duel,.why-grid,.compare-card,.rule-card,.boundary,.summary-grid{padding:13px;border-radius:18px}.options{grid-template-columns:1fr}.option{min-height:52px}.duel,.summary-grid{grid-template-columns:1fr}.bars-wrap{min-height:166px}.bars{height:126px}.bar-col{height:118px}.bar{transform:scaleY(.82);transform-origin:bottom}.why-grid{grid-template-columns:1fr}.compare-card{grid-template-columns:1fr 24px 1fr}.rule-steps,.summary-rules{grid-template-columns:1fr}.rule-steps>div{min-height:55px}.formula-flow{min-height:145px}.order-result{grid-template-columns:1fr}.input-row{flex-direction:column}.stage-nav{min-height:68px}.btn-white-accent,.btn-ghost{min-width:112px;padding:0 12px}.passengers{grid-template-columns:1fr 1fr 1fr}}
@media(max-width:639.98px){.stage-hook .stack{gap:10px}.stage-hook .duel{grid-template-columns:1fr 1fr;gap:8px}.stage-hook .duel .bars-wrap{min-height:125px;padding:2px 2px 0}.stage-hook .duel .bars{height:106px;gap:4px}.stage-hook .duel .bar-col{height:100px}.stage-hook .duel .best{gap:8px;font-size:14px}}
@media(prefers-reduced-motion:reduce){.lesson-root *,.lesson-root *::before,.lesson-root *::after{scroll-behavior:auto!important;animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important}.formula-chip,.formula-flow i,.sum-badge,.mean-badge,.compare-card>div,.compare-card>strong,.compare-card>p,.boundary>p,.number-line b,.bridge{opacity:1!important;transform:none!important}}
@media(max-width:639.98px){.finale-heading{padding:9px 11px}.finale-heading h1{font-size:21px}.finale-heading p{font-size:9px}.finale-main,.finale-bottom{grid-template-columns:1fr}.finale-payoff{padding:9px 11px}.finale-bars .bars-wrap{min-height:135px}.finale-bars .bars{height:115px}.finale-bars .bar-col{height:110px}.finale-comparison{grid-template-columns:1fr 1fr}.finale-comparison strong{grid-column:1/-1}.finale-takeaway{min-height:38px;padding:6px 8px}.finale-reward{min-height:92px;padding:10px 62px 9px 51px}.finale-medal{left:9px;width:34px;height:34px}.finale-reward-bit{width:58px;height:74px}.finale-reward-copy>strong{font-size:14px}}
@media(max-width:639.98px){.stage-summary .stack{gap:9px}.stage-summary .finale-heading{padding:7px 9px}.stage-summary .finale-heading p{font-size:8.5px;line-height:1.25}.stage-summary .finale-main,.stage-summary .finale-bottom{gap:8px}.stage-summary .finale-payoff{padding:7px 9px;gap:5px}.stage-summary .finale-bars .bars-wrap{min-height:105px}.stage-summary .finale-bars .bars{height:88px}.stage-summary .finale-bars .bar-col{height:84px}.stage-summary .finale-bars .bar{transform:scaleY(.68)}.stage-summary .finale-mean-formula{padding:5px 7px}.stage-summary .finale-comparison{gap:4px}.stage-summary .finale-comparison span,.stage-summary .finale-comparison strong{padding:4px}.stage-summary .finale-takeaways{gap:4px}.stage-summary .finale-takeaway{min-height:34px;padding:4px 7px;grid-template-columns:25px minmax(0,1fr);gap:6px}.stage-summary .finale-takeaway b{width:24px;height:24px}.stage-summary .finale-takeaway span{font-size:10px;line-height:1.22}.stage-summary .finale-bridge{padding:8px 11px}.stage-summary .finale-bridge strong{font-size:13px}.stage-summary .finale-reward{min-height:80px;padding:8px 56px 7px 47px}.stage-summary .finale-medal{left:8px;width:30px;height:30px}.stage-summary .finale-reward-bit{width:52px;height:66px}.stage-summary .finale-reward-copy>strong{font-size:13px}.stage-summary .finale-status span{font-size:7.5px}}
@media(max-width:639.98px){.stage-content{padding-top:7px;padding-bottom:7px}.heading{min-height:60px}.heading .g1-char{width:54px;height:68px}.stack{gap:8px}.input-row{flex-direction:row}.feedback{min-height:50px;padding:7px 9px}.stage-nav{min-height:58px}.stage-summary .finale-heading{padding-right:68px}.summary-happy-bit{right:9px;width:52px;height:66px}}
@media(prefers-reduced-motion:reduce){.finale-takeaway,.finale-mean-formula,.finale-comparison,.finale-bridge{opacity:1!important;transform:none!important}}
`;
