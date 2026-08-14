import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { canUseGrade4TheoryContinue } from './theoryNavigation.js';

// 4-SINF · 16-DARS · Formulalar
// Approved frame vector: 3,4,4,3,4,4,4,5,2,2,2,2,2,3,5.

const T = {
  bg: '#F5F5F0', ink: '#12212C', ink2: '#50616D', ink3: '#87949D', paper: '#FFFFFF',
  accent: '#FF5B35', accentSoft: '#FFF0EA', cyan: '#168FA3', cyanSoft: '#E5F5F6',
  navy: '#173B52', lime: '#95C93D', success: '#227A53', successSoft: '#E7F3EC',
  warn: '#A96F13', warnSoft: '#FFF5D9', shadowBase: '58, 53, 48',
};

const TOTAL_SCREENS = 15;
const BASE_FRAME_COUNTS = [3, 4, 4, 3, 4, 4, 4, 5, 2, 2, 2, 2, 2, 3, 5];
const SCREEN_FLOW = [0, 4, 8, 5, 9, 6, 10, 7, 11, 1, 12, 3, 13, 2, 14];
const FRAME_COUNTS = SCREEN_FLOW.map((sourceIndex) => BASE_FRAME_COUNTS[sourceIndex]);
const SUPPORTED_LANGS = ['uz', 'ru', 'en'];
const normalizeLang = (value) => SUPPORTED_LANGS.includes(value) ? value : 'uz';
const SPEECH_LOCALES = { uz: 'uz-UZ', ru: 'ru-RU', en: 'en-GB' };
const LESSON_META = {
  lessonId: 'num-4-16-v1',
  slug: 'dars16-formulalar',
  lessonTitle: { uz: "16-dars. Formulalar", ru: 'Урок 16. Формулы', en: 'Lesson 16. Formulae' },
  skillTags: ['formula', 'rectangle_perimeter', 'square_perimeter', 'rectangle_area', 'substitution'],
};

const SCREEN_META = [
  { id: 's0', type: 'hook', goal: 'Predict a general perimeter method', template: 'DiagnosticChoice', mechanic: 'diagnostic-choice', active: true, scored: false, scope: 'hook', misconceptions: ['confuse perimeter and area'], resetOnReturn: true },
  { id: 's1', type: 'model', goal: 'Trace the rectangle boundary', template: 'GeometryReveal', mechanic: 'model-reveal', active: true, scored: false, scope: 'concept', misconceptions: [] },
  { id: 's2', type: 'guided-practice', goal: 'Match quantities and formulae', template: 'PairClassification', mechanic: 'matching-retry', active: true, scored: true, scope: 'module-mikro', misconceptions: ['swap perimeter and area formulae'] },
  { id: 's3', type: 'discovery', goal: 'Discover paired equal sides', template: 'FormulaReveal', mechanic: 'model-reveal', active: true, scored: false, scope: 'concept', misconceptions: [] },
  { id: 's4', type: 'guided-practice', goal: 'Calculate rectangle perimeter', template: 'NumericRetry', mechanic: 'numeric-retry', active: true, scored: true, scope: 'module-mikro', misconceptions: ['add only adjacent sides'] },
  { id: 's5', type: 'model', goal: 'Compare expanded and compact perimeter forms', template: 'ComparisonReveal', mechanic: 'model-reveal', active: true, scored: false, scope: 'concept', misconceptions: [] },
  { id: 's6', type: 'guided-practice', goal: 'Apply the square perimeter relationship', template: 'NumericRetry', mechanic: 'numeric-retry', active: true, scored: true, scope: 'module-mikro', misconceptions: ['multiply side by itself'] },
  { id: 's7', type: 'model', goal: 'Discover the area array model', template: 'TileReveal', mechanic: 'model-reveal', active: true, scored: false, scope: 'concept', misconceptions: [] },
  { id: 's8', type: 'strategy', goal: 'Choose and substitute into the appropriate formula', template: 'NumericRetry', mechanic: 'numeric-retry', active: true, scored: true, scope: 'module-mikro', misconceptions: ['substitute into wrong formula'] },
  { id: 's9', type: 'rule', goal: 'State the letter formula after discovery', template: 'RuleReveal', mechanic: 'model-reveal', active: true, scored: false, scope: 'concept', misconceptions: [] },
  { id: 's10', type: 'error-analysis', goal: 'Repair a missing-factor perimeter error', template: 'ErrorRepair', mechanic: 'choice-retry', active: true, scored: true, scope: 'module-mikro', misconceptions: ['use P = a + b'] },
  { id: 's11', type: 'transfer', goal: 'Transfer substitution to a rotated model', template: 'SubstitutionReveal', mechanic: 'model-reveal', active: true, scored: false, scope: 'transfer', misconceptions: [] },
  { id: 's12', type: 'life-case', goal: 'Select a formula in a park context', template: 'LifeChoice', mechanic: 'choice-retry', active: true, scored: true, scope: 'final', misconceptions: ['measure interior instead of boundary'] },
  { id: 's13', type: 'comparison', goal: 'Compare perimeter and area units', template: 'ComparisonReveal', mechanic: 'model-reveal', active: true, scored: false, scope: 'transfer', misconceptions: [] },
  { id: 's14', type: 'summary', goal: 'Reflect on formula choice and bridge to scales', template: 'ReflectionChoice', mechanic: 'reflection-choice', active: true, scored: false, scope: 'reflection', misconceptions: [] },
];

