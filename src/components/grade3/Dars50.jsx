import React from 'react';
import { BitSVG, LUMO_CAST, LumoCityBg, createLesson, useLang, tri } from './_kit/index.jsx';
import { LESSON_STYLES } from './_kit/styles.js';

// ============================================================================
// DD 3-SINF | Dars50 — "Doiraviy diagramma va ma'lumot" (num-3-50) | Б6 «O'LCHOVLAR»
// Syujet: Lumo shahri (reja 55-satr). SAHNA: 1-DARSNING shahri, tugun — doiraviy diagramma.
// DARSLIK ASOSI (Burxonov, 3-sinf, «Sharq» 2019, 171-bet).
// YADRO: doiraviy diagramma BITTA BUTUNNING qismlarini ko'rsatadi. Butun aylana — hammasi;
//   kattaroq sektor — kattaroq qism. Qismlar yig'indisi butunga teng.
// Misconception: M1 har xil diagramma sektorlarini butunini hisobga olmay solishtirish;
//   M2 ulushni son deb o'qish («yarim demak ellik»); M3 belgilarni tasodifan o'qish;
//   M4 qismlar yig'indisi butundan katta chiqishi.
// FactCard: Florens Naytingeyl diagramma bilan kasalxonadagi o'limlar sababini ko'rsatib,
//   islohotga erishgan — rasm sonlar ro'yxatidan kuchliroq bo'lgan.
// Bu dars MA'LUMOT fayli: ekranlar va mexanika kitda (`createLesson`).
// ============================================================================
const TOTAL_SCREENS = 15;
const LESSON_META = {
  lessonId: 'grade3-50',
  lessonTitle: { ru: 'Урок 50. Круговые диаграммы и данные', uz: "50-dars. Doiraviy diagramma va ma'lumot", en: 'Lesson 50. Pie charts and data' }
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
    topic: { ru: 'Круговая диаграмма', uz: 'Doiraviy diagramma', en: 'The pie chart' },
    lead: { ru: 'Круг разделён на части цветом', uz: 'Doira rang bilan qismlarga bo\'lingan', en: 'A circle divided into parts by colour' },
    order_cap: { ru: 'один круг — все кристаллы склада', uz: 'bitta doira — ombordagi hamma kristall', en: 'one circle — all the crystals of the store' },
    plate: ['12', '◔', '?'],
    q: { ru: 'Что показывает весь круг целиком?', uz: 'Butun doira nimani ko\'rsatadi?', en: 'What does the whole circle show?' },
    opt0: { ru: 'все кристаллы вместе', uz: 'hamma kristall birga', en: 'all the crystals together' },
    opt1: { ru: 'самую большую часть', uz: 'eng katta qismni', en: 'the biggest part' },
    opt2: { ru: 'число цветов', uz: 'ranglar sonini', en: 'the number of colours' },
    opt3: { ru: 'ничего не показывает', uz: 'hech nimani', en: 'it shows nothing' },
    audio: {
      intro: {
        ru: [
          'Записи мы проверять научились. Теперь научимся читать картинку с данными.',
          'На стене круг, разделённый на цветные части. Это диаграмма склада.',
          'Каждый цвет это свой вид кристаллов, а весь круг что-то значит целиком.',
          'Как думаешь, что показывает круг целиком?'
        ],
        uz: [
          "Yozuvlarni tekshirishni o'rgandik. Endi ma'lumotli rasmni o'qishni o'rganamiz.",
          "Devorda rangli qismlarga bo'lingan doira bor. Bu ombor diagrammasi.",
          "Har bir rang o'z kristall turi, butun doira esa umuman biror narsani anglatadi.",
          "Sizningcha, butun doira nimani ko'rsatadi?"
        ],
        en: ['We have learned to check records. Now let us learn to read a picture with data.', 'There is a circle on the wall, divided into coloured parts. It is the chart of the store.', 'Each colour is its own kind of crystal, and the whole circle means something as a whole.', 'What do you think the whole circle shows?']
      },
      on_correct: { ru: 'Верно! Весь круг это всё вместе, а части это доли от него.', uz: "To'g'ri! Butun doira bu hammasi birga, qismlar esa undan olingan ulushlar.", en: 'Right! The whole circle is everything together, and the parts are shares of it.' },
      on_wrong1: { ru: 'Самая большая часть это только один сектор, а не весь круг.', uz: "Eng katta qism bu bitta sektor, butun doira emas.", en: 'The biggest part is only one sector, not the whole circle.' },
      on_wrong2: { ru: 'Цветов может быть сколько угодно, круг всё равно означает всё целиком.', uz: "Rang xohlagancha bo'lishi mumkin, doira baribir hammasini anglatadi.", en: 'There can be any number of colours, the circle still means the whole lot.' },
      on_idk: { ru: 'Ничего. Сейчас разберём диаграмму по частям.', uz: "Hechqisi yo'q. Hozir diagrammani qismlarga ajratamiz.", en: 'Never mind. Let us take the chart apart now.' }
    }
  },

  s1: {
    eyebrow: { ru: 'Разбор', uz: 'Tahlil', en: 'Working it out' },
    lead: { ru: 'Читаем части круга', uz: 'Doira qismlarini o\'qiymiz', en: 'We read the parts of the circle' },
    task_line: 'всего 12 кристаллов',
    task_line_uz: "jami 12 kristall",
    task_line_en: '12 crystals in all',
    step1: { ru: 'половина — 6', uz: 'yarmi — 6', en: 'a half — 6' },
    step1_cap: { ru: 'синий сектор это половина круга', uz: "ko'k sektor doiraning yarmi", en: 'the blue sector is half the circle' },
    step2: { ru: 'четверть — 3', uz: 'chorak — 3', en: 'a quarter — 3' },
    step2_cap: { ru: 'жёлтый сектор это четверть', uz: 'sariq sektor chorak', en: 'the yellow sector is a quarter' },
    res: '6 + 3 + 3 = 12',
    btn1: { ru: 'Прочитать синий', uz: "Ko'kni o'qish", en: 'Read the blue one' },
    btn2: { ru: 'Прочитать жёлтый', uz: "Sariqni o'qish", en: 'Read the yellow one' },
    done_text: { ru: 'Части складываются ровно в целое, ни больше ни меньше.', uz: "Qismlar rosa butunga yig'iladi, ko'p ham emas, kam ham emas.", en: 'The parts add up to exactly the whole, no more and no less.' },
    audio: {
      ru: [
        'На складе всего двенадцать кристаллов, и это весь круг.',
        'Синий сектор занимает половину круга. Половина от двенадцати это шесть кристаллов.',
        'Жёлтый занимает четверть, а четверть от двенадцати это три. Остаётся ещё три на третий цвет. Шесть, три и три вместе дают ровно двенадцать, то есть целый круг.'
      ],
      uz: [
        "Omborda jami o'n ikkita kristall bor va bu butun doira.",
        "Ko'k sektor doiraning yarmini egallaydi. O'n ikkining yarmi olti kristall.",
        "Sariq chorakni egallaydi, o'n ikkining choragi esa uch. Uchinchi rangga yana uchta qoladi. Olti, uch va uch birga rosa o'n ikki beradi, ya'ni butun doira."
      ],
      en: ['The store has twelve crystals in all, and that is the whole circle.', 'The blue sector takes half the circle. Half of twelve is six crystals.', 'The yellow one takes a quarter, and a quarter of twelve is three. That leaves three more for the third colour. Six, three and three together make exactly twelve, that is the whole circle.']
    }
  },

  s2: {
    eyebrow: { ru: 'Разбор', uz: 'Tahlil', en: 'Working it out' },
    w: 4,
    h: 4,
    lead: { ru: 'Доля и число это не одно и то же', uz: 'Ulush va son bir narsa emas', en: 'A share and a number are not the same thing' },
    capA: { ru: 'половина от 12 — это 6', uz: '12 ning yarmi — 6', en: 'half of 12 is 6' },
    capB: { ru: 'половина от 20 — это 10', uz: '20 ning yarmi — 10', en: 'half of 20 is 10' },
    res: { ru: 'доля одна, числа разные', uz: 'ulush bitta, sonlar har xil', en: 'the share is one, the numbers are different' },
    btn1: { ru: 'Взять круг на 12', uz: "12 lik doirani olish", en: 'Take a circle of 12' },
    btn2: { ru: 'Взять круг на 20', uz: '20 lik doirani olish', en: 'Take a circle of 20' },
    done_text: { ru: 'Одинаковый по виду сектор даёт разные числа, если целое разное.', uz: "Ko'rinishi bir xil sektor butun har xil bo'lsa, har xil son beradi.", en: 'A sector that looks the same gives different numbers if the whole is different.' },
    audio: {
      ru: [
        'Теперь про самую частую ошибку.',
        'Возьмём круг, где всего двенадцать кристаллов. Половина это шесть.',
        'А теперь круг, где всего двадцать. Половина выглядит точно так же, но это уже десять. Значит сектор сам по себе числа не называет, его читают вместе с целым.'
      ],
      uz: [
        "Endi eng ko'p uchraydigan xato haqida.",
        "Jami o'n ikkita kristall bo'lgan doirani olamiz. Yarmi olti.",
        "Endi jami yigirmata bo'lgan doirani olamiz. Yarmi xuddi shunday ko'rinadi, lekin bu endi o'n. Demak sektor o'zi son aytmaydi, u butun bilan birga o'qiladi."
      ],
      en: ['Now about the commonest mistake.', 'Let us take a circle where there are twelve crystals in all. A half is six.', 'And now a circle where there are twenty. The half looks exactly the same, but it is already ten. So a sector on its own does not name a number, it is read together with the whole.']
    }
  },

  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    q: { ru: 'Что означает весь круг диаграммы?', uz: 'Diagrammaning butun doirasi nimani anglatadi?', en: 'What does the whole circle of a chart mean?' },
    opts: [
      { ru: 'всё целое', uz: 'butun hammasi', en: 'the whole lot' },
      { ru: 'сто штук', uz: 'yuzta dona', en: 'a hundred pieces' },
      { ru: 'самую большую часть', uz: 'eng katta qismni', en: 'the biggest part' },
      { ru: 'число секторов', uz: 'sektorlar sonini', en: 'the number of sectors' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Целое бывает любым. И двенадцать, и двадцать.', uz: "Butun har qanday bo'ladi. O'n ikki ham, yigirma ham.", en: 'The whole can be anything. Twelve or twenty.' },
      2: { ru: 'Большая часть это только один сектор.', uz: "Katta qism bu bitta sektor.", en: 'The biggest part is only one sector.' },
      3: { ru: 'Секторов может быть три, четыре, сколько угодно.', uz: "Sektor uchta, to'rtta, xohlagancha bo'lishi mumkin.", en: 'There can be three sectors, four, any number.' }
    },
    on_correct: { ru: 'Верно. Круг это целое, а секторы его части.', uz: "To'g'ri. Doira bu butun, sektorlar esa uning qismlari.", en: 'Right. The circle is the whole, and the sectors are its parts.' },
    rule_lines: {
      ru: ['круг это всё целое', 'сектор больше — часть больше', 'части в сумме дают целое'],
      uz: ["doira bu butun hammasi", "sektor katta — qism katta", "qismlar yig'indisi butunni beradi"],
      en: ['the circle is the whole lot', 'a bigger sector — a bigger part', 'the parts add up to the whole']
    },
    rule_ex: '6 + 3 + 3 = 12',
    rule_speech: { ru: 'Круговая диаграмма показывает части одного целого. Весь круг это всё вместе, а чем больше сектор, тем больше часть. Части в сумме дают ровно целое, поэтому одну и ту же долю в разных кругах читают разными числами.', uz: "Doiraviy diagramma bitta butunning qismlarini ko'rsatadi. Butun doira bu hammasi birga, sektor qanchalik katta bo'lsa, qism shunchalik katta. Qismlar yig'indisi rosa butunni beradi, shuning uchun bir xil ulush har xil doirada har xil son bilan o'qiladi.", en: 'A pie chart shows the parts of one whole. The whole circle is everything together, and the bigger the sector, the bigger the part. The parts add up to exactly the whole, so the same share in different circles is read as different numbers.' },
    audio: {
      intro: { ru: 'Соберём правило. Мы прочитали два круга.', uz: "Qoidani yig'amiz. Ikkita doirani o'qidik.", en: 'Let us gather the rule. We have read two circles.' }
    }
  },

  s4: {
    eyebrow: { ru: 'Чертёж', uz: 'Chizma', en: 'The drawing' },
    q: { ru: 'Всего 8 кристаллов, синий сектор это четверть. Сколько синих?', uz: "Jami 8 kristall, ko'k sektor chorak. Nechta ko'k bor?", en: 'There are 8 crystals in all, the blue sector is a quarter. How many blue ones?' },
    fig_w: 4,
    fig_h: 2,
    opts: [
      { ru: '2', uz: '2', en: '2' },
      { ru: '4', uz: '4', en: '4' },
      { ru: '8', uz: '8', en: '8' },
      { ru: '1', uz: '1', en: '1' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Четыре это половина, а не четверть.', uz: "To'rt bu yarim, chorak emas.", en: 'Four is a half, not a quarter.' },
      2: { ru: 'Восемь это весь круг целиком.', uz: "Sakkiz bu butun doira.", en: 'Eight is the whole circle.' },
      3: { ru: 'Один это восьмая часть, слишком мало.', uz: "Bir bu sakkizdan bir qism, juda kam.", en: 'One is an eighth part, far too little.' }
    },
    audio: {
      intro: { ru: 'Посмотри на диаграмму. Всего восемь кристаллов, синий сектор занимает четверть круга.', uz: "Diagrammaga qarang. Jami sakkizta kristall, ko'k sektor doiraning choragini egallaydi.", en: 'Look at the chart. There are eight crystals in all, and the blue sector takes a quarter of the circle.' },
      on_correct: { ru: 'Верно. Четверть от восьми это два.', uz: "To'g'ri. Sakkizning choragi ikki.", en: 'Right. A quarter of eight is two.' },
      on_wrong: { ru: 'Раздели всё целое на четыре части.', uz: "Butun hammasini to'rt qismga bo'ling.", en: 'Divide the whole into four parts.' }
    }
  },

  s5: {
    eyebrow: { ru: 'Сортировка', uz: 'Saralash', en: 'Sorting' },
    lead: { ru: 'Разложи утверждения о диаграмме', uz: 'Diagramma haqidagi tasdiqlarni ajrating', en: 'Sort the statements about the chart' },
    bin_a: { ru: 'верно', uz: 'rost', en: 'true' },
    bin_b: { ru: 'неверно', uz: "yolg'on", en: 'not true' },
    items: [
      { n: { ru: 'части дают целое', uz: 'qismlar butunni beradi', en: 'the parts give the whole' }, a: true, hint: { ru: 'Иначе круг не сошёлся бы.', uz: "Aks holda doira to'lmasdi.", en: 'Otherwise the circle would not come out right.' } },
      { n: { ru: 'половина это всегда 50', uz: 'yarim har doim 50', en: 'a half is always 50' }, a: false, hint: { ru: 'Половина зависит от целого.', uz: "Yarim butunga bog'liq.", en: 'A half depends on the whole.' } },
      { n: { ru: 'больший сектор — большая часть', uz: 'katta sektor — katta qism', en: 'a bigger sector — a bigger part' }, a: true, hint: { ru: 'Так и читают диаграмму.', uz: "Diagramma shunday o'qiladi.", en: 'That is exactly how a chart is read.' } },
      { n: { ru: 'сектор можно читать без целого', uz: 'sektorni butunsiz o\'qisa bo\'ladi', en: 'a sector can be read without the whole' }, a: false, hint: { ru: 'Без целого число не назовёшь.', uz: "Butunsiz sonni ayta olmaysiz.", en: 'Without the whole you cannot name the number.' } }
    ],
    audio: {
      intro: { ru: 'Четыре утверждения о диаграмме. Отправь каждое в свою корзину.', uz: "Diagramma haqida to'rtta tasdiq. Har birini o'z savatiga yuboring.", en: 'Four statements about the chart. Send each one to its basket.' },
      on_correct: { ru: 'Всё на месте. Сектор читают только вместе с целым.', uz: "Hammasi joyida. Sektor faqat butun bilan birga o'qiladi.", en: 'All in place. A sector is read only together with the whole.' },
      on_wrong: { ru: 'Спроси себя, хватит ли одного сектора для ответа.', uz: "O'zingizdan so'rang, javob uchun bitta sektor yetadimi.", en: 'Ask yourself whether one sector is enough for the answer.' }
    }
  },

  s6: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv', en: 'Checking' },
    q: { ru: 'Всего 20 кристаллов, красный сектор это половина. Сколько красных?', uz: "Jami 20 kristall, qizil sektor yarim. Nechta qizil bor?", en: 'There are 20 crystals in all, the red sector is a half. How many red ones?' },
    opts: [
      { ru: '10', uz: '10', en: '10' },
      { ru: '5', uz: '5', en: '5' },
      { ru: '20', uz: '20', en: '20' },
      { ru: '2', uz: '2', en: '2' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Пять это четверть от двадцати.', uz: "Besh bu yigirmaning choragi.", en: 'Five is a quarter of twenty.' },
      2: { ru: 'Двадцать это весь круг.', uz: "Yigirma bu butun doira.", en: 'Twenty is the whole circle.' },
      3: { ru: 'Два это слишком мало для половины.', uz: "Ikki yarim uchun juda kam.", en: 'Two is far too little for a half.' }
    },
    audio: {
      intro: { ru: 'Быстрый вопрос. Всего двадцать кристаллов, красный сектор это половина.', uz: "Tez savol. Jami yigirmata kristall, qizil sektor yarim.", en: 'A quick question. There are twenty crystals in all, the red sector is a half.' },
      on_correct: { ru: 'Верно. Половина от двадцати это десять.', uz: "To'g'ri. Yigirmaning yarmi o'n.", en: 'Right. Half of twenty is ten.' },
      on_wrong: { ru: 'Раздели целое пополам.', uz: "Butunni teng ikkiga bo'ling.", en: 'Divide the whole in two.' }
    }
  },

  s7: {
    eyebrow: { ru: 'Консоль', uz: 'Konsol', en: 'Console' },
    lead: { ru: 'Всего 16 кристаллов на трёх полках', uz: 'Uch javonda jami 16 kristall', en: 'There are 16 crystals in all on three shelves' },
    swap_line: { ru: 'всего 16', uz: 'jami 16', en: '16 in all' },
    cells: [
      { head: { ru: 'половина', uz: 'yarmi', en: 'a half' }, label: '16 : 2', ans: 8, hint: { ru: 'Раздели целое на две части.', uz: "Butunni ikki qismga bo'ling.", en: 'Divide the whole into two parts.' } },
      { head: { ru: 'четверть', uz: 'chorak', en: 'a quarter' }, label: '16 : 4', ans: 4, hint: { ru: 'Раздели целое на четыре части.', uz: "Butunni to'rt qismga bo'ling.", en: 'Divide the whole into four parts.' } },
      { head: { ru: 'остаток', uz: 'qoldiq', en: 'what is left' }, label: '16 − 8 − 4', ans: 4, hint: { ru: 'Убери из целого обе известные части.', uz: "Butundan ikkala ma'lum qismni oling.", en: 'Take both known parts out of the whole.' } }
    ],
    check: '8 + 4 + 4 = 16',
    check_label: { ru: 'части дали целое', uz: 'qismlar butunni berdi', en: 'the parts gave the whole' },
    audio: {
      intro: { ru: 'Заполни три окна. Половина, четверть и остаток от шестнадцати.', uz: "Uchta oynani to'ldiring. O'n oltining yarmi, choragi va qoldig'i.", en: 'Fill three windows. The half, the quarter and what is left of sixteen.' },
      on_correct: { ru: 'Восемь, четыре и ещё четыре. Вместе ровно шестнадцать, круг сошёлся.', uz: "Sakkiz, to'rt va yana to'rt. Birga rosa o'n olti, doira to'ldi.", en: 'Eight, four and four more. Together exactly sixteen, the circle came out right.' }
    }
  },

  s8: {
    eyebrow: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    q: { ru: 'Всего 10, а части назвали 6, 5 и 2. Где ошибка?', uz: "Jami 10, qismlar esa 6, 5 va 2 deb aytilibdi. Xato qayerda?", en: 'There are 10 in all, and the parts were named 6, 5 and 2. Where is the mistake?' },
    fig_line: '6 + 5 + 2 = 13',
    opts: [
      { ru: 'части больше целого', uz: 'qismlar butundan katta', en: 'the parts are bigger than the whole' },
      { ru: 'ошибки нет', uz: "xato yo'q", en: 'there is no mistake' },
      { ru: 'частей слишком мало', uz: 'qismlar juda kam', en: 'there are too few parts' },
      { ru: 'целое названо неверно', uz: 'butun noto\'g\'ri aytilgan', en: 'the whole was named wrongly' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Сложи части и сравни с целым.', uz: "Qismlarni qo'shib, butun bilan solishtiring.", en: 'Add the parts and compare with the whole.' },
      2: { ru: 'Три части это нормально, дело в их сумме.', uz: "Uchta qism normal, gap ularning yig'indisida.", en: 'Three parts is quite normal, the point is their sum.' },
      3: { ru: 'Целое дано в условии, оно верное.', uz: "Butun shartda berilgan, u to'g'ri.", en: 'The whole is given in the problem, it is right.' }
    },
    audio: {
      intro: { ru: 'Кто-то прочитал диаграмму и назвал части. Найди ошибку.', uz: "Kimdir diagrammani o'qib, qismlarni aytibdi. Xatoni toping.", en: 'Someone read the chart and named the parts. Find the mistake.' },
      on_correct: { ru: 'Верно. Шесть, пять и два дают тринадцать, а целое всего десять. Части не могут быть больше целого.', uz: "To'g'ri. Olti, besh va ikki o'n uch beradi, butun esa atigi o'n. Qismlar butundan katta bo'la olmaydi.", en: 'Right. Six, five and two make thirteen, and the whole is only ten. The parts cannot be bigger than the whole.' },
      on_wrong: { ru: 'Сложи все части и сравни с целым.', uz: "Hamma qismni qo'shib, butun bilan solishtiring.", en: 'Add all the parts and compare with the whole.' }
    }
  },

  s9: {
    eyebrow: { ru: 'Ловушка Бита', uz: "Bit tuzog'i", en: "Bit's trap" },
    lead: { ru: 'Бит сравнивает две диаграммы', uz: 'Bit ikki diagrammani solishtiryapti', en: 'Bit is comparing two charts' },
    lines: ['в первом круге всего 8, во втором 20', 'Бит: половины одинаковые, значит кристаллов поровну'],
    lines_uz: ["birinchi doirada jami 8, ikkinchisida 20", "Bit: yarmilar bir xil, demak kristallar teng"],
    lines_en: ['the first circle has 8 in all, the second 20', 'Bit: the halves are the same, so the crystals are equal'],
    line_cap: { ru: 'Бит: сектора выглядят одинаково', uz: "Bit: sektorlar bir xil ko'rinadi", en: 'Bit: the sectors look the same' },
    trap_label: { ru: 'Так ли это?', uz: 'Shundaymi?', en: 'Is that so?' },
    trap_opts: { ru: ['нет, целые разные', 'да, сектора одинаковые'], uz: ["yo'q, butunlar har xil", 'ha, sektorlar bir xil'], en: ['no, the wholes are different', 'yes, the sectors are the same'] },
    trap_ci: 0,
    trap_correct: { ru: 'Да. Половина первого круга это четыре кристалла, а половина второго уже десять. Доля одна и та же, а числа разные, потому что целые разные.', uz: "Ha. Birinchi doiraning yarmi to'rtta kristall, ikkinchisiniki esa o'nta. Ulush bir xil, sonlar har xil, chunki butunlar har xil.", en: 'Yes. Half of the first circle is four crystals, and half of the second is already ten. The share is the same, and the numbers are different, because the wholes are different.' },
    trap_wrong: { ru: 'Посчитай половину каждого круга отдельно.', uz: "Har bir doiraning yarmini alohida sanang.", en: 'Count half of each circle separately.' },
    audio: {
      ru: [
        'Бит смотрит на две диаграммы рядом.',
        'Секторы одинаковые, оба по половине круга. Значит и кристаллов в них поровну.',
        'Так ли это?'
      ],
      uz: [
        "Bit yonma-yon turgan ikki diagrammaga qarayapti.",
        "Sektorlar bir xil, ikkalasi ham yarim doira. Demak ulardagi kristallar ham teng.",
        "Shundaymi?"
      ],
      en: ['Bit is looking at two charts side by side.', 'The sectors are the same, both half a circle. So they have the same number of crystals.', 'Is that so?']
    }
  },

  s10: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq', en: 'Trainer' },
    q: { ru: 'Всего 24 кристалла, зелёный сектор это четверть. Сколько зелёных?', uz: "Jami 24 kristall, yashil sektor chorak. Nechta yashil bor?", en: 'There are 24 crystals in all, the green sector is a quarter. How many green ones?' },
    ans: 6,
    check: '24 : 4',
    check_label: { ru: 'четверть от целого', uz: 'butunning choragi', en: 'a quarter of the whole' },
    hint: { ru: 'Раздели двадцать четыре на четыре.', uz: "Yigirma to'rtni to'rtga bo'ling.", en: 'Divide twenty four by four.' },
    audio: {
      intro: { ru: 'Теперь считай сам. Всего двадцать четыре, зелёный сектор это четверть.', uz: "Endi o'zingiz hisoblang. Jami yigirma to'rt, yashil sektor chorak.", en: 'Now count on your own. There are twenty four in all, the green sector is a quarter.' },
      on_correct: { ru: 'Шесть кристаллов.', uz: "Oltita kristall.", en: 'Six crystals.' }
    }
  },

  s11: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq', en: 'Trainer' },
    q: { ru: 'Всего 18, синий сектор 7, жёлтый 5. Сколько в третьем секторе?', uz: "Jami 18, ko'k sektor 7, sariq 5. Uchinchi sektorda nechta?", en: 'There are 18 in all, the blue sector 7, the yellow 5. How many in the third sector?' },
    ans: 6,
    check: '18 − 7 − 5',
    check_label: { ru: 'остаток целого', uz: 'butunning qoldig\'i', en: 'what is left of the whole' },
    hint: { ru: 'Убери из целого обе известные части.', uz: "Butundan ikkala ma'lum qismni oling.", en: 'Take both known parts out of the whole.' },
    audio: {
      intro: { ru: 'И ещё диаграмма. Всего восемнадцать, синий семь, жёлтый пять. Сколько в третьем?', uz: "Yana diagramma. Jami o'n sakkiz, ko'k yetti, sariq besh. Uchinchisida nechta?", en: 'And one more chart. Eighteen in all, blue seven, yellow five. How many in the third?' },
      on_correct: { ru: 'Шесть кристаллов. Теперь части дают ровно целое.', uz: "Oltita kristall. Endi qismlar rosa butunni beradi.", en: 'Six crystals. Now the parts give exactly the whole.' }
    }
  },

  s12: {
    eyebrow: { ru: 'Задача', uz: 'Masala', en: 'Word problem' },
    lead: { ru: 'Отчёт склада', uz: 'Ombor hisoboti', en: 'The report of the store' },
    q: { ru: 'Всего 30 кристаллов. Половина синие, треть зелёные. Сколько зелёных и сколько остальных?', uz: "Jami 30 kristall. Yarmi ko'k, uchdan biri yashil. Nechta yashil va nechta qolgani bor?", en: 'There are 30 crystals in all. Half are blue, a third are green. How many green ones and how many of the rest?' },
    q_speech: { ru: 'всего тридцать кристаллов, половина синие, треть зелёные. Сколько зелёных и сколько остальных?', uz: "jami o'ttizta kristall, yarmi ko'k, uchdan biri yashil. Nechta yashil va nechta qolgani bor?", en: 'there are thirty crystals in all, half are blue, a third are green. How many green ones and how many of the rest?' },
    tbl_heads: [
      { ru: 'всего', uz: 'jami', en: 'in all' },
      { ru: 'синие', uz: "ko'k", en: 'blue' },
      { ru: 'зелёные', uz: 'yashil', en: 'green' }
    ],
    tbl_cells: ['30', { ru: 'половина', uz: 'yarmi', en: 'a half' }, { ru: 'треть', uz: 'uchdan biri', en: 'a third' }],
    pick_label: { ru: 'С какого действия начинаем?', uz: 'Qaysi amaldan boshlaymiz?', en: 'Which operation do we start with?' },
    opts: [
      { ru: '30 : 3', uz: '30 : 3', en: '30 : 3' },
      { ru: '30 · 3', uz: '30 · 3', en: '30 · 3' },
      { ru: '30 − 3', uz: '30 − 3', en: '30 − 3' },
      { ru: '30 + 3', uz: '30 + 3', en: '30 + 3' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Умножение увеличит целое, а часть меньше него.', uz: "Ko'paytirish butunni oshiradi, qism esa undan kichik.", en: 'Multiplying would make the whole bigger, and a part is smaller than it.' },
      2: { ru: 'Вычитание тройки тут ничего не даёт.', uz: "Uchni ayirish bu yerda hech nima bermaydi.", en: 'Taking away three gives nothing here.' },
      3: { ru: 'Складывать целое с числом частей нельзя.', uz: "Butunni qismlar soni bilan qo'shib bo'lmaydi.", en: 'The whole cannot be added to the number of parts.' }
    },
    pick_ok: { ru: 'Верно. Треть это деление на три.', uz: "To'g'ri. Uchdan bir bu uchga bo'lish.", en: 'Right. A third means dividing by three.' },
    step1_q: { ru: 'Сколько зелёных кристаллов?', uz: 'Nechta yashil kristall bor?', en: 'How many green crystals are there?' },
    ans1: 10,
    hint1: { ru: 'Тридцать раздели на три.', uz: "O'ttizni uchga bo'ling.", en: 'Divide thirty by three.' },
    step2_q: { ru: 'Сколько кристаллов остальных цветов?', uz: 'Qolgan ranglardan nechta kristall bor?', en: 'How many crystals of the other colours are there?' },
    ans2: 5,
    hint2: { ru: 'Синих пятнадцать, зелёных десять, вычти обе части.', uz: "Ko'k o'n besh, yashil o'n, ikkala qismni ayiring.", en: 'Fifteen are blue, ten are green, take both parts away.' },
    check: '15 + 10 + 5 = 30',
    setup_audio: { ru: 'На складе составили отчёт. Посмотри на таблицу и реши, с чего начать.', uz: "Omborda hisobot tuzildi. Jadvalga qarang va nimadan boshlashni hal qiling.", en: 'A report was made at the store. Look at the table and decide where to start.' },
    audio: {
      intro: { ru: 'Всего тридцать кристаллов, половина синие, треть зелёные.', uz: "Jami o'ttizta kristall, yarmi ko'k, uchdan biri yashil.", en: 'There are thirty crystals in all, half are blue, a third are green.' },
      on_correct: { ru: 'Зелёных десять, а остальных пять. Пятнадцать, десять и пять дают ровно тридцать.', uz: "Yashil o'nta, qolgani beshta. O'n besh, o'n va besh rosa o'ttiz beradi.", en: 'There are ten green ones and five of the rest. Fifteen, ten and five make exactly thirty.' },
      on_wrong: { ru: 'Сначала найди каждую часть от целого.', uz: "Avval butundan har bir qismni toping.", en: 'First find each part of the whole.' }
    }
  },

  s13: {
    eyebrow: { ru: 'Финал', uz: 'Yakuniy', en: 'Final' },
    intro_line: { ru: 'Три задания. Всегда смотри на целое', uz: 'Uchta topshiriq. Har doim butunga qarang', en: 'Three tasks. Always look at the whole' },
    items: [
      {
        kind: 'num',
        q: { ru: 'Всего 12, половина красные. Сколько красных?', uz: "Jami 12, yarmi qizil. Nechta qizil bor?", en: 'There are 12 in all, half are red. How many red ones?' },
        q_speech: { ru: 'всего двенадцать, половина красные. Сколько красных?', uz: "jami o'n ikki, yarmi qizil. Nechta qizil bor?", en: 'there are twelve in all, half are red. How many red ones?' },
        ans: 6,
        hint: { ru: 'Раздели двенадцать пополам.', uz: "O'n ikkini teng ikkiga bo'ling.", en: 'Divide twelve in two.' }
      },
      {
        kind: 'num',
        q: { ru: 'Всего 20, четверть синие. Сколько синих?', uz: "Jami 20, choragi ko'k. Nechta ko'k bor?", en: 'There are 20 in all, a quarter are blue. How many blue ones?' },
        q_speech: { ru: 'всего двадцать, четверть синие. Сколько синих?', uz: "jami yigirma, choragi ko'k. Nechta ko'k bor?", en: 'there are twenty in all, a quarter are blue. How many blue ones?' },
        ans: 5,
        hint: { ru: 'Раздели двадцать на четыре.', uz: "Yigirmani to'rtga bo'ling.", en: 'Divide twenty by four.' }
      },
      {
        kind: 'num',
        q: { ru: 'Всего 15, в двух секторах 6 и 4. Сколько в третьем?', uz: "Jami 15, ikki sektorda 6 va 4. Uchinchisida nechta?", en: 'There are 15 in all, two sectors have 6 and 4. How many in the third?' },
        q_speech: { ru: 'всего пятнадцать, в двух секторах шесть и четыре. Сколько в третьем?', uz: "jami o'n besh, ikki sektorda olti va to'rt. Uchinchisida nechta?", en: 'there are fifteen in all, two sectors have six and four. How many in the third?' },
        ans: 5,
        hint: { ru: 'Убери из целого обе известные части.', uz: "Butundan ikkala ma'lum qismni oling.", en: 'Take both known parts out of the whole.' }
      }
    ],
    fact_badge: { ru: 'Знаешь ли ты?', uz: 'Bilasizmi?', en: 'Which line is wrong?' },
    fact_text: {
      ru: 'Больше ста пятидесяти лет назад медсестра Флоренс Найтингейл нарисовала круговую диаграмму о госпитале. Она показала, что от грязи и болезней солдат погибает больше, чем от ран. Списки цифр никто не читал, а картинку поняли сразу, и больницы стали мыть.',
      uz: "Bir yuz ellik yildan ko'proq oldin hamshira Florens Naytingeyl kasalxona haqida doiraviy diagramma chizgan. U askarlar yaradan ko'ra kir va kasallikdan ko'proq nobud bo'lishini ko'rsatgan. Raqamlar ro'yxatini hech kim o'qimasdi, rasmni esa darrov tushunishdi va kasalxonalarni tozalay boshlashdi.",
      en: 'More than a hundred and fifty years ago the nurse Florence Nightingale drew a pie chart about a hospital. She showed that more soldiers died of dirt and disease than of their wounds. Nobody would read lists of figures, but the picture was understood at once, and the hospitals were cleaned up.'
    },
    fact_audio: {
      ru: 'Вот случай, когда диаграмма изменила жизнь многих людей. Больше ста пятидесяти лет назад медсестра Флоренс Найтингейл работала в военном госпитале. Она заметила, что солдаты гибнут не столько от ран, сколько от грязи и болезней. Она собрала данные и нарисовала круговую диаграмму. Длинные списки цифр никто читать не хотел, а картинку поняли сразу. После этого в больницах навели чистоту, и людей стало умирать намного меньше.',
      uz: "Mana diagramma ko'p odamning hayotini o'zgartirgan voqea. Bir yuz ellik yildan ko'proq oldin hamshira Florens Naytingeyl harbiy kasalxonada ishlagan. U askarlar yaradan ko'ra kir va kasallikdan ko'proq nobud bo'layotganini payqagan. U ma'lumot to'plab, doiraviy diagramma chizgan. Uzun raqamlar ro'yxatini hech kim o'qishni istamasdi, rasmni esa darrov tushunishdi. Shundan keyin kasalxonalarda tozalik o'rnatildi va odamlar ancha kam nobud bo'la boshladi.",
      en: 'Here is a case where a chart changed the lives of many people. More than a hundred and fifty years ago a nurse called Florence Nightingale worked in a military hospital. She noticed that soldiers were dying not so much from their wounds as from dirt and disease. She gathered the data and drew a pie chart. Nobody wanted to read long lists of figures, but the picture was understood at once. After that the hospitals were made clean, and far fewer people died.'
    },
    audio: {
      intro: { ru: 'Три задания напоследок. Сначала посмотри, чему равно целое.', uz: "Oxirida uchta topshiriq. Avval butun nechaga tengligiga qarang.", en: 'Three tasks at the end. First look at what the whole is.' },
      on_correct: { ru: 'Верно.', uz: "To'g'ri.", en: 'Correct.' },
      on_wrong: { ru: 'Долю считают от целого, а не саму по себе.', uz: "Ulush o'zicha emas, butundan hisoblanadi.", en: 'A share is counted from the whole, not on its own.' }
    }
  },

  s14: {
    eyebrow: { ru: 'Итог', uz: 'Yakun', en: 'Result' },
    mission_done: { ru: 'Диаграмма прочитана!', uz: 'Diagramma o\'qildi!', en: 'The chart is read!' },
    cando: {
      ru: ['читаю круговую диаграмму', 'считаю долю от целого', 'проверяю, что части дают целое'],
      uz: ["doiraviy diagrammani o'qiyman", "butundan ulushni hisoblayman", "qismlar butunni berishini tekshiraman"],
      en: ['I read a pie chart', 'I work out a share of the whole', 'I check that the parts give the whole']
    },
    rule_recap: { ru: 'Круг это целое, сектор это часть, а сумма частей равна целому.', uz: "Doira bu butun, sektor bu qism, qismlar yig'indisi esa butunga teng.", en: 'The circle is the whole, a sector is a part, and the sum of the parts equals the whole.' },
    conn_label_refs: { ru: 'опирается на', uz: 'nimaga tayanadi', en: 'builds on' },
    conn_refs: { ru: 'урок 26: доли; урок 27: доля от числа', uz: "26-dars: ulushlar; 27-dars: sonning ulushi", en: 'lesson 26: shares; lesson 27: a share of a number' },
    conn_label_next: { ru: 'дальше', uz: 'keyin', en: 'next' },
    conn_next: { ru: 'повторение всего курса', uz: 'butun kursni takrorlash', en: 'a review of the whole course' },
    audio: {
      ru: 'Диаграмма прочитана. Запомни главное. Весь круг это целое, а каждый сектор его часть. Чем больше сектор, тем больше часть, и все части вместе дают ровно целое, не больше. А самое важное правило такое. Один и тот же сектор в разных кругах означает разные числа. Половина от восьми это четыре, а половина от двадцати уже десять. Поэтому диаграмму всегда читают вместе с числом целого. В следующий раз повторим весь путь от сотен до диаграмм!',
      uz: "Diagramma o'qildi. Asosiysini eslab qoling. Butun doira bu butun, har bir sektor esa uning qismi. Sektor qanchalik katta bo'lsa, qism shunchalik katta, hamma qism birga rosa butunni beradi, ortiq emas. Eng muhim qoida esa bu. Bir xil sektor har xil doirada har xil sonni anglatadi. Sakkizning yarmi to'rt, yigirmaning yarmi esa o'n. Shuning uchun diagramma har doim butunning soni bilan birga o'qiladi. Keyingi safar yuzliklardan diagrammalargacha butun yo'lni takrorlaymiz!",
      en: 'The chart is read. Remember the main thing. The whole circle is the whole, and each sector is a part of it. The bigger the sector, the bigger the part, and all the parts together give exactly the whole, no more. And the most important rule is this. The same sector in different circles means different numbers. Half of eight is four, and half of twenty is already ten. So a chart is always read together with the number of the whole. Next time we will go over the whole road from hundreds to charts!'
    }
  }
};

