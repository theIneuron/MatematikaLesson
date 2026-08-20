// ============================================================================
// 4-SINF · Dars 47 · Tengsizliklarni tanlash usulida yechish
//
// Manba: N. U. Bikbayeva, "Matematika. 4-sinf", o'zbek nashri:
//   44-bet "Tengsizliklar" — ta'rif dosloven ("katta", "kichik", "katta yoki
//     teng", "kichik yoki teng" belgisi bilan birlashtirilgan ikki ifoda
//     tengsizlik deb ataladi), 3 + x < 5 va son o'qi;
//   44-bet 1.3 — 6 - x > 4, 5 · x < 35, 36 : x > 4;
//   45-bet 6-topshiriq — x <= 548 ga mos uchta qiymat son o'qida;
//   5-bet va 8-bet — a · 9 < 54, 200 - a > 198, 7 · y > 35, 208 - x < 35.
// Syujet: boshqaruv markazining SHART DARVOZASI (SYUJET_4SINF.md, 6-blok).
// 46-darsdan ko'prik: taqsimlash tugadi, endi shartlar tekshiriladi.
//
// YADRO. Tengsizlikni tanlash usuli bilan yechamiz: harf o'rniga sonlarni
// qo'yib ko'ramiz va qaysilarida yozuv rost bo'lishini topamiz. Qat'iy belgi
// chegara qiymatini ICHIGA OLMAYDI, qat'iy bo'lmagani esa oladi.
//
// RITM: qisqa tushuntirish -> misol -> yana tushuntirish -> misol.
// Baholanadigan olti ekran: s2, s4, s6, s8, s10, s13.
// ============================================================================
import {
  BitSVG, Caption, ChoiceScreen, FitSvg, KIT_STYLES, NumPadScreen, Plate, RecordRow,
  RevealScreen, RuleRows, StepList, SummaryScreen, T, TheoryLessonRoot,
  assertScreenTypeLabels, useT,
} from './kit/index.js';

const LESSON_META = {
  lessonId: 'ineq-4-47-v2',
  slug: 'dars47-tengsizliklarni-tanlash-usuli',
  lessonTitle: {
    uz: '47-dars. Tengsizliklarni tanlash usulida yechish',
    ru: 'Урок 47. Решение неравенств подбором',
    en: 'Lesson 47. Solving inequalities by systematic trial',
  },
  skillTags: ['inequality_meaning', 'trial_method', 'boundary_value', 'strict_sign', 'number_line'],
};

const SCREEN_META = [
  { id: 's0', type: 'hook', scored: false, scope: 'hook' },
  { id: 's1', type: 'exploration', scored: false, scope: null },
  { id: 's2', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 's3', type: 'exploration', scored: false, scope: null },
  { id: 's4', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 's5', type: 'exploration', scored: false, scope: null },
  { id: 's6', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 's7', type: 'exploration', scored: false, scope: null },
  { id: 's8', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 's9', type: 'exploration', scored: false, scope: null },
  { id: 's10', type: 'practice', scored: true, scope: 'module-mikro' },
  { id: 's11', type: 'rule', scored: false, scope: null },
  { id: 's12', type: 'strategy', scored: false, scope: null },
  { id: 's13', type: 'error-analysis', scored: true, scope: 'module-mikro' },
  { id: 's14', type: 'life-case', scored: false, scope: 'final' },
  { id: 's15', type: 'summary', scored: false, scope: null },
];

const TOTAL_SCREENS = SCREEN_META.length;
assertScreenTypeLabels(SCREEN_META, LESSON_META.lessonId);

const FRAME_COUNTS = [4, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 3, 3, 3, 3, 3];

