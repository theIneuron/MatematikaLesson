import React from 'react';
import { BitSVG, LUMO_CAST, LumoCityBg, createLesson, useLang, tri } from './_kit/index.jsx';
import { LESSON_STYLES } from './_kit/styles.js';

// ============================================================================
// DD 3-SINF | Dars49 — "Tengsizliklar, rost va yolg'on mulohazalar" (num-3-49)
// Б6 «O'LCHOVLAR» | Syujet: Lumo shahri (reja 54-satr).
// SAHNA: 1-DARSNING shahri, tugun — belgilar taxtasi.
// DARSLIK ASOSI (Burxonov, 3-sinf, «Sharq» 2019, 117-bet).
// YADRO: mulohaza — rost yoki yolg'on bo'ladigan tasdiq. Savol mulohaza emas. Kichik yoki
//   teng belgisi TENGLIKNI ham qamrab oladi, shuning uchun 5 ≤ 5 rost.
// Misconception: M1 «kichik yoki teng faqat kichik degani»; M2 belgini o'ngdan chapga
//   o'qish; M3 savolni mulohaza deb hisoblash; M4 «yolg'on demak ma'nosiz».
// FactCard: kompyuter ichida faqat rost va yolg'on bor — hamma hisob shu ikki javobga
//   keltiriladi.
// Bu dars MA'LUMOT fayli: ekranlar va mexanika kitda (`createLesson`).
// ============================================================================
const TOTAL_SCREENS = 15;
const LESSON_META = {
  lessonId: 'grade3-49',
  lessonTitle: { ru: 'Урок 49. Неравенства; истинные и ложные высказывания', uz: "49-dars. Tengsizliklar, rost va yolg'on mulohazalar", en: 'Lesson 49. Inequalities; true and false statements' }
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
    topic: { ru: 'Истинно или ложно', uz: "Rost yoki yolg'on", en: 'True or false' },
    lead: { ru: 'На табло надпись: 5 ≤ 5', uz: "Taxtada yozuv: 5 ≤ 5", en: 'The board says: 5 ≤ 5' },
    order_cap: { ru: 'знак читается «меньше или равно»', uz: "belgi «kichik yoki teng» deb o'qiladi", en: 'the sign reads: less than or equal to' },
    plate: ['5', '≤', '5'],
    q: { ru: 'Верна ли запись 5 ≤ 5?', uz: '5 ≤ 5 yozuvi rostmi?', en: 'Is the record 5 ≤ 5 true?' },
    opt0: { ru: 'верна', uz: 'rost', en: 'it is true' },
    opt1: { ru: 'неверна', uz: "yolg'on", en: 'it is false' },
    opt2: { ru: 'нельзя сказать', uz: "aytib bo'lmaydi", en: 'we cannot say' },
    opt3: { ru: 'это не запись', uz: 'bu yozuv emas', en: 'that is not a record' },
    audio: {
      intro: {
        ru: [
          'Задачи мы разобрали. Теперь научимся отвечать на вопрос, верна ли запись.',
          'На табло города горит надпись. Пять меньше или равно пяти.',
          'Пять не меньше пяти, но знак говорит не только про меньше.',
          'Как думаешь, верна ли эта запись?'
        ],
        uz: [
          "Masalalarni ko'rib chiqdik. Endi yozuv rostmi degan savolga javob berishni o'rganamiz.",
          "Shahar taxtasida yozuv yonib turibdi. Besh kichik yoki teng besh.",
          "Besh beshdan kichik emas, lekin belgi faqat kichik haqida aytmaydi.",
          "Sizningcha, bu yozuv rostmi?"
        ],
        en: ['We have sorted out problems. Now let us learn to answer whether a record is true.', 'A sign is lit on the city board. Five is less than or equal to five.', 'Five is not less than five, but the sign says more than just less than.', 'Do you think this record is true?']
      },
      on_correct: { ru: 'Верно! Знак меньше или равно допускает и равенство, поэтому запись истинна.', uz: "To'g'ri! Kichik yoki teng belgisi tenglikni ham qabul qiladi, shuning uchun yozuv rost.", en: 'Right! The less than or equal to sign allows equality as well, so the record is true.' },
      on_wrong1: { ru: 'Знак читают целиком. Достаточно, чтобы выполнялась хотя бы одна часть, а равенство здесь есть.', uz: "Belgi to'liq o'qiladi. Kamida bir qismi bajarilsa yetadi, tenglik esa bu yerda bor.", en: 'The sign is read in full. It is enough for at least one part to hold, and the equality does hold here.' },
      on_wrong2: { ru: 'Сказать можно точно. Любая такая запись либо верна, либо нет.', uz: "Aniq aytsa bo'ladi. Bunday yozuv yo rost, yo yolg'on.", en: 'We can say for certain. Any such record is either true or not.' },
      on_idk: { ru: 'Ничего. Сейчас разберём знак по частям.', uz: "Hechqisi yo'q. Hozir belgini qismlarga ajratamiz.", en: 'Never mind. Let us take the sign apart now.' }
    }
  },

  s1: {
    eyebrow: { ru: 'Разбор', uz: 'Tahlil', en: 'Working it out' },
    lead: { ru: 'Разбираем знак по частям', uz: 'Belgini qismlarga ajratamiz', en: 'We take the sign apart' },
    task_line: '5 ≤ 5',
    task_line_uz: "5 ≤ 5",
    task_line_en: '5 ≤ 5',
    step1: { ru: '5 < 5 — нет', uz: "5 < 5 — yo'q", en: '5 < 5 — no' },
    step1_cap: { ru: 'первая часть не выполнилась', uz: 'birinchi qism bajarilmadi', en: 'the first part did not hold' },
    step2: { ru: '5 = 5 — да', uz: '5 = 5 — ha', en: '5 = 5 — yes' },
    step2_cap: { ru: 'вторая выполнилась, и этого хватает', uz: 'ikkinchisi bajarildi, shuning o\'zi yetadi', en: 'the second held, and that is enough' },
    res: { ru: 'запись истинна', uz: 'yozuv rost', en: 'the record is true' },
    btn1: { ru: 'Проверить «меньше»', uz: '«Kichik» ni tekshirish', en: 'Check the less than part' },
    btn2: { ru: 'Проверить «равно»', uz: '«Teng» ni tekshirish', en: 'Check the equal to part' },
    done_text: { ru: 'Знак меньше или равно верен, если выполняется хотя бы одна из двух частей.', uz: "Kichik yoki teng belgisi ikki qismdan kamida bittasi bajarilsa rost bo'ladi.", en: 'The less than or equal to sign is true if at least one of the two parts holds.' },
    audio: {
      ru: [
        'Знак меньше или равно состоит из двух условий сразу.',
        'Проверим первое. Пять меньше пяти. Нет, это неправда.',
        'Проверим второе. Пять равно пяти. Да, это правда. Одного выполненного условия достаточно, поэтому вся запись верна.'
      ],
      uz: [
        "Kichik yoki teng belgisi birdan ikki shartdan iborat.",
        "Birinchisini tekshiramiz. Besh beshdan kichik. Yo'q, bu noto'g'ri.",
        "Ikkinchisini tekshiramiz. Besh beshga teng. Ha, bu rost. Bajarilgan bitta shart yetarli, shuning uchun butun yozuv rost."
      ],
      en: ['The less than or equal to sign has two conditions at once.', 'Let us check the first. Five is less than five. No, that is not true.', 'Let us check the second. Five equals five. Yes, that is true. One condition holding is enough, so the whole record is true.']
    }
  },

  s2: {
    eyebrow: { ru: 'Разбор', uz: 'Tahlil', en: 'Working it out' },
    w: 4,
    h: 4,
    lead: { ru: 'Не всякая запись бывает верной', uz: 'Har qanday yozuv rost bo\'lavermaydi', en: 'Not every record is true' },
    capA: { ru: '7 ≥ 9 — ложно', uz: "7 ≥ 9 — yolg'on", en: '7 ≥ 9 — false' },
    capB: { ru: 'сколько сейчас времени? — не высказывание', uz: "hozir soat necha? — mulohaza emas", en: 'what is the time? — not a statement' },
    res: { ru: 'истинно или ложно', uz: "rost yoki yolg'on", en: 'true or false' },
    btn1: { ru: 'Проверить неравенство', uz: 'Tengsizlikni tekshirish', en: 'Check the inequality' },
    btn2: { ru: 'Проверить вопрос', uz: 'Savolni tekshirish', en: 'Check the question' },
    done_text: { ru: 'Высказывание всегда либо истинно, либо ложно. Вопрос не высказывание.', uz: "Mulohaza har doim yo rost, yo yolg'on bo'ladi. Savol mulohaza emas.", en: 'A statement is always either true or false. A question is not a statement.' },
    audio: {
      ru: [
        'Теперь посмотрим на две другие записи.',
        'Семь больше или равно девяти. Семь не больше девяти и не равно ей. Ни одна часть не выполнилась, значит запись ложная. Ложная это не бессмысленная, а просто неверная.',
        'А вот вопрос сколько сейчас времени высказыванием не является. На него нельзя ответить истинно или ложно, ведь это не утверждение.'
      ],
      uz: [
        "Endi boshqa ikki yozuvga qaraymiz.",
        "Yetti katta yoki teng to'qqiz. Yetti to'qqizdan katta ham emas, unga teng ham emas. Hech bir qism bajarilmadi, demak yozuv yolg'on. Yolg'on degani ma'nosiz emas, shunchaki noto'g'ri.",
        "Hozir soat necha degan savol esa mulohaza emas. Unga rost yoki yolg'on deb javob berib bo'lmaydi, chunki bu tasdiq emas."
      ],
      en: ['Now let us look at two other records.', 'Seven is greater than or equal to nine. Seven is not greater than nine and not equal to it. Neither part held, so the record is false. False does not mean meaningless, simply untrue.', 'And the question what is the time is not a statement. It cannot be answered true or false, because it is not an assertion.']
    }
  },

  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    q: { ru: 'Какая запись является высказыванием?', uz: 'Qaysi yozuv mulohaza?', en: 'Which of these is a statement?' },
    opts: [
      { ru: '8 > 3', uz: '8 > 3', en: '8 > 3' },
      { ru: 'сколько будет 8 + 3?', uz: '8 + 3 nechaga teng?', en: 'what is 8 + 3?' },
      { ru: 'посчитай 8 и 3', uz: '8 va 3 ni sanang', en: 'work out 8 and 3' },
      { ru: '8 + 3', uz: '8 + 3', en: '8 + 3' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Это вопрос, на него отвечают числом, а не словом верно.', uz: "Bu savol, unga son bilan javob beriladi, rost so'zi bilan emas.", en: 'That is a question, it is answered with a number, not with the word true.' },
      2: { ru: 'Это просьба что-то сделать, а не утверждение.', uz: "Bu biror ishni bajarish iltimosi, tasdiq emas.", en: 'That is a request to do something, not an assertion.' },
      3: { ru: 'Это выражение, его считают, а не проверяют на истинность.', uz: "Bu ifoda, u hisoblanadi, rostligi tekshirilmaydi.", en: 'That is an expression, you work it out, you do not check it for truth.' }
    },
    on_correct: { ru: 'Верно. Только утверждение можно назвать истинным или ложным.', uz: "To'g'ri. Faqat tasdiqni rost yoki yolg'on deb atash mumkin.", en: 'Right. Only an assertion can be called true or false.' },
    rule_lines: {
      ru: ['высказывание либо истинно, либо ложно', 'знак ≤ верен и при равенстве', 'вопрос и просьба не высказывания'],
      uz: ["mulohaza yo rost, yo yolg'on", "≤ belgisi tenglikda ham rost", "savol va iltimos mulohaza emas"],
      en: ['a statement is either true or false', 'the sign ≤ is true when they are equal as well', 'a question and a request are not statements']
    },
    rule_ex: { ru: '5 ≤ 5 истинно, 7 ≥ 9 ложно', uz: "5 ≤ 5 rost, 7 ≥ 9 yolg'on", en: '5 ≤ 5 is true, 7 ≥ 9 is false' },
    rule_speech: { ru: 'Высказывание это утверждение, про которое можно сказать, истинно оно или ложно. Знак меньше или равно верен и тогда, когда числа равны. А вопрос или просьба высказыванием не являются.', uz: "Mulohaza bu rost yoki yolg'onligini ayta oladigan tasdiq. Kichik yoki teng belgisi sonlar teng bo'lganda ham rost. Savol yoki iltimos esa mulohaza emas.", en: 'A statement is an assertion about which you can say whether it is true or false. The less than or equal to sign is true when the numbers are equal as well. And a question or a request is not a statement.' },
    audio: {
      intro: { ru: 'Соберём правило. Мы проверили три разные записи.', uz: "Qoidani yig'amiz. Uchta har xil yozuvni tekshirdik.", en: 'Let us gather the rule. We checked three different records.' }
    }
  },

  s4: {
    eyebrow: { ru: 'Чертёж', uz: 'Chizma', en: 'The drawing' },
    q: { ru: 'Истинна ли запись 12 ≥ 12?', uz: '12 ≥ 12 yozuvi rostmi?', en: 'Is the record 12 ≥ 12 true?' },
    fig_w: 4,
    fig_h: 2,
    opts: [
      { ru: 'истинна', uz: 'rost', en: 'it is true' },
      { ru: 'ложна', uz: "yolg'on", en: 'it is false' },
      { ru: 'это вопрос', uz: 'bu savol', en: 'it is a question' },
      { ru: 'нет ответа', uz: "javob yo'q", en: 'there is no answer' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Знак больше или равно верен и при равенстве.', uz: "Katta yoki teng belgisi tenglikda ham rost.", en: 'The greater than or equal to sign is true when they are equal as well.' },
      2: { ru: 'Это утверждение, а не вопрос.', uz: "Bu tasdiq, savol emas.", en: 'That is an assertion, not a question.' },
      3: { ru: 'Ответ есть всегда. Либо истинно, либо ложно.', uz: "Javob har doim bor. Yo rost, yo yolg'on.", en: 'There is always an answer. Either true or false.' }
    },
    audio: {
      intro: { ru: 'Посмотри на запись. Двенадцать больше или равно двенадцати. Истинна ли она?', uz: "Yozuvga qarang. O'n ikki katta yoki teng o'n ikki. Bu rostmi?", en: 'Look at the record. Twelve is greater than or equal to twelve. Is it true?' },
      on_correct: { ru: 'Верно. Вторая часть знака выполнилась.', uz: "To'g'ri. Belgining ikkinchi qismi bajarildi.", en: 'Right. The second part of the sign held.' },
      on_wrong: { ru: 'Проверь обе части знака по очереди.', uz: "Belgining ikkala qismini navbat bilan tekshiring.", en: 'Check both parts of the sign in turn.' }
    }
  },

  s5: {
    eyebrow: { ru: 'Сортировка', uz: 'Saralash', en: 'Sorting' },
    lead: { ru: 'Разложи записи', uz: 'Yozuvlarni ajrating', en: 'Sort the records' },
    bin_a: { ru: 'истинно', uz: 'rost', en: 'true' },
    bin_b: { ru: 'ложно', uz: "yolg'on", en: 'false' },
    items: [
      { n: { ru: '9 > 4', uz: '9 > 4', en: '9 > 4' }, a: true, hint: { ru: 'Девять действительно больше четырёх.', uz: "To'qqiz rostdan to'rtdan katta.", en: 'Nine really is greater than four.' } },
      { n: { ru: '6 ≥ 8', uz: '6 ≥ 8', en: '6 ≥ 8' }, a: false, hint: { ru: 'Шесть не больше восьми и не равно ей.', uz: "Olti sakkizdan katta ham emas, teng ham emas.", en: 'Six is not greater than eight and not equal to it.' } },
      { n: { ru: '7 ≤ 7', uz: '7 ≤ 7', en: '7 ≤ 7' }, a: true, hint: { ru: 'Здесь выполняется равенство.', uz: "Bu yerda tenglik bajariladi.", en: 'Here the equality holds.' } },
      { n: { ru: '3 = 5', uz: '3 = 5', en: '3 = 5' }, a: false, hint: { ru: 'Три и пять разные числа.', uz: "Uch va besh har xil sonlar.", en: 'Three and five are different numbers.' } }
    ],
    audio: {
      intro: { ru: 'Четыре записи. Отправь каждую в свою корзину.', uz: "To'rtta yozuv. Har birini o'z savatiga yuboring.", en: 'Four records. Send each one to its basket.' },
      on_correct: { ru: 'Всё на месте. Ложная запись это не ошибка ученика, а просто неверное утверждение.', uz: "Hammasi joyida. Yolg'on yozuv o'quvchining xatosi emas, shunchaki noto'g'ri tasdiq.", en: "All in place. A false record is not a pupil's mistake, simply an untrue assertion." },
      on_wrong: { ru: 'Проверь обе части знака.', uz: "Belgining ikkala qismini tekshiring.", en: 'Check both parts of the sign.' }
    }
  },

  s6: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv', en: 'Checking' },
    q: { ru: 'При каком числе запись x ≤ 3 станет ложной?', uz: "Qaysi sonda x ≤ 3 yozuvi yolg'on bo'ladi?", en: 'For which number does the record x ≤ 3 become false?' },
    opts: [
      { ru: '4', uz: '4', en: '4' },
      { ru: '3', uz: '3', en: '3' },
      { ru: '2', uz: '2', en: '2' },
      { ru: '0', uz: '0', en: '0' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'При трёх выполняется равенство, запись истинна.', uz: "Uchda tenglik bajariladi, yozuv rost.", en: 'With three the equality holds, the record is true.' },
      2: { ru: 'Два меньше трёх, запись истинна.', uz: "Ikki uchdan kichik, yozuv rost.", en: 'Two is less than three, the record is true.' },
      3: { ru: 'Ноль тоже меньше трёх.', uz: "Nol ham uchdan kichik.", en: 'Zero is less than three as well.' }
    },
    audio: {
      intro: { ru: 'Быстрый вопрос. При каком числе запись икс меньше или равно три станет ложной?', uz: "Tez savol. Qaysi sonda iks kichik yoki teng uch yozuvi yolg'on bo'ladi?", en: 'A quick question. For which number does the record x less than or equal to three become false?' },
      on_correct: { ru: 'Верно. Четыре больше трёх, ни одна часть не выполняется.', uz: "To'g'ri. To'rt uchdan katta, hech bir qism bajarilmaydi.", en: 'Right. Four is greater than three, neither part holds.' },
      on_wrong: { ru: 'Подставь число и проверь обе части знака.', uz: "Sonni qo'yib, belgining ikkala qismini tekshiring.", en: 'Put the number in and check both parts of the sign.' }
    }
  },

  s7: {
    eyebrow: { ru: 'Консоль', uz: 'Konsol', en: 'Console' },
    lead: { ru: 'Проверяем запись 4 ≤ 9', uz: '4 ≤ 9 yozuvini tekshiramiz', en: 'We check the record 4 ≤ 9' },
    swap_line: '4 ≤ 9',
    cells: [
      { head: { ru: 'левое число', uz: 'chapdagi son', en: 'the left number' }, label: { ru: 'слева', uz: 'chapda', en: 'on the left' }, ans: 4, hint: { ru: 'Оно стоит перед знаком.', uz: 'U belgidan oldin turibdi.', en: 'It stands before the sign.' } },
      { head: { ru: 'правое число', uz: "o'ngdagi son", en: 'the right number' }, label: { ru: 'справа', uz: "o'ngda", en: 'on the right' }, ans: 9, hint: { ru: 'Оно стоит после знака.', uz: 'U belgidan keyin turibdi.', en: 'It stands after the sign.' } },
      { head: { ru: 'разница', uz: 'farq', en: 'the difference' }, label: '9 − 4', ans: 5, hint: { ru: 'На сколько правое больше левого.', uz: "O'ngdagisi chapdagidan nechaga katta.", en: 'How much bigger the right one is than the left one.' } }
    ],
    check: { ru: '4 < 9, значит 4 ≤ 9 истинно', uz: '4 < 9, demak 4 ≤ 9 rost', en: '4 < 9, so 4 ≤ 9 is true' },
    check_label: { ru: 'первая часть выполнилась', uz: 'birinchi qism bajarildi', en: 'the first part held' },
    audio: {
      intro: { ru: 'Заполни три окна. Левое число, правое и их разница.', uz: "Uchta oynani to'ldiring. Chapdagi son, o'ngdagisi va ularning farqi.", en: 'Fill three windows. The left number, the right one and their difference.' },
      on_correct: { ru: 'Четыре меньше девяти на пять. Первая часть знака выполнилась, запись истинна.', uz: "To'rt to'qqizdan besh birlik kichik. Belgining birinchi qismi bajarildi, yozuv rost.", en: 'Four is five less than nine. The first part of the sign held, the record is true.' }
    }
  },

  s8: {
    eyebrow: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    q: { ru: 'Записали: 6 ≤ 6 ложно. Где ошибка?', uz: "6 ≤ 6 yolg'on deb yozilibdi. Xato qayerda?", en: 'They wrote: 6 ≤ 6 is false. Where is the mistake?' },
    fig_line: '6 ≤ 6',
    opts: [
      { ru: 'забыли про равенство', uz: 'tenglik unutilgan', en: 'they forgot about the equality' },
      { ru: 'ошибки нет', uz: "xato yo'q", en: 'there is no mistake' },
      { ru: 'знак прочитали наоборот', uz: "belgi teskari o'qilgan", en: 'the sign was read the other way round' },
      { ru: 'это не высказывание', uz: 'bu mulohaza emas', en: 'this is not a statement' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Шесть равно шести, значит запись верна.', uz: "Olti oltiga teng, demak yozuv rost.", en: 'Six equals six, so the record is true.' },
      2: { ru: 'Знак прочитан правильно, подвела вторая часть.', uz: "Belgi to'g'ri o'qilgan, ikkinchi qism aldadi.", en: 'The sign was read correctly, it is the second part that let it down.' },
      3: { ru: 'Это утверждение, значит высказывание.', uz: "Bu tasdiq, demak mulohaza.", en: 'This is an assertion, so it is a statement.' }
    },
    audio: {
      intro: { ru: 'Кто-то назвал верную запись ложной. Найди ошибку.', uz: "Kimdir rost yozuvni yolg'on debdi. Xatoni toping.", en: 'Someone called a true record false. Find the mistake.' },
      on_correct: { ru: 'Верно. Знак меньше или равно верен и при равенстве чисел.', uz: "To'g'ri. Kichik yoki teng belgisi sonlar teng bo'lganda ham rost.", en: 'Right. The less than or equal to sign is true when the numbers are equal as well.' },
      on_wrong: { ru: 'Прочитай знак целиком, у него две части.', uz: "Belgini to'liq o'qing, unda ikki qism bor.", en: 'Read the sign in full, it has two parts.' }
    }
  },

  s9: {
    eyebrow: { ru: 'Ловушка Бита', uz: "Bit tuzog'i", en: "Bit's trap" },
    lead: { ru: 'Бит проверяет табло', uz: 'Bit taxtani tekshiryapti', en: 'Bit is checking the board' },
    lines: ['на табло 8 ≥ 8', 'Бит: знак больше, а числа равны, значит ложно'],
    lines_uz: ["taxtada 8 ≥ 8", "Bit: belgi katta, sonlar esa teng, demak yolg'on"],
    lines_en: ['the board shows 8 ≥ 8', 'Bit: the sign is greater than, and the numbers are equal, so it is false'],
    line_cap: { ru: 'Бит: читаю только первую часть', uz: 'Bit: faqat birinchi qismni o\'qiyman', en: 'Bit: I read only the first part' },
    trap_label: { ru: 'Так ли это?', uz: 'Shundaymi?', en: 'Is that so?' },
    trap_opts: { ru: ['нет, знак читают целиком', 'да, числа равны, значит ложно'], uz: ["yo'q, belgi to'liq o'qiladi", "ha, sonlar teng, demak yolg'on"], en: ['no, the sign is read in full', 'yes, the numbers are equal, so it is false'] },
    trap_ci: 0,
    trap_correct: { ru: 'Да. Знак больше или равно верен в двух случаях. Когда больше и когда равно. Восемь равно восьми, значит запись истинна.', uz: "Ha. Katta yoki teng belgisi ikki holda rost. Katta bo'lganda va teng bo'lganda. Sakkiz sakkizga teng, demak yozuv rost.", en: 'Yes. The greater than or equal to sign is true in two cases. When it is greater and when it is equal. Eight equals eight, so the record is true.' },
    trap_wrong: { ru: 'Прочитай знак вслух целиком и проверь обе части.', uz: "Belgini ovoz chiqarib to'liq o'qing va ikkala qismni tekshiring.", en: 'Read the sign aloud in full and check both parts.' },
    audio: {
      ru: [
        'Бит проверяет надпись на табло.',
        'Тут знак больше, а числа одинаковые. Больше не получилось, значит запись ложная.',
        'Так ли это?'
      ],
      uz: [
        "Bit taxtadagi yozuvni tekshiryapti.",
        "Bu yerda belgi katta, sonlar esa bir xil. Katta chiqmadi, demak yozuv yolg'on.",
        "Shundaymi?"
      ],
      en: ['Bit is checking the sign on the board.', 'The sign here is greater than, and the numbers are the same. Greater did not come out, so the record is false.', 'Is that so?']
    }
  },

  s10: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq', en: 'Trainer' },
    q: { ru: 'Сколько чисел от 1 до 9 подходят под запись x ≤ 4?', uz: "1 dan 9 gacha bo'lgan nechta son x ≤ 4 yozuviga to'g'ri keladi?", en: 'How many numbers from 1 to 9 fit the record x ≤ 4?' },
    ans: 4,
    check: '1, 2, 3, 4',
    check_label: { ru: 'равенство тоже подходит', uz: 'tenglik ham to\'g\'ri keladi', en: 'equality fits too' },
    hint: { ru: 'Не забудь про саму четвёрку.', uz: "To'rtning o'zini ham unutmang.", en: 'Do not forget the four itself.' },
    audio: {
      intro: { ru: 'Теперь считай сам. Сколько чисел от одного до девяти подходят под запись икс меньше или равно четыре?', uz: "Endi o'zingiz hisoblang. Birdan to'qqizgacha nechta son iks kichik yoki teng to'rt yozuviga to'g'ri keladi?", en: 'Now count on your own. How many numbers from one to nine fit the record x less than or equal to four?' },
      on_correct: { ru: 'Четыре числа. Один, два, три и сама четвёрка.', uz: "To'rtta son. Bir, ikki, uch va to'rtning o'zi.", en: 'Four numbers. One, two, three and the four itself.' }
    }
  },

  s11: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq', en: 'Trainer' },
    q: { ru: 'Какое наименьшее число подходит под запись x ≥ 6?', uz: "x ≥ 6 yozuviga to'g'ri keladigan eng kichik son qaysi?", en: 'What is the smallest number that fits the record x ≥ 6?' },
    ans: 6,
    check: '6 ≥ 6',
    check_label: { ru: 'равенство разрешено', uz: 'tenglikka ruxsat', en: 'equality is allowed' },
    hint: { ru: 'Само число тоже подходит.', uz: "Sonning o'zi ham to'g'ri keladi.", en: 'The number itself fits too.' },
    audio: {
      intro: { ru: 'И ещё вопрос. Какое наименьшее число подходит под запись икс больше или равно шесть?', uz: "Yana savol. Iks katta yoki teng olti yozuviga to'g'ri keladigan eng kichik son qaysi?", en: 'And one more question. What is the smallest number that fits the record x greater than or equal to six?' },
      on_correct: { ru: 'Шесть. Знак разрешает равенство.', uz: "Olti. Belgi tenglikka ruxsat beradi.", en: 'Six. The sign allows equality.' }
    }
  },

  s12: {
    eyebrow: { ru: 'Задача', uz: 'Masala', en: 'Word problem' },
    lead: { ru: 'Правило склада', uz: 'Ombor qoidasi', en: 'The rule of the store' },
    q: { ru: 'На полку кладут не больше 8 кристаллов. Сейчас лежит 5. Сколько ещё можно положить и сколько всего будет?', uz: "Javonga 8 tadan ortiq kristall qo'yilmaydi. Hozir 5 ta yotibdi. Yana nechtasini qo'ysa bo'ladi va jami nechta bo'ladi?", en: 'No more than 8 crystals are put on a shelf. There are 5 there now. How many more can be put and how many will there be in all?' },
    q_speech: { ru: 'на полку кладут не больше восьми кристаллов, сейчас лежит пять. Сколько ещё можно положить и сколько всего будет?', uz: "javonga sakkiztadan ortiq kristall qo'yilmaydi, hozir beshta yotibdi. Yana nechtasini qo'ysa bo'ladi va jami nechta bo'ladi?", en: 'no more than eight crystals are put on a shelf, there are five there now. How many more can be put and how many will there be in all?' },
    tbl_heads: [
      { ru: 'предел', uz: 'chegara', en: 'the limit' },
      { ru: 'лежит', uz: 'yotibdi', en: 'there are' },
      { ru: 'вопрос', uz: 'savol', en: 'question' }
    ],
    tbl_cells: ['8', '5', '?'],
    pick_label: { ru: 'Какая запись подходит?', uz: 'Qaysi yozuv to\'g\'ri keladi?', en: 'Which record fits?' },
    opts: [
      { ru: 'x ≤ 8', uz: 'x ≤ 8', en: 'x ≤ 8' },
      { ru: 'x < 8', uz: 'x < 8', en: 'x < 8' },
      { ru: 'x ≥ 8', uz: 'x ≥ 8', en: 'x ≥ 8' },
      { ru: 'x = 8', uz: 'x = 8', en: 'x = 8' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Ровно восемь класть можно, значит равенство разрешено.', uz: "Rosa sakkizta qo'ysa bo'ladi, demak tenglikka ruxsat.", en: 'Exactly eight may be put, so equality is allowed.' },
      2: { ru: 'Так на полке было бы не меньше восьми, а это другое правило.', uz: "Bunda javonda sakkiztadan kam bo'lmasdi, bu boshqa qoida.", en: 'That would mean the shelf has no fewer than eight, and that is a different rule.' },
      3: { ru: 'Ровно восемь это не единственный разрешённый вариант.', uz: "Rosa sakkizta yagona ruxsat etilgan variant emas.", en: 'Exactly eight is not the only allowed case.' }
    },
    pick_ok: { ru: 'Верно. Не больше восьми это меньше или равно восьми.', uz: "To'g'ri. Sakkiztadan ortiq emas degani sakkizdan kichik yoki teng.", en: 'Right. No more than eight means less than or equal to eight.' },
    step1_q: { ru: 'Сколько ещё можно положить?', uz: "Yana nechtasini qo'ysa bo'ladi?", en: 'How many more can be put?' },
    ans1: 3,
    hint1: { ru: 'Из восьми вычти пять.', uz: "Sakkizdan beshni ayiring.", en: 'Take five away from eight.' },
    step2_q: { ru: 'Сколько кристаллов будет на полке тогда?', uz: 'Shunda javonda nechta kristall bo\'ladi?', en: 'How many crystals will there be on the shelf then?' },
    ans2: 8,
    hint2: { ru: 'Пять и ещё три.', uz: "Besh va yana uch.", en: 'Five and three more.' },
    check: 'x ≤ 8, 5 + 3 = 8',
    setup_audio: { ru: 'На складе есть правило для полок. Посмотри на таблицу и выбери запись.', uz: "Omborda javonlar uchun qoida bor. Jadvalga qarang va yozuvni tanlang.", en: 'The store has a rule for the shelves. Look at the table and choose the record.' },
    audio: {
      intro: { ru: 'На полку кладут не больше восьми кристаллов, сейчас лежит пять.', uz: "Javonga sakkiztadan ortiq kristall qo'yilmaydi, hozir beshta yotibdi.", en: 'No more than eight crystals are put on a shelf, there are five there now.' },
      on_correct: { ru: 'Можно положить ещё три, и тогда на полке будет ровно восемь. Правило не нарушено.', uz: "Yana uchtasini qo'ysa bo'ladi, shunda javonda rosa sakkizta bo'ladi. Qoida buzilmadi.", en: 'Three more can be put, and then the shelf will have exactly eight. The rule is not broken.' },
      on_wrong: { ru: 'Сначала запиши правило знаком, потом считай.', uz: "Avval qoidani belgi bilan yozing, keyin hisoblang.", en: 'First write the rule with a sign, then count.' }
    }
  },

  s13: {
    eyebrow: { ru: 'Финал', uz: 'Yakuniy', en: 'Final' },
    intro_line: { ru: 'Три задания. Читай знак целиком', uz: "Uchta topshiriq. Belgini to'liq o'qing", en: 'Three tasks. Read the sign in full' },
    items: [
      {
        kind: 'num',
        q: { ru: 'Сколько чисел от 1 до 9 подходят под x ≤ 6?', uz: "1 dan 9 gacha nechta son x ≤ 6 ga to'g'ri keladi?", en: 'How many numbers from 1 to 9 fit x ≤ 6?' },
        q_speech: { ru: 'сколько чисел от одного до девяти подходят под икс меньше или равно шесть?', uz: "birdan to'qqizgacha nechta son iks kichik yoki teng olti ga to'g'ri keladi?", en: 'how many numbers from one to nine fit x less than or equal to six?' },
        ans: 6,
        hint: { ru: 'Шестёрка тоже подходит.', uz: "Oltining o'zi ham to'g'ri keladi.", en: 'The six fits too.' }
      },
      {
        kind: 'num',
        q: { ru: 'Какое наименьшее число подходит под x ≥ 4?', uz: "x ≥ 4 ga to'g'ri keladigan eng kichik son qaysi?", en: 'What is the smallest number that fits x ≥ 4?' },
        q_speech: { ru: 'какое наименьшее число подходит под икс больше или равно четыре?', uz: "iks katta yoki teng to'rt ga to'g'ri keladigan eng kichik son qaysi?", en: 'what is the smallest number that fits x greater than or equal to four?' },
        ans: 4,
        hint: { ru: 'Равенство разрешено.', uz: "Tenglikka ruxsat.", en: 'Equality is allowed.' }
      },
      {
        kind: 'num',
        q: { ru: 'Сколько чисел от 1 до 9 делают запись x > 7 истинной?', uz: "1 dan 9 gacha nechta son x > 7 yozuvini rost qiladi?", en: 'How many numbers from 1 to 9 make the record x > 7 true?' },
        q_speech: { ru: 'сколько чисел от одного до девяти делают запись икс больше семи истинной?', uz: "birdan to'qqizgacha nechta son iks katta yetti yozuvini rost qiladi?", en: 'how many numbers from one to nine make the record x greater than seven true?' },
        ans: 2,
        hint: { ru: 'Здесь равенство не разрешено.', uz: "Bu yerda tenglikka ruxsat yo'q.", en: 'Here equality is not allowed.' }
      }
    ],
    fact_badge: { ru: 'Знаешь ли ты?', uz: 'Bilasizmi?', en: 'Which line is wrong?' },
    fact_text: {
      ru: 'Внутри компьютера нет ничего, кроме истины и лжи. Любая картинка, песня и игра в конце концов превращаются в длинные цепочки ответов да и нет. Компьютер очень быстро проверяет такие утверждения, и из миллионов простых проверок складывается всё, что ты видишь на экране.',
      uz: "Kompyuter ichida rost va yolg'ondan boshqa hech nima yo'q. Har qanday rasm, qo'shiq va o'yin oxir-oqibat uzun ha va yo'q javoblar zanjiriga aylanadi. Kompyuter bunday tasdiqlarni juda tez tekshiradi va millionlab oddiy tekshiruvdan ekranda ko'rgan hamma narsangiz yig'iladi.",
      en: 'Inside a computer there is nothing but true and false. Any picture, song or game in the end turns into long chains of yes and no answers. A computer checks such statements very fast, and everything you see on the screen is made of millions of these simple checks.'
    },
    fact_audio: {
      ru: 'Вот что важно знать про наши знаки. Внутри компьютера нет ничего, кроме истины и лжи. Любая картинка, любая песня и любая игра в конце концов превращаются в длинные цепочки ответов да и нет. Компьютер умеет очень быстро проверять такие утверждения, миллионы штук в секунду. Из этих простых проверок и складывается всё, что ты видишь на экране. Так что вопрос истинно или ложно это не школьная выдумка, а основа всей техники вокруг.',
      uz: "Belgilarimiz haqida mana nimani bilish muhim. Kompyuter ichida rost va yolg'ondan boshqa hech nima yo'q. Har qanday rasm, har qanday qo'shiq va har qanday o'yin oxir-oqibat uzun ha va yo'q javoblar zanjiriga aylanadi. Kompyuter bunday tasdiqlarni juda tez tekshira oladi, sekundiga millionlab. Ana shu oddiy tekshiruvlardan ekranda ko'rgan hamma narsangiz yig'iladi. Demak rostmi yoki yolg'onmi degan savol maktab o'yini emas, atrofdagi butun texnikaning asosi.",
      en: 'Here is something worth knowing about our signs. Inside a computer there is nothing but true and false. Any picture, any song and any game in the end turns into long chains of yes and no answers. A computer can check such statements very fast, millions of them every second. Everything you see on the screen is built from these simple checks. So the question true or false is not a school invention but the base of all the machines around you.'
    },
    audio: {
      intro: { ru: 'Три задания напоследок. Проверяй обе части знака.', uz: "Oxirida uchta topshiriq. Belgining ikkala qismini tekshiring.", en: 'Three tasks at the end. Check both parts of the sign.' },
      on_correct: { ru: 'Верно.', uz: "To'g'ri.", en: 'Correct.' },
      on_wrong: { ru: 'Смотри, разрешает знак равенство или нет.', uz: "Belgi tenglikka ruxsat beradimi yoki yo'qmi, qarang.", en: 'Look at whether the sign allows equality or not.' }
    }
  },

  s14: {
    eyebrow: { ru: 'Итог', uz: 'Yakun', en: 'Result' },
    mission_done: { ru: 'Табло проверено!', uz: 'Taxta tekshirildi!', en: 'The board is checked!' },
    cando: {
      ru: ['отличаю высказывание от вопроса', 'читаю знак целиком', 'проверяю запись на истинность'],
      uz: ["mulohazani savoldan ajrataman", "belgini to'liq o'qiyman", "yozuvning rostligini tekshiraman"],
      en: ['I tell a statement from a question', 'I read the sign in full', 'I check a record for truth']
    },
    rule_recap: { ru: 'Высказывание либо истинно, либо ложно, а знаки ≤ и ≥ верны и при равенстве.', uz: "Mulohaza yo rost, yo yolg'on, ≤ va ≥ belgilari esa tenglikda ham rost.", en: 'A statement is either true or false, and the signs ≤ and ≥ are true when the numbers are equal as well.' },
    conn_label_refs: { ru: 'опирается на', uz: 'nimaga tayanadi', en: 'builds on' },
    conn_refs: { ru: 'урок 4: сравнение чисел; урок 46: равенство', uz: "4-dars: sonlarni taqqoslash; 46-dars: tenglik", en: 'lesson 4: comparing numbers; lesson 46: equality' },
    conn_label_next: { ru: 'дальше', uz: 'keyin', en: 'next' },
    conn_next: { ru: 'круговые диаграммы и чтение данных', uz: "doiraviy diagrammalar va ma'lumot o'qish", en: 'pie charts and reading data' },
    audio: {
      ru: 'Табло проверено. Запомни главное. Высказывание это утверждение, про которое всегда можно сказать, истинно оно или ложно. Вопрос и просьба высказываниями не являются. А знаки меньше или равно и больше или равно читают целиком, до конца. Они верны и тогда, когда числа равны. Именно на этом месте ошибаются чаще всего, и Бит уже показал как. В следующий раз научимся читать круговые диаграммы!',
      uz: "Taxta tekshirildi. Asosiysini eslab qoling. Mulohaza bu rost yoki yolg'onligini har doim ayta oladigan tasdiq. Savol va iltimos mulohaza emas. Kichik yoki teng hamda katta yoki teng belgilari esa oxirigacha, to'liq o'qiladi. Ular sonlar teng bo'lganda ham rost. Aynan shu joyda ko'proq adashishadi, buni Bit ko'rsatib berdi. Keyingi safar doiraviy diagrammalarni o'qishni o'rganamiz!",
      en: 'The board is checked. Remember the main thing. A statement is an assertion about which you can always say whether it is true or false. A question and a request are not statements. And the signs less than or equal to and greater than or equal to are read in full, right to the end. They are true when the numbers are equal as well. That is exactly the place where mistakes happen most often, and Bit has already shown how. Next time we will learn to read pie charts!'
    }
  }
};

