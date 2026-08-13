import React from 'react';
import { BitSVG, LUMO_CAST, LumoCityBg, createLesson, useLang, tri } from './_kit/index.jsx';
import { LESSON_STYLES } from './_kit/styles.js';

// ============================================================================
// DD 3-SINF | Dars46 — "Tenglama: noma'lumli tenglik" (num-3-46) | Б6 «O'LCHOVLAR»
// Syujet: Lumo shahri (reja 51-satr). SAHNA: 1-DARSNING shahri, tugun — tarozi-tenglik.
// DARSLIK ASOSI (Burxonov, 3-sinf, «Sharq» 2019, tenglama boblari).
// YADRO: tenglama — ichida NOMA'LUM bo'lgan TENGLIK. Uning ildizi — tenglikni to'g'ri
//   qiladigan son. Topilgan son har doim QO'YIB tekshiriladi.
// Misconception: M1 «x bu har doim masalaning javobi»; M2 tasodifan tanlab, tekshirmaslik;
//   M3 ifoda va tenglamani chalkashtirish; M4 tekshirishni unutish.
// FactCard: tenglik belgisini 1557-yilda Robert Rekord kiritgan — ikki parallel kesmadan
//   ko'ra tengroq narsa yo'q degan.
// Bu dars MA'LUMOT fayli: ekranlar va mexanika kitda (`createLesson`).
// ============================================================================
const TOTAL_SCREENS = 15;
const LESSON_META = {
  lessonId: 'grade3-46',
  lessonTitle: { ru: 'Урок 46. Уравнение: равенство с неизвестным', uz: "46-dars. Tenglama: noma'lumli tenglik", en: 'Lesson 46. The equation: an equality with an unknown' }
};
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'MCScreen', scored: false, scope: 'hook' },
  { id: 's1',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's4',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's5',  type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's6',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's7',  type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's8',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'practice' },
  { id: 's9',  type: 'exploration', template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's10', type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's11', type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's12', type: 'test',        template: 'custom',   scored: true,  scope: 'practice' },
  { id: 's13', type: 'test',        template: 'custom',   scored: true,  scope: 'diagnostic' },
  { id: 's14', type: 'summary',     template: 'custom',   scored: false, scope: null }
];