const CONTENT = {
  s0: {
    eyebrow: { uz: "Qurilish paneli", ru: 'Строительная панель', en: 'Building panel' },
    title: { uz: "Istalgan to'g'ri to'rtburchak uchun usul", ru: 'Способ для любого прямоугольника', en: 'A method for any rectangle' },
    question: { uz: "Istalgan to'g'ri to'rtburchak perimetrini qaysi usul topadi?", ru: 'Какой способ находит периметр любого прямоугольника?', en: 'Which method finds the perimeter of any rectangle?' },
    options: [
      { uz: "Barcha 4 tomonni qo'shish", ru: 'Сложить все 4 стороны', en: 'Add all 4 sides' },
      { uz: "Uzunlikni kenglikka ko'paytirish", ru: 'Умножить длину на ширину', en: 'Multiply the length by the width' },
    ],
    neutral: { uz: "Taxminni tekshirish uchun to'rtta tomon bo'ylab yuramiz.", ru: 'Чтобы проверить гипотезу, пройдём вдоль четырёх сторон.', en: 'To check the estimate, we will trace all four sides.' },
    audio: { intro: {
      uz: ["Bit qurilish panelining barcha chetlarini o'lchamoqchi.", "Perimetr shaklning barcha tomonlari uzunligining yig'indisidir.", "Hozircha umumiy usulni taxmin qiling."],
      ru: ['Бит хочет измерить всю границу строительной панели.', 'Периметр является суммой длин всех сторон фигуры.', 'Пока предположи, какой способ будет общим.'],
      en: ['Bit wants to measure the whole boundary of the building panel.', 'The perimeter is the sum of the lengths of all the sides of a shape.', 'For now, estimate which method will work in every case.'],
    }, on_correct: { uz: "Taxmin saqlandi.", ru: 'Гипотеза сохранена.', en: 'Your estimate has been saved.' }, on_wrong: { uz: "Taxmin saqlandi.", ru: 'Гипотеза сохранена.', en: 'Your estimate has been saved.' } },
  },
  s1: {
    eyebrow: { uz: "Aniq model", ru: 'Конкретная модель', en: 'A specific model' },
    title: { uz: "To'rtta tomon bo'ylab yuramiz", ru: 'Проходим вдоль четырёх сторон', en: 'Trace all four sides' },
    audio: {
      uz: ["Yuqori tomon uch santimetr.", "Keyingi tomon ikki santimetr, pastki tomon yana uch santimetr.", "Oxirgi tomon yana ikki santimetr.", "To'rtta tomonni qo'shsak, perimetr o'n santimetr bo'ladi."],
      ru: ['Верхняя сторона равна трём сантиметрам.', 'Следующая сторона равна двум сантиметрам, нижняя сторона снова трём сантиметрам.', 'Последняя сторона снова равна двум сантиметрам.', 'Если сложить четыре стороны, периметр будет равен десяти сантиметрам.'],
      en: ['The top side is three centimetres long.', 'The next side is two centimetres, and the bottom side is three centimetres again.', 'The final side is two centimetres again.', 'When we add the four sides, the perimeter is ten centimetres.'],
    },
  },
  s2: {
    eyebrow: { uz: "Bir xil juftlar", ru: 'Одинаковые пары', en: 'Equal pairs' },
    title: { uz: "Yozuvni qisqartiramiz", ru: 'Сокращаем запись', en: 'Shorten the expression' },
    audio: {
      uz: ["To'g'ri to'rtburchakning qarama-qarshi tomonlari teng.", "Bitta uzunlik va bitta kenglikdan ikkita bir xil juft hosil bo'ladi.", "Shuning uchun uzunlik va kenglik yig'indisini ikki marta olamiz.", "Yangi yozuv avvalgi to'rtta qo'shiluvchiga teng."],
      ru: ['Противоположные стороны прямоугольника равны.', 'Получаются две одинаковые пары из длины и ширины.', 'Поэтому сумму длины и ширины берём два раза.', 'Новая запись равна прежней сумме четырёх сторон.'],
      en: ['The opposite sides of a rectangle are equal.', 'One length and one width make a pair, and there are two identical pairs.', 'That is why we take the sum of the length and width twice.', 'The new expression is equal to the original sum of four sides.'],
    },
  },
  s3: {
    eyebrow: { uz: "Yana bir tekshiruv", ru: 'Ещё одна проверка', en: 'Another check' },
    title: { uz: "Yangi o'lchamlarda ham teng", ru: 'Равенство сохраняется', en: 'The equality still holds with new dimensions' },
    audio: {
      uz: ["Endi tomonlari to'rt va besh santimetr bo'lgan to'g'ri to'rtburchakni tekshiramiz.", "To'rtta tomonning yig'indisi o'n sakkiz santimetr.", "Uzunlik va kenglik yig'indisini ikki marta olish ham o'n sakkizni beradi."],
      ru: ['Теперь проверим прямоугольник со сторонами четыре и пять сантиметров.', 'Сумма четырёх сторон равна восемнадцати сантиметрам.', 'Если дважды взять сумму длины и ширины, тоже получим восемнадцать.'],
      en: ['Now check a rectangle with sides of four centimetres and five centimetres.', 'The sum of the four sides is eighteen centimetres.', 'Taking the sum of the length and width twice also gives eighteen.'],
    },
  },
  s4: {
    eyebrow: { uz: "Harfli umumiy qoida", ru: 'Общее правило с буквами', en: 'A general rule using letters' },
    title: { uz: "Formula", ru: 'Формула', en: 'Formula' },
    audio: {
      uz: ["Istalgan uzunlikni a harfi, kenglikni b harfi bilan belgilaymiz.", "Perimetrni pe harfi bilan belgilaymiz.", "Perimetr uzunlik va kenglik yig'indisining ikki baravariga teng.", "Harfli umumiy qoida formula deyiladi."],
      ru: ['Любую длину обозначим буквой а, а ширину буквой бэ.', 'Периметр обозначим буквой пэ.', 'Периметр равен удвоенной сумме длины и ширины.', 'Общее правило, записанное буквами, называется формулой.'],
      en: ['We use the letter a for any length and the letter b for any width.', 'We use the letter P for the perimeter.', 'The perimeter equals twice the sum of the length and width.', 'A general rule written with letters is called a formula.'],
    },
  },
  s5: {
    eyebrow: { uz: "Qiymatlarni qo'yish", ru: 'Подстановка значений', en: 'Substituting values' },
    title: { uz: "Harflar o'rniga sonlar", ru: 'Числа вместо букв', en: 'Numbers in place of letters' },
    audio: {
      uz: ["Uzunlik ikki, kenglik besh santimetr.", "Formuladagi a va b harflari o'rniga berilgan sonlarni qo'yamiz.", "Avval qavs ichidagi ikki va beshni qo'shamiz.", "Yettini ikkiga ko'paytirsak, perimetr o'n to'rt santimetr."],
      ru: ['Длина равна двум, а ширина пяти сантиметрам.', 'Вместо букв а и бэ в формуле подставляем данные числа.', 'Сначала складываем два и пять в скобках.', 'Если семь умножить на два, периметр равен четырнадцати сантиметрам.'],
      en: ['The length is two centimetres and the width is five centimetres.', 'We substitute the given numbers for a and b in the formula.', 'First we add two and five inside the brackets.', 'Seven multiplied by two gives a perimeter of fourteen centimetres.'],
    },
  },
  s6: {
    eyebrow: { uz: "Kvadrat", ru: 'Квадрат', en: 'Square' },
    title: { uz: "To'rtta teng tomon", ru: 'Четыре равные стороны', en: 'Four equal sides' },
    audio: {
      uz: ["Kvadratning barcha to'rtta tomoni teng.", "Perimetr to'rtta bir xil tomonning yig'indisidir.", "To'rtta bir xil a ni to'rtni a ga ko'paytirish bilan yozamiz.", "Kvadrat perimetri tomondan to'rt marta katta."],
      ru: ['Все четыре стороны квадрата равны.', 'Периметр равен сумме четырёх одинаковых сторон.', 'Четыре одинаковых а записываем как четыре умножить на а.', 'Периметр квадрата равен четырём его сторонам.'],
      en: ['All four sides of a square are equal.', 'The perimeter is the sum of four equal sides.', 'We write four equal a terms as four multiplied by a.', 'The perimeter of a square is four times its side length.'],
    },
  },
  s7: {
    eyebrow: { uz: "Chegara va ichki qism", ru: 'Граница и внутренняя часть', en: 'Boundary and interior' },
    title: { uz: "Yuza formulasi", ru: 'Формула площади', en: 'Area formula' },
    audio: {
      uz: ["Birinchi qatorda to'rtta birlik kvadrat bor.", "Ikki qatorda sakkizta birlik kvadrat bo'ladi.", "Uch qatorda jami o'n ikkita birlik kvadrat bor.", "To'g'ri to'rtburchak yuzasi uzunlik va kenglik ko'paytmasiga teng.", "Perimetr chegarani uzunlik birligida, yuza ichki qismni kvadrat birlikda o'lchaydi."],
      ru: ['В первом ряду четыре единичных квадрата.', 'В двух рядах восемь единичных квадратов.', 'В трёх рядах всего двенадцать единичных квадратов.', 'Площадь прямоугольника равна произведению длины и ширины.', 'Периметр измеряет границу единицами длины, а площадь внутреннюю часть квадратными единицами.'],
      en: ['The first row contains four unit squares.', 'Two rows contain eight unit squares.', 'Three rows contain twelve unit squares in total.', 'The area of a rectangle equals its length multiplied by its width.', 'Perimeter measures the boundary in units of length, while area measures the interior in square units.'],
    },
  },
  s8: {
    eyebrow: { uz: "Mashq · 1/6", ru: 'Тренировка · 1/6' , en: "Practice · 1/6"},
    title: { uz: "To'g'ri to'rtburchak perimetri formulasi", ru: 'Формула периметра прямоугольника', en: 'Formula for the perimeter of a rectangle' },
    question: { uz: "Uzunligi a, kengligi b bo'lgan to'g'ri to'rtburchak perimetrini qaysi formula topadi?", ru: 'Какая формула находит периметр прямоугольника с длиной a и шириной b?', en: 'Which formula finds the perimeter of a rectangle with length a and width b?' },
    situations: [
      { uz: "a va b tomonli to'g'ri to'rtburchak chegarasi", ru: 'Граница прямоугольника со сторонами a и b', en: 'The boundary of a rectangle with sides a and b' },
    ],
    formulas: ['P = 2 · (a + b)', 'P = a + b', 'P = a · b'],
    answer: [0],
    audio: { intro: { uz: ["Oldingi ekranda uzunlikni a, kenglikni b harfi bilan belgiladik.", "Shu to'g'ri to'rtburchak perimetrining umumiy formulasini tanlang."], ru: ['На прошлом экране мы обозначили длину буквой а, а ширину буквой бэ.', 'Выбери общую формулу периметра этого прямоугольника.'], en: ['On the previous screen, we used a for the length and b for the width.', 'Choose the general formula for the perimeter of this rectangle.'] }, on_correct: { uz: "To'g'ri. Perimetr uzunlik va kenglik yig'indisining ikki baravariga teng.", ru: 'Верно. Периметр равен удвоенной сумме длины и ширины.', en: 'Correct. The perimeter equals twice the sum of the length and width.' }, on_wrong: { uz: "Perimetrda ikkita uzunlik va ikkita kenglik bor. Uzunlik bilan kenglik yig'indisini ikki marta oladigan formulani tanlang.", ru: 'В периметр входят две длины и две ширины. Выбери формулу, которая дважды берёт сумму длины и ширины.', en: 'A perimeter contains two lengths and two widths. Choose the formula that takes the sum of the length and width twice.' } },
  },
  s9: {
    eyebrow: { uz: "Mashq · 2/6", ru: 'Тренировка · 2/6' , en: "Practice · 2/6"},
    title: { uz: "To'g'ri to'rtburchak perimetri", ru: 'Периметр прямоугольника', en: 'Perimeter of a rectangle' },
    question: { uz: "a = 6 sm, b = 11 sm. P = ?", ru: 'a = 6 см, b = 11 см. P = ?', en: 'a = 6 cm, b = 11 cm. P = ?' },
    answer: '34',
    feedback: { correct: { uz: "To'g'ri. Ikki bir xil juft jami o'ttiz to'rt santimetr.", ru: 'Верно. Две одинаковые пары дают тридцать четыре сантиметра.', en: 'Correct. Two identical pairs total thirty-four centimetres.' }, default: { uz: "Avval olti va o'n birni qo'shing, keyin natijani ikki marta oling.", ru: 'Сначала сложи шесть и одиннадцать, затем возьми результат два раза.', en: 'First add six and eleven, then take the result twice.' }, '17': { uz: "17 faqat bitta uzunlik va kenglik jufti. Perimetrda bunday juft ikkita.", ru: '17 — только одна пара длины и ширины. В периметре таких пар две.', en: 'Seventeen is only one length-and-width pair. A perimeter contains two such pairs.' }, '66': { uz: "66 ichki qism yuzasini topadi, chegarani emas.", ru: '66 находит площадь внутренней части, а не границу.', en: 'Sixty-six finds the area of the interior, not the boundary.' } },
    audio: { intro: { uz: ["Uzunlik olti, kenglik o'n bir santimetr.", "To'g'ri to'rtburchak perimetrini formula orqali toping."], ru: ['Длина равна шести, а ширина одиннадцати сантиметрам.', 'Найди периметр прямоугольника по формуле.'], en: ['The length is six centimetres and the width is eleven centimetres.', 'Use the formula to find the perimeter of the rectangle.'] }, on_correct: { uz: "To'g'ri. Perimetr o'ttiz to'rt santimetr.", ru: 'Верно. Периметр равен тридцати четырём сантиметрам.', en: 'Correct. The perimeter is thirty-four centimetres.' }, on_wrong: { uz: "Uzunlik va kenglik yig'indisini ikki marta oling.", ru: 'Возьми сумму длины и ширины два раза.', en: 'Take the sum of the length and width twice.' } },
  },
  s10: {
    eyebrow: { uz: "Mashq · 3/6", ru: 'Тренировка · 3/6' , en: "Practice · 3/6"},
    title: { uz: "Kvadrat perimetri", ru: 'Периметр квадрата', en: 'Perimeter of a square' },
    question: { uz: "a = 7 sm. P = ?", ru: 'a = 7 см. P = ?', en: 'a = 7 cm. P = ?' },
    answer: '28',
    feedback: { correct: { uz: "To'g'ri. To'rtta teng tomon jami yigirma sakkiz santimetr.", ru: 'Верно. Четыре равные стороны дают двадцать восемь сантиметров.', en: 'Correct. The four equal sides total twenty-eight centimetres.' }, default: { uz: "Kvadratning to'rtta teng tomonini hisobga oling.", ru: 'Учти четыре равные стороны квадрата.', en: 'Include all four equal sides of the square.' }, '14': { uz: "14 faqat ikkita tomonni hisobga oladi.", ru: '14 учитывает только две стороны.', en: 'Fourteen includes only two sides.' }, '49': { uz: "49 tomonning kvadrati, perimetr emas.", ru: '49 — квадрат стороны, а не периметр.', en: 'Forty-nine is the square of the side length, not the perimeter.' } },
    audio: { intro: { uz: ["Kvadrat tomoni yetti santimetr.", "Kvadrat perimetri tomon uzunligining to'rt baravariga teng.", "To'rtni yettiga ko'paytirib, javobni kiriting."], ru: ['Сторона квадрата равна семи сантиметрам.', 'Периметр квадрата равен четырём длинам его стороны.', 'Умножь четыре на семь и введи ответ.'], en: ['The side of the square is seven centimetres.', 'The perimeter of a square is four times its side length.', 'Multiply four by seven and enter the answer.'] }, on_correct: { uz: "To'g'ri. Perimetr yigirma sakkiz santimetr.", ru: 'Верно. Периметр равен двадцати восьми сантиметрам.', en: 'Correct. The perimeter is twenty-eight centimetres.' }, on_wrong: { uz: "To'rtta teng tomonning yig'indisini toping.", ru: 'Найди сумму четырёх равных сторон.', en: 'Find the sum of the four equal sides.' } },
  },
  s11: {
    eyebrow: { uz: "Mashq · 4/6", ru: 'Тренировка · 4/6' , en: "Practice · 4/6"},
    title: { uz: "To'g'ri to'rtburchak yuzasi", ru: 'Площадь прямоугольника', en: 'Area of a rectangle' },
    question: { uz: "a = 4 sm, b = 7 sm. S = ?", ru: 'a = 4 см, b = 7 см. S = ?', en: 'a = 4 cm, b = 7 cm. S = ?' },
    answer: '28',
    feedback: { correct: { uz: "To'g'ri. Yuza yigirma sakkiz kvadrat santimetr.", ru: 'Верно. Площадь равна двадцати восьми квадратным сантиметрам.', en: 'Correct. The area is twenty-eight square centimetres.' }, default: { uz: "Yuza uchun uzunlikni kenglikka ko'paytiring.", ru: 'Для площади умножь длину на ширину.', en: 'To find the area, multiply the length by the width.' }, '22': { uz: "22 perimetr natijasi, yuza emas.", ru: '22 — результат для периметра, а не для площади.', en: 'Twenty-two is the perimeter, not the area.' }, '11': { uz: "11 faqat tomonlar yig'indisi.", ru: '11 — только сумма сторон.', en: 'Eleven is only the sum of two sides.' } },
    audio: { intro: { uz: ["To'g'ri to'rtburchakning tomonlari to'rt va yetti santimetr.", "Yuzani kvadrat santimetrda toping."], ru: ['Стороны прямоугольника равны четырём и семи сантиметрам.', 'Найди площадь в квадратных сантиметрах.'], en: ['The sides of the rectangle are four centimetres and seven centimetres.', 'Find the area in square centimetres.'] }, on_correct: { uz: "To'g'ri. Yuza yigirma sakkiz kvadrat santimetr.", ru: 'Верно. Площадь равна двадцати восьми квадратным сантиметрам.', en: 'Correct. The area is twenty-eight square centimetres.' }, on_wrong: { uz: "Uzunlikni kenglikka ko'paytiring.", ru: 'Умножь длину на ширину.', en: 'Multiply the length by the width.' } },
  },
  s12: {
    eyebrow: { uz: "Mashq · 5/6", ru: 'Тренировка · 5/6' , en: "Practice · 5/6"},
    title: { uz: "To'rtta tomonni hisobga oling", ru: 'Учти все четыре стороны', en: 'Include all four sides' },
    question: { uz: "3 sm va 2 sm tomonli to'g'ri to'rtburchak perimetrini qaysi hisob topadi?", ru: 'Какое вычисление находит периметр прямоугольника со сторонами 3 см и 2 см?', en: 'Which calculation finds the perimeter of a rectangle with sides of 3 cm and 2 cm?' },
    options: ['P = 3 + 2 + 3 + 2 = 10', 'P = 3 · 2 = 6', 'P = 3 + 2 = 5'],
    correctIndex: 0,
    feedback: [
      { uz: "To'g'ri. Barcha to'rtta tomon hisobga olindi.", ru: 'Верно. Учтены все четыре стороны.', en: 'Correct. All four sides have been included.' },
      { uz: "6 ichki qism yuzasini topadi, perimetrni emas.", ru: '6 находит площадь внутренней части, а не периметр.', en: 'Six finds the area of the interior, not the perimeter.' },
      { uz: "5 faqat bitta uzunlik va bitta kenglik. Perimetr uchun to'rtta tomonni qo'shish kerak.", ru: '5 — только одна длина и одна ширина. Для периметра нужно сложить четыре стороны.', en: 'Five includes only one length and one width. To find the perimeter, add all four sides.' },
    ],
    audio: { intro: { uz: ["To'g'ri to'rtburchak tomonlari uch va ikki santimetr.", "Perimetrni topish uchun barcha to'rtta tomonni hisobga oladigan yozuvni tanlang."], ru: ['Стороны прямоугольника равны трём и двум сантиметрам.', 'Чтобы найти периметр, выбери запись, которая учитывает все четыре стороны.'], en: ['The sides of the rectangle are three centimetres and two centimetres.', 'To find the perimeter, choose the expression that includes all four sides.'] }, on_correct: { uz: "To'g'ri. Barcha to'rtta tomon hisobga olindi.", ru: 'Верно. Учтены все четыре стороны.', en: 'Correct. All four sides have been included.' }, on_wrong: { uz: "Perimetrda barcha to'rtta tomon qatnashadi.", ru: 'В периметре участвуют все четыре стороны.', en: 'All four sides are part of the perimeter.' } },
  },
  s13: {
    eyebrow: { uz: "Mashq · 6/6", ru: 'Тренировка · 6/6' , en: "Practice · 6/6"},
    title: { uz: "Bitning xatosini tuzating", ru: 'Исправь ошибку Бита' , en: "Correct Bit's mistake"},
    question: { uz: "5 sm va 3 sm tomonli to'g'ri to'rtburchak perimetrini qaysi hisob topadi?", ru: 'Какое вычисление находит периметр прямоугольника со сторонами 5 см и 3 см?', en: 'Which calculation finds the perimeter of a rectangle with sides of 5 cm and 3 cm?' },
    options: [
      'P = 2 · (5 + 3) = 16',
      'S = 5 · 3 = 15',
      'P = 5 + 3 = 8',
    ],
    correctIndex: 0,
    feedback: [
      { uz: "To'g'ri. Barcha to'rtta tomon hisobga olindi.", ru: 'Верно. Учтены все четыре стороны.', en: 'Correct. All four sides have been included.' },
      { uz: "15 ichki qism yuzasini topadi, perimetrni emas.", ru: '15 находит площадь внутренней части, а не периметр.', en: 'Fifteen finds the area of the interior, not the perimeter.' },
      { uz: "8 faqat bitta uzunlik va bitta kenglik. Perimetr uchun bu juftni ikki marta olish kerak.", ru: '8 — только одна длина и одна ширина. Для периметра эту пару нужно взять два раза.', en: 'Eight includes only one length and one width. For the perimeter, take this pair twice.' },
    ],
    audio: { intro: { uz: ["To'g'ri to'rtburchak tomonlari besh va uch santimetr.", "Bit perimetrga faqat bitta uzunlik va bitta kenglikni qo'shdi.", "Perimetrda barcha to'rtta tomon qatnashadigan hisobni tanlang."], ru: ['Стороны прямоугольника равны пяти и трём сантиметрам.', 'Бит сложил для периметра только одну длину и одну ширину.', 'Выбери вычисление, в котором участвуют все четыре стороны.'], en: ['The sides of the rectangle are five centimetres and three centimetres.', 'For the perimeter, Bit added only one length and one width.', 'Choose the calculation that includes all four sides.'] }, on_correct: { uz: "To'g'ri. Barcha to'rtta tomon hisobga olindi.", ru: 'Верно. Учтены все четыре стороны.', en: 'Correct. All four sides have been included.' }, on_wrong: { uz: "Perimetrda barcha to'rtta tomon qatnashadi.", ru: 'В периметре участвуют все четыре стороны.', en: 'All four sides are part of the perimeter.' } },
  },
  s14: {
    eyebrow: { uz: "Yakun", ru: 'Итог' , en: "Summary"},
    title: { uz: "Uchta formula, uchta bog'lanish", ru: 'Три формулы, три связи', en: 'Three formulae, three relationships' },
    audio: {
      uz: ["Formula bir xil bog'lanishni harflar bilan qisqa va umumiy yozadi.", "To'g'ri to'rtburchak perimetri uzunlik va kenglik yig'indisining ikki baravariga teng.", "Kvadrat perimetri tomonning to'rt baravariga teng.", "To'g'ri to'rtburchak yuzasi uzunlik va kenglik ko'paytmasiga teng.", "Keyingi darsda shkaladagi bitta bo'linmaning qiymatini topishni o'rganamiz."],
      ru: ['Формула кратко и в общем виде записывает одну и ту же связь с помощью букв.', 'Периметр прямоугольника равен удвоенной сумме длины и ширины.', 'Периметр квадрата равен четырём сторонам.', 'Площадь прямоугольника равна произведению длины и ширины.', 'На следующем уроке научимся находить цену одного деления шкалы.'],
      en: ['A formula uses letters to write the same relationship concisely and generally.', 'The perimeter of a rectangle equals twice the sum of its length and width.', 'The perimeter of a square equals four times its side length.', 'The area of a rectangle equals its length multiplied by its width.', 'In the next lesson, we will learn to find the value of one division on a scale.'],
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

const stableChoiceOffset = (lessonId, length) => {
  const input = `${lessonId}:${length}`;
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return length > 0 ? (hash >>> 0) % length : 0;
};

const buildOptionOrder = (length, correctIndex, lessonId, ordinal = 0) => {
  const natural = Array.from({ length }, (_, index) => index);
  if (length < 2 || !natural.includes(correctIndex)) return natural;
  const target = (stableChoiceOffset(lessonId, length) + ordinal * (length - 1)) % length;
  const order = natural.filter((index) => index !== correctIndex);
  order.splice(target, 0, correctIndex);
  return order;
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
  const t = useT();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!show) { const frame = requestAnimationFrame(() => setOpen(false)); return () => cancelAnimationFrame(frame); }
    let second = 0; const first = requestAnimationFrame(() => { second = requestAnimationFrame(() => setOpen(true)); });
    return () => { cancelAnimationFrame(first); cancelAnimationFrame(second); };
  }, [show]);
  return <div role="status" aria-hidden={!show} data-g4-role={show ? (correct ? 'feedback-frame bit-answer-comment' : 'feedback-frame') : undefined} data-g4-feedback={show ? (correct ? 'solution' : 'wrong') : undefined} className={`feedback ${correct ? 'correct' : 'wrong'} ${open ? 'open' : ''}`}><span className="feedback-bit" data-g4-role="feedback-bit"><BitSVG state={correct ? 'nod' : 'awkward'}/></span><p>{show && <><strong>{correct ? t({ uz: 'YECHIM', ru: 'РЕШЕНИЕ', en: 'SOLUTION' }) : t({ uz: "YANA O'YLANG", ru: 'ПРОВЕРЬТЕ СПОСОБ', en: 'CHECK THE METHOD' })}</strong>{children}</>}</p></div>;
};