const BRIDGES = {
  s1:  { ru: 'Разберём знак.', uz: 'Belgini ajratamiz.', en: 'Let us take the sign apart.' },
  s2:  { ru: 'Теперь другие записи.', uz: 'Endi boshqa yozuvlar.', en: 'Now the other records.' },
  s3:  { ru: "Соберём это в правило.", uz: "Buni qoidaga yig'amiz.", en: 'Let us gather this into a rule.' },
  s4:  { ru: 'Прочитай запись.', uz: "Yozuvni o'qing.", en: 'Read the record.' },
  s5:  { ru: 'Разложи записи.', uz: 'Yozuvlarni ajrating.', en: 'Sort the records.' },
  s6:  { ru: 'Быстрый вопрос.', uz: 'Tez savol.', en: 'A quick question.' },
  s7:  { ru: 'Заполни консоль.', uz: "Konsolni to'ldiring.", en: 'Fill the console.' },
  s8:  { ru: 'Тут знак прочли наполовину.', uz: 'Bu yerda belgi yarim o\'qilibdi.', en: 'Here the sign was read only halfway.' },
  s9:  { ru: 'А вот и Бит со своей проверкой.', uz: "Mana Bit ham o'z tekshiruvi bilan.", en: 'And here is Bit with his check.' },
  s10: { ru: 'Теперь считай сам.', uz: "Endi o'zingiz hisoblang.", en: 'Now count on your own.' },
  s11: { ru: 'И ещё один знак.', uz: 'Yana bitta belgi.', en: 'And one more sign.' },
  s12: { ru: 'Задача со склада.', uz: 'Ombordan masala.', en: 'A task from the store.' },
  s13: { ru: 'Финальная проверка.', uz: 'Yakuniy tekshiruv.', en: 'The final check.' },
  s14: { ru: 'Подведём итог.', uz: 'Yakun yasaymiz.', en: 'Let us sum up.' }
};