const CONTENT = {
  s0: {
    eyebrow: { ru: 'Крючок', uz: 'Qiziqtirish', en: 'Hook' },
    topic: { ru: 'Уравнение', uz: 'Tenglama', en: 'The equation' },
    lead: { ru: 'На весах слева ящик и 3 кг, справа 10 кг', uz: "Tarozining chapida yashik va 3 kg, o'ngida 10 kg", en: 'On the scales: a box and 3 kg on the left, 10 kg on the right' },
    order_cap: { ru: 'весы стоят ровно', uz: 'tarozi tekis turibdi', en: 'the scales are level' },
    plate: ['x', '+', '3'],
    q: { ru: 'Сколько килограммов в ящике?', uz: 'Yashikda necha kilogramm bor?', en: 'How many kilograms are in the box?' },
    opt0: { ru: '7', uz: '7', en: '7' },
    opt1: { ru: '13', uz: '13', en: '13' },
    opt2: { ru: '10', uz: '10', en: '10' },
    opt3: { ru: '3', uz: '3', en: '3' },
    audio: {
      intro: {
        ru: [
          'Мерки мы разобрали. Теперь научимся находить спрятанное число.',
          'Весы стоят ровно. Слева ящик и гиря три килограмма, справа гиря десять.',
          'Сколько в ящике, не написано, но весы уже всё про него сказали.',
          'Как думаешь, сколько килограммов в ящике?'
        ],
        uz: [
          "O'lchovlarni ko'rib chiqdik. Endi yashiringan sonni topishni o'rganamiz.",
          "Tarozi tekis turibdi. Chapda yashik va uch kilogrammlik tosh, o'ngda o'n kilogrammlik tosh.",
          "Yashikda qancha ekani yozilmagan, lekin tarozi u haqida hammasini aytib bo'ldi.",
          "Sizningcha, yashikda necha kilogramm bor?"
        ],
        en: ['We have sorted out the measures. Now let us learn to find a hidden number.', 'The scales are level. On the left a box and a weight of three kilograms, on the right a weight of ten.', 'How much is in the box is not written, but the scales have already said everything about it.', 'How many kilograms do you think are in the box?']
      },
      on_correct: { ru: 'Верно! Семь и три дают десять, весы сходятся. Так мы нашли спрятанное число.', uz: "To'g'ri! Yetti va uch o'nni beradi, tarozi tenglashadi. Yashiringan sonni shunday topdik.", en: 'Right! Seven and three make ten, the scales agree. That is how we found the hidden number.' },
      on_wrong1: { ru: 'Тринадцать это слишком много. Слева стало бы шестнадцать.', uz: "O'n uch juda ko'p. Chapda o'n olti bo'lardi.", en: 'Thirteen is too much. The left side would come to sixteen.' },
      on_wrong2: { ru: 'Десять это вся правая чаша, а слева есть ещё гиря.', uz: "O'n bu butun o'ng tovoq, chapda esa yana tosh bor.", en: 'Ten is the whole right pan, and there is a weight on the left as well.' },
      on_idk: { ru: 'Ничего. Сейчас запишем это весами и решим.', uz: "Hechqisi yo'q. Hozir buni tarozi bilan yozib, hal qilamiz.", en: 'Never mind. Let us write this down as the scales show it and solve it.' }
    }
  },

  s1: {
    eyebrow: { ru: 'Разбор', uz: 'Tahlil', en: 'Working it out' },
    lead: { ru: 'Записываем весы буквой', uz: 'Tarozini harf bilan yozamiz', en: 'We write the scales with a letter' },
    task_line: 'ящик обозначим x',
    task_line_uz: "yashikni x deb belgilaymiz",
    task_line_en: 'let us mark the box x',
    step1: 'x + 3 = 10',
    step1_cap: { ru: 'это и есть уравнение', uz: 'bu tenglamaning o\'zi', en: 'this is an equation' },
    step2: 'x = 7',
    step2_cap: { ru: 'число, при котором весы ровно', uz: 'tarozi tekis turadigan son', en: 'the number that keeps the scales level' },
    res: '7 + 3 = 10',
    btn1: { ru: 'Записать буквой', uz: 'Harf bilan yozish', en: 'Write it with a letter' },
    btn2: { ru: 'Найти число', uz: 'Sonni topish', en: 'Find the number' },
    done_text: { ru: 'Равенство с неизвестным называют уравнением, а найденное число его корнем.', uz: "Noma'lumli tenglikni tenglama, topilgan sonni esa uning ildizi deyishadi.", en: 'An equality with an unknown is called an equation, and the number found is called its root.' },
    audio: {
      ru: [
        'Обозначим массу ящика буквой икс. Так делают всегда, когда число пока неизвестно.',
        'Получилась запись икс плюс три равно десять. Это равенство, в котором одно число спрятано. Такую запись называют уравнением.',
        'Подходит только семь. При семи левая чаша равна правой. Это число называют корнем уравнения.'
      ],
      uz: [
        "Yashik massasini iks harfi bilan belgilaymiz. Son hali noma'lum bo'lganda har doim shunday qilishadi.",
        "Iks qo'shuv uch teng o'n degan yozuv chiqdi. Bu bitta soni yashiringan tenglik. Bunday yozuvni tenglama deyishadi.",
        "Faqat yetti to'g'ri keladi. Yetti bo'lganda chap tovoq o'ngiga teng bo'ladi. Bu sonni tenglamaning ildizi deyishadi."
      ],
      en: ['Let us mark the mass of the box with the letter x. This is always done when a number is not yet known.', 'We get the record x plus three equals ten. It is an equality with one number hidden. Such a record is called an equation.', 'Only seven fits. With seven the left pan equals the right one. This number is called the root of the equation.']
    }
  },

  s2: {
    eyebrow: { ru: 'Разбор', uz: 'Tahlil', en: 'Working it out' },
    w: 4,
    h: 4,
    lead: { ru: 'Проверка обязательна', uz: 'Tekshirish shart', en: 'The check is compulsory' },
    capA: { ru: 'подставили 7: 7 + 3 = 10', uz: "7 ni qo'ydik: 7 + 3 = 10", en: 'we put in 7: 7 + 3 = 10' },
    capB: { ru: 'подставили 6: 6 + 3 = 9', uz: "6 ni qo'ydik: 6 + 3 = 9", en: 'we put in 6: 6 + 3 = 9' },
    res: { ru: 'корень только один', uz: 'ildiz faqat bitta', en: 'there is only one root' },
    btn1: { ru: 'Подставить 7', uz: "7 ni qo'yish", en: 'Put in 7' },
    btn2: { ru: 'Подставить 6', uz: "6 ni qo'yish", en: 'Put in 6' },
    done_text: { ru: 'Корень проверяют подстановкой. Если равенство сошлось, число найдено верно.', uz: "Ildiz qo'yib tekshiriladi. Tenglik mos tushsa, son to'g'ri topilgan.", en: 'A root is checked by putting it back in. If the equality holds, the number was found correctly.' },
    audio: {
      ru: [
        'Найденное число всегда проверяют. Проверка это не лишний шаг, а часть решения.',
        'Подставим семь. Семь плюс три равно десять, равенство верное.',
        'А теперь шесть. Шесть плюс три равно девять, а нужно было десять. Равенство не сошлось, значит шесть не корень. Подходит только одно число.'
      ],
      uz: [
        "Topilgan son har doim tekshiriladi. Tekshirish ortiqcha qadam emas, yechimning bir qismi.",
        "Yettini qo'yamiz. Yetti qo'shuv uch teng o'n, tenglik to'g'ri.",
        "Endi oltini. Olti qo'shuv uch teng to'qqiz, kerak bo'lgani esa o'n edi. Tenglik mos tushmadi, demak olti ildiz emas. Faqat bitta son to'g'ri keladi."
      ],
      en: ['The number you find is always checked. The check is not an extra step but part of the solution.', 'Let us put in seven. Seven plus three equals ten, the equality is true.', 'And now six. Six plus three equals nine, and we needed ten. The equality did not hold, so six is not a root. Only one number fits.']
    }
  },

  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    q: { ru: 'Какая запись является уравнением?', uz: 'Qaysi yozuv tenglama?', en: 'Which of these is an equation?' },
    opts: [
      { ru: 'x + 4 = 9', uz: 'x + 4 = 9', en: 'x + 4 = 9' },
      { ru: '5 + 4', uz: '5 + 4', en: '5 + 4' },
      { ru: '7 > 3', uz: '7 > 3', en: '7 > 3' },
      { ru: '12 − 2 = 10', uz: '12 − 2 = 10', en: '12 − 2 = 10' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Это выражение. Тут нечего решать, его просто считают.', uz: "Bu ifoda. Bu yerda yechadigan narsa yo'q, u shunchaki hisoblanadi.", en: 'That is an expression. There is nothing to solve, you simply work it out.' },
      2: { ru: 'Это неравенство, тут знак больше, а не равно.', uz: "Bu tengsizlik, bu yerda katta belgisi, teng emas.", en: 'That is an inequality, it has a greater than sign, not an equals sign.' },
      3: { ru: 'Это верное равенство, но неизвестного в нём нет.', uz: "Bu to'g'ri tenglik, lekin unda noma'lum yo'q.", en: 'That is a true equality, but there is no unknown in it.' }
    },
    on_correct: { ru: 'Верно. В уравнении есть и знак равно, и неизвестное.', uz: "To'g'ri. Tenglamada teng belgisi ham, noma'lum ham bor.", en: 'Right. An equation has both an equals sign and an unknown.' },
    rule_lines: {
      ru: ['уравнение это равенство с неизвестным', 'корень это число, при котором равенство верно', 'корень проверяют подстановкой'],
      uz: ["tenglama bu noma'lumli tenglik", "ildiz bu tenglikni to'g'ri qiladigan son", "ildiz qo'yib tekshiriladi"],
      en: ['an equation is an equality with an unknown', 'a root is the number that makes the equality true', 'a root is checked by putting it back in']
    },
    rule_ex: { ru: 'x + 3 = 10, корень x = 7', uz: 'x + 3 = 10, ildiz x = 7', en: 'x + 3 = 10, the root x = 7' },
    rule_speech: { ru: 'Уравнение это равенство, в котором одно число неизвестно. Число, при котором равенство становится верным, называют корнем уравнения. Найденный корень обязательно проверяют подстановкой.', uz: "Tenglama bu bitta soni noma'lum bo'lgan tenglik. Tenglikni to'g'ri qiladigan son tenglamaning ildizi deyiladi. Topilgan ildiz albatta qo'yib tekshiriladi.", en: 'An equation is an equality in which one number is unknown. The number that makes the equality true is called the root of the equation. The root you find must always be checked by putting it back in.' },
    audio: {
      intro: { ru: 'Соберём правило. Мы записали весы буквой и нашли число.', uz: "Qoidani yig'amiz. Tarozini harf bilan yozib, sonni topdik.", en: 'Let us gather the rule. We wrote the scales with a letter and found the number.' }
    }
  },

  s4: {
    eyebrow: { ru: 'Чертёж', uz: 'Chizma', en: 'The drawing' },
    q: { ru: 'Весы: слева x, справа 6 и 2. Чему равен x?', uz: "Tarozi: chapda x, o'ngda 6 va 2. x nechaga teng?", en: 'Scales: x on the left, 6 and 2 on the right. What does x equal?' },
    fig_w: 4,
    fig_h: 2,
    opts: [
      { ru: '8', uz: '8', en: '8' },
      { ru: '4', uz: '4', en: '4' },
      { ru: '62', uz: '62', en: '62' },
      { ru: '6', uz: '6', en: '6' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Четыре это разность, а гири на одной чаше складывают.', uz: "To'rt bu ayirma, bitta tovoqdagi toshlar esa qo'shiladi.", en: 'Four is the difference, and weights on one pan are added.' },
      2: { ru: 'Числа гирь не приписывают друг к другу.', uz: "Toshlar soni yonma-yon yozilmaydi.", en: 'The numbers of the weights are not written next to each other.' },
      3: { ru: 'Шесть это только одна гиря, а их две.', uz: "Olti bu bitta tosh, ular esa ikkita.", en: 'Six is only one weight, and there are two of them.' }
    },
    audio: {
      intro: { ru: 'Посмотри на весы. Слева ящик, справа две гири. Чему равен икс?', uz: "Taroziga qarang. Chapda yashik, o'ngda ikkita tosh. Iks nechaga teng?", en: 'Look at the scales. A box on the left, two weights on the right. What does x equal?' },
      on_correct: { ru: 'Верно. Шесть и два дают восемь.', uz: "To'g'ri. Olti va ikki sakkizni beradi.", en: 'Right. Six and two make eight.' },
      on_wrong: { ru: 'Сложи гири правой чаши.', uz: "O'ng tovoqdagi toshlarni qo'shing.", en: 'Add the weights of the right pan.' }
    }
  },

  s5: {
    eyebrow: { ru: 'Сортировка', uz: 'Saralash', en: 'Sorting' },
    lead: { ru: 'Разложи записи', uz: 'Yozuvlarni ajrating', en: 'Sort the records' },
    bin_a: { ru: 'уравнение', uz: 'tenglama', en: 'an equation' },
    bin_b: { ru: 'не уравнение', uz: 'tenglama emas', en: 'not an equation' },
    items: [
      { n: { ru: 'x − 5 = 4', uz: 'x − 5 = 4', en: 'x − 5 = 4' }, a: true, hint: { ru: 'Есть неизвестное и знак равно.', uz: "Noma'lum ham, teng belgisi ham bor.", en: 'There is an unknown and an equals sign.' } },
      { n: { ru: '8 + 6', uz: '8 + 6', en: '8 + 6' }, a: false, hint: { ru: 'Это выражение, его просто считают.', uz: "Bu ifoda, u shunchaki hisoblanadi.", en: 'That is an expression, you simply work it out.' } },
      { n: { ru: 'x · 2 = 12', uz: 'x · 2 = 12', en: 'x · 2 = 12' }, a: true, hint: { ru: 'Неизвестное и равенство на месте.', uz: "Noma'lum va tenglik joyida.", en: 'The unknown and the equality are both there.' } },
      { n: { ru: '9 = 9', uz: '9 = 9', en: '9 = 9' }, a: false, hint: { ru: 'Равенство верное, но искать нечего.', uz: "Tenglik to'g'ri, lekin izlaydigan narsa yo'q.", en: 'The equality is true, but there is nothing to look for.' } }
    ],
    audio: {
      intro: { ru: 'Четыре записи. Отправь каждую в свою корзину.', uz: "To'rtta yozuv. Har birini o'z savatiga yuboring.", en: 'Four records. Send each one to its basket.' },
      on_correct: { ru: 'Всё на месте. Уравнение узнают по двум приметам сразу. Это неизвестное и знак равно.', uz: "Hammasi joyida. Tenglama ikki belgidan birdan tanaladi. Bu noma'lum va teng belgisi.", en: 'All in place. An equation is known by two marks at once. An unknown and an equals sign.' },
      on_wrong: { ru: 'Проверь обе приметы, одной мало.', uz: "Ikkala belgini tekshiring, bittasi kam.", en: 'Check both marks, one is not enough.' }
    }
  },

  s6: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv', en: 'Checking' },
    q: { ru: 'Какое число является корнем уравнения x + 6 = 14?', uz: "x + 6 = 14 tenglamaning ildizi qaysi son?", en: 'Which number is the root of the equation x + 6 = 14?' },
    opts: [
      { ru: '8', uz: '8', en: '8' },
      { ru: '20', uz: '20', en: '20' },
      { ru: '6', uz: '6', en: '6' },
      { ru: '14', uz: '14', en: '14' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Двадцать это сумма, а не спрятанное число.', uz: "Yigirma bu yig'indi, yashiringan son emas.", en: 'Twenty is the sum, not the hidden number.' },
      2: { ru: 'Шесть уже стоит в записи, его не ищут.', uz: "Olti allaqachon yozuvda turibdi, u izlanmaydi.", en: 'Six is already in the record, we are not looking for it.' },
      3: { ru: 'Четырнадцать это правая часть.', uz: "O'n to'rt bu o'ng tomon.", en: 'Fourteen is the right-hand side.' }
    },
    audio: {
      intro: { ru: 'Быстрый вопрос. Какое число подходит вместо икса?', uz: "Tez savol. Iks o'rniga qaysi son to'g'ri keladi?", en: 'A quick question. Which number fits in place of x?' },
      on_correct: { ru: 'Верно. Восемь плюс шесть равно четырнадцать.', uz: "To'g'ri. Sakkiz qo'shuv olti teng o'n to'rt.", en: 'Right. Eight plus six equals fourteen.' },
      on_wrong: { ru: 'Подставь число вместо икса и проверь равенство.', uz: "Iks o'rniga sonni qo'yib, tenglikni tekshiring.", en: 'Put the number in place of x and check the equality.' }
    }
  },

  s7: {
    eyebrow: { ru: 'Консоль', uz: 'Konsol', en: 'Console' },
    lead: { ru: 'Уравнение x + 4 = 11', uz: 'Tenglama x + 4 = 11', en: 'The equation x + 4 = 11' },
    swap_line: 'x + 4 = 11',
    cells: [
      { head: { ru: 'известная часть', uz: "ma'lum qism", en: 'the known part' }, label: { ru: 'слагаемое', uz: "qo'shiluvchi", en: 'the addend' }, ans: 4, hint: { ru: 'Это число уже написано.', uz: 'Bu son allaqachon yozilgan.', en: 'That number is already written.' } },
      { head: { ru: 'вся сумма', uz: "butun yig'indi", en: 'the whole sum' }, label: { ru: 'справа', uz: "o'ngda", en: 'on the right' }, ans: 11, hint: { ru: 'Это правая часть равенства.', uz: "Bu tenglikning o'ng tomoni.", en: 'That is the right-hand side of the equality.' } },
      { head: { ru: 'корень', uz: 'ildiz', en: 'the root' }, label: '11 − 4', ans: 7, hint: { ru: 'Из суммы вычти известное слагаемое.', uz: "Yig'indidan ma'lum qo'shiluvchini ayiring.", en: 'Take the known addend away from the sum.' } }
    ],
    check: '7 + 4 = 11',
    check_label: { ru: 'проверка подстановкой', uz: "qo'yib tekshirish", en: 'a check by putting it back' },
    audio: {
      intro: { ru: 'Заполни три окна. Известное слагаемое, вся сумма и корень.', uz: "Uchta oynani to'ldiring. Ma'lum qo'shiluvchi, butun yig'indi va ildiz.", en: 'Fill three windows. The known addend, the whole sum and the root.' },
      on_correct: { ru: 'Корень семь, и проверка сошлась. Семь плюс четыре равно одиннадцать.', uz: "Ildiz yetti, tekshiruv mos tushdi. Yetti qo'shuv to'rt teng o'n bir.", en: 'The root is seven, and the check holds. Seven plus four equals eleven.' }
    }
  },

  s8: {
    eyebrow: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    q: { ru: 'Для x + 5 = 12 написали корень x = 17. Где ошибка?', uz: "x + 5 = 12 uchun ildiz x = 17 deb yozilibdi. Xato qayerda?", en: 'For x + 5 = 12 they wrote the root x = 17. Where is the mistake?' },
    fig_line: 'x + 5 = 12',
    opts: [
      { ru: 'сложили вместо вычитания', uz: "ayirish o'rniga qo'shilgan", en: 'they added instead of subtracting' },
      { ru: 'ошибки нет', uz: "xato yo'q", en: 'there is no mistake' },
      { ru: 'взяли не то число', uz: "son noto'g'ri olingan", en: 'the wrong number was taken' },
      { ru: 'это не уравнение', uz: 'bu tenglama emas', en: 'this is not an equation' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Подставь семнадцать и увидишь двадцать два вместо двенадцати.', uz: "O'n yettini qo'ysangiz, o'n ikki o'rniga yigirma ikki chiqadi.", en: 'Put in seventeen and you will see twenty two instead of twelve.' },
      2: { ru: 'Числа из записи взяты верно, подвело действие.', uz: "Yozuvdagi sonlar to'g'ri olingan, amal aldadi.", en: 'The numbers from the record were taken correctly, it is the operation that let it down.' },
      3: { ru: 'Неизвестное и знак равно на месте, это уравнение.', uz: "Noma'lum va teng belgisi joyida, bu tenglama.", en: 'The unknown and the equals sign are there, this is an equation.' }
    },
    audio: {
      intro: { ru: 'Кто-то решил уравнение и получил семнадцать. Найди ошибку.', uz: "Kimdir tenglamani yechib, o'n yetti olibdi. Xatoni toping.", en: 'Someone solved the equation and got seventeen. Find the mistake.' },
      on_correct: { ru: 'Верно. Чтобы найти слагаемое, из суммы вычитают, а не прибавляют. Корень семь.', uz: "To'g'ri. Qo'shiluvchini topish uchun yig'indidan ayiriladi, qo'shilmaydi. Ildiz yetti.", en: 'Right. To find an addend you subtract from the sum, you do not add. The root is seven.' },
      on_wrong: { ru: 'Подставь найденное число обратно и посмотри, сойдётся ли.', uz: "Topilgan sonni qaytarib qo'ying va mos tushishini ko'ring.", en: 'Put the number you found back in and see whether it holds.' }
    }
  },

  s9: {
    eyebrow: { ru: 'Ловушка Бита', uz: "Bit tuzog'i", en: "Bit's trap" },
    lead: { ru: 'Бит решает уравнение x − 4 = 6', uz: "Bit x − 4 = 6 tenglamani yechyapti", en: 'Bit is solving the equation x − 4 = 6' },
    lines: ['x − 4 = 6', 'Бит: значит x = 2, ведь 6 − 4 = 2'],
    lines_uz: ["x − 4 = 6", "Bit: demak x = 2, axir 6 − 4 = 2"],
    lines_en: ['x − 4 = 6', 'Bit: so x = 2, since 6 − 4 = 2'],
    line_cap: { ru: 'Бит: вычел и готово', uz: 'Bit: ayirdim va tayyor', en: 'Bit: I subtracted and it is done' },
    trap_label: { ru: 'Так ли это?', uz: 'Shundaymi?', en: 'Is that so?' },
    trap_opts: { ru: ['нет, проверка не сходится', 'да, всё верно'], uz: ["yo'q, tekshiruv mos tushmaydi", 'ha, hammasi to\'g\'ri'], en: ['no, the check does not hold', 'yes, that is right'] },
    trap_ci: 0,
    trap_correct: { ru: 'Да. Подставим двойку. Два минус четыре не даст шесть. Здесь неизвестное уменьшаемое, и его находят сложением. Корень десять.', uz: "Ha. Ikkini qo'yamiz. Ikki ayirish to'rt oltini bermaydi. Bu yerda kamayuvchi noma'lum, u qo'shish bilan topiladi. Ildiz o'n.", en: 'Yes. Let us put in two. Two minus four will not give six. Here the unknown is the number being reduced, and it is found by adding. The root is ten.' },
    trap_wrong: { ru: 'Подставь двойку в уравнение и посмотри, сойдётся ли равенство.', uz: "Ikkini tenglamaga qo'ying va tenglik mos tushishini ko'ring.", en: 'Put two into the equation and see whether the equality holds.' },
    audio: {
      ru: [
        'Бит решает уравнение икс минус четыре равно шесть.',
        'Вычитаю четыре из шести, получается два. Значит икс равен двум.',
        'Так ли это?'
      ],
      uz: [
        "Bit iks ayirish to'rt teng olti tenglamani yechyapti.",
        "Oltidan to'rtni ayiraman, ikki chiqadi. Demak iks ikkiga teng.",
        "Shundaymi?"
      ],
      en: ['Bit is solving the equation x minus four equals six.', 'I take four away from six and get two. So x equals two.', 'Is that so?']
    }
  },

  s10: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq', en: 'Trainer' },
    q: { ru: 'Найди корень: x + 8 = 15', uz: 'Ildizni toping: x + 8 = 15', en: 'Find the root: x + 8 = 15' },
    ans: 7,
    check: '15 − 8',
    check_label: { ru: 'из суммы вычитаем', uz: "yig'indidan ayiramiz", en: 'we subtract from the sum' },
    hint: { ru: 'Из пятнадцати вычти восемь.', uz: "O'n beshdan sakkizni ayiring.", en: 'Take eight away from fifteen.' },
    audio: {
      intro: { ru: 'Теперь решай сам. Икс плюс восемь равно пятнадцать.', uz: "Endi o'zingiz yeching. Iks qo'shuv sakkiz teng o'n besh.", en: 'Now solve it on your own. x plus eight equals fifteen.' },
      on_correct: { ru: 'Корень семь. Проверка сходится.', uz: "Ildiz yetti. Tekshiruv mos tushdi.", en: 'The root is seven. The check holds.' }
    }
  },

  s11: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq', en: 'Trainer' },
    q: { ru: 'Найди корень: x − 6 = 9', uz: 'Ildizni toping: x − 6 = 9', en: 'Find the root: x − 6 = 9' },
    ans: 15,
    check: '9 + 6',
    check_label: { ru: 'уменьшаемое находят сложением', uz: "kamayuvchi qo'shish bilan topiladi", en: 'the reduced number is found by adding' },
    hint: { ru: 'К девяти прибавь шесть.', uz: "To'qqizga oltini qo'shing.", en: 'Add six to nine.' },
    audio: {
      intro: { ru: 'И ещё уравнение. Икс минус шесть равно девять.', uz: "Yana tenglama. Iks ayirish olti teng to'qqiz.", en: 'And one more equation. x minus six equals nine.' },
      on_correct: { ru: 'Корень пятнадцать. Пятнадцать минус шесть равно девять.', uz: "Ildiz o'n besh. O'n besh ayirish olti teng to'qqiz.", en: 'The root is fifteen. Fifteen minus six equals nine.' }
    }
  },

  s12: {
    eyebrow: { ru: 'Задача', uz: 'Masala', en: 'Word problem' },
    lead: { ru: 'Ящики на складе', uz: 'Ombordagi yashiklar', en: 'The boxes in the store' },
    q: { ru: 'В ящике x кристаллов. Добавили 12, стало 30. Сколько было и сколько это десятков?', uz: "Yashikda x ta kristall bor. 12 ta qo'shildi, 30 ta bo'ldi. Qancha bor edi va bu necha o'nlik?", en: 'A box has x crystals. 12 were added and it became 30. How many were there and how many tens is that?' },
    q_speech: { ru: 'в ящике неизвестное число кристаллов, добавили двенадцать, стало тридцать. Сколько было и сколько это десятков?', uz: "yashikda noma'lum sondagi kristall bor, o'n ikkita qo'shildi, o'ttizta bo'ldi. Qancha bor edi va bu necha o'nlik?", en: 'a box has an unknown number of crystals, twelve were added and it became thirty. How many were there and how many tens is that?' },
    tbl_heads: [
      { ru: 'было', uz: 'bor edi', en: 'there was' },
      { ru: 'добавили', uz: "qo'shildi", en: 'added' },
      { ru: 'стало', uz: "bo'ldi", en: 'became' }
    ],
    tbl_cells: ['x', '12', '30'],
    pick_label: { ru: 'Какое уравнение подходит?', uz: 'Qaysi tenglama to\'g\'ri keladi?', en: 'Which equation fits?' },
    opts: [
      { ru: 'x + 12 = 30', uz: 'x + 12 = 30', en: 'x + 12 = 30' },
      { ru: 'x − 12 = 30', uz: 'x − 12 = 30', en: 'x − 12 = 30' },
      { ru: 'x · 12 = 30', uz: 'x · 12 = 30', en: 'x · 12 = 30' },
      { ru: '12 + 30 = x', uz: '12 + 30 = x', en: '12 + 30 = x' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Кристаллы добавляли, а не забирали.', uz: "Kristall qo'shilgan, olinmagan.", en: 'The crystals were added, not taken away.' },
      2: { ru: 'Умножения тут нет, добавили один раз.', uz: "Bu yerda ko'paytirish yo'q, bir marta qo'shilgan.", en: 'There is no multiplication here, they were added once.' },
      3: { ru: 'Так найдётся не то, что было, а больше того, что стало.', uz: "Bunda bor bo'lgani emas, bo'lganidan ham ko'pi chiqadi.", en: 'That would find not what there was, but more than what it became.' }
    },
    pick_ok: { ru: 'Верно. Сначала уравнение, потом корень.', uz: "To'g'ri. Avval tenglama, keyin ildiz.", en: 'Right. First the equation, then the root.' },
    step1_q: { ru: 'Сколько кристаллов было?', uz: 'Nechta kristall bor edi?', en: 'How many crystals were there?' },
    ans1: 18,
    hint1: { ru: 'Из тридцати вычти двенадцать.', uz: "O'ttizdan o'n ikkini ayiring.", en: 'Take twelve away from thirty.' },
    step2_q: { ru: 'Сколько это десятков и единиц вместе, если считать десятки?', uz: "O'nliklarni sanasak, bu nechta o'nlik?", en: 'How many tens are there in this number?' },
    ans2: 1,
    hint2: { ru: 'В восемнадцати один десяток.', uz: "O'n sakkizda bitta o'nlik bor.", en: 'There is one ten in eighteen.' },
    check: { ru: 'x = 18, проверка 18 + 12 = 30', uz: 'x = 18, tekshiruv 18 + 12 = 30', en: 'x = 18, check 18 + 12 = 30' },
    setup_audio: { ru: 'На складе считают кристаллы. Посмотри на таблицу и выбери уравнение.', uz: "Omborda kristallar hisoblanmoqda. Jadvalga qarang va tenglamani tanlang.", en: 'The crystals in the store are being counted. Look at the table and choose the equation.' },
    audio: {
      intro: { ru: 'В ящике неизвестное число кристаллов, добавили двенадцать, стало тридцать.', uz: "Yashikda noma'lum sondagi kristall bor, o'n ikkita qo'shildi, o'ttizta bo'ldi.", en: 'A box has an unknown number of crystals, twelve were added and it became thirty.' },
      on_correct: { ru: 'Было восемнадцать, и в этом числе один десяток. Проверка сошлась.', uz: "O'n sakkizta bor edi va bu sonda bitta o'nlik bor. Tekshiruv mos tushdi.", en: 'There were eighteen, and this number has one ten. The check holds.' },
      on_wrong: { ru: 'Сначала запиши уравнение по таблице.', uz: "Avval jadval bo'yicha tenglamani yozing.", en: 'First write the equation from the table.' }
    }
  },

  s13: {
    eyebrow: { ru: 'Финал', uz: 'Yakuniy', en: 'Final' },
    intro_line: { ru: 'Три задания. Каждый корень проверяй', uz: 'Uchta topshiriq. Har bir ildizni tekshiring', en: 'Three tasks. Check every root' },
    items: [
      {
        kind: 'num',
        q: { ru: 'Найди корень: x + 9 = 16', uz: 'Ildizni toping: x + 9 = 16', en: 'Find the root: x + 9 = 16' },
        q_speech: { ru: 'икс плюс девять равно шестнадцать. Чему равен икс?', uz: "iks qo'shuv to'qqiz teng o'n olti. Iks nechaga teng?", en: 'x plus nine equals sixteen. What does x equal?' },
        ans: 7,
        hint: { ru: 'Из шестнадцати вычти девять.', uz: "O'n oltidan to'qqizni ayiring.", en: 'Take nine away from sixteen.' }
      },
      {
        kind: 'num',
        q: { ru: 'Найди корень: x − 7 = 8', uz: 'Ildizni toping: x − 7 = 8', en: 'Find the root: x − 7 = 8' },
        q_speech: { ru: 'икс минус семь равно восемь. Чему равен икс?', uz: "iks ayirish yetti teng sakkiz. Iks nechaga teng?", en: 'x minus seven equals eight. What does x equal?' },
        ans: 15,
        hint: { ru: 'К восьми прибавь семь.', uz: "Sakkizga yettini qo'shing.", en: 'Add seven to eight.' }
      },
      {
        kind: 'num',
        q: { ru: 'Найди корень: 20 − x = 12', uz: 'Ildizni toping: 20 − x = 12', en: 'Find the root: 20 − x = 12' },
        q_speech: { ru: 'двадцать минус икс равно двенадцать. Чему равен икс?', uz: "yigirma ayirish iks teng o'n ikki. Iks nechaga teng?", en: 'twenty minus x equals twelve. What does x equal?' },
        ans: 8,
        hint: { ru: 'Из двадцати вычти двенадцать.', uz: "Yigirmadan o'n ikkini ayiring.", en: 'Take twelve away from twenty.' }
      }
    ],
    fact_badge: { ru: 'Знаешь ли ты?', uz: 'Bilasizmi?', en: 'Which line is wrong?' },
    fact_text: {
      ru: 'Знак равенства придумал английский учёный Роберт Рекорд почти пятьсот лет назад. До этого в книгах писали словами «равняется», и записи выходили длинными. Он выбрал две параллельные чёрточки и объяснил просто: нет ничего более равного, чем две одинаковые линии.',
      uz: "Tenglik belgisini ingliz olimi Robert Rekord qariyb besh yuz yil oldin o'ylab topgan. Bungacha kitoblarda tengdir deb so'z bilan yozishardi va yozuvlar uzun chiqardi. U ikkita parallel chiziqchani tanlab, oddiy tushuntirgan: ikkita bir xil chiziqdan ko'ra tengroq narsa yo'q.",
      en: 'The equals sign was invented by the English scientist Robert Recorde almost five hundred years ago. Before that books wrote out the word equals in full, and the records came out long. He chose two parallel strokes and explained it simply: nothing can be more equal than two identical lines.'
    },
    fact_audio: {
      ru: 'Вот откуда взялся знак равно. Его придумал английский учёный Роберт Рекорд почти пятьсот лет назад. До этого в книгах каждый раз писали слово равняется, и формулы получались длинными, как предложения. Рекорд взял две короткие параллельные чёрточки и объяснил свой выбор просто. Нет на свете ничего более равного, чем две одинаковые линии. Знак прижился, и теперь им пользуется весь мир.',
      uz: "Teng belgisi mana qayerdan kelgan. Uni ingliz olimi Robert Rekord qariyb besh yuz yil oldin o'ylab topgan. Bungacha kitoblarda har safar tengdir degan so'z yozilardi va formulalar gapdek uzun chiqardi. Rekord ikkita qisqa parallel chiziqchani olib, tanlovini oddiy tushuntirgan. Dunyoda ikkita bir xil chiziqdan ko'ra tengroq narsa yo'q. Belgi qabul qilingan va endi undan butun dunyo foydalanadi.",
      en: 'Here is where the equals sign came from. It was invented by the English scientist Robert Recorde almost five hundred years ago. Before that, books wrote out the word equals every time, and formulas came out as long as sentences. Recorde took two short parallel strokes and explained his choice simply. There is nothing in the world more equal than two identical lines. The sign caught on, and now the whole world uses it.'
    },
    audio: {
      intro: { ru: 'Три уравнения напоследок. Каждый корень проверяй подстановкой.', uz: "Oxirida uchta tenglama. Har bir ildizni qo'yib tekshiring.", en: 'Three equations at the end. Check every root by putting it back in.' },
      on_correct: { ru: 'Верно.', uz: "To'g'ri.", en: 'Correct.' },
      on_wrong: { ru: 'Подставь своё число обратно в уравнение.', uz: "O'z soningizni tenglamaga qaytarib qo'ying.", en: 'Put your number back into the equation.' }
    }
  },

  s14: {
    eyebrow: { ru: 'Итог', uz: 'Yakun', en: 'Result' },
    mission_done: { ru: 'Спрятанное число найдено!', uz: 'Yashiringan son topildi!', en: 'The hidden number is found!' },
    cando: {
      ru: ['узнаю уравнение по двум приметам', 'нахожу корень', 'проверяю корень подстановкой'],
      uz: ["tenglamani ikki belgidan tanayman", "ildizni topaman", "ildizni qo'yib tekshiraman"],
      en: ['I know an equation by its two marks', 'I find the root', 'I check the root by putting it back in']
    },
    rule_recap: { ru: 'Уравнение это равенство с неизвестным, а корень это число, при котором равенство верно.', uz: "Tenglama bu noma'lumli tenglik, ildiz esa tenglikni to'g'ri qiladigan son.", en: 'An equation is an equality with an unknown, and the root is the number that makes the equality true.' },
    conn_label_refs: { ru: 'опирается на', uz: 'nimaga tayanadi', en: 'builds on' },
    conn_refs: { ru: 'урок 14: связь компонентов; урок 42: весы', uz: "14-dars: komponentlar bog'lanishi; 42-dars: tarozi", en: 'lesson 14: how the parts are linked; lesson 42: the scales' },
    conn_label_next: { ru: 'дальше', uz: 'keyin', en: 'next' },
    conn_next: { ru: 'решение уравнений всех видов', uz: 'har xil turdagi tenglamalarni yechish', en: 'solving equations of every kind' },
    audio: {
      ru: 'Спрятанное число найдено. Запомни главное. Уравнение узнают по двум приметам сразу. В нём есть знак равно и есть неизвестное, обычно буква икс. Число, при котором равенство становится верным, называют корнем. И самое важное. Найденный корень всегда подставляют обратно и смотрят, сошлось ли равенство. Без этой проверки решение считается незаконченным. В следующий раз научимся решать уравнения со всеми четырьмя действиями!',
      uz: "Yashiringan son topildi. Asosiysini eslab qoling. Tenglama ikki belgidan birdan tanaladi. Unda teng belgisi ham, noma'lum ham bor, odatda iks harfi. Tenglikni to'g'ri qiladigan son ildiz deyiladi. Eng muhimi esa bu. Topilgan ildiz har doim qaytarib qo'yiladi va tenglik mos tushdimi, tekshiriladi. Bu tekshiruvsiz yechim tugallanmagan hisoblanadi. Keyingi safar to'rtala amalli tenglamalarni yechishni o'rganamiz!",
      en: 'The hidden number is found. Remember the main thing. An equation is known by two marks at once. It has an equals sign and it has an unknown, usually the letter x. The number that makes the equality true is called the root. And the most important thing. The root you find is always put back in, and you look at whether the equality holds. Without this check the solution counts as unfinished. Next time we will learn to solve equations with all four operations!'
    }
  }
};

const BRIDGES = {
  s1:  { ru: 'Запишем весы буквой.', uz: 'Tarozini harf bilan yozamiz.', en: 'Let us write the scales with a letter.' },
  s2:  { ru: 'Теперь проверим.', uz: 'Endi tekshiramiz.', en: 'Now let us check.' },
  s3:  { ru: "Соберём это в правило.", uz: "Buni qoidaga yig'amiz.", en: 'Let us gather this into a rule.' },
  s4:  { ru: 'Прочитай весы.', uz: "Tarozini o'qing.", en: 'Read the scales.' },
  s5:  { ru: 'Разложи записи.', uz: 'Yozuvlarni ajrating.', en: 'Sort the records.' },
  s6:  { ru: 'Быстрый вопрос.', uz: 'Tez savol.', en: 'A quick question.' },
  s7:  { ru: 'Заполни консоль.', uz: "Konsolni to'ldiring.", en: 'Fill the console.' },
  s8:  { ru: 'Тут выбрали не то действие.', uz: 'Bu yerda amal boshqa tanlanibdi.', en: 'Here the wrong operation was chosen.' },
  s9:  { ru: 'А вот и Бит со своим решением.', uz: "Mana Bit ham o'z yechimi bilan.", en: 'And here is Bit with his solution.' },
  s10: { ru: 'Теперь решай сам.', uz: "Endi o'zingiz yeching.", en: 'Now solve it on your own.' },
  s11: { ru: 'И ещё одно уравнение.', uz: 'Yana bitta tenglama.', en: 'And one more equation.' },
  s12: { ru: 'Задача со склада.', uz: 'Ombordan masala.', en: 'A task from the store.' },
  s13: { ru: 'Финальная проверка.', uz: 'Yakuniy tekshiruv.', en: 'The final check.' },
  s14: { ru: 'Подведём итог.', uz: 'Yakun yasaymiz.', en: 'Let us sum up.' }
};

const S14_PAYOFF = {
  ru: 'Число найдено. Весы сошлись, и проверка это подтвердила.',
  uz: "Son topildi. Tarozi tenglashdi va tekshiruv buni tasdiqladi.",
  en: 'The number is found. The scales agreed, and the check confirmed it.'
};

// --- SAHNA TUGUNI (D46): 1-DARSNING shahri, ustiga tenglik tarozisi.
const EquationNodeLayer = () => (
  <svg className="lm-scene-bg" viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <g transform="translate(200 124)">
      <rect x="-28" y="46" width="56" height="10" rx="3" fill="#C6AE7E" stroke="#8A7550" strokeWidth="1.2"/>
      <rect x="-4" y="-6" width="8" height="52" fill="#B7A176" stroke="#8A7550" strokeWidth="1"/>
      <line x1="-56" y1="-8" x2="56" y2="-8" stroke="#8A7550" strokeWidth="3" strokeLinecap="round"/>
      <g transform="translate(-56 -8)">
        <line x1="0" y1="0" x2="0" y2="10" stroke="#8A7550" strokeWidth="1.4"/>
        <path d="M-18 10 h36 l-7 13 h-22 Z" fill="#DCEBF5" stroke="#7FA8BF" strokeWidth="1.4"/>
        <text x="0" y="21" textAnchor="middle" fontSize="9" fontWeight="800" fill="#2E7E9E" fontFamily="'JetBrains Mono', monospace">x</text>
      </g>
      <g transform="translate(56 -8)">
        <line x1="0" y1="0" x2="0" y2="10" stroke="#8A7550" strokeWidth="1.4"/>
        <path d="M-18 10 h36 l-7 13 h-22 Z" fill="#FFD98A" stroke="#C06A2E" strokeWidth="1.4"/>
        <text x="0" y="21" textAnchor="middle" fontSize="8" fontWeight="800" fill="#8A5A2E" fontFamily="'JetBrains Mono', monospace">10</text>
      </g>
      <circle cx="0" cy="-8" r="4" fill="#FFE6A6" stroke="#8A7550" strokeWidth="1.2"/>
      <text x="0" y="70" textAnchor="middle" fontSize="8" letterSpacing="1.2" fill="#3F5A6B" fontFamily="'JetBrains Mono', monospace">x + 3 = 10</text>
    </g>
  </svg>
);

const LessonScene = ({ gathered = false }) => {
  const kid = ({ key, El, hook }, i) => (
    <span key={key} className="lm-crew lm-crew-kid g1-pop-in" style={{ animationDelay: `${0.25 + i * 0.12}s` }}>
      <El {...(gathered ? { mood: 'happy', pose: 'happy' } : hook)}/>
    </span>
  );
  return (
    <div className="lm-scene">
      <LumoCityBg fill/>
      <EquationNodeLayer/>
      <div className="lm-scene-cast">
        {LUMO_CAST.slice(0, 2).map(kid)}
        <span className={`lm-crew lm-crew-host ${gathered ? 'd2-bit-cheer' : 'lm-bob'}`}><span className="g1-cast-fig"><BitSVG state={gathered ? 'happy' : 'present'}/></span></span>
        {LUMO_CAST.slice(2).map((c, i) => kid(c, i + 2))}
      </div>
    </div>
  );
};

// --- EKRAN CHIZMASI (s4): tarozi, chapda x, o'ngda ikki tosh.
const BalanceFig = () => (
  <svg viewBox="0 0 240 120" style={{ width: 'min(270px, 85%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <rect x="98" y="30" width="44" height="10" rx="3" fill="none" stroke="none"/>
    <line x1="30" y1="34" x2="210" y2="34" stroke="#8A7550" strokeWidth="4" strokeLinecap="round"/>
    <rect x="114" y="34" width="12" height="56" fill="#B7A176" stroke="#8A7550" strokeWidth="1.6"/>
    <rect x="88" y="90" width="64" height="12" rx="3" fill="#C6AE7E" stroke="#8A7550" strokeWidth="1.6"/>
    <g transform="translate(30 34)">
      <line x1="0" y1="0" x2="0" y2="14" stroke="#8A7550" strokeWidth="1.6"/>
      <path d="M-24 14 h48 l-9 18 h-30 Z" fill="#DCEBF5" stroke="#2E7E9E" strokeWidth="2"/>
      <text x="0" y="29" textAnchor="middle" fontSize="14" fontWeight="800" fill="#2E7E9E" fontFamily="'JetBrains Mono', monospace">x</text>
    </g>
    <g transform="translate(210 34)">
      <line x1="0" y1="0" x2="0" y2="14" stroke="#8A7550" strokeWidth="1.6"/>
      <path d="M-26 14 h52 l-9 18 h-34 Z" fill="#FFE6A6" stroke="#C06A2E" strokeWidth="2"/>
      <text x="-9" y="29" textAnchor="middle" fontSize="12" fontWeight="800" fill="#8A5A2E" fontFamily="'JetBrains Mono', monospace">6</text>
      <text x="10" y="29" textAnchor="middle" fontSize="12" fontWeight="800" fill="#8A5A2E" fontFamily="'JetBrains Mono', monospace">2</text>
    </g>
  </svg>
);

// --- FACTCARD QAHRAMONI: eski uzun yozuv va Rekordning ikki chizig'i.
const EqualSignFig = () => {
  const lang = useLang();
  return (
  <svg viewBox="0 0 220 104" style={{ width: 'min(266px, 84%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <g transform="translate(16 30)">
      <rect x="0" y="0" width="86" height="46" rx="6" fill="#F7F1E4" stroke="#8A7550" strokeWidth="1.8"/>
      {[10, 20, 30].map((y, i) => <line key={i} x1="10" y1={y} x2={76 - i * 12} y2={y} stroke="#B0A48C" strokeWidth="3" strokeLinecap="round"/>)}
      <text x="43" y="62" textAnchor="middle" fontSize="8" fill="#8A7550" fontFamily="'JetBrains Mono', monospace">{tri(lang, 'словами', "so'z bilan", 'in words')}</text>
    </g>
    <path d="M112 52 h18 m-6 -6 l6 6 l-6 6" fill="none" stroke="#8A7550" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <g transform="translate(150 30)">
      <rect x="0" y="0" width="60" height="46" rx="6" fill="#FDF3E0" stroke="#C06A2E" strokeWidth="2"/>
      <line x1="14" y1="19" x2="46" y2="19" stroke="#C06A2E" strokeWidth="4" strokeLinecap="round"/>
      <line x1="14" y1="29" x2="46" y2="29" stroke="#C06A2E" strokeWidth="4" strokeLinecap="round"/>
      <text x="30" y="62" textAnchor="middle" fontSize="8" fill="#C06A2E" fontFamily="'JetBrains Mono', monospace">1557</text>
    </g>
  </svg>
  );
};

export default createLesson({
  TOTAL_SCREENS, LESSON_META, SCREEN_META, CONTENT, BRIDGES, S14_PAYOFF,
  STYLES: LESSON_STYLES,
  Scene: LessonScene,
  FactFig: EqualSignFig,
  figs: { s4: <BalanceFig/> }
});