const ContractActivity = ({ screen, value, onComplete }) => {
  const t = useT(); const meta = SCREEN_META[screen];
  if (meta.template === 'ReflectionChoice') return null;
  if (!meta.template.includes('Reveal')) return null;
  return <div className="activity-slot"><button type="button" className={value !== undefined ? 'selected' : ''} onClick={() => onComplete(screen, true)}>{value !== undefined ? t({ uz: "Model tekshirildi", ru: 'Модель проверена', en: 'Model checked' }) : t({ uz: "Modelni tekshirish", ru: 'Проверить модель', en: 'Check the model' })}</button></div>;
};

const Stage = ({ screen, audio, onPrev, onNext, finish = false, activityDone, children }) => {
  const t = useT(); const mobile = useIsMobile(); const pad = mobile ? 14 : 48; const c = ORDERED_CONTENT[screen]; const meta = SCREEN_META[screen]; const { activityState, markActivity } = useContext(ActivityContext);
  const storedActivity = Object.prototype.hasOwnProperty.call(activityState, screen); const activityReady = !meta.active || activityDone === true || storedActivity; const audioReady = !audio || audio.muted || audio.visualOnly || audio.completed;
  const originalGatePassed = activityReady && audioReady;
  const canAdvance = canUseGrade4TheoryContinue(originalGatePassed, finish);
  useEffect(() => { if (activityDone === true && !storedActivity) markActivity(screen, true); }, [activityDone, markActivity, screen, storedActivity]);
  const showCaption = Boolean(audio?.caption && (audio.muted || audio.visualOnly));
  return <main className={`stage stage-${meta.type}`}><header className="stage-header" style={{ paddingLeft: pad, paddingRight: pad }}><div className="progress-track" aria-label={`${screen + 1} / ${TOTAL_SCREENS}`}><div className="progress-fill progress-bar" style={{ width: `${(screen + 1) / TOTAL_SCREENS * 100}%` }}/></div><div className="stage-chrome"><div className="chrome-title"><span className="status-dot"/><span>{t(c.eyebrow)}</span></div><div className="chrome-actions"><ScreenTypeLabel type={meta.type}/>{audio && <AudioIndicator audio={audio}/>}<span className="screen-count">{String(screen + 1).padStart(2, '0')} / {TOTAL_SCREENS}</span></div></div></header><section className="stage-content" style={{ paddingLeft: pad, paddingRight: pad }}><div className="stage-body">{children}<ContractActivity screen={screen} value={activityState[screen]} onComplete={markActivity}/></div><div className={`caption caption-slot ${showCaption ? 'visible' : ''}`} aria-hidden={!showCaption}>{showCaption ? audio.caption : ''}</div></section><footer className="stage-nav" style={{ paddingLeft: pad, paddingRight: pad }}>{screen === 0 ? <span/> : <button type="button" className="btn-ghost" onClick={onPrev}>← {t({ uz: "Orqaga", ru: 'Назад' , en: "Back"})}</button>}<button type="button" className="btn-white-accent" onClick={onNext} disabled={!canAdvance}>{finish ? t({ uz: "Darsni yakunlash", ru: 'Завершить урок' , en: "Finish lesson"}) : t({ uz: "Davom etish", ru: 'Продолжить' , en: "Continue"})} →</button></footer></main>;
};

const Heading = ({ c }) => { const t = useT(); const hook = c === CONTENT.s0; return <div className="heading"><div><span data-g4-role={hook ? 'hook-topic' : undefined}>{t(c.eyebrow)}</span><h1 data-g4-role={hook ? 'hook-title' : undefined}>{t(c.title)}</h1></div>{!hook && <BitSVG state="happy" className="primary-happy-bit"/>}</div>; };
const Options = ({ values, order = null, picked, onPick, correctIndex, solved, neutral = false }) => { const t = useT(); const optionOrder = order ?? values.map((_, index) => index); return <div className="options">{optionOrder.map((sourceIndex, displayIndex) => <button type="button" key={`${sourceIndex}-${t(values[sourceIndex])}`} data-g4-role="answer-card" data-g4-branch={order ? 'choice' : undefined} data-g4-source-index={order ? sourceIndex : undefined} data-g4-correct={order ? (sourceIndex === correctIndex ? 'true' : 'false') : undefined} className={`option ${picked === sourceIndex ? 'picked' : ''} ${!neutral && solved && sourceIndex === correctIndex ? 'right' : ''} ${!neutral && picked === sourceIndex && picked !== correctIndex ? 'bad' : ''}`} onClick={() => onPick(sourceIndex)}><b>{String.fromCharCode(65 + displayIndex)}</b><span>{t(values[sourceIndex])}</span></button>)}</div>; };

const FormulaFlow = ({ items, frame }) => <div className="formula-flow">{items.map((item, index) => <React.Fragment key={item}><div className={`formula-chip ${frame >= index ? 'show' : ''}`}>{item}</div>{index < items.length - 1 && <i className={frame >= index + 1 ? 'show' : ''}>→</i>}</React.Fragment>)}</div>;

const RectangleDiagram = ({ a, b, frame = 0, letters = false, square = false, tiles = false, filled = false, rotated = false, compact = false }) => {
  const horizontal = rotated ? b : a; const vertical = rotated ? a : b;
  const cols = horizontal; const rows = vertical; const tileList = Array.from({ length: cols * rows }, (_, index) => index);
  return <div className={`shape-model ${filled ? 'filled' : ''} ${compact ? 'shape-model-compact' : ''}`}>
    <div className={`rect-shape ${square ? 'square-shape' : ''}`} style={{ aspectRatio: `${horizontal} / ${vertical}` }}>
      {tiles && <div className="tile-grid" style={{ gridTemplateColumns: `repeat(${cols},1fr)` }}>{tileList.map((index) => { const row = Math.floor(index / cols); return <i key={index} className={frame >= row ? 'tile-on' : ''}/>; })}</div>}
      <span className={frame >= 0 ? 'edge-on edge-top' : 'edge-top'}>{letters ? (rotated ? 'b' : 'a') : horizontal}</span>
      <span className={frame >= 1 ? 'edge-on edge-right' : 'edge-right'}>{letters ? (rotated ? 'a' : 'b') : vertical}</span>
      <span className={frame >= 2 ? 'edge-on edge-bottom' : 'edge-bottom'}>{letters ? (rotated ? 'b' : 'a') : horizontal}</span>
      <span className={frame >= 3 ? 'edge-on edge-left' : 'edge-left'}>{letters ? (rotated ? 'a' : 'b') : vertical}</span>
    </div>
  </div>;
};

function ChoiceExercise({ screen, choiceOrdinal = ({ 10: 0, 12: 1 }[screen] ?? 0), storedAnswer, onAnswer, onNext, onPrev, visual = null }) {
  const t = useT(); const c = ORDERED_CONTENT[screen]; const audio = useNarration(c.audio, screen);
  const [picked, setPicked] = useState(storedAnswer?.studentAnswerIndex ?? null); const [solved, setSolved] = useState(storedAnswer?.correct === true); const attempts = useRef(storedAnswer?.attempts ?? 0); const clean = useRef(storedAnswer?.firstTry ?? true);
  const optionOrder = buildOptionOrder(c.options.length, c.correctIndex, LESSON_META.lessonId, choiceOrdinal);
  const pick = (index) => { if (solved) return; attempts.current += 1; const ok = index === c.correctIndex; if (!ok) clean.current = false; setPicked(index); setSolved(ok); playSfx(ok ? 'correct' : 'wrong'); audio.pushOneOff(t(ok ? c.audio.on_correct : c.audio.on_wrong)); onAnswer({ screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question), options: c.options.map(t), correctIndex: c.correctIndex, correctAnswer: t(c.options[c.correctIndex]), studentAnswerIndex: index, studentAnswer: t(c.options[index]), correct: ok, firstTry: ok && clean.current && attempts.current === 1, attempts: attempts.current, solved: ok }); };
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} bit={screen === 12 ? 'awkward' : null}/>{visual}<section className="question"><h2>{t(c.question)}</h2><Options values={c.options} order={optionOrder} picked={picked} onPick={pick} correctIndex={c.correctIndex} solved={solved}/><FeedbackBlock show={picked !== null} correct={solved}>{picked !== null ? t(c.feedback[picked]) : ''}</FeedbackBlock></section></div></Stage>;
}

function NumericExercise({ screen, storedAnswer, onAnswer, onNext, onPrev, proof }) {
  const t = useT(); const c = ORDERED_CONTENT[screen]; const audio = useNarration(c.audio, screen); const [value, setValue] = useState(storedAnswer?.studentAnswer ?? ''); const [solved, setSolved] = useState(storedAnswer?.correct === true); const [message, setMessage] = useState(null); const attempts = useRef(storedAnswer?.attempts ?? 0); const clean = useRef(storedAnswer?.firstTry ?? true);
  const submit = () => { const answer = String(value).replace(/\D/g, ''); if (!answer || solved) return; attempts.current += 1; const ok = answer === c.answer; if (!ok) clean.current = false; setSolved(ok); const visualText = ok ? c.feedback.correct : c.feedback[answer] ?? c.feedback.default; setMessage(visualText); playSfx(ok ? 'correct' : 'wrong'); audio.pushOneOff(t(ok ? c.audio.on_correct : c.audio.on_wrong)); onAnswer({ screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question), correctAnswer: c.answer, studentAnswer: answer, correct: ok, firstTry: ok && clean.current && attempts.current === 1, attempts: attempts.current, solved: ok }); };
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c}/><section className="question"><h2>{t(c.question)}</h2><div className="input-row"><input className={`answer-input ${message ? solved ? 'is-correct' : 'is-wrong' : ''}`} inputMode="numeric" placeholder="0" value={value} disabled={solved} onChange={(event) => { setValue(event.target.value.replace(/\D/g, '').slice(0, 5)); setMessage(null); }} onKeyDown={(event) => event.key === 'Enter' && submit()}/><button type="button" className="btn-white-accent compact" onClick={submit} disabled={!value || solved}>{t({ uz: "Tekshirish", ru: 'Проверить' , en: "Check"})}</button></div><FeedbackBlock show={message !== null} correct={solved}>{message ? t(message) : ''}</FeedbackBlock>{solved && <div className="proof">{t(proof)}</div>}</section></div></Stage>;
}

function MatchingExercise({ screen, storedAnswer, onAnswer, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s8; const audio = useNarration(c.audio, screen);
  const restored = Array.isArray(storedAnswer?.studentAnswer) && storedAnswer.studentAnswer.length === c.situations.length ? storedAnswer.studentAnswer : Array(c.situations.length).fill(-1);
  const [matches, setMatches] = useState(restored); const [message, setMessage] = useState(null); const [solved, setSolved] = useState(storedAnswer?.correct === true); const attempts = useRef(storedAnswer?.attempts ?? 0); const clean = useRef(storedAnswer?.firstTry ?? true);
  const cycle = (index) => { if (solved) return; setMatches((previous) => previous.map((value, place) => place === index ? (value + 1) % c.formulas.length : value)); setMessage(null); };
  const submit = () => { if (matches.some((value) => value < 0) || solved) return; attempts.current += 1; const ok = matches.every((value, index) => value === c.answer[index]); if (!ok) clean.current = false; setSolved(ok); setMessage(ok ? c.audio.on_correct : c.audio.on_wrong); playSfx(ok ? 'correct' : 'wrong'); audio.pushOneOff(t(ok ? c.audio.on_correct : c.audio.on_wrong)); onAnswer({ screenIdx: screen, stage: SCREEN_META[screen].scope, question: t(c.question), correctAnswer: c.answer, studentAnswer: matches, correct: ok, firstTry: ok && clean.current && attempts.current === 1, attempts: attempts.current, solved: ok }); };
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c}/><section className="question"><h2>{t(c.question)}</h2><div className="matching">{c.situations.map((situation, index) => <div key={t(situation)}><span>{t(situation)}</span><button type="button" onClick={() => cycle(index)} disabled={solved}>{matches[index] < 0 ? t({ uz: "Formulani tanlang", ru: 'Выбери формулу', en: 'Choose a formula' }) : c.formulas[matches[index]]}</button></div>)}</div><button type="button" className="btn-white-accent check-wide" onClick={submit} disabled={matches.some((value) => value < 0) || solved}>{t({ uz: "Tekshirish", ru: 'Проверить' , en: "Check"})}</button><FeedbackBlock show={message !== null} correct={solved}>{message ? t(message) : ''}</FeedbackBlock></section></div></Stage>;
}

