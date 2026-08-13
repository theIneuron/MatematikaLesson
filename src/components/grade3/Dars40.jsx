import React from 'react';
import { AncientHallBg, BitSVG, HALL_SLAB, LUMO_CAST, createLesson, useLang, tri } from './_kit/index.jsx';
import { LESSON_STYLES } from './_kit/styles.js';

// ============================================================================
// DD 3-SINF | Dars40 — "Simmetriya o'qi va burchak gradusi" (num-3-40)
// Б5 «KRISTALL ARXITEKTURA»
// Syujet: kristall kvartal davom etadi (SYUJET_3SINF.md 194-satr, reja 44-satr).
// SAHNA: 8-DARS zali kitdan, markazda darsning tuguni — simmetrik naqsh.
// DARSLIK ASOSI (Burxonov, 3-sinf, «Sharq» 2019, 123, 167, 185-bet).
// YADRO: o'q shaklni ikkiga bo'lganda yarmilar USTMA-UST tushsa, shakl simmetrik. To'g'ri
//   burchak to'qson gradus, o'tkir undan kichik, o'tmas kattaroq.
// Misconception: M1 o'rtadan o'tgan har qanday chiziqni o'q deb hisoblash; M2 o'q faqat tik
//   bo'ladi deb o'ylash; M3 «o'tkir demak kichkina shakl»; M4 to'g'ri burchakni faqat odatiy
//   holatda tanish.
// Transportir YO'Q (karkas §2.4): burchak to'g'ri burchak bilan solishtiriladi, o'lchanmaydi.
// FactCard: qor parchasining olti o'qi bor — muz panjarasi olti burchakli.
// Bu dars MA'LUMOT fayli: ekranlar va mexanika kitda (`createLesson`).
// ============================================================================
const TOTAL_SCREENS = 15;
const LESSON_META = {
  lessonId: 'grade3-40',
  lessonTitle: { ru: 'Урок 40. Осевая симметрия; градус угла', uz: "40-dars. Simmetriya o'qi va burchak gradusi", en: 'Lesson 40. Axial symmetry; the degree of an angle' }
};
// STRUKTURA: s0 xuk naqsh · s1 buklash · s2 nechta o'q · s3 QOIDA o'q va gradus ·
// s4 chizma bo'yicha o'q · s5 saralash simmetrik yoki yo'q · s6 test burchak turi ·
// s7 konsol o'qlar va gradus · s8 xatoni top (o'q noto'g'ri) · s9 Bit tuzog'i (faqat tik) ·
// s10 trenajyor gradus · s11 trenajyor o'qlar soni · s12 masala vitraj ·
// s13 final + FactCard · s14 yakun.
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
  // s0 — XUK: naqshni buklash.
  s0: {
    eyebrow: { ru: 'Крючок', uz: 'Qiziqtirish', en: 'Hook' },
    topic: { ru: 'Ось симметрии', uz: "Simmetriya o'qi", en: 'The axis of symmetry' },
    lead: { ru: 'Узор на стене города', uz: 'Shahar devoridagi naqsh', en: 'A pattern on the city wall' },
    order_cap: { ru: 'узор сложили пополам', uz: 'naqsh teng ikkiga buklandi', en: 'the pattern was folded in half' },
    plate: ['90', '°', '?'],
    q: { ru: 'Как проверить, что половинки одинаковые?', uz: 'Yarmilar bir xilligini qanday tekshiramiz?', en: 'How can we check that the halves are the same?' },
    opt0: { ru: 'сложить по линии', uz: "chiziq bo'ylab buklash", en: 'fold it along the line' },
    opt1: { ru: 'измерить линейкой', uz: "chizg'ich bilan o'lchash", en: 'measure with a ruler' },
    opt2: { ru: 'посмотреть на глаз', uz: "ko'z bilan qarash", en: 'look at it by eye' },
    opt3: { ru: 'посчитать углы', uz: 'burchaklarni sanash', en: 'count the angles' },
    audio: {
      intro: {
        ru: [
          'Виды фигур ты уже различаешь. Сегодня посмотрим, как фигура складывается.',
          'На стене города узор. Через него проходит линия.',
          'Кажется, что половинки одинаковые, но кажется это ещё не проверка.',
          'Как думаешь, как проверить наверняка?'
        ],
        uz: [
          "Shakl turlarini ajrata olasiz. Bugun shakl qanday buklanishiga qaraymiz.",
          "Shahar devorida naqsh bor. Uning ustidan chiziq o'tgan.",
          "Yarmilar bir xildek tuyuladi, lekin tuyulish hali tekshiruv emas.",
          "Sizningcha, aniq qilib qanday tekshiramiz?"
        ],
        en: ['You can already tell kinds of figures apart. Today we will look at how a figure folds.', 'There is a pattern on the city wall. A line runs through it.', 'It seems the halves are the same, but seeming is not a check.', 'How do you think we can check for certain?']
      },
      on_correct: { ru: 'Верно! Сложили по линии, половинки легли друг на друга. Это и есть проверка.', uz: "To'g'ri! Chiziq bo'ylab bukladik, yarmilar ustma-ust tushdi. Tekshiruv shu.", en: 'Right! We folded along the line and the halves lay on each other. That is the check.' },
      on_wrong1: { ru: 'Линейка измерит длину, но не покажет, совпадут ли половинки.', uz: "Chizg'ich uzunlikni o'lchaydi, lekin yarmilar mos tushishini ko'rsatmaydi.", en: 'A ruler will measure length, but it will not show whether the halves match.' },
      on_wrong2: { ru: 'На глаз легко ошибиться. Нужна проверка построже.', uz: "Ko'z bilan adashish oson. Qattiqroq tekshiruv kerak.", en: 'It is easy to be wrong by eye. A stricter check is needed.' },
      on_idk: { ru: 'Ничего. Сейчас сложим узор и увидим.', uz: "Hechqisi yo'q. Hozir naqshni buklab ko'ramiz.", en: 'Never mind. Let us fold the pattern and see.' }
    }
  },

  // s1 — MODEL: buklash.
  s1: {
    eyebrow: { ru: 'Разбор', uz: 'Tahlil', en: 'Working it out' },
    lead: { ru: 'Складываем фигуру по линии', uz: "Shaklni chiziq bo'ylab buklaymiz", en: 'We fold the figure along the line' },
    task_line: 'линия проходит через середину',
    task_line_uz: "chiziq o'rtadan o'tadi",
    task_line_en: 'the line passes through the middle',
    step1: { ru: 'половинки совпали', uz: 'yarimlar mos keldi', en: 'the halves matched' },
    step1_cap: { ru: 'это ось симметрии', uz: "bu simmetriya o'qi", en: 'this is an axis of symmetry' },
    step2: { ru: 'половинки разошлись', uz: 'yarimlar ajralib ketdi', en: 'the halves came apart' },
    step2_cap: { ru: 'это просто линия', uz: 'bu shunchaki chiziq', en: 'this is just a line' },
    res: { ru: 'проверка складыванием', uz: 'buklab tekshirish', en: 'a check by folding' },
    btn1: { ru: 'Сложить по первой линии', uz: "Birinchi chiziq bo'ylab buklash", en: 'Fold along the first line' },
    btn2: { ru: 'Сложить по второй', uz: "Ikkinchisi bo'ylab buklash", en: 'Fold along the second' },
    done_text: { ru: 'Осью можно назвать только ту линию, по которой половинки легли друг на друга.', uz: "O'q deb faqat yarmilar ustma-ust tushgan chiziqni atash mumkin.", en: 'Only the line along which the halves lay on each other can be called an axis.' },
    audio: {
      ru: [
        'Складываем фигуру по линии и смотрим на половинки.',
        'По первой линии половинки легли точно друг на друга. Такую линию называют осью симметрии.',
        'По второй линии половинки разошлись, хотя она тоже проходит через середину. Значит середина сама по себе ещё ничего не решает.'
      ],
      uz: [
        "Shaklni chiziq bo'ylab buklab, yarmilarga qaraymiz.",
        "Birinchi chiziq bo'ylab yarmilar aniq ustma-ust tushdi. Bunday chiziq simmetriya o'qi deyiladi.",
        "Ikkinchi chiziq bo'ylab yarmilar ajralib ketdi, garchi u ham o'rtadan o'tsa ham. Demak o'rta o'zi hali hech nimani hal qilmaydi."
      ],
      en: ['We fold the figure along the line and look at the halves.', 'Along the first line the halves lay exactly on each other. Such a line is called an axis of symmetry.', 'Along the second line the halves came apart, although it also passes through the middle. So the middle by itself decides nothing.']
    }
  },

  // s2 — MODEL: nechta o'q bo'ladi.
  s2: {
    eyebrow: { ru: 'Разбор', uz: 'Tahlil', en: 'Working it out' },
    w: 4,
    h: 4,
    lead: { ru: 'Осей может быть несколько', uz: "O'q bir nechta bo'lishi mumkin", en: 'There can be several axes' },
    capA: { ru: 'у прямоугольника 2 оси', uz: "to'rtburchakda 2 o'q", en: 'a rectangle has 2 axes' },
    capB: { ru: 'у квадрата 4 оси', uz: 'kvadratda 4 o\'q', en: 'a square has 4 axes' },
    res: { ru: 'считаем все линии сгиба', uz: "hamma buklanish chizig'ini sanaymiz", en: 'we count all the fold lines' },
    btn1: { ru: 'Сложить прямоугольник', uz: "To'rtburchakni buklash", en: 'Fold the rectangle' },
    btn2: { ru: 'Сложить квадрат', uz: 'Kvadratni buklash', en: 'Fold the square' },
    done_text: { ru: 'У квадрата осей больше, потому что стороны у него равны.', uz: "Kvadratda o'q ko'proq, chunki uning tomonlari teng.", en: 'A square has more axes because its sides are equal.' },
    audio: {
      ru: [
        'Посмотрим, сколько осей бывает у фигуры.',
        'Прямоугольник складывается двумя способами, вдоль и поперёк. Значит осей две.',
        'Квадрат складывается ещё и по двум диагоналям, потому что все стороны у него равны. Всего осей четыре.'
      ],
      uz: [
        "Shaklda nechta o'q bo'lishini ko'ramiz.",
        "To'rtburchak ikki xil buklanadi, bo'ylab va ko'ndalang. Demak o'q ikkita.",
        "Kvadrat yana ikkita diagonal bo'ylab ham buklanadi, chunki uning hamma tomoni teng. Jami o'q to'rtta."
      ],
      en: ['Let us see how many axes a figure can have.', 'A rectangle folds two ways, along and across. So it has two axes.', 'A square also folds along its two diagonals, because all its sides are equal. Four axes in all.']
    }
  },

  // s3 — QOIDA: o'q va gradus.
  s3: {
    eyebrow: { ru: 'Правило', uz: 'Qoida', en: 'Rule' },
    q: { ru: 'Чему равен прямой угол?', uz: "To'g'ri burchak nechaga teng?", en: 'What does a right angle equal?' },
    opts: [
      { ru: '90 градусов', uz: '90 gradus', en: '90 degrees' },
      { ru: '100 градусов', uz: '100 gradus', en: '100 degrees' },
      { ru: '45 градусов', uz: '45 gradus', en: '45 degrees' },
      { ru: '180 градусов', uz: '180 gradus', en: '180 degrees' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Круглое число сто тут ни при чём, у прямого угла своя мера.', uz: "Yumaloq yuz soni bu yerda hech nima, to'g'ri burchakning o'z o'lchovi bor.", en: 'The round number one hundred has nothing to do with it, a right angle has its own measure.' },
      2: { ru: 'Сорок пять это половина прямого, такой угол острый.', uz: "Qirq besh bu to'g'rining yarmi, bunday burchak o'tkir.", en: 'Forty five is half a right angle, such an angle is acute.' },
      3: { ru: 'Сто восемьдесят это развёрнутый угол, прямая линия.', uz: "Bir yuz sakson bu yoyiq burchak, to'g'ri chiziq.", en: 'One hundred eighty is a straight angle, a straight line.' }
    },
    on_correct: { ru: 'Верно. Прямой угол это девяносто градусов.', uz: "To'g'ri. To'g'ri burchak bu to'qson gradus.", en: 'Right. A right angle is ninety degrees.' },
    rule_lines: {
      ru: ['ось: сложили и половинки совпали', 'прямой угол 90 градусов', 'острый меньше, тупой больше'],
      uz: ["o'q: bukladik va yarmilar mos tushdi", "to'g'ri burchak 90 gradus", "o'tkir kichik, o'tmas katta"],
      en: ['an axis: we folded and the halves matched', 'a right angle is 90 degrees', 'acute is smaller, obtuse is bigger']
    },
    rule_ex: { ru: 'прямой 90°, острый < 90°, тупой > 90°', uz: "to'g'ri 90°, o'tkir < 90°, o'tmas > 90°", en: 'right 90°, acute < 90°, obtuse > 90°' },
    rule_speech: { ru: 'Осью симметрии называют линию, по которой фигура складывается, и половинки совпадают. Угол меряют в градусах. Прямой угол это девяносто градусов, острый меньше прямого, тупой больше.', uz: "Simmetriya o'qi deb shakl buklanadigan va yarmilari mos tushadigan chiziqqa aytiladi. Burchak gradusda o'lchanadi. To'g'ri burchak to'qson gradus, o'tkir to'g'ridan kichik, o'tmas kattaroq.", en: 'An axis of symmetry is a line along which a figure folds and the halves match. An angle is measured in degrees. A right angle is ninety degrees, an acute one is smaller than a right angle, an obtuse one is bigger.' },
    audio: {
      intro: { ru: 'Соберём правило. Ось мы уже нашли, теперь про углы.', uz: "Qoidani yig'amiz. O'qni topdik, endi burchaklar haqida.", en: 'Let us gather the rule. We have found the axis, now about angles.' }
    }
  },

  // s4 — CHIZMA: o'q qayerda (o'z chizmasi).
  s4: {
    eyebrow: { ru: 'Чертёж', uz: 'Chizma', en: 'The drawing' },
    q: { ru: 'Сколько осей симметрии у этой фигуры?', uz: "Bu shaklda nechta simmetriya o'qi bor?", en: 'How many axes of symmetry does this figure have?' },
    fig_w: 4,
    fig_h: 4,
    opts: [
      { ru: '1', uz: '1', en: '1' },
      { ru: '2', uz: '2', en: '2' },
      { ru: '0', uz: '0', en: '0' },
      { ru: '4', uz: '4', en: '4' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Поперёк половинки не совпадут, верх и низ у фигуры разные.', uz: "Ko'ndalang yarmilar mos tushmaydi, shaklning tepasi va pasti har xil.", en: 'Across the halves will not match, the top and the bottom of the figure are different.' },
      2: { ru: 'Одна линия сгиба всё же есть, посмотри вдоль.', uz: "Bitta buklash chizig'i baribir bor, bo'ylab qarang.", en: 'There is one fold line after all, look along it.' },
      3: { ru: 'Четыре оси бывают у квадрата, а это другая фигура.', uz: "To'rtta o'q kvadratda bo'ladi, bu esa boshqa shakl.", en: 'Four axes belong to a square, and this is a different figure.' }
    },
    audio: {
      intro: { ru: 'Посмотри на чертёж. Мысленно сложи фигуру. Сколько линий сгиба подойдёт?', uz: "Chizmaga qarang. Shaklni xayolan buklang. Nechta buklash chizig'i to'g'ri keladi?", en: 'Look at the drawing. Fold the figure in your mind. How many fold lines will fit?' },
      on_correct: { ru: 'Верно. Одна ось, вдоль фигуры.', uz: "To'g'ri. Bitta o'q, shakl bo'ylab.", en: 'Right. One axis, along the figure.' },
      on_wrong: { ru: 'Проверь каждую линию складыванием, а не на глаз.', uz: "Har bir chiziqni ko'z bilan emas, buklab tekshiring.", en: 'Check each line by folding, not by eye.' }
    }
  },

  // s5 — SARALASH: burchaklar.
  s5: {
    eyebrow: { ru: 'Сортировка', uz: 'Saralash', en: 'Sorting' },
    lead: { ru: 'Разложи углы по видам', uz: 'Burchaklarni turlariga ajrating', en: 'Sort the angles by kind' },
    bin_a: { ru: 'меньше прямого', uz: "to'g'ridan kichik", en: 'smaller than a right angle' },
    bin_b: { ru: 'больше прямого', uz: "to'g'ridan katta", en: 'bigger than a right angle' },
    items: [
      { n: { ru: 'угол в 30 градусов', uz: '30 gradusli burchak', en: 'an angle of 30 degrees' }, a: true, hint: { ru: 'Тридцать меньше девяноста.', uz: "O'ttiz to'qsondan kichik.", en: 'Thirty is smaller than ninety.' } },
      { n: { ru: 'угол в 120 градусов', uz: '120 gradusli burchak', en: 'an angle of 120 degrees' }, a: false, hint: { ru: 'Сто двадцать больше девяноста.', uz: "Bir yuz yigirma to'qsondan katta.", en: 'One hundred twenty is bigger than ninety.' } },
      { n: { ru: 'острый угол', uz: "o'tkir burchak", en: 'an acute angle' }, a: true, hint: { ru: 'Острый это и значит меньше прямого.', uz: "O'tkir bu to'g'ridan kichik degani.", en: 'Acute means exactly smaller than a right angle.' } },
      { n: { ru: 'тупой угол', uz: "o'tmas burchak", en: 'an obtuse angle' }, a: false, hint: { ru: 'Тупой это больше прямого.', uz: "O'tmas bu to'g'ridan katta.", en: 'Obtuse means bigger than a right angle.' } }
    ],
    audio: {
      intro: { ru: 'Четыре угла. Отправь каждый в свою корзину, сравнивая с прямым.', uz: "To'rtta burchak. Har birini to'g'ri burchak bilan solishtirib, o'z savatiga yuboring.", en: 'Four angles. Send each one to its basket, comparing with a right angle.' },
      on_correct: { ru: 'Всё на месте. Прямой угол это граница между острым и тупым.', uz: "Hammasi joyida. To'g'ri burchak o'tkir va o'tmas orasidagi chegara.", en: 'All in place. A right angle is the border between acute and obtuse.' },
      on_wrong: { ru: 'Сравни этот угол с прямым, с девяноста градусами.', uz: "Bu burchakni to'g'ri burchak bilan, to'qson gradus bilan solishtiring.", en: 'Compare this angle with a right angle, with ninety degrees.' }
    }
  },

  // s6 — TEST: burchak turi holatga bog'liq emas (M4).
  s6: {
    eyebrow: { ru: 'Проверка', uz: 'Tekshiruv', en: 'Checking' },
    q: { ru: 'Прямой угол наклонили. Каким он стал?', uz: "To'g'ri burchak qiyshaytirildi. U qanday bo'ldi?", en: 'A right angle was tilted. What did it become?' },
    opts: [
      { ru: 'остался прямым', uz: "to'g'riligicha qoldi", en: 'it stayed right' },
      { ru: 'стал острым', uz: "o'tkir bo'ldi", en: 'it became acute' },
      { ru: 'стал тупым', uz: "o'tmas bo'ldi", en: 'it became obtuse' },
      { ru: 'перестал быть углом', uz: 'burchak bo\'lmay qoldi', en: 'it stopped being an angle' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Наклон не сужает угол, стороны разошлись так же.', uz: "Qiyshaytirish burchakni torraytirmaydi, tomonlar o'shanday ajralgan.", en: 'Tilting does not narrow an angle, the sides opened just the same.' },
      2: { ru: 'И не расширяет. Мера угла осталась прежней.', uz: "Kengaytirmaydi ham. Burchak o'lchovi o'sha bo'lib qoldi.", en: 'And it does not widen it. The measure of the angle stayed the same.' },
      3: { ru: 'Две стороны и вершина на месте, угол никуда не делся.', uz: "Ikki tomon va uchi joyida, burchak yo'qolmadi.", en: 'Two sides and a vertex are in place, the angle has not gone anywhere.' }
    },
    audio: {
      intro: { ru: 'Быстрый вопрос. Прямой угол наклонили набок. Каким он стал?', uz: "Tez savol. To'g'ri burchak yonboshiga qiyshaytirildi. U qanday bo'ldi?", en: 'A quick question. A right angle was tilted on its side. What did it become?' },
      on_correct: { ru: 'Верно. Вид угла не зависит от того, как он повёрнут.', uz: "To'g'ri. Burchak turi u qanday burilganiga bog'liq emas.", en: 'Right. The kind of an angle does not depend on how it is turned.' },
      on_wrong: { ru: 'Мера угла это раствор между сторонами, а не его положение.', uz: "Burchak o'lchovi tomonlar orasidagi ochiqlik, uning holati emas.", en: 'The measure of an angle is the opening between the sides, not its position.' }
    }
  },

  // s7 — KONSOL: o'qlar va gradus.
  s7: {
    eyebrow: { ru: 'Консоль', uz: 'Konsol', en: 'Console' },
    lead: { ru: 'Заполни консоль по фигурам', uz: "Shakllar bo'yicha konsolni to'ldiring", en: 'Fill the console by the figures' },
    swap_line: { ru: 'квадрат и прямоугольник', uz: "kvadrat va to'rtburchak", en: 'a square and a rectangle' },
    cells: [
      { head: { ru: 'осей у квадрата', uz: "kvadratda o'q", en: 'axes of a square' }, label: { ru: 'штук', uz: 'dona', en: 'pieces' }, ans: 4, hint: { ru: 'Вдоль, поперёк и две диагонали.', uz: "Bo'ylab, ko'ndalang va ikkita diagonal.", en: 'Along, across and two diagonals.' } },
      { head: { ru: 'осей у прямоугольника', uz: "to'rtburchakda o'q", en: 'axes of a rectangle' }, label: { ru: 'штук', uz: 'dona', en: 'pieces' }, ans: 2, hint: { ru: 'По диагонали половинки не совпадут.', uz: "Diagonal bo'ylab yarmilar mos tushmaydi.", en: 'Along a diagonal the halves will not match.' } },
      { head: { ru: 'прямой угол', uz: "to'g'ri burchak", en: 'a right angle' }, label: { ru: 'градусов', uz: 'daraja', en: 'degrees' }, ans: 90, hint: { ru: 'Это мера прямого угла.', uz: "Bu to'g'ri burchakning o'lchovi.", en: 'That is the measure of a right angle.' } }
    ],
    check: { ru: '4 оси, 2 оси, 90°', uz: "4 o'q, 2 o'q, 90°", en: '4 axes, 2 axes, 90°' },
    check_label: { ru: 'фигуры и углы', uz: 'shakllar va burchaklar', en: 'figures and angles' },
    audio: {
      intro: { ru: 'Заполни три окна. Оси квадрата, оси прямоугольника и мера прямого угла.', uz: "Uchta oynani to'ldiring. Kvadrat o'qlari, to'rtburchak o'qlari va to'g'ri burchak o'lchovi.", en: 'Fill three windows. The axes of a square, the axes of a rectangle and the measure of a right angle.' },
      on_correct: { ru: 'Четыре оси, две оси и девяносто градусов.', uz: "To'rtta o'q, ikkita o'q va to'qson gradus.", en: 'Four axes, two axes and ninety degrees.' }
    }
  },

  // s8 — XATONI TOP: o'q noto'g'ri o'tkazilgan (M1).
  s8: {
    eyebrow: { ru: 'Найди ошибку', uz: 'Xatoni toping', en: 'Find the mistake' },
    q: { ru: 'Линию провели через середину и назвали осью. Где ошибка?', uz: "Chiziq o'rtadan o'tkazilib, o'q deyilibdi. Xato qayerda?", en: 'A line was drawn through the middle and called an axis. Where is the mistake?' },
    fig_line: { ru: 'половинки не совпали', uz: 'yarimlar mos kelmadi', en: 'the halves did not match' },
    opts: [
      { ru: 'при сгибе половинки не совпадают', uz: 'buklanganda yarmilar mos tushmaydi', en: 'when folded the halves do not match' },
      { ru: 'ошибки нет', uz: "xato yo'q", en: 'there is no mistake' },
      { ru: 'линия не через середину', uz: "chiziq o'rtadan o'tmagan", en: 'the line is not through the middle' },
      { ru: 'у фигуры нет осей', uz: "shaklda o'q yo'q", en: 'the figure has no axes' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Согни мысленно и посмотри, лягут ли половинки друг на друга.', uz: "Xayolan buklab, yarmilar ustma-ust tushishini ko'ring.", en: 'Fold it in your mind and see whether the halves lie on each other.' },
      2: { ru: 'Через середину линия прошла, но этого мало.', uz: "Chiziq o'rtadan o'tgan, lekin bu kam.", en: 'The line did pass through the middle, but that is not enough.' },
      3: { ru: 'Оси у фигуры есть, просто эта линия не из них.', uz: "Shaklda o'q bor, faqat bu chiziq ulardan emas.", en: 'The figure does have axes, this line is simply not one of them.' }
    },
    audio: {
      intro: { ru: 'Кто-то провёл линию через середину и решил, что нашёл ось. Найди ошибку.', uz: "Kimdir o'rtadan chiziq o'tkazib, o'q topdim deb o'ylabdi. Xatoni toping.", en: 'Someone drew a line through the middle and decided they had found an axis. Find the mistake.' },
      on_correct: { ru: 'Верно. Ось это не любая линия через середину, а та, по которой половинки совпадают.', uz: "To'g'ri. O'q bu o'rtadan o'tgan har qanday chiziq emas, balki yarmilar mos tushadigani.", en: 'Right. An axis is not just any line through the middle, but the one along which the halves match.' },
      on_wrong: { ru: 'Проверь складыванием, а не по положению линии.', uz: "Chiziq holatiga emas, buklashga qarab tekshiring.", en: 'Check by folding, not by the position of the line.' }
    }
  },

  // s9 — BIT TUZOG'I: o'q faqat tik (M2).
  s9: {
    eyebrow: { ru: 'Ловушка Бита', uz: "Bit tuzog'i", en: "Bit's trap" },
    lead: { ru: 'Бит ищет ось у листа узора', uz: "Bit naqsh varag'ida o'q izlayapti", en: 'Bit is looking for an axis on a sheet of pattern' },
    lines: ['фигура сложилась поперёк', 'Бит: ось бывает только сверху вниз'],
    lines_uz: ["shakl ko'ndalang buklandi", "Bit: o'q faqat yuqoridan pastga bo'ladi"],
    lines_en: ['the figure folded across', 'Bit: an axis only runs top to bottom'],
    line_cap: { ru: 'Бит: горизонтальная линия осью не считается', uz: "Bit: yotiq chiziq o'q hisoblanmaydi", en: 'Bit: a horizontal line does not count as an axis' },
    trap_label: { ru: 'Так ли это?', uz: 'Shundaymi?', en: 'Is that so?' },
    trap_opts: { ru: ['нет, ось может идти как угодно', 'да, ось всегда сверху вниз'], uz: ["yo'q, o'q istalgan yo'nalishda bo'ladi", "ha, o'q har doim yuqoridan pastga"], en: ['no, an axis can run any way', 'yes, an axis is always top to bottom'] },
    trap_ci: 0,
    trap_correct: { ru: 'Да. Ось это линия сгиба, а сгибать можно и поперёк, и по диагонали. У квадрата, например, осей четыре, и только две из них идут сверху вниз и слева направо.', uz: "Ha. O'q bu buklash chizig'i, buklash esa ko'ndalang ham, diagonal bo'ylab ham bo'ladi. Masalan, kvadratda to'rtta o'q bor va ulardan faqat ikkitasi yuqoridan pastga va chapdan o'ngga ketadi.", en: 'Yes. An axis is a fold line, and you can fold across and along a diagonal too. A square, for example, has four axes, and only two of them run top to bottom and left to right.' },
    trap_wrong: { ru: 'Поверни лист на бок. Та же линия станет вертикальной, а фигура не изменилась.', uz: "Varaqni yonboshiga buring. O'sha chiziq tik bo'lib qoladi, shakl esa o'zgarmadi.", en: 'Turn the sheet on its side. The same line becomes vertical, and the figure has not changed.' },
    audio: {
      ru: [
        'Бит ищет ось у листа узора.',
        'Фигура сложилась поперёк, но это не считается. Ось бывает только сверху вниз.',
        'Так ли это?'
      ],
      uz: [
        "Bit naqsh varag'ida o'q izlayapti.",
        "Shakl ko'ndalang buklandi, lekin bu hisoblanmaydi. O'q faqat yuqoridan pastga bo'ladi.",
        "Shundaymi?"
      ],
      en: ['Bit is looking for an axis on a sheet of pattern.', 'The figure folded across, but that does not count. An axis only runs top to bottom.', 'Is that so?']
    }
  },

  // s10 — TRENAJYOR: gradus.
  s10: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq', en: 'Trainer' },
    q: { ru: 'Сколько градусов в прямом угле?', uz: "To'g'ri burchakda necha gradus bor?", en: 'How many degrees are in a right angle?' },
    ans: 90,
    check: '90°',
    check_label: { ru: 'мера прямого угла', uz: "to'g'ri burchak o'lchovi", en: 'the measure of a right angle' },
    hint: { ru: 'Это та самая мера, с которой сравнивают острый и тупой.', uz: "Bu o'tkir va o'tmas solishtiriladigan o'sha o'lchov.", en: 'That is the very measure that acute and obtuse are compared with.' },
    audio: {
      intro: { ru: 'Теперь отвечай сам. Сколько градусов в прямом угле?', uz: "Endi o'zingiz javob bering. To'g'ri burchakda necha gradus bor?", en: 'Now answer on your own. How many degrees are in a right angle?' },
      on_correct: { ru: 'Девяносто градусов.', uz: "To'qson gradus.", en: 'Ninety degrees.' }
    }
  },

  // s11 — TRENAJYOR: o'qlar soni.
  s11: {
    eyebrow: { ru: 'Тренажёр', uz: 'Mashq', en: 'Trainer' },
    q: { ru: 'Сколько осей симметрии у квадрата?', uz: "Kvadratda nechta simmetriya o'qi bor?", en: 'How many axes of symmetry does a square have?' },
    ans: 4,
    check: '2 + 2',
    check_label: { ru: 'стороны и диагонали', uz: 'tomonlar va diagonallar', en: 'sides and diagonals' },
    hint: { ru: 'Две линии по серединам сторон и две по диагоналям.', uz: "Ikkitasi tomonlar o'rtasidan, ikkitasi diagonal bo'ylab.", en: 'Two lines through the middles of the sides and two along the diagonals.' },
    audio: {
      intro: { ru: 'И ещё вопрос. Сколько осей симметрии у квадрата?', uz: "Yana savol. Kvadratda nechta simmetriya o'qi bor?", en: 'And one more question. How many axes of symmetry does a square have?' },
      on_correct: { ru: 'Четыре. Две по серединам сторон и две по диагоналям.', uz: "To'rtta. Ikkitasi tomonlar o'rtasidan, ikkitasi diagonal bo'ylab.", en: 'Four. Two through the middles of the sides and two along the diagonals.' }
    }
  },

  // s12 — MASALA: vitraj.
  s12: {
    eyebrow: { ru: 'Задача', uz: 'Masala', en: 'Word problem' },
    lead: { ru: 'Витраж кристального зала', uz: 'Kristall zal vitraji', en: 'The stained glass of the crystal hall' },
    q: { ru: 'Рама витража прямоугольная, внутри квадратная вставка. Сколько осей у рамы и на сколько больше у вставки?', uz: "Vitraj ramasi to'rtburchak, ichida kvadrat qo'shimcha. Ramada nechta o'q bor va qo'shimchada nechtaga ko'p?", en: 'The stained glass frame is rectangular, with a square insert inside. How many axes does the frame have and how many more does the insert have?' },
    q_speech: { ru: 'рама витража прямоугольная, внутри квадратная вставка. Сколько осей у рамы и на сколько больше их у вставки?', uz: "vitraj ramasi to'rtburchak, ichida kvadrat qo'shimcha. Ramada nechta o'q bor va qo'shimchada nechtaga ko'p?", en: 'the stained glass frame is rectangular, with a square insert inside. How many axes does the frame have and how many more does the insert have?' },
    tbl_heads: [
      { ru: 'рама', uz: 'rama', en: 'the frame' },
      { ru: 'вставка', uz: "qo'shimcha", en: 'the insert' },
      { ru: 'вопрос', uz: 'savol', en: 'question' }
    ],
    tbl_cells: [{ ru: 'прямоугольник', uz: "to'rtburchak", en: 'rectangle' }, { ru: 'квадрат', uz: 'kvadrat', en: 'square' }, '?'],
    pick_label: { ru: 'С чего начинаем?', uz: 'Nimadan boshlaymiz?', en: 'Where do we start?' },
    opts: [
      { ru: 'найти оси рамы', uz: "rama o'qlarini topish", en: 'find the axes of the frame' },
      { ru: 'измерить стороны', uz: "tomonlarni o'lchash", en: 'measure the sides' },
      { ru: 'посчитать углы', uz: 'burchaklarni sanash', en: 'count the angles' },
      { ru: 'найти площадь', uz: 'yuzani topish', en: 'find the area' }
    ],
    ci: 0,
    hints: {
      1: { ru: 'Длины сторон тут не спрашивают.', uz: "Bu yerda tomonlar uzunligi so'ralmagan.", en: 'The lengths of the sides are not asked about here.' },
      2: { ru: 'Углов у обеих фигур поровну, это не поможет.', uz: "Ikkala shaklda burchak teng, bu yordam bermaydi.", en: 'Both figures have the same number of angles, that will not help.' },
      3: { ru: 'Площадь тут ни при чём, спрашивают про оси.', uz: "Yuza bu yerda hech nima, o'qlar so'ralgan.", en: 'Area has nothing to do with it, the question is about axes.' }
    },
    pick_ok: { ru: 'Верно. Сначала рама, потом сравним со вставкой.', uz: "To'g'ri. Avval rama, keyin qo'shimcha bilan solishtiramiz.", en: 'Right. First the frame, then we compare with the insert.' },
    step1_q: { ru: 'Сколько осей симметрии у рамы?', uz: "Ramada nechta simmetriya o'qi bor?", en: 'How many axes of symmetry does the frame have?' },
    ans1: 2,
    hint1: { ru: 'Прямоугольник складывается вдоль и поперёк.', uz: "To'rtburchak bo'ylab va ko'ndalang buklanadi.", en: 'A rectangle folds along and across.' },
    step2_q: { ru: 'На сколько осей больше у вставки?', uz: "Qo'shimchada nechta o'q ko'p?", en: 'How many more axes does the insert have?' },
    ans2: 2,
    hint2: { ru: 'У квадрата их четыре, у рамы две.', uz: "Kvadratda to'rtta, ramada ikkita.", en: 'A square has four, the frame has two.' },
    check: { ru: 'рама 2, вставка 4', uz: "ramka 2, qo'shimcha 4", en: 'frame 2, insert 4' },
    setup_audio: { ru: 'Витраж собирают из двух фигур. Посмотри на таблицу и реши, с чего начать.', uz: "Vitraj ikki shakldan yig'ilyapti. Jadvalga qarang va nimadan boshlashni hal qiling.", en: 'The stained glass is made of two figures. Look at the table and decide where to start.' },
    audio: {
      intro: { ru: 'Рама витража прямоугольная, вставка квадратная. Сколько осей у рамы и на сколько больше у вставки?', uz: "Vitraj ramasi to'rtburchak, qo'shimchasi kvadrat. Ramada nechta o'q va qo'shimchada nechtaga ko'p?", en: 'The stained glass frame is rectangular, the insert is square. How many axes does the frame have and how many more does the insert have?' },
      on_correct: { ru: 'У рамы две оси, у вставки четыре, значит больше на две. Равные стороны дают фигуре больше осей.', uz: "Ramada ikkita o'q, qo'shimchada to'rtta, demak ikkitaga ko'p. Teng tomonlar shaklga ko'proq o'q beradi.", en: 'The frame has two axes, the insert has four, so two more. Equal sides give a figure more axes.' },
      on_wrong: { ru: 'Сложи каждую фигуру мысленно и посчитай линии сгиба.', uz: "Har bir shaklni xayolan buklab, buklash chiziqlarini sanang.", en: 'Fold each figure in your mind and count the fold lines.' }
    }
  },

  // s13 — FINAL: uchta topshiriq + FaktCard.
  s13: {
    eyebrow: { ru: 'Финал', uz: 'Yakuniy', en: 'Final' },
    intro_line: { ru: 'Три задания. Проверяй складыванием', uz: 'Uchta topshiriq. Buklab tekshiring', en: 'Three tasks. Check by folding' },
    items: [
      {
        kind: 'num',
        q: { ru: 'Сколько осей симметрии у равностороннего треугольника?', uz: "Teng tomonli uchburchakda nechta simmetriya o'qi bor?", en: 'How many axes of symmetry does an equilateral triangle have?' },
        q_speech: { ru: 'сколько осей симметрии у равностороннего треугольника?', uz: "teng tomonli uchburchakda nechta simmetriya o'qi bor?", en: 'how many axes of symmetry does an equilateral triangle have?' },
        ans: 3,
        hint: { ru: 'Одна ось идёт от каждой вершины к середине противоположной стороны.', uz: "Har bir uchdan qarama-qarshi tomon o'rtasiga bitta o'q boradi.", en: 'One axis runs from each vertex to the middle of the opposite side.' }
      },
      {
        kind: 'num',
        q: { ru: 'Угол в 70 градусов сравнили с прямым. На сколько градусов он меньше?', uz: "70 gradusli burchak to'g'ri burchak bilan solishtirildi. U necha gradus kichik?", en: 'An angle of 70 degrees was compared with a right angle. How many degrees smaller is it?' },
        q_speech: { ru: 'угол в семьдесят градусов сравнили с прямым. На сколько градусов он меньше?', uz: "yetmish gradusli burchak to'g'ri burchak bilan solishtirildi. U necha gradus kichik?", en: 'an angle of seventy degrees was compared with a right angle. How many degrees smaller is it?' },
        ans: 20,
        hint: { ru: 'Из девяноста вычти семьдесят.', uz: "To'qsondan yetmishni ayiring.", en: 'Take seventy away from ninety.' }
      },
      {
        kind: 'num',
        q: { ru: 'Сколько осей симметрии у прямоугольника, у которого стороны разные?', uz: "Tomonlari har xil to'rtburchakda nechta simmetriya o'qi bor?", en: 'How many axes of symmetry does a rectangle with different sides have?' },
        q_speech: { ru: 'сколько осей симметрии у прямоугольника, у которого стороны разные?', uz: "tomonlari har xil to'rtburchakda nechta simmetriya o'qi bor?", en: 'how many axes of symmetry does a rectangle with different sides have?' },
        ans: 2,
        hint: { ru: 'По диагонали половинки не совпадут.', uz: "Diagonal bo'ylab yarmilar mos tushmaydi.", en: 'Along a diagonal the halves will not match.' }
      }
    ],
    fact_badge: { ru: 'Знаешь ли ты?', uz: 'Bilasizmi?', en: 'Which line is wrong?' },
    fact_text: {
      ru: 'У снежинки шесть осей симметрии, и это не украшение. При замерзании молекулы воды выстраиваются в шестиугольную решётку, и кристалл растёт одинаково во все шесть сторон. Поэтому снежинки такие разные на вид и такие одинаковые по устройству.',
      uz: "Qor parchasida oltita simmetriya o'qi bor va bu bezak emas. Muzlaganda suv molekulalari olti burchakli panjaraga tizilib, kristall oltala tomonga bir xil o'sadi. Shuning uchun qor parchalari ko'rinishdan shunchalik har xil, tuzilishi bo'yicha esa bir xil.",
      en: 'A snowflake has six axes of symmetry, and that is not decoration. As water freezes its molecules line up in a hexagonal lattice, and the crystal grows the same way in all six directions. That is why snowflakes look so different and are built so alike.'
    },
    fact_audio: {
      ru: 'Вот что интересно. У снежинки шесть осей симметрии, и это не случайное украшение. Когда вода замерзает, её молекулы выстраиваются в шестиугольную решётку. Кристалл растёт от центра одинаково во все шесть сторон, поэтому лучи получаются похожими. Двух одинаковых снежинок не найти, ведь каждая летела своим путём, но шесть осей есть у каждой.',
      uz: "Mana qizig'i. Qor parchasida oltita simmetriya o'qi bor va bu tasodifiy bezak emas. Suv muzlaganda uning molekulalari olti burchakli panjaraga tiziladi. Kristall markazdan oltala tomonga bir xil o'sadi, shuning uchun nurlar bir-biriga o'xshash chiqadi. Bir xil ikkita qor parchasini topib bo'lmaydi, chunki har biri o'z yo'li bilan uchgan, lekin oltita o'q har birida bor.",
      en: 'Here is something interesting. A snowflake has six axes of symmetry, and that is not a chance decoration. When water freezes, its molecules line up in a hexagonal lattice. The crystal grows from the centre the same way in all six directions, so the arms come out alike. You will not find two identical snowflakes, because each one flew its own path, but every one of them has six axes.'
    },
    audio: {
      intro: { ru: 'Три задания напоследок. Мысленно складывай фигуру и сравнивай угол с прямым.', uz: "Oxirida uchta topshiriq. Shaklni xayolan buklang va burchakni to'g'ri burchak bilan solishtiring.", en: 'Three tasks at the end. Fold the figure in your mind and compare the angle with a right angle.' },
      on_correct: { ru: 'Верно.', uz: "To'g'ri.", en: 'Correct.' },
      on_wrong: { ru: 'Проверяй сгибом, а не на глаз.', uz: "Ko'z bilan emas, buklab tekshiring.", en: 'Check by folding, not by eye.' }
    }
  },

  // s14 — YAKUN: keyingisi fazoviy shakllar (reja 45-satr).
  s14: {
    eyebrow: { ru: 'Итог', uz: 'Yakun', en: 'Result' },
    mission_done: { ru: 'Узор сложен!', uz: 'Naqsh buklandi!', en: 'The pattern is folded!' },
    cando: {
      ru: ['проверяю ось складыванием', 'считаю оси у фигуры', 'сравниваю угол с прямым'],
      uz: ["o'qni buklab tekshiraman", "shaklning o'qlarini sanayman", "burchakni to'g'ri burchak bilan solishtiraman"],
      en: ['I check an axis by folding', 'I count the axes of a figure', 'I compare an angle with a right angle']
    },
    rule_recap: { ru: 'Ось это линия, по которой половинки совпадают. Прямой угол это 90 градусов.', uz: "O'q bu yarmilar mos tushadigan chiziq. To'g'ri burchak 90 gradus.", en: 'An axis is a line along which the halves match. A right angle is 90 degrees.' },
    conn_label_refs: { ru: 'опирается на', uz: 'nimaga tayanadi', en: 'builds on' },
    conn_refs: { ru: 'урок 39: виды треугольников; урок 26: доли и половина', uz: "39-dars: uchburchak turlari; 26-dars: ulush va yarim", en: 'lesson 39: kinds of triangles; lesson 26: fractions and a half' },
    conn_label_next: { ru: 'дальше', uz: 'keyin', en: 'next' },
    conn_next: { ru: 'пространственные фигуры: пирамида и конус', uz: 'fazoviy shakllar: piramida va konus', en: 'solid figures: the pyramid and the cone' },
    audio: {
      ru: 'Узор сложен. Запомни главное. Осью симметрии называют не любую линию через середину, а только ту, по которой половинки лягут друг на друга. Проверяют это складыванием, а не на глаз. Ось может идти сверху вниз, поперёк и по диагонали, поэтому у квадрата их четыре, а у прямоугольника всего две. Угол меряют в градусах, прямой угол это девяносто, острый меньше, тупой больше, и поворот угла ничего в нём не меняет. В следующий раз выйдем с плоскости и возьмём фигуры, у которых есть высота!',
      uz: "Naqsh buklandi. Asosiysini eslab qoling. Simmetriya o'qi deb o'rtadan o'tgan har qanday chiziqqa emas, faqat yarmilar ustma-ust tushadiganiga aytiladi. Buni ko'z bilan emas, buklab tekshiriladi. O'q yuqoridan pastga ham, ko'ndalang ham, diagonal bo'ylab ham ketishi mumkin, shuning uchun kvadratda ular to'rtta, to'rtburchakda esa atigi ikkita. Burchak gradusda o'lchanadi, to'g'ri burchak to'qson, o'tkir kichik, o'tmas katta, burchakni burish esa unda hech nimani o'zgartirmaydi. Keyingi safar tekislikdan chiqib, balandligi bor shakllarni olamiz!",
      en: 'The pattern is folded. Remember the main thing. An axis of symmetry is not just any line through the middle, but only the one along which the halves lie on each other. This is checked by folding, not by eye. An axis can run top to bottom, across and along a diagonal, so a square has four and a rectangle only two. An angle is measured in degrees, a right angle is ninety, an acute one is smaller, an obtuse one is bigger, and turning an angle changes nothing in it. Next time we will leave the flat sheet and take figures that have height!'
    }
  }
};

const BRIDGES = {
  s1:  { ru: 'Сложим фигуру.', uz: 'Shaklni buklaymiz.', en: 'Let us fold the figure.' },
  s2:  { ru: 'Посчитаем оси.', uz: "O'qlarni sanaymiz.", en: 'Let us count the axes.' },
  s3:  { ru: "Соберём это в правило.", uz: "Buni qoidaga yig'amiz.", en: 'Let us gather this into a rule.' },
  s4:  { ru: 'Прочитай чертёж.', uz: "Chizmani o'qing.", en: 'Read the drawing.' },
  s5:  { ru: 'Разложи углы.', uz: 'Burchaklarni ajrating.', en: 'Sort the angles.' },
  s6:  { ru: 'Быстрый вопрос.', uz: 'Tez savol.', en: 'A quick question.' },
  s7:  { ru: 'Заполни консоль.', uz: "Konsolni to'ldiring.", en: 'Fill the console.' },
  s8:  { ru: 'Тут ось провели наспех.', uz: "Bu yerda o'q shoshib o'tkazilibdi.", en: 'Here an axis was drawn in a hurry.' },
  s9:  { ru: 'А вот и Бит со своим правилом.', uz: "Mana Bit ham o'z qoidasi bilan.", en: 'And here is Bit with his rule.' },
  s10: { ru: 'Теперь отвечай сам.', uz: "Endi o'zingiz javob bering.", en: 'Now answer on your own.' },
  s11: { ru: 'И ещё одна фигура.', uz: 'Yana bitta shakl.', en: 'And one more figure.' },
  s12: { ru: 'Задача от мастеров витража.', uz: 'Vitraj ustalaridan masala.', en: 'A task from the stained glass makers.' },
  s13: { ru: 'Финальная проверка.', uz: 'Yakuniy tekshiruv.', en: 'The final check.' },
  s14: { ru: 'Подведём итог.', uz: 'Yakun yasaymiz.', en: 'Let us sum up.' }
};

const S14_PAYOFF = {
  ru: 'Узор сложен. Ось проверяется сгибом, а угол сравнением с прямым.',
  uz: "Naqsh buklandi. O'q buklab, burchak esa to'g'ri burchak bilan tekshiriladi.",
  en: 'The pattern is folded. An axis is checked by folding, and an angle by comparing with a right one.'
};

// --- ZAL TAXTASI (D40): markazda simmetrik naqsh va uning o'qi, yonida to'g'ri burchak belgisi.
const SymmetryNodeLayer = () => {
  const lang = useLang();
  return (
  <svg className="lm-scene-bg" viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <path d="M150 158 h100 l8 18 h-116 Z" fill="#B49A6E"/>
    <rect x={HALL_SLAB.x} y={HALL_SLAB.y} width={HALL_SLAB.w} height={HALL_SLAB.h} rx="5" fill="#E4D3AC" stroke="#8A7550" strokeWidth="2"/>
    <rect x="130" y="99" width="140" height="11" rx="2" fill="#C6AE7E"/>
    <text x="200" y="107.5" textAnchor="middle" fontSize="7" letterSpacing="2" fill="#6B5636" fontFamily="'JetBrains Mono', monospace">{tri(lang, 'УЗОР', 'NAQSH', 'THE PATTERN')}</text>
    <g transform="translate(200 136)">
      {[-1, 1].map((s) => (
        <g key={s} transform={`scale(${s} 1)`}>
          <path d="M4 -18 L26 -6 L26 12 L4 22 Z" fill="#DCEBF5" stroke="#7FA8BF" strokeWidth="1.2"/>
          <path d="M8 -8 L20 -2 L20 8 L8 12 Z" fill="#FFD98A" stroke="#C06A2E" strokeWidth="1"/>
        </g>
      ))}
      <line x1="0" y1="-26" x2="0" y2="30" stroke="#C06A2E" strokeWidth="2" strokeDasharray="5 4"/>
    </g>
    {/* chap artefakt: buklangan varaq */}
    <g transform="translate(88 158)">
      <rect x="-22" y="6" width="44" height="14" rx="3" fill="#B49A6E" stroke="#8A7550" strokeWidth="1"/>
      <path d="M-16 -16 h32 v18 h-32 Z" fill="#F7F1E4" stroke="#8A7550" strokeWidth="1.2"/>
      <line x1="0" y1="-16" x2="0" y2="2" stroke="#C06A2E" strokeWidth="1.8" strokeDasharray="3 3"/>
      <text x="0" y="-20" textAnchor="middle" fontSize="5" fill="#6B5636" fontFamily="'JetBrains Mono', monospace">{tri(lang, 'СГИБ', 'BUKLASH', 'THE FOLD')}</text>
    </g>
    {/* o'ng artefakt: to'g'ri burchak toshda */}
    <g transform="translate(300 108)">
      <rect x="0" y="0" width="34" height="34" rx="3" fill="#E4D3AC" stroke="#8A7550" strokeWidth="1"/>
      <path d="M8 26 L8 8 L26 8" fill="none" stroke="#C06A2E" strokeWidth="2.4"/>
      <text x="17" y="22" textAnchor="middle" fontSize="7" fontWeight="800" fill="#5A4A2E" fontFamily="'JetBrains Mono', monospace">90</text>
    </g>
    <circle className="lm-glow" cx="300" cy="92" r="2.4" fill="#BFF0C8"/>
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
      <AncientHallBg fill/>
      <SymmetryNodeLayer/>
      <div className="lm-scene-cast">
        {LUMO_CAST.slice(0, 2).map(kid)}
        <span className={`lm-crew lm-crew-host ${gathered ? 'd2-bit-cheer' : 'lm-bob'}`}><span className="g1-cast-fig"><BitSVG state={gathered ? 'happy' : 'present'}/></span></span>
        {LUMO_CAST.slice(2).map((c, i) => kid(c, i + 2))}
      </div>
    </div>
  );
};

// --- EKRAN CHIZMASI (s4): bitta o'qi bor shakl — uy tomonli beshburchak.
const OneAxisFig = () => (
  <svg viewBox="0 0 200 130" style={{ width: 'min(240px, 78%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <path d="M100 14 L154 56 L154 112 L46 112 L46 56 Z" fill="#F7F1E4" stroke="#8A7550" strokeWidth="2.4" strokeLinejoin="round"/>
    <line x1="100" y1="8" x2="100" y2="120" stroke="#C06A2E" strokeWidth="2" strokeDasharray="6 4"/>
    <line x1="40" y1="84" x2="160" y2="84" stroke="#7FA8BF" strokeWidth="2" strokeDasharray="6 4"/>
    <text x="100" y="128" textAnchor="middle" fontSize="9" fill="#8A7550" fontFamily="'JetBrains Mono', monospace">?</text>
  </svg>
);

// --- EKRAN CHIZMASI (s8): o'rtadan o'tgan, lekin o'q BO'LMAGAN chiziq.
const FalseAxisFig = () => (
  <svg viewBox="0 0 220 120" style={{ width: 'min(260px, 82%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <path d="M28 96 L28 34 L92 20 L92 96 Z" fill="#F7F1E4" stroke="#8A7550" strokeWidth="2.4" strokeLinejoin="round"/>
    <line x1="60" y1="14" x2="60" y2="104" stroke="#C06A2E" strokeWidth="2" strokeDasharray="6 4"/>
    <path d="M120 58 h20 m-6 -6 l6 6 l-6 6" fill="none" stroke="#8A7550" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <g transform="translate(160 20)">
      <path d="M0 76 L0 14 L32 0 L32 76 Z" fill="#FDF3E0" stroke="#8A7550" strokeWidth="2" strokeLinejoin="round" opacity="0.55"/>
      <path d="M0 76 L0 14 L-32 0 L-32 76 Z" fill="none" stroke="#C06A2E" strokeWidth="2" strokeDasharray="4 3"/>
    </g>
  </svg>
);

// --- FACTCARD QAHRAMONI: qor parchasi va uning olti o'qi.
const SnowflakeFig = () => (
  <svg viewBox="0 0 220 104" style={{ width: 'min(266px, 84%)', height: 'auto', display: 'block' }} aria-hidden="true">
    <g transform="translate(110 52)">
      {[0, 30, 60, 90, 120, 150].map((a) => (
        <line key={a} x1="0" y1="0" x2="0" y2="-44" stroke="#BFE4F5" strokeWidth="1.4" strokeDasharray="4 3"
          transform={`rotate(${a})`} opacity="0.8"/>
      ))}
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <line x1="0" y1="0" x2="0" y2="-40" stroke="#2E7E9E" strokeWidth="3" strokeLinecap="round"/>
          <line x1="0" y1="-24" x2="-9" y2="-32" stroke="#2E7E9E" strokeWidth="2.4" strokeLinecap="round"/>
          <line x1="0" y1="-24" x2="9" y2="-32" stroke="#2E7E9E" strokeWidth="2.4" strokeLinecap="round"/>
        </g>
      ))}
      <circle r="5" fill="#EAF4FA" stroke="#2E7E9E" strokeWidth="2"/>
      <text x="0" y="2" textAnchor="middle" fontSize="6" fontWeight="800" fill="#2E7E9E" fontFamily="'JetBrains Mono', monospace">6</text>
    </g>
  </svg>
);

export default createLesson({
  TOTAL_SCREENS, LESSON_META, SCREEN_META, CONTENT, BRIDGES, S14_PAYOFF,
  STYLES: LESSON_STYLES,
  Scene: LessonScene,
  FactFig: SnowflakeFig,
  figs: { s4: <OneAxisFig/>, s8: <FalseAxisFig/> }
});
