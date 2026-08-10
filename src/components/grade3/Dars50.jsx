import React from 'react';
import { BitSVG, LUMO_CAST, LumoCityBg, createLesson, useLang} from './_kit/index.jsx';
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
  lessonId: 'num-3-50',
  lessonTitle: { ru: 'Урок 50. Круговые диаграммы и данные', uz: "50-dars. Doiraviy diagramma va ma'lumot" }
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
    eyebrow: { ru: 'Крючок', uz: 'Qiziqtirish' },
    topic: { ru: 'Круговая диаграмма', uz: 'Doiraviy diagramma' },
    lead: { ru: 'Круг разделён на части цветом', uz: 'Doira rang bilan qismlarga bo\'lingan' },
    order_cap: { ru: 'один круг — все кристаллы склада', uz: 'bitta doira — ombordagi hamma kristall' },
    plate: ['12', '◔', '?'],
    q: { ru: 'Что показывает весь круг целиком?', uz: 'Butun doira nimani ko\'rsatadi?' },
    opt0: { ru: 'все кристаллы вместе', uz: 'hamma kristall birga' },
    opt1: { ru: 'самую большую часть', uz: 'eng katta qismni' },
    opt2: { ru: 'число цветов', uz: 'ranglar sonini' },
    opt3: { ru: 'ничего не показывает', uz: 'hech nimani' },
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
        ]
      },
      on_correct: { ru: 'Верно! Весь круг это всё вместе, а части это доли от него.', uz: "To'g'ri! Butun doira bu hammasi birga, qismlar esa undan olingan ulushlar." },
      on_wrong1: { ru: 'Самая большая часть это только один сектор, а не весь круг.', uz: "Eng katta qism bu bitta sektor, butun doira emas." },
      on_wrong2: { ru: 'Цветов может быть сколько угодно, круг всё равно означает всё целиком.', uz: "Rang xohlagancha bo'lishi mumkin, doira baribir hammasini anglatadi." },
      on_idk: { ru: 'Ничего. Сейчас разберём диаграмму по частям.', uz: "Hechqisi yo'q. Hozir diagrammani qismlarga ajratamiz." }
    }
  },

  s1: {
    eyebrow: { ru: 'Разбор', uz: 'Tahlil' },
    lead: { ru: 'Читаем части круга', uz: 'Doira qismlarini o\'qiymiz' },
    task_line: 'всего 12 кристаллов',
    task_line_uz: "jami 12 kristall",
    step1: { ru: 'половина — 6', uz: 'yarmi — 6' },
    step1_cap: { ru: 'синий сектор это половина круга', uz: "ko'k sektor doiraning yarmi" },
    step2: { ru: 'четверть — 3', uz: 'chorak — 3' },
    step2_cap: { ru: 'жёлтый сектор это четверть', uz: 'sariq sektor chorak' },
    res: '6 + 3 + 3 = 12',
    btn1: { ru: 'Прочитать синий', uz: "Ko'kni o'qish" },
    btn2: { ru: 'Прочитать жёлтый', uz: "Sariqni o'qish" },
    done_text: { ru: 'Части складываются ровно в целое, ни больше ни меньше.', uz: "Qismlar rosa butunga yig'iladi, ko'p ham emas, kam ham emas." },
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
      ]
    }
  },

  s2: {
    eyebrow: { ru: 'Разбор', uz: 'Tahlil' },
    w: 4,
    h: 4,
    lead: { ru: 'Доля и число это не одно и то же', uz: 'Ulush va son bir narsa emas' },
    capA: { ru: 'половина от 12 — это 6', uz: '12 ning yarmi — 6' },
    capB: { ru: 'половина от 20 — это 10', uz: '20 ning yarmi — 10' },
    res: { ru: 'доля одна, числа разные', uz: 'ulush bitta, sonlar har xil' },
    btn1: { ru: 'Взять круг на 12', uz: "12 lik doirani olish" },
    btn2: { ru: 'Взять круг на 20', uz: '20 lik doirani olish' },
    done_text: { ru: 'Одинаковый по виду сектор даёт разные числа, если целое разное.', uz: "Ko'rinishi bir xil sektor butun har xil bo'lsa, har xil son beradi." },
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
      ]
    }
  },

  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida' },
    q: { ru: 'Что означает весь круг диаграммы?', uz: 'Diagrammaning butun doirasi nimani anglatadi?' },
    opts: [
      { ru: 'всё целое', uz: 'butun hammasi' },
      { ru: 'сто штук', uz: 'yuzta dona' },
      { ru: 'самую большую часть', uz: 'eng katta qismni' },
      { ru: 'число секторов', uz: 'sektorlar sonini' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Целое бывает любым. И двенадцать, и двадцать.', uz: "Butun har qanday bo'ladi. O'n ikki ham, yigirma ham." },
      2: { ru: 'Большая часть это только один сектор.', uz: "Katta qism bu bitta sektor." },
      3: { ru: 'Секторов может быть три, четыре, сколько угодно.', uz: "Sektor uchta, to'rtta, xohlagancha bo'lishi mumkin." }
    },
    on_correct: { ru: 'Верно. Круг это целое, а секторы его части.', uz: "To'g'ri. Doira bu butun, sektorlar esa uning qismlari." },
    rule_lines: {
      ru: ['круг это всё целое', 'сектор больше — часть больше', 'части в сумме дают целое'],
      uz: ["doira bu butun hammasi", "sektor katta — qism katta", "qismlar yig'indisi butunni beradi"]
    },
    rule_ex: '6 + 3 + 3 = 12',
    rule_speech: { ru: 'Круговая диаграмма показывает части одного целого. Весь круг это всё вместе, а чем больше сектор, тем больше часть. Части в сумме дают ровно целое, поэтому одну и ту же долю в разных кругах читают разными числами.', uz: "Doiraviy diagramma bitta butunning qismlarini ko'rsatadi. Butun doira bu hammasi birga, sektor qanchalik katta bo'lsa, qism shunchalik katta. Qismlar yig'indisi rosa butunni beradi, shuning uchun bir xil ulush har xil doirada har xil son bilan o'qiladi." },
    audio: {
      intro: { ru: 'Соберём правило. Мы прочитали два круга.', uz: "Qoidani yig'amiz. Ikkita doirani o'qidik." }
    }
  },

  s4: {
    eyebrow: { ru: 'Чертёж', uz: 'Chizma' },
    q: { ru: 'Всего 8 кристаллов, синий сектор это четверть. Сколько синих?', uz: "Jami 8 kristall, ko'k sektor chorak. Nechta ko'k bor?" },
    fig_w: 4,
    fig_h: 2,
    opts: [
      { ru: '2', uz: '2' },
      { ru: '4', uz: '4' },
      { ru: '8', uz: '8' },
      { ru: '1', uz: '1' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Четыре это половина, а не четверть.', uz: "To'rt bu yarim, chorak emas." },
      2: { ru: 'Восемь это весь круг целиком.', uz: "Sakkiz bu butun doira." },
      3: { ru: 'Один это восьмая часть, слишком мало.', uz: "Bir bu sakkizdan bir qism, juda kam." }
    },
    audio: {
      intro: { ru: 'Посмотри на диаграмму. Всего восемь кристаллов, синий сектор занимает четверть круга.', uz: "Diagrammaga qarang. Jami sakkizta kristall, ko'k sektor doiraning choragini egallaydi." },
      on_correct: { ru: 'Верно. Четверть от восьми это два.', uz: "To'g'ri. Sakkizning choragi ikki." },
      on_wrong: { ru: 'Раздели всё целое на четыре части.', uz: "Butun hammasini to'rt qismga bo'ling." }
    }
  },

  s5: {
    eyebrow: { ru: 'Сортировка', uz: 'Saralash' },
    lead: { ru: 'Разложи утверждения о диаграмме', uz: 'Diagramma haqidagi tasdiqlarni ajrating' },
    bin_a: { ru: 'верно', uz: 'rost' },
    bin_b: { ru: 'неверно', uz: "yolg'on" },
    items: [
      { n: { ru: 'части дают целое', uz: 'qismlar butunni beradi' }, a: true, hint: { ru: 'Иначе круг не сошёлся бы.', uz: "Aks holda doira to'lmasdi." } },
      { n: { ru: 'половина это всегда 50', uz: 'yarim har doim 50' }, a: false, hint: { ru: 'Половина зависит от целого.', uz: "Yarim butunga bog'liq." } },
      { n: { ru: 'больший сектор — большая часть', uz: 'katta sektor — katta qism' }, a: true, hint: { ru: 'Так и читают диаграмму.', uz: "Diagramma shunday o'qiladi." } },
      { n: { ru: 'сектор можно читать без целого', uz: 'sektorni butunsiz o\'qisa bo\'ladi' }, a: false, hint: { ru: 'Без целого число не назовёшь.', uz: "Butunsiz sonni ayta olmaysiz." } }
    ],
    audio: {
      intro: { ru: 'Четыре утверждения о диаграмме. Отправь каждое в свою корзину.', uz: "Diagramma haqida to'rtta tasdiq. Har birini o'z savatiga yuboring." },
      on_correct: { ru: 'Всё на месте. Сектор читают только вместе с целым.', uz: "Hammasi joyida. Sektor faqat butun bilan birga o'qiladi." },
      on_wrong: { ru: 'Спроси себя, хватит ли одного сектора для ответа.', uz: "O'zingizdan so'rang, javob uchun bitta sektor yetadimi." }
    }
  },

  s6: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv' },
    q: { ru: 'Всего 20 кристаллов, красный сектор это половина. Сколько красных?', uz: "Jami 20 kristall, qizil sektor yarim. Nechta qizil bor?" },
    opts: [
      { ru: '10', uz: '10' },
      { ru: '5', uz: '5' },
      { ru: '20', uz: '20' },
      { ru: '2', uz: '2' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Пять это четверть от двадцати.', uz: "Besh bu yigirmaning choragi." },
      2: { ru: 'Двадцать это весь круг.', uz: "Yigirma bu butun doira." },
      3: { ru: 'Два это слишком мало для половины.', uz: "Ikki yarim uchun juda kam." }
    },
    audio: {
      intro: { ru: 'Быстрый вопрос. Всего двадцать кристаллов, красный сектор это половина.', uz: "Tez savol. Jami yigirmata kristall, qizil sektor yarim." },
      on_correct: { ru: 'Верно. Половина от двадцати это десять.', uz: "To'g'ri. Yigirmaning yarmi o'n." },
      on_wrong: { ru: 'Раздели целое пополам.', uz: "Butunni teng ikkiga bo'ling." }
    }
  },

  s7: {
    eyebrow: { ru: 'Консоль', uz: 'Konsol' },
    lead: { ru: 'Всего 16 кристаллов на трёх полках', uz: 'Uch javonda jami 16 kristall' },
    swap_line: { ru: 'всего 16', uz: 'jami 16' },
    cells: [
      { head: { ru: 'половина', uz: 'yarmi' }, label: '16 : 2', ans: 8, hint: { ru: 'Раздели целое на две части.', uz: "Butunni ikki qismga bo'ling." } },
      { head: { ru: 'четверть', uz: 'chorak' }, label: '16 : 4', ans: 4, hint: { ru: 'Раздели целое на четыре части.', uz: "Butunni to'rt qismga bo'ling." } },
      { head: { ru: 'остаток', uz: 'qoldiq' }, label: '16 − 8 − 4', ans: 4, hint: { ru: 'Убери из целого обе известные части.', uz: "Butundan ikkala ma'lum qismni oling." } }
    ],
    check: '8 + 4 + 4 = 16',
    check_label: { ru: 'части дали целое', uz: 'qismlar butunni berdi' },
    audio: {
      intro: { ru: 'Заполни три окна. Половина, четверть и остаток от шестнадцати.', uz: "Uchta oynani to'ldiring. O'n oltining yarmi, choragi va qoldig'i." },
      on_correct: { ru: 'Восемь, четыре и ещё четыре. Вместе ровно шестнадцать, круг сошёлся.', uz: "Sakkiz, to'rt va yana to'rt. Birga rosa o'n olti, doira to'ldi." }
    }
  },

  s8: {
    eyebrow: { ru: 'Найди ошибку', uz: 'Xatoni toping' },
    q: { ru: 'Всего 10, а части назвали 6, 5 и 2. Где ошибка?', uz: "Jami 10, qismlar esa 6, 5 va 2 deb aytilibdi. Xato qayerda?" },
    fig_line: '6 + 5 + 2 = 13',
    opts: [
      { ru: 'части больше целого', uz: 'qismlar butundan katta' },
      { ru: 'ошибки нет', uz: "xato yo'q" },
      { ru: 'частей слишком мало', uz: 'qismlar juda kam' },
      { ru: 'целое названо неверно', uz: 'butun noto\'g\'ri aytilgan' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Сложи части и сравни с целым.', uz: "Qismlarni qo'shib, butun bilan solishtiring." },
      2: { ru: 'Три части это нормально, дело в их сумме.', uz: "Uchta qism normal, gap ularning yig'indisida." },
      3: { ru: 'Целое дано в условии, оно верное.', uz: "Butun shartda berilgan, u to'g'ri." }
    },
    audio: {
      intro: { ru: 'Кто-то прочитал диаграмму и назвал части. Найди ошибку.', uz: "Kimdir diagrammani o'qib, qismlarni aytibdi. Xatoni toping." },
      on_correct: { ru: 'Верно. Шесть, пять и два дают тринадцать, а целое всего десять. Части не могут быть больше целого.', uz: "To'g'ri. Olti, besh va ikki o'n uch beradi, butun esa atigi o'n. Qismlar butundan katta bo'la olmaydi." },
      on_wrong: { ru: 'Сложи все части и сравни с целым.', uz: "Hamma qismni qo'shib, butun bilan solishtiring." }
    }
  },

  s9: {
    eyebrow: { ru: 'Ловушка Бита', uz: "Bit tuzog'i" },
    lead: { ru: 'Бит сравнивает две диаграммы', uz: 'Bit ikki diagrammani solishtiryapti' },
    lines: ['в первом круге всего 8, во втором 20', 'Бит: половины одинаковые, значит кристаллов поровну'],
    lines_uz: ["birinchi doirada jami 8, ikkinchisida 20", "Bit: yarmilar bir xil, demak kristallar teng"],
    line_cap: { ru: 'Бит: сектора выглядят одинаково', uz: "Bit: sektorlar bir xil ko'rinadi" },
    trap_label: { ru: 'Так ли это?', uz: 'Shundaymi?' },
    trap_opts: { ru: ['нет, целые разные', 'да, сектора одинаковые'], uz: ["yo'q, butunlar har xil", 'ha, sektorlar bir xil'] },
    trap_ci: 0,
    trap_correct: { ru: 'Да. Половина первого круга это четыре кристалла, а половина второго уже десять. Доля одна и та же, а числа разные, потому что целые разные.', uz: "Ha. Birinchi doiraning yarmi to'rtta kristall, ikkinchisiniki esa o'nta. Ulush bir xil, sonlar har xil, chunki butunlar har xil." },
    trap_wrong: { ru: 'Посчитай половину каждого круга отдельно.', uz: "Har bir doiraning yarmini alohida sanang." },
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
      ]
    }
  },

  s10: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq' },
    q: { ru: 'Всего 24 кристалла, зелёный сектор это четверть. Сколько зелёных?', uz: "Jami 24 kristall, yashil sektor chorak. Nechta yashil bor?" },
    ans: 6,
    check: '24 : 4',
    check_label: { ru: 'четверть от целого', uz: 'butunning choragi' },
    hint: { ru: 'Раздели двадцать четыре на четыре.', uz: "Yigirma to'rtni to'rtga bo'ling." },
    audio: {
      intro: { ru: 'Теперь считай сам. Всего двадцать четыре, зелёный сектор это четверть.', uz: "Endi o'zingiz hisoblang. Jami yigirma to'rt, yashil sektor chorak." },
      on_correct: { ru: 'Шесть кристаллов.', uz: "Oltita kristall." }
    }
  },

  s11: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq' },
    q: { ru: 'Всего 18, синий сектор 7, жёлтый 5. Сколько в третьем секторе?', uz: "Jami 18, ko'k sektor 7, sariq 5. Uchinchi sektorda nechta?" },
    ans: 6,
    check: '18 − 7 − 5',
    check_label: { ru: 'остаток целого', uz: 'butunning qoldig\'i' },
    hint: { ru: 'Убери из целого обе известные части.', uz: "Butundan ikkala ma'lum qismni oling." },
    audio: {
      intro: { ru: 'И ещё диаграмма. Всего восемнадцать, синий семь, жёлтый пять. Сколько в третьем?', uz: "Yana diagramma. Jami o'n sakkiz, ko'k yetti, sariq besh. Uchinchisida nechta?" },
      on_correct: { ru: 'Шесть кристаллов. Теперь части дают ровно целое.', uz: "Oltita kristall. Endi qismlar rosa butunni beradi." }
    }
  },

  s12: {
    eyebrow: { ru: 'Задача', uz: 'Masala' },
    lead: { ru: 'Отчёт склада', uz: 'Ombor hisoboti' },
    q: { ru: 'Всего 30 кристаллов. Половина синие, треть зелёные. Сколько зелёных и сколько остальных?', uz: "Jami 30 kristall. Yarmi ko'k, uchdan biri yashil. Nechta yashil va nechta qolgani bor?" },
    q_speech: { ru: 'всего тридцать кристаллов, половина синие, треть зелёные. Сколько зелёных и сколько остальных?', uz: "jami o'ttizta kristall, yarmi ko'k, uchdan biri yashil. Nechta yashil va nechta qolgani bor?" },
    tbl_heads: [
      { ru: 'всего', uz: 'jami' },
      { ru: 'синие', uz: "ko'k" },
      { ru: 'зелёные', uz: 'yashil' }
    ],
    tbl_cells: ['30', { ru: 'половина', uz: 'yarmi' }, { ru: 'треть', uz: 'uchdan biri' }],
    pick_label: { ru: 'С какого действия начинаем?', uz: 'Qaysi amaldan boshlaymiz?' },
    opts: [
      { ru: '30 : 3', uz: '30 : 3' },
      { ru: '30 · 3', uz: '30 · 3' },
      { ru: '30 − 3', uz: '30 − 3' },
      { ru: '30 + 3', uz: '30 + 3' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Умножение увеличит целое, а часть меньше него.', uz: "Ko'paytirish butunni oshiradi, qism esa undan kichik." },
      2: { ru: 'Вычитание тройки тут ничего не даёт.', uz: "Uchni ayirish bu yerda hech nima bermaydi." },
      3: { ru: 'Складывать целое с числом частей нельзя.', uz: "Butunni qismlar soni bilan qo'shib bo'lmaydi." }
    },
    pick_ok: { ru: 'Верно. Треть это деление на три.', uz: "To'g'ri. Uchdan bir bu uchga bo'lish." },
    step1_q: { ru: 'Сколько зелёных кристаллов?', uz: 'Nechta yashil kristall bor?' },
    ans1: 10,
    hint1: { ru: 'Тридцать раздели на три.', uz: "O'ttizni uchga bo'ling." },
    step2_q: { ru: 'Сколько кристаллов остальных цветов?', uz: 'Qolgan ranglardan nechta kristall bor?' },
    ans2: 5,
    hint2: { ru: 'Синих пятнадцать, зелёных десять, вычти обе части.', uz: "Ko'k o'n besh, yashil o'n, ikkala qismni ayiring." },
    check: '15 + 10 + 5 = 30',
    setup_audio: { ru: 'На складе составили отчёт. Посмотри на таблицу и реши, с чего начать.', uz: "Omborda hisobot tuzildi. Jadvalga qarang va nimadan boshlashni hal qiling." },
    audio: {
      intro: { ru: 'Всего тридцать кристаллов, половина синие, треть зелёные.', uz: "Jami o'ttizta kristall, yarmi ko'k, uchdan biri yashil." },
      on_correct: { ru: 'Зелёных десять, а остальных пять. Пятнадцать, десять и пять дают ровно тридцать.', uz: "Yashil o'nta, qolgani beshta. O'n besh, o'n va besh rosa o'ttiz beradi." },
      on_wrong: { ru: 'Сначала найди каждую часть от целого.', uz: "Avval butundan har bir qismni toping." }
    }
  },

  s13: {
    eyebrow: { ru: 'Финал', uz: 'Yakuniy' },
    intro_line: { ru: 'Три задания. Всегда смотри на целое', uz: 'Uchta topshiriq. Har doim butunga qarang' },
    items: [
      {
        kind: 'num',
        q: { ru: 'Всего 12, половина красные. Сколько красных?', uz: "Jami 12, yarmi qizil. Nechta qizil bor?" },
        q_speech: { ru: 'всего двенадцать, половина красные. Сколько красных?', uz: "jami o'n ikki, yarmi qizil. Nechta qizil bor?" },
        ans: 6,
        hint: { ru: 'Раздели двенадцать пополам.', uz: "O'n ikkini teng ikkiga bo'ling." }
      },
      {
        kind: 'num',
        q: { ru: 'Всего 20, четверть синие. Сколько синих?', uz: "Jami 20, choragi ko'k. Nechta ko'k bor?" },
        q_speech: { ru: 'всего двадцать, четверть синие. Сколько синих?', uz: "jami yigirma, choragi ko'k. Nechta ko'k bor?" },
        ans: 5,
        hint: { ru: 'Раздели двадцать на четыре.', uz: "Yigirmani to'rtga bo'ling." }
      },
      {
        kind: 'num',
        q: { ru: 'Всего 15, в двух секторах 6 и 4. Сколько в третьем?', uz: "Jami 15, ikki sektorda 6 va 4. Uchinchisida nechta?" },
        q_speech: { ru: 'всего пятнадцать, в двух секторах шесть и четыре. Сколько в третьем?', uz: "jami o'n besh, ikki sektorda olti va to'rt. Uchinchisida nechta?" },
        ans: 5,
        hint: { ru: 'Убери из целого обе известные части.', uz: "Butundan ikkala ma'lum qismni oling." }
      }
    ],
    fact_badge: { ru: 'Знаешь ли ты?', uz: 'Bilasizmi?' },
    fact_text: {
      ru: 'Больше ста пятидесяти лет назад медсестра Флоренс Найтингейл нарисовала круговую диаграмму о госпитале. Она показала, что от грязи и болезней солдат погибает больше, чем от ран. Списки цифр никто не читал, а картинку поняли сразу, и больницы стали мыть.',
      uz: "Bir yuz ellik yildan ko'proq oldin hamshira Florens Naytingeyl kasalxona haqida doiraviy diagramma chizgan. U askarlar yaradan ko'ra kir va kasallikdan ko'proq nobud bo'lishini ko'rsatgan. Raqamlar ro'yxatini hech kim o'qimasdi, rasmni esa darrov tushunishdi va kasalxonalarni tozalay boshlashdi."
    },
    fact_audio: {
      ru: 'Вот случай, когда диаграмма изменила жизнь многих людей. Больше ста пятидесяти лет назад медсестра Флоренс Найтингейл работала в военном госпитале. Она заметила, что солдаты гибнут не столько от ран, сколько от грязи и болезней. Она собрала данные и нарисовала круговую диаграмму. Длинные списки цифр никто читать не хотел, а картинку поняли сразу. После этого в больницах навели чистоту, и людей стало умирать намного меньше.',
      uz: "Mana diagramma ko'p odamning hayotini o'zgartirgan voqea. Bir yuz ellik yildan ko'proq oldin hamshira Florens Naytingeyl harbiy kasalxonada ishlagan. U askarlar yaradan ko'ra kir va kasallikdan ko'proq nobud bo'layotganini payqagan. U ma'lumot to'plab, doiraviy diagramma chizgan. Uzun raqamlar ro'yxatini hech kim o'qishni istamasdi, rasmni esa darrov tushunishdi. Shundan keyin kasalxonalarda tozalik o'rnatildi va odamlar ancha kam nobud bo'la boshladi."
    },
    audio: {
      intro: { ru: 'Три задания напоследок. Сначала посмотри, чему равно целое.', uz: "Oxirida uchta topshiriq. Avval butun nechaga tengligiga qarang." },
      on_correct: { ru: 'Верно.', uz: "To'g'ri." },
      on_wrong: { ru: 'Долю считают от целого, а не саму по себе.', uz: "Ulush o'zicha emas, butundan hisoblanadi." }
    }
  },

  s14: {
    eyebrow: { ru: 'Итог', uz: 'Yakun' },
    mission_done: { ru: 'Диаграмма прочитана!', uz: 'Diagramma o\'qildi!' },
    cando: {
      ru: ['читаю круговую диаграмму', 'считаю долю от целого', 'проверяю, что части дают целое'],
      uz: ["doiraviy diagrammani o'qiyman", "butundan ulushni hisoblayman", "qismlar butunni berishini tekshiraman"]
    },
    rule_recap: { ru: 'Круг это целое, сектор это часть, а сумма частей равна целому.', uz: "Doira bu butun, sektor bu qism, qismlar yig'indisi esa butunga teng." },
    conn_label_refs: { ru: 'опирается на', uz: 'nimaga tayanadi' },
    conn_refs: { ru: 'урок 26: доли; урок 27: доля от числа', uz: "26-dars: ulushlar; 27-dars: sonning ulushi" },
    conn_label_next: { ru: 'дальше', uz: 'keyin' },
    conn_next: { ru: 'повторение всего курса', uz: 'butun kursni takrorlash' },
    audio: {
      ru: 'Диаграмма прочитана. Запомни главное. Весь круг это целое, а каждый сектор его часть. Чем больше сектор, тем больше часть, и все части вместе дают ровно целое, не больше. А самое важное правило такое. Один и тот же сектор в разных кругах означает разные числа. Половина от восьми это четыре, а половина от двадцати уже десять. Поэтому диаграмму всегда читают вместе с числом целого. В следующий раз повторим весь путь от сотен до диаграмм!',
      uz: "Diagramma o'qildi. Asosiysini eslab qoling. Butun doira bu butun, har bir sektor esa uning qismi. Sektor qanchalik katta bo'lsa, qism shunchalik katta, hamma qism birga rosa butunni beradi, ortiq emas. Eng muhim qoida esa bu. Bir xil sektor har xil doirada har xil sonni anglatadi. Sakkizning yarmi to'rt, yigirmaning yarmi esa o'n. Shuning uchun diagramma har doim butunning soni bilan birga o'qiladi. Keyingi safar yuzliklardan diagrammalargacha butun yo'lni takrorlaymiz!"
    }
  }
};