const S14_PAYOFF = {
  ru: 'Табло проверено. Знак прочитан до конца, и ответ нашёлся.',
  uz: "Taxta tekshirildi. Belgi oxirigacha o'qildi va javob topildi.",
  en: 'The board is checked. The sign was read to the end, and the answer was found.'
};

// --- SAHNA TUGUNI (D49): 1-DARSNING shahri, ustiga belgilar taxtasi.
const SignsNodeLayer = () => {
  const lang = useLang();
  return (
  <svg className="lm-scene-bg" viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <g transform="translate(134 100)">
      <rect x="0" y="0" width="132" height="66" rx="6" fill="#14203C" stroke="#8A7550" strokeWidth="2"/>
      <text x="66" y="26" textAnchor="middle" fontSize="18" fontWeight="800" fill="#FFD98A" fontFamily="'JetBrains Mono', monospace">5 ≤ 5</text>
      <text x="66" y="46" textAnchor="middle" fontSize="9" letterSpacing="1.2" fill="#8CE38A" fontFamily="'JetBrains Mono', monospace">{tri(lang, 'ИСТИННО', 'ROST', 'TRUE')}</text>
      <text x="66" y="60" textAnchor="middle" fontSize="7" fill="#BFD4EA" fontFamily="'JetBrains Mono', monospace">{tri(lang, '7 ≥ 9 — ложно', "7 ≥ 9 — yolg'on", '7 ≥ 9 — false')}</text>
    </g>
  </svg>
  );
};