const BRIDGES = {
  s1:  { ru: 'Прочитаем части.', uz: "Qismlarni o'qiymiz.", en: 'Let us read the parts.' },
  s2:  { ru: 'Теперь про долю и число.', uz: 'Endi ulush va son haqida.', en: 'Now about the share and the number.' },
  s3:  { ru: "Соберём это в правило.", uz: "Buni qoidaga yig'amiz.", en: 'Let us gather this into a rule.' },
  s4:  { ru: 'Прочитай диаграмму.', uz: "Diagrammani o'qing.", en: 'Read the chart.' },
  s5:  { ru: 'Разложи утверждения.', uz: 'Tasdiqlarni ajrating.', en: 'Sort the statements.' },
  s6:  { ru: 'Быстрый вопрос.', uz: 'Tez savol.', en: 'A quick question.' },
  s7:  { ru: 'Заполни консоль.', uz: "Konsolni to'ldiring.", en: 'Fill the console.' },
  s8:  { ru: 'Тут части не сошлись.', uz: 'Bu yerda qismlar to\'g\'ri kelmadi.', en: 'Here the parts did not add up.' },
  s9:  { ru: 'А вот и Бит со своим сравнением.', uz: "Mana Bit ham o'z solishtiruvi bilan.", en: 'And here is Bit with his comparison.' },
  s10: { ru: 'Теперь считай сам.', uz: "Endi o'zingiz hisoblang.", en: 'Now count on your own.' },
  s11: { ru: 'И ещё одна диаграмма.', uz: 'Yana bitta diagramma.', en: 'And one more chart.' },
  s12: { ru: 'Задача со склада.', uz: 'Ombordan masala.', en: 'A task from the store.' },
  s13: { ru: 'Финальная проверка.', uz: 'Yakuniy tekshiruv.', en: 'The final check.' },
  s14: { ru: 'Подведём итог.', uz: 'Yakun yasaymiz.', en: 'Let us sum up.' }
};