const BRIDGES = {
  s1:  { ru: 'Прочитаем части.', uz: "Qismlarni o'qiymiz." },
  s2:  { ru: 'Теперь про долю и число.', uz: 'Endi ulush va son haqida.' },
  s3:  { ru: "Соберём это в правило.", uz: "Buni qoidaga yig'amiz." },
  s4:  { ru: 'Прочитай диаграмму.', uz: "Diagrammani o'qing." },
  s5:  { ru: 'Разложи утверждения.', uz: 'Tasdiqlarni ajrating.' },
  s6:  { ru: 'Быстрый вопрос.', uz: 'Tez savol.' },
  s7:  { ru: 'Заполни консоль.', uz: "Konsolni to'ldiring." },
  s8:  { ru: 'Тут части не сошлись.', uz: 'Bu yerda qismlar to\'g\'ri kelmadi.' },
  s9:  { ru: 'А вот и Бит со своим сравнением.', uz: "Mana Bit ham o'z solishtiruvi bilan." },
  s10: { ru: 'Теперь считай сам.', uz: "Endi o'zingiz hisoblang." },
  s11: { ru: 'И ещё одна диаграмма.', uz: 'Yana bitta diagramma.' },
  s12: { ru: 'Задача со склада.', uz: 'Ombordan masala.' },
  s13: { ru: 'Финальная проверка.', uz: 'Yakuniy tekshiruv.' },
  s14: { ru: 'Подведём итог.', uz: 'Yakun yasaymiz.' }
};

const S14_PAYOFF = {
  ru: 'Диаграмма прочитана. Части сошлись в целое.',
  uz: "Diagramma o'qildi. Qismlar butunga jam bo'ldi."
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
      <text x="0" y="58" textAnchor="middle" fontSize="8" letterSpacing="1.2" fill="#3F5A6B" fontFamily="'JetBrains Mono', monospace">{lang === 'ru' ? 'всего 12' : 'jami 12'}</text>
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
    <text x="100" y="122" textAnchor="middle" fontSize="10" fontWeight="800" fill="#8A7550" fontFamily="'JetBrains Mono', monospace">{lang === 'ru' ? 'всего 8' : 'jami 8'}</text>
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
      <text x="30" y="50" textAnchor="middle" fontSize="8" fill="#2E7E9E" fontFamily="'JetBrains Mono', monospace">{lang === 'ru' ? 'чистота' : 'tozalik'}</text>
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