const CONTENT = {
  s0: {
    eyebrow: { uz: 'Shart darvozasi', ru: 'Ворота условия', en: 'The condition gate' },
    title: {
      uz: 'Darvoza ochilmadi',
      ru: 'Ворота не открылись',
      en: 'The gate did not open',
    },
    question: {
      uz: 'Nega 7 ta quti darvozadan o\'tmadi?',
      ru: 'Почему 7 коробок не прошли через ворота?',
      en: 'Why did 7 boxes not pass the gate?',
    },
    options: [
      { uz: '35 ning o\'zi 35 dan kichik emas', ru: 'Само 35 не меньше 35', en: '35 itself is not less than 35' },
      { uz: '7 juda kichik son', ru: '7 слишком маленькое число', en: '7 is too small a number' },
      { uz: 'Ko\'paytirish o\'rniga qo\'shish kerak', ru: 'Вместо умножения нужно сложение', en: 'Addition is needed instead of multiplication' },
      { uz: 'Darvoza buzilgan', ru: 'Ворота сломаны', en: 'The gate is broken' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Yetti quti aynan o'ttiz besh kilogramm beradi, shart esa qat'iy kichik talab qiladi.",
      ru: 'Верно. Семь коробок дают ровно тридцать пять килограммов, а условие требует строго меньше.',
      en: 'Correct. Seven boxes give exactly thirty five kilograms, but the condition demands strictly less.',
    },
    wrong: [
      null,
      {
        uz: "Yetti kichik son emas: aynan u chegaraga yetkazdi. Muammo chegarada.",
        ru: 'Семь не маленькое число: именно оно довело до границы. Дело в границе.',
        en: 'Seven is not small: it is exactly what reached the limit. The trouble is at the limit.',
      },
      {
        uz: "Har qutida besh kilogramm, qutilar soni esa iks. Bu ko'paytirish.",
        ru: 'В каждой коробке пять килограммов, а коробок икс. Это умножение.',
        en: 'Each box holds five kilograms and there are x boxes. That is multiplication.',
      },
      {
        uz: "Darvoza ishlayapti: u shartni aynan bajaryapti. Xato shartni o'qishda.",
        ru: 'Ворота работают: они точно выполняют условие. Ошибка в чтении условия.',
        en: 'The gate works: it follows the condition exactly. The error is in reading the condition.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Salom, do'stim! Taqsimlash tugadi va yuklar shart darvozasiga keldi.",
          "Darvoza faqat yengil aravalarni o'tkazadi. Har qutining massasi besh kilogramm.",
          "Shart shunday: besh ko'paytiriladi iks, natija o'ttiz beshdan kichik bo'lsin.",
          "Bit yetti quti yukladi va darvoza ochilmadi. Nega? Javobni tanlang.",
        ],
        ru: [
          'Привет, друг! Распределение закончено, и грузы подошли к воротам условия.',
          'Ворота пропускают только лёгкие тележки. Масса каждой коробки пять килограммов.',
          'Условие такое: пять умножить на икс, результат должен быть меньше тридцати пяти.',
          'Bit погрузил семь коробок, и ворота не открылись. Почему? Выбери ответ.',
        ],
        en: [
          'Hello, friend! The sharing is over and the loads have reached the condition gate.',
          'The gate lets through only light carts. Each box weighs five kilograms.',
          'The condition is this: five multiplied by x must be less than thirty five.',
          'Bit loaded seven boxes and the gate stayed shut. Why? Choose an answer.',
        ],
      },
    },
  },

  s1: {
    eyebrow: { uz: 'Tengsizlik nima', ru: 'Что такое неравенство', en: 'What an inequality is' },
    title: {
      uz: 'Ikki ifoda va belgi',
      ru: 'Два выражения и знак',
      en: 'Two expressions and a sign',
    },
    lead: {
      uz: "Katta, kichik, katta yoki teng, kichik yoki teng belgisi bilan birlashtirilgan ikki ifoda tengsizlik deb ataladi.",
      ru: 'Два выражения, соединённые знаком больше, меньше, больше или равно, меньше или равно, называют неравенством.',
      en: 'Two expressions joined by greater, less, greater or equal, less or equal are called an inequality.',
    },
    note: {
      uz: "Tenglamada tenglik belgisi, tengsizlikda esa taqqoslash belgisi turadi.",
      ru: 'В уравнении стоит знак равенства, а в неравенстве — знак сравнения.',
      en: 'An equation carries the equals sign, an inequality carries a comparison sign.',
    },
    audio: {
      intro: {
        uz: [
          "Darvoza shartini yaqindan ko'ramiz. Chapda besh ko'paytiriladi iks, o'ngda o'ttiz besh.",
          "O'rtada tenglik emas, kichik belgisi turibdi.",
          "Darslik shunday ta'rif beradi: taqqoslash belgisi bilan birlashtirilgan ikki ifoda tengsizlik deb ataladi.",
          "Belgilar to'rtta: katta, kichik, katta yoki teng, kichik yoki teng.",
        ],
        ru: [
          'Рассмотрим условие ворот поближе. Слева пять умножить на икс, справа тридцать пять.',
          'Посередине стоит не равенство, а знак меньше.',
          'Учебник даёт такое определение: два выражения, соединённые знаком сравнения, называют неравенством.',
          'Знаков четыре: больше, меньше, больше или равно, меньше или равно.',
        ],
        en: [
          'Let us look at the gate condition closely. On the left five multiplied by x, on the right thirty five.',
          'In the middle stands not an equals sign but a less than sign.',
          'The textbook gives this definition: two expressions joined by a comparison sign are called an inequality.',
          'There are four signs: greater, less, greater or equal, less or equal.',
        ],
      },
    },
  },

  s2: {
    eyebrow: { uz: 'Qaysi yozuv', ru: 'Какая запись', en: 'Which record' },
    title: {
      uz: 'Qaysi biri tengsizlik?',
      ru: 'Что из этого неравенство?',
      en: 'Which one is an inequality?',
    },
    question: {
      uz: 'Darvoza panelida to\'rt yozuv bor. Qaysi biri tengsizlik?',
      ru: 'На панели ворот четыре записи. Какая из них неравенство?',
      en: 'There are four records on the gate panel. Which one is an inequality?',
    },
    options: [
      { uz: '5 · x < 35', ru: '5 · x < 35', en: '5 · x < 35' },
      { uz: '5 · x = 35', ru: '5 · x = 35', en: '5 · x = 35' },
      { uz: '5 · x', ru: '5 · x', en: '5 · x' },
      { uz: '35', ru: '35', en: '35' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Ikki ifoda va orasida taqqoslash belgisi: bu tengsizlik.",
      ru: 'Верно. Два выражения и знак сравнения между ними: это неравенство.',
      en: 'Correct. Two expressions with a comparison sign between them: that is an inequality.',
    },
    wrong: [
      null,
      {
        uz: "Bu tenglama: o'rtada tenglik belgisi turibdi, taqqoslash emas.",
        ru: 'Это уравнение: посередине знак равенства, а не сравнения.',
        en: 'That is an equation: the equals sign stands in the middle, not a comparison.',
      },
      {
        uz: "Bu bitta ifoda. Tengsizlik uchun ikkinchi ifoda va belgi kerak.",
        ru: 'Это одно выражение. Для неравенства нужно второе выражение и знак.',
        en: 'That is a single expression. An inequality needs a second expression and a sign.',
      },
      {
        uz: "Bu shunchaki son. Bu yerda taqqoslanadigan narsa yo'q.",
        ru: 'Это просто число. Здесь нечего сравнивать.',
        en: 'That is just a number. There is nothing to compare here.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Darvoza panelida to'rtta yozuv chiqdi.",
          "Tengsizlik uchun ikkita shart kerak: ikkita ifoda va taqqoslash belgisi.",
          "Qaysi biri tengsizlik? Javobni tanlang.",
        ],
        ru: [
          'На панели ворот появились четыре записи.',
          'Для неравенства нужны два признака: два выражения и знак сравнения.',
          'Какая из них неравенство? Выбери ответ.',
        ],
        en: [
          'Four records appeared on the gate panel.',
          'An inequality needs two things: two expressions and a comparison sign.',
          'Which one is an inequality? Choose an answer.',
        ],
      },
    },
  },

  s3: {
    eyebrow: { uz: 'Tanlash usuli', ru: 'Способ подбора', en: 'The trial method' },
    title: {
      uz: 'Sonlarni qo\'yib ko\'ramiz',
      ru: 'Подставляем числа',
      en: 'We try numbers in turn',
    },
    lead: {
      uz: "Harf o'rniga sonlarni navbat bilan qo'yamiz va qaysilarida yozuv rost bo'lishini belgilaymiz.",
      ru: 'Вместо буквы по очереди подставляем числа и отмечаем, при каких запись верна.',
      en: 'We put numbers in place of the letter one by one and mark those that make the record true.',
    },
    note: {
      uz: 'Darslik shu usulni son o\'qi bilan ko\'rsatadi.',
      ru: 'Учебник показывает этот способ на числовой оси.',
      en: 'The textbook shows this method on a number line.',
    },
    audio: {
      intro: {
        uz: [
          "Darslikdagi soddaroq shartni olamiz: uch qo'shuv iks kichik besh.",
          "Iks o'rniga nolni qo'yamiz: uch kichik besh. Bu rost.",
          "Endi birni qo'yamiz: to'rt kichik besh. Bu ham rost.",
          "Ikkini qo'ysak, besh kichik besh bo'ladi. Bu yolg'on. Demak nol va bir mos keladi.",
        ],
        ru: [
          'Возьмём условие попроще из учебника: три плюс икс меньше пяти.',
          'Подставим вместо икса ноль: три меньше пяти. Это верно.',
          'Теперь подставим один: четыре меньше пяти. Тоже верно.',
          'Если подставить два, выйдет пять меньше пяти. Это ложь. Значит подходят ноль и один.',
        ],
        en: [
          'Let us take a simpler condition from the textbook: three plus x is less than five.',
          'Put zero in place of x: three is less than five. That is true.',
          'Now put one: four is less than five. True as well.',
          'Put two and we get five is less than five. That is false. So zero and one fit.',
        ],
      },
    },
  },

  s4: {
    eyebrow: { uz: 'Qaysi sonlar', ru: 'Какие числа', en: 'Which numbers' },
    title: {
      uz: 'Qaysi sonlar mos keladi?',
      ru: 'Какие числа подходят?',
      en: 'Which numbers fit?',
    },
    question: {
      uz: '6 - x > 4 tengsizligiga qaysi sonlar mos keladi?',
      ru: 'Какие числа подходят к неравенству 6 - x > 4?',
      en: 'Which numbers fit the inequality 6 - x > 4?',
    },
    options: [
      { uz: '0 va 1', ru: '0 и 1', en: '0 and 1' },
      { uz: '0, 1 va 2', ru: '0, 1 и 2', en: '0, 1 and 2' },
      { uz: '2 va 3', ru: '2 и 3', en: '2 and 3' },
      { uz: 'faqat 0', ru: 'только 0', en: 'only 0' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Nolda olti katta to'rt, birda besh katta to'rt. Ikkida esa to'rt katta to'rt bo'lmaydi.",
      ru: 'Верно. При нуле шесть больше четырёх, при единице пять больше четырёх. А при двойке четыре больше четырёх не бывает.',
      en: 'Correct. At zero six is greater than four, at one five is greater than four. At two, four is not greater than four.',
    },
    wrong: [
      null,
      {
        uz: "Ikkini qo'ysak, chapda to'rt qoladi. To'rt to'rtdan katta emas.",
        ru: 'Если подставить два, слева останется четыре. Четыре не больше четырёх.',
        en: 'Putting two leaves four on the left. Four is not greater than four.',
      },
      {
        uz: "Uchda chapda uch qoladi, bu to'rtdan kichik. Ikkisi ham mos kelmaydi.",
        ru: 'При тройке слева останется три, это меньше четырёх. Оба не подходят.',
        en: 'At three the left side is three, which is less than four. Neither fits.',
      },
      {
        uz: "Bir ham mos keladi: besh to'rtdan katta. Uni tushirib qoldirmang.",
        ru: 'Единица тоже подходит: пять больше четырёх. Её нельзя пропускать.',
        en: 'One fits as well: five is greater than four. Do not leave it out.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Darvoza yangi shart berdi: olti minus iks katta to'rt.",
          "Sonlarni navbat bilan qo'yib ko'ring: nol, bir, ikki, uch.",
          "Qaysi sonlar mos keladi? Javobni tanlang.",
        ],
        ru: [
          'Ворота дали новое условие: шесть минус икс больше четырёх.',
          'Подставляй числа по очереди: ноль, один, два, три.',
          'Какие числа подходят? Выбери ответ.',
        ],
        en: [
          'The gate gave a new condition: six minus x is greater than four.',
          'Try the numbers in turn: zero, one, two, three.',
          'Which numbers fit? Choose an answer.',
        ],
      },
    },
  },

  s5: {
    eyebrow: { uz: 'Chegara', ru: 'Граница', en: 'The boundary' },
    title: {
      uz: 'Eng katta mos qiymat',
      ru: 'Наибольшее подходящее значение',
      en: 'The largest value that fits',
    },
    lead: {
      uz: "Sonlarni oshirib borsak, bir joyda yozuv yolg'onga aylanadi. O'sha joy chegara.",
      ru: 'Если увеличивать числа, в какой-то момент запись становится ложной. Это место и есть граница.',
      en: 'As the numbers grow, at some point the record turns false. That point is the boundary.',
    },
    note: {
      uz: "Qat'iy belgi chegara qiymatini ichiga olmaydi.",
      ru: 'Строгий знак не включает граничное значение.',
      en: 'A strict sign does not include the boundary value.',
    },
    audio: {
      intro: {
        uz: [
          "Darvoza shartiga qaytamiz: besh ko'paytiriladi iks, kichik o'ttiz besh.",
          "Beshni qo'yamiz: yigirma besh kichik o'ttiz besh. Rost.",
          "Oltini qo'yamiz: o'ttiz kichik o'ttiz besh. Bu ham rost.",
          "Yettida esa o'ttiz besh chiqadi va yozuv yolg'on bo'ladi. Demak eng katta mos qiymat olti.",
        ],
        ru: [
          'Вернёмся к условию ворот: пять умножить на икс меньше тридцати пяти.',
          'Подставим пять: двадцать пять меньше тридцати пяти. Верно.',
          'Подставим шесть: тридцать меньше тридцати пяти. Тоже верно.',
          'А при семи выйдет тридцать пять, и запись станет ложной. Значит наибольшее подходящее значение шесть.',
        ],
        en: [
          'Back to the gate condition: five multiplied by x is less than thirty five.',
          'Put five: twenty five is less than thirty five. True.',
          'Put six: thirty is less than thirty five. True as well.',
          'At seven we get thirty five and the record turns false. So the largest value that fits is six.',
        ],
      },
    },
  },

  s6: {
    eyebrow: { uz: 'Terib javob bering', ru: 'Набери ответ', en: 'Type the answer' },
    title: {
      uz: 'Eng katta qiymatni toping',
      ru: 'Найди наибольшее значение',
      en: 'Find the largest value',
    },
    question: {
      uz: 'a · 9 < 54. a ning eng katta qiymati qanday?',
      ru: 'a · 9 < 54. Каково наибольшее значение a?',
      en: 'a · 9 < 54. What is the largest value of a?',
    },
    answer: 5,
    correctText: {
      uz: "To'g'ri. Beshda qirq besh chiqadi va shart bajariladi. Oltida esa ellik to'rt bo'ladi.",
      ru: 'Верно. При пяти выйдет сорок пять и условие выполнено. А при шести будет пятьдесят четыре.',
      en: 'Correct. At five we get forty five and the condition holds. At six it becomes fifty four.',
    },
    wrong: {
      uz: "Hali emas. Sonlarni oshirib boring va yozuv qaysi joyda yolg'on bo'lishini toping.",
      ru: 'Пока нет. Увеличивай числа и найди место, где запись становится ложной.',
      en: 'Not yet. Increase the numbers and find where the record turns false.',
    },
    hintAfter: {
      uz: "Oltida to'qqiz marta olti ellik to'rt bo'ladi, bu esa ellik to'rtdan kichik emas.",
      ru: 'При шести девять раз по шесть будет пятьдесят четыре, а это не меньше пятидесяти четырёх.',
      en: 'At six, nine times six is fifty four, and that is not less than fifty four.',
    },
    audio: {
      intro: {
        uz: [
          "Darvoza uchinchi shartni berdi: a ko'paytiriladi to'qqizga, kichik ellik to'rt.",
          "Chegarani izlang: qaysi sondan keyin yozuv yolg'on bo'ladi.",
          "a ning eng katta qiymati qanday? Javobni tering va tasdiqlang.",
        ],
        ru: [
          'Ворота дали третье условие: a умножить на девять меньше пятидесяти четырёх.',
          'Ищи границу: после какого числа запись становится ложной.',
          'Каково наибольшее значение a? Набери ответ и подтверди.',
        ],
        en: [
          'The gate gave a third condition: a multiplied by nine is less than fifty four.',
          'Look for the boundary: after which number the record turns false.',
          'What is the largest value of a? Type the answer and confirm.',
        ],
      },
    },
  },

  s7: {
    eyebrow: { uz: 'Ikki xil belgi', ru: 'Два вида знака', en: 'Two kinds of sign' },
    title: {
      uz: 'Chegara ichidami yoki tashqarida?',
      ru: 'Граница внутри или снаружи?',
      en: 'Is the boundary inside or outside?',
    },
    lead: {
      uz: "Kichik yoki teng belgisi chegara qiymatini ham qabul qiladi.",
      ru: 'Знак меньше или равно принимает и само граничное значение.',
      en: 'The less or equal sign accepts the boundary value as well.',
    },
    note: {
      uz: "Belgining ostidagi chiziqcha aynan shuni bildiradi.",
      ru: 'Чёрточка под знаком именно это и означает.',
      en: 'The small line under the sign means exactly that.',
    },
    audio: {
      intro: {
        uz: [
          "Darslik yana bir shart beradi: iks kichik yoki teng besh yuz qirq sakkiz.",
          "Besh yuz qirq yettini qo'yamiz: u besh yuz qirq sakkizdan kichik. Rost.",
          "Endi besh yuz qirq sakkizning o'zini qo'yamiz. Teng bo'lgani uchun bu ham rost.",
          "Besh yuz qirq to'qqizda esa yozuv yolg'on. Demak chegara ichkarida qoldi.",
        ],
        ru: [
          'Учебник даёт ещё одно условие: икс меньше или равно пятистам сорока восьми.',
          'Подставим пятьсот сорок семь: он меньше пятисот сорока восьми. Верно.',
          'Теперь подставим само пятьсот сорок восемь. Раз есть равенство, это тоже верно.',
          'А при пятистах сорока девяти запись ложна. Значит граница осталась внутри.',
        ],
        en: [
          'The textbook gives one more condition: x is less than or equal to five hundred and forty eight.',
          'Put five hundred and forty seven: it is less than five hundred and forty eight. True.',
          'Now put five hundred and forty eight itself. Since equality counts, this is true as well.',
          'At five hundred and forty nine the record is false. So the boundary stayed inside.',
        ],
      },
    },
  },

  s8: {
    eyebrow: { uz: 'Chegarani sinang', ru: 'Проверь границу', en: 'Test the boundary' },
    title: {
      uz: 'Chegara qiymati mosmi?',
      ru: 'Подходит ли граничное значение?',
      en: 'Does the boundary value fit?',
    },
    question: {
      uz: 'x <= 548. Qaysi son bu shartga mos keladi?',
      ru: 'x <= 548. Какое число подходит под это условие?',
      en: 'x <= 548. Which number fits this condition?',
    },
    options: [
      { uz: '548', ru: '548', en: '548' },
      { uz: '549', ru: '549', en: '549' },
      { uz: '600', ru: '600', en: '600' },
      { uz: '1000', ru: '1000', en: '1000' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Belgi kichik yoki teng, shuning uchun chegara qiymatining o'zi ham mos keladi.",
      ru: 'Верно. Знак меньше или равно, поэтому само граничное значение тоже подходит.',
      en: 'Correct. The sign is less or equal, so the boundary value itself fits too.',
    },
    wrong: [
      null,
      {
        uz: "Besh yuz qirq to'qqiz chegaradan bitta katta. U shartdan chiqib ketadi.",
        ru: 'Пятьсот сорок девять на единицу больше границы. Оно выходит за условие.',
        en: 'Five hundred and forty nine is one more than the boundary. It falls outside.',
      },
      {
        uz: "Olti yuz chegaradan ancha katta, shuning uchun mos kelmaydi.",
        ru: 'Шестьсот заметно больше границы, поэтому не подходит.',
        en: 'Six hundred is well above the boundary, so it does not fit.',
      },
      {
        uz: "Bir ming chegaradan juda uzoq. Shart faqat chegaragacha ruxsat beradi.",
        ru: 'Тысяча слишком далеко от границы. Условие разрешает только до неё.',
        en: 'One thousand is far past the boundary. The condition allows only up to it.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Darvoza yangi shart qo'ydi: iks kichik yoki teng besh yuz qirq sakkiz.",
          "Belgining ostidagi chiziqchaga e'tibor bering.",
          "Qaysi son bu shartga mos keladi? Javobni tanlang.",
        ],
        ru: [
          'Ворота выставили новое условие: икс меньше или равно пятистам сорока восьми.',
          'Обрати внимание на чёрточку под знаком.',
          'Какое число подходит под это условие? Выбери ответ.',
        ],
        en: [
          'The gate set a new condition: x is less than or equal to five hundred and forty eight.',
          'Pay attention to the small line under the sign.',
          'Which number fits this condition? Choose an answer.',
        ],
      },
    },
  },

  s9: {
    eyebrow: { uz: 'Katta tomon', ru: 'Сторона больше', en: 'The greater side' },
    title: {
      uz: 'Shart katta tomonga qarasa',
      ru: 'Когда условие смотрит в сторону больше',
      en: 'When the condition points to greater',
    },
    lead: {
      uz: "Katta belgisida esa chegaradan yuqoridagi sonlar mos keladi.",
      ru: 'При знаке больше подходят числа выше границы.',
      en: 'With a greater than sign the numbers above the boundary fit.',
    },
    note: {
      uz: 'Usul o\'zgarmaydi: qo\'yamiz, hisoblaymiz, hukm chiqaramiz.',
      ru: 'Способ не меняется: подставляем, считаем, выносим вердикт.',
      en: 'The method stays the same: substitute, calculate, judge.',
    },
    audio: {
      intro: {
        uz: [
          "Darslikda yana bir shart bor: yetti ko'paytiriladi igrek, katta o'ttiz besh.",
          "Beshni qo'yamiz: o'ttiz besh chiqadi, lekin u o'ttiz beshdan katta emas. Yolg'on.",
          "Oltini qo'yamiz: qirq ikki chiqadi. Bu o'ttiz beshdan katta, demak rost.",
          "Bu safar mos sonlar chegaradan yuqorida yotadi.",
        ],
        ru: [
          'В учебнике есть ещё условие: семь умножить на игрек больше тридцати пяти.',
          'Подставим пять: выйдет тридцать пять, но он не больше тридцати пяти. Ложь.',
          'Подставим шесть: выйдет сорок два. Это больше тридцати пяти, значит верно.',
          'На этот раз подходящие числа лежат выше границы.',
        ],
        en: [
          'The textbook has one more condition: seven multiplied by y is greater than thirty five.',
          'Put five: we get thirty five, but it is not greater than thirty five. False.',
          'Put six: we get forty two. That is greater than thirty five, so it is true.',
          'This time the fitting numbers lie above the boundary.',
        ],
      },
    },
  },

  s10: {
    eyebrow: { uz: 'Mos sonni tanlang', ru: 'Выбери подходящее', en: 'Choose what fits' },
    title: {
      uz: 'Qaysi son shartni bajaradi?',
      ru: 'Какое число выполняет условие?',
      en: 'Which number satisfies the condition?',
    },
    question: {
      uz: '7 · y > 35. Qaysi son mos keladi?',
      ru: '7 · y > 35. Какое число подходит?',
      en: '7 · y > 35. Which number fits?',
    },
    options: [
      { uz: '6', ru: '6', en: '6' },
      { uz: '5', ru: '5', en: '5' },
      { uz: '4', ru: '4', en: '4' },
      { uz: '3', ru: '3', en: '3' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Yetti marta olti qirq ikki, bu o'ttiz beshdan katta.",
      ru: 'Верно. Семь раз по шесть — сорок два, это больше тридцати пяти.',
      en: 'Correct. Seven times six is forty two, which is greater than thirty five.',
    },
    wrong: [
      null,
      {
        uz: "Beshda aynan o'ttiz besh chiqadi. Qat'iy katta belgisi tenglikni qabul qilmaydi.",
        ru: 'При пяти выходит ровно тридцать пять. Строгий знак больше равенство не принимает.',
        en: 'At five we get exactly thirty five. A strict greater sign does not accept equality.',
      },
      {
        uz: "To'rtda yigirma sakkiz chiqadi, bu o'ttiz beshdan kichik.",
        ru: 'При четырёх выйдет двадцать восемь, это меньше тридцати пяти.',
        en: 'At four we get twenty eight, which is less than thirty five.',
      },
      {
        uz: "Uchda yigirma bir chiqadi, chegaradan ancha uzoq.",
        ru: 'При тройке выйдет двадцать один, это далеко от границы.',
        en: 'At three we get twenty one, far from the boundary.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Darvoza oxirgi shartni berdi: yetti ko'paytiriladi igrek, katta o'ttiz besh.",
          "Har sonni qo'yib ko'ring va hisoblang.",
          "Qaysi son mos keladi? Javobni tanlang.",
        ],
        ru: [
          'Ворота дали последнее условие: семь умножить на игрек больше тридцати пяти.',
          'Подставь каждое число и посчитай.',
          'Какое число подходит? Выбери ответ.',
        ],
        en: [
          'The gate gave a last condition: seven multiplied by y is greater than thirty five.',
          'Try each number and work it out.',
          'Which number fits? Choose an answer.',
        ],
      },
    },
  },

  s11: {
    eyebrow: { uz: 'Yodda tuting', ru: 'Запомни', en: 'Keep in mind' },
    title: {
      uz: 'Tanlash usulining tartibi',
      ru: 'Порядок способа подбора',
      en: 'The order of the trial method',
    },
    lead: {
      uz: 'Har tengsizlikda shu uch qadam ishlaydi.',
      ru: 'В любом неравенстве работают эти три шага.',
      en: 'These three steps work in any inequality.',
    },
    audio: {
      intro: {
        uz: [
          "Qoidani yig'amiz. Birinchi qadam: harf o'rniga son qo'yib, ikki tomonni hisoblaymiz.",
          "Ikkinchi qadam: yozuv rostmi yoki yolg'onmi deb hukm chiqaramiz.",
          "Uchinchi qadam: chegarani sinaymiz. Qat'iy belgi chegarani ichiga olmaydi, qat'iy bo'lmagani esa oladi.",
        ],
        ru: [
          'Соберём правило. Первый шаг: подставляем число вместо буквы и считаем обе стороны.',
          'Второй шаг: выносим вердикт, верна запись или ложна.',
          'Третий шаг: проверяем границу. Строгий знак её не включает, нестрогий включает.',
        ],
        en: [
          'Let us put the rule together. Step one: put a number in place of the letter and work out both sides.',
          'Step two: judge whether the record is true or false.',
          'Step three: test the boundary. A strict sign excludes it, a non strict sign includes it.',
        ],
      },
    },
  },

  s12: {
    eyebrow: { uz: 'Qaysi yo\'l tez?', ru: 'Какой путь быстрее?', en: 'Which way is quicker?' },
    title: {
      uz: 'Hammasini sinash shartmi?',
      ru: 'Нужно ли перебирать всё?',
      en: 'Must we try everything?',
    },
    question: {
      uz: 'x < 5. Mos sonlarni qanday topgan qulay?',
      ru: 'x < 5. Как удобнее найти подходящие числа?',
      en: 'x < 5. What is the convenient way to find the fitting numbers?',
    },
    options: [
      { uz: 'Chegarani topib, undan pastini olish', ru: 'Найти границу и взять всё ниже неё', en: 'Find the boundary and take everything below it' },
      { uz: 'Barcha sonlarni birma-bir sinash', ru: 'Перебрать все числа подряд', en: 'Try every number in turn' },
      { uz: 'Faqat bitta sonni sinash', ru: 'Проверить только одно число', en: 'Test only one number' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Chegara topilgach, qolganini sinash shart emas: pastdagi hamma son mos keladi.",
      ru: 'Верно. Когда граница найдена, остальное перебирать не нужно: все числа ниже подходят.',
      en: 'Correct. Once the boundary is found there is no need to try the rest: every number below fits.',
    },
    wrong: [
      null,
      {
        uz: "Birma-bir sinash to'g'ri javob beradi, lekin uzoq. Chegara ishni qisqartiradi.",
        ru: 'Перебор даст верный ответ, но это долго. Граница сокращает работу.',
        en: 'Trying each number gives the right answer, but it is slow. The boundary shortens the work.',
      },
      {
        uz: "Bitta son butun javobni bermaydi: mos sonlar bir nechta bo'ladi.",
        ru: 'Одно число не даст всего ответа: подходящих чисел несколько.',
        en: 'One number does not give the whole answer: several numbers fit.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Darvozada navbat uzun, vaqt esa kam.",
          "Shart oddiy: iks kichik besh.",
          "Mos sonlarni qanday topgan qulay? Javobni tanlang.",
        ],
        ru: [
          'У ворот длинная очередь, а времени мало.',
          'Условие простое: икс меньше пяти.',
          'Как удобнее найти подходящие числа? Выбери ответ.',
        ],
        en: [
          'The queue at the gate is long and time is short.',
          'The condition is simple: x is less than five.',
          'What is the convenient way to find the fitting numbers? Choose an answer.',
        ],
      },
    },
  },

  s13: {
    eyebrow: { uz: "Bitning yozuvi", ru: 'Запись Bit', en: 'Bit record' },
    title: {
      uz: 'Bit chegarada adashdi',
      ru: 'Bit ошибся на границе',
      en: 'Bit went wrong at the boundary',
    },
    question: {
      uz: 'Bit 5 · x < 35 ni yechdi. Xato qayerda?',
      ru: 'Bit решал 5 · x < 35. Где ошибка?',
      en: 'Bit solved 5 · x < 35. Where is the error?',
    },
    steps: [
      { uz: '5 · 6 = 30, 30 < 35 rost', ru: '5 · 6 = 30, 30 < 35 верно', en: '5 · 6 = 30, 30 < 35 true' },
      { uz: '5 · 7 = 35', ru: '5 · 7 = 35', en: '5 · 7 = 35' },
      { uz: '35 < 35 rost', ru: '35 < 35 верно', en: '35 < 35 true' },
      { uz: 'Javob: eng kattasi 7', ru: 'Ответ: наибольшее 7', en: 'Answer: the largest is 7' },
    ],
    options: [
      { uz: 'Son o\'ziga qat\'iy kichik bo\'la olmaydi', ru: 'Число не может быть строго меньше себя', en: 'A number cannot be strictly less than itself' },
      { uz: 'Ko\'paytirish noto\'g\'ri bajarilgan', ru: 'Умножение выполнено неверно', en: 'The multiplication was done wrongly' },
      { uz: 'Birinchi qator noto\'g\'ri', ru: 'Первая строка неверна', en: 'The first line is wrong' },
      { uz: 'Xato yo\'q', ru: 'Ошибки нет', en: 'There is no error' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. O'ttiz besh o'ttiz beshdan kichik emas, u unga teng. Eng katta mos qiymat olti.",
      ru: 'Верно. Тридцать пять не меньше тридцати пяти, оно ему равно. Наибольшее подходящее значение шесть.',
      en: 'Correct. Thirty five is not less than thirty five, it equals it. The largest fitting value is six.',
    },
    wrong: [
      null,
      {
        uz: "Ko'paytirish to'g'ri: besh marta yetti o'ttiz besh. Xato hukmda.",
        ru: 'Умножение верно: пять раз по семь — тридцать пять. Ошибка в вердикте.',
        en: 'The multiplication is right: five times seven is thirty five. The error is in the verdict.',
      },
      {
        uz: "Birinchi qator to'g'ri: o'ttiz o'ttiz beshdan kichik.",
        ru: 'Первая строка верна: тридцать меньше тридцати пяти.',
        en: 'The first line is right: thirty is less than thirty five.',
      },
      {
        uz: "Darvoza aynan shu sababli ochilmagan edi. Uchinchi qator yolg'on.",
        ru: 'Именно поэтому ворота и не открылись. Третья строка ложна.',
        en: 'That is exactly why the gate stayed shut. The third line is false.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Bit tanlash usuli bilan ishladi va javobni darvozaga yubordi.",
          "Uning to'rt qatori ekranda.",
          "Xato qayerda? Javobni tanlang.",
        ],
        ru: [
          'Bit работал способом подбора и отправил ответ на ворота.',
          'Его четыре строки на экране.',
          'Где ошибка? Выбери ответ.',
        ],
        en: [
          'Bit worked by the trial method and sent the answer to the gate.',
          'His four lines are on the screen.',
          'Where is the error? Choose an answer.',
        ],
      },
    },
  },

  s14: {
    eyebrow: { uz: 'Shahar qarori', ru: 'Решение города', en: 'The city decision' },
    title: {
      uz: 'Darvozani nechta quti ochadi?',
      ru: 'Сколько коробок откроет ворота?',
      en: 'How many boxes open the gate?',
    },
    question: {
      uz: '5 · x < 35. Qaysi yuklama darvozadan o\'tadi?',
      ru: '5 · x < 35. Какая загрузка пройдёт через ворота?',
      en: '5 · x < 35. Which load passes the gate?',
    },
    options: [
      { uz: '6 ta quti', ru: '6 коробок', en: '6 boxes' },
      { uz: '7 ta quti', ru: '7 коробок', en: '7 boxes' },
      { uz: '8 ta quti', ru: '8 коробок', en: '8 boxes' },
    ],
    correctIndex: 0,
    correctText: {
      uz: "To'g'ri. Olti quti o'ttiz kilogramm beradi, bu chegaradan past: darvoza ochildi.",
      ru: 'Верно. Шесть коробок дают тридцать килограммов, это ниже границы: ворота открылись.',
      en: 'Correct. Six boxes give thirty kilograms, below the limit: the gate opened.',
    },
    wrong: [
      null,
      {
        uz: "Yetti quti aynan chegaraga olib boradi. Qat'iy belgi buni o'tkazmaydi.",
        ru: 'Семь коробок дают ровно границу. Строгий знак это не пропускает.',
        en: 'Seven boxes land exactly on the limit. A strict sign does not let that through.',
      },
      {
        uz: "Sakkiz quti qirq kilogramm beradi, bu chegaradan ham katta.",
        ru: 'Восемь коробок дают сорок килограммов, это больше границы.',
        en: 'Eight boxes give forty kilograms, above the limit.',
      },
    ],
    audio: {
      intro: {
        uz: [
          "Darvoza oldida uchta arava turibdi. Har qutida besh kilogramm.",
          "Shart o'zgarmagan: besh ko'paytiriladi iks, kichik o'ttiz besh.",
          "Qaysi yuklama o'tadi? Javobni tanlang.",
        ],
        ru: [
          'Перед воротами три тележки. В каждой коробке пять килограммов.',
          'Условие прежнее: пять умножить на икс меньше тридцати пяти.',
          'Какая загрузка пройдёт? Выбери ответ.',
        ],
        en: [
          'Three carts stand before the gate. Each box weighs five kilograms.',
          'The condition is unchanged: five multiplied by x is less than thirty five.',
          'Which load passes? Choose an answer.',
        ],
      },
    },
  },

  s15: {
    eyebrow: { uz: 'Mukofot', ru: 'Награда', en: 'Reward' },
    stageLabel: { uz: 'YAKUNIY BOSQICH', ru: 'ФИНАЛЬНЫЙ ЭТАП', en: 'FINAL STAGE' },
    headTitle: {
      uz: 'Unvongacha bitta savol',
      ru: 'Один вопрос до звания',
      en: 'One question before your title',
    },
    headLead: {
      uz: "Qoidani tanlang va chegarani tushunganingizni ko'rsating.",
      ru: 'Выбери правило и покажи, что понимаешь границу.',
      en: 'Choose the rule and show that you understand the boundary.',
    },
    questionKicker: { uz: 'YAKUNIY SAVOL', ru: 'ФИНАЛЬНЫЙ ВОПРОС', en: 'FINAL QUESTION' },
    stepLabel: { uz: '1 QADAM', ru: '1 ШАГ', en: '1 STEP' },
    reflectionQuestion: {
      uz: 'Qat\'iy kichik belgisi chegarani oladimi?',
      ru: 'Включает ли строгий знак меньше границу?',
      en: 'Does a strict less than sign include the boundary?',
    },
    reflectionStart: {
      uz: 'Bitta javobni tanlang.',
      ru: 'Выбери один ответ.',
      en: 'Choose one answer.',
    },
    reflectionOptions: [
      { uz: "Yo'q, chegara qiymati mos kelmaydi", ru: 'Нет, граничное значение не подходит', en: 'No, the boundary value does not fit' },
      { uz: 'Ha, chegara ham mos keladi', ru: 'Да, граница тоже подходит', en: 'Yes, the boundary fits too' },
      { uz: 'Bu songa bog\'liq', ru: 'Это зависит от числа', en: 'It depends on the number' },
    ],
    reflectionCorrectIndex: 0,
    reflectionCorrect: {
      uz: "Shunday. Chegarani faqat ostida chiziqchasi bor belgi qabul qiladi.",
      ru: 'Именно так. Границу принимает только знак с чёрточкой снизу.',
      en: 'Exactly. Only the sign with the line beneath it accepts the boundary.',
    },
    reflectionWrong: {
      uz: "Hali emas. Darvozani eslang: yetti quti aynan chegaraga tushdi va o'tmadi.",
      ru: 'Пока нет. Вспомни ворота: семь коробок попали ровно на границу и не прошли.',
      en: 'Not yet. Remember the gate: seven boxes landed exactly on the limit and did not pass.',
    },
    rewardAnnounce: { uz: 'Unvon olindi:', ru: 'Звание получено:', en: 'Title earned:' },
    mainLabel: { uz: 'Darsning to\'rt qoidasi', ru: 'Четыре правила урока', en: 'The four rules of the lesson' },
    main: [
      { uz: 'Tengsizlik: ikki ifoda va taqqoslash belgisi.', ru: 'Неравенство: два выражения и знак сравнения.', en: 'An inequality: two expressions and a comparison sign.' },
      { uz: "Tanlash usuli: son qo'yamiz, hisoblaymiz, hukm chiqaramiz.", ru: 'Способ подбора: подставляем число, считаем, выносим вердикт.', en: 'The trial method: put a number, calculate, judge.' },
      { uz: "Qat'iy belgi chegarani ichiga olmaydi.", ru: 'Строгий знак границу не включает.', en: 'A strict sign does not include the boundary.' },
      { uz: "Chegara topilgach, qolganini sinash shart emas.", ru: 'Когда граница найдена, остальное перебирать не нужно.', en: 'Once the boundary is found, the rest need not be tried.' },
    ],
    awards: [
      {
        min: 6,
        title: { uz: 'Shart ustasi', ru: 'Мастер условий', en: 'Master of conditions' },
        text: { uz: 'Barcha oltita vazifa birinchi urinishda yechildi.', ru: 'Все шесть заданий решены с первой попытки.', en: 'All six tasks were solved on the first attempt.' },
      },
      {
        min: 4,
        title: { uz: 'Chegara nazoratchisi', ru: 'Контролёр границы', en: 'Boundary inspector' },
        text: { uz: "Siz qat'iy va qat'iy bo'lmagan belgini ishonchli ajratasiz.", ru: 'Ты уверенно различаешь строгий и нестрогий знак.', en: 'You tell a strict sign from a non strict one with confidence.' },
      },
      {
        min: 0,
        title: { uz: 'Darvoza xodimi', ru: 'Сотрудник ворот', en: 'Gate clerk' },
        text: { uz: "Asos qo'yildi. Qoidani takrorlab, natijani yaxshilashga harakat qiling.", ru: 'Основа заложена. Повтори правило и попробуй улучшить результат.', en: 'The base is laid. Repeat the rule and try to improve the result.' },
      },
    ],
    nextLabel: { uz: 'Keyingi missiya', ru: 'Следующая миссия', en: 'Next mission' },
    nextText: {
      uz: "Darvoza ochildi. Endi markaz hisobni tezlashtiradi: qo'shish xossalari ishga tushadi.",
      ru: 'Ворота открыты. Теперь центр ускоряет расчёт: в дело идут свойства сложения.',
      en: 'The gate is open. Now the centre speeds up the calculation: the properties of addition come into play.',
    },
    audio: {
      intro: {
        uz: [
          "Shart darvozasi ochildi va yuklar o'tdi.",
          "Endi bitta savol qoldi. Qoidani tanlang va unvonni oling.",
          "Qat'iy kichik belgisi chegarani oladimi? Javobni tanlang.",
        ],
        ru: [
          'Ворота условия открылись, и грузы прошли.',
          'Остался один вопрос. Выбери правило и получи звание.',
          'Включает ли строгий знак меньше границу? Выбери ответ.',
        ],
        en: [
          'The condition gate opened and the loads went through.',
          'One question is left. Choose the rule and claim your title.',
          'Does a strict less than sign include the boundary? Choose an answer.',
        ],
      },
    },
  },
};