const S14_PAYOFF = {
  ru: 'Диаграмма прочитана. Части сошлись в целое.',
  uz: "Diagramma o'qildi. Qismlar butunga jam bo'ldi.",
  en: 'The chart is read. The parts came together into the whole.'
};

// --- SAHNA TUGUNI (D50): 1-DARSNING shahri, ustiga doiraviy diagramma.
const PieNodeLayer = () => {
  const lang = useLang();
  return (
  <svg className="lm-scene-bg" viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <g transform="translate(200 126)">
      <circle r="40" fill="#EAF4FA" stroke="#8A7550" strokeWidth="2"/>
      <path d="M0 0 L0 -40 A40 40 0 0 1 0 40 Z" fill="#7FA8BF"/>
      <path d="M0 0 L0 40 A40 40 0 0 1 -40 0 Z" fill="#FFD98A"/>
      <path d="M0 0 L-40 0 A40 40 0 0 1 0 -40 Z" fill="#8CE38A"/>
      <circle r="40" fill="none" stroke="#8A7550" strokeWidth="2"/>
      <text x="0" y="58" textAnchor="middle" fontSize="8" letterSpacing="1.2" fill="#3F5A6B" fontFamily="'JetBrains Mono', monospace">{tri(lang, 'всего 12', 'jami 12', '12 in all')}</text>
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
      <PieNodeLayer/>
      <div className="lm-scene-cast">
        {LUMO_CAST.slice(0, 2).map(kid)}
        <span className={`lm-crew lm-crew-host ${gathered ? 'd2-bit-cheer' : 'lm-bob'}`}><span className="g1-cast-fig"><BitSVG state={gathered ? 'happy' : 'present'}/></span></span>
        {LUMO_CAST.slice(2).map((c, i) => kid(c, i + 2))}
      </div>
    </div>
  );
};