function Screen0({ screen, storedAnswer, onAnswer, onNext }) {
  const t = useT(); const c = CONTENT.s0; const audio = useNarration(c.audio, screen); const picked = storedAnswer?.studentAnswerIndex ?? null;
  const pick = (index) => onAnswer({ screenIdx: screen, stage: 'hook', question: t(c.question), options: c.options.map(t), correctIndex: null, correctAnswer: null, studentAnswerIndex: index, studentAnswer: t(c.options[index]), correct: true, firstTry: true, attempts: (storedAnswer?.attempts ?? 0) + 1, solved: true });
  return <Stage screen={screen} audio={audio} onNext={onNext} activityDone={picked !== null}><div className="stack hook-layout" data-g4-screen="hook"><Heading c={c}/><h2 className="hook-question-title" data-g4-role="hook-question">{t(c.question)}</h2><div className="hook-scene-shell" data-g4-role="hook-scene"><section className="model-card hook-card" data-g4-role="visual-frame"><span className="hook-frame-bit" data-g4-role="hook-bit"><BitSVG state="think"/></span><RectangleDiagram a={3} b={2} frame={audio.frame >= 1 ? 3 : -1}/><div className="dimension-note">{t({ uz: "3 sm × 2 sm", ru: '3 см × 2 см', en: '3 cm × 2 cm' })}</div></section></div><section className="question hook-question"><Options values={c.options} picked={picked} onPick={pick} neutral/><FeedbackBlock show={picked !== null} correct>{t(c.neutral)}</FeedbackBlock></section></div></Stage>;
}

function Screen1({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s1; const audio = useNarration(c.audio, screen);
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c}/><section className="model-card"><RectangleDiagram a={3} b={2} frame={audio.frame}/><div className={`formula-display ${audio.frame >= 3 ? 'show' : ''}`}>{t({ uz: "3 + 2 + 3 + 2 = 10 sm", ru: '3 + 2 + 3 + 2 = 10 см', en: '3 + 2 + 3 + 2 = 10 cm' })}</div></section></div></Stage>;
}

function Screen2({ screen, onNext, onPrev }) {
  const c = CONTENT.s2; const audio = useNarration(c.audio, screen);
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c}/><section className="model-card"><RectangleDiagram a={3} b={2} frame={3}/><FormulaFlow frame={audio.frame} items={['3 + 2 + 3 + 2', '(3 + 2) + (3 + 2)', '2 · (3 + 2)', '10']}/></section></div></Stage>;
}

function Screen3({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s3; const audio = useNarration(c.audio, screen);
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c}/><section className="two-methods"><RectangleDiagram a={4} b={5} frame={3}/><div><div className={audio.frame >= 1 ? 'formula-display show' : 'formula-display'}>{t({ uz: "4 + 5 + 4 + 5 = 18 sm", ru: '4 + 5 + 4 + 5 = 18 см', en: '4 + 5 + 4 + 5 = 18 cm' })}</div><div className={audio.frame >= 2 ? 'formula-display accent-formula show' : 'formula-display accent-formula'}>{t({ uz: "2 · (4 + 5) = 18 sm", ru: '2 · (4 + 5) = 18 см', en: '2 · (4 + 5) = 18 cm' })}</div><small>{t({ uz: "Ikkala yozuv ham bir xil natija beradi", ru: 'Обе записи дают один результат', en: 'Both expressions give the same result' })}</small></div></section></div></Stage>;
}

function Screen4({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s4; const audio = useNarration(c.audio, screen);
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c} bit="idea"/><section className="formula-rule"><RectangleDiagram a={3} b={2} frame={3} letters/><div className="letter-key"><span className={audio.frame >= 0 ? 'show' : ''}><b>a</b>{t({ uz: "uzunlik", ru: 'длина', en: 'length' })}</span><span className={audio.frame >= 0 ? 'show' : ''}><b>b</b>{t({ uz: "kenglik", ru: 'ширина', en: 'width' })}</span><span className={audio.frame >= 1 ? 'show' : ''}><b>P</b>{t({ uz: "perimetr", ru: 'периметр', en: 'perimeter' })}</span></div><div className={`master-formula ${audio.frame >= 2 ? 'show' : ''}`}>P = 2 · (a + b)</div><p className={audio.frame >= 3 ? 'show' : ''}>{t({ uz: "Harfli umumiy qoida — formula", ru: 'Общее правило с буквами — формула', en: 'A general rule using letters is a formula' })}</p></section></div></Stage>;
}

function Screen5({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s5; const audio = useNarration(c.audio, screen);
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c}/><section className="model-card substitution-card"><RectangleDiagram a={2} b={5} frame={3} rotated compact/><FormulaFlow frame={audio.frame} items={['P = 2 · (a + b)', 'P = 2 · (2 + 5)', 'P = 2 · 7', t({ uz: "P = 14 sm", ru: 'P = 14 см', en: 'P = 14 cm' })]}/></section></div></Stage>;
}

function Screen6({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s6; const audio = useNarration(c.audio, screen);
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c}/><section className="formula-rule square-rule"><RectangleDiagram a={3} b={3} frame={audio.frame} letters square/><FormulaFlow frame={audio.frame} items={['a + a + a + a', '4 · a', 'P = 4 · a']}/><p className={audio.frame >= 3 ? 'show' : ''}>{t({ uz: "Kvadratning to'rtta tomoni teng", ru: 'Четыре стороны квадрата равны', en: 'The four sides of a square are equal' })}</p></section></div></Stage>;
}

function Screen7({ screen, onNext, onPrev }) {
  const t = useT(); const c = CONTENT.s7; const audio = useNarration(c.audio, screen);
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={onNext}><div className="stack"><Heading c={c}/><section className="area-model"><RectangleDiagram a={4} b={3} frame={audio.frame} tiles/><div className={`master-formula ${audio.frame >= 3 ? 'show' : ''}`}>{t({ uz: "S = a · b = 4 · 3 = 12 sm²", ru: 'S = a · b = 4 · 3 = 12 см²', en: 'S = a · b = 4 · 3 = 12 cm²' })}</div><div className={`measure-contrast ${audio.frame >= 4 ? 'show' : ''}`}><span>{t({ uz: "Perimetr — chegara, sm", ru: 'Периметр — граница, см', en: 'Perimeter — boundary, cm' })}</span><span>{t({ uz: "Yuza — ichki qism, sm²", ru: 'Площадь — внутри, см²', en: 'Area — interior, cm²' })}</span></div></section></div></Stage>;
}

function Screen8(props) { return <MatchingExercise {...props}/>; }
function Screen9(props) { return <NumericExercise {...props} proof={{ uz: "P = 2 · (6 + 11) = 34 sm", ru: 'P = 2 · (6 + 11) = 34 см', en: 'P = 2 · (6 + 11) = 34 cm' }}/>; }
function Screen10(props) { return <NumericExercise {...props} proof={{ uz: "P = 4 · 7 = 28 sm", ru: 'P = 4 · 7 = 28 см', en: 'P = 4 · 7 = 28 cm' }}/>; }
function Screen11(props) { return <NumericExercise {...props} proof={{ uz: "S = 4 · 7 = 28 sm²", ru: 'S = 4 · 7 = 28 см²', en: 'S = 4 · 7 = 28 cm²' }}/>; }
function Screen12(props) { return <ChoiceExercise {...props} visual={<div className="bit-error"><span>a = 3</span><span>b = 2</span><b>P = a + b = 5</b></div>}/>; }
function Screen13(props) { return <ChoiceExercise {...props} visual={<div className="bit-error"><span>a = 5</span><span>b = 3</span><b>P = a + b = 8</b></div>}/>; }

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
    const timer = window.setTimeout(onComplete, window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 120 : 3900);
    return () => window.clearTimeout(timer);
  }, [active, onComplete]);
  if (!active) return null;
  return createPortal(<div className="rank-boost-overlay g4-title-reveal-overlay" data-g4-role="rank-overlay" role="status" aria-live="assertive"><div className="rank-boost-card g4-title-reveal-card"><div className="rank-boost-rays g4-title-reveal-rays" aria-hidden="true"/><div className="rank-boost-confetti g4-title-reveal-confetti" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i key={index}/>)}</div><div className="rank-boost-medal g4-title-reveal-medal">★</div><h2 className="g4-title-reveal-title">{title}</h2></div></div>, document.body);
}

function G4TitleCard({ title, firstTry, total, canFinish }) {
  return <aside className="g4-title-card g4-title-card-stage" data-g4-role="title-card" data-can-finish={canFinish}><div className="g4-title-card-confetti" data-g4-role="reward-confetti" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i key={index}/>)}</div><div className="g4-title-card-bit" data-g4-role="reward-bit"><BitSVG state="happy"/></div><div className="g4-title-card-medal" data-g4-role="reward-medal">★</div><span className="g4-title-card-kicker">TITLE EARNED</span><h2 className="g4-title-card-title">{title}</h2><div className="g4-title-card-score"><strong>{firstTry}/{total}</strong></div></aside>;
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
  return <div className="contract-final-reward" data-legacy-contract={legacyContract}>{titleState !== 'claimed' && <div className="final-reflection" data-g4-role="reflection">{choices.map((choice, index) => <button type="button" key={t(choice)} className={reflectionChoice === index ? 'selected' : ''} onClick={() => setReflectionChoice(index)}>{t(choice)}</button>)}</div>}{titleState === 'unclaimed' && <button type="button" className="g4-title-claim" data-g4-role="title-claim" disabled={reflectionChoice === null} onClick={claimTitle}><span>★</span><strong>{t({ uz: "Unvonni olish", ru: 'Получить звание', en: 'Claim title' })}</strong></button>}<G4TitleReveal active={titleState === 'revealing'} title={localizedTitle} onComplete={completeReveal}/>{titleState === 'claimed' && <G4TitleCard title={localizedTitle} firstTry={firstTry} total={total} canFinish={titleState === 'claimed'}/>}</div>;
}

const FINAL_AWARDS = [
  { ru: 'Архитектор формул', uz: "Formulalar me'mori", en: 'Formula Architect' },
  { ru: 'Мастер периметра и площади', uz: 'Perimetr va yuza ustasi', en: 'Master of Perimeter and Area' },
  { ru: 'Исследователь фигур', uz: 'Shakllar tadqiqotchisi', en: 'Shape Explorer' },
];

const FinaleReward = ({ answers = [] }) => {
  const scored = SCREEN_META.map((item, index) => item.scored ? index : null).filter((index) => index !== null);
  const total = scored.length;
  const firstTry = scored.filter((index) => answers[index]?.firstTry === true).length;
  const award = firstTry === total ? FINAL_AWARDS[0] : firstTry >= Math.max(1, total - 1) ? FINAL_AWARDS[1] : FINAL_AWARDS[2];
  return <ContractFinalReward title={award} firstTry={firstTry} total={total} />;
};

function Screen14({ screen, answers, onPrev, finishLesson }) {
  const t = useT(); const c = CONTENT.s14; const audio = useNarration(c.audio, screen); const frame = audio.frame; const complete = frame >= 4;
  const takeaways = [
    { label: { uz: "Formula", ru: 'Формула', en: 'Formula' }, value: { uz: "Bir xil bog'lanishni harflar bilan qisqa va umumiy yozadi", ru: 'Кратко и в общем виде записывает одну и ту же связь', en: 'Uses letters to write the same relationship concisely and generally' } },
    { label: { uz: "To'g'ri to'rtburchak perimetri", ru: 'Периметр прямоугольника', en: 'Perimeter of a rectangle' }, value: 'P = 2 · (a + b)' },
    { label: { uz: "Kvadrat perimetri", ru: 'Периметр квадрата', en: 'Perimeter of a square' }, value: 'P = 4 · a' },
    { label: { uz: "To'g'ri to'rtburchak yuzasi", ru: 'Площадь прямоугольника', en: 'Area of a rectangle' }, value: 'S = a · b' },
  ];
  return <Stage screen={screen} audio={audio} onPrev={onPrev} onNext={finishLesson} finish><div className="stack"><section className="finale-heading"><span>◆ {t({ uz: "YAKUNIY BOSQICH", ru: 'ФИНАЛЬНЫЙ ЭТАП' , en: "FINAL STAGE"})}</span><h1>{t(c.title)}</h1><p>{t({ uz: "Boshlang'ich panel chegarasidan uchta umumiy formulaga o'tamiz.", ru: 'Переходим от границы стартовой панели к трём общим формулам.', en: 'We move from the boundary of the starting panel to three general formulae.' })}</p></section><section className="finale-main"><div className="finale-payoff finale-concrete"><small>{t({ uz: "BOSHLANG'ICH MISSIYA YECHIMI", ru: 'РЕШЕНИЕ СТАРТОВОЙ МИССИИ', en: 'STARTING MISSION SOLUTION' })}</small><RectangleDiagram a={3} b={2} frame={Math.min(frame, 3)}/><div className={`finale-hook-answer ${frame >= 3 ? 'show' : ''}`}>3 + 2 + 3 + 2 = <b>{t({ uz: "10 sm", ru: '10 см', en: '10 cm' })}</b></div></div><div className="finale-takeaways">{takeaways.map((item, index) => <div className={`finale-takeaway ${frame >= index ? 'show' : ''}`} key={t(item.label)}><b>{index + 1}</b><span><small>{t(item.label)}</small><strong>{t(item.value)}</strong></span></div>)}</div></section><section className="finale-bottom"><div className={`finale-bridge ${complete ? 'show' : ''}`}><small>{t({ uz: "KEYINGI MAVZU", ru: 'СЛЕДУЮЩАЯ ТЕМА' , en: "NEXT TOPIC"})}</small><strong>{t({ uz: "Shkalalar: bo'linma qiymati", ru: 'Шкалы: цена деления', en: 'Scales: the value of one division' })}</strong></div><FinaleReward answers={answers} complete={complete} audio={audio}/></section></div></Stage>;
}

const BASE_SCREENS=[Screen0,Screen1,Screen2,Screen3,Screen4,Screen5,Screen6,Screen7,Screen8,Screen9,Screen10,Screen11,Screen12,Screen13,Screen14];
const SCREENS=SCREEN_FLOW.map((sourceIndex)=>BASE_SCREENS[sourceIndex]);