// ---------------------------------------------------------------------------
// CHIZMALAR
//
// Darsning tayanchi — SON O'QI: har sinalgan qiymat o'z nuqtasiga tushadi va
// rost yoki yolg'on rangi bilan belgilanadi. Chegara alohida ko'rinadi.
// ---------------------------------------------------------------------------

// s0, s14: shart darvozasi (to'q sahna).
const GateConsole = ({ open }) => {
  const t = useT();
  const boxes = open ? 6 : 7;
  return (
    <FitSvg viewBox="0 0 900 300">
      <defs>
        <linearGradient id="d47panel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#123246" />
          <stop offset="100%" stopColor="#0A2233" />
        </linearGradient>
      </defs>
      <rect x="40" y="24" width="820" height="252" rx="20" fill="url(#d47panel)" stroke="rgba(144,228,235,.28)" strokeWidth="2" />
      <text x="72" y="60" fill="#9DE3E7" fontSize="14" fontWeight="800" letterSpacing="3" fontFamily="JetBrains Mono, monospace">
        {t({ uz: 'SHART DARVOZASI', ru: 'ВОРОТА УСЛОВИЯ', en: 'CONDITION GATE' })}
      </text>

      {/* arava va qutilar */}
      {Array.from({ length: boxes }, (_, index) => (
        <rect
          key={index}
          x={92 + index * 56}
          y="96"
          width="46"
          height="46"
          rx="8"
          fill="rgba(149,201,61,.24)"
          stroke={T.lime}
          strokeWidth="1.8"
        />
      ))}
      <text x={92 + (boxes * 56) / 2 - 28} y="168" textAnchor="middle" fill="#9DE3E7" fontSize="13" fontWeight="750" fontFamily="Manrope, sans-serif">
        {t({ uz: 'har qutida 5 kg', ru: 'в каждой коробке 5 кг', en: '5 kg in each box' })}
      </text>

      {/* darvoza */}
      <rect
        x="596"
        y="80"
        width="18"
        height="150"
        rx="6"
        fill={open ? 'rgba(149,201,61,.5)' : 'rgba(255,179,155,.6)'}
      />
      <rect
        x="640"
        y="90"
        width="190"
        height="72"
        rx="14"
        fill="rgba(121,211,218,.12)"
        stroke="rgba(144,228,235,.4)"
        strokeWidth="1.6"
      />
      <text x="735" y="118" textAnchor="middle" fill="#9DE3E7" fontSize="12" fontWeight="750" fontFamily="Manrope, sans-serif">
        {t({ uz: 'shart', ru: 'условие', en: 'condition' })}
      </text>
      <text x="735" y="146" textAnchor="middle" fill="#EAF9FB" fontSize="22" fontWeight="800" fontFamily="JetBrains Mono, monospace">
        5 · x &lt; 35
      </text>

      <rect
        x="640"
        y="176"
        width="190"
        height="58"
        rx="14"
        fill={open ? 'rgba(149,201,61,.18)' : 'rgba(255,91,53,.16)'}
        stroke={open ? 'rgba(149,201,61,.5)' : '#FFB39B'}
        strokeWidth="1.8"
      />
      <text x="735" y="199" textAnchor="middle" fill={open ? T.lime : '#FFB39B'} fontSize="12" fontWeight="750" fontFamily="Manrope, sans-serif">
        {open
          ? t({ uz: 'darvoza ochiq', ru: 'ворота открыты', en: 'the gate is open' })
          : t({ uz: 'darvoza yopiq', ru: 'ворота закрыты', en: 'the gate is shut' })}
      </text>
      <text x="735" y="222" textAnchor="middle" fill="#EAF9FB" fontSize="18" fontWeight="800" fontFamily="JetBrains Mono, monospace">
        {open ? '5 · 6 = 30' : '5 · 7 = 35'}
      </text>
    </FitSvg>
  );
};