const LessonScene = ({ gathered = false }) => {
  const kid = ({ key, El, hook }, i) => (
    <span key={key} className="lm-crew lm-crew-kid g1-pop-in" style={{ animationDelay: `${0.25 + i * 0.12}s` }}>
      <El {...(gathered ? { mood: 'happy', pose: 'happy' } : hook)}/>
    </span>
  );
  return (
    <div className="lm-scene">
      <LumoCityBg fill/>
      <SignsNodeLayer/>
      <div className="lm-scene-cast">
        {LUMO_CAST.slice(0, 2).map(kid)}
        <span className={`lm-crew lm-crew-host ${gathered ? 'd2-bit-cheer' : 'lm-bob'}`}><span className="g1-cast-fig"><BitSVG state={gathered ? 'happy' : 'present'}/></span></span>
        {LUMO_CAST.slice(2).map((c, i) => kid(c, i + 2))}
      </div>
    </div>
  );
};

// --- EKRAN CHIZMASI (s4): 12 ≥ 12 va belgining ikki qismi.
const SignFig = () => {
  const lang = useLang();
  return (
  <svg viewBox="0 0 240 110" style={{ width: 'min(270px, 85%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <text x="60" y="52" textAnchor="middle" fontSize="30" fontWeight="800" fill="#3A3530" fontFamily="'JetBrains Mono', monospace">12</text>
    <text x="120" y="52" textAnchor="middle" fontSize="30" fontWeight="800" fill="#C06A2E" fontFamily="'JetBrains Mono', monospace">≥</text>
    <text x="180" y="52" textAnchor="middle" fontSize="30" fontWeight="800" fill="#3A3530" fontFamily="'JetBrains Mono', monospace">12</text>
    <g transform="translate(120 76)">
      <rect x="-64" y="0" width="60" height="22" rx="5" fill="#FDF3E0" stroke="#C06A2E" strokeWidth="1.6"/>
      <text x="-34" y="15" textAnchor="middle" fontSize="9" fontWeight="800" fill="#C06A2E" fontFamily="'JetBrains Mono', monospace">{tri(lang, 'больше?', 'katta?', 'greater?')}</text>
      <rect x="6" y="0" width="60" height="22" rx="5" fill="#E9F7EE" stroke="#1F7A4D" strokeWidth="1.6"/>
      <text x="36" y="15" textAnchor="middle" fontSize="9" fontWeight="800" fill="#1F7A4D" fontFamily="'JetBrains Mono', monospace">{tri(lang, 'равно?', 'teng?', 'equal?')}</text>
    </g>
  </svg>
  );
};

// --- FACTCARD QAHRAMONI: ha va yo'q zanjiri kompyuter ichida.
const BitsFig = () => {
  const lang = useLang();
  return (
  <svg viewBox="0 0 220 104" style={{ width: 'min(266px, 84%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <rect x="14" y="20" width="192" height="64" rx="8" fill="#14203C" stroke="#2E7E9E" strokeWidth="2"/>
    {Array.from({ length: 4 }).map((_, r) => (
      Array.from({ length: 8 }).map((_, c) => {
        const on = (r + c) % 3 === 0;
        return (
          <text key={`${r}-${c}`} x={30 + c * 23} y={38 + r * 14} textAnchor="middle" fontSize="10" fontWeight="800"
            fill={on ? '#8CE38A' : '#4E6B8A'} fontFamily="'JetBrains Mono', monospace">{on ? '1' : '0'}</text>
        );
      })
    ))}
    <text x="110" y="98" textAnchor="middle" fontSize="8" fill="#8A7550" fontFamily="'JetBrains Mono', monospace">{tri(lang, 'да или нет', "ha yoki yo'q", 'yes or no')}</text>
  </svg>
  );
};

export default createLesson({
  TOTAL_SCREENS, LESSON_META, SCREEN_META, CONTENT, BRIDGES, S14_PAYOFF,
  STYLES: LESSON_STYLES,
  Scene: LessonScene,
  FactFig: BitsFig,
  figs: { s4: <SignFig/> }
});
