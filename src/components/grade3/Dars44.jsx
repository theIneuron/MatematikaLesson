import React from 'react';
import { BitSVG, LUMO_CAST, LumoCityBg, createLesson, useLang, tri } from './_kit/index.jsx';
import { LESSON_STYLES } from './_kit/styles.js';

// ============================================================================
// DD 3-SINF | Dars44 — "Uzunlik birliklari: sm, dm, m" (num-3-44) | Б6 «O'LCHOVLAR»
// Syujet: Lumo shahri (reja 49-satr). SAHNA: 1-DARSNING shahri, tugun — o'lchov chizg'ichi.
// DARSLIK ASOSI (Burxonov, 3-sinf, «Sharq» 2019, 102-bet).
// YADRO: uzunlik birliklari O'NLIK: 1 dm = 10 sm, 1 m = 10 dm = 100 sm. Massa va vaqtdan
//   farqli o'laroq bu yerda hisob o'nlab boradi.
// Misconception: M1 «bir metrda 10 santimetr»; M2 har xil birlikni qo'shish; M3 dm va sm ni
//   yozuvda chalkashtirish; M4 «son katta bo'lsa uzunroq» (5 m va 40 sm).
// FactCard: metr Yer o'lchovidan olingan — qutbdan ekvatorgacha masofaning o'n millióndan
//   bir qismi.
// Bu dars MA'LUMOT fayli: ekranlar va mexanika kitda (`createLesson`).
// ============================================================================
const TOTAL_SCREENS = 15;
const LESSON_META = {
  lessonId: 'grade3-44',
  lessonTitle: { ru: 'Урок 44. Единицы длины: см, дм, м', uz: '44-dars. Uzunlik birliklari: sm, dm, m', en: 'Lesson 44. Units of length: cm, dm, m' }
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
    topic: { ru: 'Единицы длины', uz: 'Uzunlik birliklari', en: 'Units of length' },
    lead: { ru: 'Ленту 40 см сравнили с рейкой 2 м', uz: "40 sm lenta 2 m reyka bilan solishtirildi", en: 'A ribbon of 40 cm was compared with a batten of 2 m' },
    order_cap: { ru: 'число больше у ленты', uz: 'son lentada kattaroq', en: 'the ribbon has the bigger number' },
    plate: ['1', 'm', '100'],
    q: { ru: 'Что длиннее: лента 40 см или рейка 2 м?', uz: "Qaysi biri uzun: 40 sm lentami yoki 2 m reykami?", en: 'Which is longer: a ribbon of 40 cm or a batten of 2 m?' },
    opt0: { ru: 'рейка', uz: 'reyka', en: 'the batten' },
    opt1: { ru: 'лента', uz: 'lenta', en: 'the ribbon' },
    opt2: { ru: 'одинаково', uz: 'bir xil', en: 'the same' },
    opt3: { ru: 'нельзя сравнить', uz: "solishtirib bo'lmaydi", en: 'they cannot be compared' },
    audio: {
      intro: {
        ru: [
          'Массу и время мы разобрали. Вернёмся к длине, но теперь с мерками.',
          'На складе лента длиной сорок сантиметров и рейка длиной два метра.',
          'У ленты число больше, но мерки разные.',
          'Как думаешь, что длиннее?'
        ],
        uz: [
          "Massa va vaqtni ko'rib chiqdik. Endi uzunlikka qaytamiz, bu safar o'lchovlar bilan.",
          "Omborda uzunligi qirq santimetr lenta va uzunligi ikki metr reyka bor.",
          "Lentada son kattaroq, lekin o'lchovlar har xil.",
          "Sizningcha, qaysi biri uzun?"
        ],
        en: ['We have sorted out mass and time. Let us come back to length, but now with measures.', 'In the store there is a ribbon forty centimetres long and a batten two metres long.', 'The ribbon has the bigger number, but the measures are different.', 'Which do you think is longer?']
      },
      on_correct: { ru: 'Верно! Рейка длиннее. Число само по себе ничего не решает, пока не сказана мерка.', uz: "To'g'ri! Reyka uzunroq. Son o'zi hech nimani hal qilmaydi, o'lchov aytilmaguncha.", en: 'Right! The batten is longer. A number on its own decides nothing until the measure is named.' },
      on_wrong1: { ru: 'Сорок больше двух, но сорок сантиметров это меньше полуметра.', uz: "Qirq ikkidan katta, lekin qirq santimetr yarim metrdan kam.", en: 'Forty is more than two, but forty centimetres is less than half a metre.' },
      on_wrong2: { ru: 'Два метра это двести сантиметров, куда больше сорока.', uz: "Ikki metr bu ikki yuz santimetr, qirqdan ancha ko'p.", en: 'Two metres is two hundred centimetres, far more than forty.' },
      on_idk: { ru: 'Ничего. Сейчас приведём обе к одной мерке.', uz: "Hechqisi yo'q. Hozir ikkalasini bitta o'lchovga keltiramiz.", en: 'Never mind. Let us bring both to one measure.' }
    }
  },

  s1: {
    eyebrow: { ru: 'Разбор', uz: 'Tahlil', en: 'Working it out' },
    lead: { ru: 'Складываем линейку в дециметры', uz: "Chizg'ichni detsimetrlarga bo'lamiz", en: 'We fold the ruler into decimetres' },
    task_line: 'линейка 20 см',
    task_line_uz: "chizg'ich 20 sm",
    task_line_en: 'a ruler of 20 cm',
    step1: { ru: '10 см = 1 дм', uz: '10 sm = 1 dm', en: '10 cm = 1 dm' },
    step1_cap: { ru: 'десять клеточек это дециметр', uz: "o'nta katak bu detsimetr", en: 'ten little squares make a decimetre' },
    step2: { ru: '20 см = 2 дм', uz: '20 sm = 2 dm', en: '20 cm = 2 dm' },
    step2_cap: { ru: 'вся линейка это два дециметра', uz: "butun chizg'ich ikki detsimetr", en: 'the whole ruler is two decimetres' },
    res: { ru: '1 дм = 10 см', uz: '1 dm = 10 sm', en: '1 dm = 10 cm' },
    btn1: { ru: 'Отметить дециметр', uz: 'Detsimetrni belgilash', en: 'Mark off a decimetre' },
    btn2: { ru: 'Отметить второй', uz: 'Ikkinchisini belgilash', en: 'Mark off the second' },
    done_text: { ru: 'Дециметр это десять сантиметров, ровно как десяток единиц.', uz: "Detsimetr bu o'n santimetr, xuddi bir o'nlik birlikdek.", en: 'A decimetre is ten centimetres, exactly like a ten of units.' },
    audio: {
      ru: [
        'Возьмём обычную линейку и посмотрим на её деления.',
        'Десять сантиметров подряд складываются в один дециметр.',
        'На линейке двадцать сантиметров, то есть ровно два дециметра. Здесь счёт идёт десятками, как у обычных чисел.'
      ],
      uz: [
        "Oddiy chizg'ichni olib, uning bo'linmalariga qaraymiz.",
        "Ketma-ket o'n santimetr bitta detsimetrga yig'iladi.",
        "Chizg'ichda yigirma santimetr, ya'ni rosa ikki detsimetr bor. Bu yerda hisob oddiy sonlardek o'nlab boradi."
      ],
      en: ['Let us take an ordinary ruler and look at its divisions.', 'Ten centimetres in a row add up to one decimetre.', 'There are twenty centimetres on the ruler, that is exactly two decimetres. Here the count goes in tens, like ordinary numbers.']
    }
  },

  s2: {
    eyebrow: { ru: 'Разбор', uz: 'Tahlil', en: 'Working it out' },
    w: 4,
    h: 4,
    lead: { ru: 'От дециметра к метру', uz: 'Detsimetrdan metrga', en: 'From the decimetre to the metre' },
    capA: { ru: '10 дм = 1 м', uz: '10 dm = 1 m', en: '10 dm = 1 m' },
    capB: { ru: '100 см = 1 м', uz: '100 sm = 1 m', en: '100 cm = 1 m' },
    res: { ru: 'метр это сто сантиметров', uz: 'metr bu yuz santimetr', en: 'a metre is a hundred centimetres' },
    btn1: { ru: 'Сложить дециметры', uz: "Detsimetrlarni yig'ish", en: 'Add the decimetres' },
    btn2: { ru: 'Пересчитать в см', uz: 'sm ga qayta sanash', en: 'Count them in cm' },
    done_text: { ru: 'В метре десять дециметров и сто сантиметров. Мерки связаны десятками.', uz: "Bir metrda o'n detsimetr va yuz santimetr bor. O'lchovlar o'nlab bog'langan.", en: 'There are ten decimetres and a hundred centimetres in a metre. The measures are linked by tens.' },
    audio: {
      ru: [
        'Теперь возьмём мерку побольше.',
        'Десять дециметров подряд дают один метр.',
        'А если считать сантиметрами, то в метре их сто. Десять дециметров по десять сантиметров каждый.'
      ],
      uz: [
        "Endi kattaroq o'lchovni olamiz.",
        "Ketma-ket o'n detsimetr bitta metr beradi.",
        "Santimetr bilan sanasak, bir metrda ular yuzta. O'nta detsimetr, har birida o'n santimetrdan."
      ],
      en: ['Now let us take a bigger measure.', 'Ten decimetres in a row give one metre.', 'And if we count in centimetres, there are a hundred of them in a metre. Ten decimetres of ten centimetres each.']
    }
  },

  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    q: { ru: 'Сколько сантиметров в одном метре?', uz: 'Bir metrda necha santimetr bor?', en: 'How many centimetres are in one metre?' },
    opts: [
      { ru: '100', uz: '100', en: '100' },
      { ru: '10', uz: '10', en: '10' },
      { ru: '60', uz: '60', en: '60' },
      { ru: '1000', uz: '1000', en: '1000' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Десять сантиметров это дециметр, а не метр.', uz: "O'n santimetr bu detsimetr, metr emas.", en: 'Ten centimetres is a decimetre, not a metre.' },
      2: { ru: 'Шестьдесят это про время, а не про длину.', uz: "Oltmish bu vaqt haqida, uzunlik haqida emas.", en: 'Sixty is about time, not about length.' },
      3: { ru: 'Тысяча сантиметров это уже десять метров.', uz: "Ming santimetr bu allaqachon o'n metr.", en: 'A thousand centimetres is already ten metres.' }
    },
    on_correct: { ru: 'Верно. В метре сто сантиметров.', uz: "To'g'ri. Bir metrda yuz santimetr bor.", en: 'Right. There are a hundred centimetres in a metre.' },
    rule_lines: {
      ru: ['1 дм = 10 см', '1 м = 10 дм', '1 м = 100 см'],
      uz: ["1 dm = 10 sm", "1 m = 10 dm", "1 m = 100 sm"],
      en: ['1 dm = 10 cm', '1 m = 10 dm', '1 m = 100 cm']
    },
    rule_ex: { ru: '3 м = 300 см', uz: '3 m = 300 sm', en: '3 m = 300 cm' },
    rule_speech: { ru: 'В дециметре десять сантиметров, в метре десять дециметров, а значит сто сантиметров. Длину считают десятками, в отличие от времени.', uz: "Detsimetrda o'n santimetr, metrda o'n detsimetr, demak yuz santimetr bor. Uzunlik vaqtdan farqli o'laroq o'nlab sanaladi.", en: 'There are ten centimetres in a decimetre and ten decimetres in a metre, which means a hundred centimetres. Length is counted in tens, unlike time.' },
    audio: {
      intro: { ru: 'Соберём правило. Три мерки длины связаны между собой.', uz: "Qoidani yig'amiz. Uzunlikning uch o'lchovi o'zaro bog'liq.", en: 'Let us gather the rule. The three measures of length are linked to each other.' }
    }
  },

  s4: {
    eyebrow: { ru: 'Чертёж', uz: 'Chizma', en: 'The drawing' },
    q: { ru: 'На линейке отмечено 30 см. Сколько это дециметров?', uz: "Chizg'ichda 30 sm belgilangan. Bu necha detsimetr?", en: '30 cm is marked on the ruler. How many decimetres is that?' },
    fig_w: 3,
    fig_h: 1,
    opts: [
      { ru: '3 дм', uz: '3 dm', en: '3 dm' },
      { ru: '30 дм', uz: '30 dm', en: '30 dm' },
      { ru: '300 дм', uz: '300 dm', en: '300 dm' },
      { ru: '1 дм', uz: '1 dm', en: '1 dm' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Тридцать дециметров это целых три метра.', uz: "O'ttiz detsimetr bu butun uch metr.", en: 'Thirty decimetres is a whole three metres.' },
      2: { ru: 'Триста дециметров это тридцать метров, слишком много.', uz: "Uch yuz detsimetr bu o'ttiz metr, juda ko'p.", en: 'Three hundred decimetres is thirty metres, far too much.' },
      3: { ru: 'Один дециметр это всего десять сантиметров.', uz: "Bir detsimetr bu atigi o'n santimetr.", en: 'One decimetre is only ten centimetres.' }
    },
    audio: {
      intro: { ru: 'Посмотри на линейку. Отмечено тридцать сантиметров. Сколько это дециметров?', uz: "Chizg'ichga qarang. O'ttiz santimetr belgilangan. Bu necha detsimetr?", en: 'Look at the ruler. Thirty centimetres are marked. How many decimetres is that?' },
      on_correct: { ru: 'Верно. Три раза по десять сантиметров.', uz: "To'g'ri. O'n santimetrdan uch marta.", en: 'Right. Three times ten centimetres.' },
      on_wrong: { ru: 'Раздели сантиметры на десять.', uz: "Santimetrlarni o'nga bo'ling.", en: 'Divide the centimetres by ten.' }
    }
  },

  s5: {
    eyebrow: { ru: 'Сортировка', uz: 'Saralash', en: 'Sorting' },
    lead: { ru: 'Разложи предметы по меркам', uz: "Narsalarni o'lchovlarga ajrating", en: 'Sort the objects by measure' },
    bin_a: { ru: 'сантиметры', uz: 'santimetr', en: 'centimetres' },
    bin_b: { ru: 'метры', uz: 'metr', en: 'metres' },
    items: [
      { n: { ru: 'ластик', uz: "o'chirg'ich", en: 'a rubber' }, a: true, hint: { ru: 'Ластик короткий, счёт на сантиметры.', uz: "O'chirg'ich kalta, hisob santimetrda.", en: 'A rubber is short, the count goes in centimetres.' } },
      { n: { ru: 'дверь', uz: 'eshik', en: 'a door' }, a: false, hint: { ru: 'Высоту двери называют в метрах.', uz: "Eshik balandligi metrda aytiladi.", en: 'The height of a door is given in metres.' } },
      { n: { ru: 'карандаш', uz: 'qalam', en: 'a pencil' }, a: true, hint: { ru: 'Карандаш меряют сантиметрами.', uz: "Qalam santimetr bilan o'lchanadi.", en: 'A pencil is measured in centimetres.' } },
      { n: { ru: 'класс', uz: 'sinf xonasi', en: 'a classroom' }, a: false, hint: { ru: 'Комнату меряют метрами.', uz: "Xona metr bilan o'lchanadi.", en: 'A room is measured in metres.' } }
    ],
    audio: {
      intro: { ru: 'Четыре предмета. Отправь каждый к своей мерке.', uz: "To'rtta narsa. Har birini o'z o'lchoviga yuboring.", en: 'Four objects. Send each one to its measure.' },
      on_correct: { ru: 'Всё на месте. Мелкое меряют сантиметрами, крупное метрами.', uz: "Hammasi joyida. Mayda narsa santimetrda, yirigi metrda o'lchanadi.", en: 'All in place. Small things are measured in centimetres, big ones in metres.' },
      on_wrong: { ru: 'Прикинь, поместится ли это на парте.', uz: "Bu partaga sig'adimi, chamalab ko'ring.", en: 'Think whether it would fit on your desk.' }
    }
  },

  s6: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv', en: 'Checking' },
    q: { ru: 'Сколько сантиметров в 4 дм?', uz: '4 dm da necha santimetr bor?', en: 'How many centimetres are in 4 dm?' },
    opts: [
      { ru: '40', uz: '40', en: '40' },
      { ru: '4', uz: '4', en: '4' },
      { ru: '400', uz: '400', en: '400' },
      { ru: '14', uz: '14', en: '14' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Четыре сантиметра это меньше половины дециметра.', uz: "To'rt santimetr bu detsimetrning yarmidan kam.", en: 'Four centimetres is less than half a decimetre.' },
      2: { ru: 'Четыреста сантиметров это четыре метра.', uz: "To'rt yuz santimetr bu to'rt metr.", en: 'Four hundred centimetres is four metres.' },
      3: { ru: 'Числа не приписывают друг к другу, их умножают.', uz: "Sonlar yonma-yon yozilmaydi, ko'paytiriladi.", en: 'The numbers are not written next to each other, they are multiplied.' }
    },
    audio: {
      intro: { ru: 'Быстрый вопрос. Сколько сантиметров в четырёх дециметрах?', uz: "Tez savol. To'rt detsimetrda necha santimetr bor?", en: 'A quick question. How many centimetres are in four decimetres?' },
      on_correct: { ru: 'Верно, четыре раза по десять.', uz: "To'g'ri, o'ntadan to'rt marta.", en: 'Right, four times ten.' },
      on_wrong: { ru: 'В дециметре десять сантиметров.', uz: "Detsimetrda o'n santimetr bor.", en: 'There are ten centimetres in a decimetre.' }
    }
  },

  s7: {
    eyebrow: { ru: 'Консоль', uz: 'Konsol', en: 'Console' },
    lead: { ru: 'Доска 2 м 30 см', uz: 'Taxta 2 m 30 sm', en: 'A board is 2 m 30 cm' },
    swap_line: { ru: 'доска 2 м 30 см', uz: 'taxta 2 m 30 sm', en: 'the board is 2 m 30 cm' },
    cells: [
      { head: { ru: 'метры в см', uz: 'metrlar sm da', en: 'metres in cm' }, label: { ru: '2 м', uz: '2 m', en: '2 m' }, ans: 200, hint: { ru: 'В метре сто сантиметров.', uz: "Bir metrda yuz santimetr bor.", en: 'There are a hundred centimetres in a metre.' } },
      { head: { ru: 'ещё сантиметров', uz: 'yana santimetr', en: 'centimetres more' }, label: { ru: 'см', uz: 'sm', en: 'cm' }, ans: 30, hint: { ru: 'Это число дано в условии.', uz: 'Bu son shartda berilgan.', en: 'That number is given in the problem.' } },
      { head: { ru: 'всего', uz: 'jami', en: 'in all' }, label: '200 + 30', ans: 230, hint: { ru: 'Сложи обе части в одной мерке.', uz: "Ikkala qismni bitta o'lchovda qo'shing.", en: 'Add both parts in one measure.' } }
    ],
    check: { ru: '2 м 30 см = 230 см', uz: '2 m 30 sm = 230 sm', en: '2 m 30 cm = 230 cm' },
    check_label: { ru: 'одна мерка', uz: "bitta o'lchov", en: 'one measure' },
    audio: {
      intro: { ru: 'Заполни три окна. Метры в сантиметрах, остаток и вся длина.', uz: "Uchta oynani to'ldiring. Metrlar santimetrda, qoldiq va butun uzunlik.", en: 'Fill three windows. The metres in centimetres, the rest and the whole length.' },
      on_correct: { ru: 'Двести сантиметров и ещё тридцать, всего двести тридцать.', uz: "Ikki yuz santimetr va yana o'ttiz, jami ikki yuz o'ttiz.", en: 'Two hundred centimetres and thirty more, two hundred and thirty in all.' }
    }
  },

  s8: {
    eyebrow: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    q: { ru: 'Записали: 1 м + 20 см = 21 см. Где ошибка?', uz: "1 m + 20 sm = 21 sm deb yozilibdi. Xato qayerda?", en: 'They wrote: 1 m + 20 cm = 21 cm. Where is the mistake?' },
    fig_line: { ru: '1 м + 20 см', uz: '1 m + 20 sm', en: '1 m + 20 cm' },
    opts: [
      { ru: 'метр взяли за 1 см', uz: 'metr 1 sm deb olingan', en: 'the metre was taken as 1 cm' },
      { ru: 'ошибки нет', uz: "xato yo'q", en: 'there is no mistake' },
      { ru: 'неверно сложили', uz: "noto'g'ri qo'shilgan", en: 'the adding was wrong' },
      { ru: 'перепутали дм и см', uz: 'dm va sm chalkashtirilgan', en: 'dm and cm were mixed up' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Метр это сто сантиметров, значит выйдет сто двадцать.', uz: "Metr bu yuz santimetr, demak yuz yigirma chiqadi.", en: 'A metre is a hundred centimetres, so it comes out as a hundred and twenty.' },
      2: { ru: 'Сложение верное, подвела мерка метра.', uz: "Qo'shish to'g'ri, metr o'lchovi aldadi.", en: 'The adding is right, it is the measure of the metre that let it down.' },
      3: { ru: 'Дециметры тут вообще не участвуют.', uz: "Detsimetr bu yerda umuman qatnashmaydi.", en: 'Decimetres do not come into it at all here.' }
    },
    audio: {
      intro: { ru: 'Кто-то сложил метр и сантиметры как обычные числа. Найди ошибку.', uz: "Kimdir metr va santimetrni oddiy son kabi qo'shibdi. Xatoni toping.", en: 'Someone added a metre and centimetres like ordinary numbers. Find the mistake.' },
      on_correct: { ru: 'Верно. Сначала приводят к одной мерке. Метр это сто сантиметров.', uz: "To'g'ri. Avval bitta o'lchovga keltiriladi. Metr bu yuz santimetr.", en: 'Right. First they are brought to one measure. A metre is a hundred centimetres.' },
      on_wrong: { ru: 'Посмотри на мерки рядом с числами.', uz: "Sonlar yonidagi o'lchovlarga qarang.", en: 'Look at the measures next to the numbers.' }
    }
  },

  s9: {
    eyebrow: { ru: 'Ловушка Бита', uz: "Bit tuzog'i", en: "Bit's trap" },
    lead: { ru: 'Бит выбирает верёвку', uz: 'Bit arqon tanlayapti', en: 'Bit is choosing a rope' },
    lines: ['первая 90 см, вторая 1 м', 'Бит: беру первую, девяносто больше единицы'],
    lines_uz: ["birinchisi 90 sm, ikkinchisi 1 m", "Bit: birinchisini olaman, to'qson birdan katta"],
    lines_en: ['the first 90 cm, the second 1 m', 'Bit: I take the first, ninety is more than one'],
    line_cap: { ru: 'Бит: сравниваю числа', uz: 'Bit: sonlarni solishtiraman', en: 'Bit: I compare the numbers' },
    trap_label: { ru: 'Так ли это?', uz: 'Shundaymi?', en: 'Is that so?' },
    trap_opts: { ru: ['нет, сначала одна мерка', 'да, девяносто больше'], uz: ["yo'q, avval bitta o'lchov", "ha, to'qson kattaroq"], en: ['no, one measure first', 'yes, ninety is more'] },
    trap_ci: 0,
    trap_correct: { ru: 'Да. Пока мерки разные, числа сравнивать нельзя. Один метр это сто сантиметров, а сто больше девяноста, значит вторая верёвка длиннее.', uz: "Ha. O'lchovlar har xil ekan, sonlarni solishtirib bo'lmaydi. Bir metr bu yuz santimetr, yuz esa to'qsondan katta, demak ikkinchi arqon uzunroq.", en: 'Yes. While the measures are different, the numbers cannot be compared. One metre is a hundred centimetres, and a hundred is more than ninety, so the second rope is longer.' },
    trap_wrong: { ru: 'Переведи метр в сантиметры и сравни снова.', uz: "Metrni santimetrga o'tkazib, qaytadan solishtiring.", en: 'Turn the metre into centimetres and compare again.' },
    audio: {
      ru: [
        'Бит выбирает верёвку подлиннее.',
        'Первая девяносто сантиметров, вторая один метр. Девяносто больше единицы, беру первую.',
        'Так ли это?'
      ],
      uz: [
        "Bit uzunroq arqon tanlayapti.",
        "Birinchisi to'qson santimetr, ikkinchisi bir metr. To'qson birdan katta, birinchisini olaman.",
        "Shundaymi?"
      ],
      en: ['Bit is choosing the longer rope.', 'The first is ninety centimetres, the second one metre. Ninety is more than one, I take the first.', 'Is that so?']
    }
  },

  s10: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq', en: 'Trainer' },
    q: { ru: 'Сколько сантиметров в 5 м?', uz: '5 m da necha santimetr bor?', en: 'How many centimetres are in 5 m?' },
    ans: 500,
    check: '5 · 100',
    check_label: { ru: 'метры в сантиметры', uz: 'metrdan santimetrga', en: 'metres into centimetres' },
    hint: { ru: 'Умножь пять на сто.', uz: "Beshni yuzga ko'paytiring.", en: 'Multiply five by a hundred.' },
    audio: {
      intro: { ru: 'Теперь считай сам. Сколько сантиметров в пяти метрах?', uz: "Endi o'zingiz hisoblang. Besh metrda necha santimetr bor?", en: 'Now count on your own. How many centimetres are in five metres?' },
      on_correct: { ru: 'Пятьсот сантиметров.', uz: "Besh yuz santimetr.", en: 'Five hundred centimetres.' }
    }
  },

  s11: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq', en: 'Trainer' },
    q: { ru: 'Лента 80 см, отрезали 25 см. Сколько сантиметров осталось?', uz: "Lenta 80 sm, 25 sm kesib olindi. Necha santimetr qoldi?", en: 'A ribbon is 80 cm, 25 cm was cut off. How many centimetres are left?' },
    ans: 55,
    check: '80 − 25',
    check_label: { ru: 'мерка одна', uz: "o'lchov bitta", en: 'one measure' },
    hint: { ru: 'Из восьмидесяти вычти двадцать пять.', uz: "Sakson santimetrdan yigirma beshni ayiring.", en: 'Take twenty five away from eighty.' },
    audio: {
      intro: { ru: 'Лента восемьдесят сантиметров, отрезали двадцать пять. Сколько осталось?', uz: "Lenta sakson santimetr, yigirma besh kesib olindi. Qancha qoldi?", en: 'A ribbon is eighty centimetres, twenty five was cut off. How much is left?' },
      on_correct: { ru: 'Пятьдесят пять сантиметров.', uz: "Ellik besh santimetr.", en: 'Fifty five centimetres.' }
    }
  },

  s12: {
    eyebrow: { ru: 'Задача', uz: 'Masala', en: 'Word problem' },
    lead: { ru: 'Кристальная мачта', uz: 'Kristall machta', en: 'The crystal mast' },
    q: { ru: 'Мачта 3 м, нарастили 40 см. Сколько сантиметров стало и сколько это дециметров?', uz: "Machta 3 m, 40 sm uzaytirildi. Necha santimetr bo'ldi va bu necha detsimetr?", en: 'A mast is 3 m, 40 cm was added. How many centimetres is it now and how many decimetres is that?' },
    q_speech: { ru: 'мачта три метра, нарастили сорок сантиметров. Сколько сантиметров стало и сколько это дециметров?', uz: "machta uch metr, qirq santimetr uzaytirildi. Necha santimetr bo'ldi va bu necha detsimetr?", en: 'a mast is three metres, forty centimetres was added. How many centimetres is it now and how many decimetres is that?' },
    tbl_heads: [
      { ru: 'было', uz: 'bor edi', en: 'there was' },
      { ru: 'нарастили', uz: 'uzaytirildi', en: 'added' },
      { ru: 'вопрос', uz: 'savol', en: 'question' }
    ],
    tbl_cells: [{ ru: '3 м', uz: '3 m', en: '3 m' }, { ru: '40 см', uz: '40 sm', en: '40 cm' }, '?'],
    pick_label: { ru: 'С какого действия начинаем?', uz: 'Qaysi amaldan boshlaymiz?', en: 'Which operation do we start with?' },
    opts: [
      { ru: 'перевести метры в см', uz: 'metrni sm ga o\'tkazish', en: 'turn the metres into cm' },
      { ru: 'сложить 3 и 40', uz: "3 va 40 ni qo'shish", en: 'add 3 and 40' },
      { ru: 'умножить 40 на 3', uz: "40 ni 3 ga ko'paytirish", en: 'multiply 40 by 3' },
      { ru: 'разделить 40 на 10', uz: "40 ni 10 ga bo'lish", en: 'divide 40 by 10' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Метры и сантиметры складывать напрямую нельзя.', uz: "Metr va santimetrni to'g'ridan-to'g'ri qo'shib bo'lmaydi.", en: 'Metres and centimetres cannot be added directly.' },
      2: { ru: 'Умножать тут нечего, длину нарастили один раз.', uz: "Bu yerda ko'paytiradigan narsa yo'q, uzunlik bir marta oshgan.", en: 'There is nothing to multiply here, the length was added to once.' },
      3: { ru: 'Деление понадобится позже, для дециметров.', uz: "Bo'lish keyinroq, detsimetr uchun kerak bo'ladi.", en: 'Dividing will be needed later, for the decimetres.' }
    },
    pick_ok: { ru: 'Верно. Сначала одна мерка, потом ответ.', uz: "To'g'ri. Avval bitta o'lchov, keyin javob.", en: 'Right. First one measure, then the answer.' },
    step1_q: { ru: 'Сколько сантиметров стала мачта?', uz: 'Machta necha santimetr bo\'ldi?', en: 'How many centimetres is the mast now?' },
    ans1: 340,
    hint1: { ru: 'Три метра это триста сантиметров, прибавь сорок.', uz: "Uch metr bu uch yuz santimetr, qirqni qo'shing.", en: 'Three metres is three hundred centimetres, add forty.' },
    step2_q: { ru: 'Сколько это дециметров?', uz: 'Bu necha detsimetr?', en: 'How many decimetres is that?' },
    ans2: 34,
    hint2: { ru: 'Раздели сантиметры на десять.', uz: "Santimetrlarni o'nga bo'ling.", en: 'Divide the centimetres by ten.' },
    check: { ru: '340 см = 34 дм', uz: '340 sm = 34 dm', en: '340 cm = 34 dm' },
    setup_audio: { ru: 'Мачту наращивают. Посмотри на таблицу и реши, с чего начать.', uz: "Machta uzaytirilyapti. Jadvalga qarang va nimadan boshlashni hal qiling.", en: 'The mast is being made longer. Look at the table and decide where to start.' },
    audio: {
      intro: { ru: 'Мачта три метра, нарастили сорок сантиметров. Сколько сантиметров стало и сколько дециметров?', uz: "Machta uch metr, qirq santimetr uzaytirildi. Necha santimetr bo'ldi va necha detsimetr?", en: 'A mast is three metres, forty centimetres was added. How many centimetres is it now and how many decimetres?' },
      on_correct: { ru: 'Триста сорок сантиметров, а это тридцать четыре дециметра.', uz: "Uch yuz qirq santimetr, bu esa o'ttiz to'rt detsimetr.", en: 'Three hundred and forty centimetres, and that is thirty four decimetres.' },
      on_wrong: { ru: 'Сначала приведи к сантиметрам, потом переводи в дециметры.', uz: "Avval santimetrga keltiring, keyin detsimetrga o'tkazing.", en: 'First bring it to centimetres, then turn it into decimetres.' }
    }
  },

  s13: {
    eyebrow: { ru: 'Финал', uz: 'Yakuniy', en: 'Final' },
    intro_line: { ru: 'Три задания. Сначала одна мерка', uz: "Uchta topshiriq. Avval bitta o'lchov", en: 'Three tasks. One measure first' },
    items: [
      {
        kind: 'num',
        q: { ru: 'Сколько сантиметров в 7 дм?', uz: '7 dm da necha santimetr bor?', en: 'How many centimetres are in 7 dm?' },
        q_speech: { ru: 'сколько сантиметров в семи дециметрах?', uz: 'yetti detsimetrda necha santimetr bor?', en: 'how many centimetres are in seven decimetres?' },
        ans: 70,
        hint: { ru: 'В дециметре десять сантиметров.', uz: "Detsimetrda o'n santimetr bor.", en: 'There are ten centimetres in a decimetre.' }
      },
      {
        kind: 'num',
        q: { ru: 'Сколько сантиметров в 2 м 15 см?', uz: '2 m 15 sm da necha santimetr bor?', en: 'How many centimetres are in 2 m 15 cm?' },
        q_speech: { ru: 'сколько сантиметров в двух метрах пятнадцати сантиметрах?', uz: 'ikki metr o\'n besh santimetrda necha santimetr bor?', en: 'how many centimetres are in two metres fifteen centimetres?' },
        ans: 215,
        hint: { ru: 'Двести и ещё пятнадцать.', uz: "Ikki yuz va yana o'n besh.", en: 'Two hundred, and fifteen more.' }
      },
      {
        kind: 'num',
        q: { ru: 'Сколько дециметров в 90 см?', uz: '90 sm da necha detsimetr bor?', en: 'How many decimetres are in 90 cm?' },
        q_speech: { ru: 'сколько дециметров в девяноста сантиметрах?', uz: 'to\'qson santimetrda necha detsimetr bor?', en: 'how many decimetres are in ninety centimetres?' },
        ans: 9,
        hint: { ru: 'Раздели девяносто на десять.', uz: "To'qsonni o'nga bo'ling.", en: 'Divide ninety by ten.' }
      }
    ],
    fact_badge: { ru: 'Знаешь ли ты?', uz: 'Bilasizmi?', en: 'Which line is wrong?' },
    fact_text: {
      ru: 'Метр не придумали наугад. Учёные взяли расстояние от Северного полюса до экватора и разделили его на десять миллионов частей. Одна такая часть и стала метром, чтобы мерка была одинаковой для всех стран.',
      uz: "Metr shunchaki o'ylab topilmagan. Olimlar Shimoliy qutbdan ekvatorgacha bo'lgan masofani o'n million qismga bo'lishgan. Ana shu bitta qism metr bo'lgan, o'lchov hamma davlat uchun bir xil bo'lsin deb.",
      en: 'The metre was not invented at random. Scientists took the distance from the North Pole to the equator and divided it into ten million parts. One such part became the metre, so that the measure would be the same for every country.'
    },
    fact_audio: {
      ru: 'Вот откуда взялся метр. Раньше в каждой стране мерили по-своему, локтями и шагами, и торговать было неудобно. Тогда учёные решили взять мерку у самой Земли. Они измерили расстояние от Северного полюса до экватора и разделили его на десять миллионов частей. Одна такая часть и стала метром. Позже мерку уточнили, но длина осталась той же.',
      uz: "Metr mana qayerdan olingan. Ilgari har bir davlatda o'zicha o'lchashgan, tirsak va qadam bilan, savdo qilish esa noqulay edi. Shunda olimlar o'lchovni Yerning o'zidan olishga qaror qilishdi. Ular Shimoliy qutbdan ekvatorgacha masofani o'lchab, o'n million qismga bo'lishdi. Ana shu bitta qism metr bo'ldi. Keyinchalik o'lchov aniqlashtirildi, lekin uzunlik o'sha bo'lib qoldi.",
      en: 'Here is where the metre came from. In the old days every country measured in its own way, in cubits and paces, and trading was awkward. Then scientists decided to take a measure from the Earth itself. They measured the distance from the North Pole to the equator and divided it into ten million parts. One such part became the metre. Later the measure was made more exact, but the length stayed the same.'
    },
    audio: {
      intro: { ru: 'Три задания напоследок. Помни про десятки.', uz: "Oxirida uchta topshiriq. O'nliklarni yodda tuting.", en: 'Three tasks at the end. Remember the tens.' },
      on_correct: { ru: 'Верно.', uz: "To'g'ri.", en: 'Correct.' },
      on_wrong: { ru: 'Переведи всё в одну мерку.', uz: "Hammasini bitta o'lchovga o'tkazing.", en: 'Turn everything into one measure.' }
    }
  },

  s14: {
    eyebrow: { ru: 'Итог', uz: 'Yakun', en: 'Result' },
    mission_done: { ru: 'Мерки длины собраны!', uz: "Uzunlik o'lchovlari yig'ildi!", en: 'The measures of length are gathered!' },
    cando: {
      ru: ['перевожу метры в сантиметры', 'сравниваю длины в одной мерке', 'не путаю дециметр с метром'],
      uz: ["metrni santimetrga o'tkazaman", "uzunliklarni bitta o'lchovda solishtiraman", "detsimetrni metr bilan chalkashtirmayman"],
      en: ['I turn metres into centimetres', 'I compare lengths in one measure', 'I do not mix up the decimetre and the metre']
    },
    rule_recap: { ru: 'В дециметре 10 сантиметров, в метре 10 дециметров и 100 сантиметров.', uz: "Detsimetrda 10 santimetr, metrda 10 detsimetr va 100 santimetr bor.", en: 'There are 10 centimetres in a decimetre, and 10 decimetres and 100 centimetres in a metre.' },
    conn_label_refs: { ru: 'опирается на', uz: 'nimaga tayanadi', en: 'builds on' },
    conn_refs: { ru: 'урок 42: перевод мерок; урок 10: умножение на 100', uz: "42-dars: o'lchov o'tkazish; 10-dars: 100 ga ko'paytirish", en: 'lesson 42: converting measures; lesson 10: multiplying by 100' },
    conn_label_next: { ru: 'дальше', uz: 'keyin', en: 'next' },
    conn_next: { ru: 'календарь: сутки, неделя, месяц и год', uz: 'kalendar: sutka, hafta, oy va yil', en: 'the calendar: the day, the week, the month and the year' },
    audio: {
      ru: 'Мерки длины собраны. Запомни главное. В дециметре десять сантиметров, в метре десять дециметров, а всего в метре сто сантиметров. Длину, в отличие от времени, считают десятками, и это удобно. И повтори за мной самое важное. Пока мерки разные, числа сравнивать нельзя. Девяносто сантиметров меньше одного метра, хотя девяносто больше единицы. В следующий раз возьмём мерки покрупнее и заглянем в календарь!',
      uz: "Uzunlik o'lchovlari yig'ildi. Asosiysini eslab qoling. Detsimetrda o'n santimetr, metrda o'n detsimetr, jami metrda esa yuz santimetr bor. Uzunlik vaqtdan farqli o'laroq o'nlab sanaladi va bu qulay. Eng muhimini takrorlang. O'lchovlar har xil ekan, sonlarni solishtirib bo'lmaydi. To'qson santimetr bir metrdan kam, garchi to'qson birdan katta bo'lsa ham. Keyingi safar yiriroq o'lchovlarni olib, kalendarga qaraymiz!",
      en: 'The measures of length are gathered. Remember the main thing. There are ten centimetres in a decimetre, ten decimetres in a metre, and a hundred centimetres in a metre in all. Length, unlike time, is counted in tens, and that is convenient. And repeat the most important thing after me. While the measures are different, the numbers cannot be compared. Ninety centimetres is less than one metre, although ninety is more than one. Next time we will take bigger measures and look into the calendar!'
    }
  }
};