// s3..s10: son o'qi. `marks` — { value, verdict } ro'yxati.
// verdict: 'true' | 'false' | 'open' (hali sinalmagan)
const TrialLine = ({ from, to, marks, frame = 9, label, boundary = null }) => {
  const t = useT();
  const x0 = 70;
  const x1 = 600;
  const span = to - from;
  const at = (value) => x0 + ((value - from) / span) * (x1 - x0);
  return (
    <FitSvg viewBox="0 0 660 200">
      <line x1={x0 - 14} y1={96} x2={x1 + 14} y2={96} stroke={T.ink3} strokeWidth="2.2" />
      <path d={`M${x1 + 14} 96 l-12 -6 v12 Z`} fill={T.ink3} />
      {Array.from({ length: span + 1 }, (_, index) => {
        const value = from + index;
        return (
          <g key={value}>
            <line x1={at(value)} y1={90} x2={at(value)} y2={102} stroke={T.ink3} strokeWidth="1.6" />
            <text x={at(value)} y={124} textAnchor="middle" fill={T.ink3} fontSize="13" fontWeight="750" fontFamily="JetBrains Mono, monospace">
              {value}
            </text>
          </g>
        );
      })}
      {marks.map((mark, index) => {
        if (frame < index + 1) return null;
        const tone = mark.verdict === 'true' ? T.success : mark.verdict === 'false' ? T.accent : T.ink3;
        const fill = mark.verdict === 'true' ? T.successSoft : mark.verdict === 'false' ? T.accentSoft : '#FBFDF7';
        return (
          <g key={mark.value}>
            <circle cx={at(mark.value)} cy={96} r="11" fill={fill} stroke={tone} strokeWidth="2.6" />
            <text x={at(mark.value)} y={64} textAnchor="middle" fill={tone} fontSize="15" fontWeight="800" fontFamily="Manrope, sans-serif">
              {mark.verdict === 'true' ? 'R' : mark.verdict === 'false' ? 'Y' : '?'}
            </text>
          </g>
        );
      })}
      {boundary !== null && frame >= marks.length + 1 && (
        <g>
          <line x1={at(boundary)} y1={54} x2={at(boundary)} y2={140} stroke={T.accent} strokeWidth="2" strokeDasharray="6 5" />
          <Caption x={at(boundary)} y={158} text={t({ uz: 'chegara', ru: 'граница', en: 'boundary' })} tone={T.accent} />
        </g>
      )}
      {label && <Caption x={330} y={186} text={label} tone={T.ink2} />}
    </FitSvg>
  );
};