// --- EKRAN CHIZMASI (s4): doira, choragi ko'k, jami 8.
const QuarterPieFig = () => {
  const lang = useLang();
  return (
  <svg viewBox="0 0 200 130" style={{ width: 'min(240px, 78%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <g transform="translate(100 58)">
      <circle r="46" fill="#F7F1E4" stroke="#8A7550" strokeWidth="2.4"/>
      <path d="M0 0 L0 -46 A46 46 0 0 1 46 0 Z" fill="#7FA8BF"/>
      <circle r="46" fill="none" stroke="#8A7550" strokeWidth="2.4"/>
      <line x1="0" y1="0" x2="0" y2="-46" stroke="#8A7550" strokeWidth="1.6"/>
      <line x1="0" y1="0" x2="46" y2="0" stroke="#8A7550" strokeWidth="1.6"/>
    </g>
    <text x="100" y="122" textAnchor="middle" fontSize="10" fontWeight="800" fill="#8A7550" fontFamily="'JetBrains Mono', monospace">{tri(lang, 'всего 8', 'jami 8', '8 in all')}</text>
  </svg>
  );
};

// --- FACTCARD QAHRAMONI: Naytingeyl diagrammasi va toza kasalxona.
const NightingaleFig = () => {
  const lang = useLang();
  return (
  <svg viewBox="0 0 220 104" style={{ width: 'min(266px, 84%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <g transform="translate(58 52)">
      <circle r="34" fill="#F7F1E4" stroke="#8A7550" strokeWidth="2"/>
      <path d="M0 0 L0 -34 A34 34 0 0 1 29 17 Z" fill="#C4563A"/>
      <path d="M0 0 L29 17 A34 34 0 0 1 -12 32 Z" fill="#E8A87C"/>
      <path d="M0 0 L-12 32 A34 34 0 0 1 0 -34 Z" fill="#DCEBF5"/>
      <circle r="34" fill="none" stroke="#8A7550" strokeWidth="2"/>
    </g>
    <path d="M108 52 h18 m-6 -6 l6 6 l-6 6" fill="none" stroke="#8A7550" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <g transform="translate(142 24)">
      <rect x="0" y="0" width="60" height="56" rx="5" fill="#EAF4FA" stroke="#2E7E9E" strokeWidth="2"/>
      <path d="M30 12 v20 M20 22 h20" stroke="#2E7E9E" strokeWidth="4" strokeLinecap="round"/>
      <text x="30" y="50" textAnchor="middle" fontSize="8" fill="#2E7E9E" fontFamily="'JetBrains Mono', monospace">{tri(lang, 'чистота', 'tozalik', 'cleanliness')}</text>
    </g>
  </svg>
  );
};

export default createLesson({
  TOTAL_SCREENS, LESSON_META, SCREEN_META, CONTENT, BRIDGES, S14_PAYOFF,
  STYLES: LESSON_STYLES,
  Scene: LessonScene,
  FactFig: NightingaleFig,
  figs: { s4: <QuarterPieFig/> }
});