const BRIDGES = {
  s1:  { ru: 'Посмотрим на линейку.', uz: "Chizg'ichga qaraymiz.", en: 'Let us look at the ruler.' },
  s2:  { ru: 'Теперь мерка побольше.', uz: "Endi kattaroq o'lchov.", en: 'Now a bigger measure.' },
  s3:  { ru: "Соберём это в правило.", uz: "Buni qoidaga yig'amiz.", en: 'Let us gather this into a rule.' },
  s4:  { ru: 'Прочитай линейку.', uz: "Chizg'ichni o'qing.", en: 'Read the ruler.' },
  s5:  { ru: 'Разложи предметы.', uz: 'Narsalarni ajrating.', en: 'Sort the objects.' },
  s6:  { ru: 'Быстрый вопрос.', uz: 'Tez savol.', en: 'A quick question.' },
  s7:  { ru: 'Заполни консоль.', uz: "Konsolni to'ldiring.", en: 'Fill the console.' },
  s8:  { ru: 'Тут сложили разные мерки.', uz: "Bu yerda har xil o'lchov qo'shilibdi.", en: 'Here different measures were added.' },
  s9:  { ru: 'А вот и Бит со своим выбором.', uz: "Mana Bit ham o'z tanlovi bilan.", en: 'And here is Bit with his choice.' },
  s10: { ru: 'Теперь считай сам.', uz: "Endi o'zingiz hisoblang.", en: 'Now count on your own.' },
  s11: { ru: 'И ещё одна лента.', uz: 'Yana bitta lenta.', en: 'And one more ribbon.' },
  s12: { ru: 'Задача от строителей.', uz: 'Quruvchilardan masala.', en: 'A task from the builders.' },
  s13: { ru: 'Финальная проверка.', uz: 'Yakuniy tekshiruv.', en: 'The final check.' },
  s14: { ru: 'Подведём итог.', uz: 'Yakun yasaymiz.', en: 'Let us sum up.' }
};