// s1, s2: tengsizlik plitalari.
const IneqPlates = ({ left, sign, right, frame = 9 }) => {
  const t = useT();
  return (
    <FitSvg viewBox="0 0 620 170">
      <Plate x={54} y={40} w={190} h={72} text={left} kind="known" lit={frame >= 1} size={24} />
      <Plate x={244} y={40} w={72} h={72} text={sign} kind="sign" size={30} />
      <Plate x={316} y={40} w={190} h={72} text={right} kind="known" lit={frame >= 1} size={24} />
      {frame >= 2 && (
        <g>
          <Caption x={149} y={132} text={t({ uz: 'birinchi ifoda', ru: 'первое выражение', en: 'first expression' })} />
          <Caption x={280} y={132} text={t({ uz: 'belgi', ru: 'знак', en: 'sign' })} tone={T.accent} />
          <Caption x={411} y={132} text={t({ uz: 'ikkinchi ifoda', ru: 'второе выражение', en: 'second expression' })} />
        </g>
      )}
      {frame >= 3 && (
        <g>
          <rect x={196} y={146} width={228} height={24} rx="12" fill={T.accentSoft} />
          <text x={310} y={163} textAnchor="middle" fill={T.accent} fontSize="12" fontWeight="800" letterSpacing="2" fontFamily="Manrope, sans-serif">
            {t({ uz: 'TENGSIZLIK', ru: 'НЕРАВЕНСТВО', en: 'INEQUALITY' })}
          </text>
        </g>
      )}
    </FitSvg>
  );
};