export default function Grade4Dars16({ studentName, lang: langProp, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished, previewMode }) {
  const showPreviewControls=langProp===undefined||langProp===null; const preview=previewMode??showPreviewControls; const [previewLang,setPreviewLang]=useState(normalizeLang(langProp)); const lang=showPreviewControls?previewLang:normalizeLang(langProp);
  configureLesson({ttsApiBase:ttsApiBase||'',voiceGender:voiceGender||'f',correctSoundUrl:correctSoundUrl||'',wrongSoundUrl:wrongSoundUrl||'',previewMode:preview});
  const [current,setCurrent]=useState(0); const [answers,setAnswers]=useState([]); const [activityState,setActivityState]=useState({}); const [finalRewardState,setFinalRewardState]=useState({reflectionChoice:null,titleState:'unclaimed'});
  // eslint-disable-next-line react-hooks/purity -- lesson duration starts when this component mounts
  const started=useRef(Date.now()); const finished=useRef(false);
  const markActivity=useCallback((screen,value=true)=>setActivityState((previous)=>Object.prototype.hasOwnProperty.call(previous,screen)&&previous[screen]===value?previous:{...previous,[screen]:value}),[]);
  const recordAnswer=useCallback((answer)=>{setAnswers((previous)=>{const next=[...previous];const old=previous[answer.screenIdx];next[answer.screenIdx]={...answer,firstTry:old?.firstTry===false?false:answer.firstTry};return next;});if(!SCREEN_META[answer.screenIdx].scored||answer.correct)markActivity(answer.screenIdx,answer.studentAnswerIndex??true);},[markActivity]);
  const finishLesson=useCallback(()=>{if(finished.current)return;finished.current=true;const scored=SCREEN_META.map((meta,index)=>meta.scored?index:null).filter((index)=>index!==null);const firstTryCorrect=scored.filter((index)=>answers[index]?.firstTry===true).length;const payload={lessonId:LESSON_META.lessonId,lessonTitle:LESSON_META.lessonTitle[lang],studentName:studentName||null,durationSec:Math.floor((Date.now()-started.current)/1000),totalQuestions:scored.length,correctAnswers:firstTryCorrect,scorePercent:Math.round(firstTryCorrect/scored.length*100),finalScore:firstTryCorrect,finalTotal:scored.length,passed:firstTryCorrect/scored.length>=0.6,firstTryStats:{total:scored.length,firstTryCorrect},attemptsTotal:scored.reduce((sum,index)=>sum+(answers[index]?.attempts??0),0),skillTags:LESSON_META.skillTags,answers:answers.filter(Boolean)};if(onFinished)onFinished(payload);else console.log('[Grade4 Dars16 preview]',payload);},[answers,lang,onFinished,studentName]);
  const Current=SCREENS[current];
  return <LangContext.Provider value={lang}><ActivityContext.Provider value={{activityState,markActivity,finalRewardState,setFinalRewardState}}><style>{STYLES}</style><div className={`lesson-root ${preview?'lesson-root-preview':''}`}>{showPreviewControls&&<div className="preview-language" aria-label={{ uz: 'Dars tili', ru: 'Язык урока', en: 'Lesson language' }[lang]}>{SUPPORTED_LANGS.map((code)=><button type="button" key={code} className={previewLang===code?'preview-active':''} onClick={()=>setPreviewLang(code)}>{code.toUpperCase()}</button>)}</div>}<Current key={current} screen={current} storedAnswer={answers[current]} answers={answers} onAnswer={recordAnswer} onPrev={()=>setCurrent((value)=>Math.max(0,value-1))} onNext={()=>setCurrent((value)=>Math.min(TOTAL_SCREENS-1,value+1))} finishLesson={finishLesson}/></div></ActivityContext.Provider></LangContext.Provider>;
}