const S14_PAYOFF = {
  ru: 'Мерки собраны. Сантиметр, дециметр и метр встали в один ряд.',
  uz: "O'lchovlar yig'ildi. Santimetr, detsimetr va metr bir qatorga tizildi.",
  en: 'The measures are gathered. The centimetre, the decimetre and the metre lined up in one row.'
};

// --- SAHNA TUGUNI (D44): 1-DARSNING shahri, ustiga o'lchov chizg'ichi.
const RulerNodeLayer = () => (
  <svg className="lm-scene-bg" viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <g transform="translate(84 128)">
      <rect x="0" y="0" width="232" height="30" rx="4" fill="#FDF6E8" stroke="#8A7550" strokeWidth="2"/>
      {Array.from({ length: 21 }).map((_, i) => (
        <line key={i} x1={8 + i * 11} y1="0" x2={8 + i * 11} y2={i % 10 === 0 ? 18 : i % 5 === 0 ? 12 : 7} stroke="#8A7550" strokeWidth={i % 10 === 0 ? 2 : 1}/>
      ))}
      <text x="8" y="27" fontSize="7" fill="#5A4A2E" fontFamily="'JetBrains Mono', monospace">0</text>
      <text x="112" y="27" fontSize="7" fill="#5A4A2E" fontFamily="'JetBrains Mono', monospace">10</text>
      <text x="216" y="27" fontSize="7" fill="#5A4A2E" fontFamily="'JetBrains Mono', monospace">20</text>
      <rect x="8" y="-8" width="110" height="6" rx="3" fill="#FFD98A" stroke="#C06A2E" strokeWidth="1.2"/>
      <text x="63" y="-12" textAnchor="middle" fontSize="7" fill="#8A5A2E" fontFamily="'JetBrains Mono', monospace">1 dm</text>
      <text x="116" y="46" textAnchor="middle" fontSize="8" letterSpacing="1.2" fill="#3F5A6B" fontFamily="'JetBrains Mono', monospace">1 m = 100 sm</text>
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
      <RulerNodeLayer/>
      <div className="lm-scene-cast">
        {LUMO_CAST.slice(0, 2).map(kid)}
        <span className={`lm-crew lm-crew-host ${gathered ? 'd2-bit-cheer' : 'lm-bob'}`}><span className="g1-cast-fig"><BitSVG state={gathered ? 'happy' : 'present'}/></span></span>
        {LUMO_CAST.slice(2).map((c, i) => kid(c, i + 2))}
      </div>
    </div>
  );
};