// QOIDA kartasi: umumiy `RuleRows` bloki, mazmuni darsniki.
const RuleCard = ({ frame }) => {
  const t = useT();
  return (
    <RuleRows
      frame={frame}
      rows={[
        {
          tone: T.cyan,
          head: t({ uz: 'Son qo\'ying', ru: 'Подставьте число', en: 'Put a number' }),
          body: t({ uz: "harf o'rniga son qo'yib, ikki tomonni hisoblang", ru: 'подставьте число вместо буквы и посчитайте обе стороны', en: 'put a number in place of the letter and work out both sides' }),
          formula: null,
        },
        {
          tone: T.accent,
          head: t({ uz: 'Hukm chiqaring', ru: 'Вынесите вердикт', en: 'Give the verdict' }),
          body: t({ uz: "yozuv rostmi yoki yolg'onmi", ru: 'запись верна или ложна', en: 'is the record true or false' }),
          formula: null,
        },
        {
          tone: T.success,
          head: t({ uz: 'Chegarani sinang', ru: 'Проверьте границу', en: 'Test the boundary' }),
          body: t({ uz: "qat'iy belgi chegarani olmaydi, chiziqchali belgi oladi", ru: 'строгий знак границу не берёт, знак с чёрточкой берёт', en: 'a strict sign excludes it, a sign with a line includes it' }),
          formula: null,
        },
      ]}
    />
  );
};