const STYLES=`
.lesson-frame .preview-language{display:none!important}
@media(max-width:639.98px){.lesson-root [data-g4-role~="hook-scene"],.lesson-root [data-g4-role~="hook-scene"]>[data-g4-role~="visual-frame"]{min-height:164px!important;border-radius:18px!important}}
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
html:has(.lesson-root),body:has(.lesson-root),#root:has(.lesson-root),.lesson-page:has(.lesson-root),.lesson-frame:has(.lesson-root){width:100%;height:100%;min-height:0!important;margin:0;overflow:hidden!important;overscroll-behavior:none}
.lesson-root,.lesson-root *{box-sizing:border-box}.lesson-root h1,.lesson-root h2,.lesson-root h3,.lesson-root h4,.lesson-root h5,.lesson-root h6,.lesson-root p,.lesson-root ul,.lesson-root ol{margin:0}.lesson-root button,.lesson-root input{font:inherit}.lesson-root button:focus-visible,.lesson-root input:focus-visible{outline:3px solid ${T.cyan};outline-offset:3px}
.lesson-root{position:fixed;inset:0;width:100%;min-height:100dvh;color:${T.ink};background:radial-gradient(circle at 88% 9%,rgba(22,143,163,.11),transparent 25%),linear-gradient(145deg,#F7F8F4,#EEF3F1);font-family:'Manrope',system-ui,sans-serif}
.stage{width:min(936px,100%);height:100dvh;margin:0 auto;display:flex;flex-direction:column;overflow:hidden}.stage-header{flex-shrink:0;padding-top:10px;padding-bottom:8px;background:rgba(247,248,244,.88);backdrop-filter:blur(14px);z-index:5}.progress-track{width:100%;height:6px;margin-bottom:10px;border-radius:999px;background:rgba(80,97,109,.16);overflow:hidden}.progress-fill{height:100%;border-radius:inherit;background:linear-gradient(90deg,${T.cyan},${T.accent});box-shadow:0 0 12px rgba(255,91,53,.42);transition:width .45s ease}.stage-chrome{min-width:0;display:flex;justify-content:space-between;align-items:center;gap:12px}.chrome-title,.chrome-actions,.audio-controls{display:flex;align-items:center;gap:9px}.chrome-title{min-width:0;overflow:hidden;color:${T.ink2};font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}.chrome-title>span:last-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.chrome-actions{flex:none}.status-dot{width:8px;height:8px;flex:none;border-radius:50%;background:${T.accent};box-shadow:0 0 10px rgba(255,91,53,.65)}.screen-type{padding:4px 8px;border-radius:999px;color:${T.cyan};background:${T.cyanSoft};font-size:10px;font-weight:800}.screen-count{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700}.icon-btn{width:32px;height:32px;padding:0;border:0;border-radius:10px;color:${T.ink2};background:rgba(255,255,255,.75);cursor:pointer;box-shadow:0 4px 12px -7px rgba(${T.shadowBase},.3)}
.stage-content{flex:1 1 auto;min-height:0;padding-top:10px;padding-bottom:12px;overflow:visible}.stage-nav{flex:0 0 auto;min-height:64px;display:flex;align-items:center;justify-content:space-between;gap:12px;background:rgba(245,245,240,.95)}.btn-white-accent,.btn-ghost{min-width:128px;min-height:48px;padding:0 18px;border:0;border-radius:15px;cursor:pointer;font-weight:900}.btn-white-accent{color:${T.accent};background:#fff;box-shadow:0 12px 24px -17px rgba(255,91,53,.8)}.btn-white-accent:hover:not(:disabled){color:#fff;background:${T.accent}}.btn-white-accent:disabled{opacity:.42;cursor:not-allowed}.btn-ghost{color:${T.ink2};background:transparent}.btn-ghost:hover{background:#fff;box-shadow:0 10px 20px -16px rgba(${T.shadowBase},.5)}.compact{min-width:118px}.stack{display:grid;gap:12px;animation:page-in .45s cubic-bezier(.16,1,.3,1) both}.heading{min-height:72px;display:flex;align-items:center;justify-content:space-between;gap:16px}.heading>div{min-width:0}.heading>div>span{color:${T.cyan};font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.heading h1{margin-top:4px!important;font:750 clamp(25px,4vw,38px)/1.06 'Source Serif 4',Georgia,serif;overflow-wrap:anywhere}.heading .g1-char{width:68px;height:84px;flex:0 0 auto;overflow:visible;filter:drop-shadow(0 9px 11px rgba(23,59,82,.2))}.question,.model-card,.duel,.why-grid,.compare-card,.rule-card,.boundary,.summary-grid{padding:16px;border-radius:22px;background:rgba(255,255,255,.9);box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.48)}.question{display:grid;gap:10px}.question h2{font:720 clamp(17px,2.5vw,22px)/1.25 'Source Serif 4',Georgia,serif}.options{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}.option{min-width:0;min-height:58px;padding:9px;border:0;border-radius:16px;display:grid;grid-template-columns:28px minmax(0,1fr);align-items:center;gap:8px;color:${T.ink};background:#F8F8F4;text-align:left;cursor:pointer;box-shadow:0 10px 22px -20px rgba(${T.shadowBase},.46)}.option span{min-width:0;overflow-wrap:anywhere}.option>b{width:27px;height:27px;border-radius:9px;display:grid;place-items:center;color:${T.cyan};background:${T.cyanSoft};font:900 11px 'JetBrains Mono',monospace}.option.picked{transform:translateY(-2px);background:${T.accentSoft};box-shadow:inset 0 0 0 2px rgba(255,91,53,.27)}.option.right{background:${T.successSoft};box-shadow:inset 0 0 0 2px rgba(34,122,83,.25)}.option.bad{background:${T.warnSoft};box-shadow:inset 0 0 0 2px rgba(169,111,19,.25)}.feedback{min-height:54px;padding:9px 12px;border-radius:15px;visibility:hidden;display:grid;grid-template-columns:28px minmax(0,1fr);gap:9px;align-items:start;opacity:0;transform:translateY(6px)}.feedback.open{visibility:visible;opacity:1;transform:none;transition:.3s ease}.feedback.correct{background:${T.successSoft};box-shadow:inset 4px 0 ${T.success}}.feedback.wrong{background:${T.warnSoft};box-shadow:inset 4px 0 ${T.warn}}.feedback>b{font-size:18px}.feedback p{min-width:0;font-size:13px;line-height:1.4;overflow-wrap:anywhere}.caption{position:static;margin-top:10px;padding:8px 12px;border-radius:13px;color:#fff;background:rgba(23,59,82,.94);font-size:12px;line-height:1.4;z-index:3}.stage-summary .stage-content{position:relative}.summary-happy-bit{position:absolute;right:14px;top:4px;width:58px;height:72px;z-index:2}.stage-summary .finale-heading{padding-right:78px}
.duel{display:grid;grid-template-columns:1fr 1fr;gap:12px;position:relative}.duel .best{grid-column:1/-1;display:flex;justify-content:center;align-items:center;gap:14px;color:${T.navy};font:900 18px 'JetBrains Mono',monospace}.duel .best b{color:${T.accent}}.bars-wrap{min-height:190px;position:relative;padding:12px 8px 8px}.bars-title{text-align:center;color:${T.navy};font-weight:900}.bars{height:150px;display:flex;align-items:flex-end;justify-content:center;gap:7px;border-bottom:2px solid rgba(23,59,82,.18)}.bar-col{width:min(42px,16%);height:140px;display:flex;align-items:flex-end}.bar{width:100%;min-height:22px;border-radius:10px 10px 4px 4px;display:grid;place-items:start center;padding-top:5px;color:#fff;background:linear-gradient(180deg,${T.cyan},${T.navy});transition:height .9s cubic-bezier(.16,1,.3,1)}.bar.equalized{background:linear-gradient(180deg,${T.lime},${T.success})}.bar b{font:900 11px 'JetBrains Mono',monospace}.target-line{position:absolute;left:7%;right:7%;height:2px;background:${T.accent};transition:.5s ease}.target-line span{position:absolute;right:0;bottom:5px;color:${T.accent};font:900 11px 'JetBrains Mono',monospace}.sum-badge.show,.mean-badge.show,.bridge.show,.show{opacity:1!important;transform:none!important}.sum-badge,.mean-badge{margin-top:8px;padding:10px 13px;border-radius:13px;opacity:.12;color:${T.navy};background:${T.cyanSoft};text-align:center;font:900 15px 'JetBrains Mono',monospace;transition:.4s ease}.mean-badge{color:${T.success};background:${T.successSoft}}.formula-flow{min-height:190px;display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap}.formula-chip{padding:13px 15px;border-radius:15px;opacity:.12;transform:translateY(8px);color:${T.navy};background:${T.cyanSoft};font:900 clamp(15px,2.3vw,20px) 'JetBrains Mono',monospace;transition:.45s ease}.formula-flow i{opacity:.12;color:${T.accent};font:900 22px 'JetBrains Mono',monospace;font-style:normal;transition:.35s ease}.why-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.why-grid>div{min-height:170px;padding:18px;border-radius:18px;display:grid;place-items:center;gap:8px;opacity:.32;background:#F8F8F4}.why-grid>div.active{opacity:1}.why-grid s,.why-grid b{font:900 25px 'JetBrains Mono',monospace}.why-grid s{color:${T.warn}}.why-grid small{color:${T.ink2}}.why-grid .correct-tile{background:${T.successSoft};color:${T.success}}.compare-card{min-height:230px;display:grid;grid-template-columns:1fr 30px 1fr;align-items:center;gap:10px;text-align:center}.compare-card>div{padding:18px;border-radius:18px;display:grid;gap:8px;opacity:.12;background:${T.cyanSoft}}.compare-card span{color:${T.ink2};font-weight:800}.compare-card b{color:${T.navy};font:900 28px 'JetBrains Mono',monospace}.compare-card i{color:${T.accent};font-style:normal;font-weight:900}.compare-card>strong,.compare-card>p{grid-column:1/-1;opacity:.12}.compare-card>strong{color:${T.success};font:900 22px 'JetBrains Mono',monospace}.compare-card>p{font-weight:850}.rule-card{display:grid;gap:14px}.rule-formula{padding:16px;border-radius:16px;color:#fff;background:${T.navy};text-align:center;font:800 clamp(14px,2.3vw,19px) 'JetBrains Mono',monospace}.rule-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.rule-steps>div{min-height:90px;padding:11px;border-radius:15px;display:grid;grid-template-columns:30px 1fr;align-items:center;gap:8px;opacity:.18;background:#F8F8F4}.rule-steps>div.active{background:${T.accentSoft};box-shadow:inset 0 0 0 2px rgba(255,91,53,.2)}.rule-steps b{width:28px;height:28px;border-radius:9px;display:grid;place-items:center;color:#fff;background:${T.accent};font:900 11px 'JetBrains Mono',monospace}.rule-steps span{font-size:12px;font-weight:800;line-height:1.35}.boundary{display:grid;gap:18px}.number-line{height:80px;position:relative;margin:15px 4%;border-top:4px solid ${T.navy}}.number-line span,.number-line b{position:absolute;top:-19px;transform:translateX(-50%);width:38px;height:38px;border-radius:50%;display:grid;place-items:center;background:#fff;box-shadow:0 8px 18px -12px rgba(${T.shadowBase},.6);font:900 13px 'JetBrains Mono',monospace}.number-line b{opacity:.12;color:#fff;background:${T.accent}}.boundary>p{opacity:.12;color:${T.success};text-align:center;font-weight:850}.data-row{padding:14px;display:flex;justify-content:center;gap:8px}.data-row span{padding:12px 14px;border-radius:13px;color:${T.navy};background:${T.cyanSoft};font:900 17px 'JetBrains Mono',monospace}.input-row{display:flex;gap:10px}.answer-input{min-width:0;min-height:54px;flex:1;padding:10px 16px;border:0;border-radius:15px;outline:0;color:${T.navy};background:#F8F8F4;box-shadow:inset 0 0 0 2px rgba(135,148,157,.2);font:900 20px 'JetBrains Mono',monospace}.answer-input:focus{box-shadow:0 0 0 4px rgba(22,143,163,.14)}.answer-input.is-correct{background:${T.successSoft};box-shadow:inset 0 0 0 2px rgba(34,122,83,.3)}.answer-input.is-wrong{background:${T.warnSoft};box-shadow:inset 0 0 0 2px rgba(169,111,19,.3)}.proof{padding:12px;border-radius:14px;color:${T.success};background:${T.successSoft};text-align:center;font:900 15px 'JetBrains Mono',monospace}.order-area{display:grid;gap:11px}.order-result{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;min-height:76px}.order-result>div{padding:10px;border-radius:14px;display:grid;grid-template-columns:25px 1fr;align-items:center;gap:7px;background:${T.cyanSoft};font-size:11px;font-weight:800}.order-result b{width:24px;height:24px;border-radius:8px;display:grid;place-items:center;color:#fff;background:${T.cyan}}.card-bank{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}.card-bank button,.tiny-action{min-height:46px;padding:8px 12px;border:0;border-radius:13px;cursor:pointer;background:#F8F8F4;box-shadow:0 8px 18px -16px rgba(${T.shadowBase},.5);font-size:12px;font-weight:800}.card-bank button:disabled{opacity:.35}.tiny-action{justify-self:end;color:${T.accent};background:${T.accentSoft}}.line-choice{padding:22px;display:flex;align-items:center;justify-content:center;gap:0}.line-choice span,.line-choice b{width:48px;height:48px;border-radius:50%;display:grid;place-items:center;color:${T.navy};background:${T.cyanSoft};font:900 15px 'JetBrains Mono',monospace}.line-choice b{color:#fff;background:${T.accent}}.line-choice i{width:90px;height:4px;background:linear-gradient(90deg,${T.cyan},${T.accent})}.bit-error{padding:14px;display:grid;grid-template-columns:repeat(4,1fr);gap:7px}.bit-error span{padding:9px;border-radius:12px;background:${T.cyanSoft};text-align:center;font:900 14px 'JetBrains Mono',monospace}.bit-error b{grid-column:1/-1;padding:12px;border-radius:13px;color:${T.warn};background:${T.warnSoft};text-align:center;font:900 17px 'JetBrains Mono',monospace}.passengers{padding:14px;display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.passengers>div{padding:12px;border-radius:15px;display:grid;gap:6px;text-align:center;background:${T.cyanSoft}}.passengers span{color:${T.ink3};font-size:11px}.passengers b{color:${T.navy};font:900 18px 'JetBrains Mono',monospace}.passengers strong{grid-column:1/-1;padding:11px;border-radius:13px;color:#fff;background:${T.navy};text-align:center;font:900 16px 'JetBrains Mono',monospace}.summary-grid{display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:12px}.summary-formula{padding:16px;border-radius:16px;color:#fff;background:${T.navy};font:900 clamp(15px,2.4vw,20px) 'JetBrains Mono',monospace;text-align:center}.summary-rules{grid-template-columns:repeat(4,1fr)}.bridge{padding:13px 16px;border-radius:16px;display:grid;gap:4px;opacity:.15;color:#fff;background:${T.navy}}.bridge span{color:#9DE3E7;font-size:10px;font-weight:900;letter-spacing:.08em}.bridge strong{font:750 16px 'Source Serif 4',Georgia,serif}.preview-language{position:fixed;top:9px;right:9px;z-index:30;display:flex;gap:3px;padding:3px;border-radius:999px;background:rgba(255,255,255,.94);box-shadow:0 8px 20px -14px rgba(${T.shadowBase},.6)}.preview-language button{padding:4px 9px;border:0;border-radius:999px;color:${T.ink2};background:transparent;cursor:pointer;font-size:10px;font-weight:900}.preview-language .preview-active{color:#FFFFFF;background:${T.accent}}.g1-bit-ant{transform-origin:60px 28px;animation:antenna 2.1s ease-in-out 2}.g1-bit-wave,.bit-wave-left,.bit-wave-right,.bit-think-hand,.bit-point-arm,.bit-nod-hand{transform-origin:84px 76px;animation:think 1.7s ease-in-out 2}.bit-double-wave,.bit-awkward-hands,.bit-focus-hands{transform-origin:center;animation:happy 1.2s ease-in-out 2 alternate}.bit-idea-bulb,.bit-point-target,.bit-focus-scan,.bit-nod-check{animation:pulse 1.35s ease-in-out 2 alternate}
.shape-model{min-height:205px;display:grid;place-items:center;padding:28px 42px}.shape-model-compact{min-height:132px;padding:18px 32px}.shape-model-compact .rect-shape{width:min(220px,58%);min-width:150px}.substitution-card .formula-flow{min-height:124px}.rect-shape{width:min(330px,72%);min-width:180px;position:relative;border:5px solid rgba(23,59,82,.2);background:rgba(22,143,163,.08);transition:.4s ease}.square-shape{width:min(230px,58%)}.rect-shape>span{position:absolute;min-width:34px;min-height:26px;padding:4px 7px;border-radius:9px;display:grid;place-items:center;opacity:.2;color:${T.navy};background:#fff;box-shadow:0 8px 18px -14px rgba(${T.shadowBase},.6);font:900 13px 'JetBrains Mono',monospace;transition:.35s ease}.rect-shape>span.edge-on{opacity:1;color:#fff;background:${T.accent}}.edge-top{left:50%;top:-20px;transform:translateX(-50%)}.edge-bottom{left:50%;bottom:-20px;transform:translateX(-50%)}.edge-right{right:-22px;top:50%;transform:translateY(-50%)}.edge-left{left:-22px;top:50%;transform:translateY(-50%)}.dimension-note,.formula-display,.master-formula{padding:12px 15px;border-radius:14px;color:${T.navy};background:${T.cyanSoft};text-align:center;font:900 clamp(14px,2.3vw,20px) 'JetBrains Mono',monospace}.formula-display,.master-formula{opacity:.12;transform:translateY(7px);transition:.4s ease}.accent-formula,.master-formula{color:#fff;background:${T.navy}}.two-methods,.formula-rule,.area-model,.summary-formulas{padding:18px;border-radius:22px;background:rgba(255,255,255,.9);box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.48)}.two-methods{display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:14px}.two-methods>div:last-child{display:grid;gap:10px}.two-methods small{color:${T.success};text-align:center;font-weight:850}.formula-rule,.area-model{display:grid;gap:13px}.formula-rule>.shape-model,.area-model>.shape-model{min-height:170px;padding-block:23px}.letter-key{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.letter-key span{min-height:54px;padding:9px;border-radius:13px;display:grid;grid-template-columns:30px 1fr;align-items:center;gap:7px;opacity:.15;background:#F8F8F4;font-size:12px;font-weight:800}.letter-key b{width:28px;height:28px;border-radius:9px;display:grid;place-items:center;color:#fff;background:${T.cyan};font:900 13px 'JetBrains Mono',monospace}.formula-rule p{opacity:.15;color:${T.success};text-align:center;font-weight:900}.square-rule .formula-flow{min-height:100px}.tile-grid{position:absolute;inset:0;display:grid}.tile-grid i{min-width:0;min-height:0;opacity:.12;background:${T.cyanSoft};box-shadow:inset 0 0 0 1px rgba(23,59,82,.2);transition:.35s ease}.tile-grid i.tile-on{opacity:1;background:rgba(149,201,61,.54)}.measure-contrast{display:grid;grid-template-columns:1fr 1fr;gap:9px;opacity:.15}.measure-contrast span{padding:12px;border-radius:14px;text-align:center;font-weight:850}.measure-contrast span:first-child{color:${T.accent};background:${T.accentSoft}}.measure-contrast span:last-child{color:${T.success};background:${T.successSoft}}.matching{display:grid;gap:9px}.matching>div{display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:10px;padding:9px;border-radius:14px;background:#F8F8F4}.matching span{font-size:12px;font-weight:850}.matching button{min-height:47px;border:0;border-radius:12px;color:${T.navy};background:${T.cyanSoft};cursor:pointer;font:800 12px 'JetBrains Mono',monospace}.check-wide{justify-self:end}.park-model{position:relative;padding:8px 60px}.park-model .shape-model{min-height:170px}.park-model .rect-shape{background:repeating-linear-gradient(45deg,rgba(149,201,61,.46),rgba(149,201,61,.46) 12px,rgba(22,143,163,.18) 12px,rgba(22,143,163,.18) 24px)}.park-model>span,.park-model>b{position:absolute;color:${T.navy};font:900 14px 'JetBrains Mono',monospace}.park-model>span{left:50%;bottom:8px}.park-model>b{right:20px;top:50%}.summary-formulas{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.summary-formulas>div{min-height:112px;padding:13px;border-radius:16px;display:grid;place-items:center;gap:8px;opacity:.14;text-align:center;background:${T.cyanSoft}}.summary-formulas span{font-size:12px;font-weight:800}.summary-formulas b{color:${T.navy};font:900 15px 'JetBrains Mono',monospace}
.finale-heading{min-width:0;padding:11px 15px;border-radius:17px;background:linear-gradient(100deg,rgba(255,91,53,.09),transparent 52%),rgba(255,255,255,.92);box-shadow:0 13px 28px -24px rgba(255,91,53,.72)}.finale-heading>span{display:flex;align-items:center;gap:6px;color:${T.accent};font:900 9px/1.2 'JetBrains Mono',monospace;letter-spacing:.12em}.finale-heading h1{margin-top:4px!important;color:${T.navy};font:750 clamp(21px,3vw,28px)/1.08 'Source Serif 4',Georgia,serif}.finale-heading p{margin-top:4px!important;color:${T.ink2};font-size:11px;line-height:1.35}
.finale-main{min-width:0;display:grid;grid-template-columns:minmax(270px,.9fr) minmax(310px,1.1fr);align-items:stretch;gap:10px}.finale-payoff{min-width:0;padding:11px 13px;border-radius:18px;display:grid;align-content:center;gap:7px;background:#fff;box-shadow:0 18px 34px -28px rgba(${T.shadowBase},.5)}.finale-payoff>small{color:${T.cyan};font-size:9px;font-weight:900;letter-spacing:.09em}.finale-concrete .shape-model{min-height:148px;padding:25px 36px}.finale-concrete .rect-shape{width:min(260px,72%)}.finale-hook-answer{min-width:0;padding:8px 10px;border-radius:11px;opacity:.14;transform:translateY(5px);color:${T.ink2};background:#F8F8F4;text-align:center;font:900 12px/1.25 'JetBrains Mono',monospace;transition:.42s ease}.finale-hook-answer.show{opacity:1;transform:none}.finale-hook-answer b{color:${T.success}}
.finale-takeaways{min-width:0;display:grid;gap:6px}.finale-takeaway{min-width:0;min-height:40px;padding:7px 10px;border-radius:12px;display:grid;grid-template-columns:27px minmax(0,1fr);align-items:center;gap:8px;opacity:.14;transform:translateY(6px);background:#F8F8F4;transition:opacity .42s ease,transform .42s ease,background .42s ease}.finale-takeaway.show{opacity:1;transform:none;background:${T.cyanSoft}}.finale-takeaway>b{width:26px;height:26px;border-radius:9px;display:grid;place-items:center;color:#fff;background:${T.cyan};font:900 9px/1 'JetBrains Mono',monospace}.finale-takeaway span{min-width:0;display:grid;gap:2px;color:${T.ink2};font-size:11px;font-weight:800;line-height:1.25;overflow-wrap:anywhere}.finale-takeaway span small{color:${T.cyan};font-size:8px;font-weight:900;text-transform:uppercase}.finale-takeaway span strong{font-weight:850}.finale-takeaway:nth-child(n+2) span strong{color:${T.navy};font-family:'JetBrains Mono',monospace}
.finale-bottom{min-width:0;display:grid;grid-template-columns:minmax(0,1.2fr) minmax(270px,.8fr);gap:10px}.finale-bridge{min-width:0;padding:12px 15px;border-radius:16px;display:grid;align-content:center;gap:4px;opacity:.14;transform:translateY(6px);color:#fff;background:${T.navy};transition:.42s ease}.finale-bridge.show{opacity:1;transform:none}.finale-bridge small{color:#98E1E5;font-size:9px;font-weight:900;letter-spacing:.1em}.finale-bridge strong{font:750 15px/1.3 'Source Serif 4',Georgia,serif}
.finale-reward{min-width:0;min-height:100px;position:relative;overflow:hidden;padding:12px 72px 11px 58px;border-radius:17px;display:grid;align-content:center;color:#fff;background:linear-gradient(135deg,#234B62,${T.navy});box-shadow:0 17px 34px -27px rgba(${T.shadowBase},.74);transition:filter .45s ease,box-shadow .45s ease}.finale-reward:not(.complete){filter:saturate(.72)}.finale-reward.complete{box-shadow:0 17px 36px -22px rgba(149,201,61,.72)}.finale-medal{position:absolute;left:11px;top:50%;width:38px;height:38px;border:3px solid rgba(255,255,255,.72);border-radius:50%;display:grid;place-items:center;transform:translateY(-50%);color:${T.navy};background:${T.lime};font-size:17px;font-weight:900}.finale-reward-copy{min-width:0;display:grid;gap:3px}.finale-reward-copy>small{color:#98E1E5;font-size:8px;font-weight:900;letter-spacing:.09em}.finale-reward-copy>strong{font:750 15px/1.15 'Source Serif 4',Georgia,serif}.finale-status{min-width:0;display:flex;align-items:center;gap:6px}.finale-status b{flex:none;color:#FFE284;font:900 11px/1 'JetBrains Mono',monospace}.finale-status span{min-width:0;color:rgba(255,255,255,.72);font-size:8px;line-height:1.2}.finale-reward-bit{position:absolute;right:2px;bottom:-4px;width:68px;height:86px}.finale-reward-bit .g1-char{width:100%;height:100%}.finale-reward.complete .finale-reward-bit{animation:happy 2.8s ease-in-out 2 alternate}.finale-confetti{position:absolute;inset:0;pointer-events:none}.finale-confetti i{position:absolute;top:-12px;width:5px;height:9px;border-radius:2px;background:#FFC23C;animation:finaleFall 2.8s linear 2}.finale-confetti i:nth-child(2n){background:${T.accent}}.finale-confetti i:nth-child(3n){background:#77E1EA}.finale-confetti i:nth-child(1){left:9%;animation-delay:-.2s}.finale-confetti i:nth-child(2){left:22%;animation-delay:-1.1s}.finale-confetti i:nth-child(3){left:35%;animation-delay:-.7s}.finale-confetti i:nth-child(4){left:48%;animation-delay:-1.8s}.finale-confetti i:nth-child(5){left:61%;animation-delay:-.4s}.finale-confetti i:nth-child(6){left:73%;animation-delay:-1.4s}.finale-confetti i:nth-child(7){left:84%;animation-delay:-.9s}.finale-confetti i:nth-child(8){left:93%;animation-delay:-2s}@keyframes finaleFall{to{transform:translateY(118px) rotate(180deg)}}
@keyframes page-in{from{opacity:0;transform:translateY(10px)}}@keyframes antenna{50%{transform:rotate(5deg)}}@keyframes think{50%{transform:rotate(-5deg) translateY(-2px)}}@keyframes happy{to{transform:translateY(-3px)}}@keyframes pulse{to{transform:scale(1.06)}}
.stage-hook .model-card{position:relative;isolation:isolate;overflow:hidden;border:1px solid rgba(144,228,235,.12);border-radius:24px;background:radial-gradient(circle at 87% 24%,rgba(121,211,218,.16),transparent 24%),radial-gradient(circle at 9% 88%,rgba(149,201,61,.11),transparent 25%),linear-gradient(145deg,rgba(22,143,163,.25),transparent 48%),linear-gradient(135deg,#153B50,#0B2232 72%);box-shadow:0 22px 50px -30px rgba(14,33,44,.75)}
.stage-hook .model-card .rect-shape{border-color:rgba(234,249,251,.55);background:rgba(121,211,218,.12)}
.stage-hook .hook-layout{grid-template-columns:1fr;align-items:start}.stage-hook .hook-layout .heading{grid-column:1}.stage-hook .hook-card{width:100%;height:auto;min-height:138px;padding:11px 24px}.stage-hook .hook-card .shape-model{min-height:112px;padding:14px 30px}.stage-hook .hook-question{height:auto}.stage-hook .hook-question .options{grid-template-columns:repeat(2,minmax(0,1fr))}
@media(max-width:639.98px){.stage-header{padding-top:60px}.screen-type{display:none}.stage{width:min(390px,100%)}.heading{min-height:68px}.heading h1{font-size:26px}.heading .g1-char{width:66px;height:82px}.question,.model-card,.duel,.why-grid,.compare-card,.rule-card,.boundary,.summary-grid,.two-methods,.formula-rule,.area-model,.summary-formulas{padding:13px;border-radius:18px}.options{grid-template-columns:1fr}.option{min-height:52px}.duel,.summary-grid,.two-methods{grid-template-columns:1fr}.bars-wrap{min-height:166px}.bars{height:126px}.bar-col{height:118px}.bar{transform:scaleY(.82);transform-origin:bottom}.why-grid{grid-template-columns:1fr}.compare-card{grid-template-columns:1fr 24px 1fr}.rule-steps,.summary-rules,.summary-formulas{grid-template-columns:1fr}.rule-steps>div{min-height:55px}.formula-flow{min-height:120px}.order-result{grid-template-columns:1fr}.input-row{flex-direction:column}.stage-nav{min-height:68px}.btn-white-accent,.btn-ghost{min-width:112px;padding:0 12px}.passengers{grid-template-columns:1fr 1fr 1fr}.shape-model{min-height:165px;padding:25px 30px}.shape-model-compact{min-height:118px;padding:17px 26px}.shape-model-compact .rect-shape{width:min(205px,64%);min-width:140px}.substitution-card .formula-flow{min-height:105px;gap:6px}.substitution-card .formula-chip{padding:10px 11px;font-size:14px}.formula-rule>.shape-model,.area-model>.shape-model{min-height:145px}.letter-key{grid-template-columns:1fr}.measure-contrast,.matching>div{grid-template-columns:1fr}.summary-formulas>div{min-height:72px}.park-model{padding-inline:22px}.park-model .shape-model{min-height:145px}.park-model>b{right:2px}}
@media(prefers-reduced-motion:reduce){.lesson-root *,.lesson-root *::before,.lesson-root *::after{scroll-behavior:auto!important;animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important}.formula-chip,.formula-flow i,.sum-badge,.mean-badge,.compare-card>div,.compare-card>strong,.compare-card>p,.boundary>p,.number-line b,.bridge,.formula-display,.master-formula,.letter-key span,.formula-rule p,.measure-contrast,.summary-formulas>div,.tile-grid i{opacity:1!important;transform:none!important}}
@media(max-width:639.98px){.finale-heading{padding:9px 11px}.finale-heading h1{font-size:21px}.finale-heading p{font-size:9px}.finale-main,.finale-bottom{grid-template-columns:1fr}.finale-payoff{padding:9px 11px}.finale-concrete .shape-model{min-height:130px;padding:22px 30px}.finale-takeaway{min-height:38px;padding:6px 8px}.finale-reward{min-height:92px;padding:10px 62px 9px 51px}.finale-medal{left:9px;width:34px;height:34px}.finale-reward-bit{width:58px;height:74px}.finale-reward-copy>strong{font-size:14px}}
@media(max-width:639.98px){.stage-summary .stack{gap:9px}.stage-summary .finale-heading{padding:7px 9px}.stage-summary .finale-heading p{font-size:8.5px;line-height:1.25}.stage-summary .finale-main,.stage-summary .finale-bottom{gap:8px}.stage-summary .finale-payoff{padding:7px 9px;gap:5px}.stage-summary .finale-concrete .shape-model{min-height:112px;padding:20px 26px}.stage-summary .finale-concrete .rect-shape{width:min(150px,56%);min-width:140px}.stage-summary .finale-hook-answer{padding:6px 8px}.stage-summary .finale-takeaways{gap:4px}.stage-summary .finale-takeaway{min-height:34px;padding:4px 7px;grid-template-columns:25px minmax(0,1fr);gap:6px}.stage-summary .finale-takeaway>b{width:24px;height:24px}.stage-summary .finale-takeaway span{font-size:10px;line-height:1.22}.stage-summary .finale-bridge{padding:8px 11px}.stage-summary .finale-bridge strong{font-size:13px}.stage-summary .finale-reward{min-height:80px;padding:8px 56px 7px 47px}.stage-summary .finale-medal{left:8px;width:30px;height:30px}.stage-summary .finale-reward-bit{width:52px;height:66px}.stage-summary .finale-reward-copy>strong{font-size:13px}.stage-summary .finale-status span{font-size:7.5px}}
@media(max-width:639.98px){.stage-content{padding-top:7px;padding-bottom:7px}.heading{min-height:60px}.heading .g1-char{width:54px;height:68px}.stack{gap:8px}.input-row{flex-direction:row}.matching>div{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}.feedback{min-height:50px;padding:7px 9px}.stage-nav{min-height:58px}.stage-summary .finale-heading{padding-right:68px}.summary-happy-bit{right:9px;width:52px;height:66px}}
.stage-content{overflow:hidden;overscroll-behavior:none}.stage-nav{position:relative;z-index:6}
@media(prefers-reduced-motion:reduce){.finale-takeaway,.finale-hook-answer,.finale-bridge{opacity:1!important;transform:none!important}}
.stage-content{position:relative;overflow:hidden!important;padding-bottom:54px!important}.stage-body{height:100%;min-height:0;overflow:visible}.caption.caption-slot{position:absolute;left:clamp(14px,5vw,48px);right:clamp(14px,5vw,48px);bottom:5px;width:auto;max-width:none;min-height:40px;margin:0;display:grid;place-items:center;visibility:hidden;opacity:0;pointer-events:none}.caption.caption-slot.visible{visibility:visible;opacity:1}.activity-slot{min-height:48px;margin-top:7px;display:flex;align-items:center;justify-content:center;gap:6px}.activity-slot button{min-height:44px;padding:7px 12px;border:0;border-radius:13px;color:${T.cyan};background:${T.cyanSoft};font-weight:900;cursor:pointer}.activity-slot button.selected{color:#fff;background:${T.success}}.finale-reflection{display:grid;grid-template-columns:repeat(3,minmax(0,1fr))}.finale-reflection button{min-width:0;font-size:11px}.btn-white-accent:disabled{opacity:.42;cursor:not-allowed;transform:none}.lesson-root,.stage,.stage-content{overflow:hidden;overscroll-behavior:none}.stage-body{overscroll-behavior:none}@media(max-width:390px){.caption.caption-slot{left:14px;right:14px}.finale-reflection button{padding:5px 6px;font-size:9px}}@media(max-height:700px){.stage-header{padding-top:7px;padding-bottom:5px}.stage-content{padding-top:5px!important}.stack{gap:7px}.heading{min-height:54px}.heading h1{font-size:23px}.heading .g1-char{width:50px;height:62px}.activity-slot{margin-top:4px}.stage-nav{min-height:56px}.stage-hook .heading{min-height:46px}.stage-hook .heading .g1-char{width:42px;height:52px}.stage-hook .model-card{padding:8px}.stage-hook .shape-model{min-height:96px;padding:14px 26px}.stage-hook .dimension-note{padding:6px 8px;font-size:12px}.stage-hook .question{padding:8px;gap:5px}.stage-hook .question h2{font-size:15px}.stage-hook .options{grid-template-columns:repeat(3,minmax(0,1fr));gap:5px}.stage-hook .option{min-height:68px;padding:6px;grid-template-columns:22px minmax(0,1fr);gap:4px;font-size:11px}.stage-hook .option>b{width:22px;height:22px}.stage-hook .feedback{min-height:44px;padding:5px 7px}}
@media(min-width:640px){.stage:not(.stage-hook):not(.stage-summary) .stage-body{position:relative;padding-right:180px}.stage:not(.stage-hook):not(.stage-summary) .activity-slot{position:absolute;right:0;top:50%;width:170px;transform:translateY(-50%)}.stage:not(.stage-hook):not(.stage-summary) .heading{min-height:62px}.stage:not(.stage-hook):not(.stage-summary) .heading .g1-char{width:56px;height:68px}.stage:not(.stage-hook):not(.stage-summary) .stack{gap:8px}.stage:not(.stage-hook):not(.stage-summary) .question,.stage:not(.stage-hook):not(.stage-summary) .model-card,.stage:not(.stage-hook):not(.stage-summary) .two-methods,.stage:not(.stage-hook):not(.stage-summary) .formula-rule,.stage:not(.stage-hook):not(.stage-summary) .area-model,.stage:not(.stage-hook):not(.stage-summary) .summary-formulas{padding:10px}.stage:not(.stage-hook):not(.stage-summary) .shape-model{min-height:132px;padding:18px 30px}.stage:not(.stage-hook):not(.stage-summary) .formula-flow{min-height:105px}.stage:not(.stage-hook):not(.stage-summary) .letter-key span{min-height:48px}.stage:not(.stage-hook):not(.stage-summary) .feedback{min-height:48px;padding:6px 8px}}
@media(min-width:640px) and (max-width:1100px){.stage:not(.stage-hook):not(.stage-summary) .stage-body{padding-right:160px}.stage:not(.stage-hook):not(.stage-summary) .activity-slot{width:150px}.stage:not(.stage-hook):not(.stage-summary) .heading{min-height:55px}.stage:not(.stage-hook):not(.stage-summary) .heading h1{font-size:26px}.stage:not(.stage-hook):not(.stage-summary) .shape-model{min-height:108px;padding:14px 26px}.stage:not(.stage-hook):not(.stage-summary) .formula-flow{min-height:82px}.stage:not(.stage-hook):not(.stage-summary) .letter-key{grid-template-columns:repeat(3,minmax(0,1fr));gap:5px}.stage:not(.stage-hook):not(.stage-summary) .letter-key span{min-height:50px;padding:6px;font-size:10px}}
@media(min-width:361px) and (max-width:639px){.stage-hook .stack{grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:7px}.stage-hook .heading{grid-column:1/-1}.stage-hook .model-card{padding:8px}.stage-hook .shape-model{min-height:112px;padding:15px 26px}.stage-hook .question{padding:8px;gap:5px}.stage-hook .option{min-height:54px;padding:5px}.stage-hook .feedback{min-height:48px;padding:5px 7px}.stage-summary .stack{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:7px}.stage-summary .finale-heading{grid-column:1/-1}.stage-summary .finale-main,.stage-summary .finale-bottom{grid-template-columns:1fr;gap:6px}.stage-summary .finale-concrete .shape-model{min-height:94px}.stage-summary .finale-takeaway{min-height:32px}.stage-summary .finale-bridge{padding:7px 9px}.stage-summary .contract-final-reward{min-height:96px}}
@media(min-width:361px) and (max-width:639px){.stage-hook .stage-content,.stage-summary .stage-content{padding-top:3px!important}.stage-hook .stack{gap:4px}.stage-hook .heading{min-height:52px}.stage-hook .heading h1{font-size:23px}.stage-hook .heading .g1-char{width:48px;height:58px}.stage-hook .model-card{padding:5px}.stage-hook .shape-model{min-height:92px;padding:10px 22px}.stage-hook .dimension-note{padding:4px 6px;font-size:10px}.stage-hook .question{padding:6px;gap:3px}.stage-hook .question h2{font-size:14px}.stage-hook .options{gap:3px}.stage-hook .option{min-height:48px;padding:4px;font-size:10.5px}.stage-hook .feedback{min-height:44px;padding:4px 6px}.stage-summary .stack{gap:4px}.stage-summary .finale-heading{padding:5px 8px}.stage-summary .finale-heading p{font-size:8px}.stage-summary .finale-main,.stage-summary .finale-bottom{gap:4px}.stage-summary .finale-payoff{padding:5px 7px;gap:3px}.stage-summary .finale-concrete .shape-model{min-height:78px;padding:8px 18px}.stage-summary .finale-takeaway{min-height:28px;padding:3px 5px}.stage-summary .finale-takeaway span{font-size:8.5px}.stage-summary .finale-bridge{padding:5px 7px}.stage-summary .finale-bridge strong{font-size:11px}.stage-summary .contract-final-reward{min-height:88px}.stage-summary .final-reflection button,.stage-summary .g4-title-claim{min-height:44px}}
.sr-only{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;clip-path:inset(50%)!important;white-space:nowrap!important;border:0!important}
@media(min-width:640px){.stage-hook .stack{grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);align-items:stretch}.stage-hook .heading{grid-column:1/-1}.stage-hook .model-card,.stage-hook .question{height:100%}}
@media(max-width:390px) and (max-height:700px){
  .heading{position:relative}.heading>div{width:100%;padding-right:44px}.heading>.g1-char{position:absolute;right:0;top:50%;transform:translateY(-50%)}
  .question{padding:8px!important;gap:5px}.question h2{font-size:15px}.options{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:5px}.option{min-height:60px;padding:5px;grid-template-columns:20px minmax(0,1fr);gap:4px;font-size:11px;line-height:1.25}.option>b{width:20px;height:20px}.feedback{min-height:50px;padding:5px 7px}.feedback p{font-size:11.5px;line-height:1.3}.feedback-bit{width:28px;height:34px;display:block}.feedback-bit .g1-char{width:28px;height:34px}
  .stage-hook .heading>div{padding-right:38px}.stage-hook .model-card{padding:7px!important}.stage-hook .shape-model{height:92px;min-height:0!important;padding:10px 24px!important}.stage-hook .rect-shape{width:108px!important;min-width:108px!important}.stage-hook .dimension-note{padding:5px 7px;font-size:11px}.stage-hook .option{min-height:60px!important;padding:4px!important;grid-template-columns:18px minmax(0,1fr)!important;gap:3px!important}.stage-hook .option>b{width:18px!important;height:18px!important}.stage-hook .feedback{min-height:48px!important}.stage-hook .feedback p{font-size:11px}
  .formula-rule{padding:8px!important;gap:6px!important}.formula-rule>.shape-model{height:100px;min-height:0!important;padding:10px 24px!important}.formula-rule .rect-shape{width:120px!important;min-width:120px!important}.letter-key{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:5px}.letter-key span{min-height:54px;padding:5px;grid-template-columns:24px minmax(0,1fr);gap:4px;font-size:11px;line-height:1.2}.letter-key b{width:24px;height:24px}.formula-rule .master-formula{padding:8px 10px;font-size:14px}.formula-rule p{font-size:12.5px;line-height:1.35}.activity-slot{height:48px;min-height:48px}
  .two-methods,.area-model,.model-card{padding:8px!important;gap:6px}.two-methods{grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr)!important}.two-methods .shape-model,.area-model .shape-model,.model-card>.shape-model{height:105px;min-height:0!important;padding:12px 24px!important}.two-methods .rect-shape,.area-model .rect-shape,.model-card>.shape-model .rect-shape{width:125px!important;min-width:110px!important}.formula-flow{min-height:76px!important;gap:5px}.formula-chip{padding:8px 9px;font-size:13px}.formula-flow i{font-size:17px}.substitution-card .formula-flow{min-height:76px!important}.measure-contrast{gap:5px}.measure-contrast span{padding:7px;font-size:11px}
  .matching{gap:5px}.matching>div{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:5px;padding:5px}.matching button{min-height:44px;font-size:10.5px}.check-wide{min-height:44px}.input-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:6px}.input-row .compact{min-width:96px;padding-inline:9px}.answer-input{min-height:50px;padding:8px 10px}.proof{padding:8px;font-size:12px}.bit-error{padding:7px;gap:4px}.bit-error span{padding:6px;font-size:12px}.bit-error b{padding:8px;font-size:13px}
  .stage-summary .stack{gap:6px}.stage-summary .finale-heading{padding:6px 8px 6px!important}.stage-summary .finale-heading h1{font-size:18px}.stage-summary .finale-heading p{font-size:8.5px}.stage-summary .finale-main{grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr)!important;gap:6px}.stage-summary .finale-bottom{grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr)!important;gap:6px}.stage-summary .finale-payoff{padding:6px!important;gap:4px}.stage-summary .finale-concrete .shape-model{height:78px;min-height:0!important;padding:8px 18px}.stage-summary .finale-concrete .rect-shape{width:100px!important;min-width:100px!important}.stage-summary .finale-hook-answer{padding:4px 5px;font-size:9px}.stage-summary .finale-takeaway{min-height:34px;padding:3px 5px;grid-template-columns:21px minmax(0,1fr);gap:4px}.stage-summary .finale-takeaway>b{width:21px;height:21px}.stage-summary .finale-takeaway span{font-size:8.5px;line-height:1.15}.stage-summary .finale-takeaway span small{font-size:7px}.stage-summary .finale-bridge{padding:7px 8px}.stage-summary .finale-bridge strong{font-size:11px}.contract-final-reward{min-height:100px;gap:4px}.final-reflection{grid-template-columns:repeat(2,minmax(0,1fr))}.final-reflection button,.g4-title-claim{min-height:44px;font-size:9px}
}
.stage-hook .hook-layout{grid-template-columns:1fr!important;align-items:start!important}.stage-hook .hook-layout .heading{grid-column:1!important}.stage-hook .hook-layout .hook-card{width:100%;height:auto!important;min-height:138px;padding:11px 24px!important}.stage-hook .hook-layout .hook-card .shape-model{height:auto;min-height:112px!important;padding:14px 30px!important}.stage-hook .hook-layout .hook-question{height:auto!important}.stage-hook .hook-layout .hook-question .options{grid-template-columns:repeat(2,minmax(0,1fr))!important}
@media(max-width:639.98px){.stage-hook .hook-layout .hook-card{min-height:104px;padding:6px 12px!important;border-radius:18px}.stage-hook .hook-layout .hook-card .shape-model{min-height:88px!important;padding:8px 22px!important}.stage-hook .hook-layout .hook-question .option{min-height:48px!important}}
@media(max-width:390px) and (max-height:700px){.stage-hook .hook-layout .hook-card{min-height:92px}.stage-hook .hook-layout .hook-card .shape-model{height:78px!important;min-height:78px!important}.stage-hook .hook-layout .hook-question .option{min-height:54px!important}}
.hook-scene-shell{min-width:0;max-width:100%;overflow:hidden;border-radius:24px}[data-g4-role="visual-frame"]{position:relative;isolation:isolate;max-width:100%;overflow:hidden;color:#EAF9FB;background:radial-gradient(circle at 87% 24%,rgba(121,211,218,.16),transparent 24%),radial-gradient(circle at 9% 88%,rgba(149,201,61,.11),transparent 25%),linear-gradient(145deg,rgba(22,143,163,.25),transparent 48%),linear-gradient(135deg,#153B50,#0B2232 72%);box-shadow:0 22px 50px -30px rgba(14,33,44,.75)}[data-g4-role="visual-frame"] :is(img,svg,canvas,video){display:block;max-width:100%;max-height:100%}[data-g4-role="visual-frame"] :is(img,video){width:100%;height:100%;object-fit:contain}.hook-frame-bit{position:absolute;right:5px;bottom:-7px;z-index:4;width:70px;height:88px;display:block;overflow:hidden}.hook-frame-bit>.g1-char,.hook-frame-bit>svg{width:100%;height:100%}.feedback-bit{width:46px;height:58px;display:block;align-self:end;overflow:hidden}.feedback-bit>.g1-char,.feedback-bit>svg{width:100%;height:100%}
[data-g4-role="hook-title"],[data-g4-role="hook-question"]{width:100%;text-align:left}[data-g4-role="hook-title"]{font:650 clamp(26px,4.2vw,36px)/1.08 'Source Serif 4',Georgia,serif;letter-spacing:-.012em}[data-g4-role="hook-question"]{font:750 clamp(17px,2.5vw,21px)/1.3 Manrope,system-ui,sans-serif}
@media(max-width:639.98px){.hook-scene-shell{border-radius:18px}.hook-frame-bit{right:3px;bottom:-5px;width:58px;height:73px}[data-g4-role="hook-title"]{font-size:25px}}
.lesson-root{font-family:'Manrope',system-ui,sans-serif}.lesson-root h1{font-family:'Source Serif 4',Georgia,serif}.lesson-root .question h2{font-family:'Manrope',system-ui,sans-serif}.screen-count,[class*="formula"],[class*="equation"],[class*="proof-label"]{font-family:'JetBrains Mono',monospace}.lead,.heading>div>span{font-size:clamp(14px,1.8vw,16px)}
[data-g4-role="hook-scene"]{width:min(760px, 100%);min-width:0;margin-inline:auto}[data-g4-role="visual-frame"]{position:relative;isolation:isolate;width:100%;min-width:0;min-height:206px;border-radius:24px;overflow:hidden;background:radial-gradient(circle at 87% 24%,rgba(121,211,218,.16),transparent 24%),radial-gradient(circle at 9% 88%,rgba(149,201,61,.11),transparent 25%),linear-gradient(145deg,rgba(22,143,163,.25),transparent 48%),linear-gradient(135deg,#153B50,#0B2232 72%);box-shadow:0 22px 50px -30px rgba(14,33,44,.75)}[data-g4-role="hook-bit"]{right:42px!important;bottom:-4px!important;width:88px!important;height:110px!important}[data-g4-role="hook-bit"]>.g1-char,[data-g4-role="hook-bit"]>svg{width:100%!important;height:100%!important}
[data-g4-role~="feedback-frame"]{min-height:88px;padding:8px 15px 8px 9px;border-radius:18px;grid-template-columns:62px minmax(0,1fr)}[data-g4-role~="feedback-frame"] [data-g4-role="feedback-bit"]{width:62px;height:76px}[data-g4-feedback="solution"]{min-height:72px;padding:7px 12px 7px 6px;border-radius:15px;background:linear-gradient(135deg,#FFFFFF,#E7F3EC);box-shadow:inset 4px 0 #227A53}[data-g4-feedback="solution"] [data-g4-role="feedback-bit"]{width:51px;height:64px}[data-g4-feedback="wrong"]{background:linear-gradient(135deg,#FFFFFF,#FFF5D9);box-shadow:inset 4px 0 #A96F13}[data-g4-role~="bit-answer-comment"] p{font:700 clamp(15px,2vw,18px)/1.35 'Source Serif 4',Georgia,serif}
@media(max-width:639.98px){[data-g4-role="visual-frame"]{min-height:164px;border-radius:18px}[data-g4-role="hook-bit"]{right:12px!important;bottom:-7px!important;width:68px!important;height:85px!important}[data-g4-role~="feedback-frame"] [data-g4-role="feedback-bit"]{width:54px;height:68px}[data-g4-feedback="solution"] [data-g4-role="feedback-bit"]{width:47px;height:59px}}
.lesson-root [data-g4-role~="hook-title"]{font-size:clamp(26px,4.2vw,36px);font-family:'Source Serif 4',Georgia,serif}
.lesson-root [data-g4-role~="hook-question"]{font-size:clamp(17px,2.5vw,21px);font-family:'Manrope',system-ui,sans-serif}
.lesson-root [data-g4-role~="hook-scene"]>[data-g4-role~="visual-frame"]{width:100%;min-height:206px;border-radius:24px;overflow:hidden}
.lesson-root [data-g4-role~="feedback-frame"]{min-height:88px;padding:8px 15px 8px 9px;border-radius:18px;grid-template-columns:62px minmax(0,1fr)}
.lesson-root [data-g4-role~="feedback-frame"] [data-g4-role~="feedback-bit"]{width:62px;height:76px}
.lesson-root [data-g4-feedback="solution"]{min-height:72px;padding:7px 12px 7px 6px;border-radius:15px;grid-template-columns:51px minmax(0,1fr);background:linear-gradient(135deg,#FFFFFF,#E7F3EC)}
.lesson-root [data-g4-feedback="solution"] [data-g4-role~="feedback-bit"]{width:51px;height:64px}
.lesson-root [data-g4-feedback="wrong"]{background:linear-gradient(135deg,#FFFFFF,#FFF5D9)}
.lesson-root .summary-happy-bit[data-g4-role~="visual-frame"]{position:absolute;isolation:isolate;min-width:0;max-width:100%;overflow:hidden}
@media(max-width:639.98px){.lesson-root [data-g4-role~="hook-title"]{font-size:25px}.lesson-root [data-g4-role~="hook-scene"]>[data-g4-role~="visual-frame"]{min-height:164px;border-radius:18px}.lesson-root [data-g4-role~="feedback-frame"] [data-g4-role~="feedback-bit"]{width:54px;height:68px}.lesson-root [data-g4-feedback="solution"]{min-height:68px}.lesson-root [data-g4-feedback="solution"] [data-g4-role~="feedback-bit"]{width:47px;height:59px}}
.lesson-root .stage-hook .hook-layout{display:grid!important;grid-template-columns:minmax(0,1fr)!important;grid-template-rows:auto auto auto auto!important;align-content:start!important;gap:10px!important}
.lesson-root .stage-hook .hook-layout>.heading,.lesson-root .stage-hook .hook-layout>[data-g4-role~="hook-question"],.lesson-root .stage-hook .hook-layout>.question{grid-column:1!important;position:relative!important;inset:auto!important;width:100%!important;margin:0!important}
.lesson-root .stage-hook .hook-layout>[data-g4-role~="hook-scene"]{grid-column:1!important;position:relative!important;inset:auto!important;width:min(760px,100%)!important;margin:0 auto!important}
.lesson-root .stage-hook .feedback[aria-hidden="true"]{display:none!important}
.lesson-root .stage-hook .question:has(.feedback[aria-hidden="false"]) .options{display:none!important}
@media(max-width:639.98px){.lesson-root .stage-hook .hook-layout{gap:6px!important}.lesson-root .stage-hook .heading{min-height:52px!important}.lesson-root .stage-hook [data-g4-role~="hook-title"]{font-size:25px!important}.lesson-root .stage-hook .question{padding:7px!important;gap:6px!important}.lesson-root .stage-hook .option{min-height:44px!important}}
`;
