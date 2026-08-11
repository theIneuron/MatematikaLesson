import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// 4-sinf · Dars 29 · Yuza birliklari
// 15 ekran · 50 asosiy audio beat · barcha interaction ixtiyoriy, navigatsiya ochiq.
const T = {
  bg: '#F5F5F0', ink: '#12212C', ink2: '#50616D', ink3: '#87949D', paper: '#FFFFFF',
  accent: '#FF5B35', accentSoft: '#FFF0EA', cyan: '#168FA3', cyanSoft: '#E5F5F6',
  navy: '#173B52', lime: '#95C93D', success: '#227A53', successSoft: '#E7F3EC',
  warn: '#A96F13', warnSoft: '#FFF5D9', shadowBase: '58, 53, 48',
};
const FRAME_COUNTS = [3, 4, 4, 4, 4, 4, 4, 5, 2, 2, 2, 2, 2, 3, 5];
const TOTAL_SCREENS = FRAME_COUNTS.length;
const LESSON_META = { lessonId: 'measure-4-29-v1', slug: 'dars29-yuza-birliklari', lessonTitle: { uz: 'Yuza birliklari', ru: 'Единицы площади', en: 'Area units' }, skillTags: ['area-units', 'square-units', 'scale-factor', 'measurement-choice'] };
const SCREEN_META = [
  { id: 's0', type: 'hook', template: 'MCScreen', scored: false, scope: 'hook' },
  { id: 's1', type: 'exploration', template: 'custom', scored: false, scope: null },
  { id: 's2', type: 'exploration', template: 'custom', scored: false, scope: null },
  { id: 's3', type: 'exploration', template: 'custom', scored: false, scope: null },
  { id: 's4', type: 'exploration', template: 'custom', scored: false, scope: null },
  { id: 's5', type: 'exploration', template: 'custom', scored: false, scope: null },
  { id: 's6', type: 'exploration', template: 'custom', scored: false, scope: null },
  { id: 's7', type: 'rule', template: 'custom', scored: false, scope: null },
  { id: 's8', type: 'test', template: 'MCScreen', scored: true, scope: 'module-mikro' },
  { id: 's9', type: 'test', template: 'MCScreen', scored: true, scope: 'module-mikro' },
  { id: 's10', type: 'test', template: 'MCScreen', scored: true, scope: 'module-mikro' },
  { id: 's11', type: 'test', template: 'MCScreen', scored: true, scope: 'module-mikro' },
  { id: 's12', type: 'test', template: 'MCScreen', scored: true, scope: 'module-mikro' },
  { id: 's13', type: 'case', template: 'MCScreen', scored: true, scope: 'module-mikro' },
  { id: 's14', type: 'summary', template: 'custom', scored: false, scope: null },
];
const bi = (uz, ru, en) => ({ uz, ru, en });
const CONTENT = {
  s0: {
    eyebrow: bi('Quyosh paneli', 'Солнечная панель', "Solar panel"), title: bi("Tomoni 1 dm bo'lgan kvadrat nechta cm²?", 'Сколько см² в квадрате со стороной 1 дм?', "How many cm² are in a square with a side length of 1 dm?"), scene: 'panel', closedSet: true,
    frames: [bi('Tomon: 1 dm', 'Сторона: 1 дм', "Side: 1 dm"), bi('1 dm = 10 cm', '1 дм = 10 см', "1 dm = 10 cm"), bi('1 dm²: 10, 100 yoki 1 000 cm²?', '1 дм²: 10, 100 или 1 000 см²?', "1 dm²: 10, 100 or 1 000 cm²?")],
    question: bi("Bit 10 cm² dedi. Sizning taxminingiz?", 'Бит сказал 10 см². Какова твоя гипотеза?', "Bit said 10 cm². What is your estimate?"), options: [bi('10 cm²', '10 см²', "10 cm²"), bi('100 cm²', '100 см²', "100 cm²"), bi('1 000 cm²', '1 000 см²', "1 000 cm²")], neutral: bi("Taxmin saqlandi. Kvadrat birliklarni kataklar bilan tekshiramiz.", 'Гипотеза сохранена. Проверим квадратные единицы по клеткам.', "Estimate saved. We will check the square units using a grid."),
    audio: { intro: { uz: ["Quyosh panelining har bir tomoni bir detsimetr.", "Bit bir detsimetr o'n santimetr bo'lgani uchun yuza ham o'n kvadrat santimetr dedi.", "Panelga nechta santimetrli kvadrat sig'ishini taxmin qiling. Javobni keyin katakli modelda tekshiramiz."], ru: ['Каждая сторона солнечной панели равна одному дециметру.', 'Бит решил, что раз один дециметр равен десяти сантиметрам, то площадь равна десяти квадратным сантиметрам.', 'Предположи, сколько сантиметровых квадратов поместится на панели. Позже проверим ответ на клетчатой модели.'], en: ["Each side of the solar panel is one decimetre.","Bit said the area was ten square centimetres because one decimetre equals ten centimetres.","Estimate how many squares with sides of one centimetre fit on the panel. We will check the answer later using a grid model."] } },
  },
  s1: {
    eyebrow: bi('Uzunlik va yuza', 'Длина и площадь', "Length and area"), title: bi("Chiziq boshqa, sirt boshqa", 'Линия и поверхность измеряются по-разному', "A line and a surface are measured differently"), scene: 'dimension',
    frames: [bi('Kesma uzunligi: 5 cm', 'Длина отрезка: 5 см', "Line segment length: 5 cm"), bi("Tomoni 1 cm bo'lgan kvadrat", 'Квадрат со стороной 1 см', "A square with a side length of 1 cm"), bi('Uning yuzasi: 1 cm²', 'Его площадь: 1 см²', "Its area: 1 cm²"), bi('cm — uzunlik; cm² — yuza', 'см — длина; см² — площадь', "cm — length; cm² — area")],
    audio: { uz: ["Besh santimetrli kesma bitta yo'nalishdagi uzunlikni bildiradi.", "Endi tomoni bir santimetr bo'lgan kvadratni ko'ramiz.", "Bu kvadratning yuzasi bir kvadrat santimetr.", "Santimetr uzunlik birligi, kvadrat santimetr esa yuza birligi. Ularni aralashtirmang."], ru: ['Отрезок длиной пять сантиметров показывает длину в одном направлении.', 'Теперь рассмотрим квадрат со стороной один сантиметр.', 'Площадь этого квадрата равна одному квадратному сантиметру.', 'Сантиметр является единицей длины, а квадратный сантиметр единицей площади. Не смешивай их.'], en: ["A line segment five centimetres long shows length in one direction.","Now look at a square with sides of one centimetre.","The area of this square is one square centimetre.","A centimetre is a unit of length, while a square centimetre is a unit of area. Do not mix them up."] },
  },
  s2: {
    eyebrow: bi('Birlik kvadrat', 'Единичный квадрат', "Unit square"), title: bi("Bir kvadrat birlik nimani bildiradi?", 'Что означает одна квадратная единица?', "What does one square unit mean?"), scene: 'unit',
    frames: [bi('1 mm × 1 mm = 1 mm²', '1 мм × 1 мм = 1 мм²', "1 mm × 1 mm = 1 mm²"), bi('1 cm × 1 cm = 1 cm²', '1 см × 1 см = 1 см²', "1 cm × 1 cm = 1 cm²"), bi('Birlik nomi tomon birligidan olinadi', 'Название берется от единицы стороны', "The unit name comes from the side's unit"), bi("Yuza — nechta birlik kvadrat sig'ishi", 'Площадь — сколько единичных квадратов помещается', "Area — how many unit squares fit")],
    audio: { uz: ["Bir millimetrni bir millimetrga ko'paytirib, bir kvadrat millimetr yuzani olamiz.", "Bir santimetrni bir santimetrga ko'paytirib, bir kvadrat santimetr yuzani olamiz.", "Kvadrat birlikning nomi uning tomoni qaysi birlikda o'lchanganidan keladi.", "Yuzani topish sirtga nechta shunday birlik kvadrat sig'ishini aniqlashdir."], ru: ['Один миллиметр умножаем на один миллиметр и получаем один квадратный миллиметр площади.', 'Один сантиметр умножаем на один сантиметр и получаем один квадратный сантиметр площади.', 'Название квадратной единицы зависит от единицы, которой измерена ее сторона.', 'Найти площадь означает определить, сколько таких единичных квадратов помещается на поверхности.'], en: ["One millimetre times one millimetre gives an area of one square millimetre.","One centimetre times one centimetre gives an area of one square centimetre.","The name of a square unit comes from the unit used to measure its side.","Finding an area means working out how many such unit squares fit on the surface."] },
  },
  s3: {
    eyebrow: bi("Kattalashtirib ko'ramiz", 'Рассмотрим крупнее', "Let's zoom in"), title: bi('1 cm² ichida nechta mm²?', 'Сколько мм² внутри 1 см²?', "How many mm² are in 1 cm²?"), scene: 'zoom-mm',
    frames: [bi('1 cm = 10 mm', '1 см = 10 мм', "1 cm = 10 mm"), bi('Har qatorda 10 ta mm²', 'В каждом ряду 10 мм²', "10 mm² in each row"), bi('Shunday 10 ta qator', 'Таких рядов 10', "10 such rows"), bi('1 cm² = 100 mm²', '1 см² = 100 мм²', "1 cm² = 100 mm²")],
    audio: { uz: ["Bir santimetrli tomon o'nta millimetrga bo'linadi.", "Kvadratning har bir qatorida o'nta kvadrat millimetr joylashadi.", "Bunday qatorlarning o'zi ham o'nta.", "O'nni o'nga ko'paytiramiz. Bir kvadrat santimetr yuz kvadrat millimetrga teng."], ru: ['Сторона длиной один сантиметр делится на десять миллиметров.', 'В каждом ряду квадрата помещается десять квадратных миллиметров.', 'Таких рядов тоже десять.', 'Умножаем десять на десять. Один квадратный сантиметр равен ста квадратным миллиметрам.'], en: ["A side one centimetre long is divided into ten millimetres.","Each row of the square contains ten square millimetres.","There are also ten such rows.","Multiply ten by ten. One square centimetre equals one hundred square millimetres."] },
  },
  s4: {
    eyebrow: bi('Detsimetrli model', 'Дециметровая модель', "Decimetre model"), title: bi('1 dm² ichida yuzta cm² bor', 'В 1 дм² сто см²', "There are one hundred cm² in 1 dm²"), scene: 'zoom-cm',
    frames: [bi('1 dm = 10 cm', '1 дм = 10 см', "1 dm = 10 cm"), bi('Bir qatorda 10 cm²', 'В одном ряду 10 см²', "10 cm² in one row"), bi('Shunday 10 qator', 'Таких рядов 10', "10 such rows"), bi('1 dm² = 100 cm²', '1 дм² = 100 см²', "1 dm² = 100 cm²")],
    audio: { uz: ["Bir detsimetrning har bir tomonida o'nta santimetr bor.", "Kvadratning bitta qatorida o'nta kvadrat santimetr joylashadi.", "Bunday qatorlarning o'zi ham o'nta.", "Jami yuzta kvadrat santimetr. Demak, bir kvadrat detsimetr yuz kvadrat santimetr."], ru: ['В каждой стороне одного дециметра десять сантиметров.', 'В одном ряду квадрата помещается десять квадратных сантиметров.', 'Таких рядов тоже десять.', 'Всего сто квадратных сантиметров. Значит, один квадратный дециметр равен ста квадратным сантиметрам.'], en: ["Each side of one decimetre contains ten centimetres.","One row of the square contains ten square centimetres.","There are also ten such rows.","That makes one hundred square centimetres. So one square decimetre equals one hundred square centimetres."] },
  },
  s5: {
    eyebrow: bi('Metrli kvadrat', 'Квадратный метр', "Square metre"), title: bi("Tomon o'n marta, yuza yuz marta", 'Сторона в десять раз, площадь в сто раз', "Side ten times as long, area one hundred times as large"), scene: 'meter',
    frames: [bi('Tomoni 1 m → yuza 1 m²', 'Сторона 1 м → площадь 1 м²', "Side 1 m → area 1 m²"), bi('1 m = 10 dm', '1 м = 10 дм', "1 m = 10 dm"), bi('1 m² = 100 dm²', '1 м² = 100 дм²', "1 m² = 100 dm²"), bi('1 m² = 10 000 cm²', '1 м² = 10 000 см²', "1 m² = 10 000 cm²")],
    audio: { uz: ["Tomoni bir metr bo'lgan kvadratning yuzasi bir kvadrat metr.", "Bir metr o'n detsimetrga teng.", "Kvadratning har tomonida o'nta detsimetr bor. O'nni o'nga ko'paytirib, yuz kvadrat detsimetr olamiz.", "Santimetrda har tomon yuzta bo'ladi. Yuzni yuzga ko'paytirib, o'n ming kvadrat santimetr olamiz."], ru: ['Площадь квадрата со стороной один метр равна одному квадратному метру.', 'Один метр равен десяти дециметрам.', 'В каждой стороне квадрата десять дециметров. Десять умножаем на десять и получаем сто квадратных дециметров.', 'В сантиметрах каждая сторона равна ста. Сто умножаем на сто и получаем десять тысяч квадратных сантиметров.'], en: ["The area of a square with sides of one metre is one square metre.","One metre equals ten decimetres.","Each side of the square contains ten decimetres. Multiply ten by ten to get one hundred square decimetres.","In centimetres, each side is one hundred. Multiply one hundred by one hundred to get ten thousand square centimetres."] },
  },
  s6: {
    eyebrow: bi('Masshtabni tanlash', 'Выбор масштаба', "Choosing the scale"), title: bi('Sirtga mos birlik va katta hudud', 'Единица по размеру поверхности', "Choose a unit to suit the surface"), scene: 'choice',
    frames: [bi('Mayda detal → mm² yoki cm²', 'Мелкая деталь → мм² или см²', "Small object → mm² or cm²"), bi('Stol yoki xona → dm² yoki m²', 'Стол или комната → дм² или м²', "Table or room → dm² or m²"), bi('Shahar hududi → km²', 'Территория города → км²', "City area → km²"), bi('1 km² = 1 000 000 m²', '1 км² = 1 000 000 м²', "1 km² = 1 000 000 m²")],
    audio: { uz: ["Mayda detal yuzasi uchun kvadrat millimetr yoki kvadrat santimetr mos.", "Stol yoki xona kabi sirtlar uchun kvadrat detsimetr yoki kvadrat metr qulay.", "Shahar kabi katta hududlar kvadrat kilometrda ifodalanadi.", "Bir kvadrat kilometr bir million kvadrat metrga teng."], ru: ['Для площади мелкой детали подходит квадратный миллиметр или квадратный сантиметр.', 'Для стола или комнаты удобен квадратный дециметр или квадратный метр.', 'Большие территории, например город, выражают в квадратных километрах.', 'Один квадратный километр равен одному миллиону квадратных метров.'], en: ["A square millimetre or square centimetre is suitable for the area of a small object.","A square decimetre or square metre is convenient for surfaces such as a table or a room.","Large areas such as cities are measured in square kilometres.","One square kilometre equals one million square metres."] },
  },
  s7: {
    eyebrow: bi('Munosabatlar xaritasi', 'Карта соотношений', "Map of relationships"), title: bi("Kvadrat birliklar orasidagi yo'l", 'Путь между квадратными единицами', "The path between square units"), scene: 'relations',
    frames: [bi('1 cm² = 100 mm²', '1 см² = 100 мм²', "1 cm² = 100 mm²"), bi('1 dm² = 100 cm²', '1 дм² = 100 см²', "1 dm² = 100 cm²"), bi('1 m² = 100 dm² = 10 000 cm²', '1 м² = 100 дм² = 10 000 см²', "1 m² = 100 dm² = 10 000 cm²"), bi('1 km² = 1 000 000 m²', '1 км² = 1 000 000 м²', "1 km² = 1 000 000 m²"), bi('Katta → kichik: × · kichik → katta: ÷', 'Крупная → мелкая: × · мелкая → крупная: ÷', "Larger → smaller: × · smaller → larger: ÷")],
    audio: { uz: ["Bir kvadrat santimetr yuz kvadrat millimetrga teng.", "Bir kvadrat detsimetr yuz kvadrat santimetrga teng.", "Bir kvadrat metr yuz kvadrat detsimetr yoki o'n ming kvadrat santimetr.", "Bir kvadrat kilometr bir million kvadrat metrga teng.", "Katta birlikdan kichik birlikka o'tishda tegishli omilga ko'paytiring. Kichikdan kattaga o'tishda shu omilga bo'ling."], ru: ['Один квадратный сантиметр равен ста квадратным миллиметрам.', 'Один квадратный дециметр равен ста квадратным сантиметрам.', 'Один квадратный метр равен ста квадратным дециметрам или десяти тысячам квадратных сантиметров.', 'Один квадратный километр равен одному миллиону квадратных метров.', 'При переходе от крупной единицы к мелкой умножай на нужный множитель. При переходе от мелкой к крупной дели на него.'], en: ["One square centimetre equals one hundred square millimetres.","One square decimetre equals one hundred square centimetres.","One square metre equals one hundred square decimetres or ten thousand square centimetres.","One square kilometre equals one million square metres.","When changing from a larger unit to a smaller unit, multiply by the correct factor. When changing from a smaller unit to a larger unit, divide by that factor."] },
  },
  s8: {
    eyebrow: bi('Mashq 1/6', 'Задание 1/6', "Task 1/6"), title: bi('cm² dan mm² ga', 'Из см² в мм²', "cm² to mm²"), scene: 'zoom-mm', closedSet: true, frames: [bi('3 cm² = ? mm²', '3 см² = ? мм²', "3 cm² = ? mm²"), bi('Har bir cm² ichida 100 mm²', 'В каждом см² по 100 мм²', "Each cm² contains 100 mm²")], question: bi('3 cm² necha mm²?', 'Сколько мм² в 3 см²?', "How many mm² are in 3 cm²?"), options: [bi('30 mm²', '30 мм²', "30 mm²"), bi('300 mm²', '300 мм²', "300 mm²"), bi('3000 mm²', '3000 мм²', "3000 mm²")], correctIndex: 1, proof: bi('3 × 100 = 300 mm²', '3 × 100 = 300 мм²', "3 × 100 = 300 mm²"),
    audio: { intro: { uz: ["Uch kvadrat santimetrni kvadrat millimetrga aylantiring.", "Har bir kvadrat santimetr ichidagi yuzta birlik kvadratni hisobga oling."], ru: ['Переведи три квадратных сантиметра в квадратные миллиметры.', 'Учти сто единичных квадратов внутри каждого квадратного сантиметра.'], en: ["Convert three square centimetres to square millimetres.","Remember the one hundred unit squares inside each square centimetre."] }, on_correct: bi("To'g'ri. Uchta yuzlik guruh jami uch yuz kvadrat millimetr.", 'Верно. Три группы по сто дают триста квадратных миллиметров.', "Correct. Three groups of one hundred make three hundred square millimetres."), on_wrong: [bi("Bu natija tomon uchun mos, yuza uchun emas. Faktor yuz.", 'Этот результат подходит для стороны, но не для площади. Множитель равен ста.', "This result fits a side length, not an area. The factor is one hundred."), bi("Javobni yana tekshiring.", 'Еще раз проверь ответ.', "Check your answer again."), bi("Bu yerda yana bir ortiqcha nol qo'shilgan.", 'Здесь добавлен один лишний ноль.', "One extra zero has been added here.")] }, feedbackAudio: [bi("Bu natija tomon uchun mos. Yuza uchun yuzga ko'paytiring.", 'Этот результат подходит для стороны. Для площади умножь на сто.', "This result fits a side length. For area, multiply by one hundred."), bi("To'g'ri. Uch kvadrat santimetr uch yuz kvadrat millimetr.", 'Верно. Три квадратных сантиметра равны тремстам квадратным миллиметрам.', "Correct. Three square centimetres equal three hundred square millimetres."), bi("Bu yerda ortiqcha nol bor.", 'Здесь добавлен лишний ноль.', "There is an extra zero here.")],
  },
  s9: {
    eyebrow: bi('Mashq 2/6', 'Задание 2/6', "Task 2/6"), title: bi('dm² dan cm² ga', 'Из дм² в см²', "dm² to cm²"), scene: 'zoom-cm', closedSet: true, frames: [bi('7 dm² = ? cm²', '7 дм² = ? см²', "7 dm² = ? cm²"), bi('Har bir dm² ichida 100 cm²', 'В каждом дм² по 100 см²', "Each dm² contains 100 cm²")], question: bi('7 dm² necha cm²?', 'Сколько см² в 7 дм²?', "How many cm² are in 7 dm²?"), options: [bi('70 cm²', '70 см²', "70 cm²"), bi('7000 cm²', '7000 см²', "7000 cm²"), bi('700 cm²', '700 см²', "700 cm²")], correctIndex: 2, proof: bi('7 × 100 = 700 cm²', '7 × 100 = 700 см²', "7 × 100 = 700 cm²"),
    audio: { intro: { uz: ["Yetti kvadrat detsimetrni kvadrat santimetrda yozing.", "Har bir kvadrat detsimetr ichidagi yuzta kvadrat santimetrni hisobga oling."], ru: ['Запиши семь квадратных дециметров в квадратных сантиметрах.', 'Учти сто квадратных сантиметров внутри каждого квадратного дециметра.'], en: ["Write seven square decimetres in square centimetres.","Remember the one hundred square centimetres inside each square decimetre."] }, on_correct: bi("To'g'ri. Yettita yuzlik guruh yetti yuz kvadrat santimetr.", 'Верно. Семь групп по сто дают семьсот квадратных сантиметров.', "Correct. Seven groups of one hundred make seven hundred square centimetres."), on_wrong: [bi("Yetmish chiziqli tomon omiliga mos. Yuzada yuzlik omil kerak.", 'Семьдесят соответствует линейному множителю. Для площади нужен множитель сто.', "Seventy uses the factor for a side length. Area needs a factor of one hundred."), bi("Bu javobda bitta ortiqcha nol bor.", 'В этом ответе один лишний ноль.', "This answer has one extra zero."), bi("Javobni yana tekshiring.", 'Еще раз проверь ответ.', "Check your answer again.")] }, feedbackAudio: [bi("Bu tomon omili. Yuza uchun yuzga ko'paytiring.", 'Это множитель для стороны. Для площади умножь на сто.', "This is the factor for a side length. For area, multiply by one hundred."), bi("Bu javobda ortiqcha nol bor.", 'В этом ответе лишний ноль.', "This answer has an extra zero."), bi("To'g'ri. Yetti kvadrat detsimetr yetti yuz kvadrat santimetr.", 'Верно. Семь квадратных дециметров равны семистам квадратным сантиметрам.', "Correct. Seven square decimetres equal seven hundred square centimetres.")],
  },
  s10: {
    eyebrow: bi('Mashq 3/6', 'Задание 3/6', "Task 3/6"), title: bi('m² dan dm² ga', 'Из м² в дм²', "m² to dm²"), scene: 'meter', closedSet: true, frames: [bi('2 m² = ? dm²', '2 м² = ? дм²', "2 m² = ? dm²"), bi('10 × 10 = 100', '10 × 10 = 100', "10 × 10 = 100")], question: bi('2 m² necha dm²?', 'Сколько дм² в 2 м²?', "How many dm² are in 2 m²?"), options: [bi('20 dm²', '20 дм²', "20 dm²"), bi('200 dm²', '200 дм²', "200 dm²"), bi('2000 dm²', '2000 дм²', "2000 dm²")], correctIndex: 1, proof: bi('2 × 100 = 200 dm²', '2 × 100 = 200 дм²', "2 × 100 = 200 dm²"),
    audio: { intro: { uz: ["Ikki kvadrat metrni kvadrat detsimetrga aylantiring.", "Yuzada tomon omili ikki yo'nalishda ishlashini tekshiring."], ru: ['Переведи два квадратных метра в квадратные дециметры.', 'Проверь, что множитель стороны действует в площади в двух направлениях.'], en: ["Convert two square metres to square decimetres.","Check that the factor for a side acts in two directions for area."] }, on_correct: bi("To'g'ri. Ikkita yuzlik guruh ikki yuz kvadrat detsimetr.", 'Верно. Две группы по сто дают двести квадратных дециметров.', "Correct. Two groups of one hundred make two hundred square decimetres."), on_wrong: [bi("Yigirma faqat bitta o'lchamni o'n marta o'zgartiradi. Yuza ikki o'lchamli.", 'Двадцать меняет только одно измерение в десять раз. Площадь двумерна.', "Twenty changes only one dimension by a factor of ten. Area has two dimensions."), bi("Javobni yana tekshiring.", 'Еще раз проверь ответ.', "Check your answer again."), bi("Bu javobda ortiqcha nol bor.", 'В этом ответе лишний ноль.', "This answer has an extra zero.")] }, feedbackAudio: [bi("Yuza ikki o'lchamli. O'nni o'nga ko'paytiring.", 'Площадь двумерна. Умножь десять на десять.', "Area has two dimensions. Multiply ten by ten."), bi("To'g'ri. Ikki kvadrat metr ikki yuz kvadrat detsimetr.", 'Верно. Два квадратных метра равны двумстам квадратным дециметрам.', "Correct. Two square metres equal two hundred square decimetres."), bi("Bu javobda ortiqcha nol bor.", 'В этом ответе лишний ноль.', "This answer has an extra zero.")],
  },
  s11: {
    eyebrow: bi('Mashq 4/6', 'Задание 4/6', "Task 4/6"), title: bi('Mos birlikni tanlang', 'Выбери подходящую единицу', "Choose the suitable unit"), scene: 'city', closedSet: true, frames: [bi('Shahar hududi', 'Территория города', "City area"), bi('Juda katta sirt uchun birlik tanlang', 'Выбери единицу для очень большой поверхности', "Choose a unit for a very large surface")], question: bi("Shahar hududini qaysi birlikda o'lchash qulay?", 'В какой единице удобно измерять территорию города?', "Which unit is suitable for measuring the area of a city?"), options: [bi('mm²', 'мм²', "mm²"), bi('m²', 'м²', "m²"), bi('km²', 'км²', "km²")], correctIndex: 2, proof: bi('Katta hudud → km²', 'Большая территория → км²', "Large area → km²"),
    audio: { intro: { uz: ["Shahar hududi uchun qulay yuza birligini tanlang.", "Birlikning kattaligi o'lchanayotgan juda katta sirtga mos bo'lishini tekshiring."], ru: ['Выбери удобную единицу площади для территории города.', 'Проверь, что размер единицы соответствует очень большой измеряемой поверхности.'], en: ["Choose a convenient unit of area for a city.","Check that the size of the unit suits the very large surface being measured."] }, on_correct: bi("To'g'ri. Juda katta hududlar kvadrat kilometrda ifodalanadi.", 'Верно. Очень большие территории выражают в квадратных километрах.', "Correct. Very large areas are measured in square kilometres."), on_wrong: [bi("Kvadrat millimetr juda kichik detallar uchun.", 'Квадратный миллиметр подходит для очень маленьких деталей.', "Square millimetres are suitable for very small objects."), bi("Kvadrat metr xona kabi sirtlar uchun qulay, ammo shahar uchun juda mayda.", 'Квадратный метр удобен для комнаты, но слишком мелок для города.', "Square metres are suitable for surfaces such as rooms, but are too small a unit for a city."), bi("Javobni yana tekshiring.", 'Еще раз проверь ответ.', "Check your answer again.")] }, feedbackAudio: [bi("Kvadrat millimetr juda kichik detallar uchun.", 'Квадратный миллиметр подходит для очень маленьких деталей.', "Square millimetres are suitable for very small objects."), bi("Kvadrat metr shahar uchun juda mayda birlik.", 'Квадратный метр слишком мелкая единица для города.', "A square metre is too small a unit for a city."), bi("To'g'ri. Shahar hududi kvadrat kilometrda o'lchanadi.", 'Верно. Территорию города измеряют в квадратных километрах.', "Correct. A city's area is measured in square kilometres.")],
  },
  s12: {
    eyebrow: bi('Mashq 5/6', 'Задание 5/6', "Task 5/6"), title: bi('Bitning xatosi', 'Ошибка Бита', "Bit's mistake"), scene: 'panel', closedSet: true, frames: [bi('Bit: 1 dm² = 10 cm²', 'Бит: 1 дм² = 10 см²', "Bit: 1 dm² = 10 cm²"), bi('10 qator va 10 ustunni tekshiring', 'Проверь 10 рядов и 10 столбцов', "Check 10 rows and 10 columns")], question: bi('Bit nimani unutdi?', 'Что забыл Бит?', "What did Bit forget?"), options: [bi("U faqat bir yo'nalishdagi 10 ni oldi", 'Он учел 10 только в одном направлении', "He used 10 in only one direction"), bi('1 dm = 100 cm', '1 дм = 100 см', "1 dm = 100 cm"), bi("Kvadratlarda birlik bo'lmaydi", 'У квадратов нет единиц', "Squares do not have units")], correctIndex: 0, proof: bi('10 × 10 = 100, demak 1 dm² = 100 cm²', '10 × 10 = 100, значит 1 дм² = 100 см²', "10 × 10 = 100, so 1 dm² = 100 cm²"),
    audio: { intro: { uz: ["Bit bir kvadrat detsimetrni o'n kvadrat santimetr deb yozdi. Uning aniq xatosini toping.", "O'nta qator bilan o'nta ustunni modelda alohida tekshiring."], ru: ['Бит записал один квадратный дециметр как десять квадратных сантиметров. Найди его точную ошибку.', 'Отдельно проверь по модели десять рядов и десять столбцов.'], en: ["Bit wrote one square decimetre as ten square centimetres. Find his exact mistake.","Use the model to check ten rows and ten columns separately."] }, on_correct: bi("To'g'ri. Bit faqat bitta yo'nalishdagi o'nta bo'lakni sanadi. O'nta qator va o'nta ustun yuzta katak beradi.", 'Верно. Бит посчитал десять частей только в одном направлении. Десять рядов и десять столбцов дают сто клеток.', "Correct. Bit counted ten parts in only one direction. Ten rows and ten columns make one hundred squares."), on_wrong: [bi("Javobni yana tekshiring.", 'Еще раз проверь ответ.', "Check your answer again."), bi("Bir detsimetr yuz emas, o'n santimetr.", 'Один дециметр равен не ста, а десяти сантиметрам.', "One decimetre is ten centimetres, not one hundred."), bi("Kvadrat birlik yuza o'lchovini bildiradi, shuning uchun birlik albatta yoziladi.", 'Квадратная единица измеряет площадь, поэтому единицу обязательно записывают.', "A square unit measures area, so the unit must be written.")] }, feedbackAudio: [bi("To'g'ri. Bit faqat bir yo'nalishdagi o'nni olgan.", 'Верно. Бит учел десять только в одном направлении.', "Correct. Bit used ten in only one direction."), bi("Bir detsimetr o'n santimetrga teng, yuzga emas.", 'Один дециметр равен десяти сантиметрам, а не ста.', "One decimetre equals ten centimetres, not one hundred."), bi("Kvadrat birlik yuza o'lchovini bildiradi va yozilishi shart.", 'Квадратная единица измеряет площадь, ее нужно указывать.', "A square unit measures area and must be written.")],
  },
  s13: {
    eyebrow: bi('Mashq 6/6', 'Задание 6/6', "Task 6/6"), title: bi('Panel yuzasi', 'Площадь панели', "Panel area"), scene: 'panel-case', closedSet: true, frames: [bi('Tomonlar: 2 m va 3 m', 'Стороны: 2 м и 3 м', "Sides: 2 m and 3 m"), bi('2 × 3 = 6 m²', '2 × 3 = 6 м²', "2 × 3 = 6 m²"), bi('Har m² = 100 dm²', 'Каждый м² = 100 дм²', "Each m² = 100 dm²")], question: bi('Panel yuzasi necha dm²?', 'Какова площадь панели в дм²?', "What is the panel's area in dm²?"), options: [bi('60 dm²', '60 дм²', "60 dm²"), bi('600 dm²', '600 дм²', "600 dm²"), bi('6000 dm²', '6000 дм²', "6000 dm²")], correctIndex: 1, proof: bi('2 × 3 = 6 m²; 6 × 100 = 600 dm²', '2 × 3 = 6 м²; 6 × 100 = 600 дм²', "2 × 3 = 6 m²; 6 × 100 = 600 dm²"),
    audio: { intro: { uz: ["Panelning tomonlari ikki metr va uch metr. Avval uning yuzasini kvadrat metrda toping.", "Keyin har bir kvadrat metrni yuzta kvadrat detsimetrga almashtiring.", "Ikki bosqichdagi birliklarni tekshirib, kvadrat detsimetrdagi javobni tanlang."], ru: ['Стороны панели равны двум и трем метрам. Сначала найди ее площадь в квадратных метрах.', 'Затем замени каждый квадратный метр ста квадратными дециметрами.', 'Проверь единицы на обоих шагах и выбери ответ в квадратных дециметрах.'], en: ["The sides of the panel are two metres and three metres. First find its area in square metres.","Then replace each square metre with one hundred square decimetres.","Check the units in both steps and choose the answer in square decimetres."] }, on_correct: bi("To'g'ri. Panel olti kvadrat metr, bu olti yuz kvadrat detsimetr.", 'Верно. Площадь панели шесть квадратных метров, или шестьсот квадратных дециметров.', "Correct. The panel's area is six square metres, or six hundred square decimetres."), on_wrong: [bi("Bu javob yuzani faqat o'n marta oshirgan. Faktor yuz.", 'Этот ответ увеличивает площадь только в десять раз. Нужен множитель сто.', "This answer multiplies the area by only ten. The factor is one hundred."), bi("Javobni yana tekshiring.", 'Еще раз проверь ответ.', "Check your answer again."), bi("Bu javobda bir ortiqcha nol bor.", 'В этом ответе один лишний ноль.', "This answer has one extra zero.")] }, feedbackAudio: [bi("Yuzani o'n emas, yuz marta oshiring.", 'Увеличь число площади не в десять, а в сто раз.', "Multiply the area by one hundred, not ten."), bi("To'g'ri. Panel yuzasi olti yuz kvadrat detsimetr.", 'Верно. Площадь панели равна шестистам квадратным дециметрам.', "Correct. The panel's area is six hundred square decimetres."), bi("Bu javobda ortiqcha nol bor.", 'В этом ответе лишний ноль.', "This answer has an extra zero.")],
  },
  s14: {
    eyebrow: bi('Yakun', 'Итог', "Summary"), title: bi("Yuza kvadrat birliklarda o'lchanadi", 'Площадь измеряется квадратными единицами', "Area is measured in square units"), scene: 'final',
    frames: [bi('Tomoni 1 mm → 1 mm²; tomoni 1 cm → 1 cm²', 'Сторона 1 мм → 1 мм²; сторона 1 см → 1 см²', "Side 1 mm → 1 mm²; side 1 cm → 1 cm²"), bi('1 cm² = 100 mm²; 1 dm² = 100 cm²', '1 см² = 100 мм²; 1 дм² = 100 см²', "1 cm² = 100 mm²; 1 dm² = 100 cm²"), bi('1 m² = 100 dm² = 10 000 cm²', '1 м² = 100 дм² = 10 000 см²', "1 m² = 100 dm² = 10 000 cm²"), bi('1 km² = 1 000 000 m²', '1 км² = 1 000 000 м²', "1 km² = 1 000 000 m²"), bi('1 dm² = 100 cm² — panel tuzatildi', '1 дм² = 100 см² — панель исправлена', "1 dm² = 100 cm² — panel corrected")],
    audio: { uz: ["Tomoni bir millimetr bo'lgan kvadrat bir kvadrat millimetr, tomoni bir santimetr bo'lgan kvadrat bir kvadrat santimetr yuzaga ega.", "Bir kvadrat santimetr yuz kvadrat millimetr, bir kvadrat detsimetr yuz kvadrat santimetr.", "Bir kvadrat metr yuz kvadrat detsimetr yoki o'n ming kvadrat santimetrga teng.", "Bir kvadrat kilometr bir million kvadrat metrga teng.", "Panel tuzatildi. Bir kvadrat detsimetr yuz kvadrat santimetr. Endi turli kattalik birliklarini birga aylantirishga tayyormiz."], ru: ['Квадрат со стороной один миллиметр имеет площадь один квадратный миллиметр, а квадрат со стороной один сантиметр имеет площадь один квадратный сантиметр.', 'Один квадратный сантиметр равен ста квадратным миллиметрам, а один квадратный дециметр равен ста квадратным сантиметрам.', 'Один квадратный метр равен ста квадратным дециметрам или десяти тысячам квадратных сантиметров.', 'Один квадратный километр равен одному миллиону квадратных метров.', 'Панель исправлена. Один квадратный дециметр равен ста квадратным сантиметрам. Теперь мы готовы преобразовывать единицы разных величин вместе.'], en: ["A square with sides of one millimetre has an area of one square millimetre. A square with sides of one centimetre has an area of one square centimetre.","One square centimetre equals one hundred square millimetres. One square decimetre equals one hundred square centimetres.","One square metre equals one hundred square decimetres or ten thousand square centimetres.","One square kilometre equals one million square metres.","The panel is corrected. One square decimetre equals one hundred square centimetres. Now we are ready to convert different kinds of measurement together."] },
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
  stop() { if (this.timer && typeof window !== 'undefined') window.clearTimeout(this.timer); this.timer = null; if (this.audio) { this.audio.pause(); this.audio.src = ''; } if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel(); this.previewUtterance = null; }
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
const AudioIndicator = ({ audio }) => { const t = useT(); return <div className="audio-indicator"><button type="button" onClick={audio.toggleMute} aria-label={t(bi('Audio', 'Аудио', 'Audio'))}>{audio.muted ? '🔇' : '🔊'}</button><span className={audio.isPlaying ? 'audio-wave playing' : 'audio-wave'}><i/><i/><i/></span><button type="button" onClick={audio.replay} aria-label={t(bi('Qayta eshittirish', 'Повторить', 'Replay'))}>↻</button></div>; };
const ScreenTypeLabel = ({ type }) => { const t = useT(); const labels = { hook: bi('Taxmin', 'Гипотеза', "Estimate"), exploration: bi('Tadqiqot', 'Исследование', "Explore"), rule: bi('Qoida', 'Правило', "Rule"), test: bi('Mashq', 'Задание', "Task"), case: bi('Vaziyat', 'Ситуация', "Situation"), summary: bi('Yakun', 'Итог', "Summary") }; return <span className="screen-type">{t(labels[type])}</span>; };
const Stage = ({ screen, audio, onPrev, onNext, finish = false, children }) => { const t = useT(); const mobile = useIsMobile(); const meta = SCREEN_META[screen]; const c = CONTENT[`s${screen}`]; const pad = mobile ? 14 : 24; const ref = useRef(null); useEffect(() => { ref.current?.scrollTo?.({ top: 0, behavior: 'smooth' }); }, [screen]); return <main className={`stage stage-${meta.type}`}><header className="stage-header" style={{ paddingLeft: pad, paddingRight: pad }}><div className="progress-track" aria-label={`${screen + 1} / ${TOTAL_SCREENS}`}><div className="progress-fill progress-bar" style={{ width: `${(screen + 1) / TOTAL_SCREENS * 100}%` }}/></div><div className="stage-chrome"><div className="chrome-title"><span className="status-dot"/><span>{t(c.eyebrow)}</span></div><div className="chrome-actions"><ScreenTypeLabel type={meta.type}/>{audio && <AudioIndicator audio={audio}/>}<span className="screen-count">{String(screen + 1).padStart(2, '0')} / {TOTAL_SCREENS}</span></div></div></header><section className="stage-content" ref={ref} style={{ paddingLeft: pad, paddingRight: pad }}>{children}{audio?.caption && (audio.muted || audio.visualOnly) && <div className="caption">{audio.caption}</div>}</section><footer className="stage-nav" style={{ paddingLeft: pad, paddingRight: pad }}>{screen === 0 ? <span/> : <button type="button" className="btn-ghost" onClick={onPrev}>← {t(bi('Orqaga', 'Назад', "Back"))}</button>}<button type="button" className="btn-white-accent" onClick={onNext}>{finish ? t(bi('Darsni yakunlash', 'Завершить урок', "Finish lesson")) : t(bi('Davom etish', 'Продолжить', "Continue"))} →</button></footer></main>; };
const Heading = ({ c, state = 'present', showBit = false }) => { const t = useT(); return <div className={'heading ' + (showBit ? '' : 'heading-solo')}><div><span>{t(c.eyebrow)}</span><h1>{t(c.title)}</h1></div>{showBit && <BitSVG state={state}/>}</div>; };

const G4TitleReveal = ({ title }) => {
  const t = useT(); const [visible, setVisible] = useState(true);
  useEffect(() => { const timer = window.setTimeout(() => setVisible(false), 3900); return () => window.clearTimeout(timer); }, []);
  if (!visible || typeof document === 'undefined') return null;
  return createPortal(<div className="g4-title-reveal-overlay" role="status" aria-live="assertive" aria-atomic="true" aria-label={`${t(bi('Unvon olindi', 'Звание получено', 'Title earned'))}: ${t(title)}`}><div className="g4-title-reveal-card"><div className="g4-title-reveal-rays" aria-hidden="true"/><div className="g4-title-reveal-confetti" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <i key={index} style={{ '--g4-title-i': index, '--g4-title-delay': `${(index % 7) * -0.21}s` }}/>)}</div><div className="g4-title-reveal-medal" aria-hidden="true">★</div><h2>{t(title)}</h2></div></div>, document.body);
};
const G4TitleCard = ({ title, answers = [] }) => {
  const t = useT(); const scored = SCREEN_META.map((item, index) => item.scored ? index : null).filter((index) => index !== null); const firstTry = scored.filter((index) => answers[index]?.firstTry === true).length;
  return <aside className="g4-title-card-stage" role="status" aria-live="polite" aria-atomic="true"><div className="g4-title-card-confetti" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i key={index}/>)}</div><div className="g4-title-card-bit"><BitSVG state="happy"/></div><div className="g4-title-card-medal" aria-hidden="true">★</div><span className="g4-title-card-kicker">{t(bi('UNVON OLINDI', 'ЗВАНИЕ ПОЛУЧЕНО', 'TITLE EARNED'))}</span><h2>{t(title)}</h2><div className="g4-title-card-score"><strong>{firstTry}/{scored.length}</strong><span>{t(bi('birinchi urinishda', 'с первой попытки', 'on the first attempt'))}</span></div></aside>;
};
const G4TitleReward = ({ unlocked, title, answers }) => {
  const [hasUnlocked, setHasUnlocked] = useState(unlocked);
  useEffect(() => { if (!unlocked || hasUnlocked) return undefined; const frameId = window.requestAnimationFrame(() => setHasUnlocked(true)); return () => window.cancelAnimationFrame(frameId); }, [hasUnlocked, unlocked]);
  if (!hasUnlocked) return null;
  return <><G4TitleReveal title={title}/><G4TitleCard title={title} answers={answers}/></>;
};
const Grid = ({ side = 10, frame = 0, label = '10 × 10' }) => <div className="area-demo"><div className="square-grid" style={{ '--side': side }}>{Array.from({ length: Math.min(side * side, 100) }, (_, index) => <i className={index < Math.min(100, (frame + 1) * 25) ? 'active' : ''} key={index}/>)}</div><strong>{label}</strong></div>;
function AreaVisual({ scene, frame, solved = false }) {
  const t = useT();
  if (['panel', 'zoom-cm', 'panel-case'].includes(scene)) {
    const label = scene === 'panel-case' ? t(bi('2 m × 3 m', '2 м × 3 м', "2 m × 3 m")) : '10 × 10';
    const value = scene === 'zoom-cm'
      ? (solved || frame >= 2 ? t(bi('100 cm²', '100 см²', "100 cm²")) : t(bi('1 dm²', '1 дм²', "1 dm²")))
      : solved
      ? (scene === 'panel-case' ? t(bi('6 m² → 600 dm²', '6 м² → 600 дм²', "6 m² → 600 dm²")) : t(bi('100 cm²', '100 см²', "100 cm²")))
      : (scene === 'panel-case' ? t(bi('? dm²', '? дм²', "? dm²")) : t(bi('? cm²', '? см²', "? cm²")));
    return <div className="area-visual"><Grid frame={frame} label={label}/><span className="area-pill">{value}</span></div>;
  }
  if (scene === 'dimension') return <div className="area-visual dimension"><div className="line-unit">{t(bi('5 cm', '5 см', "5 cm"))}</div><div className="one-square">{t(bi('1 cm²', '1 см²', "1 cm²"))}</div></div>;
  if (scene === 'unit') return <div className="area-visual units"><div className="tiny-square">{t(bi('1 mm²', '1 мм²', "1 mm²"))}</div><div className="one-square">{t(bi('1 cm²', '1 см²', "1 cm²"))}</div></div>;
  if (scene === 'zoom-mm') return <div className="area-visual"><Grid frame={frame} label={t(bi('1 cm² = 100 mm²', '1 см² = 100 мм²', "1 cm² = 100 mm²"))}/></div>;
  if (scene === 'meter') return <div className="area-visual scale-cards"><span>{t(bi('1 m²', '1 м²', "1 m²"))}</span><b>{t(bi('100 dm²', '100 дм²', "100 dm²"))}</b><strong>{t(bi('10 000 cm²', '10 000 см²', "10 000 cm²"))}</strong></div>;
  if (scene === 'kilometer' || scene === 'city') return <div className="area-visual city-map"><div className="city-blocks">{Array.from({ length: 16 }, (_, index) => <i className={index <= frame * 4 + 3 ? 'active' : ''} key={index}/>)}</div><strong>{scene === 'city' && !solved ? t(bi('Mos birlikni tanlang', 'Выбери подходящую единицу', "Choose the suitable unit")) : t(bi('1 km² = 1 000 000 m²', '1 км² = 1 000 000 м²', "1 km² = 1 000 000 m²"))}</strong></div>;
  if (scene === 'relations') return <div className="area-visual relation-list">{['10 × 10 → 100', '10 × 10 → 100', '100 × 100 → 10 000', '1000 × 1000 → 1 000 000'].map((item, index) => <span className={index <= frame ? 'active' : ''} key={index}>{item}</span>)}</div>;
  if (scene === 'choice') return <div className="area-visual choice-row">{t(bi(['detal', 'stol · xona', 'shahar', 'million m²'], ['деталь', 'стол · комната', 'город', 'миллион м²'], ["object","table · room","city","million m²"])).map((unit, index) => <span className={index <= frame ? 'active' : ''} key={unit}>{unit}</span>)}</div>;
  if (scene === 'final') return <div className="area-visual choice-row">{t(bi(['mm²', 'cm²', 'dm²', 'm²', 'km²'], ['мм²', 'см²', 'дм²', 'м²', 'км²'], ["mm²","cm²","dm²","m²","km²"])).map((unit, index) => <span className={index <= frame ? 'active' : ''} key={unit}>{unit}</span>)}</div>;
  return <div className="area-visual"><Grid frame={frame}/><span>{t(bi('birlik kvadratlar', 'единичные квадраты', "unit squares"))}</span></div>;
}
const RevealFrames = ({ frames, frame }) => { const t = useT(); return <div className="reveal-grid">{frames.map((item, index) => <div className={index <= frame ? 'reveal-card show' : 'reveal-card'} key={index}><b>{index + 1}</b><span>{t(item)}</span></div>)}</div>; };
function HookScreen({ screen, onPrev, onNext }) { const t = useT(); const c = CONTENT.s0; const audio = useNarration(c.audio, screen); const [picked, setPicked] = useState(null); const choose = (index) => { setPicked(index); audio.pushOneOff(t(c.neutral)); }; return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} state="think" showBit/><section className="model-card hook-card"><AreaVisual scene={c.scene} frame={audio.frame}/><RevealFrames frames={c.frames} frame={audio.frame}/></section><section className="question" aria-live="polite"><h2>{t(c.question)}</h2><div className="options">{c.options.map((option, index) => <button type="button" className={'option ' + (picked === index ? 'picked' : '')} onClick={() => choose(index)} key={index}><b>{String.fromCharCode(65 + index)}</b><span>{t(option)}</span></button>)}</div>{picked !== null && <div className="feedback open neutral"><b>◆</b><p>{t(c.neutral)}</p></div>}</section></div></Stage>; }
function InfoScreen({ screen, onPrev, onNext, finishLesson }) { const c = CONTENT[`s${screen}`]; const audio = useNarration(c.audio, screen); const summary = screen === 14; return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={summary ? finishLesson : onNext} finish={summary}><div className="stack"><Heading c={c} state={summary ? 'happy' : 'idea'} showBit={summary}/><section className={'model-card ' + (summary ? 'summary-card' : '')}><AreaVisual scene={c.scene} frame={audio.frame} solved/><RevealFrames frames={c.frames} frame={audio.frame}/></section></div></Stage>; }
function QuestionScreen({ screen, storedAnswer, onAnswer, onPrev, onNext }) { const t = useT(); const c = CONTENT[`s${screen}`]; const audio = useNarration(c.audio, screen); const [picked, setPicked] = useState(storedAnswer?.studentAnswerIndex ?? null); const [attempts, setAttempts] = useState(storedAnswer?.attempts ?? 0); const revealed = picked !== null; const correct = picked === c.correctIndex; const choose = (index) => { const ok = index === c.correctIndex; const nextAttempts = attempts + 1; setPicked(index); setAttempts(nextAttempts); playSfx(ok ? 'correct' : 'wrong'); audio.pushOneOff(t(c.feedbackAudio[index])); onAnswer({ stage: SCREEN_META[screen].scope, screenIdx: screen, question: t(c.question), options: c.options.map((option) => t(option)), correctIndex: c.correctIndex, correctAnswer: t(c.options[c.correctIndex]), studentAnswerIndex: index, studentAnswer: t(c.options[index]), correct: ok, firstTry: storedAnswer?.firstTry === false ? false : nextAttempts === 1 && ok, attempts: nextAttempts }); }; return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} state={correct ? 'happy' : revealed ? 'awkward' : 'hint'} showBit={screen === 12}/><section className="test-layout"><div className="test-model"><AreaVisual scene={c.scene} frame={audio.frame} solved={revealed}/><RevealFrames frames={c.frames} frame={audio.frame}/></div><div className="question" aria-live="polite"><h2>{t(c.question)}</h2><div className="options">{c.options.map((option, index) => { const cls = revealed && index === picked ? (index === c.correctIndex ? 'right' : 'bad') : ''; return <button type="button" className={'option ' + cls} onClick={() => choose(index)} key={index}><b>{String.fromCharCode(65 + index)}</b><span>{t(option)}</span></button>; })}</div>{revealed && <><div className={'feedback open ' + (correct ? 'correct' : 'wrong')}><b>{correct ? '✓' : '!'}</b><p>{t(correct ? c.audio.on_correct : c.audio.on_wrong[picked])}</p></div><div className="proof">{t(c.proof)}</div></>}</div></section></div></Stage>; }
const Screen0 = (props) => <HookScreen {...props}/>;
const Screen1 = (props) => <InfoScreen {...props}/>;
const Screen2 = (props) => <InfoScreen {...props}/>;
const Screen3 = (props) => <InfoScreen {...props}/>;
const Screen4 = (props) => <InfoScreen {...props}/>;
const Screen5 = (props) => <InfoScreen {...props}/>;
const Screen6 = (props) => <InfoScreen {...props}/>;
const Screen7 = (props) => <InfoScreen {...props}/>;
const Screen8 = (props) => <QuestionScreen {...props}/>;
const Screen9 = (props) => <QuestionScreen {...props}/>;
const Screen10 = (props) => <QuestionScreen {...props}/>;
const Screen11 = (props) => <QuestionScreen {...props}/>;
const Screen12 = (props) => <QuestionScreen {...props}/>;
const Screen13 = (props) => <QuestionScreen {...props}/>;
function Screen14({ screen, answers, onPrev, finishLesson }) {
  const c = CONTENT.s14; const audio = useNarration(c.audio, screen); const reduced = usePrefersReducedMotion(); const unlocked = audio.frame >= 4 || audio.completed || audio.muted || reduced;
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={finishLesson} finish><div className="stack"><Heading c={c} state="happy" showBit/><section className="model-card summary-card"><AreaVisual scene={c.scene} frame={audio.frame} solved/><RevealFrames frames={c.frames} frame={audio.frame}/></section><G4TitleReward unlocked={unlocked} title={bi("Yuza birliklari ustasi", 'Мастер единиц площади', "Area units expert")} answers={answers}/></div></Stage>;
}
const SCREENS = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14];
export default function Grade4Dars29({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished, previewMode }) { const preview = previewMode ?? (langProp === undefined || langProp === null); const initialLang = normalizeLang(langProp); const [previewLang, setPreviewLang] = useState(initialLang); const lang = preview ? normalizeLang(previewLang) : initialLang; configureLesson({ ttsApiBase: ttsApiBase || '', voiceGender: voiceGender || 'f', correctSoundUrl: correctSoundUrl || '', wrongSoundUrl: wrongSoundUrl || '', previewMode: preview }); const [current, setCurrent] = useState(0); const [answers, setAnswers] = useState([]); const [startedAt] = useState(() => Date.now()); const finished = useRef(false); const recordAnswer = useCallback((answer) => setAnswers((previous) => { const next = [...previous]; const old = previous[answer.screenIdx]; next[answer.screenIdx] = { ...answer, firstTry: old?.firstTry === false ? false : answer.firstTry }; return next; }), []); const finishLesson = useCallback(() => { if (finished.current) return; finished.current = true; const scored = SCREEN_META.map((meta, index) => meta.scored ? index : null).filter((index) => index !== null); const firstTryCorrect = scored.filter((index) => answers[index]?.firstTry === true).length; const payload = { lessonId: LESSON_META.lessonId, lessonTitle: LESSON_META.lessonTitle[lang], studentName: studentName || null, durationSec: Math.floor((Date.now() - startedAt) / 1000), totalQuestions: scored.length, correctAnswers: firstTryCorrect, scorePercent: Math.round(firstTryCorrect / scored.length * 100), finalScore: firstTryCorrect, finalTotal: scored.length, passed: firstTryCorrect / scored.length >= 0.6, firstTryStats: { total: scored.length, firstTryCorrect }, attemptsTotal: scored.reduce((sum, index) => sum + (answers[index]?.attempts ?? 0), 0), skillTags: LESSON_META.skillTags, answers: answers.filter(Boolean) }; if (onFinished) onFinished(payload); else console.log('[Grade4 Dars29 preview]', payload); }, [answers, lang, onFinished, startedAt, studentName]); const Current = SCREENS[current]; return <LangContext.Provider value={lang}><style>{STYLES}</style><div className={'lesson-root ' + (preview ? 'lesson-root-preview' : '')}>{preview && <div className="preview-language" aria-label={bi("Ko'rish tili", 'Язык предпросмотра', 'Preview language')[lang]}>{['uz', 'ru', 'en'].map((code) => <button type="button" key={code} className={previewLang === code ? 'preview-active' : ''} onClick={() => setPreviewLang(code)}>{code.toUpperCase()}</button>)}</div>}<Current key={current} screen={current} storedAnswer={answers[current]} answers={answers} onAnswer={recordAnswer} onPrev={() => setCurrent((value) => Math.max(0, value - 1))} onNext={() => setCurrent((value) => Math.min(TOTAL_SCREENS - 1, value + 1))} finishLesson={finishLesson}/></div></LangContext.Provider>; }

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
html:has(.lesson-root),body:has(.lesson-root),#root:has(.lesson-root),.lesson-page:has(.lesson-root),.lesson-frame:has(.lesson-root){width:100%;height:100%;min-height:0!important;margin:0;overflow:hidden!important;overscroll-behavior:none}
.lesson-root,.lesson-root *{box-sizing:border-box}.lesson-root h1,.lesson-root h2,.lesson-root p{margin:0}.lesson-root button{font:inherit}.lesson-root{position:fixed;inset:0;width:100%;min-height:100dvh;color:${T.ink};background:radial-gradient(circle at 88% 9%,rgba(22,143,163,.11),transparent 25%),linear-gradient(145deg,#F7F8F4,#EEF3F1);font-family:'Manrope',system-ui,sans-serif}.stage{width:min(936px,100%);height:100dvh;margin:0 auto;display:flex;flex-direction:column;background:rgba(245,245,240,.92);box-shadow:0 0 50px -34px rgba(${T.shadowBase},.45)}.stage-header{flex:0 0 auto;padding-top:14px;background:rgba(245,245,240,.96);backdrop-filter:blur(10px);z-index:5}.progress-track{height:7px;border-radius:999px;overflow:hidden;background:#DDE5E3}.progress-fill{height:100%;border-radius:inherit;background:linear-gradient(90deg,${T.cyan},${T.lime});transition:width .45s ease}.progress-bar{box-shadow:0 0 15px rgba(22,143,163,.34)}.stage-chrome{min-height:54px;display:flex;align-items:center;justify-content:space-between;gap:12px}.chrome-title,.chrome-actions{display:flex;align-items:center;gap:9px}.chrome-title{color:${T.navy};font-size:12px;font-weight:900}.status-dot{width:9px;height:9px;border-radius:50%;background:${T.accent};box-shadow:0 0 0 5px rgba(255,91,53,.1)}.screen-type,.screen-count{padding:5px 9px;border-radius:999px;color:${T.cyan};background:${T.cyanSoft};font-size:10px;font-weight:900}.screen-count{color:${T.ink2};background:#FFF}.audio-indicator{height:38px;padding:3px 6px;border-radius:13px;display:flex;align-items:center;gap:4px;background:#FFF;box-shadow:0 9px 20px -17px rgba(${T.shadowBase},.6)}.audio-indicator button{width:31px;height:31px;border:0;border-radius:9px;background:transparent;cursor:pointer}.audio-wave{height:20px;display:flex;align-items:center;gap:2px}.audio-wave i{width:3px;height:6px;border-radius:4px;background:${T.cyan};transition:.25s}.audio-wave.playing i:nth-child(1){height:12px}.audio-wave.playing i:nth-child(2){height:18px}.audio-wave.playing i:nth-child(3){height:9px}
.stage-content{flex:1 1 auto;min-height:0;padding-top:10px;padding-bottom:16px;overflow-y:auto}.stage-nav{flex:0 0 auto;min-height:72px;display:flex;align-items:center;justify-content:space-between;gap:12px;background:rgba(245,245,240,.95)}.btn-white-accent,.btn-ghost{min-width:128px;min-height:50px;padding:0 18px;border:0;border-radius:15px;cursor:pointer;font-weight:900}.btn-white-accent{color:${T.accent};background:#fff;box-shadow:0 12px 24px -17px rgba(255,91,53,.8)}.btn-white-accent:hover{color:#fff;background:${T.accent}}.btn-ghost{color:${T.ink2};background:transparent}.btn-ghost:hover{background:#fff}.stack{display:grid;gap:14px;animation:page-in .45s cubic-bezier(.16,1,.3,1) both}.heading{min-height:78px;display:flex;align-items:center;justify-content:space-between;gap:16px}.heading>div>span{color:${T.cyan};font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.heading h1{margin-top:4px!important;font:750 clamp(25px,4vw,38px)/1.06 'Source Serif 4',Georgia,serif}.heading .g1-char{width:78px;height:98px;flex:0 0 auto;filter:drop-shadow(0 9px 11px rgba(23,59,82,.2))}.model-card,.question,.test-model{padding:18px;border-radius:22px;background:rgba(255,255,255,.9);box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.48)}.model-card{display:grid;grid-template-columns:minmax(250px,.85fr) minmax(300px,1.15fr);align-items:center;gap:18px}.hook-card{background:linear-gradient(135deg,${T.cyanSoft},#FFF)}.summary-card{background:linear-gradient(135deg,#FFF,${T.successSoft})}.reveal-grid{display:grid;gap:8px}.reveal-card{min-height:48px;padding:9px 12px;border-radius:14px;display:grid;grid-template-columns:30px 1fr;align-items:center;gap:9px;opacity:.12;transform:translateY(7px);background:#F8F8F4;transition:.38s ease}.reveal-card.show{opacity:1;transform:none}.reveal-card>b{width:28px;height:28px;border-radius:9px;display:grid;place-items:center;color:#FFF;background:${T.cyan};font:900 10px 'JetBrains Mono',monospace}.reveal-card:last-child.show{background:${T.cyanSoft}}.question{display:grid;gap:13px}.question h2{font:720 clamp(17px,2.5vw,22px)/1.25 'Source Serif 4',Georgia,serif}.options{display:grid;grid-template-columns:repeat(2,1fr);gap:9px}.option{min-height:58px;padding:10px;border:0;border-radius:16px;display:grid;grid-template-columns:28px 1fr;align-items:center;gap:8px;color:${T.ink};background:#F8F8F4;text-align:left;cursor:pointer;transition:.25s}.option:hover{transform:translateY(-2px)}.option>b{width:27px;height:27px;border-radius:9px;display:grid;place-items:center;color:${T.cyan};background:${T.cyanSoft};font:900 11px 'JetBrains Mono',monospace}.option.picked{background:${T.accentSoft};box-shadow:inset 0 0 0 2px rgba(255,91,53,.27)}.option.right{background:${T.successSoft};box-shadow:inset 0 0 0 2px rgba(34,122,83,.25)}.option.bad{background:${T.warnSoft};box-shadow:inset 0 0 0 2px rgba(169,111,19,.25)}.feedback{padding:12px 14px;border-radius:15px;display:grid;grid-template-columns:28px 1fr;gap:9px}.feedback.correct{background:${T.successSoft};box-shadow:inset 4px 0 ${T.success}}.feedback.wrong{background:${T.warnSoft};box-shadow:inset 4px 0 ${T.warn}}.feedback.neutral{background:${T.cyanSoft};box-shadow:inset 4px 0 ${T.cyan}}.proof{padding:11px 14px;border-radius:13px;color:#FFF;background:${T.navy};text-align:center;font:900 15px 'JetBrains Mono',monospace}.test-layout{display:grid;grid-template-columns:.85fr 1.15fr;gap:14px}.test-model{display:grid;align-content:center;gap:12px}.caption{position:sticky;bottom:4px;margin-top:12px;padding:9px 13px;border-radius:13px;color:#fff;background:rgba(23,59,82,.94);font-size:12px;z-index:3}
.area-visual{min-height:210px;padding:14px;border-radius:20px;display:grid;place-items:center;gap:12px;background:linear-gradient(145deg,${T.cyanSoft},#FFF)}.area-demo{display:grid;justify-items:center;gap:7px}.square-grid{--side:10;width:150px;height:150px;padding:3px;display:grid;grid-template-columns:repeat(var(--side),1fr);gap:2px;border:3px solid ${T.navy};border-radius:12px;background:#FFF}.square-grid i{border-radius:2px;background:#DDE7E6;transition:.38s}.square-grid i.active{background:${T.cyan}}.area-demo strong,.area-pill{padding:7px 11px;border-radius:10px;color:#FFF;background:${T.navy};font:900 12px 'JetBrains Mono',monospace}.dimension{grid-template-columns:1fr 1fr}.line-unit{width:130px;border-top:5px solid ${T.accent};padding-top:8px;text-align:center;font:900 15px 'JetBrains Mono',monospace}.one-square,.tiny-square{width:110px;height:110px;display:grid;place-items:center;border:5px solid ${T.cyan};border-radius:12px;background:#FFF;font:900 14px 'JetBrains Mono',monospace}.tiny-square{width:58px;height:58px;border-width:3px}.units{grid-template-columns:1fr 1fr}.scale-cards{grid-template-columns:repeat(3,1fr)}.scale-cards span,.scale-cards b,.scale-cards strong{padding:20px 10px;border-radius:15px;text-align:center;background:#FFF}.scale-cards b{color:#FFF;background:${T.cyan}}.scale-cards strong{color:#FFF;background:${T.navy}}.city-blocks{width:190px;display:grid;grid-template-columns:repeat(4,1fr);gap:5px}.city-blocks i{height:34px;border-radius:8px;background:#DDE7E6;transition:.35s}.city-blocks i.active{background:${T.lime}}.city-map strong{font:900 12px 'JetBrains Mono',monospace}.choice-row{grid-template-columns:repeat(5,1fr)}.choice-row span{padding:15px 8px;border-radius:13px;opacity:.25;background:#FFF;text-align:center;font:900 13px 'JetBrains Mono',monospace;transition:.35s}.choice-row span.active{opacity:1;color:#FFF;background:${T.cyan}}.preview-language{position:fixed;top:9px;right:9px;z-index:30;display:flex;gap:3px;padding:3px;border-radius:999px;background:rgba(255,255,255,.94)}.preview-language button{min-width:44px;min-height:44px;padding:4px 9px;border:0;border-radius:999px;background:transparent;cursor:pointer;font-size:10px;font-weight:900}.preview-language .preview-active{color:#FFF;background:${T.accent}}button:focus-visible,input:focus-visible{outline:3px solid rgba(22,143,163,.48);outline-offset:3px}@keyframes page-in{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:none}}
@media(max-width:639.98px){.stage-header{padding-top:58px}.screen-type{display:none}.stage{width:min(390px,100%)}.heading h1{font-size:26px}.heading .g1-char{width:65px;height:80px}.model-card,.test-layout{grid-template-columns:1fr}.model-card,.question,.test-model{padding:13px;border-radius:18px}.options{grid-template-columns:1fr}.option{min-height:52px}.stage-nav{min-height:68px}.btn-white-accent,.btn-ghost{min-width:112px;padding:0 12px}.area-visual{min-height:170px}.square-grid{width:116px;height:116px}.reveal-card{min-height:43px}.test-model .reveal-grid{display:none}}
@media(prefers-reduced-motion:reduce){.lesson-root *{animation:none!important;transition:none!important;scroll-behavior:auto!important}}
`;