// ---------------------------------------------------------------------------
// EKRANLAR
// ---------------------------------------------------------------------------
const Screen0 = (props) => (
  <ChoiceScreen
    {...props}
    plain
    ratio="30 / 11"
    ordinal={3}
    figure={({ solved }) => (
      <div className="hero-scene">
        <div className="hero-head">
          <span>LUMO CITY · BOSHQARUV MARKAZI · SHART DARVOZASI</span>
          <span className={solved ? 'hero-state' : 'hero-state hero-state-alert'}>
            {solved ? 'OCHILDI' : 'SHART'}
          </span>
        </div>
        <div className="hero-body">
          <GateConsole open={solved} />
        </div>
        <div className="d47-hero-bit" aria-hidden="true"><BitSVG state={solved ? 'nod' : 'awkward'} /></div>
      </div>
    )}
  />
);
const Screen1 = (props) => <RevealScreen {...props} ratio="62 / 17" figure={({ frame }) => <IneqPlates left="5 · x" sign="<" right="35" frame={frame} />} />;
const Screen2 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={1}
    ratio="76 / 21"
    figure={({ solved, picked }) => (
      <RecordRow
        records={['5 · x < 35', '5 · x = 35', '5 · x', '35']}
        picked={picked}
        solved={solved}
        correctIndex={0}
        width={780}
        cardW={174}
        cardH={84}
        gap={16}
        top={30}
        size={18}
      />
    )}
  />
);
const Screen3 = (props) => {
  const t = useT();
  return (
    <RevealScreen
      {...props}
      ratio="66 / 20"
      figure={({ frame }) => (
        <TrialLine
          from={0}
          to={4}
          frame={frame}
          boundary={2}
          marks={[
            { value: 0, verdict: 'true' },
            { value: 1, verdict: 'true' },
            { value: 2, verdict: 'false' },
          ]}
          label={t({ uz: '3 + x < 5', ru: '3 + x < 5', en: '3 + x < 5' })}
        />
      )}
    />
  );
};
const Screen4 = (props) => {
  const t = useT();
  return (
    <ChoiceScreen
      {...props}
      ordinal={1}
      ratio="66 / 20"
      figure={({ solved }) => (
        <TrialLine
          from={0}
          to={4}
          frame={solved ? 9 : 0}
          boundary={solved ? 2 : null}
          marks={[
            { value: 0, verdict: 'true' },
            { value: 1, verdict: 'true' },
            { value: 2, verdict: 'false' },
            { value: 3, verdict: 'false' },
          ]}
          label={t({ uz: '6 - x > 4', ru: '6 - x > 4', en: '6 - x > 4' })}
        />
      )}
    />
  );
};
const Screen5 = (props) => {
  const t = useT();
  return (
    <RevealScreen
      {...props}
      ratio="66 / 20"
      figure={({ frame }) => (
        <TrialLine
          from={4}
          to={8}
          frame={frame}
          boundary={7}
          marks={[
            { value: 5, verdict: 'true' },
            { value: 6, verdict: 'true' },
            { value: 7, verdict: 'false' },
          ]}
          label={t({ uz: '5 · x < 35', ru: '5 · x < 35', en: '5 · x < 35' })}
        />
      )}
    />
  );
};
const Screen6 = (props) => {
  const t = useT();
  return (
    <NumPadScreen
      {...props}
      ratio="66 / 20"
      figure={({ solved }) => (
        <TrialLine
          from={3}
          to={7}
          frame={solved ? 9 : 0}
          boundary={solved ? 6 : null}
          marks={[
            { value: 4, verdict: 'true' },
            { value: 5, verdict: 'true' },
            { value: 6, verdict: 'false' },
          ]}
          label={t({ uz: 'a · 9 < 54', ru: 'a · 9 < 54', en: 'a · 9 < 54' })}
        />
      )}
    />
  );
};
const Screen7 = (props) => {
  const t = useT();
  return (
    <RevealScreen
      {...props}
      ratio="66 / 20"
      figure={({ frame }) => (
        <TrialLine
          from={546}
          to={550}
          frame={frame}
          boundary={549}
          marks={[
            { value: 547, verdict: 'true' },
            { value: 548, verdict: 'true' },
            { value: 549, verdict: 'false' },
          ]}
          label={t({ uz: 'x <= 548', ru: 'x <= 548', en: 'x <= 548' })}
        />
      )}
    />
  );
};
const Screen8 = (props) => {
  const t = useT();
  return (
    <ChoiceScreen
      {...props}
      ordinal={2}
      ratio="66 / 20"
      figure={({ solved }) => (
        <TrialLine
          from={546}
          to={550}
          frame={solved ? 9 : 0}
          boundary={solved ? 549 : null}
          marks={[
            { value: 547, verdict: 'true' },
            { value: 548, verdict: 'true' },
            { value: 549, verdict: 'false' },
          ]}
          label={t({ uz: 'x <= 548', ru: 'x <= 548', en: 'x <= 548' })}
        />
      )}
    />
  );
};
const Screen9 = (props) => {
  const t = useT();
  return (
    <RevealScreen
      {...props}
      ratio="66 / 20"
      figure={({ frame }) => (
        <TrialLine
          from={3}
          to={7}
          frame={frame}
          boundary={5}
          marks={[
            { value: 4, verdict: 'false' },
            { value: 5, verdict: 'false' },
            { value: 6, verdict: 'true' },
          ]}
          label={t({ uz: '7 · y > 35', ru: '7 · y > 35', en: '7 · y > 35' })}
        />
      )}
    />
  );
};
const Screen10 = (props) => {
  const t = useT();
  return (
    <ChoiceScreen
      {...props}
      ordinal={4}
      ratio="66 / 20"
      figure={({ solved }) => (
        <TrialLine
          from={2}
          to={7}
          frame={solved ? 9 : 0}
          boundary={solved ? 5 : null}
          marks={[
            { value: 3, verdict: 'false' },
            { value: 4, verdict: 'false' },
            { value: 5, verdict: 'false' },
            { value: 6, verdict: 'true' },
          ]}
          label={t({ uz: '7 · y > 35', ru: '7 · y > 35', en: '7 · y > 35' })}
        />
      )}
    />
  );
};
const Screen11 = (props) => <RevealScreen {...props} plain ratio="auto" figure={({ frame }) => <RuleCard frame={frame} />} />;
const Screen12 = (props) => {
  const t = useT();
  return (
    <ChoiceScreen
      {...props}
      ordinal={5}
      ratio="66 / 20"
      figure={({ solved }) => (
        <TrialLine
          from={0}
          to={6}
          frame={solved ? 9 : 1}
          boundary={solved ? 5 : null}
          marks={[
            { value: 0, verdict: 'true' },
            { value: 1, verdict: 'true' },
            { value: 2, verdict: 'true' },
            { value: 3, verdict: 'true' },
            { value: 4, verdict: 'true' },
            { value: 5, verdict: 'false' },
          ]}
          label={t({ uz: 'x < 5', ru: 'x < 5', en: 'x < 5' })}
        />
      )}
    />
  );
};
const Screen13 = (props) => {
  const t = useT();
  return (
    <ChoiceScreen
      {...props}
      plain
      ratio="auto"
      ordinal={6}
      figure={({ solved, picked }) => (
        <StepList
          steps={CONTENT.s13.steps.map((step) => t(step))}
          badIndex={2}
          revealBad={solved}
          badLabel={t({ uz: 'xato shu yerda', ru: 'ошибка здесь', en: 'the error is here' })}
          showHint={picked !== null && !solved}
          hint={t({
            uz: 'Uchinchi qatorni diqqat bilan o\'qing: bir son o\'zidan kichik bo\'la oladimi?',
            ru: 'Прочитай третью строку внимательно: может ли число быть меньше самого себя?',
            en: 'Read the third line carefully: can a number be less than itself?',
          })}
        />
      )}
    />
  );
};
const Screen14 = (props) => (
  <ChoiceScreen
    {...props}
    ordinal={7}
    ratio="72 / 21"
    figure={({ solved, picked }) => (
      <RecordRow
        records={['6 · 5 = 30', '7 · 5 = 35', '8 · 5 = 40']}
        picked={picked}
        solved={solved}
        correctIndex={0}
        width={720}
        cardW={210}
        cardH={92}
        gap={24}
        top={34}
        size={19}
      />
    )}
  />
);
const Screen15 = (props) => <SummaryScreen {...props} />;

const SCREENS = [
  Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7,
  Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15,
];

const LESSON_STYLES = `
.d47-hero-bit {
  position: absolute;
  right: 14px;
  top: 50%;
  width: 60px;
  height: 75px;
  transform: translateY(-50%);
  pointer-events: none;
}
.d47-hero-bit svg { width: 100%; height: 100%; }
`;

export default function Grade4Dars47(props) {
  return (
    <TheoryLessonRoot
      {...props}
      lessonMeta={LESSON_META}
      screenMeta={SCREEN_META}
      totalScreens={TOTAL_SCREENS}
      frameCounts={FRAME_COUNTS}
      content={CONTENT}
      screens={SCREENS}
      styles={KIT_STYLES + LESSON_STYLES}
    />
  );
}