// --- EKRAN CHIZMASI (s4): chizg'ichda 30 sm belgilangan.
const RulerFig = () => (
  <svg viewBox="0 0 260 90" style={{ width: 'min(280px, 88%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <rect x="10" y="26" width="240" height="34" rx="4" fill="#FDF6E8" stroke="#8A7550" strokeWidth="2"/>
    {Array.from({ length: 31 }).map((_, i) => (
      <line key={i} x1={18 + i * 7.6} y1="26" x2={18 + i * 7.6} y2={i % 10 === 0 ? 48 : i % 5 === 0 ? 40 : 34} stroke="#8A7550" strokeWidth={i % 10 === 0 ? 2 : 1}/>
    ))}
    {[0, 10, 20, 30].map((n, i) => (
      <text key={n} x={18 + i * 76} y="58" textAnchor="middle" fontSize="8" fill="#5A4A2E" fontFamily="'JetBrains Mono', monospace">{n}</text>
    ))}
    <rect x="18" y="16" width="228" height="6" rx="3" fill="#FFD98A" stroke="#C06A2E" strokeWidth="1.4"/>
    <text x="132" y="12" textAnchor="middle" fontSize="9" fontWeight="800" fill="#C06A2E" fontFamily="'JetBrains Mono', monospace">30 sm</text>
    <text x="132" y="80" textAnchor="middle" fontSize="10" fontWeight="800" fill="#8A7550" fontFamily="'JetBrains Mono', monospace">? dm</text>
  </svg>
);

// --- FACTCARD QAHRAMONI: Yer va qutbdan ekvatorgacha yoy.
const EarthMeterFig = () => {
  const lang = useLang();
  return (
  <svg viewBox="0 0 220 104" style={{ width: 'min(266px, 84%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <circle cx="86" cy="52" r="40" fill="#DCEBF5" stroke="#2E7E9E" strokeWidth="2"/>
    <path d="M86 12 A40 40 0 0 1 126 52" fill="none" stroke="#C06A2E" strokeWidth="3.4" strokeLinecap="round"/>
    <line x1="46" y1="52" x2="126" y2="52" stroke="#2E7E9E" strokeWidth="1.6" strokeDasharray="4 3"/>
    <circle cx="86" cy="12" r="3.4" fill="#C06A2E"/>
    <circle cx="126" cy="52" r="3.4" fill="#C06A2E"/>
    <text x="86" y="102" textAnchor="middle" fontSize="8" fill="#3F5A6B" fontFamily="'JetBrains Mono', monospace">{tri(lang, 'полюс и экватор', 'qutb va ekvator', 'the pole and the equator')}</text>
    <g transform="translate(158 40)">
      <rect x="0" y="0" width="52" height="14" rx="3" fill="#FDF6E8" stroke="#8A7550" strokeWidth="1.6"/>
      {Array.from({ length: 6 }).map((_, i) => <line key={i} x1={6 + i * 8} y1="0" x2={6 + i * 8} y2="7" stroke="#8A7550" strokeWidth="1"/>)}
      <text x="26" y="28" textAnchor="middle" fontSize="9" fontWeight="800" fill="#C06A2E" fontFamily="'JetBrains Mono', monospace">1 m</text>
    </g>
  </svg>
  );
};

export default createLesson({
  TOTAL_SCREENS, LESSON_META, SCREEN_META, CONTENT, BRIDGES, S14_PAYOFF,
  STYLES: LESSON_STYLES,
  Scene: LessonScene,
  FactFig: EarthMeterFig,
  figs: { s4: <RulerFig/> }
});
